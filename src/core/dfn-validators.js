import { MIMEType } from "./import-maps.js";
import { showError } from "./utils.js";

/**
 * Validates MIME types strings.
 *
 * @type {DefinitionValidator} */
export function validateMimeType(text, type, elem, pluginName) {
  try {
    const type = new MIMEType(text);
    if (type.toString() !== text) {
      throw new Error(`Input doesn't match it's canonical '${type}')`);
    }
    return true;
  } catch (error) {
    const msg = `Invalid ${type} "${text}": ${error.message}.`;
    const hint =
      "Check that the media type has both a type and a sub-type, and that it's in a canonical form (e.g., `text/plain`).";
    showError(msg, pluginName, { hint, elements: [elem] });
  }
  return false;
}

/**
 * Validates the names of DOM attribute and elements.
 * @param {"attribute" | "element"} type
 * @type {DefinitionValidator} */
export function validateDOMName(text, type, elem, pluginName) {
  try {
    switch (type) {
      case "attribute":
        document.createAttribute(text);
        return true;
      case "element":
        document.createElement(text);
        return true;
    }
  } catch (err) {
    const msg = `Invalid ${type} name "${text}": ${err.message}`;
    const hint = `Check that the ${type} name is allowed per the XML's Name production for ${type}.`;
    showError(msg, pluginName, { hint, elements: [elem] });
  }
  return false;
}

/**
 * Used to validates common variable or other named thing in a spec, like event names.
 *
 * @param {"event"} type
 * @type {DefinitionValidator}
 */
export function validateCommonName(text, type, elem, pluginName) {
  // Check a-z, maybe a dash followed by words, case insensitive.
  // Also, no spaces.
  if (/^[a-z]+(-[a-z]+)*$/i.test(text)) {
    return true; // all good
  }
  const msg = `Invalid ${type} name "${text}"`;
  const hint = `Check that the ${type} name is allowed`;
  showError(msg, pluginName, { hint, elements: [elem] });
  return false;
}
