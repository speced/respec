"use strict";

import { flushIframes, makeRSDoc, makeStandardOps } from "../SpecHelper.js";
import { clearXrefData } from "../../../src/core/xref-db.js";

describe("Core - WebIDL", () => {
  afterAll(flushIframes);
  /** @type {Document} */
  let doc;
  beforeAll(async () => {
    const ops = makeStandardOps({ xref: true });
    doc = await makeRSDoc(ops, "tests/spec/core/webidl.html");
  });

  beforeEach(async () => {
    // clear idb cache before each
    await clearXrefData();
  });

  describe("IDL block", () => {
    it("wraps inner IDL in a code element", async () => {
      const body = `
        <pre class="idl">
          dictionary Foo {};
        </pre>
        <pre class="webidl">
          dictionary Bar {};
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const [code1, code2] = doc.querySelectorAll("pre > code");
      expect(code1).toBeTruthy();
      expect(code1.textContent).toContain("dictionary Foo {};");
      expect(code2).toBeTruthy();
      expect(code2.textContent).toContain("dictionary Bar {};");
    });

    it("it uniquely identifies each IDL block", async () => {
      const body = `
        <pre class="idl">
          dictionary Foo {};
        </pre>
        <pre class="webidl">
          dictionary Bar {};
        </pre>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const [idl1, idl2] = doc.querySelectorAll("pre");
      expect(idl1.id).toBeTruthy();
      expect(idl2.id).toBeTruthy();
      expect(idl1.id).not.toBe(idl2.id);
    });
    describe("idl header", () => {
      it("includes a self-link to an IDL block", async () => {
        const body = `
          <pre class="idl">
            dictionary Foo {};
          </pre>`;
        const ops = makeStandardOps(null, body);
        const doc = await makeRSDoc(ops);
        const idl = doc.querySelector("pre");
        const idlHeader = idl.querySelector("pre span.idlHeader");
        expect(idlHeader).toBeTruthy();
        const anchor = idlHeader.querySelector("a");
        expect(anchor.getAttribute("href")).toBe(`#${idl.id}`);
      });
    });
  });

  describe("records", () => {
    it("handles record types", async () => {
      const body = `
        <section id="records">
          <h2>Testing records</h2>
          <pre class="idl">
            dictionary Foo {
              record&lt;DOMString, USVString> pass;
            };
          </pre>
        </section>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const idl = doc.querySelector("#records pre");
      expect(idl).toBeTruthy(idl);
      expect(idl.querySelector(".idlType:first-child").textContent).toBe(
        "\n  record<DOMString, USVString>"
      );
      expect(idl.querySelector(".idlMember .idlName").textContent).toBe("pass");
    });
  });

  describe("linking", () => {
    it("links standardized IDL types to WebIDL spec", async () => {
      const body = `
        <section id="linkToIDLSpec">
          <h2>Linking to WebIDL spec</h2>
          <pre class="idl">
          [SecureContext, Exposed=Window]
          interface LinkingTest {
            constructor(sequence&lt;DOMString> methodData);
            readonly attribute DOMString? aBoolAttribute;
            Promise&lt;undefined> returnsPromise(unsigned long long argument);
          };
          </pre>
          <p data-dfn=for="LinkingTest">
            <dfn>aBoolAttribute</dfn>
            <dfn>returnsPromise</dfn>
          </p>
        </section>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const idl = doc.querySelector("#linkToIDLSpec pre");

      // sequence
      const sequences = idl.querySelectorAll(`a[href$="#idl-sequence"]`);
      expect(sequences).toHaveSize(1);
      const sequence = sequences[0];

      // sequence<DOMString>
      expect(sequence.nextElementSibling.localName).toBe("a");
      expect(sequence.nextElementSibling.hash).toBe("#idl-DOMString");

      // readonly attribute DOMString? aBoolAttribute;
      const domString = idl.querySelector(".idlAttribute a");
      expect(domString.textContent).toBe("DOMString");
      expect(new URL(domString.getAttribute("href")).hash).toBe(
        "#idl-DOMString"
      );

      // Promise&lt;undefined> returnsPromise(unsigned long long argument);
      const [promiseLink, undefinedLink, unsignedLongLink] =
        idl.querySelectorAll("*[data-title='returnsPromise'] a");
      // Promise
      expect(promiseLink.textContent).toBe("Promise");
      expect(promiseLink.href.endsWith("#idl-promise")).toBe(true);

      // undefined type of promise
      expect(undefinedLink.textContent).toBe("undefined");
      expect(undefinedLink.href.endsWith("#idl-undefined")).toBe(true);

      // unsigned long long argument
      expect(unsignedLongLink.textContent).toBe("unsigned long long");
      expect(unsignedLongLink.href.endsWith("#idl-unsigned-long-long")).toBe(
        true
      );
    });
  });

  it("distinguishes between types and identifiers when linking", async () => {
    const similarlyNamedInterface = doc.getElementById(
      "idl-def-similarlynamed"
    );
    expect(similarlyNamedInterface).toBeTruthy();
    const [
      // attribute TestInterface testInterface;
      testInterface,
      // attribute TestCBInterface testCBInterface;
      testCBInterface,
      // attribute TestDictionary testDictionary;
      testDictionary,
      // attribute TestEnum testEnum;
      testEnum,
      // attribute TestTypedef testTypedef;
      testTypedef,
      // readonly maplike<SimilarlyNamed, SimilarlyNamed>;
      mapLike,
    ] = similarlyNamedInterface.querySelectorAll(".idlAttribute, .idlMaplike");
    const typeQuery = "span.idlType a";
    const nameQuery = "a.idlName";
    // attribute TestInterface testInterface;
    expect(testInterface.querySelector(typeQuery).getAttribute("href")).toBe(
      "#dom-testinterface"
    );
    expect(testInterface.querySelector(nameQuery).getAttribute("href")).toBe(
      "#dom-similarlynamed-testinterface"
    );
    // attribute TestCBInterface testCBInterface;
    expect(testCBInterface.querySelector(typeQuery).getAttribute("href")).toBe(
      "#dom-testcbinterface"
    );
    expect(testCBInterface.querySelector(nameQuery).getAttribute("href")).toBe(
      "#dom-similarlynamed-testcbinterface"
    );
    // attribute TestDictionary testDictionary;
    expect(testDictionary.querySelector(typeQuery).getAttribute("href")).toBe(
      "#dom-testdictionary"
    );
    expect(testDictionary.querySelector(nameQuery).getAttribute("href")).toBe(
      "#dom-similarlynamed-testdictionary"
    );
    // attribute TestTypedef testTypedef;
    expect(testEnum.querySelector(typeQuery).getAttribute("href")).toBe(
      "#dom-testenum"
    );
    expect(testEnum.querySelector(nameQuery).getAttribute("href")).toBe(
      "#dom-similarlynamed-testenum"
    );
    // attribute TestTypedef testTypedef;
    expect(testTypedef.querySelector(typeQuery).getAttribute("href")).toBe(
      "#dom-testtypedef"
    );
    expect(testTypedef.querySelector(nameQuery).getAttribute("href")).toBe(
      "#dom-similarlynamed-testtypedef"
    );
    // readonly maplike<SimilarlyNamed, SimilarlyNamed>;
    expect(
      Array.from(mapLike.querySelectorAll("a.internalDFN")).every(
        a => a.getAttribute("href") === "#dom-similarlynamed"
      )
    ).toBeTruthy();
  });

  it("links to fully qualified method names", () => {
    const t1 = new URL(doc.getElementById("fullyQualifiedNoParens-1").href)
      .hash;
    expect(t1).toBe("#dom-parenthesistest-fullyqualifiednoparens");

    const t2 = new URL(doc.getElementById("fullyQualifiedNoParens-2").href)
      .hash;
    expect(t2).toBe("#dom-parenthesistest-fullyqualifiednoparens");

    const t3 = new URL(doc.getElementById("fullyQualifiedNoParens-3").href)
      .hash;
    expect(t3).toBe("#dom-parenthesistest-fullyqualifiednoparens");

    const t4 = new URL(doc.getElementById("fullyQualifiedNoParens-4").href)
      .hash;
    expect(t4).toBe("#dom-parenthesistest-fullyqualifiednoparens");
  });

  it("links simple method names and types", () => {
    const section = doc.getElementById("sec-parenthesis-method");
    ["basic", "ext", "ull", "withName", "named"]
      .map(methodName => [methodName, methodName.toLowerCase()])
      .map(([methodName, id]) => [
        id,
        methodName,
        doc.getElementById(`dom-parenthesistest-${id}`),
      ])
      .forEach(([id, methodName, elem]) => {
        expect(elem).toBeTruthy();
        expect(elem.firstElementChild.localName).toBe("code");
        expect(elem.textContent).toBe(`${methodName}()`);
        expect(elem.id).toBe(`dom-parenthesistest-${id}`);
        expect(elem.dataset.dfnType).toBe("method");
        expect(elem.dataset.dfnFor).toBe("ParenthesisTest");
        expect(elem.dataset.idl).toBe("operation");
        // corresponding link
        const aElem = section.querySelector(
          `pre a[href="#dom-parenthesistest-${id}"]`
        );
        expect(aElem).toBeTruthy();
        expect(aElem.textContent).toBe(methodName);
      });
    const smokeTest = doc.getElementById("dom-parenthesistest-noparens");
    expect(smokeTest).toBeTruthy();
    expect(smokeTest.firstElementChild.localName).toBe("code");
    expect(smokeTest.textContent).toBe("noParens");
    // corresponding link
    const aElem = section.querySelector(
      `pre a[href="#dom-parenthesistest-noparens"]`
    );
    expect(aElem).toBeTruthy();
    expect(aElem.textContent).toBe("noParens");
  });
  it("should handle interfaces", () => {
    let target = doc.querySelector("#if-basic > code");
    let text = `
[Something, Exposed=Window]
interface SuperStar {
  constructor();
};
    `.trim();
    expect(target.textContent).toBe(text);
    expect(
      doc.getElementById("if-basic").querySelectorAll(".idlInterface")
    ).toHaveSize(1);
    expect(target.querySelector(".idlID").textContent).toBe("SuperStar");

    target = doc.querySelector("#if-extended-attribute > code");
    expect(target.textContent).toBe(text);
    const extAttrs = target.querySelectorAll(".extAttr");
    expect(extAttrs[0].textContent).toBe("Something");
    expect(extAttrs[1].textContent).toBe("Exposed=Window");

    target = doc.querySelector("#if-identifier-list > code");
    text = "[Global=Window, Exposed=(Window,Worker)] interface SuperStar {};";
    const rhs = target.querySelectorAll(".extAttr");
    expect(target.textContent).toBe(text);
    expect(rhs[0].textContent).toBe("Global=Window");
    expect(rhs[1].textContent).toBe("Exposed=(Window,Worker)");

    target = doc.querySelector("#if-inheritance > code");
    text = "[Exposed=Window] interface SuperStar : HyperStar {};";
    expect(target.textContent).toBe(text);
    expect(target.querySelector(".idlSuperclass").textContent).toBe(
      "HyperStar"
    );

    target = doc.querySelector("#if-partial > code");
    text = "partial interface SuperStar {};";
    expect(target.textContent).toBe(text);

    target = doc.querySelector("#if-callback > code");
    text = "callback interface SuperStar {};";
    expect(target.textContent).toBe(text);

    target = doc.querySelector("#if-mixin > code");
    text = "interface mixin SuperStar {};";
    expect(target.textContent).toBe(text);

    target = doc.querySelector("#if-partial-mixin > code");
    text = "partial interface mixin SuperStar {};";
    expect(target.textContent).toBe(text);

    target = doc.querySelector("#if-doc > code");
    const interfaces = target.querySelectorAll(".idlInterface");
    expect(interfaces[0].querySelector("a.idlID").getAttribute("href")).toBe(
      "#dom-docinterface"
    );
    expect(interfaces[1].querySelector("a.idlID")).toBeNull();
    expect(interfaces[0].id).toBe("idl-def-docinterface");
    expect(interfaces[1].id).toBe("idl-def-docisnotcasesensitive");
    expect(interfaces[2].id).toBe("idl-def-undocinterface");
    expect(interfaces[2].querySelector("dfn.idlID")).toBeTruthy();
    const namespace = target.querySelector(".idlNamespace");
    expect(namespace.querySelector("a.idlID").getAttribute("href")).toBe(
      "#dom-afterglow"
    );
  });

  it("handles constructors", async () => {
    const body = `
      <pre id='ctor-basic' class='idl'>
        [Exposed=Window]
        interface SuperStar {
          constructor();
          constructor(boolean bar, sequence&lt;double> foo);
        };
      </pre>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    const text = `
[Exposed=Window]
interface SuperStar {
  constructor();
  constructor(boolean bar, sequence<double> foo);
};
    `.trim();
    const target = doc.querySelector("#ctor-basic > code");
    expect(target.textContent).toBe(text);
    const ctors = doc.querySelectorAll("span.idlConstructor");
    expect(ctors).toHaveSize(2);

    // constructor();
    const ctor0 = ctors[0];
    expect(ctor0.querySelector("dfn").textContent).toBe("constructor");
    expect(ctor0.getElementsByClassName("idlType")).toHaveSize(0);

    // constructor(boolean bar, sequence<double> foo);
    const ctor1 = ctors[1];
    expect(ctor1.querySelector("dfn").textContent).toBe("constructor");
    const params = [...ctor1.getElementsByClassName("idlType")];
    expect(params).toHaveSize(2);
    expect(params.filter(p => p.textContent.includes("sequence"))).toHaveSize(
      1
    );
    expect(params[0].textContent).toBe("boolean");
  });

  it("should handle constructor operations", async () => {
    const body = `
      <section data-dfn-for="SuperStar" data-link-for="SuperStar">
        <pre class="idl">
          [Exposed=Window]
          interface SuperStar {
            constructor();
          };
          [Exposed=Window]
          interface HyperStar {
            constructor();
          };
          [Exposed=Window]
          interface DeathStar {
            constructor();
          };
        </pre>
        <dfn>constructor</dfn>
        <dfn>HyperStar.constructor</dfn>
        <dfn>DeathStar.constructor()</dfn>
        <p id="linkMe">
          <a>constructor</a>
          <a>constructor()</a>
          <a>SuperStar.constructor</a>
          <a>SuperStar.constructor()</a>
        </p>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const pre = doc.querySelector("pre");
    expect(
      pre.querySelector("a[href=\\#dom-superstar-constructor]")
    ).toBeTruthy();
    expect(
      pre.querySelector("a[href=\\#dom-hyperstar-constructor]")
    ).toBeTruthy();
    expect(
      pre.querySelector("a[href=\\#dom-deathstar-constructor]")
    ).toBeTruthy();
    const links = doc.querySelectorAll("#linkMe a");
    expect(links).toHaveSize(4);
    for (const link of links) {
      expect(link.getAttribute("href")).toBe("#dom-superstar-constructor");
      expect(link.querySelector("code")).toBeTruthy();
    }
  });

  it("should handle constructor operation overloads", async () => {
    const body = `
      <section data-dfn-for="SuperStar" data-link-for="SuperStar">
        <pre class="idl">
          [Exposed=Window]
          interface SuperStar {
            constructor();
            constructor(short s);
          };
        </pre>
        <dfn>constructor</dfn>
        <dfn>constructor!overload-1</dfn>
        <p id="linkMe">
          <a>constructor</a>
          <a>constructor!overload-1</a>
        </p>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const links = doc.querySelectorAll("#linkMe a");
    expect(links).toHaveSize(2);
    expect(links[0].getAttribute("href")).toBe("#dom-superstar-constructor");
    expect(links[1].getAttribute("href")).toBe(
      "#dom-superstar-constructor!overload-1"
    );
  });

  it("handles LegacyFactoryFunction", async () => {
    const body = `
    <pre class="idl" id="namedctor-basic">
      [LegacyFactoryFunction=Sun(),
      LegacyFactoryFunction=Sun(boolean bar, Date foo),
      Exposed=Window]
      interface SuperStar {};
    </pre>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const target = doc.querySelector("#namedctor-basic > code");
    const text = `
[LegacyFactoryFunction=Sun(),
LegacyFactoryFunction=Sun(boolean bar, Date foo),
Exposed=Window]
interface SuperStar {};
`.trim();
    expect(target.textContent).toBe(text);
    const ctors = target.getElementsByClassName("extAttr");
    expect(ctors).toHaveSize(3);
    const ctor = ctors[1];
    expect(ctor.textContent).toBe(
      "LegacyFactoryFunction=Sun(boolean bar, Date foo)"
    );
    const params = [...ctor.getElementsByClassName("idlType")];
    expect(params).toHaveSize(2);
    expect(params.filter(p => p.textContent.includes("Date"))).toHaveSize(1);
    expect(params[0].textContent).toBe("boolean");
  });

  it("should handle constants", () => {
    const target = doc.querySelector("#const-basic > code");
    // Remove the header, as we are not interested in it.
    const text =
      "[Exposed=Window]\n" +
      "interface ConstTest {\n" +
      "  // 1\n" +
      "  const boolean test = true;\n" +
      "  // 2\n" +
      "  const byte bite = 8;\n" +
      "  // 3\n" +
      "  const octet eight = 7;\n" +
      "  // 4\n" +
      "  const short small = 42;\n" +
      "  // 5\n" +
      "  const unsigned short shortish = 250;\n" +
      "  // 6\n" +
      "  const long notSoLong = 99999;\n" +
      "  // 7\n" +
      "  const unsigned long somewhatLong = 9999999;\n" +
      "  // 8\n" +
      "  const long long veryLong = 9999999999999;\n" +
      "  // 9\n" +
      "  const unsigned long long soLong = 99999999999999999;\n" +
      "  // 10\n" +
      "  const float ationDevice = 4.2;\n" +
      "  // 11\n" +
      "  const unrestricted float buoy = 4.2222222222;\n" +
      "  // 12\n" +
      "  const double twice = 4.222222222;\n" +
      "  // 13\n" +
      "  const unrestricted double rambaldi = 47.0;\n" +
      "  // 14\n" +
      "  const short inf = Infinity;\n" +
      "  // 15\n" +
      "  const short mininf = -Infinity;\n" +
      "  // 16\n" +
      "  const short cheese = NaN;\n" +
      "  // 17\n" +
      "  [Something] const short extAttr = NaN;\n" +
      "};";
    expect(target.textContent).toBe(text);
    const consts = [...target.getElementsByClassName("idlConst")];
    expect(consts).toHaveSize(17);
    const const1 = target.querySelector(".idlConst");
    expect(const1.querySelector(".idlType").textContent).toBe(" boolean");
    expect(const1.querySelector(".idlName").textContent).toBe("test");
    expect(consts[consts.length - 1].querySelectorAll(".extAttr")).toHaveSize(
      1
    );

    // Links and IDs.
    expect(
      consts
        .find(c => c.textContent.includes("rambaldi"))
        .querySelector("a.idlName")
        .getAttribute("href")
    ).toBe("#dom-consttest-rambaldi");
    expect(
      consts.find(c => c.textContent.includes("rambaldi")).getAttribute("id")
    ).toBe("idl-def-consttest-rambaldi");
    expect(
      consts
        .find(c => c.textContent.includes("bite"))
        .querySelector("a.idlName")
        .getAttribute("href")
    ).toBe("#dom-consttest-bite");
    expect(
      consts
        .find(c => c.textContent.includes("inf"))
        .querySelector("a.idlName")
        .getAttribute("href")
    ).toBe("#dom-consttest-inf");
    expect(
      consts
        .find(c => c.textContent.includes("ationDevice"))
        .querySelector("dfn.idlName")
    ).toBeTruthy();
  });

  it("handles attributes", () => {
    const target = doc.querySelector("#attr-basic > code");
    // Remove the header, as we are not interested in it.
    const text = `[Exposed=Window]
interface AttrBasic {
  // 1
  attribute DOMString regular;
  // 2
  readonly attribute DOMString ro;
  // 2.2
  readonly attribute DOMString _readonly;
  // 2.5
  inherit attribute DOMString in;
  // 2.7
  stringifier attribute DOMString st;
  // 3
  [Something] readonly attribute DOMString ext;
  // 3.10.31
  attribute FrozenArray<DOMString> alist;
  // 4.0
  attribute Promise<DOMString> operation;
  // 5.0
  readonly attribute Performance performance;
};`;
    expect(target.textContent).toBe(text);
    const attrs = [...target.getElementsByClassName("idlAttribute")];
    expect(attrs).toHaveSize(9);
    const at = attrs[0];
    expect(at.querySelector(".idlType").textContent).toBe(" DOMString");
    expect(at.querySelector(".idlName").textContent).toBe("regular");
    const ro = attrs[2];
    expect(ro.querySelector(".idlName").textContent).toBe("_readonly");
    const frozen = attrs[6];
    expect(frozen.querySelector(".idlType").textContent).toBe(
      " FrozenArray<DOMString>"
    );
    const promise = attrs[7];
    expect(promise.querySelector(".idlType").textContent).toBe(
      " Promise<DOMString>"
    );
    expect(
      attrs.find(c => c.textContent.includes("_readonly")).getAttribute("id")
    ).toBe("idl-def-attrbasic-readonly");
    expect(
      attrs
        .find(c => c.textContent.includes("regular"))
        .querySelector("a.idlName")
        .getAttribute("href")
    ).toBe("#dom-attrbasic-regular");
    expect(
      attrs
        .find(c => c.textContent.includes("alist"))
        .querySelector("dfn.idlName")
    ).toBeTruthy();

    const performanceInterfaceLink = Array.from(
      target.querySelectorAll("a")
    ).find(({ textContent }) => textContent === "Performance");
    expect(performanceInterfaceLink).toBeTruthy();
    expect(performanceInterfaceLink.getAttribute("href")).toBe(
      "#dfn-performance"
    );

    const performanceAttrLink = Array.from(target.querySelectorAll("a")).find(
      ({ textContent }) => textContent === "performance"
    );
    expect(performanceAttrLink).toBeTruthy();
    expect(performanceAttrLink.getAttribute("href")).toBe(
      "#dom-attrbasic-performance"
    );
  });

  it("handles stringifiers special operations", () => {
    const stringifierTestElems = [
      ...doc.querySelectorAll("#stringifiertest .idlMethod"),
    ];
    const [stringifierAnon, stringifierNamed] = stringifierTestElems;
    expect(stringifierAnon).toBeTruthy();
    expect(stringifierAnon.querySelector(".idlType").textContent).toBe(
      " StringPass"
    );
    expect(stringifierAnon.querySelector(".idlName")).toBeNull();

    expect(stringifierNamed).toBeTruthy();
    expect(stringifierNamed.querySelector(".idlType").textContent).toBe(
      " StringNamedPass"
    );
    expect(stringifierNamed.querySelector(".idlName").textContent).toBe(
      "named"
    );
  });

  it("handles getter special operations", () => {
    const getterTestElems = [...doc.querySelectorAll("#gettertest .idlMethod")];
    const [getterAnon, getterNamed] = getterTestElems;
    expect(getterAnon).toBeTruthy();
    expect(getterAnon.querySelector(".idlType").textContent).toBe(
      " GetterPass"
    );
    expect(getterAnon.querySelector(".idlName")).toBeNull();

    expect(getterNamed).toBeTruthy();
    expect(getterNamed.querySelector(".idlType").textContent).toBe(
      " GetterNamedPass"
    );
    expect(getterNamed.querySelector(".idlName").textContent).toBe("named");
  });

  it("handles setter special operations", () => {
    const setterTestElems = [...doc.querySelectorAll("#settertest .idlMethod")];
    const [setterAnon, setterNamed] = setterTestElems;
    expect(setterAnon).toBeTruthy();
    expect(setterAnon.querySelector(".idlType").textContent).toBe(
      " SetterPass"
    );
    expect(setterAnon.querySelector(".idlName")).toBeNull();

    expect(setterNamed).toBeTruthy();
    expect(setterNamed.querySelector(".idlType").textContent).toBe(
      " SetterNamedPass"
    );
    expect(setterNamed.querySelector(".idlName").textContent).toBe("named");
  });

  it("correctly id's and links anonymous special operations", async () => {
    const body = `
      <section data-dfn-for="Bar">
        <h2>Anonymous special operations</h2>
        <pre class="idl">
          [Exposed=Window]
          interface Bar {
            getter DOMString ();
            setter DOMString ();
            stringifier DOMString ();
            deleter DOMString ();
          };
        </pre>
        <p>
          <dfn>getter</dfn> <dfn>setter()</dfn> <dfn>stringifier()</dfn>
        </p>
      </section>`;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);

    // Correct ids
    expect(doc.getElementById("idl-def-bar-anonymous-getter")).toBeTruthy();
    expect(doc.getElementById("idl-def-bar-anonymous-setter")).toBeTruthy();
    expect(
      doc.getElementById("idl-def-bar-anonymous-stringifier")
    ).toBeTruthy();
    expect(doc.getElementById("idl-def-bar-anonymous-deleter")).toBeTruthy();

    // Definitions
    expect(doc.getElementById("dom-bar-getter")).toBeTruthy();
    expect(doc.getElementById("dom-bar-setter")).toBeTruthy();
    expect(doc.getElementById("dom-bar-stringifier")).toBeTruthy();
    expect(doc.getElementById("dom-bar-deleter")).toBeTruthy();

    // links
    const getterLink = doc.querySelector("#idl-def-bar-anonymous-getter > a");
    expect(getterLink.getAttribute("href")).toEqual("#dom-bar-getter");

    const setterLink = doc.querySelector("#idl-def-bar-anonymous-setter > a");
    expect(setterLink.getAttribute("href")).toEqual("#dom-bar-setter");

    const stringifierLink = doc.querySelector(
      "#idl-def-bar-anonymous-stringifier > a"
    );
    expect(stringifierLink.getAttribute("href")).toEqual(
      "#dom-bar-stringifier"
    );

    // The deleter is automatically defined in the IDL block
    expect(doc.querySelector("pre.idl dfn#dom-bar-deleter")).toBeTruthy();
  });

  it("should handle operations", () => {
    const target = doc.querySelector("#meth-basic > code");
    // Remove the header, as we are not interested in it.
    const text = `[Exposed=Window]
interface MethBasic {
  // 1
  undefined basic();
  // 2
  [Something] undefined ext();
  // 3
  unsigned long long ull(short s, short n);
  // 3.5
  SuperStar? ull();
  // 5
  getter float ();
  // 6
  getter float withName ();
  // 7
  setter undefined ();
  // 8
  setter undefined named ();
  // 9
  static Promise<RTCCertificate>  generateCertificate(AlgorithmIdentifier keygenAlgorithm);
  // 10
  stringifier DOMString identifier();
  // 11
  stringifier DOMString ();
  // 12
  stringifier;
  Promise<undefined> complete(optional PaymentComplete result = "unknown");
  Promise<undefined> another(optional  /*trivia*/  PaymentComplete result = "unknown");
  Performance performance();
};`;
    expect(target.textContent).toBe(text);
    const methods = [...target.getElementsByClassName("idlMethod")];
    expect(methods).toHaveSize(15);
    expect(target.getElementsByClassName("idlName")).toHaveSize(11);
    const first = methods[0];
    expect(first.querySelector(".idlType").textContent).toBe(
      "\n  // 1\n  undefined"
    );
    expect(first.querySelector(".idlName").textContent).toBe("basic");

    // Overloads
    const overloads = methods.filter(m => m.textContent.includes("ull"));
    expect(overloads[0].id).toBe("idl-def-methbasic-ull-s-n");
    expect(overloads[1].id).toBe("idl-def-methbasic-ull!overload-1");
    expect(overloads[1].querySelector(".idlType a").textContent).toBe(
      "SuperStar"
    );

    // Links and IDs.
    const ulls = overloads.map(m =>
      m.querySelector("a.idlName").getAttribute("href")
    );
    expect(ulls[0]).toBe("#dom-methbasic-ull");
    expect(ulls[ulls.length - 1]).toBe("#dom-methbasic-ull!overload-1");
    expect(
      methods
        .find(m => m.textContent.includes("withName"))
        .querySelector("dfn.idlName")
    ).toBeTruthy();

    const performanceTypeLink = Array.from(target.querySelectorAll("a")).find(
      ({ textContent }) => textContent === "Performance"
    );
    expect(performanceTypeLink).toBeTruthy();
    expect(performanceTypeLink.getAttribute("href")).toBe("#dfn-performance");
    const performanceMethodLink = Array.from(target.querySelectorAll("a")).find(
      ({ textContent }) => textContent === "performance"
    );
    expect(performanceMethodLink).toBeTruthy();
    expect(performanceMethodLink.getAttribute("href")).toBe(
      "#dom-methbasic-performance"
    );
  });

  it("should handle iterable-like interface member declarations", () => {
    const elem = doc.getElementById("iterable-like");
    expect(elem.getElementsByClassName("idlIterable")).toHaveSize(2);
    expect(elem.getElementsByClassName("idlMaplike")).toHaveSize(1);
    expect(elem.getElementsByClassName("idlSetlike")).toHaveSize(1);
  });

  it("outputs map/set-like interface member declarations", () => {
    const pre = doc.getElementById("map-set-readonly");
    // Remove the header, has we are not interested in it
    pre.querySelector(".idlHeader").remove();
    const { textContent } = pre;
    const expected = `
[Exposed=Window]
interface MapLikeInterface {
  maplike<MapLikeInterface, MapLikeInterface>;
};
[Exposed=Window]
interface ReadOnlyMapLike {
  readonly maplike<ReadOnlyMapLike, ReadOnlyMapLike>;
};
[Exposed=Window]
interface SetLikeInterface {
  setlike<SetLikeInterface>;
};
[Exposed=Window]
interface ReadOnlySetLike {
  readonly setlike<ReadOnlySetLike>;
};
    `.trim();
    expect(textContent).toBe(expected);
  });

  it("handles comments", async () => {
    const body = `
    <pre id="comments-basic" class='idl'>
    [Exposed=Window]
    interface SuperStar {
      // This is a comment
      // over two lines.
      /* This one
         has
         three. */
      <!-- this is an HTML comment that will be ignored -->
    };
    </pre>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const target = doc.querySelector("#comments-basic > code");
    // Remove the header, as we are not interested in it.
    const text =
      // eslint-disable-next-line prettier/prettier
      // eslint-disable-next-line prefer-template
      `
[Exposed=Window]
interface SuperStar {
  // This is a comment
  // over two lines.
  /* This one
     has
     three. */` +
      // eslint-disable-next-line no-useless-escape
      "\n  \n" +
      `};`;
    expect(target.textContent).toBe(text.trim());
    expect(target.getElementsByClassName("idlSectionComment")).toHaveSize(1);
  });

  it("uniquely links to enum values", () => {
    const target = doc.querySelector("#multipleEnums");
    const idlLinks = target.querySelectorAll("a[data-link-for]");
    expect(idlLinks).toHaveSize(2);
    const [a1, a2] = idlLinks;
    expect(a1.getAttribute("href")).toBe("#dom-test1-enum");
    expect(a2.getAttribute("href")).toBe("#dom-test2-enum");
    expect(doc.getElementById("dom-test1-enum")).toBeTruthy();
    expect(doc.getElementById("dom-test2-enum")).toBeTruthy();
  });

  it("handles dictionaries", () => {
    let target = doc.querySelector("#dict-basic > code");
    let text = "dictionary SuperStar {};";
    expect(target.textContent).toBe(text);
    expect(target.querySelectorAll(".idlDictionary")).toHaveSize(1);
    expect(target.querySelector(".idlID").textContent).toBe("SuperStar");

    target = doc.querySelector("#dict-inherit > code");
    text = "dictionary SuperStar : HyperStar {};";
    expect(target.textContent).toBe(text);
    expect(target.querySelector(".idlSuperclass").textContent).toBe(
      "HyperStar"
    );

    target = doc.querySelector("#dict-fields > code");
    text =
      "dictionary SuperStar {\n" +
      "  // 1\n" +
      "  DOMString value;\n" +
      "  // 2\n" +
      "  DOMString? nullable;\n" +
      "  // 3\n" +
      "  [Something]float ext;\n" +
      "  // 4\n" +
      "  unsigned long long longLong;\n" +
      "\n" +
      "  // 5\n" +
      "  boolean test = true;\n" +
      "  // 6\n" +
      "  byte little = 2;\n" +
      "  // 7\n" +
      "  byte big = Infinity;\n" +
      "  // 8\n" +
      "  byte cheese = NaN;\n" +
      "  // 9\n" +
      '  DOMString blah = "blah blah";\n' +
      "};";
    expect(target.textContent).toBe(text);
    const members = target.querySelectorAll(".idlMember");
    expect(members).toHaveSize(9);
    const member = members[0];
    expect(member.querySelector(".idlType").textContent).toBe(
      "\n  // 1\n  DOMString"
    );
    expect(member.querySelector(".idlName").textContent).toBe("value");

    target = doc.querySelector("#dict-required-fields > code");
    text =
      "dictionary SuperStar {\n" +
      "  required DOMString value;\n" +
      "  DOMString optValue;\n" +
      "};";
    expect(target.textContent).toBe(text);

    // Links and IDs.
    const dictDocTest = doc
      .getElementById("dict-doc")
      .querySelector(".idlDictionary");
    expect(dictDocTest.querySelector("a.idlID").getAttribute("href")).toBe(
      "#dom-dictdoctest"
    );
    expect(dictDocTest.getAttribute("id")).toBe("idl-def-dictdoctest");
    const mems = [...dictDocTest.querySelectorAll(".idlMember")];
    const dictDocField = mems.find(m => m.textContent.includes("dictDocField"));
    expect(dictDocField.querySelector("a.idlName").getAttribute("href")).toBe(
      "#dom-dictdoctest-dictdocfield"
    );
    expect(
      mems
        .find(m => m.textContent.includes("otherField"))
        .querySelector("a.idlName")
        .getAttribute("href")
    ).toBe("#dom-dictdoctest-otherfield");
    expect(dictDocField.getAttribute("id")).toBe(
      "idl-def-dictdoctest-dictdocfield"
    );
    const warningLink = mems
      .find(m => m.textContent.includes("undocField"))
      .querySelector("dfn.idlName");
    expect(warningLink).toBeTruthy();
  });

  it("handles multiple dictionaries", async () => {
    const idl = doc.querySelector("#multiple-dictionaries code");
    const expected = `
dictionary OneThing {
  int x;
};


partial dictionary AnotherThing {
  int y;
};`.trim();
    expect(idl.textContent).toBe(expected);
    expect(idl.querySelector(".idlSectionComment")).toBeNull();
  });

  describe("enums", () => {
    it("handles enumerations", async () => {
      const body = `
      <section id="enumerations">
        <pre id='enum-basic' class='idl'>
          enum EnumBasic {
            // 1
            "one",
            // 2
            "two"
            // 3
            , "three",

            // 4
            "white space"
          };
        </pre>
        <p id="enum-basic-doc"><dfn>EnumBasic</dfn></p>
        <p data-dfn-for="EnumBasic"><dfn>one</dfn> is first.</p>
        <p data-link-for="EnumBasic"><a>one</a> is referenced with a <code>[link-for]</code> attribute.</p>
        <p id="enum-ref-without-link-for"><a>EnumBasic.one</a> may also be referenced with fully-qualified name.</p>
        <p><dfn data-dfn-for="EnumBasic">white space</dfn></p>
      </section>
      `;
      const ops = makeStandardOps(null, body);
      const doc = await makeRSDoc(ops);
      const target = doc.querySelector("#enum-basic > code");
      const text = `
enum EnumBasic {
  // 1
  "one",
  // 2
  "two"
  // 3
  , "three",

  // 4
  "white space"
}; `.trim();
      expect(target.textContent).toBe(text);
      expect(target.querySelector(".idlEnum")).toBeTruthy();
      expect(target.querySelector(".idlID").textContent).toBe("EnumBasic");
      expect(target.querySelectorAll(".idlEnumItem")).toHaveSize(4);
      expect(target.querySelector(".idlEnumItem").textContent).toBe('"one"');
      expect(
        target.querySelector("a[href='#dom-enumbasic-white-space']")
      ).toBeTruthy();
      // Links and IDs.
      expect(target.querySelector("a.idlID").getAttribute("href")).toBe(
        "#dom-enumbasic"
      );
      expect(doc.getElementById("idl-def-enumbasic")).toBeTruthy();
    });
  });

  it("should handle enumeration value definitions", () => {
    const section = doc.getElementById("enumerations");
    expect(
      [...section.getElementsByTagName("dfn")]
        .find(el => el.textContent.includes("one"))
        .getAttribute("id")
    ).toBe("dom-enumbasic-one");
    expect(
      [...section.querySelectorAll("p[data-link-for] a")]
        .find(el => el.textContent.includes("one"))
        .getAttribute("href")
    ).toBe("#dom-enumbasic-one");
    expect(
      [...section.querySelectorAll("#enum-ref-without-link-for a")]
        .find(el => el.textContent.includes("one"))
        .getAttribute("href")
    ).toBe("#dom-enumbasic-one");
  });

  it("links empty-string enumeration value", () => {
    const links = doc.querySelector(
      `#enum-empty-sec a[href="#dom-emptyenum-the-empty-string"]`
    );
    const dfn = doc.getElementById("dom-emptyenum-the-empty-string");
    const smokeDfn = doc.querySelector(
      `#enum-empty-sec a[href="#dom-emptyenum-not-empty"]`
    );
    expect(links).toBeTruthy();
    expect(dfn).toBeTruthy();
    expect(smokeDfn).toBeTruthy();
  });

  it("handles optional and trivia", () => {
    const expected = `
[Exposed=Window]
interface Foo {
  constructor(X x, optional Y y, /*trivia*/ Z y);
  undefined foo(X x, optional Y y, /*trivia*/ optional Z z);
};
callback CallBack = Z? (X x, optional Y y, /*trivia*/ optional Z z);
    `.trim();
    const idlElem = doc.getElementById("optional-trivia");
    // Remove the header, as we are not interested in it.
    idlElem.querySelector(".idlHeader").remove();
    expect(idlElem.textContent).toBe(expected);
    const trivaComments = idlElem.querySelectorAll("span.idlSectionComment");
    expect(trivaComments).toHaveSize(3);
  });

  it("should handle callbacks", () => {
    let target = doc.querySelector("#cb-basic > code");
    // Remove the header, as we are not interested in it.
    let text = "callback SuperStar = undefined();";
    expect(target.textContent).toBe(text);
    expect(target.getElementsByClassName("idlCallback")).toHaveSize(1);
    expect(target.querySelector(".idlID").textContent).toBe("SuperStar");
    expect(target.querySelector(".idlType").textContent).toBe(" undefined");

    target = doc.querySelector("#cb-less-basic > code");
    // Remove the header, as we are not interested in it.
    text = "callback CbLessBasic = unsigned long long?(optional any value);";
    expect(target.textContent).toBe(text);
    expect(target.querySelector(".idlType").textContent).toBe(
      " unsigned long long?"
    );
    let prm = target.querySelectorAll(".idlParamName");
    expect(prm).toHaveSize(1);
    expect(target.querySelectorAll(".idlType")[1].textContent).toBe(" any");
    expect(prm[0].textContent).toBe("value");

    // Links and IDs.
    expect(target.querySelector("a[href='#dom-cblessbasic']").textContent).toBe(
      "CbLessBasic"
    );
    expect(target.querySelector(".idlCallback").getAttribute("id")).toBe(
      "idl-def-cblessbasic"
    );

    target = doc.querySelector("#cb-mult-args > code");
    // Remove the header, as we are not interested in it.
    text = "callback SortCallback = undefined (any a, any b);";
    expect(target.textContent).toBe(text);
    prm = target.querySelectorAll(".idlParamName");
    expect(prm).toHaveSize(2);
    const idlTypes = target.getElementsByClassName("idlType");
    expect(idlTypes[1].textContent).toBe("any");
    expect(prm[0].textContent).toBe("a");
    expect(idlTypes[2].textContent).toBe(" any");
    expect(prm[1].textContent).toBe("b");
  });

  it("should handle typedefs", () => {
    let target = doc.querySelector("#td-basic > code");
    // Remove the header, as we are not interested in it.
    let text = "typedef DOMString string;";
    expect(target.textContent).toBe(text);
    expect(target.querySelectorAll(".idlTypedef")).toHaveSize(1);
    expect(target.querySelector(".idlID").textContent).toBe("string");
    expect(target.querySelector(".idlType").textContent).toBe(" DOMString");

    target = doc.querySelector("#td-less-basic > code");
    // Remove the header, as we are not interested in it.
    text = "typedef unsigned long long? tdLessBasic;";
    expect(target.textContent).toBe(text);

    // Links and IDs.
    expect(target.querySelector(".idlID").getAttribute("href")).toBe(
      "#dom-tdlessbasic"
    );
    expect(target.querySelector(".idlTypedef").id).toBe("idl-def-tdlessbasic");

    target = doc.querySelector("#td-extended-attribute > code");
    // Remove the header, as we are not interested in it.
    text =
      "typedef ([Clamp] unsigned long or ConstrainULongRange) ConstrainULong;";
    expect(target.textContent).toBe(text);

    target = doc.querySelector("#td-union-extended-attribute > code");
    // Remove the header, as we are not interested in it.
    text =
      "typedef [Clamp] (unsigned long or ConstrainULongRange) ConstrainULong2;";
    expect(target.textContent).toBe(text);

    target = doc.querySelector("#td-trivia > code");
    // Remove the header, as we are not interested in it.
    text =
      "/* test1 */ typedef /* test2 */ [Clamp] /* test3 */ (/* test4 */ unsigned long /* test5 */ or /* test6 */ ConstrainULongRange /* test7 */ ) /* test8 */ ConstrainULong3 /* test9 */;";
    expect(target.textContent).toBe(text);
  });

  it("should handle includes", () => {
    let target = doc.querySelector("#incl-basic > code");
    // Remove the header, as we are not interested in it.
    let text = "Window includes Document;";
    expect(target.textContent).toBe(text);
    expect(target.getElementsByClassName("idlIncludes")).toHaveSize(1);

    target = doc.querySelector("#incl-less-basic > code");
    // Remove the header, as we are not interested in it.
    text = `[Something]${text}`;
    expect(target.textContent).toBe(text);
  });

  it("should link documentation", () => {
    const section = doc.getElementById("documentation");
    const target = doc.querySelector("#doc-iface > code");

    expect(
      target.querySelector("a.idlName[href='#dom-documented-docstring']")
        .textContent
    ).toBe("docString");
    expect(
      section.querySelector("dfn#dom-documented-docstring").textContent
    ).toBe("docString");

    expect(section.querySelector("dfn#dfn-some-generic-term").textContent).toBe(
      "Some generic term"
    );
    expect(
      section.querySelector("a[href='#dfn-some-generic-term']").textContent
    ).toBe("Some generic term");
    expect(
      section.querySelector(
        "p[data-link-for] a[href='#dom-documented-docstring']"
      ).textContent
    ).toBe("docString");
    const selfDefinedAttr = target.querySelectorAll(
      ".idlAttribute dfn.idlName"
    );
    expect(selfDefinedAttr).toHaveSize(1);
    expect(selfDefinedAttr[0].getElementsByTagName("a")).toHaveSize(0);
    expect(selfDefinedAttr[0].textContent).toBe("notDefined");
    expect(
      section.querySelector(
        "p[data-link-for] a[href='#dom-documented-notdefined']"
      ).textContent
    ).toBe("notDefined");

    const definedElsewhere = section.querySelector(
      "dfn#dom-documented-definedelsewhere"
    );
    const linkFromElsewhere = section.querySelector(
      "p:not([data-link-for]) a[href='#dom-documented-docstring']"
    );
    expect(definedElsewhere.textContent).toBe("Documented.definedElsewhere");
    expect(
      target.querySelector("a.idlName[href='#dom-documented-definedelsewhere']")
        .textContent
    ).toBe("definedElsewhere");
    expect(linkFromElsewhere.textContent).toBe("Documented.docString");

    expect(
      section.querySelector("#without-link-for a[href='#dom-documented']")
        .textContent
    ).toBe("Documented");
  });
  it("retains css classes afer processing", () => {
    const elem = doc.getElementById("retain-css-classes");
    const expected = ["a", "b", "c", "overlarge"];
    expect(expected.every(item => elem.classList.contains(item))).toBe(true);
  });
  it("links `[Default] object toJSON();` automatically to IDL spec", () => {
    const elem = doc.getElementById("AutoLinkToIDLSpec");
    const [defaultLink, objectLink, toJSONLink] = Array.from(
      elem.querySelectorAll("[data-title='toJSON'] a")
    ).map(elem => new URL(elem.href));
    expect(defaultLink.hash).toBe("#Default");
    expect(objectLink.hash).toBe("#idl-object");
    expect(toJSONLink.hash).toBe("#default-tojson-steps");
  });
  it("links `[Default] object toJSON();` with data-link-for automatically to IDL spec", () => {
    const elem = doc.getElementById("AutoLinkToIDLSpecLinkFor");
    const [defaultLink, objectLink, toJSONLink] = Array.from(
      elem.querySelectorAll("[data-title='toJSON'] a")
    ).map(elem => new URL(elem.href));
    expect(defaultLink.hash).toBe("#Default");
    expect(objectLink.hash).toBe("#idl-object");
    expect(toJSONLink.hash).toBe("#default-tojson-steps");
  });
  it("allows toJSON() to be defined in spec", () => {
    const elem = doc.getElementById("DefinedToJson");
    const [defaultLink, objectLink, toJSONLink] = Array.from(
      elem.querySelectorAll("[data-title='toJSON'] a")
    ).map(elem => new URL(elem.href));
    expect(defaultLink.hash).toBe("#Default");
    expect(objectLink.hash).toBe("#idl-object");
    expect(toJSONLink.pathname).toBe(doc.location.pathname);
    expect(toJSONLink.origin).toBe(doc.location.origin);
    expect(toJSONLink.hash).toBe("#dom-definedtojson-tojson");
  });
  it("puts code elements around both IDL definitions and links", () => {
    const things = [
      ...doc.querySelectorAll("#coded-things > a, #coded-things > dfn"),
    ];
    expect(things.every(elem => elem.parentElement.localName === "code")).toBe(
      true
    );
    const linksToTheFoo = doc.querySelectorAll(
      "#coded-things a[href='#dom-codedthings-dothefoo']"
    );
    expect(linksToTheFoo).toHaveSize(4);

    const linkToBarBarAttr = doc.querySelectorAll(
      "#coded-things a[href='#dom-codedthings-barbar']"
    );
    expect(linkToBarBarAttr).toHaveSize(2);
  });
  it("sets the IDL type for each type of IDL token", async () => {
    const body = `
      <section id="idl-dfn-types">
        <pre class="idl">
          [Exposed=Window]
          interface InterfaceType {
            readonly attribute DOMString attributeType;
            undefined operationType();
          };
          dictionary DictionaryType {
            DOMString fieldType;
          };
          enum EnumType {
            "enumValueType"
          };
        </pre>
        <p>
          <dfn>InterfaceType</dfn>
          <dfn data-dfn-for="InterfaceType">attributeType</dfn>
          <dfn data-dfn-for="InterfaceType">operationType</dfn>
          <dfn>DictionaryType</dfn>
          <dfn data-dfn-for="DictionaryType">fieldType</dfn>
          <dfn>EnumType</dfn>
          <dfn data-dfn-for="EnumType">enumValueType</dfn>
        </p>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    // interface InterfaceType
    const interfaceType = doc.getElementById("dom-interfacetype");
    expect(interfaceType.dataset.idl).toBe("interface");

    // attribute attributeType;
    const attributeType = doc.getElementById("dom-interfacetype-attributetype");
    expect(attributeType.dataset.idl).toBe("attribute");

    // operationType();
    const operationType = doc.getElementById("dom-interfacetype-operationtype");
    expect(operationType.dataset.idl).toBe("operation");

    // DictionaryType
    const dictionaryType = doc.getElementById("dom-dictionarytype");
    expect(dictionaryType.dataset.idl).toBe("dictionary");

    // fieldType member (field)
    const fieldType = doc.getElementById("dom-dictionarytype-fieldtype");
    expect(fieldType.dataset.idl).toBe("field");

    // enum EnumType
    const enumType = doc.getElementById("dom-enumtype");
    expect(enumType.dataset.idl).toBe("enum");

    // "enumValueType"
    const enumValueType = doc.getElementById("dom-enumtype-enumvaluetype");
    expect(enumValueType.dataset.idl).toBe("enum-value");
  });
  it("auto-links based on definition context", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <pre class="idl" id="link-test" data-cite="HTML DOM">
          interface Foo {
            DOMString fromWebIDL(); // defined in WebIDL
            attribute EventTarget fromDomSpec; // Defined in DOM
            attribute EventHandler fromHTMLSpec; // Defined in HTML
          };
        </pre>
      </section>
    `;
    const ops = makeStandardOps({ xref: true }, body);
    const doc = await makeRSDoc(ops);

    // DOMString fromWebIDL();
    const domString = doc.querySelector(
      "#link-test a[href='https://webidl.spec.whatwg.org/#idl-DOMString']"
    );
    expect(domString).toBeTruthy();

    // attribute EventTarget fromDomSpec; // Defined in DOM
    const eventTarget = doc.querySelector(
      "#link-test a[href='https://dom.spec.whatwg.org/#eventtarget']"
    );
    expect(eventTarget).toBeTruthy();

    // attribute EventHandler fromHTMLSpec; // Defined in HTML
    const eventHandler = doc.querySelector(
      "#link-test a[href='https://html.spec.whatwg.org/multipage/webappapis.html#eventhandler']"
    );
    expect(eventHandler).toBeTruthy();
  });

  it("auto-links some IDL types", async () => {
    const body = `
      <section>
        <pre class="idl" id="link-test">
          [Exposed=(Window, Worker, DedicatedWorker)]
          interface Foo {
            readonly attribute object bar;
          };
        </pre>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const windowAnchor = doc.querySelector("#link-test a[href$=window]");
    // Exposed=(Window)
    expect(windowAnchor.href).toBe(
      "https://html.spec.whatwg.org/multipage/window-object.html#window"
    );
    expect(windowAnchor.dataset.xrefType).toBe("interface");
    // Exposed=(Worker)
    const workerAnchor = doc.querySelector(
      "#link-test a[href$=workerglobalscope]"
    );
    expect(workerAnchor.href).toBe(
      "https://html.spec.whatwg.org/multipage/workers.html#workerglobalscope"
    );
    expect(workerAnchor.dataset.xrefType).toBe("interface");

    // Exposed=(DedicatedWoker)
    const dedicatedWorkerAnchor = doc.querySelector(
      "#link-test a[href$=dedicatedworkerglobalscope]"
    );
    expect(dedicatedWorkerAnchor.href).toBe(
      "https://html.spec.whatwg.org/multipage/workers.html#dedicatedworkerglobalscope"
    );
    expect(dedicatedWorkerAnchor.dataset.xrefType).toBe("interface");

    // readonly attribute object bar;
    const objectAnchor = doc.querySelector("#link-test a[href$=idl-object]");
    expect(objectAnchor.dataset.xrefType).toBe("interface");
    expect(objectAnchor.href).toBe(
      "https://webidl.spec.whatwg.org/#idl-object"
    );
  });

  it("does not link arbitrary extended attribute identifiers", async () => {
    const body = `
      <section>
        <h2>Test</h2>
        <pre class="idl" id="link-test">
          interface mixin InnerHTMLMixin {
            [PutForwards=html] readonly attribute DOMString innerHTML;
          };
        </pre>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    expect(doc.querySelector(".respec-offending-element")).toBeFalsy();
  });

  it("exports IDL definitions", async () => {
    const body = `
      <section>
        <pre class="idl">
          [Exposed=Window]
          interface Banana {
            undefined nana();
            undefined doTheFoo(DOMString req1, DOMString req2, optional DOMString optional3, optional DOMString optional4, DOMString... variadicArg);
            readonly attribute boolean isFruit;
            undefined selfDefined(DOMString arg1, optional DOMString arg2, DOMString ...variadic);
          };
        </pre>
        <p id="p" data-dfn-for="Banana">
          The interface <dfn>Banana</dfn> is nice
          and its operation <dfn>nana</dfn> is also nice.
          Our Banana is nice, so <dfn>Bananice</dfn>
          And so it <dfn data-lt="I should be here too" id="doTheFoo">doTheFoo()</dfn>.
        </p>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const p = doc.getElementById("p");

    const [banana, nana] = p.querySelectorAll("dfn");
    expect(banana.dataset.export).toBeDefined();
    expect(banana.dataset.dfnType).toBe("interface");
    expect(nana.dataset.export).toBeDefined();
    expect(nana.dataset.dfnType).toBe("method");
    expect(nana.dataset.dfnFor).toBe("Banana");

    const doTheFoo = doc.getElementById("doTheFoo");
    expect(doTheFoo.dataset.export).toBeDefined();
    expect(doTheFoo.dataset.dfnFor).toBe("Banana");
    const { lt, localLt } = doTheFoo.dataset;
    const ltList = lt.split("|");
    const localLtList = localLt.split("|");
    expect(localLtList).toEqual([
      "Banana.doTheFoo",
      "Banana.doTheFoo()",
      "doTheFoo",
    ]);
    expect(ltList).toContain("I should be here too");
    expect(ltList).toContain("doTheFoo()");

    // Only generate method names with required arguments, in the right order.
    expect(ltList).not.toContain("doTheFoo(req1)");
    expect(ltList).not.toContain("doTheFoo(req2)");
    expect(ltList).not.toContain("doTheFoo(req2, req1)");

    expect(ltList).toContain("doTheFoo(req1, req2)");
    expect(ltList).toContain("doTheFoo(req1, req2, optional3)");
    expect(ltList).toContain("doTheFoo(req1, req2, optional3, optional4)");
    expect(ltList).toContain(
      "doTheFoo(req1, req2, optional3, optional4, variadicArg)"
    );
    // Make sure none of the local-lts are in the lt
    for (const localItem of localLtList) {
      expect(ltList).not.toContain(localItem);
    }

    // Check isFruit attribute is exported correctly when self defined
    const isFruitDfn = doc.getElementById("dom-banana-isfruit");
    expect(isFruitDfn.dataset.export).toBeDefined();
    expect(isFruitDfn.dataset.dfnFor).toBe("Banana");
    expect(isFruitDfn.dataset.localLt).toBe("Banana.isFruit");
    expect(isFruitDfn.dataset.lt).toBe("isFruit");

    // Check that selfDefined() method is also exported correctly...
    const selfDefinedDfn = doc.getElementById("dom-banana-selfdefined");
    expect(selfDefinedDfn.dataset.export).toBeDefined();
    expect(selfDefinedDfn.dataset.dfnFor).toBe("Banana");
    const expectedLocalLt = [
      "Banana.selfDefined",
      "Banana.selfDefined()",
      "selfDefined",
    ];
    const expectedLt = [
      "selfDefined()",
      "selfDefined(arg1)",
      "selfDefined(arg1, arg2)",
      "selfDefined(arg1, arg2, variadic)",
    ];
    for (const lt of expectedLt) {
      expect(selfDefinedDfn.dataset.lt.split("|")).toContain(lt);
    }
    for (const lt of expectedLocalLt) {
      expect(selfDefinedDfn.dataset.localLt.split("|")).toContain(lt);
    }
    // check that local/export lts are not in the wrong place
    for (const lt of expectedLt) {
      expect(selfDefinedDfn.dataset.localLt.split("|")).not.toContain(lt);
    }
    for (const lt of expectedLocalLt) {
      expect(selfDefinedDfn.dataset.lt.split("|")).not.toContain(lt);
    }
  });

  it("does not export partial IDL definitions", async () => {
    const body = `
      <section>
        <pre class="idl">
          partial interface Banana {
            undefined nana();
          };
        </pre>
        <p id="p">
          This partial interface <dfn>Banana</dfn> somehow requires
          a definition even if it's partial.
        </p>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const p = doc.getElementById("p");
    const banana = p.querySelector("dfn");
    expect(banana.dataset.export).not.toBeDefined();
  });
  it("autolinks partial definitions", async () => {
    const body = `
      <section data-dfn-for="EventInit">
        <p>
          <dfn>Banana</dfn>
          <dfn>itWorks</dfn>
        </p>
        <pre class="idl">
          // Local ref
          interface Banana {};
          // Local ref
          partial interface Banana {};
          // DOM spec
          partial interface mixin NavigatorID {};
          // Fetch spec
          partial interface Request {};
          // DOM spec
          partial dictionary EventInit {
            boolean itWorks;
          };
        </pre>
      </section>
    `;
    const ops = makeStandardOps({ xref: "web-platform" }, body);
    const doc = await makeRSDoc(ops);
    const [
      banana,
      bananaPartial,
      docOrShadowMixin,
      requestPartialInterface,
      eventInitDict, // skip testing boolean link (next line), tested elsewhere.
      ,
      itWorksMember,
    ] = doc.querySelectorAll(".idl span:not(.idlHeader) a");

    expect(banana.textContent).toBe("Banana");
    expect(banana.getAttribute("href")).toBe("#dom-banana");
    expect(banana.dataset.linkType).toBe("interface");
    expect(banana.classList).toContain("internalDFN");

    expect(bananaPartial.textContent).toBe("Banana");
    expect(bananaPartial.getAttribute("href")).toBe("#dom-banana");
    expect(bananaPartial.dataset.linkType).toBe("interface");
    expect(banana.classList).toContain("internalDFN");

    expect(docOrShadowMixin.textContent).toBe("NavigatorID");
    expect(docOrShadowMixin.dataset.xrefType).toBe("interface");
    expect(docOrShadowMixin.dataset.linkType).toBe("interface");
    expect(docOrShadowMixin.dataset.idl).toBe("partial");
    expect(docOrShadowMixin.dataset.title).toBe("NavigatorID");
    expect(docOrShadowMixin.href).toBe(
      "https://html.spec.whatwg.org/multipage/system-state.html#navigatorid"
    );

    expect(requestPartialInterface.textContent).toBe("Request");
    expect(requestPartialInterface.dataset.xrefType).toBe("interface");
    expect(requestPartialInterface.dataset.linkType).toBe("interface");
    expect(requestPartialInterface.dataset.idl).toBe("partial");
    expect(requestPartialInterface.dataset.title).toBe("Request");
    expect(requestPartialInterface.href).toBe(
      "https://fetch.spec.whatwg.org/#request"
    );

    expect(eventInitDict.textContent).toBe("EventInit");
    expect(eventInitDict.dataset.xrefType).toBe("dictionary");
    expect(eventInitDict.dataset.linkType).toBe("dictionary");
    expect(eventInitDict.dataset.idl).toBe("partial");
    expect(eventInitDict.dataset.title).toBe("EventInit");
    expect(eventInitDict.href).toBe(
      "https://dom.spec.whatwg.org/#dictdef-eventinit"
    );

    expect(itWorksMember.classList).toContain("internalDFN");
    expect(itWorksMember.getAttribute("href")).toBe("#dom-eventinit-itworks");
  });
  it("self-defining IDL", async () => {
    const body = `
      <section>
        <pre class="idl">
          interface RASAintShared {
            attribute DOMString layer;
          };
          enum TestEnum {""};
          partial interface TeaTime {};
        </pre>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const [it, attr, enumDfn, enumVal] = doc.querySelectorAll("pre dfn");

    expect(it.classList).not.toContain("respec-offending-element");
    expect(it.dataset.dfnType).toBe("interface");
    expect(it.dataset.export).toBe("");
    expect(it.id).toBe("dom-rasaintshared");

    expect(attr.dataset.dfnType).toBe("attribute");
    expect(attr.id).toBe("dom-rasaintshared-layer");

    expect(enumDfn.dataset.dfnType).toBe("enum");
    expect(enumDfn.id).toBe("dom-testenum");

    expect(enumVal.dataset.dfnType).toBe("enum-value");
    expect(enumVal.id).toBe("dom-testenum-the-empty-string");

    const [, tea] = doc.querySelectorAll(".respec-offending-element");
    expect(tea.textContent).toBe("TeaTime");
  });
  it("self-defining IDL with same member names", async () => {
    const body = `
      <section>
        <pre class="idl">
          dictionary Roselia {
            DOMString hikawa = "sayo";
          };
          dictionary PastelPalettes {
            DOMString hikawa = "hina";
          };
        </pre>
        <dfn>Roselia</dfn> and <dfn>PastelPalettes</dfn> are names of bands.
        <span id="links"><a>Roselia</a> <a>PastelPalettes</a> {{Roselia/hikawa}}</span>.
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const [member1, member2] = doc.querySelectorAll("pre dfn");
    expect(member1.dataset.dfnFor).toBe("Roselia");
    expect(member2.dataset.dfnFor).toBe("PastelPalettes");
    expect(member1.classList).not.toContain("respec-offending-element");
    expect(member2.classList).not.toContain("respec-offending-element");
    const [anchor1, anchor2, anchor3] = doc.querySelectorAll("#links a");
    expect(anchor1.getAttribute("href")).toBe("#dom-roselia");
    expect(anchor1.dataset.linkType).toBe("idl");
    expect(anchor2.getAttribute("href")).toBe("#dom-pastelpalettes");
    expect(anchor2.dataset.linkType).toBe("idl");
    expect(anchor3.getAttribute("href")).toBe("#dom-roselia-hikawa");
    expect(anchor3.dataset.linkType).toBe("idl");
  });
  it("marks a failing IDL block", async () => {
    const body = `
      <section>
        <pre class="idl" id="pre">
          interface Muscle {}
        </pre>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const pre = doc.getElementById("pre");

    expect(pre.classList).toContain("respec-offending-element");
  });
  it("validates IDL", async () => {
    const body = `
      <section>
        <pre class="idl" id="circle">
          interface Circle {};
        </pre>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const idl = doc.getElementById("circle");

    expect(idl.classList).toContain("respec-offending-element");
    expect(idl.title).toContain("Exposed");
  });
  it("validates across IDL", async () => {
    const body = `
      <section>
        <pre class="idl">
          dictionary Bread {
            DOMString type = "melon";
          };
        </pre>
        <pre class="idl">
          [Exposed=Window]
          interface Moka {
            undefined eat(optional Bread bread);
          };
        </pre>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const [idl1, idl2] = doc.getElementsByTagName("pre");

    expect(idl1.classList).not.toContain("respec-offending-element");
    expect(idl2.classList).toContain("respec-offending-element");
    expect(idl2.title).toContain("Optional dictionary");
  });
  it("checks that webidl is processed same as idl", async () => {
    const body = `
      <section>
        <pre class="webidl" id="dict-webidl">
          dictionary Test {};
        </pre>
      </section>
    `;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const target = doc.querySelector("#dict-webidl > code");
    // Remove the header, as we are not interested in it.
    const text = "dictionary Test {};";
    expect(target.textContent).toBe(text);

    expect(target.querySelectorAll(".idlDictionary")).toHaveSize(1);
    expect(target.querySelector(".idlID").textContent).toBe("Test");
  });
  it("correctly XML escapes IDL errors", async () => {
    const body = `
    <section id="sotd">
      <h2>.</h2>
      <p>.</p>
      <pre class="idl">
      [Exposed=Window]
      interface Foo {
        Promise&lt;void&gt; doTheFoo();
      };
      </pre>
    </section>`;
    const ops = makeStandardOps(null, body);
    const doc = await makeRSDoc(ops);
    const { errors } = doc.respec;
    // There are two errors, one for "void" not being a thing anymore
    // and one for void not being xref'ed
    expect(errors).toHaveSize(2);
    const error = errors.find(err => err.plugin === "core/webidl");
    expect(error.details).toContain("Promise&lt;void&gt;");
  });
});
