"use strict";
describe("Core - biblioDB", () => {
  const data = {
    "whatwg-dom": {
      "aliasOf": "WHATWG-DOM"
    },
    "WHATWG-DOM": {
      "authors": [
        "Anne van Kesteren"
      ],
      "href": "https://dom.spec.whatwg.org/",
      "title": "DOM Standard",
      "status": "Living Standard",
      "publisher": "WHATWG",
      "id": "WHATWG-DOM"
    },
    "addAllTest": {
      "id": "ADD-ALL-TEST",
      "title": "ADD ALL TEST",
    },
    "DAHU": {
      "aliasOf": "DAHUT",
    },
    "DAHUT": {
      "authors": [
        "Robin Berjon"
      ],
      "etAl": true,
      "title": "The Dahut Specification Example From the Higher Circle",
      "date": "15 March 1977",
      "status": "Lazy Daft (Work for progress)",
      "href": "http://berjon.com/",
      "versions": [
        "DAHUT-TEST6",
        "DAHUT-TEST5",
        "DAHUT-TEST4",
        "DAHUT-TEST3",
        "DAHUT-TEST2",
        "DAHUT-TEST1"
      ],
      "id": "DAHUT",
    }
  };
  var biblioDB;
  beforeAll((done) => {
    require(["core/biblio-db", "deps/regenerator"], ({ biblioDB: db }) => {
      biblioDB = db;
      done();
    });
  });
  describe("ready getter", () => {
    it("resolves with a IDB database", (done) => {
      biblioDB.ready.then((db) => {
        expect(db instanceof window.IDBDatabase).toBe(true);
      }).then(done);
    });
  });
  describe("add() method", () => {
    it("rejects when adding bad types", (done) => {
      biblioDB.add("invalid", "bar").catch(
        err => expect(err instanceof TypeError).toBe(true)
      ).then(done);
    });
    it("rejects when adding empty type", (done) => {
      biblioDB.add("", "ref").catch(
        err => expect(err instanceof TypeError).toBe(true)
      ).then(done);
    });
    it("adds single reference", (done) => {
      biblioDB.add("reference", {
          "authors": [
            "Test Author"
          ],
          "href": "https://test/",
          "title": "test spec",
          "status": "Living Standard",
          "publisher": "W3C",
          "id": "test123"
        }).then(
          () => biblioDB.has("reference", "test123")
        )
        .then(
          result => expect(result).toBe(true)
        )
        .then(done);
    });
  });
  describe("addAll() method", () => {
    it("adds both aliases and references", (done) => {
      biblioDB
        .addAll(data)
        .then(
          () => Promise.all([
            biblioDB.has("alias", "whatwg-dom"),
            biblioDB.has("reference", "ADD-ALL-TEST"),
            biblioDB.has("reference", "WHATWG-DOM"),
          ])
        ).then(
          results => expect(results.every(v => v === true)).toBe(true)
        ).then(
          done
        );
    });
  });
  describe("get() method", () => {
    it("rejects when getting invalid type", (done) => {
      biblioDB.get("invalid", "bar").catch(
        err => expect(err instanceof TypeError).toBe(true)
      ).then(done);
    });
    it("rejects when id is missing", (done) => {
      biblioDB.get("invalid").catch(
        err => expect(err instanceof TypeError).toBe(true)
      ).then(done);
    });
    it("retrieves a reference", (done) => {
      biblioDB.add("reference", {
          "href": "https://test/",
          "title": "PASS",
          "publisher": "W3C",
          "id": "get-ref-test"
        }).then(
          () => biblioDB.get("reference", "get-ref-test")
        )
        .then(
          entry => expect(entry.title).toEqual("PASS")
        )
        .then(done);
    });
    it("retrieves an alias", (done) => {
      biblioDB.add("alias", {
          "id": "ALIAS-GET-TEST",
          "aliasOf": "PASS",
        }).then(
          () => biblioDB.get("alias", "ALIAS-GET-TEST")
        )
        .then(
          entry => expect(entry.aliasOf).toEqual("PASS")
        )
        .then(done);
    });
    it("returns null when it can't find an entry", (done) => {
      Promise.all([
          biblioDB.get("reference", "does not exist"),
          biblioDB.get("alias", "does not exist"),
        ])
        .then(
          results => expect(results.every(v => v === null)).toBe(true)
        )
        .then(done);
    });
  });
  describe("has() method", () => {
    it("rejects on invalid type", (done) => {
      biblioDB.has("invalid", "bar").catch(
        err => expect(err instanceof TypeError).toBe(true)
      ).then(done);
    });
    it("rejects when id is missing", (done) => {
      biblioDB.has("invalid").catch(
        err => expect(err instanceof TypeError).toBe(true)
      ).then(done);
    });
    it("returns true when entries exist", (done) => {
      Promise.all(
          [
            biblioDB.add("reference", {
              id: "has-ref-test",
              "title": "pass",
            }),
            biblioDB.add("alias", {
              id: "has-alias-test",
              "aliasOf": "pass",
            })
          ]).then(
          () => Promise.all([
            biblioDB.has("reference", "has-ref-test"),
            biblioDB.has("alias", "has-alias-test"),
          ])
        )
        .then(
          result => expect(result.every(v => v === true)).toBe(true)
        )
        .then(done);
    });
    it("returns false when entries don't exist", (done) => {
      Promise.all([
          biblioDB.has("reference", "does not exist"),
          biblioDB.has("alias", "does not exist"),
        ])
        .then(
          result => expect(result.every(v => v === false)).toBe(true)
        )
        .then(done);
    });
  });
  describe("isAlias() method", () => {
    it("rejects if passed a bad id", (done) => {
      var p1 = biblioDB.isAlias();
      var p2 = biblioDB.isAlias(null);
      var p3 = biblioDB.isAlias("");
      Promise.all([
        p1.catch(err => expect(err instanceof TypeError).toBe(true)),
        p2.catch(err => expect(err instanceof TypeError).toBe(true)),
        p3.catch(err => expect(err instanceof TypeError).toBe(true)),
      ]).then(done);
    });
    it("returns true when it is an alias", (done) => {
      biblioDB
        .add("alias", { aliasOf: "isAlias", id: "test-isAlias-pass" })
        .then(
          () => biblioDB.isAlias("test-isAlias-pass")
        ).then(
          result => expect(result).toBe(true)
        ).then(
          done
        );
    });
    it("returns false when it is not an alias", (done) => {
      biblioDB
        .isAlias("not an alias")
        .then(result => expect(result).toBe(false))
        .then(done);
    });
  });
  describe("find() method", () => {
    it("rejects if passed a bad id", (done) => {
      var p1 = biblioDB.find();
      var p2 = biblioDB.find(null);
      var p3 = biblioDB.find("");
      Promise.all([
        p1.catch(err => expect(err instanceof TypeError).toBe(true)),
        p2.catch(err => expect(err instanceof TypeError).toBe(true)),
        p3.catch(err => expect(err instanceof TypeError).toBe(true)),
      ]).then(done);
    });
    it("finds a references and resolves aliases", (done) => {
      biblioDB
        .addAll(data)
        .then(
          () => biblioDB.find("DAHU")
        )
        .then(
          result => expect(result.id).toEqual("DAHUT")
        )
        .then(
          () => biblioDB.find("whatwg-dom") // alias
        )
        .then(
          result => expect(result.title).toEqual("DOM Standard")
        )
        .then(
          done
        );
    });
  });
  describe("resolveAlias() method", () => {
    it("rejects if passed a bad id", (done) => {
      var p1 = biblioDB.resolveAlias();
      var p2 = biblioDB.resolveAlias(null);
      var p3 = biblioDB.resolveAlias("");
      Promise.all([
        p1.catch(err => expect(err instanceof TypeError).toBe(true)),
        p2.catch(err => expect(err instanceof TypeError).toBe(true)),
        p3.catch(err => expect(err instanceof TypeError).toBe(true)),
      ]).then(done);
    });
    it("resolves known aliases or return null when alias is unknown", (done) => {
      biblioDB
        .addAll(data)
        .then(
          () => biblioDB.resolveAlias("whatwg-dom")
        )
        .then(
          result => expect(result).toEqual("WHATWG-DOM")
        )
        .then(
          () => biblioDB.resolveAlias("does not exist")
        )
        .then(
          result => expect(result).toBe(null)
        )
        .then(
          done
        );
    });
  });
  describe("close() method", () => {

  });
});
