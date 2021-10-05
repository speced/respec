/* eslint-env node */
const {
  constants: { F_OK },
  promises: { readFile, access },
} = require("fs");
const { execSync } = require("child_process");
const path = require("path");
const { Builder } = require("../tools/builder.js");

async function fileExists(filePath) {
  try {
    await access(filePath, F_OK);
    return true;
  } catch {
    return false;
  }
}

describe("builder (tool)", () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

  const profiles = ["w3c", "geonovum"];
  const rootDir = path.join(__dirname, "..");

  beforeAll(async () => {
    await Promise.all(
      profiles.map(profile => Builder.build({ name: profile }))
    );
  });

  afterAll(() => {
    execSync("git restore builds", { cwd: rootDir });
  });

  for (const profile of profiles) {
    const profileFile = path.join(rootDir, `builds/respec-${profile}.js`);
    const mapFile = path.join(rootDir, `builds/respec-${profile}.js.map`);
    it(`builds the "${profile}" profile and sourcemap`, async () => {
      await expectAsync(fileExists(profileFile)).toBeResolvedTo(true);
      await expectAsync(fileExists(mapFile)).toBeResolvedTo(true);
    });
    it(`includes sourcemap link for "${profile}"`, async () => {
      const source = await readFile(profileFile, "utf-8");
      expect(source).toContain(`${profile}.js.map`);
    });
  }
});
