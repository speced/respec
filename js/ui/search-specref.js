// Module ui/search-specref
// Search Specref database

define(
    ["jquery", "core/biblio"],
    function ($, biblio) {
        function pluralize (count, sing, plur) {
            return count + ' ' + (count == 1 ? sing : plur);
        }
        function buildResults (json) {
            var html = "", count = 0;
            for (var k in json) {
                var obj = json[k];
                if (!obj.aliasOf) {
                    count++;
                    html += "<dt>[" + k + "]</dt><dd><small>" + biblio.stringifyRef(obj) + "</small></dd>";
                }
            }
            return { html: html, count: count };
        }
        
        function msg(query, count) {
            if (count) {
                return 'We found ' + pluralize(count, 'result', 'results') + ' for your search for "' + query + '".';
            }
            return 'Your search for "' + query + '" did not match any references in the Specref database.<br>Sorry. :\'(';
        }
        
        return {
            show: function (ui) {
                var $halp = $("<div><form><p><input name=q type=search> <input type=submit value=search /></p></form></div");
                var $search = $halp.find("input[type=search]");
                var $status = $("<p style='font-size: smaller'></p>");
                var $results = $("<dl></dl>");
                
                $status.appendTo($halp);
                $results.appendTo($halp);
                
                ui.freshModal("Search Specref DB", $halp);
                $search.focus();
                $halp.find("form").on("submit", function() {
                    $status.html("Searching…");
                    var query = $search.val();
                    $.getJSON("http://specref.jit.su/search-refs", { q: query }).then(function(json) {
                        var output = buildResults(json);
                        $results.html(output.html);
                        $status.html(msg(query, output.count));
                        $search.select();
                    });
                    return false;
                });
            }
        };
    }
);
