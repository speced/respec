// @ts-check
import { fetchAndCache } from "./utils.js";
import { fetchAsset } from "./text-loader.js";
import { html } from "./import-maps.js";

export const name = "core/mdn-annotation";

const SPEC_MAP_URL =
  "https://raw.githubusercontent.com/w3c/mdn-spec-links/master/SPECMAP.json";
const BASE_JSON_PATH = "https://w3c.github.io/mdn-spec-links/";
const MDN_URL_BASE = "https://developer.mozilla.org/en-US/docs/Web/";
const MDN_BROWSERS = {
  // The browser IDs here must match the ones in the imported JSON data.
  // See the list of browser IDs at https://goo.gl/iDacWP.
  chrome: "Chrome",
  chrome_android: "Chrome Android",
  edge: "Edge",
  edge_mobile: "Edge Mobile",
  firefox: "Firefox",
  firefox_android: "Firefox Android",
  ie: "Internet Explorer",
  // nodejs: "Node.js", // no data for features in HTML
  opera: "Opera",
  opera_android: "Opera Android",
  // qq_android: "QQ Browser", // not enough data for features in HTML
  safari: "Safari",
  safari_ios: "Safari iOS",
  samsunginternet_android: "Samsung Internet",
  // uc_android: "UC browser", // not enough data for features in HTML
  // uc_chinese_android: "Chinese UC Browser", // not enough data for features in HTML
  webview_android: "WebView Android",
};

const mdnCssPromise = loadStyle();

async function loadStyle() {
  try {
    return (await import("text!../../assets/mdn-annotation.css")).default;
  } catch {
    return fetchAsset("mdn-annotation.css");
  }
}

function fetchAndCacheJson(url, maxAge) {
  if (!url) return {};
  return fetchAndCache(url, maxAge).then(r => r.json());
}

function insertMDNBox(node) {
  const targetAncestor = node.closest("section");
  const { previousElementSibling: targetSibling, parentNode } = targetAncestor;
  if (targetSibling && targetSibling.classList.contains("mdn")) {
    // If the target ancestor already has a mdnBox inserted, we just use it
    return targetSibling;
  }
  const mdnBox = html`<aside class="mdn before wrapped"></aside>`;
  parentNode.insertBefore(mdnBox, targetAncestor);
  return mdnBox;
}

function attachMDNDetail(container, mdnSpec) {
  const { slug, summary } = mdnSpec;
  container.innerHTML += `<button onclick="toggleMDNStatus(this.parentNode)" aria-label="Expand MDN details"><b>MDN</b></button>`;
  const mdnSubPath = slug.slice(slug.indexOf("/") + 1);
  const href = `${MDN_URL_BASE}${slug}`;
  const mdnDetail = html`
    <div>
      <a title="${summary}" href="${href}">${mdnSubPath}</a>
    </div>
  `;
  attachMDNBrowserSupport(mdnDetail, mdnSpec);
  container.appendChild(mdnDetail);
}

function attachMDNBrowserSupport(container, mdnSpec) {
  if (!mdnSpec.support) {
    container.innerHTML += `<p class="nosupportdata">No support data.</p>`;
    return;
  }
  const supportTable = html`<p class="mdnsupport">
    ${buildBrowserSupportTable(mdnSpec.support)}
  </p>`;
  container.appendChild(supportTable);
}

function buildBrowserSupportTable(support) {
  function createRow(browserId, yesNoUnknown, version) {
    const displayStatus = yesNoUnknown === "Unknown" ? "?" : yesNoUnknown;
    const classList = `${browserId} ${yesNoUnknown.toLowerCase()}`;
    return html` <span class="${classList}">
      <span class="browser-name">${MDN_BROWSERS[browserId]}</span>
      <span class="version">${version ? version : displayStatus}</span>
    </span>`;
  }

  function createRowFromBrowserData(browserId, versionData) {
    if (versionData.version_removed) {
      return createRow(browserId, "No", "");
    }
    const versionAdded = versionData.version_added;
    if (!versionAdded) {
      return createRow(browserId, "Unknown", "");
    }
    if (typeof versionAdded === "boolean") {
      return createRow(browserId, versionAdded ? "Yes" : "No", "");
    } else {
      return createRow(browserId, "Yes", `${versionAdded}+`);
    }
  }

  const rows = [];

  Object.keys(MDN_BROWSERS).forEach(browserId => {
    if (!support[browserId]) {
      rows.push(createRow(browserId, "Unknown", ""));
    } else {
      if (Array.isArray(support[browserId])) {
        support[browserId].forEach(b => {
          rows.push(createRowFromBrowserData(browserId, b));
        });
      } else {
        rows.push(createRowFromBrowserData(browserId, support[browserId]));
      }
    }
  });

  return rows;
}

export async function run(conf) {
  const { shortName, mdn } = conf;
  if (!shortName || !mdn) {
    // Nothing to do if shortName is not provided
    return;
  }
  const maxAge = mdn.maxAge || 60 * 60 * 24 * 1000;
  const specMapUrl = mdn.specMapUrl || SPEC_MAP_URL;
  const baseJsonPath = mdn.baseJsonPath || BASE_JSON_PATH;
  const specMap = await fetchAndCacheJson(specMapUrl, maxAge);
  const hasSpecJson = Object.values(specMap).some(
    jsonName => jsonName === `${shortName}.json`
  );
  if (!hasSpecJson) {
    return;
  }
  const mdnSpecJson = await fetchAndCacheJson(
    `${baseJsonPath}/${shortName}.json`,
    maxAge
  );
  const mdnCss = await mdnCssPromise;
  document.head.appendChild(
    html`<style>
      ${mdnCss}
    </style>`
  );
  document.head.appendChild(html`<script>
    function toggleMDNStatus(div) {
      div.parentNode.classList.toggle("wrapped");
    }
  </script>`);
  const nodesWithId = document.querySelectorAll("[id]");
  [...nodesWithId]
    .filter(node => {
      const unlikelyTagNames = ["STYLE", "SCRIPT", "BODY"];
      return (
        unlikelyTagNames.indexOf(node.tagName) === -1 &&
        mdnSpecJson[node.id] &&
        Array.isArray(mdnSpecJson[node.id])
      );
    })
    .forEach(node => {
      const mdnSpecArray = mdnSpecJson[node.id];
      const mdnBox = insertMDNBox(node);
      mdnSpecArray
        .map(spec => {
          const mdnDiv = document.createElement("div");
          attachMDNDetail(mdnDiv, spec);
          return mdnDiv;
        })
        .forEach(mdnDiv => mdnBox.appendChild(mdnDiv));
    });
}
