// @ts-check
/**
 * Lints for accessibility issues using axe-core package.
 */

import { showError, showWarning } from "../utils.js";

export const name = "core/linter-rules/a11y";

const DISABLED_RULES = [
  "color-contrast", // too slow 🐢
  "landmark-one-main", // need to add a <main>, else it marks entire page as errored
  "landmark-unique",
  "region",
];

export async function run(conf) {
  if (!conf.lint?.a11y && /** legacy */ !conf.a11y) {
    return;
  }
  const config = conf.lint?.a11y || /** legacy */ conf.a11y;

  const options = config === true ? {} : config;
  const violations = await getViolations(options);
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
      showWarning(title, name, { details, elements });
    }
  }
}

/**
 * @param {object} opts Options as described at https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter
 */
async function getViolations(opts) {
  const { rules, ...otherOptions } = opts;
  const options = {
    rules: {
      ...Object.fromEntries(DISABLED_RULES.map(id => [id, { enabled: false }])),
      ...rules,
    },
    ...otherOptions,
    elementRef: true,
    resultTypes: ["violations"],
    reporter: "v1", // v1 includes a `failureSummary`
  };

  let axe;
  try {
    axe = await importAxe();
  } catch (error) {
    const msg = "Failed to load a11y linter.";
    showError(msg, name);
    console.error(error);
    return [];
  }

  try {
    const result = await axe.run(document, options);
    return result.violations;
  } catch (error) {
    const msg = "Error while looking for a11y issues.";
    showError(msg, name);
    console.error(error);
    return [];
  }
}

/** @returns {Promise<typeof window.axe>} */
function importAxe() {
  const script = document.createElement("script");
  script.classList.add("remove");
  script.src = "https://unpkg.com/axe-core@3/axe.min.js";
  document.head.appendChild(script);
  return new Promise((resolve, reject) => {
    script.onload = () => resolve(window.axe);
    script.onerror = reject;
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
