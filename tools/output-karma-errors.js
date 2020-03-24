const karmaResultsData = require("../karma-result.json");

karmaResultsData.browsers[0].results
  .filter(item => item.success === false)
  .map(item => {
    const { suite, description, log } = item;
    const [result, , locationLine] = log;
    const location = locationLine
      .split("localhost:9876/base/tests/spec/")[1]
      .replace(/\)$/, "");
    const title = suite.concat(description).join(" > ");
    return { title, result, location };
  })
  .forEach(failure => {
    const { title, result, location } = failure;
    const output = `${title} (${location}): ${result.replace("Error: ", "")}`;
    console.error(`::error ${output}`);
  });
