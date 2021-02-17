// @ts-check
// Module core/override-configuration
// A helper module that makes it possible to override settings specified in respecConfig
// by passing them as a query string. This is useful when you just want to make a few
// tweaks to a document before generating the snapshot, without mucking with the source.
// For example, you can change the status and date by appending:
//      ?specStatus=LC&publishDate=2012-03-15
import { pub } from "./pubsubhub.js";

export const name = "core/override-configuration";

export function run(config) {
  const params = new URLSearchParams(document.location.search);
  const overrideEntries = Array.from(params)
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
      return [key, value];
    });
  const overrideProps = Object.fromEntries(overrideEntries);
  Object.assign(config, overrideProps);
  pub("amend-user-config", overrideProps);
}
