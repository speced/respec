import { runAll } from "./core/base-runner.js";
import { ui } from "./core/ui.js";

// In case everything else fails, we want the error
window.addEventListener("error", ev => {
  console.error(ev.error, ev.message, ev);
});

export async function run(plugins) {
  try {
    ui.show();
    await domReady();
    await runAll(plugins);
  } finally {
    ui.enable();
  }
}

async function domReady() {
  if (document.readyState === "loading") {
    await new Promise(resolve =>
      document.addEventListener("DOMContentLoaded", resolve)
    );
  }
}
