// @ts-check
// Module core/ui
// Handles the ReSpec UI
// XXX TODO
//  - look at other UI things to add
//      - list issues
//      - lint: validator, link checker, check WebIDL, ID references
//      - save to GitHub
//  - make a release candidate that people can test
//  - once we have something decent, merge, ship as 3.2.0
import { html, pluralize } from "./import-maps.js";
import css from "../styles/ui.css.js";
import { joinAnd } from "./utils.js";
import { markdownToHtml } from "./markdown.js";
import { sub } from "./pubsubhub.js";
export const name = "core/ui";

// Opportunistically inserts the style, with the chance to reduce some FOUC
insertStyle();

function insertStyle() {
  const styleElement = document.createElement("style");
  styleElement.id = "respec-ui-styles";
  styleElement.textContent = css;
  styleElement.classList.add("removeOnSave");
  document.head.appendChild(styleElement);
  return styleElement;
}

function ariaDecorate(elem, ariaMap) {
  if (!elem) {
    return;
  }
  Array.from(ariaMap).forEach(([name, value]) => {
    elem.setAttribute(`aria-${name}`, value);
  });
}

const respecUI = html`<div id="respec-ui" class="removeOnSave" hidden></div>`;
const menu = html`<ul
  id="respec-menu"
  role="menu"
  aria-labelledby="respec-pill"
  hidden
></ul>`;
const closeButton = html`<button
  class="close-button"
  onclick=${() => ui.closeModal()}
  title="Close"
>
  ❌
</button>`;
window.addEventListener("load", () => trapFocus(menu));
let modal;
let overlay;
const errors = [];
const warnings = [];
const buttons = {};

sub("start-all", () => document.body.prepend(respecUI), { once: true });
sub("end-all", () => document.body.prepend(respecUI), { once: true });

const respecPill = html`<button id="respec-pill" disabled>ReSpec</button>`;
respecUI.appendChild(respecPill);
respecPill.addEventListener("click", e => {
  e.stopPropagation();
  respecPill.setAttribute("aria-expanded", String(menu.hidden));
  toggleMenu();
  menu.querySelector("li:first-child button").focus();
});

document.documentElement.addEventListener("click", () => {
  if (!menu.hidden) {
    toggleMenu();
  }
});
respecUI.appendChild(menu);

menu.addEventListener("keydown", e => {
  if (e.key === "Escape" && !menu.hidden) {
    respecPill.setAttribute("aria-expanded", String(menu.hidden));
    toggleMenu();
    respecPill.focus();
  }
});

function toggleMenu() {
  menu.classList.toggle("respec-hidden");
  menu.classList.toggle("respec-visible");
  menu.hidden = !menu.hidden;
}

// Code adapted from https://hiddedevries.nl/en/blog/2017-01-29-using-javascript-to-trap-focus-in-an-element
function trapFocus(element) {
  const focusableEls = element.querySelectorAll(
    "a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])"
  );
  const firstFocusableEl = focusableEls[0];
  const lastFocusableEl = focusableEls[focusableEls.length - 1];
  if (firstFocusableEl) {
    firstFocusableEl.focus();
  }
  element.addEventListener("keydown", e => {
    if (e.key !== "Tab") {
      return;
    }
    // shift + tab
    if (e.shiftKey) {
      if (document.activeElement === firstFocusableEl) {
        lastFocusableEl.focus();
        e.preventDefault();
      }
    }
    // tab
    else if (document.activeElement === lastFocusableEl) {
      firstFocusableEl.focus();
      e.preventDefault();
    }
  });
}

const ariaMap = new Map([
  ["controls", "respec-menu"],
  ["expanded", "false"],
  ["haspopup", "true"],
  ["label", "ReSpec Menu"],
]);
ariaDecorate(respecPill, ariaMap);

function errWarn(err, arr, butName, title) {
  arr.push(err);
  if (!buttons.hasOwnProperty(butName)) {
    buttons[butName] = createWarnButton(butName, arr, title);
    respecUI.appendChild(buttons[butName]);
  }
  const button = buttons[butName];
  button.textContent = arr.length;
  const label = arr.length === 1 ? pluralize.singular(title) : title;
  const ariaMap = new Map([["label", `${arr.length} ${label}`]]);
  ariaDecorate(button, ariaMap);
}

function createWarnButton(butName, arr, title) {
  const buttonId = `respec-pill-${butName}`;
  const button = html`<button
    id="${buttonId}"
    class="respec-info-button"
  ></button>`;
  button.addEventListener("click", () => {
    button.setAttribute("aria-expanded", "true");
    const ol = html`<ol class="${`respec-${butName}-list`}"></ol>`;
    for (const err of arr) {
      const fragment = document
        .createRange()
        .createContextualFragment(rsErrorToHTML(err));
      const li = document.createElement("li");
      // if it's only a single element, just copy the contents into li
      if (fragment.firstElementChild === fragment.lastElementChild) {
        li.append(...fragment.firstElementChild.childNodes);
        // Otherwise, take everything.
      } else {
        li.appendChild(fragment);
      }
      ol.appendChild(li);
    }
    ui.freshModal(title, ol, button);
  });
  const ariaMap = new Map([
    ["expanded", "false"],
    ["haspopup", "true"],
    ["controls", `respec-pill-${butName}-modal`],
  ]);
  ariaDecorate(button, ariaMap);
  return button;
}

export const ui = {
  show() {
    try {
      respecUI.hidden = false;
    } catch (err) {
      console.error(err);
    }
  },
  hide() {
    respecUI.hidden = true;
  },
  enable() {
    respecPill.removeAttribute("disabled");
  },
  /**
   * @param {string} _keyShort shortcut key. unused - kept for backward compatibility.
   */
  addCommand(label, handler, _keyShort, icon) {
    icon = icon || "";
    const id = `respec-button-${label.toLowerCase().replace(/\s+/, "-")}`;
    const button = html`<button id="${id}" class="respec-option">
      <span class="respec-cmd-icon" aria-hidden="true">${icon}</span> ${label}…
    </button>`;
    const menuItem = html`<li role="menuitem">${button}</li>`;
    menuItem.addEventListener("click", handler);
    menu.appendChild(menuItem);
    return button;
  },
  error(rsError) {
    errWarn(rsError, errors, "error", "ReSpec Errors");
  },
  warning(rsError) {
    errWarn(rsError, warnings, "warning", "ReSpec Warnings");
  },
  closeModal(owner) {
    if (overlay) {
      overlay.classList.remove("respec-show-overlay");
      overlay.classList.add("respec-hide-overlay");
      overlay.addEventListener("transitionend", () => {
        overlay.remove();
        overlay = null;
      });
    }
    if (owner) {
      owner.setAttribute("aria-expanded", "false");
    }
    if (!modal) return;
    modal.remove();
    modal = null;
    respecPill.focus();
  },
  freshModal(title, content, currentOwner) {
    if (modal) modal.remove();
    if (overlay) overlay.remove();
    overlay = html`<div id="respec-overlay" class="removeOnSave"></div>`;
    const id = `${currentOwner.id}-modal`;
    const headingId = `${id}-heading`;
    modal = html`<div
      id="${id}"
      class="respec-modal removeOnSave"
      role="dialog"
      aria-labelledby="${headingId}"
    >
      ${closeButton}
      <h3 id="${headingId}">${title}</h3>
      <div class="inside">${content}</div>
    </div>`;
    const ariaMap = new Map([["labelledby", headingId]]);
    ariaDecorate(modal, ariaMap);
    document.body.append(overlay, modal);
    overlay.addEventListener("click", () => this.closeModal(currentOwner));
    overlay.classList.toggle("respec-show-overlay");
    modal.hidden = false;
    trapFocus(modal);
  },
};
document.addEventListener("keydown", ev => {
  if (ev.key === "Escape") {
    ui.closeModal();
  }
});
window.respecUI = ui;
sub("error", details => ui.error(details));
sub("warn", details => ui.warning(details));

function rsErrorToHTML(err) {
  if (typeof err === "string") {
    return err;
  }

  const plugin = err.plugin ? ` <small>(Plugin: "${err.plugin}")</small>.` : "";
  const hint = err.hint ? ` ${err.hint}` : "";
  const elements = Array.isArray(err.elements)
    ? ` Occurred at: ${joinAnd(err.elements.map(generateMarkdownLink))}.`
    : "";
  const details = err.details
    ? `\n\n<details>\n${err.details}\n</details>\n`
    : "";

  const text = `${err.message}${hint}${elements}${plugin}${details}`;
  return markdownToHtml(text);
}

/**
 * @param {Element} element
 * @param {number} i
 */
function generateMarkdownLink(element, i) {
  return `[${i + 1}](#${element.id})`;
}
