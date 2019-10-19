// @ts-check
import { showInlineError } from "./utils.js";

const topLevelEntities = new Set([
  "callback interface",
  "callback",
  "dictionary",
  "enum",
  "interface mixin",
  "interface",
  "typedef",
]);

/**
 * @augments {Map<string, HTMLElement[]>}
 */
export class DefinitionMap extends Map {
  /**
   * @param {HTMLElement} dfn A definition element to register
   * @param {string[]} names Names to register the element by
   */
  registerDefinition(dfn, names) {
    for (const name of names.map(name => name.toLowerCase())) {
      if (!this.has(name)) {
        this.set(name, [dfn]);
      } else if (!this.get(name).includes(dfn)) {
        this.get(name).push(dfn);
      }
    }
  }

  /**
   * This function looks for a <dfn> element whose title is 'name' and
   * that is "for" 'parent', which is the empty string when 'name'
   * refers to a top-level entity. For top-level entities, <dfn>
   * elements that inherit a non-empty [dfn-for] attribute are also
   * counted as matching.
   *
   * When a matching <dfn> is found, it's given <code> formatting,
   * marked as an IDL definition, and returned. If no <dfn> is found,
   * the function returns 'undefined'.
   * @param {*} defn
   * @param {string} name
   * @param {object} [options]
   * @param {string} [options.parent]
   */
  findDfn(defn, name, { parent = "" } = {}) {
    switch (defn.type) {
      case "constructor":
      case "operation":
        return this.findOperationDfn(defn, parent, name);
      default:
        return this.findNormalDfn(defn, parent, name);
    }
  }

  /**
   * @param {*} defn
   * @param {string} parent
   * @param {string} name
   */
  findOperationDfn(defn, parent, name) {
    // Overloads all have unique names
    if (name.includes("!overload")) {
      return this.findNormalDfn(defn, parent, name);
    }
    const asMethodName = `${name}()`;
    return this.findNormalDfn(defn, parent, asMethodName, name);
  }

  /**
   * @param {HTMLElement} dfn
   * @param {string[]} names
   */
  addAlternativeNames(dfn, names) {
    const lt = dfn.dataset.lt ? dfn.dataset.lt.split("|") : [];
    lt.push(...names);
    dfn.dataset.lt = [...new Set(lt)].join("|");
    this.registerDefinition(dfn, names);
  }

  /**
   * @param {HTMLElement} dfn
   * @param {string} type
   * @param {string} parent
   * @param {string} name
   */
  addAlternativeNamesByType(dfn, type, parent, name) {
    const asQualifiedName = `${parent}.${name}`;
    switch (type) {
      case "constructor":
      case "operation": {
        // Allow linking to both "method()" and "method" name.
        const asMethodName = `${name}()`;
        const asFullyQualifiedName = `${asQualifiedName}()`;
        return this.addAlternativeNames(dfn, [
          asFullyQualifiedName,
          asQualifiedName,
          asMethodName,
          name,
        ]);
      }
      case "attribute":
        return this.addAlternativeNames(dfn, [asQualifiedName, name]);
    }
  }

  /**
   * @param {*} defn
   * @param {string} parent
   * @param {string[]} names
   */
  findNormalDfn(defn, parent, ...names) {
    for (const name of names) {
      let resolvedName =
        defn.type === "enum-value" && name === ""
          ? "the-empty-string"
          : name.toLowerCase();
      let dfnForArray = this.get(resolvedName);
      let dfns = getDfns(dfnForArray, parent, name, defn.type);
      // If we haven't found any definitions with explicit [for]
      // and [title], look for a dotted definition, "parent.name".
      if (dfns.length === 0 && parent !== "") {
        resolvedName = `${parent}.${resolvedName}`;
        dfnForArray = this.get(resolvedName.toLowerCase());
        if (dfnForArray !== undefined && dfnForArray.length === 1) {
          dfns = dfnForArray;
          // Found it: register with its local name
          this.delete(resolvedName);
          this.registerDefinition(dfns[0], [resolvedName]);
        }
      } else {
        resolvedName = name;
      }
      if (dfns.length > 1) {
        const msg = `WebIDL identifier \`${name}\` ${
          parent ? `for \`${parent}\`` : ""
        } is defined multiple times`;
        showInlineError(dfns, msg, "Duplicate definition.");
      }
      if (dfns.length) {
        if (name !== resolvedName) {
          dfns[0].dataset.lt = resolvedName;
        }
        return dfns[0];
      }
    }
  }
}

/**
 * @param {HTMLElement[]} dfnForArray
 * @param {string} parent
 * @param {string} originalName
 * @param {string} type
 */
function getDfns(dfnForArray, parent, originalName, type) {
  if (!dfnForArray) {
    return [];
  }
  // Definitions that have a title and [data-dfn-for] that exactly match the
  // IDL entity:
  const dfns = dfnForArray.filter(dfn => {
    /** @type {HTMLElement} */
    const closestDfnFor = dfn.closest(`[data-dfn-for]`);
    return closestDfnFor && closestDfnFor.dataset.dfnFor === parent;
  });

  if (dfns.length === 0 && parent === "" && dfnForArray.length === 1) {
    // Make sure the name exactly matches
    return dfnForArray[0].textContent === originalName ? dfnForArray : [];
  } else if (topLevelEntities.has(type) && dfnForArray.length) {
    const dfn = dfnForArray.find(
      dfn => dfn.textContent.trim() === originalName
    );
    if (dfn) return [dfn];
  }
  return dfns;
}
