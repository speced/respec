#!/usr/bin/env node
const path = require("path");
const http = require("http");
const serveStatic = require("serve-static");
const finalhandler = require("finalhandler");
const sade = require("sade");
const colors = require("colors");
const { toHTML, write } = require("./respecDocWriter");

class Logger {
  /** @param {boolean} verbose */
  constructor(verbose) {
    this.verbose = verbose;
  }

  /**
   * @param {string} message
   * @param {number} timeRemaining
   */
  info(message, timeRemaining) {
    if (!this.verbose) return;
    console.log(`[Timeout: ${timeRemaining}ms] ${message}`);
  }

  /** @param {{ message: string }} rsError */
  error(rsError) {
    console.error(
      colors.red(`💥 ReSpec error: ${colors.cyan(rsError.message)}`)
    );
  }

  /** @param {{ message: string }} rsError */
  warn(rsError) {
    console.warn(
      colors.yellow(`⚠️ ReSpec warning: ${colors.cyan(rsError.message)}`)
    );
  }

  /** @param {Error | string} error */
  fatal(error) {
    console.error(colors.red(error.stack || error));
  }
}

class StaticServer {
  /**
   * @param {number} port
   * @param {string} source
   */
  constructor(port, source) {
    if (path.isAbsolute(source) || /^(\w+:\/\/)/.test(source.trim())) {
      const msg = `Invalid path for use with --localhost. Only relative paths allowed.`;
      const hint =
        "Please ensure your ReSpec document and its local resources" +
        " (e.g., data-includes) are accessible from the current working directory.";
      throw new Error(`${msg} ${hint}`);
    }

    if (port && isNaN(parseInt(port, 10))) {
      throw new Error("Invalid port number.");
    }

    this.port = port;
    this.source = source;

    const serve = serveStatic(process.cwd());
    this.server = http.createServer((req, res) => {
      serve(req, res, finalhandler(req, res));
    });
  }

  get url() {
    return new URL(this.source, `http://localhost:${this.port}/`);
  }

  async start() {
    await new Promise((resolve, reject) => {
      this.server.listen(this.port, resolve);
      this.server.on("error", reject);
    });
  }

  async stop() {
    await new Promise(resolve => this.server.close(resolve));
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
  .example("--src http://example.com/spec.html --out spec.html")
  .example(
    `--localhost index.html out.html ${colors.dim(
      "# Generate file using a local web server."
    )}`
  );

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
  .option("--verbose", "Log processing status to stdout.", false)
  .option("--localhost", "Spin up a local server to perform processing.", false)
  .option("--port", "Port override for --localhost.", 3000);

cli.action((source, destination, opts) => {
  source = source || opts.src;
  destination = destination || opts.out;
  const log = new Logger(opts.verbose && destination !== "stdout");

  if (!source) {
    log.fatal("A source is required.");
    cli.help();
    process.exit(1);
  }

  return run(source, destination, opts, log).catch(err => {
    log.fatal(err);
    process.exit(1);
  });
});

// https://github.com/lukeed/sade/issues/28#issuecomment-516104013
cli._version = () => {
  const { version } = require("../package.json");
  console.log(version);
};

cli.parse(process.argv);

/**
 * @param {string} source
 * @param {string|undefined} destination
 * @param {Record<string, string|number|boolean>} options
 * @param {Logger} log
 */
async function run(source, destination, options, log) {
  let staticServer;
  if (options.localhost) {
    staticServer = new StaticServer(options.port, source);
    await staticServer.start();
  }
  const src = options.localhost
    ? staticServer.url.href
    : new URL(source, `file://${process.cwd()}/`).href;
  log.info(`Processing resource: ${src} ...`, options.timeout * 1000);

  const { html, errors, warnings } = await toHTML(src, {
    timeout: options.timeout * 1000,
    onError: log.error.bind(log),
    onWarning: log.warn.bind(log),
    onProgress: log.info.bind(log),
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

  if (staticServer) await staticServer.stop();
}
