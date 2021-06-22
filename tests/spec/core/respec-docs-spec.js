"use strict";

import { docLink } from "../../../src/core/respec-docs.js";

describe("Core - ReSpec docs", () => {
  describe("docLink", () => {
    it("it allows unlinked strings", () => {
      const result = docLink`Link to ${"nothing"}.`;
      expect(result).toBe("Link to nothing.");
    });

    it("it links known config options", () => {
      const result = docLink`Link to ${"[specStatus]"}.`;
      expect(result).toBe(
        "Link to [`specStatus`](https://respec.org/docs/#specStatus)."
      );
    });

    it("it aliases relative to docs folder", () => {
      const result = docLink`See ${"[using `data-dfn-for`|#data-dfn-for]"}.`;
      expect(result).toBe(
        "See [using `data-dfn-for`](https://respec.org/docs/#data-dfn-for)."
      );
    });

    it("it aliases absolute URLs", () => {
      const result = docLink`Link to ${"[doc status|https://somewhere.else]"}.`;
      expect(result).toBe("Link to [doc status](https://somewhere.else/).");
    });

    it("it allows mixing known, aliased, and absolute URLs", () => {
      const result = docLink`Link to ${"[authors]"} ${"[writers|editors]"} ${"[somewhere|https://somewhere.else]"}.`;
      expect(result).toBe(
        "Link to [`authors`](https://respec.org/docs/#authors) [writers](https://respec.org/docs/editors) [somewhere](https://somewhere.else/)."
      );
    });
  });
});
