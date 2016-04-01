var Promise = require("bluebird");

var CollectionDb = require("../collection/collection");
var collectionDb = new CollectionDb();

var settings = require("../settings");

var authSettings = settings.auth;
var app_id = authSettings.app_id;
var app_secret = authSettings.app_secret;

var moduleSettings = settings.module;
var tophost = moduleSettings.tophost; // top host id for module
var virtualhost = moduleSettings.virtualhost; // virtual host

var moduleListsDb = "ModuleLists";
var moduleDb = "Module";
var moduleMapDb = "ModuleMap";


var Util = require("../utils/util").Util;
var util = new Util();

var log = util.log;
var logError = util.logError;
var auth = util.auth;

var hasOwnProperty = Object.prototype.hasOwnProperty;

// ------------------------------------------------
function Module() {
	this.name = "Module";
	this.dbName = "Module";
	this.defaultDomain = "ky.biz";
	this.collectionDb = collectionDb;
}

exports.Module = Module;

// ------------------------------------------------

Module.prototype.createModule = function(options) {
	log("createModule: Hi I am called.");
	var self = this;

	return new Promise(function(resolve, reject) {
		if(!util.auth(options)
			|| !hasOwnProperty.call(options, "moduleEnName")
			|| typeof(options.moduleEnName) !== "string"
			|| !hasOwnProperty.call(options, "hostDomain")
			|| typeof(options.hostDomain) !== "string") {
			var errorStr = "createModule: options illegal.";

			logError(errorStr);
			reject(errorStr);

		} else {
			var moduleId = util.generateStr(false, 40);
			var moduleEnName = options.moduleEnName;
			var hostDomain = options.hostDomain || self.defaultDomain;

			var moduleCnName = "";
			var moduleDescription = "";
			var createUserId = "";
			var moduleFatherId = "";
			var handleAuthority = {
				"owner": "admin",
				"group": "admin"
			}
			var createTime = new Date();
			var updateTime = new Date();


			// init moduleCnName
			if(hasOwnProperty.call(options, "moduleCnName")
				&& typeof(options.moduleCnName) === "string") {
				moduleCnName = options.moduleCnName;
			} else {
				moduleCnName = options.moduleEnName;
			}

			// init moduleDescription
			if(hasOwnProperty.call(options, "moduleDescription")
				&& typeof(options.moduleDescription) === "string") {
				moduleDescription = options.moduleDescription;
			}

			// init createUserId
			if(hasOwnProperty.call(options, "createUserId")
				&& typeof(options.createUserId) === "string") {
				createUserId = options.createUserId;
			}

			// init moduleFatherId
			if(hasOwnProperty.call(options, "moduleFatherId")
				&& typeof(options.moduleFatherId) === "string") {
				moduleFatherId = options.moduleFatherId;
			} else {
				moduleFatherId = tophost;
			}

			// module options for collection module
			var moduleOptions = {
				app_id: app_id,
				app_secret: app_secret,
				collectionName: moduleDb,
				selector: {
					hostDomain: hostDomain,
					moduleEnName: moduleEnName
				},
				document: {
					moduleId: moduleId,
					moduleEnName: moduleEnName,
					moduleCnName: moduleCnName,
					isRemoved: false,
					createTime: createTime,
					updateTime: updateTime,
					handleAuthority: handleAuthority,
					hostDomain: hostDomain
				},
				updateOptions: {
					upsert: true
				}
			}

			// module options for collection moduleLists
			var moduleListsOptions = {
				app_id: app_id,
				app_secret: app_secret,
				collectionName: moduleListsDb,
				selector: {
					hostDomain: hostDomain,
					moduleEnName: moduleEnName
				},
				document: {
					moduleId: moduleId,
					isRemoved: false,
					createTime: createTime,
					updateTime: updateTime,
					moduleCnName: moduleCnName,
					moduleFatherId: moduleFatherId,
					handleAuthority: handleAuthority
				},
				updateOptions: {
					upsert: true,
					multi: true
				}
			}

			// module options for collection moduleMap
			var moduleMapOptions = {
				app_id: app_id,
				app_secret: app_secret,
				collectionName: moduleMapDb,
				selector: {
					hostDomain: hostDomain,
					moduleEnName: moduleEnName
				},
				document: {
					moduleId: moduleId,
					isRemoved: false,
					createTime: createTime,
					updateTime: updateTime,
					moduleFatherId: moduleFatherId,
					moduleEnName: moduleEnName,
					moduleCnName: moduleCnName,
					handleAuthority: handleAuthority,
					createUserId: createUserId
				},
				updateOptions: {
					upsert: true,
					multi: true
				}
			}

			// insert module $moduleEnName to Collection Modume
			self.collectionDb.update(moduleOptions)
				.then(function(results) {
					log("createModule: create module " + moduleCnName + " succeed.");
					return(results);

				})
				.then(function(results) {
					self.collectionDb.update(moduleListsOptions)
						.then(function(results) {
							log("createModule: create module lists" + moduleCnName + " succeed.");
							return(results);
						})

				})
				.then(function(results) {
					self.collectionDb.update(moduleMapOptions)
						.then(function(results) {
							log("createModule: create module map" + moduleCnName + " succeed.");
							resolve(results);
							return(results);
						})

				})
				.catch(function(err) {
					log("createModule: create module " + moduleCnName + " error.", err);
					reject(err);
				})
		}
	})

}

// ------------------------------------------------

// Module.prototype.updateModule = function(options) {
// 	log("updateModule: Hi I am called.");
// 	var self = this;

// 	return new Promise(function(resolve, reject) {
// 		if(!util.auth(options)
// 			|| !hasOwnProperty.call(options, "moduleId")
// 			|| typeof(options.moduleId) !== "string"
// 			|| !hasOwnProperty.call(options, "hostDomain")
// 			|| typeof(options.hostDomain) !== "string"
// 			|| !hasOwnProperty.call(options, "document")
// 			|| !util.isJson(options.document)) {
// 			var errorStr = "updateModule: options illegal.";

// 			logError(errorStr);
// 			reject(errorStr);

// 		} else {

// 			var moduleId = options.moduleId;
// 			var hostDomain = options.hostDomain || self.defaultDomain;

// 			var document = options.document;

// 			document.updateTime = true;

// 			var app_id = options.app_id;
// 			var app_secret = options.app_secret;

// 			var moduleUpdateOptions = {
// 				app_id: app_id,
// 				app_secret: app_id,


// 			}




// 		}
// 	});
// }
// ------------------------------------------------
/**
 * verify if exists module, pay attention this will contains tophost module
 * @param options module verifaction parameters, which contains
 * @property string app_id
 * @property string app_secret
 * @property moduleId
 * @property hostDomain
 * @property Promise return true if exists module
 */
Module.prototype.moduleExists = function(options) {
	log("moduleExists: Hi I am called.");
	var self = this;

	return new Promise(function(resolve, reject) {
		if(!util.auth(options)
			|| !hasOwnProperty.call(options, "hostDomain")
			|| typeof(options.hostDomain) !== "string"
			|| !hasOwnProperty.call(options, "moduleId")
			|| typeof(options.moduleId) !== "string") {
			var errorStr = "moduleExists: options illegal.";

			logError(errorStr);
			reject(errorStr);
		} else {
			var hostDomain = options.hostDomain;
			var app_id = options.app_id;
			var app_secret = options.app_secret;
			var moduleId = options.moduleId;

			var findOptions = {
				app_id: app_id,
				app_secret: app_secret,
				collectionName: moduleDb,
				query: {
					hostDomain: hostDomain,
					moduleId: moduleId
				}
			}

			self.collectionDb.find(findOptions)
				.then(function(results) {
					if(results.length === 0) {
						log("moduleExists: not exists  moduleId: " + moduleId)
						resolve(false);
					} else {
						resolve(true);
					}
				})
		}
	});
}


/**
 * verify if a digraph has circuit when link to a tree point
 * @param options , which contains:
 * @property {string} app_id
 * @property {string} app_secret
 * @property {string} sonModuleId
 * @property {string} atherModuleId
 * @return {Promise} true if exists
 */

// TODO： this function about verifing if has digraph circuit has errors.
// Module.prototype.hasDigraphCircuit = function(options) {
// 	var self = this;
// 	return new Promise(function(resolve, reject) {
// 		if(!util.auth(options)
// 			|| !hasOwnProperty.call(options, "hostDomain")
// 			|| typeof(options.hostDomain) !== "string"
// 			|| !hasOwnProperty.call(options, "fatherModuleId")
// 			|| typeof(options.fatherModuleId) !== "     "
// 			|| !hasOwnProperty(options, "sonModuleId")
// 			|| typeof(options.sonModuleId) !== "string") {
// 			var errorStr = "linkModule: options illegal.";
//
// 			logError(errorStr);
// 			reject(errorStr);
// 		} else {
// 			var sonModuleId = options.sonModuleId;
// 			var fatherModuleId = options.fatherModuleId;
//
// 			function verifyCircuit(fatherModuleId, sonModuleId) {
// 				if(fatherModuleId === tophost) {
// 					resolve(false);
// 				} else {
// 					self.collectionDb.findOne({moduleId: fatherModuleId})
// 					.then(function(results) {
// 						if(results
// 						&& hasOwnProperty.call(results, "fatherModuleId")
// 						&& results.fatherModuleId === sonModuleId) {
// 							resolve(true);
// 						} else {
// 							setImmediate(verifyCircuit, results.fatherModuleId, sonModuleId);
// 						}
// 					})
// 				}
// 			}
// 		}
// 	});
// }


// ------------------------------------------------
/**
 * link two modules together, for if not assignments fatherModuleId
 * when creating module , the module will has "tophost" fatherModuleId
 *
 * @param {json} options , which contains the following properties
 * @property {string} app_id
 * @property {string} app_secret
 * @property {string} hostDomain hostDomain for the site
 * @property {string} fatherModuleId   module _id as father role
 * @property {string} sonModuleId module _id as son role
 * @return {Promise} handle results
 */

// ATTENTION ---------------------------------------------------------
// TODO: IT IS VERY INPORTANT TO VERIFY THE RIGHT TO LINK MODULE
// TRY TO REFER TO THE DOC FOR DETAIL HELP.
// NOW , IT WILL ASSUME ALL THE TREE ABOUT MODULES ARE RIGHT TREE NODE.
// HOWEVER, IT SHALL SOLVE THIS PROBLEM LATER.
// ATTENTION ---------------------------------------------------------

// Module.prototype.linkModule = function(options) {
// 	log("linkModule: Hi I am called.");
// 	var self = this;
//
// 	return new Promise(function(resolve, reject) {
// 		if(!util.auth(options)
// 			|| !hasOwnProperty.call(options, "hostDomain")
// 			|| typeof(options.hostDomain) !== "string"
// 			|| !hasOwnProperty.call(options, "fatherModuleId")
// 			|| typeof(options.fatherModuleId) !== "string"
// 			|| !hasOwnProperty(options, "sonModuleId")
// 			|| typeof(options.sonModuleId) !== "string") {
// 			var errorStr = "linkModule: options illegal.";
//
// 			logError(errorStr);
// 			reject(errorStr);
// 		} else {
// 			var hostDomain = options.hostDomain;
// 			var fatherModuleId = options.fatherModuleId;
// 			var sonModuleId = options.sonModuleId;
//
// 			var verifyFatherOptions = {
// 				app_id: app_id,
// 				app_secret: app_secret,
// 				collectionName: moduleDb,
// 				query: {
// 					hostDomain: hostDomain,
// 					moduleId: fatherModuleId
// 				}
// 			}
//
// 			// link module options
// 			var linkOptions = {
// 				app_id: app_id,
// 				app_secret: app_secret,
// 				collectionName: moduleMapDb,
// 				query: {
// 					hostDomain: hostDomain,
// 					moduleId: sonModuleId
// 				},
// 				document: {
// 					fatherModuleId: fatherModuleId,
// 					updateTime: new Date()
// 				},
// 				updateOptions: {
// 					upsert: true,
// 					multi: true
// 				}
// 			}
//
// 			// if(!updateFlag) {
// 			self.moduleExists(verifyFatherOptions)
// 				.then(function(results) {
// 					if(!results) {
// 						var errorStr = "linkModule: will not handle module link.";
// 						logError(errorStr);
// 						reject(errorStr);
// 					} else {
// 						self.collectionDb.update(linkOptions)
// 							.then(function(results) {
// 								log("linkModule: link module " + sonModuleId + " to module " + fatherModuleId + " succeed.")
// 								resolve(results);
// 							})
//
// 					}
// 			})
// 			.catch(function(err) {
// 				log("linkModule: link module handle error.");
// 				reject(err);
// 			})
// 		}
// 	});
// }

// ------------------------------------------------
/**
 * unlink two modules, this is the opporite handle about linkModule
 * if the fatherModuleId is "tophost", then remove the module ,and then
 * link this module to virtualTop
 * @param {json} options , which contains the following properties
 * @property {string} app_id
 * @property {string} app_secret
 * @property {string} hostDomain hostDomain for the site
 * @property {string} moduleId will unlink this moudle from father module
 * @return {Promise} handle results
 */
Module.prototype.unlinkModule = function(options) {
	log("unlinkModule: Hi I am called.");
	var self = this;

	return new Promise(function(resolve, reject) {
		if(!util.auth(options)
			|| !hasOwnProperty.call(options, "hostDomain")
			|| typeof(options.hostDomain) !== "string"
			|| !hasOwnProperty(options, "moduleId")
			|| typeof(options.sonModuleId) !== "string") {
			var errorStr = "unlinkModule: options illegal.";

			logError(errorStr);
			reject(errorStr);
		} else {
			var hostDomain = options.hostDomain;
			var moduleId = options.moduleId;

			var app_id = options.app_id;
			var app_secret = options.app_secret;

			var unlinkOptions = {
				app_id: app_id,
				app_secret: app_secret,
				hostDomain: hostDomain,
				collectionName: moduleDb,


			}




		}

	}
}



// ------------------------------------------------

Module.prototype.syncModule = function(options) {



}

// ------------------------------------------------
/**
 * remove module from the system, you should be careful for using this api
 * @param  {json} options , that contaions the following properties
 * @property {string} app_id
 * @property {string} app_secret
 * @property {string} moduleId module id that represents the module to be removed.
 * @property {Boolean}  handleSons if true, will remove all son module
 * @return {Promise} handle results
 */
Module.prototype.removeModule = function(options) {



}

// ------------------------------------------------
/**
 * delete module from the system, you should be careful for using this api
 * @param  {json} options , that contaions the following properties
 * @property {string} app_id
 * @property {string} app_secret
 * @property {string} moduleId module id that represents the module to be removed.
 * @property {Boolean}  handleSons if true, will delete all son module
 * @return {Promise} handle results
 */
Module.prototype.deleteModule = function(options) {



}

// ------------------------------------------------
