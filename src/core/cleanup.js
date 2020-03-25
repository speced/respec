// @ts-check
/**
 * Clean up temporary DOM nodes and attributes.
 */

export const name = "core/cleanup";

export async function run() {
  document.querySelectorAll("dfn[data-cite], a[data-cite]").forEach(el => {
    ["data-cite", "data-cite-frag", "data-cite-path"].forEach(
      attr => el.hasAttribute(attr) && el.removeAttribute(attr)
    );
  });

  document
    .querySelectorAll("a[data-xref-for], a[data-xref-type]")
    .forEach(el => {
      el.removeAttribute("data-xref-for");
      el.removeAttribute("data-xref-type");
    });
}
