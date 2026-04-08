const os = require("os");
const path = require("path");
const {
  promises: { mkdtemp, mkdir, rm, writeFile, readFile },
} = require("fs");

describe("respec MCP core", () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;

  let tempRoot;
  let api;

  beforeAll(async () => {
    api = await import("../tools/respecMcpCore.js");
    tempRoot = await mkdtemp(path.join(os.tmpdir(), "respec-mcp-"));
    await mkdir(path.join(tempRoot, "respec-mcp/profiles"), { recursive: true });
    await mkdir(path.join(tempRoot, "respec-mcp/templates"), { recursive: true });
    await mkdir(path.join(tempRoot, "reports/source"), { recursive: true });

    await writeFile(
      path.join(tempRoot, "respec-mcp.config.json"),
      JSON.stringify(
        {
          default_profile: "example-cg",
          profile_directory: "respec-mcp/profiles",
          source_root: "reports/source",
          build_root: "reports/build",
          template_defaults: {
            github: "example/spec",
            latestVersion: "https://example.test/spec/",
          },
        },
        null,
        2
      )
    );

    await writeFile(
      path.join(tempRoot, "w3c.json"),
      JSON.stringify(
        {
          group: [174898],
          contacts: ["editor@example.test"],
          "repo-type": "cg-report",
        },
        null,
        2
      )
    );

    await writeFile(
      path.join(tempRoot, "respec-mcp/profiles/example-cg.json"),
      JSON.stringify(
        {
          profile_id: "example-cg",
          label: "Example CG",
          group_type: "cg",
          allowed_statuses: ["CG-DRAFT", "CG-FINAL"],
          default_status: "CG-DRAFT",
          repo_metadata_source: "w3c.json",
          source_root: "reports/source",
          build_root: "reports/build",
          default_source: "reports/source/index.html",
          status_templates: {
            "CG-DRAFT": "respec-mcp/templates/cg-draft.html",
            "CG-FINAL": "respec-mcp/templates/cg-final.html",
          },
          respec_defaults: {
            title: "Example Spec",
            shortName: "example-spec",
            group: "cg/pm-kr",
            editors: [
              {
                name: "Example Editor",
                company: "Example Org",
              },
            ],
          },
          required_sections: [
            "Abstract",
            "Introduction",
            "Use Cases",
            "Security Considerations",
            "Privacy Considerations",
          ],
          required_links: [
            "https://www.w3.org/community/example/",
            "https://github.com/example/spec",
          ],
          forbidden_phrases: ["W3C Recommendation"],
        },
        null,
        2
      )
    );

    const template = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>{{title}}</title>
    <script class="remove">
      const respecConfig = {
        specStatus: {{specStatusJson}},
        shortName: {{shortNameJson}},
        group: {{groupJson}},
        github: {{githubJson}},
        latestVersion: {{latestVersionJson}},
        editors: {{editorsJson}},
      };
    </script>
    <script async class="remove" src="https://www.w3.org/Tools/respec/respec-w3c"></script>
  </head>
  <body>
    <section id="abstract"><p>Abstract</p></section>
    <section id="sotd"><p>Draft Community Group Report</p></section>
    <section><h2>Introduction</h2><p>https://www.w3.org/community/example/</p></section>
    <section><h2>Use Cases</h2><p>https://github.com/example/spec</p></section>
    <section><h2>Security Considerations</h2><p>Security.</p></section>
    <section><h2>Privacy Considerations</h2><p>Privacy.</p></section>
  </body>
</html>`;

    await writeFile(
      path.join(tempRoot, "respec-mcp/templates/cg-draft.html"),
      template
    );
    await writeFile(
      path.join(tempRoot, "respec-mcp/templates/cg-final.html"),
      template.replace("Draft Community Group Report", "Final Community Group Report")
    );
  });

  afterAll(async () => {
    await rm(tempRoot, { recursive: true, force: true });
  });

  it("lists profiles from repo-local config", async () => {
    const result = await api.listProfiles(tempRoot);
    expect(result.default_profile).toBe("example-cg");
    expect(result.profiles.length).toBe(1);
    expect(result.profiles[0].profile_id).toBe("example-cg");
  });

  it("scaffolds a source from the profile template", async () => {
    const result = await api.scaffoldSource({
      repo_root: tempRoot,
      profile: "example-cg",
      status: "CG-DRAFT",
      output: "reports/source/index.html",
      overrides: {
        title: "Example CG Draft",
      },
    });
    expect(result.status).toBe("CG-DRAFT");
    expect(result.compliance.valid).toBeTrue();
    const output = await readFile(path.join(tempRoot, "reports/source/index.html"), "utf-8");
    expect(output).toContain("Example CG Draft");
    expect(output).toContain("CG-DRAFT");
  });

  it("builds HTML and returns compliance output", async () => {
    const result = await api.buildSpec(
      {
        repo_root: tempRoot,
        profile: "example-cg",
        source: "reports/source/index.html",
      },
      {
        useLocal: true,
        disableSandbox: true,
        timeout: 60000,
      }
    );
    expect(result.errors.length).toBe(0);
    expect(result.compliance.valid).toBeTrue();
    expect(result.output).toContain(path.join("reports", "build", "index.html"));
  });

  it("flags forbidden phrases during preflight", async () => {
    await writeFile(
      path.join(tempRoot, "reports/source/bad.html"),
      `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Bad</title>
    <script class="remove">
      const respecConfig = {
        specStatus: "CG-DRAFT",
        shortName: "bad",
        group: "cg/pm-kr",
        github: "example/spec",
      };
    </script>
    <script async class="remove" src="https://www.w3.org/Tools/respec/respec-w3c"></script>
  </head>
  <body>
    <section id="abstract"><p>W3C Recommendation</p></section>
    <section><h2>Introduction</h2><p>Intro</p></section>
    <section><h2>Use Cases</h2><p>Use</p></section>
    <section><h2>Security Considerations</h2><p>Sec</p></section>
    <section><h2>Privacy Considerations</h2><p>Privacy</p></section>
  </body>
</html>`
    );

    const result = await api.preflightSpec(
      {
        repo_root: tempRoot,
        profile: "example-cg",
        source: "reports/source/bad.html",
      },
      {
        useLocal: true,
        disableSandbox: true,
        timeout: 60000,
      }
    );

    expect(result.compliance.valid).toBeFalse();
    expect(result.compliance.forbidden_phrase_hits).toContain("W3C Recommendation");
  });
});
