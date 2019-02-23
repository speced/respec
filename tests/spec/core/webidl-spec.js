"use strict";
describe("Core - WebIDL", () => {
  afterAll(flushIframes);
  /** @type {Document} */
  let doc;
  beforeAll(async () => {
    const ops = makeStandardOps();
    doc = await makeRSDoc(ops, "spec/core/webidl.html");
  });

  it("handles record types", () => {
    const idl = doc.querySelector("#records pre");
    expect(idl).toBeTruthy(idl);
    expect(idl.querySelector(".idlType:first-child").textContent).toEqual(
      "\n  record<DOMString, USVString>"
    );
    expect(idl.querySelector(".idlMember .idlName").textContent).toEqual(
      "pass"
    );
  });

  it("links standardized IDL types to WebIDL spec", () => {
    const idl = doc.querySelector("#linkToIDLSpec>div>pre");
    // [Constructor(sequence<DOMString> methodData), SecureContext]
    const sequences = idl.querySelectorAll(`a[href$="#idl-sequence"]`);
    expect(sequences.length).toEqual(1);
    const sequence = sequences[0];

    // sequence<DOMString>
    expect(sequence.nextElementSibling.localName).toEqual("a");
    expect(sequence.nextElementSibling.href.endsWith("#idl-DOMString")).toBe(
      true
    );

    // readonly attribute DOMString? aBoolAttribute;
    const attr = doc.getElementById("idl-def-linkingtest-aboolattribute");
    const domString = attr.querySelector("a");
    expect(domString.textContent).toEqual("DOMString");
    expect(domString.href.endsWith("#idl-DOMString")).toBe(true);

    // Promise&lt;void> returnsPromise(unsigned long long argument);
    const returnsPromise = idl.querySelector(`*[data-title="returnsPromise"]`);
    const [promiseLink, unsignedLongLink] = returnsPromise.querySelectorAll(
      "a"
    );
    expect(promiseLink.textContent).toEqual("Promise");
    expect(promiseLink.href.endsWith("#idl-promise")).toBe(true);
    expect(unsignedLongLink.textContent).toEqual("unsigned long long");
    expect(unsignedLongLink.href.endsWith("#idl-unsigned-long-long")).toBe(
      true
    );
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
    const nameQuery = "span.idlName a";
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
      Array.from(mapLike.querySelectorAll("a")).every(
        a => a.getAttribute("href") === "#dom-similarlynamed"
      )
    ).toBeTruthy();
  });

  it("links to fully qualified method names", () => {
    const t1 = new URL(doc.getElementById("fullyQualifiedNoParens-1").href)
      .hash;
    expect(t1).toEqual("#dom-parenthesistest-fullyqualifiednoparens");

    const t2 = new URL(doc.getElementById("fullyQualifiedNoParens-2").href)
      .hash;
    expect(t2).toEqual("#dom-parenthesistest-fullyqualifiednoparens");

    const t3 = new URL(doc.getElementById("fullyQualifiedNoParens-3").href)
      .hash;
    expect(t3).toEqual("#dom-parenthesistest-fullyqualifiednoparens");

    const t4 = new URL(doc.getElementById("fullyQualifiedNoParens-4").href)
      .hash;
    expect(t4).toEqual("#dom-parenthesistest-fullyqualifiednoparens");
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
        expect(elem.firstElementChild.localName).toEqual("code");
        expect(elem.textContent).toEqual(`${methodName}()`);
        expect(elem.id).toEqual(`dom-parenthesistest-${id}`);
        expect(elem.dataset.dfnType).toEqual("dfn");
        expect(elem.dataset.dfnFor).toEqual("parenthesistest");
        expect(elem.dataset.idl).toEqual("operation");
        // corresponding link
        const aElem = section.querySelector(
          `pre a[href="#dom-parenthesistest-${id}"]`
        );
        expect(aElem).toBeTruthy();
        expect(aElem.textContent).toEqual(methodName);
      });
    const smokeTest = doc.getElementById("dom-parenthesistest-noparens");
    expect(smokeTest).toBeTruthy();
    expect(smokeTest.firstElementChild.localName).toEqual("code");
    expect(smokeTest.textContent).toEqual("noParens");
    // corresponding link
    const aElem = section.querySelector(
      `pre a[href="#dom-parenthesistest-noparens"]`
    );
    expect(aElem).toBeTruthy();
    expect(aElem.textContent).toEqual("noParens");
  });
  it("should handle interfaces", () => {
    let target = doc.getElementById("if-basic");
    let text = "interface SuperStar {};";
    expect(target.textContent).toEqual(text);
    expect(target.querySelectorAll(".idlInterface").length).toEqual(1);
    expect(target.querySelector(".idlID").textContent).toEqual("SuperStar");

    target = doc.getElementById("if-extended-attribute");
    text = `[Something, Constructor()] ${text}`;
    expect(target.textContent).toEqual(text);
    const extAttrs = target.querySelectorAll(".extAttr");
    expect(extAttrs[0].textContent).toEqual("Something");
    expect(extAttrs[1].textContent).toEqual("Constructor()");

    target = doc.getElementById("if-identifier-list");
    text = "[Global=Window, Exposed=(Window,Worker)] interface SuperStar {};";
    const rhs = target.querySelectorAll(".extAttr");
    expect(target.textContent).toEqual(text);
    expect(rhs[0].textContent).toEqual("Global=Window");
    expect(rhs[1].textContent).toEqual("Exposed=(Window,Worker)");

    target = doc.getElementById("if-inheritance");
    text = "interface SuperStar : HyperStar {};";
    expect(target.textContent).toEqual(text);
    expect(target.querySelector(".idlSuperclass").textContent).toEqual(
      "HyperStar"
    );

    target = doc.getElementById("if-partial");
    text = "partial interface SuperStar {};";
    expect(target.textContent).toEqual(text);

    target = doc.getElementById("if-callback");
    text = "callback interface SuperStar {};";
    expect(target.textContent).toEqual(text);

    target = doc.getElementById("if-mixin");
    text = "interface mixin SuperStar {};";
    expect(target.textContent).toEqual(text);

    target = doc.getElementById("if-partial-mixin");
    text = "partial interface mixin SuperStar {};";
    expect(target.textContent).toEqual(text);

    target = doc.getElementById("if-doc");
    const interfaces = target.querySelectorAll(".idlInterface");
    expect(
      interfaces[0].querySelector(".idlID a").getAttribute("href")
    ).toEqual("#dom-docinterface");
    expect(
      interfaces[1].querySelector(".idlID a").getAttribute("href")
    ).toEqual("#dom-docisnotcasesensitive");
    expect(interfaces[0].id).toEqual("idl-def-docinterface");
    expect(interfaces[1].id).toEqual("idl-def-docisnotcasesensitive");
    expect(interfaces[2].id).toEqual("idl-def-undocinterface");
    expect(interfaces[2].querySelector(".idlID a")).toBeNull();
    const namespace = target.querySelector(".idlNamespace");
    expect(namespace.querySelector(".idlID a").getAttribute("href")).toEqual(
      "#dom-afterglow"
    );
  });

  it("should handle constructors", () => {
    let target = doc.getElementById("ctor-basic");
    let text =
      "[Something,\n" +
      " Constructor,\n" +
      " Constructor(boolean bar, sequence<double> foo, Promise<double> blah)]\n" +
      "interface SuperStar {};";
    expect(target.textContent).toEqual(text);
    const ctors = target.getElementsByClassName("extAttr");
    expect(ctors.length).toEqual(3);
    const ctor = ctors[2];
    expect(ctor.querySelector("a").textContent).toEqual("Constructor");
    const params = [...ctor.getElementsByClassName("idlType")];
    expect(params.length).toEqual(3);
    expect(
      params.filter(p => p.textContent.includes("sequence")).length
    ).toEqual(1);
    expect(
      params.filter(p => p.textContent.includes("Promise")).length
    ).toEqual(1);
    expect(params[0].textContent).toEqual("boolean");

    target = doc.getElementById("ctor-noea");
    text = "[Constructor] interface SuperStar {};";
    expect(target.textContent).toEqual(text);
  });

  it("should handle named constructors", () => {
    const target = doc.getElementById("namedctor-basic");
    const text =
      "[Something,\n" +
      " NamedConstructor=Sun(),\n" +
      " NamedConstructor=Sun(boolean bar, Date foo)]\n" +
      "interface SuperStar {};";
    expect(target.textContent).toEqual(text);
    const ctors = target.getElementsByClassName("extAttr");
    expect(ctors.length).toEqual(3);
    const ctor = ctors[2];
    expect(ctor.textContent).toEqual(
      "NamedConstructor=Sun(boolean bar, Date foo)"
    );
    const params = [...ctor.getElementsByClassName("idlType")];
    expect(params.length).toEqual(2);
    expect(params.filter(p => p.textContent.includes("Date")).length).toEqual(
      1
    );
    expect(params[0].textContent).toEqual("boolean");
  });

  it("should handle constants", () => {
    const target = doc.getElementById("const-basic");
    const text =
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
      "\n" +
      "  // 14\n" +
      "  const boolean? why = false;\n" +
      "  // 15\n" +
      "  const boolean? notSo = null;\n" +
      "  // 16\n" +
      "  const short inf = Infinity;\n" +
      "  // 17\n" +
      "  const short mininf = -Infinity;\n" +
      "  // 18\n" +
      "  const short cheese = NaN;\n" +
      "  // 19\n" +
      "  [Something] const short extAttr = NaN;\n" +
      "};";
    expect(target.textContent).toEqual(text);
    const consts = [...target.getElementsByClassName("idlConst")];
    expect(consts.length).toEqual(19);
    const const1 = target.querySelector(".idlConst");
    expect(const1.querySelector(".idlType").textContent).toEqual(" boolean");
    expect(const1.querySelector(".idlName").textContent).toEqual("test");
    expect(
      consts[consts.length - 1].querySelectorAll(".extAttr").length
    ).toEqual(1);

    // Links and IDs.
    expect(
      consts
        .find(c => c.textContent.includes("rambaldi"))
        .querySelector(".idlName a")
        .getAttribute("href")
    ).toEqual("#dom-consttest-rambaldi");
    expect(
      consts.find(c => c.textContent.includes("rambaldi")).getAttribute("id")
    ).toEqual("idl-def-consttest-rambaldi");
    expect(
      consts
        .find(c => c.textContent.includes("why"))
        .querySelector(".idlName a")
        .getAttribute("href")
    ).toEqual("#dom-consttest-why");
    expect(
      consts
        .find(c => c.textContent.includes("inf"))
        .querySelector(".idlName a")
        .getAttribute("href")
    ).toEqual("#dom-consttest-inf");
    expect(
      consts
        .find(c => c.textContent.includes("ationDevice"))
        .querySelector(".idlName a")
    ).toBeNull();
  });

  it("should handle attributes", () => {
    const target = doc.getElementById("attr-basic");
    const text = `interface AttrBasic {
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
    expect(target.textContent).toEqual(text);
    const attrs = [...target.getElementsByClassName("idlAttribute")];
    expect(attrs.length).toEqual(9);
    const at = attrs[0];
    expect(at.querySelector(".idlType").textContent).toEqual(" DOMString");
    expect(at.querySelector(".idlName").textContent).toEqual("regular");
    const ro = attrs[2];
    expect(ro.querySelector(".idlName").textContent).toEqual("_readonly");
    const frozen = attrs[6];
    expect(frozen.querySelector(".idlType").textContent).toEqual(
      " FrozenArray<DOMString>"
    );
    const promise = attrs[7];
    expect(promise.querySelector(".idlType").textContent).toEqual(
      " Promise<DOMString>"
    );
    expect(
      attrs.find(c => c.textContent.includes("_readonly")).getAttribute("id")
    ).toEqual("idl-def-attrbasic-readonly");
    expect(
      attrs
        .find(c => c.textContent.includes("regular"))
        .querySelector(".idlName a")
        .getAttribute("href")
    ).toEqual("#dom-attrbasic-regular");
    expect(
      attrs
        .find(c => c.textContent.includes("alist"))
        .querySelector(".idlName a")
    ).toBeNull();

    const performanceInterfaceLink = Array.from(
      target.querySelectorAll("a")
    ).find(({ textContent }) => textContent === "Performance");
    expect(performanceInterfaceLink).toBeTruthy();
    expect(performanceInterfaceLink.getAttribute("href")).toEqual(
      "#dfn-performance"
    );

    const performanceAttrLink = Array.from(target.querySelectorAll("a")).find(
      ({ textContent }) => textContent === "performance"
    );
    expect(performanceAttrLink).toBeTruthy();
    expect(performanceAttrLink.getAttribute("href")).toEqual(
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

  it("should handle operations", () => {
    const target = doc.getElementById("meth-basic");
    const text = `interface MethBasic {
  // 1
  void basic();
  // 2
  [Something] void ext();
  // 3
  unsigned long long ull(short s, short n);
  // 3.5
  SuperStar? ull();
  // 5
  getter float ();
  // 6
  getter float withName ();
  // 7
  setter void ();
  // 8
  setter void named ();
  // 9
  static Promise<RTCCertificate>  generateCertificate(AlgorithmIdentifier keygenAlgorithm);
  // 10
  stringifier DOMString identifier();
  // 11
  stringifier DOMString ();
  // 12
  stringifier;
  Promise<void> complete(optional PaymentComplete result = "unknown");
  Promise<void> another(optional  /*trivia*/  PaymentComplete result = "unknown");
  Performance performance();
};`;
    expect(target.textContent).toEqual(text);
    const methods = [...target.getElementsByClassName("idlMethod")];
    expect(methods.length).toEqual(15);
    expect(target.getElementsByClassName("idlName").length).toEqual(11);
    const first = methods[0];
    expect(first.querySelector(".idlType").textContent).toEqual(
      "\n  // 1\n  void"
    );
    expect(first.querySelector(".idlName").textContent).toEqual("basic");
    expect(
      methods
        .find(m => m.textContent.includes("SuperStar?"))
        .querySelector(".idlType a").textContent
    ).toEqual("SuperStar");

    // Links and IDs.
    const ulls = methods
      .filter(m => m.textContent.includes("ull"))
      .map(m => m.querySelector(".idlName a").getAttribute("href"));
    expect(ulls[0]).toEqual("#dom-methbasic-ull");
    expect(ulls[ulls.length - 1]).toEqual("#dom-methbasic-ull!overload-1");
    expect(
      methods
        .find(m => m.textContent.includes("withName"))
        .querySelector(".idlName a")
    ).toBeNull();

    const performanceTypeLink = Array.from(target.querySelectorAll("a")).find(
      ({ textContent }) => textContent === "Performance"
    );
    expect(performanceTypeLink).toBeTruthy();
    expect(performanceTypeLink.getAttribute("href")).toEqual(
      "#dfn-performance"
    );
    const performanceMethodLink = Array.from(target.querySelectorAll("a")).find(
      ({ textContent }) => textContent === "performance"
    );
    expect(performanceMethodLink).toBeTruthy();
    expect(performanceMethodLink.getAttribute("href")).toEqual(
      "#dom-methbasic-performance"
    );
  });

  it("should handle iterable-like interface member declarations", () => {
    const elem = doc.getElementById("iterable-like");
    expect(elem.getElementsByClassName("idlIterable").length).toEqual(2);
    expect(elem.getElementsByClassName("idlMaplike").length).toEqual(1);
    expect(elem.getElementsByClassName("idlSetlike").length).toEqual(1);
  });

  it("outputs map/set-like interface member declarations", () => {
    const { textContent } = doc.getElementById("map-set-readonly");
    const expected = `
interface MapLikeInterface {
  maplike<MapLikeInterface, MapLikeInterface>;
};
interface ReadOnlyMapLike {
  readonly maplike<ReadOnlyMapLike, ReadOnlyMapLike>;
};
interface SetLikeInterface {
  setlike<SetLikeInterface>;
};
interface ReadOnlySetLike {
  readonly setlike<ReadOnlySetLike>;
};`.trim();
    expect(textContent).toBe(expected);
  });

  it("should handle comments", () => {
    const target = doc.getElementById("comments-basic");
    const text =
      "interface SuperStar {\n" +
      "  // This is a comment\n" +
      "  // over two lines.\n" +
      "  /* This one\n" +
      "     has\n" +
      "     three. */\n" +
      "  \n" +
      "};";
    expect(target.textContent).toEqual(text);
    expect(target.getElementsByClassName("idlSectionComment").length).toEqual(
      1
    );
  });

  it("should handle dictionaries", () => {
    let target = doc.getElementById("dict-basic");
    let text = "dictionary SuperStar {};";
    expect(target.textContent).toEqual(text);
    expect(target.querySelectorAll(".idlDictionary").length).toEqual(1);
    expect(target.querySelector(".idlID").textContent).toEqual("SuperStar");

    target = doc.getElementById("dict-inherit");
    text = "dictionary SuperStar : HyperStar {};";
    expect(target.textContent).toEqual(text);
    expect(target.querySelector(".idlSuperclass").textContent).toEqual(
      "HyperStar"
    );

    target = doc.getElementById("dict-fields");
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
    expect(target.textContent).toEqual(text);
    const members = target.querySelectorAll(".idlMember");
    expect(members.length).toEqual(9);
    const member = members[0];
    expect(member.querySelector(".idlType").textContent).toEqual(
      "\n  // 1\n  DOMString"
    );
    expect(member.querySelector(".idlName").textContent).toEqual("value");

    target = doc.getElementById("dict-required-fields");
    text =
      "dictionary SuperStar {\n" +
      "  required DOMString value;\n" +
      "  DOMString optValue;\n" +
      "};";
    expect(target.textContent).toEqual(text);

    // Links and IDs.
    const dictDocTest = doc
      .getElementById("dict-doc")
      .querySelector(".idlDictionary");
    expect(dictDocTest.querySelector(".idlID a").getAttribute("href")).toEqual(
      "#dom-dictdoctest"
    );
    expect(dictDocTest.getAttribute("id")).toEqual("idl-def-dictdoctest");
    const mems = [...dictDocTest.querySelectorAll(".idlMember")];
    const dictDocField = mems.find(m => m.textContent.includes("dictDocField"));
    expect(
      dictDocField.querySelector(".idlName a").getAttribute("href")
    ).toEqual("#dom-dictdoctest-dictdocfield");
    expect(
      mems
        .find(m => m.textContent.includes("otherField"))
        .querySelector(".idlName a")
        .getAttribute("href")
    ).toEqual("#dom-dictdoctest-otherfield");
    expect(dictDocField.getAttribute("id")).toEqual(
      "idl-def-dictdoctest-dictdocfield"
    );
    expect(
      mems
        .find(m => m.textContent.includes("undocField"))
        .querySelector(".idlName a")
    ).toBeNull();
  });

  it("handles multiple dictionaries", async () => {
    const idl = doc.getElementById("multiple-dictionaries");
    const expected = `
dictionary OneThing {
  int x;
};


partial dictionary AnotherThing {
  int y;
};`.trim();
    expect(idl.textContent).toEqual(expected);
    expect(idl.querySelector(".idlSectionComment")).toBeNull();
  });

  it("uniquely links to enum values", () => {
    const target = doc.getElementById("multipleEnums");
    const idlLinks = target.querySelectorAll("a[data-link-for]");
    expect(idlLinks.length).toBe(2);
    const [a1, a2] = idlLinks;
    expect(a1.getAttribute("href")).toBe("#dom-test1-enum");
    expect(a2.getAttribute("href")).toBe("#dom-test2-enum");
    expect(doc.getElementById("dom-test1-enum")).toBeTruthy();
    expect(doc.getElementById("dom-test2-enum")).toBeTruthy();
  });

  it("handles enumerations", () => {
    const target = doc.getElementById("enum-basic");
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
    expect(target.textContent).toEqual(text);
    expect(target.querySelector(".idlEnum")).toBeTruthy();
    expect(target.querySelector(".idlID").textContent).toEqual("EnumBasic");
    expect(target.querySelectorAll(".idlEnumItem").length).toEqual(4);
    expect(target.querySelector(".idlEnumItem").textContent).toEqual('"one"');
    expect(
      target.querySelector("a[href='#dom-enumbasic-white-space']")
    ).toBeTruthy();
    // Links and IDs.
    expect(target.querySelector(".idlID a").getAttribute("href")).toEqual(
      "#dom-enumbasic"
    );
    expect(doc.getElementById("idl-def-enumbasic")).toBeTruthy();
  });

  it("should handle enumeration value definitions", () => {
    const section = doc.getElementById("enumerations");
    expect(
      [...section.getElementsByTagName("dfn")]
        .find(el => el.textContent.includes("one"))
        .getAttribute("id")
    ).toEqual("dom-enumbasic-one");
    expect(
      [...section.querySelectorAll("p[data-link-for] a")]
        .find(el => el.textContent.includes("one"))
        .getAttribute("href")
    ).toEqual("#dom-enumbasic-one");
    expect(
      [...section.querySelectorAll("#enum-ref-without-link-for a")]
        .find(el => el.textContent.includes("one"))
        .getAttribute("href")
    ).toEqual("#dom-enumbasic-one");
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
[Constructor(X x, optional Y y, /*trivia*/ Z y)]
interface Foo {
  void foo(X x, optional Y y, /*trivia*/ optional Z z);
};
callback CallBack = Z? (X x, optional Y y, /*trivia*/ optional Z z);
    `.trim();
    const idlElem = doc.getElementById("optional-trivia");
    expect(idlElem.textContent).toEqual(expected);
    const trivaComments = idlElem.querySelectorAll("span.idlSectionComment");
    expect(trivaComments.length).toEqual(3);
  });

  it("should handle callbacks", () => {
    let target = doc.getElementById("cb-basic");
    let text = "callback SuperStar = void();";
    expect(target.textContent).toEqual(text);
    expect(target.getElementsByClassName("idlCallback").length).toEqual(1);
    expect(target.querySelector(".idlID").textContent).toEqual("SuperStar");
    expect(target.querySelector(".idlType").textContent).toEqual(" void");

    target = doc.getElementById("cb-less-basic");
    text = "callback CbLessBasic = unsigned long long?(optional any value);";
    expect(target.textContent).toEqual(text);
    expect(target.querySelector(".idlType").textContent).toEqual(
      " unsigned long long?"
    );
    let prm = target.querySelectorAll(".idlParamName");
    expect(prm.length).toEqual(1);
    expect(target.querySelectorAll(".idlType")[1].textContent).toEqual(" any");
    expect(prm[0].textContent).toEqual("value");

    // Links and IDs.
    expect(
      target.querySelector("a[href='#dom-cblessbasic']").textContent
    ).toEqual("CbLessBasic");
    expect(target.querySelector(".idlCallback").getAttribute("id")).toEqual(
      "idl-def-cblessbasic"
    );

    target = doc.getElementById("cb-mult-args");
    text = "callback SortCallback = void (any a, any b);";
    expect(target.textContent).toEqual(text);
    prm = target.querySelectorAll(".idlParamName");
    expect(prm.length).toEqual(2);
    const idlTypes = target.getElementsByClassName("idlType");
    expect(idlTypes[1].textContent).toEqual("any");
    expect(prm[0].textContent).toEqual("a");
    expect(idlTypes[2].textContent).toEqual(" any");
    expect(prm[1].textContent).toEqual("b");
  });

  it("should handle typedefs", () => {
    let target = doc.getElementById("td-basic");
    let text = "typedef DOMString string;";
    expect(target.textContent).toEqual(text);
    expect(target.querySelectorAll(".idlTypedef").length).toEqual(1);
    expect(target.querySelector(".idlID").textContent).toEqual("string");
    expect(target.querySelector(".idlType").textContent).toEqual(" DOMString");

    target = doc.getElementById("td-less-basic");
    text = "typedef unsigned long long? tdLessBasic;";
    expect(target.textContent).toEqual(text);

    // Links and IDs.
    expect(
      target.querySelector(".idlID").children[0].getAttribute("href")
    ).toEqual("#dom-tdlessbasic");
    expect(target.querySelector(".idlTypedef").id).toEqual(
      "idl-def-tdlessbasic"
    );

    target = doc.getElementById("td-extended-attribute");
    text =
      "typedef ([Clamp] unsigned long or ConstrainULongRange) ConstrainULong;";
    expect(target.textContent).toEqual(text);

    target = doc.getElementById("td-union-extended-attribute");
    text =
      "typedef [Clamp] (unsigned long or ConstrainULongRange) ConstrainULong2;";
    expect(target.textContent).toEqual(text);

    target = doc.getElementById("td-trivia");
    text =
      "/* test1 */ typedef /* test2 */ [Clamp] /* test3 */ (/* test4 */ unsigned long /* test5 */ or /* test6 */ ConstrainULongRange /* test7 */ ) /* test8 */ ConstrainULong3 /* test9 */;";
    expect(target.textContent).toEqual(text);
  });

  it("should handle includes", () => {
    let target = doc.getElementById("incl-basic");
    let text = "Window includes Breakable;";
    expect(target.textContent).toEqual(text);
    expect(target.getElementsByClassName("idlIncludes").length).toEqual(1);

    target = doc.getElementById("incl-less-basic");
    text = `[Something]${text}`;
    expect(target.textContent).toEqual(text);
  });

  it("should link documentation", () => {
    const section = doc.getElementById("documentation");
    const target = doc.getElementById("doc-iface");

    expect(
      target.querySelector(".idlName a[href='#dom-documented-docstring']")
        .textContent
    ).toEqual("docString");
    expect(
      section.querySelector("dfn#dom-documented-docstring").textContent
    ).toEqual("docString");

    expect(
      section.querySelector("dfn#dfn-some-generic-term").textContent
    ).toEqual("Some generic term");
    expect(
      section.querySelector("a[href='#dfn-some-generic-term']").textContent
    ).toEqual("Some generic term");
    expect(
      section.querySelector(
        "p[data-link-for] a[href='#dom-documented-docstring']"
      ).textContent
    ).toEqual("docString");
    const notDefinedAttr = target.querySelectorAll(
      ".idlAttribute#idl-def-documented-notdefined .idlName"
    );
    expect(notDefinedAttr.length).toEqual(1);
    expect(notDefinedAttr[0].getElementsByTagName("a").length).toEqual(0);
    expect(notDefinedAttr[0].textContent).toEqual("notDefined");
    expect(
      section.querySelector(
        "p[data-link-for] a[href='#idl-def-documented-notdefined']"
      ).textContent
    ).toEqual("notDefined");

    const definedElsewhere = section.querySelector(
      "dfn#dom-documented-definedelsewhere"
    );
    const linkFromElsewhere = section.querySelector(
      "p:not([data-link-for]) a[href='#dom-documented-docstring']"
    );
    expect(definedElsewhere.textContent).toEqual("Documented.definedElsewhere");
    expect(
      target.querySelector(
        ".idlName a[href='#dom-documented-definedelsewhere']"
      ).textContent
    ).toEqual("definedElsewhere");
    expect(linkFromElsewhere.textContent).toEqual("Documented.docString");

    expect(
      section.querySelector("#without-link-for a[href='#idl-def-documented']")
        .textContent
    ).toEqual("Documented");
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
    expect(defaultLink.hash).toEqual("#Default");
    expect(objectLink.hash).toEqual("#idl-object");
    expect(toJSONLink.hash).toEqual("#default-tojson-operation");
  });
  it("allows toJSON() to be defined in spec", () => {
    const elem = doc.getElementById("DefinedToJson");
    const [defaultLink, objectLink, toJSONLink] = Array.from(
      elem.querySelectorAll("[data-title='toJSON'] a")
    ).map(elem => new URL(elem.href));
    expect(defaultLink.hash).toEqual("#Default");
    expect(objectLink.hash).toEqual("#idl-object");
    expect(toJSONLink.pathname).toEqual(doc.location.pathname);
    expect(toJSONLink.origin).toEqual(doc.location.origin);
    expect(toJSONLink.hash).toEqual("#dom-definedtojson-tojson");
  });
  it("puts code elements around both IDL definitions and links", () => {
    const things = [
      ...document.querySelectorAll("#coded-things > a, #coded-things > dfn"),
    ];
    expect(things.every(elem => elem.parentElement.localName === "code")).toBe(
      true
    );
    const linksToTheFoo = doc.querySelectorAll(
      "#coded-things a[href='#dom-codedthings-dothefoo']"
    );
    expect(linksToTheFoo.length).toBe(4);

    const linkToBarBarAttr = doc.querySelectorAll(
      "#coded-things a[href='#dom-codedthings-barbar']"
    );
    expect(linkToBarBarAttr.length).toBe(2);
  });
  it("sets the IDL type for each type of IDL token", () => {
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
});
