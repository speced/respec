// @ts-check
/**
 * Module core/highlight
 *
 * Performs syntax highlighting to all pre and code elements.
 */
import { fetchAsset } from "./text-loader.js";
import { html } from "./import-maps.js";
import { msgIdGenerator } from "./utils.js";
import { workerPromise } from "./worker.js";
export const name = "core/highlight";

const nextMsgId = msgIdGenerator("highlight");

async function loadStyle() {
  try {
    return (await import("text!../../assets/highlight.css")).default;
  } catch {
    return fetchAsset("highlight.css");
  }
}

function getLanguageHint(classList) {
  return Array.from(classList)
    .filter(item => item !== "highlight" && item !== "nolinks")
    .map(item => item.toLowerCase());
}

async function highlightElement(elem) {
  elem.setAttribute("aria-busy", "true");
  const languages = getLanguageHint(elem.classList);
  let response;
  try {
    response = await sendHighlightRequest(elem.innerText, languages);
  } catch (err) {
    console.error(err);
    return;
  }
  const { language, value } = response;
  switch (elem.localName) {
    case "pre":
      elem.classList.remove(language);
      elem.innerHTML = `<code class="hljs${
        language ? ` ${language}` : ""
      }">${value}</code>`;
      if (!elem.classList.length) elem.removeAttribute("class");
      break;
    case "code":
      elem.innerHTML = value;
      elem.classList.add("hljs");
      if (language) elem.classList.add(language);
      break;
  }
  elem.setAttribute("aria-busy", "false");
}

async function sendHighlightRequest(code, languages) {
  const msg = {
    action: "highlight",
    code,
    id: nextMsgId(),
    languages,
  };
  const worker = await workerPromise;
  worker.postMessage(msg);
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error("Timed out waiting for highlight."));
    }, 4000);
    worker.addEventListener("message", function listener(ev) {
      const {
        data: { id, language, value },
      } = ev;
      if (id !== msg.id) return; // not for us!
      worker.removeEventListener("message", listener);
      clearTimeout(timeoutId);
      resolve({ language, value });
    });
  });
}

export async function prepare(conf) {
  if (conf.noHighlightCSS) return;

  const style = html`<style id="respec-css-highlight">
    ${await loadStyle()}
  </style>`;
  document.head.appendChild(style);
}

export async function run(conf) {
  // Nothing to highlight
  if (conf.noHighlightCSS) return;
  const highlightables = [
    ...document.querySelectorAll(`
    pre:not(.idl):not(.nohighlight) > code:not(.nohighlight),
    pre:not(.idl):not(.nohighlight),
    code.highlight
  `),
  ].filter(
    // Filter pre's that contain code
    elem => elem.localName !== "pre" || !elem.querySelector("code")
  );
  // Nothing to highlight
  if (!highlightables.length) {
    document.getElementById("respec-css-highlight").remove();
    return;
  }
  const promisesToHighlight = highlightables
    .filter(elem => elem.textContent.trim())
    .map(highlightElement);

  await Promise.all(promisesToHighlight);
}
