// @ts-check
/**
 * Module core/diagrams
 *
 * Draws each `<pre class="mermaid">` as a card: the diagram on the front and
 * its source on the back. The Pele renderer loads on demand, so a document
 * with no diagrams pays nothing for it.
 */
import { getIntlData, showError, showWarning } from "./utils.js";
import { createCopyButton } from "./clipboard.js";
import css from "../styles/diagrams.css.js";
import { html } from "./import-maps.js";
import { insertStyle } from "./insert-style.js";
import { runtimeScript } from "./diagrams-runtime.js";
import { sub } from "./pubsubhub.js";

export const name = "core/diagrams";

const localizationStrings = {
  en: {
    diagram_error: "Diagram error",
    show_source: "Show diagram source",
    copy_aria: "Copy diagram source",
  },
  cs: {
    diagram_error: "Chyba diagramu",
    show_source: "Zobrazit zdroj diagramu",
    copy_aria: "Kopírovat zdroj diagramu",
  },
  de: {
    diagram_error: "Diagrammfehler",
    show_source: "Diagrammquelle anzeigen",
    copy_aria: "Diagrammquelle kopieren",
  },
  es: {
    diagram_error: "Error de diagrama",
    show_source: "Mostrar el código del diagrama",
    copy_aria: "Copiar el código del diagrama",
  },
  fr: {
    diagram_error: "Erreur de diagramme",
    show_source: "Afficher la source du diagramme",
    copy_aria: "Copier la source du diagramme",
  },
  ja: {
    diagram_error: "図のエラー",
    show_source: "図のソースを表示",
    copy_aria: "図のソースをコピー",
  },
  ko: {
    diagram_error: "다이어그램 오류",
    show_source: "다이어그램 소스 보기",
    copy_aria: "다이어그램 소스 복사",
  },
  nl: {
    diagram_error: "Diagramfout",
    show_source: "Diagrambron tonen",
    copy_aria: "Diagrambron kopiëren",
  },
  zh: {
    diagram_error: "图表错误",
    show_source: "显示图表源代码",
    copy_aria: "复制图表源代码",
  },
};
const l10n = getIntlData(localizationStrings);

const PRODUCTION_PELE_URL = "https://www.w3.org/Tools/respec/respec-pele";
const LOAD_TIMEOUT_MS = 6000;

/**
 * The phone layout takes over once the wide drawing would shrink below this
 * fraction of its size. Pele draws labels at 16px, so 0.75 keeps them at 12px.
 */
const MIN_SCALE = 0.75;

/**
 * The width Pele lays the phone layout out for. A drawing wider than this also
 * gets a phone layout.
 */
const PHONE_LAYOUT_WIDTH = 320;

// import.meta.url is the ReSpec script in the bundle. In source mode it is
// this file, where no chunk exists: the built one lives under builds/.
const peleHref = import.meta.url.endsWith("/src/core/diagrams.js")
  ? new URL("../../builds/respec-pele.js", import.meta.url).href
  : new URL("respec-pele.js", import.meta.url).href;

let diagramCount = 0;

/**
 * @param {string} url
 * @returns {Promise<void>}
 */
function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const timer = setTimeout(
      () => finish(new Error(`Timed out loading ${url}`)),
      LOAD_TIMEOUT_MS
    );
    /** @param {Error} [error] */
    function finish(error) {
      clearTimeout(timer);
      script.remove();
      if (error) reject(error);
      else resolve();
    }
    script.onload = () => finish();
    script.onerror = () => finish(new Error(`Could not load ${url}`));
    script.src = url;
    document.head.append(script);
  });
}

/** @returns {Promise<boolean>} true if `self.pele` is ready to use */
async function loadPele() {
  if (self.pele) return true;
  for (const url of [peleHref, PRODUCTION_PELE_URL]) {
    try {
      await loadScript(url);
      if (self.pele) return true;
    } catch (error) {
      console.warn(`Could not load the diagram renderer from ${url}.`, error);
    }
  }
  return false;
}

/** @param {HTMLElement} pre */
function sourceOf(pre) {
  return pre.textContent?.trim() ?? "";
}

/**
 * An id prefix that no element in the document uses yet, so the ids Pele
 * writes never collide with an author's.
 */
function freshPrefix() {
  let prefix;
  do {
    prefix = `respec-diagram-${diagramCount++}`;
  } while (document.querySelector(`[id^="${prefix}"]`));
  return prefix;
}

/**
 * Parse the renderer's SVG as XML, which is stricter than setting innerHTML.
 * @param {string} svg
 * @param {"desktop" | "mobile"} variant
 */
function svgElement(svg, variant) {
  const parsed = new DOMParser().parseFromString(svg, "image/svg+xml");
  const element = document.importNode(parsed.documentElement, true);
  if (!(element instanceof SVGSVGElement)) {
    throw new Error("The renderer did not return valid SVG.");
  }
  element.classList.add("diagram-svg", `diagram-svg--${variant}`);
  return element;
}

/**
 * The reason a diagram failed, as the card and the ReSpec pill show it.
 * @param {unknown} error
 */
function describeError(error) {
  const { message, line, snippet } =
    /** @type {Error & { line?: number, snippet?: string }} */ (
      error instanceof Error ? error : new Error(String(error))
    );
  const snippetLines = new Set((snippet ?? "").split("\n"));
  const description = message
    .split("\n")
    .filter(text => text && !snippetLines.has(text))
    .join(" ");
  return { line: line || 0, description: description || message, message };
}

/**
 * @param {string} source
 * @param {SVGSVGElement[]} svgs
 * @param {string} [captionId]
 */
function buildDiagramBlock(source, svgs, captionId) {
  const copyButton = createCopyButton(
    ".diagramHeader",
    l10n.copy_aria,
    ".diagram-container"
  );
  const card = html`<div
    class="diagram-container"
    role="group"
    data-diagram-source="${source}"
  >
    <header class="diagramHeader">
      <span class="diagram-label">Mermaid</span>
      <button
        type="button"
        class="diagram-flip-btn"
        aria-expanded="false"
        aria-label="${l10n.show_source}"
      >
        ${"</>"}
      </button>
      ${copyButton}
    </header>
    <div class="diagram-flip">
      <div class="diagram-face diagram-face--front">${svgs}</div>
      <div class="diagram-face diagram-face--back">
        <pre
          class="nohighlight"
        ><code class="diagram-source">${source}</code></pre>
      </div>
    </div>
  </div>`;
  if (captionId) card.setAttribute("aria-labelledby", captionId);
  /** @type {HTMLElement} */ (card.querySelector(".diagram-face--back")).inert =
    true;
  return card;
}

/**
 * A row of the source grid that carries the message.
 * @param {string} description
 */
function hintRow(description) {
  const indicator = document.createElement("span");
  indicator.className = "dg-indicator";
  const gutter = document.createElement("span");
  gutter.className = "dg-gutter dg-gutter--error";
  const hint = document.createElement("span");
  hint.className = "dg-code dg-code--hint";
  hint.textContent = description;
  return [indicator, gutter, hint];
}

/**
 * The source with line numbers, the failing line marked, and the message under
 * it. A message with no line goes above the first line.
 * @param {string} source
 * @param {number} failingLine
 * @param {string} description
 */
function buildNumberedSource(source, failingLine, description) {
  const code = document.createElement("code");
  code.className = "diagram-source-grid nohighlight";
  if (!failingLine && description) code.append(...hintRow(description));
  source.split("\n").forEach((text, index) => {
    const lineNumber = index + 1;
    const isError = lineNumber === failingLine;

    const indicator = document.createElement("span");
    indicator.className = isError
      ? "dg-indicator dg-indicator--error"
      : "dg-indicator";
    if (isError) {
      indicator.textContent = "⚠️";
      indicator.setAttribute("aria-hidden", "true");
    }

    const gutter = document.createElement("span");
    gutter.className = isError ? "dg-gutter dg-gutter--error" : "dg-gutter";
    gutter.textContent = String(lineNumber);

    const content = document.createElement("span");
    content.className = isError ? "dg-code dg-code--error" : "dg-code";
    content.textContent = text;

    code.append(indicator, gutter, content);
    if (isError && description) code.append(...hintRow(description));
  });
  return code;
}

/**
 * @param {string} source
 * @param {{ line: number, description: string }} reason
 * @param {string} [captionId]
 */
function buildErrorBlock(source, { line, description }, captionId) {
  const numberedSource = buildNumberedSource(source, line, description);
  const copyButton = createCopyButton(
    ".diagramHeader",
    l10n.copy_aria,
    ".diagram-container"
  );
  const card = html`<div
    class="diagram-container diagram-container--error diagram-container--flipped"
    role="group"
    data-diagram-source="${source}"
  >
    <header class="diagramHeader">
      <span class="diagram-label diagram-label--error">Mermaid</span>
      <button
        type="button"
        class="diagram-flip-btn diagram-flip-btn--error"
        aria-expanded="true"
        aria-label="${l10n.show_source}"
      >
        ${"</>"}
      </button>
      ${copyButton}
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
  if (captionId) card.setAttribute("aria-labelledby", captionId);
  /** @type {HTMLElement} */ (
    card.querySelector(".diagram-face--front")
  ).inert = true;
  return card;
}

/**
 * Draw one diagram, or an error card in its place.
 * @param {HTMLElement} pre
 * @returns {string} the rule that swaps its wide and phone layouts, or ""
 */
function drawDiagram(pre) {
  const source = sourceOf(pre);
  const caption = pre.closest("figure")?.querySelector("figcaption") ?? null;
  const prefix = freshPrefix();
  if (caption && !caption.id) caption.id = `${prefix}-caption`;
  const fontFamily = getComputedStyle(pre.parentElement ?? pre).fontFamily;
  const pele = /** @type {NonNullable<typeof self.pele>} */ (self.pele);

  /** @type {HTMLElement} */
  let card;
  /** @type {{ message: string, hint: string } | undefined} */
  let failure;
  let switchRule = "";
  try {
    const desktop = pele.render(source, { fontFamily, idPrefix: prefix });
    const svgs = [svgElement(desktop.svg, "desktop")];
    if (desktop.width > PHONE_LAYOUT_WIDTH) {
      const phone = pele.render(source, {
        fontFamily,
        idPrefix: `${prefix}-phone`,
        maxWidth: PHONE_LAYOUT_WIDTH,
      });
      if (phone.width < desktop.width) {
        svgs.push(svgElement(phone.svg, "mobile"));
        svgs.forEach(svg => svg.classList.add(prefix));
        const front = `.diagram-face--front .${prefix}`;
        switchRule = `@container (max-width: ${Math.floor(desktop.width * MIN_SCALE)}px) {
  ${front}.diagram-svg--desktop { display: none; }
  ${front}.diagram-svg--mobile { display: block; }
}`;
      }
    }
    card = buildDiagramBlock(source, svgs, caption?.id);
  } catch (error) {
    const { line, description, message } = describeError(error);
    card = buildErrorBlock(source, { line, description }, caption?.id);
    failure = {
      message: `Could not draw the diagram: ${description}`,
      hint: line
        ? `Flip the diagram to see its source with line ${line} marked.`
        : "Start the diagram with a type such as `flowchart`, `sequenceDiagram` or `classDiagram`, then flip the diagram to see its source.",
    };
    console.warn(message);
  }
  if (pre.id) card.id = pre.id;
  pre.replaceWith(card);
  if (failure)
    showError(failure.message, name, { ...failure, elements: [card] });
  return switchRule;
}

/**
 * Put the cards back as they were before any flip, so a document saved just
 * after a click does not keep the flipped state.
 * @param {HTMLElement} documentElement the clone being saved
 */
function resetCards(documentElement) {
  documentElement.querySelectorAll(".diagram-container").forEach(card => {
    const failed = card.classList.contains("diagram-container--error");
    card.classList.toggle("diagram-container--flipped", failed);
    card
      .querySelector(".diagram-flip-btn")
      ?.setAttribute("aria-expanded", String(failed));
    card
      .querySelector(".diagram-face--front")
      ?.toggleAttribute("inert", failed);
    card
      .querySelector(".diagram-face--back")
      ?.toggleAttribute("inert", !failed);
    const flip = card.querySelector(".diagram-flip");
    if (flip instanceof HTMLElement) {
      flip.style.minHeight = "";
      if (!flip.getAttribute("style")) flip.removeAttribute("style");
    }
  });
}

/**
 * @param {Conf} conf
 */
export async function run(conf) {
  const blocks = /** @type {HTMLElement[]} */ ([
    ...document.querySelectorAll("pre.mermaid"),
  ]);
  if (!blocks.length) return;

  if ("mermaid" in conf) {
    showWarning("`respecConfig.mermaid` has no effect any more.", name, {
      hint: "Diagrams take their colors from `--pele-*` CSS variables. Set those in your own stylesheet.",
    });
  }
  const outsideFigure = blocks.filter(pre => !pre.closest("figure"));
  if (outsideFigure.length) {
    showWarning("Diagrams should be inside a `<figure>`.", name, {
      hint: "Wrap the `<pre>` in a `<figure>` and add a `<figcaption>`, so the diagram is numbered and listed with the other figures.",
      elements: outsideFigure,
    });
  }

  const drawable = blocks.filter(pre => sourceOf(pre));
  if (!drawable.length) return;

  insertStyle(css, {
    before: document.querySelector("head link, head > *:last-child"),
  });
  if (!(await loadPele())) {
    showWarning("Could not load the diagram renderer.", name, {
      hint: "Serve `respec-pele.js` next to the ReSpec script. The diagrams stay as text until then.",
      elements: drawable,
    });
    return;
  }
  // Pele measures labels, so the fonts must be ready before it draws.
  await document.fonts?.ready;
  const switchRules = drawable.map(drawDiagram).join("\n");
  if (switchRules) {
    insertStyle(switchRules, {
      before: document.querySelector("head link, head > *:last-child"),
    });
  }

  sub("beforesave", resetCards);
  if (!document.getElementById("respec-diagrams-runtime")) {
    const script = document.createElement("script");
    script.id = "respec-diagrams-runtime";
    script.textContent = runtimeScript;
    document.body.append(script);
  }
}
