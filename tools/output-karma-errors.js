const { EOL } = require("os");
const karmaResultsData = require("../karma-result.json");

const failures = karmaResultsData.browsers[0].results
  .filter(item => item.success === false)
  .map(item => {
    const { suite, description, log } = item;
    const [result, , locationLine] = log;
    const location = locationLine
      .split("localhost:9876/base/tests/spec/")[1]
      .replace(/\)$/, "");
    const title = suite.concat(description).join(" > ");
    return { title, result, location };
  });

failures.forEach(failure => {
  const { title, result, location } = failure;
  const output = `${title} (${location}):\n ${result.replace("Error: ", "")}`;
  process.stdout.write(`::error:: ${escapeData(output)}${EOL}`);
});
if (failures.length) {
  process.exit(1);
}

function escapeData(s) {
  return s.replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
}
