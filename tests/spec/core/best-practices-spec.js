"use strict";
describe("Core — Best Practices", () => {
  afterAll(flushIframes);

  it("processes examples", async () => {
    const body = `
      <section>
        <span class='practicelab'>BP1</span>
        <span class='practicelab'>BP2</span>
        <section id='bp-summary'>
        </section>
      </section>
      <section id='sotd'>
        <p>foo</p>
      </section>
    `;
    const ops = {
      config: makeBasicConfig(),
      body,
    };
    const doc = await makeRSDoc(ops);
    const pls = doc.body.querySelectorAll("span.practicelab");
    const bps = doc.querySelector("#bp-summary");
    expect(pls.item(0).textContent).toEqual("Best Practice 1: BP1");
    expect(pls.item(1).textContent).toEqual("Best Practice 2: BP2");
    expect(bps.querySelector("h2, h3, h4, h5, h6").textContent).toEqual(
      "Best Practices Summary"
    );
    expect(bps.querySelectorAll("ul li").length).toEqual(2);
  });
});
