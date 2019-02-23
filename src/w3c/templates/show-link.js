import hyperHTML from "hyperhtml";
import { pub } from "../../core/pubsubhub";
const html = hyperHTML;

export default link => {
  if (!link.key) {
    const msg =
      "Found a link without `key` attribute in the configuration. See dev console.";
    pub("warn", msg);
    console.warn("warn", msg, link);
    return;
  }
  return html`
    <dt class="${link.class ? link.class : null}">${link.key}:</dt>
    ${link.data ? link.data.map(showLinkData) : showLinkData(link)}
  `;
};

function showLinkData(data) {
  return html`
    <dd class="${data.class ? data.class : null}">
      ${data.href
        ? html`
            <a href="${data.href}">${data.value || data.href}</a>
          `
        : ""}
    </dd>
  `;
}
