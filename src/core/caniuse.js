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
  const options = getNormalizedConf(conf);
  conf.caniuse = options; // for tests
  if (!options.feature) {
    return; // no feature to show
  }

  document.head.appendChild(html`<style
    id="caniuse-stylesheet"
    class="${options.removeOnSave ? "removeOnSave" : ""}"
  >
    ${css}
  </style>`);

  const apiUrl = options.apiURL || API_URL;
  // Initiate a fetch, but do not wait. Try to fill the cache early instead.
  conf.state[name] = {
    fetchPromise: fetchStats(apiUrl, options),
  };
}

export async function run(conf) {
  const options = conf.caniuse;
  if (!options?.feature) return;

  const featureURL = new URL(options.feature, "https://caniuse.com/").href;

  const headDlElem = document.querySelector(".head dl");
  const contentPromise = (async () => {
    try {
      const stats = await conf.state[name].fetchPromise;
      return html`${{ html: stats }}`;
    } catch (err) {
      const msg = `Couldn't find feature "${options.feature}" on caniuse.com.`;
      const hint = docLink`Please check the feature key on [caniuse.com](https://caniuse.com) and update ${"[caniuse]"}`;
      showError(msg, name, { hint });
      console.error(err);
      return html`<a href="${featureURL}">caniuse.com</a>`;
    }
  })();
  const definitionPair = html`<dt class="caniuse-title">
      Browser support (caniuse.com):
    </dt>
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

/**
 * returns normalized `conf.caniuse` configuration
 * @param {Object} conf   configuration settings
 */
function getNormalizedConf(conf) {
  const DEFAULTS = { versions: 4, removeOnSave: false };
  if (typeof conf.caniuse === "string") {
    return { feature: conf.caniuse, ...DEFAULTS };
  }
  const caniuseConf = { ...DEFAULTS, ...conf.caniuse };
  const { browsers } = caniuseConf;
  if (Array.isArray(browsers)) {
    const invalidBrowsers = browsers.filter(browser => !BROWSERS.has(browser));
    if (invalidBrowsers.length) {
      const names = codedJoinAnd(invalidBrowsers, { quotes: true });
      const msg = docLink`Invalid browser(s): (${names}) in the \`browser\` property of ${"[caniuse]"}.`;
      showWarning(msg, name);
    }
  }
  return caniuseConf;
}

/**
 * @param {string} apiURL
 * @typedef {Record<string, [string, string[]][]>} ApiResponse
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
  searchParams.set("format", "html");
  const url = `${apiURL}?${searchParams.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    const { status, statusText } = response;
    throw new Error(`Failed to get caniuse data: (${status}) ${statusText}`);
  }
  const stats = await response.text();
  return stats;
}
