import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  buildSpec,
  listProfiles,
  preflightSpec,
  scaffoldSource,
  validateSpec,
} from "./respecMcpCore.js";

const baseSchema = {
  repo_root: z.string().optional(),
  profile: z.string().optional(),
  status: z.string().optional(),
  strict: z.boolean().optional(),
  overrides: z.record(z.any()).optional(),
};

const renderSchema = {
  ...baseSchema,
  source: z.string().optional(),
  output: z.string().optional(),
};

export function createReSpecMcpServer(options = {}) {
  const server = new McpServer({
    name: "respec-mcp",
    version: options.version || "0.1.0",
  });

  const toolOptions = {
    defaultRepoRoot: options.defaultRepoRoot,
    defaultProfile: options.defaultProfile,
    timeout: options.timeout,
    useLocal: options.useLocal,
    disableSandbox: options.disableSandbox,
    disableGPU: options.disableGPU,
    devtools: options.devtools,
  };

  server.registerTool(
    "respec_list_profiles",
    {
      title: "List ReSpec MCP Profiles",
      description:
        "Lists repo-local ReSpec MCP profiles discovered from respec-mcp.config.json and respec-mcp/profiles/*.json.",
      inputSchema: z.object({
        repo_root: z.string().optional(),
      }),
    },
    async input => formatResult(await listProfiles(input.repo_root || toolOptions.defaultRepoRoot))
  );

  server.registerTool(
    "respec_scaffold",
    {
      title: "Scaffold ReSpec Source",
      description:
        "Creates a ReSpec source document from a repo-local profile and status-specific template.",
      inputSchema: z.object(renderSchema),
    },
    async input => formatResult(await scaffoldSource(input, toolOptions))
  );

  server.registerTool(
    "respec_build",
    {
      title: "Build ReSpec Document",
      description:
        "Renders a ReSpec source file or URL to static HTML using the resolved repo-local profile.",
      inputSchema: z.object(renderSchema),
    },
    async input => formatResult(await buildSpec(input, toolOptions))
  );

  server.registerTool(
    "respec_validate",
    {
      title: "Validate ReSpec Document",
      description:
        "Runs ReSpec and returns render diagnostics plus profile-based compliance results without writing output by default.",
      inputSchema: z.object(renderSchema),
    },
    async input => formatResult(await validateSpec(input, toolOptions))
  );

  server.registerTool(
    "respec_preflight",
    {
      title: "Preflight Community Group Report",
      description:
        "Performs repo/profile policy checks for a ReSpec document, including status, required sections, required links, and forbidden phrases.",
      inputSchema: z.object(renderSchema),
    },
    async input => formatResult(await preflightSpec(input, toolOptions))
  );

  return server;
}

function formatResult(result) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(result, null, 2),
      },
    ],
    structuredContent: result,
  };
}
