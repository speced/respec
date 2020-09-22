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
const LEGACY_OPTIONS = ["wg", "wgURI", "wgId", "wgPatentURI", "wgPatentPolicy"];

export async function run(conf) {
  const usedLegacyOptions = LEGACY_OPTIONS.filter(opt => conf[opt]);

  if (!conf.group) {
    if (usedLegacyOptions.length) {
      const outdatedOptionsStr = joinAnd(LEGACY_OPTIONS, s => `\`${s}\``);
      const msg = `Configuration options ${outdatedOptionsStr} are deprecated.`;
      const hint = `Please use the [\`group\`](https://respec.org/docs/#group) option instead.`;
      pub("warn", `${msg} ${hint}`);
    }
    return;
  }

  if (usedLegacyOptions.length) {
    const outdatedOptionsStr = joinAnd(usedLegacyOptions, s => `\`${s}\``);
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
  const result = {
    wg: [],
    wgId: [],
    wgURI: [],
    wgPatentURI: [],
    wgPatentPolicy: [],
  };
  for (const groupDetails of details.filter(o => o)) {
    for (const key of Object.keys(result)) {
      result[key].push(groupDetails[key]);
    }
  }
  return result;
}

/**
 * @param {string} group
 * @typedef {{ wgId: number, wg: string, wgURI: string, wgPatentURI: string, wgPatentPolicy: string }} GroupDetails
 * @returns {Promise<GroupDetails|undefined>}
 */
async function getGroupDetails(group) {
  let type = "";
  let shortname = group;
  if (group.includes("/")) {
    [type, shortname] = group.split("/", 2);
  }
  const url = new URL(`${shortname}/${type}`, W3C_GROUPS_API);
  const res = await fetchAndCache(url.href);

  if (res.ok) {
    const json = await res.json();
    const {
      id: wgId,
      name: wg,
      URI: wgURI,
      patentURI: wgPatentURI,
      patentPolicy: wgPatentPolicy,
    } = json;
    return { wg, wgId, wgURI, wgPatentURI, wgPatentPolicy };
  }

  const text = await res.text();
  let message = `Failed to fetch group details (HTTP: ${res.status}). ${text}`;
  if (res.status === 404) {
    const hint =
      "See [supported group names](https://respec.org/w3c/groups/) to use with the " +
      "[`group`](https://respec.org/docs/#group) configuration option.";
    message += ` ${hint}`;
  }
  pub("error", message);
}
