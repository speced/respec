// Module core/link-to-dfn
// Gives definitions in conf.definitionMap IDs and links <a> tags
// to the matching definitions.
import {
  addId,
  getLinkTargets,
  showInlineError,
  showInlineWarning,
  wrapInner,
} from "./utils";
import { run as addExternalReferences } from "./xref";
import { lang as defaultLang } from "./l10n";
import { linkInlineCitations } from "./data-cite";
import { pub } from "./pubsubhub";
export const name = "core/link-to-dfn";
const l10n = {
  en: {
    duplicate: "This is defined more than once in the document.",
  },
};
const lang = defaultLang in l10n ? defaultLang : "en";

export async function run(conf) {
  document.normalize();
  const titles = {};
  Object.keys(conf.definitionMap).forEach(title => {
    titles[title] = {};
    const listOfDuplicateDfns = [];
    conf.definitionMap[title].forEach(dfn => {
      if (dfn.dataset.idl === undefined) {
        // Non-IDL definitions aren't "for" an interface.
        delete dfn.dataset.dfnFor;
      }
      const { dfnFor = "" } = dfn.dataset;
      if (dfnFor in titles[title]) {
        // We want <dfn> definitions to take precedence over
        // definitions from WebIDL. WebIDL definitions wind
        // up as <span>s instead of <dfn>.
        const oldIsDfn = titles[title][dfnFor].localName === "dfn";
        const newIsDfn = dfn.localName === "dfn";
        if (oldIsDfn) {
          if (!newIsDfn) {
            // Don't overwrite <dfn> definitions.
            return;
          }
          listOfDuplicateDfns.push(dfn);
        }
      }
      titles[title][dfnFor] = dfn;
      if (!dfn.id) {
        if (dfn.dataset.idl) {
          addId(dfn, "dom", (dfnFor ? dfnFor + "-" : "") + title);
        } else {
          addId(dfn, "dfn", title);
        }
      }
    });
    if (listOfDuplicateDfns.length > 0) {
      showInlineError(
        listOfDuplicateDfns,
        `Duplicate definitions of '${title}'`,
        l10n[lang].duplicate
      );
    }
  });

  const possibleExternalLinks = [];
  const badLinks = [];

  const localLinkSelector =
    "a[data-cite=''], a:not([href]):not([data-cite]):not(.logo)";
  document.querySelectorAll(localLinkSelector).forEach(ant => {
    if (ant.classList.contains("externalDFN")) return;
    const linkTargets = getLinkTargets(ant);
    const { linkFor } = ant.dataset;
    const foundDfn = linkTargets.some(target => {
      if (titles[target.title] && titles[target.title][target.for]) {
        const dfn = titles[target.title][target.for];
        if (dfn.dataset.cite) {
          ant.dataset.cite = dfn.dataset.cite;
        } else if (linkFor && !titles[linkFor.toLowerCase()]) {
          possibleExternalLinks.push(ant);
        } else if (dfn.classList.contains("externalDFN")) {
          // data-lt[0] serves as unique id for the dfn which this element references
          const lt = dfn.dataset.lt ? dfn.dataset.lt.split("|") : [];
          ant.dataset.lt = lt[0] || dfn.textContent;
          possibleExternalLinks.push(ant);
        } else {
          ant.href = "#" + dfn.id;
          ant.classList.add("internalDFN");
        }
        // add a bikeshed style indication of the type of link
        if (!ant.hasAttribute("data-link-type")) {
          ant.dataset.linkType = "dfn";
        }
        // If a definition is <code>, links to it should
        // also be <code>.
        //
        // Note that childNodes.length === 1 excludes
        // definitions that have either other text, or other
        // whitespace, inside the <dfn>.
        if (
          dfn.closest("code,pre") ||
          (dfn.childNodes.length === 1 &&
            [...dfn.children].filter(c => c.localName === "code").length === 1)
        ) {
          // only add code to IDL when the definition matches
          const term = ant.textContent.trim();
          const isIDL = dfn.dataset.hasOwnProperty("idl");
          const { dataset } = dfn;
          let needsCode = false;
          if (dfn.textContent.trim() === term) {
            needsCode = true;
          } else if (dataset.title === term) {
            needsCode = true;
          } else if (dataset.lt) {
            needsCode = dataset.lt.split("|").includes(term.toLowerCase());
          }
          if (isIDL && !needsCode) {
            return true;
          }
          wrapInner(ant, document.createElement("code"));
        }
        return true;
      }
      return false;
    });
    if (!foundDfn && linkTargets.length !== 0) {
      // ignore WebIDL
      if (!ant.closest("pre.idl")) {
        if (ant.dataset.cite === "") {
          badLinks.push(ant);
        } else {
          possibleExternalLinks.push(ant);
        }
        return;
      }
      ant.replaceWith(...ant.childNodes);
    }
  });

  showLinkingError(badLinks);

  // These are additional references that need to be looked up externally.
  // The `possibleExternalLinks` above doesn't include references that match selectors like
  //   a[data-cite="spec"], dfn[data-cite="spec"], dfn.externalDFN
  const additionalExternalLinks = [
    ...document.querySelectorAll(
      "a[data-cite]:not([data-cite='']):not([data-cite*='#']), " +
        "dfn[data-cite]:not([data-cite='']):not([data-cite*='#'])"
    ),
  ]
    .filter(el => {
      const closest = el.closest("[data-cite]");
      return !closest || closest.dataset.cite !== "";
    })
    .concat([...document.querySelectorAll("dfn.externalDFN")]);

  if (conf.xref) {
    possibleExternalLinks.push(...additionalExternalLinks);
    try {
      await addExternalReferences(conf, possibleExternalLinks);
    } catch (error) {
      console.error(error);
      showLinkingError(possibleExternalLinks);
    }
  } else {
    showLinkingError(possibleExternalLinks);
  }

  await linkInlineCitations(document, conf);
  // Added message for legacy compat with Aria specs
  // See https://github.com/w3c/respec/issues/793
  pub("end", "core/link-to-dfn");
}

function showLinkingError(elems) {
  elems.forEach(elem => {
    showInlineWarning(
      elem,
      `Found linkless \`<a>\` element with text "${
        elem.textContent
      }" but no matching \`<dfn>\``,
      "Linking error: not matching <dfn>"
    );
  });
}
