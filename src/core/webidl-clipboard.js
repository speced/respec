// @ts-check
/**
 * Module core/webidl-clipboard
 *
 * This module adds a button to each IDL pre making it possible to copy
 * well-formatted IDL to the clipboard.
 *
 */
export const name = "core/webidl-clipboard";

function createButton() {
  const copyButton = document.createElement("button");
  copyButton.innerHTML =
    '<svg height="16" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" d="M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z"/></svg>';
  copyButton.title = "Copy IDL to clipboard";
  copyButton.classList.add("respec-button-copy-paste", "removeOnSave");
  return copyButton;
}

const copyButton = createButton();

/**
 * Adds a HTML button that copies WebIDL to the clipboard.
 *
 * @param {HTMLSpanElement} idlHeader
 */
export function addCopyIDLButton(idlHeader) {
  // There may be multiple <span>s of IDL, so we take everything
  // apart from the idl header.
  const pre = idlHeader.closest("pre.idl");
  const idl = pre.cloneNode(true);
  idl.querySelector(".idlHeader").remove();
  const { textContent: idlText } = idl;
  const button = copyButton.cloneNode(true);
  button.addEventListener("click", () => {
    navigator.clipboard.writeText(idlText);
  });
  idlHeader.append(button);
}
