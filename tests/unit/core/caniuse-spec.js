import { flushIframes, makePluginDoc } from "../SpecHelper.js";

describe("Core - Can I Use header", () => {
  afterEach(flushIframes);

  const caniuse = {
    feature: "FEATURE",
    apiURL: `${window.location.origin}/tests/data/caniuse/FEATURE.json`,
  };

  function makeDoc(config, body = "") {
    return makePluginDoc(["/src/core/caniuse.js"], {
      config,
      body,
      head: `
        <meta charset="utf-8">
        <script>
          window.fetch = parent.jasmine.createSpy("fetch").and.callFake(
            window.fetch.bind(window)
          );
        </script>
      `,
    });
  }

  function warnings(doc) {
    return doc.respec.warnings.filter(
      warning => warning.plugin === "core/caniuse"
    );
  }

  function caniuseRequests(doc) {
    return doc.defaultView.fetch.calls
      .allArgs()
      .filter(([url]) => String(url).startsWith(caniuse.apiURL));
  }

  for (const removeOnSave of [true, false]) {
    for (const body of ["", '<div class="head"></div>']) {
      it(`warns without a header list (${body}, removeOnSave: ${removeOnSave})`, async () => {
        const doc = await makeDoc(
          { caniuse: { ...caniuse, removeOnSave } },
          body
        );

        expect(warnings(doc)).toHaveSize(1);
        expect(warnings(doc)[0]?.message).toContain(".head dl");
        expect(caniuseRequests(doc)).toHaveSize(0);
        expect(doc.querySelector(".caniuse-stats")).toBeNull();
        expect(doc.respec.errors).toHaveSize(0);
      });
    }
  }

  it("does nothing without a header when caniuse is disabled", async () => {
    const doc = await makeDoc({ caniuse: false });

    expect(warnings(doc)).toHaveSize(0);
    expect(caniuseRequests(doc)).toHaveSize(0);
    expect(doc.querySelector(".caniuse-stats")).toBeNull();
  });

  it("fetches and inserts the support table when the header list exists", async () => {
    const doc = await makeDoc({ caniuse }, '<div class="head"><dl></dl></div>');

    expect(warnings(doc)).toHaveSize(0);
    expect(caniuseRequests(doc)).toHaveSize(1);
    expect(doc.querySelector(".head dl .caniuse-title")).not.toBeNull();
    expect(doc.querySelector(".head dl .caniuse-stats a")?.href).toBe(
      "https://caniuse.com/FEATURE"
    );
    expect(doc.respec.errors).toHaveSize(0);
  });
});
