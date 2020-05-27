// @ts-check
import { fetchAndCache } from "./utils.js";
import { fetchAsset } from "./text-loader.js";
import { html } from "./import-maps.js";
import { pub } from "./pubsubhub.js";

export const name = "core/mdn-annotation";

const BASE_JSON_PATH = "https://w3c.github.io/mdn-spec-links/";
const MDN_URL_BASE = "https://developer.mozilla.org/en-US/docs/Web/";
const MDN_BROWSERS = {
  // The browser IDs here must match the ones in the imported JSON data.
  // See the list of browser IDs at:
  // https://github.com/mdn/browser-compat-data/blob/master/schemas/compat-data-schema.md#browser-identifiers.
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

async function loadStyle() {
  try {
    return (await import("text!../../assets/mdn-annotation.css")).default;
  } catch {
    return fetchAsset("mdn-annotation.css");
  }
}

function insertMDNBox(node) {
  const targetAncestor = node.closest("section");
  const { previousElementSibling: targetSibling } = targetAncestor;
  if (targetSibling && targetSibling.classList.contains("mdn")) {
    // If the target ancestor already has a mdnBox inserted, we just use it
    return targetSibling;
  }
  const mdnBox = html`<aside class="mdn before wrapped"></aside>`;
  targetAncestor.before(mdnBox);
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

/** @param {MdnEntry['support']} support */
function buildBrowserSupportTable(support) {
  /**
   * @param {string | keyof MDN_BROWSERS} browserId
   * @param {"Yes" | "No" | "Unknown"} yesNoUnknown
   * @param {string} version
   */
  function createRow(browserId, yesNoUnknown, version) {
    const displayStatus = yesNoUnknown === "Unknown" ? "?" : yesNoUnknown;
    const classList = `${browserId} ${yesNoUnknown.toLowerCase()}`;
    return html`<span class="${classList}">
      <span class="browser-name">${MDN_BROWSERS[browserId]}</span>
      <span class="version">${version ? version : displayStatus}</span>
    </span>`;
  }

  /**
   * @param {string | keyof MDN_BROWSERS} browserId
   * @param {VersionDetails} versionData
   */
  function createRowFromBrowserData(browserId, versionData) {
    if (versionData.version_removed) {
      return createRow(browserId, "No", "");
    }
    const versionAdded = versionData.version_added;
    if (typeof versionAdded === "boolean") {
      return createRow(browserId, versionAdded ? "Yes" : "No", "");
    } else if (!versionAdded) {
      return createRow(browserId, "Unknown", "");
    } else {
      return createRow(browserId, "Yes", `${versionAdded}+`);
    }
  }

  return Object.keys(MDN_BROWSERS).map(browserId => {
    return support[browserId]
      ? createRowFromBrowserData(browserId, support[browserId])
      : createRow(browserId, "Unknown", "");
  });
}

export async function run(conf) {
  const mdnKey = getMdnKey(conf);
  if (!mdnKey) return;

  const mdnSpecJson = await getMdnData(mdnKey, conf.mdn);
  if (!mdnSpecJson) return;

  const style = document.createElement("style");
  style.textContent = await loadStyle();
  style.classList.add("removeOnSave");
  document.head.append(style);

  document.head.appendChild(html`<script>
    function toggleMDNStatus(div) {
      div.parentNode.classList.toggle("wrapped");
    }
  </script>`);
  findElements(mdnSpecJson).forEach(elem => {
    const mdnSpecArray = mdnSpecJson[elem.id];
    const mdnBox = insertMDNBox(elem);
    mdnSpecArray
      .map(spec => {
        const mdnDiv = document.createElement("div");
        attachMDNDetail(mdnDiv, spec);
        return mdnDiv;
      })
      .forEach(mdnDiv => mdnBox.appendChild(mdnDiv));
  });
}

/** @returns {string} */
function getMdnKey(conf) {
  const { shortName, mdn } = conf;
  if (!mdn) return;
  if (typeof mdn === "string") return mdn;
  return mdn.key || shortName;
}

/**
 * @param {string} key MDN key
 * @param {object} mdnConf
 * @param {string} [mdnConf.specMapUrl]
 * @param {string} [mdnConf.baseJsonPath]
 * @param {number} [mdnConf.maxAge]
 *
 * @typedef {{ version_added: string|boolean|null, version_removed?: string }} VersionDetails
 * @typedef {Record<string | keyof MDN_BROWSERS, VersionDetails>} MdnSupportEntry
 * @typedef {{ name: string, title: string, summary: string, support: MdnSupportEntry }} MdnEntry
 * @typedef {Record<string, MdnEntry[]>} MdnData
 * @returns {Promise<MdnData|undefined>}
 */
async function getMdnData(key, mdnConf) {
  const {
    baseJsonPath = BASE_JSON_PATH,
    maxAge = 60 * 60 * 24 * 1000,
  } = mdnConf;
  const url = new URL(`${key}.json`, baseJsonPath).href;
  const res = await fetchAndCache(url, maxAge);
  if (res.status === 404) {
    const msg = `Could not find MDN data associated with key "${key}".`;
    const hint = "Please add a valid key to `respecConfig.mdn`";
    pub("error", `${msg} ${hint}`);
    return;
  }
  return await res.json();
}

/**
 * Find elements that can have an annotation box attached.
 * @param {MdnData} data
 */
function findElements(data) {
  /** @type {NodeListOf<HTMLElement>} */
  const elemsWithId = document.body.querySelectorAll("[id]:not(script)");
  return [...elemsWithId].filter(({ id }) => Array.isArray(data[id]));
}
