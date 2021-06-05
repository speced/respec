// @ts-check
// Module core/base-runner
// The module in charge of running the whole processing pipeline.
import { run as includeConfig } from "./include-config.js";
import { init as initReSpecGlobal } from "./respec-global.js";
import { run as overrideConfig } from "./override-configuration.js";
import { run as postProcess } from "./post-process.js";
import { run as preProcess } from "./pre-process.js";
import { pub } from "./pubsubhub.js";
import { removeReSpec } from "./utils.js";

export const name = "core/base-runner";

export async function runAll(plugs) {
  initReSpecGlobal();

  pub("start-all", respecConfig);
  includeConfig(respecConfig);
  overrideConfig(respecConfig);
  performance.mark(`${name}-start`);
  await preProcess(respecConfig);

  const runnables = plugs.filter(p => isRunnableModule(p));
  runnables.forEach(
    plug => !plug.name && console.warn("Plugin lacks name:", plug)
  );
  respecConfig.state = {};
  await executePreparePass(runnables, respecConfig);
  await executeRunPass(runnables, respecConfig);
  respecConfig.state = {};
  pub("plugins-done", respecConfig);

  await postProcess(respecConfig);
  pub("end-all");
  removeReSpec(document);
  performance.mark(`${name}-end`);
  performance.measure(name, `${name}-start`, `${name}-end`);
}

function isRunnableModule(plug) {
  return plug && (plug.run || plug.Plugin);
}

async function executePreparePass(runnables, config) {
  for (const plug of runnables.filter(p => p.prepare)) {
    try {
      await plug.prepare(config);
    } catch (err) {
      console.error(err);
    }
  }
}

async function executeRunPass(runnables, config) {
  for (const plug of runnables) {
    const name = plug.name || "";

    try {
      // eslint-disable-next-line no-async-promise-executor
      await new Promise(async (resolve, reject) => {
        const timerId = setTimeout(() => {
          const msg = `Plugin ${name} took too long.`;
          console.error(msg, plug);
          reject(new Error(msg));
        }, 15000);

        performance.mark(`${name}-start`);
        try {
          if (plug.Plugin) {
            await new plug.Plugin(config).run();
            resolve();
          } else if (plug.run) {
            await plug.run(config);
            resolve();
          }
        } catch (err) {
          reject(err);
        } finally {
          clearTimeout(timerId);
          performance.mark(`${name}-end`);
          performance.measure(name, `${name}-start`, `${name}-end`);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
}
