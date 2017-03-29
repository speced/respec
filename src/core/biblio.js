define(["exports", "core/biblio-db", "core/utils", "core/pubsubhub", "deps/regenerator"], function (exports, _biblioDb, _utils, _pubsubhub) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.run = exports.resolveRef = exports.done = exports.name = undefined;
  exports.stringifyReference = stringifyReference;

  function _asyncToGenerator(fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  }

  var name = exports.name = "core/biblio";

  var bibrefsURL = new URL("https://specref.herokuapp.com/bibrefs?refs=");

  // Normative references take precedence over informative ones,
  // so any duplicates ones are removed from the informative set.
  function normalizeReferences(conf) {
    Array.from(conf.informativeReferences).filter(function (key) {
      return conf.normativeReferences.has(key);
    }).reduce(function (informs, redundantKey) {
      informs.delete(redundantKey);
      return informs;
    }, conf.informativeReferences);
  }

  function getRefKeys(conf) {
    return {
      informativeReferences: Array.from(conf.informativeReferences),
      normativeReferences: Array.from(conf.normativeReferences)
    };
  }

  var REF_STATUSES = new Map([["CR", "W3C Candidate Recommendation"], ["ED", "W3C Editor's Draft"], ["FPWD", "W3C First Public Working Draft"], ["LCWD", "W3C Last Call Working Draft"], ["NOTE", "W3C Note"], ["PER", "W3C Proposed Edited Recommendation"], ["PR", "W3C Proposed Recommendation"], ["REC", "W3C Recommendation"], ["WD", "W3C Working Draft"], ["WG-NOTE", "W3C Working Group Note"]]);

  function stringifyReference(ref) {
    if (typeof ref === "string") return ref;
    var output = "<cite>" + ref.title + "</cite>";
    if (ref.href) {
      output = "<a href=\"" + ref.href + "\">" + output + "</a>. ";
    }
    if (ref.authors && ref.authors.length) {
      output += ref.authors.join("; ");
      if (ref.etAl) output += " et al";
      output += ".";
    }
    if (ref.publisher) {
      var publisher = ref.publisher + (/\.$/.test(ref.publisher) ? "" : ".");
      output = output + " " + publisher + " ";
    }
    if (ref.date) output += ref.date + ". ";
    if (ref.status) output += (REF_STATUSES.get(ref.status) || ref.status) + ". ";
    if (ref.href) output += "URL: <a href=\"" + ref.href + "\">" + ref.href + "</a>";
    return output;
  }

  function bibref(conf) {
    // this is in fact the bibref processing portion
    var badrefs = {};
    var refKeys = getRefKeys(conf);
    var informs = refKeys.informativeReferences;
    var norms = refKeys.normativeReferences;
    var aliases = {};

    if (!informs.length && !norms.length && !conf.refNote) return;
    var $refsec = $("<section id='references' class='appendix'><h2>" + conf.l10n.references + "</h2></section>").appendTo($("body"));
    if (conf.refNote) $("<p></p>").html(conf.refNote).appendTo($refsec);
   
    var types = ["Normative", "Informative"];
    for (var i = 0; i < types.length; i++) {
      var type = types[i];
      var refs = type === "Normative" ? norms : informs;
      var l10nRefs = type === "Normative" ? conf.l10n.norm_references : conf.l10n.info_references;
      if (!refs.length) continue;
      var $sec = $("<section><h3></h3></section>").appendTo($refsec).find("h3").text(l10nRefs).end();
      $sec.makeID(null, type + " references");
      refs.sort();
      var $dl = $("<dl class='bibliography'></dl>").appendTo($sec);
      if (conf.doRDFa) $dl.attr("resource", "");
      for (var j = 0; j < refs.length; j++) {
        var ref = refs[j];
        $("<dt></dt>").attr({ id: "bib-" + ref }).text("[" + ref + "]").appendTo($dl);
        var $dd = $("<dd></dd>").appendTo($dl);
        var refcontent = conf.biblio[ref];
        var circular = {};
        var key = ref;
        circular[ref] = true;
        while (refcontent && refcontent.aliasOf) {
          if (circular[refcontent.aliasOf]) {
            refcontent = null;
            var msg = "Circular reference in biblio DB between [" + ref + "] and [" + key + "].";
            (0, _pubsubhub.pub)("error", msg);
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
        var _msg = "[" + k + "] is referenced in " + aliases[k].length + " ways: ";
        _msg += "(" + aliases[k].map(function (item) {
          return "'" + item + "'";
        }).join(", ") + "). This causes";
        _msg += " duplicate entries in the reference section.";
        (0, _pubsubhub.pub)("warn", _msg);
      }
    }
    for (var item in badrefs) {
      var _msg2 = "Bad reference: [" + item + "] (appears " + badrefs[item] + " times)";
      if (badrefs.hasOwnProperty(item)) (0, _pubsubhub.pub)("error", _msg2);
    }
  }
  // Opportunistically dns-prefetch to bibref server, as we don't know yet
  // if we will actually need to download references yet.
  var link = (0, _utils.createResourceHint)({
    hint: "dns-prefetch",
    href: bibrefsURL.origin
  });
  document.head.appendChild(link);
  var doneResolver = void 0;
  var done = exports.done = new Promise(function (resolve) {
    doneResolver = resolve;
  });

  var updateFromNetwork = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(refs) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { forceUpdate: false };
      var response, data;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (refs.length) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return");

            case 2:
              _context.next = 4;
              return fetch(bibrefsURL.href + refs.join(","));

            case 4:
              response = _context.sent;

              if (!(!options.forceUpdate && !response.ok || response.status !== 200)) {
                _context.next = 7;
                break;
              }

              return _context.abrupt("return", null);

            case 7:
              _context.next = 9;
              return response.json();

            case 9:
              data = _context.sent;
              _context.next = 12;
              return _biblioDb.biblioDB.addAll(data);

            case 12:
              return _context.abrupt("return", data);

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function updateFromNetwork(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var resolveRef = exports.resolveRef = function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(key) {
      var biblio, entry;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return done;

            case 2:
              biblio = _context2.sent;

              if (biblio.hasOwnProperty(key)) {
                _context2.next = 5;
                break;
              }

              return _context2.abrupt("return", null);

            case 5:
              entry = biblio[key];

              if (!entry.aliasOf) {
                _context2.next = 10;
                break;
              }

              _context2.next = 9;
              return resolveRef(entry.aliasOf);

            case 9:
              return _context2.abrupt("return", _context2.sent);

            case 10:
              return _context2.abrupt("return", entry);

            case 11:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function resolveRef(_x3) {
      return _ref2.apply(this, arguments);
    };
  }();

  var run = exports.run = function () {
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(conf, doc, cb) {
      var _this = this;

      var finish, msg, localAliases, allRefs, neededRefs, promisesToFind, idbRefs, split, externalRefs, data;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              finish = function finish() {
                doneResolver(conf.biblio);
                cb();
              };

              if (!conf.localBiblio) {
                conf.localBiblio = {};
              }
              if (conf.biblio) {
                msg = "Overriding `.biblio` in config. Please use ";

                msg += "`.localBiblio` for custom biblio entries.";
                (0, _pubsubhub.pub)("warn", msg);
              }
              conf.biblio = {};
              localAliases = Array.from(Object.keys(conf.localBiblio)).filter(function (key) {
                return conf.localBiblio[key].hasOwnProperty("aliasOf");
              }).map(function (key) {
                return conf.localBiblio[key].aliasOf;
              });

              normalizeReferences(conf);
              allRefs = getRefKeys(conf);
              neededRefs = allRefs.normativeReferences.concat(allRefs.informativeReferences)
              // Filter, as to not go to network for local refs
              .filter(function (key) {
                return !conf.localBiblio.hasOwnProperty(key);
              })
              // but include local aliases, in case they refer to external specs
              .concat(localAliases)
              // remove duplicates
              .reduce(function (collector, item) {
                if (collector.indexOf(item) === -1) {
                  collector.push(item);
                }
                return collector;
              }, []).sort();
              // See if we have them in IDB

              promisesToFind = neededRefs.map(function () {
                var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(id) {
                  return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          _context3.t0 = id;
                          _context3.next = 3;
                          return _biblioDb.biblioDB.find(id);

                        case 3:
                          _context3.t1 = _context3.sent;
                          return _context3.abrupt("return", {
                            id: _context3.t0,
                            data: _context3.t1
                          });

                        case 5:
                        case "end":
                          return _context3.stop();
                      }
                    }
                  }, _callee3, _this);
                }));

                return function (_x7) {
                  return _ref4.apply(this, arguments);
                };
              }());
              _context4.next = 11;
              return Promise.all(promisesToFind);

            case 11:
              idbRefs = _context4.sent;
              split = idbRefs.reduce(function (collector, ref) {
                if (ref.data) {
                  collector.hasData.push(ref);
                } else {
                  collector.noData.push(ref);
                }
                return collector;
              }, { hasData: [], noData: [] });

              split.hasData.reduce(function (collector, ref) {
                collector[ref.id] = ref.data;
                return collector;
              }, conf.biblio);
              externalRefs = split.noData.map(function (item) {
                return item.id;
              });

              if (!externalRefs.length) {
                _context4.next = 20;
                break;
              }

              _context4.next = 18;
              return updateFromNetwork(externalRefs, { forceUpdate: true });

            case 18:
              data = _context4.sent;

              Object.assign(conf.biblio, data);

            case 20:
              Object.assign(conf.biblio, conf.localBiblio);
              bibref(conf);
              finish();
              _context4.next = 25;
              return updateFromNetwork(neededRefs);

            case 25:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    return function run(_x4, _x5, _x6) {
      return _ref3.apply(this, arguments);
    };
  }();
});
//# sourceMappingURL=biblio.js.map