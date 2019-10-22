// @ts-check
import { hyperHTML as html } from "../../core/import-maps.js";
import { pub } from "../../core/pubsubhub.js";

export default link => {
  if (!link.key) {
    const msg =
      "Found a link without `key` attribute in the configuration. See dev console.";
    pub("warn", msg);
    console.warn("warn", msg, link);
    return;
  }
  const fragment = html`
    <dt>${link.key}:</dt>
    ${link.data ? link.data.map(showLinkData) : showLinkData(link)}
  `;
  if (link.class) {
    fragment.classList.add(link.class);
  }
  return fragment;
};

function showLinkData(data) {
  const fragment = html`
    <dd>
      ${data.href
        ? html`
            <a href="${data.href}">${data.value || data.href}</a>
          `
        : ""}
    </dd>
  `;
  if (data.class) {
    fragment.classList.add(data.class);
  }
  return fragment;
}
