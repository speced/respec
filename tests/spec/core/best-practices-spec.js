"use strict";

import { flushIframes, makeBasicConfig, makeRSDoc } from "../SpecHelper.js";

describe("Core — Best Practices", () => {
  afterAll(flushIframes);

  it("processes inline best practices", async () => {
    const body = `
      <section id="bps">
        <h2>Section</h2>
        <span class='practicelab'>BP1</span>
        <span class='practicelab'>BP2</span>
      </section>
    `;
    const ops = {
      config: makeBasicConfig(),
      body,
    };
    const doc = await makeRSDoc(ops);
    const [bp1, bp2] = doc.querySelectorAll("span.practicelab");
    expect(bp1.classList).toContain("advisement");
    expect(bp2.textContent).toBe("BP2");
  });

  it("processes boxed best practices", async () => {
    const body = `
      <section id="bps">
        <h2>Section</h2>
        <div>
          <p class='practicelab'>BP1</p>
        </div>
        <section id='bp-summary'>
        </section>
      </section>
    `;
    const ops = {
      config: makeBasicConfig(),
      body,
    };
    const doc = await makeRSDoc(ops);
    const selfLink = doc.querySelector(".advisement .self-link");
    expect(selfLink.getAttribute("href")).toBe("#bp-bp1");
    expect(selfLink.textContent).toBe("Best Practice 1");
  });

  it("generates a summary when bp-summary is present", async () => {
    const body = `
      <section id="bps">
        <h2>Section</h2>
        <span class='practicelab'>BP1</span>
        <span class='practicelab'>BP2</span>
        <div>
          <p><span class='practicelab'>BP3 <dfn id="fail"><code>some code</code></dfn></span></p>
        </div>
        <section id='bp-summary'>
        </section>
      </section>
    `;
    const ops = {
      config: makeBasicConfig(),
      body,
    };
    const doc = await makeRSDoc(ops);
    const bps = doc.getElementById("bp-summary");
    expect(bps).toBeTruthy();

    const listItems = bps.querySelectorAll("li");
    expect(listItems[0].textContent.trim()).toBe("Best Practice 1: BP1");
    expect(listItems[1].textContent.trim()).toBe("Best Practice 2: BP2");
    expect(listItems[2].textContent.trim()).toBe(
      "Best Practice 3: BP3 some code"
    );
    expect(listItems[2].querySelector("code").textContent).toBe("some code");

    // safe copy
    expect(listItems[2].querySelector("[id]")).toBeFalsy();
    expect(listItems[2].querySelector("span")).toBeTruthy();
    expect(bps.querySelector("h3").textContent).toContain(
      "Best Practices Summary"
    );
    expect(bps.querySelectorAll("ul li")).toHaveSize(3);
  });
});
