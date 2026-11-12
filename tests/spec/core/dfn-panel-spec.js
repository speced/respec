"use strict";
import {
  flushIframes,
  getExportedDoc,
  makeRSDoc,
  makeStandardOps,
} from "../SpecHelper.js";

describe("Core — dfnPanel", () => {
  afterAll(flushIframes);

  const getPanelId = dfnId => `dfn-panel-for-${dfnId}`;
  const body = `
    <section>
      <h2>top level heading</h2>
      <p><dfn data-export>many</dfn>, <dfn>one</dfn>, <dfn>zero</dfn> references.</p>
      <p>[=many=] [=many=] [=one=]</p>
      <section>
        <h3>nested section heading</h3>
        <p>[=many=] [=many=]</p>
      </section>
      <p>[= many =]</p>
    </section>
  `;
  const ops = makeStandardOps(null, body);

  describe("panel container", () => {
    const dfnId = "dfn-many";

    it("doesn't add a panel for legacy <dfn data-cite>", async () => {
      const body = `
        <p>
          <dfn id="legacy" data-cite="html#event">legacy link</dfn>
          <a>legacy link</a>
        </p>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const panel = doc.getElementById(getPanelId("legacy"));
      expect(panel).toBeNull();
    });

    it("has role and aria attributes", async () => {
      const doc = await makeRSDoc(ops);
      const panel = doc.getElementById(getPanelId(dfnId));
      expect(panel.getAttribute("role")).toBe("dialog");
      expect(panel.getAttribute("aria-modal")).toBe("true");
      expect(panel.getAttribute("aria-label")).toBe(
        "Details for definition: many"
      );

      const permalink = panel.querySelector(".self-link");
      expect(permalink.getAttribute("aria-label")).toBe(
        "Permalink for definition: many. Activate to close this dialog."
      );
    });
  });

  describe("dfnPanel state", () => {
    const dfnId = "dfn-many";

    it("opens panel on dfn click", async () => {
      const doc = await makeRSDoc(ops);
      const panel = doc.getElementById(getPanelId(dfnId));
      expect(panel.hidden).toBeTrue();
      const dfn = doc.getElementById(dfnId);
      dfn.click();
      expect(panel.hidden).toBeFalse();
      expect(panel.classList).not.toContain("docked");
    });

    it("closes open panel on external click", async () => {
      const doc = await makeRSDoc(ops);
      doc.getElementById(dfnId).click();
      const panel = doc.getElementById(getPanelId(dfnId));
      expect(panel.hidden).toBeFalse();
      doc.body.click();
      expect(panel.hidden).toBeTrue();
    });

    it("closes open panel on self link click", async () => {
      const doc = await makeRSDoc(ops);
      const panel = doc.getElementById(getPanelId(dfnId));
      doc.getElementById(dfnId).click();
      expect(panel.hidden).toBeFalse();
      panel.querySelector("a.self-link").click();
      expect(panel.hidden).toBeTrue();
    });

    it("does not close panel on panel click", async () => {
      const doc = await makeRSDoc(ops);
      doc.getElementById(dfnId).click();
      const panel = doc.getElementById(getPanelId(dfnId));
      expect(panel.hidden).toBeFalse();
      panel.click();
      expect(panel.hidden).toBeFalse();
    });

    it("docks open panel on reference click", async () => {
      const doc = await makeRSDoc(ops);
      doc.getElementById(dfnId).click();
      const panel = doc.getElementById(getPanelId(dfnId));
      expect(panel.classList).not.toContain("docked");
      panel.querySelector(".dfn-panel-refs a").click();
      expect(panel.classList).toContain("docked");
    });

    it("closes docked panel on panel click", async () => {
      const doc = await makeRSDoc(ops);
      doc.getElementById(dfnId).click();
      const panel = doc.getElementById(getPanelId(dfnId));
      panel.querySelector(".dfn-panel-refs a").click();
      expect(panel.classList).toContain("docked");

      panel.click();
      expect(panel.hidden).toBeTrue();
    });

    it("opens a new panel if another dfn is clicked", async () => {
      const doc = await makeRSDoc(ops);
      const dfnManyId = "dfn-many";
      const dfnOneId = "dfn-one";
      const panelDfnMany = doc.getElementById(getPanelId(dfnManyId));
      const panelDfnOne = doc.getElementById(getPanelId(dfnOneId));

      const [dfnMany, dfnOne] = doc.querySelectorAll("dfn");

      dfnMany.click();
      expect(panelDfnMany.hidden).toBeFalse();
      expect(panelDfnMany.querySelector("a.self-link").hash).toBe("#dfn-many");

      dfnOne.click();
      expect(panelDfnMany.hidden).toBeTrue();
      expect(panelDfnOne.hidden).toBeFalse();
      expect(doc.querySelectorAll(".dfn-panel:not([hidden])")).toHaveSize(1);
      expect(panelDfnOne.querySelector("a.self-link").hash).toBe("#dfn-one");
    });
  });

  it("renders only self link to dfn if no local references", async () => {
    const doc = await makeRSDoc(ops);
    const dfnId = "dfn-zero";
    const dfnZero = doc.getElementById(dfnId);
    dfnZero.click();
    const panel = doc.getElementById(getPanelId(dfnId));

    const selfLink = panel.querySelector("a.self-link");
    expect(selfLink.hash).toBe("#dfn-zero");

    const referenceSection = panel.querySelector(".dfn-panel-refs");
    expect(referenceSection).not.toBeNull();
    expect(referenceSection.textContent.trim()).toBe(
      "Not referenced in this document."
    );
  });

  it("renders reference with relevant title", async () => {
    const doc = await makeRSDoc(ops);
    const dfnId = "dfn-one";
    const dfnOne = doc.getElementById(dfnId);
    dfnOne.click();
    const panel = doc.getElementById(getPanelId(dfnId));

    const selfLink = panel.querySelector("a.self-link");
    expect(selfLink.hash).toBe("#dfn-one");

    const referenceHeading = [...panel.querySelectorAll("b")].find(b =>
      b.textContent.includes("Referenced in:")
    );
    expect(referenceHeading.textContent).toBe("Referenced in:");

    const referenceListItems = panel.querySelectorAll(".dfn-panel-refs li");
    expect(referenceListItems).toHaveSize(1);

    const references = panel.querySelectorAll(".dfn-panel-refs li a");
    expect(references).toHaveSize(1);
    expect(references[0].textContent).toBe("§ 1. top level heading");
    expect(references[0].hash).toBe("#ref-for-dfn-one-1");
  });

  it("renders multiple references with relevant titles", async () => {
    const doc = await makeRSDoc(ops);
    const dfnId = "dfn-many";
    const dfnMany = doc.getElementById(dfnId);
    dfnMany.click();
    const panel = doc.getElementById(getPanelId(dfnId));

    const selfLink = panel.querySelector("a.self-link");
    expect(selfLink.hash).toBe("#dfn-many");

    const referenceHeading = [...panel.querySelectorAll("b")].find(b =>
      b.textContent.includes("Referenced in:")
    );
    expect(referenceHeading.textContent).toBe("Referenced in:");

    const referenceListItems = panel.querySelectorAll(".dfn-panel-refs li");
    expect(referenceListItems).toHaveSize(2);
    const [item1, item2] = referenceListItems;

    const item1Links = item1.querySelectorAll("a");
    expect(item1Links).toHaveSize(3);
    expect(item1Links[0].textContent).toBe("§ 1. top level heading");
    expect(item1Links[0].hash).toBe("#ref-for-dfn-many-1");
    expect(item1Links[1].textContent).toBe("(2)");
    expect(item1Links[1].hash).toBe("#ref-for-dfn-many-2");
    expect(item1Links[2].textContent).toBe("(3)");
    expect(item1Links[2].hash).toBe("#ref-for-dfn-many-5");
    expect(item1.textContent.trim()).toBe("§ 1. top level heading (2) (3)");

    const item2Links = item2.querySelectorAll("a");
    expect(item2Links).toHaveSize(2);
    expect(item2Links[0].textContent).toBe("§ 1.1 nested section heading");
    expect(item2Links[0].hash).toBe("#ref-for-dfn-many-3");
    expect(item2Links[1].textContent).toBe("(2)");
    expect(item2Links[1].hash).toBe("#ref-for-dfn-many-4");
    expect(item2.textContent.trim()).toBe("§ 1.1 nested section heading (2)");
  });

  it("renders a marker on exported definitions", async () => {
    const doc = await makeRSDoc(ops);

    const panelDnExported = doc.getElementById(getPanelId("dfn-many"));
    expect(panelDnExported.querySelectorAll(".marker")).toHaveSize(1);
    const marker = panelDnExported.querySelector(".marker.dfn-exported");
    expect(marker).toBeTruthy();
    expect(marker.textContent).toBe("exported");
    expect(marker.previousElementSibling.textContent).toBe("Permalink");

    const panelDfnNotExported = doc.getElementById(getPanelId("dfn-one"));
    expect(panelDfnNotExported.querySelector(".dfn-exported")).toBeFalsy();
  });

  it("renders a link to jump to IDL block", async () => {
    const body = `
      <section data-dfn-for="Foo">
        <h2><dfn>Foo</dfn> interface</h2>
        <pre class="idl" id="test-webidl-block">
        [Exposed=Window]
        interface Foo {
          constructor();
          attribute DOMString bar;
        };
        </pre>
        <dfn id="test-dfn-idl">bar</dfn>
        <dfn id="test-dfn-no-idl">baz</dfn>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const panelDfnIdl = doc.getElementById(getPanelId("test-dfn-idl"));
    expect(panelDfnIdl.querySelectorAll(".marker")).toHaveSize(2);

    const marker = panelDfnIdl.querySelector(".marker.idl-block");
    expect(marker).toBeTruthy();
    expect(marker.textContent).toBe("IDL");
    expect(marker.hash).toBe("#test-webidl-block");

    const panelDfnNotIdl = doc.getElementById(getPanelId("test-dfn-no-idl"));
    expect(panelDfnNotIdl.querySelectorAll(".marker")).toHaveSize(0);
  });

  it("works in exported document", async () => {
    const rdoc = await makeRSDoc(ops);
    const doc = await getExportedDoc(rdoc);

    const dfnId = "dfn-one";
    const panel = doc.getElementById(getPanelId(dfnId));
    const dfn = doc.getElementById(dfnId);

    expect(panel).toBeTruthy();
    expect(panel.hidden).toBeTrue();

    dfn.click();
    expect(panel.hidden).toBeFalse();

    const selfLink = panel.querySelector("a.self-link");
    expect(selfLink.hash).toBe("#dfn-one");

    const referenceHeading = [...panel.querySelectorAll("b")].find(b =>
      b.textContent.includes("Referenced in:")
    );
    expect(referenceHeading.textContent).toBe("Referenced in:");

    const referenceListItems = panel.querySelectorAll(".dfn-panel-refs li");
    expect(referenceListItems).toHaveSize(1);

    const references = panel.querySelectorAll(".dfn-panel-refs li a");
    expect(references).toHaveSize(1);
    expect(references[0].textContent).toBe("§ 1. top level heading");
    expect(references[0].hash).toBe("#ref-for-dfn-one-1");
  });
});

describe("possible linking syntaxes", () => {
  afterAll(flushIframes);

  it("renders linking syntax section for a plain dfn", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <dfn data-export id="test-concept">my concept</dfn>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panel = doc.getElementById(`dfn-panel-for-test-concept`);

    const syntaxHeading = [...panel.querySelectorAll("b")].find(b =>
      b.textContent.includes("Possible linking syntaxes:")
    );
    expect(syntaxHeading).toBeTruthy();

    const syntaxList = panel.querySelector(".dfn-panel-lt");
    expect(syntaxList).toBeTruthy();

    const items = syntaxList.querySelectorAll("li");
    expect(items).toHaveSize(1);
    expect(items[0].querySelector("code").textContent).toBe("[=my concept=]");
  });

  it("adds the heading and list directly to the panel", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <dfn data-export id="test-direct">my concept</dfn>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panel = doc.getElementById("dfn-panel-for-test-direct");

    // `.dfn-panel > div` is a flex row, so a wrapper div would put the heading
    // and the list side by side.
    const syntaxList = panel.querySelector(".dfn-panel-lt");
    expect(syntaxList.parentElement).toBe(panel);
    const heading = syntaxList.previousElementSibling.querySelector("b");
    expect(heading.textContent).toBe("Possible linking syntaxes:");
  });

  it("lists what links to the term before the linking syntaxes", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <dfn data-export id="test-order">my concept</dfn>
        <a>my concept</a>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panel = doc.getElementById("dfn-panel-for-test-order");
    const references = panel.querySelector(".dfn-panel-refs");
    const syntaxList = panel.querySelector(".dfn-panel-lt");
    const position = references.compareDocumentPosition(syntaxList);
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("lists the syntax that links back to each kind of definition", async () => {
    const listed = panel =>
      [...panel.querySelectorAll(".dfn-panel-lt code")].map(c => c.textContent);

    const cases = [
      {
        name: "dfn type",
        body: `
          <section>
            <h2>Test</h2>
            <dfn data-export id="test-dfn">widget</dfn>
          </section>
        `,
        checks: [
          {
            panelId: "dfn-panel-for-test-dfn",
            syntaxes: ["[=widget=]"],
          },
        ],
      },
      {
        name: "dfn with for",
        body: `
          <section>
            <h2>Test</h2>
            <dfn data-export id="test-dfn" data-dfn-for="Request">mode</dfn>
          </section>
        `,
        checks: [
          {
            panelId: "dfn-panel-for-test-dfn",
            syntaxes: ["[=Request/mode=]"],
          },
        ],
      },
      {
        name: "IDL interface",
        body: `
          <section data-dfn-for="Foo">
            <h2>Foo</h2>
            <pre class="idl">
              [Exposed=Window]
              interface Foo {};
            </pre>
            <dfn data-export id="test-dfn">Foo</dfn>
          </section>
        `,
        checks: [
          {
            panelId: "dfn-panel-for-test-dfn",
            syntaxes: ["{{Foo}}"],
          },
        ],
      },
      {
        name: "element type",
        body: `
          <section>
            <h2>Test</h2>
            <dfn data-export id="test-element" data-dfn-type="element">video</dfn>
          </section>
        `,
        checks: [
          {
            panelId: "dfn-panel-for-test-element",
            syntaxes: ["[^video^]"],
          },
        ],
      },
      {
        name: "element-attr type",
        body: `
          <section>
            <h2>Test</h2>
            <dfn data-export
              id="test-attr"
              data-dfn-type="element-attr"
              data-dfn-for="video"
              >src</dfn
            >
          </section>
        `,
        checks: [
          {
            panelId: "dfn-panel-for-test-attr",
            syntaxes: ["[^video/src^]"],
          },
        ],
      },
      {
        name: "IDL const",
        body: `
          <section>
            <h2>Test</h2>
            <pre class="idl">
              [Exposed=Window]
              interface ConstHolder {
                const unsigned short MAX = 1;
              };
            </pre>
            <p id="ref">{{ConstHolder/MAX}}</p>
          </section>
        `,
        checks: [
          {
            panelId: "dfn-panel-for-dom-constholder-max",
            syntaxes: ["{{ConstHolder/MAX}}"],
            linkCheck: { selector: "#ref a", href: "#dom-constholder-max" },
          },
        ],
      },
      {
        name: "IDL enum value",
        body: `
          <section>
            <h2>Test</h2>
            <pre class="idl">
              enum Mode2 { "first", "with-dash" };
            </pre>
            <p id="ref">{{Mode2/"with-dash"}}</p>
          </section>
        `,
        checks: [
          {
            panelId: "dfn-panel-for-dom-mode2-with-dash",
            syntaxes: ['{{Mode2/"with-dash"}}'],
            linkCheck: { selector: "#ref a", href: "#dom-mode2-with-dash" },
          },
        ],
      },
      {
        name: "concept with slash",
        body: `
          <p><dfn data-export id="t-io">I/O queue</dfn></p>
          <p id="t-io-use">[=I\\/O queue=]</p>
        `,
        checks: [
          {
            panelId: "dfn-panel-for-t-io",
            syntaxes: ["[=I\\/O queue=]"],
            linkCheck: { selector: "#t-io-use a", href: "#t-io" },
          },
        ],
      },
      {
        name: "for-concept with slash",
        body: `
          <p><dfn data-export id="t-io-for" data-dfn-for="Host">I/O queue</dfn></p>
          <p id="ref">[=Host/I\\/O queue=]</p>
        `,
        checks: [
          {
            panelId: "dfn-panel-for-t-io-for",
            syntaxes: ["[=Host/I\\/O queue=]"],
            linkCheck: { selector: "#ref a", href: "#t-io-for" },
          },
        ],
      },
      {
        name: "element attributes (global and specific)",
        body: `
          <p><dfn data-export id="t-role" data-dfn-type="element-attr">role</dfn></p>
          <p id="ref-role">[^/role^]</p>
          <p><dfn data-export id="t-allow" data-dfn-type="element-attr" data-dfn-for="iframe">allow</dfn></p>
        `,
        checks: [
          {
            panelId: "dfn-panel-for-t-role",
            syntaxes: ["[^/role^]"],
            linkCheck: { selector: "#ref-role a", href: "#t-role" },
          },
          {
            panelId: "dfn-panel-for-t-allow",
            syntaxes: ["[^iframe/allow^]"],
          },
        ],
      },
      {
        name: "CDDL value with slash",
        body: `
          <section>
            <h2>Test</h2>
            <pre class="cddl">attire = "a/b" / "c"</pre>
            <p id="use-ab">{^attire/"a/b"^}</p>
          </section>
        `,
        checks: [
          {
            panelId: "dfn-panel-for-cddl-value-attire-a-b",
            syntaxes: ['{^attire/"a/b"^}'],
            linkCheck: {
              selector: "#use-ab a",
              href: "#cddl-value-attire-a-b",
            },
          },
        ],
      },
      {
        name: "WebIDL generated definitions",
        body: `
          <pre class="idl">
            [Exposed=Window]
            interface Thing {
              attribute long attr;
            };
          </pre>
        `,
        checks: [
          {
            panelId: "dfn-panel-for-dom-thing",
            syntaxes: ["{{Thing}}"],
          },
          {
            panelId: "dfn-panel-for-dom-thing-attr",
            syntaxes: ["{{Thing/attr}}"],
          },
        ],
      },
    ];

    for (const c of cases) {
      const ops = makeStandardOps(null, c.body);
      const doc = await makeRSDoc(ops);

      for (const check of c.checks) {
        const panel = doc.getElementById(check.panelId);
        expect(panel).withContext(c.name).toBeTruthy();
        if (!panel) continue;

        const actualSyntaxes = listed(panel);
        expect(actualSyntaxes).withContext(c.name).toEqual(check.syntaxes);

        if (check.linkCheck) {
          const { selector, href } = check.linkCheck;
          const link = doc.querySelector(selector);
          expect(link).withContext(c.name).toBeTruthy();
          expect(link.getAttribute("href")).withContext(c.name).toBe(href);
        }
      }
    }
  });

  it("lists the right terms for aliases, local aliases, ordering and special terms", async () => {
    const listed = panel =>
      [...panel.querySelectorAll(".dfn-panel-lt code")].map(c => c.textContent);

    const cases = [
      {
        name: "data-lt aliases",
        body: `
          <section>
            <h2>Test</h2>
            <dfn data-export id="test-lt" data-lt="widget|thing">widget</dfn>
          </section>
        `,
        expectations: async (doc, c) => {
          const panel = doc.getElementById("dfn-panel-for-test-lt");
          const items = panel.querySelectorAll(".dfn-panel-lt li");
          expect(items).withContext(c.name).toHaveSize(2);
          expect(items[0].querySelector("code").textContent)
            .withContext(c.name)
            .toBe("[=widget=]");
          expect(items[1].querySelector("code").textContent)
            .withContext(c.name)
            .toBe("[=thing=]");
        },
      },
      {
        name: "local alias with back-links",
        body: `
          <section>
            <h2>Test</h2>
            <p><dfn data-export id="t-local" data-local-lt="loc alias">local term</dfn></p>
            <p id="use-term">[=local term=]</p>
            <p id="use-alias">[=loc alias=]</p>
          </section>
        `,
        expectations: async (doc, c) => {
          const panel = doc.getElementById("dfn-panel-for-t-local");
          expect(listed(panel))
            .withContext(c.name)
            .toEqual(["[=local term=]", "[=loc alias=]"]);
          const termLink = doc.querySelector("#use-term a");
          expect(termLink.getAttribute("href"))
            .withContext(c.name)
            .toBe("#t-local");
          const aliasLink = doc.querySelector("#use-alias a");
          expect(aliasLink.getAttribute("href"))
            .withContext(c.name)
            .toBe("#t-local");
        },
      },
      {
        name: "own text first, then data-lt",
        body: `<p><dfn data-export id="t-order" data-lt="gadget|gizmo">thing</dfn></p>`,
        expectations: async (doc, c) => {
          const panel = doc.getElementById("dfn-panel-for-t-order");
          expect(listed(panel))
            .withContext(c.name)
            .toEqual(["[=thing=]", "[=gadget=]", "[=gizmo=]"]);
        },
      },
      {
        name: "own text deduplicated from data-lt",
        body: `<p><dfn data-export id="t-order2" data-lt="gadget|thing">thing</dfn></p>`,
        expectations: async (doc, c) => {
          const panel = doc.getElementById("dfn-panel-for-t-order2");
          expect(listed(panel))
            .withContext(c.name)
            .toEqual(["[=thing=]", "[=gadget=]"]);
        },
      },
      {
        name: "enum-value empty string special case",
        body: `
          <section>
            <h2>Test</h2>
            <p><dfn data-export id="t-empty2" data-dfn-type="enum-value" data-dfn-for="Other">""</dfn></p>
            <p id="use-a">{{Other/"the-empty-string"}}</p>
            <p id="use-b">{{Other/""}}</p>
          </section>
        `,
        expectations: async (doc, c) => {
          const panel = doc.getElementById("dfn-panel-for-t-empty2");
          expect(listed(panel))
            .withContext(c.name)
            .toEqual(['{{Other/""}}', '{{Other/"the-empty-string"}}']);
          const linkA = doc.querySelector("#use-a a");
          expect(linkA.getAttribute("href"))
            .withContext(c.name)
            .toBe("#t-empty2");
          const linkB = doc.querySelector("#use-b a");
          expect(linkB.getAttribute("href"))
            .withContext(c.name)
            .toBe("#t-empty2");
        },
      },
      {
        name: "IDL members (no qualified aliases)",
        body: `
          <pre class="idl">
            [Exposed=Window]
            interface Parent {
              attribute long attr;
              undefined method(long arg);
            };
          </pre>
        `,
        expectations: async (doc, c) => {
          const attrPanel = doc.getElementById("dfn-panel-for-dom-parent-attr");
          expect(listed(attrPanel))
            .withContext(c.name)
            .toEqual(["{{Parent/attr}}"]);
          const methodPanel = doc.getElementById(
            "dfn-panel-for-dom-parent-method"
          );
          expect(listed(methodPanel))
            .withContext(c.name)
            .toEqual([
              "{{Parent/method}}",
              "{{Parent/method()}}",
              "{{Parent/method(arg)}}",
            ]);
        },
      },
    ];

    for (const c of cases) {
      const ops = makeStandardOps(null, c.body);
      const doc = await makeRSDoc(ops);
      await c.expectations(doc, c);
    }
  });

  it("does not submit an author's form when a copy button inside it is clicked", async () => {
    const body = `
      <form id="author-form" action="#submitted"><script></script></form>
      <section>
        <h2>Test</h2>
        <dfn data-export id="test-form">foo</dfn>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const form = doc.getElementById("author-form");
    const panel = doc.getElementById("dfn-panel-for-test-form");
    // Panels go before the first <script> in the body, here the one in the form.
    expect(form.contains(panel)).toBeTrue();

    let submits = 0;
    form.addEventListener("submit", event => {
      event.preventDefault();
      submits++;
    });
    panel.querySelector(".dfn-panel-copy-btn").click();
    expect(submits).toBe(0);
  });

  it("keeps a docked panel open when a copy button is clicked", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <dfn data-export id="test-docked" data-lt="foo|bar">foo</dfn>
        <a>foo</a>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const dfn = doc.getElementById("test-docked");
    const panel = doc.getElementById("dfn-panel-for-test-docked");

    dfn.click();
    // Clicking a reference inside the panel docks it.
    panel.querySelector(".dfn-panel-refs a").click();
    expect(panel.classList.contains("docked")).toBeTrue();

    panel.querySelector(".dfn-panel-copy-btn").click();
    expect(panel.hidden).toBeFalse();
  });

  it("keeps the panel open when Enter is pressed on a copy button, and closes it on a link", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <dfn data-export id="test-enter" data-lt="foo|bar">foo</dfn>
        <a>foo</a>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    // A hidden frame has no layout, and then showing a panel throws before it traps focus.
    const doc = await makeRSDoc(ops, null, "display: block");
    const pressEnter = target =>
      target.dispatchEvent(
        new doc.defaultView.KeyboardEvent("keydown", {
          key: "Enter",
          bubbles: true,
        })
      );
    const dfn = doc.getElementById("test-enter");
    const panel = doc.getElementById("dfn-panel-for-test-enter");

    dfn.click();
    expect(panel.contains(doc.activeElement)).toBeTrue();

    pressEnter(panel.querySelector(".dfn-panel-copy-btn"));
    expect(panel.hidden).toBeFalse();

    pressEnter(panel.querySelector(".dfn-panel-refs a"));
    expect(panel.hidden).toBeTrue();
  });

  it("lists no syntax where none can link back, and keeps the control cases", async () => {
    const listed = panel => {
      return [...panel.querySelectorAll(".dfn-panel-lt code")].map(
        c => c.textContent
      );
    };

    const cases = [
      {
        name: "IDL overload with no linkable signature",
        body: `
          <section>
            <h2>Test</h2>
            <pre class="idl">
              [Exposed=Window]
              interface Over2 {
                undefined over();
                undefined over(long x);
              };
            </pre>
          </section>
        `,
        noSyntaxPanels: ["dfn-panel-for-dom-over2-over!overload-1"],
        withSyntaxPanels: {
          "dfn-panel-for-dom-over2-over": [
            "{{Over2/over}}",
            "{{Over2/over()}}",
          ],
        },
      },
      {
        name: "dfn types with no inline link syntax",
        body: `
          <section>
            <h2>Test</h2>
            <dfn data-export id="test-event" data-dfn-type="event">my-event</dfn>
            <dfn data-export id="test-header" data-dfn-type="http-header">My-Header</dfn>
            <dfn data-export id="test-plain">my concept</dfn>
          </section>
        `,
        noSyntaxPanels: [
          "dfn-panel-for-test-event",
          "dfn-panel-for-test-header",
        ],
        withSyntaxPanels: {
          "dfn-panel-for-test-plain": ["[=my concept=]"],
        },
      },
      {
        name: "imported index-term",
        body: `
          <section data-cite="DOM">
            <h2>TEST</h2>
            <p>{{ Event }}</p>
          </section>
          <section id="index"></section>
        `,
        check: (doc, c) => {
          const term = doc.querySelector(
            "#index-defined-elsewhere .index-term"
          );
          expect(term).withContext(c.name).not.toBeNull();
          const termPanel = doc.getElementById(`dfn-panel-for-${term?.id}`);
          expect(termPanel).withContext(c.name).not.toBeNull();
          expect(termPanel?.querySelector(".dfn-panel-lt"))
            .withContext(c.name)
            .toBeNull();
        },
      },
      {
        name: "attribute value containing a slash",
        body: `
          <p>
            <dfn data-export id="t-enc" data-dfn-type="attr-value" data-dfn-for="form/enctype">application/x-www-form-urlencoded</dfn>
          </p>
        `,
        noSyntaxPanels: ["dfn-panel-for-t-enc"],
      },
      {
        name: "inconsistent definitions",
        body: `
          <p><dfn data-export id="t-blink" data-dfn-type="element" data-dfn-for="html">blink</dfn></p>
          <p><dfn data-export id="t-on" data-dfn-type="attr-value">on</dfn></p>
          <p><dfn data-export id="t-iframe" data-dfn-type="element">iframe</dfn></p>
        `,
        noSyntaxPanels: ["dfn-panel-for-t-blink", "dfn-panel-for-t-on"],
        withSyntaxPanels: {
          "dfn-panel-for-t-iframe": ["[^iframe^]"],
        },
      },
      {
        name: "empty IDL enum value",
        body: `
          <pre class="idl">enum Mode { "", "a" };</pre>
        `,
        noSyntaxPanels: ["dfn-panel-for-dom-mode-the-empty-string"],
        withSyntaxPanels: {
          "dfn-panel-for-dom-mode-a": ['{{Mode/"a"}}'],
        },
      },
      {
        name: "IDL enum value with slash",
        body: `
          <section>
            <h2>Test</h2>
            <pre class="idl">
              enum Mode3 { "text/plain", "b" };
            </pre>
          </section>
        `,
        noSyntaxPanels: ["dfn-panel-for-dom-mode3-text/plain"],
        withSyntaxPanels: {
          "dfn-panel-for-dom-mode3-b": ['{{Mode3/"b"}}'],
        },
      },
      {
        name: "unquoted CDDL type with slash",
        body: `
          <section>
            <h2>Test</h2>
            <p><dfn data-export id="t-cddl-slash" data-dfn-type="cddl-type">group/subgroup</dfn></p>
            <p><dfn data-export id="t-cddl-plain" data-dfn-type="cddl-type">plain</dfn></p>
          </section>
        `,
        noSyntaxPanels: ["dfn-panel-for-t-cddl-slash"],
        withSyntaxPanels: {
          "dfn-panel-for-t-cddl-plain": ["{^plain^}"],
        },
      },
      {
        name: "non-exported definition",
        body: `<p><dfn id="t-local" data-lt="foo|bar">foo</dfn></p>`,
        noSyntaxPanels: ["dfn-panel-for-t-local"],
        check: (doc, c) => {
          const panel = doc.getElementById("dfn-panel-for-t-local");
          const hasHeading = [...panel.querySelectorAll("b")].some(
            el => el.textContent === "Possible linking syntaxes:"
          );
          expect(hasHeading).withContext(c.name).toBeFalse();
          expect(doc.querySelector("svg.dfn-panel-sprite"))
            .withContext(c.name)
            .toBeNull();
        },
      },
      {
        name: "no SVG sprite when no syntaxes",
        body: `
          <p><dfn data-export id="t-none" data-dfn-type="event">only</dfn></p>
        `,
        noSyntaxPanels: ["dfn-panel-for-t-none"],
        check: (doc, c) => {
          expect(doc.querySelector("symbol")).withContext(c.name).toBeNull();
          expect(doc.querySelector(".dfn-panel-sprite"))
            .withContext(c.name)
            .toBeNull();
        },
      },
    ];

    for (const c of cases) {
      const ops = makeStandardOps(null, c.body);
      const doc = await makeRSDoc(ops);

      if (c.noSyntaxPanels) {
        for (const panelId of c.noSyntaxPanels) {
          const panel = doc.getElementById(panelId);
          expect(panel).withContext(c.name).not.toBeNull();
          const lt = panel.querySelector(".dfn-panel-lt");
          expect(lt).withContext(c.name).toBeNull();
        }
      }

      if (c.withSyntaxPanels) {
        for (const panelId in c.withSyntaxPanels) {
          const panel = doc.getElementById(panelId);
          expect(panel).withContext(c.name).not.toBeNull();
          const expected = c.withSyntaxPanels[panelId];
          expect(listed(panel)).withContext(c.name).toEqual(expected);
        }
      }

      if (c.check) {
        c.check(doc, c);
      }
    }
  });

  it("shows markup in data-lt as text, ignores a blank data-dfn-for, and survives a missing clipboard", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <dfn data-export id="test-odd" data-lt="&lt;img src=x onerror=alert(1)&gt;">hostile</dfn>
        <dfn data-export id="test-blank-for" data-dfn-for=" ">blank for</dfn>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const win = doc.defaultView;

    const hostile = doc.getElementById("dfn-panel-for-test-odd");
    expect(hostile.querySelector("img")).toBeNull();
    const codes = [...hostile.querySelectorAll(".dfn-panel-lt code")];
    expect(codes.map(c => c.textContent)).toEqual([
      "[=hostile=]",
      "[=<img src=x onerror=alert(1)>=]",
    ]);

    const blank = doc.getElementById("dfn-panel-for-test-blank-for");
    const blankCodes = [...blank.querySelectorAll(".dfn-panel-lt code")];
    expect(blankCodes.map(c => c.textContent)).toEqual(["[=blank for=]"]);

    // Outside secure contexts navigator.clipboard is undefined.
    Object.defineProperty(win.navigator, "clipboard", {
      value: undefined,
      configurable: true,
    });
    const errors = [];
    win.addEventListener("error", e => errors.push(e.message));
    hostile.querySelector(".dfn-panel-copy-btn").click();
    expect(errors).toEqual([]);
  });

  it("moves focus with Tab and Shift+Tab, wraps at the ends, and starts from the first or last control when focus is outside", async () => {
    const body = `<p><dfn data-export id="t-focus" data-lt="foo|bar">foo</dfn></p>`;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops, null, "display: block");

    const panel = doc.getElementById("dfn-panel-for-t-focus");
    doc.getElementById("t-focus").click();

    const controls = [
      ...panel.querySelectorAll("a[href], button:not([disabled])"),
    ];
    const first = controls[0];
    const last = controls[controls.length - 1];
    const middle = controls[1];

    const dispatchTab = (target, shiftKey) => {
      target.dispatchEvent(
        new doc.defaultView.KeyboardEvent("keydown", {
          key: "Tab",
          shiftKey,
          bubbles: true,
          cancelable: true,
        })
      );
    };

    expect(controls.length).toBe(3);
    const cases = [
      {
        name: "Tab from the permalink to the first copy button",
        start: first,
        shiftKey: false,
        end: middle,
      },
      {
        name: "Tab between copy buttons",
        start: middle,
        shiftKey: false,
        end: last,
      },
      {
        name: "Tab wraps from the last control to the first",
        start: last,
        shiftKey: false,
        end: first,
      },
      {
        name: "Shift+Tab between copy buttons",
        start: last,
        shiftKey: true,
        end: middle,
      },
      {
        name: "Shift+Tab from the first copy button to the permalink",
        start: middle,
        shiftKey: true,
        end: first,
      },
      {
        name: "Shift+Tab wraps from the first control to the last",
        start: first,
        shiftKey: true,
        end: last,
      },
      {
        name: "Tab from outside the panel's controls",
        start: null,
        shiftKey: false,
        end: first,
      },
      {
        name: "Shift+Tab from outside the panel's controls",
        start: null,
        shiftKey: true,
        end: last,
      },
    ];

    for (const c of cases) {
      if (c.start) {
        c.start.focus();
      } else {
        doc.activeElement?.blur();
      }
      expect(doc.activeElement)
        .withContext(`${c.name} (before)`)
        .toBe(c.start || doc.body);

      const target = c.start || panel;
      dispatchTab(target, c.shiftKey);

      expect(doc.activeElement).withContext(c.name).toBe(c.end);
    }
  });

  it("labels the list of syntaxes with its heading", async () => {
    const body = `<p><dfn data-export id="t-aria" data-lt="foo">foo</dfn></p>`;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const panel = doc.getElementById("dfn-panel-for-t-aria");
    const list = panel.querySelector(".dfn-panel-lt");
    expect(list).not.toBeNull();
    const labelledby = list.getAttribute("aria-labelledby");
    expect(labelledby).toBeTruthy();
    const heading = panel.querySelector(`#${labelledby}`);
    expect(heading).not.toBeNull();
    expect(heading.textContent.trim()).toBe("Possible linking syntaxes:");
  });

  it("styles the syntax rows: icon hidden until hover or focus, pressed look, hidden word, selectable text, hidden sprite", async () => {
    const body = `<p><dfn data-export id="t">t</dfn></p>`;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const rules = [...doc.querySelectorAll("style")].flatMap(style => [
      ...(style.sheet?.cssRules ?? []),
    ]);

    const cases = [
      {
        name: "icon hidden at rest",
        selector: ".dfn-panel .dfn-panel-copy-btn svg",
        property: "opacity",
        value: "0",
      },
      {
        name: "icon visible on hover/focus",
        selectorIncludes: [
          "li:hover .dfn-panel-copy-btn svg",
          ".dfn-panel-copy-btn:focus svg",
        ],
        property: "opacity",
        value: "1",
      },
      {
        name: "icon pressed look",
        selector: ".dfn-panel .dfn-panel-copy-btn:active svg",
        property: "box-shadow",
        nonEmpty: true,
      },
      {
        name: "hidden 'Copy' text position",
        selector: ".dfn-panel .visually-hidden",
        property: "position",
        value: "absolute",
      },
      {
        name: "hidden 'Copy' text width",
        selector: ".dfn-panel .visually-hidden",
        property: "width",
        value: "1px",
      },
      {
        name: "selectable syntax text",
        selector: ".dfn-panel .dfn-panel-lt code",
        property: "user-select",
        value: "all",
      },
      {
        name: "hidden sprite position",
        selector: ".dfn-panel-sprite",
        property: "position",
        value: "absolute",
      },
      {
        name: "hidden sprite width",
        selector: ".dfn-panel-sprite",
        property: "width",
        value: "0px",
      },
      {
        name: "hidden sprite height",
        selector: ".dfn-panel-sprite",
        property: "height",
        value: "0px",
      },
      {
        name: "hidden sprite display",
        selector: ".dfn-panel-sprite",
        property: "display",
        notValue: "none",
      },
      {
        name: "icon hover background",
        selector: ".dfn-panel .dfn-panel-copy-btn:hover svg",
        specialCheck: "backgroundOrBackgroundColor",
      },
    ];

    for (const c of cases) {
      const matchingRules = rules.filter(rule => {
        if (c.selector) {
          return rule.selectorText === c.selector;
        }
        if (c.selectorIncludes) {
          return c.selectorIncludes.every(sub =>
            rule.selectorText?.includes(sub)
          );
        }
        return false;
      });

      expect(matchingRules.length).withContext(c.name).toBe(1);
      const style = matchingRules[0].style;

      if (c.value !== undefined) {
        expect(style.getPropertyValue(c.property))
          .withContext(c.name)
          .toBe(c.value);
      } else if (c.notValue !== undefined) {
        expect(style.getPropertyValue(c.property))
          .withContext(c.name)
          .not.toBe(c.notValue);
      } else if (c.nonEmpty) {
        expect(style.getPropertyValue(c.property))
          .withContext(c.name)
          .not.toBe("");
      } else if (c.specialCheck === "backgroundOrBackgroundColor") {
        const bg = style.getPropertyValue("background");
        const bgColor = style.getPropertyValue("background-color");
        expect(bg || bgColor)
          .withContext(c.name)
          .not.toBe("");
      }
    }
  });

  it("renders each syntax as one button with an accessible name and one shared icon", async () => {
    const body = `<p><dfn data-export id="test-copy" data-lt="foo|bar">foo</dfn> <dfn data-export id="test-other">other</dfn></p>`;
    const doc = await makeRSDoc(makeStandardOps(null, body));

    const panel = doc.getElementById("dfn-panel-for-test-copy");
    const listItems = [...panel.querySelectorAll(".dfn-panel-lt li")];
    expect(listItems.length).toBe(2);

    const sprite = doc.querySelector("svg.dfn-panel-sprite");
    expect(sprite).not.toBeNull();
    expect(sprite.getAttribute("aria-hidden")).toBe("true");

    const symbols = doc.querySelectorAll("symbol");
    expect(symbols.length).toBe(1);
    expect(doc.querySelectorAll(".dfn-panel-copy-btn svg use")).toHaveSize(3);
    const symbol = symbols[0];
    expect(symbol.querySelector("path")).not.toBeNull();
    expect(symbol.hasAttribute("viewBox")).toBeTrue();
    expect(symbol.getAttribute("viewBox")).not.toBe("");

    const buttons = listItems.map(li => li.firstElementChild);
    expect(buttons.length).toBe(2);

    const copied = [];
    Object.defineProperty(doc.defaultView.navigator, "clipboard", {
      value: {
        writeText: text => {
          copied.push(text);
          return Promise.resolve();
        },
      },
      configurable: true,
    });

    for (const button of buttons) {
      expect(button.parentElement.children.length).toBe(1);
      expect(button.tagName).toBe("BUTTON");
      expect(button.getAttribute("type")).toBe("button");
      expect(button.hasAttribute("aria-label")).toBeFalse();
      expect(button.hasAttribute("title")).toBeFalse();
      expect(button.hasAttribute("data-copy-text")).toBeFalse();

      const hiddenSpan = button.querySelector("span.visually-hidden");
      expect(hiddenSpan).not.toBeNull();
      expect(hiddenSpan.textContent).toBe("Copy ");
      expect(hiddenSpan.nextElementSibling.tagName).toBe("CODE");

      const svg = button.querySelector("svg");
      expect(svg).not.toBeNull();
      expect(svg.getAttribute("aria-hidden")).toBe("true");
      expect(svg.querySelector("path")).toBeNull();
      const use = svg.querySelector("use");
      expect(use).not.toBeNull();
      expect(use.getAttribute("href")).toBe(`#${symbol.id}`);
    }

    expect(buttons[0].textContent.trim().replace(/\s+/g, " ")).toBe(
      "Copy [=foo=]"
    );
    expect(buttons[1].textContent.trim().replace(/\s+/g, " ")).toBe(
      "Copy [=bar=]"
    );

    buttons[1].click();
    await new Promise(resolve => queueMicrotask(resolve));
    expect(copied).toEqual(["[=bar=]"]);
  });

  it("copies syntax when clicking the icon inside a copy button and keeps the panel open", async () => {
    const body = `
    <p><dfn data-export id="t-icon" data-lt="foo|bar">foo</dfn></p>
  `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const dfn = doc.getElementById("t-icon");
    const panel = doc.getElementById("dfn-panel-for-t-icon");
    const copied = [];
    Object.defineProperty(doc.defaultView.navigator, "clipboard", {
      value: {
        writeText: text => {
          copied.push(text);
          return Promise.resolve();
        },
      },
      configurable: true,
    });

    dfn.click();
    const svg = panel.querySelectorAll(".dfn-panel-copy-btn svg")[1];
    svg.dispatchEvent(
      new doc.defaultView.MouseEvent("click", { bubbles: true })
    );

    expect(panel.hidden).toBeFalse();
    expect(copied).toEqual(["[=bar=]"]);
  });

  it("keeps the copy buttons in an exported document, and they copy", async () => {
    const body = `
    <section>
      <h2>Test</h2>
      <dfn data-export id="test-export-copy" data-lt="foo|bar">foo</dfn>
    </section>
  `;
    const ops = makeStandardOps(null, body);
    const rdoc = await makeRSDoc(ops);
    const doc = await getExportedDoc(rdoc);
    const copied = [];
    Object.defineProperty(doc.defaultView.navigator, "clipboard", {
      value: { writeText: text => copied.push(text) && Promise.resolve() },
      configurable: true,
    });

    const panel = doc.getElementById("dfn-panel-for-test-export-copy");
    const buttons = panel.querySelectorAll(".dfn-panel-copy-btn");
    expect(buttons).toHaveSize(2);
    buttons[1].click();
    expect(copied).toEqual(["[=bar=]"]);
  });

  it("keeps the SVG sprite and buttons in an exported document", async () => {
    const body = `
    <p><dfn data-export id="t-exp" data-lt="foo|bar">foo</dfn></p>
  `;
    const ops = makeStandardOps(null, body);
    const rdoc = await makeRSDoc(ops);
    const doc = await getExportedDoc(rdoc);
    const symbols = doc.querySelectorAll("symbol");
    expect(symbols).toHaveSize(1);
    const symbol = symbols[0];
    const buttons = doc.querySelectorAll(".dfn-panel-copy-btn");
    expect(buttons).toHaveSize(2);
    const use = buttons[0].querySelector("svg use");
    const target = doc.getElementById(use.getAttribute("href").substring(1));
    expect(target).toBe(symbol);
  });

  it("copies syntax when clicking text inside a copy button", async () => {
    const body = `
    <p><dfn data-export id="t-click" data-lt="foo|bar">foo</dfn></p>
  `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const copied = [];
    Object.defineProperty(doc.defaultView.navigator, "clipboard", {
      value: { writeText: text => copied.push(text) && Promise.resolve() },
      configurable: true,
    });
    const panel = doc.getElementById("dfn-panel-for-t-click");
    const click = target =>
      target.dispatchEvent(
        new doc.defaultView.MouseEvent("click", { bubbles: true })
      );

    const code = panel.querySelectorAll("code")[1];
    click(code);
    expect(copied).toEqual(["[=bar=]"]);

    const span = panel.querySelector("span.visually-hidden");
    click(span);
    expect(copied).toEqual(["[=bar=]", "[=foo=]"]);
  });

  it("calls button.ariaNotify on successful copy but not on failure", async () => {
    const body = `
    <p><dfn data-export data-lt="foo|bar|baz">test</dfn></p>
  `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const buttons = doc.querySelectorAll(".dfn-panel-copy-btn");
    const wait = () => new Promise(resolve => setTimeout(resolve, 50));

    const notes1 = [];
    Object.defineProperty(doc.defaultView.navigator, "clipboard", {
      value: { writeText: () => Promise.resolve() },
      configurable: true,
    });
    buttons[0].ariaNotify = msg => notes1.push(msg);
    buttons[0].click();
    await wait();
    expect(notes1).toEqual(["Copied"]);

    const notes2 = [];
    Object.defineProperty(doc.defaultView.navigator, "clipboard", {
      value: { writeText: () => Promise.reject(new Error("fail")) },
      configurable: true,
    });
    buttons[1].ariaNotify = msg => notes2.push(msg);
    buttons[1].click();
    await wait();
    expect(notes2).toEqual([]);

    Object.defineProperty(doc.defaultView.navigator, "clipboard", {
      value: { writeText: () => Promise.resolve() },
      configurable: true,
    });
    buttons[2].ariaNotify = undefined;
    const fail = jasmine.createSpy("fail");
    doc.defaultView.addEventListener("error", fail);
    doc.defaultView.addEventListener("unhandledrejection", fail);
    buttons[2].click();
    await wait();
    expect(fail).not.toHaveBeenCalled();
    doc.defaultView.removeEventListener("error", fail);
    doc.defaultView.removeEventListener("unhandledrejection", fail);
  });

  it("hides the IDL code-block's copy icon from assistive technology", async () => {
    const body = `
    <pre class="idl">[Exposed=Window] interface Thing {};</pre>
  `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const button = doc.querySelector(".respec-button-copy-paste");
    const svg = button.querySelector("svg");
    expect(svg.getAttribute("aria-hidden")).toBe("true");
  });

  it("lists syntaxes only for exported definitions", async () => {
    const listed = panel =>
      [...panel.querySelectorAll(".dfn-panel-lt code")].map(c => c.textContent);

    const cases = [
      {
        name: "via data-export attribute",
        body: `<p><dfn id="t-exported" data-export data-lt="foo|bar">foo</dfn></p>`,
        expectations: async (doc, c) => {
          const panel = doc.getElementById("dfn-panel-for-t-exported");
          expect(listed(panel))
            .withContext(c.name)
            .toEqual(["[=foo=]", "[=bar=]"]);
        },
      },
      {
        name: "via 'export' class",
        body: `<p><dfn id="t-class" class="export">foo</dfn></p>`,
        expectations: async (doc, c) => {
          const panel = doc.getElementById("dfn-panel-for-t-class");
          expect(listed(panel)).withContext(c.name).toEqual(["[=foo=]"]);
        },
      },
      {
        name: "mixed export/no-export with sprite check",
        body: `<p><dfn id="t-yes" data-export>yes</dfn> <dfn id="t-no">no</dfn></p>`,
        expectations: async (doc, c) => {
          const yesPanel = doc.getElementById("dfn-panel-for-t-yes");
          expect(listed(yesPanel)).withContext(c.name).toEqual(["[=yes=]"]);
          const noPanel = doc.getElementById("dfn-panel-for-t-no");
          expect(noPanel.querySelector(".dfn-panel-lt"))
            .withContext(c.name)
            .toBeNull();
          expect(doc.querySelectorAll("symbol").length)
            .withContext(c.name)
            .toBe(1);
        },
      },
    ];

    for (const c of cases) {
      const ops = makeStandardOps(null, c.body);
      const doc = await makeRSDoc(ops);
      await c.expectations(doc, c);
    }
  });
});
