define(["exports", "templates", "core/pubsubhub"], function (exports, _templates, _pubsubhub) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.run = run;

  var _templates2 = _interopRequireDefault(_templates);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  // Module geonovum/conformance
  // Handle the conformance section properly.
  var confoTmpl = _templates2.default["conformance.html"];

  function run(conf, doc, cb) {
    var $confo = $("#conformance");
    if ($confo.length) $confo.prepend(confoTmpl(conf));
    // Added message for legacy compat with Aria specs
    // See https://github.com/w3c/respec/issues/793
    (0, _pubsubhub.pub)("end", "geonovum/conformance");
    cb();
  }
});
//# sourceMappingURL=conformance.js.map