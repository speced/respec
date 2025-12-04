// Module pcisig/link-to-dfn
// Gives definitions in conf.definitionMap IDs and links <a> tags
// to the matching definitions.
// Modified from core/link-to-dfn.js to remove requirements that only data-for happens for webIDL
import { run as runDataCite } from "../core/data-cite.js";
import { pub } from "../core/pubsubhub.js";

export const name = "pcisig/link-to-dfn";

function ref_to(dfn) {
  const dfn_id = dfn.attr("id");
  return (dfn_id !== undefined) ? ("<a href=\"#" + encodeURIComponent(dfn_id) + "\">" + dfn_id + "</a>") : "";
}

export function run(conf, doc, cb) {
  doc.normalize();
  let titles = {};
  Object.keys(conf.definitionMap).forEach(function (title) {
    titles[title] = {};
    conf.definitionMap[title].forEach(function (dfn) {
      if (dfn.attr("id") === undefined) {
        dfn.makeID("dfn", title);
      }
      const dfn_for = dfn.attr("data-dfn-for") || "";
      if (dfn_for in titles[title]) {
        // Only complain if the user provides 2 <dfn>s for the same term.
        const error_msg = "Duplicate definition of '" + (dfn_for ? dfn_for + "/" : "") + title + "' "
          + ref_to(dfn) + " and " + ref_to(titles[title][dfn_for]);
        pub("error", error_msg);
        dfn.after("<span class=\"respec-error\"> {{ " + error_msg + " }} </span>");
        // keep first definition
        return;
      }
      titles[title][dfn_for] = dfn;
    });
    if (conf.definitionMap[title].length === 1) {
      titles[title][""] = conf.definitionMap[title][0];    // don't require data-for unless it's ambiguous
    }

  });

  $("a:not([href]):not([data-cite]):not(.logo)").each(function () {
    let $ant = $(this);
    if ($ant.hasClass("externalDFN")) return;
    console.log("link-to-dfn:" + $ant.html());
    let linkTargets = $ant.linkTargets();
    let foundDfn = linkTargets.some(function (target) {
      console.log("  linkTarget.title = '" + target.title + "' linkTarget.for_='" + target.for_ + "'");
      if (titles[target.title] && titles[target.title][target.for_]) {
        let dfn = titles[target.title][target.for_];
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
      let link_for = linkTargets[0].for_;
      let title = linkTargets[0].title;
      this.classList.add("respec-offending-element");
      this.title = "Linking error: no matching &lt;dfn&gt;";
      const error_msg = "Found linkless <a> element " +
        (link_for ? "for '" + link_for + "' " : "") +
        "with text '" +
        title +
        "' but no matching <dfn>.";
      pub("warn", error_msg);
      $ant.makeID("error", error_msg);
      console.warn("Linkless element:", $ant[0]);
      //console.warn("Linkless Element Reference: "$("<span class=\"respec-error\"><a href=\"#" + $ant.attr("id") + "\">" + $ant.attr("id") + "</a></span>"));
    }
  });

  runDataCite().then(function () {
    // done linking, so clean up
    function attrToDataAttr(name) {
      return function (elem) {
        let value = elem.getAttribute(name);
        elem.removeAttribute(name);
        elem.setAttribute("data-" + name, value);
      };
    }

    let forList = doc.querySelectorAll("*[for]");
    Array.prototype.forEach.call(forList, attrToDataAttr("for"));

    let dfnForList = doc.querySelectorAll("*[dfn-for]");
    Array.prototype.forEach.call(dfnForList, attrToDataAttr("dfn-for"));

    let linkForList = doc.querySelectorAll("*[link-for]");
    Array.prototype.forEach.call(linkForList, attrToDataAttr("link-for"));

    if (conf.addDefinitionMap) {
      pub("start", "core/dfn/addDefinitionMap");
      let $mapsec = $("<section id='definition-map' class='introductory appendix'><h2>Definition Map</h2></section>").appendTo($("body"));
      let $tbody = $("<table class='data'><thead><tr><th>dfn</th><th>data-dfn-type</th><th>data-dfn-for</th><th>id</th></tr></thead><tbody/></table>").appendTo($mapsec).children("tbody");
      Object.keys(conf.definitionMap).sort().forEach(function (k) {
        conf.definitionMap[k].forEach(function (f) {
          $("<tr>" +
            "<td class='long'>" + k + "</td>" +
            "<td class='long'>" + f.attr("data-dfn-type") + "</td>" +
            "<td class='long'>" + f.attr("data-dfn-for") + "</td>" +
            "<td class='long'><a href=\"" + "#" + f.attr("id") + "\">" + f.attr("id") + "</a></td>" +
            "</tr>").appendTo($tbody);
        });
      });
    }

    if (conf.addDefinitionMap2) {
      let $mapsec2 = $("<section id='definition-map-2' class='introductory appendix'><h2>Definition Map 2</h2></section>").appendTo($("body"));
      let $tbody2 = $("<table class='data'><thead><tr><th>dfn</th><th>data-dfn-for</th><th>id</th></tr></thead><tbody/></table>").appendTo($mapsec2).children("tbody");
      Object.keys(titles).sort().forEach(function (title) {
        Object.keys(titles[title]).forEach(function (for_) {
          let item = titles[title][for_];
          $("<tr>" +
            "<td class='long'>" + title + "</td>" +
            "<td class='long'>" + for_ + "</td>" +
            "<td class='long'><a href=\"" + "#" + item.attr("id") + "\">" + item.attr("id") + "</a></td>" +
            "</tr>").appendTo($tbody2);
        });
      });
      pub("end", "core/dfn/addDefinitionMap");
    }

    cb();
  })
  ;
}
