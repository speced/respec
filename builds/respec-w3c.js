"use strict";
window.respecVersion = "25.0.2";
"use strict";window.addEventListener("error",e=>{console.error(e.error,e.message,e)});const modules=[Promise.resolve().then((function(){return baseRunner})),Promise.resolve().then((function(){return ui$1})),Promise.resolve().then((function(){return reindent$1})),Promise.resolve().then((function(){return locationHash})),Promise.resolve().then((function(){return l10n$1})),Promise.resolve().then((function(){return defaults$6})),Promise.resolve().then((function(){return style})),Promise.resolve().then((function(){return style$1})),Promise.resolve().then((function(){return l10n$2})),Promise.resolve().then((function(){return github$1})),Promise.resolve().then((function(){return dataInclude})),Promise.resolve().then((function(){return markdown})),Promise.resolve().then((function(){return headers})),Promise.resolve().then((function(){return abstract})),Promise.resolve().then((function(){return dataTransform})),Promise.resolve().then((function(){return dataAbbr})),Promise.resolve().then((function(){return inlines})),Promise.resolve().then((function(){return conformance})),Promise.resolve().then((function(){return dfn})),Promise.resolve().then((function(){return pluralize$2})),Promise.resolve().then((function(){return examples})),Promise.resolve().then((function(){return issuesNotes})),Promise.resolve().then((function(){return bestPractices})),Promise.resolve().then((function(){return figures})),Promise.resolve().then((function(){return webidl})),Promise.resolve().then((function(){return dataCite})),Promise.resolve().then((function(){return biblio$1})),Promise.resolve().then((function(){return webidlIndex})),Promise.resolve().then((function(){return linkToDfn})),Promise.resolve().then((function(){return renderBiblio})),Promise.resolve().then((function(){return contrib})),Promise.resolve().then((function(){return fixHeaders})),Promise.resolve().then((function(){return structure$1})),Promise.resolve().then((function(){return informative})),Promise.resolve().then((function(){return idHeaders})),Promise.resolve().then((function(){return caniuse})),Promise.resolve().then((function(){return mdnAnnotation})),Promise.resolve().then((function(){return saveHtml})),Promise.resolve().then((function(){return searchSpecref})),Promise.resolve().then((function(){return searchXref})),Promise.resolve().then((function(){return dfnList})),Promise.resolve().then((function(){return aboutRespec})),Promise.resolve().then((function(){return seo})),Promise.resolve().then((function(){return seo$1})),Promise.resolve().then((function(){return highlight})),Promise.resolve().then((function(){return webidlClipboard})),Promise.resolve().then((function(){return dataTests})),Promise.resolve().then((function(){return listSorter})),Promise.resolve().then((function(){return highlightVars$1})),Promise.resolve().then((function(){return dfnPanel})),Promise.resolve().then((function(){return dataType})),Promise.resolve().then((function(){return algorithms})),Promise.resolve().then((function(){return anchorExpander})),Promise.resolve().then((function(){return index})),Promise.resolve().then((function(){return linter$1}))];async function domReady(){"loading"===document.readyState&&await new Promise(e=>document.addEventListener("DOMContentLoaded",e))}(async()=>{const[e,{ui:t},...n]=await Promise.all(modules);try{t.show(),await domReady(),await e.runAll(n)}finally{t.enable()}})().catch(e=>{console.error(e)});const inAmd=!!window.require;if(!inAmd){const e=function(e,t){const n=e.map(e=>{if(!(e in window.require.modules))throw new Error(`Unsupported dependency name: ${e}`);return window.require.modules[e]});Promise.all(n).then(e=>t(...e))};e.modules={},window.require=e}function expose(e,t){inAmd||(window.require.modules[e]=t)}const name="core/pubsubhub",subscriptions=new Map;function pub(e,...t){if(!subscriptions.has(e))return;if(Array.from(subscriptions.get(e)).forEach(e=>{try{e(...t)}catch(t){pub("error",`Error when calling function ${e.name}. See developer console.`),console.error(t)}}),window.parent===window.self)return;const n=t.map(e=>String(JSON.stringify(e.stack||e)));window.parent.postMessage({topic:e,args:n},window.parent.location.origin)}function sub(e,t,n={once:!1}){return n.once?sub(e,(function n(...r){unsub({topic:e,cb:n}),t(...r)})):(subscriptions.has(e)?subscriptions.get(e).add(t):subscriptions.set(e,new Set([t])),{topic:e,cb:t})}function unsub({topic:e,cb:t}){const n=subscriptions.get(e);return n&&n.has(t)?n.delete(t):(console.warn("Already unsubscribed:",e,t),!1)}sub("error",e=>{console.error(e,e.stack)}),sub("warn",e=>{console.warn(e)}),expose(name,{sub:sub});const userConfig={},amendConfig=e=>Object.assign(userConfig,e),removeList=["githubToken","githubUser"];function overrideConfig(e){const t=document.location.search.replace(/;/g,"&"),n=new URLSearchParams(t),r=Array.from(n).filter(([e,t])=>!!e&&!!t).map(([e,t])=>{const n=decodeURIComponent(e),r=decodeURIComponent(t.replace(/%3D/g,"="));let o;try{o=JSON.parse(r)}catch{o=r}return{key:n,value:o}}).reduce((e,{key:t,value:n})=>(e[t]=n,e),{});Object.assign(e,r),pub("amend-user-config",r)}sub("start-all",amendConfig),sub("amend-user-config",amendConfig),sub("end-all",()=>{const e=document.createElement("script");e.id="initialUserConfig",e.type="application/json";for(const e of removeList)e in userConfig&&delete userConfig[e];e.innerHTML=JSON.stringify(userConfig,null,2),document.head.appendChild(e)}),sub("start-all",overrideConfig,{once:!0});const respecDonePromise=new Promise(e=>{sub("end-all",e,{once:!0})});let doneResolver;Object.defineProperty(document,"respecIsReady",{get:()=>respecDonePromise});const done=new Promise(e=>{doneResolver=e});let doneResolver$1;sub("plugins-done",async e=>{const t=[];if(Array.isArray(e.postProcess)){const n=e.postProcess.filter(e=>{const t="function"==typeof e;return t||pub("error","Every item in `postProcess` must be a JS function."),t}).map(async t=>{try{return await t(e,document)}catch(e){pub("error",`Function ${t.name} threw an error during \`postProcess\`. See developer console.`),console.error(e)}}),r=await Promise.all(n);t.push(...r)}"function"==typeof e.afterEnd&&t.push(await e.afterEnd(e,document)),doneResolver(t)},{once:!0});const done$1=new Promise(e=>{doneResolver$1=e});sub("start-all",async e=>{const t=[];if(Array.isArray(e.preProcess)){const n=e.preProcess.filter(e=>{const t="function"==typeof e;return t||pub("error","Every item in `preProcess` must be a JS function."),t}).map(async t=>{try{return await t(e,document)}catch(e){pub("error",`Function ${t.name} threw an error during \`preProcess\`. See developer console.`),console.error(e)}}),r=await Promise.all(n);t.push(...r)}doneResolver$1(t)},{once:!0});const name$1="core/l10n",html=document.documentElement;html&&!html.hasAttribute("lang")&&(html.lang="en",html.hasAttribute("dir")||(html.dir="ltr"));const base={about_respec:"About",abstract:"Abstract",bug_tracker:"Bug tracker:",close_parens:")",definition_list:"Definitions",editors_note:"Editor's note",feature_at_risk:"(Feature at Risk) Issue",info_references:"Informative references",issue_summary:"Issue Summary",issue:"Issue",list_of_definitions:"List of Definitions",norm_references:"Normative references",note:"Note",open_bugs:"open bugs",open_parens:"(",participate:"Participate",references:"References",save_as:"Save as",save_snapshot:"Export",search_specref:"Search Specref",toc:"Table of Contents",warning:"Warning"},ko={abstract:"요약"},zh={about_respec:"关于",abstract:"摘要",bug_tracker:"错误跟踪：",file_a_bug:"反馈错误",note:"注",open_bugs:"修正中的错误",participate:"参与：",toc:"内容大纲"},ja={abstract:"要約",bug_tracker:"バグの追跡履歴：",file_a_bug:"問題報告",note:"注",open_bugs:"改修されていないバグ",participate:"参加方法：",toc:"目次"},nl={about_respec:"Over",abstract:"Samenvatting",bug_tracker:"Meldingensysteem:",definition_list:"Lijst van Definities",editors_note:"Redactionele noot",file_a_bug:"Dien een melding in",info_references:"Informatieve referenties",issue_summary:"Lijst met issues",list_of_definitions:"Lijst van Definities",norm_references:"Normatieve referenties",note:"Noot",open_bugs:"open meldingen",participate:"Doe mee",references:"Referenties",save_as:"Bewaar als",save_snapshot:"Bewaar Snapshot",search_specref:"Doorzoek Specref",toc:"Inhoudsopgave",warning:"Waarschuwing"},es={abstract:"Resumen",authors:"Autores:",bug_tracker:"Repositorio de bugs:",close_parens:")",editors_note:"Nota de editor",file_a_bug:"Nota un bug",info_references:"Referencias informativas",issue_summary:"Resumen de la cuestión",issue:"Cuestión",norm_references:"Referencias normativas",note:"Nota",open_bugs:"Bugs abiertos",open_parens:"(",participate:"Participad",references:"Referencias",toc:"Tabla de Contenidos",warning:"Aviso"},l10n={en:{...base},ko:{...base,...ko},zh:{...base,...zh},ja:{...base,...ja},nl:{...base,...nl},es:{...base,...es}};l10n["zh-hans"]=l10n.zh,l10n["zh-cn"]=l10n.zh;const lang=html&&html.lang in l10n?html.lang:"en";function getIntlData(e){return new Proxy(e,{get(e,t){const n=e[lang][t]||e.en[t];if(!n)throw new Error(`No l10n data for key: "${t}"`);return n}})}function run(e){e.l10n=l10n[lang]||l10n.en}var l10n$1=Object.freeze({__proto__:null,name:name$1,l10n:l10n,lang:lang,getIntlData:getIntlData,run:run});const instanceOfAny=(e,t)=>t.some(t=>e instanceof t);let idbProxyableTypes,cursorAdvanceMethods;function getIdbProxyableTypes(){return idbProxyableTypes||(idbProxyableTypes=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function getCursorAdvanceMethods(){return cursorAdvanceMethods||(cursorAdvanceMethods=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const cursorRequestMap=new WeakMap,transactionDoneMap=new WeakMap,transactionStoreNamesMap=new WeakMap,transformCache=new WeakMap,reverseTransformCache=new WeakMap;function promisifyRequest(e){const t=new Promise((t,n)=>{const r=()=>{e.removeEventListener("success",o),e.removeEventListener("error",i)},o=()=>{t(wrap(e.result)),r()},i=()=>{n(e.error),r()};e.addEventListener("success",o),e.addEventListener("error",i)});return t.then(t=>{t instanceof IDBCursor&&cursorRequestMap.set(t,e)}).catch(()=>{}),reverseTransformCache.set(t,e),t}function cacheDonePromiseForTransaction(e){if(transactionDoneMap.has(e))return;const t=new Promise((t,n)=>{const r=()=>{e.removeEventListener("complete",o),e.removeEventListener("error",i),e.removeEventListener("abort",i)},o=()=>{t(),r()},i=()=>{n(e.error),r()};e.addEventListener("complete",o),e.addEventListener("error",i),e.addEventListener("abort",i)});transactionDoneMap.set(e,t)}let idbProxyTraps={get(e,t,n){if(e instanceof IDBTransaction){if("done"===t)return transactionDoneMap.get(e);if("objectStoreNames"===t)return e.objectStoreNames||transactionStoreNamesMap.get(e);if("store"===t)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return wrap(e[t])},has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function addTraps(e){idbProxyTraps=e(idbProxyTraps)}function wrapFunction(e){return e!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?getCursorAdvanceMethods().includes(e)?function(...t){return e.apply(unwrap(this),t),wrap(cursorRequestMap.get(this))}:function(...t){return wrap(e.apply(unwrap(this),t))}:function(t,...n){const r=e.call(unwrap(this),t,...n);return transactionStoreNamesMap.set(r,t.sort?t.sort():[t]),wrap(r)}}function transformCachableValue(e){return"function"==typeof e?wrapFunction(e):(e instanceof IDBTransaction&&cacheDonePromiseForTransaction(e),instanceOfAny(e,getIdbProxyableTypes())?new Proxy(e,idbProxyTraps):e)}function wrap(e){if(e instanceof IDBRequest)return promisifyRequest(e);if(transformCache.has(e))return transformCache.get(e);const t=transformCachableValue(e);return t!==e&&(transformCache.set(e,t),reverseTransformCache.set(t,e)),t}const unwrap=e=>reverseTransformCache.get(e);function openDB(e,t,{blocked:n,upgrade:r,blocking:o}={}){const i=indexedDB.open(e,t),s=wrap(i);return r&&i.addEventListener("upgradeneeded",e=>{r(wrap(i.result),e.oldVersion,e.newVersion,wrap(i.transaction))}),n&&i.addEventListener("blocked",()=>n()),o&&s.then(e=>e.addEventListener("versionchange",o)).catch(()=>{}),s}function deleteDB(e,{blocked:t}={}){const n=indexedDB.deleteDatabase(e);return t&&n.addEventListener("blocked",()=>t()),wrap(n).then(()=>void 0)}const readMethods=["get","getKey","getAll","getAllKeys","count"],writeMethods=["put","add","delete","clear"],cachedMethods=new Map;function getMethod(e,t){if(!(e instanceof IDBDatabase)||t in e||"string"!=typeof t)return;if(cachedMethods.get(t))return cachedMethods.get(t);const n=t.replace(/FromIndex$/,""),r=t!==n,o=writeMethods.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!o&&!readMethods.includes(n))return;const i=async function(e,...t){const i=this.transaction(e,o?"readwrite":"readonly");let s=i.store;r&&(s=s.index(t.shift()));const a=s[n](...t);return o&&await i.done,a};return cachedMethods.set(t,i),i}addTraps(e=>({get:(t,n,r)=>getMethod(t,n)||e.get(t,n,r),has:(t,n)=>!!getMethod(t,n)||e.has(t,n)}));var _idb=Object.freeze({__proto__:null,openDB:openDB,deleteDB:deleteDB,unwrap:unwrap,wrap:wrap});function lastLine(e){const t=e.split("\n");return t[t.length-1]}function error(e,t,n,r,o,{level:i="error",autofix:s,ruleName:a}={}){function c(n){return n>0?e.slice(t,t+n):e.slice(Math.max(t+n,0),t)}function l(n,{precedes:r}={}){const o=n.map(e=>e.trivia+e.value).join(""),i=e[t];return"eof"===i.type?o:r?o+i.trivia:o.slice(i.trivia.length)}const u="eof"!==e[t].type?e[t].line:e.length>1?e[t-1].line:1,d=lastLine(l(c(-5),{precedes:!0})),p=c(5),h=l(p),f=d+h.split("\n")[0]+"\n"+(" ".repeat(d.length)+"^"),m="Syntax"===o?"since":"inside",g=`${o} error at line ${u}${e.name?` in ${e.name}`:""}${n&&n.name?`, ${m} \`${n.partial?"partial ":""}${n.type} ${n.name}\``:""}:\n${f}`;return{message:`${g} ${r}`,bareMessage:r,context:g,line:u,sourceName:e.name,level:i,ruleName:a,autofix:s,input:h,tokens:p}}function syntaxError(e,t,n,r){return error(e,t,n,r,"Syntax")}function validationError(e,t,n,r,o={}){return o.ruleName=n,error(t.source,e.index,t,r,"Validation",o)}class Base{constructor({source:e,tokens:t}){Object.defineProperties(this,{source:{value:e},tokens:{value:t},parent:{value:null,writable:!0},this:{value:this}})}toJSON(){const e={type:void 0,name:void 0,inheritance:void 0};let t=this;for(;t!==Object.prototype;){const n=Object.getOwnPropertyDescriptors(t);for(const[t,r]of Object.entries(n))(r.enumerable||r.get)&&(e[t]=this[t]);t=Object.getPrototypeOf(t)}return e}}function idlTypeIncludesDictionary(e,t,{useNullableInner:n}={}){if(!e.union){const r=t.unique.get(e.idlType);if(!r)return;if("typedef"===r.type){const{typedefIncludesDictionary:n}=t.cache;if(n.has(r))return n.get(r);t.cache.typedefIncludesDictionary.set(r,void 0);const o=idlTypeIncludesDictionary(r.idlType,t);if(t.cache.typedefIncludesDictionary.set(r,o),o)return{reference:e,dictionary:o.dictionary}}if("dictionary"===r.type&&(n||!e.nullable))return{reference:e,dictionary:r}}for(const n of e.subtype){const e=idlTypeIncludesDictionary(n,t);if(e)return n.union?e:{reference:n,dictionary:e.dictionary}}}function dictionaryIncludesRequiredField(e,t){if(t.cache.dictionaryIncludesRequiredField.has(e))return t.cache.dictionaryIncludesRequiredField.get(e);if(t.cache.dictionaryIncludesRequiredField.set(e,void 0),e.inheritance){const n=t.unique.get(e.inheritance);if(!n)return!0;if(dictionaryIncludesRequiredField(n,t))return!0}const n=e.members.some(e=>e.required);return t.cache.dictionaryIncludesRequiredField.set(e,n),n}function generic_type(e,t){const n=e.consume("FrozenArray","Promise","sequence","record");if(!n)return;const r=autoParenter(new Type({source:e.source,tokens:{base:n}}));switch(r.tokens.open=e.consume("<")||e.error(`No opening bracket after ${n.type}`),n.type){case"Promise":{e.probe("[")&&e.error("Promise type cannot have extended attribute");const n=return_type(e,t)||e.error("Missing Promise subtype");r.subtype.push(n);break}case"sequence":case"FrozenArray":{const o=type_with_extended_attributes(e,t)||e.error(`Missing ${n.type} subtype`);r.subtype.push(o);break}case"record":{e.probe("[")&&e.error("Record key cannot have extended attribute");const n=e.consume(...stringTypes)||e.error(`Record key must be one of: ${stringTypes.join(", ")}`),o=new Type({source:e.source,tokens:{base:n}});o.tokens.separator=e.consume(",")||e.error("Missing comma after record key type"),o.type=t;const i=type_with_extended_attributes(e,t)||e.error("Error parsing generic type record");r.subtype.push(o,i);break}}return r.idlType||e.error(`Error parsing generic type ${n.type}`),r.tokens.close=e.consume(">")||e.error(`Missing closing bracket after ${n.type}`),r.this}function type_suffix(e,t){const n=e.consume("?");n&&(t.tokens.nullable=n),e.probe("?")&&e.error("Can't nullable more than once")}function single_type(e,t){let n=generic_type(e,t)||primitive_type(e);if(!n){const t=e.consume("identifier",...stringTypes,...typeNameKeywords);if(!t)return;n=new Type({source:e.source,tokens:{base:t}}),e.probe("<")&&e.error(`Unsupported generic type ${t.value}`)}return"Promise"===n.generic&&e.probe("?")&&e.error("Promise type cannot be nullable"),n.type=t||null,type_suffix(e,n),n.nullable&&"any"===n.idlType&&e.error("Type `any` cannot be made nullable"),n}function union_type(e,t){const n={};if(n.open=e.consume("("),!n.open)return;const r=autoParenter(new Type({source:e.source,tokens:n}));for(r.type=t||null;;){const t=type_with_extended_attributes(e)||e.error("No type after open parenthesis or 'or' in union type");"any"===t.idlType&&e.error("Type `any` cannot be included in a union type"),"Promise"===t.generic&&e.error("Type `Promise` cannot be included in a union type"),r.subtype.push(t);const n=e.consume("or");if(!n)break;t.tokens.separator=n}return r.idlType.length<2&&e.error("At least two types are expected in a union type but found less"),n.close=e.consume(")")||e.error("Unterminated union type"),type_suffix(e,r),r.this}class Type extends Base{static parse(e,t){return single_type(e,t)||union_type(e,t)}constructor({source:e,tokens:t}){super({source:e,tokens:t}),Object.defineProperty(this,"subtype",{value:[],writable:!0}),this.extAttrs=[]}get generic(){return this.subtype.length&&this.tokens.base?this.tokens.base.value:""}get nullable(){return Boolean(this.tokens.nullable)}get union(){return Boolean(this.subtype.length)&&!this.tokens.base}get idlType(){if(this.subtype.length)return this.subtype;return unescape([this.tokens.prefix,this.tokens.base,this.tokens.postfix].filter(e=>e).map(e=>e.value).join(" "))}*validate(e){const t=!this.union&&e.unique.get(this.idlType),n=this.union?this:t&&"typedef"===t.type?t.idlType:void 0;if(n&&this.nullable){const{reference:t}=idlTypeIncludesDictionary(n,e)||{};if(t){const e=(this.union?t:this).tokens.base,n="Nullable union cannot include a dictionary type";yield validationError(e,this,"no-nullable-union-dict",n)}}else for(const t of this.subtype)yield*t.validate(e)}}class Default extends Base{static parse(e){const t=e.consume("=");if(!t)return null;const n=const_value(e)||e.consume("string","null","[","{")||e.error("No value for default"),r=[n];if("["===n.type){const t=e.consume("]")||e.error("Default sequence value must be empty");r.push(t)}else if("{"===n.type){const t=e.consume("}")||e.error("Default dictionary value must be empty");r.push(t)}return new Default({source:e.source,tokens:{assign:t},expression:r})}constructor({source:e,tokens:t,expression:n}){super({source:e,tokens:t}),n.parent=this,Object.defineProperty(this,"expression",{value:n})}get type(){return const_data(this.expression[0]).type}get value(){return const_data(this.expression[0]).value}get negative(){return const_data(this.expression[0]).negative}}class ArrayBase extends Array{constructor({source:e,tokens:t}){super(),Object.defineProperties(this,{source:{value:e},tokens:{value:t},parent:{value:null,writable:!0}})}}class Token extends Base{static parser(e,t){return()=>{const n=e.consume(t);if(n)return new Token({source:e.source,tokens:{value:n}})}}get value(){return unescape(this.tokens.value.value)}}function tokens(e,t){return list(e,{parser:Token.parser(e,t),listName:t+" list"})}function identifiersOrStrings(e){let t=tokens(e,"identifier");return t.length?t:(t=tokens(e,"string"),t.length?t:void e.error("Expected identifiers or strings but none found"))}class ExtendedAttributeParameters extends Base{static parse(e){const t={assign:e.consume("=")},n=autoParenter(new ExtendedAttributeParameters({source:e.source,tokens:t}));return t.assign&&(t.secondaryName=e.consume("identifier","decimal","integer","string")),t.open=e.consume("("),t.open?(n.list=n.rhsIsList?identifiersOrStrings(e):argument_list(e),t.close=e.consume(")")||e.error("Unexpected token in extended attribute argument list")):n.hasRhs&&!t.secondaryName&&e.error("No right hand side to extended attribute assignment"),n.this}get rhsIsList(){return this.tokens.assign&&!this.tokens.secondaryName}get rhsType(){return this.rhsIsList?this.list[0].tokens.value.type+"-list":this.tokens.secondaryName?this.tokens.secondaryName.type:null}}class SimpleExtendedAttribute extends Base{static parse(e){const t=e.consume("identifier");if(t)return new SimpleExtendedAttribute({source:e.source,tokens:{name:t},params:ExtendedAttributeParameters.parse(e)})}constructor({source:e,tokens:t,params:n}){super({source:e,tokens:t}),n.parent=this,Object.defineProperty(this,"params",{value:n})}get type(){return"extended-attribute"}get name(){return this.tokens.name.value}get rhs(){const{rhsType:e,tokens:t,list:n}=this.params;return e?{type:e,value:this.params.rhsIsList?n:unescape(t.secondaryName.value)}:null}get arguments(){const{rhsIsList:e,list:t}=this.params;return!t||e?[]:t}*validate(e){if("NoInterfaceObject"===this.name){const e="`[NoInterfaceObject]` extended attribute is an undesirable feature that may be removed from Web IDL in the future. Refer to the [relevant upstream PR](https://github.com/heycam/webidl/pull/609) for more information.";yield validationError(this.tokens.name,this,"no-nointerfaceobject",e,{level:"warning"})}for(const t of this.arguments)yield*t.validate(e)}}class ExtendedAttributes extends ArrayBase{static parse(e){const t={};if(t.open=e.consume("["),!t.open)return new ExtendedAttributes({});const n=new ExtendedAttributes({source:e.source,tokens:t});return n.push(...list(e,{parser:SimpleExtendedAttribute.parse,listName:"extended attribute"})),t.close=e.consume("]")||e.error("Unexpected closing token of extended attribute"),n.length||e.error("Found an empty extended attribute"),e.probe("[")&&e.error("Illegal double extended attribute lists, consider merging them"),n}*validate(e){for(const t of this)yield*t.validate(e)}}class Argument extends Base{static parse(e){const t=e.position,n={},r=autoParenter(new Argument({source:e.source,tokens:n}));return r.extAttrs=ExtendedAttributes.parse(e),n.optional=e.consume("optional"),r.idlType=type_with_extended_attributes(e,"argument-type"),r.idlType?(n.optional||(n.variadic=e.consume("...")),n.name=e.consume("identifier",...argumentNameKeywords),n.name?(r.default=n.optional?Default.parse(e):null,r.this):e.unconsume(t)):e.unconsume(t)}get type(){return"argument"}get optional(){return!!this.tokens.optional}get variadic(){return!!this.tokens.variadic}get name(){return unescape(this.tokens.name.value)}*validate(e){yield*this.idlType.validate(e);const t=idlTypeIncludesDictionary(this.idlType,e,{useNullableInner:!0});if(t)if(this.idlType.nullable){const e="Dictionary arguments cannot be nullable.";yield validationError(this.tokens.name,this,"no-nullable-dict-arg",e)}else if(this.optional){if(!this.default){const e="Optional dictionary arguments must have a default value of `{}`.";yield validationError(this.tokens.name,this,"dict-arg-default",e,{autofix:autofixOptionalDictionaryDefaultValue(this)})}}else if(this.parent&&!dictionaryIncludesRequiredField(t.dictionary,e)&&isLastRequiredArgument(this)){const e="Dictionary argument must be optional if it has no required fields";yield validationError(this.tokens.name,this,"dict-arg-optional",e,{autofix:autofixDictionaryArgumentOptionality(this)})}}}function isLastRequiredArgument(e){const t=e.parent.arguments||e.parent.list,n=t.indexOf(e);return!t.slice(n+1).some(e=>!e.optional)}function autofixDictionaryArgumentOptionality(e){return()=>{const t=getFirstToken(e.idlType);e.tokens.optional={type:"optional",value:"optional",trivia:t.trivia},t.trivia=" ",autofixOptionalDictionaryDefaultValue(e)()}}function autofixOptionalDictionaryDefaultValue(e){return()=>{e.default=Default.parse(new Tokeniser(" = {}"))}}class Operation extends Base{static parse(e,{special:t,regular:n}={}){const r={special:t},o=autoParenter(new Operation({source:e.source,tokens:r}));return t&&"stringifier"===t.value&&(r.termination=e.consume(";"),r.termination)?(o.arguments=[],o):(t||n||(r.special=e.consume("getter","setter","deleter")),o.idlType=return_type(e)||e.error("Missing return type"),r.name=e.consume("identifier","includes"),r.open=e.consume("(")||e.error("Invalid operation"),o.arguments=argument_list(e),r.close=e.consume(")")||e.error("Unterminated operation"),r.termination=e.consume(";")||e.error("Unterminated operation, expected `;`"),o.this)}get type(){return"operation"}get name(){const{name:e}=this.tokens;return e?unescape(e.value):""}get special(){return this.tokens.special?this.tokens.special.value:""}*validate(e){if(!this.name&&["","static"].includes(this.special)){const e="Regular or static operations must have both a return type and an identifier.";yield validationError(this.tokens.open,this,"incomplete-op",e)}this.idlType&&(yield*this.idlType.validate(e));for(const t of this.arguments)yield*t.validate(e)}}class Attribute extends Base{static parse(e,{special:t,noInherit:n=!1,readonly:r=!1}={}){const o=e.position,i={special:t},s=autoParenter(new Attribute({source:e.source,tokens:i}));if(t||n||(i.special=e.consume("inherit")),"inherit"===s.special&&e.probe("readonly")&&e.error("Inherited attributes cannot be read-only"),i.readonly=e.consume("readonly"),r&&!i.readonly&&e.probe("attribute")&&e.error("Attributes must be readonly in this context"),i.base=e.consume("attribute"),i.base){switch(s.idlType=type_with_extended_attributes(e,"attribute-type")||e.error("Attribute lacks a type"),s.idlType.generic){case"sequence":case"record":e.error(`Attributes cannot accept ${s.idlType.generic} types`)}return i.name=e.consume("identifier","async","required")||e.error("Attribute lacks a name"),i.termination=e.consume(";")||e.error("Unterminated attribute, expected `;`"),s.this}e.unconsume(o)}get type(){return"attribute"}get special(){return this.tokens.special?this.tokens.special.value:""}get readonly(){return!!this.tokens.readonly}get name(){return unescape(this.tokens.name.value)}*validate(e){yield*this.idlType.validate(e)}}function unescape(e){return e.startsWith("_")?e.slice(1):e}function list(e,{parser:t,allowDangler:n,listName:r="list"}){const o=t(e);if(!o)return[];o.tokens.separator=e.consume(",");const i=[o];for(;o.tokens.separator;){const o=t(e);if(!o){n||e.error(`Trailing comma in ${r}`);break}if(o.tokens.separator=e.consume(","),i.push(o),!o.tokens.separator)break}return i}function const_value(e){return e.consume("true","false","Infinity","-Infinity","NaN","decimal","integer")}function const_data({type:e,value:t}){switch(e){case"true":case"false":return{type:"boolean",value:"true"===e};case"Infinity":case"-Infinity":return{type:"Infinity",negative:e.startsWith("-")};case"[":return{type:"sequence",value:[]};case"{":return{type:"dictionary"};case"decimal":case"integer":return{type:"number",value:t};case"string":return{type:"string",value:t.slice(1,-1)};default:return{type:e}}}function primitive_type(e){const{source:t}=e,n=function(){const n=e.consume("unsigned"),r=e.consume("short","long");if(r){const o=e.consume("long");return new Type({source:t,tokens:{prefix:n,base:r,postfix:o}})}n&&e.error("Failed to parse integer type")}()||function(){const n=e.consume("unrestricted"),r=e.consume("float","double");if(r)return new Type({source:t,tokens:{prefix:n,base:r}});n&&e.error("Failed to parse float type")}();if(n)return n;const r=e.consume("boolean","byte","octet");return r?new Type({source:t,tokens:{base:r}}):void 0}function argument_list(e){return list(e,{parser:Argument.parse,listName:"arguments list"})}function type_with_extended_attributes(e,t){const n=ExtendedAttributes.parse(e),r=Type.parse(e,t);return r&&(autoParenter(r).extAttrs=n),r}function return_type(e,t){const n=Type.parse(e,t||"return-type");if(n)return n;const r=e.consume("void");if(r){const t=new Type({source:e.source,tokens:{base:r}});return t.type="return-type",t}}function stringifier(e){const t=e.consume("stringifier");if(t)return Attribute.parse(e,{special:t})||Operation.parse(e,{special:t})||e.error("Unterminated stringifier")}function getLastIndentation(e){const t=e.split("\n");if(t.length){const e=t[t.length-1].match(/^\s+/);if(e)return e[0]}return""}function getMemberIndentation(e){const t=getLastIndentation(e),n=t.includes("\t")?"\t":"  ";return t+n}function autofixAddExposedWindow(e){return()=>{if(e.extAttrs.length){const t=new Tokeniser("Exposed=Window,"),n=SimpleExtendedAttribute.parse(t);n.tokens.separator=t.consume(",");const r=e.extAttrs[0];/^\s/.test(r.tokens.name.trivia)||(r.tokens.name.trivia=` ${r.tokens.name.trivia}`),e.extAttrs.unshift(n)}else{autoParenter(e).extAttrs=ExtendedAttributes.parse(new Tokeniser("[Exposed=Window]"));const t=e.tokens.base.trivia;e.extAttrs.tokens.open.trivia=t,e.tokens.base.trivia=`\n${getLastIndentation(t)}`}}}function getFirstToken(e){if(e.extAttrs.length)return e.extAttrs.tokens.open;if("operation"===e.type&&!e.special)return getFirstToken(e.idlType);return Object.values(e.tokens).sort((e,t)=>e.index-t.index)[0]}function findLastIndex(e,t){const n=e.slice().reverse().findIndex(t);return-1===n?n:e.length-n-1}function autoParenter(e,t){return t||(t=e),e?new Proxy(e,{get(e,t){const n=e[t];return Array.isArray(n)?autoParenter(n,e):n},set(e,n,r){if(e[n]=r,!r)return!0;if(Array.isArray(r))for(const e of r)void 0!==e.parent&&(e.parent=t);else void 0!==r.parent&&(r.parent=t);return!0}}):e}const tokenRe={decimal:/-?(?=[0-9]*\.|[0-9]+[eE])(([0-9]+\.[0-9]*|[0-9]*\.[0-9]+)([Ee][-+]?[0-9]+)?|[0-9]+[Ee][-+]?[0-9]+)/y,integer:/-?(0([Xx][0-9A-Fa-f]+|[0-7]*)|[1-9][0-9]*)/y,identifier:/[_-]?[A-Za-z][0-9A-Z_a-z-]*/y,string:/"[^"]*"/y,whitespace:/[\t\n\r ]+/y,comment:/((\/(\/.*|\*([^*]|\*[^/])*\*\/)[\t\n\r ]*)+)/y,other:/[^\t\n\r 0-9A-Za-z]/y},typeNameKeywords=["ArrayBuffer","DataView","Int8Array","Int16Array","Int32Array","Uint8Array","Uint16Array","Uint32Array","Uint8ClampedArray","Float32Array","Float64Array","any","object","symbol"],stringTypes=["ByteString","DOMString","USVString"],argumentNameKeywords=["async","attribute","callback","const","constructor","deleter","dictionary","enum","getter","includes","inherit","interface","iterable","maplike","namespace","partial","required","setlike","setter","static","stringifier","typedef","unrestricted"],nonRegexTerminals=["-Infinity","FrozenArray","Infinity","NaN","Promise","boolean","byte","double","false","float","long","mixin","null","octet","optional","or","readonly","record","sequence","short","true","unsigned","void"].concat(argumentNameKeywords,stringTypes,typeNameKeywords),punctuations=["(",")",",","...",":",";","<","=",">","?","[","]","{","}"],reserved=["_constructor","toString","_toString"];function tokenise(e){const t=[];let n=0,r="",o=1,i=0;for(;n<e.length;){const a=e.charAt(n);let c=-1;if(/[\t\n\r ]/.test(a)?c=s("whitespace",{noFlushTrivia:!0}):"/"===a&&(c=s("comment",{noFlushTrivia:!0})),-1!==c){const e=t.pop().value;o+=(e.match(/\n/g)||[]).length,r+=e,i-=1}else if(/[-0-9.A-Z_a-z]/.test(a)){if(c=s("decimal"),-1===c&&(c=s("integer")),-1===c){c=s("identifier");const e=t.length-1,n=t[e];if(-1!==c){if(reserved.includes(n.value)){const r=`${unescape(n.value)} is a reserved identifier and must not be used.`;throw new WebIDLParseError(syntaxError(t,e,null,r))}nonRegexTerminals.includes(n.value)&&(n.type=n.value)}}}else'"'===a&&(c=s("string"));for(const s of punctuations)if(e.startsWith(s,n)){t.push({type:s,value:s,trivia:r,line:o,index:i}),r="",n+=s.length,c=n;break}if(-1===c&&(c=s("other")),-1===c)throw new Error("Token stream not progressing");n=c,i+=1}return t.push({type:"eof",value:"",trivia:r}),t;function s(s,{noFlushTrivia:a}={}){const c=tokenRe[s];c.lastIndex=n;const l=c.exec(e);return l?(t.push({type:s,value:l[0],trivia:r,line:o,index:i}),a||(r=""),c.lastIndex):-1}}class Tokeniser{constructor(e){this.source=tokenise(e),this.position=0}error(e){throw new WebIDLParseError(syntaxError(this.source,this.position,this.current,e))}probe(e){return this.source.length>this.position&&this.source[this.position].type===e}consume(...e){for(const t of e){if(!this.probe(t))continue;const e=this.source[this.position];return this.position++,e}}unconsume(e){this.position=e}}class WebIDLParseError extends Error{constructor({message:e,bareMessage:t,context:n,line:r,sourceName:o,input:i,tokens:s}){super(e),this.name="WebIDLParseError",this.bareMessage=t,this.context=n,this.line=r,this.sourceName=o,this.input=i,this.tokens=s}}class EnumValue extends Token{static parse(e){const t=e.consume("string");if(t)return new EnumValue({source:e.source,tokens:{value:t}})}get type(){return"enum-value"}get value(){return super.value.slice(1,-1)}}class Enum extends Base{static parse(e){const t={};if(t.base=e.consume("enum"),!t.base)return;t.name=e.consume("identifier")||e.error("No name for enum");const n=autoParenter(new Enum({source:e.source,tokens:t}));return e.current=n.this,t.open=e.consume("{")||e.error("Bodyless enum"),n.values=list(e,{parser:EnumValue.parse,allowDangler:!0,listName:"enumeration"}),e.probe("string")&&e.error("No comma between enum values"),t.close=e.consume("}")||e.error("Unexpected value in enum"),n.values.length||e.error("No value in enum"),t.termination=e.consume(";")||e.error("No semicolon after enum"),n.this}get type(){return"enum"}get name(){return unescape(this.tokens.name.value)}}class Includes extends Base{static parse(e){const t=e.consume("identifier");if(!t)return;const n={target:t};if(n.includes=e.consume("includes"),n.includes)return n.mixin=e.consume("identifier")||e.error("Incomplete includes statement"),n.termination=e.consume(";")||e.error("No terminating ; for includes statement"),new Includes({source:e.source,tokens:n});e.unconsume(t.index)}get type(){return"includes"}get target(){return unescape(this.tokens.target.value)}get includes(){return unescape(this.tokens.mixin.value)}}class Typedef extends Base{static parse(e){const t={},n=autoParenter(new Typedef({source:e.source,tokens:t}));if(t.base=e.consume("typedef"),t.base)return n.idlType=type_with_extended_attributes(e,"typedef-type")||e.error("Typedef lacks a type"),t.name=e.consume("identifier")||e.error("Typedef lacks a name"),e.current=n.this,t.termination=e.consume(";")||e.error("Unterminated typedef, expected `;`"),n.this}get type(){return"typedef"}get name(){return unescape(this.tokens.name.value)}*validate(e){yield*this.idlType.validate(e)}}class CallbackFunction extends Base{static parse(e,t){const n={base:t},r=autoParenter(new CallbackFunction({source:e.source,tokens:n}));return n.name=e.consume("identifier")||e.error("Callback lacks a name"),e.current=r.this,n.assign=e.consume("=")||e.error("Callback lacks an assignment"),r.idlType=return_type(e)||e.error("Callback lacks a return type"),n.open=e.consume("(")||e.error("Callback lacks parentheses for arguments"),r.arguments=argument_list(e),n.close=e.consume(")")||e.error("Unterminated callback"),n.termination=e.consume(";")||e.error("Unterminated callback, expected `;`"),r.this}get type(){return"callback"}get name(){return unescape(this.tokens.name.value)}*validate(e){yield*this.idlType.validate(e)}}function inheritance(e){const t=e.consume(":");return t?{colon:t,inheritance:e.consume("identifier")||e.error("Inheritance lacks a type")}:{}}class Container extends Base{static parse(e,t,{type:n,inheritable:r,allowedMembers:o}){const{tokens:i}=t;for(i.name=e.consume("identifier")||e.error(`Missing name in ${t.type}`),e.current=t,t=autoParenter(t),r&&Object.assign(i,inheritance(e)),i.open=e.consume("{")||e.error(`Bodyless ${n}`),t.members=[];;){if(i.close=e.consume("}"),i.close)return i.termination=e.consume(";")||e.error(`Missing semicolon after ${n}`),t.this;const r=ExtendedAttributes.parse(e);let s;for(const[t,...n]of o)if(s=autoParenter(t(e,...n)),s)break;s||e.error("Unknown member"),s.extAttrs=r,t.members.push(s.this)}}get partial(){return!!this.tokens.partial}get name(){return unescape(this.tokens.name.value)}get inheritance(){return this.tokens.inheritance?unescape(this.tokens.inheritance.value):null}*validate(e){for(const t of this.members)t.validate&&(yield*t.validate(e))}}class Constant extends Base{static parse(e){const t={};if(t.base=e.consume("const"),!t.base)return;let n=primitive_type(e);if(!n){const t=e.consume("identifier")||e.error("Const lacks a type");n=new Type({source:e.source,tokens:{base:t}})}e.probe("?")&&e.error("Unexpected nullable constant type"),n.type="const-type",t.name=e.consume("identifier")||e.error("Const lacks a name"),t.assign=e.consume("=")||e.error("Const lacks value assignment"),t.value=const_value(e)||e.error("Const lacks a value"),t.termination=e.consume(";")||e.error("Unterminated const, expected `;`");const r=new Constant({source:e.source,tokens:t});return autoParenter(r).idlType=n,r}get type(){return"const"}get name(){return unescape(this.tokens.name.value)}get value(){return const_data(this.tokens.value)}}class IterableLike extends Base{static parse(e){const t=e.position,n={},r=autoParenter(new IterableLike({source:e.source,tokens:n}));if(n.readonly=e.consume("readonly"),n.readonly||(n.async=e.consume("async")),n.base=n.readonly?e.consume("maplike","setlike"):n.async?e.consume("iterable"):e.consume("iterable","maplike","setlike"),!n.base)return void e.unconsume(t);const{type:o}=r,i="maplike"===o||r.async,s=i||"iterable"===o;n.open=e.consume("<")||e.error(`Missing less-than sign \`<\` in ${o} declaration`);const a=type_with_extended_attributes(e)||e.error(`Missing a type argument in ${o} declaration`);return r.idlType=[a],s&&(a.tokens.separator=e.consume(","),a.tokens.separator?r.idlType.push(type_with_extended_attributes(e)):i&&e.error(`Missing second type argument in ${o} declaration`)),n.close=e.consume(">")||e.error(`Missing greater-than sign \`>\` in ${o} declaration`),n.termination=e.consume(";")||e.error(`Missing semicolon after ${o} declaration`),r.this}get type(){return this.tokens.base.value}get readonly(){return!!this.tokens.readonly}get async(){return!!this.tokens.async}}function*checkInterfaceMemberDuplication(e,t){const n=new Set(s(t).map(e=>e.name)),r=e.partials.get(t.name)||[],o=e.mixinMap.get(t.name)||[];for(const e of[...r,...o]){const r=s(e);yield*i(r,n,e,t);for(const e of r)n.add(e.name)}function*i(e,t,n,r){for(const o of e){const{name:e}=o;if(e&&t.has(e)){const t=`The operation "${e}" has already been defined for the base interface "${r.name}" either in itself or in a mixin`;yield validationError(o.tokens.name,n,"no-cross-overload",t)}}}function s(e){return e.members.filter(({type:e})=>"operation"===e)}}class Constructor extends Base{static parse(e){const t=e.consume("constructor");if(!t)return;const n={base:t};n.open=e.consume("(")||e.error("No argument list in constructor");const r=argument_list(e);n.close=e.consume(")")||e.error("Unterminated constructor"),n.termination=e.consume(";")||e.error("No semicolon after constructor");const o=new Constructor({source:e.source,tokens:n});return autoParenter(o).arguments=r,o}get type(){return"constructor"}*validate(e){this.idlType&&(yield*this.idlType.validate(e));for(const t of this.arguments)yield*t.validate(e)}}function static_member(e){const t=e.consume("static");if(t)return Attribute.parse(e,{special:t})||Operation.parse(e,{special:t})||e.error("No body in static member")}class Interface extends Container{static parse(e,t,{partial:n=null}={}){const r={partial:n,base:t};return Container.parse(e,new Interface({source:e.source,tokens:r}),{type:"interface",inheritable:!n,allowedMembers:[[Constant.parse],[Constructor.parse],[static_member],[stringifier],[IterableLike.parse],[Attribute.parse],[Operation.parse]]})}get type(){return"interface"}*validate(e){if(yield*this.extAttrs.validate(e),!this.partial&&this.extAttrs.every(e=>"Exposed"!==e.name)&&this.extAttrs.every(e=>"NoInterfaceObject"!==e.name)){const e="Interfaces must have `[Exposed]` extended attribute. To fix, add, for example, `[Exposed=Window]`. Please also consider carefully if your interface should also be exposed in a Worker scope. Refer to the [WebIDL spec section on Exposed](https://heycam.github.io/webidl/#Exposed) for more information.";yield validationError(this.tokens.name,this,"require-exposed",e,{autofix:autofixAddExposedWindow(this)})}const t=this.extAttrs.filter(e=>"Constructor"===e.name);for(const e of t){const t="Constructors should now be represented as a `constructor()` operation on the interface instead of `[Constructor]` extended attribute. Refer to the [WebIDL spec section on constructor operations](https://heycam.github.io/webidl/#idl-constructors) for more information.";yield validationError(e.tokens.name,this,"constructor-member",t,{autofix:autofixConstructor(this,e)})}if(this.extAttrs.some(e=>"Global"===e.name)){const e=this.extAttrs.filter(e=>"NamedConstructor"===e.name);for(const t of e){const e="Interfaces marked as `[Global]` cannot have named constructors.";yield validationError(t.tokens.name,this,"no-constructible-global",e)}const t=this.members.filter(e=>"constructor"===e.type);for(const e of t){const t="Interfaces marked as `[Global]` cannot have constructors.";yield validationError(e.tokens.base,this,"no-constructible-global",t)}}yield*super.validate(e),this.partial||(yield*checkInterfaceMemberDuplication(e,this))}}function autofixConstructor(e,t){return e=autoParenter(e),()=>{const n=getLastIndentation(e.extAttrs.tokens.open.trivia),r=e.members.length?getLastIndentation(getFirstToken(e.members[0]).trivia):getMemberIndentation(n),o=Constructor.parse(new Tokeniser(`\n${r}constructor();`));o.extAttrs=[],autoParenter(o).arguments=t.arguments;const i=findLastIndex(e.members,e=>"constructor"===e.type);e.members.splice(i+1,0,o);const{close:s}=e.tokens;s.trivia.includes("\n")||(s.trivia+=`\n${n}`);const{extAttrs:a}=e,c=a.indexOf(t),l=a.splice(c,1);a.length?a.length===c?a[c-1].tokens.separator=void 0:a[c].tokens.name.trivia.trim()||(a[c].tokens.name.trivia=l[0].tokens.name.trivia):a.tokens.open=a.tokens.close=void 0}}class Mixin extends Container{static parse(e,t,{partial:n}={}){const r={partial:n,base:t};if(r.mixin=e.consume("mixin"),r.mixin)return Container.parse(e,new Mixin({source:e.source,tokens:r}),{type:"interface mixin",allowedMembers:[[Constant.parse],[stringifier],[Attribute.parse,{noInherit:!0}],[Operation.parse,{regular:!0}]]})}get type(){return"interface mixin"}}class Field extends Base{static parse(e){const t={},n=autoParenter(new Field({source:e.source,tokens:t}));return n.extAttrs=ExtendedAttributes.parse(e),t.required=e.consume("required"),n.idlType=type_with_extended_attributes(e,"dictionary-type")||e.error("Dictionary member lacks a type"),t.name=e.consume("identifier")||e.error("Dictionary member lacks a name"),n.default=Default.parse(e),t.required&&n.default&&e.error("Required member must not have a default"),t.termination=e.consume(";")||e.error("Unterminated dictionary member, expected `;`"),n.this}get type(){return"field"}get name(){return unescape(this.tokens.name.value)}get required(){return!!this.tokens.required}*validate(e){yield*this.idlType.validate(e)}}class Dictionary extends Container{static parse(e,{partial:t}={}){const n={partial:t};if(n.base=e.consume("dictionary"),n.base)return Container.parse(e,new Dictionary({source:e.source,tokens:n}),{type:"dictionary",inheritable:!t,allowedMembers:[[Field.parse]]})}get type(){return"dictionary"}}class Namespace extends Container{static parse(e,{partial:t}={}){const n={partial:t};if(n.base=e.consume("namespace"),n.base)return Container.parse(e,new Namespace({source:e.source,tokens:n}),{type:"namespace",allowedMembers:[[Attribute.parse,{noInherit:!0,readonly:!0}],[Operation.parse,{regular:!0}]]})}get type(){return"namespace"}*validate(e){if(!this.partial&&this.extAttrs.every(e=>"Exposed"!==e.name)){const e="Namespaces must have [Exposed] extended attribute. To fix, add, for example, [Exposed=Window]. Please also consider carefully if your namespace should also be exposed in a Worker scope. Refer to the [WebIDL spec section on Exposed](https://heycam.github.io/webidl/#Exposed) for more information.";yield validationError(this.tokens.name,this,"require-exposed",e,{autofix:autofixAddExposedWindow(this)})}yield*super.validate(e)}}class CallbackInterface extends Container{static parse(e,t,{partial:n=null}={}){const r={callback:t};if(r.base=e.consume("interface"),r.base)return Container.parse(e,new CallbackInterface({source:e.source,tokens:r}),{type:"callback interface",inheritable:!n,allowedMembers:[[Constant.parse],[Operation.parse,{regular:!0}]]})}get type(){return"callback interface"}}function parseByTokens(e,t){const n=e.source;function r(t){e.error(t)}function o(...t){return e.consume(...t)}function i(t){const n=o("interface");if(n)return Mixin.parse(e,n,t)||Interface.parse(e,n,t)||r("Interface has no proper body")}function s(){return function(){const t=o("callback");if(t)return e.probe("interface")?CallbackInterface.parse(e,t):CallbackFunction.parse(e,t)}()||i()||function(){const t=o("partial");if(t)return Dictionary.parse(e,{partial:t})||i({partial:t})||Namespace.parse(e,{partial:t})||r("Partial doesn't apply to anything")}()||Dictionary.parse(e)||Enum.parse(e)||Typedef.parse(e)||Includes.parse(e)||Namespace.parse(e)}const a=function(){if(!n.length)return[];const i=[];for(;;){const t=ExtendedAttributes.parse(e),n=s();if(!n){t.length&&r("Stray extended attributes");break}autoParenter(n).extAttrs=t,i.push(n)}const a=o("eof");return t.concrete&&i.push(a),i}();return e.position<n.length&&r("Unrecognised tokens"),a}function parse(e,t={}){const n=new Tokeniser(e);return void 0!==t.sourceName&&(n.source.name=t.sourceName),parseByTokens(n,t)}function noop(e){return e}const templates={wrap:e=>e.join(""),trivia:noop,name:noop,reference:noop,type:noop,generic:noop,nameless:noop,inheritance:noop,definition:noop,extendedAttribute:noop,extendedAttributeReference:noop};function write(e,{templates:t=templates}={}){function n(e,{unescaped:n,context:r}){return n||(n=e.startsWith("_")?e.slice(1):e),t.reference(e,n,r)}function r(e,n=noop,...r){if(!e)return"";const o=n(e.value,...r);return t.wrap([t.trivia(e.trivia),o])}function o(e,t){return r(e,n,{context:t})}function i(e,n){return r(e,t.name,n)}function s(e){if(e.union||e.generic)return t.wrap([r(e.tokens.base,t.generic),r(e.tokens.open),...e.subtype.map(a),r(e.tokens.close)]);const o=e.tokens.prefix||e.tokens.base,i=e.tokens.prefix?[e.tokens.prefix.value,t.trivia(e.tokens.base.trivia)]:[],s=n(t.wrap([...i,e.tokens.base.value,r(e.tokens.postfix)]),{unescaped:e.idlType,context:e});return t.wrap([t.trivia(o.trivia),s])}function a(e){return t.wrap([p(e.extAttrs),s(e),r(e.tokens.nullable),r(e.tokens.separator)])}function c(e){return e?t.wrap([r(e.tokens.assign),...e.expression.map(e=>r(e))]):""}function l(e){return t.wrap([p(e.extAttrs),r(e.tokens.optional),t.type(a(e.idlType)),r(e.tokens.variadic),i(e.tokens.name,{data:e}),c(e.default),r(e.tokens.separator)])}function u(e){return t.wrap([r(e.tokens.value),r(e.tokens.separator)])}function d(e){const{rhsType:n}=e.params;return t.wrap([t.trivia(e.tokens.name.trivia),t.extendedAttribute(t.wrap([t.extendedAttributeReference(e.name),r(e.params.tokens.assign),o(e.params.tokens.secondaryName,e),r(e.params.tokens.open),...e.params.list?e.params.list.map("identifier-list"===n?n=>(function(e,n){return t.wrap([o(e.tokens.value,n),r(e.tokens.separator)])})(n,e):"string-list"===n?u:l):[],r(e.params.tokens.close)])),r(e.tokens.separator)])}function p(e){return e.length?t.wrap([r(e.tokens.open),...e.map(d),r(e.tokens.close)]):""}function h(e){return t.definition(t.wrap([p(e.extAttrs),r(e.tokens.callback),r(e.tokens.partial),r(e.tokens.base),r(e.tokens.mixin),i(e.tokens.name,{data:e}),(o=e,o.tokens.inheritance?t.wrap([r(o.tokens.colon),t.trivia(o.tokens.inheritance.trivia),t.inheritance(n(o.tokens.inheritance.value,{context:o}))]):""),r(e.tokens.open),g(e.members,e),r(e.tokens.close),r(e.tokens.termination)]),{data:e});var o}function f(e,n){return t.definition(t.wrap([p(e.extAttrs),r(e.tokens.readonly),r(e.tokens.async),r(e.tokens.base,t.generic),r(e.tokens.open),t.wrap(e.idlType.map(a)),r(e.tokens.close),r(e.tokens.termination)]),{data:e,parent:n})}t=Object.assign({},templates,t);const m={interface:h,"interface mixin":h,namespace:h,operation:function(e,n){const o=e.idlType?[t.type(a(e.idlType)),i(e.tokens.name,{data:e,parent:n}),r(e.tokens.open),t.wrap(e.arguments.map(l)),r(e.tokens.close)]:[];return t.definition(t.wrap([p(e.extAttrs),e.tokens.name?r(e.tokens.special):r(e.tokens.special,t.nameless,{data:e,parent:n}),...o,r(e.tokens.termination)]),{data:e,parent:n})},attribute:function(e,n){return t.definition(t.wrap([p(e.extAttrs),r(e.tokens.special),r(e.tokens.readonly),r(e.tokens.base),t.type(a(e.idlType)),i(e.tokens.name,{data:e,parent:n}),r(e.tokens.termination)]),{data:e,parent:n})},constructor:function(e,n){return t.definition(t.wrap([p(e.extAttrs),r(e.tokens.base,t.nameless,{data:e,parent:n}),r(e.tokens.open),t.wrap(e.arguments.map(l)),r(e.tokens.close),r(e.tokens.termination)]),{data:e,parent:n})},dictionary:h,field:function(e,n){return t.definition(t.wrap([p(e.extAttrs),r(e.tokens.required),t.type(a(e.idlType)),i(e.tokens.name,{data:e,parent:n}),c(e.default),r(e.tokens.termination)]),{data:e,parent:n})},const:function(e,n){return t.definition(t.wrap([p(e.extAttrs),r(e.tokens.base),t.type(a(e.idlType)),i(e.tokens.name,{data:e,parent:n}),r(e.tokens.assign),r(e.tokens.value),r(e.tokens.termination)]),{data:e,parent:n})},typedef:function(e){return t.definition(t.wrap([p(e.extAttrs),r(e.tokens.base),t.type(a(e.idlType)),i(e.tokens.name,{data:e}),r(e.tokens.termination)]),{data:e})},includes:function(e){return t.definition(t.wrap([p(e.extAttrs),o(e.tokens.target,e),r(e.tokens.includes),o(e.tokens.mixin,e),r(e.tokens.termination)]),{data:e})},callback:function(e){return t.definition(t.wrap([p(e.extAttrs),r(e.tokens.base),i(e.tokens.name,{data:e}),r(e.tokens.assign),t.type(a(e.idlType)),r(e.tokens.open),...e.arguments.map(l),r(e.tokens.close),r(e.tokens.termination)]),{data:e})},enum:function(e){return t.definition(t.wrap([p(e.extAttrs),r(e.tokens.base),i(e.tokens.name,{data:e}),r(e.tokens.open),g(e.values,e),r(e.tokens.close),r(e.tokens.termination)]),{data:e})},"enum-value":function(e,n){return t.wrap([t.trivia(e.tokens.value.trivia),t.definition(t.wrap(['"',t.name(e.value,{data:e,parent:n}),'"']),{data:e,parent:n}),r(e.tokens.separator)])},iterable:f,maplike:f,setlike:f,"callback interface":h,eof:function(e){return t.trivia(e.trivia)}};function g(e,n){if(!e)return;const r=e.map(e=>(function(e,t){if(!m[e.type])throw new Error(`Type "${e.type}" is unsupported`);return m[e.type](e,t)})(e,n));return t.wrap(r)}return g(e)}function getMixinMap(e,t){const n=new Map,r=e.filter(e=>"includes"===e.type);for(const e of r){const r=t.get(e.includes);if(!r)continue;const o=n.get(e.target);o?o.push(r):n.set(e.target,[r])}return n}function groupDefinitions(e){const t=new Map,n=new Set,r=new Map;for(const o of e)if(o.partial){const e=r.get(o.name);e?e.push(o):r.set(o.name,[o])}else o.name&&(t.has(o.name)?n.add(o):t.set(o.name,o));return{all:e,unique:t,partials:r,duplicates:n,mixinMap:getMixinMap(e,t),cache:{typedefIncludesDictionary:new WeakMap,dictionaryIncludesRequiredField:new WeakMap}}}function*checkDuplicatedNames({unique:e,duplicates:t}){for(const n of t){const{name:t}=n,r=`The name "${t}" of type "${e.get(t).type}" was already seen`;yield validationError(n.tokens.name,n,"no-duplicate",r)}}function*validateIterable(e){const t=groupDefinitions(e);for(const e of t.all)e.validate&&(yield*e.validate(t));yield*checkDuplicatedNames(t)}function flatten(e){return e.flat?e.flat():[].concat(...e)}function validate(e){return[...validateIterable(flatten(e))]}var _webidl2=Object.freeze({__proto__:null,parse:parse,write:write,validate:validate,WebIDLParseError:WebIDLParseError}),hyperHTML=function(e){/*! (c) Andrea Giammarchi - ISC */var t={};try{t.WeakMap=WeakMap}catch(u){t.WeakMap=function(e,t){var n=t.defineProperty,r=t.hasOwnProperty,o=i.prototype;return o.delete=function(e){return this.has(e)&&delete e[this._]},o.get=function(e){return this.has(e)?e[this._]:void 0},o.has=function(e){return r.call(e,this._)},o.set=function(e,t){return n(e,this._,{configurable:!0,value:t}),this},i;function i(t){n(this,"_",{value:"_@ungap/weakmap"+e++}),t&&t.forEach(s,this)}function s(e){this.set(e[0],e[1])}}(Math.random(),Object)}var n=t.WeakMap,r={};
/*! (c) Andrea Giammarchi - ISC */try{r.WeakSet=WeakSet}catch(u){!function(e,t){var n=o.prototype;function o(){t(this,"_",{value:"_@ungap/weakmap"+e++})}n.add=function(e){return this.has(e)||t(e,this._,{value:!0,configurable:!0}),this},n.has=function(e){return this.hasOwnProperty.call(e,this._)},n.delete=function(e){return this.has(e)&&delete e[this._]},r.WeakSet=o}(Math.random(),Object.defineProperty)}function o(e,t,n,r,o,i){for(var s=("selectedIndex"in t),a=s;r<o;){var c=e(n[r],1);if(t.insertBefore(c,i),s&&a&&c.selected){a=!a;var l=t.selectedIndex;t.selectedIndex=l<0?r:d.call(t.querySelectorAll("option"),c)}r++}}function i(e,t){return e==t}function s(e){return e}function a(e,t,n,r,o,i,s){var a=i-o;if(a<1)return-1;for(;a<=n-t;){for(var c=t,l=o;c<n&&l<i&&s(e[c],r[l]);)c++,l++;if(l===i)return t;t=c+1}return-1}function c(e,t,n,r,o){return n<r?e(t[n],0):0<n?e(t[n-1],-0).nextSibling:o}function l(e,t,n,r){for(;n<r;)h(e(t[n++],-1))}var u=r.WeakSet,d=[].indexOf,p=function(e,t,n){for(var r=1,o=t;r<o;){var i=(r+o)/2>>>0;n<e[i]?o=i:r=1+i}return r},h=function(e){return(e.remove||function(){var e=this.parentNode;e&&e.removeChild(this)}
/*! (c) 2018 Andrea Giammarchi (ISC) */).call(e)};function f(e,t,n,r){for(var u=(r=r||{}).compare||i,d=r.node||s,h=null==r.before?null:d(r.before,0),f=t.length,m=f,g=0,b=n.length,y=0;g<m&&y<b&&u(t[g],n[y]);)g++,y++;for(;g<m&&y<b&&u(t[m-1],n[b-1]);)m--,b--;var $=g===m,w=y===b;if($&&w)return n;if($&&y<b)return o(d,e,n,y,b,c(d,t,g,f,h)),n;if(w&&g<m)return l(d,t,g,m),n;var v=m-g,k=b-y,x=-1;if(v<k){if(-1<(x=a(n,y,b,t,g,m,u)))return o(d,e,n,y,x,d(t[g],0)),o(d,e,n,x+v,b,c(d,t,m,f,h)),n}else if(k<v&&-1<(x=a(t,g,m,n,y,b,u)))return l(d,t,g,x),l(d,t,x+k,m),n;return v<2||k<2?(o(d,e,n,y,b,d(t[g],0)),l(d,t,g,m)):v==k&&function(e,t,n,r,o,i){for(;r<o&&i(n[r],e[t-1]);)r++,t--;return 0===t}(n,b,t,g,m,u)?o(d,e,n,y,b,c(d,t,m,f,h)):function(e,t,n,r,i,s,a,c,u,d,h,f,m){!function(e,t,n,r,i,s,a,c,u){for(var d=[],p=e.length,h=a,f=0;f<p;)switch(e[f++]){case 0:i++,h++;break;case 1:d.push(r[i]),o(t,n,r,i++,i,h<c?t(s[h],0):u);break;case-1:h++}for(f=0;f<p;)switch(e[f++]){case 0:a++;break;case-1:-1<d.indexOf(s[a])?a++:l(t,s,a++,a)}}(function(e,t,n,r,o,i,s){var a,c,l,u,d,p,h,f=n+i,m=[];e:for(a=0;a<=f;a++){if(50<a)return null;for(h=a-1,d=a?m[a-1]:[0,0],p=m[a]=[],c=-a;c<=a;c+=2){for(l=(u=c===-a||c!==a&&d[h+c-1]<d[h+c+1]?d[h+c+1]:d[h+c-1]+1)-c;u<i&&l<n&&s(r[o+u],e[t+l]);)u++,l++;if(u===i&&l===n)break e;p[a+c]=u}}var g=Array(a/2+f/2),b=g.length-1;for(a=m.length-1;0<=a;a--){for(;0<u&&0<l&&s(r[o+u-1],e[t+l-1]);)g[b--]=0,u--,l--;if(!a)break;h=a-1,d=a?m[a-1]:[0,0],(c=u-l)==-a||c!==a&&d[h+c-1]<d[h+c+1]?(l--,g[b--]=1):(u--,g[b--]=-1)}return g}(n,r,s,a,c,d,f)||function(e,t,n,r,o,i,s,a){var c=0,l=r<a?r:a,u=Array(l++),d=Array(l);d[0]=-1;for(var h=1;h<l;h++)d[h]=s;for(var f=o.slice(i,s),m=t;m<n;m++){var g=f.indexOf(e[m]);if(-1<g){var b=g+i;-1<(c=p(d,l,b))&&(d[c]=b,u[c]={newi:m,oldi:b,prev:u[c-1]})}}for(c=--l,--s;d[c]>s;)--c;l=a+r-c;var y=Array(l),$=u[c];for(--n;$;){for(var w=$.newi,v=$.oldi;w<n;)y[--l]=1,--n;for(;v<s;)y[--l]=-1,--s;y[--l]=0,--n,--s,$=$.prev}for(;t<=n;)y[--l]=1,--n;for(;i<=s;)y[--l]=-1,--s;return y}(n,r,i,s,a,c,u,d),e,t,n,r,a,c,h,m)}(d,e,n,y,b,k,t,g,m,v,f,u,h),n}var m={};
/*! (c) Andrea Giammarchi - ISC */function g(t,n){n=n||{};var r=e.createEvent("CustomEvent");return r.initCustomEvent(t,!!n.bubbles,!!n.cancelable,n.detail),r}m.CustomEvent="function"==typeof CustomEvent?CustomEvent:(g["prototype"]=new g("").constructor.prototype,g);var b=m.CustomEvent,y={};
/*! (c) Andrea Giammarchi - ISC */try{y.Map=Map}catch(u){y.Map=function(){var e=0,t=[],n=[];return{delete:function(o){var i=r(o);return i&&(t.splice(e,1),n.splice(e,1)),i},forEach:function(e,r){t.forEach((function(t,o){e.call(r,n[o],t,this)}),this)},get:function(t){return r(t)?n[e]:void 0},has:function(e){return r(e)},set:function(o,i){return n[r(o)?e:t.push(o)-1]=i,this}};function r(n){return-1<(e=t.indexOf(n))}}}var $=y.Map;function w(){return this}function v(e,t){var n="_"+e+"$";return{get:function(){return this[n]||k(this,n,t.call(this,e))},set:function(e){k(this,n,e)}}}var k=function(e,t,n){return Object.defineProperty(e,t,{configurable:!0,value:"function"==typeof n?function(){return e._wire$=n.apply(this,arguments)}:n})[t]};Object.defineProperties(w.prototype,{ELEMENT_NODE:{value:1},nodeType:{value:-1}});var x,T,L,C,S,_,E={},R={},A=[],D=R.hasOwnProperty,I=0,M={attributes:E,define:function(e,t){e.indexOf("-")<0?(e in R||(I=A.push(e)),R[e]=t):E[e]=t},invoke:function(e,t){for(var n=0;n<I;n++){var r=A[n];if(D.call(e,r))return R[r](e[r],t)}}},P=Array.isArray||(T=(x={}.toString).call([]),function(e){return x.call(e)===T}),N=(L=e,C="fragment",_="content"in O(S="template")?function(e){var t=O(S);return t.innerHTML=e,t.content}:function(e){var t=O(C),n=O(S),r=null;if(/^[^\S]*?<(col(?:group)?|t(?:head|body|foot|r|d|h))/i.test(e)){var o=RegExp.$1;n.innerHTML="<table>"+e+"</table>",r=n.querySelectorAll(o)}else n.innerHTML=e,r=n.childNodes;return H(t,r),t},function(e,t){return("svg"===t?function(e){var t=O(C),n=O("div");return n.innerHTML='<svg xmlns="http://www.w3.org/2000/svg">'+e+"</svg>",H(t,n.firstChild.childNodes),t}:_)(e)});function H(e,t){for(var n=t.length;n--;)e.appendChild(t[0])}function O(e){return e===C?L.createDocumentFragment():L.createElementNS("http://www.w3.org/1999/xhtml",e)}
/*! (c) Andrea Giammarchi - ISC */var j,W,U,F,z,B,q,G,V,Z=(W="appendChild",U="cloneNode",F="createTextNode",B=(z="importNode")in(j=e),(q=j.createDocumentFragment())[W](j[F]("g")),q[W](j[F]("")),(B?j[z](q,!0):q[U](!0)).childNodes.length<2?function e(t,n){for(var r=t[U](),o=t.childNodes||[],i=o.length,s=0;n&&s<i;s++)r[W](e(o[s],n));return r}:B?j[z]:function(e,t){return e[U](!!t)}),Y="".trim||function(){return String(this).replace(/^\s+|\s+/g,"")},K="-"+Math.random().toFixed(6)+"%",J=!1;try{G=e.createElement("template"),V="tabindex","content"in G&&(G.innerHTML="<p "+V+'="'+K+'"></p>',G.content.childNodes[0].getAttribute(V)==K)||(K="_dt: "+K.slice(1,-1)+";",J=!0)}catch(u){}var X="\x3c!--"+K+"--\x3e",Q=8,ee=1,te=3,ne=/^(?:style|textarea)$/i,re=/^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i,oe=" \\f\\n\\r\\t",ie="[^"+oe+"\\/>\"'=]+",se="["+oe+"]+"+ie,ae="<([A-Za-z]+[A-Za-z0-9:._-]*)((?:",ce="(?:\\s*=\\s*(?:'[^']*?'|\"[^\"]*?\"|<[^>]*?>|"+ie.replace("\\/","")+"))?)",le=new RegExp(ae+se+ce+"+)(["+oe+"]*/?>)","g"),ue=new RegExp(ae+se+ce+"*)(["+oe+"]*/>)","g"),de=new RegExp("("+se+"\\s*=\\s*)(['\"]?)"+X+"\\2","gi");function pe(e,t,n,r){return"<"+t+n.replace(de,he)+r}function he(e,t,n){return t+(n||'"')+K+(n||'"')}function fe(e,t,n){return re.test(t)?e:"<"+t+n+"></"+t+">"}var me=J?function(e,t){var n=t.join(" ");return t.slice.call(e,0).sort((function(e,t){return n.indexOf(e.name)<=n.indexOf(t.name)?-1:1}))}:function(e,t){return t.slice.call(e,0)};function ge(e,t){for(var n=t.length,r=0;r<n;)e=e.childNodes[t[r++]];return e}function be(t,n,r,o){for(var i=t.attributes,s=[],a=[],c=me(i,r),l=c.length,u=0;u<l;){var d,p=c[u++],h=p.value===K;if(h||1<(d=p.value.split(X)).length){var f=p.name;if(s.indexOf(f)<0){s.push(f);var m=r.shift().replace(h?/^(?:|[\S\s]*?\s)(\S+?)\s*=\s*('|")?$/:new RegExp("^(?:|[\\S\\s]*?\\s)("+f+")\\s*=\\s*('|\")[\\S\\s]*","i"),"$1"),g=i[m]||i[m.toLowerCase()];if(h)n.push(ye(g,o,m,null));else{for(var b=d.length-2;b--;)r.shift();n.push(ye(g,o,m,d))}}a.push(p)}}for(var y=((u=0)<(l=a.length)&&J&&!("ownerSVGElement"in t));u<l;){var $=a[u++];y&&($.value=""),t.removeAttribute($.name)}var w=t.nodeName;if(/^script$/i.test(w)){var v=e.createElement(w);for(l=i.length,u=0;u<l;)v.setAttributeNode(i[u++].cloneNode(!0));v.textContent=t.textContent,t.parentNode.replaceChild(v,t)}}function ye(e,t,n,r){return{type:"attr",node:e,path:t,name:n,sparse:r}}function $e(e,t){return{type:"text",node:e,path:t}}var we=new n;function ve(e,t){var n=(e.convert||
/*! (c) Andrea Giammarchi - ISC */
var I,z,V,Z,G,q,B,J,K,Q,U=(z="appendChild",V="cloneNode",Z="createTextNode",q=(G="importNode")in(I=N),(B=I.createDocumentFragment())[z](I[Z]("g")),B[z](I[Z]("")),(q?I[G](B,!0):B[V](!0)).childNodes.length<2?function e(t,n){for(var r=t[V](),i=t.childNodes||[],a=i.length,o=0;n&&o<a;o++)r[z](e(i[o],n));return r}:q?I[G]:function(e,t){return e[V](!!t)}),X="".trim||function(){return String(this).replace(/^\s+|\s+/g,"")},Y="-"+Math.random().toFixed(6)+"%",ee=!1;try{J=N.createElement("template"),Q="tabindex",(K="content")in J&&(J.innerHTML="<p "+Q+'="'+Y+'"></p>',J[K].childNodes[0].getAttribute(Q)==Y)||(Y="_dt: "+Y.slice(1,-1)+";",ee=!0);}catch(e){}var te="\x3c!--"+Y+"--\x3e",ne=8,re=1,ie=3,ae=/^(?:style|textarea)$/i,oe=/^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;var ue=" \\f\\n\\r\\t",le="[^"+ue+"\\/>\"'=]+",ce="["+ue+"]+"+le,se="<([A-Za-z]+[A-Za-z0-9:._-]*)((?:",fe="(?:\\s*=\\s*(?:'[^']*?'|\"[^\"]*?\"|<[^>]*?>|"+le.replace("\\/","")+"))?)",he=new RegExp(se+ce+fe+"+)(["+ue+"]*/?>)","g"),de=new RegExp(se+ce+fe+"*)(["+ue+"]*/>)","g"),ve=new RegExp("("+ce+"\\s*=\\s*)(['\"]?)"+te+"\\2","gi");function pe(e,t,n,r){return "<"+t+n.replace(ve,ge)+r}function ge(e,t,n){return t+(n||'"')+Y+(n||'"')}function me(e,t,n){return oe.test(t)?e:"<"+t+n+"></"+t+">"}var ye=ee?function(e,t){var n=t.join(" ");return t.slice.call(e,0).sort(function(e,t){return n.indexOf(e.name)<=n.indexOf(t.name)?-1:1})}:function(e,t){return t.slice.call(e,0)};function be(e,t){for(var n=t.length,r=0;r<n;)e=e.childNodes[t[r++]];return e}function we(e,t,n,r){for(var i=e.attributes,a=[],o=[],u=ye(i,n),l=u.length,c=0;c<l;){var s,f=u[c++],h=f.value===Y;if(h||1<(s=f.value.split(te)).length){var d=f.name;if(a.indexOf(d)<0){a.push(d);var v=n.shift().replace(h?/^(?:|[\S\s]*?\s)(\S+?)\s*=\s*('|")?$/:new RegExp("^(?:|[\\S\\s]*?\\s)("+d+")\\s*=\\s*('|\")[\\S\\s]*","i"),"$1"),p=i[v]||i[v.toLowerCase()];if(h)t.push(Ne(p,r,v,null));else{for(var g=s.length-2;g--;)n.shift();t.push(Ne(p,r,v,s));}}o.push(f);}}for(var m=((c=0)<(l=o.length)&&ee&&!("ownerSVGElement"in e));c<l;){var y=o[c++];m&&(y.value=""),e.removeAttribute(y.name);}var b=e.nodeName;if(/^script$/i.test(b)){var w=N.createElement(b);for(l=i.length,c=0;c<l;)w.setAttributeNode(i[c++].cloneNode(!0));w.textContent=e.textContent,e.parentNode.replaceChild(w,e);}}function Ne(e,t,n,r){return {type:"attr",node:e,path:t,name:n,sparse:r}}function xe(e,t){return {type:"text",node:e,path:t}}var Ee=new s;function Ce(o,f){var e=(o.convert||
/*! (c) Andrea Giammarchi - ISC */
function(e){return e.join(te).replace(de,me).replace(he,pe)})(f),t=o.transform;t&&(e=t(e));var n=R(e,o.type);Ae(n);var u=[];!function e(t,n,r,i){for(var a,o,u=t.childNodes,l=u.length,c=0;c<l;){var s=u[c];switch(s.nodeType){case re:var f=i.concat(c);we(s,n,r,f),e(s,n,r,f);break;case ne:var h=s.textContent;if(h===Y)r.shift(),n.push(ae.test(t.nodeName)?xe(t,i):(a=s,o=i.concat(c),{type:"any",node:a,path:o}));else switch(h.slice(0,2)){case"/*":if("*/"!==h.slice(-2))break;case"👻":t.removeChild(s),c--,l--;}break;case ie:ae.test(t.nodeName)&&X.call(s.textContent)===te&&(r.shift(),n.push(xe(t,i)));}c++;}}(n,u,f.slice(0),[]);var r={content:n,updates:function(l){for(var c=[],s=u.length,e=0,t=0;e<s;){var n=u[e++],r=be(l,n.path);switch(n.type){case"any":c.push({fn:o.any(r,[]),sparse:!1});break;case"attr":var i=n.sparse,a=o.attribute(r,n.name,n.node);null===i?c.push({fn:a,sparse:!1}):(t+=i.length-2,c.push({fn:a,sparse:!0,values:i}));break;case"text":c.push({fn:o.text(r),sparse:!1}),r.textContent="";}}return s+=t,function(){var e=arguments.length;if(s!==e-1)throw new Error(e-1+" values instead of "+s+"\n"+f.join("${value}"));for(var t=1,n=1;t<e;){var r=c[t-n];if(r.sparse){var i=r.values,a=i[0],o=1,u=i.length;for(n+=u-2;o<u;)a+=arguments[t++]+i[o++];r.fn(a);}else r.fn(arguments[t++]);}return l}}};return Ee.set(f,r),r}var ke=[];function Se(i){var a=ke,o=Ae;return function(e){var t,n,r;return a!==e&&(t=i,n=a=e,r=Ee.get(n)||Ce(t,n),o=r.updates(U.call(N,r.content,!0))),o.apply(null,arguments)}}function Ae(e){for(var t=e.childNodes,n=t.length;n--;){var r=t[n];1!==r.nodeType&&0===X.call(r.textContent).length&&e.removeChild(r);}}
/*! (c) Andrea Giammarchi - ISC */var Oe,Te,Me=(Oe=/acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i,Te=/([^A-Z])([A-Z]+)/g,function(e,t){return "ownerSVGElement"in e?function(e,t){var n;return (n=t?t.cloneNode(!0):(e.setAttribute("style","--hyper:style;"),e.getAttributeNode("style"))).value="",e.setAttributeNode(n),je(n,!0)}(e,t):je(e.style,!1)});
/*! (c) Andrea Giammarchi - ISC */function _e(e,t,n){return t+"-"+n.toLowerCase()}function je(a,o){var u,l;return function(e){var t,n,r,i;switch(typeof e){case"object":if(e){if("object"===u){if(!o&&l!==e)for(n in l)n in e||(a[n]="");}else o?a.value="":a.cssText="";for(n in t=o?{}:a,e)r="number"!=typeof(i=e[n])||Oe.test(n)?i:i+"px",!o&&/^--/.test(n)?t.setProperty(n,r):t[n]=r;u="object",o?a.value=function(e){var t,n=[];for(t in e)n.push(t.replace(Te,_e),":",e[t],";");return n.join("")}(l=t):l=e;break}default:l!=e&&(u="string",l=e,o?a.value=e||"":a.cssText=e||"");}}}var Le,Pe,De=(Le=[].slice,(Pe=We.prototype).ELEMENT_NODE=1,Pe.nodeType=111,Pe.remove=function(e){var t=this.childNodes,n=this.firstChild,r=this.lastChild;if(this._=null,e&&2===t.length)r.parentNode.removeChild(r);else{var i=this.ownerDocument.createRange();i.setStartBefore(e?t[1]:n),i.setEndAfter(r),i.deleteContents();}return n},Pe.valueOf=function(e){var t=this._,n=null==t;if(n&&(t=this._=this.ownerDocument.createDocumentFragment()),n||e)for(var r=this.childNodes,i=0,a=r.length;i<a;i++)t.appendChild(r[i]);return t},We);function We(e){var t=this.childNodes=Le.call(e,0);this.firstChild=t[0],this.lastChild=t[t.length-1],this.ownerDocument=t[0].ownerDocument,this._=null;}function $e(e){return {html:e}}function Re(e,t){switch(e.nodeType){case Ke:return 1/t<0?t?e.remove(!0):e.lastChild:t?e.valueOf(!0):e.firstChild;case Je:return Re(e.render(),t);default:return e}}function Fe(e,t){t(e.placeholder),"text"in e?Promise.resolve(e.text).then(String).then(t):"any"in e?Promise.resolve(e.any).then(t):"html"in e?Promise.resolve(e.html).then($e).then(t):Promise.resolve(W.invoke(e,t)).then(t);}function He(e){return null!=e&&"then"in e}var Ie,ze,Ve,Ze,Ge,qe="ownerSVGElement",Be="connected",Je=d.prototype.nodeType,Ke=De.prototype.nodeType,Qe=(ze=(Ie={Event:u,WeakSet:e}).Event,Ve=Ie.WeakSet,Ze=!0,Ge=null,function(e){return Ze&&(Ze=!Ze,Ge=new Ve,function(t){var i=new Ve,a=new Ve;try{new MutationObserver(u).observe(t,{subtree:!0,childList:!0});}catch(e){var n=0,r=[],o=function(e){r.push(e),clearTimeout(n),n=setTimeout(function(){u(r.splice(n=0,r.length));},0);};t.addEventListener("DOMNodeRemoved",function(e){o({addedNodes:[],removedNodes:[e.target]});},!0),t.addEventListener("DOMNodeInserted",function(e){o({addedNodes:[e.target],removedNodes:[]});},!0);}function u(e){for(var t,n=e.length,r=0;r<n;r++)l((t=e[r]).removedNodes,"disconnected",a,i),l(t.addedNodes,"connected",i,a);}function l(e,t,n,r){for(var i,a=new ze(t),o=e.length,u=0;u<o;1===(i=e[u++]).nodeType&&c(i,a,t,n,r));}function c(e,t,n,r,i){Ge.has(e)&&!r.has(e)&&(i.delete(e),r.add(e),e.dispatchEvent(t));for(var a=e.children||[],o=a.length,u=0;u<o;c(a[u++],t,n,r,i));}}(e.ownerDocument)),Ge.add(e),e}),Ue=/^(?:form|list)$/i,Xe=[].slice;function Ye(e){return this.type=e,Se(this)}var et=!(Ye.prototype={attribute:function(n,r,e){var i,t=qe in n;if("style"===r)return Me(n,e,t);if(/^on/.test(r)){var a=r.slice(2);return a===Be||"disconnected"===a?Qe(n):r.toLowerCase()in n&&(a=a.toLowerCase()),function(e){i!==e&&(i&&n.removeEventListener(a,i,!1),(i=e)&&n.addEventListener(a,e,!1));}}if("data"===r||!t&&r in n&&!Ue.test(r))return function(e){i!==e&&(i=e,n[r]!==e&&null==e?(n[r]="",n.removeAttribute(r)):n[r]=e);};if(r in W.attributes)return function(e){var t=W.attributes[r](n,e);i!==t&&(null==(i=t)?n.removeAttribute(r):n.setAttribute(r,t));};var o=!1,u=e.cloneNode(!0);return function(e){i!==e&&(i=e,u.value!==e&&(null==e?(o&&(o=!1,n.removeAttributeNode(u)),u.value=e):(u.value=e,o||(o=!0,n.setAttributeNode(u)))));}},any:function(r,i){var a,o={node:Re,before:r},u=qe in r?"svg":"html",l=!1;return function e(t){switch(typeof t){case"string":case"number":case"boolean":l?a!==t&&(a=t,i[0].textContent=t):(l=!0,a=t,i=c(r.parentNode,i,[(n=t,r.ownerDocument.createTextNode(n))],o));break;case"function":e(t(r));break;case"object":case"undefined":if(null==t){l=!1,i=c(r.parentNode,i,[],o);break}default:if(l=!1,$(a=t))if(0===t.length)i.length&&(i=c(r.parentNode,i,[],o));else switch(typeof t[0]){case"string":case"number":case"boolean":e({html:t});break;case"object":if($(t[0])&&(t=t.concat.apply([],t)),He(t[0])){Promise.all(t).then(e);break}default:i=c(r.parentNode,i,t,o);}else"ELEMENT_NODE"in t?i=c(r.parentNode,i,11===t.nodeType?Xe.call(t.childNodes):[t],o):He(t)?t.then(e):"placeholder"in t?Fe(t,e):"text"in t?e(String(t.text)):"any"in t?e(t.any):"html"in t?i=c(r.parentNode,i,Xe.call(R([].concat(t.html).join(""),u).childNodes),o):e("length"in t?Xe.call(t):W.invoke(t,e));}var n;}},text:function(r){var i;return function e(t){if(i!==t){var n=typeof(i=t);"object"==n&&t?He(t)?t.then(e):"placeholder"in t?Fe(t,e):e("text"in t?String(t.text):"any"in t?t.any:"html"in t?[].concat(t.html).join(""):"length"in t?Xe.call(t).join(""):W.invoke(t,e)):"function"==n?e(t(r)):r.textContent=null==t?"":t;}}}}),tt=function(e){var t,n=(t=(N.defaultView.navigator||{}).userAgent,/(Firefox|Safari)\/(\d+)/.test(t)&&!/(Chrom[eium]+|Android)\/(\d+)/.test(t)),r=!("raw"in e)||e.propertyIsEnumerable("raw")||!Object.isFrozen(e.raw);if(n||r){var i={},a=function(e){for(var t=".",n=0;n<e.length;n++)t+=e[n].length+"."+e[n];return i[t]||(i[t]=e)};if(r)tt=a;else{var o=new s;tt=function(e){return o.get(e)||(n=a(t=e),o.set(t,n),n);var t,n;};}}else et=!0;return nt(e)};function nt(e){return et?e:tt(e)}function rt(e){for(var t=arguments.length,n=[nt(e)],r=1;r<t;)n.push(arguments[r++]);return n}var it=new s,at=function(t){var n,r,i;return function(){var e=rt.apply(null,arguments);return i!==e[0]?(i=e[0],r=new Ye(t),n=ut(r.apply(r,e))):r.apply(r,e),n}},ot=function(e,t){var n=t.indexOf(":"),r=it.get(e),i=t;return -1<n&&(i=t.slice(n+1),t=t.slice(0,n)||"html"),r||it.set(e,r={}),r[i]||(r[i]=at(t))},ut=function(e){var t=e.childNodes,n=t.length;return 1===n?t[0]:n?new De(t):e},lt=new s;function ct(){var e=lt.get(this),t=rt.apply(null,arguments);return e&&e.template===t[0]?e.tagger.apply(null,t):function(e){var t=new Ye(qe in this?"svg":"html");lt.set(this,{tagger:t,template:e}),this.textContent="",this.appendChild(t.apply(null,arguments));}
/*! (c) Andrea Giammarchi (ISC) */.apply(this,t),this}var st,ft,ht,dt,vt=W.define,pt=Ye.prototype;function gt(e){return arguments.length<2?null==e?at("html"):"string"==typeof e?gt.wire(null,e):"raw"in e?at("html")(e):"nodeType"in e?gt.bind(e):ot(e,"html"):("raw"in e?at("html"):gt.wire).apply(null,arguments)}return gt.Component=d,gt.bind=function(e){return ct.bind(e)},gt.define=vt,gt.diff=c,(gt.hyper=gt).observe=Qe,gt.tagger=pt,gt.wire=function(e,t){return null==e?at(t||"html"):ot(e,t||"html")},gt._={WeakMap:s,WeakSet:e},st=at,ft=new s,ht=Object.create,dt=function(e,t){var n={w:null,p:null};return t.set(e,n),n},Object.defineProperties(d,{for:{configurable:!0,value:function(e,t){return function(e,t,n,r){var i,a,o,u=t.get(e)||dt(e,t);switch(typeof r){case"object":case"function":var l=u.w||(u.w=new s);return l.get(r)||(i=l,a=r,o=new e(n),i.set(a,o),o);default:var c=u.p||(u.p=ht(null));return c[r]||(c[r]=new e(n))}}(this,ft.get(e)||(n=e,r=new h,ft.set(n,r),r),e,null==t?"default":t);var n,r;}}}),Object.defineProperties(d.prototype,{handleEvent:{value:function(e){var t=e.currentTarget;this["getAttribute"in t&&t.getAttribute("data-call")||"on"+e.type](e);}},html:v("html",st),svg:v("svg",st),state:v("state",function(){return this.defaultState}),defaultState:{get:function(){return {}}},dispatch:{value:function(e,t){var n=this._wire$;if(n){var r=new u(e,{bubbles:!0,cancelable:!0,detail:t});return r.component=this,(n.dispatchEvent?n:n.firstChild).dispatchEvent(r)}return !1}},setState:{value:function(e,t){var n=this.state,r="function"==typeof e?e.call(this,n):e;for(var i in r)n[i]=r[i];return !1!==t&&this.render(),this}}}),gt}(document);

/**
 * marked - a markdown parser
 * Copyright (c) 2011-2019, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/markedjs/marked
 */

/**
 * DO NOT EDIT THIS FILE
 * The code in this file is generated from files in ./src/
 */

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var defaults = createCommonjsModule(function (module) {
function getDefaults() {
  return {
    baseUrl: null,
    breaks: false,
    gfm: true,
    headerIds: true,
    headerPrefix: '',
    highlight: null,
    langPrefix: 'language-',
    mangle: true,
    pedantic: false,
    renderer: null,
    sanitize: false,
    sanitizer: null,
    silent: false,
    smartLists: false,
    smartypants: false,
    xhtml: false
  };
}

function changeDefaults(newDefaults) {
  module.exports.defaults = newDefaults;
}

module.exports = {
  defaults: getDefaults(),
  getDefaults,
  changeDefaults
};
});
var defaults_1 = defaults.defaults;
var defaults_2 = defaults.getDefaults;
var defaults_3 = defaults.changeDefaults;

/**
 * Helpers
 */
const escapeTest = /[&<>"']/;
const escapeReplace = /[&<>"']/g;
const escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
const escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
const escapeReplacements = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};
const getEscapeReplacement = (ch) => escapeReplacements[ch];
function escape(html, encode) {
  if (encode) {
    if (escapeTest.test(html)) {
      return html.replace(escapeReplace, getEscapeReplacement);
    }
  } else {
    if (escapeTestNoEncode.test(html)) {
      return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
    }
  }

  return html;
}

const unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;

function unescape$1(html) {
  // explicitly match decimal, hex, and named HTML entities
  return html.replace(unescapeTest, (_, n) => {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

const caret = /(^|[^\[])\^/g;
function edit(regex, opt) {
  regex = regex.source || regex;
  opt = opt || '';
  const obj = {
    replace: (name, val) => {
      val = val.source || val;
      val = val.replace(caret, '$1');
      regex = regex.replace(name, val);
      return obj;
    },
    getRegex: () => {
      return new RegExp(regex, opt);
    }
  };
  return obj;
}

const nonWordAndColonTest = /[^\w:]/g;
const originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
function cleanUrl(sanitize, base, href) {
  if (sanitize) {
    let prot;
    try {
      prot = decodeURIComponent(unescape$1(href))
        .replace(nonWordAndColonTest, '')
        .toLowerCase();
    } catch (e) {
      return null;
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
      return null;
    }
  }
  if (base && !originIndependentUrl.test(href)) {
    href = resolveUrl(base, href);
  }
  try {
    href = encodeURI(href).replace(/%25/g, '%');
  } catch (e) {
    return null;
  }
  return href;
}

const baseUrls = {};
const justDomain = /^[^:]+:\/*[^/]*$/;
const protocol = /^([^:]+:)[\s\S]*$/;
const domain = /^([^:]+:\/*[^/]*)[\s\S]*$/;

function resolveUrl(base, href) {
  if (!baseUrls[' ' + base]) {
    // we can ignore everything in base after the last slash of its path component,
    // but we might need to add _that_
    // https://tools.ietf.org/html/rfc3986#section-3
    if (justDomain.test(base)) {
      baseUrls[' ' + base] = base + '/';
    } else {
      baseUrls[' ' + base] = rtrim(base, '/', true);
    }
  }
  base = baseUrls[' ' + base];
  const relativeBase = base.indexOf(':') === -1;

  if (href.substring(0, 2) === '//') {
    if (relativeBase) {
      return href;
    }
    return base.replace(protocol, '$1') + href;
  } else if (href.charAt(0) === '/') {
    if (relativeBase) {
      return href;
    }
    return base.replace(domain, '$1') + href;
  } else {
    return base + href;
  }
}

const noopTest = { exec: function noopTest() {} };

function merge(obj) {
  let i = 1,
    target,
    key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}

function splitCells(tableRow, count) {
  // ensure that every cell-delimiting pipe has a space
  // before it to distinguish it from an escaped pipe
  const row = tableRow.replace(/\|/g, (match, offset, str) => {
      let escaped = false,
        curr = offset;
      while (--curr >= 0 && str[curr] === '\\') escaped = !escaped;
      if (escaped) {
        // odd number of slashes means | is escaped
        // so we leave it alone
        return '|';
      } else {
        // add space before unescaped |
        return ' |';
      }
    }),
    cells = row.split(/ \|/);
  let i = 0;

  if (cells.length > count) {
    cells.splice(count);
  } else {
    while (cells.length < count) cells.push('');
  }

  for (; i < cells.length; i++) {
    // leading or trailing whitespace is ignored per the gfm spec
    cells[i] = cells[i].trim().replace(/\\\|/g, '|');
  }
  return cells;
}

// Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
// /c*$/ is vulnerable to REDOS.
// invert: Remove suffix of non-c chars instead. Default falsey.
function rtrim(str, c, invert) {
  const l = str.length;
  if (l === 0) {
    return '';
  }

  // Length of suffix matching the invert condition.
  let suffLen = 0;

  // Step left until we fail to match the invert condition.
  while (suffLen < l) {
    const currChar = str.charAt(l - suffLen - 1);
    if (currChar === c && !invert) {
      suffLen++;
    } else if (currChar !== c && invert) {
      suffLen++;
    } else {
      break;
    }
  }

  return str.substr(0, l - suffLen);
}

function findClosingBracket(str, b) {
  if (str.indexOf(b[1]) === -1) {
    return -1;
  }
  const l = str.length;
  let level = 0,
    i = 0;
  for (; i < l; i++) {
    if (str[i] === '\\') {
      i++;
    } else if (str[i] === b[0]) {
      level++;
    } else if (str[i] === b[1]) {
      level--;
      if (level < 0) {
        return i;
      }
    }
  }
  return -1;
}

function checkSanitizeDeprecation(opt) {
  if (opt && opt.sanitize && !opt.silent) {
    console.warn('marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options');
  }
}

var helpers = {
  escape,
  unescape: unescape$1,
  edit,
  cleanUrl,
  resolveUrl,
  noopTest,
  merge,
  splitCells,
  rtrim,
  findClosingBracket,
  checkSanitizeDeprecation
};

const {
  noopTest: noopTest$1,
  edit: edit$1,
  merge: merge$1
} = helpers;

/**
 * Block-Level Grammar
 */
const block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: /^ {0,3}(`{3,}|~{3,})([^`~\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?:\n+|$)|$)/,
  hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
  heading: /^ {0,3}(#{1,6}) +([^\n]*?)(?: +#+)? *(?:\n+|$)/,
  blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
  list: /^( {0,3})(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: '^ {0,3}(?:' // optional indentation
    + '<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' // (1)
    + '|comment[^\\n]*(\\n+|$)' // (2)
    + '|<\\?[\\s\\S]*?\\?>\\n*' // (3)
    + '|<![A-Z][\\s\\S]*?>\\n*' // (4)
    + '|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\n*' // (5)
    + '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)' // (6)
    + '|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)' // (7) open tag
    + '|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)' // (7) closing tag
    + ')',
  def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
  nptable: noopTest$1,
  table: noopTest$1,
  lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
  // regex template, placeholders will be replaced according to different paragraph
  // interruption rules of commonmark and the original markdown spec:
  _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html)[^\n]+)*)/,
  text: /^[^\n]+/
};

block._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
block.def = edit$1(block.def)
  .replace('label', block._label)
  .replace('title', block._title)
  .getRegex();

block.bullet = /(?:[*+-]|\d{1,9}\.)/;
block.item = /^( *)(bull) ?[^\n]*(?:\n(?!\1bull ?)[^\n]*)*/;
block.item = edit$1(block.item, 'gm')
  .replace(/bull/g, block.bullet)
  .getRegex();

block.list = edit$1(block.list)
  .replace(/bull/g, block.bullet)
  .replace('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))')
  .replace('def', '\\n+(?=' + block.def.source + ')')
  .getRegex();

block._tag = 'address|article|aside|base|basefont|blockquote|body|caption'
  + '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption'
  + '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe'
  + '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option'
  + '|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr'
  + '|track|ul';
block._comment = /<!--(?!-?>)[\s\S]*?-->/;
block.html = edit$1(block.html, 'i')
  .replace('comment', block._comment)
  .replace('tag', block._tag)
  .replace('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/)
  .getRegex();

block.paragraph = edit$1(block._paragraph)
  .replace('hr', block.hr)
  .replace('heading', ' {0,3}#{1,6} +')
  .replace('|lheading', '') // setex headings don't interrupt commonmark paragraphs
  .replace('blockquote', ' {0,3}>')
  .replace('fences', ' {0,3}(?:`{3,}|~{3,})[^`\\n]*\\n')
  .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
  .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)')
  .replace('tag', block._tag) // pars can be interrupted by type (6) html blocks
  .getRegex();

block.blockquote = edit$1(block.blockquote)
  .replace('paragraph', block.paragraph)
  .getRegex();

/**
 * Normal Block Grammar
 */

block.normal = merge$1({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge$1({}, block.normal, {
  nptable: /^ *([^|\n ].*\|.*)\n *([-:]+ *\|[-| :]*)(?:\n((?:.*[^>\n ].*(?:\n|$))*)\n*|$)/,
  table: /^ *\|(.+)\n *\|?( *[-:]+[-| :]*)(?:\n((?: *[^>\n ].*(?:\n|$))*)\n*|$)/
});

/**
 * Pedantic grammar (original John Gruber's loose markdown specification)
 */

block.pedantic = merge$1({}, block.normal, {
  html: edit$1(
    '^ *(?:comment *(?:\\n|\\s*$)'
    + '|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)' // closed tag
    + '|<tag(?:"[^"]*"|\'[^\']*\'|\\s[^\'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))')
    .replace('comment', block._comment)
    .replace(/tag/g, '(?!(?:'
      + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub'
      + '|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)'
      + '\\b)\\w+(?!:|[^\\w\\s@]*@)\\b')
    .getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *(?:#+ *)?(?:\n+|$)/,
  fences: noopTest$1, // fences not supported
  paragraph: edit$1(block.normal._paragraph)
    .replace('hr', block.hr)
    .replace('heading', ' *#{1,6} *[^\n]')
    .replace('lheading', block.lheading)
    .replace('blockquote', ' {0,3}>')
    .replace('|fences', '')
    .replace('|list', '')
    .replace('|html', '')
    .getRegex()
});

/**
 * Inline-Level Grammar
 */
const inline = {
  escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
  autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
  url: noopTest$1,
  tag: '^comment'
    + '|^</[a-zA-Z][\\w:-]*\\s*>' // self-closing tag
    + '|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>' // open tag
    + '|^<\\?[\\s\\S]*?\\?>' // processing instruction, e.g. <?php ?>
    + '|^<![a-zA-Z]+\\s[\\s\\S]*?>' // declaration, e.g. <!DOCTYPE html>
    + '|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>', // CDATA section
  link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
  reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
  nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
  strong: /^__([^\s_])__(?!_)|^\*\*([^\s*])\*\*(?!\*)|^__([^\s][\s\S]*?[^\s])__(?!_)|^\*\*([^\s][\s\S]*?[^\s])\*\*(?!\*)/,
  em: /^_([^\s_])_(?!_)|^\*([^\s*<\[])\*(?!\*)|^_([^\s<][\s\S]*?[^\s_])_(?!_|[^\spunctuation])|^_([^\s_<][\s\S]*?[^\s])_(?!_|[^\spunctuation])|^\*([^\s<"][\s\S]*?[^\s\*])\*(?!\*|[^\spunctuation])|^\*([^\s*"<\[][\s\S]*?[^\s])\*(?!\*)/,
  code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
  br: /^( {2,}|\\)\n(?!\s*$)/,
  del: noopTest$1,
  text: /^(`+|[^`])(?:[\s\S]*?(?:(?=[\\<!\[`*]|\b_|$)|[^ ](?= {2,}\n))|(?= {2,}\n))/
};

// list of punctuation marks from common mark spec
// without ` and ] to workaround Rule 17 (inline code blocks/links)
inline._punctuation = '!"#$%&\'()*+,\\-./:;<=>?@\\[^_{|}~';
inline.em = edit$1(inline.em).replace(/punctuation/g, inline._punctuation).getRegex();

inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;

inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
inline.autolink = edit$1(inline.autolink)
  .replace('scheme', inline._scheme)
  .replace('email', inline._email)
  .getRegex();

inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;

inline.tag = edit$1(inline.tag)
  .replace('comment', block._comment)
  .replace('attribute', inline._attribute)
  .getRegex();

inline._label = /(?:\[[^\[\]]*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
inline._href = /<(?:\\[<>]?|[^\s<>\\])*>|[^\s\x00-\x1f]*/;
inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;

inline.link = edit$1(inline.link)
  .replace('label', inline._label)
  .replace('href', inline._href)
  .replace('title', inline._title)
  .getRegex();

inline.reflink = edit$1(inline.reflink)
  .replace('label', inline._label)
  .getRegex();

/**
 * Normal Inline Grammar
 */

inline.normal = merge$1({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge$1({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/,
  link: edit$1(/^!?\[(label)\]\((.*?)\)/)
    .replace('label', inline._label)
    .getRegex(),
  reflink: edit$1(/^!?\[(label)\]\s*\[([^\]]*)\]/)
    .replace('label', inline._label)
    .getRegex()
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge$1({}, inline.normal, {
  escape: edit$1(inline.escape).replace('])', '~|])').getRegex(),
  _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
  url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
  _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
  del: /^~+(?=\S)([\s\S]*?\S)~+/,
  text: /^(`+|[^`])(?:[\s\S]*?(?:(?=[\\<!\[`*~]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))|(?= {2,}\n|[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))/
});

inline.gfm.url = edit$1(inline.gfm.url, 'i')
  .replace('email', inline.gfm._extended_email)
  .getRegex();
/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge$1({}, inline.gfm, {
  br: edit$1(inline.br).replace('{2,}', '*').getRegex(),
  text: edit$1(inline.gfm.text)
    .replace('\\b_', '\\b_| {2,}\\n')
    .replace(/\{2,\}/g, '*')
    .getRegex()
});

var rules = {
  block,
  inline
};

const { defaults: defaults$1 } = defaults;
const { block: block$1 } = rules;
const {
  rtrim: rtrim$1,
  splitCells: splitCells$1,
  escape: escape$1
} = helpers;

/**
 * Block Lexer
 */
var Lexer_1 = class Lexer {
  constructor(options) {
    this.tokens = [];
    this.tokens.links = Object.create(null);
    this.options = options || defaults$1;
    this.rules = block$1.normal;

    if (this.options.pedantic) {
      this.rules = block$1.pedantic;
    } else if (this.options.gfm) {
      this.rules = block$1.gfm;
    }
  }

  /**
   * Expose Block Rules
   */
  static get rules() {
    return block$1;
  }

  /**
   * Static Lex Method
   */
  static lex(src, options) {
    const lexer = new Lexer(options);
    return lexer.lex(src);
  };

  /**
   * Preprocessing
   */
  lex(src) {
    src = src
      .replace(/\r\n|\r/g, '\n')
      .replace(/\t/g, '    ');

    return this.token(src, true);
  };

  /**
   * Lexing
   */
  token(src, top) {
    src = src.replace(/^ +$/gm, '');
    let next,
      loose,
      cap,
      bull,
      b,
      item,
      listStart,
      listItems,
      t,
      space,
      i,
      tag,
      l,
      isordered,
      istask,
      ischecked;

    while (src) {
      // newline
      if (cap = this.rules.newline.exec(src)) {
        src = src.substring(cap[0].length);
        if (cap[0].length > 1) {
          this.tokens.push({
            type: 'space'
          });
        }
      }

      // code
      if (cap = this.rules.code.exec(src)) {
        const lastToken = this.tokens[this.tokens.length - 1];
        src = src.substring(cap[0].length);
        // An indented code block cannot interrupt a paragraph.
        if (lastToken && lastToken.type === 'paragraph') {
          lastToken.text += '\n' + cap[0].trimRight();
        } else {
          cap = cap[0].replace(/^ {4}/gm, '');
          this.tokens.push({
            type: 'code',
            codeBlockStyle: 'indented',
            text: !this.options.pedantic
              ? rtrim$1(cap, '\n')
              : cap
          });
        }
        continue;
      }

      // fences
      if (cap = this.rules.fences.exec(src)) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'code',
          lang: cap[2] ? cap[2].trim() : cap[2],
          text: cap[3] || ''
        });
        continue;
      }

      // heading
      if (cap = this.rules.heading.exec(src)) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'heading',
          depth: cap[1].length,
          text: cap[2]
        });
        continue;
      }

      // table no leading pipe (gfm)
      if (cap = this.rules.nptable.exec(src)) {
        item = {
          type: 'table',
          header: splitCells$1(cap[1].replace(/^ *| *\| *$/g, '')),
          align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
          cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : []
        };

        if (item.header.length === item.align.length) {
          src = src.substring(cap[0].length);

          for (i = 0; i < item.align.length; i++) {
            if (/^ *-+: *$/.test(item.align[i])) {
              item.align[i] = 'right';
            } else if (/^ *:-+: *$/.test(item.align[i])) {
              item.align[i] = 'center';
            } else if (/^ *:-+ *$/.test(item.align[i])) {
              item.align[i] = 'left';
            } else {
              item.align[i] = null;
            }
          }

          for (i = 0; i < item.cells.length; i++) {
            item.cells[i] = splitCells$1(item.cells[i], item.header.length);
          }

          this.tokens.push(item);

          continue;
        }
      }

      // hr
      if (cap = this.rules.hr.exec(src)) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'hr'
        });
        continue;
      }

      // blockquote
      if (cap = this.rules.blockquote.exec(src)) {
        src = src.substring(cap[0].length);

        this.tokens.push({
          type: 'blockquote_start'
        });

        cap = cap[0].replace(/^ *> ?/gm, '');

        // Pass `top` to keep the current
        // "toplevel" state. This is exactly
        // how markdown.pl works.
        this.token(cap, top);

        this.tokens.push({
          type: 'blockquote_end'
        });

        continue;
      }

      // list
      if (cap = this.rules.list.exec(src)) {
        src = src.substring(cap[0].length);
        bull = cap[2];
        isordered = bull.length > 1;

        listStart = {
          type: 'list_start',
          ordered: isordered,
          start: isordered ? +bull : '',
          loose: false
        };

        this.tokens.push(listStart);

        // Get each top-level item.
        cap = cap[0].match(this.rules.item);

        listItems = [];
        next = false;
        l = cap.length;
        i = 0;

        for (; i < l; i++) {
          item = cap[i];

          // Remove the list item's bullet
          // so it is seen as the next token.
          space = item.length;
          item = item.replace(/^ *([*+-]|\d+\.) */, '');

          // Outdent whatever the
          // list item contains. Hacky.
          if (~item.indexOf('\n ')) {
            space -= item.length;
            item = !this.options.pedantic
              ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
              : item.replace(/^ {1,4}/gm, '');
          }

          // Determine whether the next list item belongs here.
          // Backpedal if it does not belong in this list.
          if (i !== l - 1) {
            b = block$1.bullet.exec(cap[i + 1])[0];
            if (bull.length > 1 ? b.length === 1
              : (b.length > 1 || (this.options.smartLists && b !== bull))) {
              src = cap.slice(i + 1).join('\n') + src;
              i = l - 1;
            }
          }

          // Determine whether item is loose or not.
          // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
          // for discount behavior.
          loose = next || /\n\n(?!\s*$)/.test(item);
          if (i !== l - 1) {
            next = item.charAt(item.length - 1) === '\n';
            if (!loose) loose = next;
          }

          if (loose) {
            listStart.loose = true;
          }

          // Check for task list items
          istask = /^\[[ xX]\] /.test(item);
          ischecked = undefined;
          if (istask) {
            ischecked = item[1] !== ' ';
            item = item.replace(/^\[[ xX]\] +/, '');
          }

          t = {
            type: 'list_item_start',
            task: istask,
            checked: ischecked,
            loose: loose
          };

          listItems.push(t);
          this.tokens.push(t);

          // Recurse.
          this.token(item, false);

          this.tokens.push({
            type: 'list_item_end'
          });
        }

        if (listStart.loose) {
          l = listItems.length;
          i = 0;
          for (; i < l; i++) {
            listItems[i].loose = true;
          }
        }

        this.tokens.push({
          type: 'list_end'
        });

        continue;
      }

      // html
      if (cap = this.rules.html.exec(src)) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: this.options.sanitize
            ? 'paragraph'
            : 'html',
          pre: !this.options.sanitizer
            && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
          text: this.options.sanitize ? (this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape$1(cap[0])) : cap[0]
        });
        continue;
      }

      // def
      if (top && (cap = this.rules.def.exec(src))) {
        src = src.substring(cap[0].length);
        if (cap[3]) cap[3] = cap[3].substring(1, cap[3].length - 1);
        tag = cap[1].toLowerCase().replace(/\s+/g, ' ');
        if (!this.tokens.links[tag]) {
          this.tokens.links[tag] = {
            href: cap[2],
            title: cap[3]
          };
        }
        continue;
      }

      // table (gfm)
      if (cap = this.rules.table.exec(src)) {
        item = {
          type: 'table',
          header: splitCells$1(cap[1].replace(/^ *| *\| *$/g, '')),
          align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
          cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : []
        };

        if (item.header.length === item.align.length) {
          src = src.substring(cap[0].length);

          for (i = 0; i < item.align.length; i++) {
            if (/^ *-+: *$/.test(item.align[i])) {
              item.align[i] = 'right';
            } else if (/^ *:-+: *$/.test(item.align[i])) {
              item.align[i] = 'center';
            } else if (/^ *:-+ *$/.test(item.align[i])) {
              item.align[i] = 'left';
            } else {
              item.align[i] = null;
            }
          }

          for (i = 0; i < item.cells.length; i++) {
            item.cells[i] = splitCells$1(
              item.cells[i].replace(/^ *\| *| *\| *$/g, ''),
              item.header.length);
          }

          this.tokens.push(item);

          continue;
        }
      }

      // lheading
      if (cap = this.rules.lheading.exec(src)) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'heading',
          depth: cap[2].charAt(0) === '=' ? 1 : 2,
          text: cap[1]
        });
        continue;
      }

      // top-level paragraph
      if (top && (cap = this.rules.paragraph.exec(src))) {
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'paragraph',
          text: cap[1].charAt(cap[1].length - 1) === '\n'
            ? cap[1].slice(0, -1)
            : cap[1]
        });
        continue;
      }

      // text
      if (cap = this.rules.text.exec(src)) {
        // Top-level should never reach here.
        src = src.substring(cap[0].length);
        this.tokens.push({
          type: 'text',
          text: cap[0]
        });
        continue;
      }

      if (src) {
        throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
      }
    }

    return this.tokens;
  };
};

const { defaults: defaults$2 } = defaults;
const {
  cleanUrl: cleanUrl$1,
  escape: escape$2
} = helpers;

/**
 * Renderer
 */
var Renderer_1 = class Renderer {
  constructor(options) {
    this.options = options || defaults$2;
  }

  code(code, infostring, escaped) {
    const lang = (infostring || '').match(/\S*/)[0];
    if (this.options.highlight) {
      const out = this.options.highlight(code, lang);
      if (out != null && out !== code) {
        escaped = true;
        code = out;
      }
    }

    if (!lang) {
      return '<pre><code>'
        + (escaped ? code : escape$2(code, true))
        + '</code></pre>';
    }

    return '<pre><code class="'
      + this.options.langPrefix
      + escape$2(lang, true)
      + '">'
      + (escaped ? code : escape$2(code, true))
      + '</code></pre>\n';
  };

  blockquote(quote) {
    return '<blockquote>\n' + quote + '</blockquote>\n';
  };

  html(html) {
    return html;
  };

  heading(text, level, raw, slugger) {
    if (this.options.headerIds) {
      return '<h'
        + level
        + ' id="'
        + this.options.headerPrefix
        + slugger.slug(raw)
        + '">'
        + text
        + '</h'
        + level
        + '>\n';
    }
    // ignore IDs
    return '<h' + level + '>' + text + '</h' + level + '>\n';
  };

  hr() {
    return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
  };

  list(body, ordered, start) {
    const type = ordered ? 'ol' : 'ul',
      startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
    return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
  };

  listitem(text) {
    return '<li>' + text + '</li>\n';
  };

  checkbox(checked) {
    return '<input '
      + (checked ? 'checked="" ' : '')
      + 'disabled="" type="checkbox"'
      + (this.options.xhtml ? ' /' : '')
      + '> ';
  };

  paragraph(text) {
    return '<p>' + text + '</p>\n';
  };

  table(header, body) {
    if (body) body = '<tbody>' + body + '</tbody>';

    return '<table>\n'
      + '<thead>\n'
      + header
      + '</thead>\n'
      + body
      + '</table>\n';
  };

  tablerow(content) {
    return '<tr>\n' + content + '</tr>\n';
  };

  tablecell(content, flags) {
    const type = flags.header ? 'th' : 'td';
    const tag = flags.align
      ? '<' + type + ' align="' + flags.align + '">'
      : '<' + type + '>';
    return tag + content + '</' + type + '>\n';
  };

  // span level renderer
  strong(text) {
    return '<strong>' + text + '</strong>';
  };

  em(text) {
    return '<em>' + text + '</em>';
  };

  codespan(text) {
    return '<code>' + text + '</code>';
  };

  br() {
    return this.options.xhtml ? '<br/>' : '<br>';
  };

  del(text) {
    return '<del>' + text + '</del>';
  };

  link(href, title, text) {
    href = cleanUrl$1(this.options.sanitize, this.options.baseUrl, href);
    if (href === null) {
      return text;
    }
    let out = '<a href="' + escape$2(href) + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += '>' + text + '</a>';
    return out;
  };

  image(href, title, text) {
    href = cleanUrl$1(this.options.sanitize, this.options.baseUrl, href);
    if (href === null) {
      return text;
    }

    let out = '<img src="' + href + '" alt="' + text + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += this.options.xhtml ? '/>' : '>';
    return out;
  };

  text(text) {
    return text;
  };
};

/**
 * Slugger generates header id
 */
var Slugger_1 = class Slugger {
  constructor() {
    this.seen = {};
  }

  /**
   * Convert string to unique id
   */
  slug(value) {
    let slug = value
      .toLowerCase()
      .trim()
      .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '')
      .replace(/\s/g, '-');

    if (this.seen.hasOwnProperty(slug)) {
      const originalSlug = slug;
      do {
        this.seen[originalSlug]++;
        slug = originalSlug + '-' + this.seen[originalSlug];
      } while (this.seen.hasOwnProperty(slug));
    }
    this.seen[slug] = 0;

    return slug;
  };
};

const { defaults: defaults$3 } = defaults;
const { inline: inline$1 } = rules;
const {
  findClosingBracket: findClosingBracket$1,
  escape: escape$3
} = helpers;

/**
 * Inline Lexer & Compiler
 */
var InlineLexer_1 = class InlineLexer {
  constructor(links, options) {
    this.options = options || defaults$3;
    this.links = links;
    this.rules = inline$1.normal;
    this.options.renderer = this.options.renderer || new Renderer_1();
    this.renderer = this.options.renderer;
    this.renderer.options = this.options;

    if (!this.links) {
      throw new Error('Tokens array requires a `links` property.');
    }

    if (this.options.pedantic) {
      this.rules = inline$1.pedantic;
    } else if (this.options.gfm) {
      if (this.options.breaks) {
        this.rules = inline$1.breaks;
      } else {
        this.rules = inline$1.gfm;
      }
    }
  }

  /**
   * Expose Inline Rules
   */
  static get rules() {
    return inline$1;
  }

  /**
   * Static Lexing/Compiling Method
   */
  static output(src, links, options) {
    const inline = new InlineLexer(links, options);
    return inline.output(src);
  }

  /**
   * Lexing/Compiling
   */
  output(src) {
    let out = '',
      link,
      text,
      href,
      title,
      cap,
      prevCapZero;

    while (src) {
      // escape
      if (cap = this.rules.escape.exec(src)) {
        src = src.substring(cap[0].length);
        out += escape$3(cap[1]);
        continue;
      }

      // tag
      if (cap = this.rules.tag.exec(src)) {
        if (!this.inLink && /^<a /i.test(cap[0])) {
          this.inLink = true;
        } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
          this.inLink = false;
        }
        if (!this.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
          this.inRawBlock = true;
        } else if (this.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
          this.inRawBlock = false;
        }

        src = src.substring(cap[0].length);
        out += this.options.sanitize
          ? this.options.sanitizer
            ? this.options.sanitizer(cap[0])
            : escape$3(cap[0])
          : cap[0];
        continue;
      }

      // link
      if (cap = this.rules.link.exec(src)) {
        const lastParenIndex = findClosingBracket$1(cap[2], '()');
        if (lastParenIndex > -1) {
          const start = cap[0].indexOf('!') === 0 ? 5 : 4;
          const linkLen = start + cap[1].length + lastParenIndex;
          cap[2] = cap[2].substring(0, lastParenIndex);
          cap[0] = cap[0].substring(0, linkLen).trim();
          cap[3] = '';
        }
        src = src.substring(cap[0].length);
        this.inLink = true;
        href = cap[2];
        if (this.options.pedantic) {
          link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);

          if (link) {
            href = link[1];
            title = link[3];
          } else {
            title = '';
          }
        } else {
          title = cap[3] ? cap[3].slice(1, -1) : '';
        }
        href = href.trim().replace(/^<([\s\S]*)>$/, '$1');
        out += this.outputLink(cap, {
          href: InlineLexer.escapes(href),
          title: InlineLexer.escapes(title)
        });
        this.inLink = false;
        continue;
      }

      // reflink, nolink
      if ((cap = this.rules.reflink.exec(src))
          || (cap = this.rules.nolink.exec(src))) {
        src = src.substring(cap[0].length);
        link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
        link = this.links[link.toLowerCase()];
        if (!link || !link.href) {
          out += cap[0].charAt(0);
          src = cap[0].substring(1) + src;
          continue;
        }
        this.inLink = true;
        out += this.outputLink(cap, link);
        this.inLink = false;
        continue;
      }

      // strong
      if (cap = this.rules.strong.exec(src)) {
        src = src.substring(cap[0].length);
        out += this.renderer.strong(this.output(cap[4] || cap[3] || cap[2] || cap[1]));
        continue;
      }

      // em
      if (cap = this.rules.em.exec(src)) {
        src = src.substring(cap[0].length);
        out += this.renderer.em(this.output(cap[6] || cap[5] || cap[4] || cap[3] || cap[2] || cap[1]));
        continue;
      }

      // code
      if (cap = this.rules.code.exec(src)) {
        src = src.substring(cap[0].length);
        out += this.renderer.codespan(escape$3(cap[2].trim(), true));
        continue;
      }

      // br
      if (cap = this.rules.br.exec(src)) {
        src = src.substring(cap[0].length);
        out += this.renderer.br();
        continue;
      }

      // del (gfm)
      if (cap = this.rules.del.exec(src)) {
        src = src.substring(cap[0].length);
        out += this.renderer.del(this.output(cap[1]));
        continue;
      }

      // autolink
      if (cap = this.rules.autolink.exec(src)) {
        src = src.substring(cap[0].length);
        if (cap[2] === '@') {
          text = escape$3(this.mangle(cap[1]));
          href = 'mailto:' + text;
        } else {
          text = escape$3(cap[1]);
          href = text;
        }
        out += this.renderer.link(href, null, text);
        continue;
      }

      // url (gfm)
      if (!this.inLink && (cap = this.rules.url.exec(src))) {
        if (cap[2] === '@') {
          text = escape$3(cap[0]);
          href = 'mailto:' + text;
        } else {
          // do extended autolink path validation
          do {
            prevCapZero = cap[0];
            cap[0] = this.rules._backpedal.exec(cap[0])[0];
          } while (prevCapZero !== cap[0]);
          text = escape$3(cap[0]);
          if (cap[1] === 'www.') {
            href = 'http://' + text;
          } else {
            href = text;
          }
        }
        src = src.substring(cap[0].length);
        out += this.renderer.link(href, null, text);
        continue;
      }

      // text
      if (cap = this.rules.text.exec(src)) {
        src = src.substring(cap[0].length);
        if (this.inRawBlock) {
          out += this.renderer.text(this.options.sanitize ? (this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape$3(cap[0])) : cap[0]);
        } else {
          out += this.renderer.text(escape$3(this.smartypants(cap[0])));
        }
        continue;
      }

      if (src) {
        throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
      }
    }

    return out;
  }

  static escapes(text) {
    return text ? text.replace(InlineLexer.rules._escapes, '$1') : text;
  }

  /**
   * Compile Link
   */
  outputLink(cap, link) {
    const href = link.href,
      title = link.title ? escape$3(link.title) : null;

    return cap[0].charAt(0) !== '!'
      ? this.renderer.link(href, title, this.output(cap[1]))
      : this.renderer.image(href, title, escape$3(cap[1]));
  }

  /**
   * Smartypants Transformations
   */
  smartypants(text) {
    if (!this.options.smartypants) return text;
    return text
      // em-dashes
      .replace(/---/g, '\u2014')
      // en-dashes
      .replace(/--/g, '\u2013')
      // opening singles
      .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
      // closing singles & apostrophes
      .replace(/'/g, '\u2019')
      // opening doubles
      .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
      // closing doubles
      .replace(/"/g, '\u201d')
      // ellipses
      .replace(/\.{3}/g, '\u2026');
  }

  /**
   * Mangle Links
   */
  mangle(text) {
    if (!this.options.mangle) return text;
    const l = text.length;
    let out = '',
      i = 0,
      ch;

    for (; i < l; i++) {
      ch = text.charCodeAt(i);
      if (Math.random() > 0.5) {
        ch = 'x' + ch.toString(16);
      }
      out += '&#' + ch + ';';
    }

    return out;
  }
};

/**
 * TextRenderer
 * returns only the textual part of the token
 */
var TextRenderer_1 = class TextRenderer {
  // no need for block level renderers
  strong(text) {
    return text;
  }

  em(text) {
    return text;
  }

  codespan(text) {
    return text;
  }

  del(text) {
    return text;
  }

  text(text) {
    return text;
  }

  link(href, title, text) {
    return '' + text;
  }

  image(href, title, text) {
    return '' + text;
  }

  br() {
    return '';
  }
};

const { defaults: defaults$4 } = defaults;
const {
  merge: merge$2,
  unescape: unescape$1$1
} = helpers;

/**
 * Parsing & Compiling
 */
var Parser_1 = class Parser {
  constructor(options) {
    this.tokens = [];
    this.token = null;
    this.options = options || defaults$4;
    this.options.renderer = this.options.renderer || new Renderer_1();
    this.renderer = this.options.renderer;
    this.renderer.options = this.options;
    this.slugger = new Slugger_1();
  }

  /**
   * Static Parse Method
   */
  static parse(tokens, options) {
    const parser = new Parser(options);
    return parser.parse(tokens);
  };

  /**
   * Parse Loop
   */
  parse(tokens) {
    this.inline = new InlineLexer_1(tokens.links, this.options);
    // use an InlineLexer with a TextRenderer to extract pure text
    this.inlineText = new InlineLexer_1(
      tokens.links,
      merge$2({}, this.options, { renderer: new TextRenderer_1() })
    );
    this.tokens = tokens.reverse();

    let out = '';
    while (this.next()) {
      out += this.tok();
    }

    return out;
  };

  /**
   * Next Token
   */
  next() {
    this.token = this.tokens.pop();
    return this.token;
  };

  /**
   * Preview Next Token
   */
  peek() {
    return this.tokens[this.tokens.length - 1] || 0;
  };

  /**
   * Parse Text Tokens
   */
  parseText() {
    let body = this.token.text;

    while (this.peek().type === 'text') {
      body += '\n' + this.next().text;
    }

    return this.inline.output(body);
  };

  /**
   * Parse Current Token
   */
  tok() {
    let body = '';
    switch (this.token.type) {
      case 'space': {
        return '';
      }
      case 'hr': {
        return this.renderer.hr();
      }
      case 'heading': {
        return this.renderer.heading(
          this.inline.output(this.token.text),
          this.token.depth,
          unescape$1$1(this.inlineText.output(this.token.text)),
          this.slugger);
      }
      case 'code': {
        return this.renderer.code(this.token.text,
          this.token.lang,
          this.token.escaped);
      }
      case 'table': {
        let header = '',
          i,
          row,
          cell,
          j;

        // header
        cell = '';
        for (i = 0; i < this.token.header.length; i++) {
          cell += this.renderer.tablecell(
            this.inline.output(this.token.header[i]),
            { header: true, align: this.token.align[i] }
          );
        }
        header += this.renderer.tablerow(cell);

        for (i = 0; i < this.token.cells.length; i++) {
          row = this.token.cells[i];

          cell = '';
          for (j = 0; j < row.length; j++) {
            cell += this.renderer.tablecell(
              this.inline.output(row[j]),
              { header: false, align: this.token.align[j] }
            );
          }

          body += this.renderer.tablerow(cell);
        }
        return this.renderer.table(header, body);
      }
      case 'blockquote_start': {
        body = '';

        while (this.next().type !== 'blockquote_end') {
          body += this.tok();
        }

        return this.renderer.blockquote(body);
      }
      case 'list_start': {
        body = '';
        const ordered = this.token.ordered,
          start = this.token.start;

        while (this.next().type !== 'list_end') {
          body += this.tok();
        }

        return this.renderer.list(body, ordered, start);
      }
      case 'list_item_start': {
        body = '';
        const loose = this.token.loose;
        const checked = this.token.checked;
        const task = this.token.task;

        if (this.token.task) {
          if (loose) {
            if (this.peek().type === 'text') {
              const nextToken = this.peek();
              nextToken.text = this.renderer.checkbox(checked) + ' ' + nextToken.text;
            } else {
              this.tokens.push({
                type: 'text',
                text: this.renderer.checkbox(checked)
              });
            }
          } else {
            body += this.renderer.checkbox(checked);
          }
        }

        while (this.next().type !== 'list_item_end') {
          body += !loose && this.token.type === 'text'
            ? this.parseText()
            : this.tok();
        }
        return this.renderer.listitem(body, task, checked);
      }
      case 'html': {
        // TODO parse inline content if parameter markdown=1
        return this.renderer.html(this.token.text);
      }
      case 'paragraph': {
        return this.renderer.paragraph(this.inline.output(this.token.text));
      }
      case 'text': {
        return this.renderer.paragraph(this.parseText());
      }
      default: {
        const errMsg = 'Token with "' + this.token.type + '" type was not found.';
        if (this.options.silent) {
          console.log(errMsg);
        } else {
          throw new Error(errMsg);
        }
      }
    }
  };
};

const {
  merge: merge$3,
  checkSanitizeDeprecation: checkSanitizeDeprecation$1,
  escape: escape$4
} = helpers;
const {
  getDefaults,
  changeDefaults,
  defaults: defaults$5
} = defaults;

/**
 * Marked
 */
function marked(src, opt, callback) {
  // throw error in case of non string input
  if (typeof src === 'undefined' || src === null) {
    throw new Error('marked(): input parameter is undefined or null');
  }
  if (typeof src !== 'string') {
    throw new Error('marked(): input parameter is of type '
      + Object.prototype.toString.call(src) + ', string expected');
  }

  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge$3({}, marked.defaults, opt || {});
    checkSanitizeDeprecation$1(opt);
    const highlight = opt.highlight;
    let tokens,
      pending,
      i = 0;

    try {
      tokens = Lexer_1.lex(src, opt);
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    const done = function(err) {
      if (err) {
        opt.highlight = highlight;
        return callback(err);
      }

      let out;

      try {
        out = Parser_1.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (err) return done(err);
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    opt = merge$3({}, marked.defaults, opt || {});
    checkSanitizeDeprecation$1(opt);
    return Parser_1.parse(Lexer_1.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/markedjs/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occurred:</p><pre>'
        + escape$4(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge$3(marked.defaults, opt);
  changeDefaults(marked.defaults);
  return marked;
};

marked.getDefaults = getDefaults;

marked.defaults = defaults$5;

/**
 * Expose
 */

marked.Parser = Parser_1;
marked.parser = Parser_1.parse;

marked.Renderer = Renderer_1;
marked.TextRenderer = TextRenderer_1;

marked.Lexer = Lexer_1;
marked.lexer = Lexer_1.lex;

marked.InlineLexer = InlineLexer_1;
marked.inlineLexer = InlineLexer_1.output;

marked.Slugger = Slugger_1;

marked.parse = marked;

var marked_1 = marked;

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}

function createCommonjsModule$1(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var pluralize = createCommonjsModule$1(function (module, exports) {
/* global define */

(function (root, pluralize) {
  /* istanbul ignore else */
  if (typeof commonjsRequire === 'function' && 'object' === 'object' && 'object' === 'object') {
    // Node.
    module.exports = pluralize();
  } else {
    // Browser global.
    root.pluralize = pluralize();
  }
})(commonjsGlobal, function () {
  // Rule storage - pluralize and singularize need to be run sequentially,
  // while other rules can be optimized using an object for instant lookups.
  var pluralRules = [];
  var singularRules = [];
  var uncountables = {};
  var irregularPlurals = {};
  var irregularSingles = {};

  /**
   * Sanitize a pluralization rule to a usable regular expression.
   *
   * @param  {(RegExp|string)} rule
   * @return {RegExp}
   */
  function sanitizeRule (rule) {
    if (typeof rule === 'string') {
      return new RegExp('^' + rule + '$', 'i');
    }

    return rule;
  }

  /**
   * Pass in a word token to produce a function that can replicate the case on
   * another word.
   *
   * @param  {string}   word
   * @param  {string}   token
   * @return {Function}
   */
  function restoreCase (word, token) {
    // Tokens are an exact match.
    if (word === token) return token;

    // Lower cased words. E.g. "hello".
    if (word === word.toLowerCase()) return token.toLowerCase();

    // Upper cased words. E.g. "WHISKY".
    if (word === word.toUpperCase()) return token.toUpperCase();

    // Title cased words. E.g. "Title".
    if (word[0] === word[0].toUpperCase()) {
      return token.charAt(0).toUpperCase() + token.substr(1).toLowerCase();
    }

    // Lower cased words. E.g. "test".
    return token.toLowerCase();
  }

  /**
   * Interpolate a regexp string.
   *
   * @param  {string} str
   * @param  {Array}  args
   * @return {string}
   */
  function interpolate (str, args) {
    return str.replace(/\$(\d{1,2})/g, function (match, index) {
      return args[index] || '';
    });
  }

  /**
   * Replace a word using a rule.
   *
   * @param  {string} word
   * @param  {Array}  rule
   * @return {string}
   */
  function replace (word, rule) {
    return word.replace(rule[0], function (match, index) {
      var result = interpolate(rule[1], arguments);

      if (match === '') {
        return restoreCase(word[index - 1], result);
      }

      return restoreCase(match, result);
    });
  }

  /**
   * Sanitize a word by passing in the word and sanitization rules.
   *
   * @param  {string}   token
   * @param  {string}   word
   * @param  {Array}    rules
   * @return {string}
   */
  function sanitizeWord (token, word, rules) {
    // Empty string or doesn't need fixing.
    if (!token.length || uncountables.hasOwnProperty(token)) {
      return word;
    }

    var len = rules.length;

    // Iterate over the sanitization rules and use the first one to match.
    while (len--) {
      var rule = rules[len];

      if (rule[0].test(word)) return replace(word, rule);
    }

    return word;
  }

  /**
   * Replace a word with the updated word.
   *
   * @param  {Object}   replaceMap
   * @param  {Object}   keepMap
   * @param  {Array}    rules
   * @return {Function}
   */
  function replaceWord (replaceMap, keepMap, rules) {
    return function (word) {
      // Get the correct token and case restoration functions.
      var token = word.toLowerCase();

      // Check against the keep object map.
      if (keepMap.hasOwnProperty(token)) {
        return restoreCase(word, token);
      }

      // Check against the replacement map for a direct word replacement.
      if (replaceMap.hasOwnProperty(token)) {
        return restoreCase(word, replaceMap[token]);
      }

      // Run all the rules against the word.
      return sanitizeWord(token, word, rules);
    };
  }

  /**
   * Check if a word is part of the map.
   */
  function checkWord (replaceMap, keepMap, rules, bool) {
    return function (word) {
      var token = word.toLowerCase();

      if (keepMap.hasOwnProperty(token)) return true;
      if (replaceMap.hasOwnProperty(token)) return false;

      return sanitizeWord(token, token, rules) === token;
    };
  }

  /**
   * Pluralize or singularize a word based on the passed in count.
   *
   * @param  {string}  word      The word to pluralize
   * @param  {number}  count     How many of the word exist
   * @param  {boolean} inclusive Whether to prefix with the number (e.g. 3 ducks)
   * @return {string}
   */
  function pluralize (word, count, inclusive) {
    var pluralized = count === 1
      ? pluralize.singular(word) : pluralize.plural(word);

    return (inclusive ? count + ' ' : '') + pluralized;
  }

  /**
   * Pluralize a word.
   *
   * @type {Function}
   */
  pluralize.plural = replaceWord(
    irregularSingles, irregularPlurals, pluralRules
  );

  /**
   * Check if a word is plural.
   *
   * @type {Function}
   */
  pluralize.isPlural = checkWord(
    irregularSingles, irregularPlurals, pluralRules
  );

  /**
   * Singularize a word.
   *
   * @type {Function}
   */
  pluralize.singular = replaceWord(
    irregularPlurals, irregularSingles, singularRules
  );

  /**
   * Check if a word is singular.
   *
   * @type {Function}
   */
  pluralize.isSingular = checkWord(
    irregularPlurals, irregularSingles, singularRules
  );

  /**
   * Add a pluralization rule to the collection.
   *
   * @param {(string|RegExp)} rule
   * @param {string}          replacement
   */
  pluralize.addPluralRule = function (rule, replacement) {
    pluralRules.push([sanitizeRule(rule), replacement]);
  };

  /**
   * Add a singularization rule to the collection.
   *
   * @param {(string|RegExp)} rule
   * @param {string}          replacement
   */
  pluralize.addSingularRule = function (rule, replacement) {
    singularRules.push([sanitizeRule(rule), replacement]);
  };

  /**
   * Add an uncountable word rule.
   *
   * @param {(string|RegExp)} word
   */
  pluralize.addUncountableRule = function (word) {
    if (typeof word === 'string') {
      uncountables[word.toLowerCase()] = true;
      return;
    }

    // Set singular and plural references for the word.
    pluralize.addPluralRule(word, '$0');
    pluralize.addSingularRule(word, '$0');
  };

  /**
   * Add an irregular word definition.
   *
   * @param {string} single
   * @param {string} plural
   */
  pluralize.addIrregularRule = function (single, plural) {
    plural = plural.toLowerCase();
    single = single.toLowerCase();

    irregularSingles[single] = plural;
    irregularPlurals[plural] = single;
  };

  /**
   * Irregular rules.
   */
  [
    // Pronouns.
    ['I', 'we'],
    ['me', 'us'],
    ['he', 'they'],
    ['she', 'they'],
    ['them', 'them'],
    ['myself', 'ourselves'],
    ['yourself', 'yourselves'],
    ['itself', 'themselves'],
    ['herself', 'themselves'],
    ['himself', 'themselves'],
    ['themself', 'themselves'],
    ['is', 'are'],
    ['was', 'were'],
    ['has', 'have'],
    ['this', 'these'],
    ['that', 'those'],
    // Words ending in with a consonant and `o`.
    ['echo', 'echoes'],
    ['dingo', 'dingoes'],
    ['volcano', 'volcanoes'],
    ['tornado', 'tornadoes'],
    ['torpedo', 'torpedoes'],
    // Ends with `us`.
    ['genus', 'genera'],
    ['viscus', 'viscera'],
    // Ends with `ma`.
    ['stigma', 'stigmata'],
    ['stoma', 'stomata'],
    ['dogma', 'dogmata'],
    ['lemma', 'lemmata'],
    ['schema', 'schemata'],
    ['anathema', 'anathemata'],
    // Other irregular rules.
    ['ox', 'oxen'],
    ['axe', 'axes'],
    ['die', 'dice'],
    ['yes', 'yeses'],
    ['foot', 'feet'],
    ['eave', 'eaves'],
    ['goose', 'geese'],
    ['tooth', 'teeth'],
    ['quiz', 'quizzes'],
    ['human', 'humans'],
    ['proof', 'proofs'],
    ['carve', 'carves'],
    ['valve', 'valves'],
    ['looey', 'looies'],
    ['thief', 'thieves'],
    ['groove', 'grooves'],
    ['pickaxe', 'pickaxes'],
    ['passerby', 'passersby']
  ].forEach(function (rule) {
    return pluralize.addIrregularRule(rule[0], rule[1]);
  });

  /**
   * Pluralization rules.
   */
  [
    [/s?$/i, 's'],
    [/[^\u0000-\u007F]$/i, '$0'],
    [/([^aeiou]ese)$/i, '$1'],
    [/(ax|test)is$/i, '$1es'],
    [/(alias|[^aou]us|t[lm]as|gas|ris)$/i, '$1es'],
    [/(e[mn]u)s?$/i, '$1s'],
    [/([^l]ias|[aeiou]las|[ejzr]as|[iu]am)$/i, '$1'],
    [/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1i'],
    [/(alumn|alg|vertebr)(?:a|ae)$/i, '$1ae'],
    [/(seraph|cherub)(?:im)?$/i, '$1im'],
    [/(her|at|gr)o$/i, '$1oes'],
    [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)(?:a|um)$/i, '$1a'],
    [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)(?:a|on)$/i, '$1a'],
    [/sis$/i, 'ses'],
    [/(?:(kni|wi|li)fe|(ar|l|ea|eo|oa|hoo)f)$/i, '$1$2ves'],
    [/([^aeiouy]|qu)y$/i, '$1ies'],
    [/([^ch][ieo][ln])ey$/i, '$1ies'],
    [/(x|ch|ss|sh|zz)$/i, '$1es'],
    [/(matr|cod|mur|sil|vert|ind|append)(?:ix|ex)$/i, '$1ices'],
    [/\b((?:tit)?m|l)(?:ice|ouse)$/i, '$1ice'],
    [/(pe)(?:rson|ople)$/i, '$1ople'],
    [/(child)(?:ren)?$/i, '$1ren'],
    [/eaux$/i, '$0'],
    [/m[ae]n$/i, 'men'],
    ['thou', 'you']
  ].forEach(function (rule) {
    return pluralize.addPluralRule(rule[0], rule[1]);
  });

  /**
   * Singularization rules.
   */
  [
    [/s$/i, ''],
    [/(ss)$/i, '$1'],
    [/(wi|kni|(?:after|half|high|low|mid|non|night|[^\w]|^)li)ves$/i, '$1fe'],
    [/(ar|(?:wo|[ae])l|[eo][ao])ves$/i, '$1f'],
    [/ies$/i, 'y'],
    [/\b([pl]|zomb|(?:neck|cross)?t|coll|faer|food|gen|goon|group|lass|talk|goal|cut)ies$/i, '$1ie'],
    [/\b(mon|smil)ies$/i, '$1ey'],
    [/\b((?:tit)?m|l)ice$/i, '$1ouse'],
    [/(seraph|cherub)im$/i, '$1'],
    [/(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|t[lm]as|gas|(?:her|at|gr)o|[aeiou]ris)(?:es)?$/i, '$1'],
    [/(analy|diagno|parenthe|progno|synop|the|empha|cri|ne)(?:sis|ses)$/i, '$1sis'],
    [/(movie|twelve|abuse|e[mn]u)s$/i, '$1'],
    [/(test)(?:is|es)$/i, '$1is'],
    [/(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1us'],
    [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|quor)a$/i, '$1um'],
    [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)a$/i, '$1on'],
    [/(alumn|alg|vertebr)ae$/i, '$1a'],
    [/(cod|mur|sil|vert|ind)ices$/i, '$1ex'],
    [/(matr|append)ices$/i, '$1ix'],
    [/(pe)(rson|ople)$/i, '$1rson'],
    [/(child)ren$/i, '$1'],
    [/(eau)x?$/i, '$1'],
    [/men$/i, 'man']
  ].forEach(function (rule) {
    return pluralize.addSingularRule(rule[0], rule[1]);
  });

  /**
   * Uncountable rules.
   */
  [
    // Singular words with no plurals.
    'adulthood',
    'advice',
    'agenda',
    'aid',
    'aircraft',
    'alcohol',
    'ammo',
    'analytics',
    'anime',
    'athletics',
    'audio',
    'bison',
    'blood',
    'bream',
    'buffalo',
    'butter',
    'carp',
    'cash',
    'chassis',
    'chess',
    'clothing',
    'cod',
    'commerce',
    'cooperation',
    'corps',
    'debris',
    'diabetes',
    'digestion',
    'elk',
    'energy',
    'equipment',
    'excretion',
    'expertise',
    'firmware',
    'flounder',
    'fun',
    'gallows',
    'garbage',
    'graffiti',
    'hardware',
    'headquarters',
    'health',
    'herpes',
    'highjinks',
    'homework',
    'housework',
    'information',
    'jeans',
    'justice',
    'kudos',
    'labour',
    'literature',
    'machinery',
    'mackerel',
    'mail',
    'media',
    'mews',
    'moose',
    'music',
    'mud',
    'manga',
    'news',
    'only',
    'personnel',
    'pike',
    'plankton',
    'pliers',
    'police',
    'pollution',
    'premises',
    'rain',
    'research',
    'rice',
    'salmon',
    'scissors',
    'series',
    'sewage',
    'shambles',
    'shrimp',
    'software',
    'species',
    'staff',
    'swine',
    'tennis',
    'traffic',
    'transportation',
    'trout',
    'tuna',
    'wealth',
    'welfare',
    'whiting',
    'wildebeest',
    'wildlife',
    'you',
    /pok[eé]mon$/i,
    // Regexes.
    /[^aeiou]ese$/i, // "chinese", "japanese"
    /deer$/i, // "deer", "reindeer"
    /fish$/i, // "fish", "blowfish", "angelfish"
    /measles$/i,
    /o[iu]s$/i, // "carnivorous"
    /pox$/i, // "chickpox", "smallpox"
    /sheep$/i
  ].forEach(pluralize.addUncountableRule);

  return pluralize;
});
});

// @ts-check

/** @type {import("idb")} */
// @ts-ignore
const idb = _idb;
const webidl2 = _webidl2;
/** @type {import("hyperhtml").default} */
// @ts-ignore
const hyperHTML$1 = hyperHTML;
/** @type {import("marked")} */
// @ts-ignore
const marked$1 = marked_1;
/** @type {import("pluralize")} */
// @ts-ignore
const pluralize$1 = pluralize;

// @ts-check

const dashes = /-/g;
/**
 * Hashes a string from char code. Can return a negative number.
 * Based on https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0
 *
 * @param {String} text
 */
function hashString(text) {
  let hash = 0;
  for (const char of text) {
    hash = (Math.imul(31, hash) + char.charCodeAt(0)) | 0;
  }
  return String(hash);
}

const ISODate = new Intl.DateTimeFormat(["en-ca-iso8601"], {
  timeZone: "UTC",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const resourceHints = new Set([
  "dns-prefetch",
  "preconnect",
  "preload",
  "prerender",
]);

const fetchDestinations = new Set([
  "document",
  "embed",
  "font",
  "image",
  "manifest",
  "media",
  "object",
  "report",
  "script",
  "serviceworker",
  "sharedworker",
  "style",
  "worker",
  "xslt",
  "",
]);

// CSS selector for matching elements that are non-normative
const nonNormativeSelector =
  ".informative, .note, .issue, .example, .ednote, .practice, .introductory";

/**
 * Creates a link element that represents a resource hint.
 *
 * @param {Object} opts Configure the resource hint.
 * @param {String} opts.hint The type of hint (see resourceHints).
 * @param {String} opts.href The URL for the resource or origin.
 * @param {String} [opts.corsMode] Optional, the CORS mode to use (see HTML spec).
 * @param {String} [opts.as] Optional, fetch destination type (see fetchDestinations).
 * @param {boolean} [opts.dontRemove] If the hint should remain in the spec after processing.
 * @return {HTMLLinkElement} A link element ready to use.
 */
function createResourceHint(opts) {
  if (!opts || typeof opts !== "object") {
    throw new TypeError("Missing options");
  }
  if (!resourceHints.has(opts.hint)) {
    throw new TypeError("Invalid resources hint");
  }
  const url = new URL(opts.href, location.href);
  const linkElem = document.createElement("link");
  let { href } = url;
  linkElem.rel = opts.hint;
  switch (linkElem.rel) {
    case "dns-prefetch":
    case "preconnect":
      href = url.origin;
      if (opts.corsMode || url.origin !== document.location.origin) {
        linkElem.crossOrigin = opts.corsMode || "anonymous";
      }
      break;
    case "preload":
      if ("as" in opts && typeof opts.as === "string") {
        if (!fetchDestinations.has(opts.as)) {
          console.warn(`Unknown request destination: ${opts.as}`);
        }
        linkElem.setAttribute("as", opts.as);
      }
      break;
  }
  linkElem.href = href;
  if (!opts.dontRemove) {
    linkElem.classList.add("removeOnSave");
  }
  return linkElem;
}

// RESPEC STUFF
function removeReSpec(doc) {
  doc.querySelectorAll(".remove, script[data-requiremodule]").forEach(elem => {
    elem.remove();
  });
}

/**
 * Adds error class to each element while emitting a warning
 * @param {HTMLElement|HTMLElement[]} elems
 * @param {String} msg message to show in warning
 * @param {String=} title error message to add on each element
 */
function showInlineWarning(elems, msg, title) {
  if (!Array.isArray(elems)) elems = [elems];
  const links = elems
    .map((element, i) => {
      markAsOffending(element, msg, title);
      return generateMarkdownLink(element, i);
    })
    .join(", ");
  pub("warn", `${msg} at: ${links}.`);
  console.warn(msg, elems);
}

/**
 * Adds error class to each element while emitting a warning
 * @param {HTMLElement|HTMLElement[]} elems
 * @param {String} msg message to show in warning
 * @param {String} title error message to add on each element
 * @param {object} [options]
 * @param {string} [options.details]
 */
function showInlineError(elems, msg, title, { details } = {}) {
  if (!Array.isArray(elems)) elems = [elems];
  const links = elems
    .map((element, i) => {
      markAsOffending(element, msg, title);
      return generateMarkdownLink(element, i);
    })
    .join(", ");
  let message = `${msg} at: ${links}.`;
  if (details) {
    message += `\n\n<details>${details}</details>`;
  }
  pub("error", message);
  console.error(msg, elems);
}

/**
 * Adds error class to each element while emitting a warning
 * @param {HTMLElement} elem
 * @param {String} msg message to show in warning
 * @param {String=} title error message to add on each element
 */
function markAsOffending(elem, msg, title) {
  elem.classList.add("respec-offending-element");
  if (!elem.hasAttribute("title")) {
    elem.setAttribute("title", title || msg);
  }
  if (!elem.id) {
    addId(elem, "respec-offender");
  }
}

/**
 * @param {Element} element
 * @param {number} i
 */
function generateMarkdownLink(element, i) {
  return `[${i + 1}](#${element.id})`;
}

class IDBKeyVal {
  /**
   * @param {import("idb").IDBPDatabase} idb
   * @param {string} storeName
   */
  constructor(idb, storeName) {
    this.idb = idb;
    this.storeName = storeName;
  }

  /** @param {string} key */
  async get(key) {
    return await this.idb
      .transaction(this.storeName)
      .objectStore(this.storeName)
      .get(key);
  }

  /**
   * @param {string[]} keys
   */
  async getMany(keys) {
    const keySet = new Set(keys);
    /** @type {Map<string, any>} */
    const results = new Map();
    let cursor = await this.idb.transaction(this.storeName).store.openCursor();
    while (cursor) {
      if (keySet.has(cursor.key)) {
        results.set(cursor.key, cursor.value);
      }
      cursor = await cursor.continue();
    }
    return results;
  }

  /**
   * @param {string} key
   * @param {any} value
   */
  async set(key, value) {
    const tx = this.idb.transaction(this.storeName, "readwrite");
    tx.objectStore(this.storeName).put(value, key);
    return await tx.done;
  }

  async addMany(entries) {
    const tx = this.idb.transaction(this.storeName, "readwrite");
    for (const [key, value] of entries) {
      tx.objectStore(this.storeName).put(value, key);
    }
    return await tx.done;
  }

  async clear() {
    const tx = this.idb.transaction(this.storeName, "readwrite");
    tx.objectStore(this.storeName).clear();
    return await tx.done;
  }

  async keys() {
    const tx = this.idb.transaction(this.storeName);
    /** @type {Promise<string[]>} */
    const keys = tx.objectStore(this.storeName).getAllKeys();
    await tx.done;
    return keys;
  }
}

// STRING HELPERS
// Takes an array and returns a string that separates each of its items with the proper commas and
// "and". The second argument is a mapping function that can convert the items before they are
// joined
function joinAnd(array = [], mapper = item => item, lang$1 = lang) {
  const items = array.map(mapper);
  if (Intl.ListFormat && typeof Intl.ListFormat === "function") {
    const formatter = new Intl.ListFormat(lang$1, {
      style: "long",
      type: "conjunction",
    });
    return formatter.format(items);
  }
  switch (items.length) {
    case 0:
    case 1: // "x"
      return items.toString();
    case 2: // x and y
      return items.join(" and ");
    default: {
      // x, y, and z
      const str = items.join(", ");
      const lastComma = str.lastIndexOf(",");
      return `${str.substr(0, lastComma + 1)} and ${str.slice(lastComma + 2)}`;
    }
  }
}

// Takes a string, applies some XML escapes, and returns the escaped string.
// Note that overall using either Handlebars' escaped output or jQuery is much
// preferred to operating on strings directly.
function xmlEscape(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

/**
 * Trims string at both ends and replaces all other white space with a single space
 * @param {string} str
 */
function norm(str) {
  return str.trim().replace(/\s+/g, " ");
}

// --- DATE HELPERS -------------------------------------------------------------------------------
// Takes a Date object and an optional separator and returns the year,month,day representation with
// the custom separator (defaulting to none) and proper 0-padding
function concatDate(date, sep = "") {
  return ISODate.format(date).replace(dashes, sep);
}

// formats a date to "yyyy-mm-dd"
function toShortIsoDate(date) {
  return ISODate.format(date);
}

// given either a Date object or a date in YYYY-MM-DD format,
// return a human-formatted date suitable for use in a W3C specification
function humanDate(
  date = new Date(),
  lang = document.documentElement.lang || "en"
) {
  if (!(date instanceof Date)) date = new Date(date);
  const langs = [lang, "en"];
  const day = date.toLocaleString(langs, {
    day: "2-digit",
    timeZone: "UTC",
  });
  const month = date.toLocaleString(langs, {
    month: "long",
    timeZone: "UTC",
  });
  const year = date.toLocaleString(langs, {
    year: "numeric",
    timeZone: "UTC",
  });
  // date month year
  return `${day} ${month} ${year}`;
}

// Given an object, it converts it to a key value pair separated by
// ("=", configurable) and a delimiter (" ," configurable).
// for example, {"foo": "bar", "baz": 1} becomes "foo=bar, baz=1"
function toKeyValuePairs(obj, delimiter = ", ", separator = "=") {
  return Array.from(Object.entries(obj))
    .map(([key, value]) => `${key}${separator}${JSON.stringify(value)}`)
    .join(delimiter);
}

// STYLE HELPERS
// take a document and either a link or an array of links to CSS and appends
// a <link/> element to the head pointing to each
function linkCSS(doc, styles) {
  const stylesArray = [].concat(styles);
  const frag = stylesArray
    .map(url => {
      const link = doc.createElement("link");
      link.rel = "stylesheet";
      link.href = url;
      return link;
    })
    .reduce((elem, nextLink) => {
      elem.appendChild(nextLink);
      return elem;
    }, doc.createDocumentFragment());
  doc.head.appendChild(frag);
}

// TRANSFORMATIONS
// Run list of transforms over content and return result.
// Please note that this is a legacy method that is only kept in order
// to maintain compatibility
// with RSv1. It is therefore not tested and not actively supported.
/**
 * @this {any}
 * @param {string} [flist]
 */
function runTransforms(content, flist) {
  let args = [this, content];
  const funcArgs = Array.from(arguments);
  funcArgs.shift();
  funcArgs.shift();
  args = args.concat(funcArgs);
  if (flist) {
    const methods = flist.split(/\s+/);
    for (let j = 0; j < methods.length; j++) {
      const meth = methods[j];
      /** @type {any} */
      const method = window[meth];
      if (method) {
        // the initial call passed |this| directly, so we keep it that way
        try {
          content = method.apply(this, args);
        } catch (e) {
          pub(
            "warn",
            `call to \`${meth}()\` failed with: ${e}. See error console for stack trace.`
          );
          console.error(e);
        }
      }
    }
  }
  return content;
}

/**
 * Cached request handler
 * @param {RequestInfo} input
 * @param {number} maxAge cache expiration duration in ms. defaults to 24 hours (86400000 ms)
 * @return {Promise<Response>}
 *  if a cached response is available and it's not stale, return it
 *  else: request from network, cache and return fresh response.
 *    If network fails, return a stale cached version if exists (else throw)
 */
async function fetchAndCache(input, maxAge = 86400000) {
  const request = new Request(input);
  const url = new URL(request.url);

  // use data from cache data if valid and render
  let cache;
  let cachedResponse;
  if ("caches" in window) {
    try {
      cache = await caches.open(url.origin);
      cachedResponse = await cache.match(request);
      if (
        cachedResponse &&
        new Date(cachedResponse.headers.get("Expires")) > new Date()
      ) {
        return cachedResponse;
      }
    } catch (err) {
      console.error("Failed to use Cache API.", err);
    }
  }

  // otherwise fetch new data and cache
  const response = await fetch(request);
  if (!response.ok) {
    if (cachedResponse) {
      // return stale version
      console.warn(`Returning a stale cached response for ${url}`);
      return cachedResponse;
    }
  }

  // cache response
  if (cache && response.ok) {
    const clonedResponse = response.clone();
    const customHeaders = new Headers(response.headers);
    const expiryDate = new Date(Date.now() + maxAge);
    customHeaders.set("Expires", expiryDate.toString());
    const cacheResponse = new Response(await clonedResponse.blob(), {
      headers: customHeaders,
    });
    // put in cache, and forget it (there is no recovery if it throws, but that's ok).
    await cache.put(request, cacheResponse).catch(console.error);
  }
  return response;
}

// --- COLLECTION/ITERABLE HELPERS ---------------
/**
 * Spreads one iterable into another.
 *
 * @param {Array} collector
 * @param {any|Array} item
 * @returns {Array}
 */
function flatten$1(collector, item) {
  const items = !Array.isArray(item)
    ? [item]
    : item.slice().reduce(flatten$1, []);
  collector.push(...items);
  return collector;
}

// --- DOM HELPERS -------------------------------

/**
 * Separates each item with proper commas and "and".
 * @param {string[]} array
 * @param {(str: any) => object} mapper
 */
function htmlJoinAnd(array, mapper = item => item) {
  const items = array.map(mapper);
  switch (items.length) {
    case 0:
    case 1: // "x"
      return items[0];
    case 2: // x and y
      return hyperHTML$1`${items[0]} and ${items[1]}`;
    default: {
      const joinedItems = items.slice(0, -1).map(item => hyperHTML$1`${item}, `);
      return hyperHTML$1`${joinedItems}and ${items[items.length - 1]}`;
    }
  }
}

/**
 * Creates and sets an ID to an element (elem) by hashing the text content.
 *
 * @param {HTMLElement} elem element to hash from
 * @param {String} prefix prefix to prepend to the generated id
 */
function addHashId(elem, prefix = "") {
  const text = norm(elem.textContent);
  const hash = hashString(text);
  return addId(elem, prefix, hash);
}

/**
 * Creates and sets an ID to an element (elem)
 * using a specific prefix if provided, and a specific text if given.
 * @param {HTMLElement} elem element
 * @param {String} pfx prefix
 * @param {String} txt text
 * @param {Boolean} noLC do not convert to lowercase
 * @returns {String} generated (or existing) id for element
 */
function addId(elem, pfx = "", txt = "", noLC = false) {
  if (elem.id) {
    return elem.id;
  }
  if (!txt) {
    txt = (elem.title ? elem.title : elem.textContent).trim();
  }
  let id = noLC ? txt : txt.toLowerCase();
  id = id
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\W+/gim, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

  if (!id) {
    id = "generatedID";
  } else if (pfx === "example") {
    id = txt;
  } else if (/\.$/.test(id) || !/^[a-z]/i.test(id)) {
    id = `x${id}`; // trailing . doesn't play well with jQuery
  }
  if (pfx) {
    id = `${pfx}-${id}`;
  }
  if (elem.ownerDocument.getElementById(id)) {
    let i = 0;
    let nextId = `${id}-${i}`;
    while (elem.ownerDocument.getElementById(nextId)) {
      i += 1;
      nextId = `${id}-${i}`;
    }
    id = nextId;
  }
  elem.id = id;
  return id;
}

/**
 * Returns all the descendant text nodes of an element.
 * @param {Node} el
 * @param {string[]} exclusions node localName to exclude
 * @param {object} options
 * @param {boolean} options.wsNodes if nodes that only have whitespace are returned.
 * @returns {Text[]}
 */
function getTextNodes(el, exclusions = [], options = { wsNodes: true }) {
  const exclusionQuery = exclusions.join(", ");
  const acceptNode = (/** @type {Text} */ node) => {
    if (!options.wsNodes && !node.data.trim()) {
      return NodeFilter.FILTER_REJECT;
    }
    if (exclusionQuery && node.parentElement.closest(exclusionQuery)) {
      return NodeFilter.FILTER_REJECT;
    }
    return NodeFilter.FILTER_ACCEPT;
  };
  const nodeIterator = document.createNodeIterator(
    el,
    NodeFilter.SHOW_TEXT,
    acceptNode
  );
  /** @type {Text[]} */
  const textNodes = [];
  let node;
  while ((node = nodeIterator.nextNode())) {
    textNodes.push(/** @type {Text} */ (node));
  }
  return textNodes;
}

/**
 * For any element, returns an array of title strings that applies
 *   the algorithm used for determining the actual title of a
 *   <dfn> element (but can apply to other as well).
 * if args.isDefinition is true, then the element is a definition, not a
 *   reference to a definition. Any @title will be replaced with
 *   @data-lt to be consistent with Bikeshed / Shepherd.
 * This method now *prefers* the data-lt attribute for the list of
 *   titles. That attribute is added by this method to dfn elements, so
 *   subsequent calls to this method will return the data-lt based list.
 * @param {HTMLElement} elem
 * @returns {String[]} array of title strings
 */
function getDfnTitles(elem) {
  const titleSet = new Set();
  // data-lt-noDefault avoid using the text content of a definition
  // in the definition list.
  // ltNodefault is === "data-lt-noDefault"... someone screwed up 😖
  const normText = "ltNodefault" in elem.dataset ? "" : norm(elem.textContent);
  const child = /** @type {HTMLElement | undefined} */ (elem.children[0]);
  if (elem.dataset.lt) {
    // prefer @data-lt for the list of title aliases
    elem.dataset.lt
      .split("|")
      .map(item => norm(item))
      .forEach(item => titleSet.add(item));
  } else if (
    elem.childNodes.length === 1 &&
    elem.getElementsByTagName("abbr").length === 1 &&
    child.title
  ) {
    titleSet.add(child.title);
  } else if (elem.textContent === '""') {
    titleSet.add("the-empty-string");
  }

  titleSet.add(normText);
  titleSet.delete("");

  // We could have done this with @data-lt (as the logic is same), but if
  // @data-lt was not present, we would end up using @data-local-lt as element's
  // id (in other words, we prefer textContent over @data-local-lt for dfn id)
  if (elem.dataset.localLt) {
    const localLt = elem.dataset.localLt.split("|");
    localLt.forEach(item => titleSet.add(norm(item)));
  }

  const titles = [...titleSet];
  return titles;
}

/**
 * For an element (usually <a>), returns an array of targets that
 * element might refer to, of the form
 * @typedef {object} LinkTarget
 * @property {string} for
 * @property {string} title
 *
 * For an element like:
 *  <p data-link-for="Int1"><a data-link-for="Int2">Int3.member</a></p>
 * we'll return:
 *  * {for: "int2", title: "int3.member"}
 *  * {for: "int3", title: "member"}
 *  * {for: "", title: "int3.member"}
 * @param {HTMLElement} elem
 * @returns {LinkTarget[]}
 */
function getLinkTargets(elem) {
  /** @type {HTMLElement} */
  const linkForElem = elem.closest("[data-link-for]");
  const linkFor = linkForElem ? linkForElem.dataset.linkFor : "";
  const titles = getDfnTitles(elem);
  const results = titles.reduce((result, title) => {
    // supports legacy <dfn>Foo.Bar()</dfn> definitions
    const split = title.split(".");
    if (split.length === 2) {
      // If there are multiple '.'s, this won't match an
      // Interface/member pair anyway.
      result.push({ for: split[0], title: split[1] });
    }
    result.push({ for: linkFor, title });

    // Finally, we can try to match without link for
    if (linkFor !== "") result.push({ for: "", title });
    return result;
  }, []);
  return results;
}

/**
 * Changes name of a DOM Element
 * @param {Element} elem element to rename
 * @param {String} newName new element name
 * @returns {Element} new renamed element
 */
function renameElement(elem, newName) {
  if (elem.localName === newName) return elem;
  const newElement = elem.ownerDocument.createElement(newName);
  // copy attributes
  for (const { name, value } of elem.attributes) {
    newElement.setAttribute(name, value);
  }
  // copy child nodes
  newElement.append(...elem.childNodes);
  elem.replaceWith(newElement);
  return newElement;
}

function refTypeFromContext(ref, element) {
  const closestInformative = element.closest(nonNormativeSelector);
  let isInformative = false;
  if (closestInformative) {
    // check if parent is not normative
    isInformative =
      !element.closest(".normative") ||
      !closestInformative.querySelector(".normative");
  }
  // prefixes `!` and `?` override section behavior
  if (ref.startsWith("!")) {
    if (isInformative) {
      // A (forced) normative reference in informative section is illegal
      return { type: "informative", illegal: true };
    }
    isInformative = false;
  } else if (ref.startsWith("?")) {
    isInformative = true;
  }
  const type = isInformative ? "informative" : "normative";
  return { type, illegal: false };
}

/**
 * Wraps inner contents with the wrapper node
 * @param {Node} outer outer node to be modified
 * @param {Element} wrapper wrapper node to be appended
 */
function wrapInner(outer, wrapper) {
  wrapper.append(...outer.childNodes);
  outer.appendChild(wrapper);
  return outer;
}

/**
 * Applies the selector for all its ancestors.
 * @param {Element} element
 * @param {string} selector
 */
function parents(element, selector) {
  /** @type {Element[]} */
  const list = [];
  let parent = element.parentElement;
  while (parent) {
    const closest = parent.closest(selector);
    if (!closest) {
      break;
    }
    list.push(closest);
    parent = closest.parentElement;
  }
  return list;
}

/**
 * Applies the selector for direct descendants.
 * This is a helper function for browsers without :scope support.
 * Note that this doesn't support comma separated selectors.
 * @param {Element} element
 * @param {string} selector
 * @returns {NodeListOf<HTMLElement>}
 */
function children(element, selector) {
  try {
    return element.querySelectorAll(`:scope > ${selector}`);
  } catch {
    let tempId = "";
    // We give a temporary id, to overcome lack of ":scope" support in Edge.
    if (!element.id) {
      tempId = `temp-${String(Math.random()).substr(2)}`;
      element.id = tempId;
    }
    const query = `#${element.id} > ${selector}`;
    /** @type {NodeListOf<HTMLElement>} */
    const elements = element.parentElement.querySelectorAll(query);
    if (tempId) {
      element.id = "";
    }
    return elements;
  }
}

/**
 * Generates simple ids. The id's increment after it yields.
 *
 * @param {String} namespace A string like "highlight".
 * @param {number} counter A number, which can start at a given value.
 */
function msgIdGenerator(namespace, counter = 0) {
  function* idGenerator(namespace, counter) {
    while (true) {
      yield `${namespace}:${counter}`;
      counter++;
    }
  }
  const gen = idGenerator(namespace, counter);
  return () => {
    return gen.next().value;
  };
}

class InsensitiveStringSet extends Set {
  /**
   * @param {Array<String>} [keys] Optional, initial keys
   */
  constructor(keys = []) {
    super();
    for (const key of keys) {
      this.add(key);
    }
  }
  /**
   * @param {string} key
   */
  add(key) {
    if (!this.has(key) && !this.getCanonicalKey(key)) {
      return super.add(key);
    }
    return this;
  }
  /**
   * @param {string} key
   */
  has(key) {
    return (
      super.has(key) ||
      [...this.keys()].some(
        existingKey => existingKey.toLowerCase() === key.toLowerCase()
      )
    );
  }
  /**
   * @param {string} key
   */
  delete(key) {
    return super.has(key)
      ? super.delete(key)
      : super.delete(this.getCanonicalKey(key));
  }
  /**
   * @param {string} key
   */
  getCanonicalKey(key) {
    return super.has(key)
      ? key
      : [...this.keys()].find(
          existingKey => existingKey.toLowerCase() === key.toLowerCase()
        );
  }
}

function makeSafeCopy(node) {
  const clone = node.cloneNode(true);
  clone.querySelectorAll("[id]").forEach(elem => elem.removeAttribute("id"));
  clone.querySelectorAll("dfn").forEach(dfn => renameElement(dfn, "span"));
  if (clone.hasAttribute("id")) clone.removeAttribute("id");
  removeCommentNodes(clone);
  return clone;
}

function removeCommentNodes(node) {
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_COMMENT);
  for (const comment of [...walkTree(walker)]) {
    comment.remove();
  }
}

/**
 * @template {Node} T
 * @param {TreeWalker<T>} walker
 * @return {IterableIterator<T>}
 */
function* walkTree(walker) {
  while (walker.nextNode()) {
    yield /** @type {T} */ (walker.currentNode);
  }
}

// @ts-check

const name$2 = "core/base-runner";
const canMeasure = performance.mark && performance.measure;

function toRunnable(plug) {
  const name = plug.name || "";
  if (!name) {
    console.warn("Plugin lacks name:", plug);
  }
  return config => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      const timerId = setTimeout(() => {
        const msg = `Plugin ${name} took too long.`;
        console.error(msg, plug);
        reject(new Error(msg));
      }, 15000);
      if (canMeasure) {
        performance.mark(`${name}-start`);
      }
      try {
        if (plug.run.length <= 1) {
          await plug.run(config);
          resolve();
        } else {
          console.warn(
            `Plugin ${name} uses a deprecated callback signature. Return a Promise instead. Read more at: https://github.com/w3c/respec/wiki/Developers-Guide#plugins`
          );
          plug.run(config, document, resolve);
        }
      } catch (err) {
        reject(err);
      } finally {
        clearTimeout(timerId);
      }
      if (canMeasure) {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
      }
    });
  };
}

async function runAll(plugs) {
  pub("start-all", respecConfig);
  if (canMeasure) {
    performance.mark(`${name$2}-start`);
  }
  await done$1;
  const runnables = plugs.filter(plug => plug && plug.run).map(toRunnable);
  for (const task of runnables) {
    try {
      await task(respecConfig);
    } catch (err) {
      console.error(err);
    }
  }
  pub("plugins-done", respecConfig);
  await done;
  pub("end-all", respecConfig);
  removeReSpec(document);
  if (canMeasure) {
    performance.mark(`${name$2}-end`);
    performance.measure(name$2, `${name$2}-start`, `${name$2}-end`);
  }
}

var baseRunner = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$2,
  runAll: runAll
});

/**
 * @param {string} path
 */
async function fetchBase(path) {
  const response = await fetch(new URL(`../../${path}`, (typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('respec-w3c.js', document.baseURI).href))));
  return await response.text();
}

/**
 * @param {string} fileName
 */
async function fetchAsset(fileName) {
  return fetchBase(`assets/${fileName}`);
}

// @ts-check
const name$3 = "core/markdown";

const gtEntity = /&gt;/gm;
const ampEntity = /&amp;/gm;
const endsWithSpace = /\s+$/gm;

const inlineElems = new Set([
  "a",
  "abbr",
  "acronym",
  "b",
  "bdo",
  "big",
  "br",
  "button",
  "cite",
  "code",
  "dfn",
  "em",
  "i",
  "img",
  "input",
  "kbd",
  "label",
  "map",
  "object",
  "q",
  "samp",
  "script",
  "select",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "textarea",
  "time",
  "tt",
  "var",
]);

class Renderer extends marked$1.Renderer {
  code(code, language, isEscaped) {
    // regex to check whether the language is webidl
    if (/(^webidl$)/i.test(language)) {
      return `<pre class="idl">${code}</pre>`;
    }
    return super.code(code, language, isEscaped);
  }

  heading(text, level, raw, slugger) {
    const headingWithIdRegex = /(.+)\s+{#([\w-]+)}$/;
    if (headingWithIdRegex.test(text)) {
      const [, textContent, id] = text.match(headingWithIdRegex);
      return `<h${level} id="${id}">${textContent}</h${level}>`;
    }
    return super.heading(text, level, raw, slugger);
  }
}

/**
 * @param {string} text
 */
function normalizePadding(text) {
  if (!text) {
    return "";
  }
  if (typeof text !== "string") {
    throw TypeError("Invalid input");
  }
  if (text === "\n") {
    return "\n";
  }

  /**
   * @param {Node} node
   * @return {node is Text}
   */
  function isTextNode(node) {
    return node !== null && node.nodeType === Node.TEXT_NODE;
  }
  /**
   * @param {Node} node
   * @return {node is Element}
   */
  function isElementNode(node) {
    return node !== null && node.nodeType === Node.ELEMENT_NODE;
  }
  const doc = document.createRange().createContextualFragment(text);
  // Normalize block level elements children first
  Array.from(doc.children)
    .filter(elem => !inlineElems.has(elem.localName))
    .filter(elem => elem.localName !== "pre")
    .filter(elem => elem.localName !== "table")
    .forEach(elem => {
      elem.innerHTML = normalizePadding(elem.innerHTML);
    });
  // Normalize root level now
  Array.from(doc.childNodes)
    .filter(node => isTextNode(node) && node.textContent.trim() === "")
    .forEach(node => node.replaceWith("\n"));
  // Normalize text node
  if (isElementNode(doc.firstChild)) {
    Array.from(doc.firstChild.children)
      .filter(child => child.localName !== "table")
      .forEach(child => {
        child.innerHTML = normalizePadding(child.innerHTML);
      });
  }
  doc.normalize();
  // use the first space as an indicator of how much to chop off the front
  const firstSpace = doc.textContent
    .replace(/^ *\n/, "")
    .split("\n")
    .filter(item => item && item.startsWith(" "))[0];
  const chop = firstSpace ? firstSpace.match(/ +/)[0].length : 0;
  if (chop) {
    // Chop chop from start, but leave pre elem alone
    Array.from(doc.childNodes)
      .filter(node => node.nodeName !== "PRE")
      .filter(isTextNode)
      .filter(node => {
        // we care about text next to a block level element
        const prevSib = node.previousElementSibling;
        const nextTo = prevSib && prevSib.localName;
        // and we care about text elements that finish on a new line
        return (
          !inlineElems.has(nextTo) || node.textContent.trim().includes("\n")
        );
      })
      .reduce((replacer, node) => {
        // We need to retain white space if the text Node is next to an in-line element
        let padding = "";
        const prevSib = node.previousElementSibling;
        const nextTo = prevSib && prevSib.localName;
        if (/^[\t ]/.test(node.textContent) && inlineElems.has(nextTo)) {
          padding = node.textContent.match(/^\s+/)[0];
        }
        node.textContent = padding + node.textContent.replace(replacer, "");
        return replacer;
      }, new RegExp(`^ {1,${chop}}`, "gm"));
    // deal with pre elements... we can chop whitespace from their siblings
    const endsWithSpace = new RegExp(`\\ {${chop}}$`, "gm");
    Array.from(doc.querySelectorAll("pre"))
      .map(elem => elem.previousSibling)
      .filter(isTextNode)
      .reduce((chop, node) => {
        if (endsWithSpace.test(node.textContent)) {
          node.textContent = node.textContent.substr(
            0,
            node.textContent.length - chop
          );
        }
        return chop;
      }, chop);
  }
  const wrap = document.createElement("body");
  wrap.append(doc);
  const result = endsWithSpace.test(wrap.innerHTML)
    ? `${wrap.innerHTML.trimRight()}\n`
    : wrap.innerHTML;
  return result;
}

/**
 * @param {string} text
 */
function markdownToHtml(text) {
  const normalizedLeftPad = normalizePadding(text);
  // As markdown is pulled from HTML, > and & are already escaped and
  // so blockquotes aren't picked up by the parser. This fixes it.
  const potentialMarkdown = normalizedLeftPad
    .replace(gtEntity, ">")
    .replace(ampEntity, "&");
  // @ts-ignore
  const result = marked$1(potentialMarkdown, {
    sanitize: false,
    gfm: true,
    headerIds: false,
    langPrefix: "",
    renderer: new Renderer(),
  });
  return result;
}

/**
 * @param {string} selector
 * @return {(el: Element) => Element[]}
 */
function convertElements(selector) {
  return element => {
    const elements = element.querySelectorAll(selector);
    elements.forEach(convertElement);
    return Array.from(elements);
  };
}

/**
 * @param {Element} element
 */
function convertElement(element) {
  element.innerHTML = markdownToHtml(element.innerHTML);
}

/**
 * @param {HTMLElement} element
 * @param {string} selector
 */
function enableBlockLevelMarkdown(element, selector) {
  /** @type {NodeListOf<HTMLElement>} */
  const elements = element.querySelectorAll(selector);
  for (const element of elements) {
    // Double newlines are needed to be parsed as Markdown
    if (!element.innerHTML.match(/^\n\s*\n/)) {
      element.prepend("\n\n");
    }
  }
}

class Builder {
  constructor(doc) {
    this.doc = doc;
    this.root = doc.createDocumentFragment();
    this.stack = [this.root];
    this.current = this.root;
  }
  findPosition(header) {
    return parseInt(header.tagName.charAt(1), 10);
  }
  findParent(position) {
    let parent;
    while (position > 0) {
      position--;
      parent = this.stack[position];
      if (parent) return parent;
    }
  }
  findHeader({ firstChild: node }) {
    while (node) {
      if (/H[1-6]/.test(node.tagName)) {
        return node;
      }
      node = node.nextSibling;
    }
    return null;
  }

  addHeader(header) {
    const section = this.doc.createElement("section");
    const position = this.findPosition(header);

    section.appendChild(header);
    this.findParent(position).appendChild(section);
    this.stack[position] = section;
    this.stack.length = position + 1;
    this.current = section;
  }

  addSection(node, process) {
    const header = this.findHeader(node);
    const position = header ? this.findPosition(header) : 1;
    const parent = this.findParent(position);

    if (header) {
      node.removeChild(header);
    }

    node.appendChild(process(node));

    if (header) {
      node.prepend(header);
    }

    parent.appendChild(node);
    this.current = parent;
  }

  addElement(node) {
    this.current.appendChild(node);
  }
}

function structure(fragment, doc) {
  function process(root) {
    const stack = new Builder(doc);
    while (root.firstChild) {
      const node = root.firstChild;
      if (node.nodeType !== Node.ELEMENT_NODE) {
        root.removeChild(node);
        continue;
      }
      switch (node.localName) {
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          stack.addHeader(node);
          break;
        case "section":
          stack.addSection(node, process);
          break;
        default:
          stack.addElement(node);
      }
    }
    return stack.root;
  }
  return process(fragment);
}

/**
 * @param {Iterable<Element>} elements
 */
function substituteWithTextNodes(elements) {
  Array.from(elements).forEach(element => {
    element.replaceWith(element.textContent);
  });
}

const processMDSections = convertElements("[data-format='markdown']:not(body)");
const blockLevelElements =
  "[data-format=markdown], section, div, address, article, aside, figure, header, main";

function run$1(conf) {
  const hasMDSections = !!document.querySelector(
    "[data-format=markdown]:not(body)"
  );
  const isMDFormat = conf.format === "markdown";
  if (!isMDFormat && !hasMDSections) {
    return; // Nothing to be done
  }
  // Only has markdown-format sections
  if (!isMDFormat) {
    processMDSections(document.body)
      .map(elem => {
        const structuredInternals = structure(elem, elem.ownerDocument);
        return {
          structuredInternals,
          elem,
        };
      })
      .forEach(({ elem, structuredInternals }) => {
        elem.setAttribute("aria-busy", "true");
        if (
          structuredInternals.firstElementChild.localName === "section" &&
          elem.localName === "section"
        ) {
          const section = structuredInternals.firstElementChild;
          section.remove();
          elem.append(...section.childNodes);
        } else {
          elem.textContent = "";
        }
        elem.appendChild(structuredInternals);
        elem.setAttribute("aria-busy", "false");
      });
    return;
  }
  // We transplant the UI to do the markdown processing
  const rsUI = document.getElementById("respec-ui");
  rsUI.remove();
  // The new body will replace the old body
  const newBody = document.body.cloneNode(true);
  // Marked expects markdown be flush against the left margin
  // so we need to normalize the inner text of some block
  // elements.
  enableBlockLevelMarkdown(newBody, blockLevelElements);
  convertElement(newBody);
  // Remove links where class .nolinks
  substituteWithTextNodes(newBody.querySelectorAll(".nolinks a[href]"));
  // Restructure the document properly
  const fragment = structure(newBody, document);
  // Frankenstein the whole thing back together
  newBody.append(rsUI, fragment);
  document.body.replaceWith(newBody);
}

var markdown = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$3,
  markdownToHtml: markdownToHtml,
  run: run$1
});

/**
 * www.openjs.com/scripts/events/keyboard_shortcuts/
 * Version : 2.01.B
 * By Binny V A
 * License : BSD
 */
var shortcut = {
  all_shortcuts: {}, //All the shortcuts are stored in this array
  add: function(shortcut_combination, callback, opt) {
    //Provide a set of default options
    var default_options = {
      type: "keydown",
      propagate: false,
      disable_in_input: false,
      target: document,
      keycode: false,
    };
    if (!opt) {
      opt = default_options;
    } else {
      for (var dfo in default_options) {
        if (typeof opt[dfo] == "undefined") opt[dfo] = default_options[dfo];
      }
    }

    var ele = opt.target;
    if (typeof opt.target == "string")
      ele = document.getElementById(opt.target);
    shortcut_combination = shortcut_combination.toLowerCase();

    //The function to be called at keypress
    var func = function(e) {
      var code;
      e = e || window.event;

      if (opt["disable_in_input"]) {
        //Don't enable shortcut keys in Input, Textarea fields
        var element;
        if (e.target) element = e.target;
        else if (e.srcElement) element = e.srcElement;
        if (element.nodeType == 3) element = element.parentNode;

        if (element.tagName == "INPUT" || element.tagName == "TEXTAREA") return;
      }

      //Find Which key is pressed
      if (e.keyCode) code = e.keyCode;
      else if (e.which) code = e.which;
      var character = String.fromCharCode(code).toLowerCase();

      if (code == 188) character = ","; //If the user presses , when the type is onkeydown
      if (code == 190) character = "."; //If the user presses , when the type is onkeydown

      var keys = shortcut_combination.split("+");
      //Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
      var kp = 0;

      //Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
      var shift_nums = {
        "`": "~",
        "1": "!",
        "2": "@",
        "3": "#",
        "4": "$",
        "5": "%",
        "6": "^",
        "7": "&",
        "8": "*",
        "9": "(",
        "0": ")",
        "-": "_",
        "=": "+",
        ";": ":",
        "'": '"',
        ",": "<",
        ".": ">",
        "/": "?",
        "\\": "|",
      };
      //Special Keys - and their codes
      var special_keys = {
        esc: 27,
        escape: 27,
        tab: 9,
        space: 32,
        return: 13,
        enter: 13,
        backspace: 8,

        scrolllock: 145,
        scroll_lock: 145,
        scroll: 145,
        capslock: 20,
        caps_lock: 20,
        caps: 20,
        numlock: 144,
        num_lock: 144,
        num: 144,

        pause: 19,
        break: 19,

        insert: 45,
        home: 36,
        delete: 46,
        end: 35,

        pageup: 33,
        page_up: 33,
        pu: 33,

        pagedown: 34,
        page_down: 34,
        pd: 34,

        left: 37,
        up: 38,
        right: 39,
        down: 40,

        f1: 112,
        f2: 113,
        f3: 114,
        f4: 115,
        f5: 116,
        f6: 117,
        f7: 118,
        f8: 119,
        f9: 120,
        f10: 121,
        f11: 122,
        f12: 123,
      };

      var modifiers = {
        shift: { wanted: false, pressed: false },
        ctrl: { wanted: false, pressed: false },
        alt: { wanted: false, pressed: false },
        meta: { wanted: false, pressed: false }, //Meta is Mac specific
      };

      if (e.ctrlKey) modifiers.ctrl.pressed = true;
      if (e.shiftKey) modifiers.shift.pressed = true;
      if (e.altKey) modifiers.alt.pressed = true;
      if (e.metaKey) modifiers.meta.pressed = true;

      for (var i = 0, k; (k = keys[i]), i < keys.length; i++) {
        //Modifiers
        if (k == "ctrl" || k == "control") {
          kp++;
          modifiers.ctrl.wanted = true;
        } else if (k == "shift") {
          kp++;
          modifiers.shift.wanted = true;
        } else if (k == "alt") {
          kp++;
          modifiers.alt.wanted = true;
        } else if (k == "meta") {
          kp++;
          modifiers.meta.wanted = true;
        } else if (k.length > 1) {
          //If it is a special key
          if (special_keys[k] == code) kp++;
        } else if (opt["keycode"]) {
          if (opt["keycode"] == code) kp++;
        } else {
          //The special keys did not match
          if (character == k) kp++;
          else {
            if (shift_nums[character] && e.shiftKey) {
              //Stupid Shift key bug created by using lowercase
              character = shift_nums[character];
              if (character == k) kp++;
            }
          }
        }
      }

      if (
        kp == keys.length &&
        modifiers.ctrl.pressed == modifiers.ctrl.wanted &&
        modifiers.shift.pressed == modifiers.shift.wanted &&
        modifiers.alt.pressed == modifiers.alt.wanted &&
        modifiers.meta.pressed == modifiers.meta.wanted
      ) {
        callback(e);

        if (!opt["propagate"]) {
          //Stop the event
          //e.cancelBubble is supported by IE - this will kill the bubbling process.
          e.cancelBubble = true;
          e.returnValue = false;

          //e.stopPropagation works in Firefox.
          if (e.stopPropagation) {
            e.stopPropagation();
            e.preventDefault();
          }
          return false;
        }
      }
    };
    this.all_shortcuts[shortcut_combination] = {
      callback: func,
      target: ele,
      event: opt["type"],
    };
    //Attach the function with the event
    if (ele.addEventListener) ele.addEventListener(opt["type"], func, false);
    else if (ele.attachEvent) ele.attachEvent("on" + opt["type"], func);
    else ele["on" + opt["type"]] = func;
  },

  //Remove the shortcut - just specify the shortcut and I will remove the binding
  // 'remove':function(shortcut_combination) {
  //  shortcut_combination = shortcut_combination.toLowerCase();
  //  var binding = this.all_shortcuts[shortcut_combination];
  //  delete(this.all_shortcuts[shortcut_combination])
  //  if(!binding) return;
  //  var type = binding['event'];
  //  var ele = binding['target'];
  //  var callback = binding['callback'];
  //
  //  if(ele.detachEvent) ele.detachEvent('on'+type, callback);
  //  else if(ele.removeEventListener) ele.removeEventListener(type, callback, false);
  //  else ele['on'+type] = false;
  // }
};

// @ts-check
const name$4 = "core/ui";

// Opportunistically inserts the style, with the chance to reduce some FOUC
insertStyle();

async function loadStyle() {
  try {
    return (await Promise.resolve().then(function () { return ui$3; })).default;
  } catch {
    return fetchAsset("ui.css");
  }
}

async function insertStyle() {
  const styleElement = document.createElement("style");
  styleElement.id = "respec-ui-styles";
  styleElement.textContent = await loadStyle();
  styleElement.classList.add("removeOnSave");
  document.head.appendChild(styleElement);
  return styleElement;
}

function ariaDecorate(elem, ariaMap) {
  if (!elem) {
    return;
  }
  Array.from(ariaMap).forEach(([name, value]) => {
    elem.setAttribute(`aria-${name}`, value);
  });
}

const respecUI = hyperHTML$1`<div id='respec-ui' class='removeOnSave' hidden></div>`;
const menu = hyperHTML$1`<ul id=respec-menu role=menu aria-labelledby='respec-pill' hidden></ul>`;
let modal;
let overlay;
const errors = [];
const warnings = [];
const buttons = {};

sub("start-all", () => document.body.prepend(respecUI), { once: true });
sub("end-all", () => document.body.prepend(respecUI), { once: true });

const respecPill = hyperHTML$1`<button id='respec-pill' disabled>ReSpec</button>`;
respecUI.appendChild(respecPill);
respecPill.addEventListener("click", e => {
  e.stopPropagation();
  if (menu.hidden) {
    menu.classList.remove("respec-hidden");
    menu.classList.add("respec-visible");
  } else {
    menu.classList.add("respec-hidden");
    menu.classList.remove("respec-visible");
  }
  respecPill.setAttribute("aria-expanded", String(menu.hidden));
  menu.hidden = !menu.hidden;
});
document.documentElement.addEventListener("click", () => {
  if (!menu.hidden) {
    menu.classList.remove("respec-visible");
    menu.classList.add("respec-hidden");
    menu.hidden = true;
  }
});
respecUI.appendChild(menu);

const ariaMap = new Map([
  ["controls", "respec-menu"],
  ["expanded", "false"],
  ["haspopup", "true"],
  ["label", "ReSpec Menu"],
]);
ariaDecorate(respecPill, ariaMap);

function errWarn(msg, arr, butName, title) {
  arr.push(msg);
  if (!buttons.hasOwnProperty(butName)) {
    buttons[butName] = createWarnButton(butName, arr, title);
    respecUI.appendChild(buttons[butName]);
  }
  const button = buttons[butName];
  button.textContent = arr.length;
  const label = arr.length === 1 ? pluralize$1.singular(title) : title;
  const ariaMap = new Map([["label", `${arr.length} ${label}`]]);
  ariaDecorate(button, ariaMap);
}

function createWarnButton(butName, arr, title) {
  const buttonId = `respec-pill-${butName}`;
  const button = hyperHTML$1`<button id='${buttonId}' class='respec-info-button'>`;
  button.addEventListener("click", () => {
    button.setAttribute("aria-expanded", "true");
    const ol = hyperHTML$1`<ol class='${`respec-${butName}-list`}'></ol>`;
    for (const err of arr) {
      const fragment = document
        .createRange()
        .createContextualFragment(markdownToHtml(err));
      const li = document.createElement("li");
      // if it's only a single element, just copy the contents into li
      if (fragment.firstElementChild === fragment.lastElementChild) {
        li.append(...fragment.firstElementChild.childNodes);
        // Otherwise, take everything.
      } else {
        li.appendChild(fragment);
      }
      ol.appendChild(li);
    }
    ui.freshModal(title, ol, button);
  });
  const ariaMap = new Map([
    ["expanded", "false"],
    ["haspopup", "true"],
    ["controls", `respec-pill-${butName}-modal`],
  ]);
  ariaDecorate(button, ariaMap);
  return button;
}

const ui = {
  show() {
    try {
      respecUI.hidden = false;
    } catch (err) {
      console.error(err);
    }
  },
  hide() {
    respecUI.hidden = true;
  },
  enable() {
    respecPill.removeAttribute("disabled");
  },
  addCommand(label, handler, keyShort, icon) {
    icon = icon || "";
    const id = `respec-button-${label.toLowerCase().replace(/\s+/, "-")}`;
    const button = hyperHTML$1`<button id="${id}" class="respec-option" title="${keyShort}">
      <span class="respec-cmd-icon" aria-hidden="true">${icon}</span> ${label}…
    </button>`;
    const menuItem = hyperHTML$1`<li role=menuitem>${button}</li>`;
    menuItem.addEventListener("click", handler);
    menu.appendChild(menuItem);
    if (keyShort) shortcut.add(keyShort, handler);
    return button;
  },
  error(msg) {
    errWarn(msg, errors, "error", "ReSpec Errors");
  },
  warning(msg) {
    errWarn(msg, warnings, "warning", "ReSpec Warnings");
  },
  closeModal(owner) {
    if (overlay) {
      overlay.classList.remove("respec-show-overlay");
      overlay.classList.add("respec-hide-overlay");
      overlay.addEventListener("transitionend", () => {
        overlay.remove();
        overlay = null;
      });
    }
    if (owner) {
      owner.setAttribute("aria-expanded", "false");
    }
    if (!modal) return;
    modal.remove();
    modal = null;
  },
  freshModal(title, content, currentOwner) {
    if (modal) modal.remove();
    if (overlay) overlay.remove();
    overlay = hyperHTML$1`<div id='respec-overlay' class='removeOnSave'></div>`;
    const id = `${currentOwner.id}-modal`;
    const headingId = `${id}-heading`;
    modal = hyperHTML$1`<div id='${id}' class='respec-modal removeOnSave' role='dialog'>
      <h3 id="${headingId}">${title}</h3>
      <div class='inside'>${content}</div>
    </div>`;
    const ariaMap = new Map([["labelledby", headingId]]);
    ariaDecorate(modal, ariaMap);
    document.body.append(overlay, modal);
    overlay.addEventListener("click", () => this.closeModal(currentOwner));
    overlay.classList.toggle("respec-show-overlay");
    modal.hidden = false;
  },
};
shortcut.add("Esc", () => ui.closeModal());
shortcut.add("Ctrl+Alt+Shift+E", () => {
  if (buttons.error) buttons.error.click();
});
shortcut.add("Ctrl+Alt+Shift+W", () => {
  if (buttons.warning) buttons.warning.click();
});
window.respecUI = ui;
sub("error", details => ui.error(details));
sub("warn", details => ui.warning(details));

var ui$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$4,
  ui: ui
});

// @ts-check
/**
 * Removes common indents across the IDL texts,
 * so that indentation inside <pre> won't affect the rendered result.
 * @param {string} text IDL text
 */

const name$5 = "core/reindent";

/**
 * @param {string} text
 */
function reindent(text) {
  if (!text) {
    return text;
  }
  // TODO: use trimEnd when Edge supports it
  const lines = text.trimRight().split("\n");
  while (lines.length && !lines[0].trim()) {
    lines.shift();
  }
  const indents = lines.filter(s => s.trim()).map(s => s.search(/[^\s]/));
  const leastIndent = Math.min(...indents);
  return lines.map(s => s.slice(leastIndent)).join("\n");
}

function run$2() {
  for (const pre of document.getElementsByTagName("pre")) {
    pre.innerHTML = reindent(pre.innerHTML);
  }
}

var reindent$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$5,
  run: run$2
});

// @ts-check
const name$6 = "core/location-hash";

function run$3() {
  // Added message for legacy compat with Aria specs
  // See https://github.com/w3c/respec/issues/793
  pub("start", "core/location-hash");
  if (!location.hash) {
    return;
  }
  document.respecIsReady.then(() => {
    let hash = decodeURIComponent(location.hash).substr(1);
    const hasLink = document.getElementById(hash);
    const isLegacyFrag = /\W/.test(hash);
    // Allow some degree of recovery for legacy fragments format.
    // See https://github.com/w3c/respec/issues/1353
    if (!hasLink && isLegacyFrag) {
      const id = hash
        .replace(/[\W]+/gim, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
      if (document.getElementById(id)) {
        hash = id;
      }
    }
    location.hash = `#${hash}`;
  });
}

var locationHash = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$6,
  run: run$3
});

// @ts-check
/**
 * @typedef {object} LinterResult
 * @property {string} description
 * @property {string} help
 * @property {string} howToFix
 * @property {string} name
 * @property {number} occurrences
 * @property {HTMLElement[]} offendingElements
 *
 * @typedef {(conf: any, doc: Document) => (LinterResult | Promise<LinterResult>)} LintingFunction
 */

/** @type {WeakMap<LinterRule, { name: string, lintingFunction: LintingFunction }>} */
const privs = new WeakMap();

/**
 * Checks if the linter rule is enabled.
 *
 * @param {Object} conf ReSpec config object.
 * @param {string} name linter rule name
 */
function canLint(conf, name) {
  return !(
    conf.hasOwnProperty("lint") === false ||
    conf.lint === false ||
    !conf.lint[name]
  );
}

class LinterRule {
  /**
   *
   * @param {String} name the name of the rule
   * @param {LintingFunction} lintingFunction
   */
  constructor(name, lintingFunction) {
    privs.set(this, { name, lintingFunction });
  }
  get name() {
    return privs.get(this).name;
  }
  /**
   * Runs linter rule.
   *
   * @param {Object} conf The ReSpec config.
   * @param {Document} doc The document to be checked.
   */
  lint(conf = { lint: { [this.name]: false } }, doc = document) {
    if (canLint(conf, this.name)) {
      return privs.get(this).lintingFunction(conf, doc);
    }
  }
}

// @ts-check

const name$7 = "check-charset";
const meta = {
  en: {
    description: `Document must only contain one \`<meta>\` tag with charset set to 'utf-8'`,
    howToFix: `Add this line in your document \`<head>\` section - \`<meta charset="utf-8">\` or set charset to "utf-8" if not set already.`,
  },
};

// Fall back to english, if language is missing
const lang$1 = lang in meta ? lang : "en";

/**
 * Runs linter rule.
 *
 * @param {Object} _ The ReSpec config.
 * @param {Document} doc The document to be checked.
 */
function linterFunction(_, doc) {
  const metas = doc.querySelectorAll("meta[charset]");
  const val = [];
  for (const meta of metas) {
    val.push(
      meta
        .getAttribute("charset")
        .trim()
        .toLowerCase()
    );
  }
  const utfExists = val.includes("utf-8");

  // only a single meta[charset] and is set to utf-8, correct case
  if (utfExists && metas.length === 1) {
    return [];
  }
  // if more than one meta[charset] tag defined along with utf-8
  // or
  // no meta[charset] present in the document
  return {
    name: name$7,
    occurrences: metas.length,
    ...meta[lang$1],
  };
}
const rule = new LinterRule(name$7, linterFunction);

// @ts-check

const name$8 = "check-internal-slots";

const meta$1 = {
  en: {
    description: "Internal slots should be preceded by a '.'",
    howToFix: "Add a '.' between the elements mentioned.",
    help: "See developer console.",
  },
};

// Fall back to english, if language is missing
const lang$2 = lang in meta$1 ? lang : "en";

/**
 * Runs linter rule.
 * @param {Object} _ The ReSpec config.
 * @param {Document} doc The document to be checked.
 * @return {import("../../core/LinterRule").LinterResult}
 */
function linterFunction$1(_, doc) {
  const offendingElements = [...doc.querySelectorAll("var+a")].filter(
    ({ previousSibling: { nodeName } }) => {
      const isPrevVar = nodeName && nodeName === "VAR";
      return isPrevVar;
    }
  );

  if (!offendingElements.length) {
    return;
  }

  return {
    name: name$8,
    offendingElements,
    occurrences: offendingElements.length,
    ...meta$1[lang$2],
  };
}

const rule$1 = new LinterRule(name$8, linterFunction$1);

// @ts-check

const name$9 = "check-punctuation";
const punctuationMarks = [".", ":", "!", "?"];
const humanMarks = punctuationMarks.map(mark => `"${mark}"`).join(", ");
const meta$2 = {
  en: {
    description: "`p` elements should end with a punctuation mark.",
    howToFix: `Please make sure \`p\` elements end with one of: ${humanMarks}.`,
  },
};
// Fall back to english, if language is missing
const lang$3 = lang in meta$2 ? lang : "en";

/**
 * Runs linter rule.
 *
 * @param {Object} _ The ReSpec config.
 * @param  {Document} doc The document to be checked.
 * @return {import("../../core/LinterRule").LinterResult}
 */
function lintingFunction(_, doc) {
  // Check string ends with one of ., !, ?, :, ], or is empty.
  const punctuatingRegExp = new RegExp(
    `[${punctuationMarks.join("")}\\]]$|^ *$`,
    "m"
  );
  const offendingElements = [
    ...doc.querySelectorAll("p:not(#back-to-top)"),
  ].filter(elem => !punctuatingRegExp.test(elem.textContent.trim()));
  if (!offendingElements.length) {
    return;
  }
  return {
    name: name$9,
    offendingElements,
    occurrences: offendingElements.length,
    ...meta$2[lang$3],
  };
}
const rule$2 = new LinterRule(name$9, lintingFunction);

// @ts-check
const name$a = "core/linter";

/** @type {WeakMap<Linter, { rules: Set<import("./LinterRule").default> }>} */
const privates = new WeakMap();

class Linter {
  constructor() {
    privates.set(this, {
      rules: new Set(),
    });
  }
  get rules() {
    return privates.get(this).rules;
  }
  /**
   * @param  {...import("./LinterRule").default} newRules
   */
  register(...newRules) {
    newRules.forEach(newRule => this.rules.add(newRule));
  }
  async lint(conf, doc = window.document) {
    const promisesToLint = [...privates.get(this).rules].map(rule =>
      toLinterWarning(rule.lint(conf, doc))
    );
    await promisesToLint;
  }
}

const linter = new Linter();

const baseResult = {
  name: "unknown",
  description: "",
  occurrences: 0,
  howToFix: "",
  offendingElements: [], // DOM Nodes
  help: "", // where to get help
};

/**
 * @typedef {import("./LinterRule").LinterResult} LinterResult
 * @param {LinterResult | Promise<LinterResult>} [resultPromise]
 */
async function toLinterWarning(resultPromise) {
  const result = await resultPromise;
  if (!result) {
    return;
  }
  const output = { ...baseResult, ...result };
  const {
    description,
    help,
    howToFix,
    name,
    occurrences,
    offendingElements,
  } = output;
  const message = `Linter (${name}): ${description} ${howToFix} ${help}`;
  if (offendingElements.length) {
    showInlineWarning(offendingElements, `${message} Occured`);
  } else {
    pub("warn", `${message} (Count: ${occurrences})`);
  }
}

function run$4(conf) {
  if (conf.lint === false) {
    return; // nothing to do
  }
  // return early, continue processing other things
  (async () => {
    await document.respecIsReady;
    try {
      await linter.lint(conf, document);
    } catch (err) {
      console.error("Error ocurred while running the linter", err);
    }
  })();
}

var linter$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$a,
  'default': linter,
  run: run$4
});

// @ts-check

const name$b = "local-refs-exist";

const meta$3 = {
  en: {
    description: "Broken local reference found in document.",
    howToFix: "Please fix the links mentioned.",
    help: "See developer console.",
  },
};

// Fall back to english, if language is missing
const lang$4 = lang in meta$3 ? lang : "en";

/**
 * Runs linter rule.
 * @param {Object} _ The ReSpec config.
 * @param  {Document} doc The document to be checked.
 * @return {import("../../core/LinterRule").LinterResult}
 */
function linterFunction$2(_, doc) {
  const offendingElements = [...doc.querySelectorAll("a[href^='#']")].filter(
    isBrokenHyperlink
  );
  if (!offendingElements.length) {
    return;
  }
  return {
    name: name$b,
    offendingElements,
    occurrences: offendingElements.length,
    ...meta$3[lang$4],
  };
}

const rule$3 = new LinterRule(name$b, linterFunction$2);

function isBrokenHyperlink(elem) {
  const id = elem.getAttribute("href").substring(1);
  return !elem.ownerDocument.getElementById(id);
}

// @ts-check
const name$c = "no-headingless-sections";
const meta$4 = {
  en: {
    description: "All sections must start with a `h2-6` element.",
    howToFix: "Add a `h2-6` to the offending section or use a `<div>`.",
    help: "See developer console.",
  },
  nl: {
    description: "Alle secties moeten beginnen met een `h2-6` element.",
    howToFix:
      "Voeg een `h2-6` toe aan de conflicterende sectie of gebruik een `<div>`.",
    help: "Zie de developer console.",
  },
};

// Fall back to english, if language is missing
const lang$5 = lang in meta$4 ? lang : "en";
const hasNoHeading = ({ firstElementChild: elem }) => {
  return elem === null || /^h[1-6]$/.test(elem.localName) === false;
};

/**
 * @param {*} _
 * @param {Document} doc
 * @return {import("../../core/LinterRule").LinterResult}
 */
function linterFunction$3(_, doc) {
  const offendingElements = [...doc.querySelectorAll("section")].filter(
    hasNoHeading
  );
  if (!offendingElements.length) {
    return;
  }
  return {
    name: name$c,
    offendingElements,
    occurrences: offendingElements.length,
    ...meta$4[lang$5],
  };
}
const rule$4 = new LinterRule(name$c, linterFunction$3);

// @ts-check

const name$d = "no-http-props";

const meta$5 = {
  en: {
    description: "Insecure URLs are not allowed in `respecConfig`.",
    howToFix: "Please change the following properties to 'https://': ",
  },
};

// Fall back to english, if language is missing
const lang$6 = lang in meta$5 ? lang : "en";

/**
 * Runs linter rule.
 *
 * @param {Object} conf The ReSpec config.
 * @param {Document} doc The document to be checked.
 */
function lintingFunction$1(conf, doc) {
  // We can only really perform this check over http/https
  if (!doc.location.href.startsWith("http")) {
    return;
  }
  const offendingMembers = Object.getOwnPropertyNames(conf)
    // this check is cheap, "prevED" is w3c exception.
    .filter(key => key.endsWith("URI") || key === "prevED")
    // this check is expensive, so separate step
    .filter(key =>
      new URL(conf[key], doc.location.href).href.startsWith("http://")
    );
  if (!offendingMembers.length) {
    return;
  }
  /** @type {import("../../core/LinterRule").LinterResult} */
  const result = {
    name: name$d,
    occurrences: offendingMembers.length,
    ...meta$5[lang$6],
  };
  result.howToFix += `${offendingMembers
    .map(item => `\`${item}\``)
    .join(", ")}.`;
  return result;
}

const rule$5 = new LinterRule(name$d, lintingFunction$1);

// @ts-check
const name$e = "privsec-section";
const meta$6 = {
  en: {
    description:
      "Document must a 'Privacy and/or Security' Considerations section.",
    howToFix: "Add a privacy and/or security considerations section.",
    help:
      "See the [Self-Review Questionnaire](https://w3ctag.github.io/security-questionnaire/).",
  },
};

// Fall back to english, if language is missing
const lang$7 = lang in meta$6 ? lang : "en";

function hasPriSecConsiderations(doc) {
  return Array.from(doc.querySelectorAll("h2, h3, h4, h5, h6")).some(
    ({ textContent: text }) => {
      const saysPrivOrSec = /(privacy|security)/im.test(text);
      const saysConsiderations = /(considerations)/im.test(text);
      return (saysPrivOrSec && saysConsiderations) || saysPrivOrSec;
    }
  );
}

/**
 * @param {*} conf
 * @param {Document} doc
 * @return {import("../LinterRule").LinterResult}
 */
function lintingFunction$2(conf, doc) {
  if (conf.isRecTrack && !hasPriSecConsiderations(doc)) {
    return { name: name$e, occurrences: 1, ...meta$6[lang$7] };
  }
}

const rule$6 = new LinterRule(name$e, lintingFunction$2);

// @ts-check

linter.register(
  rule$5,
  rule$4,
  rule$2,
  rule$3,
  rule$1,
  rule,
  rule$6
);

const coreDefaults = {
  lint: {
    "no-headingless-sections": true,
    "no-http-props": true,
    "check-punctuation": false,
    "local-refs-exist": true,
    "check-internal-slots": false,
    "check-charset": false,
    "privsec-section": false,
  },
  pluralize: false,
  specStatus: "base",
  highlightVars: true,
  addSectionLinks: true,
};

// @ts-check

/** @type {Record<string, HTMLElement[]>} */
const definitionMap = Object.create(null);

/**
 * @param {HTMLElement} dfn A definition element to register
 * @param {string[]} names Names to register the element by
 */
function registerDefinition(dfn, names) {
  for (const name of names.map(name => name.toLowerCase())) {
    if (name in definitionMap === false) {
      definitionMap[name] = [dfn];
    } else if (!definitionMap[name].includes(dfn)) {
      definitionMap[name].push(dfn);
    }
  }
}

// @ts-check

const name$f = "wpt-tests-exist";

const meta$7 = {
  en: {
    description: "Non-existent Web Platform Tests",
    howToFix: "Please fix the tests mentioned.",
    help: "See developer console.",
  },
};

const lang$8 = lang in meta$7 ? lang : "en";

/**
 * Runs linter rule.
 * @param {Object} conf The ReSpec config.
 * @param  {Document} doc The document to be checked.
 * @return {Promise<import("../LinterRule").LinterResult>}
 */
async function linterFunction$4(conf, doc) {
  const filesInWPT = await getFilesInWPT(conf.testSuiteURI, conf.githubAPI);
  if (!filesInWPT) {
    return;
  }

  const offendingElements = [];
  const offendingTests = new Set();

  /** @type {NodeListOf<HTMLElement>} */
  const elems = doc.querySelectorAll("[data-tests]");
  const testables = [...elems].filter(elem => elem.dataset.tests);

  for (const elem of testables) {
    const tests = elem.dataset.tests
      .split(/,/gm)
      .map(test => test.trim().split("#")[0])
      .filter(test => test);

    const missingTests = tests.filter(test => !filesInWPT.has(test));
    if (missingTests.length) {
      offendingElements.push(elem);
      missingTests.forEach(test => offendingTests.add(test));
    }
  }

  if (!offendingElements.length) {
    return;
  }

  const missingTests = [...offendingTests].map(test => `\`${test}\``);
  return {
    name: name$f,
    offendingElements,
    occurrences: offendingElements.length,
    ...meta$7[lang$8],
    description: `${meta$7[lang$8].description}: ${missingTests.join(", ")}.`,
  };
}

const rule$7 = new LinterRule(name$f, linterFunction$4);

/**
 * @param {string} testSuiteURI
 * @param {string} githubAPIBase
 */
async function getFilesInWPT(testSuiteURI, githubAPIBase) {
  let wptDirectory;
  try {
    const testSuiteURL = new URL(testSuiteURI);
    if (testSuiteURL.pathname.startsWith("/web-platform-tests/wpt/")) {
      const re = /web-platform-tests\/wpt\/(.+)/;
      wptDirectory = testSuiteURL.pathname.match(re)[1].replace(/\//g, "");
    } else {
      wptDirectory = testSuiteURL.pathname.replace(/\//g, "");
    }
  } catch (error) {
    const msg = "Failed to parse WPT directory from testSuiteURI";
    pub("warn", msg);
    console.error(error);
    return null;
  }

  const url = new URL("web-platform-tests/wpt/files", `${githubAPIBase}/`);
  url.searchParams.set("path", wptDirectory);

  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.text();
    const msg =
      "Failed to fetch files from WPT repository. " +
      `Request failed with error: ${error} (${response.status})`;
    pub("warn", msg);
    return null;
  }
  /** @type {{ entries: string[] }} */
  const { entries } = await response.json();
  const files = entries.filter(entry => !entry.endsWith("/"));
  return new Set(files);
}

// @ts-check
/**
 * Sets the defaults for W3C specs
 */
const name$g = "w3c/defaults";

linter.register(rule$6, rule$7);

const w3cDefaults = {
  lint: {
    "privsec-section": true,
    "wpt-tests-exist": false,
  },
  pluralize: true,
  doJsonLd: false,
  license: "w3c-software-doc",
  logos: [
    {
      src: "https://www.w3.org/StyleSheets/TR/2016/logos/W3C",
      alt: "W3C",
      height: 48,
      width: 72,
      url: "https://www.w3.org/",
    },
  ],
  xref: true,
};

function run$5(conf) {
  if (conf.specStatus === "unofficial") return;
  // assign the defaults
  const lint =
    conf.lint === false
      ? false
      : {
          ...coreDefaults.lint,
          ...w3cDefaults.lint,
          ...conf.lint,
        };
  Object.assign(conf, {
    ...coreDefaults,
    ...w3cDefaults,
    ...conf,
    lint,
  });

  // TODO: eventually, we want to remove this.
  // It's here for legacy support of json-ld specs
  // see https://github.com/w3c/respec/issues/2019
  Object.assign(conf, { definitionMap });
}

var defaults$6 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$g,
  run: run$5
});

// @ts-check
const name$h = "core/style";

// Opportunistically inserts the style, with the chance to reduce some FOUC
const styleElement = insertStyle$1();

async function loadStyle$1() {
  try {
    return (await Promise.resolve().then(function () { return respec$1; })).default;
  } catch {
    return fetchAsset("respec.css");
  }
}

async function insertStyle$1() {
  const styleElement = document.createElement("style");
  styleElement.id = "respec-mainstyle";
  styleElement.textContent = await loadStyle$1();
  document.head.appendChild(styleElement);
  return styleElement;
}

async function run$6(conf) {
  if (conf.noReSpecCSS) {
    (await styleElement).remove();
  }
}

var style = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$h,
  run: run$6
});

// @ts-check
const name$i = "w3c/style";
function attachFixupScript(doc, version) {
  const script = doc.createElement("script");
  if (location.hash) {
    script.addEventListener(
      "load",
      () => {
        window.location.href = location.hash;
      },
      { once: true }
    );
  }
  script.src = `https://www.w3.org/scripts/TR/${version}/fixup.js`;
  doc.body.appendChild(script);
}

/**
 * Make a best effort to attach meta viewport at the top of the head.
 * Other plugins might subsequently push it down, but at least we start
 * at the right place. When ReSpec exports the HTML, it again moves the
 * meta viewport to the top of the head - so to make sure it's the first
 * thing the browser sees. See js/ui/save-html.js.
 */
function createMetaViewport() {
  const meta = document.createElement("meta");
  meta.name = "viewport";
  const contentProps = {
    width: "device-width",
    "initial-scale": "1",
    "shrink-to-fit": "no",
  };
  meta.content = toKeyValuePairs(contentProps).replace(/"/g, "");
  return meta;
}

function createBaseStyle() {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://www.w3.org/StyleSheets/TR/2016/base.css";
  link.classList.add("removeOnSave");
  return link;
}

function selectStyleVersion(styleVersion) {
  let version = "";
  switch (styleVersion) {
    case null:
    case true:
      version = "2016";
      break;
    default:
      if (styleVersion && !isNaN(styleVersion)) {
        version = styleVersion.toString().trim();
      }
  }
  return version;
}

function createResourceHints() {
  const resourceHints = [
    {
      hint: "preconnect", // for W3C styles and scripts.
      href: "https://www.w3.org",
    },
    {
      hint: "preload", // all specs need it, and we attach it on end-all.
      href: "https://www.w3.org/scripts/TR/2016/fixup.js",
      as: "script",
    },
    {
      hint: "preload", // all specs include on base.css.
      href: "https://www.w3.org/StyleSheets/TR/2016/base.css",
      as: "style",
    },
    {
      hint: "preload", // all specs show the logo.
      href: "https://www.w3.org/StyleSheets/TR/2016/logos/W3C",
      as: "image",
    },
  ]
    .map(createResourceHint)
    .reduce((frag, link) => {
      frag.appendChild(link);
      return frag;
    }, document.createDocumentFragment());
  return resourceHints;
}
// Collect elements for insertion (document fragment)
const elements = createResourceHints();

// Opportunistically apply base style
elements.appendChild(createBaseStyle());
if (!document.head.querySelector("meta[name=viewport]")) {
  // Make meta viewport the first element in the head.
  elements.prepend(createMetaViewport());
}

document.head.prepend(elements);

function styleMover(linkURL) {
  return exportDoc => {
    const w3cStyle = exportDoc.querySelector(`head link[href="${linkURL}"]`);
    exportDoc.querySelector("head").append(w3cStyle);
  };
}

function run$7(conf) {
  if (!conf.specStatus) {
    const warn = "`respecConfig.specStatus` missing. Defaulting to 'base'.";
    conf.specStatus = "base";
    pub("warn", warn);
  }

  let styleFile = "W3C-";

  // Figure out which style file to use.
  switch (conf.specStatus.toUpperCase()) {
    case "CG-DRAFT":
    case "CG-FINAL":
    case "BG-DRAFT":
    case "BG-FINAL":
      styleFile = conf.specStatus.toLowerCase();
      break;
    case "FPWD":
    case "LC":
    case "WD-NOTE":
    case "LC-NOTE":
      styleFile += "WD";
      break;
    case "WG-NOTE":
    case "FPWD-NOTE":
      styleFile += "WG-NOTE.css";
      break;
    case "UNOFFICIAL":
      styleFile += "UD";
      break;
    case "FINDING":
    case "FINDING-DRAFT":
    case "BASE":
      styleFile = "base.css";
      break;
    default:
      styleFile += conf.specStatus;
  }

  // Select between released styles and experimental style.
  const version = selectStyleVersion(conf.useExperimentalStyles || "2016");
  // Attach W3C fixup script after we are done.
  if (version && !conf.noToc) {
    sub(
      "end-all",
      () => {
        attachFixupScript(document, version);
      },
      { once: true }
    );
  }
  const finalVersionPath = version ? `${version}/` : "";
  const finalStyleURL = `https://www.w3.org/StyleSheets/TR/${finalVersionPath}${styleFile}`;
  linkCSS(document, finalStyleURL);
  // Make sure the W3C stylesheet is the last stylesheet, as required by W3C Pub Rules.
  const moveStyle = styleMover(finalStyleURL);
  sub("beforesave", moveStyle);
}

var style$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$i,
  run: run$7
});

// @ts-check
const name$j = "w3c/l10n";
const additions = {
  en: {
    status_at_publication:
      "This section describes the status of this document at the time of its publication. Other documents may supersede this document. A list of current W3C publications and the latest revision of this technical report can be found in the <a href='https://www.w3.org/TR/'>W3C technical reports index</a> at https://www.w3.org/TR/.",
  },
  ko: {
    status_at_publication:
      "This section describes the status of this document at the time of its publication. Other documents may supersede this document. A list of current W3C publications and the latest revision of this technical report can be found in the <a href='https://www.w3.org/TR/'>W3C technical reports index</a> at https://www.w3.org/TR/.",
  },
  zh: {
    status_at_publication:
      "本章节描述了本文档的发布状态。其它更新版本可能会覆盖本文档。W3C的文档列 表和最新版本可通过<a href='https://www.w3.org/TR/'>W3C技术报告</a>索引访问。",
  },
  ja: {
    status_at_publication:
      "この節には、公開時点でのこの文書の位置づけが記されている。他の文書によって置き換えられる可能性がある。現時点でのW3Cの発行文書とこのテクニカルレポートの最新版は、下記から参照できる。 <a href='https://www.w3.org/TR/'>W3C technical reports index</a> (https://www.w3.org/TR/)",
  },
  nl: {
    status_at_publication:
      "This section describes the status of this document at the time of its publication. Other documents may supersede this document. A list of current W3C publications and the latest revision of this technical report can be found in the <a href='https://www.w3.org/TR/'>W3C technical reports index</a> at https://www.w3.org/TR/.",
  },
  es: {
    status_at_publication:
      "Esta sección describe el estado del presente documento al momento de su publicación. El presente documento puede ser remplazado por otros. Una lista de las publicaciones actuales del W3C y la última revisión del presente informe técnico puede hallarse en http://www.w3.org/TR/ <a href='https://www.w3.org/TR/'>el índice de informes técnicos</a> del W3C.",
  },
};

Object.keys(additions).forEach(key => {
  Object.assign(l10n[key], additions[key]);
});

var l10n$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$j
});

// @ts-check
const name$k = "core/github";

let resolveGithubPromise;
let rejectGithubPromise;
/** @type {Promise<{ apiBase: string, fullName: string, branch: string, repoURL: string } | null>} */
const github = new Promise((resolve, reject) => {
  resolveGithubPromise = resolve;
  rejectGithubPromise = message => {
    pub("error", message);
    reject(new Error(message));
  };
});

const localizationStrings = {
  en: {
    file_a_bug: "File a bug",
    participate: "Participate",
    commit_history: "Commit history",
  },
  nl: {
    commit_history: "Revisiehistorie",
    file_a_bug: "Dien een melding in",
    participate: "Doe mee",
  },
  es: {
    commit_history: "Historia de cambios",
    file_a_bug: "Nota un bug",
    participate: "Participe",
  },
};
const l10n$3 = getIntlData(localizationStrings);

async function run$8(conf) {
  if (!conf.hasOwnProperty("github") || !conf.github) {
    // nothing to do, bail out.
    resolveGithubPromise(null);
    return;
  }
  if (
    typeof conf.github === "object" &&
    !conf.github.hasOwnProperty("repoURL")
  ) {
    const msg =
      "Config option `[github](https://github.com/w3c/respec/wiki/github)` " +
      "is missing property `repoURL`.";
    rejectGithubPromise(msg);
    return;
  }
  let tempURL = conf.github.repoURL || conf.github;
  if (!tempURL.endsWith("/")) tempURL += "/";
  let ghURL;
  try {
    ghURL = new URL(tempURL, "https://github.com");
  } catch {
    const msg = `\`respecConf.github\` is not a valid URL? (${ghURL})`;
    rejectGithubPromise(msg);
    return;
  }
  if (ghURL.origin !== "https://github.com") {
    const msg = `\`respecConf.github\` must be HTTPS and pointing to GitHub. (${ghURL})`;
    rejectGithubPromise(msg);
    return;
  }
  const [org, repo] = ghURL.pathname.split("/").filter(item => item);
  if (!org || !repo) {
    const msg =
      "`respecConf.github` URL needs a path with, for example, w3c/my-spec";
    rejectGithubPromise(msg);
    return;
  }
  const branch = conf.github.branch || "gh-pages";
  const issueBase = new URL("./issues/", ghURL).href;
  const newProps = {
    edDraftURI: `https://${org.toLowerCase()}.github.io/${repo}/`,
    githubToken: undefined,
    githubUser: undefined,
    issueBase,
    atRiskBase: issueBase,
    otherLinks: [],
    pullBase: new URL("./pulls/", ghURL).href,
    shortName: repo,
  };
  const otherLink = {
    key: l10n$3.participate,
    data: [
      {
        value: `GitHub ${org}/${repo}`,
        href: ghURL,
      },
      {
        value: l10n$3.file_a_bug,
        href: newProps.issueBase,
      },
      {
        value: l10n$3.commit_history,
        href: new URL(`./commits/${branch}`, ghURL.href).href,
      },
      {
        value: "Pull requests",
        href: newProps.pullBase,
      },
    ],
  };
  // Assign new properties, but retain existing ones
  let githubAPI = "https://respec.org/github";
  if (conf.githubAPI) {
    if (new URL(conf.githubAPI).hostname === window.parent.location.hostname) {
      // for testing
      githubAPI = conf.githubAPI;
    } else {
      const msg = "`respecConfig.githubAPI` should not be added manually.";
      pub("warn", msg);
    }
  }
  const normalizedGHObj = {
    branch,
    repoURL: ghURL.href,
    apiBase: githubAPI,
    fullName: `${org}/${repo}`,
  };
  resolveGithubPromise(normalizedGHObj);

  const normalizedConfig = {
    ...newProps,
    ...conf,
    github: normalizedGHObj,
    githubAPI,
  };
  Object.assign(conf, normalizedConfig);
  conf.otherLinks.unshift(otherLink);
}

var github$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$k,
  github: github,
  run: run$8
});

// @ts-check

const name$l = "core/data-include";

function processResponse(rawData, id, url) {
  /** @type {HTMLElement} */
  const el = document.querySelector(`[data-include-id=${id}]`);
  const doc = el.ownerDocument;
  const data = runTransforms(rawData, el.dataset.oninclude, url);
  const replace = typeof el.dataset.includeReplace === "string";
  let replacementNode;
  switch (el.dataset.includeFormat) {
    case "text":
      if (replace) {
        replacementNode = doc.createTextNode(data);
        el.replaceWith(replacementNode);
      } else {
        el.textContent = data;
      }
      break;
    default:
      // html, which is just using "innerHTML"
      el.innerHTML = data;
      if (replace) {
        replacementNode = doc.createDocumentFragment();
        while (el.hasChildNodes()) {
          replacementNode.append(el.removeChild(el.firstChild));
        }
        el.replaceWith(replacementNode);
      }
  }
  // If still in the dom tree, clean up
  if (doc.contains(el)) {
    cleanUp(el);
  }
}
/**
 * Removes attributes after they are used for inclusion, if present.
 *
 * @param {Element} el The element to clean up.
 */
function cleanUp(el) {
  [
    "data-include",
    "data-include-format",
    "data-include-replace",
    "data-include-id",
    "oninclude",
  ].forEach(attr => el.removeAttribute(attr));
}

async function run$9() {
  /** @type {NodeListOf<HTMLElement>} */
  const includables = document.querySelectorAll("[data-include]");

  const promisesToInclude = Array.from(includables).map(async el => {
    const url = el.dataset.include;
    if (!url) {
      return; // just skip it
    }
    const id = `include-${String(Math.random()).substr(2)}`;
    el.dataset.includeId = id;
    try {
      const response = await fetch(url);
      const text = await response.text();
      processResponse(text, id, url);
    } catch (err) {
      const msg = `\`data-include\` failed: \`${url}\` (${err.message}). See console for details.`;
      console.error("data-include failed for element: ", el, err);
      pub("error", msg);
    }
  });
  await Promise.all(promisesToInclude);
}

var dataInclude = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$l,
  run: run$9
});

// @ts-check
const html$1 = hyperHTML$1;

var showLink = link => {
  if (!link.key) {
    const msg =
      "Found a link without `key` attribute in the configuration. See dev console.";
    pub("warn", msg);
    console.warn("warn", msg, link);
    return;
  }
  return html$1`
    <dt class="${link.class ? link.class : null}">${link.key}:</dt>
    ${link.data ? link.data.map(showLinkData) : showLinkData(link)}
  `;
};

function showLinkData(data) {
  return html$1`
    <dd class="${data.class ? data.class : null}">
      ${data.href
        ? html$1`
            <a href="${data.href}">${data.value || data.href}</a>
          `
        : ""}
    </dd>
  `;
}

// @ts-check

var showLogo = obj => {
  /** @type {HTMLAnchorElement} */
  const a = hyperHTML$1`
    <a href="${obj.url || ""}" class="logo"></a>
  `;
  if (!obj.alt) {
    showInlineWarning(a, "Found spec logo without an `alt` attribute");
  }
  /** @type {HTMLImageElement} */
  const img = hyperHTML$1`
    <img
      id="${obj.id}"
      alt="${obj.alt}"
      width="${obj.width}"
      height="${obj.height}"
    />
  `;
  // avoid triggering 404 requests from dynamically generated
  // hyperHTML attribute values
  img.src = obj.src;
  a.append(img);
  return a;
};

// @ts-check

const localizationStrings$1 = {
  en: {
    until: "Until",
  },
  es: {
    until: "Hasta",
  },
};

const lang$9 = lang in localizationStrings$1 ? lang : "en";

var showPeople = (items = []) => {
  const l10n = localizationStrings$1[lang$9];
  return items.map(getItem);

  function getItem(p) {
    const personName = [p.name]; // treated as opt-in HTML by hyperHTML
    const company = [p.company];
    const editorid = p.w3cid ? parseInt(p.w3cid, 10) : null;
    /** @type {HTMLElement} */
    const dd = hyperHTML$1`
      <dd class="p-author h-card vcard" data-editor-id="${editorid}"></dd>
    `;
    const span = document.createDocumentFragment();
    const contents = [];
    if (p.mailto) {
      contents.push(hyperHTML$1`
        <a class="ed_mailto u-email email p-name" href="${`mailto:${p.mailto}`}"
          >${personName}</a
        >
      `);
    } else if (p.url) {
      contents.push(hyperHTML$1`
        <a class="u-url url p-name fn" href="${p.url}">${personName}</a>
      `);
    } else {
      contents.push(
        hyperHTML$1`
          <span class="p-name fn">${personName}</span>
        `
      );
    }
    if (p.orcid) {
      contents.push(
        hyperHTML$1`
          <a class="p-name orcid" href="${p.orcid}"
            ><svg
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
            >
              <style>
                .st1 {
                  fill: #fff;
                }
              </style>
              <path
                d="M256 128c0 70.7-57.3 128-128 128S0 198.7 0 128 57.3 0 128 0s128 57.3 128 128z"
                fill="#a6ce39"
              />
              <path
                class="st1"
                d="M86.3 186.2H70.9V79.1h15.4v107.1zM108.9 79.1h41.6c39.6 0 57 28.3 57 53.6 0 27.5-21.5 53.6-56.8 53.6h-41.8V79.1zm15.4 93.3h24.5c34.9 0 42.9-26.5 42.9-39.7C191.7 111.2 178 93 148 93h-23.7v79.4zM88.7 56.8c0 5.5-4.5 10.1-10.1 10.1s-10.1-4.6-10.1-10.1c0-5.6 4.5-10.1 10.1-10.1s10.1 4.6 10.1 10.1z"
              />
            </svg>
          </a>
        `
      );
    }
    if (p.company) {
      if (p.companyURL) {
        contents.push(
          hyperHTML$1`
            (<a class="p-org org h-org h-card" href="${p.companyURL}"
              >${company}</a
            >)
          `
        );
      } else {
        contents.push(
          hyperHTML$1`
            (${company})
          `
        );
      }
    }
    if (p.note) contents.push(document.createTextNode(` (${p.note})`));
    if (p.extras) {
      const results = p.extras
        // Remove empty names
        .filter(extra => extra.name && extra.name.trim())
        // Convert to HTML
        .map(getExtra);
      for (const result of results) {
        contents.push(document.createTextNode(", "), result);
      }
    }
    if (p.retiredDate) {
      const retiredDate = new Date(p.retiredDate);
      const isValidDate = retiredDate.toString() !== "Invalid Date";
      const timeElem = document.createElement("time");
      timeElem.textContent = isValidDate
        ? humanDate(retiredDate)
        : "Invalid Date"; // todo: Localise invalid date
      if (!isValidDate) {
        showInlineError(
          timeElem,
          "The date is invalid. The expected format is YYYY-MM-DD.",
          "Invalid date"
        );
      }
      timeElem.dateTime = toShortIsoDate(retiredDate);
      contents.push(
        hyperHTML$1`
          - ${l10n.until.concat(" ")}${timeElem}
        `
      );
    }

    // @ts-ignore: hyperhtml types only support Element but we use a DocumentFragment here
    hyperHTML$1.bind(span)`${contents}`;
    dd.appendChild(span);
    return dd;
  }

  function getExtra(extra) {
    const span = hyperHTML$1`
      <span class="${extra.class || null}"></span>
    `;
    let textContainer = span;
    if (extra.href) {
      textContainer = hyperHTML$1`
        <a href="${extra.href}"></a>
      `;
      span.appendChild(textContainer);
    }
    textContainer.textContent = extra.name;
    return span;
  }
};

// @ts-check

const ccLicense = "https://creativecommons.org/licenses/by/4.0/";
const w3cLicense = "https://www.w3.org/Consortium/Legal/copyright-documents";
const legalDisclaimer =
  "https://www.w3.org/Consortium/Legal/ipr-notice#Legal_Disclaimer";
const w3cTrademark =
  "https://www.w3.org/Consortium/Legal/ipr-notice#W3C_Trademarks";

const localizationStrings$2 = {
  en: {
    author: "Author:",
    authors: "Authors:",
    editor: "Editor:",
    editors: "Editors:",
    former_editor: "Former editor:",
    former_editors: "Former editors:",
    latest_editors_draft: "Latest editor's draft:",
    latest_published_version: "Latest published version:",
    this_version: "This version:",
  },
  ko: {
    author: "저자:",
    authors: "저자:",
    editor: "편집자:",
    editors: "편집자:",
    former_editor: "이전 편집자:",
    former_editors: "이전 편집자:",
    latest_editors_draft: "최신 편집 초안:",
    latest_published_version: "최신 버전:",
    this_version: "현재 버전:",
  },
  zh: {
    editor: "编辑：",
    editors: "编辑：",
    former_editor: "原编辑：",
    former_editors: "原编辑：",
    latest_editors_draft: "最新编辑草稿：",
    latest_published_version: "最新发布版本：",
    this_version: "本版本：",
  },
  ja: {
    author: "著者：",
    authors: "著者：",
    editor: "編者：",
    editors: "編者：",
    former_editor: "以前の版の編者：",
    former_editors: "以前の版の編者：",
    latest_editors_draft: "最新の編集用草案：",
    latest_published_version: "最新バージョン：",
    this_version: "このバージョン：",
  },
  nl: {
    author: "Auteur:",
    authors: "Auteurs:",
    editor: "Redacteur:",
    editors: "Redacteurs:",
    latest_editors_draft: "Laatste werkversie:",
    latest_published_version: "Laatst gepubliceerde versie:",
    this_version: "Deze versie:",
  },
  es: {
    author: "Autor:",
    authors: "Autores:",
    editor: "Editor:",
    editors: "Editores:",
    latest_editors_draft: "Borrador de editor mas reciente:",
    latest_published_version: "Versión publicada mas reciente:",
    this_version: "Ésta versión:",
  },
};

const l10n$4 = getIntlData(localizationStrings$2);

function getSpecTitleElem(conf) {
  const specTitleElem =
    document.querySelector("h1#title") || document.createElement("h1");
  if (specTitleElem.parentElement) {
    specTitleElem.remove();
  } else {
    specTitleElem.textContent = conf.title;
    specTitleElem.id = "title";
  }
  if (conf.isPreview && conf.prNumber) {
    const { childNodes } = hyperHTML$1`
      Preview of PR <a href="${conf.prUrl}">#${conf.prNumber}</a>:
    `;
    specTitleElem.prepend(...childNodes);
  }
  conf.title = norm(specTitleElem.textContent);
  specTitleElem.classList.add("title", "p-name");
  if (document.querySelector("title") === null) {
    document.title = conf.title;
  } else if (document.title !== conf.title) {
    pub("warn", "The document's title and the `<title>` element differ.");
  }
  return specTitleElem;
}

function getSpecSubTitleElem(conf) {
  let specSubTitleElem = document.querySelector("h2#subtitle");

  if (specSubTitleElem && specSubTitleElem.parentElement) {
    specSubTitleElem.remove();
    conf.subtitle = specSubTitleElem.textContent.trim();
  } else if (conf.subtitle) {
    specSubTitleElem = document.createElement("h2");
    specSubTitleElem.textContent = conf.subtitle;
    specSubTitleElem.id = "subtitle";
  }
  if (specSubTitleElem) {
    specSubTitleElem.classList.add("subtitle");
  }
  return specSubTitleElem;
}

var headersTmpl = conf => {
  return hyperHTML$1`
    <div class="head">
      ${conf.logos.map(showLogo)} ${getSpecTitleElem(conf)}
      ${getSpecSubTitleElem(conf)}
      <h2>
        ${conf.prependW3C ? "W3C " : ""}${conf.textStatus}
        <time class="dt-published" datetime="${conf.dashDate}"
          >${conf.publishHumanDate}</time
        >
      </h2>
      <dl>
        ${!conf.isNoTrack
          ? hyperHTML$1`
              <dt>${l10n$4.this_version}</dt>
              <dd>
                <a class="u-url" href="${conf.thisVersion}"
                  >${conf.thisVersion}</a
                >
              </dd>
              <dt>${l10n$4.latest_published_version}</dt>
              <dd>
                ${conf.latestVersion
                  ? hyperHTML$1`
                      <a href="${conf.latestVersion}">${conf.latestVersion}</a>
                    `
                  : "none"}
              </dd>
            `
          : ""}
        ${conf.edDraftURI
          ? hyperHTML$1`
              <dt>${l10n$4.latest_editors_draft}</dt>
              <dd><a href="${conf.edDraftURI}">${conf.edDraftURI}</a></dd>
            `
          : ""}
        ${conf.testSuiteURI
          ? hyperHTML$1`
              <dt>Test suite:</dt>
              <dd><a href="${conf.testSuiteURI}">${conf.testSuiteURI}</a></dd>
            `
          : ""}
        ${conf.implementationReportURI
          ? hyperHTML$1`
              <dt>Implementation report:</dt>
              <dd>
                <a href="${conf.implementationReportURI}"
                  >${conf.implementationReportURI}</a
                >
              </dd>
            `
          : ""}
        ${conf.isED && conf.prevED
          ? hyperHTML$1`
              <dt>Previous editor's draft:</dt>
              <dd><a href="${conf.prevED}">${conf.prevED}</a></dd>
            `
          : ""}
        ${conf.showPreviousVersion
          ? hyperHTML$1`
              <dt>Previous version:</dt>
              <dd><a href="${conf.prevVersion}">${conf.prevVersion}</a></dd>
            `
          : ""}
        ${!conf.prevRecURI
          ? ""
          : conf.isRec
          ? hyperHTML$1`
              <dt>Previous Recommendation:</dt>
              <dd><a href="${conf.prevRecURI}">${conf.prevRecURI}</a></dd>
            `
          : hyperHTML$1`
              <dt>Latest Recommendation:</dt>
              <dd><a href="${conf.prevRecURI}">${conf.prevRecURI}</a></dd>
            `}
        <dt>${conf.multipleEditors ? l10n$4.editors : l10n$4.editor}</dt>
        ${showPeople(conf.editors)}
        ${Array.isArray(conf.formerEditors) && conf.formerEditors.length > 0
          ? hyperHTML$1`
              <dt>
                ${conf.multipleFormerEditors
                  ? l10n$4.former_editors
                  : l10n$4.former_editor}
              </dt>
              ${showPeople(conf.formerEditors)}
            `
          : ""}
        ${conf.authors
          ? hyperHTML$1`
              <dt>
                ${conf.multipleAuthors ? l10n$4.authors : l10n$4.author}
              </dt>
              ${showPeople(conf.authors)}
            `
          : ""}
        ${conf.otherLinks ? conf.otherLinks.map(showLink) : ""}
      </dl>
      ${conf.errata
        ? hyperHTML$1`
            <p>
              Please check the
              <a href="${conf.errata}"><strong>errata</strong></a> for any
              errors or issues reported since publication.
            </p>
          `
        : ""}
      ${conf.isRec
        ? hyperHTML$1`
            <p>
              See also
              <a
                href="${`http://www.w3.org/2003/03/Translations/byTechnology?technology=${conf.shortName}`}"
              >
                <strong>translations</strong></a
              >.
            </p>
          `
        : ""}
      ${conf.alternateFormats
        ? hyperHTML$1`
            <p>
              ${conf.multipleAlternates
                ? "This document is also available in these non-normative formats:"
                : "This document is also available in this non-normative format:"}
              ${[conf.alternatesHTML]}
            </p>
          `
        : ""}
      ${renderCopyright(conf)}
      <hr title="Separator for header" />
    </div>
  `;
};

/**
 * @param {string} text
 * @param {string} url
 * @param {string=} cssClass
 */
function linkLicense(text, url, cssClass) {
  return hyperHTML$1`
    <a rel="license" href="${url}" class="${cssClass}">${text}</a>
  `;
}

function renderCopyright(conf) {
  // If there is already a copyright, let's relocate it.
  const existingCopyright = document.querySelector(".copyright");
  if (existingCopyright) {
    existingCopyright.remove();
    return existingCopyright;
  }
  if (conf.hasOwnProperty("overrideCopyright")) {
    const msg =
      "The `overrideCopyright` configuration option is deprecated. " +
      'Please use `<p class="copyright">` instead.';
    pub("warn", msg);
  }
  return conf.isUnofficial
    ? conf.additionalCopyrightHolders
      ? hyperHTML$1`
          <p class="copyright">${[conf.additionalCopyrightHolders]}</p>
        `
      : conf.overrideCopyright
      ? [conf.overrideCopyright]
      : hyperHTML$1`
          <p class="copyright">
            This document is licensed under a
            ${linkLicense(
              "Creative Commons Attribution 4.0 License",
              ccLicense,
              "subfoot"
            )}.
          </p>
        `
    : conf.overrideCopyright
    ? [conf.overrideCopyright]
    : renderOfficialCopyright(conf);
}

function renderOfficialCopyright(conf) {
  return hyperHTML$1`
    <p class="copyright">
      <a href="https://www.w3.org/Consortium/Legal/ipr-notice#Copyright"
        >Copyright</a
      >
      &copy;
      ${conf.copyrightStart ? `${conf.copyrightStart}-` : ""}${conf.publishYear}
      ${conf.additionalCopyrightHolders
        ? hyperHTML$1`
            ${[conf.additionalCopyrightHolders]} &amp;
          `
        : ""}
      <a href="https://www.w3.org/"
        ><abbr title="World Wide Web Consortium">W3C</abbr></a
      ><sup>&reg;</sup> (<a href="https://www.csail.mit.edu/"
        ><abbr title="Massachusetts Institute of Technology">MIT</abbr></a
      >,
      <a href="https://www.ercim.eu/"
        ><abbr
          title="European Research Consortium for Informatics and Mathematics"
          >ERCIM</abbr
        ></a
      >, <a href="https://www.keio.ac.jp/">Keio</a>,
      <a href="https://ev.buaa.edu.cn/">Beihang</a>). ${noteIfDualLicense(conf)}
      W3C <a href="${legalDisclaimer}">liability</a>,
      <a href="${w3cTrademark}">trademark</a> and ${linkDocumentUse(conf)} rules
      apply.
    </p>
  `;
}

function noteIfDualLicense(conf) {
  if (!conf.isCCBY) {
    return;
  }
  return hyperHTML$1`
    Some Rights Reserved: this document is dual-licensed,
    ${linkLicense("CC-BY", ccLicense)} and
    ${linkLicense("W3C Document License", w3cLicense)}.
  `;
}

function linkDocumentUse(conf) {
  if (conf.isCCBY) {
    return linkLicense(
      "document use",
      "https://www.w3.org/Consortium/Legal/2013/copyright-documents-dual.html"
    );
  }
  if (conf.isW3CSoftAndDocLicense) {
    return linkLicense(
      "permissive document license",
      "https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document"
    );
  }
  return linkLicense("document use", w3cLicense);
}

// @ts-check

var cgbgHeadersTmpl = conf => {
  const existingCopyright = document.querySelector(".copyright");
  if (existingCopyright) {
    existingCopyright.remove();
  }
  return hyperHTML$1`
    <div class="head">
      ${conf.logos.map(showLogo)}
      <h1 class="title p-name" id="title">${conf.title}</h1>
      ${conf.subtitle
        ? hyperHTML$1`
            <h2 id="subtitle">${conf.subtitle}</h2>
          `
        : ""}
      <h2>
        ${conf.longStatus}
        <time class="dt-published" datetime="${conf.dashDate}"
          >${conf.publishHumanDate}</time
        >
      </h2>
      <dl>
        ${conf.thisVersion
          ? hyperHTML$1`
              <dt>${l10n$4.this_version}</dt>
              <dd>
                <a class="u-url" href="${conf.thisVersion}"
                  >${conf.thisVersion}</a
                >
              </dd>
            `
          : ""}
        ${conf.latestVersion
          ? hyperHTML$1`
              <dt>${l10n$4.latest_published_version}</dt>
              <dd>
                <a href="${conf.latestVersion}">${conf.latestVersion}</a>
              </dd>
            `
          : ""}
        ${conf.edDraftURI
          ? hyperHTML$1`
              <dt>${l10n$4.latest_editors_draft}</dt>
              <dd><a href="${conf.edDraftURI}">${conf.edDraftURI}</a></dd>
            `
          : ""}
        ${conf.testSuiteURI
          ? hyperHTML$1`
              <dt>Test suite:</dt>
              <dd><a href="${conf.testSuiteURI}">${conf.testSuiteURI}</a></dd>
            `
          : ""}
        ${conf.implementationReportURI
          ? hyperHTML$1`
              <dt>Implementation report:</dt>
              <dd>
                <a href="${conf.implementationReportURI}"
                  >${conf.implementationReportURI}</a
                >
              </dd>
            `
          : ""}
        ${conf.prevVersion
          ? hyperHTML$1`
              <dt>Previous version:</dt>
              <dd><a href="${conf.prevVersion}">${conf.prevVersion}</a></dd>
            `
          : ""}
        ${!conf.isCGFinal
          ? hyperHTML$1`
              ${conf.prevED
                ? hyperHTML$1`
                    <dt>Previous editor's draft:</dt>
                    <dd><a href="${conf.prevED}">${conf.prevED}</a></dd>
                  `
                : ""}
            `
          : ""}
        <dt>${conf.multipleEditors ? l10n$4.editors : l10n$4.editor}</dt>
        ${showPeople(conf.editors)}
        ${Array.isArray(conf.formerEditors) && conf.formerEditors.length > 0
          ? hyperHTML$1`
              <dt>
                ${conf.multipleFormerEditors
                  ? l10n$4.former_editors
                  : l10n$4.former_editor}
              </dt>
              ${showPeople(conf.formerEditors)}
            `
          : ""}
        ${conf.authors
          ? hyperHTML$1`
              <dt>
                ${conf.multipleAuthors ? l10n$4.authors : l10n$4.author}
              </dt>
              ${showPeople(conf.authors)}
            `
          : ""}
        ${conf.otherLinks ? conf.otherLinks.map(showLink) : ""}
      </dl>
      ${conf.alternateFormats
        ? hyperHTML$1`
            <p>
              ${conf.multipleAlternates
                ? "This document is also available in these non-normative formats:"
                : "This document is also available in this non-normative format:"}
              ${[conf.alternatesHTML]}
            </p>
          `
        : ""}
      ${existingCopyright
        ? existingCopyright
        : hyperHTML$1`
            <p class="copyright">
              <a href="https://www.w3.org/Consortium/Legal/ipr-notice#Copyright"
                >Copyright</a
              >
              &copy;
              ${conf.copyrightStart
                ? `${conf.copyrightStart}-`
                : ""}${conf.publishYear}
              ${conf.additionalCopyrightHolders
                ? hyperHTML$1`
                    ${[conf.additionalCopyrightHolders]} &amp;
                  `
                : ""}
              the Contributors to the ${conf.title} Specification, published by
              the
              <a href="${conf.wgURI}">${conf.wg}</a> under the
              ${conf.isCGFinal
                ? hyperHTML$1`
                    <a href="https://www.w3.org/community/about/agreements/fsa/"
                      >W3C Community Final Specification Agreement (FSA)</a
                    >. A human-readable
                    <a
                      href="https://www.w3.org/community/about/agreements/fsa-deed/"
                      >summary</a
                    >
                    is available.
                  `
                : hyperHTML$1`
                    <a href="https://www.w3.org/community/about/agreements/cla/"
                      >W3C Community Contributor License Agreement (CLA)</a
                    >. A human-readable
                    <a
                      href="https://www.w3.org/community/about/agreements/cla-deed/"
                      >summary</a
                    >
                    is available.
                  `}
            </p>
          `}
      <hr title="Separator for header" />
    </div>
  `;
};

// @ts-check

const localizationStrings$3 = {
  en: {
    sotd: "Status of This Document",
  },
  ko: {
    sotd: "현재 문서의 상태",
  },
  zh: {
    sotd: "关于本文档",
  },
  ja: {
    sotd: "この文書の位置付け",
  },
  nl: {
    sotd: "Status van dit document",
  },
  es: {
    sotd: "Estado de este Document",
  },
};

const l10n$5 = getIntlData(localizationStrings$3);

var sotdTmpl = (conf, opts) => {
  return hyperHTML$1`
    <h2>${l10n$5.sotd}</h2>
    ${conf.isPreview ? renderPreview(conf) : ""}
    ${conf.isUnofficial
      ? renderIsUnofficial(opts)
      : conf.isTagFinding
      ? opts.additionalContent
      : conf.isNoTrack
      ? renderIsNoTrack(conf, opts)
      : hyperHTML$1`
          <p><em>${[conf.l10n.status_at_publication]}</em></p>
          ${conf.isSubmission
            ? noteForSubmission(conf, opts)
            : hyperHTML$1`
                ${!conf.sotdAfterWGinfo ? opts.additionalContent : ""}
                ${!conf.overrideStatus
                  ? hyperHTML$1`
                      ${linkToWorkingGroup(conf)} ${linkToCommunity(conf, opts)}
                      ${conf.isCR || conf.isPER || conf.isPR
                        ? hyperHTML$1`
                            <p>
                              ${conf.isCR
                                ? `
                  W3C publishes a Candidate Recommendation to indicate that the document is believed to be
                  stable and to encourage implementation by the developer community. This Candidate
                  Recommendation is expected to advance to Proposed Recommendation no earlier than
                  ${conf.humanCREnd}.
                `
                                : ""}
                              ${conf.isPER
                                ? hyperHTML$1`
                                    W3C Advisory Committee Members are invited
                                    to send formal review comments on this
                                    Proposed Edited Recommendation to the W3C
                                    Team until ${conf.humanPEREnd}. Members of
                                    the Advisory Committee will find the
                                    appropriate review form for this document by
                                    consulting their list of current
                                    <a
                                      href="https://www.w3.org/2002/09/wbs/myQuestionnaires"
                                      >WBS questionnaires</a
                                    >.
                                  `
                                : ""}
                              ${conf.isPR
                                ? hyperHTML$1`
                                    The W3C Membership and other interested
                                    parties are invited to review the document
                                    and send comments to
                                    <a
                                      rel="discussion"
                                      href="${opts.mailToWGPublicList}"
                                      >${conf.wgPublicList}@w3.org</a
                                    >
                                    (<a
                                      href="${opts.mailToWGPublicListSubscription}"
                                      >subscribe</a
                                    >,
                                    <a
                                      href="${`https://lists.w3.org/Archives/Public/${conf.wgPublicList}/`}"
                                      >archives</a
                                    >) through ${conf.humanPREnd}. Advisory
                                    Committee Representatives should consult
                                    their
                                    <a
                                      href="https://www.w3.org/2002/09/wbs/myQuestionnaires"
                                      >WBS questionnaires</a
                                    >. Note that substantive technical comments
                                    were expected during the Candidate
                                    Recommendation review period that ended
                                    ${conf.humanCREnd}.
                                  `
                                : ""}
                            </p>
                          `
                        : ""}
                    `
                  : ""}
                ${conf.implementationReportURI
                  ? renderImplementationReportURI(conf)
                  : ""}
                ${conf.sotdAfterWGinfo ? opts.additionalContent : ""}
                ${conf.notRec ? renderNotRec(conf) : ""}
                ${conf.isRec ? renderIsRec() : ""} ${renderDeliverer(conf)}
                <p>
                  This document is governed by the
                  <a
                    id="w3c_process_revision"
                    href="https://www.w3.org/2019/Process-20190301/"
                    >1 March 2019 W3C Process Document</a
                  >.
                </p>
                ${conf.addPatentNote
                  ? hyperHTML$1`
                      <p>${[conf.addPatentNote]}</p>
                    `
                  : ""}
              `}
        `}
    ${opts.additionalSections}
  `;
};

function renderPreview(conf) {
  const { prUrl, prNumber, edDraftURI } = conf;
  return hyperHTML$1`
    <details class="annoying-warning" open="">
      <summary
        >This is a
        preview${prUrl && prNumber
          ? hyperHTML$1`
              of pull request
              <a href="${prUrl}">#${prNumber}</a>
            `
          : ""}</summary
      >
      <p>
        Do not attempt to implement this version of the specification. Do not
        reference this version as authoritative in any way.
        ${edDraftURI
          ? hyperHTML$1`
              Instead, see
              <a href="${edDraftURI}">${edDraftURI}</a> for the Editor's draft.
            `
          : ""}
      </p>
    </details>
  `;
}

function renderIsUnofficial(opts) {
  const { additionalContent } = opts;
  return hyperHTML$1`
    <p>
      This document is draft of a potential specification. It has no official
      standing of any kind and does not represent the support or consensus of
      any standards organization.
    </p>
    ${additionalContent}
  `;
}

function renderIsNoTrack(conf, opts) {
  const { isMO } = conf;
  const { additionalContent } = opts;
  return hyperHTML$1`
    <p>
      This document is merely a W3C-internal
      ${isMO ? "member-confidential" : ""} document. It has no official standing
      of any kind and does not represent consensus of the W3C Membership.
    </p>
    ${additionalContent}
  `;
}

function renderImplementationReportURI(conf) {
  const { implementationReportURI } = conf;
  return hyperHTML$1`
    <p>
      Please see the Working Group's
      <a href="${implementationReportURI}">implementation report</a>.
    </p>
  `;
}

function renderNotRec(conf) {
  const { anOrA, textStatus } = conf;
  return hyperHTML$1`
    <p>
      Publication as ${anOrA} ${textStatus} does not imply endorsement by the
      W3C Membership. This is a draft document and may be updated, replaced or
      obsoleted by other documents at any time. It is inappropriate to cite this
      document as other than work in progress.
    </p>
  `;
}

function renderIsRec() {
  hyperHTML$1`
    <p>
      This document has been reviewed by W3C Members, by software developers,
      and by other W3C groups and interested parties, and is endorsed by the
      Director as a W3C Recommendation. It is a stable document and may be used
      as reference material or cited from another document. W3C's role in making
      the Recommendation is to draw attention to the specification and to
      promote its widespread deployment. This enhances the functionality and
      interoperability of the Web.
    </p>
  `;
}

function renderDeliverer(conf) {
  const {
    isNote,
    wgId,
    isIGNote,
    multipleWGs,
    recNotExpected,
    wgPatentHTML,
    wgPatentURI,
    charterDisclosureURI,
  } = conf;

  const producers = !isIGNote
    ? hyperHTML$1`
        This document was produced by ${multipleWGs ? "groups" : "a group"}
        operating under the
        <a href="https://www.w3.org/Consortium/Patent-Policy/"
          >W3C Patent Policy</a
        >.
      `
    : "";
  const wontBeRec = recNotExpected
    ? "The group does not expect this document to become a W3C Recommendation."
    : "";
  return hyperHTML$1`
    <p data-deliverer="${isNote ? wgId : null}">
      ${producers} ${wontBeRec}
      ${!isNote && !isIGNote
        ? hyperHTML$1`
            ${multipleWGs
              ? hyperHTML$1`
                  W3C maintains ${wgPatentHTML}
                `
              : hyperHTML$1`
                  W3C maintains a
                  <a href="${[wgPatentURI]}" rel="disclosure"
                    >public list of any patent disclosures</a
                  >
                `}
            made in connection with the deliverables of
            ${multipleWGs
              ? "each group; these pages also include"
              : "the group; that page also includes"}
            instructions for disclosing a patent. An individual who has actual
            knowledge of a patent which the individual believes contains
            <a href="https://www.w3.org/Consortium/Patent-Policy/#def-essential"
              >Essential Claim(s)</a
            >
            must disclose the information in accordance with
            <a
              href="https://www.w3.org/Consortium/Patent-Policy/#sec-Disclosure"
              >section 6 of the W3C Patent Policy</a
            >.
          `
        : ""}
      ${isIGNote
        ? hyperHTML$1`
            The disclosure obligations of the Participants of this group are
            described in the
            <a href="${charterDisclosureURI}">charter</a>.
          `
        : ""}
    </p>
  `;
}

function noteForSubmission(conf, opts) {
  return hyperHTML$1`
    ${opts.additionalContent}
    ${conf.isMemberSubmission
      ? noteForMemberSubmission(conf)
      : conf.isTeamSubmission
      ? noteForTeamSubmission(conf, opts)
      : ""}
  `;
}

function noteForMemberSubmission(conf) {
  const teamComment = `https://www.w3.org/Submission/${conf.publishDate.getUTCFullYear()}/${
    conf.submissionCommentNumber
  }/Comment/`;
  return hyperHTML$1`
    <p>
      By publishing this document, W3C acknowledges that the
      <a href="${conf.thisVersion}">Submitting Members</a> have made a formal
      Submission request to W3C for discussion. Publication of this document by
      W3C indicates no endorsement of its content by W3C, nor that W3C has, is,
      or will be allocating any resources to the issues addressed by it. This
      document is not the product of a chartered W3C group, but is published as
      potential input to the
      <a href="https://www.w3.org/Consortium/Process">W3C Process</a>. A
      <a href="${teamComment}">W3C Team Comment</a> has been published in
      conjunction with this Member Submission. Publication of acknowledged
      Member Submissions at the W3C site is one of the benefits of
      <a href="https://www.w3.org/Consortium/Prospectus/Joining">
        W3C Membership</a
      >. Please consult the requirements associated with Member Submissions of
      <a href="https://www.w3.org/Consortium/Patent-Policy/#sec-submissions"
        >section 3.3 of the W3C Patent Policy</a
      >. Please consult the complete
      <a href="https://www.w3.org/Submission"
        >list of acknowledged W3C Member Submissions</a
      >.
    </p>
  `;
}

function noteForTeamSubmission(conf, opts) {
  return hyperHTML$1`
    <p>
      If you wish to make comments regarding this document, please send them to
      <a href="${opts.mailToWGPublicListWithSubject}"
        >${conf.wgPublicList}@w3.org</a
      >
      (<a href="${opts.mailToWGPublicListSubscription}">subscribe</a>,
      <a href="${`https://lists.w3.org/Archives/Public/${conf.wgPublicList}/`}"
        >archives</a
      >)${conf.subjectPrefix
        ? hyperHTML$1`
            with <code>${conf.subjectPrefix}</code> at the start of your email's
            subject
          `
        : ""}.
    </p>
    <p>
      Please consult the complete
      <a href="https://www.w3.org/TeamSubmission/">list of Team Submissions</a>.
    </p>
  `;
}

function linkToWorkingGroup(conf) {
  if (!conf.wg) {
    return;
  }
  return hyperHTML$1`
    <p>
      This document was published by ${conf.wgHTML} as ${conf.anOrA}
      ${conf.longStatus}.
      ${conf.notYetRec
        ? "This document is intended to become a W3C Recommendation."
        : ""}
    </p>
  `;
}

function linkToCommunity(conf, opts) {
  if (!conf.github && !conf.wgPublicList) {
    return;
  }
  return hyperHTML$1`
    <p>
      ${conf.github
        ? hyperHTML$1`
            <a href="${conf.issueBase}">GitHub Issues</a> are preferred for
            discussion of this specification.
          `
        : ""}
      ${conf.wgPublicList
        ? hyperHTML$1`
            ${conf.github && conf.wgPublicList
              ? "Alternatively, you can send comments to our mailing list."
              : "Comments regarding this document are welcome."}
            Please send them to
            <a href="${opts.mailToWGPublicListWithSubject}"
              >${conf.wgPublicList}@w3.org</a
            >
            (<a
              href="${`https://lists.w3.org/Archives/Public/${conf.wgPublicList}/`}"
              >archives</a
            >)${conf.subjectPrefix
              ? hyperHTML$1`
                  with <code>${conf.subjectPrefix}</code> at the start of your
                  email's subject
                `
              : ""}.
          `
        : ""}
    </p>
  `;
}

// @ts-check

var cgbgSotdTmpl = (conf, opts) => {
  return hyperHTML$1`
    <h2>${l10n$5.sotd}</h2>
    ${conf.isPreview
      ? hyperHTML$1`
          <details class="annoying-warning" open="">
            <summary
              >This is a
              preview${conf.prUrl && conf.prNumber
                ? hyperHTML$1`
                    of pull request
                    <a href="${conf.prUrl}">#${conf.prNumber}</a>
                  `
                : ""}</summary
            >
            <p>
              Do not attempt to implement this version of the specification. Do
              not reference this version as authoritative in any way.
              ${conf.edDraftURI
                ? hyperHTML$1`
                    Instead, see
                    <a href="${conf.edDraftURI}">${conf.edDraftURI}</a> for the
                    Editor's draft.
                  `
                : ""}
            </p>
          </details>
        `
      : ""}
    <p>
      This specification was published by the
      <a href="${conf.wgURI}">${conf.wg}</a>. It is not a W3C Standard nor is it
      on the W3C Standards Track.
      ${conf.isCGFinal
        ? hyperHTML$1`
            Please note that under the
            <a href="https://www.w3.org/community/about/agreements/final/"
              >W3C Community Final Specification Agreement (FSA)</a
            >
            other conditions apply.
          `
        : hyperHTML$1`
            Please note that under the
            <a href="https://www.w3.org/community/about/agreements/cla/"
              >W3C Community Contributor License Agreement (CLA)</a
            >
            there is a limited opt-out and other conditions apply.
          `}
      Learn more about
      <a href="https://www.w3.org/community/"
        >W3C Community and Business Groups</a
      >.
    </p>
    ${!conf.sotdAfterWGinfo ? opts.additionalContent : ""}
    ${conf.wgPublicList
      ? hyperHTML$1`
          <p>
            If you wish to make comments regarding this document, please send
            them to
            <a href="${opts.mailToWGPublicListWithSubject}"
              >${conf.wgPublicList}@w3.org</a
            >
            (<a href="${opts.mailToWGPublicListSubscription}">subscribe</a>,
            <a
              href="${`https://lists.w3.org/Archives/Public/${conf.wgPublicList}/`}"
              >archives</a
            >)${conf.subjectPrefix
              ? hyperHTML$1`
                  with <code>${conf.subjectPrefix}</code> at the start of your
                  email's subject
                `
              : ""}.
          </p>
        `
      : ""}
    ${conf.sotdAfterWGinfo ? opts.additionalContent : ""}
    ${opts.additionalSections}
  `;
};

// @ts-check

const name$m = "w3c/headers";

const W3CDate = new Intl.DateTimeFormat(["en-AU"], {
  timeZone: "UTC",
  year: "numeric",
  month: "long",
  day: "2-digit",
});

const status2maturity = {
  LS: "WD",
  LD: "WD",
  FPWD: "WD",
  LC: "WD",
  FPLC: "WD",
  "FPWD-NOTE": "NOTE",
  "WD-NOTE": "WD",
  "LC-NOTE": "LC",
  "IG-NOTE": "NOTE",
  "WG-NOTE": "NOTE",
};

const status2rdf = {
  NOTE: "w3p:NOTE",
  WD: "w3p:WD",
  LC: "w3p:LastCall",
  CR: "w3p:CR",
  PR: "w3p:PR",
  REC: "w3p:REC",
  PER: "w3p:PER",
  RSCND: "w3p:RSCND",
};
const status2text = {
  NOTE: "Working Group Note",
  "WG-NOTE": "Working Group Note",
  "CG-NOTE": "Co-ordination Group Note",
  "IG-NOTE": "Interest Group Note",
  "Member-SUBM": "Member Submission",
  "Team-SUBM": "Team Submission",
  MO: "Member-Only Document",
  ED: "Editor's Draft",
  LS: "Living Standard",
  LD: "Living Document",
  FPWD: "First Public Working Draft",
  WD: "Working Draft",
  "FPWD-NOTE": "Working Group Note",
  "WD-NOTE": "Working Draft",
  "LC-NOTE": "Working Draft",
  FPLC: "First Public and Last Call Working Draft",
  LC: "Last Call Working Draft",
  CR: "Candidate Recommendation",
  PR: "Proposed Recommendation",
  PER: "Proposed Edited Recommendation",
  REC: "Recommendation",
  RSCND: "Rescinded Recommendation",
  unofficial: "Unofficial Draft",
  base: "Document",
  finding: "TAG Finding",
  "draft-finding": "Draft TAG Finding",
  "CG-DRAFT": "Draft Community Group Report",
  "CG-FINAL": "Final Community Group Report",
  "BG-DRAFT": "Draft Business Group Report",
  "BG-FINAL": "Final Business Group Report",
};
const status2long = {
  ...status2text,
  "FPWD-NOTE": "First Public Working Group Note",
  "LC-NOTE": "Last Call Working Draft",
};
const maybeRecTrack = ["FPWD", "WD"];
const recTrackStatus = ["FPLC", "LC", "CR", "PR", "PER", "REC"];
const noTrackStatus = [
  "base",
  "BG-DRAFT",
  "BG-FINAL",
  "CG-DRAFT",
  "CG-FINAL",
  "draft-finding",
  "finding",
  "MO",
  "unofficial",
];
const cgbg = ["CG-DRAFT", "CG-FINAL", "BG-DRAFT", "BG-FINAL"];
const precededByAn = ["ED", "IG-NOTE"];
const licenses = {
  cc0: {
    name: "Creative Commons 0 Public Domain Dedication",
    short: "CC0",
    url: "https://creativecommons.org/publicdomain/zero/1.0/",
  },
  "w3c-software": {
    name: "W3C Software Notice and License",
    short: "W3C Software",
    url: "https://www.w3.org/Consortium/Legal/2002/copyright-software-20021231",
  },
  "w3c-software-doc": {
    name: "W3C Software and Document Notice and License",
    short: "W3C Software and Document",
    url:
      "https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document",
  },
  "cc-by": {
    name: "Creative Commons Attribution 4.0 International Public License",
    short: "CC-BY",
    url: "https://creativecommons.org/licenses/by/4.0/legalcode",
  },
};

const baseLogo = Object.freeze({
  id: "",
  alt: "",
  href: "",
  src: "",
  height: "48",
  width: "72",
});

/**
 * @param {*} conf
 * @param {string} prop
 * @param {string | number | Date} fallbackDate
 */
function validateDateAndRecover(conf, prop, fallbackDate = new Date()) {
  const date = conf[prop] ? new Date(conf[prop]) : new Date(fallbackDate);
  // if date is valid
  if (Number.isFinite(date.valueOf())) {
    const formattedDate = ISODate.format(date);
    return new Date(formattedDate);
  }
  const msg =
    `[\`${prop}\`](https://github.com/w3c/respec/wiki/${prop}) ` +
    `is not a valid date: "${conf[prop]}". Expected format 'YYYY-MM-DD'.`;
  pub("error", msg);
  return new Date(ISODate.format(new Date()));
}

function run$a(conf) {
  conf.isUnofficial = conf.specStatus === "unofficial";
  if (conf.isUnofficial && !Array.isArray(conf.logos)) {
    conf.logos = [];
  }
  conf.isCCBY = conf.license === "cc-by";
  conf.isW3CSoftAndDocLicense = conf.license === "w3c-software-doc";
  if (["cc-by"].includes(conf.license)) {
    let msg = `You cannot use license "\`${conf.license}\`" with W3C Specs. `;
    msg += `Please set \`respecConfig.license: "w3c-software-doc"\` instead.`;
    pub("error", msg);
  }
  conf.licenseInfo = licenses[conf.license];
  conf.isCGBG = cgbg.includes(conf.specStatus);
  conf.isCGFinal = conf.isCGBG && conf.specStatus.endsWith("G-FINAL");
  conf.isBasic = conf.specStatus === "base";
  conf.isRegular = !conf.isCGBG && !conf.isBasic;
  if (!conf.specStatus) {
    pub("error", "Missing required configuration: `specStatus`");
  }
  if (conf.isRegular && !conf.shortName) {
    pub("error", "Missing required configuration: `shortName`");
  }
  if (conf.testSuiteURI) {
    const url = new URL(conf.testSuiteURI, location.href);
    const { host, pathname } = url;
    if (
      host === "github.com" &&
      pathname.startsWith("/w3c/web-platform-tests/")
    ) {
      const msg =
        "Web Platform Tests have moved to a new Github Organization at https://github.com/web-platform-tests. " +
        "Please update your [`testSuiteURI`](https://github.com/w3c/respec/wiki/testSuiteURI) to point to the " +
        `new tests repository (e.g., https://github.com/web-platform-tests/wpt/${conf.shortName} ).`;
      pub("warn", msg);
    }
  }
  conf.title = document.title || "No Title";
  if (document.title && conf.isPreview && conf.prNumber) {
    document.title = `Preview of PR #${conf.prNumber}: ${document.title}`;
  }
  if (!conf.subtitle) conf.subtitle = "";
  conf.publishDate = validateDateAndRecover(
    conf,
    "publishDate",
    document.lastModified
  );
  conf.publishYear = conf.publishDate.getUTCFullYear();
  conf.publishHumanDate = W3CDate.format(conf.publishDate);
  conf.isNoTrack = noTrackStatus.includes(conf.specStatus);
  conf.isRecTrack = conf.noRecTrack
    ? false
    : recTrackStatus.concat(maybeRecTrack).includes(conf.specStatus);
  conf.isMemberSubmission = conf.specStatus === "Member-SUBM";
  if (conf.isMemberSubmission) {
    const memSubmissionLogo = {
      alt: "W3C Member Submission",
      href: "https://www.w3.org/Submission/",
      src: "https://www.w3.org/Icons/member_subm-v.svg",
      width: "211",
    };
    conf.logos.push({ ...baseLogo, ...memSubmissionLogo });
  }
  conf.isTeamSubmission = conf.specStatus === "Team-SUBM";
  if (conf.isTeamSubmission) {
    const teamSubmissionLogo = {
      alt: "W3C Team Submission",
      href: "https://www.w3.org/TeamSubmission/",
      src: "https://www.w3.org/Icons/team_subm-v.svg",
      width: "211",
    };
    conf.logos.push({ ...baseLogo, ...teamSubmissionLogo });
  }
  conf.isSubmission = conf.isMemberSubmission || conf.isTeamSubmission;
  conf.anOrA = precededByAn.includes(conf.specStatus) ? "an" : "a";
  conf.isTagFinding =
    conf.specStatus === "finding" || conf.specStatus === "draft-finding";
  if (!conf.edDraftURI) {
    conf.edDraftURI = "";
    if (conf.specStatus === "ED")
      pub("warn", "Editor's Drafts should set edDraftURI.");
  }
  conf.maturity = status2maturity[conf.specStatus]
    ? status2maturity[conf.specStatus]
    : conf.specStatus;
  let publishSpace = "TR";
  if (conf.specStatus === "Member-SUBM") publishSpace = "Submission";
  else if (conf.specStatus === "Team-SUBM") publishSpace = "TeamSubmission";
  if (conf.isRegular)
    conf.thisVersion = `https://www.w3.org/${publishSpace}/${conf.publishDate.getUTCFullYear()}/${
      conf.maturity
    }-${conf.shortName}-${concatDate(conf.publishDate)}/`;
  if (conf.specStatus === "ED") conf.thisVersion = conf.edDraftURI;
  if (conf.isRegular)
    conf.latestVersion = `https://www.w3.org/${publishSpace}/${conf.shortName}/`;
  if (conf.isTagFinding) {
    conf.latestVersion = `https://www.w3.org/2001/tag/doc/${conf.shortName}`;
    conf.thisVersion = `${conf.latestVersion}-${ISODate.format(
      conf.publishDate
    )}`;
  }
  if (conf.previousPublishDate) {
    if (!conf.previousMaturity && !conf.isTagFinding) {
      pub("error", "`previousPublishDate` is set, but not `previousMaturity`.");
    }

    conf.previousPublishDate = validateDateAndRecover(
      conf,
      "previousPublishDate"
    );

    const pmat = status2maturity[conf.previousMaturity]
      ? status2maturity[conf.previousMaturity]
      : conf.previousMaturity;
    if (conf.isTagFinding) {
      conf.prevVersion = `${conf.latestVersion}-${ISODate.format(
        conf.previousPublishDate
      )}`;
    } else if (conf.isCGBG) {
      conf.prevVersion = conf.prevVersion || "";
    } else if (conf.isBasic) {
      conf.prevVersion = "";
    } else {
      conf.prevVersion = `https://www.w3.org/TR/${conf.previousPublishDate.getUTCFullYear()}/${pmat}-${
        conf.shortName
      }-${concatDate(conf.previousPublishDate)}/`;
    }
  } else {
    if (
      !conf.specStatus.endsWith("NOTE") &&
      conf.specStatus !== "FPWD" &&
      conf.specStatus !== "FPLC" &&
      conf.specStatus !== "ED" &&
      !conf.noRecTrack &&
      !conf.isNoTrack &&
      !conf.isSubmission
    )
      pub(
        "error",
        "Document on track but no previous version:" +
          " Add `previousMaturity`, and `previousPublishDate` to ReSpec's config."
      );
    if (!conf.prevVersion) conf.prevVersion = "";
  }
  if (conf.prevRecShortname && !conf.prevRecURI)
    conf.prevRecURI = `https://www.w3.org/TR/${conf.prevRecShortname}`;
  const peopCheck = function(it) {
    if (!it.name) pub("error", "All authors and editors must have a name.");
    if (it.orcid) {
      try {
        it.orcid = normalizeOrcid(it.orcid);
      } catch (e) {
        pub("error", `"${it.orcid}" is not an ORCID. ${e.message}`);
        // A failed orcid link could link to something outside of orcid,
        // which would be misleading.
        delete it.orcid;
      }
    }
  };
  if (!conf.formerEditors) conf.formerEditors = [];
  if (conf.editors) {
    conf.editors.forEach(peopCheck);
    // Move any editors with retiredDate to formerEditors.
    for (let i = 0; i < conf.editors.length; i++) {
      const editor = conf.editors[i];
      if ("retiredDate" in editor) {
        conf.formerEditors.push(editor);
        conf.editors.splice(i--, 1);
      }
    }
  }
  if (!conf.editors || conf.editors.length === 0)
    pub("error", "At least one editor is required");
  if (conf.formerEditors.length) {
    conf.formerEditors.forEach(peopCheck);
  }
  if (conf.authors) {
    conf.authors.forEach(peopCheck);
  }
  conf.multipleEditors = conf.editors && conf.editors.length > 1;
  conf.multipleFormerEditors = conf.formerEditors.length > 1;
  conf.multipleAuthors = conf.authors && conf.authors.length > 1;
  (conf.alternateFormats || []).forEach(it => {
    if (!it.uri || !it.label) {
      pub("error", "All alternate formats must have a uri and a label.");
    }
  });
  conf.multipleAlternates =
    conf.alternateFormats && conf.alternateFormats.length > 1;
  conf.alternatesHTML =
    conf.alternateFormats &&
    htmlJoinAnd(conf.alternateFormats, alt => {
      const lang = alt.hasOwnProperty("lang") && alt.lang ? alt.lang : null;
      const type = alt.hasOwnProperty("type") && alt.type ? alt.type : null;
      return hyperHTML$1`<a rel='alternate' href='${alt.uri}' hreflang='${lang}' type='${type}'>${alt.label}</a>`;
    });
  if (conf.copyrightStart && conf.copyrightStart == conf.publishYear)
    conf.copyrightStart = "";
  conf.longStatus = status2long[conf.specStatus];
  conf.textStatus = status2text[conf.specStatus];
  if (status2rdf[conf.specStatus]) {
    conf.rdfStatus = status2rdf[conf.specStatus];
  }
  conf.showThisVersion = !conf.isNoTrack || conf.isTagFinding;
  conf.showPreviousVersion =
    conf.specStatus !== "FPWD" &&
    conf.specStatus !== "FPLC" &&
    conf.specStatus !== "ED" &&
    !conf.isNoTrack &&
    !conf.isSubmission;
  if (conf.specStatus.endsWith("NOTE") && !conf.prevVersion)
    conf.showPreviousVersion = false;
  if (conf.isTagFinding)
    conf.showPreviousVersion = conf.previousPublishDate ? true : false;
  conf.notYetRec = conf.isRecTrack && conf.specStatus !== "REC";
  conf.isRec = conf.isRecTrack && conf.specStatus === "REC";
  if (conf.isRec && !conf.errata)
    pub("error", "Recommendations must have an errata link.");
  conf.notRec = conf.specStatus !== "REC";
  conf.prependW3C = !conf.isUnofficial;
  conf.isED = conf.specStatus === "ED";
  conf.isCR = conf.specStatus === "CR";
  conf.isPR = conf.specStatus === "PR";
  conf.isPER = conf.specStatus === "PER";
  conf.isMO = conf.specStatus === "MO";
  conf.isNote = ["FPWD-NOTE", "WG-NOTE"].includes(conf.specStatus);
  conf.isIGNote = conf.specStatus === "IG-NOTE";
  conf.dashDate = ISODate.format(conf.publishDate);
  conf.publishISODate = conf.publishDate.toISOString();
  conf.shortISODate = ISODate.format(conf.publishDate);
  if (conf.hasOwnProperty("wgPatentURI") && !Array.isArray(conf.wgPatentURI)) {
    Object.defineProperty(conf, "wgId", {
      get() {
        // it's always at "pp-impl" + 1
        const urlParts = this.wgPatentURI.split("/");
        const pos = urlParts.findIndex(item => item === "pp-impl") + 1;
        return urlParts[pos] || "";
      },
    });
  } else {
    conf.wgId = conf.wgId ? conf.wgId : "";
  }
  // configuration done - yay!

  // insert into document
  const header = (conf.isCGBG ? cgbgHeadersTmpl : headersTmpl)(conf);
  document.body.prepend(header);
  document.body.classList.add("h-entry");

  // handle SotD
  const sotd =
    document.getElementById("sotd") || document.createElement("section");
  if ((conf.isCGBG || !conf.isNoTrack || conf.isTagFinding) && !sotd.id) {
    pub(
      "error",
      "A custom SotD paragraph is required for your type of document."
    );
  }
  sotd.id = sotd.id || "sotd";
  sotd.classList.add("introductory");
  // NOTE:
  //  When arrays, wg and wgURI have to be the same length (and in the same order).
  //  Technically wgURI could be longer but the rest is ignored.
  //  However wgPatentURI can be shorter. This covers the case where multiple groups
  //  publish together but some aren't used for patent policy purposes (typically this
  //  happens when one is foolish enough to do joint work with the TAG). In such cases,
  //  the groups whose patent policy applies need to be listed first, and wgPatentURI
  //  can be shorter — but it still needs to be an array.
  const wgPotentialArray = [conf.wg, conf.wgURI, conf.wgPatentURI];
  if (
    wgPotentialArray.some(item => Array.isArray(item)) &&
    !wgPotentialArray.every(item => Array.isArray(item))
  ) {
    pub(
      "error",
      "If one of '`wg`', '`wgURI`', or '`wgPatentURI`' is an array, they all have to be."
    );
  }
  if (conf.isCGBG && !conf.wg) {
    pub(
      "error",
      "[`wg`](https://github.com/w3c/respec/wiki/wg)" +
        " configuration option is required for this kind of document."
    );
  }
  if (Array.isArray(conf.wg)) {
    conf.multipleWGs = conf.wg.length > 1;
    conf.wgHTML = htmlJoinAnd(conf.wg, (wg, idx) => {
      return hyperHTML$1`the <a href='${conf.wgURI[idx]}'>${wg}</a>`;
    });
    const pats = [];
    for (let i = 0, n = conf.wg.length; i < n; i++) {
      pats.push(
        hyperHTML$1`a <a href='${conf.wgPatentURI[i]}' rel='disclosure'>public list of any patent disclosures (${conf.wg[i]})</a>`
      );
    }
    conf.wgPatentHTML = htmlJoinAnd(pats);
  } else {
    conf.multipleWGs = false;
    if (conf.wg) {
      conf.wgHTML = hyperHTML$1`the <a href='${conf.wgURI}'>${conf.wg}</a>`;
    }
  }
  if (conf.specStatus === "PR" && !conf.crEnd) {
    pub(
      "error",
      `\`specStatus\` is "PR" but no \`crEnd\` is specified (needed to indicate end of previous CR).`
    );
  }

  if (conf.specStatus === "CR" && !conf.crEnd) {
    pub(
      "error",
      `\`specStatus\` is "CR", but no \`crEnd\` is specified in Respec config.`
    );
  }
  conf.crEnd = validateDateAndRecover(conf, "crEnd");
  conf.humanCREnd = W3CDate.format(conf.crEnd);

  if (conf.specStatus === "PR" && !conf.prEnd) {
    pub("error", `\`specStatus\` is "PR" but no \`prEnd\` is specified.`);
  }
  conf.prEnd = validateDateAndRecover(conf, "prEnd");
  conf.humanPREnd = W3CDate.format(conf.prEnd);

  if (conf.specStatus === "PER" && !conf.perEnd) {
    pub("error", "Status is PER but no perEnd is specified");
  }
  conf.perEnd = validateDateAndRecover(conf, "perEnd");
  conf.humanPEREnd = W3CDate.format(conf.perEnd);
  conf.recNotExpected =
    conf.noRecTrack || conf.recNotExpected
      ? true
      : !conf.isRecTrack &&
        conf.maturity == "WD" &&
        conf.specStatus !== "FPWD-NOTE";
  if (conf.noRecTrack && recTrackStatus.includes(conf.specStatus)) {
    pub(
      "error",
      `Document configured as [\`noRecTrack\`](https://github.com/w3c/respec/wiki/noRecTrack), but its status ("${
        conf.specStatus
      }") puts it on the W3C Rec Track. Status cannot be any of: ${recTrackStatus.join(
        ", "
      )}. [More info](https://github.com/w3c/respec/wiki/noRecTrack).`
    );
  }
  if (conf.isIGNote && !conf.charterDisclosureURI) {
    pub(
      "error",
      "IG-NOTEs must link to charter's disclosure section using `charterDisclosureURI`."
    );
  }
  if (!sotd.classList.contains("override")) {
    hyperHTML$1.bind(sotd)`${populateSoTD(conf, sotd)}`;
  }

  if (!conf.implementationReportURI && conf.isCR) {
    pub(
      "error",
      "CR documents must have an [`implementationReportURI`](https://github.com/w3c/respec/wiki/implementationReportURI) " +
        "that describes [implementation experience](https://www.w3.org/2019/Process-20190301/#implementation-experience)."
    );
  }
  if (!conf.implementationReportURI && conf.isPR) {
    pub(
      "warn",
      "PR documents should include an " +
        " [`implementationReportURI`](https://github.com/w3c/respec/wiki/implementationReportURI)" +
        " that describes [implementation experience](https://www.w3.org/2019/Process-20190301/#implementation-experience)."
    );
  }

  // Requested by https://github.com/w3c/respec/issues/504
  // Makes a record of a few auto-generated things.
  pub("amend-user-config", {
    publishISODate: conf.publishISODate,
    generatedSubtitle: `${conf.longStatus} ${conf.publishHumanDate}`,
  });
}

/**
 * @param {*} conf
 * @param {HTMLElement} sotd
 */
function populateSoTD(conf, sotd) {
  const options = {
    ...collectSotdContent(sotd, conf),

    get mailToWGPublicList() {
      return `mailto:${conf.wgPublicList}@w3.org`;
    },
    get mailToWGPublicListWithSubject() {
      const fragment = conf.subjectPrefix
        ? `?subject=${encodeURIComponent(conf.subjectPrefix)}`
        : "";
      return this.mailToWGPublicList + fragment;
    },
    get mailToWGPublicListSubscription() {
      return `mailto:${conf.wgPublicList}-request@w3.org?subject=subscribe`;
    },
  };
  const template = conf.isCGBG ? cgbgSotdTmpl : sotdTmpl;
  return template(conf, options);
}

/**
 * @param {HTMLElement} sotd
 */
function collectSotdContent(sotd, { isTagFinding = false }) {
  const sotdClone = sotd.cloneNode(true);
  const additionalContent = document.createDocumentFragment();
  // we collect everything until we hit a section,
  // that becomes the custom content.
  while (sotdClone.hasChildNodes()) {
    if (
      isElement(sotdClone.firstChild) &&
      sotdClone.firstChild.localName === "section"
    ) {
      break;
    }
    additionalContent.appendChild(sotdClone.firstChild);
  }
  if (isTagFinding && !additionalContent.hasChildNodes()) {
    pub(
      "warn",
      "ReSpec does not support automated SotD generation for TAG findings, " +
        "please add the prerequisite content in the 'sotd' section"
    );
  }
  return {
    additionalContent,
    // Whatever sections are left, we throw at the end.
    additionalSections: sotdClone.childNodes,
  };
}

/**
 * @param {string} orcid Either an ORCID URL or just the 16-digit ID which comes after the /
 * @return {string} the full ORCID URL. Throws an error if the ID is invalid.
 */
function normalizeOrcid(orcid) {
  const orcidUrl = new URL(orcid, "https://orcid.org/");
  if (orcidUrl.origin !== "https://orcid.org") {
    throw new Error(
      `The origin should be "https://orcid.org", not "${orcidUrl.origin}".`
    );
  }

  // trailing slash would mess up checksum
  const orcidId = orcidUrl.pathname.slice(1).replace(/\/$/, "");
  if (!/^\d{4}-\d{4}-\d{4}-\d{3}(\d|X)$/.test(orcidId)) {
    throw new Error(
      `ORCIDs have the format "1234-1234-1234-1234", not "${orcidId}"`
    );
  }

  // calculate checksum as per https://support.orcid.org/hc/en-us/articles/360006897674-Structure-of-the-ORCID-Identifier
  const lastDigit = orcidId[orcidId.length - 1];
  const remainder = orcidId
    .split("")
    .slice(0, -1)
    .filter(c => /\d/.test(c))
    .map(Number)
    .reduce((acc, c) => (acc + c) * 2, 0);
  const lastDigitInt = (12 - (remainder % 11)) % 11;
  const lastDigitShould = lastDigitInt === 10 ? "X" : String(lastDigitInt);
  if (lastDigit !== lastDigitShould) {
    throw new Error(`"${orcidId}" has an invalid checksum.`);
  }

  return orcidUrl.href;
}

/**
 * @param {Node} node
 * @return {node is Element}
 */
function isElement(node) {
  return node.nodeType === Node.ELEMENT_NODE;
}

var headers = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$m,
  run: run$a
});

// @ts-check
const name$n = "w3c/abstract";

async function run$b() {
  const abs = document.getElementById("abstract");
  if (!abs) {
    pub("error", `Document must have one element with \`id="abstract"`);
    return;
  }
  abs.classList.add("introductory");
  let abstractHeading = document.querySelector("#abstract>h2");
  if (abstractHeading) {
    return;
  }
  abstractHeading = document.createElement("h2");
  abstractHeading.textContent = l10n[lang].abstract;
  abs.prepend(abstractHeading);
}

var abstract = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$n,
  run: run$b
});

// @ts-check

const name$o = "core/data-transform";

function run$c() {
  /** @type {NodeListOf<HTMLElement>} */
  const transformables = document.querySelectorAll("[data-transform]");
  transformables.forEach(el => {
    el.innerHTML = runTransforms(el.innerHTML, el.dataset.transform);
    el.removeAttribute("data-transform");
  });
}

var dataTransform = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$o,
  run: run$c
});

// @ts-check
const name$p = "core/dfn-abbr";

function run$d() {
  /** @type {NodeListOf<HTMLElement>} */
  const elements = document.querySelectorAll("[data-abbr]");
  for (const elem of elements) {
    const { localName } = elem;
    switch (localName) {
      case "dfn":
        processDfnElement(elem);
        break;
      default: {
        const msg =
          `[\`data-abbr\`](https://github.com/w3c/respec/wiki/data-abbr)` +
          ` attribute not supported on \`${localName}\` elements.`;
        showInlineWarning(elem, msg, "Error: unsupported.");
      }
    }
  }
}
/**
 * @param {HTMLElement} dfn
 */
function processDfnElement(dfn) {
  const abbr = generateAbbreviation(dfn);
  // get normalized <dfn> textContent to remove spaces, tabs, new lines.
  const fullForm = dfn.textContent.replace(/\s\s+/g, " ").trim();
  dfn.insertAdjacentHTML(
    "afterend",
    ` (<abbr title="${fullForm}">${abbr}</abbr>)`
  );
  const lt = dfn.dataset.lt || "";
  dfn.dataset.lt = lt
    .split("|")
    .filter(i => i.trim())
    .concat(abbr)
    .join("|");
}

function generateAbbreviation(elem) {
  if (elem.dataset.abbr) return elem.dataset.abbr;
  // Generates abbreviation from textContent
  // e.g., "Permanent Account Number" -> "PAN"
  return elem.textContent
    .match(/\b([a-z])/gi)
    .join("")
    .toUpperCase();
}

var dataAbbr = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$p,
  run: run$d
});

// @ts-check
const idlPrimitiveRegex = /^[a-z]+(\s+[a-z]+)+$/; // {{unrestricted double}} {{ double }}
const exceptionRegex = /\B"([^"]*)"\B/; // {{ "SomeException" }}
const methodRegex = /(\w+)\((.*)\)$/;
const slotRegex = /^\[\[(\w+)\]\]$/;
// matches: `value` or `[[value]]`
// NOTE: [[value]] is actually a slot, but database has this as type="attribute"
const attributeRegex = /^((?:\[\[)?(?:\w+)(?:\]\])?)$/;
const enumRegex = /^(\w+)\["([\w- ]*)"\]$/;
// TODO: const splitRegex = /(?<=\]\]|\b)\./
// https://github.com/w3c/respec/pull/1848/files#r225087385
const methodSplitRegex = /\.?(\w+\(.*\)$)/;

/**
 * @typedef {object} IdlBase
 * @property {"base"} type
 * @property {string} identifier
 * @property {boolean} renderParent
 * @property {InlineIdl | null} [parent]
 *
 * @typedef {object} IdlAttribute
 * @property {"attribute"} type
 * @property {string} identifier
 * @property {boolean} renderParent
 * @property {InlineIdl | null} [parent]
 *
 * @typedef {object} IdlInternalSlot
 * @property {"internal-slot"} type
 * @property {string} identifier
 * @property {boolean} renderParent
 * @property {InlineIdl | null} [parent]
 *
 * @typedef {object} IdlMethod
 * @property {"method"} type
 * @property {string} identifier
 * @property {string[]} args
 * @property {boolean} renderParent
 * @property {InlineIdl | null} [parent]
 *
 * @typedef {object} IdlEnum
 * @property {"enum"} type
 * @property {string} [identifier]
 * @property {string} enumValue
 * @property {boolean} renderParent
 * @property {InlineIdl | null} [parent]
 *
 * @typedef {object} IdlException
 * @property {"exception"} type
 * @property {string} identifier
 * @property {InlineIdl | null} [parent]
 *
 * @typedef {object} IdlPrimitive
 * @property {"idl-primitive"} type
 * @property {string} identifier
 * @property {boolean} renderParent
 * @property {InlineIdl | null} [parent]
 *
 * @typedef {IdlBase | IdlAttribute | IdlInternalSlot | IdlMethod | IdlEnum | IdlException | IdlPrimitive} InlineIdl
 */

/**
 * @param {string} str
 * @returns {InlineIdl[]}
 */
function parseInlineIDL(str) {
  const [nonMethodPart, methodPart] = str.split(methodSplitRegex);
  const tokens = nonMethodPart
    .split(/[./]/)
    .concat(methodPart)
    .filter(s => s && s.trim())
    .map(s => s.trim());
  const renderParent = !str.includes("/");
  /** @type {InlineIdl[]} */
  const results = [];
  while (tokens.length) {
    const value = tokens.pop();
    // Method
    if (methodRegex.test(value)) {
      const [, identifier, allArgs] = value.match(methodRegex);
      const args = allArgs.split(/,\s*/).filter(arg => arg);
      results.push({ type: "method", identifier, args, renderParent });
      continue;
    }
    // Enum["enum value"]
    if (enumRegex.test(value)) {
      const [, identifier, enumValue] = value.match(enumRegex);
      results.push({ type: "enum", identifier, enumValue, renderParent });
      continue;
    }
    // Exception - "NotAllowedError"
    // Or alternate enum syntax: {{ EnumContainer / "some enum value" }}
    if (exceptionRegex.test(value)) {
      const [, identifier] = value.match(exceptionRegex);
      if (renderParent) {
        results.push({ type: "exception", identifier });
      } else {
        results.push({ type: "enum", enumValue: identifier, renderParent });
      }
      continue;
    }
    // internal slot
    if (slotRegex.test(value)) {
      const [, identifier] = value.match(slotRegex);
      results.push({ type: "internal-slot", identifier, renderParent });
      continue;
    }
    // attribute
    if (attributeRegex.test(value) && tokens.length) {
      const [, identifier] = value.match(attributeRegex);
      results.push({ type: "attribute", identifier, renderParent });
      continue;
    }
    if (idlPrimitiveRegex.test(value)) {
      results.push({ type: "idl-primitive", identifier: value, renderParent });
      continue;
    }
    // base, always final token
    if (attributeRegex.test(value) && tokens.length === 0) {
      results.push({ type: "base", identifier: value, renderParent });
      continue;
    }
    throw new SyntaxError(`IDL micro-syntax parsing error in \`{{ ${str} }}\``);
  }
  // link the list
  results.forEach((item, i, list) => {
    item.parent = list[i + 1] || null;
  });
  // return them in the order we found them...
  return results.reverse();
}

/**
 * @param {IdlBase} details
 */
function renderBase(details) {
  // Check if base is a local variable in a section
  const { identifier, renderParent } = details;
  if (renderParent) {
    return hyperHTML$1`<a data-xref-type="_IDL_"><code>${identifier}</code></a>`;
  }
}

/**
 * Internal slot: .[[identifier]] or [[identifier]]
 * @param {IdlInternalSlot} details
 */
function renderInternalSlot(details) {
  const { identifier, parent, renderParent } = details;
  const { identifier: linkFor } = parent || {};
  const lt = `[[${identifier}]]`;
  const html = hyperHTML$1`${parent && renderParent ? "." : ""}<a
    data-xref-type="attribute"
    data-link-for=${linkFor}
    data-xref-for=${linkFor}
    data-lt="${lt}"><code>[[${identifier}]]</code></a>`;
  return html;
}

/**
 * Attribute: .identifier
 * @param {IdlAttribute} details
 */
function renderAttribute(details) {
  const { parent, identifier, renderParent } = details;
  const { identifier: linkFor } = parent || {};
  const html = hyperHTML$1`${renderParent ? "." : ""}<a
      data-xref-type="attribute|dict-member"
      data-link-for="${linkFor}"
      data-xref-for="${linkFor}"
    ><code>${identifier}</code></a>`;
  return html;
}

/**
 * Method: .identifier(arg1, arg2, ...), identifier(arg1, arg2, ...)
 * @param {IdlMethod} details
 */
function renderMethod(details) {
  const { args, identifier, type, parent, renderParent } = details;
  const { identifier: linkFor } = parent || {};
  const argsText = args.map(arg => `<var>${arg}</var>`).join(", ");
  const searchText = `${identifier}(${args.join(", ")})`;
  const html = hyperHTML$1`${parent && renderParent ? "." : ""}<a
    data-xref-type="${type}"
    data-link-for="${linkFor}"
    data-xref-for="${linkFor}"
    data-lt="${searchText}"
    ><code>${identifier}</code></a><code>(${[argsText]})</code>`;
  return html;
}

/**
 * Enum:
 * Identifier["enum value"]
 * Identifer / "enum value"
 * @param {IdlEnum} details
 */
function renderEnum(details) {
  const { identifier, enumValue, parent } = details;
  const forContext = parent ? parent.identifier : identifier;
  const html = hyperHTML$1`"<a
    data-xref-type="enum-value"
    data-link-for="${forContext}"
    data-xref-for="${forContext}"
    data-lt="${!enumValue ? "the-empty-string" : null}"
    ><code>${enumValue}</code></a>"`;
  return html;
}

/**
 * Exception value: "NotAllowedError"
 * Only the WebIDL spec can define exceptions
 * @param {IdlException} details
 */
function renderException(details) {
  const { identifier } = details;
  const html = hyperHTML$1`"<a
    data-cite="WebIDL"
    data-xref-type="exception"
    ><code>${identifier}</code></a>"`;
  return html;
}

/**
 * Interface types: {{ unrestricted double }} {{long long}}
 * Only the WebIDL spec defines these types.
 * @param {IdlPrimitive} details
 */
function renderIdlPrimitiveType(details) {
  const { identifier } = details;
  const html = hyperHTML$1`<a
    data-cite="WebIDL"
    data-xref-type="interface"
    ><code>${identifier}</code></a>`;
  return html;
}

/**
 * Generates HTML by parsing an IDL string
 * @param {String} str IDL string
 * @return {Node} html output
 */
function idlStringToHtml(str) {
  let results;
  try {
    results = parseInlineIDL(str);
  } catch (error) {
    const el = hyperHTML$1`<span>{{ ${str} }}</span>`;
    showInlineError(el, error.message, "Error: Invalid inline IDL string");
    return el;
  }
  const render = hyperHTML$1(document.createDocumentFragment());
  const output = [];
  for (const details of results) {
    switch (details.type) {
      case "base": {
        const base = renderBase(details);
        if (base) output.push(base);
        break;
      }
      case "attribute":
        output.push(renderAttribute(details));
        break;
      case "internal-slot":
        output.push(renderInternalSlot(details));
        break;
      case "method":
        output.push(renderMethod(details));
        break;
      case "enum":
        output.push(renderEnum(details));
        break;
      case "exception":
        output.push(renderException(details));
        break;
      case "idl-primitive":
        output.push(renderIdlPrimitiveType(details));
        break;
      default:
        throw new Error("Unknown type.");
    }
  }
  const result = render`${output}`;
  return result;
}

// @ts-check

/**
 * @typedef {keyof BiblioDb} AllowedType
 * @type {Set<AllowedType>}
 */
const ALLOWED_TYPES = new Set(["alias", "reference"]);
/* Database initialization tracker */
const readyPromise = openIdb();

/**
 * @typedef {object} BiblioDb
 *
 * @property {object} alias Object store for alias objects
 * @property {string} alias.key
 * @property {object} alias.value
 * @property {object} alias.indexes
 * @property {string} alias.aliasOf
 *
 * @property {object} reference Object store for reference objects
 * @property {string} reference.key
 * @property {object} reference.value
 *
 * @returns {Promise<import("idb").IDBPDatabase<BiblioDb>>}
 */
async function openIdb() {
  return await idb.openDB("respec-biblio2", 12, {
    upgrade(db) {
      Array.from(db.objectStoreNames).map(storeName =>
        db.deleteObjectStore(storeName)
      );
      const store = db.createObjectStore("alias", { keyPath: "id" });
      store.createIndex("aliasOf", "aliasOf", { unique: false });
      db.createObjectStore("reference", { keyPath: "id" });
    },
  });
}

const biblioDB = {
  get ready() {
    return readyPromise;
  },
  /**
   * Finds either a reference or an alias.
   * If it's an alias, it resolves it.
   *
   * @param {String} id The reference or alias to look for.
   * @return {Promise<Object?>} The reference or null.
   */
  async find(id) {
    if (await this.isAlias(id)) {
      id = await this.resolveAlias(id);
    }
    return await this.get("reference", id);
  },
  /**
   * Checks if the database has an id for a given type.
   *
   * @param {AllowedType} type One of the ALLOWED_TYPES.
   * @param {String} id The reference to find.
   * @return {Promise<Boolean>} True if it has it, false otherwise.
   */
  async has(type, id) {
    if (!ALLOWED_TYPES.has(type)) {
      throw new TypeError(`Invalid type: ${type}`);
    }
    if (!id) {
      throw new TypeError("id is required");
    }
    const db = await this.ready;
    const objectStore = db.transaction(type, "readonly").store;
    const range = IDBKeyRange.only(id);
    const result = await objectStore.openCursor(range);
    return !!result;
  },
  /**
   * Checks if a given id is an alias.
   *
   * @param {String} id The reference to check.
   * @return {Promise<Boolean>} Resolves with true if found.
   */
  async isAlias(id) {
    return await this.has("alias", id);
  },
  /**
   * Resolves an alias to its corresponding reference id.
   *
   * @param {String} id The id of the alias to look up.
   * @return {Promise<String>} The id of the resolved reference.
   */
  async resolveAlias(id) {
    if (!id) {
      throw new TypeError("id is required");
    }
    const db = await this.ready;

    const objectStore = db.transaction("alias", "readonly").store;
    const range = IDBKeyRange.only(id);
    const result = await objectStore.openCursor(range);
    return result ? result.value.aliasOf : result;
  },
  /**
   * Get a reference or alias out of the database.
   *
   * @param {AllowedType} type The type as per ALLOWED_TYPES.
   * @param {string} id The id for what to look up.
   * @return {Promise<Object?>} Resolves with the retrieved object, or null.
   */
  async get(type, id) {
    if (!ALLOWED_TYPES.has(type)) {
      throw new TypeError(`Invalid type: ${type}`);
    }
    if (!id) {
      throw new TypeError("id is required");
    }
    const db = await this.ready;
    const objectStore = db.transaction(type, "readonly").store;
    const range = IDBKeyRange.only(id);
    const result = await objectStore.openCursor(range);
    return result ? result.value : result;
  },
  /**
   * Adds references and aliases to database. This is usually the data from
   * Specref's output (parsed JSON).
   *
   * @param {Object} data An object that contains references and aliases.
   */
  async addAll(data) {
    if (!data) {
      return;
    }
    const aliasesAndRefs = {
      alias: new Set(),
      reference: new Set(),
    };
    Object.keys(data)
      .filter(key => {
        if (typeof data[key] === "string") {
          let msg = `Legacy SpecRef entries are not supported: \`[[${key}]]\`. `;
          msg +=
            "Please update it to the new format at [specref repo](https://github.com/tobie/specref/)";
          pub("error", msg);
          return false;
        }
        return true;
      })
      .map(id => Object.assign({ id }, data[id]))
      .forEach(obj => {
        if (obj.aliasOf) {
          aliasesAndRefs.alias.add(obj);
        } else {
          aliasesAndRefs.reference.add(obj);
        }
      });
    const promisesToAdd = [...ALLOWED_TYPES]
      .map(type => {
        return Array.from(aliasesAndRefs[type]).map(details =>
          this.add(type, details)
        );
      })
      .reduce(flatten$1, []);
    await Promise.all(promisesToAdd);
  },
  /**
   * Adds a reference or alias to the database.
   *
   * @param {AllowedType} type The type as per ALLOWED_TYPES.
   * @param {Object} details The object to store.
   */
  async add(type, details) {
    if (!ALLOWED_TYPES.has(type)) {
      throw new TypeError(`Invalid type: ${type}`);
    }
    if (typeof details !== "object") {
      throw new TypeError("details should be an object");
    }
    if (type === "alias" && !details.hasOwnProperty("aliasOf")) {
      throw new TypeError("Invalid alias object.");
    }
    const db = await this.ready;
    const isInDB = await this.has(type, details.id);
    const store = db.transaction(type, "readwrite").store;
    // update or add, depending of already having it in db
    return isInDB ? await store.put(details) : await store.add(details);
  },
  /**
   * Closes the underlying database.
   *
   * @return {Promise<void>} Resolves after database closes.
   */
  async close() {
    const db = await this.ready;
    db.close();
  },

  /**
   * Clears the underlying database
   */
  async clear() {
    const db = await this.ready;
    const storeNames = [...ALLOWED_TYPES];
    const stores = db.transaction(storeNames, "readwrite");
    const clearStorePromises = storeNames.map(name => {
      return stores.objectStore(name).clear();
    });
    await Promise.all(clearStorePromises);
  },
};

// @ts-check
const biblio = {};

const name$q = "core/biblio";

const bibrefsURL = new URL("https://specref.herokuapp.com/bibrefs?refs=");

/**
 * Normative references take precedence over informative ones,
 * so any duplicates ones are removed from the informative set.
 */
function normalizeReferences(conf) {
  const normalizedNormativeRefs = new Set(
    [...conf.normativeReferences].map(key => key.toLowerCase())
  );
  Array.from(conf.informativeReferences)
    .filter(key => normalizedNormativeRefs.has(key.toLowerCase()))
    .forEach(redundantKey => conf.informativeReferences.delete(redundantKey));
}

function getRefKeys(conf) {
  return {
    informativeReferences: Array.from(conf.informativeReferences),
    normativeReferences: Array.from(conf.normativeReferences),
  };
}

// Opportunistically dns-prefetch to bibref server, as we don't know yet
// if we will actually need to download references yet.
const link = createResourceHint({
  hint: "dns-prefetch",
  href: bibrefsURL.origin,
});
document.head.appendChild(link);
let doneResolver$2;
const done$2 = new Promise(resolve => {
  doneResolver$2 = resolve;
});

async function updateFromNetwork(
  refs,
  options = { forceUpdate: false }
) {
  const refsToFetch = [...new Set(refs)].filter(ref => ref.trim());
  // Update database if needed, if we are online
  if (!refsToFetch.length || navigator.onLine === false) {
    return null;
  }
  let response;
  try {
    response = await fetch(bibrefsURL.href + refsToFetch.join(","));
  } catch (err) {
    console.error(err);
    return null;
  }
  if ((!options.forceUpdate && !response.ok) || response.status !== 200) {
    return null;
  }
  const data = await response.json();
  try {
    await biblioDB.addAll(data);
  } catch (err) {
    console.error(err);
  }
  return data;
}

/**
 * @param {string} key
 */
async function resolveRef(key) {
  const biblio = await done$2;
  if (!biblio.hasOwnProperty(key)) {
    return null;
  }
  const entry = biblio[key];
  if (entry.aliasOf) {
    return await resolveRef(entry.aliasOf);
  }
  return entry;
}

async function run$e(conf) {
  const finish = () => {
    doneResolver$2(conf.biblio);
  };
  if (!conf.localBiblio) {
    conf.localBiblio = {};
  }
  if (conf.biblio) {
    let msg = "Overriding `.biblio` in config. Please use ";
    msg += "`.localBiblio` for custom biblio entries.";
    pub("warn", msg);
  }
  conf.biblio = biblio;
  const localAliases = Object.keys(conf.localBiblio)
    .filter(key => conf.localBiblio[key].hasOwnProperty("aliasOf"))
    .map(key => conf.localBiblio[key].aliasOf)
    .filter(key => !conf.localBiblio.hasOwnProperty(key));
  normalizeReferences(conf);
  const allRefs = getRefKeys(conf);
  const neededRefs = allRefs.normativeReferences
    .concat(allRefs.informativeReferences)
    // Filter, as to not go to network for local refs
    .filter(key => !conf.localBiblio.hasOwnProperty(key))
    // but include local aliases which refer to external specs
    .concat(localAliases)
    // remove duplicates
    .reduce((collector, item) => {
      if (collector.indexOf(item) === -1) {
        collector.push(item);
      }
      return collector;
    }, [])
    .sort();
  const idbRefs = [];

  // See if we have them in IDB
  try {
    await biblioDB.ready; // can throw
    const promisesToFind = neededRefs.map(async id => ({
      id,
      data: await biblioDB.find(id),
    }));
    idbRefs.push(...(await Promise.all(promisesToFind)));
  } catch (err) {
    // IndexedDB died, so we need to go to the network for all
    // references
    idbRefs.push(...neededRefs.map(id => ({ id, data: null })));
    console.warn(err);
  }
  const split = { hasData: [], noData: [] };
  idbRefs.forEach(ref => {
    (ref.data ? split.hasData : split.noData).push(ref);
  });
  split.hasData.forEach(ref => {
    biblio[ref.id] = ref.data;
  });
  const externalRefs = split.noData.map(item => item.id);
  if (externalRefs.length) {
    // Going to the network for refs we don't have
    const data = await updateFromNetwork(externalRefs, { forceUpdate: true });
    Object.assign(biblio, data);
  }
  Object.assign(biblio, conf.localBiblio);
  finish();
}

var biblio$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  biblio: biblio,
  name: name$q,
  updateFromNetwork: updateFromNetwork,
  resolveRef: resolveRef,
  run: run$e,
  wireReference: wireReference,
  stringifyReference: stringifyReference
});

// @ts-check

const name$r = "core/render-biblio";

const localizationStrings$4 = {
  en: {
    info_references: "Informative references",
    norm_references: "Normative references",
    references: "References",
  },
  nl: {
    info_references: "Informatieve referenties",
    norm_references: "Normatieve referenties",
    references: "Referenties",
  },
  es: {
    info_references: "Referencias informativas",
    norm_references: "Referencias normativas",
    references: "Referencias",
  },
};

const l10n$6 = getIntlData(localizationStrings$4);

const REF_STATUSES = new Map([
  ["CR", "W3C Candidate Recommendation"],
  ["ED", "W3C Editor's Draft"],
  ["FPWD", "W3C First Public Working Draft"],
  ["LCWD", "W3C Last Call Working Draft"],
  ["NOTE", "W3C Note"],
  ["PER", "W3C Proposed Edited Recommendation"],
  ["PR", "W3C Proposed Recommendation"],
  ["REC", "W3C Recommendation"],
  ["WD", "W3C Working Draft"],
  ["WG-NOTE", "W3C Working Group Note"],
]);

const defaultsReference = Object.freeze({
  authors: [],
  date: "",
  href: "",
  publisher: "",
  status: "",
  title: "",
  etAl: false,
});

const endWithDot = endNormalizer(".");

function run$f(conf) {
  const informs = Array.from(conf.informativeReferences);
  const norms = Array.from(conf.normativeReferences);

  if (!informs.length && !norms.length) return;

  const refSection =
    document.querySelector("section#references") ||
    hyperHTML$1`<section id='references'></section>`;

  if (!document.querySelector("section#references > h2")) {
    refSection.prepend(hyperHTML$1`<h2>${l10n$6.references}</h2>`);
  }

  refSection.classList.add("appendix");

  for (const type of ["Normative", "Informative"]) {
    const refs = type === "Normative" ? norms : informs;
    if (!refs.length) continue;

    const sec = hyperHTML$1`
      <section>
        <h3>${
          type === "Normative" ? l10n$6.norm_references : l10n$6.info_references
        }</h3>
      </section>`;
    addId(sec);

    const { goodRefs, badRefs } = refs.map(toRefContent).reduce(
      (refObjects, ref) => {
        const refType = ref.refcontent ? "goodRefs" : "badRefs";
        refObjects[refType].push(ref);
        return refObjects;
      },
      { goodRefs: [], badRefs: [] }
    );

    const uniqueRefs = [
      ...goodRefs
        .reduce((uniqueRefs, ref) => {
          if (!uniqueRefs.has(ref.refcontent.id)) {
            // the condition ensures that only the first used [[TERM]]
            // shows up in #references section
            uniqueRefs.set(ref.refcontent.id, ref);
          }
          return uniqueRefs;
        }, new Map())
        .values(),
    ];

    const refsToShow = uniqueRefs
      .concat(badRefs)
      .sort((a, b) =>
        a.ref.toLocaleLowerCase().localeCompare(b.ref.toLocaleLowerCase())
      );

    sec.appendChild(hyperHTML$1`
      <dl class='bibliography'>
        ${refsToShow.map(showRef)}
      </dl>`);
    refSection.appendChild(sec);

    const aliases = getAliases(goodRefs);
    decorateInlineReference(uniqueRefs, aliases);
    warnBadRefs(badRefs);
  }

  document.body.appendChild(refSection);
}

/**
 * returns refcontent and unique key for a reference among its aliases
 * and warns about circular references
 * @param {String} ref
 */
function toRefContent(ref) {
  let refcontent = biblio[ref];
  let key = ref;
  const circular = new Set([key]);
  while (refcontent && refcontent.aliasOf) {
    if (circular.has(refcontent.aliasOf)) {
      refcontent = null;
      const msg = `Circular reference in biblio DB between [\`${ref}\`] and [\`${key}\`].`;
      pub("error", msg);
    } else {
      key = refcontent.aliasOf;
      refcontent = biblio[key];
      circular.add(key);
    }
  }
  if (refcontent && !refcontent.id) {
    refcontent.id = ref.toLowerCase();
  }
  return { ref, refcontent };
}

/**
 * Render an inline citation
 *
 * @param {String} ref the inline reference.
 * @returns HTMLElement
 */
function renderInlineCitation(ref) {
  const key = ref.replace(/^(!|\?)/, "");
  const href = `#bib-${key.toLowerCase()}`;
  return hyperHTML$1`[<cite><a class="bibref" href="${href}" data-link-type="biblio">${key}</a></cite>]`;
}

/**
 * renders a reference
 */
function showRef({ ref, refcontent }) {
  const refId = `bib-${ref.toLowerCase()}`;
  if (refcontent) {
    return hyperHTML$1`
      <dt id="${refId}">[${ref}]</dt>
      <dd>${{ html: stringifyReference(refcontent) }}</dd>
    `;
  } else {
    return hyperHTML$1`
      <dt id="${refId}">[${ref}]</dt>
      <dd><em class="respec-offending-element">Reference not found.</em></dd>
    `;
  }
}

function endNormalizer(endStr) {
  return str => {
    const trimmed = str.trim();
    const result =
      !trimmed || trimmed.endsWith(endStr) ? trimmed : trimmed + endStr;
    return result;
  };
}

function wireReference(rawRef, target = "_blank") {
  if (typeof rawRef !== "object") {
    throw new TypeError("Only modern object references are allowed");
  }
  const ref = Object.assign({}, defaultsReference, rawRef);
  const authors = ref.authors.join("; ") + (ref.etAl ? " et al" : "");
  const status = REF_STATUSES.get(ref.status) || ref.status;
  return hyperHTML$1.wire(ref)`
    <cite>
      <a
        href="${ref.href}"
        target="${target}"
        rel="noopener noreferrer">
        ${ref.title.trim()}</a>.
    </cite>
    <span class="authors">
      ${endWithDot(authors)}
    </span>
    <span class="publisher">
      ${endWithDot(ref.publisher)}
    </span>
    <span class="pubDate">
      ${endWithDot(ref.date)}
    </span>
    <span class="pubStatus">
      ${endWithDot(status)}
    </span>
  `;
}

function stringifyReference(ref) {
  if (typeof ref === "string") return ref;
  let output = `<cite>${ref.title}</cite>`;

  output = ref.href ? `<a href="${ref.href}">${output}</a>. ` : `${output}. `;

  if (ref.authors && ref.authors.length) {
    output += ref.authors.join("; ");
    if (ref.etAl) output += " et al";
    output += ". ";
  }
  if (ref.publisher) {
    output = `${output} ${endWithDot(ref.publisher)} `;
  }
  if (ref.date) output += `${ref.date}. `;
  if (ref.status) output += `${REF_STATUSES.get(ref.status) || ref.status}. `;
  if (ref.href) output += `URL: <a href="${ref.href}">${ref.href}</a>`;
  return output;
}

/**
 * get aliases for a reference "key"
 */
function getAliases(refs) {
  return refs.reduce((aliases, ref) => {
    const key = ref.refcontent.id;
    const keys = !aliases.has(key)
      ? aliases.set(key, []).get(key)
      : aliases.get(key);
    keys.push(ref.ref);
    return aliases;
  }, new Map());
}

/**
 * fix biblio reference URLs
 * Add title attribute to references
 */
function decorateInlineReference(refs, aliases) {
  refs
    .map(({ ref, refcontent }) => {
      const refUrl = `#bib-${ref.toLowerCase()}`;
      const selectors = aliases
        .get(refcontent.id)
        .map(alias => `a.bibref[href="#bib-${alias.toLowerCase()}"]`)
        .join(",");
      const elems = document.querySelectorAll(selectors);
      return { refUrl, elems, refcontent };
    })
    .forEach(({ refUrl, elems, refcontent }) => {
      elems.forEach(a => {
        a.setAttribute("href", refUrl);
        a.setAttribute("title", refcontent.title);
        a.dataset.linkType = "biblio";
      });
    });
}

/**
 * warn about bad references
 */
function warnBadRefs(badRefs) {
  badRefs.forEach(({ ref }) => {
    const badrefs = [
      ...document.querySelectorAll(
        `a.bibref[href="#bib-${ref.toLowerCase()}"]`
      ),
    ].filter(({ textContent: t }) => t.toLowerCase() === ref.toLowerCase());
    const msg = `Bad reference: [\`${ref}\`] (appears ${badrefs.length} times)`;
    pub("error", msg);
    console.warn("Bad references: ", badrefs);
  });
}

var renderBiblio = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$r,
  run: run$f,
  renderInlineCitation: renderInlineCitation,
  wireReference: wireReference,
  stringifyReference: stringifyReference
});

// @ts-check

const name$s = "core/inlines";
const rfc2119Usage = {};

// Inline `code`
// TODO: Replace (?!`) at the end with (?:<!`) at the start when Firefox + Safari
// add support.
const inlineCodeRegExp = /(?:`[^`]+`)(?!`)/; // `code`
const inlineIdlReference = /(?:{{[^}]+}})/; // {{ WebIDLThing }}
const inlineVariable = /\B\|\w[\w\s]*(?:\s*:[\w\s&;<>]+)?\|\B/; // |var : Type|
const inlineCitation = /(?:\[\[(?:!|\\|\?)?[A-Za-z0-9.-]+\]\])/; // [[citation]]
const inlineExpansion = /(?:\[\[\[(?:!|\\|\?)?#?[\w-.]+\]\]\])/; // [[[expand]]]
const inlineAnchor = /(?:\[=[^=]+=\])/; // Inline [= For/link =]
const inlineElement = /(?:\[\^[A-Za-z]+(?:-[A-Za-z]+)?\^\])/; // Inline [^element^]

/**
 * @param {string} matched
 * @return {HTMLElement}
 */
function inlineElementMatches(matched) {
  const value = matched.slice(2, -2).trim();
  const html = hyperHTML$1`<code><a data-xref-type="element">${value}</a></code>`;
  return html;
}

/**
 * @param {string} matched
 * @return {HTMLElement}
 */
function inlineRFC2119Matches(matched) {
  const value = norm(matched);
  const nodeElement = hyperHTML$1`<em class="rfc2119" title="${value}">${value}</em>`;
  // remember which ones were used
  rfc2119Usage[value] = true;
  return nodeElement;
}

/**
 * @param {string} matched
 * @return {HTMLElement}
 */
function inlineRefMatches(matched) {
  // slices "[[[" at the beginning and "]]]" at the end
  const ref = matched.slice(3, -3).trim();
  if (!ref.startsWith("#")) {
    return hyperHTML$1`<a data-cite="${ref}"></a>`;
  }
  if (document.querySelector(ref)) {
    return hyperHTML$1`<a href="${ref}"></a>`;
  }
  const badReference = hyperHTML$1`<span>${matched}</span>`;
  showInlineError(
    badReference, // cite element
    `Wasn't able to expand ${matched} as it didn't match any id in the document.`,
    `Please make sure there is element with id ${ref} in the document.`
  );
  return badReference;
}

/**
 * @param {string} matched
 */
function inlineXrefMatches(matched) {
  // slices "{{" at the beginning and "}}" at the end
  const ref = matched.slice(2, -2).trim();
  return ref.startsWith("\\")
    ? matched.replace("\\", "")
    : idlStringToHtml(norm(ref));
}

/**
 * @param {string} matched
 * @param {Text} txt
 * @param {Object} conf
 * @return {Iterable<string | Node>}
 */
function inlineBibrefMatches(matched, txt, conf) {
  // slices "[[" at the start and "]]" at the end
  const ref = matched.slice(2, -2);
  if (ref.startsWith("\\")) {
    return [`[[${ref.slice(1)}]]`];
  }
  const { type, illegal } = refTypeFromContext(ref, txt.parentNode);
  const cite = renderInlineCitation(ref);
  const cleanRef = ref.replace(/^(!|\?)/, "");
  if (illegal && !conf.normativeReferences.has(cleanRef)) {
    showInlineWarning(
      cite.childNodes[1], // cite element
      "Normative references in informative sections are not allowed. " +
        `Remove '!' from the start of the reference \`[[${ref}]]\``
    );
  }

  if (type === "informative" && !illegal) {
    conf.informativeReferences.add(cleanRef);
  } else {
    conf.normativeReferences.add(cleanRef);
  }
  return cite.childNodes;
}

/**
 * @param {string} matched
 * @param {Text} txt
 * @param {Map<string, string>} abbrMap
 */
function inlineAbbrMatches(matched, txt, abbrMap) {
  return txt.parentElement.tagName === "ABBR"
    ? matched
    : hyperHTML$1`<abbr title="${abbrMap.get(matched)}">${matched}</abbr>`;
}

/**
 * @example |varName: type| => <var data-type="type">varName</var>
 * @example |varName| => <var>varName</var>
 * @param {string} matched
 */
function inlineVariableMatches(matched) {
  // remove "|" at the beginning and at the end, then split at an optional `:`
  const matches = matched.slice(1, -1).split(":", 2);
  const [varName, type] = matches.map(s => s.trim());
  return hyperHTML$1`<var data-type="${type}">${varName}</var>`;
}

/**
 * @example [= foo =] => <a>foo</a>
 * @example [= bar/foo =] => <a data-link-for="bar" data-xref-for="bar">foo</a>
 * @example [= `foo` =] => <a><code>foo</code></a>
 * @example [= foo|bar =] => <a data-lt="foo">bar</a>
 * @param {string} matched
 */
function inlineAnchorMatches(matched) {
  matched = matched.slice(2, -2); // Chop [= =]
  const parts = matched.split("/", 2).map(s => s.trim());
  const [isFor, content] = parts.length === 2 ? parts : [null, parts[0]];
  const [linkingText, text] = content.includes("|")
    ? content.split("|", 2).map(s => s.trim())
    : [null, content];
  const processedContent = processInlineContent(text);
  const forContext = isFor ? norm(isFor) : null;
  return hyperHTML$1`<a data-link-for="${forContext}" data-xref-for="${forContext}" data-lt="${linkingText}">${processedContent}</a>`;
}

function inlineCodeMatches(matched) {
  const clean = matched.slice(1, -1); // Chop ` and `
  return hyperHTML$1`<code>${clean}</code>`;
}

function processInlineContent(text) {
  if (inlineCodeRegExp.test(text)) {
    // We use a capture group to split, so we can process all the parts.
    return text.split(/(`[^`]+`)(?!`)/).map(part => {
      return part.startsWith("`")
        ? inlineCodeMatches(part)
        : processInlineContent(part);
    });
  }
  return document.createTextNode(text);
}

function run$g(conf) {
  const abbrMap = new Map();
  document.normalize();
  if (!document.querySelector("section#conformance")) {
    // make the document informative
    document.body.classList.add("informative");
  }
  conf.normativeReferences = new InsensitiveStringSet();
  conf.informativeReferences = new InsensitiveStringSet();

  if (!conf.respecRFC2119) conf.respecRFC2119 = rfc2119Usage;

  // PRE-PROCESSING
  /** @type {NodeListOf<HTMLElement>} */
  const abbrs = document.querySelectorAll("abbr[title]");
  for (const abbr of abbrs) {
    abbrMap.set(abbr.textContent, abbr.title);
  }
  const aKeys = [...abbrMap.keys()];
  const abbrRx = aKeys.length ? `(?:\\b${aKeys.join("\\b)|(?:\\b")}\\b)` : null;

  // PROCESSING
  // Don't gather text nodes for these:
  const exclusions = ["#respec-ui", ".head", "pre"];
  const txts = getTextNodes(document.body, exclusions, {
    wsNodes: false, // we don't want nodes with just whitespace
  });
  const keywords = new RegExp(
    [
      "\\bMUST(?:\\s+NOT)?\\b",
      "\\bSHOULD(?:\\s+NOT)?\\b",
      "\\bSHALL(?:\\s+NOT)?\\b",
      "\\bMAY\\b",
      "\\b(?:NOT\\s+)?REQUIRED\\b",
      "\\b(?:NOT\\s+)?RECOMMENDED\\b",
      "\\bOPTIONAL\\b",
    ].join("|")
  );
  const rx = new RegExp(
    `(${[
      keywords.source,
      inlineIdlReference.source,
      inlineVariable.source,
      inlineCitation.source,
      inlineExpansion.source,
      inlineAnchor.source,
      inlineCodeRegExp.source,
      inlineElement.source,
      ...(abbrRx ? [abbrRx] : []),
    ].join("|")})`
  );
  for (const txt of txts) {
    const subtxt = txt.data.split(rx);
    if (subtxt.length === 1) continue;
    const df = document.createDocumentFragment();
    let matched = true;
    for (const t of subtxt) {
      matched = !matched;
      if (!matched) {
        df.append(t);
      } else if (t.startsWith("{{")) {
        const node = inlineXrefMatches(t);
        df.append(node);
      } else if (t.startsWith("[[[")) {
        const node = inlineRefMatches(t);
        df.append(node);
      } else if (t.startsWith("[[")) {
        const nodes = inlineBibrefMatches(t, txt, conf);
        df.append(...nodes);
      } else if (t.startsWith("|")) {
        const node = inlineVariableMatches(t);
        df.append(node);
      } else if (t.startsWith("[=")) {
        const node = inlineAnchorMatches(t);
        df.append(node);
      } else if (t.startsWith("`")) {
        const node = inlineCodeMatches(t);
        df.append(node);
      } else if (t.startsWith("[^")) {
        const node = inlineElementMatches(t);
        df.append(node);
      } else if (abbrMap.has(t)) {
        const node = inlineAbbrMatches(t, txt, abbrMap);
        df.append(node);
      } else if (keywords.test(t)) {
        const node = inlineRFC2119Matches(t);
        df.append(node);
      } else {
        // FAIL -- not sure that this can really happen
        throw new Error(
          `Found token '${t}' but it does not correspond to anything`
        );
      }
    }
    txt.replaceWith(df);
  }
}

var inlines = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$s,
  rfc2119Usage: rfc2119Usage,
  run: run$g
});

// @ts-check
const name$t = "w3c/conformance";

/**
 * @param {Element} conformance
 * @param {*} conf
 */
function processConformance(conformance, conf) {
  const terms = [...Object.keys(rfc2119Usage)];
  // Add RFC2119 to bibliography
  if (terms.length) {
    conf.normativeReferences.add("RFC2119");
    conf.normativeReferences.add("RFC8174");
  }
  // Put in the 2119 clause and reference
  const keywords = htmlJoinAnd(
    terms.sort(),
    item =>
      hyperHTML$1`
        <em class="rfc2119">${item}</em>
      `
  );
  const plural = terms.length > 1;
  const content = hyperHTML$1`
    <h2>Conformance</h2>
    <p>
      As well as sections marked as non-normative, all authoring guidelines,
      diagrams, examples, and notes in this specification are non-normative.
      Everything else in this specification is normative.
    </p>
    ${terms.length
      ? hyperHTML$1`
          <p>
            The key word${plural ? "s" : ""} ${keywords} in this document
            ${plural ? "are" : "is"} to be interpreted as described in
            <a href="https://tools.ietf.org/html/bcp14">BCP 14</a>
            ${renderInlineCitation("RFC2119")}
            ${renderInlineCitation("RFC8174")} when, and only when, they appear
            in all capitals, as shown here.
          </p>
        `
      : null}
  `;
  conformance.prepend(...content.childNodes);
}

function run$h(conf) {
  const conformance = document.querySelector("section#conformance");
  if (conformance && !conformance.classList.contains("override")) {
    processConformance(conformance, conf);
  }
  // Warn when there are RFC2119/RFC8174 keywords, but not conformance section
  if (!conformance && Object.keys(rfc2119Usage).length) {
    pub(
      "warn",
      "Document uses RFC2119 keywords but lacks a conformance section. " +
        'Please add a `<section id="conformance">`.'
    );
  }
  // Added message for legacy compat with Aria specs
  // See https://github.com/w3c/respec/issues/793
  pub("end", name$t);
}

var conformance = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$t,
  run: run$h
});

// @ts-check

const name$u = "core/dfn";

function run$i() {
  document.querySelectorAll("dfn").forEach(dfn => {
    const titles = getDfnTitles(dfn);
    registerDefinition(dfn, titles);

    // Default to `dfn` as the type... other modules may override
    if (!dfn.dataset.dfnType) dfn.dataset.dfnType = "dfn";

    // Only add `lt`s that are different from the text content
    if (titles.length === 1 && titles[0] === norm(dfn.textContent)) {
      return;
    }
    dfn.dataset.lt = titles.join("|");
  });
}

var dfn = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$u,
  run: run$i
});

// @ts-check

const name$v = "core/pluralize";

function run$j(conf) {
  if (!conf.pluralize) return;

  const pluralizeDfn = getPluralizer();

  /** @type {NodeListOf<HTMLElement>} */
  const dfns = document.querySelectorAll(
    "dfn:not([data-lt-no-plural]):not([data-lt-noDefault])"
  );
  dfns.forEach(dfn => {
    const terms = [dfn.textContent];
    if (dfn.dataset.lt) terms.push(...dfn.dataset.lt.split("|"));
    if (dfn.dataset.localLt) {
      terms.push(...dfn.dataset.localLt.split("|"));
    }

    const plurals = new Set(terms.map(pluralizeDfn).filter(plural => plural));

    if (plurals.size) {
      const userDefinedPlurals = dfn.dataset.plurals
        ? dfn.dataset.plurals.split("|")
        : [];
      const uniquePlurals = [...new Set([...userDefinedPlurals, ...plurals])];
      dfn.dataset.plurals = uniquePlurals.join("|");
      registerDefinition(dfn, uniquePlurals);
    }
  });
}

function getPluralizer() {
  /** @type {Set<string>} */
  const links = new Set();
  /** @type {NodeListOf<HTMLAnchorElement>} */
  const reflessAnchors = document.querySelectorAll("a:not([href])");
  reflessAnchors.forEach(el => {
    const normText = norm(el.textContent).toLowerCase();
    links.add(normText);
    if (el.dataset.lt) {
      links.add(el.dataset.lt);
    }
  });

  /** @type {Set<string>} */
  const dfnTexts = new Set();
  /** @type {NodeListOf<HTMLElement>} */
  const dfns = document.querySelectorAll("dfn:not([data-lt-noDefault])");
  dfns.forEach(dfn => {
    const normText = norm(dfn.textContent).toLowerCase();
    dfnTexts.add(normText);
    if (dfn.dataset.lt) {
      dfn.dataset.lt.split("|").forEach(lt => dfnTexts.add(lt));
    }
    if (dfn.dataset.localLt) {
      dfn.dataset.localLt.split("|").forEach(lt => dfnTexts.add(lt));
    }
  });

  // returns pluralized/singularized term if `text` needs pluralization/singularization, "" otherwise
  return function pluralizeDfn(/** @type {string} */ text) {
    const normText = norm(text).toLowerCase();
    const plural = pluralize$1.isSingular(normText)
      ? pluralize$1.plural(normText)
      : pluralize$1.singular(normText);
    return links.has(plural) && !dfnTexts.has(plural) ? plural : "";
  };
}

var pluralize$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$v,
  run: run$j
});

// @ts-check

const name$w = "core/examples";

const localizationStrings$5 = {
  en: {
    example: "Example",
  },
  nl: {
    example: "Voorbeeld",
  },
  es: {
    example: "Ejemplo",
  },
};

const l10n$7 = getIntlData(localizationStrings$5);

const cssPromise = loadStyle$2();

async function loadStyle$2() {
  try {
    return (await Promise.resolve().then(function () { return examples$2; })).default;
  } catch {
    return fetchAsset("examples.css");
  }
}

/**
 * @typedef {object} Report
 * @property {number} number
 * @property {boolean} illegal
 * @property {string} [title]
 * @property {string} [content]
 *
 * @param {HTMLElement} elem
 * @param {number} num
 * @param {Report} report
 */
function makeTitle(elem, num, report) {
  report.title = elem.title;
  if (report.title) elem.removeAttribute("title");
  const number = num > 0 ? ` ${num}` : "";
  const title = report.title
    ? hyperHTML$1`
        <span class="example-title">: ${report.title}</span>
      `
    : "";
  return hyperHTML$1`
    <div class="marker">
      <a class="self-link">${l10n$7.example}<bdi>${number}</bdi></a
      >${title}
    </div>
  `;
}

async function run$k() {
  /** @type {NodeListOf<HTMLElement>} */
  const examples = document.querySelectorAll(
    "pre.example, pre.illegal-example, aside.example"
  );
  if (!examples.length) return;

  const css = await cssPromise;
  document.head.insertBefore(
    hyperHTML$1`
      <style>
        ${css}
      </style>
    `,
    document.querySelector("link")
  );

  let number = 0;
  examples.forEach(example => {
    const illegal = example.classList.contains("illegal-example");
    /** @type {Report} */
    const report = {
      number,
      illegal,
    };
    const { title } = example;
    if (example.localName === "aside") {
      ++number;
      const div = makeTitle(example, number, report);
      example.prepend(div);
      if (title) {
        addId(example, `example-${number}`, title); // title gets used
      } else {
        // use the number as the title... so, e.g., "example-5"
        addId(example, `example`, String(number));
      }
      const { id } = example;
      const selfLink = div.querySelector("a.self-link");
      selfLink.href = `#${id}`;
      pub("example", report);
    } else {
      const inAside = !!example.closest("aside");
      if (!inAside) ++number;

      report.content = example.innerHTML;

      // wrap
      example.classList.remove("example", "illegal-example");
      // relocate the id to the div
      const id = example.id ? example.id : null;
      if (id) example.removeAttribute("id");
      const exampleTitle = makeTitle(example, inAside ? 0 : number, report);
      const div = hyperHTML$1`
        <div class="example" id="${id}">
          ${exampleTitle} ${example.cloneNode(true)}
        </div>
      `;
      if (title) {
        addId(div, `example-${number}`, title);
      }
      addId(div, `example`, String(number));
      const selfLink = div.querySelector("a.self-link");
      selfLink.href = `#${div.id}`;
      example.replaceWith(div);
      if (!inAside) pub("example", report);
    }
  });
}

var examples = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$w,
  run: run$k
});

// @ts-check

const name$x = "core/issues-notes";

const localizationStrings$6 = {
  en: {
    issue_summary: "Issue Summary",
    no_issues_in_spec: "There are no issues listed in this specification.",
  },
  nl: {
    issue_summary: "Lijst met issues",
    no_issues_in_spec: "Er zijn geen problemen vermeld in deze specificatie.",
  },
  es: {
    issue_summary: "Resumen de la cuestión",
    no_issues_in_spec: "No hay problemas enumerados en esta especificación.",
  },
};

const cssPromise$1 = loadStyle$3();

async function loadStyle$3() {
  try {
    return (await Promise.resolve().then(function () { return issuesNotes$2; })).default;
  } catch {
    return fetchAsset("issues-notes.css");
  }
}

const l10n$8 = getIntlData(localizationStrings$6);

/**
 * @typedef {object} Report
 * @property {string} type
 * @property {boolean} inline
 * @property {number} number
 * @property {string} title

 * @typedef {object} GitHubLabel
 * @property {string} color
 * @property {string} name
 *
 * @typedef {object} GitHubIssue
 * @property {string} title
 * @property {string} state
 * @property {string} bodyHTML
 * @property {GitHubLabel[]} labels

 * @param {NodeListOf<HTMLElement>} ins
 * @param {Map<string, GitHubIssue>} ghIssues
 * @param {*} conf
 */
function handleIssues(ins, ghIssues, conf) {
  const hasDataNum = !!document.querySelector(".issue[data-number]");
  let issueNum = 0;
  const issueList = document.createElement("ul");
  ins.forEach(inno => {
    const { type, displayType, isFeatureAtRisk } = getIssueType(inno, conf);
    const isIssue = type === "issue";
    const isInline = inno.localName === "span";
    const { number: dataNum } = inno.dataset;
    /** @type {Partial<Report>} */
    const report = {
      type,
      inline: isInline,
      title: inno.title,
    };
    if (isIssue && !isInline && !hasDataNum) {
      issueNum++;
      report.number = issueNum;
    } else if (dataNum) {
      report.number = Number(dataNum);
    }
    // wrap
    if (!isInline) {
      const cssClass = isFeatureAtRisk ? `${type} atrisk` : type;
      const ariaRole = type === "note" ? "note" : null;
      const div = hyperHTML$1`<div class="${cssClass}" role="${ariaRole}"></div>`;
      const title = document.createElement("span");
      const titleParent = hyperHTML$1`
        <div role='heading' class='${`${type}-title marker`}'>${title}</div>`;
      addId(titleParent, "h", type);
      let text = displayType;
      if (inno.id) {
        div.id = inno.id;
        inno.removeAttribute("id");
      } else {
        addId(
          div,
          "issue-container",
          report.number ? `number-${report.number}` : ""
        );
      }
      /** @type {GitHubIssue} */
      let ghIssue;
      if (isIssue) {
        if (!hasDataNum) {
          text += ` ${issueNum}`;
        } else if (dataNum) {
          text += ` ${dataNum}`;
          const link = linkToIssueTracker(dataNum, conf, { isFeatureAtRisk });
          if (link) {
            title.before(link);
            link.append(title);
          }
          title.classList.add("issue-number");
          ghIssue = ghIssues.get(dataNum);
          if (!ghIssue) {
            pub("warning", `Failed to fetch issue number ${dataNum}`);
          }
          if (ghIssue && !report.title) {
            report.title = ghIssue.title;
          }
        }
        if (report.number !== undefined) {
          // Add entry to #issue-summary.
          issueList.append(
            createIssueSummaryEntry(conf.l10n.issue, report, div.id)
          );
        }
      }
      title.textContent = text;
      if (report.title) {
        inno.removeAttribute("title");
        const { repoURL = "" } = conf.github || {};
        const labels = ghIssue ? ghIssue.labels : [];
        if (ghIssue && ghIssue.state === "CLOSED") {
          div.classList.add("closed");
        }
        titleParent.append(createLabelsGroup(labels, report.title, repoURL));
      }
      /** @type {HTMLElement | DocumentFragment} */
      let body = inno;
      inno.replaceWith(div);
      body.classList.remove(type);
      body.removeAttribute("data-number");
      if (ghIssue && !body.innerHTML.trim()) {
        body = document
          .createRange()
          .createContextualFragment(ghIssue.bodyHTML);
      }
      div.append(titleParent, body);
      const level = parents(titleParent, "section").length + 2;
      titleParent.setAttribute("aria-level", level);
    }
    pub(report.type, report);
  });
  makeIssueSectionSummary(issueList);
}

/**
 * @typedef {object} IssueType
 * @property {string} type
 * @property {string} displayType
 * @property {boolean} isFeatureAtRisk
 *
 * @param {HTMLElement} inno
 * @return {IssueType}
 */
function getIssueType(inno, conf) {
  const isIssue = inno.classList.contains("issue");
  const isWarning = inno.classList.contains("warning");
  const isEdNote = inno.classList.contains("ednote");
  const isFeatureAtRisk = inno.classList.contains("atrisk");
  const type = isIssue
    ? "issue"
    : isWarning
    ? "warning"
    : isEdNote
    ? "ednote"
    : "note";
  const displayType = isIssue
    ? isFeatureAtRisk
      ? conf.l10n.feature_at_risk
      : conf.l10n.issue
    : isWarning
    ? conf.l10n.warning
    : isEdNote
    ? conf.l10n.editors_note
    : conf.l10n.note;
  return { type, displayType, isFeatureAtRisk };
}

/**
 * @param {string} dataNum
 * @param {*} conf
 */
function linkToIssueTracker(dataNum, conf, { isFeatureAtRisk = false } = {}) {
  // Set issueBase to cause issue to be linked to the external issue tracker
  if (!isFeatureAtRisk && conf.issueBase) {
    return hyperHTML$1`<a href='${conf.issueBase + dataNum}'/>`;
  } else if (isFeatureAtRisk && conf.atRiskBase) {
    return hyperHTML$1`<a href='${conf.atRiskBase + dataNum}'/>`;
  }
}

/**
 * @param {string} l10nIssue
 * @param {Partial<Report>} report
 */
function createIssueSummaryEntry(l10nIssue, report, id) {
  const issueNumberText = `${l10nIssue} ${report.number}`;
  const title = report.title
    ? hyperHTML$1`<span style="text-transform: none">: ${report.title}</span>`
    : "";
  return hyperHTML$1`
    <li><a href="${`#${id}`}">${issueNumberText}</a>${title}</li>
  `;
}

/**
 *
 * @param {HTMLUListElement} issueList
 */
function makeIssueSectionSummary(issueList) {
  const issueSummaryElement = document.getElementById("issue-summary");
  if (!issueSummaryElement) return;
  const heading = issueSummaryElement.querySelector("h2, h3, h4, h5, h6");

  issueList.hasChildNodes()
    ? issueSummaryElement.append(issueList)
    : issueSummaryElement.append(hyperHTML$1`<p>${l10n$8.no_issues_in_spec}</p>`);
  if (
    !heading ||
    (heading && heading !== issueSummaryElement.firstElementChild)
  ) {
    issueSummaryElement.insertAdjacentHTML(
      "afterbegin",
      `<h2>${l10n$8.issue_summary}</h2>`
    );
  }
}

function isLight(rgb) {
  const red = (rgb >> 16) & 0xff;
  const green = (rgb >> 8) & 0xff;
  const blue = (rgb >> 0) & 0xff;
  const illumination = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  return illumination > 140;
}

/**
 * @param {GitHubLabel[]} labels
 * @param {string} title
 * @param {string} repoURL
 */
function createLabelsGroup(labels, title, repoURL) {
  const labelsGroup = labels.map(label => createLabel(label, repoURL));
  const labelNames = labels.map(label => label.name);
  const joinedNames = joinAnd(labelNames);
  if (labelsGroup.length) {
    labelsGroup.unshift(document.createTextNode(" "));
  }
  if (labelNames.length) {
    const ariaLabel = `This issue is labelled as ${joinedNames}.`;
    return hyperHTML$1`<span
      class="issue-label"
      aria-label="${ariaLabel}">: ${title}${labelsGroup}</span>`;
  }
  return hyperHTML$1`<span class="issue-label">: ${title}${labelsGroup}</span>`;
}

/**
 * @param {GitHubLabel} label
 * @param {string} repoURL
 */
function createLabel(label, repoURL) {
  const { color, name } = label;
  const issuesURL = new URL("./issues/", repoURL);
  issuesURL.searchParams.set("q", `is:issue is:open label:"${label.name}"`);
  const rgb = parseInt(color, 16);
  const textColorClass = isNaN(rgb) || isLight(rgb) ? "light" : "dark";
  const cssClasses = `respec-gh-label respec-label-${textColorClass}`;
  const style = `background-color: #${color}`;
  return hyperHTML$1`<a
    class="${cssClasses}"
    style="${style}"
    href="${issuesURL.href}">${name}</a>`;
}

/**
 * @returns {Promise<Map<string, GitHubIssue>>}
 */
async function fetchAndStoreGithubIssues(github) {
  if (!github || !github.apiBase) {
    return new Map();
  }

  /** @type {NodeListOf<HTMLElement>} */
  const specIssues = document.querySelectorAll(".issue[data-number]");
  const issueNumbers = [...specIssues]
    .map(elem => Number.parseInt(elem.dataset.number, 10))
    .filter(issueNumber => issueNumber);

  if (!issueNumbers.length) {
    return new Map();
  }

  const url = new URL("issues", `${github.apiBase}/${github.fullName}/`);
  url.searchParams.set("issues", issueNumbers.join(","));

  const response = await fetch(url.href);
  if (!response.ok) {
    const msg = `Error fetching issues from GitHub. (HTTP Status ${response.status}).`;
    pub("error", msg);
    return new Map();
  }

  /** @type {{ [issueNumber: string]: GitHubIssue }} */
  const issues = await response.json();
  return new Map(Object.entries(issues));
}

async function run$l(conf) {
  const query = ".issue, .note, .warning, .ednote";
  /** @type {NodeListOf<HTMLElement>} */
  const issuesAndNotes = document.querySelectorAll(query);
  if (!issuesAndNotes.length) {
    return; // nothing to do.
  }
  const ghIssues = await fetchAndStoreGithubIssues(conf.github);
  const css = await cssPromise$1;
  const { head: headElem } = document;
  headElem.insertBefore(
    hyperHTML$1`<style>${[css]}</style>`,
    headElem.querySelector("link")
  );
  handleIssues(issuesAndNotes, ghIssues, conf);
  const ednotes = document.querySelectorAll(".ednote");
  ednotes.forEach(ednote => {
    ednote.classList.remove("ednote");
    ednote.classList.add("note");
  });
}

var issuesNotes = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$x,
  run: run$l
});

// @ts-check

const name$y = "core/best-practices";

const localizationStrings$7 = {
  en: {
    best_practice: "Best Practice ",
  },
};
const l10n$9 = getIntlData(localizationStrings$7);
const lang$a = lang in localizationStrings$7 ? lang : "en";

function run$m() {
  /** @type {NodeListOf<HTMLElement>} */
  const bps = document.querySelectorAll(".practicelab");
  const bpSummary = document.getElementById("bp-summary");
  const summaryItems = bpSummary ? document.createElement("ul") : null;
  [...bps].forEach((bp, num) => {
    const id = addId(bp, "bp");
    const localizedBpName = hyperHTML$1`
      <a class="marker self-link" href="${`#${id}`}"><bdi lang="${lang$a}">${
      l10n$9.best_practice
    }${num + 1}</bdi></a>`;

    // Make the summary items, if we have a summary
    if (summaryItems) {
      const li = hyperHTML$1`
        <li>
          ${localizedBpName}: ${makeSafeCopy(bp)}
        </li>
      `;
      summaryItems.appendChild(li);
    }

    const container = bp.closest("div");
    if (!container) {
      // This is just an inline best practice...
      bp.classList.add("advisement");
      return;
    }

    // Make the advisement box
    container.classList.add("advisement");
    const title = hyperHTML$1`${localizedBpName.cloneNode(true)}: ${bp}`;
    container.prepend(...title.childNodes);
  });
  if (bps.length) {
    if (bpSummary) {
      bpSummary.appendChild(hyperHTML$1`<h2>Best Practices Summary</h2>`);
      bpSummary.appendChild(summaryItems);
    }
  } else if (bpSummary) {
    pub(
      "warn",
      "Using best practices summary (#bp-summary) but no best practices found."
    );
    bpSummary.remove();
  }
}

var bestPractices = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$y,
  run: run$m
});

// @ts-check

const name$z = "core/figures";

const localizationStrings$8 = {
  en: {
    list_of_figures: "List of Figures",
    fig: "Figure ",
  },
  ja: {
    fig: "図",
    list_of_figures: "図のリスト",
  },
  ko: {
    fig: "그림 ",
    list_of_figures: "그림 목록",
  },
  nl: {
    fig: "Figuur ",
    list_of_figures: "Lijst met figuren",
  },
  es: {
    fig: "Figura ",
    list_of_figures: "Lista de Figuras",
  },
  zh: {
    fig: "圖 ",
    list_of_figures: "List of Figures",
  },
};

const l10n$a = getIntlData(localizationStrings$8);

function run$n() {
  normalizeImages(document);

  const tof = collectFigures();

  // Create a Table of Figures if a section with id 'tof' exists.
  const tofElement = document.getElementById("tof");
  if (tof.length && tofElement) {
    decorateTableOfFigures(tofElement);
    tofElement.append(
      hyperHTML$1`<h2>${l10n$a.list_of_figures}</h2>`,
      hyperHTML$1`<ul class='tof'>${tof}</ul>`
    );
  }
}

/**
 * process all figures
 */
function collectFigures() {
  /** @type {HTMLElement[]} */
  const tof = [];
  document.querySelectorAll("figure").forEach((fig, i) => {
    const caption = fig.querySelector("figcaption");

    if (caption) {
      decorateFigure(fig, caption, i);
      tof.push(getTableOfFiguresListItem(fig.id, caption));
    } else {
      showInlineWarning(fig, "Found a `<figure>` without a `<figcaption>`");
    }
  });
  return tof;
}

/**
 * @param {HTMLElement} figure
 * @param {HTMLElement} caption
 * @param {number} i
 */
function decorateFigure(figure, caption, i) {
  const title = caption.textContent;
  addId(figure, "fig", title);
  // set proper caption title
  wrapInner(caption, hyperHTML$1`<span class='fig-title'>`);
  caption.prepend(l10n$a.fig, hyperHTML$1`<bdi class='figno'>${i + 1}</bdi>`, " ");
}

/**
 * @param {string} figureId
 * @param {HTMLElement} caption
 * @return {HTMLElement}
 */
function getTableOfFiguresListItem(figureId, caption) {
  const tofCaption = caption.cloneNode(true);
  tofCaption.querySelectorAll("a").forEach(anchor => {
    renameElement(anchor, "span").removeAttribute("href");
  });
  return hyperHTML$1`<li class='tofline'>
    <a class='tocxref' href='${`#${figureId}`}'>${tofCaption.childNodes}</a>
  </li>`;
}

function normalizeImages(doc) {
  doc
    .querySelectorAll(
      ":not(picture)>img:not([width]):not([height]):not([srcset])"
    )
    .forEach(img => {
      if (img.naturalHeight === 0 || img.naturalWidth === 0) return;
      img.height = img.naturalHeight;
      img.width = img.naturalWidth;
    });
}

/**
 * if it has a parent section, don't touch it
 * if it has a class of appendix or introductory, don't touch it
 * if all the preceding section siblings are introductory, make it introductory
 * if there is a preceding section sibling which is an appendix, make it appendix
 * @param {Element} tofElement
 */
function decorateTableOfFigures(tofElement) {
  if (
    tofElement.classList.contains("appendix") ||
    tofElement.classList.contains("introductory") ||
    tofElement.closest("section")
  ) {
    return;
  }

  const previousSections = getPreviousSections(tofElement);
  if (previousSections.every(sec => sec.classList.contains("introductory"))) {
    tofElement.classList.add("introductory");
  } else if (previousSections.some(sec => sec.classList.contains("appendix"))) {
    tofElement.classList.add("appendix");
  }
}

/**
 * @param {Element} element
 */
function getPreviousSections(element) {
  /** @type {Element[]} */
  const sections = [];
  for (const previous of iteratePreviousElements(element)) {
    if (previous.localName === "section") {
      sections.push(previous);
    }
  }
  return sections;
}

/**
 * @param {Element} element
 */
function* iteratePreviousElements(element) {
  let previous = element;
  while (previous.previousElementSibling) {
    previous = previous.previousElementSibling;
    yield previous;
  }
}

var figures = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$z,
  run: run$n
});

// @ts-check

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
 */
function findDfn(defn, name, { parent = "" } = {}) {
  switch (defn.type) {
    case "constructor":
    case "operation":
      return findOperationDfn(defn, parent, name);
    default:
      return findNormalDfn(defn, parent, name);
  }
}

/**
 * @param {string} type
 * @param {string} parent
 * @param {string} name
 */
function getAlternativeNames(idlAst, parent, name) {
  const { type } = idlAst;
  const asQualifiedName = `${parent}.${name}`;
  switch (type) {
    case "constructor":
    case "operation": {
      // Allow linking to "method()", method(arg) and "method" name.
      const asMethodName = `${name}()`;
      const asFullyQualifiedName = `${asQualifiedName}()`;
      const asMethodWithArgs = generateMethodNamesWithArgs(
        name,
        idlAst.arguments
      );
      return {
        local: [asQualifiedName, asFullyQualifiedName, name],
        exportable: [asMethodName, ...asMethodWithArgs],
      };
    }
    case "attribute":
      return {
        local: [asQualifiedName],
        exportable: [name],
      };
  }
}

/**
 * Generates all possible permutations of a method name based
 * on what arguments they method accepts.

 * Required arguments are always present, and optional ones
 * are stacked one by one.
 *
 * For examples: foo(req1, req2), foo(req1, req2, opt1) and so on.
 *
 * @param {String} operationName
 * @param {*} argsAst
 */
function generateMethodNamesWithArgs(operationName, argsAst) {
  const operationNames = [];
  if (argsAst.length === 0) {
    return operationNames;
  }
  const required = []; // required arguments
  const optional = []; // optional arguments, including variadic ones
  for (const { name, optional: isOptional, variadic } of argsAst) {
    if (isOptional || variadic) {
      optional.push(name);
    } else {
      required.push(name);
    }
  }
  const requiredArgs = required.join(", ");
  const requiredOperation = `${operationName}(${requiredArgs})`;
  operationNames.push(requiredOperation);
  const optionalOps = optional.map((_, index) => {
    const optionalArgs = optional.slice(0, index + 1).join(", ");
    const result = `${operationName}(${requiredArgs}${
      optionalArgs ? `, ${optionalArgs}` : ""
    })`;
    return result;
  });
  operationNames.push(...optionalOps);
  return operationNames;
}

/**
 * @param {*} defn
 * @param {string} parent
 * @param {string} name
 */
function findOperationDfn(defn, parent, name) {
  // Overloads all have unique names
  if (name.includes("!overload")) {
    return findNormalDfn(defn, parent, name);
  }
  const asMethodName = `${name}()`;
  return findNormalDfn(defn, parent, asMethodName, name);
}

/**
 * @param {HTMLElement} dfn
 * @param {Record<"local" | "exportable", string[]>} names
 */
function addAlternativeNames(dfn, names) {
  const { local, exportable } = names;
  const lt = dfn.dataset.lt ? new Set(dfn.dataset.lt.split("|")) : new Set();
  for (const item of exportable) {
    lt.add(item);
  }
  // Fix any ill-placed ones - local ones don't belong here
  local.filter(item => lt.has(item)).forEach(item => lt.delete(item));
  dfn.dataset.lt = [...lt].join("|");
  dfn.dataset.localLt = local.join("|");
  registerDefinition(dfn, [...local, ...exportable]);
}

/**
 * @param {*} defn
 * @param {string} parent
 * @param {...string} names
 */
function findNormalDfn(defn, parent, ...names) {
  for (const name of names) {
    let resolvedName =
      defn.type === "enum-value" && name === ""
        ? "the-empty-string"
        : name.toLowerCase();
    let dfnForArray = definitionMap[resolvedName];
    let dfns = getDfns(dfnForArray, parent, name, defn.type);
    // If we haven't found any definitions with explicit [for]
    // and [title], look for a dotted definition, "parent.name".
    if (dfns.length === 0 && parent !== "") {
      resolvedName = `${parent}.${resolvedName}`;
      dfnForArray = definitionMap[resolvedName.toLowerCase()];
      if (dfnForArray !== undefined && dfnForArray.length === 1) {
        dfns = dfnForArray;
        // Found it: register with its local name
        delete definitionMap[resolvedName];
        registerDefinition(dfns[0], [resolvedName]);
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
      return dfns[0];
    }
  }
}

/**
 * @param {HTMLElement} dfnElem
 * @param {*} idlAst
 * @param {string} parent
 * @param {string} name
 */
function decorateDfn(dfnElem, idlAst, parent, name) {
  if (!dfnElem.id) {
    const lCaseParent = parent.toLowerCase();
    const middle = lCaseParent ? `${lCaseParent}-` : "";
    let last = name
      .toLowerCase()
      .replace(/[()]/g, "")
      .replace(/\s/g, "-");
    if (last === "") last = "the-empty-string";
    dfnElem.id = `dom-${middle}${last}`;
  }
  dfnElem.dataset.idl = idlAst.type;
  dfnElem.dataset.title = dfnElem.textContent;
  dfnElem.dataset.dfnFor = parent;
  // Derive the data-type for dictionary members, interface attributes,
  // and methods
  switch (idlAst.type) {
    case "operation":
    case "attribute":
    case "field":
      dfnElem.dataset.type = getDataType(idlAst);
      break;
  }

  // Mark the definition as code.
  if (
    !dfnElem.querySelector("code") &&
    !dfnElem.closest("code") &&
    dfnElem.children
  ) {
    wrapInner(dfnElem, dfnElem.ownerDocument.createElement("code"));
  }

  // Add data-lt and data-local-lt values and register them
  switch (idlAst.type) {
    case "attribute":
    case "constructor":
    case "operation":
      addAlternativeNames(dfnElem, getAlternativeNames(idlAst, parent, name));
      break;
  }

  return dfnElem;
}

/**
 * @param {HTMLElement[]} dfnForArray
 * @param {string} parent data-dfn-for
 * @param {string} originalName
 * @param {string} type
 */
function getDfns(dfnForArray, parent, originalName, type) {
  if (!dfnForArray) {
    return [];
  }
  // Definitions that have a name and [data-dfn-for] that exactly match the
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

/**
 * @return {string}
 */
function getDataType(idlStruct) {
  const { idlType, generic, union } = idlStruct;
  if (typeof idlType === "string") return idlType;
  if (generic) return generic;
  // join on "|" handles for "unsigned short" etc.
  if (union) return idlType.map(getDataType).join("|");
  return getDataType(idlType);
}

// @ts-check
/**
 * Module core/webidl-clipboard
 *
 * This module adds a button to each IDL pre making it possible to copy
 * well-formatted IDL to the clipboard.
 *
 */
const name$A = "core/webidl-clipboard";

function createButton() {
  const copyButton = document.createElement("button");
  copyButton.innerHTML =
    '<svg height="16" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" d="M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z"/></svg>';
  copyButton.title = "Copy IDL to clipboard";
  copyButton.classList.add("respec-button-copy-paste", "removeOnSave");
  return copyButton;
}

const copyButton = createButton();

/**
 * Adds a HTML button that copies WebIDL to the clipboard.
 *
 * @param {HTMLDivElement} idlHeader
 */
function addCopyIDLButton(idlHeader) {
  // There may be multiple <span>s of IDL, so we take everything
  // apart from the idl header.
  const pre = idlHeader.closest("pre.idl");
  const idl = pre.cloneNode(true);
  idl.querySelector(".idlHeader").remove();
  const { textContent: idlText } = idl;
  const button = copyButton.cloneNode(true);
  button.addEventListener("click", () => {
    clipboardWriteText(idlText);
  });
  idlHeader.append(button);
}

/**
 * Mocks navigator.clipboard.writeText()
 * @param {string} text
 */
function clipboardWriteText(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise(resolve => {
    document.addEventListener(
      "copy",
      ev => {
        ev.clipboardData.setData("text/plain", text);
        resolve();
      },
      { once: true }
    );
    document.execCommand("copy");
  });
}

var webidlClipboard = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$A,
  addCopyIDLButton: addCopyIDLButton
});

// Module core/webidl

const name$B = "core/webidl";

const operationNames = {};
const idlPartials = {};

const templates$1 = {
  wrap(items) {
    return items
      .reduce(flatten$1, [])
      .filter(x => x !== "")
      .map(x => (typeof x === "string" ? new Text(x) : x));
  },
  trivia(t) {
    if (!t.trim()) {
      return t;
    }
    return hyperHTML$1`<span class='idlSectionComment'>${t}</span>`;
  },
  generic(keyword) {
    // Shepherd classifies "interfaces" as starting with capital letters,
    // like Promise, FrozenArray, etc.
    return /^[A-Z]/.test(keyword)
      ? hyperHTML$1`<a data-xref-type="interface" data-cite="WebIDL">${keyword}</a>`
      : // Other keywords like sequence, maplike, etc...
        hyperHTML$1`<a data-xref-type="dfn" data-cite="WebIDL">${keyword}</a>`;
  },
  reference(wrapped, unescaped, context) {
    if (context.type === "extended-attribute" && context.name !== "Exposed") {
      return wrapped;
    }
    let type = "_IDL_";
    let cite = null;
    let lt;
    switch (unescaped) {
      case "Window":
        type = "interface";
        cite = "HTML";
        break;
      case "object":
        type = "interface";
        cite = "WebIDL";
        break;
      default: {
        const isWorkerType = unescaped.includes("Worker");
        if (isWorkerType && context.type === "extended-attribute") {
          lt = `${unescaped}GlobalScope`;
          type = "interface";
          cite = ["Worker", "DedicatedWorker", "SharedWorker"].includes(
            unescaped
          )
            ? "HTML"
            : null;
        }
      }
    }
    return hyperHTML$1`<a
      data-xref-type="${type}" data-cite="${cite}" data-lt="${lt}">${wrapped}</a>`;
  },
  name(escaped, { data, parent }) {
    if (data.idlType && data.idlType.type === "argument-type") {
      return hyperHTML$1`<span class="idlParamName">${escaped}</span>`;
    }
    const idlLink = defineIdlName(escaped, data, parent);
    if (data.type !== "enum-value") {
      const className = parent ? "idlName" : "idlID";
      idlLink.classList.add(className);
    }
    return idlLink;
  },
  nameless(escaped, { data, parent }) {
    switch (data.type) {
      case "constructor":
        return defineIdlName(escaped, data, parent);
      default:
        return escaped;
    }
  },
  type(contents) {
    return hyperHTML$1`<span class="idlType">${contents}</span>`;
  },
  inheritance(contents) {
    return hyperHTML$1`<span class="idlSuperclass">${contents}</span>`;
  },
  definition(contents, { data, parent }) {
    const className = getIdlDefinitionClassName(data);
    switch (data.type) {
      case "includes":
      case "enum-value":
        return hyperHTML$1`<span class='${className}'>${contents}</span>`;
    }
    const parentName = parent ? parent.name : "";
    const { name, idlId } = getNameAndId(data, parentName);
    return hyperHTML$1`<span class='${className}' id='${idlId}' data-idl data-title='${name}'>${contents}</span>`;
  },
  extendedAttribute(contents) {
    const result = hyperHTML$1`<span class="extAttr">${contents}</span>`;
    return result;
  },
  extendedAttributeReference(name) {
    return hyperHTML$1`<a data-xref-type="extended-attribute">${name}</a>`;
  },
};

/**
 * Returns a link to existing <dfn> or creates one if doesn’t exists.
 */
function defineIdlName(escaped, data, parent) {
  const parentName = parent ? parent.name : "";
  const { name } = getNameAndId(data, parentName);
  const dfn = findDfn(data, name, {
    parent: parentName,
  });
  const linkType = getDfnType(data.type);
  if (dfn) {
    if (!data.partial) {
      dfn.dataset.export = "";
      dfn.dataset.dfnType = linkType;
    }
    decorateDfn(dfn, data, parentName, name);
    const href = `#${dfn.id}`;
    return hyperHTML$1`<a
      data-link-for="${parentName}"
      data-link-type="${linkType}"
      href="${href}"
      class="internalDFN"
      ><code>${escaped}</code></a>`;
  }

  const isDefaultJSON =
    data.type === "operation" &&
    data.name === "toJSON" &&
    data.extAttrs.some(({ name }) => name === "Default");
  if (isDefaultJSON) {
    return hyperHTML$1`<a
     data-link-type="dfn"
     data-lt="default toJSON operation">${escaped}</a>`;
  }
  if (!data.partial) {
    const dfn = hyperHTML$1`<dfn data-export data-dfn-type="${linkType}">${escaped}</dfn>`;
    registerDefinition(dfn, [name]);
    decorateDfn(dfn, data, parentName, name);
    return dfn;
  }

  const unlinkedAnchor = hyperHTML$1`<a
    data-idl="${data.partial ? "partial" : null}"
    data-link-type="${linkType}"
    data-title="${data.name}"
    data-xref-type="${linkType}"
    >${escaped}</a>`;

  const showWarnings =
    name && data.type !== "typedef" && !(data.partial && !dfn);
  if (showWarnings) {
    const styledName = data.type === "operation" ? `${name}()` : name;
    const ofParent = parentName ? ` \`${parentName}\`'s` : "";
    const msg = `Missing \`<dfn>\` for${ofParent} \`${styledName}\` ${data.type}. [More info](https://github.com/w3c/respec/wiki/WebIDL-thing-is-not-defined).`;
    showInlineWarning(unlinkedAnchor, msg, "");
  }
  return unlinkedAnchor;
}

/**
 * Map to Shepherd types, for export.
 * @see https://tabatkins.github.io/bikeshed/#dfn-types
 */
function getDfnType(idlType) {
  switch (idlType) {
    case "operation":
      return "method";
    case "field":
      return "dict-member";
    case "callback interface":
    case "interface mixin":
      return "interface";
    default:
      return idlType;
  }
}

function getIdlDefinitionClassName(defn) {
  switch (defn.type) {
    case "callback interface":
      return "idlInterface";
    case "operation":
      return "idlMethod";
    case "field":
      return "idlMember";
    case "enum-value":
      return "idlEnumItem";
    case "callback function":
      return "idlCallback";
  }
  return `idl${defn.type[0].toUpperCase()}${defn.type.slice(1)}`;
}

const nameResolverMap = new WeakMap();
function getNameAndId(defn, parent = "") {
  if (nameResolverMap.has(defn)) {
    return nameResolverMap.get(defn);
  }
  const result = resolveNameAndId(defn, parent);
  nameResolverMap.set(defn, result);
  return result;
}

function resolveNameAndId(defn, parent) {
  let name = getDefnName(defn);
  let idlId = getIdlId(name, parent);
  switch (defn.type) {
    // Top-level entities with linkable members.
    case "callback interface":
    case "dictionary":
    case "interface":
    case "interface mixin": {
      idlId += resolvePartial(defn);
      break;
    }
    case "constructor":
    case "operation": {
      const overload = resolveOverload(name, parent);
      if (overload) {
        name += overload;
        idlId += overload;
      } else if (defn.arguments.length) {
        idlId += defn.arguments
          .map(arg => `-${arg.name.toLowerCase()}`)
          .join("");
      }
      break;
    }
  }
  return { name, idlId };
}

function resolvePartial(defn) {
  if (!defn.partial) {
    return "";
  }
  if (!idlPartials[defn.name]) {
    idlPartials[defn.name] = 0;
  }
  idlPartials[defn.name] += 1;
  return `-partial-${idlPartials[defn.name]}`;
}

function resolveOverload(name, parentName) {
  const qualifiedName = `${parentName}.${name}`;
  const fullyQualifiedName = `${qualifiedName}()`;
  let overload;
  if (!operationNames[fullyQualifiedName]) {
    operationNames[fullyQualifiedName] = 0;
  }
  if (!operationNames[qualifiedName]) {
    operationNames[qualifiedName] = 0;
  } else {
    overload = `!overload-${operationNames[qualifiedName]}`;
  }
  operationNames[fullyQualifiedName] += 1;
  operationNames[qualifiedName] += 1;
  return overload || "";
}

function getIdlId(name, parentName) {
  if (!parentName) {
    return `idl-def-${name.toLowerCase()}`;
  }
  return `idl-def-${parentName.toLowerCase()}-${name.toLowerCase()}`;
}

function getDefnName(defn) {
  switch (defn.type) {
    case "enum-value":
      return defn.value;
    case "operation":
      return defn.name;
    default:
      return defn.name || defn.type;
  }
}

function renderWebIDL(idlElement, index) {
  let parse;
  try {
    parse = webidl2.parse(idlElement.textContent, {
      sourceName: String(index),
    });
  } catch (e) {
    showInlineError(
      idlElement,
      `Failed to parse WebIDL: ${e.bareMessage}.`,
      e.bareMessage,
      { details: `<pre>${e.context}</pre>` }
    );
    // Skip this <pre> and move on to the next one.
    return [];
  }
  // we add "idl" as the canonical match, so both "webidl" and "idl" work
  idlElement.classList.add("def", "idl");
  const html = webidl2.write(parse, { templates: templates$1 });
  const render = hyperHTML$1.bind(idlElement);
  render`${html}`;
  idlElement.querySelectorAll("[data-idl]").forEach(elem => {
    if (elem.dataset.dfnFor) {
      return;
    }
    const title = elem.dataset.title;
    // Select the nearest ancestor element that can contain members.
    const parent = elem.parentElement.closest("[data-idl][data-title]");
    if (parent) {
      elem.dataset.dfnFor = parent.dataset.title;
    }
    registerDefinition(elem, [title]);
  });
  // cross reference
  const closestCite = idlElement.closest("[data-cite], body");
  const { dataset } = closestCite;
  if (!dataset.cite) dataset.cite = "WebIDL";
  // includes webidl in some form
  if (!/\bwebidl\b/i.test(dataset.cite)) {
    const cites = dataset.cite.trim().split(/\s+/);
    dataset.cite = ["WebIDL", ...cites].join(" ");
  }
  addIDLHeader(idlElement);
  return parse;
}
/**
 * Adds a "WebIDL" decorative header/permalink to a block of WebIDL.
 * @param {HTMLPreElement} pre
 */
function addIDLHeader(pre) {
  addHashId(pre, "webidl");
  const header = hyperHTML$1`<div class="idlHeader"><a
      class="self-link"
      href="${`#${pre.id}`}"
    >WebIDL</a></div>`;
  pre.prepend(header);
  addCopyIDLButton(header);
}

const cssPromise$2 = loadStyle$4();

async function loadStyle$4() {
  try {
    return (await Promise.resolve().then(function () { return webidl$2; })).default;
  } catch {
    return fetchAsset("webidl.css");
  }
}

async function run$o() {
  const idls = document.querySelectorAll("pre.idl, pre.webidl");
  if (!idls.length) {
    return;
  }
  if (!document.querySelector(".idl:not(pre), .webidl:not(pre)")) {
    const link = document.querySelector("head link");
    if (link) {
      const style = document.createElement("style");
      style.textContent = await cssPromise$2;
      link.before(style);
    }
  }

  const astArray = [...idls].map(renderWebIDL);

  const validations = webidl2.validate(astArray);
  for (const validation of validations) {
    let details = `<pre>${validation.context}</pre>`;
    if (validation.autofix) {
      validation.autofix();
      const idlToFix = webidl2.write(astArray[validation.sourceName]);
      const escaped = xmlEscape(idlToFix);
      details += `Try fixing as:
      <pre>${escaped}</pre>`;
    }
    showInlineError(
      idls[validation.sourceName],
      `WebIDL validation error: ${validation.bareMessage}`,
      validation.bareMessage,
      { details }
    );
  }
  document.normalize();
}

var webidl = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$B,
  addIDLHeader: addIDLHeader,
  run: run$o
});

// @ts-check
const name$C = "core/data-cite";

function requestLookup(conf) {
  const toCiteDetails = citeDetailsConverter(conf);
  return async elem => {
    const originalKey = elem.dataset.cite;
    const { key, frag, path } = toCiteDetails(elem);
    let href = "";
    let title = "";
    // This is just referring to this document
    if (key.toLowerCase() === conf.shortName.toLowerCase()) {
      console.log(
        elem,
        `The reference "${key}" is resolved into the current document per \`conf.shortName\`.`
      );
      href = document.location.href;
    } else {
      // Let's go look it up in spec ref...
      const entry = await resolveRef(key);
      cleanElement(elem);
      if (!entry) {
        showInlineWarning(elem, `Couldn't find a match for "${originalKey}"`);
        return;
      }
      href = entry.href;
      title = entry.title;
    }
    if (path) {
      // See: https://github.com/w3c/respec/issues/1856#issuecomment-429579475
      const relPath = path.startsWith("/") ? `.${path}` : path;
      href = new URL(relPath, href).href;
    }
    if (frag) {
      href = new URL(frag, href).href;
    }
    switch (elem.localName) {
      case "a": {
        if (elem.textContent === "" && elem.dataset.lt !== "the-empty-string") {
          elem.textContent = title;
        }
        elem.href = href;
        if (!path && !frag) {
          const cite = document.createElement("cite");
          elem.replaceWith(cite);
          cite.append(elem);
        }
        break;
      }
      case "dfn": {
        const anchor = document.createElement("a");
        anchor.href = href;
        if (!elem.textContent) {
          anchor.textContent = title;
          elem.append(anchor);
        } else {
          wrapInner(elem, anchor);
        }
        if (!path && !frag) {
          const cite = document.createElement("cite");
          cite.append(anchor);
          elem.append(cite);
        }
        if ("export" in elem.dataset) {
          showInlineError(
            elem,
            "Exporting an linked external definition is not allowed. Please remove the `data-export` attribute",
            "Please remove the `data-export` attribute."
          );
          delete elem.dataset.export;
        }
        elem.dataset.noExport = "";
        break;
      }
    }
  };
}

function cleanElement(elem) {
  ["data-cite", "data-cite-frag"]
    .filter(attrName => elem.hasAttribute(attrName))
    .forEach(attrName => elem.removeAttribute(attrName));
}

/**
 * @param {string} component
 * @return {(key: string) => string}
 */
function makeComponentFinder(component) {
  return key => {
    const position = key.search(component);
    return position !== -1 ? key.substring(position) : "";
  };
}

/**
 * @typedef {object} CiteDetails
 * @property {string} key
 * @property {boolean} isNormative
 * @property {string} frag
 * @property {string} path
 *
 * @return {(elem: HTMLElement) => CiteDetails};
 */
function citeDetailsConverter(conf) {
  const findFrag = makeComponentFinder("#");
  const findPath = makeComponentFinder("/");
  return function toCiteDetails(elem) {
    const { dataset } = elem;
    const { cite: rawKey, citeFrag, citePath } = dataset;
    // The key is a fragment, resolve using the shortName as key
    if (rawKey.startsWith("#") && !citeFrag) {
      // Closes data-cite not starting with "#"
      /** @type {HTMLElement} */
      const closest = elem.parentElement.closest(
        `[data-cite]:not([data-cite^="#"])`
      );
      const { key: parentKey, isNormative: closestIsNormative } = closest
        ? toCiteDetails(closest)
        : { key: conf.shortName || "", isNormative: false };
      dataset.cite = closestIsNormative ? parentKey : `?${parentKey}`;
      dataset.citeFrag = rawKey.replace("#", ""); // the key is acting as fragment
      return toCiteDetails(elem);
    }
    const frag = citeFrag ? `#${citeFrag}` : findFrag(rawKey);
    const path = citePath || findPath(rawKey).split("#")[0]; // path is always before "#"
    const { type } = refTypeFromContext(rawKey, elem);
    const isNormative = type === "normative";
    // key is before "/" and "#" but after "!" or "?" (e.g., ?key/path#frag)
    const hasPrecedingMark = /^[?|!]/.test(rawKey);
    const key = rawKey.split(/[/|#]/)[0].substring(Number(hasPrecedingMark));
    const details = { key, isNormative, frag, path };
    return details;
  };
}

async function run$p(conf) {
  const toCiteDetails = citeDetailsConverter(conf);
  /** @type {NodeListOf<HTMLElement>} */
  const cites = document.querySelectorAll("dfn[data-cite], a[data-cite]");
  Array.from(cites)
    .filter(el => el.dataset.cite)
    .map(toCiteDetails)
    // it's not the same spec
    .filter(({ key }) => {
      return key.toLowerCase() !== (conf.shortName || "").toLowerCase();
    })
    .forEach(({ isNormative, key }) => {
      if (!isNormative && !conf.normativeReferences.has(key)) {
        conf.informativeReferences.add(key);
        return;
      }
      conf.normativeReferences.add(key);
      conf.informativeReferences.delete(key);
    });
}

/**
 * @param {Document} doc
 * @param {*} conf
 */
async function linkInlineCitations(doc, conf = respecConfig) {
  const toLookupRequest = requestLookup(conf);
  const elems = [
    ...doc.querySelectorAll(
      "dfn[data-cite]:not([data-cite='']), a[data-cite]:not([data-cite=''])"
    ),
  ];
  const citeConverter = citeDetailsConverter(conf);

  const promisesForMissingEntries = elems
    .map(citeConverter)
    .map(async entry => {
      const result = await resolveRef(entry.key);
      return { entry, result };
    });
  const bibEntries = await Promise.all(promisesForMissingEntries);

  const missingBibEntries = bibEntries
    .filter(({ result }) => result === null)
    .map(({ entry: { key } }) => key);

  // we now go to network to fetch missing entries
  const newEntries = await updateFromNetwork(missingBibEntries);
  if (newEntries) Object.assign(biblio, newEntries);

  const lookupRequests = [...new Set(elems)].map(toLookupRequest);
  return await Promise.all(lookupRequests);
}

var dataCite = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$C,
  run: run$p,
  linkInlineCitations: linkInlineCitations
});

// @ts-check
/**
 * Module: core/webidl-index
 * constructs a summary of WebIDL in the document by
 * cloning all the generated WebIDL nodes and
 * appending them to pre element.
 *
 * Usage
 * Add a <section id="idl-index"> to the document.
 * It also supports title elements to generate a header.
 * Or if a header element is an immediate child, then
 * that is preferred.
 */
const name$D = "core/webidl-index";

function run$q() {
  /** @type {HTMLElement | null} */
  const idlIndexSec = document.querySelector("section#idl-index");
  if (!idlIndexSec) {
    return;
  }
  // Query for decedents headings, e.g., "h2:first-child, etc.."
  const query = [2, 3, 4, 5, 6].map(level => `h${level}:first-child`).join(",");
  if (!idlIndexSec.querySelector(query)) {
    const header = document.createElement("h2");
    if (idlIndexSec.title) {
      header.textContent = idlIndexSec.title;
      idlIndexSec.removeAttribute("title");
    } else {
      header.textContent = "IDL Index";
    }
    idlIndexSec.prepend(header);
  }

  // filter out the IDL marked with class="exclude" and the IDL in non-normative sections
  const idlIndex = Array.from(
    document.querySelectorAll("pre.def.idl:not(.exclude)")
  ).filter(idl => !idl.closest(nonNormativeSelector));

  if (idlIndex.length === 0) {
    const text = "This specification doesn't declare any Web IDL.";
    idlIndexSec.append(text);
    return;
  }

  const pre = document.createElement("pre");
  pre.classList.add("idl", "def");
  pre.id = "actual-idl-index";
  idlIndex
    .map(elem => {
      const fragment = document.createDocumentFragment();
      for (const child of elem.children) {
        fragment.appendChild(child.cloneNode(true));
      }
      return fragment;
    })
    .forEach(elem => {
      if (pre.lastChild) {
        pre.append("\n\n");
      }
      pre.appendChild(elem);
    });
  // Remove duplicate IDs
  pre.querySelectorAll("*[id]").forEach(elem => elem.removeAttribute("id"));
  // Remove IDL headers
  pre.querySelectorAll(".idlHeader").forEach(elem => elem.remove());
  // Add our own IDL header
  idlIndexSec.appendChild(pre);
  addIDLHeader(pre);
}

var webidlIndex = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$D,
  run: run$q
});

// @ts-check

/**
 * @typedef {import('core/xref').RequestEntry} RequestEntry
 * @typedef {import('core/xref').Response} Response
 * @typedef {import('core/xref').SearchResultEntry} SearchResultEntry
 */

const VERSION_CHECK_WAIT = 5 * 60 * 60 * 1000; // 5 min

async function getIdbCache() {
  const db = await idb.openDB("xref", 1, {
    upgrade(db) {
      db.createObjectStore("xrefs");
    },
  });
  return new IDBKeyVal(db, "xrefs");
}

/**
 * @param {RequestEntry[]} uniqueQueryKeys
 * @returns {Promise<Map<string, SearchResultEntry[]>>}
 */
async function resolveXrefCache(uniqueQueryKeys) {
  try {
    const cache = await getIdbCache();
    return await resolveFromCache(uniqueQueryKeys, cache);
  } catch (err) {
    console.error(err);
    return new Map();
  }
}

/**
 * @param {RequestEntry[]} keys
 * @param {IDBKeyVal} cache
 * @returns {Promise<Map<string, SearchResultEntry[]>>}
 */
async function resolveFromCache(keys, cache) {
  const bustCache = await shouldBustCache(cache);
  if (bustCache) {
    await cache.clear();
    return new Map();
  }

  const cachedData = await cache.getMany(keys.map(key => key.id));
  return cachedData;
}

/**
 * Get last updated timestamp from server and bust cache based on that. This
 * way, we prevent dirty/erroneous/stale data being kept on a client (which is
 * possible if we use a `MAX_AGE` based caching strategy).
 * @param {IDBKeyVal} cache
 */
async function shouldBustCache(cache) {
  const lastChecked = await cache.get("__LAST_VERSION_CHECK__");
  const now = Date.now();

  if (!lastChecked) {
    await cache.set("__LAST_VERSION_CHECK__", now);
    return false;
  }
  if (now - lastChecked < VERSION_CHECK_WAIT) {
    // avoid checking network for any data update if old cache "fresh"
    return false;
  }

  const url = new URL("meta/version", API_URL).href;
  const res = await fetch(url);
  if (!res.ok) return false;
  const lastUpdated = await res.text();
  await cache.set("__LAST_VERSION_CHECK__", now);
  return parseInt(lastUpdated, 10) > lastChecked;
}

/**
 * @param {Map<string, SearchResultEntry[]>} data
 */
async function cacheXrefData(data) {
  try {
    const cache = await getIdbCache();
    // add data to cache
    await cache.addMany(data);
  } catch (e) {
    console.error(e);
  }
}

// @ts-check

const profiles = {
  "web-platform": ["HTML", "INFRA", "URL", "WEBIDL", "DOM", "FETCH"],
};

const API_URL = "https://respec.org/xref/";

if (
  !document.querySelector("link[rel='preconnect'][href='https://respec.org']")
) {
  const link = createResourceHint({
    hint: "preconnect",
    href: "https://respec.org",
  });
  document.head.appendChild(link);
}

/**
 * main external reference driver
 * @param {Object} conf respecConfig
 * @param {HTMLElement[]} elems possibleExternalLinks
 */
async function run$r(conf, elems) {
  const xref = normalizeConfig(conf.xref);
  if (xref.specs) {
    const bodyCite = document.body.dataset.cite
      ? document.body.dataset.cite.split(/\s+/)
      : [];
    document.body.dataset.cite = bodyCite.concat(xref.specs).join(" ");
  }

  if (!elems.length) return;

  /** @type {RequestEntry[]} */
  const queryKeys = [];
  for (const elem of elems) {
    const entry = getRequestEntry(elem);
    const id = await objectHash(entry);
    queryKeys.push({ ...entry, id });
  }

  const data = await getData(queryKeys, xref.url);
  addDataCiteToTerms(elems, queryKeys, data, conf);
}

/**
 * converts conf.xref to object with url and spec properties
 */
function normalizeConfig(xref) {
  const defaults = {
    url: API_URL,
    specs: null,
  };

  const config = Object.assign({}, defaults);

  const type = Array.isArray(xref) ? "array" : typeof xref;
  switch (type) {
    case "boolean":
      // using defaults already, as above
      break;
    case "string":
      if (xref.toLowerCase() in profiles) {
        Object.assign(config, { specs: profiles[xref.toLowerCase()] });
      } else {
        invalidProfileError(xref);
      }
      break;
    case "array":
      Object.assign(config, { specs: xref });
      break;
    case "object":
      Object.assign(config, xref);
      if (xref.profile) {
        const profile = xref.profile.toLowerCase();
        if (profile in profiles) {
          const specs = (xref.specs || []).concat(profiles[profile]);
          Object.assign(config, { specs });
        } else {
          invalidProfileError(xref.profile);
        }
      }
      break;
    default:
      pub(
        "error",
        `Invalid value for \`xref\` configuration option. Received: "${xref}".`
      );
  }
  return config;

  function invalidProfileError(profile) {
    const supportedProfiles = Object.keys(profiles)
      .map(p => `"${p}"`)
      .join(", ");
    const msg =
      `Invalid profile "${profile}" in \`respecConfig.xref\`. ` +
      `Please use one of the supported profiles: ${supportedProfiles}.`;
    pub("error", msg);
  }
}

/**
 * get xref API request entry (term and context) for given xref element
 * @param {HTMLElement} elem
 */
function getRequestEntry(elem) {
  const isIDL = "xrefType" in elem.dataset;

  let term = getTermFromElement(elem);
  if (!isIDL) term = term.toLowerCase();

  /** @type {string[][]} */
  const specs = [];
  /** @type {HTMLElement} */
  let dataciteElem = elem.closest("[data-cite]");
  while (dataciteElem) {
    const cite = dataciteElem.dataset.cite.toLowerCase().replace(/[!?]/g, "");
    const cites = cite.split(/\s+/).filter(s => s);
    if (cites.length) {
      specs.push(cites.sort());
    }
    if (dataciteElem === elem) break;
    dataciteElem = dataciteElem.parentElement.closest("[data-cite]");
  }
  // if element itself contains data-cite, we don't take inline context into account
  if (elem.closest("[data-cite]") !== elem) {
    const closestSection = elem.closest("section");
    /** @type {Iterable<HTMLElement>} */
    const bibrefs = closestSection
      ? closestSection.querySelectorAll("a.bibref")
      : [];
    const inlineRefs = [...bibrefs].map(el => el.textContent.toLowerCase());
    const uniqueInlineRefs = [...new Set(inlineRefs)].sort();
    if (uniqueInlineRefs.length) {
      specs.unshift(uniqueInlineRefs);
    }
  }

  const types = [];
  if (isIDL) {
    if (elem.dataset.xrefType) {
      types.push(...elem.dataset.xrefType.split("|"));
    } else {
      types.push("_IDL_");
    }
  } else {
    types.push("_CONCEPT_");
  }

  let { xrefFor: forContext } = elem.dataset;
  if (!forContext && isIDL) {
    /** @type {HTMLElement} */
    const dataXrefForElem = elem.closest("[data-xref-for]");
    if (dataXrefForElem) {
      forContext = norm(dataXrefForElem.dataset.xrefFor);
    }
  } else if (forContext && typeof forContext === "string") {
    forContext = norm(forContext);
  }
  return {
    term,
    types,
    ...(specs.length && { specs }),
    ...(typeof forContext === "string" && { for: forContext }),
  };
}

/** @param {HTMLElement} elem */
function getTermFromElement(elem) {
  const { lt: linkingText } = elem.dataset;
  let term = linkingText ? linkingText.split("|", 1)[0] : elem.textContent;
  term = norm(term);
  return term === "the-empty-string" ? "" : term;
}

/**
 * @param {RequestEntry[]} queryKeys
 * @param {string} apiUrl
 * @returns {Promise<Map<string, SearchResultEntry[]>>}
 */
async function getData(queryKeys, apiUrl) {
  const uniqueIds = new Set();
  const uniqueQueryKeys = queryKeys.filter(key => {
    return uniqueIds.has(key.id) ? false : uniqueIds.add(key.id) && true;
  });

  const resultsFromCache = await resolveXrefCache(uniqueQueryKeys);

  const termsToLook = uniqueQueryKeys.filter(
    key => !resultsFromCache.get(key.id)
  );
  const fetchedResults = await fetchFromNetwork(termsToLook, apiUrl);
  if (fetchedResults.size) {
    // add data to cache
    await cacheXrefData(fetchedResults);
  }

  return new Map([...resultsFromCache, ...fetchedResults]);
}

/**
 * @param {RequestEntry[]} keys
 * @param {string} url
 * @returns {Promise<Map<string, SearchResultEntry[]>>}
 */
async function fetchFromNetwork(keys, url) {
  if (!keys.length) return new Map();

  const query = { keys };
  const options = {
    method: "POST",
    body: JSON.stringify(query),
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await fetch(url, options);
  const json = await response.json();
  return new Map(json.result);
}

/**
 * Figures out from the tree structure if the reference is
 * normative (true) or informative (false).
 * @param {HTMLElement} elem
 */
function isNormative(elem) {
  const closestNormative = elem.closest(".normative");
  const closestInform = elem.closest(nonNormativeSelector);
  if (!closestInform || elem === closestNormative) {
    return true;
  }
  return (
    closestNormative &&
    closestInform &&
    closestInform.contains(closestNormative)
  );
}

/**
 * adds data-cite attributes to elems for each term for which results are found.
 * adds citations to references section.
 * collects and shows linking errors if any.
 * @param {HTMLElement[]} elems
 * @param {RequestEntry[]} queryKeys
 * @param {Map<string, SearchResultEntry[]>} data
 * @param {any} conf
 */
function addDataCiteToTerms(elems, queryKeys, data, conf) {
  /** @type {Errors} */
  const errors = { ambiguous: new Map(), notFound: new Map() };

  for (let i = 0, l = elems.length; i < l; i++) {
    if (elems[i].closest("[data-no-xref]")) continue;

    const elem = elems[i];
    const query = queryKeys[i];

    const { id } = query;
    const results = data.get(id);
    if (results.length === 1) {
      addDataCite(elem, query, results[0], conf);
    } else {
      const collector = errors[results.length === 0 ? "notFound" : "ambiguous"];
      if (!collector.has(id)) {
        collector.set(id, { elems: [], results, query });
      }
      collector.get(id).elems.push(elem);
    }
  }

  showErrors(errors);
}

/**
 * @param {HTMLElement} elem
 * @param {RequestEntry} query
 * @param {SearchResultEntry} result
 * @param {any} conf
 */
function addDataCite(elem, query, result, conf) {
  const { term } = query;
  const { uri, shortname: cite, normative, type } = result;

  const path = uri.includes("/") ? uri.split("/", 1)[1] : uri;
  const [citePath, citeFrag] = path.split("#");
  const dataset = { cite, citePath, citeFrag, type };
  Object.assign(elem.dataset, dataset);

  addToReferences(elem, cite, normative, term, conf);
}

/**
 * add specs for citation (references section)
 * @param {HTMLElement} elem
 * @param {string} cite
 * @param {boolean} normative
 * @param {string} term
 * @param {any} conf
 */
function addToReferences(elem, cite, normative, term, conf) {
  const isNormRef = isNormative(elem);
  if (!isNormRef) {
    // Only add it if not already normative...
    if (!conf.normativeReferences.has(cite)) {
      conf.informativeReferences.add(cite);
    }
    return;
  }
  if (normative) {
    // If it was originally informative, we move the existing
    // key to be normative.
    const existingKey = conf.informativeReferences.has(cite)
      ? conf.informativeReferences.getCanonicalKey(cite)
      : cite;
    conf.normativeReferences.add(existingKey);
    conf.informativeReferences.delete(existingKey);
    return;
  }

  const msg =
    `Adding an informative reference to "${term}" from "${cite}" ` +
    "in a normative section";
  const title = "Error: Informative reference in normative section";
  showInlineWarning(elem, msg, title);
}

/** @param {Errors} errors */
function showErrors({ ambiguous, notFound }) {
  const getPrefilledFormURL = (term, query, specs = []) => {
    const url = new URL(API_URL);
    url.searchParams.set("term", term);
    if (query.for) url.searchParams.set("for", query.for);
    url.searchParams.set("types", query.types.join(","));
    if (specs.length) url.searchParams.set("cite", specs.join(","));
    return url;
  };

  for (const { query, elems } of notFound.values()) {
    const specs = [...new Set(flatten$1([], query.specs))].sort();
    const originalTerm = getTermFromElement(elems[0]);
    const formUrl = getPrefilledFormURL(originalTerm, query, specs);
    const specsString = specs.map(spec => `\`${spec}\``).join(", ");
    const msg =
      `Couldn't match "**${originalTerm}**" to anything in the document or in any other document cited in this specification: ${specsString}. ` +
      `See [how to cite to resolve the error](${formUrl})`;
    showInlineError(elems, msg, "Error: No matching dfn found.");
  }

  for (const { query, elems, results } of ambiguous.values()) {
    const specs = [...new Set(results.map(entry => entry.shortname))].sort();
    const specsString = specs.map(s => `**${s}**`).join(", ");
    const originalTerm = getTermFromElement(elems[0]);
    const formUrl = getPrefilledFormURL(originalTerm, query, specs);
    const msg =
      `The term "**${originalTerm}**" is defined in ${specsString} in multiple ways, so it's ambiguous. ` +
      `See [how to cite to resolve the error](${formUrl})`;
    showInlineError(elems, msg, "Error: Linking an ambiguous dfn.");
  }
}

function objectHash(obj) {
  const str = JSON.stringify(obj, Object.keys(obj).sort());
  const buffer = new TextEncoder().encode(str);
  return crypto.subtle.digest("SHA-1", buffer).then(bufferToHexString);
}

/** @param {ArrayBuffer} buffer */
function bufferToHexString(buffer) {
  const byteArray = new Uint8Array(buffer);
  return [...byteArray].map(v => v.toString(16).padStart(2, "0")).join("");
}

// @ts-check
const name$E = "core/link-to-dfn";

const localizationStrings$9 = {
  en: {
    /**
     * @param {string} title
     */
    duplicateMsg(title) {
      return `Duplicate definition(s) of '${title}'`;
    },
    duplicateTitle: "This is defined more than once in the document.",
  },
};
const l10n$b = getIntlData(localizationStrings$9);

class CaseInsensitiveMap extends Map {
  /**
   * @param {Array<[String, HTMLElement]>} [entries]
   */
  constructor(entries = []) {
    super();
    entries.forEach(([key, elem]) => {
      this.set(key, elem);
    });
    return this;
  }
  set(key, elem) {
    super.set(key.toLowerCase(), elem);
    return this;
  }
  get(key) {
    return super.get(key.toLowerCase());
  }
  has(key) {
    return super.has(key.toLowerCase());
  }
  delete(key) {
    return super.delete(key.toLowerCase());
  }
}

async function run$s(conf) {
  const titleToDfns = mapTitleToDfns();
  /** @type {HTMLElement[]} */
  const possibleExternalLinks = [];
  /** @type {HTMLAnchorElement[]} */
  const badLinks = [];

  const localLinkSelector =
    "a[data-cite=''], a:not([href]):not([data-cite]):not(.logo):not(.externalDFN)";
  document.querySelectorAll(localLinkSelector).forEach((
    /** @type {HTMLAnchorElement} */ anchor
  ) => {
    const linkTargets = getLinkTargets(anchor);
    const foundDfn = linkTargets.some(target => {
      return findLinkTarget(target, anchor, titleToDfns, possibleExternalLinks);
    });
    if (!foundDfn && linkTargets.length !== 0) {
      if (anchor.dataset.cite === "") {
        badLinks.push(anchor);
      } else {
        possibleExternalLinks.push(anchor);
      }
    }
  });

  showLinkingError(badLinks);

  if (conf.xref) {
    possibleExternalLinks.push(...findExplicitExternalLinks());
    try {
      await run$r(conf, possibleExternalLinks);
    } catch (error) {
      console.error(error);
      showLinkingError(possibleExternalLinks);
    }
  } else {
    showLinkingError(possibleExternalLinks);
  }

  await linkInlineCitations(document, conf);
  // Added message for legacy compat with Aria specs
  // See https://github.com/w3c/respec/issues/793
  pub("end", "core/link-to-dfn");
}

function mapTitleToDfns() {
  const titleToDfns = new CaseInsensitiveMap();
  Object.keys(definitionMap).forEach(title => {
    const { result, duplicates } = collectDfns(title);
    titleToDfns.set(title, result);
    if (duplicates.length > 0) {
      showInlineError(
        duplicates,
        l10n$b.duplicateMsg(title),
        l10n$b.duplicateTitle
      );
    }
  });
  return titleToDfns;
}

/**
 * @param {string} title
 */
function collectDfns(title) {
  /** @type {Map<string, HTMLElement>} */
  const result = new Map();
  const duplicates = [];
  definitionMap[title].forEach(dfn => {
    const { dfnFor = "" } = dfn.dataset;
    if (result.has(dfnFor)) {
      // We want <dfn> definitions to take precedence over
      // definitions from WebIDL. WebIDL definitions wind
      // up as <span>s instead of <dfn>.
      const oldIsDfn = result.get(dfnFor).localName === "dfn";
      const newIsDfn = dfn.localName === "dfn";
      if (oldIsDfn) {
        if (!newIsDfn) {
          // Don't overwrite <dfn> definitions.
          return;
        }
        duplicates.push(dfn);
      }
    }
    result.set(dfnFor, dfn);
    addId(dfn, "dfn", title);
  });
  return { result, duplicates };
}

/**
 * @param {import("./utils.js").LinkTarget} target
 * @param {HTMLAnchorElement} anchor
 * @param {CaseInsensitiveMap} titleToDfns
 * @param {HTMLElement[]} possibleExternalLinks
 */
function findLinkTarget(target, anchor, titleToDfns, possibleExternalLinks) {
  const { linkFor } = anchor.dataset;
  if (
    !titleToDfns.has(target.title) ||
    !titleToDfns.get(target.title).get(target.for)
  ) {
    return false;
  }
  const dfn = titleToDfns.get(target.title).get(target.for);
  if (dfn.dataset.cite) {
    anchor.dataset.cite = dfn.dataset.cite;
  } else if (linkFor && !titleToDfns.get(linkFor)) {
    possibleExternalLinks.push(anchor);
  } else if (dfn.classList.contains("externalDFN")) {
    // data-lt[0] serves as unique id for the dfn which this element references
    const lt = dfn.dataset.lt ? dfn.dataset.lt.split("|") : [];
    anchor.dataset.lt = lt[0] || dfn.textContent;
    possibleExternalLinks.push(anchor);
  } else {
    if (anchor.dataset.idl === "partial") {
      possibleExternalLinks.push(anchor);
    } else {
      anchor.href = `#${dfn.id}`;
      anchor.classList.add("internalDFN");
    }
  }
  if (!anchor.hasAttribute("data-link-type")) {
    anchor.dataset.linkType = "idl" in dfn.dataset ? "idl" : "dfn";
  }
  if (isCode(dfn)) {
    wrapAsCode(anchor, dfn);
  }
  return true;
}

/**
 * Check if a definition is a code
 * @param {HTMLElement} dfn a definition
 */
function isCode(dfn) {
  if (dfn.closest("code,pre")) {
    return true;
  }
  // Note that childNodes.length === 1 excludes
  // definitions that have either other text, or other
  // whitespace, inside the <dfn>.
  if (dfn.childNodes.length !== 1) {
    return false;
  }
  const [first] = /** @type {NodeListOf<HTMLElement>} */ (dfn.childNodes);
  return first.localName === "code";
}

/**
 * Wrap links by <code>.
 * @param {HTMLAnchorElement} anchor a link
 * @param {HTMLElement} dfn a definition
 */
function wrapAsCode(anchor, dfn) {
  // only add code to IDL when the definition matches
  const term = anchor.textContent.trim();
  const isIDL = dfn.dataset.hasOwnProperty("idl");
  const needsCode = shouldWrapByCode(anchor) || shouldWrapByCode(dfn, term);
  if (!isIDL || needsCode) {
    wrapInner(anchor, document.createElement("code"));
  }
}

/**
 * @param {HTMLElement} elem
 * @param {string} term
 */
function shouldWrapByCode(elem, term = "") {
  switch (elem.localName) {
    case "a":
      if (elem.querySelector("code")) {
        return true;
      }
      break;
    default: {
      const { dataset } = elem;
      if (elem.textContent.trim() === term) {
        return true;
      } else if (dataset.title === term) {
        return true;
      } else if (dataset.lt || dataset.localLt) {
        const terms = [];
        if (dataset.lt) {
          terms.push(...dataset.lt.split("|"));
        }
        if (dataset.localLt) {
          terms.push(...dataset.localLt.split("|"));
        }
        return terms.includes(term);
      }
    }
  }
  return false;
}

/**
 * Find additional references that need to be looked up externally.
 * Examples: a[data-cite="spec"], dfn[data-cite="spec"], dfn.externalDFN
 */
function findExplicitExternalLinks() {
  /** @type {NodeListOf<HTMLElement>} */
  const links = document.querySelectorAll(
    "a[data-cite]:not([data-cite='']):not([data-cite*='#']), " +
      "dfn[data-cite]:not([data-cite='']):not([data-cite*='#'])"
  );
  /** @type {NodeListOf<HTMLElement>} */
  const externalDFNs = document.querySelectorAll("dfn.externalDFN");
  return [...links]
    .filter(el => {
      // ignore empties
      if (el.textContent.trim() === "") return false;
      /** @type {HTMLElement} */
      const closest = el.closest("[data-cite]");
      return !closest || closest.dataset.cite !== "";
    })
    .concat(...externalDFNs);
}

function showLinkingError(elems) {
  elems.forEach(elem => {
    showInlineWarning(
      elem,
      `Found linkless \`<a>\` element with text "${elem.textContent}" but no matching \`<dfn>\``,
      "Linking error: not matching `<dfn>`"
    );
  });
}

var linkToDfn = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$E,
  run: run$s
});

// @ts-check
const name$F = "core/contrib";

async function run$t(conf) {
  const ghContributors = document.getElementById("gh-contributors");
  if (!ghContributors) {
    return;
  }

  if (!conf.github) {
    const msg =
      "Requested list of contributors from GitHub, but " +
      "[`github`](https://github.com/w3c/respec/wiki/github) configuration option is not set.";
    pub("error", msg);
    return;
  }

  const editors = conf.editors.map(editor => editor.name);
  const apiURL = `${conf.github.apiBase}/${conf.github.fullName}/`;
  await showContributors(editors, apiURL);
}

/**
 * Show list of contributors in #gh-contributors
 * @param {string[]} editors
 * @param {string} apiURL
 */
async function showContributors(editors, apiURL) {
  const elem = document.getElementById("gh-contributors");
  if (!elem) return;

  elem.textContent = "Fetching list of contributors...";
  const contributors = await getContributors();
  if (contributors !== null) {
    toHTML(contributors, elem);
  } else {
    elem.textContent = "Failed to fetch contributors.";
  }

  async function getContributors() {
    const { href: url } = new URL("contributors", apiURL);
    try {
      const res = await fetchAndCache(url);
      if (!res.ok) {
        throw new Error(
          `Request to ${url} failed with status code ${res.status}`
        );
      }
      /** @type {Contributor[]} */
      const contributors = await res.json();
      return contributors.filter(
        user => !editors.includes(user.name || user.login)
      );
    } catch (error) {
      pub("error", "Error loading contributors from GitHub.");
      console.error(error);
      return null;
    }
  }
}

/**
 * @typedef {{ name?: string, login: string }} Contributor
 * @param {Contributor[]} contributors
 * @param {HTMLElement} element
 */
function toHTML(contributors, element) {
  const sortedContributors = contributors.sort((a, b) => {
    const nameA = a.name || a.login;
    const nameB = b.name || b.login;
    return nameA.toLowerCase().localeCompare(nameB.toLowerCase());
  });

  if (element.tagName === "UL") {
    hyperHTML$1(element)`${sortedContributors.map(
      ({ name, login }) =>
        `<li><a href="https://github.com/${login}">${name || login}</a></li>`
    )}`;
    return;
  }

  const names = sortedContributors.map(user => user.name || user.login);
  element.textContent = joinAnd(names);
}

var contrib = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$F,
  run: run$t
});

// @ts-check

const name$G = "core/fix-headers";

function run$u() {
  [...document.querySelectorAll("section:not(.introductory)")]
    .map(sec => sec.querySelector("h1, h2, h3, h4, h5, h6"))
    .filter(h => h)
    .forEach(heading => {
      const depth = Math.min(getParents(heading, "section").length + 1, 6);
      renameElement(heading, `h${depth}`);
    });
}

function getParents(el, selector) {
  const parents = [];
  while (el != el.ownerDocument.body) {
    if (el.matches(selector)) parents.push(el);
    el = el.parentElement;
  }
  return parents;
}

var fixHeaders = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$G,
  run: run$u
});

// @ts-check

const lowerHeaderTags = ["h2", "h3", "h4", "h5", "h6"];
const headerTags = ["h1", ...lowerHeaderTags];

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const name$H = "core/structure";

const localizationStrings$a = {
  en: {
    toc: "Table of Contents",
  },
  nl: {
    toc: "Inhoudsopgave",
  },
  es: {
    toc: "Tabla de Contenidos",
  },
};

const l10n$c = getIntlData(localizationStrings$a);

/**
 * @typedef {object} SectionInfo
 * @property {string} secno
 * @property {string} title
 *
 * Scans sections and generate ordered list element + ID-to-anchor-content dictionary.
 * @param {Section[]} sections the target element to find child sections
 * @param {number} maxTocLevel
 */
function scanSections(sections, maxTocLevel, { prefix = "" } = {}) {
  let appendixMode = false;
  let lastNonAppendix = 0;
  let index = 1;
  if (prefix.length && !prefix.endsWith(".")) {
    prefix += ".";
  }
  if (sections.length === 0) {
    return null;
  }
  /** @type {HTMLElement} */
  const ol = hyperHTML$1`<ol class='toc'>`;
  for (const section of sections) {
    if (section.isAppendix && !prefix && !appendixMode) {
      lastNonAppendix = index;
      appendixMode = true;
    }
    let secno = section.isIntro
      ? ""
      : appendixMode
      ? alphabet.charAt(index - lastNonAppendix)
      : prefix + index;
    const level = Math.ceil(secno.length / 2);
    if (level === 1) {
      secno += ".";
      // if this is a top level item, insert
      // an OddPage comment so html2ps will correctly
      // paginate the output
      section.header.before(document.createComment("OddPage"));
    }

    if (!section.isIntro) {
      index += 1;
      section.header.prepend(hyperHTML$1`<bdi class='secno'>${secno} </bdi>`);
    }

    if (level <= maxTocLevel) {
      const id = section.header.id || section.element.id;
      const item = createTocListItem(section.header, id);
      const sub = scanSections(section.subsections, maxTocLevel, {
        prefix: secno,
      });
      if (sub) {
        item.append(sub);
      }
      ol.append(item);
    }
  }
  return ol;
}

/**
 * @typedef {object} Section
 * @property {Element} element
 * @property {Element} header
 * @property {string} title
 * @property {boolean} isIntro
 * @property {boolean} isAppendix
 * @property {Section[]} subsections
 *
 * @param {Element} parent
 */
function getSectionTree(parent, { tocIntroductory = false } = {}) {
  const sectionElements = children(
    parent,
    tocIntroductory ? "section" : "section:not(.introductory)"
  );
  /** @type {Section[]} */
  const sections = [];

  for (const section of sectionElements) {
    const noToc = section.classList.contains("notoc");
    if (!section.children.length || noToc) {
      continue;
    }
    const header = section.children[0];
    if (!lowerHeaderTags.includes(header.localName)) {
      continue;
    }
    const title = header.textContent;
    addId(section, null, title);
    sections.push({
      element: section,
      header,
      title,
      isIntro: section.classList.contains("introductory"),
      isAppendix: section.classList.contains("appendix"),
      subsections: getSectionTree(section, { tocIntroductory }),
    });
  }
  return sections;
}

/**
 * @param {Element} header
 * @param {string} id
 */
function createTocListItem(header, id) {
  const anchor = hyperHTML$1`<a href="${`#${id}`}" class="tocxref"/>`;
  anchor.append(...header.cloneNode(true).childNodes);
  filterHeader(anchor);
  return hyperHTML$1`<li class='tocline'>${anchor}</li>`;
}

/**
 * Replaces any child <a> and <dfn> with <span>.
 * @param {HTMLElement} h
 */
function filterHeader(h) {
  h.querySelectorAll("a").forEach(anchor => {
    const span = renameElement(anchor, "span");
    span.className = "formerLink";
    span.removeAttribute("href");
  });
  h.querySelectorAll("dfn").forEach(dfn => {
    const span = renameElement(dfn, "span");
    span.removeAttribute("id");
  });
}

function run$v(conf) {
  if ("tocIntroductory" in conf === false) {
    conf.tocIntroductory = false;
  }
  if ("maxTocLevel" in conf === false) {
    conf.maxTocLevel = Infinity;
  }

  renameSectionHeaders();

  // makeTOC
  if (!conf.noTOC) {
    const sectionTree = getSectionTree(document.body, {
      tocIntroductory: conf.tocIntroductory,
    });
    const result = scanSections(sectionTree, conf.maxTocLevel);
    if (result) {
      createTableOfContents(result);
    }
  }
}

function renameSectionHeaders() {
  const headers = getNonintroductorySectionHeaders();
  if (!headers.length) {
    return;
  }
  headers.forEach(header => {
    const depth = Math.min(parents(header, "section").length + 1, 6);
    const h = `h${depth}`;
    if (header.localName !== h) {
      renameElement(header, h);
    }
  });
}

function getNonintroductorySectionHeaders() {
  const headerSelector = headerTags
    .map(h => `section:not(.introductory) ${h}:first-child`)
    .join(",");
  return [...document.querySelectorAll(headerSelector)].filter(
    elem => !elem.closest("section.introductory")
  );
}

/**
 * @param {HTMLElement} ol
 */
function createTableOfContents(ol) {
  if (!ol) {
    return;
  }
  const nav = hyperHTML$1`<nav id="toc">`;
  const h2 = hyperHTML$1`<h2 class="introductory">${l10n$c.toc}</h2>`;
  addId(h2);
  nav.append(h2, ol);
  const ref =
    document.getElementById("toc") ||
    document.getElementById("sotd") ||
    document.getElementById("abstract");
  if (ref) {
    if (ref.id === "toc") {
      ref.replaceWith(nav);
    } else {
      ref.after(nav);
    }
  }

  const link = hyperHTML$1`<p role='navigation' id='back-to-top'><a href='#title'><abbr title='Back to Top'>&uarr;</abbr></a></p>`;
  document.body.append(link);
}

var structure$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$H,
  run: run$v
});

// @ts-check

const name$I = "core/informative";

const localizationStrings$b = {
  en: {
    informative: "This section is non-normative.",
  },
  nl: {
    informative: "Dit onderdeel is niet normatief.",
  },
};

const l10n$d = getIntlData(localizationStrings$b);

function run$w() {
  Array.from(document.querySelectorAll("section.informative"))
    .map(informative => informative.querySelector("h2, h3, h4, h5, h6"))
    .filter(heading => heading)
    .forEach(heading => {
      heading.after(hyperHTML$1`<p><em>${l10n$d.informative}</em></p>`);
    });
}

var informative = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$I,
  run: run$w
});

// @ts-check
// Module core/id-headers
// All headings are expected to have an ID, unless their immediate container has one.
// This is currently in core though it comes from a W3C rule. It may move in the future.

const name$J = "core/id-headers";

function run$x(conf) {
  /** @type {NodeListOf<HTMLElement>} */
  const headings = document.querySelectorAll(
    `section:not(.head):not(.introductory) h2, h3, h4, h5, h6`
  );
  for (const h of headings) {
    // prefer for ID: heading.id > parentElement.id > newly generated heading.id
    let id = h.id;
    if (!id) {
      addId(h);
      id = h.parentElement.id || h.id;
    }
    if (!conf.addSectionLinks) continue;
    h.appendChild(hyperHTML$1`
      <a href="${`#${id}`}" class="self-link" aria-label="§"></a>
    `);
  }
}

var idHeaders = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$J,
  run: run$x
});

// @ts-check

const name$K = "core/caniuse";

const API_URL$1 = "https://respec.org/caniuse/";

// browser name dictionary
const BROWSERS = new Map([
  ["and_chr", "Chrome (Android)"],
  ["and_ff", "Firefox (Android)"],
  ["and_uc", "UC Browser (Android)"],
  ["android", "Android"],
  ["bb", "Blackberry"],
  ["chrome", "Chrome"],
  ["edge", "Edge"],
  ["firefox", "Firefox"],
  ["ie", "IE"],
  ["ios_saf", "Safari (iOS)"],
  ["op_mini", "Opera Mini"],
  ["op_mob", "Opera Mobile"],
  ["opera", "Opera"],
  ["safari", "Safari"],
  ["samsung", "Samsung Internet"],
]);

// Keys from https://github.com/Fyrd/caniuse/blob/master/CONTRIBUTING.md
const supportTitles = new Map([
  ["y", "Supported."],
  ["a", "Almost supported (aka Partial support)."],
  ["n", "No support, or disabled by default."],
  ["p", "No support, but has Polyfill."],
  ["u", "Support unknown."],
  ["x", "Requires prefix to work."],
  ["d", "Disabled by default (needs to enabled)."],
]);

if (
  !document.querySelector("link[rel='preconnect'][href='https://respec.org']")
) {
  const link = createResourceHint({
    hint: "preconnect",
    href: "https://respec.org",
  });
  document.head.appendChild(link);
}

const caniuseCssPromise = loadStyle$5();

async function loadStyle$5() {
  try {
    return (await Promise.resolve().then(function () { return caniuse$2; })).default;
  } catch {
    return fetchAsset("caniuse.css");
  }
}

async function run$y(conf) {
  if (!conf.caniuse) {
    return; // nothing to do.
  }
  const options = getNormalizedConf(conf);
  conf.caniuse = options; // for tests
  if (!options.feature) {
    return; // no feature to show
  }
  const featureURL = new URL(options.feature, "https://caniuse.com/").href;

  const caniuseCss = await caniuseCssPromise;
  document.head.appendChild(hyperHTML$1`
    <style class="removeOnSave">${caniuseCss}</style>`);

  const headDlElem = document.querySelector(".head dl");
  const contentPromise = (async () => {
    try {
      const apiUrl = options.apiURL || API_URL$1;
      const stats = await fetchStats(apiUrl, options);
      return createTableHTML(featureURL, stats);
    } catch (err) {
      console.error(err);
      const msg =
        `Couldn't find feature "${options.feature}" on caniuse.com? ` +
        "Please check the feature key on [caniuse.com](https://caniuse.com)";
      pub("error", msg);
      return hyperHTML$1`<a href="${featureURL}">caniuse.com</a>`;
    }
  })();
  const definitionPair = hyperHTML$1`
    <dt class="caniuse-title">Browser support:</dt>
    <dd class="caniuse-stats">${{
      any: contentPromise,
      placeholder: "Fetching data from caniuse.com...",
    }}</dd>`;
  headDlElem.append(...definitionPair.childNodes);
  await contentPromise;

  // remove from export
  pub("amend-user-config", { caniuse: options.feature });
  sub("beforesave", outputDoc => {
    hyperHTML$1.bind(outputDoc.querySelector(".caniuse-stats"))`
      <a href="${featureURL}">caniuse.com</a>`;
  });
}

/**
 * returns normalized `conf.caniuse` configuration
 * @param {Object} conf   configuration settings
 */
function getNormalizedConf(conf) {
  const DEFAULTS = { versions: 4 };
  if (typeof conf.caniuse === "string") {
    return { feature: conf.caniuse, ...DEFAULTS };
  }
  const caniuseConf = { ...DEFAULTS, ...conf.caniuse };
  const { browsers } = caniuseConf;
  if (Array.isArray(browsers)) {
    const invalidBrowsers = browsers.filter(browser => !BROWSERS.has(browser));
    if (invalidBrowsers.length) {
      const names = invalidBrowsers.map(b => `"\`${b}\`"`).join(", ");
      pub(
        "warn",
        `Ignoring invalid browser(s): ${names} in ` +
          "[`respecConfig.caniuse.browsers`](https://github.com/w3c/respec/wiki/caniuse)"
      );
    }
  }
  return caniuseConf;
}

/**
 * @param {string} apiURL
 * @typedef {Record<string, [string, string[]][]>} ApiResponse
 * @return {Promise<ApiResponse>}
 * @throws {Error} on failure
 */
async function fetchStats(apiURL, options) {
  const { feature, versions, browsers } = options;
  const searchParams = new URLSearchParams();
  searchParams.set("feature", feature);
  searchParams.set("versions", versions);
  if (Array.isArray(browsers)) {
    searchParams.set("browsers", browsers.join(","));
  }
  const url = `${apiURL}?${searchParams.toString()}`;
  const response = await fetch(url);
  const stats = await response.json();
  return stats;
}

/**
 * Get HTML element for the canIUse support table.
 * @param {string} featureURL
 * @param {ApiResponse} stats
 */
function createTableHTML(featureURL, stats) {
  // render the support table
  return hyperHTML$1`
    ${Object.entries(stats).map(addBrowser)}
    <a href="${featureURL}"
      title="Get details at caniuse.com">More info
    </a>`;
}

/**
 * Add a browser and it's support to table.
 * @param {[ string, ApiResponse["browserName"] ]} args
 */
function addBrowser([browserName, browserData]) {
  /** @param {string[]} supportKeys */
  const getSupport = supportKeys => {
    const titles = supportKeys
      .filter(key => supportTitles.has(key))
      .map(key => supportTitles.get(key));
    return {
      className: `caniuse-cell ${supportKeys.join(" ")}`,
      title: titles.join(" "),
    };
  };

  /** @param {[string, string[]]} args */
  const addLatestVersion = ([version, supportKeys]) => {
    const { className, title } = getSupport(supportKeys);
    const buttonText = `${BROWSERS.get(browserName) || browserName} ${version}`;
    return hyperHTML$1`
      <button class="${className}" title="${title}">${buttonText}</button>`;
  };

  /** @param {[string, string[]]} args */
  const addBrowserVersion = ([version, supportKeys]) => {
    const { className, title } = getSupport(supportKeys);
    return hyperHTML$1`<li class="${className}" title="${title}">${version}</li>`;
  };

  const [latestVersion, ...olderVersions] = browserData;
  return hyperHTML$1`
    <div class="caniuse-browser">
      ${addLatestVersion(latestVersion)}
      <ul>
        ${olderVersions.map(addBrowserVersion)}
      </ul>
    </div>`;
}

var caniuse = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$K,
  run: run$y
});

// @ts-check

const name$L = "core/mdn-annoatation";

const SPEC_MAP_URL =
  "https://raw.githubusercontent.com/w3c/mdn-spec-links/master/SPECMAP.json";
const BASE_JSON_PATH = "https://w3c.github.io/mdn-spec-links/";
const MDN_URL_BASE = "https://developer.mozilla.org/en-US/docs/Web/";
const MDN_BROWSERS = {
  // The browser IDs here must match the ones in the imported JSON data.
  // See the list of browser IDs at https://goo.gl/iDacWP.
  chrome: "Chrome",
  chrome_android: "Chrome Android",
  edge: "Edge",
  edge_mobile: "Edge Mobile",
  firefox: "Firefox",
  firefox_android: "Firefox Android",
  ie: "Internet Explorer",
  // nodejs: "Node.js", // no data for features in HTML
  opera: "Opera",
  opera_android: "Opera Android",
  // qq_android: "QQ Browser", // not enough data for features in HTML
  safari: "Safari",
  safari_ios: "Safari iOS",
  samsunginternet_android: "Samsung Internet",
  // uc_android: "UC browser", // not enough data for features in HTML
  // uc_chinese_android: "Chinese UC Browser", // not enough data for features in HTML
  webview_android: "WebView Android",
};

const mdnCssPromise = loadStyle$6();

async function loadStyle$6() {
  try {
    return (await Promise.resolve().then(function () { return mdnAnnotation$2; })).default;
  } catch {
    return fetchAsset("mdn-annotation.css");
  }
}

function fetchAndCacheJson(url, maxAge) {
  if (!url) return {};
  return fetchAndCache(url, maxAge).then(r => r.json());
}

function insertMDNBox(node) {
  const targetAncestor = node.closest("section");
  const { previousElementSibling: targetSibling, parentNode } = targetAncestor;
  if (targetSibling && targetSibling.classList.contains("mdn")) {
    // If the target ancestor already has a mdnBox inserted, we just use it
    return targetSibling;
  }
  const mdnBox = hyperHTML$1`<aside class="mdn before wrapped"></aside>`;
  parentNode.insertBefore(mdnBox, targetAncestor);
  return mdnBox;
}

function attachMDNDetail(container, mdnSpec) {
  const { slug, summary } = mdnSpec;
  container.innerHTML += `<button onclick="toggleMDNStatus(this.parentNode)" aria-label="Expand MDN details"><b>MDN</b></button>`;
  const mdnSubPath = slug.slice(slug.indexOf("/") + 1);
  const href = `${MDN_URL_BASE}${slug}`;
  const mdnDetail = hyperHTML$1`
    <div>
      <a title="${summary}" href="${href}">${mdnSubPath}</a>
    </div>
  `;
  attachMDNBrowserSupport(mdnDetail, mdnSpec);
  container.appendChild(mdnDetail);
}

function attachMDNBrowserSupport(container, mdnSpec) {
  if (!mdnSpec.support) {
    container.innerHTML += `<p class="nosupportdata">No support data.</p>`;
    return;
  }
  const supportTable = hyperHTML$1`<p class="mdnsupport">
    ${[buildBrowserSupportTable(mdnSpec.support)]}
  </p>`;
  container.appendChild(supportTable);
}

function buildBrowserSupportTable(support) {
  let innerHTML = "";
  function addMDNBrowserRow(browserId, yesNoUnknown, version) {
    const displayStatus = yesNoUnknown === "Unknown" ? "?" : yesNoUnknown;
    const classList = `${browserId} ${yesNoUnknown.toLowerCase()}`;
    const browserRow = `
      <span class="${classList}">
        <span class="browser-name">${MDN_BROWSERS[browserId]}</span>
        <span class="version">${version ? version : displayStatus}</span>
      </span>`;
    innerHTML += browserRow;
  }

  function processBrowserData(browserId, versionData) {
    if (versionData.version_removed) {
      addMDNBrowserRow(browserId, "No", "");
      return;
    }
    const versionAdded = versionData.version_added;
    if (!versionAdded) {
      addMDNBrowserRow(browserId, "Unknown", "");
      return;
    }
    if (typeof versionAdded === "boolean") {
      addMDNBrowserRow(browserId, versionAdded ? "Yes" : "No", "");
    } else {
      addMDNBrowserRow(browserId, "Yes", `${versionAdded}+`);
    }
  }

  Object.keys(MDN_BROWSERS).forEach(browserId => {
    if (!support[browserId]) {
      addMDNBrowserRow(browserId, "Unknown", "");
    } else {
      if (Array.isArray(support[browserId])) {
        support[browserId].forEach(b => {
          processBrowserData(browserId, b);
        });
      } else {
        processBrowserData(browserId, support[browserId]);
      }
    }
  });
  return innerHTML;
}

async function run$z(conf) {
  const { shortName, mdn } = conf;
  if (!shortName || !mdn) {
    // Nothing to do if shortName is not provided
    return;
  }
  const maxAge = mdn.maxAge || 60 * 60 * 24 * 1000;
  const specMapUrl = mdn.specMapUrl || SPEC_MAP_URL;
  const baseJsonPath = mdn.baseJsonPath || BASE_JSON_PATH;
  const specMap = await fetchAndCacheJson(specMapUrl, maxAge);
  const hasSpecJson = Object.values(specMap).some(
    jsonName => jsonName === `${shortName}.json`
  );
  if (!hasSpecJson) {
    return;
  }
  const mdnSpecJson = await fetchAndCacheJson(
    `${baseJsonPath}/${shortName}.json`,
    maxAge
  );
  const mdnCss = await mdnCssPromise;
  document.head.appendChild(hyperHTML$1`<style>${[mdnCss]}</style>`);
  document.head.appendChild(hyperHTML$1`<script>
     function toggleMDNStatus(div) {
       div.parentNode.classList.toggle('wrapped');
     }
  </script>`);
  const nodesWithId = document.querySelectorAll("[id]");
  [...nodesWithId]
    .filter(node => {
      const unlikelyTagNames = ["STYLE", "SCRIPT", "BODY"];
      return (
        unlikelyTagNames.indexOf(node.tagName) === -1 &&
        mdnSpecJson[node.id] &&
        Array.isArray(mdnSpecJson[node.id])
      );
    })
    .forEach(node => {
      const mdnSpecArray = mdnSpecJson[node.id];
      const mdnBox = insertMDNBox(node);
      mdnSpecArray
        .map(spec => {
          const mdnDiv = document.createElement("div");
          attachMDNDetail(mdnDiv, spec);
          return mdnDiv;
        })
        .forEach(mdnDiv => mdnBox.appendChild(mdnDiv));
    });
}

var mdnAnnotation = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$L,
  run: run$z
});

// @ts-check

const mimeTypes = new Map([
  ["text/html", "html"],
  ["application/xml", "xml"],
]);

/**
 * Creates a dataURI from a ReSpec document. It also cleans up the document
 * removing various things.
 *
 * @param {String} mimeType mimetype. one of `mimeTypes` above
 * @param {Document} doc document to export. useful for testing purposes
 * @returns a stringified data-uri of document that can be saved.
 */
function rsDocToDataURL(mimeType, doc = document) {
  const format = mimeTypes.get(mimeType);
  if (!format) {
    const validTypes = [...mimeTypes.values()].join(", ");
    const msg = `Invalid format: ${mimeType}. Expected one of: ${validTypes}.`;
    throw new TypeError(msg);
  }
  const data = serialize(format, doc);
  const encodedString = encodeURIComponent(data);
  return `data:${mimeType};charset=utf-8,${encodedString}`;
}

function serialize(format, doc) {
  const cloneDoc = doc.cloneNode(true);
  cleanup(cloneDoc);
  let result = "";
  switch (format) {
    case "xml":
      result = new XMLSerializer().serializeToString(cloneDoc);
      break;
    default: {
      if (cloneDoc.doctype) {
        result += new XMLSerializer().serializeToString(cloneDoc.doctype);
      }
      result += cloneDoc.documentElement.outerHTML;
    }
  }
  return result;
}

function cleanup(cloneDoc) {
  const { head, body, documentElement } = cloneDoc;
  removeCommentNodes(cloneDoc);

  cloneDoc
    .querySelectorAll(".removeOnSave, #toc-nav")
    .forEach(elem => elem.remove());
  body.classList.remove("toc-sidebar");
  removeReSpec(documentElement);

  const insertions = cloneDoc.createDocumentFragment();

  // Move meta viewport, as it controls the rendering on mobile.
  const metaViewport = cloneDoc.querySelector("meta[name='viewport']");
  if (metaViewport && head.firstChild !== metaViewport) {
    insertions.appendChild(metaViewport);
  }

  // Move charset to near top, as it needs to be in the first 512 bytes.
  let metaCharset = cloneDoc.querySelector(
    "meta[charset], meta[content*='charset=']"
  );
  if (!metaCharset) {
    metaCharset = hyperHTML$1`<meta charset="utf-8">`;
  }
  insertions.appendChild(metaCharset);

  // Add meta generator
  const respecVersion = `ReSpec ${window.respecVersion || "Developer Channel"}`;
  const metaGenerator = hyperHTML$1`
    <meta name="generator" content="${respecVersion}">
  `;

  insertions.appendChild(metaGenerator);
  head.prepend(insertions);
  pub("beforesave", documentElement);
}

expose("core/exporter", { rsDocToDataURL });

// @ts-check

const name$M = "ui/save-html";

// Create and download an EPUB 3 version of the content
// Using (by default) the EPUB 3 conversion service set up at labs.w3.org/epub-generator
// For more details on that service, see https://github.com/iherman/respec2epub
const epubURL = new URL(
  "https://labs.w3.org/epub-generator/cgi-bin/epub-generator.py"
);
epubURL.searchParams.append("type", "respec");
epubURL.searchParams.append("url", document.location.href);

const downloadLinks = [
  {
    id: "respec-save-as-html",
    fileName: "index.html",
    title: "HTML",
    type: "text/html",
    get href() {
      return rsDocToDataURL(this.type);
    },
  },
  {
    id: "respec-save-as-xml",
    fileName: "index.xhtml",
    title: "XML",
    type: "application/xml",
    get href() {
      return rsDocToDataURL(this.type);
    },
  },
  {
    id: "respec-save-as-epub",
    fileName: "spec.epub",
    title: "EPUB 3",
    type: "application/epub+zip",
    href: epubURL.href,
  },
];

function toDownloadLink(details) {
  const { id, href, fileName, title, type } = details;
  return hyperHTML$1`
    <a
      href="${href}"
      id="${id}"
      download="${fileName}"
      type="${type}"
      class="respec-save-button"
      onclick=${() => ui.closeModal()}
    >${title}</a>`;
}

const saveDialog = {
  async show(button) {
    await document.respecIsReady;
    const div = hyperHTML$1`
      <div class="respec-save-buttons">
        ${downloadLinks.map(toDownloadLink)}
      </div>`;
    ui.freshModal(l10n[lang].save_snapshot, div, button);
  },
};

const supportsDownload = "download" in HTMLAnchorElement.prototype;
let button;
if (supportsDownload) {
  button = ui.addCommand(
    l10n[lang].save_snapshot,
    show,
    "Ctrl+Shift+Alt+S",
    "💾"
  );
}

function show() {
  if (!supportsDownload) return;
  saveDialog.show(button);
}

/**
 * @param {*} _
 * @param {string} mimeType
 */
function exportDocument(_, mimeType) {
  const msg =
    "Exporting via ui/save-html module's `exportDocument()` is deprecated and will be removed. " +
    "Use core/exporter `rsDocToDataURL()` instead.";
  pub("warn", msg);
  console.warn(msg);
  return rsDocToDataURL(mimeType);
}

var saveHtml = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$M,
  exportDocument: exportDocument
});

// @ts-check

const button$1 = ui.addCommand(
  l10n[lang].search_specref,
  show$1,
  "Ctrl+Shift+Alt+space",
  "🔎"
);
const specrefURL = "https://specref.herokuapp.com/";
const refSearchURL = `${specrefURL}search-refs`;
const reveseLookupURL = `${specrefURL}reverse-lookup`;
const form = document.createElement("form");
const renderer = hyperHTML$1.bind(form);
const resultList = hyperHTML$1.bind(document.createElement("div"));

form.id = "specref-ui";

/**
 * @param {Map<string, string>} resultMap
 * @param {string} query
 * @param {number} timeTaken
 */
function renderResults(resultMap, query, timeTaken) {
  if (!resultMap.size) {
    return resultList`
      <p class="state">
        Your search - <strong> ${query} </strong> -
        did not match any references.
      </p>
    `;
  }
  const wires = Array.from(resultMap)
    .slice(0, 99)
    .map(toDefinitionPair)
    .reduce((collector, pair) => collector.concat(pair), []);
  return resultList`
    <p class="result-stats">
      ${resultMap.size} results (${timeTaken} seconds).
      ${resultMap.size > 99 ? "First 100 results." : ""}
    </p>
    <dl class="specref-results">${wires}</dl>
  `;
}

function toDefinitionPair([key, entry]) {
  return hyperHTML$1.wire(entry)`
    <dt>
      [${key}]
    </dt>
    <dd>${wireReference(entry)}</dd>
  `;
}

function resultProcessor({ includeVersions = false } = {}) {
  return (...fetchedData) => {
    /** @type {{ [key: string]: any }} */
    const combinedResults = Object.assign({}, ...fetchedData);
    const results = new Map(Object.entries(combinedResults));
    // remove aliases
    Array.from(results)
      .filter(([, entry]) => entry.aliasOf)
      .map(([key]) => key)
      .reduce((results, key) => results.delete(key) && results, results);
    // Remove versions, if asked to
    if (!includeVersions) {
      Array.from(results.values())
        .filter(entry => typeof entry === "object" && "versions" in entry)
        .reduce(flatten$1, [])
        .forEach(version => {
          results.delete(version);
        });
    }
    // Remove legacy string entries
    Array.from(results)
      .filter(([, value]) => typeof value !== "object")
      .forEach(([key]) => results.delete(key));
    return results;
  };
}

form.addEventListener("submit", async ev => {
  ev.preventDefault();
  const { searchBox } = form;
  const query = searchBox.value;
  if (!query) {
    searchBox.focus();
    return;
  }
  render({ state: "Searching Specref…" });
  const refSearch = new URL(refSearchURL);
  refSearch.searchParams.set("q", query);
  const reverseLookup = new URL(reveseLookupURL);
  reverseLookup.searchParams.set("urls", query);
  try {
    const startTime = performance.now();
    const jsonData = await Promise.all([
      fetch(refSearch).then(response => response.json()),
      fetch(reverseLookup).then(response => response.json()),
    ]);
    const { checked: includeVersions } = form.includeVersions;
    const processResults = resultProcessor({ includeVersions });
    const results = processResults(...jsonData);
    render({
      query,
      results,
      state: "",
      timeTaken: Math.round(performance.now() - startTime) / 1000,
    });
  } catch (err) {
    console.error(err);
    render({ state: "Error! Couldn't do search." });
  } finally {
    searchBox.focus();
  }
});

function show$1() {
  render();
  ui.freshModal(l10n[lang].search_specref, form, button$1);
  /** @type {HTMLElement} */
  const input = form.querySelector("input[type=search]");
  input.focus();
}

const mast = hyperHTML$1.wire()`
  <header>
    <p>
      An Open-Source, Community-Maintained Database of
      Web Standards & Related References.
    </p>
  </header>
  <div class="searchcomponent">
    <input
      name="searchBox"
      type="search"
      autocomplete="off"
      placeholder="Keywords, titles, authors, urls…">
    <button
      type="submit">
        Search
    </button>
    <label>
      <input type="checkbox" name="includeVersions"> Include all versions.
    </label>
  </div>
`;

/**
 * @param {object} options
 * @param {string} [options.state]
 * @param {Map<string, string>} [options.results]
 * @param {number} [options.timeTaken]
 * @param {string} [options.query]
 */
function render({ state = "", results, timeTaken, query } = {}) {
  if (!results) {
    renderer`<div>${mast}</div>`;
    return;
  }
  renderer`
    <div>${mast}</div>
    <p class="state" hidden="${!state}">
      ${state}
    </p>
    <section hidden="${!results}">${
    results ? renderResults(results, query, timeTaken) : []
  }</section>
  `;
}

var searchSpecref = /*#__PURE__*/Object.freeze({
  __proto__: null
});

// @ts-check

const XREF_URL = "https://respec.org/xref/";

const localizationStrings$c = {
  en: {
    title: "Search definitions",
  },
};
const lang$b = lang in localizationStrings$c ? lang : "en";
const l10n$e = localizationStrings$c[lang$b];

const button$2 = ui.addCommand(l10n$e.title, show$2, "Ctrl+Shift+Alt+x", "📚");

function show$2() {
  const iframe = document.createElement("iframe");
  iframe.id = "xref-ui";
  iframe.src = XREF_URL;
  iframe.onload = () => iframe.classList.add("ready");
  ui.freshModal(l10n$e.title, iframe, button$2);
}

var searchXref = /*#__PURE__*/Object.freeze({
  __proto__: null
});

// @ts-check

const button$3 = ui.addCommand(
  l10n[lang].definition_list,
  show$3,
  "Ctrl+Shift+Alt+D",
  "📔"
);

const ul = document.createElement("ul");
ul.classList.add("respec-dfn-list");
const render$1 = hyperHTML$1.bind(ul);

ul.addEventListener("click", ev => {
  ui.closeModal();
  ev.stopPropagation();
});

function show$3() {
  const definitionLinks = Object.entries(definitionMap)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([, [dfn]]) => {
      return hyperHTML$1.wire(dfn, ":li>a")`
        <li>
          <a href="${`#${dfn.id}`}">
            ${dfn.textContent}
          </a>
        </li>
      `;
    });
  render$1`${definitionLinks}`;
  ui.freshModal(l10n[lang].list_of_definitions, ul, button$3);
}

var dfnList = /*#__PURE__*/Object.freeze({
  __proto__: null
});

// @ts-check

// window.respecVersion is added at build time (see tools/builder.js)
window.respecVersion = window.respecVersion || "Developer Edition";
const div = document.createElement("div");
const render$2 = hyperHTML$1.bind(div);
const button$4 = ui.addCommand(
  `About ${window.respecVersion}`,
  show$4,
  "Ctrl+Shift+Alt+A",
  "ℹ️"
);

function show$4() {
  ui.freshModal(
    `${l10n[lang].about_respec} - ${window.respecVersion}`,
    div,
    button$4
  );
  const entries = [];
  if ("getEntriesByType" in performance) {
    performance
      .getEntriesByType("measure")
      .sort((a, b) => b.duration - a.duration)
      .map(({ name, duration }) => {
        const humanDuration =
          duration > 1000
            ? `${Math.round(duration / 1000.0)} second(s)`
            : `${duration.toFixed(2)} milliseconds`;
        return { name, duration: humanDuration };
      })
      .map(perfEntryToTR)
      .forEach(entry => {
        entries.push(entry);
      });
  }
  render$2`
  <p>
    ReSpec is a document production toolchain, with a notable focus on W3C specifications.
  </p>
  <p>
    <a href='https://github.com/w3c/respec/wiki'>Documentation</a>,
    <a href='https://github.com/w3c/respec/issues'>Bugs</a>.
  </p>
  <table border="1" width="100%" hidden="${entries.length ? false : true}">
    <caption>
      Loaded plugins
    </caption>
    <thead>
      <tr>
        <th>
          Plugin Name
        </th>
        <th>
          Processing time
        </th>
      </tr>
    </thead>
    <tbody>${entries}</tbody>
  </table>
`;
}

function perfEntryToTR({ name, duration }) {
  const moduleURL = `https://github.com/w3c/respec/tree/develop/src/${name}.js`;
  return hyperHTML$1`
    <tr>
      <td><a href="${moduleURL}">${name}</a></td>
      <td>${duration}</td>
    </tr>
<<<<<<< HEAD
  `;
}

var aboutRespec = /*#__PURE__*/Object.freeze({
  __proto__: null
});

// @ts-check
/**
 * This Module adds a metatag description to the document, based on the
 * first paragraph of the abstract.
 */

const name$N = "core/seo";

function run$A() {
  const firstParagraph = document.querySelector("#abstract p:first-of-type");
  if (!firstParagraph) {
    return; // no abstract, so nothing to do
  }
  // Normalize whitespace: trim, remove new lines, tabs, etc.
  const content = firstParagraph.textContent.replace(/\s+/, " ").trim();
  const metaElem = document.createElement("meta");
  metaElem.name = "description";
  metaElem.content = content;
  document.head.appendChild(metaElem);
}

var seo = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$N,
  run: run$A
});

// @ts-check
const name$O = "w3c/seo";
async function run$B(conf) {
  // Don't include a canonical URL for documents
  // that haven't been published.
  if (!conf.canonicalURI) {
    switch (conf.specStatus) {
      case "CG-DRAFT":
      case "BG-DRAFT":
      case "unofficial":
        return;
    }
  }
  const trLatestUri = conf.shortName
    ? `https://www.w3.org/TR/${conf.shortName}/`
    : null;
  switch (conf.canonicalURI) {
    case "edDraft":
      if (conf.edDraftURI) {
        conf.canonicalURI = new URL(
          conf.edDraftURI,
          document.location.href
        ).href;
      } else {
        pub(
          "warn",
          "Canonical URI set to edDraft, " +
            "but no edDraftURI is set in configuration"
        );
        conf.canonicalURI = null;
      }
      break;
    case "TR":
      if (trLatestUri) {
        conf.canonicalURI = trLatestUri;
      } else {
        pub(
          "warn",
          "Canonical URI set to TR, but " +
            "no shortName is set in configuration"
        );
        conf.canonicalURI = null;
      }
      break;
    default:
      if (conf.canonicalURI) {
        try {
          conf.canonicalURI = new URL(
            conf.canonicalURI,
            document.location.href
          ).href;
        } catch (err) {
          pub("warn", `CanonicalURI is an invalid URL: ${err.message}`);
          conf.canonicalURI = null;
        }
      } else if (trLatestUri) {
        conf.canonicalURI = trLatestUri;
      }
  }
  if (conf.canonicalURI) {
    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "canonical");
    linkElem.setAttribute("href", conf.canonicalURI);
    document.head.appendChild(linkElem);
  }
  if (conf.doJsonLd) {
    await addJSONLDInfo(conf, document);
  }
}

async function addJSONLDInfo(conf, doc) {
  // Content for JSON
  const type = ["TechArticle"];
  if (conf.rdfStatus) type.push(conf.rdfStatus);

  const jsonld = {
    "@context": [
      "http://schema.org",
      {
        "@vocab": "http://schema.org/",
        "@language": doc.documentElement.lang || "en",
        w3p: "http://www.w3.org/2001/02pd/rec54#",
        foaf: "http://xmlns.com/foaf/0.1/",
        datePublished: { "@type": "http://www.w3.org/2001/XMLSchema#date" },
        inLanguage: { "@language": null },
        isBasedOn: { "@type": "@id" },
        license: { "@type": "@id" },
      },
    ],
    id: conf.canonicalURI || conf.thisVersion,
    type,
    name: conf.title,
    inLanguage: doc.documentElement.lang || "en",
    license: conf.licenseInfo.url,
    datePublished: conf.dashDate,
    /** @type {{ name: string, url?: string } | { name: string, url?: string }[]} */
    copyrightHolder: {
      name: "World Wide Web Consortium",
      url: "https://www.w3.org/",
    },
    discussionUrl: conf.issueBase,
    alternativeHeadline: conf.subtitle,
    isBasedOn: conf.prevVersion,
  };

  // add any additional copyright holders
  if (conf.additionalCopyrightHolders) {
    const addl = Array.isArray(conf.additionalCopyrightHolders)
      ? conf.additionalCopyrightHolders
      : [conf.additionalCopyrightHolders];
    jsonld.copyrightHolder = [
      jsonld.copyrightHolder,
      ...addl.map(h => ({ name: h })),
    ];
  }

  // description from meta description
  const description = doc.head.querySelector("meta[name=description]");
  if (description) {
    jsonld.description = description.content;
  }

  // Editors
  if (conf.editors) {
    jsonld.editor = conf.editors.map(addPerson);
  }
  if (conf.authors) {
    jsonld.contributor = conf.authors.map(addPerson);
  }

  // normative and informative references
  const citationIds = [
    ...conf.normativeReferences,
    ...conf.informativeReferences,
  ];
  const citationContents = await Promise.all(
    citationIds.map(ref => resolveRef(ref))
  );
  jsonld.citation = citationContents
    .filter(ref => typeof ref === "object")
    .map(addRef);

  const script = doc.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(jsonld, null, 2);
  doc.head.appendChild(script);
}

/**
 * Turn editors and authors into a list of JSON-LD relationships
 */
function addPerson({ name, url, mailto, company, companyURL }) {
  const ed = {
    type: "Person",
    name,
    url,
    "foaf:mbox": mailto,
  };
  if (company || companyURL) {
    ed.worksFor = {
      name: company,
      url: companyURL,
    };
  }
  return ed;
}

/**
 * Create a reference URL from the ref
 */
function addRef(ref) {
  const { href: id, title: name, href: url } = ref;
  const jsonld = {
    id,
    type: "TechArticle",
    name,
    url,
  };
  if (ref.authors) {
    jsonld.creator = ref.authors.map(a => ({ name: a }));
  }
  if (ref.rawDate) {
    jsonld.publishedDate = ref.rawDate;
  }
  if (ref.isbn) {
    jsonld.identifier = ref.isbn;
  }
  if (ref.publisher) {
    jsonld.publisher = { name: ref.publisher };
  }
  return jsonld;
}

var seo$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$O,
  run: run$B
});

// @ts-check
/**
 * Module core/worker
 *
 * Exports a Web Worker for ReSpec, allowing for
 * multi-threaded processing of things.
 */
const name$P = "core/worker";
// Opportunistically preload syntax highlighter
const hint = {
  hint: "preload",
  href: "https://www.w3.org/Tools/respec/respec-highlight.js",
  as: "script",
};
const link$1 = createResourceHint(hint);
document.head.appendChild(link$1);

async function loadWorkerScript() {
  try {
    return (await Promise.resolve().then(function () { return respecWorker$1; })).default;
  } catch {
    return fetchBase("worker/respec-worker.js");
  }
}

async function createWorker() {
  const workerScript = await loadWorkerScript();
  const workerURL = URL.createObjectURL(
    new Blob([workerScript], { type: "application/javascript" })
  );
  return new Worker(workerURL);
}

const workerPromise = createWorker();

expose(
  name$P,
  workerPromise.then(worker => ({ worker }))
);

// @ts-check
const name$Q = "core/highlight";

const nextMsgId = msgIdGenerator("highlight");

const ghCssPromise = loadStyle$7();

async function loadStyle$7() {
  try {
    return (await Promise.resolve().then(function () { return github$3; })).default;
  } catch {
    return fetchAsset("github.css");
  }
}

function getLanguageHint(classList) {
  return Array.from(classList)
    .filter(item => item !== "highlight" && item !== "nolinks")
    .map(item => item.toLowerCase());
}

async function highlightElement(elem) {
  elem.setAttribute("aria-busy", "true");
  const languages = getLanguageHint(elem.classList);
  let response;
  try {
    response = await sendHighlightRequest(elem.innerText, languages);
  } catch (err) {
    console.error(err);
    return;
  }
  const { language, value } = response;
  switch (elem.localName) {
    case "pre":
      elem.classList.remove(language);
      elem.innerHTML = `<code class="hljs${
        language ? ` ${language}` : ""
      }">${value}</code>`;
      if (!elem.classList.length) elem.removeAttribute("class");
      break;
    case "code":
      elem.innerHTML = value;
      elem.classList.add("hljs");
      if (language) elem.classList.add(language);
      break;
  }
  elem.setAttribute("aria-busy", "false");
}

async function sendHighlightRequest(code, languages) {
  const msg = {
    action: "highlight",
    code,
    id: nextMsgId(),
    languages,
  };
  const worker = await workerPromise;
  worker.postMessage(msg);
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error("Timed out waiting for highlight."));
    }, 4000);
    worker.addEventListener("message", function listener(ev) {
      const {
        data: { id, language, value },
      } = ev;
      if (id !== msg.id) return; // not for us!
      worker.removeEventListener("message", listener);
      clearTimeout(timeoutId);
      resolve({ language, value });
    });
  });
}

async function run$C(conf) {
  // Nothing to highlight
  if (conf.noHighlightCSS) return;
  const highlightables = [
    ...document.querySelectorAll(`
    pre:not(.idl):not(.nohighlight) > code:not(.nohighlight),
    pre:not(.idl):not(.nohighlight),
    code.highlight
  `),
  ].filter(
    // Filter pre's that contain code
    elem => elem.localName !== "pre" || !elem.querySelector("code")
  );
  // Nothing to highlight
  if (!highlightables.length) {
    return;
  }
  const promisesToHighlight = highlightables
    .filter(elem => elem.textContent.trim())
    .map(highlightElement);
  const ghCss = await ghCssPromise;
  document.head.appendChild(
    hyperHTML$1`
=======
  `}var aboutRespec=Object.freeze({__proto__:null});const name$N="core/seo";function run$A(){const e=document.querySelector("#abstract p:first-of-type");if(!e)return;const t=e.textContent.replace(/\s+/," ").trim(),n=document.createElement("meta");n.name="description",n.content=t,document.head.appendChild(n)}var seo=Object.freeze({__proto__:null,name:name$N,run:run$A});const name$O="w3c/seo";async function run$B(e){if(!e.canonicalURI)switch(e.specStatus){case"CG-DRAFT":case"BG-DRAFT":case"unofficial":return}const t=e.shortName?`https://www.w3.org/TR/${e.shortName}/`:null;switch(e.canonicalURI){case"edDraft":e.edDraftURI?e.canonicalURI=new URL(e.edDraftURI,document.location.href).href:(pub("warn","Canonical URI set to edDraft, but no edDraftURI is set in configuration"),e.canonicalURI=null);break;case"TR":t?e.canonicalURI=t:(pub("warn","Canonical URI set to TR, but no shortName is set in configuration"),e.canonicalURI=null);break;default:if(e.canonicalURI)try{e.canonicalURI=new URL(e.canonicalURI,document.location.href).href}catch(t){pub("warn",`CanonicalURI is an invalid URL: ${t.message}`),e.canonicalURI=null}else t&&(e.canonicalURI=t)}if(e.canonicalURI){const t=document.createElement("link");t.setAttribute("rel","canonical"),t.setAttribute("href",e.canonicalURI),document.head.appendChild(t)}e.doJsonLd&&await addJSONLDInfo(e,document)}async function addJSONLDInfo(e,t){const n=["TechArticle"];e.rdfStatus&&n.push(e.rdfStatus);const r={"@context":["http://schema.org",{"@vocab":"http://schema.org/","@language":t.documentElement.lang||"en",w3p:"http://www.w3.org/2001/02pd/rec54#",foaf:"http://xmlns.com/foaf/0.1/",datePublished:{"@type":"http://www.w3.org/2001/XMLSchema#date"},inLanguage:{"@language":null},isBasedOn:{"@type":"@id"},license:{"@type":"@id"}}],id:e.canonicalURI||e.thisVersion,type:n,name:e.title,inLanguage:t.documentElement.lang||"en",license:e.licenseInfo.url,datePublished:e.dashDate,copyrightHolder:{name:"World Wide Web Consortium",url:"https://www.w3.org/"},discussionUrl:e.issueBase,alternativeHeadline:e.subtitle,isBasedOn:e.prevVersion};if(e.additionalCopyrightHolders){const t=Array.isArray(e.additionalCopyrightHolders)?e.additionalCopyrightHolders:[e.additionalCopyrightHolders];r.copyrightHolder=[r.copyrightHolder,...t.map(e=>({name:e}))]}const o=t.head.querySelector("meta[name=description]");o&&(r.description=o.content),e.editors&&(r.editor=e.editors.map(addPerson)),e.authors&&(r.contributor=e.authors.map(addPerson));const i=[...e.normativeReferences,...e.informativeReferences],s=await Promise.all(i.map(e=>resolveRef(e)));r.citation=s.filter(e=>"object"==typeof e).map(addRef);const a=t.createElement("script");a.type="application/ld+json",a.textContent=JSON.stringify(r,null,2),t.head.appendChild(a)}function addPerson({name:e,url:t,mailto:n,company:r,companyURL:o}){const i={type:"Person",name:e,url:t,"foaf:mbox":n};return(r||o)&&(i.worksFor={name:r,url:o}),i}function addRef(e){const{href:t,title:n,href:r}=e,o={id:t,type:"TechArticle",name:n,url:r};return e.authors&&(o.creator=e.authors.map(e=>({name:e}))),e.rawDate&&(o.publishedDate=e.rawDate),e.isbn&&(o.identifier=e.isbn),e.publisher&&(o.publisher={name:e.publisher}),o}var seo$1=Object.freeze({__proto__:null,name:name$O,run:run$B});const name$P="core/worker",hint={hint:"preload",href:"https://www.w3.org/Tools/respec/respec-highlight.js",as:"script"},link$1=createResourceHint(hint);async function loadWorkerScript(){try{return(await Promise.resolve().then((function(){return respecWorker$1}))).default}catch{return fetchBase("worker/respec-worker.js")}}async function createWorker(){const e=await loadWorkerScript(),t=URL.createObjectURL(new Blob([e],{type:"application/javascript"}));return new Worker(t)}document.head.appendChild(link$1);const workerPromise=createWorker();expose(name$P,workerPromise.then(e=>({worker:e})));const name$Q="core/highlight",nextMsgId=msgIdGenerator("highlight"),ghCssPromise=loadStyle$7();async function loadStyle$7(){try{return(await Promise.resolve().then((function(){return highlight$2}))).default}catch{return fetchAsset("highlight.css")}}function getLanguageHint(e){return Array.from(e).filter(e=>"highlight"!==e&&"nolinks"!==e).map(e=>e.toLowerCase())}async function highlightElement(e){e.setAttribute("aria-busy","true");const t=getLanguageHint(e.classList);let n;try{n=await sendHighlightRequest(e.innerText,t)}catch(e){return void console.error(e)}const{language:r,value:o}=n;switch(e.localName){case"pre":e.classList.remove(r),e.innerHTML=`<code class="hljs${r?` ${r}`:""}">${o}</code>`,e.classList.length||e.removeAttribute("class");break;case"code":e.innerHTML=o,e.classList.add("hljs"),r&&e.classList.add(r)}e.setAttribute("aria-busy","false")}async function sendHighlightRequest(e,t){const n={action:"highlight",code:e,id:nextMsgId(),languages:t},r=await workerPromise;return r.postMessage(n),new Promise((e,t)=>{const o=setTimeout(()=>{t(new Error("Timed out waiting for highlight."))},4e3);r.addEventListener("message",(function t(i){const{data:{id:s,language:a,value:c}}=i;s===n.id&&(r.removeEventListener("message",t),clearTimeout(o),e({language:a,value:c}))}))})}async function run$C(e){if(e.noHighlightCSS)return;const t=[...document.querySelectorAll("\n    pre:not(.idl):not(.nohighlight) > code:not(.nohighlight),\n    pre:not(.idl):not(.nohighlight),\n    code.highlight\n  ")].filter(e=>"pre"!==e.localName||!e.querySelector("code"));if(!t.length)return;const n=t.filter(e=>e.textContent.trim()).map(highlightElement),r=await ghCssPromise;document.head.appendChild(hyperHTML$1`
>>>>>>> ee920564e72922e648a7264ada181389c5522282
      <style>
        ${ghCss}
      </style>
    `
  );
  await Promise.all(promisesToHighlight);
}

var highlight = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$Q,
  run: run$C
});

// @ts-check
const localizationStrings$d = {
  en: {
    missing_test_suite_uri:
      "Found tests in your spec, but missing '" +
      "[`testSuiteURI`](https://github.com/w3c/respec/wiki/testSuiteURI)' in your ReSpec config.",
    tests: "tests",
    test: "test",
  },
};

const l10n$f = getIntlData(localizationStrings$d);

const name$R = "core/data-tests";

function toListItem(href) {
  const emojiList = [];
  const [testFile] = new URL(href).pathname.split("/").reverse();
  const testParts = testFile.split(".");
  let [testFileName] = testParts;

  const isSecureTest = testParts.find(part => part === "https");
  if (isSecureTest) {
    const requiresConnectionEmoji = document.createElement("span");
    requiresConnectionEmoji.textContent = "🔒";
    requiresConnectionEmoji.setAttribute(
      "aria-label",
      "requires a secure connection"
    );
    requiresConnectionEmoji.setAttribute("title", "Test requires HTTPS");
    testFileName = testFileName.replace(".https", "");
    emojiList.push(requiresConnectionEmoji);
  }

  const isManualTest = testFileName
    .split(".")
    .join("-")
    .split("-")
    .find(part => part === "manual");
  if (isManualTest) {
    const manualPerformEmoji = document.createElement("span");
    manualPerformEmoji.textContent = "💪";
    manualPerformEmoji.setAttribute(
      "aria-label",
      "the test must be run manually"
    );
    manualPerformEmoji.setAttribute("title", "Manual test");
    testFileName = testFileName.replace("-manual", "");
    emojiList.push(manualPerformEmoji);
  }

  const testList = hyperHTML$1`
    <li>
      <a href="${href}">
        ${testFileName}
      </a> ${emojiList}
    </li>
  `;
  return testList;
}

function run$D(conf) {
  /** @type {NodeListOf<HTMLElement>} */
  const elems = document.querySelectorAll("[data-tests]");
  const testables = [...elems].filter(elem => elem.dataset.tests);

  if (!testables.length) {
    return;
  }
  if (!conf.testSuiteURI) {
    pub("error", l10n$f.missing_test_suite_uri);
    return;
  }

  for (const elem of testables) {
    const tests = elem.dataset.tests.split(/,/gm).map(url => url.trim());
    const testURLs = toTestURLs(tests, conf.testSuiteURI);
    handleDuplicates(testURLs, elem);
    const details = toHTML$1(testURLs);
    elem.append(details);
  }
}

/**
 * @param {string[]} tests
 * @param {string} testSuiteURI
 */
function toTestURLs(tests, testSuiteURI) {
  return tests
    .map(test => {
      try {
        return new URL(test, testSuiteURI).href;
      } catch {
        pub("warn", `Bad URI: ${test}`);
      }
    })
    .filter(href => href);
}

/**
 * @param {string[]} testURLs
 * @param {HTMLElement} elem
 */
function handleDuplicates(testURLs, elem) {
  const duplicates = testURLs.filter(
    (link, i, self) => self.indexOf(link) !== i
  );
  if (duplicates.length) {
    showInlineWarning(
      elem,
      `Duplicate tests found`,
      `To fix, remove duplicates from "data-tests": ${duplicates
        .map(url => new URL(url).pathname)
        .join(", ")}`
    );
  }
}

/**
 * @param {string[]} testURLs
 */
function toHTML$1(testURLs) {
  const uniqueList = [...new Set(testURLs)];
  const details = hyperHTML$1`
    <details class="respec-tests-details removeOnSave">
      <summary>
        tests: ${uniqueList.length}
      </summary>
      <ul>${uniqueList.map(toListItem)}</ul>
    </details>
  `;
  return details;
}

var dataTests = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$R,
  run: run$D
});

// @ts-check
const name$S = "core/list-sorter";

function makeSorter(direction) {
  return ({ textContent: a }, { textContent: b }) => {
    return direction === "ascending" ? a.localeCompare(b) : b.localeCompare(a);
  };
}
/**
 * Shallow sort list items in OL, and UL elements.
 *
 * @param {HTMLUListElement} elem
 * @returns {DocumentFragment}
 */
function sortListItems(elem, dir) {
  const elements = [...children(elem, "li")];
  const sortedElements = elements.sort(makeSorter(dir)).reduce((frag, elem) => {
    frag.appendChild(elem);
    return frag;
  }, document.createDocumentFragment());
  return sortedElements;
}

/**
 * Shallow sort a definition list based on its definition terms (dt) elements.
 *
 * @param {HTMLDListElement} dl
 * @returns {DocumentFragment}
 */
function sortDefinitionTerms(dl, dir) {
  const elements = [...children(dl, "dt")];
  const sortedElements = elements.sort(makeSorter(dir)).reduce((frag, elem) => {
    const { nodeType, nodeName } = elem;
    const children = document.createDocumentFragment();
    let { nextSibling: next } = elem;
    while (next) {
      if (!next.nextSibling) {
        break;
      }
      children.appendChild(next.cloneNode(true));
      const { nodeType: nextType, nodeName: nextName } = next.nextSibling;
      const isSameType = nextType === nodeType && nextName === nodeName;
      if (isSameType) {
        break;
      }
      next = next.nextSibling;
    }
    children.prepend(elem.cloneNode(true));
    frag.appendChild(children);
    return frag;
  }, document.createDocumentFragment());
  return sortedElements;
}

function run$E() {
  /** @type {NodeListOf<HTMLElement>} */
  const sortables = document.querySelectorAll("[data-sort]");
  for (const elem of sortables) {
    let sortedElems;
    const dir = elem.dataset.sort || "ascending";
    switch (elem.localName) {
      case "dl": {
        const definition = /** @type {HTMLDListElement} */ (elem);
        sortedElems = sortDefinitionTerms(definition, dir);
        break;
      }
      case "ol":
      case "ul": {
        const list = /** @type {HTMLUListElement} */ (elem);
        sortedElems = sortListItems(list, dir);
        break;
      }
      default:
        pub("warning", `ReSpec can't sort ${elem.localName} elements.`);
    }
    if (sortedElems) {
      const range = document.createRange();
      range.selectNodeContents(elem);
      range.deleteContents();
      elem.appendChild(sortedElems);
    }
  }
}

var listSorter = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$S,
  sortListItems: sortListItems,
  sortDefinitionTerms: sortDefinitionTerms,
  run: run$E
});

// @ts-check

const name$T = "core/highlight-vars";

const hlVarsPromise = loadStyle$8();

async function loadStyle$8() {
  try {
    return (await Promise.resolve().then(function () { return _var$1; })).default;
  } catch {
    return fetchAsset("var.css");
  }
}

async function run$F(conf) {
  if (!conf.highlightVars) {
    return;
  }
  const styleElement = document.createElement("style");
  styleElement.textContent = await hlVarsPromise;
  styleElement.classList.add("removeOnSave");
  document.head.appendChild(styleElement);

  document
    .querySelectorAll("var")
    .forEach(varElem => varElem.addEventListener("click", highlightListener));

  // remove highlights, cleanup empty class/style attributes
  sub("beforesave", outputDoc => {
    outputDoc.querySelectorAll("var.respec-hl").forEach(removeHighlight);
  });
}

function highlightListener(ev) {
  ev.stopPropagation();
  const { target: varElem } = ev;
  const hightligtedElems = highlightVars(varElem);
  const resetListener = () => {
    const hlColor = getHighlightColor(varElem);
    hightligtedElems.forEach(el => removeHighlight(el, hlColor));
    [...HL_COLORS.keys()].forEach(key => HL_COLORS.set(key, true));
  };
  if (hightligtedElems.length) {
    document.body.addEventListener("click", resetListener, { once: true });
  }
}

// availability of highlight colors. colors from var.css
const HL_COLORS = new Map([
  ["respec-hl-c1", true],
  ["respec-hl-c2", true],
  ["respec-hl-c3", true],
  ["respec-hl-c4", true],
  ["respec-hl-c5", true],
  ["respec-hl-c6", true],
  ["respec-hl-c7", true],
]);

function getHighlightColor(target) {
  // return current colors if applicable
  const { value } = target.classList;
  const re = /respec-hl-\w+/;
  const activeClass = re.test(value) && value.match(re);
  if (activeClass) return activeClass[0];

  // first color preference
  if (HL_COLORS.get("respec-hl-c1") === true) return "respec-hl-c1";

  // otherwise get some other available color
  return [...HL_COLORS.keys()].find(c => HL_COLORS.get(c)) || "respec-hl-c1";
}

function highlightVars(varElem) {
  const textContent = varElem.textContent.trim();
  const parent = varElem.closest("section");
  const highlightColor = getHighlightColor(varElem);

  const varsToHighlight = [...parent.querySelectorAll("var")].filter(
    el =>
      el.textContent.trim() === textContent && el.closest("section") === parent
  );

  // update availability of highlight color
  const colorStatus = varsToHighlight[0].classList.contains("respec-hl");
  HL_COLORS.set(highlightColor, colorStatus);

  // highlight vars
  if (colorStatus) {
    varsToHighlight.forEach(el => removeHighlight(el, highlightColor));
    return [];
  } else {
    varsToHighlight.forEach(el => addHighlight(el, highlightColor));
  }
  return varsToHighlight;
}

function removeHighlight(el, highlightColor) {
  el.classList.remove("respec-hl", highlightColor);
  // clean up empty class attributes so they don't come in export
  if (!el.classList.length) el.removeAttribute("class");
}

function addHighlight(elem, highlightColor) {
  elem.classList.add("respec-hl", highlightColor);
}

var highlightVars$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$T,
  run: run$F
});

// Constructs "dfn panels" which show all the local references to a dfn and a

const name$U = "core/dfn-panel";

async function run$G() {
  const css = await loadStyle$9();
  document.head.insertBefore(
    hyperHTML$1`<style>${css}</style>`,
    document.querySelector("link")
  );

  /** @type {HTMLElement} */
  let panel;
  document.body.addEventListener("click", event => {
    /** @type {HTMLElement} */
    const el = event.target;

    const action = deriveAction(el);
    switch (action) {
      case "show": {
        if (panel) panel.remove();
        const dfn = el.closest("dfn");
        panel = createPanel(dfn);
        displayPanel(dfn, panel);
        break;
      }
      case "dock": {
        panel.classList.add("docked");
        break;
      }
      case "hide": {
        panel.remove();
        break;
      }
    }
  });
}

/** @param {HTMLElement} clickTarget */
function deriveAction(clickTarget) {
  const hitALink = !!clickTarget.closest("a");
  if (clickTarget.closest("dfn")) {
    return hitALink ? null : "show";
  }
  if (clickTarget.closest("#dfn-panel")) {
    if (hitALink) {
      const clickedSelfLink = clickTarget.classList.contains("self-link");
      return clickedSelfLink ? "hide" : "dock";
    }
    const panel = clickTarget.closest("#dfn-panel");
    return panel.classList.contains("docked") ? "hide" : null;
  }
  if (document.getElementById("dfn-panel")) {
    return "hide";
  }
  return null;
}

/** @param {HTMLElement} dfn */
function createPanel(dfn) {
  const { id } = dfn;
  const href = `#${id}`;
  const links = document.querySelectorAll(`a[href="${href}"]`);

  /** @type {HTMLElement} */
  const panel = hyperHTML$1`
    <aside class="dfn-panel" id="dfn-panel">
      <b><a class="self-link" href="${href}">Permalink</a></b>
      <b>Referenced in:</b>
      ${referencesToHTML(id, links)}
    </aside>
  `;
  return panel;
}

/**
 * @param {string} id dfn id
 * @param {NodeListOf<HTMLLinkElement>} links
 * @returns {HTMLUListElement}
 */
function referencesToHTML(id, links) {
  if (!links.length) {
    return hyperHTML$1`<ul><li>Not referenced in this document.</li></ul>`;
  }

  /** @type {Map<string, string[]>} */
  const titleToIDs = new Map();
  links.forEach((link, i) => {
    const linkID = link.id || `ref-for-${id}-${i + 1}`;
    if (!link.id) link.id = linkID;
    const title = getReferenceTitle(link);
    const ids = titleToIDs.get(title) || titleToIDs.set(title, []).get(title);
    ids.push(linkID);
  });

  /**
   * Returns a list that is easier to render in `listItemToHTML`.
   * @param {[string, string[]]} entry an entry from `titleToIDs`
   * @returns {{ title: string, id: string }[]} The first list item contains
   * title from `getReferenceTitle`, rest of items contain strings like `(2)`,
   * `(3)` as title.
   */
  const toLinkProps = ([title, ids]) => {
    return [{ title, id: ids[0] }].concat(
      ids.slice(1).map((id, i) => ({ title: `(${i + 2})`, id }))
    );
  };

  /**
   * @param {[string, string[]]} entry
   * @returns {HTMLLIElement}
   */
  const listItemToHTML = entry =>
    hyperHTML$1`<li>${toLinkProps(entry).map(
      link => hyperHTML$1`<a href="#${link.id}">${link.title}</a>${" "}`
    )}</li>`;

  return hyperHTML$1`<ul>${[...titleToIDs.entries()].map(listItemToHTML)}</ul>`;
}

/** @param {HTMLAnchorElement} link */
function getReferenceTitle(link) {
  const section = link.closest("section");
  if (!section) return null;
  const heading = section.querySelector("h1, h2, h3, h4, h5, h6");
  if (!heading) return null;
  return norm(heading.textContent);
}

/**
 * @param {HTMLElement} dfn
 * @param {HTMLElement} panel
 */
function displayPanel(dfn, panel) {
  document.body.appendChild(panel);

  const dfnRect = dfn.getBoundingClientRect();
  const panelRect = panel.getBoundingClientRect();
  const panelWidth = panelRect.right - panelRect.left;

  let top = window.scrollY + dfnRect.top;
  let left = dfnRect.left + dfnRect.width + 5;
  if (left + panelWidth > document.body.scrollWidth) {
    // Reposition, because the panel is overflowing
    left = dfnRect.left - (panelWidth + 5);
    if (left < 0) {
      left = dfnRect.left;
      top += dfnRect.height;
    }
  }

  // Allows ".docked" rule to override the position, unlike `style.left = left`.
  panel.style.setProperty("--left", `${left}px`);
  panel.style.setProperty("--top", `${top}px`);
}

async function loadStyle$9() {
  try {
    return (await Promise.resolve().then(function () { return dfnPanel$2; })).default;
  } catch {
    return fetchAsset("dfn-panel.css");
  }
}

var dfnPanel = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$U,
  run: run$G
});

// @ts-check

const name$V = "core/data-type";

const tooltipStylePromise = loadStyle$a();

async function loadStyle$a() {
  try {
    return (await Promise.resolve().then(function () { return datatype$1; })).default;
  } catch {
    return fetchAsset("datatype.css");
  }
}

async function run$H(conf) {
  if (!conf.highlightVars) {
    return;
  }

  const style = document.createElement("style");
  style.textContent = await tooltipStylePromise;
  document.head.appendChild(style);

  let section = null;
  const varMap = new Map();
  /** @type {NodeListOf<HTMLElement>} */
  const variables = document.querySelectorAll("section var");
  for (const varElem of variables) {
    const currentSection = varElem.closest("section");
    if (section !== currentSection) {
      section = currentSection;
      varMap.clear();
    }
    if (varElem.dataset.type) {
      varMap.set(varElem.textContent.trim(), varElem.dataset.type);
      continue;
    }
    const type = varMap.get(varElem.textContent.trim());
    if (type) varElem.dataset.type = type;
  }
}

var dataType = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$V,
  run: run$H
});

// @ts-check

const name$W = "core/algorithms";

const cssPromise$3 = loadStyle$b();

async function loadStyle$b() {
  try {
    return (await Promise.resolve().then(function () { return algorithms$2; })).default;
  } catch {
    return fetchAsset("algorithms.css");
  }
}

async function run$I() {
  const elements = Array.from(document.querySelectorAll("ol.algorithm li"));
  elements
    .filter(li => li.textContent.trim().startsWith("Assert: "))
    .forEach(li => li.classList.add("assert"));
  if (document.querySelector(".assert")) {
    const style = document.createElement("style");
    style.textContent = await cssPromise$3;
    document.head.appendChild(style);
  }
}

var algorithms = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$W,
  run: run$I
});

// @ts-check

const name$X = "core/anchor-expander";

function run$J() {
  /** @type {NodeListOf<HTMLElement>} */
  const anchorElements = document.querySelectorAll(
    "a[href^='#']:not(.self-link):not([href$='the-empty-string'])"
  );
  const anchors = [...anchorElements].filter(a => a.textContent.trim() === "");
  for (const a of anchors) {
    const id = a.getAttribute("href").slice(1);
    const matchingElement = document.getElementById(id);
    if (!matchingElement) {
      a.textContent = a.getAttribute("href");
      const msg = `Couldn't expand inline reference. The id "${id}" is not in the document.`;
      showInlineError(a, msg, `No matching id in document: ${id}.`);
      continue;
    }
    switch (matchingElement.localName) {
      case "h6":
      case "h5":
      case "h4":
      case "h3":
      case "h2": {
        processHeading(matchingElement, a);
        break;
      }
      case "section": {
        // find first heading in the section
        processSection(matchingElement, id, a);
        break;
      }
      case "figure": {
        processFigure(matchingElement, id, a);
        break;
      }
      case "aside":
      case "div": {
        processBox(matchingElement, id, a);
        break;
      }
      default: {
        a.textContent = a.getAttribute("href");
        const msg = "ReSpec doesn't support expanding this kind of reference.";
        showInlineError(a, msg, `Can't expand "#${id}".`);
      }
    }
    localize(matchingElement, a);
    a.normalize();
  }
}

function processBox(matchingElement, id, a) {
  const selfLink = matchingElement.querySelector(".marker .self-link");
  if (!selfLink) {
    a.textContent = a.getAttribute("href");
    const msg = `Found matching element "${id}", but it has no title or marker.`;
    showInlineError(a, msg, "Missing title.");
    return;
  }
  const copy = makeSafeCopy(selfLink);
  a.append(...copy.childNodes);
  a.classList.add("box-ref");
}

function processFigure(matchingElement, id, a) {
  const figcaption = matchingElement.querySelector("figcaption");
  if (!figcaption) {
    a.textContent = a.getAttribute("href");
    const msg = `Found matching figure "${id}", but figure is lacking a \`<figcaption>\`.`;
    showInlineError(a, msg, "Missing figcaption in referenced figure.");
    return;
  }
  // remove the figure's title
  const children = [...makeSafeCopy(figcaption).childNodes].filter(
    node => !node.classList || !node.classList.contains("fig-title")
  );
  // drop an empty space at the end.
  children.pop();
  a.append(...children);
  a.classList.add("fig-ref");
  const figTitle = figcaption.querySelector(".fig-title");
  if (!a.hasAttribute("title") && figTitle) {
    a.title = norm(figTitle.textContent);
  }
}

function processSection(matchingElement, id, a) {
  const heading = matchingElement.querySelector("h6, h5, h4, h3, h2");
  if (!heading) {
    a.textContent = a.getAttribute("href");
    const msg =
      "Found matching section, but the section was lacking a heading element.";
    showInlineError(a, msg, `No matching id in document: "${id}".`);
    return;
  }
  processHeading(heading, a);
  localize(heading, a);
}

function processHeading(heading, a) {
  const hadSelfLink = heading.querySelector(".self-link");
  const children = [...makeSafeCopy(heading).childNodes].filter(
    node => !node.classList || !node.classList.contains("self-link")
  );
  a.append(...children);
  if (hadSelfLink) a.prepend("§\u00A0");
  a.classList.add("sec-ref");
}

function localize(matchingElement, newElement) {
  for (const attrName of ["dir", "lang"]) {
    // Already set on element, don't override.
    if (newElement.hasAttribute(attrName)) continue;

    // Closest in tree setting the attribute
    const matchingClosest = matchingElement.closest(`[${attrName}]`);
    if (!matchingClosest) continue;

    // Closest to reference setting the attribute
    const newClosest = newElement.closest(`[${attrName}]`);

    // It's the same, so already inherited from closest (probably HTML element or body).
    if (
      newClosest &&
      newClosest.getAttribute(attrName) ===
        matchingClosest.getAttribute(attrName)
    )
      continue;
    // Otherwise, set it.
    newElement.setAttribute(attrName, matchingClosest.getAttribute(attrName));
  }
}

var anchorExpander = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$X,
  run: run$J
});

// @ts-check

const name$Y = "rs-changelog";

const element = class ChangelogElement extends HTMLElement {
  constructor() {
    super();
    this.props = {
      from: this.getAttribute("from"),
      to: this.getAttribute("to") || "HEAD",
      /** @type {(commit: Commit) => boolean} */
      filter:
        typeof window[this.getAttribute("filter")] === "function"
          ? window[this.getAttribute("filter")]
          : () => true,
    };
  }

  connectedCallback() {
    const { from, to, filter } = this.props;
    hyperHTML$1.bind(this)`
      <ul>
      ${{
        any: fetchCommits(from, to, filter)
          .then(commits => toHTML$2(commits))
          .catch(error => showInlineError(this, error.message, error.message))
          .finally(() => {
            this.dispatchEvent(new CustomEvent("done"));
          }),
        placeholder: "Loading list of commits...",
      }}
      </ul>
<<<<<<< HEAD
    `;
  }
};

async function fetchCommits(from, to, filter) {
  /** @type {Commit[]} */
  let commits;
  try {
    const gh = await github;
    if (!gh) {
      throw new Error("`respecConfig.github` is not set");
    }
    const url = new URL("commits", `${gh.apiBase}/${gh.fullName}/`);
    url.searchParams.set("from", from);
    url.searchParams.set("to", to);

    const res = await fetch(url.href);
    if (!res.ok) {
      throw new Error(
        `Request to ${url} failed with status code ${res.status}`
      );
    }
    commits = await res.json();
    if (!commits.length) {
      throw new Error(`No commits between ${from}..${to}.`);
    }
    commits = commits.filter(filter);
  } catch (error) {
    const msg = `Error loading commits from GitHub. ${error.message}`;
    console.error(error);
    throw new Error(msg);
  }
  return commits;
}

async function toHTML$2(commits) {
  const { repoURL } = await github;
  return commits.map(commit => {
    const [message, prNumber = null] = commit.message.split(/\(#(\d+)\)/, 2);
    const commitURL = `${repoURL}commit/${commit.hash}`;
    const prURL = prNumber ? `${repoURL}pull/${prNumber}` : null;
    const pr = prNumber && hyperHTML$1` (<a href="${prURL}">#${prNumber}</a>)`;
    return hyperHTML$1`<li><a href="${commitURL}">${message.trim()}</a>${pr}</li>`;
  });
}

var changelog = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$Y,
  element: element
});

// @ts-check
/** @type {CustomElementDfn[]} */
const CUSTOM_ELEMENTS = [changelog];

const name$Z = "core/custom-elements";

async function run$K() {
  // prepare and register elements
  CUSTOM_ELEMENTS.forEach(el => {
    customElements.define(el.name, el.element);
  });

  // wait for each element to be ready
  const selectors = CUSTOM_ELEMENTS.map(el => el.name).join(", ");
  const elems = document.querySelectorAll(selectors);
  const readyPromises = [...elems].map(
    el => new Promise(res => el.addEventListener("done", res, { once: true }))
  );
  await Promise.all(readyPromises);
}

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  name: name$Z,
  run: run$K
});

var ui$2 = "#respec-ui {\r\n  position: fixed;\r\n  display: flex;\r\n  flex-direction: row-reverse;\r\n  top: 20px;\r\n  right: 20px;\r\n  width: 202px;\r\n  text-align: right;\r\n  z-index: 9000;\r\n}\r\n\r\n#respec-pill,\r\n.respec-info-button {\r\n  background: #fff;\r\n  height: 2.5em;\r\n  color: rgb(120, 120, 120);\r\n  border: 1px solid #ccc;\r\n  box-shadow: 1px 1px 8px 0 rgba(100, 100, 100, 0.5);\r\n}\r\n\r\n.respec-info-button {\r\n  border: none;\r\n  opacity: 0.75;\r\n  border-radius: 2em;\r\n  margin-right: 1em;\r\n  min-width: 3.5em;\r\n}\r\n\r\n.respec-info-button:focus,\r\n.respec-info-button:hover {\r\n  opacity: 1;\r\n  transition: opacity 0.2s;\r\n}\r\n\r\n#respec-pill:disabled {\r\n  font-size: 2.8px;\r\n  text-indent: -9999em;\r\n  border-top: 1.1em solid rgba(40, 40, 40, 0.2);\r\n  border-right: 1.1em solid rgba(40, 40, 40, 0.2);\r\n  border-bottom: 1.1em solid rgba(40, 40, 40, 0.2);\r\n  border-left: 1.1em solid #ffffff;\r\n  transform: translateZ(0);\r\n  animation: respec-spin 0.5s infinite linear;\r\n  box-shadow: none;\r\n}\r\n\r\n#respec-pill:disabled,\r\n#respec-pill:disabled:after {\r\n  border-radius: 50%;\r\n  width: 10em;\r\n  height: 10em;\r\n}\r\n\r\n@keyframes respec-spin {\r\n  0% {\r\n    transform: rotate(0deg);\r\n  }\r\n  100% {\r\n    transform: rotate(360deg);\r\n  }\r\n}\r\n\r\n.respec-hidden {\r\n  visibility: hidden;\r\n  opacity: 0;\r\n  transition: visibility 0s 0.2s, opacity 0.2s linear;\r\n}\r\n\r\n.respec-visible {\r\n  visibility: visible;\r\n  opacity: 1;\r\n  transition: opacity 0.2s linear;\r\n}\r\n\r\n#respec-pill:hover,\r\n#respec-pill:focus {\r\n  color: rgb(0, 0, 0);\r\n  background-color: rgb(245, 245, 245);\r\n  transition: color 0.2s;\r\n}\r\n\r\n#respec-menu {\r\n  position: absolute;\r\n  margin: 0;\r\n  padding: 0;\r\n  font-family: sans-serif;\r\n  background: #fff;\r\n  box-shadow: 1px 1px 8px 0 rgba(100, 100, 100, 0.5);\r\n  width: 200px;\r\n  display: none;\r\n  text-align: left;\r\n  margin-top: 32px;\r\n  font-size: 0.8em;\r\n}\r\n\r\n#respec-menu:not([hidden]) {\r\n  display: block;\r\n}\r\n\r\n#respec-menu li {\r\n  list-style-type: none;\r\n  margin: 0;\r\n  padding: 0;\r\n}\r\n\r\n.respec-save-buttons {\r\n  display: grid;\r\n  grid-template-columns: repeat(auto-fill, minmax(47%, 2fr));\r\n  grid-gap: 0.5cm;\r\n  padding: 0.5cm;\r\n}\r\n\r\n.respec-save-button:link {\r\n  padding-top: 16px;\r\n  color: rgb(240, 240, 240);\r\n  background: rgb(42, 90, 168);\r\n  justify-self: stretch;\r\n  height: 1cm;\r\n  text-decoration: none;\r\n  text-align: center;\r\n  font-size: inherit;\r\n  border: none;\r\n  border-radius: 0.2cm;\r\n}\r\n\r\n.respec-save-button:link:hover {\r\n  color: white;\r\n  background: rgb(42, 90, 168);\r\n  padding: 0;\r\n  margin: 0;\r\n  border: 0;\r\n  padding-top: 16px;\r\n}\r\n\r\n#respec-ui button:focus,\r\n#respec-pill:focus,\r\n.respec-option:focus {\r\n  outline: 0;\r\n  outline-style: none;\r\n}\r\n\r\n#respec-pill-error {\r\n  background-color: red;\r\n  color: white;\r\n}\r\n\r\n#respec-pill-warning {\r\n  background-color: orange;\r\n  color: white;\r\n}\r\n\r\n.respec-warning-list,\r\n.respec-error-list {\r\n  margin: 0;\r\n  padding: 0;\r\n  list-style: none;\r\n  font-family: sans-serif;\r\n  background-color: rgb(255, 251, 230);\r\n  font-size: 0.85em;\r\n}\r\n\r\n.respec-warning-list > li,\r\n.respec-error-list > li {\r\n  padding: 0.4em 0.7em;\r\n}\r\n\r\n.respec-warning-list > li::before {\r\n  content: \"⚠️\";\r\n  padding-right: 0.5em;\r\n}\r\n.respec-warning-list p,\r\n.respec-error-list p {\r\n  padding: 0;\r\n  margin: 0;\r\n}\r\n\r\n.respec-warning-list li {\r\n  color: rgb(92, 59, 0);\r\n  border-bottom: thin solid rgb(255, 245, 194);\r\n}\r\n\r\n.respec-error-list,\r\n.respec-error-list li {\r\n  background-color: rgb(255, 240, 240);\r\n}\r\n\r\n.respec-error-list li::before {\r\n  content: \"💥\";\r\n  padding-right: 0.5em;\r\n}\r\n\r\n.respec-error-list li {\r\n  padding: 0.4em 0.7em;\r\n  color: rgb(92, 59, 0);\r\n  border-bottom: thin solid rgb(255, 215, 215);\r\n}\r\n\r\n.respec-error-list li > p {\r\n  margin: 0;\r\n  padding: 0;\r\n  display: inline-block;\r\n}\r\n\r\n#respec-overlay {\r\n  display: block;\r\n  position: fixed;\r\n  z-index: 10000;\r\n  top: 0px;\r\n  left: 0px;\r\n  height: 100%;\r\n  width: 100%;\r\n  background: #000;\r\n}\r\n\r\n.respec-show-overlay {\r\n  transition: opacity 0.2s linear;\r\n  opacity: 0.5;\r\n}\r\n\r\n.respec-hide-overlay {\r\n  transition: opacity 0.2s linear;\r\n  opacity: 0;\r\n}\r\n\r\n.respec-modal {\r\n  display: block;\r\n  position: fixed;\r\n  z-index: 11000;\r\n  margin: auto;\r\n  top: 10%;\r\n  background: #fff;\r\n  border: 5px solid #666;\r\n  min-width: 20%;\r\n  width: 79%;\r\n  padding: 0;\r\n  max-height: 80%;\r\n  overflow-y: auto;\r\n  margin: 0 -0.5cm;\r\n}\r\n\r\n@media screen and (min-width: 78em) {\r\n  .respec-modal {\r\n    width: 62%;\r\n  }\r\n}\r\n\r\n.respec-modal h3 {\r\n  margin: 0;\r\n  padding: 0.2em;\r\n  text-align: center;\r\n  color: black;\r\n  background: linear-gradient(\r\n    to bottom,\r\n    rgba(238, 238, 238, 1) 0%,\r\n    rgba(238, 238, 238, 1) 50%,\r\n    rgba(204, 204, 204, 1) 100%\r\n  );\r\n  font-size: 1em;\r\n}\r\n\r\n.respec-modal .inside div p {\r\n  padding-left: 1cm;\r\n}\r\n\r\n#respec-menu button.respec-option {\r\n  background: white;\r\n  padding: 0 0.2cm;\r\n  border: none;\r\n  width: 100%;\r\n  text-align: left;\r\n  font-size: inherit;\r\n  padding: 1.2em 1.2em;\r\n}\r\n\r\n#respec-menu button.respec-option:hover,\r\n#respec-menu button:focus {\r\n  background-color: #eeeeee;\r\n}\r\n\r\n.respec-cmd-icon {\r\n  padding-right: 0.5em;\r\n}\r\n\r\n#respec-ui button.respec-option:last-child {\r\n  border: none;\r\n  border-radius: inherit;\r\n}\r\n\r\n.respec-button-copy-paste {\r\n  position: absolute;\r\n  height: 28px;\r\n  width: 40px;\r\n  cursor: pointer;\r\n  background-image: linear-gradient(#fcfcfc, #eee);\r\n  border: 1px solid rgb(144, 184, 222);\r\n  border-left: 0;\r\n  border-radius: 0px 0px 3px 0;\r\n  -webkit-user-select: none;\r\n  user-select: none;\r\n  -webkit-appearance: none;\r\n  top: 0;\r\n  left: 127px;\r\n}\r\n\r\n#specref-ui {\r\n  margin: 0 2%;\r\n  margin-bottom: 0.5cm;\r\n}\r\n\r\n#specref-ui header {\r\n  font-size: 0.7em;\r\n  background-color: #eee;\r\n  text-align: center;\r\n  padding: 0.2cm;\r\n  margin-bottom: 0.5cm;\r\n  border-radius: 0 0 0.2cm 0.2cm;\r\n}\r\n\r\n#specref-ui header h1 {\r\n  padding: 0;\r\n  margin: 0;\r\n  color: black;\r\n}\r\n\r\n#specref-ui p {\r\n  padding: 0;\r\n  margin: 0;\r\n  font-size: 0.8em;\r\n  text-align: center;\r\n}\r\n\r\n#specref-ui p.state {\r\n  margin: 1cm;\r\n}\r\n\r\n#specref-ui .searchcomponent {\r\n  font-size: 16px;\r\n  display: grid;\r\n  grid-template-columns: auto 2cm;\r\n}\r\n#specref-ui .searchcomponent:focus {\r\n}\r\n\r\n#specref-ui input,\r\n#specref-ui button {\r\n  border: 0;\r\n  padding: 6px 12px;\r\n}\r\n\r\n#specref-ui label {\r\n  font-size: 0.6em;\r\n  grid-column-end: 3;\r\n  text-align: right;\r\n  grid-column-start: 1;\r\n}\r\n\r\n#specref-ui input[type=\"search\"] {\r\n  -webkit-appearance: none;\r\n  font-size: 16px;\r\n  border-radius: 0.1cm 0 0 0.1cm;\r\n  border: 1px solid rgb(204, 204, 204);\r\n}\r\n\r\n#specref-ui button[type=\"submit\"] {\r\n  color: white;\r\n  border-radius: 0 0.1cm 0.1cm 0;\r\n  background-color: rgb(51, 122, 183);\r\n}\r\n\r\n#specref-ui button[type=\"submit\"]:hover {\r\n  background-color: #286090;\r\n  border-color: #204d74;\r\n}\r\n\r\n#specref-ui .result-stats {\r\n  margin: 0;\r\n  padding: 0;\r\n  color: rgb(128, 128, 128);\r\n  font-size: 0.7em;\r\n  font-weight: bold;\r\n}\r\n\r\n#specref-ui .specref-results {\r\n  font-size: 0.8em;\r\n}\r\n\r\n#specref-ui .specref-results dd + dt {\r\n  margin-top: 0.51cm;\r\n}\r\n\r\n#specref-ui .specref-results a {\r\n  text-transform: capitalize;\r\n}\r\n#specref-ui .specref-results .authors {\r\n  display: block;\r\n  color: #006621;\r\n}\r\n\r\n@media print {\r\n  #respec-ui {\r\n    display: none;\r\n  }\r\n}\r\n\r\n#xref-ui {\r\n  width: 100%;\r\n  min-height: 550px;\r\n  height: 100%;\r\n  overflow: hidden;\r\n  padding: 0;\r\n  margin: 0;\r\n  border: 0;\r\n}\r\n\r\n#xref-ui:not(.ready) {\r\n  background: url(\"https://respec.org/xref/loader.gif\") no-repeat center;\r\n}\r\n";

var ui$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': ui$2
});

var respec = "/*****************************************************************\r\n * ReSpec specific CSS\r\n *****************************************************************/\r\n@keyframes pop {\r\n  0% {\r\n    transform: scale(1, 1);\r\n  }\r\n  25% {\r\n    transform: scale(1.25, 1.25);\r\n    opacity: 0.75;\r\n  }\r\n  100% {\r\n    transform: scale(1, 1);\r\n  }\r\n}\r\n\r\n/* Override code highlighter background */\r\n.hljs {\r\n  background: transparent !important;\r\n}\r\n\r\n/* --- INLINES --- */\r\nh1 abbr,\r\nh2 abbr,\r\nh3 abbr,\r\nh4 abbr,\r\nh5 abbr,\r\nh6 abbr,\r\na abbr {\r\n  border: none;\r\n}\r\n\r\ndfn {\r\n  font-weight: bold;\r\n}\r\n\r\na.internalDFN {\r\n  color: inherit;\r\n  border-bottom: 1px solid #99c;\r\n  text-decoration: none;\r\n}\r\n\r\na.externalDFN {\r\n  color: inherit;\r\n  border-bottom: 1px dotted #ccc;\r\n  text-decoration: none;\r\n}\r\n\r\na.bibref {\r\n  text-decoration: none;\r\n}\r\n\r\n.respec-offending-element:target {\r\n  animation: pop 0.25s ease-in-out 0s 1;\r\n}\r\n\r\n.respec-offending-element,\r\na[href].respec-offending-element {\r\n  text-decoration: red wavy underline;\r\n}\r\n@supports not (text-decoration: red wavy underline) {\r\n  .respec-offending-element:not(pre) {\r\n    display: inline-block;\r\n  }\r\n  .respec-offending-element {\r\n    /* Red squiggly line */\r\n    background: url(data:image/gif;base64,R0lGODdhBAADAPEAANv///8AAP///wAAACwAAAAABAADAEACBZQjmIAFADs=)\r\n      bottom repeat-x;\r\n  }\r\n}\r\n\r\n#references :target {\r\n  background: #eaf3ff;\r\n  animation: pop 0.4s ease-in-out 0s 1;\r\n}\r\n\r\ncite .bibref {\r\n  font-style: normal;\r\n}\r\n\r\ncode {\r\n  color: #c83500;\r\n}\r\n\r\nth code {\r\n  color: inherit;\r\n}\r\n\r\na[href].orcid {\r\n    padding-left: 4px;\r\n    padding-right: 4px;\r\n}\r\n\r\na[href].orcid > svg {\r\n    margin-bottom: -2px;\r\n}\r\n\r\n/* --- TOC --- */\r\n\r\n.toc a,\r\n.tof a {\r\n  text-decoration: none;\r\n}\r\n\r\na .secno,\r\na .figno {\r\n  color: #000;\r\n}\r\n\r\nul.tof,\r\nol.tof {\r\n  list-style: none outside none;\r\n}\r\n\r\n.caption {\r\n  margin-top: 0.5em;\r\n  font-style: italic;\r\n}\r\n\r\n/* --- TABLE --- */\r\n\r\ntable.simple {\r\n  border-spacing: 0;\r\n  border-collapse: collapse;\r\n  border-bottom: 3px solid #005a9c;\r\n}\r\n\r\n.simple th {\r\n  background: #005a9c;\r\n  color: #fff;\r\n  padding: 3px 5px;\r\n  text-align: left;\r\n}\r\n\r\n.simple th a {\r\n  color: #fff;\r\n  padding: 3px 5px;\r\n  text-align: left;\r\n}\r\n\r\n.simple th[scope=\"row\"] {\r\n  background: inherit;\r\n  color: inherit;\r\n  border-top: 1px solid #ddd;\r\n}\r\n\r\n.simple td {\r\n  padding: 3px 10px;\r\n  border-top: 1px solid #ddd;\r\n}\r\n\r\n.simple tr:nth-child(even) {\r\n  background: #f0f6ff;\r\n}\r\n\r\n/* --- DL --- */\r\n\r\n.section dd > p:first-child {\r\n  margin-top: 0;\r\n}\r\n\r\n.section dd > p:last-child {\r\n  margin-bottom: 0;\r\n}\r\n\r\n.section dd {\r\n  margin-bottom: 1em;\r\n}\r\n\r\n.section dl.attrs dd,\r\n.section dl.eldef dd {\r\n  margin-bottom: 0;\r\n}\r\n\r\n#issue-summary > ul,\r\n.respec-dfn-list {\r\n  column-count: 2;\r\n}\r\n\r\n#issue-summary li,\r\n.respec-dfn-list li {\r\n  list-style: none;\r\n}\r\n\r\ndetails.respec-tests-details {\r\n  margin-left: 1em;\r\n  display: inline-block;\r\n  vertical-align: top;\r\n}\r\n\r\ndetails.respec-tests-details > * {\r\n  padding-right: 2em;\r\n}\r\n\r\ndetails.respec-tests-details[open] {\r\n  z-index: 999999;\r\n  position: absolute;\r\n  border: thin solid #cad3e2;\r\n  border-radius: 0.3em;\r\n  background-color: white;\r\n  padding-bottom: 0.5em;\r\n}\r\n\r\ndetails.respec-tests-details[open] > summary {\r\n  border-bottom: thin solid #cad3e2;\r\n  padding-left: 1em;\r\n  margin-bottom: 1em;\r\n  line-height: 2em;\r\n}\r\n\r\ndetails.respec-tests-details > ul {\r\n  width: 100%;\r\n  margin-top: -0.3em;\r\n}\r\n\r\ndetails.respec-tests-details > li {\r\n  padding-left: 1em;\r\n}\r\n\r\na[href].self-link:hover {\r\n  opacity: 1;\r\n  text-decoration: none;\r\n  background-color: transparent;\r\n}\r\n\r\nh2,\r\nh3,\r\nh4,\r\nh5,\r\nh6 {\r\n  position: relative;\r\n}\r\n\r\naside.example .marker > a.self-link {\r\n  color: inherit;\r\n}\r\n\r\nh2 > a.self-link,\r\nh3 > a.self-link,\r\nh4 > a.self-link,\r\nh5 > a.self-link,\r\nh6 > a.self-link {\r\n  border: none;\r\n  color: inherit;\r\n  font-size: 83%;\r\n  height: 2em;\r\n  left: -1.6em;\r\n  opacity: 0.5;\r\n  position: absolute;\r\n  text-align: center;\r\n  text-decoration: none;\r\n  top: 0;\r\n  transition: opacity 0.2s;\r\n  width: 2em;\r\n}\r\n\r\nh2 > a.self-link::before,\r\nh3 > a.self-link::before,\r\nh4 > a.self-link::before,\r\nh5 > a.self-link::before,\r\nh6 > a.self-link::before {\r\n  content: \"§\";\r\n  display: block;\r\n}\r\n\r\n@media (max-width: 767px) {\r\n  dd {\r\n    margin-left: 0;\r\n  }\r\n\r\n  /* Don't position self-link in headings off-screen */\r\n  h2 > a.self-link,\r\n  h3 > a.self-link,\r\n  h4 > a.self-link,\r\n  h5 > a.self-link,\r\n  h6 > a.self-link {\r\n    left: auto;\r\n    top: auto;\r\n  }\r\n}\r\n\r\n@media print {\r\n  .removeOnSave {\r\n    display: none;\r\n  }\r\n}\r\n";

var respec$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': respec
});

var examples$1 = "/* --- EXAMPLES --- */\r\nspan.example-title {\r\n    text-transform: none;\r\n}\r\naside.example, div.example, div.illegal-example {\r\n    padding: 0.5em;\r\n    margin: 1em 0;\r\n    position: relative;\r\n    clear: both;\r\n}\r\ndiv.illegal-example { color: red }\r\ndiv.illegal-example p { color: black }\r\naside.example, div.example {\r\n    padding: .5em;\r\n    border-left-width: .5em;\r\n    border-left-style: solid;\r\n    border-color: #e0cb52;\r\n    background: #fcfaee;\r\n}\r\n\r\naside.example div.example {\r\n    border-left-width: .1em;\r\n    border-color: #999;\r\n    background: #fff;\r\n}\r\naside.example div.example span.example-title {\r\n    color: #999;\r\n}\r\n";

var examples$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': examples$1
});

var issuesNotes$1 = "/* --- ISSUES/NOTES --- */\r\n.issue-label {\r\n    text-transform: initial;\r\n}\r\n\r\n.warning > p:first-child { margin-top: 0 }\r\n.warning {\r\n    padding: .5em;\r\n    border-left-width: .5em;\r\n    border-left-style: solid;\r\n}\r\nspan.warning { padding: .1em .5em .15em; }\r\n\r\n.issue.closed span.issue-number {\r\n    text-decoration: line-through;\r\n}\r\n\r\n.warning {\r\n    border-color: #f11;\r\n    border-width: .2em;\r\n    border-style: solid;\r\n    background: #fbe9e9;\r\n}\r\n\r\n.warning-title:before{\r\n    content: \"⚠\"; /*U+26A0 WARNING SIGN*/\r\n    font-size: 1.3em;\r\n    float: left;\r\n    padding-right: .3em;\r\n    margin-top: -0.3em;\r\n}\r\n\r\nli.task-list-item {\r\n    list-style: none;\r\n}\r\n\r\ninput.task-list-item-checkbox {\r\n    margin: 0 0.35em 0.25em -1.6em;\r\n    vertical-align: middle;\r\n}\r\n\r\n.issue a.respec-gh-label {\r\n  padding: 5px;\r\n  margin: 0 2px 0 2px;\r\n  font-size: 10px;\r\n  text-transform: none;\r\n  text-decoration: none;\r\n  font-weight: bold;\r\n  border-radius: 4px;\r\n  position: relative;\r\n  bottom: 2px;\r\n  border: none;\r\n  display: inline-block;\r\n}\r\n\r\n.issue a.respec-label-dark {\r\n  color: #fff;\r\n  background-color: #000;\r\n}\r\n\r\n.issue a.respec-label-light {\r\n  color: #000;\r\n  background-color: #fff;\r\n}\r\n";

var issuesNotes$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': issuesNotes$1
});

var webidl$1 = "/* --- WEB IDL --- */\r\n\r\npre.idl {\r\n  padding: 1em;\r\n  position: relative;\r\n}\r\n\r\n@media print {\r\n  pre.idl {\r\n    white-space: pre-wrap;\r\n  }\r\n}\r\n\r\ndiv.idlHeader {\r\n  display: block;\r\n  width: 150px;\r\n  background: #90b8de;\r\n  color: #fff;\r\n  font-family: sans-serif;\r\n  font-weight: bold;\r\n  margin: -1em 0 1em -1em;\r\n  height: 28px;\r\n  line-height: 28px;\r\n}\r\n\r\ndiv.idlHeader a.self-link {\r\n   color: #fff;\r\n   margin-left: .3cm;\r\n   text-decoration: none;\r\n   border-bottom: none;\r\n}\r\n\r\n.idlID {\r\n  font-weight: bold;\r\n  color: #005a9c;\r\n}\r\n\r\n.idlType {\r\n  color: #005a9c;\r\n}\r\n\r\n.idlName {\r\n  color: #ff4500;\r\n}\r\n\r\n.idlName a {\r\n  color: #ff4500;\r\n  border-bottom: 1px dotted #ff4500;\r\n  text-decoration: none;\r\n}\r\n\r\na.idlEnumItem {\r\n  color: #000;\r\n  border-bottom: 1px dotted #ccc;\r\n  text-decoration: none;\r\n}\r\n\r\n.idlSuperclass {\r\n  font-style: italic;\r\n  color: #005a9c;\r\n}\r\n\r\n\r\n/*.idlParam*/\r\n\r\n.idlParamName,\r\n.idlDefaultValue {\r\n  font-style: italic;\r\n}\r\n\r\n.extAttr {\r\n  color: #666;\r\n}\r\n\r\n\r\n/*.idlSectionComment*/\r\n\r\n.idlSectionComment {\r\n  color: gray;\r\n}\r\n\r\n.idlIncludes a {\r\n  font-weight: bold;\r\n}\r\n\r\n.respec-button-copy-paste:focus {\r\n  text-decoration: none;\r\n  border-color: #51a7e8;\r\n  outline: none;\r\n  box-shadow: 0 0 5px rgba(81, 167, 232, 0.5);\r\n}\r\n\r\n.respec-button-copy-paste:focus:hover,\r\n.respec-button-copy-paste.selected:focus {\r\n  border-color: #51a7e8;\r\n}\r\n\r\n.respec-button-copy-paste:hover,\r\n.respec-button-copy-paste:active,\r\n.respec-button-copy-paste.zeroclipboard-is-hover,\r\n.respec-button-copy-paste.zeroclipboard-is-active {\r\n  text-decoration: none;\r\n  background-color: #ddd;\r\n  background-image: linear-gradient(#eee, #ddd);\r\n  border-color: #ccc;\r\n}\r\n\r\n.respec-button-copy-paste:active,\r\n.respec-button-copy-paste.selected,\r\n.respec-button-copy-paste.zeroclipboard-is-active {\r\n  background-color: #dcdcdc;\r\n  background-image: none;\r\n  border-color: #b5b5b5;\r\n  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15)\r\n}\r\n\r\n.respec-button-copy-paste.selected:hover {\r\n  background-color: #cfcfcf;\r\n}\r\n\r\n.respec-button-copy-paste:disabled,\r\n.respec-button-copy-paste:disabled:hover,\r\n.respec-button-copy-paste.disabled,\r\n.respec-button-copy-paste.disabled:hover {\r\n  color: rgba(102, 102, 102, 0.5);\r\n  cursor: default;\r\n  background-color: rgba(229, 229, 229, 0.5);\r\n  background-image: none;\r\n  border-color: rgba(197, 197, 197, 0.5);\r\n  box-shadow: none;\r\n}\r\n\r\n@media print {\r\n  .respec-button-copy-paste {\r\n    visibility: hidden;\r\n  }\r\n}\r\n";

var webidl$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': webidl$1
});

var caniuse$1 = "/* container for stats */\r\n.caniuse-stats {\r\n  display: flex;\r\n  flex-wrap: wrap;\r\n  justify-content: flex-start;\r\n  align-items: baseline;\r\n  cursor: pointer;\r\n}\r\n\r\nbutton.caniuse-cell {\r\n  margin: 1px 1px 0 0;\r\n  border: none;\r\n}\r\n\r\n.caniuse-browser {\r\n  position: relative;\r\n}\r\n\r\n/* handle case when printing */\r\n@media print {\r\n  .caniuse-cell.y::before {\r\n    content: \"✔️\";\r\n    padding: 0.5em;\r\n  }\r\n\r\n  .caniuse-cell.n::before{\r\n    content: \"❌\";\r\n    padding: 0.5em;\r\n  }\r\n\r\n  .caniuse-cell.d::before,\r\n  .caniuse-cell.a::before,\r\n  .caniuse-cell.x::before,\r\n  .caniuse-cell.p::before {\r\n    content: \"⚠️\";\r\n    padding: 0.5em;\r\n  }\r\n}\r\n\r\n/* reset styles, hide old versions by default */\r\n.caniuse-browser ul {\r\n  display: none;\r\n  margin: 0;\r\n  padding: 0;\r\n  list-style: none;\r\n  position: absolute;\r\n  left: 0;\r\n  z-index: 2;\r\n  background: #fff;\r\n  margin-top: 1px;\r\n}\r\n\r\n.caniuse-stats a {\r\n  white-space: nowrap;\r\n  align-self: center;\r\n  margin-left: .5em;\r\n}\r\n\r\n/* a browser version */\r\n.caniuse-cell {\r\n  display: flex;\r\n  color: rgba(0, 0, 0, 0.8);\r\n  font-size: 90%;\r\n  height: 0.8cm;\r\n  margin-right: 1px;\r\n  margin-top: 0;\r\n  min-width: 3cm;\r\n  overflow: visible;\r\n  justify-content: center;\r\n  align-items: center;\r\n}\r\n\r\nli.caniuse-cell {\r\n  margin-bottom: 1px;\r\n}\r\n\r\n.caniuse-cell:focus {\r\n  outline: none;\r\n}\r\n\r\n.caniuse-cell:hover {\r\n  color: rgba(0, 0, 0, 1);\r\n}\r\n\r\n/* supports */\r\n.caniuse-cell.y {\r\n  background: #8bc34a;\r\n}\r\n\r\n/* no support */\r\n.caniuse-cell.n {\r\n  background: #e53935;\r\n}\r\n\r\n/* not supported by default / partial support etc\r\nsee https://github.com/Fyrd/caniuse/blob/master/CONTRIBUTING.md for stats */\r\n.caniuse-cell.d,\r\n.caniuse-cell.a,\r\n.caniuse-cell.x,\r\n.caniuse-cell.p {\r\n  background: #ffc107;\r\n}\r\n\r\n/* show rest of the browser versions */\r\n.caniuse-stats button:focus + ul,\r\n.caniuse-stats .caniuse-browser:hover > ul {\r\n  display: block;\r\n}\r\n";

var caniuse$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': caniuse$1
});

var mdnAnnotation$1 = ".mdn {\r\n  display: block;\r\n  font: 12px sans-serif;\r\n  position: absolute;\r\n  z-index: 9;\r\n  right: 0.3em;\r\n  background-color: #eee;\r\n  margin: -26px 0 0 0;\r\n  padding: 7px 5px 5px 6px;\r\n  min-width: 140px;\r\n  box-shadow: 0 0 3px #999;\r\n}\r\n\r\n.mdn button {\r\n  cursor: pointer;\r\n  border: none;\r\n  color: #000;\r\n  background: transparent;\r\n  margin: -8px;\r\n  outline: none;\r\n}\r\n\r\n.mdn b {\r\n  color: #fff;\r\n  background-color: #000;\r\n  font-weight: normal;\r\n  font-family: zillaslab, Palatino, \"Palatino Linotype\", serif;\r\n  padding: 2px 3px 0px 3px;\r\n  line-height: 1.3em;\r\n  vertical-align: top;\r\n}\r\n\r\n.mdn > div > div {\r\n  display: inline-block;\r\n  margin-left: 5px;\r\n}\r\n\r\n\r\n.nosupportdata {\r\n  font-style: italic;\r\n  margin-top: 4px;\r\n  margin-left: 8px;\r\n  padding-bottom: 8px;\r\n}\r\n\r\n.mdnsupport {\r\n  display: table;\r\n  margin-top: 4px;\r\n}\r\n\r\n.mdnsupport > span {\r\n  display: table-row;\r\n  padding: 0.2em 0;\r\n  padding-top: 0.2em;\r\n  font-size: 9.6px;\r\n}\r\n\r\n.mdnsupport > span > span {\r\n  display: table-cell;\r\n  padding: 0 0.5em;\r\n  vertical-align: top;\r\n  line-height: 1.5em;\r\n}\r\n\r\n.mdnsupport > span > span:last-child {\r\n  text-align: right;\r\n  padding: 0;\r\n}\r\n\r\n.mdnsupport > span.no {\r\n  color: #cccccc;\r\n  filter: grayscale(100%);\r\n}\r\n\r\n.mdnsupport > span.unknown {\r\n  color: #cccccc;\r\n  filter: grayscale(100%);\r\n}\r\n\r\n.mdnsupport > span.no::before {\r\n  opacity: 0.5;\r\n}\r\n\r\n.mdnsupport > span.unknown::before {\r\n  opacity: 0.5;\r\n}\r\n\r\n.mdnsupport > span::before {\r\n  content: \"\";\r\n  display: table-cell;\r\n  min-width: 1.5em;\r\n  height: 1.5em;\r\n  background: no-repeat center center / contain;\r\n  text-align: right;\r\n  font-size: 0.75em;\r\n  font-weight: bold;\r\n}\r\n\r\n.mdnsupport > .chrome::before,\r\n.mdnsupport > .chrome_android::before {\r\n  background-image: url(https://resources.whatwg.org/browser-logos/chrome.svg);\r\n}\r\n\r\n.mdnsupport > .edge::before,\r\n.mdnsupport > .edge_mobile::before {\r\n  background-image: url(https://resources.whatwg.org/browser-logos/edge.svg);\r\n}\r\n\r\n.mdnsupport > .firefox::before,\r\n.mdnsupport > .firefox_android::before {\r\n  background-image: url(https://resources.whatwg.org/browser-logos/firefox.png);\r\n}\r\n\r\n.mdnsupport > .ie::before {\r\n  background-image: url(https://resources.whatwg.org/browser-logos/ie.png);\r\n}\r\n\r\n.mdnsupport > .opera::before,\r\n.mdnsupport > .opera_android::before {\r\n  background-image: url(https://resources.whatwg.org/browser-logos/opera.svg);\r\n}\r\n\r\n.mdnsupport > .safari::before {\r\n  background-image: url(https://resources.whatwg.org/browser-logos/safari.png);\r\n}\r\n\r\n.mdnsupport > .safari_ios::before {\r\n  background-image: url(https://resources.whatwg.org/browser-logos/safari-ios.svg);\r\n}\r\n\r\n.mdnsupport > .samsunginternet_android::before {\r\n  background-image: url(https://resources.whatwg.org/browser-logos/samsung.svg);\r\n}\r\n\r\n.mdnsupport > .webview_android::before {\r\n  background-image: url(https://cdnjs.loli.net/ajax/libs/browser-logos/41.0.0/android-webview-beta/android-webview-beta_32x32.png);\r\n}\r\n\r\n.mdn.wrapped div:nth-child(n + 3) {\r\n  display: none;\r\n}\r\n\r\n.mdn div:nth-child(n + 3) > b {\r\n  color: #eee;\r\n  background-color: #eee;\r\n}\r\n\r\np + .mdn {\r\n  margin-top: -45px;\r\n}\r\n\r\n.mdn.before {\r\n  margin-top: 3em;\r\n}\r\n\r\nh2 + .mdn {\r\n  margin: -48px 0 0 0;\r\n}\r\n\r\nh3 + .mdn {\r\n  margin: -46px 0 0 0;\r\n}\r\n\r\nh4 + .mdn {\r\n  margin: -42px 0 0 0;\r\n}\r\n\r\nh5 + .mdn {\r\n  margin: -40px 0 0 0;\r\n}\r\n\r\nh6 + .mdn {\r\n  margin: -40px 0 0 0;\r\n}\r\n\r\n.mdn div {\r\n  margin: 0;\r\n}\r\n\r\n.mdn :link {\r\n  color: #0000ee;\r\n}\r\n\r\n.mdn :visited {\r\n  color: #551a8b;\r\n}\r\n\r\n.mdn :link:active,\r\n:visited:active {\r\n  color: #ff0000;\r\n}\r\n\r\n.mdn :link,\r\n:visited {\r\n  text-decoration: underline;\r\n  cursor: pointer;\r\n}\r\n\r\n.mdn.wrapped {\r\n  min-width: 0px;\r\n}\r\n\r\n.mdn.wrapped > div > div {\r\n  display: none;\r\n}\r\n\r\n.mdn:hover {\r\n  z-index: 11;\r\n}\r\n\r\n.mdn:focus-within {\r\n  z-index: 11;\r\n}\r\n";

var mdnAnnotation$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': mdnAnnotation$1
});

var respecWorker = "// ReSpec Worker v1.0.0\r\n\"use strict\";\r\ntry {\r\n  importScripts(\"https://www.w3.org/Tools/respec/respec-highlight.js\");\r\n} catch (err) {\r\n  console.error(\"Network error loading highlighter\", err);\r\n}\r\n\r\nself.addEventListener(\"message\", ({ data: originalData }) => {\r\n  const data = Object.assign({}, originalData);\r\n  switch (data.action) {\r\n    case \"highlight-load-lang\": {\r\n      const { langURL, propName, lang } = data;\r\n      importScripts(langURL);\r\n      self.hljs.registerLanguage(lang, self[propName]);\r\n      break;\r\n    }\r\n    case \"highlight\": {\r\n      const { code } = data;\r\n      const langs = data.languages.length ? data.languages : undefined;\r\n      try {\r\n        const { value, language } = self.hljs.highlightAuto(code, langs);\r\n        Object.assign(data, { value, language });\r\n      } catch (err) {\r\n        console.error(\"Could not transform some code?\", err);\r\n        // Post back the original code\r\n        Object.assign(data, { value: code, language: \"\" });\r\n      }\r\n      break;\r\n    }\r\n  }\r\n  self.postMessage(data);\r\n});\r\n";

var respecWorker$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': respecWorker
});

var github$2 = "/*\r\n\r\ngithub.com style (c) Vasily Polovnyov <vast@whiteants.net>\r\n\r\n*/\r\n\r\n.hljs {\r\n  display: block;\r\n  overflow-x: auto;\r\n  padding: 0.5em;\r\n  color: #333;\r\n  background: #f8f8f8;\r\n}\r\n\r\n.hljs-comment,\r\n.hljs-quote {\r\n  color: #998;\r\n  font-style: italic;\r\n}\r\n\r\n.hljs-keyword,\r\n.hljs-selector-tag,\r\n.hljs-subst {\r\n  color: #333;\r\n  font-weight: bold;\r\n}\r\n\r\n.hljs-number,\r\n.hljs-literal,\r\n.hljs-variable,\r\n.hljs-template-variable,\r\n.hljs-tag .hljs-attr {\r\n  color: #008080;\r\n}\r\n\r\n.hljs-string,\r\n.hljs-doctag {\r\n  color: #d14;\r\n}\r\n\r\n.hljs-title,\r\n.hljs-section,\r\n.hljs-selector-id {\r\n  color: #900;\r\n  font-weight: bold;\r\n}\r\n\r\n.hljs-subst {\r\n  font-weight: normal;\r\n}\r\n\r\n.hljs-type,\r\n.hljs-class .hljs-title {\r\n  color: #458;\r\n  font-weight: bold;\r\n}\r\n\r\n.hljs-tag,\r\n.hljs-name,\r\n.hljs-attribute {\r\n  color: #000080;\r\n  font-weight: normal;\r\n}\r\n\r\n.hljs-regexp,\r\n.hljs-link {\r\n  color: #009926;\r\n}\r\n\r\n.hljs-symbol,\r\n.hljs-bullet {\r\n  color: #990073;\r\n}\r\n\r\n.hljs-built_in,\r\n.hljs-builtin-name {\r\n  color: #0086b3;\r\n}\r\n\r\n.hljs-meta {\r\n  color: #999;\r\n  font-weight: bold;\r\n}\r\n\r\n.hljs-deletion {\r\n  background: #fdd;\r\n}\r\n\r\n.hljs-addition {\r\n  background: #dfd;\r\n}\r\n\r\n.hljs-emphasis {\r\n  font-style: italic;\r\n}\r\n\r\n.hljs-strong {\r\n  font-weight: bold;\r\n}\r\n";

var github$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': github$2
});

var _var = "var:hover {\r\n  text-decoration: underline;\r\n  cursor: pointer;\r\n}\r\n\r\nvar.respec-hl {\r\n  color: var(--color, #000);\r\n  background-color: var(--bg-color);\r\n  box-shadow: 0 0 0px 2px var(--bg-color);\r\n}\r\n\r\n/* highlight colors\r\n  https://github.com/w3c/tr-design/issues/152\r\n*/\r\nvar.respec-hl-c1 {\r\n  --bg-color: #f4d200;\r\n}\r\n\r\nvar.respec-hl-c2 {\r\n  --bg-color: #ff87a2;\r\n}\r\n\r\nvar.respec-hl-c3 {\r\n  --bg-color: #96e885;\r\n}\r\n\r\nvar.respec-hl-c4 {\r\n  --bg-color: #3eeed2;\r\n}\r\n\r\nvar.respec-hl-c5 {\r\n  --bg-color: #eacfb6;\r\n}\r\n\r\nvar.respec-hl-c6 {\r\n  --bg-color: #82ddff;\r\n}\r\n\r\nvar.respec-hl-c7 {\r\n  --bg-color: #ffbcf2;\r\n}\r\n\r\n@media print {\r\n  var.respec-hl {\r\n    background: none;\r\n    color: #000;\r\n    box-shadow: unset;\r\n  }\r\n}\r\n";

var _var$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': _var
});

var dfnPanel$1 = "/* dfn popup panel that list all local references to a dfn */\r\ndfn {\r\n  cursor: pointer;\r\n}\r\n\r\n.dfn-panel {\r\n  position: absolute;\r\n  left: var(--left); /* set via JS */\r\n  top: var(--top); /* set via JS */\r\n  z-index: 35;\r\n  height: auto;\r\n  width: max-content;\r\n  max-width: 300px;\r\n  max-height: 500px;\r\n  overflow: auto;\r\n  padding: 0.5em 0.75em;\r\n  font: small Helvetica Neue, sans-serif, Droid Sans Fallback;\r\n  background: #dddddd;\r\n  color: black;\r\n  border: outset 0.2em;\r\n}\r\n\r\n.dfn-panel * {\r\n  margin: 0;\r\n}\r\n\r\n.dfn-panel > b {\r\n  display: block;\r\n}\r\n\r\n.dfn-panel ul a[href] {\r\n  color: black;\r\n}\r\n\r\n.dfn-panel a:not(:hover) {\r\n  text-decoration: none !important;\r\n  border-bottom: none !important;\r\n}\r\n\r\n.dfn-panel a[href]:hover {\r\n  border-bottom-width: 1px;\r\n}\r\n\r\n.dfn-panel > b + b {\r\n  margin-top: 0.25em;\r\n}\r\n\r\n.dfn-panel ul {\r\n  padding: 0;\r\n}\r\n\r\n.dfn-panel li {\r\n  list-style: inside;\r\n}\r\n\r\n.dfn-panel.docked {\r\n  display: inline-block;\r\n  position: fixed;\r\n  left: 0.5em;\r\n  top: unset;\r\n  bottom: 2em;\r\n  margin: 0 auto;\r\n  /* 0.75em from padding (x2), 0.5em from left position, 0.2em border (x2) */\r\n  max-width: calc(100vw - 0.75em * 2 - 0.5em - 0.2em * 2);\r\n  max-height: 30vh;\r\n}\r\n";

var dfnPanel$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': dfnPanel$1
});

var datatype = "var {\r\n  position: relative;\r\n  cursor: pointer;\r\n}\r\n\r\nvar[data-type]::before,\r\nvar[data-type]::after {\r\n  position: absolute;\r\n  left: 50%;\r\n  top: -6px;\r\n  opacity: 0;\r\n  transition: opacity 0.4s;\r\n  pointer-events: none;\r\n}\r\n\r\n/* the triangle or arrow or caret or whatever */\r\nvar[data-type]::before {\r\n  content: \"\";\r\n  transform: translateX(-50%);\r\n  border-width: 4px 6px 0 6px;\r\n  border-style: solid;\r\n  border-color: transparent;\r\n  border-top-color: #000;\r\n}\r\n\r\n/* actual text */\r\nvar[data-type]::after {\r\n  content: attr(data-type);\r\n  transform: translateX(-50%) translateY(-100%);\r\n  background: #000;\r\n  text-align: center;\r\n  /* additional styling */\r\n  font-family: \"Dank Mono\", \"Fira Code\", monospace;\r\n  font-style: normal;\r\n  padding: 6px;\r\n  border-radius: 3px;\r\n  color: #daca88;\r\n  text-indent: 0;\r\n  font-weight: normal;\r\n}\r\n\r\nvar[data-type]:hover::after,\r\nvar[data-type]:hover::before {\r\n  opacity: 1;\r\n}\r\n";

var datatype$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': datatype
});

var algorithms$1 = "/* For assertions in lists containing algorithms */\r\n\r\n.assert {\r\n    background: #EEE;\r\n    border-left: 0.5em solid #AAA;\r\n    padding: 0.3em;\r\n}\r\n";

var algorithms$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': algorithms$1
});
=======
    `}};async function fetchCommits(e,t,n){let r;try{const o=await github;if(!o)throw new Error("`respecConfig.github` is not set");const i=new URL("commits",`${o.apiBase}/${o.fullName}/`);i.searchParams.set("from",e),i.searchParams.set("to",t);const s=await fetch(i.href);if(!s.ok)throw new Error(`Request to ${i} failed with status code ${s.status}`);if(r=await s.json(),!r.length)throw new Error(`No commits between ${e}..${t}.`);r=r.filter(n)}catch(e){const t=`Error loading commits from GitHub. ${e.message}`;throw console.error(e),new Error(t)}return r}async function toHTML$2(e){const{repoURL:t}=await github;return e.map(e=>{const[n,r=null]=e.message.split(/\(#(\d+)\)/,2),o=`${t}commit/${e.hash}`,i=r&&hyperHTML$1` (<a href="${r?`${t}pull/${r}`:null}">#${r}</a>)`;return hyperHTML$1`<li><a href="${o}">${n.trim()}</a>${i}</li>`})}var changelog=Object.freeze({__proto__:null,name:name$Y,element:element});const CUSTOM_ELEMENTS=[changelog],name$Z="core/custom-elements";async function run$K(){CUSTOM_ELEMENTS.forEach(e=>{customElements.define(e.name,e.element)});const e=CUSTOM_ELEMENTS.map(e=>e.name).join(", "),t=[...document.querySelectorAll(e)].map(e=>new Promise(t=>e.addEventListener("done",t,{once:!0})));await Promise.all(t)}var index=Object.freeze({__proto__:null,name:name$Z,run:run$K}),ui$2='#respec-ui {\n  position: fixed;\n  display: flex;\n  flex-direction: row-reverse;\n  top: 20px;\n  right: 20px;\n  width: 202px;\n  text-align: right;\n  z-index: 9000;\n}\n\n#respec-pill,\n.respec-info-button {\n  background: #fff;\n  height: 2.5em;\n  color: rgb(120, 120, 120);\n  border: 1px solid #ccc;\n  box-shadow: 1px 1px 8px 0 rgba(100, 100, 100, 0.5);\n}\n\n.respec-info-button {\n  border: none;\n  opacity: 0.75;\n  border-radius: 2em;\n  margin-right: 1em;\n  min-width: 3.5em;\n}\n\n.respec-info-button:focus,\n.respec-info-button:hover {\n  opacity: 1;\n  transition: opacity 0.2s;\n}\n\n#respec-pill:disabled {\n  font-size: 2.8px;\n  text-indent: -9999em;\n  border-top: 1.1em solid rgba(40, 40, 40, 0.2);\n  border-right: 1.1em solid rgba(40, 40, 40, 0.2);\n  border-bottom: 1.1em solid rgba(40, 40, 40, 0.2);\n  border-left: 1.1em solid #ffffff;\n  transform: translateZ(0);\n  animation: respec-spin 0.5s infinite linear;\n  box-shadow: none;\n}\n\n#respec-pill:disabled,\n#respec-pill:disabled:after {\n  border-radius: 50%;\n  width: 10em;\n  height: 10em;\n}\n\n@keyframes respec-spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n\n.respec-hidden {\n  visibility: hidden;\n  opacity: 0;\n  transition: visibility 0s 0.2s, opacity 0.2s linear;\n}\n\n.respec-visible {\n  visibility: visible;\n  opacity: 1;\n  transition: opacity 0.2s linear;\n}\n\n#respec-pill:hover,\n#respec-pill:focus {\n  color: rgb(0, 0, 0);\n  background-color: rgb(245, 245, 245);\n  transition: color 0.2s;\n}\n\n#respec-menu {\n  position: absolute;\n  margin: 0;\n  padding: 0;\n  font-family: sans-serif;\n  background: #fff;\n  box-shadow: 1px 1px 8px 0 rgba(100, 100, 100, 0.5);\n  width: 200px;\n  display: none;\n  text-align: left;\n  margin-top: 32px;\n  font-size: 0.8em;\n}\n\n#respec-menu:not([hidden]) {\n  display: block;\n}\n\n#respec-menu li {\n  list-style-type: none;\n  margin: 0;\n  padding: 0;\n}\n\n.respec-save-buttons {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(47%, 2fr));\n  grid-gap: 0.5cm;\n  padding: 0.5cm;\n}\n\n.respec-save-button:link {\n  padding-top: 16px;\n  color: rgb(240, 240, 240);\n  background: rgb(42, 90, 168);\n  justify-self: stretch;\n  height: 1cm;\n  text-decoration: none;\n  text-align: center;\n  font-size: inherit;\n  border: none;\n  border-radius: 0.2cm;\n}\n\n.respec-save-button:link:hover {\n  color: white;\n  background: rgb(42, 90, 168);\n  padding: 0;\n  margin: 0;\n  border: 0;\n  padding-top: 16px;\n}\n\n#respec-ui button:focus,\n#respec-pill:focus,\n.respec-option:focus {\n  outline: 0;\n  outline-style: none;\n}\n\n#respec-pill-error {\n  background-color: red;\n  color: white;\n}\n\n#respec-pill-warning {\n  background-color: orange;\n  color: white;\n}\n\n.respec-warning-list,\n.respec-error-list {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n  font-family: sans-serif;\n  background-color: rgb(255, 251, 230);\n  font-size: 0.85em;\n}\n\n.respec-warning-list > li,\n.respec-error-list > li {\n  padding: 0.4em 0.7em;\n}\n\n.respec-warning-list > li::before {\n  content: "⚠️";\n  padding-right: 0.5em;\n}\n.respec-warning-list p,\n.respec-error-list p {\n  padding: 0;\n  margin: 0;\n}\n\n.respec-warning-list li {\n  color: rgb(92, 59, 0);\n  border-bottom: thin solid rgb(255, 245, 194);\n}\n\n.respec-error-list,\n.respec-error-list li {\n  background-color: rgb(255, 240, 240);\n}\n\n.respec-error-list li::before {\n  content: "💥";\n  padding-right: 0.5em;\n}\n\n.respec-error-list li {\n  padding: 0.4em 0.7em;\n  color: rgb(92, 59, 0);\n  border-bottom: thin solid rgb(255, 215, 215);\n}\n\n.respec-error-list li > p {\n  margin: 0;\n  padding: 0;\n  display: inline-block;\n}\n\n#respec-overlay {\n  display: block;\n  position: fixed;\n  z-index: 10000;\n  top: 0px;\n  left: 0px;\n  height: 100%;\n  width: 100%;\n  background: #000;\n}\n\n.respec-show-overlay {\n  transition: opacity 0.2s linear;\n  opacity: 0.5;\n}\n\n.respec-hide-overlay {\n  transition: opacity 0.2s linear;\n  opacity: 0;\n}\n\n.respec-modal {\n  display: block;\n  position: fixed;\n  z-index: 11000;\n  margin: auto;\n  top: 10%;\n  background: #fff;\n  border: 5px solid #666;\n  min-width: 20%;\n  width: 79%;\n  padding: 0;\n  max-height: 80%;\n  overflow-y: auto;\n  margin: 0 -0.5cm;\n}\n\n@media screen and (min-width: 78em) {\n  .respec-modal {\n    width: 62%;\n  }\n}\n\n.respec-modal h3 {\n  margin: 0;\n  padding: 0.2em;\n  text-align: center;\n  color: black;\n  background: linear-gradient(\n    to bottom,\n    rgba(238, 238, 238, 1) 0%,\n    rgba(238, 238, 238, 1) 50%,\n    rgba(204, 204, 204, 1) 100%\n  );\n  font-size: 1em;\n}\n\n.respec-modal .inside div p {\n  padding-left: 1cm;\n}\n\n#respec-menu button.respec-option {\n  background: white;\n  padding: 0 0.2cm;\n  border: none;\n  width: 100%;\n  text-align: left;\n  font-size: inherit;\n  padding: 1.2em 1.2em;\n}\n\n#respec-menu button.respec-option:hover,\n#respec-menu button:focus {\n  background-color: #eeeeee;\n}\n\n.respec-cmd-icon {\n  padding-right: 0.5em;\n}\n\n#respec-ui button.respec-option:last-child {\n  border: none;\n  border-radius: inherit;\n}\n\n.respec-button-copy-paste {\n  position: absolute;\n  height: 28px;\n  width: 40px;\n  cursor: pointer;\n  background-image: linear-gradient(#fcfcfc, #eee);\n  border: 1px solid rgb(144, 184, 222);\n  border-left: 0;\n  border-radius: 0px 0px 3px 0;\n  -webkit-user-select: none;\n  user-select: none;\n  -webkit-appearance: none;\n  top: 0;\n  left: 127px;\n}\n\n#specref-ui {\n  margin: 0 2%;\n  margin-bottom: 0.5cm;\n}\n\n#specref-ui header {\n  font-size: 0.7em;\n  background-color: #eee;\n  text-align: center;\n  padding: 0.2cm;\n  margin-bottom: 0.5cm;\n  border-radius: 0 0 0.2cm 0.2cm;\n}\n\n#specref-ui header h1 {\n  padding: 0;\n  margin: 0;\n  color: black;\n}\n\n#specref-ui p {\n  padding: 0;\n  margin: 0;\n  font-size: 0.8em;\n  text-align: center;\n}\n\n#specref-ui p.state {\n  margin: 1cm;\n}\n\n#specref-ui .searchcomponent {\n  font-size: 16px;\n  display: grid;\n  grid-template-columns: auto 2cm;\n}\n#specref-ui .searchcomponent:focus {\n}\n\n#specref-ui input,\n#specref-ui button {\n  border: 0;\n  padding: 6px 12px;\n}\n\n#specref-ui label {\n  font-size: 0.6em;\n  grid-column-end: 3;\n  text-align: right;\n  grid-column-start: 1;\n}\n\n#specref-ui input[type="search"] {\n  -webkit-appearance: none;\n  font-size: 16px;\n  border-radius: 0.1cm 0 0 0.1cm;\n  border: 1px solid rgb(204, 204, 204);\n}\n\n#specref-ui button[type="submit"] {\n  color: white;\n  border-radius: 0 0.1cm 0.1cm 0;\n  background-color: rgb(51, 122, 183);\n}\n\n#specref-ui button[type="submit"]:hover {\n  background-color: #286090;\n  border-color: #204d74;\n}\n\n#specref-ui .result-stats {\n  margin: 0;\n  padding: 0;\n  color: rgb(128, 128, 128);\n  font-size: 0.7em;\n  font-weight: bold;\n}\n\n#specref-ui .specref-results {\n  font-size: 0.8em;\n}\n\n#specref-ui .specref-results dd + dt {\n  margin-top: 0.51cm;\n}\n\n#specref-ui .specref-results a {\n  text-transform: capitalize;\n}\n#specref-ui .specref-results .authors {\n  display: block;\n  color: #006621;\n}\n\n@media print {\n  #respec-ui {\n    display: none;\n  }\n}\n\n#xref-ui {\n  width: 100%;\n  min-height: 550px;\n  height: 100%;\n  overflow: hidden;\n  padding: 0;\n  margin: 0;\n  border: 0;\n}\n\n#xref-ui:not(.ready) {\n  background: url("https://respec.org/xref/loader.gif") no-repeat center;\n}\n',ui$3=Object.freeze({__proto__:null,default:ui$2}),respec='/*****************************************************************\n * ReSpec specific CSS\n *****************************************************************/\n@keyframes pop {\n  0% {\n    transform: scale(1, 1);\n  }\n  25% {\n    transform: scale(1.25, 1.25);\n    opacity: 0.75;\n  }\n  100% {\n    transform: scale(1, 1);\n  }\n}\n\n/* Override code highlighter background */\n.hljs {\n  background: transparent !important;\n}\n\n/* --- INLINES --- */\nh1 abbr,\nh2 abbr,\nh3 abbr,\nh4 abbr,\nh5 abbr,\nh6 abbr,\na abbr {\n  border: none;\n}\n\ndfn {\n  font-weight: bold;\n}\n\na.internalDFN {\n  color: inherit;\n  border-bottom: 1px solid #99c;\n  text-decoration: none;\n}\n\na.externalDFN {\n  color: inherit;\n  border-bottom: 1px dotted #ccc;\n  text-decoration: none;\n}\n\na.bibref {\n  text-decoration: none;\n}\n\n.respec-offending-element:target {\n  animation: pop 0.25s ease-in-out 0s 1;\n}\n\n.respec-offending-element,\na[href].respec-offending-element {\n  text-decoration: red wavy underline;\n}\n@supports not (text-decoration: red wavy underline) {\n  .respec-offending-element:not(pre) {\n    display: inline-block;\n  }\n  .respec-offending-element {\n    /* Red squiggly line */\n    background: url(data:image/gif;base64,R0lGODdhBAADAPEAANv///8AAP///wAAACwAAAAABAADAEACBZQjmIAFADs=)\n      bottom repeat-x;\n  }\n}\n\n#references :target {\n  background: #eaf3ff;\n  animation: pop 0.4s ease-in-out 0s 1;\n}\n\ncite .bibref {\n  font-style: normal;\n}\n\ncode {\n  color: #c83500;\n}\n\nth code {\n  color: inherit;\n}\n\na[href].orcid {\n    padding-left: 4px;\n    padding-right: 4px;\n}\n\na[href].orcid > svg {\n    margin-bottom: -2px;\n}\n\n/* --- TOC --- */\n\n.toc a,\n.tof a {\n  text-decoration: none;\n}\n\na .secno,\na .figno {\n  color: #000;\n}\n\nul.tof,\nol.tof {\n  list-style: none outside none;\n}\n\n.caption {\n  margin-top: 0.5em;\n  font-style: italic;\n}\n\n/* --- TABLE --- */\n\ntable.simple {\n  border-spacing: 0;\n  border-collapse: collapse;\n  border-bottom: 3px solid #005a9c;\n}\n\n.simple th {\n  background: #005a9c;\n  color: #fff;\n  padding: 3px 5px;\n  text-align: left;\n}\n\n.simple th a {\n  color: #fff;\n  padding: 3px 5px;\n  text-align: left;\n}\n\n.simple th[scope="row"] {\n  background: inherit;\n  color: inherit;\n  border-top: 1px solid #ddd;\n}\n\n.simple td {\n  padding: 3px 10px;\n  border-top: 1px solid #ddd;\n}\n\n.simple tr:nth-child(even) {\n  background: #f0f6ff;\n}\n\n/* --- DL --- */\n\n.section dd > p:first-child {\n  margin-top: 0;\n}\n\n.section dd > p:last-child {\n  margin-bottom: 0;\n}\n\n.section dd {\n  margin-bottom: 1em;\n}\n\n.section dl.attrs dd,\n.section dl.eldef dd {\n  margin-bottom: 0;\n}\n\n#issue-summary > ul,\n.respec-dfn-list {\n  column-count: 2;\n}\n\n#issue-summary li,\n.respec-dfn-list li {\n  list-style: none;\n}\n\ndetails.respec-tests-details {\n  margin-left: 1em;\n  display: inline-block;\n  vertical-align: top;\n}\n\ndetails.respec-tests-details > * {\n  padding-right: 2em;\n}\n\ndetails.respec-tests-details[open] {\n  z-index: 999999;\n  position: absolute;\n  border: thin solid #cad3e2;\n  border-radius: 0.3em;\n  background-color: white;\n  padding-bottom: 0.5em;\n}\n\ndetails.respec-tests-details[open] > summary {\n  border-bottom: thin solid #cad3e2;\n  padding-left: 1em;\n  margin-bottom: 1em;\n  line-height: 2em;\n}\n\ndetails.respec-tests-details > ul {\n  width: 100%;\n  margin-top: -0.3em;\n}\n\ndetails.respec-tests-details > li {\n  padding-left: 1em;\n}\n\na[href].self-link:hover {\n  opacity: 1;\n  text-decoration: none;\n  background-color: transparent;\n}\n\nh2,\nh3,\nh4,\nh5,\nh6 {\n  position: relative;\n}\n\naside.example .marker > a.self-link {\n  color: inherit;\n}\n\nh2 > a.self-link,\nh3 > a.self-link,\nh4 > a.self-link,\nh5 > a.self-link,\nh6 > a.self-link {\n  border: none;\n  color: inherit;\n  font-size: 83%;\n  height: 2em;\n  left: -1.6em;\n  opacity: 0.5;\n  position: absolute;\n  text-align: center;\n  text-decoration: none;\n  top: 0;\n  transition: opacity 0.2s;\n  width: 2em;\n}\n\nh2 > a.self-link::before,\nh3 > a.self-link::before,\nh4 > a.self-link::before,\nh5 > a.self-link::before,\nh6 > a.self-link::before {\n  content: "§";\n  display: block;\n}\n\n@media (max-width: 767px) {\n  dd {\n    margin-left: 0;\n  }\n\n  /* Don\'t position self-link in headings off-screen */\n  h2 > a.self-link,\n  h3 > a.self-link,\n  h4 > a.self-link,\n  h5 > a.self-link,\n  h6 > a.self-link {\n    left: auto;\n    top: auto;\n  }\n}\n\n@media print {\n  .removeOnSave {\n    display: none;\n  }\n}\n',respec$1=Object.freeze({__proto__:null,default:respec}),examples$1="/* --- EXAMPLES --- */\nspan.example-title {\n    text-transform: none;\n}\naside.example, div.example, div.illegal-example {\n    padding: 0.5em;\n    margin: 1em 0;\n    position: relative;\n    clear: both;\n}\ndiv.illegal-example { color: red }\ndiv.illegal-example p { color: black }\naside.example, div.example {\n    padding: .5em;\n    border-left-width: .5em;\n    border-left-style: solid;\n    border-color: #e0cb52;\n    background: #fcfaee;\n}\n\naside.example div.example {\n    border-left-width: .1em;\n    border-color: #999;\n    background: #fff;\n}\naside.example div.example span.example-title {\n    color: #999;\n}\n",examples$2=Object.freeze({__proto__:null,default:examples$1}),issuesNotes$1='/* --- ISSUES/NOTES --- */\n.issue-label {\n    text-transform: initial;\n}\n\n.warning > p:first-child { margin-top: 0 }\n.warning {\n    padding: .5em;\n    border-left-width: .5em;\n    border-left-style: solid;\n}\nspan.warning { padding: .1em .5em .15em; }\n\n.issue.closed span.issue-number {\n    text-decoration: line-through;\n}\n\n.warning {\n    border-color: #f11;\n    border-width: .2em;\n    border-style: solid;\n    background: #fbe9e9;\n}\n\n.warning-title:before{\n    content: "⚠"; /*U+26A0 WARNING SIGN*/\n    font-size: 1.3em;\n    float: left;\n    padding-right: .3em;\n    margin-top: -0.3em;\n}\n\nli.task-list-item {\n    list-style: none;\n}\n\ninput.task-list-item-checkbox {\n    margin: 0 0.35em 0.25em -1.6em;\n    vertical-align: middle;\n}\n\n.issue a.respec-gh-label {\n  padding: 5px;\n  margin: 0 2px 0 2px;\n  font-size: 10px;\n  text-transform: none;\n  text-decoration: none;\n  font-weight: bold;\n  border-radius: 4px;\n  position: relative;\n  bottom: 2px;\n  border: none;\n  display: inline-block;\n}\n\n.issue a.respec-label-dark {\n  color: #fff;\n  background-color: #000;\n}\n\n.issue a.respec-label-light {\n  color: #000;\n  background-color: #fff;\n}\n',issuesNotes$2=Object.freeze({__proto__:null,default:issuesNotes$1}),webidl$1="/* --- WEB IDL --- */\n\npre.idl {\n  padding: 1em;\n  position: relative;\n}\n\n@media print {\n  pre.idl {\n    white-space: pre-wrap;\n  }\n}\n\ndiv.idlHeader {\n  display: block;\n  width: 150px;\n  background: #90b8de;\n  color: #fff;\n  font-family: sans-serif;\n  font-weight: bold;\n  margin: -1em 0 1em -1em;\n  height: 28px;\n  line-height: 28px;\n}\n\ndiv.idlHeader a.self-link {\n   color: #fff;\n   margin-left: .3cm;\n   text-decoration: none;\n   border-bottom: none;\n}\n\n.idlID {\n  font-weight: bold;\n  color: #005a9c;\n}\n\n.idlType {\n  color: #005a9c;\n}\n\n.idlName {\n  color: #ff4500;\n}\n\n.idlName a {\n  color: #ff4500;\n  border-bottom: 1px dotted #ff4500;\n  text-decoration: none;\n}\n\na.idlEnumItem {\n  color: #000;\n  border-bottom: 1px dotted #ccc;\n  text-decoration: none;\n}\n\n.idlSuperclass {\n  font-style: italic;\n  color: #005a9c;\n}\n\n\n/*.idlParam*/\n\n.idlParamName,\n.idlDefaultValue {\n  font-style: italic;\n}\n\n.extAttr {\n  color: #666;\n}\n\n\n/*.idlSectionComment*/\n\n.idlSectionComment {\n  color: gray;\n}\n\n.idlIncludes a {\n  font-weight: bold;\n}\n\n.respec-button-copy-paste:focus {\n  text-decoration: none;\n  border-color: #51a7e8;\n  outline: none;\n  box-shadow: 0 0 5px rgba(81, 167, 232, 0.5);\n}\n\n.respec-button-copy-paste:focus:hover,\n.respec-button-copy-paste.selected:focus {\n  border-color: #51a7e8;\n}\n\n.respec-button-copy-paste:hover,\n.respec-button-copy-paste:active,\n.respec-button-copy-paste.zeroclipboard-is-hover,\n.respec-button-copy-paste.zeroclipboard-is-active {\n  text-decoration: none;\n  background-color: #ddd;\n  background-image: linear-gradient(#eee, #ddd);\n  border-color: #ccc;\n}\n\n.respec-button-copy-paste:active,\n.respec-button-copy-paste.selected,\n.respec-button-copy-paste.zeroclipboard-is-active {\n  background-color: #dcdcdc;\n  background-image: none;\n  border-color: #b5b5b5;\n  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15)\n}\n\n.respec-button-copy-paste.selected:hover {\n  background-color: #cfcfcf;\n}\n\n.respec-button-copy-paste:disabled,\n.respec-button-copy-paste:disabled:hover,\n.respec-button-copy-paste.disabled,\n.respec-button-copy-paste.disabled:hover {\n  color: rgba(102, 102, 102, 0.5);\n  cursor: default;\n  background-color: rgba(229, 229, 229, 0.5);\n  background-image: none;\n  border-color: rgba(197, 197, 197, 0.5);\n  box-shadow: none;\n}\n\n@media print {\n  .respec-button-copy-paste {\n    visibility: hidden;\n  }\n}\n",webidl$2=Object.freeze({__proto__:null,default:webidl$1}),caniuse$1='/* container for stats */\n.caniuse-stats {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: flex-start;\n  align-items: baseline;\n  cursor: pointer;\n}\n\nbutton.caniuse-cell {\n  margin: 1px 1px 0 0;\n  border: none;\n}\n\n.caniuse-browser {\n  position: relative;\n}\n\n/* handle case when printing */\n@media print {\n  .caniuse-cell.y::before {\n    content: "✔️";\n    padding: 0.5em;\n  }\n\n  .caniuse-cell.n::before{\n    content: "❌";\n    padding: 0.5em;\n  }\n\n  .caniuse-cell.d::before,\n  .caniuse-cell.a::before,\n  .caniuse-cell.x::before,\n  .caniuse-cell.p::before {\n    content: "⚠️";\n    padding: 0.5em;\n  }\n}\n\n/* reset styles, hide old versions by default */\n.caniuse-browser ul {\n  display: none;\n  margin: 0;\n  padding: 0;\n  list-style: none;\n  position: absolute;\n  left: 0;\n  z-index: 2;\n  background: #fff;\n  margin-top: 1px;\n}\n\n.caniuse-stats a {\n  white-space: nowrap;\n  align-self: center;\n  margin-left: .5em;\n}\n\n/* a browser version */\n.caniuse-cell {\n  display: flex;\n  color: rgba(0, 0, 0, 0.8);\n  font-size: 90%;\n  height: 0.8cm;\n  margin-right: 1px;\n  margin-top: 0;\n  min-width: 3cm;\n  overflow: visible;\n  justify-content: center;\n  align-items: center;\n}\n\nli.caniuse-cell {\n  margin-bottom: 1px;\n}\n\n.caniuse-cell:focus {\n  outline: none;\n}\n\n.caniuse-cell:hover {\n  color: rgba(0, 0, 0, 1);\n}\n\n/* supports */\n.caniuse-cell.y {\n  background: #8bc34a;\n}\n\n/* no support */\n.caniuse-cell.n {\n  background: #e53935;\n}\n\n/* not supported by default / partial support etc\nsee https://github.com/Fyrd/caniuse/blob/master/CONTRIBUTING.md for stats */\n.caniuse-cell.d,\n.caniuse-cell.a,\n.caniuse-cell.x,\n.caniuse-cell.p {\n  background: #ffc107;\n}\n\n/* show rest of the browser versions */\n.caniuse-stats button:focus + ul,\n.caniuse-stats .caniuse-browser:hover > ul {\n  display: block;\n}\n',caniuse$2=Object.freeze({__proto__:null,default:caniuse$1}),mdnAnnotation$1='.mdn {\n  display: block;\n  font: 12px sans-serif;\n  position: absolute;\n  z-index: 9;\n  right: 0.3em;\n  background-color: #eee;\n  margin: -26px 0 0 0;\n  padding: 7px 5px 5px 6px;\n  min-width: 140px;\n  box-shadow: 0 0 3px #999;\n}\n\n.mdn button {\n  cursor: pointer;\n  border: none;\n  color: #000;\n  background: transparent;\n  margin: -8px;\n  outline: none;\n}\n\n.mdn b {\n  color: #fff;\n  background-color: #000;\n  font-weight: normal;\n  font-family: zillaslab, Palatino, "Palatino Linotype", serif;\n  padding: 2px 3px 0px 3px;\n  line-height: 1.3em;\n  vertical-align: top;\n}\n\n.mdn > div > div {\n  display: inline-block;\n  margin-left: 5px;\n}\n\n\n.nosupportdata {\n  font-style: italic;\n  margin-top: 4px;\n  margin-left: 8px;\n  padding-bottom: 8px;\n}\n\n.mdnsupport {\n  display: table;\n  margin-top: 4px;\n}\n\n.mdnsupport > span {\n  display: table-row;\n  padding: 0.2em 0;\n  padding-top: 0.2em;\n  font-size: 9.6px;\n}\n\n.mdnsupport > span > span {\n  display: table-cell;\n  padding: 0 0.5em;\n  vertical-align: top;\n  line-height: 1.5em;\n}\n\n.mdnsupport > span > span:last-child {\n  text-align: right;\n  padding: 0;\n}\n\n.mdnsupport > span.no {\n  color: #cccccc;\n  filter: grayscale(100%);\n}\n\n.mdnsupport > span.unknown {\n  color: #cccccc;\n  filter: grayscale(100%);\n}\n\n.mdnsupport > span.no::before {\n  opacity: 0.5;\n}\n\n.mdnsupport > span.unknown::before {\n  opacity: 0.5;\n}\n\n.mdnsupport > span::before {\n  content: "";\n  display: table-cell;\n  min-width: 1.5em;\n  height: 1.5em;\n  background: no-repeat center center / contain;\n  text-align: right;\n  font-size: 0.75em;\n  font-weight: bold;\n}\n\n.mdnsupport > .chrome::before,\n.mdnsupport > .chrome_android::before {\n  background-image: url(https://resources.whatwg.org/browser-logos/chrome.svg);\n}\n\n.mdnsupport > .edge::before,\n.mdnsupport > .edge_mobile::before {\n  background-image: url(https://resources.whatwg.org/browser-logos/edge.svg);\n}\n\n.mdnsupport > .firefox::before,\n.mdnsupport > .firefox_android::before {\n  background-image: url(https://resources.whatwg.org/browser-logos/firefox.png);\n}\n\n.mdnsupport > .ie::before {\n  background-image: url(https://resources.whatwg.org/browser-logos/ie.png);\n}\n\n.mdnsupport > .opera::before,\n.mdnsupport > .opera_android::before {\n  background-image: url(https://resources.whatwg.org/browser-logos/opera.svg);\n}\n\n.mdnsupport > .safari::before {\n  background-image: url(https://resources.whatwg.org/browser-logos/safari.png);\n}\n\n.mdnsupport > .safari_ios::before {\n  background-image: url(https://resources.whatwg.org/browser-logos/safari-ios.svg);\n}\n\n.mdnsupport > .samsunginternet_android::before {\n  background-image: url(https://resources.whatwg.org/browser-logos/samsung.svg);\n}\n\n.mdnsupport > .webview_android::before {\n  background-image: url(https://cdnjs.loli.net/ajax/libs/browser-logos/41.0.0/android-webview-beta/android-webview-beta_32x32.png);\n}\n\n.mdn.wrapped div:nth-child(n + 3) {\n  display: none;\n}\n\n.mdn div:nth-child(n + 3) > b {\n  color: #eee;\n  background-color: #eee;\n}\n\np + .mdn {\n  margin-top: -45px;\n}\n\n.mdn.before {\n  margin-top: 3em;\n}\n\nh2 + .mdn {\n  margin: -48px 0 0 0;\n}\n\nh3 + .mdn {\n  margin: -46px 0 0 0;\n}\n\nh4 + .mdn {\n  margin: -42px 0 0 0;\n}\n\nh5 + .mdn {\n  margin: -40px 0 0 0;\n}\n\nh6 + .mdn {\n  margin: -40px 0 0 0;\n}\n\n.mdn div {\n  margin: 0;\n}\n\n.mdn :link {\n  color: #0000ee;\n}\n\n.mdn :visited {\n  color: #551a8b;\n}\n\n.mdn :link:active,\n:visited:active {\n  color: #ff0000;\n}\n\n.mdn :link,\n:visited {\n  text-decoration: underline;\n  cursor: pointer;\n}\n\n.mdn.wrapped {\n  min-width: 0px;\n}\n\n.mdn.wrapped > div > div {\n  display: none;\n}\n\n.mdn:hover {\n  z-index: 11;\n}\n\n.mdn:focus-within {\n  z-index: 11;\n}\n',mdnAnnotation$2=Object.freeze({__proto__:null,default:mdnAnnotation$1}),respecWorker='// ReSpec Worker v1.0.0\n"use strict";\ntry {\n  importScripts("https://www.w3.org/Tools/respec/respec-highlight.js");\n} catch (err) {\n  console.error("Network error loading highlighter", err);\n}\n\nself.addEventListener("message", ({ data: originalData }) => {\n  const data = Object.assign({}, originalData);\n  switch (data.action) {\n    case "highlight-load-lang": {\n      const { langURL, propName, lang } = data;\n      importScripts(langURL);\n      self.hljs.registerLanguage(lang, self[propName]);\n      break;\n    }\n    case "highlight": {\n      const { code } = data;\n      const langs = data.languages.length ? data.languages : undefined;\n      try {\n        const { value, language } = self.hljs.highlightAuto(code, langs);\n        Object.assign(data, { value, language });\n      } catch (err) {\n        console.error("Could not transform some code?", err);\n        // Post back the original code\n        Object.assign(data, { value: code, language: "" });\n      }\n      break;\n    }\n  }\n  self.postMessage(data);\n});\n',respecWorker$1=Object.freeze({__proto__:null,default:respecWorker}),highlight$1="/*\nAtom One Light by Daniel Gamage\nOriginal One Light Syntax theme from https://github.com/atom/one-light-syntax\nbase:    #fafafa\nmono-1:  #383a42\nmono-2:  #686b77\nmono-3:  #a0a1a7\nhue-1:   #0184bb\nhue-2:   #4078f2\nhue-3:   #a626a4\nhue-4:   #50a14f\nhue-5:   #e45649\nhue-5-2: #c91243\nhue-6:   #986801\nhue-6-2: #c18401\n*/\n\n.hljs {\n  display: block;\n  overflow-x: auto;\n  padding: 0.5em;\n  color: #383a42;\n  background: #fafafa;\n}\n\n.hljs-comment,\n.hljs-quote {\n  color: #a0a1a7;\n  font-style: italic;\n}\n\n.hljs-doctag,\n.hljs-keyword,\n.hljs-formula {\n  color: #a626a4;\n}\n\n.hljs-section,\n.hljs-name,\n.hljs-selector-tag,\n.hljs-deletion,\n.hljs-subst {\n  color: #e45649;\n}\n\n.hljs-literal {\n  color: #0184bb;\n}\n\n.hljs-string,\n.hljs-regexp,\n.hljs-addition,\n.hljs-attribute,\n.hljs-meta-string {\n  color: #50a14f;\n}\n\n.hljs-built_in,\n.hljs-class .hljs-title {\n  color: #c18401;\n}\n\n.hljs-attr,\n.hljs-variable,\n.hljs-template-variable,\n.hljs-type,\n.hljs-selector-class,\n.hljs-selector-attr,\n.hljs-selector-pseudo,\n.hljs-number {\n  color: #986801;\n}\n\n.hljs-symbol,\n.hljs-bullet,\n.hljs-link,\n.hljs-meta,\n.hljs-selector-id,\n.hljs-title {\n  color: #4078f2;\n}\n\n.hljs-emphasis {\n  font-style: italic;\n}\n\n.hljs-strong {\n  font-weight: bold;\n}\n\n.hljs-link {\n  text-decoration: underline;\n}\n",highlight$2=Object.freeze({__proto__:null,default:highlight$1}),_var="var:hover {\n  text-decoration: underline;\n  cursor: pointer;\n}\n\nvar.respec-hl {\n  color: var(--color, #000);\n  background-color: var(--bg-color);\n  box-shadow: 0 0 0px 2px var(--bg-color);\n}\n\n/* highlight colors\n  https://github.com/w3c/tr-design/issues/152\n*/\nvar.respec-hl-c1 {\n  --bg-color: #f4d200;\n}\n\nvar.respec-hl-c2 {\n  --bg-color: #ff87a2;\n}\n\nvar.respec-hl-c3 {\n  --bg-color: #96e885;\n}\n\nvar.respec-hl-c4 {\n  --bg-color: #3eeed2;\n}\n\nvar.respec-hl-c5 {\n  --bg-color: #eacfb6;\n}\n\nvar.respec-hl-c6 {\n  --bg-color: #82ddff;\n}\n\nvar.respec-hl-c7 {\n  --bg-color: #ffbcf2;\n}\n\n@media print {\n  var.respec-hl {\n    background: none;\n    color: #000;\n    box-shadow: unset;\n  }\n}\n",_var$1=Object.freeze({__proto__:null,default:_var}),dfnPanel$1="/* dfn popup panel that list all local references to a dfn */\ndfn {\n  cursor: pointer;\n}\n\n.dfn-panel {\n  position: absolute;\n  left: var(--left); /* set via JS */\n  top: var(--top); /* set via JS */\n  z-index: 35;\n  height: auto;\n  width: max-content;\n  max-width: 300px;\n  max-height: 500px;\n  overflow: auto;\n  padding: 0.5em 0.75em;\n  font: small Helvetica Neue, sans-serif, Droid Sans Fallback;\n  background: #dddddd;\n  color: black;\n  border: outset 0.2em;\n}\n\n.dfn-panel * {\n  margin: 0;\n}\n\n.dfn-panel > b {\n  display: block;\n}\n\n.dfn-panel ul a[href] {\n  color: black;\n}\n\n.dfn-panel a:not(:hover) {\n  text-decoration: none !important;\n  border-bottom: none !important;\n}\n\n.dfn-panel a[href]:hover {\n  border-bottom-width: 1px;\n}\n\n.dfn-panel > b + b {\n  margin-top: 0.25em;\n}\n\n.dfn-panel ul {\n  padding: 0;\n}\n\n.dfn-panel li {\n  list-style: inside;\n}\n\n.dfn-panel.docked {\n  display: inline-block;\n  position: fixed;\n  left: 0.5em;\n  top: unset;\n  bottom: 2em;\n  margin: 0 auto;\n  /* 0.75em from padding (x2), 0.5em from left position, 0.2em border (x2) */\n  max-width: calc(100vw - 0.75em * 2 - 0.5em - 0.2em * 2);\n  max-height: 30vh;\n}\n",dfnPanel$2=Object.freeze({__proto__:null,default:dfnPanel$1}),datatype='var {\n  position: relative;\n  cursor: pointer;\n}\n\nvar[data-type]::before,\nvar[data-type]::after {\n  position: absolute;\n  left: 50%;\n  top: -6px;\n  opacity: 0;\n  transition: opacity 0.4s;\n  pointer-events: none;\n}\n\n/* the triangle or arrow or caret or whatever */\nvar[data-type]::before {\n  content: "";\n  transform: translateX(-50%);\n  border-width: 4px 6px 0 6px;\n  border-style: solid;\n  border-color: transparent;\n  border-top-color: #000;\n}\n\n/* actual text */\nvar[data-type]::after {\n  content: attr(data-type);\n  transform: translateX(-50%) translateY(-100%);\n  background: #000;\n  text-align: center;\n  /* additional styling */\n  font-family: "Dank Mono", "Fira Code", monospace;\n  font-style: normal;\n  padding: 6px;\n  border-radius: 3px;\n  color: #daca88;\n  text-indent: 0;\n  font-weight: normal;\n}\n\nvar[data-type]:hover::after,\nvar[data-type]:hover::before {\n  opacity: 1;\n}\n',datatype$1=Object.freeze({__proto__:null,default:datatype}),algorithms$1="/* For assertions in lists containing algorithms */\n\n.assert {\n    background: #EEE;\n    border-left: 0.5em solid #AAA;\n    padding: 0.3em;\n}\n",algorithms$2=Object.freeze({__proto__:null,default:algorithms$1});
>>>>>>> ee920564e72922e648a7264ada181389c5522282
//# sourceMappingURL=respec-w3c.js.map
