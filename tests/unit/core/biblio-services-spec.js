"use strict";

import { updateFromNetwork } from "/src/core/biblio.js";

const SPECREF = "https://api.specref.org/bibrefs";
const MIRROR = "https://respec.org/bibrefs";

const ENTRY = {
  TESTREF: { id: "TESTREF", title: "Test", href: "https://e.com/" },
};

describe("Core - biblio bibliography services", () => {
  let realFetch;
  let attempted;

  beforeEach(() => {
    realFetch = window.fetch;
    attempted = [];
  });

  afterEach(() => {
    window.fetch = realFetch;
  });

  /** @param {(url: string) => Response | Error} answer */
  function stubFetch(answer) {
    window.fetch = url => {
      attempted.push(String(url).split("?")[0]);
      const result = answer(String(url));
      return result instanceof Error
        ? Promise.reject(result)
        : Promise.resolve(result);
    };
  }

  function jsonResponse(body) {
    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  it("asks Specref first and does not ask the mirror when it answers", async () => {
    stubFetch(() => jsonResponse(ENTRY));
    const data = await updateFromNetwork(["TESTREF"]);
    expect(data).toEqual(ENTRY);
    expect(attempted).toEqual([SPECREF]);
  });

  it("falls back to the mirror when Specref cannot be reached", async () => {
    stubFetch(url =>
      url.startsWith(SPECREF) ? new Error("network") : jsonResponse(ENTRY)
    );
    const data = await updateFromNetwork(["TESTREF"]);
    expect(data).toEqual(ENTRY);
    expect(attempted).toEqual([SPECREF, MIRROR]);
  });

  it("falls back to the mirror when Specref answers with an error status", async () => {
    stubFetch(url =>
      url.startsWith(SPECREF)
        ? new Response("nope", { status: 503 })
        : jsonResponse(ENTRY)
    );
    const data = await updateFromNetwork(["TESTREF"]);
    expect(data).toEqual(ENTRY);
    expect(attempted).toEqual([SPECREF, MIRROR]);
  });

  it("falls back to the mirror when Specref answers 200 with something other than JSON", async () => {
    stubFetch(url =>
      url.startsWith(SPECREF)
        ? new Response("<html>Gateway</html>", {
            status: 200,
            headers: { "Content-Type": "text/html" },
          })
        : jsonResponse(ENTRY)
    );
    const data = await updateFromNetwork(["TESTREF"]);
    expect(data).toEqual(ENTRY);
    expect(attempted).toEqual([SPECREF, MIRROR]);
  });

  it("gives up when neither service answers", async () => {
    stubFetch(() => new Error("network"));
    const data = await updateFromNetwork(["TESTREF"]);
    expect(data).toBeNull();
    expect(attempted).toEqual([SPECREF, MIRROR]);
  });
});
