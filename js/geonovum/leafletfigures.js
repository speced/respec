define(["geonovum/deps/leaflet", "geonovum/deps/easy-button"], function(
  L,
  easyButton
) {
  /**
   * Makes figures scalable via zoom and pan function
   *
   */
  "use strict";
  return {
    run: function(conf, doc, cb) {
      doc.respecIsReady.then(function() {
        Array.from(
          doc.querySelectorAll("figure.scalable img")
        ).forEach(function(image) {
          var container = image.parentElement;
          var div = doc.createElement("div");
          div.id = "leaflet-figure";
          container.replaceChild(div, image);
          var map = L.map(div, {
            maxZoom: 4,
            minZoom: -4,
            center: [0, 0],
            crs: L.CRS.Simple,
          }).setView([image.height / 2, image.width / 2], 1);
          var imageBounds = [[0, 0], [image.height, image.width]];
          L.easyButton("fa-arrows-alt", function() {
            window.open(image.src, "_blank");
          }).addTo(map);
          L.easyButton("fa-globe", function() {
            map.fitBounds(imageBounds);
          }).addTo(map);
          L.imageOverlay(image.src, imageBounds).addTo(map);
          map.fitBounds(imageBounds);
        });
      });
      cb();
    },
  };
});
