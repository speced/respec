/**
 * Module: "core/mdn-browser-compat"
 * Adds a mdn support table for a "feature" #1693
 * Usage options: [[to be updated]]
 */
import { createResourceHint, fetchAndCache } from "./utils";
import { pub, sub } from "./pubsubhub";
import mbcCss from "text!../../assets/mdn-browser-compat.css";
import hyperHTML from "hyperhtml";

export const name = "core/mdn-browser-compat";

const GH_USER_CONTENT_URL =
  "https://raw.githubusercontent.com/mdn/browser-compat-data/master/";

export async function run(conf) {
  if (!conf.mdnBrowserSupport) {
    return; // nothing to do.
  }
  normalizeConf(conf);
  const { mdnBrowserSupport } = conf;

  if (!mdnBrowserSupport.feature) {
    return; // no feature to show
  }

  const { feature, category } = mdnBrowserSupport;
  const featureURL = `https://github.com/mdn/browser-compat-data/blob/master/${category}/${feature}.json`;
  const link = createResourceHint({
    hint: "preconnect",
    href: "https://raw.githubusercontent.com",
  });
  document.head.appendChild(link);
  document.head.appendChild(hyperHTML`
    <style class="removeOnSave">${mbcCss}</style>`);

  const headDlElem = document.querySelector(".head dl");
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
  conf.mdnBrowserSupport = { feature: conf.mdnBrowserSupport.feature, category: conf.mdnBrowserSupport.category, ...DEFAULTS };
  return;
}

async function fetchAndCacheJson(mdnBrowserSupportConf) {
  const { apiURL, category, feature, maxAge } = mdnBrowserSupportConf;
  const url = apiURL
    ? apiURL.replace("{FEATURE}", feature) & apiURL.replace("{CATEGORY}", category)
    : `${GH_USER_CONTENT_URL}${category}/${feature}.json`;

  const request = new Request(url);
  const response = await fetchAndCache(request, maxAge);
  const stats = await response.json();
  return stats[`${category}`];
}

const mappingTable = {
  "true": ["Yes", "y"],
  "false": ["No", "n"],
  "null": ["?", "c"],
}

function createTablesHTML(conf, stats) {
  // render the support table
  const { browsers, feature, category } = conf;
  const nodePoints = document.querySelectorAll(`section[data-dfn-for="${feature}"] dfn`);
  let fragments = [];
  nodePoints.forEach(node => {
    fragments.push({
      fragment: node.innerText.replace("()", ""),
      id: node.id
    });
  });
  fragments.forEach(el => {
    const { fragment, id } = el;
    const newStats = stats[`${feature}`][`${fragment}`];
    const refElement = document.getElementById(`${id}`);
    const newNode = new DocumentFragment();
    const featureURL = `check out more on ${newStats.__compat.mdn_url}`;
    hyperHTML.bind(newNode) `
      <div class="mbc-stats">
        ${conf.browsers
        .map(browser => addBrowser(browser, newStats.__compat.support[browser]))
        .filter(elem => elem)}
        <a title="${featureURL}" href="${newStats.__compat.mdn_url}">More info</a>
      </div>`;
    refElement.parentNode.insertBefore(newNode, refElement.nextSibling.nextSibling);
  });

  function addBrowser(browser, newStats) {
    let t, cssClass, version;
    if(typeof newStats.version_added === "string") {
      version = newStats.version_added;
      cssClass = "mbc-cell y";
    } else {
      version = mappingTable[newStats.version_added][0];
      cssClass = `mbc-cell ${mappingTable[newStats.version_added][1]}`;
    }
    if(Object.keys(newStats).length > 1) {
      return hyperHTML `
        <div class="mbc-browser">
          <button class="${cssClass}">${browser} ${version} *</button>
          <ul>
            ${extractKeys(Object.keys(newStats), newStats)}
          </ul>
        </div>`;
    } else {
      return hyperHTML `
        <div class="mbc-browser">
          <button class="${cssClass}">${browser} ${version}</button>
        </div>`;
    }
    function extractKeys(keys, stats) {
      return hyperHTML `
        ${keys
          .map(key => addDetail(key, stats))
          .filter(elem => elem)}
        `
      function addDetail(key, stats) {
        if(key === "version_added")
          return;
        return hyperHTML `
          <li title="${JSON.stringify(stats[key], null, 4)}" class="mbc-cell i">
            ${key}
          </li>`;
      }
    }
  }
}
