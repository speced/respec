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
const headerErrors = errorFilters.filter("w3c/headers");

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

const regionsOf = doc =>
  [...doc.querySelectorAll("[data-cg-region]")].map(el => el.dataset.cgRegion);

// The four shapes of the header box, as the cg-assets demos define them. Each
// row is one kind of document; what changes between them is markup, not
// values, which is why the generator decides it and cg-metadata.js never sees
// it.
const VARIANTS = [
  {
    label: "a draft living specification",
    config: { specStatus: "CG-LIVING", cgMaturity: "draft" },
    tag: "Draft",
    notice: "box--information",
    regions: [
      "last-edited",
      "progress",
      "browser-support",
      "living-spec",
      "usage-guidance",
    ],
    getInvolved: true,
    agreement: "Contributor License Agreement",
  },
  {
    label: "a transferred living specification",
    config: { specStatus: "CG-LIVING", cgMaturity: "transferred" },
    tag: "Transferred",
    notice: "box--information",
    regions: ["living-spec"],
    getInvolved: true,
    agreement: "Contributor License Agreement",
  },
  {
    label: "an unmaintained living specification",
    config: { specStatus: "CG-LIVING", cgMaturity: "unmaintained" },
    tag: "Unmaintained",
    notice: "box--warning",
    regions: ["living-spec"],
    getInvolved: false,
    agreement: "Contributor License Agreement",
  },
  {
    label: "a snapshot",
    config: { specStatus: "CG-SNAPSHOT" },
    tag: null,
    notice: "box--information",
    regions: ["living-spec"],
    getInvolved: true,
    agreement: "Final Specification Agreement",
  },
];

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
      // say how its own fetch went. Standing in for it here rather than
      // waiting on the real script: whatever state the live document is in at
      // save time, the published file starts from "static", or it ships a
      // currency claim no reader's browser ever made.
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
  });

  describe("the header box", () => {
    it("has a variant for every redesign status", () => {
      // Adding a status without adding it here would leave its header box
      // entirely uncovered.
      const covered = [...new Set(VARIANTS.map(v => v.config.specStatus))];
      expect(covered.sort()).toEqual([...cgRedesignStatus].sort());
    });

    for (const variant of VARIANTS) {
      describe(variant.label, () => {
        /** @type {Document} */
        let doc;
        beforeAll(async () => {
          doc = await makeRSDoc(cgOps(variant.config));
        });

        it("uses the redesigned header box, not the old CG one", () => {
          const head = doc.querySelector(".box.box--head");
          expect(head).toBeTruthy();
          expect(head.querySelector("h1#title")).toBeTruthy();
          // The old template's giveaway: a bare `<dl>` of version URLs.
          expect(doc.querySelector(".head")).toBeNull();
        });

        it("leaves exactly the containers this kind of document may show", () => {
          // A container the script must not fill is one the generator must
          // not emit: the type gate in cg-metadata.js is the backstop, not
          // the mechanism.
          expect(regionsOf(doc)).toEqual(variant.regions);
        });

        it("gives every container a noscript fallback", () => {
          for (const container of doc.querySelectorAll("[data-cg-region]")) {
            expect(container.querySelector("noscript"))
              .withContext(container.dataset.cgRegion)
              .toBeTruthy();
          }
        });

        it(`renders the ${variant.notice} notice`, () => {
          const box = doc.querySelector(`.box--head .${variant.notice}`);
          expect(box).toBeTruthy();
          expect(box.querySelector("h2")).toBeTruthy();
        });

        it(
          variant.tag
            ? `tags the title "${variant.tag}"`
            : "does not tag the title with a maturity stage",
          () => {
            const tag = doc.querySelector("h1#title .link--button--tag");
            if (!variant.tag) {
              expect(tag).toBeNull();
              return;
            }
            expect(tag.textContent.trim()).toBe(variant.tag);
            // The chevron is part of the control, and textContent would eat
            // it if anything ever tried to rewrite the label.
            expect(tag.querySelector("svg.icon")).toBeTruthy();
          }
        );

        it(`publishes under the ${variant.agreement}`, () => {
          const copyright = doc.querySelector(".box--head .copyright");
          expect(copyright.textContent).toContain(variant.agreement);
        });

        it(
          variant.getInvolved
            ? "invites the reader to get involved"
            : "does not invite the reader to get involved",
          () => {
            const section = doc.getElementById("cg-get-involved");
            expect(Boolean(section)).toBe(variant.getInvolved);
          }
        );

        it("adds nothing of its own to the Status of This Document", () => {
          const sotd = doc.getElementById("sotd");
          // The header box and "Get involved" say all of this, where a reader
          // looks for it. Repeating it here is two wordings to keep in step.
          for (const phrase of [
            "not a W3C Standard",
            "not (yet) ready",
            "Contributor License Agreement",
            "beta-test",
          ]) {
            expect(sotd.textContent).withContext(phrase).not.toContain(phrase);
          }
          expect(sotd.querySelector('a[href="#usage-guidance"]')).toBeNull();
          expect(sotd.querySelector('a[href="#cg-get-involved"]')).toBeNull();
          // Exactly what the editors wrote, and nothing else:
          // makeDefaultBody's sotd is a single paragraph reading "foo".
          expect(sotd.querySelectorAll("p")).toHaveSize(1);
          expect(sotd.textContent).toContain("foo");
        });

        it("names the incubating group, and is not a W3C publication", () => {
          const head = doc.querySelector(".box--head");
          expect(head.textContent).toContain("Incubation by:");
          expect(doc.querySelector("img[alt='W3C']")).toBeNull();
          // The maturity tag is appended to the same h1 the copyright is
          // built from, so a clone taken too late would read "the Foo Draft
          // Specification".
          const copyright = doc.querySelector(".box--head .copyright");
          expect(copyright.textContent).not.toContain(`${variant.tag} Spec`);
        });

        it("reports nothing", () => {
          expect(defaultErrors(doc)).toHaveSize(0);
          expect(headerErrors(doc)).toHaveSize(0);
          expect(cgSpecErrors(doc)).toHaveSize(0);
        });
      });
    }
  });

  describe("an empty Status of This Document", () => {
    it("is left empty, with only its heading", async () => {
      const ops = cgOps();
      ops.body = "<section id='sotd'></section><section id='toc'></section>";
      const doc = await makeRSDoc(ops);
      const sotd = doc.getElementById("sotd");
      expect(sotd.querySelectorAll("p")).toHaveSize(0);
      expect(sotd.querySelector("h2").textContent).toContain(
        "Status of This Document"
      );
    });
  });

  describe("the foot sections", () => {
    it("lists them in the table of contents, unnumbered", async () => {
      const doc = await makeRSDoc(cgOps({ cgMaturity: "draft" }));
      for (const id of ["cg-get-involved", "usage-guidance"]) {
        const link = doc.querySelector(`#toc a[href="#${id}"]`);
        expect(link).withContext(id).toBeTruthy();
        // Boilerplate, not part of the spec's own sequence of sections.
        expect(link.querySelector(".secno")).withContext(id).toBeNull();
      }
    });

    it("puts the usage guidance behind the header box's own link", async () => {
      const doc = await makeRSDoc(cgOps({ cgMaturity: "draft" }));
      expect(
        doc.querySelector('.box--head a[href="#usage-guidance"]')
      ).toBeTruthy();
      expect(doc.getElementById("usage-guidance")).toBeTruthy();
    });
  });

  describe("the snapshots index", () => {
    const snapshotsLink = doc =>
      [...doc.querySelectorAll(".box--head a")].filter(a =>
        a.textContent.includes("Snapshots of this specification")
      );

    it("derives the address from the group and the short name", async () => {
      const doc = await makeRSDoc(cgOps());
      const [link] = snapshotsLink(doc);
      expect(link.getAttribute("href")).toBe(
        "https://incubation.w3.org/groups/wicg/specs#scheduling-apis"
      );
    });

    it("keeps the link, with no target, when it cannot be derived", async () => {
      // w3c/cg-spec has already reported the missing short name. The link is
      // still real, so an empty target is not the same as dropping it.
      const doc = await makeRSDoc(cgOps({ shortName: undefined }));
      const links = snapshotsLink(doc);
      expect(links).toHaveSize(1);
      expect(links[0].getAttribute("href")).toBe("");
    });
  });

  describe("a snapshot's own identity", () => {
    it("states when it was published, and where it lives", async () => {
      const doc = await makeRSDoc(
        cgOps({
          specStatus: "CG-SNAPSHOT",
          publishDate: "2025-05-30",
          thisVersion: "https://example.com/snapshots/2025-05-30/",
        })
      );
      const notice = doc.querySelector(".box--head .box--information");
      const time = notice.querySelector("time.dt-updated");
      // Its own date and address are facts the generator knows; only the
      // living specification's are fetched.
      expect(time.getAttribute("datetime")).toBe("2025-05-30");
      expect(notice.textContent).toContain("30 May 2025");
      expect(
        notice.querySelector(
          'a[href="https://example.com/snapshots/2025-05-30/"]'
        )
      ).toBeTruthy();
    });

    it("omits the address line when there is no address to give", async () => {
      const doc = await makeRSDoc(cgOps({ specStatus: "CG-SNAPSHOT" }));
      const notice = doc.querySelector(".box--head .box--information");
      expect(notice.textContent).not.toContain("The address of this snapshot");
    });
  });

  describe("transferredTo", () => {
    it("names and links the organization that took the work up", async () => {
      const doc = await makeRSDoc(
        cgOps({
          cgMaturity: "transferred",
          transferredTo: { name: "WHATWG", url: "https://whatwg.org/" },
        })
      );
      const notice = doc.querySelector(".box--head .box--information");
      const link = notice.querySelector('a[href="https://whatwg.org/"]');
      expect(link.textContent).toBe("WHATWG");
      expect(notice.textContent).toContain("has taken up the work");
    });

    it("accepts a plain name", async () => {
      const doc = await makeRSDoc(
        cgOps({ cgMaturity: "transferred", transferredTo: "WHATWG" })
      );
      const notice = doc.querySelector(".box--head .box--information");
      expect(notice.textContent).toContain("WHATWG has taken up the work");
    });
  });

  describe("CG-DRAFT", () => {
    /** @type {Document} */
    let doc;
    beforeAll(async () => {
      doc = await makeRSDoc(
        makeStandardOps({ specStatus: "CG-DRAFT", group: "wicg" })
      );
    });

    it("still gets the old header, untouched", () => {
      expect(doc.querySelector(".head")).toBeTruthy();
      expect(doc.querySelector(".box--head")).toBeNull();
      expect(regionsOf(doc)).toEqual([]);
      expect(doc.getElementById("cg-get-involved")).toBeNull();
      expect(doc.getElementById("usage-guidance")).toBeNull();
      expect(headerErrors(doc)).toHaveSize(0);
    });

    it("still gets the W3C TR assets", () => {
      expect(
        doc.querySelector(
          `link[rel~="stylesheet"][href="https://www.w3.org/StyleSheets/TR/2021/cg-draft"]`
        )
      ).toBeTruthy();
      expect(doc.querySelector(`link[href^="${BASE}"]`)).toBeNull();
    });
  });
});
