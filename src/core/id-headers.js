// Module core/id-headers
// All headings are expected to have an ID, unless their immediate container has one.
// This is currently in core though it comes from a W3C rule. It may move in the future.

export const name = "core/id-headers";

export function run(conf, doc, cb) {
  document
    .querySelectorAll("h2:not([id]), h3:not([id]), h4:not([id]), h5:not([id]), h6:not([id])")
    .forEach(elem => {
      $(elem).makeID();
    });
  cb();
}
