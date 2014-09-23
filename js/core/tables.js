
// Module core/table
// Handles tables in the document. This enables enable the generation of a Table of Tables wherever there is a #tot element
// to be found as well as normalise the titles of tables.

define(
    ["core/utils"],
    function (utils) {
    	var makeFigNum = function(fmt, doc, chapter, $cap, label, num, tit) {
    		$cap.html("");
            if (fmt === "" || fmt === "%t") {
            	$cap.append($("<span class='" + label + "-title'/>").text(tit));
            	return num;
            }
            var $num = $("<span class='" + label + "no'/>");
            var $cur = $cap;
            var adjfmt = " " + fmt.replace(/%%/g, "%\\");
            var sfmt = adjfmt.split("%");
            //console.log("fmt=\"" + adjfmt + "\"");
    		for (var i = 0; i < sfmt.length; i++) {
            	var s = sfmt[i];
            	switch (s.substr(0,1)) {
            	case " ": break;
            	case "(": $cur = $num; break;
            	case ")": $cur = $cap; $cur.append($num); $num = $("<span class='"+label+"no'/>"); break;
            	case "\\":$cur.append(doc.createTextNode("%")); break;
            	case "#": $cur.append(doc.createTextNode(num[0])); break;
            	case "c": $cur.append(doc.createTextNode(chapter)); break;
            	case "1": if (num[1] != chapter) num = [1, chapter]; break;
            	case "t": $cur.append($("<span class='"+label+"-title'/>").text(tit)); break;
            	default: $cur.append(doc.createTextNode("?{%"+s.substr(0,1)+"}")); break;
            	}
            	$cur.append(doc.createTextNode(s.substr(1)));
            	//console.log("s=\"" + s + "\"" + "  chapter=" + chapter + "  $cur=\""+$cur.html()+"\"");
            }
    	    num[0]++;
            return num;
    	};
        return {
            run:        function (conf, doc, cb, msg) {
                msg.pub("start", "core/tables");
                if (!conf.tblFmt) conf.tblFmt = "";//Table %(%1%c-%#%): %t";
                //conf.tblFmt = "";

                // process all tables
                var tblMap = {}, tot =[ ], num = [1,1], appendixMode = false, lastNonAppendix = -1000;;
                var $secs = $("body", doc).children(conf.tocIntroductory ? "section" : "section:not(.introductory):not(#toc):not(#tof):not(#tot)");
				for (var i = 0; i < $secs.length; i++) {
					var $sec = $($secs[i], doc);
			        if ($sec.hasClass("appendix") && !appendixMode) {
	                        lastNonAppendix = i;
	                        appendixMode = true;
	                }
	                var chapter = i + 1;
	                if (appendixMode) chapter = utils.appendixMap(i - lastNonAppendix);
	          		$("table", $sec).each(function () {
						var $tbl = $(this)
						,   $cap = $tbl.find("caption")
						,   tit = $cap.text()
						,   id = $tbl.makeID("tbl", tit);
						if ($cap.length) {
							// if caption exists, add Table # and class
							num = makeFigNum(conf.tblFmt, doc, chapter ,$cap, "tbl", num, tit);
							tblMap[id] = $cap.contents().clone();
							tot.push($("<li class='totline'><a class='tocxref' href='#" + id + "'></a></li>")
									.find(".tocxref")
									.append($cap.contents().clone())
									.end());
						}
					});
                }

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
                    $tot.append($("<ul class='tof'/>"));
                    var $ul = $tot.find("ul");
                    while (tot.length) $ul.append(tot.shift());
                }
                msg.pub("end", "core/tables");
                cb();
            }
        };
    }
);
