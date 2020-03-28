// @ts-check
// Module ui/search-specref
// Search Specref database
import { getIntlData } from "../core/utils.js";
import { html } from "../core/import-maps.js";
import { ui } from "../core/ui.js";
import { wireReference } from "../core/biblio.js";

const localizationStrings = {
  en: {
    search_specref: "Search Specref",
  },
  nl: {
    search_specref: "Doorzoek Specref",
  },
  ja: {
    search_specref: "仕様検索",
  },
  de: {
    search_specref: "Spezifikationen durchsuchen",
  },
};
const l10n = getIntlData(localizationStrings);

const button = ui.addCommand(
  l10n.search_specref,
  show,
  "Ctrl+Shift+Alt+space",
  "🔎"
);
const specrefURL = "https://specref.herokuapp.com/";
const refSearchURL = `${specrefURL}search-refs`;
const reveseLookupURL = `${specrefURL}reverse-lookup`;
const form = document.createElement("form");
const renderer = html.bind(form);
const resultList = html.bind(document.createElement("div"));

form.id = "specref-ui";

/**
 * @param {Map<string, string>} resultMap
 * @param {string} query
 * @param {number} timeTaken
 */
function renderResults(resultMap, query, timeTaken) {
  if (!resultMap.size) {
    return resultList`
      <p class="state">
        Your search - <strong> ${query} </strong> -
        did not match any references.
      </p>
    `;
  }
  const wires = Array.from(resultMap)
    .slice(0, 99)
    .map(toDefinitionPair)
    .reduce((collector, pair) => collector.concat(pair), []);
  return resultList`
    <p class="result-stats">
      ${resultMap.size} results (${timeTaken} seconds).
      ${resultMap.size > 99 ? "First 100 results." : ""}
    </p>
    <dl class="specref-results">${wires}</dl>
  `;
}

function toDefinitionPair([key, entry]) {
  return html.wire(entry)`
    <dt>
      [${key}]
    </dt>
    <dd>${wireReference(entry)}</dd>
  `;
}

function resultProcessor({ includeVersions = false } = {}) {
  return (...fetchedData) => {
    /** @type {{ [key: string]: any }} */
    const combinedResults = Object.assign({}, ...fetchedData);
    const results = new Map(Object.entries(combinedResults));
    // remove aliases
    Array.from(results)
      .filter(([, entry]) => entry.aliasOf)
      .map(([key]) => key)
      .reduce((results, key) => results.delete(key) && results, results);
    // Remove versions, if asked to
    if (!includeVersions) {
      Array.from(results.values())
        .filter(entry => typeof entry === "object" && "versions" in entry)
        .flat()
        .forEach(version => {
          results.delete(version);
        });
    }
    // Remove legacy string entries
    Array.from(results)
      .filter(([, value]) => typeof value !== "object")
      .forEach(([key]) => results.delete(key));
    return results;
  };
}

form.addEventListener("submit", async ev => {
  ev.preventDefault();
  const { searchBox } = form;
  const query = searchBox.value;
  if (!query) {
    searchBox.focus();
    return;
  }
  render({ state: "Searching Specref…" });
  const refSearch = new URL(refSearchURL);
  refSearch.searchParams.set("q", query);
  const reverseLookup = new URL(reveseLookupURL);
  reverseLookup.searchParams.set("urls", query);
  try {
    const startTime = performance.now();
    const jsonData = await Promise.all([
      fetch(refSearch).then(response => response.json()),
      fetch(reverseLookup).then(response => response.json()),
    ]);
    const { checked: includeVersions } = form.includeVersions;
    const processResults = resultProcessor({ includeVersions });
    const results = processResults(...jsonData);
    render({
      query,
      results,
      state: "",
      timeTaken: Math.round(performance.now() - startTime) / 1000,
    });
  } catch (err) {
    console.error(err);
    render({ state: "Error! Couldn't do search." });
  } finally {
    searchBox.focus();
  }
});

function show() {
  render();
  ui.freshModal(l10n.search_specref, form, button);
  /** @type {HTMLElement} */
  const input = form.querySelector("input[type=search]");
  input.focus();
}

const mast = html.wire()`
  <header>
    <p>
      An Open-Source, Community-Maintained Database of
      Web Standards & Related References.
    </p>
  </header>
  <div class="searchcomponent">
    <input
      name="searchBox"
      type="search"
      aria-label="Search"
      autocomplete="off"
      placeholder="Keywords, titles, authors, urls…">
    <button
      type="submit">
        Search
    </button>
    <label>
      <input type="checkbox" name="includeVersions"> Include all versions.
    </label>
  </div>
`;

/**
 * @param {object} options
 * @param {string} [options.state]
 * @param {Map<string, string>} [options.results]
 * @param {number} [options.timeTaken]
 * @param {string} [options.query]
 */
function render({ state = "", results, timeTaken, query } = {}) {
  if (!results) {
    renderer`<div>${mast}</div>`;
    return;
  }
  renderer`
    <div>${mast}</div>
    <p class="state" hidden="${!state}">
      ${state}
    </p>
    <section hidden="${!results}" aria-live="polite">${
    results ? renderResults(results, query, timeTaken) : []
  }</section>
  `;
}
