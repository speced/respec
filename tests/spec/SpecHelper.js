"use strict";
var iframes = [];
function makeRSDoc (opts, cb) {
    var $ifr = $("<iframe src='about-blank.html' width='800' height='200' style='position: relative; margin-left: -10000px'></iframe>");
    opts = opts || {};
    $ifr.load(function () {
        var destDoc = $ifr[0].contentDocument
        ,   $body = $("body", destDoc)
        ,   $head = $("head", destDoc)
        ;
        // make it a real document here
        $("<meta charset='utf-8'/>", destDoc).prependTo($head);
        if (opts.htmlAttrs) $(destDoc.documentElement).attr(opts.htmlAttrs);
        if (opts.title) $("title", destDoc).text(opts.title);
        $body.append(opts.abstract || $("<section id='abstract'><p>test abstract</p></section>"));
        if (opts.body) $body.append(opts.body);
        var path = opts.jsPath || "../js/";
        var config = destDoc.createElement("script");
        $(config)
            .text("var respecConfig = " + JSON.stringify(opts.config || {}) + ";")
            .addClass("remove");
        $head[0].appendChild(config);
        var loader = destDoc.createElement("script");
        var loadAttr = (typeof window.callPhantom === 'function')   ?
                            { src: "/builds/respec-w3c-common.js" } :
                            { src: path + "require.js", "data-main": path + (opts.profile || "profile-w3c-common" )};
        $(loader)
            .attr(loadAttr)
            .addClass("remove");
        $head[0].appendChild(loader);
    });
    // trigger load
    $ifr.appendTo($("body"));
    iframes.push($ifr);

    // intercept that in the iframe we have finished processing
    window.addEventListener("message", function (ev) {
        if (ev.data && ev.data.topic == "end-all") cb($ifr[0].contentDocument);
    }, false);
}


function flushIframes () {
    while (iframes.length){
     // Poping them from the list prevents memory leaks.
     iframes.pop().remove();
    }
}

function pickRandomsFromList(list, howMany){
  // Get at least half by default.
  if(!howMany){
    howMany = Math.floor(list.length / 2);
  }
  if(howMany > list.length) {
    // Return a new list, but randomized.
    return list
        .slice()
        .sort(function randomSort(){
            return Math.round(Math.random() * (1 - (-1)) + -1);
        });
  }
  var collectedValues = [];
  // collect a unique set based on howMany we need.
  while(collectedValues.length < howMany){
    var potentialValue = Math.floor(Math.random() * list.length);
    if(collectedValues.indexOf(potentialValue) === -1){
      collectedValues.push(potentialValue);
    }
  }
  // Reduce the collectedValues into a new list
  return collectedValues.reduce(function(randList, next){
    randList.push(list[next]);
    return randList;
  }, []);
}

function isPhantom() {
  return window.callPhantom || window._phantom;
}
