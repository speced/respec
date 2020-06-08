// @ts-check
import { CaseInsensitiveMap } from "./utils.js";

/** @type {CaseInsensitiveMap<Set<HTMLElement>>} */
export const definitionMap = new CaseInsensitiveMap();

/**
 * @param {HTMLElement} dfn A definition element to register
 * @param {string[]} names Names to register the element by
 */
export function registerDefinition(dfn, names) {
  for (const name of names) {
    if (!definitionMap.has(name)) {
      definitionMap.set(name, new Set());
    }
    definitionMap.get(name).add(dfn);
  }
}
