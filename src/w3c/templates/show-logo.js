import hyperHTML from "../../deps/hyperhtml";
import { showInlineWarning } from "../../core/utils";

export default obj => {
  const a = document.createElement("a");
  if (!obj.alt) {
    showInlineWarning(a, "Found spec logo without an `alt` attribute");
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
