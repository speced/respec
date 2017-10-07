import { pub } from "core/pubsubhub";
import { norm } from "core/utils";
import "deps/jquery";

export const name = "core/jquery-enhanced";

window.$ = $;

// --- JQUERY EXTRAS -----------------------------------------------------------------------
// Applies to any jQuery object containing elements, changes their name to the one give, and
// return a jQuery object containing the new elements
window.$.fn.renameElement = function(name) {
  var arr = [];
  this.each(function() {
    var $newEl = $(this.ownerDocument.createElement(name));
    // I forget why this didn't work, maybe try again
    // $newEl.attr($(this).attr());
    for (var i = 0, n = this.attributes.length; i < n; i++) {
      var at = this.attributes[i];
      try {
        $newEl[0].setAttributeNS(at.namespaceURI, at.name, at.value);
      } catch (err) {
        var msg = "Your HTML markup is malformed. Error in: \n";
        msg += "```HTML\n" + this.outerHTML + "\n```";
        pub("error", msg);
        break; // no point in continuing with this element
      }
    }
    $(this)
      .contents()
      .appendTo($newEl);
    $(this).replaceWith($newEl);
    arr.push($newEl[0]);
  });
  return $(arr);
};

// For any element, returns an array of title strings that applies
// the algorithm used for determining the
// actual title of a <dfn> element (but can apply to other as well).
//
// if args.isDefinition is true, then the element is a definition, not a
// reference to a definition.  Any @title or @lt will be replaced with
// @data-lt to be consistent with Bikeshed / Shepherd.
//
// This method now *prefers* the data-lt attribute for the list of
// titles.  That attribute is added by this method to dfn elements, so
// subsequent calls to this method will return the data-lt based list.
//
// This method will publish a warning if a title is used on a definition
// instead of an @lt (as per specprod mailing list discussion).
window.$.fn.getDfnTitles = function(args) {
  var theAttr = "";
  var titleString = "";
  var normalizedText = "";
  //data-lt-noDefault avoid using the text content of a definition
  //in the definition list.
  if (this.attr("data-lt-noDefault") === undefined) {
    normalizedText = norm(this.text()).toLowerCase();
  }
  if (this.attr("data-lt")) {
    theAttr = this.attr("data-lt") ? "data-lt" : "lt";
    // prefer @data-lt for the list of title aliases
    titleString = this.attr(theAttr).toLowerCase();
    if (normalizedText !== "") {
      //Regex: starts with the "normalizedText|"
      var startsWith = new RegExp("^" + normalizedText + "\\|");
      // Use the definition itself, so to avoid
      // having to declare the definition twice.
      if (!startsWith.test(titleString)) {
        titleString =  titleString + "|" + normalizedText;
      }
    }
  } else if (
    this.contents().length === 1 &&
    this.children("abbr, acronym").length === 1 &&
    this.find(":first-child").attr("title")
  ) {
    titleString = this.find(":first-child").attr("title");
  } else {
    titleString = this.text() === '""' ? "the-empty-string" : this.text();
  }
  // now we have a string of one or more titles
  titleString = norm(titleString).toLowerCase();
  if (args && args.isDefinition === true) {
    // if it came from an attribute, replace that with data-lt as per contract with Shepherd
    if (theAttr) {
      this.attr("data-lt", titleString);
    }
    if (theAttr !== "data-lt") {
      this.removeAttr(theAttr);
    }
    // if there is no pre-defined type, assume it is a 'dfn'
    if (!this.attr("dfn-type")) {
      this.attr("data-dfn-type", "dfn");
    } else {
      this.attr("data-dfn-type", this.attr("dfn-type"));
      this.removeAttr("dfn-type");
    }
  }
  const titles = titleString
    .split("|")
    .filter(item => item !== "")
    .reduce((collector, item) => collector.add(item), new Set());
  return [...titles];
};

// For any element (usually <a>), returns an array of targets that
// element might refer to, of the form
// {for_: 'interfacename', title: 'membername'}.
//
// For an element like:
//  <p link-for="Int1"><a for="Int2">Int3.member</a></p>
// we'll return:
//  * {for_: "int2", title: "int3.member"}
//  * {for_: "int3", title: "member"}
//  * {for_: "", title: "int3.member"}
window.$.fn.linkTargets = function() {
  var elem = this;
  var linkForElem = this[0].closest("[data-link-for]");
  var linkFor = linkForElem ? linkForElem.dataset.linkFor.toLowerCase() : "";
  var titles = elem.getDfnTitles();
  var result = [];
  window.$.each(titles, function() {
    result.push({
      for_: linkFor,
      title: this,
    });
    var split = this.split(".");
    if (split.length === 2) {
      // If there are multiple '.'s, this won't match an
      // Interface/member pair anyway.
      result.push({
        for_: split[0],
        title: split[1],
      });
    }
    result.push({
      for_: "",
      title: this,
    });
  });
  return result;
};

// Applied to an element, sets an ID for it (and returns it), using a specific prefix
// if provided, and a specific text if given.
window.$.fn.makeID = function(pfx = "", txt = "", noLC = false) {
  const elem = this[0];
  if (elem.id) {
    return elem.id;
  }
  if (!txt) {
    txt = (elem.title ? elem.title : elem.textContent).trim();
  }
  var id = noLC ? txt : txt.toLowerCase();
  id = id
    .replace(/[\W]+/gmi, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
  if (!id) {
    id = "generatedID";
  } else if (/\.$/.test(id) || !/^[a-z]/i.test(id)) {
    id = "x" + id; // trailing . doesn't play well with jQuery
  }
  if (pfx) {
    id = `${pfx}-${id}`;
  }
  if (elem.ownerDocument.getElementById(id)) {
    let i = 0;
    let nextId = id + "-" + i;
    while (elem.ownerDocument.getElementById(nextId)) {
      nextId = id + "-" + i++;
    }
    id = nextId;
  }
  elem.id = id;
  return id;
};

// Returns all the descendant text nodes of an element. Note that those nodes aren't
// returned as a jQuery array since I'm not sure if that would make too much sense.
window.$.fn.allTextNodes = function(exclusions) {
  var textNodes = [],
    excl = {};
  for (var i = 0, n = exclusions.length; i < n; i++) excl[exclusions[i]] = true;

  function getTextNodes(node) {
    if (node.nodeType === 1 && excl[node.localName.toLowerCase()]) return;
    if (node.nodeType === 3) textNodes.push(node);
    else {
      for (var i = 0, len = node.childNodes.length; i < len; ++i)
        getTextNodes(node.childNodes[i]);
    }
  }
  getTextNodes(this[0]);
  return textNodes;
};
