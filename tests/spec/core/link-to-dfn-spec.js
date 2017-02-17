"use strict";
describe("Core — Link to definitions", function() {
  afterAll(function(done) {
    flushIframes();
    done();
  });
  it("links to IDL definitions and wraps in code if needed", function(done) {
    const bodyText = `
    <section data-link-for="Request">
      <h2><dfn>Request</dfn> interface</h2>
      <pre class="idl">
        interface Request {};
      </pre>
      <p id="codeWrap">A <a>Request</a> object.</p>
      <p id="noCodeWrap">An instance of <a lt="Request">the request interface</a>.</p>
    </section>`;
    var ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() + bodyText,
    };
    makeRSDoc(ops, doc => {
      const hasCode = doc.body.querySelector("#codeWrap a");
      expect(hasCode).toBeTruthy();
      expect(hasCode.firstElementChild.localName).toEqual("code");
      expect(hasCode.textContent).toEqual("Request");
      const noCodeWrap = doc.body.querySelector("#noCodeWrap a");
      expect(noCodeWrap).toBeTruthy();
      expect(noCodeWrap.querySelector("code")).toBeFalsy();
      expect(noCodeWrap.textContent).toEqual("the request interface");
    }).then(done);
  });
});
