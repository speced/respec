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

// TODO: Use IndexedDB

import { semverCompare } from "core/utils";
import { pub } from "core/pubsubhub";
import "deps/hyperhtml";
import caniuseCss from "deps/text!core/css/caniuse.css";

// Opportunistically insert the style into the head to reduce FOUC.
const codeStyle = document.createElement("style");
codeStyle.textContent = caniuseCss;
document.head.appendChild(codeStyle);

export const name = "core/caniuse";

export function run({ caniuse }) {
  updateConfig(caniuse); // normalize conf.caniuse
  if (caniuse.feature) {
    canIUse(caniuse.feature, document.querySelector(".head dl"), caniuse);
  }
  for (const el of document.querySelectorAll("section[data-caniuse]")) {
    canIUse(el.dataset.caniuse, el.firstChild, caniuse);
  }
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
 * MUTATES `conf.caniuse` object to hold normalized configurarion
 * @param {Object|String} caniuse configuration settings
 */
function updateConfig(caniuse) {
  const DEFAULTS = {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours (in ms)
    browsers: ["chrome", "firefox", "safari", "edge"],
    versions: 4,
  };

  if (!caniuse) {
    caniuse = DEFAULTS;
    return;
  }
  if (typeof caniuse === "string") {
    caniuse = { feature: caniuse, ...DEFAULTS };
    return;
  }
  if (Array.isArray(caniuse.browsers)) {
    caniuse.browsers = caniuse.browsers.map(b => b.toLowerCase());
  } else if (caniuse.browsers !== "ALL") {
    caniuse.browsers = DEFAULTS.browsers;
  }
  if (caniuse.maxAge === undefined) caniuse.maxAge = DEFAULTS.maxAge;
  if (!caniuse.versions) caniuse.versions = DEFAULTS.versions;
}

/**
 * main canIUse function
 * @param  {String} key                         which api to look for
 * @param  {Node} parent                          add table after parent
 */
async function canIUse(key, parent, conf) {
  const url = `https://raw.githubusercontent.com/Fyrd/caniuse/master/features-json/${key}.json`;

  // use data from localStorage data if valid and render
  const cached = localStorage.getItem(`caniuse-${key}`);
  if (cached) {
    const stats = JSON.parse(cached);
    if (new Date() - new Date(stats.$cacheTime) < conf.maxAge) {
      return showData(key, stats, parent, conf);
    }
  }
  // otherwise fetch new data and render
  const placeholder = createPlaceholder(key, parent);
  const handleResponse = ({ stats }) => showData(key, stats, conf, parent);
  const handleError = err => showError(err, key, placeholder);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        console.error(`The resource ${ url } could not be found (HTTP 404)`);
        throw new Error("Could not fetch GitHub resource (HTTP 404)");
      }
      throw new Error("GitHub Response not OK. Probably exceeded request limit.");
    }
    const json = await response.json();
    handleResponse(json);
  } catch (err) {
    handleError(err);
  }
}

/**
 * creates a placeholder while the API fetches results
 * @param  {String} key    API name
 * @param  {Node} parent where to create placeholder
 * @return {Node}        inserted placeholder
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

function showError(err, key, placeholder) {
  const permalink = `http://caniuse.com/#feat=${key}`;
  hyperHTML.bind(placeholder.querySelector("dd"))`
    Error [core/caniuse]: ${err.message}.
    <br>Please check directly on <a href="${permalink}">${permalink}</a>.`;
}

/**
 * render the canIUse support table
 * @param  {String} key      API name
 * @param  {Object} stats     CanIUse API results
 * @param  {Object} conf   respecConfig.caniuse
 * @param  {Node} parent   where to render table
 */
function showData(key, stats, conf, parent) {
  let browsers = conf.browsers;
  if (conf.browsers === "ALL") {
    browsers = Object.keys(stats);
  }

  // utils
  const canIUseId = `caniuse-${key}`;
  const permalink = `http://caniuse.com/#feat=${key}`;

  // cache the response
  stats.$cacheTime = new Date();
  localStorage.setItem(canIUseId, JSON.stringify(stats));

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
   * @param {String} browser name of browser (as in CanIUse API response)
   * @param {Number} numVersions number of old browser versions to show
   * @param {Object} browserData stats data from api response
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
