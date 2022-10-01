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
          async function run(plugins) {
            const allPlugins = plugins.map(p => "/base" + p);
            try {
              const [baseRunner, ...plugs] = await Promise.all(
                allPlugins.map(plug => import(plug))
              );
              await baseRunner.runAll(plugs);
            } catch (err) {
              console.error(err);
              if (document.respec) {
                document.respec.errors.push(err);
              } else {
                Object.defineProperty(document, "respec", {
                  value: { ready: Promise.reject(err) },
                });
              }
            }
          }
          run(${JSON.stringify(plugins)});
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
  const timeoutId = setTimeout(() => {
    throw new Error(`Timed out waiting for document.respec.ready.`);
  }, jasmine.DEFAULT_TIMEOUT_INTERVAL);

  const doc = iframe.contentDocument;
  if (doc.respec) {
    await doc.respec.ready;
    clearTimeout(timeoutId);
    return doc;
  }

  return await new Promise(res => {
    window.addEventListener("message", function msgHandler(ev) {
      if (!doc || !ev.source || doc !== ev.source.document) return;
      if (ev.data.topic === "end-all") {
        window.removeEventListener("message", msgHandler);
        clearTimeout(timeoutId);
        res(doc);
      }
    });
  });
}

export function flushIframes() {
  while (iframes.length) {
    // Popping them from the list prevents memory leaks.
    iframes.pop().remove();
  }
}
