
// Module core/utils
// As the name implies, this contains a ragtag gang of methods that just don't fit 
// anywhere else.

define(
    [],
    function () {
        var utils = {
            // --- SET UP
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "w3c/utils");
                msg.pub("end", "w3c/utils");
                cb();
            }

            // --- STRING HELPERS -----------------------------------------------------------------------------
            // XXX
        ,   joinAnd:    function (arr, mapper) {
                mapper = mapper || function (ret) { return ret; };
                var ret = "";
                for (var i = 0, n = arr.length; i < n; i++) {
                    if (i > 0) {
                        if (n === 2) ret += ' ';
                        else         ret += ', ';
                        if (i == n - 1) header += 'and ';
                    }
                    ret += mapper(arr[i]);
                }
                return ret;
            }
            
            // --- DATE HELPERS -------------------------------------------------------------------------------
            // Takes a Date object and an optional separator and returns the year,month,day representation with
            // the custom separator (defaulting to none) and proper 0-padding
        ,   concatDate: function (date, sep) {
                if (!sep) sep = "";
                return "" + date.getFullYear() + sep + this.lead0(date.getMonth() + 1) + sep + this.lead0(date.getDate());
            }

            // takes a string, prepends a "0" if it is of length 1, does nothing otherwise
        ,   lead0:  function (str) {
                str = "" + str;
                return (str.length == 1) ? "0" + str : str;
            }
            
            // takes a YYYY-MM-DD date and returns a Date object for it
        ,   parseSimpleDate:    function (str) {
                return new Date(str.substr(0, 4), (str.substr(5, 2) - 1), str.substr(8, 2));
            }

            // takes what document.lastModified returns and produces a Date object for it
        ,   parseLastModified:    function (str) {
                if (!str) return new Date();
                return new Date(Date.parse(str));
                // return new Date(str.substr(6, 4), (str.substr(0, 2) - 1), str.substr(3, 2));
            }

            // list of human names for months (in English)
        ,   humanMonths: ["January", "February", "March", "April", "May", "June", "July",
                          "August", "September", "October", "November", "December"]
        
            // given either a Date object or a date in YYYY-MM-DD format, return a human-formatted
            // date suitable for use in a W3C specification
        ,   humanDate:  function (date) {
                if (!(date instanceof Date)) date = this.parseSimpleDate(date);
                return this.lead0(date.getDate()) + " " + this.humanMonths[date.getMonth()] + " " + date.getFullYear();
            }
            
            
            // --- STYLE HELPERS ------------------------------------------------------------------------------
            // take a document and either a link or an array of links to CSS and appends a <link/> element
            // to the head pointing to each
        ,   linkCSS:  function (doc, styles) {
                if (!$.isArray(styles)) styles = [styles];
                $.each(styles, function (i, css) { 
                    $('head', doc).append($("<link/>").attr({ rel: 'stylesheet', href: css }));
                });
            }
        };
        return utils;
    }
);

// --- JQUERY EXTRAS ------------------------------------------------------------------------------
// Applies to any jQuery object containing elements, changes their name to the one give, and
// return a jQuery object containing the new elements
$.fn.renameElement = function (name) {
    var arr = [];
    this.each(function () {
        var $newEl = $(this.ownerDocument.createElement(name));
        // I forget why this didn't work, maybe try again
        // $newEl.attr($(this).attr());
        for (var i = 0, n = this.attributes.length; i < n; i++) {
            var at = this.attributes[i];
            $newEl[0].setAttributeNS(at.namespaceURI, at.name, at.value);
        }
        $(this).contents().appendTo($newEl);
        $(this).replaceWith($newEl);
        arr.push($newEl[0]);
    });
    return $(arr);
};
