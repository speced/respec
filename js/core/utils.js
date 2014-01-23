/*global respecEvents */

// Module core/utils
// As the name implies, this contains a ragtag gang of methods that just don't fit
// anywhere else.

define(
    ["jquery"],
    function ($) {
        // --- JQUERY EXTRAS -----------------------------------------------------------------------
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

        // For any element, returns a title string that applies the algorithm used for determining the
        // actual title of a <dfn> element (but can apply to other as well).
        $.fn.dfnTitle = function () {
            var title;
            if (this.attr("title")) title = this.attr("title");
            else if (this.contents().length == 1 && this.children("abbr, acronym").length == 1 &&
                     this.find(":first-child").attr("title")) title = this.find(":first-child").attr("title");
            else title = this.text();
            return title.toLowerCase().replace(/^\s+/, "").replace(/\s+$/, "").split(/\s+/).join(" ");
        };


        // Applied to an element, sets an ID for it (and returns it), using a specific prefix
        // if provided, and a specific text if given.
        $.fn.makeID = function (pfx, txt, noLC) {
            if (this.attr("id")) return this.attr("id");
            if (!txt) txt = this.attr("title") ? this.attr("title") : this.text();
            txt = txt.replace(/^\s+/, "").replace(/\s+$/, "");
            var id = noLC ? txt : txt.toLowerCase();
            id = id.split(/[^\-.0-9a-z_]+/i).join("-").replace(/^-+/, "").replace(/-+$/, "");
            if (/\.$/.test(id)) id += "x"; // trailing . doesn't play well with jQuery
            if (id.length > 0 && /^[^a-z]/i.test(id)) id = "x" + id;
            if (id.length === 0) id = "generatedID";
            if (pfx) id = pfx + "-" + id;
            var inc = 1
            ,   doc = this[0].ownerDocument;
            if ($("#" + id, doc).length) {
                while ($("#" + id + "-" + inc, doc).length) inc++;
                id += "-" + inc;
            }
            this.attr("id", id);
            return id;
        };

        // Returns all the descendant text nodes of an element. Note that those nodes aren't
        // returned as a jQuery array since I'm not sure if that would make too much sense.
        $.fn.allTextNodes = function (exclusions) {
            var textNodes = [],
                excl = {};
            for (var i = 0, n = exclusions.length; i < n; i++) excl[exclusions[i]] = true;
            function getTextNodes (node) {
                if (node.nodeType === 1 && excl[node.localName.toLowerCase()]) return;
                if (node.nodeType === 3) textNodes.push(node);
                else {
                    for (var i = 0, len = node.childNodes.length; i < len; ++i) getTextNodes(node.childNodes[i]);
                }
            }
            getTextNodes(this[0]);
            return textNodes;
        };
        
        
        var utils = {
            // --- SET UP
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/utils");
                msg.pub("end", "core/utils");
                cb();
            }

            // --- RESPEC STUFF -------------------------------------------------------------------------------
        ,   removeReSpec:   function (doc) {
                $(".remove, script[data-requiremodule]", doc).remove();
            }

            // --- STRING HELPERS -----------------------------------------------------------------------------
            // Takes an array and returns a string that separates each of its items with the proper commas and
            // "and". The second argument is a mapping function that can convert the items before they are
            // joined
        ,   joinAnd:    function (arr, mapper) {
                if (!arr || !arr.length) return "";
                mapper = mapper || function (ret) { return ret; };
                var ret = "";
                if (arr.length === 1) return mapper(arr[0], 0);
                for (var i = 0, n = arr.length; i < n; i++) {
                    if (i > 0) {
                        if (n === 2) ret += ' ';
                        else         ret += ', ';
                        if (i == n - 1) ret += 'and ';
                    }
                    ret += mapper(arr[i], i);
                }
                return ret;
            }

            // Takes a string, applies some XML escapes, and returns the escaped string.
            // Note that overall using either Handlebars' escaped output or jQuery is much
            // preferred to operating on strings directly.
        ,   xmlEscape:    function (s) {
                return s.replace(/&/g, "&amp;")
                        .replace(/>/g, "&gt;")
                        .replace(/"/g, "&quot;")
                        .replace(/</g, "&lt;");
            }

            // Trims string at both ends and replaces all other white space with a single space
        ,   norm:   function (str) {
                return str.replace(/^\s+/, "").replace(/\s+$/, "").split(/\s+/).join(" ");
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
            // given either a Date object or a date in YYYY-MM-DD format, return an ISO formatted
            // date suitable for use in a xsd:datetime item
        ,   isoDate:    function (date) {
                if (!(date instanceof Date)) date = this.parseSimpleDate(date);
                // return "" + date.getUTCFullYear() +'-'+ this.lead0(date.getUTCMonth() + 1)+'-' + this.lead0(date.getUTCDate()) +'T'+this.lead0(date.getUTCHours())+':'+this.lead0(date.getUTCMinutes()) +":"+this.lead0(date.getUTCSeconds())+'+0000';
                return date.toISOString() ;
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

            // --- TRANSFORMATIONS ------------------------------------------------------------------------------
            // Run list of transforms over content and return result.
            // Please note that this is a legacy method that is only kept in order to maintain compatibility
            // with RSv1. It is therefore not tested and not actively supported.
        ,   runTransforms: function (content, flist) {
                var args = [this, content]
                ,   funcArgs = Array.prototype.slice.call(arguments)
                ;
                funcArgs.shift(); funcArgs.shift();
                args = args.concat(funcArgs);
                if (flist) {
                    var methods = flist.split(/\s+/);
                    for (var j = 0; j < methods.length; j++) {
                        var meth = methods[j];
                        if (window[meth]) {
                            // the initial call passed |this| directly, so we keep it that way
                            try {
                                content = window[meth].apply(this, args);
                            }
                            catch (e) {
                                respecEvents.pub("warn", "call to " + meth + "() failed with " + e) ;
                            }
                        }
                    }
                }
                return content;
            }
        };
        return utils;
    }
);
