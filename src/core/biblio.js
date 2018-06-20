// Module core/biblio
// Handles bibliographic references
// Configuration:
//  - localBiblio: override or supplement the official biblio with your own.

/*jshint jquery: true*/
/*globals console*/
import { biblioDB } from "core/biblio-db";
import { createResourceHint, addId } from "core/utils";
import { pub } from "core/pubsubhub";

export const name = "core/biblio";

const bibrefsURL = new URL("https://specref.herokuapp.com/bibrefs?refs=");

// Normative references take precedence over informative ones,
// so any duplicates ones are removed from the informative set.
function normalizeReferences(conf) {
  Array.from(conf.informativeReferences)
    .filter(key => conf.normativeReferences.has(key))
    .forEach(redundantKey => conf.informativeReferences.delete(redundantKey));
}

function getRefKeys(conf) {
  return {
    informativeReferences: Array.from(conf.informativeReferences),
    normativeReferences: Array.from(conf.normativeReferences),
  };
}

const REF_STATUSES = new Map([
  ["CR", "W3C Candidate Recommendation"],
  ["ED", "W3C Editor's Draft"],
  ["FPWD", "W3C First Public Working Draft"],
  ["LCWD", "W3C Last Call Working Draft"],
  ["NOTE", "W3C Note"],
  ["PER", "W3C Proposed Edited Recommendation"],
  ["PR", "W3C Proposed Recommendation"],
  ["REC", "W3C Recommendation"],
  ["WD", "W3C Working Draft"],
  ["WG-NOTE", "W3C Working Group Note"],
]);

const defaultsReference = Object.freeze({
  authors: [],
  date: "",
  href: "",
  publisher: "",
  status: "",
  title: "",
  etAl: false,
});

const endNormalizer = function(endStr) {
  return str => {
    const trimmed = str.trim();
    const result =
      !trimmed || trimmed.endsWith(endStr) ? trimmed : trimmed + endStr;
    return result;
  };
};

const endWithDot = endNormalizer(".");

export function wireReference(rawRef, target = "_blank") {
  if (typeof rawRef !== "object") {
    throw new TypeError("Only modern object references are allowed");
  }
  const ref = Object.assign({}, defaultsReference, rawRef);
  const authors = ref.authors.join("; ") + (ref.etAl ? " et al" : "");
  const status = REF_STATUSES.get(ref.status) || ref.status;
  return hyperHTML.wire(ref)`
    <cite>
      <a
        href="${ref.href}"
        target="${target}"
        rel="noopener noreferrer">
        ${ref.title.trim()}</a>.
    </cite>
    <span class="authors">
      ${endWithDot(authors)}
    </span>
    <span class="publisher">
      ${endWithDot(ref.publisher)}
    </span>
    <span class="pubDate">
      ${endWithDot(ref.date)}
    </span>
    <span class="pubStatus">
      ${endWithDot(status)}
    </span>
  `;
}

export function stringifyReference(ref) {
  if (typeof ref === "string") return ref;
  let output = `<cite>${ref.title}</cite>`;

  output = ref.href ? `<a href="${ref.href}">${output}</a>. ` : `${output}. `;

  if (ref.authors && ref.authors.length) {
    output += ref.authors.join("; ");
    if (ref.etAl) output += " et al";
    output += ".";
  }
  if (ref.publisher) {
    output = `${output} ${endWithDot(ref.publisher)} `;
  }
  if (ref.date) output += ref.date + ". ";
  if (ref.status) output += (REF_STATUSES.get(ref.status) || ref.status) + ". ";
  if (ref.href) output += `URL: <a href="${ref.href}">${ref.href}</a>`;
  return output;
}

function bibref(conf) {
  // this is in fact the bibref processing portion
  const {
    informativeReferences: informs,
    normativeReferences: norms,
  } = getRefKeys(conf);

  if (!informs.length && !norms.length && !conf.refNote) return;
  const refsec = hyperHTML`
    <section id='references' class='appendix'>
      <h2>${conf.l10n.references}</h2>
      ${conf.refNote ? hyperHTML`<p>${conf.refNote}</p>` : ""}
    </section>`;

  for (const type of ["Normative", "Informative"]) {
    const refs = type === "Normative" ? norms : informs;
    if (!refs.length) continue;

    const sec = hyperHTML`
      <section>
        <h3>${
          type === "Normative"
            ? conf.l10n.norm_references
            : conf.l10n.info_references
        }</h3>
      </section>`;
    addId(sec);

    const refObjects = refs.map(getRefContent).reduce(
      (refObjects, ref) => {
        const refType = ref.refcontent ? "goodRefs" : "badRefs";
        refObjects[refType].push(ref);
        return refObjects;
      },
      { goodRefs: [], badRefs: [] }
    );

    const aliases = refObjects.goodRefs.reduce((aliases, ref) => {
      const key = ref.refcontent.id;
      const keys = !aliases.has(key)
        ? aliases.set(key, []).get(key)
        : aliases.get(key);
      keys.push(ref.ref);
      return aliases;
    }, new Map());

    const uniqueRefs = [
      ...refObjects.goodRefs
        .reduce((uniqueRefs, ref) => {
          if (!uniqueRefs.has(ref.refcontent.id)) {
            // the condition ensures that only the first used [[TERM]]
            // shows up in #references section
            uniqueRefs.set(ref.refcontent.id, ref);
          }
          return uniqueRefs;
        }, new Map())
        .values(),
    ];

    const refsToAdd = uniqueRefs
      .concat(refObjects.badRefs)
      .sort((a, b) =>
        a.ref.toLocaleLowerCase().localeCompare(b.ref.toLocaleLowerCase())
      );

    sec.appendChild(hyperHTML`
      <dl class='bibliography'>
        ${refsToAdd.map(showRef)}
      </dl>`);
    refsec.appendChild(sec);

    // fix biblio reference URLs
    uniqueRefs
      .map(({ ref, refcontent }) => {
        const refUrl = "#bib-" + ref.toLowerCase();
        const selectors = aliases
          .get(refcontent.id)
          .map(alias => `a.bibref[href="#bib-${alias.toLowerCase()}"]`)
          .join(",");
        const elems = document.querySelectorAll(selectors);
        return { refUrl, elems };
      })
      .forEach(({ refUrl, elems }) => {
        elems.forEach(a => a.setAttribute("href", refUrl));
      });

    // warn about bad references
    refObjects.badRefs.forEach(({ ref }) => {
      const badrefs = [
        ...document.querySelectorAll(
          `a.bibref[href="#bib-${ref.toLowerCase()}"]`
        ),
      ].filter(({ textContent: t }) => t.toLowerCase() === ref.toLowerCase());
      const msg = `Bad reference: [\`${ref}\`] (appears ${
        badrefs.length
      } times)`;
      pub("error", msg);
      console.warn("Bad references: ", badrefs);
    });
  }

  document.body.appendChild(refsec);

  /**
   * returns refcontent and unique key for a reference among its aliases
   * and warns about circular references
   * @param {String} ref
   */
  function getRefContent(ref) {
    let refcontent = conf.biblio[ref];
    let key = ref;
    const circular = new Set([key]);
    while (refcontent && refcontent.aliasOf) {
      if (circular.has(refcontent.aliasOf)) {
        refcontent = null;
        const msg = `Circular reference in biblio DB between [\`${ref}\`] and [\`${key}\`].`;
        pub("error", msg);
      } else {
        key = refcontent.aliasOf;
        refcontent = conf.biblio[key];
        circular.add(key);
      }
    }
    if (refcontent && !refcontent.id) {
      refcontent.id = ref.toLowerCase();
    }
    return { ref, refcontent };
  }

  // renders a reference
  function showRef({ ref, refcontent }) {
    const refId = "bib-" + ref.toLowerCase();
    if (refcontent) {
      return hyperHTML`
        <dt id="${refId}">[${ref}]</dt>
        <dd>${{ html: stringifyReference(refcontent) }}</dd>
      `;
    } else {
      return hyperHTML`
        <dt id="${refId}">[${ref}]</dt>
        <dd><em class="respec-offending-element">Reference not found.</em></dd>
      `;
    }
  }
}
// Opportunistically dns-prefetch to bibref server, as we don't know yet
// if we will actually need to download references yet.
var link = createResourceHint({
  hint: "dns-prefetch",
  href: bibrefsURL.origin,
});
document.head.appendChild(link);
let doneResolver;
export const done = new Promise(resolve => {
  doneResolver = resolve;
});

async function updateFromNetwork(refs, options = { forceUpdate: false }) {
  // Update database if needed, if we are online
  if (!refs.length || navigator.onLine === false) {
    return;
  }
  let response;
  const refsToFetch = [...new Set(refs)];
  try {
    response = await fetch(bibrefsURL.href + refsToFetch.join(","));
  } catch (err) {
    console.error(err);
    return null;
  }
  if ((!options.forceUpdate && !response.ok) || response.status !== 200) {
    return null;
  }
  const data = await response.json();
  try {
    await biblioDB.addAll(data);
  } catch (err) {
    console.error(err);
  }
  return data;
}

export async function resolveRef(key) {
  const biblio = await done;
  if (!biblio.hasOwnProperty(key)) {
    return null;
  }
  const entry = biblio[key];
  if (entry.aliasOf) {
    return await resolveRef(entry.aliasOf);
  }
  return entry;
}

export async function run(conf, doc, cb) {
  const finish = () => {
    doneResolver(conf.biblio);
    cb();
  };
  if (!conf.localBiblio) {
    conf.localBiblio = {};
  }
  if (conf.biblio) {
    let msg = "Overriding `.biblio` in config. Please use ";
    msg += "`.localBiblio` for custom biblio entries.";
    pub("warn", msg);
  }
  conf.biblio = {};
  const localAliases = Array.from(Object.keys(conf.localBiblio))
    .filter(key => conf.localBiblio[key].hasOwnProperty("aliasOf"))
    .map(key => conf.localBiblio[key].aliasOf);
  normalizeReferences(conf);
  const allRefs = getRefKeys(conf);
  const neededRefs = allRefs.normativeReferences
    .concat(allRefs.informativeReferences)
    // Filter, as to not go to network for local refs
    .filter(key => !conf.localBiblio.hasOwnProperty(key))
    // but include local aliases, in case they refer to external specs
    .concat(localAliases)
    // remove duplicates
    .reduce((collector, item) => {
      if (collector.indexOf(item) === -1) {
        collector.push(item);
      }
      return collector;
    }, [])
    .sort();
  const idbRefs = [];

  // See if we have them in IDB
  try {
    await biblioDB.ready; // can throw
    const promisesToFind = neededRefs.map(async id => ({
      id,
      data: await biblioDB.find(id),
    }));
    idbRefs.push(...(await Promise.all(promisesToFind)));
  } catch (err) {
    // IndexedDB died, so we need to go to the network for all
    // references
    idbRefs.push(...neededRefs.map(id => ({ id, data: null })));
    console.warn(err);
  }
  const split = { hasData: [], noData: [] };
  idbRefs.reduce((collector, ref) => {
    ref.data ? collector.hasData.push(ref) : collector.noData.push(ref);
    return collector;
  }, split);
  split.hasData.reduce((collector, ref) => {
    collector[ref.id] = ref.data;
    return collector;
  }, conf.biblio);
  const externalRefs = split.noData.map(item => item.id);
  if (externalRefs.length) {
    // Going to the network for refs we don't have
    const data = await updateFromNetwork(externalRefs, { forceUpdate: true });
    Object.assign(conf.biblio, data);
  }
  Object.assign(conf.biblio, conf.localBiblio);
  bibref(conf);
  finish();
  await updateFromNetwork(neededRefs);
}
