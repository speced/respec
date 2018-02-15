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
            data-tests="
              this-is-secure.https.html,
              this-is-manual.html,
              this-is-secure-and-manual.https.html"
          >
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
    it(`adds emojis for secure tests`, () => {
  
      const li = doc.querySelector("#metadata-tests ul>li:nth-child(1)");
      
      const fileName = li.children[0].innerText.trim();
      expect(fileName).toEqual("this-is-secure");

      const link = li.children[0].href;
      expect(link).toEqual("https://wpt.fyi/respec/this-is-secure.https.html");
      
      const emoji = li.children[1].innerText;
      expect(emoji).toEqual("🔒");
      
      const spanAriaLabel = li.children[1].children[0].getAttribute('aria-label');
      expect(spanAriaLabel).toEqual("requires a secure connection");
      
      const spanTitle = li.children[1].children[0].getAttribute('title');
      expect(spanTitle).toEqual("Test requires HTTPS");
    });
    it(`adds emojis for manual tests`, () => {

      const li = doc.querySelector("#metadata-tests ul>li:nth-child(2)")

      const fileName = li.children[0].innerText.trim();
      expect(fileName).toEqual("this-is");
      
      const link = li.children[0].href;
      expect(link).toEqual("https://wpt.fyi/respec/this-is-manual.html");
      
      const emoji = li.children[1].innerText;
      expect(emoji).toEqual("💪");

      const spanAriaLabel = li.children[1].children[0].getAttribute('aria-label');
      expect(spanAriaLabel).toEqual("the test must be run manually");
      
      const spanTitle = li.children[1].children[0].getAttribute('title');
      expect(spanTitle).toEqual("Manual test");
    });
    it(`adds emojis for secure manual tests`, () => {

      const li = doc.querySelector("#metadata-tests ul>li:nth-child(3)")
      
      const fileName = li.children[0].innerText.trim();
      expect(fileName).toEqual("this-is-secure-and");
      
      const link = li.children[0].href;
      expect(link).toEqual("https://wpt.fyi/respec/this-is-secure-and-manual.https.html");
      
      const emojiSecure = li.children[1].children[0].innerText;
      expect(emojiSecure).toEqual("🔒");
      
      const spanAriaLabel1 = li.children[1].children[0].getAttribute('aria-label');
      expect(spanAriaLabel1).toEqual("requires a secure connection");
      
      const spanTitle1 = li.children[1].children[0].getAttribute('title');
      expect(spanTitle1).toEqual("Test requires HTTPS");
      
      const spanEmoji2 = li.children[1].children[1].innerText;
      expect(spanEmoji2).toEqual("💪");
      
      const spanAriaLabel2 = li.children[1].children[1].getAttribute('aria-label');
      expect(spanAriaLabel2).toEqual("the test must be run manually");
      
      const spanTitle2 = li.children[1].children[1].getAttribute('title');
      expect(spanTitle2).toEqual("Manual test");
    });
  });
});
