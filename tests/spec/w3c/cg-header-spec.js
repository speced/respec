"use strict";

import {
  errorFilters,
  flushIframes,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";

import { seedGroupCache } from "../respec-cache-helper.js";

const headerErrors = errorFilters.filter("w3c/headers");

const cgOps = (config = {}) =>
  makeStandardOps({
    specStatus: "CG-LIVING",
    group: "wicg",
    shortName: "scheduling-apis",
    ...config,
  });

const regionsOf = doc =>
  [...doc.querySelectorAll("[data-cg-region]")].map(el => el.dataset.cgRegion);

// The different variants of the CG header box that the tests will cover.
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

describe("W3C — CG redesign header", () => {
  afterAll(flushIframes);
  beforeAll(seedGroupCache);

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

      it("names the incubating group and keeps the title out of the copyright", () => {
        const head = doc.querySelector(".box--head");
        expect(head.textContent).toContain("Incubation by:");
        const copyright = doc.querySelector(".box--head .copyright");
        expect(copyright.textContent).not.toContain(`${variant.tag} Spec`);
      });
    });
  }

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
      expect(time.getAttribute("datetime")).toBe("2025-05-30");
      expect(time.textContent.trim()).toBeTruthy();
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
    it("still gets the old header, untouched", async () => {
      const doc = await makeRSDoc(
        makeStandardOps({ specStatus: "CG-DRAFT", group: "wicg" })
      );
      expect(doc.querySelector(".head")).toBeTruthy();
      expect(doc.querySelector(".box--head")).toBeNull();
      expect(regionsOf(doc)).toEqual([]);
      expect(doc.getElementById("cg-get-involved")).toBeNull();
      expect(doc.getElementById("usage-guidance")).toBeNull();
      expect(headerErrors(doc)).toHaveSize(0);
    });
  });
});
