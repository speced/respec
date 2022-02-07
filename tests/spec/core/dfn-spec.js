"use strict";

import {
  flushIframes,
  makeBasicConfig,
  makeDefaultBody,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";

describe("Core — Definitions", () => {
  afterAll(flushIframes);

  const findDfnErrors = doc =>
    doc.respec.errors.filter(err => err.plugin === "core/dfn");

  it("processes definitions", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}<section id='dfn'><dfn>text</dfn><a>text</a></section>`,
    };
    const doc = await makeRSDoc(ops);
    const sec = doc.getElementById("dfn");
    expect(sec.querySelector("dfn").id).toBe("dfn-text");
    expect(sec.querySelector("a").getAttribute("href")).toBe("#dfn-text");
  });

  it("gives definitions a type and an id", async () => {
    const body = `
    <section id='dfns'>
      <dfn>some definition</dfn>
      <dfn data-export>some other def</dfn>
      <dfn data-dfn-type="abstract-op">some other def</dfn>
      <dfn data-dfn-type="">empty dfn type</dfn>
    </section>`;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const sec = doc.getElementById("dfns");
    const dfns = sec.querySelectorAll("dfn");
    expect(dfns).toHaveSize(4);
    expect([...dfns].every(dfn => Boolean(dfn.getAttribute("id")))).toBeTrue();
    expect(
      [...dfns].every(dfn => dfn.hasAttribute("data-dfn-type"))
    ).toBeTrue();
    const [dfn1, dfn2, dfn3, dfn4] = dfns;

    expect(dfn1.dataset.dfnType).toBe("dfn");
    expect(dfn1.dataset.export).toBeUndefined();

    expect(dfn2.dataset.dfnType).toBe("dfn");
    expect(dfn2.dataset.hasOwnProperty("export")).toBeTrue();

    expect(dfn3.dataset.dfnType).toBe("abstract-op");
    // Override empty type with "dfn"
    expect(dfn4.dataset.dfnType).toBe("dfn");
  });

  it("exports known types by default", async () => {
    const body = `
    <section id='dfns'>
      <dfn data-dfn-type="abstract-op">dfn1</dfn>
      <dfn data-dfn-type="abstract-op" data-noexport>dfn2</dfn>
      <dfn data-dfn-type="abstract-op" data-export>dfn3</dfn>
      <dfn data-cite="dom#something">dfn4</dfn>
      <dfn>dfn5</dfn>
      <dfn data-noexport>dfn6</dfn>
    </section>`;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const sec = doc.getElementById("dfns");
    const dfns = sec.querySelectorAll("dfn");
    expect(dfns).toHaveSize(6);
    const [dfn1, dfn2, dfn3, dfn4, dfn5, dfn6] = dfns;

    // first "abstract-op" is exported by default
    expect(dfn1.dataset.dfnType).toBe("abstract-op");
    expect(dfn1.dataset.hasOwnProperty("export")).toBeTrue();

    // second "abstract-op" is not exported
    expect(dfn2.dataset.dfnType).toBe("abstract-op");
    expect(dfn2.dataset.hasOwnProperty("export")).toBeFalse();

    // third "abstract-op" is exported
    expect(dfn3.dataset.dfnType).toBe("abstract-op");
    expect(dfn3.dataset.hasOwnProperty("export")).toBeTrue();

    // fourth doesn't export, because it's using data-cite.
    expect(dfn4.dataset.hasOwnProperty("export")).toBeFalse();
    expect(dfn4.dataset.dfnType).toBe("dfn");

    // fifth "dfn" is not exported, because it's just a regular "dfn".
    expect(dfn5.dataset.hasOwnProperty("export")).toBeFalse();
    expect(dfn5.dataset.dfnType).toBe("dfn");

    // six definition is not exported, because it's data-noexport.
    expect(dfn6.dataset.hasOwnProperty("export")).toBeFalse();
    expect(dfn6.dataset.dfnType).toBe("dfn");
    expect(dfn6.dataset.export).toBeUndefined();
  });

  it("makes dfn tab enabled whose aria-role is a link", async () => {
    const body = `
    <section id='dfns'>
      <dfn>dfn 1</dfn>
      <dfn>dfn 2</dfn>
      <dfn>dfn 3</dfn>
      <dfn>dfn 4</dfn>
    </section>`;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const sec = doc.getElementById("dfns");
    const dfns = sec.querySelectorAll("dfn");
    expect(dfns).toHaveSize(4);
    expect([...dfns].every(dfn => dfn.tabIndex === 0)).toBeTrue();
  });

  it("makes links <code> when their definitions are <code>", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}<section id='dfn'>
          <code><dfn>outerCode</dfn></code>
          <pre><dfn>outerPre</dfn></pre>
          <dfn><code>innerCode</code></dfn>
          <dfn><code>partial</code> inner code</dfn>
          <a>outerCode</a>
          <a>outerPre</a>
          <a>innerCode</a>
          <a>partial inner code</a>
        </section>`,
    };

    const doc = await makeRSDoc(ops);
    const sec = doc.getElementById("dfn");
    const anchors = [...sec.children].filter(node => node.localName === "a");
    expect(anchors[0].childNodes[0].textContent).toBe("outerCode");
    expect(anchors[0].childNodes[0].nodeName).toBe("CODE");
    expect(anchors[1].childNodes[0].textContent).toBe("outerPre");
    expect(anchors[1].childNodes[0].nodeName).toBe("CODE");
    expect(anchors[2].childNodes[0].textContent).toBe("innerCode");
    expect(anchors[2].childNodes[0].nodeName).toBe("CODE");
    expect(anchors[3].childNodes[0].textContent).toBe("partial inner code");
    expect(anchors[3].childNodes[0].nodeName).toBe("#text");
  });

  it("doesn't add redundant lt when not needed", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}
      <section>
        <dfn id="test1">test</dfn>
        <dfn id="test2" data-lt="I'm an lt">test</dfn>
      </section>`,
    };
    const doc = await makeRSDoc(ops);

    const test1 = doc.getElementById("test1");
    expect(Object.keys(test1.dataset)).not.toContain("lt");

    const test2 = doc.getElementById("test2");
    expect(test2.dataset.lt).toBeTruthy();
    expect(test2.dataset.lt).toBe("I'm an lt|test");
  });

  it("links <code> for IDL, but not when text doesn't match", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}
          <pre class="idl">
            interface Test {};
          </pre>
          <p id="t1"><a>Test</a>
          <p id="t2"><a data-lt="Test">not wrapped in code</a>
      `,
    };
    const doc = await makeRSDoc(ops);
    const code = doc.querySelector("#t1 code");
    expect(code.textContent).toBe("Test");
    const t2 = doc.getElementById("t2");
    expect(t2.querySelector("code")).toBeNull();
    expect(t2.querySelector("a").textContent).toBe("not wrapped in code");
    expect(t2.querySelector("a").getAttribute("href")).toBe("#dom-test");
  });

  it("processes aliases", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}<section id='dfn'>
          <dfn data-lt='text|text 1|text  2|text 3 '>text</dfn>
          <a>text</a>
        </section>`,
    };
    const doc = await makeRSDoc(ops);
    const dfn = doc.querySelector("dfn[data-lt]");
    expect(dfn.dataset.lt).toBe("text|text 1|text 2|text 3");
  });

  it("allows linking via data-local-lt", async () => {
    const body = `
      <p id="only-lt">
        <dfn data-lt="hello">hey</dfn>
        [= hey =] [= hello =]
      </p>
      <p id="only-local-lt">
        <dfn data-local-lt="installing|installed|installation">install</dfn>
        [= install =] [= installation =] [= installed =] [= installing =]
      </p>
      <p id="lt-local-lt">
        <dfn data-lt="first" data-local-lt="second">third</dfn>
        [= first =] [= second =] [= third =]
      </p>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const dfnOnlyLt = doc.querySelector("#only-lt dfn");
    expect(dfnOnlyLt.id).toBe("dfn-hello");
    for (const el of [...doc.querySelectorAll("#only-lt a")]) {
      expect(el.hash).toBe("#dfn-hello");
    }

    const dfnOnlyLocalLt = doc.querySelector("#only-local-lt dfn");
    expect(dfnOnlyLocalLt.id).toBe("dfn-install");
    for (const el of [...doc.querySelectorAll("#only-local-lt a")]) {
      expect(el.hash).toBe("#dfn-install");
    }

    const dfnLtLocalLt = doc.querySelector("#lt-local-lt dfn");
    expect(dfnLtLocalLt.id).toBe("dfn-first");
    for (const el of [...doc.querySelectorAll("#lt-local-lt a")]) {
      expect(el.hash).toBe("#dfn-first");
    }
  });

  it("supports permission type", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `
          <p id="permission">
            <dfn class="permission">"permission"</dfn>
            <dfn class="permission">needs-quotes</dfn>
            <dfn class="permission">"no spaces allowed"</dfn>
            <a>"permission"</a>
          </p>
        `,
    };
    const doc = await makeRSDoc(ops);
    const permission = doc.querySelector("#permission dfn");
    expect(permission.dataset.dfnType).toBe("permission");
    expect(permission.dataset.export).toBe("");

    // invalid ones
    const errors = findDfnErrors(doc);
    expect(errors.length).toBe(2);
    expect(errors[0].message).toContain("quotes");
    expect(errors[1].message).toContain("Invalid permission name");

    // link check
    const a = doc.querySelector("#permission a");
    expect(a.hash).toBe("#dfn-permission");
  });

  describe("internal slot definitions", () => {
    const body = `
      <section data-dfn-for="Test" data-cite="HTML">
        <h2>Internal slots</h2>
        <pre class="idl">
          [Exposed=Window]
          interface Foo{};
        </pre>
        <p>
          <dfn id="attribute">
            [[\\internal slot]]
          </dfn>
          <dfn id="method" data-export="">
            [[\\I am_a method]](I, really, ...am)
          </dfn>
          <dfn id="parent" data-dfn-for="Window">[[\\internal slot]]</dfn>
          <dfn id="broken" data-dfn-for="">[[\\broken]]</dfn>
        </p>
        <section data-dfn-for="">
          <h2>.</h2>
          <p>
            <dfn id="broken-parent">[[\\broken]]</dfn>
          </p>
        </section>
        <p>
        {{Test/[[internal slot]]}}
        {{Test/[[I am_a method]](I, really, ...am)}}
        {{Window/[[internal slot]]}}
        </p>
        <p>
          <dfn id="legacy" data-cite="ecma-262#sec-8.6.2">[[\\Class]]</dfn>
        </p>
      </section>
    `;

    it("doesn't export internal slots by default", async () => {
      const ops = {
        config: makeBasicConfig(),
        body,
      };
      const doc = await makeRSDoc(ops);

      // The attribute is not exported explicitly, so defaults to "noexport".
      const attribute = doc.getElementById("attribute");
      expect(attribute.dataset.export).toBeUndefined();
      expect(attribute.dataset.noexport).toBe("");

      // The method has an explicit export, so doesn't have a "noexport".
      const method = doc.getElementById("method");
      expect(method.dataset.export).toBe("");
      expect(method.dataset.noexport).toBeUndefined();
    });

    it("sets the data-dfn-type as an attribute", async () => {
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfn = doc.getElementById("attribute");
      expect(dfn.textContent.trim()).toBe("[[internal slot]]");
      expect(dfn.dataset.dfnType).toBe("attribute");
      expect(dfn.dataset.idl).toBe("");
      expect(dfn.dataset.noexport).toBe("");
    });

    it("sets the data-dfn-type as a method, when it's a method", async () => {
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfn = doc.getElementById("method");
      expect(dfn.textContent.trim()).toBe(
        "[[I am_a method]](I, really, ...am)"
      );
      expect(dfn.dataset.dfnType).toBe("method");
      expect(dfn.dataset.idl).toBe("");
      expect(dfn.dataset.noexport).toBeUndefined();
      expect(dfn.dataset.export).toBe("");
    });

    it("when data-dfn-for is missing, it use the closes data-dfn-for as parent", async () => {
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfn = doc.getElementById("attribute");
      expect(dfn.dataset.dfnFor).toBe("Test");
      const dfnWithParent = doc.getElementById("parent");
      expect(dfnWithParent.dataset.dfnFor).toBe("Window");
    });

    it("treats legacy slot references as regular definitions", async () => {
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfn = doc.getElementById("legacy");
      expect(dfn.dataset.dfnType).toBe("dfn");
    });

    it("errors if the internal slot is not for something", async () => {
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfnErrors = doc.respec.errors.filter(
        ({ plugin }) => plugin === "core/dfn"
      );
      expect(dfnErrors).toHaveSize(2);
    });
  });

  describe("CSS class based definitions types", () => {
    it("allows exporting definitions through a class", async () => {
      const body = `
      <section>
        <h2>abstract operations</h2>
        <p>
          <dfn class="export">just a regular definition</dfn>
        </p>
      </section>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfn = doc.querySelector("dfn");
      expect(dfn.textContent).toBe("just a regular definition");
      expect(dfn.dataset.export).toBe("");
      expect(dfn.dataset.noexport).toBeUndefined();

      // Check validation error
      const errors = findDfnErrors(doc);
      expect(errors).toHaveSize(0);
    });

    it("handles abstract operations", async () => {
      const body = `
      <section>
        <h2>abstract operations</h2>
        <p id="abstract-op">
          <dfn class="abstract-op">abstract operation</dfn>
        </p>
      </section>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfn = doc.querySelector("#abstract-op dfn");
      expect(dfn.dataset.dfnType).toBe("abstract-op");
      expect(dfn.dataset.export).toBe("");
    });

    it("handles attributes", async () => {
      const body = `
        <section>
          <h2>Attributes</h2>
          <p id="attributes">
            <dfn class="attribute">some-attribute</dfn>
          </p>
          <p id="attribute-bad">
            <dfn class="attribute">-attribute</dfn>
          </p>
        </section>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfn = doc.querySelector("#attributes dfn");
      expect(dfn.dataset.dfnType).toBe("attribute");
      expect(dfn.dataset.export).toBe("");

      // Check validation error
      const errors = findDfnErrors(doc);
      expect(errors).toHaveSize(1);
      expect(errors[0].message).toContain("-attribute");
    });

    it("handles attribute values", async () => {
      const body = `
        <section>
          <h2>Attribute values</h2>
          <p id="attr-value">
            <dfn class="attr-value" data-dfn-for="input/type">password</dfn>
          </p>
          <p id="attr-value-errors">
            <dfn class="attr-value">some-text</dfn>
            <dfn class="attr-value" data-dfn-for="input/type">-not-ok!</dfn>
          </p>
        </section>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfn = doc.querySelector("#attr-value dfn");
      expect(dfn.dataset.dfnFor).toBe("input/type");
      expect(dfn.dataset.dfnType).toBe("attr-value");
      expect(dfn.dataset.export).toBe("");

      // Check validation error
      const errors = findDfnErrors(doc);
      expect(errors).toHaveSize(2);
      expect(errors[0].message).toContain("attr-value");
      expect(errors[1].message).toContain("-not-ok!");
    });

    it("handles elements", async () => {
      const body = `
        <section>
          <h2>Elements</h2>
          <p id="elements">
            <dfn class="element">element</dfn>
          </p>
          <p id="elements-bad">
            <dfn class="element">-element</dfn>
          </p>
        </section>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfn = doc.querySelector("#elements dfn");
      expect(dfn.dataset.dfnType).toBe("element");
      expect(dfn.dataset.export).toBe("");

      // Check validation error
      const errors = findDfnErrors(doc);
      expect(errors).toHaveSize(1);
      expect(errors[0].message).toContain("-element");
    });

    it("handles element states", async () => {
      const body = `
        <section>
          <h2>Element states</h2>
          <p id="element-state">
            <dfn class="element-state" data-dfn-for="input">Password</dfn>
          </p>
          <p id="element-state-bad">
            <dfn class="element-state">terrible state</dfn>
          </p>
        </section>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfn = doc.querySelector("#element-state dfn");
      expect(dfn.dataset.dfnFor).toBe("input");
      expect(dfn.dataset.dfnType).toBe("element-state");
      expect(dfn.dataset.export).toBe("");

      // Check validation error
      const errors = findDfnErrors(doc);
      // missing data-dfn-for and invalid name
      expect(errors).toHaveSize(2);
      expect(errors[1].message).toContain("terrible state");
    });

    it("handles events", async () => {
      const body = `
        <section>
          <h2>Events</h2>
          <p id="events">
            <dfn class="event">DOMContentLoaded</dfn>
          </p>
          <p id="events-bad">
            <dfn class="event">-event</dfn>
          </p>
        </section>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfn = doc.querySelector("#events dfn");
      expect(dfn.dataset.dfnType).toBe("event");
      expect(dfn.dataset.export).toBe("");

      // Check validation error
      const errors = findDfnErrors(doc);
      expect(errors).toHaveSize(1);
      expect(errors[0].message).toContain("-event");
    });

    it("handles http-headers", async () => {
      const body = `
        <section>
          <h2>HTTP Header</h2>
          <p id="http-header">
            <dfn class="http-header">Some-Header</dfn>
          </p>
        </section>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfn = doc.querySelector("#http-header dfn");
      expect(dfn.dataset.dfnType).toBe("http-header");
      expect(dfn.dataset.export).toBe("");
    });

    it("handles schemes", async () => {
      const body = `
        <section>
          <h2>Scheme</h2>
          <p id="http-header">
            <dfn class="scheme">scheme</dfn>
          </p>
        </section>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfn = doc.querySelector("#http-header dfn");
      expect(dfn.dataset.dfnType).toBe("scheme");
      expect(dfn.dataset.export).toBe("");
    });

    it("handles media types", async () => {
      const body = `
        <section>
          <h2>HTTP Header</h2>
          <p id="http-header">
            <dfn class="media-type">application/something-something</dfn>
          </p>
          <p id="http-header-bad">
            <dfn class="media-type">bad type</dfn>
        </section>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfn = doc.querySelector("#http-header dfn");
      expect(dfn.dataset.dfnType).toBe("media-type");
      expect(dfn.dataset.export).toBe("");

      // Check validation error
      const errors = findDfnErrors(doc);
      expect(errors).toHaveSize(1);
      expect(errors[0].message).toContain("bad type");
    });

    it("handles multiple types in the class by allowing the first one to win", async () => {
      const body = `
        <section>
          <h2>Multiple definitions</h2>
          <p>
            <dfn id="multiple-definitions" class="banana event element media-type">event</dfn>
          </p>
        </section>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const dfn = doc.querySelector("#multiple-definitions");
      expect(dfn.dataset.dfnType).toBe("event");
      expect(dfn.textContent).toBe("event");
      expect(dfn.dataset.export).toBe("");
    });

    it("supports no-export class", async () => {
      const body = `
        <section data-dfn-for="Foo">
          <h2>No export</h2>
          <pre class="idl">
            [Exposed=Window] interface Foo {};
          </pre>
          <p>
            <dfn class="no-export">
              no export
            </dfn>
            <!-- normally exported, so we override it -->
            <dfn class="element no-export">
              element
            </dfn>
            <dfn class="no-export">Foo</dfn>
          </p>
      </section>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const [regularDfn, elementDfn, idlDfn] = doc.querySelectorAll("dfn");

      expect(elementDfn.dataset.noexport).toBe("");
      expect(regularDfn.dataset.dfnType).toBe("dfn");
      expect(regularDfn.dataset.export).toBeUndefined();

      expect(elementDfn.dataset.noexport).toBe("");
      expect(elementDfn.dataset.dfnType).toBe("element");
      expect(elementDfn.dataset.export).toBeUndefined();

      expect(idlDfn.dataset.noexport).toBe("");
      expect(idlDfn.dataset.dfnType).toBe("interface");
      expect(idlDfn.dataset.export).toBeUndefined();

      // Check validation error
      const errors = findDfnErrors(doc);
      expect(errors).toHaveSize(0);
    });

    it("errors if the dfn declares both export and no-export classes", async () => {
      const body = `
        <section>
          <h2>Confused exports</h2>
          <p>
            <dfn class="export no-export">can't decide</dfn>
            <dfn class="no-export" data-export="">data noexport</dfn>
          </p>
        </section>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      // Check validation error
      const errors = findDfnErrors(doc);
      expect(errors).toHaveSize(2);
      expect(errors[0].message).toContain("Declares both");
      expect(errors[1].message).toContain("but also has a");
    });
  });
});
