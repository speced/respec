// @ts-check
// Module ui/about-respec
// A simple about dialog with pointer to the help
import { getIntlData } from "../core/utils.js";
import { html } from "../core/import-maps.js";
import { ui } from "../core/ui.js";

const localizationStrings = {
  en: {
    about_respec: "About",
  },
  zh: {
    about_respec: "关于",
  },
  nl: {
    about_respec: "Over",
  },
  ja: {
    about_respec: "これについて",
  },
  de: {
    about_respec: "Über",
  },
};
const l10n = getIntlData(localizationStrings);

// window.respecVersion is added at build time (see tools/builder.js)
window.respecVersion = window.respecVersion || "Developer Edition";
const div = document.createElement("div");
const render = html.bind(div);
const button = ui.addCommand(
  `${l10n.about_respec} ${window.respecVersion}`,
  show,
  "Ctrl+Shift+Alt+A",
  "ℹ️"
);

function show() {
  const entries = [];
  if ("getEntriesByType" in performance) {
    performance
      .getEntriesByType("measure")
      .sort((a, b) => b.duration - a.duration)
      .map(({ name, duration }) => {
        const humanDuration =
          duration > 1000
            ? `${Math.round(duration / 1000.0)} second(s)`
            : `${duration.toFixed(2)} milliseconds`;
        return { name, duration: humanDuration };
      })
      .map(perfEntryToTR)
      .forEach(entry => {
        entries.push(entry);
      });
  }
  render`
  <p>
    ReSpec is a document production toolchain, with a notable focus on W3C specifications.
  </p>
  <p>
    <a href='https://respec.org/docs'>Documentation</a>,
    <a href='https://github.com/w3c/respec/issues'>Bugs</a>.
  </p>
  <table border="1" width="100%" hidden="${entries.length ? false : true}">
    <caption>
      Loaded plugins
    </caption>
    <thead>
      <tr>
        <th>
          Plugin Name
        </th>
        <th>
          Processing time
        </th>
      </tr>
    </thead>
    <tbody>${entries}</tbody>
  </table>
`;
  ui.freshModal(`${l10n.about_respec} - ${window.respecVersion}`, div, button);
}

function perfEntryToTR({ name, duration }) {
  const moduleURL = `https://github.com/w3c/respec/blob/develop/src/${name}.js`;
  return html`
    <tr>
      <td><a href="${moduleURL}">${name}</a></td>
      <td>${duration}</td>
    </tr>
  `;
}
