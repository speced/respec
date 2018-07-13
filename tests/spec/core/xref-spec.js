"use strict";
describe("Core — xref", () => {
  afterAll(flushIframes);

  const apiURL = location.origin + "/tests/data/xref.json";
  const localBiblio = {
    html: { id: "HTML", href: "https://html.spec.whatwg.org/multipage/" },
    "service-workers": {
      id: "service-workers-1",
      href: "https://www.w3.org/TR/service-workers-1/",
    },
    infra: { id: "INFRA", href: "https://infra.spec.whatwg.org/" },
    "local-1": { id: "local-1", href: "https://example.com/" },
    "local-2": { id: "local-2", href: "https://example.com/" },
    "local-3": { id: "local-3", href: "https://example.com/" },
    "local-4": { id: "local-4", href: "https://example.com/" },
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
    ["dictionary", "https://heycam.github.io/webidl/#dfn-dictionary"],
    ["alphanumeric", "https://infra.spec.whatwg.org/#ascii-alphanumeric"],
    [
      "object-html",
      "https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-object-element",
    ],
    ["exception", "https://heycam.github.io/webidl/#dfn-exception"],
  ]);

  it("does nothing if xref is not enabled", async () => {
    const body = `<a id="external-link">event handler</a>`;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const link = doc.getElementById("external-link");
    expect(link.getAttribute("href")).toBeFalsy();
  });

  it("adds link to unique external terms", async () => {
    const body = `
      <section>
        <p id="external-link"><a>event handler</a><p>
        <p id="external-dfn"><dfn class="externalDFN">URL parser</dfn></p>
      </section>`;
    const config = { xref: { url: apiURL }, localBiblio };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const link = doc.querySelector("#external-link a");
    expect(link.href).toEqual(expectedLinks.get("event handler"));
    expect(link.classList.contains("respec-offending-element")).toBeFalsy();

    const dfn = doc.querySelector("#external-dfn dfn a");
    expect(dfn.href).toEqual(expectedLinks.get("url parser"));
    expect(dfn.classList.contains("respec-offending-element")).toBeFalsy();
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
      </section>
      <section id="dfns" data-cite="service-workers">
        <p><dfn data-cite="!html">event handler</dfn> exists in html</p>
        <p>Cannot find <dfn class="externalDFN">URL parser</dfn> in service-workers.</p>
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

    expect(dfn1.classList.contains("respec-offending-element")).toBeFalsy();
    const dfn1link = dfn1.querySelector("a");
    expect(dfn1link).toBeTruthy();
    expect(dfn1link.getAttribute("href")).toEqual(
      expectedLinks.get("event handler")
    );

    expect(dfn2.classList.contains("respec-offending-element")).toBeTruthy();
    expect(dfn2.title).toEqual("Error: No matching dfn found.");
    const dfn2link = dfn2.querySelector("a");
    expect(dfn2link).toBeFalsy();
  });

  it("doesn't lookup for local references externally", async () => {
    const body = `
      <section id="test">
        <section data-cite=""> <!-- empty data-cite on parent -->
          <p id="local-dfn-1"><dfn>local one</dfn></p>
          <p id="local-dfn-2"><dfn data-cite="html#hello">hello</dfn></p>
          <p id="external-dfn-1"><dfn data-cite="webidl">dictionary</dfn></p>
          <p id="external-dfn-2"><dfn class="externalDFN">exception</dfn></p>
          <p id="local-link-1"><a>local one</a></p>
          <p id="external-link-1"><a data-cite="url">URL parser</a></p>
        </section>
        <section> <!-- no empty data-cite on parent -->
          <p id="local-dfn-3"><dfn>local two</dfn></p>
          <p id="local-dfn-4"><dfn data-cite="html#world">world</dfn></p>
          <p id="external-dfn-3"><dfn class="externalDFN">queue a task</dfn></p>
          <p id="external-dfn-4"><dfn data-cite="infra">list</dfn></p>
          <p id="local-link-2" data-cite="html">
            <a data-cite="">local two</a>
          </p>
          <p id="local-link-3"><a>local two</a></p>
          <p id="external-link-2"><a>event handler</a></p>
        </section>
      </section>
    `;
    const config = { xref: true, localBiblio };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const offendingElements = doc.querySelectorAll(
      "#test .respec-offending-element"
    );
    expect(offendingElements.length).toEqual(0);

    const localDfn1 = doc.querySelector("#local-dfn-1");
    const localDfn2 = doc.querySelector("#local-dfn-2 a");
    const externalDfn1 = doc.querySelector("#external-dfn-1 a");
    const externalDfn2 = doc.querySelector("#external-dfn-2 a");
    const localLink1 = doc.querySelector("#local-link-1 a");
    const externalLink1 = doc.querySelector("#external-link-1 a");
    const localDfn3 = doc.querySelector("#local-dfn-3");
    const localDfn4 = doc.querySelector("#local-dfn-4 a");
    const externalDfn3 = doc.querySelector("#external-dfn-3 a");
    const externalDfn4 = doc.querySelector("#external-dfn-4 a");
    const localLink2 = doc.querySelector("#local-link-2 a");
    const localLink3 = doc.querySelector("#local-link-3 a");
    const externalLink2 = doc.querySelector("#external-link-2 a");

    expect(localDfn1.querySelector("a")).toBeFalsy();
    expect(localDfn1.querySelector("dfn").id).toEqual("dfn-local-one");
    expect(localDfn2.href).toEqual(
      "https://html.spec.whatwg.org/multipage/#hello"
    );
    expect(externalDfn1.href).toEqual(expectedLinks.get("dictionary"));
    expect(externalDfn2.href).toEqual(expectedLinks.get("exception"));
    expect(localLink1.getAttribute("href")).toEqual("#dfn-local-one");
    expect(externalLink1.href).toEqual(expectedLinks.get("url parser"));
    expect(localDfn3.querySelector("a")).toBeFalsy();
    expect(localDfn3.querySelector("dfn").id).toEqual("dfn-local-two");
    expect(localDfn4.href).toEqual(
      "https://html.spec.whatwg.org/multipage/#world"
    );
    expect(externalDfn3.href).toEqual(
      "https://html.spec.whatwg.org/multipage/webappapis.html#queue-a-task"
    );
    expect(externalDfn4.href).toEqual(expectedLinks.get("list"));
    expect(localLink2.getAttribute("href")).toEqual("#dfn-local-two");
    expect(localLink3.getAttribute("href")).toEqual("#dfn-local-two");
    expect(externalLink2.href).toEqual(expectedLinks.get("event handler"));
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
    expect(five.title).toEqual("Linking error: not matching <dfn>");
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
        <dfn data-lt="event handler|foo" class="externalDFN">handling event</dfn>
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

    const links = [...doc.querySelectorAll("#test2 a")];
    expect(links.length).toEqual(4);
    for (const link of links) {
      expect(link.href).toEqual(expectedLinks.get("event handler"));
      expect(link.classList.contains("respec-offending-element")).toBeFalsy();
    }
  });

  it("takes pluralization into account", async () => {
    const body = `
      <section id="test">
        <dfn class="externalDFN" data-lt="event handler|event handling">handling event</dfn>
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
          <p>Uses [[html]] and [[webidl]] to create context for <a id="three">object</a>.
          It fails as it's defined in both.</p>
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

  it("adds normative and informative references", async () => {
    const body = `
      <section class="informative">
        <section>
          <p>informative reference: <a id="valid1">fake inform 1</a></p>
          <p>normative reference: <a id="valid1n">list</a></p>
        </section>
        <section class="normative">
          <p>an informative reference:
            <a id="invalid">bearing angle</a> in normative section
          </p>
          <p><a id="valid5n">URL parser</a></p>
          <section>
            <div class="example">
              <p><a id="valid2">fake inform 2</a></p>
              <p><a id="valid2n">event handler</a></p>
            </div>
            <div class="note">
              <p><a id="valid3">fake inform 3</a></p>
              <p><a id="valid3n">dictionary</a></p>
            </div>
            <div class="issue">
              <p><a id="valid4">fake inform 4</a></p>
              <p><a id="valid4n">ascii alphanumeric</a></p>
            </div>
            <p><a id="valid6n">URL parser</a></p>
          </section>
        </section>
      </section>
    `;

    const config = { xref: { url: apiURL }, localBiblio };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const valid1 = doc.getElementById("valid1");
    expect(valid1.href).toEqual("https://example.com/#fake-inform-1");
    expect(valid1.classList.contains("respec-offending-element")).toBeFalsy();
    const valid1n = doc.getElementById("valid1n");
    expect(valid1n.href).toEqual(expectedLinks.get("list"));
    expect(valid1n.classList.contains("respec-offending-element")).toBeFalsy();
    const valid2 = doc.getElementById("valid2");
    expect(valid2.href).toEqual("https://example.com/#fake-inform-2");
    expect(valid2.classList.contains("respec-offending-element")).toBeFalsy();
    const valid2n = doc.getElementById("valid2n");
    expect(valid2n.href).toEqual(expectedLinks.get("event handler"));
    expect(valid2n.classList.contains("respec-offending-element")).toBeFalsy();
    const valid3 = doc.getElementById("valid3");
    expect(valid3.href).toEqual("https://example.com/#fake-inform-3");
    expect(valid3.classList.contains("respec-offending-element")).toBeFalsy();
    const valid3n = doc.getElementById("valid3n");
    expect(valid3n.href).toEqual(expectedLinks.get("dictionary"));
    expect(valid3n.classList.contains("respec-offending-element")).toBeFalsy();
    const valid4 = doc.getElementById("valid4");
    expect(valid4.href).toEqual("https://example.com/#fake-inform-4");
    expect(valid4.classList.contains("respec-offending-element")).toBeFalsy();
    const valid4n = doc.getElementById("valid4n");
    expect(valid4n.href).toEqual(expectedLinks.get("alphanumeric"));
    expect(valid4n.classList.contains("respec-offending-element")).toBeFalsy();
    const valid5n = doc.getElementById("valid5n");
    expect(valid5n.href).toEqual(expectedLinks.get("url parser"));
    expect(valid5n.classList.contains("respec-offending-element")).toBeFalsy();
    const valid6n = doc.getElementById("valid6n");
    expect(valid6n.href).toEqual(expectedLinks.get("url parser"));
    expect(valid6n.classList.contains("respec-offending-element")).toBeFalsy();

    const badLink = doc.getElementById("invalid");
    expect(badLink.href).toEqual(
      "https://www.w3.org/TR/css-values-3/#bearing-angle"
    );
    expect(badLink.classList.contains("respec-offending-element")).toBeTruthy();
    expect(badLink.title).toEqual(
      "Error: Informative reference in normative section"
    );

    const normRefs = [...doc.querySelectorAll("#normative-references dt")];
    expect(normRefs.length).toEqual(1); // excludes `css-values` of `#invalid`
    expect(normRefs.map(r => r.textContent)).toEqual(["[url]"]);

    const informRefs = [...doc.querySelectorAll("#informative-references dt")];
    expect(informRefs.length).toEqual(7);
    expect(informRefs.map(r => r.textContent).join()).toEqual(
      "[html],[infra],[local-1],[local-2],[local-3],[local-4],[webidl]"
    );
  });
});
