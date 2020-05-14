"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core — Link to definitions", () => {
  afterAll(flushIframes);

  it("removes non-alphanum chars from fragment components", async () => {
    const bodyText = `
      <section>
        <h2>Test section</h2>
        <p><dfn>[[\\test]]</dfn><a id="testAnchor">[[\\test]]</a>
      </section>`;
    const ops = makeStandardOps(null, bodyText);
    const doc = await makeRSDoc(ops);
    const a = doc.getElementById("testAnchor");
    expect(a).toBeTruthy();
    expect(a.hash).toBe("#dfn-test");
    const decodedHash = decodeURIComponent(a.hash);
    expect(doc.getElementById(decodedHash.slice(1))).toBeTruthy();
  });

  it("links to IDL definitions and wraps in code if needed", async () => {
    const bodyText = `
      <section data-link-for="Request">
        <h2><dfn>Request</dfn> interface</h2>
        <pre class="idl">
          [Exposed=Window]
          interface Request {
            Request clone();
          };
        </pre>
        <p id="codeWrap">A <a>Request</a> object has a <dfn>clone</dfn> method.</p>
        <p id="codeWrapMethod"><a>clone</a>, <a>clone()</a>, <a>Request.clone</a>, and <a>Request.clone()</a> are all same.</p>
        <p id="noCodeWrap">An instance of <a data-lt="Request">the request interface</a>.</p>
      </section>`;
    const ops = makeStandardOps(null, bodyText);
    const doc = await makeRSDoc(ops);
    const hasCode = doc.body.querySelector("#codeWrap a");
    expect(hasCode).toBeTruthy();
    expect(hasCode.firstElementChild.localName).toBe("code");
    expect(hasCode.textContent).toBe("Request");
    const codeWrapMethods = doc.body.querySelectorAll("#codeWrapMethod a code");
    expect(codeWrapMethods.length).toBe(4);
    const noCodeWrap = doc.body.querySelector("#noCodeWrap a");
    expect(noCodeWrap).toBeTruthy();
    expect(noCodeWrap.getAttribute("href")).toBe("#dom-request");
    expect(noCodeWrap.querySelector("code")).toBeFalsy();
    expect(noCodeWrap.textContent).toBe("the request interface");
  });

  it("checks for duplicate definitions", async () => {
    const bodyText = `
      <section>
        <h2>Test Section</h2>
        <dfn>Test1</dfn>
        <dfn id="duplicate-definition">Test1</dfn>
        <dfn>Test1</dfn>
        <dfn title="test1">Test1</dfn>

        <dfn data-dfn-type="idl">Test1</dfn>
        <dfn data-dfn-type="idl">Test1</dfn>
      </section>`;
    const ops = makeStandardOps(null, bodyText);
    const doc = await makeRSDoc(ops);
    const dfnList = doc.body.querySelectorAll("dfn");

    const dfn1 = dfnList[1];
    expect(dfn1).toBeTruthy();
    expect(dfn1.classList).toContain("respec-offending-element");
    expect(dfn1.id).toBe("duplicate-definition");

    const dfn2 = dfnList[2];
    expect(dfn2).toBeTruthy();
    expect(dfn2.classList).toContain("respec-offending-element");
    expect(dfn2.id).toBeDefined();

    const dfn3 = dfnList[3];
    expect(dfn3).toBeTruthy();
    expect(dfn3.classList).toContain("respec-offending-element");
    expect(dfn3.title).toBe("test1");

    expect(dfnList[4].classList).not.toContain("respec-offending-element");
    expect(dfnList[5].classList).toContain("respec-offending-element");
  });

  it("has data-dfn-for if it's included", async () => {
    const bodyText = `
      <section>
        <h2>Test Section</h2>
        <dfn data-dfn-for="Foo">Test1</dfn>
      </section>`;
    const ops = makeStandardOps(null, bodyText);
    const doc = await makeRSDoc(ops);
    const [dfn] = doc.getElementsByTagName("dfn");
    expect(dfn.dataset.dfnFor).toBe("Foo");
  });

  it("has empty data-dfn-for on top level things", async () => {
    const bodyText = `
      <section data-dfn-for="HyperStar" data-link-for="HyperStar">
        <pre class="idl">
          [Exposed=Window]
          interface HyperStar {
            constructor();
            attribute DOMString attr;
            void meth();
          };
          enum Planet {
            "tiny",
            "massive"
          };
        </pre>
        <div id="test">
          <p><dfn>HyperStar</dfn></p>
          <p><dfn>attr</dfn></p>
          <p><dfn>meth()</dfn></p>
          <p><dfn>Planet</dfn></p>
          <p data-dfn-for="Planet"><dfn>tiny</dfn></p>
        </div>
      </section>`;
    const ops = makeStandardOps(null, bodyText);
    const doc = await makeRSDoc(ops);

    const [
      dfnInterface,
      dfnAttr,
      dfnMethod,
      dfnEnum,
      dfnEnumValue,
    ] = doc.querySelectorAll("#test dfn");
    expect(dfnInterface.dataset.dfnFor).toBe("");
    expect(dfnAttr.dataset.dfnFor).toBe("HyperStar");
    expect(dfnMethod.dataset.dfnFor).toBe("HyperStar");
    expect(dfnEnum.dataset.dfnFor).toBe("");
    expect(dfnEnumValue.dataset.dfnFor).toBe("Planet");
  });

  it("links local dfn with external forContext", async () => {
    const body = `
      <div id="test">
        <dfn id="vis-state">Visibility State</dfn> and
        <dfn id="vis-state-hidden" data-dfn-for="visibility state">hidden</dfn>
        are defined entirely locally. [= Visibility state =] [= visibility
        state/hidden =].
        <dfn id="document-hidden" data-dfn-for="Document">hidden</dfn> is
        defined here, but Document is external. [= Document/hidden =]
      </div>
    `;
    const config = { xref: ["DOM"] };
    const ops = makeStandardOps(config, body);
    const doc = await makeRSDoc(ops);

    const [
      visibilityState,
      visibilityStateHidden,
      documentHidden,
    ] = doc.querySelectorAll("#test a");

    expect(visibilityState.hash).toBe("#vis-state");
    expect(visibilityStateHidden.hash).toBe("#vis-state-hidden");

    expect(documentHidden.hash).toBe("#document-hidden");
    expect(documentHidden.classList).not.toContain("respec-offending-element");
  });

  it("should get ID from the first match", async () => {
    const bodyText = `
      <section>
        <h2>Test Section</h2>
        <dfn data-lt="Test2">Test1</dfn>
        <a>Test2</a>
        <a>Test1</a>
      </section>`;
    const ops = makeStandardOps(null, bodyText);
    const doc = await makeRSDoc(ops);
    const [dfn] = doc.getElementsByTagName("dfn");
    expect(dfn.id).toBe("dfn-test2");
  });

  it("prefers data-lt over text content", async () => {
    const bodyText = `
      <section>
        <h2>Test Section</h2>
        <pre class="idl">
          interface Presentation {};
        </pre>
        <dfn>Foo</dfn>
        <dfn>Bar</dfn>
        <a id="testFoo" data-lt="Foo">Presentation</a>
        <a id="testBar" data-lt="Bar">Foo</a>
      </section>`;
    const ops = makeStandardOps(null, bodyText);
    const doc = await makeRSDoc(ops);
    const testFoo = doc.getElementById("testFoo");
    const testBar = doc.getElementById("testBar");
    expect(testFoo.hash).toBe("#dfn-foo");
    expect(testBar.hash).toBe("#dfn-bar");
  });

  it("links conceptual definitions case insensitively", async () => {
    const bodyText = `
    <section>
      <h2>Test Section</h2>
      <p><dfn>Test String</dfn>
      <p id="links"><a>test string</a> <a>test STRING</a> <a>TesT string</a>
    </section>`;
    const ops = makeStandardOps(null, bodyText);
    const doc = await makeRSDoc(ops);
    expect(
      doc.querySelectorAll("#links a[href='#dfn-test-string']").length
    ).toBe(3);
  });

  describe("for-context for concepts and no WebIDL", () => {
    let doc;
    const body = `
      <section>
        <h2>data-dfn-for concepts without WebIDL</h2>
        <div id="parent-concept">
          <dfn>Card</dfn> is a concept. [= Card =] <a>Card</a>
          <a data-link-for="Card">Card</a>
          <span data-link-for="Card"><a>Card</a></span>
        </div>
        <div data-dfn-for="Card">
          <dfn data-dfn-for="Card">owner name</dfn>
          <dfn>Expiry date</dfn>
          <p id="links-link-for-on-anchor">
            [= Card/owner name =]
            <a data-link-for="Card" data-link-type="dfn">owner name</a>
          </p>
          <p id="links-link-for-on-parent" data-link-for="Card">
            [= expiry date =]
            <a data-link-type="dfn">Expiry date</a>
          </p>
          <p id="fail-as-unknown-scope">
            <a>Owner name</a>
            <a>expiry date</a>
          </p>
          <p id="fail-as-misunderstood-type">
            As it has a data-link-for and no data-link-type, data-link-type is
            assumed to be "idl".
            <a data-link-for="Card">owner name</a>
            <a data-link-for="Card" data-link-type="idl">expiry date</a>
          </p>
        </div>
      </section>
    `;
    beforeAll(async () => {
      const ops = makeStandardOps(null, body);
      doc = await makeRSDoc(ops);
    });

    it("links parent concept", () => {
      const links = doc.querySelectorAll("#parent-concept a");
      expect([...links].map(a => a.hash)).toEqual(Array(4).fill("#dfn-card"));
    });

    it("links child concept with data-link-for on anchor", () => {
      const links = doc.querySelectorAll("#links-link-for-on-anchor a");
      expect([...links].map(a => a.hash)).toEqual(
        Array(2).fill("#dfn-owner-name")
      );
    });

    it("links child concept with data-link-for on anchor parent", () => {
      const links = doc.querySelectorAll("#links-link-for-on-parent a");
      expect([...links].map(a => a.hash)).toEqual(
        Array(2).fill("#dfn-expiry-date")
      );
    });

    it("fails to link if for context is not known", () => {
      const links = doc.querySelectorAll("#fail-as-unknown-scope a");
      expect([...links].map(a => a.hash)).toEqual(Array(2).fill(""));
      const offendingLinks = doc.querySelectorAll(
        "#fail-as-unknown-scope a.respec-offending-element"
      );
      expect(offendingLinks.length).toBe(2);
      expect(offendingLinks[0].title).toMatch(/no matching dfn/i);
    });

    it("fails to link when data-link-type is misunderstood", () => {
      const links = doc.querySelectorAll("#fail-as-misunderstood-type a");
      expect([...links].map(a => a.hash)).toEqual(Array(2).fill(""));
      expect(links[0].title).toMatch(/no matching dfn/i);
    });
  });

  describe("distinguishes between definition types - idl vs dfn", () => {
    let doc;
    const body = `
      <section>
        <h2>Ideal linking methods</h2>
        <pre class="idl">
          [Exposed=Window]
          interface City {
            attribute DOMString light;
          };
        </pre>
        <p data-dfn-for="City">
          The <dfn id="idl-city-light">light</dfn> attribute.
        </p>
        <p id="idl-link">Links to the attribute {{City/light}}.</p>

        <p>
          The <dfn data-dfn-for="City" data-dfn-type="dfn" id="dfn-city-light">light</dfn> concept.
        </p>
        <p id="concept-link">Links to the concept of [=City/light=].</p>
      </section>

      <section data-link-for="Building" data-dfn-for="Building">
        <h2>Building</h2>
        <pre class="idl">
          [Exposed=Window]
          interface Building {
            attribute DOMString light;
          };
        </pre>
        <div id="dfns">
          <p>
            Define <dfn id="idl-building-light">light</dfn> as idl using
            parent's data-dfn-for.
          </p>
          <p>
            Define <dfn data-dfn-for="" data-dfn-type="dfn" id="dfn-global-light">light</dfn>
            as a global concept.
          </p>
          <p>
            Define <dfn data-dfn-type="dfn" id="dfn-building-light">light</dfn>
            as a concept for Building, using parent's data-dfn-for.
          </p>
        </div>
        <div id="links-building-light-idl">
          <p>
            <a>light</a> links to Building's idl, using parent's data-link-for.
          </p>
          <p>
            <a data-link-for="Building">light</a> also links to Building's idl.
          </p>
          <p>{{light}} also uses paren't data-link-for</p>
          <p>{{Building/light}}</p>
        </div>
        <div id="links-building-light-concept">
          <p>
            <a data-link-for="Building" data-link-type="dfn">light</a> links to
            concept for Building.
          </p>
          <p>
            <a data-link-type="dfn">light</a> links to concept for Building
            using parent's data-link-for.
          </p>
        </div>
        <div id="links-link-for">
          <p>link with explicit for context: Building {{ Building/light }}</p>
          <p>link with parent for context: Building {{ light }}</p>
          <p>link with explicit for context: City {{ City/light }}</p>
        </div>
        <div id="links-global-link-for">
          Inside a parent having a data-link-for,
          <p>
            <a data-link-for="" data-link-type="dfn">light</a> links to global
            (data-dfn-for="") light concept.
          </p>
          <p>
            <a data-link-for="">light</a> also links to global (data-dfn-for="")
            concept, as there is no other "light" defined with
            data-dfn-type="dfn".
          </p>
          <p>[= /light =] allow passing empty linkFor in shorthand (TODO).</p>
        </div>
        <p>
          [= Building/light =] can't link idl using concept linking shorthand,
          which is good.
        </p>
      </section>

      <section id="links-outside-defining-section">
        <h2>Linking outside defining sectione</h2>
        <p>[= light =] links to light without dfn dfn-for or dfn-for=""</p>
        <p>[= /light =] links to light with dfn-for=""</p>
        <p>[= City/light =]</p>
        <p>{{ City/light }}</p>
        <p>[= Building/light =]</p>
        <p>{{ Building/light }}</p>
        <p>{{ light }} is ambigious, gets tried externally and fails.</p>
      </section>
    `;
    beforeAll(async () => {
      const ops = makeStandardOps(null, body);
      doc = await makeRSDoc(ops);
    });

    it("links properly under ideal conditions", () => {
      const idlLink = doc.querySelector("#idl-link a");
      expect(idlLink.hash).toBe("#idl-city-light");
      expect(idlLink.querySelector("code")).toBeTruthy();

      const conceptLink = doc.querySelector("#concept-link a");
      expect(conceptLink.hash).toBe("#dfn-city-light");
      expect(conceptLink.querySelector("code")).toBeFalsy();
    });

    it("distinguishes dfn based on data-dfn-type and data-dfn-for", () => {
      const dfns = doc.querySelectorAll("#dfns dfn");
      expect(dfns.length).toBe(3);
      expect(
        doc.querySelector("#dfns dfn.respec-offending-element")
      ).toBeFalsy();
    });

    it("links to IDL definition in multiple scenarios", () => {
      const links = doc.querySelectorAll("#links-building-light-idl a");
      expect([...links].map(a => a.hash)).toEqual(
        Array(4).fill("#idl-building-light")
      );
    });

    it("links to conceptual definition in multiple scenarios", () => {
      const links = doc.querySelectorAll("#links-building-light-concept a");
      expect([...links].map(a => a.hash)).toEqual(
        Array(2).fill("#dfn-building-light")
      );
    });

    it("links to idl definitions taking for-context into acount", () => {
      const links = doc.querySelectorAll("#links-link-for a");
      expect(links[0].hash).toEqual("#idl-building-light");
      expect(links[1].hash).toEqual("#idl-building-light");
      expect(links[2].hash).toEqual("#idl-city-light");
      expect(doc.querySelectorAll("#links-link-for a > code").length).toBe(3);
    });

    it("links to global dfn overriding parent's data-link-for", () => {
      const links = doc.querySelectorAll("#links-global-link-for a");
      expect([...links].map(a => a.hash)).toEqual(
        Array(3).fill("#dfn-global-light")
      );
    });

    it("links properly outside defining parent", () => {
      const [
        globalConcept1,
        globalConcept2,
        scopedConcept1,
        scopedIDL1,
        scopedConcept2,
        scopedIDL2,
        invalidScope,
      ] = doc.querySelectorAll("#links-outside-defining-section p a");

      expect(globalConcept1.hash).toBe("#dfn-global-light");
      expect(globalConcept2.hash).toBe("#dfn-global-light");

      expect(scopedConcept1.hash).toBe("#dfn-city-light");
      expect(scopedIDL1.hash).toBe("#idl-city-light");

      expect(scopedConcept2.hash).toBe("#dfn-building-light");
      expect(scopedIDL2.hash).toBe("#idl-building-light");

      expect(invalidScope.classList).toContain("respec-offending-element");
      expect(
        doc.querySelectorAll(
          "#links-outside-defining-section a.respec-offending-element"
        ).length
      ).toBe(1);
    });
  });
});
