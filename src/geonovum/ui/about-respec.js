// Module ui/about-respec
// A simple about dialog with pointer to the help
import { ui } from "core/ui";

// window.respecVersion is added at build time (see tools/builder.js)
window.respecVersion = window.respecVersion || "Developer Edition";
const div = document.createElement("div");
const render = hyperHTML.bind(div);
const button = ui.addCommand(
  "Over ReSpec",
  "geonovum/ui/about-respec",
  "Ctrl+Shift+Alt+A",
  "ℹ️"
);

function show() {
  ui.freshModal("Over ReSpec - " + window.respecVersion, div, button);
  let entries = [];
  if ("getEntriesByType" in performance) {
    performance
      .getEntriesByType("measure")
      .sort((a, b) => b.duration - a.duration)
      .map(({ name, duration }) => {
        const fixedSize = duration.toFixed(2);
        const humanDuration =
          fixedSize > 1000
            ? `${Math.round(fixedSize / 1000.0)} second(s)`
            : `${fixedSize} milliseconds`;
        return { name, duration: humanDuration };
      })
      .map(perfEntryToTR)
      .reduce((collector, entry) => {
        collector.push(entry);
        return collector;
      }, entries);
  }
  render`
  <p>
    ReSpec is een document-productie tool, met een focus op W3C specifications.
  </p>
  <p>
    Meer informatie is te vinden in de <a href='https://w3.org/respec/'>documentatie</a>.
  </p>
  <p>
    Een bug gevonden in ReSpec? <a href='https://github.com/w3c/respec/issues'>Meld het!</a>.
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
}

function perfEntryToTR({ name, duration }) {
  const render = hyperHTML.bind(document.createElement("tr"));
  const moduleURL = `https://github.com/geonovum/respec/tree/develop/src/${name}.js`;
  return render`
    <td>
      <a href="${moduleURL}">
        ${name}
      </a>
    </td>
    <td>
      ${duration} 
    </td>
  `;
}

export { show };
