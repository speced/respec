
// XXX untested

// Module w3c/data-include
// Support for the data-include attribute
// 
// IMPORTANT:
//  This module only really works when you are in an HTTP context, and will most likely
//  fail if you are editing your documents on your local drive. That is due to security
//  restrictions in the browser.

define(
    ["core/utils"],
    function (utils) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "w3c/data-include");



                msg.pub("end", "w3c/data-include");
                cb();
            }
        };
    }
);

includeFiles: function() {
    var divs = document.querySelectorAll("[data-include]");
    for (var i = 0; i < divs.length; i++) {
        var div = divs[i];
        var URI = div.getAttribute('data-include');
        var content = this._readFile(URI) ;
        if (content) {
            var flist = div.getAttribute('data-oninclude');
            if (flist) {
                var methods = flist.split(/\s+/) ;
                for (var j = 0; j < methods.length; j++) {
                    var call = 'content = ' + methods[j] + '(this,content,URI)' ;
                    try {
                        eval(call) ;
                    } catch (e) {
                        warning('call to ' + call + ' failed with ' + e) ;
                    }
                }
                div.removeAttribute('data-oninclude') ;
            }
            div.removeAttribute('data-include') ;
            div.innerHTML = content ;
        }
    }
},



// WARNING
//  This uses proxyLoad. It will attempt to work from the local drive, but you are
//  advised that it is likely to fail. It is recommended that if you wish to use this
//  feature, while writing your document, you view it using a local web server.

define(
    ["core/utils"],
    function (utils) {
        return {
            run:    function (conf, doc, cb) {
                progress("running data includes");
                this.doc = doc;
                this.cb = cb;
                
                // Process each, in turn.
                // Invoke callback on last node.
                this.processNodes();
            },
            // Process the first found node. When no nodes found
            // invoke callback. This ensure that included data
            // may itself include data, and that no further processing
            // occurs until data inclusion is complete.
            processNodes:   function () {
    	        var root = $(this.doc.documentElement);
                var nodeList = root.find("[data-include]");
                if (nodeList.length == 0) {
                    progress("done with data includes");
                    this.cb();
                }
                else {
                    var node = nodeList.get(0);
                    var uri = node.getAttribute('data-include'),
                        format = node.getAttribute("data-include-format") || "html";
                    
                    // Remove data-include attribute so that it is not processed
                    // a second time.
                    node.removeAttribute('data-include');
                    node.removeAttribute('data-include-format');
                    progress("processing data include: " + uri);
                    this.proxyLoad(uri, this.updateNode(uri, node, format));
                }
            },
            
            cb:   null,
            doc:  null,
            
            // Define internal proxyLoad to support QUnit mocking
            proxyLoad: function(src, cb) {
                utils.proxyLoad(src, cb);
            },
            
            // Update the node with the returned data and call
            // the next node in the list, or the callback when done.
            updateNode:    function (uri, node, format) {
                var self = this;
                return function (data) {
                    //alert("uri: " + uri + ", node: " + node + ", data: " + data)
                    if (data) {
                        var flist = node.getAttribute('data-oninclude');
                        node.removeAttribute('data-oninclude') ;
                        data = utils.runTransforms(data, flist);
                        if (format === "text") $(node).text(data);
                        else                   $(node).html(data);
                    }
                    progress("data include (" + uri + ") with format " + format + ": done");
                    
                    // Find next node to process.
                    self.processNodes();
                };
            },
            ieDummy: 1
        };
    }
);

