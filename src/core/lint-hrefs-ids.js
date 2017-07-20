// Module core/lint-hrefs-ids
// Warns about href's that do not have corresponding id's

import { pub } from "core/pubsubhub";

export const name = "core/lint-hrefs-ids";

export function run(conf, doc, cb) {
  Array.from(doc.querySelectorAll('a[href]'))
    .map(a => ({ a, href: a.getAttribute('href') }))
    .filter(({ href }) => Boolean(href))
    .filter(({ href }) => href.startsWith('#'))
    .map(({ a, href }) => ({ a, href, id: href.slice(1) }))
    .filter(({ id }) => Boolean(id))
    .filter(({ id }) => !doc.getElementById(id) && !doc.getElementById(decodeURIComponent(id)))
    .forEach(({ a, href, id }) => {
      const msg = `Found an element with href '${href}' but no element with id '${id}'.`
            + " See developer console for offending element.";

      pub("warn", msg);
      console.warn("Offending element:", a);
      a.title = msg;
      a.classList.add("respec-offending-element");
    });
  cb();
}
