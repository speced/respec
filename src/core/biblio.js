// Module core/biblio
// Handles bibliographic references
// Configuration:
//  - localBiblio: override or supplement the official biblio with your own.

/*jshint jquery: true*/
/*globals console*/

import "deps/regenerator";
import { biblioDB } from "core/biblio-db";
import { createResourceHint } from "core/utils";
import { pub } from "core/pubsubhub";

export const name = "core/biblio";

const bibrefsURL = new URL("https://specref.herokuapp.com/bibrefs?refs=");

// Normative references take precedence over informative ones,
// so any duplicates ones are removed from the informative set.
function normalizeReferences(conf) {
  Array
    .from(conf.informativeReferences)
    .filter(
      key => conf.normativeReferences.has(key)
    )
    .reduce((informs, redundantKey) => {
      informs.delete(redundantKey);
      return informs;
    }, conf.informativeReferences);
}

function getRefKeys(conf) {
  return {
    informativeReferences: Array.from(conf.informativeReferences),
    normativeReferences: Array.from(conf.normativeReferences),
  };
}

const REF_STATUSES = new Map([
  ["CR", "W3C Candidate Recommendation"],
  ["ED", "W3C Editor's Draft"],
  ["FPWD", "W3C First Public Working Draft"],
  ["LCWD", "W3C Last Call Working Draft"],
  ["NOTE", "W3C Note"],
  ["PER", "W3C Proposed Edited Recommendation"],
  ["PR", "W3C Proposed Recommendation"],
  ["REC", "W3C Recommendation"],
  ["WD", "W3C Working Draft"],
  ["WG-NOTE", "W3C Working Group Note"],
]);



export function stringifyReference(ref) {
  if (typeof ref === "string") return ref;
  let output = `<cite>${ref.title}</cite>`;
  if (ref.href) {
    output = `<a href="${ref.href}">${output}</a>. `;
  }
  if (ref.authors && ref.authors.length) {
    output += ref.authors.join("; ");
    if (ref.etAl) output += " et al";
    output += ".";
  }
  if (ref.publisher) {
    const publisher = ref.publisher + (/\.$/.test(ref.publisher) ? "" : ".");
    output = `${output} ${publisher} `;
  }
  if (ref.date) output += ref.date + ". ";
  if (ref.status) output += (REF_STATUSES.get(ref.status) || ref.status) + ". ";
  if (ref.href) output += `URL: <a href="${ref.href}">${ref.href}</a>`;
  return output;
}

function bibref(conf) {
  // this is in fact the bibref processing portion
  var badrefs = {};
  var refs = getRefKeys(conf);
  var informs = refs.informativeReferences;
  var norms = refs.normativeReferences;
  var aliases = {};

  if (!informs.length && !norms.length && !conf.refNote) return;
  var $refsec = $("<section id='references' class='appendix'><h2>References</h2></section>").appendTo($("body"));
  if (conf.refNote) $("<p></p>").html(conf.refNote).appendTo($refsec);

  var types = ["Normative", "Informative"];
  for (var i = 0; i < types.length; i++) {
    var type = types[i];
    var refs = (type === "Normative") ? norms : informs;
    if (!refs.length) continue;
    var $sec = $("<section><h3></h3></section>")
      .appendTo($refsec)
      .find("h3")
      .text(type + " references")
      .end();
    $sec.makeID(null, type + " references");
    refs.sort();
    var $dl = $("<dl class='bibliography'></dl>").appendTo($sec);
    if (conf.doRDFa) $dl.attr("resource", "");
    for (var j = 0; j < refs.length; j++) {
      var ref = refs[j];
      $("<dt></dt>")
        .attr({ id: "bib-" + ref })
        .text("[" + ref + "]")
        .appendTo($dl);
      var $dd = $("<dd></dd>").appendTo($dl);
      var refcontent = conf.biblio[ref];
      var circular = {};
      var key = ref;
      circular[ref] = true;
      while (refcontent && refcontent.aliasOf) {
        if (circular[refcontent.aliasOf]) {
          refcontent = null;
          const msg = `Circular reference in biblio DB between [${ref}] and [${key}].`;
          pub("error", msg);
        } else {
          key = refcontent.aliasOf;
          refcontent = conf.biblio[key];
          circular[key] = true;
        }
      }
      aliases[key] = aliases[key] || [];
      if (aliases[key].indexOf(ref) < 0) aliases[key].push(ref);
      if (refcontent) {
        $dd.html(stringifyReference(refcontent) + "\n");
        if (conf.doRDFa) {
          var $a = $dd.children("a");
          $a.attr("property", type === "Normative" ? "dc:requires" : "dc:references");
        }
      } else {
        if (!badrefs[ref]) badrefs[ref] = 0;
        badrefs[ref]++;
        $dd.html("<em style='color: #f00'>Reference not found.</em>\n");
      }
    }
  }
  for (var k in aliases) {
    if (aliases[k].length > 1) {
      let msg = `[${k}] is referenced in ${aliases[k].length} ways: `;
      msg += `(${aliases[k].map(item => `'${item}'`).join(", ")}). This causes`;
      msg += `duplicate entries in the reference section.`;
      pub("warn", msg);
    }
  }
  for (var item in badrefs) {
    const msg = `Bad reference: [${item}] (appears ${badrefs[item]} times)`;
    if (badrefs.hasOwnProperty(item)) pub("error", msg);
  }
}
// Opportunistically dns-prefetch to bibref server, as we don't know yet
// if we will actually need to download references yet.
var link = createResourceHint({
  hint: "dns-prefetch",
  href: bibrefsURL.origin,
});
document.head.appendChild(link);
let doneResolver;
export const done = new Promise(resolve => {
  doneResolver = resolve;
});

async function updateFromNetwork(refs, options = { forceUpdate: false }) {
  // Update database if needed
  if (!refs.length) {
    return;
  }
  const response = await fetch(bibrefsURL.href + refs.join(","))
  if (!options.forceUpdate && !response.ok || response.status !== 200) {
    return null;
  }
  const data = await response.json();
  await biblioDB.addAll(data);
  return data;
}

export async function resolveRef(key) {
  const biblio = await done;
  if (!biblio.hasOwnProperty(key)) {
    return null;
  }
  const entry = biblio[key];
  if (entry.aliasOf) {
    return await resolveRef(entry.aliasOf);
  }
  return entry;
}

export async function run(conf, doc, cb) {
  const finish = () => {
    doneResolver(conf.biblio);
    cb();
  };
  if (!conf.localBiblio) {
    conf.localBiblio = {};
  }
  if (conf.biblio) {
    let msg = "Overriding `.biblio` in config. Please use ";
    msg += "`.localBiblio` for custom biblio entries.";
    pub("warn", msg);
  }
  conf.biblio = {};
  const localAliases = Array
    .from(Object.keys(conf.localBiblio))
    .filter(key => conf.localBiblio[key].hasOwnProperty("aliasOf"))
    .map(key => conf.localBiblio[key].aliasOf);
  normalizeReferences(conf);
  const allRefs = getRefKeys(conf);
  const neededRefs = allRefs.normativeReferences
    .concat(allRefs.informativeReferences)
    // Filter, as to not go to network for local refs
    .filter(key => !conf.localBiblio.hasOwnProperty(key))
    // but include local aliases, in case they refer to external specs
    .concat(localAliases)
    // remove duplicates
    .reduce((collector, item) => {
      if (collector.indexOf(item) === -1) {
        collector.push(item);
      }
      return collector;
    }, [])
    .sort();
  // See if we have them in IDB
  const promisesToFind = neededRefs.map(
    async id => ({ id, data: await biblioDB.find(id) })
  );
  const idbRefs = await Promise.all(promisesToFind);
  const split = idbRefs
    .reduce((collector, ref) => {
      if (ref.data) {
        collector.hasData.push(ref);
      } else {
        collector.noData.push(ref);
      }
      return collector;
    }, { hasData: [], noData: [] });
  split.hasData
    .reduce((collector, ref) => {
      collector[ref.id] = ref.data;
      return collector;
    }, conf.biblio);
  const externalRefs = split.noData.map(item => item.id);
  if (externalRefs.length) {
    // Going to the network for refs we don't have
    const data = await updateFromNetwork(externalRefs, { forceUpdate: true });
    Object.assign(conf.biblio, data);
  }
  Object.assign(conf.biblio, conf.localBiblio);
  bibref(conf);
  finish();
  await updateFromNetwork(neededRefs);
}
