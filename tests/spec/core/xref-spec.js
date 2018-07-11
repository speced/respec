"use strict";
describe("Core — xref", () => {
  afterAll(flushIframes);

  const apiURL = location.origin + "/tests/data/xref.json";
  const localBiblio = {
    html: {
      href: "https://html.spec.whatwg.org/multipage/",
      id: "HTML",
    },
    "service-workers": {
      href: "https://www.w3.org/TR/service-workers-1/",
      id: "service-workers-1",
    },
    infra: {
      href: "https://infra.spec.whatwg.org/",
      id: "INFRA",
    },
  };
  const expectedLinks = new Map([
    [
      "event handler",
      "https://html.spec.whatwg.org/multipage/webappapis.html#event-handlers",
    ],
    ["list", "https://infra.spec.whatwg.org/#list"],
    [
      "sw-fetch",
      "https://www.w3.org/TR/service-workers-1/#service-worker-global-scope-fetch-event",
    ],
    ["uppercase", "https://infra.spec.whatwg.org/#ascii-uppercase"],
    ["url parser", "https://url.spec.whatwg.org/#concept-url-parser"],
    ["object-idl", "https://heycam.github.io/webidl/#idl-object"],
    [
      "object-html",
      "https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-object-element",
    ],
  ]);

  it("does nothing if xref is not enabled", async () => {
    const body = `<a id="external-link">event handler</a>`;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const link = doc.getElementById("external-link");
    expect(link.getAttribute("href")).toBeFalsy();
  });

  it("adds link to unique <a> terms", async () => {
    const body = `<section><a id="external-link">event handler</a></section>`;
    const config = { xref: { url: apiURL }, localBiblio };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const link = doc.getElementById("external-link");
    expect(link.href).toEqual(expectedLinks.get("event handler"));
    expect(link.classList.contains("respec-offending-element")).toBeFalsy();

    // test: adds citation in references section
    const ref = doc.querySelector("#references dt");
    expect(ref).toBeTruthy();
    expect(ref.textContent.toLowerCase()).toEqual("[html]");
  });

  it("fails to add link to non-existing terms", async () => {
    const body = `<section><a id="external-link">NOT_FOUND</a></section>`;
    const config = { xref: { url: apiURL } };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const link = doc.getElementById("external-link");
    expect(link.classList.contains("respec-offending-element")).toBeTruthy();
    expect(link.getAttribute("href")).toBeFalsy();
    expect(link.title).toEqual("Error: No matching dfn found.");
  });

  it("uses data-cite to disambiguate results", async () => {
    const body = `
      <section data-cite="service-workers" id="links">
        <p><a>fetch</a> is defined once in service-workers and twice in fetch spec. It uses parent's data-cite.</p>

        <p>As <a data-cite="!infra">ASCII uppercase</a> is valid dfn, it resolves to fragment. a local data-cite (infra) overrides parent's datacite.</p>

        <p>As <a data-cite="!infra">ASCII uppercasing</a> doesn't exist in INFRA, it resolves to spec only.</p>

        <p id="dfns">external dfn:
          <dfn data-cite="!html">event handler</dfn> exists in html.
          Cannot find <dfn>URL parser</dfn> in service-workers.
        </p>
      </section>
    `;
    // using default API url here as xref.json cannot disambiguate
    const config = { xref: true, localBiblio };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const [link1, link2, link3] = [...doc.querySelectorAll("#links a")];

    expect(link1.classList.contains("respec-offending-element")).toBeFalsy();
    expect(link1.getAttribute("href")).toEqual(expectedLinks.get("sw-fetch"));

    expect(link2.classList.contains("respec-offending-element")).toBeFalsy();
    expect(link2.getAttribute("href")).toEqual(expectedLinks.get("uppercase"));

    expect(link3.classList.contains("respec-offending-element")).toBeFalsy();
    expect(link3.getAttribute("href")).toEqual(
      "https://infra.spec.whatwg.org/"
    );

    const [dfn1, dfn2] = [...doc.querySelectorAll("#dfns dfn")];
    const dfn1link = dfn1.querySelector("a");
    expect(dfn1link).toBeTruthy();
    expect(dfn1link.getAttribute("href")).toEqual(
      expectedLinks.get("event handler")
    );
    expect(dfn1.classList.contains("respec-offending-element")).toBeFalsy();

    const dfn2link = dfn2.querySelector("a");
    expect(dfn2link).toBeFalsy();
    expect(dfn2.classList.contains("respec-offending-element")).toBeTruthy();

    const refs = [...doc.querySelectorAll("#references dt")].map(
      dt => dt.textContent
    );
    expect(refs.length).toEqual(3);
    expect(refs.sort()).toEqual(["[html]", "[infra]", "[service-workers]"]);
  });

  it("doesn't lookup for local references externally", async () => {
    const body = `
      <section id="test">
        <!-- local links have empty el.closest() data-cite -->
        <section data-cite="">
          <dfn>local dfn</dfn>
          <p id="externalDfn1">
            External DFN <dfn data-cite="webidl">dictionary</dfn>
          </p>
          This should be a local link: <a id="local1">local dfn</a>.
          External link: <a id="external1" data-cite="url">URL parser</a>.
        </section>
        This is also a local: <a data-cite="" id="local2">local dfn</a>.
        <section>
          <a id="local3">local dfn</a>.
          Another external link: <a id="external2">event handler</a>.
          <p id="externalDfn2">
            Another external dfn: <dfn>fully active</dfn> from html.
          </p>
        </section>
      </section>
    `;
    const config = { xref: true, localBiblio };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const local1 = doc.getElementById("local1");
    const local2 = doc.getElementById("local2");
    const local3 = doc.getElementById("local3");

    const links = [...doc.querySelectorAll("#test a")];
    expect(
      links.every(
        link => link.classList.contains("respec-offending-element") === false
      )
    ).toBeTruthy();

    expect(local1.getAttribute("href")).toEqual("#dfn-local-dfn");
    expect(local2.getAttribute("href")).toEqual("#dfn-local-dfn");
    expect(local3.getAttribute("href")).toEqual("#dfn-local-dfn");

    const external1 = doc.getElementById("external1");
    const external2 = doc.getElementById("external2");
    expect(external1.getAttribute("href")).toEqual(
      expectedLinks.get("url parser")
    );
    expect(external2.getAttribute("href")).toEqual(
      expectedLinks.get("event handler")
    );

    const externalDfn1 = doc.querySelector("#externalDfn1 dfn");
    const externalDfn2 = doc.querySelector("#externalDfn2 dfn");
    expect(externalDfn1.querySelector("a")).toBeTruthy();
    expect(externalDfn1.querySelector("a").getAttribute("href")).toEqual(
      "https://heycam.github.io/webidl/#dfn-dictionary"
    );
    expect(externalDfn2.querySelector("a")).toBeTruthy();
    expect(externalDfn2.querySelector("a").getAttribute("href")).toEqual(
      "https://html.spec.whatwg.org/multipage/browsers.html#fully-active"
    );
  });

  it("shows error if cannot resolve by data-cite", async () => {
    const body = `
      <section data-cite="fetch">
        <a id="link">fetch</a> is defined once in service-workers and twice in fetch spec.
      </section>
    `;
    const config = { xref: { url: apiURL }, localBiblio };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const link = doc.getElementById("link");
    expect(link.classList.contains("respec-offending-element")).toBeTruthy();
    expect(link.title).toEqual("Error: Linking an ambiguous dfn.");
  });

  it("disambiguates response based on context", async () => {
    // https://github.com/w3c/respec/pull/1750
    const body = `
      <section id="test">
        <p data-cite="webidl"><a id="one">object</a></p>
        <p data-cite="html"><a id="two">object</a></p>
        <p data-cite="html">
          <a id="three" data-cite="webidl">object</a> (overrides parent)
          <a id="four">object</a> (uses parent's data-cite)
        </p>
        <a id="five" data-cite="">object</a> (should have a local dfn)
        <a id="six" data-cite="NOT-FOUND">object</a>
      </section>
    `;
    const config = { xref: { url: apiURL }, localBiblio };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const [one, two, three, four, five, six] = [
      ...doc.querySelectorAll("#test a"),
    ];

    expect(one.href).toEqual(expectedLinks.get("object-idl"));
    expect(two.href).toEqual(expectedLinks.get("object-html"));
    expect(three.href).toEqual(expectedLinks.get("object-idl"));
    expect(four.href).toEqual(expectedLinks.get("object-html"));

    expect(five.href).toEqual("");
    expect(five.classList.contains("respec-offending-element")).toBeTruthy();
    expect(five.title).toEqual("Error: No matching dfn found.");
    expect(six.href).toEqual("");
    expect(six.classList.contains("respec-offending-element")).toBeTruthy();
    expect(six.title).toEqual(`Couldn't find a match for "NOT-FOUND".`);
  });

  it("takes data-lt into account", async () => {
    const body = `
      <section id="test1">
        <a data-lt="list">list stuff</a>
      </section>
      <section id="test2">
        <dfn data-lt="event handler|foo">handling event</dfn>
        <a>event handler</a>
        <a>handling event</a>
        <a>foo</a>
      </section>
    `;
    const config = { xref: { url: apiURL }, localBiblio };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const link = doc.querySelector("#test1 a");
    expect(link.getAttribute("href")).toEqual(expectedLinks.get("list"));

    const dfn = doc.querySelector("#test2 dfn");
    expect(dfn.id).toEqual("dfn-event-handler");
    const links = [...doc.querySelectorAll("#test2 a")];
    expect(links.length).toEqual(4);
    expect(
      links.every(link => link.href === expectedLinks.get("event handler"))
    ).toBeTruthy();
    expect(
      links.every(
        link => link.classList.contains("respec-offending-element") === false
      )
    ).toBeTruthy();
  });

  it("takes pluralization into account", async () => {
    const body = `
      <section id="test">
        <dfn data-lt="event handler|event handling">handling event</dfn>
        <a>event handler</a>
        <a>event handlers</a>
        <a>handling event</a>
        <a>handling events</a>
        <a>event handling</a>
      </section>
    `;
    const config = { xref: { url: apiURL }, localBiblio, pluralize: true };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const dfn = doc.querySelector("#test dfn");
    expect(dfn.id).toEqual("dfn-event-handler");
    const links = [...doc.querySelectorAll("#test a")];
    expect(links.length).toEqual(6);
    expect(
      links.every(link => link.href === expectedLinks.get("event handler"))
    ).toBeTruthy();
    expect(
      links.every(
        link => link.classList.contains("respec-offending-element") === false
      )
    ).toBeTruthy();
  });

  it("uses inline references to provide context", async () => {
    const body = `
      <section id="test">
        <section>
          <p>Uses [[WEBIDL]] to create context for <a id="one">object</a></p>
        </section>
        <section>
          <p>Uses [[html]] to create context for <a id="two">object</a></p>
        </section>
        <section>
          <p>Uses [[html]] and [[webidl]] to create context for <a id="three">object</a>. It fails as it's defined in both.</p>
        </section>
        <section>
          <p>But data-cite on element itself wins. <a id="four">object</a> uses [[webidl]],
          whereas <a data-cite="html" id="five">object</a> uses html.</p>
        </section>
      </section>
    `;
    const config = { xref: true, localBiblio };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const expectedLink1 = "https://heycam.github.io/webidl/#idl-object";
    const expectedLink2 =
      "https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-object-element";

    const link1 = doc.getElementById("one");
    const link2 = doc.getElementById("two");
    const link3 = doc.getElementById("three");
    const link4 = doc.getElementById("four");
    const link5 = doc.getElementById("five");

    expect(link1.href).toEqual(expectedLink1);
    expect(link2.href).toEqual(expectedLink2);
    expect(link3.href).toEqual("");
    expect(link4.href).toEqual(expectedLink1);
    expect(link5.href).toEqual(expectedLink2);

    expect(link1.classList.contains("respec-offending-element")).toBeFalsy();
    expect(link2.classList.contains("respec-offending-element")).toBeFalsy();
    expect(link3.classList.contains("respec-offending-element")).toBeTruthy();
    expect(link4.classList.contains("respec-offending-element")).toBeFalsy();
    expect(link5.classList.contains("respec-offending-element")).toBeFalsy();
  });
});
