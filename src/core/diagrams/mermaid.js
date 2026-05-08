// @ts-check
/**
 * Module core/diagrams/mermaid
 *
 * Pure renderer for Mermaid diagrams. Delegates to the globally-loaded
 * mermaid library (loaded by the coordinator via script injection).
 */
export const name = "core/diagrams/mermaid";

export const className = "mermaid";

let counter = 0;

/**
 * @param {string} source
 * @returns {Promise<{ svg: string } | { error: string }>}
 */
export async function render(source) {
  // @ts-ignore -- loaded dynamically via script injection
  if (!self.respecMermaid) {
    return { error: "Mermaid library not loaded." };
  }
  const id = `respec-mermaid-diagram-${counter++}`;
  // @ts-ignore
  return self.respecMermaid.render(source, { id });
}
