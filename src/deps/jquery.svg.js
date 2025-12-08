import jQuery from "./jquery.js";

const SVG_NS = "http://www.w3.org/2000/svg";

function applyAttrs(el, attrs = {}) {
  Object.entries(attrs).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    const attrName = key === "class_" ? "class" : key;
    el.setAttribute(attrName, String(value));
  });
}

class SvgPathBuilder {
  constructor() {
    this.d = "";
  }
  move(x, y) {
    this.d += `M${x} ${y}`;
    return this;
  }
  line(x, y, relative = false) {
    this.d += relative ? ` l${x} ${y}` : ` L${x} ${y}`;
    return this;
  }
  horiz(x) {
    this.d += ` H${x}`;
    return this;
  }
  vert(y) {
    this.d += ` V${y}`;
    return this;
  }
  close() {
    this.d += " Z";
    return this;
  }
  toString() {
    return this.d.trim();
  }
}

class SvgWrapper {
  constructor(root) {
    this.root = root;
    this.doc = root.ownerDocument;
  }

  configure(attrs = {}) {
    applyAttrs(this.root, attrs);
    return this.root;
  }

  group(parent = this.root, attrs = {}) {
    const g = this.doc.createElementNS(SVG_NS, "g");
    applyAttrs(g, attrs);
    parent.appendChild(g);
    return g;
  }

  rect(parent, x, y, width, height, rx = 0, ry = 0, attrs = {}) {
    const el = this.doc.createElementNS(SVG_NS, "rect");
    Object.assign(el, { x, y, width, height, rx, ry });
    applyAttrs(el, attrs);
    parent.appendChild(el);
    return el;
  }

  line(parent, x1, y1, x2, y2, attrs = {}) {
    const el = this.doc.createElementNS(SVG_NS, "line");
    applyAttrs(el, { x1, y1, x2, y2, ...attrs });
    parent.appendChild(el);
    return el;
  }

  text(parent, x, y, textNode, attrs = {}) {
    const el = this.doc.createElementNS(SVG_NS, "text");
    applyAttrs(el, { x, y, ...attrs });
    if (textNode instanceof this.doc.defaultView.Text || textNode instanceof this.doc.defaultView.SVGTextContentElement) {
      el.appendChild(textNode);
    } else if (textNode && textNode.nodeType) {
      el.appendChild(textNode);
    }
    parent.appendChild(el);
    return el;
  }

  createText() {
    const textNode = this.doc.createElementNS(SVG_NS, "text");
    return {
      string: str => {
        textNode.textContent = str;
        return textNode;
      },
    };
  }

  createPath() {
    return new SvgPathBuilder();
  }

  path(parent, pathObj, attrs = {}) {
    const el = this.doc.createElementNS(SVG_NS, "path");
    const d = typeof pathObj === "string" ? pathObj : pathObj?.toString?.();
    if (d) el.setAttribute("d", d);
    applyAttrs(el, attrs);
    parent.appendChild(el);
    return el;
  }

  change(element, attrs = {}) {
    applyAttrs(element, attrs);
    return element;
  }
}

jQuery.fn.svg = function(callback) {
  return this.each(function() {
    const host = this;
    const doc = host.ownerDocument;
    let svg = host.querySelector("svg");
    if (!svg) {
      svg = doc.createElementNS(SVG_NS, "svg");
      host.appendChild(svg);
    }
    const wrapper = new SvgWrapper(svg);
    if (typeof callback === "function") {
      callback.call(host, wrapper);
    }
  });
};

export default jQuery;
