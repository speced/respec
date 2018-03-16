/*
Module: "core/caniuse"
Adds a caniuse support table for a "key" #1238

`conf = { caniuse: key }` =>
  .. the table is added below `.head`
`<section data-caniuse=key>` =>
  .. table will be added after section's first element (usually section heading)
Optional: Set `conf.caniuse.browsers` to set which browsers will be shown in the table
  VALUES: `"ALL"` or and array of caniuse supported browser names
  (otherwise `DEFAULT_BROWSERS` will be used).
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

export function run({ caniuse }) {
  updateConfig(caniuse);
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
 * @param  {Node} el                          add table after el
 */
async function canIUse(key, el, conf) {
  const url = `https://raw.githubusercontent.com/Fyrd/caniuse/master/features-json/${key}.json`;

  // use data from localStorage data if valid and render
  const cached = localStorage.getItem(`caniuse-${key}`);
  if (cached) {
    const stats = JSON.parse(cached);
    if (new Date() - new Date(stats.$cacheTime) < conf.maxAge) {
      return showData(key, stats, el, conf);
    }
  }
  // otherwise fetch new data and render
  const placeholder = createPlaceholder(key, el);
  const handleResponse = ({ stats }) => showData(key, stats, el, conf);
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
  const canIUseId = `caniuse-${key}`;
  const placeholder = hyperHTML`
    <div class="caniuse" id="${canIUseId}">
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
 * @param  {Node} parent   where to render table
 * @param  {Array:string} browsers lost of browsers to show support for
 */
function showData(key, stats, parent, conf) {
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
      <div class="caniuse-stats">${validBrowsers.map(addBrowser)} <a href="${permalink}" title="Get details on caniuse.com">More info</a></div>
    </div>`;

  const old = document.getElementById(canIUseId);
  if (old) old.remove();
  parent.parentNode.insertBefore(caniuse, parent.nextSibling);

  /**
   * add a browser to table
   * @param {String} name of browser (as in CanIUse API response)
   * external variables:
   *  - stats: API response data.stats
   *  - BROWSERS: dictionary of browser names
   */
  function addBrowser(browser) {
    const browserData = stats[browser];
    if (!browserData) return "";

    const getSupport = version =>
      browserData[version].split("#", 1)[0].trim();

    const addBrowserVersion = version =>
      `<div class="caniuse-cell ${getSupport(version)}">${version}</div>`;

    const browserVersions = Object.keys(browserData)
      .sort(semverCompare)
      .slice(-(conf.versions + 1)) // plus 1 current
      .reverse();
    const currentVersion = `caniuse-cell ${getSupport(browserVersions[0])}`;
    return hyperHTML`
      <div class="caniuse-browser">
        <div class="${currentVersion}">${BROWSERS[browser] || browser} ${browserVersions[0]}</div>
        <div class="caniuse-col">
          ${browserVersions.slice(1).map(addBrowserVersion)}
        </div>
      </div>`;
  } // end:addBrowser
}
