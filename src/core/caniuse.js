// @ts-check
/**
 * Module: "core/caniuse"
 * Adds a caniuse support table for a "feature" #1238
 * Usage options: https://github.com/w3c/respec/wiki/caniuse
 */
import { codedJoinAnd, docLink, showError, showWarning } from "./utils.js";
import { pub, sub } from "./pubsubhub.js";
import css from "../styles/caniuse.css.js";
import { html } from "./import-maps.js";

export const name = "core/caniuse";

const API_URL = "https://respec.org/caniuse/";

const BROWSERS = new Set([
  "and_chr",
  "and_ff",
  "and_uc",
  "android",
  "bb",
  "chrome",
  "edge",
  "firefox",
  "ie",
  "ios_saf",
  "op_mini",
  "op_mob",
  "opera",
  "safari",
  "samsung",
]);

export function prepare(conf) {
  if (!conf.caniuse) {
    return; // nothing to do.
  }
  normalizeConf(conf);
  validateBrowsers(conf);
  const options = conf.caniuse;
  if (!options.feature) {
    return; // no feature to show
  }

  document.head.appendChild(html`<style
    id="caniuse-stylesheet"
    class="${options.removeOnSave ? "removeOnSave" : ""}"
  >
    ${css}
  </style>`);
}

function getLogoSrc(browser) {
  return `https://cdnjs.cloudflare.com/ajax/libs/browser-logos/71.0.0/${browser}/${browser}.svg`;
}

export async function run(conf) {
  const options = conf.caniuse;
  if (!options?.feature) return;

  const featureURL = new URL(options.feature, "https://caniuse.com/").href;
  const headDlElem = document.querySelector(".head dl");
  const definitionPair = html`<dt class="caniuse-title">
      Browser support (caniuse.com):
    </dt>
    <dd class="caniuse-stats">
      ${{
        any: fetchStats(conf.caniuse)
          .catch(err => handleError(err, options, featureURL))
          .then(json => processJson(json, options)),
        placeholder: "Fetching data from caniuse.com...",
      }}
    </dd>`;
  headDlElem.append(...definitionPair.childNodes);
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
  const msg = `Couldn't find feature "${options.feature}".`;
  const hint = docLink`Please check the feature key on [caniuse.com](https://caniuse.com) and update ${"[caniuse]"}.`;
  showError(msg, name, { hint });
  console.error(err);
  return html`<a href="${featureURL}">caniuse.com</a>`;
}

/**
 * returns normalized `conf.caniuse` configuration
 * @param {Object} conf   configuration settings
 */
function normalizeConf(conf) {
  const DEFAULTS = { removeOnSave: false, apiURL: API_URL, browsers: [] };
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
  const results = json.result;
  const out = results.map(({ browser, version, caniuse }) => {
    const ariaLabel =
      caniuse === "u"
        ? `${feature} is not supported in this browser.`
        : `${feature} is supported since version ${version}.`;
    return html`<li>
      <img
        width="24"
        height="24"
        src="${getLogoSrc(browser)}"
        alt="${`${browser} ${version}`}"
        title="${`${browser} ${version}`}"
        area-label="${ariaLabel}"
      />
    </li>`;
  });
  return out;
}

/**
 * @typedef {Record<string, [string, string[]][]>} ApiResponse
 * @throws {Error} on failure
 */
async function fetchStats(options) {
  const { feature, browsers, apiURL } = options;
  const url = new URL(`./${feature}/`, apiURL);
  browsers.forEach(browser => url.searchParams.append("browsers", browser));
  const response = await fetch(url);
  if (!response.ok) {
    const { status, statusText } = response;
    throw new Error(`Failed to get caniuse data: (${status}) ${statusText}`);
  }
  const stats = await response.json();
  return stats;
}
