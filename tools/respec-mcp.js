#!/usr/bin/env node
import path from "path";
import sade from "sade";
import { readFile } from "fs/promises";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createReSpecMcpServer } from "./respecMcpServer.js";

const cli = sade("respec-mcp", true)
  .describe("Runs the ReSpec MCP server over stdio.")
  .option("--repo-root", "Default repo root for tool calls.", process.cwd())
  .option("--profile", "Default profile id for tool calls.")
  .option(
    "--timeout",
    "How long to wait before timing out ReSpec rendering (in milliseconds).",
    300000
  )
  .option("--use-local", "Use the locally built ReSpec bundle if requested.", false)
  .option("--disable-sandbox", "Disable Chromium sandboxing.", false)
  .option("--disable-gpu", "Disable GPU usage in Chromium.", false)
  .option("--devtools", "Run Chromium with devtools open.", false);

cli.action(async opts => {
  try {
    const version = await readVersion();
    const server = createReSpecMcpServer({
      version,
      defaultRepoRoot: path.resolve(opts["repo-root"]),
      defaultProfile: opts.profile,
      timeout: parseInt(String(opts.timeout), 10),
      useLocal: Boolean(opts["use-local"]),
      disableSandbox: Boolean(opts["disable-sandbox"]),
      disableGPU: Boolean(opts["disable-gpu"]),
      devtools: Boolean(opts.devtools),
    });
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (error) {
    process.stderr.write(`${error.stack || error}\n`);
    process.exit(1);
  }
});

cli.parse(process.argv, {
  unknown(flag) {
    process.stderr.write(`Unknown option: ${flag}\n`);
    process.exit(1);
  },
});

async function readVersion() {
  const packagePath = path.join(import.meta.dirname, "..", "package.json");
  const { version } = JSON.parse(await readFile(packagePath, "utf-8"));
  return version;
}
