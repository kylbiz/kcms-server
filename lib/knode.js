var Promise = require("bluebird");
var async = require('async');

var CollectionDb = require("../collection/collection");
var collectionDb = new CollectionDb();

var settings = require("../settings");

// node host settings
var nodeHost = settings.nodeHost;
var tophost = nodeHost.tophost; // top host id for node
var virtualhost = nodeHost.virtualhost; // virtual host

// node collection settings
var nodeCollection = settings.collection.node;
var nodeDb = nodeCollection.nodeDb;
var nodeMapDb = nodeCollection.nodeMapDb;

var kvalueDb = settings.collection.kvalue;

var Util = require("../utils/util").Util;
var util = new Util();

// print utils
var log = util.log;
var logError = util.logError;

var hasOwnProperty = Object.prototype.hasOwnProperty;

// ------------------------------------------------
function NodeHandle() {
	this.name = "NodeHandle";
	this.collectionDb = collectionDb;
}

exports.NodeHandle = NodeHandle;

// ------------------------------------------------
/**
 * get father node id lists
 * @property hostDomain
 * @property fatherNodeId
 * @return {Promise} fatherLists
 */
NodeHandle.prototype.handleFatherIds = function(options) {
	log("handleFatherIds: I am called.");
	var self = this;

	return new Promise(function(resolve, reject) {
		if(!hasOwnProperty.call(options, "fatherNodeId")
			|| !hasOwnProperty.call(options, "hostDomain")) {

			log("handleFatherIds: options illegal", options);

			reject(options);
		} else {
			var fatherNodeId = options.fatherNodeId;
			var hostDomain = options.hostDomain;

			var fatherLists = [];

			var findOptions = {
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

// ------------------------------------------------
/**
 * create node function
 * @param {json} options that contains the following properties
 * @property hostDomain
 * @property fatherNodeId fatehr node id that will handle
 * @property createUserId
 * @property description
 */
NodeHandle.prototype.createNode = function(options) {
	log("createNode: Hi I am called.");
	var self = this;

	return new Promise(function(resolve, reject) {
		if(!hasOwnProperty.call(options, "nodeName")
			|| typeof(options.nodeName) !== "string"
			|| !hasOwnProperty.call(options, "hostDomain")) {
			var errorStr = "createNode: options illegal.";

			logError(errorStr, options);
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
				collectionName: nodeDb,
				hostDomain: hostDomain,
				fatherNodeId: fatherNodeId
			}


			// node options for collection node
			var nodeOptions = {
				collectionName: nodeDb,
				selector: {
					hostDomain: hostDomain,
					nodeId: nodeId
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
					upsert: true,
					multi: true
				}
			}

			// node options for collection nodeMap
			var nodeMapOptions = {
				collectionName: nodeMapDb,
				selector: {
					hostDomain: hostDomain,
					nodeId: nodeId
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
									resolve({nodeId: nodeId});
									return({nodeId: nodeId});
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
/**
 * update node information by nodeId
 * @param  {json} options objec that contains the following proprities
 * @property {string} nodeId for verify node object
 * @property {string} hostDomain for host authorization
 * @property {json} document document that will update
 * @return {Promise} handle results
 */
NodeHandle.prototype.updateNodeByNodeId = function(options) {
	log("updateNodeByNodeId: Hi I am called.");
	var self = this;

	return new Promise(function(resolve, reject) {
		if(!hasOwnProperty.call(options, "nodeId")
			|| typeof(options.nodeId) !== "string"
			|| !hasOwnProperty.call(options, "hostDomain")
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

			var collectionDb = nodeDb;

			var nodeUpdateOptions = {
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

// ------------------------------------------------
/**
 * update node information by nodeName
 * @param  {json} options objec that contains the following proprities
 * @property {string} nodeName for verify node object
 * @property {string} hostDomain for host authorization
 * @property {json} document document that will update
 * @return {Promise} handle results
 */

NodeHandle.prototype.updateNodeByName = function(options) {
	log("updateNodeByName: Hi I am called.");
	var self = this;

	return new Promise(function(resolve, reject) {
		if(!hasOwnProperty.call(options, "nodeName")
			|| typeof(options.nodeName) !== "string"
			|| !hasOwnProperty.call(options, "hostDomain")
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

			var collectionName = nodeDb;

			var nodeUpdateOptions = {
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
 * @property string nodeId
 * @property string hostDomain
 * @property Promise return true if exists node
 */
// NodeHandle.prototype.nodeExists = function(options) {
// 	log("nodeExists: Hi I am called.");
// 	var self = this;
//
// 	return new Promise(function(resolve, reject) {
// 		if(!hasOwnProperty.call(options, "hostDomain")
// 			|| !hasOwnProperty.call(options, "nodeId")
// 			|| typeof(options.nodeId) !== "string") {
// 			var errorStr = "nodeExists: options illegal.";
//
// 			logError(errorStr, options);
// 			reject(errorStr);
// 		} else {
// 			var hostDomain = options.hostDomain;
// 			var nodeId = options.nodeId;
//
// 			var findOptions = {
// 				collectionName: nodeDb,
// 				query: {
// 					hostDomain: hostDomain,
// 					nodeId: nodeId
// 				}
// 			}
//
// 			self.collectionDb.find(findOptions)
// 				.then(function(results) {
// 					if(results.length === 0) {
// 						log("nodeExists: not exists  nodeId: " + nodeId)
// 						resolve(false);
// 					} else {
// 						resolve(true);
// 					}
// 				})
// 		}
// 	});
// }

/**
 * verify if a digraph has circuit when link to a tree point
 * @param options , which contains:
 * @property {string} sonNodeId
 * @property {string} fatherNodeId
 * @return {Promise} true if exists
 */

// TODO： this function about verifing if has digraph circuit has errors.
// NodeHandle.prototype.hasDigraphCircuit = function(options) {
// 	var self = this;
// 	return new Promise(function(resolve, reject) {
// 		if( !hasOwnProperty.call(options, "hostDomain")
// 			|| !hasOwnProperty.call(options, "fatherNodeId")
// 			|| typeof(options.fatherNodeId) !== "     "
// 			|| !hasOwnProperty.call(options, "sonNodeId")
// 			|| typeof(options.sonNodeId) !== "string") {
// 			var errorStr = "hasDigraphCircuit: options illegal.";
//
// 			logError(errorStr);
// 			reject(errorStr);
// 		} else {
// 			var sonNodeId = options.sonNodeId;
// 			var fatherNodeId = options.fatherNodeId;
//
// 			function verifyCircuit(fatherNodeId, sonNodeId) {
// 				if(fatherNodeId === tophost) {
// 					resolve(false);
// 				} else {
// 					self.collectionDb.findOne({nodeId: fatherNodeId})
// 					.then(function(results) {
// 						if(results
// 						&& hasOwnProperty.call(results, "fatherNodeId")
// 						&& results.fatherNodeId === sonNodeId) {
// 							resolve(true);
// 						} else {
// 							setImmediate(verifyCircuit, results.fatherNodeId, sonNodeId);
// 						}
// 					})
// 				}
// 			}
// 			verifyCircuit(fatherNodeId, sonNodeId);
// 		}
// 	});
// }


// ------------------------------------------------
/**
 * link two nodes together, for if not assignments fatherNodeId
 * when creating node , the node will has "tophost" fatherNodeId
 *
 * @param {json} options , which contains the following properties
 * @property {string} hostDomain hostDomain for the site
 * @property {string} fatherNodeId   node _id as father role
 * @property {string} sonNodeId node _id as son role
 * @return {Promise} handle results
 */


NodeHandle.prototype.linkNode = function(options) {
	log("linkNode: Hi I am called.");
	var self = this;

	return new Promise(function(resolve, reject) {
		if(!hasOwnProperty.call(options, "hostDomain")
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
				collectionName: nodeDb,
				hostDomain: hostDomain,
				fatherNodeId: fatherNodeId
			}

			// link node options
			var linkOptions = {
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
 * @property {string} hostDomain hostDomain for the site
 * @property {string} nodeId will unlink this node from father node
 * @return {Promise} handle results
 */
NodeHandle.prototype.unlinkNode = function(options) {
	log("unlinkNode: Hi I am called.");
	var self = this;

	return new Promise(function(resolve, reject) {
		if(!hasOwnProperty.call(options, "hostDomain")
			|| !hasOwnProperty.call(options, "nodeId")
			|| typeof(options.nodeId) !== "string") {
			var errorStr = "unlinkNode: options illegal.";
			logError(errorStr, options);
			reject(errorStr);
		} else {
			var hostDomain = options.hostDomain;
			var nodeId = options.nodeId;

			var unlinkOptions = {
				collectionName: nodeMapDb,
				selector: {
					hostDomain: hostDomain,
					nodeId: nodeId
				},
				document: {
					$set: {
						fatherLists: [{nodeId: virtualhost}],
						isRemoved: true
					}
				}
			}

			var unlinkSyncOptions = {
				hostDomain: hostDomain,
				nodeId: nodeId,
				fatherLists: [
					{
						nodeId: virtualhost
					}
				]
			}

			self.collectionDb.update(unlinkOptions)
				.then(function(results) {
					log("unlinkNode: unlink node " + nodeId + " succeed.");
					resolve(results);

					// sync link node after unlink handling
					self.syncNode(unlinkSyncOptions);
				})
				.catch(function(err) {
					log("unlinkNode: unlink node " + nodeId + " error.", err);
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
 *
 */
NodeHandle.prototype.syncNode = function(options) {
	log("syncNode: Hi I am called.");
	var self = this;
	if(!hasOwnProperty.call(options, "hostDomain")
		|| !hasOwnProperty.call(options, "nodeId")
		|| typeof(options.nodeId) !== "string"
		|| !hasOwnProperty.call(options, "fatherLists")
		|| !(options.fatherLists instanceof Array)) {
		var errorStr = "syncNode: options illegal.";
		logError(errorStr);
	} else {
		var hostDomain = options.hostDomain;
		var nodeId = options.nodeId;

		var fatherLists = options.fatherLists;

		var findSonsOptions = {
			collectionName: nodeMapDb,
			query: {
				hostDomain: hostDomain,
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
										collectionName: nodeMapDb,
										selector: {
											hostDomain: hostDomain,
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
 * @property {string} nodeId node id that represents the node to be removed.
 * @property {Boolean}  handleSons if true, will remove all son node
 * @return {Promise} handle results
 */
NodeHandle.prototype.removeNode = function(options) {
	log("removeNode: Hi I am called.");
	var self = this;

	return new Promise(function(resolve, reject) {
		if(!hasOwnProperty.call(options, "hostDomain")
			|| !hasOwnProperty.call(options, "nodeId")
			|| typeof(options.nodeId) !== "string") {
			var errorStr = "removeNode: options illegal.";

			logError(errorStr);
			reject(errorStr);
		} else {
			var hostDomain = options.hostDomain;
			var nodeId = options.nodeId;

			var removeOptions = {
				collectionName: nodeMapDb,
				selector: {
					$or: [
						{
							hostDomain: hostDomain,
							"fatherLists.nodeId": nodeId
						},
						{
							hostDomain: hostDomain,
							nodeId: nodeId
						}
					]
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
/**
 *  copy node and link it to another node if current node does not has son nodes
 * @param  {json} options , that contaions the following properties
 * @property {string} sonNodeId son node id
 * @property {string} fatherNodeId father node id s
 * @return {Promise} handle results
 */

NodeHandle.prototype.copyNode = function(options) {
	log("copyNode: Hi I am called.");
	var self = this;

	return new Promise(function(resolve, reject) {
		if(!hasOwnProperty.call(options, "hostDomain")
			|| !hasOwnProperty.call(options, "fatherNodeId")
			|| typeof(options.fatherNodeId) !== "string"
			|| !hasOwnProperty.call(options, "sonNodeId")
			|| typeof(options.sonNodeId) !== "string") {
			var errorStr = "copyNode: options illegal.";

			logError(errorStr);
			reject(errorStr);
		} else {
			var hostDomain = options.hostDomain;
			var fatherNodeId = options.fatherNodeId;
			var sonNodeId = options.sonNodeId;

			var newNodeId = util.generateStr(false, 40);

			var findNodeOptions = {
				collectionName: nodeDb,
				query: {
					nodeId: sonNodeId,
					hostDomain: hostDomain
				}
			}

			var existsSonsOptions = {
				collectionName: nodeMapDb,
				query: {
					hostDomain: hostDomain,
					"fatherLists.nodeId": sonNodeId
				}
			}

			self.collectionDb.findOne(existsSonsOptions)
				.then(function(results) {
					if(results) {
						errStr = "copyNode: exists sons for sonNodeId " + sonNodeId + " , forbidden copying.";
						logError(errStr);
						reject(errStr);
					} else {
						self.collectionDb.findOne(findNodeOptions)
						.then(function(results) {
							if(!results) {
								errStr = "copyNode: not exists node " + sonNodeId;
								logError(errStr);
								reject(errStr);
							} else {
								results.nodeId = newNodeId;
								delete results["_id"];

								var insertOptions = {
									collectionName: nodeDb,
									data: results
								}

								self.collectionDb.insertOne(insertOptions)
								.then(function(results) {
									var linkOptions = {
										hostDomain: hostDomain,
										fatherNodeId: fatherNodeId,
										sonNodeId: newNodeId
									}

									util.log(linkOptions)
									self.linkNode(linkOptions)
									.then(function(results) {

										var syncKvOptions = {
											hostDomain: hostDomain,
											nodeId: sonNodeId,
											newNodeId: newNodeId
										}

										self.syncKValue(syncKvOptions)
											.then(function(results) {
												log("copyNode: copy node " + newNodeId + " to node " + fatherNodeId + " succeed.");
												resolve(results);
											})
											.catch(function(err) {
												logError("copyNode: copy node " + sonNodeId + " to node " + fatherNodeId + " error.", err);
												reject(err);
											})
									})
									.catch(function(err) {
										logError("copyNode: copy node " + sonNodeId + " to node " + fatherNodeId + " error.", err);
										reject(err);
									})
								})
								.catch(function(err) {
									logError("copyNode: copy node error.", err);
									reject(err);
								})
							}
						})
						.catch(function(err) {
							logError("copyNode: find node " + sonNodeId + " error.");
							reject(err);
						})
					}
				})
				.catch(function(err) {
					log("copyNode: find sons about sonNodeId node error.", err)
					reject(err);
				})
		}
	})
}

// ------------------------------------------------
/**
 * sync copy node object about kvalueDb data
 * @param {string} hostDomain
 * @param {string} nodeId old node id represents data kvalueDb
 * @param {string} newNodeId node id that will replace old kvalueDb data
 */
NodeHandle.prototype.syncKValue = function(options) {
	log("syncKValue: Hi I am called.");
	var errStr = "";
	var self = this;

	return new Promise(function(resolve, reject) {
		if(!options
			|| !options.hasOwnProperty("hostDomain")
			|| !options.hasOwnProperty("nodeId")
			|| !options.hasOwnProperty("newNodeId")) {
				errStr = "syncKValue: options illegal.";
				logError(errStr);
				reject(errStr);
			} else {
				var nodeId = options.nodeId;
				var newNodeId = options.newNodeId;
				var hostDomain = options.hostDomain;

				var kvOptions = {
					collectionName: kvalueDb,
					query: {
						hostDomain: hostDomain,
						nodeId: nodeId
					}
				}

				self.collectionDb.findOne(kvOptions)
					.then(function(results) {
						if(!results) {
							errStr = "syncKValue: node " + nodeId + " not exists.";
							logError(errStr);
							reject(errStr);
						} else {

							results.nodeId = newNodeId;
							delete results["_id"];

							var insertOptions = {
								collectionName: kvalueDb,
								hostDomain: hostDomain,
								data: results
							}

							self.collectionDb.insertOne(insertOptions)
								.then(function(results) {
									log("syncKValue: copy one node " + nodeId + " succeed." );
									resolve(results);
								})
								.catch(function(err) {
									errStr = "syncKValue: copy one node " + nodeId + " error."
									logError(errStr, err);
									reject(err);
								})
						}
					})
					.catch(function(err) {
						logError("syncKValue: find node " + nodeId + " error.", err);
						reject(err);
					})
			}
	})
}

// ------------------------------------------------
