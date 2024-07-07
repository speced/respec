/**
 * @module core/unicode
 *
 * Expand char markup (.hx, .ch) to .codepoint spans
 * https://github.com/speced/respec/issues/4462
 * Based on https://github.com/r12a/scripts/blob/gh-pages/common29/functions.js
 */

import { showError } from "./utils.js";

export const name = "core/unicode";

/**
 * @param {Conf} conf
 */
export async function run(conf) {
  expandCharMarkup();
}

function expandCharMarkup() {
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

  expandCharMarkupHx();
  expandCharMarkupCh();
}

// convert .hx markup (one or more hex codes)
function expandCharMarkupHx() {
  /** @type {NodeListOf<HTMLElement>} */
  const elements = document.querySelectorAll(".hx");
  for (const elem of elements) {
    const split = elem.classList.contains("split");
    const svg = elem.classList.contains("svg");
    const img = elem.classList.contains("img");
    const initial = elem.classList.contains("init");
    const medial = elem.classList.contains("medi");
    const final = elem.classList.contains("fina");
    const skipDiacritic = elem.classList.contains("skip");
    const circle = elem.classList.contains("circle");
    const coda = elem.classList.contains("coda") ? "◌" : "";
    const noname = elem.classList.contains("noname");
    const lang = window.langTag || elem.lang;

    const charlist = elem.textContent.trim().split(" ");
    if (charlist[0] === "") {
      continue;
    }

    let unicodeNames = "";
    let unicodeChars = "";
    let out = "";

    if (final || medial) {
      unicodeChars += "\u200D"; // the space is needed for Safari to work
    }
    if (circle) {
      unicodeChars = `\u25CC${unicodeChars}`;
    }
    for (let i = 0; i < charlist.length; i++) {
      const hex = charlist[i];
      const dec = parseInt(hex, 16);
      if (Number.isNaN(dec)) {
        showError(
          `The link text "${elem.textContent}" is not a number!`,
          name,
          { elements: [elem] }
        );
        continue;
      }
      const ch = String.fromCodePoint(dec);

      if (!charData[ch]) {
        showError(
          `The character "${ch}" (U+${hex}) is not in the database!`,
          name,
          { elements: [elem] }
        );
        unicodeChars += ch;
        continue;
      }

      if (hex !== "25CC") {
        if (i > 0) {
          unicodeNames += "</span> + <span class='uname'>";
        }
        unicodeNames += `U+${hex} `;
        unicodeNames += charData[ch].replace(/:/, "");
      }

      if (split && i > 0) {
        unicodeChars += `</bdi> + <bdi lang="${lang}">`;
      }
      if (svg) {
        // block = getScriptGroup(dec, false);
        // unicodeChars += `<img src="../../c/${block}/${hex}.svg" alt="${ch}" style="height:2rem;">`;
      } else if (img) {
        // block = getScriptGroup(dec, false);
        // unicodeChars += `<img src="../../c/${block}/large/${hex}.png" alt="${ch}" style="height:2rem;">`;
      } else {
        unicodeChars += `&#x${hex};`;
      }
      if (skipDiacritic && i == 0) {
        unicodeChars += "&#x200D;";
      }
    }

    if (initial || medial) {
      unicodeChars += "\u200D ";
    }

    out += `<span class="codepoint" translate="no"><bdi lang="${lang}"`;
    if (img || svg) {
      out += ' style="margin:0;" ';
    }
    out += `>${unicodeChars}${coda}</bdi>`;
    if (noname) {
      // ok
    } else {
      out += `<span class="uname">${unicodeNames}</span>`;
    }
    out += "</span>";

    elem.outerHTML = out;
  }
}

// convert .ch markup (one or more characters using Unicode code points)
function expandCharMarkupCh() {
  /** @type {NodeListOf<HTMLElement>} */
  const elements = document.querySelectorAll(".ch");
  for (const elem of elements) {
    const split = elem.classList.contains("split");
    const svg = elem.classList.contains("svg");
    const img = elem.classList.contains("img");
    const initial = elem.classList.contains("init");
    const medial = elem.classList.contains("medi");
    const final = elem.classList.contains("fina");
    const circle = elem.classList.contains("circle");
    const coda = elem.classList.contains("coda") ? "◌" : "";
    const noname = elem.classList.contains("noname");
    const language = window.langTag || elem.lang;

    const charlist = [...elem.textContent];
    let unicodeNames = "";
    let unicodeChars = "";
    let out = "";

    if (final || medial) {
      unicodeChars += " \u200D";
    }
    for (let i = 0; i < charlist.length; i++) {
      const dec = charlist[i].codePointAt(0);
      const hex = dec.toString(16).toUpperCase().padStart(4, "0");

      if (!charData[charlist[i]]) {
        unicodeChars += charlist[i];
        unicodeNames += `<span style="color:red"> ${charlist[i]} NOT IN DB!</span> `;
        continue;
      }

      if (i > 0) {
        unicodeNames += "</span> + <span class='uname'>";
      }
      unicodeNames += `U+${hex} `;
      unicodeNames += charData[charlist[i]].replace(/:/, "");

      if (split && i > 0) {
        unicodeChars += `</bdi> + <bdi lang="${language}">`;
      }

      if (svg) {
        // block = getScriptGroup(dec, false);
        // unicodeChars += `<img src="../../c/${block}/${hex}.svg" alt="${charlist[i]}" style="height:2rem;">`;
      } else if (img) {
        // block = getScriptGroup(dec, false);
        // unicodeChars += `<img src="../../c/${block}/large/${hex}.png" alt="${charlist[i]}" style="height:2rem;">`;
      } else {
        unicodeChars += charlist[i];
      }
    }

    if (initial || medial) {
      unicodeChars += "\u200D ";
    }
    if (circle) {
      unicodeChars = `\u25CC${unicodeChars}`;
    }

    out += `<span class="codepoint" translate="no"><bdi lang="${language}"`;
    // if (blockDirection === "rtl") {
    // out += ` dir="rtl"`;
    // }
    if (img || svg) {
      out += ' style="margin:0;" ';
    }
    out += `>${unicodeChars}${coda}</bdi>`;
    if (noname) {
      // ok
    } else {
      out += `<span class="uname">${unicodeNames}</span>`;
    }
    out += "</span>";

    elem.outerHTML = out;
  }
}
