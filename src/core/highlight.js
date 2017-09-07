/**
 * Module core/highlight
 *
 * Performs syntax highlighting to all pre and code elements.
 */
import "deps/regenerator";
import ghCss from "deps/text!core/css/github.css";
import { pub, sub } from "core/pubsubhub";
import { worker } from "core/worker";

export const name = "core/highlight";

// Opportunistically insert the style into the head to reduce FOUC.
const codeStyle = document.createElement("style");
codeStyle.textContent = ghCss;
document.head.appendChild(codeStyle);
let idCounter = 0;
function getLanguageHint(classList) {
  return Array.from(classList)
    .filter(item => item !== "highlight" && item !== "nolinks")
    .map(item => item.toLowerCase());
}

export async function run(conf) {
  // Nothing to do
  if (conf.noHighlightCSS) {
    return;
  }
  const highlightables = Array.from(
    document.querySelectorAll("pre:not(.idl):not(.nohighlight), code.highlight")
  );
  if (!highlightables.length) {
    return;
  }
  const promisesToHighlight = highlightables.map(element => {
    return new Promise(resolve => {
      if (element.textContent.trim() === "") {
        return resolve(element); // no work to do
      }
      const done = () => {
        element.setAttribute("aria-busy", "false");
        resolve(element);
      };
      // We always resolve, even if we couldn't actually highlight
      const timeoutId = setTimeout(() => {
        console.error("Timed-out waiting for highlight:", element);
        done();
      }, 4000);
      const msg = {
        action: "highlight",
        code: element.textContent,
        id: "highlight:" + idCounter++,
        languages: getLanguageHint(element.classList),
      };
      element.setAttribute("aria-busy", "true");
      element.setAttribute("aria-live", "polite");
      worker.postMessage(msg);
      worker.addEventListener("message", function listener(ev) {
        const { data: { id, code, language, value } } = ev;
        if (id !== msg.id) {
          return; // not for us!
        }
        element.innerHTML = value;
        if (element.localName === "pre") {
          element.classList.add("hljs");
        }
        if (language) {
          element.classList.add(language);
        }
        clearTimeout(timeoutId);
        worker.removeEventListener("message", listener);
        done();
      });
    });
  });
  await Promise.all(promisesToHighlight);
}
