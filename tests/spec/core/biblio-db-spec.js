"use strict";

import { biblioDB } from "../../../src/core/biblio-db.js";

describe("Core - biblioDB", () => {
  const data = {
    "whatwg-dom": {
      aliasOf: "WHATWG-DOM",
    },
    "WHATWG-DOM": {
      authors: ["Anne van Kesteren"],
      href: "https://dom.spec.whatwg.org/",
      title: "DOM Standard",
      status: "Living Standard",
      publisher: "WHATWG",
      id: "WHATWG-DOM",
    },
    addAllTest: {
      id: "ADD-ALL-TEST",
      title: "ADD ALL TEST",
    },
    DAHU: {
      aliasOf: "DAHUT",
    },
    DAHUT: {
      authors: ["Robin Berjon"],
      etAl: true,
      title: "The Dahut Specification Example From the Higher Circle",
      date: "15 March 1977",
      status: "Lazy Daft (Work for progress)",
      href: "http://berjon.com/",
      versions: [
        "DAHUT-TEST6",
        "DAHUT-TEST5",
        "DAHUT-TEST4",
        "DAHUT-TEST3",
        "DAHUT-TEST2",
        "DAHUT-TEST1",
      ],
      id: "DAHUT",
    },
  };

  describe("ready getter", () => {
    it("resolves with a IDB database", async () => {
      const db = await biblioDB.ready;
      expect(db instanceof window.IDBDatabase).toBe(true);
    });
  });

  describe("add() method", () => {
    it("rejects when adding bad types", async () => {
      try {
        await biblioDB.add("invalid", "bar");
      } catch (err) {
        expect(err instanceof TypeError).toBe(true);
      }
    });

    it("rejects when adding empty type", async () => {
      try {
        await biblioDB.add("", "ref");
      } catch (err) {
        expect(err instanceof TypeError).toBe(true);
      }
    });

    it("adds single reference", async () => {
      await biblioDB.add("reference", {
        authors: ["Test Author"],
        href: "https://test/",
        title: "test spec",
        status: "Living Standard",
        publisher: "W3C",
        id: "test123",
      });
      const result = await biblioDB.has("reference", "test123");
      expect(result).toBe(true);
    });
  });

  describe("addAll() method", () => {
    it("adds both aliases and references", async () => {
      await biblioDB.addAll(data);
      const results = await Promise.all([
        biblioDB.has("alias", "whatwg-dom"),
        biblioDB.has("reference", "ADD-ALL-TEST"),
        biblioDB.has("reference", "WHATWG-DOM"),
      ]);
      expect(results.every(v => v === true)).toBe(true);
    });
  });

  describe("get() method", () => {
    it("rejects when getting invalid type", async () => {
      try {
        await biblioDB.get("invalid", "bar");
      } catch (err) {
        expect(err instanceof TypeError).toBe(true);
      }
    });

    it("rejects when id is missing", async () => {
      try {
        await biblioDB.get("invalid");
      } catch (err) {
        expect(err instanceof TypeError).toBe(true);
      }
    });

    it("retrieves a reference", async () => {
      await biblioDB.add("reference", {
        href: "https://test/",
        title: "PASS",
        publisher: "W3C",
        id: "get-ref-test",
      });

      const entry = await biblioDB.get("reference", "get-ref-test");
      expect(entry.title).toBe("PASS");
    });

    it("retrieves an alias", async () => {
      await biblioDB.add("alias", {
        id: "ALIAS-GET-TEST",
        aliasOf: "PASS",
      });
      const entry = await biblioDB.get("alias", "ALIAS-GET-TEST");
      expect(entry.aliasOf).toBe("PASS");
    });

    it("returns null when it can't find an entry", async () => {
      const results = await Promise.all([
        biblioDB.get("reference", "does not exist"),
        biblioDB.get("alias", "does not exist"),
      ]);
      expect(results.every(v => v === null)).toBe(true);
    });
  });

  describe("has() method", () => {
    it("rejects on invalid type", async () => {
      try {
        await biblioDB.has("invalid", "bar");
      } catch (err) {
        expect(err instanceof TypeError).toBe(true);
      }
    });

    it("rejects when id is missing", async () => {
      try {
        await biblioDB.has("invalid");
      } catch (err) {
        expect(err instanceof TypeError).toBe(true);
      }
    });

    it("returns true when entries exist", async () => {
      await Promise.all([
        biblioDB.add("reference", {
          id: "has-ref-test",
          title: "pass",
        }),
        biblioDB.add("alias", {
          id: "has-alias-test",
          aliasOf: "pass",
        }),
      ]);
      const results = await Promise.all([
        biblioDB.has("reference", "has-ref-test"),
        biblioDB.has("alias", "has-alias-test"),
      ]);
      expect(results.every(v => v === true)).toBe(true);
    });

    it("returns false when entries don't exist", async () => {
      const results = await Promise.all([
        biblioDB.has("reference", "does not exist"),
        biblioDB.has("alias", "does not exist"),
      ]);
      expect(results.every(v => v === false)).toBe(true);
    });
  });

  describe("isAlias() method", () => {
    it("rejects if passed a bad id", async () => {
      const p1 = biblioDB.isAlias();
      const p2 = biblioDB.isAlias(null);
      const p3 = biblioDB.isAlias("");
      await Promise.all([
        p1.catch(err => expect(err instanceof TypeError).toBe(true)),
        p2.catch(err => expect(err instanceof TypeError).toBe(true)),
        p3.catch(err => expect(err instanceof TypeError).toBe(true)),
      ]);
    });

    it("returns true when it is an alias", async () => {
      await biblioDB.add("alias", {
        aliasOf: "isAlias",
        id: "test-isAlias-pass",
      });
      const result = await biblioDB.isAlias("test-isAlias-pass");
      expect(result).toBe(true);
    });

    it("returns false when it is not an alias", async () => {
      const result = await biblioDB.isAlias("not an alias");
      expect(result).toBe(false);
    });
  });

  describe("find() method", () => {
    it("rejects if passed a bad id", async () => {
      const p1 = biblioDB.find();
      const p2 = biblioDB.find(null);
      const p3 = biblioDB.find("");
      await Promise.all([
        p1.catch(err => expect(err instanceof TypeError).toBe(true)),
        p2.catch(err => expect(err instanceof TypeError).toBe(true)),
        p3.catch(err => expect(err instanceof TypeError).toBe(true)),
      ]);
    });

    it("finds a references and resolves aliases", async () => {
      await biblioDB.addAll(data);
      const r1 = await biblioDB.find("DAHU");
      expect(r1.id).toBe("DAHUT");
      const r2 = await biblioDB.find("whatwg-dom"); // alias
      expect(r2.title).toBe("DOM Standard");
    });
  });

  describe("resolveAlias() method", () => {
    it("rejects if passed a bad id", async () => {
      const p1 = biblioDB.resolveAlias();
      const p2 = biblioDB.resolveAlias(null);
      const p3 = biblioDB.resolveAlias("");
      await Promise.all([
        p1.catch(err => expect(err instanceof TypeError).toBe(true)),
        p2.catch(err => expect(err instanceof TypeError).toBe(true)),
        p3.catch(err => expect(err instanceof TypeError).toBe(true)),
      ]);
    });

    it("resolves known aliases or return null when alias is unknown", async () => {
      await biblioDB.addAll(data);
      const alias = await biblioDB.resolveAlias("whatwg-dom");
      expect(alias).toBe("WHATWG-DOM");
      const noAlias = await biblioDB.resolveAlias("does not exist");
      expect(noAlias).toBeNull();
    });
  });

  describe("close() method", () => {});

  describe("clear() method", () => {
    it("clears entire database", async () => {
      await biblioDB.add("reference", {
        title: "will be deleted",
        id: "get-ref-test",
      });

      const entryBeforeClear = await biblioDB.has("reference", "get-ref-test");
      expect(entryBeforeClear).toBeTruthy();

      await biblioDB.clear();

      const entryAfterClear = await biblioDB.has("reference", "get-ref-test");
      expect(entryAfterClear).toBeFalsy();
    });
  });
});
