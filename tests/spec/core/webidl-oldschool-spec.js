describe("Core - WebIDL", function () {
    var MAXOUT = 5000
    ,   $widl = $("<iframe width='800' height='200' style='display: none' src='spec/core/webidl.html'></iframe>")
    ,   loaded = false
    ,   $target
    ,   text
    ,   doc
    ;

    window.addEventListener("message", function (ev) {
        if (ev.data.topic !== "end-all") return;
        loaded = true;
        doc = $widl[0].contentDocument;
    }, false);


    beforeEach(function () {
        runs(function () {
            if (!loaded) {
                $widl.appendTo($("body"));
            }
        });
        waitsFor(function () { return loaded; }, MAXOUT);
    });

    // XXX
    //  for each of these
    //      - check the important parts of the highlighting
    //      - look at the generated HTML for all of the important stuff

    it("should handle interfaces", function () {
        runs(function () {
            $target = $("#if-basic", doc);
            text = "interface SuperStar {\n};\n";
            expect($target.text()).toEqual(text);
            expect($target.find(".idlInterface").length).toEqual(1);
            expect($target.find(".idlInterfaceID").text()).toEqual("SuperStar");

            $target = $("#if-extended-attribute", doc);
            text = "[Something, Constructor()]\n" + text;
            expect($target.text()).toEqual(text);
            expect($target.find(".extAttr").text()).toEqual("Something, Constructor()");

            $target = $("#if-inheritance", doc);
            text = "interface SuperStar : HyperStar {\n};\n";
            expect($target.text()).toEqual(text);
            expect($target.find(".idlSuperclass").text()).toEqual("HyperStar");

            $target = $("#if-partial", doc);
            text = "partial interface SuperStar {\n};\n";
            expect($target.text()).toEqual(text);

            $target = $("#if-callback", doc);
            text = "callback interface SuperStar {\n};\n";
            expect($target.text()).toEqual(text);
            
        });
    });

    it("should handle constants", function () {
        $target = $("#const-basic", doc);
        text =  "interface SuperStar {\n" +
                "    const boolean             test = true;\n" +
                "    const byte                bite = 8;\n" +
                "    const octet               eight = 7;\n" +
                "    const short               small = 42;\n" +
                "    const unsigned short      shortish = 250;\n" +
                "    const long                notSoLong = 99999;\n" +
                "    const unsigned long       somewhatLong = 9999999;\n" +
                "    const long long           veryLong = 9999999999999;\n" +
                "    const unsigned long long  soLong = 99999999999999999;\n" +
                "    const float               ationDevice = 4.2;\n" +
                "    const unrestricted float  buoy = 4.2222222222;\n" +
                "    const double              twice = 4.222222222;\n" +
                "    const unrestricted double rambaldi = 47.0;\n" +
                "    const boolean?            why = false;\n" +
                "    const boolean?            notSo = null;\n" +
                "    const short               inf = Infinity;\n" +
                "    const short               mininf = -Infinity;\n" +
                "    const short               cheese = NaN;\n" +
                "    [Something]\n" +
                "    const short               extAttr = NaN;\n" +
                "};\n";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlConst").length).toEqual(19);
        var $const1 = $target.find(".idlConst").first();
        expect($const1.find(".idlConstType").text()).toEqual("boolean");
        expect($const1.find(".idlConstName").text()).toEqual("test");
        expect($const1.find(".idlConstValue").text()).toEqual("true");
        expect($target.find(".idlConst").last().find(".extAttr").length).toEqual(1);
    });

    it("should handle attributes", function () {
        $target = $("#attr-basic", doc);
        text =  "interface SuperStar {\n" +
                "             attribute DOMString      regular;\n" +
                "    readonly attribute DOMString      ro;\n" +
                "    [Something]\n" +
                "    readonly attribute DOMString      ext;\n" +
                "             attribute sequence<Date> dates;\n" +
                "};\n";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlAttribute").length).toEqual(4);
        var $at = $target.find(".idlAttribute").first();
        expect($at.find(".idlAttrType").text()).toEqual("DOMString");
        expect($at.find(".idlAttrName").text()).toEqual("regular");
        var $lst = $target.find(".idlAttribute").last();
        expect($lst.find(".idlAttrType").text()).toEqual("sequence<Date>");
        expect($lst.find(".idlAttrType > a").text()).toEqual("Date");
    });

    it("should handle operations", function () {
        $target = $("#meth-basic", doc);
        text =  "interface SuperStar {\n" +
                "    void               basic ();\n" +
                "    [Something]\n" +
                "    void               ext ();\n" +
                "    unsigned long long ull ();\n" +
                "    Perhaps?           ull ();\n" +
                "    short[][][][]      paramed (Date[][][] one, [ExtAttrs] ByteString? ext, optional short maybe, optional short[] shorts, optional short[][][][] hypercubes, optional short... variable);\n" +
                "};\n";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlMethod").length).toEqual(5);
        var $meth = $target.find(".idlMethod").first();
        expect($meth.find(".idlMethType").text()).toEqual("void");
        expect($meth.find(".idlMethName").text()).toEqual("basic");
        expect($target.find(".idlMethType:contains('Perhaps?') a").text()).toEqual("Perhaps");
        expect($target.find(".idlMethType:contains('short[][][][]') a").text()).toEqual("short");
        var $lst = $target.find(".idlMethod").last();
        expect($lst.find(".idlParam").length).toEqual(6);
        expect($lst.find(".idlParam:contains('optional')").length).toEqual(4);
        expect($lst.find(".idlParam").first().find(".idlParamType > a").text()).toEqual("Date");
    });

    it("should handle dictionaries", function () {
        $target = $("#dict-basic", doc);
        text = "dictionary SuperStar {\n};\n";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlDictionary").length).toEqual(1);
        expect($target.find(".idlDictionaryID").text()).toEqual("SuperStar");

        $target = $("#dict-inherit", doc);
        text = "dictionary SuperStar : HyperStar {\n};\n";
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
                "};\n";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlMember").length).toEqual(9);
        var $mem = $target.find(".idlMember").first();
        expect($mem.find(".idlMemberType").text()).toEqual("DOMString");
        expect($mem.find(".idlMemberName").text()).toEqual("value");
        expect($target.find(".idlMember").last().find(".idlMemberValue").text()).toEqual('"blah blah"');
    });

    it("should handle exceptions", function () {
        $target = $("#ex-basic", doc);
        text = "exception SuperStar {\n};\n";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlException").length).toEqual(1);
        expect($target.find(".idlExceptionID").text()).toEqual("SuperStar");

        $target = $("#ex-inherit", doc);
        text = "exception SuperStar : HyperStar {\n};\n";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlSuperclass").text()).toEqual("HyperStar");

        $target = $("#ex-fields", doc);
        text =  "exception SuperStar {\n" +
                "    [Something]\n" +
                "    const long value = 42;\n" +
                "    Object?         message;\n" +
                "    sequence<float> floats;\n" +
                "    long[]          numbers;\n" +
                "};\n";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlConst").length).toEqual(1);
        expect($target.find(".idlField").length).toEqual(3);
        var $const = $target.find(".idlConst");
        expect($const.find(".idlConstType").text()).toEqual("long");
        expect($const.find(".idlConstName").text()).toEqual("value");
        expect($const.find(".idlConstValue").text()).toEqual("42");
        var $fld = $target.find(".idlField").first();
        expect($fld.find(".idlFieldType a").text()).toEqual("Object");
        expect($fld.find(".idlFieldName").text()).toEqual("message");
    });

    it("should handle enumerations", function () {
        $target = $("#enum-basic", doc);
        text = "enum SuperStar {\n    \"one\",\n    \"two\",\n    \"three\"\n};\n";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlEnum").length).toEqual(1);
        expect($target.find(".idlEnumID").text()).toEqual("SuperStar");
        expect($target.find(".idlEnumItem").length).toEqual(3);
        expect($target.find(".idlEnumItem").first().text()).toEqual("one");
    });

    it("should handle callbacks", function () {
        $target = $("#cb-basic", doc);
        text = "callback SuperStar = void ();\n";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlCallback").length).toEqual(1);
        expect($target.find(".idlCallbackID").text()).toEqual("SuperStar");
        expect($target.find(".idlCallbackType").text()).toEqual("void");

        $target = $("#cb-less-basic", doc);
        text = "callback SuperStar = unsigned long long? (optional any value);\n";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlCallbackType a").text()).toEqual("unsigned long long");
        var $prm = $target.find(".idlCallback").last().find(".idlParam");
        expect($prm.length).toEqual(1);
        expect($prm.find(".idlParamType").text()).toEqual("any");
        expect($prm.find(".idlParamName").text()).toEqual("value");
    });

    it("should handle typedefs", function () {
        $target = $("#td-basic", doc);
        text = "typedef DOMString string;";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlTypedef").length).toEqual(1);
        expect($target.find(".idlTypedefID").text()).toEqual("string");
        expect($target.find(".idlTypedefType").text()).toEqual("DOMString");

        $target = $("#td-less-basic", doc);
        text = "typedef [Something] unsigned long long? sth;";
        expect($target.text()).toEqual(text);
    });

    it("should handle implements", function () {
        $target = $("#impl-basic", doc);
        text = "Window implements Breakable;";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlImplements").length).toEqual(1);
        expect($target.find(".idlImplements a").length).toEqual(2);

        $target = $("#impl-less-basic", doc);
        text = "[Something]\n" + text;
        expect($target.text()).toEqual(text);
    });
});
