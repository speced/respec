// Module w3c/informative
// Mark specific sections as informative, based on CSS
import "deps/hyperhtml";
export const name = "w3c/informative";

export function run(conf) {
  Array.from(document.querySelectorAll("section.informative"))
    .map(informative => Array.from(informative.children).find(child => child instanceof HTMLHeadingElement))
    .filter(heading => heading)
    .forEach(heading => {
      heading.parentNode.insertBefore(hyperHTML`<p><em>This section is non-normative.</em></p>`, heading.nextSibling);
    });
}
