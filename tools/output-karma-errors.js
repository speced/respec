const { EOL } = require("os");
const karmaResultsData = require("../karma-result.json");

const failures = karmaResultsData.browsers[0].results
  .filter(item => item.success === false)
  .map(item => {
    const { suite, description, log } = item;
    const [result, , locationLine] = log;
    const location = locationLine
      .split("/base/tests/spec/")[1]
      .replace(/\)$/, "");
    const title = [`${suite[0]} (${location})`, ...suite.slice(1), description]
      .map((s, i) => `${"\t".repeat(i === 0 ? 0 : 1)}${s}`)
      .join("\n");
    return `${title}\n${result.replace("Error: ", "")}`;
  });

failures.forEach(failure => {
  process.stdout.write(`::error:: ${escapeData(failure)}${EOL}`);
});
if (failures.length) {
  process.exit(1);
}

function escapeData(s) {
  return s.replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
}
