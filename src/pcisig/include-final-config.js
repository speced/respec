import { pub } from "../core/pubsubhub.js";

export const name = "core/include-final-config";

export function run(conf, doc, cb) {

  const script = doc.createElement("script");
  script.id = "finalUserConfig";
  script.type = "application/json";
  script.innerHTML = JSON.stringify(conf, null, 2);
  doc.head.appendChild(script);
  cb();
}
