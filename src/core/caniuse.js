/*
Module: "core/caniuse"
Adds a caniuse support table for a "feature" #1238

`conf.caniuse = { feature: key }` =>
  .. the table is added before Copyright
Optional settings:
  `conf.caniuse.browsers` list of caniuse supported browser names
    to be shown in the table
    default: ["chrome", "firefox", "safari", "edge"]
  `conf.caniuse.versions` number of browser versions to show
  `conf.caniuse.maxAge` (in ms) local response cache duration
  `conf.caniuse.apiURL` URL from where to fetch stats.
    use {FEATURE} as placeholder in URL to replace it by a feature name
*/
import { semverCompare } from "core/utils";
import IDBCache from "core/idb-cache";
import { pub } from "core/pubsubhub";
import "deps/hyperhtml";
import { createResourceHint } from "core/utils";
import caniuseCss from "deps/text!core/css/caniuse.css";

export const name = "core/caniuse";

const cache = new IDBCache("respec-caniuse", ["caniuse"]);

const GH_USER_CONTENT_URL =
  "https://raw.githubusercontent.com/Fyrd/caniuse/master/features-json/";

const BROWSERS = new Map([
  // browser name dictionary
  ["chrome", "Chrome"],
  ["firefox", "Firefox"],
  ["ie", "IE"],
  ["edge", "Edge"],
  ["android", "Android"],
  ["safari", "Safari"],
  ["opera", "Opera"],
  ["bb", "Blackberry"],
  ["and_uc", "UC (Android)"],
  ["and_ff", "Firefox (Android)"],
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

export function run(conf) {
  if (!conf.caniuse) {
    return; // nothing to do.
  }
  normalizeConf(conf);
  const { caniuse } = conf;
  if (!caniuse.feature) {
    return; // no feature to show
  }
  const link = createResourceHint({
    hint: "preconnect",
    href: "https://raw.githubusercontent.com",
  });
  document.head.appendChild(link);
  document.head.appendChild(hyperHTML`<style>${caniuseCss}</style>`);

  const headDlElem = document.querySelector(".head dl");
  const contentPromise = new Promise(async resolve => {
    let content;
    try {
      const stats = await fetchAndCacheJson(caniuse);
      content = createTableHTML(caniuse, stats);
    } catch (err) {
      console.error(err);
      content = hyperHTML`<a href="${
        "http://caniuse.com/#feat=" + caniuse.feature
      }">caniuse.com</a>`;
    }
    resolve(content);
  });
  const definitionPair = hyperHTML.bind(document.createDocumentFragment())`
    <dt class="caniuse-title" id="${`caniuse-${caniuse.feature}`}">
      Can I Use this API?
    </dt>
    <dd class="caniuse-stats">${{
      any: contentPromise,
      placeholder: "Fetching data from caniuse.com...",
    }}</dd>`;
  headDlElem.appendChild(definitionPair);
}

/**
 * Normalizes `conf.caniuse` object to hold normalized configuration
 * @param {Object} conf   configuration settings
 */
function normalizeConf(conf) {
  const DEFAULTS = {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours (in ms)
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
      `Ignoring invalid browser "\`${browser}\`" in [\`respecConfig.caniuse.browsers\`](https://github.com/w3c/respec/wiki/)`
    );
    return false;
  }
}

/**
 * promises to get content for canIUse table
 * @param {Object} caniuseConf              normalized respecConfig.caniuse
 */
async function fetchAndCacheJson(caniuseConf) {
  const { apiURL, feature, maxAge } = caniuseConf;
  const url = apiURL
    ? apiURL.replace("{FEATURE}.json", feature)
    : `${GH_USER_CONTENT_URL}${feature}.json`;
  // use data from cache data if valid and render
  const cached = await cache.match(url);
  if (cached && new Date() - cached.cacheTime < maxAge) {
    return cached.stats;
  }
  // otherwise fetch new data and cache
  const response = await window.fetch(url);
  if (!response.ok) {
    switch (response.status) {
      case 404: {
        const msg = `Couldn't find feature "${feature}" on caniuse.com? Please check the feature key on [caniuse.com](https://caniuse.com)`;
        pub("error", msg);
      }
    }
    throw new Error(
      `Response not ok from URL ${url} (HTTP Status ${response.status})`
    );
  }
  const { stats } = await response.json();
  // set it, and forget it (there is no recovery if it throws, but that's ok).
  cache.put(url, { stats, cacheTime: new Date() }).catch(console.error);
  return stats;
}

/**
 * get HTML element for the canIUse support table
 * @param  {Object} stats     CanIUse API results
 * @param  {Object} conf      respecConfig.caniuse
 */
function createTableHTML(conf, stats) {
  // render the support table
  return hyperHTML`
    ${conf.browsers.map(browser =>
      addBrowser(browser, conf.versions, stats[browser])
    )}
    <a href="${`http://caniuse.com/#feat=${conf.feature}`}"
      title="Get details at caniuse.com">More info
    </a>`;

  /**
   * add a browser and it's support to table
   * @param {String} browser      name of browser (as in CanIUse API response)
   * @param {Number} numVersions  number of old browser versions to show
   * @param {Object} browserData  stats data from api response
   */
  function addBrowser(browser, numVersions, browserData) {
    if (!browserData) return "";
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
    return hyperHTML`
      <ul class="caniuse-browser">
        <li class="${"caniuse-cell " + support}" title="${title}">
          ${BROWSERS.get(browser) || browser} ${latestVersion}
        </li>
        ${olderVersions.map(addBrowserVersion)}
      </ul>`;
  }
}
