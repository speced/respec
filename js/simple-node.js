/*global berjon*/

if (typeof(berjon) == "undefined") window.berjon = {};
berjon.simpleNode = function (ns, doc) {
    if (!ns) ns = {};
    if (!doc) doc = document;
    this.ns = ns;
    this.doc = doc;
};
berjon.calls = {};
berjon.simpleNode.prototype = {

    // --- NODE CREATION ---
    element:    function (name, attr, parent, content) {
        if (!attr) attr = {};
        var nmSt = this._nameToQName(name, false);
        var el = this.doc.createElementNS(nmSt.ns, name);
        for (var k in attr) this._setAttr(el, k, attr[k]);
        if (parent) parent.appendChild(el);
        if (content) {
            if (content instanceof jQuery) $(el).append(content);
            else if (content instanceof Array) for (var i = 0; i < content.length; i++) $(el).append(content[i]);
            else this.text(content, el);
        }
        return el;
    },
    
    text:    function (txt, parent) {
        var tn = this.doc.createTextNode(txt);
        if (parent) parent.appendChild(tn);
        return tn;
    },
    
    documentFragment:    function (parent, content) {
        var df = this.doc.createDocumentFragment();
        if (content) {
            if (content instanceof Array) for (var i = 0; i < content.length; i++) df.appendChild(content[i]);
            else this.text(content, df);
        }
        if (parent) parent.appendChild(df);
        return df;
    },
    
    // --- ID MANAGEMENT ---
    makeID: function (el, pfx, txt) {
        if (el.hasAttribute("id")) return el.getAttribute("id");
        var id = "";
        if (!txt) {
            if (el.hasAttribute("title")) txt = el.getAttribute("title");
            else                          txt = el.textContent;
        }
        txt = txt.replace(/^\s+/, "");
        txt = txt.replace(/\s+$/, "");
        id += txt;
        id = id.toLowerCase();
        if (id.length === 0) id = "generatedID";
        id = this.sanitiseID(id);
        if (pfx) id = pfx + "-" + id;
        id = this.idThatDoesNotExist(id);
        el.setAttribute("id", id);
        return id;
    },
    
    sanitiseID:    function (id) {
        id = id.split(/[^\-.0-9a-zA-Z_]/).join("-");
        id = id.replace(/^-+/g, "");
        id = id.replace(/-+$/, "");
        if (id.length > 0 && /^[^a-z]/.test(id)) id = "x" + id;
        if (id.length === 0) id = "generatedID";
        return id;
    },
    
    idCache: {},
    idThatDoesNotExist:    function (id) {
        var inc = 1;
        if (this.doc.getElementById(id) || this.idCache[id]) {
            while (this.doc.getElementById(id + "-" + inc) || this.idCache[id + "-" + inc]) inc++;
            id = id + "-" + inc;
        }
        // XXX disable caching for now
        // this.idCache[id] = true;
        return id;
    },
    
    // --- CLASS HANDLING ---
    addClass:    function (el, cl) {
        var ls = this.listClasses(el);
        if (ls.indexOf(cl) >= 0) return;
        ls.push(cl);
        this.setClassList(el, ls);
    },
    
    listClasses:    function (el) {
        if (el.hasAttribute("class")) {
            return el.getAttribute("class").split(/\s+/);
        }
        else return [];
    },
    
    setClassList:    function (el, ls) {
        el.setAttribute("class", ls.join(" "));
    },
    
    // --- HELPERS ---
    _nameToQName:    function (name, isAttr) {
        var matches = /^(.+):(.+)$/.exec(name);
        var pfx, ns, ln;
        if (matches) {
            pfx = matches[1];
            ln = matches[2];
            if (!this.ns[pfx]) throw "No namespace declared for prefix '" + pfx + "'";
            ns = this.ns[pfx];
        }
        else {
            if (isAttr) ns = null;
            else        ns = this.ns[""];
            ln = name;
        }
        return { ns: ns, ln: ln };
    },
    
    _setAttr:    function (el, name, value) {
        var nmSt = this._nameToQName(name, true);
        el.setAttributeNS(nmSt.ns, nmSt.ln, value);
    }
};
