var Promise = require("bluebird");
var async = require('async');

var CollectionDb = require("../collection/collection");
var collectionDb = new CollectionDb();

var settings = require("../settings");

// server authorizing configuration
var authSettings = settings.auth;
var app_id = authSettings.app_id;
var app_secret = authSettings.app_secret;

// node host settings
var nodeHost = settings.nodeHost;
var tophost = nodeHost.tophost; // top host id for node
var virtualhost = nodeHost.virtualhost; // virtual host

// node collection settings
var nodeCollection = settings.collection.node;
var nodeListsDb = nodeCollection.nodeListsDb;
var nodeDb = nodeCollection.nodeDb;
var nodeMapDb = nodeCollection.nodeMapDb;

var Util = require("../utils/util").Util;
var util = new Util();

// print utils
var log = util.log;
var logError = util.logError;

// authorizing server handle util
var auth = util.auth;

var hasOwnProperty = Object.prototype.hasOwnProperty;

// ------------------------------------------------
function NodeHandle() {
	this.name = "NodeHandle";
	this.collectionDb = collectionDb;
}

exports.NodeHandle = NodeHandle;

// ------------------------------------------------
NodeHandle.prototype.handleFatherIds = function(options) {
	log("handleFatherIds: I am called.");
	var self = this;

	return new Promise(function(resolve, reject) {
		if(!util.auth(options)
			|| !hasOwnProperty.call(options, "fatherNodeId")
			|| !hasOwnProperty.call(options, "hostDomain")
			|| typeof(options.hostDomain) !== "string") {

			log("handleFatherIds: options illegal", options);

			reject(options);
		} else {

			var app_id = options.app_id;
			var app_secret = options.app_secret;
			var fatherNodeId = options.fatherNodeId;
			var hostDomain = options.hostDomain;

			var fatherLists = [];

			var findOptions = {
				app_id: app_id,
				app_secret: app_secret,
				collectionName: nodeMapDb,
				query: {
					hostDomain: hostDomain,
					nodeId: fatherNodeId
				}
			}

			self.collectionDb.findOne(findOptions)
				.then(function(results) {
					if(!results
						|| !hasOwnProperty.call(results, "nodeId")
						|| !(results.fatherLists instanceof Array)) {
						log("handleFatherIds: can not find nodeId: " + fatherNodeId);
						fatherLists = [{nodeId: virtualhost}];
					} else {

						fatherLists = results.fatherLists;
						fatherLists.push({nodeId: fatherNodeId});
					}
					resolve(fatherLists);
				})
				.catch(function(err) {
					logError("handleFatherIds: handle father node " + fatherNodeId + " error", err);
					reject(err);
				})

		}
	})
}


NodeHandle.prototype.createNode = function(options) {
	log("createNode: Hi I am called.");
	var self = this;

	return new Promise(function(resolve, reject) {
		if(!util.auth(options)
			|| !hasOwnProperty.call(options, "nodeName")
			|| typeof(options.nodeName) !== "string"
			|| !hasOwnProperty.call(options, "hostDomain")
			|| typeof(options.hostDomain) !== "string") {
			var errorStr = "createNode: options illegal.";

			logError(errorStr);
			reject(errorStr);

		} else {
			var nodeId = util.generateStr(false, 40);
			var nodeName = options.nodeName;
			var hostDomain = options.hostDomain;

			var description = "";
			var createUserId = "";
			var fatherLists = [];

			var authority = {
				"owner": "admin",
				"group": "admin"
			}
			var createTime = new Date();
			var updateTime = new Date();


			// init description
			if(hasOwnProperty.call(options, "description")
				&& typeof(options.description) === "string") {
				description = options.description;
			}

			// init createUserId
			if(hasOwnProperty.call(options, "createUserId")
				&& typeof(options.createUserId) === "string") {
				createUserId = options.createUserId;
			}

			// init fatherNodeId
			if(hasOwnProperty.call(options, "fatherNodeId")
				&& typeof(options.fatherNodeId) === "string") {
				fatherNodeId = options.fatherNodeId;
			} else {
				fatherNodeId = virtualhost;
			}

			var handleFatherOptions = {
				app_id: app_id,
				app_secret: app_secret,
				collectionName: nodeDb,
				hostDomain: hostDomain,
				fatherNodeId: fatherNodeId
			}


			// node options for collection node
			var nodeOptions = {
				app_id: app_id,
				app_secret: app_secret,
				collectionName: nodeDb,
				selector: {
					hostDomain: hostDomain,
					nodeName: nodeName
				},
				document: {
					$set: {
						nodeId: nodeId,
						nodeName: nodeName,
						isRemoved: false,
						createTime: createTime,
						updateTime: updateTime,
						authority: authority,
						hostDomain: hostDomain
					}
				},
				updateOptions: {
					upsert: true
				}
			}


			// node options for collection nodeMap
			var nodeMapOptions = {
				app_id: app_id,
				app_secret: app_secret,
				collectionName: nodeMapDb,
				selector: {
					hostDomain: hostDomain,
					nodeName: nodeName
				},
				document: {
					$set: {
						nodeId: nodeId,
						isRemoved: false,
						createTime: createTime,
						updateTime: updateTime,
						nodeName: nodeName,
						authority: authority,
						createUserId: createUserId
					}
				},
				updateOptions: {
					upsert: true,
					multi: true
				}
			}


			self.handleFatherIds(handleFatherOptions)
				.then(function(fatherLists) {
					nodeMapOptions.document.$set.fatherLists = fatherLists || [{nodeId: virtualhost}];

					self.collectionDb.update(nodeOptions)
						.then(function(results) {
							log("createNode: create node " + nodeName + " succeed.");
							return(results);
						})
						.then(function(results) {
								self.collectionDb.update(nodeMapOptions)
								.then(function(results) {
									log("createNode: create node map " + nodeName + " succeed.");
									resolve(results);
									return(results);
								})
						})
						.catch(function(err) {
							reject(err);
						})
				})
				.catch(function(err) {
					log("createNode: create node " + nodeName + " error.", err);
					reject(err);
				})
		}
	})

}

// ------------------------------------------------

NodeHandle.prototype.updateNodeByNodeId = function(options) {
	log("updateNodeByNodeId: Hi I am called.");
	var self = this;

	return new Promise(function(resolve, reject) {
		if(!util.auth(options)
			|| !hasOwnProperty.call(options, "nodeId")
			|| typeof(options.nodeId) !== "string"
			|| !hasOwnProperty.call(options, "hostDomain")
			|| typeof(options.hostDomain) !== "string"
			|| !hasOwnProperty.call(options, "document")
			|| !util.isJson(options.document)) {
			var errorStr = "updateNodeByNodeId: options illegal.";

			logError(errorStr, options);
			reject(errorStr);

		} else {

			var nodeId = options.nodeId;
			var hostDomain = options.hostDomain || self.defaultDomain;

			var document = options.document;

			if(!document.hasOwnProperty("$set")) {
				document["$set"] = {
					updateTime: new Date()
				}
			} else {
				document["$set"]["updateTime"] = new Date();
			}

			var app_id = options.app_id;
			var app_secret = options.app_secret;
			var collectionDb = nodeDb;

			var nodeUpdateOptions = {
				app_id: app_id,
				app_secret: app_secret,
				collectionDb: collectionDb,
				selector: {
					hostDomain: hostDomain,
					nodeId: nodeId
				},
				document: document
			}

			self.collectionDb.update(nodeUpdateOptions)
				.then(function(results) {
					log("updateNodeByNodeId: update node " + nodeId + " succeed.");
					resolve(results);
				})
				.catch(function(err) {
					log("updateNodeByNodeId: update node " + nodeId + " error.", err);
					reject(err);
				})
		}
	});
}


NodeHandle.prototype.updateNodeByName = function(options) {
	log("updateNodeByName: Hi I am called.");
	var self = this;

	return new Promise(function(resolve, reject) {
		if(!util.auth(options)
			|| !hasOwnProperty.call(options, "nodeName")
			|| typeof(options.nodeName) !== "string"
			|| !hasOwnProperty.call(options, "hostDomain")
			|| typeof(options.hostDomain) !== "string"
			|| !hasOwnProperty.call(options, "document")
			|| !util.isJson(options.document)) {

			var errorStr = "updateNodeByName: options illegal.";
			logError(errorStr, options);
			reject(errorStr);

		} else {

			var nodeName = options.nodeName;
			var hostDomain = options.hostDomain || self.defaultDomain;

			var document = options.document;

			if(!document.hasOwnProperty("$set")) {
				document["$set"] = {
					updateTime: new Date()
				}
			} else {
				document["$set"]["updateTime"] = new Date();
			}

			var app_id = options.app_id;
			var app_secret = options.app_secret;
			var collectionName = nodeDb;

			var nodeUpdateOptions = {
				app_id: app_id,
				app_secret: app_secret,
				collectionName: collectionName,
				selector: {
					hostDomain: hostDomain,
					nodeName: nodeName
				},
				document: document
			}
			log(nodeUpdateOptions)

			self.collectionDb.update(nodeUpdateOptions)
				.then(function(results) {
					log("updateNodeByName: update node " + nodeName + " succeed.");
					resolve(results);
				})
				.catch(function(err) {
					log("updateNodeByName: update node " + nodeName + " error.", err);
					reject(err);
				})
		}
	});
}



// ------------------------------------------------
/**
 * verify if exists node, pay attention this will contains tophost node
 * @param options node verifaction parameters, which contains
 * @property string app_id
 * @property string app_secret
 * @property nodeId
 * @property hostDomain
 * @property Promise return true if exists node
 */
NodeHandle.prototype.nodeExists = function(options) {
	log("nodeExists: Hi I am called.");
	var self = this;

	return new Promise(function(resolve, reject) {
		if(!util.auth(options)
			|| !hasOwnProperty.call(options, "hostDomain")
			|| typeof(options.hostDomain) !== "string"
			|| !hasOwnProperty.call(options, "nodeId")
			|| typeof(options.nodeId) !== "string") {
			var errorStr = "nodeExists: options illegal.";

			logError(errorStr, options);
			reject(errorStr);
		} else {
			var hostDomain = options.hostDomain;
			var app_id = options.app_id;
			var app_secret = options.app_secret;
			var nodeId = options.nodeId;

			var findOptions = {
				app_id: app_id,
				app_secret: app_secret,
				collectionName: nodeDb,
				query: {
					hostDomain: hostDomain,
					nodeId: nodeId
				}
			}

			self.collectionDb.find(findOptions)
				.then(function(results) {
					if(results.length === 0) {
						log("nodeExists: not exists  nodeId: " + nodeId)
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
 * @property {string} sonNodeId
 * @property {string} fatherNodeId
 * @return {Promise} true if exists
 */

// TODO： this function about verifing if has digraph circuit has errors.
NodeHandle.prototype.hasDigraphCircuit = function(options) {
	var self = this;
	return new Promise(function(resolve, reject) {
		if(!util.auth(options)
			|| !hasOwnProperty.call(options, "hostDomain")
			|| typeof(options.hostDomain) !== "string"
			|| !hasOwnProperty.call(options, "fatherNodeId")
			|| typeof(options.fatherNodeId) !== "     "
			|| !hasOwnProperty.call(options, "sonNodeId")
			|| typeof(options.sonNodeId) !== "string") {
			var errorStr = "linkNode: options illegal.";

			logError(errorStr);
			reject(errorStr);
		} else {
			var sonNodeId = options.sonNodeId;
			var fatherNodeId = options.fatherNodeId;

			function verifyCircuit(fatherNodeId, sonNodeId) {
				if(fatherNodeId === tophost) {
					resolve(false);
				} else {
					self.collectionDb.findOne({nodeId: fatherNodeId})
					.then(function(results) {
						if(results
						&& hasOwnProperty.call(results, "fatherNodeId")
						&& results.fatherNodeId === sonNodeId) {
							resolve(true);
						} else {
							setImmediate(verifyCircuit, results.fatherNodeId, sonNodeId);
						}
					})
				}
			}
			verifyCircuit(fatherNodeId, sonNodeId);
		}
	});
}


// ------------------------------------------------
/**
 * link two nodes together, for if not assignments fatherNodeId
 * when creating node , the node will has "tophost" fatherNodeId
 *
 * @param {json} options , which contains the following properties
 * @property {string} app_id
 * @property {string} app_secret
 * @property {string} hostDomain hostDomain for the site
 * @property {string} fatherNodeId   node _id as father role
 * @property {string} sonNodeId node _id as son role
 * @return {Promise} handle results
 */

// ATTENTION ---------------------------------------------------------
// TODO: IT IS VERY INPORTANT TO VERIFY THE RIGHT TO LINK MODULE
// TRY TO REFER TO THE DOC FOR DETAIL HELP.
// NOW , IT WILL ASSUME ALL THE TREE ABOUT MODULES ARE RIGHT TREE NODE.
// HOWEVER, IT SHALL SOLVE THIS PROBLEM LATER.
// ATTENTION ---------------------------------------------------------

NodeHandle.prototype.linkNode = function(options) {
	log("linkNode: Hi I am called.");
	var self = this;

	return new Promise(function(resolve, reject) {
		if(!util.auth(options)
			|| !hasOwnProperty.call(options, "hostDomain")
			|| typeof(options.hostDomain) !== "string"
			|| !hasOwnProperty.call(options, "fatherNodeId")
			|| typeof(options.fatherNodeId) !== "string"
			|| !hasOwnProperty.call(options, "sonNodeId")
			|| typeof(options.sonNodeId) !== "string") {
			var errorStr = "linkNode: options illegal.";

			logError(errorStr);
			reject(errorStr);
		} else {
			var hostDomain = options.hostDomain;
			var fatherNodeId = options.fatherNodeId;
			var sonNodeId = options.sonNodeId;

			var handleFatherOptions = {
				app_id: app_id,
				app_secret: app_secret,
				collectionName: nodeDb,
				hostDomain: hostDomain,
				fatherNodeId: fatherNodeId
			}

			// link node options
			var linkOptions = {
				app_id: app_id,
				app_secret: app_secret,
				collectionName: nodeMapDb,
				selector: {
					hostDomain: hostDomain,
					nodeId: sonNodeId
				},
				document: {
					$set: {
						updateTime: new Date()
					}
				},
				updateOptions: {
					upsert: true,
					multi: true
				}
			}

			self.handleFatherIds(handleFatherOptions)
				.then(function(fatherLists) {

				linkOptions.document.$set.fatherLists = fatherLists || [{nodeId: virtualhost}];

				self.collectionDb.update(linkOptions)
					.then(function(results) {
						log("linkNode: link node " + sonNodeId + " to node " + fatherNodeId + " succeed.")
						resolve(results);
					})
					.then(function(results) {
						var syncOptions = {
							app_id: app_id,
							app_secret: app_secret,
							hostDomain: hostDomain,
							nodeId: sonNodeId,
							fatherLists: fatherLists || [{nodeId: virtualhost}]
						}

						self.syncNode(syncOptions)
					})
					.catch(function(err) {
						reject(err);
					})
				})
				.catch(function(err) {
					logError("linkNode: link node " + sonNodeId + " to node " + fatherNodeId + " error.");
					reject(err);
				})

		}
	});
}

// ------------------------------------------------
/**
 * unlink two nodes, this is the opporite handle about linkNode
 * if the fatherNodeId is "tophost", then remove the node ,and then
 * link this node to virtualTop
 * @param {json} options , which contains the following properties
 * @property {string} app_id
 * @property {string} app_secret
 * @property {string} hostDomain hostDomain for the site
 * @property {string} nodeId will unlink this node from father node
 * @return {Promise} handle results
 */
NodeHandle.prototype.unlinkNode = function(options) {
	log("unlinkNode: Hi I am called.");
	var self = this;

	return new Promise(function(resolve, reject) {
		if(!util.auth(options)
			|| !hasOwnProperty.call(options, "hostDomain")
			|| typeof(options.hostDomain) !== "string"
			|| !hasOwnProperty.call(options, "nodeId")
			|| typeof(options.sonNodeId) !== "string") {
			var errorStr = "unlinkNode: options illegal.";

			logError(errorStr);
			reject(errorStr);
		} else {
			var hostDomain = options.hostDomain;
			var nodeId = options.nodeId;

			var app_id = options.app_id;
			var app_secret = options.app_secret;

			var unlinkOptions = {
				app_id: app_id,
				app_secret: app_secret,
				hostDomain: hostDomain,
				collectionName: nodeMapDb,
				selector: {
					nodeId: nodeId,
					hostDomain: hostDomain
				},
				updateOptions: {
					fatherNodeId: virtualhost,
					isRemoved: true
				}
			}

			self.collectionDb.update(unlinkOptions)
				.then(function(results) {
					log("unlinkNode: unlink node succeed.");
					resolve(results);
				})
				.catch(function(err) {
					log("unlinkNode: unlink node error.", err);
					reject(err);
				})
		}

	})
}


// ------------------------------------------------
/**
 * sync sons about node when link nodes handling
 * options contaions the following properties
 * @property {string} hostDomain
 * @property {string} nodeId the node that linked to the father node
 * @property {Array} fatherLists , which will replace the son nodes whth fatherLists
 * @property {string} app_id
 * @property {string} app_secret
 *
 */
NodeHandle.prototype.syncNode = function(options) {
	log("syncNode: Hi I am called.");
	var self = this;
	if(!util.auth(options)
		|| !hasOwnProperty.call(options, "hostDomain")
		|| typeof(options.hostDomain) !== "string"
		|| !hasOwnProperty.call(options, "nodeId")
		|| typeof(options.nodeId) !== "string"
		|| !hasOwnProperty.call(options, "fatherLists")
		|| !(options.fatherLists instanceof Array)) {
		var errorStr = "syncNode: options illegal.";
		log(errorStr);
		logError(errorStr);
	} else {
		var hostDomain = options.hostDomain;
		var nodeId = options.nodeId;

		var app_id = options.app_id;
		var app_secret = options.app_secret;
		var fatherLists = options.fatherLists;

		var findSonsOptions = {
			app_id: app_id,
			app_secret: app_secret,
			hostDomain: hostDomain,
			collectionName: nodeMapDb,
			query: {
				"fatherLists.nodeId": nodeId
			}
		}

		self.collectionDb.find(findSonsOptions)
			.then(function(results) {

				async.each(results,
					function(result, done) {
						if(!result.hasOwnProperty("fatherLists")
							|| !result.fatherLists instanceof Array) {
								done();
							} else {
								var index = result.fatherLists.findIndex(function(e, i){
									if(!e
										|| !hasOwnProperty.call(e, "nodeId")
										|| e.nodeId !== nodeId) {
											log(false)
											return false;
										} else {
											log(true)
											return true;
										}
									})
									var lists2Point = result.fatherLists.slice(index);
									var lists = fatherLists.concat(lists2Point)
									var updateOptions = {
										app_id: app_id,
										app_secret: app_secret,
										hostDomain: hostDomain,
										collectionName: nodeMapDb,
										selector: {
											nodeId: result.nodeId
										},
										document: {
											$set: {
												fatherLists: lists
											}
										}
									}
									self.collectionDb.update(updateOptions)
									.then(function(results) {
										log("syncNode: sync node " + result.nodeId + "  succeed.")
										done();
									})
									.catch(function(err) {
										log("syncNode: sync node " + result.nodeId + "  error.", err);
										done(err);
									})
							}

					}, function(err) {
						if(err) {
							log("syncNode: sycn node error", err);
						}
					})
			})
	}
}

// ------------------------------------------------
/**
 * remove node from the system, you should be careful for using this api
 * @param  {json} options , that contaions the following properties
 * @property {string} app_id
 * @property {string} app_secret
 * @property {string} nodeId node id that represents the node to be removed.
 * @property {Boolean}  handleSons if true, will remove all son node
 * @return {Promise} handle results
 */
NodeHandle.prototype.removeNode = function(options) {
	log("unlinkNode: Hi I am called.");
	var self = this;

	return new Promise(function(resolve, reject) {
		if(!util.auth(options)
			|| !hasOwnProperty.call(options, "hostDomain")
			|| typeof(options.hostDomain) !== "string"
			|| !hasOwnProperty.call(options, "nodeId")
			|| typeof(options.sonNodeId) !== "string") {
			var errorStr = "removeNode: options illegal.";

			logError(errorStr);
			reject(errorStr);
		} else {
			var hostDomain = options.hostDomain;
			var nodeId = options.nodeId;

			var app_id = options.app_id;
			var app_secret = options.app_secret;

			var removeOptions = {
				app_id: app_id,
				app_secret: app_secret,
				collectionName: nodeListsDb,
				selector: {
					hostDomain: hostDomain,
					nodeId: nodeId
				}
			}

			self.collectionDb.remove(removeOptions)
				.then(function(results) {
					log("removeNode: remove node " + nodeId + " scceed");
					resolve(results);
				})
				.catch(function(err) {
					logError("removeNode: remove node " + nodeId + "  error", err);
					reject(err);
				})

		}
	})
}

// ------------------------------------------------
