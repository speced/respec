// Module core/biblio
// Handles bibliographic references
// Configuration:
//  - localBiblio: override or supplement the official biblio with your own.

/*jshint jquery: true*/
/*globals console*/
import "deps/regenerator";
import { biblioDB } from "core/biblio-db";
import { createResourceHint } from "core/utils";
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
  if (ref.href) {
    output = `<a href="${ref.href}">${output}</a>. `;
  }
  if (ref.authors && ref.authors.length) {
    output += ref.authors.join("; ");
    if (ref.etAl) output += " et al";
    output += ".";
  }
  if (ref.publisher) {
    const publisher = ref.publisher + (/\.$/.test(ref.publisher) ? "" : ".");
    output = `${output} ${publisher} `;
  }
  if (ref.date) output += ref.date + ". ";
  if (ref.status) output += (REF_STATUSES.get(ref.status) || ref.status) + ". ";
  if (ref.href) output += `URL: <a href="${ref.href}">${ref.href}</a>`;
  return output;
}

function bibref(conf) {
  // this is in fact the bibref processing portion
  var badrefs = {};
  var refKeys = getRefKeys(conf);
  var informs = refKeys.informativeReferences;
  var norms = refKeys.normativeReferences;
  var aliases = {};

  if (!informs.length && !norms.length && !conf.refNote) return;
  var $refsec = $(
    "<section id='references' class='appendix'><h2>" +
      conf.l10n.references +
      "</h2></section>"
  ).appendTo($("body"));
  if (conf.refNote) $("<p></p>").html(conf.refNote).appendTo($refsec);

  var types = ["Normative", "Informative"];
  for (var i = 0; i < types.length; i++) {
    var type = types[i];
    var refs = type === "Normative" ? norms : informs;
    var l10nRefs =
      type === "Normative"
        ? conf.l10n.norm_references
        : conf.l10n.info_references;
    if (!refs.length) continue;
    var $sec = $("<section><h3></h3></section>")
      .appendTo($refsec)
      .find("h3")
      .text(l10nRefs)
      .end();
    $sec.makeID(null, type + " references");
    refs.sort();
    var $dl = $("<dl class='bibliography'></dl>").appendTo($sec);
    if (conf.doRDFa) $dl.attr("resource", "");
    for (var j = 0; j < refs.length; j++) {
      var ref = refs[j];
      $("<dt></dt>")
        .attr({ id: "bib-" + ref })
        .text("[" + ref + "]")
        .appendTo($dl);
      var $dd = $("<dd></dd>").appendTo($dl);
      var refcontent = conf.biblio[ref];
      var circular = {};
      var key = ref;
      circular[ref] = true;
      while (refcontent && refcontent.aliasOf) {
        if (circular[refcontent.aliasOf]) {
          refcontent = null;
          const msg = `Circular reference in biblio DB between [\`${ref}\`] and [\`${key}\`].`;
          pub("error", msg);
        } else {
          key = refcontent.aliasOf;
          refcontent = conf.biblio[key];
          circular[key] = true;
        }
      }
      aliases[key] = aliases[key] || [];
      if (aliases[key].indexOf(ref) < 0) aliases[key].push(ref);
      if (refcontent) {
        $dd.html(stringifyReference(refcontent) + "\n");
        if (conf.doRDFa) {
          var $a = $dd.children("a");
          $a.attr(
            "property",
            type === "Normative" ? "dc:requires" : "dc:references"
          );
        }
      } else {
        if (!badrefs[ref]) badrefs[ref] = 0;
        badrefs[ref]++;
        $dd.html("<em style='color: #f00'>Reference not found.</em>\n");
      }
    }
  }
  for (var k in aliases) {
    if (aliases[k].length > 1) {
      let msg = `[${k}] is referenced in ${aliases[k].length} ways: `;
      msg += `(${aliases[k].map(item => `'${item}'`).join(", ")}). This causes`;
      msg += ` duplicate entries in the References section.`;
      pub("warn", msg);
    }
  }
  for (var item in badrefs) {
    const msg = `Bad reference: [\`${item}\`] (appears ${badrefs[item]} times)`;
    if (badrefs.hasOwnProperty(item)) pub("error", msg);
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
  try {
    response = await fetch(bibrefsURL.href + refs.join(","));
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
