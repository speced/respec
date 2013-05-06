/*jshint
    expr:   true
*/
// Module core/biblio/previous-versions
// This module provides an object that finds "previousVersions" 
// properties in bibliographies and expands them so they can
// be used in specifications. 

define([], function () {
    var prevVersionExpander = {},
        biblio;

    function expandPrevVersions(bib, msg) {
        var props = Object.getOwnPropertyNames(bib);

        function hasPrevVersion(key) {
            var entry = bib[key],
                prop = "previousVersions",
                isValid = !! entry[prop] && entry[prop] instanceof Array;
            if (isValid) {
                processPrevVersions(key, entry);
            }
        }

        function processPrevVersions(key, parentEntry) {
            parentEntry.previousVersions.forEach(function (prevObj, index) {
                var warning = "",
                    newKey = key + "-";

                if ((typeof prevObj) !== "object") {
                    warning = "Expected Object, but got an " + type + "?";
                    warning += "Please fix: " + key + " at index " + index + ".";
                    msg("error",warning);
                    return;
                }

                if (!prevObj.hasOwnProperty("key")) {
                    warning = "Previous versions require a key property. ";
                    warning += "Please fix: " + key;
                    msg("error",warning);
                    return;
                }

                newKey += String(prevObj.key);
                if (bib[newKey]) {
                    warning = "Previous version (" + newKey + ") already in biblio. ";
                    warning += "Please fix previousVersion key: " + prevObj.key;
                    msg("error",warning);
                    return;
                }
                addPrevVersion(newKey, parentEntry, prevObj);
            });
        }

        function addPrevVersion(newKey, parentEntry, prevObj) {
            var parentProps = Object.getOwnPropertyNames(parentEntry),
                newProps = Object.getOwnPropertyNames(prevObj),
                allProps = parentProps.concat(newProps).sort().filter(clean),
                newEntry = bib[newKey] = {};

            allProps.forEach(function (prop) {
                var value = prevObj[prop] || parentEntry[prop];
                this[prop] = value;
            }, newEntry);

            //remove duplicates, "previousVersions", and "key" prop

            function clean(elem, pos, self) {
                if (elem === "previousVersions" || elem === "key") {
                    return false;
                }
                return self.lastIndexOf(elem) === pos;
            }
        }
        props.forEach(hasPrevVersion);
    }

    prevVersionExpander.run = function (conf, doc, cb, msg) {
        var props ={
            get: function () {
                return biblio;
            },
            set: function (obj) {
                biblio = obj;
                expandPrevVersions(obj, msg);
            }
        };
        msg.pub("start", "core/biblio/previous-versions");
        if (conf.localBiblio) {
            expandPrevVersions(conf.localBiblio, msg);
        }
        if (berjon.biblio) {
            expandPrevVersions(berjon.biblio, msg);
        } else {
            Object.defineProperty(berjon, "biblio", props);
        }
        msg.pub("end", "core/fix-headers");
        cb();
    };

    return prevVersionExpander;
});