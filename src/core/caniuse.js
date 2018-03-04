// Module: "core/caniuse"
// Adds a caniuse table for a "key" #1238
// If conf.caniuse is set to a key, the table is added below .head
// If data-caniuse is set to a key, the table is added after first element where data-caniuse is used (on a onclick handler)
//  .. generally, data-caniuse is defined on a <section>, so table will be added after section's first element (usually section heading)
//
// Optional: Set conf.caniuseBrowsers to set which browsers will be shown in the table
//   VALUES: "ALL" or and array of caniuse supported browser names
//   (otherwise DEFAULT_BROWSERS will be used).

// TODO: L141 (json.notes) do not render as html even after marked()

import { fetch as ghFetch } from "core/github";
import { semverCompare, norm } from "core/utils";
import { pub } from "core/pubsubhub";
import marked from "deps/marked";
import "deps/hyperhtml";
import caniuseCss from "deps/text!core/css/caniuse.css";

// Opportunistically insert the style into the head to reduce FOUC.
const codeStyle = document.createElement("style");
codeStyle.textContent = caniuseCss;
document.head.appendChild(codeStyle);

export const name = "core/caniuse";

export async function run(conf) {
  if (conf.caniuse) {
    canIUse(conf.caniuse, $s(".head"), conf.caniuseBrowsers);
  }
  [...$sa("section[data-caniuse]")].forEach(el => prepare(el, conf));
}

const $s = (s, ctx = document) => ctx.querySelector(s);
const $sa = s => document.querySelectorAll(s);
const $id = id => document.getElementById(id);

marked.setOptions({ sanitize: false, gfm: true });
const DEFAULT_BROWSERS = ["chrome", "firefox", "ie", "edge"];
const BROWSERS = {
  chrome: "Chrome",
  firefox: "Firefox",
  ie: "IE",
  edge: "Edge",
  android: "Android",
  safari: "Safari",
  opera: "Opera",
  bb: "Blackberry",
  and_uc: "UC (Android)",
  and_ff: "Firefox (Android)",
};

function prepare(el, conf) {
  const t = hyperHTML`<div class="caniuse-trigger" title="Get 'Can I Use' data">Can I Use?</div>`;
  el.insertBefore(t, el.firstChild.nextSibling);
  t.addEventListener("click", () => {
    canIUse(el.dataset.caniuse, el.firstChild, conf.caniuseBrowsers);
    t.parentNode.removeChild(t);
  });
}

function canIUse(key, el, browsers = DEFAULT_BROWSERS) {
  const placeholder = createPlaceholder(key, el);
  const handleResponse = json => showData(key, json, el, browsers);
  const handleError = err => showError(err, placeholder);

  const url = `https://raw.githubusercontent.com/Fyrd/caniuse/master/features-json/${key}.json`;
  ghFetch(url)
    .then(handleResponse)
    .catch(handleError);
}

function createPlaceholder(key, parent) {
  const canIUseId = `caniuse-${key}`;
  const placeholder = hyperHTML`
    <div class="caniuse" id="${canIUseId}">
      <div class="caniuse-title">Can I Use <code>${key}</code>? (data from caniuse.com)</div>
      <p>fetching data...</p>
    </div>`;
  return parent.parentNode.insertBefore(placeholder, parent.nextSibling);
}

function showError(err, placeholder) {
  placeholder.style.height = "100px";
  $s("p", placeholder).innerText = `Error: ${err.message}`;
}

function showData(key, json, parent, browsers) {
  if (typeof browsers === "string") {
    if (browsers === "ALL") {
      browsers = Object.keys(json.stats);
    } else {
      pub("warn", "`conf.caniuseBrowsers` is set wrong.");
      browsers = DEFAULT_BROWSERS;
    }
  }

  // utils
  const getNoteId = n => `caniuse-${key}-${n}`; // for anchor links
  const createNoteRefs = (str) => { // for numbered "notes" references
    return str.split("#").map(norm)
      .map(i => `<li><a href=#${getNoteId(i)}>${i}</a></li>`);
  };
  const createNumberedNote = (n) => {
    const html = marked.inlineLexer(json.notes_by_num[n], []);
    return `<li id=${getNoteId(n)}>${html}</li>`;
  };
  const canIUseId = `caniuse-${key}`;
  const permalink = `http://caniuse.com/#feat=${key}`;
  const notesByNumber = Object.keys(json.notes_by_num).sort().map(createNumberedNote);
  // end:utils

  const addBrowser = (browser) => {
    const browserData = json.stats[browser];
    if (!browserData) return "";

    const addBrowserVersion = (version) => {
      const [cl, n] = browserData[version].split("#", 2).map(norm);
      const notes = n ? `<ul>${createNoteRefs(n)}</ul>` : "";
      return `<div class="ciu-cell ${cl}"">${notes}${version}</div>`
    };

    const browserVersions = Object.keys(browserData).sort(semverCompare).reverse();
    return hyperHTML`
      <div class="ciu-col">
        <span>${BROWSERS[browser] || browser}</span>
        ${hyperHTML`${browserVersions.map(addBrowserVersion)}`}
      </div>`;
  }; // end:addBrowser

  const validBrowsers = browsers.filter(b => b in json.stats);
  if (validBrowsers.length !== browsers.length) {
    pub("warn", "Unsupported value(s) in `conf.caniuseBrowsers`");
  }

  // main rendering
  const caniuse = hyperHTML`
    <div class="caniuse" id="${canIUseId}">
    <div class="caniuse-title">Can I Use <a href="${permalink}">${json.title}</a>? (data from caniuse.com) <span>[${json.usage_perc_y}%]</span></div>
      <div class="caniuse-stats">${validBrowsers.map(addBrowser)}</div>
      <p><strong>Notes:</strong> ${json.notes}</p>
      <ol>${notesByNumber}</ol>
    </div>`;

  const old = $id(canIUseId);
  if (old) old.parentNode.removeChild(old);
  parent.parentNode.insertBefore(caniuse, parent.nextSibling);
}
