import { sub } from "core/pubsubhub";

export const name = "core/aria";

if (document.body) {
  document.body.setAttribute("aria-busy", "true");
} else {
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      document.body.setAttribute("aria-busy", "true");
    },
    { once: true }
  );
}

sub(
  "end-all",
  () => {
    document.body.setAttribute("aria-busy", "false");
    document.body.hidden = false;
  },
  { once: true }
);
