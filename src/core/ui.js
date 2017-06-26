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
import utils from "core/utils";
import "core/jquery-enhanced";

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
  Array.from(ariaMap.entries()).reduce(function(elem, nameValue) {
    const name = nameValue[0];
    const value = nameValue[1];
    elem.setAttribute("aria-" + name, value);
    return elem;
  }, elem);
}

const $respecUI = $(
  "<div id='respec-ui' class='removeOnSave' hidden=true></div>"
);
const $menu = $(
  "<ul id=respec-menu role=menu aria-labelledby='respec-pill'></ul>"
);
var $modal;
var $overlay;
const errors = [];
const warnings = [];
const buttons = {};

sub(
  "start-all",
  function() {
    document.body.insertAdjacentElement("afterbegin", $respecUI[0]);
  },
  { once: true }
);
sub(
  "end-all",
  function() {
    document.body.insertAdjacentElement("afterbegin", $respecUI[0]);
  },
  { once: true }
);

const $respecPill = $("<button id='respec-pill' disabled>ReSpec</button>");
$respecPill
  .click(function(e) {
    e.stopPropagation();
    const expand = this.getAttribute("aria-expanded") === "true"
      ? "false"
      : "true";
    this.setAttribute("aria-expanded", expand);
    $menu.toggle();
  })
  .appendTo($respecUI);
document.documentElement.addEventListener("click", function() {
  if (window.getComputedStyle($menu[0]).display === "block") {
    $menu.fadeOut(200);
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
      var $ul = $("<ol class='respec-" + butName + "-list'></ol>");
      for (var i = 0, n = arr.length; i < n; i++) {
        var err = arr[i];
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
              var $a = $(this),
                state = $a.text(),
                $pre = $a.parent().find("pre");
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
          tmp.innerHTML = utils.markdownToHtml(err);
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
    var handler = function() {
      $menu.hide();
      require([module], function(mod) {
        mod.show();
      });
    };
    var id = "respec-button-" + label.toLowerCase().replace(/\s+/, "-");
    var menuItem = $(
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
    if ($overlay)
      $overlay.fadeOut(200, function() {
        $overlay.remove();
        $overlay = null;
      });
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
    $overlay = $("<div id='respec-overlay' class='removeOnSave'></div>").hide();
    const id = currentOwner.id + "-modal";
    const headingId = id + "-heading";
    $modal = $(
      "<div id='" +
        id +
        "' class='respec-modal removeOnSave' role='dialog'><h3></h3><div class='inside'></div></div>"
    ).hide();
    $modal.find("h3").text(title);
    $modal.find("h3")[0].id = headingId;
    const ariaMap = new Map([["labelledby", headingId]]);
    ariaDecorate($modal[0], ariaMap);
    $modal.find(".inside").append(content);
    $("body").append($overlay).append($modal);
    $overlay
      .click(
        function() {
          this.closeModal(currentOwner);
        }.bind(this)
      )
      .fadeTo(200, 0.5);
    $modal.fadeTo(200, 1);
  },
};
shortcut.add("Esc", function() {
  ui.closeModal();
});
shortcut.add("Ctrl+Alt+Shift+E", function() {
  if (buttons.error) buttons.error.click();
});
shortcut.add("Ctrl+Alt+Shift+W", function() {
  if (buttons.warning) buttons.warning.click();
});
window.respecUI = ui;
sub("error", function(details) {
  ui.error(details);
});
sub("warn", function(details) {
  ui.warning(details);
});

