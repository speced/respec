/**
 * Module core/highlight
 *
 * Performs syntax highlighting to all pre and code elements.
 */
import ghCss from "text!../../assets/github.css";
import { worker } from "./worker";
export const name = "core/highlight";

// Opportunistically insert the style into the head to reduce FOUC.
const codeStyle = document.createElement("style");
codeStyle.textContent = ghCss;
document.head.appendChild(codeStyle);
function getLanguageHint(classList) {
  return Array.from(classList)
    .filter(item => item !== "highlight" && item !== "nolinks")
    .map(item => item.toLowerCase());
}

export async function run(conf) {
  // Nothing to highlight
  if (conf.noHighlightCSS) {
    codeStyle.remove();
    return;
  }
  const highlightables = Array.from(
    document.querySelectorAll("pre:not(.idl):not(.nohighlight), code.highlight")
  );
  // Nothing to highlight
  if (highlightables.length === 0) {
    codeStyle.remove();
    return;
  }
  const promisesToHighlight = highlightables.map((element, i) => {
    return new Promise(resolve => {
      if (element.textContent.trim() === "") {
        return resolve(); // no work to do
      }
      const done = () => {
        element.setAttribute("aria-busy", "false");
        resolve();
      };
      // We always resolve, even if we couldn't actually highlight
      const timeoutId = setTimeout(() => {
        console.error("Timed-out waiting for highlight:", element);
        done();
      }, 4000);
      const msg = {
        action: "highlight",
        code: element.textContent,
        id: `highlight:${i}`,
        languages: getLanguageHint(element.classList),
      };
      worker.addEventListener("message", function listener(ev) {
        const {
          data: { id, language, value },
        } = ev;
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
      element.setAttribute("aria-busy", "true");
      worker.postMessage(msg);
    });
  });
  await Promise.all(promisesToHighlight);
}
