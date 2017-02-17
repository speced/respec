/**
 * Module core/highlight
 *
 * Performs syntax highlighting to all pre and code elements.
 */
import "deps/regenerator";
import ghCss from "deps/text!core/css/github.css";
import { makeOwnerSwapper } from "core/utils";
import { pub, sub } from "core/pubsubhub";
import { worker } from "core/worker";

export const name = "core/highlight";
// Opportunistically insert the style into the head to reduce FOUC.
var codeStyle = document.createElement("style");
codeStyle.textContent = ghCss;
var swapStyleOwner = makeOwnerSwapper(codeStyle);
swapStyleOwner(document.head);

function getLanguageHint(classList) {
  return Array
    .from(classList)
    .filter(item => item !== "highlight" && item !== "nolinks")
    .map(item => item.toLowerCase());
}
let doneResolver;
let doneRejector;
export const done = new Promise((resolve, reject) => {
  doneResolver = resolve;
  doneRejector = reject;
});

export async function run(conf, doc, cb) {
  // Nothing to do
  if (conf.noHighlightCSS) {
    doneResolver();
    return cb();
  }

  if (codeStyle.ownerDocument !== doc) {
    swapStyleOwner(doc.head);
  }

  if (doc.querySelector(".highlight")) {
    pub("warn", "pre elements don't need a 'highlight' class anymore.");
  }

  const promisesToHighlight = Array
    .from(
      doc.querySelectorAll("pre:not(.idl):not(.nohighlight),code.highlight")
    )
    .map(element => {
      element.setAttribute("aria-busy", "true");
      return element;
    })
    .map(element => {
      return new Promise((resolve, reject) => {
        if (element.textContent.trim() === "") {
          return resolve(element); // no work to do
        }
        const msg = {
          action: "highlight",
          code: element.textContent,
          id: Math.random().toString(),
          languages: getLanguageHint(element.classList),
        };
        element.setAttribute("aria-live", "polite");
        worker.postMessage(msg);
        worker.addEventListener("message", function listener(ev) {
          if (ev.data.id !== msg.id) {
            return; // not for us!
          }
          worker.removeEventListener("message", listener);
          const { value, language } = ev.data;
          element.innerHTML = value;
          if (element.localName === "pre") {
            element.classList.add("hljs");
            element.classList.add(language);
          }
          resolve(element);
        });
        setTimeout(() => {
          element.setAttribute("aria-busy", "false");
          const errMsg = "Timeout error trying to process: " + msg.code;
          const err = new Error(errMsg);
          reject(err);
        }, 5000);
      });
    });
  try {
    const tranformedElements = await Promise.all(promisesToHighlight);
    tranformedElements.forEach(
      element => element.setAttribute("aria-busy", "false")
    );
    doneResolver();
  } catch (err) {
    console.error(err);
    doneRejector(err);
  }
  cb();
}
