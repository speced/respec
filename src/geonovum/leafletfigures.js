/**
 * Module: geonovum/leafletfigures
 * Makes figures scalable via zoom and pan function
 */
import L from "geonovum/deps/leaflet";
import easyButton from "geonovum/deps/easy-button";
import "deps/regenerator";

export const name = "geonovum/leafletfigures";

export async function run(conf, doc, cb) {
  cb();
  await document.respecIsReady;
  Array.from(doc.querySelectorAll("figure.scalable img")).forEach(image => {
    const { width, height, src } = image;
    const div = document.createElement("div");
    const map = L.map(div, {
      maxZoom: 4,
      minZoom: -4,
      center: [0, 0],
      crs: L.CRS.Simple,
    });
    const imageBounds = [[0, 0], [height, width]];
    image.parentElement.replaceChild(div, image);
    map.setView([height / 2, width / 2], 1);
    [
      L.easyButton("fa-arrows-alt", () => window.open(src, "_blank")),
      L.easyButton("fa-globe", () => map.fitBounds(imageBounds)),
      L.imageOverlay(src, imageBounds),
    ].forEach(item => item.addTo(map));
    map.fitBounds(imageBounds);
  });
}
