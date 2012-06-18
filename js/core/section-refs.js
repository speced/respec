
// Module core/section-refs
// Reference a section by its ID, have the title be included for you. Just
// use an empty <a> element with its href pointing to the section you wish to reference
// and a class of sectionRef.

define(
    [],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/section-refs");
                $("a.sectionRef").each(function () {
                    var $ref = $(this);
                    if (!$ref.attr("href")) return;
                    var id = $ref.attr("href").substring(1)
                    ,   $sec = $("#" + id)
                    ,   secno = "Not found '" + id + "'"
                    ;
                    if ($sec.length) secno = $sec.find("> :first-child").text();
                    $ref.text("section " + secno);
                });
                msg.pub("end", "core/section-refs");
                cb();
            }
        };
    }
);
