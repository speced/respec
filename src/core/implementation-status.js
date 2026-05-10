// @ts-check
/**
 * Module: "core/implementation-status"
 * Adds an implementation status badge to the spec front matter,
 * showing Baseline browser availability from web-features data.
 *
 * Baseline name and logos are trademarks of Google LLC, used under
 * the CC BY-ND 4.0 license. See usage guidelines:
 * https://web-platform-dx.github.io/web-features/name-and-logo-usage-guidelines/
 */
import { docLink, fetchAndCache, showWarning } from "./utils.js";
import { pub, sub } from "./pubsubhub.js";
import css from "../styles/implementation-status.css.js";
import { html } from "./import-maps.js";

export const name = "core/implementation-status";

const DATA_URL = "https://respec.org/api/baseline";
const SEARCH_URL = "https://respec.org/api/baseline/search";
const LOGO_BASE = "https://www.w3.org/assets/logos/browser-logos";

const BROWSERS = new Map([
  ["chrome", { name: "Chrome", engine: "chromium" }],
  ["edge", { name: "Edge", engine: "chromium" }],
  ["firefox", { name: "Firefox", engine: "gecko" }],
  ["safari", { name: "Safari", engine: "webkit" }],
]);

/** @type {Map<string, string>} */
const STATUS_TEXT = new Map([
  ["high", "Widely available"],
  ["low", "Newly available"],
  ["", "Limited availability"],
]);

/** @type {Map<string, () => HTMLElement>} */
const BASELINE_ICONS = new Map([
  [
    "",
    () =>
      html`<svg class="baseline-icon" viewBox="0 0 36 20">
        <path fill="#f09409" d="M10 0L16 6L14 8L8 2L10 0Z" />
        <path fill="#f09409" d="M22 12L20 14L26 20L28 18L22 12Z" />
        <path fill="#f09409" d="M26 0L28 2L10 20L8 18L26 0Z" />
        <path fill="#c6c6c6" d="M8 2L10 4L4 10L10 16L8 18L0 10L8 2Z" />
        <path fill="#c6c6c6" d="M28 2L36 10L28 18L26 16L32 10L26 4L28 2Z" />
      </svg>`,
  ],
  [
    "high",
    () =>
      html`<svg class="baseline-icon" viewBox="0 0 36 20">
        <path fill="#1ea446" d="M18 8L20 10L18 12L16 10L18 8Z" />
        <path fill="#1ea446" d="M26 0L28 2L10 20L0 10L2 8L10 16L26 0Z" />
        <path
          fill="#c4eed0"
          d="M28 2L26 4L32 10L26 16L22 12L20 14L26 20L36 10L28 2Z"
        />
        <path fill="#c4eed0" d="M10 0L2 8L4 10L10 4L14 8L16 6L10 0Z" />
      </svg>`,
  ],
  [
    "low",
    () =>
      html`<svg class="baseline-icon" viewBox="0 0 36 20">
        <path
          fill="#a8c7fa"
          d="m10 0 2 2-2 2-2-2 2-2Zm4 4 2 2-2 2-2-2 2-2Zm16 0 2 2-2 2-2-2 2-2Zm4 4 2 2-2 2-2-2 2-2Zm-4 4 2 2-2 2-2-2 2-2Zm-4 4 2 2-2 2-2-2 2-2Zm-4-4 2 2-2 2-2-2 2-2ZM6 4l2 2-2 2-2-2 2-2Z"
        />
        <path fill="#1b6ef3" d="m26 0 2 2-18 18L0 10l2-2 8 8L26 0Z" />
      </svg>`,
  ],
]);

const SUPPORT_ICONS = {
  available: () =>
    html`<svg
      class="baseline-support-icon"
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="21"
      fill="none"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M1.253 3.31a8.843 8.843 0 0 1 5.47-1.882c4.882 0 8.838 3.927 8.838 8.772 0 4.845-3.956 8.772-8.837 8.772a8.842 8.842 0 0 1-5.47-1.882c-.237.335-.49.657-.758.966a10.074 10.074 0 0 0 6.228 2.14c5.562 0 10.07-4.475 10.07-9.996 0-5.52-4.508-9.996-10.07-9.996-2.352 0-4.514.8-6.228 2.14.268.309.521.631.757.966Z"
      />
      <path
        fill="currentColor"
        d="M11.348 8.125 6.34 13.056l-3.006-2.954 1.002-.985 1.999 1.965 4.012-3.942 1.002.985Z"
      />
    </svg>`,
  unavailable: () =>
    html`<svg
      class="baseline-support-icon"
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="21"
      fill="none"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M1.254 3.31a8.843 8.843 0 0 1 5.47-1.882c4.881 0 8.838 3.927 8.838 8.772 0 4.845-3.957 8.772-8.838 8.772a8.842 8.842 0 0 1-5.47-1.882c-.236.335-.49.657-.757.966a10.074 10.074 0 0 0 6.227 2.14c5.562 0 10.071-4.475 10.071-9.996 0-5.52-4.509-9.996-10.07-9.996-2.352 0-4.515.8-6.228 2.14.268.309.52.631.757.966Z"
      />
      <path
        fill="currentColor"
        d="m10.321 8.126-1.987 1.972 1.987 1.972-.993.986-1.987-1.972-1.987 1.972-.993-.986 1.986-1.972-1.986-1.972.993-.986 1.987 1.972L9.328 7.14l.993.986Z"
      />
    </svg>`,
};

/** @type {Map<string, string[]>} */
const BROWSER_GROUPS = Map.groupBy(
  BROWSERS.keys(),
  id => /** @type {{ engine: string }} */ (BROWSERS.get(id)).engine
);

/**
 * @typedef {{
 *   feature?: string | null;
 *   removeOnSave?: boolean;
 *   apiURL?: string;
 * }} ImplementationStatusOptions
 */

/**
 * @typedef {{
 *   implementationStatus?: boolean | string | ImplementationStatusOptions;
 *   edDraftURI?: string;
 *   shortName?: string;
 *   thisVersion?: string;
 * }} RespecConfig
 */

/**
 * @typedef {{
 *   name?: string;
 *   kind?: "feature" | "moved" | "split" | "group";
 *   spec?: string | string[];
 *   status?: {
 *     baseline?: "high" | "low" | false;
 *     support?: Record<string, unknown>;
 *   };
 * }} WebFeature
 */

/** @typedef {WebFeature & { id: string }} WebFeatureEntry */

/** @typedef {{ features?: Record<string, WebFeature> } | Record<string, WebFeature>} WebFeaturesData */

function fallbackResult() {
  return {
    dt: html`Implementation status:`,
    dd: html`<a href="https://webstatus.dev/">Web Platform Status</a>`,
    moreInfoUrl: "https://webstatus.dev/",
  };
}

/** @param {RespecConfig} conf */
export function prepare(conf) {
  if (!conf.implementationStatus) return;
  normalizeConf(conf);
  const options = /** @type {ImplementationStatusOptions} */ (
    conf.implementationStatus
  );
  document.head.appendChild(
    html`<style
      id="baseline-stylesheet"
      class="${options.removeOnSave ? "removeOnSave" : ""}"
    >
      ${css}
    </style>`
  );
}

/** @param {RespecConfig} conf */
export async function run(conf) {
  if (!conf.implementationStatus) return;

  const options = /** @type {ImplementationStatusOptions} */ (
    conf.implementationStatus
  );
  const headDlElem = document.querySelector(".head dl");
  if (!headDlElem) return;

  const result = fetchAndRender(conf, options).catch(handleError);

  const dtPromise = result.then(r => r.dt);
  const ddPromise = result.then(r => r.dd);

  const definitionPair = html`<dt class="baseline-title">
      ${{ any: dtPromise, placeholder: "Implementation status:" }}
    </dt>
    <dd class="baseline-status">
      ${{ any: ddPromise, placeholder: "Checking availability..." }}
    </dd>`;
  headDlElem.append(...definitionPair.childNodes);

  const rendered = await result;

  if (options.removeOnSave) {
    const savedUrl = rendered.moreInfoUrl || "https://webstatus.dev/";
    sub(
      "beforesave",
      /** @param {Document} outputDoc */ outputDoc => {
        const dd = outputDoc.querySelector(".baseline-status");
        if (!dd) return;
        html.bind(dd)`<a href="${savedUrl}">Web Platform Status</a>`;
      }
    );
  }
}

/** @param {unknown} err */
function handleError(err) {
  const msg = "Failed to retrieve implementation status data.";
  const hint = docLink`Check the ${"[implementationStatus]"} configuration.`;
  showWarning(msg, name, {
    hint,
    cause: err instanceof Error ? err : undefined,
  });
  return fallbackResult();
}

/** @param {RespecConfig} conf */
function normalizeConf(conf) {
  const DEFAULTS = { removeOnSave: false };
  if (typeof conf.implementationStatus === "boolean") {
    conf.implementationStatus = { feature: null, ...DEFAULTS };
    return;
  }
  if (typeof conf.implementationStatus === "string") {
    conf.implementationStatus = {
      feature: conf.implementationStatus,
      ...DEFAULTS,
    };
    return;
  }
  conf.implementationStatus = { ...DEFAULTS, ...conf.implementationStatus };
}

/**
 * @param {RespecConfig} conf
 * @param {ImplementationStatusOptions} options
 */
async function fetchAndRender(conf, options) {
  const features = await fetchFeatures(conf, options);

  if (!features.length) {
    const msg = options.feature
      ? `No Baseline data found for feature "${options.feature}".`
      : "No Baseline data found for this specification.";
    const hint = options.feature
      ? `Find feature IDs in [web-features data](https://github.com/web-platform-dx/web-features/blob/main/data.json).`
      : undefined;
    showWarning(msg, name, { hint });
    return fallbackResult();
  }

  const baseline = computeAggregate(features);
  const statusText = STATUS_TEXT.get(baseline);
  const support = aggregateSupport(features);

  pub("amend-user-config", { implementationStatus: options.feature || true });

  return renderBadge(baseline, statusText, support, features);
}

/**
 * Fetch features using the most efficient endpoint available.
 * - Explicit feature ID: GET /api/baseline/:feature
 * - Auto-detect by spec URLs: POST /api/baseline/search
 * - Custom apiURL: fetch full dataset and search client-side (legacy)
 * @param {RespecConfig} conf
 * @param {ImplementationStatusOptions} options
 * @returns {Promise<WebFeatureEntry[]>}
 */
async function fetchFeatures(conf, options) {
  // Custom apiURL: legacy full-dataset mode
  if (options.apiURL) {
    const data = await fetchData(options);
    return findFeatures(data, conf, options);
  }

  // Explicit feature ID: single lookup
  if (options.feature) {
    const url = `${DATA_URL}/${encodeURIComponent(options.feature)}`;
    const response = await fetchAndCache(url);
    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(
        `Failed to fetch Baseline data for feature "${options.feature}": HTTP ${response.status}`
      );
    }
    const feature = await response.json();
    if (feature.split_into?.length) {
      return feature.split_into.filter(isUsableFeature);
    }
    return [{ id: options.feature, ...feature }];
  }

  // Auto-detect: send spec URLs to server for matching
  const specUrls = getSpecUrls(conf);
  if (!specUrls.length) return [];

  try {
    const response = await fetch(SEARCH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ specs: specUrls }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const { result } = await response.json();
    return result || [];
  } catch (err) {
    console.warn(
      `[${name}] Search endpoint failed, falling back to full dataset`,
      err
    );
    const data = await fetchData(options);
    return findFeatures(data, conf, options);
  }
}

/** @param {ImplementationStatusOptions} options */
async function fetchData(options) {
  const url = options.apiURL || DATA_URL;
  const response = await fetchAndCache(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Moved, split, and group entries redirect to other features and lack status.
 * @param {WebFeature} f
 */
function isUsableFeature(f) {
  return !f.kind || f.kind === "feature";
}

/**
 * @param {WebFeaturesData} data
 * @param {RespecConfig} conf
 * @param {ImplementationStatusOptions} options
 * @returns {WebFeatureEntry[]}
 */
function findFeatures(data, conf, options) {
  const features = /** @type {Record<string, WebFeature>} */ (
    data.features || data
  );

  if (options.feature) {
    const feature = features[options.feature];
    if (!feature || !isUsableFeature(feature)) return [];
    return [{ id: options.feature, ...feature }];
  }

  const specUrls = getSpecUrls(conf);
  if (!specUrls.length) return [];

  return Object.entries(features)
    .filter(([, feature]) => {
      if (!isUsableFeature(feature)) return false;
      const specs = /** @type {string[]} */ (
        [feature.spec].flat().filter(Boolean)
      );
      return specs.some(specUrl => {
        const normalizedFeatureUrl = normalizeUrl(specUrl);
        return specUrls.some(url => normalizedFeatureUrl.startsWith(url));
      });
    })
    .map(([id, feature]) => ({ id, ...feature }));
}

/** @param {RespecConfig} conf */
function getSpecUrls(conf) {
  const urls = new Set();
  if (conf.edDraftURI) urls.add(normalizeUrl(conf.edDraftURI));
  if (conf.shortName) {
    urls.add(normalizeUrl(`https://www.w3.org/TR/${conf.shortName}/`));
    urls.add(normalizeUrl(`https://w3c.github.io/${conf.shortName}/`));
  }
  if (conf.thisVersion) urls.add(normalizeUrl(conf.thisVersion));
  return [...urls];
}

/** @param {string} url */
function normalizeUrl(url) {
  try {
    const u = new URL(url);
    u.hash = "";
    if (!u.pathname.endsWith("/") && !u.pathname.includes(".")) {
      u.pathname += "/";
    }
    return u.href;
  } catch {
    return url;
  }
}

/**
 * @param {WebFeatureEntry[]} features
 * @returns {"high" | "low" | ""} Upstream `false` maps to `""` via fall-through.
 */
function computeAggregate(features) {
  const statuses = features.map(f => f.status?.baseline);
  if (statuses.every(s => s === "high")) return "high";
  if (statuses.every(s => s === "low" || s === "high")) return "low";
  return "";
}

/**
 * @param {WebFeatureEntry[]} features
 * @returns {Map<string, boolean>}
 */
function aggregateSupport(features) {
  const browsers = new Map();
  for (const browserId of BROWSERS.keys()) {
    const supported = features.every(
      f => f.status?.support?.[browserId] != null
    );
    browsers.set(browserId, supported);
  }
  return browsers;
}

/** @param {string} browserId */
function getLogoSrc(browserId) {
  return `${LOGO_BASE}/${browserId}/${browserId}.svg`;
}

/**
 * @param {"high" | "low" | ""} baseline
 * @param {string | undefined} statusText
 * @param {Map<string, boolean>} support
 * @param {WebFeatureEntry[]} features
 */
function renderBadge(baseline, statusText, support, features) {
  const makeIcon =
    BASELINE_ICONS.get(baseline) ??
    BASELINE_ICONS.get("") ??
    (() => html`<span></span>`);
  const icon = makeIcon();
  icon.setAttribute("aria-hidden", "true");

  const pills = [...BROWSER_GROUPS.values()].map(browserIds => {
    const items = browserIds.map(browserId => {
      const browserName = BROWSERS.get(browserId)?.name || browserId;
      const isSupported = support.get(browserId);
      const title = isSupported
        ? `${browserName}: Supported`
        : `${browserName}: Not supported`;
      const supportIcon = isSupported
        ? SUPPORT_ICONS.available()
        : SUPPORT_ICONS.unavailable();
      const cls = isSupported ? "support-available" : "support-unavailable";

      return html`<span
        class="baseline-browser ${cls}"
        role="img"
        title="${title}"
        aria-label="${title}"
      >
        <img
          class="baseline-browser-logo"
          width="24"
          height="24"
          src="${getLogoSrc(browserId)}"
          alt=""
        />${supportIcon}
      </span>`;
    });

    const allSupported = browserIds.every(id => support.get(id));
    const pillCls = allSupported
      ? "baseline-pill supported"
      : "baseline-pill unsupported";

    return html`<span class="${pillCls}">${items}</span>`;
  });

  const browserGroup = html`<span class="baseline-browsers">${pills}</span>`;

  const singleFeature = features.length === 1 ? features[0] : null;
  const moreInfoUrl = singleFeature
    ? `https://webstatus.dev/features/${encodeURIComponent(singleFeature.id)}`
    : "https://webstatus.dev/";
  const moreInfoLabel = singleFeature?.name
    ? `More info about ${singleFeature.name} support`
    : "More info about browser support";

  const dt = html`${statusText}:${icon}`;
  const dd = html`${browserGroup}
    <a
      class="baseline-more-info"
      href="${moreInfoUrl}"
      aria-label="${moreInfoLabel}"
      >More info</a
    >`;

  return { dt, dd, moreInfoUrl };
}
