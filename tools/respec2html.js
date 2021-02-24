#!/usr/bin/env node
const sade = require("sade");
const colors = require("colors");
const marked = require("marked");
const { toHTML, write } = require("./respecDocWriter");

class Renderer extends marked.Renderer {
  strong(text) {
    return colors.bold(text);
  }
  em(text) {
    return colors.italic(text);
  }
  codespan(text) {
    return colors.underline(text);
  }
  paragraph(text) {
    return text;
  }
  link(href, _title, text) {
    return colors.blue(`[${text}](${colors.dim.underline(href)})`);
  }
}

class Logger {
  constructor(verbose) {
    this.verbose = verbose;
  }

  info(message, timeRemaining) {
    if (!this.verbose) return;
    const header = colors.bgWhite.black.bold("[INFO]");
    const time = colors.dim(`[Timeout: ${timeRemaining}ms]`);
    console.log(header, time, message);
  }

  error(rsError) {
    const header = colors.bgRed.white.bold("[ERROR]");
    const message = colors.red(this._formatMarkdown(rsError.message));
    console.error(header, message);
  }

  warn(rsError) {
    const header = colors.bgYellow.black.bold("[WARNING]");
    const message = colors.yellow(this._formatMarkdown(rsError.message));
    console.warn(header, message);
  }

  fatal(error) {
    const header = colors.bgRed.white.bold("[FATAL]");
    const message = colors.red(error.stack || error);
    console.error(header, message);
  }

  _formatMarkdown(str) {
    return marked(str, { smartypants: true, renderer: new Renderer() });
  }
}

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

  const logger = new Logger(opts.verbose && destination !== "stdout");

  if (!source) {
    logger.fatal("A source is required.");
    cli.help();
    process.exit(1);
  }

  return run(source, destination, opts, logger).catch(err => {
    logger.fatal(err);
    process.exit(1);
  });
});

cli.parse(process.argv);

async function run(source, destination, options, logger) {
  const src = new URL(source, `file://${process.cwd()}/`).href;

  const { html, errors, warnings } = await toHTML(src, {
    timeout: options.timeout * 1000,
    onError: logger.error.bind(logger),
    onWarning: logger.warn.bind(logger),
    onProgress: logger.info.bind(logger),
    disableSandbox: options["disable-sandbox"],
    devtools: options.devtools,
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
