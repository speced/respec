
// Module core/table
// Handles tables in the document. This enables enable the generation of a Table of Tables wherever there is a #tot element
// to be found as well as normalise the titles of tables.

define(
    [],
    function () {
        return {
            run:        function (conf, doc, cb, msg) {
                msg.pub("start", "core/tables");

                // process all tables
                var tblMap = {}, tot =[ ], num = 0;
                $("table").each(function () {
                    var $tbl = $(this)
                    ,   $cap = $tbl.find("caption")
                    ,   tit = $cap.text()
                    ,   id = $tbl.makeID("tbl", tit);
                    if (! $cap.length) {
                        // if caption exists, add Table # and class
                        num++;
                        $cap.html("")
                            .append(doc.createTextNode("Table "))
                            .append($("<span class='tblno'>" + num + "</span>"))
                            .append(doc.createTextNode(" "))
                            .append($("<span class='tbl-title'/>")
                            .text(tit));
                        tblMap[id] = $cap.contents().clone();
                        tot.push($("<li class='totline'><a class='tocxref' href='#" + id + "'></a></li>")
                           .find(".tocxref")
                           .append($cap.contents().clone())
                           .end());
                    }
                });

                // Update all anchors with empty content that reference a table ID
                $("a[href]", doc).each(function () {
                    var $a = $(this)
                    ,   id = $a.attr("href");
                    if (! id) return;
                    id = id.substring(1);
                    if (tblMap[id]) {
                        $a.addClass("tbl-ref");
                        if ($a.html() === "") $a.append(tblMap[id]);
                    }
                });
                
                // Create a Table of Tables if a section with id 'tot' exists.
                var $tot = $("#tot", doc);
                if (tot.length && $tot.length) {
                    // if it has a parent section, don't touch it
                    // if it has a class of appendix or introductory, don't touch it
                    // if all the preceding section siblings are introductory, make it introductory
                    // if there is a preceding section sibling which is an appendix, make it appendix
                    if (! $tot.hasClass("appendix") && ! $tot.hasClass("introductory") && ! $tot.parents("section").length) {
                        if ($tot.prevAll("section.introductory").length == $tot.prevAll("section").length) {
                            $tot.addClass("introductory");
                        } else if ($tot.prevAll("appendix").length) {
                            $tot.addClass("appendix");
                        }
                    }
                    $tot.append($("<h2>Table of Tables</h2>"));
                    $tot.append($("<ul class='tot'/>"));
                    var $ul = $tot.find("ul");
                    while (tot.length) $ul.append(tot.shift());
                }
                msg.pub("end", "core/tables");
                cb();
            }
        };
    }
);
