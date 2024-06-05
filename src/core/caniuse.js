// @ts-check
/**
 * Module: "core/caniuse"
 * Adds a caniuse support table for a "feature" #1238
 * Usage options: https://github.com/speced/respec/wiki/caniuse
 */
import { codedJoinAnd, docLink, showError, showWarning } from "./utils.js";
import { pub, sub } from "./pubsubhub.js";
import css from "../styles/caniuse.css.js";
import { html } from "./import-maps.js";

export const name = "core/caniuse";

const API_URL = "https://respec.org/caniuse/";

export const BROWSERS = new Map([
  ["and_chr", { name: "Android Chrome", path: "chrome", type: "mobile" }],
  ["and_ff", { name: "Android Firefox", path: "firefox", type: "mobile" }],
  ["and_uc", { name: "Android UC", path: "uc", type: "mobile" }],
  ["chrome", { name: "Chrome", type: "desktop" }],
  ["edge", { name: "Edge", type: "desktop" }],
  ["firefox", { name: "Firefox", type: "desktop" }],
  ["ios_saf", { name: "iOS Safari", path: "safari-ios", type: "mobile" }],
  ["op_mob", { name: "Opera Mobile", path: "opera", type: "mobile" }],
  ["opera", { name: "Opera", type: "desktop" }],
  ["safari", { name: "Safari", type: "desktop" }],
  [
    "samsung",
    { name: "Samsung Internet", path: "samsung-internet", type: "mobile" },
  ],
]);

const statToText = new Map([
  ["a", "almost supported (aka Partial support)"],
  ["d", "disabled by default"],
  ["n", "no support, or disabled by default"],
  ["p", "no support, but has Polyfill"],
  ["u", "unknown support"],
  ["x", "requires prefix to work"],
  ["y", "supported by default"],
]);

export function prepare(conf) {
  if (!conf.caniuse) {
    return; // nothing to do.
  }
  normalizeCaniuseConf(conf);
  validateBrowsers(conf);
  const options = conf.caniuse;
  if (!options.feature) {
    return; // no feature to show
  }

  document.head.appendChild(
    html`<style
      id="caniuse-stylesheet"
      class="${options.removeOnSave ? "removeOnSave" : ""}"
    >
      ${css}
    </style>`
  );
}
/**
 * @param {string} browser
 * @returns
 */
function getLogoSrc(browser) {
  const path = BROWSERS.get(browser).path ?? browser;
  return `https://www.w3.org/assets/logos/browser-logos/${path}/${path}.svg`;
}

export async function run(conf) {
  const options = conf.caniuse;
  if (!options?.feature) return;

  const featureURL = new URL(options.feature, "https://caniuse.com/").href;
  const headDlElem = document.querySelector(".head dl");
  const contentPromise = fetchStats(conf.caniuse)
    .then(json => processJson(json, options))
    .catch(err => handleError(err, options, featureURL));
  const definitionPair = html`<dt class="caniuse-title">Browser support:</dt>
    <dd class="caniuse-stats">
      ${{
        any: contentPromise,
        placeholder: "Fetching data from caniuse.com...",
      }}
    </dd>`;
  headDlElem.append(...definitionPair.childNodes);
  await contentPromise;
  pub("amend-user-config", { caniuse: options.feature });
  if (options.removeOnSave) {
    // Will remove the browser support cells.
    headDlElem
      .querySelectorAll(".caniuse-browser")
      .forEach(elem => elem.classList.add("removeOnSave"));
    sub("beforesave", outputDoc => {
      html.bind(outputDoc.querySelector(".caniuse-stats"))`
        <a href="${featureURL}">caniuse.com</a>`;
    });
  }
}

function handleError(err, options, featureURL) {
  const msg = `Failed to retrieve feature "${options.feature}".`;
  const hint = docLink`Please check the feature key on [caniuse.com](https://caniuse.com) and update ${"[caniuse]"}.`;
  showError(msg, name, { hint });
  console.error(err);
  return html`<a href="${featureURL}">caniuse.com</a>`;
}

/**
 * returns normalized `conf.caniuse` configuration
 * @param {Object} conf   configuration settings
 */
function normalizeCaniuseConf(conf) {
  const defaultBrowsers = new Set(BROWSERS.keys());
  defaultBrowsers.delete("op_mob");
  defaultBrowsers.delete("opera");
  const DEFAULTS = { removeOnSave: true, browsers: [...defaultBrowsers] };
  if (typeof conf.caniuse === "string") {
    conf.caniuse = { feature: conf.caniuse, ...DEFAULTS };
    return;
  }
  conf.caniuse = { ...DEFAULTS, ...conf.caniuse };
}

function validateBrowsers({ caniuse }) {
  const { browsers } = caniuse;
  const invalidBrowsers = browsers.filter(browser => !BROWSERS.has(browser));
  if (invalidBrowsers.length) {
    const names = codedJoinAnd(invalidBrowsers, { quotes: true });
    const msg = docLink`Invalid browser(s): (${names}) in the \`browser\` property of ${"[caniuse]"}.`;
    showWarning(msg, name);
  }
}

async function processJson(json, { feature }) {
  /** @type {Array} */
  const results = json.result;
  const groups = new Map([
    ["desktop", []],
    ["mobile", []],
  ]);
  const toBrowserCell = browserCellRenderer(feature);
  results.reduce(toBrowserCell, groups);
  const out = [...groups]
    .filter(([, arr]) => arr.length)
    .map(
      ([key, arr]) =>
        html`<div class="caniuse-group">
          <div class="caniuse-browsers">${arr}</div>
          <div class="caniuse-type"><span>${key}</div>
        </div>`
    );
  out.push(
    html`<a class="caniuse-cell" href="https://caniuse.com/${feature}"
      >More info</a
    >`
  );
  return out;
}

function browserCellRenderer(feature) {
  return (groups, { browser: browserId, version, caniuse }) => {
    const { name, type } = BROWSERS.get(browserId);
    const versionLong = version ? ` version ${version}` : "";
    const browserName = `${name}${versionLong}`;
    const supportLevel = statToText.get(caniuse);
    const ariaLabel = `${feature} is ${supportLevel} since ${browserName} on ${type}.`;
    const cssClass = `caniuse-cell ${caniuse}`;
    const title = capitalize(`${supportLevel} since ${browserName}.`);
    const textVersion = version ? version : "—";
    const src = getLogoSrc(browserId);
    const result = html`
      <div class="${cssClass}" title="${title}" aria-label="${ariaLabel}">
        <img
          class="caniuse-browser"
          width="20"
          height="20"
          src="${src}"
          alt="${name} logo"
        /><span class="browser-version">${textVersion}</span>
      </div>
    `;
    groups.get(type).push(result);
    return groups;
  };
}

/**
 * @typedef {Record<string, [string, string[]][]>} ApiResponse
 * @throws {Error} on failure
 */
async function fetchStats(options) {
  const { feature, browsers, apiURL } = options;
  const url = new URL(apiURL || `./${feature}`, API_URL);
  browsers.forEach(browser => url.searchParams.append("browsers", browser));
  const response = await fetch(url);
  if (!response.ok) {
    const { status, statusText } = response;
    throw new Error(`Failed to get caniuse data: (${status}) ${statusText}`);
  }
  return response.json();
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
