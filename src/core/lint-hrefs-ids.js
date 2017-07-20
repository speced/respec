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
    .filter(({ id }) => !doc.getElementById(id))
    .forEach(({ href, id }) => {
      pub("warn", `Found link with href '${href}' but no element with id '${id}'`);
    });
  cb();
}
