"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core - Fix headers", () => {
  afterAll(flushIframes);
  it("sets the correct header levels", async () => {
    const body = `
      <section id='turtles'>
        <h1>ONE</h1>
        <section>
          <h1>TWO</h1>
          <section>
            <h1>THREE</h1>
            <section>
              <h1>FOUR</h1>
              <section>
                <h1>FIVE</h1>
                <section>
                  <h1>SIX</h1>
                </section>
              </section>
            </section>
          </section>
        </section>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const s = doc.getElementById("turtles");
    const h1 = s.querySelectorAll("h1");
    expect(h1.length).toEqual(0);
    const h2 = s.querySelectorAll("h2");
    expect(h2.length).toEqual(1);
    expect(h2[0].textContent).toMatch(/ONE/);
    const h3 = s.querySelectorAll("h3");
    expect(h3.length).toEqual(1);
    expect(h3[0].textContent).toMatch(/TWO/);
    const h4 = s.querySelectorAll("h4");
    expect(h4.length).toEqual(1);
    expect(h4[0].textContent).toMatch(/THREE/);
    const h5 = s.querySelectorAll("h5");
    expect(h5.length).toEqual(1);
    expect(h5[0].textContent).toMatch(/FOUR/);
    const h6 = s.querySelectorAll("h6");
    expect(h6.length).toEqual(2);
    expect(h6[0].textContent).toMatch(/FIVE/);
    expect(h6[1].textContent).toMatch(/SIX/);
  });
});
