/**
 * This module retrieves the tag_name of the latest release of the Github repo
 * and appends this to the document title
 */
// import { pub } from "../core/pubsubhub.js";
import { showError, showWarning } from "../core/utils.js";
export const name = "core/releasetitle";


// todo check if this works for gitlab as well
async function getReleasename(conf) {
  const o = { tag_name: "" };
  if (!conf.github) {
    const msg = "cannot retrieve release tag: respecConf.github not set;";
    showWarning(msg, name);
    return o;
  }

  const url = `https://api.github.com/repos/${conf.github.fullName}/releases/latest`;
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (error) {
    const msg = `failed to retrieve release tag: '${error}'`;
    showError(msg, name);
  }
  return o;
}

async function setRelease(conf) {
  let release = await getReleasename(conf);
  conf.releaseversion = release.tag_name;
}

export async function run(conf) {
  if (!conf.nl_addReleaseTagTitle) {
    return;
  }
  conf.releaseversion = "";
  if (
    (conf.specStatus == "DEF" || conf.specStatus == "GN-DEF") &&
    (conf.specType == "ST" || conf.specType == "BP" || conf.specType == "HR")
  ) {
    // this is just a test to retrieve the release tag
    await setRelease(conf);
    document.title = `${document.title} ${conf.releaseversion}`;
    conf.title = `${conf.title} ${conf.releaseversion}`;
  }
}
