"use strict";

import { flushIframes, makeBasicConfig, makeRSDoc } from "../SpecHelper.js";

describe("Core — Best Practices", () => {
  afterAll(flushIframes);

  it("processes best practices", async () => {
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
    const inlineBp = doc.querySelector("span.practicelab");
    expect(inlineBp.classList).toContain("advisement");

    const advisement = doc.querySelector("div.advisement");
    expect(advisement.textContent).toContain("Best Practice 3: BP3");

    const selfLink = advisement.querySelector(".self-link");
    expect(selfLink.getAttribute("href")).toBe("#bp-bp3-some-code");

    const practicelab = advisement.querySelector(".practicelab");
    expect(practicelab.textContent).toBe("BP3 some code");

    const bps = doc.getElementById("bp-summary");
    expect(bps).toBeTruthy();

    const listItems = bps.querySelectorAll("li");
    expect(listItems[0].textContent).toBe("Best Practice 1: BP1");
    expect(listItems[1].textContent).toBe("Best Practice 2: BP2");
    expect(listItems[2].textContent).toBe("Best Practice 3: BP3 some code");

    expect(listItems[2].querySelector("code").textContent).toBe("some code");

    // safe copy
    expect(listItems[2].querySelector("[id]")).toBeFalsy();
    expect(listItems[2].querySelector("span")).toBeTruthy();
    expect(bps.querySelector("h3").textContent).toContain(
      "Best Practices Summary"
    );
    expect(bps.querySelectorAll("ul li").length).toBe(3);
  });
});
