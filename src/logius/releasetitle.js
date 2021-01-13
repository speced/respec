/**
 * This module retrieves the tag_name of the latest release of the Github repo 
 * and append this to the document title 
 */

export const name = "core/releasetitle";

// todo handle the case when a tag_name release and/or tag_name is not available
// todo get the correct hithub repo from config
// todo (optional) handle a conf.release parameter
// todo check iif this works for gitlab as well
async function getReleasename() {
  let url = 'https://api.github.com/repos/centrumvoorstandaarden/Test-Digikoppeling_Architectuur/releases/latest';
  try {
      let res = await fetch(url);
      return await res.json();
  } catch (error) {
      console.log(error);
  }
}

async function setRelease(conf) {
  let release = await getReleasename();
  conf.releaseversion = release.tag_name;
}

// todo act on conf.specStatus == "DEF" only
export async function run(conf) {
  conf.releaseversion ="init";
  if ( (conf.specStatus == "DEF" || conf.specStatus == "GN-DEF") &&  conf.specType == "ST") {
    // this is just a test to retrieve the release tag 
    await setRelease(conf);
    document.title = `${document.title} ${conf.releaseversion}`;
    conf.title = `${conf.title} ${conf.releaseversion}`;
  }

}
