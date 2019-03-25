// Module w3c/informative
// Mark specific sections as informative, based on CSS
import hyperHTML from "hyperhtml";
export const name = "geonovum/informative";

export function run() {
  Array.from(document.querySelectorAll("section.informative"))
    .map(informative => informative.querySelector("h2, h3, h4, h5, h6"))
    .filter(heading => heading)
    .forEach(heading => {
      heading.parentNode.insertBefore(hyperHTML`<p><em>Dit onderdeel is niet normatief.</em></p>`, heading.nextSibling);
    });
}
