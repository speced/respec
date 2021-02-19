// @ts-check
import { showError, showWarning } from "./utils.js";

export const name = "core/extensions";

/**
 * @param {any[]} corePlugins
 * @param {Conf} conf
 */
export function setupExtensions(corePlugins, conf) {
  /** @type {Map<Extension["on"], Extension[]>} */
  const extMap = new Map();
  for (const [i, ext] of Object.entries(conf.extensions || [])) {
    if (!ext.name) {
      const msg = `Extension #${i} does not have a \`name\`.`;
      showWarning(msg, name);
    }
    ext.name = `extensions/${ext.name || i}`;

    if (ext.run instanceof Function == false) {
      const msg = `${ext.name} does not have a \`run()\` function.`;
      showError(msg, name);
      continue;
    }

    const { on } = ext;
    const extsByHookName = extMap.get(on) || extMap.set(on, []).get(on);
    extsByHookName.push(ext);
  }

  const allPlugins = [];
  for (const corePlugin of corePlugins) {
    const beforeHookName = corePlugin.hooks?.find(s => s.startsWith("before-"));
    if (beforeHookName && extMap.has(beforeHookName)) {
      allPlugins.push(...extMap.get(beforeHookName));
      extMap.delete(beforeHookName);
    }

    allPlugins.push(corePlugin);

    const afterHookName = corePlugin.hooks?.find(s => s.startsWith("after-"));
    if (afterHookName && extMap.has(afterHookName)) {
      allPlugins.push(...extMap.get(afterHookName));
      extMap.delete(afterHookName);
    }
  }

  // remaining extensions have no corresponding hooks.
  for (const [on, exts] of extMap) {
    for (const ext of exts) {
      const msg = `${ext.name} does not have a valid \`on\` hook. Found "${on}".`;
      showError(msg, name);
    }
  }

  return allPlugins;
}

export const utils = {
  showError,
  showWarning,
};
