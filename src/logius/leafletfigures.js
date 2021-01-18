/**
 * Module: geonovum/leafletfigures
 * Makes figures scalable via zoom and pan function
 */

import L from "../geonovum/deps/leaflet";
import easyButton from "../geonovum/deps/easy-button";
import { sub } from "../core/pubsubhub";

export const name = "geonovum/leafletfigures";

export async function run(conf, doc, cb) {
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

const rawProcessImages = `
  function processImages() {
    Array.from(
      document.querySelectorAll("figure.scalable img")
    ).forEach(image => {
      const { width, height, src } = image;
      image.hidden = true;
      const div = document.createElement("div");
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
`;

function addLeafletOnSave(rootElem) {
  const doc = rootElem.ownerDocument;
  const head = rootElem.querySelector("head");
  if (rootElem.querySelector("figure.scalable img") === null) {
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
    ${rawProcessImages};
    // Calls processImages when the document loads
    window.addEventListener("DOMContentLoaded", processImages);
  `;

  // add the CSS
  const leafletStyle = doc.createElement("link");
  leafletStyle.rel = "stylesheet";
  leafletStyle.href =
    "https://tools.geostandaarden.nl/respec/style/leaflet.css";

  // add easyButton font-awesome CSS
  const easyButtonStyle = doc.createElement("link");
  easyButtonStyle.rel = "stylesheet";
  easyButtonStyle.href =
    "https://tools.geostandaarden.nl/respec/style/font-awesome.css";

  // Finally, we add stylesheet and the scripts in order
  head.insertAdjacentElement("afterbegin", leafletStyle);
  head.insertAdjacentElement("afterbegin", easyButtonStyle);
  head.appendChild(leafletScript);
  head.appendChild(easyButtonScript);
  head.appendChild(processImagesScript);
}
