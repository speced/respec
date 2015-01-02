describe("Core - Contiguous WebIDL", function () {
    var MAXOUT = 5000
    ,   $widl = $("<iframe width='800' height='200' style='display: none' src='spec/core/webidl-contiguous.html'></iframe>")
    ,   loaded = false
    ,   $target
    ,   text
    ,   doc
    ;

    beforeEach(function () {
        runs(function () {
            if (!loaded) {
                var handler = function (ev) {
                    if (ev.data.topic !== "end-all") return;
                    loaded = true;
                    doc = $widl[0].contentDocument;
                    window.removeEventListener("message", handler, false);
                };
                window.addEventListener("message", handler, false);
                $widl.appendTo($("body"));
            }
        });
        waitsFor(function () { return loaded; }, MAXOUT);
    });

    it("should handle interfaces", function () {
        runs(function () {
            $target = $("#if-basic", doc);
            text = "interface SuperStar {\n};";
            expect($target.text()).toEqual(text);
            expect($target.find(".idlInterface").length).toEqual(1);
            expect($target.find(".idlInterfaceID").text()).toEqual("SuperStar");

            $target = $("#if-extended-attribute", doc);
            text = "[Something,\n Constructor()]\n" + text;
            expect($target.text()).toEqual(text);
            expect($target.find(".extAttr").text()).toEqual("Something");
            expect($target.find(".idlCtor").text()).toEqual("Constructor()");

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
            expect($target.find(":contains('DocInterface')").filter("a").attr("href")).toEqual("#dom-docinterface");
            expect($target.find(":contains('DocIsNotCaseSensitive')").filter("a").attr("href")).toEqual("#dom-docisnotcasesensitive");
            expect($target.find(".idlInterface")[0].id).toEqual("idl-def-docinterface");
            expect($target.find(".idlInterface")[1].id).toEqual("idl-def-docisnotcasesensitive");
            expect($target.find(".idlInterface")[2].id).toEqual("idl-def-undocinterface");
            expect($target.find(":contains('UndocInterface')").filter('a').length).toEqual(0);
        });
    });

    it("should handle constructors", function () {
        $target = $("#ctor-basic", doc);
        text =  "[Something,\n" +
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
        expect($ctor1.find(".idlParam").first().find(".idlParamType").text()).toEqual("boolean");

        $target = $("#ctor-noea", doc);
        text =  "[Constructor]\n" +
                "interface SuperStar {\n" +
                "};";
        expect($target.text()).toEqual(text);

    });

    it("should handle named constructors", function () {
        $target = $("#namedctor-basic", doc);
        text =  "[Something,\n" +
                " NamedConstructor=Sun(),\n" +
                " NamedConstructor=Sun(boolean bar, Date[][][] foo)]\n" +
                "interface SuperStar {\n" +
                "};";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlCtor").length).toEqual(2);
        var $ctor1 = $target.find(".idlCtor").last();
        expect($ctor1.find(".extAttrRhs").text()).toEqual("Sun");
        expect($ctor1.find(".idlParam").length).toEqual(2);
        expect($ctor1.find(".idlParam:contains('Date[][][]')").length).toEqual(1);
        expect($ctor1.find(".idlParam").first().find(".idlParamType").text()).toEqual("boolean");
    });

    it("should handle constants", function () {
        $target = $("#const-basic", doc);
        text =  "interface ConstTest {\n" +
                "    const boolean             test = true;\n" +
                "    const byte                bite = 8;\n" +
                "    const octet               eight = 7;\n" +
                "    const short               small = 42;\n" +
                "    const unsigned short      shortish = 250;\n" +
                "    const long                notSoLong = 99999;\n" +
                "    const unsigned long       somewhatLong = 9999999;\n" +
                "    const long long           veryLong = 9999999999999;\n" +
                "    const unsigned long long  soLong = 100000000000000000;\n" +
                "    const float               ationDevice = 4.2;\n" +
                "    const unrestricted float  buoy = 4.2222222222;\n" +
                "    const double              twice = 4.222222222;\n" +
                "    const unrestricted double rambaldi = 47;\n" +
                "    const boolean?            why = false;\n" +
                "    const boolean?            notSo = null;\n" +
                "    const short               inf = Infinity;\n" +
                "    const short               mininf = -Infinity;\n" +
                "    const short               cheese = NaN;\n" +
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
        expect($target.find(":contains('rambaldi')").filter("a").attr("href")).toEqual("#dom-consttest-rambaldi");
        expect($target.find(":contains('rambaldi')").parents(".idlConst").attr("id")).toEqual("idl-def-consttest-rambaldi");
        expect($target.find(":contains('why')").filter("a").attr("href")).toEqual("#dom-consttest-why");
        expect($target.find(":contains('inf')").filter("a").attr("href")).toEqual("#dom-consttest-inf");
        expect($target.find(":contains('ationDevice')").filter("a").length).toEqual(0);
    });

    it("should handle attributes", function () {
        $target = $("#attr-basic", doc);
        text =  "interface AttrBasic {\n" +
                "                attribute DOMString          regular;\n" +
                "    readonly    attribute DOMString          ro;\n" +
                "    readonly    attribute DOMString          _readonly;\n" +
                "    inherit     attribute DOMString          in;\n" +
                "    stringifier attribute DOMString          st;\n" +
                "    [Something]\n" +
                "    readonly    attribute DOMString          ext;\n" +
                "                attribute Date[]             dates;\n" +
                "                attribute Promise<DOMString> operation;\n" +
                //"                attribute Promise<Superstar>[] wouldBeStars;\n" +
                "};";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlAttribute").length).toEqual(8);
        var $at = $target.find(".idlAttribute").first();
        expect($at.find(".idlAttrType").text()).toEqual("DOMString");
        expect($at.find(".idlAttrName").text()).toEqual("regular");
        var $ro = $target.find(".idlAttribute").eq(2);
        expect($ro.find(".idlAttrName").text()).toEqual("_readonly");
        var $seq = $target.find(".idlAttribute").eq(6);
        expect($seq.find(".idlAttrType").text()).toEqual("Date[]");
        var $promise = $target.find(".idlAttribute").eq(7);
        expect($promise.find(".idlAttrType").text()).toEqual("Promise<DOMString>");
        //var $seqpromise = $target.find(".idlAttribute").eq(8);
        //expect($seqpromise.find(".idlAttrType").text()).toEqual("sequence<Promise<Superstar>>");

        // Links and IDs.
        expect($target.find(":contains('_readonly')").filter("a").attr("href")).toEqual("#dom-attrbasic-readonly");
        expect($target.find(":contains('_readonly')").parents(".idlAttribute").attr("id")).toEqual("idl-def-attrbasic-readonly");
        expect($target.find(":contains('regular')").filter("a").attr("href")).toEqual("#dom-attrbasic-regular");
        expect($target.find(":contains('dates')").filter("a").length).toEqual(0);
    });

    it("should handle operations", function () {
        $target = $("#meth-basic", doc);
        text =  "interface MethBasic {\n" +
                "    void               basic();\n" +
                "    [Something]\n" +
                "    void               ext();\n" +
                "    unsigned long long ull(short s);\n" +
                "    SuperStar?         ull();\n" +
                "    SuperStar[][][][]  paramed(SuperStar[][]?[] one, [ExtAttrs] ByteString? ext, optional short maybe, short[] shorts, short[][][][] hypercubes, optional short defaulted = 3.5, optional DOMString defaulted2 = \"one\", short... variable);\n" +
                "};";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlMethod").length).toEqual(5);
        var $meth = $target.find(".idlMethod").first();
        expect($meth.find(".idlMethType").text()).toEqual("void");
        expect($meth.find(".idlMethName").text()).toEqual("basic");
        expect($target.find(".idlMethType:contains('SuperStar?') a").text()).toEqual("SuperStar");
        expect($target.find(".idlMethType:contains('SuperStar[][][][]') a").text()).toEqual("SuperStar");
        var $lst = $target.find(".idlMethod").last();
        expect($lst.find(".idlParam").length).toEqual(8);
        expect($lst.find(".idlParam:contains('optional')").length).toEqual(3);
        expect($lst.find(".idlParam").first().find(".idlParamType > a").text()).toEqual("SuperStar");

        // Links and IDs.
        var ulls = $target.find(".idlMethName:contains('ull')");
        expect(ulls.first().children("a").attr("href")).toEqual("#dom-methbasic-ull");
        expect(ulls.last().children("a").attr("href")).toEqual("#dom-methbasic-ull");
        expect($target.find(".idlMethod:contains('paramed')").attr("id")).toEqual("idl-def-methbasic-paramed(superstar[][]?[],bytestring?,optional-short,short[],short[][][][],optional-short,optional-domstring,short...)");
        expect($target.find(":contains('dates')").filter("a").length).toEqual(0);
    });

    it("should handle serializer", function () {
        $target = $("#serializer-map", doc);
        text =  "interface SerializerMap {\n" +
                "                attribute DOMString foo;\n" +
                "                attribute DOMString bar;\n" +
                "    serializer = {foo, bar};\n" +
                "};";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlSerializer").length).toEqual(1);
        var $serializer = $target.find(".idlSerializer").first();
        expect($serializer.find(".idlSerializerValues").text()).toEqual("{foo, bar}");

        // Links and IDs.
        var serializer = $target.find(".idlSerializer:contains('serializer')");
        expect($serializer.attr("id")).toEqual("idl-def-serializermap-serializer");
        expect($serializer.children("a").attr("href")).toEqual("#dom-serializermap-serializer");
    });

    it("should handle comments", function () {
        $target = $("#comments-basic", doc);
        // TODO: Handle comments when WebIDL2 does.
        text =  "interface SuperStar {\n" +
                //"    // This is a comment\n" +
                //"    // over two lines.\n" +
                "};";
        expect($target.text()).toEqual(text);
        //expect($target.find(".idlSectionComment").length).toEqual(2);
    });


    it("should handle dictionaries", function () {
        $target = $("#dict-basic", doc);
        text = "dictionary SuperStar {\n};";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlDictionary").length).toEqual(1);
        expect($target.find(".idlDictionaryID").text()).toEqual("SuperStar");

        $target = $("#dict-inherit", doc);
        text = "dictionary SuperStar : HyperStar {\n};";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlSuperclass").text()).toEqual("HyperStar");

        $target = $("#dict-fields", doc);
        text =  "dictionary SuperStar {\n" +
                "    DOMString          value;\n" +
                "    DOMString?         nullable;\n" +
                "    [Something]\n" +
                "    float              ext;\n" +
                "    unsigned long long longLong;\n" +
                "    boolean            test = true;\n" +
                "    byte               little = 2;\n" +
                "    byte               big = Infinity;\n" +
                "    byte               cheese = NaN;\n" +
                "    DOMString          blah = \"blah blah\";\n" +
                "};";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlMember").length).toEqual(9);
        var $mem = $target.find(".idlMember").first();
        expect($mem.find(".idlMemberType").text()).toEqual("DOMString");
        expect($mem.find(".idlMemberName").text()).toEqual("value");
        expect($target.find(".idlMember").last().find(".idlMemberValue").text()).toEqual('"blah blah"');

        // Links and IDs.
        $target = $("#dict-doc", doc);
        expect($target.find(":contains('DictDocTest')").filter("a").attr("href")).toEqual("#dom-dictdoctest");
        expect($target.find(".idlDictionary:contains('DictDocTest')").attr("id")).toEqual("idl-def-dictdoctest");
        expect($target.find(":contains('dictDocField')").filter("a").attr("href")).toEqual("#dom-dictdoctest-dictdocfield");
        expect($target.find(":contains('otherField')").filter("a").attr("href")).toEqual("#dom-dictdoctest-otherfield");
        expect($target.find(".idlMember:contains('dictDocField')").attr("id")).toEqual("idl-def-dictdoctest-dictdocfield");
        expect($target.find(":contains('undocField')").filter("a").length).toEqual(0);
    });

    it("should handle exceptions", function () {
        $target = $("#ex-basic", doc);
        text = "exception SuperStar {\n};";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlException").length).toEqual(1);
        expect($target.find(".idlExceptionID").text()).toEqual("SuperStar");

        $target = $("#ex-inherit", doc);
        text = "exception SuperStar : HyperStar {\n};";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlSuperclass").text()).toEqual("HyperStar");

        $target = $("#ex-fields", doc);
        text =  "exception ExFields {\n" +
                "    [Something]\n" +
                "    const SuperStar value = 42;\n" +
                "    SuperStar?          message;\n" +
                "    sequence<SuperStar> floats;\n" +
                "    SuperStar[][]       numbers;\n" +
                "    Promise<SuperStar>  stars;\n" +
                "};";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlConst").length).toEqual(1);
        expect($target.find(".idlField").length).toEqual(4);
        var $const = $target.find(".idlConst");
        expect($const.find(".idlConstType").text()).toEqual("SuperStar");
        expect($const.find(".idlConstName").text()).toEqual("value");
        expect($const.find(".idlConstValue").text()).toEqual("42");
        var $fld = $target.find(".idlField").first();
        expect($fld.find(".idlFieldType a").text()).toEqual("SuperStar");
        expect($fld.find(".idlFieldName").text()).toEqual("message");

        // Links and IDs.
        expect($target.find(":contains('ExFields')").filter("a").attr("href")).toEqual("#dom-exfields");
        expect($target.find(".idlException:contains('ExFields')").attr("id")).toEqual("idl-def-exfields");
        expect($target.find(":contains('value')").filter("a").attr("href")).toEqual("#dom-exfields-value");
        expect($target.find(".idlConst:contains('value')").attr("id")).toEqual("idl-def-exfields-value");
        expect($target.find(":contains('floats')").filter("a").attr("href")).toEqual("#dom-exfields-floats");
        expect($target.find(".idlField:contains('floats')").attr("id")).toEqual("idl-def-exfields-floats");
        expect($target.find(":contains('numbers')").filter("a").length).toEqual(0);

    });

    it("should handle enumerations", function () {
        $target = $("#enum-basic", doc);
        text = "enum EnumBasic {\n    \"one\",\n    \"two\",\n    \"three\",\n    \"white space\"\n};";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlEnum").length).toEqual(1);
        expect($target.find(".idlEnumID").text()).toEqual("EnumBasic");
        expect($target.find(".idlEnumItem").length).toEqual(4);
        expect($target.find(".idlEnumItem").first().text()).toEqual("one");

        // Links and IDs.
        expect($target.find(":contains('EnumBasic')").filter("a").attr("href")).toEqual("#dom-enumbasic");
        expect($target.find(".idlEnum:contains('EnumBasic')").attr("id")).toEqual("idl-def-enumbasic");
    });

    it("should handle callbacks", function () {
        $target = $("#cb-basic", doc);
        text = "callback SuperStar = void ();";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlCallback").length).toEqual(1);
        expect($target.find(".idlCallbackID").text()).toEqual("SuperStar");
        expect($target.find(".idlCallbackType").text()).toEqual("void");

        $target = $("#cb-less-basic", doc);
        text = "callback CbLessBasic = unsigned long long? (optional any value);";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlCallbackType").text()).toEqual("unsigned long long?");
        var $prm = $target.find(".idlCallback").last().find(".idlParam");
        expect($prm.length).toEqual(1);
        expect($prm.find(".idlParamType").text()).toEqual("any");
        expect($prm.find(".idlParamName").text()).toEqual("value");

        // Links and IDs.
        expect($target.find(":contains('CbLessBasic')").filter("a").attr("href")).toEqual("#dom-cblessbasic");
        expect($target.find(".idlCallback:contains('CbLessBasic')").attr("id")).toEqual("idl-def-cblessbasic");
    });

    it("should handle typedefs", function () {
        $target = $("#td-basic", doc);
        text = "typedef DOMString string;";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlTypedef").length).toEqual(1);
        expect($target.find(".idlTypedefID").text()).toEqual("string");
        expect($target.find(".idlTypedefType").text()).toEqual("DOMString");

        $target = $("#td-less-basic", doc);
        text = "typedef [Something] unsigned long long? tdLessBasic;";
        expect($target.text()).toEqual(text);

        // Links and IDs.
        expect($target.find(":contains('tdLessBasic')").filter("a").attr("href")).toEqual("#dom-tdlessbasic");
        expect($target.find(".idlTypedef:contains('tdLessBasic')").attr("id")).toEqual("idl-def-tdlessbasic");
    });

    it("should handle implements", function () {
        $target = $("#impl-basic", doc);
        text = "Window implements Breakable;";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlImplements").length).toEqual(1);

        $target = $("#impl-less-basic", doc);
        text = "[Something]\n" + text;
        expect($target.text()).toEqual(text);
    });
});
