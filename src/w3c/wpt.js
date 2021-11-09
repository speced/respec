// Show WPT results
export const name = "w3c/wpt";

/**
 *
 * @param {RespecConfig} conf
 */
export async function run(conf) {
  // if (!conf.wpt) return;
  // Gett the run ids first
  const runIdResponses = await fetch(
    "https://wpt.fyi/api/runs?label=master&label=stable&max-count=1&product=chrome&product=firefox&product=safari&product=edge"
  );
  const json = await runIdResponses.json();
  const runIds = json.map(entry => entry.id);

  const wptURL = new URL("https://wpt.fyi/api/search");
  const body = {
    run_ids: runIds,
    query: {
      path: `/${conf.shortName}/`,
    },
  };
  const request = new Request(wptURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  console.log(request);
  const response = await fetch(request);
  try {
    const json = await response.text();
    console.log(json, null, 2);
  } catch (err) {
    console.error(err);
  }
}
