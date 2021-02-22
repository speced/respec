#!/usr/bin/env node
const sade = require("sade");
const colors = require("colors");
const { toHTML, write } = require("./respecDocWriter");

colors.setTheme({
  data: "grey",
  debug: "cyan",
  error: "red",
  help: "cyan",
  important: "red",
  info: "green",
  input: "grey",
  prompt: "grey",
  verbose: "cyan",
  warn: "yellow",
});

const cli = sade("respec [source] [destination]", true)
  .describe("Converts a ReSpec source file to HTML and writes to destination.")
  .example(`input.html output.html ${colors.dim("# Output to a file.")}`)
  .example(
    `http://example.com/spec.html stdout ${colors.dim("# Output to stdout.")}`
  )
  .example(
    `http://example.com/spec.html output.html -e -w ${colors.dim(
      "# Halt on errors or warning."
    )}`
  )
  .example("--src http://example.com/spec.html --out spec.html");

cli
  // For backward compatibility
  .option("-s, --src", "URL to ReSpec source file.")
  // For backward compatibility
  .option("-o, --out", "Path to output file.")
  .option(
    "-t, --timeout",
    "How long to wait before timing out (in seconds).",
    10
  )
  .option("-e, --haltonerror", "Abort if the spec has any errors.", false)
  .option("-w, --haltonwarn", "Abort if ReSpec generates warnings.", false)
  .option("--disable-sandbox", "Disable Chromium sandboxing if needed.", false)
  .option("--devtools", "Enable debugging and show Chrome's DevTools.", false)
  .option("--verbose", "Log processing status to stdout.", false);

cli.action((source, destination, opts) => {
  source = source || opts.src;
  destination = destination || opts.out;
  if (!source) {
    console.error(colors.error("A source is required."));
    cli.help();
    process.exit(1);
  }

  return run(source, destination, opts).catch(err => {
    console.error(colors.error(err.stack));
    process.exit(1);
  });
});

cli.parse(process.argv);

async function run(source, destination, options) {
  const src = new URL(source, `file://${process.cwd()}/`).href;

  const { html, errors, warnings } = await toHTML(src, {
    timeout: options.timeout * 1000,
    onError(error) {
      console.error(
        colors.error(`💥 ReSpec error: ${colors.debug(error.message)}`)
      );
    },
    onWarning(warning) {
      console.warn(
        colors.warn(`⚠️ ReSpec warning: ${colors.debug(warning.message)}`)
      );
    },
    disableSandbox: options["disable-sandbox"],
    devtools: options.devtools,
    verbose: options.verbose && destination !== "stdout",
  });

  const exitOnError = errors.length && options.haltonerror;
  const exitOnWarning = warnings.length && options.haltonwarn;
  if (exitOnError || exitOnWarning) {
    throw new Error(
      `${exitOnError ? "Errors" : "Warnings"} found during processing.`
    );
  }

  await write(destination, html);
}
