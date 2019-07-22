// Module core/base-runner
// The module in charge of running the whole processing pipeline.
import "./include-config.js";
import "./override-configuration.js";
import "./respec-ready.js";
import { createRespecDocument } from "../respec-document.js";
import { done as postProcessDone } from "./post-process.js";
import { done as preProcessDone } from "./pre-process.js";
import { pub } from "./pubsubhub.js";
import { removeReSpec } from "./utils.js";

export const name = "core/base-runner";
const canMeasure = performance.mark && performance.measure;

function toRunnable(plug) {
  const name = plug.name || "";
  if (!name) {
    console.warn("Plugin lacks name:", plug);
  }
  return respecDoc => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      const timerId = setTimeout(() => {
        const msg = `Plugin ${name} took too long.`;
        console.error(msg, plug);
        reject(new Error(msg));
      }, 15000);
      if (canMeasure) {
        performance.mark(`${name}-start`);
      }
      try {
        if (typeof plug.default === "function") {
          await plug.default(respecDoc);
          resolve();
        } else if (plug.run.length <= 1) {
          await plug.run(respecDoc.configuration);
          resolve();
        } else {
          console.warn(
            `Plugin ${name} uses a deprecated callback signature. Return a Promise instead. Read more at: https://github.com/w3c/respec/wiki/Developers-Guide#plugins`
          );
          plug.run(respecDoc.configuration, respecDoc.document, resolve);
        }
      } catch (err) {
        reject(err);
      } finally {
        clearTimeout(timerId);
      }
      if (canMeasure) {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
      }
    });
  };
}

export async function runAll(plugs) {
  respecConfig.continueOnError = true;
  const respecDoc = await createRespecDocument(document, respecConfig);
  window.respecDoc = respecDoc;
  const { configuration, hub } = respecDoc;
  hub.pub("start-all", configuration);
  pub("start-all", configuration);
  if (canMeasure) {
    performance.mark(`${name}-start`);
  }
  await preProcessDone;
  const runnables = plugs
    .filter(plug => plug && (typeof plug.default === "function" || plug.run))
    .map(toRunnable);
  for (const task of runnables) {
    try {
      await task(respecDoc);
    } catch (err) {
      console.error(err);
    }
  }
  hub.pub("plugins-done", configuration);
  pub("plugins-done", configuration);
  await postProcessDone;
  hub.pub("end-all", configuration);
  pub("end-all", configuration);
  removeReSpec(document);
  if (canMeasure) {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
  }
}
