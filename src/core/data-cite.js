/**
 * Module core/data-cite
 *
 * Allows citing other specifications using
 * anchor elements. Simply add "data-cite"
 * and key of specification.
 *
 * This module simply adds the found key
 * to either conf.normativeReferences
 * or to conf.informativeReferences depending on
 * if it starts with a ! or not.
 *
 * Usage:
 * https://github.com/w3c/respec/wiki
 */
import pubsubhub from "core/pubsubhub";
import { biblio } from "core/biblio";

async function toLookupRequest(elem) {
  const originalKey = elem.dataset.cite;
  var key = elem.dataset.cite.trim();
  if (key.startsWith("!")) {
    key = key.substr(1);
  }
  const entry = await biblio.resolveRef(key);
  elem.removeAttribute("data-cite");
  if (!entry) {
    var msg = "Couldn't find a match for `data-cite=" + originalKey + "`.";
    console.warn(msg, elem);
    msg += " Please check developer console for offending element.";
    pubsubhub.pub("warn", msg);
    return;
  }
  elem.href = entry.href;
}

export const dataCite = {
  run: function(conf, doc, cb) {
    Array
      .from(doc.querySelectorAll(["a[data-cite]"]))
      .filter(function(el) {
        return el.dataset.cite;
      })
      .map(function(el) {
        var ref = el.dataset.cite.trim();
        const isNormative = ref.startsWith("!");
        return {
          isNormative: isNormative,
          key: (isNormative) ? ref.substr(1) : ref
        };
      })
      .reduce(function(conf, refDetails) {
        if (refDetails.isNormative) {
          conf.normativeReferences.add(refDetails.key);
        } else {
          conf.informativeReferences.add(refDetails.key);
        }
        return conf;
      }, conf);
    cb();
  },
  linkInlineCitations: function(doc) {
    const citedSpecs = doc.querySelectorAll("a[data-cite]");
    const lookupRequests = Array
      .from(citedSpecs)
      .map(toLookupRequest);
    return Promise.all(lookupRequests);
  }
};

export function run(...args){
  dataCite.run(...args);
}

export function linkInlineCitations(...args){
  return dataCite.linkInlineCitations(...args);
}

