# ReSpec MCP

## Summary

`respec-mcp` is a stdio MCP server that wraps ReSpec's existing rendering API and
adds repo-local profile discovery. The goal is to let specification repos keep their
own policy, templates, and build paths while reusing one upstream MCP runtime.

LLM operators should also read [MCP_LLM_AUTHORING_GUIDE.md](MCP_LLM_AUTHORING_GUIDE.md)
before drafting or revising W3C/Community Group reports.

## Repo-local configuration

Each consuming repo can provide:

- `respec-mcp.config.json`
- `respec-mcp/profiles/*.json`

Minimal config example:

```json
{
  "default_profile": "example-cg",
  "profile_directory": "respec-mcp/profiles",
  "source_root": "reports/source",
  "build_root": "reports/build"
}
```

Minimal profile example:

```json
{
  "profile_id": "example-cg",
  "allowed_statuses": ["CG-DRAFT", "CG-FINAL"],
  "default_status": "CG-DRAFT",
  "repo_metadata_source": "w3c.json",
  "status_templates": {
    "CG-DRAFT": "respec-mcp/templates/cg-draft.html",
    "CG-FINAL": "respec-mcp/templates/cg-final.html"
  },
  "required_sections": ["Abstract", "Introduction"],
  "required_links": ["https://www.w3.org/community/example/"],
  "forbidden_phrases": ["W3C Recommendation"]
}
```

## Tools

- `respec_list_profiles`
- `respec_scaffold`
- `respec_build`
- `respec_validate`
- `respec_preflight`

All tools accept `repo_root` and may accept `profile`, `status`, `source`, `output`,
and `overrides` depending on the operation.

## Local execution

```bash
node tools/respec-mcp.js --repo-root /path/to/spec-repo
```

## Docker execution

```bash
docker build -t respec-mcp:local .
docker run --rm -i -v /path/to/spec-repo:/workspace -w /workspace respec-mcp:local
```

## AI client usage

Point the client to the stdio command and set the repo root at process start or per
tool call.

Authoring discipline matters as much as rendering. For W3C/CG reports, clients
should load the repo profile plus the guidance in
[MCP_LLM_AUTHORING_GUIDE.md](MCP_LLM_AUTHORING_GUIDE.md) before using
`respec_scaffold`, `respec_validate`, `respec_preflight`, or `respec_build`.

Local:

```json
{
  "command": "node",
  "args": ["tools/respec-mcp.js", "--repo-root", "/path/to/spec-repo"]
}
```

Docker:

```json
{
  "command": "docker",
  "args": [
    "run",
    "--rm",
    "-i",
    "-v",
    "/path/to/spec-repo:/workspace",
    "-w",
    "/workspace",
    "respec-mcp:local"
  ]
}
```
