import { docLink, showError } from "./utils.js";
import { sub } from "./pubsubhub.js";

export const name = "core/before-save";

export function run(conf) {
  if (!conf.beforeSave) return;

  if (
    !Array.isArray(conf.beforeSave) ||
    conf.beforeSave.some(
      el => typeof el !== "function" || el.constructor.name === "AsyncFunction"
    )
  ) {
    const msg = docLink`${"[beforeSave]"} configuration option must be an array of synchronous JS functions.`;
    showError(msg, name);
    return;
  }

  sub(
    "beforesave",
    documentElement => {
      performTransformations(conf.beforeSave, documentElement.ownerDocument);
    },
    { once: true }
  );
}
/**
 * @param {Array<Function>} transforms
 * @param {Document}
 */
function performTransformations(transforms, doc) {
  let pos = 0;
  for (const fn of transforms) {
    try {
      fn(doc);
    } catch (err) {
      const nameOrPosition = `\`${fn.name}\`` || `at position ${pos}`;
      const msg = docLink`Function ${nameOrPosition}\` threw an error during processing of ${"[beforeSave]"}.`;
      const hint = "See developer console.";
      showError(msg, name, { hint });
      console.error(err);
    } finally {
      pos++;
    }
  }
}
