/*
Module: "core/caniuse"
Adds a caniuse support table for a "feature" #1238

`conf.caniuse = { feature: key }` =>
  .. the table is added before Copyright
Optional settings:
  `conf.caniuse.browsers` list of caniuse supported browser names
    to be shown in the table or "ALL"
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

const BROWSERS = new Map([ // browser name dictionary
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

export const name = "core/caniuse";

export function run(conf, doc, cb) {
  cb(); // carry on with critical plugins
  if (!conf.caniuse) {
    return;
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

  const parent = document.querySelector(".head dl");
  parent.appendChild(hyperHTML`
    <dt class="caniuse-title" id="${`caniuse-${caniuse.feature}`}">
      Can I Use this API?
    </dt>`);
  const placeholder = parent.appendChild(hyperHTML`
    <dd class="caniuse-stats"></dd>`);

  hyperHTML.bind(placeholder)`${{
    any: fetchAndCacheJson(caniuse)
      .then(stats => createTableHTML(caniuse, stats))
      .catch(err => err),
    placeholder: "fetching data from caniuse.com...",
  }}`;
}

/**
 * MUTATES `conf.caniuse` object to hold normalized configurarion
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
  } else if (conf.caniuse.browsers !== "ALL") {
    conf.caniuse.browsers = DEFAULTS.browsers;
  }
  if (conf.caniuse.maxAge === undefined) conf.caniuse.maxAge = DEFAULTS.maxAge;
  if (!conf.caniuse.versions) conf.caniuse.versions = DEFAULTS.versions;

  function isValidBrowser(browser) {
    if (BROWSERS.has(browser)) {
      return true;
    }
    pub("warn", `Ignoring invalid browser "\`${browser}\`" in \`conf.caniuse.browsers\``);
    return false;
  }
}

/**
 * promises to get content for canIUse table
 * @param {Object} conf              normalized respecConfig.caniuse
 */
async function fetchAndCacheJson(conf) {
  const cache = new IDBCache("respec-caniuse", ["caniuse"]);

  const url = conf.apiURL ?
    conf.apiURL.replace("{FEATURE}", conf.feature)
    : `https://raw.githubusercontent.com/Fyrd/caniuse/master/features-json/${conf.feature}.json`;

  return new Promise(async (resolve, reject) => {
    // use data from cache data if valid and render
    await cache.ready;
    try {
      const cached = await cache.get(url);
      if (cached && new Date() - cached.cacheTime < conf.maxAge) {
        resolve(cached.stats);
      }
    } catch (err) {
      console.error(err);
    }

    // otherwise fetch new data and cache
    let response;
    try {
      response = await window.fetch(url);
      if (!response.ok) {
        if (response.status === 404) {
          console.error(`The resource ${url} could not be found (HTTP 404)`);
          throw new Error("Could not fetch GitHub resource (HTTP 404)");
        }
        const errorMsg = `GitHub Response not OK. Probably exceeded request limit. (HTTP ${response.status})`;
        console.error(`${errorMsg}. Resource = ${url}`);
        throw new Error(errorMsg);
      }
    } catch (err) {
      console.error(err);
      return reject(getErrorMsg());
    }

    try {
      const json = await response.json();
      cache.set(url, { stats: json.stats, cacheTime: new Date() })
        .catch(err => console.error("Failed to cache caniuse data.", err));
      resolve(json.stats);
    } catch (err) {
      console.error(err);
      reject(getErrorMsg());
    }
  });

  function getErrorMsg() {
    const permalink = `http://caniuse.com/#feat=${conf.feature}`;
    return hyperHTML`Some error occured. Please check directly on <a href="${permalink}">${permalink}</a>.`;
  }
}

/**
 * get HTML element for the canIUse support table
 * @param  {Object} stats     CanIUse API results
 * @param  {Object} conf      respecConfig.caniuse
 */
function createTableHTML(conf, stats) {
  let browsers = conf.browsers;
  if (conf.browsers === "ALL") {
    browsers = Object.keys(stats);
  }

  // render the support table
  return hyperHTML`
    ${browsers.map(browser =>
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

    const getSupport = version =>
      browserData[version].split("#", 1)[0].trim();

    const addBrowserVersion = version =>
      `<li class="caniuse-cell ${getSupport(version)}">${version}</li>`;

    const browserVersions = Object.keys(browserData)
      .sort(semverCompare)
      .slice(-numVersions)
      .reverse();

    return hyperHTML`
      <ul class="caniuse-browser">
        <li class="${`caniuse-cell ${getSupport(browserVersions[0])}`}">
          ${BROWSERS.get(browser) || browser} ${browserVersions[0]}
        </li>
        <li class="caniuse-col">
          <ul>
            ${browserVersions.slice(1).map(addBrowserVersion)}
          </ul>
        </li>
      </ul>`;
  }
}
