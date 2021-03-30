"use strict";
const iframes = [];

/**
 * Create a doc for unit tests.
 * @param {string[]} plugins Paths of plugins to load and run. Example: `/src/core/algorithms.js`
 * @param {object} config JSON-serializable respecConfig object.
 * @return {Promise<Document>}
 */
export function makePluginDoc(
  plugins,
  config = {},
  { head = `<meta charset="UTF-8" />`, body = "" } = {}
) {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        ${head}
        <script>
          var respecConfig = ${JSON.stringify(config || {}, null, 2)};
        </script>
        <script type="module">
          async function run(plugins) {
            const allPlugins = ["/src/core/base-runner.js"]
              .concat(plugins)
              .map(p => "/base" + p);
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
  `;

  return new Promise((resolve, reject) => {
    const ifr = document.createElement("iframe");
    const timeoutId = setTimeout(() => {
      reject(new Error(`Timed out waiting.`));
    }, jasmine.DEFAULT_TIMEOUT_INTERVAL);
    ifr.addEventListener("load", async () => {
      const doc = ifr.contentDocument;
      if (doc.respec) {
        await doc.respec.ready;
        resolve(doc);
      }
      window.addEventListener("message", function msgHandler(ev) {
        if (
          !doc ||
          !ev.source ||
          doc !== ev.source.document ||
          ev.data.topic !== "end-all"
        ) {
          return;
        }
        window.removeEventListener("message", msgHandler);
        resolve(doc);
        clearTimeout(timeoutId);
      });
    });
    ifr.style.display = "none";
    const doc = new DOMParser().parseFromString(html, "text/html");
    ifr.srcdoc = doc.documentElement.outerHTML;

    // trigger load
    document.body.appendChild(ifr);
    iframes.push(ifr);
  });
}

export function flushIframes() {
  while (iframes.length) {
    // Popping them from the list prevents memory leaks.
    iframes.pop().remove();
  }
}
