/**
 * Module: geonovum/leafletfigures
 * Makes figures scalable via zoom and pan function
 */
import L from "geonovum/deps/leaflet";
import easyButton from "geonovum/deps/easy-button";
import "deps/regenerator";
import { sub } from "core/pubsubhub";

export const name = "geonovum/leafletfigures";

export async function run(conf, doc, cb) {
  debugger;
  sub("beforesave", addLeafletOnSave);
  cb();
  await document.respecIsReady;
  processImages();
}

function processImages() {
  Array.from(
    document.querySelectorAll("figure.scalable img")
  ).forEach(image => {
    const { width, height, src } = image;
    image.hidden = true;
    const div = document.createElement("div");
    div.classList.add("removeOnSave");
    const map = L.map(div, {
      maxZoom: 4,
      minZoom: -4,
      center: [0, 0],
      crs: L.CRS.Simple,
    });
    const imageBounds = [[0, 0], [height, width]];
    image.insertAdjacentElement("beforebegin", div);
    map.setView([height / 2, width / 2], 1);
    [
      L.easyButton("fa-arrows-alt", () => window.open(src, "_blank")),
      L.easyButton("fa-globe", () => map.fitBounds(imageBounds)),
      L.imageOverlay(src, imageBounds),
    ].forEach(item => item.addTo(map));
    map.fitBounds(imageBounds);
  });
}

function addLeafletOnSave(rootElem) {
  debugger;
  const doc = rootElem.ownerDocument;
  if (doc.querySelector("figure.scalable img") === null) {
    return; // this document doesn't need leaflet
  }
  // this script loads leaflet
  const leafletScript = doc.createElement("script");
  leafletScript.src =
    "https://tools.geostandaarden.nl/respec/scripts/leaflet.js";

  //Loads easy button
  const easyButtonScript = doc.createElement("script");
  easyButtonScript.src =
    "https://tools.geostandaarden.nl/respec/scripts/easy-button.js";

  // This script handles actually doing the work
  const processImagesScript = doc.createElement("script");
  processImagesScript.textContent = `
    ${processImages.toString()};
    // Calls processImages when the document loads
    window.addEventListener("DOMContentLoaded", processImages);
  `;

  // Finally, we add the scripts in order
  doc.head.appendChild(leafletScript);
  doc.head.appendChild(easyButtonScript);
  doc.head.appendChild(processImagesScript);
}
