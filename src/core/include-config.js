// Module core/include-config
// Inject's the document's configuration into the head as JSON.
import { sub } from "core/pubsubhub";

function confFilter(key, val) {
  switch (key) {
    // DefinitionMap contains array of DOM elements that aren't serializable
    // we replace them by their id`
    case "definitionMap":
      return Object
        .keys(val)
        .reduce((ret, k) => {
          ret[k] = val[k].map(d => d[0].id);
        }, {});
    default:
      return val;
  }
}

sub('start-all', config => {
  var script = document.createElement('script');
  script.id = 'initialUserConfig';
  script.innerHTML = JSON.stringify(config, confFilter, 2);
  script.type = 'application/json';
  sub('end-all', () => {
    document.head.appendChild(script);
  }, { once: true });
}, { once: true });
