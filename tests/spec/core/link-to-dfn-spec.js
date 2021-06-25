"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core — Link to definitions", () => {
  afterAll(flushIframes);

  it("removes non-alphanum chars from fragment components", async () => {
    const bodyText = `
      <section>
        <h2>Test section</h2>
        <p>
          <dfn data-dfn-for="Window">[[\\test]]</dfn>
          <a data-link-for="Window" id="testAnchor">[[\\test]]</a>
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
    expect(codeWrapMethods).toHaveSize(4);
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
        <dfn data-dfn-type="dfn">Test1</dfn>

        <div id="type-idl">
          <dfn data-dfn-type="idl">Test1</dfn>
          <dfn data-dfn-type="idl">Test1</dfn>
        </div>

        <div id="type-idl-for-test">
          <dfn data-dfn-type="idl" data-dfn-for="Test">Test1</dfn>
          <dfn data-dfn-type="idl" data-dfn-for="Test">Test1</dfn>
        </div>
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

    const dfn4 = dfnList[4];
    expect(dfn4.classList).toContain("respec-offending-element");

    const [idlGood, idlDup] = doc.querySelectorAll("#type-idl dfn");
    expect(idlGood.classList).not.toContain("respec-offending-element");
    expect(idlDup.classList).toContain("respec-offending-element");

    const [forGood, forDup] = doc.querySelectorAll("#type-idl-for-test dfn");
    expect(forGood.classList).not.toContain("respec-offending-element");
    expect(forDup.classList).toContain("respec-offending-element");
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

  it("uses data-dfn-type in linking", async () => {
    const body = `
      <section>
        <dfn id="dfn-card" data-dfn-type="dfn">Card</dfn> is a concept.
        <dfn id="idl-card" data-dfn-type="idl">Card</dfn> is an IDL interface.
        <div id="dfn-links">
          [= Card =] <a>Card</a> <a data-link-type="dfn">card</a>
        </div>
        <div id="idl-links">{{ Card }} <a data-link-type="idl">Card</a></div>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const conceptLinks = doc.querySelectorAll("#dfn-links a");
    expect([...conceptLinks].map(a => a.hash)).toEqual(
      Array(3).fill("#dfn-card")
    );

    const idlLinks = doc.querySelectorAll("#idl-links a");
    expect([...idlLinks].map(a => a.hash)).toEqual(Array(2).fill("#idl-card"));
  });

  it("treats internal slots as idl", async () => {
    const body = `
      <section id="test">
        <dfn data-dfn-for="MyEvent">[[\\aSlot]]</dfn>
        <dfn data-dfn-for="MyEvent">[[\\an internal slot]](foo, bar)</dfn>
        <dfn>MyEvent</dfn>
        <p id="link-slots">
          <span>{{ MyEvent/[[aSlot]] }}</span>
          <span>{{ MyEvent/[[an internal slot]](foo, bar) }}</span>
        </p>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const [dfn1, dfn2] = doc.querySelectorAll("#test dfn");
    const [link1, link2] = doc.querySelectorAll("#link-slots a");
    expect(link1.hash).toBe(`#${dfn1.id}`);
    expect(link2.hash).toBe(`#${dfn2.id}`);
  });

  it("supports internal slot being a method with no args", async () => {
    const body = `
      <section>
        <dfn id="method" data-dfn-for="MyEvent">
          [[\\an internal_slot]]()
        </dfn>
        <dfn>MyEvent</dfn>
        <p id="link-slots">
          <span>{{ MyEvent/[[an internal_slot]]() }}</span>
        </p>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const dfn = doc.querySelector("#method");
    const links = doc.querySelectorAll("#link-slots a");
    expect(links[0].hash).toBe(`#${dfn.id}`);
    const vars = document.querySelectorAll("#link-slots var");
    expect(vars).toHaveSize(0);
  });

  it("supports internal slot being a method with arguments", async () => {
    const body = `
      <section>
        <dfn id="method" data-dfn-for="MyEvent">
          [[\\an internal_slot]](foo, bar)
        </dfn>
        <dfn>MyEvent</dfn>
        <p id="link-slots">
          <span>{{ MyEvent/[[an internal_slot]](foo, bar) }}</span>
        </p>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const dfn = doc.querySelector("#method");
    const links = doc.querySelectorAll("#link-slots a");
    expect(links[0].hash).toBe(`#${dfn.id}`);
    const vars = doc.querySelectorAll("#link-slots var");
    expect(vars).toHaveSize(2);
    const [foo, bar] = vars;
    expect(foo.textContent).toBe("foo");
    expect(bar.textContent).toBe("bar");
  });

  it("has empty data-dfn-for on top level things", async () => {
    const bodyText = `
      <section data-dfn-for="HyperStar" data-link-for="HyperStar">
        <pre class="idl">
          [Exposed=Window]
          interface HyperStar {
            constructor();
            attribute DOMString attr;
            undefined meth();
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

    const [dfnInterface, dfnAttr, dfnMethod, dfnEnum, dfnEnumValue] =
      doc.querySelectorAll("#test dfn");
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

    const [visibilityState, visibilityStateHidden, documentHidden] =
      doc.querySelectorAll("#test a");

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
      doc.querySelectorAll("#links a[href='#dfn-test-string']")
    ).toHaveSize(3);
  });

  it("links to external spec with current spec as prefix", async () => {
    const body = `
      <a id="test" data-cite="tomato-sauce#is-red">PASS</a>
    `;
    const conf = {
      shortName: "tomato",
      localBiblio: {
        "tomato-sauce": {
          title: "A spec to ketchup",
          href: "https://example.com",
        },
      },
    };
    const ops = makeStandardOps(conf, body);
    const doc = await makeRSDoc(ops);

    const testLink = doc.getElementById("test");
    expect(testLink.classList).not.toContain("respec-offending-element");
    expect(testLink.href).toBe("https://example.com/#is-red");
  });

  it("doesn't nest code elements when linking to a IDL definition", async () => {
    const body = `
    <section>
      <h2 id="header">
        Some {{MediaDevices}}
      </h2>
      <pre class="idl">
        [Exposed=Window]
        interface MediaDevices {};
      </pre>
    </section>
    `;
    const ops = makeStandardOps({}, body);
    const doc = await makeRSDoc(ops);

    const codeElem = doc.querySelector("#header a > code");

    expect(codeElem.textContent).toEqual("MediaDevices");
    expect(codeElem.querySelector("code")).toBeNull();
  });
});
