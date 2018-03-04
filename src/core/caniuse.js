import { fetch as ghFetch } from "core/github";
import { semverCompare } from "core/utils";
import "deps/hyperhtml";

export const name = "core/caniuse";

export async function run(conf) {
  const key = conf.caniuse;
  getData(key)
    .then(json => showData(json, document.querySelector(".head")));
}

async function getData(key) {
  const url = `https://raw.githubusercontent.com/Fyrd/caniuse/master/features-json/${key}.json`;
  return await ghFetch(url);
}

function showData(json, parent) {
  const createList = (data) => {
    const addCell = (v) => {
      const [cl, notes] = data[v].split('#', 1);
      return `<div class="ciu-cell ${cl}">${v}</div>`
    };

    const lst = Object.keys(data).sort(semverCompare).reverse();
    return hyperHTML`${lst.map(addCell)}`;
  };

  const browsers = {
    "chrome": "Chrome",
    "firefox": "Firefox",
    "ie": "IE",
  };
  const stats = Object.keys(browsers).map((browser) => {
    return hyperHTML`<div class="ciu-col">
      <span>${browsers[browser]}</span>
      ${createList(json.stats[browser])}
    </div>`;
  });
  const pre = hyperHTML`<div class="caniuse">${stats}</pre>`;
  parent.appendChild(pre);
}
