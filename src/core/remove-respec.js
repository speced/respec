// Module core/remove-respec
// Removes all ReSpec artefacts right before processing ends
import { removeReSpec } from "core/utils";
import { sub } from "core/pubsubhub";
export const name = "core/remove-respec";

sub("end-all", () => {
  removeReSpec(document);
}, { once: true });
