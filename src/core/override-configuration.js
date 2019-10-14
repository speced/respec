// @ts-check
// Module core/override-configuration
// A helper module that makes it possible to override settings specified in respecConfig
// by passing them as a query string. This is useful when you just want to make a few
// tweaks to a document before generating the snapshot, without mucking with the source.
// For example, you can change the status and date by appending:
//      ?specStatus=LC&publishDate=2012-03-15
import { pub, sub } from "./pubsubhub.js";

export const name = "core/override-configuration";

function overrideConfig(config) {
  // For legacy reasons, we still support both ";" and "&"
  const searchQuery = document.location.search.replace(/;/g, "&");
  const params = new URLSearchParams(searchQuery);
  const overrideProps = Array.from(params)
    .filter(([key, value]) => !!key && !!value)
    .map(([codedKey, codedValue]) => {
      const key = decodeURIComponent(codedKey);
      const decodedValue = decodeURIComponent(codedValue.replace(/%3D/g, "="));
      let value;
      try {
        value = JSON.parse(decodedValue);
      } catch {
        value = decodedValue;
      }
      return { key, value };
    })
    .reduce((collector, { key, value }) => {
      collector[key] = value;
      return collector;
    }, {});
  Object.assign(config, overrideProps);
  pub("amend-user-config", overrideProps);
}
sub("start-all", overrideConfig, { once: true });
