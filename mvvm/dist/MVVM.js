/******/ (function(modules) { // webpackBootstrap
    /******/ 	function hotDisposeChunk(chunkId) {
        /******/ 		delete installedChunks[chunkId];
        /******/ 	}
    /******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
    /******/ 	this["webpackHotUpdate"] =
        /******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
        /******/ 		hotAddUpdateChunk(chunkId, moreModules);
        /******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
        /******/ 	} ;
    /******/
    /******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
        /******/ 		var head = document.getElementsByTagName("head")[0];
        /******/ 		var script = document.createElement("script");
        /******/ 		script.type = "text/javascript";
        /******/ 		script.charset = "utf-8";
        /******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
        /******/ 		head.appendChild(script);
        /******/ 	}
    /******/
    /******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
        /******/ 		return new Promise(function(resolve, reject) {
            /******/ 			if(typeof XMLHttpRequest === "undefined")
            /******/ 				return reject(new Error("No browser support"));
            /******/ 			try {
                /******/ 				var request = new XMLHttpRequest();
                /******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
                /******/ 				request.open("GET", requestPath, true);
                /******/ 				request.timeout = 10000;
                /******/ 				request.send(null);
                /******/ 			} catch(err) {
                /******/ 				return reject(err);
                /******/ 			}
            /******/ 			request.onreadystatechange = function() {
                /******/ 				if(request.readyState !== 4) return;
                /******/ 				if(request.status === 0) {
                    /******/ 					// timeout
                    /******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
                    /******/ 				} else if(request.status === 404) {
                    /******/ 					// no update available
                    /******/ 					resolve();
                    /******/ 				} else if(request.status !== 200 && request.status !== 304) {
                    /******/ 					// other failure
                    /******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
                    /******/ 				} else {
                    /******/ 					// success
                    /******/ 					try {
                        /******/ 						var update = JSON.parse(request.responseText);
                        /******/ 					} catch(e) {
                        /******/ 						reject(e);
                        /******/ 						return;
                        /******/ 					}
                    /******/ 					resolve(update);
                    /******/ 				}
                /******/ 			};
            /******/ 		});
        /******/ 	}
    /******/
    /******/
    /******/
    /******/ 	var hotApplyOnUpdate = true;
    /******/ 	var hotCurrentHash = "354022ea33308d36d51e"; // eslint-disable-line no-unused-vars
    /******/ 	var hotCurrentModuleData = {};
    /******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
    /******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
    /******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
    /******/
    /******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
        /******/ 		var me = installedModules[moduleId];
        /******/ 		if(!me) return __webpack_require__;
        /******/ 		var fn = function(request) {
            /******/ 			if(me.hot.active) {
                /******/ 				if(installedModules[request]) {
                    /******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
                    /******/ 						installedModules[request].parents.push(moduleId);
                    /******/ 				} else {
                    /******/ 					hotCurrentParents = [moduleId];
                    /******/ 					hotCurrentChildModule = request;
                    /******/ 				}
                /******/ 				if(me.children.indexOf(request) < 0)
                /******/ 					me.children.push(request);
                /******/ 			} else {
                /******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
                /******/ 				hotCurrentParents = [];
                /******/ 			}
            /******/ 			return __webpack_require__(request);
            /******/ 		};
        /******/ 		var ObjectFactory = function ObjectFactory(name) {
            /******/ 			return {
                /******/ 				configurable: true,
                /******/ 				enumerable: true,
                /******/ 				get: function() {
                    /******/ 					return __webpack_require__[name];
                    /******/ 				},
                /******/ 				set: function(value) {
                    /******/ 					__webpack_require__[name] = value;
                    /******/ 				}
                /******/ 			};
            /******/ 		};
        /******/ 		for(var name in __webpack_require__) {
            /******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
                /******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
                /******/ 			}
            /******/ 		}
        /******/ 		fn.e = function(chunkId) {
            /******/ 			if(hotStatus === "ready")
            /******/ 				hotSetStatus("prepare");
            /******/ 			hotChunksLoading++;
            /******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
                /******/ 				finishChunkLoading();
                /******/ 				throw err;
                /******/ 			});
            /******/
            /******/ 			function finishChunkLoading() {
                /******/ 				hotChunksLoading--;
                /******/ 				if(hotStatus === "prepare") {
                    /******/ 					if(!hotWaitingFilesMap[chunkId]) {
                        /******/ 						hotEnsureUpdateChunk(chunkId);
                        /******/ 					}
                    /******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
                        /******/ 						hotUpdateDownloaded();
                        /******/ 					}
                    /******/ 				}
                /******/ 			}
            /******/ 		};
        /******/ 		return fn;
        /******/ 	}
    /******/
    /******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
        /******/ 		var hot = {
            /******/ 			// private stuff
            /******/ 			_acceptedDependencies: {},
            /******/ 			_declinedDependencies: {},
            /******/ 			_selfAccepted: false,
            /******/ 			_selfDeclined: false,
            /******/ 			_disposeHandlers: [],
            /******/ 			_main: hotCurrentChildModule !== moduleId,
            /******/
            /******/ 			// Module API
            /******/ 			active: true,
            /******/ 			accept: function(dep, callback) {
                /******/ 				if(typeof dep === "undefined")
                /******/ 					hot._selfAccepted = true;
                /******/ 				else if(typeof dep === "function")
                /******/ 					hot._selfAccepted = dep;
                /******/ 				else if(typeof dep === "object")
                /******/ 					for(var i = 0; i < dep.length; i++)
                      /******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
                /******/ 				else
                /******/ 					hot._acceptedDependencies[dep] = callback || function() {};
                /******/ 			},
            /******/ 			decline: function(dep) {
                /******/ 				if(typeof dep === "undefined")
                /******/ 					hot._selfDeclined = true;
                /******/ 				else if(typeof dep === "object")
                /******/ 					for(var i = 0; i < dep.length; i++)
                      /******/ 						hot._declinedDependencies[dep[i]] = true;
                /******/ 				else
                /******/ 					hot._declinedDependencies[dep] = true;
                /******/ 			},
            /******/ 			dispose: function(callback) {
                /******/ 				hot._disposeHandlers.push(callback);
                /******/ 			},
            /******/ 			addDisposeHandler: function(callback) {
                /******/ 				hot._disposeHandlers.push(callback);
                /******/ 			},
            /******/ 			removeDisposeHandler: function(callback) {
                /******/ 				var idx = hot._disposeHandlers.indexOf(callback);
                /******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
                /******/ 			},
            /******/
            /******/ 			// Management API
            /******/ 			check: hotCheck,
            /******/ 			apply: hotApply,
            /******/ 			status: function(l) {
                /******/ 				if(!l) return hotStatus;
                /******/ 				hotStatusHandlers.push(l);
                /******/ 			},
            /******/ 			addStatusHandler: function(l) {
                /******/ 				hotStatusHandlers.push(l);
                /******/ 			},
            /******/ 			removeStatusHandler: function(l) {
                /******/ 				var idx = hotStatusHandlers.indexOf(l);
                /******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
                /******/ 			},
            /******/
            /******/ 			//inherit from previous dispose call
            /******/ 			data: hotCurrentModuleData[moduleId]
            /******/ 		};
        /******/ 		hotCurrentChildModule = undefined;
        /******/ 		return hot;
        /******/ 	}
    /******/
    /******/ 	var hotStatusHandlers = [];
    /******/ 	var hotStatus = "idle";
    /******/
    /******/ 	function hotSetStatus(newStatus) {
        /******/ 		hotStatus = newStatus;
        /******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
          /******/ 			hotStatusHandlers[i].call(null, newStatus);
        /******/ 	}
    /******/
    /******/ 	// while downloading
    /******/ 	var hotWaitingFiles = 0;
    /******/ 	var hotChunksLoading = 0;
    /******/ 	var hotWaitingFilesMap = {};
    /******/ 	var hotRequestedFilesMap = {};
    /******/ 	var hotAvailableFilesMap = {};
    /******/ 	var hotDeferred;
    /******/
    /******/ 	// The update info
    /******/ 	var hotUpdate, hotUpdateNewHash;
    /******/
    /******/ 	function toModuleId(id) {
        /******/ 		var isNumber = (+id) + "" === id;
        /******/ 		return isNumber ? +id : id;
        /******/ 	}
    /******/
    /******/ 	function hotCheck(apply) {
        /******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
        /******/ 		hotApplyOnUpdate = apply;
        /******/ 		hotSetStatus("check");
        /******/ 		return hotDownloadManifest().then(function(update) {
            /******/ 			if(!update) {
                /******/ 				hotSetStatus("idle");
                /******/ 				return null;
                /******/ 			}
            /******/ 			hotRequestedFilesMap = {};
            /******/ 			hotWaitingFilesMap = {};
            /******/ 			hotAvailableFilesMap = update.c;
            /******/ 			hotUpdateNewHash = update.h;
            /******/
            /******/ 			hotSetStatus("prepare");
            /******/ 			var promise = new Promise(function(resolve, reject) {
                /******/ 				hotDeferred = {
                    /******/ 					resolve: resolve,
                    /******/ 					reject: reject
                    /******/ 				};
                /******/ 			});
            /******/ 			hotUpdate = {};
            /******/ 			var chunkId = 0;
            /******/ 			{ // eslint-disable-line no-lone-blocks
                /******/ 				/*globals chunkId */
                /******/ 				hotEnsureUpdateChunk(chunkId);
                /******/ 			}
            /******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
                /******/ 				hotUpdateDownloaded();
                /******/ 			}
            /******/ 			return promise;
            /******/ 		});
        /******/ 	}
    /******/
    /******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
        /******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
        /******/ 			return;
        /******/ 		hotRequestedFilesMap[chunkId] = false;
        /******/ 		for(var moduleId in moreModules) {
            /******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
                /******/ 				hotUpdate[moduleId] = moreModules[moduleId];
                /******/ 			}
            /******/ 		}
        /******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
            /******/ 			hotUpdateDownloaded();
            /******/ 		}
        /******/ 	}
    /******/
    /******/ 	function hotEnsureUpdateChunk(chunkId) {
        /******/ 		if(!hotAvailableFilesMap[chunkId]) {
            /******/ 			hotWaitingFilesMap[chunkId] = true;
            /******/ 		} else {
            /******/ 			hotRequestedFilesMap[chunkId] = true;
            /******/ 			hotWaitingFiles++;
            /******/ 			hotDownloadUpdateChunk(chunkId);
            /******/ 		}
        /******/ 	}
    /******/
    /******/ 	function hotUpdateDownloaded() {
        /******/ 		hotSetStatus("ready");
        /******/ 		var deferred = hotDeferred;
        /******/ 		hotDeferred = null;
        /******/ 		if(!deferred) return;
        /******/ 		if(hotApplyOnUpdate) {
            /******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
                /******/ 				deferred.resolve(result);
                /******/ 			}, function(err) {
                /******/ 				deferred.reject(err);
                /******/ 			});
            /******/ 		} else {
            /******/ 			var outdatedModules = [];
            /******/ 			for(var id in hotUpdate) {
                /******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
                    /******/ 					outdatedModules.push(toModuleId(id));
                    /******/ 				}
                /******/ 			}
            /******/ 			deferred.resolve(outdatedModules);
            /******/ 		}
        /******/ 	}
    /******/
    /******/ 	function hotApply(options) {
        /******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
        /******/ 		options = options || {};
        /******/
        /******/ 		var cb;
        /******/ 		var i;
        /******/ 		var j;
        /******/ 		var module;
        /******/ 		var moduleId;
        /******/
        /******/ 		function getAffectedStuff(updateModuleId) {
            /******/ 			var outdatedModules = [updateModuleId];
            /******/ 			var outdatedDependencies = {};
            /******/
            /******/ 			var queue = outdatedModules.slice().map(function(id) {
                /******/ 				return {
                    /******/ 					chain: [id],
                    /******/ 					id: id
                    /******/ 				};
                /******/ 			});
            /******/ 			while(queue.length > 0) {
                /******/ 				var queueItem = queue.pop();
                /******/ 				var moduleId = queueItem.id;
                /******/ 				var chain = queueItem.chain;
                /******/ 				module = installedModules[moduleId];
                /******/ 				if(!module || module.hot._selfAccepted)
                /******/ 					continue;
                /******/ 				if(module.hot._selfDeclined) {
                    /******/ 					return {
                        /******/ 						type: "self-declined",
                        /******/ 						chain: chain,
                        /******/ 						moduleId: moduleId
                        /******/ 					};
                    /******/ 				}
                /******/ 				if(module.hot._main) {
                    /******/ 					return {
                        /******/ 						type: "unaccepted",
                        /******/ 						chain: chain,
                        /******/ 						moduleId: moduleId
                        /******/ 					};
                    /******/ 				}
                /******/ 				for(var i = 0; i < module.parents.length; i++) {
                    /******/ 					var parentId = module.parents[i];
                    /******/ 					var parent = installedModules[parentId];
                    /******/ 					if(!parent) continue;
                    /******/ 					if(parent.hot._declinedDependencies[moduleId]) {
                        /******/ 						return {
                            /******/ 							type: "declined",
                            /******/ 							chain: chain.concat([parentId]),
                            /******/ 							moduleId: moduleId,
                            /******/ 							parentId: parentId
                            /******/ 						};
                        /******/ 					}
                    /******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
                    /******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
                        /******/ 						if(!outdatedDependencies[parentId])
                        /******/ 							outdatedDependencies[parentId] = [];
                        /******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
                        /******/ 						continue;
                        /******/ 					}
                    /******/ 					delete outdatedDependencies[parentId];
                    /******/ 					outdatedModules.push(parentId);
                    /******/ 					queue.push({
                        /******/ 						chain: chain.concat([parentId]),
                        /******/ 						id: parentId
                        /******/ 					});
                    /******/ 				}
                /******/ 			}
            /******/
            /******/ 			return {
                /******/ 				type: "accepted",
                /******/ 				moduleId: updateModuleId,
                /******/ 				outdatedModules: outdatedModules,
                /******/ 				outdatedDependencies: outdatedDependencies
                /******/ 			};
            /******/ 		}
        /******/
        /******/ 		function addAllToSet(a, b) {
            /******/ 			for(var i = 0; i < b.length; i++) {
                /******/ 				var item = b[i];
                /******/ 				if(a.indexOf(item) < 0)
                /******/ 					a.push(item);
                /******/ 			}
            /******/ 		}
        /******/
        /******/ 		// at begin all updates modules are outdated
        /******/ 		// the "outdated" status can propagate to parents if they don't accept the children
        /******/ 		var outdatedDependencies = {};
        /******/ 		var outdatedModules = [];
        /******/ 		var appliedUpdate = {};
        /******/
        /******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
            /******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
            /******/ 		};
        /******/
        /******/ 		for(var id in hotUpdate) {
            /******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
                /******/ 				moduleId = toModuleId(id);
                /******/ 				var result;
                /******/ 				if(hotUpdate[id]) {
                    /******/ 					result = getAffectedStuff(moduleId);
                    /******/ 				} else {
                    /******/ 					result = {
                        /******/ 						type: "disposed",
                        /******/ 						moduleId: id
                        /******/ 					};
                    /******/ 				}
                /******/ 				var abortError = false;
                /******/ 				var doApply = false;
                /******/ 				var doDispose = false;
                /******/ 				var chainInfo = "";
                /******/ 				if(result.chain) {
                    /******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
                    /******/ 				}
                /******/ 				switch(result.type) {
                    /******/ 					case "self-declined":
                        /******/ 						if(options.onDeclined)
                        /******/ 							options.onDeclined(result);
                        /******/ 						if(!options.ignoreDeclined)
                        /******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
                        /******/ 						break;
                    /******/ 					case "declined":
                        /******/ 						if(options.onDeclined)
                        /******/ 							options.onDeclined(result);
                        /******/ 						if(!options.ignoreDeclined)
                        /******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
                        /******/ 						break;
                    /******/ 					case "unaccepted":
                        /******/ 						if(options.onUnaccepted)
                        /******/ 							options.onUnaccepted(result);
                        /******/ 						if(!options.ignoreUnaccepted)
                        /******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
                        /******/ 						break;
                    /******/ 					case "accepted":
                        /******/ 						if(options.onAccepted)
                        /******/ 							options.onAccepted(result);
                        /******/ 						doApply = true;
                        /******/ 						break;
                    /******/ 					case "disposed":
                        /******/ 						if(options.onDisposed)
                        /******/ 							options.onDisposed(result);
                        /******/ 						doDispose = true;
                        /******/ 						break;
                    /******/ 					default:
                        /******/ 						throw new Error("Unexception type " + result.type);
                    /******/ 				}
                /******/ 				if(abortError) {
                    /******/ 					hotSetStatus("abort");
                    /******/ 					return Promise.reject(abortError);
                    /******/ 				}
                /******/ 				if(doApply) {
                    /******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
                    /******/ 					addAllToSet(outdatedModules, result.outdatedModules);
                    /******/ 					for(moduleId in result.outdatedDependencies) {
                        /******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
                            /******/ 							if(!outdatedDependencies[moduleId])
                            /******/ 								outdatedDependencies[moduleId] = [];
                            /******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
                            /******/ 						}
                        /******/ 					}
                    /******/ 				}
                /******/ 				if(doDispose) {
                    /******/ 					addAllToSet(outdatedModules, [result.moduleId]);
                    /******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
                    /******/ 				}
                /******/ 			}
            /******/ 		}
        /******/
        /******/ 		// Store self accepted outdated modules to require them later by the module system
        /******/ 		var outdatedSelfAcceptedModules = [];
        /******/ 		for(i = 0; i < outdatedModules.length; i++) {
            /******/ 			moduleId = outdatedModules[i];
            /******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
            /******/ 				outdatedSelfAcceptedModules.push({
                    /******/ 					module: moduleId,
                    /******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
                    /******/ 				});
            /******/ 		}
        /******/
        /******/ 		// Now in "dispose" phase
        /******/ 		hotSetStatus("dispose");
        /******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
            /******/ 			if(hotAvailableFilesMap[chunkId] === false) {
                /******/ 				hotDisposeChunk(chunkId);
                /******/ 			}
            /******/ 		});
        /******/
        /******/ 		var idx;
        /******/ 		var queue = outdatedModules.slice();
        /******/ 		while(queue.length > 0) {
            /******/ 			moduleId = queue.pop();
            /******/ 			module = installedModules[moduleId];
            /******/ 			if(!module) continue;
            /******/
            /******/ 			var data = {};
            /******/
            /******/ 			// Call dispose handlers
            /******/ 			var disposeHandlers = module.hot._disposeHandlers;
            /******/ 			for(j = 0; j < disposeHandlers.length; j++) {
                /******/ 				cb = disposeHandlers[j];
                /******/ 				cb(data);
                /******/ 			}
            /******/ 			hotCurrentModuleData[moduleId] = data;
            /******/
            /******/ 			// disable module (this disables requires from this module)
            /******/ 			module.hot.active = false;
            /******/
            /******/ 			// remove module from cache
            /******/ 			delete installedModules[moduleId];
            /******/
            /******/ 			// remove "parents" references from all children
            /******/ 			for(j = 0; j < module.children.length; j++) {
                /******/ 				var child = installedModules[module.children[j]];
                /******/ 				if(!child) continue;
                /******/ 				idx = child.parents.indexOf(moduleId);
                /******/ 				if(idx >= 0) {
                    /******/ 					child.parents.splice(idx, 1);
                    /******/ 				}
                /******/ 			}
            /******/ 		}
        /******/
        /******/ 		// remove outdated dependency from module children
        /******/ 		var dependency;
        /******/ 		var moduleOutdatedDependencies;
        /******/ 		for(moduleId in outdatedDependencies) {
            /******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
                /******/ 				module = installedModules[moduleId];
                /******/ 				if(module) {
                    /******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
                    /******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
                        /******/ 						dependency = moduleOutdatedDependencies[j];
                        /******/ 						idx = module.children.indexOf(dependency);
                        /******/ 						if(idx >= 0) module.children.splice(idx, 1);
                        /******/ 					}
                    /******/ 				}
                /******/ 			}
            /******/ 		}
        /******/
        /******/ 		// Not in "apply" phase
        /******/ 		hotSetStatus("apply");
        /******/
        /******/ 		hotCurrentHash = hotUpdateNewHash;
        /******/
        /******/ 		// insert new code
        /******/ 		for(moduleId in appliedUpdate) {
            /******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
                /******/ 				modules[moduleId] = appliedUpdate[moduleId];
                /******/ 			}
            /******/ 		}
        /******/
        /******/ 		// call accept handlers
        /******/ 		var error = null;
        /******/ 		for(moduleId in outdatedDependencies) {
            /******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
                /******/ 				module = installedModules[moduleId];
                /******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
                /******/ 				var callbacks = [];
                /******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
                    /******/ 					dependency = moduleOutdatedDependencies[i];
                    /******/ 					cb = module.hot._acceptedDependencies[dependency];
                    /******/ 					if(callbacks.indexOf(cb) >= 0) continue;
                    /******/ 					callbacks.push(cb);
                    /******/ 				}
                /******/ 				for(i = 0; i < callbacks.length; i++) {
                    /******/ 					cb = callbacks[i];
                    /******/ 					try {
                        /******/ 						cb(moduleOutdatedDependencies);
                        /******/ 					} catch(err) {
                        /******/ 						if(options.onErrored) {
                            /******/ 							options.onErrored({
                                /******/ 								type: "accept-errored",
                                /******/ 								moduleId: moduleId,
                                /******/ 								dependencyId: moduleOutdatedDependencies[i],
                                /******/ 								error: err
                                /******/ 							});
                            /******/ 						}
                        /******/ 						if(!options.ignoreErrored) {
                            /******/ 							if(!error)
                            /******/ 								error = err;
                            /******/ 						}
                        /******/ 					}
                    /******/ 				}
                /******/ 			}
            /******/ 		}
        /******/
        /******/ 		// Load self accepted modules
        /******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
            /******/ 			var item = outdatedSelfAcceptedModules[i];
            /******/ 			moduleId = item.module;
            /******/ 			hotCurrentParents = [moduleId];
            /******/ 			try {
                /******/ 				__webpack_require__(moduleId);
                /******/ 			} catch(err) {
                /******/ 				if(typeof item.errorHandler === "function") {
                    /******/ 					try {
                        /******/ 						item.errorHandler(err);
                        /******/ 					} catch(err2) {
                        /******/ 						if(options.onErrored) {
                            /******/ 							options.onErrored({
                                /******/ 								type: "self-accept-error-handler-errored",
                                /******/ 								moduleId: moduleId,
                                /******/ 								error: err2,
                                /******/ 								orginalError: err
                                /******/ 							});
                            /******/ 						}
                        /******/ 						if(!options.ignoreErrored) {
                            /******/ 							if(!error)
                            /******/ 								error = err2;
                            /******/ 						}
                        /******/ 						if(!error)
                        /******/ 							error = err;
                        /******/ 					}
                    /******/ 				} else {
                    /******/ 					if(options.onErrored) {
                        /******/ 						options.onErrored({
                            /******/ 							type: "self-accept-errored",
                            /******/ 							moduleId: moduleId,
                            /******/ 							error: err
                            /******/ 						});
                        /******/ 					}
                    /******/ 					if(!options.ignoreErrored) {
                        /******/ 						if(!error)
                        /******/ 							error = err;
                        /******/ 					}
                    /******/ 				}
                /******/ 			}
            /******/ 		}
        /******/
        /******/ 		// handle errors in accept handlers and self accepted module load
        /******/ 		if(error) {
            /******/ 			hotSetStatus("fail");
            /******/ 			return Promise.reject(error);
            /******/ 		}
        /******/
        /******/ 		hotSetStatus("idle");
        /******/ 		return Promise.resolve(outdatedModules);
        /******/ 	}
    /******/
    /******/ 	// The module cache
    /******/ 	var installedModules = {};
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
            /******/ 			exports: {},
            /******/ 			hot: hotCreateModule(moduleId),
            /******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
            /******/ 			children: []
            /******/ 		};
        /******/
        /******/ 		// Execute the module function
        /******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
        /******/
        /******/ 		// Flag the module as loaded
        /******/ 		module.l = true;
        /******/
        /******/ 		// Return the exports of the module
        /******/ 		return module.exports;
        /******/ 	}
    /******/
    /******/
    /******/ 	// expose the modules object (__webpack_modules__)
    /******/ 	__webpack_require__.m = modules;
    /******/
    /******/ 	// expose the module cache
    /******/ 	__webpack_require__.c = installedModules;
    /******/
    /******/ 	// identity function for calling harmony imports with the correct context
    /******/ 	__webpack_require__.i = function(value) { return value; };
    /******/
    /******/ 	// define getter function for harmony exports
    /******/ 	__webpack_require__.d = function(exports, name, getter) {
        /******/ 		if(!__webpack_require__.o(exports, name)) {
            /******/ 			Object.defineProperty(exports, name, {
                /******/ 				configurable: false,
                /******/ 				enumerable: true,
                /******/ 				get: getter
                /******/ 			});
            /******/ 		}
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
    /******/ 	// __webpack_hash__
    /******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
    /******/
    /******/ 	// Load entry module and return exports
    /******/ 	return hotCreateRequire(27)(__webpack_require__.s = 27);
    /******/ })
/************************************************************************/
/******/ ([
    /* 0 */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /* harmony export (immutable) */ __webpack_exports__["h"] = createElement;
        /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "q", function() { return isAttr; });
        /* unused harmony export isBooleanAttr */
        /* unused harmony export isNonPhrasingTag */
        /* unused harmony export makeMap */
        /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return isHTMLTag; });
        /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p", function() { return isSVG; });
        /* harmony export (immutable) */ __webpack_exports__["a"] = toString;
        /* unused harmony export camelize */
        /* unused harmony export capitalize */
        /* harmony export (immutable) */ __webpack_exports__["g"] = resolveAsset;
        /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return idToTemplate; });
        /* harmony export (immutable) */ __webpack_exports__["b"] = query;
        /* harmony export (immutable) */ __webpack_exports__["j"] = isFunction;
        /* harmony export (immutable) */ __webpack_exports__["s"] = cached;
        /* unused harmony export no */
        /* harmony export (immutable) */ __webpack_exports__["t"] = isPlainObject;
        /* unused harmony export isNative */
        /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return _Set; });
        /* harmony export (immutable) */ __webpack_exports__["l"] = parsePath;
        /* harmony export (immutable) */ __webpack_exports__["d"] = remove;
        /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return nextTick; });
        /* harmony export (immutable) */ __webpack_exports__["e"] = warn;
        /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "v", function() { return hasProto; });
        /* unused harmony export domTostr */
        /* unused harmony export strTodom */
        /* unused harmony export isDom */
        /* harmony export (immutable) */ __webpack_exports__["f"] = bind;
        /* harmony export (immutable) */ __webpack_exports__["m"] = isObject;
        /* harmony export (immutable) */ __webpack_exports__["i"] = hasOwn;
        /* harmony export (immutable) */ __webpack_exports__["r"] = noop;
        /* harmony export (immutable) */ __webpack_exports__["u"] = def;
        var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

        var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//环境
//hasProto
//定义
//noop
//no
//def
//转换
//domTostr
//strTodom
//idToTemplate
//camelize
//capitalize
//判断
//isDom
//isObject
//isNative
//isPlainObject
//isNonPhrasingTag
//isFunction
//isHTMLTag
//isSVG
//isAttr
//isBooleanAttr
//hasOwn
//resolveAsset
//工具
//bind
//warn
//nextTick
//createElement
//_set
//cached
//操作对象
//remove
//parsePath


        function createElement(tagName) {
            return document.createElement(tagName);
        }

//判断是不是可移除属性
        var isAttr = makeMap('accept,accept-charset,accesskey,action,align,alt,async,autocomplete,' + 'autofocus,autoplay,autosave,bgcolor,border,buffered,challenge,charset,' + 'checked,cite,class,code,codebase,color,cols,colspan,content,http-equiv,' + 'name,contenteditable,contextmenu,controls,coords,data,datetime,default,' + 'defer,dir,dirname,disabled,download,draggable,dropzone,enctype,method,for,' + 'form,formaction,headers,height,hidden,high,href,hreflang,http-equiv,' + 'icon,id,ismap,itemprop,keytype,kind,label,lang,language,list,loop,low,' + 'manifest,max,maxlength,media,method,GET,POST,min,multiple,email,file,' + 'muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,' + 'preload,radiogroup,readonly,rel,required,reversed,rows,rowspan,sandbox,' + 'scope,scoped,seamless,selected,shape,size,type,text,password,sizes,span,' + 'spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,' + 'target,title,type,usemap,value,width,wrap');

        var isBooleanAttr = makeMap('allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' + 'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' + 'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' + 'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' + 'required,reversed,scoped,seamless,selected,sortable,translate,' + 'truespeed,typemustmatch,visible');

//标签
        var isNonPhrasingTag = makeMap('address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' + 'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' + 'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' + 'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' + 'title,tr,track');
//创建一个映射并返回一个函数，以检查键是否在该映射中。
        function makeMap(str, expectsLowerCase) {
            var map = Object.create(null);
            var list = str.split(',');
            for (var i = 0; i < list.length; i++) {
                map[list[i]] = true;
            }
            return expectsLowerCase ? function (val) {
                return map[val.toLowerCase()];
            } : function (val) {
                return map[val];
            };
        }
        var isHTMLTag = makeMap('html,body,base,head,link,meta,style,title,' + 'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' + 'div,dd,dl,dt,figcaption,figure,hr,img,li,main,ol,p,pre,ul,' + 'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' + 's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' + 'embed,object,param,source,canvas,script,noscript,del,ins,' + 'caption,col,colgroup,table,thead,tbody,td,th,tr,' + 'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' + 'output,progress,select,textarea,' + 'details,dialog,menu,menuitem,summary,' + 'content,element,shadow,template');

        var isSVG = makeMap('svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' + 'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' + 'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view', true);

        function toString(val) {
            return val == null ? '' : (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' ? JSON.stringify(val, null, 2) : String(val);
        }
        var camelizeRE = /-(\w)/g;
        var camelize = cached(function (str) {
            return str.replace(camelizeRE, function (_, c) {
                return c ? c.toUpperCase() : '';
            });
        });

        var capitalize = cached(function (str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        });

//匹配组件名称的各种规则
        function resolveAsset(options, type, id) {
            /* istanbul ignore if */
            if (typeof id !== 'string') {
                return;
            }
            var assets = options[type];
            if (!assets) {
                return;
            }
            if (hasOwn(assets, id)) {
                return assets[id];
            }
            var camelizedId = camelize(id);
            if (hasOwn(assets, camelizedId)) {
                return assets[camelizedId];
            }
            var PascalCaseId = capitalize(camelizedId);
            if (hasOwn(assets, PascalCaseId)) {
                return assets[PascalCaseId];
            }
        }

        var idToTemplate = cached(function (id) {
            var el = query(id);

            return el && el.innerHTML;
        });

        function query(el) {
            if (typeof el === 'string') {
                var selector = el;
                el = document.querySelector(el);
                if (!el) {
                    return document.createElement('div');
                }
            }
            return el;
        }

        function isFunction(obj) {
            return typeof obj === 'function';
        }

        function cached(fn) {
            var cache = Object.create(null);
            return function cachedFn(str) {
                var hit = cache[str];
                return hit || (cache[str] = fn(str));
            };
        }

        function copyProperties(target, source) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Reflect.ownKeys(source)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var key = _step.value;

                    if (key !== "constructor" && key !== "prototype" && key !== "name") {
                        var desc = Object.getOwnPropertyDescriptor(source, key);
                        Object.defineProperty(target, key, desc);
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }

        var no = function no() {
            return false;
        };

        var OBJECT_STRING = '[object Object]';
        function isPlainObject(obj) {
            return toString.call(obj) === OBJECT_STRING;
        }

        var isNative = function isNative(Ctor) {
            return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
        };

        var _Set = function () {
            var _Set = void 0;
            if (typeof Set !== 'undefined' && isNative(Set)) {
                _Set = Set;
            } else {
                _Set = function () {
                    function Set() {
                        _classCallCheck(this, Set);

                        this.set = Object.create(null);
                    }

                    _createClass(Set, [{
                        key: 'has',
                        value: function has(key) {
                            return this.set[key] === true;
                        }
                    }, {
                        key: 'add',
                        value: function add(key) {
                            this.set[key] = true;
                        }
                    }, {
                        key: 'clear',
                        value: function clear() {
                            this.set = Object.create(null);
                        }
                    }]);

                    return Set;
                }();
            }
            return _Set;
        }();

        var bailRE = /[^\w.$]/;
        function parsePath(path) {
            if (bailRE.test(path)) {
                return;
            }
            var segments = path.split('.');
            return function (obj) {
                for (var i = 0; i < segments.length; i++) {
                    if (!obj) return;
                    obj = obj[segments[i]];
                }
                return obj;
            };
        }
        function remove(arr, item) {
            if (arr.length) {
                var index = arr.indexOf(item);
                if (index > -1) {
                    return arr.splice(index, 1);
                }
            }
        }

        var nextTick = function () {
            var callbacks = [];
            var pending = false;
            var timerFunc = void 0;

            function nextTickHandler() {
                pending = false;
                var copies = callbacks.slice(0);
                callbacks.length = 0;
                for (var i = 0; i < copies.length; i++) {
                    copies[i]();
                }
            }

            if (typeof Promise !== 'undefined' && isNative(Promise)) {
                var p = Promise.resolve();
                var logError = function logError(err) {
                    console.error(err);
                };
                timerFunc = function timerFunc() {
                    p.then(nextTickHandler).catch(logError);
                };
            } else if (typeof MutationObserver !== 'undefined' && (isNative(MutationObserver) || MutationObserver.toString() === '[object MutationObserverConstructor]')) {
                var counter = 1;
                var observer = new MutationObserver(nextTickHandler);
                var textNode = document.createTextNode(String(counter));
                observer.observe(textNode, {
                    characterData: true
                });
                timerFunc = function timerFunc() {
                    counter = (counter + 1) % 2;
                    textNode.data = String(counter);
                };
            } else {
                timerFunc = function timerFunc() {
                    setTimeout(nextTickHandler, 0);
                };
            }

            return function queueNextTick(cb, ctx) {
                var _resolve = void 0;
                callbacks.push(function () {
                    if (cb) {
                        try {
                            cb.call(ctx);
                        } catch (e) {
                            warn('queueNextTick:' + ctx);
                        }
                    } else if (_resolve) {
                        _resolve(ctx);
                    }
                });
                if (!pending) {
                    pending = true;
                    timerFunc();
                }
                if (!cb && typeof Promise !== 'undefined') {
                    return new Promise(function (resolve, reject) {
                        _resolve = resolve;
                    });
                }
            };
        }();

        function warn(msg, vm) {
            console.error('[MVVM warn]: ' + msg);
        }

        var hasProto = '__proto__' in {};

        function domTostr(dom) {
            var div = document.createElement("div");
            div.appendChild(dom);
            return div.innerHTML;
        }

        function strTodom(str) {
            var div = document.createElement('div');
            div.innerHTML = str;
            return div.firstChild;
        }

        function isDom(dom) {
            return dom instanceof HTMLElement;
        }

        function bind(fn, ctx) {
            function boundFn(a) {
                var l = arguments.length;
                return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
            }
            boundFn._length = fn.length;
            return boundFn;
        }

        function isObject(obj) {
            return obj !== null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
        }

        function hasOwn(obj, key) {
            return hasOwnProperty.call(obj, key);
        }

        function noop() {}

        function def(obj, key, val, enumerable) {
            Object.defineProperty(obj, key, {
                value: val,
                enumerable: !!enumerable,
                writable: true,
                configurable: true
            });
        }

        /***/ }),
    /* 1 */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scheduler__ = __webpack_require__(23);
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dep__ = __webpack_require__(4);
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils__ = __webpack_require__(0);
        var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }






        var uid = 0;

//一个观察者 解析执行表达式代码，收集它依赖于的dep对象
//缓存计算第一次的值，当值依赖发生改变时，变为脏数据，再次请求，更新数据
//这是user watch/render watch 中的 user watch

        var Watcher = function () {
            function Watcher(vm, expOrFn, cb, options) {
                _classCallCheck(this, Watcher);

                this.vm = vm;
                vm._watchers.push(this);
                if (options) {
                    this.deep = !!options.deep;
                    this.user = !!options.user;
                    this.lazy = !!options.lazy;
                    this.sync = !!options.sync;
                } else {
                    this.deep = this.user = this.lazy = this.sync = false;
                }
                this.cb = cb;
                this.id = ++uid;
                this.active = true;
                this.dirty = this.lazy;
                this.deps = [];
                this.newDeps = [];
                this.depIds = new __WEBPACK_IMPORTED_MODULE_2__utils__["k" /* _Set */]();
                this.newDepIds = new __WEBPACK_IMPORTED_MODULE_2__utils__["k" /* _Set */]();
                this.expression = expOrFn.toString();
                // parse expression for getter
                if (typeof expOrFn === 'function') {
                    this.getter = expOrFn;
                } else {
                    this.getter = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils__["l" /* parsePath */])(expOrFn);
                    if (!this.getter) {
                        this.getter = function () {};
                    }
                }
                //判断当是user watch收集依赖
                this.value = this.lazy ? undefined : this.get();
            }

            //computed获取值的时候调用watcher.get();


            _createClass(Watcher, [{
                key: 'get',
                value: function get() {
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__dep__["a" /* pushTarget */])(this);
                    var value = void 0;
                    var vm = this.vm;
                    if (this.user) {
                        try {
                            value = this.getter.call(vm, vm);
                        } catch (e) {
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils__["e" /* warn */])('getter for watcher "' + this.expression + '"');
                        }
                    } else {
                        value = this.getter.call(vm, vm);
                    }
                    //当deep设置为true的时候，来深度观察依赖对象的变动
                    if (this.deep) {
                        traverse(value);
                    }
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__dep__["b" /* popTarget */])();
                    this.cleanupDeps();
                    return value;
                }

                //收集watcher依赖的dep对象

            }, {
                key: 'addDep',
                value: function addDep(dep) {
                    var id = dep.id;
                    //因为访问父的时候，会判断添加子依赖，
                    if (!this.newDepIds.has(id)) {
                        this.newDepIds.add(id);
                        this.newDeps.push(dep);
                        if (!this.depIds.has(id)) {
                            dep.addSub(this);
                        }
                    }
                }

                //清除依赖的dep对象

            }, {
                key: 'cleanupDeps',
                value: function cleanupDeps() {
                    var i = this.deps.length;
                    while (i--) {
                        var dep = this.deps[i];
                        if (!this.newDepIds.has(dep.id)) {
                            dep.removeSub(this);
                        }
                    }
                    var tmp = this.depIds;
                    this.depIds = this.newDepIds;
                    this.newDepIds = tmp;
                    this.newDepIds.clear();
                    tmp = this.deps;
                    this.deps = this.newDeps;
                    this.newDeps = tmp;
                    this.newDeps.length = 0;
                }

                //当依赖改变时被调用

            }, {
                key: 'update',
                value: function update() {
                    if (this.lazy) {
                        this.dirty = true;
                    } else if (this.sync) {
                        this.run();
                    } else {
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__scheduler__["a" /* queueWatcher */])(this);
                    }
                }

                //开启加入到异步更新队列

            }, {
                key: 'run',
                value: function run() {
                    if (this.active) {
                        var value = this.get();
                        if (value !== this.value ||
                              //是对象或者是深度的时候需要重新赋值，因为可能突变
                          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils__["m" /* isObject */])(value) || this.deep) {
                            //设置新值
                            var oldValue = this.value;
                            this.value = value;
                            if (this.user) {
                                try {
                                    this.cb.call(this.vm, value, oldValue);
                                } catch (e) {
                                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils__["e" /* warn */])('callback for watcher "' + this.expression + '"');
                                }
                            } else {
                                this.cb.call(this.vm, value, oldValue);
                            }
                        }
                    }
                }

                //依赖发生改变以后，获取值是重新赋值的方法

            }, {
                key: 'evaluate',
                value: function evaluate() {
                    this.value = this.get();
                    this.dirty = false;
                }

                //把自己加入到依赖dep对象，dep对象因此知道有哪些watcher需要更新<关键>

            }, {
                key: 'depend',
                value: function depend() {
                    var i = this.deps.length;
                    while (i--) {
                        this.deps[i].depend();
                    }
                }

                //卸载该watcher

            }, {
                key: 'teardown',
                value: function teardown() {
                    if (this.active) {
                        //卸载vm.watcher
                        //如果vm正在被摧毁，跳过此步骤，因为这个操作消耗性能
                        if (!this.vm._isBeingDestroyed) {
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils__["d" /* remove */])(this.vm._watchers, this);
                        }
                        var i = this.deps.length;
                        while (i--) {
                            this.deps[i].removeSub(this);
                        }
                        this.active = false;
                    }
                }
            }]);

            return Watcher;
        }();

//遍历依赖对象的所有get方法,这样可以把每个属性设置为依赖


        /* harmony default export */ __webpack_exports__["a"] = (Watcher);
        var seenObjects = new __WEBPACK_IMPORTED_MODULE_2__utils__["k" /* _Set */]();
        function traverse(val) {
            seenObjects.clear();
            _traverse(val, seenObjects);
        }

        function _traverse(val, seen) {
            var i = void 0,
              keys = void 0;
            var isA = Array.isArray(val);
            if (!isA && !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils__["m" /* isObject */])(val) || !Object.isExtensible(val)) {
                return;
            }
            if (val.__ob__) {
                var depId = val.__ob__.dep.id;
                if (seen.has(depId)) {
                    return;
                }
                seen.add(depId);
            }
            if (isA) {
                i = val.length;
                while (i--) {
                    _traverse(val[i], seen);
                }
            } else {
                keys = Object.keys(val);
                i = keys.length;
                while (i--) {
                    _traverse(val[keys[i]], seen);
                }
            }
        }

        /***/ }),
    /* 2 */
    /***/ (function(module, exports, __webpack_require__) {

        "use strict";


        var vnode_1 = __webpack_require__(3);
        var is = __webpack_require__(6);
        function addNS(data, children, sel) {
            data.ns = 'http://www.w3.org/2000/svg';
            if (sel !== 'foreignObject' && children !== undefined) {
                for (var i = 0; i < children.length; ++i) {
                    var childData = children[i].data;
                    if (childData !== undefined) {
                        addNS(childData, children[i].children, children[i].sel);
                    }
                }
            }
        }
        function h(sel, b, c) {
            var data = {},
              children,
              text,
              i;
            if (c !== undefined) {
                data = b;
                if (is.array(c)) {
                    children = c;
                } else if (is.primitive(c)) {
                    text = c;
                } else if (c && c.sel) {
                    children = [c];
                }
            } else if (b !== undefined) {
                if (is.array(b)) {
                    children = b;
                } else if (is.primitive(b)) {
                    text = b;
                } else if (b && b.sel) {
                    children = [b];
                } else {
                    data = b;
                }
            }
            if (is.array(children)) {
                for (i = 0; i < children.length; ++i) {
                    if (is.primitive(children[i])) children[i] = vnode_1.vnode(undefined, undefined, undefined, children[i]);
                }
            }
            if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' && (sel.length === 3 || sel[3] === '.' || sel[3] === '#')) {
                addNS(data, children, sel);
            }
            return vnode_1.vnode(sel, data, children, text, undefined);
        }
        exports.h = h;
        ;
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.default = h;
//# sourceMappingURL=h.js.map

        /***/ }),
    /* 3 */
    /***/ (function(module, exports, __webpack_require__) {

        "use strict";


        function vnode(sel, data, children, text, elm) {
            var key = data === undefined ? undefined : data.key;
            return { sel: sel, data: data, children: children,
                text: text, elm: elm, key: key };
        }
        exports.vnode = vnode;
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.default = vnode;
//# sourceMappingURL=vnode.js.map

        /***/ }),
    /* 4 */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__watcher__ = __webpack_require__(1);
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(0);
        /* harmony export (immutable) */ __webpack_exports__["a"] = pushTarget;
        /* harmony export (immutable) */ __webpack_exports__["b"] = popTarget;
        var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

        /* @flow */




        var uid = 0;

//dep是观察者，他知道有多少computed依赖于他
//依赖对象在subs中

        var Dep = function () {
            function Dep() {
                _classCallCheck(this, Dep);

                this.id = uid++;
                this.subs = [];
            }
            //添加watcher


            _createClass(Dep, [{
                key: 'addSub',
                value: function addSub(sub) {
                    this.subs.push(sub);
                }
                //移除watcher

            }, {
                key: 'removeSub',
                value: function removeSub(sub) {
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* remove */])(this.subs, sub);
                }
                //computed获取值的时候收集依赖

            }, {
                key: 'depend',
                value: function depend() {
                    if (Dep.target) {
                        Dep.target.addDep(this);
                    }
                }
                //设置值的时候，触发异步更新队列

            }, {
                key: 'notify',
                value: function notify() {
                    var subs = this.subs.slice();
                    for (var i = 0, l = subs.length; i < l; i++) {
                        subs[i].update();
                    }
                }
            }]);

            return Dep;
        }();

//当获取computed时候Dep.target(全局的,Dep静态属性)赋值，以此来收集依赖关系


        /* harmony default export */ __webpack_exports__["c"] = (Dep);
        Dep.target = null;
        var targetStack = [];

        function pushTarget(_target) {
            if (Dep.target) targetStack.push(Dep.target);
            Dep.target = _target;
        }

        function popTarget() {
            Dep.target = targetStack.pop();
        }

        /***/ }),
    /* 5 */
    /***/ (function(module, exports, __webpack_require__) {

        "use strict";


        function createElement(tagName) {
            return document.createElement(tagName);
        }
        function createElementNS(namespaceURI, qualifiedName) {
            return document.createElementNS(namespaceURI, qualifiedName);
        }
        function createTextNode(text) {
            return document.createTextNode(text);
        }
        function createComment(text) {
            return document.createComment(text);
        }
        function insertBefore(parentNode, newNode, referenceNode) {
            parentNode.insertBefore(newNode, referenceNode);
        }
        function removeChild(node, child) {
            node.removeChild(child);
        }
        function appendChild(node, child) {
            node.appendChild(child);
        }
        function parentNode(node) {
            return node.parentNode;
        }
        function nextSibling(node) {
            return node.nextSibling;
        }
        function tagName(elm) {
            return elm.tagName;
        }
        function setTextContent(node, text) {
            node.textContent = text;
        }
        function getTextContent(node) {
            return node.textContent;
        }
        function isElement(node) {
            return node.nodeType === 1;
        }
        function isText(node) {
            return node.nodeType === 3;
        }
        function isComment(node) {
            return node.nodeType === 8;
        }
        exports.htmlDomApi = {
            createElement: createElement,
            createElementNS: createElementNS,
            createTextNode: createTextNode,
            createComment: createComment,
            insertBefore: insertBefore,
            removeChild: removeChild,
            appendChild: appendChild,
            parentNode: parentNode,
            nextSibling: nextSibling,
            tagName: tagName,
            setTextContent: setTextContent,
            getTextContent: getTextContent,
            isElement: isElement,
            isText: isText,
            isComment: isComment
        };
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.default = exports.htmlDomApi;
//# sourceMappingURL=htmldomapi.js.map

        /***/ }),
    /* 6 */
    /***/ (function(module, exports, __webpack_require__) {

        "use strict";


        exports.array = Array.isArray;
        function primitive(s) {
            return typeof s === 'string' || typeof s === 'number';
        }
        exports.primitive = primitive;
//# sourceMappingURL=is.js.map

        /***/ }),
    /* 7 */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);
        /* unused harmony export dirRE */
        /* unused harmony export bindRE */
        /* unused harmony export modifierRE */
        /* unused harmony export drictiveRE */
        /* unused harmony export addIfCondition */
        /* unused harmony export parseModifiers */
        /* unused harmony export removeAttr */
        /* harmony export (immutable) */ __webpack_exports__["a"] = makeAttrsMap;
        /* harmony export (immutable) */ __webpack_exports__["b"] = setElDrictive;
        /* harmony export (immutable) */ __webpack_exports__["c"] = setElStyle;
        /* harmony export (immutable) */ __webpack_exports__["d"] = setElAttrs;
        /* unused harmony export addHandler */
        /* unused harmony export processIfConditions */
        /* harmony export (immutable) */ __webpack_exports__["e"] = makeFunction;


        var dirRE = /^m-|^@|^:/;
        var bindRE = /^:|^m-bind:/;
        var modifierRE = /\.[^.]+/g;
        var drictiveRE = /^m\-(\w+)(\:[^\.]+)?\.?([^\:]+)?/;

//添加判断条件，是否显示
        function addIfCondition(el, condition) {
            if (!el.ifConditions) {
                el.ifConditions = [];
            }
            el.ifConditions.push(condition);
        }

        function parseModifiers(name) {
            var match = name.match(modifierRE);
            if (match) {
                var ret = {};
                match.forEach(function (m) {
                    ret[m.slice(1)] = true;
                });
                return ret;
            }
        }

//获取vnode中的中的属性[name],并且删除attrsList中改值
//删除值为了不再渲染自定义指令属性
        function removeAttr(el, name) {
            delete el.attrsMap[name];
        }

//{name:key,value:value} to {key:value}
        function makeAttrsMap(attrs, delimiters) {
            var map = {};
            for (var i = 0, l = attrs.length; i < l; i++) {
                map[attrs[i].name] = attrs[i].value;
            }
            return map;
        }
//获取指令
        function setElDrictive(el, attrs) {
            for (var i = 0, l = attrs.length; i < l; i++) {
                var name = attrs[i].name;
                var darr = name.match(drictiveRE);
                if (darr) {
                    //removeAttr(el, name)
                    el[darr[1]] = {
                        name: darr[1],
                        expression: attrs[i].value,
                        modifiers: split(darr[3]),
                        arg: darr[2] && darr[2].slice(1)
                    };
                }
            }
            function split(modifiers) {
                var map = {};
                var mod = modifiers && modifiers.split('.');
                if (mod) {
                    mod.split('.').forEach(function (item, i) {
                        map[item] = true;
                    });
                }
                return map;
            }
        }

//导出style
        function setElStyle(el) {
            var style = el.attrsMap.style;
            if (style) {
                removeAttr(el, 'style');
                el.style = {};
                style.split(';').forEach(function (item) {
                    if (item) {
                        var spi = item.split(':');
                        el.style[spi[0]] = '"' + spi[1] + '"';
                    }
                });
            }
        }
//导出属性
        function setElAttrs(el, delimiters) {
            var s = delimiters[0],
              e = delimiters[1];
            var reg = new RegExp('^' + s + '(.+)' + e + '$');
            var attrs = el.attrsMap;
            for (var key in attrs) {
                var value = attrs[key];
                var match = value.match(reg);
                if (match) {
                    value = match[1];
                    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["q" /* isAttr */])(key)) {
                        el.props[key] = '_s(' + value + ')';
                    } else {
                        el.attrs[key] = value;
                    }
                } else {
                    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["q" /* isAttr */])(key)) {
                        el.props[key] = "'" + value + "'";
                    } else {
                        el.attrs[key] = "'" + value + "'";
                    }
                }
            }
        }

        function addHandler(el, name, value, modifiers, important) {
            // check capture modifier
            if (modifiers && modifiers.capture) {
                delete modifiers.capture;
                name = '!' + name; // mark the event as captured
            }
            if (modifiers && modifiers.once) {
                delete modifiers.once;
                name = '~' + name; // mark the event as once
            }
            var events = void 0;
            if (modifiers && modifiers.native) {
                delete modifiers.native;
                events = el.nativeEvents || (el.nativeEvents = {});
            } else {
                events = el.events || (el.events = {});
            }
            var newHandler = { value: value, modifiers: modifiers };
            var handlers = events[name];
            /* istanbul ignore if */
            if (Array.isArray(handlers)) {
                important ? handlers.unshift(newHandler) : handlers.push(newHandler);
            } else if (handlers) {
                events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
            } else {
                events[name] = newHandler;
            }
        }
//
        function findPrevElement(children) {
            var i = children.length;
            while (i--) {
                if (children[i].tag && children[i].if) return children[i];
            }
        }
//为了 esle ||else if
        function processIfConditions(el, parent) {
            var prev = findPrevElement(parent.children);
            if (prev) {
                addIfCondition(prev, {
                    exp: el.elseif,
                    block: el
                });
            } else {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["e" /* warn */])('v-' + (el.elseif ? 'else-if="' + el.elseif + '"' : 'else') + ' ' + ('used on element <' + el.tag + '> without corresponding v-if.'));
            }
        }

        function makeFunction(code) {
            try {
                return new Function(code);
            } catch (e) {
                return __WEBPACK_IMPORTED_MODULE_0__utils__["r" /* noop */];
            }
        }

        /***/ }),
    /* 8 */
    /***/ (function(module, exports) {

        var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

        var g;

// This works in non-strict mode
        g = function () {
            return this;
        }();

        try {
            // This works if eval is allowed (see CSP)
            g = g || Function("return this")() || (1, eval)("this");
        } catch (e) {
            // This works if the window reference is available
            if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
        }

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

        module.exports = g;

        /***/ }),
    /* 9 */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__observer__ = __webpack_require__(22);
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__observer_dep__ = __webpack_require__(4);
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__observer_watcher__ = __webpack_require__(1);
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils__ = __webpack_require__(0);
        /* harmony export (immutable) */ __webpack_exports__["a"] = initData;
        /* harmony export (immutable) */ __webpack_exports__["b"] = initComputed;
        /* harmony export (immutable) */ __webpack_exports__["d"] = initMethods;
        /* harmony export (immutable) */ __webpack_exports__["c"] = initWatch;





        var sharedPropertyDefinition = {
            enumerable: true,
            configurable: true,
            get: __WEBPACK_IMPORTED_MODULE_3__utils__["r" /* noop */],
            set: __WEBPACK_IMPORTED_MODULE_3__utils__["r" /* noop */]
        };

//初始化data属性
        function initData(vm, data) {
            if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__utils__["j" /* isFunction */])(data)) {
                data = data();
            }
            //监听data get(收集依赖)/set(触发更新)
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__observer__["a" /* observe */])(data, true);
            vm.$data = data;
            var keys = Object.keys(data);
            var i = keys.length;
            //代理data到vm
            while (i--) {
                proxy(vm, '$data', keys[i]);
            }
        }

//初始化计算属性
        var computedWatcherOptions = { lazy: true };

        function initComputed(vm, computed) {
            //存放计算属性，user watch,render watch
            var watchers = vm._computedWatchers = Object.create(null);
            for (var key in computed) {
                var userDef = computed[key];
                var getter = typeof userDef === 'function' ? userDef : userDef.get;
                watchers[key] = new __WEBPACK_IMPORTED_MODULE_2__observer_watcher__["a" /* default */](vm, getter, __WEBPACK_IMPORTED_MODULE_3__utils__["r" /* noop */], computedWatcherOptions);
                if (!(key in vm)) {
                    //将计算属性放入vm(get/set)
                    defineComputed(vm, key, userDef);
                } else {
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__utils__["e" /* warn */])('\u8BA1\u7B97\u5C5E\u6027 "' + key + '" \u5DF2\u7ECF\u88AB\u5B9A\u4E49\u4E86\u54E6');
                }
            }
        }
//初始方法
        function initMethods(vm, methods) {
            //遍历到原型链属性
            for (var key in methods) {
                vm[key] = methods[key] == null ? __WEBPACK_IMPORTED_MODULE_3__utils__["r" /* noop */] : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__utils__["f" /* bind */])(methods[key], vm);
            }
        }
//初始化监听
        function initWatch(vm, watch) {
            for (var key in watch) {
                var handler = watch[key];
                if (Array.isArray(handler)) {
                    for (var i = 0; i < handler.length; i++) {
                        createWatcher(vm, key, handler[i]);
                    }
                } else {
                    createWatcher(vm, key, handler);
                }
            }
        }
//创建单个watcher
        function createWatcher(vm, key, handler) {
            var options = void 0;
            //是个对象时，主要为了写deep属性
            if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__utils__["t" /* isPlainObject */])(handler)) {
                options = handler;
                handler = handler.handler;
            }
            //直接写方法名时
            if (typeof handler === 'string') {
                handler = vm[handler];
            }
            vm.$watch(key, handler, options);
        }
//定义单个计算属性
        function defineComputed(target, key, userDef) {
            if (typeof userDef === 'function') {
                sharedPropertyDefinition.get = createComputedGetter(key);
                sharedPropertyDefinition.set = __WEBPACK_IMPORTED_MODULE_3__utils__["r" /* noop */];
            } else {
                sharedPropertyDefinition.get = userDef.get ? userDef.cache !== false ? createComputedGetter(key) : userDef.get : __WEBPACK_IMPORTED_MODULE_3__utils__["r" /* noop */];
                sharedPropertyDefinition.set = userDef.set ? userDef.set : __WEBPACK_IMPORTED_MODULE_3__utils__["r" /* noop */];
            }
            //在VM上绑定computed
            Object.defineProperty(target, key, sharedPropertyDefinition);
        }
//创建计算属性默认get方法
        function createComputedGetter(key) {
            return function computedGetter() {
                var watcher = this._computedWatchers && this._computedWatchers[key];
                if (watcher) {
                    if (watcher.dirty) {
                        watcher.evaluate();
                    }
                    if (__WEBPACK_IMPORTED_MODULE_1__observer_dep__["c" /* default */].target) {
                        watcher.depend();
                    }
                    return watcher.value;
                }
            };
        }

//代理 在vm上直接访问$date上面的data
        function proxy(target, sourceKey, key) {
            sharedPropertyDefinition.get = function proxyGetter() {
                return this[sourceKey][key];
            };
            sharedPropertyDefinition.set = function proxySetter(val) {
                this[sourceKey][key] = val;
            };
            Object.defineProperty(target, key, sharedPropertyDefinition);
        }

        /***/ }),
    /* 10 */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__html_parser__ = __webpack_require__(25);
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__text_parser__ = __webpack_require__(26);
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__codegen__ = __webpack_require__(24);
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils__ = __webpack_require__(0);
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__helpers__ = __webpack_require__(7);
        /* harmony export (immutable) */ __webpack_exports__["a"] = compileToFunctions;






//缓存template解析之后的render函数
        var cache = {};

        function compileToFunctions(template, vm) {
            var root = void 0;
            var currentParent = void 0;
            var options = vm.$options;
            var stack = []; //记录当前节点位置:push,pop(树形)
            var hooks = vm.hooks;
            //直接获取render函数
            if (cache[template]) {
                return cache[template];
            }
            //通过John Resig 的 HTML Parser 解析template to vnode(自定义格式的Obejct，用于表示dom)
            //文档:http://ejohn.org/blog/pure-javascript-html-parser/
            //type
            //1 标签 2 文本表达式 3 纯文本
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__html_parser__["a" /* default */])(template, {
                //标签开始部位,unary:true 自闭合标签 exp:<br/>;false 闭合标签 <a></a>
                start: function start(tag, attrs, unary) {
                    var element = {
                        vm: vm,
                        type: 1,
                        tag: tag,
                        //属性[{name:key,value:value},...]
                        attrsList: attrs,
                        //属性{key1:value1,key2:value2}
                        attrsMap: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__helpers__["a" /* makeAttrsMap */])(attrs), //json格式转换
                        parent: currentParent,
                        //v-my-directive.foo.bar:arg ="expression"
                        //属性//[{name:'my-directive',expression:'expression',modifiers:{foo:true,bar:true},arg:'arg'}]
                        children: [],
                        events: {},
                        isComponent: !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__utils__["o" /* isHTMLTag */])(tag) && !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__utils__["p" /* isSVG */])(tag),
                        nativeEvents: {},
                        style: null,
                        hook: {},
                        props: {}, //DOM属性
                        attrs: {} //值为true,false则移除该属性
                    };
                    //解析指令
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__helpers__["b" /* setElDrictive */])(element, attrs);
                    // setElProps(element)
                    // setElAttrs(element)
                    //tofix
                    //后期修改为统一指令问题
                    //processFor(element)
                    //processIf(element)
                    //有问题待修改

                    for (var hkey in hooks) {
                        var hook;
                        if (element[hkey] && (hook = hooks[hkey].template2Vnode)) {
                            hook(element, element[hkey], vm);
                        }
                    }
                    //设置样式
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__helpers__["c" /* setElStyle */])(element);
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__helpers__["d" /* setElAttrs */])(element, vm.$options.delimiters);
                    //待实现
                    // processKey(element)
                    // processAttrs(element)

                    if (!root) {
                        vm.$vnode = root = element;
                    }

                    if (currentParent && !element.forbidden) {
                        currentParent.children.push(element);
                        element.parent = currentParent;
                    }
                    //不是自闭合标签
                    if (!unary) {
                        currentParent = element;
                        stack.push(element);
                    }
                },
                //标签结束
                end: function end(tag) {
                    var element = stack[stack.length - 1];
                    var lastNode = element.children[element.children.length - 1];
                    //删除最后一个空白文字节点
                    if (lastNode && lastNode.type === 3 && lastNode.text === ' ') {
                        element.children.pop();
                    }
                    // pop stack,比直接pop节约性能
                    stack.length -= 1;
                    currentParent = stack[stack.length - 1];
                },
                //中间文本部分
                chars: function chars(text) {
                    if (!text.trim()) {
                        //text = ' '
                        return;
                    }
                    //解析文本节点 exp: a{{b}}c => 'a'+_s(a)+'b'
                    var expression = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__text_parser__["a" /* default */])(text, options.delimiters);
                    if (expression) {
                        currentParent.children.push({
                            type: 2,
                            expression: expression,
                            text: text
                        });
                    } else {
                        currentParent && currentParent.children.push({
                            type: 3,
                            text: text
                        });
                    }
                }
            });
            //缓存template
            //解析vnode为render函数
            return cache[template] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__codegen__["a" /* default */])(root);
        }

        /***/ }),
    /* 11 */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_snabbdom__ = __webpack_require__(19);
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_snabbdom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_snabbdom__);
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_snabbdom_modules_class__ = __webpack_require__(15);
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_snabbdom_modules_class___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_snabbdom_modules_class__);
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_snabbdom_modules_props__ = __webpack_require__(17);
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_snabbdom_modules_props___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_snabbdom_modules_props__);
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_snabbdom_modules_attributes__ = __webpack_require__(14);
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_snabbdom_modules_attributes___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_snabbdom_modules_attributes__);
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_snabbdom_modules_style__ = __webpack_require__(18);
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_snabbdom_modules_style___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_snabbdom_modules_style__);
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_snabbdom_modules_eventlisteners__ = __webpack_require__(16);
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_snabbdom_modules_eventlisteners___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_snabbdom_modules_eventlisteners__);
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_snabbdom_htmldomapi__ = __webpack_require__(5);
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_snabbdom_htmldomapi___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_snabbdom_htmldomapi__);
        /* unused harmony reexport createElement */
        /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return h; });
        /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return VNode; });
        /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return patch; });









        var h = __webpack_require__(2).default;
        var VNode = __webpack_require__(3).default;

        var patch = __WEBPACK_IMPORTED_MODULE_0_snabbdom___default.a.init([__WEBPACK_IMPORTED_MODULE_1_snabbdom_modules_class___default.a, __WEBPACK_IMPORTED_MODULE_2_snabbdom_modules_props___default.a, __WEBPACK_IMPORTED_MODULE_3_snabbdom_modules_attributes___default.a, __WEBPACK_IMPORTED_MODULE_4_snabbdom_modules_style___default.a, __WEBPACK_IMPORTED_MODULE_5_snabbdom_modules_eventlisteners___default.a]);

        /***/ }),
    /* 12 */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__for__ = __webpack_require__(28);
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__if__ = __webpack_require__(29);
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__on__ = __webpack_require__(31);
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__model__ = __webpack_require__(30);
        /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return directive; });





        var directive = {
            install: function install(MVVM) {
                MVVM.directive = function (name) {
                    var callhook = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                    var hasDir = false;
                    (MVVM.prototype.hooks || (MVVM.prototype.hooks = {}))[name] = callhook;
                };
                MVVM.directive('for', __WEBPACK_IMPORTED_MODULE_0__for__["a" /* directiveFor */]);
                MVVM.directive('if', __WEBPACK_IMPORTED_MODULE_1__if__["a" /* directiveIf */]);
                MVVM.directive('on', __WEBPACK_IMPORTED_MODULE_2__on__["a" /* directiveOn */]);
                MVVM.directive('model', __WEBPACK_IMPORTED_MODULE_3__model__["a" /* directiveModel */]);
            }
        };

        /***/ }),
    /* 13 */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(32);
        /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return event; });


        var event = {
            install: function install(MVVM) {
                var _this = this,
                  _arguments = arguments;

                MVVM.prototype._events = {};
                MVVM.prototype.$on = function (event, fn) {
                    var vm = MVVM.prototype;
                    if (Array.isArray(event)) {
                        for (var i = 0, l = event.length; i < l; i++) {
                            _this.$on(event[i], fn);
                        }
                    } else {
                        (vm._events[event] || (vm._events[event] = [])).push(fn);
                    }
                    return vm;
                };
                MVVM.prototype.$once = function (event, fn) {
                    var vm = MVVM.prototype;
                    function on() {
                        vm.$off(event, on);
                        fn.apply(vm, arguments);
                    }
                    on.fn = fn;
                    vm.$on(event, on);
                    return vm;
                };
                MVVM.prototype.$off = function (event, fn) {
                    var vm = MVVM.prototype;
                    if (!_arguments.length) {
                        vm._events = Object.create(null);
                        return vm;
                    }
                    if (Array.isArray(event)) {
                        for (var _i = 0, l = event.length; _i < l; _i++) {
                            _this.$off(event[_i], fn);
                        }
                        return vm;
                    }
                    var cbs = vm._events[event];
                    if (!cbs) {
                        return vm;
                    }
                    if (_arguments.length === 1) {
                        vm._events[event] = null;
                        return vm;
                    }
                    var cb = void 0;
                    var i = cbs.length;
                    while (i--) {
                        cb = cbs[i];
                        if (cb === fn || cb.fn === fn) {
                            cbs.splice(i, 1);
                            break;
                        }
                    }
                    return vm;
                };
                MVVM.prototype.$emit = function (event) {
                    var vm = MVVM.prototype;
                    var cbs = vm._events[event];
                    if (cbs) {
                        cbs = cbs.length > 1 ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* toArray */])(cbs) : cbs;
                        var args = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["a" /* toArray */])(_arguments, 1);
                        for (var i = 0, l = cbs.length; i < l; i++) {
                            cbs[i].apply(vm, args);
                        }
                    }
                    return vm;
                };
            }
        };

        /***/ }),
    /* 14 */
    /***/ (function(module, exports, __webpack_require__) {

        "use strict";


        var NamespaceURIs = {
            "xlink": "http://www.w3.org/1999/xlink"
        };
        var booleanAttrs = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "compact", "controls", "declare", "default", "defaultchecked", "defaultmuted", "defaultselected", "defer", "disabled", "draggable", "enabled", "formnovalidate", "hidden", "indeterminate", "inert", "ismap", "itemscope", "loop", "multiple", "muted", "nohref", "noresize", "noshade", "novalidate", "nowrap", "open", "pauseonexit", "readonly", "required", "reversed", "scoped", "seamless", "selected", "sortable", "spellcheck", "translate", "truespeed", "typemustmatch", "visible"];
        var booleanAttrsDict = Object.create(null);
        for (var i = 0, len = booleanAttrs.length; i < len; i++) {
            booleanAttrsDict[booleanAttrs[i]] = true;
        }
        function updateAttrs(oldVnode, vnode) {
            var key,
              elm = vnode.elm,
              oldAttrs = oldVnode.data.attrs,
              attrs = vnode.data.attrs,
              namespaceSplit;
            if (!oldAttrs && !attrs) return;
            if (oldAttrs === attrs) return;
            oldAttrs = oldAttrs || {};
            attrs = attrs || {};
            // update modified attributes, add new attributes
            for (key in attrs) {
                var cur = attrs[key];
                var old = oldAttrs[key];
                if (old !== cur) {
                    if (booleanAttrsDict[key]) {
                        if (cur) {
                            elm.setAttribute(key, "");
                        } else {
                            elm.removeAttribute(key);
                        }
                    } else {
                        namespaceSplit = key.split(":");
                        if (namespaceSplit.length > 1 && NamespaceURIs.hasOwnProperty(namespaceSplit[0])) {
                            elm.setAttributeNS(NamespaceURIs[namespaceSplit[0]], key, cur);
                        } else {
                            elm.setAttribute(key, cur);
                        }
                    }
                }
            }
            // remove removed attributes
            // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
            // the other option is to remove all attributes with value == undefined
            for (key in oldAttrs) {
                if (!(key in attrs)) {
                    elm.removeAttribute(key);
                }
            }
        }
        exports.attributesModule = { create: updateAttrs, update: updateAttrs };
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.default = exports.attributesModule;
//# sourceMappingURL=attributes.js.map

        /***/ }),
    /* 15 */
    /***/ (function(module, exports, __webpack_require__) {

        "use strict";


        function updateClass(oldVnode, vnode) {
            var cur,
              name,
              elm = vnode.elm,
              oldClass = oldVnode.data.class,
              klass = vnode.data.class;
            if (!oldClass && !klass) return;
            if (oldClass === klass) return;
            oldClass = oldClass || {};
            klass = klass || {};
            for (name in oldClass) {
                if (!klass[name]) {
                    elm.classList.remove(name);
                }
            }
            for (name in klass) {
                cur = klass[name];
                if (cur !== oldClass[name]) {
                    elm.classList[cur ? 'add' : 'remove'](name);
                }
            }
        }
        exports.classModule = { create: updateClass, update: updateClass };
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.default = exports.classModule;
//# sourceMappingURL=class.js.map

        /***/ }),
    /* 16 */
    /***/ (function(module, exports, __webpack_require__) {

        "use strict";


        var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

        function invokeHandler(handler, vnode, event) {
            if (typeof handler === "function") {
                // call function handler
                handler.call(vnode, event, vnode);
            } else if ((typeof handler === "undefined" ? "undefined" : _typeof(handler)) === "object") {
                // call handler with arguments
                if (typeof handler[0] === "function") {
                    // special case for single argument for performance
                    if (handler.length === 2) {
                        handler[0].call(vnode, handler[1], event, vnode);
                    } else {
                        var args = handler.slice(1);
                        args.push(event);
                        args.push(vnode);
                        handler[0].apply(vnode, args);
                    }
                } else {
                    // call multiple handlers
                    for (var i = 0; i < handler.length; i++) {
                        invokeHandler(handler[i]);
                    }
                }
            }
        }
        function handleEvent(event, vnode) {
            var name = event.type,
              on = vnode.data.on;
            // call event handler(s) if exists
            if (on && on[name]) {
                invokeHandler(on[name], vnode, event);
            }
        }
        function createListener() {
            return function handler(event) {
                handleEvent(event, handler.vnode);
            };
        }
        function updateEventListeners(oldVnode, vnode) {
            var oldOn = oldVnode.data.on,
              oldListener = oldVnode.listener,
              oldElm = oldVnode.elm,
              on = vnode && vnode.data.on,
              elm = vnode && vnode.elm,
              name;
            // optimization for reused immutable handlers
            if (oldOn === on) {
                return;
            }
            // remove existing listeners which no longer used
            if (oldOn && oldListener) {
                // if element changed or deleted we remove all existing listeners unconditionally
                if (!on) {
                    for (name in oldOn) {
                        // remove listener if element was changed or existing listeners removed
                        oldElm.removeEventListener(name, oldListener, false);
                    }
                } else {
                    for (name in oldOn) {
                        // remove listener if existing listener removed
                        if (!on[name]) {
                            oldElm.removeEventListener(name, oldListener, false);
                        }
                    }
                }
            }
            // add new listeners which has not already attached
            if (on) {
                // reuse existing listener or create new
                var listener = vnode.listener = oldVnode.listener || createListener();
                // update vnode for listener
                listener.vnode = vnode;
                // if element changed or added we add all needed listeners unconditionally
                if (!oldOn) {
                    for (name in on) {
                        // add listener if element was changed or new listeners added
                        elm.addEventListener(name, listener, false);
                    }
                } else {
                    for (name in on) {
                        // add listener if new listener added
                        if (!oldOn[name]) {
                            elm.addEventListener(name, listener, false);
                        }
                    }
                }
            }
        }
        exports.eventListenersModule = {
            create: updateEventListeners,
            update: updateEventListeners,
            destroy: updateEventListeners
        };
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.default = exports.eventListenersModule;
//# sourceMappingURL=eventlisteners.js.map

        /***/ }),
    /* 17 */
    /***/ (function(module, exports, __webpack_require__) {

        "use strict";


        function updateProps(oldVnode, vnode) {
            var key,
              cur,
              old,
              elm = vnode.elm,
              oldProps = oldVnode.data.props,
              props = vnode.data.props;
            if (!oldProps && !props) return;
            if (oldProps === props) return;
            oldProps = oldProps || {};
            props = props || {};
            for (key in oldProps) {
                if (!props[key]) {
                    delete elm[key];
                }
            }
            for (key in props) {
                cur = props[key];
                old = oldProps[key];
                if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
                    elm[key] = cur;
                }
            }
        }
        exports.propsModule = { create: updateProps, update: updateProps };
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.default = exports.propsModule;
//# sourceMappingURL=props.js.map

        /***/ }),
    /* 18 */
    /***/ (function(module, exports, __webpack_require__) {

        "use strict";


        var raf = typeof window !== 'undefined' && window.requestAnimationFrame || setTimeout;
        var nextFrame = function nextFrame(fn) {
            raf(function () {
                raf(fn);
            });
        };
        function setNextFrame(obj, prop, val) {
            nextFrame(function () {
                obj[prop] = val;
            });
        }
        function updateStyle(oldVnode, vnode) {
            var cur,
              name,
              elm = vnode.elm,
              oldStyle = oldVnode.data.style,
              style = vnode.data.style;
            if (!oldStyle && !style) return;
            if (oldStyle === style) return;
            oldStyle = oldStyle || {};
            style = style || {};
            var oldHasDel = 'delayed' in oldStyle;
            for (name in oldStyle) {
                if (!style[name]) {
                    if (name[0] === '-' && name[1] === '-') {
                        elm.style.removeProperty(name);
                    } else {
                        elm.style[name] = '';
                    }
                }
            }
            for (name in style) {
                cur = style[name];
                if (name === 'delayed') {
                    for (name in style.delayed) {
                        cur = style.delayed[name];
                        if (!oldHasDel || cur !== oldStyle.delayed[name]) {
                            setNextFrame(elm.style, name, cur);
                        }
                    }
                } else if (name !== 'remove' && cur !== oldStyle[name]) {
                    if (name[0] === '-' && name[1] === '-') {
                        elm.style.setProperty(name, cur);
                    } else {
                        elm.style[name] = cur;
                    }
                }
            }
        }
        function applyDestroyStyle(vnode) {
            var style,
              name,
              elm = vnode.elm,
              s = vnode.data.style;
            if (!s || !(style = s.destroy)) return;
            for (name in style) {
                elm.style[name] = style[name];
            }
        }
        function applyRemoveStyle(vnode, rm) {
            var s = vnode.data.style;
            if (!s || !s.remove) {
                rm();
                return;
            }
            var name,
              elm = vnode.elm,
              i = 0,
              compStyle,
              style = s.remove,
              amount = 0,
              applied = [];
            for (name in style) {
                applied.push(name);
                elm.style[name] = style[name];
            }
            compStyle = getComputedStyle(elm);
            var props = compStyle['transition-property'].split(', ');
            for (; i < props.length; ++i) {
                if (applied.indexOf(props[i]) !== -1) amount++;
            }
            elm.addEventListener('transitionend', function (ev) {
                if (ev.target === elm) --amount;
                if (amount === 0) rm();
            });
        }
        exports.styleModule = {
            create: updateStyle,
            update: updateStyle,
            destroy: applyDestroyStyle,
            remove: applyRemoveStyle
        };
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.default = exports.styleModule;
//# sourceMappingURL=style.js.map

        /***/ }),
    /* 19 */
    /***/ (function(module, exports, __webpack_require__) {

        "use strict";


        var vnode_1 = __webpack_require__(3);
        var is = __webpack_require__(6);
        var htmldomapi_1 = __webpack_require__(5);
        function isUndef(s) {
            return s === undefined;
        }
        function isDef(s) {
            return s !== undefined;
        }
        var emptyNode = vnode_1.default('', {}, [], undefined, undefined);
        function sameVnode(vnode1, vnode2) {
            return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
        }
        function isVnode(vnode) {
            return vnode.sel !== undefined;
        }
        function createKeyToOldIdx(children, beginIdx, endIdx) {
            var i,
              map = {},
              key,
              ch;
            for (i = beginIdx; i <= endIdx; ++i) {
                ch = children[i];
                if (ch != null) {
                    key = ch.key;
                    if (key !== undefined) map[key] = i;
                }
            }
            return map;
        }
        var hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];
        var h_1 = __webpack_require__(2);
        exports.h = h_1.h;
        var thunk_1 = __webpack_require__(20);
        exports.thunk = thunk_1.thunk;
        function init(modules, domApi) {
            var i,
              j,
              cbs = {};
            var api = domApi !== undefined ? domApi : htmldomapi_1.default;
            for (i = 0; i < hooks.length; ++i) {
                cbs[hooks[i]] = [];
                for (j = 0; j < modules.length; ++j) {
                    var hook = modules[j][hooks[i]];
                    if (hook !== undefined) {
                        cbs[hooks[i]].push(hook);
                    }
                }
            }
            function emptyNodeAt(elm) {
                var id = elm.id ? '#' + elm.id : '';
                var c = elm.className ? '.' + elm.className.split(' ').join('.') : '';
                return vnode_1.default(api.tagName(elm).toLowerCase() + id + c, {}, [], undefined, elm);
            }
            function createRmCb(childElm, listeners) {
                return function rmCb() {
                    if (--listeners === 0) {
                        var parent_1 = api.parentNode(childElm);
                        api.removeChild(parent_1, childElm);
                    }
                };
            }
            function createElm(vnode, insertedVnodeQueue) {
                var i,
                  data = vnode.data;
                if (data !== undefined) {
                    if (isDef(i = data.hook) && isDef(i = i.init)) {
                        i(vnode);
                        data = vnode.data;
                    }
                }
                var children = vnode.children,
                  sel = vnode.sel;
                if (sel === '!') {
                    if (isUndef(vnode.text)) {
                        vnode.text = '';
                    }
                    vnode.elm = api.createComment(vnode.text);
                } else if (sel !== undefined) {
                    // Parse selector
                    var hashIdx = sel.indexOf('#');
                    var dotIdx = sel.indexOf('.', hashIdx);
                    var hash = hashIdx > 0 ? hashIdx : sel.length;
                    var dot = dotIdx > 0 ? dotIdx : sel.length;
                    var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
                    var elm = vnode.elm = isDef(data) && isDef(i = data.ns) ? api.createElementNS(i, tag) : api.createElement(tag);
                    if (hash < dot) elm.id = sel.slice(hash + 1, dot);
                    if (dotIdx > 0) elm.className = sel.slice(dot + 1).replace(/\./g, ' ');
                    for (i = 0; i < cbs.create.length; ++i) {
                        cbs.create[i](emptyNode, vnode);
                    }if (is.array(children)) {
                        for (i = 0; i < children.length; ++i) {
                            var ch = children[i];
                            if (ch != null) {
                                api.appendChild(elm, createElm(ch, insertedVnodeQueue));
                            }
                        }
                    } else if (is.primitive(vnode.text)) {
                        api.appendChild(elm, api.createTextNode(vnode.text));
                    }
                    i = vnode.data.hook; // Reuse variable
                    if (isDef(i)) {
                        if (i.create) i.create(emptyNode, vnode);
                        if (i.insert) insertedVnodeQueue.push(vnode);
                    }
                } else {
                    vnode.elm = api.createTextNode(vnode.text);
                }
                return vnode.elm;
            }
            function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
                for (; startIdx <= endIdx; ++startIdx) {
                    var ch = vnodes[startIdx];
                    if (ch != null) {
                        api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before);
                    }
                }
            }
            function invokeDestroyHook(vnode) {
                var i,
                  j,
                  data = vnode.data;
                if (data !== undefined) {
                    if (isDef(i = data.hook) && isDef(i = i.destroy)) i(vnode);
                    for (i = 0; i < cbs.destroy.length; ++i) {
                        cbs.destroy[i](vnode);
                    }if (vnode.children !== undefined) {
                        for (j = 0; j < vnode.children.length; ++j) {
                            i = vnode.children[j];
                            if (i != null && typeof i !== "string") {
                                invokeDestroyHook(i);
                            }
                        }
                    }
                }
            }
            function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
                for (; startIdx <= endIdx; ++startIdx) {
                    var i_1 = void 0,
                      listeners = void 0,
                      rm = void 0,
                      ch = vnodes[startIdx];
                    if (ch != null) {
                        if (isDef(ch.sel)) {
                            invokeDestroyHook(ch);
                            listeners = cbs.remove.length + 1;
                            rm = createRmCb(ch.elm, listeners);
                            for (i_1 = 0; i_1 < cbs.remove.length; ++i_1) {
                                cbs.remove[i_1](ch, rm);
                            }if (isDef(i_1 = ch.data) && isDef(i_1 = i_1.hook) && isDef(i_1 = i_1.remove)) {
                                i_1(ch, rm);
                            } else {
                                rm();
                            }
                        } else {
                            api.removeChild(parentElm, ch.elm);
                        }
                    }
                }
            }
            function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
                var oldStartIdx = 0,
                  newStartIdx = 0;
                var oldEndIdx = oldCh.length - 1;
                var oldStartVnode = oldCh[0];
                var oldEndVnode = oldCh[oldEndIdx];
                var newEndIdx = newCh.length - 1;
                var newStartVnode = newCh[0];
                var newEndVnode = newCh[newEndIdx];
                var oldKeyToIdx;
                var idxInOld;
                var elmToMove;
                var before;
                while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
                    if (oldStartVnode == null) {
                        oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
                    } else if (oldEndVnode == null) {
                        oldEndVnode = oldCh[--oldEndIdx];
                    } else if (newStartVnode == null) {
                        newStartVnode = newCh[++newStartIdx];
                    } else if (newEndVnode == null) {
                        newEndVnode = newCh[--newEndIdx];
                    } else if (sameVnode(oldStartVnode, newStartVnode)) {
                        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
                        oldStartVnode = oldCh[++oldStartIdx];
                        newStartVnode = newCh[++newStartIdx];
                    } else if (sameVnode(oldEndVnode, newEndVnode)) {
                        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
                        oldEndVnode = oldCh[--oldEndIdx];
                        newEndVnode = newCh[--newEndIdx];
                    } else if (sameVnode(oldStartVnode, newEndVnode)) {
                        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
                        api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
                        oldStartVnode = oldCh[++oldStartIdx];
                        newEndVnode = newCh[--newEndIdx];
                    } else if (sameVnode(oldEndVnode, newStartVnode)) {
                        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
                        api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                        oldEndVnode = oldCh[--oldEndIdx];
                        newStartVnode = newCh[++newStartIdx];
                    } else {
                        if (oldKeyToIdx === undefined) {
                            oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                        }
                        idxInOld = oldKeyToIdx[newStartVnode.key];
                        if (isUndef(idxInOld)) {
                            api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                            newStartVnode = newCh[++newStartIdx];
                        } else {
                            elmToMove = oldCh[idxInOld];
                            if (elmToMove.sel !== newStartVnode.sel) {
                                api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                            } else {
                                patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
                                oldCh[idxInOld] = undefined;
                                api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
                            }
                            newStartVnode = newCh[++newStartIdx];
                        }
                    }
                }
                if (oldStartIdx > oldEndIdx) {
                    before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
                    addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
                } else if (newStartIdx > newEndIdx) {
                    removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
                }
            }
            function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
                var i, hook;
                if (isDef(i = vnode.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
                    i(oldVnode, vnode);
                }
                var elm = vnode.elm = oldVnode.elm;
                var oldCh = oldVnode.children;
                var ch = vnode.children;
                if (oldVnode === vnode) return;
                if (vnode.data !== undefined) {
                    for (i = 0; i < cbs.update.length; ++i) {
                        cbs.update[i](oldVnode, vnode);
                    }i = vnode.data.hook;
                    if (isDef(i) && isDef(i = i.update)) i(oldVnode, vnode);
                }
                if (isUndef(vnode.text)) {
                    if (isDef(oldCh) && isDef(ch)) {
                        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue);
                    } else if (isDef(ch)) {
                        if (isDef(oldVnode.text)) api.setTextContent(elm, '');
                        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
                    } else if (isDef(oldCh)) {
                        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
                    } else if (isDef(oldVnode.text)) {
                        api.setTextContent(elm, '');
                    }
                } else if (oldVnode.text !== vnode.text) {
                    api.setTextContent(elm, vnode.text);
                }
                if (isDef(hook) && isDef(i = hook.postpatch)) {
                    i(oldVnode, vnode);
                }
            }
            return function patch(oldVnode, vnode) {
                var i, elm, parent;
                var insertedVnodeQueue = [];
                for (i = 0; i < cbs.pre.length; ++i) {
                    cbs.pre[i]();
                }if (!isVnode(oldVnode)) {
                    oldVnode = emptyNodeAt(oldVnode);
                }
                if (sameVnode(oldVnode, vnode)) {
                    patchVnode(oldVnode, vnode, insertedVnodeQueue);
                } else {
                    elm = oldVnode.elm;
                    parent = api.parentNode(elm);
                    createElm(vnode, insertedVnodeQueue);
                    if (parent !== null) {
                        api.insertBefore(parent, vnode.elm, api.nextSibling(elm));
                        removeVnodes(parent, [oldVnode], 0, 0);
                    }
                }
                for (i = 0; i < insertedVnodeQueue.length; ++i) {
                    insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
                }
                for (i = 0; i < cbs.post.length; ++i) {
                    cbs.post[i]();
                }return vnode;
            };
        }
        exports.init = init;
//# sourceMappingURL=snabbdom.js.map

        /***/ }),
    /* 20 */
    /***/ (function(module, exports, __webpack_require__) {

        "use strict";


        var h_1 = __webpack_require__(2);
        function copyToThunk(vnode, thunk) {
            thunk.elm = vnode.elm;
            vnode.data.fn = thunk.data.fn;
            vnode.data.args = thunk.data.args;
            thunk.data = vnode.data;
            thunk.children = vnode.children;
            thunk.text = vnode.text;
            thunk.elm = vnode.elm;
        }
        function init(thunk) {
            var cur = thunk.data;
            var vnode = cur.fn.apply(undefined, cur.args);
            copyToThunk(vnode, thunk);
        }
        function prepatch(oldVnode, thunk) {
            var i,
              old = oldVnode.data,
              cur = thunk.data;
            var oldArgs = old.args,
              args = cur.args;
            if (old.fn !== cur.fn || oldArgs.length !== args.length) {
                copyToThunk(cur.fn.apply(undefined, args), thunk);
            }
            for (i = 0; i < args.length; ++i) {
                if (oldArgs[i] !== args[i]) {
                    copyToThunk(cur.fn.apply(undefined, args), thunk);
                    return;
                }
            }
            copyToThunk(oldVnode, thunk);
        }
        exports.thunk = function thunk(sel, key, fn, args) {
            if (args === undefined) {
                args = fn;
                fn = key;
                key = undefined;
            }
            return h_1.h(sel, {
                key: key,
                hook: { init: init, prepatch: prepatch },
                fn: fn,
                args: args
            });
        };
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.default = exports.thunk;
//# sourceMappingURL=thunk.js.map

        /***/ }),
    /* 21 */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);
        /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return arrayMethods; });


        var arrayProto = Array.prototype;
        var arrayMethods = Object.create(arrayProto);
//覆盖数组原生方法，触发notify();
        ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
            var original = arrayProto[method];
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["u" /* def */])(arrayMethods, method, function mutator() {
                var i = arguments.length;
                var args = new Array(i);
                while (i--) {
                    args[i] = arguments[i];
                }
                var result = original.apply(this, args);
                var ob = this.__ob__;
                var inserted = void 0;
                //如果添加值，为添加的值添加监听者
                switch (method) {
                    case 'push':
                        inserted = args;
                        break;
                    case 'unshift':
                        inserted = args;
                        break;
                    case 'splice':
                        inserted = args.slice(2);
                        break;
                }
                if (inserted) ob.observeArray(inserted);
                ob.dep.notify();
                return result;
            });
        });

        /***/ }),
    /* 22 */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__array__ = __webpack_require__(21);
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dep__ = __webpack_require__(4);
        /* unused harmony export Observer */
        /* unused harmony export defineReactive */
        /* harmony export (immutable) */ __webpack_exports__["a"] = observe;
        var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

        function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }




        var arrayKeys = Object.getOwnPropertyNames(__WEBPACK_IMPORTED_MODULE_1__array__["a" /* arrayMethods */]);
        var Observer = function () {
            function Observer(value) {
                _classCallCheck(this, Observer);

                this.value = value;
                this.dep = new __WEBPACK_IMPORTED_MODULE_2__dep__["c" /* default */]();
                this.vmCount = 0; //$date的属性个数
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["u" /* def */])(value, '__ob__', this);
                if (Array.isArray(value)) {
                    //判断是否能访问原型链上属性for兼容
                    var augment = __WEBPACK_IMPORTED_MODULE_0__utils__["v" /* hasProto */] ? protoAugment : copyAugment;
                    //覆盖数组原生方法，触发notify
                    augment(value, __WEBPACK_IMPORTED_MODULE_1__array__["a" /* arrayMethods */], arrayKeys);
                    this.observeArray(value);
                } else {
                    this.walk(value);
                }
            }
            //只有当值为对象时，为每个属性添加getter/setters


            _createClass(Observer, [{
                key: 'walk',
                value: function walk(obj) {
                    var keys = Object.keys(obj);
                    for (var i = 0, l = keys.length; i < l; i++) {
                        defineReactive(obj, keys[i], obj[keys[i]]);
                    }
                }
                //只有当值为数组时，为每个属性添加getter/setters

            }, {
                key: 'observeArray',
                value: function observeArray(items) {
                    for (var i = 0, l = items.length; i < l; i++) {
                        observe(items[i]);
                    }
                }
            }]);

            return Observer;
        }();

        function defineReactive(obj, key, val, customSetter) {
            var dep = new __WEBPACK_IMPORTED_MODULE_2__dep__["c" /* default */]();
            var property = Object.getOwnPropertyDescriptor(obj, key);
            if (property && property.configurable === false) {
                return;
            }
            var getter = property && property.get;
            var setter = property && property.set;

            var childOb = observe(val);
            Object.defineProperty(obj, key, {
                enumerable: true,
                configurable: true,
                get: function reactiveGetter() {
                    var value = getter ? getter.call(obj) : val;
                    //当有依赖关系时，收集依赖
                    if (__WEBPACK_IMPORTED_MODULE_2__dep__["c" /* default */].target) {
                        //把自己添加到依赖
                        dep.depend();
                        if (childOb) {
                            //访问子的时候会冒泡去访问父
                            //父会把子添加到__ob__，这个属性只是看看而已，没什么实际意义
                            //会添加data属性下的所有对象离散集
                            childOb.dep.depend();
                        }
                        if (Array.isArray(value)) {
                            dependArray(value);
                        }
                    }
                    return value;
                },
                set: function reactiveSetter(newVal) {
                    var value = getter ? getter.call(obj) : val;
                    //查看值是否变化
                    if (newVal === value || newVal !== newVal && value !== value) {
                        return;
                    }
                    if (setter) {
                        setter.call(obj, newVal);
                    } else {
                        val = newVal;
                    }
                    childOb = observe(newVal);
                    //触发更新
                    dep.notify();
                }
            });
        }
//导出观察方法
        function observe(value, asRootData) {
            if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["m" /* isObject */])(value)) {
                return;
            }
            var ob = void 0;
            //已经存在observer,不再赋值
            if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["i" /* hasOwn */])(value, '__ob__') && value.__ob__ instanceof Observer) {
                ob = value.__ob__;
            } else {
                ob = new Observer(value);
            }
            if (asRootData && ob) {
                ob.vmCount++;
            }
            return ob;
        }

        function protoAugment(target, src) {
            target.__proto__ = src;
        }

        function copyAugment(target, src, keys) {
            for (var i = 0, l = keys.length; i < l; i++) {
                var key = keys[i];
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["u" /* def */])(target, key, src[key]);
            }
        }
//为数组添加依赖
        function dependArray(value) {
            for (var e, i = 0, l = value.length; i < l; i++) {
                e = value[i];
                e && e.__ob__ && e.__ob__.dep.depend();
                if (Array.isArray(e)) {
                    dependArray(e);
                }
            }
        }

        /***/ }),
    /* 23 */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__watcher__ = __webpack_require__(1);
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(0);
        /* unused harmony export MAX_UPDATE_COUNT */
        /* harmony export (immutable) */ __webpack_exports__["a"] = queueWatcher;




        var MAX_UPDATE_COUNT = 100;

        var queue = [];
        var activatedChildren = [];
        var has = {};
        var circular = {};
        var waiting = false;
        var flushing = false;
        var index = 0;

//初始化状态
        function resetSchedulerState() {
            queue.length = activatedChildren.length = 0;
            has = {};
            waiting = flushing = false;
        }

//刷新异步更新队列
        function flushSchedulerQueue() {
            flushing = true;
            var watcher = void 0,
              id = void 0;
            //异步队列保证以下几点
            //1,先更新父，在更新子
            //2,摧毁时，不再更新
            //3,先执行user watchers 再执行render watcher
            queue.sort(function (a, b) {
                return a.id - b.id;
            });

            //不要缓存队列长度，因为不停被加入
            for (index = 0; index < queue.length; index++) {
                watcher = queue[index];
                id = watcher.id;
                has[id] = null;
                watcher.run();
            }

            // 在重置状态之前保留队列的副本
            var activatedQueue = activatedChildren.slice();
            var updatedQueue = queue.slice();

            resetSchedulerState();

            // 调用组件更新和激活钩子
            callActivatedHooks(activatedQueue);
            callUpdateHooks(updatedQueue);
        }

        function callUpdateHooks(queue) {
            var i = queue.length;
            while (i--) {
                var watcher = queue[i];
                var vm = watcher.vm;
                if (vm._watcher === watcher && vm._isMounted) {
                    callHook(vm, 'updated');
                }
            }
        }

        function callActivatedHooks(queue) {
            for (var i = 0; i < queue.length; i++) {
                queue[i]._inactive = true;
                activateChildComponent(queue[i], true /* true */);
            }
        }

//添加到异步更新队列
        function queueWatcher(watcher) {
            var id = watcher.id;
            if (has[id] == null) {
                has[id] = true;
                if (!flushing) {
                    queue.push(watcher);
                } else {
                    // watcher去重
                    // 如果已经超过它的ID，它将立即运行下一个
                    var i = queue.length - 1;
                    while (i >= 0 && queue[i].id > watcher.id) {
                        i--;
                    }
                    queue.splice(Math.max(i, index) + 1, 0, watcher);
                }
                // 排入队列
                if (!waiting) {
                    waiting = true;
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["n" /* nextTick */])(flushSchedulerQueue);
                }
            }
        }

        /***/ }),
    /* 24 */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers__ = __webpack_require__(7);
        /* harmony export (immutable) */ __webpack_exports__["a"] = codeGen;

        var fnExpRE = /^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
        var simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/;
        var modifierCode = {
            stop: '$event.stopPropagation();',
            prevent: '$event.preventDefault();',
            self: 'if($event.target !== $event.currentTarget)return;',
            ctrl: 'if(!$event.ctrlKey)return;',
            shift: 'if(!$event.shiftKey)return;',
            alt: 'if(!$event.altKey)return;',
            meta: 'if(!$event.metaKey)return;'
        };

        var keyCodes = {
            esc: 27,
            tab: 9,
            enter: 13,
            space: 32,
            up: 38,
            left: 37,
            right: 39,
            down: 40,
            'delete': [8, 46]
        };

        function codeGen(ast) {
            //解析成h render字符串形式
            var code = ast ? genElement(ast) : '_h("div")';
            //把render函数，包起来，使其在当前作用域内
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__["e" /* makeFunction */])('with(this){ debugger;  return ' + code + '}');

            //return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__helpers__["e" /* makeFunction */])('with(this){ return ' + code + '}');

        }

        function genElement(el) {
            //指令阶段
            var hooks = el.vm.hooks;
            if (!el.processed) {
                el.processed = true;
                for (var hkey in hooks) {
                    var hook;
                    if (el[hkey] && (hook = hooks[hkey].vnode2render)) {
                        return hook(el, genElement);
                    }
                }
            }
            //无指令
            return nodir(el);
        }

//没有指令时运行,或者指令解析完毕
        function nodir(el) {
            var code = void 0;
            //设置属性 等值
            var data = genData(el);
            //转换子节点
            var children = genChildren(el, true);
            code = '_h(\'' + el.tag + '\'' + (data ? ',' + data : '' // data
              ) + (children ? ',' + children : '' // children
              ) + ')';
            return code;
        }

        function genChildren(el, checkSkip) {
            var children = el.children;
            if (children.length) {
                var _el = children[0];
                // 如果是v-for
                if (children.length === 1 && _el.for) {
                    return genElement(_el);
                }
                var normalizationType = 0;
                return '[' + children.map(genNode).join(',') + ']' + (checkSkip ? normalizationType ? ',' + normalizationType : '' : '');
            }
        }

        function genNode(node) {
            if (node.type === 1) {
                return genElement(node);
            } else {
                return genText(node);
            }
        }

        function genText(text) {
            return text.type === 2 ? text.expression : JSON.stringify(text.text);
        }

        function genData(el) {
            var data = '{';
            // attributes
            if (el.style) {
                data += 'style:' + genProps(el.style) + ',';
            }
            if (Object.keys(el.attrs).length) {
                data += 'attrs:' + genProps(el.attrs) + ',';
            }
            if (Object.keys(el.props).length) {
                data += 'props:' + genProps(el.props) + ',';
            }
            if (Object.keys(el.events).length) {
                data += 'on:' + genProps(el.events) + ',';
            }
            if (Object.keys(el.hook).length) {
                data += 'hook:' + genProps(el.hook) + ',';
            }
            data = data.replace(/,$/, '') + '}';
            return data;
        }

        function genProps(props) {
            var res = '{';
            for (var key in props) {
                res += '"' + key + '":' + props[key] + ',';
            }
            return res.slice(0, -1) + '}';
        }

        /***/ }),
    /* 25 */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /* harmony export (immutable) */ __webpack_exports__["a"] = HTMLParser;
        /*
         * Modified at https://github.com/blowsie/Pure-JavaScript-HTML5-Parser
         */

// Regular Expressions for parsing tags and attributes
        var startTag = /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:@][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
          endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/,
          attr = /([a-zA-Z_:@][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;

// Empty Elements - HTML 5
        var empty = makeMap("area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr");

// Block Elements - HTML 5
        var block = makeMap("a,address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video");

// Inline Elements - HTML 5
        var inline = makeMap("abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var");

// Elements that you can, intentionally, leave open
// (and which close themselves)
        var closeSelf = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr");

// Attributes that have their values filled in disabled="disabled"
        var fillAttrs = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected");

// Special Elements (can contain anything)
        var special = makeMap("script,style");

        function makeMap(str) {
            var obj = {},
              items = str.split(",");
            for (var i = 0; i < items.length; i++) {
                obj[items[i]] = true;
            }return obj;
        }

        function HTMLParser(html, handler) {
            var index,
              chars,
              match,
              stack = [],
              last = html;
            stack.last = function () {
                return this[this.length - 1];
            };

            while (html) {
                chars = true;

                // Make sure we're not in a script or style element
                if (!stack.last() || !special[stack.last()]) {

                    // Comment
                    if (html.indexOf("<!--") == 0) {
                        index = html.indexOf("-->");

                        if (index >= 0) {
                            if (handler.comment) handler.comment(html.substring(4, index));
                            html = html.substring(index + 3);
                            chars = false;
                        }

                        // end tag
                    } else if (html.indexOf("</") == 0) {
                        match = html.match(endTag);

                        if (match) {
                            html = html.substring(match[0].length);
                            match[0].replace(endTag, parseEndTag);
                            chars = false;
                        }

                        // start tag
                    } else if (html.indexOf("<") == 0) {
                        match = html.match(startTag);

                        if (match) {
                            html = html.substring(match[0].length);
                            match[0].replace(startTag, parseStartTag);
                            chars = false;
                        }
                    }

                    if (chars) {
                        index = html.indexOf("<");

                        var text = index < 0 ? html : html.substring(0, index);
                        html = index < 0 ? "" : html.substring(index);

                        if (handler.chars) handler.chars(text);
                    }
                } else {
                    html = html.replace(new RegExp("([\\s\\S]*?)<\/" + stack.last() + "[^>]*>"), function (all, text) {
                        text = text.replace(/<!--([\s\S]*?)-->|<!\[CDATA\[([\s\S]*?)]]>/g, "$1$2");
                        if (handler.chars) handler.chars(text);

                        return "";
                    });

                    parseEndTag("", stack.last());
                }

                if (html == last) throw "Parse Error: " + html;
                last = html;
            }

            // Clean up any remaining tags
            parseEndTag();

            function parseStartTag(tag, tagName, rest, unary) {
                tagName = tagName.toLowerCase();

                if (block[tagName]) {
                    while (stack.last() && inline[stack.last()]) {
                        parseEndTag("", stack.last());
                    }
                }

                if (closeSelf[tagName] && stack.last() == tagName) {
                    parseEndTag("", tagName);
                }

                unary = empty[tagName] || !!unary;

                if (!unary) stack.push(tagName);

                if (handler.start) {
                    var attrs = [];

                    rest.replace(attr, function (match, name) {
                        var value = arguments[2] ? arguments[2] : arguments[3] ? arguments[3] : arguments[4] ? arguments[4] : fillAttrs[name] ? name : "";

                        attrs.push({
                            name: name,
                            value: value,
                            escaped: value.replace(/(^|[^\\])"/g, '$1\\\"') //"
                        });
                    });

                    if (handler.start) handler.start(tagName, attrs, unary);
                }
            }

            function parseEndTag(tag, tagName) {
                // If no tag name is provided, clean shop
                if (!tagName) var pos = 0;

                // Find the closest opened tag of the same type
                else for (var pos = stack.length - 1; pos >= 0; pos--) {
                    if (stack[pos] == tagName) break;
                }if (pos >= 0) {
                    // Close all the open elements, up the stack
                    for (var i = stack.length - 1; i >= pos; i--) {
                        if (handler.end) handler.end(stack[i]);
                    } // Remove the open elements from the stack
                    stack.length = pos;
                }
            }
        };

        /***/ }),
    /* 26 */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);
        /* harmony export (immutable) */ __webpack_exports__["a"] = TextParser;


        var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
        var regexEscapeRE = /[-.*+?^${}()|[\]/\\]/g;

        var buildRegex = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["s" /* cached */])(function (delimiters) {
            var open = delimiters[0].replace(regexEscapeRE, '\\$&');
            var close = delimiters[1].replace(regexEscapeRE, '\\$&');
            return new RegExp(open + '((?:.|\\n)+?)' + close, 'g');
        });

        function TextParser(text, delimiters) {
            var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
            if (!tagRE.test(text)) {
                return;
            }
            var tokens = [];
            var lastIndex = tagRE.lastIndex = 0;
            var match = void 0,
              index = void 0;
            while (match = tagRE.exec(text)) {
                index = match.index;
                // push text token
                if (index > lastIndex) {
                    tokens.push(JSON.stringify(text.slice(lastIndex, index)));
                }
                // tag token
                var exp = match[1].trim();
                tokens.push('_s(' + exp + ')');
                lastIndex = index + match[0].length;
            }
            if (lastIndex < text.length) {
                tokens.push(JSON.stringify(text.slice(lastIndex)));
            }
            return tokens.join('+');
        }

        /***/ }),
    /* 27 */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /* WEBPACK VAR INJECTION */(function(global) {Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
            /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_observer_watcher__ = __webpack_require__(1);
            /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_utils__ = __webpack_require__(0);
            /* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_instance__ = __webpack_require__(9);
            /* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_parser__ = __webpack_require__(10);
            /* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_vnode__ = __webpack_require__(11);
            /* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__plugin_directives__ = __webpack_require__(12);
            /* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__plugin_event__ = __webpack_require__(13);
            var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

            function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }









            var uid = 0;

            var MVVM = function () {
                function MVVM(options) {
                    _classCallCheck(this, MVVM);

                    this._patch = __WEBPACK_IMPORTED_MODULE_4__core_vnode__["a" /* patch */];
                    this._s = __WEBPACK_IMPORTED_MODULE_1__core_utils__["a" /* toString */];

                    this.$options = options;
                    this.$options.delimiters = this.$options.delimiters || ["{{", "}}"];
                    this._uid = uid++;
                    this._watchers = [];
                    callHook(this, 'beforeCreate');
                    if (options.data) {
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__core_instance__["a" /* initData */])(this, options.data);
                    }

                    if (options.computed) {
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__core_instance__["b" /* initComputed */])(this, options.computed);
                    }
                    if (options.watch) {
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__core_instance__["c" /* initWatch */])(this, options.watch);
                    }
                    if (options.methods) {
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__core_instance__["d" /* initMethods */])(this, options.methods);
                    }
                    this.$mount(options.el);
                    callHook(this, 'created');
                }

                _createClass(MVVM, [{
                    key: '$mount',
                    value: function $mount(el) {

                        var options = this.$options;
                        //渲染入口
                        this.$el = el = el && __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__core_utils__["b" /* query */])(el);
                        //判断是否用户自定义render h函数,则不需要template
                        if (!options.render) {
                            //获取template
                            var template = options.template;
                            if (template) {
                                if (typeof template === 'string') {
                                    //获取script的template模板
                                    if (template[0] === '#') {
                                        template = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__core_utils__["c" /* idToTemplate */])(template);
                                    }
                                    //获取DOM类型tempalte
                                } else if (template.nodeType) {
                                    template = template.innerHTML;
                                }
                                //直接从入口处获取template
                            } else if (el) {
                                template = getOuterHTML(el);
                            }
                            //生成render函数
                            if (template) {
                                //生成render函数
                                var render = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__core_parser__["a" /* compileToFunctions */])(template, this);
                                options.render = render;
                            }
                        }

                        callHook(this, 'beforeMount');

                        //if (!options._isComponent) {
                        //更新dom

                        // this._update(this._render())
                        var vm = this;
                        this._watcher = new __WEBPACK_IMPORTED_MODULE_0__core_observer_watcher__["a" /* default */](this, function () {
                            vm._update(vm._render(), this._h);
                        }, function updateComponent() {
                            vm._update(vm._render(), this._h);
                        });
                        //}

                        if (!this._vnode) {
                            this._isMounted = true;
                            callHook(this, 'mounted');
                        }

                        return this;
                    }
                }, {
                    key: '$watch',
                    value: function $watch(expOrFn, cb, options) {
                        var vm = this;
                        options = options || {};
                        options.user = true;
                        var watcher = new __WEBPACK_IMPORTED_MODULE_0__core_observer_watcher__["a" /* default */](vm, expOrFn, cb, options);
                        if (options.immediate) {
                            cb.call(vm, watcher.value);
                        }
                        return function unwatchFn() {
                            watcher.teardown();
                        };
                    }
                }, {
                    key: '$forceUpdate',
                    value: function $forceUpdate() {
                        return this._render();
                    }
                }, {
                    key: '$destroy',
                    value: function $destroy() {
                        var vm = this;
                        callHook(this, 'beforeDestroy');
                        if (this.$parent) {
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__core_utils__["d" /* remove */])(this.$parent.$children, vm);
                        }
                        if (vm._watcher) {
                            vm._watcher.teardown();
                        }
                        var i = vm._watchers.length;
                        while (i--) {
                            vm._watchers[i].teardown();
                        }
                        if (vm.$data.__ob__) {
                            vm.$data.__ob__.vmCount--;
                        }
                        vm._patch(this.$el, { text: '' });
                        callHook(vm, 'destroyed');
                        vm.$off();
                    }
                }, {
                    key: '_render',
                    value: function _render() {
                        var render = this.$options.render;
                        var vnode = void 0;
                        try {
                            //自动解析的template不需要h,用户自定义的函数需要h
                            vnode = render.call(this, this._h);
                        } catch (e) {
                            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__core_utils__["e" /* warn */])('render Error : ' + e);
                        }
                        return vnode;
                    }
                }, {
                    key: '_update',
                    value: function _update(vnode) {
                        if (this._isMounted) {
                            callHook(this, 'beforeUpdate');
                        }
                        var prevVnode = this._vnode;
                        this._vnode = vnode;
                        if (!prevVnode) {
                            this.$el = this._patch(this.$el, vnode);
                        } else {
                            this.$el = this._patch(prevVnode, vnode);
                        }
                        if (this._isMounted) {
                            callHook(this, 'updated');
                        }
                    }
                    //渲染template和component

                }, {
                    key: '_h',
                    value: function _h(sel, data, children) {
                        data = data || {};
                        //没有attr时,child顶上
                        if (Array.isArray(data)) {
                            children = data;
                            data = {};
                        }

                        data.hook = data.hook || {};

                        if (this.$options.destroy) {
                            data.hook.destroy = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__core_utils__["f" /* bind */])(this.$options.destroy, this);
                        }

                        if (Array.isArray(children)) {
                            var faltChildren = [];

                            children.forEach(function (item) {
                                if (Array.isArray(item)) {
                                    faltChildren = faltChildren.concat(item);
                                } else {
                                    faltChildren.push(item);
                                }
                            });

                            children = faltChildren.length ? faltChildren : children;
                        }

                        if (typeof sel == 'string') {
                            var Ctor = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__core_utils__["g" /* resolveAsset */])(this.$options, 'components', sel);
                            if (Ctor) {
                                return this._createComponent(Ctor, data, children, sel);
                            }
                        }

                        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__core_vnode__["b" /* h */])(sel, data, children);
                    }
                    //创建组件
                    //子组件option,属性,子元素,tag

                }, {
                    key: '_createComponent',
                    value: function _createComponent(Ctor, data, children, sel) {
                        var _this = this;

                        Ctor.data = mergeOptions(Ctor.data);
                        var componentVm = void 0;
                        var Factory = this.constructor;
                        var parentData = this.$data;
                        data.hook.insert = function (vnode) {
                            Ctor.data = Ctor.data || {};
                            var el = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__core_utils__["h" /* createElement */])('sel');
                            vnode.elm.append(el);
                            Ctor.el = el;
                            componentVm = new Factory(Ctor);
                            vnode.key = componentVm.uid;
                            componentVm._isComponent = true;
                            componentVm.$parent = _this;
                            (_this.$children || (_this.$children = [])).push(componentVm);
                            //写在调用父组件值

                            var _loop = function _loop(key) {
                                if (Ctor.data[key]) {
                                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__core_utils__["e" /* warn */])('data:' + key + ',\u5DF2\u5B58\u5728');
                                    return 'continue';
                                }
                                Object.defineProperty(componentVm, key, {
                                    configurable: true,
                                    enumerable: true,
                                    get: function proxyGetter() {
                                        return parentData[key];
                                    }
                                });
                            };

                            for (var key in data.attrs) {
                                var _ret = _loop(key);

                                if (_ret === 'continue') continue;
                            }
                        };
                        Ctor._vnode = new __WEBPACK_IMPORTED_MODULE_4__core_vnode__["c" /* VNode */](sel, data, [], undefined, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__core_utils__["h" /* createElement */])(sel));
                        return Ctor._vnode;
                    }
                    //渲染for时,返回多个render

                }, {
                    key: '_l',
                    value: function _l(val, render) {
                        var ret = void 0,
                          i = void 0,
                          l = void 0,
                          keys = void 0,
                          key = void 0;
                        if (Array.isArray(val) || typeof val === 'string') {
                            ret = new Array(val.length);
                            for (i = 0, l = val.length; i < l; i++) {
                                ret[i] = render(val[i], i);
                            }
                        } else if (typeof val === 'number') {
                            ret = new Array(val);
                            for (i = 0; i < val; i++) {
                                ret[i] = render(i + 1, i);
                            }
                        } else if (isObject(val)) {
                            keys = Object.keys(val);
                            ret = new Array(keys.length);
                            for (i = 0, l = keys.length; i < l; i++) {
                                key = keys[i];
                                ret[i] = render(val[key], key, i);
                            }
                        }
                        return ret;
                    }
                }], [{
                    key: 'use',
                    value: function use(plugin) {
                        plugin && plugin.install && plugin.install.call(this, MVVM);
                    }
                }, {
                    key: '$set',
                    value: function $set(target, key, val) {
                        if (Array.isArray(target) && Number(key) !== NaN) {
                            target.length = Math.max(target.length, key);
                            target.splice(key, 1, val);
                            return val;
                        }
                        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__core_utils__["i" /* hasOwn */])(target, key)) {
                            target[key] = val;
                            return val;
                        }
                        var ob = target.__ob__;
                        if (target._isMVVM || ob && ob.vmCount) {
                            //避免给根节点添加监听
                            return val;
                        }
                        if (!ob) {
                            target[key] = val;
                            return val;
                        }
                        defineReactive(ob.value, key, val);
                        ob.dep.notify();
                        return val;
                    }
                }, {
                    key: '$delete',
                    value: function $delete(target, key) {
                        if (Array.isArray(target) && typeof key === 'number') {
                            target.splice(key, 1);
                            return;
                        }
                        var ob = target.__ob__;
                        if (target._isVue || ob && ob.vmCount) {
                            return;
                        }
                        if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__core_utils__["i" /* hasOwn */])(target, key)) {
                            return;
                        }
                        delete target[key];
                        if (!ob) {
                            return;
                        }
                        ob.dep.notify();
                    }
                }]);

                return MVVM;
            }();

            /* harmony default export */ __webpack_exports__["default"] = (MVVM);

            MVVM.use(__WEBPACK_IMPORTED_MODULE_5__plugin_directives__["a" /* directive */]);
            MVVM.use(__WEBPACK_IMPORTED_MODULE_6__plugin_event__["a" /* event */]);
            global.MVVM = MVVM;

//获取data 因为data有可能为
            function mergeOptions(options) {
                var opt = Object.assign({}, options);
                var data = opt.data;
                if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__core_utils__["j" /* isFunction */])(data)) {
                    opt.data = data();
                }
                return opt;
            }

//生命周期钩子函数
            function callHook(vm, hook) {
                var handlers = vm.$options[hook];
                if (handlers) {
                    if (Array.isArray(handlers)) {
                        for (var i = 0, j = handlers.length; i < j; i++) {
                            try {
                                handlers[i].call(vm);
                            } catch (e) {
                                handleError(e, vm, hook + ' hook');
                            }
                        }
                    } else {
                        handlers.call(vm);
                    }
                }
            }

//继承多个父类
// function mix(...mixins) {
//     class Mix { }
//     for (let mixin of mixins) {
//         copyProperties(Mix, mixin);
//         copyProperties(Mix.prototype, mixin.prototype);
//     }
//     return Mix;
// }

// function copyProperties(target, source) {
//     for (let key of Reflect.ownKeys(source)) {
//         if (key !== "constructor"
//             && key !== "prototype"
//             && key !== "name"
//         ) {
//             let desc = Object.getOwnPropertyDescriptor(source, key);
//             Object.defineProperty(target, key, desc);
//         }
//     }
// }


//init.js
// initLifecycle(vm)
// initEvents(vm)
// initRender(vm)
// callHook(vm, 'beforeCreate')
// initInjections(vm) // resolve injections before data/props
// initState(vm)
// initProvide(vm) // resolve provide after data/props
// callHook(vm, 'created')
            /* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(8)))

        /***/ }),
    /* 28 */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /* unused harmony export forAliasRE */
        /* unused harmony export forIteratorRE */
        /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return directiveFor; });
        var forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
        var forIteratorRE = /\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/;

        var directiveFor = {
            template2Vnode: function template2Vnode(el, dir) {
                //获取属性值
                var exp = dir.expression;

                //获取数组
                //(key ,index) in arr
                //[0] (key ,index) in arr,[1] (key ,index),[2] arr
                var inMatch = exp.match(forAliasRE);
                if (!inMatch) {
                    warn('Invalid v-for expression: ' + exp);
                    return;
                }
                el.for = inMatch[2].trim();
                var alias = inMatch[1].trim();
                //分解 (value,key ,index)
                //alias  value
                //iterator1 key
                //iterator2 index
                var iteratorMatch = alias.match(forIteratorRE);
                if (iteratorMatch) {
                    el.alias = iteratorMatch[1].trim();
                    el.iterator1 = iteratorMatch[2].trim();
                    if (iteratorMatch[3]) {
                        el.iterator2 = iteratorMatch[3].trim();
                    }
                } else {
                    el.alias = alias;
                }
            },
            vnode2render: function vnode2render(el, genElement) {
                if (!el.forProcessed) {
                    var exp = el.for;
                    var alias = el.alias;
                    var iterator1 = el.iterator1 ? ',' + el.iterator1 : '';
                    var iterator2 = el.iterator2 ? ',' + el.iterator2 : '';
                    return '_l((' + exp + '),' + ('function(' + alias + iterator1 + iterator2 + '){') + ('return ' + genElement(el)) + '})';
                }
            }
        };

        /***/ }),
    /* 29 */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return directiveIf; });


        var directiveIf = {
            template2Vnode: function template2Vnode(el, directive) {},
            vnode2render: function vnode2render(el, genElement) {
                var exp = el.if.expression;
                //if (el.isComponent) return `${genElement(el)}`;
                return exp + "?" + genElement(el) + ":''";
            }
        };

        /***/ }),
    /* 30 */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return directiveModel; });
        var directiveModel = {
            template2Vnode: function template2Vnode(el, dir, vm) {
                var delimiters = vm.$options.delimiters;
                el.attrsMap.value = delimiters[0] + dir.expression + delimiters[1];
                el.events.input = function (e) {
                    var el = e.target;
                    var value = el.value;
                    var exp = el.getAttribute('m-model');
                    var target, key;
                    //数组
                    var match = exp.match(/(.+)\[(\d+)\]$/);
                    if (match) {
                        target = eval(match[1]);
                        key = match[2];
                    } else {
                        match = exp.match(/(.+)\.(\w+)$/);
                        if (match) {
                            target = eval(match[1]);
                            key = match[2];
                        } else {
                            target = $data;
                            key = exp;
                            try {
                                value = JSON.parse(value);
                            } catch (e) {}
                        }
                    }

                    MVVM.$set(target, key, value);
                };
            }
        };

        /***/ }),
    /* 31 */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return directiveOn; });
        var directiveOn = {
            template2Vnode: function template2Vnode(el, dir) {
                //获取属性值
                var exp = dir.expression;
                if (dir.arg) {
                    el.events[dir.arg] = exp;
                }
            }
        };

        /***/ }),
    /* 32 */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {

        "use strict";
        /* harmony export (immutable) */ __webpack_exports__["a"] = toArray;
        function toArray(list, start) {
            start = start || 0;
            var i = list.length - start;
            var ret = new Array(i);
            while (i--) {
                ret[i] = list[i + start];
            }
            return ret;
        }

        /***/ })
    /******/ ]);
