// @ts-check
/**
 * Linter rule "no-uncaptioned-diagram".
 *
 * Warns when a diagram block (<pre class="mermaid"> or
 * <pre class="jake-diagram">) appears outside a <figure> element.
 */
import { getIntlData, showWarning } from "../utils.js";

const ruleName = "no-uncaptioned-diagram";
export const name = "core/linter-rules/no-uncaptioned-diagram";

const localizationStrings = {
  en: {
    msg: "Diagram blocks must be wrapped in a `<figure>` with a `<figcaption>`.",
    hint: "Wrap the `<pre>` in a `<figure>` element and add a `<figcaption>`.",
  },
  ja: {
    msg: "図ブロックは `<figure>` と `<figcaption>` で囲む必要があります。",
    hint: "`<pre>` を `<figure>` 要素で囲み、`<figcaption>` を追加してください。",
  },
  ko: {
    msg: "다이어그램 블록은 `<figure>`와 `<figcaption>`으로 감싸야 합니다.",
    hint: "`<pre>`를 `<figure>` 요소로 감싸고 `<figcaption>`을 추가하세요.",
  },
  nl: {
    msg: "Diagramblokken moeten in een `<figure>` met een `<figcaption>` staan.",
    hint: "Omsluit het `<pre>` element met een `<figure>` en voeg een `<figcaption>` toe.",
  },
  es: {
    msg: "Los bloques de diagrama deben estar en un `<figure>` con `<figcaption>`.",
    hint: "Envuelva el `<pre>` en un elemento `<figure>` y añada un `<figcaption>`.",
  },
  fr: {
    msg: "Les blocs diagramme doivent être dans un `<figure>` avec un `<figcaption>`.",
    hint: "Enveloppez le `<pre>` dans un élément `<figure>` et ajoutez un `<figcaption>`.",
  },
};
const l10n = getIntlData(localizationStrings);

/**
 * @param {Conf} conf
 */
export function run(conf) {
  // @ts-expect-error -- LintConfig can be false
  if (!conf.lint?.[ruleName]) {
    return;
  }

  /** @type {NodeListOf<HTMLElement>} */
  const diagrams = document.querySelectorAll("pre.mermaid, pre.jake-diagram");

  const offendingElements = [...diagrams].filter(pre => {
    const figure = pre.closest("figure");
    return !figure || !figure.querySelector("figcaption");
  });

  if (!offendingElements.length) return;

  showWarning(l10n.msg, name, {
    hint: l10n.hint,
    elements: offendingElements,
  });
}
