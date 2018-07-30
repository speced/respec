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

import shortcut from "shortcut";
import { sub } from "core/pubsubhub";
import css from "deps/text!ui/ui.css";
import { markdownToHtml } from "core/utils";
import "core/jquery-enhanced";
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

const $respecUI = $("<div id='respec-ui' class='removeOnSave' hidden></div>");
const $menu = $(
  "<ul id=respec-menu role=menu aria-labelledby='respec-pill' hidden></ul>"
);
let $modal;
let $overlay;
const errors = [];
const warnings = [];
const buttons = {};

sub(
  "start-all",
  () => {
    document.body.insertAdjacentElement("afterbegin", $respecUI[0]);
  },
  { once: true }
);
sub(
  "end-all",
  () => {
    document.body.insertAdjacentElement("afterbegin", $respecUI[0]);
  },
  { once: true }
);

const $respecPill = $("<button id='respec-pill' disabled>ReSpec</button>");
$respecPill
  .click(function(e) {
    e.stopPropagation();
    if ($menu[0].hidden) {
      $menu[0].classList.remove("respec-hidden");
      $menu[0].classList.add("respec-visible");
    } else {
      $menu[0].classList.add("respec-hidden");
      $menu[0].classList.remove("respec-visible");
    }
    this.setAttribute("aria-expanded", String($menu[0].hidden));
    $menu[0].hidden = !$menu[0].hidden;
  })
  .appendTo($respecUI);
document.documentElement.addEventListener("click", () => {
  if (!$menu[0].hidden) {
    $menu[0].classList.remove("respec-visible");
    $menu[0].classList.add("respec-hidden");
    $menu[0].hidden = true;
  }
});
$menu.appendTo($respecUI);

const ariaMap = new Map([
  ["controls", "respec-menu"],
  ["expanded", "false"],
  ["haspopup", "true"],
  ["label", "ReSpec Menu"],
]);
ariaDecorate($respecPill[0], ariaMap);

function errWarn(msg, arr, butName, title) {
  arr.push(msg);
  if (buttons.hasOwnProperty(butName)) {
    buttons[butName].text(arr.length);
    return;
  }
  buttons[butName] = $(
    "<button id='respec-pill-" +
      butName +
      "' class='respec-info-button'>" +
      arr.length +
      "</button>"
  )
    .appendTo($respecUI)
    .click(function() {
      this.setAttribute("aria-expanded", "true");
      const $ul = $("<ol class='respec-" + butName + "-list'></ol>");
      for (let i = 0, n = arr.length; i < n; i++) {
        const err = arr[i];
        if (err instanceof Error) {
          $("<li><span></span> <a>\u229e</a><pre></pre></li>")
            .appendTo($ul)
            .find("span")
            .text("[" + err.name + "] " + err.message)
            .end()
            .find("a")
            .css({
              fontSize: "1.1em",
              color: "#999",
              cursor: "pointer",
            })
            .click(function() {
              const $a = $(this);
              const state = $a.text();
              const $pre = $a.parent().find("pre");
              if (state === "\u229e") {
                $a.text("\u229f");
                $pre.show();
              } else {
                $a.text("\u229e");
                $pre.hide();
              }
            })
            .end()
            .find("pre")
            .text(err.stack)
            .css({
              marginLeft: "0",
              maxWidth: "100%",
              overflowY: "hidden",
              overflowX: "scroll",
            })
            .hide()
            .end();
        } else {
          const tmp = document.createElement("tmp");
          tmp.innerHTML = markdownToHtml(err);
          const li = document.createElement("li");
          // if it's only a single element, just copy the contents into li
          if (tmp.firstElementChild === tmp.lastElementChild) {
            while (
              tmp.firstElementChild &&
              tmp.firstElementChild.hasChildNodes()
            ) {
              li.appendChild(tmp.firstElementChild.firstChild);
            }
            // Otherwise, take everything.
          } else {
            li.innerHTML = tmp.innerHTML;
          }
          $ul[0].appendChild(li);
        }
      }
      ui.freshModal(title, $ul, this);
    });
  const ariaMap = new Map([
    ["expanded", "false"],
    ["haspopup", "true"],
    ["controls", "respec-pill-" + butName + "-modal"],
    ["label", "Document " + title.toLowerCase()],
  ]);
  ariaDecorate(buttons[butName][0], ariaMap);
}
export const ui = {
  show: function() {
    try {
      $respecUI[0].hidden = false;
    } catch (err) {
      console.error(err);
    }
  },
  hide: function() {
    $respecUI[0].hidden = true;
  },
  enable: function() {
    $respecPill[0].removeAttribute("disabled");
  },
  addCommand: function(label, module, keyShort, icon) {
    icon = icon || "";
    const handler = function() {
      require([module], mod => {
        mod.show();
      });
    };
    const id = "respec-button-" + label.toLowerCase().replace(/\s+/, "-");
    const menuItem = $(
      '<li role=menuitem><button id="' +
        id +
        '" class="respec-option" title="' +
        keyShort +
        '"><span class="respec-cmd-icon">' +
        icon +
        "</span> " +
        label +
        "… </button></li>"
    )
      .click(handler)
      .appendTo($menu);
    if (keyShort) shortcut.add(keyShort, handler);
    return menuItem[0].querySelector("button");
  },
  error: function(msg) {
    errWarn(msg, errors, "error", "Errors");
  },
  warning: function(msg) {
    errWarn(msg, warnings, "warning", "Warnings");
  },
  closeModal: function(owner) {
    if ($overlay) {
      $overlay[0].classList.remove("respec-show-overlay");
      $overlay[0].classList.add("respec-hide-overlay");
      $overlay[0].addEventListener("transitionend", () => {
        $overlay.remove();
        $overlay = null;
      });
    }
    if (owner) {
      owner.setAttribute("aria-expanded", "false");
    }
    if (!$modal) return;
    $modal.remove();
    $modal = null;
  },
  freshModal: function(title, content, currentOwner) {
    if ($modal) $modal.remove();
    if ($overlay) $overlay.remove();
    $overlay = $("<div id='respec-overlay' class='removeOnSave'></div>");
    const id = currentOwner.id + "-modal";
    const headingId = id + "-heading";
    $modal = $(
      "<div id='" +
        id +
        "' class='respec-modal removeOnSave' role='dialog'><h3></h3><div class='inside'></div></div>"
    );
    $modal.find("h3").text(title);
    $modal.find("h3")[0].id = headingId;
    const ariaMap = new Map([["labelledby", headingId]]);
    ariaDecorate($modal[0], ariaMap);
    $modal.find(".inside").append(content);
    $(document.body)
      .append($overlay)
      .append($modal);
    $overlay.click(() => {
      this.closeModal(currentOwner);
    });
    $overlay[0].classList.toggle("respec-show-overlay");
    $modal[0].hidden = false;
  },
};
shortcut.add("Esc", () => {
  ui.closeModal();
});
shortcut.add("Ctrl+Alt+Shift+E", () => {
  if (buttons.error) buttons.error.click();
});
shortcut.add("Ctrl+Alt+Shift+W", () => {
  if (buttons.warning) buttons.warning.click();
});
window.respecUI = ui;
sub("error", details => {
  ui.error(details);
});
sub("warn", details => {
  ui.warning(details);
});
