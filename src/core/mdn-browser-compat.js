/**
 * Module: "core/mdn-browser-compat"
 * Adds a mdn support table for a "feature" #1693
 * Usage options: [[to be updated]]
 */
import { createResourceHint, fetchAndCache } from "./utils";
import { pub } from "./pubsubhub";
import hyperHTML from "hyperhtml";
import mbcCss from "text!../../assets/mbc.css";

export const name = "core/mdn-browser-compat";

const GH_USER_CONTENT_URL =
  "https://raw.githubusercontent.com/mdn/browser-compat-data/master/";

// browser name dictionary
const BROWSERS = new Map([
  ["chrome", "Chrome"],
  ["chrome_android", "Chrome (Android)"],
  ["edge", "Edge"],
  ["edge_mobile", "Edge (Mobile)"],
  ["firefox", "Firefox"],
  ["firefox_android", "Firefox (Android)"],
  ["ie", "IE"],
  ["opera", "Opera"],
  ["opera_android", "Opera (Android)"],
  ["safari", "Safari"],
  ["safari_ios", "Safari (IOS)"],
  ["samsunginternet_android", "Samsung Internet (Android)"],
  ["webview_android", "Webview (Android)"],
]);

const SUPPORT_TITLES = new Map([
  ["true", ["Yes", "y", "supported"]],
  ["false", ["No", "n", "not supported"]],
  ["null", ["?", "u", "unknown support"]],
]);

const TAGS = new Map([
  ["notes", "Notes *"],
  ["flags", "Flags 🏴"],
  ["alternative_name", "Alternative name 📛"],
]);

export async function run(conf) {
  if (!conf.mdnBrowserSupport) {
    return; // nothing to do.
  }
  normalizeConf(conf);
  const { mdnBrowserSupport } = conf;
  if (!mdnBrowserSupport.feature) {
    return; // no feature to show
  }
  const { feature } = mdnBrowserSupport;
  const link = createResourceHint({
    hint: "preconnect",
    href: "https://raw.githubusercontent.com",
  });
  document.head.appendChild(link);
  document.head.appendChild(hyperHTML`
    <style class="removeOnSave">${mbcCss}</style>`);

  try {
    const stats = await fetchAndCacheJson(mdnBrowserSupport);
    createTablesHTML(mdnBrowserSupport, stats);
  } catch (err) {
    console.error(err);
    const msg =
      `Couldn't find feature "${feature}" on https://github.com/mdn/browser-compat-data? ` +
      "Please check the feature key on [mdn-browser-compat](https://github.com/mdn/browser-compat-data)";
    pub("error", msg);
  }
}

function normalizeConf(conf) {
  const DEFAULTS = {
    maxAge: 60 * 60 * 24 * 1000, // 24 hours (in ms)
    browsers: ["chrome", "firefox", "safari", "edge"],
    versions: 4,
  };
  if (Array.isArray(conf.mdnBrowserSupport.browsers)) {
    conf.mdnBrowserSupport.browsers = conf.mdnBrowserSupport.browsers
      .map(b => b.toLowerCase())
      .filter(isValidBrowser);
  } else {
    conf.mdnBrowserSupport.browsers = DEFAULTS.browsers;
  }
  Object.assign(conf.mdnBrowserSupport, DEFAULTS, {
    ...conf.mdnBrowserSupport,
  });
  function isValidBrowser(browser) {
    if (BROWSERS.has(browser)) {
      return true;
    }
    pub(
      "warn",
      `Ignoring invalid browser "\`${browser}\`" in ` +
        "[`respecConfig.mdnBrowserSupport.browsers`](https://github.com/w3c/respec/wiki/mdnBrowserSupport)"
    );
    return false;
  }
  return;
}

async function fetchAndCacheJson(mdnBrowserSupportConf) {
  const { apiURL, category, feature, maxAge } = mdnBrowserSupportConf;
  const url = apiURL
    ? apiURL.replace("{FEATURE}", feature) &
      apiURL.replace("{CATEGORY}", category)
    : `${GH_USER_CONTENT_URL}${category}/${feature}.json`;

  const request = new Request(url);
  const response = await fetchAndCache(request, maxAge);
  const stats = await response.json();
  return stats[`${category}`];
}

function createTablesHTML(conf, stats) {
  // render support tables for each method/attribute
  const { browsers, feature } = conf;
  const targetNodes = document.querySelectorAll(`
    section[data-dfn-for="${feature}"] dfn
    `);
  const nodeDetails = [];
  targetNodes.forEach(node => {
    nodeDetails.push({
      detail: node.innerText.replace("()", "").trim(),
      id: node.id,
    });
  });
  nodeDetails.forEach(el => {
    const { detail, id } = el;
    const normalizedStats = stats[`${feature}`][`${detail}`];
    const parentNode = document.getElementById(`${id}`).parentNode.parentNode;
    const referenceElement =
      parentNode.firstChild.nextSibling.nextSibling.nextSibling;
    const df = new DocumentFragment();
    const featureURL = `check out more on ${normalizedStats.__compat.mdn_url}`;
    hyperHTML.bind(df)`
      <dt class="mbc-title">Support Table</dt>
      <dd class="mbc-stats">
        ${browsers
          .map(browser =>
            addBrowser(browser, normalizedStats.__compat.support[browser])
          )
          .filter(elem => elem)}
        <a title="${featureURL}" href="${normalizedStats.__compat.mdn_url}">
          More info
        </a>
      </dd>`;
    console.log(referenceElement);
    parentNode.insertBefore(df, referenceElement);
  });

  function addBrowser(browser, normalizedStats) {
    let title;
    let cssClass;
    let version;
    if (typeof normalizedStats.version_added === "string") {
      version = normalizedStats.version_added;
      title = "supported";
      cssClass = "mbc-cell y";
    } else {
      const support_details = SUPPORT_TITLES.get(
        `${normalizedStats.version_added}`
      );
      version = support_details[0];
      cssClass = `mbc-cell ${support_details[1]}`;
      title = support_details[2];
    }
    if (Object.keys(normalizedStats).length > 1) {
      return hyperHTML`
        <div class="mbc-browser">
          <button title="${title}" class="${cssClass}">
            ${BROWSERS.get(browser)} ${version} *
          </button>
          <ul>
            ${extractKeys(Object.keys(normalizedStats), normalizedStats)}
          </ul>
        </div>`;
    } else {
      return hyperHTML`
        <div class="mbc-browser">
          <button title="${title}" class="${cssClass}">
            ${BROWSERS.get(browser)} ${version}
          </button>
        </div>`;
    }
    function extractKeys(keys, stats) {
      return hyperHTML`
        ${keys.map(key => addDetail(key, stats)).filter(elem => elem)}`;
      function addDetail(key, stats) {
        if (key === "version_added") {
          return;
        }
        return hyperHTML`
          <li title="${JSON.stringify(stats[key], null, 4)}" class="mbc-cell i">
            ${TAGS.get(key)}
          </li>`;
      }
    }
  }
}
