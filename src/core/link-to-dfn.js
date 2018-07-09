// Module core/link-to-dfn
// Gives definitions in conf.definitionMap IDs and links <a> tags
// to the matching definitions.
import { linkInlineCitations } from "core/data-cite";
import { pub } from "core/pubsubhub";
import { lang as defaultLang } from "./l10n";
import { run as addExternalReferences } from "core/xref";
export const name = "core/link-to-dfn";
const l10n = {
  en: {
    duplicate: "This is defined more than once in the document.",
  },
};
const lang = defaultLang in l10n ? defaultLang : "en";

export async function run(conf, doc, cb) {
  doc.normalize();
  var titles = {};
  Object.keys(conf.definitionMap).forEach(function(title) {
    titles[title] = {};
    var listOfDuplicateDfns = [];
    conf.definitionMap[title].forEach(function(dfn) {
      if (dfn.attr("data-idl") === undefined) {
        // Non-IDL definitions aren't "for" an interface.
        dfn.removeAttr("data-dfn-for");
      }
      var dfn_for = dfn.attr("data-dfn-for") || "";
      if (dfn_for in titles[title]) {
        // We want <dfn> definitions to take precedence over
        // definitions from WebIDL. WebIDL definitions wind
        // up as <span>s instead of <dfn>.
        var oldIsDfn = titles[title][dfn_for].filter("dfn").length !== 0;
        var newIsDfn = dfn.filter("dfn").length !== 0;
        if (oldIsDfn && newIsDfn) {
          // Only complain if the user provides 2 <dfn>s
          // for the same term.
          dfn.addClass("respec-offending-element");
          if (dfn.attr("title") === undefined) {
            dfn.attr("title", l10n[lang].duplicate);
          }
          if (dfn.attr("id") === undefined) {
            dfn.makeID(null, title);
          }
          listOfDuplicateDfns.push(dfn[0]);
        }
        if (oldIsDfn) {
          // Don't overwrite <dfn> definitions.
          return;
        }
      }
      titles[title][dfn_for] = dfn;
      if (dfn.attr("id") === undefined) {
        if (dfn.attr("data-idl")) {
          dfn.makeID("dom", (dfn_for ? dfn_for + "-" : "") + title);
        } else {
          dfn.makeID("dfn", title);
        }
      }
    });
    if (listOfDuplicateDfns.length > 0) {
      const dfnsList = listOfDuplicateDfns
        .map((elem, i) => {
          return `[${i + 1}](#${elem.id})`;
        })
        .join(", ");
      pub("error", `Duplicate definitions of '${title}' at: ${dfnsList}.`);
    }
  });

  const possibleExternalLinks = [];

  const localLinkSelector =
    "a[data-cite=''], a:not([href]):not([data-cite]):not(.logo)";
  $(localLinkSelector).each(function() {
    const $ant = $(this);
    const ant = $ant[0];
    if (ant.classList.contains("externalDFN")) return;
    const linkTargets = $ant.linkTargets();
    const foundDfn = linkTargets.some(function(target) {
      if (titles[target.title] && titles[target.title][target.for]) {
        const $dfn = titles[target.title][target.for];
        const dfn = $dfn[0];
        const lt = dfn.dataset.lt ? dfn.dataset.lt.split("|") : [];
        const plurals = dfn.dataset.plurals
          ? dfn.dataset.plurals.split("|")
          : [];
        const txt = ant.textContent.toLowerCase();
        if (dfn.dataset.cite) {
          ant.dataset.cite = dfn.dataset.cite;
        } else if (conf.xref && (lt.includes(txt) || plurals.includes(txt))) {
          ant.dataset.dfnType = "xref";
          // data-lt[0] serves as unique id for the dfn which this element references
          ant.dataset.xref = lt[0];
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
        // Note that contents().length===1 excludes
        // definitions that have either other text, or other
        // whitespace, inside the <dfn>.
        // TODO: un-jquery-fy
        if (
          dfn.closest("code,pre") ||
          ($dfn.contents().length === 1 &&
            [...dfn.children].filter(c => c.localName === "code").length === 1)
        ) {
          // only add code to IDL when the definition matches
          const term = ant.textContent.trim();
          const isIDL = dfn.dataset.hasOwnProperty("idl");
          const isSameText = isIDL
            ? dfn.dataset.title === term
            : dfn.textContent.trim() === term;
          if (isIDL && !isSameText) {
            return true;
          }
          $ant.wrapInner("<code></code>");
        }
        return true;
      }
      return false;
    });
    if (!foundDfn && linkTargets.length !== 0) {
      // ignore WebIDL
      if (
        !$ant.parents(
          ".idl:not(.extAttr), dl.methods, dl.attributes, dl.constants, dl.constructors, dl.fields, dl.dictionary-members, span.idlMemberType, span.idlTypedefType, div.idlImplementsDesc"
        ).length
      ) {
        if (ant.dataset.dfnType !== "xref") {
          possibleExternalLinks.push(ant);
        }
        return;
      }
      $ant.replaceWith($ant.contents());
    }
  });

  const additionalExternalLinks = [
    // These are additional references that need to be looked up externally.
    // The `possibleExternalLinks` above doesn't include references that
    //   match selectors like `a[data-cite="spec"]`
    ...document.querySelectorAll(
      "a[data-cite]:not([data-cite='']):not([data-cite*='#']), " +
        "dfn:not([data-cite='']):not([data-cite*='#'])"
    ),
  ].filter(el => {
    const closest = el.closest("[data-cite]");
    return !closest || closest.dataset.cite !== "";
  });

  if (conf.xref) {
    possibleExternalLinks.push(...additionalExternalLinks);
    try {
      await addExternalReferences(conf, possibleExternalLinks);
    } catch (error) {
      console.error(error);
      handleXrefFail(possibleExternalLinks);
    }
  } else {
    handleXrefFail(possibleExternalLinks);
  }

  linkInlineCitations(doc, conf).then(() => {
    // Added message for legacy compat with Aria specs
    // See https://github.com/w3c/respec/issues/793
    pub("end", "core/link-to-dfn");
    cb();
  });
}

function handleXrefFail(elems) {
  elems.forEach(elem => {
    elem.classList.add("respec-offending-element");
    elem.title = "Linking error: not matching <dfn>";
    pub(
      "warn",
      `Found linkless \`<a>\` element with text "${
        elem.textContent
      }" but no matching \`<dfn>\`.`
    );
    console.warn("Linkless element:", elem);
  });
}
