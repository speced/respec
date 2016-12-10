// Module core/webidl-oldschool
// Deprecated. It used to use dl elements to render WebIDL.
define(
  [
    "core/pubsubhub"
  ],
  function(pubsubhub) {
    return {
      showDeprecationWarning: function() {
        var deprecationWarn = "Defining WebIDL in `dl` elements is deprecated. " +
          "Please use Contiguous IDL instead: " +
          "https://github.com/w3c/respec/wiki/WebIDL-Guide";
        pubsubhub.pub("error", deprecationWarn);
      },
      run: function(conf, doc, cb) {
        if (doc.querySelector("dl.idl")) {
          this.showDeprecationWarning();
        }
        return cb();
      }
    };
  }
);
