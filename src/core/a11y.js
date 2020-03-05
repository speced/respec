import { pub } from "./pubsubhub.js";
import { showInlineWarning } from "./utils.js";

export const name = "core/a11y";

const DISABLED_RULES = [
  "landmark-one-main", // need to add a <main>, else it marks entire page as errored
  "landmark-unique",
  "region",
  "color-contrast", // too slow 🐢
];

export async function run(conf) {
  if (!conf.a11y) {
    return;
  }

  const violations = await getViolations();
  for (const violation of violations) {
    /**
     * We're grouping by failureSummary as it contains hints to fix the issue.
     * For example, with color-constrast rule, it tells about the present color
     * contrast and how to fix it. If we don't group, errors will be repetitive.
     * @type {Map<string, HTMLElement[]>}
     */
    const groupedBySummary = new Map();
    for (const node of violation.nodes) {
      const { failureSummary, element } = node;
      const elements =
        groupedBySummary.get(failureSummary) ||
        groupedBySummary.set(failureSummary, []).get(failureSummary);
      elements.push(element);
    }

    const { id, help, description, helpUrl } = violation;
    const title = `a11y/${id}: ${help}`;
    for (const [failureSummary, elements] of groupedBySummary) {
      const hints = formatHintsAsMarkdown(failureSummary);
      const details = `\n\n${description}.\n\n${hints}. ([Learn more](${helpUrl}))`;
      showInlineWarning(elements, title, title, { details });
    }
  }
}

/**
 * @typedef {{ failureSummary: string, element: HTMLElement }} ViolationNode
 * @typedef {{ id: string, help: string, helpUrl: string, description: string, nodes: ViolationNode[] }} Violation
 * @returns {Promise<Violation[]>}
 */
async function getViolations() {
  const options = {
    elementRef: true,
    rules: Object.fromEntries(
      DISABLED_RULES.map(id => [id, { enabled: false }])
    ),
    resultTypes: ["violations"],
    reporter: "v1", // v1 includes a `failureSummary`
  };

  let axe;
  try {
    axe = await importAxe();
  } catch (error) {
    pub("error", "Failed to load a11y linter.");
    console.error(error);
    return [];
  }

  try {
    const result = await axe.run(document, options);
    return result.violations;
  } catch (error) {
    pub("error", "Error while looking for a11y issues.");
    console.error(error);
    return [];
  }
}

function importAxe() {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.classList.add("remove");
    script.src = "https://unpkg.com/axe-core@3/axe.min.js";
    script.onload = () => resolve(window.axe);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/** @param {string} text */
function formatHintsAsMarkdown(text) {
  const results = [];
  for (const group of text.split("\n\n")) {
    const [msg, ...opts] = group.split(/^\s{2}/m);
    const options = opts.map(opt => `- ${opt.trimEnd()}`).join("\n");
    results.push(`${msg}${options}`);
  }
  return results.join("\n\n");
}
