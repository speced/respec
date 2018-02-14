"use strict";
describe("Core — data-tests attribute", () => {
  let doc;
  beforeAll(async () => {
    const ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        `
        <section>
          <h2>test</h2>
          <p id="testable"
            data-tests="test0.html,
             test1.html, \t ./test2.html,
              ../test3.html,test4.html
            ">
            <a id="t1" data-cite="#test">a</a>
            <dfn id="t2" data-cite="#test">a</dfn>
          </p>
          <p id="metadata-tests"
            data-tests="this-is-secure.https.html,
             this-is-manual.html, this-is-secure-and-manual.https.html">
             metadata tests
          </p>
        </section>`,
    };
    ops.config.testSuiteURI = "https://wpt.fyi/respec/";
    doc = await makeRSDoc(ops);
  });
  afterAll(flushIframes);
  it("deletes the data-tests attribute after processing", () => {
    const testable = doc.getElementById("testable");
    expect(testable.hasAttribute("data-tests")).toBe(false);
  });
  describe("generated details element", () => {
    it("gets generated and added", () => {
      expect(doc.querySelector("#testable > details")).toBeTruthy();
    });
    it(`includes the css classes`, () => {
      expect(
        doc.querySelector("#testable > details.respec-tests-details")
      ).toBeTruthy();
      expect(
        doc.querySelector("#testable > details.removeOnSave")
      ).toBeTruthy();
    });
  });
  describe("generated summary element", () => {
    it(`lists the number of tests in the summary`, () => {
      const { textContent } = doc.querySelector(
        "#testable > details > summary"
      );
      expect(textContent.trim()).toContain("5");
    });
  });
  describe("generated test list", () => {
    it(`adds tests into an unordered list`, () => {
      const ul = doc.querySelector("#testable > .respec-tests-details > ul");
      expect(ul).toBeTruthy();
    });
    it(`links the tests to the test site, resolved as proper URLs`, () => {
      const items = Array.from(
        doc.querySelectorAll("#testable > .respec-tests-details > ul > li > a")
      );
      expect(items.length).toEqual(5);
      items.forEach(({ origin, pathname }, i) => {
        expect(origin).toEqual("https://wpt.fyi");
        expect(pathname.endsWith(`test${i}.html`)).toBe(true);
      });
    });
    it(`adds emojis for manual and https related tests`, () => {
      
      let test = doc.querySelector("#metadata-tests ul").querySelectorAll("li")

      // for test 1
      expect(test[0].children[0].innerText.trim()).toEqual("this-is-secure");   // filename
      expect(test[0].children[0].href).toEqual("https://wpt.fyi/respec/this-is-secure.https.html");      //link
      expect(test[0].children[1].innerText).toEqual("🔒");      //emoji
      expect(test[0].children[1].children[0].getAttribute('aria-label')).toEqual("requires a secure connection");       //span aria-label
      expect(test[0].children[1].children[0].getAttribute('title')).toEqual("Test requires HTTPS");      //span title

      // for test 2
      expect(test[1].children[0].innerText.trim()).toEqual("this-is");      // filename
      expect(test[1].children[0].href).toEqual("https://wpt.fyi/respec/this-is-manual.html");      //link
      expect(test[1].children[1].innerText).toEqual("💪");      // span emoji
      expect(test[1].children[1].children[0].getAttribute('aria-label')).toEqual("the test must be run manually");      //span aria-label
      expect(test[1].children[1].children[0].getAttribute('title')).toEqual("Manual test");      //span title
  
      // for test 3
      expect(test[2].children[0].innerText.trim()).toEqual("this-is-secure-and");      // filename
      expect(test[2].children[0].href).toEqual("https://wpt.fyi/respec/this-is-secure-and-manual.https.html");       //link
      expect(test[2].children[1].children[0].innerText).toEqual("🔒");      // span 1 emoji
      expect(test[2].children[1].children[0].getAttribute('aria-label')).toEqual("requires a secure connection");      //span 1 aria-label
      expect(test[2].children[1].children[0].getAttribute('title')).toEqual("Test requires HTTPS");      //span 1 title
      expect(test[2].children[1].children[1].innerText).toEqual("💪");      // span 2 emoji
      expect(test[2].children[1].children[1].getAttribute('aria-label')).toEqual("the test must be run manually");      //span 2 aria-label
      expect(test[2].children[1].children[1].getAttribute('title')).toEqual("Manual test");      //span 2 title
    })
  });
});
