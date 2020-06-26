// @ts-check
/**
 * @module w3c/group
 *
 * `group` is a shorthand configuration option for specifying `wg`, `wgId`,
 * `wgURI`, and `wgPatentURI` options.
 */

import { fetchAndCache, joinAnd } from "../core/utils.js";
import { pub } from "../core/pubsubhub.js";

export const name = "w3c/group";

const W3C_GROUPS_API = "https://respec.org/w3c/groups/";

export async function run(conf) {
  if (!conf.group) return;

  const supersededOptions = ["wg", "wgURI", "wgId", "wgPatentURI"];
  const usedSupersededOptions = supersededOptions.filter(opt => conf[opt]);
  if (usedSupersededOptions.length) {
    const outdatedOptionsStr = joinAnd(usedSupersededOptions, s => `\`${s}\``);
    const msg = `Configuration options ${outdatedOptionsStr} are superseded by \`group\` and will be overridden by ReSpec.`;
    const hint = "Please remove them from `respecConfig`.";
    pub("warn", `${msg} ${hint}`);
  }

  const { group } = conf;
  const groupDetails = Array.isArray(group)
    ? await getMultipleGroupDetails(group)
    : await getGroupDetails(group);
  Object.assign(conf, groupDetails);
}

/** @param {string[]} groups */
async function getMultipleGroupDetails(groups) {
  const details = await Promise.all(groups.map(getGroupDetails));
  /** @type {{ [key in keyof GroupDetails]: GroupDetails[key][] }} */
  const result = { wg: [], wgId: [], wgURI: [], wgPatentURI: [] };
  for (const groupDetails of details.filter(o => o)) {
    for (const key of Object.keys(result)) {
      result[key].push(groupDetails[key]);
    }
  }
  return result;
}

/**
 * @param {string} group
 * @typedef {{ wgId: number, wg: string, wgURI: string, wgPatentURI: string }} GroupDetails
 * @returns {Promise<GroupDetails|undefined>}
 */
async function getGroupDetails(group) {
  const url = new URL(group, W3C_GROUPS_API).href;
  const res = await fetchAndCache(url);

  if (res.ok) {
    const json = await res.json();
    const { id: wgId, name: wg, URI: wgURI, patentURI: wgPatentURI } = json;
    return { wg, wgId, wgURI, wgPatentURI };
  }

  let message = `Failed to fetch group details (HTTP: ${res.status})`;
  if (res.status === 404) {
    const msg = `No group with name \`"${group}"\` found.`;
    const hint =
      "Please add a [valid group name](https://github.com/w3c/respec/wiki/group) to `respecConfig.group`.";
    message = `${msg} ${hint}`;
  }
  pub("error", message);
}
