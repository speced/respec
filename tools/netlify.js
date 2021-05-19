// @ts-check
/**
 * This script is run on netlify to generate PR previews. The previews are
 * accesible via the "netlify/respec-pr/deploy-preview" check on a PR.
 */
const path = require("path");
const { writeFile } = require("fs").promises;
const { Builder } = require("./builder.js");

const { DEPLOY_PRIME_URL, COMMIT_REF, REVIEW_ID, REPOSITORY_URL } = process.env;

const BUILD_DIR = path.resolve(__dirname, "../builds/");
const PROFILES = ["w3c", "geonovum", "dini"];

const SPECS = {
  W3C: [
    "https://w3c.github.io/badging/",
    "https://w3c.github.io/gamepad/",
    "https://w3c.github.io/hr-time/",
    "https://w3c.github.io/payment-request/",
    "https://w3c.github.io/trace-context/",
    "https://w3c.github.io/web-share/",
  ],
  DINI: [
    "https://dini-ag-kim.github.io/oer-service-card/latest/",
    "https://dini-ag-kim.github.io/hs-oer-lom-profil/latest/",
  ],
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});

async function main() {
  Builder.getRespecVersion = () => `PR#${REVIEW_ID}`;
  await Promise.all(PROFILES.map(name => Builder.build({ name, debug: true })));

  const html = buildHTML(PROFILES, SPECS);
  await writeFile(path.join(BUILD_DIR, "index.html"), html);
}

/**
 * @param {string[]} profiles
 * @param {Record<string, string[]>} specsByProfile
 */
function buildHTML(profiles, specsByProfile) {
  const prURL = `${REPOSITORY_URL}/pull/${REVIEW_ID}`;
  const title = `ReSpec Build Preview for PR <a href="${prURL}">#${REVIEW_ID}</a>`;
  const fileURL = profile => `${DEPLOY_PRIME_URL}/respec-${profile}.js`;

  const SelectSpec = () => {
    const OptGroup = (profile, specs) => {
      return `
        <optgroup label="${profile}">
          ${specs
            .map(spec => `<option value="${spec}">${spec}</option>`)
            .join("\n")}
        </optgroup>
      `;
    };
    return `
      <select name="spec">
        ${Object.entries(specsByProfile)
          .map(([profile, specs]) => OptGroup(profile, specs))
          .join("\n")}
        <option value="">Add your own</option>
      </select>
    `;
  };

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        padding: 1em;
        font-family: sans-serif;
      }
      form, header, footer {
        max-width: 80ch;
        margin: 2em auto;
      }
      fieldset {
        border: none;
        padding: 0;
        margin: 1em 0;
      }
      label {
        display: block;
        margin-bottom: 0.2em;
      }
      select, button {
        padding: 1em;
        font-size: 1.3em;
      }
      select {
        width: 100%;
        font-family: monospace;
      }
      button {
        background: #1a5e9a;
        color: #fff;
        border: none;
      }
      button:hover, button:focus {
        background: #013d72;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <form action="https://respec-preview.netlify.com/">
      <h2>${title}</h2>
      <h3>Commit: ${COMMIT_REF}</h3>
      <fieldset>
        <label for="spec">Spec URL</label>
        ${SelectSpec()}
      </fieldset>
      <fieldset>
        <label for="version">Profile</label>
        <select name="version">
          ${profiles.map(
            name => `<option value="${fileURL(name)}">${name}</option>`
          )}
        </select>
      </fieldset>
      <button>Preview</button>
    </form>
  </body>
</html>`;
}
