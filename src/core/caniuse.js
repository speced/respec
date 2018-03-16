/*
Module: "core/caniuse"
Adds a caniuse support table for a "feature" #1238

`conf.caniuse = { feature: key }` =>
  .. the table is added before Copyright
`<section data-caniuse=key>` =>
  .. table will be added after section's first element (usually section heading)
Optional settings:
  `conf.caniuse.browsers` list of caniuse supported browser names
    to be shown in the table or "ALL"
    default: ["chrome", "firefox", "safari", "edge"]
  `conf.caniuse.versions` number of older browser versions to show
  `conf.caniuse.maxAge` (in ms) local response cache duration
*/

import { semverCompare } from "core/utils";
import { pub } from "core/pubsubhub";
import "deps/hyperhtml";
import caniuseCss from "deps/text!core/css/caniuse.css";

// Opportunistically insert the style into the head to reduce FOUC.
const codeStyle = document.createElement("style");
codeStyle.textContent = caniuseCss;
document.head.appendChild(codeStyle);

export const name = "core/caniuse";

export function run(conf) {
  normalizeConf(conf);
  const { caniuse } = conf;
  if (caniuse.feature) {
    canIUse(caniuse.feature, document.querySelector(".head dl"), caniuse);
  }
  for (const el of document.querySelectorAll("section[data-caniuse]")) {
    canIUse(el.dataset.caniuse, el.firstChild, caniuse);
  }
}

/**
 * MUTATES `conf.caniuse` object to hold normalized configurarion
 * @param {Object|String} conf   configuration settings
 */
function normalizeConf(conf) {
  const DEFAULTS = {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours (in ms)
    browsers: ["chrome", "firefox", "safari", "edge"],
    versions: 4,
  };

  if (!conf.caniuse) {
    conf.caniuse = DEFAULTS;
    return;
  }
  if (typeof conf.caniuse === "string") {
    conf.caniuse = { feature: conf.caniuse, ...DEFAULTS };
    return;
  }
  if (Array.isArray(conf.caniuse.browsers)) {
    conf.caniuse.browsers = conf.caniuse.browsers.map(b => b.toLowerCase());
  } else if (conf.caniuse.browsers !== "ALL") {
    conf.caniuse.browsers = DEFAULTS.browsers;
  }
  if (conf.caniuse.maxAge === undefined) conf.caniuse.maxAge = DEFAULTS.maxAge;
  if (!conf.caniuse.versions) conf.caniuse.versions = DEFAULTS.versions;
}

/**
 * main canIUse function
 * @param  {String} key              which api to look for
 * @param  {Node} parent             adds table after parent
 * @param {Object} conf              normalized respecConfig.caniuse
 */
async function canIUse(key, parent, conf) {
  const url = `https://raw.githubusercontent.com/Fyrd/caniuse/master/features-json/${key}.json`;

  const cache = await IDBCache("respec-caniuse");

  // use data from cache data if valid and render
  try {
    const cachedStats = await cache.get(key);
    if (cachedStats
      && new Date() - new Date(cachedStats.cacheTime) < conf.maxAge) {
      return showData(key, cachedStats.stats, conf, parent);
    }
  } catch (err) {
    console.error("[core/caniuse]", err);
  }

  // otherwise fetch new data, cache and render
  const placeholder = createPlaceholder(key, parent);
  try {
    const json = await getJson(url);
    showData(key, json.stats, conf, parent);
    cache.set(key, { stats: json.stats, cacheTime: new Date() })
      .catch(err => console.error("[core/caniuse] (Could not cache)", err));
  } catch (err) {
    showError(err, key, placeholder);
  }
}

/**
 * creates a placeholder while the API fetches results
 * @param  {String} key     API feature name
 * @param  {Node} parent    where to create placeholder
 * @return {Node}           inserted placeholder
 */
function createPlaceholder(key, parent) {
  const placeholder = hyperHTML`
    <div class="caniuse" id="${`caniuse-${key}`}">
      <dt class="caniuse-title">
        Can I Use this API? (${key})
      </dt>
      <dd>fetching data from caniuse.com... </dl>
    </div>`;
  return parent.parentNode.insertBefore(placeholder, parent.nextSibling);
}

// TODO: replace with fetch in core/github ?
async function getJson(url) {
  const response = await window.fetch(url);
  if (!response.ok) {
    if (response.status === 404) {
      console.error(`The resource ${url} could not be found (HTTP 404)`);
      throw new Error("Could not fetch GitHub resource (HTTP 404)");
    }
    const errorMsg = `GitHub Response not OK. Probably exceeded request limit. (HTTP ${response.status})`;
    console.error(`${errorMsg}. Resource = ${url}`);
    throw new Error(errorMsg);
  }
  return await response.json();
}

function showError(err, key, placeholder) {
  const permalink = `http://caniuse.com/#feat=${key}`;
  hyperHTML.bind(placeholder.querySelector("dd"))`
    Error [core/caniuse]: ${err.message}.
    <br>Please check directly on <a href="${permalink}">${permalink}</a>.`;
}

const BROWSERS = { // browser name dictionary
  chrome: "Chrome",
  firefox: "Firefox",
  ie: "IE",
  edge: "Edge",
  android: "Android",
  safari: "Safari",
  opera: "Opera",
  bb: "Blackberry",
  and_uc: "UC (Android)",
  and_ff: "Firefox (Android)",
};

/**
 * render the canIUse support table
 * @param  {String} key       API name
 * @param  {Object} stats     CanIUse API results
 * @param  {Node} parent      where to render table
 * @param  {Object} conf      respecConfig.caniuse
 */
function showData(key, stats, conf, parent) {
  let browsers = conf.browsers;
  if (conf.browsers === "ALL") {
    browsers = Object.keys(stats);
  }

  // utils
  const canIUseId = `caniuse-${key}`;
  const permalink = `http://caniuse.com/#feat=${key}`;

  const validBrowsers = browsers.filter(b => b in stats);
  if (validBrowsers.length !== browsers.length) {
    pub("warn", `Unsupported value(s) in \`conf.caniuse.browsers\`.
    The following were ignored: \`[${browsers.filter(b => !(b in stats))}]\``);
  }

  // render the support table
  const caniuse = hyperHTML`
    <div class="caniuse" id="${canIUseId}">
      <dt>Can I Use this API? (${key})</dt>
      <div class="caniuse-stats">
        ${validBrowsers.map(browser =>
          addBrowser(browser, conf.versions, stats[browser])
        )}
        <a href="${permalink}" title="Get details at caniuse.com">
          More info
        </a>
      </div>
    </div>`;

  const old = document.getElementById(canIUseId);
  if (old) old.remove();
  parent.parentNode.insertBefore(caniuse, parent.nextSibling);

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
      `<div class="caniuse-cell ${getSupport(version)}">${version}</div>`;

    const browserVersions = Object.keys(browserData)
      .sort(semverCompare)
      .slice(-(numVersions + 1)) // plus 1 current
      .reverse();

    return hyperHTML`
    <div class="caniuse-browser">
      <div class="${`caniuse-cell ${getSupport(browserVersions[0])}`}">
        ${BROWSERS[browser] || browser} ${browserVersions[0]}
      </div>
      <div class="caniuse-col">
        ${browserVersions.slice(1).map(addBrowserVersion)}
      </div>
    </div>`;
  }
}

// promise based interface to IDB
// supported methods: get, set, remove, clear, keys
async function IDBCache(name, stores = ["caniuse"], version = 1) {
  let db = null;
  function getDatabase() {
    if (!db) {
      db = new Promise((resolve, reject) => {
        const request = window.indexedDB.open(name, version);
        request.onerror = () => reject(request.error);
        request.onupgradeneeded = () =>
          stores.forEach(storeName =>
            request.result.createObjectStore(storeName));
        request.onsuccess = () => resolve(request.result);
      });
    }
    return db;
  }

  async function getStore(store, type) {
    const db = await getDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(store, type);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      return resolve(transaction.objectStore(store));
    });
  }

  function getResponse(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function get(key, storeName = "caniuse") {
    const store = await getStore(storeName, "readonly");
    return await getResponse(store.get(key));
  }

  async function set(key, value, storeName = "caniuse") {
    const store = await getStore(storeName, "readwrite");
    return await getResponse(store.put(value, key));
  }

  async function remove(key, storeName = "caniuse") {
    const store = await getStore(storeName, "readwrite");
    return await getResponse(store.delete(key));
  }

  async function clear(storeName = "caniuse") {
    const store = await getStore(storeName, "readwrite");
    return await getResponse(store.clear());
  }

  async function keys(storeName = "caniuse") {
    const store = await getStore(storeName, "readonly");
    return await getResponse(store.getAllKeys());
  }

  db = await getDatabase();
  return { get, set, remove, clear, keys }; // export
}
