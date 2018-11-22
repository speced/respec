// Module core/figure
// Handles figures in the document.
// Adds width and height to images, if they are missing.
// Generates a Table of Figures wherever there is a #tof element.

import { pub } from "./pubsubhub";

export const name = "core/figures";

export function run(conf) {
  normalizeImages(document);
  // process all figures
  const figMap = {};
  const tof = [];
  let num = 0;
  $("figure").each(function() {
    const $fig = $(this);
    const $cap = $fig.find("figcaption");
    const tit = $cap.text();
    const id = $fig.makeID("fig", tit);
    if (!$cap.length)
      pub("warn", "A `<figure>` should contain a `<figcaption>`.");

    // set proper caption title
    num++;
    $cap
      .wrapInner($("<span class='fig-title'/>"))
      .prepend(document.createTextNode(" "))
      .prepend($("<span class='figno'>" + num + "</span>"))
      .prepend(document.createTextNode(conf.l10n.fig));
    figMap[id] = $cap.contents();
    const $tofCap = $cap.clone();
    $tofCap
      .find("a")
      .renameElement("span")
      .removeAttr("href");
    tof.push(
      $("<li class='tofline'><a class='tocxref' href='#" + id + "'></a></li>")
        .find(".tocxref")
        .append($tofCap.contents())
        .end()
    );
  });

  // Update all anchors with empty content that reference a figure ID
  $("a[href]").each(function() {
    const $a = $(this);
    let id = $a.attr("href");
    if (!id) return;
    id = id.substring(1);
    if (figMap[id]) {
      $a.addClass("fig-ref");
      if ($a.html() === "") {
        const $shortFigDescriptor = figMap[id].slice(0, 2).clone();
        if (!$a[0].hasAttribute("title")) {
          const longFigDescriptor = figMap[id]
            .slice(2)
            .clone()
            .text();
          $a.attr("title", longFigDescriptor.trim());
        }
        $a.append($shortFigDescriptor);
      }
    }
  });

  // Create a Table of Figures if a section with id 'tof' exists.
  const $tof = $("#tof");
  if (tof.length && $tof.length) {
    // if it has a parent section, don't touch it
    // if it has a class of appendix or introductory, don't touch it
    // if all the preceding section siblings are introductory, make it introductory
    // if there is a preceding section sibling which is an appendix, make it appendix
    if (
      !$tof.hasClass("appendix") &&
      !$tof.hasClass("introductory") &&
      !$tof.parents("section").length
    ) {
      if (
        $tof.prevAll("section.introductory").length ===
        $tof.prevAll("section").length
      ) {
        $tof.addClass("introductory");
      } else if ($tof.prevAll("appendix").length) {
        $tof.addClass("appendix");
      }
    }
    $tof.append($("<h2>" + conf.l10n.table_of_fig + "</h2>"));
    $tof.append($("<ul class='tof'/>"));
    const $ul = $tof.find("ul");
    while (tof.length) $ul.append(tof.shift());
  }
}

function normalizeImages(doc) {
  doc
    .querySelectorAll(
      ":not(picture)>img:not([width]):not([height]):not([srcset])"
    )
    .forEach(img => {
      if (img.naturalHeight === 0 || img.naturalWidth === 0) return;
      img.height = img.naturalHeight;
      img.width = img.naturalWidth;
    });
}
