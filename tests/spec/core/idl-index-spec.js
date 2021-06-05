"use strict";

import {
  flushIframes,
  makeBasicConfig,
  makeDefaultBody,
  makeRSDoc,
} from "../SpecHelper.js";

describe("Core — IDL Index", () => {
  afterAll(flushIframes);
  it("generates an idl summary", async () => {
    const body = `
      ${makeDefaultBody()}
      <section>
        <pre class=idl>
        [Exposed=Window]
        interface Foo {
          readonly attribute DOMString bar;
        };
        </pre>
      </section>
      <section>
        <pre class=idl>
        [Exposed=Window]
        interface Bar {
          readonly attribute DOMString foo;
        };
        </pre>
      </section>
      <section id="idl-index"></section>
      <section id="conformance"></section>
    `;
    const expectedIDL = `[Exposed=Window]
interface Foo {
  readonly attribute DOMString bar;
};

[Exposed=Window]
interface Bar {
  readonly attribute DOMString foo;
};`;
    const ops = {
      config: makeBasicConfig(),
      body,
    };
    const doc = await makeRSDoc(ops);
    const idlIndex = doc.getElementById("idl-index");
    expect(idlIndex).not.toBeNull();
    const pre = idlIndex.querySelector("pre");
    // idlHeaders are not tested here
    pre.querySelectorAll(".idlHeader").forEach(elem => elem.remove());

    expect(pre.textContent).toBe(expectedIDL);
    const header = doc.querySelector("#idl-index > h2");
    expect(header).not.toBeNull();
    expect(header.textContent).toBe("1. IDL Index");
  });

  //  this should exclude because it has an "exclude" class declared
  //  or the IDL parent section is informative (non-normative)
  it("excludes things the editor doesn't want in the idl summary and informative class", async () => {
    const body = `
      ${makeDefaultBody()}
      <section id="conformance">
        <pre class="idl exclude">
        [Exposed=Window]
        interface Excluded {
          readonly attribute DOMString bar;
        };
        </pre>
      </section>
      <section>
        <pre class=idl>
        [Exposed=Window]
        interface Include {
          readonly attribute DOMString foo;
        };
        </pre>
      </section>
      <section class="informative">
        <pre class="idl">
        [Exposed=Window]
        interface Informative {
          readonly attribute DOMString baz;
        };
        </pre>
      </section>
      <section id="idl-index"></section>
    `;
    const ops = {
      config: makeBasicConfig(),
      body,
    };
    const doc = await makeRSDoc(ops);
    const { textContent } = doc.querySelector("#idl-index pre");
    expect(textContent).toContain("Include");
    expect(textContent).not.toContain("Excluded");
    expect(textContent).not.toContain("Informative");
  });

  // this should exclude because IDL parent section is a note, issue or example (non-normative)
  it("excludes note, issue and example sections from the idl summary", async () => {
    const body = `
      ${makeDefaultBody()}
      <section class="note">
        <pre class="idl">
        [Exposed=Window]
        interface Note {
          readonly attribute DOMString bar;
        };
        </pre>
      </section>
      <section class="issue">
        <pre class="idl">
        [Exposed=Window]
        interface Issue {
          readonly attribute DOMString foo;
        };
        </pre>
      </section>
      <section class="example">
        <pre class="idl">
          [Exposed=Window]
          interface Example {
            readonly attribute DOMString baz;
          };
        </pre>
      </section>
      <section>
        <pre class="idl">
          [Exposed=Window]
          interface Pass {
            readonly attribute DOMString qux;
          };
        </pre>
      </section>
      <section id="idl-index"></section>
      <section id="conformance"></section>
    `;
    const ops = {
      config: makeBasicConfig(),
      body,
    };
    const doc = await makeRSDoc(ops);
    const { textContent } = doc.getElementById("idl-index");
    expect(textContent).toContain("Pass");
    expect(textContent).not.toContain("Example");
    expect(textContent).not.toContain("Issue");
    expect(textContent).not.toContain("Note");
  });

  // this should exclude because IDL parent section is editors note or best practice section (non-normative)
  it("excludes ednote and practice sections from the idl summary", async () => {
    const body = `
      ${makeDefaultBody()}
      <section>
        <pre class="idl">
        [Exposed=Window]
        interface Pass {
          readonly attribute DOMString bar;
        };
        </pre>
      </section>
      <section class="ednote">
        <pre class="idl">
        [Exposed=Window]
        interface Ednote {
          readonly attribute DOMString foo;
        };
        </pre>
      </section>
      <section class="practice">
        <pre class="idl">
        [Exposed=Window]
        interface Practice {
          readonly attribute DOMString baz;
        };
        </pre>
      </section>
      <section id="idl-index"></section>
      <section id="conformance"></section>
    `;
    const ops = {
      config: makeBasicConfig(),
      body,
    };
    const doc = await makeRSDoc(ops);
    const { textContent } = doc.getElementById("idl-index");
    expect(textContent).toContain("Pass");
    expect(textContent).not.toContain("Practice");
    expect(textContent).not.toContain("Ednote");
  });

  // Check that "This specification doesn't declare any Web IDL" is generated when all IDL is excluded
  // or is in non-normative sections
  it("generates no idl text is generated where IDL is only in non-normative sections or excluded", async () => {
    const body = `
      ${makeDefaultBody()}
      <section>
        <pre class="idl exclude">
        [Exposed=Window]
        interface Foo {
          readonly attribute DOMString bar;
        };
        </pre>
      </section>
      <section class="note">
        <pre class="idl">
        [Exposed=Window]
        interface Bar {
          readonly attribute DOMString foo;
        };
        </pre>
      </section>
      <section id="idl-index"></section>
    `;
    const ops = {
      config: makeBasicConfig(),
      body,
    };
    const doc = await makeRSDoc(ops);
    const { textContent } = doc.getElementById("idl-index");
    expect(textContent).toContain(
      "This specification doesn't normatively declare any Web IDL."
    );
  });

  it("allows multi-block idl", async () => {
    const body = `
      ${makeDefaultBody()}
      <section id="conformance">
        <pre class=idl>
        [Exposed=Window]
        interface BeforeInstallPromptEvent {
            Promise&lt;PromptResponseObject&gt; prompt();
        };
        dictionary PromptResponseObject {
          BeforeInstallPromptEvent userChoice;
        };
        </pre>
        <pre class="webidl">
        dictionary Bar {
          Bar member;
        };
        </pre>
      </section>
      <section id="idl-index"></section>
    `;
    const expectedIDL = `[Exposed=Window]
interface BeforeInstallPromptEvent {
    Promise<PromptResponseObject> prompt();
};
dictionary PromptResponseObject {
  BeforeInstallPromptEvent userChoice;
};

dictionary Bar {
  Bar member;
};`;
    const ops = {
      config: makeBasicConfig(),
      body,
    };
    const doc = await makeRSDoc(ops);
    const idlIndex = doc.getElementById("idl-index");
    expect(idlIndex).not.toBeNull();
    const pre = idlIndex.querySelector("pre");

    expect(pre.querySelectorAll(".idlHeader")).toHaveSize(1);
    const idlHeader = pre.querySelector(".idlHeader");
    expect(idlHeader.querySelector("a.self-link").getAttribute("href")).toBe(
      "#actual-idl-index"
    );
    idlHeader.remove();
    expect(pre.textContent).toBe(expectedIDL);
  });

  it("allows custom content and header", async () => {
    const body = `
      ${makeDefaultBody()}
      <section id="idl-index">
        <h2>PASS</h2>
        <p>Custom paragraph.</p>
      </section>
    `;
    const ops = {
      config: makeBasicConfig(),
      body,
    };
    const doc = await makeRSDoc(ops);
    const idlIndex = doc.getElementById("idl-index");
    expect(idlIndex).not.toBeNull();
    expect(idlIndex.querySelector("pre")).toBeNull();
    const header = doc.querySelector("#idl-index > h2");
    expect(header).not.toBeNull();
    expect(header.textContent).toBe("1. PASS");
    expect(doc.querySelectorAll("#idl-index > h2")).toHaveSize(1);
  });

  it("doesn't include ids in the cloned indexed", async () => {
    const body = `
      ${makeDefaultBody()}
      <pre class=idl>
      [Exposed=Window]
      interface Test {

      };
      </pre>
      <section id="idl-index">
        <h2>PASS</h2>
        <p>Custom paragraph.</p>
      </section>
      <section id="conformance"></section>
    `;
    const ops = {
      config: makeBasicConfig(),
      body,
    };
    const doc = await makeRSDoc(ops);
    const pre = doc.querySelector("#idl-index pre");
    expect(pre.querySelectorAll("*[id]")).toHaveSize(0);
  });

  it("wraps IDL in a single code element", async () => {
    const body = `
      ${makeDefaultBody()}
      <pre class=idl>
      [Exposed=Window]
      interface Test {};
      </pre>
      <pre class=idl>
      [Exposed=Window]
      interface Test2 {};
      </pre>
      <section id="idl-index">
      </section>
      <section id="conformance"></section>
    `;
    const ops = {
      config: makeBasicConfig(),
      body,
    };
    const doc = await makeRSDoc(ops);
    expect(doc.querySelectorAll("#idl-index pre > code")).toHaveSize(1);
    const code = doc.querySelector("#idl-index pre > code");
    expect(code.textContent).toContain("interface Test {}");
    expect(code.textContent).toContain("interface Test2 {}");
  });
});
