// @ts-check
const inAmd = !!window.require;
if (!inAmd) {
  /**
   * @type {any}
   * @param {string[]} deps
   * @param {(...modules: any[]) => void} callback
   */
  const require = function (deps, callback) {
    const modules = deps.map(dep => {
      if (!(dep in window.require.modules)) {
        throw new Error(`Unsupported dependency name: ${dep}`);
      }
      return window.require.modules[dep];
    });
    Promise.all(modules).then(results => callback(...results));
  };
  require.modules = {};
  window.require = require;
}

/**
 * @param {string} name
 * @param {object | Promise<object>} object
 */
export function expose(name, object) {
  if (!inAmd) {
    window.require.modules[name] = object;
  }
}
