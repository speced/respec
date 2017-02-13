import { sub } from "core/pubsubhub";

document.body.setAttribute("aria-busy", "true");

sub("end-all", () => {
  document.body.setAttribute("aria-busy", "false");
  document.body.hidden = false;
}, { once: true });
