// @ts-check
/*
 * Logius addition
 * this script splits markdown level 1 headers ("#") in seperate sections
 * in order to (temporary) fix a problem with markdown/respec
 * since a MD-document may only a single H1 header
 * e.g.
 * (note: newlines as required by markdown are removed for readibility)
 *
 * <section data-format="markdown">
 *   # Hoofdstuk 1
 *   ## This is level 1.2
 *   This is a paragraph with some `code`.
 *   # Hoofdstuk 2
 *   ## This is level 2.2
 * </section>
 *
 * into
 *
 * <section data-format="markdown">
 *   # Hoofdstuk 1
 *   ## This is level 1.2
 *   This is a paragraph with some `code`.
 * </section>
 * <section data-format="markdown">
 *   # Hoofdstuk 2
 *   ## This is level 2.2
 * </section>
 *
 *
 */

export const name = "logius/splitmarkdownheaders";

// todo refactor + correct commenting etc
// todo testing
export function run(conf) {
  const hasMDSections = !!document.querySelector(
    "[data-format=markdown]:not(body)"
  );
  const isMDFormat = conf.format === "markdown";
  if (!isMDFormat && !hasMDSections) {
    return; // Nothing to be done
  }
  // Pieter Hering, Logius
  // splitMDsections is a Logius specific config property
  if ((isMDFormat || hasMDSections) && conf.nl_markdownSplitH1sections) {
    splitH1sections("[data-format=markdown]:not(body)");
    // const newBody = splitH1sections("[data-format=markdown]:not(body)");
    // document.body.replaceWith(newBody);
  }
  // end addition
}

// splitH1Sections performs the following steps
// 1. select all nodes according to selector filter
// 2. call filterH1lines for each node
// 3. mark original node which a (bogus) 'removeme' class
// 4. insert each node from nodes set returned by filterH1lines before original node
// 5. remove the marked original nodes
function splitH1sections(selector) {
  // Todo
  // for some unknown reason the more logical cloneNode works
  // but has the strange side effect that the 'RespecPill' keeps on rotating
  // therefor we operate directly on the document.body itself
  const bodyCopy = document.body; // .cloneNode(true);
  let elements = bodyCopy.querySelectorAll(selector);

  elements.forEach(element => {
    const newNode = filterH1lines(element);

    // mark the original section element for deletion when finished
    element.classList.add("removeme");

    let beforeNode = element;
    for (let i = newNode.childNodes.length - 1; i >= 0; i--) {
      // insert the node backwards, to avoid some side effects when inserting childnodes
      beforeNode = element.parentNode.insertBefore(
        newNode.childNodes[i],
        beforeNode
      );
    }
  });
  // the selector is  using '~=' in query to retrieve all node that contains the removeme attribute
  // this fixes a bug where 'normative removeme'was not recognized
  elements = bodyCopy.querySelectorAll("[class~=removeme]:not(body)");
  // remove original elements
  elements.forEach(el => {
    const pn = el.parentNode;
    pn.removeChild(el);
  });

  return bodyCopy;
}

// filterH1lines searches for a pattern like '# <section name>' (Markdown H1 section) or
// '<section name>'\n======== in the node's inner html
// and generates new sections for each part that starts with a that section
// see example above for an overview
function filterH1lines(element) {
  const regex = /(^# [\w ]+)|(^[\w ]+\n[=]+)/gm;
  const matches = element.innerHTML.matchAll(regex);

  const pos = [0];
  for (const match of matches) {
    // skip first match since Respec starts a new section by default
    if (match.index > 0) {
      pos.push(match.index);
    }
  }
  // add position of last character to have correct pairs for the substring operation
  pos.push(element.innerHTML.length - 1);

  // create a div element as a container for the split sections
  // the div itself will/should not be used by the caller
  const div = document.createElement("div");
  for (let j = 0; j < pos.length - 1; j++) {
    const newEl = element.cloneNode(false);
    newEl.innerHTML = element.innerHTML.substring(pos[j], pos[j + 1]);
    div.appendChild(newEl);
  }
  return div;
}
