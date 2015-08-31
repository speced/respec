// Module core/include-config
// Inject's the document's configuration into the head as JSON.

define(
  [],
  function() {
    return {
      run: function(conf, doc, cb, msg) {
        msg.pub("start", "core/include-config");
        var script = doc.createElement("script");
        script.id = "respecConfig";
        script.innerHTML = JSON.stringify(conf, null, 2);
        script.type = "application/json";
        doc.head.appendChild(script);
        msg.pub("end", "core/include-config");
        cb();
      }
    };
  }
);
