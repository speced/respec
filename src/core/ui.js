// Module core/ui
// Handles the ReSpec UI
/*jshint laxcomma:true*/
// XXX TODO
//  - look at other UI things to add
//      - list issues
//      - lint: validator, link checker, check WebIDL, ID references
//      - save to GitHub
//  - make a release candidate that people can test
//  - once we have something decent, merge, ship as 3.2.0

import "./jquery-enhanced";
import css from "../deps/text!ui/ui.css";
import hyperHTML from "../deps/hyperhtml";
import { markdownToHtml } from "./utils";
import shortcut from "shortcut";
import { sub } from "./pubsubhub";
export const name = "core/ui";

// Opportunistically inserts the style, with the chance to reduce some FOUC
const styleElement = document.createElement("style");
styleElement.id = "respec-ui-styles";
styleElement.textContent = css;
styleElement.classList.add("removeOnSave");

document.head.appendChild(styleElement);

function ariaDecorate(elem, ariaMap) {
  if (!elem) {
    return;
  }
  Array.from(ariaMap.entries()).reduce((elem, [name, value]) => {
    elem.setAttribute("aria-" + name, value);
    return elem;
  }, elem);
}

const respecUI = hyperHTML`<div id='respec-ui' class='removeOnSave' hidden></div>`;
const menu = hyperHTML`<ul id=respec-menu role=menu aria-labelledby='respec-pill' hidden></ul>`;
let modal;
let overlay;
const errors = [];
const warnings = [];
const buttons = {};

sub("start-all", () => document.body.prepend(respecUI), { once: true });
sub("end-all", () => document.body.prepend(respecUI), { once: true });

const respecPill = hyperHTML`<button id='respec-pill' disabled>ReSpec</button>`;
respecUI.appendChild(respecPill);
respecPill.addEventListener("click", function(e) {
  e.stopPropagation();
  if (menu.hidden) {
    menu.classList.remove("respec-hidden");
    menu.classList.add("respec-visible");
  } else {
    menu.classList.add("respec-hidden");
    menu.classList.remove("respec-visible");
  }
  this.setAttribute("aria-expanded", String(menu.hidden));
  menu.hidden = !menu.hidden;
});
document.documentElement.addEventListener("click", () => {
  if (!menu.hidden) {
    menu.classList.remove("respec-visible");
    menu.classList.add("respec-hidden");
    menu.hidden = true;
  }
});
respecUI.appendChild(menu);

const ariaMap = new Map([
  ["controls", "respec-menu"],
  ["expanded", "false"],
  ["haspopup", "true"],
  ["label", "ReSpec Menu"],
]);
ariaDecorate(respecPill, ariaMap);

function errWarn(msg, arr, butName, title) {
  arr.push(msg);
  if (!buttons.hasOwnProperty(butName)) {
    buttons[butName] = createWarnButton(butName, arr, title);
    respecUI.appendChild(buttons[butName]);
  }
  buttons[butName].textContent = arr.length;
}

function createWarnButton(butName, arr, title) {
  const buttonId = `respec-pill-${butName}`;
  const button = hyperHTML`<button id='${buttonId}' class='respec-info-button'>`;
  button.addEventListener("click", function() {
    this.setAttribute("aria-expanded", "true");
    const ol = hyperHTML`<ol class='${`respec-${butName}-list`}'></ol>`;
    for (const err of arr) {
      const fragment = document
        .createRange()
        .createContextualFragment(markdownToHtml(err));
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
    ui.freshModal(title, ol, this);
  });
  const ariaMap = new Map([
    ["expanded", "false"],
    ["haspopup", "true"],
    ["controls", "respec-pill-" + butName + "-modal"],
    ["label", "Document " + title.toLowerCase()],
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
  addCommand(label, module, keyShort, icon) {
    icon = icon || "";
    const handler = function() {
      require([module], mod => {
        mod.show();
      });
    };
    const id = "respec-button-" + label.toLowerCase().replace(/\s+/, "-");
    const button = hyperHTML`<button id="${id}" class="respec-option" title="${keyShort}">
      <span class="respec-cmd-icon">${icon}</span> ${label}…
    </button>`;
    const menuItem = hyperHTML`<li role=menuitem>${button}</li>`;
    menuItem.addEventListener("click", handler);
    menu.appendChild(menuItem);
    if (keyShort) shortcut.add(keyShort, handler);
    return button;
  },
  error(msg) {
    errWarn(msg, errors, "error", "Errors");
  },
  warning(msg) {
    errWarn(msg, warnings, "warning", "Warnings");
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
  },
  freshModal(title, content, currentOwner) {
    if (modal) modal.remove();
    if (overlay) overlay.remove();
    overlay = hyperHTML`<div id='respec-overlay' class='removeOnSave'></div>`;
    const id = currentOwner.id + "-modal";
    const headingId = id + "-heading";
    modal = hyperHTML`<div id='${id}' class='respec-modal removeOnSave' role='dialog'>
      <h3 id="${headingId}">${title}</h3>
      <div class='inside'>${content}</div>
    </div>`;
    const ariaMap = new Map([["labelledby", headingId]]);
    ariaDecorate(modal, ariaMap);
    document.body.append(overlay, modal);
    overlay.addEventListener("click", () => this.closeModal(currentOwner));
    overlay.classList.toggle("respec-show-overlay");
    modal.hidden = false;
  },
};
shortcut.add("Esc", () => ui.closeModal());
shortcut.add("Ctrl+Alt+Shift+E", () => {
  if (buttons.error) buttons.error.click();
});
shortcut.add("Ctrl+Alt+Shift+W", () => {
  if (buttons.warning) buttons.warning.click();
});
window.respecUI = ui;
sub("error", details => ui.error(details));
sub("warn", details => ui.warning(details));
