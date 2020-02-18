// @ts-check
// Module core/base-runner
// The module in charge of running the whole processing pipeline.
import "./include-config.js";
import "./override-configuration.js";
import "./respec-ready.js";
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
  return config => {
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
        if (plug.Plugin) {
          await new plug.Plugin(config).run();
          resolve();
        } else if (plug.run.length <= 1) {
          await plug.run(config);
          resolve();
        } else {
          console.warn(
            `Plugin ${name} uses a deprecated callback signature. Return a Promise instead. Read more at: https://github.com/w3c/respec/wiki/Developers-Guide#plugins`
          );
          plug.run(config, document, resolve);
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

function isRunnableModule(plug) {
  return plug && (plug.run || plug.Plugin);
}

export async function runAll(plugs) {
  pub("start-all", respecConfig);
  if (canMeasure) {
    performance.mark(`${name}-start`);
  }
  await preProcessDone;
  const runnables = plugs.filter(isRunnableModule).map(toRunnable);
  for (const task of runnables) {
    try {
      await task(respecConfig);
    } catch (err) {
      console.error(err);
    }
  }
  pub("plugins-done", respecConfig);
  await postProcessDone;
  pub("end-all", respecConfig);
  removeReSpec(document);
  if (canMeasure) {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
  }
}
