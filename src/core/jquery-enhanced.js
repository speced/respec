import { pub } from "core/pubsubhub";
import { getLinkedTerms } from "core/dfn";
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

// For any element (usually <a>), returns an array of targets that
// element might refer to, of the form
// {for_: 'interfacename', title: 'membername'}.
//
// For an element like:
//  <p link-for="Int1"><a for="Int2">Int3.member</a></p>
// we'll return:
//  * {for_: "int2", title: "int3.member"}
//  * {for_: "int3", title: "member"}
//  * {for_: "", title: "member"}
window.$.fn.linkTargets = function() {
  var linkForElem = this[0].closest("[data-link-for]");
  var linkFor = linkForElem ? linkForElem.dataset.linkFor.toLowerCase() : "";
  const results = getLinkedTerms(this[0])
    .map(title => {
      const possibleLinks = [];
      const link = {
        for_: "",
        title,
      };
      possibleLinks.push(link);
      // If we found a idl definition.
      if (linkFor) {
        possibleLinks.push({
          for_: linkFor,
          title,
        });
      }
      // Match qualified names (e.g., "Foo.bar")
      const [parent, member] = title.split(".");
      if (parent && member) {
        // If there are more than 2 '.'s, this won't match an
        // Interface/member pair anyway.
        possibleLinks.push({
          for_: parent,
          title: member,
        });
      }
      return possibleLinks;
    })
    .reduce((collector, possibleLinks) => collector.concat(possibleLinks), []);
  return results;
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
    .replace(/[\W]+/gim, "-")
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
