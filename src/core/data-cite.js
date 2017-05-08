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
 * https://github.com/w3c/respec/wiki/data--cite
 */
import "deps/regenerator";
import { pub } from "core/pubsubhub";
import { resolveRef } from "core/biblio";
export const name = "core/data-cite";

async function toLookupRequest(elem) {
  const originalKey = elem.dataset.cite;
  let { key, frag } = toCiteDetails(elem);
  const entry = await resolveRef(key);
  cleanElement(elem);
  if (!entry) {
    var msg = `Couldn't find a match for 'data-cite=${originalKey}'.`;
    console.warn(msg, elem);
    msg += " Please check developer console for offending element.";
    pub("warn", msg);
    return;
  }
  let { href } = entry;
  if (frag) {
    href += frag;
  }
  switch (elem.localName) {
    case "a": {
      elem.href = href;
      break;
    }
    case "dfn": {
      const a = elem.ownerDocument.createElement("a");
      a.href = href;
      while (elem.firstChild) {
        a.appendChild(elem.firstChild);
      }
      elem.appendChild(a, elem);
      break;
    }
  }
}

function cleanElement(elem) {
  ["data-cite", "data-cite-frag"]
    .filter(attrName => elem.hasAttribute(attrName))
    .forEach(attrName => elem.removeAttribute(attrName));
}

function toCiteDetails({ dataset }) {
  let { cite: key, citeFrag: frag } = dataset;
  const isNormative = key.startsWith("!");
  const fragPosition = key.search("#");
  if (fragPosition !== -1) {
    frag = !frag ? key.substr(fragPosition) : frag;
    key = key.substring(0, fragPosition);
  }
  if (isNormative) {
    key = key.substr(1);
  }
  if (frag && !frag.startsWith("#")) {
    frag = "#" + frag;
  }
  return { key, isNormative, frag };
}

export function run(conf, doc, cb) {
  Array.from(doc.querySelectorAll(["dfn[data-cite], a[data-cite]"]))
    .filter(el => el.dataset.cite)
    .map(toCiteDetails)
    .reduce((conf, { isNormative, key }) => {
      if (isNormative) {
        conf.normativeReferences.add(key);
      } else {
        conf.informativeReferences.add(key);
      }
      return conf;
    }, conf);
  cb();
}

export async function linkInlineCitations(doc) {
  const citedSpecs = doc.querySelectorAll("dfn[data-cite], a[data-cite]");
  const lookupRequests = Array.from(citedSpecs).map(toLookupRequest);
  return await Promise.all(lookupRequests);
}
