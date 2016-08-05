// Module core/structure
//  Handles producing the ToC and numbering sections across the document.

// LIMITATION:
//  At this point we don't support having more than 26 appendices.
// CONFIGURATION:
//  - noTOC: if set to true, no TOC is generated and sections are not numbered
//  - tocIntroductory: if set to true, the introductory material is listed in the TOC
//  - lang: can change the generated text (supported: en, fr)
//  - maxTocLevel: only generate a TOC so many levels deep
"use strict";
define(
  [],
  function() {
    var secMap = {};
    var appendixMode = false;
    var lastNonAppendix = 0;
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    function makeTOCAtLevel($parent, doc, current, level, conf) {
      var $secs = $parent.children(conf.tocIntroductory ? "section" : "section:not(.introductory)");
      if ($secs.length === 0) {
        return null;
      }
      var $ol = $("<ol class='toc'></ol>");
      for (var i = 0; i < $secs.length; i++) {
        var $sec = $($secs[i], doc);
        var isIntro = $sec.hasClass("introductory");
        var noToc = $sec.hasClass("notoc");
        if (!$sec.children().length || noToc) {
          continue;
        }
        var h = $sec.children()[0],
          ln = h.localName.toLowerCase();
        if (ln !== "h2" && ln !== "h3" && ln !== "h4" && ln !== "h5" && ln !== "h6") {
          continue;
        }
        var title = h.textContent,
          $kidsHolder = $("<div></div>").append($(h).contents().clone());
        $kidsHolder.find("a").renameElement("span").attr("class", "formerLink").removeAttr("href");
        $kidsHolder.find("dfn").renameElement("span").removeAttr("id");
        var id = h.id ? h.id : $sec.makeID(null, title);

        if (!isIntro) {
          current[current.length - 1]++;
        }
        var secnos = current.slice();
        if ($sec.hasClass("appendix") && current.length === 1 && !appendixMode) {
          lastNonAppendix = current[0];
          appendixMode = true;
        }
        if (appendixMode){
          secnos[0] = alphabet.charAt(current[0] - lastNonAppendix);
        }
        var secno = secnos.join("."),
          isTopLevel = secnos.length == 1;
        if (isTopLevel) {
          secno = secno + ".";
          // if this is a top level item, insert
          // an OddPage comment so html2ps will correctly
          // paginate the output
          $(h).before(document.createComment("OddPage"));
        }
        var $span = $("<span class='secno'></span>").text(secno + " ");
        if (!isIntro) {
          $(h).prepend($span);
        }
        secMap[id] = (isIntro ? "" : "<span class='secno'>" + secno + "</span> ") +
          "<span class='sec-title'>" + title + "</span>";

        var $a = $("<a/>").attr({ href: "#" + id, "class": "tocxref" })
          .append(isIntro ? "" : $span.clone())
          .append($kidsHolder.contents());
        var $item = $("<li class='tocline'/>").append($a);
        if (conf.maxTocLevel === 0 || level <= conf.maxTocLevel) $ol.append($item);
        current.push(0);
        var $sub = makeTOCAtLevel($sec, doc, current, level + 1, conf);
        if ($sub) {
          $item.append($sub);
        }
        current.pop();
      }
      return $ol;
    }

    return {
      run: function(conf, doc, cb) {
        if ("tocIntroductory" in conf === false) {
          conf.tocIntroductory = false;
        }
        if ("maxTocLevel" in conf === false) {
          conf.maxTocLevel = 0;
        }
        var $secs = $("section:not(.introductory)", doc)
          .find("h1:first, h2:first, h3:first, h4:first, h5:first, h6:first");
        if (!$secs.length) {
          return cb();
        }
        $secs.each(function() {
          var depth = $(this).parents("section").length + 1;
          if (depth > 6) depth = 6;
          var h = "h" + depth;
          if (this.localName.toLowerCase() != h) $(this).renameElement(h);
        });

        // makeTOC
        if (!conf.noTOC) {
          var $ol = makeTOCAtLevel($("body", doc), doc, [0], 1, conf);
          if (!$ol) return;
          var nav = doc.createElement("nav");
          nav.id = "toc";
          nav.innerHTML = "<h2 class='introductory'>" + conf.l10n.toc + "</h2>";
          nav.appendChild($ol[0]);
          var $ref = $("#toc", doc);
          var replace = false;
          if ($ref.length) {
            replace = true;
          }
          if (!$ref.length) {
            $ref = $("#sotd", doc);
          }
          if (!$ref.length) {
            $ref = $("#abstract", doc);
          }
          if (replace) {
            $ref.replaceWith(nav);
          } else {
            $ref.after(nav);
          }

          var $link = $("<p role='navigation' id='back-to-top'><a href='#toc'><abbr title='Back to Top'>&uarr;</abbr></a></p>");
          $("body").append($link);
        }

        // Update all anchors with empty content that reference a section ID
        $("a[href^='#']:not(.tocxref)", doc).each(function() {
          var $a = $(this);
          if ($a.html() !== "") return;
          var id = $a.attr("href").slice(1);
          if (secMap[id]) {
            $a.addClass("sec-ref");
            $a.html(($a.hasClass("sectionRef") ? "section " : "") + secMap[id]);
          }
        });

        cb();
      }
    };
  }
);
