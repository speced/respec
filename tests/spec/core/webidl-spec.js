"use strict";
describe("Core - WebIDL", function() {
  afterAll(flushIframes);
  var doc;
  beforeAll(function(done) {
    var ops = makeStandardOps();
    makeRSDoc(
      ops,
      function(idlDoc) {
        doc = idlDoc;
      },
      "spec/core/webidl.html"
    ).then(done);
  });

  it("handles record types", done => {
    const idl = doc.querySelector("#records pre");
    expect(idl).toBeTruthy(idl);
    expect(idl.querySelector(".idlMemberType:first-child").textContent).toEqual(
      "record<DOMString, USVString>"
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
    var t1 = new URL(doc.getElementById("fullyQualifiedNoParens-1")).hash;
    expect(t1).toEqual("#dom-parenthesistest-fullyqualifiednoparens");

    var t2 = new URL(doc.getElementById("fullyQualifiedNoParens-2")).hash;
    expect(t2).toEqual("#dom-parenthesistest-fullyqualifiednoparens");

    var t3 = new URL(doc.getElementById("fullyQualifiedNoParens-3")).hash;
    expect(t3).toEqual("#dom-parenthesistest-fullyqualifiednoparens");

    var t4 = new URL(doc.getElementById("fullyQualifiedNoParens-4")).hash;
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
        doc.getElementById(`dom-parenthesistest-${id}()`),
      ])
      .forEach(([id, methodName, elem]) => {
        expect(elem).toBeTruthy();
        expect(elem.firstElementChild.localName).toEqual("code");
        expect(elem.textContent).toEqual(`${methodName}()`);
        expect(elem.id).toEqual(`dom-parenthesistest-${id}()`);
        expect(elem.dataset.dfnType).toEqual("dfn");
        expect(elem.dataset.dfnFor).toEqual("parenthesistest");
        expect(elem.dataset.idl).toEqual("");
        // corresponding link
        const aElem = section.querySelector(
          `pre a[href="#dom-parenthesistest-${id}()"]`
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
    var text = "interface SuperStar {\n};";
    expect($target.text()).toEqual(text);
    expect($target.find(".idlInterface").length).toEqual(1);
    expect($target.find(".idlInterfaceID").text()).toEqual("SuperStar");

    $target = $("#if-extended-attribute", doc);
    text = "[Something,\n Constructor()]\n" + text;
    expect($target.text()).toEqual(text);
    expect($target.find(".extAttr").text()).toEqual("Something");
    expect($target.find(".idlCtor").text()).toEqual("Constructor()");

    $target = $("#if-identifier-list", doc);
    text =
      "[Global=Window,\n Exposed=(Window,Worker)]\ninterface SuperStar {\n};";
    expect($target.text()).toEqual(text);
    expect($target.find(".extAttrRhs").first().text()).toEqual("Window");
    expect($target.find(".extAttrRhs").last().text()).toEqual(
      "(Window,Worker)"
    );

    $target = $("#if-inheritance", doc);
    text = "interface SuperStar : HyperStar {\n};";
    expect($target.text()).toEqual(text);
    expect($target.find(".idlSuperclass").text()).toEqual("HyperStar");

    $target = $("#if-partial", doc);
    text = "partial interface SuperStar {\n};";
    expect($target.text()).toEqual(text);

    $target = $("#if-callback", doc);
    text = "callback interface SuperStar {\n};";
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
      "interface SuperStar {\n" +
      "};";
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
    text = "[Constructor]\n" + "interface SuperStar {\n" + "};";
    expect($target.text()).toEqual(text);
    done();
  });

  it("should handle named constructors", function(done) {
    var $target = $("#namedctor-basic", doc);
    var text =
      "[Something,\n" +
      " NamedConstructor=Sun(),\n" +
      " NamedConstructor=Sun(boolean bar, Date foo)]\n" +
      "interface SuperStar {\n" +
      "};";
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
      "    // 1\n" +
      "    const boolean             test = true;\n" +
      "    // 2\n" +
      "    const byte                bite = 8;\n" +
      "    // 3\n" +
      "    const octet               eight = 7;\n" +
      "    // 4\n" +
      "    const short               small = 42;\n" +
      "    // 5\n" +
      "    const unsigned short      shortish = 250;\n" +
      "    // 6\n" +
      "    const long                notSoLong = 99999;\n" +
      "    // 7\n" +
      "    const unsigned long       somewhatLong = 9999999;\n" +
      "    // 8\n" +
      "    const long long           veryLong = 9999999999999;\n" +
      "    // 9\n" +
      "    const unsigned long long  soLong = 100000000000000000;\n" +
      "    // 10\n" +
      "    const float               ationDevice = 4.2;\n" +
      "    // 11\n" +
      "    const unrestricted float  buoy = 4.2222222222;\n" +
      "    // 12\n" +
      "    const double              twice = 4.222222222;\n" +
      "    // 13\n" +
      "    const unrestricted double rambaldi = 47;\n" +
      "\n" +
      "    // 14\n" +
      "    const boolean?            why = false;\n" +
      "    // 15\n" +
      "    const boolean?            notSo = null;\n" +
      "    // 16\n" +
      "    const short               inf = Infinity;\n" +
      "    // 17\n" +
      "    const short               mininf = -Infinity;\n" +
      "    // 18\n" +
      "    const short               cheese = NaN;\n" +
      "    // 19\n" +
      "    [Something]\n" +
      "    const short               extAttr = NaN;\n" +
      "};";
    expect($target.text()).toEqual(text);
    expect($target.find(".idlConst").length).toEqual(19);
    var $const1 = $target.find(".idlConst").first();
    expect($const1.find(".idlConstType").text()).toEqual("boolean");
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

  it("should handle attributes", function(done) {
    var $target = $("#attr-basic", doc);
    var text =
      "interface AttrBasic {\n" +
      "    // 1\n" +
      "                attribute DOMString              regular;\n" +
      "    // 2\n" +
      "    readonly    attribute DOMString              ro;\n" +
      "    // 2.2\n" +
      "    readonly    attribute DOMString              _readonly;\n" +
      "    // 2.5\n" +
      "    inherit     attribute DOMString              in;\n" +
      "    // 2.7\n" +
      "    stringifier attribute DOMString              st;\n" +
      "    // 3\n" +
      "    [Something]\n" +
      "    readonly    attribute DOMString              ext;\n" +
      "    // 3.10.31\n" +
      "                attribute FrozenArray<DOMString> alist;\n" +
      "    // 4.0\n" +
      "                attribute Promise<DOMString>     operation;\n" +
      "};";
    expect($target.text()).toEqual(text);
    expect($target.find(".idlAttribute").length).toEqual(8);
    var $at = $target.find(".idlAttribute").first();
    expect($at.find(".idlAttrType").text()).toEqual("DOMString");
    expect($at.find(".idlAttrName").text()).toEqual("regular");
    var $ro = $target.find(".idlAttribute").eq(2);
    expect($ro.find(".idlAttrName").text()).toEqual("_readonly");
    var $frozen = $target.find(".idlAttribute").eq(6);
    expect($frozen.find(".idlAttrType").text()).toEqual(
      "FrozenArray<DOMString>"
    );
    var $promise = $target.find(".idlAttribute").eq(7);
    expect($promise.find(".idlAttrType").text()).toEqual("Promise<DOMString>");
    // Links and IDs.
    expect(
      $target.find(":contains('_readonly')").filter("a").attr("href")
    ).toEqual("#dom-attrbasic-readonly");
    expect(
      $target.find(":contains('_readonly')").parents(".idlAttribute").attr("id")
    ).toEqual("idl-def-attrbasic-readonly");
    expect(
      $target.find(":contains('regular')").filter("a").attr("href")
    ).toEqual("#dom-attrbasic-regular");
    expect($target.find(":contains('dates')").filter("a").length).toEqual(0);
    done();
  });

  it("should handle operations", function(done) {
    var $target = $("#meth-basic", doc);
    var text =
      "interface MethBasic {\n" +
      "    // 1\n" +
      "    void               basic();\n" +
      "    // 2\n" +
      "    [Something] void               ext();\n" +
      "    // 3\n" +
      "    unsigned long long ull(short s);\n" +
      "    // 3.5\n" +
      "    SuperStar?         ull();\n" +
      "    // 5\n" +
      "    getter float       ();\n" +
      "    // 6\n" +
      "    getter float       withName();\n" +
      "    // 7\n" +
      "    setter void        ();\n" +
      "    // 8\n" +
      "    setter void        named();\n" +
      "};";
    expect($target.text()).toEqual(text);
    expect($target.find(".idlMethod").length).toEqual(8);
    var $meth = $target.find(".idlMethod").first();
    expect($meth.find(".idlMethType").text()).toEqual("void");
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

  it("should handle comments", function(done) {
    var $target = $("#comments-basic", doc);
    var // TODO: Handle comments when WebIDL2 does.
    text =
      "interface SuperStar {\n" +
      "    // This is a comment\n" +
      "    // over two lines.\n" +
      "    /* This one\n" +
      "       has\n" +
      "       three. */\n" +
      "};";
    expect($target.text()).toEqual(text);
    expect($target.find(".idlSectionComment").length).toEqual(3);
    done();
  });

  it("should handle dictionaries", function(done) {
    var $target = $("#dict-basic", doc);
    var text = "dictionary SuperStar {\n};";
    expect($target.text()).toEqual(text);
    expect($target.find(".idlDictionary").length).toEqual(1);
    expect($target.find(".idlDictionaryID").text()).toEqual("SuperStar");

    $target = $("#dict-inherit", doc);
    text = "dictionary SuperStar : HyperStar {\n};";
    expect($target.text()).toEqual(text);
    expect($target.find(".idlSuperclass").text()).toEqual("HyperStar");

    $target = $("#dict-fields", doc);
    text =
      "dictionary SuperStar {\n" +
      "    // 1\n" +
      "    DOMString          value;\n" +
      "    // 2\n" +
      "    DOMString?         nullable;\n" +
      "    // 3\n" +
      "    [Something]\n" +
      "    float              ext;\n" +
      "    // 4\n" +
      "    unsigned long long longLong;\n" +
      "\n" +
      "    // 5\n" +
      "    boolean            test = true;\n" +
      "    // 6\n" +
      "    byte               little = 2;\n" +
      "    // 7\n" +
      "    byte               big = Infinity;\n" +
      "    // 8\n" +
      "    byte               cheese = NaN;\n" +
      "    // 9\n" +
      '    DOMString          blah = "blah blah";\n' +
      "};";
    expect($target.text()).toEqual(text);
    expect($target.find(".idlMember").length).toEqual(9);
    var $mem = $target.find(".idlMember").first();
    expect($mem.find(".idlMemberType").text()).toEqual("DOMString");
    expect($mem.find(".idlMemberName").text()).toEqual("value");
    expect(
      $target.find(".idlMember").last().find(".idlMemberValue").text()
    ).toEqual('"blah blah"');

    $target = $("#dict-required-fields", doc);
    text =
      "dictionary SuperStar {\n" +
      "    required DOMString value;\n" +
      "             DOMString optValue;\n" +
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

  it("should handle enumerations", function(done) {
    var $target = $("#enum-basic", doc);
    var text =
      "enum EnumBasic {\n" +
      "    // 1\n" +
      '    "one",\n' +
      "    // 2\n" +
      '    "two",\n' +
      "    // 3\n" +
      '    "three",\n' +
      "\n" +
      "    // 4\n" +
      '    "white space"\n' +
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
    expect($target.find(".idlCallbackType").text()).toEqual("void");

    $target = $("#cb-less-basic", doc);
    text = "callback CbLessBasic = unsigned long long? (optional any value);";
    expect($target.text()).toEqual(text);
    expect($target.find(".idlCallbackType").text()).toEqual(
      "unsigned long long?"
    );
    var $prm = $target.find(".idlCallback").last().find(".idlParam");
    expect($prm.length).toEqual(1);
    expect($prm.find(".idlParamType").text()).toEqual("any");
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
    expect($prm.find(".idlParamType").last().text()).toEqual("any");
    expect($prm.find(".idlParamName").last().text()).toEqual("b");
    done();
  });

  it("should handle typedefs", function(done) {
    var $target = $("#td-basic", doc);
    var text = "typedef DOMString string;";
    expect($target.text()).toEqual(text);
    expect($target.find(".idlTypedef").length).toEqual(1);
    expect($target.find(".idlTypedefID").text()).toEqual("string");
    expect($target.find(".idlTypedefType").text()).toEqual("DOMString");

    $target = $("#td-less-basic", doc);
    text = "typedef unsigned long long? tdLessBasic;";
    expect($target.text()).toEqual(text);

    // Links and IDs.
    expect(
      $target.find(":contains('tdLessBasic')").filter("a").attr("href")
    ).toEqual("#dom-tdlessbasic");
    expect(
      $target.find(".idlTypedef:contains('tdLessBasic')").attr("id")
    ).toEqual("idl-def-tdlessbasic");
    done();
  });

  it("should handle implements", function(done) {
    var $target = $("#impl-basic", doc);
    var text = "Window implements Breakable;";
    expect($target.text()).toEqual(text);
    expect($target.find(".idlImplements").length).toEqual(1);

    $target = $("#impl-less-basic", doc);
    text = "[Something]\n" + text;
    expect($target.text()).toEqual(text);
    done();
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
    expect(toJSONLink.hash).toEqual("#dom-definedtojson-tojson()");
  });
});
