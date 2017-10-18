// Module core/link-to-dfn
// Gives definitions in definitionMap IDs and links <a> tags
// to the matching definitions.
import { pub } from "core/pubsubhub";
import { norm } from "core/utils";
import { findDfn } from "core/dfn";
export const name = "core/link-to-dfn";


export async function run(conf, doc, cb) {
  // we find all the a
  const anchors = doc.querySelectorAll(
    "a:not([href]):not([data-cite]):not(.logo):not(.externalDFN)"
  );
  Array.from(anchors)
    .map(anchor => ({ dfn: findDfn(anchor), anchor }))
    .filter(({ dfn, anchor }) => {
      if (dfn) {
        return true;
      }
      const msg = `Missing definition for \`<a>\` element: "${norm(
        anchor.textContent
      )}". See developer console.`;
      pub("warn", msg);
      console.warn(msg, anchor);
      anchor.title = "Missing definition.";
      anchor.classList.add("respec-offending-element");
      return false;
    })
    .forEach(({ anchor, dfn }) => {
      // otherwise, we found it.
      anchor.href = "#" + dfn.id;
      // If the definition is code, then the link should be code
      if (
        dfn.closest("code") ||
        (dfn.firstElementChild && dfn.firstElementChild.localName === "code")
      ) {
        //
      }
    });
  cb();
}
