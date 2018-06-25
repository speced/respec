// Module core/render-biblio
// renders the biblio data pre-processed in core/biblio

import "deps/hyperhtml";
import { addId } from "core/utils";
import { pub } from "core/pubsubhub";
import { stringifyReference } from "core/biblio";

export const name = "core/render-biblio";

export function run(conf) {
  const informs = Array.from(conf.informativeReferences);
  const norms = Array.from(conf.normativeReferences);

  if (!informs.length && !norms.length && !conf.refNote) return;

  const refsec = hyperHTML`
    <section id='references' class='appendix'>
      <h2>${conf.l10n.references}</h2>
      ${conf.refNote ? hyperHTML`<p>${conf.refNote}</p>` : ""}
    </section>`;

  const toRefContent = getRefContent(conf);

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

    const { goodRefs, badRefs } = refs.map(toRefContent).reduce(
      (refObjects, ref) => {
        const refType = ref.refcontent ? "goodRefs" : "badRefs";
        refObjects[refType].push(ref);
        return refObjects;
      },
      { goodRefs: [], badRefs: [] }
    );

    const uniqueRefs = [
      ...goodRefs
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

    const refsToShow = uniqueRefs
      .concat(badRefs)
      .sort((a, b) =>
        a.ref.toLocaleLowerCase().localeCompare(b.ref.toLocaleLowerCase())
      );

    sec.appendChild(hyperHTML`
      <dl class='bibliography'>
        ${refsToShow.map(showRef)}
      </dl>`);
    refsec.appendChild(sec);

    const aliases = getAliases(goodRefs);
    fixRefUrls(uniqueRefs, aliases);
    warnBadRefs(badRefs);
  }

  document.body.appendChild(refsec);
}

/**
 * returns refcontent and unique key for a reference among its aliases
 * and warns about circular references
 * @param {String} ref
 */
function getRefContent(conf) {
  return function(ref) {
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
  };
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

// get aliases for a reference "key"
function getAliases(refs) {
  return refs.reduce((aliases, ref) => {
    const key = ref.refcontent.id;
    const keys = !aliases.has(key)
      ? aliases.set(key, []).get(key)
      : aliases.get(key);
    keys.push(ref.ref);
    return aliases;
  }, new Map());
}

// fix biblio reference URLs
function fixRefUrls(refs, aliases) {
  refs
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
}

// warn about bad references
function warnBadRefs(badRefs) {
  badRefs.forEach(({ ref }) => {
    const badrefs = [
      ...document.querySelectorAll(
        `a.bibref[href="#bib-${ref.toLowerCase()}"]`
      ),
    ].filter(({ textContent: t }) => t.toLowerCase() === ref.toLowerCase());
    const msg = `Bad reference: [\`${ref}\`] (appears ${badrefs.length} times)`;
    pub("error", msg);
    console.warn("Bad references: ", badrefs);
  });
}
