/*jshint
    expr:   true
*/

// Module core/biblio/previousVersions
// This module provides an object that finds "previousVersions" 
// properties and expands them in a bibliography so they can
// be used in specifications. 
// USAGE:
// void obj.addBiblio(Object or Array)


define([], function () {
    var prevVersionExpander = {};

    function expandPrevVersions(bib) {
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
                var warn = "",
                    newKey = key + "-";

                if ((typeof prevObj) !== "object") {
                    warn = "Expected Object, but got an " + type + "?";
                    warn += "Please fix: " + key + " at index " + index + ".";
                    console.warn(warn);
                    return;
                }

                if (!prevObj.hasOwnProperty("key")) {
                    warn = "Previous versions require a key property. ";
                    warn += "Please fix: " + key;
                    console.warn(warn);
                    return;
                }

                newKey += String(prevObj.key);
                if (bib[newKey]) {
                    warn = "Previous version (" + newKey + ") already in biblio. ";
                    warn += "Please fix previousVersion key: " + prevObj.key;
                    console.warn(warn);
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

            for (var prop = allProps.pop(); allProps.length; prop = allProps.pop()) {
                newEntry[prop] = prevObj[prop] || parentEntry[prop];
            }

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

    prevVersionExpander.addBiblio = function(bibs){
        if(bibs instanceof Array){
            for (var i = bib.length - 1; i >= 0; i--) {
                expandPrevVersions(bib[i]);
            }
            return;
        }
        expandPrevVersions(bibs);
    }
    return prevVersionExpander;
});