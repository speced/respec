import { pub } from "core/pubsubhub";
import { idlExposedKeywords, idlUndesirableExtAttrs } from "core/symbols";
import { biblioDB } from "core/biblio-db";

// Promise eventually gives us the URL for WebIDL from spec ref.
const idlRefLookup = biblioDB.find("WEBIDL").then(({ href }) => href);

export function validateWebIDL(parsedIdl) {
  for (const idl of parsedIdl) {
    switch (idl.type) {
      case "interface":
        validateInterface(idl);
        break;
      case "namespace":
        validateNamespace(idl);
        break;
      case "implements":
        validateImplements(idl);
        break;
    }
  }
  return parsedIdl;
}

function validateImplements(obj){
  debugger;
  pub("The implements keyword is deprecated in Web IDL, use a 'mixin' instead.");
}

function validateNamespace(obj) {
  checkIfExplicitlyExposed(obj);
  checkForUndesirableExtAttrs(obj);
}

function validateInterface(obj) {
  checkIfExplicitlyExposed(obj);
  checkForUndesirableExtAttrs(obj);
}

/**
 * Checks for undesirable extended attributes on interfaces.
 *
 * @param {Object} obj Either a interface or a namespace as per
 * https://github.com/w3c/webidl2.js.
 */
async function checkForUndesirableExtAttrs(obj) {
  const { extAttrs } = obj;
  if (!extAttrs.length) {
    return;
  }
  const undesirables = extAttrs.filter(({ name }) =>
    idlUndesirableExtAttrs.has(name)
  );
  if (!undesirables.length) {
    return;
  }
  for (const extAttr of undesirables) {
    const { name } = extAttr;
    const idlURL = await idlRefLookup;
    const { name: owner } = extAttr.parent;
    const { type } = extAttr.parent;
    const msg =
      `Extended attribute \`[${name}]\` on \`${type}\` \`${owner}\`` +
      ` is an **undesirable feature**. [More info](${idlURL}#${name}).`;
    pub("warn", msg);
  }
}

/**
 * Warn if the interface lacks idlExposedKeywords as extended attribute
 * and if [Exposed] doesn't have a right hand side.
 *
 * @param {Object} obj As per https://github.com/w3c/webidl2.js#interface
 */
async function checkIfExplicitlyExposed(obj) {
  const exposed = obj.extAttrs.find(({ name }) => idlExposedKeywords.has(name));
  if(!exposed){
    return;
  }
  const hasRhs = exposed.arguments || exposed.rhs;
  if (hasRhs) {
    return;
  }
  // We have a bad one
  const { type, name } = obj;
  const idlURL = await idlRefLookup;
  let msg = "";
  if (!exposed) {
    msg = `${type} \`${name}\` should declare an \`[Exposed=]\` extended attribute. `;
  } else {
    msg =
      `Expected ${type} \`${name}\` is \`[Exposed]\`,` +
      " but needs least one argument (e.g., `[Exposed=Window`). ";
  }
  msg += `[More info](${idlURL}#Exposed).`;
  pub("warn", msg);
}
