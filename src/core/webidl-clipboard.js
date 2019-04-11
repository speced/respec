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
  for (const pre of document.querySelectorAll("pre.idl")) {
    const button = copyButton.cloneNode(true);
    const wrapper = document.createElement("div");
    button.addEventListener("click", () => {
      clipboardWriteText(pre.textContent);
    })
    pre.replaceWith(wrapper);
    wrapper.append(button, pre);
  }
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
