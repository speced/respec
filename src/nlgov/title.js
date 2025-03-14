export const name = "logius/title";

export async function run(conf) {
  if (conf.specStatus.toUpperCase() == "DEF" && conf.publishVersion) {
    document.title = `${document.title} ${conf.publishVersion}`;
    conf.title = `${conf.title} ${conf.publishVersion}`;
  }
}
