// @ts-check
import { pub } from "./pubsubhub.js";

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
    for (const name of names) {
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
    return this.tryFindDfn(defn, parent, name);
  }

  /**
   * @param {*} defn
   * @param {string} parent
   * @param {string} name
   */
  tryFindDfn(defn, parent, name) {
    switch (defn.type) {
      case "attribute":
        return this.findAttributeDfn(defn, parent, name);
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
  findAttributeDfn(defn, parent, name) {
    const asQualifiedName = `${parent}.${name}`;
    const dfn = this.findNormalDfn(defn, parent, name);
    if (!dfn) {
      return;
    }
    this.addAlternativeNames(dfn, [asQualifiedName, name]);
    return dfn;
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
    // Allow linking to both "method()" and "method" name.
    const asMethodName = `${name}()`;
    const asQualifiedName = `${parent}.${name}`;
    const asFullyQualifiedName = `${asQualifiedName}()`;

    const dfn =
      this.findNormalDfn(defn, parent, asMethodName) ||
      this.findNormalDfn(defn, parent, name);
    if (!dfn) {
      return;
    }
    this.addAlternativeNames(dfn, [
      asFullyQualifiedName,
      asQualifiedName,
      asMethodName,
      name,
    ]);
    return dfn;
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
   * @param {*} defn
   * @param {string} parent
   * @param {string} name
   */
  findNormalDfn(defn, parent, name) {
    let resolvedName =
      defn.type === "enum-value" && name === "" ? "the-empty-string" : name;
    let dfnForArray = this.get(resolvedName);
    let dfns = getDfns(dfnForArray, parent, name, defn.type);
    // If we haven't found any definitions with explicit [for]
    // and [title], look for a dotted definition, "parent.name".
    if (dfns.length === 0 && parent !== "") {
      resolvedName = `${parent}.${resolvedName}`;
      dfnForArray = this.get(resolvedName);
      if (dfnForArray !== undefined && dfnForArray.length === 1) {
        dfns = dfnForArray;
        // Found it: register with its local name
        this.delete(resolvedName);
        this.registerDefinition(dfns[0], [resolvedName]);
      }
    }
    if (dfns.length > 1) {
      const msg = `Multiple \`<dfn>\`s for \`${name}\` ${
        parent ? `in \`${parent}\`` : ""
      }`;
      pub("error", msg);
    }
    if (dfns.length) {
      if (name !== resolvedName) {
        dfns[0].dataset.lt = resolvedName;
      }
      return dfns[0];
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
  const dfns = dfnForArray.filter(dfn => dfn.dataset.dfnFor === parent);
  // If this is a top-level entity, and we didn't find anything with
  // an explicitly empty [for], try <dfn> that inherited a [for].
  if (dfns.length === 0 && parent === "" && dfnForArray.length === 1) {
    return dfnForArray;
  } else if (topLevelEntities.has(type) && dfnForArray.length) {
    const dfn = dfnForArray.find(
      dfn => dfn.textContent.trim() === originalName
    );
    if (dfn) return [dfn];
  }
  return dfns;
}
