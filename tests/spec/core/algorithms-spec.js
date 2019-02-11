"use strict";
describe("Core — Algorithm Lists", () => {
  afterAll(flushIframes);
  test(
    "adds 'assert' CSS class to Assert: in ordered lists that are marked as algorithms",
    async () => {
      const ops = {
        config: makeBasicConfig(),
        body: `${makeDefaultBody()}<section>
            <ol class='algorithm'>
              <li>
                Assert: one.
              </li>
              <li>This one shouldn't be modified.</li>
              <li>Assert: two.</li>
            </ol>
          </section>`,
      };
      const doc = await makeRSDoc(ops);
      expect(doc.querySelectorAll(".assert").length).toEqual(2);
    }
  );

  test(
    "doesn't add 'assert' CSS class to Assert: in ordered lists that are not marked as algorithms",
    async () => {
      const ops = {
        config: makeBasicConfig(),
        body: `${makeDefaultBody()}<section>
            <ol>
              <li>Assert: shouldn't be modified.</li>
              <li>This shouldn't be modified.</li>
            </ol>
          </section>`,
      };
      const doc = await makeRSDoc(ops);
      expect(doc.querySelectorAll(".assert").length).toEqual(0);
    }
  );
});
