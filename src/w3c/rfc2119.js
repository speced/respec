// Module w3c/rfc2119
// update the 2119 terms section with the terms actually used

import { joinAnd } from "../core/utils";

export const name = "w3c/rfc2119";

export function run(conf) {
  const confo = document.getElementById("respecRFC2119");
  if (!confo) {
    return;
  }
  // do we have a list of used RFC2119 items in
  // conf.respecRFC2119
  const terms = Object.getOwnPropertyNames(conf.respecRFC2119);

  // there are no terms used - remove the clause
  if (terms.length === 0) {
    confo.remove();
    return;
  }

  // put in the 2119 clause and reference
  const html = joinAnd(
    terms.sort(),
    item => `<em class="rfc2119">${item}</em>`
  );
  const plural = terms.length > 1;
  const str = `The key word${plural ? "s " : " "} ${html} ${
    plural ? "are" : "is"
  } ${confo.innerHTML}`;
  confo.innerHTML = str;
}
