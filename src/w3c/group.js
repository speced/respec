// @ts-check
/**
 * @module w3c/group
 * The purpose of this module is to fetch and set the working group configuration details.
 */
import { docLink, fetchAndCache, showError } from "../core/utils.js";

export const name = "w3c/group";

const W3C_GROUPS_API = "https://respec.org/w3c/groups/";

/**
 * Fetches the group configuration details and adds them to the document's configuration.
 * @param {Conf} conf The document configuration object.
 * @return {Promise<void>} Resolves after setting the group configuration details.
 */
export async function run(conf) {
  if (!conf.group) {
    return;
  }

  const { group } = conf;
  const groupDetails = Array.isArray(group)
    ? await getMultipleGroupDetails(group)
    : await getGroupDetails(group);
  Object.assign(conf, groupDetails);
}

/**
 * Fetches configuration details for multiple groups concurrently.
 * @param {string[]} groups An array of group identifiers.
 * @return {Promise<object>} Resolves to an object containing the configuration details for each group.
 */
async function getMultipleGroupDetails(groups) {
  const details = await Promise.all(groups.map(getGroupDetails));
  /** @type {{ [key in keyof GroupDetails]: GroupDetails[key][] }} */
  const result = {
    wg: [],
    wgId: [],
    wgURI: [],
    wgPatentURI: [],
    wgPatentPolicy: [],
    groupType: [],
  };
  for (const groupDetails of details.filter(Boolean)) {
    for (const key of Object.keys(result)) {
      result[key].push(groupDetails[key]);
    }
  }
  return result;
}

/**
 * Fetches configuration details for a single group.
 * @param {string} group A group identifier.
 * @return {Promise<GroupDetails|undefined>} Resolves to an object containing the group's configuration details, or undefined if the group could not be fetched.
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
      patentURI: wgPatentURI,
      patentPolicy: wgPatentPolicy,
      type: groupType,
      wgURI,
    } = json;
    return { wg, wgId, wgURI, wgPatentURI, wgPatentPolicy, groupType };
  }

  const text = await res.text();
  let message = `Failed to fetch group details (HTTP: ${res.status}).`;
  let hint;
  if (res.status === 409) {
    [message, hint] = text.split("\n", 2);
  } else if (res.status === 404) {
    hint = docLink`See the list of [supported group names](https://respec.org/w3c/groups/) to use with the ${"[group]"} configuration option.`;
  }
  showError(message, name, { hint });
}
