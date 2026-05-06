// @ts-check
/**
 * Module core/diagrams
 *
 * Coordinator for diagram rendering. Detects diagram blocks,
 * lazy-loads the appropriate renderer, builds the flip-card DOM,
 * handles errors, and injects the runtime script.
 */
import { createCopyButton, injectCopyScript } from "./clipboard.js";
import { getIntlData, showError, showWarning } from "./utils.js";
import css from "../styles/diagrams.css.js";
import { html } from "./import-maps.js";
import { runtimeScript } from "./diagrams-runtime.js";

export const name = "core/diagrams";

const localizationStrings = {
  en: {
    diagram_error: "Diagram error!",
    click_to_view_source: "Diagram. Click to view source.",
    click_to_hide_source: "Source. Click to view diagram.",
    copy_aria: "Copy diagram source",
    load_failed: "Could not load diagram renderer. Diagrams shown as source.",
  },
  ja: {
    diagram_error: "図のエラー：",
    click_to_view_source: "図。クリックでソースを表示。",
    click_to_hide_source: "ソース。クリックで図を表示。",
    copy_aria: "図のソースをコピー",
    load_failed: "図レンダラーを読み込めませんでした。",
  },
  ko: {
    diagram_error: "다이어그램 오류:",
    click_to_view_source: "다이어그램. 클릭하여 소스 보기.",
    click_to_hide_source: "소스. 클릭하여 다이어그램 보기.",
    copy_aria: "다이어그램 소스 복사",
    load_failed: "다이어그램 렌더러를 로드할 수 없습니다.",
  },
  nl: {
    diagram_error: "Diagramfout:",
    click_to_view_source: "Diagram. Klik om bron te bekijken.",
    click_to_hide_source: "Bron. Klik om diagram te bekijken.",
    copy_aria: "Diagrambron kopiëren",
    load_failed: "Kon diagramrenderer niet laden.",
  },
  es: {
    diagram_error: "Error de diagrama:",
    click_to_view_source: "Diagrama. Haga clic para ver el código fuente.",
    click_to_hide_source: "Código fuente. Haga clic para ver el diagrama.",
    copy_aria: "Copiar código del diagrama",
    load_failed: "No se pudo cargar el renderizador de diagramas.",
  },
  fr: {
    diagram_error: "Erreur de diagramme :",
    click_to_view_source: "Diagramme. Cliquez pour voir le source.",
    click_to_hide_source: "Source. Cliquez pour voir le diagramme.",
    copy_aria: "Copier le source du diagramme",
    load_failed: "Impossible de charger le moteur de diagrammes.",
  },
};
const l10n = getIntlData(localizationStrings);

const PRODUCTION_MERMAID_URL = "https://www.w3.org/Tools/respec/respec-mermaid";

/**
 * Lazy-load the mermaid library via script injection.
 * @returns {Promise<boolean>} true if loaded successfully
 */
async function loadMermaidLib() {
  // @ts-ignore
  if (self.respecMermaid) return true;

  const primaryUrl = new URL("respec-mermaid.js", import.meta.url).href;

  for (const url of [primaryUrl, PRODUCTION_MERMAID_URL]) {
    try {
      await loadScript(url);
      // @ts-ignore
      if (self.respecMermaid) return true;
    } catch {
      // fallback to next URL
    }
  }
  return false;
}

/**
 * @param {string} url
 * @returns {Promise<void>}
 */
function loadScript(url) {
  const { promise, resolve, reject } =
    /** @type {PromiseWithResolvers<void>} */ (Promise.withResolvers());
  const script = document.createElement("script");
  script.src = url;
  script.onload = () => {
    script.remove();
    resolve();
  };
  script.onerror = event => {
    script.remove();
    reject(new Error(`Failed to load: ${url}`, { cause: event }));
  };
  document.head.append(script);
  return promise;
}

/**
 * Build the diagram DOM with classic 3D flip card pattern.
 * @param {string} svg
 * @param {string} source
 * @returns {HTMLElement}
 */
function buildDiagramBlock(svg, source) {
  const copyBtn = createCopyButton(
    ".diagramHeader",
    l10n.copy_aria,
    ".diagram-container"
  );
  return html`<div class="diagram-container" data-diagram-source="${source}">
    <header class="diagramHeader">
      <span class="diagram-label">Mermaid</span>
      <button
        class="diagram-flip-btn"
        aria-label="${l10n.click_to_view_source}"
        aria-expanded="false"
        data-label-source="${l10n.click_to_view_source}"
        data-label-diagram="${l10n.click_to_hide_source}"
      >
        ${"</>"}
      </button>
      ${copyBtn}
    </header>
    <div class="diagram-flip">
      <div class="diagram-face diagram-face--front">${{ html: svg }}</div>
      <div class="diagram-face diagram-face--back">
        <pre
          class="nohighlight"
        ><code class="mermaid-source">${source}</code></pre>
      </div>
    </div>
  </div>`;
}

/**
 * Parse mermaid error to extract line, pointer, and description.
 * @param {string} errorMsg
 * @returns {{ line: number | null, pointer: string, description: string }}
 */
function parseMermaidError(errorMsg) {
  const lineMatch = errorMsg.match(/line (\d+)/i);
  const line = lineMatch ? parseInt(lineMatch[1], 10) : null;
  const parts = errorMsg.split("\n");
  let pointer = "";
  let description = "";
  const pointerIndex = parts.findIndex(
    p => p.includes("^") && !p.startsWith("Parse")
  );
  if (pointerIndex !== -1) {
    pointer = parts[pointerIndex];
    description = parts
      .slice(pointerIndex + 1)
      .filter(Boolean)
      .join(" ")
      .trim();
  }
  if (!description) description = [...parts].reverse().find(Boolean) || "";
  return { line, pointer, description };
}

/**
 * Build source with line numbers and inline error pointer.
 * @param {string} source
 * @param {{ line: number | null, pointer: string, description: string }} error
 * @returns {HTMLElement}
 */
function buildNumberedSource(source, error) {
  const code = document.createElement("code");
  code.className = "diagram-source-grid nohighlight";
  const lines = source.split("\n");
  lines.forEach((line, i) => {
    const lineNum = i + 1;
    const isError = lineNum === error.line;

    const indicator = document.createElement("span");
    indicator.className = isError
      ? "dg-indicator dg-indicator--error"
      : "dg-indicator";
    if (isError) {
      indicator.textContent = "⚠️";
      if (error.description) {
        indicator.style.gridRow = "span 2";
      }
    }

    const gutter = document.createElement("span");
    gutter.className = isError ? "dg-gutter dg-gutter--error" : "dg-gutter";
    gutter.textContent = String(lineNum);

    const content = document.createElement("span");
    content.className = isError ? "dg-code dg-code--error" : "dg-code";
    content.textContent = line;

    code.append(indicator, gutter, content);

    if (lineNum === error.line && error.description) {
      const hintGutter = document.createElement("span");
      hintGutter.className = "dg-gutter dg-gutter--error";
      const hintCode = document.createElement("span");
      hintCode.className = "dg-code dg-code--hint";
      hintCode.textContent = error.pointer
        ? `${error.pointer} ${error.description}`
        : `^ ${error.description}`;
      code.append(hintGutter, hintCode);
    }
  });
  return code;
}

/**
 * Build the error DOM with 3D flip card.
 * Front: "Diagram error!" message.
 * Back: line-numbered source with inline error pointer.
 * @param {string} errorMsg
 * @param {string} source
 * @returns {HTMLElement}
 */
function buildErrorBlock(errorMsg, source) {
  const error = parseMermaidError(errorMsg);
  const numberedSource = buildNumberedSource(source, error);
  const copyBtn = createCopyButton(
    ".diagramHeader",
    l10n.copy_aria,
    ".diagram-container"
  );
  return html`<div
    class="diagram-container diagram-container--error diagram-container--flipped"
    data-diagram-source="${source}"
  >
    <header class="diagramHeader">
      <span class="diagram-label diagram-label--error">Mermaid</span>
      <button
        class="diagram-flip-btn diagram-flip-btn--error"
        aria-label="${l10n.click_to_hide_source}"
        aria-expanded="true"
        data-label-source="${l10n.click_to_view_source}"
        data-label-diagram="${l10n.click_to_hide_source}"
      >
        ${"</>"}
      </button>
      ${copyBtn}
    </header>
    <div class="diagram-flip">
      <div class="diagram-face diagram-face--front diagram-error-front">
        ${l10n.diagram_error}
      </div>
      <div class="diagram-face diagram-face--back">
        <pre class="nohighlight">${numberedSource}</pre>
      </div>
    </div>
  </div>`;
}

/**
 * @param {Conf} conf
 */
export async function run(conf) {
  /** @type {NodeListOf<HTMLElement>} */
  const mermaidBlocks = document.querySelectorAll("pre.mermaid");

  if (!mermaidBlocks.length) return;

  let counter = 0;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.append(style);

  const loaded = await loadMermaidLib();
  if (!loaded) {
    showWarning(l10n.load_failed, name);
    return;
  }

  // @ts-expect-error -- mermaid config not in Conf type yet
  const theme = conf.mermaid?.theme || "neutral";
  // @ts-ignore
  self.respecMermaid.initialize({ theme });

  const mermaidRenderer = await import("./diagrams/mermaid.js");

  const renderPromises = [...mermaidBlocks].map(async pre => {
    const source = pre.textContent?.trim();
    if (!source) return;

    const figure = pre.closest("figure");

    const figcaption = figure?.querySelector("figcaption") ?? null;

    if (figcaption && !figcaption.id) {
      const figureId = figure?.id || "";
      figcaption.id = figureId
        ? `${figureId}-caption`
        : `respec-diagram-caption-${counter}`;
      counter++;
    }

    const result = await mermaidRenderer.render(source);

    if ("svg" in result) {
      const diagramBlock = buildDiagramBlock(result.svg, source);
      pre.replaceWith(diagramBlock);
    } else {
      const errorBlock = buildErrorBlock(result.error, source);
      pre.replaceWith(errorBlock);
      showError(
        `Mermaid diagram parse error${figure?.id ? ` in figure '${figure.id}'` : ""}: ${result.error}`,
        name,
        { elements: figure ? [/** @type {HTMLElement} */ (figure)] : [] }
      );
    }
  });

  await Promise.allSettled(renderPromises);

  injectCopyScript();

  if (!document.getElementById("respec-diagrams-runtime")) {
    const script = document.createElement("script");
    script.id = "respec-diagrams-runtime";
    script.textContent = runtimeScript;
    document.body.append(script);
  }
}
