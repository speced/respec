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
  const contentPromise = new Promise(async resolve => {
    let content;
    try {
      const stats = await fetchAndCacheJson(mdnBrowserSupport);
      content = createTableHTML(mdnBrowserSupport, stats);
    } catch (err) {
      console.error(err);
      const msg =
        `Couldn't find feature "${feature}" on https://github.com/mdn/browser-compat-data? ` +
        "Please check the feature key on [mdn-browser-compat](https://github.com/mdn/browser-compat-data)";
      pub("error", msg);
      content = hyperHTML`<a href="${featureURL}">caniuse.com</a>`;
    }
    resolve(content);
  });
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

function createTableHTML(conf, stats) {
  // render the support table
  console.log(conf);
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
    const newNode = hyperHTML `
      <div class="mbc-stats">
        <div class="mbc-cell y">chrome ${newStats.__compat.support.chrome.version_added}</div>
        <div class="mbc-cell y">safari ${newStats.__compat.support.safari.version_added}</div>
        <div class="mbc-cell y">firefox ${newStats.__compat.support.firefox.version_added}</div>
        <div class="mbc-cell y">edge ${newStats.__compat.support.edge.version_added}</div>
        <div class="mbc-cell"><a href="${newStats.__compat.mdn_url}">more info</a></div>
      </div>
    `;
    console.log(refElement.parentNode.insertBefore(newNode, refElement.nextSibling.nextSibling));
  });
}
