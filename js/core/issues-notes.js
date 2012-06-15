
// Module core/issues-notes
// Manages issues and notes, including marking them up, numbering, inserting the title,
// and injecting the style sheet.
// These are elements with classes "issue" or "note".
// When an issue or note is found, it is reported using the "issue" or "note" event. This can
// be used by a containing shell to extract all of these.

define(
    ["text!core/css/issues-notes.css"],
    function (css) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/issues-notes");
                var $ins = $(".issue, .note");
                if ($ins.length) {
                    $(doc).find("head link").first().before($("<style/>").text(css));
                    var issueNum = 0;
                    $ins.each(function (i, inno) {
                        var $inno = $(inno)
                        ,   isIssue = $inno.hasClass("issue")
                        ,   isInline = $inno.css("display") != "block"
                        ,   report = { inline: isInline }
                        ;
                        // report.content = $inno.clone();
                        report.type = isIssue ? "issue" : "note";
                        if (isIssue && !isInline) {
                            issueNum++;
                            report.number = issueNum;
                        }
                
                        // wrap
                        if (!isInline) {
                            var $div = $("<div class='" + report.type + "'></div>")
                            ,   $tit = $("<div class='" + report.type + "-title'><span></span></div>")
                            ;
                            $tit.find("span").text(isIssue ? "Issue " + issueNum : "Note");
                            report.title = $inno.attr("title");
                            if (report.title) {
                                $tit.append(doc.createTextNode(": " + report.title));
                                $inno.removeAttr("title");
                            }
                            $div.append($tit);
                            $div.append($inno.clone().removeClass(report.type));
                            $inno.replaceWith($div);
                        }
                        msg.pub(report.type, report);
                    });
                }
                msg.pub("end", "core/issues-notes");
                cb();
            }
        };
    }
);
