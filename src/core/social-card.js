// @ts-check
/**
 * This module adds card metadata for use on social media platforms.
 */
import { docDescription } from "./utils.js";
import { html } from "./import-maps.js";

export const name = "core/social-card";

export function run(conf) {
  if (
    !conf.socialCard ||
    !(conf.socialCard.creator || conf.socialCard.site) ||
    !(conf.socialCard.image && conf.socialCard.imageAlt)
  ) {
    return;
  }
  const { creator, site, image, imageAlt } = conf.socialCard;
  const url = conf.socialCard.url || conf.thisVersion;

  document.head.appendChild(
    html`<meta name="twitter:card" content="summary_large_image" />`
  );
  document.head.appendChild(
    html`<meta name="twitter:site" content="${site || creator}" />`
  );
  document.head.appendChild(
    html`<meta name="twitter:creator" content="${creator || site}" />`
  );
  document.head.appendChild(
    html`<meta
      name="twitter:title"
      property="og:title"
      content="${document.title}"
    />`
  );
  const content = docDescription();
  document.head.appendChild(
    html`<meta
      name="twitter:description"
      property="og:description"
      content="${content}"
    />`
  );
  document.head.appendChild(
    html`<meta name="twitter:image" property="og:image" content="${image}" />`
  );
  document.head.appendChild(
    html`<meta name="twitter:image:alt" content="${imageAlt}" />`
  );
  if (url) {
    document.head.appendChild(
      html`<meta name="twitter:url" property="og:url" content="${url}" />`
    );
  }
  document.head.appendChild(html`<meta property="og:locale" content="en" />`);
}
