describe("Core - WebIDL", function () {
    var MAXOUT = 5000
    ,   $widl = $("<iframe width='800' height='200' src='spec/core/webidl.html'></iframe>")
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
            text = "[Something, Constructor()]\n" + text;
            expect($target.text()).toEqual(text);
            expect($target.find(".extAttr").text()).toEqual("Something, Constructor()");

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
        });
    });

    it("should handle constructors", function () {
        $target = $("#ctor-basic", doc);
        text =  "[Something,\n" +
                " Constructor,\n" +
                " Constructor (boolean bar, sequence<double> foo, Promise<double> blah)]\n" +
                "interface SuperStar {\n" +
                "};";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlCtor").length).toEqual(2);
        var $ctor1 = $target.find(".idlCtor").last();
        expect($ctor1.find(".idlCtorName").text()).toEqual("Constructor");
        expect($ctor1.find(".idlParam").length).toEqual(3);
        expect($ctor1.find(".idlParam:contains('sequence')").length).toEqual(1);
        expect($ctor1.find(".idlParam:contains('Promise')").length).toEqual(1);
        expect($ctor1.find(".idlParam").first().find(".idlParamType").text()).toEqual("boolean");

        $target = $("#ctor-noea", doc);
        text =  "[ Constructor]\n" +
                "interface SuperStar {\n" +
                "};";
        expect($target.text()).toEqual(text);

    });

    it("should handle named constructors", function () {
        $target = $("#namedctor-basic", doc);
        text =  "[Something,\n" +
                " NamedConstructor=Sun,\n" +
                " NamedConstructor=Sun (boolean bar, Date[][][] foo)]\n" +
                "interface SuperStar {\n" +
                "};";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlCtor").length).toEqual(2);
        var $ctor1 = $target.find(".idlCtor").last();
        expect($ctor1.find(".idlCtorName").text()).toEqual("Sun");
        expect($ctor1.find(".idlParam").length).toEqual(2);
        expect($ctor1.find(".idlParam:contains('Date[][][]')").length).toEqual(1);
        expect($ctor1.find(".idlParam").first().find(".idlParamType").text()).toEqual("boolean");
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
                "};";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlConst").length).toEqual(19);
        var $const1 = $target.find(".idlConst").first();
        expect($const1.find(".idlConstType").text()).toEqual("boolean");
        expect($const1.find(".idlConstName").text()).toEqual("test");
        expect($const1.find(".idlConstValue").text()).toEqual("true");
        expect($target.find(".idlConst").last().find(".extAttr").length).toEqual(1);

        var $sec = $("#constants-1 dl.constants", doc);
        expect($sec.find("dt").length).toEqual(19);
        expect($sec.find("dd").length).toEqual(19);
        expect($sec.find("dt").first().find("code").first().text()).toEqual("ationDevice");
        expect($sec.find("dt").first().find(".idlConstType").text()).toEqual("float");
        expect($sec.find("dd").first().text()).toEqual("10");
    });

    it("should handle attributes", function () {
        $target = $("#attr-basic", doc);
        text =  "interface SuperStar {\n" +
                "                attribute DOMString                    regular;\n" +
                "    readonly    attribute DOMString                    ro;\n" +
                "    readonly    attribute DOMString                    _readonly;\n" +
                "    inherit     attribute DOMString                    in;\n" +
                "    stringifier attribute DOMString                    st;\n" +
                "    [Something]\n" +
                "    readonly    attribute DOMString                    ext;\n" +
                "                attribute sequence<Date>               dates;\n" +
                "                attribute Promise<DOMString>           operation;\n" +
                "                attribute sequence<Promise<Superstar>> wouldBeStars;\n" +
                "};";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlAttribute").length).toEqual(9);
        var $at = $target.find(".idlAttribute").first();
        expect($at.find(".idlAttrType").text()).toEqual("DOMString");
        expect($at.find(".idlAttrName").text()).toEqual("regular");
        var $ro = $target.find(".idlAttribute").eq(2);
        expect($ro.find(".idlAttrName").text()).toEqual("_readonly");
        var $seq = $target.find(".idlAttribute").eq(6);
        expect($seq.find(".idlAttrType").text()).toEqual("sequence<Date>");
        var $promise = $target.find(".idlAttribute").eq(7);
        expect($promise.find(".idlAttrType").text()).toEqual("Promise<DOMString>");
        var $seqpromise = $target.find(".idlAttribute").eq(8);
        expect($seqpromise.find(".idlAttrType").text()).toEqual("sequence<Promise<Superstar>>");

        var $sec = $("#attributes-1 dl.attributes", doc);
        expect($sec.find("dt").length).toEqual(9);
        expect($sec.find("dt").eq(4).find("code").text()).toEqual("readonly");
        expect($sec.find("dd").length).toEqual(9);
        expect($sec.find("dt").first().find("code").first().text()).toEqual("dates");
        expect($sec.find("dt").first().find(".idlAttrType").text()).toEqual("sequence<Date>");
        expect($sec.find("dd").first().text()).toEqual("3.5");
        expect($sec.find("dt").eq(3).find("code").first().text()).toEqual("operation");
        expect($sec.find("dt").eq(3).find(".idlAttrType").text()).toEqual("Promise<DOMString>");
        expect($sec.find("dd").eq(3).text()).toEqual("4.0");
        expect($sec.find("dt").eq(8).find(".idlAttrType").text()).toEqual("sequence<Promise<Superstar>>");
        expect($sec.find("dd").eq(8).text()).toEqual("4.5");
    });

    it("should handle operations", function () {
        $target = $("#meth-basic", doc);
        text =  "interface SuperStar {\n" +
                "    void               basic ();\n" +
                "    [Something]\n" +
                "    void               ext ();\n" +
                "    unsigned long long ull ();\n" +
                "    SuperStar?         ull ();\n" +
                "    SuperStar[][][][]  paramed (SuperStar[][][] one, [ExtAttrs] ByteString? ext, optional short maybe, optional short[] shorts, optional short[][][][] hypercubes, optional short defaulted = 3.5, optional DOMString defaulted2 = \"one\", optional short... variable);\n" +
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
        expect($lst.find(".idlParam:contains('optional')").length).toEqual(6);
        expect($lst.find(".idlParam").first().find(".idlParamType > a").text()).toEqual("SuperStar");
    });

    it("should handle serializer", function () {
        $target = $("#serializer-map", doc);
        text =  "interface SuperStar {\n" +
                "                attribute DOMString foo;\n" +
                "                attribute DOMString bar;\n" +
                "    serializer = {foo, bar};\n" +
                "};";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlSerializer").length).toEqual(1);
        var $serializer = $target.find(".idlSerializer").first();
        expect($serializer.find(".idlSerializerValues").text()).toEqual("{foo, bar}");
    });

    it("should handle maplike", function() {
      $target = $("#if-maplike", doc);
      text = "interface SuperStar {\n" +
             "    void foo ();\n" +
             "    maplike<DOMString, SuperStar>;\n" +
             "                attribute DOMString bar;\n" +
             "};";
      expect($target.text()).toEqual(text);
      expect($target.find(".idlMaplike").length).toEqual(1);
      var $iterable = $target.find(".idlMaplike").first();
      expect($iterable.find(".idlMaplikeKeyType").text()).toEqual("DOMString");
      expect($iterable.find(".idlMaplikeValueType").text()).toEqual("SuperStar");
    });
    
    it("should handle readonly maplike", function() {
      $target = $("#if-readonly-maplike", doc);
      text = "interface SuperStar {\n" +
             "    void foo ();\n" +
             "    readonly maplike<DOMString, SuperStar>;\n" +
             "                attribute DOMString bar;\n" +
             "};";
      expect($target.text()).toEqual(text);
      expect($target.find(".idlMaplike").length).toEqual(1);
      var $iterable = $target.find(".idlMaplike").first();
      expect($iterable.find(".idlMaplikeKeyType").text()).toEqual("DOMString");
      expect($iterable.find(".idlMaplikeValueType").text()).toEqual("SuperStar");
    });

    it("should handle value iterable", function() {
      $target = $("#if-iterable", doc);
      text = "interface AnIterableInterface {\n" +
             "    iterable<DOMString>;\n" +
             "                attribute DOMString foo;\n" +
             "                attribute DOMString bar;\n" +
             "};";
      expect($target.text()).toEqual(text);
      expect($target.find(".idlIterable").length).toEqual(1);
      var $iterable = $target.find(".idlIterable").first();
      expect($iterable.find(".idlIterableKeyType").text()).toEqual("DOMString");
    });

    it("should handle pair iterable", function() {
      $target = $("#if-iterable-pairs", doc);
      text = "interface AnIterablePairInterface {\n" +
             "    iterable<DOMString,SuperStar>;\n" +
             "                attribute DOMString foo;\n" +
             "                attribute DOMString bar;\n" +
             "};";
      expect($target.text()).toEqual(text);
      expect($target.find(".idlIterable").length).toEqual(1);
      var $iterable = $target.find(".idlIterable").first();
      expect($iterable.find(".idlIterableKeyType").text()).toEqual("DOMString");
      expect($iterable.find(".idlIterableValueType").text()).toEqual("SuperStar");
    });

    it("should handle comments", function () {
        $target = $("#comments-basic", doc);
        text =  "interface SuperStar {\n" +
                "    // This is a comment\n" +
                "    // over two lines.\n" +
                "};";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlSectionComment").length).toEqual(2);
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
                "             DOMString           value;\n" +
                "             DOMString?          nullable;\n" +
                "    [Something]\n" +
                "             float               ext;\n" +
                "             unsigned long long  longLong;\n" +
                "             boolean             test = true;\n" +
                "             byte                little = 2;\n" +
                "             byte                big = Infinity;\n" +
                "             byte                cheese = NaN;\n" +
                "    required sequence<DOMString> names;\n" +
                "             DOMString           blah = \"blah blah\";\n" +
                "};";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlMember").length).toEqual(10);
        var $mem = $target.find(".idlMember").first();
        expect($mem.find(".idlMemberType").text()).toEqual("DOMString");
        expect($mem.find(".idlMemberName").text()).toEqual("value");
        expect($target.find(".idlMember").last().find(".idlMemberValue").text()).toEqual('"blah blah"');

        var $sec = $("#dictionary-superstar-members dl.dictionary-members", doc);
        expect($sec.find("dt").length).toEqual(10);
        expect($sec.find("dd").length).toEqual(10);
        expect($sec.find("dt").first().find("code").first().text()).toEqual("big");
        expect($sec.find("dt").first().find("code").last().text()).toEqual("Infinity");
        expect($sec.find("dt").first().find(".idlMemberType").text()).toEqual("byte");
        expect($sec.find("dd").first().text()).toEqual("8");
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
        text =  "exception SuperStar {\n" +
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

        var $sec = $("#fields dl.fields", doc);
        expect($sec.find("dt").length).toEqual(4);
        expect($sec.find("dd").length).toEqual(4);
        expect($sec.find("dt").first().find("code").first().text()).toEqual("floats");
        expect($sec.find("dt").first().find(".idlFieldType a").text()).toEqual("SuperStar");
        expect($sec.find("dd").first().text()).toEqual("3");

        $sec = $("#constants-2 dl.constants", doc);
        expect($sec.find("dt").length).toEqual(1);
        expect($sec.find("dd").length).toEqual(1);
        expect($sec.find("dt").first().find("code").first().text()).toEqual("value");
        expect($sec.find("dt").first().find(".idlConstType a").text()).toEqual("SuperStar");
        expect($sec.find("dd").first().text()).toEqual("1");
    });

    it("should handle enumerations", function () {
        $target = $("#enum-basic", doc);
        text = "enum SuperStar {\n    \"one\",\n    \"two\",\n    \"three\",\n    \"white space\"\n};";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlEnum").length).toEqual(1);
        expect($target.find(".idlEnumID").text()).toEqual("SuperStar");
        expect($target.find(".idlEnumItem").length).toEqual(4);
        expect($target.find(".idlEnumItem").first().text()).toEqual("one");

        var $sec = $target.next("table.simple");
        expect($sec.find("th").attr("colspan")).toEqual("2");
        expect($sec.find("th").text()).toEqual("Enumeration description");
        expect($sec.find("tr").length).toEqual(5);
        expect($sec.find("td").text()).toEqual("one1two2three3white space4");
    });

    it("should handle callbacks", function () {
        $target = $("#cb-basic", doc);
        text = "callback SuperStar = void ();";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlCallback").length).toEqual(1);
        expect($target.find(".idlCallbackID").text()).toEqual("SuperStar");
        expect($target.find(".idlCallbackType").text()).toEqual("void");

        $target = $("#cb-less-basic", doc);
        text = "callback SuperStar = unsigned long long? (optional any value);";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlCallbackType").text()).toEqual("unsigned long long?");
        var $prm = $target.find(".idlCallback").last().find(".idlParam");
        expect($prm.length).toEqual(1);
        expect($prm.find(".idlParamType").text()).toEqual("any");
        expect($prm.find(".idlParamName").text()).toEqual("value");

        var $sec = $("#callback-superstar-parameters dl.callback-members", doc);
        expect($sec.find("dt").length).toEqual(1);
        expect($sec.find("dd").length).toEqual(1);
        expect($sec.find("dt").first().find("code").first().text()).toEqual("value");
        expect($sec.find("dt").first().find(".idlMemberType").text()).toEqual("any");
        expect($sec.find("dd").first().text()).toEqual("1");
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

        var $sec = $("#typedefs", doc);
        expect($sec.find(".idlTypedefDesc").first().text()).toEqual("Throughout this specification, the identifier string is used to refer to the DOMString type.");
        expect($sec.find(".idlTypedefDesc").first().find(".idlTypedefID").text()).toEqual("string");
        expect($sec.find(".idlTypedefDesc").first().find(".idlTypedefType").text()).toEqual("DOMString");
        expect($sec.find(".idlTypedefDesc").last().text()).toEqual("Throughout this specification, the identifier sth is used to refer to the unsigned long long (nullable) type.");
    });

    it("should handle implements", function () {
        $target = $("#impl-basic", doc);
        text = "Window implements Breakable;";
        expect($target.text()).toEqual(text);
        expect($target.find(".idlImplements").length).toEqual(1);

        $target = $("#impl-less-basic", doc);
        text = "[Something]\n" + text;
        expect($target.text()).toEqual(text);

        var $sec = $("#implements", doc);
        expect($sec.find(".idlImplementsDesc").first().text()).toEqual("All instances of the Window type are defined to also implement the Breakable interface.");
    });
});
