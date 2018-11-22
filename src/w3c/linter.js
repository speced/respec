/**
 * Module w3c/linter
 * Registers linter rules for w3c specs.
 */

export const name = "w3c/linter";

import linter from "../core/linter";
import { lint as privsec } from "./linter-rules/privsec-section";

linter.register(privsec);
