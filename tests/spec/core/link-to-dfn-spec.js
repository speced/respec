"use strict";
describe("Core — Link to definitions", function() {
  afterAll(flushIframes);

  it("URL-encodes fragment components", async () => {
    const bodyText = `
      <section">
        <h2>Test section</h2>
        <p><dfn>[[\\test]]</dfn><a id="testAnchor">[[\\test]]</a>
      </section>`;
    const ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() + bodyText,
    };
    const doc = await makeRSDoc(ops);
    const a = doc.body.querySelector("#testAnchor");
    expect(a).toBeTruthy();
    expect(a.hash).toEqual("#dfn-x%5B%5Btest%5D%5D");
    const decodedHash = decodeURIComponent(a.hash);
    expect(doc.getElementById(decodedHash.slice(1))).toBeTruthy();
  });

  it("links to IDL definitions and wraps in code if needed", async () => {
    const bodyText = `
      <section data-link-for="Request">
        <h2><dfn>Request</dfn> interface</h2>
        <pre class="idl">
          interface Request {};
        </pre>
        <p id="codeWrap">A <a>Request</a> object.</p>
        <p id="noCodeWrap">An instance of <a lt="Request">the request interface</a>.</p>
      </section>`;
    const ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() + bodyText,
    };
    const doc = await makeRSDoc(ops);
    const hasCode = doc.body.querySelector("#codeWrap a");
    expect(hasCode).toBeTruthy();
    expect(hasCode.firstElementChild.localName).toEqual("code");
    expect(hasCode.textContent).toEqual("Request");
    const noCodeWrap = doc.body.querySelector("#noCodeWrap a");
    expect(noCodeWrap).toBeTruthy();
    expect(noCodeWrap.querySelector("code")).toBeFalsy();
    expect(noCodeWrap.textContent).toEqual("the request interface");
  });
});
