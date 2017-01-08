// Module core/remove-respec
// Removes all ReSpec artefacts right before processing ends
import utils from "core/utils";
import { sub } from "core/pubsubhub";

sub('end-all', () => {
  utils.removeReSpec(document);
}, { once: true });
