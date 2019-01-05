// @ts-check

/** @type {Record<string, HTMLElement[]>} */
export const definitionMap = Object.create(null);

/**
 * @param {HTMLElement} dfn A definition element to register
 * @param {string[]} names Names to register the element by
 */
export function registerDefinition(dfn, names) {
  for (const name of names) {
    if (!definitionMap[name]) {
      definitionMap[name] = [dfn];
    } else if (!definitionMap[name].includes(dfn)) {
      definitionMap[name].push(dfn);
    }
  }
}
