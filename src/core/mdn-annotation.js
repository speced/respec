// @ts-check
import { fetchAndCache, getIntlData, showError } from "./utils.js";
import css from "../styles/mdn-annotation.css.js";
import { html } from "./import-maps.js";

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

const localizationStrings = {
  en: {
    inAllEngines: "This feature is in all major engines.",
    inSomeEngines: "This feature has limited support.",
  },
  zh: {
    inAllEngines: "所有主要引擎均支持此特性。",
    inSomeEngines: "此功能支持有限。",
  },
};
const l10n = getIntlData(localizationStrings);

/**
 * @param {HTMLElement} node
 */
function insertMDNBox(node) {
  const targetAncestor = node.closest("section");
  if (!targetAncestor) return;
  const { previousElementSibling: targetSibling } = targetAncestor;
  if (targetSibling && targetSibling.classList.contains("mdn")) {
    // If the target ancestor already has a mdnBox inserted, we just use it
    return targetSibling;
  }
  const mdnBox = html`<aside class="mdn"></aside>`;
  targetAncestor.before(mdnBox);
  return mdnBox;
}

/**
 * @param {MdnEntry} mdnSpec
 * @returns {HTMLDetailsElement}
 */
function attachMDNDetail(mdnSpec) {
  const { name, slug, summary, support, engines } = mdnSpec;
  const mdnSubPath = slug.slice(slug.indexOf("/") + 1);
  const href = `${MDN_URL_BASE}${slug}`;
  const label = `Expand MDN details for ${name}`;
  const engineSupport = getEngineSupportIcons(engines);
  return html`<details>
    <summary aria-label="${label}"><span>MDN</span>${engineSupport}</summary>
    <a title="${summary}" href="${href}">${mdnSubPath}</a>
    ${getEngineSupport(engines)}
    ${support
      ? buildBrowserSupportTable(support)
      : html`<p class="nosupportdata">No support data.</p>`}
  </details>`;
}

/**
 * @param {MdnEntry['support']} support
 * @returns {HTMLTableElement}
 */
function buildBrowserSupportTable(support) {
  /**
   * @param {string | keyof MDN_BROWSERS} browserId
   * @param {"Yes" | "No" | "Unknown"} yesNoUnknown
   * @param {string} version
   * @returns {HTMLTableRowElement}
   */
  function createRow(browserId, yesNoUnknown, version) {
    const displayStatus = yesNoUnknown === "Unknown" ? "?" : yesNoUnknown;
    const classList = `${browserId} ${yesNoUnknown.toLowerCase()}`;
    return html`<tr class="${classList}">
      <td>${MDN_BROWSERS[browserId]}</td>
      <td>${version ? version : displayStatus}</td>
    </tr>`;
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

  return html`<table>
    ${Object.keys(MDN_BROWSERS).map(browserId => {
      return support[browserId]
        ? createRowFromBrowserData(browserId, support[browserId])
        : createRow(browserId, "Unknown", "");
    })}
  </table>`;
}

export async function run(conf) {
  const mdnKey = getMdnKey(conf);
  if (!mdnKey) return;

  const mdnSpecJson = await getMdnData(mdnKey, conf.mdn);
  if (!mdnSpecJson) return;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.append(style);

  for (const elem of findElements(mdnSpecJson)) {
    const mdnSpecArray = mdnSpecJson[elem.id];
    const mdnBox = insertMDNBox(elem);
    if (!mdnBox) continue;
    for (const spec of mdnSpecArray) {
      mdnBox.append(attachMDNDetail(spec));
    }
  }
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
 * @typedef {{ name: string, title: string, slug: string, summary: string, support: MdnSupportEntry, engines: string[] }} MdnEntry
 * @typedef {Record<string, MdnEntry[]>} MdnData
 * @returns {Promise<MdnData|undefined>}
 */
async function getMdnData(key, mdnConf) {
  const { baseJsonPath = BASE_JSON_PATH, maxAge = 60 * 60 * 24 * 1000 } =
    mdnConf;
  const url = new URL(`${key}.json`, baseJsonPath).href;
  const res = await fetchAndCache(url, maxAge);
  if (res.status === 404) {
    const msg = `Could not find MDN data associated with key "${key}".`;
    const hint = "Please add a valid key to `respecConfig.mdn`";
    showError(msg, name, { hint });
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

/**
 * @param {MdnEntry['engines']} engines
 * @returns {HTMLSpanElement}
 */
function getEngineSupportIcons(engines) {
  if (engines.length === 3) {
    return html`<span title="${l10n.inAllEngines}">✅</span>`;
  }
  if (engines.length < 2) {
    return html`<span title="${l10n.inSomeEngines}">🚫</span>`;
  }
  return html`<span>&emsp;</span>`;
}

/**
 * @param {MdnEntry['engines']} engines
 * @returns {HTMLParagraphElement|undefined}
 */
function getEngineSupport(engines) {
  if (engines.length === 3) {
    return html`<p class="engines-all">${l10n.inAllEngines}</p>`;
  }
  if (engines.length < 2) {
    return html`<p class="engines-some">${l10n.inSomeEngines}</p>`;
  }
}
