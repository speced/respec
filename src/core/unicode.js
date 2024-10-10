// @ts-check
/**
 * @module core/unicode
 *
 * Expand char markup (.hx, .ch) to .codepoint spans
 * https://github.com/speced/respec/issues/4462
 * Based on https://github.com/r12a/scripts/blob/gh-pages/common29/functions.js
 */

import { lang as docLang } from "./l10n.js";
import { html } from "./import-maps.js";
import { showError } from "./utils.js";

export const name = "core/unicode";

const DEFAULT_API_URL = "http://localhost:8001/api/unicode/names";

/**
 * @param {Conf} conf
 */
export async function run(conf) {
  // convert char markup to .codepoint spans (has to be done before the indexing)
  // the .ch and .hx classes should only be used for characters in the
  // spreadsheet.  For other characters, generate the markup in a picker
  // if the svg class is appended, use an svg image to display the char
  // if the split class used, the characters will be separated by +
  // split puts + signs between the characters in a sequence
  // init, medi, fina produce positional forms of cursive text using zwj
  // skip  puts a circle before a mark, and zwj between it and the following consonant
  // circle puts a dotted circle before the item - used for combining marks
  // coda puts a dotted circle after the item - used for closed syllables
  // noname prevents the production of the Unicode name

  /** @type {NodeListOf<HTMLElement>} */
  const elements = document.querySelectorAll(".ch, .hx");
  if (!elements.length) {
    return;
  }

  /** @type {Set<string>} */
  const queryHex = new Set();
  /** @type {Map<HTMLElement, Array<ParsedData>>} */
  const elementMap = new Map();

  for (const elem of elements) {
    const parsed = elem.classList.contains("ch")
      ? parseCh(elem)
      : parseHx(elem);

    parsed.forEach(p => queryHex.add(p.hex));
    elementMap.set(elem, parsed);
  }

  if (!queryHex.size) {
    return;
  }
  const apiUrl = conf.unicode?.apiUrl || DEFAULT_API_URL;
  const result = await getData(
    [...queryHex].map(hex => ({ hex })),
    apiUrl
  );
  const dataByHex = new Map(
    Object.values(result.data).map(d => [d.query.hex, d.result])
  );

  for (const elem of elements) {
    const parsedData = elementMap.get(elem);
    const hexMap = new Map(parsedData.map(e => [e.hex, dataByHex.get(e.hex)]));
    expandCharMarkup(elem, parsedData, hexMap);
  }
}

/**
 * @param {HTMLElement} elem
 * @param {ParsedData[]} parsedData
 * @param {Map<string, Result | null>} hexMap
 */
function expandCharMarkup(elem, parsedData, hexMap) {
  console.log(elem, ...parsedData);

  const split = elem.classList.contains("split");
  // const _svg = elem.classList.contains("svg");
  // const img = elem.classList.contains("img");
  const initial = elem.classList.contains("init");
  const medial = elem.classList.contains("medi");
  const final = elem.classList.contains("fina");
  // const skipDiacritic = elem.classList.contains("skip");
  const circle = elem.classList.contains("circle");
  const coda = elem.classList.contains("coda") ? "◌" : "";
  // const noname = elem.classList.contains("noname");
  const lang = elem.lang || docLang;

  const isHex = elem.classList.contains("hx");
  const isCh = elem.classList.contains("ch");

  /** @type {string[]} */
  const unicodeChars = [];
  /** @type {(HTMLElement | Text)[]} */
  const unicodeNames = [];
  let chars = "";

  if (final || medial) {
    chars += isCh ? " \u200D" : "\u200D"; // the space is needed for Safari to work
  }
  if (isHex) {
    if (circle) {
      chars = `\u25CC${chars}`;
    }
  }

  for (const [i, entry] of parsedData.entries()) {
    chars += isHex ? `&#x${entry.hex};` : entry.ch;
    // todo: support images

    if (split) {
      unicodeChars.push(chars);
      chars = "";
    }

    const res = hexMap.get(entry.hex);
    if (!res?.name) {
      showError(`No name found for ${entry.hex}`, name, { elements: [elem] });
      continue;
    }
    const text = `U+${entry.hex} ${res.name}`;
    unicodeNames.push(html`<span class="uname">${text}</span>`);
    if (i < parsedData.length - 1) {
      unicodeNames.push(new Text(" + "));
    }
  }
  if (chars) {
    unicodeChars.push(chars);
  }

  if (isHex) {
    if (initial || medial) {
      chars += "\u200D ";
    }
  }
  if (isCh) {
    if (circle) {
      chars = `\u25CC${chars}`;
    }
  }
  chars += coda;

  const expanded = document.createElement("span");
  expanded.classList.add("codepoint");
  expanded.setAttribute("translate", "no");
  for (const text of unicodeChars) {
    const bdi = document.createElement("bdi");
    bdi.lang = lang;
    bdi.innerHTML = text;
    expanded.append(bdi);
  }
  for (const entry of unicodeNames) {
    expanded.append(entry);
  }

  elem.replaceWith(expanded);
}

/**
 * @typedef {{ ch: string; hex: string; dec: number }} ParsedData
 * @typedef {{ hex: string }} Query
 * @typedef {{ name: string }} Result
 * @typedef {{
 *  data: Array<{ query: Query; result: Result | null }>;
 *  metadata: { lastParsedAt: string; dataSource: string };
 * }} ResponseData
 *
 * @param {Query[]} queries
 * @param {string} apiUrl
 * @return {Promise<ResponseData>}
 */
async function getData(queries, apiUrl) {
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ queries }),
  });
  const data = await res.json();
  return data;
}

/**
 * @param {HTMLElement} elem
 * @returns {ParsedData[]}
 */
function parseCh(elem) {
  const result = [];
  const charlist = [...elem.textContent];
  for (let i = 0; i < charlist.length; i++) {
    const ch = charlist[i];
    const dec = ch.codePointAt(0);
    const hex = dec.toString(16).toUpperCase().padStart(4, "0");
    result.push({ ch, hex, dec });
  }
  return result;
}

/**
 * @param {HTMLElement} elem
 * @returns {ParsedData[]}
 */
function parseHx(elem) {
  const charlist = elem.textContent.trim().split(" ");
  if (charlist[0] === "") {
    return [];
  }
  const result = [];
  for (let i = 0; i < charlist.length; i++) {
    const ch = charlist[i];
    const hex = ch;
    const dec = parseInt(hex, 16);
    result.push({ ch, hex, dec });
  }
  return result;
}
