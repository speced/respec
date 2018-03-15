/*
Module: "core/caniuse"
Adds a caniuse support table for a "key" #1238

`conf = { caniuse: key }` =>
  .. the table is added below `.head`
`<section data-caniuse=key>` =>
  .. table will be added after section's first element (usually section heading)
Optional: Set `conf.caniuseBrowsers` to set which browsers will be shown in the table
  VALUES: `"ALL"` or and array of caniuse supported browser names
  (otherwise `DEFAULT_BROWSERS` will be used).
*/

import { fetch as ghFetch } from "core/github";
import { semverCompare } from "core/utils";
import { pub } from "core/pubsubhub";
import "deps/hyperhtml";
import caniuseCss from "deps/text!core/css/caniuse.css";

// Opportunistically insert the style into the head to reduce FOUC.
const codeStyle = document.createElement("style");
codeStyle.textContent = caniuseCss;
document.head.appendChild(codeStyle);

export const name = "core/caniuse";

export async function run(conf) {
  if (conf.caniuse) {
    const el = document.querySelector(".head dl");
    canIUse(conf.caniuse, el, conf.caniuseBrowsers);
  }
  for (const el of document.querySelectorAll("section[data-caniuse]")) {
    canIUse(el.dataset.caniuse, el.firstChild, conf.caniuseBrowsers);
  }
}

const DEFAULT_BROWSERS = ["chrome", "firefox", "ie", "edge"];
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
 * main canIUse function
 * @param  {String} key                         which api to look for
 * @param  {Node} el                          add table after el
 * @param  {Array:string} [browsers=DEFAULT_BROWSERS] list of browsers to show
 */
function canIUse(key, el, browsers = DEFAULT_BROWSERS) {
  const url = `https://raw.githubusercontent.com/Fyrd/caniuse/master/features-json/${key}.json`;

  // use data from localStorage data if valid and render
  const cached = localStorage.getItem(`caniuse-${key}`);
  if (cached) {
    const stats = JSON.parse(cached);
    const CACHE_DURATION = 24 * 60 * 60 * 1000; // in ms
    if (new Date() - new Date(stats.$cacheTime) < CACHE_DURATION) {
      return showData(key, stats, el, browsers);
    }
  }
  // otherwise fetch new data and render
  const placeholder = createPlaceholder(key, el);
  const handleResponse = ({ stats }) => showData(key, stats, el, browsers);
  const handleError = err => showError(err, placeholder);
  ghFetch(url)
    .then(handleResponse)
    .catch(handleError);
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

function showError(err, placeholder) {
  placeholder.style.height = "40px";
  placeholder.querySelector("dd").innerText = `Error: ${err.message}`;
}

/**
 * render the canIUse support table
 * @param  {String} key      API name
 * @param  {Object} stats     CanIUse API results
 * @param  {Node} parent   where to render table
 * @param  {Array:string} browsers lost of browsers to show support for
 */
function showData(key, stats, parent, browsers) {
  if (typeof browsers === "string") {
    if (browsers === "ALL") {
      browsers = Object.keys(stats);
    } else {
      pub("warn", "`conf.caniuseBrowsers` is set wrong.");
      browsers = DEFAULT_BROWSERS;
    }
  }

  // utils
  const canIUseId = `caniuse-${key}`;
  const permalink = `http://caniuse.com/#feat=${key}`;

  // cache the response
  stats.$cacheTime = new Date();
  localStorage.setItem(canIUseId, JSON.stringify(stats));

  const validBrowsers = browsers.filter(b => b in stats);
  if (validBrowsers.length !== browsers.length) {
    pub("warn", "Unsupported value(s) in `conf.caniuseBrowsers`");
  }

  // render the support table
  const caniuse = hyperHTML`
    <div class="caniuse" id="${canIUseId}">
      <dt>Can I Use this API? (${key})</dt>
      <div class="caniuse-stats">${validBrowsers.map(addBrowser)} <a href="${permalink}" title="Get details on caniuse.com">More info</a></div>
    </div>`;

  const old = document.getElementById(canIUseId);
  if (old) old.parentNode.removeChild(old);
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
      .slice(-5) // 4 browser versions back + 1 current
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
