import { sub } from "core/pubsubhub";

export const name = "core/aria";

sub(
  "end-all",
  () => {
    document.body.setAttribute("aria-busy", "false");
    document.body.removeAttribute("aria-live");
  },
  { once: true }
);

export function run(conf, doc, cb) {
  doc.body.setAttribute("aria-busy", "true");
  doc.body.setAttribute("aria-live", "polite");
  cb();
}
