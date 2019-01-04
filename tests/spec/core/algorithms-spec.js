"use strict";
describe("Core — Algorithm Lists", () => {
  afterAll(flushIframes);
  it("should add assert class to Assertions in algorithms", async () => {
    const ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        `<section>
            <ol class='algorithm'>
            <li>This one shouldn't be modified.</li>
            <li>Assert: This one should have assert class added to it.</li>
            </ol>
            <ol>
            <li>Assert: This one is not an algorithm, shouldn't be modified.</li>
            <li>This one shouldn't be modified.</li>
            </ol>
        </section>`,
    };
    const doc = await makeRSDoc(ops);
    expect(doc.querySelectorAll(".assert").length).toEqual(1);
  });
});