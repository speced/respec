"use strict";
describe("Core — Examples", () => {
  afterAll(flushIframes);
  it("processes examples", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}<section>
          <pre class='example' title='EX'>\n  {\n    CONTENT\n  }\n  </pre>
        </section>`,
    };
    const doc = await makeRSDoc(ops);
    const example = doc.querySelector("div.example pre");
    const div = example.closest("div");
    expect(div.classList.contains("example")).toBeTruthy();
    expect(div.id).toBe("example-1-ex");

    const markers = div.querySelectorAll("div.marker");
    expect(markers.length).toBe(1);

    const marker = markers[0];
    expect(marker.textContent.trim()).toBe("Example 1: EX");
    expect(marker.querySelector(".example-title").textContent).toBe(": EX");
    expect(example.getAttribute("title")).toBeNull();
    expect(example.textContent).toBe("{\n  CONTENT\n}");
  });

  it("processes aside examples", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}<article>
           <aside class='example' title='EX'>\n{\n  CONTENT\n}\n  </aside>
         </article>`,
    };
    const doc = await makeRSDoc(ops);
    const example = doc.querySelector("aside.example");
    expect(example.id).toBe("example-1-ex");

    const markers = example.querySelectorAll("div.marker");
    expect(markers.length).toBe(1);

    const [marker] = markers;
    expect(marker.textContent.trim()).toBe("Example 1: EX");
    expect(marker.querySelector(".example-title").textContent).toBe(": EX");
    expect(example.getAttribute("title")).toBeNull();
    expect(example.textContent.trim()).toBe(
      "Example 1: EX\n    \n{\n  CONTENT\n}"
    );
  });
  it("processes children of aside examples", async () => {
    const ops = {
      config: makeBasicConfig(),
      body: `${makeDefaultBody()}
           <aside class="example">
            <pre class="js">
            // Whitespace before this text should be removed
            </pre>
            <pre>
                  // this one should also have its whitespace removed
            </pre>
            <pre>
                                this one should also have its whitespace removed
            </pre>
           </aside>`,
    };
    const doc = await makeRSDoc(ops);
    const example = doc.querySelectorAll("pre.hljs");
    expect(example.length).toBe(3);
    expect(example[0].textContent).toBe(
      "// Whitespace before this text should be removed"
    );
    expect(example[1].textContent).toBe(
      "// this one should also have its whitespace removed"
    );
    expect(example[2].textContent).toBe(
      "this one should also have its whitespace removed"
    );
  });
  it("self-links examples made from asides", async () => {
    const body = `
      <aside class="example"></aside>
      <aside class="example" id="pass"></aside>
      <aside class="example" title="pass"></aside>
    `;
    const ops = makeStandardOps({}, body);
    const doc = await makeRSDoc(ops);
    const exampleLinks = doc.querySelectorAll("aside.example a.self-link");
    expect(exampleLinks.length).toBe(3);
    const [example1, example2, example3] = exampleLinks;
    expect(example1.getAttribute("href")).toBe("#example-1");
    expect(example2.getAttribute("href")).toBe("#pass");
    expect(example3.getAttribute("href")).toBe("#example-3-pass");
  });
  it("self-links examples made from pre", async () => {
    const body = `
      <pre class="example"></pre>
      <pre class="example" id="pass"></pre>
      <pre class="example" title="pass"></pre>
    `;
    const ops = makeStandardOps({}, body);
    const doc = await makeRSDoc(ops);
    const exampleLinks = doc.querySelectorAll("div.example a.self-link");
    expect(exampleLinks.length).toBe(3);
    const [example1, example2, example3] = exampleLinks;
    expect(example1.getAttribute("href")).toBe("#example-1");
    expect(example2.getAttribute("href")).toBe("#pass");
    expect(example3.getAttribute("href")).toBe("#example-3-pass");
  });
  it("relocates ids and doesn't duplicate them", async () => {
    const body = `
      <pre class="example" id="this-is-unique"></pre>
    `;
    const ops = makeStandardOps({}, body);
    const doc = await makeRSDoc(ops);
    const examples = doc.querySelectorAll("#this-is-unique");
    expect(examples.length).toBe(1);
    const [example] = examples;
    // id got relocated from the pre to the div
    expect(example.localName).toBe("div");
  });
  it("makes correct links", async () => {
    const body = `
      <aside class="example">
       <p>This is a very long link</p>
      </aside>
    `;
    const ops = makeStandardOps({}, body);
    const doc = await makeRSDoc(ops);
    const exampleLink = doc.querySelector("aside.example a.self-link");
    const example = doc.querySelector("aside.example");
    expect(
      exampleLink.getAttribute("href").includes("this-is-a-very-long-link")
    ).toEqual(false);
    expect(exampleLink.getAttribute("href")).toBe("#example-1");
    expect(example.id).toBe("example-1");
  });
  it("preserves dynamically attached event listeners", async () => {
    const body = `
      <aside class="example">
       <button id="mybutton">Click me</button>
      </aside>
      <script>
        mybutton.onclick = () => {};
      </script>
    `;
    const ops = makeStandardOps({}, body);
    const doc = await makeRSDoc(ops);
    const mybutton = doc.getElementById("mybutton");
    expect(mybutton.onclick).toBeDefined();
  });
});
