// Module core/base-runner
// The module in charge of running the whole processing pipeline.
import "core/default-root-attr";
import "core/include-config";
import "core/override-configuration";
import "core/remove-respec";
import "core/respec-ready";
import "deps/regenerator";
import { done as postProcessDone } from "core/post-process";
import { done as preProcessDone } from "core/pre-process";
import { pub } from "core/pubsubhub";

export const name = "core/base-runner";

function toRunnable(plug) {
  const name = plug.name || "";
  // Modern plugins are async or normal functions, take one argument (conf)
  if (plug.run.length === 1) {
    return plug.run.bind(plug);
  }
  // legacy plugins
  return config => {
    return new Promise((resolve, reject) => {
      const timerId = setTimeout(() => {
        const msg = `Plugin ${name} took too long.`;
        console.error(msg, plug);
        reject(new Error(msg));
      }, 15000);
      plug.run(config, document, () => {
        clearTimeout(timerId);
        resolve();
      });
    });
  };
}

export async function runAll(plugs) {
  pub("start-all", respecConfig);
  await preProcessDone;
  const runnables = plugs
    .filter(plug => plug && typeof plug.run === "function" && plug !== this)
    .map(toRunnable);
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
}
