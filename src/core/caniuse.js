/**
 * Module: "core/caniuse"
 * Adds a caniuse support table for a "feature" #1238
 * Usage options: https://github.com/w3c/respec/wiki/caniuse
 */
import { pub, sub } from "./pubsubhub";
import caniuseCss from "text!../../assets/caniuse.css";
import { createResourceHint } from "./utils";
import hyperHTML from "hyperhtml";

export const name = "core/caniuse";

const API_URL = "https://respec.org/caniuse/";

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
  const options = getNormalizedConf(conf);
  conf.caniuse = options; // for tests
  if (!options.feature) {
    return; // no feature to show
  }
  const featureURL = `https://caniuse.com/#feat=${options.feature}`;
  const link = createResourceHint({
    hint: "preconnect",
    href: "https://respec.org",
  });
  document.head.appendChild(link);
  document.head.appendChild(hyperHTML`
    <style class="removeOnSave">${caniuseCss}</style>`);

  const headDlElem = document.querySelector(".head dl");
  const contentPromise = new Promise(async resolve => {
    let content;
    try {
      const apiUrl = options.apiURL || API_URL;
      const stats = await fetchStats(apiUrl, options);
      content = createTableHTML(featureURL, stats);
    } catch (err) {
      console.error(err);
      const msg =
        `Couldn't find feature "${options.feature}" on caniuse.com? ` +
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
  pub("amend-user-config", { caniuse: options.feature });
  sub("beforesave", outputDoc => {
    hyperHTML.bind(outputDoc.querySelector(".caniuse-stats"))`
      <a href="${featureURL}">caniuse.com</a>`;
  });
}

/**
 * returns normalized `conf.caniuse` configuration
 * @param {Object} conf   configuration settings
 */
function getNormalizedConf(conf) {
  const DEFAULTS = { versions: 4 };
  if (typeof conf.caniuse === "string") {
    return { feature: conf.caniuse, ...DEFAULTS };
  }
  const caniuseConf = { ...DEFAULTS, ...conf.caniuse };
  if (Array.isArray(caniuseConf.browsers)) {
    caniuseConf.browsers = caniuseConf.browsers
      .map(b => b.toLowerCase())
      .filter(isValidBrowser);
  }
  return caniuseConf;
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
 * @param {string} apiURL
 * @typedef {{ [browserName: string]: [string, string[]][] }} ApiResponse
 * @return {Promise<ApiResponse>}
 * @throws {Error} on failure
 */
async function fetchStats(apiURL, options) {
  const { feature, versions, browsers } = options;
  const searchParams = new URLSearchParams();
  searchParams.set("feature", feature);
  searchParams.set("versions", versions);
  if (Array.isArray(browsers)) {
    searchParams.set("browsers", browsers.join(","));
  }
  const url = `${apiURL}?${searchParams.toString()}`;
  const response = await fetch(url);
  const stats = await response.json();
  return stats;
}

/**
 * Get HTML element for the canIUse support table.
 * @param {string} featureURL
 * @param {ApiResponse} stats
 */
function createTableHTML(featureURL, stats) {
  // render the support table
  return hyperHTML`
    ${Object.entries(stats).map(addBrowser)}
    <a href="${featureURL}"
      title="Get details at caniuse.com">More info
    </a>`;
}

/**
 * Add a browser and it's support to table.
 * @param {[ string, ApiResponse["browserName"] ]}
 */
function addBrowser([browserName, browserData]) {
  /** @param {string[]} supportKeys */
  const getSupport = supportKeys => {
    const titles = supportKeys
      .filter(key => supportTitles.has(key))
      .map(key => supportTitles.get(key));
    return {
      className: `caniuse-cell ${supportKeys.join(" ")}`,
      title: titles.join(" "),
    };
  };

  /** @param {[string, string[]]} */
  const addLatestVersion = ([version, supportKeys]) => {
    const { className, title } = getSupport(supportKeys);
    const buttonText = `${BROWSERS.get(browserName) || browserName} ${version}`;
    return hyperHTML`
      <button class="${className}" title="${title}">${buttonText}</button>`;
  };

  /** @param {[string, string[]]} */
  const addBrowserVersion = ([version, supportKeys]) => {
    const { className, title } = getSupport(supportKeys);
    return `<li class="${className}" title="${title}">${version}</li>`;
  };

  const [latestVersion, ...olderVersions] = browserData;
  return hyperHTML`
    <div class="caniuse-browser">
      ${addLatestVersion(latestVersion)}
      <ul>
        ${olderVersions.map(addBrowserVersion)}
      </ul>
    </div>`;
}
