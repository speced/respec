// Module core/biblio
// Handles bibliographic references
// Configuration:
//  - localBiblio: override or supplement the official biblio with your own.

/*jshint jquery: true*/
/*globals console*/
"use strict";
define([
    "core/pubsubhub",
    "core/utils",
  ],
  function(pubsubhub, utils) {
    var bibrefsURL = new URL("https://specref.herokuapp.com/bibrefs?refs=");
    var doneResolver;
    const done = new Promise(function(resolve) {
      doneResolver = resolve;
    });
    // Normative references take precedence over informative ones,
    // so any duplicates ones are removed from the informative set.
    function normalizeReferences(conf) {
      Array
        .from(conf.informativeReferences)
        .filter(function(key) {
          return conf.normativeReferences.has(key);
        })
        .reduce(function(informs, redundantKey) {
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

    function stringifyRef(ref) {
      if (typeof ref === "string") return ref;
      var output = "";
      if (ref.authors && ref.authors.length) {
        output += ref.authors.join("; ");
        if (ref.etAl) output += " et al";
        output += ". ";
      }
      if (ref.publisher) {
        output += ref.publisher;
        if (/\.$/.test(ref.publisher)) {
          output += " ";
        } else {
          output += ". ";
        }
      }
      if (ref.href) output += '<a href="' + ref.href + '"><cite>' + ref.title + "</cite></a>. ";
      else output += '<cite>' + ref.title + '</cite>. ';
      if (ref.date) output += ref.date + ". ";
      if (ref.status) output += (REF_STATUSES.get(ref.status) || ref.status) + ". ";
      if (ref.href) output += 'URL: <a href="' + ref.href + '">' + ref.href + "</a>";
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
        var refs = (type == "Normative") ? norms : informs;
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
              pubsubhub.pub("error", "Circular reference in biblio DB between [" + ref + "] and [" + key + "].");
            } else {
              key = refcontent.aliasOf;
              refcontent = conf.biblio[key];
              circular[key] = true;
            }
          }
          aliases[key] = aliases[key] || [];
          if (aliases[key].indexOf(ref) < 0) aliases[key].push(ref);
          if (refcontent) {
            $dd.html(stringifyRef(refcontent) + "\n");
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
          pubsubhub.pub("warn", "[" + k + "] is referenced in " + aliases[k].length + " ways (" + aliases[k].join(", ") + "). This causes duplicate entries in the reference section.");
        }
      }
      for (var item in badrefs) {
        if (badrefs.hasOwnProperty(item)) pubsubhub.pub("error", "Bad reference: [" + item + "] (appears " + badrefs[item] + " times)");
      }
    }
    // Opportunistically dns-prefetch to bibref server, as we don't know yet
    // if we will actually need to download references yet.
    var link = utils.createResourceHint({
      hint: "dns-prefetch",
      href: bibrefsURL.origin,
    });
    document.head.appendChild(link);
    return {
      get done() {
        return done;
      },
      resolveRef: function(key) {
        return new Promise(function(resolve) {
          this.done.then(function(biblio) {
            if (!biblio.hasOwnProperty(key)) {
              return resolve(null);
            }
            var entry = biblio[key];
            if (entry.aliasOf) {
              return this
                .resolveRef(entry.aliasOf)
                .then(function(entry) {
                  resolve(entry);
                });
            }
            resolve(entry);
          }.bind(this));
        }.bind(this));
      },
      stringifyRef: stringifyRef,
      run: function(conf, doc, cb) {
        var finish = function() {
          doneResolver(conf.biblio);
          cb();
        };
        if (!conf.localBiblio) {
          conf.localBiblio = {};
        }
        if (conf.biblio) {
          var warn = "Overriding `.biblio` in config. Please use ";
          warn += "`.localBiblio` for custom biblio entries.";
          pubsubhub.pub("warn", warn);
        }
        conf.biblio = {};
        var localAliases = Array
          .from(Object.keys(conf.localBiblio))
          .filter(function(key) {
            return conf.localBiblio[key].hasOwnProperty("aliasOf");
          })
          .map(function(key) {
            return conf.localBiblio[key].aliasOf;
          });
        normalizeReferences(conf);
        var allRefs = getRefKeys(conf);
        var externalRefs = allRefs.normativeReferences
          .concat(allRefs.informativeReferences)
          // Filter, as to not go to network for local refs
          .filter(function(key) {
            return !conf.localBiblio.hasOwnProperty(key);
          })
          // but include local aliases, in case they refer to external specs
          .concat(localAliases)
          // remove duplicates
          .reduce(function(collector, item) {
            if (collector.indexOf(item) === -1) {
              collector.push(item);
            }
            return collector;
          }, [])
          .sort();
        // If we don't need to go to network, just use internal biblio
        if (!externalRefs.length) {
          Object.assign(conf.biblio, conf.localBiblio);
          bibref(conf);
          finish();
          return;
        }
        var url = bibrefsURL.href + externalRefs.join(",");
        fetch(url)
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            Object.assign(conf.biblio, data, conf.localBiblio);
            bibref(conf);
            finish();
          })
          .catch(function(err) {
            console.error(err);
            finish();
          });
      }
    };
  }
);
