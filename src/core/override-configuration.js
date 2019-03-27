// Module core/override-configuration
// A helper module that makes it possible to override settings specified in respecConfig
// by passing them as a query string. This is useful when you just want to make a few
// tweaks to a document before generating the snapshot, without mucking with the source.
// For example, you can change the status and date by appending:
//      ?specStatus=LC&publishDate=2012-03-15
// Note that fields are separated by semicolons and not ampersands.
// TODO
//  There could probably be a UI for this to make it even simpler.
import { pub, sub } from "./pubsubhub";

export const name = "core/override-configuration";

function overrideConfig(config) {
  const searchQuery = document.location.search.replace(/;/g, "&");
  const param = new URLSearchParams(searchQuery);
  const overrideProps = Array.from(param.entries())
    .filter(([key, value]) => !!key && !!value)
    .map(([codedKey, codedValue]) => {
      const key = decodeURIComponent(codedKey);
      // The URL is not necessarily trusted, so we escape any suspicious tag-like
      // content. While hyperHTML seems to block execution of inserted scripts (most
      // likely because adding a script via innerHTML doesn't work), other harmful
      // tags (think <style>) are enough to classify this as a minor XSS threat.
      // Although harmful configuration would never occur to a user who clicks around,
      // say, w3c.org, they might click a link to w3c.org from another website, see the
      // trusted w3c domain in their address bar, but receive a misleading page because
      // of the query parameters. Content on w3c.org should only be content that

      // Even with this escaping, it is possible for an attacker to make a link that
      // displays a page with misleading content. They might add themselves to the list
      // of copyright holders, for example, a task which requires no HTML tags.

      // Potential solutions include whitelisting certain options, blocking query
      // string interpretation when `document.referrer` is present, or displaying
      // a clear warning message to make it obvious that the page was modified.
      const decodedValue = decodeURIComponent(codedValue.replace(/%3D/g, "="))
        .replace(/>/g, "&gt;")
        .replace(/</g, "&lt;");
      let value;
      try {
        value = JSON.parse(decodedValue);
      } catch (err) {
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
