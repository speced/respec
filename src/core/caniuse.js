// @ts-check
/**
 * Module: "core/caniuse"
 * Adds a caniuse support table for a "feature" #1238
 * Usage options: https://github.com/w3c/respec/wiki/caniuse
 */
import { pub, sub } from "./pubsubhub.js";
import { showError, showWarning } from "./utils.js";
import { fetchAsset } from "./text-loader.js";
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

async function loadStyle() {
  try {
    return (await import("text!../../assets/caniuse.css")).default;
  } catch {
    return fetchAsset("caniuse.css");
  }
}

export async function prepare(conf) {
  if (!conf.caniuse) {
    return; // nothing to do.
  }
  const options = getNormalizedConf(conf);
  conf.caniuse = options; // for tests
  if (!options.feature) {
    return; // no feature to show
  }

  const caniuseCss = await loadStyle();
  document.head.appendChild(html`<style class="removeOnSave">
    ${caniuseCss}
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
      const hint =
        "Please check the feature key on [caniuse.com](https://caniuse.com)";
      showError(msg, name, { hint });
      console.error(err);
      return html`<a href="${featureURL}">caniuse.com</a>`;
    }
  })();
  const definitionPair = html`<dt class="caniuse-title">Browser support:</dt>
    <dd class="caniuse-stats">
      ${{
        any: contentPromise,
        placeholder: "Fetching data from caniuse.com...",
      }}
    </dd>`;
  headDlElem.append(...definitionPair.childNodes);
  await contentPromise;

  // remove from export
  pub("amend-user-config", { caniuse: options.feature });
  sub("beforesave", outputDoc => {
    html.bind(outputDoc.querySelector(".caniuse-stats"))`
      <a href="${featureURL}">caniuse.com</a>`;
  });
}

/**
 * returns normalized `conf.caniuse` configuration
 * @param {Object} conf   configuration settings
 */
function getNormalizedConf(conf) {
  const DEFAULTS = { versions: 4 };
  if (typeof conf.caniuse === "string") {
    return { feature: conf.caniuse, ...DEFAULTS };
  }
  const caniuseConf = { ...DEFAULTS, ...conf.caniuse };
  const { browsers } = caniuseConf;
  if (Array.isArray(browsers)) {
    const invalidBrowsers = browsers.filter(browser => !BROWSERS.has(browser));
    if (invalidBrowsers.length) {
      const names = invalidBrowsers.map(b => `"\`${b}\`"`).join(", ");
      const msg =
        `Ignoring invalid browser(s): ${names} in ` +
        "[`respecConfig.caniuse.browsers`](https://github.com/w3c/respec/wiki/caniuse)";
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
