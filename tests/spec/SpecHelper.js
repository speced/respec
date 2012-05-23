
// XXX
//  - check that directly embedding a spec sends us messages, if not fix and try again
//  - then check that you can run script from an about:blank doc
//  - then check that you can postMessage from it
//  - then try loading an actual document and modifying it (possibly adding a "start-paused" variant of RS)

function makeRSDoc (opts, cb) {
    var $ifr = $("<iframe width='100' height='100' style='display: none'></iframe>")
    ,   doc = document.implementation.createHTMLDocument("")
    ,   $head = $("head", doc)
    ,   $body = $("body", doc)
    ;
    $ifr.appendTo($("body"));
    var destDoc = $ifr[0].contentDocument;
    console.log("destDoc", destDoc.documentElement.innerHTML);
    // make it a real document here
    $("<meta charset='utf-8'/>", doc).prependTo($head);
    if (opts.htmlAttrs) $(doc.documentElement).attr(opts.htmlAttrs);
    if (opts.title) $("title", doc).text(opts.title);
    var path = opts.jsPath || "../js/";
    var scr1 = doc.createElement("script");
    $(scr1)
        .attr({ src: path + "require.js", "data-main": path + (opts.profile || "profile-w3c-common" )})
        .addClass("remove")
        .appendTo($head);
    $head[0].appendChild(scr1);
    var scr2 = doc.createElement("script");
    $(scr2)
        .text("var respecConfig = " + JSON.stringify(opts.config || {}) + ";")
        .addClass("remove")
        .appendTo($head);
    $head[0].appendChild(scr2);
    $body.append(opts.abstract || $("<section id='abstract'><p>test abstract</p></section>"));
    // import into iframe
    var newNode = destDoc.importNode(doc.documentElement, true);
    destDoc.replaceChild(newNode, destDoc.documentElement);
    console.log("destDoc", destDoc.documentElement.innerHTML);
    // intercept that in the iframe we have finished processing
    window.addEventListener("message", function (ev) {
        console.log("ev!");
        if (ev.data && ev.data.topic == "end-all") cb(destDoc);
    }, false);
}

window.addEventListener("message", function (ev) {
    console.log("MSG", ev.data);
}, false);



// beforeEach(function() {
//   this.addMatchers({
//     toBePlaying: function(expectedSong) {
//       var player = this.actual;
//       return player.currentlyPlayingSong === expectedSong && 
//              player.isPlaying;
//     }
//   });
// });
