// Module core/include-config
// Inject's the document's configuration into the head as JSON.

define(
  [],
  function () {
    'use strict';
    return {
      run: function (conf, doc, cb, msg) {
        msg.pub('start', 'core/include-config');
        var initialUserConfig;
        try {
          if (Object.assign) {
            initialUserConfig = Object.assign({}, conf);
          } else {
            initialUserConfig = JSON.parse(JSON.stringify(conf));
          }
        } catch (err) {
          initialUserConfig = {};
        }
        msg.sub('end-all', function () {
          var script = doc.createElement('script');
          script.id = 'initialUserConfig';
          var confFilter = function (key, val) {
            // DefinitionMap contains array of DOM elements that aren't serializable
            // we replace them by their id
            if (key === 'definitionMap') {
              var ret = {};
              Object
                .keys(val)
                .forEach(function (k) {
                  ret[k] = val[k].map(function (d) {
                    return d[0].id;
                  });
                });
              return ret;
            }
            return val;
          };
          script.innerHTML = JSON.stringify(initialUserConfig, confFilter, 2);
          script.type = 'application/json';
          doc.head.appendChild(script);
          conf.initialUserConfig = initialUserConfig;
        });
        msg.pub('end', 'core/include-config');
        cb();
      }
    };
  }
);
