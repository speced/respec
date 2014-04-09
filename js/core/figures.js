
// Module core/figure
// Handles figures in the document. This encompasses two primary operations. One is
// converting some old syntax to use the new HTML5 figure and figcaption elements
// (this is undone by the unhtml5 plugin, but that will soon be phased out). The other
// is to enable the generation of a Table of Figures wherever there is a #tof element
// to be found as well as normalise the titles of figures.

define(
    [],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/figures");

                // Move old syntax to new syntax
                $(".figure", doc).each(function (i, figure) {
                    var $figure = $(figure)
                    ,   title = $figure.attr("title") ||
                                $figure.find("[title]").attr("title") ||
                                $figure.attr("alt") ||
                                $figure.find("[alt]").attr("alt") ||
                                "";
                    var $caption = $("<figcaption/>").text(title);

                    // change old syntax to something HTML5 compatible
                    if ($figure.is("div")) {
                        msg.pub("warn", "You are using the deprecated div.figure syntax; please switch to <figure>.");
                        $figure.append($caption);
                        $figure.renameElement("figure");
                    }
                    else {
                        msg.pub("warn", "You are using the deprecated img.figure syntax; please switch to <figure>.");
                        $figure.wrap("<figure></figure>");
                        $figure.parent().append($caption);
                    }
                });

                // process all figures
                var figMap = {}, tof = [], num = 0;
                $("figure").each(function () {
                    var $fig = $(this)
                    ,   $cap = $fig.find("figcaption")
                    ,   tit = $cap.text()
                    ,   id = $fig.makeID("fig", tit);
                    if (!$cap.length) msg.pub("warn", "A <figure> should contain a <figcaption>.");

                    // set proper caption title
                    num++;
                    $cap.wrapInner($("<span class='fig-title'/>"))
                        .prepend(doc.createTextNode(" "))
                        .prepend($("<span class='figno'>" + num + "</span>"))
                        .prepend(doc.createTextNode("Fig. "))
                    ;
                    figMap[id] = $cap.contents().clone();
                    var $tofCap = $cap.clone();
                    $tofCap.find("a").renameElement("span").removeAttr("href");
                    tof.push($("<li class='tofline'><a class='tocxref' href='#" + id + "'></a></li>")
                                .find(".tocxref")
                                    .append($tofCap.contents())
                                .end());
                });

                // Update all anchors with empty content that reference a figure ID
                $("a[href]", doc).each(function () {
                    var $a = $(this)
                    ,   id = $a.attr("href");
                    if (!id) return;
                    id = id.substring(1);
                    if (figMap[id]) {
                        $a.addClass("fig-ref");
                        if ($a.html() === "") $a.append(figMap[id]);
                    }
                });

                // Create a Table of Figures if a section with id 'tof' exists.
                var $tof = $("#tof", doc);
                if (tof.length && $tof.length) {
                    // if it has a parent section, don't touch it
                    // if it has a class of appendix or introductory, don't touch it
                    // if all the preceding section siblings are introductory, make it introductory
                    // if there is a preceding section sibling which is an appendix, make it appendix
                    if (!$tof.hasClass("appendix") && !$tof.hasClass("introductory") && !$tof.parents("section").length) {
                        if ($tof.prevAll("section.introductory").length == $tof.prevAll("section").length) {
                            $tof.addClass("introductory");
                        }
                        else if ($tof.prevAll("appendix").length) {
                            $tof.addClass("appendix");
                        }
                    }
                    $tof.append($("<h2>Table of Figures</h2>"));
                    $tof.append($("<ul class='tof'/>"));
                    var $ul = $tof.find("ul");
                    while (tof.length) $ul.append(tof.shift());
                }
                msg.pub("end", "core/figures");
                cb();
            }
        };
    }
);
