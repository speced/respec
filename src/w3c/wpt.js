import { html } from "../core/import-maps.js";
import { docLink, showError } from "../core/utils.js";

// Show WPT results
export const name = "w3c/wpt";

/**
 *
 * @param {RespecConfig} conf
 */
export async function run(conf) {
  const wptConf = normalizeConf(conf);
  // if (!conf.wpt) return;
  // Get the run ids first
  const runIdResponses = await fetch(
    "https://wpt.fyi/api/runs?label=master&label=stable&max-count=1&product=chrome&product=firefox&product=safari&product=edge"
  );
  const json = await runIdResponses.json();
  const runIds = json.map(({ id }) => id);

  const wptURL = new URL("https://wpt.fyi/api/search");
  const body = {
    run_ids: runIds,
    query: {
      // TODO: allow overriding this...
      path: wptConf.path,
    },
  };
  console.log(body, conf.shortName);
  const request = new Request(wptURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  console.log(request);
  const response = await fetch(request);
  try {
    const json = await response.json();
    renderResults(json);
  } catch (err) {
    console.error(err);
  }
}

function normalizeConf(conf) {
  const { wpt } = conf;
  const config = { path: null };
  if (!wpt?.path && !conf?.shortName) {
    const msg = docLink`"Couldn't derive path for ${"[wpt]"}`;
    showError(msg);
  } else {
    config.path = wpt?.path || `/${conf.shortName}/`;
  }
  return config;
}

function renderResults(data) {
  const browsers = data.runs.map(
    ({ browser_name, browser_version }) =>
      html`<th>${browser_name} ${browser_version}</th>`
  );
  const results = [];
  if (!data.results || !data.results.length) {
    results.push(
      html`<tr>
        <td colspan="${browsers.length + 1}">No results</td>
      </tr>`
    );
  } else {
    for (const result of data.results) {
      const status = result.legacy_status.map(({ passes, total }) => {
        return html`<td>${passes}/${total}</td>`;
      });
      results.push(
        html`<tr>
          <td>${result.test}</td>
          ${status}
        </tr>`
      );
    }
  }
  const table = html`<table class="data" style="border: 10px solid red">
    <summary>Web Platform Tests</summary>
    <tr>
      <th>Test</th>
      ${browsers}
    </tr>
    ${results}
  </table>`;
  console.log(table);
  document.body.append(...table.childNodes);
}
