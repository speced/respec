// Module core/figure
// Handles figures in the document.
// Adds width and height to images, if they are missing.
// Generates a Table of Figures wherever there is a #tof element.

import { pub } from "./pubsubhub";
import hyperHTML from "../deps/hyperhtml";
import { addId, wrapInner, renameElement } from "./utils";

export const name = "core/figures";

export function run(conf) {
  normalizeImages(document);
  // process all figures
  const figMap = {};
  const tof = [];
  document.querySelectorAll("figure").forEach((fig, i) => {
    const caption = fig.querySelector("figcaption");
    const title = caption.textContent;
    const id = addId(fig, "fig", title);

    if (caption) {
      // set proper caption title
      wrapInner(caption, hyperHTML`<span class='fig-title'>`);
      caption.prepend(
        conf.l10n.fig,
        hyperHTML`<span class='figno'>${i + 1}</span>`,
        " "
      );
    } else pub("warn", "A `<figure>` should contain a `<figcaption>`.");

    figMap[id] = $(caption ? [...caption.childNodes] : []);
    const tofCaption = caption.cloneNode(true);
    tofCaption.querySelectorAll("a").forEach(anchor => {
      renameElement(anchor, "span").removeAttribute("href");
    });
    tof.push(
      hyperHTML`<li class='tofline'>
        <a class='tocxref' href='${`#${id}`}'>${tofCaption}</a>
      </li>`
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
