/**
 * Module holds a common store of cross-references.
 * They are case sensitive. xref can be overridden with
 * `conf.xrefs` using a object.
 */
export const name = "core/xrefs";

export const xrefs = new Map([
  ["any", "WEBIDL#idl-any"],
  ["ArrayBuffer", "WEBIDL#idl-ArrayBuffer"],
  ["boolean", "WEBIDL#idl-boolean"],
  ["Buffer", "WEBIDL#idl-Buffer"],
  ["byte", "WEBIDL#idl-byte"],
  ["ByteString", "WEBIDL#idl-ByteString"],
  ["Callback", "WEBIDL#idl-Callback"],
  ["CEReactions", "HTML#cereactions"],
  ["Clamp", "WEBIDL#Clamp"],
  ["Constructor", "WEBIDL#Constructor"],
  ["DataView", "WEBIDL#idl-DataView"],
  ["Default", "WEBIDL#Default"],
  ["DOMException", "WEBIDL#idl-DOMException"],
  ["DOMString", "WEBIDL#idl-DOMString"],
  ["double", "WEBIDL#idl-double"],
  ["EnforceRange", "WEBIDL#EnforceRange"],
  ["Error", "WEBIDL#idl-Error"],
  ["EventHandler", "HTML#eventhandler"],
  ["Exposed", "WEBIDL#Exposed"],
  ["float", "WEBIDL#idl-float"],
  ["Float32Array", "WEBIDL#idl-Float32Array"],
  ["Float64Array", "WEBIDL#idl-Float64Array"],
  ["FrozenArray", "WEBIDL#idl-frozen-array"],
  ["Global", "WEBIDL#Global"],
  ["HTMLConstructor", "HTML#htmlconstructor"],
  ["Int16Array", "WEBIDL#idl-Int16Array"],
  ["Int32Array", "WEBIDL#idl-Int32Array"],
  ["Int8Array", "WEBIDL#idl-Int8Array"],
  ["LegacyArrayClass", "WEBIDL#LegacyArrayClass"],
  ["LegacyNamespace", "WEBIDL#LegacyNamespace"],
  ["LegacyWindowAlias", "WEBIDL#LegacyWindowAlias"],
  ["LenientSetter", "WEBIDL#LenientSetter"],
  ["LenientThis", "WEBIDL#LenientThis"],
  ["long long", "WEBIDL#idl-long-long"],
  ["long", "WEBIDL#idl-long"],
  ["NamedConstructor", "WEBIDL#NamedConstructor"],
  ["NewObject", "WEBIDL#NewObject"],
  ["NoInterfaceObject", "WEBIDL#NoInterfaceObject"],
  ["object", "WEBIDL#idl-object"],
  ["octet", "WEBIDL#idl-octet"],
  ["OverrideBuiltins", "WEBIDL#OverrideBuiltins"],
  ["PrimaryGlobal", "WEBIDL#PrimaryGlobal"],
  ["Promise", "WEBIDL#idl-promise"],
  ["PutForwards", "WEBIDL#PutForwards"],
  ["record", "WEBIDL#idl-record"],
  ["Replaceable", "WEBIDL#Replaceable"],
  ["SameObject", "WEBIDL#SameObject"],
  ["SecureContext", "WEBIDL#SecureContext"],
  ["sequence", "WEBIDL#idl-sequence"],
  ["short", "WEBIDL#idl-short"],
  ["toJSON", "WEBIDL#default-tojson-operation"],
  ["TreatNonObjectAsNull", "WEBIDL#TreatNonObjectAsNull"],
  ["TreatNullAs", "WEBIDL#TreatNullAs"],
  ["Uint16Array", "WEBIDL#idl-Uint16Array"],
  ["Uint32Array", "WEBIDL#idl-Uint32Array"],
  ["Uint8Array", "WEBIDL#idl-Uint8Array"],
  ["Uint8ClampedArray", "WEBIDL#dl-Uint8ClampedArray"],
  ["Unforgeable", "WEBIDL#Unforgeable"],
  ["unrestricted double", "WEBIDL#idl-unrestricted-double"],
  ["unrestricted float", "WEBIDL#idl-unrestricted-float"],
  ["Unscopable", "WEBIDL#Unscopable"],
  ["unsigned long long", "WEBIDL#idl-unsigned-long-long"],
  ["unsigned long", "WEBIDL#idl-unsigned-long"],
  ["unsigned short", "WEBIDL#idl-unsigned-short"],
  ["USVString", "WEBIDL#idl-USVString"],
  ["void", "WEBIDL#es-void"],
  ["Worklet", "worklets-1#worklets"]
]);

export function run(conf, doc, cb) {
  if (conf.xrefs) {
    Object.entries(conf.xrefs).reduce(
      (xrefs, [name, value]) => xrefs.set(name, value),
      xrefs
    );
  }
  cb();
}
