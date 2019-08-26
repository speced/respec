"use strict";
window.respecVersion = "24.30.5";
/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 	};
/******/
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		0: 0
/******/ 	};
/******/
/******/
/******/
/******/ 	// script path function
/******/ 	function jsonpScriptSrc(chunkId) {
/******/ 		return __webpack_require__.p + "" + chunkId + ".respec-w3c.js"
/******/ 	}
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// The chunk loading function for additional chunks
/******/ 	// Since all referenced chunks are already included
/******/ 	// in this file, this function is empty here.
/******/ 	__webpack_require__.e = function requireEnsure() {
/******/ 		return Promise.resolve();
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
// In case everything else fails, we want the error
window.addEventListener("error", ev => {
  console.error(ev.error, ev.message, ev);
});

// this is only set in a build, not at all in the dev environment
undefined;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  // order is significant
  __webpack_require__(1),
  __webpack_require__(11),
  __webpack_require__(43),
  __webpack_require__(44),
  __webpack_require__(10),
  __webpack_require__(45),
  __webpack_require__(57),
  __webpack_require__(59),
  __webpack_require__(60),
  __webpack_require__(61),
  __webpack_require__(62),
  __webpack_require__(39),
  __webpack_require__(63),
  __webpack_require__(71),
  __webpack_require__(72),
  __webpack_require__(73),
  __webpack_require__(74),
  __webpack_require__(80),
  __webpack_require__(81),
  __webpack_require__(82),
  __webpack_require__(84),
  __webpack_require__(86),
  __webpack_require__(89),
  __webpack_require__(90),
  __webpack_require__(91),
  __webpack_require__(92),
  __webpack_require__(126),
  __webpack_require__(77),
  __webpack_require__(127),
  __webpack_require__(128),
  __webpack_require__(76),
  __webpack_require__(131),
  __webpack_require__(132),
  __webpack_require__(133),
  __webpack_require__(134),
  __webpack_require__(135),
  __webpack_require__(136),
  __webpack_require__(138),
  __webpack_require__(140),
  __webpack_require__(142),
  __webpack_require__(143),
  __webpack_require__(144),
  __webpack_require__(145),
  __webpack_require__(146),
  __webpack_require__(147),
  __webpack_require__(148),
  __webpack_require__(152),
  __webpack_require__(154),
  __webpack_require__(155),
  __webpack_require__(156),
  __webpack_require__(158),
  __webpack_require__(160),
  __webpack_require__(162),
  /* Linter must be the last thing to run */
  __webpack_require__(51),
], __WEBPACK_AMD_DEFINE_RESULT__ = ((runner, { ui }, ...plugins) => {
  ui.show();
  const loadPromise = new Promise(r => {
    if (document.readyState !== "loading") {
      r();
      return;
    }
    document.addEventListener("DOMContentLoaded", r)
  });
  loadPromise.then(async () => {
    try {
      await runner.runAll(plugins);
    } catch (err) {
      console.error(err);
    } finally {
      ui.enable();
    }
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(2), __webpack_require__(5), __webpack_require__(6), __webpack_require__(7), __webpack_require__(8), __webpack_require__(3), __webpack_require__(9)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _includeConfig, _overrideConfiguration, _respecReady, _postProcess, _preProcess, _pubsubhub, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.runAll = runAll;
  _exports.name = void 0;
  // Module core/base-runner
  // The module in charge of running the whole processing pipeline.
  const name = "core/base-runner";
  _exports.name = name;
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
          const msg = "Plugin ".concat(name, " took too long.");
          console.error(msg, plug);
          reject(new Error(msg));
        }, 15000);

        if (canMeasure) {
          performance.mark("".concat(name, "-start"));
        }

        try {
          if (plug.run.length <= 1) {
            await plug.run(config);
            resolve();
          } else {
            console.warn("Plugin ".concat(name, " uses a deprecated callback signature. Return a Promise instead. Read more at: https://github.com/w3c/respec/wiki/Developers-Guide#plugins"));
            plug.run(config, document, resolve);
          }
        } catch (err) {
          reject(err);
        } finally {
          clearTimeout(timerId);
        }

        if (canMeasure) {
          performance.mark("".concat(name, "-end"));
          performance.measure(name, "".concat(name, "-start"), "".concat(name, "-end"));
        }
      });
    };
  }

  async function runAll(plugs) {
    (0, _pubsubhub.pub)("start-all", respecConfig);

    if (canMeasure) {
      performance.mark("".concat(name, "-start"));
    }

    await _preProcess.done;
    const runnables = plugs.filter(plug => plug && plug.run).map(toRunnable);

    for (const task of runnables) {
      try {
        await task(respecConfig);
      } catch (err) {
        console.error(err);
      }
    }

    (0, _pubsubhub.pub)("plugins-done", respecConfig);
    await _postProcess.done;
    (0, _pubsubhub.pub)("end-all", respecConfig);
    (0, _utils.removeReSpec)(document);

    if (canMeasure) {
      performance.mark("".concat(name, "-end"));
      performance.measure(name, "".concat(name, "-start"), "".concat(name, "-end"));
    }
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=base-runner.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _pubsubhub) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.name = void 0;
  // Module core/include-config
  // Inject's the document's configuration into the head as JSON.
  const name = "core/include-config";
  _exports.name = name;
  const userConfig = {};

  const amendConfig = newValues => Object.assign(userConfig, newValues);

  const removeList = ["githubToken", "githubUser"];
  (0, _pubsubhub.sub)("start-all", amendConfig);
  (0, _pubsubhub.sub)("amend-user-config", amendConfig);
  (0, _pubsubhub.sub)("end-all", () => {
    const script = document.createElement("script");
    script.id = "initialUserConfig";
    script.type = "application/json";

    for (const prop of removeList) {
      if (prop in userConfig) delete userConfig[prop];
    }

    script.innerHTML = JSON.stringify(userConfig, null, 2);
    document.head.appendChild(script);
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=include-config.js.map

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _exposeModules) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.pub = pub;
  _exports.sub = sub;
  _exports.unsub = unsub;
  _exports.name = void 0;

  /**
   * Module core/pubsubhub
   *
   * Returns a singleton that can be used for message broadcasting
   * and message receiving. Replaces legacy "msg" code in ReSpec.
   */
  const name = "core/pubsubhub";
  _exports.name = name;
  const subscriptions = new Map();

  function pub(topic, ...data) {
    if (!subscriptions.has(topic)) {
      return; // Nothing to do...
    }

    Array.from(subscriptions.get(topic)).forEach(cb => {
      try {
        cb(...data);
      } catch (err) {
        pub("error", "Error when calling function ".concat(cb.name, ". See developer console."));
        console.error(err);
      }
    });

    if (window.parent === window.self) {
      return;
    } // If this is an iframe, postMessage parent (used in testing).


    const args = data // to structured clonable
    .map(arg => String(JSON.stringify(arg.stack || arg)));
    window.parent.postMessage({
      topic,
      args
    }, window.parent.location.origin);
  }
  /**
   * Subscribes to a message type.
   *
   * @param  {string} topic      The topic to subscribe to (e.g., "start-all")
   * @param  {Function} cb       Callback function
   * @param  {Boolean} opts.once Add prop "once" for single notification.
   * @return {Object}            An object that should be considered opaque,
   *                             used for unsubscribing from messages.
   */


  function sub(topic, cb, opts = {
    once: false
  }) {
    if (opts.once) {
      return sub(topic, function wrapper(...args) {
        unsub({
          topic,
          cb: wrapper
        });
        cb(...args);
      });
    }

    if (subscriptions.has(topic)) {
      subscriptions.get(topic).add(cb);
    } else {
      subscriptions.set(topic, new Set([cb]));
    }

    return {
      topic,
      cb
    };
  }
  /**
   * Unsubscribe from messages.
   *
   * @param {Object} opaque The object that was returned from calling sub()
   */


  function unsub({
    topic,
    cb
  }) {
    // opaque is whatever is returned by sub()
    const callbacks = subscriptions.get(topic);

    if (!callbacks || !callbacks.has(cb)) {
      console.warn("Already unsubscribed:", topic, cb);
      return false;
    }

    return callbacks.delete(cb);
  }

  sub("error", err => {
    console.error(err, err.stack);
  });
  sub("warn", str => {
    console.warn(str);
  });
  (0, _exposeModules.expose)(name, {
    sub
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=pubsubhub.js.map

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.expose = expose;
  const inAmd = !!window.require;

  if (!inAmd) {
    window.require = function (deps, callback) {
      const modules = deps.map(dep => {
        if (!(dep in window.require.modules)) {
          throw new Error("Unsupported dependency name: ".concat(dep));
        }

        return window.require.modules[dep];
      });
      callback(...modules);
    };

    window.require.modules = {};
  }

  function expose(name, object) {
    if (!inAmd) {
      window.require.modules[name] = object;
    }
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=expose-modules.js.map

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _pubsubhub) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.name = void 0;
  // Module core/override-configuration
  // A helper module that makes it possible to override settings specified in respecConfig
  // by passing them as a query string. This is useful when you just want to make a few
  // tweaks to a document before generating the snapshot, without mucking with the source.
  // For example, you can change the status and date by appending:
  //      ?specStatus=LC&publishDate=2012-03-15
  const name = "core/override-configuration";
  _exports.name = name;

  function overrideConfig(config) {
    // For legacy reasons, we still support both ";" and "&"
    const searchQuery = document.location.search.replace(/;/g, "&");
    const params = new URLSearchParams(searchQuery);
    const overrideProps = Array.from(params).filter(([key, value]) => !!key && !!value).map(([codedKey, codedValue]) => {
      const key = decodeURIComponent(codedKey);
      const decodedValue = decodeURIComponent(codedValue.replace(/%3D/g, "="));
      let value;

      try {
        value = JSON.parse(decodedValue);
      } catch (_unused) {
        value = decodedValue;
      }

      return {
        key,
        value
      };
    }).reduce((collector, {
      key,
      value
    }) => {
      collector[key] = value;
      return collector;
    }, {});
    Object.assign(config, overrideProps);
    (0, _pubsubhub.pub)("amend-user-config", overrideProps);
  }

  (0, _pubsubhub.sub)("start-all", overrideConfig, {
    once: true
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=override-configuration.js.map

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _pubsubhub) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.name = void 0;

  /**
   * This Module adds a `respecIsReady` property to the document object.
   * The property returns a promise that settles when ReSpec finishes
   * processing the document.
   */
  const name = "core/respec-ready";
  _exports.name = name;
  const respecDonePromise = new Promise(resolve => {
    (0, _pubsubhub.sub)("end-all", resolve, {
      once: true
    });
  });
  Object.defineProperty(document, "respecIsReady", {
    get() {
      return respecDonePromise;
    }

  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=respec-ready.js.map

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _pubsubhub) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.done = _exports.name = void 0;

  /**
   * Module core/post-process
   *
   * Corresponds to respecConfig.postProcess and config.afterEnd.
   *  - postProcess: an array of functions that get called
   *      after processing finishes. This is not recommended and the feature is not
   *      tested. Use with care, if you know what you're doing. Chances are you really
   *      want to be using a new module with your own profile.
   *  - afterEnd: final thing that is called.
   */
  const name = "core/post-process";
  _exports.name = name;
  let doneResolver;
  const done = new Promise(resolve => {
    doneResolver = resolve;
  });
  _exports.done = done;
  (0, _pubsubhub.sub)("plugins-done", async config => {
    const result = [];

    if (Array.isArray(config.postProcess)) {
      const promises = config.postProcess.filter(f => {
        const isFunction = typeof f === "function";

        if (!isFunction) {
          (0, _pubsubhub.pub)("error", "Every item in `postProcess` must be a JS function.");
        }

        return isFunction;
      }).map(async f => {
        try {
          return await f(config, document);
        } catch (err) {
          (0, _pubsubhub.pub)("error", "Function ".concat(f.name, " threw an error during `postProcess`. See developer console."));
          console.error(err);
        }
      });
      const values = await Promise.all(promises);
      result.push(...values);
    }

    if (typeof config.afterEnd === "function") {
      result.push((await config.afterEnd(config, document)));
    }

    doneResolver(result);
  }, {
    once: true
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=post-process.js.map

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _pubsubhub) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.done = _exports.name = void 0;

  /**
   * Module core/pre-process
   *
   * Corresponds to respecConfig.preProcess.
   *  - preProcess: an array of functions that get called
   *      before anything else happens. This is not recommended and the feature is not
   *      tested. Use with care, if you know what you're doing. Chances are you really
   *      want to be using a new module with your own profile
   */
  const name = "core/pre-process";
  _exports.name = name;
  let doneResolver;
  const done = new Promise(resolve => {
    doneResolver = resolve;
  });
  _exports.done = done;
  (0, _pubsubhub.sub)("start-all", async config => {
    const result = [];

    if (Array.isArray(config.preProcess)) {
      const promises = config.preProcess.filter(f => {
        const isFunction = typeof f === "function";

        if (!isFunction) {
          (0, _pubsubhub.pub)("error", "Every item in `preProcess` must be a JS function.");
        }

        return isFunction;
      }).map(async f => {
        try {
          return await f(config, document);
        } catch (err) {
          (0, _pubsubhub.pub)("error", "Function ".concat(f.name, " threw an error during `preProcess`. See developer console."));
          console.error(err);
        }
      });
      const values = await Promise.all(promises);
      result.push(...values);
    }

    doneResolver(result);
  }, {
    once: true
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=pre-process.js.map

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(10), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _l10n, _pubsubhub) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.calculateLeftPad = calculateLeftPad;
  _exports.createResourceHint = createResourceHint;
  _exports.removeReSpec = removeReSpec;
  _exports.showInlineWarning = showInlineWarning;
  _exports.showInlineError = showInlineError;
  _exports.joinAnd = joinAnd;
  _exports.xmlEscape = xmlEscape;
  _exports.norm = norm;
  _exports.concatDate = concatDate;
  _exports.toShortIsoDate = toShortIsoDate;
  _exports.lead0 = lead0;
  _exports.parseSimpleDate = parseSimpleDate;
  _exports.parseLastModified = parseLastModified;
  _exports.humanDate = humanDate;
  _exports.isoDate = isoDate;
  _exports.toKeyValuePairs = toKeyValuePairs;
  _exports.linkCSS = linkCSS;
  _exports.runTransforms = runTransforms;
  _exports.fetchAndCache = fetchAndCache;
  _exports.flatten = flatten;
  _exports.addId = addId;
  _exports.getTextNodes = getTextNodes;
  _exports.getDfnTitles = getDfnTitles;
  _exports.getLinkTargets = getLinkTargets;
  _exports.renameElement = renameElement;
  _exports.refTypeFromContext = refTypeFromContext;
  _exports.wrapInner = wrapInner;
  _exports.parents = parents;
  _exports.children = children;
  _exports.msgIdGenerator = msgIdGenerator;
  _exports.makeSafeCopy = makeSafeCopy;
  _exports.removeCommentNodes = removeCommentNodes;
  _exports.InsensitiveStringSet = _exports.IDBKeyVal = _exports.nonNormativeSelector = _exports.ISODate = _exports.name = void 0;
  // Module core/utils
  // As the name implies, this contains a ragtag gang of methods that just don't fit
  // anywhere else.
  const name = "core/utils";
  _exports.name = name;
  const spaceOrTab = /^[ |\t]*/;
  const dashes = /-/g;
  const ISODate = new Intl.DateTimeFormat(["en-ca-iso8601"], {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  _exports.ISODate = ISODate;
  const resourceHints = new Set(["dns-prefetch", "preconnect", "preload", "prerender"]);
  const fetchDestinations = new Set(["document", "embed", "font", "image", "manifest", "media", "object", "report", "script", "serviceworker", "sharedworker", "style", "worker", "xslt", ""]); // CSS selector for matching elements that are non-normative

  const nonNormativeSelector = ".informative, .note, .issue, .example, .ednote, .practice, .introductory";
  _exports.nonNormativeSelector = nonNormativeSelector;

  function calculateLeftPad(text) {
    if (typeof text !== "string") {
      throw new TypeError("Invalid input");
    } // Find smallest padding value


    const leftPad = text.split("\n").filter(item => item).reduce((smallest, item) => {
      // can't go smaller than 0
      if (smallest === 0) {
        return smallest;
      }

      const match = item.match(spaceOrTab)[0] || "";
      return Math.min(match.length, smallest);
    }, +Infinity);
    return leftPad === +Infinity ? 0 : leftPad;
  }
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
    let {
      href
    } = url;
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
            console.warn("Unknown request destination: ".concat(opts.as));
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
  } // RESPEC STUFF


  function removeReSpec(doc) {
    doc.querySelectorAll(".remove, script[data-requiremodule]").forEach(elem => {
      elem.remove();
    });
  }
  /**
   * Adds error class to each element while emitting a warning
   * @param {Element|Element[]} elems
   * @param {String} msg message to show in warning
   * @param {String=} title error message to add on each element
   */


  function showInlineWarning(elems, msg, title) {
    if (!Array.isArray(elems)) elems = [elems];
    const links = elems.map((element, i) => {
      markAsOffending(element, msg, title);
      return generateMarkdownLink(element, i);
    }).join(", ");
    (0, _pubsubhub.pub)("warn", "".concat(msg, " at: ").concat(links, "."));
    console.warn(msg, elems);
  }
  /**
   * Adds error class to each element while emitting a warning
   * @param {Element|Element[]} elems
   * @param {String} msg message to show in warning
   * @param {String} title error message to add on each element
   * @param {object} [options]
   * @param {string} [options.details]
   */


  function showInlineError(elems, msg, title, {
    details
  } = {}) {
    if (!Array.isArray(elems)) elems = [elems];
    const links = elems.map((element, i) => {
      markAsOffending(element, msg, title);
      return generateMarkdownLink(element, i);
    }).join(", ");
    let message = "".concat(msg, " at: ").concat(links, ".");

    if (details) {
      message += "\n\n<details>".concat(details, "</details>");
    }

    (0, _pubsubhub.pub)("error", message);
    console.error(msg, elems);
  }
  /**
   * Adds error class to each element while emitting a warning
   * @param {Element} elem
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
    return "[".concat(i + 1, "](#").concat(element.id, ")");
  }

  class IDBKeyVal {
    /**
     * @param {import("idb").DB} idb
     * @param {string} storeName
     */
    constructor(idb, storeName) {
      this.idb = idb;
      this.storeName = storeName;
    }
    /** @param {string} key */


    async get(key) {
      return await this.idb.transaction(this.storeName).objectStore(this.storeName).get(key);
    }
    /**
     * @param {string[]} keys
     * @returns {[string, any][]}
     */


    async getMany(keys) {
      const keySet = new Set(keys);
      const results = [];
      let cursor = await this.idb.transaction(this.storeName).store.openCursor();

      while (cursor) {
        if (keySet.has(cursor.key)) {
          results.push([cursor.key, cursor.value]);
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
      return await tx.complete;
    }

    async addMany(entries) {
      const tx = this.idb.transaction(this.storeName, "readwrite");

      for (const [key, value] of entries) {
        tx.objectStore(this.storeName).put(value, key);
      }

      return await tx.complete;
    }

    async clear() {
      const tx = this.idb.transaction(this.storeName, "readwrite");
      tx.objectStore(this.storeName).clear();
      return await tx.complete;
    }

    async keys() {
      const tx = this.idb.transaction(this.storeName);
      /** @type {string[]} */

      const keys = tx.objectStore(this.storeName).getAllKeys();
      await tx.complete;
      return keys;
    }

  } // STRING HELPERS
  // Takes an array and returns a string that separates each of its items with the proper commas and
  // "and". The second argument is a mapping function that can convert the items before they are
  // joined


  _exports.IDBKeyVal = IDBKeyVal;

  function joinAnd(array = [], mapper = item => item, lang = _l10n.lang) {
    const items = array.map(mapper);

    if (Intl.ListFormat && typeof Intl.ListFormat === "function") {
      const formatter = new Intl.ListFormat(lang, {
        style: "long",
        type: "conjunction"
      });
      return formatter.format(items);
    }

    switch (items.length) {
      case 0:
      case 1:
        // "x"
        return items.toString();

      case 2:
        // x and y
        return items.join(" and ");

      default:
        {
          // x, y, and z
          const str = items.join(", ");
          const lastComma = str.lastIndexOf(",");
          return "".concat(str.substr(0, lastComma + 1), " and ").concat(str.slice(lastComma + 2));
        }
    }
  } // Takes a string, applies some XML escapes, and returns the escaped string.
  // Note that overall using either Handlebars' escaped output or jQuery is much
  // preferred to operating on strings directly.


  function xmlEscape(s) {
    return s.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }
  /**
   * Trims string at both ends and replaces all other white space with a single space
   * @param {string} str
   */


  function norm(str) {
    return str.trim().replace(/\s+/g, " ");
  } // --- DATE HELPERS -------------------------------------------------------------------------------
  // Takes a Date object and an optional separator and returns the year,month,day representation with
  // the custom separator (defaulting to none) and proper 0-padding


  function concatDate(date, sep = "") {
    return ISODate.format(date).replace(dashes, sep);
  } // formats a date to "yyyy-mm-dd"


  function toShortIsoDate(date) {
    return ISODate.format(date);
  } // takes a string, prepends a "0" if it is of length 1, does nothing otherwise


  function lead0(str) {
    return String(str).length === 1 ? "0".concat(str) : str;
  } // takes a YYYY-MM-DD date and returns a Date object for it


  function parseSimpleDate(str) {
    return new Date(str);
  } // takes what document.lastModified returns and produces a Date object for it


  function parseLastModified(str) {
    if (!str) return new Date();
    return new Date(Date.parse(str));
  } // given either a Date object or a date in YYYY-MM-DD format,
  // return a human-formatted date suitable for use in a W3C specification


  function humanDate(date = new Date(), lang = document.documentElement.lang || "en") {
    if (!(date instanceof Date)) date = new Date(date);
    const langs = [lang, "en"];
    const day = date.toLocaleString(langs, {
      day: "2-digit",
      timeZone: "UTC"
    });
    const month = date.toLocaleString(langs, {
      month: "long",
      timeZone: "UTC"
    });
    const year = date.toLocaleString(langs, {
      year: "numeric",
      timeZone: "UTC"
    }); // date month year

    return "".concat(day, " ").concat(month, " ").concat(year);
  } // given either a Date object or a date in YYYY-MM-DD format,
  // return an ISO formatted date suitable for use in a xsd:datetime item


  function isoDate(date) {
    return (date instanceof Date ? date : new Date(date)).toISOString();
  } // Given an object, it converts it to a key value pair separated by
  // ("=", configurable) and a delimiter (" ," configurable).
  // for example, {"foo": "bar", "baz": 1} becomes "foo=bar, baz=1"


  function toKeyValuePairs(obj, delimiter = ", ", separator = "=") {
    return Array.from(Object.entries(obj)).map(([key, value]) => "".concat(key).concat(separator).concat(JSON.stringify(value))).join(delimiter);
  } // STYLE HELPERS
  // take a document and either a link or an array of links to CSS and appends
  // a <link/> element to the head pointing to each


  function linkCSS(doc, styles) {
    const stylesArray = [].concat(styles);
    const frag = stylesArray.map(url => {
      const link = doc.createElement("link");
      link.rel = "stylesheet";
      link.href = url;
      return link;
    }).reduce((elem, nextLink) => {
      elem.appendChild(nextLink);
      return elem;
    }, doc.createDocumentFragment());
    doc.head.appendChild(frag);
  } // TRANSFORMATIONS
  // Run list of transforms over content and return result.
  // Please note that this is a legacy method that is only kept in order
  // to maintain compatibility
  // with RSv1. It is therefore not tested and not actively supported.


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

        if (window[meth]) {
          // the initial call passed |this| directly, so we keep it that way
          try {
            content = window[meth].apply(this, args);
          } catch (e) {
            (0, _pubsubhub.pub)("warn", "call to `".concat(meth, "()` failed with: ").concat(e, ". See error console for stack trace."));
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
    const url = new URL(request.url); // use data from cache data if valid and render

    let cache;
    let cachedResponse;

    if ("caches" in window) {
      try {
        cache = await caches.open(url.origin);
        cachedResponse = await cache.match(request);

        if (cachedResponse && new Date(cachedResponse.headers.get("Expires")) > new Date()) {
          return cachedResponse;
        }
      } catch (err) {
        console.error("Failed to use Cache API.", err);
      }
    } // otherwise fetch new data and cache


    const response = await fetch(request);

    if (!response.ok) {
      if (cachedResponse) {
        // return stale version
        console.warn("Returning a stale cached response for ".concat(url));
        return cachedResponse;
      }
    } // cache response


    if (cache && response.ok) {
      const clonedResponse = response.clone();
      const customHeaders = new Headers(response.headers);
      const expiryDate = new Date(Date.now() + maxAge);
      customHeaders.set("Expires", expiryDate.toString());
      const cacheResponse = new Response((await clonedResponse.blob()), {
        headers: customHeaders
      }); // put in cache, and forget it (there is no recovery if it throws, but that's ok).

      await cache.put(request, cacheResponse).catch(console.error);
    }

    return response;
  } // --- COLLECTION/ITERABLE HELPERS ---------------

  /**
   * Spreads one iterable into another.
   *
   * @param {Array} collector
   * @param {any|Array} item
   * @returns {Array}
   */


  function flatten(collector, item) {
    const items = !Array.isArray(item) ? [item] : item.slice().reduce(flatten, []);
    collector.push(...items);
    return collector;
  } // --- DOM HELPERS -------------------------------

  /**
   * Creates and sets an ID to an element (elem)
   * using a specific prefix if provided, and a specific text if given.
   * @param {Element} elem element
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
    id = id.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\W+/gim, "-").replace(/^-+/, "").replace(/-+$/, "");

    if (!id) {
      id = "generatedID";
    } else if (pfx === "example") {
      id = txt;
    } else if (/\.$/.test(id) || !/^[a-z]/i.test(id)) {
      id = "x".concat(id); // trailing . doesn't play well with jQuery
    }

    if (pfx) {
      id = "".concat(pfx, "-").concat(id);
    }

    if (elem.ownerDocument.getElementById(id)) {
      let i = 0;
      let nextId = "".concat(id, "-").concat(i);

      while (elem.ownerDocument.getElementById(nextId)) {
        i += 1;
        nextId = "".concat(id, "-").concat(i);
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
   * @param {boolean} options.wsNodes if nodes that only have whitespace are returned.
   * @returns {Text[]}
   */


  function getTextNodes(el, exclusions = [], options = {
    wsNodes: true
  }) {
    const exclusionQuery = exclusions.join(", ");

    const acceptNode =
    /** @type {Text} */
    node => {
      if (!options.wsNodes && !node.data.trim()) {
        return NodeFilter.FILTER_REJECT;
      }

      if (exclusionQuery && node.parentElement.closest(exclusionQuery)) {
        return NodeFilter.FILTER_REJECT;
      }

      return NodeFilter.FILTER_ACCEPT;
    };

    const nodeIterator = document.createNodeIterator(el, NodeFilter.SHOW_TEXT, acceptNode);
    /** @type {Text[]} */

    const textNodes = [];
    let node;

    while (node = nodeIterator.nextNode()) {
      textNodes.push(
      /** @type {Text} */
      node);
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
   * @param {Element} elem
   * @param {Object} args
   * @param {boolean} [args.isDefinition]
   * @returns {String[]} array of title strings
   */


  function getDfnTitles(elem) {
    const titleSet = new Set(); // data-lt-noDefault avoid using the text content of a definition
    // in the definition list.

    const normText = !elem.hasAttribute("data-lt-noDefault") ? norm(elem.textContent) : "";

    if (elem.dataset.lt) {
      // prefer @data-lt for the list of title aliases
      elem.dataset.lt.split("|").map(item => norm(item)).reduce((set, item) => set.add(item), titleSet);
    } else if (elem.childNodes.length === 1 && elem.getElementsByTagName("abbr").length === 1 && elem.children[0].title) {
      titleSet.add(elem.children[0].title);
    } else {
      if (elem.textContent === '""') titleSet.add("the-empty-string");
    }

    titleSet.add(normText);
    const titles = [...titleSet].filter(item => item !== "");
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
   * @param {Element} elem
   * @returns {LinkTarget[]}
   */


  function getLinkTargets(elem) {
    const linkForElem = elem.closest("[data-link-for]");
    const linkFor = linkForElem ? linkForElem.dataset.linkFor : "";
    const titles = getDfnTitles(elem);
    const results = titles.reduce((result, title) => {
      // supports legacy <dfn>Foo.Bar()</dfn> definitions
      const split = title.split(".");

      if (split.length === 2) {
        // If there are multiple '.'s, this won't match an
        // Interface/member pair anyway.
        result.push({
          for: split[0],
          title: split[1]
        });
      } else {
        result.push({
          for: linkFor,
          title
        });
      } // Finally, we can try to match without link for


      if (linkFor !== "") result.push({
        for: "",
        title
      });
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
    const newElement = elem.ownerDocument.createElement(newName); // copy attributes

    for (const _ref of elem.attributes) {
      const {
        name,
        value
      } = _ref;
      newElement.setAttribute(name, value);
    } // copy child nodes


    newElement.append(...elem.childNodes);
    elem.replaceWith(newElement);
    return newElement;
  }

  function refTypeFromContext(ref, element) {
    const closestInformative = element.closest(nonNormativeSelector);
    let isInformative = false;

    if (closestInformative) {
      // check if parent is not normative
      isInformative = !element.closest(".normative") || !closestInformative.querySelector(".normative");
    } // prefixes `!` and `?` override section behavior


    if (ref.startsWith("!")) {
      if (isInformative) {
        // A (forced) normative reference in informative section is illegal
        return {
          type: "informative",
          illegal: true
        };
      }

      isInformative = false;
    } else if (ref.startsWith("?")) {
      isInformative = true;
    }

    const type = isInformative ? "informative" : "normative";
    return {
      type,
      illegal: false
    };
  }
  /**
   * Wraps inner contents with the wrapper node
   * @param {Node} outer outer node to be modified
   * @param {Node} wrapper wrapper node to be appended
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
   */


  function children(element, selector) {
    try {
      return element.querySelectorAll(":scope > ".concat(selector));
    } catch (_unused) {
      let tempId = ""; // We give a temporary id, to overcome lack of ":scope" support in Edge.

      if (!element.id) {
        tempId = "temp-".concat(String(Math.random()).substr(2));
        element.id = tempId;
      }

      const query = "#".concat(element.id, " > ").concat(selector);
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
   * @param {Int} counter A number, which can start at a given value.
   */


  function msgIdGenerator(namespace, counter = 0) {
    function* idGenerator(namespace, counter) {
      while (true) {
        yield "".concat(namespace, ":").concat(counter);
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
      return super.has(key) || [...this.keys()].some(existingKey => existingKey.toLowerCase() === key.toLowerCase());
    }
    /**
     * @param {string} key
     */


    delete(key) {
      return super.has(key) ? super.delete(key) : super.delete(this.getCanonicalKey(key));
    }
    /**
     * @param {string} key
     */


    getCanonicalKey(key) {
      return super.has(key) ? key : [...this.keys()].find(existingKey => existingKey.toLowerCase() === key.toLowerCase());
    }

  }

  _exports.InsensitiveStringSet = InsensitiveStringSet;

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
      yield (
        /** @type {T} */
        walker.currentNode
      );
    }
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=utils.js.map

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.lang = _exports.l10n = _exports.name = void 0;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  /**
   * Module core/l10n
   *
   * Looks at the lang attribute on the root element and uses it
   * to manage the config.l10n object so that other parts of the system can
   * localize their text.
   */
  const name = "core/l10n";
  _exports.name = name;
  const html = document.documentElement;

  if (html && !html.hasAttribute("lang")) {
    html.lang = "en";

    if (!html.hasAttribute("dir")) {
      html.dir = "ltr";
    }
  } // We use en-US as the base


  const base = {
    about_respec: "About",
    abstract: "Abstract",
    author: "Author:",
    authors: "Authors:",
    bug_tracker: "Bug tracker:",
    close_parens: ")",
    definition_list: "Definitions",
    editor: "Editor:",
    editors_note: "Editor's note",
    editors: "Editors:",
    feature_at_risk: "(Feature at Risk) Issue",
    former_editor: "Former editor:",
    former_editors: "Former editors:",
    info_references: "Informative references",
    issue_summary: "Issue Summary",
    issue: "Issue",
    latest_editors_draft: "Latest editor's draft:",
    latest_published_version: "Latest published version:",
    list_of_definitions: "List of Definitions",
    norm_references: "Normative references",
    note: "Note",
    open_bugs: "open bugs",
    open_parens: "(",
    participate: "Participate",
    references: "References",
    save_as: "Save as",
    save_snapshot: "Export",
    search_specref: "Search Specref",
    sotd: "Status of This Document",
    this_version: "This version:",
    toc: "Table of Contents",
    warning: "Warning"
  };
  const ko = {
    abstract: "요약",
    author: "저자:",
    authors: "저자:",
    latest_published_version: "최신 버전:",
    sotd: "현재 문서의 상태",
    this_version: "현재 버전:"
  };
  const zh = {
    about_respec: "关于",
    abstract: "摘要",
    bug_tracker: "错误跟踪：",
    editor: "编辑：",
    editors: "编辑：",
    file_a_bug: "反馈错误",
    former_editor: "原编辑：",
    former_editors: "原编辑：",
    latest_editors_draft: "最新编辑草稿：",
    latest_published_version: "最新发布版本：",
    note: "注",
    open_bugs: "修正中的错误",
    participate: "参与：",
    sotd: "关于本文档",
    this_version: "本版本：",
    toc: "内容大纲"
  };
  const ja = {
    abstract: "要約",
    author: "著者：",
    authors: "著者：",
    bug_tracker: "バグの追跡履歴：",
    editor: "編者：",
    editors: "編者：",
    file_a_bug: "問題報告",
    former_editor: "以前の版の編者：",
    former_editors: "以前の版の編者：",
    latest_editors_draft: "最新の編集用草案：",
    latest_published_version: "最新バージョン：",
    note: "注",
    open_bugs: "改修されていないバグ",
    participate: "参加方法：",
    sotd: "この文書の位置付け",
    this_version: "このバージョン：",
    toc: "目次"
  };
  const nl = {
    about_respec: "Over",
    abstract: "Samenvatting",
    author: "Auteur:",
    authors: "Auteurs:",
    bug_tracker: "Meldingensysteem:",
    definition_list: "Lijst van Definities",
    editor: "Redacteur:",
    editors_note: "Redactionele noot",
    editors: "Redacteurs:",
    file_a_bug: "Dien een melding in",
    info_references: "Informatieve referenties",
    issue_summary: "Lijst met issues",
    latest_editors_draft: "Laatste werkversie:",
    latest_published_version: "Laatst gepubliceerde versie:",
    list_of_definitions: "Lijst van Definities",
    norm_references: "Normatieve referenties",
    note: "Noot",
    open_bugs: "open meldingen",
    participate: "Doe mee",
    references: "Referenties",
    save_as: "Bewaar als",
    save_snapshot: "Bewaar Snapshot",
    search_specref: "Doorzoek Specref",
    sotd: "Status van dit document",
    this_version: "Deze versie:",
    toc: "Inhoudsopgave",
    warning: "Waarschuwing"
  };
  const es = {
    abstract: "Resumen",
    author: "Autor:",
    authors: "Autores:",
    bug_tracker: "Repositorio de bugs:",
    close_parens: ")",
    editor: "Editor:",
    editors_note: "Nota de editor",
    editors: "Editores:",
    file_a_bug: "Nota un bug",
    info_references: "Referencias informativas",
    issue_summary: "Resumen de la cuestión",
    issue: "Cuestión",
    latest_editors_draft: "Borrador de editor mas reciente:",
    latest_published_version: "Versión publicada mas reciente:",
    norm_references: "Referencias normativas",
    note: "Nota",
    open_bugs: "Bugs abiertos",
    open_parens: "(",
    participate: "Participad",
    references: "Referencias",
    sotd: "Estado de este Document",
    this_version: "Ésta versión:",
    toc: "Tabla de Contenidos",
    warning: "Aviso"
  };
  const l10n = {
    en: _objectSpread({}, base),
    ko: _objectSpread({}, base, {}, ko),
    zh: _objectSpread({}, base, {}, zh),
    ja: _objectSpread({}, base, {}, ja),
    nl: _objectSpread({}, base, {}, nl),
    es: _objectSpread({}, base, {}, es)
  };
  _exports.l10n = l10n;
  l10n["zh-hans"] = l10n.zh;
  l10n["zh-cn"] = l10n.zh;
  const lang = html && html.lang in l10n ? html.lang : "en";
  _exports.lang = lang;

  function run(config) {
    config.l10n = l10n[lang] || l10n.en;
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=l10n.js.map

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(12), __webpack_require__(13), __webpack_require__(39), __webpack_require__(42), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _ui, _hyperhtml, _markdown, _shortcut, _pubsubhub) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ui = _exports.name = void 0;
  _ui = _interopRequireDefault(_ui);
  _hyperhtml = _interopRequireDefault(_hyperhtml);
  _shortcut = _interopRequireDefault(_shortcut);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _templateObject9() {
    const data = _taggedTemplateLiteral(["<div id='", "' class='respec-modal removeOnSave' role='dialog'>\n      <h3 id=\"", "\">", "</h3>\n      <div class='inside'>", "</div>\n    </div>"]);

    _templateObject9 = function _templateObject9() {
      return data;
    };

    return data;
  }

  function _templateObject8() {
    const data = _taggedTemplateLiteral(["<div id='respec-overlay' class='removeOnSave'></div>"]);

    _templateObject8 = function _templateObject8() {
      return data;
    };

    return data;
  }

  function _templateObject7() {
    const data = _taggedTemplateLiteral(["<li role=menuitem>", "</li>"]);

    _templateObject7 = function _templateObject7() {
      return data;
    };

    return data;
  }

  function _templateObject6() {
    const data = _taggedTemplateLiteral(["<button id=\"", "\" class=\"respec-option\" title=\"", "\">\n      <span class=\"respec-cmd-icon\">", "</span> ", "\u2026\n    </button>"]);

    _templateObject6 = function _templateObject6() {
      return data;
    };

    return data;
  }

  function _templateObject5() {
    const data = _taggedTemplateLiteral(["<ol class='", "'></ol>"]);

    _templateObject5 = function _templateObject5() {
      return data;
    };

    return data;
  }

  function _templateObject4() {
    const data = _taggedTemplateLiteral(["<button id='", "' class='respec-info-button'>"]);

    _templateObject4 = function _templateObject4() {
      return data;
    };

    return data;
  }

  function _templateObject3() {
    const data = _taggedTemplateLiteral(["<button id='respec-pill' disabled>ReSpec</button>"]);

    _templateObject3 = function _templateObject3() {
      return data;
    };

    return data;
  }

  function _templateObject2() {
    const data = _taggedTemplateLiteral(["<ul id=respec-menu role=menu aria-labelledby='respec-pill' hidden></ul>"]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    const data = _taggedTemplateLiteral(["<div id='respec-ui' class='removeOnSave' hidden></div>"]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  const name = "core/ui"; // Opportunistically inserts the style, with the chance to reduce some FOUC

  _exports.name = name;
  const styleElement = document.createElement("style");
  styleElement.id = "respec-ui-styles";
  styleElement.textContent = _ui.default;
  styleElement.classList.add("removeOnSave");
  document.head.appendChild(styleElement);

  function ariaDecorate(elem, ariaMap) {
    if (!elem) {
      return;
    }

    Array.from(ariaMap).forEach(([name, value]) => {
      elem.setAttribute("aria-".concat(name), value);
    });
  }

  const respecUI = (0, _hyperhtml.default)(_templateObject());
  const menu = (0, _hyperhtml.default)(_templateObject2());
  let modal;
  let overlay;
  const errors = [];
  const warnings = [];
  const buttons = {};
  (0, _pubsubhub.sub)("start-all", () => document.body.prepend(respecUI), {
    once: true
  });
  (0, _pubsubhub.sub)("end-all", () => document.body.prepend(respecUI), {
    once: true
  });
  const respecPill = (0, _hyperhtml.default)(_templateObject3());
  respecUI.appendChild(respecPill);
  respecPill.addEventListener("click", function (e) {
    e.stopPropagation();

    if (menu.hidden) {
      menu.classList.remove("respec-hidden");
      menu.classList.add("respec-visible");
    } else {
      menu.classList.add("respec-hidden");
      menu.classList.remove("respec-visible");
    }

    this.setAttribute("aria-expanded", String(menu.hidden));
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
  const ariaMap = new Map([["controls", "respec-menu"], ["expanded", "false"], ["haspopup", "true"], ["label", "ReSpec Menu"]]);
  ariaDecorate(respecPill, ariaMap);

  function errWarn(msg, arr, butName, title) {
    arr.push(msg);

    if (!buttons.hasOwnProperty(butName)) {
      buttons[butName] = createWarnButton(butName, arr, title);
      respecUI.appendChild(buttons[butName]);
    }

    buttons[butName].textContent = arr.length;
  }

  function createWarnButton(butName, arr, title) {
    const buttonId = "respec-pill-".concat(butName);
    const button = (0, _hyperhtml.default)(_templateObject4(), buttonId);
    button.addEventListener("click", function () {
      this.setAttribute("aria-expanded", "true");
      const ol = (0, _hyperhtml.default)(_templateObject5(), "respec-".concat(butName, "-list"));

      for (const err of arr) {
        const fragment = document.createRange().createContextualFragment((0, _markdown.markdownToHtml)(err));
        const li = document.createElement("li"); // if it's only a single element, just copy the contents into li

        if (fragment.firstElementChild === fragment.lastElementChild) {
          li.append(...fragment.firstElementChild.childNodes); // Otherwise, take everything.
        } else {
          li.appendChild(fragment);
        }

        ol.appendChild(li);
      }

      ui.freshModal(title, ol, this);
    });
    const ariaMap = new Map([["expanded", "false"], ["haspopup", "true"], ["controls", "respec-pill-".concat(butName, "-modal")], ["label", "Document ".concat(title.toLowerCase())]]);
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
      const id = "respec-button-".concat(label.toLowerCase().replace(/\s+/, "-"));
      const button = (0, _hyperhtml.default)(_templateObject6(), id, keyShort, icon, label);
      const menuItem = (0, _hyperhtml.default)(_templateObject7(), button);
      menuItem.addEventListener("click", handler);
      menu.appendChild(menuItem);
      if (keyShort) _shortcut.default.add(keyShort, handler);
      return button;
    },

    error(msg) {
      errWarn(msg, errors, "error", "Errors");
    },

    warning(msg) {
      errWarn(msg, warnings, "warning", "Warnings");
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
      overlay = (0, _hyperhtml.default)(_templateObject8());
      const id = "".concat(currentOwner.id, "-modal");
      const headingId = "".concat(id, "-heading");
      modal = (0, _hyperhtml.default)(_templateObject9(), id, headingId, title, content);
      const ariaMap = new Map([["labelledby", headingId]]);
      ariaDecorate(modal, ariaMap);
      document.body.append(overlay, modal);
      overlay.addEventListener("click", () => this.closeModal(currentOwner));
      overlay.classList.toggle("respec-show-overlay");
      modal.hidden = false;
    }

  };
  _exports.ui = ui;

  _shortcut.default.add("Esc", () => ui.closeModal());

  _shortcut.default.add("Ctrl+Alt+Shift+E", () => {
    if (buttons.error) buttons.error.click();
  });

  _shortcut.default.add("Ctrl+Alt+Shift+W", () => {
    if (buttons.warning) buttons.warning.click();
  });

  window.respecUI = ui;
  (0, _pubsubhub.sub)("error", details => ui.error(details));
  (0, _pubsubhub.sub)("warn", details => ui.warning(details));
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=ui.js.map

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("#respec-ui {\n  position: fixed;\n  display: flex;\n  flex-direction: row-reverse;\n  top: 20px;\n  right: 20px;\n  width: 202px;\n  text-align: right;\n  z-index: 9000;\n}\n\n#respec-pill,\n.respec-info-button {\n  background: #fff;\n  height: 2.5em;\n  color: rgb(120, 120, 120);\n  border: 1px solid #ccc;\n  box-shadow: 1px 1px 8px 0 rgba(100, 100, 100, 0.5);\n}\n\n.respec-info-button {\n  border: none;\n  opacity: 0.75;\n  border-radius: 2em;\n  margin-right: 1em;\n  min-width: 3.5em;\n}\n\n.respec-info-button:focus,\n.respec-info-button:hover {\n  opacity: 1;\n  transition: opacity 0.2s;\n}\n\n#respec-pill:disabled {\n  font-size: 2.8px;\n  text-indent: -9999em;\n  border-top: 1.1em solid rgba(40, 40, 40, 0.2);\n  border-right: 1.1em solid rgba(40, 40, 40, 0.2);\n  border-bottom: 1.1em solid rgba(40, 40, 40, 0.2);\n  border-left: 1.1em solid #ffffff;\n  transform: translateZ(0);\n  animation: respec-spin 0.5s infinite linear;\n  box-shadow: none;\n}\n\n#respec-pill:disabled,\n#respec-pill:disabled:after {\n  border-radius: 50%;\n  width: 10em;\n  height: 10em;\n}\n\n@keyframes respec-spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n\n.respec-hidden {\n  visibility: hidden;\n  opacity: 0;\n  transition: visibility 0s 0.2s, opacity 0.2s linear;\n}\n\n.respec-visible {\n  visibility: visible;\n  opacity: 1;\n  transition: opacity 0.2s linear;\n}\n\n#respec-pill:hover,\n#respec-pill:focus {\n  color: rgb(0, 0, 0);\n  background-color: rgb(245, 245, 245);\n  transition: color 0.2s;\n}\n\n#respec-menu {\n  position: absolute;\n  margin: 0;\n  padding: 0;\n  font-family: sans-serif;\n  background: #fff;\n  box-shadow: 1px 1px 8px 0 rgba(100, 100, 100, 0.5);\n  width: 200px;\n  display: none;\n  text-align: left;\n  margin-top: 32px;\n  font-size: 0.8em;\n}\n\n#respec-menu:not([hidden]) {\n  display: block;\n}\n\n#respec-menu li {\n  list-style-type: none;\n  margin: 0;\n  padding: 0;\n}\n\n.respec-save-buttons {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(47%, 2fr));\n  grid-gap: 0.5cm;\n  padding: 0.5cm;\n}\n\n.respec-save-button:link {\n  padding-top: 16px;\n  color: rgb(240, 240, 240);\n  background: rgb(42, 90, 168);\n  justify-self: stretch;\n  height: 1cm;\n  text-decoration: none;\n  text-align: center;\n  font-size: inherit;\n  border: none;\n  border-radius: 0.2cm;\n}\n\n.respec-save-button:link:hover {\n  color: white;\n  background: rgb(42, 90, 168);\n  padding: 0;\n  margin: 0;\n  border: 0;\n  padding-top: 16px;\n}\n\n#respec-ui button:focus,\n#respec-pill:focus,\n.respec-option:focus {\n  outline: 0;\n  outline-style: none;\n}\n\n#respec-pill-error {\n  background-color: red;\n  color: white;\n}\n\n#respec-pill-warning {\n  background-color: orange;\n  color: white;\n}\n\n.respec-warning-list,\n.respec-error-list {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n  font-family: sans-serif;\n  background-color: rgb(255, 251, 230);\n  font-size: 0.85em;\n}\n\n.respec-warning-list > li,\n.respec-error-list > li {\n  padding: 0.4em 0.7em;\n}\n\n.respec-warning-list > li::before {\n  content: \"⚠️\";\n  padding-right: 0.5em;\n}\n.respec-warning-list p,\n.respec-error-list p {\n  padding: 0;\n  margin: 0;\n}\n\n.respec-warning-list li {\n  color: rgb(92, 59, 0);\n  border-bottom: thin solid rgb(255, 245, 194);\n}\n\n.respec-error-list,\n.respec-error-list li {\n  background-color: rgb(255, 240, 240);\n}\n\n.respec-error-list li::before {\n  content: \"💥\";\n  padding-right: 0.5em;\n}\n\n.respec-error-list li {\n  padding: 0.4em 0.7em;\n  color: rgb(92, 59, 0);\n  border-bottom: thin solid rgb(255, 215, 215);\n}\n\n.respec-error-list li > p {\n  margin: 0;\n  padding: 0;\n  display: inline-block;\n}\n\n#respec-overlay {\n  display: block;\n  position: fixed;\n  z-index: 10000;\n  top: 0px;\n  left: 0px;\n  height: 100%;\n  width: 100%;\n  background: #000;\n}\n\n.respec-show-overlay {\n  transition: opacity 0.2s linear;\n  opacity: 0.5;\n}\n\n.respec-hide-overlay {\n  transition: opacity 0.2s linear;\n  opacity: 0;\n}\n\n.respec-modal {\n  display: block;\n  position: fixed;\n  z-index: 11000;\n  margin: auto;\n  top: 10%;\n  background: #fff;\n  border: 5px solid #666;\n  min-width: 20%;\n  width: 79%;\n  padding: 0;\n  max-height: 80%;\n  overflow-y: auto;\n  margin: 0 -0.5cm;\n}\n\n@media screen and (min-width: 78em) {\n  .respec-modal {\n    width: 62%;\n  }\n}\n\n.respec-modal h3 {\n  margin: 0;\n  padding: 0.2em;\n  text-align: center;\n  color: black;\n  background: linear-gradient(\n    to bottom,\n    rgba(238, 238, 238, 1) 0%,\n    rgba(238, 238, 238, 1) 50%,\n    rgba(204, 204, 204, 1) 100%\n  );\n  font-size: 1em;\n}\n\n.respec-modal .inside div p {\n  padding-left: 1cm;\n}\n\n#respec-menu button.respec-option {\n  background: white;\n  padding: 0 0.2cm;\n  border: none;\n  width: 100%;\n  text-align: left;\n  font-size: inherit;\n  padding: 1.2em 1.2em;\n}\n\n#respec-menu button.respec-option:hover,\n#respec-menu button:focus {\n  background-color: #eeeeee;\n}\n\n.respec-cmd-icon {\n  padding-right: 0.5em;\n}\n\n#respec-ui button.respec-option:last-child {\n  border: none;\n  border-radius: inherit;\n}\n\n.respec-button-copy-paste {\n  position: absolute;\n  height: 28px;\n  width: 40px;\n  cursor: pointer;\n  background-image: linear-gradient(#fcfcfc, #eee);\n  border: 1px solid rgb(144, 184, 222);\n  border-left: 0;\n  border-radius: 0px 0px 3px 0;\n  -webkit-user-select: none;\n  user-select: none;\n  -webkit-appearance: none;\n  top: 0;\n  left: 127px;\n}\n\n#specref-ui {\n  margin: 0 2%;\n  margin-bottom: 0.5cm;\n}\n\n#specref-ui header {\n  font-size: 0.7em;\n  background-color: #eee;\n  text-align: center;\n  padding: 0.2cm;\n  margin-bottom: 0.5cm;\n  border-radius: 0 0 0.2cm 0.2cm;\n}\n\n#specref-ui header h1 {\n  padding: 0;\n  margin: 0;\n  color: black;\n}\n\n#specref-ui p {\n  padding: 0;\n  margin: 0;\n  font-size: 0.8em;\n  text-align: center;\n}\n\n#specref-ui p.state {\n  margin: 1cm;\n}\n\n#specref-ui .searchcomponent {\n  font-size: 16px;\n  display: grid;\n  grid-template-columns: auto 2cm;\n}\n#specref-ui .searchcomponent:focus {\n}\n\n#specref-ui input,\n#specref-ui button {\n  border: 0;\n  padding: 6px 12px;\n}\n\n#specref-ui label {\n  font-size: 0.6em;\n  grid-column-end: 3;\n  text-align: right;\n  grid-column-start: 1;\n}\n\n#specref-ui input[type=\"search\"] {\n  -webkit-appearance: none;\n  font-size: 16px;\n  border-radius: 0.1cm 0 0 0.1cm;\n  border: 1px solid rgb(204, 204, 204);\n}\n\n#specref-ui button[type=\"submit\"] {\n  color: white;\n  border-radius: 0 0.1cm 0.1cm 0;\n  background-color: rgb(51, 122, 183);\n}\n\n#specref-ui button[type=\"submit\"]:hover {\n  background-color: #286090;\n  border-color: #204d74;\n}\n\n#specref-ui .result-stats {\n  margin: 0;\n  padding: 0;\n  color: rgb(128, 128, 128);\n  font-size: 0.7em;\n  font-weight: bold;\n}\n\n#specref-ui .specref-results {\n  font-size: 0.8em;\n}\n\n#specref-ui .specref-results dd + dt {\n  margin-top: 0.51cm;\n}\n\n#specref-ui .specref-results a {\n  text-transform: capitalize;\n}\n#specref-ui .specref-results .authors {\n  display: block;\n  color: #006621;\n}\n\n@media print {\n  #respec-ui {\n    display: none;\n  }\n}\n\n#xref-ui {\n  width: 100%;\n  min-height: 550px;\n  height: 100%;\n  overflow: hidden;\n  padding: 0;\n  margin: 0;\n  border: 0;\n}\n\n#xref-ui:not(.ready) {\n  background: url(\"https://respec.org/xref/loader.gif\") no-repeat center;\n}\n");

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bind", function() { return bind; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "define", function() { return define; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hyper", function() { return hyper; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tagger", function() { return tagger; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return hyper; });
/* harmony import */ var _ungap_weakmap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
/* harmony import */ var _ungap_essential_weakset__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(15);
/* harmony import */ var domdiff__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(16);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "diff", function() { return domdiff__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _classes_Component_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(19);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Component", function() { return _classes_Component_js__WEBPACK_IMPORTED_MODULE_3__["default"]; });

/* harmony import */ var _objects_Intent_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(21);
/* harmony import */ var _objects_Updates_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(22);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "observe", function() { return _objects_Updates_js__WEBPACK_IMPORTED_MODULE_5__["observe"]; });

/* harmony import */ var _hyper_wire_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(35);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "wire", function() { return _hyper_wire_js__WEBPACK_IMPORTED_MODULE_6__["default"]; });

/* harmony import */ var _hyper_render_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(38);
/*! (c) Andrea Giammarchi (ISC) */










// all functions are self bound to the right context
// you can do the following
// const {bind, wire} = hyperHTML;
// and use them right away: bind(node)`hello!`;
const bind = context => _hyper_render_js__WEBPACK_IMPORTED_MODULE_7__["default"].bind(context);
const define = _objects_Intent_js__WEBPACK_IMPORTED_MODULE_4__["default"].define;
const tagger = _objects_Updates_js__WEBPACK_IMPORTED_MODULE_5__["Tagger"].prototype;

hyper.Component = _classes_Component_js__WEBPACK_IMPORTED_MODULE_3__["default"];
hyper.bind = bind;
hyper.define = define;
hyper.diff = domdiff__WEBPACK_IMPORTED_MODULE_2__["default"];
hyper.hyper = hyper;
hyper.observe = _objects_Updates_js__WEBPACK_IMPORTED_MODULE_5__["observe"];
hyper.tagger = tagger;
hyper.wire = _hyper_wire_js__WEBPACK_IMPORTED_MODULE_6__["default"];

// exported as shared utils
// for projects based on hyperHTML
// that don't necessarily need upfront polyfills
// i.e. those still targeting IE
hyper._ = {
  WeakMap: _ungap_weakmap__WEBPACK_IMPORTED_MODULE_0__["default"],
  WeakSet: _ungap_essential_weakset__WEBPACK_IMPORTED_MODULE_1__["default"]
};

// the wire content is the lazy defined
// html or svg property of each hyper.Component
Object(_classes_Component_js__WEBPACK_IMPORTED_MODULE_3__["setup"])(_hyper_wire_js__WEBPACK_IMPORTED_MODULE_6__["content"]);

// everything is exported directly or through the
// hyperHTML callback, when used as top level script


// by default, hyperHTML is a smart function
// that "magically" understands what's the best
// thing to do with passed arguments
function hyper(HTML) {
  return arguments.length < 2 ?
    (HTML == null ?
      Object(_hyper_wire_js__WEBPACK_IMPORTED_MODULE_6__["content"])('html') :
      (typeof HTML === 'string' ?
        hyper.wire(null, HTML) :
        ('raw' in HTML ?
          Object(_hyper_wire_js__WEBPACK_IMPORTED_MODULE_6__["content"])('html')(HTML) :
          ('nodeType' in HTML ?
            hyper.bind(HTML) :
            Object(_hyper_wire_js__WEBPACK_IMPORTED_MODULE_6__["weakly"])(HTML, 'html')
          )
        )
      )) :
    ('raw' in HTML ?
      Object(_hyper_wire_js__WEBPACK_IMPORTED_MODULE_6__["content"])('html') : hyper.wire
    ).apply(null, arguments);
}


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/*! (c) Andrea Giammarchi - ISC */
var self = undefined || /* istanbul ignore next */ {};
try { self.WeakMap = WeakMap; }
catch (WeakMap) {
  // this could be better but 90% of the time
  // it's everything developers need as fallback
  self.WeakMap = (function (id, Object) {'use strict';
    var dP = Object.defineProperty;
    var hOP = Object.hasOwnProperty;
    var proto = WeakMap.prototype;
    proto.delete = function (key) {
      return this.has(key) && delete key[this._];
    };
    proto.get = function (key) {
      return this.has(key) ? key[this._] : void 0;
    };
    proto.has = function (key) {
      return hOP.call(key, this._);
    };
    proto.set = function (key, value) {
      dP(key, this._, {configurable: true, value: value});
      return this;
    };
    return WeakMap;
    function WeakMap(iterable) {
      dP(this, '_', {value: '_@ungap/weakmap' + id++});
      if (iterable)
        iterable.forEach(add, this);
    }
    function add(pair) {
      this.set(pair[0], pair[1]);
    }
  }(Math.random(), Object));
}
/* harmony default export */ __webpack_exports__["default"] = (self.WeakMap);


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/*! (c) Andrea Giammarchi - ISC */
var self = undefined || /* istanbul ignore next */ {};
try { self.WeakSet = WeakSet; }
catch (WeakSet) {
  (function (id, dP) {
    var proto = WeakSet.prototype;
    proto.add = function (object) {
      if (!this.has(object))
        dP(object, this._, {value: true, configurable: true});
      return this;
    };
    proto.has = function (object) {
      return this.hasOwnProperty.call(object, this._);
    };
    proto.delete = function (object) {
      return this.has(object) && delete object[this._];
    };
    self.WeakSet = WeakSet;
    function WeakSet() {'use strict';
      dP(this, '_', {value: '_@ungap/weakmap' + id++});
    }
  }(Math.random(), Object.defineProperty));
}
/* harmony default export */ __webpack_exports__["default"] = (self.WeakSet);


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);
/*! (c) 2018 Andrea Giammarchi (ISC) */



const domdiff = (
  parentNode,     // where changes happen
  currentNodes,   // Array of current items/nodes
  futureNodes,    // Array of future items/nodes
  options         // optional object with one of the following properties
                  //  before: domNode
                  //  compare(generic, generic) => true if same generic
                  //  node(generic) => Node
) => {
  if (!options)
    options = {};

  const compare = options.compare || _utils_js__WEBPACK_IMPORTED_MODULE_0__["eqeq"];
  const get = options.node || _utils_js__WEBPACK_IMPORTED_MODULE_0__["identity"];
  const before = options.before == null ? null : get(options.before, 0);

  const currentLength = currentNodes.length;
  let currentEnd = currentLength;
  let currentStart = 0;

  let futureEnd = futureNodes.length;
  let futureStart = 0;

  // common prefix
  while (
    currentStart < currentEnd &&
    futureStart < futureEnd &&
    compare(currentNodes[currentStart], futureNodes[futureStart])
  ) {
    currentStart++;
    futureStart++;
  }

  // common suffix
  while (
    currentStart < currentEnd &&
    futureStart < futureEnd &&
    compare(currentNodes[currentEnd - 1], futureNodes[futureEnd - 1])
  ) {
    currentEnd--;
    futureEnd--;
  }

  const currentSame = currentStart === currentEnd;
  const futureSame = futureStart === futureEnd;

  // same list
  if (currentSame && futureSame)
    return futureNodes;

  // only stuff to add
  if (currentSame && futureStart < futureEnd) {
    Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__["append"])(
      get,
      parentNode,
      futureNodes,
      futureStart,
      futureEnd,
      Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__["next"])(get, currentNodes, currentStart, currentLength, before)
    );
    return futureNodes;
  }

  // only stuff to remove
  if (futureSame && currentStart < currentEnd) {
    Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__["remove"])(
      get,
      parentNode,
      currentNodes,
      currentStart,
      currentEnd
    );
    return futureNodes;
  }

  const currentChanges = currentEnd - currentStart;
  const futureChanges = futureEnd - futureStart;
  let i = -1;

  // 2 simple indels: the shortest sequence is a subsequence of the longest
  if (currentChanges < futureChanges) {
    i = Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__["indexOf"])(
      futureNodes,
      futureStart,
      futureEnd,
      currentNodes,
      currentStart,
      currentEnd,
      compare
    );
    // inner diff
    if (-1 < i) {
      Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__["append"])(
        get,
        parentNode,
        futureNodes,
        futureStart,
        i,
        get(currentNodes[currentStart], 0)
      );
      Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__["append"])(
        get,
        parentNode,
        futureNodes,
        i + currentChanges,
        futureEnd,
        Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__["next"])(get, currentNodes, currentEnd, currentLength, before)
      );
      return futureNodes;
    }
  }
  /* istanbul ignore else */
  else if (futureChanges < currentChanges) {
    i = Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__["indexOf"])(
      currentNodes,
      currentStart,
      currentEnd,
      futureNodes,
      futureStart,
      futureEnd,
      compare
    );
    // outer diff
    if (-1 < i) {
      Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__["remove"])(
        get,
        parentNode,
        currentNodes,
        currentStart,
        i
      );
      Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__["remove"])(
        get,
        parentNode,
        currentNodes,
        i + futureChanges,
        currentEnd
      );
      return futureNodes;
    }
  }

  // common case with one replacement for many nodes
  // or many nodes replaced for a single one
  /* istanbul ignore else */
  if ((currentChanges < 2 || futureChanges < 2)) {
    Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__["append"])(
      get,
      parentNode,
      futureNodes,
      futureStart,
      futureEnd,
      get(currentNodes[currentStart], 0)
    );
    Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__["remove"])(
      get,
      parentNode,
      currentNodes,
      currentStart,
      currentEnd
    );
    return futureNodes;
  }

  // the half match diff part has been skipped in petit-dom
  // https://github.com/yelouafi/petit-dom/blob/bd6f5c919b5ae5297be01612c524c40be45f14a7/src/vdom.js#L391-L397
  // accordingly, I think it's safe to skip in here too
  // if one day it'll come out like the speediest thing ever to do
  // then I might add it in here too

  // Extra: before going too fancy, what about reversed lists ?
  //        This should bail out pretty quickly if that's not the case.
  if (
    currentChanges === futureChanges &&
    Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__["isReversed"])(
      futureNodes,
      futureEnd,
      currentNodes,
      currentStart,
      currentEnd,
      compare
    )
  ) {
    Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__["append"])(
      get,
      parentNode,
      futureNodes,
      futureStart,
      futureEnd,
      Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__["next"])(get, currentNodes, currentEnd, currentLength, before)
    );
    return futureNodes;
  }

  // last resort through a smart diff
  Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__["smartDiff"])(
    get,
    parentNode,
    futureNodes,
    futureStart,
    futureEnd,
    futureChanges,
    currentNodes,
    currentStart,
    currentEnd,
    currentChanges,
    currentLength,
    compare,
    before
  );

  return futureNodes;
};

/* harmony default export */ __webpack_exports__["default"] = (domdiff);


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "append", function() { return append; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "eqeq", function() { return eqeq; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "identity", function() { return identity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "indexOf", function() { return indexOf; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isReversed", function() { return isReversed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "next", function() { return next; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "remove", function() { return remove; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "smartDiff", function() { return smartDiff; });
/* harmony import */ var _ungap_essential_map__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18);


const append = (get, parent, children, start, end, before) => {
  const isSelect = 'selectedIndex' in parent;
  let selectedIndex = -1;
  while (start < end) {
    const child = get(children[start], 1);
    if (isSelect && selectedIndex < 0 && child.selected)
      selectedIndex = start;
    parent.insertBefore(child, before);
    start++;
  }
  if (isSelect && -1 < selectedIndex)
    parent.selectedIndex = selectedIndex;
};

const eqeq = (a, b) => a == b;

const identity = O => O;

const indexOf = (
  moreNodes,
  moreStart,
  moreEnd,
  lessNodes,
  lessStart,
  lessEnd,
  compare
) => {
  const length = lessEnd - lessStart;
  /* istanbul ignore if */
  if (length < 1)
    return -1;
  while ((moreEnd - moreStart) >= length) {
    let m = moreStart;
    let l = lessStart;
    while (
      m < moreEnd &&
      l < lessEnd &&
      compare(moreNodes[m], lessNodes[l])
    ) {
      m++;
      l++;
    }
    if (l === lessEnd)
      return moreStart;
    moreStart = m + 1;
  }
  return -1;
};

const isReversed = (
  futureNodes,
  futureEnd,
  currentNodes,
  currentStart,
  currentEnd,
  compare
) => {
  while (
    currentStart < currentEnd &&
    compare(
      currentNodes[currentStart],
      futureNodes[futureEnd - 1]
    )) {
      currentStart++;
      futureEnd--;
    };
  return futureEnd === 0;
};

const next = (get, list, i, length, before) => i < length ?
              get(list[i], 0) :
              (0 < i ?
                get(list[i - 1], -0).nextSibling :
                before);

const remove = (get, parent, children, start, end) => {
  if ((end - start) < 2)
    parent.removeChild(get(children[start], -1));
  else {
    const range = parent.ownerDocument.createRange();
    range.setStartBefore(get(children[start], -1));
    range.setEndAfter(get(children[end - 1], -1));
    range.deleteContents();
  }
};

// - - - - - - - - - - - - - - - - - - -
// diff related constants and utilities
// - - - - - - - - - - - - - - - - - - -

const DELETION = -1;
const INSERTION = 1;
const SKIP = 0;
const SKIP_OND = 50;

const HS = (
  futureNodes,
  futureStart,
  futureEnd,
  futureChanges,
  currentNodes,
  currentStart,
  currentEnd,
  currentChanges
) => {

  let k = 0;
  /* istanbul ignore next */
  let minLen = futureChanges < currentChanges ? futureChanges : currentChanges;
  const link = Array(minLen++);
  const tresh = Array(minLen);
  tresh[0] = -1;

  for (let i = 1; i < minLen; i++)
    tresh[i] = currentEnd;

  const keymap = new _ungap_essential_map__WEBPACK_IMPORTED_MODULE_0__["default"];
  for (let i = currentStart; i < currentEnd; i++)
    keymap.set(currentNodes[i], i);

  for (let i = futureStart; i < futureEnd; i++) {
    const idxInOld = keymap.get(futureNodes[i]);
    if (idxInOld != null) {
      k = findK(tresh, minLen, idxInOld);
      /* istanbul ignore else */
      if (-1 < k) {
        tresh[k] = idxInOld;
        link[k] = {
          newi: i,
          oldi: idxInOld,
          prev: link[k - 1]
        };
      }
    }
  }

  k = --minLen;
  --currentEnd;
  while (tresh[k] > currentEnd) --k;

  minLen = currentChanges + futureChanges - k;
  const diff = Array(minLen);
  let ptr = link[k];
  --futureEnd;
  while (ptr) {
    const {newi, oldi} = ptr;
    while (futureEnd > newi) {
      diff[--minLen] = INSERTION;
      --futureEnd;
    }
    while (currentEnd > oldi) {
      diff[--minLen] = DELETION;
      --currentEnd;
    }
    diff[--minLen] = SKIP;
    --futureEnd;
    --currentEnd;
    ptr = ptr.prev;
  }
  while (futureEnd >= futureStart) {
    diff[--minLen] = INSERTION;
    --futureEnd;
  }
  while (currentEnd >= currentStart) {
    diff[--minLen] = DELETION;
    --currentEnd;
  }
  return diff;
};

// this is pretty much the same petit-dom code without the delete map part
// https://github.com/yelouafi/petit-dom/blob/bd6f5c919b5ae5297be01612c524c40be45f14a7/src/vdom.js#L556-L561
const OND = (
  futureNodes,
  futureStart,
  rows,
  currentNodes,
  currentStart,
  cols,
  compare
) => {
  const length = rows + cols;
  const v = [];
  let d, k, r, c, pv, cv, pd;
  outer: for (d = 0; d <= length; d++) {
    /* istanbul ignore if */
    if (d > SKIP_OND)
      return null;
    pd = d - 1;
    /* istanbul ignore next */
    pv = d ? v[d - 1] : [0, 0];
    cv = v[d] = [];
    for (k = -d; k <= d; k += 2) {
      if (k === -d || (k !== d && pv[pd + k - 1] < pv[pd + k + 1])) {
        c = pv[pd + k + 1];
      } else {
        c = pv[pd + k - 1] + 1;
      }
      r = c - k;
      while (
        c < cols &&
        r < rows &&
        compare(
          currentNodes[currentStart + c],
          futureNodes[futureStart + r]
        )
      ) {
        c++;
        r++;
      }
      if (c === cols && r === rows) {
        break outer;
      }
      cv[d + k] = c;
    }
  }

  const diff = Array(d / 2 + length / 2);
  let diffIdx = diff.length - 1;
  for (d = v.length - 1; d >= 0; d--) {
    while (
      c > 0 &&
      r > 0 &&
      compare(
        currentNodes[currentStart + c - 1],
        futureNodes[futureStart + r - 1]
      )
    ) {
      // diagonal edge = equality
      diff[diffIdx--] = SKIP;
      c--;
      r--;
    }
    if (!d)
      break;
    pd = d - 1;
    /* istanbul ignore next */
    pv = d ? v[d - 1] : [0, 0];
    k = c - r;
    if (k === -d || (k !== d && pv[pd + k - 1] < pv[pd + k + 1])) {
      // vertical edge = insertion
      r--;
      diff[diffIdx--] = INSERTION;
    } else {
      // horizontal edge = deletion
      c--;
      diff[diffIdx--] = DELETION;
    }
  }
  return diff;
};

const applyDiff = (
  diff,
  get,
  parentNode,
  futureNodes,
  futureStart,
  currentNodes,
  currentStart,
  currentLength,
  before
) => {
  const live = new _ungap_essential_map__WEBPACK_IMPORTED_MODULE_0__["default"];
  const length = diff.length;
  let currentIndex = currentStart;
  let i = 0;
  while (i < length) {
    switch (diff[i++]) {
      case SKIP:
        futureStart++;
        currentIndex++;
        break;
      case INSERTION:
        // TODO: bulk appends for sequential nodes
        live.set(futureNodes[futureStart], 1);
        append(
          get,
          parentNode,
          futureNodes,
          futureStart++,
          futureStart,
          currentIndex < currentLength ?
            get(currentNodes[currentIndex], 0) :
            before
        );
        break;
      case DELETION:
        currentIndex++;
        break;
    }
  }
  i = 0;
  while (i < length) {
    switch (diff[i++]) {
      case SKIP:
        currentStart++;
        break;
      case DELETION:
        // TODO: bulk removes for sequential nodes
        if (live.has(currentNodes[currentStart]))
          currentStart++;
        else
          remove(
            get,
            parentNode,
            currentNodes,
            currentStart++,
            currentStart
          );
        break;
    }
  }
};

const findK = (ktr, length, j) => {
  let lo = 1;
  let hi = length;
  while (lo < hi) {
    const mid = ((lo + hi) / 2) >>> 0;
    if (j < ktr[mid])
      hi = mid;
    else
      lo = mid + 1;
  }
  return lo;
}

const smartDiff = (
  get,
  parentNode,
  futureNodes,
  futureStart,
  futureEnd,
  futureChanges,
  currentNodes,
  currentStart,
  currentEnd,
  currentChanges,
  currentLength,
  compare,
  before
) => {
  applyDiff(
    OND(
      futureNodes,
      futureStart,
      futureChanges,
      currentNodes,
      currentStart,
      currentChanges,
      compare
    ) ||
    HS(
      futureNodes,
      futureStart,
      futureEnd,
      futureChanges,
      currentNodes,
      currentStart,
      currentEnd,
      currentChanges
    ),
    get,
    parentNode,
    futureNodes,
    futureStart,
    currentNodes,
    currentStart,
    currentLength,
    before
  );
};


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/*! (c) Andrea Giammarchi - ISC */
var self = undefined || /* istanbul ignore next */ {};
try { self.Map = Map; }
catch (Map) {
  self.Map = function Map() {
    var i = 0;
    var k = [];
    var v = [];
    return {
      delete: function (key) {
        var had = contains(key);
        if (had) {
          k.splice(i, 1);
          v.splice(i, 1);
        }
        return had;
      },
      forEach: function forEach(callback, context) {
        k.forEach(
          function (key, i)  {
            callback.call(context, v[i], key, this);
          },
          this
        );
      },
      get: function get(key) {
        return contains(key) ? v[i] : void 0;
      },
      has: function has(key) {
        return contains(key);
      },
      set: function set(key, value) {
        v[contains(key) ? i : (k.push(key) - 1)] = value;
        return this;
      }
    };
    function contains(v) {
      i = k.indexOf(v);
      return -1 < i;
    }
  };
}
/* harmony default export */ __webpack_exports__["default"] = (self.Map);


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Component; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setup", function() { return setup; });
/* harmony import */ var _ungap_custom_event__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(20);
/* harmony import */ var _ungap_essential_map__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18);
/* harmony import */ var _ungap_weakmap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(14);




// hyperHTML.Component is a very basic class
// able to create Custom Elements like components
// including the ability to listen to connect/disconnect
// events via onconnect/ondisconnect attributes
// Components can be created imperatively or declaratively.
// The main difference is that declared components
// will not automatically render on setState(...)
// to simplify state handling on render.
function Component() {
  return this; // this is needed in Edge !!!
}

// Component is lazily setup because it needs
// wire mechanism as lazy content
function setup(content) {
  // there are various weakly referenced variables in here
  // and mostly are to use Component.for(...) static method.
  const children = new _ungap_weakmap__WEBPACK_IMPORTED_MODULE_2__["default"];
  const create = Object.create;
  const createEntry = (wm, id, component) => {
    wm.set(id, component);
    return component;
  };
  const get = (Class, info, context, id) => {
    const relation = info.get(Class) || relate(Class, info);
    switch (typeof id) {
      case 'object':
      case 'function':
        const wm = relation.w || (relation.w = new _ungap_weakmap__WEBPACK_IMPORTED_MODULE_2__["default"]);
        return wm.get(id) || createEntry(wm, id, new Class(context));
      default:
        const sm = relation.p || (relation.p = create(null));
        return sm[id] || (sm[id] = new Class(context));
    }
  };
  const relate = (Class, info) => {
    const relation = {w: null, p: null};
    info.set(Class, relation);
    return relation;
  };
  const set = context => {
    const info = new _ungap_essential_map__WEBPACK_IMPORTED_MODULE_1__["default"];
    children.set(context, info);
    return info;
  };
  // The Component Class
  Object.defineProperties(
    Component,
    {
      // Component.for(context[, id]) is a convenient way
      // to automatically relate data/context to children components
      // If not created yet, the new Component(context) is weakly stored
      // and after that same instance would always be returned.
      for: {
        configurable: true,
        value(context, id) {
          return get(
            this,
            children.get(context) || set(context),
            context,
            id == null ?
              'default' : id
          );
        }
      }
    }
  );
  Object.defineProperties(
    Component.prototype,
    {
      // all events are handled with the component as context
      handleEvent: {value(e) {
        const ct = e.currentTarget;
        this[
          ('getAttribute' in ct && ct.getAttribute('data-call')) ||
          ('on' + e.type)
        ](e);
      }},
      // components will lazily define html or svg properties
      // as soon as these are invoked within the .render() method
      // Such render() method is not provided by the base class
      // but it must be available through the Component extend.
      // Declared components could implement a
      // render(props) method too and use props as needed.
      html: lazyGetter('html', content),
      svg: lazyGetter('svg', content),
      // the state is a very basic/simple mechanism inspired by Preact
      state: lazyGetter('state', function () { return this.defaultState; }),
      // it is possible to define a default state that'd be always an object otherwise
      defaultState: {get() { return {}; }},
      // dispatch a bubbling, cancelable, custom event
      // through the first known/available node
      dispatch: {value(type, detail) {
        const {_wire$} = this;
        if (_wire$) {
          const event = new _ungap_custom_event__WEBPACK_IMPORTED_MODULE_0__["default"](type, {
            bubbles: true,
            cancelable: true,
            detail
          });
          event.component = this;
          return (_wire$.dispatchEvent ?
                    _wire$ :
                    _wire$.firstChild
                  ).dispatchEvent(event);
        }
        return false;
      }},
      // setting some property state through a new object
      // or a callback, triggers also automatically a render
      // unless explicitly specified to not do so (render === false)
      setState: {value(state, render) {
        const target = this.state;
        const source = typeof state === 'function' ? state.call(this, target) : state;
        for (const key in source) target[key] = source[key];
        if (render !== false)
          this.render();
        return this;
      }}
    }
  );
}

// instead of a secret key I could've used a WeakMap
// However, attaching a property directly will result
// into better performance with thousands of components
// hanging around, and less memory pressure caused by the WeakMap
const lazyGetter = (type, fn) => {
  const secret = '_' + type + '$';
  return {
    get() {
      return this[secret] || setValue(this, secret, fn.call(this, type));
    },
    set(value) {
      setValue(this, secret, value);
    }
  };
};

// shortcut to set value on get or set(value)
const setValue = (self, secret, value) =>
  Object.defineProperty(self, secret, {
    configurable: true,
    value: typeof value === 'function' ?
      function () {
        return (self._wire$ = value.apply(this, arguments));
      } :
      value
  })[secret]
;

Object.defineProperties(
  Component.prototype,
  {
    // used to distinguish better than instanceof
    ELEMENT_NODE: {value: 1},
    nodeType: {value: -1}
  }
);


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/*! (c) Andrea Giammarchi - ISC */
var self = undefined || /* istanbul ignore next */ {};
self.CustomEvent = typeof CustomEvent === 'function' ?
  CustomEvent :
  (function (__p__) {
    CustomEvent[__p__] = new CustomEvent('').constructor[__p__];
    return CustomEvent;
    function CustomEvent(type, init) {
      if (!init) init = {};
      var e = document.createEvent('CustomEvent');
      e.initCustomEvent(type, !!init.bubbles, !!init.cancelable, init.detail);
      return e;
    }
  }('prototype'));
/* harmony default export */ __webpack_exports__["default"] = (self.CustomEvent);


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const attributes = {};
const intents = {};
const keys = [];
const hasOwnProperty = intents.hasOwnProperty;

let length = 0;

/* harmony default export */ __webpack_exports__["default"] = ({

  // used to invoke right away hyper:attributes
  attributes,

  // hyperHTML.define('intent', (object, update) => {...})
  // can be used to define a third parts update mechanism
  // when every other known mechanism failed.
  // hyper.define('user', info => info.name);
  // hyper(node)`<p>${{user}}</p>`;
  define: (intent, callback) => {
    if (intent.indexOf('-') < 0) {
      if (!(intent in intents)) {
        length = keys.push(intent);
      }
      intents[intent] = callback;
    } else {
      attributes[intent] = callback;
    }
  },

  // this method is used internally as last resort
  // to retrieve a value out of an object
  invoke: (object, callback) => {
    for (let i = 0; i < length; i++) {
      let key = keys[i];
      if (hasOwnProperty.call(object, key)) {
        return intents[key](object[key], callback);
      }
    }
  }
});


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Tagger", function() { return Tagger; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "observe", function() { return observe; });
/* harmony import */ var _ungap_custom_event__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(20);
/* harmony import */ var _ungap_essential_weakset__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(15);
/* harmony import */ var _ungap_is_array__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(23);
/* harmony import */ var _ungap_create_content__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(24);
/* harmony import */ var disconnected__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(25);
/* harmony import */ var domdiff__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(16);
/* harmony import */ var domtagger__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(26);
/* harmony import */ var hyperhtml_style__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(32);
/* harmony import */ var hyperhtml_wire__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(33);
/* harmony import */ var _shared_constants_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(34);
/* harmony import */ var _classes_Component_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(19);
/* harmony import */ var _Intent_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(21);
















const componentType = _classes_Component_js__WEBPACK_IMPORTED_MODULE_10__["default"].prototype.nodeType;
const wireType = hyperhtml_wire__WEBPACK_IMPORTED_MODULE_8__["default"].prototype.nodeType;

const observe = Object(disconnected__WEBPACK_IMPORTED_MODULE_4__["default"])({Event: _ungap_custom_event__WEBPACK_IMPORTED_MODULE_0__["default"], WeakSet: _ungap_essential_weakset__WEBPACK_IMPORTED_MODULE_1__["default"]});



// returns an intent to explicitly inject content as html
const asHTML = html => ({html});

// returns nodes from wires and components
const asNode = (item, i) => {
  switch (item.nodeType) {
    case wireType:
      // in the Wire case, the content can be
      // removed, post-pended, inserted, or pre-pended and
      // all these cases are handled by domdiff already
      /* istanbul ignore next */
      return (1 / i) < 0 ?
        (i ? item.remove(true) : item.lastChild) :
        (i ? item.valueOf(true) : item.firstChild);
    case componentType:
      return asNode(item.render(), i);
    default:
      return item;
  }
}

// returns true if domdiff can handle the value
const canDiff = value => 'ELEMENT_NODE' in value;

// when a Promise is used as interpolation value
// its result must be parsed once resolved.
// This callback is in charge of understanding what to do
// with a returned value once the promise is resolved.
const invokeAtDistance = (value, callback) => {
  callback(value.placeholder);
  if ('text' in value) {
    Promise.resolve(value.text).then(String).then(callback);
  } else if ('any' in value) {
    Promise.resolve(value.any).then(callback);
  } else if ('html' in value) {
    Promise.resolve(value.html).then(asHTML).then(callback);
  } else {
    Promise.resolve(_Intent_js__WEBPACK_IMPORTED_MODULE_11__["default"].invoke(value, callback)).then(callback);
  }
};

// quick and dirty way to check for Promise/ish values
const isPromise_ish = value => value != null && 'then' in value;

// list of attributes that should not be directly assigned
const readOnly = /^(?:form|list)$/i;

// reused every slice time
const slice = [].slice;

// simplifies text node creation
const text = (node, text) => node.ownerDocument.createTextNode(text);

function Tagger(type) {
  this.type = type;
  return Object(domtagger__WEBPACK_IMPORTED_MODULE_6__["default"])(this);
}

Tagger.prototype = {

  // there are four kind of attributes, and related behavior:
  //  * events, with a name starting with `on`, to add/remove event listeners
  //  * special, with a name present in their inherited prototype, accessed directly
  //  * regular, accessed through get/setAttribute standard DOM methods
  //  * style, the only regular attribute that also accepts an object as value
  //    so that you can style=${{width: 120}}. In this case, the behavior has been
  //    fully inspired by Preact library and its simplicity.
  attribute(node, name, original) {
    const isSVG = _shared_constants_js__WEBPACK_IMPORTED_MODULE_9__["OWNER_SVG_ELEMENT"] in node;
    let oldValue;
    // if the attribute is the style one
    // handle it differently from others
    if (name === 'style')
      return Object(hyperhtml_style__WEBPACK_IMPORTED_MODULE_7__["default"])(node, original, isSVG);
    // the name is an event one,
    // add/remove event listeners accordingly
    else if (/^on/.test(name)) {
      let type = name.slice(2);
      if (type === _shared_constants_js__WEBPACK_IMPORTED_MODULE_9__["CONNECTED"] || type === _shared_constants_js__WEBPACK_IMPORTED_MODULE_9__["DISCONNECTED"]) {
        observe(node);
      }
      else if (name.toLowerCase()
        in node) {
        type = type.toLowerCase();
      }
      return newValue => {
        if (oldValue !== newValue) {
          if (oldValue)
            node.removeEventListener(type, oldValue, false);
          oldValue = newValue;
          if (newValue)
            node.addEventListener(type, newValue, false);
        }
      };
    }
    // the attribute is special ('value' in input)
    // and it's not SVG *or* the name is exactly data,
    // in this case assign the value directly
    else if (
      name === 'data' ||
      (!isSVG && name in node && !readOnly.test(name))
    ) {
      return newValue => {
        if (oldValue !== newValue) {
          oldValue = newValue;
          if (node[name] !== newValue && newValue == null) {
            // cleanup on null to avoid silly IE/Edge bug
            node[name] = '';
            node.removeAttribute(name);
          }
          else
            node[name] = newValue;
        }
      };
    }
    else if (name in _Intent_js__WEBPACK_IMPORTED_MODULE_11__["default"].attributes) {
      oldValue;
      return any => {
        const newValue = _Intent_js__WEBPACK_IMPORTED_MODULE_11__["default"].attributes[name](node, any);
        if (oldValue !== newValue) {
          oldValue = newValue;
          if (newValue == null)
            node.removeAttribute(name);
          else
            node.setAttribute(name, newValue);
        }
      };
    }
    // in every other case, use the attribute node as it is
    // update only the value, set it as node only when/if needed
    else {
      let owner = false;
      const attribute = original.cloneNode(true);
      return newValue => {
        if (oldValue !== newValue) {
          oldValue = newValue;
          if (attribute.value !== newValue) {
            if (newValue == null) {
              if (owner) {
                owner = false;
                node.removeAttributeNode(attribute);
              }
              attribute.value = newValue;
            } else {
              attribute.value = newValue;
              if (!owner) {
                owner = true;
                node.setAttributeNode(attribute);
              }
            }
          }
        }
      };
    }
  },

  // in a hyper(node)`<div>${content}</div>` case
  // everything could happen:
  //  * it's a JS primitive, stored as text
  //  * it's null or undefined, the node should be cleaned
  //  * it's a component, update the content by rendering it
  //  * it's a promise, update the content once resolved
  //  * it's an explicit intent, perform the desired operation
  //  * it's an Array, resolve all values if Promises and/or
  //    update the node with the resulting list of content
  any(node, childNodes) {
    const diffOptions = {node: asNode, before: node};
    const nodeType = _shared_constants_js__WEBPACK_IMPORTED_MODULE_9__["OWNER_SVG_ELEMENT"] in node ? /* istanbul ignore next */ 'svg' : 'html';
    let fastPath = false;
    let oldValue;
    const anyContent = value => {
      switch (typeof value) {
        case 'string':
        case 'number':
        case 'boolean':
          if (fastPath) {
            if (oldValue !== value) {
              oldValue = value;
              childNodes[0].textContent = value;
            }
          } else {
            fastPath = true;
            oldValue = value;
            childNodes = Object(domdiff__WEBPACK_IMPORTED_MODULE_5__["default"])(
              node.parentNode,
              childNodes,
              [text(node, value)],
              diffOptions
            );
          }
          break;
        case 'function':
          anyContent(value(node));
          break;
        case 'object':
        case 'undefined':
          if (value == null) {
            fastPath = false;
            childNodes = Object(domdiff__WEBPACK_IMPORTED_MODULE_5__["default"])(
              node.parentNode,
              childNodes,
              [],
              diffOptions
            );
            break;
          }
        default:
          fastPath = false;
          oldValue = value;
          if (Object(_ungap_is_array__WEBPACK_IMPORTED_MODULE_2__["default"])(value)) {
            if (value.length === 0) {
              if (childNodes.length) {
                childNodes = Object(domdiff__WEBPACK_IMPORTED_MODULE_5__["default"])(
                  node.parentNode,
                  childNodes,
                  [],
                  diffOptions
                );
              }
            } else {
              switch (typeof value[0]) {
                case 'string':
                case 'number':
                case 'boolean':
                  anyContent({html: value});
                  break;
                case 'object':
                  if (Object(_ungap_is_array__WEBPACK_IMPORTED_MODULE_2__["default"])(value[0])) {
                    value = value.concat.apply([], value);
                  }
                  if (isPromise_ish(value[0])) {
                    Promise.all(value).then(anyContent);
                    break;
                  }
                default:
                  childNodes = Object(domdiff__WEBPACK_IMPORTED_MODULE_5__["default"])(
                    node.parentNode,
                    childNodes,
                    value,
                    diffOptions
                  );
                  break;
              }
            }
          } else if (canDiff(value)) {
            childNodes = Object(domdiff__WEBPACK_IMPORTED_MODULE_5__["default"])(
              node.parentNode,
              childNodes,
              value.nodeType === _shared_constants_js__WEBPACK_IMPORTED_MODULE_9__["DOCUMENT_FRAGMENT_NODE"] ?
                slice.call(value.childNodes) :
                [value],
              diffOptions
            );
          } else if (isPromise_ish(value)) {
            value.then(anyContent);
          } else if ('placeholder' in value) {
            invokeAtDistance(value, anyContent);
          } else if ('text' in value) {
            anyContent(String(value.text));
          } else if ('any' in value) {
            anyContent(value.any);
          } else if ('html' in value) {
            childNodes = Object(domdiff__WEBPACK_IMPORTED_MODULE_5__["default"])(
              node.parentNode,
              childNodes,
              slice.call(
                Object(_ungap_create_content__WEBPACK_IMPORTED_MODULE_3__["default"])(
                  [].concat(value.html).join(''),
                  nodeType
                ).childNodes
              ),
              diffOptions
            );
          } else if ('length' in value) {
            anyContent(slice.call(value));
          } else {
            anyContent(_Intent_js__WEBPACK_IMPORTED_MODULE_11__["default"].invoke(value, anyContent));
          }
          break;
      }
    };
    return anyContent;
  },

  // style or textareas don't accept HTML as content
  // it's pointless to transform or analyze anything
  // different from text there but it's worth checking
  // for possible defined intents.
  text(node) {
    let oldValue;
    const textContent = value => {
      if (oldValue !== value) {
        oldValue = value;
        const type = typeof value;
        if (type === 'object' && value) {
          if (isPromise_ish(value)) {
            value.then(textContent);
          } else if ('placeholder' in value) {
            invokeAtDistance(value, textContent);
          } else if ('text' in value) {
            textContent(String(value.text));
          } else if ('any' in value) {
            textContent(value.any);
          } else if ('html' in value) {
            textContent([].concat(value.html).join(''));
          } else if ('length' in value) {
            textContent(slice.call(value).join(''));
          } else {
            textContent(_Intent_js__WEBPACK_IMPORTED_MODULE_11__["default"].invoke(value, textContent));
          }
        } else if (type === 'function') {
          textContent(value(node));
        } else {
          node.textContent = value == null ? '' : value;
        }
      }
    };
    return textContent;
  }
};


/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var isArray = Array.isArray || (function (toString) {
  var $ = toString.call([]);
  return function isArray(object) {
    return toString.call(object) === $;
  };
}({}.toString));
/* harmony default export */ __webpack_exports__["default"] = (isArray);


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/*! (c) Andrea Giammarchi - ISC */
var createContent = (function (document) {'use strict';
  var FRAGMENT = 'fragment';
  var TEMPLATE = 'template';
  var HAS_CONTENT = 'content' in create(TEMPLATE);

  var createHTML = HAS_CONTENT ?
    function (html) {
      var template = create(TEMPLATE);
      template.innerHTML = html;
      return template.content;
    } :
    function (html) {
      var content = create(FRAGMENT);
      var template = create(TEMPLATE);
      var childNodes = null;
      if (/^[^\S]*?<(col(?:group)?|t(?:head|body|foot|r|d|h))/i.test(html)) {
        var selector = RegExp.$1;
        template.innerHTML = '<table>' + html + '</table>';
        childNodes = template.querySelectorAll(selector);
      } else {
        template.innerHTML = html;
        childNodes = template.childNodes;
      }
      append(content, childNodes);
      return content;
    };

  return function createContent(markup, type) {
    return (type === 'svg' ? createSVG : createHTML)(markup);
  };

  function append(root, childNodes) {
    var length = childNodes.length;
    while (length--)
      root.appendChild(childNodes[0]);
  }

  function create(element) {
    return element === FRAGMENT ?
      document.createDocumentFragment() :
      document.createElementNS('http://www.w3.org/1999/xhtml', element);
  }

  // it could use createElementNS when hasNode is there
  // but this fallback is equally fast and easier to maintain
  // it is also battle tested already in all IE
  function createSVG(svg) {
    var content = create(FRAGMENT);
    var template = create('div');
    template.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + svg + '</svg>';
    append(content, template.firstChild.childNodes);
    return content;
  }

}(document));
/* harmony default export */ __webpack_exports__["default"] = (createContent);


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/*! (c) Andrea Giammarchi */
function disconnected(poly) {'use strict';
  var Event = poly.Event;
  var WeakSet = poly.WeakSet;
  var notObserving = true;
  var observer = null;
  return function observe(node) {
    if (notObserving) {
      notObserving = !notObserving;
      observer = new WeakSet;
      startObserving(node.ownerDocument);
    }
    observer.add(node);
    return node;
  };
  function startObserving(document) {
    var connected = new WeakSet;
    var disconnected = new WeakSet;
    try {
      (new MutationObserver(changes)).observe(
        document,
        {subtree: true, childList: true}
      );
    }
    catch(o_O) {
      var timer = 0;
      var records = [];
      var reschedule = function (record) {
        records.push(record);
        clearTimeout(timer);
        timer = setTimeout(
          function () {
            changes(records.splice(timer = 0, records.length));
          },
          0
        );
      };
      document.addEventListener(
        'DOMNodeRemoved',
        function (event) {
          reschedule({addedNodes: [], removedNodes: [event.target]});
        },
        true
      );
      document.addEventListener(
        'DOMNodeInserted',
        function (event) {
          reschedule({addedNodes: [event.target], removedNodes: []});
        },
        true
      );
    }
    function changes(records) {
      for (var
        record,
        length = records.length,
        i = 0; i < length; i++
      ) {
        record = records[i];
        dispatchAll(record.removedNodes, 'disconnected', disconnected, connected);
        dispatchAll(record.addedNodes, 'connected', connected, disconnected);
      }
    }
    function dispatchAll(nodes, type, wsin, wsout) {
      for (var
        node,
        event = new Event(type),
        length = nodes.length,
        i = 0; i < length;
        (node = nodes[i++]).nodeType === 1 &&
        dispatchTarget(node, event, type, wsin, wsout)
      );
    }
    function dispatchTarget(node, event, type, wsin, wsout) {
      if (observer.has(node) && !wsin.has(node)) {
        wsout.delete(node);
        wsin.add(node);
        node.dispatchEvent(event);
        /*
        // The event is not bubbling (perf reason: should it?),
        // hence there's no way to know if
        // stop/Immediate/Propagation() was called.
        // Should DOM Level 0 work at all?
        // I say it's a YAGNI case for the time being,
        // and easy to implement in user-land.
        if (!event.cancelBubble) {
          var fn = node['on' + type];
          if (fn)
            fn.call(node, event);
        }
        */
      }
      for (var
        // apparently is node.children || IE11 ... ^_^;;
        // https://github.com/WebReflection/disconnected/issues/1
        children = node.children || [],
        length = children.length,
        i = 0; i < length;
        dispatchTarget(children[i++], event, type, wsin, wsout)
      );
    }
  }
}
/* harmony default export */ __webpack_exports__["default"] = (disconnected);


/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ungap_weakmap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
/* harmony import */ var _ungap_create_content__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(24);
/* harmony import */ var _ungap_import_node__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(27);
/* harmony import */ var _ungap_trim__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(28);
/* harmony import */ var domsanitizer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(29);
/* harmony import */ var _walker_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(31);
// globals


// utils





// local


// the domtagger 🎉
/* harmony default export */ __webpack_exports__["default"] = (domtagger);

var parsed = new _ungap_weakmap__WEBPACK_IMPORTED_MODULE_0__["default"];
var referenced = new _ungap_weakmap__WEBPACK_IMPORTED_MODULE_0__["default"];

function createInfo(options, template) {
  var markup = Object(domsanitizer__WEBPACK_IMPORTED_MODULE_4__["default"])(template);
  var transform = options.transform;
  if (transform)
    markup = transform(markup);
  var content = Object(_ungap_create_content__WEBPACK_IMPORTED_MODULE_1__["default"])(markup, options.type);
  cleanContent(content);
  var holes = [];
  Object(_walker_js__WEBPACK_IMPORTED_MODULE_5__["parse"])(content, holes, template.slice(0), []);
  var info = {
    content: content,
    updates: function (content) {
      var updates = [];
      var len = holes.length;
      var i = 0;
      var off = 0;
      while (i < len) {
        var info = holes[i++];
        var node = Object(_walker_js__WEBPACK_IMPORTED_MODULE_5__["find"])(content, info.path);
        switch (info.type) {
          case 'any':
            updates.push({fn: options.any(node, []), sparse: false});
            break;
          case 'attr':
            var sparse = info.sparse;
            var fn = options.attribute(node, info.name, info.node);
            if (sparse === null)
              updates.push({fn: fn, sparse: false});
            else {
              off += sparse.length - 2;
              updates.push({fn: fn, sparse: true, values: sparse});
            }
            break;
          case 'text':
            updates.push({fn: options.text(node), sparse: false});
            node.textContent = '';
            break;
        }
      }
      len += off;
      return function () {
        var length = arguments.length;
        if (len !== (length - 1)) {
          throw new Error(
            (length - 1) + ' values instead of ' + len + '\n' +
            template.join('${value}')
          );
        }
        var i = 1;
        var off = 1;
        while (i < length) {
          var update = updates[i - off];
          if (update.sparse) {
            var values = update.values;
            var value = values[0];
            var j = 1;
            var l = values.length;
            off += l - 2;
            while (j < l)
              value += arguments[i++] + values[j++];
            update.fn(value);
          }
          else
            update.fn(arguments[i++]);
        }
        return content;
      };
    }
  };
  parsed.set(template, info);
  return info;
}

function createDetails(options, template) {
  var info = parsed.get(template) || createInfo(options, template);
  var content = _ungap_import_node__WEBPACK_IMPORTED_MODULE_2__["default"].call(document, info.content, true);
  var details = {
    content: content,
    template: template,
    updates: info.updates(content)
  };
  referenced.set(options, details);
  return details;
}

function domtagger(options) {
  return function (template) {
    var details = referenced.get(options);
    if (details == null || details.template !== template)
      details = createDetails(options, template);
    details.updates.apply(null, arguments);
    return details.content;
  };
}

function cleanContent(fragment) {
  var childNodes = fragment.childNodes;
  var i = childNodes.length;
  while (i--) {
    var child = childNodes[i];
    if (
      child.nodeType !== 1 &&
      _ungap_trim__WEBPACK_IMPORTED_MODULE_3__["default"].call(child.textContent).length === 0
    ) {
      fragment.removeChild(child);
    }
  }
}


/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/*! (c) Andrea Giammarchi - ISC */
var importNode = (function (
  document,
  appendChild,
  cloneNode,
  createTextNode,
  importNode
) {
  var native = importNode in document;
  // IE 11 has problems with cloning templates:
  // it "forgets" empty childNodes. This feature-detects that.
  var fragment = document.createDocumentFragment();
  fragment[appendChild](document[createTextNode]('g'));
  fragment[appendChild](document[createTextNode](''));
  var content = native ?
    document[importNode](fragment, true) :
    fragment[cloneNode](true);
  return content.childNodes.length < 2 ?
    function importNode(node, deep) {
      var clone = node[cloneNode]();
      for (var
        childNodes = node.childNodes || [],
        length = childNodes.length,
        i = 0; deep && i < length; i++
      ) {
        clone[appendChild](importNode(childNodes[i], deep));
      }
      return clone;
    } :
    (native ?
      document[importNode] :
      function (node, deep) {
        return node[cloneNode](!!deep);
      }
    );
}(
  document,
  'appendChild',
  'cloneNode',
  'createTextNode',
  'importNode'
));
/* harmony default export */ __webpack_exports__["default"] = (importNode);


/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var trim = ''.trim || function () {
  return String(this).replace(/^\s+|\s+/g, '');
};
/* harmony default export */ __webpack_exports__["default"] = (trim);


/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var domconstants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(30);
/*! (c) Andrea Giammarchi - ISC */



/* harmony default export */ __webpack_exports__["default"] = (function (template) {
  return template.join(domconstants__WEBPACK_IMPORTED_MODULE_0__["UIDC"])
          .replace(selfClosing, fullClosing)
          .replace(attrSeeker, attrReplacer);
});

var spaces = ' \\f\\n\\r\\t';
var almostEverything = '[^' + spaces + '\\/>"\'=]+';
var attrName = '[' + spaces + ']+' + almostEverything;
var tagName = '<([A-Za-z]+[A-Za-z0-9:._-]*)((?:';
var attrPartials = '(?:\\s*=\\s*(?:\'[^\']*?\'|"[^"]*?"|<[^>]*?>|' + almostEverything.replace('\\/', '') + '))?)';

var attrSeeker = new RegExp(tagName + attrName + attrPartials + '+)([' + spaces + ']*/?>)', 'g');
var selfClosing = new RegExp(tagName + attrName + attrPartials + '*)([' + spaces + ']*/>)', 'g');
var findAttributes = new RegExp('(' + attrName + '\\s*=\\s*)([\'"]?)' + domconstants__WEBPACK_IMPORTED_MODULE_0__["UIDC"] + '\\2', 'gi');

function attrReplacer($0, $1, $2, $3) {
  return '<' + $1 + $2.replace(findAttributes, replaceAttributes) + $3;
}

function replaceAttributes($0, $1, $2) {
  return $1 + ($2 || '"') + domconstants__WEBPACK_IMPORTED_MODULE_0__["UID"] + ($2 || '"');
}

function fullClosing($0, $1, $2) {
  return domconstants__WEBPACK_IMPORTED_MODULE_0__["VOID_ELEMENTS"].test($1) ? $0 : ('<' + $1 + $2 + '></' + $1 + '>');
}


/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UID", function() { return UID; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UIDC", function() { return UIDC; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UID_IE", function() { return UID_IE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COMMENT_NODE", function() { return COMMENT_NODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DOCUMENT_FRAGMENT_NODE", function() { return DOCUMENT_FRAGMENT_NODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ELEMENT_NODE", function() { return ELEMENT_NODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TEXT_NODE", function() { return TEXT_NODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SHOULD_USE_TEXT_CONTENT", function() { return SHOULD_USE_TEXT_CONTENT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VOID_ELEMENTS", function() { return VOID_ELEMENTS; });
/*! (c) Andrea Giammarchi - ISC */

// Custom
var UID = '-' + Math.random().toFixed(6) + '%';
//                           Edge issue!

var UID_IE = false;

try {
  if (!(function (template, content, tabindex) {
    return content in template && (
      (template.innerHTML = '<p ' + tabindex + '="' + UID + '"></p>'),
      template[content].childNodes[0].getAttribute(tabindex) == UID
    );
  }(document.createElement('template'), 'content', 'tabindex'))) {
    UID = '_dt: ' + UID.slice(1, -1) + ';';
    UID_IE = true;
  }
} catch(meh) {}

var UIDC = '<!--' + UID + '-->';

// DOM
var COMMENT_NODE = 8;
var DOCUMENT_FRAGMENT_NODE = 11;
var ELEMENT_NODE = 1;
var TEXT_NODE = 3;

var SHOULD_USE_TEXT_CONTENT = /^(?:style|textarea)$/i;
var VOID_ELEMENTS = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;




/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "find", function() { return find; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parse", function() { return parse; });
/* harmony import */ var _ungap_essential_map__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18);
/* harmony import */ var _ungap_trim__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(28);
/* harmony import */ var domconstants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(30);







function find(node, path) {
  var length = path.length;
  var i = 0;
  while (i < length)
    node = node.childNodes[path[i++]];
  return node;
}

function parse(node, holes, parts, path) {
  var childNodes = node.childNodes;
  var length = childNodes.length;
  var i = 0;
  while (i < length) {
    var child = childNodes[i];
    switch (child.nodeType) {
      case domconstants__WEBPACK_IMPORTED_MODULE_2__["ELEMENT_NODE"]:
        var childPath = path.concat(i);
        parseAttributes(child, holes, parts, childPath);
        parse(child, holes, parts, childPath);
        break;
      case domconstants__WEBPACK_IMPORTED_MODULE_2__["COMMENT_NODE"]:
        var textContent = child.textContent;
        if (textContent === domconstants__WEBPACK_IMPORTED_MODULE_2__["UID"]) {
          parts.shift();
          holes.push(
            // basicHTML or other non standard engines
            // might end up having comments in nodes
            // where they shouldn't, hence this check.
            domconstants__WEBPACK_IMPORTED_MODULE_2__["SHOULD_USE_TEXT_CONTENT"].test(node.nodeName) ?
              Text(node, path) :
              Any(child, path.concat(i))
          );
        } else {
          switch (textContent.slice(0, 2)) {
            case '/*':
              if (textContent.slice(-2) !== '*/')
                break;
            case '\uD83D\uDC7B': // ghost
              node.removeChild(child);
              i--;
              length--;
          }
        }
        break;
      case domconstants__WEBPACK_IMPORTED_MODULE_2__["TEXT_NODE"]:
        // the following ignore is actually covered by browsers
        // only basicHTML ends up on previous COMMENT_NODE case
        // instead of TEXT_NODE because it knows nothing about
        // special style or textarea behavior
        /* istanbul ignore if */
        if (
          domconstants__WEBPACK_IMPORTED_MODULE_2__["SHOULD_USE_TEXT_CONTENT"].test(node.nodeName) &&
          _ungap_trim__WEBPACK_IMPORTED_MODULE_1__["default"].call(child.textContent) === domconstants__WEBPACK_IMPORTED_MODULE_2__["UIDC"]
        ) {
          parts.shift();
          holes.push(Text(node, path));
        }
        break;
    }
    i++;
  }
}

function parseAttributes(node, holes, parts, path) {
  var cache = new _ungap_essential_map__WEBPACK_IMPORTED_MODULE_0__["default"];
  var attributes = node.attributes;
  var remove = [];
  var array = remove.slice.call(attributes, 0);
  var length = array.length;
  var i = 0;
  while (i < length) {
    var attribute = array[i++];
    var direct = attribute.value === domconstants__WEBPACK_IMPORTED_MODULE_2__["UID"];
    var sparse;
    if (direct || 1 < (sparse = attribute.value.split(domconstants__WEBPACK_IMPORTED_MODULE_2__["UIDC"])).length) {
      var name = attribute.name;
      // the following ignore is covered by IE
      // and the IE9 double viewBox test
      /* istanbul ignore else */
      if (!cache.has(name)) {
        var realName = parts.shift().replace(
          direct ?
            /^(?:|[\S\s]*?\s)(\S+?)\s*=\s*('|")?$/ :
            new RegExp(
              '^(?:|[\\S\\s]*?\\s)(' + name + ')\\s*=\\s*(\'|")',
              'i'
            ),
            '$1'
        );
        var value = attributes[realName] ||
                      // the following ignore is covered by browsers
                      // while basicHTML is already case-sensitive
                      /* istanbul ignore next */
                      attributes[realName.toLowerCase()];
        cache.set(name, value);
        if (direct)
          holes.push(Attr(value, path, realName, null));
        else {
          var skip = sparse.length - 2;
          while (skip--)
            parts.shift();
          holes.push(Attr(value, path, realName, sparse));
        }
      }
      remove.push(attribute);
    }
  }
  length = remove.length;
  i = 0;
  while (i < length) {
    // Edge HTML bug #16878726
    var attr = remove[i++];
    if (/^id$/i.test(attr.name))
      node.removeAttribute(attr.name);
    // standard browsers would work just fine here
    else
      node.removeAttributeNode(attr);
  }

  // This is a very specific Firefox/Safari issue
  // but since it should be a not so common pattern,
  // it's probably worth patching regardless.
  // Basically, scripts created through strings are death.
  // You need to create fresh new scripts instead.
  // TODO: is there any other node that needs such nonsense?
  var nodeName = node.nodeName;
  if (/^script$/i.test(nodeName)) {
    // this used to be like that
    // var script = createElement(node, nodeName);
    // then Edge arrived and decided that scripts created
    // through template documents aren't worth executing
    // so it became this ... hopefully it won't hurt in the wild
    var script = document.createElement(nodeName);
    length = attributes.length;
    i = 0;
    while (i < length)
      script.setAttributeNode(attributes[i++].cloneNode(true));
    script.textContent = node.textContent;
    node.parentNode.replaceChild(script, node);
  }
}

function Any(node, path) {
  return {
    type: 'any',
    node: node,
    path: path
  };
}

function Attr(node, path, name, sparse) {
  return {
    type: 'attr',
    node: node,
    path: path,
    name: name,
    sparse: sparse
  };
}

function Text(node, path) {
  return {
    type: 'text',
    node: node,
    path: path
  };
}


/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/*! (c) Andrea Giammarchi - ISC */
var hyperStyle = (function (){'use strict';
  // from https://github.com/developit/preact/blob/33fc697ac11762a1cb6e71e9847670d047af7ce5/src/varants.js
  var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
  var hyphen = /([^A-Z])([A-Z]+)/g;
  return function hyperStyle(node, original) {
    return 'ownerSVGElement' in node ? svg(node, original) : update(node.style, false);
  };
  function ized($0, $1, $2) {
    return $1 + '-' + $2.toLowerCase();
  }
  function svg(node, original) {
    var style;
    if (original)
      style = original.cloneNode(true);
    else {
      node.setAttribute('style', '--hyper:style;');
      style = node.getAttributeNode('style');
    }
    style.value = '';
    node.setAttributeNode(style);
    return update(style, true);
  }
  function toStyle(object) {
    var key, css = [];
    for (key in object)
      css.push(key.replace(hyphen, ized), ':', object[key], ';');
    return css.join('');
  }
  function update(style, isSVG) {
    var oldType, oldValue;
    return function (newValue) {
      var info, key, styleValue, value;
      switch (typeof newValue) {
        case 'object':
          if (newValue) {
            if (oldType === 'object') {
              if (!isSVG) {
                if (oldValue !== newValue) {
                  for (key in oldValue) {
                    if (!(key in newValue)) {
                      style[key] = '';
                    }
                  }
                }
              }
            } else {
              if (isSVG)
                style.value = '';
              else
                style.cssText = '';
            }
            info = isSVG ? {} : style;
            for (key in newValue) {
              value = newValue[key];
              styleValue = typeof value === 'number' &&
                                  !IS_NON_DIMENSIONAL.test(key) ?
                                  (value + 'px') : value;
              if (!isSVG && /^--/.test(key))
                info.setProperty(key, styleValue);
              else
                info[key] = styleValue;
            }
            oldType = 'object';
            if (isSVG)
              style.value = toStyle((oldValue = info));
            else
              oldValue = newValue;
            break;
          }
        default:
          if (oldValue != newValue) {
            oldType = 'string';
            oldValue = newValue;
            if (isSVG)
              style.value = newValue || '';
            else
              style.cssText = newValue || '';
          }
          break;
      }
    };
  }
}());
/* harmony default export */ __webpack_exports__["default"] = (hyperStyle);


/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/*! (c) Andrea Giammarchi - ISC */
var Wire = (function (slice, proto) {

  proto = Wire.prototype;

  proto.ELEMENT_NODE = 1;
  proto.nodeType = 111;

  proto.remove = function (keepFirst) {
    var childNodes = this.childNodes;
    var first = this.firstChild;
    var last = this.lastChild;
    this._ = null;
    if (keepFirst && childNodes.length === 2) {
      last.parentNode.removeChild(last);
    } else {
      var range = this.ownerDocument.createRange();
      range.setStartBefore(keepFirst ? childNodes[1] : first);
      range.setEndAfter(last);
      range.deleteContents();
    }
    return first;
  };

  proto.valueOf = function (forceAppend) {
    var fragment = this._;
    var noFragment = fragment == null;
    if (noFragment)
      fragment = (this._ = this.ownerDocument.createDocumentFragment());
    if (noFragment || forceAppend) {
      for (var n = this.childNodes, i = 0, l = n.length; i < l; i++)
        fragment.appendChild(n[i]);
    }
    return fragment;
  };

  return Wire;

  function Wire(childNodes) {
    var nodes = (this.childNodes = slice.call(childNodes, 0));
    this.firstChild = nodes[0];
    this.lastChild = nodes[nodes.length - 1];
    this.ownerDocument = nodes[0].ownerDocument;
    this._ = null;
  }

}([].slice));
/* harmony default export */ __webpack_exports__["default"] = (Wire);


/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ELEMENT_NODE", function() { return ELEMENT_NODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DOCUMENT_FRAGMENT_NODE", function() { return DOCUMENT_FRAGMENT_NODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OWNER_SVG_ELEMENT", function() { return OWNER_SVG_ELEMENT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CONNECTED", function() { return CONNECTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DISCONNECTED", function() { return DISCONNECTED; });
// Node.CONSTANTS
// 'cause some engine has no global Node defined
// (i.e. Node, NativeScript, basicHTML ... )
const ELEMENT_NODE = 1;
const DOCUMENT_FRAGMENT_NODE = 11;

// SVG related constants
const OWNER_SVG_ELEMENT = 'ownerSVGElement';

// Custom Elements / MutationObserver constants
const CONNECTED = 'connected';
const DISCONNECTED = 'dis' + CONNECTED;


/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "content", function() { return content; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "weakly", function() { return weakly; });
/* harmony import */ var _ungap_weakmap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
/* harmony import */ var _ungap_template_tag_arguments__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(36);
/* harmony import */ var hyperhtml_wire__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(33);
/* harmony import */ var _objects_Updates_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(22);







// all wires used per each context
const wires = new _ungap_weakmap__WEBPACK_IMPORTED_MODULE_0__["default"];

// A wire is a callback used as tag function
// to lazily relate a generic object to a template literal.
// hyper.wire(user)`<div id=user>${user.name}</div>`; => the div#user
// This provides the ability to have a unique DOM structure
// related to a unique JS object through a reusable template literal.
// A wire can specify a type, as svg or html, and also an id
// via html:id or :id convention. Such :id allows same JS objects
// to be associated to different DOM structures accordingly with
// the used template literal without losing previously rendered parts.
const wire = (obj, type) => obj == null ?
  content(type || 'html') :
  weakly(obj, type || 'html');

// A wire content is a virtual reference to one or more nodes.
// It's represented by either a DOM node, or an Array.
// In both cases, the wire content role is to simply update
// all nodes through the list of related callbacks.
// In few words, a wire content is like an invisible parent node
// in charge of updating its content like a bound element would do.
const content = type => {
  let wire, tagger, template;
  return function () {
    const args = _ungap_template_tag_arguments__WEBPACK_IMPORTED_MODULE_1__["default"].apply(null, arguments);
    if (template !== args[0]) {
      template = args[0];
      tagger = new _objects_Updates_js__WEBPACK_IMPORTED_MODULE_3__["Tagger"](type);
      wire = wireContent(tagger.apply(tagger, args));
    } else {
      tagger.apply(tagger, args);
    }
    return wire;
  };
};

// wires are weakly created through objects.
// Each object can have multiple wires associated
// and this is thanks to the type + :id feature.
const weakly = (obj, type) => {
  const i = type.indexOf(':');
  let wire = wires.get(obj);
  let id = type;
  if (-1 < i) {
    id = type.slice(i + 1);
    type = type.slice(0, i) || 'html';
  }
  if (!wire)
    wires.set(obj, wire = {});
  return wire[id] || (wire[id] = content(type));
};

// A document fragment loses its nodes 
// as soon as it is appended into another node.
// This has the undesired effect of losing wired content
// on a second render call, because (by then) the fragment would be empty:
// no longer providing access to those sub-nodes that ultimately need to
// stay associated with the original interpolation.
// To prevent hyperHTML from forgetting about a fragment's sub-nodes,
// fragments are instead returned as an Array of nodes or, if there's only one entry,
// as a single referenced node which, unlike fragments, will indeed persist
// wire content throughout multiple renderings.
// The initial fragment, at this point, would be used as unique reference to this
// array of nodes or to this single referenced node.
const wireContent = node => {
  const childNodes = node.childNodes;
  const {length} = childNodes;
  return length === 1 ?
    childNodes[0] :
    (length ? new hyperhtml_wire__WEBPACK_IMPORTED_MODULE_2__["default"](childNodes) : node);
};


/* harmony default export */ __webpack_exports__["default"] = (wire);


/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ungap_template_literal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(37);


/* harmony default export */ __webpack_exports__["default"] = (function (template) {
  var length = arguments.length;
  var args = [Object(_ungap_template_literal__WEBPACK_IMPORTED_MODULE_0__["default"])(template)];
  var i = 1;
  while (i < length)
    args.push(arguments[i++]);
  return args;
});;


/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ungap_weakmap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


var isNoOp = typeof document !== 'object';

var templateLiteral = function (tl) {
  var RAW = 'raw';
  var isBroken = function (UA) {
    return /(Firefox|Safari)\/(\d+)/.test(UA) &&
          !/(Chrom|Android)\/(\d+)/.test(UA);
  };
  var broken = isBroken((document.defaultView.navigator || {}).userAgent);
  var FTS = !(RAW in tl) ||
            tl.propertyIsEnumerable(RAW) ||
            !Object.isFrozen(tl[RAW]);
  if (broken || FTS) {
    var forever = {};
    var foreverCache = function (tl) {
      for (var key = '.', i = 0; i < tl.length; i++)
        key += tl[i].length + '.' + tl[i];
      return forever[key] || (forever[key] = tl);
    };
    // Fallback TypeScript shenanigans
    if (FTS)
      templateLiteral = foreverCache;
    // try fast path for other browsers:
    // store the template as WeakMap key
    // and forever cache it only when it's not there.
    // this way performance is still optimal,
    // penalized only when there are GC issues
    else {
      var wm = new _ungap_weakmap__WEBPACK_IMPORTED_MODULE_0__["default"];
      var set = function (tl, unique) {
        wm.set(tl, unique);
        return unique;
      };
      templateLiteral = function (tl) {
        return wm.get(tl) || set(tl, foreverCache(tl));
      };
    }
  } else {
    isNoOp = true;
  }
  return TL(tl);
};

/* harmony default export */ __webpack_exports__["default"] = (TL);

function TL(tl) {
  return isNoOp ? tl : templateLiteral(tl);
}


/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ungap_weakmap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
/* harmony import */ var _ungap_template_tag_arguments__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(36);
/* harmony import */ var _shared_constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(34);
/* harmony import */ var _objects_Updates_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(22);






// a weak collection of contexts that
// are already known to hyperHTML
const bewitched = new _ungap_weakmap__WEBPACK_IMPORTED_MODULE_0__["default"];

// better known as hyper.bind(node), the render is
// the main tag function in charge of fully upgrading
// or simply updating, contexts used as hyperHTML targets.
// The `this` context is either a regular DOM node or a fragment.
function render() {
  const wicked = bewitched.get(this);
  const args = _ungap_template_tag_arguments__WEBPACK_IMPORTED_MODULE_1__["default"].apply(null, arguments);
  if (wicked && wicked.template === args[0]) {
    wicked.tagger.apply(null, args);
  } else {
    upgrade.apply(this, args);
  }
  return this;
}

// an upgrade is in charge of collecting template info,
// parse it once, if unknown, to map all interpolations
// as single DOM callbacks, relate such template
// to the current context, and render it after cleaning the context up
function upgrade(template) {
  const type = _shared_constants_js__WEBPACK_IMPORTED_MODULE_2__["OWNER_SVG_ELEMENT"] in this ? 'svg' : 'html';
  const tagger = new _objects_Updates_js__WEBPACK_IMPORTED_MODULE_3__["Tagger"](type);
  bewitched.set(this, {tagger, template: template});
  this.textContent = '';
  this.appendChild(tagger.apply(null, arguments));
}

/* harmony default export */ __webpack_exports__["default"] = (render);


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(40)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _marked) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.markdownToHtml = markdownToHtml;
  _exports.run = run;
  _exports.name = void 0;
  _marked = _interopRequireDefault(_marked);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  // @ts-check

  /**
   * Module core/markdown
   * Handles the optional markdown processing.
   *
   * Markdown support is optional. It is enabled by setting the `format`
   * property of the configuration object to "markdown."
   *
   * We use marked for parsing Markdown:
   * https://github.com/chjj/marked
   *
   * Note that the content of SECTION elements, and elements with a
   * class name of "note", "issue" or "req" are also parsed.
   *
   * The HTML created by the Markdown parser is turned into a nested
   * structure of SECTION elements, following the structure given by
   * the headings. For example, the following markup:
   *
   *     Title
   *     -----
   *
   *     ### Subtitle ###
   *
   *     Here's some text.
   *
   *     ### Another subtitle ###
   *
   *     More text.
   *
   * will be transformed into:
   *
   *     <section>
   *       <h2>Title</h2>
   *       <section>
   *         <h3>Subtitle</h3>
   *         <p>Here's some text.</p>
   *       </section>
   *       <section>
   *         <h3>Another subtitle</h3>
   *         <p>More text.</p>
   *       </section>
   *     </section>
   *
   * The whitespace of pre elements are left alone.
   */
  const name = "core/markdown";
  _exports.name = name;
  const gtEntity = /&gt;/gm;
  const ampEntity = /&amp;/gm;
  const endsWithSpace = /\s+$/gm;
  const inlineElems = new Set(["a", "abbr", "acronym", "b", "bdo", "big", "br", "button", "cite", "code", "dfn", "em", "i", "img", "input", "kbd", "label", "map", "object", "q", "samp", "script", "select", "small", "span", "strong", "sub", "sup", "textarea", "time", "tt", "var"]);
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

    const doc = document.createRange().createContextualFragment(text); // Normalize block level elements children first

    Array.from(doc.children).filter(elem => !inlineElems.has(elem.localName)).filter(elem => elem.localName !== "pre").filter(elem => elem.localName !== "table").forEach(elem => {
      elem.innerHTML = normalizePadding(elem.innerHTML);
    }); // Normalize root level now

    Array.from(doc.childNodes).filter(node => isTextNode(node) && node.textContent.trim() === "").forEach(node => node.replaceWith("\n")); // Normalize text node

    if (isElementNode(doc.firstChild)) {
      Array.from(doc.firstChild.children).filter(child => child.localName !== "table").forEach(child => {
        child.innerHTML = normalizePadding(child.innerHTML);
      });
    }

    doc.normalize(); // use the first space as an indicator of how much to chop off the front

    const firstSpace = doc.textContent.replace(/^ *\n/, "").split("\n").filter(item => item && item.startsWith(" "))[0];
    const chop = firstSpace ? firstSpace.match(/ +/)[0].length : 0;

    if (chop) {
      // Chop chop from start, but leave pre elem alone
      Array.from(doc.childNodes).filter(node => node.nodeName !== "PRE").filter(isTextNode).filter(node => {
        // we care about text next to a block level element
        const prevSib = node.previousElementSibling;
        const nextTo = prevSib && prevSib.localName; // and we care about text elements that finish on a new line

        return !inlineElems.has(nextTo) || node.textContent.trim().includes("\n");
      }).reduce((replacer, node) => {
        // We need to retain white space if the text Node is next to an in-line element
        let padding = "";
        const prevSib = node.previousElementSibling;
        const nextTo = prevSib && prevSib.localName;

        if (/^[\t ]/.test(node.textContent) && inlineElems.has(nextTo)) {
          padding = node.textContent.match(/^\s+/)[0];
        }

        node.textContent = padding + node.textContent.replace(replacer, "");
        return replacer;
      }, new RegExp("^ {1,".concat(chop, "}"), "gm")); // deal with pre elements... we can chop whitespace from their siblings

      const endsWithSpace = new RegExp("\\ {".concat(chop, "}$"), "gm");
      Array.from(doc.querySelectorAll("pre")).map(elem => elem.previousSibling).filter(isTextNode).reduce((chop, node) => {
        if (endsWithSpace.test(node.textContent)) {
          node.textContent = node.textContent.substr(0, node.textContent.length - chop);
        }

        return chop;
      }, chop);
    }

    const wrap = document.createElement("body");
    wrap.append(doc);
    const result = endsWithSpace.test(wrap.innerHTML) ? "".concat(wrap.innerHTML.trimRight(), "\n") : wrap.innerHTML;
    return result;
  }
  /**
   * @param {string} text
   */


  function markdownToHtml(text) {
    const normalizedLeftPad = normalizePadding(text); // As markdown is pulled from HTML, > and & are already escaped and
    // so blockquotes aren't picked up by the parser. This fixes it.

    const potentialMarkdown = normalizedLeftPad.replace(gtEntity, ">").replace(ampEntity, "&");
    const result = (0, _marked.default)(potentialMarkdown, {
      sanitize: false,
      gfm: true,
      headerIds: false
    });
    return result;
  }

  function processElements(selector) {
    return element => {
      const elements = Array.from(element.querySelectorAll(selector));
      elements.reverse().forEach(element => {
        element.innerHTML = markdownToHtml(element.innerHTML);
      });
      return elements;
    };
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

    findHeader({
      firstChild: node
    }) {
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

  const processMDSections = processElements("[data-format='markdown']:not(body)");
  const processBlockLevelElements = processElements("[data-format=markdown]:not(body), section, div, address, article, aside, figure, header, main, body");

  function run(conf) {
    const hasMDSections = !!document.querySelector("[data-format=markdown]:not(body)");
    const isMDFormat = conf.format === "markdown";

    if (!isMDFormat && !hasMDSections) {
      return; // Nothing to be done
    } // Only has markdown-format sections


    if (!isMDFormat) {
      processMDSections(document.body).map(elem => {
        const structuredInternals = structure(elem, elem.ownerDocument);
        return {
          structuredInternals,
          elem
        };
      }).forEach(({
        elem,
        structuredInternals
      }) => {
        elem.setAttribute("aria-busy", "true");

        if (structuredInternals.firstElementChild.localName === "section" && elem.localName === "section") {
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
    } // We transplant the UI to do the markdown processing


    const rsUI = document.getElementById("respec-ui");
    rsUI.remove(); // The new body will replace the old body

    const newHTML = document.createElement("html");
    const newBody = document.createElement("body");
    newBody.innerHTML = document.body.innerHTML; // Marked expects markdown be flush against the left margin
    // so we need to normalize the inner text of some block
    // elements.

    newHTML.appendChild(newBody);
    processBlockLevelElements(newHTML); // Process root level text nodes

    const cleanHTML = newBody.innerHTML // Markdown parsing sometimes inserts empty p tags
    .replace(/<p>\s*<\/p>/gm, "");
    newBody.innerHTML = cleanHTML; // Remove links where class .nolinks

    substituteWithTextNodes(newBody.querySelectorAll(".nolinks a[href]")); // Restructure the document properly

    const fragment = structure(newBody, document); // Frankenstein the whole thing back together

    newBody.appendChild(fragment);
    newBody.prepend(rsUI);
    document.body.replaceWith(newBody);
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=markdown.js.map

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * marked - a markdown parser
 * Copyright (c) 2011-2018, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/markedjs/marked
 */

;(function(root) {
'use strict';

/**
 * Block-Level Grammar
 */

var block = {
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
  nptable: noop,
  table: noop,
  lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
  // regex template, placeholders will be replaced according to different paragraph
  // interruption rules of commonmark and the original markdown spec:
  _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html)[^\n]+)*)/,
  text: /^[^\n]+/
};

block._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
block.def = edit(block.def)
  .replace('label', block._label)
  .replace('title', block._title)
  .getRegex();

block.bullet = /(?:[*+-]|\d{1,9}\.)/;
block.item = /^( *)(bull) ?[^\n]*(?:\n(?!\1bull ?)[^\n]*)*/;
block.item = edit(block.item, 'gm')
  .replace(/bull/g, block.bullet)
  .getRegex();

block.list = edit(block.list)
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
block.html = edit(block.html, 'i')
  .replace('comment', block._comment)
  .replace('tag', block._tag)
  .replace('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/)
  .getRegex();

block.paragraph = edit(block._paragraph)
  .replace('hr', block.hr)
  .replace('heading', ' {0,3}#{1,6} +')
  .replace('|lheading', '') // setex headings don't interrupt commonmark paragraphs
  .replace('blockquote', ' {0,3}>')
  .replace('fences', ' {0,3}(?:`{3,}|~{3,})[^`\\n]*\\n')
  .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
  .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)')
  .replace('tag', block._tag) // pars can be interrupted by type (6) html blocks
  .getRegex();

block.blockquote = edit(block.blockquote)
  .replace('paragraph', block.paragraph)
  .getRegex();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  nptable: /^ *([^|\n ].*\|.*)\n *([-:]+ *\|[-| :]*)(?:\n((?:.*[^>\n ].*(?:\n|$))*)\n*|$)/,
  table: /^ *\|(.+)\n *\|?( *[-:]+[-| :]*)(?:\n((?: *[^>\n ].*(?:\n|$))*)\n*|$)/
});

/**
 * Pedantic grammar (original John Gruber's loose markdown specification)
 */

block.pedantic = merge({}, block.normal, {
  html: edit(
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
  fences: noop, // fences not supported
  paragraph: edit(block.normal._paragraph)
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
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = Object.create(null);
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.pedantic) {
    this.rules = block.pedantic;
  } else if (this.options.gfm) {
    this.rules = block.gfm;
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top) {
  src = src.replace(/^ +$/gm, '');
  var next,
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
      var lastToken = this.tokens[this.tokens.length - 1];
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
            ? rtrim(cap, '\n')
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
        header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
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
          item.cells[i] = splitCells(item.cells[i], item.header.length);
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
          b = block.bullet.exec(cap[i + 1])[0];
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
        text: this.options.sanitize ? (this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0])) : cap[0]
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
        header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
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
          item.cells[i] = splitCells(
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

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
  autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
  url: noop,
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
  del: noop,
  text: /^(`+|[^`])(?:[\s\S]*?(?:(?=[\\<!\[`*]|\b_|$)|[^ ](?= {2,}\n))|(?= {2,}\n))/
};

// list of punctuation marks from common mark spec
// without ` and ] to workaround Rule 17 (inline code blocks/links)
inline._punctuation = '!"#$%&\'()*+,\\-./:;<=>?@\\[^_{|}~';
inline.em = edit(inline.em).replace(/punctuation/g, inline._punctuation).getRegex();

inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;

inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
inline.autolink = edit(inline.autolink)
  .replace('scheme', inline._scheme)
  .replace('email', inline._email)
  .getRegex();

inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;

inline.tag = edit(inline.tag)
  .replace('comment', block._comment)
  .replace('attribute', inline._attribute)
  .getRegex();

inline._label = /(?:\[[^\[\]]*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
inline._href = /<(?:\\[<>]?|[^\s<>\\])*>|[^\s\x00-\x1f]*/;
inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;

inline.link = edit(inline.link)
  .replace('label', inline._label)
  .replace('href', inline._href)
  .replace('title', inline._title)
  .getRegex();

inline.reflink = edit(inline.reflink)
  .replace('label', inline._label)
  .getRegex();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/,
  link: edit(/^!?\[(label)\]\((.*?)\)/)
    .replace('label', inline._label)
    .getRegex(),
  reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/)
    .replace('label', inline._label)
    .getRegex()
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: edit(inline.escape).replace('])', '~|])').getRegex(),
  _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
  url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
  _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
  del: /^~+(?=\S)([\s\S]*?\S)~+/,
  text: /^(`+|[^`])(?:[\s\S]*?(?:(?=[\\<!\[`*~]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))|(?= {2,}\n|[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))/
});

inline.gfm.url = edit(inline.gfm.url, 'i')
  .replace('email', inline.gfm._extended_email)
  .getRegex();
/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: edit(inline.br).replace('{2,}', '*').getRegex(),
  text: edit(inline.gfm.text)
    .replace('\\b_', '\\b_| {2,}\\n')
    .replace(/\{2,\}/g, '*')
    .getRegex()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer();
  this.renderer.options = this.options;

  if (!this.links) {
    throw new Error('Tokens array requires a `links` property.');
  }

  if (this.options.pedantic) {
    this.rules = inline.pedantic;
  } else if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = '',
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
      out += escape(cap[1]);
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
          : escape(cap[0])
        : cap[0];
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      var lastParenIndex = findClosingBracket(cap[2], '()');
      if (lastParenIndex > -1) {
        var linkLen = 4 + cap[1].length + lastParenIndex;
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
      out += this.renderer.codespan(escape(cap[2].trim(), true));
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
        text = escape(this.mangle(cap[1]));
        href = 'mailto:' + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (!this.inLink && (cap = this.rules.url.exec(src))) {
      if (cap[2] === '@') {
        text = escape(cap[0]);
        href = 'mailto:' + text;
      } else {
        // do extended autolink path validation
        do {
          prevCapZero = cap[0];
          cap[0] = this.rules._backpedal.exec(cap[0])[0];
        } while (prevCapZero !== cap[0]);
        text = escape(cap[0]);
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
        out += this.renderer.text(this.options.sanitize ? (this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0])) : cap[0]);
      } else {
        out += this.renderer.text(escape(this.smartypants(cap[0])));
      }
      continue;
    }

    if (src) {
      throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

InlineLexer.escapes = function(text) {
  return text ? text.replace(InlineLexer.rules._escapes, '$1') : text;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = link.href,
      title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
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
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  if (!this.options.mangle) return text;
  var out = '',
      l = text.length,
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
};

/**
 * Renderer
 */

function Renderer(options) {
  this.options = options || marked.defaults;
}

Renderer.prototype.code = function(code, infostring, escaped) {
  var lang = (infostring || '').match(/\S*/)[0];
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw, slugger) {
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

Renderer.prototype.hr = function() {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function(body, ordered, start) {
  var type = ordered ? 'ol' : 'ul',
      startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
  return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.checkbox = function(checked) {
  return '<input '
    + (checked ? 'checked="" ' : '')
    + 'disabled="" type="checkbox"'
    + (this.options.xhtml ? ' /' : '')
    + '> ';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  if (body) body = '<tbody>' + body + '</tbody>';

  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + body
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' align="' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return this.options.xhtml ? '<br/>' : '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
  if (href === null) {
    return text;
  }
  var out = '<a href="' + escape(href) + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
  if (href === null) {
    return text;
  }

  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

Renderer.prototype.text = function(text) {
  return text;
};

/**
 * TextRenderer
 * returns only the textual part of the token
 */

function TextRenderer() {}

// no need for block level renderers

TextRenderer.prototype.strong =
TextRenderer.prototype.em =
TextRenderer.prototype.codespan =
TextRenderer.prototype.del =
TextRenderer.prototype.text = function(text) {
  return text;
};

TextRenderer.prototype.link =
TextRenderer.prototype.image = function(href, title, text) {
  return '' + text;
};

TextRenderer.prototype.br = function() {
  return '';
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer();
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
  this.slugger = new Slugger();
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options) {
  var parser = new Parser(options);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options);
  // use an InlineLexer with a TextRenderer to extract pure text
  this.inlineText = new InlineLexer(
    src.links,
    merge({}, this.options, { renderer: new TextRenderer() })
  );
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  this.token = this.tokens.pop();
  return this.token;
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
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
        unescape(this.inlineText.output(this.token.text)),
        this.slugger);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = '',
          body = '',
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
      var ordered = this.token.ordered,
          start = this.token.start;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered, start);
    }
    case 'list_item_start': {
      body = '';
      var loose = this.token.loose;
      var checked = this.token.checked;
      var task = this.token.task;

      if (this.token.task) {
        body += this.renderer.checkbox(checked);
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
      var errMsg = 'Token with "' + this.token.type + '" type was not found.';
      if (this.options.silent) {
        console.log(errMsg);
      } else {
        throw new Error(errMsg);
      }
    }
  }
};

/**
 * Slugger generates header id
 */

function Slugger() {
  this.seen = {};
}

/**
 * Convert string to unique id
 */

Slugger.prototype.slug = function(value) {
  var slug = value
    .toLowerCase()
    .trim()
    .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '')
    .replace(/\s/g, '-');

  if (this.seen.hasOwnProperty(slug)) {
    var originalSlug = slug;
    do {
      this.seen[originalSlug]++;
      slug = originalSlug + '-' + this.seen[originalSlug];
    } while (this.seen.hasOwnProperty(slug));
  }
  this.seen[slug] = 0;

  return slug;
};

/**
 * Helpers
 */

function escape(html, encode) {
  if (encode) {
    if (escape.escapeTest.test(html)) {
      return html.replace(escape.escapeReplace, function(ch) { return escape.replacements[ch]; });
    }
  } else {
    if (escape.escapeTestNoEncode.test(html)) {
      return html.replace(escape.escapeReplaceNoEncode, function(ch) { return escape.replacements[ch]; });
    }
  }

  return html;
}

escape.escapeTest = /[&<>"']/;
escape.escapeReplace = /[&<>"']/g;
escape.replacements = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

escape.escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
escape.escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;

function unescape(html) {
  // explicitly match decimal, hex, and named HTML entities
  return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, function(_, n) {
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

function edit(regex, opt) {
  regex = regex.source || regex;
  opt = opt || '';
  return {
    replace: function(name, val) {
      val = val.source || val;
      val = val.replace(/(^|[^\[])\^/g, '$1');
      regex = regex.replace(name, val);
      return this;
    },
    getRegex: function() {
      return new RegExp(regex, opt);
    }
  };
}

function cleanUrl(sanitize, base, href) {
  if (sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
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

function resolveUrl(base, href) {
  if (!baseUrls[' ' + base]) {
    // we can ignore everything in base after the last slash of its path component,
    // but we might need to add _that_
    // https://tools.ietf.org/html/rfc3986#section-3
    if (/^[^:]+:\/*[^/]*$/.test(base)) {
      baseUrls[' ' + base] = base + '/';
    } else {
      baseUrls[' ' + base] = rtrim(base, '/', true);
    }
  }
  base = baseUrls[' ' + base];

  if (href.slice(0, 2) === '//') {
    return base.replace(/:[\s\S]*/, ':') + href;
  } else if (href.charAt(0) === '/') {
    return base.replace(/(:\/*[^/]*)[\s\S]*/, '$1') + href;
  } else {
    return base + href;
  }
}
var baseUrls = {};
var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1,
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
  var row = tableRow.replace(/\|/g, function(match, offset, str) {
        var escaped = false,
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
      cells = row.split(/ \|/),
      i = 0;

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
  if (str.length === 0) {
    return '';
  }

  // Length of suffix matching the invert condition.
  var suffLen = 0;

  // Step left until we fail to match the invert condition.
  while (suffLen < str.length) {
    var currChar = str.charAt(str.length - suffLen - 1);
    if (currChar === c && !invert) {
      suffLen++;
    } else if (currChar !== c && invert) {
      suffLen++;
    } else {
      break;
    }
  }

  return str.substr(0, str.length - suffLen);
}

function findClosingBracket(str, b) {
  if (str.indexOf(b[1]) === -1) {
    return -1;
  }
  var level = 0;
  for (var i = 0; i < str.length; i++) {
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

    opt = merge({}, marked.defaults, opt || {});
    checkSanitizeDeprecation(opt);

    var highlight = opt.highlight,
        tokens,
        pending,
        i = 0;

    try {
      tokens = Lexer.lex(src, opt);
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function(err) {
      if (err) {
        opt.highlight = highlight;
        return callback(err);
      }

      var out;

      try {
        out = Parser.parse(tokens, opt);
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
    if (opt) opt = merge({}, marked.defaults, opt);
    checkSanitizeDeprecation(opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/markedjs/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occurred:</p><pre>'
        + escape(e.message + '', true)
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
  merge(marked.defaults, opt);
  return marked;
};

marked.getDefaults = function() {
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
    renderer: new Renderer(),
    sanitize: false,
    sanitizer: null,
    silent: false,
    smartLists: false,
    smartypants: false,
    xhtml: false
  };
};

marked.defaults = marked.getDefaults();

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;
marked.TextRenderer = TextRenderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.Slugger = Slugger;

marked.parse = marked;

if (true) {
  module.exports = marked;
} else {}
})(this || (typeof window !== 'undefined' ? window : global));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(41)))

/***/ }),
/* 41 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
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
    var ths = this;
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


/*** EXPORTS FROM exports-loader ***/
module.exports = shortcut;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  // @ts-check

  /**
   * Removes common indents across the IDL texts,
   * so that indentation inside <pre> won't affect the rendered result.
   * @param {string} text IDL text
   */
  const name = "core/reindent";
  /**
   * @param {string} text
   */

  _exports.name = name;

  function reindent(text) {
    if (!text) {
      return text;
    } // TODO: use trimEnd when Edge supports it


    const lines = text.trimRight().split("\n");

    while (lines.length && !lines[0].trim()) {
      lines.shift();
    }

    const indents = lines.filter(s => s.trim()).map(s => s.search(/[^\s]/));
    const leastIndent = Math.min(...indents);
    return lines.map(s => s.slice(leastIndent)).join("\n");
  }

  function run() {
    for (const pre of document.getElementsByTagName("pre")) {
      pre.innerHTML = reindent(pre.innerHTML);
    }
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=reindent.js.map

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _pubsubhub) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  // Module core/location-hash
  // Resets window.location.hash to jump to the right point in the document
  const name = "core/location-hash";
  _exports.name = name;

  function run() {
    // Added message for legacy compat with Aria specs
    // See https://github.com/w3c/respec/issues/793
    (0, _pubsubhub.pub)("start", "core/location-hash");

    if (!location.hash) {
      return;
    }

    document.respecIsReady.then(() => {
      let hash = decodeURIComponent(location.hash).substr(1);
      const hasLink = document.getElementById(hash);
      const isLegacyFrag = /\W/.test(hash); // Allow some degree of recovery for legacy fragments format.
      // See https://github.com/w3c/respec/issues/1353

      if (!hasLink && isLegacyFrag) {
        const id = hash.replace(/[\W]+/gim, "-").replace(/^-+/, "").replace(/-+$/, "");

        if (document.getElementById(id)) {
          hash = id;
        }
      }

      location.hash = "#".concat(hash);
    });
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=location-hash.js.map

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(46), __webpack_require__(56), __webpack_require__(51), __webpack_require__(55)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _defaults, _dfnMap, _linter, _privsecSection) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  _linter = _interopRequireDefault(_linter);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  /**
   * Sets the defaults for W3C specs
   */
  const name = "w3c/defaults";
  _exports.name = name;

  _linter.default.register(_privsecSection.rule);

  const w3cDefaults = {
    lint: {
      "privsec-section": true
    },
    pluralize: true,
    doJsonLd: false,
    license: "w3c-software-doc",
    logos: [{
      src: "https://www.w3.org/StyleSheets/TR/2016/logos/W3C",
      alt: "W3C",
      height: 48,
      width: 72,
      url: "https://www.w3.org/"
    }],
    xref: true
  };

  function run(conf) {
    if (conf.specStatus === "unofficial") return; // assign the defaults

    const lint = conf.lint === false ? false : _objectSpread({}, _defaults.coreDefaults.lint, {}, w3cDefaults.lint, {}, conf.lint);
    Object.assign(conf, _objectSpread({}, _defaults.coreDefaults, {}, w3cDefaults, {}, conf, {
      lint
    })); // TODO: eventually, we want to remove this.
    // It's here for legacy support of json-ld specs
    // see https://github.com/w3c/respec/issues/2019

    Object.assign(conf, {
      definitionMap: _dfnMap.definitionMap
    });
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=defaults.js.map

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(47), __webpack_require__(49), __webpack_require__(50), __webpack_require__(51), __webpack_require__(52), __webpack_require__(53), __webpack_require__(54), __webpack_require__(55)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _checkCharset, _checkInternalSlots, _checkPunctuation, _linter, _localRefsExist, _noHeadinglessSections, _noHttpProps, _privsecSection) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.coreDefaults = _exports.name = void 0;
  _linter = _interopRequireDefault(_linter);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /**
   * Sets the core defaults
   */
  const name = "core/defaults";
  _exports.name = name;

  _linter.default.register(_noHttpProps.rule, _noHeadinglessSections.rule, _checkPunctuation.rule, _localRefsExist.rule, _checkInternalSlots.rule, _checkCharset.rule, _privsecSection.rule);

  const coreDefaults = {
    lint: {
      "no-headingless-sections": true,
      "no-http-props": true,
      "check-punctuation": false,
      "local-refs-exist": true,
      "check-internal-slots": false,
      "check-charset": false,
      "privsec-section": false
    },
    pluralize: false,
    specStatus: "base",
    highlightVars: true,
    addSectionLinks: true
  };
  _exports.coreDefaults = coreDefaults;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=defaults.js.map

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(48), __webpack_require__(10)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _LinterRule, _l10n) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.rule = void 0;
  _LinterRule = _interopRequireDefault(_LinterRule);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  const name = "check-charset";
  const meta = {
    en: {
      description: "Document must only contain one `<meta>` tag with charset set to 'utf-8'",
      howToFix: "Add this line in your document `<head>` section - `<meta charset=\"utf-8\">` or set charset to \"utf-8\" if not set already."
    }
  }; // Fall back to english, if language is missing

  const lang = _l10n.lang in meta ? _l10n.lang : "en";
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
      val.push(meta.getAttribute("charset").trim().toLowerCase());
    }

    const utfExists = val.includes("utf-8"); // only a single meta[charset] and is set to utf-8, correct case

    if (utfExists && metas.length === 1) {
      return [];
    } // if more than one meta[charset] tag defined along with utf-8
    // or
    // no meta[charset] present in the document


    return _objectSpread({
      name,
      occurrences: metas.length
    }, meta[lang]);
  }

  const rule = new _LinterRule.default(name, linterFunction);
  _exports.rule = rule;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=check-charset.js.map

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  // @ts-check

  /**
   * @typedef {object} LinterResult
   * @property {string} description
   * @property {string} help
   * @property {string} howToFix
   * @property {string} name
   * @property {number} occurrences
   * @property {Element[]} offendingElements
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
    return !(conf.hasOwnProperty("lint") === false || conf.lint === false || !conf.lint[name]);
  }

  class LinterRule {
    /**
     *
     * @param {String} name the name of the rule
     * @param {LintingFunction} lintingFunction
     */
    constructor(name, lintingFunction) {
      privs.set(this, {
        name,
        lintingFunction
      });
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


    lint(conf = {
      lint: {
        [this.name]: false
      }
    }, doc = document) {
      if (canLint(conf, this.name)) {
        return privs.get(this).lintingFunction(conf, doc);
      }
    }

  }

  _exports.default = LinterRule;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=LinterRule.js.map

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(48), __webpack_require__(10)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _LinterRule, _l10n) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.rule = void 0;
  _LinterRule = _interopRequireDefault(_LinterRule);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  const name = "check-internal-slots";
  const meta = {
    en: {
      description: "Internal slots should be preceded by a '.'",
      howToFix: "Add a '.' between the elements mentioned.",
      help: "See developer console."
    }
  }; // Fall back to english, if language is missing

  const lang = _l10n.lang in meta ? _l10n.lang : "en";
  /**
   * Runs linter rule.
   * @param {Object} _ The ReSpec config.
   * @param {Document} doc The document to be checked.
   * @return {import("../../core/LinterRule").LinterResult}
   */

  function linterFunction(_, doc) {
    const offendingElements = [...doc.querySelectorAll("var+a")].filter(({
      previousSibling: {
        nodeName
      }
    }) => {
      const isPrevVar = nodeName && nodeName === "VAR";
      return isPrevVar;
    });

    if (!offendingElements.length) {
      return;
    }

    return _objectSpread({
      name,
      offendingElements,
      occurrences: offendingElements.length
    }, meta[lang]);
  }

  const rule = new _LinterRule.default(name, linterFunction);
  _exports.rule = rule;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=check-internal-slots.js.map

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(48), __webpack_require__(10)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _LinterRule, _l10n) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.rule = void 0;
  _LinterRule = _interopRequireDefault(_LinterRule);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  const name = "check-punctuation";
  const punctuationMarks = [".", ":", "!", "?"];
  const humanMarks = punctuationMarks.map(mark => "\"".concat(mark, "\"")).join(", ");
  const meta = {
    en: {
      description: "`p` elements should end with a punctuation mark.",
      howToFix: "Please make sure `p` elements end with one of: ".concat(humanMarks, ".")
    }
  }; // Fall back to english, if language is missing

  const lang = _l10n.lang in meta ? _l10n.lang : "en";
  /**
   * Runs linter rule.
   *
   * @param {Object} _ The ReSpec config.
   * @param  {Document} doc The document to be checked.
   * @return {import("../../core/LinterRule").LinterResult}
   */

  function lintingFunction(_, doc) {
    // Check string ends with one of ., !, ?, :, ], or is empty.
    const punctuatingRegExp = new RegExp("[".concat(punctuationMarks.join(""), "\\]]$|^ *$"), "m");
    const offendingElements = [...doc.querySelectorAll("p:not(#back-to-top)")].filter(elem => !punctuatingRegExp.test(elem.textContent.trim()));

    if (!offendingElements.length) {
      return;
    }

    return _objectSpread({
      name,
      offendingElements,
      occurrences: offendingElements.length
    }, meta[lang]);
  }

  const rule = new _LinterRule.default(name, lintingFunction);
  _exports.rule = rule;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=check-punctuation.js.map

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(3), __webpack_require__(9)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _pubsubhub, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.default = _exports.name = void 0;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  const name = "core/linter";
  /** @type {WeakMap<Linter, { rules: Set<import("./LinterRule").default> }>} */

  _exports.name = name;
  const privates = new WeakMap();

  class Linter {
    constructor() {
      privates.set(this, {
        rules: new Set()
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
      const promisesToLint = [...privates.get(this).rules].map(rule => toLinterWarning(rule.lint(conf, doc)));
      await promisesToLint;
    }

  }

  const linter = new Linter();
  var _default = linter;
  _exports.default = _default;
  const baseResult = {
    name: "unknown",
    description: "",
    occurrences: 0,
    howToFix: "",
    offendingElements: [],
    // DOM Nodes
    help: "" // where to get help

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

    const output = _objectSpread({}, baseResult, {}, result);

    const {
      description,
      help,
      howToFix,
      name,
      occurrences,
      offendingElements
    } = output;
    const message = "Linter (".concat(name, "): ").concat(description, " ").concat(howToFix, " ").concat(help);

    if (offendingElements.length) {
      (0, _utils.showInlineWarning)(offendingElements, "".concat(message, " Occured"));
    } else {
      (0, _pubsubhub.pub)("warn", "".concat(message, " (Count: ").concat(occurrences, ")"));
    }
  }

  function run(conf) {
    if (conf.lint === false) {
      return; // nothing to do
    } // return early, continue processing other things


    (async () => {
      await document.respecIsReady;

      try {
        await linter.lint(conf, document);
      } catch (err) {
        console.error("Error ocurred while running the linter", err);
      }
    })();
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=linter.js.map

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(48), __webpack_require__(10)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _LinterRule, _l10n) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.rule = void 0;
  _LinterRule = _interopRequireDefault(_LinterRule);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  const name = "local-refs-exist";
  const meta = {
    en: {
      description: "Broken local reference found in document.",
      howToFix: "Please fix the links mentioned.",
      help: "See developer console."
    }
  }; // Fall back to english, if language is missing

  const lang = _l10n.lang in meta ? _l10n.lang : "en";
  /**
   * Runs linter rule.
   * @param {Object} _ The ReSpec config.
   * @param  {Document} doc The document to be checked.
   * @return {import("../../core/LinterRule").LinterResult}
   */

  function linterFunction(_, doc) {
    const offendingElements = [...doc.querySelectorAll("a[href^='#']")].filter(isBrokenHyperlink);

    if (!offendingElements.length) {
      return;
    }

    return _objectSpread({
      name,
      offendingElements,
      occurrences: offendingElements.length
    }, meta[lang]);
  }

  const rule = new _LinterRule.default(name, linterFunction);
  _exports.rule = rule;

  function isBrokenHyperlink(elem) {
    const id = elem.getAttribute("href").substring(1);
    return !elem.ownerDocument.getElementById(id);
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=local-refs-exist.js.map

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(48), __webpack_require__(10)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _LinterRule, _l10n) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.rule = void 0;
  _LinterRule = _interopRequireDefault(_LinterRule);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  const name = "no-headingless-sections";
  const meta = {
    en: {
      description: "All sections must start with a `h2-6` element.",
      howToFix: "Add a `h2-6` to the offending section or use a `<div>`.",
      help: "See developer console."
    },
    nl: {
      description: "Alle secties moeten beginnen met een `h2-6` element.",
      howToFix: "Voeg een `h2-6` toe aan de conflicterende sectie of gebruik een `<div>`.",
      help: "Zie de developer console."
    }
  }; // Fall back to english, if language is missing

  const lang = _l10n.lang in meta ? _l10n.lang : "en";

  const hasNoHeading = ({
    firstElementChild: elem
  }) => {
    return elem === null || /^h[1-6]$/.test(elem.localName) === false;
  };
  /**
   * @param {*} _
   * @param {Document} doc
   * @return {import("../../core/LinterRule").LinterResult}
   */


  function linterFunction(_, doc) {
    const offendingElements = [...doc.querySelectorAll("section")].filter(hasNoHeading);

    if (!offendingElements.length) {
      return;
    }

    return _objectSpread({
      name,
      offendingElements,
      occurrences: offendingElements.length
    }, meta[lang]);
  }

  const rule = new _LinterRule.default(name, linterFunction);
  _exports.rule = rule;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=no-headingless-sections.js.map

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(48), __webpack_require__(10)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _LinterRule, _l10n) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.rule = void 0;
  _LinterRule = _interopRequireDefault(_LinterRule);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  const name = "no-http-props";
  const meta = {
    en: {
      description: "Insecure URLs are not allowed in `respecConfig`.",
      howToFix: "Please change the following properties to 'https://': "
    }
  }; // Fall back to english, if language is missing

  const lang = _l10n.lang in meta ? _l10n.lang : "en";
  /**
   * Runs linter rule.
   *
   * @param {Object} conf The ReSpec config.
   * @param {Document} doc The document to be checked.
   */

  function lintingFunction(conf, doc) {
    // We can only really perform this check over http/https
    if (!doc.location.href.startsWith("http")) {
      return;
    }

    const offendingMembers = Object.getOwnPropertyNames(conf) // this check is cheap, "prevED" is w3c exception.
    .filter(key => key.endsWith("URI") || key === "prevED") // this check is expensive, so separate step
    .filter(key => new URL(conf[key], doc.location.href).href.startsWith("http://"));

    if (!offendingMembers.length) {
      return;
    }
    /** @type {import("../../core/LinterRule").LinterResult} */


    const result = _objectSpread({
      name,
      occurrences: offendingMembers.length
    }, meta[lang]);

    result.howToFix += "".concat(offendingMembers.map(item => "`".concat(item, "`")).join(", "), ".");
    return result;
  }

  const rule = new _LinterRule.default(name, lintingFunction);
  _exports.rule = rule;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=no-http-props.js.map

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(48), __webpack_require__(10)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _LinterRule, _l10n) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.rule = void 0;
  _LinterRule = _interopRequireDefault(_LinterRule);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  const name = "privsec-section";
  const meta = {
    en: {
      description: "Document must a 'Privacy and/or Security' Considerations section.",
      howToFix: "Add a privacy and/or security considerations section.",
      help: "See the [Self-Review Questionnaire](https://w3ctag.github.io/security-questionnaire/)."
    }
  }; // Fall back to english, if language is missing

  const lang = _l10n.lang in meta ? _l10n.lang : "en";

  function hasPriSecConsiderations(doc) {
    return Array.from(doc.querySelectorAll("h2, h3, h4, h5, h6")).some(({
      textContent: text
    }) => {
      const saysPrivOrSec = /(privacy|security)/im.test(text);
      const saysConsiderations = /(considerations)/im.test(text);
      return saysPrivOrSec && saysConsiderations || saysPrivOrSec;
    });
  }
  /**
   * @param {*} conf
   * @param {Document} doc
   * @return {import("../LinterRule").LinterResult}
   */


  function lintingFunction(conf, doc) {
    if (conf.isRecTrack && !hasPriSecConsiderations(doc)) {
      return _objectSpread({
        name,
        occurrences: 1
      }, meta[lang]);
    }
  }

  const rule = new _LinterRule.default(name, lintingFunction);
  _exports.rule = rule;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=privsec-section.js.map

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.registerDefinition = registerDefinition;
  _exports.definitionMap = void 0;
  // @ts-check

  /** @type {Record<string, HTMLElement[]>} */
  const definitionMap = Object.create(null);
  /**
   * @param {HTMLElement} dfn A definition element to register
   * @param {string[]} names Names to register the element by
   */

  _exports.definitionMap = definitionMap;

  function registerDefinition(dfn, names) {
    for (const name of names.map(name => name.toLowerCase())) {
      if (name in definitionMap === false) {
        definitionMap[name] = [dfn];
      } else if (definitionMap[name].includes(dfn) === false) {
        definitionMap[name].push(dfn);
      }
    }
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=dfn-map.js.map

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(58)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _respec) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  _respec = _interopRequireDefault(_respec);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  // @ts-check
  // Module core/style
  // Inserts the CSS that ReSpec uses into the document.
  //
  // IMPORTANT NOTE
  //  To add you own styles, create a plugin that declares the css as a dependency
  //  and create a build of your new ReSpec profile.
  //
  // CONFIGURATION
  //  - noReSpecCSS: if you're using a profile that loads this module but you don't want
  //    the style, set this to true
  const name = "core/style"; // Opportunistically inserts the style, with the chance to reduce some FOUC

  _exports.name = name;
  const styleElement = document.createElement("style");
  styleElement.id = "respec-mainstyle";
  styleElement.textContent = _respec.default;
  document.head.appendChild(styleElement);

  function run(conf) {
    if (conf.noReSpecCSS) {
      styleElement.remove();
    }
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=style.js.map

/***/ }),
/* 58 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("/*****************************************************************\n * ReSpec 3 CSS\n * Robin Berjon - http://berjon.com/\n *****************************************************************/\n\n@keyframes pop {\n  0% {\n    transform: scale(1, 1);\n  }\n  25% {\n    transform: scale(1.25, 1.25);\n    opacity: 0.75;\n  }\n  100% {\n    transform: scale(1, 1);\n  }\n}\n\n/* Override code highlighter background */\n.hljs {\n  background: transparent !important;\n}\n\n/* --- INLINES --- */\nh1 abbr,\nh2 abbr,\nh3 abbr,\nh4 abbr,\nh5 abbr,\nh6 abbr,\na abbr {\n  border: none;\n}\n\ndfn {\n  font-weight: bold;\n}\n\na.internalDFN {\n  color: inherit;\n  border-bottom: 1px solid #99c;\n  text-decoration: none;\n}\n\na.externalDFN {\n  color: inherit;\n  border-bottom: 1px dotted #ccc;\n  text-decoration: none;\n}\n\na.bibref {\n  text-decoration: none;\n}\n\n.respec-offending-element:target {\n  animation: pop 0.25s ease-in-out 0s 1;\n}\n\n.respec-offending-element,\na[href].respec-offending-element {\n  text-decoration: red wavy underline;\n}\n@supports not (text-decoration: red wavy underline) {\n  .respec-offending-element:not(pre) {\n    display: inline-block;\n  }\n  .respec-offending-element {\n    /* Red squiggly line */\n    background: url(data:image/gif;base64,R0lGODdhBAADAPEAANv///8AAP///wAAACwAAAAABAADAEACBZQjmIAFADs=)\n      bottom repeat-x;\n  }\n}\n\n#references :target {\n  background: #eaf3ff;\n  animation: pop 0.4s ease-in-out 0s 1;\n}\n\ncite .bibref {\n  font-style: normal;\n}\n\ncode {\n  color: #c83500;\n}\n\nth code {\n  color: inherit;\n}\n\na[href].orcid {\n    padding-left: 4px;\n    padding-right: 4px;\n}\n\na[href].orcid > svg {\n    margin-bottom: -2px;\n}\n\n/* --- TOC --- */\n\n.toc a,\n.tof a {\n  text-decoration: none;\n}\n\na .secno,\na .figno {\n  color: #000;\n}\n\nul.tof,\nol.tof {\n  list-style: none outside none;\n}\n\n.caption {\n  margin-top: 0.5em;\n  font-style: italic;\n}\n\n/* --- TABLE --- */\n\ntable.simple {\n  border-spacing: 0;\n  border-collapse: collapse;\n  border-bottom: 3px solid #005a9c;\n}\n\n.simple th {\n  background: #005a9c;\n  color: #fff;\n  padding: 3px 5px;\n  text-align: left;\n}\n\n.simple th[scope=\"row\"] {\n  background: inherit;\n  color: inherit;\n  border-top: 1px solid #ddd;\n}\n\n.simple td {\n  padding: 3px 10px;\n  border-top: 1px solid #ddd;\n}\n\n.simple tr:nth-child(even) {\n  background: #f0f6ff;\n}\n\n/* --- DL --- */\n\n.section dd > p:first-child {\n  margin-top: 0;\n}\n\n.section dd > p:last-child {\n  margin-bottom: 0;\n}\n\n.section dd {\n  margin-bottom: 1em;\n}\n\n.section dl.attrs dd,\n.section dl.eldef dd {\n  margin-bottom: 0;\n}\n\n#issue-summary > ul,\n.respec-dfn-list {\n  column-count: 2;\n}\n\n#issue-summary li,\n.respec-dfn-list li {\n  list-style: none;\n}\n\ndetails.respec-tests-details {\n  margin-left: 1em;\n  display: inline-block;\n  vertical-align: top;\n}\n\ndetails.respec-tests-details > * {\n  padding-right: 2em;\n}\n\ndetails.respec-tests-details[open] {\n  z-index: 999999;\n  position: absolute;\n  border: thin solid #cad3e2;\n  border-radius: 0.3em;\n  background-color: white;\n  padding-bottom: 0.5em;\n}\n\ndetails.respec-tests-details[open] > summary {\n  border-bottom: thin solid #cad3e2;\n  padding-left: 1em;\n  margin-bottom: 1em;\n  line-height: 2em;\n}\n\ndetails.respec-tests-details > ul {\n  width: 100%;\n  margin-top: -0.3em;\n}\n\ndetails.respec-tests-details > li {\n  padding-left: 1em;\n}\n\na[href].self-link:hover {\n  opacity: 1;\n  text-decoration: none;\n  background-color: transparent;\n}\n\nh2,\nh3,\nh4,\nh5,\nh6 {\n  position: relative;\n}\n\naside.example .marker > a.self-link {\n  color: inherit;\n}\n\nh2 > a.self-link,\nh3 > a.self-link,\nh4 > a.self-link,\nh5 > a.self-link,\nh6 > a.self-link {\n  border: none;\n  color: inherit;\n  font-size: 83%;\n  height: 2em;\n  left: -1.6em;\n  opacity: 0.5;\n  position: absolute;\n  text-align: center;\n  text-decoration: none;\n  top: 0;\n  transition: opacity 0.2s;\n  width: 2em;\n}\n\nh2 > a.self-link::before,\nh3 > a.self-link::before,\nh4 > a.self-link::before,\nh5 > a.self-link::before,\nh6 > a.self-link::before {\n  content: \"§\";\n  display: block;\n}\n\n@media (max-width: 767px) {\n  dd {\n    margin-left: 0;\n  }\n\n  /* Don't position self-link in headings off-screen */\n  h2 > a.self-link,\n  h3 > a.self-link,\n  h4 > a.self-link,\n  h5 > a.self-link,\n  h6 > a.self-link {\n    left: auto;\n    top: auto;\n  }\n}\n\n@media print {\n  .removeOnSave {\n    display: none;\n  }\n}\n");

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(9), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _utils, _pubsubhub) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;

  /* jshint strict: true, browser:true, jquery: true */
  // Module w3c/style
  // Inserts a link to the appropriate W3C style for the specification's maturity level.
  // CONFIGURATION
  //  - specStatus: the short code for the specification's maturity level or type (required)
  const name = "w3c/style";
  _exports.name = name;

  function attachFixupScript(doc, version) {
    const script = doc.createElement("script");

    if (location.hash) {
      script.addEventListener("load", () => {
        window.location.href = location.hash;
      }, {
        once: true
      });
    }

    script.src = "https://www.w3.org/scripts/TR/".concat(version, "/fixup.js");
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
      "shrink-to-fit": "no"
    };
    meta.content = (0, _utils.toKeyValuePairs)(contentProps).replace(/"/g, "");
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
    const resourceHints = [{
      hint: "preconnect",
      // for W3C styles and scripts.
      href: "https://www.w3.org"
    }, {
      hint: "preload",
      // all specs need it, and we attach it on end-all.
      href: "https://www.w3.org/scripts/TR/2016/fixup.js",
      as: "script"
    }, {
      hint: "preload",
      // all specs include on base.css.
      href: "https://www.w3.org/StyleSheets/TR/2016/base.css",
      as: "style"
    }, {
      hint: "preload",
      // all specs show the logo.
      href: "https://www.w3.org/StyleSheets/TR/2016/logos/W3C",
      as: "image"
    }].map(_utils.createResourceHint).reduce((frag, link) => {
      frag.appendChild(link);
      return frag;
    }, document.createDocumentFragment());
    return resourceHints;
  } // Collect elements for insertion (document fragment)


  const elements = createResourceHints(); // Opportunistically apply base style

  elements.appendChild(createBaseStyle());

  if (!document.head.querySelector("meta[name=viewport]")) {
    // Make meta viewport the first element in the head.
    elements.prepend(createMetaViewport());
  }

  document.head.prepend(elements);

  function styleMover(linkURL) {
    return exportDoc => {
      const w3cStyle = exportDoc.querySelector("head link[href=\"".concat(linkURL, "\"]"));
      exportDoc.querySelector("head").append(w3cStyle);
    };
  }

  function run(conf) {
    if (!conf.specStatus) {
      const warn = "`respecConfig.specStatus` missing. Defaulting to 'base'.";
      conf.specStatus = "base";
      (0, _pubsubhub.pub)("warn", warn);
    }

    let styleFile = "W3C-"; // Figure out which style file to use.

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
    } // Select between released styles and experimental style.


    const version = selectStyleVersion(conf.useExperimentalStyles || "2016"); // Attach W3C fixup script after we are done.

    if (version && !conf.noToc) {
      (0, _pubsubhub.sub)("end-all", () => {
        attachFixupScript(document, version);
      }, {
        once: true
      });
    }

    const finalVersionPath = version ? "".concat(version, "/") : "";
    const finalStyleURL = "https://www.w3.org/StyleSheets/TR/".concat(finalVersionPath).concat(styleFile);
    (0, _utils.linkCSS)(document, finalStyleURL); // Make sure the W3C stylesheet is the last stylesheet, as required by W3C Pub Rules.

    const moveStyle = styleMover(finalStyleURL);
    (0, _pubsubhub.sub)("beforesave", moveStyle);
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=style.js.map

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(10)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _l10n) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.name = void 0;
  // Module w3c/l10n
  // Looks at the lang attribute on the root element and uses it to manage the config.l10n object so
  // that other parts of the system can localise their text
  const name = "w3c/l10n";
  _exports.name = name;
  const additions = {
    en: {
      status_at_publication: "This section describes the status of this document at the time of its publication. Other documents may supersede this document. A list of current W3C publications and the latest revision of this technical report can be found in the <a href='https://www.w3.org/TR/'>W3C technical reports index</a> at https://www.w3.org/TR/."
    },
    ko: {
      status_at_publication: "This section describes the status of this document at the time of its publication. Other documents may supersede this document. A list of current W3C publications and the latest revision of this technical report can be found in the <a href='https://www.w3.org/TR/'>W3C technical reports index</a> at https://www.w3.org/TR/."
    },
    zh: {
      status_at_publication: "本章节描述了本文档的发布状态。其它更新版本可能会覆盖本文档。W3C的文档列 表和最新版本可通过<a href='https://www.w3.org/TR/'>W3C技术报告</a>索引访问。"
    },
    ja: {
      status_at_publication: "この節には、公開時点でのこの文書の位置づけが記されている。他の文書によって置き換えられる可能性がある。現時点でのW3Cの発行文書とこのテクニカルレポートの最新版は、下記から参照できる。 <a href='https://www.w3.org/TR/'>W3C technical reports index</a> (https://www.w3.org/TR/)"
    },
    nl: {
      status_at_publication: "This section describes the status of this document at the time of its publication. Other documents may supersede this document. A list of current W3C publications and the latest revision of this technical report can be found in the <a href='https://www.w3.org/TR/'>W3C technical reports index</a> at https://www.w3.org/TR/."
    },
    es: {
      status_at_publication: "Esta sección describe el estado del presente documento al momento de su publicación. El presente documento puede ser remplazado por otros. Una lista de las publicaciones actuales del W3C y la última revisión del presente informe técnico puede hallarse en http://www.w3.org/TR/ <a href='https://www.w3.org/TR/'>el índice de informes técnicos</a> del W3C."
    }
  };
  Object.keys(additions).forEach(key => {
    Object.assign(_l10n.l10n[key], additions[key]);
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=l10n.js.map

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(10), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _l10n, _pubsubhub) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  const name = "core/github";
  _exports.name = name;
  const localizationStrings = {
    en: {
      file_a_bug: "File a bug",
      participate: "Participate",
      commit_history: "Commit history"
    },
    nl: {
      commit_history: "Revisiehistorie",
      file_a_bug: "Dien een melding in",
      participate: "Doe mee"
    },
    es: {
      commit_history: "Historia de cambios",
      file_a_bug: "Nota un bug",
      participate: "Participe"
    }
  };
  const lang = _l10n.lang in localizationStrings ? _l10n.lang : "en";
  const l10n = localizationStrings[lang];

  async function run(conf) {
    if (!conf.hasOwnProperty("github") || !conf.github) {
      // nothing to do, bail out.
      return;
    }

    if (typeof conf.github === "object" && !conf.github.hasOwnProperty("repoURL")) {
      const msg = "Config option `[github](https://github.com/w3c/respec/wiki/github)` " + "is missing property `repoURL`.";
      (0, _pubsubhub.pub)("error", msg);
      return;
    }

    let tempURL = conf.github.repoURL || conf.github;
    if (!tempURL.endsWith("/")) tempURL += "/";
    let ghURL;

    try {
      ghURL = new URL(tempURL, "https://github.com");
    } catch (_unused) {
      (0, _pubsubhub.pub)("error", "`respecConf.github` is not a valid URL? (".concat(ghURL, ")"));
      return;
    }

    if (ghURL.origin !== "https://github.com") {
      const msg = "`respecConf.github` must be HTTPS and pointing to GitHub. (".concat(ghURL, ")");
      (0, _pubsubhub.pub)("error", msg);
      return;
    }

    const [org, repo] = ghURL.pathname.split("/").filter(item => item);

    if (!org || !repo) {
      const msg = "`respecConf.github` URL needs a path with, for example, w3c/my-spec";
      (0, _pubsubhub.pub)("error", msg);
      return;
    }

    const branch = conf.github.branch || "gh-pages";
    const issueBase = new URL("./issues/", ghURL).href;
    const newProps = {
      edDraftURI: "https://".concat(org.toLowerCase(), ".github.io/").concat(repo, "/"),
      githubToken: undefined,
      githubUser: undefined,
      githubAPI: "https://api.github.com/repos/".concat(org, "/").concat(repo),
      issueBase,
      atRiskBase: issueBase,
      otherLinks: [],
      pullBase: new URL("./pulls/", ghURL).href,
      shortName: repo
    };
    const otherLink = {
      key: l10n.participate,
      data: [{
        value: "GitHub ".concat(org, "/").concat(repo),
        href: ghURL
      }, {
        value: l10n.file_a_bug,
        href: newProps.issueBase
      }, {
        value: l10n.commit_history,
        href: new URL("./commits/".concat(branch), ghURL.href).href
      }, {
        value: "Pull requests",
        href: newProps.pullBase
      }]
    }; // Assign new properties, but retain existing ones

    const normalizedGHObj = {
      branch,
      repoURL: ghURL.href
    };

    const normalizedConfig = _objectSpread({}, newProps, {}, conf, {
      github: normalizedGHObj
    });

    Object.assign(conf, normalizedConfig);
    conf.otherLinks.unshift(otherLink);
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=github.js.map

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(3), __webpack_require__(9)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _pubsubhub, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  // Module core/data-include
  // Support for the data-include attribute. Causes external content to be included inside an
  // element that has data-include='some URI'. There is also a data-oninclude attribute that
  // features a white space separated list of global methods that will be called with the
  // module object, the content, and the included URI.
  //
  // IMPORTANT:
  //  This module only really works when you are in an HTTP context, and will most likely
  //  fail if you are editing your documents on your local drive. That is due to security
  //  restrictions in the browser.
  const name = "core/data-include";
  _exports.name = name;

  function processResponse(rawData, id, url) {
    const el = document.querySelector("[data-include-id=".concat(id, "]"));
    const doc = el.ownerDocument;
    const data = (0, _utils.runTransforms)(rawData, el.dataset.oninclude, url);
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

    } // If still in the dom tree, clean up


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
    ["data-include", "data-include-format", "data-include-replace", "data-include-id", "oninclude"].forEach(attr => el.removeAttribute(attr));
  }

  async function run() {
    const promisesToInclude = Array.from(document.querySelectorAll("[data-include]")).map(async el => {
      const url = el.dataset.include;

      if (!url) {
        return; // just skip it
      }

      const id = "include-".concat(String(Math.random()).substr(2));
      el.dataset.includeId = id;

      try {
        const response = await fetch(url);
        const text = await response.text();
        processResponse(text, id, url);
      } catch (err) {
        const msg = "`data-include` failed: `".concat(url, "` (").concat(err.message, "). See console for details.");
        console.error("data-include failed for element: ", el, err);
        (0, _pubsubhub.pub)("error", msg);
      }
    });
    await Promise.all(promisesToInclude);
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=data-include.js.map

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(9), __webpack_require__(64), __webpack_require__(68), __webpack_require__(69), __webpack_require__(13), __webpack_require__(3), __webpack_require__(70)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _utils, _cgbgHeaders, _cgbgSotd, _headers, _hyperhtml, _pubsubhub, _sotd) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  _cgbgHeaders = _interopRequireDefault(_cgbgHeaders);
  _cgbgSotd = _interopRequireDefault(_cgbgSotd);
  _headers = _interopRequireDefault(_headers);
  _hyperhtml = _interopRequireDefault(_hyperhtml);
  _sotd = _interopRequireDefault(_sotd);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _templateObject() {
    const data = _taggedTemplateLiteral(["", ""]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  const name = "w3c/headers";
  _exports.name = name;
  const W3CDate = new Intl.DateTimeFormat(["en-AU"], {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "2-digit"
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
    "WG-NOTE": "NOTE"
  };
  const status2rdf = {
    NOTE: "w3p:NOTE",
    WD: "w3p:WD",
    LC: "w3p:LastCall",
    CR: "w3p:CR",
    PR: "w3p:PR",
    REC: "w3p:REC",
    PER: "w3p:PER",
    RSCND: "w3p:RSCND"
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
    "BG-FINAL": "Final Business Group Report"
  };

  const status2long = _objectSpread({}, status2text, {
    "FPWD-NOTE": "First Public Working Group Note",
    "LC-NOTE": "Last Call Working Draft"
  });

  const maybeRecTrack = ["FPWD", "WD"];
  const recTrackStatus = ["FPLC", "LC", "CR", "PR", "PER", "REC"];
  const noTrackStatus = ["base", "BG-DRAFT", "BG-FINAL", "CG-DRAFT", "CG-FINAL", "draft-finding", "finding", "MO", "unofficial"];
  const cgbg = ["CG-DRAFT", "CG-FINAL", "BG-DRAFT", "BG-FINAL"];
  const precededByAn = ["ED", "IG-NOTE"];
  const licenses = {
    cc0: {
      name: "Creative Commons 0 Public Domain Dedication",
      short: "CC0",
      url: "https://creativecommons.org/publicdomain/zero/1.0/"
    },
    "w3c-software": {
      name: "W3C Software Notice and License",
      short: "W3C Software",
      url: "https://www.w3.org/Consortium/Legal/2002/copyright-software-20021231"
    },
    "w3c-software-doc": {
      name: "W3C Software and Document Notice and License",
      short: "W3C Software and Document",
      url: "https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document"
    },
    "cc-by": {
      name: "Creative Commons Attribution 4.0 International Public License",
      short: "CC-BY",
      url: "https://creativecommons.org/licenses/by/4.0/legalcode"
    }
  };
  const baseLogo = Object.freeze({
    id: "",
    alt: "",
    href: "",
    src: "",
    height: "48",
    width: "72"
  });
  /**
   * @param {*} conf
   * @param {string} prop
   * @param {string | number | Date} fallbackDate
   */

  function validateDateAndRecover(conf, prop, fallbackDate = new Date()) {
    const date = conf[prop] ? new Date(conf[prop]) : new Date(fallbackDate); // if date is valid

    if (Number.isFinite(date.valueOf())) {
      const formattedDate = _utils.ISODate.format(date);

      return new Date(formattedDate);
    }

    const msg = "[`".concat(prop, "`](https://github.com/w3c/respec/wiki/").concat(prop, ") ") + "is not a valid date: \"".concat(conf[prop], "\". Expected format 'YYYY-MM-DD'.");
    (0, _pubsubhub.pub)("error", msg);
    return new Date(_utils.ISODate.format(new Date()));
  }

  function run(conf) {
    conf.isUnofficial = conf.specStatus === "unofficial";

    if (conf.isUnofficial && !Array.isArray(conf.logos)) {
      conf.logos = [];
    }

    conf.isCCBY = conf.license === "cc-by";
    conf.isW3CSoftAndDocLicense = conf.license === "w3c-software-doc";

    if (["cc-by"].includes(conf.license)) {
      let msg = "You cannot use license \"`".concat(conf.license, "`\" with W3C Specs. ");
      msg += "Please set `respecConfig.license: \"w3c-software-doc\"` instead.";
      (0, _pubsubhub.pub)("error", msg);
    }

    conf.licenseInfo = licenses[conf.license];
    conf.isCGBG = cgbg.includes(conf.specStatus);
    conf.isCGFinal = conf.isCGBG && conf.specStatus.endsWith("G-FINAL");
    conf.isBasic = conf.specStatus === "base";
    conf.isRegular = !conf.isCGBG && !conf.isBasic;

    if (!conf.specStatus) {
      (0, _pubsubhub.pub)("error", "Missing required configuration: `specStatus`");
    }

    if (conf.isRegular && !conf.shortName) {
      (0, _pubsubhub.pub)("error", "Missing required configuration: `shortName`");
    }

    if (conf.testSuiteURI) {
      const url = new URL(conf.testSuiteURI, location.href);
      const {
        host,
        pathname
      } = url;

      if (host === "github.com" && pathname.startsWith("/w3c/web-platform-tests/")) {
        const msg = "Web Platform Tests have moved to a new Github Organization at https://github.com/web-platform-tests. " + "Please update your [`testSuiteURI`](https://github.com/w3c/respec/wiki/testSuiteURI) to point to the " + "new tests repository (e.g., https://github.com/web-platform-tests/wpt/".concat(conf.shortName, " ).");
        (0, _pubsubhub.pub)("warn", msg);
      }
    }

    conf.title = document.title || "No Title";

    if (document.title && conf.isPreview && conf.prNumber) {
      document.title = "Preview of PR #".concat(conf.prNumber, ": ").concat(document.title);
    }

    if (!conf.subtitle) conf.subtitle = "";
    conf.publishDate = validateDateAndRecover(conf, "publishDate", document.lastModified);
    conf.publishYear = conf.publishDate.getUTCFullYear();
    conf.publishHumanDate = W3CDate.format(conf.publishDate);
    conf.isNoTrack = noTrackStatus.includes(conf.specStatus);
    conf.isRecTrack = conf.noRecTrack ? false : recTrackStatus.concat(maybeRecTrack).includes(conf.specStatus);
    conf.isMemberSubmission = conf.specStatus === "Member-SUBM";

    if (conf.isMemberSubmission) {
      const memSubmissionLogo = {
        alt: "W3C Member Submission",
        href: "https://www.w3.org/Submission/",
        src: "https://www.w3.org/Icons/member_subm-v.svg",
        width: "211"
      };
      conf.logos.push(_objectSpread({}, baseLogo, {}, memSubmissionLogo));
    }

    conf.isTeamSubmission = conf.specStatus === "Team-SUBM";

    if (conf.isTeamSubmission) {
      const teamSubmissionLogo = {
        alt: "W3C Team Submission",
        href: "https://www.w3.org/TeamSubmission/",
        src: "https://www.w3.org/Icons/team_subm-v.svg",
        width: "211"
      };
      conf.logos.push(_objectSpread({}, baseLogo, {}, teamSubmissionLogo));
    }

    conf.isSubmission = conf.isMemberSubmission || conf.isTeamSubmission;
    conf.anOrA = precededByAn.includes(conf.specStatus) ? "an" : "a";
    conf.isTagFinding = conf.specStatus === "finding" || conf.specStatus === "draft-finding";

    if (!conf.edDraftURI) {
      conf.edDraftURI = "";
      if (conf.specStatus === "ED") (0, _pubsubhub.pub)("warn", "Editor's Drafts should set edDraftURI.");
    }

    conf.maturity = status2maturity[conf.specStatus] ? status2maturity[conf.specStatus] : conf.specStatus;
    let publishSpace = "TR";
    if (conf.specStatus === "Member-SUBM") publishSpace = "Submission";else if (conf.specStatus === "Team-SUBM") publishSpace = "TeamSubmission";
    if (conf.isRegular) conf.thisVersion = "https://www.w3.org/".concat(publishSpace, "/").concat(conf.publishDate.getUTCFullYear(), "/").concat(conf.maturity, "-").concat(conf.shortName, "-").concat((0, _utils.concatDate)(conf.publishDate), "/");
    if (conf.specStatus === "ED") conf.thisVersion = conf.edDraftURI;
    if (conf.isRegular) conf.latestVersion = "https://www.w3.org/".concat(publishSpace, "/").concat(conf.shortName, "/");

    if (conf.isTagFinding) {
      conf.latestVersion = "https://www.w3.org/2001/tag/doc/".concat(conf.shortName);
      conf.thisVersion = "".concat(conf.latestVersion, "-").concat(_utils.ISODate.format(conf.publishDate));
    }

    if (conf.previousPublishDate) {
      if (!conf.previousMaturity && !conf.isTagFinding) {
        (0, _pubsubhub.pub)("error", "`previousPublishDate` is set, but not `previousMaturity`.");
      }

      conf.previousPublishDate = validateDateAndRecover(conf, "previousPublishDate");
      const pmat = status2maturity[conf.previousMaturity] ? status2maturity[conf.previousMaturity] : conf.previousMaturity;

      if (conf.isTagFinding) {
        conf.prevVersion = "".concat(conf.latestVersion, "-").concat(_utils.ISODate.format(conf.previousPublishDate));
      } else if (conf.isCGBG) {
        conf.prevVersion = conf.prevVersion || "";
      } else if (conf.isBasic) {
        conf.prevVersion = "";
      } else {
        conf.prevVersion = "https://www.w3.org/TR/".concat(conf.previousPublishDate.getUTCFullYear(), "/").concat(pmat, "-").concat(conf.shortName, "-").concat((0, _utils.concatDate)(conf.previousPublishDate), "/");
      }
    } else {
      if (!conf.specStatus.endsWith("NOTE") && conf.specStatus !== "FPWD" && conf.specStatus !== "FPLC" && conf.specStatus !== "ED" && !conf.noRecTrack && !conf.isNoTrack && !conf.isSubmission) (0, _pubsubhub.pub)("error", "Document on track but no previous version:" + " Add `previousMaturity`, and `previousPublishDate` to ReSpec's config.");
      if (!conf.prevVersion) conf.prevVersion = "";
    }

    if (conf.prevRecShortname && !conf.prevRecURI) conf.prevRecURI = "https://www.w3.org/TR/".concat(conf.prevRecShortname);

    const peopCheck = function peopCheck(it) {
      if (!it.name) (0, _pubsubhub.pub)("error", "All authors and editors must have a name.");

      if (it.orcid) {
        try {
          it.orcid = normalizeOrcid(it.orcid);
        } catch (e) {
          (0, _pubsubhub.pub)("error", "\"".concat(it.orcid, "\" is not an ORCID. ").concat(e.message)); // A failed orcid link could link to something outside of orcid,
          // which would be misleading.

          delete it.orcid;
        }
      }
    };

    if (!conf.formerEditors) conf.formerEditors = [];

    if (conf.editors) {
      conf.editors.forEach(peopCheck); // Move any editors with retiredDate to formerEditors.

      for (let i = 0; i < conf.editors.length; i++) {
        const editor = conf.editors[i];

        if ("retiredDate" in editor) {
          conf.formerEditors.push(editor);
          conf.editors.splice(i--, 1);
        }
      }
    }

    if (!conf.editors || conf.editors.length === 0) (0, _pubsubhub.pub)("error", "At least one editor is required");

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
        (0, _pubsubhub.pub)("error", "All alternate formats must have a uri and a label.");
      }
    });
    conf.multipleAlternates = conf.alternateFormats && conf.alternateFormats.length > 1;
    conf.alternatesHTML = conf.alternateFormats && (0, _utils.joinAnd)(conf.alternateFormats, alt => {
      let optional = alt.hasOwnProperty("lang") && alt.lang ? " hreflang='".concat(alt.lang, "'") : "";
      optional += alt.hasOwnProperty("type") && alt.type ? " type='".concat(alt.type, "'") : "";
      return "<a rel='alternate' href='".concat(alt.uri, "'").concat(optional, ">").concat(alt.label, "</a>");
    });

    if (conf.bugTracker) {
      if (conf.bugTracker.new && conf.bugTracker.open) {
        conf.bugTrackerHTML = "<a href='".concat(conf.bugTracker.new, "'>").concat(conf.l10n.file_a_bug, "</a> ").concat(conf.l10n.open_parens, "<a href='").concat(conf.bugTracker.open, "'>").concat(conf.l10n.open_bugs, "</a>").concat(conf.l10n.close_parens);
      } else if (conf.bugTracker.open) {
        conf.bugTrackerHTML = "<a href='".concat(conf.bugTracker.open, "'>open bugs</a>");
      } else if (conf.bugTracker.new) {
        conf.bugTrackerHTML = "<a href='".concat(conf.bugTracker.new, "'>file a bug</a>");
      }
    }

    if (conf.copyrightStart && conf.copyrightStart == conf.publishYear) conf.copyrightStart = "";
    conf.longStatus = status2long[conf.specStatus];
    conf.textStatus = status2text[conf.specStatus];

    if (status2rdf[conf.specStatus]) {
      conf.rdfStatus = status2rdf[conf.specStatus];
    }

    conf.showThisVersion = !conf.isNoTrack || conf.isTagFinding;
    conf.showPreviousVersion = conf.specStatus !== "FPWD" && conf.specStatus !== "FPLC" && conf.specStatus !== "ED" && !conf.isNoTrack && !conf.isSubmission;
    if (conf.specStatus.endsWith("NOTE") && !conf.prevVersion) conf.showPreviousVersion = false;
    if (conf.isTagFinding) conf.showPreviousVersion = conf.previousPublishDate ? true : false;
    conf.notYetRec = conf.isRecTrack && conf.specStatus !== "REC";
    conf.isRec = conf.isRecTrack && conf.specStatus === "REC";
    if (conf.isRec && !conf.errata) (0, _pubsubhub.pub)("error", "Recommendations must have an errata link.");
    conf.notRec = conf.specStatus !== "REC";
    conf.prependW3C = !conf.isUnofficial;
    conf.isED = conf.specStatus === "ED";
    conf.isCR = conf.specStatus === "CR";
    conf.isPR = conf.specStatus === "PR";
    conf.isPER = conf.specStatus === "PER";
    conf.isMO = conf.specStatus === "MO";
    conf.isNote = ["FPWD-NOTE", "WG-NOTE"].includes(conf.specStatus);
    conf.isIGNote = conf.specStatus === "IG-NOTE";
    conf.dashDate = _utils.ISODate.format(conf.publishDate);
    conf.publishISODate = conf.publishDate.toISOString();
    conf.shortISODate = _utils.ISODate.format(conf.publishDate);

    if (conf.hasOwnProperty("wgPatentURI") && !Array.isArray(conf.wgPatentURI)) {
      Object.defineProperty(conf, "wgId", {
        get() {
          // it's always at "pp-impl" + 1
          const urlParts = this.wgPatentURI.split("/");
          const pos = urlParts.findIndex(item => item === "pp-impl") + 1;
          return urlParts[pos] || "";
        }

      });
    } else {
      conf.wgId = conf.wgId ? conf.wgId : "";
    } // configuration done - yay!
    // insert into document


    const header = (conf.isCGBG ? _cgbgHeaders.default : _headers.default)(conf);
    document.body.prepend(header);
    document.body.classList.add("h-entry"); // handle SotD

    const sotd = document.getElementById("sotd") || document.createElement("section");

    if ((conf.isCGBG || !conf.isNoTrack || conf.isTagFinding) && !sotd.id) {
      (0, _pubsubhub.pub)("error", "A custom SotD paragraph is required for your type of document.");
    }

    sotd.id = sotd.id || "sotd";
    sotd.classList.add("introductory"); // NOTE:
    //  When arrays, wg and wgURI have to be the same length (and in the same order).
    //  Technically wgURI could be longer but the rest is ignored.
    //  However wgPatentURI can be shorter. This covers the case where multiple groups
    //  publish together but some aren't used for patent policy purposes (typically this
    //  happens when one is foolish enough to do joint work with the TAG). In such cases,
    //  the groups whose patent policy applies need to be listed first, and wgPatentURI
    //  can be shorter — but it still needs to be an array.

    const wgPotentialArray = [conf.wg, conf.wgURI, conf.wgPatentURI];

    if (wgPotentialArray.some(item => Array.isArray(item)) && !wgPotentialArray.every(item => Array.isArray(item))) {
      (0, _pubsubhub.pub)("error", "If one of '`wg`', '`wgURI`', or '`wgPatentURI`' is an array, they all have to be.");
    }

    if (conf.isCGBG && !conf.wg) {
      (0, _pubsubhub.pub)("error", "[`wg`](https://github.com/w3c/respec/wiki/wg)" + " configuration option is required for this kind of document.");
    }

    if (Array.isArray(conf.wg)) {
      conf.multipleWGs = conf.wg.length > 1;
      conf.wgHTML = (0, _utils.joinAnd)(conf.wg, (wg, idx) => {
        return "the <a href='".concat(conf.wgURI[idx], "'>").concat(wg, "</a>");
      });
      const pats = [];

      for (let i = 0, n = conf.wg.length; i < n; i++) {
        pats.push("a <a href='".concat(conf.wgPatentURI[i], "' rel='disclosure'>") + "public list of any patent disclosures  (".concat(conf.wg[i], ")</a>"));
      }

      conf.wgPatentHTML = (0, _utils.joinAnd)(pats);
    } else {
      conf.multipleWGs = false;

      if (conf.wg) {
        conf.wgHTML = "the <a href='".concat(conf.wgURI, "'>").concat(conf.wg, "</a>");
      }
    }

    if (conf.specStatus === "PR" && !conf.crEnd) {
      (0, _pubsubhub.pub)("error", "`specStatus` is \"PR\" but no `crEnd` is specified (needed to indicate end of previous CR).");
    }

    if (conf.specStatus === "CR" && !conf.crEnd) {
      (0, _pubsubhub.pub)("error", "`specStatus` is \"CR\", but no `crEnd` is specified in Respec config.");
    }

    conf.crEnd = validateDateAndRecover(conf, "crEnd");
    conf.humanCREnd = W3CDate.format(conf.crEnd);

    if (conf.specStatus === "PR" && !conf.prEnd) {
      (0, _pubsubhub.pub)("error", "`specStatus` is \"PR\" but no `prEnd` is specified.");
    }

    conf.prEnd = validateDateAndRecover(conf, "prEnd");
    conf.humanPREnd = W3CDate.format(conf.prEnd);

    if (conf.specStatus === "PER" && !conf.perEnd) {
      (0, _pubsubhub.pub)("error", "Status is PER but no perEnd is specified");
    }

    conf.perEnd = validateDateAndRecover(conf, "perEnd");
    conf.humanPEREnd = W3CDate.format(conf.perEnd);
    conf.recNotExpected = conf.noRecTrack || conf.recNotExpected ? true : !conf.isRecTrack && conf.maturity == "WD" && conf.specStatus !== "FPWD-NOTE";

    if (conf.noRecTrack && recTrackStatus.includes(conf.specStatus)) {
      (0, _pubsubhub.pub)("error", "Document configured as [`noRecTrack`](https://github.com/w3c/respec/wiki/noRecTrack), but its status (\"".concat(conf.specStatus, "\") puts it on the W3C Rec Track. Status cannot be any of: ").concat(recTrackStatus.join(", "), ". [More info](https://github.com/w3c/respec/wiki/noRecTrack)."));
    }

    if (conf.isIGNote && !conf.charterDisclosureURI) {
      (0, _pubsubhub.pub)("error", "IG-NOTEs must link to charter's disclosure section using `charterDisclosureURI`.");
    }

    _hyperhtml.default.bind(sotd)(_templateObject(), populateSoTD(conf, sotd));

    if (!conf.implementationReportURI && conf.isCR) {
      (0, _pubsubhub.pub)("error", "CR documents must have an [`implementationReportURI`](https://github.com/w3c/respec/wiki/implementationReportURI) " + "that describes [implementation experience](https://www.w3.org/2019/Process-20190301/#implementation-experience).");
    }

    if (!conf.implementationReportURI && conf.isPR) {
      (0, _pubsubhub.pub)("warn", "PR documents should include an " + " [`implementationReportURI`](https://github.com/w3c/respec/wiki/implementationReportURI)" + " that describes [implementation experience](https://www.w3.org/2019/Process-20190301/#implementation-experience).");
    } // Requested by https://github.com/w3c/respec/issues/504
    // Makes a record of a few auto-generated things.


    (0, _pubsubhub.pub)("amend-user-config", {
      publishISODate: conf.publishISODate,
      generatedSubtitle: "".concat(conf.longStatus, " ").concat(conf.publishHumanDate)
    });
  }
  /**
   * @param {*} conf
   * @param {HTMLElement} sotd
   */


  function populateSoTD(conf, sotd) {
    const options = _objectSpread({}, collectSotdContent(sotd, conf), {
      get mailToWGPublicList() {
        return "mailto:".concat(conf.wgPublicList, "@w3.org");
      },

      get mailToWGPublicListWithSubject() {
        const fragment = conf.subjectPrefix ? "?subject=".concat(encodeURIComponent(conf.subjectPrefix)) : "";
        return this.mailToWGPublicList + fragment;
      },

      get mailToWGPublicListSubscription() {
        return "mailto:".concat(conf.wgPublicList, "-request@w3.org?subject=subscribe");
      }

    });

    const template = conf.isCGBG ? _cgbgSotd.default : _sotd.default;
    return template(conf, options);
  }
  /**
   * @param {HTMLElement} sotd
   */


  function collectSotdContent(sotd, {
    isTagFinding = false
  }) {
    const sotdClone = sotd.cloneNode(true);
    const additionalContent = document.createDocumentFragment(); // we collect everything until we hit a section,
    // that becomes the custom content.

    while (sotdClone.hasChildNodes()) {
      if (isElement(sotdClone.firstChild) && sotdClone.firstChild.localName === "section") {
        break;
      }

      additionalContent.appendChild(sotdClone.firstChild);
    }

    if (isTagFinding && !additionalContent.hasChildNodes()) {
      (0, _pubsubhub.pub)("warn", "ReSpec does not support automated SotD generation for TAG findings, " + "please add the prerequisite content in the 'sotd' section");
    }

    return {
      additionalContent,
      // Whatever sections are left, we throw at the end.
      additionalSections: sotdClone.childNodes
    };
  }
  /**
   * @param {string} orcid Either an ORCID URL or just the 16-digit ID which comes after the /
   * @return {string} the full ORCID URL. Throws an error if the ID is invalid.
   */


  function normalizeOrcid(orcid) {
    const orcidUrl = new URL(orcid, "https://orcid.org/");

    if (orcidUrl.origin !== "https://orcid.org") {
      throw new Error("The origin should be \"https://orcid.org\", not \"".concat(orcidUrl.origin, "\"."));
    } // trailing slash would mess up checksum


    const orcidId = orcidUrl.pathname.slice(1).replace(/\/$/, "");

    if (!/^\d{4}-\d{4}-\d{4}-\d{3}(\d|X)$/.test(orcidId)) {
      throw new Error("ORCIDs have the format \"1234-1234-1234-1234\", not \"".concat(orcidId, "\""));
    } // calculate checksum as per https://support.orcid.org/hc/en-us/articles/360006897674-Structure-of-the-ORCID-Identifier


    const lastDigit = orcidId[orcidId.length - 1];
    const remainder = orcidId.split("").slice(0, -1).filter(c => /\d/.test(c)).map(Number).reduce((acc, c) => (acc + c) * 2, 0);
    const lastDigitInt = (12 - remainder % 11) % 11;
    const lastDigitShould = lastDigitInt === 10 ? "X" : String(lastDigitInt);

    if (lastDigit !== lastDigitShould) {
      throw new Error("\"".concat(orcidId, "\" has an invalid checksum."));
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
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=headers.js.map

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(13), __webpack_require__(65), __webpack_require__(66), __webpack_require__(67)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _hyperhtml, _showLink, _showLogo, _showPeople) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _hyperhtml = _interopRequireDefault(_hyperhtml);
  _showLink = _interopRequireDefault(_showLink);
  _showLogo = _interopRequireDefault(_showLogo);
  _showPeople = _interopRequireDefault(_showPeople);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _templateObject17() {
    const data = _taggedTemplateLiteral(["\n              <a href=\"https://www.w3.org/community/about/agreements/cla/\"\n                >W3C Community Contributor License Agreement (CLA)</a\n              >. A human-readable\n              <a href=\"https://www.w3.org/community/about/agreements/cla-deed/\"\n                >summary</a\n              >\n              is available.\n            "]);

    _templateObject17 = function _templateObject17() {
      return data;
    };

    return data;
  }

  function _templateObject16() {
    const data = _taggedTemplateLiteral(["\n              <a href=\"https://www.w3.org/community/about/agreements/fsa/\"\n                >W3C Community Final Specification Agreement (FSA)</a\n              >. A human-readable\n              <a href=\"https://www.w3.org/community/about/agreements/fsa-deed/\"\n                >summary</a\n              >\n              is available.\n            "]);

    _templateObject16 = function _templateObject16() {
      return data;
    };

    return data;
  }

  function _templateObject15() {
    const data = _taggedTemplateLiteral(["\n              ", " &amp;\n            "]);

    _templateObject15 = function _templateObject15() {
      return data;
    };

    return data;
  }

  function _templateObject14() {
    const data = _taggedTemplateLiteral(["\n            <p>\n              ", "\n              ", "\n            </p>\n          "]);

    _templateObject14 = function _templateObject14() {
      return data;
    };

    return data;
  }

  function _templateObject13() {
    const data = _taggedTemplateLiteral(["\n              <dt>\n                ", "\n              </dt>\n              ", "\n            "]);

    _templateObject13 = function _templateObject13() {
      return data;
    };

    return data;
  }

  function _templateObject12() {
    const data = _taggedTemplateLiteral(["\n              <dt>\n                ", "\n              </dt>\n              ", "\n            "]);

    _templateObject12 = function _templateObject12() {
      return data;
    };

    return data;
  }

  function _templateObject11() {
    const data = _taggedTemplateLiteral(["\n                    <dt>Previous editor's draft:</dt>\n                    <dd><a href=\"", "\">", "</a></dd>\n                  "]);

    _templateObject11 = function _templateObject11() {
      return data;
    };

    return data;
  }

  function _templateObject10() {
    const data = _taggedTemplateLiteral(["\n              ", "\n            "]);

    _templateObject10 = function _templateObject10() {
      return data;
    };

    return data;
  }

  function _templateObject9() {
    const data = _taggedTemplateLiteral(["\n              <dt>Previous version:</dt>\n              <dd><a href=\"", "\">", "</a></dd>\n            "]);

    _templateObject9 = function _templateObject9() {
      return data;
    };

    return data;
  }

  function _templateObject8() {
    const data = _taggedTemplateLiteral(["\n              <dt>", "</dt>\n              <dd>", "</dd>\n            "]);

    _templateObject8 = function _templateObject8() {
      return data;
    };

    return data;
  }

  function _templateObject7() {
    const data = _taggedTemplateLiteral(["\n              <dt>Implementation report:</dt>\n              <dd>\n                <a href=\"", "\"\n                  >", "</a\n                >\n              </dd>\n            "]);

    _templateObject7 = function _templateObject7() {
      return data;
    };

    return data;
  }

  function _templateObject6() {
    const data = _taggedTemplateLiteral(["\n              <dt>Test suite:</dt>\n              <dd><a href=\"", "\">", "</a></dd>\n            "]);

    _templateObject6 = function _templateObject6() {
      return data;
    };

    return data;
  }

  function _templateObject5() {
    const data = _taggedTemplateLiteral(["\n              <dt>", "</dt>\n              <dd><a href=\"", "\">", "</a></dd>\n            "]);

    _templateObject5 = function _templateObject5() {
      return data;
    };

    return data;
  }

  function _templateObject4() {
    const data = _taggedTemplateLiteral(["\n              <dt>", "</dt>\n              <dd>\n                <a href=\"", "\">", "</a>\n              </dd>\n            "]);

    _templateObject4 = function _templateObject4() {
      return data;
    };

    return data;
  }

  function _templateObject3() {
    const data = _taggedTemplateLiteral(["\n              <dt>", "</dt>\n              <dd>\n                <a class=\"u-url\" href=\"", "\"\n                  >", "</a\n                >\n              </dd>\n            "]);

    _templateObject3 = function _templateObject3() {
      return data;
    };

    return data;
  }

  function _templateObject2() {
    const data = _taggedTemplateLiteral(["\n            <h2 id=\"subtitle\">", "</h2>\n          "]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    const data = _taggedTemplateLiteral(["\n    <div class=\"head\">\n      ", "\n      <h1 class=\"title p-name\" id=\"title\">", "</h1>\n      ", "\n      <h2>\n        ", "\n        <time class=\"dt-published\" datetime=\"", "\"\n          >", "</time\n        >\n      </h2>\n      <dl>\n        ", "\n        ", "\n        ", "\n        ", "\n        ", "\n        ", "\n        ", "\n        ", "\n        <dt>", "</dt>\n        ", "\n        ", "\n        ", "\n        ", "\n      </dl>\n      ", "\n      <p class=\"copyright\">\n        <a href=\"https://www.w3.org/Consortium/Legal/ipr-notice#Copyright\"\n          >Copyright</a\n        >\n        &copy;\n        ", "", "\n        ", "\n        the Contributors to the ", " Specification, published by the\n        <a href=\"", "\">", "</a> under the\n        ", "\n      </p>\n      <hr title=\"Separator for header\" />\n    </div>\n  "]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  var _default = conf => {
    return (0, _hyperhtml.default)(_templateObject(), conf.logos.map(_showLogo.default), conf.title, conf.subtitle ? (0, _hyperhtml.default)(_templateObject2(), conf.subtitle) : "", conf.longStatus, conf.dashDate, conf.publishHumanDate, conf.thisVersion ? (0, _hyperhtml.default)(_templateObject3(), conf.l10n.this_version, conf.thisVersion, conf.thisVersion) : "", conf.latestVersion ? (0, _hyperhtml.default)(_templateObject4(), conf.l10n.latest_published_version, conf.latestVersion, conf.latestVersion) : "", conf.edDraftURI ? (0, _hyperhtml.default)(_templateObject5(), conf.l10n.latest_editors_draft, conf.edDraftURI, conf.edDraftURI) : "", conf.testSuiteURI ? (0, _hyperhtml.default)(_templateObject6(), conf.testSuiteURI, conf.testSuiteURI) : "", conf.implementationReportURI ? (0, _hyperhtml.default)(_templateObject7(), conf.implementationReportURI, conf.implementationReportURI) : "", conf.bugTrackerHTML ? (0, _hyperhtml.default)(_templateObject8(), conf.l10n.bug_tracker, [conf.bugTrackerHTML]) : "", conf.prevVersion ? (0, _hyperhtml.default)(_templateObject9(), conf.prevVersion, conf.prevVersion) : "", !conf.isCGFinal ? (0, _hyperhtml.default)(_templateObject10(), conf.prevED ? (0, _hyperhtml.default)(_templateObject11(), conf.prevED, conf.prevED) : "") : "", conf.multipleEditors ? conf.l10n.editors : conf.l10n.editor, (0, _showPeople.default)(conf.editors), Array.isArray(conf.formerEditors) && conf.formerEditors.length > 0 ? (0, _hyperhtml.default)(_templateObject12(), conf.multipleFormerEditors ? conf.l10n.former_editors : conf.l10n.former_editor, (0, _showPeople.default)(conf.formerEditors)) : "", conf.authors ? (0, _hyperhtml.default)(_templateObject13(), conf.multipleAuthors ? conf.l10n.authors : conf.l10n.author, (0, _showPeople.default)(conf.authors)) : "", conf.otherLinks ? conf.otherLinks.map(_showLink.default) : "", conf.alternateFormats ? (0, _hyperhtml.default)(_templateObject14(), conf.multipleAlternates ? "This document is also available in these non-normative formats:" : "This document is also available in this non-normative format:", [conf.alternatesHTML]) : "", conf.copyrightStart ? "".concat(conf.copyrightStart, "-") : "", conf.publishYear, conf.additionalCopyrightHolders ? (0, _hyperhtml.default)(_templateObject15(), [conf.additionalCopyrightHolders]) : "", conf.title, conf.wgURI, conf.wg, conf.isCGFinal ? (0, _hyperhtml.default)(_templateObject16()) : (0, _hyperhtml.default)(_templateObject17()));
  };

  _exports.default = _default;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=cgbg-headers.js.map

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(13), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _hyperhtml, _pubsubhub) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _hyperhtml = _interopRequireDefault(_hyperhtml);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _templateObject3() {
    const data = _taggedTemplateLiteral(["\n            <a href=\"", "\">", "</a>\n          "]);

    _templateObject3 = function _templateObject3() {
      return data;
    };

    return data;
  }

  function _templateObject2() {
    const data = _taggedTemplateLiteral(["\n    <dd class=\"", "\">\n      ", "\n    </dd>\n  "]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    const data = _taggedTemplateLiteral(["\n    <dt class=\"", "\">", ":</dt>\n    ", "\n  "]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  const html = _hyperhtml.default;

  var _default = link => {
    if (!link.key) {
      const msg = "Found a link without `key` attribute in the configuration. See dev console.";
      (0, _pubsubhub.pub)("warn", msg);
      console.warn("warn", msg, link);
      return;
    }

    return html(_templateObject(), link.class ? link.class : null, link.key, link.data ? link.data.map(showLinkData) : showLinkData(link));
  };

  _exports.default = _default;

  function showLinkData(data) {
    return html(_templateObject2(), data.class ? data.class : null, data.href ? html(_templateObject3(), data.href, data.value || data.href) : "");
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=show-link.js.map

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(13), __webpack_require__(9)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _hyperhtml, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _hyperhtml = _interopRequireDefault(_hyperhtml);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _templateObject2() {
    const data = _taggedTemplateLiteral(["\n    <img\n      id=\"", "\"\n      alt=\"", "\"\n      width=\"", "\"\n      height=\"", "\"\n    />\n  "]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    const data = _taggedTemplateLiteral(["\n    <a href=\"", "\" class=\"logo\"></a>\n  "]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  var _default = obj => {
    /** @type {HTMLAnchorElement} */
    const a = (0, _hyperhtml.default)(_templateObject(), obj.url || "");

    if (!obj.alt) {
      (0, _utils.showInlineWarning)(a, "Found spec logo without an `alt` attribute");
    }
    /** @type {HTMLImageElement} */


    const img = (0, _hyperhtml.default)(_templateObject2(), obj.id, obj.alt, obj.width, obj.height); // avoid triggering 404 requests from dynamically generated
    // hyperHTML attribute values

    img.src = obj.src;
    a.append(img);
    return a;
  };

  _exports.default = _default;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=show-logo.js.map

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(9), __webpack_require__(10), __webpack_require__(13)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _utils, _l10n, _hyperhtml) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _hyperhtml = _interopRequireDefault(_hyperhtml);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _templateObject11() {
    const data = _taggedTemplateLiteral(["\n        <a href=\"", "\"></a>\n      "]);

    _templateObject11 = function _templateObject11() {
      return data;
    };

    return data;
  }

  function _templateObject10() {
    const data = _taggedTemplateLiteral(["\n      <span class=\"", "\"></span>\n    "]);

    _templateObject10 = function _templateObject10() {
      return data;
    };

    return data;
  }

  function _templateObject9() {
    const data = _taggedTemplateLiteral(["", ""]);

    _templateObject9 = function _templateObject9() {
      return data;
    };

    return data;
  }

  function _templateObject8() {
    const data = _taggedTemplateLiteral(["\n          - ", "", "\n        "]);

    _templateObject8 = function _templateObject8() {
      return data;
    };

    return data;
  }

  function _templateObject7() {
    const data = _taggedTemplateLiteral(["\n            (", ")\n          "]);

    _templateObject7 = function _templateObject7() {
      return data;
    };

    return data;
  }

  function _templateObject6() {
    const data = _taggedTemplateLiteral(["\n            (<a class=\"p-org org h-org h-card\" href=\"", "\"\n              >", "</a\n            >)\n          "]);

    _templateObject6 = function _templateObject6() {
      return data;
    };

    return data;
  }

  function _templateObject5() {
    const data = _taggedTemplateLiteral(["\n          <a class=\"p-name orcid\" href=\"", "\"\n            ><svg\n              width=\"16\"\n              height=\"16\"\n              xmlns=\"http://www.w3.org/2000/svg\"\n              viewBox=\"0 0 256 256\"\n            >\n              <style>\n                .st1 {\n                  fill: #fff;\n                }\n              </style>\n              <path\n                d=\"M256 128c0 70.7-57.3 128-128 128S0 198.7 0 128 57.3 0 128 0s128 57.3 128 128z\"\n                fill=\"#a6ce39\"\n              />\n              <path\n                class=\"st1\"\n                d=\"M86.3 186.2H70.9V79.1h15.4v107.1zM108.9 79.1h41.6c39.6 0 57 28.3 57 53.6 0 27.5-21.5 53.6-56.8 53.6h-41.8V79.1zm15.4 93.3h24.5c34.9 0 42.9-26.5 42.9-39.7C191.7 111.2 178 93 148 93h-23.7v79.4zM88.7 56.8c0 5.5-4.5 10.1-10.1 10.1s-10.1-4.6-10.1-10.1c0-5.6 4.5-10.1 10.1-10.1s10.1 4.6 10.1 10.1z\"\n              /></svg\n          ></a>\n        "]);

    _templateObject5 = function _templateObject5() {
      return data;
    };

    return data;
  }

  function _templateObject4() {
    const data = _taggedTemplateLiteral(["\n          <span class=\"p-name fn\">", "</span>\n        "]);

    _templateObject4 = function _templateObject4() {
      return data;
    };

    return data;
  }

  function _templateObject3() {
    const data = _taggedTemplateLiteral(["\n        <a class=\"u-url url p-name fn\" href=\"", "\">", "</a>\n      "]);

    _templateObject3 = function _templateObject3() {
      return data;
    };

    return data;
  }

  function _templateObject2() {
    const data = _taggedTemplateLiteral(["\n        <a class=\"ed_mailto u-email email p-name\" href=\"", "\"\n          >", "</a\n        >\n      "]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    const data = _taggedTemplateLiteral(["\n      <dd class=\"p-author h-card vcard\" data-editor-id=\"", "\"></dd>\n    "]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  const localizationStrings = {
    en: {
      until: "Until"
    },
    es: {
      until: "Hasta"
    }
  };
  const lang = _l10n.lang in localizationStrings ? _l10n.lang : "en";

  var _default = (items = []) => {
    const l10n = localizationStrings[lang];
    return items.map(getItem);

    function getItem(p) {
      const personName = [p.name]; // treated as opt-in HTML by hyperHTML

      const company = [p.company];
      const editorid = p.w3cid ? parseInt(p.w3cid, 10) : null;
      /** @type {HTMLElement} */

      const dd = (0, _hyperhtml.default)(_templateObject(), editorid);
      const span = document.createDocumentFragment();
      const contents = [];

      if (p.mailto) {
        contents.push((0, _hyperhtml.default)(_templateObject2(), "mailto:".concat(p.mailto), personName));
      } else if (p.url) {
        contents.push((0, _hyperhtml.default)(_templateObject3(), p.url, personName));
      } else {
        contents.push((0, _hyperhtml.default)(_templateObject4(), personName));
      }

      if (p.orcid) {
        contents.push((0, _hyperhtml.default)(_templateObject5(), p.orcid));
      }

      if (p.company) {
        if (p.companyURL) {
          contents.push((0, _hyperhtml.default)(_templateObject6(), p.companyURL, company));
        } else {
          contents.push((0, _hyperhtml.default)(_templateObject7(), company));
        }
      }

      if (p.note) contents.push(document.createTextNode(" (".concat(p.note, ")")));

      if (p.extras) {
        const results = p.extras // Remove empty names
        .filter(extra => extra.name && extra.name.trim()) // Convert to HTML
        .map(getExtra);

        for (const result of results) {
          contents.push(document.createTextNode(", "), result);
        }
      }

      if (p.retiredDate) {
        const retiredDate = new Date(p.retiredDate);
        const isValidDate = retiredDate.toString() !== "Invalid Date";
        const result = document.createElement("time");
        result.textContent = isValidDate ? (0, _utils.humanDate)(retiredDate) : "Invalid Date"; // todo: Localise invalid date

        if (!isValidDate) {
          (0, _utils.showInlineError)(result, "The date is invalid. The expected format is YYYY-MM-DD.", "Invalid date");
        }

        contents.push((0, _hyperhtml.default)(_templateObject8(), l10n.until.concat(" "), [result]));
      }

      _hyperhtml.default.bind(span)(_templateObject9(), contents);

      dd.appendChild(span);
      return dd;
    }

    function getExtra(extra) {
      const span = (0, _hyperhtml.default)(_templateObject10(), extra.class || null);
      let textContainer = span;

      if (extra.href) {
        textContainer = (0, _hyperhtml.default)(_templateObject11(), extra.href);
        span.appendChild(textContainer);
      }

      textContainer.textContent = extra.name;
      return span;
    }
  };

  _exports.default = _default;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=show-people.js.map

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(13)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _hyperhtml) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _hyperhtml = _interopRequireDefault(_hyperhtml);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _templateObject8() {
    const data = _taggedTemplateLiteral(["\n                  with <code>", "</code> at the start of your\n                  email's subject\n                "]);

    _templateObject8 = function _templateObject8() {
      return data;
    };

    return data;
  }

  function _templateObject7() {
    const data = _taggedTemplateLiteral(["\n          <p>\n            If you wish to make comments regarding this document, please send\n            them to\n            <a href=\"", "\"\n              >", "@w3.org</a\n            >\n            (<a href=\"", "\">subscribe</a>,\n            <a\n              href=\"", "\"\n              >archives</a\n            >)", ".\n          </p>\n        "]);

    _templateObject7 = function _templateObject7() {
      return data;
    };

    return data;
  }

  function _templateObject6() {
    const data = _taggedTemplateLiteral(["\n            Please note that under the\n            <a href=\"https://www.w3.org/community/about/agreements/cla/\"\n              >W3C Community Contributor License Agreement (CLA)</a\n            >\n            there is a limited opt-out and other conditions apply.\n          "]);

    _templateObject6 = function _templateObject6() {
      return data;
    };

    return data;
  }

  function _templateObject5() {
    const data = _taggedTemplateLiteral(["\n            Please note that under the\n            <a href=\"https://www.w3.org/community/about/agreements/final/\"\n              >W3C Community Final Specification Agreement (FSA)</a\n            >\n            other conditions apply.\n          "]);

    _templateObject5 = function _templateObject5() {
      return data;
    };

    return data;
  }

  function _templateObject4() {
    const data = _taggedTemplateLiteral(["\n                    Instead, see\n                    <a href=\"", "\">", "</a> for the\n                    Editor's draft.\n                  "]);

    _templateObject4 = function _templateObject4() {
      return data;
    };

    return data;
  }

  function _templateObject3() {
    const data = _taggedTemplateLiteral(["\n                    of pull request\n                    <a href=\"", "\">#", "</a>\n                  "]);

    _templateObject3 = function _templateObject3() {
      return data;
    };

    return data;
  }

  function _templateObject2() {
    const data = _taggedTemplateLiteral(["\n          <details class=\"annoying-warning\" open=\"\">\n            <summary\n              >This is a\n              preview", "</summary\n            >\n            <p>\n              Do not attempt to implement this version of the specification. Do\n              not reference this version as authoritative in any way.\n              ", "\n            </p>\n          </details>\n        "]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    const data = _taggedTemplateLiteral(["\n    <h2>", "</h2>\n    ", "\n    <p>\n      This specification was published by the\n      <a href=\"", "\">", "</a>. It is not a W3C Standard nor is it\n      on the W3C Standards Track.\n      ", "\n      Learn more about\n      <a href=\"https://www.w3.org/community/\"\n        >W3C Community and Business Groups</a\n      >.\n    </p>\n    ", "\n    ", "\n    ", "\n    ", "\n  "]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  var _default = (conf, opts) => {
    return (0, _hyperhtml.default)(_templateObject(), conf.l10n.sotd, conf.isPreview ? (0, _hyperhtml.default)(_templateObject2(), conf.prUrl && conf.prNumber ? (0, _hyperhtml.default)(_templateObject3(), conf.prUrl, conf.prNumber) : "", conf.edDraftURI ? (0, _hyperhtml.default)(_templateObject4(), conf.edDraftURI, conf.edDraftURI) : "") : "", conf.wgURI, conf.wg, conf.isCGFinal ? (0, _hyperhtml.default)(_templateObject5()) : (0, _hyperhtml.default)(_templateObject6()), !conf.sotdAfterWGinfo ? opts.additionalContent : "", conf.wgPublicList ? (0, _hyperhtml.default)(_templateObject7(), opts.mailToWGPublicListWithSubject, conf.wgPublicList, opts.mailToWGPublicListSubscription, "https://lists.w3.org/Archives/Public/".concat(conf.wgPublicList, "/"), conf.subjectPrefix ? (0, _hyperhtml.default)(_templateObject8(), conf.subjectPrefix) : "") : "", conf.sotdAfterWGinfo ? opts.additionalContent : "", opts.additionalSections);
  };

  _exports.default = _default;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=cgbg-sotd.js.map

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(13), __webpack_require__(9), __webpack_require__(3), __webpack_require__(65), __webpack_require__(66), __webpack_require__(67)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _hyperhtml, _utils, _pubsubhub, _showLink, _showLogo, _showPeople) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _hyperhtml = _interopRequireDefault(_hyperhtml);
  _showLink = _interopRequireDefault(_showLink);
  _showLogo = _interopRequireDefault(_showLogo);
  _showPeople = _interopRequireDefault(_showPeople);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _templateObject23() {
    const data = _taggedTemplateLiteral(["\n    Some Rights Reserved: this document is dual-licensed,\n    ", " and\n    ", ".\n  "]);

    _templateObject23 = function _templateObject23() {
      return data;
    };

    return data;
  }

  function _templateObject22() {
    const data = _taggedTemplateLiteral(["\n            ", " &amp;\n          "]);

    _templateObject22 = function _templateObject22() {
      return data;
    };

    return data;
  }

  function _templateObject21() {
    const data = _taggedTemplateLiteral(["\n    <p class=\"copyright\">\n      <a href=\"https://www.w3.org/Consortium/Legal/ipr-notice#Copyright\"\n        >Copyright</a\n      >\n      &copy;\n      ", "", "\n      ", "\n      <a href=\"https://www.w3.org/\"\n        ><abbr title=\"World Wide Web Consortium\">W3C</abbr></a\n      ><sup>&reg;</sup> (<a href=\"https://www.csail.mit.edu/\"\n        ><abbr title=\"Massachusetts Institute of Technology\">MIT</abbr></a\n      >,\n      <a href=\"https://www.ercim.eu/\"\n        ><abbr\n          title=\"European Research Consortium for Informatics and Mathematics\"\n          >ERCIM</abbr\n        ></a\n      >, <a href=\"https://www.keio.ac.jp/\">Keio</a>,\n      <a href=\"https://ev.buaa.edu.cn/\">Beihang</a>). ", "\n      W3C <a href=\"", "\">liability</a>,\n      <a href=\"", "\">trademark</a> and ", " rules\n      apply.\n    </p>\n  "]);

    _templateObject21 = function _templateObject21() {
      return data;
    };

    return data;
  }

  function _templateObject20() {
    const data = _taggedTemplateLiteral(["\n          <p class=\"copyright\">\n            This document is licensed under a\n            ", ".\n          </p>\n        "]);

    _templateObject20 = function _templateObject20() {
      return data;
    };

    return data;
  }

  function _templateObject19() {
    const data = _taggedTemplateLiteral(["\n          <p class=\"copyright\">", "</p>\n        "]);

    _templateObject19 = function _templateObject19() {
      return data;
    };

    return data;
  }

  function _templateObject18() {
    const data = _taggedTemplateLiteral(["\n    <a rel=\"license\" href=\"", "\" class=\"", "\">", "</a>\n  "]);

    _templateObject18 = function _templateObject18() {
      return data;
    };

    return data;
  }

  function _templateObject17() {
    const data = _taggedTemplateLiteral(["\n            <p>\n              ", "\n              ", "\n            </p>\n          "]);

    _templateObject17 = function _templateObject17() {
      return data;
    };

    return data;
  }

  function _templateObject16() {
    const data = _taggedTemplateLiteral(["\n            <p>\n              See also\n              <a\n                href=\"", "\"\n              >\n                <strong>translations</strong></a\n              >.\n            </p>\n          "]);

    _templateObject16 = function _templateObject16() {
      return data;
    };

    return data;
  }

  function _templateObject15() {
    const data = _taggedTemplateLiteral(["\n            <p>\n              Please check the\n              <a href=\"", "\"><strong>errata</strong></a> for any\n              errors or issues reported since publication.\n            </p>\n          "]);

    _templateObject15 = function _templateObject15() {
      return data;
    };

    return data;
  }

  function _templateObject14() {
    const data = _taggedTemplateLiteral(["\n              <dt>\n                ", "\n              </dt>\n              ", "\n            "]);

    _templateObject14 = function _templateObject14() {
      return data;
    };

    return data;
  }

  function _templateObject13() {
    const data = _taggedTemplateLiteral(["\n              <dt>\n                ", "\n              </dt>\n              ", "\n            "]);

    _templateObject13 = function _templateObject13() {
      return data;
    };

    return data;
  }

  function _templateObject12() {
    const data = _taggedTemplateLiteral(["\n              <dt>Latest Recommendation:</dt>\n              <dd><a href=\"", "\">", "</a></dd>\n            "]);

    _templateObject12 = function _templateObject12() {
      return data;
    };

    return data;
  }

  function _templateObject11() {
    const data = _taggedTemplateLiteral(["\n              <dt>Previous Recommendation:</dt>\n              <dd><a href=\"", "\">", "</a></dd>\n            "]);

    _templateObject11 = function _templateObject11() {
      return data;
    };

    return data;
  }

  function _templateObject10() {
    const data = _taggedTemplateLiteral(["\n              <dt>Previous version:</dt>\n              <dd><a href=\"", "\">", "</a></dd>\n            "]);

    _templateObject10 = function _templateObject10() {
      return data;
    };

    return data;
  }

  function _templateObject9() {
    const data = _taggedTemplateLiteral(["\n              <dt>Previous editor's draft:</dt>\n              <dd><a href=\"", "\">", "</a></dd>\n            "]);

    _templateObject9 = function _templateObject9() {
      return data;
    };

    return data;
  }

  function _templateObject8() {
    const data = _taggedTemplateLiteral(["\n              <dt>", "</dt>\n              <dd>", "</dd>\n            "]);

    _templateObject8 = function _templateObject8() {
      return data;
    };

    return data;
  }

  function _templateObject7() {
    const data = _taggedTemplateLiteral(["\n              <dt>Implementation report:</dt>\n              <dd>\n                <a href=\"", "\"\n                  >", "</a\n                >\n              </dd>\n            "]);

    _templateObject7 = function _templateObject7() {
      return data;
    };

    return data;
  }

  function _templateObject6() {
    const data = _taggedTemplateLiteral(["\n              <dt>Test suite:</dt>\n              <dd><a href=\"", "\">", "</a></dd>\n            "]);

    _templateObject6 = function _templateObject6() {
      return data;
    };

    return data;
  }

  function _templateObject5() {
    const data = _taggedTemplateLiteral(["\n              <dt>", "</dt>\n              <dd><a href=\"", "\">", "</a></dd>\n            "]);

    _templateObject5 = function _templateObject5() {
      return data;
    };

    return data;
  }

  function _templateObject4() {
    const data = _taggedTemplateLiteral(["\n                      <a href=\"", "\">", "</a>\n                    "]);

    _templateObject4 = function _templateObject4() {
      return data;
    };

    return data;
  }

  function _templateObject3() {
    const data = _taggedTemplateLiteral(["\n              <dt>", "</dt>\n              <dd>\n                <a class=\"u-url\" href=\"", "\"\n                  >", "</a\n                >\n              </dd>\n              <dt>", "</dt>\n              <dd>\n                ", "\n              </dd>\n            "]);

    _templateObject3 = function _templateObject3() {
      return data;
    };

    return data;
  }

  function _templateObject2() {
    const data = _taggedTemplateLiteral(["\n    <div class=\"head\">\n      ", " ", "\n      ", "\n      <h2>\n        ", "", "\n        <time class=\"dt-published\" datetime=\"", "\"\n          >", "</time\n        >\n      </h2>\n      <dl>\n        ", "\n        ", "\n        ", "\n        ", "\n        ", "\n        ", "\n        ", "\n        ", "\n        <dt>", "</dt>\n        ", "\n        ", "\n        ", "\n        ", "\n      </dl>\n      ", "\n      ", "\n      ", "\n      ", "\n      <hr title=\"Separator for header\" />\n    </div>\n  "]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    const data = _taggedTemplateLiteral(["\n      Preview of PR <a href=\"", "\">#", "</a>:\n    "]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  const ccLicense = "https://creativecommons.org/licenses/by/3.0/";
  const w3cLicense = "https://www.w3.org/Consortium/Legal/copyright-documents";
  const legalDisclaimer = "https://www.w3.org/Consortium/Legal/ipr-notice#Legal_Disclaimer";
  const w3cTrademark = "https://www.w3.org/Consortium/Legal/ipr-notice#W3C_Trademarks";

  function getSpecTitleElem(conf) {
    const specTitleElem = document.querySelector("h1#title") || document.createElement("h1");

    if (specTitleElem.parentElement) {
      specTitleElem.remove();
    } else {
      specTitleElem.textContent = conf.title;
      specTitleElem.id = "title";
    }

    if (conf.isPreview && conf.prNumber) {
      const {
        childNodes
      } = (0, _hyperhtml.default)(_templateObject(), conf.prUrl, conf.prNumber);
      specTitleElem.prepend(...childNodes);
    }

    conf.title = (0, _utils.norm)(specTitleElem.textContent);
    specTitleElem.classList.add("title", "p-name");

    if (document.querySelector("title") === null) {
      document.title = conf.title;
    } else if (document.title !== conf.title) {
      (0, _pubsubhub.pub)("warn", "The document's title and the `<title>` element differ.");
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

  var _default = conf => {
    return (0, _hyperhtml.default)(_templateObject2(), conf.logos.map(_showLogo.default), getSpecTitleElem(conf), getSpecSubTitleElem(conf), conf.prependW3C ? "W3C " : "", conf.textStatus, conf.dashDate, conf.publishHumanDate, !conf.isNoTrack ? (0, _hyperhtml.default)(_templateObject3(), conf.l10n.this_version, conf.thisVersion, conf.thisVersion, conf.l10n.latest_published_version, conf.latestVersion ? (0, _hyperhtml.default)(_templateObject4(), conf.latestVersion, conf.latestVersion) : "none") : "", conf.edDraftURI ? (0, _hyperhtml.default)(_templateObject5(), conf.l10n.latest_editors_draft, conf.edDraftURI, conf.edDraftURI) : "", conf.testSuiteURI ? (0, _hyperhtml.default)(_templateObject6(), conf.testSuiteURI, conf.testSuiteURI) : "", conf.implementationReportURI ? (0, _hyperhtml.default)(_templateObject7(), conf.implementationReportURI, conf.implementationReportURI) : "", conf.bugTrackerHTML ? (0, _hyperhtml.default)(_templateObject8(), conf.l10n.bug_tracker, [conf.bugTrackerHTML]) : "", conf.isED && conf.prevED ? (0, _hyperhtml.default)(_templateObject9(), conf.prevED, conf.prevED) : "", conf.showPreviousVersion ? (0, _hyperhtml.default)(_templateObject10(), conf.prevVersion, conf.prevVersion) : "", !conf.prevRecURI ? "" : conf.isRec ? (0, _hyperhtml.default)(_templateObject11(), conf.prevRecURI, conf.prevRecURI) : (0, _hyperhtml.default)(_templateObject12(), conf.prevRecURI, conf.prevRecURI), conf.multipleEditors ? conf.l10n.editors : conf.l10n.editor, (0, _showPeople.default)(conf.editors), Array.isArray(conf.formerEditors) && conf.formerEditors.length > 0 ? (0, _hyperhtml.default)(_templateObject13(), conf.multipleFormerEditors ? conf.l10n.former_editors : conf.l10n.former_editor, (0, _showPeople.default)(conf.formerEditors)) : "", conf.authors ? (0, _hyperhtml.default)(_templateObject14(), conf.multipleAuthors ? conf.l10n.authors : conf.l10n.author, (0, _showPeople.default)(conf.authors)) : "", conf.otherLinks ? conf.otherLinks.map(_showLink.default) : "", conf.errata ? (0, _hyperhtml.default)(_templateObject15(), conf.errata) : "", conf.isRec ? (0, _hyperhtml.default)(_templateObject16(), "http://www.w3.org/2003/03/Translations/byTechnology?technology=".concat(conf.shortName)) : "", conf.alternateFormats ? (0, _hyperhtml.default)(_templateObject17(), conf.multipleAlternates ? "This document is also available in these non-normative formats:" : "This document is also available in this non-normative format:", [conf.alternatesHTML]) : "", renderCopyright(conf));
  };
  /**
   * @param {string} text
   * @param {string} url
   * @param {string=} cssClass
   */


  _exports.default = _default;

  function linkLicense(text, url, cssClass) {
    return (0, _hyperhtml.default)(_templateObject18(), url, cssClass, text);
  }

  function renderCopyright(conf) {
    return conf.isUnofficial ? conf.additionalCopyrightHolders ? (0, _hyperhtml.default)(_templateObject19(), [conf.additionalCopyrightHolders]) : conf.overrideCopyright ? [conf.overrideCopyright] : (0, _hyperhtml.default)(_templateObject20(), linkLicense("Creative Commons Attribution 3.0 License", ccLicense, "subfoot")) : conf.overrideCopyright ? [conf.overrideCopyright] : renderOfficialCopyright(conf);
  }

  function renderOfficialCopyright(conf) {
    return (0, _hyperhtml.default)(_templateObject21(), conf.copyrightStart ? "".concat(conf.copyrightStart, "-") : "", conf.publishYear, conf.additionalCopyrightHolders ? (0, _hyperhtml.default)(_templateObject22(), [conf.additionalCopyrightHolders]) : "", noteIfDualLicense(conf), legalDisclaimer, w3cTrademark, linkDocumentUse(conf));
  }

  function noteIfDualLicense(conf) {
    if (!conf.isCCBY) {
      return;
    }

    return (0, _hyperhtml.default)(_templateObject23(), linkLicense("CC-BY", ccLicense), linkLicense("W3C Document License", w3cLicense));
  }

  function linkDocumentUse(conf) {
    if (conf.isCCBY) {
      return linkLicense("document use", "https://www.w3.org/Consortium/Legal/2013/copyright-documents-dual.html");
    }

    if (conf.isW3CSoftAndDocLicense) {
      return linkLicense("permissive document license", "https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document");
    }

    return linkLicense("document use", w3cLicense);
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=headers.js.map

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(13)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _hyperhtml) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _hyperhtml = _interopRequireDefault(_hyperhtml);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _templateObject31() {
    const data = _taggedTemplateLiteral(["\n                  with <code>", "</code> at the start of your\n                  email's subject\n                "]);

    _templateObject31 = function _templateObject31() {
      return data;
    };

    return data;
  }

  function _templateObject30() {
    const data = _taggedTemplateLiteral(["\n            ", "\n            Please send them to\n            <a href=\"", "\"\n              >", "@w3.org</a\n            >\n            (<a\n              href=\"", "\"\n              >archives</a\n            >)", ".\n          "]);

    _templateObject30 = function _templateObject30() {
      return data;
    };

    return data;
  }

  function _templateObject29() {
    const data = _taggedTemplateLiteral(["\n            <a href=\"", "\">GitHub Issues</a> are preferred for\n            discussion of this specification.\n          "]);

    _templateObject29 = function _templateObject29() {
      return data;
    };

    return data;
  }

  function _templateObject28() {
    const data = _taggedTemplateLiteral(["\n    <p>\n      ", "\n      ", "\n    </p>\n  "]);

    _templateObject28 = function _templateObject28() {
      return data;
    };

    return data;
  }

  function _templateObject27() {
    const data = _taggedTemplateLiteral(["\n    <p>\n      This document was published by ", " as ", "\n      ", ".\n      ", "\n    </p>\n  "]);

    _templateObject27 = function _templateObject27() {
      return data;
    };

    return data;
  }

  function _templateObject26() {
    const data = _taggedTemplateLiteral(["\n            with <code>", "</code> at the start of your email's\n            subject\n          "]);

    _templateObject26 = function _templateObject26() {
      return data;
    };

    return data;
  }

  function _templateObject25() {
    const data = _taggedTemplateLiteral(["\n    <p>\n      If you wish to make comments regarding this document, please send them to\n      <a href=\"", "\"\n        >", "@w3.org</a\n      >\n      (<a href=\"", "\">subscribe</a>,\n      <a href=\"", "\"\n        >archives</a\n      >)", ".\n    </p>\n    <p>\n      Please consult the complete\n      <a href=\"https://www.w3.org/TeamSubmission/\">list of Team Submissions</a>.\n    </p>\n  "]);

    _templateObject25 = function _templateObject25() {
      return data;
    };

    return data;
  }

  function _templateObject24() {
    const data = _taggedTemplateLiteral(["\n    <p>\n      By publishing this document, W3C acknowledges that the\n      <a href=\"", "\">Submitting Members</a> have made a formal\n      Submission request to W3C for discussion. Publication of this document by\n      W3C indicates no endorsement of its content by W3C, nor that W3C has, is,\n      or will be allocating any resources to the issues addressed by it. This\n      document is not the product of a chartered W3C group, but is published as\n      potential input to the\n      <a href=\"https://www.w3.org/Consortium/Process\">W3C Process</a>. A\n      <a href=\"", "\">W3C Team Comment</a> has been published in\n      conjunction with this Member Submission. Publication of acknowledged\n      Member Submissions at the W3C site is one of the benefits of\n      <a href=\"https://www.w3.org/Consortium/Prospectus/Joining\">\n        W3C Membership</a\n      >. Please consult the requirements associated with Member Submissions of\n      <a href=\"https://www.w3.org/Consortium/Patent-Policy/#sec-submissions\"\n        >section 3.3 of the W3C Patent Policy</a\n      >. Please consult the complete\n      <a href=\"https://www.w3.org/Submission\"\n        >list of acknowledged W3C Member Submissions</a\n      >.\n    </p>\n  "]);

    _templateObject24 = function _templateObject24() {
      return data;
    };

    return data;
  }

  function _templateObject23() {
    const data = _taggedTemplateLiteral(["\n    ", "\n    ", "\n  "]);

    _templateObject23 = function _templateObject23() {
      return data;
    };

    return data;
  }

  function _templateObject22() {
    const data = _taggedTemplateLiteral(["\n            The disclosure obligations of the Participants of this group are\n            described in the\n            <a href=\"", "\">charter</a>.\n          "]);

    _templateObject22 = function _templateObject22() {
      return data;
    };

    return data;
  }

  function _templateObject21() {
    const data = _taggedTemplateLiteral(["\n                  W3C maintains a\n                  <a href=\"", "\" rel=\"disclosure\"\n                    >public list of any patent disclosures</a\n                  >\n                "]);

    _templateObject21 = function _templateObject21() {
      return data;
    };

    return data;
  }

  function _templateObject20() {
    const data = _taggedTemplateLiteral(["\n                  W3C maintains ", "\n                "]);

    _templateObject20 = function _templateObject20() {
      return data;
    };

    return data;
  }

  function _templateObject19() {
    const data = _taggedTemplateLiteral(["\n            ", "\n            made in connection with the deliverables of\n            ", "\n            instructions for disclosing a patent. An individual who has actual\n            knowledge of a patent which the individual believes contains\n            <a href=\"https://www.w3.org/Consortium/Patent-Policy/#def-essential\"\n              >Essential Claim(s)</a\n            >\n            must disclose the information in accordance with\n            <a\n              href=\"https://www.w3.org/Consortium/Patent-Policy/#sec-Disclosure\"\n              >section 6 of the W3C Patent Policy</a\n            >.\n          "]);

    _templateObject19 = function _templateObject19() {
      return data;
    };

    return data;
  }

  function _templateObject18() {
    const data = _taggedTemplateLiteral(["\n    <p data-deliverer=\"", "\">\n      ", " ", "\n      ", "\n      ", "\n    </p>\n  "]);

    _templateObject18 = function _templateObject18() {
      return data;
    };

    return data;
  }

  function _templateObject17() {
    const data = _taggedTemplateLiteral(["\n        This document was produced by ", "\n        operating under the\n        <a href=\"https://www.w3.org/Consortium/Patent-Policy/\"\n          >W3C Patent Policy</a\n        >.\n      "]);

    _templateObject17 = function _templateObject17() {
      return data;
    };

    return data;
  }

  function _templateObject16() {
    const data = _taggedTemplateLiteral(["\n    <p>\n      This document has been reviewed by W3C Members, by software developers,\n      and by other W3C groups and interested parties, and is endorsed by the\n      Director as a W3C Recommendation. It is a stable document and may be used\n      as reference material or cited from another document. W3C's role in making\n      the Recommendation is to draw attention to the specification and to\n      promote its widespread deployment. This enhances the functionality and\n      interoperability of the Web.\n    </p>\n  "]);

    _templateObject16 = function _templateObject16() {
      return data;
    };

    return data;
  }

  function _templateObject15() {
    const data = _taggedTemplateLiteral(["\n    <p>\n      Publication as ", " ", " does not imply endorsement by the\n      W3C Membership. This is a draft document and may be updated, replaced or\n      obsoleted by other documents at any time. It is inappropriate to cite this\n      document as other than work in progress.\n    </p>\n  "]);

    _templateObject15 = function _templateObject15() {
      return data;
    };

    return data;
  }

  function _templateObject14() {
    const data = _taggedTemplateLiteral(["\n    <p>\n      Please see the Working Group's\n      <a href=\"", "\">implementation report</a>.\n    </p>\n  "]);

    _templateObject14 = function _templateObject14() {
      return data;
    };

    return data;
  }

  function _templateObject13() {
    const data = _taggedTemplateLiteral(["\n    <p>\n      This document is merely a W3C-internal\n      ", " document. It has no official standing\n      of any kind and does not represent consensus of the W3C Membership.\n    </p>\n    ", "\n  "]);

    _templateObject13 = function _templateObject13() {
      return data;
    };

    return data;
  }

  function _templateObject12() {
    const data = _taggedTemplateLiteral(["\n    <p>\n      This document is draft of a potential specification. It has no official\n      standing of any kind and does not represent the support or consensus of\n      any standards organization.\n    </p>\n    ", "\n  "]);

    _templateObject12 = function _templateObject12() {
      return data;
    };

    return data;
  }

  function _templateObject11() {
    const data = _taggedTemplateLiteral(["\n              Instead, see\n              <a href=\"", "\">", "</a> for the Editor's draft.\n            "]);

    _templateObject11 = function _templateObject11() {
      return data;
    };

    return data;
  }

  function _templateObject10() {
    const data = _taggedTemplateLiteral(["\n              of pull request\n              <a href=\"", "\">#", "</a>\n            "]);

    _templateObject10 = function _templateObject10() {
      return data;
    };

    return data;
  }

  function _templateObject9() {
    const data = _taggedTemplateLiteral(["\n    <details class=\"annoying-warning\" open=\"\">\n      <summary\n        >This is a\n        preview", "</summary\n      >\n      <p>\n        Do not attempt to implement this version of the specification. Do not\n        reference this version as authoritative in any way.\n        ", "\n      </p>\n    </details>\n  "]);

    _templateObject9 = function _templateObject9() {
      return data;
    };

    return data;
  }

  function _templateObject8() {
    const data = _taggedTemplateLiteral(["\n                      <p>", "</p>\n                    "]);

    _templateObject8 = function _templateObject8() {
      return data;
    };

    return data;
  }

  function _templateObject7() {
    const data = _taggedTemplateLiteral(["\n                                    The W3C Membership and other interested\n                                    parties are invited to review the document\n                                    and send comments to\n                                    <a\n                                      rel=\"discussion\"\n                                      href=\"", "\"\n                                      >", "@w3.org</a\n                                    >\n                                    (<a\n                                      href=\"", "\"\n                                      >subscribe</a\n                                    >,\n                                    <a\n                                      href=\"", "\"\n                                      >archives</a\n                                    >) through ", ". Advisory\n                                    Committee Representatives should consult\n                                    their\n                                    <a\n                                      href=\"https://www.w3.org/2002/09/wbs/myQuestionnaires\"\n                                      >WBS questionnaires</a\n                                    >. Note that substantive technical comments\n                                    were expected during the Candidate\n                                    Recommendation review period that ended\n                                    ", ".\n                                  "]);

    _templateObject7 = function _templateObject7() {
      return data;
    };

    return data;
  }

  function _templateObject6() {
    const data = _taggedTemplateLiteral(["\n                                    W3C Advisory Committee Members are invited\n                                    to send formal review comments on this\n                                    Proposed Edited Recommendation to the W3C\n                                    Team until ", ". Members of\n                                    the Advisory Committee will find the\n                                    appropriate review form for this document by\n                                    consulting their list of current\n                                    <a\n                                      href=\"https://www.w3.org/2002/09/wbs/myQuestionnaires\"\n                                      >WBS questionnaires</a\n                                    >.\n                                  "]);

    _templateObject6 = function _templateObject6() {
      return data;
    };

    return data;
  }

  function _templateObject5() {
    const data = _taggedTemplateLiteral(["\n                            <p>\n                              ", "\n                              ", "\n                              ", "\n                            </p>\n                          "]);

    _templateObject5 = function _templateObject5() {
      return data;
    };

    return data;
  }

  function _templateObject4() {
    const data = _taggedTemplateLiteral(["\n                      ", " ", "\n                      ", "\n                    "]);

    _templateObject4 = function _templateObject4() {
      return data;
    };

    return data;
  }

  function _templateObject3() {
    const data = _taggedTemplateLiteral(["\n                ", "\n                ", "\n                ", "\n                ", "\n                ", "\n                ", " ", "\n                <p>\n                  This document is governed by the\n                  <a\n                    id=\"w3c_process_revision\"\n                    href=\"https://www.w3.org/2019/Process-20190301/\"\n                    >1 March 2019 W3C Process Document</a\n                  >.\n                </p>\n                ", "\n              "]);

    _templateObject3 = function _templateObject3() {
      return data;
    };

    return data;
  }

  function _templateObject2() {
    const data = _taggedTemplateLiteral(["\n          <p><em>", "</em></p>\n          ", "\n        "]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    const data = _taggedTemplateLiteral(["\n    <h2>", "</h2>\n    ", "\n    ", "\n    ", "\n  "]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  var _default = (conf, opts) => {
    return (0, _hyperhtml.default)(_templateObject(), conf.l10n.sotd, conf.isPreview ? renderPreview(conf) : "", conf.isUnofficial ? renderIsUnofficial(opts) : conf.isTagFinding ? opts.additionalContent : conf.isNoTrack ? renderIsNoTrack(conf, opts) : (0, _hyperhtml.default)(_templateObject2(), [conf.l10n.status_at_publication], conf.isSubmission ? noteForSubmission(conf, opts) : (0, _hyperhtml.default)(_templateObject3(), !conf.sotdAfterWGinfo ? opts.additionalContent : "", !conf.overrideStatus ? (0, _hyperhtml.default)(_templateObject4(), linkToWorkingGroup(conf), linkToCommunity(conf, opts), conf.isCR || conf.isPER || conf.isPR ? (0, _hyperhtml.default)(_templateObject5(), conf.isCR ? "\n                  W3C publishes a Candidate Recommendation to indicate that the document is believed to be\n                  stable and to encourage implementation by the developer community. This Candidate\n                  Recommendation is expected to advance to Proposed Recommendation no earlier than\n                  ".concat(conf.humanCREnd, ".\n                ") : "", conf.isPER ? (0, _hyperhtml.default)(_templateObject6(), conf.humanPEREnd) : "", conf.isPR ? (0, _hyperhtml.default)(_templateObject7(), opts.mailToWGPublicList, conf.wgPublicList, opts.mailToWGPublicListSubscription, "https://lists.w3.org/Archives/Public/".concat(conf.wgPublicList, "/"), conf.humanPREnd, conf.humanCREnd) : "") : "") : "", conf.implementationReportURI ? renderImplementationReportURI(conf) : "", conf.sotdAfterWGinfo ? opts.additionalContent : "", conf.notRec ? renderNotRec(conf) : "", conf.isRec ? renderIsRec() : "", renderDeliverer(conf), conf.addPatentNote ? (0, _hyperhtml.default)(_templateObject8(), [conf.addPatentNote]) : "")), opts.additionalSections);
  };

  _exports.default = _default;

  function renderPreview(conf) {
    const {
      prUrl,
      prNumber,
      edDraftURI
    } = conf;
    return (0, _hyperhtml.default)(_templateObject9(), prUrl && prNumber ? (0, _hyperhtml.default)(_templateObject10(), prUrl, prNumber) : "", edDraftURI ? (0, _hyperhtml.default)(_templateObject11(), edDraftURI, edDraftURI) : "");
  }

  function renderIsUnofficial(opts) {
    const {
      additionalContent
    } = opts;
    return (0, _hyperhtml.default)(_templateObject12(), additionalContent);
  }

  function renderIsNoTrack(conf, opts) {
    const {
      isMO
    } = conf;
    const {
      additionalContent
    } = opts;
    return (0, _hyperhtml.default)(_templateObject13(), isMO ? "member-confidential" : "", additionalContent);
  }

  function renderImplementationReportURI(conf) {
    const {
      implementationReportURI
    } = conf;
    return (0, _hyperhtml.default)(_templateObject14(), implementationReportURI);
  }

  function renderNotRec(conf) {
    const {
      anOrA,
      textStatus
    } = conf;
    return (0, _hyperhtml.default)(_templateObject15(), anOrA, textStatus);
  }

  function renderIsRec() {
    (0, _hyperhtml.default)(_templateObject16());
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
      charterDisclosureURI
    } = conf;
    const producers = !isIGNote ? (0, _hyperhtml.default)(_templateObject17(), multipleWGs ? "groups" : "a group") : "";
    const wontBeRec = recNotExpected ? "The group does not expect this document to become a W3C Recommendation." : "";
    return (0, _hyperhtml.default)(_templateObject18(), isNote ? wgId : null, producers, wontBeRec, !isNote && !isIGNote ? (0, _hyperhtml.default)(_templateObject19(), multipleWGs ? (0, _hyperhtml.default)(_templateObject20(), [wgPatentHTML]) : (0, _hyperhtml.default)(_templateObject21(), [wgPatentURI]), multipleWGs ? "each group; these pages also include" : "the group; that page also includes") : "", isIGNote ? (0, _hyperhtml.default)(_templateObject22(), charterDisclosureURI) : "");
  }

  function noteForSubmission(conf, opts) {
    return (0, _hyperhtml.default)(_templateObject23(), opts.additionalContent, conf.isMemberSubmission ? noteForMemberSubmission(conf) : conf.isTeamSubmission ? noteForTeamSubmission(conf, opts) : "");
  }

  function noteForMemberSubmission(conf) {
    const teamComment = "https://www.w3.org/Submission/".concat(conf.publishDate.getUTCFullYear(), "/").concat(conf.submissionCommentNumber, "/Comment/");
    return (0, _hyperhtml.default)(_templateObject24(), conf.thisVersion, teamComment);
  }

  function noteForTeamSubmission(conf, opts) {
    return (0, _hyperhtml.default)(_templateObject25(), opts.mailToWGPublicListWithSubject, conf.wgPublicList, opts.mailToWGPublicListSubscription, "https://lists.w3.org/Archives/Public/".concat(conf.wgPublicList, "/"), conf.subjectPrefix ? (0, _hyperhtml.default)(_templateObject26(), conf.subjectPrefix) : "");
  }

  function linkToWorkingGroup(conf) {
    if (!conf.wg) {
      return;
    }

    return (0, _hyperhtml.default)(_templateObject27(), [conf.wgHTML], conf.anOrA, conf.longStatus, conf.notYetRec ? "This document is intended to become a W3C Recommendation." : "");
  }

  function linkToCommunity(conf, opts) {
    if (!conf.github && !conf.wgPublicList) {
      return;
    }

    return (0, _hyperhtml.default)(_templateObject28(), conf.github ? (0, _hyperhtml.default)(_templateObject29(), conf.issueBase) : "", conf.wgPublicList ? (0, _hyperhtml.default)(_templateObject30(), conf.github && conf.wgPublicList ? "Alternatively, you can send comments to our mailing list." : "Comments regarding this document are welcome.", opts.mailToWGPublicListWithSubject, conf.wgPublicList, "https://lists.w3.org/Archives/Public/".concat(conf.wgPublicList, "/"), conf.subjectPrefix ? (0, _hyperhtml.default)(_templateObject31(), conf.subjectPrefix) : "") : "");
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=sotd.js.map

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(10), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _l10n, _pubsubhub) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  // Module w3c/abstract
  // Handle the abstract section properly.
  const name = "w3c/abstract";
  _exports.name = name;

  async function run() {
    const abs = document.getElementById("abstract");

    if (!abs) {
      (0, _pubsubhub.pub)("error", "Document must have one element with `id=\"abstract\"");
      return;
    }

    abs.classList.add("introductory");
    let abstractHeading = document.querySelector("#abstract>h2");

    if (abstractHeading) {
      return;
    }

    abstractHeading = document.createElement("h2");
    abstractHeading.textContent = _l10n.l10n[_l10n.lang].abstract;
    abs.prepend(abstractHeading);
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=abstract.js.map

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(9)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  // Module core/data-transform
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
  const name = "core/data-transform";
  _exports.name = name;

  function run() {
    document.querySelectorAll("[data-transform]").forEach(el => {
      el.innerHTML = (0, _utils.runTransforms)(el.innerHTML, el.dataset.transform);
      el.removeAttribute("data-transform");
    });
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=data-transform.js.map

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(9)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  // @ts-check
  // Module core/data-abbr
  // - Finds all elements with data-abbr attribute and processes them.
  const name = "core/dfn-abbr";
  _exports.name = name;

  function run() {
    /** @type {NodeListOf<HTMLElement>} */
    const elements = document.querySelectorAll("[data-abbr]");

    for (const elem of elements) {
      const {
        localName
      } = elem;

      switch (localName) {
        case "dfn":
          processDfnElement(elem);
          break;

        default:
          {
            const msg = "[`data-abbr`](https://github.com/w3c/respec/wiki/data-abbr)" + " attribute not supported on `".concat(localName, "` elements.");
            (0, _utils.showInlineWarning)(elem, msg, "Error: unsupported.");
          }
      }
    }
  }
  /**
   * @param {HTMLElement} dfn
   */


  function processDfnElement(dfn) {
    const abbr = generateAbbreviation(dfn); // get normalized <dfn> textContent to remove spaces, tabs, new lines.

    const fullForm = dfn.textContent.replace(/\s\s+/g, " ").trim();
    dfn.insertAdjacentHTML("afterend", " (<abbr title=\"".concat(fullForm, "\">").concat(abbr, "</abbr>)"));
    const lt = dfn.dataset.lt || "";
    dfn.dataset.lt = lt.split("|").filter(i => i.trim()).concat(abbr).join("|");
  }

  function generateAbbreviation(elem) {
    if (elem.dataset.abbr) return elem.dataset.abbr; // Generates abbreviation from textContent
    // e.g., "Permanent Account Number" -> "PAN"

    return elem.textContent.match(/\b([a-z])/gi).join("").toUpperCase();
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=data-abbr.js.map

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(9), __webpack_require__(13), __webpack_require__(75), __webpack_require__(76)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _utils, _hyperhtml, _inlineIdlParser, _renderBiblio) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.rfc2119Usage = _exports.name = void 0;
  _hyperhtml = _interopRequireDefault(_hyperhtml);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _templateObject9() {
    const data = _taggedTemplateLiteral(["<code>", "</code>"]);

    _templateObject9 = function _templateObject9() {
      return data;
    };

    return data;
  }

  function _templateObject8() {
    const data = _taggedTemplateLiteral(["<a data-link-for=\"", "\" data-xref-for=\"", "\">", "</a>"]);

    _templateObject8 = function _templateObject8() {
      return data;
    };

    return data;
  }

  function _templateObject7() {
    const data = _taggedTemplateLiteral(["<var data-type=\"", "\">", "</var>"]);

    _templateObject7 = function _templateObject7() {
      return data;
    };

    return data;
  }

  function _templateObject6() {
    const data = _taggedTemplateLiteral(["<abbr title=\"", "\">", "</abbr>"]);

    _templateObject6 = function _templateObject6() {
      return data;
    };

    return data;
  }

  function _templateObject5() {
    const data = _taggedTemplateLiteral(["<span>", "</span>"]);

    _templateObject5 = function _templateObject5() {
      return data;
    };

    return data;
  }

  function _templateObject4() {
    const data = _taggedTemplateLiteral(["<a href=\"", "\"></a>"]);

    _templateObject4 = function _templateObject4() {
      return data;
    };

    return data;
  }

  function _templateObject3() {
    const data = _taggedTemplateLiteral(["<a data-cite=\"", "\"></a>"]);

    _templateObject3 = function _templateObject3() {
      return data;
    };

    return data;
  }

  function _templateObject2() {
    const data = _taggedTemplateLiteral(["<em class=\"rfc2119\" title=\"", "\">", "</em>"]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    const data = _taggedTemplateLiteral(["<code><a data-xref-type=\"element\">", "</a></code>"]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  const name = "core/inlines";
  _exports.name = name;
  const rfc2119Usage = {}; // Inline `code`
  // TODO: Replace (?!`) at the end with (?:<!`) at the start when Firefox + Safari
  // add support.

  _exports.rfc2119Usage = rfc2119Usage;
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
    const html = (0, _hyperhtml.default)(_templateObject(), value);
    return html;
  }
  /**
   * @param {string} matched
   * @return {HTMLElement}
   */


  function inlineRFC2119Matches(matched) {
    const value = (0, _utils.norm)(matched);
    const nodeElement = (0, _hyperhtml.default)(_templateObject2(), value, value); // remember which ones were used

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
      return (0, _hyperhtml.default)(_templateObject3(), ref);
    }

    if (document.querySelector(ref)) {
      return (0, _hyperhtml.default)(_templateObject4(), ref);
    }

    const badReference = (0, _hyperhtml.default)(_templateObject5(), matched);
    (0, _utils.showInlineError)(badReference, // cite element
    "Wasn't able to expand ".concat(matched, " as it didn't match any id in the document."), "Please make sure there is element with id ".concat(ref, " in the document."));
    return badReference;
  }
  /**
   * @param {string} matched
   */


  function inlineXrefMatches(matched) {
    // slices "{{" at the beginning and "}}" at the end
    const ref = matched.slice(2, -2).trim();
    return ref.startsWith("\\") ? matched.replace("\\", "") : (0, _inlineIdlParser.idlStringToHtml)((0, _utils.norm)(ref));
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
      return ["[[".concat(ref.slice(1), "]]")];
    }

    const {
      type,
      illegal
    } = (0, _utils.refTypeFromContext)(ref, txt.parentNode);
    const cite = (0, _renderBiblio.renderInlineCitation)(ref);
    const cleanRef = ref.replace(/^(!|\?)/, "");

    if (illegal && !conf.normativeReferences.has(cleanRef)) {
      (0, _utils.showInlineWarning)(cite.childNodes[1], // cite element
      "Normative references in informative sections are not allowed. " + "Remove '!' from the start of the reference `[[".concat(ref, "]]`"));
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
    return txt.parentElement.tagName === "ABBR" ? matched : (0, _hyperhtml.default)(_templateObject6(), abbrMap.get(matched), matched);
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
    return (0, _hyperhtml.default)(_templateObject7(), type, varName);
  }

  function inlineAnchorMatches(matched) {
    const parts = matched.slice(2, -2) // Chop [= =]
    .split("/", 2).map(s => s.trim());
    const [isFor, content] = parts.length === 2 ? parts : ["", parts[0]];
    const processedContent = processInlineContent(content);
    const forValue = (0, _utils.norm)(isFor);
    return (0, _hyperhtml.default)(_templateObject8(), forValue, forValue, processedContent);
  }

  function inlineCodeMatches(matched) {
    const clean = matched.slice(1, -1); // Chop ` and `

    return (0, _hyperhtml.default)(_templateObject9(), clean);
  }

  function processInlineContent(text) {
    if (inlineCodeRegExp.test(text)) {
      // We use a capture group to split, so we can process all the parts.
      return text.split(/(`[^`]+`)(?!`)/).map(part => {
        return part.startsWith("`") ? inlineCodeMatches(part) : processInlineContent(part);
      });
    }

    return document.createTextNode(text);
  }

  function run(conf) {
    const abbrMap = new Map();
    document.normalize();

    if (!document.querySelector("section#conformance")) {
      // make the document informative
      document.body.classList.add("informative");
    }

    conf.normativeReferences = new _utils.InsensitiveStringSet();
    conf.informativeReferences = new _utils.InsensitiveStringSet();
    if (!conf.respecRFC2119) conf.respecRFC2119 = rfc2119Usage; // PRE-PROCESSING

    /** @type {NodeListOf<HTMLElement>} */

    const abbrs = document.querySelectorAll("abbr[title]");

    for (const abbr of abbrs) {
      abbrMap.set(abbr.textContent, abbr.title);
    }

    const aKeys = [...abbrMap.keys()];
    const abbrRx = aKeys.length ? "(?:\\b".concat(aKeys.join("\\b)|(?:\\b"), "\\b)") : null; // PROCESSING
    // Don't gather text nodes for these:

    const exclusions = ["#respec-ui", ".head", "pre"];
    const txts = (0, _utils.getTextNodes)(document.body, exclusions, {
      wsNodes: false // we don't want nodes with just whitespace

    });
    const keywords = new RegExp(["\\bMUST(?:\\s+NOT)?\\b", "\\bSHOULD(?:\\s+NOT)?\\b", "\\bSHALL(?:\\s+NOT)?\\b", "\\bMAY\\b", "\\b(?:NOT\\s+)?REQUIRED\\b", "\\b(?:NOT\\s+)?RECOMMENDED\\b", "\\bOPTIONAL\\b"].join("|"));
    const rx = new RegExp("(".concat([keywords.source, inlineIdlReference.source, inlineVariable.source, inlineCitation.source, inlineExpansion.source, inlineAnchor.source, inlineCodeRegExp.source, inlineElement.source, ...(abbrRx ? [abbrRx] : [])].join("|"), ")"));

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
          throw new Error("Found token '".concat(t, "' but it does not correspond to anything"));
        }
      }

      txt.replaceWith(df);
    }
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=inlines.js.map

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(13), __webpack_require__(9)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _hyperhtml, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.idlStringToHtml = idlStringToHtml;
  _hyperhtml = _interopRequireDefault(_hyperhtml);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _templateObject9() {
    const data = _taggedTemplateLiteral(["<code>", "</code>"]);

    _templateObject9 = function _templateObject9() {
      return data;
    };

    return data;
  }

  function _templateObject8() {
    const data = _taggedTemplateLiteral(["<span>{{ ", " }}</span>"]);

    _templateObject8 = function _templateObject8() {
      return data;
    };

    return data;
  }

  function _templateObject7() {
    const data = _taggedTemplateLiteral(["<a\n    data-cite=\"WebIDL\"\n    data-xref-type=\"interface\"\n    >", "</a>"]);

    _templateObject7 = function _templateObject7() {
      return data;
    };

    return data;
  }

  function _templateObject6() {
    const data = _taggedTemplateLiteral(["\"<a\n    data-cite=\"WebIDL\"\n    data-xref-type=\"exception\"\n    >", "</a>\""]);

    _templateObject6 = function _templateObject6() {
      return data;
    };

    return data;
  }

  function _templateObject5() {
    const data = _taggedTemplateLiteral(["\"<a\n    data-xref-type=\"enum-value\"\n    data-link-for=\"", "\"\n    data-xref-for=\"", "\"\n    data-lt=\"", "\"\n    >", "</a>\""]);

    _templateObject5 = function _templateObject5() {
      return data;
    };

    return data;
  }

  function _templateObject4() {
    const data = _taggedTemplateLiteral(["", "<a\n    data-xref-type=\"", "\"\n    data-link-for=\"", "\"\n    data-xref-for=\"", "\"\n    data-lt=\"", "\"\n    >", "</a>(", ")"]);

    _templateObject4 = function _templateObject4() {
      return data;
    };

    return data;
  }

  function _templateObject3() {
    const data = _taggedTemplateLiteral(["", "<a\n      data-xref-type=\"attribute|dict-member\"\n      data-link-for=\"", "\"\n      data-xref-for=\"", "\"\n    >", "</a>"]);

    _templateObject3 = function _templateObject3() {
      return data;
    };

    return data;
  }

  function _templateObject2() {
    const data = _taggedTemplateLiteral(["", "[[<a\n    data-xref-type=\"attribute\"\n    data-link-for=", "\n    data-xref-for=", "\n    data-lt=\"", "\">", "</a>]]"]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    const data = _taggedTemplateLiteral(["<a data-xref-type=\"_IDL_\">", "</a>"]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  const idlPrimitiveRegex = /^[a-z]+(\s+[a-z]+)+$/; // {{unrestricted double}} {{ double }}

  const exceptionRegex = /\B"([^"]*)"\B/; // {{ "SomeException" }}

  const methodRegex = /(\w+)\((.*)\)$/;
  const slotRegex = /^\[\[(\w+)\]\]$/; // matches: `value` or `[[value]]`
  // NOTE: [[value]] is actually a slot, but database has this as type="attribute"

  const attributeRegex = /^((?:\[\[)?(?:\w+)(?:\]\])?)$/;
  const enumRegex = /^(\w+)\["([\w- ]*)"\]$/; // TODO: const splitRegex = /(?<=\]\]|\b)\./
  // https://github.com/w3c/respec/pull/1848/files#r225087385

  const methodSplitRegex = /\.?(\w+\(.*\)$)/;
  /** @param {string} str */

  function parseInlineIDL(str) {
    const [nonMethodPart, methodPart] = str.split(methodSplitRegex);
    const tokens = nonMethodPart.split(/[./]/).concat(methodPart).filter(s => s && s.trim()).map(s => s.trim());
    const renderParent = !str.includes("/");
    const results = [];

    while (tokens.length) {
      const value = tokens.pop(); // Method

      if (methodRegex.test(value)) {
        const [, identifier, allArgs] = value.match(methodRegex);
        const args = allArgs.split(/,\s*/).filter(arg => arg);
        results.push({
          type: "method",
          identifier,
          args,
          renderParent
        });
        continue;
      } // Enum["enum value"]


      if (enumRegex.test(value)) {
        const [, identifier, enumValue] = value.match(enumRegex);
        results.push({
          type: "enum",
          identifier,
          enumValue,
          renderParent
        });
        continue;
      } // Exception - "NotAllowedError"
      // Or alternate enum syntax: {{ EnumContainer / "some enum value" }}


      if (exceptionRegex.test(value)) {
        const [, identifier] = value.match(exceptionRegex);

        if (renderParent) {
          results.push({
            type: "exception",
            identifier
          });
        } else {
          results.push({
            type: "enum",
            enumValue: identifier,
            renderParent
          });
        }

        continue;
      } // internal slot


      if (slotRegex.test(value)) {
        const [, identifier] = value.match(slotRegex);
        results.push({
          type: "internal-slot",
          identifier,
          renderParent
        });
        continue;
      } // attribute


      if (attributeRegex.test(value) && tokens.length) {
        const [, identifier] = value.match(attributeRegex);
        results.push({
          type: "attribute",
          identifier,
          renderParent
        });
        continue;
      }

      if (idlPrimitiveRegex.test(value)) {
        results.push({
          type: "idl-primitive",
          identifier: value,
          renderParent
        });
        continue;
      } // base, always final token


      if (attributeRegex.test(value) && tokens.length === 0) {
        results.push({
          type: "base",
          identifier: value,
          renderParent
        });
        continue;
      }

      throw new SyntaxError("IDL micro-syntax parsing error in `{{ ".concat(str, " }}`"));
    } // link the list


    results.forEach((item, i, list) => {
      item.parent = list[i + 1] || null;
    }); // return them in the order we found them...

    return results.reverse();
  }

  function renderBase(details) {
    // Check if base is a local variable in a section
    const {
      identifier,
      renderParent
    } = details;

    if (renderParent) {
      return (0, _hyperhtml.default)(_templateObject(), identifier);
    }
  }
  /**
   * Internal slot: .[[identifier]] or [[identifier]]
   */


  function renderInternalSlot(details) {
    const {
      identifier,
      parent,
      renderParent
    } = details;
    const {
      identifier: linkFor
    } = parent || {};
    const lt = "[[".concat(identifier, "]]");
    const html = (0, _hyperhtml.default)(_templateObject2(), parent && renderParent ? "." : "", linkFor, linkFor, lt, identifier);
    return html;
  }
  /**
   * Attribute: .identifier
   */


  function renderAttribute(details) {
    const {
      parent,
      identifier,
      renderParent
    } = details;
    const {
      identifier: linkFor
    } = parent || {};
    const html = (0, _hyperhtml.default)(_templateObject3(), renderParent ? "." : "", linkFor, linkFor, identifier);
    return html;
  }
  /**
   * Method: .identifier(arg1, arg2, ...), identifier(arg1, arg2, ...)
   */


  function renderMethod(details) {
    const {
      args,
      identifier,
      type,
      parent,
      renderParent
    } = details;
    const {
      identifier: linkFor
    } = parent || {};
    const argsText = args.map(arg => "<var>".concat(arg, "</var>")).join(", ");
    const searchText = "".concat(identifier, "(").concat(args.join(", "), ")");
    const html = (0, _hyperhtml.default)(_templateObject4(), parent && renderParent ? "." : "", type, linkFor, linkFor, searchText, identifier, [argsText]);
    return html;
  }
  /**
   * Enum:
   * Identifier["enum value"]
   * Identifer / "enum value"
   */


  function renderEnum(details) {
    const {
      identifier,
      enumValue,
      parent
    } = details;
    const forContext = parent ? parent.identifier : identifier;
    const html = (0, _hyperhtml.default)(_templateObject5(), forContext, forContext, !enumValue ? "the-empty-string" : null, enumValue);
    return html;
  }
  /**
   * Exception value: "NotAllowedError"
   * Only the WebIDL spec can define exceptions
   */


  function renderException(details) {
    const {
      identifier
    } = details;
    const html = (0, _hyperhtml.default)(_templateObject6(), identifier);
    return html;
  }
  /**
   * Interface types: {{ unrestricted double }} {{long long}}
   * Only the WebIDL spec defines these types.
   */


  function renderIdlPrimitiveType(details) {
    const {
      identifier
    } = details;
    const html = (0, _hyperhtml.default)(_templateObject7(), identifier);
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
      const el = (0, _hyperhtml.default)(_templateObject8(), str);
      (0, _utils.showInlineError)(el, error.message, "Error: Invalid inline IDL string");
      return el;
    }

    const render = (0, _hyperhtml.default)(document.createDocumentFragment());
    const output = [];

    for (const details of results) {
      switch (details.type) {
        case "base":
          {
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

    const result = render(_templateObject9(), output);
    return result;
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=inline-idl-parser.js.map

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(9), __webpack_require__(77), __webpack_require__(10), __webpack_require__(13), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _utils, _biblio, _l10n, _hyperhtml, _pubsubhub) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.renderInlineCitation = renderInlineCitation;
  _exports.wireReference = wireReference;
  _exports.stringifyReference = stringifyReference;
  _exports.name = void 0;
  _hyperhtml = _interopRequireDefault(_hyperhtml);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _templateObject8() {
    const data = _taggedTemplateLiteral(["\n    <cite>\n      <a\n        href=\"", "\"\n        target=\"", "\"\n        rel=\"noopener noreferrer\">\n        ", "</a>.\n    </cite>\n    <span class=\"authors\">\n      ", "\n    </span>\n    <span class=\"publisher\">\n      ", "\n    </span>\n    <span class=\"pubDate\">\n      ", "\n    </span>\n    <span class=\"pubStatus\">\n      ", "\n    </span>\n  "]);

    _templateObject8 = function _templateObject8() {
      return data;
    };

    return data;
  }

  function _templateObject7() {
    const data = _taggedTemplateLiteral(["\n      <dt id=\"", "\">[", "]</dt>\n      <dd><em class=\"respec-offending-element\">Reference not found.</em></dd>\n    "]);

    _templateObject7 = function _templateObject7() {
      return data;
    };

    return data;
  }

  function _templateObject6() {
    const data = _taggedTemplateLiteral(["\n      <dt id=\"", "\">[", "]</dt>\n      <dd>", "</dd>\n    "]);

    _templateObject6 = function _templateObject6() {
      return data;
    };

    return data;
  }

  function _templateObject5() {
    const data = _taggedTemplateLiteral(["[<cite><a class=\"bibref\" href=\"", "\">", "</a></cite>]"]);

    _templateObject5 = function _templateObject5() {
      return data;
    };

    return data;
  }

  function _templateObject4() {
    const data = _taggedTemplateLiteral(["\n      <dl class='bibliography'>\n        ", "\n      </dl>"]);

    _templateObject4 = function _templateObject4() {
      return data;
    };

    return data;
  }

  function _templateObject3() {
    const data = _taggedTemplateLiteral(["\n      <section>\n        <h3>", "</h3>\n      </section>"]);

    _templateObject3 = function _templateObject3() {
      return data;
    };

    return data;
  }

  function _templateObject2() {
    const data = _taggedTemplateLiteral(["<p>", "</p>"]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    const data = _taggedTemplateLiteral(["\n    <section id='references' class='appendix'>\n      <h2>", "</h2>\n      ", "\n    </section>"]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  const name = "core/render-biblio";
  _exports.name = name;
  const localizationStrings = {
    en: {
      info_references: "Informative references",
      norm_references: "Normative references",
      references: "References"
    },
    nl: {
      info_references: "Informatieve referenties",
      norm_references: "Normatieve referenties",
      references: "Referenties"
    },
    es: {
      info_references: "Referencias informativas",
      norm_references: "Referencias normativas",
      references: "Referencias"
    }
  };
  const lang = _l10n.lang in localizationStrings ? _l10n.lang : "en";
  const l10n = localizationStrings[lang];
  const REF_STATUSES = new Map([["CR", "W3C Candidate Recommendation"], ["ED", "W3C Editor's Draft"], ["FPWD", "W3C First Public Working Draft"], ["LCWD", "W3C Last Call Working Draft"], ["NOTE", "W3C Note"], ["PER", "W3C Proposed Edited Recommendation"], ["PR", "W3C Proposed Recommendation"], ["REC", "W3C Recommendation"], ["WD", "W3C Working Draft"], ["WG-NOTE", "W3C Working Group Note"]]);
  const defaultsReference = Object.freeze({
    authors: [],
    date: "",
    href: "",
    publisher: "",
    status: "",
    title: "",
    etAl: false
  });
  const endWithDot = endNormalizer(".");

  function run(conf) {
    const informs = Array.from(conf.informativeReferences);
    const norms = Array.from(conf.normativeReferences);
    if (!informs.length && !norms.length && !conf.refNote) return;
    const refsec = (0, _hyperhtml.default)(_templateObject(), l10n.references, conf.refNote ? (0, _hyperhtml.default)(_templateObject2(), conf.refNote) : "");

    for (const type of ["Normative", "Informative"]) {
      const refs = type === "Normative" ? norms : informs;
      if (!refs.length) continue;
      const sec = (0, _hyperhtml.default)(_templateObject3(), type === "Normative" ? l10n.norm_references : l10n.info_references);
      (0, _utils.addId)(sec);
      const {
        goodRefs,
        badRefs
      } = refs.map(toRefContent).reduce((refObjects, ref) => {
        const refType = ref.refcontent ? "goodRefs" : "badRefs";
        refObjects[refType].push(ref);
        return refObjects;
      }, {
        goodRefs: [],
        badRefs: []
      });
      const uniqueRefs = [...goodRefs.reduce((uniqueRefs, ref) => {
        if (!uniqueRefs.has(ref.refcontent.id)) {
          // the condition ensures that only the first used [[TERM]]
          // shows up in #references section
          uniqueRefs.set(ref.refcontent.id, ref);
        }

        return uniqueRefs;
      }, new Map()).values()];
      const refsToShow = uniqueRefs.concat(badRefs).sort((a, b) => a.ref.toLocaleLowerCase().localeCompare(b.ref.toLocaleLowerCase()));
      sec.appendChild((0, _hyperhtml.default)(_templateObject4(), refsToShow.map(showRef)));
      refsec.appendChild(sec);
      const aliases = getAliases(goodRefs);
      decorateInlineReference(uniqueRefs, aliases);
      warnBadRefs(badRefs);
    }

    document.body.appendChild(refsec);
  }
  /**
   * returns refcontent and unique key for a reference among its aliases
   * and warns about circular references
   * @param {String} ref
   */


  function toRefContent(ref) {
    let refcontent = _biblio.biblio[ref];
    let key = ref;
    const circular = new Set([key]);

    while (refcontent && refcontent.aliasOf) {
      if (circular.has(refcontent.aliasOf)) {
        refcontent = null;
        const msg = "Circular reference in biblio DB between [`".concat(ref, "`] and [`").concat(key, "`].");
        (0, _pubsubhub.pub)("error", msg);
      } else {
        key = refcontent.aliasOf;
        refcontent = _biblio.biblio[key];
        circular.add(key);
      }
    }

    if (refcontent && !refcontent.id) {
      refcontent.id = ref.toLowerCase();
    }

    return {
      ref,
      refcontent
    };
  }
  /**
   * Render an inline citation
   *
   * @param {String} ref the inline reference.
   * @returns HTMLElement
   */


  function renderInlineCitation(ref) {
    const key = ref.replace(/^(!|\?)/, "");
    const href = "#bib-".concat(key.toLowerCase());
    return (0, _hyperhtml.default)(_templateObject5(), href, key);
  }
  /**
   * renders a reference
   */


  function showRef({
    ref,
    refcontent
  }) {
    const refId = "bib-".concat(ref.toLowerCase());

    if (refcontent) {
      return (0, _hyperhtml.default)(_templateObject6(), refId, ref, {
        html: stringifyReference(refcontent)
      });
    } else {
      return (0, _hyperhtml.default)(_templateObject7(), refId, ref);
    }
  }

  function endNormalizer(endStr) {
    return str => {
      const trimmed = str.trim();
      const result = !trimmed || trimmed.endsWith(endStr) ? trimmed : trimmed + endStr;
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
    return _hyperhtml.default.wire(ref)(_templateObject8(), ref.href, target, ref.title.trim(), endWithDot(authors), endWithDot(ref.publisher), endWithDot(ref.date), endWithDot(status));
  }

  function stringifyReference(ref) {
    if (typeof ref === "string") return ref;
    let output = "<cite>".concat(ref.title, "</cite>");
    output = ref.href ? "<a href=\"".concat(ref.href, "\">").concat(output, "</a>. ") : "".concat(output, ". ");

    if (ref.authors && ref.authors.length) {
      output += ref.authors.join("; ");
      if (ref.etAl) output += " et al";
      output += ". ";
    }

    if (ref.publisher) {
      output = "".concat(output, " ").concat(endWithDot(ref.publisher), " ");
    }

    if (ref.date) output += "".concat(ref.date, ". ");
    if (ref.status) output += "".concat(REF_STATUSES.get(ref.status) || ref.status, ". ");
    if (ref.href) output += "URL: <a href=\"".concat(ref.href, "\">").concat(ref.href, "</a>");
    return output;
  }
  /**
   * get aliases for a reference "key"
   */


  function getAliases(refs) {
    return refs.reduce((aliases, ref) => {
      const key = ref.refcontent.id;
      const keys = !aliases.has(key) ? aliases.set(key, []).get(key) : aliases.get(key);
      keys.push(ref.ref);
      return aliases;
    }, new Map());
  }
  /**
   * fix biblio reference URLs
   * Add title attribute to references
   */


  function decorateInlineReference(refs, aliases) {
    refs.map(({
      ref,
      refcontent
    }) => {
      const refUrl = "#bib-".concat(ref.toLowerCase());
      const selectors = aliases.get(refcontent.id).map(alias => "a.bibref[href=\"#bib-".concat(alias.toLowerCase(), "\"]")).join(",");
      const elems = document.querySelectorAll(selectors);
      return {
        refUrl,
        elems,
        refcontent
      };
    }).forEach(({
      refUrl,
      elems,
      refcontent
    }) => {
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
    badRefs.forEach(({
      ref
    }) => {
      const badrefs = [...document.querySelectorAll("a.bibref[href=\"#bib-".concat(ref.toLowerCase(), "\"]"))].filter(({
        textContent: t
      }) => t.toLowerCase() === ref.toLowerCase());
      const msg = "Bad reference: [`".concat(ref, "`] (appears ").concat(badrefs.length, " times)");
      (0, _pubsubhub.pub)("error", msg);
      console.warn("Bad references: ", badrefs);
    });
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=render-biblio.js.map

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(78), __webpack_require__(9), __webpack_require__(3), __webpack_require__(76)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _biblioDb, _utils, _pubsubhub, _renderBiblio) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.updateFromNetwork = updateFromNetwork;
  _exports.resolveRef = resolveRef;
  _exports.run = run;
  Object.defineProperty(_exports, "wireReference", {
    enumerable: true,
    get: function get() {
      return _renderBiblio.wireReference;
    }
  });
  Object.defineProperty(_exports, "stringifyReference", {
    enumerable: true,
    get: function get() {
      return _renderBiblio.stringifyReference;
    }
  });
  _exports.name = _exports.biblio = void 0;
  // Module core/biblio
  // Pre-processes bibliographic references
  // Configuration:
  //  - localBiblio: override or supplement the official biblio with your own.

  /* jshint jquery: true */
  const biblio = {}; // for backward compatibity

  _exports.biblio = biblio;
  const name = "core/biblio";
  _exports.name = name;
  const bibrefsURL = new URL("https://specref.herokuapp.com/bibrefs?refs=");
  /**
   * Normative references take precedence over informative ones,
   * so any duplicates ones are removed from the informative set.
   */

  function normalizeReferences(conf) {
    const normalizedNormativeRefs = new Set([...conf.normativeReferences].map(key => key.toLowerCase()));
    Array.from(conf.informativeReferences).filter(key => normalizedNormativeRefs.has(key.toLowerCase())).forEach(redundantKey => conf.informativeReferences.delete(redundantKey));
  }

  function getRefKeys(conf) {
    return {
      informativeReferences: Array.from(conf.informativeReferences),
      normativeReferences: Array.from(conf.normativeReferences)
    };
  } // Opportunistically dns-prefetch to bibref server, as we don't know yet
  // if we will actually need to download references yet.


  const link = (0, _utils.createResourceHint)({
    hint: "dns-prefetch",
    href: bibrefsURL.origin
  });
  document.head.appendChild(link);
  let doneResolver;
  const done = new Promise(resolve => {
    doneResolver = resolve;
  });

  async function updateFromNetwork(refs, options = {
    forceUpdate: false
  }) {
    const refsToFetch = [...new Set(refs)].filter(ref => ref.trim()); // Update database if needed, if we are online

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

    if (!options.forceUpdate && !response.ok || response.status !== 200) {
      return null;
    }

    const data = await response.json();

    try {
      await _biblioDb.biblioDB.addAll(data);
    } catch (err) {
      console.error(err);
    }

    return data;
  }
  /**
   * @param {string} key
   */


  async function resolveRef(key) {
    const biblio = await done;

    if (!biblio.hasOwnProperty(key)) {
      return null;
    }

    const entry = biblio[key];

    if (entry.aliasOf) {
      return await resolveRef(entry.aliasOf);
    }

    return entry;
  }

  async function run(conf) {
    const finish = () => {
      doneResolver(conf.biblio);
    };

    if (!conf.localBiblio) {
      conf.localBiblio = {};
    }

    if (conf.biblio) {
      let msg = "Overriding `.biblio` in config. Please use ";
      msg += "`.localBiblio` for custom biblio entries.";
      (0, _pubsubhub.pub)("warn", msg);
    }

    conf.biblio = biblio;
    const localAliases = Array.from(Object.keys(conf.localBiblio)).filter(key => conf.localBiblio[key].hasOwnProperty("aliasOf")).map(key => conf.localBiblio[key].aliasOf);
    normalizeReferences(conf);
    const allRefs = getRefKeys(conf);
    const neededRefs = allRefs.normativeReferences.concat(allRefs.informativeReferences) // Filter, as to not go to network for local refs
    .filter(key => !conf.localBiblio.hasOwnProperty(key)) // but include local aliases, in case they refer to external specs
    .concat(localAliases) // remove duplicates
    .reduce((collector, item) => {
      if (collector.indexOf(item) === -1) {
        collector.push(item);
      }

      return collector;
    }, []).sort();
    const idbRefs = []; // See if we have them in IDB

    try {
      await _biblioDb.biblioDB.ready; // can throw

      const promisesToFind = neededRefs.map(async id => ({
        id,
        data: await _biblioDb.biblioDB.find(id)
      }));
      idbRefs.push(...(await Promise.all(promisesToFind)));
    } catch (err) {
      // IndexedDB died, so we need to go to the network for all
      // references
      idbRefs.push(...neededRefs.map(id => ({
        id,
        data: null
      })));
      console.warn(err);
    }

    const split = {
      hasData: [],
      noData: []
    };
    idbRefs.forEach(ref => {
      (ref.data ? split.hasData : split.noData).push(ref);
    });
    split.hasData.forEach(ref => {
      biblio[ref.id] = ref.data;
    });
    const externalRefs = split.noData.map(item => item.id);

    if (externalRefs.length) {
      // Going to the network for refs we don't have
      const data = await updateFromNetwork(externalRefs, {
        forceUpdate: true
      });
      Object.assign(biblio, data);
    }

    Object.assign(biblio, conf.localBiblio);
    finish();
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=biblio.js.map

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(9), __webpack_require__(79), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _utils, _idb, _pubsubhub) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.biblioDB = _exports.name = void 0;

  /**
   * Module core/biblio-db
   *
   * Wraps IndexedDB, allowing the storage of references and aliases on the
   * client.
   *
   * It's a standalone module that can be imported into other modules.
   *
   */
  const name = "core/biblio-db";
  _exports.name = name;
  const ALLOWED_TYPES = new Set(["alias", "reference"]);
  /* Database initialization tracker */

  const readyPromise = openIdb();

  async function openIdb() {
    const {
      openDB
    } = await (0, _idb.importIdb)();
    return await openDB("respec-biblio2", 12, {
      upgrade(db) {
        Array.from(db.objectStoreNames).map(storeName => db.deleteObjectStore(storeName));
        const store = db.createObjectStore("alias", {
          keyPath: "id"
        });
        store.createIndex("aliasOf", "aliasOf", {
          unique: false
        });
        db.createObjectStore("reference", {
          keyPath: "id"
        });
      }

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
     * @param {String} type One of the ALLOWED_TYPES.
     * @param {String} id The reference to find.
     * @return {Promise<Boolean>} True if it has it, false otherwise.
     */
    async has(type, id) {
      if (!ALLOWED_TYPES.has(type)) {
        throw new TypeError("Invalid type: ".concat(type));
      }

      if (!id) {
        throw new TypeError("id is required");
      }

      const db = await this.ready;
      const objectStore = db.transaction([type], "readonly").objectStore(type);
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
      if (!id) {
        throw new TypeError("id is required");
      }

      const db = await this.ready;
      const objectStore = db.transaction(["alias"], "readonly").objectStore("alias");
      const range = IDBKeyRange.only(id);
      const result = await objectStore.openCursor(range);
      return !!result;
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
      const objectStore = db.transaction("alias", "readonly").objectStore("alias");
      const range = IDBKeyRange.only(id);
      const result = await objectStore.openCursor(range);
      return result ? result.value.aliasOf : result;
    },

    /**
     * Get a reference or alias out of the database.
     *
     * @param {String} type The type as per ALLOWED_TYPES.
     * @param {[type]} id The id for what to look up.
     * @return {Promise<Object?>} Resolves with the retrieved object, or null.
     */
    async get(type, id) {
      if (!ALLOWED_TYPES.has(type)) {
        throw new TypeError("Invalid type: ".concat(type));
      }

      if (!id) {
        throw new TypeError("id is required");
      }

      const db = await this.ready;
      const objectStore = db.transaction([type], "readonly").objectStore(type);
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
        reference: new Set()
      };
      Object.keys(data).filter(key => {
        if (typeof data[key] === "string") {
          let msg = "Legacy SpecRef entries are not supported: `[[".concat(key, "]]`. ");
          msg += "Please update it to the new format at [specref repo](https://github.com/tobie/specref/)";
          (0, _pubsubhub.pub)("error", msg);
          return false;
        }

        return true;
      }).map(id => Object.assign({
        id
      }, data[id])).forEach(obj => {
        if (obj.aliasOf) {
          aliasesAndRefs.alias.add(obj);
        } else {
          aliasesAndRefs.reference.add(obj);
        }
      });
      const promisesToAdd = Object.keys(aliasesAndRefs).map(type => {
        return Array.from(aliasesAndRefs[type]).map(details => this.add(type, details));
      }).reduce(_utils.flatten, []);
      await Promise.all(promisesToAdd);
    },

    /**
     * Adds a reference or alias to the database.
     *
     * @param {String} type The type as per ALLOWED_TYPES.
     * @param {String} details The object to store.
     */
    async add(type, details) {
      if (!ALLOWED_TYPES.has(type)) {
        throw new TypeError("Invalid type: ".concat(type));
      }

      if (typeof details !== "object") {
        throw new TypeError("details should be an object");
      }

      if (type === "alias" && !details.hasOwnProperty("aliasOf")) {
        throw new TypeError("Invalid alias object.");
      }

      const db = await this.ready;
      const isInDB = await this.has(type, details.id);
      const store = db.transaction([type], "readwrite").objectStore(type); // update or add, depending of already having it in db

      return isInDB ? await store.put(details) : await store.add(details);
    },

    /**
     * Closes the underlying database.
     *
     * @return {Promise} Resolves after database closes.
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
      const stores = await db.transaction(storeNames, "readwrite");
      const clearStorePromises = storeNames.map(name => {
        return stores.objectStore(name).clear();
      });
      await Promise.all(clearStorePromises);
    }

  };
  _exports.biblioDB = biblioDB;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=biblio-db.js.map

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.importIdb = importIdb;

  /**
   * Temporary workaround until browsers get import-maps
   */
  async function importIdb() {
    try {
      return await new Promise(resolve => Promise.resolve(/* AMD require */).then(function() { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__(163)]; (resolve).apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__);}.bind(this)).catch(__webpack_require__.oe));
    } catch (_unused) {
      return await new Promise(resolve => Promise.resolve(/* AMD require */).then(function() { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [!(function webpackMissingModule() { var e = new Error("Cannot find module '../../node_modules/idb/build/esm/index.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())]; (resolve).apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__);}.bind(this)).catch(__webpack_require__.oe));
    }
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=idb.js.map

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(13), __webpack_require__(9), __webpack_require__(3), __webpack_require__(76), __webpack_require__(74)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _hyperhtml, _utils, _pubsubhub, _renderBiblio, _inlines) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  _hyperhtml = _interopRequireDefault(_hyperhtml);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _templateObject2() {
    const data = _taggedTemplateLiteral(["\n          <p>\n            The key word", " ", " in this document\n            ", " to be interpreted as described in\n            <a href=\"https://tools.ietf.org/html/bcp14\">BCP 14</a>\n            ", "\n            ", " when, and only when, they appear\n            in all capitals, as shown here.\n          </p>\n        "]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    const data = _taggedTemplateLiteral(["\n    <h2>Conformance</h2>\n    <p>\n      As well as sections marked as non-normative, all authoring guidelines,\n      diagrams, examples, and notes in this specification are non-normative.\n      Everything else in this specification is normative.\n    </p>\n    ", "\n  "]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  const name = "w3c/conformance";
  /**
   * @param {Element} conformance
   * @param {*} conf
   */

  _exports.name = name;

  function processConformance(conformance, conf) {
    const terms = [...Object.keys(_inlines.rfc2119Usage)]; // Add RFC2119 to blibliography

    if (terms.length) {
      conf.normativeReferences.add("RFC2119");
      conf.normativeReferences.add("RFC8174");
    } // Put in the 2119 clause and reference


    const keywords = (0, _utils.joinAnd)(terms.sort(), item => "<em class=\"rfc2119\">".concat(item, "</em>"));
    const plural = terms.length > 1;
    const content = (0, _hyperhtml.default)(_templateObject(), terms.length ? (0, _hyperhtml.default)(_templateObject2(), plural ? "s" : "", [keywords], plural ? "are" : "is", (0, _renderBiblio.renderInlineCitation)("RFC2119"), (0, _renderBiblio.renderInlineCitation)("RFC8174")) : null);
    conformance.prepend(...content.childNodes);
  }

  function run(conf) {
    const conformance = document.querySelector("section#conformance");

    if (conformance) {
      processConformance(conformance, conf);
    } // Added message for legacy compat with Aria specs
    // See https://github.com/w3c/respec/issues/793


    (0, _pubsubhub.pub)("end", name);
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=conformance.js.map

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(9), __webpack_require__(56)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _utils, _dfnMap) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  // @ts-check
  // Module core/dfn
  // - Finds all <dfn> elements and populates conf.definitionMap to identify them.
  const name = "core/dfn";
  _exports.name = name;

  function run() {
    document.querySelectorAll("dfn").forEach(dfn => {
      // /** @type {HTMLElement} */
      // const closestDfn = dfn.closest("[data-dfn-for]");
      // if (closestDfn && closestDfn !== dfn && !dfn.dataset.dfnFor) {
      //   dfn.dataset.dfnFor = closestDfn.dataset.dfnFor;
      // }
      const titles = (0, _utils.getDfnTitles)(dfn);
      (0, _dfnMap.registerDefinition)(dfn, titles);
      if (titles.length) dfn.dataset.lt = titles.join("|");
      if (!dfn.dataset.dfnType) dfn.dataset.dfnType = "dfn";
    });
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=dfn.js.map

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(83), __webpack_require__(9), __webpack_require__(56)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _pluralize, _utils, _dfnMap) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  // @ts-check
  // Adds automatic pluralization to dfns
  // If a dfn is referenced as it's plural (and plural of `data-lt` attributes),
  //   plurals of it are automatically added to `data-plurals`.
  // The linking is done in core/link-to-dfn
  const name = "core/pluralize";
  _exports.name = name;

  function run(conf) {
    if (!conf.pluralize) return;
    const pluralizeDfn = getPluralizer();
    /** @type {NodeListOf<HTMLElement>} */

    const dfns = document.querySelectorAll("dfn:not([data-lt-no-plural]):not([data-lt-noDefault])");
    dfns.forEach(dfn => {
      const terms = [dfn.textContent];
      if (dfn.dataset.lt) terms.push(...dfn.dataset.lt.split("|"));
      const plurals = new Set(terms.map(pluralizeDfn).filter(plural => plural));

      if (plurals.size) {
        const userDefinedPlurals = dfn.dataset.plurals ? dfn.dataset.plurals.split("|") : [];
        const uniquePlurals = [...new Set([...userDefinedPlurals, ...plurals])];
        dfn.dataset.plurals = uniquePlurals.join("|");
        (0, _dfnMap.registerDefinition)(dfn, uniquePlurals);
      }
    });
  }

  function getPluralizer() {
    /** @type {Set<string>} */
    const links = new Set();
    /** @type {NodeListOf<HTMLAnchorElement>} */

    const reflessAnchors = document.querySelectorAll("a:not([href])");
    reflessAnchors.forEach(el => {
      const normText = (0, _utils.norm)(el.textContent);
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
      const normText = (0, _utils.norm)(dfn.textContent);
      dfnTexts.add(normText);

      if (dfn.dataset.lt) {
        dfn.dataset.lt.split("|").forEach(lt => dfnTexts.add(lt));
      }
    }); // returns pluralized/singularized term if `text` needs pluralization/singularization, "" otherwise

    return function pluralizeDfn(
    /** @type {string} */
    text) {
      const normText = (0, _utils.norm)(text);
      const plural = (0, _pluralize.isSingular)(normText) ? (0, _pluralize.plural)(normText) : (0, _pluralize.singular)(normText);
      return links.has(plural) && !dfnTexts.has(plural) ? plural : "";
    };
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=pluralize.js.map

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

/* global define */

(function (root, pluralize) {
  /* istanbul ignore else */
  if (true) {
    // Node.
    module.exports = pluralize();
  } else {}
})(this, function () {
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


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(9), __webpack_require__(85), __webpack_require__(10), __webpack_require__(13), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _utils, _examples, _l10n, _hyperhtml, _pubsubhub) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  _examples = _interopRequireDefault(_examples);
  _hyperhtml = _interopRequireDefault(_hyperhtml);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _templateObject4() {
    const data = _taggedTemplateLiteral(["\n        <div class=\"example\" id=\"", "\">\n          ", " ", "\n        </div>\n      "]);

    _templateObject4 = function _templateObject4() {
      return data;
    };

    return data;
  }

  function _templateObject3() {
    const data = _taggedTemplateLiteral(["\n      <style>\n        ", "\n      </style>\n    "]);

    _templateObject3 = function _templateObject3() {
      return data;
    };

    return data;
  }

  function _templateObject2() {
    const data = _taggedTemplateLiteral(["\n    <div class=\"marker\">\n      <a class=\"self-link\">", "<bdi>", "</bdi></a\n      >", "\n    </div>\n  "]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    const data = _taggedTemplateLiteral(["\n        <span class=\"example-title\">: ", "</span>\n      "]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  const name = "core/examples";
  _exports.name = name;
  const localizationStrings = {
    en: {
      example: "Example"
    },
    nl: {
      example: "Voorbeeld"
    },
    es: {
      example: "Ejemplo"
    }
  };
  const lang = _l10n.lang in localizationStrings ? _l10n.lang : "en";
  const l10n = localizationStrings[lang];
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
    const number = num > 0 ? " ".concat(num) : "";
    const title = report.title ? (0, _hyperhtml.default)(_templateObject(), report.title) : "";
    return (0, _hyperhtml.default)(_templateObject2(), l10n.example, number, title);
  }

  function run() {
    /** @type {NodeListOf<HTMLElement>} */
    const examples = document.querySelectorAll("pre.example, pre.illegal-example, aside.example");
    if (!examples.length) return;
    document.head.insertBefore((0, _hyperhtml.default)(_templateObject3(), _examples.default), document.querySelector("link"));
    let number = 0;
    examples.forEach(example => {
      const illegal = example.classList.contains("illegal-example");
      /** @type {Report} */

      const report = {
        number,
        illegal
      };
      const {
        title
      } = example;

      if (example.localName === "aside") {
        ++number;
        const div = makeTitle(example, number, report);
        example.prepend(div);

        if (title) {
          (0, _utils.addId)(example, "example-".concat(number), title); // title gets used
        } else {
          // use the number as the title... so, e.g., "example-5"
          (0, _utils.addId)(example, "example", String(number));
        }

        const {
          id
        } = example;
        const selfLink = div.querySelector("a.self-link");
        selfLink.href = "#".concat(id);
        (0, _pubsubhub.pub)("example", report);
      } else {
        const inAside = !!example.closest("aside");
        if (!inAside) ++number;
        report.content = example.innerHTML; // wrap

        example.classList.remove("example", "illegal-example"); // relocate the id to the div

        const id = example.id ? example.id : null;
        if (id) example.removeAttribute("id");
        const exampleTitle = makeTitle(example, inAside ? 0 : number, report);
        const div = (0, _hyperhtml.default)(_templateObject4(), id, exampleTitle, example.cloneNode(true));

        if (title) {
          (0, _utils.addId)(div, "example-".concat(number), title);
        }

        (0, _utils.addId)(div, "example", String(number));
        const selfLink = div.querySelector("a.self-link");
        selfLink.href = "#".concat(div.id);
        example.replaceWith(div);
        if (!inAside) (0, _pubsubhub.pub)("example", report);
      }
    });
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=examples.js.map

/***/ }),
/* 85 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("/* --- EXAMPLES --- */\nspan.example-title {\n    text-transform: none;\n}\naside.example, div.example, div.illegal-example {\n    padding: 0.5em;\n    margin: 1em 0;\n    position: relative;\n    clear: both;\n}\ndiv.illegal-example { color: red }\ndiv.illegal-example p { color: black }\naside.example, div.example {\n    padding: .5em;\n    border-left-width: .5em;\n    border-left-style: solid;\n    border-color: #e0cb52;\n    background: #fcfaee;\n}\n\naside.example div.example {\n    border-left-width: .1em;\n    border-color: #999;\n    background: #fff;\n}\naside.example div.example span.example-title {\n    color: #999;\n}\n");

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(9), __webpack_require__(87), __webpack_require__(10), __webpack_require__(88), __webpack_require__(13), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _utils, _issuesNotes, _l10n, _githubApi, _hyperhtml, _pubsubhub) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  _issuesNotes = _interopRequireDefault(_issuesNotes);
  _hyperhtml = _interopRequireDefault(_hyperhtml);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _templateObject11() {
    const data = _taggedTemplateLiteral(["<style>", "</style>"]);

    _templateObject11 = function _templateObject11() {
      return data;
    };

    return data;
  }

  function _templateObject10() {
    const data = _taggedTemplateLiteral(["<a\n    class=\"", "\"\n    style=\"", "\"\n    href=\"", "\">", "</a>"]);

    _templateObject10 = function _templateObject10() {
      return data;
    };

    return data;
  }

  function _templateObject9() {
    const data = _taggedTemplateLiteral(["<span class=\"issue-label\">: ", "", "</span>"]);

    _templateObject9 = function _templateObject9() {
      return data;
    };

    return data;
  }

  function _templateObject8() {
    const data = _taggedTemplateLiteral(["<span\n      class=\"issue-label\"\n      aria-label=\"", "\">: ", "", "</span>"]);

    _templateObject8 = function _templateObject8() {
      return data;
    };

    return data;
  }

  function _templateObject7() {
    const data = _taggedTemplateLiteral(["<p>", "</p>"]);

    _templateObject7 = function _templateObject7() {
      return data;
    };

    return data;
  }

  function _templateObject6() {
    const data = _taggedTemplateLiteral(["\n    <li><a href=\"", "\">", "</a>", "</li>\n  "]);

    _templateObject6 = function _templateObject6() {
      return data;
    };

    return data;
  }

  function _templateObject5() {
    const data = _taggedTemplateLiteral(["<span style=\"text-transform: none\">: ", "</span>"]);

    _templateObject5 = function _templateObject5() {
      return data;
    };

    return data;
  }

  function _templateObject4() {
    const data = _taggedTemplateLiteral(["<a href='", "'/>"]);

    _templateObject4 = function _templateObject4() {
      return data;
    };

    return data;
  }

  function _templateObject3() {
    const data = _taggedTemplateLiteral(["<a href='", "'/>"]);

    _templateObject3 = function _templateObject3() {
      return data;
    };

    return data;
  }

  function _templateObject2() {
    const data = _taggedTemplateLiteral(["\n        <div role='heading' class='", "'>", "</div>"]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    const data = _taggedTemplateLiteral(["<div class=\"", "\" role=\"", "\"></div>"]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  /**
   * @typedef {import("./github-api").GitHubIssue} GitHubIssue
   * @typedef {import("./github-api").GitHubLabel} GitHubLabel
   */
  const name = "core/issues-notes";
  _exports.name = name;
  const localizationStrings = {
    en: {
      issue_summary: "Issue Summary",
      no_issues_in_spec: "There are no issues listed in this specification."
    },
    nl: {
      issue_summary: "Lijst met issues",
      no_issues_in_spec: "Er zijn geen problemen vermeld in deze specificatie."
    },
    es: {
      issue_summary: "Resumen de la cuestión",
      no_issues_in_spec: "No hay problemas enumerados en esta especificación."
    }
  };
  const lang = _l10n.lang in localizationStrings ? _l10n.lang : "en";
  const l10n = localizationStrings[lang];
  /**
   * @typedef {object} Report
   * @property {string} type
   * @property {boolean} inline
   * @property {number} number
   * @property {string} title
   *
   * @param {NodeListOf<HTMLElement>} ins
   * @param {Map<number, GitHubIssue>} ghIssues
   * @param {*} conf
   */

  function handleIssues(ins, ghIssues, conf) {
    const hasDataNum = !!document.querySelector(".issue[data-number]");
    let issueNum = 0;
    const issueList = document.createElement("ul");
    ins.forEach(inno => {
      const {
        type,
        displayType,
        isFeatureAtRisk
      } = getIssueType(inno, conf);
      const isIssue = type === "issue";
      const isInline = inno.localName === "span";
      const {
        number: dataNum
      } = inno.dataset;
      /** @type {Partial<Report>} */

      const report = {
        type,
        inline: isInline,
        title: inno.title
      };

      if (isIssue && !isInline && !hasDataNum) {
        issueNum++;
        report.number = issueNum;
      } else if (dataNum) {
        report.number = Number(dataNum);
      } // wrap


      if (!isInline) {
        const cssClass = isFeatureAtRisk ? "".concat(type, " atrisk") : type;
        const ariaRole = type === "note" ? "note" : null;
        const div = (0, _hyperhtml.default)(_templateObject(), cssClass, ariaRole);
        const title = document.createElement("span");
        const titleParent = (0, _hyperhtml.default)(_templateObject2(), "".concat(type, "-title marker"), title);
        (0, _utils.addId)(titleParent, "h", type);
        let text = displayType;

        if (inno.id) {
          div.id = inno.id;
          inno.removeAttribute("id");
        } else {
          (0, _utils.addId)(div, "issue-container", report.number ? "number-".concat(report.number) : "");
        }
        /** @type {GitHubIssue} */


        let ghIssue;

        if (isIssue) {
          if (!hasDataNum) {
            text += " ".concat(issueNum);
          } else if (dataNum) {
            text += " ".concat(dataNum);
            const link = linkToIssueTracker(dataNum, conf, {
              isFeatureAtRisk
            });

            if (link) {
              title.before(link);
              link.append(title);
            }

            title.classList.add("issue-number");
            ghIssue = ghIssues.get(Number(dataNum));

            if (ghIssue && !report.title) {
              report.title = ghIssue.title;
            }
          }

          if (report.number !== undefined) {
            // Add entry to #issue-summary.
            issueList.append(createIssueSummaryEntry(conf.l10n.issue, report, div.id));
          }
        }

        title.textContent = text;

        if (report.title) {
          inno.removeAttribute("title");
          const {
            repoURL = ""
          } = conf.github || {};
          const labels = ghIssue ? ghIssue.labels : [];

          if (ghIssue && ghIssue.state === "closed") {
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
          body = document.createRange().createContextualFragment(ghIssue.body_html);
        }

        div.append(titleParent, body);
        const level = (0, _utils.parents)(titleParent, "section").length + 2;
        titleParent.setAttribute("aria-level", level);
      }

      (0, _pubsubhub.pub)(report.type, report);
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
    const type = isIssue ? "issue" : isWarning ? "warning" : isEdNote ? "ednote" : "note";
    const displayType = isIssue ? isFeatureAtRisk ? conf.l10n.feature_at_risk : conf.l10n.issue : isWarning ? conf.l10n.warning : isEdNote ? conf.l10n.editors_note : conf.l10n.note;
    return {
      type,
      displayType,
      isFeatureAtRisk
    };
  }
  /**
   * @param {string} dataNum
   * @param {*} conf
   */


  function linkToIssueTracker(dataNum, conf, {
    isFeatureAtRisk = false
  } = {}) {
    // Set issueBase to cause issue to be linked to the external issue tracker
    if (!isFeatureAtRisk && conf.issueBase) {
      return (0, _hyperhtml.default)(_templateObject3(), conf.issueBase + dataNum);
    } else if (isFeatureAtRisk && conf.atRiskBase) {
      return (0, _hyperhtml.default)(_templateObject4(), conf.atRiskBase + dataNum);
    }
  }
  /**
   * @param {string} l10nIssue
   * @param {Partial<Report>} report
   */


  function createIssueSummaryEntry(l10nIssue, report, id) {
    const issueNumberText = "".concat(l10nIssue, " ").concat(report.number);
    const title = report.title ? (0, _hyperhtml.default)(_templateObject5(), report.title) : "";
    return (0, _hyperhtml.default)(_templateObject6(), "#".concat(id), issueNumberText, title);
  }
  /**
   *
   * @param {HTMLUListElement} issueList
   */


  function makeIssueSectionSummary(issueList) {
    const issueSummaryElement = document.getElementById("issue-summary");
    if (!issueSummaryElement) return;
    const heading = issueSummaryElement.querySelector("h2, h3, h4, h5, h6");
    issueList.hasChildNodes() ? issueSummaryElement.append(issueList) : issueSummaryElement.append((0, _hyperhtml.default)(_templateObject7(), l10n.no_issues_in_spec));

    if (!heading || heading && heading !== issueSummaryElement.firstElementChild) {
      issueSummaryElement.insertAdjacentHTML("afterbegin", "<h2>".concat(l10n.issue_summary, "</h2>"));
    }
  }

  function isLight(rgb) {
    const red = rgb >> 16 & 0xff;
    const green = rgb >> 8 & 0xff;
    const blue = rgb >> 0 & 0xff;
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
    const joinedNames = (0, _utils.joinAnd)(labelNames);

    if (labelsGroup.length) {
      labelsGroup.unshift(document.createTextNode(" "));
    }

    if (labelNames.length) {
      const ariaLabel = "This issue is labelled as ".concat(joinedNames, ".");
      return (0, _hyperhtml.default)(_templateObject8(), ariaLabel, title, labelsGroup);
    }

    return (0, _hyperhtml.default)(_templateObject9(), title, labelsGroup);
  }
  /**
   * @param {GitHubLabel} label
   * @param {string} repoURL
   */


  function createLabel(label, repoURL) {
    const {
      color,
      name
    } = label;
    const issuesURL = new URL("./issues/", repoURL);
    issuesURL.searchParams.set("q", "is:issue is:open label:\"".concat(label.name, "\""));
    const rgb = parseInt(color, 16);
    const textColorClass = isNaN(rgb) || isLight(rgb) ? "light" : "dark";
    const cssClasses = "respec-gh-label respec-label-".concat(textColorClass);
    const style = "background-color: #".concat(color);
    return (0, _hyperhtml.default)(_templateObject10(), cssClasses, style, issuesURL.href, name);
  }

  async function run(conf) {
    const query = ".issue, .note, .warning, .ednote";
    /** @type {NodeListOf<HTMLElement>} */

    const issuesAndNotes = document.querySelectorAll(query);

    if (!issuesAndNotes.length) {
      return; // nothing to do.
    }
    /** @type {Map<number, GitHubIssue>} */


    const ghIssues = conf.githubAPI ? await (0, _githubApi.fetchAndStoreGithubIssues)(conf) : new Map();
    const {
      head: headElem
    } = document;
    headElem.insertBefore((0, _hyperhtml.default)(_templateObject11(), [_issuesNotes.default]), headElem.querySelector("link"));
    handleIssues(issuesAndNotes, ghIssues, conf);
    const ednotes = document.querySelectorAll(".ednote");
    ednotes.forEach(ednote => {
      ednote.classList.remove("ednote");
      ednote.classList.add("note");
    });
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=issues-notes.js.map

/***/ }),
/* 87 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("/* --- ISSUES/NOTES --- */\n.issue-label {\n    text-transform: initial;\n}\n\n.warning > p:first-child { margin-top: 0 }\n.warning {\n    padding: .5em;\n    border-left-width: .5em;\n    border-left-style: solid;\n}\nspan.warning { padding: .1em .5em .15em; }\n\n.issue.closed span.issue-number {\n    text-decoration: line-through;\n}\n\n.warning {\n    border-color: #f11;\n    border-width: .2em;\n    border-style: solid;\n    background: #fbe9e9;\n}\n\n.warning-title:before{\n    content: \"⚠\"; /*U+26A0 WARNING SIGN*/\n    font-size: 3em;\n    float: left;\n    height: 100%;\n    padding-right: .3em;\n    vertical-align: top;\n    margin-top: -0.5em;\n}\n\nli.task-list-item {\n    list-style: none;\n}\n\ninput.task-list-item-checkbox {\n    margin: 0 0.35em 0.25em -1.6em;\n    vertical-align: middle;\n}\n\n.issue a.respec-gh-label {\n  padding: 5px;\n  margin: 0 2px 0 2px;\n  font-size: 10px;\n  text-transform: none;\n  text-decoration: none;\n  font-weight: bold;\n  border-radius: 4px;\n  position: relative;\n  bottom: 2px;\n  border: none;\n}\n\n.issue a.respec-label-dark {\n  color: #fff;\n  background-color: #000;\n}\n\n.issue a.respec-label-light {\n  color: #000;\n  background-color: #fff;\n}\n");

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(9), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _utils, _pubsubhub) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.githubRequestHeaders = githubRequestHeaders;
  _exports.checkLimitReached = checkLimitReached;
  _exports.fetchAndStoreGithubIssues = fetchAndStoreGithubIssues;
  _exports.fetchAll = fetchAll;
  _exports.name = void 0;
  const name = "core/github-api";
  _exports.name = name;

  function githubRequestHeaders(conf) {
    const {
      githubUser,
      githubToken
    } = conf;
    const headers = {
      // Get back HTML content instead of markdown
      // See: https://developer.github.com/v3/media/
      Accept: "application/vnd.github.v3.html+json"
    };

    if (githubUser && githubToken) {
      const credentials = btoa("".concat(githubUser, ":").concat(githubToken));
      const Authorization = "Basic ".concat(credentials);
      Object.assign(headers, {
        Authorization
      });
    } else if (githubToken) {
      const Authorization = "token ".concat(githubToken);
      Object.assign(headers, {
        Authorization
      });
    }

    return headers;
  }

  function checkLimitReached(response) {
    const {
      headers,
      status
    } = response;

    if (status === 403 && headers.get("X-RateLimit-Remaining") === "0") {
      if (typeof checkLimitReached.warned === "undefined") {
        checkLimitReached.warned = true;
        const msg = "You have run out of github requests. Some github assets will not show up.";
        (0, _pubsubhub.pub)("warning", msg);
      }

      return true;
    }

    return false;
  }

  async function fetchAndStoreGithubIssues(conf) {
    const {
      githubAPI
    } = conf;
    const specIssues = document.querySelectorAll(".issue[data-number]");
    const issuePromises = [...specIssues].map(elem => Number.parseInt(elem.dataset.number, 10)).filter(issueNumber => issueNumber).map(async issueNumber => {
      const issueURL = "".concat(githubAPI, "/issues/").concat(issueNumber);
      const headers = githubRequestHeaders(conf);
      const request = new Request(issueURL, {
        mode: "cors",
        referrerPolicy: "no-referrer",
        headers
      });
      const response = await (0, _utils.fetchAndCache)(request);
      return processResponse(response, issueNumber);
    });
    const issues = await Promise.all(issuePromises);
    return new Map(issues);
  }
  /**
   * @typedef {object} GitHubLabel
   * @property {string} color
   * @property {string} name
   *
   * @typedef {object} GitHubIssue
   * @property {string} title
   * @property {number} number
   * @property {string} state
   * @property {string} message
   * @property {string} body_html
   * @property {GitHubLabel[]} labels
   *
   * @param {Response} response
   * @param {number} issueNumber
   * @returns {[number, GitHubIssue]}
   */


  async function processResponse(response, issueNumber) {
    // "message" is always error message from GitHub
    checkLimitReached(response);
    const issue = {
      title: "",
      number: issueNumber,
      state: "",
      message: ""
    };

    try {
      const json = await response.json();
      Object.assign(issue, json);
    } catch (err) {
      console.error(err);
      issue.message = "Error JSON parsing issue #".concat(issueNumber, " from GitHub.");
    }

    if (!response.ok || issue.message) {
      const msg = "Error fetching issue #".concat(issueNumber, " from GitHub. ").concat(issue.message, " (HTTP Status ").concat(response.status, ").");
      (0, _pubsubhub.pub)("error", msg);
    }

    return [issueNumber, issue];
  }

  function findNext(header) {
    // Finds the next URL of paginated resources which
    // is available in the Link header. Link headers look like this:
    // Link: <url1>; rel="next", <url2>; rel="foo"; bar="baz"
    // More info here: https://developer.github.com/v3/#link-header
    const m = (header || "").match(/<([^>]+)>\s*;\s*rel="next"/);
    return m ? m[1] : null;
  }

  async function fetchAll(url, headers, output = []) {
    const urlObj = new URL(url);

    if (urlObj.searchParams && !urlObj.searchParams.has("per_page")) {
      urlObj.searchParams.append("per_page", "100");
    }

    const request = new Request(urlObj, {
      headers
    });
    request.headers.set("Accept", "application/vnd.github.v3+json");
    const response = await fetch(request);
    const json = await response.json();

    if (Array.isArray(json)) {
      output.push(...json);
    }

    const next = findNext(response.headers.get("Link"));
    return next ? fetchAll(next, headers, output) : output;
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=github-api.js.map

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(13), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _hyperhtml, _pubsubhub) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  _hyperhtml = _interopRequireDefault(_hyperhtml);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _templateObject() {
    const data = _taggedTemplateLiteral(["<a href=\"", "\">Req. ", "</a>"]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  const name = "core/requirements";
  _exports.name = name;

  function run() {
    document.querySelectorAll(".req").forEach((req, i) => {
      const frag = "#".concat(req.getAttribute("id"));
      const el = (0, _hyperhtml.default)(_templateObject(), frag, i + 1);
      req.prepend(el, ": ");
    });
    document.querySelectorAll("a.reqRef[href]").forEach(ref => {
      const href = ref.getAttribute("href");
      const id = href.substring(1); // href looks like `#id`

      const req = document.getElementById(id);
      let txt;

      if (req) {
        txt = req.querySelector("a:first-child").textContent;
      } else {
        txt = "Req. not found '".concat(id, "'");
        const msg = "Requirement not found in element `a.reqRef`: ".concat(id);
        (0, _pubsubhub.pub)("error", msg);
        console.warn(msg, ref);
      }

      ref.textContent = txt;
    });
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=requirements.js.map

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(9), __webpack_require__(10), __webpack_require__(13), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _utils, _l10n, _hyperhtml, _pubsubhub) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  _hyperhtml = _interopRequireDefault(_hyperhtml);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _templateObject4() {
    const data = _taggedTemplateLiteral(["<h2>Best Practices Summary</h2>"]);

    _templateObject4 = function _templateObject4() {
      return data;
    };

    return data;
  }

  function _templateObject3() {
    const data = _taggedTemplateLiteral(["", ": ", ""]);

    _templateObject3 = function _templateObject3() {
      return data;
    };

    return data;
  }

  function _templateObject2() {
    const data = _taggedTemplateLiteral(["\n        <li>\n          ", ": ", "\n        </li>\n      "]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    const data = _taggedTemplateLiteral(["\n      <a class=\"marker self-link\" href=\"", "\"><bdi lang=\"", "\">", "", "</bdi></a>"]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  const name = "core/best-practices";
  _exports.name = name;
  const localizationStrings = {
    en: {
      best_practice: "Best Practice "
    }
  };
  const lang = _l10n.lang in localizationStrings ? _l10n.lang : "en";

  function run() {
    /** @type {NodeListOf<HTMLElement>} */
    const bps = document.querySelectorAll(".practicelab");
    const l10n = localizationStrings[lang];
    const bpSummary = document.getElementById("bp-summary");
    const summaryItems = bpSummary ? document.createElement("ul") : null;
    [...bps].forEach((bp, num) => {
      const id = (0, _utils.addId)(bp, "bp");
      const localizedBpName = (0, _hyperhtml.default)(_templateObject(), "#".concat(id), lang, l10n.best_practice, num + 1); // Make the summary items, if we have a summary

      if (summaryItems) {
        const li = (0, _hyperhtml.default)(_templateObject2(), localizedBpName, (0, _utils.makeSafeCopy)(bp));
        summaryItems.appendChild(li);
      }

      const container = bp.closest("div");

      if (!container) {
        // This is just an inline best practice...
        bp.classList.add("advisement");
        return;
      } // Make the advisement box


      container.classList.add("advisement");
      const title = (0, _hyperhtml.default)(_templateObject3(), localizedBpName.cloneNode(true), bp);
      container.prepend(...title.childNodes);
    });

    if (bps.length) {
      if (bpSummary) {
        bpSummary.appendChild((0, _hyperhtml.default)(_templateObject4()));
        bpSummary.appendChild(summaryItems);
      }
    } else if (bpSummary) {
      (0, _pubsubhub.pub)("warn", "Using best practices summary (#bp-summary) but no best practices found.");
      bpSummary.remove();
    }
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=best-practices.js.map

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(9), __webpack_require__(10), __webpack_require__(13)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _utils, _l10n, _hyperhtml) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  _hyperhtml = _interopRequireDefault(_hyperhtml);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _templateObject5() {
    const data = _taggedTemplateLiteral(["<li class='tofline'>\n    <a class='tocxref' href='", "'>", "</a>\n  </li>"]);

    _templateObject5 = function _templateObject5() {
      return data;
    };

    return data;
  }

  function _templateObject4() {
    const data = _taggedTemplateLiteral(["<bdi class='figno'>", "</bdi>"]);

    _templateObject4 = function _templateObject4() {
      return data;
    };

    return data;
  }

  function _templateObject3() {
    const data = _taggedTemplateLiteral(["<span class='fig-title'>"]);

    _templateObject3 = function _templateObject3() {
      return data;
    };

    return data;
  }

  function _templateObject2() {
    const data = _taggedTemplateLiteral(["<ul class='tof'>", "</ul>"]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    const data = _taggedTemplateLiteral(["<h2>", "</h2>"]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  const name = "core/figures";
  _exports.name = name;
  const localizationStrings = {
    en: {
      list_of_figures: "List of Figures",
      fig: "Figure "
    },
    ja: {
      fig: "図",
      list_of_figures: "図のリスト"
    },
    ko: {
      fig: "그림 ",
      list_of_figures: "그림 목록"
    },
    nl: {
      fig: "Figuur ",
      list_of_figures: "Lijst met figuren"
    },
    es: {
      fig: "Figura ",
      list_of_figures: "Lista de Figuras"
    },
    zh: {
      fig: "圖 ",
      list_of_figures: "List of Figures"
    }
  };
  const lang = _l10n.lang in localizationStrings ? _l10n.lang : "en";
  const l10n = localizationStrings[lang];

  function run() {
    normalizeImages(document);
    const tof = collectFigures(); // Create a Table of Figures if a section with id 'tof' exists.

    const tofElement = document.getElementById("tof");

    if (tof.length && tofElement) {
      decorateTableOfFigures(tofElement);
      tofElement.append((0, _hyperhtml.default)(_templateObject(), l10n.list_of_figures), (0, _hyperhtml.default)(_templateObject2(), tof));
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
        (0, _utils.showInlineWarning)(fig, "Found a `<figure>` without a `<figcaption>`");
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
    (0, _utils.addId)(figure, "fig", title); // set proper caption title

    (0, _utils.wrapInner)(caption, (0, _hyperhtml.default)(_templateObject3()));
    caption.prepend(l10n.fig, (0, _hyperhtml.default)(_templateObject4(), i + 1), " ");
  }
  /**
   * @param {string} figureId
   * @param {HTMLElement} caption
   * @return {HTMLElement}
   */


  function getTableOfFiguresListItem(figureId, caption) {
    const tofCaption = caption.cloneNode(true);
    tofCaption.querySelectorAll("a").forEach(anchor => {
      (0, _utils.renameElement)(anchor, "span").removeAttribute("href");
    });
    return (0, _hyperhtml.default)(_templateObject5(), "#".concat(figureId), tofCaption.childNodes);
  }

  function normalizeImages(doc) {
    doc.querySelectorAll(":not(picture)>img:not([width]):not([height]):not([srcset])").forEach(img => {
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
    if (tofElement.classList.contains("appendix") || tofElement.classList.contains("introductory") || tofElement.closest("section")) {
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
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=figures.js.map

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(93), __webpack_require__(124), __webpack_require__(9), __webpack_require__(125), __webpack_require__(13), __webpack_require__(56)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, webidl2, _dfnFinder, _utils, _webidl2, _hyperhtml, _dfnMap) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  webidl2 = _interopRequireWildcard(webidl2);
  _webidl2 = _interopRequireDefault(_webidl2);
  _hyperhtml = _interopRequireDefault(_hyperhtml);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

  function _templateObject16() {
    const data = _taggedTemplateLiteral(["", ""]);

    _templateObject16 = function _templateObject16() {
      return data;
    };

    return data;
  }

  function _templateObject15() {
    const data = _taggedTemplateLiteral(["<a\n    data-idl=\"", "\"\n    data-link-type=\"", "\"\n    data-title=\"", "\"\n    data-xref-type=\"", "\"\n    >", "</a>"]);

    _templateObject15 = function _templateObject15() {
      return data;
    };

    return data;
  }

  function _templateObject14() {
    const data = _taggedTemplateLiteral(["<dfn data-export data-dfn-type=\"", "\">", "</dfn>"]);

    _templateObject14 = function _templateObject14() {
      return data;
    };

    return data;
  }

  function _templateObject13() {
    const data = _taggedTemplateLiteral(["<a\n     data-link-type=\"dfn\"\n     data-lt=\"default toJSON operation\">", "</a>"]);

    _templateObject13 = function _templateObject13() {
      return data;
    };

    return data;
  }

  function _templateObject12() {
    const data = _taggedTemplateLiteral(["<a\n      data-link-for=\"", "\"\n      data-link-type=\"", "\"\n      href=\"", "\"\n      class=\"internalDFN\"\n      ><code>", "</code></a>"]);

    _templateObject12 = function _templateObject12() {
      return data;
    };

    return data;
  }

  function _templateObject11() {
    const data = _taggedTemplateLiteral(["<a data-xref-type=\"extended-attribute\">", "</a>"]);

    _templateObject11 = function _templateObject11() {
      return data;
    };

    return data;
  }

  function _templateObject10() {
    const data = _taggedTemplateLiteral(["<span class=\"extAttr\">", "</span>"]);

    _templateObject10 = function _templateObject10() {
      return data;
    };

    return data;
  }

  function _templateObject9() {
    const data = _taggedTemplateLiteral(["<span class='", "' id='", "' data-idl data-title='", "'>", "</span>"]);

    _templateObject9 = function _templateObject9() {
      return data;
    };

    return data;
  }

  function _templateObject8() {
    const data = _taggedTemplateLiteral(["<span class='", "'>", "</span>"]);

    _templateObject8 = function _templateObject8() {
      return data;
    };

    return data;
  }

  function _templateObject7() {
    const data = _taggedTemplateLiteral(["<span class=\"idlSuperclass\">", "</span>"]);

    _templateObject7 = function _templateObject7() {
      return data;
    };

    return data;
  }

  function _templateObject6() {
    const data = _taggedTemplateLiteral(["<span class=\"idlType\">", "</span>"]);

    _templateObject6 = function _templateObject6() {
      return data;
    };

    return data;
  }

  function _templateObject5() {
    const data = _taggedTemplateLiteral(["<span class=\"idlParamName\">", "</span>"]);

    _templateObject5 = function _templateObject5() {
      return data;
    };

    return data;
  }

  function _templateObject4() {
    const data = _taggedTemplateLiteral(["<a\n      data-xref-type=\"", "\" data-cite=\"", "\" data-lt=\"", "\">", "</a>"]);

    _templateObject4 = function _templateObject4() {
      return data;
    };

    return data;
  }

  function _templateObject3() {
    const data = _taggedTemplateLiteral(["<a data-xref-type=\"dfn\" data-cite=\"WebIDL\">", "</a>"]);

    _templateObject3 = function _templateObject3() {
      return data;
    };

    return data;
  }

  function _templateObject2() {
    const data = _taggedTemplateLiteral(["<a data-xref-type=\"interface\" data-cite=\"WebIDL\">", "</a>"]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    const data = _taggedTemplateLiteral(["<span class='idlSectionComment'>", "</span>"]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  const name = "core/webidl";
  _exports.name = name;
  const operationNames = {};
  const idlPartials = {};
  const templates = {
    wrap(items) {
      return items.reduce(_utils.flatten, []).filter(x => x !== "").map(x => typeof x === "string" ? new Text(x) : x);
    },

    trivia(t) {
      if (!t.trim()) {
        return t;
      }

      return (0, _hyperhtml.default)(_templateObject(), t);
    },

    generic(keyword) {
      // Shepherd classifies "interfaces" as starting with capital letters,
      // like Promise, FrozenArray, etc.
      return /^[A-Z]/.test(keyword) ? (0, _hyperhtml.default)(_templateObject2(), keyword) : // Other keywords like sequence, maplike, etc...
      (0, _hyperhtml.default)(_templateObject3(), keyword);
    },

    reference(wrapped, unescaped, context) {
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

        default:
          {
            const isWorkerType = unescaped.includes("Worker");

            if (isWorkerType && context.type === "extended-attribute" && context.name === "Exposed") {
              lt = "".concat(unescaped, "GlobalScope");
              type = "interface";
              cite = ["Worker", "DedicatedWorker", "SharedWorker"].includes(unescaped) ? "HTML" : null;
            }
          }
      }

      return (0, _hyperhtml.default)(_templateObject4(), type, cite, lt, wrapped);
    },

    name(escaped, {
      data,
      parent
    }) {
      if (data.idlType && data.idlType.type === "argument-type") {
        return (0, _hyperhtml.default)(_templateObject5(), escaped);
      }

      const idlLink = defineIdlName(escaped, data, parent);

      if (data.type !== "enum-value") {
        const className = parent ? "idlName" : "idlID";
        idlLink.classList.add(className);
      }

      return idlLink;
    },

    type(contents) {
      return (0, _hyperhtml.default)(_templateObject6(), contents);
    },

    inheritance(contents) {
      return (0, _hyperhtml.default)(_templateObject7(), contents);
    },

    definition(contents, {
      data,
      parent
    }) {
      const className = getIdlDefinitionClassName(data);

      switch (data.type) {
        case "includes":
        case "enum-value":
          return (0, _hyperhtml.default)(_templateObject8(), className, contents);
      }

      const parentName = parent ? parent.name : "";
      const {
        name,
        idlId
      } = getNameAndId(data, parentName);
      return (0, _hyperhtml.default)(_templateObject9(), className, idlId, name, contents);
    },

    extendedAttribute(contents) {
      const result = (0, _hyperhtml.default)(_templateObject10(), contents);
      return result;
    },

    extendedAttributeReference(name) {
      return (0, _hyperhtml.default)(_templateObject11(), name);
    }

  };
  /**
   * Returns a link to existing <dfn> or creates one if doesn’t exists.
   */

  function defineIdlName(escaped, data, parent) {
    const parentName = parent ? parent.name : "";
    const {
      name
    } = getNameAndId(data, parentName);
    const dfn = (0, _dfnFinder.findDfn)(data, name, {
      parent: parentName
    });
    const linkType = getDfnType(data.type);

    if (dfn) {
      if (!data.partial) {
        dfn.dataset.export = "";
        dfn.dataset.dfnType = linkType;
      }

      (0, _dfnFinder.decorateDfn)(dfn, data, parentName, name);
      const href = "#".concat(dfn.id);
      return (0, _hyperhtml.default)(_templateObject12(), parentName, linkType, href, escaped);
    }

    const isDefaultJSON = data.type === "operation" && data.name === "toJSON" && data.extAttrs.some(({
      name
    }) => name === "Default");

    if (isDefaultJSON) {
      return (0, _hyperhtml.default)(_templateObject13(), escaped);
    }

    if (!data.partial) {
      const dfn = (0, _hyperhtml.default)(_templateObject14(), linkType, escaped);
      (0, _dfnFinder.decorateDfn)(dfn, data, parentName, name);
      return dfn;
    }

    const unlinkedAnchor = (0, _hyperhtml.default)(_templateObject15(), data.partial ? "partial" : null, linkType, data.name, linkType, escaped);
    const showWarnings = name && data.type !== "typedef" && !(data.partial && !dfn);

    if (showWarnings) {
      const styledName = data.type === "operation" ? "".concat(name, "()") : name;
      const ofParent = parentName ? " `".concat(parentName, "`'s") : "";
      const msg = "Missing `<dfn>` for".concat(ofParent, " `").concat(styledName, "` ").concat(data.type, ". [More info](https://github.com/w3c/respec/wiki/WebIDL-thing-is-not-defined).");
      (0, _utils.showInlineWarning)(unlinkedAnchor, msg, "");
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

    return "idl".concat(defn.type[0].toUpperCase()).concat(defn.type.slice(1));
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
      case "interface mixin":
        {
          idlId += resolvePartial(defn);
          break;
        }

      case "operation":
        {
          const overload = resolveOverload(name, parent);

          if (overload) {
            name += overload;
          } else if (defn.arguments.length) {
            idlId += defn.arguments.map(arg => "-".concat(arg.name.toLowerCase())).join("");
          }

          break;
        }
    }

    return {
      name,
      idlId
    };
  }

  function resolvePartial(defn) {
    if (!defn.partial) {
      return "";
    }

    if (!idlPartials[defn.name]) {
      idlPartials[defn.name] = 0;
    }

    idlPartials[defn.name] += 1;
    return "-partial-".concat(idlPartials[defn.name]);
  }

  function resolveOverload(name, parentName) {
    const qualifiedName = "".concat(parentName, ".").concat(name);
    const fullyQualifiedName = "".concat(qualifiedName, "()");
    let overload;

    if (!operationNames[fullyQualifiedName]) {
      operationNames[fullyQualifiedName] = 0;
    }

    if (!operationNames[qualifiedName]) {
      operationNames[qualifiedName] = 0;
    } else {
      overload = "!overload-".concat(operationNames[qualifiedName]);
    }

    operationNames[fullyQualifiedName] += 1;
    operationNames[qualifiedName] += 1;
    return overload || "";
  }

  function getIdlId(name, parentName) {
    if (!parentName) {
      return "idl-def-".concat(name.toLowerCase());
    }

    return "idl-def-".concat(parentName.toLowerCase(), "-").concat(name.toLowerCase());
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
        sourceName: String(index)
      });
    } catch (e) {
      (0, _utils.showInlineError)(idlElement, "Failed to parse WebIDL: ".concat(e.bareMessage, "."), e.bareMessage, {
        details: "<pre>".concat(e.context, "</pre>")
      }); // Skip this <pre> and move on to the next one.

      return [];
    }

    idlElement.classList.add("def", "idl");
    const html = webidl2.write(parse, {
      templates
    });

    const render = _hyperhtml.default.bind(idlElement);

    render(_templateObject16(), html);
    idlElement.querySelectorAll("[data-idl]").forEach(elem => {
      if (elem.dataset.dfnFor) {
        return;
      }

      const title = elem.dataset.title; // Select the nearest ancestor element that can contain members.

      const parent = elem.parentElement.closest("[data-idl][data-title]");

      if (parent) {
        elem.dataset.dfnFor = parent.dataset.title;
      }

      (0, _dfnMap.registerDefinition)(elem, [title]);
    }); // cross reference

    const closestCite = idlElement.closest("[data-cite], body");
    const {
      dataset
    } = closestCite;
    if (!dataset.cite) dataset.cite = "WebIDL"; // includes webidl in some form

    if (!/\bwebidl\b/i.test(dataset.cite)) {
      const cites = dataset.cite.trim().split(/\s+/);
      dataset.cite = ["WebIDL", ...cites].join(" ");
    }

    return parse;
  }

  function run() {
    const idls = document.querySelectorAll("pre.idl");

    if (!idls.length) {
      return;
    }

    if (!document.querySelector(".idl:not(pre)")) {
      const link = document.querySelector("head link");

      if (link) {
        const style = document.createElement("style");
        style.textContent = _webidl2.default;
        link.before(style);
      }
    }

    const astArray = [...idls].map(renderWebIDL);
    const validations = webidl2.validate(astArray);

    for (const validation of validations) {
      (0, _utils.showInlineError)(idls[validation.sourceName], "WebIDL validation error: ".concat(validation.bareMessage), validation.bareMessage, {
        details: "<pre>".concat(validation.context, "</pre>")
      });
    }

    document.normalize();
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=webidl.js.map

/***/ }),
/* 93 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lib_webidl2_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(94);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "parse", function() { return _lib_webidl2_js__WEBPACK_IMPORTED_MODULE_0__["parse"]; });

/* harmony import */ var _lib_writer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(122);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "write", function() { return _lib_writer_js__WEBPACK_IMPORTED_MODULE_1__["write"]; });

/* harmony import */ var _lib_validator_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(123);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "validate", function() { return _lib_validator_js__WEBPACK_IMPORTED_MODULE_2__["validate"]; });






/***/ }),
/* 94 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parse", function() { return parse; });
/* harmony import */ var _tokeniser_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(95);
/* harmony import */ var _productions_enum_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(97);
/* harmony import */ var _productions_includes_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(109);
/* harmony import */ var _productions_extended_attributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(104);
/* harmony import */ var _productions_typedef_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(110);
/* harmony import */ var _productions_callback_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(111);
/* harmony import */ var _productions_interface_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(112);
/* harmony import */ var _productions_mixin_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(117);
/* harmony import */ var _productions_dictionary_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(118);
/* harmony import */ var _productions_namespace_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(120);
/* harmony import */ var _productions_callback_interface_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(121);














/**
 * @param {Tokeniser} tokeniser
 * @param {object} options
 * @param {boolean} [options.concrete]
 */
function parseByTokens(tokeniser, options) {
  const source = tokeniser.source;

  function error(str) {
    tokeniser.error(str);
  }

  function consume(...candidates) {
    return tokeniser.consume(...candidates);
  }

  function callback() {
    const callback = consume("callback");
    if (!callback) return;
    if (tokeniser.probe("interface")) {
      return _productions_callback_interface_js__WEBPACK_IMPORTED_MODULE_10__["CallbackInterface"].parse(tokeniser, callback);
    }
    return _productions_callback_js__WEBPACK_IMPORTED_MODULE_5__["CallbackFunction"].parse(tokeniser, callback);
  }

  function interface_(opts) {
    const base = consume("interface");
    if (!base) return;
    const ret = _productions_mixin_js__WEBPACK_IMPORTED_MODULE_7__["Mixin"].parse(tokeniser, base, opts) ||
      _productions_interface_js__WEBPACK_IMPORTED_MODULE_6__["Interface"].parse(tokeniser, base, opts) ||
      error("Interface has no proper body");
    return ret;
  }

  function partial() {
    const partial = consume("partial");
    if (!partial) return;
    return _productions_dictionary_js__WEBPACK_IMPORTED_MODULE_8__["Dictionary"].parse(tokeniser, { partial }) ||
      interface_({ partial }) ||
      _productions_namespace_js__WEBPACK_IMPORTED_MODULE_9__["Namespace"].parse(tokeniser, { partial }) ||
      error("Partial doesn't apply to anything");
  }

  function definition() {
    return callback() ||
      interface_() ||
      partial() ||
      _productions_dictionary_js__WEBPACK_IMPORTED_MODULE_8__["Dictionary"].parse(tokeniser) ||
      _productions_enum_js__WEBPACK_IMPORTED_MODULE_1__["Enum"].parse(tokeniser) ||
      _productions_typedef_js__WEBPACK_IMPORTED_MODULE_4__["Typedef"].parse(tokeniser) ||
      _productions_includes_js__WEBPACK_IMPORTED_MODULE_2__["Includes"].parse(tokeniser) ||
      _productions_namespace_js__WEBPACK_IMPORTED_MODULE_9__["Namespace"].parse(tokeniser);
  }

  function definitions() {
    if (!source.length) return [];
    const defs = [];
    while (true) {
      const ea = _productions_extended_attributes_js__WEBPACK_IMPORTED_MODULE_3__["ExtendedAttributes"].parse(tokeniser);
      const def = definition();
      if (!def) {
        if (ea.length) error("Stray extended attributes");
        break;
      }
      def.extAttrs = ea;
      defs.push(def);
    }
    const eof = consume("eof");
    if (options.concrete) {
      defs.push(eof);
    }
    return defs;
  }
  const res = definitions();
  if (tokeniser.position < source.length) error("Unrecognised tokens");
  return res;
}

function parse(str, options = {}) {
  const tokeniser = new _tokeniser_js__WEBPACK_IMPORTED_MODULE_0__["Tokeniser"](str);
  if (typeof options.sourceName !== "undefined") {
    tokeniser.source.name = options.sourceName;
  }
  return parseByTokens(tokeniser, options);
}


/***/ }),
/* 95 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stringTypes", function() { return stringTypes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "argumentNameKeywords", function() { return argumentNameKeywords; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Tokeniser", function() { return Tokeniser; });
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(96);


// These regular expressions use the sticky flag so they will only match at
// the current location (ie. the offset of lastIndex).
const tokenRe = {
  // This expression uses a lookahead assertion to catch false matches
  // against integers early.
  "decimal": /-?(?=[0-9]*\.|[0-9]+[eE])(([0-9]+\.[0-9]*|[0-9]*\.[0-9]+)([Ee][-+]?[0-9]+)?|[0-9]+[Ee][-+]?[0-9]+)/y,
  "integer": /-?(0([Xx][0-9A-Fa-f]+|[0-7]*)|[1-9][0-9]*)/y,
  "identifier": /[_-]?[A-Za-z][0-9A-Z_a-z-]*/y,
  "string": /"[^"]*"/y,
  "whitespace": /[\t\n\r ]+/y,
  "comment": /((\/(\/.*|\*([^*]|\*[^/])*\*\/)[\t\n\r ]*)+)/y,
  "other": /[^\t\n\r 0-9A-Za-z]/y
};

const stringTypes = [
  "ByteString",
  "DOMString",
  "USVString"
];

const argumentNameKeywords = [
  "async",
  "attribute",
  "callback",
  "const",
  "deleter",
  "dictionary",
  "enum",
  "getter",
  "includes",
  "inherit",
  "interface",
  "iterable",
  "maplike",
  "namespace",
  "partial",
  "required",
  "setlike",
  "setter",
  "static",
  "stringifier",
  "typedef",
  "unrestricted"
];

const nonRegexTerminals = [
  "-Infinity",
  "FrozenArray",
  "Infinity",
  "NaN",
  "Promise",
  "async",
  "boolean",
  "byte",
  "double",
  "false",
  "float",
  "long",
  "mixin",
  "null",
  "octet",
  "optional",
  "or",
  "readonly",
  "record",
  "sequence",
  "short",
  "true",
  "unsigned",
  "void"
].concat(argumentNameKeywords, stringTypes);

const punctuations = [
  "(",
  ")",
  ",",
  "...",
  ":",
  ";",
  "<",
  "=",
  ">",
  "?",
  "[",
  "]",
  "{",
  "}"
];

/**
 * @param {string} str
 */
function tokenise(str) {
  const tokens = [];
  let lastCharIndex = 0;
  let trivia = "";
  let line = 1;
  let index = 0;
  while (lastCharIndex < str.length) {
    const nextChar = str.charAt(lastCharIndex);
    let result = -1;

    if (/[\t\n\r ]/.test(nextChar)) {
      result = attemptTokenMatch("whitespace", { noFlushTrivia: true });
    } else if (nextChar === '/') {
      result = attemptTokenMatch("comment", { noFlushTrivia: true });
    }

    if (result !== -1) {
      const currentTrivia = tokens.pop().value;
      line += (currentTrivia.match(/\n/g) || []).length;
      trivia += currentTrivia;
      index -= 1;
    } else if (/[-0-9.A-Z_a-z]/.test(nextChar)) {
      result = attemptTokenMatch("decimal");
      if (result === -1) {
        result = attemptTokenMatch("integer");
      }
      if (result === -1) {
        result = attemptTokenMatch("identifier");
        const token = tokens[tokens.length - 1];
        if (result !== -1 && nonRegexTerminals.includes(token.value)) {
          token.type = token.value;
        }
      }
    } else if (nextChar === '"') {
      result = attemptTokenMatch("string");
    }

    for (const punctuation of punctuations) {
      if (str.startsWith(punctuation, lastCharIndex)) {
        tokens.push({ type: punctuation, value: punctuation, trivia, line, index });
        trivia = "";
        lastCharIndex += punctuation.length;
        result = lastCharIndex;
        break;
      }
    }

    // other as the last try
    if (result === -1) {
      result = attemptTokenMatch("other");
    }
    if (result === -1) {
      throw new Error("Token stream not progressing");
    }
    lastCharIndex = result;
    index += 1;
  }

  // remaining trivia as eof
  tokens.push({
    type: "eof",
    value: "",
    trivia
  });

  return tokens;

  /**
   * @param {keyof tokenRe} type
   * @param {object} [options]
   * @param {boolean} [options.noFlushTrivia]
   */
  function attemptTokenMatch(type, { noFlushTrivia } = {}) {
    const re = tokenRe[type];
    re.lastIndex = lastCharIndex;
    const result = re.exec(str);
    if (result) {
      tokens.push({ type, value: result[0], trivia, line, index });
      if (!noFlushTrivia) {
        trivia = "";
      }
      return re.lastIndex;
    }
    return -1;
  }
}

class Tokeniser {
  /**
   * @param {string} idl
   */
  constructor(idl) {
    this.source = tokenise(idl);
    this.position = 0;
  }

  /**
   * @param {string} message
   */
  error(message) {
    throw new WebIDLParseError(Object(_error_js__WEBPACK_IMPORTED_MODULE_0__["syntaxError"])(this.source, this.position, this.current, message));
  }

  /**
   * @param {string} type
   */
  probe(type) {
    return this.source.length > this.position && this.source[this.position].type === type;
  }

  /**
   * @param  {...string} candidates
   */
  consume(...candidates) {
    for (const type of candidates) {
      if (!this.probe(type)) continue;
      const token = this.source[this.position];
      this.position++;
      return token;
    }
  }

  /**
   * @param {number} position
   */
  unconsume(position) {
    this.position = position;
  }
}

class WebIDLParseError extends Error {
  constructor({ message, bareMessage, context, line, sourceName, input, tokens }) {
    super(message);

    this.name = "WebIDLParseError"; // not to be mangled
    this.bareMessage = bareMessage;
    this.context = context;
    this.line = line;
    this.sourceName = sourceName;
    this.input = input;
    this.tokens = tokens;
  }
}


/***/ }),
/* 96 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "syntaxError", function() { return syntaxError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validationError", function() { return validationError; });
/**
 * @param {string} text
 */
function lastLine(text) {
  const splitted = text.split("\n");
  return splitted[splitted.length - 1];
}

/**
 * @typedef {object} WebIDL2ErrorOptions
 * @property {"error" | "warning"} level
 * @property {Function} autofix
 *
 * @param {string} message error message
 * @param {"Syntax" | "Validation"} kind error type
 * @param {WebIDL2ErrorOptions} [options]
 */
function error(source, position, current, message, kind, { level = "error", autofix } = {}) {
  /**
   * @param {number} count
   */
  function sliceTokens(count) {
    return count > 0 ?
      source.slice(position, position + count) :
      source.slice(Math.max(position + count, 0), position);
  }

  function tokensToText(inputs, { precedes } = {}) {
    const text = inputs.map(t => t.trivia + t.value).join("");
    const nextToken = source[position];
    if (nextToken.type === "eof") {
      return text;
    }
    if (precedes) {
      return text + nextToken.trivia;
    }
    return text.slice(nextToken.trivia.length);
  }

  const maxTokens = 5; // arbitrary but works well enough
  const line =
    source[position].type !== "eof" ? source[position].line :
    source.length > 1 ? source[position - 1].line :
    1;

  const precedingLastLine = lastLine(
    tokensToText(sliceTokens(-maxTokens), { precedes: true })
  );

  const subsequentTokens = sliceTokens(maxTokens);
  const subsequentText = tokensToText(subsequentTokens);
  const subsequentFirstLine = subsequentText.split("\n")[0];

  const spaced = " ".repeat(precedingLastLine.length) + "^";
  const sourceContext = precedingLastLine + subsequentFirstLine + "\n" + spaced;

  const contextType = kind === "Syntax" ? "since" : "inside";
  const inSourceName = source.name ? ` in ${source.name}` : "";
  const grammaticalContext = (current && current.name) ? `, ${contextType} \`${current.partial ? "partial " : ""}${current.type} ${current.name}\`` : "";
  const context = `${kind} error at line ${line}${inSourceName}${grammaticalContext}:\n${sourceContext}`;
  return {
    message: `${context} ${message}`,
    bareMessage: message,
    context,
    line,
    sourceName: source.name,
    level,
    autofix,
    input: subsequentText,
    tokens: subsequentTokens
  };
}

/**
 * @param {string} message error message
 */
function syntaxError(source, position, current, message) {
  return error(source, position, current, message, "Syntax");
}

/**
 * @param {string} message error message
 * @param {WebIDL2ErrorOptions} [options]
 */
function validationError(source, token, current, message, options) {
  return error(source, token.index, current, message, "Validation", options);
}


/***/ }),
/* 97 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Enum", function() { return Enum; });
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(98);
/* harmony import */ var _token_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(106);
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(100);




class EnumValue extends _token_js__WEBPACK_IMPORTED_MODULE_1__["Token"] {
  /**
   * @param {import("../tokeniser").Tokeniser} tokeniser
   */
  static parse(tokeniser) {
    const value = tokeniser.consume("string");
    if (value) {
      return new EnumValue({ source: tokeniser.source, tokens: { value } });
    }
  }

  get type() {
    return "enum-value";
  }
  get value() {
    return super.value.slice(1, -1);
  }
}

class Enum extends _base_js__WEBPACK_IMPORTED_MODULE_2__["Base"] {
  /**
   * @param {import("../tokeniser").Tokeniser} tokeniser
   */
  static parse(tokeniser) {
    const tokens = {};
    tokens.base = tokeniser.consume("enum");
    if (!tokens.base) {
      return;
    }
    tokens.name = tokeniser.consume("identifier") || tokeniser.error("No name for enum");
    const ret = tokeniser.current = new Enum({ source: tokeniser.source, tokens });
    tokens.open = tokeniser.consume("{") || tokeniser.error("Bodyless enum");
    ret.values = Object(_helpers_js__WEBPACK_IMPORTED_MODULE_0__["list"])(tokeniser, {
      parser: EnumValue.parse,
      allowDangler: true,
      listName: "enumeration"
    });
    if (tokeniser.probe("string")) {
      tokeniser.error("No comma between enum values");
    }
    tokens.close = tokeniser.consume("}") || tokeniser.error("Unexpected value in enum");
    if (!ret.values.length) {
      tokeniser.error("No value in enum");
    }
    tokens.termination = tokeniser.consume(";") || tokeniser.error("No semicolon after enum");
    return ret;
  }

  get type() {
    return "enum";
  }
  get name() {
    return Object(_helpers_js__WEBPACK_IMPORTED_MODULE_0__["unescape"])(this.tokens.name.value);
  }
}


/***/ }),
/* 98 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unescape", function() { return unescape; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "list", function() { return list; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "const_value", function() { return const_value; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "const_data", function() { return const_data; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "primitive_type", function() { return primitive_type; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "identifiers", function() { return identifiers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "argument_list", function() { return argument_list; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "type_with_extended_attributes", function() { return type_with_extended_attributes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "return_type", function() { return return_type; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stringifier", function() { return stringifier; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "autofixAddExposedWindow", function() { return autofixAddExposedWindow; });
/* harmony import */ var _type_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(99);
/* harmony import */ var _argument_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(102);
/* harmony import */ var _token_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(106);
/* harmony import */ var _extended_attributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(104);
/* harmony import */ var _operation_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(107);
/* harmony import */ var _attribute_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(108);
/* harmony import */ var _tokeniser_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(95);








/**
 * @param {string} identifier
 */
function unescape(identifier) {
  return identifier.startsWith('_') ? identifier.slice(1) : identifier;
}

/**
 * Parses comma-separated list
 * @param {import("../tokeniser").Tokeniser} tokeniser
 * @param {object} args
 * @param {Function} args.parser parser function for each item
 * @param {boolean} [args.allowDangler] whether to allow dangling comma
 * @param {string} [args.listName] the name to be shown on error messages
 */
function list(tokeniser, { parser, allowDangler, listName = "list" }) {
  const first = parser(tokeniser);
  if (!first) {
    return [];
  }
  first.tokens.separator = tokeniser.consume(",");
  const items = [first];
  while (first.tokens.separator) {
    const item = parser(tokeniser);
    if (!item) {
      if (!allowDangler) {
        tokeniser.error(`Trailing comma in ${listName}`);
      }
      break;
    }
    item.tokens.separator = tokeniser.consume(",");
    items.push(item);
    if (!item.tokens.separator) break;
  }
  return items;
}

/**
 * @param {import("../tokeniser").Tokeniser} tokeniser
 */
function const_value(tokeniser) {
  return tokeniser.consume("true", "false", "Infinity", "-Infinity", "NaN", "decimal", "integer");
}

/**
 * @param {object} token
 * @param {string} token.type
 * @param {string} token.value
 */
function const_data({ type, value }) {
  switch (type) {
    case "true":
    case "false":
      return { type: "boolean", value: type === "true" };
    case "Infinity":
    case "-Infinity":
      return { type: "Infinity", negative: type.startsWith("-") };
    case "[":
      return { type: "sequence", value: [] };
    case "{":
      return { type: "dictionary" };
    case "decimal":
    case "integer":
      return { type: "number", value };
    case "string":
      return { type: "string", value: value.slice(1, -1) };
    default:
      return { type };
  }
}

/**
 * @param {import("../tokeniser").Tokeniser} tokeniser
 */
function primitive_type(tokeniser) {
  function integer_type() {
    const prefix = tokeniser.consume("unsigned");
    const base = tokeniser.consume("short", "long");
    if (base) {
      const postfix = tokeniser.consume("long");
      return new _type_js__WEBPACK_IMPORTED_MODULE_0__["Type"]({ source, tokens: { prefix, base, postfix } });
    }
    if (prefix) tokeniser.error("Failed to parse integer type");
  }

  function decimal_type() {
    const prefix = tokeniser.consume("unrestricted");
    const base = tokeniser.consume("float", "double");
    if (base) {
      return new _type_js__WEBPACK_IMPORTED_MODULE_0__["Type"]({ source, tokens: { prefix, base } });
    }
    if (prefix) tokeniser.error("Failed to parse float type");
  }

  const { source } = tokeniser;
  const num_type = integer_type(tokeniser) || decimal_type(tokeniser);
  if (num_type) return num_type;
  const base = tokeniser.consume("boolean", "byte", "octet");
  if (base) {
    return new _type_js__WEBPACK_IMPORTED_MODULE_0__["Type"]({ source, tokens: { base } });
  }
}

/**
 * @param {import("../tokeniser").Tokeniser} tokeniser
 */
function identifiers(tokeniser) {
  const ids = list(tokeniser, { parser: _token_js__WEBPACK_IMPORTED_MODULE_2__["Token"].parser(tokeniser, "identifier"), listName: "identifier list" });
  if (!ids.length) {
    tokeniser.error("Expected identifiers but none found");
  }
  return ids;
}

/**
 * @param {import("../tokeniser").Tokeniser} tokeniser
 */
function argument_list(tokeniser) {
  return list(tokeniser, { parser: _argument_js__WEBPACK_IMPORTED_MODULE_1__["Argument"].parse, listName: "arguments list" });
}

/**
 * @param {import("../tokeniser").Tokeniser} tokeniser
 * @param {string} typeName
 */
function type_with_extended_attributes(tokeniser, typeName) {
  const extAttrs = _extended_attributes_js__WEBPACK_IMPORTED_MODULE_3__["ExtendedAttributes"].parse(tokeniser);
  const ret = _type_js__WEBPACK_IMPORTED_MODULE_0__["Type"].parse(tokeniser, typeName);
  if (ret) ret.extAttrs = extAttrs;
  return ret;
}

/**
 * @param {import("../tokeniser").Tokeniser} tokeniser
 * @param {string} typeName
 */
function return_type(tokeniser, typeName) {
  const typ = _type_js__WEBPACK_IMPORTED_MODULE_0__["Type"].parse(tokeniser, typeName || "return-type");
  if (typ) {
    return typ;
  }
  const voidToken = tokeniser.consume("void");
  if (voidToken) {
    const ret = new _type_js__WEBPACK_IMPORTED_MODULE_0__["Type"]({ source: tokeniser.source, tokens: { base: voidToken } });
    ret.type = "return-type";
    return ret;
  }
}

/**
 * @param {import("../tokeniser").Tokeniser} tokeniser
 */
function stringifier(tokeniser) {
  const special = tokeniser.consume("stringifier");
  if (!special) return;
  const member = _attribute_js__WEBPACK_IMPORTED_MODULE_5__["Attribute"].parse(tokeniser, { special }) ||
    _operation_js__WEBPACK_IMPORTED_MODULE_4__["Operation"].parse(tokeniser, { special }) ||
    tokeniser.error("Unterminated stringifier");
  return member;
}

/**
 * @param {object} def
 * @param {import("./extended-attributes.js").ExtendedAttributes} def.extAttrs
 */
function autofixAddExposedWindow(def) {
  return () => {
    if (def.extAttrs.length){
      const tokeniser = new _tokeniser_js__WEBPACK_IMPORTED_MODULE_6__["Tokeniser"]("Exposed=Window,");
      const exposed = _extended_attributes_js__WEBPACK_IMPORTED_MODULE_3__["SimpleExtendedAttribute"].parse(tokeniser);
      exposed.tokens.separator = tokeniser.consume(",");
      const existing = def.extAttrs[0];
      if (!/^\s/.test(existing.tokens.name.trivia)) {
        existing.tokens.name.trivia = ` ${existing.tokens.name.trivia}`;
      }
      def.extAttrs.unshift(exposed);
    } else {
      def.extAttrs = _extended_attributes_js__WEBPACK_IMPORTED_MODULE_3__["ExtendedAttributes"].parse(new _tokeniser_js__WEBPACK_IMPORTED_MODULE_6__["Tokeniser"]("[Exposed=Window]"));
      def.extAttrs.tokens.open.trivia = def.tokens.base.trivia;
      def.tokens.base.trivia = " ";
    }
  };
}


/***/ }),
/* 99 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Type", function() { return Type; });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(100);
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(98);
/* harmony import */ var _tokeniser_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(95);
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(96);
/* harmony import */ var _validators_helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(101);






/**
 * @param {import("../tokeniser").Tokeniser} tokeniser
 * @param {string} typeName
 */
function generic_type(tokeniser, typeName) {
  const base = tokeniser.consume("FrozenArray", "Promise", "sequence", "record");
  if (!base) {
    return;
  }
  const ret = new Type({ source: tokeniser.source, tokens: { base } });
  ret.tokens.open = tokeniser.consume("<") || tokeniser.error(`No opening bracket after ${base.type}`);
  switch (base.type) {
    case "Promise": {
      if (tokeniser.probe("[")) tokeniser.error("Promise type cannot have extended attribute");
      const subtype = Object(_helpers_js__WEBPACK_IMPORTED_MODULE_1__["return_type"])(tokeniser, typeName) || tokeniser.error("Missing Promise subtype");
      ret.subtype.push(subtype);
      break;
    }
    case "sequence":
    case "FrozenArray": {
      const subtype = Object(_helpers_js__WEBPACK_IMPORTED_MODULE_1__["type_with_extended_attributes"])(tokeniser, typeName) || tokeniser.error(`Missing ${base.type} subtype`);
      ret.subtype.push(subtype);
      break;
    }
    case "record": {
      if (tokeniser.probe("[")) tokeniser.error("Record key cannot have extended attribute");
      const keyType = tokeniser.consume(..._tokeniser_js__WEBPACK_IMPORTED_MODULE_2__["stringTypes"]) || tokeniser.error(`Record key must be one of: ${_tokeniser_js__WEBPACK_IMPORTED_MODULE_2__["stringTypes"].join(", ")}`);
      const keyIdlType = new Type({ source: tokeniser.source, tokens: { base: keyType }});
      keyIdlType.tokens.separator = tokeniser.consume(",") || tokeniser.error("Missing comma after record key type");
      keyIdlType.type = typeName;
      const valueType = Object(_helpers_js__WEBPACK_IMPORTED_MODULE_1__["type_with_extended_attributes"])(tokeniser, typeName) || tokeniser.error("Error parsing generic type record");
      ret.subtype.push(keyIdlType, valueType);
      break;
    }
  }
  if (!ret.idlType) tokeniser.error(`Error parsing generic type ${base.type}`);
  ret.tokens.close = tokeniser.consume(">") || tokeniser.error(`Missing closing bracket after ${base.type}`);
  return ret;
}

/**
 * @param {import("../tokeniser").Tokeniser} tokeniser
 */
function type_suffix(tokeniser, obj) {
  const nullable = tokeniser.consume("?");
  if (nullable) {
    obj.tokens.nullable = nullable;
  }
  if (tokeniser.probe("?")) tokeniser.error("Can't nullable more than once");
}

/**
 * @param {import("../tokeniser").Tokeniser} tokeniser
 * @param {string} typeName
 */
function single_type(tokeniser, typeName) {
  let ret = generic_type(tokeniser, typeName) || Object(_helpers_js__WEBPACK_IMPORTED_MODULE_1__["primitive_type"])(tokeniser);
  if (!ret) {
    const base = tokeniser.consume("identifier", ..._tokeniser_js__WEBPACK_IMPORTED_MODULE_2__["stringTypes"]);
    if (!base) {
      return;
    }
    ret = new Type({ source: tokeniser.source, tokens: { base } });
    if (tokeniser.probe("<")) tokeniser.error(`Unsupported generic type ${base.value}`);
  }
  if (ret.generic === "Promise" && tokeniser.probe("?")) {
    tokeniser.error("Promise type cannot be nullable");
  }
  ret.type = typeName || null;
  type_suffix(tokeniser, ret);
  if (ret.nullable && ret.idlType === "any") tokeniser.error("Type `any` cannot be made nullable");
  return ret;
}

/**
 * @param {import("../tokeniser").Tokeniser} tokeniser
 * @param {string} type
 */
function union_type(tokeniser, type) {
  const tokens = {};
  tokens.open = tokeniser.consume("(");
  if (!tokens.open) return;
  const ret = new Type({ source: tokeniser.source, tokens });
  ret.type = type || null;
  while (true) {
    const typ = Object(_helpers_js__WEBPACK_IMPORTED_MODULE_1__["type_with_extended_attributes"])(tokeniser) || tokeniser.error("No type after open parenthesis or 'or' in union type");
    if (typ.idlType === "any") tokeniser.error("Type `any` cannot be included in a union type");
    ret.subtype.push(typ);
    const or = tokeniser.consume("or");
    if (or) {
      typ.tokens.separator = or;
    }
    else break;
  }
  if (ret.idlType.length < 2) {
    tokeniser.error("At least two types are expected in a union type but found less");
  }
  tokens.close = tokeniser.consume(")") || tokeniser.error("Unterminated union type");
  type_suffix(tokeniser, ret);
  return ret;
}

class Type extends _base_js__WEBPACK_IMPORTED_MODULE_0__["Base"] {
  /**
   * @param {import("../tokeniser").Tokeniser} tokeniser
   * @param {string} typeName
   */
  static parse(tokeniser, typeName) {
    return single_type(tokeniser, typeName) || union_type(tokeniser, typeName);
  }

  constructor({ source, tokens }) {
    super({ source, tokens });
    Object.defineProperty(this, "subtype", { value: [] });
    this.extAttrs = [];
  }

  get generic() {
    if (this.subtype.length && this.tokens.base) {
      return this.tokens.base.value;
    }
    return "";
  }
  get nullable() {
    return Boolean(this.tokens.nullable);
  }
  get union() {
    return Boolean(this.subtype.length) && !this.tokens.base;
  }
  get idlType() {
    if (this.subtype.length) {
      return this.subtype;
    }
    // Adding prefixes/postfixes for "unrestricted float", etc.
    const name = [
      this.tokens.prefix,
      this.tokens.base,
      this.tokens.postfix
    ].filter(t => t).map(t => t.value).join(" ");
    return Object(_helpers_js__WEBPACK_IMPORTED_MODULE_1__["unescape"])(name);
  }

  *validate(defs) {
    /*
     * If a union is nullable, its subunions cannot include a dictionary
     * If not, subunions may include dictionaries if each union is not nullable
     */
    const typedef = !this.union && defs.unique.get(this.idlType);
    const target =
      this.union ? this :
      (typedef && typedef.type === "typedef") ? typedef.idlType :
      undefined;
    if (target && this.nullable) {
      // do not allow any dictionary
      const reference = Object(_validators_helpers_js__WEBPACK_IMPORTED_MODULE_4__["idlTypeIncludesDictionary"])(target, defs);
      if (reference) {
        const targetToken = (this.union ? reference : this).tokens.base;
        const message = `Nullable union cannot include a dictionary type`;
        yield Object(_error_js__WEBPACK_IMPORTED_MODULE_3__["validationError"])(this.source, targetToken, this, message);
      }
    } else {
      // allow some dictionary
      for (const subtype of this.subtype) {
        yield* subtype.validate(defs);
      }
    }
  }
}


/***/ }),
/* 100 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Base", function() { return Base; });
class Base {
  constructor({ source, tokens }) {
    Object.defineProperties(this, {
      source: { value: source },
      tokens: { value: tokens }
    });
  }

  toJSON() {
    const json = { type: undefined, name: undefined, inheritance: undefined };
    let proto = this;
    while (proto !== Object.prototype) {
      const descMap = Object.getOwnPropertyDescriptors(proto);
      for (const [key, value] of Object.entries(descMap)) {
        if (value.enumerable || value.get) {
          json[key] = this[key];
        }
      }
      proto = Object.getPrototypeOf(proto);
    }
    return json;
  }
}


/***/ }),
/* 101 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dictionaryWithinUnion", function() { return dictionaryWithinUnion; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "idlTypeIncludesDictionary", function() { return idlTypeIncludesDictionary; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "referencesTypedef", function() { return referencesTypedef; });
/**
 * Yields direct references to dictionary within union.
 */
function* dictionaryWithinUnion(subtypes, defs) {
  for (const subtype of subtypes) {
    const def = defs.unique.get(subtype.idlType);
    if (def && def.type === "dictionary") {
      yield subtype;
    }
  }
}

/**
 * @return the type reference that ultimately includes dictionary.
 */
function idlTypeIncludesDictionary(idlType, defs) {
  if (!idlType.union) {
    const def = defs.unique.get(idlType.idlType);
    if (!def) {
      return;
    }
    if (def.type === "typedef") {
      const { typedefIncludesDictionary} = defs.cache;
      if (typedefIncludesDictionary.has(def)) {
        // Note that this also halts when it met indeterminate state
        // to prevent infinite recursion
        return typedefIncludesDictionary.get(def);
      }
      defs.cache.typedefIncludesDictionary.set(def, undefined); // indeterminate state
      const result = idlTypeIncludesDictionary(def.idlType, defs);
      defs.cache.typedefIncludesDictionary.set(def, result);
      if (result) {
        return idlType;
      }
    }
    if (def.type === "dictionary") {
      return idlType;
    }
  }
  for (const subtype of idlType.subtype) {
    const result = idlTypeIncludesDictionary(subtype, defs);
    if (result) {
      if (subtype.union) {
        return result;
      }
      return subtype;
    }
  }
}

/**
 * @return true if the idlType directly references a typedef.
 */
function referencesTypedef(idlType, defs) {
  const result = defs.unique.get(idlType.idlType);
  return result && result.type === "typedef";
}


/***/ }),
/* 102 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Argument", function() { return Argument; });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(100);
/* harmony import */ var _default_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(103);
/* harmony import */ var _extended_attributes_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(104);
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(98);
/* harmony import */ var _tokeniser_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(95);
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(96);
/* harmony import */ var _validators_helpers_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(101);








class Argument extends _base_js__WEBPACK_IMPORTED_MODULE_0__["Base"] {
  /**
   * @param {import("../tokeniser").Tokeniser} tokeniser
   */
  static parse(tokeniser) {
    const start_position = tokeniser.position;
    const tokens = {};
    const ret = new Argument({ source: tokeniser.source, tokens });
    ret.extAttrs = _extended_attributes_js__WEBPACK_IMPORTED_MODULE_2__["ExtendedAttributes"].parse(tokeniser);
    tokens.optional = tokeniser.consume("optional");
    ret.idlType = Object(_helpers_js__WEBPACK_IMPORTED_MODULE_3__["type_with_extended_attributes"])(tokeniser, "argument-type");
    if (!ret.idlType) {
      return tokeniser.unconsume(start_position);
    }
    if (!tokens.optional) {
      tokens.variadic = tokeniser.consume("...");
    }
    tokens.name = tokeniser.consume("identifier", ..._tokeniser_js__WEBPACK_IMPORTED_MODULE_4__["argumentNameKeywords"]);
    if (!tokens.name) {
      return tokeniser.unconsume(start_position);
    }
    ret.default = tokens.optional ? _default_js__WEBPACK_IMPORTED_MODULE_1__["Default"].parse(tokeniser) : null;
    return ret;
  }

  get type() {
    return "argument";
  }
  get optional() {
    return !!this.tokens.optional;
  }
  get variadic() {
    return !!this.tokens.variadic;
  }
  get name() {
    return Object(_helpers_js__WEBPACK_IMPORTED_MODULE_3__["unescape"])(this.tokens.name.value);
  }

  *validate(defs) {
    yield* this.idlType.validate(defs);
    if (Object(_validators_helpers_js__WEBPACK_IMPORTED_MODULE_6__["idlTypeIncludesDictionary"])(this.idlType, defs)) {
      if (this.optional && !this.default) {
        const message = `Optional dictionary arguments must have a default value of \`{}\`.`;
        yield Object(_error_js__WEBPACK_IMPORTED_MODULE_5__["validationError"])(this.source, this.tokens.name, this, message, {
          autofix: autofixOptionalDictionaryDefaultValue(this)
        });
      }
      if (this.idlType.nullable) {
        const message = `Dictionary arguments cannot be nullable.`;
        yield Object(_error_js__WEBPACK_IMPORTED_MODULE_5__["validationError"])(this.source, this.tokens.name, this, message);
      }
    }
  }
}

/**
 * @param {Argument} arg
 */
function autofixOptionalDictionaryDefaultValue(arg) {
  return () => {
    arg.default = _default_js__WEBPACK_IMPORTED_MODULE_1__["Default"].parse(new _tokeniser_js__WEBPACK_IMPORTED_MODULE_4__["Tokeniser"](" = {}"));
  };
}


/***/ }),
/* 103 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Default", function() { return Default; });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(100);
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(98);



class Default extends _base_js__WEBPACK_IMPORTED_MODULE_0__["Base"] {
  /**
   * @param {import("../tokeniser").Tokeniser} tokeniser
   */
  static parse(tokeniser) {
    const assign = tokeniser.consume("=");
    if (!assign) {
      return null;
    }
    const def = Object(_helpers_js__WEBPACK_IMPORTED_MODULE_1__["const_value"])(tokeniser) || tokeniser.consume("string", "null", "[", "{") || tokeniser.error("No value for default");
    const expression = [def];
    if (def.type === "[") {
      const close = tokeniser.consume("]") || tokeniser.error("Default sequence value must be empty");
      expression.push(close);
    } else if (def.type === "{") {
      const close = tokeniser.consume("}") || tokeniser.error("Default dictionary value must be empty");
      expression.push(close);
    }
    return new Default({ source: tokeniser.source, tokens: { assign }, expression });
  }

  constructor({ source, tokens, expression }) {
    super({ source, tokens });
    Object.defineProperty(this, "expression", { value: expression });
  }

  get type() {
    return Object(_helpers_js__WEBPACK_IMPORTED_MODULE_1__["const_data"])(this.expression[0]).type;
  }
  get value() {
    return Object(_helpers_js__WEBPACK_IMPORTED_MODULE_1__["const_data"])(this.expression[0]).value;
  }
  get negative() {
    return Object(_helpers_js__WEBPACK_IMPORTED_MODULE_1__["const_data"])(this.expression[0]).negative;
  }
}


/***/ }),
/* 104 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SimpleExtendedAttribute", function() { return SimpleExtendedAttribute; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExtendedAttributes", function() { return ExtendedAttributes; });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(100);
/* harmony import */ var _array_base_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(105);
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(98);
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(96);





class ExtendedAttributeParameters extends _base_js__WEBPACK_IMPORTED_MODULE_0__["Base"] {
  /**
   * @param {import("../tokeniser").Tokeniser} tokeniser
   */
  static parse(tokeniser) {
    const tokens = { assign: tokeniser.consume("=") };
    const ret = new ExtendedAttributeParameters({ source: tokeniser.source, tokens });
    if (tokens.assign) {
      tokens.secondaryName = tokeniser.consume("identifier", "decimal", "integer", "string");
    }
    tokens.open = tokeniser.consume("(");
    if (tokens.open) {
      ret.list = ret.rhsType === "identifier-list" ?
        // [Exposed=(Window,Worker)]
        Object(_helpers_js__WEBPACK_IMPORTED_MODULE_2__["identifiers"])(tokeniser) :
        // [NamedConstructor=Audio(DOMString src)] or [Constructor(DOMString str)]
        Object(_helpers_js__WEBPACK_IMPORTED_MODULE_2__["argument_list"])(tokeniser);
      tokens.close = tokeniser.consume(")") || tokeniser.error("Unexpected token in extended attribute argument list");
    } else if (ret.hasRhs && !tokens.secondaryName) {
      tokeniser.error("No right hand side to extended attribute assignment");
    }
    return ret;
  }

  get rhsType() {
    return !this.tokens.assign ? null :
      !this.tokens.secondaryName ? "identifier-list" :
        this.tokens.secondaryName.type;
  }
}

class SimpleExtendedAttribute extends _base_js__WEBPACK_IMPORTED_MODULE_0__["Base"] {
  /**
   * @param {import("../tokeniser").Tokeniser} tokeniser
   */
  static parse(tokeniser) {
    const name = tokeniser.consume("identifier");
    if (name) {
      return new SimpleExtendedAttribute({
        source: tokeniser.source,
        tokens: { name },
        params: ExtendedAttributeParameters.parse(tokeniser)
      });
    }
  }

  constructor({ source, tokens, params }) {
    super({ source, tokens });
    Object.defineProperty(this, "params", { value: params });
  }

  get type() {
    return "extended-attribute";
  }
  get name() {
    return this.tokens.name.value;
  }
  get rhs() {
    const { rhsType: type, tokens, list } = this.params;
    if (!type) {
      return null;
    }
    const value = type === "identifier-list" ? list : tokens.secondaryName.value;
    return { type, value };
  }
  get arguments() {
    const { rhsType, list } = this.params;
    if (!list || rhsType === "identifier-list") {
      return [];
    }
    return list;
  }

  *validate(defs) {
    if (this.name === "NoInterfaceObject") {
      const message = `\`[NoInterfaceObject]\` extended attribute is an \
undesirable feature that may be removed from Web IDL in the future. Refer to the \
[relevant upstream PR](https://github.com/heycam/webidl/pull/609) for more \
information.`;
      yield Object(_error_js__WEBPACK_IMPORTED_MODULE_3__["validationError"])(this.source, this.tokens.name, this, message, { level: "warning" });
    }
    for (const arg of this.arguments) {
      yield* arg.validate(defs);
    }
  }
}

// Note: we parse something simpler than the official syntax. It's all that ever
// seems to be used
class ExtendedAttributes extends _array_base_js__WEBPACK_IMPORTED_MODULE_1__["ArrayBase"] {
  /**
   * @param {import("../tokeniser").Tokeniser} tokeniser
   */
  static parse(tokeniser) {
    const tokens = {};
    tokens.open = tokeniser.consume("[");
    if (!tokens.open) return new ExtendedAttributes({});
    const ret = new ExtendedAttributes({ source: tokeniser.source, tokens });
    ret.push(...Object(_helpers_js__WEBPACK_IMPORTED_MODULE_2__["list"])(tokeniser, {
      parser: SimpleExtendedAttribute.parse,
      listName: "extended attribute"
    }));
    tokens.close = tokeniser.consume("]") || tokeniser.error("Unexpected closing token of extended attribute");
    if (!ret.length) {
      tokeniser.error("Found an empty extended attribute");
    }
    if (tokeniser.probe("[")) {
      tokeniser.error("Illegal double extended attribute lists, consider merging them");
    }
    return ret;
  }

  *validate(defs) {
    for (const extAttr of this) {
      yield* extAttr.validate(defs);
    }
  }
}


/***/ }),
/* 105 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ArrayBase", function() { return ArrayBase; });
class ArrayBase extends Array {
  constructor({ source, tokens }) {
    super();
    Object.defineProperties(this, {
      source: { value: source },
      tokens: { value: tokens }
    });
  }
}


/***/ }),
/* 106 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Token", function() { return Token; });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(100);


class Token extends _base_js__WEBPACK_IMPORTED_MODULE_0__["Base"] {
  /**
   * @param {import("../tokeniser").Tokeniser} tokeniser
   * @param {string} type
   */
  static parser(tokeniser, type) {
    return () => {
      const value = tokeniser.consume(type);
      if (value) {
        return new Token({ source: tokeniser.source, tokens: { value } });
      }
    };
  }

  get value() {
    return this.tokens.value.value;
  }
}


/***/ }),
/* 107 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Operation", function() { return Operation; });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(100);
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(98);



class Operation extends _base_js__WEBPACK_IMPORTED_MODULE_0__["Base"] {
  /**
   * @param {import("../tokeniser.js").Tokeniser} tokeniser
   */
  static parse(tokeniser, { special, regular } = {}) {
    const tokens = { special };
    const ret = new Operation({ source: tokeniser.source, tokens });
    if (special && special.value === "stringifier") {
      tokens.termination = tokeniser.consume(";");
      if (tokens.termination) {
        ret.arguments = [];
        return ret;
      }
    }
    if (!special && !regular) {
      tokens.special = tokeniser.consume("getter", "setter", "deleter");
    }
    ret.idlType = Object(_helpers_js__WEBPACK_IMPORTED_MODULE_1__["return_type"])(tokeniser) || tokeniser.error("Missing return type");
    tokens.name = tokeniser.consume("identifier", "includes");
    tokens.open = tokeniser.consume("(") || tokeniser.error("Invalid operation");
    ret.arguments = Object(_helpers_js__WEBPACK_IMPORTED_MODULE_1__["argument_list"])(tokeniser);
    tokens.close = tokeniser.consume(")") || tokeniser.error("Unterminated operation");
    tokens.termination = tokeniser.consume(";") || tokeniser.error("Unterminated operation, expected `;`");
    return ret;
  }

  get type() {
    return "operation";
  }
  get name() {
    const { name } = this.tokens;
    if (!name) {
      return "";
    }
    return Object(_helpers_js__WEBPACK_IMPORTED_MODULE_1__["unescape"])(name.value);
  }
  get special() {
    if (!this.tokens.special) {
      return "";
    }
    return this.tokens.special.value;
  }

  *validate(defs) {
    if (this.idlType) {
      yield* this.idlType.validate(defs);
    }
    for (const argument of this.arguments) {
      yield* argument.validate(defs);
    }
  }
}


/***/ }),
/* 108 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Attribute", function() { return Attribute; });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(100);
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(98);



class Attribute extends _base_js__WEBPACK_IMPORTED_MODULE_0__["Base"] {
  /**
   * @param {import("../tokeniser.js").Tokeniser} tokeniser
   */
  static parse(tokeniser, { special, noInherit = false, readonly = false } = {}) {
    const start_position = tokeniser.position;
    const tokens = { special };
    const ret = new Attribute({ source: tokeniser.source, tokens });
    if (!special && !noInherit) {
      tokens.special = tokeniser.consume("inherit");
    }
    if (ret.special === "inherit" && tokeniser.probe("readonly")) {
      tokeniser.error("Inherited attributes cannot be read-only");
    }
    tokens.readonly = tokeniser.consume("readonly");
    if (readonly && !tokens.readonly && tokeniser.probe("attribute")) {
      tokeniser.error("Attributes must be readonly in this context");
    }
    tokens.base = tokeniser.consume("attribute");
    if (!tokens.base) {
      tokeniser.unconsume(start_position);
      return;
    }
    ret.idlType = Object(_helpers_js__WEBPACK_IMPORTED_MODULE_1__["type_with_extended_attributes"])(tokeniser, "attribute-type") || tokeniser.error("Attribute lacks a type");
    switch (ret.idlType.generic) {
      case "sequence":
      case "record": tokeniser.error(`Attributes cannot accept ${ret.idlType.generic} types`);
    }
    tokens.name = tokeniser.consume("identifier", "async", "required") || tokeniser.error("Attribute lacks a name");
    tokens.termination = tokeniser.consume(";") || tokeniser.error("Unterminated attribute, expected `;`");
    return ret;
  }

  get type() {
    return "attribute";
  }
  get special() {
    if (!this.tokens.special) {
      return "";
    }
    return this.tokens.special.value;
  }
  get readonly() {
    return !!this.tokens.readonly;
  }
  get name() {
    return Object(_helpers_js__WEBPACK_IMPORTED_MODULE_1__["unescape"])(this.tokens.name.value);
  }

  *validate(defs) {
    yield* this.idlType.validate(defs);
  }
}


/***/ }),
/* 109 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Includes", function() { return Includes; });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(100);
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(98);



class Includes extends _base_js__WEBPACK_IMPORTED_MODULE_0__["Base"] {
  /**
   * @param {import("../tokeniser").Tokeniser} tokeniser
   */
  static parse(tokeniser) {
    const target = tokeniser.consume("identifier");
    if (!target) {
      return;
    }
    const tokens = { target };
    tokens.includes = tokeniser.consume("includes");
    if (!tokens.includes) {
      tokeniser.unconsume(target.index);
      return;
    }
    tokens.mixin = tokeniser.consume("identifier") || tokeniser.error("Incomplete includes statement");
    tokens.termination = tokeniser.consume(";") || tokeniser.error("No terminating ; for includes statement");
    return new Includes({ source: tokeniser.source, tokens });
  }

  get type() {
    return "includes";
  }
  get target() {
    return Object(_helpers_js__WEBPACK_IMPORTED_MODULE_1__["unescape"])(this.tokens.target.value);
  }
  get includes() {
    return Object(_helpers_js__WEBPACK_IMPORTED_MODULE_1__["unescape"])(this.tokens.mixin.value);
  }
}


/***/ }),
/* 110 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Typedef", function() { return Typedef; });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(100);
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(98);



class Typedef extends _base_js__WEBPACK_IMPORTED_MODULE_0__["Base"] {
  /**
   * @param {import("../tokeniser").Tokeniser} tokeniser
   */
  static parse(tokeniser) {
    const tokens = {};
    const ret = new Typedef({ source: tokeniser.source, tokens });
    tokens.base = tokeniser.consume("typedef");
    if (!tokens.base) {
      return;
    }
    ret.idlType = Object(_helpers_js__WEBPACK_IMPORTED_MODULE_1__["type_with_extended_attributes"])(tokeniser, "typedef-type") || tokeniser.error("Typedef lacks a type");
    tokens.name = tokeniser.consume("identifier") || tokeniser.error("Typedef lacks a name");
    tokeniser.current = ret;
    tokens.termination = tokeniser.consume(";") || tokeniser.error("Unterminated typedef, expected `;`");
    return ret;
  }

  get type() {
    return "typedef";
  }
  get name() {
    return Object(_helpers_js__WEBPACK_IMPORTED_MODULE_1__["unescape"])(this.tokens.name.value);
  }

  *validate(defs) {
    yield* this.idlType.validate(defs);
  }
}


/***/ }),
/* 111 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CallbackFunction", function() { return CallbackFunction; });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(100);
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(98);



class CallbackFunction extends _base_js__WEBPACK_IMPORTED_MODULE_0__["Base"] {
  /**
   * @param {import("../tokeniser.js").Tokeniser} tokeniser
   */
  static parse(tokeniser, base) {
    const tokens = { base };
    const ret = new CallbackFunction({ source: tokeniser.source, tokens });
    tokens.name = tokeniser.consume("identifier") || tokeniser.error("Callback lacks a name");
    tokeniser.current = ret;
    tokens.assign = tokeniser.consume("=") || tokeniser.error("Callback lacks an assignment");
    ret.idlType = Object(_helpers_js__WEBPACK_IMPORTED_MODULE_1__["return_type"])(tokeniser) || tokeniser.error("Callback lacks a return type");
    tokens.open = tokeniser.consume("(") || tokeniser.error("Callback lacks parentheses for arguments");
    ret.arguments = Object(_helpers_js__WEBPACK_IMPORTED_MODULE_1__["argument_list"])(tokeniser);
    tokens.close = tokeniser.consume(")") || tokeniser.error("Unterminated callback");
    tokens.termination = tokeniser.consume(";") || tokeniser.error("Unterminated callback, expected `;`");
    return ret;
  }

  get type() {
    return "callback";
  }
  get name() {
    return Object(_helpers_js__WEBPACK_IMPORTED_MODULE_1__["unescape"])(this.tokens.name.value);
  }

  *validate(defs) {
    yield* this.idlType.validate(defs);
  }
}


/***/ }),
/* 112 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Interface", function() { return Interface; });
/* harmony import */ var _container_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(113);
/* harmony import */ var _attribute_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(108);
/* harmony import */ var _operation_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(107);
/* harmony import */ var _constant_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(114);
/* harmony import */ var _iterable_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(115);
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(98);
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(96);
/* harmony import */ var _validators_interface_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(116);









/**
 * @param {import("../tokeniser").Tokeniser} tokeniser
 */
function static_member(tokeniser) {
  const special = tokeniser.consume("static");
  if (!special) return;
  const member = _attribute_js__WEBPACK_IMPORTED_MODULE_1__["Attribute"].parse(tokeniser, { special }) ||
    _operation_js__WEBPACK_IMPORTED_MODULE_2__["Operation"].parse(tokeniser, { special }) ||
    tokeniser.error("No body in static member");
  return member;
}

class Interface extends _container_js__WEBPACK_IMPORTED_MODULE_0__["Container"] {
  /**
   * @param {import("../tokeniser").Tokeniser} tokeniser
   */
  static parse(tokeniser, base, { partial = null } = {}) {
    const tokens = { partial, base };
    return _container_js__WEBPACK_IMPORTED_MODULE_0__["Container"].parse(tokeniser, new Interface({ source: tokeniser.source, tokens }), {
      type: "interface",
      inheritable: !partial,
      allowedMembers: [
        [_constant_js__WEBPACK_IMPORTED_MODULE_3__["Constant"].parse],
        [static_member],
        [_helpers_js__WEBPACK_IMPORTED_MODULE_5__["stringifier"]],
        [_iterable_js__WEBPACK_IMPORTED_MODULE_4__["IterableLike"].parse],
        [_attribute_js__WEBPACK_IMPORTED_MODULE_1__["Attribute"].parse],
        [_operation_js__WEBPACK_IMPORTED_MODULE_2__["Operation"].parse]
      ]
    });
  }

  get type() {
    return "interface";
  }

  *validate(defs) {
    yield* this.extAttrs.validate(defs);
    if (
      !this.partial &&
      this.extAttrs.every(extAttr => extAttr.name !== "Exposed") &&
      this.extAttrs.every(extAttr => extAttr.name !== "NoInterfaceObject")
    ) {
      const message = `Interfaces must have \`[Exposed]\` extended attribute. \
To fix, add, for example, \`[Exposed=Window]\`. Please also consider carefully \
if your interface should also be exposed in a Worker scope. Refer to the \
[WebIDL spec section on Exposed](https://heycam.github.io/webidl/#Exposed) \
for more information.`;
      yield Object(_error_js__WEBPACK_IMPORTED_MODULE_6__["validationError"])(this.source, this.tokens.name, this, message, {
        autofix: Object(_helpers_js__WEBPACK_IMPORTED_MODULE_5__["autofixAddExposedWindow"])(this)
      });
    }

    yield* super.validate(defs);
    if (!this.partial) {
      yield* Object(_validators_interface_js__WEBPACK_IMPORTED_MODULE_7__["checkInterfaceMemberDuplication"])(defs, this);
    }
  }
}


/***/ }),
/* 113 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Container", function() { return Container; });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(100);
/* harmony import */ var _extended_attributes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(104);
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(98);




/**
 * @param {import("../tokeniser.js").Tokeniser} tokeniser
 */
function inheritance(tokeniser) {
  const colon = tokeniser.consume(":");
  if (!colon) {
    return {};
  }
  const inheritance = tokeniser.consume("identifier") || tokeniser.error("Inheritance lacks a type");
  return { colon, inheritance };
}

class Container extends _base_js__WEBPACK_IMPORTED_MODULE_0__["Base"] {
    /**
     * @param {import("../tokeniser.js").Tokeniser} tokeniser
     * @param {*} instance
     * @param {*} args
     */
    static parse(tokeniser, instance, { type, inheritable, allowedMembers }) {
      const { tokens } = instance;
      tokens.name = tokeniser.consume("identifier") || tokeniser.error(`Missing name in ${instance.type}`);
      tokeniser.current = instance;
      if (inheritable) {
        Object.assign(tokens, inheritance(tokeniser));
      }
      tokens.open = tokeniser.consume("{") || tokeniser.error(`Bodyless ${type}`);
      instance.members = [];
      while (true) {
        tokens.close = tokeniser.consume("}");
        if (tokens.close) {
          tokens.termination = tokeniser.consume(";") || tokeniser.error(`Missing semicolon after ${type}`);
          return instance;
        }
        const ea = _extended_attributes_js__WEBPACK_IMPORTED_MODULE_1__["ExtendedAttributes"].parse(tokeniser);
        let mem;
        for (const [parser, ...args] of allowedMembers) {
          mem = parser(tokeniser, ...args);
          if (mem) {
            break;
          }
        }
        if (!mem) {
          tokeniser.error("Unknown member");
        }
        mem.extAttrs = ea;
        instance.members.push(mem);
      }
    }

    get partial() {
      return !!this.tokens.partial;
    }
    get name() {
      return Object(_helpers_js__WEBPACK_IMPORTED_MODULE_2__["unescape"])(this.tokens.name.value);
    }
    get inheritance() {
      if (!this.tokens.inheritance) {
        return null;
      }
      return Object(_helpers_js__WEBPACK_IMPORTED_MODULE_2__["unescape"])(this.tokens.inheritance.value);
    }

    *validate(defs) {
      for (const member of this.members) {
        if (member.validate) {
          yield* member.validate(defs);
        }
      }
    }
  }


/***/ }),
/* 114 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Constant", function() { return Constant; });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(100);
/* harmony import */ var _type_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(99);
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(98);




class Constant extends _base_js__WEBPACK_IMPORTED_MODULE_0__["Base"] {
  /**
   * @param {import("../tokeniser.js").Tokeniser} tokeniser
   */
  static parse(tokeniser) {
    const tokens = {};
    tokens.base = tokeniser.consume("const");
    if (!tokens.base) {
      return;
    }
    let idlType = Object(_helpers_js__WEBPACK_IMPORTED_MODULE_2__["primitive_type"])(tokeniser);
    if (!idlType) {
      const base = tokeniser.consume("identifier") || tokeniser.error("Const lacks a type");
      idlType = new _type_js__WEBPACK_IMPORTED_MODULE_1__["Type"]({ source: tokeniser.source, tokens: { base } });
    }
    if (tokeniser.probe("?")) {
      tokeniser.error("Unexpected nullable constant type");
    }
    idlType.type = "const-type";
    tokens.name = tokeniser.consume("identifier") || tokeniser.error("Const lacks a name");
    tokens.assign = tokeniser.consume("=") || tokeniser.error("Const lacks value assignment");
    tokens.value = Object(_helpers_js__WEBPACK_IMPORTED_MODULE_2__["const_value"])(tokeniser) || tokeniser.error("Const lacks a value");
    tokens.termination = tokeniser.consume(";") || tokeniser.error("Unterminated const, expected `;`");
    const ret = new Constant({ source: tokeniser.source, tokens });
    ret.idlType = idlType;
    return ret;
  }

  get type() {
    return "const";
  }
  get name() {
    return unescape(this.tokens.name.value);
  }
  get value() {
    return Object(_helpers_js__WEBPACK_IMPORTED_MODULE_2__["const_data"])(this.tokens.value);
  }
}


/***/ }),
/* 115 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IterableLike", function() { return IterableLike; });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(100);
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(98);



class IterableLike extends _base_js__WEBPACK_IMPORTED_MODULE_0__["Base"] {
  /**
   * @param {import("../tokeniser.js").Tokeniser} tokeniser
   */
  static parse(tokeniser) {
    const start_position = tokeniser.position;
    const tokens = {};
    const ret = new IterableLike({ source: tokeniser.source, tokens });
    tokens.readonly = tokeniser.consume("readonly");
    if (!tokens.readonly) {
      tokens.async = tokeniser.consume("async");
    }
    tokens.base =
      tokens.readonly ? tokeniser.consume("maplike", "setlike") :
      tokens.async ? tokeniser.consume("iterable") :
      tokeniser.consume("iterable", "maplike", "setlike");
    if (!tokens.base) {
      tokeniser.unconsume(start_position);
      return;
    }

    const { type } = ret;
    const secondTypeRequired = type === "maplike" || ret.async;
    const secondTypeAllowed = secondTypeRequired || type === "iterable";

    tokens.open = tokeniser.consume("<") || tokeniser.error(`Missing less-than sign \`<\` in ${type} declaration`);
    const first = Object(_helpers_js__WEBPACK_IMPORTED_MODULE_1__["type_with_extended_attributes"])(tokeniser) || tokeniser.error(`Missing a type argument in ${type} declaration`);
    ret.idlType = [first];
    if (secondTypeAllowed) {
      first.tokens.separator = tokeniser.consume(",");
      if (first.tokens.separator) {
        ret.idlType.push(Object(_helpers_js__WEBPACK_IMPORTED_MODULE_1__["type_with_extended_attributes"])(tokeniser));
      }
      else if (secondTypeRequired) {
        tokeniser.error(`Missing second type argument in ${type} declaration`);
      }
    }
    tokens.close = tokeniser.consume(">") || tokeniser.error(`Missing greater-than sign \`>\` in ${type} declaration`);
    tokens.termination = tokeniser.consume(";") || tokeniser.error(`Missing semicolon after ${type} declaration`);

    return ret;
  }

  get type() {
    return this.tokens.base.value;
  }
  get readonly() {
    return !!this.tokens.readonly;
  }
  get async() {
    return !!this.tokens.async;
  }
}


/***/ }),
/* 116 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkInterfaceMemberDuplication", function() { return checkInterfaceMemberDuplication; });
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(96);


function* checkInterfaceMemberDuplication(defs, i) {
  const opNames = new Set(getOperations(i).map(op => op.name));
  const partials = defs.partials.get(i.name) || [];
  const mixins = defs.mixinMap.get(i.name) || [];
  for (const ext of [...partials, ...mixins]) {
    const additions = getOperations(ext);
    yield* forEachExtension(additions, opNames, ext, i);
    for (const addition of additions) {
      opNames.add(addition.name);
    }
  }

  function* forEachExtension(additions, existings, ext, base) {
    for (const addition of additions) {
      const { name } = addition;
      if (name && existings.has(name)) {
        const message = `The operation "${name}" has already been defined for the base interface "${base.name}" either in itself or in a mixin`;
        yield Object(_error_js__WEBPACK_IMPORTED_MODULE_0__["validationError"])(ext.source, addition.tokens.name, ext, message);
      }
    }
  }

  function getOperations(i) {
    return i.members
      .filter(({type}) => type === "operation");
  }
}


/***/ }),
/* 117 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Mixin", function() { return Mixin; });
/* harmony import */ var _container_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(113);
/* harmony import */ var _constant_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(114);
/* harmony import */ var _attribute_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(108);
/* harmony import */ var _operation_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(107);
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(98);






class Mixin extends _container_js__WEBPACK_IMPORTED_MODULE_0__["Container"] {
  /**
   * @param {import("../tokeniser").Tokeniser} tokeniser
   */
  static parse(tokeniser, base, { partial } = {}) {
    const tokens = { partial, base };
    tokens.mixin = tokeniser.consume("mixin");
    if (!tokens.mixin) {
      return;
    }
    return _container_js__WEBPACK_IMPORTED_MODULE_0__["Container"].parse(tokeniser, new Mixin({ source: tokeniser.source, tokens }), {
      type: "interface mixin",
      allowedMembers: [
        [_constant_js__WEBPACK_IMPORTED_MODULE_1__["Constant"].parse],
        [_helpers_js__WEBPACK_IMPORTED_MODULE_4__["stringifier"]],
        [_attribute_js__WEBPACK_IMPORTED_MODULE_2__["Attribute"].parse, { noInherit: true }],
        [_operation_js__WEBPACK_IMPORTED_MODULE_3__["Operation"].parse, { regular: true }]
      ]
    });
  }

  get type() {
    return "interface mixin";
  }
}


/***/ }),
/* 118 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Dictionary", function() { return Dictionary; });
/* harmony import */ var _container_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(113);
/* harmony import */ var _field_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(119);



class Dictionary extends _container_js__WEBPACK_IMPORTED_MODULE_0__["Container"] {
  /**
   * @param {import("../tokeniser").Tokeniser} tokeniser
   */
  static parse(tokeniser, { partial } = {}) {
    const tokens = { partial };
    tokens.base = tokeniser.consume("dictionary");
    if (!tokens.base) {
      return;
    }
    return _container_js__WEBPACK_IMPORTED_MODULE_0__["Container"].parse(tokeniser, new Dictionary({ source: tokeniser.source, tokens }), {
      type: "dictionary",
      inheritable: !partial,
      allowedMembers: [
        [_field_js__WEBPACK_IMPORTED_MODULE_1__["Field"].parse],
      ]
    });
  }

  get type() {
    return "dictionary";
  }
}


/***/ }),
/* 119 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Field", function() { return Field; });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(100);
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(98);
/* harmony import */ var _extended_attributes_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(104);
/* harmony import */ var _default_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(103);





class Field extends _base_js__WEBPACK_IMPORTED_MODULE_0__["Base"] {
  /**
   * @param {import("../tokeniser").Tokeniser} tokeniser
   */
  static parse(tokeniser) {
    const tokens = {};
    const ret = new Field({ source: tokeniser.source, tokens });
    ret.extAttrs = _extended_attributes_js__WEBPACK_IMPORTED_MODULE_2__["ExtendedAttributes"].parse(tokeniser);
    tokens.required = tokeniser.consume("required");
    ret.idlType = Object(_helpers_js__WEBPACK_IMPORTED_MODULE_1__["type_with_extended_attributes"])(tokeniser, "dictionary-type") || tokeniser.error("Dictionary member lacks a type");
    tokens.name = tokeniser.consume("identifier") || tokeniser.error("Dictionary member lacks a name");
    ret.default = _default_js__WEBPACK_IMPORTED_MODULE_3__["Default"].parse(tokeniser);
    if (tokens.required && ret.default) tokeniser.error("Required member must not have a default");
    tokens.termination = tokeniser.consume(";") || tokeniser.error("Unterminated dictionary member, expected `;`");
    return ret;
  }

  get type() {
    return "field";
  }
  get name() {
    return Object(_helpers_js__WEBPACK_IMPORTED_MODULE_1__["unescape"])(this.tokens.name.value);
  }
  get required() {
    return !!this.tokens.required;
  }

  *validate(defs) {
    yield* this.idlType.validate(defs);
  }
}


/***/ }),
/* 120 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Namespace", function() { return Namespace; });
/* harmony import */ var _container_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(113);
/* harmony import */ var _attribute_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(108);
/* harmony import */ var _operation_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(107);
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(96);
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(98);






class Namespace extends _container_js__WEBPACK_IMPORTED_MODULE_0__["Container"] {
  /**
   * @param {import("../tokeniser").Tokeniser} tokeniser
   */
  static parse(tokeniser, { partial } = {}) {
    const tokens = { partial };
    tokens.base = tokeniser.consume("namespace");
    if (!tokens.base) {
      return;
    }
    return _container_js__WEBPACK_IMPORTED_MODULE_0__["Container"].parse(tokeniser, new Namespace({ source: tokeniser.source, tokens }), {
      type: "namespace",
      allowedMembers: [
        [_attribute_js__WEBPACK_IMPORTED_MODULE_1__["Attribute"].parse, { noInherit: true, readonly: true }],
        [_operation_js__WEBPACK_IMPORTED_MODULE_2__["Operation"].parse, { regular: true }]
      ]
    });
  }

  get type() {
    return "namespace";
  }

  *validate(defs) {
    if (!this.partial && this.extAttrs.every(extAttr => extAttr.name !== "Exposed")) {
      const message = `Namespaces must have [Exposed] extended attribute. \
To fix, add, for example, [Exposed=Window]. Please also consider carefully \
if your namespace should also be exposed in a Worker scope. Refer to the \
[WebIDL spec section on Exposed](https://heycam.github.io/webidl/#Exposed) \
for more information.`;
      yield Object(_error_js__WEBPACK_IMPORTED_MODULE_3__["validationError"])(this.source, this.tokens.name, this, message, {
        autofix: Object(_helpers_js__WEBPACK_IMPORTED_MODULE_4__["autofixAddExposedWindow"])(this)
      });
    }
    yield* super.validate(defs);
  }
}


/***/ }),
/* 121 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CallbackInterface", function() { return CallbackInterface; });
/* harmony import */ var _container_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(113);
/* harmony import */ var _operation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(107);
/* harmony import */ var _constant_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(114);





class CallbackInterface extends _container_js__WEBPACK_IMPORTED_MODULE_0__["Container"] {
  /**
   * @param {import("../tokeniser").Tokeniser} tokeniser
   */
  static parse(tokeniser, callback, { partial = null } = {}) {
    const tokens = { callback };
    tokens.base = tokeniser.consume("interface");
    if (!tokens.base) {
      return;
    }
    return _container_js__WEBPACK_IMPORTED_MODULE_0__["Container"].parse(tokeniser, new CallbackInterface({ source: tokeniser.source, tokens }), {
      type: "callback interface",
      inheritable: !partial,
      allowedMembers: [
        [_constant_js__WEBPACK_IMPORTED_MODULE_2__["Constant"].parse],
        [_operation_js__WEBPACK_IMPORTED_MODULE_1__["Operation"].parse, { regular: true }]
      ]
    });
  }

  get type() {
    return "callback interface";
  }
}


/***/ }),
/* 122 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "write", function() { return write; });


function noop(arg) {
  return arg;
}

const templates = {
  wrap: items => items.join(""),
  trivia: noop,
  name: noop,
  reference: noop,
  type: noop,
  generic: noop,
  inheritance: noop,
  definition: noop,
  extendedAttribute: noop,
  extendedAttributeReference: noop
};

function write(ast, { templates: ts = templates } = {}) {
  ts = Object.assign({}, templates, ts);

  function reference(raw, { unescaped, context }) {
    if (!unescaped) {
      unescaped = raw.startsWith("_") ? raw.slice(1) : raw;
    }
    return ts.reference(raw, unescaped, context);
  }

  function token(t, wrapper = noop, ...args) {
    if (!t) {
      return "";
    }
    const value = wrapper(t.value, ...args);
    return ts.wrap([ts.trivia(t.trivia), value]);
  }

  function reference_token(t, context) {
    return token(t, reference, { context });
  }

  function name_token(t, arg) {
    return token(t, ts.name, arg);
  }

  function type_body(it) {
    if (it.union || it.generic) {
      return ts.wrap([
        token(it.tokens.base, ts.generic),
        token(it.tokens.open),
        ...it.subtype.map(type),
        token(it.tokens.close)
      ]);
    }
    const firstToken = it.tokens.prefix || it.tokens.base;
    const prefix = it.tokens.prefix ? [
      it.tokens.prefix.value,
      ts.trivia(it.tokens.base.trivia)
    ] : [];
    const ref = reference(ts.wrap([
      ...prefix,
      it.tokens.base.value,
      token(it.tokens.postfix)
    ]), { unescaped: it.idlType, context: it });
    return ts.wrap([ts.trivia(firstToken.trivia), ref]);
  }
  function type(it) {
    return ts.wrap([
      extended_attributes(it.extAttrs),
      type_body(it),
      token(it.tokens.nullable),
      token(it.tokens.separator)
    ]);
  }
  function default_(def) {
    if (!def) {
      return "";
    }
    return ts.wrap([
      token(def.tokens.assign),
      ...def.expression.map(t => token(t))
    ]);
  }
  function argument(arg) {
    return ts.wrap([
      extended_attributes(arg.extAttrs),
      token(arg.tokens.optional),
      ts.type(type(arg.idlType)),
      token(arg.tokens.variadic),
      name_token(arg.tokens.name, { data: arg }),
      default_(arg.default),
      token(arg.tokens.separator)
    ]);
  }
  function identifier(id, context) {
    return ts.wrap([
      reference_token(id.tokens.value, context),
      token(id.tokens.separator)
    ]);
  }
  function make_ext_at(it) {
    const { rhsType } = it.params;
    return ts.wrap([
      ts.trivia(it.tokens.name.trivia),
      ts.extendedAttribute(ts.wrap([
        ts.extendedAttributeReference(it.name),
        token(it.params.tokens.assign),
        reference_token(it.params.tokens.secondaryName, it),
        token(it.params.tokens.open),
        ...!it.params.list ? [] :
          it.params.list.map(
            rhsType === "identifier-list" ? id => identifier(id, it) : argument
          ),
        token(it.params.tokens.close)
      ])),
      token(it.tokens.separator)
    ]);
  }
  function extended_attributes(eats) {
    if (!eats.length) return "";
    return ts.wrap([
      token(eats.tokens.open),
      ...eats.map(make_ext_at),
      token(eats.tokens.close)
    ]);
  }

  function operation(it, parent) {
    const body = it.idlType ? [
      ts.type(type(it.idlType)),
      name_token(it.tokens.name, { data: it, parent }),
      token(it.tokens.open),
      ts.wrap(it.arguments.map(argument)),
      token(it.tokens.close),
    ] : [];
    return ts.definition(ts.wrap([
      extended_attributes(it.extAttrs),
      token(it.tokens.special),
      ...body,
      token(it.tokens.termination)
    ]), { data: it, parent });
  }

  function attribute(it, parent) {
    return ts.definition(ts.wrap([
      extended_attributes(it.extAttrs),
      token(it.tokens.special),
      token(it.tokens.readonly),
      token(it.tokens.base),
      ts.type(type(it.idlType)),
      name_token(it.tokens.name, { data: it, parent }),
      token(it.tokens.termination)
    ]), { data: it, parent });
  }

  function inheritance(inh) {
    if (!inh.tokens.inheritance) {
      return "";
    }
    return ts.wrap([
      token(inh.tokens.colon),
      ts.trivia(inh.tokens.inheritance.trivia),
      ts.inheritance(reference(inh.tokens.inheritance.value, { context: inh }))
    ]);
  }

  function container(it) {
    return ts.definition(ts.wrap([
      extended_attributes(it.extAttrs),
      token(it.tokens.callback),
      token(it.tokens.partial),
      token(it.tokens.base),
      token(it.tokens.mixin),
      name_token(it.tokens.name, { data: it }),
      inheritance(it),
      token(it.tokens.open),
      iterate(it.members, it),
      token(it.tokens.close),
      token(it.tokens.termination)
    ]), { data: it });
  }

  function field(it, parent) {
    return ts.definition(ts.wrap([
      extended_attributes(it.extAttrs),
      token(it.tokens.required),
      ts.type(type(it.idlType)),
      name_token(it.tokens.name, { data: it, parent }),
      default_(it.default),
      token(it.tokens.termination)
    ]), { data: it, parent });
  }
  function const_(it, parent) {
    return ts.definition(ts.wrap([
      extended_attributes(it.extAttrs),
      token(it.tokens.base),
      ts.type(type(it.idlType)),
      name_token(it.tokens.name, { data: it, parent }),
      token(it.tokens.assign),
      token(it.tokens.value),
      token(it.tokens.termination)
    ]), { data: it, parent });
  }
  function typedef(it) {
    return ts.definition(ts.wrap([
      extended_attributes(it.extAttrs),
      token(it.tokens.base),
      ts.type(type(it.idlType)),
      name_token(it.tokens.name, { data: it }),
      token(it.tokens.termination)
    ]), { data: it });
  }
  function includes(it) {
    return ts.definition(ts.wrap([
      extended_attributes(it.extAttrs),
      reference_token(it.tokens.target, it),
      token(it.tokens.includes),
      reference_token(it.tokens.mixin, it),
      token(it.tokens.termination)
    ]), { data: it });
  }
  function callback(it) {
    return ts.definition(ts.wrap([
      extended_attributes(it.extAttrs),
      token(it.tokens.base),
      name_token(it.tokens.name, { data: it }),
      token(it.tokens.assign),
      ts.type(type(it.idlType)),
      token(it.tokens.open),
      ...it.arguments.map(argument),
      token(it.tokens.close),
      token(it.tokens.termination),
    ]), { data: it });
  }
  function enum_(it) {
    return ts.definition(ts.wrap([
      extended_attributes(it.extAttrs),
      token(it.tokens.base),
      name_token(it.tokens.name, { data: it }),
      token(it.tokens.open),
      iterate(it.values, it),
      token(it.tokens.close),
      token(it.tokens.termination)
    ]), { data: it });
  }
  function enum_value(v, parent) {
    return ts.wrap([
      ts.trivia(v.tokens.value.trivia),
      ts.definition(
        ts.wrap(['"', ts.name(v.value, { data: v, parent }), '"']),
        { data: v, parent }
      ),
      token(v.tokens.separator)
    ]);
  }
  function iterable_like(it, parent) {
    return ts.definition(ts.wrap([
      extended_attributes(it.extAttrs),
      token(it.tokens.readonly),
      token(it.tokens.async),
      token(it.tokens.base, ts.generic),
      token(it.tokens.open),
      ts.wrap(it.idlType.map(type)),
      token(it.tokens.close),
      token(it.tokens.termination)
    ]), { data: it, parent });
  }
  function eof(it) {
    return ts.trivia(it.trivia);
  }

  const table = {
    interface: container,
    "interface mixin": container,
    namespace: container,
    operation,
    attribute,
    dictionary: container,
    field,
    const: const_,
    typedef,
    includes,
    callback,
    enum: enum_,
    "enum-value": enum_value,
    iterable: iterable_like,
    legacyiterable: iterable_like,
    maplike: iterable_like,
    setlike: iterable_like,
    "callback interface": container,
    eof
  };
  function dispatch(it, parent) {
    const dispatcher = table[it.type];
    if (!dispatcher) {
      throw new Error(`Type "${it.type}" is unsupported`);
    }
    return table[it.type](it, parent);
  }
  function iterate(things, parent) {
    if (!things) return;
    const results = things.map(thing => dispatch(thing, parent));
    return ts.wrap(results);
  }
  return iterate(ast);
}


/***/ }),
/* 123 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validate", function() { return validate; });
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(96);




function getMixinMap(all, unique) {
  const map = new Map();
  const includes = all.filter(def => def.type === "includes");
  for (const include of includes) {
    const mixin = unique.get(include.includes);
    if (!mixin) {
      continue;
    }
    const array = map.get(include.target);
    if (array) {
      array.push(mixin);
    } else {
      map.set(include.target, [mixin]);
    }
  }
  return map;
}

function groupDefinitions(all) {
  const unique = new Map();
  const duplicates = new Set();
  const partials = new Map();
  for (const def of all) {
    if (def.partial) {
      const array = partials.get(def.name);
      if (array) {
        array.push(def);
      } else {
        partials.set(def.name, [def]);
      }
      continue;
    }
    if (!def.name) {
      continue;
    }
    if (!unique.has(def.name)) {
      unique.set(def.name, def);
    } else {
      duplicates.add(def);
    }
  }
  return {
    all,
    unique,
    partials,
    duplicates,
    mixinMap: getMixinMap(all, unique),
    cache: {
      typedefIncludesDictionary: new WeakMap()
    },
  };
}

function* checkDuplicatedNames({ unique, duplicates }) {
  for (const dup of duplicates) {
    const { name } = dup;
    const message = `The name "${name}" of type "${unique.get(name).type}" was already seen`;
    yield Object(_error_js__WEBPACK_IMPORTED_MODULE_0__["validationError"])(dup.source, dup.tokens.name, dup, message);
  }
}

function* validateIterable(ast) {
  const defs = groupDefinitions(ast);
  for (const def of defs.all) {
    if (def.validate) {
      yield* def.validate(defs);
    }
  }
  yield* checkDuplicatedNames(defs);
}

// Remove this once all of our support targets expose `.flat()` by default
function flatten(array) {
  if (array.flat) {
    return array.flat();
  }
  return [].concat(...array);
}

/**
 * @param {*} ast AST or array of ASTs
 */
function validate(ast) {
  return [...validateIterable(flatten(ast))];
}


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(56), __webpack_require__(3), __webpack_require__(9)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _dfnMap, _pubsubhub, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.findDfn = findDfn;
  _exports.addAlternativeNames = addAlternativeNames;
  _exports.decorateDfn = decorateDfn;
  // @ts-check
  const topLevelEntities = new Set(["callback interface", "callback", "dictionary", "enum", "interface mixin", "interface", "typedef"]);
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

  function findDfn(defn, name, {
    parent = ""
  } = {}) {
    return tryFindDfn(defn, parent, name);
  }
  /**
   * @param {*} defn
   * @param {string} parent
   * @param {string} name
   */


  function tryFindDfn(defn, parent, name) {
    switch (defn.type) {
      case "attribute":
        return findAttributeDfn(defn, parent, name);

      case "operation":
        return findOperationDfn(defn, parent, name);

      default:
        return findNormalDfn(defn, parent, name);
    }
  }
  /**
   * @param {*} defn
   * @param {string} parent
   * @param {string} name
   */


  function findAttributeDfn(defn, parent, name) {
    const dfn = findNormalDfn(defn, parent, name);

    if (!dfn) {
      return;
    }

    addAlternativeNames(dfn, getAlternativeNames("attribute", parent, name));
    return dfn;
  }

  function getAlternativeNames(type, parent, name) {
    const asQualifiedName = "".concat(parent, ".").concat(name);

    switch (type) {
      case "operation":
        {
          // Allow linking to both "method()" and "method" name.
          const asMethodName = "".concat(name, "()");
          const asFullyQualifiedName = "".concat(asQualifiedName, "()");
          return [asFullyQualifiedName, asQualifiedName, asMethodName, name];
        }

      case "attribute":
        return [asQualifiedName, name];
    }

    return;
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

    const asMethodName = "".concat(name, "()");
    const dfn = findNormalDfn(defn, parent, asMethodName) || findNormalDfn(defn, parent, name);

    if (!dfn) {
      return;
    }

    addAlternativeNames(dfn, getAlternativeNames("operation", parent, name));
    return dfn;
  }
  /**
   * @param {HTMLElement} dfn
   * @param {string[]} names
   */


  function addAlternativeNames(dfn, names) {
    const lt = dfn.dataset.lt ? dfn.dataset.lt.split("|") : [];
    lt.push(...names);
    dfn.dataset.lt = [...new Set(lt)].join("|");
    (0, _dfnMap.registerDefinition)(dfn, names);
  }
  /**
   * @param {*} defn
   * @param {string} parent
   * @param {string} name
   */


  function findNormalDfn(defn, parent, name) {
    let resolvedName = defn.type === "enum-value" && name === "" ? "the-empty-string" : name.toLowerCase();
    let dfnForArray = _dfnMap.definitionMap[resolvedName];
    let dfns = getDfns(dfnForArray, parent, name, defn.type); // If we haven't found any definitions with explicit [for]
    // and [title], look for a dotted definition, "parent.name".

    if (dfns.length === 0 && parent !== "") {
      resolvedName = "".concat(parent, ".").concat(resolvedName);
      dfnForArray = _dfnMap.definitionMap[resolvedName.toLowerCase()];

      if (dfnForArray !== undefined && dfnForArray.length === 1) {
        dfns = dfnForArray; // Found it: register with its local name

        delete _dfnMap.definitionMap[resolvedName];
        (0, _dfnMap.registerDefinition)(dfns[0], [resolvedName]);
      }
    }

    if (dfns.length > 1) {
      const msg = "Multiple `<dfn>`s for `".concat(name, "` ").concat(parent ? "in `".concat(parent, "`") : "");
      (0, _pubsubhub.pub)("error", msg);
    }

    if (dfns.length) {
      if (name !== resolvedName) {
        dfns[0].dataset.lt = resolvedName;
      }

      return dfns[0];
    }
  }
  /**
   * @param {HTMLElement} dfn
   * @param {*} defn
   * @param {string} parent
   * @param {string} name
   */


  function decorateDfn(dfn, defn, parent, name) {
    if (!dfn.id) {
      const lCaseParent = parent.toLowerCase();
      const middle = lCaseParent ? "".concat(lCaseParent, "-") : "";
      let last = name.toLowerCase().replace(/[()]/g, "").replace(/\s/g, "-");
      if (last === "") last = "the-empty-string";
      dfn.id = "dom-".concat(middle).concat(last);
    }

    dfn.dataset.idl = defn.type;
    dfn.dataset.title = dfn.textContent;
    dfn.dataset.dfnFor = parent; // Derive the data-type for dictionary members, interface attributes,
    // and methods

    switch (defn.type) {
      case "operation":
      case "attribute":
      case "field":
        dfn.dataset.type = getDataType(defn);
        break;
    } // Mark the definition as code.


    if (!dfn.querySelector("code") && !dfn.closest("code") && dfn.children) {
      (0, _utils.wrapInner)(dfn, dfn.ownerDocument.createElement("code"));
    } // Add data-lt values and register them


    switch (defn.type) {
      case "operation":
        addAlternativeNames(dfn, getAlternativeNames("operation", parent, name));
        break;

      case "attribute":
        addAlternativeNames(dfn, getAlternativeNames("attribute", parent, name));
        break;
    }

    return dfn;
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
    } // Definitions that have a title and [data-dfn-for] that exactly match the
    // IDL entity:


    const dfns = dfnForArray.filter(dfn => dfn.closest("[data-dfn-for=\"".concat(parent, "\"]"))); // If this is a top-level entity, and we didn't find anything with
    // an explicitly empty [for], try <dfn> that inherited a [for].

    if (dfns.length === 0 && parent === "" && dfnForArray.length === 1) {
      // Make sure the name exactly matches
      return dfnForArray[0].textContent === originalName ? dfnForArray : [];
    } else if (topLevelEntities.has(type) && dfnForArray.length) {
      const dfn = dfnForArray.find(dfn => dfn.textContent.trim() === originalName);
      if (dfn) return [dfn];
    }

    return dfns;
  }
  /**
   * @return {string}
   */


  function getDataType(idlStruct) {
    const {
      idlType,
      generic,
      union
    } = idlStruct;
    if (typeof idlType === "string") return idlType;
    if (generic) return generic; // join on "|" handles for "unsigned short" etc.

    if (union) return idlType.map(getDataType).join("|");
    return getDataType(idlType);
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=dfn-finder.js.map

/***/ }),
/* 125 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("/* --- WEB IDL --- */\n\npre.idl {\n  padding: 1em;\n  position: relative;\n}\n\n@media print {\n  pre.idl {\n    white-space: pre-wrap;\n  }\n}\n\npre.idl::before {\n  content: \"WebIDL\";\n  display: block;\n  width: 150px;\n  background: #90b8de;\n  color: #fff;\n  font-family: sans-serif;\n  font-weight: bold;\n  margin: -1em 0 1em -1em;\n  height: 28px;\n  line-height: 28px;  \n}\n\n.idlID {\n  font-weight: bold;\n  color: #005a9c;\n}\n\n.idlType {\n  color: #005a9c;\n}\n\n.idlName {\n  color: #ff4500;\n}\n\n.idlName a {\n  color: #ff4500;\n  border-bottom: 1px dotted #ff4500;\n  text-decoration: none;\n}\n\na.idlEnumItem {\n  color: #000;\n  border-bottom: 1px dotted #ccc;\n  text-decoration: none;\n}\n\n.idlSuperclass {\n  font-style: italic;\n  color: #005a9c;\n}\n\n\n/*.idlParam*/\n\n.idlParamName,\n.idlDefaultValue {\n  font-style: italic;\n}\n\n.extAttr {\n  color: #666;\n}\n\n\n/*.idlSectionComment*/\n\n.idlSectionComment {\n  color: gray;\n}\n\n.idlIncludes a {\n  font-weight: bold;\n}\n\n.respec-button-copy-paste:focus {\n  text-decoration: none;\n  border-color: #51a7e8;\n  outline: none;\n  box-shadow: 0 0 5px rgba(81, 167, 232, 0.5);\n}\n\n.respec-button-copy-paste:focus:hover,\n.respec-button-copy-paste.selected:focus {\n  border-color: #51a7e8;\n}\n\n.respec-button-copy-paste:hover,\n.respec-button-copy-paste:active,\n.respec-button-copy-paste.zeroclipboard-is-hover,\n.respec-button-copy-paste.zeroclipboard-is-active {\n  text-decoration: none;\n  background-color: #ddd;\n  background-image: linear-gradient(#eee, #ddd);\n  border-color: #ccc;\n}\n\n.respec-button-copy-paste:active,\n.respec-button-copy-paste.selected,\n.respec-button-copy-paste.zeroclipboard-is-active {\n  background-color: #dcdcdc;\n  background-image: none;\n  border-color: #b5b5b5;\n  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15)\n}\n\n.respec-button-copy-paste.selected:hover {\n  background-color: #cfcfcf;\n}\n\n.respec-button-copy-paste:disabled,\n.respec-button-copy-paste:disabled:hover,\n.respec-button-copy-paste.disabled,\n.respec-button-copy-paste.disabled:hover {\n  color: rgba(102, 102, 102, 0.5);\n  cursor: default;\n  background-color: rgba(229, 229, 229, 0.5);\n  background-image: none;\n  border-color: rgba(197, 197, 197, 0.5);\n  box-shadow: none;\n}\n\n@media print {\n  .respec-button-copy-paste {\n    visibility: hidden;\n  }\n}\n");

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(77), __webpack_require__(9)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _biblio, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.linkInlineCitations = linkInlineCitations;
  _exports.name = void 0;
  // @ts-check

  /**
   * Module core/data-cite
   *
   * Allows citing other specifications using
   * anchor elements. Simply add "data-cite"
   * and key of specification.
   *
   * This module simply adds the found key
   * to either conf.normativeReferences
   * or to conf.informativeReferences depending on
   * if it starts with a ! or not.
   *
   * Usage:
   * https://github.com/w3c/respec/wiki/data--cite
   */
  const name = "core/data-cite";
  _exports.name = name;

  function requestLookup(conf) {
    const toCiteDetails = citeDetailsConverter(conf);
    return async elem => {
      const originalKey = elem.dataset.cite;
      const {
        key,
        frag,
        path
      } = toCiteDetails(elem);
      let href = "";
      let title = ""; // This is just referring to this document

      if (key.toLowerCase() === conf.shortName.toLowerCase()) {
        console.log(elem, "The reference \"".concat(key, "\" is resolved into the current document per `conf.shortName`."));
        href = document.location.href;
      } else {
        // Let's go look it up in spec ref...
        const entry = await (0, _biblio.resolveRef)(key);
        cleanElement(elem);

        if (!entry) {
          (0, _utils.showInlineWarning)(elem, "Couldn't find a match for \"".concat(originalKey, "\""));
          return;
        }

        href = entry.href;
        title = entry.title;
      }

      if (path) {
        // See: https://github.com/w3c/respec/issues/1856#issuecomment-429579475
        const relPath = path.startsWith("/") ? ".".concat(path) : path;
        href = new URL(relPath, href).href;
      }

      if (frag) {
        href = new URL(frag, href).href;
      }

      switch (elem.localName) {
        case "a":
          {
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

        case "dfn":
          {
            const anchor = document.createElement("a");
            anchor.href = href;

            if (!elem.textContent) {
              anchor.textContent = title;
              elem.append(anchor);
            } else {
              (0, _utils.wrapInner)(elem, anchor);
            }

            if (!path && !frag) {
              const cite = document.createElement("cite");
              cite.append(anchor);
              elem.append(cite);
            }

            if ("export" in elem.dataset) {
              (0, _utils.showInlineError)(elem, "Exporting an linked external definition is not allowed. Please remove the `data-export` attribute", "Please remove the `data-export` attribute.");
              delete elem.dataset.export;
            }

            elem.dataset.noExport = "";
            break;
          }
      }
    };
  }

  function cleanElement(elem) {
    ["data-cite", "data-cite-frag"].filter(attrName => elem.hasAttribute(attrName)).forEach(attrName => elem.removeAttribute(attrName));
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
      const {
        dataset
      } = elem;
      const {
        cite: rawKey,
        citeFrag,
        citePath
      } = dataset; // The key is a fragment, resolve using the shortName as key

      if (rawKey.startsWith("#") && !citeFrag) {
        // Closes data-cite not starting with "#"

        /** @type {HTMLElement} */
        const closest = elem.parentElement.closest("[data-cite]:not([data-cite^=\"#\"])");
        const {
          key: parentKey,
          isNormative: closestIsNormative
        } = closest ? toCiteDetails(closest) : {
          key: conf.shortName || "",
          isNormative: false
        };
        dataset.cite = closestIsNormative ? parentKey : "?".concat(parentKey);
        dataset.citeFrag = rawKey.replace("#", ""); // the key is acting as fragment

        return toCiteDetails(elem);
      }

      const frag = citeFrag ? "#".concat(citeFrag) : findFrag(rawKey);
      const path = citePath || findPath(rawKey).split("#")[0]; // path is always before "#"

      const {
        type
      } = (0, _utils.refTypeFromContext)(rawKey, elem);
      const isNormative = type === "normative"; // key is before "/" and "#" but after "!" or "?" (e.g., ?key/path#frag)

      const hasPrecedingMark = /^[?|!]/.test(rawKey);
      const key = rawKey.split(/[/|#]/)[0].substring(Number(hasPrecedingMark));
      const details = {
        key,
        isNormative,
        frag,
        path
      };
      return details;
    };
  }

  async function run(conf) {
    const toCiteDetails = citeDetailsConverter(conf);
    /** @type {NodeListOf<HTMLElement>} */

    const cites = document.querySelectorAll("dfn[data-cite], a[data-cite]");
    Array.from(cites).filter(el => el.dataset.cite).map(toCiteDetails) // it's not the same spec
    .filter(({
      key
    }) => {
      return key.toLowerCase() !== (conf.shortName || "").toLowerCase();
    }).forEach(({
      isNormative,
      key
    }) => {
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
    const elems = [...doc.querySelectorAll("dfn[data-cite]:not([data-cite='']), a[data-cite]:not([data-cite=''])")];
    const citeConverter = citeDetailsConverter(conf);
    const promisesForMissingEntries = elems.map(citeConverter).map(async entry => {
      const result = await (0, _biblio.resolveRef)(entry.key);
      return {
        entry,
        result
      };
    });
    const bibEntries = await Promise.all(promisesForMissingEntries);
    const missingBibEntries = bibEntries.filter(({
      result
    }) => result === null).map(({
      entry: {
        key
      }
    }) => key); // we now go to network to fetch missing entries

    const newEntries = await (0, _biblio.updateFromNetwork)(missingBibEntries);
    if (newEntries) Object.assign(_biblio.biblio, newEntries);
    const lookupRequests = [...new Set(elems)].map(toLookupRequest);
    return await Promise.all(lookupRequests);
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=data-cite.js.map

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(9)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;

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
  const name = "core/webidl-index";
  _exports.name = name;

  function run() {
    const idlIndexSec = document.querySelector("section#idl-index");

    if (!idlIndexSec) {
      return;
    } // Query for decedents headings, e.g., "h2:first-child, etc.."


    const query = [2, 3, 4, 5, 6].map(level => "h".concat(level, ":first-child")).join(",");

    if (!idlIndexSec.querySelector(query)) {
      const header = document.createElement("h2");

      if (idlIndexSec.title) {
        header.textContent = idlIndexSec.title;
        idlIndexSec.removeAttribute("title");
      } else {
        header.textContent = "IDL Index";
      }

      idlIndexSec.prepend(header);
    } // filter out the IDL marked with class="exclude" and the IDL in non-normative sections


    const idlIndex = Array.from(document.querySelectorAll("pre.def.idl:not(.exclude)")).filter(idl => !idl.closest(_utils.nonNormativeSelector));

    if (idlIndex.length === 0) {
      const text = "This specification doesn't declare any Web IDL.";
      idlIndexSec.append(text);
      return;
    }

    const pre = document.createElement("pre");
    pre.classList.add("idl", "def");
    pre.id = "actual-idl-index";
    idlIndex.map(elem => {
      const fragment = document.createDocumentFragment();

      for (const child of elem.children) {
        fragment.appendChild(child.cloneNode(true));
      }

      return fragment;
    }).forEach(elem => {
      if (pre.lastChild) {
        pre.append("\n\n");
      }

      pre.appendChild(elem);
    }); // Remove duplicate IDs

    pre.querySelectorAll("*[id]").forEach(elem => elem.removeAttribute("id"));
    idlIndexSec.appendChild(pre);
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=webidl-index.js.map

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(9), __webpack_require__(129), __webpack_require__(10), __webpack_require__(56), __webpack_require__(126), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _utils, _xref, _l10n, _dfnMap, _dataCite, _pubsubhub) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  // @ts-check
  // Module core/link-to-dfn
  // Gives definitions in conf.definitionMap IDs and links <a> tags
  // to the matching definitions.
  const name = "core/link-to-dfn";
  _exports.name = name;
  const l10n = {
    en: {
      duplicate: "This is defined more than once in the document."
    }
  };
  const lang = _l10n.lang in l10n ? _l10n.lang : "en";

  class CaseInsensitiveMap extends Map {
    constructor(
    /** entries: Array<[String, HTMLElement]> */
    entries = []) {
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

  async function run(conf) {
    const titleToDfns = mapTitleToDfns();
    /** @type {HTMLElement[]} */

    const possibleExternalLinks = [];
    /** @type {HTMLAnchorElement[]} */

    const badLinks = [];
    const localLinkSelector = "a[data-cite=''], a:not([href]):not([data-cite]):not(.logo):not(.externalDFN)";
    document.querySelectorAll(localLinkSelector).forEach(
    /** @type {HTMLAnchorElement} */
    anchor => {
      const linkTargets = (0, _utils.getLinkTargets)(anchor);
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
        await (0, _xref.run)(conf, possibleExternalLinks);
      } catch (error) {
        console.error(error);
        showLinkingError(possibleExternalLinks);
      }
    } else {
      showLinkingError(possibleExternalLinks);
    }

    await (0, _dataCite.linkInlineCitations)(document, conf); // Added message for legacy compat with Aria specs
    // See https://github.com/w3c/respec/issues/793

    (0, _pubsubhub.pub)("end", "core/link-to-dfn");
  }

  function mapTitleToDfns() {
    const titleToDfns = new CaseInsensitiveMap();
    Object.keys(_dfnMap.definitionMap).forEach(title => {
      const {
        result,
        duplicates
      } = collectDfns(title);
      titleToDfns.set(title, result);

      if (duplicates.length > 0) {
        (0, _utils.showInlineError)(duplicates, "Duplicate definitions of '".concat(title, "'"), l10n[lang].duplicate);
      }
    });
    return titleToDfns;
  }
  /**
   * @param {string} title
   */


  function collectDfns(title) {
    const result = new Map();
    const duplicates = [];

    _dfnMap.definitionMap[title].forEach(dfn => {
      const {
        dfnFor = ""
      } = dfn.dataset;

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
      (0, _utils.addId)(dfn, "dfn", title);
    });

    return {
      result,
      duplicates
    };
  }
  /**
   * @param {import("./utils.js").LinkTarget} target
   * @param {HTMLAnchorElement} anchor
   * @param {CaseInsensitiveMap} titleToDfns
   * @param {HTMLElement[]} possibleExternalLinks
   */


  function findLinkTarget(target, anchor, titleToDfns, possibleExternalLinks) {
    const {
      linkFor
    } = anchor.dataset;

    if (!titleToDfns.has(target.title) || !titleToDfns.get(target.title).get(target.for)) {
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
        anchor.href = "#".concat(dfn.id);
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
    } // Note that childNodes.length === 1 excludes
    // definitions that have either other text, or other
    // whitespace, inside the <dfn>.


    if (dfn.childNodes.length !== 1) {
      return false;
    }

    const [first] =
    /** @type {NodeListOf<HTMLElement>} */
    dfn.childNodes;
    return first.localName === "code";
  }
  /**
   * Wrap links by <code>.
   * @param {HTMLAnchorElement} ant a link
   * @param {HTMLElement} dfn a definition
   */


  function wrapAsCode(ant, dfn) {
    // only add code to IDL when the definition matches
    const term = ant.textContent.trim();
    const isIDL = dfn.dataset.hasOwnProperty("idl");
    const needsCode = shouldWrapByCode(dfn, term);

    if (!isIDL || needsCode) {
      (0, _utils.wrapInner)(ant, document.createElement("code"));
    }
  }
  /**
   * @param {HTMLElement} dfn
   * @param {string} term
   */


  function shouldWrapByCode(dfn, term) {
    const {
      dataset
    } = dfn;

    if (dfn.textContent.trim() === term) {
      return true;
    } else if (dataset.title === term) {
      return true;
    } else if (dataset.lt) {
      return dataset.lt.split("|").includes(term.toLowerCase());
    }

    return false;
  }
  /**
   * Find additional references that need to be looked up externally.
   * Examples: a[data-cite="spec"], dfn[data-cite="spec"], dfn.externalDFN
   */


  function findExplicitExternalLinks() {
    /** @type {NodeListOf<HTMLElement>} */
    const links = document.querySelectorAll("a[data-cite]:not([data-cite='']):not([data-cite*='#']), " + "dfn[data-cite]:not([data-cite='']):not([data-cite*='#'])");
    /** @type {NodeListOf<HTMLElement>} */

    const externalDFNs = document.querySelectorAll("dfn.externalDFN");
    return [...links].filter(el => {
      // ignore empties
      if (el.textContent.trim() === "") return false;
      /** @type {HTMLElement} */

      const closest = el.closest("[data-cite]");
      return !closest || closest.dataset.cite !== "";
    }).concat(...externalDFNs);
  }

  function showLinkingError(elems) {
    elems.forEach(elem => {
      (0, _utils.showInlineWarning)(elem, "Found linkless `<a>` element with text \"".concat(elem.textContent, "\" but no matching `<dfn>`"), "Linking error: not matching <dfn>");
    });
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=link-to-dfn.js.map

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(130), __webpack_require__(9), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _xrefDb, _utils, _pubsubhub) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.API_URL = void 0;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  const profiles = {
    "web-platform": ["HTML", "INFRA", "URL", "WEBIDL", "DOM", "FETCH"]
  };
  const API_URL = "https://respec.org/xref/";
  _exports.API_URL = API_URL;

  if (!document.querySelector("link[rel='preconnect'][href='https://respec.org']")) {
    const link = (0, _utils.createResourceHint)({
      hint: "preconnect",
      href: "https://respec.org"
    });
    document.head.appendChild(link);
  }
  /**
   * main external reference driver
   * @param {Object} conf respecConfig
   * @param {HTMLElement[]} elems possibleExternalLinks
   */


  async function run(conf, elems) {
    const xref = normalizeConfig(conf.xref);

    if (xref.specs) {
      const bodyCite = document.body.dataset.cite ? document.body.dataset.cite.split(/\s+/) : [];
      document.body.dataset.cite = bodyCite.concat(xref.specs).join(" ");
    }

    if (!elems.length) return;
    /** @type {RequestEntry[]} */

    const queryKeys = [];

    for (const elem of elems) {
      const entry = getRequestEntry(elem);
      const id = await objectHash(entry);
      queryKeys.push(_objectSpread({}, entry, {
        id
      }));
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
      specs: null
    };
    const config = Object.assign({}, defaults);
    const type = Array.isArray(xref) ? "array" : typeof xref;

    switch (type) {
      case "boolean":
        // using defaults already, as above
        break;

      case "string":
        if (xref.toLowerCase() in profiles) {
          Object.assign(config, {
            specs: profiles[xref.toLowerCase()]
          });
        } else {
          invalidProfileError(xref);
        }

        break;

      case "array":
        Object.assign(config, {
          specs: xref
        });
        break;

      case "object":
        Object.assign(config, xref);

        if (xref.profile) {
          const profile = xref.profile.toLowerCase();

          if (profile in profiles) {
            const specs = (xref.specs || []).concat(profiles[profile]);
            Object.assign(config, {
              specs
            });
          } else {
            invalidProfileError(xref.profile);
          }
        }

        break;

      default:
        (0, _pubsubhub.pub)("error", "Invalid value for `xref` configuration option. Received: \"".concat(xref, "\"."));
    }

    return config;

    function invalidProfileError(profile) {
      const supportedProfiles = Object.keys(profiles).map(p => "\"".concat(p, "\"")).join(", ");
      const msg = "Invalid profile \"".concat(profile, "\" in `respecConfig.xref`. ") + "Please use one of the supported profiles: ".concat(supportedProfiles, ".");
      (0, _pubsubhub.pub)("error", msg);
    }
  }
  /**
   * get xref API request entry (term and context) for given xref element
   * @param {HTMLElement} elem
   */


  function getRequestEntry(elem) {
    const isIDL = "xrefType" in elem.dataset;
    let term = elem.dataset.lt ? elem.dataset.lt.split("|", 1)[0] : elem.textContent;
    term = (0, _utils.norm)(term);
    if (term === "the-empty-string") term = "";
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
    } // if element itself contains data-cite, we don't take inline context into account


    if (elem.closest("[data-cite]") !== elem) {
      const closestSection = elem.closest("section");
      /** @type {Iterable<HTMLElement>} */

      const bibrefs = closestSection ? closestSection.querySelectorAll("a.bibref") : [];
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

    let {
      xrefFor: forContext
    } = elem.dataset;

    if (!forContext && isIDL) {
      /** @type {HTMLElement} */
      const dataXrefForElem = elem.closest("[data-xref-for]");

      if (dataXrefForElem) {
        forContext = (0, _utils.norm)(dataXrefForElem.dataset.xrefFor);
      }
    } else if (forContext && typeof forContext === "string") {
      forContext = (0, _utils.norm)(forContext);
    }

    return _objectSpread({
      term,
      types
    }, specs.length && {
      specs
    }, {}, typeof forContext === "string" && {
      for: forContext
    });
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
    const resultsFromCache = await (0, _xrefDb.resolveXrefCache)(uniqueQueryKeys);
    const termsToLook = uniqueQueryKeys.filter(key => !resultsFromCache.get(key.id));
    const fetchedResults = await fetchFromNetwork(termsToLook, apiUrl);

    if (fetchedResults.size) {
      // add data to cache
      await (0, _xrefDb.cacheXrefData)(fetchedResults);
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
    const query = {
      keys
    };
    const options = {
      method: "POST",
      body: JSON.stringify(query),
      headers: {
        "Content-Type": "application/json"
      }
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
    const closestInform = elem.closest(_utils.nonNormativeSelector);

    if (!closestInform || elem === closestNormative) {
      return true;
    }

    return closestNormative && closestInform && closestInform.contains(closestNormative);
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
    const errors = {
      ambiguous: new Map(),
      notFound: new Map()
    };

    for (let i = 0, l = elems.length; i < l; i++) {
      if (elems[i].closest("[data-no-xref]")) continue;
      const elem = elems[i];
      const query = queryKeys[i];
      const {
        id
      } = query;
      const results = data.get(id);

      if (results.length === 1) {
        addDataCite(elem, query, results[0], conf);
      } else {
        const collector = errors[results.length === 0 ? "notFound" : "ambiguous"];

        if (!collector.has(id)) {
          collector.set(id, {
            elems: [],
            results,
            query
          });
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
    const {
      term
    } = query;
    const {
      uri,
      shortname: cite,
      normative,
      type
    } = result;
    const path = uri.includes("/") ? uri.split("/", 1)[1] : uri;
    const [citePath, citeFrag] = path.split("#");
    const dataset = {
      cite,
      citePath,
      citeFrag,
      type
    };
    Object.assign(elem.dataset, dataset); // update indirect links (data-lt, data-plurals)

    /** @type {NodeListOf<HTMLElement>} */

    const indirectLinks = document.querySelectorAll("[data-dfn-type=\"xref\"][data-xref=\"".concat(term.toLowerCase(), "\"]"));
    indirectLinks.forEach(el => {
      el.removeAttribute("data-xref");
      Object.assign(el.dataset, dataset);
    });
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
      const existingKey = conf.informativeReferences.has(cite) ? conf.informativeReferences.getCanonicalKey(cite) : cite;
      conf.normativeReferences.add(existingKey);
      conf.informativeReferences.delete(existingKey);
      return;
    }

    const msg = "Adding an informative reference to \"".concat(term, "\" from \"").concat(cite, "\" ") + "in a normative section";
    const title = "Error: Informative reference in normative section";
    (0, _utils.showInlineWarning)(elem, msg, title);
  }
  /** @param {Errors} errors */


  function showErrors({
    ambiguous,
    notFound
  }) {
    const getPrefilledFormURL = (query, specs = []) => {
      const url = new URL(API_URL);
      url.searchParams.set("term", query.term);
      if (query.for) url.searchParams.set("for", query.for);
      url.searchParams.set("types", query.types.join(","));
      if (specs.length) url.searchParams.set("cite", specs.join(","));
      return url;
    };

    for (const _ref of notFound.values()) {
      const {
        query,
        elems
      } = _ref;
      const specs = [...new Set((0, _utils.flatten)([], query.specs))].sort();
      const formUrl = getPrefilledFormURL(query, specs);
      const specsString = specs.map(spec => "`".concat(spec, "`")).join(", ");
      const msg = "Couldn't match \"**".concat(query.term, "**\" to anything in the document or in any other document cited in this specification: ").concat(specsString, ". ") + "See [how to cite to resolve the error](".concat(formUrl, ")");
      (0, _utils.showInlineError)(elems, msg, "Error: No matching dfn found.");
    }

    for (const _ref2 of ambiguous.values()) {
      const {
        query,
        elems,
        results
      } = _ref2;
      const specs = [...new Set(results.map(entry => entry.shortname))].sort();
      const formUrl = getPrefilledFormURL(query, specs);
      const specsString = specs.map(s => "**".concat(s, "**")).join(", ");
      const msg = "The term \"**".concat(query.term, "**\" is defined in ").concat(specsString, " in multiple ways, so it's ambiguous. ") + "See [how to cite to resolve the error](".concat(formUrl, ")");
      (0, _utils.showInlineError)(elems, msg, "Error: Linking an ambiguous dfn.");
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
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=xref.js.map

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(129), __webpack_require__(9), __webpack_require__(79)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _xref, _utils, _idb) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.resolveXrefCache = resolveXrefCache;
  _exports.cacheXrefData = cacheXrefData;
  _exports.clearXrefData = clearXrefData;
  // @ts-check

  /**
   * @typedef {import('core/xref').RequestEntry} RequestEntry
   * @typedef {import('core/xref').Response} Response
   * @typedef {import('core/xref').SearchResultEntry} SearchResultEntry
   */
  const VERSION_CHECK_WAIT = 5 * 60 * 60 * 1000; // 5 min

  async function getIdbCache() {
    const {
      openDB
    } = await (0, _idb.importIdb)();
    const idb = await openDB("xref", 1, {
      upgrade(db) {
        db.createObjectStore("xrefs");
      }

    });
    return new _utils.IDBKeyVal(idb, "xrefs");
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
    return new Map(cachedData);
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

    const url = new URL("meta/version", _xref.API_URL).href;
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
      const cache = await getIdbCache(); // add data to cache

      await cache.addMany(data);
    } catch (e) {
      console.error(e);
    }
  }

  async function clearXrefData() {
    try {
      const cache = await getIdbCache();
      await cache.clear();
    } catch (e) {
      console.error(e);
    }
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=xref-db.js.map

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(88), __webpack_require__(9), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _githubApi, _utils, _pubsubhub) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  // Module core/contrib
  // Fetches names of contributors from github and uses them to fill
  // in the content of elements with key identifiers:
  // #gh-commenters: people having contributed comments to issues.
  // #gh-contributors: people whose PR have been merged.
  // Spec editors get filtered out automatically.
  const name = "core/contrib";
  _exports.name = name;

  function prop(prop) {
    return o => o[prop];
  }

  const nameProp = prop("name");

  function findUserURLs(...thingsWithUsers) {
    const usersURLs = thingsWithUsers.reduce(_utils.flatten, []).filter(thing => thing && thing.user).map(({
      user
    }) => new URL(user.url, window.parent.location.origin).href);
    return [...new Set(usersURLs)];
  }

  async function toHTML(urls, editors, element, headers) {
    const args = await Promise.all(urls.map(url => fetch(url, {
      headers
    }).then(r => {
      if ((0, _githubApi.checkLimitReached)(r)) return null;
      return r.json();
    })).filter(arg => arg));
    const names = args.map(user => user.name || user.login).filter(name => !editors.includes(name)).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    element.textContent = (0, _utils.joinAnd)(names);
  }

  async function run(conf) {
    const ghCommenters = document.getElementById("gh-commenters");
    const ghContributors = document.getElementById("gh-contributors");

    if (!ghCommenters && !ghContributors) {
      return;
    }

    const {
      githubAPI
    } = conf;

    if (!githubAPI) {
      const msg = "Requested list of contributors and/or commenters from GitHub, but " + "[`githubAPI`](https://github.com/w3c/respec/wiki/githubAPI) is not set.";
      (0, _pubsubhub.pub)("error", msg);
      return;
    }

    const headers = (0, _githubApi.githubRequestHeaders)(conf);
    const response = await fetch(githubAPI, {
      headers
    });
    (0, _githubApi.checkLimitReached)(response);

    if (!response.ok) {
      const msg = "Error fetching repository information from GitHub. " + "(HTTP Status ".concat(response.status, ").");
      (0, _pubsubhub.pub)("error", msg);
      return;
    }

    const indexes = await response.json();
    const {
      issues_url,
      issue_comment_url,
      comments_url,
      contributors_url
    } = indexes;
    const [issues, issueComments, otherComments, contributors] = await Promise.all([issues_url, issue_comment_url, comments_url, contributors_url].map(url => {
      const cleansedUrl = url.replace(/\{[^}]+\}/, "");
      return (0, _githubApi.fetchAll)(new URL(cleansedUrl, window.parent.location.origin).href, headers);
    }));
    const editors = conf.editors.map(nameProp);

    try {
      const toHTMLPromises = [{
        elt: ghCommenters,
        getUrls: () => findUserURLs(issues, issueComments, otherComments)
      }, {
        elt: ghContributors,
        getUrls: () => contributors.map(c => new URL(c.url, window.parent.location.origin).href)
      }].filter(c => c.elt).map(c => toHTML(c.getUrls(), editors, c.elt, headers));
      await Promise.all(toHTMLPromises);
    } catch (error) {
      (0, _pubsubhub.pub)("error", "Error loading contributors and/or commenters from GitHub.");
      console.error(error);
    }
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=contrib.js.map

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(9)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  // Module core/fix-headers
  // Make sure that all h1-h6 headers (that are first direct children of sections) are actually
  // numbered at the right depth level. This makes it possible to just use any of them (conventionally
  // h2) with the knowledge that the proper depth level will be used
  const name = "core/fix-headers";
  _exports.name = name;

  function run() {
    [...document.querySelectorAll("section:not(.introductory)")].map(sec => sec.querySelector("h1, h2, h3, h4, h5, h6")).filter(h => h).forEach(heading => {
      const depth = Math.min(getParents(heading, "section").length + 1, 6);
      (0, _utils.renameElement)(heading, "h".concat(depth));
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
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=fix-headers.js.map

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(9), __webpack_require__(10), __webpack_require__(13)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _utils, _l10n, _hyperhtml) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  _hyperhtml = _interopRequireDefault(_hyperhtml);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _templateObject7() {
    const data = _taggedTemplateLiteral(["<p role='navigation' id='back-to-top'><a href='#title'><abbr title='Back to Top'>&uarr;</abbr></a></p>"]);

    _templateObject7 = function _templateObject7() {
      return data;
    };

    return data;
  }

  function _templateObject6() {
    const data = _taggedTemplateLiteral(["<h2 class=\"introductory\">", "</h2>"]);

    _templateObject6 = function _templateObject6() {
      return data;
    };

    return data;
  }

  function _templateObject5() {
    const data = _taggedTemplateLiteral(["<nav id=\"toc\">"]);

    _templateObject5 = function _templateObject5() {
      return data;
    };

    return data;
  }

  function _templateObject4() {
    const data = _taggedTemplateLiteral(["<li class='tocline'>", "</li>"]);

    _templateObject4 = function _templateObject4() {
      return data;
    };

    return data;
  }

  function _templateObject3() {
    const data = _taggedTemplateLiteral(["<a href=\"", "\" class=\"tocxref\"/>"]);

    _templateObject3 = function _templateObject3() {
      return data;
    };

    return data;
  }

  function _templateObject2() {
    const data = _taggedTemplateLiteral(["<bdi class='secno'>", " </bdi>"]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    const data = _taggedTemplateLiteral(["<ol class='toc'>"]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  const lowerHeaderTags = ["h2", "h3", "h4", "h5", "h6"];
  const headerTags = ["h1", ...lowerHeaderTags];
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const name = "core/structure";
  _exports.name = name;
  const localizationStrings = {
    en: {
      toc: "Table of Contents"
    },
    nl: {
      toc: "Inhoudsopgave"
    },
    es: {
      toc: "Tabla de Contenidos"
    }
  };
  const lang = _l10n.lang in localizationStrings ? _l10n.lang : "en";
  const l10n = localizationStrings[lang];
  /**
   * @typedef {object} SectionInfo
   * @property {string} secno
   * @property {string} title
   *
   * Scans sections and generate ordered list element + ID-to-anchor-content dictionary.
   * @param {Section[]} sections the target element to find child sections
   * @param {number} maxTocLevel
   */

  function scanSections(sections, maxTocLevel, {
    prefix = ""
  } = {}) {
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


    const ol = (0, _hyperhtml.default)(_templateObject());

    for (const section of sections) {
      if (section.isAppendix && !prefix && !appendixMode) {
        lastNonAppendix = index;
        appendixMode = true;
      }

      let secno = section.isIntro ? "" : appendixMode ? alphabet.charAt(index - lastNonAppendix) : prefix + index;
      const level = Math.ceil(secno.length / 2);

      if (level === 1) {
        secno += "."; // if this is a top level item, insert
        // an OddPage comment so html2ps will correctly
        // paginate the output

        section.header.before(document.createComment("OddPage"));
      }

      if (!section.isIntro) {
        index += 1;
        section.header.prepend((0, _hyperhtml.default)(_templateObject2(), secno));
      }

      if (level <= maxTocLevel) {
        const item = createTocListItem(section.header, section.element.id);
        const sub = scanSections(section.subsections, maxTocLevel, {
          prefix: secno
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


  function getSectionTree(parent, {
    tocIntroductory = false
  } = {}) {
    const sectionElements = (0, _utils.children)(parent, tocIntroductory ? "section" : "section:not(.introductory)");
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
      (0, _utils.addId)(section, null, title);
      sections.push({
        element: section,
        header,
        title,
        isIntro: section.classList.contains("introductory"),
        isAppendix: section.classList.contains("appendix"),
        subsections: getSectionTree(section, {
          tocIntroductory
        })
      });
    }

    return sections;
  }
  /**
   * @param {Element} header
   * @param {string} id
   */


  function createTocListItem(header, id) {
    const anchor = (0, _hyperhtml.default)(_templateObject3(), "#".concat(id));
    anchor.append(...header.cloneNode(true).childNodes);
    filterHeader(anchor);
    return (0, _hyperhtml.default)(_templateObject4(), anchor);
  }
  /**
   * Replaces any child <a> and <dfn> with <span>.
   * @param {HTMLElement} h
   */


  function filterHeader(h) {
    h.querySelectorAll("a").forEach(anchor => {
      const span = (0, _utils.renameElement)(anchor, "span");
      span.className = "formerLink";
      span.removeAttribute("href");
    });
    h.querySelectorAll("dfn").forEach(dfn => {
      const span = (0, _utils.renameElement)(dfn, "span");
      span.removeAttribute("id");
    });
  }

  function run(conf) {
    if ("tocIntroductory" in conf === false) {
      conf.tocIntroductory = false;
    }

    if ("maxTocLevel" in conf === false) {
      conf.maxTocLevel = Infinity;
    }

    renameSectionHeaders(); // makeTOC

    if (!conf.noTOC) {
      const sectionTree = getSectionTree(document.body, {
        tocIntroductory: conf.tocIntroductory
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
      const depth = Math.min((0, _utils.parents)(header, "section").length + 1, 6);
      const h = "h".concat(depth);

      if (header.localName !== h) {
        (0, _utils.renameElement)(header, h);
      }
    });
  }

  function getNonintroductorySectionHeaders() {
    const headerSelector = headerTags.map(h => "section:not(.introductory) ".concat(h, ":first-child")).join(",");
    return [...document.querySelectorAll(headerSelector)].filter(elem => !elem.closest("section.introductory"));
  }
  /**
   * @param {HTMLElement} ol
   */


  function createTableOfContents(ol) {
    if (!ol) {
      return;
    }

    const nav = (0, _hyperhtml.default)(_templateObject5());
    const h2 = (0, _hyperhtml.default)(_templateObject6(), l10n.toc);
    (0, _utils.addId)(h2);
    nav.append(h2, ol);
    const ref = document.getElementById("toc") || document.getElementById("sotd") || document.getElementById("abstract");

    if (ref) {
      if (ref.id === "toc") {
        ref.replaceWith(nav);
      } else {
        ref.after(nav);
      }
    }

    const link = (0, _hyperhtml.default)(_templateObject7());
    document.body.append(link);
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=structure.js.map

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(10), __webpack_require__(13)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _l10n, _hyperhtml) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  _hyperhtml = _interopRequireDefault(_hyperhtml);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _templateObject() {
    const data = _taggedTemplateLiteral(["<p><em>", "</em></p>"]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  const name = "core/informative";
  _exports.name = name;
  const localizationStrings = {
    en: {
      informative: "This section is non-normative."
    },
    nl: {
      informative: "Dit onderdeel is niet normatief."
    }
  };
  const lang = _l10n.lang in localizationStrings ? _l10n.lang : "en";
  const l10n = localizationStrings[lang];

  function run() {
    Array.from(document.querySelectorAll("section.informative")).map(informative => informative.querySelector("h2, h3, h4, h5, h6")).filter(heading => heading).forEach(heading => {
      heading.after((0, _hyperhtml.default)(_templateObject(), l10n.informative));
    });
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=informative.js.map

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(9), __webpack_require__(13)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _utils, _hyperhtml) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  _hyperhtml = _interopRequireDefault(_hyperhtml);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _templateObject() {
    const data = _taggedTemplateLiteral(["\n      <a href=\"", "\" class=\"self-link\" aria-label=\"\xA7\"></a>\n    "]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  // Module core/id-headers
  // All headings are expected to have an ID, unless their immediate container has one.
  // This is currently in core though it comes from a W3C rule. It may move in the future.
  const name = "core/id-headers";
  _exports.name = name;

  function run(conf) {
    const headings = document.querySelectorAll("section:not(.head):not(.introductory) h2, h3, h4, h5, h6");

    for (const h of headings) {
      (0, _utils.addId)(h);
      if (!conf.addSectionLinks) continue;
      const id = h.parentElement.id || h.id;
      h.appendChild((0, _hyperhtml.default)(_templateObject(), "#".concat(id)));
    }
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=id-headers.js.map

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(3), __webpack_require__(137), __webpack_require__(9), __webpack_require__(13)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _pubsubhub, _caniuse, _utils, _hyperhtml) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  _caniuse = _interopRequireDefault(_caniuse);
  _hyperhtml = _interopRequireDefault(_hyperhtml);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _templateObject7() {
    const data = _taggedTemplateLiteral(["\n    <div class=\"caniuse-browser\">\n      ", "\n      <ul>\n        ", "\n      </ul>\n    </div>"]);

    _templateObject7 = function _templateObject7() {
      return data;
    };

    return data;
  }

  function _templateObject6() {
    const data = _taggedTemplateLiteral(["\n      <button class=\"", "\" title=\"", "\">", "</button>"]);

    _templateObject6 = function _templateObject6() {
      return data;
    };

    return data;
  }

  function _templateObject5() {
    const data = _taggedTemplateLiteral(["\n    ", "\n    <a href=\"", "\"\n      title=\"Get details at caniuse.com\">More info\n    </a>"]);

    _templateObject5 = function _templateObject5() {
      return data;
    };

    return data;
  }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _templateObject4() {
    const data = _taggedTemplateLiteral(["\n      <a href=\"", "\">caniuse.com</a>"]);

    _templateObject4 = function _templateObject4() {
      return data;
    };

    return data;
  }

  function _templateObject3() {
    const data = _taggedTemplateLiteral(["\n    <dt class=\"caniuse-title\">Browser support:</dt>\n    <dd class=\"caniuse-stats\">", "</dd>"]);

    _templateObject3 = function _templateObject3() {
      return data;
    };

    return data;
  }

  function _templateObject2() {
    const data = _taggedTemplateLiteral(["<a href=\"", "\">caniuse.com</a>"]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    const data = _taggedTemplateLiteral(["\n    <style class=\"removeOnSave\">", "</style>"]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  const name = "core/caniuse";
  _exports.name = name;
  const API_URL = "https://respec.org/caniuse/"; // browser name dictionary

  const BROWSERS = new Map([["and_chr", "Chrome (Android)"], ["and_ff", "Firefox (Android)"], ["and_uc", "UC Browser (Android)"], ["android", "Android"], ["bb", "Blackberry"], ["chrome", "Chrome"], ["edge", "Edge"], ["firefox", "Firefox"], ["ie", "IE"], ["ios_saf", "Safari (iOS)"], ["op_mini", "Opera Mini"], ["op_mob", "Opera Mobile"], ["opera", "Opera"], ["safari", "Safari"], ["samsung", "Samsung Internet"]]); // Keys from https://github.com/Fyrd/caniuse/blob/master/CONTRIBUTING.md

  const supportTitles = new Map([["y", "Supported."], ["a", "Almost supported (aka Partial support)."], ["n", "No support, or disabled by default."], ["p", "No support, but has Polyfill."], ["u", "Support unknown."], ["x", "Requires prefix to work."], ["d", "Disabled by default (needs to enabled)."]]);

  if (!document.querySelector("link[rel='preconnect'][href='https://respec.org']")) {
    const link = (0, _utils.createResourceHint)({
      hint: "preconnect",
      href: "https://respec.org"
    });
    document.head.appendChild(link);
  }

  async function run(conf) {
    if (!conf.caniuse) {
      return; // nothing to do.
    }

    const options = getNormalizedConf(conf);
    conf.caniuse = options; // for tests

    if (!options.feature) {
      return; // no feature to show
    }

    const featureURL = new URL(options.feature, "https://caniuse.com/").href;
    document.head.appendChild((0, _hyperhtml.default)(_templateObject(), _caniuse.default));
    const headDlElem = document.querySelector(".head dl");

    const contentPromise = (async () => {
      try {
        const apiUrl = options.apiURL || API_URL;
        const stats = await fetchStats(apiUrl, options);
        return createTableHTML(featureURL, stats);
      } catch (err) {
        console.error(err);
        const msg = "Couldn't find feature \"".concat(options.feature, "\" on caniuse.com? ") + "Please check the feature key on [caniuse.com](https://caniuse.com)";
        (0, _pubsubhub.pub)("error", msg);
        return (0, _hyperhtml.default)(_templateObject2(), featureURL);
      }
    })();

    const definitionPair = (0, _hyperhtml.default)(_templateObject3(), {
      any: contentPromise,
      placeholder: "Fetching data from caniuse.com..."
    });
    headDlElem.append(...definitionPair.childNodes);
    await contentPromise; // remove from export

    (0, _pubsubhub.pub)("amend-user-config", {
      caniuse: options.feature
    });
    (0, _pubsubhub.sub)("beforesave", outputDoc => {
      _hyperhtml.default.bind(outputDoc.querySelector(".caniuse-stats"))(_templateObject4(), featureURL);
    });
  }
  /**
   * returns normalized `conf.caniuse` configuration
   * @param {Object} conf   configuration settings
   */


  function getNormalizedConf(conf) {
    const DEFAULTS = {
      versions: 4
    };

    if (typeof conf.caniuse === "string") {
      return _objectSpread({
        feature: conf.caniuse
      }, DEFAULTS);
    }

    const caniuseConf = _objectSpread({}, DEFAULTS, {}, conf.caniuse);

    const {
      browsers
    } = caniuseConf;

    if (Array.isArray(browsers)) {
      const invalidBrowsers = browsers.filter(browser => !BROWSERS.has(browser));

      if (invalidBrowsers.length) {
        const names = invalidBrowsers.map(b => "\"`".concat(b, "`\"")).join(", ");
        (0, _pubsubhub.pub)("warn", "Ignoring invalid browser(s): ".concat(names, " in ") + "[`respecConfig.caniuse.browsers`](https://github.com/w3c/respec/wiki/caniuse)");
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
    const {
      feature,
      versions,
      browsers
    } = options;
    const searchParams = new URLSearchParams();
    searchParams.set("feature", feature);
    searchParams.set("versions", versions);

    if (Array.isArray(browsers)) {
      searchParams.set("browsers", browsers.join(","));
    }

    const url = "".concat(apiURL, "?").concat(searchParams.toString());
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
    return (0, _hyperhtml.default)(_templateObject5(), Object.entries(stats).map(addBrowser), featureURL);
  }
  /**
   * Add a browser and it's support to table.
   * @param {[ string, ApiResponse["browserName"] ]} args
   */


  function addBrowser([browserName, browserData]) {
    /** @param {string[]} supportKeys */
    const getSupport = supportKeys => {
      const titles = supportKeys.filter(key => supportTitles.has(key)).map(key => supportTitles.get(key));
      return {
        className: "caniuse-cell ".concat(supportKeys.join(" ")),
        title: titles.join(" ")
      };
    };
    /** @param {[string, string[]]} args */


    const addLatestVersion = ([version, supportKeys]) => {
      const {
        className,
        title
      } = getSupport(supportKeys);
      const buttonText = "".concat(BROWSERS.get(browserName) || browserName, " ").concat(version);
      return (0, _hyperhtml.default)(_templateObject6(), className, title, buttonText);
    };
    /** @param {[string, string[]]} args */


    const addBrowserVersion = ([version, supportKeys]) => {
      const {
        className,
        title
      } = getSupport(supportKeys);
      return "<li class=\"".concat(className, "\" title=\"").concat(title, "\">").concat(version, "</li>");
    };

    const [latestVersion, ...olderVersions] = browserData;
    return (0, _hyperhtml.default)(_templateObject7(), addLatestVersion(latestVersion), olderVersions.map(addBrowserVersion));
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=caniuse.js.map

/***/ }),
/* 137 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("/* container for stats */\n.caniuse-stats {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: flex-start;\n  align-items: baseline;\n  cursor: pointer;\n}\n\nbutton.caniuse-cell {\n  margin: 1px 1px 0 0;\n  border: none;\n}\n\n.caniuse-browser {\n  position: relative;\n}\n\n/* handle case when printing */\n@media print {\n  .caniuse-cell.y::before {\n    content: \"✔️\";\n    padding: 0.5em;\n  }\n\n  .caniuse-cell.n::before{\n    content: \"❌\";\n    padding: 0.5em;\n  }\n\n  .caniuse-cell.d::before,\n  .caniuse-cell.a::before,\n  .caniuse-cell.x::before,\n  .caniuse-cell.p::before {\n    content: \"⚠️\";\n    padding: 0.5em;\n  }\n}\n\n/* reset styles, hide old versions by default */\n.caniuse-browser ul {\n  display: none;\n  margin: 0;\n  padding: 0;\n  list-style: none;\n  position: absolute;\n  left: 0;\n  z-index: 2;\n  background: #fff;\n  margin-top: 1px;\n}\n\n.caniuse-stats a {\n  white-space: nowrap;\n  align-self: center;\n  margin-left: .5em;\n}\n\n/* a browser version */\n.caniuse-cell {\n  display: flex;\n  color: rgba(0, 0, 0, 0.8);\n  font-size: 90%;\n  height: 0.8cm;\n  margin-right: 1px;\n  margin-top: 0;\n  min-width: 3cm;\n  overflow: visible;\n  justify-content: center;\n  align-items: center;\n}\n\nli.caniuse-cell {\n  margin-bottom: 1px;\n}\n\n.caniuse-cell:focus {\n  outline: none;\n}\n\n.caniuse-cell:hover {\n  color: rgba(0, 0, 0, 1);\n}\n\n/* supports */\n.caniuse-cell.y {\n  background: #8bc34a;\n}\n\n/* no support */\n.caniuse-cell.n {\n  background: #e53935;\n}\n\n/* not supported by default / partial support etc\nsee https://github.com/Fyrd/caniuse/blob/master/CONTRIBUTING.md for stats */\n.caniuse-cell.d,\n.caniuse-cell.a,\n.caniuse-cell.x,\n.caniuse-cell.p {\n  background: #ffc107;\n}\n\n/* show rest of the browser versions */\n.caniuse-stats button:focus + ul,\n.caniuse-stats .caniuse-browser:hover > ul {\n  display: block;\n}\n");

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(9), __webpack_require__(13), __webpack_require__(139)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _utils, _hyperhtml, _mdnAnnotation) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  _hyperhtml = _interopRequireDefault(_hyperhtml);
  _mdnAnnotation = _interopRequireDefault(_mdnAnnotation);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _templateObject5() {
    const data = _taggedTemplateLiteral(["<script>\n     function toggleMDNStatus(div) {\n       div.parentNode.classList.toggle('wrapped');\n     }\n  </script>"]);

    _templateObject5 = function _templateObject5() {
      return data;
    };

    return data;
  }

  function _templateObject4() {
    const data = _taggedTemplateLiteral(["<style>", "</style>"]);

    _templateObject4 = function _templateObject4() {
      return data;
    };

    return data;
  }

  function _templateObject3() {
    const data = _taggedTemplateLiteral(["<p class=\"mdnsupport\">\n    ", "\n  </p>"]);

    _templateObject3 = function _templateObject3() {
      return data;
    };

    return data;
  }

  function _templateObject2() {
    const data = _taggedTemplateLiteral(["\n      <a title=\"", "\" href=\"", "\">", "</a>\n  "]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    const data = _taggedTemplateLiteral(["<aside class=\"mdn before wrapped\"></aside>"]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  const name = "core/mdn-annoatation";
  _exports.name = name;
  const SPEC_MAP_URL = "https://raw.githubusercontent.com/w3c/mdn-spec-links/master/SPECMAP.json";
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
    webview_android: "WebView Android"
  };

  function fetchAndCacheJson(url, maxAge) {
    if (!url) return {};
    return (0, _utils.fetchAndCache)(url, maxAge).then(r => r.json());
  }

  function insertMDNBox(node) {
    const targetAncestor = node.closest("section");
    const {
      previousElementSibling: targetSibling,
      parentNode
    } = targetAncestor;

    if (targetSibling && targetSibling.classList.contains("mdn")) {
      // If the target ancestor already has a mdnBox inserted, we just use it
      return targetSibling;
    }

    const mdnBox = (0, _hyperhtml.default)(_templateObject());
    parentNode.insertBefore(mdnBox, targetAncestor);
    return mdnBox;
  }

  function attachMDNDetail(container, mdnSpec) {
    const {
      slug,
      summary
    } = mdnSpec;
    container.innerHTML += "<button onclick=\"toggleMDNStatus(this.parentNode)\" aria-label=\"Expand MDN details\"><b>MDN</b></button>";
    const mdnSubPath = slug.slice(slug.indexOf("/") + 1);
    const mdnDetail = document.createElement("div");
    const href = "".concat(MDN_URL_BASE).concat(slug);
    (0, _hyperhtml.default)(mdnDetail)(_templateObject2(), summary, href, mdnSubPath);
    attachMDNBrowserSupport(mdnDetail, mdnSpec);
    container.appendChild(mdnDetail);
  }

  function attachMDNBrowserSupport(container, mdnSpec) {
    if (!mdnSpec.support) {
      container.innerHTML += "<p class=\"nosupportdata\">No support data.</p>";
      return;
    }

    const supportTable = (0, _hyperhtml.default)(_templateObject3(), [buildBrowserSupportTable(mdnSpec.support)]);
    container.appendChild(supportTable);
  }

  function buildBrowserSupportTable(support) {
    let innerHTML = "";

    function addMDNBrowserRow(browserId, yesNoUnknown, version) {
      const displayStatus = yesNoUnknown === "Unknown" ? "?" : yesNoUnknown;
      const classList = "".concat(browserId, " ").concat(yesNoUnknown.toLowerCase());
      const browserRow = "\n      <span class=\"".concat(classList, "\">\n        <span class=\"browser-name\">").concat(MDN_BROWSERS[browserId], "</span>\n        <span class=\"version\">").concat(version ? version : displayStatus, "</span>\n      </span>");
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
        addMDNBrowserRow(browserId, "Yes", "".concat(versionAdded, "+"));
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

  async function run(conf) {
    const {
      shortName,
      mdn
    } = conf;

    if (!shortName || !mdn) {
      // Nothing to do if shortName is not provided
      return;
    }

    const maxAge = mdn.maxAge || 60 * 60 * 24 * 1000;
    const specMapUrl = mdn.specMapUrl || SPEC_MAP_URL;
    const baseJsonPath = mdn.baseJsonPath || BASE_JSON_PATH;
    const specMap = await fetchAndCacheJson(specMapUrl, maxAge);
    const hasSpecJson = Object.values(specMap).some(jsonName => jsonName === "".concat(shortName, ".json"));

    if (!hasSpecJson) {
      return;
    }

    const mdnSpecJson = await fetchAndCacheJson("".concat(baseJsonPath, "/").concat(shortName, ".json"), maxAge);
    document.head.appendChild((0, _hyperhtml.default)(_templateObject4(), [_mdnAnnotation.default]));
    document.head.appendChild((0, _hyperhtml.default)(_templateObject5()));
    const nodesWithId = document.querySelectorAll("[id]");
    [...nodesWithId].filter(node => {
      const unlikelyTagNames = ["STYLE", "SCRIPT", "BODY"];
      return unlikelyTagNames.indexOf(node.tagName) === -1 && mdnSpecJson[node.id] && Array.isArray(mdnSpecJson[node.id]);
    }).forEach(node => {
      const mdnSpecArray = mdnSpecJson[node.id];
      const mdnBox = insertMDNBox(node);
      mdnSpecArray.map(spec => {
        const mdnDiv = document.createElement("div");
        attachMDNDetail(mdnDiv, spec);
        return mdnDiv;
      }).forEach(mdnDiv => mdnBox.appendChild(mdnDiv));
    });
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=mdn-annotation.js.map

/***/ }),
/* 139 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".mdn {\n  display: block;\n  font: 12px sans-serif;\n  position: absolute;\n  z-index: 9;\n  right: 0.3em;\n  background-color: #eee;\n  margin: -26px 0 0 0;\n  padding: 7px 5px 5px 6px;\n  min-width: 140px;\n  box-shadow: 0 0 3px #999;\n}\n\n.mdn button {\n  cursor: pointer;\n  border: none;\n  color: #000;\n  background: transparent;\n  margin: -8px;\n  outline: none;\n}\n\n.mdn b {\n  color: #fff;\n  background-color: #000;\n  font-weight: normal;\n  font-family: zillaslab, Palatino, \"Palatino Linotype\", serif;\n  padding: 2px 3px 0px 3px;\n  line-height: 1.3em;\n  vertical-align: top;\n}\n\n.mdn > div > div {\n  display: inline-block;\n  margin-left: 5px;\n}\n\n\n.nosupportdata {\n  font-style: italic;\n  margin-top: 4px;\n  margin-left: 8px;\n  padding-bottom: 8px;\n}\n\n.mdnsupport {\n  display: table;\n  margin-top: 4px;\n}\n\n.mdnsupport > span {\n  display: table-row;\n  padding: 0.2em 0;\n  padding-top: 0.2em;\n  font-size: 9.6px;\n}\n\n.mdnsupport > span > span {\n  display: table-cell;\n  padding: 0 0.5em;\n  vertical-align: top;\n  line-height: 1.5em;\n}\n\n.mdnsupport > span > span:last-child {\n  text-align: right;\n  padding: 0;\n}\n\n.mdnsupport > span.no {\n  color: #cccccc;\n  filter: grayscale(100%);\n}\n\n.mdnsupport > span.unknown {\n  color: #cccccc;\n  filter: grayscale(100%);\n}\n\n.mdnsupport > span.no::before {\n  opacity: 0.5;\n}\n\n.mdnsupport > span.unknown::before {\n  opacity: 0.5;\n}\n\n.mdnsupport > span::before {\n  content: \"\";\n  display: table-cell;\n  min-width: 1.5em;\n  height: 1.5em;\n  background: no-repeat center center / contain;\n  text-align: right;\n  font-size: 0.75em;\n  font-weight: bold;\n}\n\n.mdnsupport > .chrome::before,\n.mdnsupport > .chrome_android::before {\n  background-image: url(https://resources.whatwg.org/browser-logos/chrome.svg);\n}\n\n.mdnsupport > .edge::before,\n.mdnsupport > .edge_mobile::before {\n  background-image: url(https://resources.whatwg.org/browser-logos/edge.svg);\n}\n\n.mdnsupport > .firefox::before,\n.mdnsupport > .firefox_android::before {\n  background-image: url(https://resources.whatwg.org/browser-logos/firefox.png);\n}\n\n.mdnsupport > .ie::before {\n  background-image: url(https://resources.whatwg.org/browser-logos/ie.png);\n}\n\n.mdnsupport > .opera::before,\n.mdnsupport > .opera_android::before {\n  background-image: url(https://resources.whatwg.org/browser-logos/opera.png);\n}\n\n.mdnsupport > .safari::before {\n  background-image: url(https://resources.whatwg.org/browser-logos/safari.png);\n}\n\n.mdnsupport > .safari_ios::before {\n  background-image: url(https://resources.whatwg.org/browser-logos/safari-ios.svg);\n}\n\n.mdnsupport > .samsunginternet_android::before {\n  background-image: url(https://resources.whatwg.org/browser-logos/samsung.png);\n}\n\n.mdnsupport > .webview_android::before {\n  background-image: url(https://cdnjs.loli.net/ajax/libs/browser-logos/41.0.0/android-webview-beta/android-webview-beta_32x32.png);\n}\n\n.mdn.wrapped div:nth-child(n + 3) {\n  display: none;\n}\n\n.mdn div:nth-child(n + 3) > b {\n  color: #eee;\n  background-color: #eee;\n}\n\np + .mdn {\n  margin-top: -45px;\n}\n\n.mdn.before {\n  margin-top: 3em;\n}\n\nh2 + .mdn {\n  margin: -48px 0 0 0;\n}\n\nh3 + .mdn {\n  margin: -46px 0 0 0;\n}\n\nh4 + .mdn {\n  margin: -42px 0 0 0;\n}\n\nh5 + .mdn {\n  margin: -40px 0 0 0;\n}\n\nh6 + .mdn {\n  margin: -40px 0 0 0;\n}\n\n.mdn div {\n  margin: 0;\n}\n\n.mdn :link {\n  color: #0000ee;\n}\n\n.mdn :visited {\n  color: #551a8b;\n}\n\n.mdn :link:active,\n:visited:active {\n  color: #ff0000;\n}\n\n.mdn :link,\n:visited {\n  text-decoration: underline;\n  cursor: pointer;\n}\n\n.mdn.wrapped {\n  min-width: 0px;\n}\n\n.mdn.wrapped > div > div {\n  display: none;\n}\n\n.mdn:hover {\n  z-index: 11;\n}\n\n.mdn:focus-within {\n  z-index: 11;\n}\n");

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(10), __webpack_require__(13), __webpack_require__(3), __webpack_require__(141), __webpack_require__(11)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _l10n, _hyperhtml, _pubsubhub, _exporter, _ui) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.exportDocument = exportDocument;
  _exports.name = void 0;
  _hyperhtml = _interopRequireDefault(_hyperhtml);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _templateObject2() {
    const data = _taggedTemplateLiteral(["\n      <div class=\"respec-save-buttons\">\n        ", "\n      </div>"]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    const data = _taggedTemplateLiteral(["\n    <a\n      href=\"", "\"\n      id=\"", "\"\n      download=\"", "\"\n      type=\"", "\"\n      class=\"respec-save-button\"\n      onclick=", "\n    >", "</a>"]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  const name = "ui/save-html"; // Create and download an EPUB 3 version of the content
  // Using (by default) the EPUB 3 conversion service set up at labs.w3.org/epub-generator
  // For more details on that service, see https://github.com/iherman/respec2epub

  _exports.name = name;
  const epubURL = new URL("https://labs.w3.org/epub-generator/cgi-bin/epub-generator.py");
  epubURL.searchParams.append("type", "respec");
  epubURL.searchParams.append("url", document.location.href);
  const downloadLinks = [{
    id: "respec-save-as-html",
    fileName: "index.html",
    title: "HTML",
    type: "text/html",

    get href() {
      return (0, _exporter.rsDocToDataURL)(this.type);
    }

  }, {
    id: "respec-save-as-xml",
    fileName: "index.xhtml",
    title: "XML",
    type: "application/xml",

    get href() {
      return (0, _exporter.rsDocToDataURL)(this.type);
    }

  }, {
    id: "respec-save-as-epub",
    fileName: "spec.epub",
    title: "EPUB 3",
    type: "application/epub+zip",
    href: epubURL.href
  }];

  function toDownloadLink(details) {
    const {
      id,
      href,
      fileName,
      title,
      type
    } = details;
    return (0, _hyperhtml.default)(_templateObject(), href, id, fileName, type, () => _ui.ui.closeModal(), title);
  }

  const saveDialog = {
    async show(button) {
      await document.respecIsReady;
      const div = (0, _hyperhtml.default)(_templateObject2(), downloadLinks.map(toDownloadLink));

      _ui.ui.freshModal(_l10n.l10n[_l10n.lang].save_snapshot, div, button);
    }

  };
  const supportsDownload = "download" in HTMLAnchorElement.prototype;
  let button;

  if (supportsDownload) {
    button = _ui.ui.addCommand(_l10n.l10n[_l10n.lang].save_snapshot, show, "Ctrl+Shift+Alt+S", "💾");
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
    const msg = "Exporting via ui/save-html module's `exportDocument()` is deprecated and will be removed. " + "Use core/exporter `rsDocToDataURL()` instead.";
    (0, _pubsubhub.pub)("warn", msg);
    console.warn(msg);
    return (0, _exporter.rsDocToDataURL)(mimeType);
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=save-html.js.map

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(9), __webpack_require__(4), __webpack_require__(13), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _utils, _exposeModules, _hyperhtml, _pubsubhub) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.rsDocToDataURL = rsDocToDataURL;
  _hyperhtml = _interopRequireDefault(_hyperhtml);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _templateObject2() {
    const data = _taggedTemplateLiteral(["\n    <meta name=\"generator\" content=\"", "\">\n  "]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    const data = _taggedTemplateLiteral(["<meta charset=\"utf-8\">"]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  const mimeTypes = new Map([["text/html", "html"], ["application/xml", "xml"]]);
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
      const msg = "Invalid format: ".concat(mimeType, ". Expected one of: ").concat(validTypes, ".");
      throw new TypeError(msg);
    }

    const data = serialize(format, doc);
    const encodedString = encodeURIComponent(data);
    return "data:".concat(mimeType, ";charset=utf-8,").concat(encodedString);
  }

  function serialize(format, doc) {
    const cloneDoc = doc.cloneNode(true);
    cleanup(cloneDoc);
    let result = "";

    switch (format) {
      case "xml":
        result = new XMLSerializer().serializeToString(cloneDoc);
        break;

      default:
        {
          if (cloneDoc.doctype) {
            result += new XMLSerializer().serializeToString(cloneDoc.doctype);
          }

          result += cloneDoc.documentElement.outerHTML;
        }
    }

    return result;
  }

  function cleanup(cloneDoc) {
    const {
      head,
      body,
      documentElement
    } = cloneDoc;
    (0, _utils.removeCommentNodes)(cloneDoc);
    cloneDoc.querySelectorAll(".removeOnSave, #toc-nav").forEach(elem => elem.remove());
    body.classList.remove("toc-sidebar");
    (0, _utils.removeReSpec)(documentElement);
    const insertions = cloneDoc.createDocumentFragment(); // Move meta viewport, as it controls the rendering on mobile.

    const metaViewport = cloneDoc.querySelector("meta[name='viewport']");

    if (metaViewport && head.firstChild !== metaViewport) {
      insertions.appendChild(metaViewport);
    } // Move charset to near top, as it needs to be in the first 512 bytes.


    let metaCharset = cloneDoc.querySelector("meta[charset], meta[content*='charset=']");

    if (!metaCharset) {
      metaCharset = (0, _hyperhtml.default)(_templateObject());
    }

    insertions.appendChild(metaCharset); // Add meta generator

    const respecVersion = "ReSpec ".concat(window.respecVersion || "Developer Channel");
    const metaGenerator = (0, _hyperhtml.default)(_templateObject2(), respecVersion);
    insertions.appendChild(metaGenerator);
    head.prepend(insertions);
    (0, _pubsubhub.pub)("beforesave", documentElement);
  }

  (0, _exposeModules.expose)("core/exporter", {
    rsDocToDataURL
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=exporter.js.map

/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(10), __webpack_require__(9), __webpack_require__(13), __webpack_require__(11), __webpack_require__(77)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_l10n, _utils, _hyperhtml, _ui, _biblio) {
  "use strict";

  _hyperhtml = _interopRequireDefault(_hyperhtml);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _templateObject6() {
    const data = _taggedTemplateLiteral(["\n    <div>", "</div>\n    <p class=\"state\" hidden=\"", "\">\n      ", "\n    </p>\n    <section hidden=\"", "\">", "</section>\n  "]);

    _templateObject6 = function _templateObject6() {
      return data;
    };

    return data;
  }

  function _templateObject5() {
    const data = _taggedTemplateLiteral(["<div>", "</div>"]);

    _templateObject5 = function _templateObject5() {
      return data;
    };

    return data;
  }

  function _templateObject4() {
    const data = _taggedTemplateLiteral(["\n  <header>\n    <p>\n      An Open-Source, Community-Maintained Database of\n      Web Standards & Related References.\n    </p>\n  </header>\n  <div class=\"searchcomponent\">\n    <input\n      name=\"searchBox\"\n      type=\"search\"\n      autocomplete=\"off\"\n      placeholder=\"Keywords, titles, authors, urls\u2026\">\n    <button\n      type=\"submit\">\n        Search\n    </button>\n    <label>\n      <input type=\"checkbox\" name=\"includeVersions\"> Include all versions.\n    </label>\n  </div>\n"]);

    _templateObject4 = function _templateObject4() {
      return data;
    };

    return data;
  }

  function _templateObject3() {
    const data = _taggedTemplateLiteral(["\n    <dt>\n      [", "]\n    </dt>\n    <dd>", "</dd>\n  "]);

    _templateObject3 = function _templateObject3() {
      return data;
    };

    return data;
  }

  function _templateObject2() {
    const data = _taggedTemplateLiteral(["\n    <p class=\"result-stats\">\n      ", " results (", " seconds).\n      ", "\n    </p>\n    <dl class=\"specref-results\">", "</dl>\n  "]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    const data = _taggedTemplateLiteral(["\n      <p class=\"state\">\n        Your search - <strong> ", " </strong> -\n        did not match any references.\n      </p>\n    "]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  const button = _ui.ui.addCommand(_l10n.l10n[_l10n.lang].search_specref, show, "Ctrl+Shift+Alt+space", "🔎");

  const specrefURL = "https://specref.herokuapp.com/";
  const refSearchURL = "".concat(specrefURL, "search-refs");
  const reveseLookupURL = "".concat(specrefURL, "reverse-lookup");
  const form = document.createElement("form");

  const renderer = _hyperhtml.default.bind(form);

  const resultList = _hyperhtml.default.bind(document.createElement("div"));

  form.id = "specref-ui";
  /**
   * @param {Map<string, string>} resultMap
   * @param {string} query
   * @param {number} timeTaken
   */

  function renderResults(resultMap, query, timeTaken) {
    if (!resultMap.size) {
      return resultList(_templateObject(), query);
    }

    const wires = Array.from(resultMap).slice(0, 99).map(toDefinitionPair).reduce((collector, pair) => collector.concat(pair), []);
    return resultList(_templateObject2(), resultMap.size, timeTaken, resultMap.size > 99 ? "First 100 results." : "", wires);
  }

  function toDefinitionPair([key, entry]) {
    return _hyperhtml.default.wire(entry)(_templateObject3(), key, (0, _biblio.wireReference)(entry));
  }

  function resultProcessor({
    includeVersions
  } = {
    includeVersions: false
  }) {
    return (...fetchedData) => {
      const combinedResults = fetchedData.reduce((collector, resultObj) => Object.assign(collector, resultObj), {});
      const results = new Map(Object.entries(combinedResults)); // remove aliases

      Array.from(results).filter(([, entry]) => entry.aliasOf).map(([key]) => key).reduce((results, key) => results.delete(key) && results, results); // Remove versions, if asked to

      if (!includeVersions) {
        Array.from(results.values()).filter(entry => typeof entry === "object" && "versions" in entry).reduce(_utils.flatten, []).forEach(version => {
          results.delete(version);
        });
      } // Remove legacy string entries


      Array.from(results).filter(([, value]) => typeof value !== "object").forEach(([key]) => results.delete(key));
      return results;
    };
  }

  form.addEventListener("submit", async ev => {
    ev.preventDefault();
    const {
      searchBox
    } = form;
    const query = searchBox.value;

    if (!query) {
      searchBox.focus();
      return;
    }

    render({
      state: "Searching Specref…"
    });
    const refSearch = new URL(refSearchURL);
    refSearch.searchParams.set("q", query);
    const reverseLookup = new URL(reveseLookupURL);
    reverseLookup.searchParams.set("urls", query);

    try {
      const startTime = performance.now();
      const jsonData = await Promise.all([fetch(refSearch).then(response => response.json()), fetch(reverseLookup).then(response => response.json())]);
      const {
        checked: includeVersions
      } = form.includeVersions;
      const processResults = resultProcessor({
        includeVersions
      });
      const results = processResults(...jsonData);
      render({
        query,
        results,
        state: "",
        timeTaken: Math.round(performance.now() - startTime) / 1000
      });
    } catch (err) {
      console.error(err);
      render({
        state: "Error! Couldn't do search."
      });
    } finally {
      searchBox.focus();
    }
  });

  function show() {
    render();

    _ui.ui.freshModal(_l10n.l10n[_l10n.lang].search_specref, form, button);
    /** @type {HTMLElement} */


    const input = form.querySelector("input[type=search]");
    input.focus();
  }

  const mast = _hyperhtml.default.wire()(_templateObject4());
  /**
   * @param {object} options
   * @param {string} [options.state]
   * @param {Map<string, string>} [options.results]
   * @param {number} [options.timeTaken]
   * @param {string} [options.query]
   */


  function render({
    state = "",
    results,
    timeTaken,
    query
  } = {}) {
    if (!results) {
      renderer(_templateObject5(), mast);
      return;
    }

    renderer(_templateObject6(), mast, !state, state, !results, results ? renderResults(results, query, timeTaken) : []);
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=search-specref.js.map

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(10), __webpack_require__(11)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_l10n, _ui) {
  "use strict";

  // Module ui/search-xref
  // Search xref database
  const XREF_URL = "https://respec.org/xref/";
  const localizationStrings = {
    en: {
      title: "Search definitions"
    }
  };
  const lang = _l10n.lang in localizationStrings ? _l10n.lang : "en";
  const l10n = localizationStrings[lang];

  const button = _ui.ui.addCommand(l10n.title, show, "Ctrl+Shift+Alt+x", "📚");

  function show() {
    const iframe = document.createElement("iframe");
    iframe.id = "xref-ui";
    iframe.src = XREF_URL;

    iframe.onload = () => iframe.classList.add("ready");

    _ui.ui.freshModal(l10n.title, iframe, button);
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=search-xref.js.map

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(10), __webpack_require__(56), __webpack_require__(13), __webpack_require__(11)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_l10n, _dfnMap, _hyperhtml, _ui) {
  "use strict";

  _hyperhtml = _interopRequireDefault(_hyperhtml);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _templateObject2() {
    const data = _taggedTemplateLiteral(["", ""]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    const data = _taggedTemplateLiteral(["\n        <li>\n          <a href=\"", "\">\n            ", "\n          </a>\n        </li>\n      "]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  const button = _ui.ui.addCommand(_l10n.l10n[_l10n.lang].definition_list, show, "Ctrl+Shift+Alt+D", "📔");

  const ul = document.createElement("ul");
  ul.classList.add("respec-dfn-list");

  const render = _hyperhtml.default.bind(ul);

  ul.addEventListener("click", ev => {
    _ui.ui.closeModal();

    ev.stopPropagation();
  });

  function show() {
    const definitionLinks = Object.entries(_dfnMap.definitionMap).sort(([keyA], [keyB]) => keyA.localeCompare(keyB)).map(([, [dfn]]) => {
      return _hyperhtml.default.wire(dfn, ":li>a")(_templateObject(), "#".concat(dfn.id), dfn.textContent);
    });
    render(_templateObject2(), definitionLinks);

    _ui.ui.freshModal(_l10n.l10n[_l10n.lang].list_of_definitions, ul, button);
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=dfn-list.js.map

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(10), __webpack_require__(13), __webpack_require__(11)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_l10n, _hyperhtml, _ui) {
  "use strict";

  _hyperhtml = _interopRequireDefault(_hyperhtml);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _templateObject2() {
    const data = _taggedTemplateLiteral(["\n    <td>\n      <a href=\"", "\">\n        ", "\n      </a>\n    </td>\n    <td>\n      ", " \n    </td>\n  "]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    const data = _taggedTemplateLiteral(["\n  <p>\n    ReSpec is a document production toolchain, with a notable focus on W3C specifications.\n  </p>\n  <p>\n    <a href='https://github.com/w3c/respec/wiki'>Documentation</a>,\n    <a href='https://github.com/w3c/respec/issues'>Bugs</a>.\n  </p>\n  <table border=\"1\" width=\"100%\" hidden=\"", "\">\n    <caption>\n      Loaded plugins\n    </caption>\n    <thead>\n      <tr>\n        <th>\n          Plugin Name\n        </th>\n        <th>\n          Processing time\n        </th>\n      </tr>\n    </thead>\n    <tbody>", "</tbody>\n  </table>\n"]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  // window.respecVersion is added at build time (see tools/builder.js)
  window.respecVersion = window.respecVersion || "Developer Edition";
  const div = document.createElement("div");

  const render = _hyperhtml.default.bind(div);

  const button = _ui.ui.addCommand("About ".concat(window.respecVersion), show, "Ctrl+Shift+Alt+A", "ℹ️");

  function show() {
    _ui.ui.freshModal("".concat(_l10n.l10n[_l10n.lang].about_respec, " - ").concat(window.respecVersion), div, button);

    const entries = [];

    if ("getEntriesByType" in performance) {
      performance.getEntriesByType("measure").sort((a, b) => b.duration - a.duration).map(({
        name,
        duration
      }) => {
        const fixedSize = duration.toFixed(2);
        const humanDuration = fixedSize > 1000 ? "".concat(Math.round(fixedSize / 1000.0), " second(s)") : "".concat(fixedSize, " milliseconds");
        return {
          name,
          duration: humanDuration
        };
      }).map(perfEntryToTR).forEach(entry => {
        entries.push(entry);
      });
    }

    render(_templateObject(), entries.length ? false : true, entries);
  }

  function perfEntryToTR({
    name,
    duration
  }) {
    const render = _hyperhtml.default.bind(document.createElement("tr"));

    const moduleURL = "https://github.com/w3c/respec/tree/develop/src/".concat(name, ".js");
    return render(_templateObject2(), moduleURL, name, duration);
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=about-respec.js.map

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;

  /**
   * This Module adds a metatag description to the document, based on the
   * first paragraph of the abstract.
   */
  const name = "core/seo";
  _exports.name = name;

  function run() {
    // This is not critical, so let's continue other processing first
    (async () => {
      await document.respecIsReady;
      const firstParagraph = document.querySelector("#abstract p:first-of-type");

      if (!firstParagraph) {
        return; // no abstract, so nothing to do
      }

      insertMetaDescription(firstParagraph);
    })();
  }

  function insertMetaDescription(firstParagraph) {
    // Normalize whitespace: trim, remove new lines, tabs, etc.
    const doc = firstParagraph.ownerDocument;
    const content = firstParagraph.textContent.replace(/\s+/, " ").trim();
    const metaElem = doc.createElement("meta");
    metaElem.name = "description";
    metaElem.content = content;
    doc.head.appendChild(metaElem);
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=seo.js.map

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(77), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _biblio, _pubsubhub) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  // Module w3c/seo
  // Manages SEO information for documents
  // e.g. set the canonical URL for the document if configured
  const name = "w3c/seo";
  _exports.name = name;

  function run(conf) {
    const trLatestUri = conf.shortName ? "https://www.w3.org/TR/".concat(conf.shortName, "/") : null;

    switch (conf.canonicalURI) {
      case "edDraft":
        if (conf.edDraftURI) {
          conf.canonicalURI = new URL(conf.edDraftURI, document.location.href).href;
        } else {
          (0, _pubsubhub.pub)("warn", "Canonical URI set to edDraft, " + "but no edDraftURI is set in configuration");
          conf.canonicalURI = null;
        }

        break;

      case "TR":
        if (trLatestUri) {
          conf.canonicalURI = trLatestUri;
        } else {
          (0, _pubsubhub.pub)("warn", "Canonical URI set to TR, but " + "no shortName is set in configuration");
          conf.canonicalURI = null;
        }

        break;

      default:
        if (conf.canonicalURI) {
          try {
            conf.canonicalURI = new URL(conf.canonicalURI, document.location.href).href;
          } catch (err) {
            (0, _pubsubhub.pub)("warn", "CanonicalURI is an invalid URL: ".concat(err.message));
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
      addJSONLDInfo(conf, document);
    }
  }

  async function addJSONLDInfo(conf, doc) {
    await doc.respecIsReady; // Content for JSON

    const type = ["TechArticle"];
    if (conf.rdfStatus) type.push(conf.rdfStatus);
    const jsonld = {
      "@context": ["http://schema.org", {
        "@vocab": "http://schema.org/",
        "@language": doc.documentElement.lang || "en",
        w3p: "http://www.w3.org/2001/02pd/rec54#",
        foaf: "http://xmlns.com/foaf/0.1/",
        datePublished: {
          "@type": "http://www.w3.org/2001/XMLSchema#date"
        },
        inLanguage: {
          "@language": null
        },
        isBasedOn: {
          "@type": "@id"
        },
        license: {
          "@type": "@id"
        }
      }],
      id: conf.canonicalURI || conf.thisVersion,
      type,
      name: conf.title,
      inLanguage: doc.documentElement.lang || "en",
      license: conf.licenseInfo.url,
      datePublished: conf.dashDate,
      copyrightHolder: {
        name: "World Wide Web Consortium",
        url: "https://www.w3.org/"
      },
      discussionUrl: conf.issueBase,
      alternativeHeadline: conf.subtitle,
      isBasedOn: conf.prevVersion
    }; // add any additional copyright holders

    if (conf.additionalCopyrightHolders) {
      const addl = Array.isArray(conf.additionalCopyrightHolders) ? conf.additionalCopyrightHolders : [conf.additionalCopyrightHolders];
      jsonld.copyrightHolder = [jsonld.copyrightHolder, ...addl.map(h => ({
        name: h
      }))];
    } // description from meta description


    const description = doc.head.querySelector("meta[name=description]");

    if (description) {
      jsonld.description = description.content;
    } // Editors


    if (conf.editors) {
      jsonld.editor = conf.editors.map(addPerson);
    }

    if (conf.authors) {
      jsonld.contributor = conf.authors.map(addPerson);
    } // normative and informative references


    jsonld.citation = [...conf.normativeReferences, ...conf.informativeReferences].map(ref => _biblio.biblio[ref]).filter(ref => typeof ref === "object").map(addRef);
    const script = doc.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(jsonld, null, 2);
    doc.head.appendChild(script);
  }
  /**
   * Turn editors and authors into a list of JSON-LD relationships
   */


  function addPerson({
    name,
    url,
    mailto,
    company,
    companyURL
  }) {
    const ed = {
      type: "Person",
      name,
      url,
      "foaf:mbox": mailto
    };

    if (company || companyURL) {
      ed.worksFor = {
        name: company,
        url: companyURL
      };
    }

    return ed;
  }
  /**
   * Create a reference URL from the ref
   */


  function addRef(ref) {
    const {
      href: id,
      title: name,
      href: url
    } = ref;
    return {
      id,
      type: "TechArticle",
      name,
      url
    };
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=seo.js.map

/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(149), __webpack_require__(13), __webpack_require__(9), __webpack_require__(150)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _github, _hyperhtml, _utils, _worker) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  _github = _interopRequireDefault(_github);
  _hyperhtml = _interopRequireDefault(_hyperhtml);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _templateObject() {
    const data = _taggedTemplateLiteral(["\n      <style>\n        ", "\n      </style>\n    "]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  const name = "core/highlight";
  _exports.name = name;
  const nextMsgId = (0, _utils.msgIdGenerator)("highlight");

  function getLanguageHint(classList) {
    return Array.from(classList).filter(item => item !== "highlight" && item !== "nolinks").map(item => item.toLowerCase());
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

    const {
      language,
      value
    } = response;

    switch (elem.localName) {
      case "pre":
        elem.classList.remove(language);
        elem.innerHTML = "<code class=\"hljs".concat(language ? " ".concat(language) : "", "\">").concat(value, "</code>");
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

  function sendHighlightRequest(code, languages) {
    const msg = {
      action: "highlight",
      code,
      id: nextMsgId(),
      languages
    };

    _worker.worker.postMessage(msg);

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error("Timed out waiting for highlight."));
      }, 4000);

      _worker.worker.addEventListener("message", function listener(ev) {
        const {
          data: {
            id,
            language,
            value
          }
        } = ev;
        if (id !== msg.id) return; // not for us!

        _worker.worker.removeEventListener("message", listener);

        clearTimeout(timeoutId);
        resolve({
          language,
          value
        });
      });
    });
  }

  async function run(conf) {
    // Nothing to highlight
    if (conf.noHighlightCSS) return;
    const highlightables = [...document.querySelectorAll("\n    pre:not(.idl):not(.nohighlight) > code:not(.nohighlight),\n    pre:not(.idl):not(.nohighlight),\n    code.highlight\n  ")].filter( // Filter pre's that contain code
    elem => elem.localName !== "pre" || !elem.querySelector("code")); // Nothing to highlight

    if (!highlightables.length) {
      return;
    }

    const promisesToHighlight = highlightables.filter(elem => elem.textContent.trim()).map(highlightElement);
    document.head.appendChild((0, _hyperhtml.default)(_templateObject(), _github.default));
    await Promise.all(promisesToHighlight);
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=highlight.js.map

/***/ }),
/* 149 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("/*\n\ngithub.com style (c) Vasily Polovnyov <vast@whiteants.net>\n\n*/\n\n.hljs {\n  display: block;\n  overflow-x: auto;\n  padding: 0.5em;\n  color: #333;\n  background: #f8f8f8;\n}\n\n.hljs-comment,\n.hljs-quote {\n  color: #998;\n  font-style: italic;\n}\n\n.hljs-keyword,\n.hljs-selector-tag,\n.hljs-subst {\n  color: #333;\n  font-weight: bold;\n}\n\n.hljs-number,\n.hljs-literal,\n.hljs-variable,\n.hljs-template-variable,\n.hljs-tag .hljs-attr {\n  color: #008080;\n}\n\n.hljs-string,\n.hljs-doctag {\n  color: #d14;\n}\n\n.hljs-title,\n.hljs-section,\n.hljs-selector-id {\n  color: #900;\n  font-weight: bold;\n}\n\n.hljs-subst {\n  font-weight: normal;\n}\n\n.hljs-type,\n.hljs-class .hljs-title {\n  color: #458;\n  font-weight: bold;\n}\n\n.hljs-tag,\n.hljs-name,\n.hljs-attribute {\n  color: #000080;\n  font-weight: normal;\n}\n\n.hljs-regexp,\n.hljs-link {\n  color: #009926;\n}\n\n.hljs-symbol,\n.hljs-bullet {\n  color: #990073;\n}\n\n.hljs-built_in,\n.hljs-builtin-name {\n  color: #0086b3;\n}\n\n.hljs-meta {\n  color: #999;\n  font-weight: bold;\n}\n\n.hljs-deletion {\n  background: #fdd;\n}\n\n.hljs-addition {\n  background: #dfd;\n}\n\n.hljs-emphasis {\n  font-style: italic;\n}\n\n.hljs-strong {\n  font-weight: bold;\n}\n");

/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(9), __webpack_require__(4), __webpack_require__(151)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _utils, _exposeModules, _respecWorker) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.worker = _exports.name = void 0;
  _respecWorker = _interopRequireDefault(_respecWorker);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  // @ts-check

  /**
   * Module core/worker
   *
   * Exports a Web Worker for ReSpec, allowing for
   * multi-threaded processing of things.
   */
  const name = "core/worker"; // Opportunistically preload syntax highlighter, which is used by the worker

  _exports.name = name;
  // Opportunistically preload syntax highlighter
  const hint = {
    hint: "preload",
    href: "https://www.w3.org/Tools/respec/respec-highlight.js",
    as: "script"
  };
  const link = (0, _utils.createResourceHint)(hint);
  document.head.appendChild(link);
  const workerURL = URL.createObjectURL(new Blob([_respecWorker.default], {
    type: "application/javascript"
  }));
  const worker = new Worker(workerURL);
  _exports.worker = worker;
  (0, _exposeModules.expose)(name, {
    worker
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=worker.js.map

/***/ }),
/* 151 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("// ReSpec Worker v1.0.0\n\"use strict\";\ntry {\n  importScripts(\"https://www.w3.org/Tools/respec/respec-highlight.js\");\n} catch (err) {\n  console.error(\"Network error loading highlighter\", err);\n}\n\nself.addEventListener(\"message\", ({ data: originalData }) => {\n  const data = Object.assign({}, originalData);\n  switch (data.action) {\n    case \"highlight-load-lang\": {\n      const { langURL, propName, lang } = data;\n      importScripts(langURL);\n      self.hljs.registerLanguage(lang, self[propName]);\n      break;\n    }\n    case \"highlight\": {\n      const { code } = data;\n      const langs = data.languages.length ? data.languages : undefined;\n      try {\n        const { value, language } = self.hljs.highlightAuto(code, langs);\n        Object.assign(data, { value, language });\n      } catch (err) {\n        console.error(\"Could not transform some code?\", err);\n        // Post back the original code\n        Object.assign(data, { value: code, language: \"\" });\n      }\n      break;\n    }\n  }\n  self.postMessage(data);\n});\n");

/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(153)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _clipboard) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  _clipboard = _interopRequireDefault(_clipboard);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  // @ts-check

  /**
   * Module core/webidl-clipboard
   *
   * This module adds a button to each IDL pre making it possible to copy
   * well-formatted IDL to the clipboard.
   *
   */
  const name = "core/webidl-clipboard"; // This button serves a prototype that we clone as needed.

  _exports.name = name;
  const copyButton = document.createElement("button");
  copyButton.innerHTML = _clipboard.default;
  copyButton.title = "Copy IDL to clipboard";
  copyButton.classList.add("respec-button-copy-paste", "removeOnSave");

  async function run() {
    for (const pre of document.querySelectorAll("pre.idl")) {
      const button = copyButton.cloneNode(true);
      button.addEventListener("click", () => {
        clipboardWriteText(pre.textContent);
      });
      pre.prepend(button);
    }
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
      document.addEventListener("copy", ev => {
        ev.clipboardData.setData("text/plain", text);
        resolve();
      }, {
        once: true
      });
      document.execCommand("copy");
    });
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=webidl-clipboard.js.map

/***/ }),
/* 153 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<svg height=\"16\" viewBox=\"0 0 14 16\" width=\"14\"><path fill-rule=\"evenodd\" d=\"M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z\"/></svg>");

/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(10), __webpack_require__(13), __webpack_require__(3), __webpack_require__(9)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _l10n, _hyperhtml, _pubsubhub, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  _hyperhtml = _interopRequireDefault(_hyperhtml);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _templateObject2() {
    const data = _taggedTemplateLiteral(["\n        <summary>\n          tests: ", "\n        </summary>\n        <ul>", "</ul>\n      "]);

    _templateObject2 = function _templateObject2() {
      return data;
    };

    return data;
  }

  function _templateObject() {
    const data = _taggedTemplateLiteral(["\n    <a href=\"", "\">\n      ", "\n    </a> ", "\n  "]);

    _templateObject = function _templateObject() {
      return data;
    };

    return data;
  }

  function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

  const l10n = {
    en: {
      missing_test_suite_uri: "Found tests in your spec, but missing '" + "[`testSuiteURI`](https://github.com/w3c/respec/wiki/testSuiteURI)' in your ReSpec config.",
      tests: "tests",
      test: "test"
    }
  };
  const name = "core/data-tests";
  _exports.name = name;
  const lang = _l10n.lang in l10n ? _l10n.lang : "en";

  function toListItem(href) {
    const emojiList = [];
    const [testFile] = new URL(href).pathname.split("/").reverse();
    const testParts = testFile.split(".");
    let [testFileName] = testParts;
    const isSecureTest = testParts.find(part => part === "https");

    if (isSecureTest) {
      const requiresConnectionEmoji = document.createElement("span");
      requiresConnectionEmoji.textContent = "🔒";
      requiresConnectionEmoji.setAttribute("aria-label", "requires a secure connection");
      requiresConnectionEmoji.setAttribute("title", "Test requires HTTPS");
      testFileName = testFileName.replace(".https", "");
      emojiList.push(requiresConnectionEmoji);
    }

    const isManualTest = testFileName.split(".").join("-").split("-").find(part => part === "manual");

    if (isManualTest) {
      const manualPerformEmoji = document.createElement("span");
      manualPerformEmoji.textContent = "💪";
      manualPerformEmoji.setAttribute("aria-label", "the test must be run manually");
      manualPerformEmoji.setAttribute("title", "Manual test");
      testFileName = testFileName.replace("-manual", "");
      emojiList.push(manualPerformEmoji);
    }

    const testList = _hyperhtml.default.bind(document.createElement("li"))(_templateObject(), href, testFileName, emojiList);

    return testList;
  }

  function run(conf) {
    /** @type {NodeListOf<HTMLElement>} */
    const testables = document.querySelectorAll("[data-tests]");

    if (!testables.length) {
      return;
    }

    if (!conf.testSuiteURI) {
      (0, _pubsubhub.pub)("error", l10n[lang].missing_test_suite_uri);
      return;
    }

    Array.from(testables).filter(elem => elem.dataset.tests) // Render details + ul, returns HTMLDetailsElement
    .map(elem => {
      const details = document.createElement("details");

      const renderer = _hyperhtml.default.bind(details);

      const testURLs = elem.dataset.tests.split(/,/gm).map(url => url.trim()).map(url => {
        let href = "";

        try {
          href = new URL(url, conf.testSuiteURI).href;
        } catch (_unused) {
          (0, _pubsubhub.pub)("warn", "".concat(l10n[lang].bad_uri, ": ").concat(url));
        }

        return href;
      });
      const duplicates = testURLs.filter((links, i, self) => self.indexOf(links) !== i);

      if (duplicates.length) {
        (0, _utils.showInlineWarning)(elem, "Duplicate tests found", "To fix, remove duplicates from \"data-tests\": ".concat(duplicates.map(url => new URL(url).pathname).join(", ")));
      }

      details.classList.add("respec-tests-details", "removeOnSave");
      const uniqueList = [...new Set(testURLs)];
      renderer(_templateObject2(), uniqueList.length, uniqueList.map(toListItem));
      return {
        elem,
        details
      };
    }).forEach(({
      elem,
      details
    }) => {
      delete elem.dataset.tests;
      elem.append(details);
    });
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=data-tests.js.map

/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(9), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _utils, _pubsubhub) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.sortListItems = sortListItems;
  _exports.sortDefinitionTerms = sortDefinitionTerms;
  _exports.run = run;
  _exports.name = void 0;
  const name = "core/list-sorter";
  _exports.name = name;

  function makeSorter(direction) {
    return ({
      textContent: a
    }, {
      textContent: b
    }) => {
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
    const elements = [...(0, _utils.children)(elem, "li")];
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
    const elements = [...(0, _utils.children)(dl, "dt")];
    const sortedElements = elements.sort(makeSorter(dir)).reduce((frag, elem) => {
      const {
        nodeType,
        nodeName
      } = elem;
      const children = document.createDocumentFragment();
      let {
        nextSibling: next
      } = elem;

      while (next) {
        if (!next.nextSibling) {
          break;
        }

        children.appendChild(next.cloneNode(true));
        const {
          nodeType: nextType,
          nodeName: nextName
        } = next.nextSibling;
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

  function run() {
    for (const elem of document.querySelectorAll("[data-sort]")) {
      let sortedElems;
      const dir = elem.dataset.sort || "ascending";

      switch (elem.localName) {
        case "dl":
          sortedElems = sortDefinitionTerms(elem, dir);
          break;

        case "ol":
        case "ul":
          sortedElems = sortListItems(elem, dir);
          break;

        default:
          (0, _pubsubhub.pub)("warning", "ReSpec can't sort ".concat(elem.localName, " elements."));
      }

      if (sortedElems) {
        const range = document.createRange();
        range.selectNodeContents(elem);
        range.deleteContents();
        elem.appendChild(sortedElems);
      }
    }
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=list-sorter.js.map

/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(157), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _var, _pubsubhub) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  _var = _interopRequireDefault(_var);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  // @ts-check

  /**
   * Module core/highlight-vars
   * Highlights occurrences of a <var> within a section on click.
   * Set `conf.highlightVars = true` to enable.
   * Removes highlights from <var> if clicked anywhere else.
   * All is done while keeping in mind that exported html stays clean
   * on export.
   */
  const name = "core/highlight-vars";
  _exports.name = name;

  function run(conf) {
    if (!conf.highlightVars) {
      return;
    }

    const styleElement = document.createElement("style");
    styleElement.textContent = _var.default;
    styleElement.classList.add("removeOnSave");
    document.head.appendChild(styleElement);
    document.querySelectorAll("var").forEach(varElem => varElem.addEventListener("click", highlightListener)); // remove highlights, cleanup empty class/style attributes

    (0, _pubsubhub.sub)("beforesave", outputDoc => {
      outputDoc.querySelectorAll("var.respec-hl").forEach(removeHighlight);
    });
  }

  function highlightListener(ev) {
    ev.stopPropagation();
    const {
      target: varElem
    } = ev;
    const hightligtedElems = highlightVars(varElem);

    const resetListener = () => {
      const hlColor = getHighlightColor(varElem);
      hightligtedElems.forEach(el => removeHighlight(el, hlColor));
      [...HL_COLORS.keys()].forEach(key => HL_COLORS.set(key, true));
    };

    if (hightligtedElems.length) {
      document.body.addEventListener("click", resetListener, {
        once: true
      });
    }
  } // availability of highlight colors. colors from var.css


  const HL_COLORS = new Map([["respec-hl-c1", true], ["respec-hl-c2", true], ["respec-hl-c3", true], ["respec-hl-c4", true], ["respec-hl-c5", true], ["respec-hl-c6", true], ["respec-hl-c7", true]]);

  function getHighlightColor(target) {
    // return current colors if applicable
    const {
      value
    } = target.classList;
    const re = /respec-hl-\w+/;
    const activeClass = re.test(value) && value.match(re);
    if (activeClass) return activeClass[0]; // first color preference

    if (HL_COLORS.get("respec-hl-c1") === true) return "respec-hl-c1"; // otherwise get some other available color

    return [...HL_COLORS.keys()].find(c => HL_COLORS.get(c)) || "respec-hl-c1";
  }

  function highlightVars(varElem) {
    const textContent = varElem.textContent.trim();
    const parent = varElem.closest("section");
    const highlightColor = getHighlightColor(varElem);
    const varsToHighlight = [...parent.querySelectorAll("var")].filter(el => el.textContent.trim() === textContent && el.closest("section") === parent); // update availability of highlight color

    const colorStatus = varsToHighlight[0].classList.contains("respec-hl");
    HL_COLORS.set(highlightColor, colorStatus); // highlight vars

    if (colorStatus) {
      varsToHighlight.forEach(el => removeHighlight(el, highlightColor));
      return [];
    } else {
      varsToHighlight.forEach(el => addHighlight(el, highlightColor));
    }

    return varsToHighlight;
  }

  function removeHighlight(el, highlightColor) {
    el.classList.remove("respec-hl", highlightColor); // clean up empty class attributes so they don't come in export

    if (!el.classList.length) el.removeAttribute("class");
  }

  function addHighlight(elem, highlightColor) {
    elem.classList.add("respec-hl", highlightColor);
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=highlight-vars.js.map

/***/ }),
/* 157 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("var:hover {\n  text-decoration: underline;\n  cursor: pointer;\n}\n\nvar.respec-hl {\n  color: var(--color, #000);\n  background-color: var(--bg-color);\n  box-shadow: 0 0 0px 2px var(--bg-color);\n}\n\n/* highlight colors\n  https://github.com/w3c/tr-design/issues/152\n*/\nvar.respec-hl-c1 {\n  --bg-color: #f4d200;\n}\n\nvar.respec-hl-c2 {\n  --bg-color: #ff87a2;\n}\n\nvar.respec-hl-c3 {\n  --bg-color: #96e885;\n}\n\nvar.respec-hl-c4 {\n  --bg-color: #3eeed2;\n}\n\nvar.respec-hl-c5 {\n  --bg-color: #eacfb6;\n}\n\nvar.respec-hl-c6 {\n  --bg-color: #82ddff;\n}\n\nvar.respec-hl-c7 {\n  --bg-color: #ffbcf2;\n}\n\n@media print {\n  var.respec-hl {\n    background: none;\n    color: #000;\n    box-shadow: unset;\n  }\n}\n");

/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(159)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _datatype) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  _datatype = _interopRequireDefault(_datatype);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  // @ts-check

  /**
   * Module core/data-type
   * Propagates data type of a <var> to subsequent instances within a section.
   * Also adds the CSS for the data type tooltip.
   * Set `conf.highlightVars = true` to enable.
   */
  const name = "core/data-type";
  _exports.name = name;

  function run(conf) {
    if (!conf.highlightVars) {
      return;
    }

    const style = document.createElement("style");
    style.textContent = _datatype.default;
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
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=data-type.js.map

/***/ }),
/* 159 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("var {\n  position: relative;\n  cursor: pointer;\n}\n\nvar[data-type]::before,\nvar[data-type]::after {\n  position: absolute;\n  left: 50%;\n  top: -6px;\n  opacity: 0;\n  transition: opacity 0.4s;\n  pointer-events: none;\n}\n\n/* the triangle or arrow or caret or whatever */\nvar[data-type]::before {\n  content: \"\";\n  transform: translateX(-50%);\n  border-width: 4px 6px 0 6px;\n  border-style: solid;\n  border-color: transparent;\n  border-top-color: #000;\n}\n\n/* actual text */\nvar[data-type]::after {\n  content: attr(data-type);\n  transform: translateX(-50%) translateY(-100%);\n  background: #000;\n  text-align: center;\n  /* additional styling */\n  font-family: \"Dank Mono\", \"Fira Code\", monospace;\n  font-style: normal;\n  padding: 6px;\n  border-radius: 3px;\n  color: #daca88;\n  text-indent: 0;\n  font-weight: normal;\n}\n\nvar[data-type]:hover::after,\nvar[data-type]:hover::before {\n  opacity: 1;\n}\n");

/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(161)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _algorithms) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  _algorithms = _interopRequireDefault(_algorithms);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  // @ts-check

  /**
  Currently used only for adding 'assert' class to algorithm lists
  */
  const name = "core/algorithms";
  _exports.name = name;

  async function run() {
    const elements = Array.from(document.querySelectorAll("ol.algorithm li"));
    elements.filter(li => li.textContent.trim().startsWith("Assert: ")).forEach(li => li.classList.add("assert"));

    if (document.querySelector(".assert")) {
      const style = document.createElement("style");
      style.textContent = _algorithms.default;
      document.head.appendChild(style);
    }
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=algorithms.js.map

/***/ }),
/* 161 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("/* For assertions in lists containing algorithms */\n\n.assert {\n    background: #EEE;\n    border-left: 0.5em solid #AAA;\n    padding: 0.3em;\n}\n");

/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(9)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_exports, _utils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.run = run;
  _exports.name = void 0;
  // expands empty anchors based on their context
  const name = "core/anchor-expander";
  _exports.name = name;

  function run() {
    const anchors = [...document.querySelectorAll("a[href^='#']:not(.self-link):not([href$='the-empty-string'])")].filter(a => a.textContent.trim() === "");

    for (const a of anchors) {
      const id = a.getAttribute("href").slice(1);
      const matchingElement = document.getElementById(id);

      if (!matchingElement) {
        a.textContent = a.getAttribute("href");
        const msg = "Couldn't expand inline reference. The id \"".concat(id, "\" is not in the document.");
        (0, _utils.showInlineError)(a, msg, "No matching id in document: ".concat(id, "."));
        continue;
      }

      switch (matchingElement.localName) {
        case "h6":
        case "h5":
        case "h4":
        case "h3":
        case "h2":
          {
            processHeading(matchingElement, a);
            break;
          }

        case "section":
          {
            // find first heading in the section
            processSection(matchingElement, id, a);
            break;
          }

        case "figure":
          {
            processFigure(matchingElement, id, a);
            break;
          }

        case "aside":
        case "div":
          {
            processBox(matchingElement, id, a);
            break;
          }

        default:
          {
            a.textContent = a.getAttribute("href");
            const msg = "ReSpec doesn't support expanding this kind of reference.";
            (0, _utils.showInlineError)(a, msg, "Can't expand \"#".concat(id, "\"."));
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
      const msg = "Found matching element \"".concat(id, "\", but it has no title or marker.");
      (0, _utils.showInlineError)(a, msg, "Missing title.");
      return;
    }

    const copy = (0, _utils.makeSafeCopy)(selfLink);
    a.append(...copy.childNodes);
    a.classList.add("box-ref");
  }

  function processFigure(matchingElement, id, a) {
    const figcaption = matchingElement.querySelector("figcaption");

    if (!figcaption) {
      a.textContent = a.getAttribute("href");
      const msg = "Found matching figure \"".concat(id, "\", but figure is lacking a `<figcaption>`.");
      (0, _utils.showInlineError)(a, msg, "Missing figcaption in referenced figure.");
      return;
    } // remove the figure's title


    const children = [...(0, _utils.makeSafeCopy)(figcaption).childNodes].filter(node => !node.classList || !node.classList.contains("fig-title")); // drop an empty space at the end.

    children.pop();
    a.append(...children);
    a.classList.add("fig-ref");
    const figTitle = figcaption.querySelector(".fig-title");

    if (!a.hasAttribute("title") && figTitle) {
      a.title = (0, _utils.norm)(figTitle.textContent);
    }
  }

  function processSection(matchingElement, id, a) {
    const heading = matchingElement.querySelector("h6, h5, h4, h3, h2");

    if (!heading) {
      a.textContent = a.getAttribute("href");
      const msg = "Found matching section, but the section was lacking a heading element.";
      (0, _utils.showInlineError)(a, msg, "No matching id in document: \"".concat(id, "\"."));
      return;
    }

    processHeading(heading, a);
    localize(heading, a);
  }

  function processHeading(heading, a) {
    const hadSelfLink = heading.querySelector(".self-link");
    const children = [...(0, _utils.makeSafeCopy)(heading).childNodes].filter(node => !node.classList || !node.classList.contains("self-link"));
    a.append(...children);
    if (hadSelfLink) a.prepend("§\u00A0");
    a.classList.add("sec-ref");
  }

  function localize(matchingElement, newElement) {
    for (const attrName of ["dir", "lang"]) {
      // Already set on element, don't override.
      if (newElement.hasAttribute(attrName)) continue; // Closest in tree setting the attribute

      const matchingClosest = matchingElement.closest("[".concat(attrName, "]"));
      if (!matchingClosest) continue; // Closest to reference setting the attribute

      const newClosest = newElement.closest("[".concat(attrName, "]")); // It's the same, so already inherited from closest (probably HTML element or body).

      if (newClosest && newClosest.getAttribute(attrName) === matchingClosest.getAttribute(attrName)) continue; // Otherwise, set it.

      newElement.setAttribute(attrName, matchingClosest.getAttribute(attrName));
    }
  }
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
//# sourceMappingURL=anchor-expander.js.map

/***/ }),
/* 163 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "openDB", function() { return openDB; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteDB", function() { return deleteDB; });
/* harmony import */ var _chunk_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(164);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "unwrap", function() { return _chunk_js__WEBPACK_IMPORTED_MODULE_0__["e"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "wrap", function() { return _chunk_js__WEBPACK_IMPORTED_MODULE_0__["a"]; });




/**
 * Open a database.
 *
 * @param name Name of the database.
 * @param version Schema version.
 * @param callbacks Additional callbacks.
 */
function openDB(name, version, { blocked, upgrade, blocking } = {}) {
    const request = indexedDB.open(name, version);
    const openPromise = Object(_chunk_js__WEBPACK_IMPORTED_MODULE_0__["a"])(request);
    if (upgrade) {
        request.addEventListener('upgradeneeded', (event) => {
            upgrade(Object(_chunk_js__WEBPACK_IMPORTED_MODULE_0__["a"])(request.result), event.oldVersion, event.newVersion, Object(_chunk_js__WEBPACK_IMPORTED_MODULE_0__["a"])(request.transaction));
        });
    }
    if (blocked)
        request.addEventListener('blocked', () => blocked());
    if (blocking)
        openPromise.then(db => db.addEventListener('versionchange', blocking));
    return openPromise;
}
/**
 * Delete a database.
 *
 * @param name Name of the database.
 */
function deleteDB(name, { blocked } = {}) {
    const request = indexedDB.deleteDatabase(name);
    if (blocked)
        request.addEventListener('blocked', () => blocked());
    return Object(_chunk_js__WEBPACK_IMPORTED_MODULE_0__["a"])(request).then(() => undefined);
}

const readMethods = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'];
const writeMethods = ['put', 'add', 'delete', 'clear'];
const cachedMethods = new Map();
function getMethod(target, prop) {
    if (!(target instanceof IDBDatabase &&
        !(prop in target) &&
        typeof prop === 'string'))
        return;
    if (cachedMethods.get(prop))
        return cachedMethods.get(prop);
    const targetFuncName = prop.replace(/FromIndex$/, '');
    const useIndex = prop !== targetFuncName;
    const isWrite = writeMethods.includes(targetFuncName);
    if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) ||
        !(isWrite || readMethods.includes(targetFuncName)))
        return;
    const method = async function (storeName, ...args) {
        // isWrite ? 'readwrite' : undefined gzipps better, but fails in Edge :(
        const tx = this.transaction(storeName, isWrite ? 'readwrite' : 'readonly');
        let target = tx.store;
        if (useIndex)
            target = target.index(args.shift());
        const returnVal = target[targetFuncName](...args);
        if (isWrite)
            await tx.done;
        return returnVal;
    };
    cachedMethods.set(prop, method);
    return method;
}
Object(_chunk_js__WEBPACK_IMPORTED_MODULE_0__["b"])(oldTraps => ({
    get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
    has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop),
}));




/***/ }),
/* 164 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return wrap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return addTraps; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return instanceOfAny; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return reverseTransformCache; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return unwrap; });
const instanceOfAny = (object, constructors) => constructors.some(c => object instanceof c);

let idbProxyableTypes;
let cursorAdvanceMethods;
// This is a function to prevent it throwing up in node environments.
function getIdbProxyableTypes() {
    return idbProxyableTypes ||
        (idbProxyableTypes = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction]);
}
// This is a function to prevent it throwing up in node environments.
function getCursorAdvanceMethods() {
    return cursorAdvanceMethods || (cursorAdvanceMethods = [
        IDBCursor.prototype.advance,
        IDBCursor.prototype.continue,
        IDBCursor.prototype.continuePrimaryKey,
    ]);
}
const cursorRequestMap = new WeakMap();
const transactionDoneMap = new WeakMap();
const transactionStoreNamesMap = new WeakMap();
const transformCache = new WeakMap();
const reverseTransformCache = new WeakMap();
function promisifyRequest(request) {
    const promise = new Promise((resolve, reject) => {
        const unlisten = () => {
            request.removeEventListener('success', success);
            request.removeEventListener('error', error);
        };
        const success = () => {
            resolve(wrap(request.result));
            unlisten();
        };
        const error = () => {
            reject(request.error);
            unlisten();
        };
        request.addEventListener('success', success);
        request.addEventListener('error', error);
    });
    promise.then((value) => {
        // Since cursoring reuses the IDBRequest (*sigh*), we cache it for later retrieval
        // (see wrapFunction).
        if (value instanceof IDBCursor) {
            cursorRequestMap.set(value, request);
        }
        // Catching to avoid "Uncaught Promise exceptions"
    }).catch(() => { });
    // This mapping exists in reverseTransformCache but doesn't doesn't exist in transformCache. This
    // is because we create many promises from a single IDBRequest.
    reverseTransformCache.set(promise, request);
    return promise;
}
function cacheDonePromiseForTransaction(tx) {
    // Early bail if we've already created a done promise for this transaction.
    if (transactionDoneMap.has(tx))
        return;
    const done = new Promise((resolve, reject) => {
        const unlisten = () => {
            tx.removeEventListener('complete', complete);
            tx.removeEventListener('error', error);
            tx.removeEventListener('abort', error);
        };
        const complete = () => {
            resolve();
            unlisten();
        };
        const error = () => {
            reject(tx.error);
            unlisten();
        };
        tx.addEventListener('complete', complete);
        tx.addEventListener('error', error);
        tx.addEventListener('abort', error);
    });
    // Cache it for later retrieval.
    transactionDoneMap.set(tx, done);
}
let idbProxyTraps = {
    get(target, prop, receiver) {
        if (target instanceof IDBTransaction) {
            // Special handling for transaction.done.
            if (prop === 'done')
                return transactionDoneMap.get(target);
            // Polyfill for objectStoreNames because of Edge.
            if (prop === 'objectStoreNames') {
                return target.objectStoreNames || transactionStoreNamesMap.get(target);
            }
            // Make tx.store return the only store in the transaction, or undefined if there are many.
            if (prop === 'store') {
                return receiver.objectStoreNames[1] ?
                    undefined : receiver.objectStore(receiver.objectStoreNames[0]);
            }
        }
        // Else transform whatever we get back.
        return wrap(target[prop]);
    },
    has(target, prop) {
        if (target instanceof IDBTransaction && (prop === 'done' || prop === 'store'))
            return true;
        return prop in target;
    },
};
function addTraps(callback) {
    idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
    // Due to expected object equality (which is enforced by the caching in `wrap`), we
    // only create one new func per func.
    // Edge doesn't support objectStoreNames (booo), so we polyfill it here.
    if (func === IDBDatabase.prototype.transaction &&
        !('objectStoreNames' in IDBTransaction.prototype)) {
        return function (storeNames, ...args) {
            const tx = func.call(unwrap(this), storeNames, ...args);
            transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
            return wrap(tx);
        };
    }
    // Cursor methods are special, as the behaviour is a little more different to standard IDB. In
    // IDB, you advance the cursor and wait for a new 'success' on the IDBRequest that gave you the
    // cursor. It's kinda like a promise that can resolve with many values. That doesn't make sense
    // with real promises, so each advance methods returns a new promise for the cursor object, or
    // undefined if the end of the cursor has been reached.
    if (getCursorAdvanceMethods().includes(func)) {
        return function (...args) {
            // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
            // the original object.
            func.apply(unwrap(this), args);
            return wrap(cursorRequestMap.get(this));
        };
    }
    return function (...args) {
        // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
        // the original object.
        return wrap(func.apply(unwrap(this), args));
    };
}
function transformCachableValue(value) {
    if (typeof value === 'function')
        return wrapFunction(value);
    // This doesn't return, it just creates a 'done' promise for the transaction,
    // which is later returned for transaction.done (see idbObjectHandler).
    if (value instanceof IDBTransaction)
        cacheDonePromiseForTransaction(value);
    if (instanceOfAny(value, getIdbProxyableTypes()))
        return new Proxy(value, idbProxyTraps);
    // Return the same value back if we're not going to transform it.
    return value;
}
function wrap(value) {
    // We sometimes generate multiple promises from a single IDBRequest (eg when cursoring), because
    // IDB is weird and a single IDBRequest can yield many responses, so these can't be cached.
    if (value instanceof IDBRequest)
        return promisifyRequest(value);
    // If we've already transformed this value before, reuse the transformed value.
    // This is faster, but it also provides object equality.
    if (transformCache.has(value))
        return transformCache.get(value);
    const newValue = transformCachableValue(value);
    // Not all types are transformed.
    // These may be primitive types, so they can't be WeakMap keys.
    if (newValue !== value) {
        transformCache.set(value, newValue);
        reverseTransformCache.set(newValue, value);
    }
    return newValue;
}
const unwrap = (value) => reverseTransformCache.get(value);




/***/ })
/******/ ]);
//# sourceMappingURL=respec-w3c.js.map