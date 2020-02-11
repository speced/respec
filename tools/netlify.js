// @ts-check
/**
 * This script is run on netlify to generate PR previews. The previews are
 * accesible via the "netlify/respec-pr/deploy-preview" check on a PR.
 */
const path = require("path");
const { writeFile } = require("fs").promises;
const { Builder } = require("./builder");

const { DEPLOY_PRIME_URL, COMMIT_REF, REVIEW_ID, REPOSITORY_URL } = process.env;

const BUILD_DIR = path.resolve(__dirname, "../builds/");
const PROFILES = ["w3c", "w3c-common", "geonovum", "dini"];

const SPECS = [
  "https://w3c.github.io/payment-request/",
  "https://w3c.github.io/gamepad/",
  "https://w3c.github.io/hr-time/",
];

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
 * @param {string[]} specs
 */
function buildHTML(profiles, specs) {
  const prURL = new URL(`pull/${REVIEW_ID}`, REPOSITORY_URL);
  const title = `ReSpec Build Preview for PR <a href="${prURL}">#${REVIEW_ID}</a>`;
  const fileURL = profile => `${DEPLOY_PRIME_URL}/respec-${profile}.js`;
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
        <select name="spec">
          ${specs.map(spec => `<option value="${spec}">${spec}</option>`)}
          <option value="">Add your own</option>
        </select>
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
