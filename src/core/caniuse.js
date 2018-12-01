/**
 * Module: "core/caniuse"
 * Adds a caniuse support table for a "feature" #1238
 * Usage options: https://github.com/w3c/respec/wiki/caniuse
 */
import { createResourceHint, fetchAndCache, semverCompare } from "./utils";
import { pub, sub } from "./pubsubhub";
import caniuseCss from "../deps/text!core/css/caniuse.css";
import hyperHTML from "../deps/hyperhtml";

export const name = "core/caniuse";

const GH_USER_CONTENT_URL =
  "https://raw.githubusercontent.com/Fyrd/caniuse/master/features-json/";

// browser name dictionary
const BROWSERS = new Map([
  ["and_chr", "Chrome (Android)"],
  ["and_ff", "Firefox (Android)"],
  ["and_uc", "UC Browser (Android)"],
  ["android", "Android"],
  ["bb", "Blackberry"],
  ["chrome", "Chrome"],
  ["edge", "Edge"],
  ["firefox", "Firefox"],
  ["ie", "IE"],
  ["ios_saf", "Safari (iOS)"],
  ["op_mini", "Opera Mini"],
  ["op_mob", "Opera Mobile"],
  ["opera", "Opera"],
  ["safari", "Safari"],
  ["samsung", "Samsung Internet"],
]);

// Keys from https://github.com/Fyrd/caniuse/blob/master/CONTRIBUTING.md
const supportTitles = new Map([
  ["y", "Supported."],
  ["a", "Almost supported (aka Partial support)."],
  ["n", "No support, or disabled by default."],
  ["p", "No support, but has Polyfill."],
  ["u", "Support unknown."],
  ["x", "Requires prefix to work."],
  ["d", "Disabled by default (needs to enabled)."],
]);

export async function run(conf) {
  if (!conf.caniuse) {
    return; // nothing to do.
  }
  normalizeConf(conf);
  const { caniuse } = conf;
  if (!caniuse.feature) {
    return; // no feature to show
  }
  const { feature } = caniuse;
  const featureURL = "https://caniuse.com/#feat=" + feature;
  const link = createResourceHint({
    hint: "preconnect",
    href: "https://raw.githubusercontent.com",
  });
  document.head.appendChild(link);
  document.head.appendChild(hyperHTML`
    <style class="removeOnSave">${caniuseCss}</style>`);

  const headDlElem = document.querySelector(".head dl");
  const contentPromise = new Promise(async resolve => {
    let content;
    try {
      const stats = await fetchAndCacheJson(caniuse);
      content = createTableHTML(caniuse, stats);
    } catch (err) {
      console.error(err);
      const msg =
        `Couldn't find feature "${feature}" on caniuse.com? ` +
        "Please check the feature key on [caniuse.com](https://caniuse.com)";
      pub("error", msg);
      content = hyperHTML`<a href="${featureURL}">caniuse.com</a>`;
    }
    resolve(content);
  });
  const definitionPair = hyperHTML.bind(document.createDocumentFragment())`
    <dt class="caniuse-title">Can I Use this API?</dt>
    <dd class="caniuse-stats">${{
      any: contentPromise,
      placeholder: "Fetching data from caniuse.com...",
    }}</dd>`;
  headDlElem.appendChild(definitionPair);
  await contentPromise;

  // remove from export
  pub("amend-user-config", { caniuse: feature });
  sub("beforesave", outputDoc => {
    hyperHTML.bind(outputDoc.querySelector(".caniuse-stats"))`
      <a href="${featureURL}">caniuse.com</a>`;
  });
}

/**
 * Normalizes `conf.caniuse` object to hold normalized configuration
 *
 * @param {Object} conf   configuration settings
 */
function normalizeConf(conf) {
  const DEFAULTS = {
    maxAge: 60 * 60 * 24 * 1000, // 24 hours (in ms)
    browsers: ["chrome", "firefox", "safari", "edge"],
    versions: 4,
  };
  if (typeof conf.caniuse === "string") {
    conf.caniuse = { feature: conf.caniuse, ...DEFAULTS };
    return;
  }
  if (Array.isArray(conf.caniuse.browsers)) {
    conf.caniuse.browsers = conf.caniuse.browsers
      .map(b => b.toLowerCase())
      .filter(isValidBrowser);
  } else {
    conf.caniuse.browsers = DEFAULTS.browsers;
  }
  Object.assign(conf.caniuse, DEFAULTS, { ...conf.caniuse });
  function isValidBrowser(browser) {
    if (BROWSERS.has(browser)) {
      return true;
    }
    pub(
      "warn",
      `Ignoring invalid browser "\`${browser}\`" in ` +
        "[`respecConfig.caniuse.browsers`](https://github.com/w3c/respec/wiki/caniuse)"
    );
    return false;
  }
}

/**
 * Get stats for canIUse table.
 *
 * @param {Object} caniuseConf    normalized respecConfig.caniuse
 * @return {Object} Can I Use stats
 * @throws {Error} on failure
 */
async function fetchAndCacheJson(caniuseConf) {
  const { apiURL, feature, maxAge } = caniuseConf;
  const url = apiURL
    ? apiURL.replace("{FEATURE}", feature)
    : `${GH_USER_CONTENT_URL}${feature}.json`;
  const request = new Request(url);
  const response = await fetchAndCache(request, maxAge);
  const { stats } = await response.json();
  return stats;
}

/**
 * Get HTML element for the canIUse support table.
 *
 * @param  {Object} stats     CanIUse API results
 * @param  {Object} conf      respecConfig.caniuse
 */
function createTableHTML(conf, stats) {
  // render the support table
  return hyperHTML`
    ${conf.browsers
      .map(browser => addBrowser(browser, conf.versions, stats[browser]))
      .filter(elem => elem)}
    <a href="${`https://caniuse.com/#feat=${conf.feature}`}"
      title="Get details at caniuse.com">More info
    </a>`;

  /**
   * Add a browser and it's support to table.
   *
   * @param {String} browser      name of browser (as in CanIUse API response)
   * @param {Number} numVersions  number of old browser versions to show
   * @param {Object} browserData  stats data from api response
   * @param {Number} tabindex
   */
  function addBrowser(browser, numVersions, browserData) {
    if (!browserData) return;
    const getSupport = version => {
      const supportKeys = browserData[version]
        .split("#", 1)[0] // don't care about footnotes.
        .split(" ")
        .filter(item => item);
      const titles = supportKeys
        .filter(key => supportTitles.has(key))
        .map(key => supportTitles.get(key));
      return {
        support: supportKeys.join(" "),
        title: titles.join(" "),
      };
    };
    const addBrowserVersion = version => {
      const { support, title } = getSupport(version);
      const cssClass = "caniuse-cell " + support;
      return `<li class="${cssClass}" title="${title}">${version}</li>`;
    };

    const [latestVersion, ...olderVersions] = Object.keys(browserData)
      .sort(semverCompare)
      .slice(-numVersions)
      .reverse();
    const { support, title } = getSupport(latestVersion);
    const cssClass = `caniuse-cell ${support}`;
    return hyperHTML`
      <div class="caniuse-browser">
        <button class="${cssClass}" title="${title}">
          ${BROWSERS.get(browser) || browser} ${latestVersion}
        </button>
        <ul>
          ${olderVersions.map(addBrowserVersion)}
        </ul>
      </div>`;
  }
}
