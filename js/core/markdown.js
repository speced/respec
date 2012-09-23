// Module core/markdown
// Handles the optional markdown processing.
// 
// Markdown support is optional. It is enabled by setting the `format`
// property of the configuration object to "markdown."
// 
// We use marked for parsing Markkdown.
// 
// Note that the content of SECTION elements, and P elements with a
// class name of "note" or "issue" is also parsed.
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

define(
    ['core/marked'],
    function (markdown) {
        marked.setOptions({
            gfm: false,
            pedantic: false,
            sanitize: false
        });
        
        return {
            toHTML: function(text) {
                text = text.replace(/&gt;/g, '>');
                return marked(text);
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
            
            processIssuesAndNotes: function(doc) {
                var div = doc.createElement('div');
                var self = this;
                $('p.issue, p.note', doc).each(function() {
                    div.innerHTML = self.toHTML(this.innerHTML);
                    this.innerHTML = '';
                    var node = div.firstChild;
                    while (node.firstChild) {
                        this.appendChild(node.firstChild);
                    }
                });
            },
            
            structure: function(fragment, doc) {
                var output = doc.createDocumentFragment()
                ,   current = output
                ,   stack = [output]
                ,   node
                ,   tagName
                ;
                
                function newSection(node, position) {
                    var section = doc.createElement('section');
                    section.appendChild(node);
                    findParent(position).appendChild(section);
                    stack[position] = section;
                    current = section;
                }

                function findParent(position) {
                    while (1) {
                        position--
                        parent = stack[position];
                        if (parent) return parent;
                    }
                }
                
                while (node = fragment.firstChild) {
                    if (node.nodeType !== 1) {
                        fragment.removeChild(node);
                        continue;
                    }
                    tagName = node.tagName.toLowerCase();
                    switch (tagName) {
                        case 'h1':
                            newSection(node, 1);
                            break;
                        case 'h2':
                            newSection(node, 2);
                            break;
                        case 'h3':
                            newSection(node, 3);
                            break;
                        case 'h4':
                            newSection(node, 4);
                            break;
                        case 'h5':
                            newSection(node, 5);
                            break;
                        case 'h6':
                            newSection(node, 6);
                            break;
                        default:
                            current.appendChild(node);
                    }
                }

                return output;
            },
            
            run: function (conf, doc, cb, msg) {
                msg.pub("start", "core/markdown");
                if (conf.format === 'markdown') {
                    this.processIssuesAndNotes(doc);
                    this.processSections(doc);
                    fragment = this.structure(this.processBody(doc), doc);
                    doc.body.innerHTML = '';
                    doc.body.appendChild(fragment)
                }
                msg.pub("end", "core/markdown");
                cb();
            }
        };
    }
);
