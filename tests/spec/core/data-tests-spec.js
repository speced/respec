"use strict";
describe("Core — data-tests attribute", () => {
  let doc;
  beforeAll(async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}
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
        </section>
        <section>
          <h2>Duplicate Tests</h2>
          <p id="duplicates" 
            data-tests="
              payment-request-show-method.https.html,
              some-other-test.html,
              payment-request-show-method.https.html, 
              ./payment-request-show-method.https.html,
              https://wpt.fyi/respec/payment-request-show-method.https.html"
          >
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
      const [fileElement, secureIconElement] = li.children;

      const fileName = fileElement.innerText.trim();
      expect(fileName).toEqual("this-is-secure");

      const link = fileElement.href;
      expect(link).toEqual("https://wpt.fyi/respec/this-is-secure.https.html");

      const emoji = secureIconElement.innerText;
      expect(emoji).toEqual("🔒");

      const spanAriaLabel = secureIconElement.getAttribute("aria-label");
      expect(spanAriaLabel).toEqual("requires a secure connection");

      const spanTitle = secureIconElement.getAttribute("title");
      expect(spanTitle).toEqual("Test requires HTTPS");
    });
    it(`adds emojis for manual tests`, () => {
      const li = doc.querySelector("#metadata-tests ul>li:nth-child(2)");
      const [fileElement, manualIconElement] = li.children;

      const fileName = fileElement.innerText.trim();
      expect(fileName).toEqual("this-is");

      const link = fileElement.href;
      expect(link).toEqual("https://wpt.fyi/respec/this-is-manual.html");

      const emoji = manualIconElement.innerText;
      expect(emoji).toEqual("💪");

      const spanAriaLabel = manualIconElement.getAttribute("aria-label");
      expect(spanAriaLabel).toEqual("the test must be run manually");

      const spanTitle = manualIconElement.getAttribute("title");
      expect(spanTitle).toEqual("Manual test");
    });
    it(`adds emojis for secure manual tests`, () => {
      const li = doc.querySelector("#metadata-tests ul>li:nth-child(3)");
      const [fileElement, secureIconElement, manualIconElement] = li.children;

      const fileName = fileElement.innerText.trim();
      expect(fileName).toEqual("this-is-secure-and");

      const link = fileElement.href;
      expect(link).toEqual(
        "https://wpt.fyi/respec/this-is-secure-and-manual.https.html"
      );

      const emojiSecure = secureIconElement.innerText;
      expect(emojiSecure).toEqual("🔒");

      const spanAriaLabel1 = secureIconElement.getAttribute("aria-label");
      expect(spanAriaLabel1).toEqual("requires a secure connection");

      const spanTitle1 = secureIconElement.getAttribute("title");
      expect(spanTitle1).toEqual("Test requires HTTPS");

      const spanEmoji2 = manualIconElement.innerText;
      expect(spanEmoji2).toEqual("💪");

      const spanAriaLabel2 = manualIconElement.getAttribute("aria-label");
      expect(spanAriaLabel2).toEqual("the test must be run manually");

      const spanTitle2 = manualIconElement.getAttribute("title");
      expect(spanTitle2).toEqual("Manual test");
    });
  });
  describe("duplicate test removal", () => {
    it("checks for and removes duplicate links", () => {
      const items = Array.from(
        doc.querySelectorAll(
          "#duplicates > .respec-tests-details > ul > li > a"
        )
      );
      expect(items.length).toEqual(2);
      expect(items[0].textContent.trim()).toBe("payment-request-show-method");
      expect(items[1].textContent.trim()).toBe("some-other-test");
    });
  });
});
