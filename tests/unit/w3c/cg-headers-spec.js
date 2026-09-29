"use strict";

import { snapshotsIndex } from "/src/w3c/templates/cg-headers.js";

describe("W3C - CG headers - snapshotsIndex", () => {
  it("builds the address from the group and the short name", () => {
    expect(
      snapshotsIndex({ group: "wicg", shortName: "scheduling-apis" })
    ).toBe("https://incubation.w3.org/groups/wicg/specs/#scheduling-apis");
  });

  it("uses the group's own short name from a type-qualified group", () => {
    expect(snapshotsIndex({ group: "wicg/cg", shortName: "foo" })).toBe(
      "https://incubation.w3.org/groups/wicg/specs/#foo"
    );
  });

  it("keeps the level in the fragment, as the metadata lookup key does", () => {
    expect(snapshotsIndex({ group: "wicg", shortName: "foo-2" })).toBe(
      "https://incubation.w3.org/groups/wicg/specs/#foo-2"
    );
  });

  it("gives no address for a joint publication", () => {
    expect(
      snapshotsIndex({ group: ["wicg", "webapps"], shortName: "foo" })
    ).toBe("");
  });

  it("gives no address when either half is missing", () => {
    expect(snapshotsIndex({ shortName: "foo" })).toBe("");
    expect(snapshotsIndex({ group: "wicg" })).toBe("");
    expect(snapshotsIndex({})).toBe("");
  });

  it("escapes values that would otherwise change the URL's shape", () => {
    expect(snapshotsIndex({ group: "a b", shortName: "c#d" })).toBe(
      "https://incubation.w3.org/groups/a%20b/specs/#c%23d"
    );
  });
});
