import { sub } from "core/pubsubhub";

export const name = "core/aria";

export function run(conf, doc, cb) {
  doc.body.setAttribute("aria-busy", "true");
  sub(
    "end-all",
    () => {
      doc.body.setAttribute("aria-busy", "false");
      doc.body.hidden = false;
    },
    { once: true }
  );
  cb();
}
