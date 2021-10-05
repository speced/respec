// @ts-check
/**
 * Sets the core defaults
 */
export const name = "core/defaults";

export const coreDefaults = {
  lint: {
    "no-headingless-sections": true,
    "no-http-props": true,
    "no-unused-vars": false,
    "check-punctuation": false,
    "local-refs-exist": true,
    "check-internal-slots": false,
    "check-charset": false,
    "privsec-section": false,
  },
  pluralize: true,
  specStatus: "base",
  highlightVars: true,
  addSectionLinks: true,
  // RESPEC_API_BASE: "https://respec.org/",
  RESPEC_API_BASE: "http://localhost:8000/",
};
