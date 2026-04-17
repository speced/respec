// @ts-check
/**
 * Module core/webidl-clipboard
 *
 * This module adds a button to each IDL pre making it possible to copy
 * well-formatted IDL to the clipboard.
 *
 */
import { createCopyButton } from "./clipboard.js";
export const name = "core/webidl-clipboard";

/**
 * Adds a HTML button that copies WebIDL to the clipboard.
 *
 * @param {HTMLSpanElement} idlHeader
 */
export function addCopyIDLButton(idlHeader) {
  idlHeader.append(createCopyButton(".idlHeader"));
}
