"use strict";
describe("Core - WebIDL", function() {
  afterAll(flushIframes);
  let doc;
  beforeAll(async () => {
    const ops = makeStandardOps();
    doc = await makeRSDoc(ops, () => { }, "spec/core/webidl.html");
  });

  it("handles record types", done => {
    const idl = doc.querySelector("#records pre");
    expect(idl).toBeTruthy(idl);
    expect(idl.querySelector(".idlMemberType:first-child").textContent).toEqual(
      "\n  record<DOMString, USVString>"
    );
    expect(idl.querySelector(".idlMemberName").textContent).toEqual("pass");
    done();
  });

  it("links standardized IDL types to WebIDL spec", done => {
    const idl = doc.querySelector("#linkToIDLSpec>div>pre");
    // [Constructor(sequence<DOMString> methodData), SecureContext]
    const sequences = idl.querySelectorAll(`a[href$="#idl-sequence"]`);
    expect(sequences.length).toEqual(1);
    const sequence = sequences[0];

    //sequence<DOMString>
    expect(sequence.nextElementSibling.localName).toEqual("a");
    expect(sequence.nextElementSibling.href.endsWith("#idl-DOMString")).toBe(
      true
    );

    // readonly attribute DOMString? aBoolAttribute;
    const attr = idl.querySelector("#idl-def-linkingtest-aboolattribute");
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
    done();
  });

  it("links to fully qualified method names", done => {
    var t1 = new URL(doc.getElementById("fullyQualifiedNoParens-1").href).hash;
    expect(t1).toEqual("#dom-parenthesistest-fullyqualifiednoparens");

    var t2 = new URL(doc.getElementById("fullyQualifiedNoParens-2").href).hash;
    expect(t2).toEqual("#dom-parenthesistest-fullyqualifiednoparens");

    var t3 = new URL(doc.getElementById("fullyQualifiedNoParens-3").href).hash;
    expect(t3).toEqual("#dom-parenthesistest-fullyqualifiednoparens");

    var t4 = new URL(doc.getElementById("fullyQualifiedNoParens-4").href).hash;
    expect(t4).toEqual("#dom-parenthesistest-fullyqualifiednoparens");

    done();
  });

  it("links simple method names and types", done => {
    const section = doc.querySelector("#sec-parenthesis-method");
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
        expect(elem.dataset.idl).toEqual("");
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
    done();
  });
  it("should handle interfaces", function(done) {
    var $target = $("#if-basic", doc);
    var text = "interface SuperStar {};";
    expect($target.text()).toEqual(text);
    expect($target.find(".idlInterface").length).toEqual(1);
    expect($target.find(".idlInterfaceID").text()).toEqual("SuperStar");

    $target = $("#if-extended-attribute", doc);
    text = "[Something, Constructor()] " + text;
    expect($target.text()).toEqual(text);
    expect($target.find(".extAttr").text()).toEqual("Something");
    expect($target.find(".idlCtor").text()).toEqual("Constructor()");

    $target = $("#if-identifier-list", doc);
    text = "[Global=Window, Exposed=(Window,Worker)] interface SuperStar {};";
    expect($target.text()).toEqual(text);
    expect($target.find(".extAttrRhs").first().text()).toEqual("Window");
    expect($target.find(".extAttrRhs").last().text()).toEqual(
      "(Window,Worker)"
    );

    $target = $("#if-inheritance", doc);
    text = "interface SuperStar : HyperStar {};";
    expect($target.text()).toEqual(text);
    expect($target.find(".idlSuperclass").text()).toEqual("HyperStar");

    $target = $("#if-partial", doc);
    text = "partial interface SuperStar {};";
    expect($target.text()).toEqual(text);

    $target = $("#if-callback", doc);
    text = "callback interface SuperStar {};";
    expect($target.text()).toEqual(text);

    $target = $("#if-mixin", doc);
    text = "interface mixin SuperStar {};";
    expect($target.text()).toEqual(text);

    $target = $("#if-partial-mixin", doc);
    text = "partial interface mixin SuperStar {};";
    expect($target.text()).toEqual(text);

    $target = $("#if-doc", doc);
    expect(
      $target.find(":contains('DocInterface')").filter("a").attr("href")
    ).toEqual("#dom-docinterface");
    expect(
      $target
        .find(":contains('DocIsNotCaseSensitive')")
        .filter("a")
        .attr("href")
    ).toEqual("#dom-docisnotcasesensitive");
    expect($target.find(".idlInterface")[0].id).toEqual("idl-def-docinterface");
    expect($target.find(".idlInterface")[1].id).toEqual(
      "idl-def-docisnotcasesensitive"
    );
    expect($target.find(".idlInterface")[2].id).toEqual(
      "idl-def-undocinterface"
    );
    expect(
      $target.find(":contains('UndocInterface')").filter("a").length
    ).toEqual(0);
    done();
  });

  it("should handle constructors", function(done) {
    var $target = $("#ctor-basic", doc);
    var text =
      "[Something,\n" +
      " Constructor,\n" +
      " Constructor(boolean bar, sequence<double> foo, Promise<double> blah)]\n" +
      "interface SuperStar {};";
    expect($target.text()).toEqual(text);
    expect($target.find(".idlCtor").length).toEqual(2);
    var $ctor1 = $target.find(".idlCtor").last();
    expect($ctor1.find(".extAttrName").text()).toEqual("Constructor");
    expect($ctor1.find(".idlParam").length).toEqual(3);
    expect($ctor1.find(".idlParam:contains('sequence')").length).toEqual(1);
    expect($ctor1.find(".idlParam:contains('Promise')").length).toEqual(1);
    expect(
      $ctor1.find(".idlParam").first().find(".idlParamType").text()
    ).toEqual("boolean");

    $target = $("#ctor-noea", doc);
    text = "[Constructor] interface SuperStar {};";
    expect($target.text()).toEqual(text);
    done();
  });

  it("should handle named constructors", function(done) {
    var $target = $("#namedctor-basic", doc);
    var text =
      "[Something,\n" +
      " NamedConstructor=Sun(),\n" +
      " NamedConstructor=Sun(boolean bar, Date foo)]\n" +
      "interface SuperStar {};";
    expect($target.text()).toEqual(text);
    expect($target.find(".idlCtor").length).toEqual(2);
    var $ctor1 = $target.find(".idlCtor").last();
    expect($ctor1.find(".extAttrRhs").text()).toEqual("Sun");
    expect($ctor1.find(".idlParam").length).toEqual(2);
    expect($ctor1.find(".idlParam:contains('Date')").length).toEqual(1);
    expect(
      $ctor1.find(".idlParam").first().find(".idlParamType").text()
    ).toEqual("boolean");
    done();
  });

  it("should handle constants", function(done) {
    var $target = $("#const-basic", doc);
    var text =
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
    expect($target.text()).toEqual(text);
    expect($target.find(".idlConst").length).toEqual(19);
    var $const1 = $target.find(".idlConst").first();
    expect($const1.find(".idlConstType").text()).toEqual(" boolean");
    expect($const1.find(".idlConstName").text()).toEqual("test");
    expect($const1.find(".idlConstValue").text()).toEqual("true");
    expect($target.find(".idlConst").last().find(".extAttr").length).toEqual(1);

    // Links and IDs.
    expect(
      $target.find(":contains('rambaldi')").filter("a").attr("href")
    ).toEqual("#dom-consttest-rambaldi");
    expect(
      $target.find(":contains('rambaldi')").parents(".idlConst").attr("id")
    ).toEqual("idl-def-consttest-rambaldi");
    expect($target.find(":contains('why')").filter("a").attr("href")).toEqual(
      "#dom-consttest-why"
    );
    expect($target.find(":contains('inf')").filter("a").attr("href")).toEqual(
      "#dom-consttest-inf"
    );
    expect($target.find(":contains('ationDevice')").filter("a").length).toEqual(
      0
    );
    done();
  });

  it("should handle attributes", function() {
    var $target = $("#attr-basic", doc);
    var text =`interface AttrBasic {
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
};`.trim();
    expect($target.text()).toEqual(text);
    expect($target.find(".idlAttribute").length).toEqual(8);
    var $at = $target.find(".idlAttribute").first();
    expect($at.find(".idlAttrType").text()).toEqual(" DOMString");
    expect($at.find(".idlAttrName").text()).toEqual("regular");
    var $ro = $target.find(".idlAttribute").eq(2);
    expect($ro.find(".idlAttrName").text()).toEqual("_readonly");
    var $frozen = $target.find(".idlAttribute").eq(6);
    expect($frozen.find(".idlAttrType").text()).toEqual(
      " FrozenArray<DOMString>"
    );
    var $promise = $target.find(".idlAttribute").eq(7);
    expect($promise.find(".idlAttrType").text()).toEqual(" Promise<DOMString>");
    expect(
      $target.find(":contains('_readonly')").parents(".idlAttribute").attr("id")
    ).toEqual("idl-def-attrbasic-readonly");
    expect(
      $target.find(":contains('regular')").filter("a").attr("href")
    ).toEqual("#dom-attrbasic-regular");
    expect($target.find(":contains('dates')").filter("a").length).toEqual(0);
  });

  it("handles stringifiers special operations", () => {
    const stringifierTestElems = [...doc.querySelectorAll("#stringifiertest .idlMethod")];
    const [stringifierAnon, stringifierNamed] = stringifierTestElems;
    expect(stringifierAnon).toBeTruthy();
    expect(stringifierAnon.querySelector(".idlMethType").textContent).toBe(" StringPass");
    expect(stringifierAnon.querySelector(".idlMethName")).toBeNull();
    
    expect(stringifierNamed).toBeTruthy();
    expect(stringifierNamed.querySelector(".idlMethType").textContent).toBe(" StringNamedPass");
    expect(stringifierNamed.querySelector(".idlMethName").textContent).toBe("named");
  });
  
  it("handles getter special operations", () => {
    const getterTestElems = [...doc.querySelectorAll("#gettertest .idlMethod")];
    const [getterAnon, getterNamed] = getterTestElems;
    expect(getterAnon).toBeTruthy();
    expect(getterAnon.querySelector(".idlMethType").textContent).toBe(" GetterPass");
    expect(getterAnon.querySelector(".idlMethName")).toBeNull();
    
    expect(getterNamed).toBeTruthy();
    expect(getterNamed.querySelector(".idlMethType").textContent).toBe(" GetterNamedPass");
    expect(getterNamed.querySelector(".idlMethName").textContent).toBe("named");
  });
  
  it("handles setter special operations", () => {
    const setterTestElems = [...doc.querySelectorAll("#settertest .idlMethod")];
    const [setterAnon, setterNamed] = setterTestElems;
    expect(setterAnon).toBeTruthy();
    expect(setterAnon.querySelector(".idlMethType").textContent).toBe(" SetterPass");
    expect(setterAnon.querySelector(".idlMethName")).toBeNull();
    
    expect(setterNamed).toBeTruthy();
    expect(setterNamed.querySelector(".idlMethType").textContent).toBe(" SetterNamedPass");
    expect(setterNamed.querySelector(".idlMethName").textContent).toBe("named");
  });
  
  it("should handle operations", function(done) {
    var $target = $("#meth-basic", doc);
    var text =`interface MethBasic {
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
  getter float withName();
  // 7
  setter void ();
  // 8
  setter void named();
  // 9
  static Promise<RTCCertificate> generateCertificate(AlgorithmIdentifier keygenAlgorithm);
  // 10
  stringifier DOMString identifier();
  // 11
  stringifier DOMString ();
  // 12
  stringifier;
};`
    expect($target.text()).toEqual(text);
    expect($target.find(".idlMethod").length).toEqual(12);
    expect($target.find(".idlMethName").length).toEqual(8);
    var $meth = $target.find(".idlMethod").first();
    expect($meth.find(".idlMethType").text()).toEqual("\n  // 1\n  void");
    expect($meth.find(".idlMethName").text()).toEqual("basic");
    expect(
      $target.find(".idlMethType:contains('SuperStar?') a").text()
    ).toEqual("SuperStar");

    // Links and IDs.
    var ulls = $target.find(".idlMethName:contains('ull')");
    expect(ulls.first().children("a").attr("href")).toEqual(
      "#dom-methbasic-ull"
    );
    expect(ulls.last().children("a").attr("href")).toEqual(
      "#dom-methbasic-ull!overload-1"
    );
    expect($target.find(":contains('dates')").filter("a").length).toEqual(0);
    done();
  });

  it("should handle iterable-like interface member declarations", () => {
    const elem = doc.getElementById("iterable-like");
    expect(elem.getElementsByClassName("idlIterable").length).toEqual(2);
    expect(elem.getElementsByClassName("idlMaplike").length).toEqual(1);
    expect(elem.getElementsByClassName("idlSetlike").length).toEqual(1);
  });

  it("should handle comments", function(done) {
    var $target = $("#comments-basic", doc);
    var // TODO: Handle comments when WebIDL2 does.
    text =
      "interface SuperStar {\n" +
      "  // This is a comment\n" +
      "  // over two lines.\n" +
      "  /* This one\n" +
      "     has\n" +
      "     three. */\n" +
      "};";
    expect($target.text()).toEqual(text);
    expect($target.find(".idlSectionComment").length).toEqual(1);
    done();
  });

  it("should handle dictionaries", function(done) {
    var $target = $("#dict-basic", doc);
    var text = "dictionary SuperStar {};";
    expect($target.text()).toEqual(text);
    expect($target.find(".idlDictionary").length).toEqual(1);
    expect($target.find(".idlDictionaryID").text()).toEqual("SuperStar");

    $target = $("#dict-inherit", doc);
    text = "dictionary SuperStar : HyperStar {};";
    expect($target.text()).toEqual(text);
    expect($target.find(".idlSuperclass").text()).toEqual("HyperStar");

    $target = $("#dict-fields", doc);
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
    expect($target.text()).toEqual(text);
    expect($target.find(".idlMember").length).toEqual(9);
    var $mem = $target.find(".idlMember").first();
    expect($mem.find(".idlMemberType").text()).toEqual("\n  // 1\n  DOMString");
    expect($mem.find(".idlMemberName").text()).toEqual("value");
    expect(
      $target.find(".idlMember").last().find(".idlMemberValue").text()
    ).toEqual('"blah blah"');

    $target = $("#dict-required-fields", doc);
    text =
      "dictionary SuperStar {\n" +
      "  required DOMString value;\n" +
      "  DOMString optValue;\n" +
      "};";
    expect($target.text()).toEqual(text);

    // Links and IDs.
    $target = $("#dict-doc", doc);
    expect(
      $target.find(":contains('DictDocTest')").filter("a").attr("href")
    ).toEqual("#dom-dictdoctest");
    expect(
      $target.find(".idlDictionary:contains('DictDocTest')").attr("id")
    ).toEqual("idl-def-dictdoctest");
    expect(
      $target.find(":contains('dictDocField')").filter("a").attr("href")
    ).toEqual("#dom-dictdoctest-dictdocfield");
    expect(
      $target.find(":contains('otherField')").filter("a").attr("href")
    ).toEqual("#dom-dictdoctest-otherfield");
    expect(
      $target.find(".idlMember:contains('dictDocField')").attr("id")
    ).toEqual("idl-def-dictdoctest-dictdocfield");
    expect($target.find(":contains('undocField')").filter("a").length).toEqual(
      0
    );
    done();
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

  it("should handle enumerations", function(done) {
    var $target = $("#enum-basic", doc);
    var text =
      "enum EnumBasic {\n" +
      "  // 1\n" +
      '  "one",\n' +
      "  // 2\n" +
      '  "two"\n' +
      "  // 3\n" +
      ', "three",\n' +
      "\n" +
      "  // 4\n" +
      '  "white space"\n' +
      "};";
    expect($target.text()).toEqual(text);
    expect($target.find(".idlEnum").length).toEqual(1);
    expect($target.find(".idlEnumID").text()).toEqual("EnumBasic");
    expect($target.find(".idlEnumItem").length).toEqual(4);
    expect($target.find(".idlEnumItem").first().text()).toEqual('"one"');

    // Links and IDs.
    expect(
      $target.find(":contains('EnumBasic')").filter("a").attr("href")
    ).toEqual("#dom-enumbasic");
    expect($target.find(".idlEnum:contains('EnumBasic')").attr("id")).toEqual(
      "idl-def-enumbasic"
    );
    done();
  });

  it("should handle enumeration value definitions", function(done) {
    var $section = $("#enumerations", doc);
    expect($section.find("dfn:contains('one')").attr("id")).toEqual(
      "dom-enumbasic-one"
    );
    expect(
      $section.find("p[data-link-for] a:contains('one')").attr("href")
    ).toEqual("#dom-enumbasic-one");
    expect(
      $section.find("#enum-ref-without-link-for a:contains('one')").attr("href")
    ).toEqual("#dom-enumbasic-one");
    done();
  });

  it("links empty-string enumeration value", done => {
    const links = doc.querySelector(
      `#enum-empty-sec a[href="#dom-emptyenum-the-empty-string"]`
    );
    const dfn = doc.querySelector("#dom-emptyenum-the-empty-string");
    const smokeDfn = doc.querySelector(
      `#enum-empty-sec a[href="#dom-emptyenum-not empty"]`
    );
    expect(links).toBeTruthy();
    expect(dfn).toBeTruthy();
    expect(smokeDfn).toBeTruthy();
    done();
  });

  it("should handle callbacks", function(done) {
    var $target = $("#cb-basic", doc);
    var text = "callback SuperStar = void ();";
    expect($target.text()).toEqual(text);
    expect($target.find(".idlCallback").length).toEqual(1);
    expect($target.find(".idlCallbackID").text()).toEqual("SuperStar");
    expect($target.find(".idlCallbackType").text()).toEqual(" void");

    $target = $("#cb-less-basic", doc);
    text = "callback CbLessBasic = unsigned long long? (optional any value);";
    expect($target.text()).toEqual(text);
    expect($target.find(".idlCallbackType").text()).toEqual(
      " unsigned long long?"
    );
    var $prm = $target.find(".idlCallback").last().find(".idlParam");
    expect($prm.length).toEqual(1);
    expect($prm.find(".idlParamType").text()).toEqual(" any");
    expect($prm.find(".idlParamName").text()).toEqual("value");

    // Links and IDs.
    expect(
      $target.find(":contains('CbLessBasic')").filter("a").attr("href")
    ).toEqual("#dom-cblessbasic");
    expect(
      $target.find(".idlCallback:contains('CbLessBasic')").attr("id")
    ).toEqual("idl-def-cblessbasic");

    $target = $("#cb-mult-args", doc);
    text = "callback SortCallback = void (any a, any b);";
    expect($target.text()).toEqual(text);
    $prm = $target.find(".idlCallback").last().find(".idlParam");
    expect($prm.length).toEqual(2);
    expect($prm.find(".idlParamType").first().text()).toEqual("any");
    expect($prm.find(".idlParamName").first().text()).toEqual("a");
    expect($prm.find(".idlParamType").last().text()).toEqual(" any");
    expect($prm.find(".idlParamName").last().text()).toEqual("b");
    done();
  });

  it("should handle typedefs", () => {
    let target = doc.getElementById("td-basic");
    let text = "typedef DOMString string;";
    expect(target.textContent).toEqual(text);
    expect(target.querySelectorAll(".idlTypedef").length).toEqual(1);
    expect(target.querySelector(".idlTypedefID").textContent).toEqual("string");
    expect(target.querySelector(".idlTypedefType").textContent).toEqual(" DOMString");

    target = doc.getElementById("td-less-basic");
    text = "typedef unsigned long long? tdLessBasic;";
    expect(target.textContent).toEqual(text);

    // Links and IDs.
    expect(
      target.querySelector(".idlTypedefID").children[0].getAttribute("href")
    ).toEqual("#dom-tdlessbasic");
    expect(
      target.querySelector(".idlTypedef").id
    ).toEqual("idl-def-tdlessbasic");

    target = doc.getElementById("td-extended-attribute");
    text = "typedef ([Clamp] unsigned long or ConstrainULongRange) ConstrainULong;";
    expect(target.textContent).toEqual(text);

    target = doc.getElementById("td-union-extended-attribute");
    text = "typedef [Clamp] (unsigned long or ConstrainULongRange) ConstrainULong2;";
    expect(target.textContent).toEqual(text);
  });

  it("should handle includes", () => {
    var $target = $("#incl-basic", doc);
    var text = "Window includes Breakable;";
    expect($target.text()).toEqual(text);
    expect($target.find(".idlIncludes").length).toEqual(1);

    $target = $("#incl-less-basic", doc);
    text = "[Something]" + text;
    expect($target.text()).toEqual(text);
  });

  it("should handle implements", () => {
    var $target = $("#impl-basic", doc);
    var text = "Window implements Breakable;";
    expect($target.text()).toEqual(text);
    expect($target.find(".idlImplements").length).toEqual(1);

    $target = $("#impl-less-basic", doc);
    text = "[Something]" + text;
    expect($target.text()).toEqual(text);
  });

  it("should link documentation", function() {
    var $section = $("#documentation", doc);
    var $target = $("#doc-iface", doc);

    expect(
      $target.find(".idlAttrName:contains('docString') a").attr("href")
    ).toEqual("#dom-documented-docstring");
    expect($section.find("dfn:contains('docString')").attr("id")).toEqual(
      "dom-documented-docstring"
    );

    expect(
      $section.find("dfn:contains('Some generic term')").attr("id")
    ).toEqual("dfn-some-generic-term");
    expect(
      $section.find("a:contains('Some generic term')").attr("href")
    ).toEqual("#dfn-some-generic-term");
    expect(
      $section.find("p[data-link-for] a:contains('docString')").attr("href")
    ).toEqual("#dom-documented-docstring");
    var notDefinedAttr = $target.find(".idlAttribute:contains('notDefined')");
    expect(notDefinedAttr.find(".idlAttrName").length).toEqual(1);
    expect(notDefinedAttr.find(".idlAttrName").find("a").length).toEqual(0);
    expect(notDefinedAttr.attr("id")).toEqual("idl-def-documented-notdefined");
    expect(
      $section.find("p[data-link-for] a:contains('notDefined')").attr("href")
    ).toEqual("#idl-def-documented-notdefined");

    var definedElsewhere = $section.find("dfn:contains('definedElsewhere')");
    var linkFromElsewhere = $section.find("a:contains('Documented.docString')");
    expect(definedElsewhere.prop("id")).toEqual(
      "dom-documented-definedelsewhere"
    );
    expect(
      $target.find(".idlAttrName:contains('definedElsewhere') a").attr("href")
    ).toEqual("#dom-documented-definedelsewhere");
    expect(linkFromElsewhere.attr("href")).toEqual("#dom-documented-docstring");

    expect(
      $section.find("#without-link-for a:contains('Documented')").attr("href")
    ).toEqual("#idl-def-documented");
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
});
