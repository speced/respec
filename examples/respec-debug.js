/* ReSpec 3.1.66 - Robin Berjon, http://berjon.com/ (@robinberjon) */
/* Documentation: http://w3.org/respec/. */
/* See original source for licenses: https://github.com/darobin/respec. */

/*
 RequireJS 2.1.8 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/jrburke/requirejs for details
*/
var requirejs,require,define;
(function(Z){function H(b){return"[object Function]"===L.call(b)}function I(b){return"[object Array]"===L.call(b)}function y(b,c){if(b){var d;for(d=0;d<b.length&&(!b[d]||!c(b[d],d,b));d+=1);}}function M(b,c){if(b){var d;for(d=b.length-1;-1<d&&(!b[d]||!c(b[d],d,b));d-=1);}}function s(b,c){return ga.call(b,c)}function l(b,c){return s(b,c)&&b[c]}function F(b,c){for(var d in b)if(s(b,d)&&c(b[d],d))break}function Q(b,c,d,h){c&&F(c,function(c,j){if(d||!s(b,j))h&&"string"!==typeof c?(b[j]||(b[j]={}),Q(b[j],
c,d,h)):b[j]=c});return b}function u(b,c){return function(){return c.apply(b,arguments)}}function aa(b){throw b;}function ba(b){if(!b)return b;var c=Z;y(b.split("."),function(b){c=c[b]});return c}function A(b,c,d,h){c=Error(c+"\nhttp://requirejs.org/docs/errors.html#"+b);c.requireType=b;c.requireModules=h;d&&(c.originalError=d);return c}function ha(b){function c(a,f,b){var e,m,c,g,d,h,j,i=f&&f.split("/");e=i;var n=k.map,p=n&&n["*"];if(a&&"."===a.charAt(0))if(f){e=l(k.pkgs,f)?i=[f]:i.slice(0,i.length-
1);f=a=e.concat(a.split("/"));for(e=0;f[e];e+=1)if(m=f[e],"."===m)f.splice(e,1),e-=1;else if(".."===m)if(1===e&&(".."===f[2]||".."===f[0]))break;else 0<e&&(f.splice(e-1,2),e-=2);e=l(k.pkgs,f=a[0]);a=a.join("/");e&&a===f+"/"+e.main&&(a=f)}else 0===a.indexOf("./")&&(a=a.substring(2));if(b&&n&&(i||p)){f=a.split("/");for(e=f.length;0<e;e-=1){c=f.slice(0,e).join("/");if(i)for(m=i.length;0<m;m-=1)if(b=l(n,i.slice(0,m).join("/")))if(b=l(b,c)){g=b;d=e;break}if(g)break;!h&&(p&&l(p,c))&&(h=l(p,c),j=e)}!g&&
h&&(g=h,d=j);g&&(f.splice(0,d,g),a=f.join("/"))}return a}function d(a){z&&y(document.getElementsByTagName("script"),function(f){if(f.getAttribute("data-requiremodule")===a&&f.getAttribute("data-requirecontext")===i.contextName)return f.parentNode.removeChild(f),!0})}function h(a){var f=l(k.paths,a);if(f&&I(f)&&1<f.length)return d(a),f.shift(),i.require.undef(a),i.require([a]),!0}function $(a){var f,b=a?a.indexOf("!"):-1;-1<b&&(f=a.substring(0,b),a=a.substring(b+1,a.length));return[f,a]}function n(a,
f,b,e){var m,B,g=null,d=f?f.name:null,h=a,j=!0,k="";a||(j=!1,a="_@r"+(L+=1));a=$(a);g=a[0];a=a[1];g&&(g=c(g,d,e),B=l(r,g));a&&(g?k=B&&B.normalize?B.normalize(a,function(a){return c(a,d,e)}):c(a,d,e):(k=c(a,d,e),a=$(k),g=a[0],k=a[1],b=!0,m=i.nameToUrl(k)));b=g&&!B&&!b?"_unnormalized"+(M+=1):"";return{prefix:g,name:k,parentMap:f,unnormalized:!!b,url:m,originalName:h,isDefine:j,id:(g?g+"!"+k:k)+b}}function q(a){var f=a.id,b=l(p,f);b||(b=p[f]=new i.Module(a));return b}function t(a,f,b){var e=a.id,m=l(p,
e);if(s(r,e)&&(!m||m.defineEmitComplete))"defined"===f&&b(r[e]);else if(m=q(a),m.error&&"error"===f)b(m.error);else m.on(f,b)}function v(a,f){var b=a.requireModules,e=!1;if(f)f(a);else if(y(b,function(f){if(f=l(p,f))f.error=a,f.events.error&&(e=!0,f.emit("error",a))}),!e)j.onError(a)}function w(){R.length&&(ia.apply(G,[G.length-1,0].concat(R)),R=[])}function x(a){delete p[a];delete T[a]}function E(a,f,b){var e=a.map.id;a.error?a.emit("error",a.error):(f[e]=!0,y(a.depMaps,function(e,c){var g=e.id,
d=l(p,g);d&&(!a.depMatched[c]&&!b[g])&&(l(f,g)?(a.defineDep(c,r[g]),a.check()):E(d,f,b))}),b[e]=!0)}function C(){var a,f,b,e,m=(b=1E3*k.waitSeconds)&&i.startTime+b<(new Date).getTime(),c=[],g=[],j=!1,l=!0;if(!U){U=!0;F(T,function(b){a=b.map;f=a.id;if(b.enabled&&(a.isDefine||g.push(b),!b.error))if(!b.inited&&m)h(f)?j=e=!0:(c.push(f),d(f));else if(!b.inited&&(b.fetched&&a.isDefine)&&(j=!0,!a.prefix))return l=!1});if(m&&c.length)return b=A("timeout","Load timeout for modules: "+c,null,c),b.contextName=
i.contextName,v(b);l&&y(g,function(a){E(a,{},{})});if((!m||e)&&j)if((z||da)&&!V)V=setTimeout(function(){V=0;C()},50);U=!1}}function D(a){s(r,a[0])||q(n(a[0],null,!0)).init(a[1],a[2])}function J(a){var a=a.currentTarget||a.srcElement,b=i.onScriptLoad;a.detachEvent&&!W?a.detachEvent("onreadystatechange",b):a.removeEventListener("load",b,!1);b=i.onScriptError;(!a.detachEvent||W)&&a.removeEventListener("error",b,!1);return{node:a,id:a&&a.getAttribute("data-requiremodule")}}function K(){var a;for(w();G.length;){a=
G.shift();if(null===a[0])return v(A("mismatch","Mismatched anonymous define() module: "+a[a.length-1]));D(a)}}var U,X,i,N,V,k={waitSeconds:7,baseUrl:"./",paths:{},pkgs:{},shim:{},config:{}},p={},T={},Y={},G=[],r={},S={},L=1,M=1;N={require:function(a){return a.require?a.require:a.require=i.makeRequire(a.map)},exports:function(a){a.usingExports=!0;if(a.map.isDefine)return a.exports?a.exports:a.exports=r[a.map.id]={}},module:function(a){return a.module?a.module:a.module={id:a.map.id,uri:a.map.url,config:function(){var b=
l(k.pkgs,a.map.id);return(b?l(k.config,a.map.id+"/"+b.main):l(k.config,a.map.id))||{}},exports:r[a.map.id]}}};X=function(a){this.events=l(Y,a.id)||{};this.map=a;this.shim=l(k.shim,a.id);this.depExports=[];this.depMaps=[];this.depMatched=[];this.pluginMaps={};this.depCount=0};X.prototype={init:function(a,b,c,e){e=e||{};if(!this.inited){this.factory=b;if(c)this.on("error",c);else this.events.error&&(c=u(this,function(a){this.emit("error",a)}));this.depMaps=a&&a.slice(0);this.errback=c;this.inited=!0;
this.ignore=e.ignore;e.enabled||this.enabled?this.enable():this.check()}},defineDep:function(a,b){this.depMatched[a]||(this.depMatched[a]=!0,this.depCount-=1,this.depExports[a]=b)},fetch:function(){if(!this.fetched){this.fetched=!0;i.startTime=(new Date).getTime();var a=this.map;if(this.shim)i.makeRequire(this.map,{enableBuildCallback:!0})(this.shim.deps||[],u(this,function(){return a.prefix?this.callPlugin():this.load()}));else return a.prefix?this.callPlugin():this.load()}},load:function(){var a=
this.map.url;S[a]||(S[a]=!0,i.load(this.map.id,a))},check:function(){if(this.enabled&&!this.enabling){var a,b,c=this.map.id;b=this.depExports;var e=this.exports,m=this.factory;if(this.inited)if(this.error)this.emit("error",this.error);else{if(!this.defining){this.defining=!0;if(1>this.depCount&&!this.defined){if(H(m)){if(this.events.error&&this.map.isDefine||j.onError!==aa)try{e=i.execCb(c,m,b,e)}catch(d){a=d}else e=i.execCb(c,m,b,e);this.map.isDefine&&((b=this.module)&&void 0!==b.exports&&b.exports!==
this.exports?e=b.exports:void 0===e&&this.usingExports&&(e=this.exports));if(a)return a.requireMap=this.map,a.requireModules=this.map.isDefine?[this.map.id]:null,a.requireType=this.map.isDefine?"define":"require",v(this.error=a)}else e=m;this.exports=e;if(this.map.isDefine&&!this.ignore&&(r[c]=e,j.onResourceLoad))j.onResourceLoad(i,this.map,this.depMaps);x(c);this.defined=!0}this.defining=!1;this.defined&&!this.defineEmitted&&(this.defineEmitted=!0,this.emit("defined",this.exports),this.defineEmitComplete=
!0)}}else this.fetch()}},callPlugin:function(){var a=this.map,b=a.id,d=n(a.prefix);this.depMaps.push(d);t(d,"defined",u(this,function(e){var m,d;d=this.map.name;var g=this.map.parentMap?this.map.parentMap.name:null,h=i.makeRequire(a.parentMap,{enableBuildCallback:!0});if(this.map.unnormalized){if(e.normalize&&(d=e.normalize(d,function(a){return c(a,g,!0)})||""),e=n(a.prefix+"!"+d,this.map.parentMap),t(e,"defined",u(this,function(a){this.init([],function(){return a},null,{enabled:!0,ignore:!0})})),
d=l(p,e.id)){this.depMaps.push(e);if(this.events.error)d.on("error",u(this,function(a){this.emit("error",a)}));d.enable()}}else m=u(this,function(a){this.init([],function(){return a},null,{enabled:!0})}),m.error=u(this,function(a){this.inited=!0;this.error=a;a.requireModules=[b];F(p,function(a){0===a.map.id.indexOf(b+"_unnormalized")&&x(a.map.id)});v(a)}),m.fromText=u(this,function(e,c){var d=a.name,g=n(d),B=O;c&&(e=c);B&&(O=!1);q(g);s(k.config,b)&&(k.config[d]=k.config[b]);try{j.exec(e)}catch(ca){return v(A("fromtexteval",
"fromText eval for "+b+" failed: "+ca,ca,[b]))}B&&(O=!0);this.depMaps.push(g);i.completeLoad(d);h([d],m)}),e.load(a.name,h,m,k)}));i.enable(d,this);this.pluginMaps[d.id]=d},enable:function(){T[this.map.id]=this;this.enabling=this.enabled=!0;y(this.depMaps,u(this,function(a,b){var c,e;if("string"===typeof a){a=n(a,this.map.isDefine?this.map:this.map.parentMap,!1,!this.skipMap);this.depMaps[b]=a;if(c=l(N,a.id)){this.depExports[b]=c(this);return}this.depCount+=1;t(a,"defined",u(this,function(a){this.defineDep(b,
a);this.check()}));this.errback&&t(a,"error",u(this,this.errback))}c=a.id;e=p[c];!s(N,c)&&(e&&!e.enabled)&&i.enable(a,this)}));F(this.pluginMaps,u(this,function(a){var b=l(p,a.id);b&&!b.enabled&&i.enable(a,this)}));this.enabling=!1;this.check()},on:function(a,b){var c=this.events[a];c||(c=this.events[a]=[]);c.push(b)},emit:function(a,b){y(this.events[a],function(a){a(b)});"error"===a&&delete this.events[a]}};i={config:k,contextName:b,registry:p,defined:r,urlFetched:S,defQueue:G,Module:X,makeModuleMap:n,
nextTick:j.nextTick,onError:v,configure:function(a){a.baseUrl&&"/"!==a.baseUrl.charAt(a.baseUrl.length-1)&&(a.baseUrl+="/");var b=k.pkgs,c=k.shim,e={paths:!0,config:!0,map:!0};F(a,function(a,b){e[b]?"map"===b?(k.map||(k.map={}),Q(k[b],a,!0,!0)):Q(k[b],a,!0):k[b]=a});a.shim&&(F(a.shim,function(a,b){I(a)&&(a={deps:a});if((a.exports||a.init)&&!a.exportsFn)a.exportsFn=i.makeShimExports(a);c[b]=a}),k.shim=c);a.packages&&(y(a.packages,function(a){a="string"===typeof a?{name:a}:a;b[a.name]={name:a.name,
location:a.location||a.name,main:(a.main||"main").replace(ja,"").replace(ea,"")}}),k.pkgs=b);F(p,function(a,b){!a.inited&&!a.map.unnormalized&&(a.map=n(b))});if(a.deps||a.callback)i.require(a.deps||[],a.callback)},makeShimExports:function(a){return function(){var b;a.init&&(b=a.init.apply(Z,arguments));return b||a.exports&&ba(a.exports)}},makeRequire:function(a,f){function d(e,c,h){var g,k;f.enableBuildCallback&&(c&&H(c))&&(c.__requireJsBuild=!0);if("string"===typeof e){if(H(c))return v(A("requireargs",
"Invalid require call"),h);if(a&&s(N,e))return N[e](p[a.id]);if(j.get)return j.get(i,e,a,d);g=n(e,a,!1,!0);g=g.id;return!s(r,g)?v(A("notloaded",'Module name "'+g+'" has not been loaded yet for context: '+b+(a?"":". Use require([])"))):r[g]}K();i.nextTick(function(){K();k=q(n(null,a));k.skipMap=f.skipMap;k.init(e,c,h,{enabled:!0});C()});return d}f=f||{};Q(d,{isBrowser:z,toUrl:function(b){var d,f=b.lastIndexOf("."),g=b.split("/")[0];if(-1!==f&&(!("."===g||".."===g)||1<f))d=b.substring(f,b.length),b=
b.substring(0,f);return i.nameToUrl(c(b,a&&a.id,!0),d,!0)},defined:function(b){return s(r,n(b,a,!1,!0).id)},specified:function(b){b=n(b,a,!1,!0).id;return s(r,b)||s(p,b)}});a||(d.undef=function(b){w();var c=n(b,a,!0),f=l(p,b);delete r[b];delete S[c.url];delete Y[b];f&&(f.events.defined&&(Y[b]=f.events),x(b))});return d},enable:function(a){l(p,a.id)&&q(a).enable()},completeLoad:function(a){var b,c,e=l(k.shim,a)||{},d=e.exports;for(w();G.length;){c=G.shift();if(null===c[0]){c[0]=a;if(b)break;b=!0}else c[0]===
a&&(b=!0);D(c)}c=l(p,a);if(!b&&!s(r,a)&&c&&!c.inited){if(k.enforceDefine&&(!d||!ba(d)))return h(a)?void 0:v(A("nodefine","No define call for "+a,null,[a]));D([a,e.deps||[],e.exportsFn])}C()},nameToUrl:function(a,b,c){var e,d,h,g,i,n;if(j.jsExtRegExp.test(a))g=a+(b||"");else{e=k.paths;d=k.pkgs;g=a.split("/");for(i=g.length;0<i;i-=1)if(n=g.slice(0,i).join("/"),h=l(d,n),n=l(e,n)){I(n)&&(n=n[0]);g.splice(0,i,n);break}else if(h){a=a===h.name?h.location+"/"+h.main:h.location;g.splice(0,i,a);break}g=g.join("/");
g+=b||(/\?/.test(g)||c?"":".js");g=("/"===g.charAt(0)||g.match(/^[\w\+\.\-]+:/)?"":k.baseUrl)+g}return k.urlArgs?g+((-1===g.indexOf("?")?"?":"&")+k.urlArgs):g},load:function(a,b){j.load(i,a,b)},execCb:function(a,b,c,e){return b.apply(e,c)},onScriptLoad:function(a){if("load"===a.type||ka.test((a.currentTarget||a.srcElement).readyState))P=null,a=J(a),i.completeLoad(a.id)},onScriptError:function(a){var b=J(a);if(!h(b.id))return v(A("scripterror","Script error for: "+b.id,a,[b.id]))}};i.require=i.makeRequire();
return i}var j,w,x,C,J,D,P,K,q,fa,la=/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,ma=/[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,ea=/\.js$/,ja=/^\.\//;w=Object.prototype;var L=w.toString,ga=w.hasOwnProperty,ia=Array.prototype.splice,z=!!("undefined"!==typeof window&&navigator&&window.document),da=!z&&"undefined"!==typeof importScripts,ka=z&&"PLAYSTATION 3"===navigator.platform?/^complete$/:/^(complete|loaded)$/,W="undefined"!==typeof opera&&"[object Opera]"===opera.toString(),E={},t={},R=[],O=
!1;if("undefined"===typeof define){if("undefined"!==typeof requirejs){if(H(requirejs))return;t=requirejs;requirejs=void 0}"undefined"!==typeof require&&!H(require)&&(t=require,require=void 0);j=requirejs=function(b,c,d,h){var q,n="_";!I(b)&&"string"!==typeof b&&(q=b,I(c)?(b=c,c=d,d=h):b=[]);q&&q.context&&(n=q.context);(h=l(E,n))||(h=E[n]=j.s.newContext(n));q&&h.configure(q);return h.require(b,c,d)};j.config=function(b){return j(b)};j.nextTick="undefined"!==typeof setTimeout?function(b){setTimeout(b,
4)}:function(b){b()};require||(require=j);j.version="2.1.8";j.jsExtRegExp=/^\/|:|\?|\.js$/;j.isBrowser=z;w=j.s={contexts:E,newContext:ha};j({});y(["toUrl","undef","defined","specified"],function(b){j[b]=function(){var c=E._;return c.require[b].apply(c,arguments)}});if(z&&(x=w.head=document.getElementsByTagName("head")[0],C=document.getElementsByTagName("base")[0]))x=w.head=C.parentNode;j.onError=aa;j.createNode=function(b){var c=b.xhtml?document.createElementNS("http://www.w3.org/1999/xhtml","html:script"):
document.createElement("script");c.type=b.scriptType||"text/javascript";c.charset="utf-8";c.async=!0;return c};j.load=function(b,c,d){var h=b&&b.config||{};if(z)return h=j.createNode(h,c,d),h.setAttribute("data-requirecontext",b.contextName),h.setAttribute("data-requiremodule",c),h.attachEvent&&!(h.attachEvent.toString&&0>h.attachEvent.toString().indexOf("[native code"))&&!W?(O=!0,h.attachEvent("onreadystatechange",b.onScriptLoad)):(h.addEventListener("load",b.onScriptLoad,!1),h.addEventListener("error",
b.onScriptError,!1)),h.src=d,K=h,C?x.insertBefore(h,C):x.appendChild(h),K=null,h;if(da)try{importScripts(d),b.completeLoad(c)}catch(l){b.onError(A("importscripts","importScripts failed for "+c+" at "+d,l,[c]))}};z&&M(document.getElementsByTagName("script"),function(b){x||(x=b.parentNode);if(J=b.getAttribute("data-main"))return q=J,t.baseUrl||(D=q.split("/"),q=D.pop(),fa=D.length?D.join("/")+"/":"./",t.baseUrl=fa),q=q.replace(ea,""),j.jsExtRegExp.test(q)&&(q=J),t.deps=t.deps?t.deps.concat(q):[q],!0});
define=function(b,c,d){var h,j;"string"!==typeof b&&(d=c,c=b,b=null);I(c)||(d=c,c=null);!c&&H(d)&&(c=[],d.length&&(d.toString().replace(la,"").replace(ma,function(b,d){c.push(d)}),c=(1===d.length?["require"]:["require","exports","module"]).concat(c)));if(O){if(!(h=K))P&&"interactive"===P.readyState||M(document.getElementsByTagName("script"),function(b){if("interactive"===b.readyState)return P=b}),h=P;h&&(b||(b=h.getAttribute("data-requiremodule")),j=E[h.getAttribute("data-requirecontext")])}(j?j.defQueue:
R).push([b,c,d])};define.amd={jQuery:!0};j.exec=function(b){return eval(b)};j(t)}})(this);

define("requireLib", function(){});

/**
 * @license RequireJS domReady 2.0.1 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/domReady for details
 */
/*jslint */
/*global require: false, define: false, requirejs: false,
  window: false, clearInterval: false, document: false,
  self: false, setInterval: false */


define('domReady',[],function () {
    

    var isTop, testDiv, scrollIntervalId,
        isBrowser = typeof window !== "undefined" && window.document,
        isPageLoaded = !isBrowser,
        doc = isBrowser ? document : null,
        readyCalls = [];

    function runCallbacks(callbacks) {
        var i;
        for (i = 0; i < callbacks.length; i += 1) {
            callbacks[i](doc);
        }
    }

    function callReady() {
        var callbacks = readyCalls;

        if (isPageLoaded) {
            //Call the DOM ready callbacks
            if (callbacks.length) {
                readyCalls = [];
                runCallbacks(callbacks);
            }
        }
    }

    /**
     * Sets the page as loaded.
     */
    function pageLoaded() {
        if (!isPageLoaded) {
            isPageLoaded = true;
            if (scrollIntervalId) {
                clearInterval(scrollIntervalId);
            }

            callReady();
        }
    }

    if (isBrowser) {
        if (document.addEventListener) {
            //Standards. Hooray! Assumption here that if standards based,
            //it knows about DOMContentLoaded.
            document.addEventListener("DOMContentLoaded", pageLoaded, false);
            window.addEventListener("load", pageLoaded, false);
        } else if (window.attachEvent) {
            window.attachEvent("onload", pageLoaded);

            testDiv = document.createElement('div');
            try {
                isTop = window.frameElement === null;
            } catch (e) {}

            //DOMContentLoaded approximation that uses a doScroll, as found by
            //Diego Perini: http://javascript.nwbox.com/IEContentLoaded/,
            //but modified by other contributors, including jdalton
            if (testDiv.doScroll && isTop && window.external) {
                scrollIntervalId = setInterval(function () {
                    try {
                        testDiv.doScroll();
                        pageLoaded();
                    } catch (e) {}
                }, 30);
            }
        }

        //Check if document already complete, and if so, just trigger page load
        //listeners. Latest webkit browsers also use "interactive", and
        //will fire the onDOMContentLoaded before "interactive" but not after
        //entering "interactive" or "complete". More details:
        //http://dev.w3.org/html5/spec/the-end.html#the-end
        //http://stackoverflow.com/questions/3665561/document-readystate-of-interactive-vs-ondomcontentloaded
        //Hmm, this is more complicated on further use, see "firing too early"
        //bug: https://github.com/requirejs/domReady/issues/1
        //so removing the || document.readyState === "interactive" test.
        //There is still a window.onload binding that should get fired if
        //DOMContentLoaded is missed.
        if (document.readyState === "complete") {
            pageLoaded();
        }
    }

    /** START OF PUBLIC API **/

    /**
     * Registers a callback for DOM ready. If DOM is already ready, the
     * callback is called immediately.
     * @param {Function} callback
     */
    function domReady(callback) {
        if (isPageLoaded) {
            callback(doc);
        } else {
            readyCalls.push(callback);
        }
        return domReady;
    }

    domReady.version = '2.0.1';

    /**
     * Loader Plugin API method
     */
    domReady.load = function (name, req, onLoad, config) {
        if (config.isBuild) {
            onLoad(null);
        } else {
            domReady(onLoad);
        }
    };

    /** END OF PUBLIC API **/

    return domReady;
});

/*! jQuery v2.0.3 | (c) 2005, 2013 jQuery Foundation, Inc. | jquery.org/license
//@ sourceMappingURL=jquery-2.0.3.min.map
*/
(function(e,undefined){var t,n,r=typeof undefined,i=e.location,o=e.document,s=o.documentElement,a=e.jQuery,u=e.$,l={},c=[],p="2.0.3",f=c.concat,h=c.push,d=c.slice,g=c.indexOf,m=l.toString,y=l.hasOwnProperty,v=p.trim,x=function(e,n){return new x.fn.init(e,n,t)},b=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,w=/\S+/g,T=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,C=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,k=/^-ms-/,N=/-([\da-z])/gi,E=function(e,t){return t.toUpperCase()},S=function(){o.removeEventListener("DOMContentLoaded",S,!1),e.removeEventListener("load",S,!1),x.ready()};x.fn=x.prototype={jquery:p,constructor:x,init:function(e,t,n){var r,i;if(!e)return this;if("string"==typeof e){if(r="<"===e.charAt(0)&&">"===e.charAt(e.length-1)&&e.length>=3?[null,e,null]:T.exec(e),!r||!r[1]&&t)return!t||t.jquery?(t||n).find(e):this.constructor(t).find(e);if(r[1]){if(t=t instanceof x?t[0]:t,x.merge(this,x.parseHTML(r[1],t&&t.nodeType?t.ownerDocument||t:o,!0)),C.test(r[1])&&x.isPlainObject(t))for(r in t)x.isFunction(this[r])?this[r](t[r]):this.attr(r,t[r]);return this}return i=o.getElementById(r[2]),i&&i.parentNode&&(this.length=1,this[0]=i),this.context=o,this.selector=e,this}return e.nodeType?(this.context=this[0]=e,this.length=1,this):x.isFunction(e)?n.ready(e):(e.selector!==undefined&&(this.selector=e.selector,this.context=e.context),x.makeArray(e,this))},selector:"",length:0,toArray:function(){return d.call(this)},get:function(e){return null==e?this.toArray():0>e?this[this.length+e]:this[e]},pushStack:function(e){var t=x.merge(this.constructor(),e);return t.prevObject=this,t.context=this.context,t},each:function(e,t){return x.each(this,e,t)},ready:function(e){return x.ready.promise().done(e),this},slice:function(){return this.pushStack(d.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(0>e?t:0);return this.pushStack(n>=0&&t>n?[this[n]]:[])},map:function(e){return this.pushStack(x.map(this,function(t,n){return e.call(t,n,t)}))},end:function(){return this.prevObject||this.constructor(null)},push:h,sort:[].sort,splice:[].splice},x.fn.init.prototype=x.fn,x.extend=x.fn.extend=function(){var e,t,n,r,i,o,s=arguments[0]||{},a=1,u=arguments.length,l=!1;for("boolean"==typeof s&&(l=s,s=arguments[1]||{},a=2),"object"==typeof s||x.isFunction(s)||(s={}),u===a&&(s=this,--a);u>a;a++)if(null!=(e=arguments[a]))for(t in e)n=s[t],r=e[t],s!==r&&(l&&r&&(x.isPlainObject(r)||(i=x.isArray(r)))?(i?(i=!1,o=n&&x.isArray(n)?n:[]):o=n&&x.isPlainObject(n)?n:{},s[t]=x.extend(l,o,r)):r!==undefined&&(s[t]=r));return s},x.extend({expando:"jQuery"+(p+Math.random()).replace(/\D/g,""),noConflict:function(t){return e.$===x&&(e.$=u),t&&e.jQuery===x&&(e.jQuery=a),x},isReady:!1,readyWait:1,holdReady:function(e){e?x.readyWait++:x.ready(!0)},ready:function(e){(e===!0?--x.readyWait:x.isReady)||(x.isReady=!0,e!==!0&&--x.readyWait>0||(n.resolveWith(o,[x]),x.fn.trigger&&x(o).trigger("ready").off("ready")))},isFunction:function(e){return"function"===x.type(e)},isArray:Array.isArray,isWindow:function(e){return null!=e&&e===e.window},isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},type:function(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?l[m.call(e)]||"object":typeof e},isPlainObject:function(e){if("object"!==x.type(e)||e.nodeType||x.isWindow(e))return!1;try{if(e.constructor&&!y.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(t){return!1}return!0},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},error:function(e){throw Error(e)},parseHTML:function(e,t,n){if(!e||"string"!=typeof e)return null;"boolean"==typeof t&&(n=t,t=!1),t=t||o;var r=C.exec(e),i=!n&&[];return r?[t.createElement(r[1])]:(r=x.buildFragment([e],t,i),i&&x(i).remove(),x.merge([],r.childNodes))},parseJSON:JSON.parse,parseXML:function(e){var t,n;if(!e||"string"!=typeof e)return null;try{n=new DOMParser,t=n.parseFromString(e,"text/xml")}catch(r){t=undefined}return(!t||t.getElementsByTagName("parsererror").length)&&x.error("Invalid XML: "+e),t},noop:function(){},globalEval:function(e){var t,n=eval;e=x.trim(e),e&&(1===e.indexOf("use strict")?(t=o.createElement("script"),t.text=e,o.head.appendChild(t).parentNode.removeChild(t)):n(e))},camelCase:function(e){return e.replace(k,"ms-").replace(N,E)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,t,n){var r,i=0,o=e.length,s=j(e);if(n){if(s){for(;o>i;i++)if(r=t.apply(e[i],n),r===!1)break}else for(i in e)if(r=t.apply(e[i],n),r===!1)break}else if(s){for(;o>i;i++)if(r=t.call(e[i],i,e[i]),r===!1)break}else for(i in e)if(r=t.call(e[i],i,e[i]),r===!1)break;return e},trim:function(e){return null==e?"":v.call(e)},makeArray:function(e,t){var n=t||[];return null!=e&&(j(Object(e))?x.merge(n,"string"==typeof e?[e]:e):h.call(n,e)),n},inArray:function(e,t,n){return null==t?-1:g.call(t,e,n)},merge:function(e,t){var n=t.length,r=e.length,i=0;if("number"==typeof n)for(;n>i;i++)e[r++]=t[i];else while(t[i]!==undefined)e[r++]=t[i++];return e.length=r,e},grep:function(e,t,n){var r,i=[],o=0,s=e.length;for(n=!!n;s>o;o++)r=!!t(e[o],o),n!==r&&i.push(e[o]);return i},map:function(e,t,n){var r,i=0,o=e.length,s=j(e),a=[];if(s)for(;o>i;i++)r=t(e[i],i,n),null!=r&&(a[a.length]=r);else for(i in e)r=t(e[i],i,n),null!=r&&(a[a.length]=r);return f.apply([],a)},guid:1,proxy:function(e,t){var n,r,i;return"string"==typeof t&&(n=e[t],t=e,e=n),x.isFunction(e)?(r=d.call(arguments,2),i=function(){return e.apply(t||this,r.concat(d.call(arguments)))},i.guid=e.guid=e.guid||x.guid++,i):undefined},access:function(e,t,n,r,i,o,s){var a=0,u=e.length,l=null==n;if("object"===x.type(n)){i=!0;for(a in n)x.access(e,t,a,n[a],!0,o,s)}else if(r!==undefined&&(i=!0,x.isFunction(r)||(s=!0),l&&(s?(t.call(e,r),t=null):(l=t,t=function(e,t,n){return l.call(x(e),n)})),t))for(;u>a;a++)t(e[a],n,s?r:r.call(e[a],a,t(e[a],n)));return i?e:l?t.call(e):u?t(e[0],n):o},now:Date.now,swap:function(e,t,n,r){var i,o,s={};for(o in t)s[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=s[o];return i}}),x.ready.promise=function(t){return n||(n=x.Deferred(),"complete"===o.readyState?setTimeout(x.ready):(o.addEventListener("DOMContentLoaded",S,!1),e.addEventListener("load",S,!1))),n.promise(t)},x.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(e,t){l["[object "+t+"]"]=t.toLowerCase()});function j(e){var t=e.length,n=x.type(e);return x.isWindow(e)?!1:1===e.nodeType&&t?!0:"array"===n||"function"!==n&&(0===t||"number"==typeof t&&t>0&&t-1 in e)}t=x(o),function(e,undefined){var t,n,r,i,o,s,a,u,l,c,p,f,h,d,g,m,y,v="sizzle"+-new Date,b=e.document,w=0,T=0,C=st(),k=st(),N=st(),E=!1,S=function(e,t){return e===t?(E=!0,0):0},j=typeof undefined,D=1<<31,A={}.hasOwnProperty,L=[],q=L.pop,H=L.push,O=L.push,F=L.slice,P=L.indexOf||function(e){var t=0,n=this.length;for(;n>t;t++)if(this[t]===e)return t;return-1},R="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",M="[\\x20\\t\\r\\n\\f]",W="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",$=W.replace("w","w#"),B="\\["+M+"*("+W+")"+M+"*(?:([*^$|!~]?=)"+M+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+$+")|)|)"+M+"*\\]",I=":("+W+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+B.replace(3,8)+")*)|.*)\\)|)",z=RegExp("^"+M+"+|((?:^|[^\\\\])(?:\\\\.)*)"+M+"+$","g"),_=RegExp("^"+M+"*,"+M+"*"),X=RegExp("^"+M+"*([>+~]|"+M+")"+M+"*"),U=RegExp(M+"*[+~]"),Y=RegExp("="+M+"*([^\\]'\"]*)"+M+"*\\]","g"),V=RegExp(I),G=RegExp("^"+$+"$"),J={ID:RegExp("^#("+W+")"),CLASS:RegExp("^\\.("+W+")"),TAG:RegExp("^("+W.replace("w","w*")+")"),ATTR:RegExp("^"+B),PSEUDO:RegExp("^"+I),CHILD:RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+M+"*(even|odd|(([+-]|)(\\d*)n|)"+M+"*(?:([+-]|)"+M+"*(\\d+)|))"+M+"*\\)|)","i"),bool:RegExp("^(?:"+R+")$","i"),needsContext:RegExp("^"+M+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+M+"*((?:-\\d)?\\d*)"+M+"*\\)|)(?=[^-]|$)","i")},Q=/^[^{]+\{\s*\[native \w/,K=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,Z=/^(?:input|select|textarea|button)$/i,et=/^h\d$/i,tt=/'|\\/g,nt=RegExp("\\\\([\\da-f]{1,6}"+M+"?|("+M+")|.)","ig"),rt=function(e,t,n){var r="0x"+t-65536;return r!==r||n?t:0>r?String.fromCharCode(r+65536):String.fromCharCode(55296|r>>10,56320|1023&r)};try{O.apply(L=F.call(b.childNodes),b.childNodes),L[b.childNodes.length].nodeType}catch(it){O={apply:L.length?function(e,t){H.apply(e,F.call(t))}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1}}}function ot(e,t,r,i){var o,s,a,u,l,f,g,m,x,w;if((t?t.ownerDocument||t:b)!==p&&c(t),t=t||p,r=r||[],!e||"string"!=typeof e)return r;if(1!==(u=t.nodeType)&&9!==u)return[];if(h&&!i){if(o=K.exec(e))if(a=o[1]){if(9===u){if(s=t.getElementById(a),!s||!s.parentNode)return r;if(s.id===a)return r.push(s),r}else if(t.ownerDocument&&(s=t.ownerDocument.getElementById(a))&&y(t,s)&&s.id===a)return r.push(s),r}else{if(o[2])return O.apply(r,t.getElementsByTagName(e)),r;if((a=o[3])&&n.getElementsByClassName&&t.getElementsByClassName)return O.apply(r,t.getElementsByClassName(a)),r}if(n.qsa&&(!d||!d.test(e))){if(m=g=v,x=t,w=9===u&&e,1===u&&"object"!==t.nodeName.toLowerCase()){f=gt(e),(g=t.getAttribute("id"))?m=g.replace(tt,"\\$&"):t.setAttribute("id",m),m="[id='"+m+"'] ",l=f.length;while(l--)f[l]=m+mt(f[l]);x=U.test(e)&&t.parentNode||t,w=f.join(",")}if(w)try{return O.apply(r,x.querySelectorAll(w)),r}catch(T){}finally{g||t.removeAttribute("id")}}}return kt(e.replace(z,"$1"),t,r,i)}function st(){var e=[];function t(n,r){return e.push(n+=" ")>i.cacheLength&&delete t[e.shift()],t[n]=r}return t}function at(e){return e[v]=!0,e}function ut(e){var t=p.createElement("div");try{return!!e(t)}catch(n){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function lt(e,t){var n=e.split("|"),r=e.length;while(r--)i.attrHandle[n[r]]=t}function ct(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&(~t.sourceIndex||D)-(~e.sourceIndex||D);if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function pt(e){return function(t){var n=t.nodeName.toLowerCase();return"input"===n&&t.type===e}}function ft(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function ht(e){return at(function(t){return t=+t,at(function(n,r){var i,o=e([],n.length,t),s=o.length;while(s--)n[i=o[s]]&&(n[i]=!(r[i]=n[i]))})})}s=ot.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return t?"HTML"!==t.nodeName:!1},n=ot.support={},c=ot.setDocument=function(e){var t=e?e.ownerDocument||e:b,r=t.defaultView;return t!==p&&9===t.nodeType&&t.documentElement?(p=t,f=t.documentElement,h=!s(t),r&&r.attachEvent&&r!==r.top&&r.attachEvent("onbeforeunload",function(){c()}),n.attributes=ut(function(e){return e.className="i",!e.getAttribute("className")}),n.getElementsByTagName=ut(function(e){return e.appendChild(t.createComment("")),!e.getElementsByTagName("*").length}),n.getElementsByClassName=ut(function(e){return e.innerHTML="<div class='a'></div><div class='a i'></div>",e.firstChild.className="i",2===e.getElementsByClassName("i").length}),n.getById=ut(function(e){return f.appendChild(e).id=v,!t.getElementsByName||!t.getElementsByName(v).length}),n.getById?(i.find.ID=function(e,t){if(typeof t.getElementById!==j&&h){var n=t.getElementById(e);return n&&n.parentNode?[n]:[]}},i.filter.ID=function(e){var t=e.replace(nt,rt);return function(e){return e.getAttribute("id")===t}}):(delete i.find.ID,i.filter.ID=function(e){var t=e.replace(nt,rt);return function(e){var n=typeof e.getAttributeNode!==j&&e.getAttributeNode("id");return n&&n.value===t}}),i.find.TAG=n.getElementsByTagName?function(e,t){return typeof t.getElementsByTagName!==j?t.getElementsByTagName(e):undefined}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},i.find.CLASS=n.getElementsByClassName&&function(e,t){return typeof t.getElementsByClassName!==j&&h?t.getElementsByClassName(e):undefined},g=[],d=[],(n.qsa=Q.test(t.querySelectorAll))&&(ut(function(e){e.innerHTML="<select><option selected=''></option></select>",e.querySelectorAll("[selected]").length||d.push("\\["+M+"*(?:value|"+R+")"),e.querySelectorAll(":checked").length||d.push(":checked")}),ut(function(e){var n=t.createElement("input");n.setAttribute("type","hidden"),e.appendChild(n).setAttribute("t",""),e.querySelectorAll("[t^='']").length&&d.push("[*^$]="+M+"*(?:''|\"\")"),e.querySelectorAll(":enabled").length||d.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),d.push(",.*:")})),(n.matchesSelector=Q.test(m=f.webkitMatchesSelector||f.mozMatchesSelector||f.oMatchesSelector||f.msMatchesSelector))&&ut(function(e){n.disconnectedMatch=m.call(e,"div"),m.call(e,"[s!='']:x"),g.push("!=",I)}),d=d.length&&RegExp(d.join("|")),g=g.length&&RegExp(g.join("|")),y=Q.test(f.contains)||f.compareDocumentPosition?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},S=f.compareDocumentPosition?function(e,r){if(e===r)return E=!0,0;var i=r.compareDocumentPosition&&e.compareDocumentPosition&&e.compareDocumentPosition(r);return i?1&i||!n.sortDetached&&r.compareDocumentPosition(e)===i?e===t||y(b,e)?-1:r===t||y(b,r)?1:l?P.call(l,e)-P.call(l,r):0:4&i?-1:1:e.compareDocumentPosition?-1:1}:function(e,n){var r,i=0,o=e.parentNode,s=n.parentNode,a=[e],u=[n];if(e===n)return E=!0,0;if(!o||!s)return e===t?-1:n===t?1:o?-1:s?1:l?P.call(l,e)-P.call(l,n):0;if(o===s)return ct(e,n);r=e;while(r=r.parentNode)a.unshift(r);r=n;while(r=r.parentNode)u.unshift(r);while(a[i]===u[i])i++;return i?ct(a[i],u[i]):a[i]===b?-1:u[i]===b?1:0},t):p},ot.matches=function(e,t){return ot(e,null,null,t)},ot.matchesSelector=function(e,t){if((e.ownerDocument||e)!==p&&c(e),t=t.replace(Y,"='$1']"),!(!n.matchesSelector||!h||g&&g.test(t)||d&&d.test(t)))try{var r=m.call(e,t);if(r||n.disconnectedMatch||e.document&&11!==e.document.nodeType)return r}catch(i){}return ot(t,p,null,[e]).length>0},ot.contains=function(e,t){return(e.ownerDocument||e)!==p&&c(e),y(e,t)},ot.attr=function(e,t){(e.ownerDocument||e)!==p&&c(e);var r=i.attrHandle[t.toLowerCase()],o=r&&A.call(i.attrHandle,t.toLowerCase())?r(e,t,!h):undefined;return o===undefined?n.attributes||!h?e.getAttribute(t):(o=e.getAttributeNode(t))&&o.specified?o.value:null:o},ot.error=function(e){throw Error("Syntax error, unrecognized expression: "+e)},ot.uniqueSort=function(e){var t,r=[],i=0,o=0;if(E=!n.detectDuplicates,l=!n.sortStable&&e.slice(0),e.sort(S),E){while(t=e[o++])t===e[o]&&(i=r.push(o));while(i--)e.splice(r[i],1)}return e},o=ot.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=o(e)}else if(3===i||4===i)return e.nodeValue}else for(;t=e[r];r++)n+=o(t);return n},i=ot.selectors={cacheLength:50,createPseudo:at,match:J,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(nt,rt),e[3]=(e[4]||e[5]||"").replace(nt,rt),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||ot.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&ot.error(e[0]),e},PSEUDO:function(e){var t,n=!e[5]&&e[2];return J.CHILD.test(e[0])?null:(e[3]&&e[4]!==undefined?e[2]=e[4]:n&&V.test(n)&&(t=gt(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(nt,rt).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=C[e+" "];return t||(t=RegExp("(^|"+M+")"+e+"("+M+"|$)"))&&C(e,function(e){return t.test("string"==typeof e.className&&e.className||typeof e.getAttribute!==j&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var i=ot.attr(r,e);return null==i?"!="===t:t?(i+="","="===t?i===n:"!="===t?i!==n:"^="===t?n&&0===i.indexOf(n):"*="===t?n&&i.indexOf(n)>-1:"$="===t?n&&i.slice(-n.length)===n:"~="===t?(" "+i+" ").indexOf(n)>-1:"|="===t?i===n||i.slice(0,n.length+1)===n+"-":!1):!0}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),s="last"!==e.slice(-4),a="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,u){var l,c,p,f,h,d,g=o!==s?"nextSibling":"previousSibling",m=t.parentNode,y=a&&t.nodeName.toLowerCase(),x=!u&&!a;if(m){if(o){while(g){p=t;while(p=p[g])if(a?p.nodeName.toLowerCase()===y:1===p.nodeType)return!1;d=g="only"===e&&!d&&"nextSibling"}return!0}if(d=[s?m.firstChild:m.lastChild],s&&x){c=m[v]||(m[v]={}),l=c[e]||[],h=l[0]===w&&l[1],f=l[0]===w&&l[2],p=h&&m.childNodes[h];while(p=++h&&p&&p[g]||(f=h=0)||d.pop())if(1===p.nodeType&&++f&&p===t){c[e]=[w,h,f];break}}else if(x&&(l=(t[v]||(t[v]={}))[e])&&l[0]===w)f=l[1];else while(p=++h&&p&&p[g]||(f=h=0)||d.pop())if((a?p.nodeName.toLowerCase()===y:1===p.nodeType)&&++f&&(x&&((p[v]||(p[v]={}))[e]=[w,f]),p===t))break;return f-=i,f===r||0===f%r&&f/r>=0}}},PSEUDO:function(e,t){var n,r=i.pseudos[e]||i.setFilters[e.toLowerCase()]||ot.error("unsupported pseudo: "+e);return r[v]?r(t):r.length>1?(n=[e,e,"",t],i.setFilters.hasOwnProperty(e.toLowerCase())?at(function(e,n){var i,o=r(e,t),s=o.length;while(s--)i=P.call(e,o[s]),e[i]=!(n[i]=o[s])}):function(e){return r(e,0,n)}):r}},pseudos:{not:at(function(e){var t=[],n=[],r=a(e.replace(z,"$1"));return r[v]?at(function(e,t,n,i){var o,s=r(e,null,i,[]),a=e.length;while(a--)(o=s[a])&&(e[a]=!(t[a]=o))}):function(e,i,o){return t[0]=e,r(t,null,o,n),!n.pop()}}),has:at(function(e){return function(t){return ot(e,t).length>0}}),contains:at(function(e){return function(t){return(t.textContent||t.innerText||o(t)).indexOf(e)>-1}}),lang:at(function(e){return G.test(e||"")||ot.error("unsupported lang: "+e),e=e.replace(nt,rt).toLowerCase(),function(t){var n;do if(n=h?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return n=n.toLowerCase(),n===e||0===n.indexOf(e+"-");while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===f},focus:function(e){return e===p.activeElement&&(!p.hasFocus||p.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeName>"@"||3===e.nodeType||4===e.nodeType)return!1;return!0},parent:function(e){return!i.pseudos.empty(e)},header:function(e){return et.test(e.nodeName)},input:function(e){return Z.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||t.toLowerCase()===e.type)},first:ht(function(){return[0]}),last:ht(function(e,t){return[t-1]}),eq:ht(function(e,t,n){return[0>n?n+t:n]}),even:ht(function(e,t){var n=0;for(;t>n;n+=2)e.push(n);return e}),odd:ht(function(e,t){var n=1;for(;t>n;n+=2)e.push(n);return e}),lt:ht(function(e,t,n){var r=0>n?n+t:n;for(;--r>=0;)e.push(r);return e}),gt:ht(function(e,t,n){var r=0>n?n+t:n;for(;t>++r;)e.push(r);return e})}},i.pseudos.nth=i.pseudos.eq;for(t in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})i.pseudos[t]=pt(t);for(t in{submit:!0,reset:!0})i.pseudos[t]=ft(t);function dt(){}dt.prototype=i.filters=i.pseudos,i.setFilters=new dt;function gt(e,t){var n,r,o,s,a,u,l,c=k[e+" "];if(c)return t?0:c.slice(0);a=e,u=[],l=i.preFilter;while(a){(!n||(r=_.exec(a)))&&(r&&(a=a.slice(r[0].length)||a),u.push(o=[])),n=!1,(r=X.exec(a))&&(n=r.shift(),o.push({value:n,type:r[0].replace(z," ")}),a=a.slice(n.length));for(s in i.filter)!(r=J[s].exec(a))||l[s]&&!(r=l[s](r))||(n=r.shift(),o.push({value:n,type:s,matches:r}),a=a.slice(n.length));if(!n)break}return t?a.length:a?ot.error(e):k(e,u).slice(0)}function mt(e){var t=0,n=e.length,r="";for(;n>t;t++)r+=e[t].value;return r}function yt(e,t,n){var i=t.dir,o=n&&"parentNode"===i,s=T++;return t.first?function(t,n,r){while(t=t[i])if(1===t.nodeType||o)return e(t,n,r)}:function(t,n,a){var u,l,c,p=w+" "+s;if(a){while(t=t[i])if((1===t.nodeType||o)&&e(t,n,a))return!0}else while(t=t[i])if(1===t.nodeType||o)if(c=t[v]||(t[v]={}),(l=c[i])&&l[0]===p){if((u=l[1])===!0||u===r)return u===!0}else if(l=c[i]=[p],l[1]=e(t,n,a)||r,l[1]===!0)return!0}}function vt(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function xt(e,t,n,r,i){var o,s=[],a=0,u=e.length,l=null!=t;for(;u>a;a++)(o=e[a])&&(!n||n(o,r,i))&&(s.push(o),l&&t.push(a));return s}function bt(e,t,n,r,i,o){return r&&!r[v]&&(r=bt(r)),i&&!i[v]&&(i=bt(i,o)),at(function(o,s,a,u){var l,c,p,f=[],h=[],d=s.length,g=o||Ct(t||"*",a.nodeType?[a]:a,[]),m=!e||!o&&t?g:xt(g,f,e,a,u),y=n?i||(o?e:d||r)?[]:s:m;if(n&&n(m,y,a,u),r){l=xt(y,h),r(l,[],a,u),c=l.length;while(c--)(p=l[c])&&(y[h[c]]=!(m[h[c]]=p))}if(o){if(i||e){if(i){l=[],c=y.length;while(c--)(p=y[c])&&l.push(m[c]=p);i(null,y=[],l,u)}c=y.length;while(c--)(p=y[c])&&(l=i?P.call(o,p):f[c])>-1&&(o[l]=!(s[l]=p))}}else y=xt(y===s?y.splice(d,y.length):y),i?i(null,s,y,u):O.apply(s,y)})}function wt(e){var t,n,r,o=e.length,s=i.relative[e[0].type],a=s||i.relative[" "],l=s?1:0,c=yt(function(e){return e===t},a,!0),p=yt(function(e){return P.call(t,e)>-1},a,!0),f=[function(e,n,r){return!s&&(r||n!==u)||((t=n).nodeType?c(e,n,r):p(e,n,r))}];for(;o>l;l++)if(n=i.relative[e[l].type])f=[yt(vt(f),n)];else{if(n=i.filter[e[l].type].apply(null,e[l].matches),n[v]){for(r=++l;o>r;r++)if(i.relative[e[r].type])break;return bt(l>1&&vt(f),l>1&&mt(e.slice(0,l-1).concat({value:" "===e[l-2].type?"*":""})).replace(z,"$1"),n,r>l&&wt(e.slice(l,r)),o>r&&wt(e=e.slice(r)),o>r&&mt(e))}f.push(n)}return vt(f)}function Tt(e,t){var n=0,o=t.length>0,s=e.length>0,a=function(a,l,c,f,h){var d,g,m,y=[],v=0,x="0",b=a&&[],T=null!=h,C=u,k=a||s&&i.find.TAG("*",h&&l.parentNode||l),N=w+=null==C?1:Math.random()||.1;for(T&&(u=l!==p&&l,r=n);null!=(d=k[x]);x++){if(s&&d){g=0;while(m=e[g++])if(m(d,l,c)){f.push(d);break}T&&(w=N,r=++n)}o&&((d=!m&&d)&&v--,a&&b.push(d))}if(v+=x,o&&x!==v){g=0;while(m=t[g++])m(b,y,l,c);if(a){if(v>0)while(x--)b[x]||y[x]||(y[x]=q.call(f));y=xt(y)}O.apply(f,y),T&&!a&&y.length>0&&v+t.length>1&&ot.uniqueSort(f)}return T&&(w=N,u=C),b};return o?at(a):a}a=ot.compile=function(e,t){var n,r=[],i=[],o=N[e+" "];if(!o){t||(t=gt(e)),n=t.length;while(n--)o=wt(t[n]),o[v]?r.push(o):i.push(o);o=N(e,Tt(i,r))}return o};function Ct(e,t,n){var r=0,i=t.length;for(;i>r;r++)ot(e,t[r],n);return n}function kt(e,t,r,o){var s,u,l,c,p,f=gt(e);if(!o&&1===f.length){if(u=f[0]=f[0].slice(0),u.length>2&&"ID"===(l=u[0]).type&&n.getById&&9===t.nodeType&&h&&i.relative[u[1].type]){if(t=(i.find.ID(l.matches[0].replace(nt,rt),t)||[])[0],!t)return r;e=e.slice(u.shift().value.length)}s=J.needsContext.test(e)?0:u.length;while(s--){if(l=u[s],i.relative[c=l.type])break;if((p=i.find[c])&&(o=p(l.matches[0].replace(nt,rt),U.test(u[0].type)&&t.parentNode||t))){if(u.splice(s,1),e=o.length&&mt(u),!e)return O.apply(r,o),r;break}}}return a(e,f)(o,t,!h,r,U.test(e)),r}n.sortStable=v.split("").sort(S).join("")===v,n.detectDuplicates=E,c(),n.sortDetached=ut(function(e){return 1&e.compareDocumentPosition(p.createElement("div"))}),ut(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||lt("type|href|height|width",function(e,t,n){return n?undefined:e.getAttribute(t,"type"===t.toLowerCase()?1:2)}),n.attributes&&ut(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||lt("value",function(e,t,n){return n||"input"!==e.nodeName.toLowerCase()?undefined:e.defaultValue}),ut(function(e){return null==e.getAttribute("disabled")})||lt(R,function(e,t,n){var r;return n?undefined:(r=e.getAttributeNode(t))&&r.specified?r.value:e[t]===!0?t.toLowerCase():null}),x.find=ot,x.expr=ot.selectors,x.expr[":"]=x.expr.pseudos,x.unique=ot.uniqueSort,x.text=ot.getText,x.isXMLDoc=ot.isXML,x.contains=ot.contains}(e);var D={};function A(e){var t=D[e]={};return x.each(e.match(w)||[],function(e,n){t[n]=!0}),t}x.Callbacks=function(e){e="string"==typeof e?D[e]||A(e):x.extend({},e);var t,n,r,i,o,s,a=[],u=!e.once&&[],l=function(p){for(t=e.memory&&p,n=!0,s=i||0,i=0,o=a.length,r=!0;a&&o>s;s++)if(a[s].apply(p[0],p[1])===!1&&e.stopOnFalse){t=!1;break}r=!1,a&&(u?u.length&&l(u.shift()):t?a=[]:c.disable())},c={add:function(){if(a){var n=a.length;(function s(t){x.each(t,function(t,n){var r=x.type(n);"function"===r?e.unique&&c.has(n)||a.push(n):n&&n.length&&"string"!==r&&s(n)})})(arguments),r?o=a.length:t&&(i=n,l(t))}return this},remove:function(){return a&&x.each(arguments,function(e,t){var n;while((n=x.inArray(t,a,n))>-1)a.splice(n,1),r&&(o>=n&&o--,s>=n&&s--)}),this},has:function(e){return e?x.inArray(e,a)>-1:!(!a||!a.length)},empty:function(){return a=[],o=0,this},disable:function(){return a=u=t=undefined,this},disabled:function(){return!a},lock:function(){return u=undefined,t||c.disable(),this},locked:function(){return!u},fireWith:function(e,t){return!a||n&&!u||(t=t||[],t=[e,t.slice?t.slice():t],r?u.push(t):l(t)),this},fire:function(){return c.fireWith(this,arguments),this},fired:function(){return!!n}};return c},x.extend({Deferred:function(e){var t=[["resolve","done",x.Callbacks("once memory"),"resolved"],["reject","fail",x.Callbacks("once memory"),"rejected"],["notify","progress",x.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments;return x.Deferred(function(n){x.each(t,function(t,o){var s=o[0],a=x.isFunction(e[t])&&e[t];i[o[1]](function(){var e=a&&a.apply(this,arguments);e&&x.isFunction(e.promise)?e.promise().done(n.resolve).fail(n.reject).progress(n.notify):n[s+"With"](this===r?n.promise():this,a?[e]:arguments)})}),e=null}).promise()},promise:function(e){return null!=e?x.extend(e,r):r}},i={};return r.pipe=r.then,x.each(t,function(e,o){var s=o[2],a=o[3];r[o[1]]=s.add,a&&s.add(function(){n=a},t[1^e][2].disable,t[2][2].lock),i[o[0]]=function(){return i[o[0]+"With"](this===i?r:this,arguments),this},i[o[0]+"With"]=s.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t=0,n=d.call(arguments),r=n.length,i=1!==r||e&&x.isFunction(e.promise)?r:0,o=1===i?e:x.Deferred(),s=function(e,t,n){return function(r){t[e]=this,n[e]=arguments.length>1?d.call(arguments):r,n===a?o.notifyWith(t,n):--i||o.resolveWith(t,n)}},a,u,l;if(r>1)for(a=Array(r),u=Array(r),l=Array(r);r>t;t++)n[t]&&x.isFunction(n[t].promise)?n[t].promise().done(s(t,l,n)).fail(o.reject).progress(s(t,u,a)):--i;return i||o.resolveWith(l,n),o.promise()}}),x.support=function(t){var n=o.createElement("input"),r=o.createDocumentFragment(),i=o.createElement("div"),s=o.createElement("select"),a=s.appendChild(o.createElement("option"));return n.type?(n.type="checkbox",t.checkOn=""!==n.value,t.optSelected=a.selected,t.reliableMarginRight=!0,t.boxSizingReliable=!0,t.pixelPosition=!1,n.checked=!0,t.noCloneChecked=n.cloneNode(!0).checked,s.disabled=!0,t.optDisabled=!a.disabled,n=o.createElement("input"),n.value="t",n.type="radio",t.radioValue="t"===n.value,n.setAttribute("checked","t"),n.setAttribute("name","t"),r.appendChild(n),t.checkClone=r.cloneNode(!0).cloneNode(!0).lastChild.checked,t.focusinBubbles="onfocusin"in e,i.style.backgroundClip="content-box",i.cloneNode(!0).style.backgroundClip="",t.clearCloneStyle="content-box"===i.style.backgroundClip,x(function(){var n,r,s="padding:0;margin:0;border:0;display:block;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box",a=o.getElementsByTagName("body")[0];a&&(n=o.createElement("div"),n.style.cssText="border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px",a.appendChild(n).appendChild(i),i.innerHTML="",i.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%",x.swap(a,null!=a.style.zoom?{zoom:1}:{},function(){t.boxSizing=4===i.offsetWidth}),e.getComputedStyle&&(t.pixelPosition="1%"!==(e.getComputedStyle(i,null)||{}).top,t.boxSizingReliable="4px"===(e.getComputedStyle(i,null)||{width:"4px"}).width,r=i.appendChild(o.createElement("div")),r.style.cssText=i.style.cssText=s,r.style.marginRight=r.style.width="0",i.style.width="1px",t.reliableMarginRight=!parseFloat((e.getComputedStyle(r,null)||{}).marginRight)),a.removeChild(n))}),t):t}({});var L,q,H=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,O=/([A-Z])/g;function F(){Object.defineProperty(this.cache={},0,{get:function(){return{}}}),this.expando=x.expando+Math.random()}F.uid=1,F.accepts=function(e){return e.nodeType?1===e.nodeType||9===e.nodeType:!0},F.prototype={key:function(e){if(!F.accepts(e))return 0;var t={},n=e[this.expando];if(!n){n=F.uid++;try{t[this.expando]={value:n},Object.defineProperties(e,t)}catch(r){t[this.expando]=n,x.extend(e,t)}}return this.cache[n]||(this.cache[n]={}),n},set:function(e,t,n){var r,i=this.key(e),o=this.cache[i];if("string"==typeof t)o[t]=n;else if(x.isEmptyObject(o))x.extend(this.cache[i],t);else for(r in t)o[r]=t[r];return o},get:function(e,t){var n=this.cache[this.key(e)];return t===undefined?n:n[t]},access:function(e,t,n){var r;return t===undefined||t&&"string"==typeof t&&n===undefined?(r=this.get(e,t),r!==undefined?r:this.get(e,x.camelCase(t))):(this.set(e,t,n),n!==undefined?n:t)},remove:function(e,t){var n,r,i,o=this.key(e),s=this.cache[o];if(t===undefined)this.cache[o]={};else{x.isArray(t)?r=t.concat(t.map(x.camelCase)):(i=x.camelCase(t),t in s?r=[t,i]:(r=i,r=r in s?[r]:r.match(w)||[])),n=r.length;while(n--)delete s[r[n]]}},hasData:function(e){return!x.isEmptyObject(this.cache[e[this.expando]]||{})},discard:function(e){e[this.expando]&&delete this.cache[e[this.expando]]}},L=new F,q=new F,x.extend({acceptData:F.accepts,hasData:function(e){return L.hasData(e)||q.hasData(e)},data:function(e,t,n){return L.access(e,t,n)},removeData:function(e,t){L.remove(e,t)},_data:function(e,t,n){return q.access(e,t,n)},_removeData:function(e,t){q.remove(e,t)}}),x.fn.extend({data:function(e,t){var n,r,i=this[0],o=0,s=null;if(e===undefined){if(this.length&&(s=L.get(i),1===i.nodeType&&!q.get(i,"hasDataAttrs"))){for(n=i.attributes;n.length>o;o++)r=n[o].name,0===r.indexOf("data-")&&(r=x.camelCase(r.slice(5)),P(i,r,s[r]));q.set(i,"hasDataAttrs",!0)}return s}return"object"==typeof e?this.each(function(){L.set(this,e)}):x.access(this,function(t){var n,r=x.camelCase(e);if(i&&t===undefined){if(n=L.get(i,e),n!==undefined)return n;if(n=L.get(i,r),n!==undefined)return n;if(n=P(i,r,undefined),n!==undefined)return n}else this.each(function(){var n=L.get(this,r);L.set(this,r,t),-1!==e.indexOf("-")&&n!==undefined&&L.set(this,e,t)})},null,t,arguments.length>1,null,!0)},removeData:function(e){return this.each(function(){L.remove(this,e)})}});function P(e,t,n){var r;if(n===undefined&&1===e.nodeType)if(r="data-"+t.replace(O,"-$1").toLowerCase(),n=e.getAttribute(r),"string"==typeof n){try{n="true"===n?!0:"false"===n?!1:"null"===n?null:+n+""===n?+n:H.test(n)?JSON.parse(n):n}catch(i){}L.set(e,t,n)}else n=undefined;return n}x.extend({queue:function(e,t,n){var r;return e?(t=(t||"fx")+"queue",r=q.get(e,t),n&&(!r||x.isArray(n)?r=q.access(e,t,x.makeArray(n)):r.push(n)),r||[]):undefined},dequeue:function(e,t){t=t||"fx";var n=x.queue(e,t),r=n.length,i=n.shift(),o=x._queueHooks(e,t),s=function(){x.dequeue(e,t)
};"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,s,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return q.get(e,n)||q.access(e,n,{empty:x.Callbacks("once memory").add(function(){q.remove(e,[t+"queue",n])})})}}),x.fn.extend({queue:function(e,t){var n=2;return"string"!=typeof e&&(t=e,e="fx",n--),n>arguments.length?x.queue(this[0],e):t===undefined?this:this.each(function(){var n=x.queue(this,e,t);x._queueHooks(this,e),"fx"===e&&"inprogress"!==n[0]&&x.dequeue(this,e)})},dequeue:function(e){return this.each(function(){x.dequeue(this,e)})},delay:function(e,t){return e=x.fx?x.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,n){var r=setTimeout(t,e);n.stop=function(){clearTimeout(r)}})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,r=1,i=x.Deferred(),o=this,s=this.length,a=function(){--r||i.resolveWith(o,[o])};"string"!=typeof e&&(t=e,e=undefined),e=e||"fx";while(s--)n=q.get(o[s],e+"queueHooks"),n&&n.empty&&(r++,n.empty.add(a));return a(),i.promise(t)}});var R,M,W=/[\t\r\n\f]/g,$=/\r/g,B=/^(?:input|select|textarea|button)$/i;x.fn.extend({attr:function(e,t){return x.access(this,x.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){x.removeAttr(this,e)})},prop:function(e,t){return x.access(this,x.prop,e,t,arguments.length>1)},removeProp:function(e){return this.each(function(){delete this[x.propFix[e]||e]})},addClass:function(e){var t,n,r,i,o,s=0,a=this.length,u="string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).addClass(e.call(this,t,this.className))});if(u)for(t=(e||"").match(w)||[];a>s;s++)if(n=this[s],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(W," "):" ")){o=0;while(i=t[o++])0>r.indexOf(" "+i+" ")&&(r+=i+" ");n.className=x.trim(r)}return this},removeClass:function(e){var t,n,r,i,o,s=0,a=this.length,u=0===arguments.length||"string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).removeClass(e.call(this,t,this.className))});if(u)for(t=(e||"").match(w)||[];a>s;s++)if(n=this[s],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(W," "):"")){o=0;while(i=t[o++])while(r.indexOf(" "+i+" ")>=0)r=r.replace(" "+i+" "," ");n.className=e?x.trim(r):""}return this},toggleClass:function(e,t){var n=typeof e;return"boolean"==typeof t&&"string"===n?t?this.addClass(e):this.removeClass(e):x.isFunction(e)?this.each(function(n){x(this).toggleClass(e.call(this,n,this.className,t),t)}):this.each(function(){if("string"===n){var t,i=0,o=x(this),s=e.match(w)||[];while(t=s[i++])o.hasClass(t)?o.removeClass(t):o.addClass(t)}else(n===r||"boolean"===n)&&(this.className&&q.set(this,"__className__",this.className),this.className=this.className||e===!1?"":q.get(this,"__className__")||"")})},hasClass:function(e){var t=" "+e+" ",n=0,r=this.length;for(;r>n;n++)if(1===this[n].nodeType&&(" "+this[n].className+" ").replace(W," ").indexOf(t)>=0)return!0;return!1},val:function(e){var t,n,r,i=this[0];{if(arguments.length)return r=x.isFunction(e),this.each(function(n){var i;1===this.nodeType&&(i=r?e.call(this,n,x(this).val()):e,null==i?i="":"number"==typeof i?i+="":x.isArray(i)&&(i=x.map(i,function(e){return null==e?"":e+""})),t=x.valHooks[this.type]||x.valHooks[this.nodeName.toLowerCase()],t&&"set"in t&&t.set(this,i,"value")!==undefined||(this.value=i))});if(i)return t=x.valHooks[i.type]||x.valHooks[i.nodeName.toLowerCase()],t&&"get"in t&&(n=t.get(i,"value"))!==undefined?n:(n=i.value,"string"==typeof n?n.replace($,""):null==n?"":n)}}}),x.extend({valHooks:{option:{get:function(e){var t=e.attributes.value;return!t||t.specified?e.value:e.text}},select:{get:function(e){var t,n,r=e.options,i=e.selectedIndex,o="select-one"===e.type||0>i,s=o?null:[],a=o?i+1:r.length,u=0>i?a:o?i:0;for(;a>u;u++)if(n=r[u],!(!n.selected&&u!==i||(x.support.optDisabled?n.disabled:null!==n.getAttribute("disabled"))||n.parentNode.disabled&&x.nodeName(n.parentNode,"optgroup"))){if(t=x(n).val(),o)return t;s.push(t)}return s},set:function(e,t){var n,r,i=e.options,o=x.makeArray(t),s=i.length;while(s--)r=i[s],(r.selected=x.inArray(x(r).val(),o)>=0)&&(n=!0);return n||(e.selectedIndex=-1),o}}},attr:function(e,t,n){var i,o,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return typeof e.getAttribute===r?x.prop(e,t,n):(1===s&&x.isXMLDoc(e)||(t=t.toLowerCase(),i=x.attrHooks[t]||(x.expr.match.bool.test(t)?M:R)),n===undefined?i&&"get"in i&&null!==(o=i.get(e,t))?o:(o=x.find.attr(e,t),null==o?undefined:o):null!==n?i&&"set"in i&&(o=i.set(e,n,t))!==undefined?o:(e.setAttribute(t,n+""),n):(x.removeAttr(e,t),undefined))},removeAttr:function(e,t){var n,r,i=0,o=t&&t.match(w);if(o&&1===e.nodeType)while(n=o[i++])r=x.propFix[n]||n,x.expr.match.bool.test(n)&&(e[r]=!1),e.removeAttribute(n)},attrHooks:{type:{set:function(e,t){if(!x.support.radioValue&&"radio"===t&&x.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},propFix:{"for":"htmlFor","class":"className"},prop:function(e,t,n){var r,i,o,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return o=1!==s||!x.isXMLDoc(e),o&&(t=x.propFix[t]||t,i=x.propHooks[t]),n!==undefined?i&&"set"in i&&(r=i.set(e,n,t))!==undefined?r:e[t]=n:i&&"get"in i&&null!==(r=i.get(e,t))?r:e[t]},propHooks:{tabIndex:{get:function(e){return e.hasAttribute("tabindex")||B.test(e.nodeName)||e.href?e.tabIndex:-1}}}}),M={set:function(e,t,n){return t===!1?x.removeAttr(e,n):e.setAttribute(n,n),n}},x.each(x.expr.match.bool.source.match(/\w+/g),function(e,t){var n=x.expr.attrHandle[t]||x.find.attr;x.expr.attrHandle[t]=function(e,t,r){var i=x.expr.attrHandle[t],o=r?undefined:(x.expr.attrHandle[t]=undefined)!=n(e,t,r)?t.toLowerCase():null;return x.expr.attrHandle[t]=i,o}}),x.support.optSelected||(x.propHooks.selected={get:function(e){var t=e.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null}}),x.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){x.propFix[this.toLowerCase()]=this}),x.each(["radio","checkbox"],function(){x.valHooks[this]={set:function(e,t){return x.isArray(t)?e.checked=x.inArray(x(e).val(),t)>=0:undefined}},x.support.checkOn||(x.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})});var I=/^key/,z=/^(?:mouse|contextmenu)|click/,_=/^(?:focusinfocus|focusoutblur)$/,X=/^([^.]*)(?:\.(.+)|)$/;function U(){return!0}function Y(){return!1}function V(){try{return o.activeElement}catch(e){}}x.event={global:{},add:function(e,t,n,i,o){var s,a,u,l,c,p,f,h,d,g,m,y=q.get(e);if(y){n.handler&&(s=n,n=s.handler,o=s.selector),n.guid||(n.guid=x.guid++),(l=y.events)||(l=y.events={}),(a=y.handle)||(a=y.handle=function(e){return typeof x===r||e&&x.event.triggered===e.type?undefined:x.event.dispatch.apply(a.elem,arguments)},a.elem=e),t=(t||"").match(w)||[""],c=t.length;while(c--)u=X.exec(t[c])||[],d=m=u[1],g=(u[2]||"").split(".").sort(),d&&(f=x.event.special[d]||{},d=(o?f.delegateType:f.bindType)||d,f=x.event.special[d]||{},p=x.extend({type:d,origType:m,data:i,handler:n,guid:n.guid,selector:o,needsContext:o&&x.expr.match.needsContext.test(o),namespace:g.join(".")},s),(h=l[d])||(h=l[d]=[],h.delegateCount=0,f.setup&&f.setup.call(e,i,g,a)!==!1||e.addEventListener&&e.addEventListener(d,a,!1)),f.add&&(f.add.call(e,p),p.handler.guid||(p.handler.guid=n.guid)),o?h.splice(h.delegateCount++,0,p):h.push(p),x.event.global[d]=!0);e=null}},remove:function(e,t,n,r,i){var o,s,a,u,l,c,p,f,h,d,g,m=q.hasData(e)&&q.get(e);if(m&&(u=m.events)){t=(t||"").match(w)||[""],l=t.length;while(l--)if(a=X.exec(t[l])||[],h=g=a[1],d=(a[2]||"").split(".").sort(),h){p=x.event.special[h]||{},h=(r?p.delegateType:p.bindType)||h,f=u[h]||[],a=a[2]&&RegExp("(^|\\.)"+d.join("\\.(?:.*\\.|)")+"(\\.|$)"),s=o=f.length;while(o--)c=f[o],!i&&g!==c.origType||n&&n.guid!==c.guid||a&&!a.test(c.namespace)||r&&r!==c.selector&&("**"!==r||!c.selector)||(f.splice(o,1),c.selector&&f.delegateCount--,p.remove&&p.remove.call(e,c));s&&!f.length&&(p.teardown&&p.teardown.call(e,d,m.handle)!==!1||x.removeEvent(e,h,m.handle),delete u[h])}else for(h in u)x.event.remove(e,h+t[l],n,r,!0);x.isEmptyObject(u)&&(delete m.handle,q.remove(e,"events"))}},trigger:function(t,n,r,i){var s,a,u,l,c,p,f,h=[r||o],d=y.call(t,"type")?t.type:t,g=y.call(t,"namespace")?t.namespace.split("."):[];if(a=u=r=r||o,3!==r.nodeType&&8!==r.nodeType&&!_.test(d+x.event.triggered)&&(d.indexOf(".")>=0&&(g=d.split("."),d=g.shift(),g.sort()),c=0>d.indexOf(":")&&"on"+d,t=t[x.expando]?t:new x.Event(d,"object"==typeof t&&t),t.isTrigger=i?2:3,t.namespace=g.join("."),t.namespace_re=t.namespace?RegExp("(^|\\.)"+g.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,t.result=undefined,t.target||(t.target=r),n=null==n?[t]:x.makeArray(n,[t]),f=x.event.special[d]||{},i||!f.trigger||f.trigger.apply(r,n)!==!1)){if(!i&&!f.noBubble&&!x.isWindow(r)){for(l=f.delegateType||d,_.test(l+d)||(a=a.parentNode);a;a=a.parentNode)h.push(a),u=a;u===(r.ownerDocument||o)&&h.push(u.defaultView||u.parentWindow||e)}s=0;while((a=h[s++])&&!t.isPropagationStopped())t.type=s>1?l:f.bindType||d,p=(q.get(a,"events")||{})[t.type]&&q.get(a,"handle"),p&&p.apply(a,n),p=c&&a[c],p&&x.acceptData(a)&&p.apply&&p.apply(a,n)===!1&&t.preventDefault();return t.type=d,i||t.isDefaultPrevented()||f._default&&f._default.apply(h.pop(),n)!==!1||!x.acceptData(r)||c&&x.isFunction(r[d])&&!x.isWindow(r)&&(u=r[c],u&&(r[c]=null),x.event.triggered=d,r[d](),x.event.triggered=undefined,u&&(r[c]=u)),t.result}},dispatch:function(e){e=x.event.fix(e);var t,n,r,i,o,s=[],a=d.call(arguments),u=(q.get(this,"events")||{})[e.type]||[],l=x.event.special[e.type]||{};if(a[0]=e,e.delegateTarget=this,!l.preDispatch||l.preDispatch.call(this,e)!==!1){s=x.event.handlers.call(this,e,u),t=0;while((i=s[t++])&&!e.isPropagationStopped()){e.currentTarget=i.elem,n=0;while((o=i.handlers[n++])&&!e.isImmediatePropagationStopped())(!e.namespace_re||e.namespace_re.test(o.namespace))&&(e.handleObj=o,e.data=o.data,r=((x.event.special[o.origType]||{}).handle||o.handler).apply(i.elem,a),r!==undefined&&(e.result=r)===!1&&(e.preventDefault(),e.stopPropagation()))}return l.postDispatch&&l.postDispatch.call(this,e),e.result}},handlers:function(e,t){var n,r,i,o,s=[],a=t.delegateCount,u=e.target;if(a&&u.nodeType&&(!e.button||"click"!==e.type))for(;u!==this;u=u.parentNode||this)if(u.disabled!==!0||"click"!==e.type){for(r=[],n=0;a>n;n++)o=t[n],i=o.selector+" ",r[i]===undefined&&(r[i]=o.needsContext?x(i,this).index(u)>=0:x.find(i,this,null,[u]).length),r[i]&&r.push(o);r.length&&s.push({elem:u,handlers:r})}return t.length>a&&s.push({elem:this,handlers:t.slice(a)}),s},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return null==e.which&&(e.which=null!=t.charCode?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,t){var n,r,i,s=t.button;return null==e.pageX&&null!=t.clientX&&(n=e.target.ownerDocument||o,r=n.documentElement,i=n.body,e.pageX=t.clientX+(r&&r.scrollLeft||i&&i.scrollLeft||0)-(r&&r.clientLeft||i&&i.clientLeft||0),e.pageY=t.clientY+(r&&r.scrollTop||i&&i.scrollTop||0)-(r&&r.clientTop||i&&i.clientTop||0)),e.which||s===undefined||(e.which=1&s?1:2&s?3:4&s?2:0),e}},fix:function(e){if(e[x.expando])return e;var t,n,r,i=e.type,s=e,a=this.fixHooks[i];a||(this.fixHooks[i]=a=z.test(i)?this.mouseHooks:I.test(i)?this.keyHooks:{}),r=a.props?this.props.concat(a.props):this.props,e=new x.Event(s),t=r.length;while(t--)n=r[t],e[n]=s[n];return e.target||(e.target=o),3===e.target.nodeType&&(e.target=e.target.parentNode),a.filter?a.filter(e,s):e},special:{load:{noBubble:!0},focus:{trigger:function(){return this!==V()&&this.focus?(this.focus(),!1):undefined},delegateType:"focusin"},blur:{trigger:function(){return this===V()&&this.blur?(this.blur(),!1):undefined},delegateType:"focusout"},click:{trigger:function(){return"checkbox"===this.type&&this.click&&x.nodeName(this,"input")?(this.click(),!1):undefined},_default:function(e){return x.nodeName(e.target,"a")}},beforeunload:{postDispatch:function(e){e.result!==undefined&&(e.originalEvent.returnValue=e.result)}}},simulate:function(e,t,n,r){var i=x.extend(new x.Event,n,{type:e,isSimulated:!0,originalEvent:{}});r?x.event.trigger(i,null,t):x.event.dispatch.call(t,i),i.isDefaultPrevented()&&n.preventDefault()}},x.removeEvent=function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)},x.Event=function(e,t){return this instanceof x.Event?(e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||e.getPreventDefault&&e.getPreventDefault()?U:Y):this.type=e,t&&x.extend(this,t),this.timeStamp=e&&e.timeStamp||x.now(),this[x.expando]=!0,undefined):new x.Event(e,t)},x.Event.prototype={isDefaultPrevented:Y,isPropagationStopped:Y,isImmediatePropagationStopped:Y,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=U,e&&e.preventDefault&&e.preventDefault()},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=U,e&&e.stopPropagation&&e.stopPropagation()},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=U,this.stopPropagation()}},x.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(e,t){x.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;return(!i||i!==r&&!x.contains(r,i))&&(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),x.support.focusinBubbles||x.each({focus:"focusin",blur:"focusout"},function(e,t){var n=0,r=function(e){x.event.simulate(t,e.target,x.event.fix(e),!0)};x.event.special[t]={setup:function(){0===n++&&o.addEventListener(e,r,!0)},teardown:function(){0===--n&&o.removeEventListener(e,r,!0)}}}),x.fn.extend({on:function(e,t,n,r,i){var o,s;if("object"==typeof e){"string"!=typeof t&&(n=n||t,t=undefined);for(s in e)this.on(s,t,n,e[s],i);return this}if(null==n&&null==r?(r=t,n=t=undefined):null==r&&("string"==typeof t?(r=n,n=undefined):(r=n,n=t,t=undefined)),r===!1)r=Y;else if(!r)return this;return 1===i&&(o=r,r=function(e){return x().off(e),o.apply(this,arguments)},r.guid=o.guid||(o.guid=x.guid++)),this.each(function(){x.event.add(this,e,r,n,t)})},one:function(e,t,n,r){return this.on(e,t,n,r,1)},off:function(e,t,n){var r,i;if(e&&e.preventDefault&&e.handleObj)return r=e.handleObj,x(e.delegateTarget).off(r.namespace?r.origType+"."+r.namespace:r.origType,r.selector,r.handler),this;if("object"==typeof e){for(i in e)this.off(i,t,e[i]);return this}return(t===!1||"function"==typeof t)&&(n=t,t=undefined),n===!1&&(n=Y),this.each(function(){x.event.remove(this,e,n,t)})},trigger:function(e,t){return this.each(function(){x.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];return n?x.event.trigger(e,t,n,!0):undefined}});var G=/^.[^:#\[\.,]*$/,J=/^(?:parents|prev(?:Until|All))/,Q=x.expr.match.needsContext,K={children:!0,contents:!0,next:!0,prev:!0};x.fn.extend({find:function(e){var t,n=[],r=this,i=r.length;if("string"!=typeof e)return this.pushStack(x(e).filter(function(){for(t=0;i>t;t++)if(x.contains(r[t],this))return!0}));for(t=0;i>t;t++)x.find(e,r[t],n);return n=this.pushStack(i>1?x.unique(n):n),n.selector=this.selector?this.selector+" "+e:e,n},has:function(e){var t=x(e,this),n=t.length;return this.filter(function(){var e=0;for(;n>e;e++)if(x.contains(this,t[e]))return!0})},not:function(e){return this.pushStack(et(this,e||[],!0))},filter:function(e){return this.pushStack(et(this,e||[],!1))},is:function(e){return!!et(this,"string"==typeof e&&Q.test(e)?x(e):e||[],!1).length},closest:function(e,t){var n,r=0,i=this.length,o=[],s=Q.test(e)||"string"!=typeof e?x(e,t||this.context):0;for(;i>r;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(11>n.nodeType&&(s?s.index(n)>-1:1===n.nodeType&&x.find.matchesSelector(n,e))){n=o.push(n);break}return this.pushStack(o.length>1?x.unique(o):o)},index:function(e){return e?"string"==typeof e?g.call(x(e),this[0]):g.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){var n="string"==typeof e?x(e,t):x.makeArray(e&&e.nodeType?[e]:e),r=x.merge(this.get(),n);return this.pushStack(x.unique(r))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}});function Z(e,t){while((e=e[t])&&1!==e.nodeType);return e}x.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return x.dir(e,"parentNode")},parentsUntil:function(e,t,n){return x.dir(e,"parentNode",n)},next:function(e){return Z(e,"nextSibling")},prev:function(e){return Z(e,"previousSibling")},nextAll:function(e){return x.dir(e,"nextSibling")},prevAll:function(e){return x.dir(e,"previousSibling")},nextUntil:function(e,t,n){return x.dir(e,"nextSibling",n)},prevUntil:function(e,t,n){return x.dir(e,"previousSibling",n)},siblings:function(e){return x.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return x.sibling(e.firstChild)},contents:function(e){return e.contentDocument||x.merge([],e.childNodes)}},function(e,t){x.fn[e]=function(n,r){var i=x.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=x.filter(r,i)),this.length>1&&(K[e]||x.unique(i),J.test(e)&&i.reverse()),this.pushStack(i)}}),x.extend({filter:function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?x.find.matchesSelector(r,e)?[r]:[]:x.find.matches(e,x.grep(t,function(e){return 1===e.nodeType}))},dir:function(e,t,n){var r=[],i=n!==undefined;while((e=e[t])&&9!==e.nodeType)if(1===e.nodeType){if(i&&x(e).is(n))break;r.push(e)}return r},sibling:function(e,t){var n=[];for(;e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n}});function et(e,t,n){if(x.isFunction(t))return x.grep(e,function(e,r){return!!t.call(e,r,e)!==n});if(t.nodeType)return x.grep(e,function(e){return e===t!==n});if("string"==typeof t){if(G.test(t))return x.filter(t,e,n);t=x.filter(t,e)}return x.grep(e,function(e){return g.call(t,e)>=0!==n})}var tt=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,nt=/<([\w:]+)/,rt=/<|&#?\w+;/,it=/<(?:script|style|link)/i,ot=/^(?:checkbox|radio)$/i,st=/checked\s*(?:[^=]|=\s*.checked.)/i,at=/^$|\/(?:java|ecma)script/i,ut=/^true\/(.*)/,lt=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,ct={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ct.optgroup=ct.option,ct.tbody=ct.tfoot=ct.colgroup=ct.caption=ct.thead,ct.th=ct.td,x.fn.extend({text:function(e){return x.access(this,function(e){return e===undefined?x.text(this):this.empty().append((this[0]&&this[0].ownerDocument||o).createTextNode(e))},null,e,arguments.length)},append:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=pt(this,e);t.appendChild(e)}})},prepend:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=pt(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},remove:function(e,t){var n,r=e?x.filter(e,this):this,i=0;for(;null!=(n=r[i]);i++)t||1!==n.nodeType||x.cleanData(mt(n)),n.parentNode&&(t&&x.contains(n.ownerDocument,n)&&dt(mt(n,"script")),n.parentNode.removeChild(n));return this},empty:function(){var e,t=0;for(;null!=(e=this[t]);t++)1===e.nodeType&&(x.cleanData(mt(e,!1)),e.textContent="");return this},clone:function(e,t){return e=null==e?!1:e,t=null==t?e:t,this.map(function(){return x.clone(this,e,t)})},html:function(e){return x.access(this,function(e){var t=this[0]||{},n=0,r=this.length;if(e===undefined&&1===t.nodeType)return t.innerHTML;if("string"==typeof e&&!it.test(e)&&!ct[(nt.exec(e)||["",""])[1].toLowerCase()]){e=e.replace(tt,"<$1></$2>");try{for(;r>n;n++)t=this[n]||{},1===t.nodeType&&(x.cleanData(mt(t,!1)),t.innerHTML=e);t=0}catch(i){}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=x.map(this,function(e){return[e.nextSibling,e.parentNode]}),t=0;return this.domManip(arguments,function(n){var r=e[t++],i=e[t++];i&&(r&&r.parentNode!==i&&(r=this.nextSibling),x(this).remove(),i.insertBefore(n,r))},!0),t?this:this.remove()},detach:function(e){return this.remove(e,!0)},domManip:function(e,t,n){e=f.apply([],e);var r,i,o,s,a,u,l=0,c=this.length,p=this,h=c-1,d=e[0],g=x.isFunction(d);if(g||!(1>=c||"string"!=typeof d||x.support.checkClone)&&st.test(d))return this.each(function(r){var i=p.eq(r);g&&(e[0]=d.call(this,r,i.html())),i.domManip(e,t,n)});if(c&&(r=x.buildFragment(e,this[0].ownerDocument,!1,!n&&this),i=r.firstChild,1===r.childNodes.length&&(r=i),i)){for(o=x.map(mt(r,"script"),ft),s=o.length;c>l;l++)a=r,l!==h&&(a=x.clone(a,!0,!0),s&&x.merge(o,mt(a,"script"))),t.call(this[l],a,l);if(s)for(u=o[o.length-1].ownerDocument,x.map(o,ht),l=0;s>l;l++)a=o[l],at.test(a.type||"")&&!q.access(a,"globalEval")&&x.contains(u,a)&&(a.src?x._evalUrl(a.src):x.globalEval(a.textContent.replace(lt,"")))}return this}}),x.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){x.fn[e]=function(e){var n,r=[],i=x(e),o=i.length-1,s=0;for(;o>=s;s++)n=s===o?this:this.clone(!0),x(i[s])[t](n),h.apply(r,n.get());return this.pushStack(r)}}),x.extend({clone:function(e,t,n){var r,i,o,s,a=e.cloneNode(!0),u=x.contains(e.ownerDocument,e);if(!(x.support.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||x.isXMLDoc(e)))for(s=mt(a),o=mt(e),r=0,i=o.length;i>r;r++)yt(o[r],s[r]);if(t)if(n)for(o=o||mt(e),s=s||mt(a),r=0,i=o.length;i>r;r++)gt(o[r],s[r]);else gt(e,a);return s=mt(a,"script"),s.length>0&&dt(s,!u&&mt(e,"script")),a},buildFragment:function(e,t,n,r){var i,o,s,a,u,l,c=0,p=e.length,f=t.createDocumentFragment(),h=[];for(;p>c;c++)if(i=e[c],i||0===i)if("object"===x.type(i))x.merge(h,i.nodeType?[i]:i);else if(rt.test(i)){o=o||f.appendChild(t.createElement("div")),s=(nt.exec(i)||["",""])[1].toLowerCase(),a=ct[s]||ct._default,o.innerHTML=a[1]+i.replace(tt,"<$1></$2>")+a[2],l=a[0];while(l--)o=o.lastChild;x.merge(h,o.childNodes),o=f.firstChild,o.textContent=""}else h.push(t.createTextNode(i));f.textContent="",c=0;while(i=h[c++])if((!r||-1===x.inArray(i,r))&&(u=x.contains(i.ownerDocument,i),o=mt(f.appendChild(i),"script"),u&&dt(o),n)){l=0;while(i=o[l++])at.test(i.type||"")&&n.push(i)}return f},cleanData:function(e){var t,n,r,i,o,s,a=x.event.special,u=0;for(;(n=e[u])!==undefined;u++){if(F.accepts(n)&&(o=n[q.expando],o&&(t=q.cache[o]))){if(r=Object.keys(t.events||{}),r.length)for(s=0;(i=r[s])!==undefined;s++)a[i]?x.event.remove(n,i):x.removeEvent(n,i,t.handle);q.cache[o]&&delete q.cache[o]}delete L.cache[n[L.expando]]}},_evalUrl:function(e){return x.ajax({url:e,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})}});function pt(e,t){return x.nodeName(e,"table")&&x.nodeName(1===t.nodeType?t:t.firstChild,"tr")?e.getElementsByTagName("tbody")[0]||e.appendChild(e.ownerDocument.createElement("tbody")):e}function ft(e){return e.type=(null!==e.getAttribute("type"))+"/"+e.type,e}function ht(e){var t=ut.exec(e.type);return t?e.type=t[1]:e.removeAttribute("type"),e}function dt(e,t){var n=e.length,r=0;for(;n>r;r++)q.set(e[r],"globalEval",!t||q.get(t[r],"globalEval"))}function gt(e,t){var n,r,i,o,s,a,u,l;if(1===t.nodeType){if(q.hasData(e)&&(o=q.access(e),s=q.set(t,o),l=o.events)){delete s.handle,s.events={};for(i in l)for(n=0,r=l[i].length;r>n;n++)x.event.add(t,i,l[i][n])}L.hasData(e)&&(a=L.access(e),u=x.extend({},a),L.set(t,u))}}function mt(e,t){var n=e.getElementsByTagName?e.getElementsByTagName(t||"*"):e.querySelectorAll?e.querySelectorAll(t||"*"):[];return t===undefined||t&&x.nodeName(e,t)?x.merge([e],n):n}function yt(e,t){var n=t.nodeName.toLowerCase();"input"===n&&ot.test(e.type)?t.checked=e.checked:("input"===n||"textarea"===n)&&(t.defaultValue=e.defaultValue)}x.fn.extend({wrapAll:function(e){var t;return x.isFunction(e)?this.each(function(t){x(this).wrapAll(e.call(this,t))}):(this[0]&&(t=x(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstElementChild)e=e.firstElementChild;return e}).append(this)),this)},wrapInner:function(e){return x.isFunction(e)?this.each(function(t){x(this).wrapInner(e.call(this,t))}):this.each(function(){var t=x(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=x.isFunction(e);return this.each(function(n){x(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){x.nodeName(this,"body")||x(this).replaceWith(this.childNodes)}).end()}});var vt,xt,bt=/^(none|table(?!-c[ea]).+)/,wt=/^margin/,Tt=RegExp("^("+b+")(.*)$","i"),Ct=RegExp("^("+b+")(?!px)[a-z%]+$","i"),kt=RegExp("^([+-])=("+b+")","i"),Nt={BODY:"block"},Et={position:"absolute",visibility:"hidden",display:"block"},St={letterSpacing:0,fontWeight:400},jt=["Top","Right","Bottom","Left"],Dt=["Webkit","O","Moz","ms"];function At(e,t){if(t in e)return t;var n=t.charAt(0).toUpperCase()+t.slice(1),r=t,i=Dt.length;while(i--)if(t=Dt[i]+n,t in e)return t;return r}function Lt(e,t){return e=t||e,"none"===x.css(e,"display")||!x.contains(e.ownerDocument,e)}function qt(t){return e.getComputedStyle(t,null)}function Ht(e,t){var n,r,i,o=[],s=0,a=e.length;for(;a>s;s++)r=e[s],r.style&&(o[s]=q.get(r,"olddisplay"),n=r.style.display,t?(o[s]||"none"!==n||(r.style.display=""),""===r.style.display&&Lt(r)&&(o[s]=q.access(r,"olddisplay",Rt(r.nodeName)))):o[s]||(i=Lt(r),(n&&"none"!==n||!i)&&q.set(r,"olddisplay",i?n:x.css(r,"display"))));for(s=0;a>s;s++)r=e[s],r.style&&(t&&"none"!==r.style.display&&""!==r.style.display||(r.style.display=t?o[s]||"":"none"));return e}x.fn.extend({css:function(e,t){return x.access(this,function(e,t,n){var r,i,o={},s=0;if(x.isArray(t)){for(r=qt(e),i=t.length;i>s;s++)o[t[s]]=x.css(e,t[s],!1,r);return o}return n!==undefined?x.style(e,t,n):x.css(e,t)},e,t,arguments.length>1)},show:function(){return Ht(this,!0)},hide:function(){return Ht(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){Lt(this)?x(this).show():x(this).hide()})}}),x.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=vt(e,"opacity");return""===n?"1":n}}}},cssNumber:{columnCount:!0,fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(e,t,n,r){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var i,o,s,a=x.camelCase(t),u=e.style;return t=x.cssProps[a]||(x.cssProps[a]=At(u,a)),s=x.cssHooks[t]||x.cssHooks[a],n===undefined?s&&"get"in s&&(i=s.get(e,!1,r))!==undefined?i:u[t]:(o=typeof n,"string"===o&&(i=kt.exec(n))&&(n=(i[1]+1)*i[2]+parseFloat(x.css(e,t)),o="number"),null==n||"number"===o&&isNaN(n)||("number"!==o||x.cssNumber[a]||(n+="px"),x.support.clearCloneStyle||""!==n||0!==t.indexOf("background")||(u[t]="inherit"),s&&"set"in s&&(n=s.set(e,n,r))===undefined||(u[t]=n)),undefined)}},css:function(e,t,n,r){var i,o,s,a=x.camelCase(t);return t=x.cssProps[a]||(x.cssProps[a]=At(e.style,a)),s=x.cssHooks[t]||x.cssHooks[a],s&&"get"in s&&(i=s.get(e,!0,n)),i===undefined&&(i=vt(e,t,r)),"normal"===i&&t in St&&(i=St[t]),""===n||n?(o=parseFloat(i),n===!0||x.isNumeric(o)?o||0:i):i}}),vt=function(e,t,n){var r,i,o,s=n||qt(e),a=s?s.getPropertyValue(t)||s[t]:undefined,u=e.style;return s&&(""!==a||x.contains(e.ownerDocument,e)||(a=x.style(e,t)),Ct.test(a)&&wt.test(t)&&(r=u.width,i=u.minWidth,o=u.maxWidth,u.minWidth=u.maxWidth=u.width=a,a=s.width,u.width=r,u.minWidth=i,u.maxWidth=o)),a};function Ot(e,t,n){var r=Tt.exec(t);return r?Math.max(0,r[1]-(n||0))+(r[2]||"px"):t}function Ft(e,t,n,r,i){var o=n===(r?"border":"content")?4:"width"===t?1:0,s=0;for(;4>o;o+=2)"margin"===n&&(s+=x.css(e,n+jt[o],!0,i)),r?("content"===n&&(s-=x.css(e,"padding"+jt[o],!0,i)),"margin"!==n&&(s-=x.css(e,"border"+jt[o]+"Width",!0,i))):(s+=x.css(e,"padding"+jt[o],!0,i),"padding"!==n&&(s+=x.css(e,"border"+jt[o]+"Width",!0,i)));return s}function Pt(e,t,n){var r=!0,i="width"===t?e.offsetWidth:e.offsetHeight,o=qt(e),s=x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,o);if(0>=i||null==i){if(i=vt(e,t,o),(0>i||null==i)&&(i=e.style[t]),Ct.test(i))return i;r=s&&(x.support.boxSizingReliable||i===e.style[t]),i=parseFloat(i)||0}return i+Ft(e,t,n||(s?"border":"content"),r,o)+"px"}function Rt(e){var t=o,n=Nt[e];return n||(n=Mt(e,t),"none"!==n&&n||(xt=(xt||x("<iframe frameborder='0' width='0' height='0'/>").css("cssText","display:block !important")).appendTo(t.documentElement),t=(xt[0].contentWindow||xt[0].contentDocument).document,t.write("<!doctype html><html><body>"),t.close(),n=Mt(e,t),xt.detach()),Nt[e]=n),n}function Mt(e,t){var n=x(t.createElement(e)).appendTo(t.body),r=x.css(n[0],"display");return n.remove(),r}x.each(["height","width"],function(e,t){x.cssHooks[t]={get:function(e,n,r){return n?0===e.offsetWidth&&bt.test(x.css(e,"display"))?x.swap(e,Et,function(){return Pt(e,t,r)}):Pt(e,t,r):undefined},set:function(e,n,r){var i=r&&qt(e);return Ot(e,n,r?Ft(e,t,r,x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,i),i):0)}}}),x(function(){x.support.reliableMarginRight||(x.cssHooks.marginRight={get:function(e,t){return t?x.swap(e,{display:"inline-block"},vt,[e,"marginRight"]):undefined}}),!x.support.pixelPosition&&x.fn.position&&x.each(["top","left"],function(e,t){x.cssHooks[t]={get:function(e,n){return n?(n=vt(e,t),Ct.test(n)?x(e).position()[t]+"px":n):undefined}}})}),x.expr&&x.expr.filters&&(x.expr.filters.hidden=function(e){return 0>=e.offsetWidth&&0>=e.offsetHeight},x.expr.filters.visible=function(e){return!x.expr.filters.hidden(e)}),x.each({margin:"",padding:"",border:"Width"},function(e,t){x.cssHooks[e+t]={expand:function(n){var r=0,i={},o="string"==typeof n?n.split(" "):[n];for(;4>r;r++)i[e+jt[r]+t]=o[r]||o[r-2]||o[0];return i}},wt.test(e)||(x.cssHooks[e+t].set=Ot)});var Wt=/%20/g,$t=/\[\]$/,Bt=/\r?\n/g,It=/^(?:submit|button|image|reset|file)$/i,zt=/^(?:input|select|textarea|keygen)/i;x.fn.extend({serialize:function(){return x.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=x.prop(this,"elements");return e?x.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!x(this).is(":disabled")&&zt.test(this.nodeName)&&!It.test(e)&&(this.checked||!ot.test(e))}).map(function(e,t){var n=x(this).val();return null==n?null:x.isArray(n)?x.map(n,function(e){return{name:t.name,value:e.replace(Bt,"\r\n")}}):{name:t.name,value:n.replace(Bt,"\r\n")}}).get()}}),x.param=function(e,t){var n,r=[],i=function(e,t){t=x.isFunction(t)?t():null==t?"":t,r[r.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};if(t===undefined&&(t=x.ajaxSettings&&x.ajaxSettings.traditional),x.isArray(e)||e.jquery&&!x.isPlainObject(e))x.each(e,function(){i(this.name,this.value)});else for(n in e)_t(n,e[n],t,i);return r.join("&").replace(Wt,"+")};function _t(e,t,n,r){var i;if(x.isArray(t))x.each(t,function(t,i){n||$t.test(e)?r(e,i):_t(e+"["+("object"==typeof i?t:"")+"]",i,n,r)});else if(n||"object"!==x.type(t))r(e,t);else for(i in t)_t(e+"["+i+"]",t[i],n,r)}x.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){x.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),x.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)},bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)
},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)}});var Xt,Ut,Yt=x.now(),Vt=/\?/,Gt=/#.*$/,Jt=/([?&])_=[^&]*/,Qt=/^(.*?):[ \t]*([^\r\n]*)$/gm,Kt=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Zt=/^(?:GET|HEAD)$/,en=/^\/\//,tn=/^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,nn=x.fn.load,rn={},on={},sn="*/".concat("*");try{Ut=i.href}catch(an){Ut=o.createElement("a"),Ut.href="",Ut=Ut.href}Xt=tn.exec(Ut.toLowerCase())||[];function un(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(w)||[];if(x.isFunction(n))while(r=o[i++])"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function ln(e,t,n,r){var i={},o=e===on;function s(a){var u;return i[a]=!0,x.each(e[a]||[],function(e,a){var l=a(t,n,r);return"string"!=typeof l||o||i[l]?o?!(u=l):undefined:(t.dataTypes.unshift(l),s(l),!1)}),u}return s(t.dataTypes[0])||!i["*"]&&s("*")}function cn(e,t){var n,r,i=x.ajaxSettings.flatOptions||{};for(n in t)t[n]!==undefined&&((i[n]?e:r||(r={}))[n]=t[n]);return r&&x.extend(!0,e,r),e}x.fn.load=function(e,t,n){if("string"!=typeof e&&nn)return nn.apply(this,arguments);var r,i,o,s=this,a=e.indexOf(" ");return a>=0&&(r=e.slice(a),e=e.slice(0,a)),x.isFunction(t)?(n=t,t=undefined):t&&"object"==typeof t&&(i="POST"),s.length>0&&x.ajax({url:e,type:i,dataType:"html",data:t}).done(function(e){o=arguments,s.html(r?x("<div>").append(x.parseHTML(e)).find(r):e)}).complete(n&&function(e,t){s.each(n,o||[e.responseText,t,e])}),this},x.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){x.fn[t]=function(e){return this.on(t,e)}}),x.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Ut,type:"GET",isLocal:Kt.test(Xt[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":sn,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":x.parseJSON,"text xml":x.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?cn(cn(e,x.ajaxSettings),t):cn(x.ajaxSettings,e)},ajaxPrefilter:un(rn),ajaxTransport:un(on),ajax:function(e,t){"object"==typeof e&&(t=e,e=undefined),t=t||{};var n,r,i,o,s,a,u,l,c=x.ajaxSetup({},t),p=c.context||c,f=c.context&&(p.nodeType||p.jquery)?x(p):x.event,h=x.Deferred(),d=x.Callbacks("once memory"),g=c.statusCode||{},m={},y={},v=0,b="canceled",T={readyState:0,getResponseHeader:function(e){var t;if(2===v){if(!o){o={};while(t=Qt.exec(i))o[t[1].toLowerCase()]=t[2]}t=o[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return 2===v?i:null},setRequestHeader:function(e,t){var n=e.toLowerCase();return v||(e=y[n]=y[n]||e,m[e]=t),this},overrideMimeType:function(e){return v||(c.mimeType=e),this},statusCode:function(e){var t;if(e)if(2>v)for(t in e)g[t]=[g[t],e[t]];else T.always(e[T.status]);return this},abort:function(e){var t=e||b;return n&&n.abort(t),k(0,t),this}};if(h.promise(T).complete=d.add,T.success=T.done,T.error=T.fail,c.url=((e||c.url||Ut)+"").replace(Gt,"").replace(en,Xt[1]+"//"),c.type=t.method||t.type||c.method||c.type,c.dataTypes=x.trim(c.dataType||"*").toLowerCase().match(w)||[""],null==c.crossDomain&&(a=tn.exec(c.url.toLowerCase()),c.crossDomain=!(!a||a[1]===Xt[1]&&a[2]===Xt[2]&&(a[3]||("http:"===a[1]?"80":"443"))===(Xt[3]||("http:"===Xt[1]?"80":"443")))),c.data&&c.processData&&"string"!=typeof c.data&&(c.data=x.param(c.data,c.traditional)),ln(rn,c,t,T),2===v)return T;u=c.global,u&&0===x.active++&&x.event.trigger("ajaxStart"),c.type=c.type.toUpperCase(),c.hasContent=!Zt.test(c.type),r=c.url,c.hasContent||(c.data&&(r=c.url+=(Vt.test(r)?"&":"?")+c.data,delete c.data),c.cache===!1&&(c.url=Jt.test(r)?r.replace(Jt,"$1_="+Yt++):r+(Vt.test(r)?"&":"?")+"_="+Yt++)),c.ifModified&&(x.lastModified[r]&&T.setRequestHeader("If-Modified-Since",x.lastModified[r]),x.etag[r]&&T.setRequestHeader("If-None-Match",x.etag[r])),(c.data&&c.hasContent&&c.contentType!==!1||t.contentType)&&T.setRequestHeader("Content-Type",c.contentType),T.setRequestHeader("Accept",c.dataTypes[0]&&c.accepts[c.dataTypes[0]]?c.accepts[c.dataTypes[0]]+("*"!==c.dataTypes[0]?", "+sn+"; q=0.01":""):c.accepts["*"]);for(l in c.headers)T.setRequestHeader(l,c.headers[l]);if(c.beforeSend&&(c.beforeSend.call(p,T,c)===!1||2===v))return T.abort();b="abort";for(l in{success:1,error:1,complete:1})T[l](c[l]);if(n=ln(on,c,t,T)){T.readyState=1,u&&f.trigger("ajaxSend",[T,c]),c.async&&c.timeout>0&&(s=setTimeout(function(){T.abort("timeout")},c.timeout));try{v=1,n.send(m,k)}catch(C){if(!(2>v))throw C;k(-1,C)}}else k(-1,"No Transport");function k(e,t,o,a){var l,m,y,b,w,C=t;2!==v&&(v=2,s&&clearTimeout(s),n=undefined,i=a||"",T.readyState=e>0?4:0,l=e>=200&&300>e||304===e,o&&(b=pn(c,T,o)),b=fn(c,b,T,l),l?(c.ifModified&&(w=T.getResponseHeader("Last-Modified"),w&&(x.lastModified[r]=w),w=T.getResponseHeader("etag"),w&&(x.etag[r]=w)),204===e||"HEAD"===c.type?C="nocontent":304===e?C="notmodified":(C=b.state,m=b.data,y=b.error,l=!y)):(y=C,(e||!C)&&(C="error",0>e&&(e=0))),T.status=e,T.statusText=(t||C)+"",l?h.resolveWith(p,[m,C,T]):h.rejectWith(p,[T,C,y]),T.statusCode(g),g=undefined,u&&f.trigger(l?"ajaxSuccess":"ajaxError",[T,c,l?m:y]),d.fireWith(p,[T,C]),u&&(f.trigger("ajaxComplete",[T,c]),--x.active||x.event.trigger("ajaxStop")))}return T},getJSON:function(e,t,n){return x.get(e,t,n,"json")},getScript:function(e,t){return x.get(e,undefined,t,"script")}}),x.each(["get","post"],function(e,t){x[t]=function(e,n,r,i){return x.isFunction(n)&&(i=i||r,r=n,n=undefined),x.ajax({url:e,type:t,dataType:i,data:n,success:r})}});function pn(e,t,n){var r,i,o,s,a=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),r===undefined&&(r=e.mimeType||t.getResponseHeader("Content-Type"));if(r)for(i in a)if(a[i]&&a[i].test(r)){u.unshift(i);break}if(u[0]in n)o=u[0];else{for(i in n){if(!u[0]||e.converters[i+" "+u[0]]){o=i;break}s||(s=i)}o=o||s}return o?(o!==u[0]&&u.unshift(o),n[o]):undefined}function fn(e,t,n,r){var i,o,s,a,u,l={},c=e.dataTypes.slice();if(c[1])for(s in e.converters)l[s.toLowerCase()]=e.converters[s];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!u&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),u=o,o=c.shift())if("*"===o)o=u;else if("*"!==u&&u!==o){if(s=l[u+" "+o]||l["* "+o],!s)for(i in l)if(a=i.split(" "),a[1]===o&&(s=l[u+" "+a[0]]||l["* "+a[0]])){s===!0?s=l[i]:l[i]!==!0&&(o=a[0],c.unshift(a[1]));break}if(s!==!0)if(s&&e["throws"])t=s(t);else try{t=s(t)}catch(p){return{state:"parsererror",error:s?p:"No conversion from "+u+" to "+o}}}return{state:"success",data:t}}x.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(e){return x.globalEval(e),e}}}),x.ajaxPrefilter("script",function(e){e.cache===undefined&&(e.cache=!1),e.crossDomain&&(e.type="GET")}),x.ajaxTransport("script",function(e){if(e.crossDomain){var t,n;return{send:function(r,i){t=x("<script>").prop({async:!0,charset:e.scriptCharset,src:e.url}).on("load error",n=function(e){t.remove(),n=null,e&&i("error"===e.type?404:200,e.type)}),o.head.appendChild(t[0])},abort:function(){n&&n()}}}});var hn=[],dn=/(=)\?(?=&|$)|\?\?/;x.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=hn.pop()||x.expando+"_"+Yt++;return this[e]=!0,e}}),x.ajaxPrefilter("json jsonp",function(t,n,r){var i,o,s,a=t.jsonp!==!1&&(dn.test(t.url)?"url":"string"==typeof t.data&&!(t.contentType||"").indexOf("application/x-www-form-urlencoded")&&dn.test(t.data)&&"data");return a||"jsonp"===t.dataTypes[0]?(i=t.jsonpCallback=x.isFunction(t.jsonpCallback)?t.jsonpCallback():t.jsonpCallback,a?t[a]=t[a].replace(dn,"$1"+i):t.jsonp!==!1&&(t.url+=(Vt.test(t.url)?"&":"?")+t.jsonp+"="+i),t.converters["script json"]=function(){return s||x.error(i+" was not called"),s[0]},t.dataTypes[0]="json",o=e[i],e[i]=function(){s=arguments},r.always(function(){e[i]=o,t[i]&&(t.jsonpCallback=n.jsonpCallback,hn.push(i)),s&&x.isFunction(o)&&o(s[0]),s=o=undefined}),"script"):undefined}),x.ajaxSettings.xhr=function(){try{return new XMLHttpRequest}catch(e){}};var gn=x.ajaxSettings.xhr(),mn={0:200,1223:204},yn=0,vn={};e.ActiveXObject&&x(e).on("unload",function(){for(var e in vn)vn[e]();vn=undefined}),x.support.cors=!!gn&&"withCredentials"in gn,x.support.ajax=gn=!!gn,x.ajaxTransport(function(e){var t;return x.support.cors||gn&&!e.crossDomain?{send:function(n,r){var i,o,s=e.xhr();if(s.open(e.type,e.url,e.async,e.username,e.password),e.xhrFields)for(i in e.xhrFields)s[i]=e.xhrFields[i];e.mimeType&&s.overrideMimeType&&s.overrideMimeType(e.mimeType),e.crossDomain||n["X-Requested-With"]||(n["X-Requested-With"]="XMLHttpRequest");for(i in n)s.setRequestHeader(i,n[i]);t=function(e){return function(){t&&(delete vn[o],t=s.onload=s.onerror=null,"abort"===e?s.abort():"error"===e?r(s.status||404,s.statusText):r(mn[s.status]||s.status,s.statusText,"string"==typeof s.responseText?{text:s.responseText}:undefined,s.getAllResponseHeaders()))}},s.onload=t(),s.onerror=t("error"),t=vn[o=yn++]=t("abort"),s.send(e.hasContent&&e.data||null)},abort:function(){t&&t()}}:undefined});var xn,bn,wn=/^(?:toggle|show|hide)$/,Tn=RegExp("^(?:([+-])=|)("+b+")([a-z%]*)$","i"),Cn=/queueHooks$/,kn=[An],Nn={"*":[function(e,t){var n=this.createTween(e,t),r=n.cur(),i=Tn.exec(t),o=i&&i[3]||(x.cssNumber[e]?"":"px"),s=(x.cssNumber[e]||"px"!==o&&+r)&&Tn.exec(x.css(n.elem,e)),a=1,u=20;if(s&&s[3]!==o){o=o||s[3],i=i||[],s=+r||1;do a=a||".5",s/=a,x.style(n.elem,e,s+o);while(a!==(a=n.cur()/r)&&1!==a&&--u)}return i&&(s=n.start=+s||+r||0,n.unit=o,n.end=i[1]?s+(i[1]+1)*i[2]:+i[2]),n}]};function En(){return setTimeout(function(){xn=undefined}),xn=x.now()}function Sn(e,t,n){var r,i=(Nn[t]||[]).concat(Nn["*"]),o=0,s=i.length;for(;s>o;o++)if(r=i[o].call(n,t,e))return r}function jn(e,t,n){var r,i,o=0,s=kn.length,a=x.Deferred().always(function(){delete u.elem}),u=function(){if(i)return!1;var t=xn||En(),n=Math.max(0,l.startTime+l.duration-t),r=n/l.duration||0,o=1-r,s=0,u=l.tweens.length;for(;u>s;s++)l.tweens[s].run(o);return a.notifyWith(e,[l,o,n]),1>o&&u?n:(a.resolveWith(e,[l]),!1)},l=a.promise({elem:e,props:x.extend({},t),opts:x.extend(!0,{specialEasing:{}},n),originalProperties:t,originalOptions:n,startTime:xn||En(),duration:n.duration,tweens:[],createTween:function(t,n){var r=x.Tween(e,l.opts,t,n,l.opts.specialEasing[t]||l.opts.easing);return l.tweens.push(r),r},stop:function(t){var n=0,r=t?l.tweens.length:0;if(i)return this;for(i=!0;r>n;n++)l.tweens[n].run(1);return t?a.resolveWith(e,[l,t]):a.rejectWith(e,[l,t]),this}}),c=l.props;for(Dn(c,l.opts.specialEasing);s>o;o++)if(r=kn[o].call(l,e,c,l.opts))return r;return x.map(c,Sn,l),x.isFunction(l.opts.start)&&l.opts.start.call(e,l),x.fx.timer(x.extend(u,{elem:e,anim:l,queue:l.opts.queue})),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always)}function Dn(e,t){var n,r,i,o,s;for(n in e)if(r=x.camelCase(n),i=t[r],o=e[n],x.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),s=x.cssHooks[r],s&&"expand"in s){o=s.expand(o),delete e[r];for(n in o)n in e||(e[n]=o[n],t[n]=i)}else t[r]=i}x.Animation=x.extend(jn,{tweener:function(e,t){x.isFunction(e)?(t=e,e=["*"]):e=e.split(" ");var n,r=0,i=e.length;for(;i>r;r++)n=e[r],Nn[n]=Nn[n]||[],Nn[n].unshift(t)},prefilter:function(e,t){t?kn.unshift(e):kn.push(e)}});function An(e,t,n){var r,i,o,s,a,u,l=this,c={},p=e.style,f=e.nodeType&&Lt(e),h=q.get(e,"fxshow");n.queue||(a=x._queueHooks(e,"fx"),null==a.unqueued&&(a.unqueued=0,u=a.empty.fire,a.empty.fire=function(){a.unqueued||u()}),a.unqueued++,l.always(function(){l.always(function(){a.unqueued--,x.queue(e,"fx").length||a.empty.fire()})})),1===e.nodeType&&("height"in t||"width"in t)&&(n.overflow=[p.overflow,p.overflowX,p.overflowY],"inline"===x.css(e,"display")&&"none"===x.css(e,"float")&&(p.display="inline-block")),n.overflow&&(p.overflow="hidden",l.always(function(){p.overflow=n.overflow[0],p.overflowX=n.overflow[1],p.overflowY=n.overflow[2]}));for(r in t)if(i=t[r],wn.exec(i)){if(delete t[r],o=o||"toggle"===i,i===(f?"hide":"show")){if("show"!==i||!h||h[r]===undefined)continue;f=!0}c[r]=h&&h[r]||x.style(e,r)}if(!x.isEmptyObject(c)){h?"hidden"in h&&(f=h.hidden):h=q.access(e,"fxshow",{}),o&&(h.hidden=!f),f?x(e).show():l.done(function(){x(e).hide()}),l.done(function(){var t;q.remove(e,"fxshow");for(t in c)x.style(e,t,c[t])});for(r in c)s=Sn(f?h[r]:0,r,l),r in h||(h[r]=s.start,f&&(s.end=s.start,s.start="width"===r||"height"===r?1:0))}}function Ln(e,t,n,r,i){return new Ln.prototype.init(e,t,n,r,i)}x.Tween=Ln,Ln.prototype={constructor:Ln,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||"swing",this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(x.cssNumber[n]?"":"px")},cur:function(){var e=Ln.propHooks[this.prop];return e&&e.get?e.get(this):Ln.propHooks._default.get(this)},run:function(e){var t,n=Ln.propHooks[this.prop];return this.pos=t=this.options.duration?x.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):Ln.propHooks._default.set(this),this}},Ln.prototype.init.prototype=Ln.prototype,Ln.propHooks={_default:{get:function(e){var t;return null==e.elem[e.prop]||e.elem.style&&null!=e.elem.style[e.prop]?(t=x.css(e.elem,e.prop,""),t&&"auto"!==t?t:0):e.elem[e.prop]},set:function(e){x.fx.step[e.prop]?x.fx.step[e.prop](e):e.elem.style&&(null!=e.elem.style[x.cssProps[e.prop]]||x.cssHooks[e.prop])?x.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}},Ln.propHooks.scrollTop=Ln.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},x.each(["toggle","show","hide"],function(e,t){var n=x.fn[t];x.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(qn(t,!0),e,r,i)}}),x.fn.extend({fadeTo:function(e,t,n,r){return this.filter(Lt).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=x.isEmptyObject(e),o=x.speed(t,n,r),s=function(){var t=jn(this,x.extend({},e),o);(i||q.get(this,"finish"))&&t.stop(!0)};return s.finish=s,i||o.queue===!1?this.each(s):this.queue(o.queue,s)},stop:function(e,t,n){var r=function(e){var t=e.stop;delete e.stop,t(n)};return"string"!=typeof e&&(n=t,t=e,e=undefined),t&&e!==!1&&this.queue(e||"fx",[]),this.each(function(){var t=!0,i=null!=e&&e+"queueHooks",o=x.timers,s=q.get(this);if(i)s[i]&&s[i].stop&&r(s[i]);else for(i in s)s[i]&&s[i].stop&&Cn.test(i)&&r(s[i]);for(i=o.length;i--;)o[i].elem!==this||null!=e&&o[i].queue!==e||(o[i].anim.stop(n),t=!1,o.splice(i,1));(t||!n)&&x.dequeue(this,e)})},finish:function(e){return e!==!1&&(e=e||"fx"),this.each(function(){var t,n=q.get(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=x.timers,s=r?r.length:0;for(n.finish=!0,x.queue(this,e,[]),i&&i.stop&&i.stop.call(this,!0),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;s>t;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}});function qn(e,t){var n,r={height:e},i=0;for(t=t?1:0;4>i;i+=2-t)n=jt[i],r["margin"+n]=r["padding"+n]=e;return t&&(r.opacity=r.width=e),r}x.each({slideDown:qn("show"),slideUp:qn("hide"),slideToggle:qn("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){x.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),x.speed=function(e,t,n){var r=e&&"object"==typeof e?x.extend({},e):{complete:n||!n&&t||x.isFunction(e)&&e,duration:e,easing:n&&t||t&&!x.isFunction(t)&&t};return r.duration=x.fx.off?0:"number"==typeof r.duration?r.duration:r.duration in x.fx.speeds?x.fx.speeds[r.duration]:x.fx.speeds._default,(null==r.queue||r.queue===!0)&&(r.queue="fx"),r.old=r.complete,r.complete=function(){x.isFunction(r.old)&&r.old.call(this),r.queue&&x.dequeue(this,r.queue)},r},x.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2}},x.timers=[],x.fx=Ln.prototype.init,x.fx.tick=function(){var e,t=x.timers,n=0;for(xn=x.now();t.length>n;n++)e=t[n],e()||t[n]!==e||t.splice(n--,1);t.length||x.fx.stop(),xn=undefined},x.fx.timer=function(e){e()&&x.timers.push(e)&&x.fx.start()},x.fx.interval=13,x.fx.start=function(){bn||(bn=setInterval(x.fx.tick,x.fx.interval))},x.fx.stop=function(){clearInterval(bn),bn=null},x.fx.speeds={slow:600,fast:200,_default:400},x.fx.step={},x.expr&&x.expr.filters&&(x.expr.filters.animated=function(e){return x.grep(x.timers,function(t){return e===t.elem}).length}),x.fn.offset=function(e){if(arguments.length)return e===undefined?this:this.each(function(t){x.offset.setOffset(this,e,t)});var t,n,i=this[0],o={top:0,left:0},s=i&&i.ownerDocument;if(s)return t=s.documentElement,x.contains(t,i)?(typeof i.getBoundingClientRect!==r&&(o=i.getBoundingClientRect()),n=Hn(s),{top:o.top+n.pageYOffset-t.clientTop,left:o.left+n.pageXOffset-t.clientLeft}):o},x.offset={setOffset:function(e,t,n){var r,i,o,s,a,u,l,c=x.css(e,"position"),p=x(e),f={};"static"===c&&(e.style.position="relative"),a=p.offset(),o=x.css(e,"top"),u=x.css(e,"left"),l=("absolute"===c||"fixed"===c)&&(o+u).indexOf("auto")>-1,l?(r=p.position(),s=r.top,i=r.left):(s=parseFloat(o)||0,i=parseFloat(u)||0),x.isFunction(t)&&(t=t.call(e,n,a)),null!=t.top&&(f.top=t.top-a.top+s),null!=t.left&&(f.left=t.left-a.left+i),"using"in t?t.using.call(e,f):p.css(f)}},x.fn.extend({position:function(){if(this[0]){var e,t,n=this[0],r={top:0,left:0};return"fixed"===x.css(n,"position")?t=n.getBoundingClientRect():(e=this.offsetParent(),t=this.offset(),x.nodeName(e[0],"html")||(r=e.offset()),r.top+=x.css(e[0],"borderTopWidth",!0),r.left+=x.css(e[0],"borderLeftWidth",!0)),{top:t.top-r.top-x.css(n,"marginTop",!0),left:t.left-r.left-x.css(n,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent||s;while(e&&!x.nodeName(e,"html")&&"static"===x.css(e,"position"))e=e.offsetParent;return e||s})}}),x.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(t,n){var r="pageYOffset"===n;x.fn[t]=function(i){return x.access(this,function(t,i,o){var s=Hn(t);return o===undefined?s?s[n]:t[i]:(s?s.scrollTo(r?e.pageXOffset:o,r?o:e.pageYOffset):t[i]=o,undefined)},t,i,arguments.length,null)}});function Hn(e){return x.isWindow(e)?e:9===e.nodeType&&e.defaultView}x.each({Height:"height",Width:"width"},function(e,t){x.each({padding:"inner"+e,content:t,"":"outer"+e},function(n,r){x.fn[r]=function(r,i){var o=arguments.length&&(n||"boolean"!=typeof r),s=n||(r===!0||i===!0?"margin":"border");return x.access(this,function(t,n,r){var i;return x.isWindow(t)?t.document.documentElement["client"+e]:9===t.nodeType?(i=t.documentElement,Math.max(t.body["scroll"+e],i["scroll"+e],t.body["offset"+e],i["offset"+e],i["client"+e])):r===undefined?x.css(t,n,s):x.style(t,n,r,s)},t,o?r:undefined,o,null)}})}),x.fn.size=function(){return this.length},x.fn.andSelf=x.fn.addBack,"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=x:"function"==typeof define&&define.amd&&define("jquery",[],function(){return x}),"object"==typeof e&&"object"==typeof e.document&&(e.jQuery=e.$=x)})(window);

/*jshint
    expr:   true
*/
/*global self, respecEvents, respecConfig */

// Module core/base-runner
// The module in charge of running the whole processing pipeline.
// CONFIGURATION:
//  - trace: activate tracing for all modules
//  - preProcess: an array of functions that get called (with no parameters)
//      before anything else happens. This is not recommended and the feature is not
//      tested. Use with care, if you know what you're doing. Chances are you really
//      want to be using a new module with your own profile
//  - postProcess: the same as preProcess but at the end and with the same caveats
//  - afterEnd: a single function called at the end, after postProcess, with the
//      same caveats. These two coexist for historical reasons; please not that they
//      are all considered deprecated and may all be removed.

(function (GLOBAL) {
    // pubsub
    // freely adapted from http://higginsforpresident.net/js/static/jq.pubsub.js
    var handlers = {}
    ,   embedded = (top !== self)
    ;
    if (!("respecConfig" in window)) window.respecConfig = {};
    GLOBAL.respecEvents = {
        pub:    function (topic) {
            var args = Array.prototype.slice.call(arguments);
            args.shift();
            if (embedded && window.postMessage) parent.postMessage({ topic: topic, args: args}, "*");
            $.each(handlers[topic] || [], function () {
                this.apply(GLOBAL, args);
            });
        }
    ,   sub:    function (topic, cb) {
            if (!handlers[topic]) handlers[topic] = [];
            handlers[topic].push(cb);
            return [topic, cb];
        }
    ,   unsub:  function (opaque) { // opaque is whatever is returned by sub()
            var t = opaque[0];
            handlers[t] && $.each(handlers[t] || [], function (idx) {
                if (this == opaque[1]) handlers[t].splice(idx, 1);
            });
        }
    };
}(this));

// these need to be improved, or complemented with proper UI indications
if (window.console) {
    respecEvents.sub("warn", function (details) {
        console.log("WARN: " + details);
    });
    respecEvents.sub("error", function (details) {
        console.log("ERROR: " + details);
    });
    respecEvents.sub("start", function (details) {
        if (respecConfig && respecConfig.trace) console.log(">>> began: " + details);
    });
    respecEvents.sub("end", function (details) {
        if (respecConfig && respecConfig.trace) console.log("<<< finished: " + details);
    });
    respecEvents.sub("start-all", function () {
        console.log("RESPEC PROCESSING STARTED");
    });
    respecEvents.sub("end-all", function () {
        console.log("RESPEC DONE!");
    });
}


define(
    'core/base-runner',["jquery"],
    function () {
        return {
            runAll:    function (plugs) {
                // publish messages for beginning of all and end of all
                var pluginStack = 0;
                respecEvents.pub("start-all");
                respecEvents.sub("start", function () {
                    pluginStack++;
                });
                respecEvents.sub("end", function () {
                    pluginStack--;
                    if (!pluginStack) {
                        respecEvents.pub("end-all");
                        document.respecDone = true;
                    }
                });
                respecEvents.pub("start", "core/base-runner");
                
                // the first in the plugs is going to be us
                plugs.shift();

                // the base URL is used by some modules
                var $scripts = $("script"),
                    baseUrl = "";
                $scripts.each(function (i, s) {
                    var src = s.getAttribute("src");
                    if (!src || !$(s).hasClass("remove")) return;
                    if (/\/js\//.test(src)) baseUrl = src.replace(/\/js\/.*/, "\/js\/");
                });
                respecConfig.respecBase = baseUrl;
                respecConfig.scheme = (respecConfig.scheme) ? respecConfig.scheme : location.protocol.replace(":", "").toLowerCase();
                respecConfig.httpScheme = (respecConfig.scheme === "https") ? "https" : "http";
                
                var pipeline;
                pipeline = function () {
                    if (!plugs.length) {
                        if (respecConfig.postProcess) {
                            for (var i = 0; i < respecConfig.postProcess.length; i++) respecConfig.postProcess[i].apply(this);
                        }
                        if (respecConfig.afterEnd) respecConfig.afterEnd.apply(window, Array.prototype.slice.call(arguments));
                        respecEvents.pub("end", "core/base-runner");
                        return;
                    }
                    var plug = plugs.shift();
                    if (plug.run) plug.run.call(plug, respecConfig, document, pipeline, respecEvents);
                    else pipeline();
                };
                if (respecConfig.preProcess) {
                    for (var i = 0; i < respecConfig.preProcess.length; i++) respecConfig.preProcess[i].apply(this);
                }
                pipeline();
            }
        };
    }
);


// Module core/override-configuration
// A helper module that makes it possible to override settings specified in respecConfig
// by passing them as a query string. This is useful when you just want to make a few
// tweaks to a document before generating the snapshot, without mucking with the source.
// For example, you can change the status and date by appending:
//      ?specStatus=LC;publishDate=2012-03-15
// Note that fields are separated by semicolons and not ampersands.
// TODO
//  There could probably be a UI for this to make it even simpler.

define(
    'core/override-configuration',[],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/override-configuration");
                if (location.search) {
                    var confs = location.search.replace(/^\?/, "").split(";");
                    for (var i = 0, n = confs.length; i < n; i++) {
                        var items = confs[i].split("=", 2);
                        var k = decodeURI(items[0]), v = decodeURI(items[1]).replace(/%3D/g, "=");
                        // we could process more types here, as needed
                        if (v === "true") v = true;
                        else if (v === "false") v = false;
                        else if (v === "null") v = null;
                        else if (/\[\]$/.test(k)) {
                            k = k.replace(/\[\]/, "");
                            v = $.parseJSON(v);
                        }
                        conf[k] = v;
                    }
                }
                msg.pub("end", "core/override-configuration");
                cb();
            }
        };
    }
);


// Module core/default-root-attr
// In cases where it is recommended that a document specify its language and writing direction,
// this module will supply defaults of "en" and "ltr" respectively (but won't override
// specified values).
// Be careful in using this that these defaults make sense for the type of document you are
// publishing.

define(
    'core/default-root-attr',[],
    function () {
        return {
            run:    function (config, doc, cb, msg) {
                msg.pub("start", "core/default-root-attr");
                var root = $(doc.documentElement);
                if (!root.attr("lang")) {
                    root.attr("lang", "en");
                    if (!root.attr("dir")) root.attr("dir", "ltr");
                }
                msg.pub("end", "core/default-root-attr");
                cb();
            }
        };
    }
);

/**
 * marked - A markdown parser (https://github.com/chjj/marked)
 * Copyright (c) 2011-2012, Christopher Jeffrey. (MIT Licensed)
 */

;(function() {

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  lheading: /^([^\n]+)\n *(=|-){3,} *\n*/,
  blockquote: /^( *>[^\n]+(\n[^\n]+)*\n*)+/,
  list: /^( *)(bull) [^\0]+?(?:hr|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment|closed|closing) *(?:\n{2,}|\s*$)/,
  def: /^ *\[([^\]]+)\]: *([^\s]+)(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  paragraph: /^([^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = replace(block.list)
  (/bull/g, block.bullet)
  ('hr', /\n+(?=(?: *[-*_]){3,} *(?:\n+|$))/)
  ();

block.html = replace(block.html)
  ('comment', /<!--[^\0]*?-->/)
  ('closed', /<(tag)[^\0]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, tag())
  ();

block.paragraph = replace(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + tag())
  ('def', block.def)
  ();

block.normal = {
  fences: block.fences,
  paragraph: block.paragraph
};

block.gfm = {
  fences: /^ *(```|~~~) *(\w+)? *\n([^\0]+?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/
};

block.gfm.paragraph = replace(block.paragraph)
  ('(?!', '(?!' + block.gfm.fences.source.replace('\\1', '\\2') + '|')
  ();

/**
 * Block Lexer
 */

block.lexer = function(src) {
  var tokens = [];

  tokens.links = {};

  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ');

  return block.token(src, tokens, true);
};

block.token = function(src, tokens, top) {
  var src = src.replace(/^ +$/gm, '')
    , next
    , loose
    , cap
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = block.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = block.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      tokens.push({
        type: 'code',
        text: !options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = block.fences.exec(src)) {
      src = src.substring(cap[0].length);
      tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3]
      });
      continue;
    }

    // heading
    if (cap = block.heading.exec(src)) {
      src = src.substring(cap[0].length);
      tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // lheading
    if (cap = block.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = block.hr.exec(src)) {
      src = src.substring(cap[0].length);
      tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = block.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      block.token(cap, tokens, top);

      tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = block.list.exec(src)) {
      src = src.substring(cap[0].length);

      tokens.push({
        type: 'list_start',
        ordered: isFinite(cap[2])
      });

      // Get each top-level item.
      cap = cap[0].match(block.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item[item.length-1] === '\n';
          if (!loose) loose = next;
        }

        tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        block.token(item, tokens);

        tokens.push({
          type: 'list_item_end'
        });
      }

      tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = block.html.exec(src)) {
      src = src.substring(cap[0].length);
      tokens.push({
        type: options.sanitize
          ? 'paragraph'
          : 'html',
        pre: cap[1] === 'pre',
        text: cap[0]
      });
      continue;
    }

    // def
    if (top && (cap = block.def.exec(src))) {
      src = src.substring(cap[0].length);
      tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // top-level paragraph
    if (top && (cap = block.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      tokens.push({
        type: 'paragraph',
        text: cap[0]
      });
      continue;
    }

    // text
    if (cap = block.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }
  }

  return tokens;
};

/**
 * Inline Processing
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: noop,
  tag: /^<!--[^\0]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([^\0]+?)__(?!_)|^\*\*([^\0]+?)\*\*(?!\*)/,
  em: /^\b_((?:__|[^\0])+?)_\b|^\*((?:\*\*|[^\0])+?)\*(?!\*)/,
  code: /^(`+)([^\0]*?[^`])\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  text: /^[^\0]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._linkInside = /(?:\[[^\]]*\]|[^\]]|\](?=[^\[]*\]))*/;
inline._linkHref = /\s*<?([^\s]*?)>?(?:\s+['"]([^\0]*?)['"])?\s*/;

inline.link = replace(inline.link)
  ('inside', inline._linkInside)
  ('href', inline._linkHref)
  ();

inline.reflink = replace(inline.reflink)
  ('inside', inline._linkInside)
  ();

inline.normal = {
  url: inline.url,
  strong: inline.strong,
  em: inline.em,
  text: inline.text
};

inline.pedantic = {
  strong: /^__(?=\S)([^\0]*?\S)__(?!_)|^\*\*(?=\S)([^\0]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([^\0]*?\S)_(?!_)|^\*(?=\S)([^\0]*?\S)\*(?!\*)/
};

inline.gfm = {
  url: /^(https?:\/\/[^\s]+[^.,:;"')\]\s])/,
  text: /^[^\0]+?(?=[\\<!\[_*`]|https?:\/\/| {2,}\n|$)/
};

/**
 * Inline Lexer
 */

inline.lexer = function(src) {
  var out = ''
    , links = tokens.links
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = inline.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = inline.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = cap[1][6] === ':'
          ? mangle(cap[1].substring(7))
          : mangle(cap[1]);
        href = mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += '<a href="'
        + href
        + '">'
        + text
        + '</a>';
      continue;
    }

    // url (gfm)
    if (cap = inline.url.exec(src)) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += '<a href="'
        + href
        + '">'
        + text
        + '</a>';
      continue;
    }

    // tag
    if (cap = inline.tag.exec(src)) {
      src = src.substring(cap[0].length);
      out += options.sanitize
        ? escape(cap[0])
        : cap[0];
      continue;
    }

    // link
    if (cap = inline.link.exec(src)) {
      src = src.substring(cap[0].length);
      out += outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      continue;
    }

    // reflink, nolink
    if ((cap = inline.reflink.exec(src))
        || (cap = inline.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0][0];
        src = cap[0].substring(1) + src;
        continue;
      }
      out += outputLink(cap, link);
      continue;
    }

    // strong
    if (cap = inline.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += '<strong>'
        + inline.lexer(cap[2] || cap[1])
        + '</strong>';
      continue;
    }

    // em
    if (cap = inline.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += '<em>'
        + inline.lexer(cap[2] || cap[1])
        + '</em>';
      continue;
    }

    // code
    if (cap = inline.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += '<code>'
        + escape(cap[2], true)
        + '</code>';
      continue;
    }

    // br
    if (cap = inline.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += '<br>';
      continue;
    }

    // text
    if (cap = inline.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += escape(cap[0]);
      continue;
    }
  }

  return out;
};

function outputLink(cap, link) {
  if (cap[0][0] !== '!') {
    return '<a href="'
      + escape(link.href)
      + '"'
      + (link.title
      ? ' title="'
      + escape(link.title)
      + '"'
      : '')
      + '>'
      + inline.lexer(cap[1])
      + '</a>';
  } else {
    return '<img src="'
      + escape(link.href)
      + '" alt="'
      + escape(cap[1])
      + '"'
      + (link.title
      ? ' title="'
      + escape(link.title)
      + '"'
      : '')
      + '>';
  }
}

/**
 * Parsing
 */

var tokens
  , token;

function next() {
  return token = tokens.pop();
}

function tok() {
  switch (token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return '<hr>\n';
    }
    case 'heading': {
      return '<h'
        + token.depth
        + '>'
        + inline.lexer(token.text)
        + '</h'
        + token.depth
        + '>\n';
    }
    case 'code': {
      if (options.highlight) {
        token.code = options.highlight(token.text, token.lang);
        if (token.code != null && token.code !== token.text) {
          token.escaped = true;
          token.text = token.code;
        }
      }

      if (!token.escaped) {
        token.text = escape(token.text, true);
      }

      return '<pre><code'
        + (token.lang
        ? ' class="lang-'
        + token.lang
        + '"'
        : '')
        + '>'
        + token.text
        + '</code></pre>\n';
    }
    case 'blockquote_start': {
      var body = '';

      while (next().type !== 'blockquote_end') {
        body += tok();
      }

      return '<blockquote>\n'
        + body
        + '</blockquote>\n';
    }
    case 'list_start': {
      var type = token.ordered ? 'ol' : 'ul'
        , body = '';

      while (next().type !== 'list_end') {
        body += tok();
      }

      return '<'
        + type
        + '>\n'
        + body
        + '</'
        + type
        + '>\n';
    }
    case 'list_item_start': {
      var body = '';

      while (next().type !== 'list_item_end') {
        body += token.type === 'text'
          ? parseText()
          : tok();
      }

      return '<li>'
        + body
        + '</li>\n';
    }
    case 'loose_item_start': {
      var body = '';

      while (next().type !== 'list_item_end') {
        body += tok();
      }

      return '<li>'
        + body
        + '</li>\n';
    }
    case 'html': {
      return !token.pre && !options.pedantic
        ? inline.lexer(token.text)
        : token.text;
    }
    case 'paragraph': {
      return '<p>'
        + inline.lexer(token.text)
        + '</p>\n';
    }
    case 'text': {
      return '<p>'
        + parseText()
        + '</p>\n';
    }
  }
}

function parseText() {
  var body = token.text
    , top;

  while ((top = tokens[tokens.length-1])
         && top.type === 'text') {
    body += '\n' + next().text;
  }

  return inline.lexer(body);
}

function parse(src) {
  tokens = src.reverse();

  var out = '';
  while (next()) {
    out += tok();
  }

  tokens = null;
  token = null;

  return out;
}

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function mangle(text) {
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
}

function tag() {
  var tag = '(?!(?:'
    + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
    + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
    + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|@)\\b';

  return tag;
}

function replace(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt);
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

function noop() {}
noop.exec = noop;

/**
 * Marked
 */

function marked(src, opt) {
  setOptions(opt);
  return parse(block.lexer(src));
}

/**
 * Options
 */

var options
  , defaults;

function setOptions(opt) {
  if (!opt) opt = defaults;
  if (options === opt) return;
  options = opt;

  if (options.gfm) {
    block.fences = block.gfm.fences;
    block.paragraph = block.gfm.paragraph;
    inline.text = inline.gfm.text;
    inline.url = inline.gfm.url;
  } else {
    block.fences = block.normal.fences;
    block.paragraph = block.normal.paragraph;
    inline.text = inline.normal.text;
    inline.url = inline.normal.url;
  }

  if (options.pedantic) {
    inline.em = inline.pedantic.em;
    inline.strong = inline.pedantic.strong;
  } else {
    inline.em = inline.normal.em;
    inline.strong = inline.normal.strong;
  }
}

marked.options =
marked.setOptions = function(opt) {
  defaults = opt;
  setOptions(opt);
  return marked;
};

marked.setOptions({
  gfm: true,
  pedantic: false,
  sanitize: false,
  highlight: null
});

/**
 * Expose
 */

marked.parser = function(src, opt) {
  setOptions(opt);
  return parse(src);
};

marked.lexer = function(src, opt) {
  setOptions(opt);
  return block.lexer(src);
};

marked.parse = marked;

if (typeof module !== 'undefined') {
  module.exports = marked;
} else {
  this.marked = marked;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());
define("core/marked", function(){});

// Module core/markdown
// Handles the optional markdown processing.
// 
// Markdown support is optional. It is enabled by setting the `format`
// property of the configuration object to "markdown."
// 
// We use marked for parsing Markkdown.
// 
// Note that the content of SECTION elements, and elements with a
// class name of "note", "issue" or "req" are also parsed.
// 
// The HTML created by the Markdown parser is turned into a nested
// structure of SECTION elements, following the strucutre given by 
// the headings. For example, the following markup:
// 
//     Title
//     -----
//     
//     ### Subtitle ###
//     
//     Here's some text.
//     
//     ### Another subtitle ###
//     
//     More text.
// 
// will be transformed into:
// 
//     <section>
//       <h2>Title</h2>
//       <section>
//         <h3>Subtitle</h3>
//         <p>Here's some text.</p>
//       </section>
//       <section>
//         <h3>Another subtitle</h3>
//         <p>More text.</p>
//       </section>
//     </section>
//

define(
    'core/markdown',['core/marked'],
    function () {
        marked.setOptions({
            gfm: false,
            pedantic: false,
            sanitize: false
        });
        
        function makeBuilder(doc) {
            var root = doc.createDocumentFragment()
            ,   stack = [root]
            ,   current = root
            ,   HEADERS = /H[1-6]/
            ;

            function findPosition(header) {
                return parseInt(header.tagName.charAt(1));
            }

            function findParent(position) {
                var parent;
                while (position > 0) {
                    position--;
                    parent = stack[position];
                    if (parent) return parent;
                }
            }

            function findHeader(node) {
                node = node.firstChild;
                while (node) {
                    if (HEADERS.test(node.tagName)) {
                        return node;
                    }
                    node = node.nextSibling;
                }
                return null;
            }

            function addHeader(header) {
              var section = doc.createElement('section')
              ,   position = findPosition(header)
              ;

              section.appendChild(header);
              findParent(position).appendChild(section);
              stack[position] = section;
              stack.length = position + 1;
              current = section;
            }

            function addSection(node, process) {
                var header = findHeader(node)
                ,   position = header ? findPosition(header) : 1
                ,   parent = findParent(position)
                ;

                if (header) {
                    node.removeChild(header);
                }

                node.appendChild(process(node));

                if (header) {
                    node.insertBefore(header, node.firstChild);
                }

                parent.appendChild(node);
                current = parent;
            }

            function addElement(node) {
                current.appendChild(node);
            }

            function getRoot() {
                return root;
            }

            return {
                addHeader: addHeader,
                addSection: addSection,
                addElement: addElement,
                getRoot: getRoot
            };
        }

        return {
            toHTML: function(text) {
                // As markdown is pulled from HTML > is already escaped, and
                // thus blockquotes aren't picked up by the parser. This fixes
                // it.
                text = text.replace(/&gt;/g, '>');
                text = this.removeLeftPadding(text);
                return marked(text);
            },
            
            removeLeftPadding: function(text) {
                // Handles markdown content being nested
                // inside elements with soft tabs. E.g.:
                // <div>
                //     This is a title
                //     ---------------
                //     
                //     And this more text.
                // </div
                // 
                // Gets turned into:
                // <div>
                //     <h2>This is a title</h2>
                //     <p>And this more text.</p>
                // </div
                //
                // Rather than:
                // <div>
                //     <pre><code>This is a title
                // ---------------
                // 
                // And this more text.</code></pre>
                // </div

                var match = text.match(/\n[ ]+\S/g)
                ,   current
                ,   min
                ;

                if (match) {
                    min = match[0].length - 2;
                    for (var i = 0, length = match.length; i < length; i++) {
                        current = match[i].length - 2;
                        if (typeof min == 'undefined' || min > current) {
                            min = current
                        }
                    }

                    var re = new RegExp("\n[ ]{0," + min + "}", "g");
                    text = text.replace(re, '\n');
                }
                return text;
            },

            processBody: function(doc) {
                var fragment = doc.createDocumentFragment()
                ,   div = doc.createElement('div')
                ,   node
                ;
                
                div.innerHTML = this.toHTML(doc.body.innerHTML);
                while (node = div.firstChild) {
                    fragment.appendChild(node);
                }
                return fragment;
            },
            
            processSections: function(doc) {
                var self = this;
                $('section', doc).each(function() {
                    this.innerHTML = self.toHTML(this.innerHTML);
                });
            },
            
            processIssuesNotesAndReqs: function(doc) {
                var div = doc.createElement('div');
                var self = this;
                $('.issue, .note, .req', doc).each(function() {
                    div.innerHTML = self.toHTML(this.innerHTML);
                    this.innerHTML = '';
                    var node = div.firstChild;
                    while (node.firstChild) {
                        this.appendChild(node.firstChild);
                    }
                });
            },
            
            structure: function(fragment, doc) {
                function process(root) {
                    var node
                    ,   tagName
                    ,   stack = makeBuilder(doc)
                    ;

                    while (node = root.firstChild) {
                        if (node.nodeType !== 1) {
                            root.removeChild(node);
                            continue;
                        }
                        tagName = node.tagName.toLowerCase();
                        switch (tagName) {
                            case 'h1':
                            case 'h2':
                            case 'h3':
                            case 'h4':
                            case 'h5':
                            case 'h6':
                                stack.addHeader(node);
                                break;
                            case 'section':
                                stack.addSection(node, process);
                                break;
                            default:
                                stack.addElement(node);
                        }
                    }

                    return stack.getRoot();
                }

                return process(fragment);
            },

            run: function (conf, doc, cb, msg) {
                msg.pub("start", "core/markdown");
                if (conf.format === 'markdown') {
                    // Marked, the Markdown implementation we're currently using
                    // parses markdown nested in markup (unless it's in a section element).
                    // Turns out this is both what we need and generally not what other
                    // parsers do.
                    // In case we switch to another parser later on, we'll need to
                    // uncomment the below line of code.
                    //
                    // this.processIssuesNotesAndReqs(doc);
                    this.processSections(doc);
                    var fragment = this.structure(this.processBody(doc), doc);
                    doc.body.innerHTML = '';
                    doc.body.appendChild(fragment)
                }
                msg.pub("end", "core/markdown");
                cb();
            }
        };
    }
);

/*
 RequireJS text 1.0.8 Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/jrburke/requirejs for details
*/
(function(){var k=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"],m=/^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,n=/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,i=typeof location!=="undefined"&&location.href,o=i&&location.protocol&&location.protocol.replace(/\:/,""),p=i&&location.hostname,q=i&&(location.port||void 0),j=[];define('text',[],function(){var e,l;e={version:"1.0.8",strip:function(a){if(a){var a=a.replace(m,""),c=a.match(n);c&&(a=c[1])}else a="";return a},jsEscape:function(a){return a.replace(/(['\\])/g,
"\\$1").replace(/[\f]/g,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"\\n").replace(/[\t]/g,"\\t").replace(/[\r]/g,"\\r")},createXhr:function(){var a,c,b;if(typeof XMLHttpRequest!=="undefined")return new XMLHttpRequest;else if(typeof ActiveXObject!=="undefined")for(c=0;c<3;c++){b=k[c];try{a=new ActiveXObject(b)}catch(f){}if(a){k=[b];break}}return a},parseName:function(a){var c=!1,b=a.indexOf("."),f=a.substring(0,b),a=a.substring(b+1,a.length),b=a.indexOf("!");b!==-1&&(c=a.substring(b+1,a.length),
c=c==="strip",a=a.substring(0,b));return{moduleName:f,ext:a,strip:c}},xdRegExp:/^((\w+)\:)?\/\/([^\/\\]+)/,useXhr:function(a,c,b,f){var d=e.xdRegExp.exec(a),g;if(!d)return!0;a=d[2];d=d[3];d=d.split(":");g=d[1];d=d[0];return(!a||a===c)&&(!d||d===b)&&(!g&&!d||g===f)},finishLoad:function(a,c,b,f,d){b=c?e.strip(b):b;d.isBuild&&(j[a]=b);f(b)},load:function(a,c,b,f){if(f.isBuild&&!f.inlineText)b();else{var d=e.parseName(a),g=d.moduleName+"."+d.ext,h=c.toUrl(g),r=f&&f.text&&f.text.useXhr||e.useXhr;!i||r(h,
o,p,q)?e.get(h,function(c){e.finishLoad(a,d.strip,c,b,f)}):c([g],function(a){e.finishLoad(d.moduleName+"."+d.ext,d.strip,a,b,f)})}},write:function(a,c,b){if(j.hasOwnProperty(c)){var f=e.jsEscape(j[c]);b.asModule(a+"!"+c,"define(function () { return '"+f+"';});\n")}},writeFile:function(a,c,b,f,d){var c=e.parseName(c),g=c.moduleName+"."+c.ext,h=b.toUrl(c.moduleName+"."+c.ext)+".js";e.load(g,b,function(){var b=function(a){return f(h,a)};b.asModule=function(a,b){return f.asModule(a,h,b)};e.write(a,g,
b,d)},d)}};if(e.createXhr())e.get=function(a,c){var b=e.createXhr();b.open("GET",a,!0);b.onreadystatechange=function(){b.readyState===4&&c(b.responseText)};b.send(null)};else if(typeof process!=="undefined"&&process.versions&&process.versions.node)l=require.nodeRequire("fs"),e.get=function(a,c){var b=l.readFileSync(a,"utf8");b.indexOf("\ufeff")===0&&(b=b.substring(1));c(b)};else if(typeof Packages!=="undefined")e.get=function(a,c){var b=new java.io.File(a),f=java.lang.System.getProperty("line.separator"),
b=new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(b),"utf-8")),d,e,h="";try{d=new java.lang.StringBuffer;(e=b.readLine())&&e.length()&&e.charAt(0)===65279&&(e=e.substring(1));for(d.append(e);(e=b.readLine())!==null;)d.append(f),d.append(e);h=String(d.toString())}finally{b.close()}c(h)};return e})})();

define('text!core/css/respec2.css',[],function () { return '/*****************************************************************\n * ReSpec 3 CSS\n * Robin Berjon - http://berjon.com/\n *****************************************************************/\n\n/* --- INLINES --- */\nem.rfc2119 { \n    text-transform:     lowercase;\n    font-variant:       small-caps;\n    font-style:         normal;\n    color:              #900;\n}\n\nh1 acronym, h2 acronym, h3 acronym, h4 acronym, h5 acronym, h6 acronym, a acronym,\nh1 abbr, h2 abbr, h3 abbr, h4 abbr, h5 abbr, h6 abbr, a abbr {\n    border: none;\n}\n\ndfn {\n    font-weight:    bold;\n}\n\na.internalDFN {\n    color:  inherit;\n    border-bottom:  1px solid #99c;\n    text-decoration:    none;\n}\n\na.externalDFN {\n    color:  inherit;\n    border-bottom:  1px dotted #ccc;\n    text-decoration:    none;\n}\n\na.bibref {\n    text-decoration:    none;\n}\n\ncite .bibref {\n    font-style: normal;\n}\n\ncode {\n    color:  #ff4500;\n}\n\n/* --- TOC --- */\n.toc a, .tof a {\n    text-decoration:    none;\n}\n\na .secno, a .figno {\n    color:  #000;\n}\n\nul.tof, ol.tof {\n    list-style: none outside none;\n}\n\n.caption {\n    margin-top: 0.5em;\n    font-style:   italic;\n}\n\n/* --- TABLE --- */\ntable.simple {\n    border-spacing: 0;\n    border-collapse:    collapse;\n    border-bottom:  3px solid #005a9c;\n}\n\n.simple th {\n    background: #005a9c;\n    color:  #fff;\n    padding:    3px 5px;\n    text-align: left;\n}\n\n.simple th[scope="row"] {\n    background: inherit;\n    color:  inherit;\n    border-top: 1px solid #ddd;\n}\n\n.simple td {\n    padding:    3px 10px;\n    border-top: 1px solid #ddd;\n}\n\n.simple tr:nth-child(even) {\n    background: #f0f6ff;\n}\n\n/* --- DL --- */\n.section dd > p:first-child {\n    margin-top: 0;\n}\n\n.section dd > p:last-child {\n    margin-bottom: 0;\n}\n\n.section dd {\n    margin-bottom:  1em;\n}\n\n.section dl.attrs dd, .section dl.eldef dd {\n    margin-bottom:  0;\n}\n';});


// Module core/style
// Inserts the CSS that ReSpec uses into the document.
// IMPORTANT NOTE
//  The extraCSS configuration option is now deprecated. People rarely use it, and it
//  does not work well with the growing restrictions that browsers impose on loading
//  local content. You can still add your own styles: for that you will have to create
//  a plugin that declares the css as a dependency and create a build of your new
//  ReSpec profile. It's rather easy, really.
// CONFIGURATION
//  - noReSpecCSS: if you're using a profile that loads this module but you don't want
//    the style, set this to true

define(
    'core/style',["text!core/css/respec2.css"],
    function (css) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/style");
                if (!conf.noReSpecCSS) {
                    $("<style/>").appendTo($("head", $(doc)))
                                 .text(css);
                }
                msg.pub("end", "core/style");
                cb();
            }
        };
    }
);

/*global respecEvents */

// Module core/utils
// As the name implies, this contains a ragtag gang of methods that just don't fit
// anywhere else.

define(
    'core/utils',["jquery"],
    function ($) {
        // --- JQUERY EXTRAS ------------------------------------------------------------------------------
        // Applies to any jQuery object containing elements, changes their name to the one give, and
        // return a jQuery object containing the new elements
        $.fn.renameElement = function (name) {
            var arr = [];
            this.each(function () {
                var $newEl = $(this.ownerDocument.createElement(name));
                // I forget why this didn't work, maybe try again
                // $newEl.attr($(this).attr());
                for (var i = 0, n = this.attributes.length; i < n; i++) {
                    var at = this.attributes[i];
                    $newEl[0].setAttributeNS(at.namespaceURI, at.name, at.value);
                }
                $(this).contents().appendTo($newEl);
                $(this).replaceWith($newEl);
                arr.push($newEl[0]);
            });
            return $(arr);
        };

        // For any element, returns a title string that applies the algorithm used for determining the
        // actual title of a <dfn> element (but can apply to other as well).
        $.fn.dfnTitle = function () {
            var title;
            if (this.attr("title")) title = this.attr("title");
            else if (this.contents().length == 1 && this.children("abbr, acronym").length == 1 &&
                     this.find(":first-child").attr("title")) title = this.find(":first-child").attr("title");
            else title = this.text();
            return title.toLowerCase().replace(/^\s+/, "").replace(/\s+$/, "").split(/\s+/).join(" ");
        };


        // Applied to an element, sets an ID for it (and returns it), using a specific prefix
        // if provided, and a specific text if given.
        $.fn.makeID = function (pfx, txt, noLC) {
            if (this.attr("id")) return this.attr("id");
            if (!txt) txt = this.attr("title") ? this.attr("title") : this.text();
            txt = txt.replace(/^\s+/, "").replace(/\s+$/, "");
            var id = noLC ? txt : txt.toLowerCase();
            id = id.split(/[^\-.0-9a-z_]+/i).join("-").replace(/^-+/, "").replace(/-+$/, "");
            if (/\.$/.test(id)) id += "x"; // trailing . doesn't play well with jQuery
            if (id.length > 0 && /^[^a-z]/i.test(id)) id = "x" + id;
            if (id.length === 0) id = "generatedID";
            if (pfx) id = pfx + "-" + id;
            var inc = 1
            ,   doc = this[0].ownerDocument;
            if ($("#" + id, doc).length) {
                while ($("#" + id + "-" + inc, doc).length) inc++;
                id += "-" + inc;
            }
            this.attr("id", id);
            return id;
        };

        // Returns all the descendant text nodes of an element. Note that those nodes aren't
        // returned as a jQuery array since I'm not sure if that would make too much sense.
        $.fn.allTextNodes = function (exclusions) {
            var textNodes = [],
                excl = {};
            for (var i = 0, n = exclusions.length; i < n; i++) excl[exclusions[i]] = true;
            function getTextNodes (node) {
                if (node.nodeType === 1 && excl[node.localName.toLowerCase()]) return;
                if (node.nodeType === 3) textNodes.push(node);
                else {
                    for (var i = 0, len = node.childNodes.length; i < len; ++i) getTextNodes(node.childNodes[i]);
                }
            }
            getTextNodes(this[0]);
            return textNodes;
        };
        
        
        var utils = {
            // --- SET UP
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/utils");
                msg.pub("end", "core/utils");
                cb();
            }

            // --- STRING HELPERS -----------------------------------------------------------------------------
            // Takes an array and returns a string that separates each of its items with the proper commas and
            // "and". The second argument is a mapping function that can convert the items before they are
            // joined
        ,   joinAnd:    function (arr, mapper) {
                if (!arr || !arr.length) return "";
                mapper = mapper || function (ret) { return ret; };
                var ret = "";
                if (arr.length === 1) return mapper(arr[0], 0);
                for (var i = 0, n = arr.length; i < n; i++) {
                    if (i > 0) {
                        if (n === 2) ret += ' ';
                        else         ret += ', ';
                        if (i == n - 1) ret += 'and ';
                    }
                    ret += mapper(arr[i], i);
                }
                return ret;
            }

            // Takes a string, applies some XML escapes, and returns the escaped string.
            // Note that overall using either Handlebars' escaped output or jQuery is much
            // preferred to operating on strings directly.
        ,   xmlEscape:    function (s) {
                return s.replace(/&/g, "&amp;")
                        .replace(/>/g, "&gt;")
                        .replace(/"/g, "&quot;")
                        .replace(/</g, "&lt;");
            }

            // Trims string at both ends and replaces all other white space with a single space
        ,   norm:   function (str) {
                return str.replace(/^\s+/, "").replace(/\s+$/, "").split(/\s+/).join(" ");
            }

            
            // --- DATE HELPERS -------------------------------------------------------------------------------
            // Takes a Date object and an optional separator and returns the year,month,day representation with
            // the custom separator (defaulting to none) and proper 0-padding
        ,   concatDate: function (date, sep) {
                if (!sep) sep = "";
                return "" + date.getFullYear() + sep + this.lead0(date.getMonth() + 1) + sep + this.lead0(date.getDate());
            }

            // takes a string, prepends a "0" if it is of length 1, does nothing otherwise
        ,   lead0:  function (str) {
                str = "" + str;
                return (str.length == 1) ? "0" + str : str;
            }
            
            // takes a YYYY-MM-DD date and returns a Date object for it
        ,   parseSimpleDate:    function (str) {
                return new Date(str.substr(0, 4), (str.substr(5, 2) - 1), str.substr(8, 2));
            }

            // takes what document.lastModified returns and produces a Date object for it
        ,   parseLastModified:    function (str) {
                if (!str) return new Date();
                return new Date(Date.parse(str));
                // return new Date(str.substr(6, 4), (str.substr(0, 2) - 1), str.substr(3, 2));
            }

            // list of human names for months (in English)
        ,   humanMonths: ["January", "February", "March", "April", "May", "June", "July",
                          "August", "September", "October", "November", "December"]
        
            // given either a Date object or a date in YYYY-MM-DD format, return a human-formatted
            // date suitable for use in a W3C specification
        ,   humanDate:  function (date) {
                if (!(date instanceof Date)) date = this.parseSimpleDate(date);
                return this.lead0(date.getDate()) + " " + this.humanMonths[date.getMonth()] + " " + date.getFullYear();
            }
            // given either a Date object or a date in YYYY-MM-DD format, return an ISO formatted
            // date suitable for use in a xsd:datetime item
        ,   isoDate:    function (date) {
                if (!(date instanceof Date)) date = this.parseSimpleDate(date);
                // return "" + date.getUTCFullYear() +'-'+ this.lead0(date.getUTCMonth() + 1)+'-' + this.lead0(date.getUTCDate()) +'T'+this.lead0(date.getUTCHours())+':'+this.lead0(date.getUTCMinutes()) +":"+this.lead0(date.getUTCSeconds())+'+0000';
                return date.toISOString() ;
            }
            
            
            // --- STYLE HELPERS ------------------------------------------------------------------------------
            // take a document and either a link or an array of links to CSS and appends a <link/> element
            // to the head pointing to each
        ,   linkCSS:  function (doc, styles) {
                if (!$.isArray(styles)) styles = [styles];
                $.each(styles, function (i, css) {
                    $('head', doc).append($("<link/>").attr({ rel: 'stylesheet', href: css }));
                });
            }

            // --- TRANSFORMATIONS ------------------------------------------------------------------------------
            // Run list of transforms over content and return result.
            // Please note that this is a legacy method that is only kept in order to maintain compatibility
            // with RSv1. It is therefore not tested and not actively supported.
        ,   runTransforms: function (content, flist) {
                var args = [this, content]
                ,   funcArgs = Array.prototype.slice.call(arguments)
                ;
                funcArgs.shift(); funcArgs.shift();
                args = args.concat(funcArgs);
                if (flist) {
                    var methods = flist.split(/\s+/);
                    for (var j = 0; j < methods.length; j++) {
                        var meth = methods[j];
                        if (window[meth]) {
                            // the initial call passed |this| directly, so we keep it that way
                            try {
                                content = window[meth].apply(this, args);
                            }
                            catch (e) {
                                respecEvents.pub("warn", "call to " + meth + "() failed with " + e) ;
                            }
                        }
                    }
                }
                return content;
            }
        };
        return utils;
    }
);


// Module w3c/style
// Inserts a link to the appropriate W3C style for the specification's maturity level.
// CONFIGURATION
//  - specStatus: the short code for the specification's maturity level or type (required)

define(
    'w3c/style',["core/utils"],
    function (utils) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "w3c/style");
                if (!conf.specStatus) msg.pub("error", "Configuration 'specStatus' is not set, required for w3c/style");
                var statStyle = conf.specStatus;
                if (statStyle === "FPWD"    ||
                    statStyle === "LC"      ||
                    statStyle === "WD-NOTE" ||
                    statStyle === "LC-NOTE") statStyle = "WD";
                if (statStyle === "FPWD-NOTE") statStyle = "WG-NOTE";
                if (statStyle === "finding" || statStyle === "draft-finding") statStyle = "base";
                var css = "https://";
                if (statStyle === "unofficial") {
                    css += "www.w3.org/StyleSheets/TR/w3c-unofficial";
                }
                else if (statStyle === "base") {
                    css += "www.w3.org/StyleSheets/TR/base";
                }
                else if (statStyle === "CG-DRAFT" || statStyle === "CG-FINAL" ||
                         statStyle === "BG-DRAFT" || statStyle === "BG-FINAL") {
                    // note: normally, the ".css" is not used in W3C, but here specifically it clashes
                    // with a PNG of the same base name. CONNEG must die.
                    css += "www.w3.org/community/src/css/spec/" + statStyle.toLowerCase() + ".css";
                }
                else {
                    css += "www.w3.org/StyleSheets/TR/W3C-" + statStyle;
                }
                utils.linkCSS(doc, css);
                msg.pub("end", "w3c/style");
                cb();
            }
        };
    }
);

// lib/handlebars/base.js
var Handlebars = {};

Handlebars.VERSION = "1.0.beta.6";

Handlebars.helpers  = {};
Handlebars.partials = {};

Handlebars.registerHelper = function(name, fn, inverse) {
  if(inverse) { fn.not = inverse; }
  this.helpers[name] = fn;
};

Handlebars.registerPartial = function(name, str) {
  this.partials[name] = str;
};

Handlebars.registerHelper('helperMissing', function(arg) {
  if(arguments.length === 2) {
    return undefined;
  } else {
    throw new Error("Could not find property '" + arg + "'");
  }
});

var toString = Object.prototype.toString, functionType = "[object Function]";

Handlebars.registerHelper('blockHelperMissing', function(context, options) {
  var inverse = options.inverse || function() {}, fn = options.fn;


  var ret = "";
  var type = toString.call(context);

  if(type === functionType) { context = context.call(this); }

  if(context === true) {
    return fn(this);
  } else if(context === false || context == null) {
    return inverse(this);
  } else if(type === "[object Array]") {
    if(context.length > 0) {
      for(var i=0, j=context.length; i<j; i++) {
        ret = ret + fn(context[i]);
      }
    } else {
      ret = inverse(this);
    }
    return ret;
  } else {
    return fn(context);
  }
});

Handlebars.registerHelper('each', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  var ret = "";

  if(context && context.length > 0) {
    for(var i=0, j=context.length; i<j; i++) {
      ret = ret + fn(context[i]);
    }
  } else {
    ret = inverse(this);
  }
  return ret;
});

Handlebars.registerHelper('if', function(context, options) {
  var type = toString.call(context);
  if(type === functionType) { context = context.call(this); }

  if(!context || Handlebars.Utils.isEmpty(context)) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

Handlebars.registerHelper('unless', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  options.fn = inverse;
  options.inverse = fn;

  return Handlebars.helpers['if'].call(this, context, options);
});

Handlebars.registerHelper('with', function(context, options) {
  return options.fn(context);
});

Handlebars.registerHelper('log', function(context) {
  Handlebars.log(context);
});
;
// lib/handlebars/compiler/parser.js
/* Jison generated parser */
var handlebars = (function(){

var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"root":3,"program":4,"EOF":5,"statements":6,"simpleInverse":7,"statement":8,"openInverse":9,"closeBlock":10,"openBlock":11,"mustache":12,"partial":13,"CONTENT":14,"COMMENT":15,"OPEN_BLOCK":16,"inMustache":17,"CLOSE":18,"OPEN_INVERSE":19,"OPEN_ENDBLOCK":20,"path":21,"OPEN":22,"OPEN_UNESCAPED":23,"OPEN_PARTIAL":24,"params":25,"hash":26,"param":27,"STRING":28,"INTEGER":29,"BOOLEAN":30,"hashSegments":31,"hashSegment":32,"ID":33,"EQUALS":34,"pathSegments":35,"SEP":36,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",14:"CONTENT",15:"COMMENT",16:"OPEN_BLOCK",18:"CLOSE",19:"OPEN_INVERSE",20:"OPEN_ENDBLOCK",22:"OPEN",23:"OPEN_UNESCAPED",24:"OPEN_PARTIAL",28:"STRING",29:"INTEGER",30:"BOOLEAN",33:"ID",34:"EQUALS",36:"SEP"},
productions_: [0,[3,2],[4,3],[4,1],[4,0],[6,1],[6,2],[8,3],[8,3],[8,1],[8,1],[8,1],[8,1],[11,3],[9,3],[10,3],[12,3],[12,3],[13,3],[13,4],[7,2],[17,3],[17,2],[17,2],[17,1],[25,2],[25,1],[27,1],[27,1],[27,1],[27,1],[26,1],[31,2],[31,1],[32,3],[32,3],[32,3],[32,3],[21,1],[35,3],[35,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return $$[$0-1] 
break;
case 2: this.$ = new yy.ProgramNode($$[$0-2], $$[$0]) 
break;
case 3: this.$ = new yy.ProgramNode($$[$0]) 
break;
case 4: this.$ = new yy.ProgramNode([]) 
break;
case 5: this.$ = [$$[$0]] 
break;
case 6: $$[$0-1].push($$[$0]); this.$ = $$[$0-1] 
break;
case 7: this.$ = new yy.InverseNode($$[$0-2], $$[$0-1], $$[$0]) 
break;
case 8: this.$ = new yy.BlockNode($$[$0-2], $$[$0-1], $$[$0]) 
break;
case 9: this.$ = $$[$0] 
break;
case 10: this.$ = $$[$0] 
break;
case 11: this.$ = new yy.ContentNode($$[$0]) 
break;
case 12: this.$ = new yy.CommentNode($$[$0]) 
break;
case 13: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]) 
break;
case 14: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]) 
break;
case 15: this.$ = $$[$0-1] 
break;
case 16: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]) 
break;
case 17: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1], true) 
break;
case 18: this.$ = new yy.PartialNode($$[$0-1]) 
break;
case 19: this.$ = new yy.PartialNode($$[$0-2], $$[$0-1]) 
break;
case 20: 
break;
case 21: this.$ = [[$$[$0-2]].concat($$[$0-1]), $$[$0]] 
break;
case 22: this.$ = [[$$[$0-1]].concat($$[$0]), null] 
break;
case 23: this.$ = [[$$[$0-1]], $$[$0]] 
break;
case 24: this.$ = [[$$[$0]], null] 
break;
case 25: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 26: this.$ = [$$[$0]] 
break;
case 27: this.$ = $$[$0] 
break;
case 28: this.$ = new yy.StringNode($$[$0]) 
break;
case 29: this.$ = new yy.IntegerNode($$[$0]) 
break;
case 30: this.$ = new yy.BooleanNode($$[$0]) 
break;
case 31: this.$ = new yy.HashNode($$[$0]) 
break;
case 32: $$[$0-1].push($$[$0]); this.$ = $$[$0-1] 
break;
case 33: this.$ = [$$[$0]] 
break;
case 34: this.$ = [$$[$0-2], $$[$0]] 
break;
case 35: this.$ = [$$[$0-2], new yy.StringNode($$[$0])] 
break;
case 36: this.$ = [$$[$0-2], new yy.IntegerNode($$[$0])] 
break;
case 37: this.$ = [$$[$0-2], new yy.BooleanNode($$[$0])] 
break;
case 38: this.$ = new yy.IdNode($$[$0]) 
break;
case 39: $$[$0-2].push($$[$0]); this.$ = $$[$0-2]; 
break;
case 40: this.$ = [$$[$0]] 
break;
}
},
table: [{3:1,4:2,5:[2,4],6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],24:[1,15]},{1:[3]},{5:[1,16]},{5:[2,3],7:17,8:18,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,19],20:[2,3],22:[1,13],23:[1,14],24:[1,15]},{5:[2,5],14:[2,5],15:[2,5],16:[2,5],19:[2,5],20:[2,5],22:[2,5],23:[2,5],24:[2,5]},{4:20,6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],24:[1,15]},{4:21,6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],24:[1,15]},{5:[2,9],14:[2,9],15:[2,9],16:[2,9],19:[2,9],20:[2,9],22:[2,9],23:[2,9],24:[2,9]},{5:[2,10],14:[2,10],15:[2,10],16:[2,10],19:[2,10],20:[2,10],22:[2,10],23:[2,10],24:[2,10]},{5:[2,11],14:[2,11],15:[2,11],16:[2,11],19:[2,11],20:[2,11],22:[2,11],23:[2,11],24:[2,11]},{5:[2,12],14:[2,12],15:[2,12],16:[2,12],19:[2,12],20:[2,12],22:[2,12],23:[2,12],24:[2,12]},{17:22,21:23,33:[1,25],35:24},{17:26,21:23,33:[1,25],35:24},{17:27,21:23,33:[1,25],35:24},{17:28,21:23,33:[1,25],35:24},{21:29,33:[1,25],35:24},{1:[2,1]},{6:30,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],24:[1,15]},{5:[2,6],14:[2,6],15:[2,6],16:[2,6],19:[2,6],20:[2,6],22:[2,6],23:[2,6],24:[2,6]},{17:22,18:[1,31],21:23,33:[1,25],35:24},{10:32,20:[1,33]},{10:34,20:[1,33]},{18:[1,35]},{18:[2,24],21:40,25:36,26:37,27:38,28:[1,41],29:[1,42],30:[1,43],31:39,32:44,33:[1,45],35:24},{18:[2,38],28:[2,38],29:[2,38],30:[2,38],33:[2,38],36:[1,46]},{18:[2,40],28:[2,40],29:[2,40],30:[2,40],33:[2,40],36:[2,40]},{18:[1,47]},{18:[1,48]},{18:[1,49]},{18:[1,50],21:51,33:[1,25],35:24},{5:[2,2],8:18,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,2],22:[1,13],23:[1,14],24:[1,15]},{14:[2,20],15:[2,20],16:[2,20],19:[2,20],22:[2,20],23:[2,20],24:[2,20]},{5:[2,7],14:[2,7],15:[2,7],16:[2,7],19:[2,7],20:[2,7],22:[2,7],23:[2,7],24:[2,7]},{21:52,33:[1,25],35:24},{5:[2,8],14:[2,8],15:[2,8],16:[2,8],19:[2,8],20:[2,8],22:[2,8],23:[2,8],24:[2,8]},{14:[2,14],15:[2,14],16:[2,14],19:[2,14],20:[2,14],22:[2,14],23:[2,14],24:[2,14]},{18:[2,22],21:40,26:53,27:54,28:[1,41],29:[1,42],30:[1,43],31:39,32:44,33:[1,45],35:24},{18:[2,23]},{18:[2,26],28:[2,26],29:[2,26],30:[2,26],33:[2,26]},{18:[2,31],32:55,33:[1,56]},{18:[2,27],28:[2,27],29:[2,27],30:[2,27],33:[2,27]},{18:[2,28],28:[2,28],29:[2,28],30:[2,28],33:[2,28]},{18:[2,29],28:[2,29],29:[2,29],30:[2,29],33:[2,29]},{18:[2,30],28:[2,30],29:[2,30],30:[2,30],33:[2,30]},{18:[2,33],33:[2,33]},{18:[2,40],28:[2,40],29:[2,40],30:[2,40],33:[2,40],34:[1,57],36:[2,40]},{33:[1,58]},{14:[2,13],15:[2,13],16:[2,13],19:[2,13],20:[2,13],22:[2,13],23:[2,13],24:[2,13]},{5:[2,16],14:[2,16],15:[2,16],16:[2,16],19:[2,16],20:[2,16],22:[2,16],23:[2,16],24:[2,16]},{5:[2,17],14:[2,17],15:[2,17],16:[2,17],19:[2,17],20:[2,17],22:[2,17],23:[2,17],24:[2,17]},{5:[2,18],14:[2,18],15:[2,18],16:[2,18],19:[2,18],20:[2,18],22:[2,18],23:[2,18],24:[2,18]},{18:[1,59]},{18:[1,60]},{18:[2,21]},{18:[2,25],28:[2,25],29:[2,25],30:[2,25],33:[2,25]},{18:[2,32],33:[2,32]},{34:[1,57]},{21:61,28:[1,62],29:[1,63],30:[1,64],33:[1,25],35:24},{18:[2,39],28:[2,39],29:[2,39],30:[2,39],33:[2,39],36:[2,39]},{5:[2,19],14:[2,19],15:[2,19],16:[2,19],19:[2,19],20:[2,19],22:[2,19],23:[2,19],24:[2,19]},{5:[2,15],14:[2,15],15:[2,15],16:[2,15],19:[2,15],20:[2,15],22:[2,15],23:[2,15],24:[2,15]},{18:[2,34],33:[2,34]},{18:[2,35],33:[2,35]},{18:[2,36],33:[2,36]},{18:[2,37],33:[2,37]}],
defaultActions: {16:[2,1],37:[2,23],53:[2,21]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    if (typeof this.lexer.yylloc == "undefined")
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    if (typeof this.yy.parseError === "function")
        this.parseError = this.yy.parseError;
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || 1;
        if (typeof token !== "number") {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol == null)
                symbol = lex();
            action = table[state] && table[state][symbol];
        }
        if (typeof action === "undefined" || !action.length || !action[0]) {
            if (!recovering) {
                expected = [];
                for (p in table[state])
                    if (this.terminals_[p] && p > 2) {
                        expected.push("'" + this.terminals_[p] + "'");
                    }
                var errStr = "";
                if (this.lexer.showPosition) {
                    errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + this.terminals_[symbol] + "'";
                } else {
                    errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1?"end of input":"'" + (this.terminals_[symbol] || symbol) + "'");
                }
                this.parseError(errStr, {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }
        }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0)
                    recovering--;
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column};
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== "undefined") {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}
};/* Jison generated lexer */
var lexer = (function(){

var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parseError) {
            this.yy.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext+=ch;
        this.yyleng++;
        this.match+=ch;
        this.matched+=ch;
        var lines = ch.match(/\n/);
        if (lines) this.yylineno++;
        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        this._input = ch + this._input;
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            match = this._input.match(this.rules[rules[i]]);
            if (match) {
                lines = match[0].match(/\n.*/g);
                if (lines) this.yylineno += lines.length;
                this.yylloc = {first_line: this.yylloc.last_line,
                               last_line: this.yylineno+1,
                               first_column: this.yylloc.last_column,
                               last_column: lines ? lines[lines.length-1].length-1 : this.yylloc.last_column + match[0].length}
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                this._more = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, rules[i],this.conditionStack[this.conditionStack.length-1]);
                if (token) return token;
                else return;
            }
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(), 
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    },
topState:function () {
        return this.conditionStack[this.conditionStack.length-2];
    },
pushState:function begin(condition) {
        this.begin(condition);
    }});
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0:
                                   if(yy_.yytext.slice(-1) !== "\\") this.begin("mu");
                                   if(yy_.yytext.slice(-1) === "\\") yy_.yytext = yy_.yytext.substr(0,yy_.yyleng-1), this.begin("emu");
                                   if(yy_.yytext) return 14;
                                 
break;
case 1: return 14; 
break;
case 2: this.popState(); return 14; 
break;
case 3: return 24; 
break;
case 4: return 16; 
break;
case 5: return 20; 
break;
case 6: return 19; 
break;
case 7: return 19; 
break;
case 8: return 23; 
break;
case 9: return 23; 
break;
case 10: yy_.yytext = yy_.yytext.substr(3,yy_.yyleng-5); this.popState(); return 15; 
break;
case 11: return 22; 
break;
case 12: return 34; 
break;
case 13: return 33; 
break;
case 14: return 33; 
break;
case 15: return 36; 
break;
case 16: /*ignore whitespace*/ 
break;
case 17: this.popState(); return 18; 
break;
case 18: this.popState(); return 18; 
break;
case 19: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2).replace(/\\"/g,'"'); return 28; 
break;
case 20: return 30; 
break;
case 21: return 30; 
break;
case 22: return 29; 
break;
case 23: return 33; 
break;
case 24: yy_.yytext = yy_.yytext.substr(1, yy_.yyleng-2); return 33; 
break;
case 25: return 'INVALID'; 
break;
case 26: return 5; 
break;
}
};
lexer.rules = [/^[^\x00]*?(?=(\{\{))/,/^[^\x00]+/,/^[^\x00]{2,}?(?=(\{\{))/,/^\{\{>/,/^\{\{#/,/^\{\{\//,/^\{\{\^/,/^\{\{\s*else\b/,/^\{\{\{/,/^\{\{&/,/^\{\{![\s\S]*?\}\}/,/^\{\{/,/^=/,/^\.(?=[} ])/,/^\.\./,/^[\/.]/,/^\s+/,/^\}\}\}/,/^\}\}/,/^"(\\["]|[^"])*"/,/^true(?=[}\s])/,/^false(?=[}\s])/,/^[0-9]+(?=[}\s])/,/^[a-zA-Z0-9_$-]+(?=[=}\s\/.])/,/^\[[^\]]*\]/,/^./,/^$/];
lexer.conditions = {"mu":{"rules":[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],"inclusive":false},"emu":{"rules":[2],"inclusive":false},"INITIAL":{"rules":[0,1,26],"inclusive":true}};return lexer;})()
parser.lexer = lexer;
return parser;
})();
if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = handlebars;
exports.parse = function () { return handlebars.parse.apply(handlebars, arguments); }
exports.main = function commonjsMain(args) {
    if (!args[1])
        throw new Error('Usage: '+args[0]+' FILE');
    if (typeof process !== 'undefined') {
        var source = require('fs').readFileSync(require('path').join(process.cwd(), args[1]), "utf8");
    } else {
        var cwd = require("file").path(require("file").cwd());
        var source = cwd.join(args[1]).read({charset: "utf-8"});
    }
    return exports.parser.parse(source);
}
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(typeof process !== 'undefined' ? process.argv.slice(1) : require("system").args);
}
};
;
// lib/handlebars/compiler/base.js
Handlebars.Parser = handlebars;

Handlebars.parse = function(string) {
  Handlebars.Parser.yy = Handlebars.AST;
  return Handlebars.Parser.parse(string);
};

Handlebars.print = function(ast) {
  return new Handlebars.PrintVisitor().accept(ast);
};

Handlebars.logger = {
  DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, level: 3,

  // override in the host environment
  log: function(level, str) {}
};

Handlebars.log = function(level, str) { Handlebars.logger.log(level, str); };
;
// lib/handlebars/compiler/ast.js
(function() {

  Handlebars.AST = {};

  Handlebars.AST.ProgramNode = function(statements, inverse) {
    this.type = "program";
    this.statements = statements;
    if(inverse) { this.inverse = new Handlebars.AST.ProgramNode(inverse); }
  };

  Handlebars.AST.MustacheNode = function(params, hash, unescaped) {
    this.type = "mustache";
    this.id = params[0];
    this.params = params.slice(1);
    this.hash = hash;
    this.escaped = !unescaped;
  };

  Handlebars.AST.PartialNode = function(id, context) {
    this.type    = "partial";

    // TODO: disallow complex IDs

    this.id      = id;
    this.context = context;
  };

  var verifyMatch = function(open, close) {
    if(open.original !== close.original) {
      throw new Handlebars.Exception(open.original + " doesn't match " + close.original);
    }
  };

  Handlebars.AST.BlockNode = function(mustache, program, close) {
    verifyMatch(mustache.id, close);
    this.type = "block";
    this.mustache = mustache;
    this.program  = program;
  };

  Handlebars.AST.InverseNode = function(mustache, program, close) {
    verifyMatch(mustache.id, close);
    this.type = "inverse";
    this.mustache = mustache;
    this.program  = program;
  };

  Handlebars.AST.ContentNode = function(string) {
    this.type = "content";
    this.string = string;
  };

  Handlebars.AST.HashNode = function(pairs) {
    this.type = "hash";
    this.pairs = pairs;
  };

  Handlebars.AST.IdNode = function(parts) {
    this.type = "ID";
    this.original = parts.join(".");

    var dig = [], depth = 0;

    for(var i=0,l=parts.length; i<l; i++) {
      var part = parts[i];

      if(part === "..") { depth++; }
      else if(part === "." || part === "this") { this.isScoped = true; }
      else { dig.push(part); }
    }

    this.parts    = dig;
    this.string   = dig.join('.');
    this.depth    = depth;
    this.isSimple = (dig.length === 1) && (depth === 0);
  };

  Handlebars.AST.StringNode = function(string) {
    this.type = "STRING";
    this.string = string;
  };

  Handlebars.AST.IntegerNode = function(integer) {
    this.type = "INTEGER";
    this.integer = integer;
  };

  Handlebars.AST.BooleanNode = function(bool) {
    this.type = "BOOLEAN";
    this.bool = bool;
  };

  Handlebars.AST.CommentNode = function(comment) {
    this.type = "comment";
    this.comment = comment;
  };

})();;
// lib/handlebars/utils.js
Handlebars.Exception = function(message) {
  var tmp = Error.prototype.constructor.apply(this, arguments);

  for (var p in tmp) {
    if (tmp.hasOwnProperty(p)) { this[p] = tmp[p]; }
  }

  this.message = tmp.message;
};
Handlebars.Exception.prototype = new Error;

// Build out our basic SafeString type
Handlebars.SafeString = function(string) {
  this.string = string;
};
Handlebars.SafeString.prototype.toString = function() {
  return this.string.toString();
};

(function() {
  var escape = {
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  };

  var badChars = /&(?!\w+;)|[<>"'`]/g;
  var possible = /[&<>"'`]/;

  var escapeChar = function(chr) {
    return escape[chr] || "&amp;";
  };

  Handlebars.Utils = {
    escapeExpression: function(string) {
      // don't escape SafeStrings, since they're already safe
      if (string instanceof Handlebars.SafeString) {
        return string.toString();
      } else if (string == null || string === false) {
        return "";
      }

      if(!possible.test(string)) { return string; }
      return string.replace(badChars, escapeChar);
    },

    isEmpty: function(value) {
      if (typeof value === "undefined") {
        return true;
      } else if (value === null) {
        return true;
      } else if (value === false) {
        return true;
      } else if(Object.prototype.toString.call(value) === "[object Array]" && value.length === 0) {
        return true;
      } else {
        return false;
      }
    }
  };
})();;
// lib/handlebars/compiler/compiler.js
Handlebars.Compiler = function() {};
Handlebars.JavaScriptCompiler = function() {};

(function(Compiler, JavaScriptCompiler) {
  Compiler.OPCODE_MAP = {
    appendContent: 1,
    getContext: 2,
    lookupWithHelpers: 3,
    lookup: 4,
    append: 5,
    invokeMustache: 6,
    appendEscaped: 7,
    pushString: 8,
    truthyOrFallback: 9,
    functionOrFallback: 10,
    invokeProgram: 11,
    invokePartial: 12,
    push: 13,
    assignToHash: 15,
    pushStringParam: 16
  };

  Compiler.MULTI_PARAM_OPCODES = {
    appendContent: 1,
    getContext: 1,
    lookupWithHelpers: 2,
    lookup: 1,
    invokeMustache: 3,
    pushString: 1,
    truthyOrFallback: 1,
    functionOrFallback: 1,
    invokeProgram: 3,
    invokePartial: 1,
    push: 1,
    assignToHash: 1,
    pushStringParam: 1
  };

  Compiler.DISASSEMBLE_MAP = {};

  for(var prop in Compiler.OPCODE_MAP) {
    var value = Compiler.OPCODE_MAP[prop];
    Compiler.DISASSEMBLE_MAP[value] = prop;
  }

  Compiler.multiParamSize = function(code) {
    return Compiler.MULTI_PARAM_OPCODES[Compiler.DISASSEMBLE_MAP[code]];
  };

  Compiler.prototype = {
    compiler: Compiler,

    disassemble: function() {
      var opcodes = this.opcodes, opcode, nextCode;
      var out = [], str, name, value;

      for(var i=0, l=opcodes.length; i<l; i++) {
        opcode = opcodes[i];

        if(opcode === 'DECLARE') {
          name = opcodes[++i];
          value = opcodes[++i];
          out.push("DECLARE " + name + " = " + value);
        } else {
          str = Compiler.DISASSEMBLE_MAP[opcode];

          var extraParams = Compiler.multiParamSize(opcode);
          var codes = [];

          for(var j=0; j<extraParams; j++) {
            nextCode = opcodes[++i];

            if(typeof nextCode === "string") {
              nextCode = "\"" + nextCode.replace("\n", "\\n") + "\"";
            }

            codes.push(nextCode);
          }

          str = str + " " + codes.join(" ");

          out.push(str);
        }
      }

      return out.join("\n");
    },

    guid: 0,

    compile: function(program, options) {
      this.children = [];
      this.depths = {list: []};
      this.options = options;

      // These changes will propagate to the other compiler components
      var knownHelpers = this.options.knownHelpers;
      this.options.knownHelpers = {
        'helperMissing': true,
        'blockHelperMissing': true,
        'each': true,
        'if': true,
        'unless': true,
        'with': true,
        'log': true
      };
      if (knownHelpers) {
        for (var name in knownHelpers) {
          this.options.knownHelpers[name] = knownHelpers[name];
        }
      }

      return this.program(program);
    },

    accept: function(node) {
      return this[node.type](node);
    },

    program: function(program) {
      var statements = program.statements, statement;
      this.opcodes = [];

      for(var i=0, l=statements.length; i<l; i++) {
        statement = statements[i];
        this[statement.type](statement);
      }
      this.isSimple = l === 1;

      this.depths.list = this.depths.list.sort(function(a, b) {
        return a - b;
      });

      return this;
    },

    compileProgram: function(program) {
      var result = new this.compiler().compile(program, this.options);
      var guid = this.guid++;

      this.usePartial = this.usePartial || result.usePartial;

      this.children[guid] = result;

      for(var i=0, l=result.depths.list.length; i<l; i++) {
        depth = result.depths.list[i];

        if(depth < 2) { continue; }
        else { this.addDepth(depth - 1); }
      }

      return guid;
    },

    block: function(block) {
      var mustache = block.mustache;
      var depth, child, inverse, inverseGuid;

      var params = this.setupStackForMustache(mustache);

      var programGuid = this.compileProgram(block.program);

      if(block.program.inverse) {
        inverseGuid = this.compileProgram(block.program.inverse);
        this.declare('inverse', inverseGuid);
      }

      this.opcode('invokeProgram', programGuid, params.length, !!mustache.hash);
      this.declare('inverse', null);
      this.opcode('append');
    },

    inverse: function(block) {
      var params = this.setupStackForMustache(block.mustache);

      var programGuid = this.compileProgram(block.program);

      this.declare('inverse', programGuid);

      this.opcode('invokeProgram', null, params.length, !!block.mustache.hash);
      this.declare('inverse', null);
      this.opcode('append');
    },

    hash: function(hash) {
      var pairs = hash.pairs, pair, val;

      this.opcode('push', '{}');

      for(var i=0, l=pairs.length; i<l; i++) {
        pair = pairs[i];
        val  = pair[1];

        this.accept(val);
        this.opcode('assignToHash', pair[0]);
      }
    },

    partial: function(partial) {
      var id = partial.id;
      this.usePartial = true;

      if(partial.context) {
        this.ID(partial.context);
      } else {
        this.opcode('push', 'depth0');
      }

      this.opcode('invokePartial', id.original);
      this.opcode('append');
    },

    content: function(content) {
      this.opcode('appendContent', content.string);
    },

    mustache: function(mustache) {
      var params = this.setupStackForMustache(mustache);

      this.opcode('invokeMustache', params.length, mustache.id.original, !!mustache.hash);

      if(mustache.escaped && !this.options.noEscape) {
        this.opcode('appendEscaped');
      } else {
        this.opcode('append');
      }
    },

    ID: function(id) {
      this.addDepth(id.depth);

      this.opcode('getContext', id.depth);

      this.opcode('lookupWithHelpers', id.parts[0] || null, id.isScoped || false);

      for(var i=1, l=id.parts.length; i<l; i++) {
        this.opcode('lookup', id.parts[i]);
      }
    },

    STRING: function(string) {
      this.opcode('pushString', string.string);
    },

    INTEGER: function(integer) {
      this.opcode('push', integer.integer);
    },

    BOOLEAN: function(bool) {
      this.opcode('push', bool.bool);
    },

    comment: function() {},

    // HELPERS
    pushParams: function(params) {
      var i = params.length, param;

      while(i--) {
        param = params[i];

        if(this.options.stringParams) {
          if(param.depth) {
            this.addDepth(param.depth);
          }

          this.opcode('getContext', param.depth || 0);
          this.opcode('pushStringParam', param.string);
        } else {
          this[param.type](param);
        }
      }
    },

    opcode: function(name, val1, val2, val3) {
      this.opcodes.push(Compiler.OPCODE_MAP[name]);
      if(val1 !== undefined) { this.opcodes.push(val1); }
      if(val2 !== undefined) { this.opcodes.push(val2); }
      if(val3 !== undefined) { this.opcodes.push(val3); }
    },

    declare: function(name, value) {
      this.opcodes.push('DECLARE');
      this.opcodes.push(name);
      this.opcodes.push(value);
    },

    addDepth: function(depth) {
      if(depth === 0) { return; }

      if(!this.depths[depth]) {
        this.depths[depth] = true;
        this.depths.list.push(depth);
      }
    },

    setupStackForMustache: function(mustache) {
      var params = mustache.params;

      this.pushParams(params);

      if(mustache.hash) {
        this.hash(mustache.hash);
      }

      this.ID(mustache.id);

      return params;
    }
  };

  JavaScriptCompiler.prototype = {
    // PUBLIC API: You can override these methods in a subclass to provide
    // alternative compiled forms for name lookup and buffering semantics
    nameLookup: function(parent, name, type) {
			if (/^[0-9]+$/.test(name)) {
        return parent + "[" + name + "]";
      } else if (JavaScriptCompiler.isValidJavaScriptVariableName(name)) {
	    	return parent + "." + name;
			}
			else {
				return parent + "['" + name + "']";
      }
    },

    appendToBuffer: function(string) {
      if (this.environment.isSimple) {
        return "return " + string + ";";
      } else {
        return "buffer += " + string + ";";
      }
    },

    initializeBuffer: function() {
      return this.quotedString("");
    },

    namespace: "Handlebars",
    // END PUBLIC API

    compile: function(environment, options, context, asObject) {
      this.environment = environment;
      this.options = options || {};

      this.name = this.environment.name;
      this.isChild = !!context;
      this.context = context || {
        programs: [],
        aliases: { self: 'this' },
        registers: {list: []}
      };

      this.preamble();

      this.stackSlot = 0;
      this.stackVars = [];

      this.compileChildren(environment, options);

      var opcodes = environment.opcodes, opcode;

      this.i = 0;

      for(l=opcodes.length; this.i<l; this.i++) {
        opcode = this.nextOpcode(0);

        if(opcode[0] === 'DECLARE') {
          this.i = this.i + 2;
          this[opcode[1]] = opcode[2];
        } else {
          this.i = this.i + opcode[1].length;
          this[opcode[0]].apply(this, opcode[1]);
        }
      }

      return this.createFunctionContext(asObject);
    },

    nextOpcode: function(n) {
      var opcodes = this.environment.opcodes, opcode = opcodes[this.i + n], name, val;
      var extraParams, codes;

      if(opcode === 'DECLARE') {
        name = opcodes[this.i + 1];
        val  = opcodes[this.i + 2];
        return ['DECLARE', name, val];
      } else {
        name = Compiler.DISASSEMBLE_MAP[opcode];

        extraParams = Compiler.multiParamSize(opcode);
        codes = [];

        for(var j=0; j<extraParams; j++) {
          codes.push(opcodes[this.i + j + 1 + n]);
        }

        return [name, codes];
      }
    },

    eat: function(opcode) {
      this.i = this.i + opcode.length;
    },

    preamble: function() {
      var out = [];

      // this register will disambiguate helper lookup from finding a function in
      // a context. This is necessary for mustache compatibility, which requires
      // that context functions in blocks are evaluated by blockHelperMissing, and
      // then proceed as if the resulting value was provided to blockHelperMissing.
      this.useRegister('foundHelper');

      if (!this.isChild) {
        var namespace = this.namespace;
        var copies = "helpers = helpers || " + namespace + ".helpers;";
        if(this.environment.usePartial) { copies = copies + " partials = partials || " + namespace + ".partials;"; }
        out.push(copies);
      } else {
        out.push('');
      }

      if (!this.environment.isSimple) {
        out.push(", buffer = " + this.initializeBuffer());
      } else {
        out.push("");
      }

      // track the last context pushed into place to allow skipping the
      // getContext opcode when it would be a noop
      this.lastContext = 0;
      this.source = out;
    },

    createFunctionContext: function(asObject) {
      var locals = this.stackVars;
      if (!this.isChild) {
        locals = locals.concat(this.context.registers.list);
      }

      if(locals.length > 0) {
        this.source[1] = this.source[1] + ", " + locals.join(", ");
      }

      // Generate minimizer alias mappings
      if (!this.isChild) {
        var aliases = []
        for (var alias in this.context.aliases) {
          this.source[1] = this.source[1] + ', ' + alias + '=' + this.context.aliases[alias];
        }
      }

      if (this.source[1]) {
        this.source[1] = "var " + this.source[1].substring(2) + ";";
      }

      // Merge children
      if (!this.isChild) {
        this.source[1] += '\n' + this.context.programs.join('\n') + '\n';
      }

      if (!this.environment.isSimple) {
        this.source.push("return buffer;");
      }

      var params = this.isChild ? ["depth0", "data"] : ["Handlebars", "depth0", "helpers", "partials", "data"];

      for(var i=0, l=this.environment.depths.list.length; i<l; i++) {
        params.push("depth" + this.environment.depths.list[i]);
      }

      if (asObject) {
        params.push(this.source.join("\n  "));

        return Function.apply(this, params);
      } else {
        var functionSource = 'function ' + (this.name || '') + '(' + params.join(',') + ') {\n  ' + this.source.join("\n  ") + '}';
        Handlebars.log(Handlebars.logger.DEBUG, functionSource + "\n\n");
        return functionSource;
      }
    },

    appendContent: function(content) {
      this.source.push(this.appendToBuffer(this.quotedString(content)));
    },

    append: function() {
      var local = this.popStack();
      this.source.push("if(" + local + " || " + local + " === 0) { " + this.appendToBuffer(local) + " }");
      if (this.environment.isSimple) {
        this.source.push("else { " + this.appendToBuffer("''") + " }");
      }
    },

    appendEscaped: function() {
      var opcode = this.nextOpcode(1), extra = "";
      this.context.aliases.escapeExpression = 'this.escapeExpression';

      if(opcode[0] === 'appendContent') {
        extra = " + " + this.quotedString(opcode[1][0]);
        this.eat(opcode);
      }

      this.source.push(this.appendToBuffer("escapeExpression(" + this.popStack() + ")" + extra));
    },

    getContext: function(depth) {
      if(this.lastContext !== depth) {
        this.lastContext = depth;
      }
    },

    lookupWithHelpers: function(name, isScoped) {
      if(name) {
        var topStack = this.nextStack();

        this.usingKnownHelper = false;

        var toPush;
        if (!isScoped && this.options.knownHelpers[name]) {
          toPush = topStack + " = " + this.nameLookup('helpers', name, 'helper');
          this.usingKnownHelper = true;
        } else if (isScoped || this.options.knownHelpersOnly) {
          toPush = topStack + " = " + this.nameLookup('depth' + this.lastContext, name, 'context');
        } else {
          this.register('foundHelper', this.nameLookup('helpers', name, 'helper'));
          toPush = topStack + " = foundHelper || " + this.nameLookup('depth' + this.lastContext, name, 'context');
        }

        toPush += ';';
        this.source.push(toPush);
      } else {
        this.pushStack('depth' + this.lastContext);
      }
    },

    lookup: function(name) {
      var topStack = this.topStack();
      this.source.push(topStack + " = (" + topStack + " === null || " + topStack + " === undefined || " + topStack + " === false ? " +
 				topStack + " : " + this.nameLookup(topStack, name, 'context') + ");");
    },

    pushStringParam: function(string) {
      this.pushStack('depth' + this.lastContext);
      this.pushString(string);
    },

    pushString: function(string) {
      this.pushStack(this.quotedString(string));
    },

    push: function(name) {
      this.pushStack(name);
    },

    invokeMustache: function(paramSize, original, hasHash) {
      this.populateParams(paramSize, this.quotedString(original), "{}", null, hasHash, function(nextStack, helperMissingString, id) {
        if (!this.usingKnownHelper) {
          this.context.aliases.helperMissing = 'helpers.helperMissing';
          this.context.aliases.undef = 'void 0';
          this.source.push("else if(" + id + "=== undef) { " + nextStack + " = helperMissing.call(" + helperMissingString + "); }");
          if (nextStack !== id) {
            this.source.push("else { " + nextStack + " = " + id + "; }");
          }
        }
      });
    },

    invokeProgram: function(guid, paramSize, hasHash) {
      var inverse = this.programExpression(this.inverse);
      var mainProgram = this.programExpression(guid);

      this.populateParams(paramSize, null, mainProgram, inverse, hasHash, function(nextStack, helperMissingString, id) {
        if (!this.usingKnownHelper) {
          this.context.aliases.blockHelperMissing = 'helpers.blockHelperMissing';
          this.source.push("else { " + nextStack + " = blockHelperMissing.call(" + helperMissingString + "); }");
        }
      });
    },

    populateParams: function(paramSize, helperId, program, inverse, hasHash, fn) {
      var needsRegister = hasHash || this.options.stringParams || inverse || this.options.data;
      var id = this.popStack(), nextStack;
      var params = [], param, stringParam, stringOptions;

      if (needsRegister) {
        this.register('tmp1', program);
        stringOptions = 'tmp1';
      } else {
        stringOptions = '{ hash: {} }';
      }

      if (needsRegister) {
        var hash = (hasHash ? this.popStack() : '{}');
        this.source.push('tmp1.hash = ' + hash + ';');
      }

      if(this.options.stringParams) {
        this.source.push('tmp1.contexts = [];');
      }

      for(var i=0; i<paramSize; i++) {
        param = this.popStack();
        params.push(param);

        if(this.options.stringParams) {
          this.source.push('tmp1.contexts.push(' + this.popStack() + ');');
        }
      }

      if(inverse) {
        this.source.push('tmp1.fn = tmp1;');
        this.source.push('tmp1.inverse = ' + inverse + ';');
      }

      if(this.options.data) {
        this.source.push('tmp1.data = data;');
      }

      params.push(stringOptions);

      this.populateCall(params, id, helperId || id, fn, program !== '{}');
    },

    populateCall: function(params, id, helperId, fn, program) {
      var paramString = ["depth0"].concat(params).join(", ");
      var helperMissingString = ["depth0"].concat(helperId).concat(params).join(", ");

      var nextStack = this.nextStack();

      if (this.usingKnownHelper) {
        this.source.push(nextStack + " = " + id + ".call(" + paramString + ");");
      } else {
        this.context.aliases.functionType = '"function"';
        var condition = program ? "foundHelper && " : ""
        this.source.push("if(" + condition + "typeof " + id + " === functionType) { " + nextStack + " = " + id + ".call(" + paramString + "); }");
      }
      fn.call(this, nextStack, helperMissingString, id);
      this.usingKnownHelper = false;
    },

    invokePartial: function(context) {
      params = [this.nameLookup('partials', context, 'partial'), "'" + context + "'", this.popStack(), "helpers", "partials"];

      if (this.options.data) {
        params.push("data");
      }

      this.pushStack("self.invokePartial(" + params.join(", ") + ");");
    },

    assignToHash: function(key) {
      var value = this.popStack();
      var hash = this.topStack();

      this.source.push(hash + "['" + key + "'] = " + value + ";");
    },

    // HELPERS

    compiler: JavaScriptCompiler,

    compileChildren: function(environment, options) {
      var children = environment.children, child, compiler;

      for(var i=0, l=children.length; i<l; i++) {
        child = children[i];
        compiler = new this.compiler();

        this.context.programs.push('');     // Placeholder to prevent name conflicts for nested children
        var index = this.context.programs.length;
        child.index = index;
        child.name = 'program' + index;
        this.context.programs[index] = compiler.compile(child, options, this.context);
      }
    },

    programExpression: function(guid) {
      if(guid == null) { return "self.noop"; }

      var child = this.environment.children[guid],
          depths = child.depths.list;
      var programParams = [child.index, child.name, "data"];

      for(var i=0, l = depths.length; i<l; i++) {
        depth = depths[i];

        if(depth === 1) { programParams.push("depth0"); }
        else { programParams.push("depth" + (depth - 1)); }
      }

      if(depths.length === 0) {
        return "self.program(" + programParams.join(", ") + ")";
      } else {
        programParams.shift();
        return "self.programWithDepth(" + programParams.join(", ") + ")";
      }
    },

    register: function(name, val) {
      this.useRegister(name);
      this.source.push(name + " = " + val + ";");
    },

    useRegister: function(name) {
      if(!this.context.registers[name]) {
        this.context.registers[name] = true;
        this.context.registers.list.push(name);
      }
    },

    pushStack: function(item) {
      this.source.push(this.nextStack() + " = " + item + ";");
      return "stack" + this.stackSlot;
    },

    nextStack: function() {
      this.stackSlot++;
      if(this.stackSlot > this.stackVars.length) { this.stackVars.push("stack" + this.stackSlot); }
      return "stack" + this.stackSlot;
    },

    popStack: function() {
      return "stack" + this.stackSlot--;
    },

    topStack: function() {
      return "stack" + this.stackSlot;
    },

    quotedString: function(str) {
      return '"' + str
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r') + '"';
    }
  };

  var reservedWords = (
    "break else new var" +
    " case finally return void" +
    " catch for switch while" +
    " continue function this with" +
    " default if throw" +
    " delete in try" +
    " do instanceof typeof" +
    " abstract enum int short" +
    " boolean export interface static" +
    " byte extends long super" +
    " char final native synchronized" +
    " class float package throws" +
    " const goto private transient" +
    " debugger implements protected volatile" +
    " double import public let yield"
  ).split(" ");

  var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};

  for(var i=0, l=reservedWords.length; i<l; i++) {
    compilerWords[reservedWords[i]] = true;
  }

	JavaScriptCompiler.isValidJavaScriptVariableName = function(name) {
		if(!JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]+$/.test(name)) {
			return true;
		}
		return false;
	}

})(Handlebars.Compiler, Handlebars.JavaScriptCompiler);

Handlebars.precompile = function(string, options) {
  options = options || {};

  var ast = Handlebars.parse(string);
  var environment = new Handlebars.Compiler().compile(ast, options);
  return new Handlebars.JavaScriptCompiler().compile(environment, options);
};

Handlebars.compile = function(string, options) {
  options = options || {};

  var compiled;
  function compile() {
    var ast = Handlebars.parse(string);
    var environment = new Handlebars.Compiler().compile(ast, options);
    var templateSpec = new Handlebars.JavaScriptCompiler().compile(environment, options, undefined, true);
    return Handlebars.template(templateSpec);
  }

  // Template is only compiled on first use and cached after that point.
  return function(context, options) {
    if (!compiled) {
      compiled = compile();
    }
    return compiled.call(this, context, options);
  };
};
;
// lib/handlebars/runtime.js
Handlebars.VM = {
  template: function(templateSpec) {
    // Just add water
    var container = {
      escapeExpression: Handlebars.Utils.escapeExpression,
      invokePartial: Handlebars.VM.invokePartial,
      programs: [],
      program: function(i, fn, data) {
        var programWrapper = this.programs[i];
        if(data) {
          return Handlebars.VM.program(fn, data);
        } else if(programWrapper) {
          return programWrapper;
        } else {
          programWrapper = this.programs[i] = Handlebars.VM.program(fn);
          return programWrapper;
        }
      },
      programWithDepth: Handlebars.VM.programWithDepth,
      noop: Handlebars.VM.noop
    };

    return function(context, options) {
      options = options || {};
      return templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);
    };
  },

  programWithDepth: function(fn, data, $depth) {
    var args = Array.prototype.slice.call(arguments, 2);

    return function(context, options) {
      options = options || {};

      return fn.apply(this, [context, options.data || data].concat(args));
    };
  },
  program: function(fn, data) {
    return function(context, options) {
      options = options || {};

      return fn(context, options.data || data);
    };
  },
  noop: function() { return ""; },
  invokePartial: function(partial, name, context, helpers, partials, data) {
    options = { helpers: helpers, partials: partials, data: data };

    if(partial === undefined) {
      throw new Handlebars.Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, options);
    } else if (!Handlebars.compile) {
      throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    } else {
      partials[name] = Handlebars.compile(partial);
      return partials[name](context, options);
    }
  }
};

Handlebars.template = Handlebars.VM.template;
;

define("handlebars", function(){});

/*global Handlebars*/

define('tmpl',["handlebars", "text"], function (hb, text) {
    var buildMap = {};
    return {
        load:   function (name, req, onLoad, config) {
            return text.load(name, req, function (content) {
                if (config.isBuild && config.inlineText) buildMap[name] = content;
                onLoad(config.isBuild ? content : Handlebars.compile(content));
            }, config);
        }
    ,   write:  function (pluginName, moduleName, write) {
            if (moduleName in buildMap) {
                var content = text.jsEscape(buildMap[moduleName]);
                write("define('" + pluginName + "!" + moduleName  +
                      "', ['handlebars'], function (hb) { return Handlebars.compile('" + content + "');});\n");
            }
        }
    };
});

define('tmpl!w3c/templates/headers.html', ['handlebars'], function (hb) { return Handlebars.compile('<div class=\'head\'>\n  <p>\n    {{#if prependW3C}}\n      <a href=\'http://www.w3.org/\'><img width=\'72\' height=\'48\' src=\'https://www.w3.org/Icons/w3c_home\' alt=\'W3C\'/></a>\n    {{/if}}\n  </p>\n  <h1 class=\'title p-name\' id=\'title\'{{#if doRDFa}} property=\'dcterms:title\'{{/if}}>{{title}}</h1>\n  {{#if subtitle}}\n    <h2 {{#if doRDFa}}property=\'bibo:subtitle\' {{/if}}id=\'subtitle\'>{{subtitle}}</h2>\n  {{/if}}\n  <h2 {{#if doRDFa}}property="dcterms:issued" datatype="xsd:dateTime" content="{{publishISODate}}"{{/if}}>{{#if prependW3C}}W3C {{/if}}{{textStatus}} <time class=\'dt-published\' datetime=\'{{dashDate}}\'>{{publishHumanDate}}</time></h2>\n  <dl>\n    {{#unless isNoTrack}}\n      <dt>This version:</dt>\n      <dd><a class=\'u-url\' href=\'{{thisVersion}}\'>{{thisVersion}}</a></dd>\n      <dt>Latest published version:</dt>\n      <dd>{{#if latestVersion}}<a href=\'{{latestVersion}}\'>{{latestVersion}}</a>{{else}}none{{/if}}</dd>\n    {{/unless}}\n    {{#if edDraftURI}}\n      <dt>Latest editor\'s draft:</dt>\n      <dd><a href=\'{{edDraftURI}}\'>{{edDraftURI}}</a></dd>\n    {{/if}}\n    {{#if testSuiteURI}}\n      <dt>Test suite:</dt>\n      <dd><a href=\'{{testSuiteURI}}\'>{{testSuiteURI}}</a></dd>\n    {{/if}}\n    {{#if implementationReportURI}}\n      <dt>Implementation report:</dt>\n      <dd><a href=\'{{implementationReportURI}}\'>{{implementationReportURI}}</a></dd>\n    {{/if}}\n    {{#if isED}}\n      {{#if prevED}}\n        <dt>Previous editor\'s draft:</dt>\n        <dd><a href=\'{{prevED}}\'>{{prevED}}</a></dd>\n      {{/if}}\n    {{/if}}\n    {{#if showPreviousVersion}}\n      <dt>Previous version:</dt>\n      <dd><a {{#if doRDFa}}rel="dcterms:replaces"{{/if}} href=\'{{prevVersion}}\'>{{prevVersion}}</a></dd>\n    {{/if}}\n    {{#if prevRecURI}}\n      {{#if isRec}}\n          <dt>Previous Recommendation:</dt>\n          <dd><a {{#if doRDFa}}rel="dcterms:replaces"{{/if}} href=\'{{prevRecURI}}\'>{{prevRecURI}}</a></dd>\n      {{else}}\n          <dt>Latest Recommendation:</dt>\n          <dd><a href=\'{{prevRecURI}}\'>{{prevRecURI}}</a></dd>\n      {{/if}}\n    {{/if}}\n    <dt>Editor{{#if multipleEditors}}s{{/if}}:</dt>\n    {{showPeople "Editor" editors}}\n    {{#if authors}}\n      <dt>Author{{#if multipleAuthors}}s{{/if}}:</dt>\n      {{showPeople "Author" authors}}\n    {{/if}}\n    {{#if otherLinks}}\n      {{#each otherLinks}}\n        {{#if key}}\n          <dt {{#if class}}class="{{class}}"{{/if}}>{{key}}:</dt>\n          {{#if data}}\n             {{#each data}}\n                {{#if value}}\n                  <dd {{#if class}}class="{{class}}"{{/if}}>\n                    {{#if href}}<a href="{{href}}">{{/if}}\n                      {{value}}\n                    {{#if href}}</a>{{/if}}\n                  </dd>\n                {{else}}\n                  {{#if href}}\n                    <dd><a href="{{href}}">{{href}}</a></dd>\n                  {{/if}}\n                {{/if}}\n             {{/each}}\n          {{else}}\n            {{#if value}}\n              <dd {{#if class}}class="{{class}}"{{/if}}>\n                {{#if href}}<a href="{{href}}">{{/if}}\n                  {{value}}\n                {{#if href}}</a>{{/if}}\n              </dd>\n            {{else}}\n              {{#if href}}\n                <dd {{#if class}}class="{{class}}"{{/if}}>\n                  <a href="{{href}}">{{href}}</a>\n                </dd>\n              {{/if}}\n            {{/if}}\n          {{/if}}\n        {{/if}}\n      {{/each}}\n    {{/if}}\n  </dl>\n  {{#if errata}}\n    <p>\n      Please refer to the <a href="{{errata}}"><strong>errata</strong></a> for this document, which may include some normative corrections.\n    </p>\n  {{/if}}\n  {{#if alternateFormats}}\n    <p>\n      {{#if multipleAlternates}}\n        This document is also available in these non-normative formats:\n      {{else}}\n        This document is also available in this non-normative format:\n      {{/if}}\n      {{{alternatesHTML}}}\n    </p>\n  {{/if}}\n  {{#if isRec}}\n    <p>\n      The English version of this specification is the only normative version. Non-normative\n      <a href="http://www.w3.org/Consortium/Translation/">translations</a> may also be available.\n    </p>\n  {{/if}}\n  {{#if isUnofficial}}\n    {{#if additionalCopyrightHolders}}\n      <p class=\'copyright\'>{{{additionalCopyrightHolders}}}</p>\n    {{else}}\n      {{#if overrideCopyright}}\n        {{{overrideCopyright}}}\n      {{else}}\n        <p class=\'copyright\'>\n          This document is licensed under a\n          <a class=\'subfoot\' href=\'http://creativecommons.org/licenses/by/3.0/\' rel=\'license\'>Creative Commons\n          Attribution 3.0 License</a>.\n        </p>\n      {{/if}}\n    {{/if}}\n  {{else}}\n    {{#if overrideCopyright}}\n      {{{overrideCopyright}}}\n    {{else}}\n      <p class=\'copyright\'>\n        <a href=\'http://www.w3.org/Consortium/Legal/ipr-notice#Copyright\'>Copyright</a> &copy;\n        {{#if copyrightStart}}{{copyrightStart}}-{{/if}}{{publishYear}}\n        {{#if additionalCopyrightHolders}} {{{additionalCopyrightHolders}}} &amp;{{/if}}\n        <a href=\'http://www.w3.org/\'><abbr title=\'World Wide Web Consortium\'>W3C</abbr></a><sup>&reg;</sup>\n        (<a href=\'http://www.csail.mit.edu/\'><abbr title=\'Massachusetts Institute of Technology\'>MIT</abbr></a>,\n        <a href=\'http://www.ercim.eu/\'><abbr title=\'European Research Consortium for Informatics and Mathematics\'>ERCIM</abbr></a>,\n        <a href=\'http://www.keio.ac.jp/\'>Keio</a>, <a href="http://ev.buaa.edu.cn/">Beihang</a>), \n        {{#if isCCBY}}\n          Some Rights Reserved: this document is dual-licensed,\n          <a href="https://creativecommons.org/licenses/by/3.0/">CC-BY</a> and \n          <a href="http://www.w3.org/Consortium/Legal/copyright-documents">W3C Document License</a>.\n        {{else}}\n        All Rights Reserved.\n        {{/if}}\n        W3C <a href=\'http://www.w3.org/Consortium/Legal/ipr-notice#Legal_Disclaimer\'>liability</a>,\n        <a href=\'http://www.w3.org/Consortium/Legal/ipr-notice#W3C_Trademarks\'>trademark</a> and\n        <a href=\'http://www.w3.org/Consortium/Legal/copyright-documents\'>document use</a> rules apply.\n      </p>\n    {{/if}}\n  {{/if}}\n  <hr/>\n</div>\n');});

define('tmpl!w3c/templates/sotd.html', ['handlebars'], function (hb) { return Handlebars.compile('<section id=\'sotd\' class=\'introductory\'><h2>Status of This Document</h2>\n  {{#if isUnofficial}}\n    <p>\n      This document is merely a public working draft of a potential specification. It has\n      no official standing of any kind and does not represent the support or consensus of any\n      standards organisation.\n    </p>\n    {{{sotdCustomParagraph}}}\n  {{else}}\n    {{#if isTagFinding}}\n      {{#if sotdCustomParagraph}}\n        {{{sotdCustomParagraph}}}\n      {{else}}\n        <p style=\'color: red\'>\n          ReSpec does not support automated SotD generation for TAG findings, please specify one using a \n          <code>&lt;section></code> element with ID=sotd.\n        </p>\n      {{/if}}\n    {{else}}\n      {{#if isNoTrack}}\n        <p>\n          This document is merely a W3C-internal {{#if isMO}}member-confidential{{/if}} document. It has no\n          official standing of any kind and does not represent consensus of the W3C Membership.\n        </p>\n        {{{sotdCustomParagraph}}}\n      {{else}}\n        <p>\n          <em>This section describes the status of this document at the time of its publication. Other\n          documents may supersede this document. A list of current W3C publications and the latest revision\n          of this technical report can be found in the <a href=\'http://www.w3.org/TR/\'>W3C technical reports\n          index</a> at http://www.w3.org/TR/.</em>\n        </p>\n        {{{sotdCustomParagraph}}}\n        <p>\n          This document was published by the {{{wgHTML}}} as {{anOrA}} {{longStatus}}.\n          {{#if notYetRec}}\n            This document is intended to become a W3C Recommendation.\n          {{/if}}\n          {{#if isPR}}\n          {{else}}\n          If you wish to make comments regarding this document, please send them to \n          <a href=\'mailto:{{wgPublicList}}@w3.org{{#if subjectPrefix}}?subject={{subjectPrefix}}{{/if}}\'>{{wgPublicList}}@w3.org</a> \n          (<a href=\'mailto:{{wgPublicList}}-request@w3.org?subject=subscribe\'>subscribe</a>,\n          <a\n              href=\'http://lists.w3.org/Archives/Public/{{wgPublicList}}/\'>archives</a>){{#if subjectPrefix}}\n          with <code>{{subjectPrefix}}</code> at the start of your email\'s subject.{{/if}}.\n          {{/if}}\n          {{#if isLC}}The Last Call period ends {{humanLCEnd}}.{{/if}}\n          {{#if isCR}}\n            W3C publishes a Candidate Recommendation to indicate that the document is believed\n            to be stable and to encourage implementation by the developer community. This\n            Candidate Recommendation is expected to advance to Proposed Recommendation no earlier than\n            {{humanCREnd}}.\n          {{/if}}\n          {{#if isPR}}\n              The W3C Membership and other interested parties are invited\n              to review the document and send comments to\n              <a rel=\'discussion\' href=\'mailto:{{wgPublicList}}@w3.org\'>{{wgPublicList}}@w3.org</a> \n              (<a href=\'mailto:{{wgPublicList}}-request@w3.org?subject=subscribe\'>subscribe</a>,\n              <a href=\'http://lists.w3.org/Archives/Public/{{wgPublicList}}/\'>archives</a>)\n              through {{humanPREnd}}.\n              Advisory Committee Representatives should consult their\n              <a href=\'https://www.w3.org/2002/09/wbs/myQuestionnaires\'>WBS questionnaires</a>. \n              Note that substantive technical comments were expected during the Last Call review period that ended {{humanLCEnd}}.\n            </p>\n            {{#if implementationReportURI}}\n              <p>\n                Please see the Working Group\'s  <a href=\'{{implementationReportURI}}\'>implementation\n                report</a>.\n              </p>\n            {{/if}}\n          {{else}}\n            All comments are welcome.</p>\n          {{/if}}\n        {{#if notRec}}\n          <p>\n            Publication as {{anOrA}} {{textStatus}} does not imply endorsement by the W3C Membership.\n            This is a draft document and may be updated, replaced or obsoleted by other documents at \n            any time. It is inappropriate to cite this document as other than work in progress.\n          </p>\n        {{/if}}\n        {{#if isLC}}\n          <p>\n            This is a Last Call Working Draft and thus the Working Group has determined that this document has satisfied the\n            relevant technical requirements and is sufficiently stable to advance through the Technical Recommendation process.\n          </p>\n        {{/if}}\n        <p>\n          {{#unless isIGNote}}\n            This document was produced by a group operating under the \n            {{#if doRDFa}} \n                <a id="sotd_patent" about=\'\' rel=\'w3p:patentRules\' href=\'http://www.w3.org/Consortium/Patent-Policy-20040205/\'>5 February 2004 W3C Patent Policy</a>.\n            {{else}}\n                <a href=\'http://www.w3.org/Consortium/Patent-Policy-20040205/\'>5 February 2004 W3C Patent Policy</a>.\n            {{/if}}\n          {{/unless}}\n          {{#if recNotExpected}}The group does not expect this document to become a W3C Recommendation.{{/if}}\n          {{#unless isIGNote}}\n            {{#if multipleWGs}}\n              W3C maintains a public list of any patent disclosures ({{{wgPatentHTML}}})\n            {{else}}\n              W3C maintains a <a href=\'{{wgPatentURI}}\' rel=\'disclosure\'>public list of any patent disclosures</a> \n            {{/if}}\n            made in connection with the deliverables of the group; that page also includes instructions for \n            disclosing a patent. An individual who has actual knowledge of a patent which the individual believes contains\n            <a href=\'http://www.w3.org/Consortium/Patent-Policy-20040205/#def-essential\'>Essential Claim(s)</a> must disclose the\n            information in accordance with <a href=\'http://www.w3.org/Consortium/Patent-Policy-20040205/#sec-Disclosure\'>section\n            6 of the W3C Patent Policy</a>.\n          {{/unless}}\n          {{#if isIGNote}}\n            The disclosure obligations of the Participants of this group are described in the \n            <a href=\'{{charterDisclosureURI}}\'>charter</a>. \n          {{/if}}\n        </p>\n        {{#if addPatentNote}}<p>{{{addPatentNote}}}</p>{{/if}}\n      {{/if}}\n    {{/if}}\n  {{/if}}\n</section>\n\n');});

define('tmpl!w3c/templates/cgbg-headers.html', ['handlebars'], function (hb) { return Handlebars.compile('<div class=\'head\'>\n  <p>\n    <a href=\'http://www.w3.org/\'><img width=\'72\' height=\'48\' src=\'https://www.w3.org/Icons/w3c_home\' alt=\'W3C\'/></a>\n  </p>\n  <h1 class=\'title p-name\' id=\'title\'{{#if doRDFa}} property=\'dcterms:title\'{{/if}}>{{title}}</h1>\n  {{#if subtitle}}\n    <h2 {{#if doRDFa}}property=\'bibo:subtitle\' {{/if}}id=\'subtitle\'>{{subtitle}}</h2>\n  {{/if}}\n  <h2 {{#if doRDFa}}property="dcterms:issued" datatype="xsd:dateTime" content="{{publishISODate}}"{{/if}}>{{longStatus}} <time class=\'dt-published\' datetime=\'{{dashDate}}\'>{{publishHumanDate}}</time></h2>\n  <dl>\n    {{#if thisVersion}}\n      <dt>This version:</dt>\n      <dd><a class=\'u-url\' href=\'{{thisVersion}}\'>{{thisVersion}}</a></dd>\n    {{/if}}\n    {{#if latestVersion}}\n      <dt>Latest published version:</dt>\n      <dd><a href=\'{{latestVersion}}\'>{{latestVersion}}</a></dd>\n    {{/if}}\n    {{#if edDraftURI}}\n      <dt>Latest editor\'s draft:</dt>\n      <dd><a href=\'{{edDraftURI}}\'>{{edDraftURI}}</a></dd>\n    {{/if}}\n    {{#if testSuiteURI}}\n      <dt>Test suite:</dt>\n      <dd><a href=\'{{testSuiteURI}}\'>{{testSuiteURI}}</a></dd>\n    {{/if}}\n    {{#if implementationReportURI}}\n      <dt>Implementation report:</dt>\n      <dd><a href=\'{{implementationReportURI}}\'>{{implementationReportURI}}</a></dd>\n    {{/if}}\n    {{#if prevVersion}}\n      <dt>Previous version:</dt>\n      <dd><a {{#if doRDFa}}rel="dcterms:replaces"{{/if}} href=\'{{prevVersion}}\'>{{prevVersion}}</a></dd>\n    {{/if}}\n    {{#unless isCGFinal}}\n      {{#if prevED}}\n        <dt>Previous editor\'s draft:</dt>\n        <dd><a href=\'{{prevED}}\'>{{prevED}}</a></dd>\n      {{/if}}\n    {{/unless}}\n    <dt>Editor{{#if multipleEditors}}s{{/if}}:</dt>\n    {{showPeople "Editor" editors}}\n    {{#if authors}}\n      <dt>Author{{#if multipleAuthors}}s{{/if}}:</dt>\n      {{showPeople "Author" authors}}\n    {{/if}}\n  </dl>\n  {{#if alternateFormats}}\n    <p>\n      {{#if multipleAlternates}}\n        This document is also available in these non-normative formats: \n      {{else}}\n        This document is also available in this non-normative format: \n      {{/if}}\n      {{{alternatesHTML}}}\n    </p>\n  {{/if}}\n  <p class=\'copyright\'>\n    <a href=\'http://www.w3.org/Consortium/Legal/ipr-notice#Copyright\'>Copyright</a> &copy; \n    {{#if copyrightStart}}{{copyrightStart}}-{{/if}}{{publishYear}}\n    the Contributors to the {{title}} Specification, published by the\n    <a href=\'{{wgURI}}\'>{{wg}}</a> under the\n    {{#if isCGFinal}}\n      <a href="https://www.w3.org/community/about/agreements/fsa/">W3C Community Final Specification Agreement (FSA)</a>. \n      A human-readable <a href="http://www.w3.org/community/about/agreements/fsa-deed/">summary</a> is available.\n    {{else}}\n      <a href="https://www.w3.org/community/about/agreements/cla/">W3C Community Contributor License Agreement (CLA)</a>.\n      A human-readable <a href="http://www.w3.org/community/about/agreements/cla-deed/">summary</a> is available.\n    {{/if}}\n  </p>\n  <hr/>\n</div>\n');});

define('tmpl!w3c/templates/cgbg-sotd.html', ['handlebars'], function (hb) { return Handlebars.compile('<section id=\'sotd\' class=\'introductory\'><h2>Status of This Document</h2>\n  <p>\n    This specification was published by the <a href=\'{{wgURI}}\'>{{wg}}</a>.\n    It is not a W3C Standard nor is it on the W3C Standards Track.\n    {{#if isCGFinal}}\n      Please note that under the \n      <a href="https://www.w3.org/community/about/agreements/final/">W3C Community Final Specification Agreement (FSA)</a> \n      other conditions apply.\n    {{else}}\n      Please note that under the \n      <a href="https://www.w3.org/community/about/agreements/cla/">W3C Community Contributor License Agreement (CLA)</a>\n      there is a limited opt-out and other conditions apply.\n    {{/if}}\n    Learn more about \n    <a href="http://www.w3.org/community/">W3C Community and Business Groups</a>.\n  </p>\n  {{{sotdCustomParagraph}}}\n</section>\n');});

/*jshint
    forin: false
*/
/*global Handlebars*/

// Module w3c/headers
// Generate the headers material based on the provided configuration.
// CONFIGURATION
//  - specStatus: the short code for the specification's maturity level or type (required)
//  - shortName: the small name that is used after /TR/ in published reports (required)
//  - editors: an array of people editing the document (at least one is required). People
//      are defined using:
//          - name: the person's name (required)
//          - url: URI for the person's home page
//          - company: the person's company
//          - companyURL: the URI for the person's company
//          - mailto: the person's email
//          - note: a note on the person (e.g. former editor)
//  - authors: an array of people who are contributing authors of the document.
//  - subtitle: a subtitle for the specification
//  - publishDate: the date to use for the publication, default to document.lastModified, and
//      failing that to now. The format is YYYY-MM-DD or a Date object.
//  - previousPublishDate: the date on which the previous version was published.
//  - previousMaturity: the specStatus of the previous version
//  - errata: the URI of the errata document, if any
//  - alternateFormats: a list of alternate formats for the document, each of which being
//      defined by:
//          - uri: the URI to the alternate
//          - label: a label for the alternate
//          - lang: optional language
//          - type: optional MIME type
//  - testSuiteURI: the URI to the test suite, if any
//  - implementationReportURI: the URI to the implementation report, if any
//  - noRecTrack: set to true if this document is not intended to be on the Recommendation track
//  - edDraftURI: the URI of the Editor's Draft for this document, if any. Required if
//      specStatus is set to "ED".
//  - additionalCopyrightHolders: a copyright owner in addition to W3C (or the only one if specStatus
//      is unofficial)
//  - overrideCopyright: provides markup to completely override the copyright
//  - copyrightStart: the year from which the copyright starts running
//  - prevED: the URI of the previous Editor's Draft if it has moved
//  - prevRecShortname: the short name of the previous Recommendation, if the name has changed
//  - prevRecURI: the URI of the previous Recommendation if not directly generated from
//    prevRecShortname.
//  - wg: the name of the WG in charge of the document. This may be an array in which case wgURI
//      and wgPatentURI need to be arrays as well, of the same length and in the same order
//  - wgURI: the URI to the group's page, or an array of such
//  - wgPatentURI: the URI to the group's patent information page, or an array of such. NOTE: this
//      is VERY IMPORTANT information to provide and get right, do not just paste this without checking
//      that you're doing it right
//  - wgPublicList: the name of the mailing list where discussion takes place. Note that this cannot
//      be an array as it is assumed that there is a single list to discuss the document, even if it
//      is handled by multiple groups
//  - charterDisclosureURI: used for IGs (when publishing IG-NOTEs) to provide a link to the IPR commitment
//      defined in their charter.
//  - addPatentNote: used to add patent-related information to the SotD, for instance if there's an open
//      PAG on the document.
//  - thisVersion: the URI to the dated current version of the specification. ONLY ever use this for CG/BG
//      documents, for all others it is autogenerated.
//  - latestVersion: the URI to the latest (undated) version of the specification. ONLY ever use this for CG/BG
//      documents, for all others it is autogenerated.
//  - prevVersion: the URI to the previous (dated) version of the specification. ONLY ever use this for CG/BG
//      documents, for all others it is autogenerated.
//  - subjectPrefix: the string that is expected to be used as a subject prefix when posting to the mailing
//      list of the group.
//  - otherLinks: an array of other links that you might want in the header (e.g., link github, twitter, etc).
//         Example of usage: [{key: "foo", href:"http://b"}, {key: "bar", href:"http://"}].
//         Allowed values are:
//          - key: the key for the <dt> (e.g., "Bug Tracker"). Required.
//          - value: The value that will appear in the <dd> (e.g., "GitHub"). Optional.
//          - href: a URL for the value (e.g., "http://foo.com/issues"). Optional.
//          - class: a string representing CSS classes. Optional.
//  - license: can either be "w3c" (for the currently default, restrictive license) or "cc-by" for
//      the friendly persmissive dual license that nice people use (if they are participating in the
//      HTML WG licensing experiment)

define(
    'w3c/headers',["handlebars"
    ,"core/utils"
    ,"tmpl!w3c/templates/headers.html"
    ,"tmpl!w3c/templates/sotd.html"
    ,"tmpl!w3c/templates/cgbg-headers.html"
    ,"tmpl!w3c/templates/cgbg-sotd.html"
    ],
    function (hb, utils, headersTmpl, sotdTmpl, cgbgHeadersTmpl, cgbgSotdTmpl) {
        // XXX RDFa support is untested
        Handlebars.registerHelper("showPeople", function (name, items) {
            // stuff to handle RDFa
            var re = "", rp = "", rm = "", rn = "", rwu = "", rpu = "";
            if (this.doRDFa !== false) {
                if (name === "Editor") {
                    re = " rel='bibo:editor'";
                    if (this.doRDFa !== "1.0") re += " inlist=''";
                }
                else if (name === "Author") {
                    re = " rel='dcterms:contributor'";
                }
                rn = " property='foaf:name'";
                rm = " rel='foaf:mbox'";
                rp = " typeof='foaf:Person'";
                rwu = " rel='foaf:workplaceHomepage'";
                rpu = " rel='foaf:homepage'";
            }
            var ret = "";
            for (var i = 0, n = items.length; i < n; i++) {
                var p = items[i];
                if (this.doRDFa !== false ) ret += "<dd class='p-author h-card vcard' " + re +"><span" + rp + ">";
                else             ret += "<dd class='p-author h-card vcard'>";
                if (p.url) {
                    if (this.doRDFa !== false ) {
                        ret += "<a class='u-url url p-name fn' " + rpu + rn + " content='" + p.name +  "' href='" + p.url + "'>" + p.name + "</a>";
                    }
                    else {
                        ret += "<a class='u-url url p-name fn' href='" + p.url + "'>"+ p.name + "</a>";
                    }
                }
                else {
                    ret += "<span" + rn + " class='p-name fn'>" + p.name + "</span>";
                }
                if (p.company) {
                    ret += ", ";
                    if (p.companyURL) ret += "<a" + rwu + " class='p-org org h-org h-card' href='" + p.companyURL + "'>" + p.company + "</a>";
                    else ret += p.company;
                }
                if (p.mailto) {
                    ret += ", <span class='ed_mailto'><a class='u-email email' " + rm + " href='mailto:" + p.mailto + "'>" + p.mailto + "</a></span>";
                }
                if (p.note) ret += " (" + p.note + ")";
                if (this.doRDFa !== false ) ret += "</span>\n";
                ret += "</dd>\n";
            }
            return new Handlebars.SafeString(ret);
        });
        

        return {
            status2maturity:    {
                FPWD:           "WD"
            ,   LC:             "WD"
            ,   FPLC:           "WD"
            ,   "FPWD-NOTE":    "NOTE"
            ,   "WD-NOTE":      "WD"
            ,   "LC-NOTE":      "LC"
            ,   "IG-NOTE":      "NOTE"
            ,   "WG-NOTE":      "NOTE"
            }
        ,   status2rdf: {
                NOTE:           "w3p:NOTE",
                WD:             "w3p:WD",
                LC:             "w3p:LastCall",
                CR:             "w3p:CR",
                PR:             "w3p:PR",
                REC:            "w3p:REC",
                PER:            "w3p:PER",
                RSCND:          "w3p:RSCND"
            }
        ,   status2text: {
                NOTE:           "Note"
            ,   "WG-NOTE":      "Working Group Note"
            ,   "CG-NOTE":      "Co-ordination Group Note"
            ,   "IG-NOTE":      "Interest Group Note"
            ,   "Member-SUBM":  "Member Submission"
            ,   "Team-SUBM":    "Team Submission"
            ,   MO:             "Member-Only Document"
            ,   ED:             "Editor's Draft"
            ,   FPWD:           "First Public Working Draft"
            ,   WD:             "Working Draft"
            ,   "FPWD-NOTE":    "Working Group Note"
            ,   "WD-NOTE":      "Working Draft"
            ,   "LC-NOTE":      "Working Draft"
            ,   FPLC:           "First Public and Last Call Working Draft"
            ,   LC:             "Last Call Working Draft"
            ,   CR:             "Candidate Recommendation"
            ,   PR:             "Proposed Recommendation"
            ,   PER:            "Proposed Edited Recommendation"
            ,   REC:            "Recommendation"
            ,   RSCND:          "Rescinded Recommendation"
            ,   unofficial:     "Unofficial Draft"
            ,   base:           "Document"
            ,   finding:        "TAG Finding"
            ,   "draft-finding": "Draft TAG Finding"
            ,   "CG-DRAFT":     "Draft Community Group Specification"
            ,   "CG-FINAL":     "Final Community Group Specification"
            ,   "BG-DRAFT":     "Draft Business Group Specification"
            ,   "BG-FINAL":     "Final Business Group Specification"
            }
        ,   status2long:    {
                "FPWD-NOTE":    "First Public Working Group Note"
            ,   "LC-NOTE":      "Last Call Working Draft"
            }
        ,   recTrackStatus: ["FPWD", "WD", "FPLC", "LC", "CR", "PR", "PER", "REC"]
        ,   noTrackStatus:  ["MO", "unofficial", "base", "finding", "draft-finding", "CG-DRAFT", "CG-FINAL", "BG-DRAFT", "BG-FINAL"]
        ,   cgbg:           ["CG-DRAFT", "CG-FINAL", "BG-DRAFT", "BG-FINAL"]
        ,   precededByAn:   ["ED", "IG-NOTE"]
                        
        ,   run:    function (conf, doc, cb, msg) {
                msg.pub("start", "w3c/headers");

                if (conf.doRDFa !== false) {
                    if (conf.doRDFa === undefined) {
                        conf.doRDFa = '1.1';
                    }
                }
                // validate configuration and derive new configuration values
                if (!conf.license) conf.license = "w3c";
                conf.isCCBY = conf.license === "cc-by";
                conf.isCGBG = $.inArray(conf.specStatus, this.cgbg) >= 0;
                conf.isCGFinal = conf.isCGBG && /G-FINAL$/.test(conf.specStatus);
                if (!conf.specStatus) msg.pub("error", "Missing required configuration: specStatus");
                if (!conf.isCGBG && !conf.shortName) msg.pub("error", "Missing required configuration: shortName");
                conf.title = doc.title || "No Title";
                if (!conf.subtitle) conf.subtitle = "";
                if (!conf.publishDate) {
                    conf.publishDate = utils.parseLastModified(doc.lastModified);
                }
                else {
                    if (!(conf.publishDate instanceof Date)) conf.publishDate = utils.parseSimpleDate(conf.publishDate);
                }
                conf.publishYear = conf.publishDate.getFullYear();
                conf.publishHumanDate = utils.humanDate(conf.publishDate);
                conf.isNoTrack = $.inArray(conf.specStatus, this.noTrackStatus) >= 0;
                conf.isRecTrack = conf.noRecTrack ? false : $.inArray(conf.specStatus, this.recTrackStatus) >= 0;
                conf.anOrA = $.inArray(conf.specStatus, this.precededByAn) >= 0 ? "an" : "a";
                conf.isTagFinding = conf.specStatus === "finding" || conf.specStatus === "draft-finding";
                if (!conf.edDraftURI) {
                    conf.edDraftURI = "";
                    if (conf.specStatus === "ED") msg.pub("warn", "Editor's Drafts should set edDraftURI.");
                }
                conf.maturity = (this.status2maturity[conf.specStatus]) ? this.status2maturity[conf.specStatus] : conf.specStatus;
                var publishSpace = "TR";
                if (conf.specStatus === "Member-SUBM") publishSpace = "Submission";
                else if (conf.specStatus === "Team-SUBM") publishSpace = "TeamSubmission";
                if (!conf.isCGBG) conf.thisVersion =  "http://www.w3.org/" + publishSpace + "/" +
                                                      conf.publishDate.getFullYear() + "/" +
                                                      conf.maturity + "-" + conf.shortName + "-" +
                                                      utils.concatDate(conf.publishDate) + "/";
                if (conf.specStatus === "ED") conf.thisVersion = conf.edDraftURI;
                if (!conf.isCGBG) conf.latestVersion = "http://www.w3.org/" + publishSpace + "/" + conf.shortName + "/";
                if (conf.isTagFinding) {
                    conf.latestVersion = "http://www.w3.org/2001/tag/doc/" + conf.shortName;
                    conf.thisVersion = conf.latestVersion + "-" + utils.concatDate(conf.publishDate, "-");
                }
                if (conf.previousPublishDate) {
                    if (!conf.previousMaturity && !conf.isTagFinding)
                        msg.pub("error", "previousPublishDate is set, but not previousMaturity");
                    if (!(conf.previousPublishDate instanceof Date))
                        conf.previousPublishDate = utils.parseSimpleDate(conf.previousPublishDate);
                    var pmat = (this.status2maturity[conf.previousMaturity]) ? this.status2maturity[conf.previousMaturity] :
                                                                               conf.previousMaturity;
                    if (conf.isTagFinding) {
                        conf.prevVersion = conf.latestVersion + "-" + utils.concatDate(conf.previousPublishDate, "-");
                    }
                    else if (conf.isCGBG) {
                        conf.prevVersion = conf.prevVersion || "";
                    }
                    else {
                        conf.prevVersion = "http://www.w3.org/TR/" + conf.previousPublishDate.getFullYear() + "/" + pmat + "-" +
                                           conf.shortName + "-" + utils.concatDate(conf.previousPublishDate) + "/";
                    }
                }
                else {
                    if (conf.specStatus !== "FPWD" && conf.specStatus !== "FPLC" && conf.specStatus !== "ED" && !conf.noRecTrack && !conf.isNoTrack)
                        msg.pub("error", "Document on track but no previous version.");
                    if (!conf.prevVersion) conf.prevVersion = "";
                }
                if (conf.prevRecShortname && !conf.prevRecURI) conf.prevRecURI = "http://www.w3.org/TR/" + conf.prevRecShortname;
                if (!conf.editors || conf.editors.length === 0) msg.pub("error", "At least one editor is required");
                var peopCheck = function (i, it) {
                    if (!it.name) msg.pub("error", "All authors and editors must have a name.");
                };
                $.each(conf.editors, peopCheck);
                $.each(conf.authors || [], peopCheck);
                conf.multipleEditors = conf.editors.length > 1;
                conf.multipleAuthors = conf.authors && conf.authors.length > 1;
                $.each(conf.alternateFormats || [], function (i, it) {
                    if (!it.uri || !it.label) msg.pub("error", "All alternate formats must have a uri and a label.");
                });
                conf.multipleAlternates = conf.alternateFormats && conf.alternateFormats.length > 1;
                conf.alternatesHTML = utils.joinAnd(conf.alternateFormats, function (alt) {
                    var optional = (alt.hasOwnProperty('lang') && alt.lang) ? " hreflang='" + alt.lang + "'" : "";
                    optional += (alt.hasOwnProperty('type') && alt.type) ? " type='" + alt.type + "'" : "";
                    return "<a rel='alternate' href='" + alt.uri + "'" + optional + ">" + alt.label + "</a>";
                });
                if (conf.copyrightStart && conf.copyrightStart == conf.publishYear) conf.copyrightStart = "";
                for (var k in this.status2text) {
                    if (this.status2long[k]) continue;
                    this.status2long[k] = this.status2text[k];
                }
                conf.longStatus = this.status2long[conf.specStatus];
                conf.textStatus = this.status2text[conf.specStatus];
                if (this.status2rdf[conf.specStatus]) {
                    conf.rdfStatus = this.status2rdf[conf.specStatus];
                }
                conf.showThisVersion =  (!conf.isNoTrack || conf.isTagFinding);
                conf.showPreviousVersion = (conf.specStatus !== "FPWD" && conf.specStatus !== "FPLC" && conf.specStatus !== "ED" &&
                                           !conf.isNoTrack);
                if (conf.isTagFinding) conf.showPreviousVersion = conf.previousPublishDate ? true : false;
                conf.notYetRec = (conf.isRecTrack && conf.specStatus !== "REC");
                conf.isRec = (conf.isRecTrack && conf.specStatus === "REC");
                conf.notRec = (conf.specStatus !== "REC");
                conf.isUnofficial = conf.specStatus === "unofficial";
                conf.prependW3C = !conf.isUnofficial;
                conf.isED = (conf.specStatus === "ED");
                conf.isLC = (conf.specStatus === "LC" || conf.specStatus === "FPLC");
                conf.isCR = (conf.specStatus === "CR");
                conf.isPR = (conf.specStatus === "PR");
                conf.isMO = (conf.specStatus === "MO");
                conf.isIGNote = (conf.specStatus === "IG-NOTE");
                conf.dashDate = utils.concatDate(conf.publishDate, "-");
                conf.publishISODate = utils.isoDate(conf.publishDate) ;
                // configuration done - yay!
                
                // annotate html element with RFDa
                if (conf.doRDFa) {
                    if (conf.rdfStatus) {
                        $("html").attr("typeof", "bibo:Document "+conf.rdfStatus ) ;
                    } else {
                        $("html").attr("typeof", "bibo:Document ") ;
                    }
                    $("html").attr("about", "") ;
                    $("html").attr("property", "dcterms:language") ;
                    $("html").attr("content", "en") ;
                    var prefixes = "bibo: http://purl.org/ontology/bibo/ w3p: http://www.w3.org/2001/02pd/rec54#";
                    if (conf.doRDFa != '1.1') {
                        $("html").attr("version", "XHTML+RDFa 1.0") ;
                        prefixes += " dcterms: http://purl.org/dc/terms/ foaf: http://xmlns.com/foaf/0.1/ xsd: http://www.w3.org/2001/XMLSchema#";
                    }
                    $("html").attr("prefix", prefixes);
                }
                // insert into document and mark with microformat
                $("body", doc).prepend($(conf.isCGBG ? cgbgHeadersTmpl(conf) : headersTmpl(conf)))
                              .addClass("h-entry");

                // handle SotD
                var $sotd = $("#sotd");
                if ((conf.isCGBG || !conf.isNoTrack || conf.isTagFinding) && !$sotd.length)
                    msg.pub("error", "A custom SotD paragraph is required for your type of document.");
                conf.sotdCustomParagraph = $sotd.html();
                $sotd.remove();
                if ($.isArray(conf.wg)) {
                    conf.multipleWGs = conf.wg.length > 1;
                    conf.wgHTML = utils.joinAnd($.isArray(conf.wg) ? conf.wg : [conf.wg], function (wg, idx) {
                        return "<a href='" + conf.wgURI[idx] + "'>" + wg + "</a>";
                    });
                    var pats = [];
                    for (var i = 0, n = conf.wg.length; i < n; i++) {
                        pats.push("<a href='" + conf.wgPatentURI[i] + "' rel='disclosure'>" + conf.wg[i] + "</a>");
                    }
                    conf.wgPatentHTML = pats.join(", ");
                }
                else {
                    conf.multipleWGs = false;
                    conf.wgHTML = "<a href='" + conf.wgURI + "'>" + conf.wg + "</a>";
                }
                if (conf.isLC && !conf.lcEnd) msg.pub("error", "Status is LC but no lcEnd is specified");
                if (conf.specStatus === "PR" && !conf.lcEnd) msg.pub("error", "Status is PR but no lcEnd is specified (needed to indicate end of previous LC)");
                conf.humanLCEnd = utils.humanDate(conf.lcEnd || "");
                if (conf.specStatus === "CR" && !conf.crEnd) msg.pub("error", "Status is CR but no crEnd is specified");
                conf.humanCREnd = utils.humanDate(conf.crEnd || "");
                if (conf.specStatus === "PR" && !conf.prEnd) msg.pub("error", "Status is PR but no prEnd is specified");
                conf.humanPREnd = utils.humanDate(conf.prEnd || "");

                conf.recNotExpected = (!conf.isRecTrack && conf.maturity == "WD" && conf.specStatus !== "FPWD-NOTE");
                if (conf.isIGNote && !conf.charterDisclosureURI)
                    msg.pub("error", "IG-NOTEs must link to charter's disclosure section using charterDisclosureURI");
                $(conf.isCGBG ? cgbgSotdTmpl(conf) : sotdTmpl(conf)).insertAfter($("#abstract"));

                msg.pub("end", "w3c/headers");
                cb();
            }
        };
    }
);


// Module w3c/abstract
// Handle the abstract section properly.

define(
    'w3c/abstract',[],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "w3c/abstract");
                var $abs = $("#abstract");
                if (!$abs) return msg.pub("error", "Document must have one element with ID 'abstract'");
                if ($abs.find("p").length === 0) $abs.contents().wrapAll($("<p></p>"));
                $abs.prepend("<h2>Abstract</h2>");
                $abs.addClass("introductory");
                msg.pub("end", "w3c/abstract");
                cb();
            }
        };
    }
);

define('tmpl!w3c/templates/conformance.html', ['handlebars'], function (hb) { return Handlebars.compile('<h2>Conformance</h2>\n<p>\n  As well as sections marked as non-normative, all authoring guidelines, diagrams, examples,\n  and notes in this specification are non-normative. Everything else in this specification is\n  normative.\n</p>\n<p>\n  The key words MUST, MUST NOT, REQUIRED, SHOULD, SHOULD NOT, RECOMMENDED, MAY,\n  and OPTIONAL in this specification are to be interpreted as described in [[!RFC2119]].\n</p>\n');});


// Module w3c/conformance
// Handle the conformance section properly.

define(
    'w3c/conformance',["tmpl!w3c/templates/conformance.html"],
    function (confoTmpl) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "w3c/conformance");
                var $confo = $("#conformance");
                if ($confo.length) $confo.prepend(confoTmpl(conf));
                msg.pub("end", "w3c/conformance");
                cb();
            }
        };
    }
);


// Module w3c/data-transform
// Support for the data-transform attribute
// Any element in the tree that has a data-transform attribute is processed here.
// The data-transform attribute can contain a white space separated list of functions
// to call (these must have been defined globally). Each is called with a reference to
// the core/utils plugin and the innerHTML of the element. The output of each is fed
// as the input to the next, and the output of the last one replaces the HTML content
// of the element.
// IMPORTANT:
//  It is unlikely that you should use this module. The odds are that unless you really
//  know what you are doing, you should be using a dedicated module instead. This feature
//  is not actively supported and support for it may be dropped. It is not accounted for
//  in the test suite, and therefore could easily break.

define(
    'core/data-transform',["core/utils"],
    function (utils) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "w3c/data-transform");
                $("[data-transform]", doc).each(function (i, node) {
                    var $n = $(node);
                    var flist = $n.attr('data-transform');
                    $n.removeAttr('data-transform') ;
                    var content = utils.runTransforms($n.html(), flist);
                    if (content) $n.html(content);
                });
                msg.pub("end", "w3c/data-transform");
                cb();
            }
        };
    }
);

/*jshint
    expr: true
*/

// Module w3c/data-include
// Support for the data-include attribute. Causes external content to be included inside an
// element that has data-include='some URI'. There is also a data-oninclude attribute that
// features a white space separated list of global methods that will be called with the
// module object, the content, and the included URI.
//
// IMPORTANT:
//  This module only really works when you are in an HTTP context, and will most likely
//  fail if you are editing your documents on your local drive. That is due to security
//  restrictions in the browser.
//  It is also important to note that this module performs synchronous requests (which is
//  required since subsequent modules need to apply to the included content) and can therefore
//  entail performance issues.

define(
    'core/data-include',["core/utils"],
    function (utils) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "w3c/data-include");
                var $incs = $("[data-include]")
                ,   len = $incs.length
                ,   finish = function ($el) {
                        $el.removeAttr("data-include");
                        $el.removeAttr("data-oninclude");
                        $el.removeAttr("data-include-format");
                        $el.removeAttr("data-include-replace");
                        $el.removeAttr("data-include-sync");
                        len--;
                        if (len <= 0) {
                            msg.pub("end", "w3c/data-include");
                            cb();
                        }
                    }
                ;
                if (!len) {
                    msg.pub("end", "w3c/data-include");
                    cb();
                }
                $incs.each(function () {
                    var $el = $(this)
                    ,   uri = $el.attr("data-include")
                    ,   format = $el.attr("data-include-format") || "html"
                    ,   replace = !!$el.attr("data-include-replace")
                    ,   sync = !!$el.attr("data-include-sync")
                    ;
                    $.ajax({
                        dataType:   format
                    ,   url:        uri
                    ,   async:      !sync
                    ,   success:    function (data) {
                            if (data) {
                                var flist = $el.attr("data-oninclude");
                                if (flist) data = utils.runTransforms(data, flist, uri);
                                if (replace) $el.replaceWith(format === "text" ? doc.createTextNode(data) : data);
                                else format === "text" ? $el.text(data) : $el.html(data);
                            }
                            finish($el);
                        }
                    ,   error:      function (xhr, status, error) {
                            msg.pub("error", "Error including URI=" + uri + ": " + status + " (" + error + ")");
                            finish($el);
                        }
                    });
                });
            }
        };
    }
);


// Module core/inlines
// Process all manners of inline information. These are done together despite it being
// seemingly a better idea to orthogonalise them. The issue is that processing text nodes
// is harder to orthogonalise, and in some browsers can also be particularly slow.
// Things that are recognised are <abbr>/<acronym> which when used once are applied
// throughout the document, [[REFERENCES]]/[[!REFERENCES]], and RFC2119 keywords.
// CONFIGURATION:
//  These options do not configure the behaviour of this module per se, rather this module
//  manipulates them (oftentimes being the only source to set them) so that other modules
//  may rely on them.
//  - normativeReferences: a map of normative reference identifiers.
//  - informativeReferences: a map of informative reference identifiers.

define(
    'core/inlines',["core/utils"],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/inlines");
                doc.normalize();
                if (!conf.normativeReferences) conf.normativeReferences = {};
                if (!conf.informativeReferences) conf.informativeReferences = {};

                // PRE-PROCESSING
                var abbrMap = {}, acroMap = {};
                $("abbr[title]", doc).each(function () { abbrMap[$(this).text()] = $(this).attr("title"); });
                $("acronym[title]", doc).each(function () { acroMap[$(this).text()] = $(this).attr("title"); });
                var aKeys = [];
                for (var k in abbrMap) aKeys.push(k);
                for (var k in acroMap) aKeys.push(k);
                aKeys.sort(function (a, b) {
                    if (b.length < a.length) return -1;
                    if (a.length < b.length) return 1;
                    return 0;
                });
                var abbrRx = aKeys.length ? "(?:\\b" + aKeys.join("\\b)|(?:\\b") + "\\b)" : null;

                // PROCESSING
                var txts = $("body", doc).allTextNodes(["pre"]);
                var rx = new RegExp("(\\bMUST(?:\\s+NOT)?\\b|\\bSHOULD(?:\\s+NOT)?\\b|\\bSHALL(?:\\s+NOT)?\\b|" +
                                    "\\bMAY\\b|\\b(?:NOT\\s+)?REQUIRED\\b|\\b(?:NOT\\s+)?RECOMMENDED\\b|\\bOPTIONAL\\b|" +
                                    "(?:\\[\\[(?:!|\\\\)?[A-Za-z0-9-]+\\]\\])" + ( abbrRx ? "|" + abbrRx : "") + ")");
                for (var i = 0; i < txts.length; i++) {
                    var txt = txts[i];
                    var subtxt = txt.data.split(rx);
                    if (subtxt.length === 1) continue;

                    var df = doc.createDocumentFragment();
                    while (subtxt.length) {
                        var t = subtxt.shift();
                        var matched = null;
                        if (subtxt.length) matched = subtxt.shift();
                        df.appendChild(doc.createTextNode(t));
                        if (matched) {
                            // RFC 2119
                            if (/MUST(?:\s+NOT)?|SHOULD(?:\s+NOT)?|SHALL(?:\s+NOT)?|MAY|(?:NOT\s+)?REQUIRED|(?:NOT\s+)?RECOMMENDED|OPTIONAL/.test(matched)) {
                                df.appendChild($("<em/>").attr({ "class": "rfc2119", title: matched }).text(matched)[0]);
                            }
                            // BIBREF
                            else if (/^\[\[/.test(matched)) {
                                var ref = matched;
                                ref = ref.replace(/^\[\[/, "");
                                ref = ref.replace(/\]\]$/, "");
                                if (ref.indexOf("\\") === 0) {
                                    df.appendChild(doc.createTextNode("[[" + ref.replace(/^\\/, "") + "]]"));
                                }
                                else {
                                    var norm = false;
                                    if (ref.indexOf("!") === 0) {
                                        norm = true;
                                        ref = ref.replace(/^!/, "");
                                    }
                                    // contrary to before, we always insert the link
                                    if (norm) conf.normativeReferences[ref] = true;
                                    else      conf.informativeReferences[ref] = true;
                                    df.appendChild(doc.createTextNode("["));
                                    df.appendChild($("<cite/>").wrapInner($("<a/>").attr({"class": "bibref", href: "#bib-" + ref}).text(ref))[0]);
                                    df.appendChild(doc.createTextNode("]"));
                                }
                            }
                            // ABBR
                            else if (abbrMap[matched]) {
                                if ($(txt).parents("abbr").length) df.appendChild(doc.createTextNode(matched));
                                else df.appendChild($("<abbr/>").attr({ title: abbrMap[matched] }).text(matched)[0]);
                            }
                            // ACRO
                            else if (acroMap[matched]) {
                                if ($(txt).parents("acronym").length) df.appendChild(doc.createTextNode(matched));
                                else df.appendChild($("<acronym/>").attr({ title: acroMap[matched] }).text(matched)[0]);
                            }
                            // FAIL -- not sure that this can really happen
                            else {
                                msg.pub("error", "Found token '" + matched + "' but it does not correspond to anything");
                            }
                        }
                    }
                    txt.parentNode.replaceChild(df, txt);
                }
                msg.pub("end", "core/inlines");
                cb();
            }
        };
    }
);

define('text!core/css/examples.css',[],function () { return '/* --- EXAMPLES --- */\ndiv.example-title {\n    min-width: 7.5em;\n    color: #b9ab2d;\n}\ndiv.example-title span {\n    text-transform: uppercase;   \n}\naside.example, div.example, div.illegal-example {\n    padding: 0.5em;\n    margin: 1em 0;\n    position: relative;\n    clear: both;\n}\ndiv.illegal-example { color: red }\ndiv.illegal-example p { color: black }\naside.example, div.example {\n    padding: .5em;\n    border-left-width: .5em;\n    border-left-style: solid;\n    border-color: #e0cb52;\n    background: #fcfaee;    \n}\n\naside.example div.example {\n    border-left-width: .1em;\n    border-color: #999;\n    background: #fff;\n}\naside.example div.example div.example-title {\n    color: #999;\n}\n';});


// Module core/examples
// Manages examples, including marking them up, numbering, inserting the title,
// and reindenting.
// Examples are any pre element with class "example" or "illegal-example".
// When an example is found, it is reported using the "example" event. This can
// be used by a containing shell to extract all examples.

define(
    'core/examples',["text!core/css/examples.css"],
    function (css) {
        var makeTitle = function ($el, num, report) {
            var txt = (num > 0) ? " " + num : ""
            ,   $tit = $("<div class='example-title'><span>Example" + txt + "</span></div>");
            report.title = $el.attr("title");
            if (report.title) {
                $tit.append($el[0].ownerDocument.createTextNode(": " + report.title));
                $el.removeAttr("title");
            }
            return $tit;
        };
        
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/examples");
                var $exes = $("pre.example, pre.illegal-example, aside.example")
                ,   num = 0
                ;
                if ($exes.length) {
                    $(doc).find("head link").first().before($("<style/>").text(css));
                    $exes.each(function (i, ex) {
                        var $ex = $(ex)
                        ,   report = { number: num, illegal: $ex.hasClass("illegal-example") }
                        ;
                        if ($ex.is("aside")) {
                            num++;
                            var $tit = makeTitle($ex, num, report);
                            $ex.prepend($tit);
                            msg.pub("example", report);
                        }
                        else {
                            var inAside = !!$ex.parents("aside").length;
                            if (!inAside) num++;
                            // reindent
                            var lines = $ex.html().split("\n");
                            while (lines.length && /^\s*$/.test(lines[0])) lines.shift();
                            while (lines.length && /^\s*$/.test(lines[lines.length - 1])) lines.pop();
                            var matches = /^(\s+)/.exec(lines[0]);
                            if (matches) {
                                var rep = new RegExp("^" + matches[1]);
                                for (var j = 0; j < lines.length; j++) {
                                    lines[j] = lines[j].replace(rep, "");
                                }
                            }
                            report.content = lines.join("\n");
                            $ex.html(lines.join("\n"));
                            // wrap
                            var $div = $("<div class='example'></div>")
                            ,   $tit = makeTitle($ex, inAside ? 0 : num, report)
                            ;
                            $div.append($tit);
                            $div.append($ex.clone());
                            $ex.replaceWith($div);
                            if (!inAside) msg.pub("example", report);
                        }
                    });
                }
                msg.pub("end", "core/examples");
                cb();
            }
        };
    }
);

define('text!core/css/issues-notes.css',[],function () { return '/* --- ISSUES/NOTES --- */\ndiv.issue-title, div.note-title {\n    padding-right:  1em;\n    min-width: 7.5em;\n    color: #b9ab2d;\n}\ndiv.issue-title { color: #e05252; }\ndiv.note-title { color: #2b2; }\ndiv.issue-title span, div.note-title span {\n    text-transform: uppercase;\n}\ndiv.note, div.issue {\n    margin-top: 1em;\n    margin-bottom: 1em;\n}\n.note > p:first-child, .issue > p:first-child { margin-top: 0 }\n.issue, .note {\n    padding: .5em;\n    border-left-width: .5em;\n    border-left-style: solid;\n}\ndiv.issue, div.note {\n    padding: 1em 1.2em 0.5em;\n    margin: 1em 0;\n    position: relative;\n    clear: both;\n}\nspan.note, span.issue { padding: .1em .5em .15em; }\n\n.issue {\n    border-color: #e05252;\n    background: #fbe9e9;\n}\n.note {\n    border-color: #52e052;\n    background: #e9fbe9;\n}\n\n\n';});


// Module core/issues-notes
// Manages issues and notes, including marking them up, numbering, inserting the title,
// and injecting the style sheet.
// These are elements with classes "issue" or "note".
// When an issue or note is found, it is reported using the "issue" or "note" event. This can
// be used by a containing shell to extract all of these.
// Issues are automatically numbered by default, but you can assign them specific numbers (or,
// despite the name, any arbitrary identifier) using the data-number attribute. Note that as
// soon as you use one data-number on any issue all the other issues stop being automatically
// numbered to avoid involuntary clashes.
// If the configuration has issueBase set to a non-empty string, and issues are
// manually numbered, a link to the issue is created using issueBase and the issue number

define(
    'core/issues-notes',["text!core/css/issues-notes.css"],
    function (css) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/issues-notes");
                var $ins = $(".issue, .note");
                if ($ins.length) {
                    $(doc).find("head link").first().before($("<style/>").text(css));
                    var hasDataNum = $(".issue[data-number]").length > 0
                    ,   issueNum = 0;
                    $ins.each(function (i, inno) {
                        var $inno = $(inno)
                        ,   isIssue = $inno.hasClass("issue")
                        ,   isFeatureAtRisk = $inno.hasClass("atrisk")
                        ,   isInline = $inno.css("display") != "block"
                        ,   dataNum = $inno.attr("data-number")
                        ,   report = { inline: isInline, content: $inno.html() }
                        ;
                        report.type = isIssue ? "issue" : "note";

                        if (isIssue && !isInline && !hasDataNum) {
                            issueNum++;
                            report.number = issueNum;
                        }
                        else if (dataNum) {
                            report.number = dataNum;
                        }

                        // wrap
                        if (!isInline) {
                            var $div = $("<div class='" + report.type + (isFeatureAtRisk ? " atrisk" : "") + "'></div>")
                            ,   $tit = $("<div class='" + report.type + "-title'><span></span></div>")
                            ,   text = isIssue ? (isFeatureAtRisk ? "Feature at Risk" : "Issue") : "Note"
                            ;
                            if (isIssue) {
                                if (hasDataNum) {
                                    if (dataNum) {
                                        text += " " + dataNum;
                                        // Set issueBase to cause issue to be linked to the external issue tracker
                                        if (!isFeatureAtRisk && conf.issueBase) {
                                            $tit.find("span").wrap($("<a href='" + conf.issueBase + dataNum + "'/>"));
                                        }
                                        else if (isFeatureAtRisk && conf.atRiskBase) {
                                            $tit.find("span").wrap($("<a href='" + conf.atRiskBase + dataNum + "'/>"));
                                        }
                                    }
                                }
                                else {
                                    text += " " + issueNum;
                                }
                            }
                            $tit.find("span").text(text);
                            report.title = $inno.attr("title");
                            if (report.title) {
                                $tit.append(doc.createTextNode(": " + report.title));
                                $inno.removeAttr("title");
                            }
                            $div.append($tit);
                            $div.append($inno.clone().removeClass(report.type).removeAttr('data-number'));
                            $inno.replaceWith($div);
                        }
                        msg.pub(report.type, report);
                    });
                }
                msg.pub("end", "core/issues-notes");
                cb();
            }
        };
    }
);

// Module core/requirements
// This module does two things:
//
// 1.  It finds and marks all requirements. These are elements with class "req".
//     When a requirement is found, it is reported using the "req" event. This
//     can be used by a containing shell to extract them.
//     Requirements are automatically numbered.
//
// 2.  It allows referencing requirements by their ID simply using an empty <a>
//     element with its href pointing to the requirement it should be referencing
//     and a class of "reqRef".

define(
    'core/requirements',[],
    function () {
        return {
            run: function (conf, doc, cb, msg) {
                msg.pub("start", "core/requirements");

                $(".req").each(function (i) {
                    i++;
                    var $req = $(this)
                    ,   title = "Req. " + i
                    ;
                    msg.pub("req", {
                      type: "req",
                      number: i,
                      content: $req.html(),
                      title: title
                    });
                    $req.prepend("<a href='#" + $req.attr("id") + "'>" + title + "</a>: ");
                });

                $("a.reqRef").each(function () {
                    var $ref = $(this)
                    ,   href = $ref.attr("href")
                    ,   id
                    ,   $req
                    ,   txt
                    ;
                    if (!href) return;
                    id = href.substring(1);
                    $req = $("#" + id);
                    if ($req.length) {
                      txt = $req.find("> a").text();
                    } else {
                      txt = "Req. not found '" + id + "'";
                    }
                    $ref.text(txt);
                });

                msg.pub("end", "core/requirements");
                cb();
            }
        };
    }
);
define('text!core/css/highlight.css',[],function () { return '/* HIGHLIGHTS */\ncode.prettyprint {\n    color:  inherit;\n}\n\n/* this from google-code-prettify */\n.pln{color:#000}@media screen{.str{color:#080}.kwd{color:#008}.com{color:#800}.typ{color:#606}.lit{color:#066}.pun,.opn,.clo{color:#660}.tag{color:#008}.atn{color:#606}.atv{color:#080}.dec,.var{color:#606}.fun{color:red}}@media print,projection{.str{color:#060}.kwd{color:#006;font-weight:bold}.com{color:#600;font-style:italic}.typ{color:#404;font-weight:bold}.lit{color:#044}.pun,.opn,.clo{color:#440}.tag{color:#006;font-weight:bold}.atn{color:#404}.atv{color:#060}}ol.linenums{margin-top:0;margin-bottom:0}li.L0,li.L1,li.L2,li.L3,li.L5,li.L6,li.L7,li.L8{list-style-type:none}li.L1,li.L3,li.L5,li.L7,li.L9{background:#eee}\n';});


// Module core/highlight
// Does syntax highlighting to all pre and code that have a class of "highlight"

// A potential improvement would be to call cb() immediately and benefit from the asynchronous
// ability of prettyPrint() (but only call msg.pub() in the callback to remain accurate as to
// the end of processing)

define(
    'core/highlight',["text!core/css/highlight.css"],
    function (css) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/highlight");
                
                // fix old classes
                var oldies = "sh_css sh_html sh_javascript sh_javascript_dom sh_xml".split(" ");
                for (var i = 0, n = oldies.length; i < n; i++) {
                    var old = oldies[i];
                    $("." + old).each(function () {
                        $(this).removeClass(old).addClass("highlight");
                    });
                }
                
                // prettify
                var $highs = $("pre.highlight, code.highlight")
                ,   done = function () {
                        msg.pub("end", "core/highlight");
                        cb();
                    }
                ;
                if ($highs.length) {
                    $(doc).find("head link").first().before($("<style/>").text(css));
                    $highs.addClass("prettyprint");
                    prettyPrint(done);
                }
                else {
                    done();
                }
            }
        };
    }
);

// Copyright (C) 2006 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/**
 * @fileoverview
 * some functions for browser-side pretty printing of code contained in html.
 *
 * <p>
 * For a fairly comprehensive set of languages see the
 * <a href="http://google-code-prettify.googlecode.com/svn/trunk/README.html#langs">README</a>
 * file that came with this source.  At a minimum, the lexer should work on a
 * number of languages including C and friends, Java, Python, Bash, SQL, HTML,
 * XML, CSS, Javascript, and Makefiles.  It works passably on Ruby, PHP and Awk
 * and a subset of Perl, but, because of commenting conventions, doesn't work on
 * Smalltalk, Lisp-like, or CAML-like languages without an explicit lang class.
 * <p>
 * Usage: <ol>
 * <li> include this source file in an html page via
 *   {@code <script type="text/javascript" src="/path/to/prettify.js"></script>}
 * <li> define style rules.  See the example page for examples.
 * <li> mark the {@code <pre>} and {@code <code>} tags in your source with
 *    {@code class=prettyprint.}
 *    You can also use the (html deprecated) {@code <xmp>} tag, but the pretty
 *    printer needs to do more substantial DOM manipulations to support that, so
 *    some css styles may not be preserved.
 * </ol>
 * That's it.  I wanted to keep the API as simple as possible, so there's no
 * need to specify which language the code is in, but if you wish, you can add
 * another class to the {@code <pre>} or {@code <code>} element to specify the
 * language, as in {@code <pre class="prettyprint lang-java">}.  Any class that
 * starts with "lang-" followed by a file extension, specifies the file type.
 * See the "lang-*.js" files in this directory for code that implements
 * per-language file handlers.
 * <p>
 * Change log:<br>
 * cbeust, 2006/08/22
 * <blockquote>
 *   Java annotations (start with "@") are now captured as literals ("lit")
 * </blockquote>
 * @requires console
 */

// JSLint declarations
/*global console, document, navigator, setTimeout, window */

/**
 * Split {@code prettyPrint} into multiple timeouts so as not to interfere with
 * UI events.
 * If set to {@code false}, {@code prettyPrint()} is synchronous.
 */
window.PR_SHOULD_USE_CONTINUATION = true;

(function () {
  // Keyword lists for various languages.
  // We use things that coerce to strings to make them compact when minified
  // and to defeat aggressive optimizers that fold large string constants.
  var FLOW_CONTROL_KEYWORDS = ["break,continue,do,else,for,if,return,while"];
  var C_KEYWORDS = [FLOW_CONTROL_KEYWORDS,"auto,case,char,const,default," +
      "double,enum,extern,float,goto,int,long,register,short,signed,sizeof," +
      "static,struct,switch,typedef,union,unsigned,void,volatile"];
  var COMMON_KEYWORDS = [C_KEYWORDS,"catch,class,delete,false,import," +
      "new,operator,private,protected,public,this,throw,true,try,typeof"];
  var CPP_KEYWORDS = [COMMON_KEYWORDS,"alignof,align_union,asm,axiom,bool," +
      "concept,concept_map,const_cast,constexpr,decltype," +
      "dynamic_cast,explicit,export,friend,inline,late_check," +
      "mutable,namespace,nullptr,reinterpret_cast,static_assert,static_cast," +
      "template,typeid,typename,using,virtual,where"];
  var JAVA_KEYWORDS = [COMMON_KEYWORDS,
      "abstract,boolean,byte,extends,final,finally,implements,import," +
      "instanceof,null,native,package,strictfp,super,synchronized,throws," +
      "transient"];
  var CSHARP_KEYWORDS = [JAVA_KEYWORDS,
      "as,base,by,checked,decimal,delegate,descending,dynamic,event," +
      "fixed,foreach,from,group,implicit,in,interface,internal,into,is,lock," +
      "object,out,override,orderby,params,partial,readonly,ref,sbyte,sealed," +
      "stackalloc,string,select,uint,ulong,unchecked,unsafe,ushort,var"];
  var COFFEE_KEYWORDS = "all,and,by,catch,class,else,extends,false,finally," +
      "for,if,in,is,isnt,loop,new,no,not,null,of,off,on,or,return,super,then," +
      "true,try,unless,until,when,while,yes";
  var JSCRIPT_KEYWORDS = [COMMON_KEYWORDS,
      "debugger,eval,export,function,get,null,set,undefined,var,with," +
      "Infinity,NaN"];
  var PERL_KEYWORDS = "caller,delete,die,do,dump,elsif,eval,exit,foreach,for," +
      "goto,if,import,last,local,my,next,no,our,print,package,redo,require," +
      "sub,undef,unless,until,use,wantarray,while,BEGIN,END";
  var PYTHON_KEYWORDS = [FLOW_CONTROL_KEYWORDS, "and,as,assert,class,def,del," +
      "elif,except,exec,finally,from,global,import,in,is,lambda," +
      "nonlocal,not,or,pass,print,raise,try,with,yield," +
      "False,True,None"];
  var RUBY_KEYWORDS = [FLOW_CONTROL_KEYWORDS, "alias,and,begin,case,class," +
      "def,defined,elsif,end,ensure,false,in,module,next,nil,not,or,redo," +
      "rescue,retry,self,super,then,true,undef,unless,until,when,yield," +
      "BEGIN,END"];
  var SH_KEYWORDS = [FLOW_CONTROL_KEYWORDS, "case,done,elif,esac,eval,fi," +
      "function,in,local,set,then,until"];
  var ALL_KEYWORDS = [
      CPP_KEYWORDS, CSHARP_KEYWORDS, JSCRIPT_KEYWORDS, PERL_KEYWORDS +
      PYTHON_KEYWORDS, RUBY_KEYWORDS, SH_KEYWORDS];
  var C_TYPES = /^(DIR|FILE|vector|(de|priority_)?queue|list|stack|(const_)?iterator|(multi)?(set|map)|bitset|u?(int|float)\d*)/;

  // token style names.  correspond to css classes
  /**
   * token style for a string literal
   * @const
   */
  var PR_STRING = 'str';
  /**
   * token style for a keyword
   * @const
   */
  var PR_KEYWORD = 'kwd';
  /**
   * token style for a comment
   * @const
   */
  var PR_COMMENT = 'com';
  /**
   * token style for a type
   * @const
   */
  var PR_TYPE = 'typ';
  /**
   * token style for a literal value.  e.g. 1, null, true.
   * @const
   */
  var PR_LITERAL = 'lit';
  /**
   * token style for a punctuation string.
   * @const
   */
  var PR_PUNCTUATION = 'pun';
  /**
   * token style for a punctuation string.
   * @const
   */
  var PR_PLAIN = 'pln';

  /**
   * token style for an sgml tag.
   * @const
   */
  var PR_TAG = 'tag';
  /**
   * token style for a markup declaration such as a DOCTYPE.
   * @const
   */
  var PR_DECLARATION = 'dec';
  /**
   * token style for embedded source.
   * @const
   */
  var PR_SOURCE = 'src';
  /**
   * token style for an sgml attribute name.
   * @const
   */
  var PR_ATTRIB_NAME = 'atn';
  /**
   * token style for an sgml attribute value.
   * @const
   */
  var PR_ATTRIB_VALUE = 'atv';

  /**
   * A class that indicates a section of markup that is not code, e.g. to allow
   * embedding of line numbers within code listings.
   * @const
   */
  var PR_NOCODE = 'nocode';



/**
 * A set of tokens that can precede a regular expression literal in
 * javascript
 * http://web.archive.org/web/20070717142515/http://www.mozilla.org/js/language/js20/rationale/syntax.html
 * has the full list, but I've removed ones that might be problematic when
 * seen in languages that don't support regular expression literals.
 *
 * <p>Specifically, I've removed any keywords that can't precede a regexp
 * literal in a syntactically legal javascript program, and I've removed the
 * "in" keyword since it's not a keyword in many languages, and might be used
 * as a count of inches.
 *
 * <p>The link a above does not accurately describe EcmaScript rules since
 * it fails to distinguish between (a=++/b/i) and (a++/b/i) but it works
 * very well in practice.
 *
 * @private
 * @const
 */
var REGEXP_PRECEDER_PATTERN = '(?:^^\\.?|[+-]|\\!|\\!=|\\!==|\\#|\\%|\\%=|&|&&|&&=|&=|\\(|\\*|\\*=|\\+=|\\,|\\-=|\\->|\\/|\\/=|:|::|\\;|<|<<|<<=|<=|=|==|===|>|>=|>>|>>=|>>>|>>>=|\\?|\\@|\\[|\\^|\\^=|\\^\\^|\\^\\^=|\\{|\\||\\|=|\\|\\||\\|\\|=|\\~|break|case|continue|delete|do|else|finally|instanceof|return|throw|try|typeof)\\s*';

// CAVEAT: this does not properly handle the case where a regular
// expression immediately follows another since a regular expression may
// have flags for case-sensitivity and the like.  Having regexp tokens
// adjacent is not valid in any language I'm aware of, so I'm punting.
// TODO: maybe style special characters inside a regexp as punctuation.


  /**
   * Given a group of {@link RegExp}s, returns a {@code RegExp} that globally
   * matches the union of the sets of strings matched by the input RegExp.
   * Since it matches globally, if the input strings have a start-of-input
   * anchor (/^.../), it is ignored for the purposes of unioning.
   * @param {Array.<RegExp>} regexs non multiline, non-global regexs.
   * @return {RegExp} a global regex.
   */
  function combinePrefixPatterns(regexs) {
    var capturedGroupIndex = 0;

    var needToFoldCase = false;
    var ignoreCase = false;
    for (var i = 0, n = regexs.length; i < n; ++i) {
      var regex = regexs[i];
      if (regex.ignoreCase) {
        ignoreCase = true;
      } else if (/[a-z]/i.test(regex.source.replace(
                     /\\u[0-9a-f]{4}|\\x[0-9a-f]{2}|\\[^ux]/gi, ''))) {
        needToFoldCase = true;
        ignoreCase = false;
        break;
      }
    }

    var escapeCharToCodeUnit = {
      'b': 8,
      't': 9,
      'n': 0xa,
      'v': 0xb,
      'f': 0xc,
      'r': 0xd
    };

    function decodeEscape(charsetPart) {
      var cc0 = charsetPart.charCodeAt(0);
      if (cc0 !== 92 /* \\ */) {
        return cc0;
      }
      var c1 = charsetPart.charAt(1);
      cc0 = escapeCharToCodeUnit[c1];
      if (cc0) {
        return cc0;
      } else if ('0' <= c1 && c1 <= '7') {
        return parseInt(charsetPart.substring(1), 8);
      } else if (c1 === 'u' || c1 === 'x') {
        return parseInt(charsetPart.substring(2), 16);
      } else {
        return charsetPart.charCodeAt(1);
      }
    }

    function encodeEscape(charCode) {
      if (charCode < 0x20) {
        return (charCode < 0x10 ? '\\x0' : '\\x') + charCode.toString(16);
      }
      var ch = String.fromCharCode(charCode);
      if (ch === '\\' || ch === '-' || ch === '[' || ch === ']') {
        ch = '\\' + ch;
      }
      return ch;
    }

    function caseFoldCharset(charSet) {
      var charsetParts = charSet.substring(1, charSet.length - 1).match(
          new RegExp(
              '\\\\u[0-9A-Fa-f]{4}'
              + '|\\\\x[0-9A-Fa-f]{2}'
              + '|\\\\[0-3][0-7]{0,2}'
              + '|\\\\[0-7]{1,2}'
              + '|\\\\[\\s\\S]'
              + '|-'
              + '|[^-\\\\]',
              'g'));
      var groups = [];
      var ranges = [];
      var inverse = charsetParts[0] === '^';
      for (var i = inverse ? 1 : 0, n = charsetParts.length; i < n; ++i) {
        var p = charsetParts[i];
        if (/\\[bdsw]/i.test(p)) {  // Don't muck with named groups.
          groups.push(p);
        } else {
          var start = decodeEscape(p);
          var end;
          if (i + 2 < n && '-' === charsetParts[i + 1]) {
            end = decodeEscape(charsetParts[i + 2]);
            i += 2;
          } else {
            end = start;
          }
          ranges.push([start, end]);
          // If the range might intersect letters, then expand it.
          // This case handling is too simplistic.
          // It does not deal with non-latin case folding.
          // It works for latin source code identifiers though.
          if (!(end < 65 || start > 122)) {
            if (!(end < 65 || start > 90)) {
              ranges.push([Math.max(65, start) | 32, Math.min(end, 90) | 32]);
            }
            if (!(end < 97 || start > 122)) {
              ranges.push([Math.max(97, start) & ~32, Math.min(end, 122) & ~32]);
            }
          }
        }
      }

      // [[1, 10], [3, 4], [8, 12], [14, 14], [16, 16], [17, 17]]
      // -> [[1, 12], [14, 14], [16, 17]]
      ranges.sort(function (a, b) { return (a[0] - b[0]) || (b[1]  - a[1]); });
      var consolidatedRanges = [];
      var lastRange = [NaN, NaN];
      for (var i = 0; i < ranges.length; ++i) {
        var range = ranges[i];
        if (range[0] <= lastRange[1] + 1) {
          lastRange[1] = Math.max(lastRange[1], range[1]);
        } else {
          consolidatedRanges.push(lastRange = range);
        }
      }

      var out = ['['];
      if (inverse) { out.push('^'); }
      out.push.apply(out, groups);
      for (var i = 0; i < consolidatedRanges.length; ++i) {
        var range = consolidatedRanges[i];
        out.push(encodeEscape(range[0]));
        if (range[1] > range[0]) {
          if (range[1] + 1 > range[0]) { out.push('-'); }
          out.push(encodeEscape(range[1]));
        }
      }
      out.push(']');
      return out.join('');
    }

    function allowAnywhereFoldCaseAndRenumberGroups(regex) {
      // Split into character sets, escape sequences, punctuation strings
      // like ('(', '(?:', ')', '^'), and runs of characters that do not
      // include any of the above.
      var parts = regex.source.match(
          new RegExp(
              '(?:'
              + '\\[(?:[^\\x5C\\x5D]|\\\\[\\s\\S])*\\]'  // a character set
              + '|\\\\u[A-Fa-f0-9]{4}'  // a unicode escape
              + '|\\\\x[A-Fa-f0-9]{2}'  // a hex escape
              + '|\\\\[0-9]+'  // a back-reference or octal escape
              + '|\\\\[^ux0-9]'  // other escape sequence
              + '|\\(\\?[:!=]'  // start of a non-capturing group
              + '|[\\(\\)\\^]'  // start/emd of a group, or line start
              + '|[^\\x5B\\x5C\\(\\)\\^]+'  // run of other characters
              + ')',
              'g'));
      var n = parts.length;

      // Maps captured group numbers to the number they will occupy in
      // the output or to -1 if that has not been determined, or to
      // undefined if they need not be capturing in the output.
      var capturedGroups = [];

      // Walk over and identify back references to build the capturedGroups
      // mapping.
      for (var i = 0, groupIndex = 0; i < n; ++i) {
        var p = parts[i];
        if (p === '(') {
          // groups are 1-indexed, so max group index is count of '('
          ++groupIndex;
        } else if ('\\' === p.charAt(0)) {
          var decimalValue = +p.substring(1);
          if (decimalValue && decimalValue <= groupIndex) {
            capturedGroups[decimalValue] = -1;
          }
        }
      }

      // Renumber groups and reduce capturing groups to non-capturing groups
      // where possible.
      for (var i = 1; i < capturedGroups.length; ++i) {
        if (-1 === capturedGroups[i]) {
          capturedGroups[i] = ++capturedGroupIndex;
        }
      }
      for (var i = 0, groupIndex = 0; i < n; ++i) {
        var p = parts[i];
        if (p === '(') {
          ++groupIndex;
          if (capturedGroups[groupIndex] === undefined) {
            parts[i] = '(?:';
          }
        } else if ('\\' === p.charAt(0)) {
          var decimalValue = +p.substring(1);
          if (decimalValue && decimalValue <= groupIndex) {
            parts[i] = '\\' + capturedGroups[groupIndex];
          }
        }
      }

      // Remove any prefix anchors so that the output will match anywhere.
      // ^^ really does mean an anchored match though.
      for (var i = 0, groupIndex = 0; i < n; ++i) {
        if ('^' === parts[i] && '^' !== parts[i + 1]) { parts[i] = ''; }
      }

      // Expand letters to groups to handle mixing of case-sensitive and
      // case-insensitive patterns if necessary.
      if (regex.ignoreCase && needToFoldCase) {
        for (var i = 0; i < n; ++i) {
          var p = parts[i];
          var ch0 = p.charAt(0);
          if (p.length >= 2 && ch0 === '[') {
            parts[i] = caseFoldCharset(p);
          } else if (ch0 !== '\\') {
            // TODO: handle letters in numeric escapes.
            parts[i] = p.replace(
                /[a-zA-Z]/g,
                function (ch) {
                  var cc = ch.charCodeAt(0);
                  return '[' + String.fromCharCode(cc & ~32, cc | 32) + ']';
                });
          }
        }
      }

      return parts.join('');
    }

    var rewritten = [];
    for (var i = 0, n = regexs.length; i < n; ++i) {
      var regex = regexs[i];
      if (regex.global || regex.multiline) { throw new Error('' + regex); }
      rewritten.push(
          '(?:' + allowAnywhereFoldCaseAndRenumberGroups(regex) + ')');
    }

    return new RegExp(rewritten.join('|'), ignoreCase ? 'gi' : 'g');
  }


  /**
   * Split markup into a string of source code and an array mapping ranges in
   * that string to the text nodes in which they appear.
   *
   * <p>
   * The HTML DOM structure:</p>
   * <pre>
   * (Element   "p"
   *   (Element "b"
   *     (Text  "print "))       ; #1
   *   (Text    "'Hello '")      ; #2
   *   (Element "br")            ; #3
   *   (Text    "  + 'World';")) ; #4
   * </pre>
   * <p>
   * corresponds to the HTML
   * {@code <p><b>print </b>'Hello '<br>  + 'World';</p>}.</p>
   *
   * <p>
   * It will produce the output:</p>
   * <pre>
   * {
   *   sourceCode: "print 'Hello '\n  + 'World';",
   *   //                 1         2
   *   //       012345678901234 5678901234567
   *   spans: [0, #1, 6, #2, 14, #3, 15, #4]
   * }
   * </pre>
   * <p>
   * where #1 is a reference to the {@code "print "} text node above, and so
   * on for the other text nodes.
   * </p>
   *
   * <p>
   * The {@code} spans array is an array of pairs.  Even elements are the start
   * indices of substrings, and odd elements are the text nodes (or BR elements)
   * that contain the text for those substrings.
   * Substrings continue until the next index or the end of the source.
   * </p>
   *
   * @param {Node} node an HTML DOM subtree containing source-code.
   * @return {Object} source code and the text nodes in which they occur.
   */
  function extractSourceSpans(node) {
    var nocode = /(?:^|\s)nocode(?:\s|$)/;

    var chunks = [];
    var length = 0;
    var spans = [];
    var k = 0;

    var whitespace;
    if (node.currentStyle) {
      whitespace = node.currentStyle.whiteSpace;
    }
    // XXX
    //  it is important to note that what is below is a fix for ReSpec
    else if (document.defaultView.getComputedStyle && document.defaultView.getComputedStyle(node, null)) {
      whitespace = document.defaultView.getComputedStyle(node, null)
          .getPropertyValue('white-space');
    }
    var isPreformatted = whitespace && 'pre' === whitespace.substring(0, 3);

    function walk(node) {
      switch (node.nodeType) {
        case 1:  // Element
          if (nocode.test(node.className)) { return; }
          for (var child = node.firstChild; child; child = child.nextSibling) {
            walk(child);
          }
          var nodeName = node.nodeName;
          if ('BR' === nodeName || 'LI' === nodeName) {
            chunks[k] = '\n';
            spans[k << 1] = length++;
            spans[(k++ << 1) | 1] = node;
          }
          break;
        case 3: case 4:  // Text
          var text = node.nodeValue;
          if (text.length) {
            if (!isPreformatted) {
              text = text.replace(/[ \t\r\n]+/g, ' ');
            } else {
              text = text.replace(/\r\n?/g, '\n');  // Normalize newlines.
            }
            // TODO: handle tabs here?
            chunks[k] = text;
            spans[k << 1] = length;
            length += text.length;
            spans[(k++ << 1) | 1] = node;
          }
          break;
      }
    }

    walk(node);

    return {
      sourceCode: chunks.join('').replace(/\n$/, ''),
      spans: spans
    };
  }


  /**
   * Apply the given language handler to sourceCode and add the resulting
   * decorations to out.
   * @param {number} basePos the index of sourceCode within the chunk of source
   *    whose decorations are already present on out.
   */
  function appendDecorations(basePos, sourceCode, langHandler, out) {
    if (!sourceCode) { return; }
    var job = {
      sourceCode: sourceCode,
      basePos: basePos
    };
    langHandler(job);
    out.push.apply(out, job.decorations);
  }

  var notWs = /\S/;

  /**
   * Given an element, if it contains only one child element and any text nodes
   * it contains contain only space characters, return the sole child element.
   * Otherwise returns undefined.
   * <p>
   * This is meant to return the CODE element in {@code <pre><code ...>} when
   * there is a single child element that contains all the non-space textual
   * content, but not to return anything where there are multiple child elements
   * as in {@code <pre><code>...</code><code>...</code></pre>} or when there
   * is textual content.
   */
  function childContentWrapper(element) {
    var wrapper = undefined;
    for (var c = element.firstChild; c; c = c.nextSibling) {
      var type = c.nodeType;
      wrapper = (type === 1)  // Element Node
          ? (wrapper ? element : c)
          : (type === 3)  // Text Node
          ? (notWs.test(c.nodeValue) ? element : wrapper)
          : wrapper;
    }
    return wrapper === element ? undefined : wrapper;
  }

  /** Given triples of [style, pattern, context] returns a lexing function,
    * The lexing function interprets the patterns to find token boundaries and
    * returns a decoration list of the form
    * [index_0, style_0, index_1, style_1, ..., index_n, style_n]
    * where index_n is an index into the sourceCode, and style_n is a style
    * constant like PR_PLAIN.  index_n-1 <= index_n, and style_n-1 applies to
    * all characters in sourceCode[index_n-1:index_n].
    *
    * The stylePatterns is a list whose elements have the form
    * [style : string, pattern : RegExp, DEPRECATED, shortcut : string].
    *
    * Style is a style constant like PR_PLAIN, or can be a string of the
    * form 'lang-FOO', where FOO is a language extension describing the
    * language of the portion of the token in $1 after pattern executes.
    * E.g., if style is 'lang-lisp', and group 1 contains the text
    * '(hello (world))', then that portion of the token will be passed to the
    * registered lisp handler for formatting.
    * The text before and after group 1 will be restyled using this decorator
    * so decorators should take care that this doesn't result in infinite
    * recursion.  For example, the HTML lexer rule for SCRIPT elements looks
    * something like ['lang-js', /<[s]cript>(.+?)<\/script>/].  This may match
    * '<script>foo()<\/script>', which would cause the current decorator to
    * be called with '<script>' which would not match the same rule since
    * group 1 must not be empty, so it would be instead styled as PR_TAG by
    * the generic tag rule.  The handler registered for the 'js' extension would
    * then be called with 'foo()', and finally, the current decorator would
    * be called with '<\/script>' which would not match the original rule and
    * so the generic tag rule would identify it as a tag.
    *
    * Pattern must only match prefixes, and if it matches a prefix, then that
    * match is considered a token with the same style.
    *
    * Context is applied to the last non-whitespace, non-comment token
    * recognized.
    *
    * Shortcut is an optional string of characters, any of which, if the first
    * character, gurantee that this pattern and only this pattern matches.
    *
    * @param {Array} shortcutStylePatterns patterns that always start with
    *   a known character.  Must have a shortcut string.
    * @param {Array} fallthroughStylePatterns patterns that will be tried in
    *   order if the shortcut ones fail.  May have shortcuts.
    *
    * @return {function (Object)} a
    *   function that takes source code and returns a list of decorations.
    */
  function createSimpleLexer(shortcutStylePatterns, fallthroughStylePatterns) {
    var shortcuts = {};
    var tokenizer;
    (function () {
      var allPatterns = shortcutStylePatterns.concat(fallthroughStylePatterns);
      var allRegexs = [];
      var regexKeys = {};
      for (var i = 0, n = allPatterns.length; i < n; ++i) {
        var patternParts = allPatterns[i];
        var shortcutChars = patternParts[3];
        if (shortcutChars) {
          for (var c = shortcutChars.length; --c >= 0;) {
            shortcuts[shortcutChars.charAt(c)] = patternParts;
          }
        }
        var regex = patternParts[1];
        var k = '' + regex;
        if (!regexKeys.hasOwnProperty(k)) {
          allRegexs.push(regex);
          regexKeys[k] = null;
        }
      }
      allRegexs.push(/[\0-\uffff]/);
      tokenizer = combinePrefixPatterns(allRegexs);
    })();

    var nPatterns = fallthroughStylePatterns.length;

    /**
     * Lexes job.sourceCode and produces an output array job.decorations of
     * style classes preceded by the position at which they start in
     * job.sourceCode in order.
     *
     * @param {Object} job an object like <pre>{
     *    sourceCode: {string} sourceText plain text,
     *    basePos: {int} position of job.sourceCode in the larger chunk of
     *        sourceCode.
     * }</pre>
     */
    var decorate = function (job) {
      var sourceCode = job.sourceCode, basePos = job.basePos;
      /** Even entries are positions in source in ascending order.  Odd enties
        * are style markers (e.g., PR_COMMENT) that run from that position until
        * the end.
        * @type {Array.<number|string>}
        */
      var decorations = [basePos, PR_PLAIN];
      var pos = 0;  // index into sourceCode
      var tokens = sourceCode.match(tokenizer) || [];
      var styleCache = {};

      for (var ti = 0, nTokens = tokens.length; ti < nTokens; ++ti) {
        var token = tokens[ti];
        var style = styleCache[token];
        var match = void 0;

        var isEmbedded;
        if (typeof style === 'string') {
          isEmbedded = false;
        } else {
          var patternParts = shortcuts[token.charAt(0)];
          if (patternParts) {
            match = token.match(patternParts[1]);
            style = patternParts[0];
          } else {
            for (var i = 0; i < nPatterns; ++i) {
              patternParts = fallthroughStylePatterns[i];
              match = token.match(patternParts[1]);
              if (match) {
                style = patternParts[0];
                break;
              }
            }

            if (!match) {  // make sure that we make progress
              style = PR_PLAIN;
            }
          }

          isEmbedded = style.length >= 5 && 'lang-' === style.substring(0, 5);
          if (isEmbedded && !(match && typeof match[1] === 'string')) {
            isEmbedded = false;
            style = PR_SOURCE;
          }

          if (!isEmbedded) { styleCache[token] = style; }
        }

        var tokenStart = pos;
        pos += token.length;

        if (!isEmbedded) {
          decorations.push(basePos + tokenStart, style);
        } else {  // Treat group 1 as an embedded block of source code.
          var embeddedSource = match[1];
          var embeddedSourceStart = token.indexOf(embeddedSource);
          var embeddedSourceEnd = embeddedSourceStart + embeddedSource.length;
          if (match[2]) {
            // If embeddedSource can be blank, then it would match at the
            // beginning which would cause us to infinitely recurse on the
            // entire token, so we catch the right context in match[2].
            embeddedSourceEnd = token.length - match[2].length;
            embeddedSourceStart = embeddedSourceEnd - embeddedSource.length;
          }
          var lang = style.substring(5);
          // Decorate the left of the embedded source
          appendDecorations(
              basePos + tokenStart,
              token.substring(0, embeddedSourceStart),
              decorate, decorations);
          // Decorate the embedded source
          appendDecorations(
              basePos + tokenStart + embeddedSourceStart,
              embeddedSource,
              langHandlerForExtension(lang, embeddedSource),
              decorations);
          // Decorate the right of the embedded section
          appendDecorations(
              basePos + tokenStart + embeddedSourceEnd,
              token.substring(embeddedSourceEnd),
              decorate, decorations);
        }
      }
      job.decorations = decorations;
    };
    return decorate;
  }

  /** returns a function that produces a list of decorations from source text.
    *
    * This code treats ", ', and ` as string delimiters, and \ as a string
    * escape.  It does not recognize perl's qq() style strings.
    * It has no special handling for double delimiter escapes as in basic, or
    * the tripled delimiters used in python, but should work on those regardless
    * although in those cases a single string literal may be broken up into
    * multiple adjacent string literals.
    *
    * It recognizes C, C++, and shell style comments.
    *
    * @param {Object} options a set of optional parameters.
    * @return {function (Object)} a function that examines the source code
    *     in the input job and builds the decoration list.
    */
  function sourceDecorator(options) {
    var shortcutStylePatterns = [], fallthroughStylePatterns = [];
    if (options['tripleQuotedStrings']) {
      // '''multi-line-string''', 'single-line-string', and double-quoted
      shortcutStylePatterns.push(
          [PR_STRING,  /^(?:\'\'\'(?:[^\'\\]|\\[\s\S]|\'{1,2}(?=[^\']))*(?:\'\'\'|$)|\"\"\"(?:[^\"\\]|\\[\s\S]|\"{1,2}(?=[^\"]))*(?:\"\"\"|$)|\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$))/,
           null, '\'"']);
    } else if (options['multiLineStrings']) {
      // 'multi-line-string', "multi-line-string"
      shortcutStylePatterns.push(
          [PR_STRING,  /^(?:\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$)|\`(?:[^\\\`]|\\[\s\S])*(?:\`|$))/,
           null, '\'"`']);
    } else {
      // 'single-line-string', "single-line-string"
      shortcutStylePatterns.push(
          [PR_STRING,
           /^(?:\'(?:[^\\\'\r\n]|\\.)*(?:\'|$)|\"(?:[^\\\"\r\n]|\\.)*(?:\"|$))/,
           null, '"\'']);
    }
    if (options['verbatimStrings']) {
      // verbatim-string-literal production from the C# grammar.  See issue 93.
      fallthroughStylePatterns.push(
          [PR_STRING, /^@\"(?:[^\"]|\"\")*(?:\"|$)/, null]); //"
    }
    var hc = options['hashComments'];
    if (hc) {
      if (options['cStyleComments']) {
        if (hc > 1) {  // multiline hash comments
          shortcutStylePatterns.push(
              [PR_COMMENT, /^#(?:##(?:[^#]|#(?!##))*(?:###|$)|.*)/, null, '#']);
        } else {
          // Stop C preprocessor declarations at an unclosed open comment
          shortcutStylePatterns.push(
              [PR_COMMENT, /^#(?:(?:define|elif|else|endif|error|ifdef|include|ifndef|line|pragma|undef|warning)\b|[^\r\n]*)/,
               null, '#']);
        }
        fallthroughStylePatterns.push(
            [PR_STRING,
             /^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h|[a-z]\w*)>/,
             null]);
      } else {
        shortcutStylePatterns.push([PR_COMMENT, /^#[^\r\n]*/, null, '#']);
      }
    }
    if (options['cStyleComments']) {
      fallthroughStylePatterns.push([PR_COMMENT, /^\/\/[^\r\n]*/, null]);
      fallthroughStylePatterns.push(
          [PR_COMMENT, /^\/\*[\s\S]*?(?:\*\/|$)/, null]);
    }
    if (options['regexLiterals']) {
      /**
       * @const
       */
      var REGEX_LITERAL = (
          // A regular expression literal starts with a slash that is
          // not followed by * or / so that it is not confused with
          // comments.
          '/(?=[^/*])'
          // and then contains any number of raw characters,
          + '(?:[^/\\x5B\\x5C]'
          // escape sequences (\x5C),
          +    '|\\x5C[\\s\\S]'
          // or non-nesting character sets (\x5B\x5D);
          +    '|\\x5B(?:[^\\x5C\\x5D]|\\x5C[\\s\\S])*(?:\\x5D|$))+'
          // finally closed by a /.
          + '/');
      fallthroughStylePatterns.push(
          ['lang-regex',
           new RegExp('^' + REGEXP_PRECEDER_PATTERN + '(' + REGEX_LITERAL + ')')
           ]);
    }

    var types = options['types'];
    if (types) {
      fallthroughStylePatterns.push([PR_TYPE, types]);
    }

    var keywords = ("" + options['keywords']).replace(/^ | $/g, '');
    if (keywords.length) {
      fallthroughStylePatterns.push(
          [PR_KEYWORD,
           new RegExp('^(?:' + keywords.replace(/[\s,]+/g, '|') + ')\\b'),
           null]);
    }

    shortcutStylePatterns.push([PR_PLAIN,       /^\s+/, null, ' \r\n\t\xA0']);
    fallthroughStylePatterns.push(
        // TODO(mikesamuel): recognize non-latin letters and numerals in idents
        [PR_LITERAL,     /^@[a-z_$][a-z_$@0-9]*/i, null],
        [PR_TYPE,        /^(?:[@_]?[A-Z]+[a-z][A-Za-z_$@0-9]*|\w+_t\b)/, null],
        [PR_PLAIN,       /^[a-z_$][a-z_$@0-9]*/i, null],
        [PR_LITERAL,
         new RegExp(
             '^(?:'
             // A hex number
             + '0x[a-f0-9]+'
             // or an octal or decimal number,
             + '|(?:\\d(?:_\\d+)*\\d*(?:\\.\\d*)?|\\.\\d\\+)'
             // possibly in scientific notation
             + '(?:e[+\\-]?\\d+)?'
             + ')'
             // with an optional modifier like UL for unsigned long
             + '[a-z]*', 'i'),
         null, '0123456789'],
        // Don't treat escaped quotes in bash as starting strings.  See issue 144.
        [PR_PLAIN,       /^\\[\s\S]?/, null],
        [PR_PUNCTUATION, /^.[^\s\w\.$@\'\"\`\/\#\\]*/, null]); // '

    return createSimpleLexer(shortcutStylePatterns, fallthroughStylePatterns);
  }

  var decorateSource = sourceDecorator({
        'keywords': ALL_KEYWORDS,
        'hashComments': true,
        'cStyleComments': true,
        'multiLineStrings': true,
        'regexLiterals': true
      });

  /**
   * Given a DOM subtree, wraps it in a list, and puts each line into its own
   * list item.
   *
   * @param {Node} node modified in place.  Its content is pulled into an
   *     HTMLOListElement, and each line is moved into a separate list item.
   *     This requires cloning elements, so the input might not have unique
   *     IDs after numbering.
   */
  function numberLines(node, opt_startLineNum) {
    var nocode = /(?:^|\s)nocode(?:\s|$)/;
    var lineBreak = /\r\n?|\n/;

    var document = node.ownerDocument;

    var whitespace;
    if (node.currentStyle) {
      whitespace = node.currentStyle.whiteSpace;
    } else if (window.getComputedStyle) {
      whitespace = document.defaultView.getComputedStyle(node, null)
          .getPropertyValue('white-space');
    }
    // If it's preformatted, then we need to split lines on line breaks
    // in addition to <BR>s.
    var isPreformatted = whitespace && 'pre' === whitespace.substring(0, 3);

    var li = document.createElement('LI');
    while (node.firstChild) {
      li.appendChild(node.firstChild);
    }
    // An array of lines.  We split below, so this is initialized to one
    // un-split line.
    var listItems = [li];

    function walk(node) {
      switch (node.nodeType) {
        case 1:  // Element
          if (nocode.test(node.className)) { break; }
          if ('BR' === node.nodeName) {
            breakAfter(node);
            // Discard the <BR> since it is now flush against a </LI>.
            if (node.parentNode) {
              node.parentNode.removeChild(node);
            }
          } else {
            for (var child = node.firstChild; child; child = child.nextSibling) {
              walk(child);
            }
          }
          break;
        case 3: case 4:  // Text
          if (isPreformatted) {
            var text = node.nodeValue;
            var match = text.match(lineBreak);
            if (match) {
              var firstLine = text.substring(0, match.index);
              node.nodeValue = firstLine;
              var tail = text.substring(match.index + match[0].length);
              if (tail) {
                var parent = node.parentNode;
                parent.insertBefore(
                    document.createTextNode(tail), node.nextSibling);
              }
              breakAfter(node);
              if (!firstLine) {
                // Don't leave blank text nodes in the DOM.
                node.parentNode.removeChild(node);
              }
            }
          }
          break;
      }
    }

    // Split a line after the given node.
    function breakAfter(lineEndNode) {
      // If there's nothing to the right, then we can skip ending the line
      // here, and move root-wards since splitting just before an end-tag
      // would require us to create a bunch of empty copies.
      while (!lineEndNode.nextSibling) {
        lineEndNode = lineEndNode.parentNode;
        if (!lineEndNode) { return; }
      }

      function breakLeftOf(limit, copy) {
        // Clone shallowly if this node needs to be on both sides of the break.
        var rightSide = copy ? limit.cloneNode(false) : limit;
        var parent = limit.parentNode;
        if (parent) {
          // We clone the parent chain.
          // This helps us resurrect important styling elements that cross lines.
          // E.g. in <i>Foo<br>Bar</i>
          // should be rewritten to <li><i>Foo</i></li><li><i>Bar</i></li>.
          var parentClone = breakLeftOf(parent, 1);
          // Move the clone and everything to the right of the original
          // onto the cloned parent.
          var next = limit.nextSibling;
          parentClone.appendChild(rightSide);
          for (var sibling = next; sibling; sibling = next) {
            next = sibling.nextSibling;
            parentClone.appendChild(sibling);
          }
        }
        return rightSide;
      }

      var copiedListItem = breakLeftOf(lineEndNode.nextSibling, 0);

      // Walk the parent chain until we reach an unattached LI.
      for (var parent;
           // Check nodeType since IE invents document fragments.
           (parent = copiedListItem.parentNode) && parent.nodeType === 1;) {
        copiedListItem = parent;
      }
      // Put it on the list of lines for later processing.
      listItems.push(copiedListItem);
    }

    // Split lines while there are lines left to split.
    for (var i = 0;  // Number of lines that have been split so far.
         i < listItems.length;  // length updated by breakAfter calls.
         ++i) {
      walk(listItems[i]);
    }

    // Make sure numeric indices show correctly.
    if (opt_startLineNum === (opt_startLineNum|0)) {
      listItems[0].setAttribute('value', opt_startLineNum);
    }

    var ol = document.createElement('OL');
    ol.className = 'linenums';
    var offset = Math.max(0, ((opt_startLineNum - 1 /* zero index */)) | 0) || 0;
    for (var i = 0, n = listItems.length; i < n; ++i) {
      li = listItems[i];
      // Stick a class on the LIs so that stylesheets can
      // color odd/even rows, or any other row pattern that
      // is co-prime with 10.
      li.className = 'L' + ((i + offset) % 10);
      if (!li.firstChild) {
        li.appendChild(document.createTextNode('\xA0'));
      }
      ol.appendChild(li);
    }

    node.appendChild(ol);
  }

  /**
   * Breaks {@code job.sourceCode} around style boundaries in
   * {@code job.decorations} and modifies {@code job.sourceNode} in place.
   * @param {Object} job like <pre>{
   *    sourceCode: {string} source as plain text,
   *    spans: {Array.<number|Node>} alternating span start indices into source
   *       and the text node or element (e.g. {@code <BR>}) corresponding to that
   *       span.
   *    decorations: {Array.<number|string} an array of style classes preceded
   *       by the position at which they start in job.sourceCode in order
   * }</pre>
   * @private
   */
  function recombineTagsAndDecorations(job) {
    var isIE = /\bMSIE\b/.test(navigator.userAgent);
    var newlineRe = /\n/g;

    var source = job.sourceCode;
    var sourceLength = source.length;
    // Index into source after the last code-unit recombined.
    var sourceIndex = 0;

    var spans = job.spans;
    var nSpans = spans.length;
    // Index into spans after the last span which ends at or before sourceIndex.
    var spanIndex = 0;

    var decorations = job.decorations;
    var nDecorations = decorations.length;
    // Index into decorations after the last decoration which ends at or before
    // sourceIndex.
    var decorationIndex = 0;

    // Remove all zero-length decorations.
    decorations[nDecorations] = sourceLength;
    var decPos, i;
    for (i = decPos = 0; i < nDecorations;) {
      if (decorations[i] !== decorations[i + 2]) {
        decorations[decPos++] = decorations[i++];
        decorations[decPos++] = decorations[i++];
      } else {
        i += 2;
      }
    }
    nDecorations = decPos;

    // Simplify decorations.
    for (i = decPos = 0; i < nDecorations;) {
      var startPos = decorations[i];
      // Conflate all adjacent decorations that use the same style.
      var startDec = decorations[i + 1];
      var end = i + 2;
      while (end + 2 <= nDecorations && decorations[end + 1] === startDec) {
        end += 2;
      }
      decorations[decPos++] = startPos;
      decorations[decPos++] = startDec;
      i = end;
    }

    nDecorations = decorations.length = decPos;

    var decoration = null;
    while (spanIndex < nSpans) {
      var spanStart = spans[spanIndex];
      var spanEnd = spans[spanIndex + 2] || sourceLength;

      var decStart = decorations[decorationIndex];
      var decEnd = decorations[decorationIndex + 2] || sourceLength;

      var end = Math.min(spanEnd, decEnd);

      var textNode = spans[spanIndex + 1];
      var styledText;
      if (textNode.nodeType !== 1  // Don't muck with <BR>s or <LI>s
          // Don't introduce spans around empty text nodes.
          && (styledText = source.substring(sourceIndex, end))) {
        // This may seem bizarre, and it is.  Emitting LF on IE causes the
        // code to display with spaces instead of line breaks.
        // Emitting Windows standard issue linebreaks (CRLF) causes a blank
        // space to appear at the beginning of every line but the first.
        // Emitting an old Mac OS 9 line separator makes everything spiffy.
        if (isIE) { styledText = styledText.replace(newlineRe, '\r'); }
        textNode.nodeValue = styledText;
        var document = textNode.ownerDocument;
        var span = document.createElement('SPAN');
        span.className = decorations[decorationIndex + 1];
        var parentNode = textNode.parentNode;
        parentNode.replaceChild(span, textNode);
        span.appendChild(textNode);
        if (sourceIndex < spanEnd) {  // Split off a text node.
          spans[spanIndex + 1] = textNode
              // TODO: Possibly optimize by using '' if there's no flicker.
              = document.createTextNode(source.substring(end, spanEnd));
          parentNode.insertBefore(textNode, span.nextSibling);
        }
      }

      sourceIndex = end;

      if (sourceIndex >= spanEnd) {
        spanIndex += 2;
      }
      if (sourceIndex >= decEnd) {
        decorationIndex += 2;
      }
    }
  }


  /** Maps language-specific file extensions to handlers. */
  var langHandlerRegistry = {};
  /** Register a language handler for the given file extensions.
    * @param {function (Object)} handler a function from source code to a list
    *      of decorations.  Takes a single argument job which describes the
    *      state of the computation.   The single parameter has the form
    *      {@code {
    *        sourceCode: {string} as plain text.
    *        decorations: {Array.<number|string>} an array of style classes
    *                     preceded by the position at which they start in
    *                     job.sourceCode in order.
    *                     The language handler should assigned this field.
    *        basePos: {int} the position of source in the larger source chunk.
    *                 All positions in the output decorations array are relative
    *                 to the larger source chunk.
    *      } }
    * @param {Array.<string>} fileExtensions
    */
  function registerLangHandler(handler, fileExtensions) {
    for (var i = fileExtensions.length; --i >= 0;) {
      var ext = fileExtensions[i];
      if (!langHandlerRegistry.hasOwnProperty(ext)) {
        langHandlerRegistry[ext] = handler;
      } else if (window['console']) {
        console['warn']('cannot override language handler %s', ext);
      }
    }
  }
  function langHandlerForExtension(extension, source) {
    if (!(extension && langHandlerRegistry.hasOwnProperty(extension))) {
      // Treat it as markup if the first non whitespace character is a < and
      // the last non-whitespace character is a >.
      extension = /^\s*</.test(source)
          ? 'default-markup'
          : 'default-code';
    }
    return langHandlerRegistry[extension];
  }
  registerLangHandler(decorateSource, ['default-code']);
  registerLangHandler(
      createSimpleLexer(
          [],
          [
           [PR_PLAIN,       /^[^<?]+/],
           [PR_DECLARATION, /^<!\w[^>]*(?:>|$)/],
           [PR_COMMENT,     /^<\!--[\s\S]*?(?:-\->|$)/],
           // Unescaped content in an unknown language
           ['lang-',        /^<\?([\s\S]+?)(?:\?>|$)/],
           ['lang-',        /^<%([\s\S]+?)(?:%>|$)/],
           [PR_PUNCTUATION, /^(?:<[%?]|[%?]>)/],
           ['lang-',        /^<xmp\b[^>]*>([\s\S]+?)<\/xmp\b[^>]*>/i],
           // Unescaped content in javascript.  (Or possibly vbscript).
           ['lang-js',      /^<script\b[^>]*>([\s\S]*?)(<\/script\b[^>]*>)/i],
           // Contains unescaped stylesheet content
           ['lang-css',     /^<style\b[^>]*>([\s\S]*?)(<\/style\b[^>]*>)/i],
           ['lang-in.tag',  /^(<\/?[a-z][^<>]*>)/i]
          ]),
      ['default-markup', 'htm', 'html', 'mxml', 'xhtml', 'xml', 'xsl']);
  registerLangHandler(
      createSimpleLexer(
          [
           [PR_PLAIN,        /^[\s]+/, null, ' \t\r\n'],    //
           [PR_ATTRIB_VALUE, /^(?:\"[^\"]*\"?|\'[^\']*\'?)/, null, '\"\''] // "
           ],
          [
           [PR_TAG,          /^^<\/?[a-z](?:[\w.:-]*\w)?|\/?>$/i],
           [PR_ATTRIB_NAME,  /^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i],
           ['lang-uq.val',   /^=\s*([^>\'\"\s]*(?:[^>\'\"\s\/]|\/(?=\s)))/], // '
           [PR_PUNCTUATION,  /^[=<>\/]+/], //
           ['lang-js',       /^on\w+\s*=\s*\"([^\"]+)\"/i], // "
           ['lang-js',       /^on\w+\s*=\s*\'([^\']+)\'/i], // '
           ['lang-js',       /^on\w+\s*=\s*([^\"\'>\s]+)/i],    // "
           ['lang-css',      /^style\s*=\s*\"([^\"]+)\"/i], // "
           ['lang-css',      /^style\s*=\s*\'([^\']+)\'/i], // '
           ['lang-css',      /^style\s*=\s*([^\"\'>\s]+)/i] // "
           ]),
      ['in.tag']);
  registerLangHandler(
      createSimpleLexer([], [[PR_ATTRIB_VALUE, /^[\s\S]+/]]), ['uq.val']);  //
  registerLangHandler(sourceDecorator({
          'keywords': CPP_KEYWORDS,
          'hashComments': true,
          'cStyleComments': true,
          'types': C_TYPES
        }), ['c', 'cc', 'cpp', 'cxx', 'cyc', 'm']);
  registerLangHandler(sourceDecorator({
          'keywords': 'null,true,false'
        }), ['json']);
  registerLangHandler(sourceDecorator({
          'keywords': CSHARP_KEYWORDS,
          'hashComments': true,
          'cStyleComments': true,
          'verbatimStrings': true,
          'types': C_TYPES
        }), ['cs']);
  registerLangHandler(sourceDecorator({
          'keywords': JAVA_KEYWORDS,
          'cStyleComments': true
        }), ['java']);
  registerLangHandler(sourceDecorator({
          'keywords': SH_KEYWORDS,
          'hashComments': true,
          'multiLineStrings': true
        }), ['bsh', 'csh', 'sh']);
  registerLangHandler(sourceDecorator({
          'keywords': PYTHON_KEYWORDS,
          'hashComments': true,
          'multiLineStrings': true,
          'tripleQuotedStrings': true
        }), ['cv', 'py']);
  registerLangHandler(sourceDecorator({
          'keywords': PERL_KEYWORDS,
          'hashComments': true,
          'multiLineStrings': true,
          'regexLiterals': true
        }), ['perl', 'pl', 'pm']);
  registerLangHandler(sourceDecorator({
          'keywords': RUBY_KEYWORDS,
          'hashComments': true,
          'multiLineStrings': true,
          'regexLiterals': true
        }), ['rb']);
  registerLangHandler(sourceDecorator({
          'keywords': JSCRIPT_KEYWORDS,
          'cStyleComments': true,
          'regexLiterals': true
        }), ['js']);
  registerLangHandler(sourceDecorator({
          'keywords': COFFEE_KEYWORDS,
          'hashComments': 3,  // ### style block comments
          'cStyleComments': true,
          'multilineStrings': true,
          'tripleQuotedStrings': true,
          'regexLiterals': true
        }), ['coffee']);
  registerLangHandler(createSimpleLexer([], [[PR_STRING, /^[\s\S]+/]]), ['regex']); //

  function applyDecorator(job) {
    var opt_langExtension = job.langExtension;

    try {
      // Extract tags, and convert the source code to plain text.
      var sourceAndSpans = extractSourceSpans(job.sourceNode);
      /** Plain text. @type {string} */
      var source = sourceAndSpans.sourceCode;
      job.sourceCode = source;
      job.spans = sourceAndSpans.spans;
      job.basePos = 0;

      // Apply the appropriate language handler
      langHandlerForExtension(opt_langExtension, source)(job);

      // Integrate the decorations and tags back into the source code,
      // modifying the sourceNode in place.
      recombineTagsAndDecorations(job);
    } catch (e) {
      if ('console' in window) {
        console['log'](e && e['stack'] ? e['stack'] : e);
      }
    }
  }

  /**
   * @param sourceCodeHtml {string} The HTML to pretty print.
   * @param opt_langExtension {string} The language name to use.
   *     Typically, a filename extension like 'cpp' or 'java'.
   * @param opt_numberLines {number|boolean} True to number lines,
   *     or the 1-indexed number of the first line in sourceCodeHtml.
   */
  function prettyPrintOne(sourceCodeHtml, opt_langExtension, opt_numberLines) {
    var container = document.createElement('PRE');
    // This could cause images to load and onload listeners to fire.
    // E.g. <img onerror="alert(1337)" src="nosuchimage.png">.
    // We assume that the inner HTML is from a trusted source.
    container.innerHTML = sourceCodeHtml;
    if (opt_numberLines) {
      numberLines(container, opt_numberLines);
    }

    var job = {
      langExtension: opt_langExtension,
      numberLines: opt_numberLines,
      sourceNode: container
    };
    applyDecorator(job);
    return container.innerHTML;
  }

  function prettyPrint(opt_whenDone) {
    function byTagName(tn) { return document.getElementsByTagName(tn); }
    // fetch a list of nodes to rewrite
    var codeSegments = [byTagName('pre'), byTagName('code'), byTagName('xmp')];
    var elements = [];
    for (var i = 0; i < codeSegments.length; ++i) {
      for (var j = 0, n = codeSegments[i].length; j < n; ++j) {
        elements.push(codeSegments[i][j]);
      }
    }
    codeSegments = null;

    var clock = Date;
    if (!clock['now']) {
      clock = { 'now': function () { return +(new Date); } };
    }

    // The loop is broken into a series of continuations to make sure that we
    // don't make the browser unresponsive when rewriting a large page.
    var k = 0;
    var prettyPrintingJob;

    var langExtensionRe = /\blang(?:uage)?-([\w.]+)(?!\S)/;
    var prettyPrintRe = /\bprettyprint\b/;

    function doWork() {
      var endTime = (window['PR_SHOULD_USE_CONTINUATION'] ?
                     clock['now']() + 250 /* ms */ :
                     Infinity);
      for (; k < elements.length && clock['now']() < endTime; k++) {
        var cs = elements[k];
        var className = cs.className;
        if (className.indexOf('prettyprint') >= 0) {
          // If the classes includes a language extensions, use it.
          // Language extensions can be specified like
          //     <pre class="prettyprint lang-cpp">
          // the language extension "cpp" is used to find a language handler as
          // passed to PR.registerLangHandler.
          // HTML5 recommends that a language be specified using "language-"
          // as the prefix instead.  Google Code Prettify supports both.
          // http://dev.w3.org/html5/spec-author-view/the-code-element.html
          var langExtension = className.match(langExtensionRe);
          // Support <pre class="prettyprint"><code class="language-c">
          var wrapper;
          if (!langExtension && (wrapper = childContentWrapper(cs))
              && "CODE" === wrapper.tagName) {
            langExtension = wrapper.className.match(langExtensionRe);
          }

          if (langExtension) {
            langExtension = langExtension[1];
          }

          // make sure this is not nested in an already prettified element
          var nested = false;
          for (var p = cs.parentNode; p; p = p.parentNode) {
            if ((p.tagName === 'pre' || p.tagName === 'code' ||
                 p.tagName === 'xmp') &&
                p.className && p.className.indexOf('prettyprint') >= 0) {
              nested = true;
              break;
            }
          }
          if (!nested) {
            // Look for a class like linenums or linenums:<n> where <n> is the
            // 1-indexed number of the first line.
            var lineNums = cs.className.match(/\blinenums\b(?::(\d+))?/);
            lineNums = lineNums
                  ? lineNums[1] && lineNums[1].length ? +lineNums[1] : true
                  : false;
            if (lineNums) { numberLines(cs, lineNums); }

            // do the pretty printing
            prettyPrintingJob = {
              langExtension: langExtension,
              sourceNode: cs,
              numberLines: lineNums
            };
            applyDecorator(prettyPrintingJob);
          }
        }
      }
      if (k < elements.length) {
        // finish up in a continuation
        setTimeout(doWork, 250);
      } else if (opt_whenDone) {
        opt_whenDone();
      }
    }

    doWork();
  }

   /**
    * Find all the {@code <pre>} and {@code <code>} tags in the DOM with
    * {@code class=prettyprint} and prettify them.
    *
    * @param {Function?} opt_whenDone if specified, called when the last entry
    *     has been finished.
    */
  window['prettyPrintOne'] = prettyPrintOne;
   /**
    * Pretty print a chunk of code.
    *
    * @param {string} sourceCodeHtml code as html
    * @return {string} code as html, but prettier
    */
  window['prettyPrint'] = prettyPrint;
   /**
    * Contains functions for creating and registering new language handlers.
    * @type {Object}
    */
  window['PR'] = {
        'createSimpleLexer': createSimpleLexer,
        'registerLangHandler': registerLangHandler,
        'sourceDecorator': sourceDecorator,
        'PR_ATTRIB_NAME': PR_ATTRIB_NAME,
        'PR_ATTRIB_VALUE': PR_ATTRIB_VALUE,
        'PR_COMMENT': PR_COMMENT,
        'PR_DECLARATION': PR_DECLARATION,
        'PR_KEYWORD': PR_KEYWORD,
        'PR_LITERAL': PR_LITERAL,
        'PR_NOCODE': PR_NOCODE,
        'PR_PLAIN': PR_PLAIN,
        'PR_PUNCTUATION': PR_PUNCTUATION,
        'PR_SOURCE': PR_SOURCE,
        'PR_STRING': PR_STRING,
        'PR_TAG': PR_TAG,
        'PR_TYPE': PR_TYPE
      };
})();

define('text!core/css/bp.css',[],function () { return '/* --- Best Practices --- */\ndiv.practice {\n    border: solid #bebebe 1px;\n    margin: 2em 1em 1em 2em;\n}\n\nspan.practicelab {\n    margin: 1.5em 0.5em 1em 1em;\n    font-weight: bold;\n    font-style: italic;\n    background: #dfffff;\n    position: relative;\n    padding: 0 0.5em;\n    top: -1.5em;\n}\n\np.practicedesc {\n    margin: 1.5em 0.5em 1em 1em;\n}\n\n@media screen {\n    p.practicedesc {\n        position: relative;\n        top: -2em;\n        padding: 0;\n        margin: 1.5em 0.5em -1em 1em;\n    }\n}\n';});


// Module core/best-practices
// Handles the marking up of best practices, and can generate a summary of all of them.
// The summary is generated if there is a section in the document with ID bp-summary.
// Best practices are marked up with span.practicelab.

define(
    'core/best-practices',["text!core/css/bp.css"],
    function (css) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/best-practices");
                var num = 0
                ,   $bps = $("span.practicelab", doc)
                ,   $content = $("<div><h2>Best Practices Summary</h2><ul></ul></div>")
                ,   $ul = $content.find("ul")
                ;
                $bps.each(function () {
                    var $bp = $(this), id = $bp.makeID("bp"), $li = $("<li><a></a></li>"), $a = $li.find("a");
                    num++;
                    $a.attr("href", "#" + id).text("Best Practice " + num);
                    $li.append(doc.createTextNode(": " + $bp.text()));
                    $ul.append($li);
                    $bp.prepend(doc.createTextNode("Best Practice " + num + ": "));
                });
                if ($bps.length) {
                    $(doc).find("head link").first().before($("<style/>").text(css));
                    if ($("#bp-summary")) $("#bp-summary").append($content.contents());
                }
                else {
                    $("#bp-summary").remove();
                }

                msg.pub("end", "core/best-practices");
                cb();
            }
        };
    }
);


// Module core/figure
// Handles figures in the document. This encompasses two primary operations. One is
// converting some old syntax to use the new HTML5 figure and figcaption elements
// (this is undone by the unhtml5 plugin, but that will soon be phased out). The other
// is to enable the generation of a Table of Figures wherever there is a #tof element
// to be found as well as normalise the titles of figures.

define(
    'core/figures',[],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/figures");

                // Move old syntax to new syntax
                $(".figure", doc).each(function (i, figure) {
                    var $figure = $(figure)
                    ,   title = $figure.attr("title") ||
                                $figure.find("[title]").attr("title") ||
                                $figure.attr("alt") ||
                                $figure.find("[alt]").attr("alt") ||
                                "";
                    var $caption = $("<figcaption/>").text(title);
                    
                    // change old syntax to something HTML5 compatible
                    if ($figure.is("div")) {
                        $figure.append($caption);
                        $figure.renameElement("figure");
                    }
                    else {
                        $figure.wrap("<figure></figure>");
                        $figure.parent().append($caption);
                    }
                });
                
                // process all figures
                var figMap = {}, tof = [], num = 0;
                $("figure").each(function () {
                    var $fig = $(this)
                    ,   $cap = $fig.find("figcaption")
                    ,   tit = $cap.text()
                    ,   id = $fig.makeID("fig", tit);
                    
                    // set proper caption title
                    num++;
                    $cap.html("")
                        .append(doc.createTextNode("Fig. "))
                        .append($("<span class='figno'>" + num + "</span>"))
                        .append(doc.createTextNode(" "))
                        .append($("<span class='fig-title'/>").text(tit));
                    figMap[id] = $cap.contents().clone();
                    tof.push($("<li class='tofline'><a class='tocxref' href='#" + id + "'></a></li>")
                                .find(".tocxref")
                                    .append($cap.contents().clone())
                                .end());
                });

                // Update all anchors with empty content that reference a figure ID
                $("a[href]", doc).each(function () {
                    var $a = $(this)
                    ,   id = $a.attr("href");
                    if (!id) return;
                    id = id.substring(1);
                    if (figMap[id]) {
                        $a.addClass("fig-ref");
                        if ($a.html() === "") $a.append(figMap[id]);
                    }
                });
                
                // Create a Table of Figures if a section with id 'tof' exists.
                var $tof = $("#tof", doc);
                if (tof.length && $tof.length) {
                    // if it has a parent section, don't touch it
                    // if it has a class of appendix or introductory, don't touch it
                    // if all the preceding section siblings are introductory, make it introductory
                    // if there is a preceding section sibling which is an appendix, make it appendix
                    if (!$tof.hasClass("appendix") && !$tof.hasClass("introductory") && !$tof.parents("section").length) {
                        if ($tof.prevAll("section.introductory").length == $tof.prevAll("section").length) {
                            $tof.addClass("introductory");
                        }
                        else if ($tof.prevAll("appendix").length) {
                            $tof.addClass("appendix");
                        }
                    }
                    $tof.append($("<h2>Table of Figures</h2>"));
                    $tof.append($("<ul class='tof'/>"));
                    var $ul = $tof.find("ul");
                    while (tof.length) $ul.append(tof.shift());
                }
                msg.pub("end", "core/figures");
                cb();
            }
        };
    }
);

// these options are there for the XPath emulation code, which uses them
// they can be dropped when it is (same for global Document)
/*jshint
    bitwise: false,
    boss:   true
*/
/*global berjon, respecEvent, shortcut, respecConfig, Document */

// RESPEC
var sn;
(function () {
    window.setBerjonBiblio = function(payload) {
        berjon.biblio = payload;
    };
    if (typeof berjon === 'undefined') window.berjon = {};
    function _errEl () {
        var id = "respec-err";
        var err = document.getElementById(id);
        if (err) return err.firstElementChild.nextElementSibling;
        err = sn.element("div",
                            { id: id,
                              style: "position: fixed; width: 350px; top: 10px; right: 10px; border: 3px double #f00; background: #fff",
                              "class": "removeOnSave" },
                            document.body);

        var hide = sn.element("p", {
            style: "float: right; margin: 2px; text-decoration: none"
        }, err);

        sn.text('[', hide);

        var a = sn.element("a", { href: "#" }, hide, 'x');

        a.onclick = function() {
            document.getElementById(id).style.display = 'none';
            return false;
        };

        sn.text(']', hide);

        return sn.element("ul", { style: "clear: both"}, err);
    }
    function error (str) {
        if (window.respecEvent) respecEvent.pub("error", str);
        sn.element("li", { style: "color: #c00" }, _errEl(), str);
    }
    function warning (str) {
        if (window.respecEvent) respecEvent.pub("warn", str);
        sn.element("li", { style: "color: #666" }, _errEl(), str);
    }
    berjon.respec = function () {};
    berjon.respec.prototype = {
        loadAndRun:    function (conf, doc, cb, msg) {
            var count = 0;
            var base = this.findBase();
            var deps = [base + "js/simple-node.js", base + "js/shortcut.js"];
            var obj = this;

            function callback() {
                if (count <= 0) {
                    sn = new berjon.simpleNode({
                        "":     "http://www.w3.org/1999/xhtml",
                        "x":    "http://www.w3.org/1999/xhtml"
                    }, document);
                    obj.run(conf, doc, cb, msg);
                }
            }

            function loadHandler() {
                count--;
                callback();
            }

            var src, refs = this.getRefKeys(conf);
            refs = refs.normativeReferences.concat(refs.informativeReferences).concat(this.findLocalAliases(conf));
            if (refs.length) {
                count++;
                src = conf.httpScheme + "://specref.herokuapp.com/bibrefs?callback=setBerjonBiblio&refs=" + refs.join(',');
                this.loadScript(src, loadHandler);
            }

            // the fact that we hand-load is temporary, and will be fully replaced by RequireJS
            // in the meantime, we need to avoid loading these if we are using the built (bundled)
            // version. So we do some basic detection and decline to load.
            if (!berjon.simpleNode) {
                for (var i = 0; i < deps.length; i++) {
                    count++;
                    this.loadScript(deps[i], loadHandler);
                }
            }

            callback();
        },
        findLocalAliases: function(conf) {
            var res = [];
            if (conf.localBiblio) {
                for (var k in conf.localBiblio) {
                    if (typeof conf.localBiblio[k].aliasOf !== 'undefined') {
                        res.push(conf.localBiblio[k].aliasOf);
                    }
                }
            }
            return res;
        },
        findBase: function() {
            var scripts = document.querySelectorAll("script[src]");
            // XXX clean this up
            var base = "", src;
            for (var i = 0; i < scripts.length; i++) {
                src = scripts[i].src;
                if (/\/js\/require.*\.js$/.test(src)) {
                    base = src.replace(/js\/require.*\.js$/, "");
                }
            }
            // base = respecConfig.respecBase;
            return base;
        },

        loadScript: function(src, cb) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = src;
            script.setAttribute("class", "remove");
            script.onload = cb;
            document.getElementsByTagName('head')[0].appendChild(script);
        },

        run:    function (conf, doc, cb, msg) {
            try {
                this.extractConfig();
                this.overrideBiblio(conf);
                this.bibref(conf, doc, cb, msg);

                if (this.doRDFa) this.makeRDFa();

                // shortcuts
                var obj = this;
                shortcut.add("Ctrl+Shift+Alt+S", function () { obj.showSaveOptions(); });
                shortcut.add("Esc", function () { obj.hideSaveOptions(); });
            }
            catch (e) {
                msg.pub("error", "Processing error: " + e);
            }
            msg.pub("end", "w3c/legacy");
            cb();
        },

        overrideBiblio:     function (conf) {
            if (conf.localBiblio) {
                for (var k in conf.localBiblio) berjon.biblio[k] = conf.localBiblio[k];
            }
        },

        makeRDFa:  function () {
            var abs = document.getElementById("abstract");
            if (abs) {
                var rel = 'dcterms:abstract' ;
                var ref = abs.getAttribute('property') ;
                if (ref) {
                    rel = ref + ' ' + rel ;
                }
                abs.setAttribute('property', rel) ;
                abs.setAttribute('datatype', '') ;
            }
            // annotate sections with Section data
            var secs = document.querySelectorAll("section");
            for (var i = 0; i < secs.length; i++) {
                // if the section has an id, use that.  if not, look at the first child for an id
                var about = '' ;
                // the first child should be a header - that's what we will annotate
                var fc = secs[i].firstElementChild;
                var ref = secs[i].getAttribute('id') ;
                if ( ref ) {
                    about = '#' + ref ;
                } else {
                    if (fc) {
                        ref = fc.getAttribute('id') ;
                        if (ref) {
                            about = '#' + ref;
                        }
                    }
                }
                if (about !== '') {
                    secs[i].setAttribute('typeof', 'bibo:Chapter') ;
                    secs[i].setAttribute('resource', about) ;
                    secs[i].setAttribute('rel', "bibo:chapter" ) ;
                }
            }
        },

        saveMenu: null,
        showSaveOptions:    function () {
            var obj = this;
            this.saveMenu = sn.element("div",
                            { style: "position: fixed; width: 400px; top: 10px; padding: 1em; border: 5px solid #90b8de; background: #fff" },
                            document.body);
            sn.element("h4", {}, this.saveMenu, "Save Options");
            var butH = sn.element("button", {}, this.saveMenu, "Save as HTML");
            butH.onclick = function () { obj.hideSaveOptions(); obj.toHTML(); };
            var butS = sn.element("button", {}, this.saveMenu, "Save as HTML (Source)");
            butS.onclick = function () { obj.hideSaveOptions(); obj.toHTMLSource(); };
            var butS = sn.element("button", {}, this.saveMenu, "Save as XHTML 1");
            butS.onclick = function () { obj.hideSaveOptions(); obj.toXHTML(1); };
            var butS = sn.element("button", {}, this.saveMenu, "Save as XHTML 1 (Source)");
            butS.onclick = function () { obj.hideSaveOptions(); obj.toXHTMLSource(1); };
            var butS = sn.element("button", {}, this.saveMenu, "Save as XHTML 5");
            butS.onclick = function () { obj.hideSaveOptions(); obj.toXHTML(5); };
            var butS = sn.element("button", {}, this.saveMenu, "Save as XHTML 5 (Source)");
            butS.onclick = function () { obj.hideSaveOptions(); obj.toXHTMLSource(5); };
            if (this.diffTool && (this.previousDiffURI || this.previousURI) ) {
                var butD = sn.element("button", {}, this.saveMenu, "Diffmark");
                butD.onclick = function () { obj.hideSaveOptions(); obj.toDiffHTML(); };
            }

        },

        hideSaveOptions:    function () {
            if (!this.saveMenu) return;
            this.saveMenu.parentNode.removeChild(this.saveMenu);
        },

        toString:    function () {
            var str = "<!DOCTYPE html";
            var dt = document.doctype;
            if (dt && dt.publicId) {
                str += " PUBLIC '" + dt.publicId + "' '" + dt.systemId + "'";
            }
            str += ">\n";
            str += "<html";
            var ats = document.documentElement.attributes;
            var prefixAtr = '' ;

            for (var i = 0; i < ats.length; i++) {
                var an = ats[i].name;
                if (an == "xmlns" || an == "xml:lang") continue;
                if (an == "prefix") {
                    prefixAtr = ats[i].value;
                    continue;
                }
                str += " " + an + "=\"" + this._esc(ats[i].value) + "\"";
            }

            str += ">\n";
            var cmt = document.createComment("[if lt IE 9]><script src='https://www.w3.org/2008/site/js/html5shiv.js'></script><![endif]");
            $("head").append(cmt);
            str += document.documentElement.innerHTML;
            str += "</html>";
            return str;
        },

        toXML:        function (mode) {
            if (mode != 5) {
                // not doing xhtml5 so rip out the html5 stuff
                $.each("section figcaption figure".split(" "), function (i, item) {
                    $(item).renameElement("div").addClass(item);
                });
                $("time").renameElement("span").addClass("time").removeAttr('datetime');
                $("[role]").removeAttr('role') ;
                $("[aria-level]").removeAttr('aria-level') ;
                $("style:not([type])").attr("type", "text/css");
                $("script:not([type])").attr("type", "text/javascript");
            }
            var str = "<?xml version='1.0' encoding='UTF-8'?>\n<!DOCTYPE html";
            var dt = document.doctype;
            if (dt && dt.publicId) {
                str += " PUBLIC '" + dt.publicId + "' '" + dt.systemId + "'";
            }
            else if (mode != 5) {
                if (this.doRDFa) {
                    if (this.doRDFa == "1.1") {
                        // use the standard RDFa 1.1 doctype
                        str += " PUBLIC '-//W3C//DTD XHTML+RDFa 1.1//EN' 'http://www.w3.org/MarkUp/DTD/xhtml-rdfa-2.dtd'";
                    } else {
                        // use the standard RDFa doctype
                        str += " PUBLIC '-//W3C//DTD XHTML+RDFa 1.0//EN' 'http://www.w3.org/MarkUp/DTD/xhtml-rdfa-1.dtd'";
                    }
                } else {
                    str += " PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'";
                }
            }
            str += ">\n";
            str += "<html";
            var ats = document.documentElement.attributes;
            var prefixAtr = '' ;

            var hasxmlns = false;
            for (var i = 0; i < ats.length; i++) {
                var an = ats[i].name;
                if (an == "lang") continue;
                if (an == "xmlns") hasxmlns = true;
                str += " " + an + "=\"" + this._esc(ats[i].value) + "\"";
            }
            if (!hasxmlns) str += ' xmlns="http://www.w3.org/1999/xhtml"';
            str += ">\n";
            // walk the entire DOM tree grabbing nodes and emitting them - possibly modifying them
            // if they need the funny closing tag
            var pRef = this ;
            var selfClosing = {};
            "br img input area base basefont col isindex link meta param hr".split(" ").forEach(function (n) {
                selfClosing[n] = true;
            });
            var noEsc = [false];
            if (mode == 5) {
                var cmt = document.createComment("[if lt IE 9]><script src='https://www.w3.org/2008/site/js/html5shiv.js'></script><![endif]");
                $("head", document).append(cmt);
            }
            var dumpNode = function (node) {
                var out = '';
                // if the node is the document node.. process the children
                if ( node.nodeType == 9 || ( node.nodeType == 1 && node.nodeName.toLowerCase() == 'html' ) ) {
                    for (var i = 0; i < node.childNodes.length; i++) out += dumpNode(node.childNodes[i]) ;
                }
                // element
                else if (1 === node.nodeType) {
                    var ename = node.nodeName.toLowerCase() ;
                    out += '<' + ename ;
                    for (var i = 0; i < node.attributes.length; i++) {
                        var atn = node.attributes[i];
                        if (/^\d+$/.test(atn.name)) continue;
                        out += " " + atn.name + "=\"" + pRef._esc(atn.value) + "\"";
                    }
                    if (selfClosing[ename]) {
                        out += ' />';
                    }
                    else {
                        out += '>';
                        // XXX removing this, as it does not seem correct at all
                        // if ( ename == 'pre' ) {
                        //     out += "\n" + node.innerHTML;
                        // }
                        // else {
                            // console.log("NAME: " + ename);
                            noEsc.push(ename === "style" || ename === "script");
                            // console.log(noEsc);
                            for (var i = 0; i < node.childNodes.length; i++) out += dumpNode(node.childNodes[i]);
                            noEsc.pop();
                        // }
                        out += '</' + ename + '>';
                    }
                }
                // comments
                else if (8 === node.nodeType) {
                    out += "\n<!--" + node.nodeValue + "-->\n";
                }
                // text or cdata
                else if (3 === node.nodeType || 4 === node.nodeType) {
                    // console.log("TEXT: " + noEsc[noEsc.length - 1]);
                    out += noEsc[noEsc.length - 1] ? node.nodeValue : pRef._esc(node.nodeValue);
                }
                // we don't handle other types for the time being
                else {
                    warning("Cannot handle serialising nodes of type: " + node.nodeType);
                }
                return out;
            };
            str += dumpNode(document.documentElement) ;
            str += "</html>";
            return str;
        },

        toDiffHTML:  function () {
            // create a diff marked version against the previousURI
            // strategy - open a window in which there is a form with the
            // data needed for diff marking - submit the form so that the response populates
            // page with the diff marked version
            var base = window.location.href;
            base = base.replace(/\/[^\/]*$/, "/");
            var str = "<!DOCTYPE html>\n";
            str += "<html";
            var ats = document.documentElement.attributes;
            for (var i = 0; i < ats.length; i++) {
                str += " " + ats[i].name + "=\"" + this._esc(ats[i].value) + "\"";
            }
            str += ">\n";
            str += "<head><title>diff form</title></head>\n";
            str += "<body><form name='form' method='POST' action='" + this.diffTool + "'>\n";
            str += "<input type='hidden' name='base' value='" + base + "'>\n";
            if (this.previousDiffURI) {
                str += "<input type='hidden' name='oldfile' value='" + this.previousDiffURI + "'>\n";
            } else {
                str += "<input type='hidden' name='oldfile' value='" + this.previousURI + "'>\n";
            }
            str += '<input type="hidden" name="newcontent" value="' + this._esc(this.toString()) + '">\n';
            str += '<p>Please wait...</p>';
            str += "</form></body></html>\n";


            var x = window.open() ;
            x.document.write(str) ;
            x.document.close() ;
            x.document.form.submit() ;
        },

        toHTML:    function () {
            var x = window.open();
            x.document.write(this.toString());
            x.document.close();
        },

        toHTMLSource:    function () {
            var x = window.open();
            x.document.write("<pre>" + this._esc(this.toString()) + "</pre>");
            x.document.close();
        },

        toXHTML:    function (mode) {
            var x = window.open();
            x.document.write(this.toXML(mode)) ;
            x.document.close();
        },

        toXHTMLSource:    function (mode) {
            var x = window.open();
            x.document.write("<pre>" + this._esc(this.toXML(mode)) + "</pre>");
            x.document.close();
        },

        // --- METADATA -------------------------------------------------------
        extractConfig:    function () {
            var cfg = respecConfig || {};
            if (!cfg.diffTool) cfg.diffTool = 'http://www5.aptest.com/standards/htmldiff/htmldiff.pl';
            // note this change - the default is now to inject RDFa 1.1.  You can override it by
            // setting RDFa to false
            if (cfg.doRDFa === undefined) cfg.doRDFa = "1.1";
            for (var k in cfg) {
                if (cfg.hasOwnProperty(k)) this[k] = cfg[k];
            }
        },

        getRefKeys:    function (conf) {
            var informs = conf.informativeReferences
            ,   norms = conf.normativeReferences
            ,   del = []
            ;

            function getKeys(obj) {
                var res = [];
                for (var k in obj) res.push(k);
                return res;
            }

            for (var k in informs) if (norms[k]) del.push(k);
            for (var i = 0; i < del.length; i++) delete informs[del[i]];

            return {
                informativeReferences: getKeys(informs),
                normativeReferences: getKeys(norms)
            };
        },

        // --- INLINE PROCESSING ----------------------------------------------------------------------------------
        bibref:    function (conf, doc, cb, msg) {
            // this is in fact the bibref processing portion
            var badrefs = {}
            ,   badrefcount = 0
            ,   refs = this.getRefKeys(conf)
            ,   informs = refs.informativeReferences
            ,   norms = refs.normativeReferences
            ,   aliases = {}
            ;

            if (!informs.length && !norms.length && !this.refNote) return;
            var refsec = sn.element("section", { id: "references", "class": "appendix" }, document.body);
            sn.element("h2", {}, refsec, "References");
            if (this.refNote) {
                var refnote = sn.element("p", {}, refsec);
                refnote.innerHTML = this.refNote;
            }

            var types = ["Normative", "Informative"];
            for (var i = 0; i < types.length; i++) {
                var type = types[i];
                var refs = (type == "Normative") ? norms : informs;
                if (!refs.length) continue;
                var sec = sn.element("section", {}, refsec);
                sn.makeID(sec, null, type + " references");
                sn.element("h3", {}, sec, type + " references");
                refs.sort();
                var dl = sn.element("dl", { "class": "bibliography" }, sec);
                if (this.doRDFa) {
                    dl.setAttribute('about', '') ;
                }
                for (var j = 0; j < refs.length; j++) {
                    var ref = refs[j];
                    sn.element("dt", { id: "bib-" + ref }, dl, "[" + ref + "]");
                    var dd = sn.element("dd", {}, dl);
                    if (this.doRDFa) {
                        if (type == 'Normative') {
                            dd.setAttribute('rel','dcterms:requires');
                        } else {
                            dd.setAttribute('rel','dcterms:references');
                        }
                    }

                    var refcontent = berjon.biblio[ref],
                        circular = {},
                        key = ref;
                    circular[ref] = true;
                    while (refcontent && refcontent.aliasOf) {
                        if (circular[refcontent.aliasOf]) {
                            refcontent = null;
                            error("Circular reference in biblio DB between [" + ref + "] and [" + key + "].");
                        } else {
                            key = refcontent.aliasOf;
                            refcontent = berjon.biblio[key];
                            circular[key] = true;
                        }
                    }
                    aliases[key] = aliases[key] || [];
                    if (aliases[key].indexOf(ref) < 0) aliases[key].push(ref);

                    if (refcontent) {
                        dd.innerHTML = this.stringifyRef(refcontent) + "\n";
                    } else {
                        if (!badrefs[ref]) badrefs[ref] = 0;
                        badrefs[ref]++;
                        badrefcount++;
                        dd.innerHTML = "<em>Reference not found.</em>\n";
                    }
                }
            }
            for (var k in aliases) {
                if (aliases[k].length > 1) {
                    warning("[" + k + "] is referenced in " + aliases[k].length + " ways (" + aliases[k].join(", ") + "). This causes duplicate entries in the reference section.");
                }
            }

            if(badrefcount > 0) {
                error("Got " + badrefcount + " tokens looking like a reference, not in biblio DB: ");
                for (var item in badrefs) {
                    if (badrefs.hasOwnProperty(item)) error("Bad ref: " + item + ", count = " + badrefs[item]);
                }
            }

        },

        stringifyRef: function(ref) {
            if(typeof ref == 'string') return ref;
            var output = '';
            if(ref.authors && ref.authors.length) {
                output += ref.authors.join('; ');
                if(ref.etAl) output += ' et al';
                output += '. ';
            }
            output += '<a href="' + ref.href + '"><cite>' + ref.title + '</cite></a>. ';
            if(ref.date) output += ref.date + '. ';
            if(ref.status) output += this.getRefStatus(ref.status) + '. ';
            output += 'URL: <a href="' + ref.href + '">' + ref.href + '</a>';
            return output;
        },

        getRefStatus: function(status) {
            return this.REF_STATUSES[status] || status;
        },

        REF_STATUSES: {
            "NOTE": "W3C Note",
            "WG-NOTE": "W3C Working Group Note",
            "ED": "W3C Editor's Draft",
            "FPWD": "W3C First Public Working Draft",
            "WD": "W3C Working Draft",
            "LCWD": "W3C Last Call Working Draft",
            "CR": "W3C Candidate Recommendation",
            "PR": "W3C Proposed Recommendation",
            "PER": "W3C Proposed Edited Recommendation",
            "REC": "W3C Recommendation"
        },

        // --- HELPERS --------------------------------------------------------------------------------------------
        _esc:    function (s) {
            s = s.replace(/&/g,'&amp;');
            s = s.replace(/>/g,'&gt;');
            s = s.replace(/"/g,'&quot;');
            s = s.replace(/</g,'&lt;');
            return s;
        }
    };
}());
// EORESPEC

// XPATH
// ReSpec XPath substitute JS workaround for UA's without DOM L3 XPath support
// By Travis Leithead (travil AT microsoft dotcom)
// (select APIs and behaviors specifically for ReSpec's usage of DOM L3 XPath; no more an no less)
// For IE, requires v.9+
(function () {
    if (!document.evaluate) {
        //////////////////////////////////////
        // interface XPathResult
        //////////////////////////////////////
        // Augments a generic JS Array to appear to be an XPathResult (thus allowing [] notation to work)
        window.XPathResult = function (list) {
            list.snapshotLength = list.length;
            list.snapshotItem = function (index) { return this[index]; };
            return list;
        };
        window.XPathResult.prototype.ORDERED_NODE_SNAPSHOT_TYPE = 7;
        window.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE = 7;

        //////////////////////////////////////
        // interface XPathEvaluator
        //////////////////////////////////////
        // Not exposed to the window (not needed)
        var XPathEvaluator = function (assignee) {
            var findElementsContainingContextNode = function (element, contextNode) {
                var allUpList = document.querySelectorAll(element);
                var resultSet = [];
                for (var i = 0, len = allUpList.length; i < len; i++) {
                    if (allUpList[i].compareDocumentPosition(contextNode) & 16)
                        resultSet.push(allUpList[i]);
                }
                return resultSet;
            };
            var allTextCache = null;
            var buildTextCacheUnderBody = function () {
                if (allTextCache == null) {
                    var iter = document.createNodeIterator(document.body, 4, function () { return 1; }, false);
                    allTextCache = [];
                    var n;
                    while (n = iter.nextNode()) {
                        allTextCache.push(n);
                    }
                }
                // Note: no cache invalidation for dynamic updates...
            };
            var getAllTextNodesUnderContext = function (contextNode) {
                buildTextCacheUnderBody();
                var candidates = [];
                for (var i = 0, len = allTextCache.length; i < len; i++) {
                    if (allTextCache[i].compareDocumentPosition(contextNode) & 8)
                        candidates.push(allTextCache[i]);
                }
                return candidates;
            };
            var findAncestorsOfContextNode = function (element, contextNode) {
                var allUpList = document.querySelectorAll(element);
                var candidates = [];
                for (var i = 0, len = allUpList.length; i < len; i++) {
                    if (allUpList[i].compareDocumentPosition(contextNode) & 16)
                        candidates.push(allUpList[i]);
                }
                return candidates;
            };
            var findSpecificChildrenOfContextNode = function (contextNode, selector) { // element.querySelectorAll(":scope > "+elementType)
                var allUpList = contextNode.querySelectorAll(selector);
                // Limit to children only...
                var candidates = [];
                for (var i = 0, len = allUpList.length; i < len; i++) {
                    if (allUpList[i].parentNode == contextNode)
                        candidates.push(allUpList[i]);
                }
                return candidates;
            };
            assignee.evaluate = function (xPathExpression, contextNode, resolverCallback, type, result) {
                // "ancestor::x:section|ancestor::section", sec
                if (xPathExpression == "ancestor::x:section|ancestor::section") // e.g., "section :scope" (but matching section)
                    return XPathResult(findElementsContainingContextNode("section", contextNode));
                else if (xPathExpression == "./x:section|./section") // e.g., ":scope > section"
                    return XPathResult(findSpecificChildrenOfContextNode(contextNode, "section"));
                else if (xPathExpression == "./x:section[not(@class='introductory')]|./section[not(@class='introductory')]") // e.g., ":scope > section:not([class='introductory'])"
                    return XPathResult(findSpecificChildrenOfContextNode(contextNode, "section:not([class='introductory'])"));
                else if (xPathExpression == ".//text()") // Not possible via Selectors API. Note that ":contains("...") can be used to find particular element containers of text
                    return XPathResult(getAllTextNodesUnderContext(contextNode));
                else if ((xPathExpression == "ancestor::abbr") || (xPathExpression == "ancestor::acronym")) // e.g., "abbr :scope, acronym :scope" (but match the element, not the scope)
                    return XPathResult(findAncestorsOfContextNode((xPathExpression == "ancestor::abbr") ? "abbr" : "acronym", contextNode));
                else if (xPathExpression == "./dt") // e.g., ":scope > dt"
                    return XPathResult(findSpecificChildrenOfContextNode(contextNode, "dt"));
                else if (xPathExpression == "dl[@class='parameters']")
                    return XPathResult(contextNode.querySelectorAll("dl[class='parameters']"));
                else if (xPathExpression == "*[@class='exception']")
                    return XPathResult(contextNode.querySelectorAll("[class='exception']"));
                else // Anything else (not supported)
                    return XPathResult([]);
            };
        };
        // Document implements XPathExpression
        if (window.Document) {
            XPathEvaluator(Document.prototype);
        }
        else // no prototype hierarchy support (or Document doesn't exist)
            XPathEvaluator(window.document);
    }
}());
// EOXPATH

define('w3c/legacy',[], function () {
    return {
        run:    function (conf, doc, cb, msg) {
            msg.pub("start", "w3c/legacy");
            (new berjon.respec()).loadAndRun(conf, doc, cb, msg);
        }
    };
});

define('tmpl!core/css/webidl-oldschool.css', ['handlebars'], function (hb) { return Handlebars.compile('/* --- WEB IDL --- */\npre.idl {\n    border-top: 1px solid #90b8de;\n    border-bottom: 1px solid #90b8de;\n    padding:    1em;\n    line-height:    120%;\n}\n\npre.idl::before {\n    content:    "WebIDL";\n    display:    block;\n    width:      150px;\n    background: #90b8de;\n    color:  #fff;\n    font-family:    initial;\n    padding:    3px;\n    font-weight:    bold;\n    margin: -1em 0 1em -1em;\n}\n\n.idlType {\n    color:  #ff4500;\n    font-weight:    bold;\n    text-decoration:    none;\n}\n\n/*.idlModule*/\n/*.idlModuleID*/\n/*.idlInterface*/\n.idlInterfaceID, .idlDictionaryID, .idlCallbackID, .idlEnumID {\n    font-weight:    bold;\n    color:  #005a9c;\n}\na.idlEnumItem {\n    color:  #000;\n    border-bottom:  1px dotted #ccc;\n    text-decoration: none;\n}\n\n.idlSuperclass {\n    font-style: italic;\n    color:  #005a9c;\n}\n\n/*.idlAttribute*/\n.idlAttrType, .idlFieldType, .idlMemberType {\n    color:  #005a9c;\n}\n.idlAttrName, .idlFieldName, .idlMemberName {\n    color:  #ff4500;\n}\n.idlAttrName a, .idlFieldName a, .idlMemberName a {\n    color:  #ff4500;\n    border-bottom:  1px dotted #ff4500;\n    text-decoration: none;\n}\n\n/*.idlMethod*/\n.idlMethType, .idlCallbackType {\n    color:  #005a9c;\n}\n.idlMethName {\n    color:  #ff4500;\n}\n.idlMethName a {\n    color:  #ff4500;\n    border-bottom:  1px dotted #ff4500;\n    text-decoration: none;\n}\n\n/*.idlCtor*/\n.idlCtorName {\n    color:  #ff4500;\n}\n.idlCtorName a {\n    color:  #ff4500;\n    border-bottom:  1px dotted #ff4500;\n    text-decoration: none;\n}\n\n/*.idlParam*/\n.idlParamType {\n    color:  #005a9c;\n}\n.idlParamName, .idlDefaultValue {\n    font-style: italic;\n}\n\n.extAttr {\n    color:  #666;\n}\n\n/*.idlSectionComment*/\n.idlSectionComment {\n    color: gray;\n}\n\n/*.idlConst*/\n.idlConstType {\n    color:  #005a9c;\n}\n.idlConstName {\n    color:  #ff4500;\n}\n.idlConstName a {\n    color:  #ff4500;\n    border-bottom:  1px dotted #ff4500;\n    text-decoration: none;\n}\n\n/*.idlException*/\n.idlExceptionID {\n    font-weight:    bold;\n    color:  #c00;\n}\n\n.idlTypedefID, .idlTypedefType {\n    color:  #005a9c;\n}\n\n.idlRaises, .idlRaises a.idlType, .idlRaises a.idlType code, .excName a, .excName a code {\n    color:  #c00;\n    font-weight:    normal;\n}\n\n.excName a {\n    font-family:    monospace;\n}\n\n.idlRaises a.idlType, .excName a.idlType {\n    border-bottom:  1px dotted #c00;\n}\n\n.excGetSetTrue, .excGetSetFalse, .prmNullTrue, .prmNullFalse, .prmOptTrue, .prmOptFalse {\n    width:  45px;\n    text-align: center;\n}\n.excGetSetTrue, .prmNullTrue, .prmOptTrue { color:  #0c0; }\n.excGetSetFalse, .prmNullFalse, .prmOptFalse { color:  #c00; }\n\n.idlImplements a {\n    font-weight:    bold;\n}\n\ndl.attributes, dl.methods, dl.constants, dl.constructors, dl.fields, dl.dictionary-members {\n    margin-left:    2em;\n}\n\n.attributes dt, .methods dt, .constants dt, .constructors dt, .fields dt, .dictionary-members dt {\n    font-weight:    normal;\n}\n\n.attributes dt code, .methods dt code, .constants dt code, .constructors dt code, .fields dt code, .dictionary-members dt code {\n    font-weight:    bold;\n    color:  #000;\n    font-family:    monospace;\n}\n\n.attributes dt code, .fields dt code, .dictionary-members dt code {\n    background:  #ffffd2;\n}\n\n.attributes dt .idlAttrType code, .fields dt .idlFieldType code, .dictionary-members dt .idlMemberType code {\n    color:  #005a9c;\n    background:  transparent;\n    font-family:    inherit;\n    font-weight:    normal;\n    font-style: italic;\n}\n\n.methods dt code {\n    background:  #d9e6f8;\n}\n\n.constants dt code {\n    background:  #ddffd2;\n}\n\n.constructors dt code {\n    background:  #cfc;\n}\n\n.attributes dd, .methods dd, .constants dd, .constructors dd, .fields dd, .dictionary-members dd {\n    margin-bottom:  1em;\n}\n\ntable.parameters, table.exceptions {\n    border-spacing: 0;\n    border-collapse:    collapse;\n    margin: 0.5em 0;\n    width:  100%;\n}\ntable.parameters { border-bottom:  1px solid #90b8de; }\ntable.exceptions { border-bottom:  1px solid #deb890; }\n\n.parameters th, .exceptions th {\n    color:  #fff;\n    padding:    3px 5px;\n    text-align: left;\n    font-family:    initial;\n    font-weight:    normal;\n    text-shadow:    #666 1px 1px 0;\n}\n.parameters th { background: #90b8de; }\n.exceptions th { background: #deb890; }\n\n.parameters td, .exceptions td {\n    padding:    3px 10px;\n    border-top: 1px solid #ddd;\n    vertical-align: top;\n}\n\n.parameters tr:first-child td, .exceptions tr:first-child td {\n    border-top: none;\n}\n\n.parameters td.prmName, .exceptions td.excName, .exceptions td.excCodeName {\n    width:  100px;\n}\n\n.parameters td.prmType {\n    width:  120px;\n}\n\ntable.exceptions table {\n    border-spacing: 0;\n    border-collapse:    collapse;\n    width:  100%;\n}\n');});

define('tmpl!core/templates/webidl/module.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlModule\'>{{extAttr obj indent true }}{{idn indent}}module <span class=\'idlModuleID\'>{{obj.id}}</span> {\n{{#each obj.children}}{{asWebIDL proc this indent}}{{/each}}\n{{idn indent}}};</span>\n');});

define('tmpl!core/templates/webidl/typedef.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlTypedef\' id=\'idl-def-{{obj.refId}}\'>typedef {{extAttr obj 0 false\n}}<span class=\'idlTypedefType\'>{{datatype obj.datatype\n}}</span>{{arr}}{{nullable}} <span class=\'idlTypedefID\'>{{obj.id}}</span>;</span>\n');});

define('tmpl!core/templates/webidl/implements.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlImplements\'>{{extAttr obj indent true}}{{idn indent}}<a>{{obj.id}}</a> implements <a>{{obj.datatype}}</a>;</span>\n');});

define('tmpl!core/templates/webidl/dict-member.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlMember\'>{{extAttr obj indent true\n}}{{idn indent}}<span class=\'idlMemberType\'>{{datatype obj.datatype}}{{arr}}{{nullable}}</span> {{pads pad\n}}<span class=\'idlMemberName\'><a href=\'#{{curLnk}}{{obj.refId}}\'>{{obj.id}}</a></span>{{#if obj.defaultValue\n}} = <span class=\'idlMemberValue\'>{{obj.defaultValue}}</span>{{/if}};</span>\n');});

define('tmpl!core/templates/webidl/dictionary.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlDictionary\' id=\'idl-def-{{obj.refId}}\'>{{extAttr obj indent true\n}}{{idn indent}}{{partial}}dictionary <span class=\'idlDictionaryID\'>{{obj.id}}</span>{{superclasses obj}} {\n{{{children}}}};</span>\n');});

define('tmpl!core/templates/webidl/enum-item.html', ['handlebars'], function (hb) { return Handlebars.compile('{{idn indent}}"<a href="#idl-def-{{parentID}}.{{obj.refId}}" class="idlEnumItem">{{obj.id}}</a>"');});

define('tmpl!core/templates/webidl/enum.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlEnum\' id=\'idl-def-{{obj.refId}}\'>{{extAttr obj indent true\n}}{{idn indent}}enum <span class=\'idlEnumID\'>{{obj.id}}</span> {\n{{{children}}}\n{{idn indent}}}};');});

define('tmpl!core/templates/webidl/const.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlConst\'>{{extAttr obj indent true\n}}{{idn indent}}const <span class=\'idlConstType\'><a>{{obj.datatype}}</a>{{nullable}}</span> {{pads pad\n}}<span class=\'idlConstName\'><a href=\'#{{curLnk}}{{obj.refId}}\'>{{obj.id\n}}</a></span> = <span class=\'idlConstValue\'>{{obj.value}}</span>;</span>\n');});

define('tmpl!core/templates/webidl/param.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlParam\'>{{extAttr obj 0 false\n}}{{optional}}<span class=\'idlParamType\'>{{datatype obj.datatype}}{{arr}}{{nullable}}{{variadic\n}}</span> <span class=\'idlParamName\'>{{obj.id}}</span>{{#if obj.defaultValue\n}} = <span class=\'idlDefaultValue\'>{{obj.defaultValue}}</span>{{/if}}</span>');});

define('tmpl!core/templates/webidl/callback.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlCallback\' id=\'idl-def-{{obj.refId}}\'>{{extAttr obj indent true\n}}{{idn indent}}callback <span class=\'idlCallbackID\'>{{obj.id\n}}</span> = <span class=\'idlCallbackType\'>{{datatype obj.datatype}}{{arr}}{{nullable}}</span> ({{{children}}});</span>\n');});

define('tmpl!core/templates/webidl/method.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlMethod\'>{{extAttr obj indent true\n}}{{idn indent}}{{static}}<span class=\'idlMethType\'>{{datatype obj.datatype}}{{arr}}{{nullable}}</span> {{pads pad\n}}<span class=\'idlMethName\'><a href=\'#{{id}}\'>{{obj.id}}</a></span> ({{{children}}});</span>\n');});

define('tmpl!core/templates/webidl/constructor.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlCtor\'>{{extAttr obj indent true\n}}{{idn indent}} <span class=\'idlCtorKeyword\'>{{keyword}}</span><span class=\'idlCtorName\'><a href=\'#{{id}}\'>{{name}}</a></span>{{param obj children}}</span>');});

define('tmpl!core/templates/webidl/attribute.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlAttribute\'>{{extAttr obj indent true\n}}{{idn indent}}{{declaration}} attribute <span class=\'idlAttrType\'>{{datatype obj.datatype}}{{arr}}{{nullable}}</span> {{pads\npad}}<span class=\'idlAttrName\'><a href=\'#{{href}}\'>{{obj.id}}</a></span>;</span>\n');});

define('tmpl!core/templates/webidl/serializer.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlSerializer\'>{{extAttr obj indent true\n}}{{idn indent}}serializer{{#if values}} = <span class=\'idlSerializerValues\'>{{values}}</span>{{/if}};</span>\n');});

define('tmpl!core/templates/webidl/comment.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlSectionComment\'>{{extAttr obj indent true\n}}{{idn indent}}// {{comment}}</span>\n');});

define('tmpl!core/templates/webidl/field.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlField\'>{{extAttr obj indent true\n}}{{idn indent}}<span class=\'idlFieldType\'>{{datatype obj.datatype}}{{arr}}{{nullable}}</span> {{pads\npad}}<span class=\'idlFieldName\'><a href=\'#{{href}}\'>{{obj.id}}</a></span>;</span>\n');});

define('tmpl!core/templates/webidl/exception.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlException\' id=\'idl-def-{{obj.refId}}\'>{{extAttr obj indent true\n}}{{idn indent}}exception <span class=\'idlExceptionID\'>{{obj.id}}</span>{{superclasses obj}} {\n{{{children}}}{{idn indent}}}};</span>');});

define('tmpl!core/templates/webidl/interface.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlInterface\' id=\'{{id}}\'>{{extAttr obj indent true ctor\n}}{{idn indent}}{{partial}}{{callback}}interface <span class=\'idlInterfaceID\'>{{obj.id}}</span>{{superclasses obj}} {\n{{{children}}}{{idn indent}}}};</span>');});

/*global sn, Handlebars */

// Module core/webidl-oldschool
//  Transforms specific markup into the complex old school rendering for API information.

// TODO:
//  - It could be useful to report parsed IDL items as events
//  - don't use generated content in the CSS!

define(
    'core/webidl-oldschool',[
        "handlebars"
    ,   "tmpl!core/css/webidl-oldschool.css"
    ,   "tmpl!core/templates/webidl/module.html"
    ,   "tmpl!core/templates/webidl/typedef.html"
    ,   "tmpl!core/templates/webidl/implements.html"
    ,   "tmpl!core/templates/webidl/dict-member.html"
    ,   "tmpl!core/templates/webidl/dictionary.html"
    ,   "tmpl!core/templates/webidl/enum-item.html"
    ,   "tmpl!core/templates/webidl/enum.html"
    ,   "tmpl!core/templates/webidl/const.html"
    ,   "tmpl!core/templates/webidl/param.html"
    ,   "tmpl!core/templates/webidl/callback.html"
    ,   "tmpl!core/templates/webidl/method.html"
    ,   "tmpl!core/templates/webidl/constructor.html"
    ,   "tmpl!core/templates/webidl/attribute.html"
    ,   "tmpl!core/templates/webidl/serializer.html"
    ,   "tmpl!core/templates/webidl/comment.html"
    ,   "tmpl!core/templates/webidl/field.html"
    ,   "tmpl!core/templates/webidl/exception.html"
    ,   "tmpl!core/templates/webidl/interface.html"
    ],
    function (hb, css, idlModuleTmpl, idlTypedefTmpl, idlImplementsTmpl, idlDictMemberTmpl, idlDictionaryTmpl,
                   idlEnumItemTmpl, idlEnumTmpl, idlConstTmpl, idlParamTmpl, idlCallbackTmpl, idlMethodTmpl,
              idlConstructorTmpl, idlAttributeTmpl, idlSerializerTmpl, idlCommentTmpl, idlFieldTmpl, idlExceptionTmpl, idlInterfaceTmpl) {
        var WebIDLProcessor = function (cfg) {
                this.parent = { type: "module", id: "outermost", children: [] };
                if (!cfg) cfg = {};
                for (var k in cfg) if (cfg.hasOwnProperty(k)) this[k] = cfg[k];

                Handlebars.registerHelper("extAttr", function (obj, indent, nl, ctor) {
                    var ret = "";
                    if (obj.extendedAttributes) {
                        ret += idn(indent) + "[<span class='extAttr'>" + obj.extendedAttributes + "</span>" +
                               (typeof ctor === 'string' && ctor.length ? ",\n" + ctor : "") + "]" + (nl ? "\n" : " ");
                    } else if (typeof ctor === 'string' && ctor.length) {
			ret += idn(indent) + "[" + ctor + "]" + (nl ? "\n" : " ");
		    }
                    return new Handlebars.SafeString(ret);
                });
                Handlebars.registerHelper("param", function (obj, children) {
                    var param = "";
                    if (children) param += " (" + children + ")";
                    return new Handlebars.SafeString(param);
                });
                Handlebars.registerHelper("idn", function (indent) {
                    return new Handlebars.SafeString(idn(indent));
                });
                Handlebars.registerHelper("asWebIDL", function (proc, obj, indent) {
                    return new Handlebars.SafeString(proc.writeAsWebIDL(obj, indent));
                });
                Handlebars.registerHelper("datatype", function (text) {
                    return new Handlebars.SafeString(datatype(text));
                });
                Handlebars.registerHelper("pads", function (num) {
                    return new Handlebars.SafeString(pads(num));
                });
                Handlebars.registerHelper("superclasses", function (obj) {
                    if (!obj.superclasses || !obj.superclasses.length) return "";
                    var str = " : " +
                              obj.superclasses.map(function (it) {
                                                    return "<span class='idlSuperclass'><a>" + it + "</a></span>";
                                                  }).join(", ")
                    ;
                    return new Handlebars.SafeString(str);
                });
            }
        ,   idn = function (lvl) {
                var str = "";
                for (var i = 0; i < lvl; i++) str += "    ";
                return str;
            }
        ,   norm = function (str) {
                return str.replace(/^\s+/, "").replace(/\s+$/, "").split(/\s+/).join(" ");
            }
        ,   sanitiseID = function (id) {
                id = id.split(/[^\-.0-9a-zA-Z_]/).join("-");
                id = id.replace(/^\-+/g, "");
                id = id.replace(/\-+$/, "");
                if (id.length > 0 && /^[^a-z]/.test(id)) id = "x" + id;
                if (id.length === 0) id = "generatedID";
                return id;
            }
        ,   arrsq = function (obj) {
                var str = "";
                for (var i = 0, n = obj.arrayCount; i < n; i++) str += "[]";
                return str;
            }
        ,   datatype = function (text) {
                if ($.isArray(text)) {
                    var arr = [];
                    for (var i = 0, n = text.length; i < n; i++) arr.push(datatype(text[i]));
                    return "(" + arr.join(" or ") + ")";
                }
                else {
                    var matched = /^sequence<(.+)>$/.exec(text);
                    if (matched) return "sequence&lt;<a>" + matched[1] + "</a>&gt;";
                    else return "<a>" + text + "</a>";
                }
            }
        ,   pads = function (num) {
                // XXX
                //  this might be more simply done as
                //  return Array(num + 1).join(" ")
                var str = "";
                for (var i = 0; i < num; i++) str += " ";
                return str;
            }
        ;
        WebIDLProcessor.prototype = {
            setID:  function (obj, match) {
                obj.id = match;
                obj.refId = obj.id.replace(/[^a-zA-Z_\-]/g, "");
		obj.unescapedId = (obj.id[0] == "_" ? obj.id.slice(1) : obj.id);
            }
        ,   nullable:   function (obj, type) {
                obj.nullable = false;
                if (/\?$/.test(type)) {
                    type = type.replace(/\?$/, "");
                    obj.nullable = true;
                }
                return type;
            }
        ,   array:   function (obj, type) {
                obj.array = false;
                if (/\[\]$/.test(type)) {
                    obj.arrayCount = 0;
                    type = type.replace(/(?:\[\])/g, function () {
                        obj.arrayCount++;
                        return "";
                    });
                    obj.array = true;
                }
                return type;
            }
        ,   params: function (prm, $dd, obj) {
                var p = {};
                prm = this.parseExtendedAttributes(prm, p);
                // either up to end of string, or up to ,
                // var re = /^\s*(?:in\s+)?([^,]+)\s+\b([^,\s]+)\s*(?:,)?\s*/;
                var re = /^\s*(?:in\s+)?([^,=]+)\s+\b([^,]+)\s*(?:,)?\s*/;
                var match = re.exec(prm);
                if (match) {
                    prm = prm.replace(re, "");
                    var type = match[1]
                    ,   name = match[2]
                    ,   components = name.split(/\s*=\s*/)
                    ,   deflt = null
                    ;
                    if (components.length === 1) name = name.replace(/\s+/g, "");
                    else {
                        name = components[0];
                        deflt = components[1];
                    }
                    this.parseDatatype(p, type);
                    p.defaultValue = deflt;
                    this.setID(p, name);
                    if ($dd) p.description = $dd.contents();
                    obj.params.push(p);
                }
                else {
                    this.msg.pub("error", "Expected parameter list, got: " + prm);
                    return false;
                }
                return prm;
            }
        ,   optional:   function (p) {
                if (p.isUnionType) {
                    p.optional = false;
                    return false;
                }
                else {
                    var pkw = p.datatype.split(/\s+/)
                    ,   idx = pkw.indexOf("optional")
                    ,   isOptional = false;
                    if (idx > -1) {
                        isOptional = true;
                        pkw.splice(idx, 1);
                        p.datatype = pkw.join(" ");
                    }
                    p.optional = isOptional;
                    return isOptional;
                }
            }


        ,   definition:    function ($idl) {
                var def = { children: [] }
                ,   str = $idl.attr("title")
                ,   id = $idl.attr("id");
                if (!str) this.msg.pub("error", "No IDL definition in element.");
                str = this.parseExtendedAttributes(str, def);
                if (str.indexOf("partial") === 0) { // Could be interface or dictionary
                    var defType = str.slice(8);
                    if  (defType.indexOf("interface") === 0)        this.processInterface(def, str, $idl, { partial : true });
                    else if (defType.indexOf("dictionary") === 0)   this.dictionary(def, defType, $idl, { partial : true });
                    else    this.msg.pub("error", "Expected definition, got: " + str);
                }
                else if      (str.indexOf("interface") === 0 ||
                         /^callback\s+interface\b/.test(str))   this.processInterface(def, str, $idl);
                else if (str.indexOf("exception") === 0)        this.exception(def, str, $idl);
                else if (str.indexOf("dictionary") === 0)       this.dictionary(def, str, $idl);
                else if (str.indexOf("callback") === 0)         this.callback(def, str, $idl);
                else if (str.indexOf("enum") === 0)             this.processEnum(def, str, $idl);
                else if (str.indexOf("typedef") === 0)          this.typedef(def, str, $idl);
                else if (/\bimplements\b/.test(str))            this.processImplements(def, str, $idl);
                else    this.msg.pub("error", "Expected definition, got: " + str);
                this.parent.children.push(def);
                this.processMembers(def, $idl);
                if (id) def.htmlID = id;
                return def;
            },

            processInterface:  function (obj, str, $idl, opt) {
                opt = opt || {};
                obj.type = "interface";
                obj.partial = opt.partial || false;

                var match = /^\s*(?:(partial|callback)\s+)?interface\s+([A-Za-z][A-Za-z0-9]*)(?:\s+:\s*([^{]+)\s*)?/.exec(str);
                if (match) {
                    obj.callback = !!match[1] && match[1] === "callback";
                    this.setID(obj, match[2]);
                    if ($idl.attr('data-merge')) obj.merge = $idl.attr('data-merge').split(' ');
                    if (match[3]) obj.superclasses = match[3].split(/\s*,\s*/);
                }
                else this.msg.pub("error", "Expected interface, got: " + str);
                return obj;
            },

            dictionary:  function (obj, str, $idl, opt) {
                opt = opt || {};
                obj.partial = opt.partial || false;
                return this.excDic("dictionary", obj, str, $idl);
            },

            exception:  function (obj, str, $idl) {
                return this.excDic("exception", obj, str, $idl);
            },

            excDic:  function (type, obj, str) {
                obj.type = type;
                var re = new RegExp("^\\s*" + type + "\\s+([A-Za-z][A-Za-z0-9]*)(?:\\s+:\\s*([^{]+)\\s*)?\\s*")
                ,   match = re.exec(str);
                if (match) {
                    this.setID(obj, match[1]);
                    if (match[2]) obj.superclasses = match[2].split(/\s*,\s*/);
                }
                else this.msg.pub("error", "Expected " + type + ", got: " + str);
                return obj;
            },

            callback:  function (obj, str) {
                obj.type = "callback";
                var match = /^\s*callback\s+([A-Za-z][A-Za-z0-9]*)\s*=\s*\b(.*?)\s*$/.exec(str);
                if (match) {
                    this.setID(obj, match[1]);
                    var type = match[2];
                    this.parseDatatype(obj, type);
                }
                else this.msg.pub("error", "Expected callback, got: " + str);
                return obj;
            },

            processEnum:  function (obj, str) {
                obj.type = "enum";
                var match = /^\s*enum\s+([A-Za-z][A-Za-z0-9]*)\s*$/.exec(str);
                if (match) this.setID(obj, match[1]);
                else this.msg.pub("error", "Expected enum, got: " + str);
                return obj;
            },

            typedef:    function (obj, str, $idl) {
                obj.type = "typedef";
                str = str.replace(/^\s*typedef\s+/, "");
                str = this.parseExtendedAttributes(str, obj);
                var match = /^(.+)\s+(\S+)\s*$/.exec(str);
                if (match) {
                    var type = match[1];
                    this.parseDatatype(obj, type);
                    this.setID(obj, match[2]);
                    obj.description = $idl.contents();
                }
                else this.msg.pub("error", "Expected typedef, got: " + str);
                return obj;
            },

            processImplements: function (obj, str, $idl) {
                obj.type = "implements";
                var match = /^\s*(.+?)\s+implements\s+(.+)\s*$/.exec(str);
                if (match) {
                    this.setID(obj, match[1]);
                    obj.datatype = match[2];
                    obj.description = $idl.contents();
                }
                else this.msg.pub("error", "Expected implements, got: " + str);
                return obj;
            },

            processMembers:    function (obj, $el) {
                var exParent = this.parent
                ,   self = this;
                this.parent = obj;
                $el.find("> dt").each(function () {
                    var $dt = $(this)
                    ,   $dd = $dt.next()
                    ,   t = obj.type
                    ,   mem
                    ;
                    if      (t === "exception")     mem = self.exceptionMember($dt, $dd);
                    else if (t === "dictionary")    mem = self.dictionaryMember($dt, $dd);
                    else if (t === "callback")      mem = self.callbackMember($dt, $dd);
                    else if (t === "enum")          mem = self.processEnumMember($dt, $dd);
                    else                            mem = self.interfaceMember($dt, $dd);
                    obj.children.push(mem);
                });
                this.parent = exParent;
            },

            parseConst:    function (obj, str) {
                // CONST
                var match = /^\s*const\s+\b([^=]+\??)\s+([^=\s]+)\s*=\s*(.*)$/.exec(str);
                if (match) {
                    obj.type = "constant";
                    var type = match[1];
                    this.parseDatatype(obj, type);
                    this.setID(obj, match[2]);
                    obj.value = match[3];
                    return true;
                }
                return false;
            },

            exceptionMember:    function ($dt, $dd) {
                var obj = { children: [] }
                ,   str = norm($dt.text());
                obj.description = $dd.contents();
                str = this.parseExtendedAttributes(str, obj);

                // CONST
                if (this.parseConst(obj, str)) return obj;

                // FIELD
                var match = /^\s*(.*?)\s+(\S+)\s*$/.exec(str);
                if (match) {
                    obj.type = "field";
                    var type = match[1];
                    this.parseDatatype(obj, type);
                    this.setID(obj, match[2]);
                    return obj;
                }

                // NOTHING MATCHED
                this.msg.pub("error", "Expected exception member, got: " + str);
            },

            dictionaryMember:    function ($dt, $dd) {
                var obj = { children: [] }
                ,   str = norm($dt.text());
                obj.description = $dd.contents();
                str = this.parseExtendedAttributes(str, obj);

                // MEMBER
                var match = /^\s*([^=]+\??)\s+([^=\s]+)(?:\s*=\s*(.*))?$/.exec(str);
                if (match) {
                    obj.type = "member";
                    var type = match[1];
                    obj.defaultValue = match[3];
                    this.setID(obj, match[2]);
                    this.parseDatatype(obj, type);
                    return obj;
                }

                // NOTHING MATCHED
                this.msg.pub("error", "Expected dictionary member, got: " + str);
            },

            callbackMember:    function ($dt, $dd) {
                var obj = { children: [] }
                ,   str = norm($dt.text());
                obj.description = $dd.contents();
                str = this.parseExtendedAttributes(str, obj);

                // MEMBER
                var match = /^\s*(.*?)\s+([A-Za-z][A-Za-z0-9]*)\s*$/.exec(str);
                if (match) {
                    obj.type = "member";
                    var type = match[1];
                    this.setID(obj, match[2]);
                    obj.defaultValue = match[3];
                    this.parseDatatype(obj, type);
                    this.optional(obj);
                    return obj;
                }

                // NOTHING MATCHED
                this.msg.pub("error", "Expected callback member, got: " + str);
            },

            processEnumMember:    function ($dt, $dd) {
                var obj = { children: [] }
                ,   str = norm($dt.text());
                obj.description = $dd.contents();
                str = this.parseExtendedAttributes(str, obj);

                // MEMBER
                obj.type = "member";
                this.setID(obj, str);
                obj.refId = sanitiseID(obj.id); // override with different ID type
                return obj;
            },

            interfaceMember:    function ($dt, $dd) {
                var obj = { children: [] }
                ,   str = norm($dt.text())
                ,   $extPrm = $dd.find("dl.parameters").first()
                ,   $sgrs = $dd.find(".getraises, .setraises")
                ,   $excepts = $dd.find("dl.exception").first()
                ;
                obj.description = $dd.contents().not("dl.parameters");
                str = this.parseExtendedAttributes(str, obj);
                var match;

                // ATTRIBUTE
                match = /^\s*(?:(readonly|inherit|stringifier)\s+)?attribute\s+(.*?)\s+(\S+)\s*$/.exec(str);
                if (match) {
                    obj.type = "attribute";
                    obj.declaration = match[1] ? match[1] : "";
                    obj.declaration += (new Array(12-obj.declaration.length)).join(" "); // fill string with spaces
                    var type = match[2];
                    this.parseDatatype(obj, type);
                    this.setID(obj, match[3]);
                    obj.raises = [];
                    $sgrs.each(function () {
                        var $el = $(this)
                        ,   exc = {
                                id:     $el.attr("title")
                            ,   onSet:  $el.hasClass("setraises")
                            ,   onGet:  $el.hasClass("getraises")
                        };
                        if ($el.is("dl")) {
                            exc.type = "codelist";
                            exc.description = [];
                            $el.find("dt").each(function () {
                                var $dt = $(this)
                                ,   $dd = $dt.next("dd");
                                exc.description.push({ id: $dt.text(), description: $dd.contents().clone() });
                            });
                        }
                        else if ($el.is("div")) {
                            exc.type = "simple";
                            exc.description = $el.contents().clone();
                        }
                        else {
                            this.msg.pub("error", "Do not know what to do with exceptions being raised defined outside of a div or dl.");
                        }
                        $el.remove();
                        obj.raises.push(exc);
                    });

                    return obj;
                }

                // CONST
                if (this.parseConst(obj, str)) return obj;

                // CONSTRUCTOR
                match = /^\s*Constructor(?:\s*\(\s*(.*)\s*\))?\s*$/.exec(str);
                if (match) {
                    obj.type = "constructor";
                    var prm = match[1] ? match[1] : [];
                    this.setID(obj, this.parent.id);
                    obj.named = false;
                    obj.datatype = "";

                    return this.methodMember(obj, $excepts, $extPrm, prm);
                }

                // NAMED CONSTRUCTOR
                match = /^\s*NamedConstructor\s*(?:=\s*)?\b([^(]+)(?:\s*\(\s*(.*)\s*\))?\s*$/.exec(str);
                if (match) {
                    obj.type = "constructor";
                    var prm = match[2] ? match[2] : [];
                    this.setID(obj, match[1]);
                    obj.named = true;
                    obj.datatype = "";

                    return this.methodMember(obj, $excepts, $extPrm, prm);
                }

                // METHOD
                match = /^\s*(.*?)\s+\b(\S+?)\s*\(\s*(.*)\s*\)\s*$/.exec(str);
                if (match) {
                    obj.type = "method";
                    var type = match[1]
                    ,   prm = match[3];
                    // XXX we need to do better for parsing modifiers
                    type = this.parseStatic(obj, type);
                    this.parseDatatype(obj, type);
                    this.setID(obj, match[2]);

                    return this.methodMember(obj, $excepts, $extPrm, prm);
                }

                // SERIALIZER
                match = /^\s*serializer(\s*=\s*((\{\s*(\S+(\s*,\s*\S+)*)?\s*\})|(\[(\s*\S+(\s*,\s*\S+)*)?\s*\])|(\S+)))?\s*$/.exec(str);
                if (match) {
                    obj.type = "serializer";
                    obj.values = [];
                    this.setID(obj, "serializer");
                    var serializermap = match[3],
                    serializerlist = match[6],
                    serializerattribute = match[9], rawvalues;
                    if (serializermap) {
                        obj.serializertype = "map";
                        rawvalues = match[4];
                    }
                    else if (serializerlist) {
                        obj.serializertype = "list";
                        rawvalues = match[7];
                    }
                    else if (serializerattribute) {
                        obj.serializertype = "attribute";
                        obj.values.push(serializerattribute);
                    }
                    else {
                        obj.serializertype = "prose";
                    }
                    if (rawvalues) {
                        // split at comma and remove white space
                        var values = rawvalues.split(/\s*,\s*/);
                        obj.getter = false;
                        obj.inherit = false;
                        obj.all = false;
                        if (values[0] == "getter") {
                            obj.getter = true;
                        }
                        else {
                            if (obj.serializertype == "map") {
                                if (values[0] == "inherit") {
                                    obj.inherit = true;
                                    values.shift();
                                }
                                if (values[0] == "attribute" && obj.serializertype == "map" ) {
                                    obj.all = true;
                                    values = [];
                                }
                            }
                            obj.values = values;
                        }
                    }
                    return obj;
                }

                // COMMENT
                match = /^\s*\/\/\s*(.*)\s*$/.exec(str);
                if (match) {
                    obj.type = "comment";
                    obj.id = match[1];
                    return obj;
                }

                // NOTHING MATCHED
                this.msg.pub("error", "Expected interface member, got: " + str);
            },

            methodMember:   function (obj, $excepts, $extPrm, prm) {
                obj.params = [];
                obj.raises = [];

                $excepts.each(function () {
                    var $el = $(this)
                    ,   exc = { id: $el.attr("title") };
                    if ($el.is("dl")) {
                        exc.type = "codelist";
                        exc.description = [];
                        $el.find("dt").each(function () {
                            var $dt = $(this)
                            ,   $dd = $dt.next("dd");
                            exc.description.push({ id: $dt.text(), description: $dd.contents().clone() });
                        });
                    }
                    else if ($el.is("div")) {
                        exc.type = "simple";
                        exc.description = $el.contents().clone();
                    }
                    else {
                        this.msg.pub("error", "Do not know what to do with exceptions being raised defined outside of a div or dl.");
                    }
                    $el.remove();
                    obj.raises.push(exc);
                });


                if ($extPrm.length) {
                    $extPrm.remove();
                    var self = this;
                    $extPrm.find("> dt").each(function () {
                        return self.params($(this).text(), $(this).next(), obj);
                    });
                }
                else {
                    while (prm.length) {
                        prm = this.params(prm, null, obj);
                        if (prm === false) break;
                    }
                }

                // apply optional
                var seenOptional = false;
                for (var i = 0; i < obj.params.length; i++) {
                    if (seenOptional) {
                        obj.params[i].optional = true;
                        obj.params[i].datatype = obj.params[i].datatype.replace(/\boptional\s+/, "");
                    }
                    else {
                        seenOptional = this.optional(obj.params[i]);
                    }
                }
                return obj;
            },

            parseDatatype:  function (obj, type) {
                type = this.nullable(obj, type);
                type = this.array(obj, type);
                obj.variadic = false;
                if (/\.\.\./.test(type)) {
                    type = type.replace(/\.\.\./, "");
                    obj.variadic = true;
                }
                if (type.indexOf("(") === 0) {
                    type = type.replace("(", "").replace(")", "");
                    obj.datatype = type.split(/\s+or\s+/);
                    obj.isUnionType = true;
                }
                else {
                    obj.datatype = type;
                }
            },

            parseStatic:  function (obj, type) {
                if (/^static\s+/.test(type)) {
                    type = type.replace(/^static\s+/, "");
                    obj.isStatic = true;
                }
                else {
                    obj.isStatic = false;
                }
                return type;
            },

            parseExtendedAttributes:    function (str, obj) {
                if (!str) return;
                return str.replace(/^\s*\[([^\]]+)\]\s*/, function (x, m1) { obj.extendedAttributes = m1; return ""; });
            },

            makeMarkup:    function (id) {
                var $df = $("<div></div>");
                var attr = { "class": "idl" };
                if (id) attr.id = id;
                var $pre = $("<pre></pre>").attr(attr);
                $pre.html(this.writeAsWebIDL(this.parent, -1));
                $df.append($pre);
                if (!this.conf.noLegacyStyle) $df.append(this.writeAsHTML(this.parent));
                this.mergeWebIDL(this.parent.children[0]);
                return $df.children();
            },

            writeAsHTML:    function (obj) {
                if (obj.type == "module") {
                    if (obj.id == "outermost") {
                        if (obj.children.length > 1) this.msg.pub("error", "We currently only support one structural level per IDL fragment");
                        return this.writeAsHTML(obj.children[0]);
                    }
                    else {
                        this.msg.pub("warn", "No HTML can be generated for module definitions.");
                        return $("<span></span>");
                    }
                }
                else if (obj.type == "typedef") {
                    var cnt;
                    if (obj.description && obj.description.text()) cnt = [obj.description];
                    else {
                        // yuck -- should use a single model...
                        var tdt = sn.element("span", { "class": "idlTypedefType" }, null);
                        tdt.innerHTML = datatype(obj.datatype);
                        cnt = [ sn.text("Throughout this specification, the identifier "),
                                sn.element("span", { "class": "idlTypedefID" }, null, obj.unescapedId),
                                sn.text(" is used to refer to the "),
                                sn.text(obj.array ? (obj.arrayCount > 1 ? obj.arrayCount + "-" : "") + "array of " : ""),
                                tdt,
                                sn.text(obj.nullable ? " (nullable)" : ""),
                                sn.text(" type.")];
                    }
                    return sn.element("div", { "class": "idlTypedefDesc" }, null, cnt);
                }
                else if (obj.type == "implements") {
                    var cnt;
                    if (obj.description && obj.description.text()) cnt = [obj.description];
                    else {
                        cnt = [ sn.text("All instances of the "),
                                sn.element("code", {}, null, [sn.element("a", {}, null, obj.unescapedId)]),
                                sn.text(" type are defined to also implement the "),
                                sn.element("a", {}, null, obj.datatype),
                                sn.text(" interface.")];
                        cnt = [sn.element("p", {}, null, cnt)];
                    }
                    return sn.element("div", { "class": "idlImplementsDesc" }, null, cnt);
                }

                else if (obj.type == "exception") {
                    var df = sn.documentFragment();
                    var curLnk = "widl-" + obj.refId + "-";
                    var types = ["field", "constant"];
                    var filterFunc = function (it) { return it.type === type; }
                    ,   sortFunc = function (a, b) {
                            if (a.unescapedId < b.unescapedId) return -1;
                            if (a.unescapedId > b.unescapedId) return 1;
                            return 0;
                    }
                    ;
                    for (var i = 0; i < types.length; i++) {
                        var type = types[i];
                        var things = obj.children.filter(filterFunc);
                        if (things.length === 0) continue;
                        if (!this.noIDLSorting) {
                            things.sort(sortFunc);
                        }

                        var sec = sn.element("section", {}, df);
                        var secTitle = type;
                        secTitle = secTitle.substr(0, 1).toUpperCase() + secTitle.substr(1) + "s";
                        if (!this.conf.noIDLSectionTitle) sn.element("h2", {}, sec, secTitle);
                        var dl = sn.element("dl", { "class": type + "s" }, sec);
                        for (var j = 0; j < things.length; j++) {
                            var it = things[j];
                            var dt = sn.element("dt", { id: curLnk + it.refId }, dl);
                            sn.element("code", {}, dt, it.unescapedId);
                            var desc = sn.element("dd", {}, dl, [it.description]);
                            if (type == "field") {
                                sn.text(" of type ", dt);
                                if (it.array) {
                                    for (var k = 0, n = it.arrayCount; k < n; k++) sn.text("array of ", dt);
                                }
                                var span = sn.element("span", { "class": "idlFieldType" }, dt);
                                var matched = /^sequence<(.+)>$/.exec(it.datatype);
                                if (matched) {
                                    sn.text("sequence<", span);
                                    sn.element("a", {}, span, matched[1]);
                                    sn.text(">", span);
                                }
                                else {
                                    sn.element("a", {}, span, it.datatype);
                                }
                                if (it.nullable) sn.text(", nullable", dt);
                            }
                            else if (type == "constant") {
                                sn.text(" of type ", dt);
                                sn.element("span", { "class": "idlConstType" }, dt, [sn.element("a", {}, null, it.datatype)]);
                                if (it.nullable) sn.text(", nullable", dt);
                            }
                        }
                    }
                    return df;
                }

                else if (obj.type == "dictionary") {
                    var df = sn.documentFragment();
                    var curLnk = "widl-" + obj.refId + "-";
                    var things = obj.children;
                    var cnt;
                    if (things.length === 0) return df;
                    if (!this.noIDLSorting) {
                        things.sort(function (a, b) {
                            if (a.id < b.id) return -1;
                            if (a.id > b.id) return 1;
                              return 0;
                        });
                    }

                    var sec = sn.element("section", {}, df);
                    cnt = [sn.text("Dictionary "),
                           sn.element("a", { "class": "idlType" }, null, obj.unescapedId),
                           sn.text(" Members")];
                    if (!this.conf.noIDLSectionTitle) sn.element("h2", {}, sec, cnt);
                    var dl = sn.element("dl", { "class": "dictionary-members" }, sec);
                    for (var j = 0; j < things.length; j++) {
                        var it = things[j];
                        var dt = sn.element("dt", { id: curLnk + it.refId }, dl);
                        sn.element("code", {}, dt, it.unescapedId);
                        var desc = sn.element("dd", {}, dl, [it.description]);
                        sn.text(" of type ", dt);
                        if (it.array) {
                            for (var i = 0, n = it.arrayCount; i < n; i++) sn.text("array of ", dt);
                        }
                        var span = sn.element("span", { "class": "idlMemberType" }, dt);
                        var matched = /^sequence<(.+)>$/.exec(it.datatype);
                        if (matched) {
                            sn.text("sequence<", span);
                            sn.element("a", {}, span, matched[1]);
                            sn.text(">", span);
                        }
                        else {
                            sn.element("a", {}, span, it.isUnionType ? "(" + it.datatype.join(" or ") + ")" : it.datatype);
                        }
                        if (it.nullable) sn.text(", nullable", dt);
                        if (it.defaultValue) {
                            sn.text(", defaulting to ", dt);
                            sn.element("code", {}, dt, [sn.text(it.defaultValue)]);
                        }
                    }
                    return df;
                }

                else if (obj.type == "callback") {
                    var df = sn.documentFragment();
                    var curLnk = "widl-" + obj.refId + "-";
                    var things = obj.children;
                    var cnt;
                    if (things.length === 0) return df;

                    var sec = sn.element("section", {}, df);
                    cnt = [sn.text("Callback "),
                           sn.element("a", { "class": "idlType" }, null, obj.unescapedId),
                           sn.text(" Parameters")];
                    if (!this.conf.noIDLSectionTitle) sn.element("h2", {}, sec, cnt);
                    var dl = sn.element("dl", { "class": "callback-members" }, sec);
                    for (var j = 0; j < things.length; j++) {
                        var it = things[j];
                        var dt = sn.element("dt", { id: curLnk + it.refId }, dl);
                        sn.element("code", {}, dt, it.unescapedId);
                        var desc = sn.element("dd", {}, dl, [it.description]);
                        sn.text(" of type ", dt);
                        if (it.array) {
                            for (var i = 0, n = it.arrayCount; i < n; i++) sn.text("array of ", dt);
                        }
                        var span = sn.element("span", { "class": "idlMemberType" }, dt);
                        var matched = /^sequence<(.+)>$/.exec(it.datatype);
                        if (matched) {
                            sn.text("sequence<", span);
                            sn.element("a", {}, span, matched[1]);
                            sn.text(">", span);
                        }
                        else {
                            sn.element("a", {}, span, it.isUnionType ? "(" + it.datatype.join(" or ") + ")" : it.datatype);
                        }
                        if (it.nullable) sn.text(", nullable", dt);
                        if (it.defaultValue) {
                            sn.text(", defaulting to ", dt);
                            sn.element("code", {}, dt, [sn.text(it.defaultValue)]);
                        }
                    }
                    return df;
                }

                else if (obj.type == "enum") {
                    var df = sn.documentFragment();
                    var things = obj.children;
                    if (things.length === 0) return df;

                    var sec = sn.element("table", { "class": "simple" }, df);
                    sn.element("tr", {}, sec, [sn.element("th", { colspan: 2 }, null, [sn.text("Enumeration description")])]);
                    for (var j = 0; j < things.length; j++) {
                        var it = things[j];
                        var tr = sn.element("tr", {}, sec)
                        ,   td1 = sn.element("td", {}, tr)
                        ;
                        sn.element("code", { "id": "idl-def-" + obj.refId + "." + it.refId }, td1, it.unescapedId);
                        sn.element("td", {}, tr, [it.description]);
                    }
                    return df;
                }

                else if (obj.type == "interface") {
                    var df = sn.documentFragment();
                    var curLnk = "widl-" + obj.refId + "-";
                    var types = ["constructor", "attribute", "method", "constant", "serializer"];
                    var filterFunc = function (it) { return it.type == type; }
                    ,   sortFunc = function (a, b) {
                            if (a.unescapedId < b.unescapedId) return -1;
                            if (a.unescapedId > b.unescapedId) return 1;
                            return 0;
                        }
                    ;
                    for (var i = 0; i < types.length; i++) {
                        var type = types[i];
                        var things = obj.children.filter(filterFunc);
                        if (things.length === 0) continue;
                        if (!this.noIDLSorting) things.sort(sortFunc);

                        var sec = sn.element("section", {}, df);
                        var secTitle = type;
                        secTitle = secTitle.substr(0, 1).toUpperCase() + secTitle.substr(1) + (type != "serializer" ? "s" : "");
                        if (!this.conf.noIDLSectionTitle) sn.element("h2", {}, sec, secTitle);
                        if (type != "serializer") {
                            var dl = sn.element("dl", { "class": type + "s" }, sec);
                            for (var j = 0; j < things.length; j++) {
                                var it = things[j];
                                var id = (type == "method") ? this.makeMethodID(curLnk, it) :
                                    (type == "constructor") ? this.makeMethodID("widl-ctor-", it)
                                    : sn.idThatDoesNotExist(curLnk + it.refId);
                                var dt = sn.element("dt", { id: id }, dl);
                                sn.element("code", {}, dt, it.unescapedId);
                                if (it.isStatic) dt.appendChild(this.doc.createTextNode(", static"));
                                var desc = sn.element("dd", {}, dl, [it.description]);
                                if (type == "method" || type == "constructor") {
                                    if (it.params.length) {
                                        var table = sn.element("table", { "class": "parameters" }, desc);
                                        var tr = sn.element("tr", {}, table);
                                        ["Parameter", "Type", "Nullable", "Optional", "Description"].forEach(function (tit) { sn.element("th", {}, tr, tit); });
                                        for (var k = 0; k < it.params.length; k++) {
                                            var prm = it.params[k];
                                            var tr = sn.element("tr", {}, table);
                                            sn.element("td", { "class": "prmName" }, tr, prm.id);
                                            var tyTD = sn.element("td", { "class": "prmType" }, tr);
                                            var code = sn.element("code", {}, tyTD);
                                            code.innerHTML = datatype(prm.datatype);
                                            if (prm.array) code.innerHTML += arrsq(prm);
                                            if (prm.defaultValue) {
                                                code.innerHTML += " = " + prm.defaultValue;
                                            }
                                            if (prm.nullable) sn.element("td", { "class": "prmNullTrue" }, tr, $("<span role='img' aria-label='True'>\u2714</span>"));
                                            else              sn.element("td", { "class": "prmNullFalse" }, tr, $("<span role='img' aria-label='False'>\u2718</span>"));
                                            if (prm.optional) sn.element("td", { "class": "prmOptTrue" }, tr,  $("<span role='img' aria-label='True'>\u2714</span>"));
                                            else              sn.element("td", { "class": "prmOptFalse" }, tr, $("<span role='img' aria-label='False'>\u2718</span>"));
                                            var cnt = prm.description ? [prm.description] : "";
                                            sn.element("td", { "class": "prmDesc" }, tr, cnt);
                                        }
                                    }
                                    else {
                                        sn.element("div", {}, desc, [sn.element("em", {}, null, "No parameters.")]);
                                    }
                                    if (this.conf.idlOldStyleExceptions && it.raises.length) {
                                        var table = sn.element("table", { "class": "exceptions" }, desc);
                                        var tr = sn.element("tr", {}, table);
                                        ["Exception", "Description"].forEach(function (tit) { sn.element("th", {}, tr, tit); });
                                        for (var k = 0; k < it.raises.length; k++) {
                                            var exc = it.raises[k];
                                            var tr = sn.element("tr", {}, table);
                                            sn.element("td", { "class": "excName" }, tr, [sn.element("a", {}, null, exc.id)]);
                                            var dtd = sn.element("td", { "class": "excDesc" }, tr);
                                            if (exc.type == "simple") {
                                                $(dtd).append(exc.description);
                                            }
                                            else {
                                                var ctab = sn.element("table", { "class": "exceptionCodes" }, dtd );
                                                for (var m = 0; m < exc.description.length; m++) {
                                                    var cd = exc.description[m];
                                                    var tr = sn.element("tr", {}, ctab);
                                                    sn.element("td", { "class": "excCodeName" }, tr, [sn.element("code", {}, null, cd.id)]);
                                                    sn.element("td", { "class": "excCodeDesc" }, tr, [cd.description]);
                                                }
                                            }
                                        }
                                    }
                                    // else {
                                    //     sn.element("div", {}, desc, [sn.element("em", {}, null, "No exceptions.")]);
                                    // }

                                    if (type !== "constructor") {
                                        var reDiv = sn.element("div", {}, desc);
                                        sn.element("em", {}, reDiv, "Return type: ");
                                        var code = sn.element("code", {}, reDiv);
                                        code.innerHTML = datatype(it.datatype);
                                        if (it.array) code.innerHTML += arrsq(it);
                                        if (it.nullable) sn.text(", nullable", reDiv);
                                    }
                                }
                                else if (type == "attribute") {
                                    sn.text(" of type ", dt);
                                    if (it.array) {
                                        for (var m = 0, n = it.arrayCount; m < n; m++) sn.text("array of ", dt);
                                    }
                                    var span = sn.element("span", { "class": "idlAttrType" }, dt);
                                    var matched = /^sequence<(.+)>$/.exec(it.datatype);
                                    if (matched) {
                                        sn.text("sequence<", span);
                                        sn.element("a", {}, span, matched[1]);
                                        sn.text(">", span);
                                    }
                                    else {
                                        sn.element("a", {}, span, it.isUnionType ? "(" + it.datatype.join(" or ") + ")" : it.datatype);
                                    }
                                    if (it.declaration) sn.text(", " + it.declaration, dt);
                                    if (it.nullable) sn.text(", nullable", dt);

                                    if (this.conf.idlOldStyleExceptions && it.raises.length) {
                                        var table = sn.element("table", { "class": "exceptions" }, desc);
                                        var tr = sn.element("tr", {}, table);
                                        ["Exception", "On Get", "On Set", "Description"].forEach(function (tit) { sn.element("th", {}, tr, tit); });
                                        for (var k = 0; k < it.raises.length; k++) {
                                            var exc = it.raises[k];
                                            var tr = sn.element("tr", {}, table);
                                            sn.element("td", { "class": "excName" }, tr, [sn.element("a", {}, null, exc.id)]);
                                            ["onGet", "onSet"].forEach(function (gs) {
                                                if (exc[gs]) sn.element("td", { "class": "excGetSetTrue" }, tr, $("<span role='img' aria-label='True'>\u2714</span>"));
                                                else         sn.element("td", { "class": "excGetSetFalse" }, tr, $("<span role='img' aria-label='False'>\u2718</span>"));
                                            });
                                            var dtd = sn.element("td", { "class": "excDesc" }, tr);
                                            if (exc.type == "simple") {
                                                dtd.appendChild(exc.description);
                                            }
                                            else {
                                                var ctab = sn.element("table", { "class": "exceptionCodes" }, dtd );
                                                for (var m = 0; m < exc.description.length; m++) {
                                                    var cd = exc.description[m];
                                                    var tr = sn.element("tr", {}, ctab);
                                                    sn.element("td", { "class": "excCodeName" }, tr, [sn.element("code", {}, null, cd.id)]);
                                                    sn.element("td", { "class": "excCodeDesc" }, tr, [cd.description]);
                                                }
                                            }
                                        }
                                    }
                                    // else {
                                    //     sn.element("div", {}, desc, [sn.element("em", {}, null, "No exceptions.")]);
                                    // }
                                }
                                else if (type == "constant") {
                                    sn.text(" of type ", dt);
                                    sn.element("span", { "class": "idlConstType" }, dt, [sn.element("a", {}, null, it.datatype)]);
                                    if (it.nullable) sn.text(", nullable", dt);
                                }
                            }
                        }
                        // Serializer
                        else {
                            var div = sn.element("div", {}, sec);
                            var it = things[0];
                            if (it.serializertype != "prose") {
                                var generatedDescription = "Instances of this interface are serialized as ";
                                if (it.serializertype == "map") {
                                    var mapDescription = "a map ";
                                    if (it.getter) {
                                        mapDescription += "with entries corresponding to the named properties";
                                    }
                                    else {
                                        var and = "";
                                        if (it.inherit) {
                                            mapDescription += "with entries from the closest inherited interface ";
                                            and = "and ";
                                        }
                                        if (it.all) {
                                            mapDescription += and + "with entries for each of the serializable attributes";
                                        }
                                        else if (it.values && it.values.length) {
                                            mapDescription += and + "with entries for the following attributes: " + it.values.join(", ");
                                        }
                                        else {
                                            mapDescription = "an empty map";
                                        }
                                    }
                                    generatedDescription += mapDescription;
                                }
                                else if (it.serializertype == "list") {
                                    var listDescription = "a list ";
                                    if (it.getter) {
                                        listDescription += "with values corresponding to the indexed properties";
                                    }
                                    else {
                                        if (it.values && it.values.length) {
                                            listDescription += "with the values of the following attributes: " + it.values.join(", ");
                                        }
                                        else {
                                            listDescription = "an empty list";
                                        }
                                    }
                                    generatedDescription += listDescription;
                                }
                                else if (it.serializertype == "attribute") {
                                    generatedDescription += "the value of the attribute " + it.values[0];
                                }
                                generatedDescription += ".";
                                sn.element("p", {}, div, generatedDescription);
                            }
                            sn.element("p", {}, div, [it.description]);
                        }
                    }
                    return df;
                }
            },

            makeMethodID:    function (cur, obj) {
                var id = cur + obj.refId + "-" + obj.datatype + "-"
                ,   params = [];
                for (var i = 0, n = obj.params.length; i < n; i++) {
                    var prm = obj.params[i];
                    params.push(prm.datatype + (prm.array ? "Array" : "") + "-" + prm.id);
                }
                id += params.join("-");
                return sanitiseID(id);
            },

            mergeWebIDL:    function (obj) {
                if (typeof obj.merge === "undefined" || obj.merge.length === 0) return;
                // queue for later execution
                setTimeout(function () {
                    for (var i = 0; i < obj.merge.length; i++) {
                        var idlInterface = document.querySelector("#idl-def-" + obj.refId)
                        ,   idlInterfaceToMerge = document.querySelector("#idl-def-" + obj.merge[i]);
                        idlInterface.insertBefore(document.createElement("br"), idlInterface.firstChild);
                        idlInterface.insertBefore(document.createElement("br"), idlInterface.firstChild);
                        idlInterfaceToMerge.parentNode.parentNode.removeChild(idlInterfaceToMerge.parentNode);
                        idlInterface.insertBefore(idlInterfaceToMerge, idlInterface.firstChild);
                    }
                }, 0);
            },

            writeAsWebIDL:    function (obj, indent) {
                indent++;
                var opt = { indent: indent, obj: obj, proc: this };
                if (obj.type === "module") {
                    if (obj.id == "outermost") {
                        var $div = $("<div></div>");
                        for (var i = 0; i < obj.children.length; i++) $div.append(this.writeAsWebIDL(obj.children[i], indent - 1));
                        return $div.children();
                    }
                    else return $(idlModuleTmpl(opt));
                }

                else if (obj.type === "typedef") {
                    opt.nullable = obj.nullable ? "?" : "";
                    opt.arr = arrsq(obj);
                    return $(idlTypedefTmpl(opt));
                }

                else if (obj.type === "implements") {
                    return $(idlImplementsTmpl(opt));
                }

                else if (obj.type === "interface") {
                    // stop gap fix for duplicate IDs while we're transitioning the code
                    var div = this.doc.createElement("div")
                    ,   id = $(div).makeID("idl-def", obj.refId, true)
                    ,   maxAttr = 0, maxMeth = 0, maxConst = 0, hasRO = false;
                    obj.children.forEach(function (it) {
                        var len = 0;
                        if (it.isUnionType)   len = it.datatype.join(" or ").length + 2;
                        else if (it.datatype) len = it.datatype.length;
                        if (it.isStatic) len += 7;
                        if (it.nullable) len = len + 1;
                        if (it.array) len = len + (2 * it.arrayCount);
                        if (it.type == "attribute") maxAttr = (len > maxAttr) ? len : maxAttr;
                        else if (it.type == "method") maxMeth = (len > maxMeth) ? len : maxMeth;
                        else if (it.type == "constant") maxConst = (len > maxConst) ? len : maxConst;
                        if (it.type == "attribute" && it.declaration) hasRO = true;
                    });
                    var curLnk = "widl-" + obj.refId + "-"
                    ,   self = this
                    ,   ctor = []
                    ,   children = obj.children
                                      .map(function (ch) {
                                          if (ch.type == "attribute") return self.writeAttribute(ch, maxAttr, indent + 1, curLnk, hasRO);
                                          else if (ch.type == "method") return self.writeMethod(ch, maxMeth, indent + 1, curLnk);
                                          else if (ch.type == "constant") return self.writeConst(ch, maxConst, indent + 1, curLnk);
                                          else if (ch.type == "serializer") return self.writeSerializer(ch, indent + 1, curLnk);
                                          else if (ch.type == "constructor") ctor.push(self.writeConstructor(ch, indent, "widl-ctor-"));
                                          else if (ch.type == "comment") return self.writeComment(ch, indent + 1);
                                      })
                                      .join("")
                    ;
                    return idlInterfaceTmpl({
                        obj:        obj
                    ,   indent:     indent
                    ,   id:         id
                    ,   ctor:       ctor.join(",\n")
                    ,   partial:    obj.partial ? "partial " : ""
                    ,   callback:   obj.callback ? "callback " : ""
                    ,   children:   children
                    });
                }

                else if (obj.type === "exception") {
                    var maxAttr = 0, maxConst = 0;
                    obj.children.forEach(function (it) {
                        var len = it.datatype.length;
                        if (it.nullable) len = len + 1;
                        if (it.array) len = len + (2 * it.arrayCount);
                        if (it.type === "field")   maxAttr = (len > maxAttr) ? len : maxAttr;
                        else if (it.type === "constant") maxConst = (len > maxConst) ? len : maxConst;
                    });
                    var curLnk = "widl-" + obj.refId + "-"
                    ,   self = this
                    ,   children = obj.children
                                      .map(function (ch) {
                                          if (ch.type === "field") return self.writeField(ch, maxAttr, indent + 1, curLnk);
                                          else if (ch.type === "constant") return self.writeConst(ch, maxConst, indent + 1, curLnk);
                                      })
                                      .join("")
                    ;
                    return idlExceptionTmpl({ obj: obj, indent: indent, children: children });
                }

                else if (obj.type === "dictionary") {
                    var max = 0;
                    obj.children.forEach(function (it) {
                        var len = 0;
                        if (it.isUnionType)   len = it.datatype.join(" or ").length + 2;
                        else if (it.datatype) len = it.datatype.length;
                        if (it.nullable) len = len + 1;
                        if (it.array) len = len + (2 * it.arrayCount);
                        max = (len > max) ? len : max;
                    });
                    var curLnk = "widl-" + obj.refId + "-"
                    ,   self = this
                    ,   children = obj.children
                                      .map(function (it) {
                                          return self.writeMember(it, max, indent + 1, curLnk);
                                      })
                                      .join("")
                    ;
                    return idlDictionaryTmpl({ obj: obj, indent: indent, children: children, partial: obj.partial ? "partial " : "" });
                }

                else if (obj.type === "callback") {
                    var params = obj.children
                                    .map(function (it) {
                                        return idlParamTmpl({
                                            obj:        it
                                        ,   optional:   it.optional ? "optional " : ""
                                        ,   arr:        arrsq(it)
                                        ,   nullable:   it.nullable ? "?" : ""
                                        ,   variadic:   it.variadic ? "..." : ""
                                        });
                                    })
                                    .join(", ");
                    return idlCallbackTmpl({
                        obj:        obj
                    ,   indent:     indent
                    ,   arr:        arrsq(obj)
                    ,   nullable:   obj.nullable ? "?" : ""
                    ,   children:   params
                    });
                }

                else if (obj.type === "enum") {
                    var children = obj.children
                                      .map(function (it) { return idlEnumItemTmpl({ obj: it, parentID: obj.refId, indent: indent + 1 }); })
                                      .join(",\n");
                    return idlEnumTmpl({obj: obj, indent: indent, children: children });
                }
            },

            writeField:    function (attr, max, indent, curLnk) {
                var pad = max - attr.datatype.length;
                if (attr.nullable) pad = pad - 1;
                if (attr.array) pad = pad - (2 * attr.arrayCount);
                return idlFieldTmpl({
                    obj:        attr
                ,   indent:     indent
                ,   arr:        arrsq(attr)
                ,   nullable:   attr.nullable ? "?" : ""
                ,   pad:        pad
                ,   href:       curLnk + attr.refId
                });
            },

            writeAttribute:    function (attr, max, indent, curLnk) {
                var len = 0;
                if (attr.isUnionType)   len = attr.datatype.join(" or ").length + 2;
                else if (attr.datatype) len = attr.datatype.length;
                var pad = max - len;
                if (attr.nullable) pad = pad - 1;
                if (attr.array) pad = pad - (2 * attr.arrayCount);
                return idlAttributeTmpl({
                    obj:            attr
                ,   indent:         indent
                ,   declaration:    attr.declaration
                ,   pad:            pad
                ,   arr:            arrsq(attr)
                ,   nullable:       attr.nullable ? "?" : ""
                ,   href:           curLnk + attr.refId
                });
            },

            writeMethod:    function (meth, max, indent, curLnk) {
                var params = meth.params
                                .map(function (it) {
                                    return idlParamTmpl({
                                        obj:        it
                                    ,   optional:   it.optional ? "optional " : ""
                                    ,   arr:        arrsq(it)
                                    ,   nullable:   it.nullable ? "?" : ""
                                    ,   variadic:   it.variadic ? "..." : ""
                                    });
                                })
                                .join(", ");
                var len = 0;
                if (meth.isUnionType) len = meth.datatype.join(" or ").length + 2;
                else                  len = meth.datatype.length;
                if (meth.isStatic) len += 7;
                var pad = max - len;
                if (meth.nullable) pad = pad - 1;
                if (meth.array) pad = pad - (2 * meth.arrayCount);
                return idlMethodTmpl({
                    obj:        meth
                ,   indent:     indent
                ,   arr:        arrsq(meth)
                ,   nullable:   meth.nullable ? "?" : ""
                ,   "static":   meth.isStatic ? "static " : ""
                ,   pad:        pad
                ,   id:         this.makeMethodID(curLnk, meth)
                ,   children:   params
                });
            },

            writeConstructor:   function (ctor, indent, curLnk) {
                var params = ctor.params
                                .map(function (it) {
                                    return idlParamTmpl({
                                        obj:        it
                                    ,   optional:   it.optional ? "optional " : ""
                                    ,   arr:        arrsq(it)
                                    ,   nullable:   it.nullable ? "?" : ""
                                    ,   variadic:   it.variadic ? "..." : ""
                                    });
                                })
                                .join(", ");
                return idlConstructorTmpl({
                    obj:        ctor
                ,   indent:     indent
                ,   id:         this.makeMethodID(curLnk, ctor)
                ,   name:       ctor.named ? ctor.id : "Constructor"
                ,   keyword:    ctor.named ? "NamedConstructor=" : ""
                ,   children:   params
                });
            },

            writeConst:    function (cons, max, indent) {
                var pad = max - cons.datatype.length;
                if (cons.nullable) pad--;
                return idlConstTmpl({ obj: cons, indent: indent, pad: pad, nullable: cons.nullable ? "?" : ""});
            },

            writeComment:   function (comment, indent) {
                return idlCommentTmpl({ obj: comment, indent: indent, comment: comment.id});
            },


            writeSerializer: function (serializer, indent) {
                var values = "";
                if (serializer.serializertype == "map") {
                    var mapValues = [];
                    if (serializer.getter) mapValues = ["getter"];
                    else {
                        if (serializer.inherit) mapValues.push("inherit");
                        if (serializer.all) mapValues.push("attribute");
                        else                mapValues = mapValues.concat(serializer.values);
                    }
                    values = "{" + mapValues.join(", ") + "}";
                }
                else if (serializer.serializertype == "list") {
                    var listValues = (serializer.getter ? ["getter"] : serializer.values);
                    values = "[" + listValues.join(", ") + "]";
                }
                else if (serializer.serializertype == "attribute") {
                    values = serializer.values[0];
                }
                return idlSerializerTmpl({
                    obj:        serializer
                ,   indent:     indent
                ,   values:     values
                });
            },

            writeMember:    function (memb, max, indent, curLnk) {
                var opt = { obj: memb, indent: indent, curLnk: curLnk,
                            nullable: (memb.nullable ? "?" : ""), arr: arrsq(memb) };
                if (memb.isUnionType)   opt.pad = max - (memb.datatype.join(" or ").length + 2);
                else if (memb.datatype) opt.pad = max - memb.datatype.length;
                if (memb.nullable) opt.pad = opt.pad - 1;
                if (memb.array) opt.pad = opt.pad - (2 * memb.arrayCount);
                return idlDictMemberTmpl(opt);
            }
        };


        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/webidl");
                if (!conf.noIDLSorting) conf.noIDLSorting = false;
                if (!conf.noIDLSectionTitle) conf.noIDLSectionTitle = false;
                var $idl = $(".idl", doc)
                ,   finish = function () {
                        msg.pub("end", "core/webidl");
                        cb();
                    };
                if (!$idl.length) return finish();
                $(doc).find("head link").first().before($("<style/>").text(css));

                var infNames = [];
                $idl.each(function () {
                    var w = new WebIDLProcessor({ noIDLSorting: conf.noIDLSorting, msg: msg, doc: doc, conf: conf })
                    ,   inf = w.definition($(this))
                    ,   $df = w.makeMarkup(inf.htmlID);
                    $(this).replaceWith($df);
                    if ($.inArray(inf.type, "interface exception dictionary typedef callback enum".split(" ")) !== -1) infNames.push(inf.id);
                });
                doc.normalize();
                $("a:not([href])").each(function () {
                    var $ant = $(this);
                    if ($ant.hasClass("externalDFN")) return;
                    var name = $ant.text();
                    if ($.inArray(name, infNames) !== -1) {
                        $ant.attr("href", "#idl-def-" + name)
                            .addClass("idlType")
                            .html("<code>" + name + "</code>");
                    }
                });
                finish();
            }
        };
    }
);


// Module core/dfn
// Handles the processing and linking of <dfn> and <a> elements.
define(
    'core/dfn',[],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/dfn");
                doc.normalize();
                if (!conf.definitionMap) conf.definitionMap = {};
                $("dfn").each(function () {
                    var title = $(this).dfnTitle();
                    if (conf.definitionMap[title]) msg.pub("error", "Duplicate definition of '" + title + "'");
                    conf.definitionMap[title] = $(this).makeID("dfn", title);
                });
                $("a:not([href])").each(function () {
                    var $ant = $(this);
                    if ($ant.hasClass("externalDFN")) return;
                    var title = $ant.dfnTitle();
                    if (conf.definitionMap[title] && !(conf.definitionMap[title] instanceof Function)) {
                        $ant.attr("href", "#" + conf.definitionMap[title]).addClass("internalDFN");
                    }
                });
                msg.pub("end", "core/dfn");
                cb();
            }
        };
    }
);


// Module core/fix-headers
// Make sure that all h1-h6 headers (that are first direct children of sections) are actually
// numbered at the right depth level. This makes it possible to just use any of them (conventionally
// h2) with the knowledge that the proper depth level will be used

define(
    'core/fix-headers',[],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/fix-headers");
                var $secs = $("section:not(.introductory)", doc)
                                .find("h1:first, h2:first, h3:first, h4:first, h5:first, h6:first");
                $secs.each(function () {
                    var depth = $(this).parents("section").length + 1;
                    if (depth > 6) depth = 6;
                    var h = "h" + depth;
                    if (this.localName.toLowerCase() != h) $(this).renameElement(h);
                });
                msg.pub("end", "core/fix-headers");
                cb();
            }
        };
    }
);


// Module core/structure
//  Handles producing the ToC and numbering sections across the document.

// LIMITATION:
//  At this point we don't support having more than 26 appendices.
// CONFIGURATION:
//  - noTOC: if set to true, no TOC is generated and sections are not numbered
//  - tocIntroductory: if set to true, the introductory material is listed in the TOC
//  - lang: can change the generated text (supported: en, fr)
//  - maxTocLevel: only generate a TOC so many levels deep

define(
    'core/structure',[],
    function () {
        var i18n = {
                    en: { toc: "Table of Contents" },
                    fr: { toc: "Sommaire" }
                }
        ,   secMap = {}
        ,   appendixMode = false
        ,   lastNonAppendix = 0
        ,   alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        ,   makeTOCAtLevel = function ($parent, doc, current, level, conf) {
                var $secs = $parent.children(conf.tocIntroductory ? "section" : "section:not(.introductory)");

                if ($secs.length === 0) return null;
                var $ul = $("<ul class='toc'></ul>");
                for (var i = 0; i < $secs.length; i++) {
                    var $sec = $($secs[i], doc)
                    ,   isIntro = $sec.hasClass("introductory")
                    ;
                    if (!$sec.children().length) continue;
                    var h = $sec.children()[0]
                    ,   ln = h.localName.toLowerCase();
                    if (ln !== "h2" && ln !== "h3" && ln !== "h4" && ln !== "h5" && ln !== "h6") continue;
                    var title = h.textContent
                    ,   $kidsHolder = $("<div></div>").append($(h).contents().clone())
                    ;
                    $kidsHolder.find("a").renameElement("span").attr("class", "formerLink").removeAttr("href");
                    $kidsHolder.find("dfn").renameElement("span").removeAttr("id");
                    var id = $sec.makeID(null, title);
                    
                    if (!isIntro) current[current.length - 1]++;
                    var secnos = current.slice();
                    if ($sec.hasClass("appendix") && current.length === 1 && !appendixMode) {
                        lastNonAppendix = current[0];
                        appendixMode = true;
                    }
                    if (appendixMode) secnos[0] = alphabet.charAt(current[0] - lastNonAppendix);
                    var secno = secnos.join(".")
                    ,   isTopLevel = secnos.length == 1;
                    if (isTopLevel) {
                        secno = secno + ".";
                        // if this is a top level item, insert
                        // an OddPage comment so html2ps will correctly
                        // paginate the output
                        $(h).before(document.createComment('OddPage'));
                    }
                    var $span = $("<span class='secno'></span>").text(secno + " ");
                    if (!isIntro) $(h).prepend($span);
                    secMap[id] = (isIntro ? "" : "<span class='secno'>" + secno + "</span> ") +
                                "<span class='sec-title'>" + title + "</span>";

                    var $a = $("<a/>").attr({ href: "#" + id, 'class' : 'tocxref' })
                                      .append(isIntro ? "" : $span.clone())
                                      .append($kidsHolder.contents());
                    var $item = $("<li class='tocline'/>").append($a);
                    $ul.append($item);
                    if (conf.maxTocLevel && level >= conf.maxTocLevel) continue;
                    current.push(0);
                    var $sub = makeTOCAtLevel($sec, doc, current, level + 1, conf);
                    if ($sub) $item.append($sub);
                    current.pop();
                }
                return $ul;
            }
        ;
        
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/structure");
                if (!conf.tocIntroductory) conf.tocIntroductory = false;
                if (!conf.maxTocLevel) conf.maxTocLevel = 0;
                var $secs = $("section:not(.introductory)", doc)
                                .find("h1:first, h2:first, h3:first, h4:first, h5:first, h6:first")
                ,   finish = function () {
                        msg.pub("end", "core/structure");
                        cb();
                    }
                ;
                if (!$secs.length) return finish();
                $secs.each(function () {
                    var depth = $(this).parents("section").length + 1;
                    if (depth > 6) depth = 6;
                    var h = "h" + depth;
                    if (this.localName.toLowerCase() != h) $(this).renameElement(h);
                });

                // makeTOC
                if (!conf.noTOC) {
                    var $ul = makeTOCAtLevel($("body", doc), doc, [0], 1, conf);
                    if (!$ul) return;
                    var $sec = $("<section id='toc'/>").append("<h2 class='introductory'>" + i18n[conf.lang || "en"].toc + "</h2>")
                                                       .append($ul);
                    var $ref = $("#toc", doc), replace = false;
                    if ($ref.length) replace = true;
                    if (!$ref.length) $ref = $("#sotd", doc);
                    if (!$ref.length) $ref = $("#abstract", doc);
                    replace ? $ref.replaceWith($sec) : $ref.after($sec);
                }

                // Update all anchors with empty content that reference a section ID
                $("a[href^='#']:not(.tocxref)", doc).each(function () {
                    var $a = $(this);
                    if ($a.html() !== "") return;
                    var id = $a.attr("href").slice(1);
                    if (secMap[id]) {
                        $a.addClass('sec-ref');
                        $a.html(($a.hasClass("sectionRef") ? "section " : "") + secMap[id]);
                    }
                });

                finish();
            }
        };
    }
);


// Module w3c/informative
// Mark specific sections as informative, based on CSS

define(
    'w3c/informative',[],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/informative");
                $("section.informative").find("h2:first, h3:first, h4:first, h5:first, h6:first")
                                        .after("<p><em>This section is non-normative.</em></p>");
                msg.pub("end", "core/informative");
                cb();
            }
        };
    }
);


// Module core/id-headers
// All headings are expected to have an ID, unless their immediate container has one.
// This is currently in core though it comes from a W3C rule. It may move in the future.

define(
    'core/id-headers',[],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/id-headers");
                $("h2, h3, h4, h5, h6").each(function () {
                    var $h = $(this);
                    if (!$h.attr("id")) {
                        if ($h.parent("section").attr("id") && $h.prev().length === 0) return;
                        $h.makeID();
                    }
                });
                msg.pub("end", "core/id-headers");
                cb();
            }
        };
    }
);

// Module w3c/aria
// Adds wai-aria landmarks and roles to entire document.
// Introduced by Shane McCarron (shane@aptest.com) from the W3C PFWG

define(
    'w3c/aria',["core/utils"], // load this to be sure that the jQuery extensions are loaded
    function (utils) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "w3c/aria");
                // ensure all headers after sections have
                // headings and aria-level
                var $secs = $("section", doc)
                                .find("h1:first, h2:first, h3:first, h4:first, h5:first, h6:first");
                $secs.each(function(i, item) {
                    var $item = $(item)
                    ,   resourceID = $item.parent('section[id]').attr('id')
                    ,   level = $item.parents("section").length ;

                    $item.attr('aria-level', level);
                    $item.attr('role', 'heading') ;
                    if (!$item.attr("id")) {
                        $item.attr('id', $item.prop('tagName').toLowerCase() + '_' + resourceID) ;
                    }
                });
                // ensure head section is labelled
                $('body', doc).attr('role', 'document') ;
                $('body', doc).attr('id', 'respecDocument') ;
                $('div.head', doc).attr('role', 'contentinfo') ;
                $('div.head', doc).attr('id', 'respecHeader') ;
                if (!conf.noTOC) {
                    // ensure toc is labelled
                    var toc = $('section#toc', doc)
                                  .find("ul:first");
                    toc.attr('role', 'directory') ;
                    if (!toc.attr("id")) {
                        toc.attr('id', 'respecContents') ;
                    }
                }
                // mark issues and notes with heading
                var noteNum = 0, issueNum = 0;
                $(".note-title, .issue-title", doc).each(function (i, item) {
                    var $item = $(item)
                    ,   isIssue = $item.hasClass("issue-title")
                    ,   level = $item.parents("section").length + 1 ;

                    $item.attr('aria-level', level);
                    $item.attr('role', 'heading') ;
                    if (isIssue) {
                        issueNum++;
                        $item.attr('id', 'h_issue_'+issueNum);
                    } else {
                        noteNum++;
                        $item.attr('id', 'h_note_'+noteNum);
                    }
                });
                msg.pub("end", "w3c/aria");
                cb();
            }
        };
    }
);


// Module core/remove-respec
// Removes all ReSpec artefacts right before processing ends

define(
    'core/remove-respec',[],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/remove-respec");
                // it is likely that some asynch operations won't have completed at that moment
                // if they happen to need the artefacts, we could change this to be hooked into
                // the base-runner to run right before end-all
                $(".remove, script[data-requiremodule]", doc).remove();
                msg.pub("end", "core/remove-respec");
                cb();
            }
        };
    }
);


// Module core/location-hash
// Resets window.location.hash to jump to the right point in the document

define(
    'core/location-hash',[],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/location-hash");
                var hash = window.location.hash;

                // Number of pixels that the document has already been
                // scrolled vertically (cross-browser)
                var scrollY = (window.pageYOffset !== undefined)
                    ? window.pageYOffset
                    : (document.documentElement || document.body.parentNode || document.body).scrollTop;

                // Only scroll to the hash if the document hasn't been scrolled yet
                // this ensures that a page refresh maintains the scroll position
                if (hash && !scrollY) {
                    window.location.hash = "";
                    window.location.hash = hash;
                }
                msg.pub("end", "core/location-hash");
                cb();
            }
        };
    }
);

define('profile-w3c-common',[
            "domReady"
        ,   "core/base-runner"
        ,   "core/override-configuration"
        ,   "core/default-root-attr"
        // ,   "core/local-biblio"
        ,   "core/markdown"
        ,   "core/style"
        ,   "w3c/style"
        ,   "w3c/headers"
        ,   "w3c/abstract"
        ,   "w3c/conformance"
        ,   "core/data-transform"
        ,   "core/data-include"
        ,   "core/inlines"
        ,   "core/examples"
        ,   "core/issues-notes"
        ,   "core/requirements"
        ,   "core/highlight"
        ,   "core/best-practices"
        ,   "core/figures"
        ,   "w3c/legacy"
        ,   "core/webidl-oldschool"
        ,   "core/dfn"
        ,   "core/fix-headers"
        ,   "core/structure"
        ,   "w3c/informative"
        ,   "core/id-headers"
        ,   "w3c/aria"
        ,   "core/remove-respec"
        ,   "core/location-hash"
        ],
        function (domReady, runner) {
            var args = Array.prototype.slice.call(arguments)
            ,   hasRun = false;
            domReady(function () {
                hasRun = true;
                runner.runAll(args);
            });
            // the below can trigger a run, assuming a way of starting this paused
            // window.addEventListener("message", function (ev) {
            //     console.log("message", ev.data);
            //     if (hasRun) return;
            //     if (ev.data && ev.data.topic == "run") {
            //         hasRun = true;
            //         runner.runAll(args);
            //     }
            // }, false);
        }
);

/*global berjon*/

// ------------------------------------------------------------------------------------------ //
//  simple-node.js -- simplified elements creations (based on XML::SimpleNode)
//  Robin Berjon, <robin at berjon dot org>
//  v0.01 - 2009-07-29
// ------------------------------------------------------------------------------------------ //


if (typeof(berjon) == "undefined") window.berjon = {};
berjon.simpleNode = function (ns, doc) {
    // XXX need to default the xml prefix
    if (!ns) ns = {};
    if (!doc) doc = document;
    this.ns = ns;
    this.doc = doc;
};
berjon.calls = {};
berjon.simpleNode.prototype = {

    // --- NODE CREATION ---
    element:    function (name, attr, parent, content) {
        if (!attr) attr = {};
        var nmSt = this._nameToQName(name, false);
        var el = this.doc.createElementNS(nmSt.ns, name);
        for (var k in attr) this._setAttr(el, k, attr[k]);
        if (parent) parent.appendChild(el);
        if (content) {
            if (content instanceof jQuery) $(el).append(content);
            else if (content instanceof Array) for (var i = 0; i < content.length; i++) $(el).append(content[i]);
            else this.text(content, el);
        }
        return el;
    },
    
    text:    function (txt, parent) {
        var tn = this.doc.createTextNode(txt);
        if (parent) parent.appendChild(tn);
        return tn;
    },
    
    comment:    function (txt, parent) {
        var cmt = this.doc.createComment(txt);
        if (parent) parent.appendChild(cmt);
        return cmt;
    },
    
    pi:    function (target, data, parent) {
        var pi = this.doc.createProcessingInstruction(target, data);
        if (parent) parent.appendChild(pi);
        return pi;
    },
    
    documentFragment:    function (parent, content) {
        var df = this.doc.createDocumentFragment();
        if (content) {
            if (content instanceof Array) for (var i = 0; i < content.length; i++) df.appendChild(content[i]);
            else this.text(content, df);
        }
        if (parent) parent.appendChild(df);
        return df;
    },
    
    // --- FINDING STUFF ---
    findNodes:    function (xpath, context) {
        if (!context) context = this.doc;
        var ns = this.ns;
        var snap = this.doc.evaluate(xpath,
                                     context,
                                     function (pfx) { return ns[pfx] || null; },
                                     XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                     null);
        var res = [];
        for (var i = 0; i < snap.snapshotLength; i++) res.push(snap.snapshotItem(i));
        return res;
    },
    
    // --- MANIPULATION ---
    copyChildren:   function (from, to) {
        while (from.childNodes.length) to.appendChild(from.firstChild);
    },
    
    copyAttr:   function (from, to) {
        for (var i = 0; i < from.attributes.length; i++) {
            var at = from.attributes[i];
            to.setAttributeNS(at.namespaceURI, at.name, at.value);
        }
    },
    
    renameEl:   function (el, name) {
        // we remove, copy, then insert instead of just replacing because it's a *lot*
        // faster if the copyChildren operation is done while the node is not being displayed
        var folSib = el.nextSibling;
        var par = el.parentNode;
        if (par) par.removeChild(el);
        var newEl = this.element(name);
        this.copyAttr(el, newEl);
        this.copyChildren(el, newEl);
        // if (el.parentNode) el.parentNode.replaceChild(newEl, el);
        if (par) par.insertBefore(newEl, folSib);
        return newEl;
    },
    
    // --- ID MANAGEMENT ---
    makeID: function (el, pfx, txt) {
        if (el.hasAttribute("id")) return el.getAttribute("id");
        var id = "";
        if (!txt) {
            if (el.hasAttribute("title")) txt = el.getAttribute("title");
            else                          txt = el.textContent;
        }
        txt = txt.replace(/^\s+/, "");
        txt = txt.replace(/\s+$/, "");
        id += txt;
        id = id.toLowerCase();
        if (id.length === 0) id = "generatedID";
        id = this.sanitiseID(id);
        if (pfx) id = pfx + "-" + id;
        id = this.idThatDoesNotExist(id);
        el.setAttribute("id", id);
        return id;
    },
    
    sanitiseID:    function (id) {
        id = id.split(/[^\-.0-9a-zA-Z_]/).join("-");
        id = id.replace(/^-+/g, "");
        id = id.replace(/-+$/, "");
        if (id.length > 0 && /^[^a-z]/.test(id)) id = "x" + id;
        if (id.length === 0) id = "generatedID";
        return id;
    },
    
    idCache: {},
    idThatDoesNotExist:    function (id) {
        var inc = 1;
        if (this.doc.getElementById(id) || this.idCache[id]) {
            while (this.doc.getElementById(id + "-" + inc) || this.idCache[id + "-" + inc]) inc++;
            id = id + "-" + inc;
        }
        // XXX disable caching for now
        // this.idCache[id] = true;
        return id;
    },
    
    // --- CLASS HANDLING ---
    hasClass:    function (el, cl) {
        return this.listClasses(el).indexOf(cl) >= 0;
    },
    
    addClass:    function (el, cl) {
        var ls = this.listClasses(el);
        if (ls.indexOf(cl) >= 0) return;
        ls.push(cl);
        this.setClassList(el, ls);
    },
    
    removeClass:    function (el, cl) {
        var ls = this.listClasses(el);
        var idx = ls.indexOf(cl);
        if (idx < 0) return;
        ls.splice(idx, 1);
        this.setClassList(el, ls);
    },
    
    listClasses:    function (el) {
        if (el.hasAttribute("class")) {
            return el.getAttribute("class").split(/\s+/);
        }
        else return [];
    },
    
    setClassList:    function (el, ls) {
        el.setAttribute("class", ls.join(" "));
    },
    
    // --- HELPERS ---
    _nameToQName:    function (name, isAttr) {
        var matches = /^(.+):(.+)$/.exec(name);
        var pfx, ns, ln;
        if (matches) {
            pfx = matches[1];
            ln = matches[2];
            if (!this.ns[pfx]) throw "No namespace declared for prefix '" + pfx + "'";
            ns = this.ns[pfx];
        }
        else {
            if (isAttr) ns = null;
            else        ns = this.ns[""];
            ln = name;
        }
        return { ns: ns, ln: ln };
    },
    
    _setAttr:    function (el, name, value) {
        var nmSt = this._nameToQName(name, true);
        el.setAttributeNS(nmSt.ns, nmSt.ln, value);
    }
};

define("simpleNode", function(){});

/**
 * http://www.openjs.com/scripts/events/keyboard_shortcuts/
 * Version : 2.01.B
 * By Binny V A
 * License : BSD
 */
shortcut = {
	'all_shortcuts':{},//All the shortcuts are stored in this array
	'add': function(shortcut_combination,callback,opt) {
		//Provide a set of default options
		var default_options = {
			'type':'keydown',
			'propagate':false,
			'disable_in_input':false,
			'target':document,
			'keycode':false
		}
		if(!opt) opt = default_options;
		else {
			for(var dfo in default_options) {
				if(typeof opt[dfo] == 'undefined') opt[dfo] = default_options[dfo];
			}
		}

		var ele = opt.target;
		if(typeof opt.target == 'string') ele = document.getElementById(opt.target);
		var ths = this;
		shortcut_combination = shortcut_combination.toLowerCase();

		//The function to be called at keypress
		var func = function(e) {
			e = e || window.event;
			
			if(opt['disable_in_input']) { //Don't enable shortcut keys in Input, Textarea fields
				var element;
				if(e.target) element=e.target;
				else if(e.srcElement) element=e.srcElement;
				if(element.nodeType==3) element=element.parentNode;

				if(element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') return;
			}
	
			//Find Which key is pressed
			if (e.keyCode) code = e.keyCode;
			else if (e.which) code = e.which;
			var character = String.fromCharCode(code).toLowerCase();
			
			if(code == 188) character=","; //If the user presses , when the type is onkeydown
			if(code == 190) character="."; //If the user presses , when the type is onkeydown

			var keys = shortcut_combination.split("+");
			//Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
			var kp = 0;
			
			//Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
			var shift_nums = {
				"`":"~",
				"1":"!",
				"2":"@",
				"3":"#",
				"4":"$",
				"5":"%",
				"6":"^",
				"7":"&",
				"8":"*",
				"9":"(",
				"0":")",
				"-":"_",
				"=":"+",
				";":":",
				"'":"\"",
				",":"<",
				".":">",
				"/":"?",
				"\\":"|"
			}
			//Special Keys - and their codes
			var special_keys = {
				'esc':27,
				'escape':27,
				'tab':9,
				'space':32,
				'return':13,
				'enter':13,
				'backspace':8,
	
				'scrolllock':145,
				'scroll_lock':145,
				'scroll':145,
				'capslock':20,
				'caps_lock':20,
				'caps':20,
				'numlock':144,
				'num_lock':144,
				'num':144,
				
				'pause':19,
				'break':19,
				
				'insert':45,
				'home':36,
				'delete':46,
				'end':35,
				
				'pageup':33,
				'page_up':33,
				'pu':33,
	
				'pagedown':34,
				'page_down':34,
				'pd':34,
	
				'left':37,
				'up':38,
				'right':39,
				'down':40,
	
				'f1':112,
				'f2':113,
				'f3':114,
				'f4':115,
				'f5':116,
				'f6':117,
				'f7':118,
				'f8':119,
				'f9':120,
				'f10':121,
				'f11':122,
				'f12':123
			}
	
			var modifiers = { 
				shift: { wanted:false, pressed:false},
				ctrl : { wanted:false, pressed:false},
				alt  : { wanted:false, pressed:false},
				meta : { wanted:false, pressed:false}	//Meta is Mac specific
			};
                        
			if(e.ctrlKey)	modifiers.ctrl.pressed = true;
			if(e.shiftKey)	modifiers.shift.pressed = true;
			if(e.altKey)	modifiers.alt.pressed = true;
			if(e.metaKey)   modifiers.meta.pressed = true;
                        
			for(var i=0; k=keys[i],i<keys.length; i++) {
				//Modifiers
				if(k == 'ctrl' || k == 'control') {
					kp++;
					modifiers.ctrl.wanted = true;

				} else if(k == 'shift') {
					kp++;
					modifiers.shift.wanted = true;

				} else if(k == 'alt') {
					kp++;
					modifiers.alt.wanted = true;
				} else if(k == 'meta') {
					kp++;
					modifiers.meta.wanted = true;
				} else if(k.length > 1) { //If it is a special key
					if(special_keys[k] == code) kp++;
					
				} else if(opt['keycode']) {
					if(opt['keycode'] == code) kp++;

				} else { //The special keys did not match
					if(character == k) kp++;
					else {
						if(shift_nums[character] && e.shiftKey) { //Stupid Shift key bug created by using lowercase
							character = shift_nums[character]; 
							if(character == k) kp++;
						}
					}
				}
			}
			
			if(kp == keys.length && 
						modifiers.ctrl.pressed == modifiers.ctrl.wanted &&
						modifiers.shift.pressed == modifiers.shift.wanted &&
						modifiers.alt.pressed == modifiers.alt.wanted &&
						modifiers.meta.pressed == modifiers.meta.wanted) {
				callback(e);
	
				if(!opt['propagate']) { //Stop the event
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
		}
		this.all_shortcuts[shortcut_combination] = {
			'callback':func, 
			'target':ele, 
			'event': opt['type']
		};
		//Attach the function with the event
		if(ele.addEventListener) ele.addEventListener(opt['type'], func, false);
		else if(ele.attachEvent) ele.attachEvent('on'+opt['type'], func);
		else ele['on'+opt['type']] = func;
	},

	//Remove the shortcut - just specify the shortcut and I will remove the binding
	'remove':function(shortcut_combination) {
		shortcut_combination = shortcut_combination.toLowerCase();
		var binding = this.all_shortcuts[shortcut_combination];
		delete(this.all_shortcuts[shortcut_combination])
		if(!binding) return;
		var type = binding['event'];
		var ele = binding['target'];
		var callback = binding['callback'];

		if(ele.detachEvent) ele.detachEvent('on'+type, callback);
		else if(ele.removeEventListener) ele.removeEventListener(type, callback, false);
		else ele['on'+type] = false;
	}
};
define("shortcut", function(){});

require(['profile-w3c-common']);
