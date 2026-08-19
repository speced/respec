// @ts-check
import mermaid from "mermaid/dist/mermaid.esm.mjs";

/**
 * @param {{ theme?: string }} options
 */
function initialize({ theme = "neutral" } = {}) {
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    htmlLabels: false,
    theme,
  });
}

initialize();

/**
 * @param {string} source
 * @param {{ id: string }} options
 * @returns {Promise<{ svg: string } | { error: string }>}
 */
async function render(source, { id }) {
  // Use an off-screen container so mermaid's error SVGs don't leak into view.
  // Cannot use display:none as mermaid needs layout for dimension calculation.
  const container = document.createElement("div");
  container.id = `${id}-container`;
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "-9999px";
  document.body.append(container);
  try {
    const { svg } = await mermaid.render(id, source, container);
    return { svg };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { error: message };
  } finally {
    container.remove();
    document.getElementById(id)?.remove();
  }
}

self.respecMermaid = { initialize, render };
