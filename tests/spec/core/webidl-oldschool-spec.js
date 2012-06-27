describe("Core - WebIDL", function () {
    var MAXOUT = 5000
    ,   $widl = $("<iframe width='800' height='200' style='display: none' src='spec/core/webidl.html'></iframe>")
    ,   loaded = false
    ;
    window.addEventListener("message", function () { loaded = true; }, false);
    runs(function () {
        $widl.appendTo($("body"));
    });
    waitsFor(function () { return loaded; }, MAXOUT);

    // XXX
    //  for each of these
    //      - get the text of the IDL and compare it
    //      - check the important parts of the highlighting
    //      - look at the generated HTML for all of the important stuff

    it("should handle interfaces", function () {
        // ...
    });

    it("should handle constants", function () {
        // ...
    });

    it("should handle attributes", function () {
        // ...
    });

    it("should handle operations", function () {
        // ...
    });

    it("should handle dictionaries", function () {
        // ...
    });

    it("should handle exceptions", function () {
        // ...
    });

    it("should handle enumerations", function () {
        // ...
    });

    it("should handle callbacks", function () {
        // ...
    });

    it("should handle typedefs", function () {
        // ...
    });

    it("should handle implements", function () {
        // ...
    });

});

