// @ts-check
/**
 * Module w3c/linter
 * Registers linter rules for w3c specs.
 */

export const name = "w3c/linter";

import linter from "../core/linter.js";
import { rule as privsec } from "../core/linter-rules/privsec-section.js";

linter.register(privsec);
