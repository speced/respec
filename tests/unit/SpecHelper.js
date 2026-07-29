"use strict";
const iframes = [];
const POLL_INTERVAL_MS = 100;

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
        <base href="${window.location.origin}/" />
        ${head}
        <script>
          // Prevent unhandled rejections with undefined reason from propagating
          // to the parent frame (Safari strips the reason across opaque origins,
          // causing jasmine-core to crash on formatProperties(undefined).split).
          window.addEventListener("unhandledrejection", function(e) {
            if (e.reason === undefined || e.reason === null) e.preventDefault();
          });
          var respecConfig = ${JSON.stringify(config || {}, null, 2)};
        </script>
        <script type="module">
          async function run(plugins, origin) {
            const allPlugins = plugins.map(p => origin + "/base" + p);
            try {
              const [baseRunner, ...plugs] = await Promise.all(
                allPlugins.map(plug => import(plug))
              );
              await baseRunner.runAll(plugs);
            } catch (rawErr) {
              // Normalise to a real Error so Safari never rejects with
              // undefined (which crashes jasmine-core's formatProperties).
              const err =
                rawErr instanceof Error
                  ? rawErr
                  : new Error(String(rawErr ?? "ReSpec failed"));
              console.error(err);
              if (document.respec) {
                document.respec.errors.push(err);
              } else {
                // Add a void .catch() so Safari doesn't propagate this
                // rejected Promise as an unhandled rejection to the parent
                // frame (where it arrives with reason=undefined, crashing
                // jasmine-core's formatProperties).
                const ready = Promise.reject(err);
                ready.catch(() => {});
                Object.defineProperty(document, "respec", { value: { ready } });
              }
            }
          }
          run(${JSON.stringify(plugins)}, ${JSON.stringify(window.location.origin)});
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
  const doc = iframe.contentDocument;
  if (doc && doc.respec) {
    await doc.respec.ready;
    return doc;
  }

  return await new Promise((resolve, reject) => {
    let settled = false;

    // Settle exactly once: cancel all pending timers/listeners, then call fn.
    function settle(fn) {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      clearInterval(pollId);
      window.removeEventListener("message", msgHandler);
      fn();
    }

    const timeoutId = setTimeout(
      () =>
        settle(() =>
          reject(new Error("Timed out waiting for document.respec.ready."))
        ),
      jasmine.DEFAULT_TIMEOUT_INTERVAL
    );

    // Polling fallback: in Safari, postMessage from srcdoc iframes may not be
    // received because ev.source !== iframe.contentWindow (different proxy
    // objects for opaque-origin frames). Poll doc.respec.ready directly so
    // tests complete without relying solely on postMessage.
    // Re-read iframe.contentDocument on each tick because Safari can replace
    // the document object for opaque-origin srcdoc iframes after initial load.
    const pollId = setInterval(() => {
      try {
        const currentDoc = iframe.contentDocument;
        if (!currentDoc || !currentDoc.respec) return;
        settle(() => {
          currentDoc.respec.ready.then(() => resolve(currentDoc), reject);
        });
      } catch {
        // Cross-origin access denied; rely on postMessage path.
      }
    }, POLL_INTERVAL_MS);

    function msgHandler(ev) {
      // Don't check ev.source: in Safari, opaque-origin srcdoc iframes send
      // postMessages with ev.source being a different WindowProxy than
      // iframe.contentWindow, so identity checks always fail. Tests run
      // sequentially (jasmine), so at most one waitReady is active at a time;
      // matching on topic alone is safe.
      if (ev.data?.topic === "end-all") {
        settle(() => resolve(iframe.contentDocument));
      }
    }
    window.addEventListener("message", msgHandler);
  });
}

export function flushIframes() {
  while (iframes.length) {
    // Popping them from the list prevents memory leaks.
    iframes.pop().remove();
  }
}
