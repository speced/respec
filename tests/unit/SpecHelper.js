"use strict";
const iframes = [];

/**
 * Create a doc for unit tests.
 * @param {string[]} plugins Paths of plugins to load and run. Example: `/src/core/algorithms.js`
 * @param {object} [options]
 * @param {object} [options.config] JSON-serializable respecConfig object.
 * @param {string} [options.head]
 * @param {string} [options.body]
 * @return {Promise<Document>}
 */
export function makePluginDoc(
  plugins,
  { config = {}, head = `<meta charset="UTF-8" />`, body = "" } = {}
) {
  plugins = [
    "/src/core/base-runner.js",
    "/src/core/ui.js", // Needed for "start-all" event
    "/src/core/dfn.js", // Needed for "plugins-done" event,
    ...plugins,
  ];
  return getDoc(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        ${head}
        <script>
          var respecConfig = ${JSON.stringify(config || {}, null, 2)};
        </script>
        <script type="module">
          const plugins = ${JSON.stringify(plugins)};
          window.respecReady = (async () => {
            const [baseRunner, ...plugs] = await Promise.all(
              plugins.map(plug => import("/base" + plug))
            );
            await baseRunner.runAll(plugs);
          })();
        </script>
      </head>
      <body>${body}</body>
    </html>
  `);
}

/**
 * @param {string} html
 * @return {Promise<Document>}
 */
function getDoc(html) {
  return new Promise((resolve, reject) => {
    const ifr = document.createElement("iframe");
    ifr.addEventListener("load", () =>
      waitReady(ifr).then(resolve).catch(reject)
    );
    ifr.style.display = "none";
    const doc = new DOMParser().parseFromString(html, "text/html");
    ifr.srcdoc = doc.documentElement.outerHTML;

    // trigger load
    document.body.appendChild(ifr);
    iframes.push(ifr);
  });
}

/**
 * @param {HTMLIFrameElement} iframe
 * @return {Promise<Document>}
 */
async function waitReady(iframe) {
  // makePluginDoc exposes the promise for its own ReSpec run, so await that
  // rather than the "end-all" postMessage: document.respec only exists once
  // the dynamically imported plugins have loaded, which is after iframe load.
  await iframe.contentWindow.respecReady;
  return iframe.contentDocument;
}

export function flushIframes() {
  while (iframes.length) {
    // Popping them from the list prevents memory leaks.
    iframes.pop().remove();
  }
}
