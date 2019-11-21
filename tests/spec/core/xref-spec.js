"use strict";

import {
  flushIframes,
  makeDefaultBody,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";
import { IDBKeyVal } from "../../../src/core/utils.js";
import { openDB } from "../../../node_modules/idb/build/esm/index.js";

describe("Core — xref", () => {
  afterAll(flushIframes);

  let cache;
  beforeAll(async () => {
    const idb = await openDB("xref", 1, {
      upgrade(db) {
        db.createObjectStore("xrefs");
      },
    });
    cache = new IDBKeyVal(idb, "xrefs");
  });

  beforeEach(async () => {
    // clear idb cache before each
    await cache.clear();
  });

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
    "css-layout-api": {
      href: "https://www.w3.org/TR/css-layout-api-1/",
      id: "css-layout-api-1",
    },
    "css-snappoints": {
      href: "https://www.w3.org/TR/css-snappoints-1/",
    },
    "css-scroll-snap": {
      href: "https://drafts.csswg.org/css-scroll-snap-1/",
    },
    "referrer-policy": {
      href: "https://www.w3.org/TR/referrer-policy/",
    },
    "css-scoping": { aliasOf: "css-scoping-1" },
    "css-scoping-1": { href: "https://drafts.csswg.org/css-scoping-1/" },
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
    ["dictionary", "https://heycam.github.io/webidl/#dfn-dictionary"],
    ["alphanumeric", "https://infra.spec.whatwg.org/#ascii-alphanumeric"],
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
      "https://www.w3.org/TR/webauthn-1/#dom-publickeycredential-type-slot",
    ],
    [
      "PublicKeyCredential",
      "https://www.w3.org/TR/webauthn-1/#publickeycredential",
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
    [
      "allowedFeatures",
      "https://www.w3.org/TR/feature-policy-1/#dom-featurepolicy-allowedfeatures",
    ],
    ["ChildNode", "https://dom.spec.whatwg.org/#childnode"],
    ["ChildNode.after", "https://dom.spec.whatwg.org/#dom-childnode-after"],
    ["URLSearchParams", "https://url.spec.whatwg.org/#urlsearchparams"],
    [
      "URLSearchParams.append",
      "https://url.spec.whatwg.org/#dom-urlsearchparams-append",
    ],
    [
      "ServiceWorkerUpdateViaCache.imports",
      "https://www.w3.org/TR/service-workers-1/#dom-serviceworkerupdateviacache-imports",
    ],
    [
      "blob",
      "https://xhr.spec.whatwg.org/#dom-xmlhttprequestresponsetype-blob",
    ],
    [
      "ChildDisplayType.block",
      "https://www.w3.org/TR/css-layout-api-1/#dom-childdisplaytype-block",
    ],
  ]);

  it("does nothing if xref is not enabled", async () => {
    const body = `<a id="external-link">event handler</a>`;
    const ops = makeStandardOps({ xref: false }, body);
    const doc = await makeRSDoc(ops);

    const link = doc.getElementById("external-link");
    expect(link.getAttribute("href")).toBeFalsy();
    expect(link.classList).toContain("respec-offending-element");
  });

  it("adds link to unique external terms", async () => {
    const body = `
      <section>
        <p id="external-link"><a>event handler</a></p>
        <p id="external-dfn"><dfn class="externalDFN">URL parser</dfn></p>
      </section>`;
    const config = { xref: "web-platform", localBiblio };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const link = doc.querySelector("#external-link a");
    expect(link.href).toBe(expectedLinks.get("event handler"));
    expect(link.classList.contains("respec-offending-element")).toBeFalsy();

    const dfn = doc.querySelector("#external-dfn dfn a");
    expect(dfn.href).toBe(expectedLinks.get("url parser"));
    expect(dfn.classList.contains("respec-offending-element")).toBeFalsy();
  });

  it("doesn't link auto-filled anchors", async () => {
    const body = `<section><a id="test" data-cite="credential-management"></a></section>`;
    const config = { xref: ["credential-management"], localBiblio };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);
    const link = doc.getElementById("test");
    expect(link.classList.contains("respec-offending-element")).toBeFalsy();
    expect(link.getAttribute("href")).toBe(
      "https://www.w3.org/TR/credential-management-1/"
    );
    expect(link.textContent).toBe("Credential Management Level 1");
  });

  it("shows error if external term doesn't exist", async () => {
    const body = `<section><a id="external-link">NOT_FOUND</a></section>`;
    const config = { xref: "web-platform" };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const link = doc.getElementById("external-link");
    expect(link.classList).toContain("respec-offending-element");
    expect(link.getAttribute("href")).toBeFalsy();
    expect(link.title).toBe("Error: No matching dfn found.");
  });

  it("uses data-cite to disambiguate", async () => {
    const body = `
      <section id="links" data-cite="css-snappoints">
        <p><a>intended direction</a> is defined 1 time in css-scroll-snap and 1 time in css-snappoints.
          It uses parent's data-cite (css-snappoints).</p>
        <p>Looks up <a data-cite="infra">ASCII uppercase</a> in infra.</p>
        <p>As <a data-cite="infra">ASCII upcasing</a> doesn't exist in INFRA,
          it resolves to spec only.</p>
      </section>
      <section id="dfns" data-cite="infra">
        <p><dfn data-cite="html">event handler</dfn> exists in html.</p>
        <p><dfn class="externalDFN">list</dfn> exists in infra, url, html.
          We intend infra one.</p>
        <p><dfn data-cite="html">event manager</dfn> doesn't exist in html.</p>
      </section>
    `;
    const config = { xref: true, localBiblio };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const [link1, link2, link3] = [...doc.querySelectorAll("#links a")];
    expect(link1.href).toBe(
      "https://www.w3.org/TR/css-snappoints-1/#intended-direction"
    );
    expect(link2.href).toBe(expectedLinks.get("uppercase"));
    expect(link3.href).toBe("https://infra.spec.whatwg.org/");

    const [dfn1, dfn2, dfn3] = [...doc.querySelectorAll("#dfns dfn a")];
    expect(dfn1.href).toBe(expectedLinks.get("event handler"));
    expect(dfn2.href).toBe(expectedLinks.get("list"));
    expect(dfn3.href).toBe("https://html.spec.whatwg.org/multipage/");
  });

  it("shows error if cannot resolve by data-cite", async () => {
    const body = `
      <section data-cite="svg">
        <p><a id="link">symbol</a> twice in svg spec.</p>
      </section>
    `;
    const config = { xref: ["svg"], localBiblio };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const link = doc.getElementById("link");
    expect(link.classList).toContain("respec-offending-element");
    expect(link.title).toBe("Error: Linking an ambiguous dfn.");
  });

  it("uses data-cite to disambiguate - 2", async () => {
    // https://github.com/w3c/respec/pull/1750
    const body = `
      <section id="test">
        <p data-cite="css-scroll-snap"><a id="one">intended direction</a></p>
        <p data-cite="css-snappoints"><a id="two">intended direction</a></p>
        <p data-cite="css-snappoints">
          <a id="three" data-cite="css-scroll-snap">intended direction</a> (overrides parent)
          <a id="four">intended direction</a> (uses parent's data-cite - css-snappoints)
        </p>
        <p><a id="five" data-cite="NOT-FOUND">intended direction</a></p>
      </section>
    `;
    const config = { xref: true, localBiblio };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const scrollSnapLink =
      "https://drafts.csswg.org/css-scroll-snap-1/#intended-direction";
    const snappointsLink =
      "https://www.w3.org/TR/css-snappoints-1/#intended-direction";

    expect(doc.getElementById("one").href).toBe(scrollSnapLink);
    expect(doc.getElementById("two").href).toBe(snappointsLink);
    expect(doc.getElementById("three").href).toBe(scrollSnapLink);
    expect(doc.getElementById("four").href).toBe(snappointsLink);

    const five = doc.getElementById("five");
    expect(five.href).toBe("");
    expect(five.classList).toContain("respec-offending-element");
    expect(five.title).toBe("Error: No matching dfn found.");
  });

  it("uses data-cite fallbacks", async () => {
    const body = `
      <section data-cite="dom html" id="test">
        <section><dfn>local</dfn></section>
        <p><a id="link1">event handler</a> try either [dom] or [html]</p>
        <section data-cite="dom">
          <p data-cite="svg">
            <a id="link2">event handler</a>
            - not in [svg] -> fallback to [dom] -> fallback to [dom], [html]
            <a id="link-local-0">local</a>
          </p>
          <p>
            <a id="link3" data-cite="fetch">event handler</a>
            - try and stop at [fetch] as data-cite is on self
          </p>
          <p><a id="link-local-1">local</a></p>
          <p><a id="link-local-2" data-cite="dom">local</a></p>
        </section>
      </section>
    `;
    const config = { xref: true, localBiblio };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const link1 = doc.getElementById("link1");
    expect(link1.href).toEqual(expectedLinks.get("event handler"));

    const link2 = doc.getElementById("link2");
    expect(link2.href).toEqual(expectedLinks.get("event handler"));

    const link3 = doc.getElementById("link3");
    expect(link3.href).toEqual("https://fetch.spec.whatwg.org/");
    expect(link3.classList).toContain("respec-offending-element");
    expect(link3.title).toEqual("Error: No matching dfn found.");

    const linkLocal0 = doc.getElementById("link-local-0");
    expect(linkLocal0.getAttribute("href")).toEqual("#dfn-local");
    expect(linkLocal0.classList).not.toContain("respec-offending-element");

    const linkLocal1 = doc.getElementById("link-local-1");
    expect(linkLocal1.getAttribute("href")).toEqual("#dfn-local");
    expect(linkLocal1.classList).not.toContain("respec-offending-element");

    const linkLocal2 = doc.getElementById("link-local-2");
    expect(linkLocal2.href).toEqual("https://dom.spec.whatwg.org/");
    expect(linkLocal2.classList).toContain("respec-offending-element");
  });

  it("treats terms as local if empty data-cite on parent", async () => {
    const body = `
      <section data-cite="" id="test">
        <p id="local-dfn-1"><dfn>local one</dfn></p>
        <p id="local-dfn-2"><dfn data-cite="html#hello">hello</dfn></p>
        <p id="external-dfn-1"><dfn data-cite="webidl">dictionary</dfn></p>
        <p id="external-dfn-2" data-cite="infra"><dfn class="externalDFN">list</dfn></p>
        <p id="local-link-1"><a>local one</a></p>
        <p id="external-link-1"><a data-cite="url">URL parser</a></p>
      </section>
    `;
    const config = { xref: true, localBiblio };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const localDfn1 = doc.getElementById("local-dfn-1");
    expect(localDfn1.querySelector("a")).toBeFalsy();
    expect(localDfn1.querySelector("dfn").id).toBe("dfn-local-one");
    const localDfn2 = doc.querySelector("#local-dfn-2 a");
    expect(localDfn2.href).toBe(
      "https://html.spec.whatwg.org/multipage/#hello"
    );
    const externalDfn1 = doc.querySelector("#external-dfn-1 a");
    expect(externalDfn1.href).toBe(expectedLinks.get("dictionary"));
    const externalDfn2 = doc.querySelector("#external-dfn-2 a");
    expect(externalDfn2.href).toBe(expectedLinks.get("list"));
    const localLink1 = doc.querySelector("#local-link-1 a");
    expect(localLink1.getAttribute("href")).toBe("#dfn-local-one");
    const externalLink1 = doc.querySelector("#external-link-1 a");
    expect(externalLink1.href).toBe(expectedLinks.get("url parser"));

    const offendingElements = doc.querySelectorAll(
      "#test .respec-offending-element"
    );
    expect(offendingElements.length).toBe(0);
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
    const config = { xref: "web-platform", localBiblio };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const localDfn1p = doc.querySelector("p#local-dfn-1");
    expect(localDfn1p.querySelector("a")).toBeFalsy();
    expect(localDfn1p.querySelector("dfn").id).toBe("dfn-local-one");
    const localDfn2 = doc.querySelector("#local-dfn-2 a");
    expect(localDfn2.href).toBe(
      "https://html.spec.whatwg.org/multipage/#world"
    );
    const externalDfn1 = doc.querySelector("#external-dfn-1 a");
    expect(externalDfn1.href).toBe(expectedLinks.get("url parser"));
    const externalDfn2 = doc.querySelector("#external-dfn-2 a");
    expect(externalDfn2.href).toBe(expectedLinks.get("list"));
    const localLink1 = doc.querySelector("#local-link-1 a");
    expect(localLink1.getAttribute("href")).toBe("#dfn-local-one");
    const localLink2 = doc.querySelector("#local-link-2 a");
    expect(localLink2.getAttribute("href")).toBe("#dfn-local-one");
    const externalLink1 = doc.querySelector("#external-link-1 a");
    expect(externalLink1.href).toBe(expectedLinks.get("event handler"));

    const offendingElements = doc.querySelectorAll(
      "#test .respec-offending-element"
    );
    expect(offendingElements.length).toBe(0);
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
    const config = { xref: ["infra", "html"], localBiblio };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const link = doc.querySelector("#test1 a");
    expect(link.getAttribute("href")).toBe(expectedLinks.get("list"));

    const links = [...doc.querySelectorAll("#test2 a")];
    expect(links.length).toBe(4);
    for (const link of links) {
      expect(link.href).toBe(expectedLinks.get("event handler"));
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
    const config = { xref: ["html"], localBiblio, pluralize: true };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const dfn = doc.querySelector("#test dfn");
    expect(dfn.id).toBe("dfn-event-handler");
    const links = [...doc.querySelectorAll("#test a")];
    expect(links.length).toBe(6);
    for (const link of links) {
      expect(link.href).toBe(expectedLinks.get("event handler"));
      expect(link.classList.contains("respec-offending-element")).toBeFalsy();
    }

    const test2Links = [...doc.querySelectorAll("#test2 a")];
    expect(test2Links.length).toBe(3);
    for (const link of test2Links) {
      expect(link.href).toBe(expectedLinks.get("event handler"));
      expect(link.classList.contains("respec-offending-element")).toBeFalsy();
    }
  });

  it("uses inline references to provide context", async () => {
    const body = `
      <section id="test">
        <section>
        <p>Uses [[css-scoping]] to create context for <a id="one">shadow root</a></p>
        </section>
        <section>
          <p>Uses [[dom]] to create context for <a id="two">shadow root</a></p>
        </section>
        <section>
          <p>Uses [[dom]] and [[css-scoping]] to create context for
            <a id="three">shadow root</a>. It fails as it's defined in both.
          </p>
        </section>
        <section>
          <p>But data-cite on element itself wins.
            <a id="four">shadow root</a> uses [[css-scoping]],
            whereas <a data-cite="dom" id="five">shadow root</a> uses dom.
          </p>
        </section>
      </section>
    `;
    // `xref: true` to prevent cite fallback chaining to body[data-cite].
    // (contrived example to check the use of context)
    const config = { xref: true, localBiblio };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const expectedLink1 = "https://drafts.csswg.org/css-scoping-1/#shadow-root";
    const expectedLink2 = "https://dom.spec.whatwg.org/#concept-shadow-root";

    const one = doc.getElementById("one");
    expect(one.href).toBe(expectedLink1);
    const two = doc.getElementById("two");
    expect(two.href).toBe(expectedLink2);

    const three = doc.getElementById("three");
    expect(three.href).toBe("");
    expect(three.classList).toContain("respec-offending-element");
    expect(doc.querySelectorAll(".respec-offending-element").length).toBe(1);

    const four = doc.getElementById("four");
    expect(four.href).toBe(expectedLink1);
    const five = doc.getElementById("five");
    expect(five.href).toBe(expectedLink2);
  });

  it("adds normative and informative references", async () => {
    const body = `
      <section class="informative" id="test">
        <section>
          <p>Cite the <a data-cite="URL"></a> non-normative</p>
          <p>informative reference: <a id="valid1">fake inform 1</a> is in spec "local-1"</p>
          <p>informative reference: <a id="valid1n">list</a> is in infra</p>
        </section>
        <section class="normative">
          <p>Informative document: <a id="invalid">bearing angle</a> in normative section</p>
          <p>Normative reference: <a id="valid5n">URL parser</a> from "url" (lower case)</p>
          <section>
            <div class="example">
              <p><a id="valid2">fake inform 2</a></p>
              <p><a id="valid2n">event handler</a> from HTML</p>
            </div>
            <div class="note">
              <p><a id="valid3">fake inform 3</a></p>
              <p><a id="valid3n">dictionary</a> from WebIDL</p>
            </div>
            <div class="issue">
              <p><a id="valid4">fake inform 4</a></p>
              <p><a id="valid4n">ascii alphanumeric</a> from infra</p>
              <p>Remains normative: <a>URL parser</a> from URL.</p>
            </div>
            <p class="informative">Remains normative: <a id="valid6n">URL parser</a> from URL.</p>
          </section>
        </section>
      </section>
    `;
    const config = {
      xref: { url: `${location.origin}/tests/data/xref/refs.json` },
      localBiblio,
    };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const validLinks = [...doc.querySelectorAll("#test a:not([id='invalid'])")];
    for (const link of validLinks) {
      expect(link.classList.contains("respec-offending-element")).toBeFalsy();
    }
    const valid1 = doc.getElementById("valid1");
    expect(valid1.href).toBe("https://example.com/#fake-inform-1");
    const valid1n = doc.getElementById("valid1n");
    expect(valid1n.href).toBe(expectedLinks.get("list"));
    const valid2 = doc.getElementById("valid2");
    expect(valid2.href).toBe("https://example.com/#fake-inform-2");
    const valid2n = doc.getElementById("valid2n");
    expect(valid2n.href).toBe(expectedLinks.get("event handler"));
    const valid3 = doc.getElementById("valid3");
    expect(valid3.href).toBe("https://example.com/#fake-inform-3");
    const valid3n = doc.getElementById("valid3n");
    expect(valid3n.href).toBe(expectedLinks.get("dictionary"));
    const valid4 = doc.getElementById("valid4");
    expect(valid4.href).toBe("https://example.com/#fake-inform-4");
    const valid4n = doc.getElementById("valid4n");
    expect(valid4n.href).toBe(expectedLinks.get("alphanumeric"));
    const valid5n = doc.getElementById("valid5n");
    expect(valid5n.href).toBe(expectedLinks.get("url parser"));
    const valid6n = doc.getElementById("valid6n");
    expect(valid6n.href).toBe(expectedLinks.get("url parser"));

    const badLink = doc.getElementById("invalid");
    expect(badLink.href).toBe(
      "https://www.w3.org/TR/css-values-3/#bearing-angle"
    );
    expect(badLink.classList).toContain("respec-offending-element");
    expect(badLink.title).toBe(
      "Error: Informative reference in normative section"
    );

    const normRefs = [...doc.querySelectorAll("#normative-references dt")];
    expect(normRefs.length).toBe(1); // excludes `css-values` of `#invalid`
    expect(normRefs.map(r => r.textContent)).toEqual(["[URL]"]);

    const informRefs = [...doc.querySelectorAll("#informative-references dt")];
    expect(informRefs.map(r => r.textContent).join()).toBe(
      "[html],[infra],[local-1],[local-2],[local-3],[local-4],[webidl]"
    );
  });

  describe("inline IDL references", () => {
    it("ignores inlines starting with backslash", async () => {
      // whitespace inside {{ }} doesn't matter
      const body = `<section><p id="test">{{\\PASS }}</p></section>`;
      const config = { xref: true };
      const ops = makeStandardOps(config, body);
      const doc = await makeRSDoc(ops);
      const el = doc.getElementById("test");
      expect(el.querySelector("code a")).toBeFalsy();
      expect(el.textContent).toBe("{{PASS }}");
    });

    it("ignores malformed syntax", async () => {
      const body = `<section><p id="test">{ {  PASS }}</p></section>`;
      const config = { xref: true };
      const ops = makeStandardOps(config, body);
      const doc = await makeRSDoc(ops);
      const el = doc.getElementById("test");
      expect(el.querySelector("code a")).toBeFalsy();
      expect(el.textContent).toBe("{ {  PASS }}");
    });

    it("shows error if IDL string parsing fails", async () => {
      const body = `<section id="test">text {{"imp"orts" }} text</section>`;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const el = doc.getElementById("test");
      expect(el.querySelector("code a")).toBeFalsy();
      const errorEl = el.querySelector("span.respec-offending-element");
      expect(errorEl).toBeTruthy();
      expect(el.textContent).toBe(`text {{ "imp"orts" }} text`);
    });

    it("links inline IDL references", async () => {
      const body = `
      <section id="test">
        <p id="link1">{{ Window }} and {{EventTarget}}</p>
        <p id="link2">{{ [[query]] }} has no meaning without forContext</p>
        <p id="link3"> This should work {{
              EventTarget

        }} , i.e. should trim the whitespace.</p>
      </section>
      `;
      const config = { xref: true, localBiblio };
      const ops = makeStandardOps(config, body);
      const doc = await makeRSDoc(ops);

      const [windowLink, eventTargetLink] = doc.querySelectorAll("#link1 a");
      expect(windowLink.href).toBe(expectedLinks.get("Window"));
      expect(eventTargetLink.href).toBe(expectedLinks.get("EventTarget"));
      expect(eventTargetLink.firstElementChild.localName).toBe("code");

      const link2 = doc.querySelector("#link2 a");
      expect(link2.href).toBeFalsy();
      expect(link2.textContent).toBe("[[query]]");
      expect(link2.firstElementChild.localName).toBe("code");

      const link3 = doc.querySelector("#link3 a");
      expect(link3.href).toBe(expectedLinks.get("EventTarget"));
      expect(link3.textContent).toBe("EventTarget");
      expect(link3.firstElementChild.localName).toBe("code");
    });

    it("links methods", async () => {
      const body = `
      <section id="test">
        <p id="link1">{{ EventTarget.addEventListener(type, callback) }}</p>
        <p id="link2">{{ ChildNode.after(...nodes) }}</p>
        <p id="link3">{{ URLSearchParams.append(name, value) }} is not ambiguous</p>
      </section>
      `;
      const config = { xref: true, localBiblio };
      const ops = makeStandardOps(config, body);
      const doc = await makeRSDoc(ops);

      const [link1a, link1b] = [...doc.querySelectorAll("#link1 a")];
      expect(link1a.href).toBe(expectedLinks.get("EventTarget"));
      expect(link1b.href).toBe(
        expectedLinks.get("EventTarget.addEventListener")
      );
      expect(link1a.firstElementChild.localName).toBe("code");
      expect(link1b.firstElementChild.localName).toBe("code");
      const vars1 = [...doc.querySelectorAll("#link1 var")];
      expect(vars1.length).toBe(2);
      expect(vars1[0].textContent).toBe("type");
      expect(vars1[1].textContent).toBe("callback");

      const [link2a, link2b] = [...doc.querySelectorAll("#link2 a")];
      expect(link2a.href).toBe(expectedLinks.get("ChildNode"));
      expect(link2a.firstElementChild.localName).toBe("code");
      expect(link2b.href).toBe(expectedLinks.get("ChildNode.after"));
      expect(link2b.firstElementChild.localName).toBe("code");

      const [link3a, link3b] = [...doc.querySelectorAll("#link3 a")];
      expect(link3a.href).toBe(expectedLinks.get("URLSearchParams"));
      expect(link3b.href).toBe(expectedLinks.get("URLSearchParams.append"));
      expect(link3a.firstElementChild.localName).toBe("code");
      expect(link3b.firstElementChild.localName).toBe("code");
    });

    it("links attribute and dict-member", async () => {
      const body = `
      <section>
        <p id="link1">{{Window.event}}</p>
        <p id="link2">{{ Credential.[[type]] }}</p>
        <p id="link3">{{ PublicKeyCredential.[[type]] }}</p>
        <p id="link4">{{ TextDecoderOptions.fatal }}</p>
      </section>
      `;
      const config = {
        xref: ["html", "credential-management", "encoding", "dom", "webauthn"],
        localBiblio,
      };
      const ops = makeStandardOps(config, body);
      const doc = await makeRSDoc(ops);

      const [link1a, link1b] = [...doc.querySelectorAll("#link1 a")];
      expect(link1a.href).toBe(expectedLinks.get("Window"));
      expect(link1b.href).toBe(expectedLinks.get("Window.event"));
      expect(link1a.firstElementChild.localName).toBe("code");
      expect(link1b.firstElementChild.localName).toBe("code");

      // the base "Credential" is used to disambiguate as "forContext"
      const [link2a, link2b] = [...doc.querySelectorAll("#link2 a")];
      expect(link2a.href).toBe(expectedLinks.get("Credential"));
      expect(link2b.href).toBe(expectedLinks.get("Credential.[[type]]"));
      expect(link2a.firstElementChild.localName).toBe("code");
      expect(link2b.firstElementChild.localName).toBe("code");

      const [link3a, link3b] = [...doc.querySelectorAll("#link3 a")];
      expect(link3a.href).toBe(expectedLinks.get("PublicKeyCredential"));
      expect(link3b.href).toBe(
        expectedLinks.get("PublicKeyCredential.[[type]]")
      );
      expect(link3a.firstElementChild.localName).toBe("code");
      expect(link3b.firstElementChild.localName).toBe("code");

      // "TextDecoderOptions" is dictionary and "fatal" is dict-member
      const [link4a, link4b] = [...doc.querySelectorAll("#link4 a")];
      expect(link4a.href).toBe(expectedLinks.get("TextDecoderOptions"));
      expect(link4b.href).toBe(
        expectedLinks.get(`TextDecoderOptions["fatal"]`)
      );
      expect(link4a.firstElementChild.localName).toBe("code");
      expect(link4b.firstElementChild.localName).toBe("code");
    });

    it("links internalSlots", async () => {
      const body = `
      <section>
        <p><dfn>[[\\type]]</dfn></p>
        <p id="link1">{{ [[type]] }}</p>
        <p id="link2">{{ Credential.[[type]] }}</p>
      </section>
      `;
      const config = { xref: true, localBiblio };
      const ops = makeStandardOps(config, body);
      const doc = await makeRSDoc(ops);

      // as base == [[type]], it is treated as a local internal slot
      const link1 = doc.querySelector("#link1 a");
      expect(link1.getAttribute("href")).toBe("#dfn-type");
      expect(link1.firstElementChild.localName).toBe("code");

      // the base "Credential" is used as "forContext" for [[type]]
      const [link2a, link2b] = [...doc.querySelectorAll("#link2 a")];
      expect(link2a.href).toBe(expectedLinks.get("Credential"));
      expect(link2b.href).toBe(expectedLinks.get("Credential.[[type]]"));
      expect(link2a.firstElementChild.localName).toBe("code");
      expect(link2b.firstElementChild.localName).toBe("code");
    });

    it("links enum and enum-values", async () => {
      const body = `
        <section id="test">
          <pre class="idl">
          enum Foo { "dashed-thing", "" };
          </pre>
          <p id="link1">{{ ReferrerPolicy["no-referrer"] }}</p>
          <p id="link2">{{ ReferrerPolicy[""] }}</p>
          <div data-dfn-for="Foo">
            <dfn>dashed-thing</dfn> <dfn>""</dfn>
          </div>
          <p id="link3">{{ Foo["dashed-thing"] }} {{Foo[""]}}</p>
        </section>
      `;
      const config = { xref: ["referrer-policy"], localBiblio };
      const ops = makeStandardOps(config, body);
      const doc = await makeRSDoc(ops);

      const link1 = doc.getElementById("link1");
      expect(link1.textContent).toBe(`"no-referrer"`);
      expect(link1.querySelector("a").textContent).toBe("no-referrer");
      expect(link1.querySelector("a").href).toBe(
        "https://www.w3.org/TR/referrer-policy/#dom-referrerpolicy-no-referrer"
      );

      const link2 = doc.getElementById("link2");
      expect(link2.textContent).toBe(`""`);
      expect(link2.querySelector("a").href).toBe(
        "https://www.w3.org/TR/referrer-policy/#dom-referrerpolicy"
      );

      const [dashedThing, qualifiedEmpty] = doc.querySelectorAll("#link3 a");
      expect(dashedThing.textContent).toBe("dashed-thing");
      expect(dashedThing.getAttribute("href")).toBe("#dom-foo-dashed-thing");
      expect(qualifiedEmpty.textContent).toBe("");
      expect(qualifiedEmpty.getAttribute("href")).toBe(
        "#dom-foo-the-empty-string"
      );
    });

    it("links idl primitives that have spaces", async () => {
      const body = `
      <section id="test">
        {{
          unsigned
          long
          long
        }}
        {{  unrestricted   float
        }}
        {{double}}
      </section>
      `;
      const config = { xref: true, localBiblio };
      const ops = makeStandardOps(config, body);
      const doc = await makeRSDoc(ops);

      const [uLongLong, unrestrictedFloat, double] = doc.querySelectorAll(
        "#test a"
      );

      expect(uLongLong.textContent).toBe("unsigned long long");
      expect(uLongLong.hash).toBe("#idl-unsigned-long-long");

      expect(unrestrictedFloat.textContent).toBe("unrestricted float");
      expect(unrestrictedFloat.hash).toBe("#idl-unrestricted-float");

      expect(double.textContent).toBe("double");
      expect(double.hash).toBe("#idl-double");
    });

    it("links local definitions first", async () => {
      const body = `
        <section data-dfn-for="PaymentAddress" data-link-for="PaymentAddress">
          <h2><dfn>PaymentAddress</dfn> interface</h2>
          <pre class="idl">
            [Exposed=Window]
            interface PaymentAddress {
              attribute DOMString languageCode;
            };
          </pre>
          <dfn>languageCode</dfn> attribute of PaymentAddress.
        </section>
        <section id="test">
          <h2>Ignore</h2>
          <p>Some other <dfn>languageCode</dfn> definitions.</p>
          <p id="link-internal">{{ PaymentAddress.languageCode }} links to PaymentAddress definitions.</p>
          <p id="link-internal-dfn">{{ languageCode }} links to some other definitions.</p>
          <p id="link-external">{{ Window.event }} links to html spec.</p>
        </section>
      `;
      const config = { xref: "web-platform", localBiblio };
      const ops = makeStandardOps(config, body);
      const doc = await makeRSDoc(ops);

      const externalLinks = [...doc.querySelectorAll("#link-external a")];
      expect(externalLinks[0].href).toBe(expectedLinks.get("Window"));
      expect(externalLinks[1].href).toBe(expectedLinks.get("Window.event"));

      const paymentAddressLinks = [...doc.querySelectorAll("#link-internal a")];
      expect(paymentAddressLinks[0].getAttribute("href")).toBe(
        "#dom-paymentaddress"
      );
      expect(paymentAddressLinks[1].getAttribute("href")).toBe(
        "#dom-paymentaddress-languagecode"
      );

      const internalLink = doc.querySelector("#link-internal-dfn a");
      expect(internalLink.getAttribute("href")).toBe("#dfn-languagecode");
    });
  });

  describe("Handle configurations correctly", () => {
    it("xref as array of specifications", async () => {
      const ops = {
        config: { xref: ["a", "b", "c"] },
        bodyAttrs: {
          "data-cite": "SVG DOM",
        },
        body: makeDefaultBody(),
      };
      const doc = await makeRSDoc(ops);
      expect(doc.body.dataset.cite.split(" ")).toEqual(
        jasmine.arrayWithExactContents(["b", "SVG", "a", "DOM", "c"])
      );
    });

    it("xref as profile string - valid profile", async () => {
      const ops = {
        config: { xref: "WEB-PLATFORM" },
        bodyAttrs: {
          "data-cite": "SVG XHR",
        },
        body: makeDefaultBody(),
      };
      const doc = await makeRSDoc(ops);
      expect(doc.body.dataset.cite.split(" ")).toEqual(
        jasmine.arrayWithExactContents([
          "HTML",
          "INFRA",
          "URL",
          "SVG",
          "XHR",
          "WEBIDL",
          "DOM",
          "FETCH",
        ])
      );
    });

    it("xref as object with valid profile and specs", async () => {
      const ops = {
        config: { xref: { specs: ["a", "b", "c"], profile: "WEB-PLATFORM" } },
        bodyAttrs: {
          "data-cite": "SVG XHR",
        },
        body: makeDefaultBody(),
      };
      const doc = await makeRSDoc(ops);
      expect(doc.body.dataset.cite.split(" ")).toEqual(
        jasmine.arrayWithExactContents([
          "HTML",
          "INFRA",
          "URL",
          "SVG",
          "XHR",
          "WEBIDL",
          "a",
          "b",
          "c",
          "DOM",
          "FETCH",
        ])
      );
    });

    it("xref as profile string - invalid profile", async () => {
      const ops = {
        config: { xref: "W4C" },
        bodyAttrs: {
          "data-cite": "SVG XHR",
        },
        body: makeDefaultBody(),
      };
      const doc = await makeRSDoc(ops);
      expect(doc.body.dataset.cite.split(" ")).toEqual(
        jasmine.arrayWithExactContents(["SVG", "XHR"])
      );
    });

    it("xref as object with invalid profile but valid specs", async () => {
      const ops = {
        config: { xref: { specs: ["a", "b", "c"], profile: "W4C" } },
        bodyAttrs: {
          "data-cite": "SVG XHR",
        },
        body: makeDefaultBody(),
      };
      const doc = await makeRSDoc(ops);
      expect(doc.body.dataset.cite.split(" ")).toEqual(
        jasmine.arrayWithExactContents(["XHR", "a", "SVG", "b", "c"])
      );
    });

    it("xref as invalid syntax", async () => {
      const ops = {
        config: { xref: 123 },
        bodyAttrs: {
          "data-cite": "SVG XHR",
        },
        body: makeDefaultBody(),
      };
      const doc = await makeRSDoc(ops);
      expect(doc.body.dataset.cite.split(" ")).toEqual(
        jasmine.arrayWithExactContents(["XHR", "SVG"])
      );
    });
  });

  it("caches results and uses cached results when available", async () => {
    const config = { xref: true, localBiblio };
    const keys = new Map([
      ["dictionary", "7a82727efd37620ec8b50cac9dca75d1b1f08d94"],
      ["url parser", "b3f39e21ff440b3efd5949b8952c0f23f11b23a2"],
    ]);

    const body1 = `
      <section>
        <p><a id="link">dictionary</a><p>
      </section>`;

    expectAsync(cache.keys()).toBeResolvedTo([]);
    const preCacheDoc = await makeRSDoc(makeStandardOps(config, body1));
    expect(preCacheDoc.getElementById("link").href).toBe(
      expectedLinks.get("dictionary")
    );
    expectAsync(cache.keys()).toBeResolvedTo([
      keys.get("dictionary"),
      "__LAST_VERSION_CHECK__",
    ]);

    // no new data was requested from server, cache shoudln't change
    const postCacheDoc = await makeRSDoc(makeStandardOps(config, body1));
    expect(postCacheDoc.getElementById("link").href).toBe(
      expectedLinks.get("dictionary")
    );
    expectAsync(cache.keys()).toBeResolvedTo([
      keys.get("dictionary"),
      "__LAST_VERSION_CHECK__",
    ]);

    // new data was requested from server, cache should change
    const body2 = `
      <section>
        <p><a id="link-1">dictionary</a><p>
        <p><a id="link-2">URL parser</a><p>
      </section>
    `;
    const updatedCacheDoc = await makeRSDoc(makeStandardOps(config, body2));
    expect(updatedCacheDoc.getElementById("link-1").href).toBe(
      expectedLinks.get("dictionary")
    );
    expect(updatedCacheDoc.getElementById("link-2").href).toBe(
      expectedLinks.get("url parser")
    );
    expectAsync(cache.keys()).toBeResolvedTo([
      keys.get("dictionary"),
      "__LAST_VERSION_CHECK__",
      keys.get("url parser"),
    ]);
  });

  it("respects requests to not perform an xref lookup", async () => {
    const body = `
      <section>
      <a id="test1" data-cite="service-workers" data-no-xref>JSON</a>
      <a id="test2" data-cite="service-workers">JSON</a>
      </section>
    `;
    const config = { xref: ["service-workers"], localBiblio };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);
    const test1 = doc.getElementById("test1");
    expect(test1.href).toBe("https://www.w3.org/TR/service-workers-1/");
    expect(test1.classList).not.toContain("respec-offending-element");
    const test2 = doc.getElementById("test2");
    expect(test2.classList).toContain("respec-offending-element");
  });
});
