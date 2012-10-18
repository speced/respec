describe("Core - Markdown", function () {
    var MAXOUT = 5000
    ,   basicConfig = {
            editors:    [{ name: "Robin Berjon" }]
        ,   specStatus: "WD"
        ,   format: "markdown"
        };
    it("should process standard markdown content", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig,
                        body: '\nFoo\n===\n'
                    }, function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);

        runs(function () {
            var $foo = $('#foo', doc);
            expect($foo.length).toEqual(1);
            expect($foo.text()).toEqual("1. Foo");
        });
    });
    
    it("should process markdown inside of sections", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig,
                        body: '<section>\nFoo\n===\n</section>'
                    }, function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);

        runs(function () {
            var $foo = $('#foo', doc);
            expect($foo.length).toEqual(1);
            expect($foo.text()).toMatch(/1\. Foo/);
        });
    });
    
    it("should process markdown inside of notes, issues and reqs.", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig,
                        body: '<p class=note>_foo_</p><div class=issue>_foo_</div><ul><li class=req>\n### _foo_###\n</li></ul>'
                    }, function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);

        runs(function () {
            expect($('.note em', doc).length).toEqual(1);
            expect($('.issue em', doc).length).toEqual(1);
            expect($('.req em', doc).length).toEqual(1);
            expect($('.req h3', doc).length).toEqual(1);
        });
    });
    
    it("should remove left padding before processing markdown content", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig,
                        body: '\n    Foo\n    ===\n'
                    }, function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);

        runs(function () {
            expect($('code', doc).length).toEqual(0);
        });
    });
    
    it("should structure content in nested sections with appropriate titles", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig,
                        body: '\nFoo\n===\n\nBar\n---\n\nBaz\n---\n\n### Foobar ###\n\n#### Foobaz ####\n\nZing\n---\n\n'
                    }, function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        
        runs(function () {
            var $foo = $('#foo', doc);
            expect($foo.prop("tagName")).toEqual('SECTION');
            expect($foo.find('> h2').length).toEqual(1);
            expect($foo.find('> h2').text()).toEqual("1. Foo");
        
            expect($foo.find('#bar').prop("tagName")).toEqual('SECTION');
            expect($foo.find('#bar > h3').length).toEqual(1);
            expect($foo.find('#bar > h3').text()).toEqual("1.1 Bar");
            
            expect($foo.find('#baz').prop("tagName")).toEqual('SECTION');
            expect($foo.find('#baz > h3').length).toEqual(1);
            expect($foo.find('#baz > h3').text()).toEqual("1.2 Baz");
            
            expect($foo.find('#baz > #foobar').prop("tagName")).toEqual('SECTION');
            expect($foo.find('#baz > #foobar > h4').length).toEqual(1);
            expect($foo.find('#baz > #foobar > h4').text()).toEqual("1.2.1 Foobar");
            
            expect($foo.find('#baz > #foobar > #foobaz').prop("tagName")).toEqual('SECTION');
            expect($foo.find('#baz > #foobar > #foobaz > h5').length).toEqual(1);
            expect($foo.find('#baz > #foobar > #foobaz > h5').text()).toEqual("1.2.1.1 Foobaz");
            
            expect($foo.find('#zing').prop("tagName")).toEqual('SECTION');
            expect($foo.find('#zing > h3').length).toEqual(1);
            expect($foo.find('#zing > h3').text()).toEqual("1.3 Zing");
        });
    });
});