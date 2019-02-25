import { fetchAndCache } from "./utils";
import hyperHTML from "hyperhtml";
import mdnCss from "text!../../assets/mdn-annotation.css";

export const name = "core/mdn-annoatation";

const SPEC_MAP_URL =
  "https://raw.githubusercontent.com/w3c/mdn-spec-links/master/SPECMAP.json";
const JSON_BASE = "https://w3c.github.io/mdn-spec-links/";
const MDN_URL_BASE = "https://developer.mozilla.org/en-US/docs/Web/";

async function fetchAndCacheJson(url, maxAge) {
  if (!url) return {};
  const request = new Request(url);
  return await fetchAndCache(request, maxAge).then(r => r.json());
}

export async function run(conf) {
  const { shortName, mdnAnnotation } = conf;
  if (!shortName) {
    // Nothing to do if shortName is not provided
    return;
  }
  const maxAge = (mdnAnnotation && mdnAnnotation.maxAge) || 60 * 60 * 24 * 1000;
  const specMap = await fetchAndCacheJson(SPEC_MAP_URL, maxAge);
  const hasSpecJson = Object.values(specMap).some(
    jsonName => jsonName === `${shortName}.json`
  );
  if (!hasSpecJson) {
    return;
  }
  const mdnSpecJson = await fetchAndCacheJson(
    `${JSON_BASE}/${shortName}.json`,
    maxAge
  );
  const nodesWithId = document.querySelectorAll("[id]");
  const unlikelyTagNames = ["STYLE", "SCRIPT", "BODY"];
  document.head.appendChild(hyperHTML`<style>${[mdnCss]}</style>`);
  document.head.appendChild(hyperHTML`<script>
     function toggleStatus(div) {
       div.parentNode.classList.toggle('wrapped');
     }
  </script>`);
  [...nodesWithId]
    .filter(node => {
      return (
        unlikelyTagNames.indexOf(node.tagName) === -1 &&
        mdnSpecJson[node.id] &&
        Array.isArray(mdnSpecJson[node.id])
      );
    })
    .forEach(node => {
      const mdnSpecArray = mdnSpecJson[node.id];
      let targetAncestor = node;
      // Find the furthest ancestor that is a direct child of <body>
      while (targetAncestor.parentNode.tagName !== "BODY") {
        targetAncestor = targetAncestor.parentNode;
      }
      const targetSibling = targetAncestor.previousElementSibling;
      let mdnBox;
      if (targetSibling && targetSibling.classList.contains("mdn")) {
        // If the target ancestor already has a mdnBox inserted, we just use it
        mdnBox = targetSibling;
      } else {
        mdnBox = hyperHTML`<aside class="mdn before">
          <input type="button" onclick="toggleStatus(this)" value="⋰" >
        </aside>`;
        document.body.insertBefore(mdnBox, targetAncestor);
      }
      mdnSpecArray
        .map(spec => {
          const mdnDiv = document.createElement("div");
          mdnDiv.innerHTML += `<b>MDN </b>`;
          const { slug, summary } = spec;
          const mdnSubPath = slug.slice(slug.indexOf("/") + 1);
          mdnDiv.innerHTML += `
            <details>
              <summary>
                <a title="${summary}" href="${MDN_URL_BASE}${slug}">${mdnSubPath}</a>
              </summary>
            </details>
          `;
          return mdnDiv;
        })
        .forEach(mdnDiv => mdnBox.appendChild(mdnDiv));
    });
}
