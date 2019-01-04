"use strict";
describe("Core — Algorithm Lists", () => {
  afterAll(flushIframes);
  it("adds 'assert' CSS class to Assert: in ordered lists that are marked as algorithms", async () => {
    const ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        `<section>
            <ol class='algorithm'>
            <li><!-- whitespace -->    Assert: This one should have assert class added to it.  </li>
            <li>This one shouldn't be modified.</li>
            <li>Assert: This one should have assert class added to it.</li>
            </ol>
        </section>`,
    };
    const doc = await makeRSDoc(ops);
    expect(doc.querySelectorAll(".assert").length).toEqual(2);
  });

  it("doesn't add 'assert' CSS class to Assert: in ordered lists that are not marked as algorithms", async () => {
    const ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        `<section>
            <ol>
            <li>Assert: This one is not an algorithm, shouldn't be modified.</li>
            <li>This one shouldn't be modified.</li>
            </ol>
        </section>`,
    };
    const doc = await makeRSDoc(ops);
    expect(doc.querySelectorAll(".assert").length).toEqual(0);
  });

});