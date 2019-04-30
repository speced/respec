"use strict";

import {
  flushIframes,
  makeRSDoc,
  makeStandardOps,
  xrefTestUrl,
} from "../SpecHelper.js";

describe("Core - Inlines", () => {
  afterAll(flushIframes);
  it("processes inline cite content", async () => {
    const body = `
      <section id="conformance">
        <p>[[dom]] and [[html]] are normative in normative section.</p>
        <p>Normative section can have informative refs [[?infra]].</p>
        <p>Adding a MUST, MAY, SHOULD, adds RFC2119.</p>
      </section>
      <section class="informative">
        <p>[[webidl]] is informative.</p>
        <p id="illegal">A normative reference in informative section [[!svg]] is illegal.
        But we keep it as normative and emit a warning.</p>
        <p id="illegal-no-warn">A normative reference in informative section [[dom]] is illegal.
        But as it is already declared as normative above, we keep it as normative and do not emit warning.</p>
      </section>
    `;
    const ops = makeStandardOps({}, body);
    const doc = await makeRSDoc(ops);

    const norm = [...doc.querySelectorAll("#normative-references dt")];
    expect(norm.length).toBe(4);
    expect(norm.map(el => el.textContent)).toEqual([
      "[dom]",
      "[html]",
      "[RFC2119]", // added by conformance section
      "[svg]",
    ]);

    const inform = [...doc.querySelectorAll("#informative-references dt")];
    expect(inform.length).toBe(2);
    expect(inform.map(el => el.textContent)).toEqual(["[infra]", "[webidl]"]);

    const links = [...doc.querySelectorAll("section cite a")];
    expect(links.length).toBe(7);
    expect(links[0].textContent).toBe("RFC2119");
    expect(links[0].getAttribute("href")).toBe("#bib-rfc2119");
    expect(links[1].textContent).toBe("dom");
    expect(links[1].getAttribute("href")).toBe("#bib-dom");
    expect(links[5].textContent).toBe("svg");
    expect(links[5].getAttribute("href")).toBe("#bib-svg");

    const illegalCite = doc.querySelector("#illegal cite");
    expect(illegalCite.classList.contains("respec-offending-element")).toBe(
      true
    );

    const illegalCiteNoWarn = doc.querySelector("#illegal-no-warn cite");
    expect(illegalCiteNoWarn.classList).not.toContain(
      "respec-offending-element"
    );
  });

  it("processes abbr and rfc2119 content", async () => {
    const body = `
      <section id='inlines'>
        <p><abbr title='ABBR-TIT'>ABBR</abbr> ABBR</p>
        <p>MUST and NOT RECOMMENDED</p>
      </section>
    `;
    const ops = makeStandardOps({}, body);
    const doc = await makeRSDoc(ops);
    const inl = doc.getElementById("inlines");

    const abbr = inl.querySelectorAll("abbr[title='ABBR-TIT']");
    expect(abbr.length).toBe(2);
    expect([...abbr].every(({ textContent: t }) => t === "ABBR")).toBeTruthy();

    const rfc2119 = [...inl.querySelectorAll("em.rfc2119")];
    expect(rfc2119.length).toBe(2);
    expect(rfc2119[0].textContent).toBe("MUST");
    expect(rfc2119[1].textContent).toBe("NOT RECOMMENDED");
  });

  it("processes inline variable syntax", async () => {
    const body = `
      <section>
        <p id="a1">TEXT |variable: Type| TEXT</p>
        <p id="a2">TEXT |variable with spaces:Type| TEXT</p>
        <p id="a3">TEXT |with spaces :  Type| TEXT</p>
        <p id="e">TEXT |p| TEXT </p>
      </section>
      <section>
        <p id="a4">TEXT |with spaces :  Type with spaces| TEXT</p>
        <p id="b">TEXT |variable| TEXT</p>
        <p id="c">TEXT | ignored | TEXT</p>
        <p id="d">TEXT|ignore: Ignore|TEXT</p>
        <p id="f">TEXT |p: Type with spaces| TEXT </p>
        <p id="g"> |p: Type with spaces| and |var1| and |var2:Type| </p>
      </section>
      <section>
        <p id="h"> TEXT |var: Generic&lt;int&gt;| TEXT |var2: Generic&lt;unsigned short int&gt;| </p>
      </section>
    `;
    const doc = await makeRSDoc(makeStandardOps(null, body));

    const a1 = doc.querySelector("#a1 var");
    expect(a1.textContent).toBe("variable");
    expect(a1.dataset.type).toBe("Type");

    const a2 = doc.querySelector("#a2 var");
    expect(a2.textContent).toBe("variable with spaces");
    expect(a2.dataset.type).toBe("Type");
    const a3 = doc.querySelector("#a3 var");
    expect(a3.textContent).toBe("with spaces");
    expect(a3.dataset.type).toBe("Type");

    const a4 = doc.querySelector("#a4 var");
    expect(a4.textContent).toBe("with spaces");
    expect(a4.dataset.type).toBe("Type with spaces");

    const b = doc.querySelector("#b var");
    expect(b.textContent).toBe("variable");
    expect(b.dataset.type).toBeUndefined();

    expect(doc.querySelector("#c var")).toBeFalsy();
    expect(doc.querySelector("#d var")).toBeFalsy();

    const e = doc.querySelector("#e var");
    expect(e.textContent).toBe("p");
    expect(e.dataset.type).toBeUndefined();
    const f = doc.querySelector("#f var");
    expect(f.textContent).toBe("p");
    expect(f.dataset.type).toBe("Type with spaces");

    const g = doc.querySelectorAll("#g var");
    expect(g[0].textContent).toBe("p");
    expect(g[0].dataset.type).toBe("Type with spaces");
    expect(g[1].textContent).toBe("var1");
    expect(g[1].dataset.type).toBeUndefined();
    expect(g[2].textContent).toBe("var2");
    expect(g[2].dataset.type).toBe("Type");

    const h = doc.querySelectorAll("#h var");
    expect(h[0].textContent).toBe("var");
    expect(h[0].dataset.type).toBe("Generic<int>");
    expect(h[1].textContent).toBe("var2");
    expect(h[1].dataset.type).toBe("Generic<unsigned short int>");
  });

  it("expands inline references and they get classified as normative/informative correctly", async () => {
    const config = {
      localBiblio: {
        "payment-request": {
          title: "Payment Request API",
          href: "https://www.w3.org/TR/payment-request/",
        },
        dom: { title: "DOM Standard", href: "https://dom.spec.whatwg.org/" },
        fetch: {
          title: "Fetch Standard",
          href: "https://fetch.spec.whatwg.org/",
        },
        html: {
          title: "HTML Standard",
          href: "https://html.spec.whatwg.org/multipage/",
        },
      },
    };
    const body = `
      <section id="test">
      <section id="conformance">[[[html]]]</section>
      <section class="informative">
          <p>[[[dom]]]</a></p>
      </section>
      <p>[[[fetch]]] and [[[?payment-request]]]</p>
      </section>
    `;
    const doc = await makeRSDoc(makeStandardOps(config, body));
    const refs = doc.querySelectorAll("#test a[href]:not(.self-link)");
    expect(refs[0].textContent).toBe("HTML Standard");
    expect(refs[1].textContent).toBe("DOM Standard");
    expect(refs[2].textContent).toBe("Fetch Standard");
    expect(refs[3].textContent).toBe("Payment Request API");
    const norm = [...doc.querySelectorAll("#normative-references dt")];
    expect(norm.length).toBe(2);
    expect(norm.map(el => el.textContent)).toEqual(["[fetch]", "[html]"]);

    const inform = [...doc.querySelectorAll("#informative-references dt")];
    expect(inform.length).toBe(2);
    expect(inform.map(el => el.textContent)).toEqual([
      "[dom]",
      "[payment-request]",
    ]);
  });

  fit("allows [[[#...]]] to be a general expander for ids in document", async () => {
    const body = `
      <section id="section">
        <h2>section heading</h2>
        <figure id="figure">
          <figcaption>figure caption</figcaption>
        </figure>
        <aside class="example" id="example-aside_thing" title="aside"></aside>
        <pre class="example" id="example-pre" title="pre">
        </pre>
      </section>
      <p id="output">
        [[[#section]]]
        [[[#figure]]]
        [[[#example-aside_thing]]]
        [[[#example-pre]]]
        [[[#does-not-exist]]]
      </p>`;
    const doc = await makeRSDoc(makeStandardOps(null, body));
    const anchors = doc.querySelectorAll("#output a");
    debugger
    expect(anchors.length).toBe(4);
    const [section, figure, exampleAside, examplePre] = anchors;
    expect(section.textContent).toBe("§ 1. section heading");
    expect(figure.textContent).toBe("Figure 1");
    expect(exampleAside.textContent).toBe("Example 1: aside");
    expect(examplePre.textContent).toBe("Example 2: pre");

    const badOne = doc.querySelector("#output span.respec-offending-element");
    expect(badOne.textContent).toBe("[[[#does-not-exist]]]");
  });

  it("proceseses backticks inside [= =] inline links", async () => {
    const body = `
      <section>
        <p>
          <dfn><code>link</code> element</dfn>
          <dfn>some \`Coded\` thing</dfn>
        </p>
        <p id="inlines">
          [= \`link\` element =] and [= some \`Coded\` thing =]
        </p>
      </section>
    `;
    const doc = await makeRSDoc(makeStandardOps(null, body));
    const [linkElement, someCodedThing] = doc.querySelectorAll("#inlines a");

    expect(linkElement.getAttribute("href")).toBe("#dfn-link-element");
    const linkCodeElem = linkElement.querySelector("code");
    expect(linkCodeElem.textContent).toBe("link");

    expect(someCodedThing.getAttribute("href")).toBe("#dfn-some-coded-thing");
    const codedThingCodeElem = someCodedThing.querySelector("code");
    expect(codedThingCodeElem.textContent).toBe("Coded");
  });

  it("proceseses `backticks` as code", async () => {
    const body = `
      <section>
        <p id="simple">Return \`null\`.</p>
        <p id="multi">Return \`123\` or \`undefined\` or \`this
          particular string\`.
        </p>
        <p id="no-match">Return \`\`\`don't match this code blocks\`\`\`</p>
      </section>
    `;
    const doc = await makeRSDoc(makeStandardOps(null, body));

    // simple case
    const simple = doc.querySelector("#simple code");
    expect(simple).toBeTruthy();
    expect(simple.textContent).toBe("null");

    // multi per line
    const multi = doc.querySelectorAll("#multi code");
    expect(multi.length).toBe(3);
    expect(multi[0].textContent).toBe("123");
    expect(multi[1].textContent).toBe("undefined");
    expect(multi[2].textContent.endsWith("string")).toBeTruthy();

    // no-match
    expect(doc.querySelector("#no-match code")).toBeNull();
  });

  it("processes [= BikeShed style inline links =]", async () => {
    const body = `
      <section data-cite="INFRA">
        <p id="definitions">
          <dfn data-lt="definition alias">link to definition</dfn>
        </p>
        <p id="simple-links">
          [= link
          to
          definition =]

          <!-- plural case -->
          [= link
          to
          definitions =]

          [= definition alias =]
        </p>

        <p id="qualified" data-cite="DOM">
          [= AbortSignal/add =]
        </p>

        <p id="overmatch">
          [=set / For each=] [= map / For each =]
        </p>

        <p id="multiline">
          [=   map /
          For each=]
          [=
            list/
          For each
          =]
        </p>
      </section>
    `;
    const config = { xref: { url: xrefTestUrl("inline-links") } };
    const doc = await makeRSDoc(makeStandardOps(config, body));
    const dfnId = doc.querySelector("#definitions dfn").id;
    const anchors = doc.querySelectorAll("#simple-links a");
    const expectedAnchor = `#${dfnId}`;
    expect(anchors.length).toBe(3);
    for (const a of anchors) {
      expect(a.getAttribute("href")).toBe(expectedAnchor);
      expect(a.dataset.linkFor).toBe("");
    }

    // Qualified (link is "for" something)
    const qualifiedAnchor = doc.querySelector("#qualified a");
    expect(qualifiedAnchor.href).toBe(
      "https://dom.spec.whatwg.org/#abortsignal-add"
    );
    expect(qualifiedAnchor.dataset.linkFor).toBe("AbortSignal");

    // overmatch protection - two per line.
    const [setForEach, mapForEach] = doc.querySelectorAll("#overmatch a");
    expect(setForEach.href).toBe("https://infra.spec.whatwg.org/#list-iterate");
    expect(mapForEach.href).toBe("https://infra.spec.whatwg.org/#map-iterate");

    // qualified multiline
    const [multiListForEach, multiMapForEach] = doc.querySelectorAll(
      "#overmatch a"
    );
    expect(multiListForEach.href).toBe(
      "https://infra.spec.whatwg.org/#list-iterate"
    );
    expect(multiMapForEach.href).toBe(
      "https://infra.spec.whatwg.org/#map-iterate"
    );
  });
});
