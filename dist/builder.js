// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }
      
      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module;

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module() {
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({3:[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],1:[function(require,module,exports) {
var __dirname = "/home/nilesh/respec/tools";
var process = require("process");
define(["module", "exports", "marcosc-async", "colors", "fs-extra", "loading-indicator", "path", "loading-indicator/presets", "requirejs", "command-line-args", "command-line-usage"], function (module, exports, async, colors, fsp, loading, path, presets, r, commandLineArgs, getUsage) {
  ///usr/bin/env node

  "use strict";

  colors.setTheme({
    error: "red",
    info: "green"
  });

  const optionList = [{
    alias: "h",
    defaultValue: false,
    description: "Display this usage guide.",
    name: "help",
    type: Boolean
  }, {
    alias: "p",
    defaultOption: true,
    description: "Name of profile to build. Profile must be " + "in the js/ folder, and start with 'profile-' (e.g., profile-w3c-common.js)",
    multiple: false,
    name: "profile",
    type: String
  }];

  const usageSections = [{
    header: "builder",
    content: "Builder builds a ReSpec profile"
  }, {
    header: "Options",
    optionList
  }, {
    header: "Examples",
    content: [{
      desc: "1. Build W3C Profile ",
      example: "$ ./tools/builder.js --profile=w3c-common"
    }]
  }, {
    content: "Project home: [underline]{https://github.com/w3c/respec}",
    raw: true
  }];

  /**
   * Async function that appends the boilerplate to the generated script
   * and writes out the result. It also creates the source map file.
   *
   * @private
   * @param  {String} outPath Where to write the output to.
   * @param  {String} version The version of the script.
   * @return {Promise} Resolves when done writing the files.
   */
  function appendBoilerplate(outPath, version, name) {
    return async(function* (optimizedJs, sourceMap) {
      const respecJs = `"use strict";
/* ReSpec ${version}
Created by Robin Berjon, http://berjon.com/ (@robinberjon)
Documentation: http://w3.org/respec/.
See original source for licenses: https://github.com/w3c/respec */
window.respecVersion = "${version}";
${optimizedJs}
require(['profile-${name}']);`;
      if ("error" in result) {
        throw new Error(result.error);
      }
      const mapPath = path.dirname(outPath) + `/respec-${name}.build.js.map`;
      const promiseToWriteJs = fsp.writeFile(outPath, result.code, "utf-8");
      const promiseToWriteMap = fsp.writeFile(mapPath, sourceMap, "utf-8");
      yield Promise.all([promiseToWriteJs, promiseToWriteMap]);
    }, Builder);
  }

  const Builder = {
    /**
     * Async function that gets the current version of ReSpec from package.json
     *
     * @returns {Promise<String>} The version string.
     */
    getRespecVersion: async(function* () {
      const packagePath = path.join(__dirname, "../package.json");
      const content = yield fsp.readFile(packagePath, "utf-8");
      return JSON.parse(content).version;
    }),

    /**
     * Async function runs Requirejs' optimizer to generate the output.
     *
     * using a custom configuration.
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    build({ name }) {
      if (!name) {
        throw new TypeError("name is required");
      }
      const buildPath = path.join(__dirname, "../builds");
      const outFile = `respec-${name}.js`;
      const outPath = path.join(buildPath, outFile);
      const loadingMsg = colors.info(` Generating ${outFile}. Please wait... `);
      const timer = loading.start(loadingMsg, {
        frames: presets.clock,
        delay: 1
      });
      return async.task(function* () {
        // optimisation settings
        const buildVersion = yield this.getRespecVersion();
        const outputWritter = appendBoilerplate(outPath, buildVersion, name);
        const config = {
          baseUrl: path.join(__dirname, "../js/"),
          deps: ["deps/require"],
          generateSourceMaps: true,
          inlineText: true,
          logLevel: 2, // Show uglify warnings and errors.
          mainConfigFile: `js/profile-${name}.js`,
          name: `profile-${name}`,
          optimize: "none",
          preserveLicenseComments: false,
          useStrict: true
        };
        const promiseToWrite = new Promise((resolve, reject) => {
          config.out = (concatinatedJS, sourceMap) => {
            outputWritter(concatinatedJS, sourceMap).then(resolve).catch(reject);
          };
        });
        r.optimize(config);
        const buildDir = path.resolve(__dirname, "../builds/");
        const workerDir = path.resolve(__dirname, "../worker/");
        // copy respec-worker
        fsp.createReadStream(`${workerDir}/respec-worker.js`).pipe(fsp.createWriteStream(`${buildDir}/respec-worker.js`));
        yield promiseToWrite;
        loading.stop(timer);
      }, this);
    }
  };

  exports.Builder = Builder;
  if (require.main === module) {
    async.task(function* run() {
      let parsedArgs;
      try {
        parsedArgs = commandLineArgs(optionList);
      } catch (err) {
        console.info(getUsage(usageSections));
        console.error(colors.error(err.stack));
        return process.exit(127);
      }
      if (parsedArgs.help) {
        console.info(getUsage(usageSections));
        return process.exit(0);
      }
      const { profile: name } = parsedArgs;
      if (!name) {
        return;
      }
      try {
        yield Builder.build({ name });
      } catch (err) {
        console.error(colors.error(err.stack));
        return process.exit(1);
      }
      process.exit(0);
    });
  }
});
},{"process":3}],5:[function(require,module,exports) {

var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module() {
  OldModule.call(this);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

if (!module.bundle.parent && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var ws = new WebSocket('ws://' + hostname + ':' + '44303' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id);
  });
}
},{}]},{},[5,1])
//# sourceMappingURL=/dist/builder.map