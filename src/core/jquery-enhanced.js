import { pub } from "core/pubsubhub";
import { addId, getTextNodes, getDfnTitles } from "core/utils";
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
  return getDfnTitles(this[0], args);
};

// For any element (usually <a>), returns an array of targets that
// element might refer to, of the form
// {for: 'interfacename', title: 'membername'}.
//
// For an element like:
//  <p link-for="Int1"><a for="Int2">Int3.member</a></p>
// we'll return:
//  * {for: "int2", title: "int3.member"}
//  * {for: "int3", title: "member"}
//  * {for: "", title: "int3.member"}
window.$.fn.linkTargets = function() {
  var linkForElem = this[0].closest("[data-link-for]");
  var linkFor = linkForElem ? linkForElem.dataset.linkFor.toLowerCase() : "";
  var titles = getDfnTitles(this[0]);
  var result = [];
  for (const title of titles) {
    result.push({
      for: linkFor,
      title,
    });
    const split = title.split(".");
    if (split.length === 2) {
      // If there are multiple '.'s, this won't match an
      // Interface/member pair anyway.
      result.push({
        for: split[0],
        title: split[1],
      });
    }
    result.push({
      for: "",
      title,
    });
  }
  return result;
};

// Applied to an element, sets an ID for it (and returns it), using a specific prefix
// if provided, and a specific text if given.
window.$.fn.makeID = function(pfx = "", txt = "", noLC = false) {
  const elem = this[0];
  return addId(elem, pfx, txt, noLC);
};

// Returns all the descendant text nodes of an element. Note that those nodes aren't
// returned as a jQuery array since I'm not sure if that would make too much sense.
window.$.fn.allTextNodes = function(exclusions) {
  return getTextNodes(this[0], exclusions);
};
