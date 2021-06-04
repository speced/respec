"use strict";
import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";

describe("Core — dfn-index", () => {
  afterAll(flushIframes);

  it("adds default heading to section#index", async () => {
    const body = `<section id="index">
      <p id="pass">PASS</p>
    </section>`;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const index = doc.getElementById("index");

    expect(index.classList).toContain("appendix");

    expect(index.querySelectorAll("h2")).toHaveSize(1);
    expect(index.querySelector("h2").textContent).toBe("A. Index");
    expect(index.firstElementChild).toBe(index.querySelector("h2"));
    expect(index.querySelector("h2").nextElementSibling).toEqual(
      doc.getElementById("pass")
    );
  });

  it("doesn't override existing content in section#index", async () => {
    const body = `<section id="index">
      <h2 id="custom-heading">el índex</h2>
      <p id="custom-paragraph">PASS</p>
    </section>`;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const index = doc.getElementById("index");

    expect(index.querySelectorAll("h2")).toHaveSize(1);
    expect(index.querySelector("h2").textContent).toBe("A. el índex");
    expect(index.firstElementChild).toBe(
      index.querySelector("h2#custom-heading")
    );
    expect(index.querySelector("p#custom-paragraph").textContent).toBe("PASS");

    const subsections = index.querySelectorAll("section");
    expect(subsections).toHaveSize(2);
    const [localIndex, externalIndex] = subsections;

    const localIndexHeading = localIndex.querySelector("h3");
    expect(localIndexHeading.textContent).toContain(
      "Terms defined by this specification"
    );
    expect(localIndexHeading.nextElementSibling.matches("ul.index")).toBeTrue();

    const externalIndexHeading = externalIndex.querySelector("h3");
    expect(externalIndexHeading.textContent).toContain(
      "Terms defined by reference"
    );
    expect(
      externalIndexHeading.nextElementSibling.matches("ul.index")
    ).toBeTrue();
  });

  describe("Local Terms Index", () => {
    const body = `<section id="content">
        <h2>Whatever</h2>
        <p class="test">
          <dfn data-cite="HTML/webappapis.html#eventhandler">EventHandler</dfn>
        </p>
        <p class="test"><dfn>hello</dfn> <dfn>bar</dfn></p>
        <div class="test" data-dfn-for="Foo">
          <pre class="idl" data-cite="WEBIDL">
            [Exposed=Window]
            interface Foo {
              constructor();
              attribute DOMString bar;
              undefined doTheFoo();
            };
          </pre>
          <p><dfn>[[\\haha]]</dfn> is an internal slot.</p>
          <p>The <dfn>constructor()</dfn> creates a Foo instance.</p>
          <p>The <dfn>bar</dfn> attribute, returns 🍺.</p>
          <p>The <dfn>doTheFoo()</dfn> method, returns nothing.</p>
        </div>
      </section>
      <section id="index"></section>`;

    /** @type {HTMLElement} */
    let index;
    beforeAll(async () => {
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      index = doc.getElementById("index-defined-here");
      index.querySelectorAll(".print-only").forEach(el => el.remove());
    });

    it("doesn't list external terms", () => {
      const terms = index.querySelectorAll("li");
      const externalTerms = [...terms]
        .map(term => term.textContent.trim())
        .filter(term => term.match(/EventHandler|DOMString|Window|Exposed/));
      expect(externalTerms).toEqual([]);
    });

    it("lists terms in sorted order", () => {
      const terms = [...index.querySelectorAll("ul.index > li")].map(
        term => term.textContent.trim().split(/\s/)[0]
      );
      expect(terms).toEqual([
        "bar",
        "constructor()",
        "doTheFoo()",
        "Foo",
        "[[haha]]",
        "hello",
      ]);
    });

    it("links unique terms directly", () => {
      const item = index.querySelector("ul.index > li:nth-child(2)");
      expect(item.textContent.trim()).toEqual("constructor() for Foo");
      expect(item.querySelector("li")).toBeNull();
      const anchor = item.querySelector(":scope > a");
      expect(anchor.hash).toBe("#dom-foo-constructor");
    });

    it("links non-unique terms by their types", () => {
      const item = index.querySelector("ul.index > li:nth-child(1)");
      const subItems = item.querySelectorAll("li");
      expect(subItems).toHaveSize(2);
      const [defnOf, attrOfFoo] = subItems;
      expect(defnOf.textContent.trim()).toBe("definition of");
      expect(defnOf.querySelector("a").hash).toBe("#dfn-bar");
      expect(attrOfFoo.textContent.trim()).toBe("attribute for Foo");
      expect(attrOfFoo.querySelector("a").hash).toBe("#dom-foo-bar");
    });

    it("adds type info and context", () => {
      const [, ctor, method, iface, slot, concept] = [
        ...index.querySelectorAll("ul.index > li"),
      ].map(el => el.textContent.trim());
      expect(ctor).toBe("constructor() for Foo");
      expect(method).toBe("doTheFoo() method for Foo");
      expect(iface).toBe("Foo interface");
      expect(slot).toBe("[[haha]] internal slot for Foo");
      expect(concept).toBe("hello");
    });

    it("contains section number for print media", async () => {
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const index = doc.getElementById("index-defined-here");

      const item = index.querySelector("ul.index > li:nth-child(2)");
      const secNum = item.querySelector(".print-only");
      expect(secNum.textContent).toBe("§1.");
      expect(item.textContent.endsWith("§1.")).toBeTrue();
    });
  });

  describe("External Terms Index", () => {
    const body = ` <section id="content">
        <h2>Whatever</h2>
        <p class="test"><dfn id="local-concept">hello</dfn> [= hello =]</p>
        <div class="test" data-dfn-for="Employee" data-link-for="Employee">
          <pre class="idl">
            [Exposed=Window]
            interface Employee {
              [Default] object toJSON();

              readonly attribute DOMString name;
              attribute EventHandler onpay;

              [NewObject]
              Promise&lt;boolean&gt; pay(EventInit init);
            };
          </pre>
          <dfn id="local-idl-1">name</dfn>
          <dfn id="local-idl-2">onpay</dfn>
        </div>
        <p class="test" data-link-for="Employee">
          {{ name }} {{ onpay }}
        </p>
        <ul class="test">
          <li>[= creating an event =]</li>
          <li>[= ASCII uppercase =]</li>
          <li>{{ Event }}</li>
          <li>[^ iframe ^]</li>
        </ul>
        <ul class="test">
          <li>[= Document/fully active =]</li>
          <li>[= environment settings object/responsible document =]</li>
          <li>{{ Event/type }}</li>
          <li>[^ iframe/allow ^]</li>
        </ul>
        <ul class="test">
          <li>{{ boolean }}</li>
          <li>{{ AbortError }}</li>
        </ul>
        <ul class="test">
          <li><a data-cite="rfc6454#section-3.2">origin</a></li>
          <li>
            <dfn data-cite="ECMASCRIPT/#sec-json.stringify">JSON.stringify</dfn>
          </li>
          <li><a>JSON.stringify</a></li>
        </ul>
        <ul class="test" data-testid="possible-duplicate-id">
        <li><a data-cite="ECMASCRIPT#sec-json.parse">parsing</a></li>
        <li><a data-cite="ECMASCRIPT#sec-15.12.2">parsing</a></li>
        </ul>
      </section>
      <section id="index"></section>`;

    /** @type {HTMLElement} */
    let index;
    beforeAll(async () => {
      const ops = makeStandardOps({ xref: "web-platform" }, body);
      const doc = await makeRSDoc(ops);
      index = doc.getElementById("index-defined-elsewhere");
    });

    it("lists only external terms", () => {
      const getTermAndType = el => el.textContent.trim().split(/\s\(/)[0];
      const terms = [...index.querySelectorAll(".index-term")].map(
        getTermAndType
      );
      expect(terms).toEqual([
        "creating an event",
        "Event interface",
        "EventInit",
        "type attribute",
        "JSON.stringify",
        "parsing",
        "parsing",
        "allow attribute",
        "EventHandler",
        "fully active",
        "iframe element",
        "responsible document",
        "Window interface",
        "ASCII uppercase",
        "origin",
        "AbortError exception",
        "boolean type",
        "[Default] extended attribute",
        "default toJSON steps",
        "DOMString interface",
        "[Exposed] extended attribute",
        "[NewObject] extended attribute",
        "object type",
        "Promise interface",
      ]);
    });

    it("lists terms grouped by specs", () => {
      const bySpecs = index.querySelectorAll("ul.index > li");
      expect(bySpecs).toHaveSize(6);
      expect(bySpecs[0].textContent.trim()).toMatch(
        /\[DOM\] defines the following:/
      );

      const specNames = [...bySpecs].map(
        el => el.querySelector("a.bibref").textContent
      );
      expect(specNames).toEqual([
        "DOM",
        "ECMASCRIPT",
        "HTML",
        "INFRA",
        "RFC6454",
        "WEBIDL",
      ]);

      const termsInDom = [...bySpecs[0].querySelectorAll("li")];
      expect(termsInDom).toHaveSize(4);
    });

    it("lists terms in a spec in sorted order", () => {
      const termsInDom = index.querySelectorAll("[data-spec='DOM'] li");
      expect(termsInDom).toHaveSize(4);
      const terms = [...termsInDom].map(el => el.textContent.trim());
      expect(terms[0]).toMatch(/^creating an event/);
      expect(terms[1]).toMatch(/^Event/);
      expect(terms[2]).toMatch(/^EventInit/);
      expect(terms[3]).toMatch(/^type/);
    });

    it("highlights IDL terms", () => {
      const termsInDom = index.querySelectorAll("[data-spec='DOM'] li span");
      expect(termsInDom[0].textContent).toBe("creating an event");
      expect(termsInDom[0].querySelector("code")).toBeFalsy();

      expect(termsInDom[1].textContent).toMatch(/^Event/);
      expect(termsInDom[1].querySelector("code").textContent).toBe("Event");
    });

    it("suffixes terms with type information", () => {
      const [
        iframeAllowAttribute,
        eventHandlerDict,
        fullyActive,
        iframeElement,
      ] = [...index.querySelectorAll("li[data-spec='HTML'] .index-term")].map(
        el => el.textContent
      );
      expect(iframeAllowAttribute).toMatch(/^allow attribute \(for/);
      expect(eventHandlerDict).toBe("EventHandler");
      expect(fullyActive).toMatch(/^fully active \(for/);
      expect(iframeElement).toBe("iframe element");

      const [abortErrorException, booleanType] = [
        ...index.querySelectorAll("li[data-spec='WEBIDL'] .index-term"),
      ].map(el => el.textContent);
      expect(abortErrorException).toBe("AbortError exception");
      expect(booleanType).toBe("boolean type");
    });

    it("formats IDL extended attributes", () => {
      const extendAttrDefault = index.querySelector(
        "[data-spec='WEBIDL'] li:nth-child(3) .index-term"
      );
      expect(extendAttrDefault.textContent).toBe(
        "[Default] extended attribute"
      );
    });

    it("suffixes term with a 'for' context", async () => {
      const termsInHTML = index.querySelectorAll("[data-spec='HTML'] li");

      const iframeAllowAttribute = termsInHTML[0];
      expect(iframeAllowAttribute.textContent.trim()).toMatch(/^allow/);
      expect(iframeAllowAttribute.textContent.trim()).toMatch(
        /\(for iframe element\)$/
      );
      expect(iframeAllowAttribute.querySelectorAll("code")).toHaveSize(2);
      const [allow, iframe] = iframeAllowAttribute.querySelectorAll("code");
      expect(allow.textContent).toBe("allow");
      expect(iframe.textContent).toBe("iframe");

      const fullyActive = termsInHTML[2];
      expect(fullyActive.textContent.trim()).toMatch(/^fully active/);
      expect(fullyActive.textContent.trim()).toMatch(/\(for Document\)$/);
      expect(fullyActive.querySelectorAll("code")).toHaveSize(1);
      expect(fullyActive.querySelector("code").textContent).toBe("Document");

      const responsibleDocument = termsInHTML[4];
      expect(responsibleDocument.textContent.trim()).toMatch(
        /^responsible document/
      );
      expect(responsibleDocument.textContent.trim()).toMatch(
        /\(for environment settings object\)$/
      );
      expect(responsibleDocument.querySelectorAll("code")).toHaveSize(0);
    });

    it("opens dfnPanel on term click", async () => {
      const body = `<section data-cite="DOM">
          <h2>TEST</h2>
          <p>{{ Event }} {{ Event/type }}</p>
        </section>
        <section id="index"></section>`;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const index = doc.getElementById("index-defined-elsewhere");

      expect(index.querySelectorAll(".index-term")).toHaveSize(2);
      const term = index.querySelector(".index-term");

      expect(term.tabIndex).toBe(0);
      expect(term.getAttribute("aria-haspopup")).toBe("dialog");

      expect(term.textContent).toBe("Event interface");
      expect(term.id).toBe("index-term-event-interface");

      const panel = doc.getElementById(`dfn-panel-for-${term.id}`);
      expect(panel.hidden).toBeTrue();
      term.click();
      expect(panel.hidden).toBeFalse();
      expect(panel.querySelector("a.self-link").href).toBe(
        "https://dom.spec.whatwg.org/#event"
      );
      expect(panel.querySelectorAll("ul li")).toHaveSize(1);
      const reference = panel.querySelector("ul li a");
      expect(reference.textContent).toBe("§ 1. TEST");
      expect(reference.hash).toBe("#ref-for-index-term-event-interface-1");
    });

    it("associates different id to each term", async () => {
      const termsInEcma = index.querySelectorAll(
        "[data-spec='ECMASCRIPT'] li span"
      );
      expect(termsInEcma).toHaveSize(3);
      const [, parsing1, parsing2] = termsInEcma;
      expect(parsing1.id).toBe("index-term-parsing");
      expect(parsing2.id).toBe("index-term-parsing-0");
    });
  });
});
