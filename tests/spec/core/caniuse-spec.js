"use strict";
describe("Core — Can I Use", function () {
  afterAll(flushIframes);

  it("adds proper placeholders", async () => {
    const ops = makeStandardOps({ caniuse: "FEATURE" });
    const doc = await makeRSDoc(ops);

    const title = doc.getElementById("caniuse-FEATURE");
    const placeholder = title.nextElementSibling;
    expect(title.textContent).toBe("Can I Use this API?");
    expect(placeholder.textContent).toBe("Fetching data from caniuse.com...");
    expect(placeholder.localName).toBe("dd");
  });

  it("uses meaningful defaults", async () => {
    const ops = makeStandardOps({ caniuse: "FEATURE" });
    const doc = await makeRSDoc(ops);
    const { caniuse } = doc.defaultView.respecConfig;

    expect(caniuse.feature).toBe("FEATURE");
    expect(caniuse.maxAge).toBe(24 * 60 * 60 * 1000);
    expect(caniuse.versions).toBe(4);
    expect(caniuse.browsers.join(",")).toBe(["chrome", "firefox", "safari", "edge"].join(","));
  });

  it("allows overriding defaults", async () => {
    const ops = makeStandardOps({
      caniuse: {
        feature: "FEATURE",
        versions: 10,
        browsers: ["firefox", "chrome"],
        maxAge: 0,
      },
    });
    const doc = await makeRSDoc(ops);
    const { caniuse } = doc.defaultView.respecConfig;
    expect(caniuse.feature).toBe("FEATURE");
    expect(caniuse.maxAge).toBe(0);
    expect(caniuse.browsers.join(",")).toBe("firefox,chrome");
    expect(caniuse.versions).toBe(10);
  });

  it("does nothing if caniuse is not enabled", async() => {
    const ops = makeStandardOps();
    const doc = await makeRSDoc(ops);
    const { caniuse } = doc.defaultView.respecConfig;
    expect(caniuse).toBeFalsy();
    expect(doc.querySelector(".caniuse-title")).toBeFalsy();
    expect(doc.querySelector(".caniuse-stats")).toBeFalsy();
  });

  it("removes unsupported browsers", async () => {
    const ops = makeStandardOps({
      caniuse: {
        feature: "FEATURE",
        browsers: ["FireFox", "GoogleChrome", "SafarIE", "Opera"],
      },
    });
    const doc = await makeRSDoc(ops);
    const { caniuse } = doc.defaultView.respecConfig;
    expect(caniuse.browsers.length).toBe(2);
    expect(caniuse.browsers.join(",")).toBe("firefox,opera");
    // TODO: check for `pub` warnings
  });

  it("shows caniuse.com link on error", async (done) => {
    const ops = makeStandardOps({ caniuse: {
        feature: "FEATURE",
        apiURL: "DOES-NOT-EXIST",
      },
    });
    const doc = await makeRSDoc(ops);

    setTimeout(() => {
      const link = doc.querySelector(".caniuse-stats a");
      expect(link.textContent).toBe("caniuse.com");
      expect(link.href).toBe("https://caniuse.com/#feat=FEATURE");
      done();
    }, 50);
  });

  fit("shows caniuse browser support table", async (done) => {
    const ops = makeStandardOps({
      caniuse: {
        feature: "FEATURE",
        apiURL: `${window.location.origin}/tests/data/caniuse/{FEATURE}.json`,
        browsers: ["firefox", "chrome"],
        versions: 5,
      },
    });
    const doc = await makeRSDoc(ops);

    setTimeout(() => {
      const stats = doc.querySelector(".caniuse-stats");

      const moreInfoLink = stats.querySelector("a");
      expect(moreInfoLink.href).toBe("https://caniuse.com/#feat=FEATURE");
      expect(moreInfoLink.textContent.trim()).toBe("More info");

      const browsers = stats.querySelectorAll("ul.caniuse-browser");
      expect(browsers.length).toBe(2);
      const [firefox, chrome] = browsers;

      const chromeVersions = chrome.querySelectorAll("li.caniuse-cell");
      expect(chromeVersions.length).toBe(3);

      const firefoxVersions = firefox.querySelectorAll("li.caniuse-cell");
      expect(firefoxVersions.length).toBe(5);

      // eslint-disable-next-line no-unused-vars
      const [label, hiddenVersion, _] = firefoxVersions;

      expect(label.textContent.trim()).toBe("Firefox 61");
      expect(label.classList.value).toBe("caniuse-cell y");

      expect(hiddenVersion.textContent.trim()).toBe("60");
      expect(hiddenVersion.classList.value).toBe("caniuse-cell n d");

      // test hover effects
      let style = getComputedStyle(hiddenVersion);
      expect(style.getPropertyValue("display")).toBe("none");

      // add hover class as can't trigger a hover (https://stackoverflow.com/a/17226753/3367669)

      firefox.classList.add("hover");
      style = getComputedStyle(hiddenVersion);
      expect(style.getPropertyValue("display")).toBe("block");

      done();
  }, 50);
  });
});
