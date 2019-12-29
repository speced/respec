// @ts-check
/**
 * Module core/webidl-clipboard
 *
 * This module adds a button to each IDL pre making it possible to copy
 * well-formatted IDL to the clipboard.
 *
 */
import { fetchAsset } from "./text-loader.js";
export const name = "core/webidl-clipboard";

const copyButtonPromise = createButton();

async function loadSVG() {
  try {
    return (await import("text!../../assets/clipboard.svg")).default;
  } catch {
    return fetchAsset("clipboard.svg");
  }
}

async function createButton() {
  const copyButton = document.createElement("button");
  copyButton.innerHTML = await loadSVG();
  copyButton.title = "Copy IDL to clipboard";
  copyButton.classList.add("respec-button-copy-paste", "removeOnSave");
  return copyButton;
}

/**
 * Adds a HTML button that copies WebIDL to the clipboard.
 *
 * @param {HTMLDivElement} idlHeader
 */
export async function addCopyIDLButton(idlHeader) {
  // This button serves a prototype that we clone as needed.
  const copyButton = await copyButtonPromise;
  // There may be multiple <span>s of IDL, so we take everything
  // apart from the idl header.
  const pre = idlHeader.closest("pre.idl");
  const idl = pre.cloneNode(true);
  idl.querySelector(".idlHeader").remove();
  const { textContent: idlText } = idl;
  const button = copyButton.cloneNode(true);
  button.addEventListener("click", () => {
    clipboardWriteText(idlText);
  });
  idlHeader.append(button);
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
    document.addEventListener(
      "copy",
      ev => {
        ev.clipboardData.setData("text/plain", text);
        resolve();
      },
      { once: true }
    );
    document.execCommand("copy");
  });
}
