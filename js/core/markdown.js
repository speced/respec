/*global marked*/
// Module core/markdown
// Handles the optional markdown processing.
//
// Markdown support is optional. It is enabled by setting the `format`
// property of the configuration object to "markdown."
//
// We use marked for parsing Markdown.
//
// Note that the content of SECTION elements, and elements with a
// class name of "note", "issue" or "req" are also parsed.
//
// The HTML created by the Markdown parser is turned into a nested
// structure of SECTION elements, following the strucutre given by
// the headings. For example, the following markup:
//
//     Title
//     -----
//
//     ### Subtitle ###
//
//     Here's some text.
//
//     ### Another subtitle ###
//
//     More text.
//
// will be transformed into:
//
//     <section>
//       <h2>Title</h2>
//       <section>
//         <h3>Subtitle</h3>
//         <p>Here's some text.</p>
//       </section>
//       <section>
//         <h3>Another subtitle</h3>
//         <p>More text.</p>
//       </section>
//     </section>
//

define(
    ['core/marked'],
    function () {
        marked.setOptions({
            gfm: false,
            pedantic: false,
            sanitize: false
        });
        
        function makeBuilder(doc) {
            var root = doc.createDocumentFragment()
            ,   stack = [root]
            ,   current = root
            ,   HEADERS = /H[1-6]/
            ;

            function findPosition(header) {
                return parseInt(header.tagName.charAt(1), 10);
            }

            function findParent(position) {
                var parent;
                while (position > 0) {
                    position--;
                    parent = stack[position];
                    if (parent) return parent;
                }
            }

            function findHeader(node) {
                node = node.firstChild;
                while (node) {
                    if (HEADERS.test(node.tagName)) {
                        return node;
                    }
                    node = node.nextSibling;
                }
                return null;
            }

            function addHeader(header) {
              var section = doc.createElement('section')
              ,   position = findPosition(header)
              ;

              section.appendChild(header);
              findParent(position).appendChild(section);
              stack[position] = section;
              stack.length = position + 1;
              current = section;
            }

            function addSection(node, process) {
                var header = findHeader(node)
                ,   position = header ? findPosition(header) : 1
                ,   parent = findParent(position)
                ;

                if (header) {
                    node.removeChild(header);
                }

                node.appendChild(process(node));

                if (header) {
                    node.insertBefore(header, node.firstChild);
                }

                parent.appendChild(node);
                current = parent;
            }

            function addElement(node) {
                current.appendChild(node);
            }

            function getRoot() {
                return root;
            }

            return {
                addHeader: addHeader,
                addSection: addSection,
                addElement: addElement,
                getRoot: getRoot
            };
        }

        return {
            toHTML: function(text) {
                // As markdown is pulled from HTML > is already escaped, and
                // thus blockquotes aren't picked up by the parser. This fixes
                // it.
                text = text.replace(/&gt;/g, '>');
                text = this.removeLeftPadding(text);
                return marked(text);
            },
            
            removeLeftPadding: function(text) {
                // Handles markdown content being nested
                // inside elements with soft tabs. E.g.:
                // <div>
                //     This is a title
                //     ---------------
                //
                //     And this more text.
                // </div
                //
                // Gets turned into:
                // <div>
                //     <h2>This is a title</h2>
                //     <p>And this more text.</p>
                // </div
                //
                // Rather than:
                // <div>
                //     <pre><code>This is a title
                // ---------------
                //
                // And this more text.</code></pre>
                // </div

                var match = text.match(/\n[ ]+\S/g)
                ,   current
                ,   min
                ;

                if (match) {
                    min = match[0].length - 2;
                    for (var i = 0, length = match.length; i < length; i++) {
                        current = match[i].length - 2;
                        if (typeof min == 'undefined' || min > current) {
                            min = current;
                        }
                    }

                    var re = new RegExp("\n[ ]{0," + min + "}", "g");
                    text = text.replace(re, '\n');
                }
                return text;
            },

            processBody: function(doc) {
                var fragment = doc.createDocumentFragment()
                ,   div = doc.createElement('div')
                ,   node
                ;
                
                div.innerHTML = this.toHTML(doc.body.innerHTML);
                while (node = div.firstChild) {
                    fragment.appendChild(node);
                }
                return fragment;
            },
            
            processSections: function(doc) {
                var self = this;
                $('section', doc).each(function() {
                    this.innerHTML = self.toHTML(this.innerHTML);
                });
            },
            
            processIssuesNotesAndReqs: function(doc) {
                var div = doc.createElement('div');
                var self = this;
                $('.issue, .note, .req', doc).each(function() {
                    div.innerHTML = self.toHTML(this.innerHTML);
                    this.innerHTML = '';
                    var node = div.firstChild;
                    while (node.firstChild) {
                        this.appendChild(node.firstChild);
                    }
                });
            },
            
            structure: function(fragment, doc) {
                function process(root) {
                    var node
                    ,   tagName
                    ,   stack = makeBuilder(doc)
                    ;

                    while (node = root.firstChild) {
                        if (node.nodeType !== 1) {
                            root.removeChild(node);
                            continue;
                        }
                        tagName = node.tagName.toLowerCase();
                        switch (tagName) {
                            case 'h1':
                            case 'h2':
                            case 'h3':
                            case 'h4':
                            case 'h5':
                            case 'h6':
                                stack.addHeader(node);
                                break;
                            case 'section':
                                stack.addSection(node, process);
                                break;
                            default:
                                stack.addElement(node);
                        }
                    }

                    return stack.getRoot();
                }

                return process(fragment);
            },

            run: function (conf, doc, cb, msg) {
                msg.pub("start", "core/markdown");
                if (conf.format === 'markdown') {
                    // Marked, the Markdown implementation we're currently using
                    // parses markdown nested in markup (unless it's in a section element).
                    // Turns out this is both what we need and generally not what other
                    // parsers do.
                    // In case we switch to another parser later on, we'll need to
                    // uncomment the below line of code.
                    //
                    // this.processIssuesNotesAndReqs(doc);
                    this.processSections(doc);
                    // the processing done here blows away the ReSpec UI (or rather, the elements
                    // that it needs to reference). So we save a reference to the original element
                    // and re-inject it later
                    var $rsUI = $("#respec-ui");
                    var fragment = this.structure(this.processBody(doc), doc);
                    doc.body.innerHTML = '';
                    doc.body.appendChild(fragment);
                    if ($rsUI.length) $("#respec-ui").replaceWith($rsUI);
                }
                msg.pub("end", "core/markdown");
                cb();
            }
        };
    }
);
