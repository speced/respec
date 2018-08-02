"use strict";
describe("Core — Examples", () => {
  afterAll(flushIframes);
  it("processes examples", async () => {
    const ops = {
      config: makeBasicConfig(),
      body:
        makeDefaultBody() +
        `<section>
            <pre class='example' title='EX'>\n  {\n    CONTENT\n  }\n  </pre>
        </section>`,
    };
    const doc = await makeRSDoc(ops);
    const example = doc.querySelector("div.example pre");
    const div = example.closest("div");
    expect(div.classList.contains("example")).toBeTruthy();

    const markers = div.querySelectorAll("div.marker");
    expect(markers.length).toEqual(1);
    expect(markers[0].textContent).toEqual("Example 1: EX");
    expect(markers[0].querySelector(".example-title").textContent).toEqual(
      ": EX"
    );
    expect(example.getAttribute("title")).toBeNull();
    expect(example.textContent).toEqual("{\n  CONTENT\n}");
  });
});
