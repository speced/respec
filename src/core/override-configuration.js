// Module core/override-configuration
// A helper module that makes it possible to override settings specified in respecConfig
// by passing them as a query string. This is useful when you just want to make a few
// tweaks to a document before generating the snapshot, without mucking with the source.
// For example, you can change the status and date by appending:
//      ?specStatus=LC;publishDate=2012-03-15
// Note that fields are separated by semicolons and not ampersands.
// TODO
//  There could probably be a UI for this to make it even simpler.
import { sub } from "core/pubsubhub";

function overrideConfig(config) {
  if (!document.location.search) {
    return;
  }
  const overrideProps = {};
  document.location.search
    //Remove "?" from search
    .replace(/^\?/, "")
    // The default separator is ";" for key/value pairs
    .split(";")
    .filter(item => item.trim())
    //decode Key/Values
    .reduce((collector, item) => {
      const keyValue = item.split("=", 2);
      const key = decodeURIComponent(keyValue[0]);
      const value = decodeURIComponent(keyValue[1].replace(/%3D/g, "="));
      let parsedValue;
      try {
        parsedValue = JSON.parse(value);
      } catch (err) {
        parsedValue = value;
      }
      collector[key] = parsedValue;
      return collector;
    }, overrideProps);
  Object.assign(config, overrideProps);
}
sub('start-all', overrideConfig, { once: true });
