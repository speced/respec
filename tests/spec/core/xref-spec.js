"use strict";
describe("Core — xref", () => {
  afterAll(flushIframes);

  let cache;
  beforeAll(async () => {
    const { openDb } = await new Promise(resolve =>
      require(["deps/idb"], resolve)
    );
    const { IDBKeyVal } = await new Promise(resolve =>
      require(["core/utils"], resolve)
    );
    const idb = await openDb("xref", 1, upgradeDB => {
      upgradeDB.createObjectStore("xrefs");
    });
    cache = new IDBKeyVal(idb, "xrefs");
  });

  beforeEach(async () => {
    // clear idb cache before each
    await cache.clear();
  });

  const apiURL = `${location.origin}/tests/data/xref.json`;
  const localBiblio = {
    html: { id: "HTML", href: "https://html.spec.whatwg.org/multipage/" },
    "service-workers": {
      id: "service-workers-1",
      href: "https://www.w3.org/TR/service-workers-1/",
    },
    infra: { id: "INFRA", href: "https://infra.spec.whatwg.org/" },
    "credential-management": { aliasOf: "credential-management-1" },
    "credential-management-1": {
      href: "https://www.w3.org/TR/credential-management-1/",
      title: "Credential Management Level 1",
      id: "credential-management-1",
    },
    encoding: { aliasOf: "ENCODING" },
    ENCODING: {
      href: "https://encoding.spec.whatwg.org/",
      title: "Encoding Standard",
      id: "ENCODING",
    },
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
    ["object@url", "https://url.spec.whatwg.org/#concept-url-object"],
    ["dictionary", "https://heycam.github.io/webidl/#dfn-dictionary"],
    ["alphanumeric", "https://infra.spec.whatwg.org/#ascii-alphanumeric"],
    [
      "object-html",
      "https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-object-element",
    ],
    ["exception", "https://heycam.github.io/webidl/#dfn-exception"],
    [
      "Window",
      "https://html.spec.whatwg.org/multipage/window-object.html#window",
    ],
    ["Window.event", "https://dom.spec.whatwg.org/#dom-window-event"],
    [
      "PermissionStatus.[[query]]",
      "https://www.w3.org/TR/permissions/#dom-permissionstatus-query-slot",
    ],
    ["PermissionStatus", "https://www.w3.org/TR/permissions/#permissionstatus"],
    [
      "EventTarget.addEventListener",
      "https://dom.spec.whatwg.org/#dom-eventtarget-addeventlistener",
    ],
    ["EventTarget", "https://dom.spec.whatwg.org/#eventtarget"],
    [
      "Credential.[[type]]",
      "https://www.w3.org/TR/credential-management-1/#dom-credential-type-slot",
    ],
    ["Credential", "https://www.w3.org/TR/credential-management-1/#credential"],
    [
      "Credential.[[CollectFromCredentialStore]]",
      "https://www.w3.org/TR/credential-management-1/#dom-credential-collectfromcredentialstore-slot",
    ],
    [
      "PublicKeyCredential.[[type]]",
      "https://www.w3.org/TR/webauthn/#dom-publickeycredential-type-slot",
    ],
    [
      "PublicKeyCredential",
      "https://www.w3.org/TR/webauthn/#publickeycredential",
    ],
    [
      "TextDecoderOptions",
      "https://encoding.spec.whatwg.org/#textdecoderoptions",
    ],
    [
      `TextDecoderOptions["fatal"]`,
      "https://encoding.spec.whatwg.org/#dom-textdecoderoptions-fatal",
    ],
    ["EventTarget", "https://dom.spec.whatwg.org/#eventtarget"],
  ]);

  it("does nothing if xref is not enabled", async () => {
    const body = `<a id="external-link">event handler</a>`;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const link = doc.getElementById("external-link");
    expect(link.getAttribute("href")).toBeFalsy();
    expect(link.classList.contains("respec-offending-element")).toBeTruthy();
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

  it("shows error if external term doesn't exist", async () => {
    const body = `<section><a id="external-link">NOT_FOUND</a></section>`;
    const config = { xref: { url: apiURL } };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const link = doc.getElementById("external-link");
    expect(link.classList.contains("respec-offending-element")).toBeTruthy();
    expect(link.getAttribute("href")).toBeFalsy();
    expect(link.title).toEqual("Error: No matching dfn found.");
  });

  it("uses data-cite to disambiguate (server side)", async () => {
    const body = `
      <section id="links" data-cite="service-workers">
        <p><a>fetch</a> is defined 1 time in service-workers and 2 times in fetch.
          It uses parent's data-cite (service-workers).</p>
        <p>Looks up <a data-cite="infra">ASCII uppercase</a> in infra.</p>
        <p>As <a data-cite="infra">ASCII uppercasing</a> doesn't exist in INFRA,
          it resolves to spec only.</p>
      </section>
      <section id="dfns" data-cite="infra">
        <p><dfn data-cite="html">event handler</dfn> exists in html.</p>
        <p><dfn class="externalDFN">list</dfn> exists in infra, url, html.
          We intend infra one.</p>
        <p><dfn data-cite="html">event manager</dfn> doesn't exist in html.</p>
      </section>
    `;
    // using default API url here as xref.json cannot disambiguate
    const config = { xref: true, localBiblio };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const [link1, link2, link3] = [...doc.querySelectorAll("#links a")];
    expect(link1.href).toEqual(expectedLinks.get("sw-fetch"));
    expect(link2.href).toEqual(expectedLinks.get("uppercase"));
    expect(link3.href).toEqual("https://infra.spec.whatwg.org/");

    const [dfn1, dfn2, dfn3] = [...doc.querySelectorAll("#dfns dfn a")];
    expect(dfn1.href).toEqual(expectedLinks.get("event handler"));
    expect(dfn2.href).toEqual(expectedLinks.get("list"));
    expect(dfn3.href).toEqual("https://html.spec.whatwg.org/multipage/");
  });

  it("shows error if cannot resolve by data-cite", async () => {
    const body = `
      <section data-cite="fetch">
        <p><a id="link">fetch</a> twice in fetch spec.</p>
      </section>
    `;
    const config = { xref: { url: apiURL }, localBiblio };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const link = doc.getElementById("link");
    expect(link.classList.contains("respec-offending-element")).toBeTruthy();
    expect(link.title).toEqual("Error: Linking an ambiguous dfn.");
  });

  it("uses data-cite to disambiguate (client side)", async () => {
    // https://github.com/w3c/respec/pull/1750
    const body = `
      <section id="test">
        <p data-cite="url"><a id="one">object</a></p>
        <p data-cite="html"><a id="two">object</a></p>
        <p data-cite="html">
          <a id="three" data-cite="url">object</a> (overrides parent)
          <a id="four">object</a> (uses parent's data-cite - html)
        </p>
        <p><a id="five" data-cite="NOT-FOUND">object</a></p>
      </section>
    `;
    const config = { xref: { url: apiURL }, localBiblio };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    expect(doc.getElementById("one").href).toEqual(
      expectedLinks.get("object@url")
    );
    expect(doc.getElementById("two").href).toEqual(
      expectedLinks.get("object-html")
    );
    expect(doc.getElementById("three").href).toEqual(
      expectedLinks.get("object@url")
    );
    expect(doc.getElementById("four").href).toEqual(
      expectedLinks.get("object-html")
    );

    const five = doc.getElementById("five");
    expect(five.href).toEqual("");
    expect(five.classList.contains("respec-offending-element")).toBeTruthy();
    expect(five.title).toEqual(`Couldn't find a match for "NOT-FOUND"`);
  });

  it("treats terms as local if empty data-cite on parent", async () => {
    const body = `
      <section data-cite="" id="test">
        <p id="local-dfn-1"><dfn>local one</dfn></p>
        <p id="local-dfn-2"><dfn data-cite="html#hello">hello</dfn></p>
        <p id="external-dfn-1"><dfn data-cite="webidl">dictionary</dfn></p>
        <p id="external-dfn-2"><dfn class="externalDFN">list</dfn></p>
        <p id="local-link-1"><a>local one</a></p>
        <p id="external-link-1"><a data-cite="url">URL parser</a></p>
      </section>
    `;
    const config = { xref: { url: apiURL }, localBiblio };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const localDfn1 = doc.getElementById("local-dfn-1");
    expect(localDfn1.querySelector("a")).toBeFalsy();
    expect(localDfn1.querySelector("dfn").id).toEqual("dfn-local-one");
    const localDfn2 = doc.querySelector("#local-dfn-2 a");
    expect(localDfn2.href).toEqual(
      "https://html.spec.whatwg.org/multipage/#hello"
    );
    const externalDfn1 = doc.querySelector("#external-dfn-1 a");
    expect(externalDfn1.href).toEqual(expectedLinks.get("dictionary"));
    const externalDfn2 = doc.querySelector("#external-dfn-2 a");
    expect(externalDfn2.href).toEqual(expectedLinks.get("list"));
    const localLink1 = doc.querySelector("#local-link-1 a");
    expect(localLink1.getAttribute("href")).toEqual("#dfn-local-one");
    const externalLink1 = doc.querySelector("#external-link-1 a");
    expect(externalLink1.href).toEqual(expectedLinks.get("url parser"));

    const offendingElements = doc.querySelectorAll(
      "#test .respec-offending-element"
    );
    expect(offendingElements.length).toEqual(0);
  });

  it("ignores terms if local dfn exists", async () => {
    const body = `
      <section id="test">
        <p id="local-dfn-1"><dfn>local one</dfn></p>
        <p id="local-dfn-2"><dfn data-cite="html#world">world</dfn></p>
        <p id="external-dfn-1"><dfn class="externalDFN">URL parser</dfn></p>
        <p id="external-dfn-2"><dfn data-cite="infra">list</dfn></p>
        <p id="local-link-1"><a>local one</a></p>
        <p id="local-link-2" data-cite="html">
          <a data-cite="">local one</a>
        </p>
        <p id="external-link-1"><a>event handler</a></p>
      </section>
    `;
    const config = { xref: { url: apiURL }, localBiblio };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const localDfn1p = doc.querySelector("p#local-dfn-1");
    expect(localDfn1p.querySelector("a")).toBeFalsy();
    expect(localDfn1p.querySelector("dfn").id).toEqual("dfn-local-one");
    const localDfn2 = doc.querySelector("#local-dfn-2 a");
    expect(localDfn2.href).toEqual(
      "https://html.spec.whatwg.org/multipage/#world"
    );
    const externalDfn1 = doc.querySelector("#external-dfn-1 a");
    expect(externalDfn1.href).toEqual(expectedLinks.get("url parser"));
    const externalDfn2 = doc.querySelector("#external-dfn-2 a");
    expect(externalDfn2.href).toEqual(expectedLinks.get("list"));
    const localLink1 = doc.querySelector("#local-link-1 a");
    expect(localLink1.getAttribute("href")).toEqual("#dfn-local-one");
    const localLink2 = doc.querySelector("#local-link-2 a");
    expect(localLink2.getAttribute("href")).toEqual("#dfn-local-one");
    const externalLink1 = doc.querySelector("#external-link-1 a");
    expect(externalLink1.href).toEqual(expectedLinks.get("event handler"));

    const offendingElements = doc.querySelectorAll(
      "#test .respec-offending-element"
    );
    expect(offendingElements.length).toEqual(0);
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

  it("takes dfn pluralization into account", async () => {
    const body = `
      <section id="test">
        <dfn class="externalDFN" data-lt="event handler|event handling">
          handling event
        </dfn>
        <a>event handler</a> <a>event handlers</a>
        <a>handling event</a> <a>handling events</a>
        <a>event handling</a>
      </section>
      <section id="test2">
        <dfn class="externalDFN">event handler</dfn>
        <a>event handler</a> <a>event handlers</a>
      </section>
    `;
    const config = { xref: { url: apiURL }, localBiblio, pluralize: true };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const dfn = doc.querySelector("#test dfn");
    expect(dfn.id).toEqual("dfn-event-handler");
    const links = [...doc.querySelectorAll("#test a")];
    expect(links.length).toEqual(6);
    for (const link of links) {
      expect(link.href).toEqual(expectedLinks.get("event handler"));
      expect(link.classList.contains("respec-offending-element")).toBeFalsy();
    }

    const test2Links = [...doc.querySelectorAll("#test2 a")];
    expect(test2Links.length).toEqual(3);
    for (const link of test2Links) {
      expect(link.href).toEqual(expectedLinks.get("event handler"));
      expect(link.classList.contains("respec-offending-element")).toBeFalsy();
    }
  });

  it("uses inline references to provide context", async () => {
    const body = `
      <section id="test">
        <section>
          <p>Uses [[url]] to create context for <a id="one">object</a></p>
        </section>
        <section>
          <p>Uses [[html]] to create context for <a id="two">object</a></p>
        </section>
        <section>
          <p>Uses [[html]] and [[url]] to create context for
            <a id="three">object</a>. It fails as it's defined in both.
          </p>
        </section>
        <section>
          <p>But data-cite on element itself wins.
            <a id="four">object</a> uses [[url]],
            whereas <a data-cite="html" id="five">object</a> uses html.
          </p>
        </section>
      </section>
    `;
    const config = { xref: { url: apiURL }, localBiblio };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const expectedLink1 = "https://url.spec.whatwg.org/#concept-url-object";
    const expectedLink2 =
      "https://html.spec.whatwg.org/multipage/iframe-embed-object.html" +
      "#the-object-element";

    const one = doc.getElementById("one");
    expect(one.href).toEqual(expectedLink1);
    const two = doc.getElementById("two");
    expect(two.href).toEqual(expectedLink2);

    const three = doc.getElementById("three");
    expect(three.href).toEqual("");
    expect(three.classList.contains("respec-offending-element")).toBeTruthy();
    expect(doc.querySelectorAll(".respec-offending-element").length).toEqual(1);

    const four = doc.getElementById("four");
    expect(four.href).toEqual(expectedLink1);
    const five = doc.getElementById("five");
    expect(five.href).toEqual(expectedLink2);
  });

  it("adds normative and informative references", async () => {
    const body = `
      <section class="informative" id="test">
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

    const validLinks = [...doc.querySelectorAll("#test a:not([id='invalid'])")];
    for (const link of validLinks) {
      expect(link.classList.contains("respec-offending-element")).toBeFalsy();
    }
    const valid1 = doc.getElementById("valid1");
    expect(valid1.href).toEqual("https://example.com/#fake-inform-1");
    const valid1n = doc.getElementById("valid1n");
    expect(valid1n.href).toEqual(expectedLinks.get("list"));
    const valid2 = doc.getElementById("valid2");
    expect(valid2.href).toEqual("https://example.com/#fake-inform-2");
    const valid2n = doc.getElementById("valid2n");
    expect(valid2n.href).toEqual(expectedLinks.get("event handler"));
    const valid3 = doc.getElementById("valid3");
    expect(valid3.href).toEqual("https://example.com/#fake-inform-3");
    const valid3n = doc.getElementById("valid3n");
    expect(valid3n.href).toEqual(expectedLinks.get("dictionary"));
    const valid4 = doc.getElementById("valid4");
    expect(valid4.href).toEqual("https://example.com/#fake-inform-4");
    const valid4n = doc.getElementById("valid4n");
    expect(valid4n.href).toEqual(expectedLinks.get("alphanumeric"));
    const valid5n = doc.getElementById("valid5n");
    expect(valid5n.href).toEqual(expectedLinks.get("url parser"));
    const valid6n = doc.getElementById("valid6n");
    expect(valid6n.href).toEqual(expectedLinks.get("url parser"));

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

  describe("inline IDL references", () => {
    it("ignores inlines starting with backslash", async () => {
      // whitespace inside {{{ }}} doesn't matter
      const body = `<section><p id="test">{{{\\PASS }}}</p></section>`;
      const config = { xref: { url: apiURL } };
      const ops = makeStandardOps(config, body);
      const doc = await makeRSDoc(ops);
      const el = doc.getElementById("test");
      expect(el.querySelector("code a")).toBeFalsy();
      expect(el.textContent).toEqual("{{{PASS}}}");
    });

    it("ignores malformed syntax", async () => {
      const body = `<section><p id="test">{ { { PASS }}}</p></section>`;
      const config = { xref: { url: apiURL } };
      const ops = makeStandardOps(config, body);
      const doc = await makeRSDoc(ops);
      const el = doc.getElementById("test");
      expect(el.querySelector("code a")).toBeFalsy();
      expect(el.textContent).toEqual("{ { { PASS }}}");
    });

    it("links inline IDL references", async () => {
      const body = `
      <section id="test">
        <p id="link1">{{{ Window }}}</p>
        <p id="link2">{{{ [[query]] }}}</p>
        <p id="link3">{{{ [[type]] }}} is ambiguous.</p>
        <p id="link4"> This should work {{{
              EventTarget

        }}} , i.e. should trim the whitespace.</p>
      </section>
      `;
      const config = { xref: { url: apiURL }, localBiblio };
      const ops = makeStandardOps(config, body);
      const doc = await makeRSDoc(ops);

      const link1 = doc.querySelector("#link1 code a");
      expect(link1.href).toEqual(expectedLinks.get("Window"));

      const link2 = doc.querySelector("#link2 code a");
      expect(link2.href).toEqual(
        expectedLinks.get("PermissionStatus.[[query]]")
      );
      expect(link2.textContent).toEqual("[[query]]");

      const link3 = doc.querySelector("#link3 code a");
      expect(link3.href).toBeFalsy();
      expect(link3.title).toEqual("Error: Linking an ambiguous dfn.");

      const link4 = doc.querySelector("#link4 code a");
      expect(link4.href).toEqual(expectedLinks.get("EventTarget"));
      expect(link4.textContent).toEqual("EventTarget");
    });

    it("links methods", async () => {
      const body = `
      <section id="test">
        <p id="link1">{{{ addEventListener(type, callback) }}}</p>
        <p id="link2">{{{ EventTarget.addEventListener(type, callback) }}}</p>
        <p id="link3">{{{ [[CollectFromCredentialStore]](options, sameOriginWithAncestors) }}} is ambiguous</p>
        <p id="link4">{{{ Credential.[[CollectFromCredentialStore]](options, sameOriginWithAncestors) }}}</p>
      </section>
      `;
      const config = { xref: { url: apiURL }, localBiblio };
      const ops = makeStandardOps(config, body);
      const doc = await makeRSDoc(ops);

      const link1 = doc.querySelector("#link1 code a");
      expect(link1.href).toEqual(
        expectedLinks.get("EventTarget.addEventListener")
      );
      const vars1 = [...doc.querySelectorAll("#link1 var")];
      expect(vars1.length).toEqual(2);
      expect(vars1[0].textContent).toEqual("type");
      expect(vars1[1].textContent).toEqual("callback");

      const [link2a, link2b] = [...doc.querySelectorAll("#link2 code a")];
      expect(link2a.href).toEqual(expectedLinks.get("EventTarget"));
      expect(link2b.href).toEqual(
        expectedLinks.get("EventTarget.addEventListener")
      );
      const vars2 = [...doc.querySelectorAll("#link2 var")];
      expect(vars2.length).toEqual(2);
      expect(vars2[0].textContent).toEqual("type");
      expect(vars2[1].textContent).toEqual("callback");

      const link3 = doc.querySelector("#link3 code a");
      expect(link3.href).toEqual("");
      expect(link3.title).toEqual("Error: Linking an ambiguous dfn.");

      const [link4a, link4b] = [...doc.querySelectorAll("#link4 code a")];
      expect(link4a.href).toEqual(expectedLinks.get("Credential"));
      expect(link4b.href).toEqual(
        expectedLinks.get("Credential.[[CollectFromCredentialStore]]")
      );
    });

    it("links attributes", async () => {
      const body = `
      <section>
        <p id="link1">{{{Window.event}}}</p>
        <p id="link2">{{{ Credential.[[type]] }}}</p>
        <p id="link3">{{{ PublicKeyCredential.[[type]] }}}</p>
      </section>
      `;
      const config = { xref: { url: apiURL }, localBiblio };
      const ops = makeStandardOps(config, body);
      const doc = await makeRSDoc(ops);

      const [link1a, link1b] = [...doc.querySelectorAll("#link1 code a")];
      expect(link1a.href).toEqual(expectedLinks.get("Window"));
      expect(link1b.href).toEqual(expectedLinks.get("Window.event"));

      // the base "Credential" is used to disambiguate as "forContext"
      const [link2a, link2b] = [...doc.querySelectorAll("#link2 code a")];
      expect(link2a.href).toEqual(expectedLinks.get("Credential"));
      expect(link2b.href).toEqual(expectedLinks.get("Credential.[[type]]"));

      const [link3a, link3b] = [...doc.querySelectorAll("#link3 code a")];
      expect(link3a.href).toEqual(expectedLinks.get("PublicKeyCredential"));
      expect(link3b.href).toEqual(
        expectedLinks.get("PublicKeyCredential.[[type]]")
      );
    });

    it("links internalSlots", async () => {
      const body = `
      <section>
        <p><dfn>[[\\type]]</dfn></p>
        <p id="link1">{{{ [[type]] }}}</p>
        <p id="link2">{{{ Credential.[[type]] }}}</p>
      </section>
      `;
      const config = { xref: { url: apiURL }, localBiblio };
      const ops = makeStandardOps(config, body);
      const doc = await makeRSDoc(ops);

      // as base == [[type]], it is treated as a local internal slot
      const link1 = doc.querySelector("#link1 a");
      expect(link1.getAttribute("href")).toEqual("#dfn-type");

      // the base "Credential" is used as "forContext" for [[type]]
      const [link2a, link2b] = [...doc.querySelectorAll("#link2 code a")];
      expect(link2a.href).toEqual(expectedLinks.get("Credential"));
      expect(link2b.href).toEqual(expectedLinks.get("Credential.[[type]]"));
    });

    it("links dictionary members", async () => {
      const body = `
      <section>
        <p id="link1">{{{ TextDecoderOptions["fatal"] }}}</p>
      </section>
      `;
      const config = { xref: { url: apiURL }, localBiblio };
      const ops = makeStandardOps(config, body);
      const doc = await makeRSDoc(ops);

      // "TextDecoderOptions" is dictionary and "fatal" is dict-member
      const [link1a, link1b] = [...doc.querySelectorAll("#link1 code a")];
      expect(link1a.href).toEqual(expectedLinks.get("TextDecoderOptions"));
      expect(link1b.href).toEqual(
        expectedLinks.get(`TextDecoderOptions["fatal"]`)
      );
    });

    it("links local definitions first", async () => {
      const body = `
        <section data-dfn-for="PaymentAddress" data-link-for="PaymentAddress">
          <h2><dfn>PaymentAddress</dfn> interface</h2>
          <pre class="idl">
            interface PaymentAddress {
              attribute DOMString languageCode;
            };
          </pre>
          <dfn>languageCode</dfn> attribute of PaymentAddress.
        </section>
        <section id="test">
          <h2>Ignore</h2>
          <p>Some other <dfn>languageCode</dfn> definiton.</p>
          <p id="link-internal">{{{ PaymentAddress.languageCode }}} links to PaymentAddress definitons.</p>
          <p id="link-internal-dfn">{{{ languageCode }}} links to some other definiton.</p>
          <p id="link-external">{{{ Window.event }}} links to html spec.</p>
        </section>
      `;
      const config = { xref: { url: apiURL }, localBiblio };
      const ops = makeStandardOps(config, body);
      const doc = await makeRSDoc(ops);

      const externalLinks = [...doc.querySelectorAll("#link-external a")];
      expect(externalLinks[0].href).toEqual(expectedLinks.get("Window"));
      expect(externalLinks[1].href).toEqual(expectedLinks.get("Window.event"));

      const paymentAddressLinks = [...doc.querySelectorAll("#link-internal a")];
      expect(paymentAddressLinks[0].getAttribute("href")).toEqual(
        "#dom-paymentaddress"
      );
      expect(paymentAddressLinks[1].getAttribute("href")).toEqual(
        "#dom-paymentaddress-languagecode"
      );

      const internalLink = doc.querySelector("#link-internal-dfn a");
      expect(internalLink.getAttribute("href")).toEqual("#dfn-languagecode");
    });
  });

  it("caches results and uses cached results when available", async () => {
    const config = { xref: true, localBiblio };
    let cacheKeys;

    const body1 = `
      <section>
        <p><a id="link">dictionary</a><p>
      </section>`;

    const preLoadTime = await cache.get("__CACHE_TIME__");
    expect(preLoadTime instanceof Date).toBeFalsy();
    cacheKeys = (await cache.keys()).sort();
    expect(cacheKeys).toEqual([]);

    const preCacheDoc = await makeRSDoc(makeStandardOps(config, body1));
    expect(preCacheDoc.getElementById("link").href).toEqual(
      expectedLinks.get("dictionary")
    );
    const preCacheTime = await cache.get("__CACHE_TIME__");
    expect(preCacheTime instanceof Date).toBeTruthy();
    cacheKeys = (await cache.keys()).sort();
    expect(cacheKeys).toEqual(["__CACHE_TIME__", "dictionary"]);

    // no new data was requested from server, cache shoudln't change
    const postCacheDoc = await makeRSDoc(makeStandardOps(config, body1));
    expect(postCacheDoc.getElementById("link").href).toEqual(
      expectedLinks.get("dictionary")
    );
    const postCacheTime = await cache.get("__CACHE_TIME__");
    expect(postCacheTime).toEqual(preCacheTime);
    cacheKeys = (await cache.keys()).sort();
    expect(cacheKeys).toEqual(["__CACHE_TIME__", "dictionary"]);

    // new data was requested from server, cache should change
    const body2 = `
      <section>
        <p><a id="link-1">dictionary</a><p>
        <p><a id="link-2">URL parser</a><p>
      </section>
    `;
    const updatedCacheDoc = await makeRSDoc(makeStandardOps(config, body2));
    expect(updatedCacheDoc.getElementById("link-1").href).toEqual(
      expectedLinks.get("dictionary")
    );
    expect(updatedCacheDoc.getElementById("link-2").href).toEqual(
      expectedLinks.get("url parser")
    );
    const updatedCacheTime = await cache.get("__CACHE_TIME__");
    expect(updatedCacheTime).toBeGreaterThan(preCacheTime);
    cacheKeys = (await cache.keys()).sort();
    expect(cacheKeys).toEqual(["__CACHE_TIME__", "dictionary", "url parser"]);
  });
});
