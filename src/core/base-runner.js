// Module core/base-runner
// The module in charge of running the whole processing pipeline.
import pubsubhub from "core/pubsubhub";
import "core/pre-process";
import "core/post-process";

function toRunnable(plug) {
  return config => {
    return new Promise((resolve, reject) => {
      plug.run(config, document, resolve);
      setTimeout(() => {
        reject(new Error("Plugin took too long."));
      }, 5000);
    });
  };
}

export async function runAll(plugs) {
  pubsubhub.pub("start-all", window.respecConfig);
  const runnables = plugs
    .filter(plug => plug && typeof plug.run === "function" && plug !== this)
    .map(toRunnable);
  for (const task of runnables) {
    try {
      await task(window.respecConfig);
    } catch (err) {
      console.error(err);
    }
  }
  pubsubhub.pub("end-all", window.respecConfig);
};
