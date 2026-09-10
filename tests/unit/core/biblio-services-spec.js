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

  // A Specref that connects and never replies is the case the mirror exists for, and the
  // whole exchange has to finish inside one spec's budget or the rescue is worthless. This
  // spec sets its own budget rather than reading jasmine's, so raising the module's timeout
  // back to the default fails here instead of failing whichever spec happened to be slow.
  it("reaches the mirror well inside a spec budget when Specref hangs", async () => {
    const BUDGET_MS = 3000;
    /** Rejects the hanging request, standing in for its abort. */
    let giveUpOnSpecref;
    window.fetch = (url, { signal } = {}) => {
      attempted.push(String(url).split("?")[0]);
      if (!String(url).startsWith(SPECREF)) {
        return Promise.resolve(jsonResponse(ENTRY));
      }
      // Connects and never replies, but honors the abort the module arms it with. Ignoring
      // the signal here would hang past any budget and say nothing about the timeout.
      return new Promise((_resolve, reject) => {
        giveUpOnSpecref = () => reject(new Error("hanging request abandoned"));
        signal?.addEventListener("abort", () => reject(signal.reason));
      });
    };

    const update = updateFromNetwork(["TESTREF"]);
    const started = performance.now();
    await Promise.race([
      update,
      new Promise(resolve =>
        setTimeout(() => {
          // Over budget means the module is still waiting on Specref. Cut it loose so the
          // fallback runs against this stub: leaving it pending would let the real `fetch`,
          // restored in `afterEach`, serve the mirror from the network mid-suite.
          giveUpOnSpecref?.();
          resolve();
        }, BUDGET_MS)
      ),
    ]);
    const elapsed = performance.now() - started;
    const data = await update;

    expect(elapsed).toBeLessThan(BUDGET_MS);
    expect(data).toEqual(ENTRY);
    expect(attempted).toEqual([SPECREF, MIRROR]);
  });
});
