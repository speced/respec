// @ts-check
/**
 * Module core/webidl-clipboard
 *
 * This module adds a button to each IDL pre making it possible to copy
 * well-formatted IDL to the clipboard.
 *
 */
import svgClipboard from "text!../../assets/clipboard.svg";
export const name = "core/webidl-clipboard";

// This button serves a prototype that we clone as needed.
const copyButton = document.createElement("button");
copyButton.innerHTML = svgClipboard;
copyButton.title = "Copy IDL to clipboard";
copyButton.classList.add("respec-button-copy-paste", "removeOnSave");

export async function run() {
  Array.from(document.querySelectorAll("pre.idl"))
    .map(elem => {
      const button = copyButton.cloneNode(true);
      const definition = elem.querySelector(
        `span[id^="idl-def-"], span[id^="dom-"]`
      );
      let target = "#";
      if (definition === null && elem.id === "") {
        if (elem.parentElement.id === "idl-index") {
          target += "actual-idl-index";
        } else {
          elem.id = `idl-${String(Math.random()).substr(2)}`;
          target += elem.id;
        }
      } else {
        target += elem.id || definition.id;
      }
      return { button, elem, target };
    })
    .forEach(({ elem, button, target }) => {
      const wrapper = document.createElement("div");
      button.addEventListener("click", () => {
        clipboardWriteText(document.querySelector(target).textContent);
      })
      elem.replaceWith(wrapper);
      wrapper.appendChild(button);
      wrapper.appendChild(elem);
    });
}

/**
 * Mocks navigator.clipboard.writeText()
 * @param {string} text 
 */
function clipboardWriteText(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise(resolve => {
    document.addEventListener("copy", ev => {
      ev.clipboardData.setData("text/plain", text);
      resolve();
    }, { once: true })
    document.execCommand("copy");
  });
}
