// Module core/link-to-dfn
// Gives definitions in conf.definitionMap IDs and links <a> tags
// to the matching definitions.
import { linkInlineCitations } from "core/data-cite";
import { pub } from "core/pubsubhub";
export const name = "core/link-to-dfn";
export function run(conf, doc, cb) {
  doc.normalize();
  var titles = {};
  Object.keys(conf.definitionMap).forEach(function(title) {
    titles[title] = {};
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
          pub(
            "error",
            "Duplicate definition of '" +
              (dfn_for ? dfn_for + "/" : "") +
              title +
              "'"
          );
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
  });
  $("a:not([href]):not([data-cite]):not(.logo)").each(function() {
    var $ant = $(this);
    if ($ant.hasClass("externalDFN")) return;
    var linkTargets = $ant.linkTargets();
    var foundDfn = linkTargets.some(function(target) {
      if (titles[target.title] && titles[target.title][target.for_]) {
        var dfn = titles[target.title][target.for_];
        if (dfn[0].dataset.cite) {
          $ant[0].dataset.cite = dfn[0].dataset.cite;
        } else {
          const frag = "#" + encodeURIComponent(dfn.prop("id"));
          $ant.attr("href", frag).addClass("internalDFN");
        }
        // add a bikeshed style indication of the type of link
        if (!$ant.attr("data-link-type")) {
          $ant.attr("data-link-type", "dfn");
        }
        // If a definition is <code>, links to it should
        // also be <code>.
        //
        // Note that contents().length===1 excludes
        // definitions that have either other text, or other
        // whitespace, inside the <dfn>.
        if (
          dfn.closest("code,pre").length ||
          (dfn.contents().length === 1 && dfn.children("code").length === 1)
        ) {
          // only add code to IDL when the definition matches
          const term = $ant[0].textContent.trim();
          const isIDL = dfn[0].dataset.hasOwnProperty("idl");
          const isSameText = isIDL
            ? dfn[0].dataset.title === term
            : dfn[0].textContent.trim() === term;
          if (isIDL && !isSameText) {
            return true;
          }
          $ant.wrapInner("<code></code>");
        }
        return true;
      }
      return false;
    });
    if (!foundDfn) {
      // ignore WebIDL
      if (
        !$ant.parents(
          ".idl:not(.extAttr), dl.methods, dl.attributes, dl.constants, dl.constructors, dl.fields, dl.dictionary-members, span.idlMemberType, span.idlTypedefType, div.idlImplementsDesc"
        ).length
      ) {
        var link_for = linkTargets[0].for_;
        var title = linkTargets[0].title;
        this.classList.add("respec-offending-element");
        this.title = "Linking error: not matching <dfn>";
        pub(
          "warn",
          "Found linkless <a> element " +
            (link_for ? "for '" + link_for + "' " : "") +
            "with text '" +
            title +
            "' but no matching `<dfn>`."
        );
        console.warn("Linkless element:", $ant[0]);
        return;
      }
      $ant.replaceWith($ant.contents());
    }
  });
  linkInlineCitations(doc, conf).then(function() {
    // done linking, so clean up
    function attrToDataAttr(name) {
      return function(elem) {
        var value = elem.getAttribute(name);
        elem.removeAttribute(name);
        elem.setAttribute("data-" + name, value);
      };
    }
    var forList = doc.querySelectorAll("*[for]");
    Array.prototype.forEach.call(forList, attrToDataAttr("for"));

    var dfnForList = doc.querySelectorAll("*[dfn-for]");
    Array.prototype.forEach.call(dfnForList, attrToDataAttr("dfn-for"));

    var linkForList = doc.querySelectorAll("*[link-for]");
    Array.prototype.forEach.call(linkForList, attrToDataAttr("link-for"));
    // Added message for legacy compat with Aria specs
    // See https://github.com/w3c/respec/issues/793
    pub("end", "core/link-to-dfn");
    cb();
  });
}
