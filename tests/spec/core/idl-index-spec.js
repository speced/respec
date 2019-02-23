"use strict";
describe("Core — IDL Index", () => {
  afterAll(flushIframes);
  it("generates an idl summary", async () => {
    const body = `
      ${makeDefaultBody()}
      <section>
        <pre class=idl>
        interface Foo {
          readonly attribute DOMString bar;
        };
        </pre>
      </section>
      <section>
        <pre class=idl>
        interface Bar {
          readonly attribute DOMString foo;
        };
        </pre>
      </section>
      <section id="idl-index"></section>
      <section id="conformance"></section>
    `;
    const expectedIDL = `interface Foo {
  readonly attribute DOMString bar;
};

interface Bar {
  readonly attribute DOMString foo;
};`;
    const ops = {
      config: makeBasicConfig(),
      body,
    };
    const doc = await makeRSDoc(ops);
    const idlIndex = doc.getElementById("idl-index");
    expect(idlIndex).not.toBe(null);
    expect(idlIndex.querySelector("pre").textContent).toEqual(expectedIDL);
    const header = doc.querySelector("#idl-index > h2");
    expect(header).not.toBe(null);
    expect(header.textContent).toEqual("1. IDL Index");
  });

  //  this should exclude because it has an "exclude" class declared
  //  or the IDL parent section is informative (non-normative)
  it("excludes things the editor doesn't want in the idl summary and informative class", async () => {
    const body = `
      ${makeDefaultBody()}
      <section id="conformance">
        <pre class="idl exclude">
        interface Excluded {
          readonly attribute DOMString bar;
        };
        </pre>
      </section>
      <section>
        <pre class=idl>
        interface Include {
          readonly attribute DOMString foo;
        };
        </pre>
      </section>
      <section class="informative">
        <pre class="idl">
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
    expect(textContent).toMatch(/Include/gm);
    expect(textContent).not.toMatch(/Excluded/gm);
    expect(textContent).not.toMatch(/Informative/gm);
  });

  // this should exclude because IDL parent section is a note, issue or example (non-normative)
  it("excludes note, issue and example sections from the idl summary", async () => {
    const body = `
      ${makeDefaultBody()}
      <section class="note">
        <pre class="idl">
        interface Note {
          readonly attribute DOMString bar;
        };
        </pre>
      </section>
      <section class="issue">
        <pre class="idl">
        interface Issue {
          readonly attribute DOMString foo;
        };
        </pre>
      </section>
      <section class="example">
        <pre class="idl">
          interface Example {
            readonly attribute DOMString baz;
          };
        </pre>
      </section>
      <section>
        <pre class="idl">
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
    const idlIndex = doc.getElementById("idl-index");
    expect(idlIndex.textContent.includes("Example")).toEqual(false);
    expect(idlIndex.textContent.includes("Issue")).toEqual(false);
    expect(idlIndex.textContent.includes("Note")).toEqual(false);
    expect(idlIndex.textContent.includes("Pass")).toEqual(true);
  });

  // this should exclude because IDL parent section is editors note or best practice section (non-normative)
  it("excludes ednote and practice sections from the idl summary", async () => {
    const body = `
      ${makeDefaultBody()}
      <section>
        <pre class="idl">
        interface Pass {
          readonly attribute DOMString bar;
        };
        </pre>
      </section>
      <section class="ednote">
        <pre class="idl">
        interface Ednote {
          readonly attribute DOMString foo;
        };
        </pre>
      </section>
      <section class="practice">
        <pre class="idl">
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
    const idlIndex = doc.getElementById("idl-index");
    expect(idlIndex.textContent.includes("Pass")).toBe(true);
    expect(idlIndex.textContent.includes("Practice")).toBe(false);
    expect(idlIndex.textContent.includes("Ednote")).toBe(false);
  });

  // Check that "This specification doesn't declare any Web IDL" is generated when all IDL is excluded
  // or is in non-normative sections
  it("generates no idl text is generated where IDL is only in non-normative sections or excluded", async () => {
    const body = `
      ${makeDefaultBody()}
      <section>
        <pre class="idl exclude">
        interface Foo {
          readonly attribute DOMString bar;
        };
        </pre>
      </section>
      <section class="note">
        <pre class="idl">
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
    const idlIndex = doc.getElementById("idl-index");
    expect(
      idlIndex.textContent.includes(
        "This specification doesn't declare any Web IDL"
      )
    ).toEqual(true);
  });

  it("allows multi-block idl", async () => {
    const body = `
      ${makeDefaultBody()}
      <section id="conformance">
        <pre class=idl>
        [Constructor, Exposed=Window]
        interface BeforeInstallPromptEvent : Event {
            Promise&lt;PromptResponseObject&gt; prompt();
        };
        dictionary PromptResponseObject {
          AppBannerPromptOutcome userChoice;
        };
        </pre>
      </section>
      <section id="idl-index"></section>
    `;
    const expectedIDL = `[Constructor, Exposed=Window]
interface BeforeInstallPromptEvent : Event {
    Promise<PromptResponseObject> prompt();
};
dictionary PromptResponseObject {
  AppBannerPromptOutcome userChoice;
};`;
    const ops = {
      config: makeBasicConfig(),
      body,
    };
    const doc = await makeRSDoc(ops);
    const idlIndex = doc.getElementById("idl-index");
    expect(idlIndex).not.toBe(null);
    expect(idlIndex.querySelector("pre").textContent).toEqual(expectedIDL);
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
    expect(idlIndex).not.toBe(null);
    expect(idlIndex.querySelector("pre")).toEqual(null);
    const header = doc.querySelector("#idl-index > h2");
    expect(header).not.toBe(null);
    expect(header.textContent).toEqual("1. PASS");
    expect(doc.querySelectorAll("#idl-index > h2").length).toEqual(1);
  });

  it("doesn't include ids in the cloned indexed", async () => {
    const body = `
      ${makeDefaultBody()}
      <pre class=idl>
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
    expect(pre.querySelectorAll("*[id]").length).toEqual(0);
  });
});
