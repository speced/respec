// Module ui/search-specref
// Search Specref database
"use strict";
define(
    ["core/biblio", "core/ui"],
    function (biblio, ui) {
        function pluralize (count, sing, plur) {
            return count + ' ' + (count == 1 ? sing : plur);
        }
        function buildResults (json) {
            var html = "", count = 0;
            for (var k in json) {
                var obj = json[k];
                if (!obj.aliasOf) {
                    count++;
                    html += "<dt>[" + (obj.id || k) + "]</dt><dd><small>" + biblio.stringifyReference(obj) + "</small></dd>";
                }
            }
            return { html: html, count: count };
        }

        function msg(query, count) {
            if (count) {
                return "We found " + pluralize(count, 'result', 'results') + " for your search for '" + query + "'.";
            }
            return "Your search for '" + query + "' did not match any references in the Specref database.<br>Sorry. 😢";
        }

        function highlight(txt, searchString) {
            var regexp = new RegExp("(<[^>]+>)|(" + searchString + ")", "gi");
            return (txt || "").replace(regexp, function wrap(_, tag, txt) {
                if (tag) return tag;
                return "<strong style='font-weight: inherit; background-color: yellow'>" + txt + "</strong>";
            });
        }
        const button = ui.addCommand("Search Specref DB", "ui/search-specref", "Ctrl+Shift+Alt+space", "🔎");
        return {
            show: function() {
                var $halp = $("<div><form><p><input name=q type=search> <input type=submit value=search /></p></form></div");
                var $search = $halp.find("input[type=search]");
                var $status = $("<p style='font-size: smaller'></p>");
                var $results = $("<dl></dl>");

                $status.appendTo($halp);
                $results.appendTo($halp);

                ui.freshModal("Search Specref DB", $halp, button);
                $search.focus();
                $halp.find("form").on("submit", function() {
                    $status.html("Searching…");
                    var query = $search.val();
                    $.when(
                        $.getJSON("https://specref.herokuapp.com/search-refs", { q: query }),
                        $.getJSON("https://specref.herokuapp.com/reverse-lookup", { urls: query })
                    ).done(function(search, revLookup) {
                        var ref;
                        search = search[0],
                        revLookup = revLookup[0];
                        for (var k in revLookup) {
                            ref = revLookup[k];
                            search[ref.id] = ref;
                        }
                        var output = buildResults(search);
                        $results.html(highlight(output.html, query));
                        $status.html(msg(query, output.count));
                        $search.select();
                    });
                    return false;
                });
            }
        };
    }
);
