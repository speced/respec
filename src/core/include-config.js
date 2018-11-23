// Module core/include-config
// Inject's the document's configuration into the head as JSON.
import { sub } from "./pubsubhub";
export const name = "core/include-config";

const userConfig = {};
const amendConfig = newValues => Object.assign(userConfig, newValues);

sub("start-all", amendConfig);
sub("amend-user-config", amendConfig);
sub("end-all", () => {
  const script = document.createElement("script");
  script.id = "initialUserConfig";
  script.type = "application/json";
  script.innerHTML = JSON.stringify(userConfig, null, 2);
  document.head.appendChild(script);
});
