"use strict";
/* ReSpec 3.2.97
Created by Robin Berjon, http://berjon.com/ (@robinberjon)
Documentation: http://w3.org/respec/.
See original source for licenses: https://github.com/w3c/respec */
window.respecVersion = 3.2.97;
/** vim: et:ts=4:sw=4:sts=4
 * @license RequireJS 2.1.22 Copyright (c) 2010-2015, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */
//Not using strict: uneven strict support in browsers, #392, and causes
//problems with requirejs.exec()/transpiler plugins that may not be strict.
/*jslint regexp: true, nomen: true, sloppy: true */
/*global window, navigator, document, importScripts, setTimeout, opera */

var requirejs, require, define;
(function (global) {
    var req, s, head, baseElement, dataMain, src,
        interactiveScript, currentlyAddingScript, mainScript, subPath,
        version = '2.1.22',
        commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,
        cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
        jsSuffixRegExp = /\.js$/,
        currDirRegExp = /^\.\//,
        op = Object.prototype,
        ostring = op.toString,
        hasOwn = op.hasOwnProperty,
        ap = Array.prototype,
        isBrowser = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && window.document),
        isWebWorker = !isBrowser && typeof importScripts !== 'undefined',
        //PS3 indicates loaded and complete, but need to wait for complete
        //specifically. Sequence is 'loading', 'loaded', execution,
        // then 'complete'. The UA check is unfortunate, but not sure how
        //to feature test w/o causing perf issues.
        readyRegExp = isBrowser && navigator.platform === 'PLAYSTATION 3' ?
                      /^complete$/ : /^(complete|loaded)$/,
        defContextName = '_',
        //Oh the tragedy, detecting opera. See the usage of isOpera for reason.
        isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]',
        contexts = {},
        cfg = {},
        globalDefQueue = [],
        useInteractive = false;

    function isFunction(it) {
        return ostring.call(it) === '[object Function]';
    }

    function isArray(it) {
        return ostring.call(it) === '[object Array]';
    }

    /**
     * Helper function for iterating over an array. If the func returns
     * a true value, it will break out of the loop.
     */
    function each(ary, func) {
        if (ary) {
            var i;
            for (i = 0; i < ary.length; i += 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }

    /**
     * Helper function for iterating over an array backwards. If the func
     * returns a true value, it will break out of the loop.
     */
    function eachReverse(ary, func) {
        if (ary) {
            var i;
            for (i = ary.length - 1; i > -1; i -= 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    function getOwn(obj, prop) {
        return hasProp(obj, prop) && obj[prop];
    }

    /**
     * Cycles over properties in an object and calls a function for each
     * property value. If the function returns a truthy value, then the
     * iteration is stopped.
     */
    function eachProp(obj, func) {
        var prop;
        for (prop in obj) {
            if (hasProp(obj, prop)) {
                if (func(obj[prop], prop)) {
                    break;
                }
            }
        }
    }

    /**
     * Simple function to mix in properties from source into target,
     * but only if target does not already have a property of the same name.
     */
    function mixin(target, source, force, deepStringMixin) {
        if (source) {
            eachProp(source, function (value, prop) {
                if (force || !hasProp(target, prop)) {
                    if (deepStringMixin && typeof value === 'object' && value &&
                        !isArray(value) && !isFunction(value) &&
                        !(value instanceof RegExp)) {

                        if (!target[prop]) {
                            target[prop] = {};
                        }
                        mixin(target[prop], value, force, deepStringMixin);
                    } else {
                        target[prop] = value;
                    }
                }
            });
        }
        return target;
    }

    //Similar to Function.prototype.bind, but the 'this' object is specified
    //first, since it is easier to read/figure out what 'this' will be.
    function bind(obj, fn) {
        return function () {
            return fn.apply(obj, arguments);
        };
    }

    function scripts() {
        return document.getElementsByTagName('script');
    }

    function defaultOnError(err) {
        throw err;
    }

    //Allow getting a global that is expressed in
    //dot notation, like 'a.b.c'.
    function getGlobal(value) {
        if (!value) {
            return value;
        }
        var g = global;
        each(value.split('.'), function (part) {
            g = g[part];
        });
        return g;
    }

    /**
     * Constructs an error with a pointer to an URL with more information.
     * @param {String} id the error ID that maps to an ID on a web page.
     * @param {String} message human readable error.
     * @param {Error} [err] the original error, if there is one.
     *
     * @returns {Error}
     */
    function makeError(id, msg, err, requireModules) {
        var e = new Error(msg + '\nhttp://requirejs.org/docs/errors.html#' + id);
        e.requireType = id;
        e.requireModules = requireModules;
        if (err) {
            e.originalError = err;
        }
        return e;
    }

    if (typeof define !== 'undefined') {
        //If a define is already in play via another AMD loader,
        //do not overwrite.
        return;
    }

    if (typeof requirejs !== 'undefined') {
        if (isFunction(requirejs)) {
            //Do not overwrite an existing requirejs instance.
            return;
        }
        cfg = requirejs;
        requirejs = undefined;
    }

    //Allow for a require config object
    if (typeof require !== 'undefined' && !isFunction(require)) {
        //assume it is a config object.
        cfg = require;
        require = undefined;
    }

    function newContext(contextName) {
        var inCheckLoaded, Module, context, handlers,
            checkLoadedTimeoutId,
            config = {
                //Defaults. Do not set a default for map
                //config to speed up normalize(), which
                //will run faster if there is no default.
                waitSeconds: 7,
                baseUrl: './',
                paths: {},
                bundles: {},
                pkgs: {},
                shim: {},
                config: {}
            },
            registry = {},
            //registry of just enabled modules, to speed
            //cycle breaking code when lots of modules
            //are registered, but not activated.
            enabledRegistry = {},
            undefEvents = {},
            defQueue = [],
            defined = {},
            urlFetched = {},
            bundlesMap = {},
            requireCounter = 1,
            unnormalizedCounter = 1;

        /**
         * Trims the . and .. from an array of path segments.
         * It will keep a leading path segment if a .. will become
         * the first path segment, to help with module name lookups,
         * which act like paths, but can be remapped. But the end result,
         * all paths that use this function should look normalized.
         * NOTE: this method MODIFIES the input array.
         * @param {Array} ary the array of path segments.
         */
        function trimDots(ary) {
            var i, part;
            for (i = 0; i < ary.length; i++) {
                part = ary[i];
                if (part === '.') {
                    ary.splice(i, 1);
                    i -= 1;
                } else if (part === '..') {
                    // If at the start, or previous value is still ..,
                    // keep them so that when converted to a path it may
                    // still work when converted to a path, even though
                    // as an ID it is less than ideal. In larger point
                    // releases, may be better to just kick out an error.
                    if (i === 0 || (i === 1 && ary[2] === '..') || ary[i - 1] === '..') {
                        continue;
                    } else if (i > 0) {
                        ary.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
        }

        /**
         * Given a relative module name, like ./something, normalize it to
         * a real name that can be mapped to a path.
         * @param {String} name the relative name
         * @param {String} baseName a real name that the name arg is relative
         * to.
         * @param {Boolean} applyMap apply the map config to the value. Should
         * only be done if this normalization is for a dependency ID.
         * @returns {String} normalized name
         */
        function normalize(name, baseName, applyMap) {
            var pkgMain, mapValue, nameParts, i, j, nameSegment, lastIndex,
                foundMap, foundI, foundStarMap, starI, normalizedBaseParts,
                baseParts = (baseName && baseName.split('/')),
                map = config.map,
                starMap = map && map['*'];

            //Adjust any relative paths.
            if (name) {
                name = name.split('/');
                lastIndex = name.length - 1;

                // If wanting node ID compatibility, strip .js from end
                // of IDs. Have to do this here, and not in nameToUrl
                // because node allows either .js or non .js to map
                // to same file.
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                // Starts with a '.' so need the baseName
                if (name[0].charAt(0) === '.' && baseParts) {
                    //Convert baseName to array, and lop off the last part,
                    //so that . matches that 'directory' and not name of the baseName's
                    //module. For instance, baseName of 'one/two/three', maps to
                    //'one/two/three.js', but we want the directory, 'one/two' for
                    //this normalization.
                    normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                    name = normalizedBaseParts.concat(name);
                }

                trimDots(name);
                name = name.join('/');
            }

            //Apply map config if available.
            if (applyMap && map && (baseParts || starMap)) {
                nameParts = name.split('/');

                outerLoop: for (i = nameParts.length; i > 0; i -= 1) {
                    nameSegment = nameParts.slice(0, i).join('/');

                    if (baseParts) {
                        //Find the longest baseName segment match in the config.
                        //So, do joins on the biggest to smallest lengths of baseParts.
                        for (j = baseParts.length; j > 0; j -= 1) {
                            mapValue = getOwn(map, baseParts.slice(0, j).join('/'));

                            //baseName segment has config, find if it has one for
                            //this name.
                            if (mapValue) {
                                mapValue = getOwn(mapValue, nameSegment);
                                if (mapValue) {
                                    //Match, update name to the new value.
                                    foundMap = mapValue;
                                    foundI = i;
                                    break outerLoop;
                                }
                            }
                        }
                    }

                    //Check for a star map match, but just hold on to it,
                    //if there is a shorter segment match later in a matching
                    //config, then favor over this star map.
                    if (!foundStarMap && starMap && getOwn(starMap, nameSegment)) {
                        foundStarMap = getOwn(starMap, nameSegment);
                        starI = i;
                    }
                }

                if (!foundMap && foundStarMap) {
                    foundMap = foundStarMap;
                    foundI = starI;
                }

                if (foundMap) {
                    nameParts.splice(0, foundI, foundMap);
                    name = nameParts.join('/');
                }
            }

            // If the name points to a package's name, use
            // the package main instead.
            pkgMain = getOwn(config.pkgs, name);

            return pkgMain ? pkgMain : name;
        }

        function removeScript(name) {
            if (isBrowser) {
                each(scripts(), function (scriptNode) {
                    if (scriptNode.getAttribute('data-requiremodule') === name &&
                            scriptNode.getAttribute('data-requirecontext') === context.contextName) {
                        scriptNode.parentNode.removeChild(scriptNode);
                        return true;
                    }
                });
            }
        }

        function hasPathFallback(id) {
            var pathConfig = getOwn(config.paths, id);
            if (pathConfig && isArray(pathConfig) && pathConfig.length > 1) {
                //Pop off the first array value, since it failed, and
                //retry
                pathConfig.shift();
                context.require.undef(id);

                //Custom require that does not do map translation, since
                //ID is "absolute", already mapped/resolved.
                context.makeRequire(null, {
                    skipMap: true
                })([id]);

                return true;
            }
        }

        //Turns a plugin!resource to [plugin, resource]
        //with the plugin being undefined if the name
        //did not have a plugin prefix.
        function splitPrefix(name) {
            var prefix,
                index = name ? name.indexOf('!') : -1;
            if (index > -1) {
                prefix = name.substring(0, index);
                name = name.substring(index + 1, name.length);
            }
            return [prefix, name];
        }

        /**
         * Creates a module mapping that includes plugin prefix, module
         * name, and path. If parentModuleMap is provided it will
         * also normalize the name via require.normalize()
         *
         * @param {String} name the module name
         * @param {String} [parentModuleMap] parent module map
         * for the module name, used to resolve relative names.
         * @param {Boolean} isNormalized: is the ID already normalized.
         * This is true if this call is done for a define() module ID.
         * @param {Boolean} applyMap: apply the map config to the ID.
         * Should only be true if this map is for a dependency.
         *
         * @returns {Object}
         */
        function makeModuleMap(name, parentModuleMap, isNormalized, applyMap) {
            var url, pluginModule, suffix, nameParts,
                prefix = null,
                parentName = parentModuleMap ? parentModuleMap.name : null,
                originalName = name,
                isDefine = true,
                normalizedName = '';

            //If no name, then it means it is a require call, generate an
            //internal name.
            if (!name) {
                isDefine = false;
                name = '_@r' + (requireCounter += 1);
            }

            nameParts = splitPrefix(name);
            prefix = nameParts[0];
            name = nameParts[1];

            if (prefix) {
                prefix = normalize(prefix, parentName, applyMap);
                pluginModule = getOwn(defined, prefix);
            }

            //Account for relative paths if there is a base name.
            if (name) {
                if (prefix) {
                    if (pluginModule && pluginModule.normalize) {
                        //Plugin is loaded, use its normalize method.
                        normalizedName = pluginModule.normalize(name, function (name) {
                            return normalize(name, parentName, applyMap);
                        });
                    } else {
                        // If nested plugin references, then do not try to
                        // normalize, as it will not normalize correctly. This
                        // places a restriction on resourceIds, and the longer
                        // term solution is not to normalize until plugins are
                        // loaded and all normalizations to allow for async
                        // loading of a loader plugin. But for now, fixes the
                        // common uses. Details in #1131
                        normalizedName = name.indexOf('!') === -1 ?
                                         normalize(name, parentName, applyMap) :
                                         name;
                    }
                } else {
                    //A regular module.
                    normalizedName = normalize(name, parentName, applyMap);

                    //Normalized name may be a plugin ID due to map config
                    //application in normalize. The map config values must
                    //already be normalized, so do not need to redo that part.
                    nameParts = splitPrefix(normalizedName);
                    prefix = nameParts[0];
                    normalizedName = nameParts[1];
                    isNormalized = true;

                    url = context.nameToUrl(normalizedName);
                }
            }

            //If the id is a plugin id that cannot be determined if it needs
            //normalization, stamp it with a unique ID so two matching relative
            //ids that may conflict can be separate.
            suffix = prefix && !pluginModule && !isNormalized ?
                     '_unnormalized' + (unnormalizedCounter += 1) :
                     '';

            return {
                prefix: prefix,
                name: normalizedName,
                parentMap: parentModuleMap,
                unnormalized: !!suffix,
                url: url,
                originalName: originalName,
                isDefine: isDefine,
                id: (prefix ?
                        prefix + '!' + normalizedName :
                        normalizedName) + suffix
            };
        }

        function getModule(depMap) {
            var id = depMap.id,
                mod = getOwn(registry, id);

            if (!mod) {
                mod = registry[id] = new context.Module(depMap);
            }

            return mod;
        }

        function on(depMap, name, fn) {
            var id = depMap.id,
                mod = getOwn(registry, id);

            if (hasProp(defined, id) &&
                    (!mod || mod.defineEmitComplete)) {
                if (name === 'defined') {
                    fn(defined[id]);
                }
            } else {
                mod = getModule(depMap);
                if (mod.error && name === 'error') {
                    fn(mod.error);
                } else {
                    mod.on(name, fn);
                }
            }
        }

        function onError(err, errback) {
            var ids = err.requireModules,
                notified = false;

            if (errback) {
                errback(err);
            } else {
                each(ids, function (id) {
                    var mod = getOwn(registry, id);
                    if (mod) {
                        //Set error on module, so it skips timeout checks.
                        mod.error = err;
                        if (mod.events.error) {
                            notified = true;
                            mod.emit('error', err);
                        }
                    }
                });

                if (!notified) {
                    req.onError(err);
                }
            }
        }

        /**
         * Internal method to transfer globalQueue items to this context's
         * defQueue.
         */
        function takeGlobalQueue() {
            //Push all the globalDefQueue items into the context's defQueue
            if (globalDefQueue.length) {
                each(globalDefQueue, function(queueItem) {
                    var id = queueItem[0];
                    if (typeof id === 'string') {
                        context.defQueueMap[id] = true;
                    }
                    defQueue.push(queueItem);
                });
                globalDefQueue = [];
            }
        }

        handlers = {
            'require': function (mod) {
                if (mod.require) {
                    return mod.require;
                } else {
                    return (mod.require = context.makeRequire(mod.map));
                }
            },
            'exports': function (mod) {
                mod.usingExports = true;
                if (mod.map.isDefine) {
                    if (mod.exports) {
                        return (defined[mod.map.id] = mod.exports);
                    } else {
                        return (mod.exports = defined[mod.map.id] = {});
                    }
                }
            },
            'module': function (mod) {
                if (mod.module) {
                    return mod.module;
                } else {
                    return (mod.module = {
                        id: mod.map.id,
                        uri: mod.map.url,
                        config: function () {
                            return getOwn(config.config, mod.map.id) || {};
                        },
                        exports: mod.exports || (mod.exports = {})
                    });
                }
            }
        };

        function cleanRegistry(id) {
            //Clean up machinery used for waiting modules.
            delete registry[id];
            delete enabledRegistry[id];
        }

        function breakCycle(mod, traced, processed) {
            var id = mod.map.id;

            if (mod.error) {
                mod.emit('error', mod.error);
            } else {
                traced[id] = true;
                each(mod.depMaps, function (depMap, i) {
                    var depId = depMap.id,
                        dep = getOwn(registry, depId);

                    //Only force things that have not completed
                    //being defined, so still in the registry,
                    //and only if it has not been matched up
                    //in the module already.
                    if (dep && !mod.depMatched[i] && !processed[depId]) {
                        if (getOwn(traced, depId)) {
                            mod.defineDep(i, defined[depId]);
                            mod.check(); //pass false?
                        } else {
                            breakCycle(dep, traced, processed);
                        }
                    }
                });
                processed[id] = true;
            }
        }

        function checkLoaded() {
            var err, usingPathFallback,
                waitInterval = config.waitSeconds * 1000,
                //It is possible to disable the wait interval by using waitSeconds of 0.
                expired = waitInterval && (context.startTime + waitInterval) < new Date().getTime(),
                noLoads = [],
                reqCalls = [],
                stillLoading = false,
                needCycleCheck = true;

            //Do not bother if this call was a result of a cycle break.
            if (inCheckLoaded) {
                return;
            }

            inCheckLoaded = true;

            //Figure out the state of all the modules.
            eachProp(enabledRegistry, function (mod) {
                var map = mod.map,
                    modId = map.id;

                //Skip things that are not enabled or in error state.
                if (!mod.enabled) {
                    return;
                }

                if (!map.isDefine) {
                    reqCalls.push(mod);
                }

                if (!mod.error) {
                    //If the module should be executed, and it has not
                    //been inited and time is up, remember it.
                    if (!mod.inited && expired) {
                        if (hasPathFallback(modId)) {
                            usingPathFallback = true;
                            stillLoading = true;
                        } else {
                            noLoads.push(modId);
                            removeScript(modId);
                        }
                    } else if (!mod.inited && mod.fetched && map.isDefine) {
                        stillLoading = true;
                        if (!map.prefix) {
                            //No reason to keep looking for unfinished
                            //loading. If the only stillLoading is a
                            //plugin resource though, keep going,
                            //because it may be that a plugin resource
                            //is waiting on a non-plugin cycle.
                            return (needCycleCheck = false);
                        }
                    }
                }
            });

            if (expired && noLoads.length) {
                //If wait time expired, throw error of unloaded modules.
                err = makeError('timeout', 'Load timeout for modules: ' + noLoads, null, noLoads);
                err.contextName = context.contextName;
                return onError(err);
            }

            //Not expired, check for a cycle.
            if (needCycleCheck) {
                each(reqCalls, function (mod) {
                    breakCycle(mod, {}, {});
                });
            }

            //If still waiting on loads, and the waiting load is something
            //other than a plugin resource, or there are still outstanding
            //scripts, then just try back later.
            if ((!expired || usingPathFallback) && stillLoading) {
                //Something is still waiting to load. Wait for it, but only
                //if a timeout is not already in effect.
                if ((isBrowser || isWebWorker) && !checkLoadedTimeoutId) {
                    checkLoadedTimeoutId = setTimeout(function () {
                        checkLoadedTimeoutId = 0;
                        checkLoaded();
                    }, 50);
                }
            }

            inCheckLoaded = false;
        }

        Module = function (map) {
            this.events = getOwn(undefEvents, map.id) || {};
            this.map = map;
            this.shim = getOwn(config.shim, map.id);
            this.depExports = [];
            this.depMaps = [];
            this.depMatched = [];
            this.pluginMaps = {};
            this.depCount = 0;

            /* this.exports this.factory
               this.depMaps = [],
               this.enabled, this.fetched
            */
        };

        Module.prototype = {
            init: function (depMaps, factory, errback, options) {
                options = options || {};

                //Do not do more inits if already done. Can happen if there
                //are multiple define calls for the same module. That is not
                //a normal, common case, but it is also not unexpected.
                if (this.inited) {
                    return;
                }

                this.factory = factory;

                if (errback) {
                    //Register for errors on this module.
                    this.on('error', errback);
                } else if (this.events.error) {
                    //If no errback already, but there are error listeners
                    //on this module, set up an errback to pass to the deps.
                    errback = bind(this, function (err) {
                        this.emit('error', err);
                    });
                }

                //Do a copy of the dependency array, so that
                //source inputs are not modified. For example
                //"shim" deps are passed in here directly, and
                //doing a direct modification of the depMaps array
                //would affect that config.
                this.depMaps = depMaps && depMaps.slice(0);

                this.errback = errback;

                //Indicate this module has be initialized
                this.inited = true;

                this.ignore = options.ignore;

                //Could have option to init this module in enabled mode,
                //or could have been previously marked as enabled. However,
                //the dependencies are not known until init is called. So
                //if enabled previously, now trigger dependencies as enabled.
                if (options.enabled || this.enabled) {
                    //Enable this module and dependencies.
                    //Will call this.check()
                    this.enable();
                } else {
                    this.check();
                }
            },

            defineDep: function (i, depExports) {
                //Because of cycles, defined callback for a given
                //export can be called more than once.
                if (!this.depMatched[i]) {
                    this.depMatched[i] = true;
                    this.depCount -= 1;
                    this.depExports[i] = depExports;
                }
            },

            fetch: function () {
                if (this.fetched) {
                    return;
                }
                this.fetched = true;

                context.startTime = (new Date()).getTime();

                var map = this.map;

                //If the manager is for a plugin managed resource,
                //ask the plugin to load it now.
                if (this.shim) {
                    context.makeRequire(this.map, {
                        enableBuildCallback: true
                    })(this.shim.deps || [], bind(this, function () {
                        return map.prefix ? this.callPlugin() : this.load();
                    }));
                } else {
                    //Regular dependency.
                    return map.prefix ? this.callPlugin() : this.load();
                }
            },

            load: function () {
                var url = this.map.url;

                //Regular dependency.
                if (!urlFetched[url]) {
                    urlFetched[url] = true;
                    context.load(this.map.id, url);
                }
            },

            /**
             * Checks if the module is ready to define itself, and if so,
             * define it.
             */
            check: function () {
                if (!this.enabled || this.enabling) {
                    return;
                }

                var err, cjsModule,
                    id = this.map.id,
                    depExports = this.depExports,
                    exports = this.exports,
                    factory = this.factory;

                if (!this.inited) {
                    // Only fetch if not already in the defQueue.
                    if (!hasProp(context.defQueueMap, id)) {
                        this.fetch();
                    }
                } else if (this.error) {
                    this.emit('error', this.error);
                } else if (!this.defining) {
                    //The factory could trigger another require call
                    //that would result in checking this module to
                    //define itself again. If already in the process
                    //of doing that, skip this work.
                    this.defining = true;

                    if (this.depCount < 1 && !this.defined) {
                        if (isFunction(factory)) {
                            try {
                                exports = context.execCb(id, factory, depExports, exports);
                            } catch (e) {
                                err = e;
                            }

                            // Favor return value over exports. If node/cjs in play,
                            // then will not have a return value anyway. Favor
                            // module.exports assignment over exports object.
                            if (this.map.isDefine && exports === undefined) {
                                cjsModule = this.module;
                                if (cjsModule) {
                                    exports = cjsModule.exports;
                                } else if (this.usingExports) {
                                    //exports already set the defined value.
                                    exports = this.exports;
                                }
                            }

                            if (err) {
                                // If there is an error listener, favor passing
                                // to that instead of throwing an error. However,
                                // only do it for define()'d  modules. require
                                // errbacks should not be called for failures in
                                // their callbacks (#699). However if a global
                                // onError is set, use that.
                                if ((this.events.error && this.map.isDefine) ||
                                    req.onError !== defaultOnError) {
                                    err.requireMap = this.map;
                                    err.requireModules = this.map.isDefine ? [this.map.id] : null;
                                    err.requireType = this.map.isDefine ? 'define' : 'require';
                                    return onError((this.error = err));
                                } else if (typeof console !== 'undefined' &&
                                           console.error) {
                                    // Log the error for debugging. If promises could be
                                    // used, this would be different, but making do.
                                    console.error(err);
                                } else {
                                    // Do not want to completely lose the error. While this
                                    // will mess up processing and lead to similar results
                                    // as bug 1440, it at least surfaces the error.
                                    req.onError(err);
                                }
                            }
                        } else {
                            //Just a literal value
                            exports = factory;
                        }

                        this.exports = exports;

                        if (this.map.isDefine && !this.ignore) {
                            defined[id] = exports;

                            if (req.onResourceLoad) {
                                var resLoadMaps = [];
                                each(this.depMaps, function (depMap) {
                                    resLoadMaps.push(depMap.normalizedMap || depMap);
                                });
                                req.onResourceLoad(context, this.map, resLoadMaps);
                            }
                        }

                        //Clean up
                        cleanRegistry(id);

                        this.defined = true;
                    }

                    //Finished the define stage. Allow calling check again
                    //to allow define notifications below in the case of a
                    //cycle.
                    this.defining = false;

                    if (this.defined && !this.defineEmitted) {
                        this.defineEmitted = true;
                        this.emit('defined', this.exports);
                        this.defineEmitComplete = true;
                    }

                }
            },

            callPlugin: function () {
                var map = this.map,
                    id = map.id,
                    //Map already normalized the prefix.
                    pluginMap = makeModuleMap(map.prefix);

                //Mark this as a dependency for this plugin, so it
                //can be traced for cycles.
                this.depMaps.push(pluginMap);

                on(pluginMap, 'defined', bind(this, function (plugin) {
                    var load, normalizedMap, normalizedMod,
                        bundleId = getOwn(bundlesMap, this.map.id),
                        name = this.map.name,
                        parentName = this.map.parentMap ? this.map.parentMap.name : null,
                        localRequire = context.makeRequire(map.parentMap, {
                            enableBuildCallback: true
                        });

                    //If current map is not normalized, wait for that
                    //normalized name to load instead of continuing.
                    if (this.map.unnormalized) {
                        //Normalize the ID if the plugin allows it.
                        if (plugin.normalize) {
                            name = plugin.normalize(name, function (name) {
                                return normalize(name, parentName, true);
                            }) || '';
                        }

                        //prefix and name should already be normalized, no need
                        //for applying map config again either.
                        normalizedMap = makeModuleMap(map.prefix + '!' + name,
                                                      this.map.parentMap);
                        on(normalizedMap,
                            'defined', bind(this, function (value) {
                                this.map.normalizedMap = normalizedMap;
                                this.init([], function () { return value; }, null, {
                                    enabled: true,
                                    ignore: true
                                });
                            }));

                        normalizedMod = getOwn(registry, normalizedMap.id);
                        if (normalizedMod) {
                            //Mark this as a dependency for this plugin, so it
                            //can be traced for cycles.
                            this.depMaps.push(normalizedMap);

                            if (this.events.error) {
                                normalizedMod.on('error', bind(this, function (err) {
                                    this.emit('error', err);
                                }));
                            }
                            normalizedMod.enable();
                        }

                        return;
                    }

                    //If a paths config, then just load that file instead to
                    //resolve the plugin, as it is built into that paths layer.
                    if (bundleId) {
                        this.map.url = context.nameToUrl(bundleId);
                        this.load();
                        return;
                    }

                    load = bind(this, function (value) {
                        this.init([], function () { return value; }, null, {
                            enabled: true
                        });
                    });

                    load.error = bind(this, function (err) {
                        this.inited = true;
                        this.error = err;
                        err.requireModules = [id];

                        //Remove temp unnormalized modules for this module,
                        //since they will never be resolved otherwise now.
                        eachProp(registry, function (mod) {
                            if (mod.map.id.indexOf(id + '_unnormalized') === 0) {
                                cleanRegistry(mod.map.id);
                            }
                        });

                        onError(err);
                    });

                    //Allow plugins to load other code without having to know the
                    //context or how to 'complete' the load.
                    load.fromText = bind(this, function (text, textAlt) {
                        /*jslint evil: true */
                        var moduleName = map.name,
                            moduleMap = makeModuleMap(moduleName),
                            hasInteractive = useInteractive;

                        //As of 2.1.0, support just passing the text, to reinforce
                        //fromText only being called once per resource. Still
                        //support old style of passing moduleName but discard
                        //that moduleName in favor of the internal ref.
                        if (textAlt) {
                            text = textAlt;
                        }

                        //Turn off interactive script matching for IE for any define
                        //calls in the text, then turn it back on at the end.
                        if (hasInteractive) {
                            useInteractive = false;
                        }

                        //Prime the system by creating a module instance for
                        //it.
                        getModule(moduleMap);

                        //Transfer any config to this other module.
                        if (hasProp(config.config, id)) {
                            config.config[moduleName] = config.config[id];
                        }

                        try {
                            req.exec(text);
                        } catch (e) {
                            return onError(makeError('fromtexteval',
                                             'fromText eval for ' + id +
                                            ' failed: ' + e,
                                             e,
                                             [id]));
                        }

                        if (hasInteractive) {
                            useInteractive = true;
                        }

                        //Mark this as a dependency for the plugin
                        //resource
                        this.depMaps.push(moduleMap);

                        //Support anonymous modules.
                        context.completeLoad(moduleName);

                        //Bind the value of that module to the value for this
                        //resource ID.
                        localRequire([moduleName], load);
                    });

                    //Use parentName here since the plugin's name is not reliable,
                    //could be some weird string with no path that actually wants to
                    //reference the parentName's path.
                    plugin.load(map.name, localRequire, load, config);
                }));

                context.enable(pluginMap, this);
                this.pluginMaps[pluginMap.id] = pluginMap;
            },

            enable: function () {
                enabledRegistry[this.map.id] = this;
                this.enabled = true;

                //Set flag mentioning that the module is enabling,
                //so that immediate calls to the defined callbacks
                //for dependencies do not trigger inadvertent load
                //with the depCount still being zero.
                this.enabling = true;

                //Enable each dependency
                each(this.depMaps, bind(this, function (depMap, i) {
                    var id, mod, handler;

                    if (typeof depMap === 'string') {
                        //Dependency needs to be converted to a depMap
                        //and wired up to this module.
                        depMap = makeModuleMap(depMap,
                                               (this.map.isDefine ? this.map : this.map.parentMap),
                                               false,
                                               !this.skipMap);
                        this.depMaps[i] = depMap;

                        handler = getOwn(handlers, depMap.id);

                        if (handler) {
                            this.depExports[i] = handler(this);
                            return;
                        }

                        this.depCount += 1;

                        on(depMap, 'defined', bind(this, function (depExports) {
                            if (this.undefed) {
                                return;
                            }
                            this.defineDep(i, depExports);
                            this.check();
                        }));

                        if (this.errback) {
                            on(depMap, 'error', bind(this, this.errback));
                        } else if (this.events.error) {
                            // No direct errback on this module, but something
                            // else is listening for errors, so be sure to
                            // propagate the error correctly.
                            on(depMap, 'error', bind(this, function(err) {
                                this.emit('error', err);
                            }));
                        }
                    }

                    id = depMap.id;
                    mod = registry[id];

                    //Skip special modules like 'require', 'exports', 'module'
                    //Also, don't call enable if it is already enabled,
                    //important in circular dependency cases.
                    if (!hasProp(handlers, id) && mod && !mod.enabled) {
                        context.enable(depMap, this);
                    }
                }));

                //Enable each plugin that is used in
                //a dependency
                eachProp(this.pluginMaps, bind(this, function (pluginMap) {
                    var mod = getOwn(registry, pluginMap.id);
                    if (mod && !mod.enabled) {
                        context.enable(pluginMap, this);
                    }
                }));

                this.enabling = false;

                this.check();
            },

            on: function (name, cb) {
                var cbs = this.events[name];
                if (!cbs) {
                    cbs = this.events[name] = [];
                }
                cbs.push(cb);
            },

            emit: function (name, evt) {
                each(this.events[name], function (cb) {
                    cb(evt);
                });
                if (name === 'error') {
                    //Now that the error handler was triggered, remove
                    //the listeners, since this broken Module instance
                    //can stay around for a while in the registry.
                    delete this.events[name];
                }
            }
        };

        function callGetModule(args) {
            //Skip modules already defined.
            if (!hasProp(defined, args[0])) {
                getModule(makeModuleMap(args[0], null, true)).init(args[1], args[2]);
            }
        }

        function removeListener(node, func, name, ieName) {
            //Favor detachEvent because of IE9
            //issue, see attachEvent/addEventListener comment elsewhere
            //in this file.
            if (node.detachEvent && !isOpera) {
                //Probably IE. If not it will throw an error, which will be
                //useful to know.
                if (ieName) {
                    node.detachEvent(ieName, func);
                }
            } else {
                node.removeEventListener(name, func, false);
            }
        }

        /**
         * Given an event from a script node, get the requirejs info from it,
         * and then removes the event listeners on the node.
         * @param {Event} evt
         * @returns {Object}
         */
        function getScriptData(evt) {
            //Using currentTarget instead of target for Firefox 2.0's sake. Not
            //all old browsers will be supported, but this one was easy enough
            //to support and still makes sense.
            var node = evt.currentTarget || evt.srcElement;

            //Remove the listeners once here.
            removeListener(node, context.onScriptLoad, 'load', 'onreadystatechange');
            removeListener(node, context.onScriptError, 'error');

            return {
                node: node,
                id: node && node.getAttribute('data-requiremodule')
            };
        }

        function intakeDefines() {
            var args;

            //Any defined modules in the global queue, intake them now.
            takeGlobalQueue();

            //Make sure any remaining defQueue items get properly processed.
            while (defQueue.length) {
                args = defQueue.shift();
                if (args[0] === null) {
                    return onError(makeError('mismatch', 'Mismatched anonymous define() module: ' +
                        args[args.length - 1]));
                } else {
                    //args are id, deps, factory. Should be normalized by the
                    //define() function.
                    callGetModule(args);
                }
            }
            context.defQueueMap = {};
        }

        context = {
            config: config,
            contextName: contextName,
            registry: registry,
            defined: defined,
            urlFetched: urlFetched,
            defQueue: defQueue,
            defQueueMap: {},
            Module: Module,
            makeModuleMap: makeModuleMap,
            nextTick: req.nextTick,
            onError: onError,

            /**
             * Set a configuration for the context.
             * @param {Object} cfg config object to integrate.
             */
            configure: function (cfg) {
                //Make sure the baseUrl ends in a slash.
                if (cfg.baseUrl) {
                    if (cfg.baseUrl.charAt(cfg.baseUrl.length - 1) !== '/') {
                        cfg.baseUrl += '/';
                    }
                }

                //Save off the paths since they require special processing,
                //they are additive.
                var shim = config.shim,
                    objs = {
                        paths: true,
                        bundles: true,
                        config: true,
                        map: true
                    };

                eachProp(cfg, function (value, prop) {
                    if (objs[prop]) {
                        if (!config[prop]) {
                            config[prop] = {};
                        }
                        mixin(config[prop], value, true, true);
                    } else {
                        config[prop] = value;
                    }
                });

                //Reverse map the bundles
                if (cfg.bundles) {
                    eachProp(cfg.bundles, function (value, prop) {
                        each(value, function (v) {
                            if (v !== prop) {
                                bundlesMap[v] = prop;
                            }
                        });
                    });
                }

                //Merge shim
                if (cfg.shim) {
                    eachProp(cfg.shim, function (value, id) {
                        //Normalize the structure
                        if (isArray(value)) {
                            value = {
                                deps: value
                            };
                        }
                        if ((value.exports || value.init) && !value.exportsFn) {
                            value.exportsFn = context.makeShimExports(value);
                        }
                        shim[id] = value;
                    });
                    config.shim = shim;
                }

                //Adjust packages if necessary.
                if (cfg.packages) {
                    each(cfg.packages, function (pkgObj) {
                        var location, name;

                        pkgObj = typeof pkgObj === 'string' ? {name: pkgObj} : pkgObj;

                        name = pkgObj.name;
                        location = pkgObj.location;
                        if (location) {
                            config.paths[name] = pkgObj.location;
                        }

                        //Save pointer to main module ID for pkg name.
                        //Remove leading dot in main, so main paths are normalized,
                        //and remove any trailing .js, since different package
                        //envs have different conventions: some use a module name,
                        //some use a file name.
                        config.pkgs[name] = pkgObj.name + '/' + (pkgObj.main || 'main')
                                     .replace(currDirRegExp, '')
                                     .replace(jsSuffixRegExp, '');
                    });
                }

                //If there are any "waiting to execute" modules in the registry,
                //update the maps for them, since their info, like URLs to load,
                //may have changed.
                eachProp(registry, function (mod, id) {
                    //If module already has init called, since it is too
                    //late to modify them, and ignore unnormalized ones
                    //since they are transient.
                    if (!mod.inited && !mod.map.unnormalized) {
                        mod.map = makeModuleMap(id, null, true);
                    }
                });

                //If a deps array or a config callback is specified, then call
                //require with those args. This is useful when require is defined as a
                //config object before require.js is loaded.
                if (cfg.deps || cfg.callback) {
                    context.require(cfg.deps || [], cfg.callback);
                }
            },

            makeShimExports: function (value) {
                function fn() {
                    var ret;
                    if (value.init) {
                        ret = value.init.apply(global, arguments);
                    }
                    return ret || (value.exports && getGlobal(value.exports));
                }
                return fn;
            },

            makeRequire: function (relMap, options) {
                options = options || {};

                function localRequire(deps, callback, errback) {
                    var id, map, requireMod;

                    if (options.enableBuildCallback && callback && isFunction(callback)) {
                        callback.__requireJsBuild = true;
                    }

                    if (typeof deps === 'string') {
                        if (isFunction(callback)) {
                            //Invalid call
                            return onError(makeError('requireargs', 'Invalid require call'), errback);
                        }

                        //If require|exports|module are requested, get the
                        //value for them from the special handlers. Caveat:
                        //this only works while module is being defined.
                        if (relMap && hasProp(handlers, deps)) {
                            return handlers[deps](registry[relMap.id]);
                        }

                        //Synchronous access to one module. If require.get is
                        //available (as in the Node adapter), prefer that.
                        if (req.get) {
                            return req.get(context, deps, relMap, localRequire);
                        }

                        //Normalize module name, if it contains . or ..
                        map = makeModuleMap(deps, relMap, false, true);
                        id = map.id;

                        if (!hasProp(defined, id)) {
                            return onError(makeError('notloaded', 'Module name "' +
                                        id +
                                        '" has not been loaded yet for context: ' +
                                        contextName +
                                        (relMap ? '' : '. Use require([])')));
                        }
                        return defined[id];
                    }

                    //Grab defines waiting in the global queue.
                    intakeDefines();

                    //Mark all the dependencies as needing to be loaded.
                    context.nextTick(function () {
                        //Some defines could have been added since the
                        //require call, collect them.
                        intakeDefines();

                        requireMod = getModule(makeModuleMap(null, relMap));

                        //Store if map config should be applied to this require
                        //call for dependencies.
                        requireMod.skipMap = options.skipMap;

                        requireMod.init(deps, callback, errback, {
                            enabled: true
                        });

                        checkLoaded();
                    });

                    return localRequire;
                }

                mixin(localRequire, {
                    isBrowser: isBrowser,

                    /**
                     * Converts a module name + .extension into an URL path.
                     * *Requires* the use of a module name. It does not support using
                     * plain URLs like nameToUrl.
                     */
                    toUrl: function (moduleNamePlusExt) {
                        var ext,
                            index = moduleNamePlusExt.lastIndexOf('.'),
                            segment = moduleNamePlusExt.split('/')[0],
                            isRelative = segment === '.' || segment === '..';

                        //Have a file extension alias, and it is not the
                        //dots from a relative path.
                        if (index !== -1 && (!isRelative || index > 1)) {
                            ext = moduleNamePlusExt.substring(index, moduleNamePlusExt.length);
                            moduleNamePlusExt = moduleNamePlusExt.substring(0, index);
                        }

                        return context.nameToUrl(normalize(moduleNamePlusExt,
                                                relMap && relMap.id, true), ext,  true);
                    },

                    defined: function (id) {
                        return hasProp(defined, makeModuleMap(id, relMap, false, true).id);
                    },

                    specified: function (id) {
                        id = makeModuleMap(id, relMap, false, true).id;
                        return hasProp(defined, id) || hasProp(registry, id);
                    }
                });

                //Only allow undef on top level require calls
                if (!relMap) {
                    localRequire.undef = function (id) {
                        //Bind any waiting define() calls to this context,
                        //fix for #408
                        takeGlobalQueue();

                        var map = makeModuleMap(id, relMap, true),
                            mod = getOwn(registry, id);

                        mod.undefed = true;
                        removeScript(id);

                        delete defined[id];
                        delete urlFetched[map.url];
                        delete undefEvents[id];

                        //Clean queued defines too. Go backwards
                        //in array so that the splices do not
                        //mess up the iteration.
                        eachReverse(defQueue, function(args, i) {
                            if (args[0] === id) {
                                defQueue.splice(i, 1);
                            }
                        });
                        delete context.defQueueMap[id];

                        if (mod) {
                            //Hold on to listeners in case the
                            //module will be attempted to be reloaded
                            //using a different config.
                            if (mod.events.defined) {
                                undefEvents[id] = mod.events;
                            }

                            cleanRegistry(id);
                        }
                    };
                }

                return localRequire;
            },

            /**
             * Called to enable a module if it is still in the registry
             * awaiting enablement. A second arg, parent, the parent module,
             * is passed in for context, when this method is overridden by
             * the optimizer. Not shown here to keep code compact.
             */
            enable: function (depMap) {
                var mod = getOwn(registry, depMap.id);
                if (mod) {
                    getModule(depMap).enable();
                }
            },

            /**
             * Internal method used by environment adapters to complete a load event.
             * A load event could be a script load or just a load pass from a synchronous
             * load call.
             * @param {String} moduleName the name of the module to potentially complete.
             */
            completeLoad: function (moduleName) {
                var found, args, mod,
                    shim = getOwn(config.shim, moduleName) || {},
                    shExports = shim.exports;

                takeGlobalQueue();

                while (defQueue.length) {
                    args = defQueue.shift();
                    if (args[0] === null) {
                        args[0] = moduleName;
                        //If already found an anonymous module and bound it
                        //to this name, then this is some other anon module
                        //waiting for its completeLoad to fire.
                        if (found) {
                            break;
                        }
                        found = true;
                    } else if (args[0] === moduleName) {
                        //Found matching define call for this script!
                        found = true;
                    }

                    callGetModule(args);
                }
                context.defQueueMap = {};

                //Do this after the cycle of callGetModule in case the result
                //of those calls/init calls changes the registry.
                mod = getOwn(registry, moduleName);

                if (!found && !hasProp(defined, moduleName) && mod && !mod.inited) {
                    if (config.enforceDefine && (!shExports || !getGlobal(shExports))) {
                        if (hasPathFallback(moduleName)) {
                            return;
                        } else {
                            return onError(makeError('nodefine',
                                             'No define call for ' + moduleName,
                                             null,
                                             [moduleName]));
                        }
                    } else {
                        //A script that does not call define(), so just simulate
                        //the call for it.
                        callGetModule([moduleName, (shim.deps || []), shim.exportsFn]);
                    }
                }

                checkLoaded();
            },

            /**
             * Converts a module name to a file path. Supports cases where
             * moduleName may actually be just an URL.
             * Note that it **does not** call normalize on the moduleName,
             * it is assumed to have already been normalized. This is an
             * internal API, not a public one. Use toUrl for the public API.
             */
            nameToUrl: function (moduleName, ext, skipExt) {
                var paths, syms, i, parentModule, url,
                    parentPath, bundleId,
                    pkgMain = getOwn(config.pkgs, moduleName);

                if (pkgMain) {
                    moduleName = pkgMain;
                }

                bundleId = getOwn(bundlesMap, moduleName);

                if (bundleId) {
                    return context.nameToUrl(bundleId, ext, skipExt);
                }

                //If a colon is in the URL, it indicates a protocol is used and it is just
                //an URL to a file, or if it starts with a slash, contains a query arg (i.e. ?)
                //or ends with .js, then assume the user meant to use an url and not a module id.
                //The slash is important for protocol-less URLs as well as full paths.
                if (req.jsExtRegExp.test(moduleName)) {
                    //Just a plain path, not module name lookup, so just return it.
                    //Add extension if it is included. This is a bit wonky, only non-.js things pass
                    //an extension, this method probably needs to be reworked.
                    url = moduleName + (ext || '');
                } else {
                    //A module that needs to be converted to a path.
                    paths = config.paths;

                    syms = moduleName.split('/');
                    //For each module name segment, see if there is a path
                    //registered for it. Start with most specific name
                    //and work up from it.
                    for (i = syms.length; i > 0; i -= 1) {
                        parentModule = syms.slice(0, i).join('/');

                        parentPath = getOwn(paths, parentModule);
                        if (parentPath) {
                            //If an array, it means there are a few choices,
                            //Choose the one that is desired
                            if (isArray(parentPath)) {
                                parentPath = parentPath[0];
                            }
                            syms.splice(0, i, parentPath);
                            break;
                        }
                    }

                    //Join the path parts together, then figure out if baseUrl is needed.
                    url = syms.join('/');
                    url += (ext || (/^data\:|\?/.test(url) || skipExt ? '' : '.js'));
                    url = (url.charAt(0) === '/' || url.match(/^[\w\+\.\-]+:/) ? '' : config.baseUrl) + url;
                }

                return config.urlArgs ? url +
                                        ((url.indexOf('?') === -1 ? '?' : '&') +
                                         config.urlArgs) : url;
            },

            //Delegates to req.load. Broken out as a separate function to
            //allow overriding in the optimizer.
            load: function (id, url) {
                req.load(context, id, url);
            },

            /**
             * Executes a module callback function. Broken out as a separate function
             * solely to allow the build system to sequence the files in the built
             * layer in the right sequence.
             *
             * @private
             */
            execCb: function (name, callback, args, exports) {
                return callback.apply(exports, args);
            },

            /**
             * callback for script loads, used to check status of loading.
             *
             * @param {Event} evt the event from the browser for the script
             * that was loaded.
             */
            onScriptLoad: function (evt) {
                //Using currentTarget instead of target for Firefox 2.0's sake. Not
                //all old browsers will be supported, but this one was easy enough
                //to support and still makes sense.
                if (evt.type === 'load' ||
                        (readyRegExp.test((evt.currentTarget || evt.srcElement).readyState))) {
                    //Reset interactive script so a script node is not held onto for
                    //to long.
                    interactiveScript = null;

                    //Pull out the name of the module and the context.
                    var data = getScriptData(evt);
                    context.completeLoad(data.id);
                }
            },

            /**
             * Callback for script errors.
             */
            onScriptError: function (evt) {
                var data = getScriptData(evt);
                if (!hasPathFallback(data.id)) {
                    var parents = [];
                    eachProp(registry, function(value, key) {
                        if (key.indexOf('_@r') !== 0) {
                            each(value.depMaps, function(depMap) {
                                if (depMap.id === data.id) {
                                    parents.push(key);
                                }
                                return true;
                            });
                        }
                    });
                    return onError(makeError('scripterror', 'Script error for "' + data.id +
                                             (parents.length ?
                                             '", needed by: ' + parents.join(', ') :
                                             '"'), evt, [data.id]));
                }
            }
        };

        context.require = context.makeRequire();
        return context;
    }

    /**
     * Main entry point.
     *
     * If the only argument to require is a string, then the module that
     * is represented by that string is fetched for the appropriate context.
     *
     * If the first argument is an array, then it will be treated as an array
     * of dependency string names to fetch. An optional function callback can
     * be specified to execute when all of those dependencies are available.
     *
     * Make a local req variable to help Caja compliance (it assumes things
     * on a require that are not standardized), and to give a short
     * name for minification/local scope use.
     */
    req = requirejs = function (deps, callback, errback, optional) {

        //Find the right context, use default
        var context, config,
            contextName = defContextName;

        // Determine if have config object in the call.
        if (!isArray(deps) && typeof deps !== 'string') {
            // deps is a config object
            config = deps;
            if (isArray(callback)) {
                // Adjust args if there are dependencies
                deps = callback;
                callback = errback;
                errback = optional;
            } else {
                deps = [];
            }
        }

        if (config && config.context) {
            contextName = config.context;
        }

        context = getOwn(contexts, contextName);
        if (!context) {
            context = contexts[contextName] = req.s.newContext(contextName);
        }

        if (config) {
            context.configure(config);
        }

        return context.require(deps, callback, errback);
    };

    /**
     * Support require.config() to make it easier to cooperate with other
     * AMD loaders on globally agreed names.
     */
    req.config = function (config) {
        return req(config);
    };

    /**
     * Execute something after the current tick
     * of the event loop. Override for other envs
     * that have a better solution than setTimeout.
     * @param  {Function} fn function to execute later.
     */
    req.nextTick = typeof setTimeout !== 'undefined' ? function (fn) {
        setTimeout(fn, 4);
    } : function (fn) { fn(); };

    /**
     * Export require as a global, but only if it does not already exist.
     */
    if (!require) {
        require = req;
    }

    req.version = version;

    //Used to filter out dependencies that are already paths.
    req.jsExtRegExp = /^\/|:|\?|\.js$/;
    req.isBrowser = isBrowser;
    s = req.s = {
        contexts: contexts,
        newContext: newContext
    };

    //Create default context.
    req({});

    //Exports some context-sensitive methods on global require.
    each([
        'toUrl',
        'undef',
        'defined',
        'specified'
    ], function (prop) {
        //Reference from contexts instead of early binding to default context,
        //so that during builds, the latest instance of the default context
        //with its config gets used.
        req[prop] = function () {
            var ctx = contexts[defContextName];
            return ctx.require[prop].apply(ctx, arguments);
        };
    });

    if (isBrowser) {
        head = s.head = document.getElementsByTagName('head')[0];
        //If BASE tag is in play, using appendChild is a problem for IE6.
        //When that browser dies, this can be removed. Details in this jQuery bug:
        //http://dev.jquery.com/ticket/2709
        baseElement = document.getElementsByTagName('base')[0];
        if (baseElement) {
            head = s.head = baseElement.parentNode;
        }
    }

    /**
     * Any errors that require explicitly generates will be passed to this
     * function. Intercept/override it if you want custom error handling.
     * @param {Error} err the error object.
     */
    req.onError = defaultOnError;

    /**
     * Creates the node for the load command. Only used in browser envs.
     */
    req.createNode = function (config, moduleName, url) {
        var node = config.xhtml ?
                document.createElementNS('http://www.w3.org/1999/xhtml', 'html:script') :
                document.createElement('script');
        node.type = config.scriptType || 'text/javascript';
        node.charset = 'utf-8';
        node.async = true;
        return node;
    };

    /**
     * Does the request to load a module for the browser case.
     * Make this a separate function to allow other environments
     * to override it.
     *
     * @param {Object} context the require context to find state.
     * @param {String} moduleName the name of the module.
     * @param {Object} url the URL to the module.
     */
    req.load = function (context, moduleName, url) {
        var config = (context && context.config) || {},
            node;
        if (isBrowser) {
            //In the browser so use a script tag
            node = req.createNode(config, moduleName, url);
            if (config.onNodeCreated) {
                config.onNodeCreated(node, config, moduleName, url);
            }

            node.setAttribute('data-requirecontext', context.contextName);
            node.setAttribute('data-requiremodule', moduleName);

            //Set up load listener. Test attachEvent first because IE9 has
            //a subtle issue in its addEventListener and script onload firings
            //that do not match the behavior of all other browsers with
            //addEventListener support, which fire the onload event for a
            //script right after the script execution. See:
            //https://connect.microsoft.com/IE/feedback/details/648057/script-onload-event-is-not-fired-immediately-after-script-execution
            //UNFORTUNATELY Opera implements attachEvent but does not follow the script
            //script execution mode.
            if (node.attachEvent &&
                    //Check if node.attachEvent is artificially added by custom script or
                    //natively supported by browser
                    //read https://github.com/jrburke/requirejs/issues/187
                    //if we can NOT find [native code] then it must NOT natively supported.
                    //in IE8, node.attachEvent does not have toString()
                    //Note the test for "[native code" with no closing brace, see:
                    //https://github.com/jrburke/requirejs/issues/273
                    !(node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code') < 0) &&
                    !isOpera) {
                //Probably IE. IE (at least 6-8) do not fire
                //script onload right after executing the script, so
                //we cannot tie the anonymous define call to a name.
                //However, IE reports the script as being in 'interactive'
                //readyState at the time of the define call.
                useInteractive = true;

                node.attachEvent('onreadystatechange', context.onScriptLoad);
                //It would be great to add an error handler here to catch
                //404s in IE9+. However, onreadystatechange will fire before
                //the error handler, so that does not help. If addEventListener
                //is used, then IE will fire error before load, but we cannot
                //use that pathway given the connect.microsoft.com issue
                //mentioned above about not doing the 'script execute,
                //then fire the script load event listener before execute
                //next script' that other browsers do.
                //Best hope: IE10 fixes the issues,
                //and then destroys all installs of IE 6-9.
                //node.attachEvent('onerror', context.onScriptError);
            } else {
                node.addEventListener('load', context.onScriptLoad, false);
                node.addEventListener('error', context.onScriptError, false);
            }
            node.src = url;

            //For some cache cases in IE 6-8, the script executes before the end
            //of the appendChild execution, so to tie an anonymous define
            //call to the module name (which is stored on the node), hold on
            //to a reference to this node, but clear after the DOM insertion.
            currentlyAddingScript = node;
            if (baseElement) {
                head.insertBefore(node, baseElement);
            } else {
                head.appendChild(node);
            }
            currentlyAddingScript = null;

            return node;
        } else if (isWebWorker) {
            try {
                //In a web worker, use importScripts. This is not a very
                //efficient use of importScripts, importScripts will block until
                //its script is downloaded and evaluated. However, if web workers
                //are in play, the expectation is that a build has been done so
                //that only one script needs to be loaded anyway. This may need
                //to be reevaluated if other use cases become common.
                importScripts(url);

                //Account for anonymous modules
                context.completeLoad(moduleName);
            } catch (e) {
                context.onError(makeError('importscripts',
                                'importScripts failed for ' +
                                    moduleName + ' at ' + url,
                                e,
                                [moduleName]));
            }
        }
    };

    function getInteractiveScript() {
        if (interactiveScript && interactiveScript.readyState === 'interactive') {
            return interactiveScript;
        }

        eachReverse(scripts(), function (script) {
            if (script.readyState === 'interactive') {
                return (interactiveScript = script);
            }
        });
        return interactiveScript;
    }

    //Look for a data-main script attribute, which could also adjust the baseUrl.
    if (isBrowser && !cfg.skipDataMain) {
        //Figure out baseUrl. Get it from the script tag with require.js in it.
        eachReverse(scripts(), function (script) {
            //Set the 'head' where we can append children by
            //using the script's parent.
            if (!head) {
                head = script.parentNode;
            }

            //Look for a data-main attribute to set main script for the page
            //to load. If it is there, the path to data main becomes the
            //baseUrl, if it is not already set.
            dataMain = script.getAttribute('data-main');
            if (dataMain) {
                //Preserve dataMain in case it is a path (i.e. contains '?')
                mainScript = dataMain;

                //Set final baseUrl if there is not already an explicit one.
                if (!cfg.baseUrl) {
                    //Pull off the directory of data-main for use as the
                    //baseUrl.
                    src = mainScript.split('/');
                    mainScript = src.pop();
                    subPath = src.length ? src.join('/')  + '/' : './';

                    cfg.baseUrl = subPath;
                }

                //Strip off any trailing .js since mainScript is now
                //like a module name.
                mainScript = mainScript.replace(jsSuffixRegExp, '');

                //If mainScript is still a path, fall back to dataMain
                if (req.jsExtRegExp.test(mainScript)) {
                    mainScript = dataMain;
                }

                //Put the data-main script in the files to load.
                cfg.deps = cfg.deps ? cfg.deps.concat(mainScript) : [mainScript];

                return true;
            }
        });
    }

    /**
     * The function that handles definitions of modules. Differs from
     * require() in that a string for the module should be the first argument,
     * and the function to execute after dependencies are loaded should
     * return a value to define the module corresponding to the first argument's
     * name.
     */
    define = function (name, deps, callback) {
        var node, context;

        //Allow for anonymous modules
        if (typeof name !== 'string') {
            //Adjust args appropriately
            callback = deps;
            deps = name;
            name = null;
        }

        //This module may not have dependencies
        if (!isArray(deps)) {
            callback = deps;
            deps = null;
        }

        //If no name, and callback is a function, then figure out if it a
        //CommonJS thing with dependencies.
        if (!deps && isFunction(callback)) {
            deps = [];
            //Remove comments from the callback string,
            //look for require calls, and pull them into the dependencies,
            //but only if there are function args.
            if (callback.length) {
                callback
                    .toString()
                    .replace(commentRegExp, '')
                    .replace(cjsRequireRegExp, function (match, dep) {
                        deps.push(dep);
                    });

                //May be a CommonJS thing even without require calls, but still
                //could use exports, and module. Avoid doing exports and module
                //work though if it just needs require.
                //REQUIRES the function to expect the CommonJS variables in the
                //order listed below.
                deps = (callback.length === 1 ? ['require'] : ['require', 'exports', 'module']).concat(deps);
            }
        }

        //If in IE 6-8 and hit an anonymous define() call, do the interactive
        //work.
        if (useInteractive) {
            node = currentlyAddingScript || getInteractiveScript();
            if (node) {
                if (!name) {
                    name = node.getAttribute('data-requiremodule');
                }
                context = contexts[node.getAttribute('data-requirecontext')];
            }
        }

        //Always save off evaluating the def call until the script onload handler.
        //This allows multiple modules to be in a file without prematurely
        //tracing dependencies, and allows for anonymous module support,
        //where the module name is not known until the script onload event
        //occurs. If no context, use the global queue, and get it processed
        //in the onscript load callback.
        if (context) {
            context.defQueue.push([name, deps, callback]);
            context.defQueueMap[name] = true;
        } else {
            globalDefQueue.push([name, deps, callback]);
        }
    };

    define.amd = {
        jQuery: true
    };

    /**
     * Executes the text. Normally just uses eval, but can be modified
     * to use a better, environment-specific call. Only used for transpiling
     * loader plugins, not for plain JS modules.
     * @param {String} text the text to execute/evaluate.
     */
    req.exec = function (text) {
        /*jslint evil: true */
        return eval(text);
    };

    //Set up with config info.
    req(cfg);
}(this));

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
    'use strict';

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

/*!
 * jQuery JavaScript Library v3.0.0-beta1 -ajax,-ajax/jsonp,-ajax/load,-ajax/parseJSON,-ajax/parseXML,-ajax/script,-ajax/var/location,-ajax/var/nonce,-ajax/var/rquery,-ajax/xhr,-manipulation/_evalUrl,-event/ajax,-effects,-effects/Tween,-effects/animatedSelector,-deprecated
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2016-01-14T23:07Z
 */

(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Support: Firefox 18+
// Can't be in strict mode, several libs including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
//"use strict";
var arr = [];

var document = window.document;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};


	function DOMEval( code, doc ) {
		doc = doc || document;

		var script = doc.createElement( "script" );

		script.text = code;
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}


var
	version = "3.0.0-beta1 -ajax,-ajax/jsonp,-ajax/load,-ajax/parseJSON,-ajax/parseXML,-ajax/script,-ajax/var/location,-ajax/var/nonce,-ajax/var/rquery,-ajax/xhr,-manipulation/_evalUrl,-event/ajax,-effects,-effects/Tween,-effects/animatedSelector,-deprecated",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android<4.1
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return just the one element from the set
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return all the elements in a clean array
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = jQuery.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {

		// As of jQuery 3.0, isNumeric is limited to
		// strings and numbers (primitives or objects)
		// that can be coerced to finite numbers (gh-2662)
		var type = jQuery.type( obj );
		return ( type === "number" || type === "string" ) &&
			( obj - parseFloat( obj ) + 1 ) >= 0;
	},

	isPlainObject: function( obj ) {

		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		if ( obj.constructor &&
				!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}

		// Support: Android<4.0 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		DOMEval( code );
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE9-11+
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android<4.1
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android<4.1, PhantomJS<2
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

// JSHint would error on this code due to the Symbol not being defined in ES5.
// Defining this global in .jshintrc would create a danger of using the global
// unguarded in another place, it seems safer to just disable JSHint for these
// three lines.
/* jshint ignore: start */
if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}
/* jshint ignore: end */

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: iOS 8.2 (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.0
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-01-04
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	disabledAncestor = addCombinator(
		function( elem ) {
			return elem.disabled === true;
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rcssescape, fcssescape );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "#" + nid + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement("fieldset");

	try {
		return !!fn( el );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}
		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {
	// Known :disabled false positives:
	// IE: *[disabled]:not(button, input, select, textarea, optgroup, option, menuitem, fieldset)
	// not IE: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Check form elements and option elements for explicit disabling
		return "label" in elem && elem.disabled === disabled ||
			"form" in elem && elem.disabled === disabled ||

			// Check non-disabled form elements for fieldset[disabled] ancestors
			"form" in elem && elem.disabled === false && (
				// Support: IE6-11+
				// Ancestry is covered for us
				elem.isDisabled === disabled ||

				// Otherwise, assume any non-<option> under fieldset[disabled] is disabled
				/* jshint -W018 */
				elem.isDisabled !== !disabled &&
					("label" in elem || !disabledAncestor( elem )) !== disabled
			);
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( el ) {
		el.className = "i";
		return !el.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( el ) {
		el.appendChild( document.createComment("") );
		return !el.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var m = context.getElementById( id );
				return m ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( el ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll(":enabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll(":disabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( el ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return (sel + "").replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( (oldCache = uniqueCache[ key ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( el ) {
	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( el ) {
	return el.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		} );

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) > -1 ) !== not && elem.nodeType === 1;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i,
			len = this.length,
			ret = [],
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return this.pushStack( len > 1 ? jQuery.uniqueSort( ret ) : ret );
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnotwhite = ( /\S+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = jQuery.isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this === promise ? newDefer.promise() : this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this === promise ? undefined : this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( jQuery.isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notify )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )(
											that || deferred.promise(), args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that || deferred.promise(),
													args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function() {
		var method, resolveContexts,
			i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length,

			// the master Deferred.
			master = jQuery.Deferred(),

			// Update function for both resolving subordinates
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith(
							resolveContexts.length === 1 ? resolveContexts[ 0 ] : resolveContexts,
							resolveValues
						);
					}
				};
			};

		// Add listeners to promise-like subordinates; treat others as resolved
		if ( length > 0 ) {
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {

				// jQuery.Deferred - treated specially to get resolve-sync behavior
				if ( resolveValues[ i ] &&
					jQuery.isFunction( ( method = resolveValues[ i ].promise ) ) ) {

					method.call( resolveValues[ i ] )
						.done( updateFunc( i ) )
						.fail( master.reject );

				// Other thenables
				} else if ( resolveValues[ i ] &&
					jQuery.isFunction( ( method = resolveValues[ i ].then ) ) ) {

					method.call(
						resolveValues[ i ],
						updateFunc( i ),
						master.reject
					);
				} else {
					updateFunc( i )( resolveValues[ i ] );
				}
			}

		// If we're not waiting on anything, resolve the master
		} else {
			master.resolveWith();
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE9
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, stack );
	}
};




// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {

	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

/**
 * The ready event handler and self cleanup method
 */
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called
		// after the browser event has already occurred.
		// Support: IE9-10 only
		// Older IE sometimes signals "interactive" too soon
		if ( document.readyState === "complete" ||
			( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

			// Handle it asynchronously to allow scripts the opportunity to delay ready
			window.setTimeout( jQuery.ready );

		} else {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed );
		}
	}
	return readyList.promise( obj );
};

// Kick off the DOM ready check even if the user does not
jQuery.ready.promise();




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			len ? fn( elems[ 0 ], key ) : emptyGet;
};
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	/* jshint -W018 */
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ jQuery.camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ jQuery.camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ jQuery.camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( jQuery.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( jQuery.camelCase );
			} else {
				key = jQuery.camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnotwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <= 35-45+
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://code.google.com/p/chromium/issues/detail?id=378607
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :

					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {

		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" ||
			!jQuery.contains( elem.ownerDocument, elem );
	};

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};




function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() { return tween.cur(); } :
			function() { return jQuery.css( elem, prop, "" ); },
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) ),
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && jQuery.css( elem, "display" ) === "none" &&

					// Support: Firefox <=42 - 43
					// Don't set inline display on disconnected elements with computed display: none
					jQuery.contains( elem.ownerDocument, elem ) ) {

				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]+)/i );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE9
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {

	// Support: IE9-11+
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== "undefined" ?
				context.querySelectorAll( tag || "*" ) :
			[];

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {

				// Support: Android<4.1, PhantomJS<2
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android<4.1, PhantomJS<2
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0-4.3
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android<4.2
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<=11+
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();


var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE9
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Support (at least): Chrome, IE9
		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		//
		// Support: Firefox<=42+
		// Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
		if ( delegateCount && cur.nodeType &&
			( event.type !== "click" || isNaN( event.button ) || event.button < 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && ( cur.disabled !== true || event.type !== "click" ) ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push( { elem: cur, handlers: matches } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: this, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: ( "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " +
		"metaKey relatedTarget shiftKey target timeStamp view which" ).split( " " ),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split( " " ),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: ( "button buttons clientX clientY offsetX offsetY pageX pageY " +
			"screenX screenY toElement" ).split( " " ),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX +
					( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
					( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY +
					( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) -
					( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: Safari 6-8+
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android<4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://code.google.com/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

	// Support: IE 10-11, Edge 10240+
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

function manipulationTarget( elem, content ) {
	if ( jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return elem.getElementsByTagName( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android<4.1, PhantomJS<2
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <= 35-45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <= 35-45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android<4.1, PhantomJS<2
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var documentElement = document.documentElement;



( function() {
	var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE9-11+
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	container.appendChild( div );

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {
		div.style.cssText =
			"box-sizing:border-box;" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;width:50%";
		div.innerHTML = "";
		documentElement.appendChild( container );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";
		reliableMarginLeftVal = divStyle.marginLeft === "2px";
		boxSizingReliableVal = divStyle.width === "4px";

		// Support: Android 4.0 - 4.3 only
		// Some styles come back with percentage values, even though they shouldn't
		div.style.marginRight = "50%";
		pixelMarginRightVal = divStyle.marginRight === "4px";

		documentElement.removeChild( container );
	}

	jQuery.extend( support, {
		pixelPosition: function() {

			// This test is executed only once but we still do memoizing
			// since we can use the boxSizingReliable pre-computing.
			// No need to check if the test was already performed, though.
			computeStyleTests();
			return pixelPositionVal;
		},
		boxSizingReliable: function() {
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return boxSizingReliableVal;
		},
		pixelMarginRight: function() {

			// Support: Android 4.0-4.3
			// We're checking for boxSizingReliableVal here instead of pixelMarginRightVal
			// since that compresses better and they're computed together anyway.
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return pixelMarginRightVal;
		},
		reliableMarginLeft: function() {

			// Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return reliableMarginLeftVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,
		style = elem.style;

	computed = computed || getStyles( elem );

	// Support: IE9
	// getPropertyValue is only needed for .css('filter') (#12537)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// http://dev.w3.org/csswg/cssom/#resolved-values
		if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE9-11+
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?

		// If we already have the right measurement, avoid augmentation
		4 :

		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// At this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// At this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// At this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var val,
		valueIsBorderBox = true,
		styles = getStyles( elem ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// Support: IE <= 11 only
	// Running getBoundingClientRect on a disconnected node
	// in IE throws an error.
	if ( elem.getClientRects().length ) {
		val = elem.getBoundingClientRect()[ name ];
	}

	// Support: IE11 only
	// In IE 11 fullscreen elements inside of an iframe have
	// 100x too small dimensions (gh-1764).
	if ( document.msFullscreenElement && window.top !== window ) {
		val *= 100;
	}

	// Some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {

		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test( val ) ) {
			return val;
		}

		// Check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// Use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// Support: IE9-11+
			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				style[ name ] = value;
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] ||
			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}
		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <= 11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = extra && getStyles( elem ),
				subtract = extra && augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				);

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ name ] = value;
				value = jQuery.css( elem, name );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android<4.4
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE<=11+
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE<=11+
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle,

	// Exclusively lowercase A-Z in attribute names (gh-2730)
	// https://dom.spec.whatwg.org/#converted-to-ascii-lowercase
	raz = /[A-Z]+/g,
	lowercase = function( ch ) {
		return ch.toLowerCase();
	};

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.replace( raz, lowercase );
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					jQuery.nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle;
		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ name ];
			attrHandle[ name ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				name.toLowerCase() :
				null;
			attrHandle[ name ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) ||
						rclickable.test( elem.nodeName ) && elem.href ?
							0 :
							-1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




var rclass = /[\t\r\n\f]/g;

function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		if ( typeof value === "string" && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 &&
					( " " + curValue + " " ).replace( rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = value.match( rnotwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + getClass( elem ) + " " ).replace( rclass, " " )
					.indexOf( className ) > -1
			) {
				return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?

					// Handle most common string cases
					ret.replace( rreturn, "" ) :

					// Handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				// Support: IE<11
				// option.value not trimmed (#14858)
				return jQuery.trim( elem.value );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( option.selected =
							jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true

				// Previously, `originalEvent: {}` was set here, so stopPropagation call
				// would not be triggered on donor event, since in our own
				// jQuery.event.stopPropagation function we had a check for existence of
				// originalEvent.stopPropagation method, so, consequently it would be a noop.
				//
				// But now, this "simulate" function is used only for events
				// for which stopPropagation() is noop, so there is no need for that anymore.
				//
				// For the compat branch though, guard for "click" and "submit"
				// events is still used, but was moved to jQuery.event.stopPropagation function
				// because `originalEvent` should point to the original event for the constancy
				// with other events and for more focused logic
			}
		);

		jQuery.event.trigger( e, null, elem );

		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );




support.focusin = "onfocusin" in window;


// Support: Firefox
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome, Safari
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( jQuery.isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.filters.hidden = function( elem ) {
	return !jQuery.expr.filters.visible( elem );
};
jQuery.expr.filters.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {

			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					} ) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


// Support: Safari 8+
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	// Stop scripts or inline event handlers from being executed immediately
	// by using document.implementation
	context = context || ( support.createHTMLDocument ?
		document.implementation.createHTMLDocument( "" ) :
		document );

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var docElem, win, rect, doc,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Support: IE<=11+
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		rect = elem.getBoundingClientRect();

		// Make sure element is not hidden (display: none)
		if ( rect.width || rect.height ) {
			doc = elem.ownerDocument;
			win = getWindow( doc );
			docElem = doc.documentElement;

			return {
				top: rect.top + win.pageYOffset - docElem.clientTop,
				left: rect.left + win.pageXOffset - docElem.clientLeft
			};
		}

		// Return zeros for disconnected and hidden elements (gh-2310)
		return rect;
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume getBoundingClientRect is there when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {

			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			// Subtract offsetParent scroll positions
			parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true ) -
				offsetParent.scrollTop();
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true ) -
				offsetParent.scrollLeft();
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari<7-8+, Chrome<37-44+
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://code.google.com/p/chromium/issues/detail?id=229280
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}



var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}

return jQuery;
}));

(function(root) {

	// Store setTimeout reference so promise-polyfill will be unaffected by
	// other code modifying setTimeout (like sinon.useFakeTimers())
	var setTimeoutFunc = setTimeout;

	// Use polyfill for setImmediate for performance gains
	var asap = (typeof setImmediate === 'function' && setImmediate) ||
		function(fn) { setTimeoutFunc(fn, 1); };

	// Polyfill for Function.prototype.bind
	function bind(fn, thisArg) {
		return function() {
			fn.apply(thisArg, arguments);
		}
	}

	var isArray = Array.isArray || function(value) { return Object.prototype.toString.call(value) === "[object Array]" };

	function Promise(fn) {
		if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new');
		if (typeof fn !== 'function') throw new TypeError('not a function');
		this._state = null;
		this._value = null;
		this._deferreds = []

		doResolve(fn, bind(resolve, this), bind(reject, this))
	}

	function handle(deferred) {
		var me = this;
		if (this._state === null) {
			this._deferreds.push(deferred);
			return
		}
		asap(function() {
			var cb = me._state ? deferred.onFulfilled : deferred.onRejected
			if (cb === null) {
				(me._state ? deferred.resolve : deferred.reject)(me._value);
				return;
			}
			var ret;
			try {
				ret = cb(me._value);
			}
			catch (e) {
				deferred.reject(e);
				return;
			}
			deferred.resolve(ret);
		})
	}

	function resolve(newValue) {
		try { //Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
			if (newValue === this) throw new TypeError('A promise cannot be resolved with itself.');
			if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
				var then = newValue.then;
				if (typeof then === 'function') {
					doResolve(bind(then, newValue), bind(resolve, this), bind(reject, this));
					return;
				}
			}
			this._state = true;
			this._value = newValue;
			finale.call(this);
		} catch (e) { reject.call(this, e); }
	}

	function reject(newValue) {
		this._state = false;
		this._value = newValue;
		finale.call(this);
	}

	function finale() {
		for (var i = 0, len = this._deferreds.length; i < len; i++) {
			handle.call(this, this._deferreds[i]);
		}
		this._deferreds = null;
	}

	function Handler(onFulfilled, onRejected, resolve, reject){
		this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
		this.onRejected = typeof onRejected === 'function' ? onRejected : null;
		this.resolve = resolve;
		this.reject = reject;
	}

	/**
	 * Take a potentially misbehaving resolver function and make sure
	 * onFulfilled and onRejected are only called once.
	 *
	 * Makes no guarantees about asynchrony.
	 */
	function doResolve(fn, onFulfilled, onRejected) {
		var done = false;
		try {
			fn(function (value) {
				if (done) return;
				done = true;
				onFulfilled(value);
			}, function (reason) {
				if (done) return;
				done = true;
				onRejected(reason);
			})
		} catch (ex) {
			if (done) return;
			done = true;
			onRejected(ex);
		}
	}

	Promise.prototype['catch'] = function (onRejected) {
		return this.then(null, onRejected);
	};

	Promise.prototype.then = function(onFulfilled, onRejected) {
		var me = this;
		return new Promise(function(resolve, reject) {
			handle.call(me, new Handler(onFulfilled, onRejected, resolve, reject));
		})
	};

	Promise.all = function () {
		var args = Array.prototype.slice.call(arguments.length === 1 && isArray(arguments[0]) ? arguments[0] : arguments);

		return new Promise(function (resolve, reject) {
			if (args.length === 0) return resolve([]);
			var remaining = args.length;
			function res(i, val) {
				try {
					if (val && (typeof val === 'object' || typeof val === 'function')) {
						var then = val.then;
						if (typeof then === 'function') {
							then.call(val, function (val) { res(i, val) }, reject);
							return;
						}
					}
					args[i] = val;
					if (--remaining === 0) {
						resolve(args);
					}
				} catch (ex) {
					reject(ex);
				}
			}
			for (var i = 0; i < args.length; i++) {
				res(i, args[i]);
			}
		});
	};

	Promise.resolve = function (value) {
		if (value && typeof value === 'object' && value.constructor === Promise) {
			return value;
		}

		return new Promise(function (resolve) {
			resolve(value);
		});
	};

	Promise.reject = function (value) {
		return new Promise(function (resolve, reject) {
			reject(value);
		});
	};

	Promise.race = function (values) {
		return new Promise(function (resolve, reject) {
			for(var i = 0, len = values.length; i < len; i++) {
				values[i].then(resolve, reject);
			}
		});
	};

	/**
	 * Set the immediate function to execute callbacks
	 * @param fn {function} Function to execute
	 * @private
	 */
	Promise._setImmediateFn = function _setImmediateFn(fn) {
		asap = fn;
	};

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = Promise;
	} else if (!root.Promise) {
		root.Promise = Promise;
	}

})(this);

define("PromisePoly", function(){});

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
            if (embedded && window.postMessage) {
                // Make sure all args are structured-cloneable.
                args = args.map(function(arg) {
                    return (arg.stack || arg) + '';
                });
                parent.postMessage({ topic: topic, args: args}, "*");
            }
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
        console.warn("WARN: ", details);
    });
    respecEvents.sub("error", function (details) {
        console.error("ERROR: ", details);
    });
    respecEvents.sub("start", function (details) {
        if (respecConfig && respecConfig.trace) console.log(">>> began: " + details);
    });
    respecEvents.sub("end", function (details) {
        if (respecConfig && respecConfig.trace) console.log("<<< finished: " + details);
    });
}


define(
    'core/base-runner',["jquery", "PromisePoly"],
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

                if (respecConfig.preProcess) {
                    for (var i = 0; i < respecConfig.preProcess.length; i++) {
                        try { respecConfig.preProcess[i].apply(this); }
                        catch (e) { respecEvents.pub("error", e); }
                    }
                }

                var pipeline = Promise.resolve();
                // the first in the plugs is going to be us
                plugs.shift();
                plugs.forEach(function(plug) {
                    pipeline = pipeline.then(function () {
                        if (plug.run) {
                            return new Promise(function runPlugin(resolve, reject) {
                                var result = plug.run.call(plug, respecConfig, document, resolve, respecEvents);
                                // If the plugin returns a promise, have that
                                // control the end of the plugin's run.
                                // Otherwise, assume it'll call resolve() as a
                                // completion callback.
                                if (result) {
                                    resolve(result);
                                }
                            }).catch(function(e) {
                                respecEvents.pub("error", e);
                                respecEvents.pub("end", "unknown/with-error");
                            });
                        }
                        else return Promise.resolve();
                    });
                });
                return pipeline.then(function() {
                    if (respecConfig.postProcess) {
                        for (var i = 0; i < respecConfig.postProcess.length; i++) {
                            try { respecConfig.postProcess[i].apply(this); }
                            catch (e) { respecEvents.pub("error", e); }
                        }
                    }
                    if (respecConfig.afterEnd) {
                        try { respecConfig.afterEnd.apply(window, Array.prototype.slice.call(arguments)); }
                        catch (e) { respecEvents.pub("error", e); }
                    }
                    respecEvents.pub("end", "core/base-runner");
                });
            }
        };
    }
);

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
define("shortcut", (function (global) {
    return function () {
        var ret, fn;
        return ret || global.shortcut;
    };
}(this)));

/*global respecEvents */

// Module core/ui
// Handles the ReSpec UI

// XXX TODO
//  - look at other UI things to add
//      - list issues
//      - lint: validator, link checker, check WebIDL, ID references
//      - save to GitHub
//  - make a release candidate that people can test
//  - once we have something decent, merge, ship as 3.2.0

define(
    'core/ui',["jquery", "shortcut"],
    function ($, shortcut) {
        var $menu = $("<div></div>")
                        .css({
                            background:     "#fff"
                        ,   border:         "1px solid #000"
                        ,   width:          "200px"
                        ,   display:        "none"
                        ,   textAlign:      "left"
                        ,   marginTop:      "5px"
                        ,   marginRight:    "5px"
                        })
                        ;
        var $modal
        ,   $overlay
        ,   errors = []
        ,   warnings = []
        ,   buttons = {}
        ,   $respecButton
        ,   errWarn = function (msg, arr, butName, bg, title) {
                arr.push(msg);
                if (!buttons[butName]) {
                    buttons[butName] = $("<button></button>")
                                            .css({
                                                background:     bg
                                            ,   color:          "#fff"
                                            ,   fontWeight:     "bold"
                                            ,   border:         "none"
                                            ,   borderRadius:   "5px"
                                            ,   marginLeft:     "5px"
                                            })
                                            .insertAfter($respecButton)
                                            .click(function () {
                                                var $ul = $("<ol></ol>");
                                                for (var i = 0, n = arr.length; i < n; i++) {
                                                    var err = arr[i];
                                                    if (err instanceof Error) {
                                                        $("<li><span></span> <a>\u229e</a><pre></pre></li>")
                                                            .appendTo($ul)
                                                            .find("span")
                                                                .text("[" + err.name + "] " + err.message)
                                                            .end()
                                                            .find("a")
                                                                .css({
                                                                    fontSize:   "1.1em"
                                                                ,   color:      "#999"
                                                                ,   cursor:     "pointer"
                                                                })
                                                                .click(function () {
                                                                    var $a = $(this)
                                                                    ,   state = $a.text()
                                                                    ,   $pre = $a.parent().find("pre");
                                                                    if (state === "\u229e") {
                                                                        $a.text("\u229f");
                                                                        $pre.show();
                                                                    }
                                                                    else {
                                                                        $a.text("\u229e");
                                                                        $pre.hide();
                                                                    }
                                                                })
                                                            .end()
                                                            .find("pre")
                                                                .text(err.stack)
                                                                .css({
                                                                    marginLeft: "0"
                                                                ,   maxWidth:   "100%"
                                                                ,   overflowY:  "hidden"
                                                                ,   overflowX:  "scroll"
                                                                })
                                                                .hide()
                                                            .end();
                                                    }
                                                    else {
                                                        $("<li></li>").text(err).appendTo($ul);
                                                    }
                                                }
                                                ui.freshModal(title, $ul);
                                            })
                                            ;
                }
                buttons[butName].text(arr.length);
            }
        ;
        var conf, doc, msg;
        var ui = {
            run:    function (_conf, _doc, cb, _msg) {
                conf = _conf, doc = _doc, msg = _msg;
                msg.pub("start", "core/ui");
                var $div = $("<div id='respec-ui' class='removeOnSave'></div>", doc)
                                .css({
                                    position:   "fixed"
                                ,   top:        "20px"
                                ,   right:      "20px"
                                ,   width:      "202px"
                                ,   textAlign:  "right"
                                })
                                .appendTo($("body", doc))
                                ;
                $respecButton = $("<button>ReSpec</button>")
                                    .css({
                                        background:     "#fff"
                                    ,   fontWeight:     "bold"
                                    ,   border:         "1px solid #ccc"
                                    ,   borderRadius:   "5px"
                                    })
                                    .click(function () {
                                        $menu.toggle();
                                    })
                                    .appendTo($div)
                                    ;
                $menu.appendTo($div);
                shortcut.add("Esc", function () {
                    ui.closeModal();
                });
                shortcut.add("Ctrl+Alt+Shift+E", function () {
                    if (buttons.error) buttons.error.click();
                });
                shortcut.add("Ctrl+Alt+Shift+W", function () {
                    if (buttons.warning) buttons.warning.click();
                });
                msg.pub("end", "core/ui");
                cb();
            }
        ,   addCommand: function (label, module, keyShort) {
                var handler = function () {
                    $menu.hide();
                    require([module], function (mod) {
                        mod.show(ui, conf, doc, msg);
                    });
                };
                $("<button></button>")
                    .css({
                        background:     "#fff"
                    ,   border:         "none"
                    ,   borderBottom:   "1px solid #ccc"
                    ,   width:          "100%"
                    ,   textAlign:      "left"
                    ,   fontSize:       "inherit"
                    })
                    .text(label)
                    .click(handler)
                    .appendTo($menu)
                    ;
                    if (keyShort) shortcut.add(keyShort, handler);
            }
        ,   error:  function (msg) {
                errWarn(msg, errors, "error", "#c00", "Errors");
            }
        ,   warning:  function (msg) {
                errWarn(msg, warnings, "warning", "#f60", "Warnings");
            }
        ,   closeModal: function () {
                if ($overlay) $overlay.fadeOut(200, function () { $overlay.remove(); $overlay = null; });
                if (!$modal) return;
                $modal.remove();
                $modal = null;
            }
        ,   freshModal: function (title, content) {
                if ($modal) $modal.remove();
                if ($overlay) $overlay.remove();
                var width = 500;
                $overlay = $("<div id='respec-overlay' class='removeOnSave'></div>").hide();
                $modal = $("<div id='respec-modal' class='removeOnSave'><h3></h3><div class='inside'></div></div>").hide();
                $modal.find("h3").text(title);
                $modal.find(".inside").append(content);
                $("body")
                    .append($overlay)
                    .append($modal);
                $overlay
                    .click(this.closeModal)
                    .css({
                        display:    "block"
                    ,   opacity:    0
                    ,   position:   "fixed"
                    ,   zIndex:     10000
                    ,   top:        "0px"
                    ,   left:       "0px"
                    ,   height:     "100%"
                    ,   width:      "100%"
                    ,   background: "#000"
                    })
                    .fadeTo(200, 0.5)
                    ;
                $modal
                    .css({
                        display:        "block"
                    ,   position:       "fixed"
                    ,   opacity:        0
                    ,   zIndex:         11000
                    ,   left:           "50%"
                    ,   marginLeft:     -(width/2) + "px"
                    ,   top:            "100px"
                    ,   background:     "#fff"
                    ,   border:         "5px solid #666"
                    ,   borderRadius:   "5px"
                    ,   width:          width + "px"
                    ,   padding:        "0 20px 20px 20px"
                    ,   maxHeight:      ($(window).height() - 150) + "px"
                    ,   overflowY:      "auto"
                    })
                    .fadeTo(200, 1)
                    ;
            }
        };
        if (window.respecEvents) respecEvents.sub("error", function (details) {
            ui.error(details);
        });
        if (window.respecEvents) respecEvents.sub("warn", function (details) {
            ui.warning(details);
        });
        return ui;
    }
);

// Module core/include-config
// Inject's the document's configuration into the head as JSON.

define(
  'core/include-config',[],
  function () {
    'use strict';
    return {
      run: function (conf, doc, cb, msg) {
        msg.pub('start', 'core/include-config');
        var initialUserConfig;
        try {
          if (Object.assign) {
            initialUserConfig = Object.assign({}, conf);
          } else {
            initialUserConfig = JSON.parse(JSON.stringify(conf));
          }
        } catch (err) {
          initialUserConfig = {};
        }
        msg.sub('end-all', function () {
          var script = doc.createElement('script');
          script.id = 'initialUserConfig';
          var confFilter = function (key, val) {
            // DefinitionMap contains array of DOM elements that aren't serializable
            // we replace them by their id
            if (key === 'definitionMap') {
              var ret = {};
              Object
                .keys(val)
                .forEach(function (k) {
                  ret[k] = val[k].map(function (d) {
                    return d[0].id;
                  });
                });
              return ret;
            }
            return val;
          };
          script.innerHTML = JSON.stringify(initialUserConfig, confFilter, 2);
          script.type = 'application/json';
          doc.head.appendChild(script);
          conf.initialUserConfig = initialUserConfig;
        });
        msg.pub('end', 'core/include-config');
        cb();
      }
    };
  }
);

/*jshint strict:true, maxcomplexity:5 */
/*globals define*/
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
    function() {
      function castToType(value) {
        var result;
        switch (value.trim()) {
        case "true":
        case "false":
          result = (value === "true");
          break;
        case "null":
          result = null;
          break;
        default:
          result = value;
          break;
        }
        return value;
      }
      return {
        run: function(conf, doc, cb, msg) { //jshint ignore:line
          msg.pub("start", "core/override-configuration");
          var done = function() {
            msg.pub("end", "core/override-configuration");
            cb();
          };

          if (!location.search) {
            return done();
          }

          location.search
            //Remove "?" from search
            .replace(/^\?/, "")
            // The default separator is ";" for key/value pairs
            .split(";")
            .filter(function removeEmpties(item) {
              return Boolean(item);
            })
            .map(function makeKeyValuePairs(item) {
              return item.split("=", 2);
            })
            .map(function decodeKeyValues(keyValue) {
              var key = decodeURI(keyValue[0]);
              var value = decodeURI(keyValue[1].replace(/%3D/g, "="));
              return [key, value];
            })
            .map(function attemptTypeCast(keyValue) {
              return [keyValue[0], castToType(keyValue[1])];
            })
            // try to JSON.parse values, or just use the string otherwise.
            .map(function toJSONifiedValues(keyValue) {
              var key = keyValue[0];
              var value;
              try {
                value = JSON.parse(keyValue[1]);
              } catch (err) {
                value = keyValue[1];
              }
              return [key, value];
            })
            // Override the conf properties by reducing
            .reduce(function reduceIntoConfig(conf, keyValue) {
              conf[keyValue[0]] = keyValue[1];
              return conf;
            }, conf);
          done();
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
                var $root = $(doc.documentElement);
                if (!$root.attr("lang")) {
                    $root.attr("lang", "en");
                    if (!$root.attr("dir")) $root.attr("dir", "ltr");
                }
                msg.pub("end", "core/default-root-attr");
                cb();
            }
        };
    }
);


// Module w3c/l10n
// Looks at the lang attribute on the root element and uses it to manage the config.l10n object so
// that other parts of the system can localise their text

define(
    'w3c/l10n',[],
    function () {
        var l10n = {
            en: {
                    this_version:               "This version:"
                ,   latest_published_version:   "Latest published version:"
                ,   latest_editors_draft:       "Latest editor's draft:"
                ,   editor:                     "Editor:"
                ,   editors:                    "Editors:"
                ,   author:                     "Author:"
                ,   authors:                    "Authors:"
                ,   abstract:                   "Abstract"
                ,   sotd:                       "Status of This Document"
                ,   status_at_publication:      "This section describes the status of this document at the time of its publication. Other documents may supersede this document. A list of current W3C publications and the latest revision of this technical report can be found in the <a href='http://www.w3.org/TR/'>W3C technical reports index</a> at http://www.w3.org/TR/."
                ,   toc:                        "Table of Contents"
                ,   note:                       "Note"
                ,   fig:                        "Fig. "
                ,   bug_tracker:                "Bug tracker:"
                ,   file_a_bug:                 "file a bug"
                ,   open_bugs:                  "open bugs"
                ,   open_parens:                "("
                ,   close_parens:               ")"
            }
            ,   ko: {
                    this_version:               "현재 버전:"
                ,   latest_published_version:   "최신 버전:"
                ,   latest_editors_draft:       "Latest editor's draft:"
                ,   editor:                     "Editor:"
                ,   editors:                    "Editors:"
                ,   author:                     "저자:"
                ,   authors:                    "저자:"
                ,   abstract:                   "요약"
                ,   sotd:                       "현재 문서의 상태"
                ,   status_at_publication:      "This section describes the status of this document at the time of its publication. Other documents may supersede this document. A list of current W3C publications and the latest revision of this technical report can be found in the <a href='http://www.w3.org/TR/'>W3C technical reports index</a> at http://www.w3.org/TR/."
                ,   toc:                        "Table of Contents"
                ,   note:                       "Note"
                ,   fig:                        "그림 "
                ,   bug_tracker:                "Bug tracker:"
                ,   file_a_bug:                 "file a bug"
                ,   open_bugs:                  "open bugs"
                ,   open_parens:                "("
                ,   close_parens:               ")"
            }
            ,   zh: {
                    this_version:               "本版本："
                ,   latest_published_version:   "最新发布草稿："
                ,   latest_editors_draft:       "最新编辑草稿："
                ,   editor:                     "编辑："
                ,   editors:                    "编辑们："
                ,   author:                     "Author:"
                ,   authors:                    "Authors:"
                ,   abstract:                   "摘要"
                ,   sotd:                       "关于本文档"
                ,   status_at_publication:      "本章节描述了本文档的发布状态。其它更新版本可能会覆盖本文档。W3C的文档列 表和最新版本可通过<a href='http://www.w3.org/TR/'>W3C技术报告</a>索引访问。"
                ,   toc:                        "内容大纲"
                ,   note:                       "注"
                ,   fig:                        "圖"
                ,   bug_tracker:                "错误跟踪："
                ,   file_a_bug:                 "反馈错误"
                ,   open_bugs:                  "修正中的错误"
                ,   open_parens:                "（"
                ,   close_parens:               "）"
            }
        };
        l10n["zh-hans"] = l10n.zh;
        l10n["zh-cn"] = l10n.zh;

        return {
            run:    function (config, doc, cb, msg) {
                msg.pub("start", "w3c/l10n");
                var lang = $(doc.documentElement).attr("lang") || "en";
                config.l10n = l10n[lang] ? l10n[lang] : l10n.en;
                msg.pub("end", "w3c/l10n");
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

/*global marked*/
// Module core/markdown
// Handles the optional markdown processing.
//
// Markdown support is optional. It is enabled by setting the `format`
// property of the configuration object to "markdown."
//
// We use marked for parsing Markdown.
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
                return parseInt(header.tagName.charAt(1), 10);
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
                            min = current;
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
                    // the processing done here blows away the ReSpec UI (or rather, the elements
                    // that it needs to reference). So we save a reference to the original element
                    // and re-inject it later
                    var $rsUI = $("#respec-ui");
                    var fragment = this.structure(this.processBody(doc), doc);
                    doc.body.innerHTML = '';
                    doc.body.appendChild(fragment);
                    if ($rsUI.length) $("#respec-ui").replaceWith($rsUI);
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


define('text!core/css/respec2.css',[],function () { return '/*****************************************************************\n * ReSpec 3 CSS\n * Robin Berjon - http://berjon.com/\n *****************************************************************/\n\n/* --- INLINES --- */\nem.rfc2119 { \n    text-transform:     lowercase;\n    font-variant:       small-caps;\n    font-style:         normal;\n    color:              #900;\n}\n\nh1 acronym, h2 acronym, h3 acronym, h4 acronym, h5 acronym, h6 acronym, a acronym,\nh1 abbr, h2 abbr, h3 abbr, h4 abbr, h5 abbr, h6 abbr, a abbr {\n    border: none;\n}\n\ndfn {\n    font-weight:    bold;\n}\n\na.internalDFN {\n    color:  inherit;\n    border-bottom:  1px solid #99c;\n    text-decoration:    none;\n}\n\na.externalDFN {\n    color:  inherit;\n    border-bottom:  1px dotted #ccc;\n    text-decoration:    none;\n}\n\na.bibref {\n    text-decoration:    none;\n}\n\ncite .bibref {\n    font-style: normal;\n}\n\ncode {\n    color:  #C83500;\n}\n\n/* --- TOC --- */\n.toc a, .tof a {\n    text-decoration:    none;\n}\n\na .secno, a .figno {\n    color:  #000;\n}\n\nul.tof, ol.tof {\n    list-style: none outside none;\n}\n\n.caption {\n    margin-top: 0.5em;\n    font-style:   italic;\n}\n\n/* --- TABLE --- */\ntable.simple {\n    border-spacing: 0;\n    border-collapse:    collapse;\n    border-bottom:  3px solid #005a9c;\n}\n\n.simple th {\n    background: #005a9c;\n    color:  #fff;\n    padding:    3px 5px;\n    text-align: left;\n}\n\n.simple th[scope="row"] {\n    background: inherit;\n    color:  inherit;\n    border-top: 1px solid #ddd;\n}\n\n.simple td {\n    padding:    3px 10px;\n    border-top: 1px solid #ddd;\n}\n\n.simple tr:nth-child(even) {\n    background: #f0f6ff;\n}\n\n/* --- DL --- */\n.section dd > p:first-child {\n    margin-top: 0;\n}\n\n.section dd > p:last-child {\n    margin-bottom: 0;\n}\n\n.section dd {\n    margin-bottom:  1em;\n}\n\n.section dl.attrs dd, .section dl.eldef dd {\n    margin-bottom:  0;\n}\n\n@media print {\n    .removeOnSave {\n        display: none;\n    }\n}\n';});


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
                if (conf.extraCSS) {
                    msg.pub("warn", "The 'extraCSS' configuration property is now deprecated.");
                }
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
        // --- JQUERY EXTRAS -----------------------------------------------------------------------
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

        // For any element, returns an array of title strings that applies
        // the algorithm used for determining the
        // actual title of a <dfn> element (but can apply to other as well).
        //
        // if args.isDefinition is true, then the element is a definition, not a
        // reference to a definition.  Any @title or @lt will be replaced with
        // @data-lt to be consistent with Bikeshed / Shepherd.
        //
        // This method now *prefers* the data-lt attribute for the list of
        // titles.  That attribute is added by this method to dfn elements, so
        // subsequent calls to this method will return the data-lt based list.
        //
        // This method will publish a warning if a title is used on a definition
        // instead of an @lt (as per specprod mailing list discussion).
        $.fn.getDfnTitles = function ( args ) {
            var titles = [];
            var theAttr = "";
            var titleString = "";
            var normalizedText = "";
            //data-lt-noDefault avoid using the text content of a definition
            //in the definition list.
            if (this.attr("data-lt-noDefault") === undefined){
                normalizedText = utils.norm(this.text()).toLowerCase();
            }
            // allow @lt to be consistent with bikeshed
            if (this.attr("data-lt") || this.attr("lt")) {
                theAttr = this.attr("data-lt") ? "data-lt" : "lt";
                // prefer @data-lt for the list of title aliases
                titleString = this.attr(theAttr).toLowerCase();
                if (normalizedText !== "") {
                    //Regex: starts with the "normalizedText|"
                    var startsWith = new RegExp("^" + normalizedText + "\\|");
                    // Use the definition itself as first item, so to avoid
                    // having to declare the definition twice.
                    if (!startsWith.test(titleString)) {
                        titleString = normalizedText + "|" + titleString;
                    }
                }
            }
            else if (this.attr("title")) {
                // allow @title for backward compatibility
                titleString = this.attr("title");
                theAttr = "title";
                respecEvents.pub("warn", "Using deprecated attribute @title for '" + this.text() + "': see http://w3.org/respec/guide.html#definitions-and-linking");
            }
            else if (this.contents().length == 1
                     && this.children("abbr, acronym").length == 1
                     && this.find(":first-child").attr("title")) {
                titleString = this.find(":first-child").attr("title");
            }
            else {
                titleString = this.text();
            }
            // now we have a string of one or more titles
            titleString = utils.norm(titleString).toLowerCase();
            if (args && args.isDefinition === true) {
                // if it came from an attribute, replace that with data-lt as per contract with Shepherd
                if (theAttr) {
                    this.attr("data-lt", titleString);
                    this.removeAttr(theAttr) ;
                }
                // if there is no pre-defined type, assume it is a 'dfn'
                if (!this.attr("dfn-type")) {
                    this.attr("data-dfn-type", "dfn");
                }
                else {
                    this.attr("data-dfn-type", this.attr("dfn-type"));
                    this.removeAttr("dfn-type");
                }
            }
            titleString.split('|').forEach( function( item ) {
                    if (item != "") {
                        titles.push(item);
                    }
                });
            return titles;
        };

        // For any element (usually <a>), returns an array of targets that
        // element might refer to, of the form
        // {for_: 'interfacename', title: 'membername'}.
        //
        // For an element like:
        //  <p link-for="Int1"><a for="Int2">Int3.member</a></p>
        // we'll return:
        //  * {for_: "int2", title: "int3.member"}
        //  * {for_: "int3", title: "member"}
        //  * {for_: "", title: "int3.member"}
        $.fn.linkTargets = function () {
            var elem = this;
            var link_for = (elem.attr("for") || elem.attr("data-for") || elem.closest("[link-for]").attr("link-for") || elem.closest("[data-link-for]").attr("data-link-for") || "").toLowerCase();
            var titles = elem.getDfnTitles();
            var result = [];
            $.each(titles, function() {
                    result.push({for_: link_for, title: this});
                    var split = this.split('.');
                    if (split.length === 2) {
                        // If there are multiple '.'s, this won't match an
                        // Interface/member pair anyway.
                        result.push({for_: split[0], title: split[1]});
                    }
                    result.push({for_: "", title: this});
                });
            return result;
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

            // --- RESPEC STUFF -------------------------------------------------------------------------------
        ,   removeReSpec:   function (doc) {
                $(".remove, script[data-requiremodule]", doc).remove();
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

            // Given an object, it converts it to a key value pair separated by
            // ("=", configurable) and a delimiter (" ," configurable).
            // for example, {"foo": "bar", "baz": 1} becomes "foo=bar, baz=1"
        ,   toKeyValuePairs: function(obj, delimiter, separator) {
                if(!separator){
                    separator = "=";
                }
                if(!delimiter){
                    delimiter = ", ";
                }
                return Object.getOwnPropertyNames(obj)
                    .map(function(key){
                        return key + separator + JSON.stringify(obj[key]);
                    })
                    .join(delimiter);
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

/*jshint strict: true, browser:true, jquery: true*/
/*globals define*/
// Module w3c/style
// Inserts a link to the appropriate W3C style for the specification's maturity level.
// CONFIGURATION
//  - specStatus: the short code for the specification's maturity level or type (required)

define(
    'w3c/style',["core/utils"],
    function(utils) {
      function attachFixupScript(doc, version){
        var script = doc.createElement("script");
        script.async = true;
        script.defer = true;
        var helperScript = "https://www.w3.org/scripts/TR/{version}/fixup.js"
          .replace("{version}", version);
        script.src = helperScript;
        doc.head.appendChild(script);
      }

      function attachMetaViewport(doc){
        var meta = doc.createElement("meta");
        meta.name = "viewport";
        var contentProps = {
            "initial-scale": "1.0",
            "shrink-to-fit": "no",
            "width": "device-width",
        };
        meta.content = utils.toKeyValuePairs(contentProps).replace(/\"/g, "")
        doc.head.appendChild(meta);
      }

     function selectStyleVersion(styleVersion){
        var version = "";
        switch (styleVersion) {
        case true:
          version = new Date().getFullYear().toString();
          break;
        default:
          if(styleVersion && !Number.isNaN(styleVersion)){
            version = styleVersion.toString().trim();
          }
        }
        return version;
      }

      return {
        run: function(conf, doc, cb, msg) {
          msg.pub("start", "w3c/style");

          if (!conf.specStatus) {
            var warn = "'specStatus' missing from ReSpec config. Defaulting to 'base'.";
            conf.specStatus = "base";
            msg.pub("warn", warn);
          }

          var styleBaseURL = "https://www.w3.org/StyleSheets/TR/{version}";
          var finalStyleURL = "";
          var styleFile = "W3C-";

          // Figure out which style file to use.
          switch (conf.specStatus){
            case "CG-DRAFT":
            case "CG-FINAL":
            case "BG-DRAFT":
            case "BG-FINAL":
              styleBaseURL = "https://www.w3.org/community/src/css/spec/";
              styleFile = conf.specStatus.toLowerCase();
              break;
            case "FPWD":
            case "LC":
            case "WD-NOTE":
            case "LC-NOTE":
              styleFile += "WD";
              break;
            case "FPWD-NOTE":
              styleFile += "WG-NOTE";
              break;
            case "unofficial":
              styleFile += "UD";
              break;
            case "finding":
            case "finding-draft":
            case "base":
              styleFile = "base";
              break;
            default:
              styleFile += conf.specStatus;
          }

          // Select between released styles and experimental style.
          var version = selectStyleVersion(conf.useExperimentalStyles || null);

          // Make spec mobile friendly by attaching meta viewport
          if (!doc.head.querySelector("meta[name=viewport]")) {
            attachMetaViewport(doc);
          }

          // Attach W3C fixup script after we are done.
          if (version) {
            var subscribeKey = window.respecEvents.sub("end-all", function (){
              attachFixupScript(doc, version);
              window.respecEvents.unsub("end-all", subscribeKey);
            });
          }
          var finalVersionPath = (version) ? version + "/" : "";
          finalStyleURL = styleBaseURL.replace("{version}", finalVersionPath);
          finalStyleURL += styleFile;

          utils.linkCSS(doc, finalStyleURL);
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


define('tmpl!w3c/templates/headers.html', ['handlebars'], function (hb) { return Handlebars.compile('<div class=\'head\'>\n  <p>\n      {{#if logos}}\n        {{showLogos logos}}\n      {{else}}\n        {{#if prependW3C}}\n            <a class=\'logo\' href=\'http://www.w3.org/\'><img width=\'72\' height=\'48\' src=\'https://www.w3.org/Icons/w3c_home\' alt=\'W3C\'></a>\n            {{#if isMemberSubmission}}\n            <a href="http://www.w3.org/Submission/"> <img height="48" width="211" alt="W3C Member Submission" src="http://www.w3.org/Icons/member_subm" /></a>\n            {{/if}}\n            {{#if isTeamSubmission}}\n            <a href="http://www.w3.org/TeamSubmission/"><img height="48" width="211" alt="W3C Team Submission" src="http://www.w3.org/Icons/team_subm"/></a>\n            {{/if}}\n        {{/if}}\n      {{/if}}\n  </p>\n  <h1 class=\'title p-name\' id=\'title\'{{#if doRDFa}} property=\'dcterms:title\'{{/if}}>{{title}}</h1>\n  {{#if subtitle}}\n    <h2 {{#if doRDFa}}property=\'bibo:subtitle\' {{/if}}id=\'subtitle\'>{{subtitle}}</h2>\n  {{/if}}\n  <h2>{{#if prependW3C}}W3C {{/if}}{{textStatus}} <time {{#if doRDFa}}property="dcterms:issued"{{/if}}class=\'dt-published\' datetime=\'{{dashDate}}\'>{{publishHumanDate}}</time></h2>\n  <dl>\n    {{#unless isNoTrack}}\n      <dt>{{l10n.this_version}}</dt>\n      <dd><a class=\'u-url\' href=\'{{thisVersion}}\'>{{thisVersion}}</a></dd>\n      <dt>{{l10n.latest_published_version}}</dt>\n      <dd>{{#if latestVersion}}<a href=\'{{latestVersion}}\'>{{latestVersion}}</a>{{else}}none{{/if}}</dd>\n    {{/unless}}\n    {{#if edDraftURI}}\n      <dt>{{l10n.latest_editors_draft}}</dt>\n      <dd><a href=\'{{edDraftURI}}\'>{{edDraftURI}}</a></dd>\n    {{/if}}\n    {{#if testSuiteURI}}\n      <dt>Test suite:</dt>\n      <dd><a href=\'{{testSuiteURI}}\'>{{testSuiteURI}}</a></dd>\n    {{/if}}\n    {{#if implementationReportURI}}\n      <dt>Implementation report:</dt>\n      <dd><a href=\'{{implementationReportURI}}\'>{{implementationReportURI}}</a></dd>\n    {{/if}}\n    {{#if bugTrackerHTML}}\n      <dt>{{l10n.bug_tracker}}</dt>\n      <dd>{{{bugTrackerHTML}}}</dd>\n    {{/if}}\n    {{#if isED}}\n      {{#if prevED}}\n        <dt>Previous editor\'s draft:</dt>\n        <dd><a href=\'{{prevED}}\'>{{prevED}}</a></dd>\n      {{/if}}\n    {{/if}}\n    {{#if showPreviousVersion}}\n      <dt>Previous version:</dt>\n      <dd><a {{#if doRDFa}}rel="dcterms:replaces"{{/if}} href=\'{{prevVersion}}\'>{{prevVersion}}</a></dd>\n    {{/if}}\n    {{#if prevRecURI}}\n      {{#if isRec}}\n          <dt>Previous Recommendation:</dt>\n          <dd><a {{#if doRDFa}}rel="dcterms:replaces"{{/if}} href=\'{{prevRecURI}}\'>{{prevRecURI}}</a></dd>\n      {{else}}\n          <dt>Latest Recommendation:</dt>\n          <dd><a href=\'{{prevRecURI}}\'>{{prevRecURI}}</a></dd>\n      {{/if}}\n    {{/if}}\n    <dt>{{#if multipleEditors}}{{l10n.editors}}{{else}}{{l10n.editor}}{{/if}}</dt>\n    {{showPeople "Editor" editors}}\n    {{#if authors}}\n      <dt>{{#if multipleAuthors}}{{l10n.authors}}{{else}}{{l10n.author}}{{/if}}</dt>\n      {{showPeople "Author" authors}}\n    {{/if}}\n    {{#if otherLinks}}\n      {{#each otherLinks}}\n        {{#if key}}\n          <dt {{#if class}}class="{{class}}"{{/if}}>{{key}}:</dt>\n          {{#if data}}\n             {{#each data}}\n                {{#if value}}\n                  <dd {{#if class}}class="{{class}}"{{/if}}>\n                    {{#if href}}<a href="{{href}}">{{/if}}\n                      {{value}}\n                    {{#if href}}</a>{{/if}}\n                  </dd>\n                {{else}}\n                  {{#if href}}\n                    <dd><a href="{{href}}">{{href}}</a></dd>\n                  {{/if}}\n                {{/if}}\n             {{/each}}\n          {{else}}\n            {{#if value}}\n              <dd {{#if class}}class="{{class}}"{{/if}}>\n                {{#if href}}<a href="{{href}}">{{/if}}\n                  {{value}}\n                {{#if href}}</a>{{/if}}\n              </dd>\n            {{else}}\n              {{#if href}}\n                <dd {{#if class}}class="{{class}}"{{/if}}>\n                  <a href="{{href}}">{{href}}</a>\n                </dd>\n              {{/if}}\n            {{/if}}\n          {{/if}}\n        {{/if}}\n      {{/each}}\n    {{/if}}\n  </dl>\n  {{#if errata}}\n    <p>\n      Please check the <a href="{{errata}}"><strong>errata</strong></a> for any errors or issues\n      reported since publication.\n    </p>\n  {{/if}}\n  {{#if alternateFormats}}\n    <p>\n      {{#if multipleAlternates}}\n        This document is also available in these non-normative formats:\n      {{else}}\n        This document is also available in this non-normative format:\n      {{/if}}\n      {{{alternatesHTML}}}\n    </p>\n  {{/if}}\n  {{#if isRec}}\n    <p>\n      The English version of this specification is the only normative version. Non-normative\n      <a href="http://www.w3.org/Consortium/Translation/">translations</a> may also be available.\n    </p>\n  {{/if}}\n  {{#if isUnofficial}}\n    {{#if additionalCopyrightHolders}}\n      <p class=\'copyright\'>{{{additionalCopyrightHolders}}}</p>\n    {{else}}\n      {{#if overrideCopyright}}\n        {{{overrideCopyright}}}\n      {{else}}\n        <p class=\'copyright\'>\n          This document is licensed under a\n          <a class=\'subfoot\' href=\'http://creativecommons.org/licenses/by/3.0/\' rel=\'license\'>Creative Commons\n          Attribution 3.0 License</a>.\n        </p>\n      {{/if}}\n    {{/if}}\n  {{else}}\n    {{#if overrideCopyright}}\n      {{{overrideCopyright}}}\n    {{else}}\n      <p class=\'copyright\'>\n        <a href=\'http://www.w3.org/Consortium/Legal/ipr-notice#Copyright\'>Copyright</a> &copy;\n        {{#if copyrightStart}}{{copyrightStart}}-{{/if}}{{publishYear}}\n        {{#if additionalCopyrightHolders}} {{{additionalCopyrightHolders}}} &amp;{{/if}}\n        <a href=\'http://www.w3.org/\'><abbr title=\'World Wide Web Consortium\'>W3C</abbr></a><sup>&reg;</sup>\n        (<a href=\'http://www.csail.mit.edu/\'><abbr title=\'Massachusetts Institute of Technology\'>MIT</abbr></a>,\n        <a href=\'http://www.ercim.eu/\'><abbr title=\'European Research Consortium for Informatics and Mathematics\'>ERCIM</abbr></a>,\n        <a href=\'http://www.keio.ac.jp/\'>Keio</a>, <a href="http://ev.buaa.edu.cn/">Beihang</a>). \n        {{#if isCCBY}}\n          Some Rights Reserved: this document is dual-licensed,\n          <a rel="license" href="https://creativecommons.org/licenses/by/3.0/">CC-BY</a> and\n          <a rel="license" href="http://www.w3.org/Consortium/Legal/copyright-documents">W3C Document License</a>.\n        {{/if}}\n        W3C <a href=\'http://www.w3.org/Consortium/Legal/ipr-notice#Legal_Disclaimer\'>liability</a>,\n        <a href=\'http://www.w3.org/Consortium/Legal/ipr-notice#W3C_Trademarks\'>trademark</a> and\n        {{#if isCCBY}}\n          <a rel="license" href=\'http://www.w3.org/Consortium/Legal/2013/copyright-documents-dual.html\'>document use</a>\n        {{else}}\n          {{#if isW3CSoftAndDocLicense}}\n            <a rel="license" href=\'http://www.w3.org/Consortium/Legal/2015/copyright-software-and-document\'>permissive document license</a>\n          {{else}}\n            <a rel="license" href=\'http://www.w3.org/Consortium/Legal/copyright-documents\'>document use</a>\n          {{/if}}\n        {{/if}}\n        rules apply.\n      </p>\n    {{/if}}\n  {{/if}}\n  <hr title="Separator for header">\n</div>\n');});


define('tmpl!w3c/templates/sotd.html', ['handlebars'], function (hb) { return Handlebars.compile('<section id=\'sotd\' class=\'introductory\'><h2>{{l10n.sotd}}</h2>\n  {{#if isUnofficial}}\n    <p>\n      This document is merely a public working draft of a potential specification. It has\n      no official standing of any kind and does not represent the support or consensus of any\n      standards organisation.\n    </p>\n    {{{sotdCustomParagraph}}}\n  {{else}}\n    {{#if isTagFinding}}\n      {{{sotdCustomParagraph}}}\n    {{else}}\n      {{#if isNoTrack}}\n        <p>\n          This document is merely a W3C-internal {{#if isMO}}member-confidential{{/if}} document. It\n          has no official standing of any kind and does not represent consensus of the W3C\n          Membership.\n        </p>\n        {{{sotdCustomParagraph}}}\n      {{else}}\n        <p>\n          <em>{{{l10n.status_at_publication}}}</em>\n        </p>\n        {{#if isSubmission}}\n          {{{sotdCustomParagraph}}}\n          {{#if isMemberSubmission}}\n            <p>By publishing this document, W3C acknowledges that the <a href="http://www.w3.org/Submission/@@@submissiondoc@@@">Submitting Members</a> have made a formal Submission request to W3C for discussion. Publication of this document by W3C indicates no endorsement of its content by W3C, nor that W3C has, is, or will be allocating any resources to the issues addressed by it. This document is not the product of a chartered W3C group, but is published as potential input to the <a href="http://www.w3.org/Consortium/Process">W3C Process</a>. A <a href="http://www.w3.org/Submission/@@@teamcomment@@@">W3C Team Comment</a> has been published in conjunction with this Member Submission. Publication of acknowledged Member Submissions at the W3C site is one of the benefits of <a href="http://www.w3.org/Consortium/Prospectus/Joining">W3C Membership</a>. Please consult the requirements associated with Member Submissions of <a href="http://www.w3.org/Consortium/Patent-Policy-20040205/#sec-submissions">section 3.3 of the W3C Patent Policy</a>. Please consult the complete <a href="http://www.w3.org/Submission">list of acknowledged W3C Member Submissions</a>.</p>\n          {{else}}\n            {{#if isTeamSubmission}}\n              <p>If you wish to make comments regarding this document, please send them to\n              <a href=\'mailto:{{wgPublicList}}@w3.org{{#if subjectPrefix}}?subject={{subjectPrefixEnc}}{{/if}}\'>{{wgPublicList}}@w3.org</a>\n              (<a href=\'mailto:{{wgPublicList}}-request@w3.org?subject=subscribe\'>subscribe</a>,\n              <a\n                href=\'http://lists.w3.org/Archives/Public/{{wgPublicList}}/\'>archives</a>){{#if subjectPrefix}}\n                with <code>{{subjectPrefix}}</code> at the start of your email\'s subject{{/if}}.</p>\n              <p>Please consult the complete <a href="http://www.w3.org/TeamSubmission/">list of Team Submissions</a>.</p>\n            {{/if}}\n          {{/if}}\n        {{else}}\n          {{#unless sotdAfterWGinfo}}\n          {{{sotdCustomParagraph}}}\n          {{/unless}}\n          {{#unless overrideStatus}}\n          <p>\n            This document was published by {{{wgHTML}}} as {{anOrA}} {{longStatus}}.\n            {{#if notYetRec}}\n              This document is intended to become a W3C Recommendation.\n            {{/if}}\n            {{#unless isPR}}\n              If you wish to make comments regarding this document, please send them to\n              <a href=\'mailto:{{wgPublicList}}@w3.org{{#if subjectPrefix}}?subject={{subjectPrefixEnc}}{{/if}}\'>{{wgPublicList}}@w3.org</a>\n              (<a href=\'mailto:{{wgPublicList}}-request@w3.org?subject=subscribe\'>subscribe</a>,\n              <a\n                href=\'http://lists.w3.org/Archives/Public/{{wgPublicList}}/\'>archives</a>){{#if subjectPrefix}}\n                with <code>{{subjectPrefix}}</code> at the start of your email\'s subject{{/if}}.\n            {{/unless}}\n            {{#if isLC}}The Last Call period ends {{humanLCEnd}}.{{/if}}\n            {{#if isCR}}\n              W3C publishes a Candidate Recommendation to indicate that the document is believed to be\n              stable and to encourage implementation by the developer community. This Candidate\n              Recommendation is expected to advance to Proposed Recommendation no earlier than\n              {{humanCREnd}}.\n            {{/if}}\n            {{#if isPER}}\n                W3C Advisory Committee Members are invited to\n                send formal review comments on this Proposed\n                Edited Recommendation to the W3C Team until\n                {{humanPEREnd}}.\n                Members of the Advisory Committee will find the\n                appropriate review form for this document by\n                consulting their list of current\n                <a href=\'https://www.w3.org/2002/09/wbs/myQuestionnaires\'>WBS questionnaires</a>.\n            {{/if}}\n            {{#if isPR}}\n                The W3C Membership and other interested parties are invited to review the document and\n                send comments to\n                <a rel=\'discussion\' href=\'mailto:{{wgPublicList}}@w3.org\'>{{wgPublicList}}@w3.org</a>\n                (<a href=\'mailto:{{wgPublicList}}-request@w3.org?subject=subscribe\'>subscribe</a>,\n                <a href=\'http://lists.w3.org/Archives/Public/{{wgPublicList}}/\'>archives</a>)\n                through {{humanPREnd}}. Advisory Committee Representatives should consult their\n                <a href=\'https://www.w3.org/2002/09/wbs/myQuestionnaires\'>WBS questionnaires</a>.\n                Note that substantive technical comments were expected during the Last Call review\n                period that ended {{humanLCEnd}}.\n            {{else}}\n              {{#unless isPER}}\n              All comments are welcome.\n              {{/unless}}\n            {{/if}}\n          </p>\n          {{/unless}}\n          {{#if implementationReportURI}}\n            <p>\n              Please see the Working Group\'s  <a href=\'{{implementationReportURI}}\'>implementation\n              report</a>.\n            </p>\n          {{/if}}\n          {{#if sotdAfterWGinfo}}\n          {{{sotdCustomParagraph}}\n          {{/if}}\n          {{#if notRec}}\n            <p>\n              Publication as {{anOrA}} {{textStatus}} does not imply endorsement by the W3C\n              Membership. This is a draft document and may be updated, replaced or obsoleted by other\n              documents at any time. It is inappropriate to cite this document as other than work in\n              progress.\n            </p>\n          {{/if}}\n          {{#if isRec}}\n            <p>\n              This document has been reviewed by W3C Members, by software developers, and by other W3C\n              groups and interested parties, and is endorsed by the Director as a W3C Recommendation.\n              It is a stable document and may be used as reference material or cited from another\n              document. W3C\'s role in making the Recommendation is to draw attention to the\n              specification and to promote its widespread deployment. This enhances the functionality\n              and interoperability of the Web.\n            </p>\n          {{/if}}\n          {{#if isLC}}\n            <p>\n              This is a Last Call Working Draft and thus the Working Group has determined that this\n              document has satisfied the relevant technical requirements and is sufficiently stable to\n              advance through the Technical Recommendation process.\n            </p>\n          {{/if}}\n          <p>\n            {{#unless isIGNote}}\n              This document was produced by\n              {{#if multipleWGs}}\n              groups\n              {{else}}\n              a group\n              {{/if}} operating under the\n              <a{{#if doRDFa}} id="sotd_patent" property=\'w3p:patentRules\'{{/if}}\n              href=\'http://www.w3.org/Consortium/Patent-Policy-20040205/\'>5 February 2004 W3C Patent\n              Policy</a>.\n            {{/unless}}\n            {{#if recNotExpected}}\n              The group does not expect this document to become a W3C Recommendation.\n            {{/if}}\n            {{#unless isIGNote}}\n              {{#if multipleWGs}}\n                W3C maintains {{{wgPatentHTML}}}\n              {{else}}\n                W3C maintains a <a href=\'{{wgPatentURI}}\' rel=\'disclosure\'>public list of any patent\n                disclosures</a>\n              {{/if}}\n              made in connection with the deliverables of\n              {{#if multipleWGs}}\n              each group; these pages also include\n              {{else}}\n              the group; that page also includes\n              {{/if}}\n              instructions for disclosing a patent. An individual who has actual knowledge of a patent\n              which the individual believes contains\n              <a href=\'http://www.w3.org/Consortium/Patent-Policy-20040205/#def-essential\'>Essential\n              Claim(s)</a> must disclose the information in accordance with\n              <a href=\'http://www.w3.org/Consortium/Patent-Policy-20040205/#sec-Disclosure\'>section\n              6 of the W3C Patent Policy</a>.\n            {{/unless}}\n            {{#if isIGNote}}\n              The disclosure obligations of the Participants of this group are described in the\n              <a href=\'{{charterDisclosureURI}}\'>charter</a>.\n            {{/if}}\n          </p>\n          {{#if isNewProcess}}\n            <p>This document is governed by the <a id="w3c_process_revision"\n              href="http://www.w3.org/2015/Process-20150901/">1 September 2015 W3C Process Document</a>.\n            </p>\n          {{else}}\n            <p>\n              This document is governed by the  <a id="w3c_process_revision"\n              href="http://www.w3.org/2005/10/Process-20051014/">14 October 2005 W3C Process Document</a>.\n            </p>\n          {{/if}}\n          {{#if addPatentNote}}<p>{{{addPatentNote}}}</p>{{/if}}\n        {{/if}}\n      {{/if}}\n    {{/if}}\n  {{/if}}\n</section>\n');});


define('tmpl!w3c/templates/cgbg-headers.html', ['handlebars'], function (hb) { return Handlebars.compile('<div class=\'head\'>\n  <p>\n    <a class=\'logo\' href=\'http://www.w3.org/\'><img width=\'72\' height=\'48\' src=\'https://www.w3.org/Icons/w3c_home\' alt=\'W3C\'></a>\n  </p>\n  <h1 class=\'title p-name\' id=\'title\'{{#if doRDFa}} property=\'dc:title\'{{/if}}>{{title}}</h1>\n  {{#if subtitle}}\n    <h2 {{#if doRDFa}}property=\'bibo:subtitle\' {{/if}}id=\'subtitle\'>{{subtitle}}</h2>\n  {{/if}}\n  <h2>{{longStatus}} <time {{#if doRDFa}}property="dc:issued"{{/if}}class=\'dt-published\' datetime=\'{{dashDate}}\'>{{publishHumanDate}}</time></h2>\n  <dl>\n    {{#if thisVersion}}\n      <dt>{{l10n.this_version}}</dt>\n      <dd><a class=\'u-url\' href=\'{{thisVersion}}\'>{{thisVersion}}</a></dd>\n    {{/if}}\n    {{#if latestVersion}}\n      <dt>{{l10n.latest_published_version}}</dt>\n      <dd><a href=\'{{latestVersion}}\'>{{latestVersion}}</a></dd>\n    {{/if}}\n    {{#if edDraftURI}}\n      <dt>{{l10n.latest_editors_draft}}</dt>\n      <dd><a href=\'{{edDraftURI}}\'>{{edDraftURI}}</a></dd>\n    {{/if}}\n    {{#if testSuiteURI}}\n      <dt>Test suite:</dt>\n      <dd><a href=\'{{testSuiteURI}}\'>{{testSuiteURI}}</a></dd>\n    {{/if}}\n    {{#if implementationReportURI}}\n      <dt>Implementation report:</dt>\n      <dd><a href=\'{{implementationReportURI}}\'>{{implementationReportURI}}</a></dd>\n    {{/if}}\n    {{#if bugTrackerHTML}}\n      <dt>{{l10n.bug_tracker}}</dt>\n      <dd>{{{bugTrackerHTML}}}</dd>\n    {{/if}}\n    {{#if prevVersion}}\n      <dt>Previous version:</dt>\n      <dd><a {{#if doRDFa}}rel="dcterms:replaces"{{/if}} href=\'{{prevVersion}}\'>{{prevVersion}}</a></dd>\n    {{/if}}\n    {{#unless isCGFinal}}\n      {{#if prevED}}\n        <dt>Previous editor\'s draft:</dt>\n        <dd><a href=\'{{prevED}}\'>{{prevED}}</a></dd>\n      {{/if}}\n    {{/unless}}\n    <dt>{{#if multipleEditors}}{{l10n.editors}}{{else}}{{l10n.editor}}{{/if}}</dt>\n    {{showPeople "Editor" editors}}\n    {{#if authors}}\n      <dt>{{#if multipleAuthors}}{{l10n.authors}}{{else}}{{l10n.author}}{{/if}}</dt>\n      {{showPeople "Author" authors}}\n    {{/if}}\n    {{#if otherLinks}}\n      {{#each otherLinks}}\n        {{#if key}}\n          <dt {{#if class}}class="{{class}}"{{/if}}>{{key}}:</dt>\n          {{#if data}}\n             {{#each data}}\n                {{#if value}}\n                  <dd {{#if class}}class="{{class}}"{{/if}}>\n                    {{#if href}}<a href="{{href}}">{{/if}}\n                      {{value}}\n                    {{#if href}}</a>{{/if}}\n                  </dd>\n                {{else}}\n                  {{#if href}}\n                    <dd><a href="{{href}}">{{href}}</a></dd>\n                  {{/if}}\n                {{/if}}\n             {{/each}}\n          {{else}}\n            {{#if value}}\n              <dd {{#if class}}class="{{class}}"{{/if}}>\n                {{#if href}}<a href="{{href}}">{{/if}}\n                  {{value}}\n                {{#if href}}</a>{{/if}}\n              </dd>\n            {{else}}\n              {{#if href}}\n                <dd {{#if class}}class="{{class}}"{{/if}}>\n                  <a href="{{href}}">{{href}}</a>\n                </dd>\n              {{/if}}\n            {{/if}}\n          {{/if}}\n        {{/if}}\n      {{/each}}\n    {{/if}}\n  </dl>\n  {{#if alternateFormats}}\n    <p>\n      {{#if multipleAlternates}}\n        This document is also available in these non-normative formats: \n      {{else}}\n        This document is also available in this non-normative format: \n      {{/if}}\n      {{{alternatesHTML}}}\n    </p>\n  {{/if}}\n  <p class=\'copyright\'>\n    <a href=\'http://www.w3.org/Consortium/Legal/ipr-notice#Copyright\'>Copyright</a> &copy; \n    {{#if copyrightStart}}{{copyrightStart}}-{{/if}}{{publishYear}}\n    the Contributors to the {{title}} Specification, published by the\n    <a href=\'{{wgURI}}\'>{{wg}}</a> under the\n    {{#if isCGFinal}}\n      <a href="https://www.w3.org/community/about/agreements/fsa/">W3C Community Final Specification Agreement (FSA)</a>. \n      A human-readable <a href="http://www.w3.org/community/about/agreements/fsa-deed/">summary</a> is available.\n    {{else}}\n      <a href="https://www.w3.org/community/about/agreements/cla/">W3C Community Contributor License Agreement (CLA)</a>.\n      A human-readable <a href="http://www.w3.org/community/about/agreements/cla-deed/">summary</a> is available.\n    {{/if}}\n  </p>\n  <hr title="Separator for header">\n</div>\n');});


define('tmpl!w3c/templates/cgbg-sotd.html', ['handlebars'], function (hb) { return Handlebars.compile('<section id=\'sotd\' class=\'introductory\'><h2>{{l10n.sotd}}</h2>\n  <p>\n    This specification was published by the <a href=\'{{wgURI}}\'>{{wg}}</a>.\n    It is not a W3C Standard nor is it on the W3C Standards Track.\n    {{#if isCGFinal}}\n      Please note that under the \n      <a href="https://www.w3.org/community/about/agreements/final/">W3C Community Final Specification Agreement (FSA)</a> \n      other conditions apply.\n    {{else}}\n      Please note that under the \n      <a href="https://www.w3.org/community/about/agreements/cla/">W3C Community Contributor License Agreement (CLA)</a>\n      there is a limited opt-out and other conditions apply.\n    {{/if}}\n    Learn more about \n    <a href="http://www.w3.org/community/">W3C Community and Business Groups</a>.\n  </p>\n  {{#unless sotdAfterWGinfo}}\n  {{{sotdCustomParagraph}}}\n  {{/unless}}\n    {{#if wgPublicList}}\n      <p>If you wish to make comments regarding this document, please send them to \n      <a href=\'mailto:{{wgPublicList}}@w3.org{{#if subjectPrefix}}?subject={{subjectPrefixEnc}}{{/if}}\'>{{wgPublicList}}@w3.org</a> \n      (<a href=\'mailto:{{wgPublicList}}-request@w3.org?subject=subscribe\'>subscribe</a>,\n      <a\n        href=\'http://lists.w3.org/Archives/Public/{{wgPublicList}}/\'>archives</a>){{#if subjectPrefix}}\n      with <code>{{subjectPrefix}}</code> at the start of your\n      email\'s subject{{/if}}.</p>\n    {{/if}}\n  {{#if sotdAfterWGinfo}}\n  {{{sotdCustomParagraph}}}\n  {{/if}}\n</section>\n');});


define('tmpl!w3c/templates/webspecs-headers.html', ['handlebars'], function (hb) { return Handlebars.compile('<header>\n  <a href="http://specs.webplatform.org/" id="logo">\n    <img alt="Web Platform Specs logo" height="50" src="https://specs.webplatform.org/assets/img/logo.svg" width="50"><br>\n    Web Platform Specs\n  </a>\n  <h1>{{title}}</h1>\n  {{#if subtitle}}\n    <h2>{{subtitle}}</h2>\n  {{/if}}\n  <div id="meta">\n    <button class=\'contributors linkalike\' data-repository="{{repository}}">contributors</button>•\n    <a href="https://github.com/{{repository}}/issues">bugs</a>\n    •\n    <a href="https://github.com/{{repository}}">fork me</a>\n    •\n    <a href="{{licenseInfo.url}}" title="{{licenseInfo.name}}" rel="license">{{licenseInfo.short}}</a>\n    •\n    <span class="date">{{shortISODate}} (<a href="https://github.com/{{repository}}/commits">commit log</a>)</span>\n  </div>\n</header>\n');});

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
//  - logos: a list of logos to use instead of the W3C logo, each of which being defined by:
//          - src: the URI to the logo (target of <img src=>)
//          - alt: alternate text for the image (<img alt=>), defaults to "Logo" or "Logo 1", "Logo 2", ...
//            if src is not specified, this is the text of the "logo"
//          - height: optional height of the logo (<img height=>)
//          - width: optional width of the logo (<img width=>)
//          - url: the URI to the organization represented by the logo (target of <a href=>)
//          - id: optional id for the logo, permits custom CSS (wraps logo in <span id=>)
//          - each logo element must specifiy either src or alt
//  - testSuiteURI: the URI to the test suite, if any
//  - implementationReportURI: the URI to the implementation report, if any
//  - bugTracker: and object with the following details
//      - open: pointer to the list of open bugs
//      - new: pointer to where to raise new bugs
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
//  - license: can be one of the following
//      - "w3c", currently the default (restrictive) license
//      - "cc-by", which is experimentally available in some groups (but likely to be phased out).
//          Note that this is a dual licensing regime.
//      - "cc0", an extremely permissive license. This only works with the webspecs specStatus,
//          and it is only recommended if you are working on a document that is intended to be
//          pushed to the WHATWG
//      - "w3c-software", a permissive and attributions license (but GPL-compatible). This is only
//          available with webspecs and is the recommended value. It is the default for webspecs.
//      - "w3c-software-doc", the W3C Software and Document License
//            http://www.w3.org/Consortium/Legal/2015/copyright-software-and-document


define(
    'w3c/headers',[
        "handlebars"
    ,   "core/utils"
    ,   "tmpl!w3c/templates/headers.html"
    ,   "tmpl!w3c/templates/sotd.html"
    ,   "tmpl!w3c/templates/cgbg-headers.html"
    ,   "tmpl!w3c/templates/cgbg-sotd.html"
    ,   "tmpl!w3c/templates/webspecs-headers.html"
    ],
    function (hb, utils, headersTmpl, sotdTmpl, cgbgHeadersTmpl, cgbgSotdTmpl, wsHeadersTmpl) {
        Handlebars.registerHelper("showPeople", function (name, items) {
            // stuff to handle RDFa
            var re = "", rp = "", rm = "", rn = "", rwu = "", rpu = "", bn = "",
            editorid = "";
            if (this.doRDFa) {
                if (name === "Editor") {
                    bn = "_:editor0";
                    re = " property='bibo:editor' resource='" + bn + "'";
                    rp = " property='rdf:first' typeof='foaf:Person'";
                }
                else if (name === "Author") {
                    rp = " property='dc:contributor' typeof='foaf:Person'";
                }
                rn = " property='foaf:name'";
                rm = " property='foaf:mbox'";
                rwu = " property='foaf:workplaceHomepage'";
                rpu = " property='foaf:homepage'";
                propSeeAlso = " property='rdfs:seeAlso'";
            }
            var ret = "";
            for (var i = 0, n = items.length; i < n; i++) {
                var p = items[i];
                if (p.w3cid) {
                    editorid = " data-editor-id='" + parseInt(p.w3cid, 10) + "'";
                }
                if (this.doRDFa) {
                  ret += "<dd class='p-author h-card vcard' " + re + editorid + "><span" + rp + ">";
                  if (name === "Editor") {
                    // Update to next sequence in rdf:List
                    bn = (i < n - 1) ? ("_:editor" + (i + 1)) : "rdf:nil";
                    re = " resource='" + bn + "'";
                  }
                } else {
                  ret += "<dd class='p-author h-card vcard'" + editorid + ">";
                }
                if (p.url) {
                    if (this.doRDFa) {
                        ret += "<meta" + rn + " content='" + p.name + "'><a class='u-url url p-name fn' " + rpu + " href='" + p.url + "'>" + p.name + "</a>";
                    }
                    else ret += "<a class='u-url url p-name fn' href='" + p.url + "'>" + p.name + "</a>";
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
                if (p.extras) {
                    var self = this;
                    var resultHTML = p.extras
                      // Remove empty names
                      .filter(function (extra) {
                        return extra.name && extra.name.trim();
                      })
                      // Convert to HTML
                      .map(function (extra) {
                        var span = document.createElement('span');
                        var textContainer = span;
                        if (extra.class) {
                          span.className = extra.class;
                        }
                        if (extra.href) {
                          var a = document.createElement('a');
                          span.appendChild(a);
                          a.href = extra.href;
                          textContainer = a;
                          if (self.doRDFa) {
                            a.setAttribute('property', 'rdfs:seeAlso');
                          }
                        }
                        textContainer.innerHTML = extra.name;
                        return span.outerHTML;
                      })
                      .join(', ');
                    ret += ", " + resultHTML;
                }
                if (this.doRDFa) {
                  ret += "</span>\n";
                  if (name === "Editor") ret += "<span property='rdf:rest' resource='" + bn + "'></span>\n";
                }
                ret += "</dd>\n";
            }
            return new Handlebars.SafeString(ret);
        });

        Handlebars.registerHelper("showLogos", function (items) {
            var ret = "<p>";
            for (var i = 0, n = items.length; i < n; i++) {
                var p = items[i];
                if (p.url) ret += "<a href='" + p.url + "'>";
                if (p.id)  ret += "<span id='" + p.id + "'>";
                if (p.src) {
                    ret += "<img src='" + p.src + "'";
                    if (p.width)  ret += " width='" + p.width + "'";
                    if (p.height) ret += " height='" + p.height + "'";
                    if (p.alt) ret += " alt='" + p.alt + "'";
                    else if (items.length == 1) ret += " alt='Logo'";
                    else ret += " alt='Logo " + (i + 1) + "'";
                    ret += ">";
                }
                else if (p.alt) ret += p.alt;
                if (p.url) ret += "</a>";
                if (p.id) ret += "</span>";
            }
            ret += "</p>";
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
                NOTE:           "Working Group Note"
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
            ,   "CG-DRAFT":     "Draft Community Group Report"
            ,   "CG-FINAL":     "Final Community Group Report"
            ,   "BG-DRAFT":     "Draft Business Group Report"
            ,   "BG-FINAL":     "Final Business Group Report"
            }
        ,   status2long:    {
                "FPWD-NOTE":    "First Public Working Group Note"
            ,   "LC-NOTE":      "Last Call Working Draft"
            }
        ,   recTrackStatus: ["FPWD", "WD", "FPLC", "LC", "CR", "PR", "PER", "REC"]
        ,   noTrackStatus:  ["MO", "unofficial", "base", "finding", "draft-finding", "CG-DRAFT", "CG-FINAL", "BG-DRAFT", "BG-FINAL", "webspec"]
        ,   cgbg:           ["CG-DRAFT", "CG-FINAL", "BG-DRAFT", "BG-FINAL"]
        ,   precededByAn:   ["ED", "IG-NOTE"]
        ,   licenses: {
                cc0: {
                  name: "Creative Commons 0 Public Domain Dedication",
                  short: "CC0",
                  url: "http://creativecommons.org/publicdomain/zero/1.0/",
                },
                "w3c-software": {
                  name: "W3C Software Notice and License",
                  short: "W3C Software",
                  url: "http://www.w3.org/Consortium/Legal/2002/copyright-software-20021231",
                },
                "w3c-software-doc": {
                  name: "W3C Software and Document Notice and License",
                  short: "W3C Software and Document",
                  url: "http://www.w3.org/Consortium/Legal/2015/copyright-software-and-document",
                },
                "cc-by": {
                  name: "Creative Commons Attribution 4.0 International Public License",
                  short: "CC-BY",
                  url: "http://creativecommons.org/licenses/by/4.0/legalcode",
                }
            }
        ,   run:    function (conf, doc, cb, msg) {
                msg.pub("start", "w3c/headers");
                // Default include RDFa document metadata
                if (conf.doRDFa === undefined) conf.doRDFa = true;
                // validate configuration and derive new configuration values
                if (!conf.license) conf.license = (conf.specStatus === "webspec") ? "w3c-software" : "w3c";
                conf.isCCBY = conf.license === "cc-by";
                conf.isW3CSoftAndDocLicense = conf.license === "w3c-software-doc";
                if (conf.specStatus === "webspec" && !$.inArray(conf.license, ["cc0", "w3c-software"]))
                    msg.pub("error", "You cannot use that license with WebSpecs.");
                if (conf.specStatus !== "webspec" && !$.inArray(conf.license, ["cc-by", "w3c"]))
                    msg.pub("error", "You cannot use that license with that type of document.");
                conf.licenseInfo = this.licenses[conf.license];
                conf.isCGBG = $.inArray(conf.specStatus, this.cgbg) >= 0;
                conf.isCGFinal = conf.isCGBG && /G-FINAL$/.test(conf.specStatus);
                conf.isBasic = (conf.specStatus === "base");
                conf.isWebSpec = (conf.specStatus === "webspec");
                conf.isRegular = (!conf.isCGBG && !conf.isBasic && !conf.isWebSpec);
                if (!conf.specStatus) msg.pub("error", "Missing required configuration: specStatus");
                if (conf.isRegular && !conf.shortName) msg.pub("error", "Missing required configuration: shortName");
                if (conf.isWebSpec && !conf.repository) msg.pub("error", "Missing required configuration: repository (as in 'darobin/respec')");
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
                conf.isMemberSubmission = conf.specStatus === "Member-SUBM";
                conf.isTeamSubmission = conf.specStatus === "Team-SUBM";
                conf.isSubmission = conf.isMemberSubmission || conf.isTeamSubmission;
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
                if (conf.isRegular) conf.thisVersion =  "http://www.w3.org/" + publishSpace + "/" +
                                                          conf.publishDate.getFullYear() + "/" +
                                                          conf.maturity + "-" + conf.shortName + "-" +
                                                          utils.concatDate(conf.publishDate) + "/";
                if (conf.specStatus === "ED") conf.thisVersion = conf.edDraftURI;
                if (conf.isRegular) conf.latestVersion = "http://www.w3.org/" + publishSpace + "/" + conf.shortName + "/";
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
                    else if (conf.isBasic || conf.isWebSpec) {
                        conf.prevVersion = "";
                    }
                    else {
                        conf.prevVersion = "http://www.w3.org/TR/" + conf.previousPublishDate.getFullYear() + "/" + pmat + "-" +
                                           conf.shortName + "-" + utils.concatDate(conf.previousPublishDate) + "/";
                    }
                }
                else {
                    if (!/NOTE$/.test(conf.specStatus) && conf.specStatus !== "FPWD" && conf.specStatus !== "FPLC" && conf.specStatus !== "ED" && !conf.noRecTrack && !conf.isNoTrack && !conf.isSubmission)
                        msg.pub("error", "Document on track but no previous version: Add previousMaturity previousPublishDate to ReSpec's config.");
                    if (!conf.prevVersion) conf.prevVersion = "";
                }
                if (conf.prevRecShortname && !conf.prevRecURI) conf.prevRecURI = "http://www.w3.org/TR/" + conf.prevRecShortname;
                if (!conf.editors || conf.editors.length === 0) msg.pub("error", "At least one editor is required");
                var peopCheck = function (it) {
                    if (!it.name) msg.pub("error", "All authors and editors must have a name.");
                };
                if (conf.editors) {
                    conf.editors.forEach(peopCheck);
                }
                if (conf.authors) {
                    conf.authors.forEach(peopCheck);
                }
                conf.multipleEditors = conf.editors && conf.editors.length > 1;
                conf.multipleAuthors = conf.authors && conf.authors.length > 1;
                $.each(conf.alternateFormats || [], function (i, it) {
                    if (!it.uri || !it.label) msg.pub("error", "All alternate formats must have a uri and a label.");
                });
                conf.multipleAlternates = conf.alternateFormats && conf.alternateFormats.length > 1;
                conf.alternatesHTML = utils.joinAnd(conf.alternateFormats, function (alt) {
                    var optional = (alt.hasOwnProperty("lang") && alt.lang) ? " hreflang='" + alt.lang + "'" : "";
                    optional += (alt.hasOwnProperty("type") && alt.type) ? " type='" + alt.type + "'" : "";
                    return "<a rel='alternate' href='" + alt.uri + "'" + optional + ">" + alt.label + "</a>";
                });
                if (conf.bugTracker) {
                    if (conf.bugTracker["new"] && conf.bugTracker.open) {
                        conf.bugTrackerHTML = "<a href='" + conf.bugTracker["new"] + "'>" + conf.l10n.file_a_bug + "</a> " +
                                              conf.l10n.open_parens + "<a href='" + conf.bugTracker.open + "'>" +
                                              conf.l10n.open_bugs + "</a>" + conf.l10n.close_parens;
                    }
                    else if (conf.bugTracker.open) {
                        conf.bugTrackerHTML = "<a href='" + conf.bugTracker.open + "'>open bugs</a>";
                    }
                    else if (conf.bugTracker["new"]) {
                        conf.bugTrackerHTML = "<a href='" + conf.bugTracker["new"] + "'>file a bug</a>";
                    }
                }
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
                conf.showPreviousVersion = (conf.specStatus !== "FPWD" && conf.specStatus !== "FPLC" && conf.specStatus !== "ED" && !conf.isNoTrack && !conf.isSubmission);
                if (/NOTE$/.test(conf.specStatus) && !conf.prevVersion) conf.showPreviousVersion = false;
                if (conf.isTagFinding) conf.showPreviousVersion = conf.previousPublishDate ? true : false;
                conf.notYetRec = (conf.isRecTrack && conf.specStatus !== "REC");
                conf.isRec = (conf.isRecTrack && conf.specStatus === "REC");
                if (conf.isRec && !conf.errata)
                    msg.pub("error", "Recommendations must have an errata link.");
                conf.notRec = (conf.specStatus !== "REC");
                conf.isUnofficial = conf.specStatus === "unofficial";
                conf.prependW3C = !conf.isUnofficial;
                conf.isED = (conf.specStatus === "ED");
                conf.isLC = (conf.specStatus === "LC" || conf.specStatus === "FPLC");
                conf.isCR = (conf.specStatus === "CR");
                conf.isPR = (conf.specStatus === "PR");
                conf.isPER = (conf.specStatus === "PER");
                conf.isMO = (conf.specStatus === "MO");
                conf.isIGNote = (conf.specStatus === "IG-NOTE");
                conf.dashDate = utils.concatDate(conf.publishDate, "-");
                conf.publishISODate = utils.isoDate(conf.publishDate);
                conf.shortISODate = conf.publishISODate.replace(/T.*/, "");
                conf.processVersion = conf.processVersion || "2015";
                if (conf.processVersion == "2014") {
                    msg.pub("warn", "Process " + conf.processVersion + " has been superceded by Process 2015.");
                    conf.processVersion = "2015";
                }
                conf.isNewProcess = conf.processVersion == "2015";
                // configuration done - yay!

                // annotate html element with RFDa
                if (conf.doRDFa) {
                    if (conf.rdfStatus) $("html").attr("typeof", "bibo:Document " + conf.rdfStatus );
                    else $("html").attr("typeof", "bibo:Document ");
                    var prefixes = "bibo: http://purl.org/ontology/bibo/ w3p: http://www.w3.org/2001/02pd/rec54#";
                    $("html").attr("prefix", prefixes);
                    $("html>head").prepend($("<meta lang='' property='dc:language' content='en'>"));
                }
                // insert into document and mark with microformat
                var bp;
                if (conf.isCGBG) bp = cgbgHeadersTmpl(conf);
                else if (conf.isWebSpec) bp = wsHeadersTmpl(conf);
                else bp = headersTmpl(conf);
                $("body", doc).prepend($(bp)).addClass("h-entry");

                // handle SotD
                var $sotd = $("#sotd");
                if ((conf.isCGBG || !conf.isNoTrack || conf.isTagFinding) && !$sotd.length)
                    msg.pub("error", "A custom SotD paragraph is required for your type of document.");
                conf.sotdCustomParagraph = $sotd.html();
                $sotd.remove();
                // NOTE:
                //  When arrays, wg and wgURI have to be the same length (and in the same order).
                //  Technically wgURI could be longer but the rest is ignored.
                //  However wgPatentURI can be shorter. This covers the case where multiple groups
                //  publish together but some aren't used for patent policy purposes (typically this
                //  happens when one is foolish enough to do joint work with the TAG). In such cases,
                //  the groups whose patent policy applies need to be listed first, and wgPatentURI
                //  can be shorter — but it still needs to be an array.
                var wgPotentialArray = [conf.wg, conf.wgURI, conf.wgPatentURI];
                if (
                    wgPotentialArray.some(function (it) { return $.isArray(it); }) &&
                    wgPotentialArray.some(function (it) { return !$.isArray(it); })
                ) msg.pub("error", "If one of 'wg', 'wgURI', or 'wgPatentURI' is an array, they all have to be.");
                if ($.isArray(conf.wg)) {
                    conf.multipleWGs = conf.wg.length > 1;
                    conf.wgHTML = utils.joinAnd(conf.wg, function (wg, idx) {
                        return "the <a href='" + conf.wgURI[idx] + "'>" + wg + "</a>";
                    });
                    var pats = [];
                    for (var i = 0, n = conf.wg.length; i < n; i++) {
                        pats.push("a <a href='" + conf.wgPatentURI[i] + "' rel='disclosure'>"
                                  + "public list of any patent disclosures  (" + conf.wg[i]
                                  + ")</a>");
                    }
                    conf.wgPatentHTML = utils.joinAnd(pats);
                }
                else {
                    conf.multipleWGs = false;
                    conf.wgHTML = "the <a href='" + conf.wgURI + "'>" + conf.wg + "</a>";
                }
                if (conf.isLC && !conf.lcEnd) msg.pub("error", "Status is LC but no lcEnd is specified");
                if (conf.specStatus === "PR" && !conf.lcEnd) msg.pub("error", "Status is PR but no lcEnd is specified (needed to indicate end of previous LC)");
                conf.humanLCEnd = utils.humanDate(conf.lcEnd || "");
                if (conf.specStatus === "CR" && !conf.crEnd) msg.pub("error", "Status is CR but no crEnd is specified");
                conf.humanCREnd = utils.humanDate(conf.crEnd || "");
                if (conf.specStatus === "PR" && !conf.prEnd) msg.pub("error", "Status is PR but no prEnd is specified");
                conf.humanPREnd = utils.humanDate(conf.prEnd || "");
                conf.humanPEREnd = utils.humanDate(conf.perEnd || "");
                if (conf.specStatus === "PER" && !conf.perEnd) msg.pub("error", "Status is PER but no perEnd is specified");

                conf.recNotExpected = (!conf.isRecTrack && conf.maturity == "WD" && conf.specStatus !== "FPWD-NOTE");
                if (conf.isIGNote && !conf.charterDisclosureURI)
                    msg.pub("error", "IG-NOTEs must link to charter's disclosure section using charterDisclosureURI");
                // ensure subjectPrefix is encoded before using template
                if (conf.subjectPrefix !== "") conf.subjectPrefixEnc = encodeURIComponent(conf.subjectPrefix);
                var sotd;
                if (conf.isCGBG) sotd = cgbgSotdTmpl(conf);
                else if (conf.isWebSpec) sotd = null;
                else sotd = sotdTmpl(conf);
                if (sotd) $(sotd).insertAfter($("#abstract"));

                if (!conf.implementationReportURI && (conf.isCR || conf.isPR || conf.isRec)) {
                    msg.pub("error", "CR, PR, and REC documents need to have an implementationReportURI defined.");
                }
                if (conf.isTagFinding && !conf.sotdCustomParagraph) {
                    msg.pub("error", "ReSpec does not support automated SotD generation for TAG findings, " +
                                     "please specify one using a <code><section></code> element with ID=sotd.");
                }
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
                if ($abs.length) {
                    if ($abs.find("p").length === 0) $abs.contents().wrapAll($("<p></p>"));
                    $abs.prepend("<h2>" + conf.l10n.abstract + "</h2>");
                    $abs.addClass("introductory");
                    if (conf.doRDFa) {
                        var rel = "dc:abstract"
                        ,   ref = $abs.attr("property");
                        if (ref) rel = ref + " " + rel;
                        $abs.attr({ property: rel });
                    }
                }
                else msg.pub("error", "Document must have one element with ID 'abstract'");
                msg.pub("end", "w3c/abstract");
                cb();
            }
        };
    }
);


define('tmpl!w3c/templates/conformance.html', ['handlebars'], function (hb) { return Handlebars.compile('<h2>Conformance</h2>\n<p>\n  As well as sections marked as non-normative, all authoring guidelines, diagrams, examples,\n  and notes in this specification are non-normative. Everything else in this specification is\n  normative.\n</p>\n<p id=\'respecRFC2119\'>\n  to be interpreted as described in [[!RFC2119]].\n</p>\n');});


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
                    var content;
                    try {
                        content = utils.runTransforms($n.html(), flist);
                    }
                    catch (e) {
                        msg.pub("error", e);
                    }
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
//  - respecRFC2119: a list of the number of times each RFC2119
//    key word was used.  NOTE: While each member is a counter, at this time
//    the counter is not used.

define(
    'core/inlines',["core/utils"],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/inlines");
                doc.normalize();
                if (!conf.normativeReferences) conf.normativeReferences = {};
                if (!conf.informativeReferences) conf.informativeReferences = {};
                if (!conf.respecRFC2119) conf.respecRFC2119 = {};

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
                                    "(?:\\[\\[(?:!|\\\\)?[A-Za-z0-9\\.-]+\\]\\])" + ( abbrRx ? "|" + abbrRx : "") + ")");
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
                                matched = matched.split(/\s+/).join(" ");
                                df.appendChild($("<em/>").attr({ "class": "rfc2119", title: matched }).text(matched)[0]);
                                // remember which ones were used
                                conf.respecRFC2119[matched] = true;
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


// Module core/dfn
// Finds all <dfn> elements and populates conf.definitionMap to identify them.
define(
    'core/dfn',[],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/dfn");
                doc.normalize();
                $("[dfn-for]").each(function() {
                    this.setAttribute("data-dfn-for", this.getAttribute("dfn-for").toLowerCase());
                    this.removeAttribute("dfn-for");
                });
                if (!conf.definitionMap) conf.definitionMap = {};
                $("dfn").each(function () {
                    var dfn = $(this);
                    if (dfn.attr("for")) {
                        dfn.attr("data-dfn-for", dfn.attr("for").toLowerCase());
                        dfn.removeAttr("for");
                    } else {
                        dfn.attr("data-dfn-for", (dfn.closest("[data-dfn-for]").attr("data-dfn-for") || "").toLowerCase());
                    }
                    var titles = dfn.getDfnTitles( { isDefinition: true } );
                    titles.forEach( function( item ) {
                        if (!conf.definitionMap[item]) {
                            conf.definitionMap[item] = [];
                        }
                        conf.definitionMap[item].push($(dfn[0]));
                        });
                });
                msg.pub("end", "core/dfn");
                cb();
            }
        };
    }
);

// Module w3c/rfc2119
// update the 2119 terms section with the terms actually used

define(
    'w3c/rfc2119',["core/utils"],
    function (utils) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "w3c/rfc2119");
                var $confo = $("#respecRFC2119");
                if ($confo.length) {
                    // do we have a list of used RFC2119 items in
                    // conf.respecRFC2119
                    var used = Object.getOwnPropertyNames(conf.respecRFC2119).sort() ;
                    if (used && used.length) {
                        // put in the 2119 clause and reference
                        var str = "The " ;
                        var mapper = function(item) {
                            var ret = "<em class='rfc2119' title='"+item+"'>"+item+"</em>" ;
                            return ret;
                        };

                        if (used.length > 1) {
                            str += "key words " + utils.joinAnd(used, mapper) + " are ";
                        }
                        else {
                            str += "key word " + utils.joinAnd(used, mapper) + " is " ;
                        }
                        str += $confo[0].innerHTML ;
                        $confo[0].innerHTML = str ;
                    }
                    else {
                        // there are no terms used - remove the
                        // clause
                        $confo.remove() ;
                    }
                }
                msg.pub("end", "w3c/rfc2119");
                cb();
            }
        };
    }
);


define('text!core/css/examples.css',[],function () { return '/* --- EXAMPLES --- */\ndiv.example-title {\n    min-width: 7.5em;\n    color: #b9ab2d;\n}\ndiv.example-title span {\n    text-transform: uppercase;\n}\naside.example, div.example, div.illegal-example {\n    padding: 0.5em;\n    margin: 1em 0;\n    position: relative;\n    clear: both;\n}\ndiv.illegal-example { color: red }\ndiv.illegal-example p { color: black }\naside.example, div.example {\n    padding: .5em;\n    border-left-width: .5em;\n    border-left-style: solid;\n    border-color: #e0cb52;\n    background: #fcfaee;\n}\n\naside.example div.example {\n    border-left-width: .1em;\n    border-color: #999;\n    background: #fff;\n}\naside.example div.example div.example-title {\n    color: #999;\n}\n';});


define('text!core/css/examples-webspecs.css',[],function () { return '/* --- EXAMPLES CONFLICTING WITH WEBSPECS --- */\naside.example:before, div.example:before, div.illegal-example:before, pre.example:before {\n    content:    "" !important;\n    display:    none;\n}\ndiv.example-title {\n    color: #ef0000;\n}\n';});


// Module core/examples
// Manages examples, including marking them up, numbering, inserting the title,
// and reindenting.
// Examples are any pre element with class "example" or "illegal-example".
// When an example is found, it is reported using the "example" event. This can
// be used by a containing shell to extract all examples.

define(
    'core/examples',["text!core/css/examples.css", "text!core/css/examples-webspecs.css"],
    function (css, cssKraken) {
        var makeTitle = function (conf, $el, num, report) {
            var txt = (num > 0) ? " " + num : ""
            ,   $tit = $("<div class='example-title'><span>Example" + txt + "</span></div>");
            report.title = $el.attr("title");
            if (report.title) {
                $tit.append($("<span style='text-transform: none'>: " + report.title + "</span>"));
                $el.removeAttr("title");
            }
            if (conf.useExperimentalStyles) {
                $tit.addClass("marker") ;
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
                    if (conf.specStatus === "webspec") css += cssKraken;
                    $(doc).find("head link").first().before($("<style/>").text(css));
                    $exes.each(function (i, ex) {
                        var $ex = $(ex)
                        ,   report = { number: num, illegal: $ex.hasClass("illegal-example") }
                        ;
                        if ($ex.is("aside")) {
                            num++;
                            var $tit = makeTitle(conf, $ex, num, report);
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
                            if (conf.useExperimentalStyles) {
                                $ex.removeClass("example illegal-example");
                            }
                            // wrap
                            var $div = $("<div class='example'></div>")
                            ,   $tit = makeTitle(conf, $ex, inAside ? 0 : num, report)
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


define('text!core/css/issues-notes.css',[],function () { return '/* --- ISSUES/NOTES --- */\ndiv.issue-title, div.note-title , div.ednote-title, div.warning-title {\n    padding-right:  1em;\n    min-width: 7.5em;\n    color: #b9ab2d;\n}\ndiv.issue-title { color: #e05252; }\ndiv.note-title, div.ednote-title { color: #2b2; }\ndiv.warning-title { color: #f22; }\ndiv.issue-title span, div.note-title span, div.ednote-title span, div.warning-title span {\n    text-transform: uppercase;\n}\ndiv.note, div.issue, div.ednote, div.warning {\n    margin-top: 1em;\n    margin-bottom: 1em;\n}\n.note > p:first-child, .ednote > p:first-child, .issue > p:first-child, .warning > p:first-child { margin-top: 0 }\n.issue, .note, .ednote, .warning {\n    padding: .5em;\n    border-left-width: .5em;\n    border-left-style: solid;\n}\ndiv.issue, div.note , div.ednote,  div.warning {\n    padding: 1em 1.2em 0.5em;\n    margin: 1em 0;\n    position: relative;\n    clear: both;\n}\nspan.note, span.ednote, span.issue, span.warning { padding: .1em .5em .15em; }\n\n.issue {\n    border-color: #e05252;\n    background: #fbe9e9;\n}\n.note, .ednote {\n    border-color: #52e052;\n    background: #e9fbe9;\n}\n\n.warning {\n    border-color: #f11;\n    border-right-width: .2em;\n    border-top-width: .2em;\n    border-bottom-width: .2em;\n    border-style: solid;\n    background: #fbe9e9;\n}\n\n.warning-title:before{\n    content: "⚠"; /*U+26A0 WARNING SIGN*/\n    font-size: 3em;\n    float: left;\n    height: 100%;\n    padding-right: .3em;\n    vertical-align: top;\n    margin-top: -0.5em;\n}\n\nli.task-list-item {\n    list-style: none;\n}\n\ninput.task-list-item-checkbox {\n    margin: 0 0.35em 0.25em -1.6em;\n    vertical-align: middle;\n}\n';});

// Helpers for the GitHub API.

define(
    'github',[],
    function () {
        function findNext(header) {
            // Finds the next URL of paginated resources which
            // is available in the Link header. Link headers look like this:
            // Link: <url1>; rel="next", <url2>; rel="foo"; bar="baz"
            // More info here: https://developer.github.com/v3/#link-header
            var m = (header||"").match(/<([^>]+)>\s*;\s*rel="next"/);
            return (m && m[1]) || null;
        }

        function fetch(url, options) {
            if (options) {
                options.url = url;
                url = options;
            }
            return $.ajax(url);
        }
        function fetchAll(url, options) {
            return _fetchAll(url, options, []);
        }

        function _fetchAll(url, options, output) {
            var request = fetch(url, options);
            return request.then(function(resp) {
                output.push.apply(output, resp);
                var next = findNext(request.getResponseHeader("Link"));
                return next ? _fetchAll(next, options, output) : output;
            });
        }

        return {
            fetch: fetch,
            fetchAll: fetchAll,
            fetchIndex: function(url, options) {
                // converts URLs of the form:
                // https://api.github.com/repos/user/repo/comments{/number}
                // into:
                // https://api.github.com/repos/user/repo/comments
                // which is what you need if you want to get the index.
                return fetchAll(url.replace(/\{[^}]+\}/, ""), options);
            }
        };
    }
);

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
  'core/issues-notes',["text!core/css/issues-notes.css", "github"],
  function(css, github) {
    return {
      run: function(conf, doc, cb, msg) {
        function onEnd() {
          msg.pub("end", "core/issues-notes");
          cb();
        }

        function handleIssues($ins, ghIssues, issueBase) {
          $(doc).find("head link").first().before($("<style/>").text(css));
          var hasDataNum = $(".issue[data-number]").length > 0,
            issueNum = 0,
            $issueSummary = $("<div><h2>Issue Summary</h2><ul></ul></div>"),
            $issueList = $issueSummary.find("ul");
          $ins.each(function(i, inno) {
            var $inno = $(inno),
              isIssue = $inno.hasClass("issue"),
              isWarning = $inno.hasClass("warning"),
              isEdNote = $inno.hasClass("ednote"),
              isFeatureAtRisk = $inno.hasClass("atrisk"),
              isInline = $inno.css("display") != "block",
              dataNum = $inno.attr("data-number"),
              report = {
                inline: isInline,
                content: $inno.html()
              };
            report.type = isIssue ? "issue" : isWarning ? "warning" : isEdNote ? "ednote" : "note";
            if (isIssue && !isInline && !hasDataNum) {
              issueNum++;
              report.number = issueNum;
            } else if (dataNum) {
              report.number = dataNum;
            }
            // wrap
            if (!isInline) {
              var $div = $("<div class='" + report.type + (isFeatureAtRisk ? " atrisk" : "") + "'></div>"),
                $tit = $("<div class='" + report.type + "-title'><span></span></div>"),
                text = isIssue ? (isFeatureAtRisk ? "Feature at Risk" : "Issue") : isWarning ? "Warning" : isEdNote ? "Editor's Note" : conf.l10n.note,
                ghIssue;
              report.title = $inno.attr("title");
              if (isIssue) {
                if (hasDataNum) {
                  if (dataNum) {
                    text += " " + dataNum;
                    // Set issueBase to cause issue to be linked to the external issue tracker
                    if (!isFeatureAtRisk && issueBase) {
                      $tit.find("span").wrap($("<a href='" + issueBase + dataNum + "'/>"));
                    } else if (isFeatureAtRisk && conf.atRiskBase) {
                      $tit.find("span").wrap($("<a href='" + conf.atRiskBase + dataNum + "'/>"));
                    }
                    ghIssue = ghIssues[dataNum];
                    if (ghIssue && !report.title) {
                      report.title = ghIssue.title;
                    }
                  }
                } else {
                  text += " " + issueNum;
                }
                if (report.number !== undefined) {
                  // Add entry to #issue-summary.
                  var id = "issue-" + report.number,
                    $li = $("<li><a></a></li>"),
                    $a = $li.find("a");
                  $div.attr("id", id);
                  $a.attr("href", "#" + id).text("Issue " + report.number);
                  if (report.title) {
                    $li.append($("<span style='text-transform: none'>: " + report.title + "</span>"));
                  }
                  $issueList.append($li);
                }
              }
              $tit.find("span").text(text);
              if (report.title) {
                $tit.append($("<span style='text-transform: none'>: " + report.title + "</span>"));
                $inno.removeAttr("title");
              }
              if (conf.useExperimentalStyles) {
                $tit.addClass("marker");
              }
              $div.append($tit);
              $inno.replaceWith($div);
              var body = $inno.removeClass(report.type).removeAttr("data-number");
              if (ghIssue && !body.text().trim()) {
                body = ghIssue.body_html;
              }
              $div.append(body);
            }
            msg.pub(report.type, report);
          });
          if ($(".issue").length) {
            if ($("#issue-summary")) $("#issue-summary").append($issueSummary.contents());
          } else if ($("#issue-summary").length) {
            msg.pub("warn", "Using issue summary (#issue-summary) but no issues found.");
            $("#issue-summary").remove();
          }
        }
        msg.pub("start", "core/issues-notes");
        var $ins = $(".issue, .note, .warning, .ednote"),
          ghIssues = {},
          issueBase = conf.issueBase;
        if ($ins.length) {
          if (conf.githubAPI) {
            github.fetch(conf.githubAPI).then(function(json) {
              issueBase = issueBase || json.html_url + "/issues/";
              return github.fetchIndex(json.issues_url, {
                // Get back HTML content instead of markdown
                // See: https://developer.github.com/v3/media/
                headers: {
                  Accept: "application/vnd.github.v3.html+json"
                }
              });
            }).then(function(issues) {
              issues.forEach(function(issue) {
                ghIssues[issue.number] = issue;
              });
              handleIssues($ins, ghIssues, issueBase);
              onEnd();
            });
          } else {
            handleIssues($ins, ghIssues, issueBase);
            onEnd();
          }
        } else {
          onEnd();
        }
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
                    }
                    else {
                        txt = "Req. not found '" + id + "'";
                        msg.pub("error", "Requirement not found in a.reqRef: " + id);
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
/*global console, document, navigator, setTimeout, window, define */

/** @define {boolean} */
var IN_GLOBAL_SCOPE = true;

/**
 * Split {@code prettyPrint} into multiple timeouts so as not to interfere with
 * UI events.
 * If set to {@code false}, {@code prettyPrint()} is synchronous.
 */
window['PR_SHOULD_USE_CONTINUATION'] = true;

/**
 * Pretty print a chunk of code.
 * @param {string} sourceCodeHtml The HTML to pretty print.
 * @param {string} opt_langExtension The language name to use.
 *     Typically, a filename extension like 'cpp' or 'java'.
 * @param {number|boolean} opt_numberLines True to number lines,
 *     or the 1-indexed number of the first line in sourceCodeHtml.
 * @return {string} code as html, but prettier
 */
var prettyPrintOne;
/**
 * Find all the {@code <pre>} and {@code <code>} tags in the DOM with
 * {@code class=prettyprint} and prettify them.
 *
 * @param {Function} opt_whenDone called when prettifying is done.
 * @param {HTMLElement|HTMLDocument} opt_root an element or document
 *   containing all the elements to pretty print.
 *   Defaults to {@code document.body}.
 */
var prettyPrint;


(function () {
  var win = window;
  // Keyword lists for various languages.
  // We use things that coerce to strings to make them compact when minified
  // and to defeat aggressive optimizers that fold large string constants.
  var FLOW_CONTROL_KEYWORDS = ["break,continue,do,else,for,if,return,while"];
  var C_KEYWORDS = [FLOW_CONTROL_KEYWORDS,"auto,case,char,const,default," +
      "double,enum,extern,float,goto,inline,int,long,register,short,signed," +
      "sizeof,static,struct,switch,typedef,union,unsigned,void,volatile"];
  var COMMON_KEYWORDS = [C_KEYWORDS,"catch,class,delete,false,import," +
      "new,operator,private,protected,public,this,throw,true,try,typeof"];
  var CPP_KEYWORDS = [COMMON_KEYWORDS,"alignof,align_union,asm,axiom,bool," +
      "concept,concept_map,const_cast,constexpr,decltype,delegate," +
      "dynamic_cast,explicit,export,friend,generic,late_check," +
      "mutable,namespace,nullptr,property,reinterpret_cast,static_assert," +
      "static_cast,template,typeid,typename,using,virtual,where"];
  var JAVA_KEYWORDS = [COMMON_KEYWORDS,
      "abstract,assert,boolean,byte,extends,final,finally,implements,import," +
      "instanceof,interface,null,native,package,strictfp,super,synchronized," +
      "throws,transient"];
  var CSHARP_KEYWORDS = [COMMON_KEYWORDS,
      "abstract,as,base,bool,by,byte,checked,decimal,delegate,descending," +
      "dynamic,event,finally,fixed,foreach,from,group,implicit,in,interface," +
      "internal,into,is,let,lock,null,object,out,override,orderby,params," +
      "partial,readonly,ref,sbyte,sealed,stackalloc,string,select,uint,ulong," +
      "unchecked,unsafe,ushort,var,virtual,where"];
  var COFFEE_KEYWORDS = "all,and,by,catch,class,else,extends,false,finally," +
      "for,if,in,is,isnt,loop,new,no,not,null,of,off,on,or,return,super,then," +
      "throw,true,try,unless,until,when,while,yes";
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
   var RUST_KEYWORDS = [FLOW_CONTROL_KEYWORDS, "as,assert,const,copy,drop," +
      "enum,extern,fail,false,fn,impl,let,log,loop,match,mod,move,mut,priv," +
      "pub,pure,ref,self,static,struct,true,trait,type,unsafe,use"];
  var SH_KEYWORDS = [FLOW_CONTROL_KEYWORDS, "case,done,elif,esac,eval,fi," +
      "function,in,local,set,then,until"];
  var ALL_KEYWORDS = [
      CPP_KEYWORDS, CSHARP_KEYWORDS, JSCRIPT_KEYWORDS, PERL_KEYWORDS,
      PYTHON_KEYWORDS, RUBY_KEYWORDS, SH_KEYWORDS];
  var C_TYPES = /^(DIR|FILE|vector|(de|priority_)?queue|list|stack|(const_)?iterator|(multi)?(set|map)|bitset|u?(int|float)\d*)\b/;

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
   * token style for plain text.
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
   * <p>The link above does not accurately describe EcmaScript rules since
   * it fails to distinguish between (a=++/b/i) and (a++/b/i) but it works
   * very well in practice.
   *
   * @private
   * @const
   */
  var REGEXP_PRECEDER_PATTERN = '(?:^^\\.?|[+-]|[!=]=?=?|\\#|%=?|&&?=?|\\(|\\*=?|[+\\-]=|->|\\/=?|::?|<<?=?|>>?>?=?|,|;|\\?|@|\\[|~|{|\\^\\^?=?|\\|\\|?=?|break|case|continue|delete|do|else|finally|instanceof|return|throw|try|typeof)\\s*';

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
      return (ch === '\\' || ch === '-' || ch === ']' || ch === '^')
          ? "\\" + ch : ch;
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
      var ranges = [];
      var inverse = charsetParts[0] === '^';

      var out = ['['];
      if (inverse) { out.push('^'); }

      for (var i = inverse ? 1 : 0, n = charsetParts.length; i < n; ++i) {
        var p = charsetParts[i];
        if (/\\[bdsw]/i.test(p)) {  // Don't muck with named groups.
          out.push(p);
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
      var lastRange = [];
      for (var i = 0; i < ranges.length; ++i) {
        var range = ranges[i];
        if (range[0] <= lastRange[1] + 1) {
          lastRange[1] = Math.max(lastRange[1], range[1]);
        } else {
          consolidatedRanges.push(lastRange = range);
        }
      }

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
              + '|[\\(\\)\\^]'  // start/end of a group, or line start
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
          if (decimalValue) {
            if (decimalValue <= groupIndex) {
              capturedGroups[decimalValue] = -1;
            } else {
              // Replace with an unambiguous escape sequence so that
              // an octal escape sequence does not turn into a backreference
              // to a capturing group from an earlier regex.
              parts[i] = encodeEscape(decimalValue);
            }
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
          if (!capturedGroups[groupIndex]) {
            parts[i] = '(?:';
          }
        } else if ('\\' === p.charAt(0)) {
          var decimalValue = +p.substring(1);
          if (decimalValue && decimalValue <= groupIndex) {
            parts[i] = '\\' + capturedGroups[decimalValue];
          }
        }
      }

      // Remove any prefix anchors so that the output will match anywhere.
      // ^^ really does mean an anchored match though.
      for (var i = 0; i < n; ++i) {
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
   *   //                     1          2
   *   //           012345678901234 5678901234567
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
   * @param {boolean} isPreformatted true if white-space in text nodes should
   *    be considered significant.
   * @return {Object} source code and the text nodes in which they occur.
   */
  function extractSourceSpans(node, isPreformatted) {
    var nocode = /(?:^|\s)nocode(?:\s|$)/;

    var chunks = [];
    var length = 0;
    var spans = [];
    var k = 0;

    function walk(node) {
      var type = node.nodeType;
      if (type == 1) {  // Element
        if (nocode.test(node.className)) { return; }
        for (var child = node.firstChild; child; child = child.nextSibling) {
          walk(child);
        }
        var nodeName = node.nodeName.toLowerCase();
        if ('br' === nodeName || 'li' === nodeName) {
          chunks[k] = '\n';
          spans[k << 1] = length++;
          spans[(k++ << 1) | 1] = node;
        }
      } else if (type == 3 || type == 4) {  // Text
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
          [PR_STRING, /^@\"(?:[^\"]|\"\")*(?:\"|$)/, null]);
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
              [PR_COMMENT, /^#(?:(?:define|e(?:l|nd)if|else|error|ifn?def|include|line|pragma|undef|warning)\b|[^\r\n]*)/,
               null, '#']);
        }
        // #include <stdio.h>
        fallthroughStylePatterns.push(
            [PR_STRING,
             /^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h(?:h|pp|\+\+)?|[a-z]\w*)>/,
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
    var regexLiterals = options['regexLiterals'];
    if (regexLiterals) {
      /**
       * @const
       */
      var regexExcls = regexLiterals > 1
        ? ''  // Multiline regex literals
        : '\n\r';
      /**
       * @const
       */
      var regexAny = regexExcls ? '.' : '[\\S\\s]';
      /**
       * @const
       */
      var REGEX_LITERAL = (
          // A regular expression literal starts with a slash that is
          // not followed by * or / so that it is not confused with
          // comments.
          '/(?=[^/*' + regexExcls + '])'
          // and then contains any number of raw characters,
          + '(?:[^/\\x5B\\x5C' + regexExcls + ']'
          // escape sequences (\x5C),
          +    '|\\x5C' + regexAny
          // or non-nesting character sets (\x5B\x5D);
          +    '|\\x5B(?:[^\\x5C\\x5D' + regexExcls + ']'
          +             '|\\x5C' + regexAny + ')*(?:\\x5D|$))+'
          // finally closed by a /.
          + '/');
      fallthroughStylePatterns.push(
          ['lang-regex',
           RegExp('^' + REGEXP_PRECEDER_PATTERN + '(' + REGEX_LITERAL + ')')
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

    var punctuation =
      // The Bash man page says

      // A word is a sequence of characters considered as a single
      // unit by GRUB. Words are separated by metacharacters,
      // which are the following plus space, tab, and newline: { }
      // | & $ ; < >
      // ...

      // A word beginning with # causes that word and all remaining
      // characters on that line to be ignored.

      // which means that only a '#' after /(?:^|[{}|&$;<>\s])/ starts a
      // comment but empirically
      // $ echo {#}
      // {#}
      // $ echo \$#
      // $#
      // $ echo }#
      // }#

      // so /(?:^|[|&;<>\s])/ is more appropriate.

      // http://gcc.gnu.org/onlinedocs/gcc-2.95.3/cpp_1.html#SEC3
      // suggests that this definition is compatible with a
      // default mode that tries to use a single token definition
      // to recognize both bash/python style comments and C
      // preprocessor directives.

      // This definition of punctuation does not include # in the list of
      // follow-on exclusions, so # will not be broken before if preceeded
      // by a punctuation character.  We could try to exclude # after
      // [|&;<>] but that doesn't seem to cause many major problems.
      // If that does turn out to be a problem, we should change the below
      // when hc is truthy to include # in the run of punctuation characters
      // only when not followint [|&;<>].
      '^.[^\\s\\w.$@\'"`/\\\\]*';
    if (options['regexLiterals']) {
      punctuation += '(?!\s*\/)';
    }

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
        // Don't treat escaped quotes in bash as starting strings.
        // See issue 144.
        [PR_PLAIN,       /^\\[\s\S]?/, null],
        [PR_PUNCTUATION, new RegExp(punctuation), null]);

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
   * @param {boolean} isPreformatted true iff white-space in text nodes should
   *     be treated as significant.
   */
  function numberLines(node, opt_startLineNum, isPreformatted) {
    var nocode = /(?:^|\s)nocode(?:\s|$)/;
    var lineBreak = /\r\n?|\n/;

    var document = node.ownerDocument;

    var li = document.createElement('li');
    while (node.firstChild) {
      li.appendChild(node.firstChild);
    }
    // An array of lines.  We split below, so this is initialized to one
    // un-split line.
    var listItems = [li];

    function walk(node) {
      var type = node.nodeType;
      if (type == 1 && !nocode.test(node.className)) {  // Element
        if ('br' === node.nodeName) {
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
      } else if ((type == 3 || type == 4) && isPreformatted) {  // Text
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

    var ol = document.createElement('ol');
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
   *    sourceNode: {HTMLElement} the element containing the source,
   *    spans: {Array.<number|Node>} alternating span start indices into source
   *       and the text node or element (e.g. {@code <BR>}) corresponding to that
   *       span.
   *    decorations: {Array.<number|string} an array of style classes preceded
   *       by the position at which they start in job.sourceCode in order
   * }</pre>
   * @private
   */
  function recombineTagsAndDecorations(job) {
    var isIE8OrEarlier = /\bMSIE\s(\d+)/.exec(navigator.userAgent);
    isIE8OrEarlier = isIE8OrEarlier && +isIE8OrEarlier[1] <= 8;
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

    var sourceNode = job.sourceNode;
    var oldDisplay;
    if (sourceNode) {
      oldDisplay = sourceNode.style.display;
      sourceNode.style.display = 'none';
    }
    try {
      var decoration = null;
      while (spanIndex < nSpans) {
        var spanStart = spans[spanIndex];
        var spanEnd = spans[spanIndex + 2] || sourceLength;

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
          if (isIE8OrEarlier) {
            styledText = styledText.replace(newlineRe, '\r');
          }
          textNode.nodeValue = styledText;
          var document = textNode.ownerDocument;
          var span = document.createElement('span');
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
    } finally {
      if (sourceNode) {
        sourceNode.style.display = oldDisplay;
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
      } else if (win['console']) {
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
           [PR_PLAIN,        /^[\s]+/, null, ' \t\r\n'],
           [PR_ATTRIB_VALUE, /^(?:\"[^\"]*\"?|\'[^\']*\'?)/, null, '\"\'']
           ],
          [
           [PR_TAG,          /^^<\/?[a-z](?:[\w.:-]*\w)?|\/?>$/i],
           [PR_ATTRIB_NAME,  /^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i],
           ['lang-uq.val',   /^=\s*([^>\'\"\s]*(?:[^>\'\"\s\/]|\/(?=\s)))/],
           [PR_PUNCTUATION,  /^[=<>\/]+/],
           ['lang-js',       /^on\w+\s*=\s*\"([^\"]+)\"/i],
           ['lang-js',       /^on\w+\s*=\s*\'([^\']+)\'/i],
           ['lang-js',       /^on\w+\s*=\s*([^\"\'>\s]+)/i],
           ['lang-css',      /^style\s*=\s*\"([^\"]+)\"/i],
           ['lang-css',      /^style\s*=\s*\'([^\']+)\'/i],
           ['lang-css',      /^style\s*=\s*([^\"\'>\s]+)/i]
           ]),
      ['in.tag']);
  registerLangHandler(
      createSimpleLexer([], [[PR_ATTRIB_VALUE, /^[\s\S]+/]]), ['uq.val']);
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
        }), ['bash', 'bsh', 'csh', 'sh']);
  registerLangHandler(sourceDecorator({
          'keywords': PYTHON_KEYWORDS,
          'hashComments': true,
          'multiLineStrings': true,
          'tripleQuotedStrings': true
        }), ['cv', 'py', 'python']);
  registerLangHandler(sourceDecorator({
          'keywords': PERL_KEYWORDS,
          'hashComments': true,
          'multiLineStrings': true,
          'regexLiterals': 2  // multiline regex literals
        }), ['perl', 'pl', 'pm']);
  registerLangHandler(sourceDecorator({
          'keywords': RUBY_KEYWORDS,
          'hashComments': true,
          'multiLineStrings': true,
          'regexLiterals': true
        }), ['rb', 'ruby']);
  registerLangHandler(sourceDecorator({
          'keywords': JSCRIPT_KEYWORDS,
          'cStyleComments': true,
          'regexLiterals': true
        }), ['javascript', 'js']);
  registerLangHandler(sourceDecorator({
          'keywords': COFFEE_KEYWORDS,
          'hashComments': 3,  // ### style block comments
          'cStyleComments': true,
          'multilineStrings': true,
          'tripleQuotedStrings': true,
          'regexLiterals': true
        }), ['coffee']);
  registerLangHandler(sourceDecorator({
          'keywords': RUST_KEYWORDS,
          'cStyleComments': true,
          'multilineStrings': true
        }), ['rc', 'rs', 'rust']);
  registerLangHandler(
      createSimpleLexer([], [[PR_STRING, /^[\s\S]+/]]), ['regex']);

  function applyDecorator(job) {
    var opt_langExtension = job.langExtension;

    try {
      // Extract tags, and convert the source code to plain text.
      var sourceAndSpans = extractSourceSpans(job.sourceNode, job.pre);
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
      if (win['console']) {
        console['log'](e && e['stack'] || e);
      }
    }
  }

  /**
   * Pretty print a chunk of code.
   * @param sourceCodeHtml {string} The HTML to pretty print.
   * @param opt_langExtension {string} The language name to use.
   *     Typically, a filename extension like 'cpp' or 'java'.
   * @param opt_numberLines {number|boolean} True to number lines,
   *     or the 1-indexed number of the first line in sourceCodeHtml.
   */
  function $prettyPrintOne(sourceCodeHtml, opt_langExtension, opt_numberLines) {
    var container = document.createElement('div');
    // This could cause images to load and onload listeners to fire.
    // E.g. <img onerror="alert(1337)" src="nosuchimage.png">.
    // We assume that the inner HTML is from a trusted source.
    // The pre-tag is required for IE8 which strips newlines from innerHTML
    // when it is injected into a <pre> tag.
    // http://stackoverflow.com/questions/451486/pre-tag-loses-line-breaks-when-setting-innerhtml-in-ie
    // http://stackoverflow.com/questions/195363/inserting-a-newline-into-a-pre-tag-ie-javascript
    container.innerHTML = '<pre>' + sourceCodeHtml + '</pre>';
    container = container.firstChild;
    if (opt_numberLines) {
      numberLines(container, opt_numberLines, true);
    }

    var job = {
      langExtension: opt_langExtension,
      numberLines: opt_numberLines,
      sourceNode: container,
      pre: 1
    };
    applyDecorator(job);
    return container.innerHTML;
  }

   /**
    * Find all the {@code <pre>} and {@code <code>} tags in the DOM with
    * {@code class=prettyprint} and prettify them.
    *
    * @param {Function} opt_whenDone called when prettifying is done.
    * @param {HTMLElement|HTMLDocument} opt_root an element or document
    *   containing all the elements to pretty print.
    *   Defaults to {@code document.body}.
    */
  function $prettyPrint(opt_whenDone, opt_root) {
    var root = opt_root || document.body;
    var doc = root.ownerDocument || document;
    function byTagName(tn) { return root.getElementsByTagName(tn); }
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
    var prettyPrintedRe = /\bprettyprinted\b/;
    var preformattedTagNameRe = /pre|xmp/i;
    var codeRe = /^code$/i;
    var preCodeXmpRe = /^(?:pre|code|xmp)$/i;
    var EMPTY = {};

    function doWork() {
      var endTime = (win['PR_SHOULD_USE_CONTINUATION'] ?
                     clock['now']() + 250 /* ms */ :
                     Infinity);
      for (; k < elements.length && clock['now']() < endTime; k++) {
        var cs = elements[k];

        // Look for a preceding comment like
        // <?prettify lang="..." linenums="..."?>
        var attrs = EMPTY;
        {
          for (var preceder = cs; (preceder = preceder.previousSibling);) {
            var nt = preceder.nodeType;
            // <?foo?> is parsed by HTML 5 to a comment node (8)
            // like <!--?foo?-->, but in XML is a processing instruction
            var value = (nt === 7 || nt === 8) && preceder.nodeValue;
            if (value
                ? !/^\??prettify\b/.test(value)
                : (nt !== 3 || /\S/.test(preceder.nodeValue))) {
              // Skip over white-space text nodes but not others.
              break;
            }
            if (value) {
              attrs = {};
              value.replace(
                  /\b(\w+)=([\w:.%+-]+)/g,
                function (_, name, value) { attrs[name] = value; });
              break;
            }
          }
        }

        var className = cs.className;
        if ((attrs !== EMPTY || prettyPrintRe.test(className))
            // Don't redo this if we've already done it.
            // This allows recalling pretty print to just prettyprint elements
            // that have been added to the page since last call.
            && !prettyPrintedRe.test(className)) {

          // make sure this is not nested in an already prettified element
          var nested = false;
          for (var p = cs.parentNode; p; p = p.parentNode) {
            var tn = p.tagName;
            if (preCodeXmpRe.test(tn)
                && p.className && prettyPrintRe.test(p.className)) {
              nested = true;
              break;
            }
          }
          if (!nested) {
            // Mark done.  If we fail to prettyprint for whatever reason,
            // we shouldn't try again.
            cs.className += ' prettyprinted';

            // If the classes includes a language extensions, use it.
            // Language extensions can be specified like
            //     <pre class="prettyprint lang-cpp">
            // the language extension "cpp" is used to find a language handler
            // as passed to PR.registerLangHandler.
            // HTML5 recommends that a language be specified using "language-"
            // as the prefix instead.  Google Code Prettify supports both.
            // http://dev.w3.org/html5/spec-author-view/the-code-element.html
            var langExtension = attrs['lang'];
            if (!langExtension) {
              langExtension = className.match(langExtensionRe);
              // Support <pre class="prettyprint"><code class="language-c">
              var wrapper;
              if (!langExtension && (wrapper = childContentWrapper(cs))
                  && codeRe.test(wrapper.tagName)) {
                langExtension = wrapper.className.match(langExtensionRe);
              }

              if (langExtension) { langExtension = langExtension[1]; }
            }

            var preformatted;
            if (preformattedTagNameRe.test(cs.tagName)) {
              preformatted = 1;
            } else {
              var currentStyle = cs['currentStyle'];
              var defaultView = doc.defaultView;
              var whitespace = (
                  currentStyle
                  ? currentStyle['whiteSpace']
                  : (defaultView
                     && defaultView.getComputedStyle)
                  ? defaultView.getComputedStyle(cs, null)
                  .getPropertyValue('white-space')
                  : 0);
              preformatted = whitespace
                  && 'pre' === whitespace.substring(0, 3);
            }

            // Look for a class like linenums or linenums:<n> where <n> is the
            // 1-indexed number of the first line.
            var lineNums = attrs['linenums'];
            if (!(lineNums = lineNums === 'true' || +lineNums)) {
              lineNums = className.match(/\blinenums\b(?::(\d+))?/);
              lineNums =
                lineNums
                ? lineNums[1] && lineNums[1].length
                  ? +lineNums[1] : true
                : false;
            }
            if (lineNums) { numberLines(cs, lineNums, preformatted); }

            // do the pretty printing
            prettyPrintingJob = {
              langExtension: langExtension,
              sourceNode: cs,
              numberLines: lineNums,
              pre: preformatted
            };
            applyDecorator(prettyPrintingJob);
          }
        }
      }
      if (k < elements.length) {
        // finish up in a continuation
        setTimeout(doWork, 250);
      } else if ('function' === typeof opt_whenDone) {
        opt_whenDone();
      }
    }

    doWork();
  }

  /**
   * Contains functions for creating and registering new language handlers.
   * @type {Object}
   */
  var PR = win['PR'] = {
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
        'PR_TYPE': PR_TYPE,
        'prettyPrintOne':
           IN_GLOBAL_SCOPE
             ? (win['prettyPrintOne'] = $prettyPrintOne)
             : (prettyPrintOne = $prettyPrintOne),
        'prettyPrint': prettyPrint =
           IN_GLOBAL_SCOPE
             ? (win['prettyPrint'] = $prettyPrint)
             : (prettyPrint = $prettyPrint)
      };

  // Make PR available via the Asynchronous Module Definition (AMD) API.
  // Per https://github.com/amdjs/amdjs-api/wiki/AMD:
  // The Asynchronous Module Definition (AMD) API specifies a
  // mechanism for defining modules such that the module and its
  // dependencies can be asynchronously loaded.
  // ...
  // To allow a clear indicator that a global define function (as
  // needed for script src browser loading) conforms to the AMD API,
  // any global define function SHOULD have a property called "amd"
  // whose value is an object. This helps avoid conflict with any
  // other existing JavaScript code that could have defined a define()
  // function that does not conform to the AMD API.
  if (typeof define === "function" && define['amd']) {
    define("google-code-prettify", [], function () {
      return PR;
    });
  }
})();


// Module core/highlight
// Does syntax highlighting to all pre and code that have a class of "highlight"

// A potential improvement would be to call cb() immediately and benefit from the asynchronous
// ability of prettyPrint() (but only call msg.pub() in the callback to remain accurate as to
// the end of processing)

define(
    'core/highlight',["text!core/css/highlight.css", "google-code-prettify"],
    function (css, PR) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/highlight");

                // fix old classes
                var oldies = "sh_css sh_html sh_javascript sh_javascript_dom sh_xml".split(" ");
                for (var i = 0, n = oldies.length; i < n; i++) {
                    var old = oldies[i];
                    $("." + old).each(function () {
                        $(this).removeClass(old).addClass("highlight");
                        msg.pub("warn", "Old highlighting class '" + old + "', use 'highlight' instead.");
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
                    if (!conf.noHighlightCSS) {
                        $(doc).find("head link").first().before($("<style/>").text(css));
                    }
                    $highs.addClass("prettyprint");
                    PR.prettyPrint(done);
                }
                else {
                    done();
                }
            }
        };
    }
);


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
                else if ($("#bp-summary").length) {
                    msg.pub("warn", "Using best practices summary (#bp-summary) but no best practices found.");
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
                                ""
                    ,   $caption = $("<figcaption/>").text(title);

                    // change old syntax to something HTML5 compatible
                    if ($figure.is("div")) {
                        msg.pub("warn", "You are using the deprecated div.figure syntax; please switch to <figure>.");
                        $figure.append($caption);
                        $figure.renameElement("figure");
                    }
                    else {
                        msg.pub("warn", "You are using the deprecated img.figure syntax; please switch to <figure>.");
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
                    if (!$cap.length) msg.pub("warn", "A <figure> should contain a <figcaption>.");

                    // set proper caption title
                    num++;
                    $cap.wrapInner($("<span class='fig-title'/>"))
                        .prepend(doc.createTextNode(" "))
                        .prepend($("<span class='figno'>" + num + "</span>"))
                        .prepend(doc.createTextNode(conf.l10n.fig))
                    ;
                    figMap[id] = $cap.contents().clone();
                    var $tofCap = $cap.clone();
                    $tofCap.find("a").renameElement("span").removeAttr("href");
                    tof.push($("<li class='tofline'><a class='tocxref' href='#" + id + "'></a></li>")
                                .find(".tocxref")
                                    .append($tofCap.contents())
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


// Module core/biblio
// Handles bibliographic references
// Configuration:
//  - localBiblio: override or supplement the official biblio with your own.

define(
    'core/biblio',[],
    function () {
        var getRefKeys = function (conf) {
            var informs = conf.informativeReferences
            ,   norms = conf.normativeReferences
            ,   del = []
            ,   getKeys = function (obj) {
                    var res = [];
                    for (var k in obj) res.push(k);
                    return res;
                }
            ;
            for (var k in informs) if (norms[k]) del.push(k);
            for (var i = 0; i < del.length; i++) delete informs[del[i]];
            return {
                informativeReferences: getKeys(informs),
                normativeReferences: getKeys(norms)
            };
        };
        var REF_STATUSES = {
            "NOTE":     "W3C Note"
        ,   "WG-NOTE":  "W3C Working Group Note"
        ,   "ED":       "W3C Editor's Draft"
        ,   "FPWD":     "W3C First Public Working Draft"
        ,   "WD":       "W3C Working Draft"
        ,   "LCWD":     "W3C Last Call Working Draft"
        ,   "CR":       "W3C Candidate Recommendation"
        ,   "PR":       "W3C Proposed Recommendation"
        ,   "PER":      "W3C Proposed Edited Recommendation"
        ,   "REC":      "W3C Recommendation"
        };
        var stringifyRef = function(ref) {
            if (typeof ref === "string") return ref;
            var output = "";
            if (ref.authors && ref.authors.length) {
                output += ref.authors.join("; ");
                if (ref.etAl) output += " et al";
                output += ". ";
            }
            if(ref.publisher){
                output += ref.publisher;
                if(/\.$/.test(ref.publisher)){
                    output += " ";
                }else{
                    output += ". ";
                }
            }
            if (ref.href) output += '<a href="' + ref.href + '"><cite>' + ref.title + "</cite></a>. ";
            else output += '<cite>' + ref.title + '</cite>. ';
            if (ref.date) output += ref.date + ". ";
            if (ref.status) output += (REF_STATUSES[ref.status] || ref.status) + ". ";
            if (ref.href) output += 'URL: <a href="' + ref.href + '">' + ref.href + "</a>";
            return output;
        };
        var bibref = function (conf, msg) {
            // this is in fact the bibref processing portion
            var badrefs = {}
            ,   refs = getRefKeys(conf)
            ,   informs = refs.informativeReferences
            ,   norms = refs.normativeReferences
            ,   aliases = {}
            ;

            if (!informs.length && !norms.length && !conf.refNote) return;
            var $refsec = $("<section id='references' class='appendix'><h2>References</h2></section>").appendTo($("body"));
            if (conf.refNote) $("<p></p>").html(conf.refNote).appendTo($refsec);

            var types = ["Normative", "Informative"];
            for (var i = 0; i < types.length; i++) {
                var type = types[i]
                ,   refs = (type == "Normative") ? norms : informs;
                if (!refs.length) continue;
                var $sec = $("<section><h3></h3></section>")
                                .appendTo($refsec)
                                .find("h3")
                                    .text(type + " references")
                                .end()
                                ;
                $sec.makeID(null, type + " references");
                refs.sort();
                var $dl = $("<dl class='bibliography'></dl>").appendTo($sec);
                if (conf.doRDFa) $dl.attr("resource", "");
                for (var j = 0; j < refs.length; j++) {
                    var ref = refs[j];
                    $("<dt></dt>")
                        .attr({ id:"bib-" + ref })
                        .text("[" + ref + "]")
                        .appendTo($dl)
                        ;
                    var $dd = $("<dd></dd>").appendTo($dl);
                    var refcontent = conf.biblio[ref]
                    ,   circular = {}
                    ,   key = ref;
                    circular[ref] = true;
                    while (refcontent && refcontent.aliasOf) {
                        if (circular[refcontent.aliasOf]) {
                            refcontent = null;
                            msg.pub("error", "Circular reference in biblio DB between [" + ref + "] and [" + key + "].");
                        }
                        else {
                            key = refcontent.aliasOf;
                            refcontent = conf.biblio[key];
                            circular[key] = true;
                        }
                    }
                    aliases[key] = aliases[key] || [];
                    if (aliases[key].indexOf(ref) < 0) aliases[key].push(ref);
                    if (refcontent) {
                        $dd.html(stringifyRef(refcontent) + "\n");
                        if (conf.doRDFa) {
                            var $a = $dd.children("a");
                            $a.attr("property", type === "Normative" ? "dc:requires" : "dc:references");
                        }
                    }
                    else {
                        if (!badrefs[ref]) badrefs[ref] = 0;
                        badrefs[ref]++;
                        $dd.html("<em style='color: #f00'>Reference not found.</em>\n");
                    }
                }
            }
            for (var k in aliases) {
                if (aliases[k].length > 1) {
                    msg.pub("warn", "[" + k + "] is referenced in " + aliases[k].length + " ways (" + aliases[k].join(", ") + "). This causes duplicate entries in the reference section.");
                }
            }
            for (var item in badrefs) {
                if (badrefs.hasOwnProperty(item)) msg.pub("error", "Bad reference: [" + item + "] (appears " + badrefs[item] + " times)");
            }
        };

        return {
            stringifyRef: stringifyRef,
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/biblio");
                var refs = getRefKeys(conf)
                ,   localAliases = []
                ,   finish = function () {
                        msg.pub("end", "core/biblio");
                        cb();
                    }
                ;
                if (conf.localBiblio) {
                    for (var k in conf.localBiblio) {
                        if (typeof conf.localBiblio[k].aliasOf !== "undefined") {
                            localAliases.push(conf.localBiblio[k].aliasOf);
                        }
                    }
                }
                refs = refs.normativeReferences
                                .concat(refs.informativeReferences)
                                .concat(localAliases);
                if (refs.length) {
                    var url = "https://labs.w3.org/specrefs/bibrefs?refs=" + refs.join(",");
                    $.ajax({
                        dataType:   "json"
                    ,   url:        url
                    ,   success:    function (data) {
                            conf.biblio = data || {};
                            // override biblio data
                            if (conf.localBiblio) {
                                for (var k in conf.localBiblio) conf.biblio[k] = conf.localBiblio[k];
                            }
                            bibref(conf, msg);
                            finish();
                        }
                    ,   error:      function (xhr, status, error) {
                            msg.pub("error", "Error loading references from '" + url + "': " + status + " (" + error + ")");
                            finish();
                        }
                    });
                }
                else finish();
            }
        };
    }
);



(function () {
    var tokenise = function (str) {
        var tokens = []
        ,   re = {
                "float":        /^-?(([0-9]+\.[0-9]*|[0-9]*\.[0-9]+)([Ee][-+]?[0-9]+)?|[0-9]+[Ee][-+]?[0-9]+)/
            ,   "integer":      /^-?(0([Xx][0-9A-Fa-f]+|[0-7]*)|[1-9][0-9]*)/
            ,   "identifier":   /^[A-Z_a-z][0-9A-Z_a-z]*/
            ,   "string":       /^"[^"]*"/
            ,   "whitespace":   /^(?:[\t\n\r ]+|[\t\n\r ]*((\/\/.*|\/\*(.|\n|\r)*?\*\/)[\t\n\r ]*))+/
            ,   "other":        /^[^\t\n\r 0-9A-Z_a-z]/
            }
        ,   types = []
        ;
        for (var k in re) types.push(k);
        while (str.length > 0) {
            var matched = false;
            for (var i = 0, n = types.length; i < n; i++) {
                var type = types[i];
                str = str.replace(re[type], function (tok) {
                    tokens.push({ type: type, value: tok });
                    matched = true;
                    return "";
                });
                if (matched) break;
            }
            if (matched) continue;
            throw new Error("Token stream not progressing");
        }
        return tokens;
    };

    var parse = function (tokens, opt) {
        var line = 1;
        tokens = tokens.slice();

        var FLOAT = "float"
        ,   INT = "integer"
        ,   ID = "identifier"
        ,   STR = "string"
        ,   OTHER = "other"
        ;

        var WebIDLParseError = function (str, line, input, tokens) {
            this.message = str;
            this.line = line;
            this.input = input;
            this.tokens = tokens;
        };
        WebIDLParseError.prototype.toString = function () {
            return this.message + ", line " + this.line + " (tokens: '" + this.input + "')\n" +
                   JSON.stringify(this.tokens, null, 4);
        };

        var error = function (str) {
            var tok = "", numTokens = 0, maxTokens = 5;
            while (numTokens < maxTokens && tokens.length > numTokens) {
                tok += tokens[numTokens].value;
                numTokens++;
            }
            throw new WebIDLParseError(str, line, tok, tokens.slice(0, 5));
        };

        var last_token = null;

        var consume = function (type, value) {
            if (!tokens.length || tokens[0].type !== type) return;
            if (typeof value === "undefined" || tokens[0].value === value) {
                 last_token = tokens.shift();
                 if (type === ID) last_token.value = last_token.value.replace(/^_/, "");
                 return last_token;
             }
        };

        var ws = function () {
            if (!tokens.length) return;
            if (tokens[0].type === "whitespace") {
                var t = tokens.shift();
                t.value.replace(/\n/g, function (m) { line++; return m; });
                return t;
            }
        };

        var all_ws = function (store, pea) { // pea == post extended attribute, tpea = same for types
            var t = { type: "whitespace", value: "" };
            while (true) {
                var w = ws();
                if (!w) break;
                t.value += w.value;
            }
            if (t.value.length > 0) {
                if (store) {
                    var w = t.value
                    ,   re = {
                            "ws":                   /^([\t\n\r ]+)/
                        ,   "line-comment":         /^\/\/(.*)\n?/m
                        ,   "multiline-comment":    /^\/\*((?:.|\n|\r)*?)\*\//
                        }
                    ,   wsTypes = []
                    ;
                    for (var k in re) wsTypes.push(k);
                    while (w.length) {
                        var matched = false;
                        for (var i = 0, n = wsTypes.length; i < n; i++) {
                            var type = wsTypes[i];
                            w = w.replace(re[type], function (tok, m1) {
                                store.push({ type: type + (pea ? ("-" + pea) : ""), value: m1 });
                                matched = true;
                                return "";
                            });
                            if (matched) break;
                        }
                        if (matched) continue;
                        throw new Error("Surprising white space construct."); // this shouldn't happen
                    }
                }
                return t;
            }
        };

        var integer_type = function () {
            var ret = "";
            all_ws();
            if (consume(ID, "unsigned")) ret = "unsigned ";
            all_ws();
            if (consume(ID, "short")) return ret + "short";
            if (consume(ID, "long")) {
                ret += "long";
                all_ws();
                if (consume(ID, "long")) return ret + " long";
                return ret;
            }
            if (ret) error("Failed to parse integer type");
        };

        var float_type = function () {
            var ret = "";
            all_ws();
            if (consume(ID, "unrestricted")) ret = "unrestricted ";
            all_ws();
            if (consume(ID, "float")) return ret + "float";
            if (consume(ID, "double")) return ret + "double";
            if (ret) error("Failed to parse float type");
        };

        var primitive_type = function () {
            var num_type = integer_type() || float_type();
            if (num_type) return num_type;
            all_ws();
            if (consume(ID, "boolean")) return "boolean";
            if (consume(ID, "byte")) return "byte";
            if (consume(ID, "octet")) return "octet";
        };

        var const_value = function () {
            if (consume(ID, "true")) return { type: "boolean", value: true };
            if (consume(ID, "false")) return { type: "boolean", value: false };
            if (consume(ID, "null")) return { type: "null" };
            if (consume(ID, "Infinity")) return { type: "Infinity", negative: false };
            if (consume(ID, "NaN")) return { type: "NaN" };
            var ret = consume(FLOAT) || consume(INT);
            if (ret) return { type: "number", value: 1 * ret.value };
            var tok = consume(OTHER, "-");
            if (tok) {
                if (consume(ID, "Infinity")) return { type: "Infinity", negative: true };
                else tokens.unshift(tok);
            }
        };

        var type_suffix = function (obj) {
            while (true) {
                all_ws();
                if (consume(OTHER, "?")) {
                    if (obj.nullable) error("Can't nullable more than once");
                    obj.nullable = true;
                }
                else if (consume(OTHER, "[")) {
                    all_ws();
                    consume(OTHER, "]") || error("Unterminated array type");
                    if (!obj.array) {
                        obj.array = 1;
                        obj.nullableArray = [obj.nullable];
                    }
                    else {
                        obj.array++;
                        obj.nullableArray.push(obj.nullable);
                    }
                    obj.nullable = false;
                }
                else return;
            }
        };

        var single_type = function () {
            var prim = primitive_type()
            ,   ret = { sequence: false, generic: null, nullable: false, array: false, union: false }
            ,   name
            ,   value
            ;
            if (prim) {
                ret.idlType = prim;
            }
            else if (name = consume(ID)) {
                value = name.value;
                all_ws();
                // Generic types
                if (consume(OTHER, "<")) {
                    // backwards compat
                    if (value === "sequence") {
                        ret.sequence = true;
                    }
                    ret.generic = value;
                    ret.idlType = type() || error("Error parsing generic type " + value);
                    all_ws();
                    if (!consume(OTHER, ">")) error("Unterminated generic type " + value);
                    type_suffix(ret);
                    return ret;
                }
                else {
                    ret.idlType = value;
                }
            }
            else {
                return;
            }
            type_suffix(ret);
            if (ret.nullable && !ret.array && ret.idlType === "any") error("Type any cannot be made nullable");
            return ret;
        };

        var union_type = function () {
            all_ws();
            if (!consume(OTHER, "(")) return;
            var ret = { sequence: false, generic: null, nullable: false, array: false, union: true, idlType: [] };
            var fst = type() || error("Union type with no content");
            ret.idlType.push(fst);
            while (true) {
                all_ws();
                if (!consume(ID, "or")) break;
                var typ = type() || error("No type after 'or' in union type");
                ret.idlType.push(typ);
            }
            if (!consume(OTHER, ")")) error("Unterminated union type");
            type_suffix(ret);
            return ret;
        };

        var type = function () {
            return single_type() || union_type();
        };

        var argument = function (store) {
            var ret = { optional: false, variadic: false };
            ret.extAttrs = extended_attrs(store);
            all_ws(store, "pea");
            var opt_token = consume(ID, "optional");
            if (opt_token) {
                ret.optional = true;
                all_ws();
            }
            ret.idlType = type();
            if (!ret.idlType) {
                if (opt_token) tokens.unshift(opt_token);
                return;
            }
            var type_token = last_token;
            if (!ret.optional) {
                all_ws();
                if (tokens.length >= 3 &&
                    tokens[0].type === "other" && tokens[0].value === "." &&
                    tokens[1].type === "other" && tokens[1].value === "." &&
                    tokens[2].type === "other" && tokens[2].value === "."
                    ) {
                    tokens.shift();
                    tokens.shift();
                    tokens.shift();
                    ret.variadic = true;
                }
            }
            all_ws();
            var name = consume(ID);
            if (!name) {
                if (opt_token) tokens.unshift(opt_token);
                tokens.unshift(type_token);
                return;
            }
            ret.name = name.value;
            if (ret.optional) {
                all_ws();
                ret["default"] = default_();
            }
            return ret;
        };

        var argument_list = function (store) {
            var ret = []
            ,   arg = argument(store ? ret : null)
            ;
            if (!arg) return;
            ret.push(arg);
            while (true) {
                all_ws(store ? ret : null);
                if (!consume(OTHER, ",")) return ret;
                var nxt = argument(store ? ret : null) || error("Trailing comma in arguments list");
                ret.push(nxt);
            }
        };

        var type_pair = function () {
            all_ws();
            var k = type();
            if (!k) return;
            all_ws()
            if (!consume(OTHER, ",")) return;
            all_ws();
            var v = type();
            if (!v) return;
            return [k, v];
        };

        var simple_extended_attr = function (store) {
            all_ws();
            var name = consume(ID);
            if (!name) return;
            var ret = {
                name: name.value
            ,   "arguments": null
            };
            all_ws();
            var eq = consume(OTHER, "=");
            if (eq) {
                var rhs;
                all_ws();
                if (rhs = consume(ID)) {
                  ret.rhs = rhs
                }
                else if (consume(OTHER, "(")) {
                    // [Exposed=(Window,Worker)]
                    rhs = [];
                    var id = consume(ID);
                    if (id) {
                      rhs = [id.value];
                    }
                    identifiers(rhs);
                    consume(OTHER, ")") || error("Unexpected token in extended attribute argument list or type pair");
                    ret.rhs = {
                        type: "identifier-list",
                        value: rhs
                    };
                }
                if (!ret.rhs) return error("No right hand side to extended attribute assignment");
            }
            all_ws();
            if (consume(OTHER, "(")) {
                var args, pair;
                // [Constructor(DOMString str)]
                if (args = argument_list(store)) {
                    ret["arguments"] = args;
                }
                // [MapClass(DOMString, DOMString)]
                else if (pair = type_pair()) {
                    ret.typePair = pair;
                }
                // [Constructor()]
                else {
                    ret["arguments"] = [];
                }
                all_ws();
                consume(OTHER, ")") || error("Unexpected token in extended attribute argument list or type pair");
            }
            return ret;
        };

        // Note: we parse something simpler than the official syntax. It's all that ever
        // seems to be used
        var extended_attrs = function (store) {
            var eas = [];
            all_ws(store);
            if (!consume(OTHER, "[")) return eas;
            eas[0] = simple_extended_attr(store) || error("Extended attribute with not content");
            all_ws();
            while (consume(OTHER, ",")) {
                eas.push(simple_extended_attr(store) || error("Trailing comma in extended attribute"));
                all_ws();
            }
            consume(OTHER, "]") || error("No end of extended attribute");
            return eas;
        };

        var default_ = function () {
            all_ws();
            if (consume(OTHER, "=")) {
                all_ws();
                var def = const_value();
                if (def) {
                    return def;
                }
                else if (consume(OTHER, "[")) {
                    if (!consume(OTHER, "]")) error("Default sequence value must be empty");
                    return { type: "sequence", value: [] };
                }
                else {
                    var str = consume(STR) || error("No value for default");
                    str.value = str.value.replace(/^"/, "").replace(/"$/, "");
                    return str;
                }
            }
        };

        var const_ = function (store) {
            all_ws(store, "pea");
            if (!consume(ID, "const")) return;
            var ret = { type: "const", nullable: false };
            all_ws();
            var typ = primitive_type();
            if (!typ) {
                typ = consume(ID) || error("No type for const");
                typ = typ.value;
            }
            ret.idlType = typ;
            all_ws();
            if (consume(OTHER, "?")) {
                ret.nullable = true;
                all_ws();
            }
            var name = consume(ID) || error("No name for const");
            ret.name = name.value;
            all_ws();
            consume(OTHER, "=") || error("No value assignment for const");
            all_ws();
            var cnt = const_value();
            if (cnt) ret.value = cnt;
            else error("No value for const");
            all_ws();
            consume(OTHER, ";") || error("Unterminated const");
            return ret;
        };

        var inheritance = function () {
            all_ws();
            if (consume(OTHER, ":")) {
                all_ws();
                var inh = consume(ID) || error ("No type in inheritance");
                return inh.value;
            }
        };

        var operation_rest = function (ret, store) {
            all_ws();
            if (!ret) ret = {};
            var name = consume(ID);
            ret.name = name ? name.value : null;
            all_ws();
            consume(OTHER, "(") || error("Invalid operation");
            ret["arguments"] = argument_list(store) || [];
            all_ws();
            consume(OTHER, ")") || error("Unterminated operation");
            all_ws();
            consume(OTHER, ";") || error("Unterminated operation");
            return ret;
        };

        var callback = function (store) {
            all_ws(store, "pea");
            var ret;
            if (!consume(ID, "callback")) return;
            all_ws();
            var tok = consume(ID, "interface");
            if (tok) {
                tokens.unshift(tok);
                ret = interface_();
                ret.type = "callback interface";
                return ret;
            }
            var name = consume(ID) || error("No name for callback");
            ret = { type: "callback", name: name.value };
            all_ws();
            consume(OTHER, "=") || error("No assignment in callback");
            all_ws();
            ret.idlType = return_type();
            all_ws();
            consume(OTHER, "(") || error("No arguments in callback");
            ret["arguments"] = argument_list(store) || [];
            all_ws();
            consume(OTHER, ")") || error("Unterminated callback");
            all_ws();
            consume(OTHER, ";") || error("Unterminated callback");
            return ret;
        };

        var attribute = function (store) {
            all_ws(store, "pea");
            var grabbed = []
            ,   ret = {
                type:           "attribute"
            ,   "static":       false
            ,   stringifier:    false
            ,   inherit:        false
            ,   readonly:       false
            };
            if (consume(ID, "static")) {
                ret["static"] = true;
                grabbed.push(last_token);
            }
            else if (consume(ID, "stringifier")) {
                ret.stringifier = true;
                grabbed.push(last_token);
            }
            var w = all_ws();
            if (w) grabbed.push(w);
            if (consume(ID, "inherit")) {
                if (ret["static"] || ret.stringifier) error("Cannot have a static or stringifier inherit");
                ret.inherit = true;
                grabbed.push(last_token);
                var w = all_ws();
                if (w) grabbed.push(w);
            }
            if (consume(ID, "readonly")) {
                ret.readonly = true;
                grabbed.push(last_token);
                var w = all_ws();
                if (w) grabbed.push(w);
            }
            if (!consume(ID, "attribute")) {
                tokens = grabbed.concat(tokens);
                return;
            }
            all_ws();
            ret.idlType = type() || error("No type in attribute");
            if (ret.idlType.sequence) error("Attributes cannot accept sequence types");
            all_ws();
            var name = consume(ID) || error("No name in attribute");
            ret.name = name.value;
            all_ws();
            consume(OTHER, ";") || error("Unterminated attribute");
            return ret;
        };

        var return_type = function () {
            var typ = type();
            if (!typ) {
                if (consume(ID, "void")) {
                    return "void";
                }
                else error("No return type");
            }
            return typ;
        };

        var operation = function (store) {
            all_ws(store, "pea");
            var ret = {
                type:           "operation"
            ,   getter:         false
            ,   setter:         false
            ,   creator:        false
            ,   deleter:        false
            ,   legacycaller:   false
            ,   "static":       false
            ,   stringifier:    false
            };
            while (true) {
                all_ws();
                if (consume(ID, "getter")) ret.getter = true;
                else if (consume(ID, "setter")) ret.setter = true;
                else if (consume(ID, "creator")) ret.creator = true;
                else if (consume(ID, "deleter")) ret.deleter = true;
                else if (consume(ID, "legacycaller")) ret.legacycaller = true;
                else break;
            }
            if (ret.getter || ret.setter || ret.creator || ret.deleter || ret.legacycaller) {
                all_ws();
                ret.idlType = return_type();
                operation_rest(ret, store);
                return ret;
            }
            if (consume(ID, "static")) {
                ret["static"] = true;
                ret.idlType = return_type();
                operation_rest(ret, store);
                return ret;
            }
            else if (consume(ID, "stringifier")) {
                ret.stringifier = true;-
                all_ws();
                if (consume(OTHER, ";")) return ret;
                ret.idlType = return_type();
                operation_rest(ret, store);
                return ret;
            }
            ret.idlType = return_type();
            all_ws();
            if (consume(ID, "iterator")) {
                all_ws();
                ret.type = "iterator";
                if (consume(ID, "object")) {
                    ret.iteratorObject = "object";
                }
                else if (consume(OTHER, "=")) {
                    all_ws();
                    var name = consume(ID) || error("No right hand side in iterator");
                    ret.iteratorObject = name.value;
                }
                all_ws();
                consume(OTHER, ";") || error("Unterminated iterator");
                return ret;
            }
            else {
                operation_rest(ret, store);
                return ret;
            }
        };

        var identifiers = function (arr) {
            while (true) {
                all_ws();
                if (consume(OTHER, ",")) {
                    all_ws();
                    var name = consume(ID) || error("Trailing comma in identifiers list");
                    arr.push(name.value);
                }
                else break;
            }
        };

        var serialiser = function (store) {
            all_ws(store, "pea");
            if (!consume(ID, "serializer")) return;
            var ret = { type: "serializer" };
            all_ws();
            if (consume(OTHER, "=")) {
                all_ws();
                if (consume(OTHER, "{")) {
                    ret.patternMap = true;
                    all_ws();
                    var id = consume(ID);
                    if (id && id.value === "getter") {
                        ret.names = ["getter"];
                    }
                    else if (id && id.value === "inherit") {
                        ret.names = ["inherit"];
                        identifiers(ret.names);
                    }
                    else if (id) {
                        ret.names = [id.value];
                        identifiers(ret.names);
                    }
                    else {
                        ret.names = [];
                    }
                    all_ws();
                    consume(OTHER, "}") || error("Unterminated serializer pattern map");
                }
                else if (consume(OTHER, "[")) {
                    ret.patternList = true;
                    all_ws();
                    var id = consume(ID);
                    if (id && id.value === "getter") {
                        ret.names = ["getter"];
                    }
                    else if (id) {
                        ret.names = [id.value];
                        identifiers(ret.names);
                    }
                    else {
                        ret.names = [];
                    }
                    all_ws();
                    consume(OTHER, "]") || error("Unterminated serializer pattern list");
                }
                else {
                    var name = consume(ID) || error("Invalid serializer");
                    ret.name = name.value;
                }
                all_ws();
                consume(OTHER, ";") || error("Unterminated serializer");
                return ret;
            }
            else if (consume(OTHER, ";")) {
                // noop, just parsing
            }
            else {
                ret.idlType = return_type();
                all_ws();
                ret.operation = operation_rest(null, store);
            }
            return ret;
        };

        var iterable_type = function() {
            if (consume(ID, "iterable")) return "iterable";
            else if (consume(ID, "legacyiterable")) return "legacyiterable";
            else if (consume(ID, "maplike")) return "maplike";
            else if (consume(ID, "setlike")) return "setlike";
            else return;
        }

        var readonly_iterable_type = function() {
            if (consume(ID, "maplike")) return "maplike";
            else if (consume(ID, "setlike")) return "setlike";
            else return;
        }

        var iterable = function (store) {
            all_ws(store, "pea");
            var grabbed = [],
                ret = {type: null, idlType: null, readonly: false};
            if (consume(ID, "readonly")) {
                ret.readonly = true;
                grabbed.push(last_token);
                var w = all_ws();
                if (w) grabbed.push(w);
            }
            var consumeItType = ret.readonly ? readonly_iterable_type : iterable_type;

            var ittype = consumeItType();
            if (!ittype) {
                tokens = grabbed.concat(tokens);
                return;
            }

            var secondTypeRequired = ittype === "maplike";
            var secondTypeAllowed = secondTypeRequired || ittype === "iterable";
            ret.type = ittype;
            if (ret.type !== 'maplike' && ret.type !== 'setlike')
                delete ret.readonly;
            all_ws();
            if (consume(OTHER, "<")) {
                ret.idlType = type() || error("Error parsing " + ittype + " declaration");
                all_ws();
                if (secondTypeAllowed) {
                    var type2 = null;
                    if (consume(OTHER, ",")) {
                        all_ws();
                        type2 = type();
                        all_ws();
                    }
                    if (type2)
                        ret.idlType = [ret.idlType, type2];
                    else if (secondTypeRequired)
                        error("Missing second type argument in " + ittype + " declaration");
                }
                if (!consume(OTHER, ">")) error("Unterminated " + ittype + " declaration");
                all_ws();
                if (!consume(OTHER, ";")) error("Missing semicolon after " + ittype + " declaration");
            }
            else
                error("Error parsing " + ittype + " declaration");

            return ret;
        }

        var interface_ = function (isPartial, store) {
            all_ws(isPartial ? null : store, "pea");
            if (!consume(ID, "interface")) return;
            all_ws();
            var name = consume(ID) || error("No name for interface");
            var mems = []
            ,   ret = {
                type:   "interface"
            ,   name:   name.value
            ,   partial:    false
            ,   members:    mems
            };
            if (!isPartial) ret.inheritance = inheritance() || null;
            all_ws();
            consume(OTHER, "{") || error("Bodyless interface");
            while (true) {
                all_ws(store ? mems : null);
                if (consume(OTHER, "}")) {
                    all_ws();
                    consume(OTHER, ";") || error("Missing semicolon after interface");
                    return ret;
                }
                var ea = extended_attrs(store ? mems : null);
                all_ws();
                var cnt = const_(store ? mems : null);
                if (cnt) {
                    cnt.extAttrs = ea;
                    ret.members.push(cnt);
                    continue;
                }
                var mem = (opt.allowNestedTypedefs && typedef(store ? mems : null)) ||
                          iterable(store ? mems : null) ||
                          serialiser(store ? mems : null) ||
                          attribute(store ? mems : null) ||
                          operation(store ? mems : null) ||
                          error("Unknown member");
                mem.extAttrs = ea;
                ret.members.push(mem);
            }
        };

        var partial = function (store) {
            all_ws(store, "pea");
            if (!consume(ID, "partial")) return;
            var thing = dictionary(true, store) ||
                        interface_(true, store) ||
                        error("Partial doesn't apply to anything");
            thing.partial = true;
            return thing;
        };

        var dictionary = function (isPartial, store) {
            all_ws(isPartial ? null : store, "pea");
            if (!consume(ID, "dictionary")) return;
            all_ws();
            var name = consume(ID) || error("No name for dictionary");
            var mems = []
            ,   ret = {
                type:   "dictionary"
            ,   name:   name.value
            ,   partial:    false
            ,   members:    mems
            };
            if (!isPartial) ret.inheritance = inheritance() || null;
            all_ws();
            consume(OTHER, "{") || error("Bodyless dictionary");
            while (true) {
                all_ws(store ? mems : null);
                if (consume(OTHER, "}")) {
                    all_ws();
                    consume(OTHER, ";") || error("Missing semicolon after dictionary");
                    return ret;
                }
                var ea = extended_attrs(store ? mems : null);
                all_ws(store ? mems : null, "pea");
                var required = consume(ID, "required");
                var typ = type() || error("No type for dictionary member");
                all_ws();
                var name = consume(ID) || error("No name for dictionary member");
                var dflt = default_();
                if (required && dflt) error("Required member must not have a default");
                ret.members.push({
                    type:       "field"
                ,   name:       name.value
                ,   required:   !!required
                ,   idlType:    typ
                ,   extAttrs:   ea
                ,   "default":  dflt
                });
                all_ws();
                consume(OTHER, ";") || error("Unterminated dictionary member");
            }
        };

        var exception = function (store) {
            all_ws(store, "pea");
            if (!consume(ID, "exception")) return;
            all_ws();
            var name = consume(ID) || error("No name for exception");
            var mems = []
            ,   ret = {
                type:   "exception"
            ,   name:   name.value
            ,   members:    mems
            };
            ret.inheritance = inheritance() || null;
            all_ws();
            consume(OTHER, "{") || error("Bodyless exception");
            while (true) {
                all_ws(store ? mems : null);
                if (consume(OTHER, "}")) {
                    all_ws();
                    consume(OTHER, ";") || error("Missing semicolon after exception");
                    return ret;
                }
                var ea = extended_attrs(store ? mems : null);
                all_ws(store ? mems : null, "pea");
                var cnt = const_();
                if (cnt) {
                    cnt.extAttrs = ea;
                    ret.members.push(cnt);
                }
                else {
                    var typ = type();
                    all_ws();
                    var name = consume(ID);
                    all_ws();
                    if (!typ || !name || !consume(OTHER, ";")) error("Unknown member in exception body");
                    ret.members.push({
                        type:       "field"
                    ,   name:       name.value
                    ,   idlType:    typ
                    ,   extAttrs:   ea
                    });
                }
            }
        };

        var enum_ = function (store) {
            all_ws(store, "pea");
            if (!consume(ID, "enum")) return;
            all_ws();
            var name = consume(ID) || error("No name for enum");
            var vals = []
            ,   ret = {
                type:   "enum"
            ,   name:   name.value
            ,   values: vals
            };
            all_ws();
            consume(OTHER, "{") || error("No curly for enum");
            var saw_comma = false;
            while (true) {
                all_ws(store ? vals : null);
                if (consume(OTHER, "}")) {
                    all_ws();
                    consume(OTHER, ";") || error("No semicolon after enum");
                    return ret;
                }
                var val = consume(STR) || error("Unexpected value in enum");
                ret.values.push(val.value.replace(/"/g, ""));
                all_ws(store ? vals : null);
                if (consume(OTHER, ",")) {
                    if (store) vals.push({ type: "," });
                    all_ws(store ? vals : null);
                    saw_comma = true;
                }
                else {
                    saw_comma = false;
                }
            }
        };

        var typedef = function (store) {
            all_ws(store, "pea");
            if (!consume(ID, "typedef")) return;
            var ret = {
                type:   "typedef"
            };
            all_ws();
            ret.typeExtAttrs = extended_attrs();
            all_ws(store, "tpea");
            ret.idlType = type() || error("No type in typedef");
            all_ws();
            var name = consume(ID) || error("No name in typedef");
            ret.name = name.value;
            all_ws();
            consume(OTHER, ";") || error("Unterminated typedef");
            return ret;
        };

        var implements_ = function (store) {
            all_ws(store, "pea");
            var target = consume(ID);
            if (!target) return;
            var w = all_ws();
            if (consume(ID, "implements")) {
                var ret = {
                    type:   "implements"
                ,   target: target.value
                };
                all_ws();
                var imp = consume(ID) || error("Incomplete implements statement");
                ret["implements"] = imp.value;
                all_ws();
                consume(OTHER, ";") || error("No terminating ; for implements statement");
                return ret;
            }
            else {
                // rollback
                tokens.unshift(w);
                tokens.unshift(target);
            }
        };

        var definition = function (store) {
            return  callback(store)             ||
                    interface_(false, store)    ||
                    partial(store)              ||
                    dictionary(false, store)    ||
                    exception(store)            ||
                    enum_(store)                ||
                    typedef(store)              ||
                    implements_(store)
                    ;
        };

        var definitions = function (store) {
            if (!tokens.length) return [];
            var defs = [];
            while (true) {
                var ea = extended_attrs(store ? defs : null)
                ,   def = definition(store ? defs : null);
                if (!def) {
                    if (ea.length) error("Stray extended attributes");
                    break;
                }
                def.extAttrs = ea;
                defs.push(def);
            }
            return defs;
        };
        var res = definitions(opt.ws);
        if (tokens.length) error("Unrecognised tokens");
        return res;
    };

    var inNode = typeof module !== "undefined" && module.exports
    ,   obj = {
            parse:  function (str, opt) {
                if (!opt) opt = {};
                var tokens = tokenise(str);
                return parse(tokens, opt);
            }
    };

    if (inNode) module.exports = obj;
    else        self.WebIDL2 = obj;
}());

define("webidl2", function(){});


define('tmpl!core/css/webidl-oldschool.css', ['handlebars'], function (hb) { return Handlebars.compile('/* --- WEB IDL --- */\npre.idl {\n    border-top: 1px solid #90b8de;\n    border-bottom: 1px solid #90b8de;\n    padding:    1em;\n    line-height:    120%;\n}\n\n@media print {\n  pre.idl {\n      white-space: pre-wrap;\n  }\n}\n\npre.idl::before {\n    content:    "WebIDL";\n    display:    block;\n    width:      150px;\n    background: #90b8de;\n    color:  #fff;\n    font-family:    sans-serif;\n    padding:    3px;\n    font-weight:    bold;\n    margin: -1em 0 1em -1em;\n}\n\n.idlType {\n    color:  #ff4500;\n    font-weight:    bold;\n    text-decoration:    none;\n}\n\n/*.idlModule*/\n/*.idlModuleID*/\n/*.idlInterface*/\n.idlInterfaceID, .idlDictionaryID, .idlCallbackID, .idlEnumID {\n    font-weight:    bold;\n    color:  #005a9c;\n}\na.idlEnumItem {\n    color:  #000;\n    border-bottom:  1px dotted #ccc;\n    text-decoration: none;\n}\n\n.idlSuperclass {\n    font-style: italic;\n    color:  #005a9c;\n}\n\n/*.idlAttribute*/\n.idlAttrType, .idlFieldType, .idlMemberType {\n    color:  #005a9c;\n}\n.idlAttrName, .idlFieldName, .idlMemberName {\n    color:  #ff4500;\n}\n.idlAttrName a, .idlFieldName a, .idlMemberName a {\n    color:  #ff4500;\n    border-bottom:  1px dotted #ff4500;\n    text-decoration: none;\n}\n\n/*.idlMethod*/\n.idlMethType, .idlCallbackType {\n    color:  #005a9c;\n}\n.idlMethName {\n    color:  #ff4500;\n}\n.idlMethName a {\n    color:  #ff4500;\n    border-bottom:  1px dotted #ff4500;\n    text-decoration: none;\n}\n\n/*.idlCtor*/\n.idlCtorName {\n    color:  #ff4500;\n}\n.idlCtorName a {\n    color:  #ff4500;\n    border-bottom:  1px dotted #ff4500;\n    text-decoration: none;\n}\n\n/*.idlParam*/\n.idlParamType {\n    color:  #005a9c;\n}\n.idlParamName, .idlDefaultValue {\n    font-style: italic;\n}\n\n.extAttr {\n    color:  #666;\n}\n\n/*.idlSectionComment*/\n.idlSectionComment {\n    color: gray;\n}\n\n/*.idlIterable*/\n.idlIterableKeyType, .idlIterableValueType {\n    color:  #005a9c;\n}\n\n/*.idlMaplike*/\n.idlMaplikeKeyType, .idlMaplikeValueType {\n    color:  #005a9c;\n}\n\n/*.idlConst*/\n.idlConstType {\n    color:  #005a9c;\n}\n.idlConstName {\n    color:  #ff4500;\n}\n.idlConstName a {\n    color:  #ff4500;\n    border-bottom:  1px dotted #ff4500;\n    text-decoration: none;\n}\n\n/*.idlException*/\n.idlExceptionID {\n    font-weight:    bold;\n    color:  #c00;\n}\n\n.idlTypedefID, .idlTypedefType {\n    color:  #005a9c;\n}\n\n.idlRaises, .idlRaises a.idlType, .idlRaises a.idlType code, .excName a, .excName a code {\n    color:  #c00;\n    font-weight:    normal;\n}\n\n.excName a {\n    font-family:    monospace;\n}\n\n.idlRaises a.idlType, .excName a.idlType {\n    border-bottom:  1px dotted #c00;\n}\n\n.excGetSetTrue, .excGetSetFalse, .prmNullTrue, .prmNullFalse, .prmOptTrue, .prmOptFalse {\n    width:  45px;\n    text-align: center;\n}\n.excGetSetTrue, .prmNullTrue, .prmOptTrue { color:  #0c0; }\n.excGetSetFalse, .prmNullFalse, .prmOptFalse { color:  #c00; }\n\n.idlImplements a {\n    font-weight:    bold;\n}\n\ndl.attributes, dl.methods, dl.constants, dl.constructors, dl.fields, dl.dictionary-members {\n    margin-left:    2em;\n}\n\n.attributes dt, .methods dt, .constants dt, .constructors dt, .fields dt, .dictionary-members dt {\n    font-weight:    normal;\n}\n\n.attributes dt code, .methods dt code, .constants dt code, .constructors dt code, .fields dt code, .dictionary-members dt code {\n    font-weight:    bold;\n    color:  #000;\n    font-family:    monospace;\n}\n\n.attributes dt code, .fields dt code, .dictionary-members dt code {\n    background:  #ffffd2;\n}\n\n.attributes dt .idlAttrType code, .fields dt .idlFieldType code, .dictionary-members dt .idlMemberType code {\n    color:  #005a9c;\n    background:  transparent;\n    font-family:    inherit;\n    font-weight:    normal;\n    font-style: italic;\n}\n\n.methods dt code {\n    background:  #d9e6f8;\n}\n\n.constants dt code {\n    background:  #ddffd2;\n}\n\n.constructors dt code {\n    background:  #cfc;\n}\n\n.attributes dd, .methods dd, .constants dd, .constructors dd, .fields dd, .dictionary-members dd {\n    margin-bottom:  1em;\n}\n\ntable.parameters, table.exceptions {\n    border-spacing: 0;\n    border-collapse:    collapse;\n    margin: 0.5em 0;\n    width:  100%;\n}\ntable.parameters { border-bottom:  1px solid #90b8de; }\ntable.exceptions { border-bottom:  1px solid #deb890; }\n\n.parameters th, .exceptions th {\n    color:  #fff;\n    padding:    3px 5px;\n    text-align: left;\n    font-weight:    normal;\n    text-shadow:    #666 1px 1px 0;\n}\n.parameters th { background: #90b8de; }\n.exceptions th { background: #deb890; }\n\n.parameters td, .exceptions td {\n    padding:    3px 10px;\n    border-top: 1px solid #ddd;\n    vertical-align: top;\n}\n\n.parameters tr:first-child td, .exceptions tr:first-child td {\n    border-top: none;\n}\n\n.parameters td.prmName, .exceptions td.excName, .exceptions td.excCodeName {\n    width:  100px;\n}\n\n.parameters td.prmType {\n    width:  120px;\n}\n\ntable.exceptions table {\n    border-spacing: 0;\n    border-collapse:    collapse;\n    width:  100%;\n}\n');});


define('tmpl!core/templates/webidl-contiguous/typedef.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlTypedef\' id=\'{{obj.idlId}}\' data-idl data-title=\'{{obj.name}}\'>typedef {{typeExtAttrs obj\n}}<span class=\'idlTypedefType\'>{{idlType obj\n}}</span> <span class=\'idlTypedefID\'>{{#tryLink obj}}{{obj.name}}{{/tryLink}}</span>;</span>');});


define('tmpl!core/templates/webidl-contiguous/implements.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlImplements\'>{{extAttr obj indent\n}}{{idn indent}}<a>{{obj.target}}</a> implements <a>{{obj.implements}}</a>;</span>');});


define('tmpl!core/templates/webidl-contiguous/dict-member.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlMember\' id="{{obj.idlId}}" data-idl data-title=\'{{obj.name}}\'>{{extAttr obj indent\n}}{{idn indent}}{{qualifiers}}<span class=\'idlMemberType\'>{{idlType obj}}</span> {{pads typePad\n}}<span class=\'idlMemberName\'>{{#tryLink obj}}{{obj.name}}{{/tryLink}}</span>{{#if obj.default\n}} = <span class=\'idlMemberValue\'>{{stringifyIdlConst obj.default}}</span>{{/if}};</span>\n');});


define('tmpl!core/templates/webidl-contiguous/dictionary.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlDictionary\' id=\'{{obj.idlId}}\' data-idl data-title=\'{{obj.name}}\'>{{extAttr obj indent\n}}{{idn indent}}{{partial}}dictionary <span class=\'idlDictionaryID\'>{{#tryLink obj}}{{obj.name}}{{/tryLink\n}}</span>{{#if obj.inheritance}} : <span class=\'idlSuperclass\'><a>{{obj.inheritance}}</a></span>{{/if}} {\n{{{children}}}};</span>');});


define('tmpl!core/templates/webidl-contiguous/enum-item.html', ['handlebars'], function (hb) { return Handlebars.compile('{{idn indent}}"<a href="#dom-{{parentID}}-{{lname}}" class="idlEnumItem">{{name}}</a>"{{#if needsComma}},{{/if}}\n');});


define('tmpl!core/templates/webidl-contiguous/enum.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlEnum\' id=\'{{obj.idlId}}\' data-idl data-title=\'{{obj.name}}\'>{{extAttr obj indent\n}}{{idn indent}}enum <span class=\'idlEnumID\'>{{#tryLink obj}}{{obj.name}}{{/tryLink}}</span> {\n{{{children}}}{{idn indent}}}};</span>');});


define('tmpl!core/templates/webidl-contiguous/const.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlConst\' id="{{obj.idlId}}" data-idl data-title=\'{{obj.name}}\'>{{extAttr obj indent\n}}{{idn indent}}const <span class=\'idlConstType\'>{{idlType obj}}</span>{{nullable}} {{pads pad\n}}<span class=\'idlConstName\'>{{#tryLink obj}}{{obj.name\n}}{{/tryLink}}</span> = <span class=\'idlConstValue\'>{{stringifyIdlConst obj.value}}</span>;</span>\n');});


define('tmpl!core/templates/webidl-contiguous/param.html', ['handlebars'], function (hb) { return Handlebars.compile('{{!-- obj is an instance of https://github.com/darobin/webidl2.js#arguments\n--}}<span class=\'idlParam\'>{{extAttrInline obj\n}}{{optional}}<span class=\'idlParamType\'>{{idlType obj}}{{variadic\n}}</span> <span class=\'idlParamName\'>{{obj.name}}</span>{{#if obj.default\n}} = <span class=\'idlDefaultValue\'>{{stringifyIdlConst obj.default}}</span>{{/if}}</span>');});


define('tmpl!core/templates/webidl-contiguous/callback.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlCallback\' id=\'{{obj.idlId}}\' data-idl data-title=\'{{obj.name}}\'>{{extAttr obj indent\n}}{{idn indent}}callback <span class=\'idlCallbackID\'>{{#tryLink obj}}{{obj.name\n}}{{/tryLink}}</span> = <span class=\'idlCallbackType\'>{{idlType obj}}</span> ({{{children}}});</span>');});


define('tmpl!core/templates/webidl-contiguous/method.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlMethod\' id="{{obj.idlId}}" data-idl data-title=\'{{obj.name}}\'>{{extAttr obj indent\n}}{{idn indent}}{{static}}{{special}}<span class=\'idlMethType\'>{{idlType obj}}</span> {{pads pad\n}}<span class=\'idlMethName\'>{{#tryLink obj}}{{obj.name}}{{/tryLink}}</span>({{{children}}});</span>\n');});


define('tmpl!core/templates/webidl-contiguous/attribute.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlAttribute\' id="{{obj.idlId}}" data-idl data-title=\'{{obj.name}}\'>{{extAttr obj indent\n}}{{idn indent}}{{qualifiers}}attribute <span class=\'idlAttrType\'>{{idlType obj}}</span> {{pads\npad}}<span class=\'idlAttrName\'>{{#tryLink obj}}{{escapeAttributeName obj.name}}{{/tryLink}}</span>;</span>\n');});


define('tmpl!core/templates/webidl-contiguous/serializer.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlSerializer\' id="{{obj.idlId}}" data-idl data-title=\'serializer\'>{{extAttr obj indent\n}}{{idn indent}}{{#tryLink obj}}serializer{{/tryLink\n}}{{#if values}} = <span class=\'idlSerializerValues\'>{{values}}</span>{{/if}};</span>\n');});


define('tmpl!core/templates/webidl-contiguous/maplike.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlMaplike\' id="{{obj.idlId}}" data-idl data-title=\'maplike\'>{{extAttr obj indent\n}}{{idn indent}}{{qualifiers}}{{#tryLink obj}}maplike{{/tryLink\n}}&lt;{{idlType obj}}&gt;;</span>\n');});


define('tmpl!core/templates/webidl-contiguous/line-comment.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlSectionComment\'>{{idn indent}}//{{comment}}</span>\n');});


define('tmpl!core/templates/webidl-contiguous/multiline-comment.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlSectionComment\'>{{idn indent}}/*{{firstLine}}\n{{#each innerLine}}{{idn ../indent}}{{this}}\n{{/each}}{{idn indent}}{{lastLine}}*/</span>\n');});


define('tmpl!core/templates/webidl-contiguous/field.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlField\' id="{{obj.idlId}}" data-idl data-title=\'{{obj.name}}\'>{{extAttr obj indent\n}}{{idn indent}}<span class=\'idlFieldType\'>{{idlType obj}}</span> {{pads\npad}}<span class=\'idlFieldName\'>{{#tryLink obj}}{{obj.name}}{{/tryLink}}</span>;</span>\n');});


define('tmpl!core/templates/webidl-contiguous/exception.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlException\' id=\'{{obj.idlId}}\' data-idl data-title=\'{{obj.name}}\'>{{extAttr obj indent\n}}{{idn indent}}exception <span class=\'idlExceptionID\'>{{#tryLink obj}}{{obj.name}}{{/tryLink\n}}</span>{{#if obj.inheritance}} : <span class=\'idlSuperclass\'><a>{{obj.inheritance}}</a></span>{{/if}} {\n{{{children}}}{{idn indent}}}};</span>');});


define('tmpl!core/templates/webidl-contiguous/extended-attribute.html', ['handlebars'], function (hb) { return Handlebars.compile('{{!-- extAttrs should match the structure at https://github.com/darobin/webidl2.js#extended-attributes.\n--}}{{idn indent}}[{{#join extAttrs sep\n  }}<span class=\'{{extAttrClassName}}\'><span class="extAttrName">{{name\n  }}</span>{{#if rhs}}=<span class="extAttrRhs">{{#extAttrRhs rhs}}{{ this }}{{/extAttrRhs}}</span>{{/if\n  }}{{#jsIf arguments}}({{#joinNonWhitespace arguments ", "}}{{param this}}{{/joinNonWhitespace}}){{/jsIf\n}}</span>{{/join}}]{{end}}');});


define('tmpl!core/templates/webidl-contiguous/interface.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlInterface\' id=\'{{obj.idlId}}\' data-idl data-title=\'{{obj.name}}\'>{{extAttr obj indent\n}}{{idn indent}}{{partial}}{{callback}}interface <span class=\'idlInterfaceID\'>{{#tryLink obj}}{{obj.name}}{{/tryLink\n}}</span>{{#if obj.inheritance}} : <span class=\'idlSuperclass\'><a>{{obj.inheritance}}</a></span>{{/if}} {\n{{{children}}}{{idn indent}}}};</span>');});

/*global Handlebars */

// Module core/webidl-contiguous
//  Highlights and links WebIDL marked up inside <pre class="idl">.

// TODO:
//  - It could be useful to report parsed IDL items as events
//  - don't use generated content in the CSS!

define(
    'core/webidl-contiguous',[
        "handlebars"
    ,   "webidl2"
    ,   "tmpl!core/css/webidl-oldschool.css"
    ,   "tmpl!core/templates/webidl-contiguous/typedef.html"
    ,   "tmpl!core/templates/webidl-contiguous/implements.html"
    ,   "tmpl!core/templates/webidl-contiguous/dict-member.html"
    ,   "tmpl!core/templates/webidl-contiguous/dictionary.html"
    ,   "tmpl!core/templates/webidl-contiguous/enum-item.html"
    ,   "tmpl!core/templates/webidl-contiguous/enum.html"
    ,   "tmpl!core/templates/webidl-contiguous/const.html"
    ,   "tmpl!core/templates/webidl-contiguous/param.html"
    ,   "tmpl!core/templates/webidl-contiguous/callback.html"
    ,   "tmpl!core/templates/webidl-contiguous/method.html"
    ,   "tmpl!core/templates/webidl-contiguous/attribute.html"
    ,   "tmpl!core/templates/webidl-contiguous/serializer.html"
    ,   "tmpl!core/templates/webidl-contiguous/maplike.html"
    ,   "tmpl!core/templates/webidl-contiguous/line-comment.html"
    ,   "tmpl!core/templates/webidl-contiguous/multiline-comment.html"
    ,   "tmpl!core/templates/webidl-contiguous/field.html"
    ,   "tmpl!core/templates/webidl-contiguous/exception.html"
    ,   "tmpl!core/templates/webidl-contiguous/extended-attribute.html"
    ,   "tmpl!core/templates/webidl-contiguous/interface.html"
    ],
    function (hb, webidl2, css, idlTypedefTmpl, idlImplementsTmpl, idlDictMemberTmpl, idlDictionaryTmpl,
                   idlEnumItemTmpl, idlEnumTmpl, idlConstTmpl, idlParamTmpl, idlCallbackTmpl, idlMethodTmpl,
              idlAttributeTmpl, idlSerializerTmpl, idlMaplikeTmpl, idlLineCommentTmpl, idlMultiLineCommentTmpl, idlFieldTmpl, idlExceptionTmpl,
              idlExtAttributeTmpl, idlInterfaceTmpl) {
        "use strict";
        function registerHelpers (msg) {
            Handlebars.registerHelper("extAttr", function (obj, indent) {
                return extAttr(obj.extAttrs, indent, /*singleLine=*/false);
            });
            Handlebars.registerHelper("extAttrInline", function (obj) {
                return extAttr(obj.extAttrs, 0, /*singleLine=*/true);
            });
            Handlebars.registerHelper("typeExtAttrs", function (obj) {
                return extAttr(obj.typeExtAttrs, 0, /*singleLine=*/true);
            });
            Handlebars.registerHelper("extAttrClassName", function() {
                var extAttr = this;
                if (extAttr.name === "Constructor" || extAttr.name === "NamedConstructor") {
                    return "idlCtor";
                }
                return "extAttr";
            });
            Handlebars.registerHelper("extAttrRhs", function(rhs, options) {
                if (rhs.type === "identifier") {
                    return options.fn(rhs.value);
                }
                return "(" + rhs.value.map(function(item) { return options.fn(item); }).join(",") + ")";
            });
            Handlebars.registerHelper("param", function (obj) {
                return new Handlebars.SafeString(
                    idlParamTmpl({
                        obj:        obj
                    ,   optional:   obj.optional ? "optional " : ""
                    ,   variadic:   obj.variadic ? "..." : ""
                    }));
            });
            Handlebars.registerHelper("jsIf", function (condition, options) {
                if (condition) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            });
            Handlebars.registerHelper("idn", function (indent) {
                return new Handlebars.SafeString(idn(indent));
            });
            Handlebars.registerHelper("idlType", function (obj) {
                return new Handlebars.SafeString(idlType2Html(obj.idlType));
            });
            Handlebars.registerHelper("stringifyIdlConst", function (value) {
                switch (value.type) {
                    case "null": return "null";
                    case "Infinity": return value.negative ? "-Infinity" : "Infinity";
                    case "NaN": return "NaN";
                    case "string":
                    case "number":
                    case "boolean":
                    case "sequence":
                        return JSON.stringify(value.value);
                    default:
                        msg.pub("error", "Unexpected constant value type: " + value.type);
                        return "<Unknown>";
                }
            });
            Handlebars.registerHelper("escapeArgumentName", escapeArgumentName);
            Handlebars.registerHelper("escapeAttributeName", escapeAttributeName);
            Handlebars.registerHelper("escapeIdentifier", escapeIdentifier);
            Handlebars.registerHelper("pads", function (num) {
                return new Handlebars.SafeString(pads(num));
            });
            Handlebars.registerHelper("join", function(arr, between, options) {
                return arr.map(function(elem) { return options.fn(elem); }).join(between);
            });
            Handlebars.registerHelper("joinNonWhitespace", function(arr, between, options) {
                return arr.filter(function(elem) {
                    return elem.type !== "ws";
                }).map(function(elem) {
                    return options.fn(elem);
                }).join(between);
            });
            // A block helper that emits an <a title> around its contents
            // if obj.dfn exists. If it exists, that implies that
            // there's another <dfn> for the object.
            Handlebars.registerHelper("tryLink", function(obj, options) {
                var content = options.fn(this);
                if (obj.dfn) {
                    var result = "<a for='" + Handlebars.Utils.escapeExpression(obj.linkFor || "") + "'";
                    if (obj.name) {
                        result += " data-lt='" + Handlebars.Utils.escapeExpression(obj.name) + (obj.overload ? "!overload-" + obj.overload + "' data-lt-noDefault" : "'") ;
                    }
                    result += ">" + content + "</a>";
                    return result;
                } else {
                    return content;
                }
            });
        }
        function idn (lvl) {
            var str = "";
            for (var i = 0; i < lvl; i++) str += "    ";
            return str;
        }
        function idlType2Html (idlType) {
            if (typeof idlType === "string") {
                return "<a>" + Handlebars.Utils.escapeExpression(idlType) + "</a>";
            }
            if (Array.isArray(idlType)) {
                return idlType.map(idlType2Html).join(", ");
            }
            var nullable = idlType.nullable ? "?" : "";
            if (idlType.union) {
                return '(' + idlType.idlType.map(function(type) {
                    return idlType2Html(type);
                }).join(' or ') + ')' + nullable;
            }
            if (idlType.array) {
                var arrayStr = '';
                for (var i = 0; i < idlType.array; ++i) {
                    if (idlType.nullableArray[i]) {
                        arrayStr += '?';
                    }
                    arrayStr += '[]';
                }
                return idlType2Html({
                        generic: idlType.generic,
                        idlType: idlType.idlType,
                    }) + arrayStr + nullable;
            }
            if (idlType.generic) {
                return Handlebars.Utils.escapeExpression(idlType.generic) + '&lt;' + idlType2Html(idlType.idlType) + '>' + nullable;
            }
            return idlType2Html(idlType.idlType) + nullable;
        }
        function idlType2Text(idlType) {
            if (typeof idlType === 'string') {
                return idlType;
            }
            var nullable = idlType.nullable ? "?" : "";
            if (idlType.union) {
                return '(' + idlType.idlType.map(function(type) {
                    return idlType2Text(type);
                }).join(' or ') + ')' + nullable;
            }
            if (idlType.array) {
                var arrayStr = '';
                for (var i = 0; i < idlType.array; ++i) {
                    if (idlType.nullableArray[i]) {
                        arrayStr += '?';
                    }
                    arrayStr += '[]';
                }
                return idlType2Text({
                        generic: idlType.generic,
                        idlType: idlType.idlType,
                    }) + arrayStr + nullable;
            }
            if (idlType.generic) {
                return idlType.generic + '<' + idlType2Text(idlType.idlType) + '>' + nullable;
            }
            return idlType2Text(idlType.idlType) + nullable;
        }
        function pads (num) {
            // XXX
            //  this might be more simply done as
            //  return Array(num + 1).join(" ")
            var str = "";
            for (var i = 0; i < num; i++) str += " ";
            return str;
        }
        var whitespaceTypes = {"ws": true, "ws-pea": true, "ws-tpea": true, "line-comment": true, "multiline-comment": true};
        function typeIsWhitespace(webIdlType) {
            return whitespaceTypes[webIdlType];
        }
        function extAttr(extAttrs, indent, singleLine) {
            if (extAttrs.length === 0) {
                // If there are no extended attributes, omit the [] entirely.
                return "";
            }
            var opt = {
                extAttrs: extAttrs,
                indent: indent,
                sep: singleLine ? ", " : ",\n " + idn(indent),
                end: singleLine ? " " : "\n",
            };
            return new Handlebars.SafeString(idlExtAttributeTmpl(opt));
        }
        var idlKeywords = [
                "ByteString",
                "DOMString",
                "Date",
                "Infinity",
                "NaN",
                "RegExp",
                "USVString",
                "any",
                "attribute",
                "boolean",
                "byte",
                "callback",
                "const",
                "creator",
                "deleter",
                "dictionary",
                "double",
                "enum",
                "false",
                "float",
                "getter",
                "implements",
                "inherit",
                "interface",
                "iterable",
                "legacycaller",
                "legacyiterable",
                "long",
                "maplike",
                "null",
                "object",
                "octet",
                "optional",
                "or",
                "partial",
                "readonly",
                "required",
                "sequence",
                "serializer",
                "setlike",
                "setter",
                "short",
                "static",
                "stringifier",
                "true",
                "typedef",
                "unrestricted",
                "unsigned",
                "void",
            ]
        ,   ArgumentNameKeyword = [
                "attribute",
                "callback",
                "const",
                "creator",
                "deleter",
                "dictionary",
                "enum",
                "getter",
                "implements",
                "inherit",
                "interface",
                "iterable",
                "legacycaller",
                "legacyiterable",
                "maplike",
                "partial",
                "required",
                "serializer",
                "setlike",
                "setter",
                "static",
                "stringifier",
                "typedef",
                "unrestricted",
            ]
        ,   AttributeNameKeyword = ["required"];
        var operationNames = {};
        var idlPartials = {};
        function escapeArgumentName(argumentName) {
            if (idlKeywords.indexOf(argumentName) !== -1 && ArgumentNameKeyword.indexOf(argumentName) === -1)
                return "_" + argumentName;
            return argumentName;
        }
        function escapeAttributeName(attributeName) {
            if (idlKeywords.indexOf(attributeName) !== -1 && AttributeNameKeyword.indexOf(attributeName) === -1)
                return "_" + attributeName;
            return attributeName;
        }
        function escapeIdentifier(identifier) {
            if (idlKeywords.indexOf(identifier) !== -1)
                return "_" + identifier;
            return identifier;
        }

        // Takes the result of WebIDL2.parse(), an array of definitions.
        function makeMarkup (conf, parse, msg) {
            var attr = { "class": ( conf.useExperimentalStyles ? "def idl" :  "idl" ) };
            var $pre = $("<pre></pre>").attr(attr);
            $pre.html(parse.filter(function(defn) { return !typeIsWhitespace(defn.type); })
                           .map(function(defn) { return writeDefinition(defn, -1, msg); })
                           .join('\n\n'));
            return $pre;
        }

        function writeDefinition (obj, indent, msg) {
            indent++;
            var opt = { indent: indent, obj: obj };
            switch (obj.type) {
                case "typedef":
                    return idlTypedefTmpl(opt);
                case "implements":
                    return idlImplementsTmpl(opt);
                case "interface":
                    return writeInterfaceDefinition(opt);
                case "callback interface":
                    return writeInterfaceDefinition(opt, "callback ");
                case "exception":
                    var maxAttr = 0, maxConst = 0;
                    obj.members.forEach(function (it) {
                        if (typeIsWhitespace(it.type)) {
                            return;
                        }
                        var len = idlType2Text(it.idlType).length;
                        if (it.type === "field")   maxAttr = (len > maxAttr) ? len : maxAttr;
                        else if (it.type === "const") maxConst = (len > maxConst) ? len : maxConst;
                    });
                    var children = obj.members
                                      .map(function (ch) {
                                          switch (ch.type) {
                                            case "field": return writeField(ch, maxAttr, indent + 1);
                                            case "const": return writeConst(ch, maxConst, indent + 1);
                                            case "line-comment": return writeLineComment(ch, indent + 1);
                                            case "multiline-comment": return writeMultiLineComment(ch, indent + 1);
                                            case "ws": return writeBlankLines(ch);
                                            case "ws-pea": break;
                                            default:
                                                throw new Error('Unexpected type in exception: ' + it.type);
                                          }
                                      })
                                      .join("")
                    ;
                    return idlExceptionTmpl({ obj: obj, indent: indent, children: children });
                case "dictionary":
                    var maxQualifiers = 0, maxType = 0;
                    var members = obj.members.filter(function(member) { return !typeIsWhitespace(member.type); });
                    obj.members.forEach(function (it) {
                        if (typeIsWhitespace(it.type)) {
                            return;
                        }
                        var qualifiers = '';
                        if (it.required) qualifiers += 'required ';
                        if (maxQualifiers < qualifiers.length) maxQualifiers = qualifiers.length;

                        var typeLen = idlType2Text(it.idlType).length;
                        if (maxType < typeLen) maxType = typeLen;
                    });
                    var children = obj.members
                                      .map(function (it) {
                                          switch(it.type) {
                                            case "field": return writeMember(it, maxQualifiers, maxType, indent + 1);
                                            case "line-comment": return writeLineComment(it, indent + 1);
                                            case "multiline-comment": return writeMultiLineComment(it, indent + 1);
                                            case "ws": return writeBlankLines(it);
                                            case "ws-pea": break;
                                            default:
                                                throw new Error('Unexpected type in dictionary: ' + it.type);
                                          }
                                      })
                                      .join("")
                    ;
                    return idlDictionaryTmpl({ obj: obj, indent: indent, children: children, partial: obj.partial ? "partial " : "" });
                case "callback":
                    var paramObjs = obj.arguments
                                    .filter(function(it) {
                                        return !typeIsWhitespace(it.type);
                                    })
                                    .map(function (it) {
                                        return idlParamTmpl({
                                            obj:        it
                                        ,   optional:   it.optional ? "optional " : ""
                                        ,   variadic:   it.variadic ? "..." : ""
                                        });
                                    });
                    var callbackObj = {
                        obj:        obj
                    ,   indent:     indent
                    ,   children:   paramObjs.join(", ")
                    }
                    var ret = idlCallbackTmpl(callbackObj);
                    var line = $(ret).text();
                    if (line.length > 80) {
                        var paramPad = line.indexOf('(') + 1;
                        callbackObj.children = paramObjs.join(",\n" + pads(paramPad));

                        ret = idlCallbackTmpl(callbackObj);
                    }
                    return ret;
                case "enum":
                    var children = "";
                    for (var i = 0; i < obj.values.length; i++) {
                        var item = obj.values[i];
                        switch (item.type) {
                            case undefined:
                                var needsComma = false;
                                for (var j = i + 1; j < obj.values.length; j++) {
                                    var lookahead = obj.values[j];
                                    if (lookahead.type === undefined) break;
                                    if (lookahead.type === ",") {
                                        needsComma = true;
                                        break;
                                    }
                                }
                                children += idlEnumItemTmpl({
                                    lname: item.toString().toLowerCase(),
                                    name: item.toString(),
                                    parentID: obj.name.toLowerCase(),
                                    indent: indent + 1,
                                    needsComma: needsComma
                                });
                                break;
                            case "line-comment": children += writeLineComment(item, indent + 1); break;
                            case "multiline-comment": children += writeMultiLineComment(item, indent + 1); break;
                            case "ws": children += writeBlankLines(item); break;
                            case ",":
                            case "ws-pea": break;
                            default:
                                throw new Error('Unexpected type in exception: ' + item.type);
                        }
                    }
                    return idlEnumTmpl({obj: obj, indent: indent, children: children });
                default:
                    msg.pub("error", "Unexpected object type " + obj.type + " in " + JSON.stringify(obj));
                    return "";
            }
        }

        function writeInterfaceDefinition(opt, callback) {
            var obj = opt.obj, indent = opt.indent;
            var maxAttr = 0, maxAttrQualifiers = 0, maxMeth = 0, maxConst = 0;
            obj.members.forEach(function (it) {
                if (typeIsWhitespace(it.type) || it.type === "serializer" || it.type === "maplike") {
                    return;
                }
                var len = idlType2Text(it.idlType).length;
                if (it.type === "attribute") {
                    var qualifiersLen = writeAttributeQualifiers(it).length;
                    maxAttr = (len > maxAttr) ? len : maxAttr;
                    maxAttrQualifiers = (qualifiersLen > maxAttrQualifiers) ? qualifiersLen : maxAttrQualifiers;
                } else if (it.type === "operation") maxMeth = (len > maxMeth) ? len : maxMeth;
                else if (it.type === "const") maxConst = (len > maxConst) ? len : maxConst;
            });
            var children = obj.members
                              .map(function (ch) {
                                  switch (ch.type) {
                                      case "attribute": return writeAttribute(ch, maxAttr, indent + 1, maxAttrQualifiers);
                                      case "operation": return writeMethod(ch, maxMeth, indent + 1);
                                      case "const": return writeConst(ch, maxConst, indent + 1);
                                      case "serializer": return writeSerializer(ch, indent + 1);
                                      case "maplike": return writeMaplike(ch, indent + 1);
                                      case "ws": return writeBlankLines(ch);
                                      case "line-comment": return writeLineComment(ch, indent + 1);
                                      case "multiline-comment": return writeMultiLineComment(ch, indent + 1);
                                      default: throw new Error("Unexpected member type: " + ch.type);
                                  }
                              })
                              .join("")
            ;
            return idlInterfaceTmpl({
                obj:        obj
            ,   indent:     indent
            ,   partial:    obj.partial ? "partial " : ""
            ,   callback:   callback
            ,   children:   children
            });
        }

        function writeField (attr, max, indent) {
            var pad = max - idlType2Text(attr.idlType).length;
            return idlFieldTmpl({
                obj:        attr
            ,   indent:     indent
            ,   pad:        pad
            });
        }

        function writeAttributeQualifiers(attr) {
            var qualifiers = "";
            if (attr.static) qualifiers += "static ";
            if (attr.stringifier) qualifiers += "stringifier ";
            if (attr.inherit) qualifiers += "inherit ";
            if (attr.readonly) qualifiers += "readonly ";
            return qualifiers;
        }

        function writeAttribute (attr, max, indent, maxQualifiers) {
            var len = idlType2Text(attr.idlType).length;
            var pad = max - len;
            var qualifiers = writeAttributeQualifiers(attr);
            qualifiers += pads(maxQualifiers);
            qualifiers = qualifiers.slice(0, maxQualifiers);
            return idlAttributeTmpl({
                obj:            attr
            ,   indent:         indent
            ,   qualifiers:     qualifiers
            ,   pad:            pad
            });
        }

        function writeMethod (meth, max, indent) {
            var paramObjs = meth.arguments
                            .filter(function (it) {
                                return !typeIsWhitespace(it.type);
                            }).map(function (it) {
                                return idlParamTmpl({
                                    obj:        it
                                    ,   optional:   it.optional ? "optional " : ""
                                    ,   variadic:   it.variadic ? "..." : ""
                                });
                            });
            var params = paramObjs.join(", ");
            var len = idlType2Text(meth.idlType).length;
            if (meth.static) len += 7;
            var specialProps = ["getter", "setter", "deleter", "legacycaller", "serializer", "stringifier"];
            var special = "";
            for (var i in specialProps) {
                if (meth[specialProps[i]]) {
                    special = specialProps[i] + " ";
                    len += special.length;
                    break;
                }
            }
            var pad = max - len;
            var methObj = {
                obj:        meth
            ,   indent:     indent
            ,   "static":   meth.static ? "static " : ""
            ,   special:    special
            ,   pad:        pad
            ,   children:   params
            };
            var ret = idlMethodTmpl(methObj);
            var line = $(ret).text();
            if (line.length > 80) {
                var paramPad = line.indexOf('(') + 1;
                methObj.children = paramObjs.join(",\n" + pads(paramPad));
                ret = idlMethodTmpl(methObj);
            }
            return ret;
        }

        function writeConst (cons, max, indent) {
            var pad = max - idlType2Text(cons.idlType).length;
            if (cons.nullable) pad--;
            return idlConstTmpl({ obj: cons, indent: indent, pad: pad, nullable: cons.nullable ? "?" : ""});
        }

        // Writes a single blank line if whitespace includes at least one blank line.
        function writeBlankLines(whitespace) {
            if (/\n.*\n/.test(whitespace.value)) {
                // Members end with a newline, so we only need 1 extra one to get a blank line.
                return "\n";
            }
            return "";
        }

        function writeLineComment (comment, indent) {
            return idlLineCommentTmpl({ indent: indent, comment: comment.value});
        }

        function writeMultiLineComment (comment, indent) {
            // Split the multi-line comment into lines so we can indent it properly.
            var lines = comment.value.split(/\r\n|\r|\n/);
            if (lines.length === 0) {
                return "";
            } else if (lines.length === 1) {
                return idlLineCommentTmpl({ indent: indent, comment: lines[0]});
            }
            var initialSpaces = Math.max(0, /^ */.exec(lines[1])[0].length - 3);
            function trimInitialSpace(line) {
                return line.slice(initialSpaces);
            }
            return idlMultiLineCommentTmpl({
                indent: indent,
                firstLine: lines[0],
                lastLine: trimInitialSpace(lines[lines.length - 1]),
                innerLine: lines.slice(1, -1).map(trimInitialSpace) });
        }

        function writeSerializer (serializer, indent) {
            var values = "";
            if (serializer.patternMap) {
                values = "{" + serializer.names.join(", ") + "}";
            }
            else if (serializer.patternList) {
                values = "[" + listValues.join(", ") + "]";
            }
            else if (serializer.name) {
                values = serializer.name;
            }
            return idlSerializerTmpl({
                obj:        serializer
            ,   indent:     indent
            ,   values:     values
            });
        }

        function writeMaplike (maplike, indent) {
            var qualifiers = "";
            if (maplike.readonly) qualifiers += "readonly ";
            return idlMaplikeTmpl({
                obj:        maplike
            ,   qualifiers:     qualifiers
            ,   indent:     indent
            });
        }

        function writeMember (memb, maxQualifiers, maxType, indent) {
            var opt = { obj: memb, indent: indent };
            opt.typePad = maxType - idlType2Text(memb.idlType).length;
            if (memb.required) opt.qualifiers = 'required ';
            else opt.qualifiers = '         ';
            opt.qualifiers = opt.qualifiers.slice(0, maxQualifiers);
            return idlDictMemberTmpl(opt);
        }

        // Each entity defined in IDL is either a top- or second-level entity:
        // Interface or Interface.member. This function finds the <dfn>
        // element defining each entity and attaches it to the entity's
        // 'refTitle' property, and records that it describes an IDL entity by
        // adding a [data-idl] attribute.
        function linkDefinitions(parse, definitionMap, parent, msg) {
            parse.forEach(function(defn) {
                var name;
                switch (defn.type) {
                    // Top-level entities with linkable members.
                    case "callback interface":
                    case "dictionary":
                    case "exception":
                    case "interface":
                        var partialIdx = "";
                        if (defn.partial) {
                            if (!idlPartials[defn.name]) {
                                idlPartials[defn.name] = [];
                            }
                            idlPartials[defn.name].push(defn);
                            partialIdx = "-partial-" + idlPartials[defn.name].length;
                        }

                        linkDefinitions(defn.members, definitionMap, defn.name, msg);
                        name = defn.name;
                        defn.idlId = "idl-def-" + name.toLowerCase() + partialIdx;
                        break;

                    case "enum":
                        name = defn.name;
                        defn.values.forEach(function(v,i) {
                            if (v.type === undefined) {
                                defn.values[i] = { toString: function() {return v;},
                                                   dfn: findDfn(name, v, definitionMap, msg)
                                                 };
                            }
                        });
                        defn.idlId = "idl-def-" + name.toLowerCase();
                        break;

                    // Top-level entities without linkable members.
                    case "callback":
                    case "typedef":
                        name = defn.name;
                        defn.idlId = "idl-def-" + name.toLowerCase();
                        break;

                    // Members of top-level entities.
                    case "attribute":
                    case "const":
                    case "field":
                        name = defn.name;
                        defn.idlId = "idl-def-" + parent.toLowerCase() + "-" + name.toLowerCase();
                        break;
                    case "operation":
                        if (defn.name) {
                            name = defn.name;
                            var qualifiedName = [parent + "." + name];
                            if (!operationNames[qualifiedName]) {
                                operationNames[qualifiedName] = [];
                            } else {
                                defn.overload = operationNames[qualifiedName].length;
                                name = defn.name + '!overload-' + defn.overload;
                            }
                            operationNames[qualifiedName].push(defn);
                        } else if (defn.getter || defn.setter || defn.deleter ||
                                   defn.legacycaller || defn.stringifier ||
                                   defn.serializer ) {
                            name = "";
                        }
                        defn.idlId = ("idl-def-" + parent.toLowerCase() + "-" +
                                      name.toLowerCase() + '(' +
                                      defn.arguments.filter(function(arg) {
                                          return !typeIsWhitespace(arg.type);
                                      }).map(function(arg) {
                                          var optional = arg.optional ? "optional-" : "";
                                          var variadic = arg.variadic ? "..." : "";
                                          return optional + idlType2Text(arg.idlType).toLowerCase() + variadic;
                                      }).join(',').replace(/\s/g, '_') + ')');
                        break;
                    case "maplike":
                        name = "maplike";
                        defn.idlId = ("idl-def-" + parent + "-" + name).toLowerCase();
                    case "iterator":
                        name = "iterator";
                        defn.idlId = "idl-def-" + parent.toLowerCase() + "-" + name.toLowerCase();
                        break;
                    case "serializer":
                        name = "serializer";
                        defn.idlId = "idl-def-" + parent.toLowerCase() + "-" + name.toLowerCase();
                        break;

                    case "implements":
                    case "ws":
                    case "ws-pea":
                    case "ws-tpea":
                    case "line-comment":
                    case "multiline-comment":
                        // Nothing to link here.
                        return;
                    default:
                        msg.pub("error", "Unexpected type when computing refTitles: " + defn.type);
                        return;
                }
                if (parent) {
                    defn.linkFor = parent;
                }
                defn.dfn = findDfn(parent, name, definitionMap, msg);
            });
        }

        // This function looks for a <dfn> element whose title is 'name' and
        // that is "for" 'parent', which is the empty string when 'name'
        // refers to a top-level entity. For top-level entities, <dfn>
        // elements that inherit a non-empty [dfn-for] attribute are also
        // counted as matching.
        //
        // When a matching <dfn> is found, it's given <code> formatting,
        // marked as an IDL definition, and returned.  If no <dfn> is found,
        // the function returns 'undefined'.
        function findDfn(parent, name, definitionMap, msg) {
            parent = parent.toLowerCase();
            name = name.toLowerCase();
            var dfnForArray = definitionMap[name];
            var dfns = [];
            if (dfnForArray) {
                // Definitions that have a title and [for] that exactly match the
                // IDL entity:
                dfns = dfnForArray.filter(function(dfn) {
                    return dfn.attr('data-dfn-for') === parent;
                });
                // If this is a top-level entity, and we didn't find anything with
                // an explicitly empty [for], try <dfn> that inherited a [for].
                if (dfns.length === 0 && parent === "" && dfnForArray.length === 1) {
                    dfns = dfnForArray;
                }
            }
            // If we haven't found any definitions with explicit [for]
            // and [title], look for a dotted definition, "parent.name".
            if (dfns.length === 0 && parent !== "") {
                var dottedName = parent + '.' + name;
                dfnForArray = definitionMap[dottedName];
                if (dfnForArray !== undefined && dfnForArray.length === 1) {
                    dfns = dfnForArray;
                    // Found it: update the definition to specify its [for] and data-lt.
                    delete definitionMap[dottedName];
                    dfns[0].attr('data-dfn-for', parent);
                    dfns[0].attr('data-lt', name);
                    if (definitionMap[name] === undefined) {
                        definitionMap[name] = [];
                    }
                    definitionMap[name].push(dfns[0]);
                }
            }
            if (dfns.length > 1) {
                msg.pub("error", "Multiple <dfn>s for " + name + (parent ? " in " + parent : ""));
            }
            if (dfns.length === 0) {
                return undefined;
            }
            var dfn = dfns[0];
            // Mark the definition as code.
            dfn.attr('id', "dom-" + (parent ? parent + "-" : "") + name)
            dfn.attr('data-idl', '');
            dfn.attr('data-dfn-for', parent);
            if (dfn.children('code').length === 0 && dfn.parents('code').length === 0)
                dfn.wrapInner('<code></code>');
            return dfn;
        }

        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/webidl-contiguous");
                registerHelpers(msg);
                var $idl = $("pre.idl", doc)
                ,   finish = function () {
                        msg.pub("end", "core/webidl-contiguous");
                        cb();
                    };
                if (!$idl.length) return finish();
                if (!$(".idl", doc).not("pre").length) {
                    $(doc).find("head link").first().before($("<style/>").text(css));
                }

                $idl.each(function () {
                    var parse;
                    try {
                        parse = window.WebIDL2.parse($(this).text(), {ws: true});
                    } catch(e) {
                        msg.pub("error", "Failed to parse <pre>" + $idl.text() + "</pre> as IDL: " + (e.stack || e));
                        // Skip this <pre> and move on to the next one.
                        return;
                    }
                    linkDefinitions(parse, conf.definitionMap, "", msg);
                    var $df = makeMarkup(conf, parse, msg);
                    $df.attr({id: this.id});
                    $df.find('.idlAttribute,.idlCallback,.idlConst,.idlDictionary,.idlEnum,.idlException,.idlField,.idlInterface,.idlMember,.idlMethod,.idlSerializer,.idlMaplike,.idlTypedef')
                        .each(function() {
                            var elem = $(this);
                            var title = elem.attr('data-title').toLowerCase();
                            // Select the nearest ancestor element that can contain members.
                            var parent = elem.parent().closest('.idlDictionary,.idlEnum,.idlException,.idlInterface');
                            if (parent.length) {
                                elem.attr('data-dfn-for', parent.attr('data-title').toLowerCase());
                            }
                            if (!conf.definitionMap[title]) {
                                conf.definitionMap[title] = [];
                            }
                            conf.definitionMap[title].push(elem);
                        });
                    $(this).replaceWith($df);
                });
                doc.normalize();
                finish();
            }
        };
    }
);


define('tmpl!core/templates/webidl/module.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlModule\'>{{extAttr obj indent true }}{{idn indent}}module <span class=\'idlModuleID\'>{{obj.id}}</span> {\n{{#each obj.children}}{{asWebIDL proc this indent}}{{/each}}\n{{idn indent}}};</span>\n');});


define('tmpl!core/templates/webidl/typedef.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlTypedef\' id=\'idl-def-{{obj.refId}}\'>typedef {{extAttr obj 0 false\n}}<span class=\'idlTypedefType\'>{{datatype obj.datatype\n}}</span>{{arr}}{{nullable}} <span class=\'idlTypedefID\'>{{obj.id}}</span>;</span>\n');});


define('tmpl!core/templates/webidl/implements.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlImplements\'>{{extAttr obj indent true}}{{idn indent}}<a>{{obj.id}}</a> implements <a>{{obj.datatype}}</a>;</span>\n');});


define('tmpl!core/templates/webidl/dict-member.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlMember\'>{{extAttr obj indent true\n}}{{idn indent}}{{declaration}} <span class=\'idlMemberType\'>{{datatype obj.datatype}}{{arr}}{{nullable}}</span> {{pads pad\n}}<span class=\'idlMemberName\'><a href=\'#{{curLnk}}{{obj.refId}}\'>{{obj.id}}</a></span>{{#if obj.defaultValue\n}} = <span class=\'idlMemberValue\'>{{obj.defaultValue}}</span>{{/if}};</span>\n');});


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


define('tmpl!core/templates/webidl/iterable.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlIterable\'>{{extAttr obj indent true\n}}{{idn indent}}iterable&lt;<span class=\'idlIterableKeyType\'>{{datatype obj.key}}</span>{{#if obj.value}},<span class=\'idlIterableValueType\'>{{datatype obj.value}}</span>{{/if}}&gt;;</span>\n');});


define('tmpl!core/templates/webidl/maplike.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlMaplike\'>{{extAttr obj indent true\n}}{{idn indent}}{{readonly}}maplike&lt;<span class=\'idlMaplikeKeyType\'>{{datatype obj.key}}</span>, <span class=\'idlMaplikeValueType\'>{{datatype obj.value}}</span>&gt;;</span>\n');});


define('tmpl!core/templates/webidl/comment.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlSectionComment\'>{{extAttr obj indent true\n}}{{idn indent}}// {{comment}}</span>\n');});


define('tmpl!core/templates/webidl/field.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlField\'>{{extAttr obj indent true\n}}{{idn indent}}<span class=\'idlFieldType\'>{{datatype obj.datatype}}{{arr}}{{nullable}}</span> {{pads\npad}}<span class=\'idlFieldName\'><a href=\'#{{href}}\'>{{obj.id}}</a></span>;</span>\n');});


define('tmpl!core/templates/webidl/exception.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlException\' id=\'idl-def-{{obj.refId}}\'>{{extAttr obj indent true\n}}{{idn indent}}exception <span class=\'idlExceptionID\'>{{obj.id}}</span>{{superclasses obj}} {\n{{{children}}}{{idn indent}}}};</span>');});


define('tmpl!core/templates/webidl/interface.html', ['handlebars'], function (hb) { return Handlebars.compile('<span class=\'idlInterface\' id=\'{{id}}\'>{{extAttr obj indent true ctor\n}}{{idn indent}}{{partial}}{{callback}}interface <span class=\'idlInterfaceID\'>{{obj.id}}</span>{{superclasses obj}} {\n{{{children}}}{{idn indent}}}};</span>');});

/*global Handlebars, simpleNode */

// Module core/webidl-oldschool
//  Transforms specific markup into the complex old school rendering for API information.

// TODO:
//  - It could be useful to report parsed IDL items as events
//  - don't use generated content in the CSS!

var sn;
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
    ,   "tmpl!core/templates/webidl/iterable.html"
    ,   "tmpl!core/templates/webidl/maplike.html"
    ,   "tmpl!core/templates/webidl/comment.html"
    ,   "tmpl!core/templates/webidl/field.html"
    ,   "tmpl!core/templates/webidl/exception.html"
    ,   "tmpl!core/templates/webidl/interface.html"
    ],
    function (hb, css, idlModuleTmpl, idlTypedefTmpl, idlImplementsTmpl, idlDictMemberTmpl, idlDictionaryTmpl,
                   idlEnumItemTmpl, idlEnumTmpl, idlConstTmpl, idlParamTmpl, idlCallbackTmpl, idlMethodTmpl,
              idlConstructorTmpl, idlAttributeTmpl, idlSerializerTmpl, idlIterableTmpl, idlMaplikeTmpl, idlCommentTmpl, idlFieldTmpl, idlExceptionTmpl, idlInterfaceTmpl) {
        var WebIDLProcessor = function (cfg) {
                this.parent = { type: "module", id: "outermost", children: [] };
                if (!cfg) cfg = {};
                for (var k in cfg) if (cfg.hasOwnProperty(k)) this[k] = cfg[k];

                Handlebars.registerHelper("extAttr", function (obj, indent, nl, ctor) {
                    var ret = "";
                    if (obj.extendedAttributes) {
                        ret += idn(indent) + "[<span class='extAttr'>" + obj.extendedAttributes + "</span>" +
                               (typeof ctor === 'string' && ctor.length ? ",\n" + ctor : "") + "]" + (nl ? "\n" : " ");
                    }
                    else if (typeof ctor === 'string' && ctor.length) {
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
                    var matched = /^(sequence|Promise|CancelablePromise|EventStream|FrozenArray)<(.+)>$/.exec(text);
                    if (matched)
                        return matched[1] + "&lt;<a>" + datatype(matched[2]) + "</a>&gt;";

                    return "<a>" + text + "</a>";
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
                obj.refId = obj.id.replace(/[^a-zA-Z0-9_\-]/g, "").replace(/^[0-9\-]*/, "");
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
                var match = /^\s*(?:(required)\s+)?([^=]+\??)\s+([^=\s]+)(?:\s*=\s*(.*))?$/.exec(str);
                if (match) {
                    obj.type = "member";
                    obj.declaration = match[1] ? match[1] : "";
                    obj.declaration += (new Array(9-obj.declaration.length)).join(" "); // fill string with spaces
                    var type = match[2];
                    obj.defaultValue = match[4];
                    this.setID(obj, match[3]);
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
                this.setID(obj, str || "EMPTY");
                obj.refId = sn.sanitiseID(obj.id); // override with different ID type
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
                match = /^\s*(?:(static)\s+)?(?:(readonly|inherit|stringifier)\s+)?attribute\s+(.*?)\s+(\S+)\s*$/.exec(str);
                if (match) {
                    obj.type = "attribute";
                    obj.declaration = match[1] ? match[1] : "";
                    obj.declaration += (obj.declaration ? " " : "") + (match[2] !== undefined ? match[2] : "");
                    obj.declaration += (new Array(16-obj.declaration.length)).join(" "); // fill string with spaces
                    var type = match[3];
                    this.parseDatatype(obj, type);
                    this.setID(obj, match[4]);
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

                // ITERABLE
                match = /^\s*iterable\s*<\s*([^,]*)\s*(,\s*(.*)\s*)?>\s*$/.exec(str);
                if (match) {
                    obj.type = "iterable";
                    obj.key = match[1];
                    obj.value = match[3];
                    return obj;
                }

                // MAPLIKE
                match = /^\s*(readonly\s+)?maplike\s*<\s*(.*)\s*,\s*(.*)\s*>\s*$/.exec(str);
                if (match) {
                    obj.type = "maplike";
                    obj.readonly = match[1] !== undefined;
                    obj.key = match[2];
                    obj.value = match[3];
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

            parseParameterized: function (str) {
                var matched = /^(sequence|Promise|CancelablePromise|EventStream|FrozenArray)<(.+)>$/.exec(str);
                if (!matched)
                    return null;
                return { type: matched[1], parameter: matched[2] };
            },

            writeSerializerAsHTML: function (div, it) {
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
            },

            writeIterableAsHTML: function (parent, iterable) {
                var members = '"entries", "keys", "values" and @@iterator methods';

                var p = sn.element("p", {}, parent);
                sn.text("This interface has " + members + " brought by ", p);
                sn.element("code", {}, p, "iterable");
                sn.text(".", p);

                sn.element("p", {}, parent, iterable.description);
            },

            writeMaplikeAsHTML: function (parent, maplike) {
                var readonly = "";
                var members = "";
                if (maplike.readonly) {
                    readonly = "readonly ";
                    members = '"entries", "forEach", "get", "has", "keys", "values", @@iterator methods and a "size" getter';
                } else {
                    members = '"entries", "forEach", "get", "has", "keys", "values", "clear", "delete", "set", @@iterator methods and a "size" getter';
                }

                var p = sn.element("p", {}, parent);
                sn.text("This interface has " + members + " brought by ", p);
                sn.element("code", {}, p, readonly + "maplike");
                sn.text(".", p);

                sn.element("p", {}, parent, maplike.description);
            },

            writeTypeFilteredThingsInInterfaceAsHTML: function (obj, curLnk, parent, type, things) {

                if (type == "iterable") {
                    // We assume iterable is specified at most once in one interface.
                    this.writeIterableAsHTML(parent, things[0]);
                    return;
                }

                if (type == "maplike") {
                    // We assume maplike is specified at most once in one interface.
                    this.writeMaplikeAsHTML(parent, things[0]);
                    return;
                }

                var sec = sn.element("section", {}, parent)
                var secTitle = type.substr(0, 1).toUpperCase() + type.substr(1) + (type != "serializer" ? "s" : "");
                if (!this.conf.noIDLSectionTitle) sn.element("h2", {}, sec, secTitle);
                if (type == "serializer") {
                    this.writeSerializerAsHTML(sn.element("div", {}, sec), things[0]);
                    return;
                }
                var dl = sn.element("dl", { "class": type + "s" }, sec);
                for (var j = 0; j < things.length; j++) {
                    var it = things[j];
                    var id = (type == "method") ? this.makeMethodID(curLnk, it) :
                        (type == "constructor") ? this.makeMethodID("widl-ctor-", it)
                        : sn.idThatDoesNotExist(curLnk + it.refId);
                    var dt = sn.element("dt", { id: id }, dl);
                    sn.element("code", {}, dt, it.unescapedId);
                    if (it.isStatic) dt.append(this.doc.createTextNode(", static"));
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
                                var codeHTML = datatype(prm.datatype);
                                if (prm.array) codeHTML += arrsq(prm);
                                if (prm.defaultValue) {
                                    codeHTML += " = " + prm.defaultValue;
                                }
                                code.html(codeHTML);
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
                                    dtd.append(exc.description);
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
                            var codeHTML = datatype(it.datatype);
                            if (it.array) codeHTML += arrsq(it);
                            if (it.nullable) sn.text(", nullable", reDiv);
                            code.html(codeHTML);
                        }
                    }
                    else if (type == "attribute") {
                        sn.text(" of type ", dt);
                        if (it.array) {
                            for (var m = 0, n = it.arrayCount; m < n; m++) sn.text("array of ", dt);
                        }
                        var span = sn.element("span", { "class": "idlAttrType" }, dt);
                        var parameterized = this.parseParameterized(it.datatype);
                        if (parameterized) {
                            sn.text(parameterized.type + "<", span);
                            sn.element("a", {}, span, parameterized.parameter);
                            sn.text(">", span);
                        }
                        else {
                            sn.element("a", {}, span, it.isUnionType ? "(" + it.datatype.join(" or ") + ")" : it.datatype);
                        }
                        if (it.declaration.trim()) sn.text(", " + it.declaration, dt);
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
                                    dtd.append(exc.description);
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
            },

            writeInterfaceAsHTML: function (obj) {
                var df = sn.documentFragment();
                var curLnk = "widl-" + obj.refId + "-";
                // iterable and maplike are placed first because they don't have their own sections.
                var types = ["iterable", "maplike", "constructor", "attribute", "method", "constant", "serializer"];
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

                    this.writeTypeFilteredThingsInInterfaceAsHTML(obj, curLnk, df, type, things);
                }
                return df;
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
                        var $tdt = sn.element("span", { "class": "idlTypedefType" }, null);
                        $tdt.html(datatype(obj.datatype));
                        cnt = [ sn.text("Throughout this specification, the identifier "),
                                sn.element("span", { "class": "idlTypedefID" }, null, obj.unescapedId),
                                sn.text(" is used to refer to the "),
                                sn.text(obj.array ? (obj.arrayCount > 1 ? obj.arrayCount + "-" : "") + "array of " : ""),
                                $tdt,
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
                                var parameterized = this.parseParameterized(it.datatype);
                                if (parameterized) {
                                    sn.text(parameterized.type + "<", span);
                                    sn.element("a", {}, span, parameterized.parameter);
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
                        var parameterized = this.parseParameterized(it.datatype);
                        if (parameterized) {
                            sn.text(parameterized.type + "<", span);
                            sn.element("a", {}, span, parameterized.parameter);
                            sn.text(">", span);
                        }
                        else {
                            sn.element("a", {}, span, it.isUnionType ? "(" + it.datatype.join(" or ") + ")" : it.datatype);
                        }
                        if (it.declaration.trim()) sn.text(", " + it.declaration, dt);
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
                        var parameterized = this.parseParameterized(it.datatype);
                        if (parameterized) {
                            sn.text(parameterized.type + "<", span);
                            sn.element("a", {}, span, parameterized.parameter);
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
                    return this.writeInterfaceAsHTML(obj);
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
                return sn.sanitiseID(id);
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
                                          else if (ch.type == "iterable") return self.writeIterable(ch, indent + 1, curLnk);
                                          else if (ch.type == "maplike") return self.writeMaplike(ch, indent + 1, curLnk);
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

            writeIterable: function (iterable, indent) {
                return idlIterableTmpl({
                    obj:        iterable
                ,   indent:     indent
                });
            },

            writeMaplike: function (maplike, indent) {
                var readonly = maplike.readonly ? "readonly " : "";
                return idlMaplikeTmpl({
                    obj:        maplike
                ,   indent:     indent
                ,   readonly:   readonly
                });
            },

            writeMember:    function (memb, max, indent, curLnk) {
                var opt = { obj: memb, indent: indent, curLnk: curLnk,
                            nullable: (memb.nullable ? "?" : ""), arr: arrsq(memb)};
                if (memb.declaration)   opt.declaration = memb.declaration;
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
                sn = new simpleNode(document);
                var $idl = $(".idl", doc).not("pre")
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

window.simpleNode = function (doc) {
    this.doc = doc ? doc : document;
};
window.simpleNode.prototype = {

    // --- NODE CREATION ---
    element:    function (name, attr, parent, content) {
        var $el = $(this.doc.createElement(name));
        $el.attr(attr || {});
        if (parent) $(parent).append($el);
        if (content) {
            if (content instanceof jQuery) $el.append(content);
            else if (content instanceof Array) for (var i = 0; i < content.length; i++) $el.append(content[i]);
            else this.text(content, $el);
        }
        return $el;
    },

    text:    function (txt, parent) {
        var tn = this.doc.createTextNode(txt);
        if (parent) $(parent).append(tn);
        return tn;
    },

    documentFragment:    function () {
        return this.doc.createDocumentFragment();
    },

    // --- ID MANAGEMENT ---
    sanitiseID:    function (id) {
        id = id.split(/[^\-.0-9a-zA-Z_]/).join("-");
        id = id.replace(/^-+/g, "");
        id = id.replace(/-+$/, "");
        if (id.length > 0 && /^[^a-z]/.test(id)) id = "x" + id;
        if (id.length === 0) id = "generatedID";
        return id;
    },

    idThatDoesNotExist:    function (id) {
        var inc = 1;
        if (this.doc.getElementById(id)) {
            while (this.doc.getElementById(id + "-" + inc)) inc++;
            id = id + "-" + inc;
        }
        return id;
    }
};


// Module core/link-to-dfn
// Gives definitions in conf.definitionMap IDs and links <a> tags to the matching definitions.
define(
    'core/link-to-dfn',[],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/link-to-dfn");
                doc.normalize();
                var titles = {};
                Object.keys(conf.definitionMap).forEach(function(title) {
                    titles[title] = {};
                    conf.definitionMap[title].forEach(function(dfn) {
                        if (dfn.attr('data-idl') === undefined) {
                                // Non-IDL definitions aren't "for" an interface.
                            dfn.removeAttr('data-dfn-for');
                        }
                        var dfn_for = dfn.attr('data-dfn-for') || "";
                        if (dfn_for in titles[title]) {
                            // We want <dfn> definitions to take precedence over
                            // definitions from WebIDL. WebIDL definitions wind
                            // up as <span>s instead of <dfn>.
                            var oldIsDfn = titles[title][dfn_for].filter('dfn').length !== 0;
                            var newIsDfn = dfn.filter('dfn').length !== 0;
                            if (oldIsDfn && newIsDfn) {
                                // Only complain if the user provides 2 <dfn>s
                                // for the same term.
                                msg.pub("error", "Duplicate definition of '" + (dfn_for ? dfn_for + "/" : "") + title + "'");
                            }
                            if (oldIsDfn) {
                                // Don't overwrite <dfn> definitions.
                                return;
                            }
                        }
                        titles[title][dfn_for] = dfn;
                        if (dfn.attr('id') === undefined) {
                            if (dfn.attr('data-idl')) {
                                dfn.makeID("dom", (dfn_for ? dfn_for + "-" : "") + title);
                            } else {
                                dfn.makeID("dfn", title);
                            }
                        }
                    });
                });
                $("a:not([href])").each(function () {
                    var $ant = $(this);
                    if ($ant.hasClass("externalDFN")) return;
                    var linkTargets = $ant.linkTargets();
                    var foundDfn = linkTargets.some(function(target) {
                        if (titles[target.title] && titles[target.title][target.for_]) {
                            var dfn = titles[target.title][target.for_];
                            $ant.attr("href", "#" + dfn.prop("id")).addClass("internalDFN");
                            // add a bikeshed style indication of the type of link
                            if (! $ant.attr("data-link-type") ) {
                                $ant.attr("data-link-type", "dfn") ;
                            }
                            // If a definition is <code>, links to it should
                            // also be <code>.
                            //
                            // Note that contents().length===1 excludes
                            // definitions that have either other text, or other
                            // whitespace, inside the <dfn>.
                            if (dfn.closest('code,pre').length ||
                                (dfn.contents().length === 1 && dfn.children('code').length === 1)) {
                                $ant.wrapInner('<code></code>');
                            }
                            return true;
                        }
                        return false;
                    });
                    if (!foundDfn) {
                        // ignore WebIDL
                        if (!$ant.parents(".idl, dl.methods, dl.attributes, dl.constants, dl.constructors, dl.fields, dl.dictionary-members, span.idlMemberType, span.idlTypedefType, div.idlImplementsDesc").length) {
                            var link_for = linkTargets[0].for_;
                            var title = linkTargets[0].title;
                            msg.pub("warn", "Found linkless <a> element " + (link_for ? "for '" + link_for + "' " : "") + "with text '" + title + "' but no matching <dfn>.");
                        }
                        $ant.replaceWith($ant.contents());
                    }
                });
                // done linking, so clean up
                function attrToDataAttr(name){
                    return function(elem){
                        var value = elem.getAttribute(name);
                        elem.removeAttribute(name);
                        elem.setAttribute("data-" + name, value);
                    }
                }

                var forList = doc.querySelectorAll("*[for]");
                Array.prototype.forEach.call(forList, attrToDataAttr("for"));

                var dfnForList = doc.querySelectorAll("*[dfn-for]");
                Array.prototype.forEach.call(dfnForList, attrToDataAttr("dfn-for"));

                var linkForList = doc.querySelectorAll("*[link-for]");
                Array.prototype.forEach.call(linkForList, attrToDataAttr("link-for"));
                msg.pub("end", "core/link-to-dfn");
                cb();
            }
        };
    }
);

// Module core/contrib
// Fetches names of contributors from github and uses them to fill
// in the content of elements with key identifiers:
// #gh-commenters: people having contributed comments to issues.
// #gh-contributors: people whose PR have been merged.
// Spec editors get filtered out automatically.

define(
    'core/contrib',["github"],
    function (github) {
        return {
            run: function (conf, doc, cb, msg) {
                function theEnd () {
                    msg.pub("end", "core/contrib");
                    cb();
                }

                function prop(prop) {
                    return function (o) {
                        return o[prop];
                    };
                }

                function slice(args) {
                    return Array.prototype.slice.call(args, 0)
                }

                function findUsers() {
                    var users = {};
                    slice(arguments).forEach(function (things) {
                        things.forEach(function (thing) {
                            if (thing.user) {
                                users[thing.user.url] = true;
                            }
                        });
                    });
                    return Object.keys(users);
                }

                function join(things) {
                    if (!things.length) {
                        return "";
                    }
                    things = things.slice(0);
                    var last = things.pop();
                    var length = things.length;
                    if (length === 0) {
                        return last;
                    }
                    if (length === 1) {
                        return things[0] + " and " + last;
                    }
                    return things.join(", ") + ", and " + last;
                }

                function toHTML(urls, editors, element) {
                    return $.when.apply($, urls.map(function (url) {
                        return github.fetch(url);
                    })).then(function () {
                        var names = slice(arguments).map(function (user) {
                            user = user[0];
                            return user.name || user.login;
                        }).filter(function (name) {
                            return editors.indexOf(name) < 0;
                        });
                        names.sort(function (a, b) {
                            return a.toLowerCase().localeCompare(b.toLowerCase());
                        });
                        $(element).html(join(names)).attr("id", null);
                    });
                }

                msg.pub("start", "core/contrib");
                var $commenters = doc.querySelector("#gh-commenters");
                var $contributors = doc.querySelector("#gh-contributors");

                if (!$commenters && !$contributors) {
                    theEnd();
                    return;
                }

                if (!conf.githubAPI) {
                    var elements = [];
                    if ($commenters) elements.push("#" + $commenters.id);
                    if ($contributors) elements.push("#" + $contributors.id);
                    msg.pub("error", "Requested list of contributors and/or commenters from GitHub (" + elements.join(" and ") + ") but config.githubAPI is not set.");
                    theEnd();
                    return;
                }

                github.fetch(conf.githubAPI).then(function (json) {
                    return $.when(
                        github.fetchIndex(json.issues_url),
                        github.fetchIndex(json.issue_comment_url),
                        github.fetchIndex(json.contributors_url)
                    );
                }).then(function(issues, comments, contributors) {
                    var editors = respecConfig.editors.map(prop("name"));
                    var commenters = findUsers(issues, comments);
                    contributors = contributors.map(prop("url"));
                    return $.when(
                        toHTML(commenters, editors, $commenters),
                        toHTML(contributors, editors, $contributors)
                    );
                }).then(theEnd, function(error) {
                    msg.pub("error", "Error loading contributors and/or commenters from GitHub. Error: " + error);
                    theEnd();
                });
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
                    if (this.localName.toLowerCase() !== h) $(this).renameElement(h);
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
        var secMap = {}
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
                    ,   noToc = $sec.hasClass("notoc")
                    ;
                    if (!$sec.children().length || noToc) continue;
                    var h = $sec.children()[0]
                    ,   ln = h.localName.toLowerCase();
                    if (ln !== "h2" && ln !== "h3" && ln !== "h4" && ln !== "h5" && ln !== "h6") continue;
                    var title = h.textContent
                    ,   $kidsHolder = $("<div></div>").append($(h).contents().clone())
                    ;
                    $kidsHolder.find("a").renameElement("span").attr("class", "formerLink").removeAttr("href");
                    $kidsHolder.find("dfn").renameElement("span").removeAttr("id");
                    var id = h.id ? h.id : $sec.makeID(null, title);

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
                        $(h).before(document.createComment("OddPage"));
                    }
                    var $span = $("<span class='secno'></span>").text(secno + " ");
                    if (!isIntro) $(h).prepend($span);
                    secMap[id] = (isIntro ? "" : "<span class='secno'>" + secno + "</span> ") +
                                "<span class='sec-title'>" + title + "</span>";

                    var $a = $("<a/>").attr({ href: "#" + id, "class": "tocxref" })
                                      .append(isIntro ? "" : $span.clone())
                                      .append($kidsHolder.contents())
                    ,   $item = $("<li class='tocline'/>").append($a);
                    if (conf.maxTocLevel == 0 || level <= conf.maxTocLevel) $ul.append($item);
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
                    var w = conf.useExperimentalStyles ? "nav" : "section";
                    var $sec = $("<" + w + " id='toc'/>")
                        .append("<h2 class='introductory'>" + conf.l10n.toc + "</h2>")
                        .append($ul)
                    ,   $ref = $("#toc", doc), replace = false;
                    if ($ref.length) replace = true;
                    if (!$ref.length) $ref = $("#sotd", doc);
                    if (!$ref.length) $ref = $("#abstract", doc);
                    replace ? $ref.replaceWith($sec) : $ref.after($sec);

                    if (conf.useExperimentalStyles) {
                        var $link = $("<p role='navigation' id='back-to-top'><a href='#toc'><abbr title='Back to Top'>&uarr;</abbr></p>");
                        $("body").append($link);;
                    }
                }

                // Update all anchors with empty content that reference a section ID
                $("a[href^='#']:not(.tocxref)", doc).each(function () {
                    var $a = $(this);
                    if ($a.html() !== "") return;
                    var id = $a.attr("href").slice(1);
                    if (secMap[id]) {
                        $a.addClass("sec-ref");
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
                $("section.informative").find("> h2:first, > h3:first, > h4:first, > h5:first, > h6:first")
                                        .after("<p><em>This section is non-normative.</em></p>");
                msg.pub("end", "core/informative");
                cb();
            }
        };
    }
);


define('tmpl!w3c/templates/permalinks.css', ['handlebars'], function (hb) { return Handlebars.compile('/* --- PERMALINKS --- */\n{{#if permalinkHide}}\nsection > *:hover > span.permalink { visibility: visible; }\n{{/if}}\n\n.permalink {\n    width: 1px;\n    height: 1px;\n    overflow: visible;\n    font-size: 10pt;\n    font-style: normal;\n    vertical-align: middle;\n    margin-left: 4px;\n    {{#if permalinkEdge}}\n\tfloat: right;\n    {{/if}}\n    {{#if permalinkHide}}\n    visibility: hidden;\n    {{/if}}\n}\n\n.permalink a, .permalink a:link, .permalink a:visited, .permalink a:hover, .permalink a:focus, .permalink a:active\n{\n\tbackground:transparent !important;\n\ttext-decoration:none;\n    font-weight: bold;\n\tcolor:#666 !important;\n}\n\n.permalink abbr {\n\tborder:0;\n}\n');});

// Module w3c/permalinks
// Adds "permalinks" into the document at sections with explicit IDs
// Introduced by Shane McCarron (shane@aptest.com) from the W3C PFWG
//
// Only enabled when the includePermalinks option is set to true.
// Defaults to false.
//
// When includePermalinks is enabled, the following options are
// supported:
//
//     permalinkSymbol:    the character(s) to use for the link.
//                         Defaults to §
//     permalinkEdge:      Boolean. The link will be right-justified.  Otherwise
//                         it will be immediately after the heading text.
//                         Defaults to false.
//     permalinkHide:      Boolean. The symbol will be hidden until the header is
//                         hovered over.  Defaults to false.

define(
    'w3c/permalinks',["tmpl!w3c/templates/permalinks.css", "core/utils"], // load this to be sure that the jQuery extensions are loaded
    function (css, utils) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "w3c/permalinks");
                if (conf.includePermalinks) {
                    var symbol = conf.permalinkSymbol || '§';
                    var style = "<style>" + css(conf) + "</style>";

                    $(doc).find("head link").first().before(style);
                    var $secs = $(doc).find("h2, h3, h4, h5, h6");
                    $secs.each(function(i, item) {
                        var $item = $(item);
                        if (!$item.hasClass("nolink")) {
                            var resourceID = $item.attr('id');

                            var $par = $item.parent();
                            if ($par.is("section") || $par.is("div")) {
                                if (!$par.hasClass("introductory") && !$par.hasClass("nolink")) {
                                    resourceID = $par.attr('id');
                                } else {
                                    resourceID = null;
                                }
                            }

                            // if we still have resourceID
                            if (resourceID != null) {
                                // we have an id.  add a permalink
                                // right after the h* element
                                var theNode = $("<span></span>");
                                theNode.attr('class', 'permalink');
                                if (conf.doRDFa) theNode.attr('typeof', 'bookmark');
                                var ctext = $item.text();
                                var el = $("<a></a>");
                                el.attr({
                                    href:         '#' + resourceID,
                                    'aria-label': 'Permalink for ' + ctext,
                                    title:        'Permalink for ' + ctext });
                                if (conf.doRDFa) el.attr('property', 'url');
                                var sym = $("<span></span>");
                                if (conf.doRDFa) {
                                    sym.attr({
                                        property: 'title',
                                        content:  ctext });
                                }
                                sym.append(symbol);
                                el.append(sym);
                                theNode.append(el);

                                // if this is not being put at
                                // page edge, then separate it
                                // from the heading with a
                                // non-breaking space
                                if (!conf.permalinkEdge) {
                                   $item.append("&nbsp;");
                                }
                                $item.append(theNode);
                            }
                        }
                    });
                };
                msg.pub("end", "w3c/permalinks");
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


// Module core/rdfa
// Support for RDFa is spread to multiple places in the code, including templates, as needed by
// the HTML being generated in various places. This is for parts that don't fit anywhere in
// particular

define(
    'core/rdfa',[],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/rdfa");
                if (conf.doRDFa) {
                    $("section").each(function () {
                        var $sec = $(this)
                        ,   resource = ""
                        ,   $fc = $sec.children("h1,h2,h3,h4,h5,h6").first()
                        ,   ref = $sec.attr("id")
                        ,   fcref = null
                        ;
                        if (ref) {
                            resource = "#" + ref;
                        }
                        else if ($fc.length) {
                            ref = $fc.attr("id");
                            if (ref) {
                                resource = "#" + ref;
                                fcref = ref;
                            }
                        }
                        var property = "bibo:hasPart";
                        // Headings on everything but boilerplate
                        if (!resource.match(/#(abstract|sotd|toc)$/)) {
                            $sec.attr({
                                "typeof":   "bibo:Chapter"
                            ,   resource:   resource
                            ,   property:   property
                            });
                        }
                        // create a heading triple too, as per the role spec
                        // since we should not be putting an @role on
                        // h* elements with a value of heading, but we
                        // still want the semantic markup
                        if ($fc.length) {
                            if (!fcref) {
                                // if there is no ID on the heading itself.  Add one
                                fcref = $fc.makeID("h", ref) ;
                            }
                            // set the subject to the ID of the heading
                            $fc.attr({ resource: "#" + fcref }) ;
                            // nest the contents in a span so we can set the predicate
                            // and object
                            $fc.wrapInner( "<span property='xhv:role' resource='xhv:heading'></span>" );
                        }
                    });
                }
                msg.pub("end", "core/rdfa");
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
                // ensure head section is labelled
                $('body', doc).attr('role', 'document') ;
                $('body', doc).attr('id', 'respecDocument') ;
                $('div.head', doc).attr('role', 'contentinfo') ;
                $('div.head', doc).attr('id', 'respecHeader') ;
                if (!conf.noTOC) {
                    // ensure toc is labelled
                    var toc = conf.useExperimentalStyles ? $('nav#toc', doc).find("ul:first") : $('section#toc', doc).find("ul:first");
                    toc.attr('role', 'directory') ;
                }
                // mark issues and notes with heading
                var noteCount = 0 ; var issueCount = 0 ; var ednoteCount = 0;
                $(".note-title, .ednote-title, .issue-title", doc).each(function (i, item) {
                    var $item = $(item)
                    ,   isIssue = $item.hasClass("issue-title")
                    ,   isEdNote = $item.hasClass("ednote-title")
                    ,   level = $item.parents("section").length+2 ;

                    $item.attr('aria-level', level) ;
                    $item.attr('role', 'heading') ;
                    if (isIssue) {
                        issueCount++;
                        $item.makeID('h', "issue" + issueCount) ;
                    } else if (isEdNote) {
                        ednoteCount++;
                        $item.makeID('h', "ednote" + ednoteCount) ;
                    } else {
                        noteCount++;
                        $item.makeID('h', "note" + noteCount) ;
                    }
                });
                msg.pub("end", "w3c/aria");
                cb();
            }
        };
    }
);


// Module core/shiv
// Injects the HTML5 shiv conditional comment

define(
    'core/shiv',[],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/shiv");
                var cmt = doc.createComment("[if lt IE 9]><script src='https://www.w3.org/2008/site/js/html5shiv.js'></script><![endif]");
                $("head").append(cmt);
                msg.pub("end", "core/shiv");
                cb();
            }
        };
    }
);


// Module core/remove-respec
// Removes all ReSpec artefacts right before processing ends

define(
    'core/remove-respec',["core/utils"],
    function (utils) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/remove-respec");
                // it is likely that some asynch operations won't have completed at that moment
                // if they happen to need the artefacts, we could change this to be hooked into
                // the base-runner to run right before end-all
                utils.removeReSpec(doc);
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

/*global respecVersion */

// this is only set in a build, not at all in the dev environment
var requireConfig = {
    shim:   {
        shortcut: {
            exports:    "shortcut"
        }
    }
};
if ("respecVersion" in window && respecVersion) {
    requireConfig.paths = {
        ui:   "https://w3c.github.io/respec/js/ui"
    };
}
require.config(requireConfig);

define('profile-w3c-common',[
            "domReady"
        ,   "core/base-runner"
        ,   "core/ui"
        ,   "core/include-config"
        ,   "core/override-configuration"
        ,   "core/default-root-attr"
        ,   "w3c/l10n"
        ,   "core/markdown"
        ,   "core/style"
        ,   "w3c/style"
        ,   "w3c/headers"
        ,   "w3c/abstract"
        ,   "w3c/conformance"
        ,   "core/data-transform"
        ,   "core/data-include"
        ,   "core/inlines"
        ,   "core/dfn"
        ,   "w3c/rfc2119"
        ,   "core/examples"
        ,   "core/issues-notes"
        ,   "core/requirements"
        ,   "core/highlight"
        ,   "core/best-practices"
        ,   "core/figures"
        ,   "core/biblio"
        ,   "core/webidl-contiguous"
        ,   "core/webidl-oldschool"
        ,   "core/link-to-dfn"
        ,   "core/contrib"
        ,   "core/fix-headers"
        ,   "core/structure"
        ,   "w3c/informative"
        ,   "w3c/permalinks"
        ,   "core/id-headers"
        ,   "core/rdfa"
        ,   "w3c/aria"
        ,   "core/shiv"
        ,   "core/remove-respec"
        ,   "core/location-hash"
        ],
        function (domReady, runner, ui) {
            var args = Array.prototype.slice.call(arguments);
            domReady(function () {
                ui.addCommand("Save Snapshot", "ui/save-html", "Ctrl+Shift+Alt+S");
                ui.addCommand("About ReSpec", "ui/about-respec", "Ctrl+Shift+Alt+A");
                ui.addCommand("Definition List", "ui/dfn-list", "Ctrl+Shift+Alt+D");
                ui.addCommand("Search Specref DB", "ui/search-specref", "Ctrl+Shift+Alt+space");
                runner.runAll(args);
            });
        }
);


require(['profile-w3c-common']);