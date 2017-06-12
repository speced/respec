// Module core/figure
// Handles figures in the document. This encompasses two primary operations. One is
// converting some old syntax to use the new HTML5 figure and figcaption elements
// (this is undone by the unhtml5 plugin, but that will soon be phased out). The other
// is to enable the generation of a Table of Figures wherever there is a #tof element
// to be found as well as normalise the titles of figures.

import { pub } from "core/pubsubhub";

export function run(conf, doc, cb) {
  // Move old syntax to new syntax
  $(".figure", doc).each(function(i, figure) {
    var $figure = $(figure),
      title =
        $figure.attr("title") ||
        $figure.find("[title]").attr("title") ||
        $figure.attr("alt") ||
        $figure.find("[alt]").attr("alt") ||
        "",
      $caption = $("<figcaption/>").text(title);

    // change old syntax to something HTML5 compatible
    let badSyntax = "div.figure";
    if ($figure.is("div")) {
      $figure.append($caption);
      $figure.renameElement("figure");
    } else {
      badSyntax = "img.figure";
      $figure.wrap("<figure></figure>");
      $figure.parent().append($caption);
    }
    pub(
      "warn",
      `You are using the deprecated ${badSyntax} syntax; please switch to \`<figure>\`. ` +
        `Your document has been updated to use \`<figure>\` instead ❤️.`
    );
  });

  // process all figures
  var figMap = {}, tof = [], num = 0;
  $("figure").each(function() {
    var $fig = $(this),
      $cap = $fig.find("figcaption"),
      tit = $cap.text(),
      id = $fig.makeID("fig", tit);
    if (!$cap.length)
      pub("warn", "A `<figure>` should contain a `<figcaption>`.");

    // set proper caption title
    num++;
    $cap
      .wrapInner($("<span class='fig-title'/>"))
      .prepend(doc.createTextNode(" "))
      .prepend($("<span class='figno'>" + num + "</span>"))
      .prepend(doc.createTextNode(conf.l10n.fig));
    figMap[id] = $cap.contents();
    var $tofCap = $cap.clone();
    $tofCap.find("a").renameElement("span").removeAttr("href");
    tof.push(
      $("<li class='tofline'><a class='tocxref' href='#" + id + "'></a></li>")
        .find(".tocxref")
        .append($tofCap.contents())
        .end()
    );
  });

  // Update all anchors with empty content that reference a figure ID
  $("a[href]", doc).each(function() {
    var $a = $(this), id = $a.attr("href");
    if (!id) return;
    id = id.substring(1);
    if (figMap[id]) {
      $a.addClass("fig-ref");
      if ($a.html() === "") $a.append(figMap[id].clone());
    }
  });

  // Create a Table of Figures if a section with id 'tof' exists.
  var $tof = $("#tof", doc);
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
        $tof.prevAll("section.introductory").length ==
        $tof.prevAll("section").length
      ) {
        $tof.addClass("introductory");
      } else if ($tof.prevAll("appendix").length) {
        $tof.addClass("appendix");
      }
    }
    $tof.append($("<h2>" + conf.l10n.table_of_fig + "</h2>"));
    $tof.append($("<ul class='tof'/>"));
    var $ul = $tof.find("ul");
    while (tof.length)
      $ul.append(tof.shift());
  }
  cb();
}
