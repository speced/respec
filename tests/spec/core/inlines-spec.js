"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

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
    expect(norm.map(el => el.textContent)).toEqual([
      "[dom]",
      "[html]",
      "[RFC2119]", // added by conformance section
      "[RFC8174]", // added by conformance section
      "[svg]",
    ]);

    const inform = [...doc.querySelectorAll("#informative-references dt")];
    expect(inform).toHaveSize(2);
    expect(inform.map(el => el.textContent)).toEqual(["[infra]", "[webidl]"]);

    const links = [...doc.querySelectorAll("section cite a")];
    expect(links).toHaveSize(8);
    expect(links[0].textContent).toBe("RFC2119");
    expect(links[0].getAttribute("href")).toBe("#bib-rfc2119");
    expect(links[0].dataset.linkType).toBe("biblio");
    expect(links[1].textContent).toBe("RFC8174");
    expect(links[1].getAttribute("href")).toBe("#bib-rfc8174");
    expect(links[2].textContent).toBe("dom");
    expect(links[2].getAttribute("href")).toBe("#bib-dom");
    expect(links[6].textContent).toBe("svg");
    expect(links[6].getAttribute("href")).toBe("#bib-svg");

    const illegalCite = doc.querySelector("#illegal cite");
    expect(illegalCite.classList.contains("respec-offending-element")).toBe(
      true
    );

    const illegalCiteNoWarn = doc.querySelector("#illegal-no-warn cite");
    expect(illegalCiteNoWarn.classList).not.toContain(
      "respec-offending-element"
    );
  });

  it("processes inline cite content with aliasing", async () => {
    const body = `
      <section id="test" class="normative">
        <p>[[html|not JSX]]</p>
      </section>
    `;
    const ops = makeStandardOps({}, body);
    const doc = await makeRSDoc(ops);

    const norm = [...doc.querySelectorAll("#normative-references dt")];
    expect(norm.map(el => el.textContent)).toEqual(["[html]"]);

    const ref = doc.querySelector("#test p");
    const link = doc.querySelector("#test cite a");
    expect(ref.textContent).toBe("not JSX");
    expect(ref.textContent).toBe(link.textContent);
    expect(link.getAttribute("href")).toBe("#bib-html");
    expect(link.dataset.linkType).toBe("biblio");
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
    expect(abbr).toHaveSize(2);
    expect([...abbr].every(({ textContent: t }) => t === "ABBR")).toBeTruthy();

    const rfc2119 = [...inl.querySelectorAll("em.rfc2119")];
    expect(rfc2119).toHaveSize(2);
    expect(rfc2119[0].textContent).toBe("MUST");
    expect(rfc2119[1].textContent).toBe("NOT RECOMMENDED");
  });

  it("excludes generating abbr elements when .exclude class is present", async () => {
    const body = `
      <section>
        <h2>
          <abbr title="excluded" class="exclude">
            EXCLUDE
          </abbr>
          <abbr title="  included  abbr  ">
            INCLUDE
          </abbr>
        </h2>
        <p id="test">
          EXCLUDE INCLUDE
        </p>
      </section>
    `;
    const ops = makeStandardOps({}, body);
    const doc = await makeRSDoc(ops);
    const abbrs = doc.querySelectorAll("#test abbr");
    expect(abbrs).toHaveSize(1);

    const abbr = abbrs.item(0);
    expect(abbr.title).toBe("included abbr");
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
      <section>
        <p id="nulls"> |var 1: null type spaces?| and |var 2 : NullableType?| </p>
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

    const [nullVar1, nullVar2] = doc.querySelectorAll("#nulls > var");
    expect(nullVar1.textContent).toBe("var 1");
    expect(nullVar1.dataset.type).toBe("null type spaces?");
    expect(nullVar2.textContent).toBe("var 2");
    expect(nullVar2.dataset.type).toBe("NullableType?");
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
    expect(norm).toHaveSize(2);
    expect(norm.map(el => el.textContent)).toEqual(["[fetch]", "[html]"]);

    const inform = [...doc.querySelectorAll("#informative-references dt")];
    expect(inform).toHaveSize(2);
    expect(inform.map(el => el.textContent)).toEqual([
      "[dom]",
      "[payment-request]",
    ]);
  });

  it("allows [[[#...]]] to be a general expander for ids in document", async () => {
    /** @param {string} text */
    function generateDataIncludeUrl(text) {
      return `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`;
    }
    const body = `
      <section id="section">
        <h2>section heading</h2>
        <figure id="figure">
          <figcaption>figure caption</figcaption>
        </figure>
        <aside class="example" id="example-aside_thing" title="aside"></aside>
        <pre class="example" id="example-pre" title="pre">
        </pre>
        <section data-include="${generateDataIncludeUrl(
          `## Example Dynamic\nA dynamically generated heading`
        )}" data-include-format="markdown"></section>
      </section>
      <p id="output">
        [[[#section]]]
        [[[#figure]]]
        [[[#example-aside_thing]]]
        [[[#example-pre]]]
        [[[#example-dynamic]]]
        [[[#does-not-exist]]]
      </p>`;
    const doc = await makeRSDoc(makeStandardOps(null, body));
    const anchors = doc.querySelectorAll("#output a");
    expect(anchors).toHaveSize(6);
    const [section, figure, exampleAside, examplePre, exampleDynamic] = anchors;
    expect(section.textContent).toBe("§\u00A01. section heading");
    expect(section.classList).toContain("sec-ref");
    expect(figure.textContent).toBe("Figure 1");
    expect(figure.classList).toContain("fig-ref");
    expect(exampleAside.textContent).toBe("Example 1");
    expect(exampleAside.classList).toContain("box-ref");
    expect(examplePre.textContent).toBe("Example 2");
    expect(examplePre.classList).toContain("box-ref");
    expect(exampleDynamic.textContent).toContain("Example Dynamic");
    expect(exampleDynamic.classList).toContain("sec-ref");

    const badOne = doc.querySelector("#output a.respec-offending-element");
    expect(badOne.textContent).toBe("#does-not-exist");
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
        <p id="multiline">
        [=environment
            settings
          object /
          responsible
          document =]
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

    const responsibleDocLink = doc.querySelector("#multiline a");
    expect(responsibleDocLink.hash).toBe("#responsible-document");
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
    expect(multi).toHaveSize(3);
    expect(multi[0].textContent).toBe("123");
    expect(multi[1].textContent).toBe("undefined");
    expect(multi[2].textContent.endsWith("string")).toBeTruthy();

    // no-match
    expect(doc.querySelector("#no-match code")).toBeNull();
  });

  it('processes inline {{"Exceptions"}}', async () => {
    const body = `
      <section>
        <p id="test"> {{
          "SyntaxError"
        }}</p>
      </section>
    `;
    const doc = await makeRSDoc(makeStandardOps(null, body));
    const syntaxErrorAnchor = doc.querySelector("#test a");
    expect(syntaxErrorAnchor.href).toBe(
      "https://webidl.spec.whatwg.org/#syntaxerror"
    );
  });

  it("processes inline [^element^] and hierarchies.", async () => {
    const body = `
      <section>
        <p id="test">[^body^]</p>
        <p id="test2">[^iframe/allow^]</p>
        <p id="test3">[^ html-global/inputmode/text ^]</p>
        <p id="test4">[^ /role ^]</p>
      </section>
    `;
    const doc = await makeRSDoc(makeStandardOps({ xref: ["HTML"] }, body));
    const bodyAnchor = doc.querySelector("#test a");
    expect(bodyAnchor.hash).toBe("#the-body-element");
    const iframeAllowAnchor = doc.querySelector("#test2 a");
    expect(iframeAllowAnchor.textContent).toBe("allow");
    expect(iframeAllowAnchor.hash).toBe("#attr-iframe-allow");
    const inputModeAnchor = doc.querySelector("#test3 a");
    expect(inputModeAnchor.textContent).toBe("text");
    expect(inputModeAnchor.hash).toBe("#attr-inputmode-keyword-text");
    const roleAttribute = doc.querySelector("#test4 a");
    expect(roleAttribute.textContent).toBe("role");
    expect(roleAttribute.hash).toBe("#attr-aria-role");
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

        <p id="alias">
          [= code point| Unicode code point =]
          [= iteration/break|break out of iteration =]
        </p>
        <p id="deep-for" data-cite="streams">
        [= ReadableStream / set
          up / pullAlgorithm=]
        </p>
      </section>
    `;
    const config = { xref: true };
    const doc = await makeRSDoc(makeStandardOps(config, body));
    const dfnId = doc.querySelector("#definitions dfn").id;
    const anchors = doc.querySelectorAll("#simple-links a");
    const expectedAnchor = `#${dfnId}`;
    expect(anchors).toHaveSize(3);
    for (const a of anchors) {
      expect(a.getAttribute("href")).toBe(expectedAnchor);
      expect(a.dataset.linkFor).toBeUndefined();
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
    const [multiListForEach, multiMapForEach] =
      doc.querySelectorAll("#overmatch a");
    expect(multiListForEach.href).toBe(
      "https://infra.spec.whatwg.org/#list-iterate"
    );
    expect(multiMapForEach.href).toBe(
      "https://infra.spec.whatwg.org/#map-iterate"
    );

    // term aliasing
    const [codePoint, iterationBreak] = doc.querySelectorAll("#alias a");
    expect(codePoint.textContent).toBe("Unicode code point");
    expect(codePoint.hash).toBe("#code-point");
    expect(iterationBreak.textContent).toBe("break out of iteration");
    expect(iterationBreak.hash).toBe("#iteration-break");

    // Deep for= parts
    const pullAlgorithm = doc.querySelector("#deep-for a");
    expect(pullAlgorithm.hash).toBe("#readablestream-set-up-pullalgorithm");
  });

  it("allows escaping `/` in [= concept =] links", async () => {
    const body = `<section id="test">
      <dfn>foo/bar</dfn> [= foo\\/bar =]
      [=multipart\\/form-data encoding algorithm=]
    </section>`;
    const ops = makeStandardOps({ xref: ["HTML"] }, body);
    const doc = await makeRSDoc(ops);

    const [localLink, conceptLink] = doc.querySelectorAll("#test a");
    expect(localLink.hash).toBe("#dfn-foo-bar");
    expect(conceptLink.hash).toBe("#multipart/form-data-encoding-algorithm");
  });

  it("processes {{ forContext/term }} IDL", async () => {
    const body = `
      <section>
        <p id="link1">{{ Window.event }}</p>
        <p id="link2">{{ Window/event }}</p>
        <p id="link3">{{ EventTarget/addEventListener(type, callback) }}</p>
        <p id="link4">{{
          Window
          /
          event
        }}</p>
        <p id="link5">{{ ReferrerPolicy/"no-referrer" }}</p>
      </section>
    `;
    const config = { xref: ["DOM", "HTML", "referrer-policy"] };
    const doc = await makeRSDoc(makeStandardOps(config, body));

    expect(doc.getElementById("link1").textContent).toBe("Window.event");
    const [linkWindow, linkWindowEvent] = doc.querySelectorAll("#link1 a");
    expect(linkWindow.hash).toBe("#window");
    expect(linkWindowEvent.hash).toBe("#dom-window-event");

    expect(doc.getElementById("link2").textContent).toBe("event");
    expect(doc.querySelector("#link2 a").hash).toBe("#dom-window-event");

    expect(doc.getElementById("link3").textContent).toBe(
      "addEventListener(type, callback)"
    );
    expect(doc.querySelector("#link3 a").hash).toBe(
      "#dom-eventtarget-addeventlistener"
    );

    expect(doc.getElementById("link4").textContent).toBe("event");
    expect(doc.querySelector("#link4 a").hash).toBe("#dom-window-event");

    expect(doc.querySelector("#link5 a").textContent).toBe("no-referrer");
    expect(doc.querySelector("#link5 a").hash).toBe(
      "#dom-referrerpolicy-no-referrer"
    );
  });

  it("supports {{ Nullable? }} types and primitives", async () => {
    const body = `
      <section>
        <pre class="idl">
        [Exposed=Window]
        interface InterFace{};
        dictionary Dict{};
        </pre>
        <p id="interface">{{ InterFace? }}</p>
        <p id="dictionary">{{ Dict? }}</p>
        <p id="primitive">{{ unsigned short? }}</p>
      </section>
    `;
    const config = { xref: ["WebIDL"] };
    const doc = await makeRSDoc(makeStandardOps(config, body));

    const [interfaceDfn, dictDfn] = doc.querySelectorAll(".idl dfn");

    // {{ Interface? }}
    const interfaceAnchor = doc.querySelector("#interface a");
    expect(interfaceAnchor.textContent).toBe("InterFace?");
    expect(interfaceAnchor.hash.endsWith(interfaceDfn.id)).toBeTrue();

    const interfaceData = interfaceAnchor.dataset;
    expect(interfaceData.xrefType).toBe("_IDL_");
    expect(interfaceData.linkType).toBe("idl");
    expect(interfaceData.lt).toBe("InterFace");

    // {{ Dict? }}
    const dictAnchor = doc.querySelector("#dictionary a");
    expect(dictAnchor.textContent).toBe("Dict?");
    expect(dictAnchor.hash.endsWith(dictDfn.id)).toBeTrue();

    const dictData = dictAnchor.dataset;
    expect(dictData.xrefType).toBe("_IDL_");
    expect(dictData.linkType).toBe("idl");
    expect(dictData.lt).toBe("Dict");

    // {{ unsigned short? }}
    const primitiveAnchor = doc.querySelector("#primitive a");
    expect(primitiveAnchor.textContent).toBe("unsigned short?");
    expect(primitiveAnchor.hash).toBe("#idl-unsigned-short");

    const primitiveData = primitiveAnchor.dataset;
    expect(primitiveData.linkType).toBe("idl");
    expect(primitiveData.cite).toBe("webidl");
    expect(primitiveData.xrefType).toBe("interface");
    expect(primitiveData.lt).toBe("unsigned short");
  });

  it("doesn't link processed inline WebIDL if inside a definition", async () => {
    const body = `
      <section>
        <dfn id="dfn">
          ABC
          {{ EventTarget/addEventListener(type, callback) }}
          {{ Window / event }}
          {{ ReferrerPolicy/"no-referrer" }}
          123
        </dfn>
      </section>
    `;
    const doc = await makeRSDoc(makeStandardOps(null, body));
    const dfn = doc.getElementById("dfn");
    expect(dfn.querySelector("a")).toBeNull();

    const codeElements = dfn.querySelectorAll("code");
    expect(codeElements).toHaveSize(3);

    const [eventListen, event, noRef] = codeElements;
    expect(eventListen.textContent).toBe("addEventListener(type, callback)");
    expect(event.textContent).toBe("event");
    expect(noRef.textContent).toBe(`"no-referrer"`);
  });
});
