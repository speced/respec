/**
 * Experimental: annotates fetched source (main document + `data-include`d
 * HTML/markdown) with `respec-sourcemap` markers, so
 * `src/core/sourcemap.js#getSourcemapLocation` can recover a source
 * `path:line` for elements a ReSpec error/warning points at. Also handles
 * intercepting and annotating Puppeteer requests, and narrowing the location
 * ranges that come back on errors/warnings.
 *
 * Two marker forms: `data-respec-line="path:line"` on (almost) every HTML
 * element (exact, survives DOM moves); and
 * `<!-- respec-sourcemap#path:line -->` comments, as a fallback for content
 * without an attribute of its own (client-side-created elements, and
 * markdown, which has no elements yet at annotation time).
 */
import { parse, serialize, defaultTreeAdapter as ta } from "parse5";
import { fileURLToPath } from "url";
import path from "path";
import { readFile } from "fs/promises";

const MARKER_ATTR = "data-respec-line";

// Elements whose content model forbids a literal child comment node: parse5
// treats their content as raw text, so an inserted comment node would just
// become part of that text (or, for <title>, visible text) instead of an
// actual comment.
const RAW_TEXT_ELEMENTS = new Set([
  "script",
  "style",
  "title",
  "textarea",
  "xmp",
  "iframe",
  "noembed",
  "noframes",
  "plaintext",
]);

/** @param {string} sourcePath @param {number} line */
function markerValue(sourcePath, line) {
  return `${sourcePath}:${line}`;
}

/**
 * Annotates a full HTML document.
 * @param {string} html
 * @param {string} sourcePath Label embedded in markers (typically a path
 *   relative to the CLI's cwd, for readability in CLI output).
 * @returns {string}
 */
export function annotateHtmlDocument(html, sourcePath) {
  const doc = parse(html, { sourceCodeLocationInfo: true });

  /** @param {import("parse5/dist/tree-adapters/default.js").Node} node */
  function visit(node) {
    if (!ta.isElementNode(node)) {
      for (const child of ta.getChildNodes(node) ?? []) visit(child);
      return;
    }

    const loc = ta.getNodeSourceCodeLocation(node);
    const startLine = loc?.startTag?.startLine ?? loc?.startLine;
    const endLine = loc?.endTag?.endLine ?? loc?.endLine ?? startLine;
    const tagName = ta.getTagName(node);

    if (startLine) {
      ta.getAttrList(node).push({
        name: MARKER_ATTR,
        value: markerValue(sourcePath, startLine),
      });
      if (!RAW_TEXT_ELEMENTS.has(tagName)) {
        const startComment = ta.createCommentNode(
          ` respec-sourcemap#${markerValue(sourcePath, startLine)} `
        );
        const firstChild = ta.getChildNodes(node)?.[0] ?? null;
        if (firstChild) {
          ta.insertBefore(node, startComment, firstChild);
        } else {
          ta.appendChild(node, startComment);
        }
        if (endLine !== startLine) {
          const endComment = ta.createCommentNode(
            ` respec-sourcemap#${markerValue(sourcePath, endLine)} `
          );
          ta.appendChild(node, endComment);
        }
      }
    }

    if (!RAW_TEXT_ELEMENTS.has(tagName)) {
      // Re-fetch child nodes: we may have just inserted comments above.
      for (const child of ta.getChildNodes(node) ?? []) visit(child);
    }
  }
  visit(doc);

  return serialize(doc);
}

/**
 * Annotates markdown source line-by-line with trailing sourcemap comments.
 * Skips fenced (``` or ~~~) and indented (4-space/tab) code blocks, where an
 * injected comment would corrupt the sample rather than disappear into it.
 * @param {string} text
 * @param {string} sourcePath
 * @returns {string}
 */
export function annotateMarkdownText(text, sourcePath) {
  const lines = text.split("\n");
  let fence = null; // the fence marker currently open (``` or ~~~), if any
  const out = lines.map((line, i) => {
    const lineNo = i + 1;
    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[1][0];
      if (fence === marker) {
        fence = null;
      } else if (!fence) {
        fence = marker;
      }
      return line; // fence delimiter lines themselves aren't annotated
    }
    if (fence) return line;
    if (/^(?: {4}|\t)/.test(line)) return line; // indented code block
    if (line.trim() === "") return line;
    return `${line}<!-- respec-sourcemap#${markerValue(sourcePath, lineNo)} -->`;
  });
  return out.join("\n");
}

/**
 * Decides whether (and how) to annotate a request's response: `"html"` for
 * the main document or an HTML (or default-format) `data-include`,
 * `"markdown"` for a markdown one, or `null` to leave it alone. Asks the
 * live DOM which element (if any) is requesting `url` and reads its
 * `data-include-format` — that element is guaranteed to already be in the
 * DOM by the time its own `fetch()` fires, nested includes included.
 * @param {string} url
 * @param {string} mainUrlHref
 * @param {import("puppeteer").Page} page
 * @returns {Promise<"html" | "markdown" | null>}
 */
export async function getAnnotationFormat(url, mainUrlHref, page) {
  if (url === mainUrlHref) return "html";
  const format = await page.evaluate(targetUrl => {
    const els = document.querySelectorAll("[data-include]");
    for (const el of els) {
      const href = new URL(el.getAttribute("data-include"), document.baseURI)
        .href;
      if (href === targetUrl) {
        return el.getAttribute("data-include-format") || "html";
      }
    }
    return null;
  }, url);
  if (!format || format === "text") return null;
  return format === "markdown" ? "markdown" : "html";
}

/**
 * Fetches a request's real response ourselves (Node-side), annotates it,
 * and serves the annotated body in its place.
 * @param {import("puppeteer").HTTPRequest} request
 * @param {"html" | "markdown"} format
 * @param {Map<string, string>} rawSources
 * @param {(msg: any) => void} log
 */
export async function respondAnnotated(request, format, rawSources, log) {
  const url = request.url();
  const { status, contentType, body } = await fetchBody(url, request);
  const sourcePath = toDisplayPath(url);
  rawSources.set(sourcePath, body);

  const annotated =
    format === "markdown"
      ? annotateMarkdownText(body, sourcePath)
      : annotateHtmlDocument(body, sourcePath);

  log(`Annotated ${sourcePath} (${format}) with source-line markers.`);
  await request.respond({ status, contentType, body: annotated });
}

/**
 * `file:` URLs are read from disk directly: Node's `fetch` only supports
 * `http:`/`https:` and throws on `file:`.
 * @param {string} url
 * @param {import("puppeteer").HTTPRequest} request
 * @returns {Promise<{ status: number, contentType: string, body: string }>}
 */
async function fetchBody(url, request) {
  const parsed = new URL(url);
  if (parsed.protocol === "file:") {
    const body = await readFile(fileURLToPath(parsed), "utf-8");
    return { status: 200, contentType: "text/html; charset=utf-8", body };
  }
  const upstream = await fetch(url, { headers: request.headers() });
  const contentType =
    upstream.headers.get("content-type") ?? "text/html; charset=utf-8";
  return { status: upstream.status, contentType, body: await upstream.text() };
}

/**
 * A short, readable label for embedding in markers: a `file:` URL becomes a
 * path relative to the cwd (matching how the CLI reports other paths);
 * anything else falls back to its URL pathname.
 * @param {string} url
 */
function toDisplayPath(url) {
  const parsed = new URL(url);
  if (parsed.protocol === "file:") {
    const abs = fileURLToPath(parsed);
    return path.relative(process.cwd(), abs) || path.basename(abs);
  }
  return parsed.pathname.replace(/^\//, "");
}

/**
 * Narrows a `location` range down to an exact line by searching for
 * `originalText` (the raw matched text `core/inlines.js` stashed on the
 * element). Leaves `location` alone if there's no unique match.
 * @param {RsError} rsError
 * @param {Map<string, string>} rawSources sourcePath -> pre-annotation text
 */
export function tightenErrorLocations(rsError, rawSources) {
  if (
    !Array.isArray(rsError.location) ||
    !Array.isArray(rsError.originalText)
  ) {
    return;
  }
  rsError.location = rsError.location.map((loc, i) =>
    tightenErrorLocation(loc, rsError.originalText[i], rawSources)
  );
}

const LOCATION_RANGE_REGEX = /^(.*):(\d+)-(\d+)$/;

/**
 * @param {string | null} loc
 * @param {string | null} original
 * @param {Map<string, string>} rawSources
 * @returns {string | null}
 */
function tightenErrorLocation(loc, original, rawSources) {
  if (!loc || !original) return loc;
  const match = loc.match(LOCATION_RANGE_REGEX);
  if (!match) return loc; // an exact line already, or a cross-file range.
  const [, sourcePath, startStr, endStr] = match;
  const source = rawSources.get(sourcePath);
  if (!source) return loc;

  const lines = source.split("\n");
  const start = Number(startStr);
  const end = Number(endStr);
  const hits = [];
  for (let line = start; line <= end && line <= lines.length; line++) {
    if (lines[line - 1].includes(original)) hits.push(line);
  }
  return hits.length === 1 ? `${sourcePath}:${hits[0]}` : loc;
}
