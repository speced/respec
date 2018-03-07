define(["exports", "core/pubsubhub", "deps/hyperhtml"], function (exports, _pubsubhub) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = obj => {
    const a = document.createElement("a");
    if (!obj.alt) {
      const msg = "Found spec logo without an `alt` attribute. See dev console.";
      a.classList.add("respec-offending-element");
      (0, _pubsubhub.pub)("warn", msg);
      console.warn("warn", msg, a);
    }
    a.href = obj.url || "";
    a.classList.add("logo");
    hyperHTML.bind(a)`
      <img
        id="${obj.id}"
        alt="${obj.alt}"
        width="${obj.width}"
        height="${obj.height}">
  `;
    // avoid triggering 404 requests from dynamically generated
    // hyperHTML attribute values
    a.querySelector("img").src = obj.src;
    return a;
  };
});
//# sourceMappingURL=show-logo.js.map