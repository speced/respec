"use strict";

import {
  errorFilters,
  flushIframes,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";

import { cgRedesignStatus } from "../../../src/w3c/headers.js";
import { seedGroupCache } from "../respec-cache-helper.js";

const cgSpecErrors = errorFilters.filter("w3c/cg-spec");
const defaultErrors = errorFilters.filter("w3c/defaults");

const BASE = "https://w3c.github.io/cg-assets/";
const STYLES = ["css/base.css", "css/cg-spec.css", "css/dark.css"];
const SCRIPTS = ["js/cg-fixup.js", "js/dark.js", "js/cg-metadata.js"];

const sheet = path => `link[rel~="stylesheet"][href="${BASE}${path}"]`;

// Parse rather than load the export. `getExportedDoc` puts the result in an
// iframe, where the three cg-assets scripts run again and immediately undo what
// is being asserted -- they are doing their job, on what has become a live
// document for a new reader. What ships is the markup, so assert on that.
const exportedDoc = async doc =>
  new DOMParser().parseFromString(await doc.respec.toHTML(), "text/html");

const cgOps = (config = {}) =>
  makeStandardOps({
    specStatus: "CG-LIVING",
    group: "wicg",
    shortName: "scheduling-apis",
    ...config,
  });

describe("W3C — CG specification redesign", () => {
  afterAll(flushIframes);
  beforeAll(seedGroupCache);

  describe("identity metadata", () => {
    const TYPES = [
      ["CG-LIVING", "living"],
      ["CG-SNAPSHOT", "snapshot"],
    ];
    for (const [specStatus, type] of TYPES) {
      it(`declares ${specStatus} as a "${type}" document`, async () => {
        const doc = await makeRSDoc(cgOps({ specStatus }));
        expect(doc.querySelector("meta[name='cg-spec-type']").content).toBe(
          type
        );
        expect(
          doc.querySelector("meta[name='cg-spec-shortname']").content
        ).toBe("scheduling-apis");
        expect(doc.querySelector("meta[name='cg-spec-maturity']").content).toBe(
          "draft"
        );
        expect(cgSpecErrors(doc)).toHaveSize(0);
      });
    }

    it("takes the shortname from the final value, after core/github has set it", async () => {
      // core/github runs after w3c/style but before w3c/cg-spec, and derives
      // shortName from the repository when the author has not set one.
      const ops = cgOps({
        shortName: undefined,
        github: "WICG/scheduling-apis",
      });
      const doc = await makeRSDoc(ops);
      expect(doc.querySelector("meta[name='cg-spec-shortname']").content).toBe(
        "scheduling-apis"
      );
      expect(cgSpecErrors(doc)).toHaveSize(0);
    });

    it("errors and emits no identity at all when there is no shortName", async () => {
      const ops = cgOps({ shortName: undefined });
      const doc = await makeRSDoc(ops);
      const errors = cgSpecErrors(doc);
      expect(errors).toHaveSize(1);
      expect(errors[0].message).toContain("shortName");
      // A half-written identity would have cg-metadata.js look up nothing, or
      // worse, the wrong spec.
      expect(doc.querySelector("meta[name='cg-spec-type']")).toBeNull();
      expect(doc.querySelector("meta[name='cg-spec-shortname']")).toBeNull();
      expect(doc.querySelector("meta[name='cg-spec-maturity']")).toBeNull();
    });

    it("says nothing about CG identity on a document that is not one", async () => {
      const doc = await makeRSDoc(
        makeStandardOps({ specStatus: "CG-DRAFT", group: "wicg" })
      );
      expect(doc.querySelector("meta[name='cg-spec-type']")).toBeNull();
      expect(doc.documentElement.dataset.cgMetadata).toBeUndefined();
    });

    it("exports the identity", async () => {
      const doc = await exportedDoc(await makeRSDoc(cgOps()));
      expect(doc.querySelector("meta[name='cg-spec-type']").content).toBe(
        "living"
      );
      expect(doc.querySelector("meta[name='cg-spec-shortname']").content).toBe(
        "scheduling-apis"
      );
    });

    it("exports the state cg-metadata.js starts from, not the one it reached", async () => {
      // cg-metadata.js runs in the generator's browser too, and sets this to
      // say how its own fetch went. Standing in for it here rather than waiting
      // on the real script: the point is that whatever state the live document
      // is in at save time, the published file starts from "static", or it
      // ships a currency claim no reader's browser ever made.
      const live = await makeRSDoc(cgOps());
      live.documentElement.dataset.cgMetadata = "fresh";
      const doc = await exportedDoc(live);
      expect(doc.documentElement.dataset.cgMetadata).toBe("static");
    });
  });

  describe("cgMaturity", () => {
    for (const cgMaturity of ["draft", "transferred", "unmaintained"]) {
      it(`accepts "${cgMaturity}"`, async () => {
        const doc = await makeRSDoc(cgOps({ cgMaturity }));
        expect(doc.querySelector("meta[name='cg-spec-maturity']").content).toBe(
          cgMaturity
        );
        expect(defaultErrors(doc)).toHaveSize(0);
      });
    }

    it("errors and falls back to draft on an unsupported value", async () => {
      const doc = await makeRSDoc(cgOps({ cgMaturity: "nonsense" }));
      const errors = defaultErrors(doc);
      expect(errors).toHaveSize(1);
      expect(errors[0].message).toContain("cgMaturity");
      expect(doc.querySelector("meta[name='cg-spec-maturity']").content).toBe(
        "draft"
      );
    });

    it("is silently irrelevant to a document that is not one of the two", async () => {
      const ops = makeStandardOps({
        specStatus: "CG-DRAFT",
        group: "wicg",
        cgMaturity: "transferred",
      });
      const doc = await makeRSDoc(ops);
      expect(defaultErrors(doc)).toHaveSize(0);
      expect(doc.respec.warnings).toHaveSize(0);
      expect(doc.querySelector("meta[name='cg-spec-maturity']")).toBeNull();
    });
  });

  describe("assets", () => {
    it("loads the cg-assets style sheets and scripts", async () => {
      const doc = await makeRSDoc(cgOps());
      for (const path of STYLES) {
        expect(doc.querySelector(sheet(path)))
          .withContext(path)
          .toBeTruthy();
      }
      for (const path of SCRIPTS) {
        expect(doc.querySelector(`script[src="${BASE}${path}"]`))
          .withContext(path)
          .toBeTruthy();
      }
    });

    it("defers cg-metadata.js, which reads the finished document", async () => {
      const doc = await makeRSDoc(cgOps());
      const script = doc.querySelector(
        `script[src="${BASE}js/cg-metadata.js"]`
      );
      expect(script.hasAttribute("defer")).toBeTrue();
    });

    it("gives the dark sheet the class and media dark.js needs", async () => {
      // dark.js takes the media list over once it runs, so the assertion that
      // matters is on the exported document: published with dark.js's own
      // "all" / "not all", a reader without scripting gets either an
      // unconditional dark page or no dark palette at all.
      const doc = await exportedDoc(await makeRSDoc(cgOps()));
      const dark = doc.querySelector(sheet("css/dark.css"));
      expect(dark.classList).toContain("dark-mode");
      expect(dark.media).toBe("(prefers-color-scheme: dark)");
    });

    it("keeps the three sheets adjacent and in order, on export", async () => {
      // The order is the assertion: all three set the same `:root` custom
      // properties at equal specificity, so the last one loaded wins.
      const doc = await exportedDoc(await makeRSDoc(cgOps()));
      const [base, cgSpec, dark] = STYLES.map(path =>
        doc.querySelector(sheet(path))
      );
      expect(base.nextElementSibling).toBe(cgSpec);
      expect(cgSpec.nextElementSibling).toBe(dark);
      expect(dark.nextElementSibling).toBeNull();
    });

    it("drops every W3C TR style sheet, hint and script", async () => {
      const doc = await makeRSDoc(cgOps());
      // Unfiltered by `rel` on purpose, so preload hints fail this too.
      expect(
        doc.querySelector(`link[href^="https://www.w3.org/StyleSheets/TR/"]`)
      ).toBeNull();
      expect(
        doc.querySelector(`script[src^="https://www.w3.org/scripts/TR/"]`)
      ).toBeNull();
      // cg-assets' dark.js drives the theme from localStorage and matchMedia,
      // so this tag would be markup nothing reads.
      expect(doc.querySelector("meta[name='color-scheme']")).toBeNull();
    });

    it("leaves the W3C TR assets alone for CG-DRAFT", async () => {
      const doc = await makeRSDoc(
        makeStandardOps({ specStatus: "CG-DRAFT", group: "wicg" })
      );
      expect(
        doc.querySelector(
          `link[rel~="stylesheet"][href="https://www.w3.org/StyleSheets/TR/2021/cg-draft"]`
        )
      ).toBeTruthy();
      expect(doc.querySelector(`link[href^="${BASE}"]`)).toBeNull();
    });
  });

  describe("status handling", () => {
    for (const specStatus of cgRedesignStatus) {
      it(`treats ${specStatus} as a Community Group report`, async () => {
        const doc = await makeRSDoc(cgOps({ specStatus }));
        // Community Group treatment, not Working Group treatment. Which of the
        // two community agreements applies is per status, and is asserted in
        // cg-header-spec.js.
        expect(
          doc.querySelector(".box--head .copyright").textContent
        ).toContain("W3C Community");
        expect(doc.getElementById("sotd").textContent).toContain(
          "not a W3C Standard"
        );
        // No W3C logo: these are not W3C publications.
        expect(doc.querySelector("img[alt='W3C']")).toBeNull();
        expect(defaultErrors(doc)).toHaveSize(0);
      });
    }
  });
});
