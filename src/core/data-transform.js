// @ts-check
// Module core/data-transform
// Support for the data-transform attribute
// Any element in the tree that has a data-transform attribute is processed here.
// The data-transform attribute can contain a white space separated list of functions
// to call (these must have been defined globally). Each is called with a reference to
// the core/utils plugin and the innerHTML of the element. The output of each is fed
// as the input to the next, and the output of the last one replaces the HTML content
// of the element.
// IMPORTANT:
//  It is unlikely that you should use this module. The odds are that unless you really
//  know what you are doing, you should be using a dedicated module instead. This feature
//  is not actively supported and support for it may be dropped. It is not accounted for
//  in the test suite, and therefore could easily break.
import { runTransforms } from "./utils.js";

export const name = "core/data-transform";

export function run() {
  /** @type {NodeListOf<HTMLElement>} */
  const transformables = document.querySelectorAll("[data-transform]");
  transformables.forEach(el => {
    el.innerHTML = runTransforms(el.innerHTML, el.dataset.transform);
    el.removeAttribute("data-transform");
  });
}
