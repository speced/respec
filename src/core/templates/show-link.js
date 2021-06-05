// @ts-check
import { html } from "../../core/import-maps.js";
import { showWarning } from "../../core/utils.js";

const name = "core/templates/show-link";

/**
 * @param {object} link
 * @param {string} link.key
 * @param {string} [link.class]
 * @param {LinkData[]} [link.data]
 */
export default function showLink(link) {
  if (!link.key) {
    const msg =
      "Found a link without `key` attribute in the configuration. See dev console.";
    showWarning(msg, name);
    console.warn(msg, link);
    return;
  }
  return html`
    <dt class="${link.class ? link.class : null}">${link.key}</dt>
    ${link.data ? link.data.map(showLinkData) : showLinkData(link)}
  `;
}

/**
 * @typedef {object} LinkData
 * @property {string} [LinkData.class]
 * @property {string} [LinkData.href]
 * @property {string} [LinkData.value]
 * @param {LinkData} data
 */
function showLinkData(data) {
  return html`<dd class="${data.class ? data.class : null}">
    ${data.href
      ? html`<a href="${data.href}">${data.value || data.href}</a>`
      : data.value}
  </dd>`;
}
