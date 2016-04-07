var NodeHandle = require('../lib/knode').NodeHandle;

var nodeClient = new NodeHandle();

var authSettings = require("../settings").auth;
var app_id = authSettings.app_id;
var app_secret = authSettings.app_secret;

var hostDomain = "kyl.biz";


var CollectionDb = require("../collection/collection");
var collectionDb = new CollectionDb();


var Util = require("../utils/util").Util;
var util = new Util();

var log = util.log;

// ------------------------------------------------

var testCreateNode =	 function (nodeName, fatherNodeId) {
	var nodeOptions = {
		app_id: app_id,
		app_secret: app_secret,
		hostDomain: hostDomain,
		nodeName: nodeName,
	}

	if(fatherNodeId) {
		nodeOptions.fatherNodeId = fatherNodeId;
	}
	nodeClient.createNode(nodeOptions)
		.then(function(results) {
			log("createNode: this handle succeed.");
		})
		.catch(function(err) {
			log("createNode: this handle error.", err);
		})
}

var nodeLists = ["user",
		"userdoc",
		"userAddress",
		"userGrade"
	]

// nodeLists.forEach(function(nodeName) {
// 	testCreateNode(nodeName);
// })



// -------------------------------------------

// collectionDb.findOne({
// 	app_id: app_id,
// 	app_secret: app_secret,
// 	hostDomain: hostDomain,
// 	collectionName: "NodeMap",
// 	query: {
// 		hostDomain: hostDomain,
// 		nodeName: "user"
// 	}
// })
// .then(function(results) {
// 	var nodeId = results.nodeId;
//
// 	var userArticleOptions = {
// 		app_id: app_id,
// 		app_secret: app_secret,
// 		hostDomain: hostDomain,
// 		collectionName: "Node",
// 		nodeName: "userArticle",
// 		fatherNodeId: nodeId
// 	}
//
// 	nodeClient.createNode(userArticleOptions)
//
// })


// ------------------------------------------------

function testUpdateNode(nodeName) {
	var updateOptions = {
		app_id: app_id,
		app_secret: app_secret,
		hostDomain: hostDomain,
		nodeName: nodeName,
		selector: {
			nodeName: nodeName
		},
		document: {
			$set: {
				nodeCnName: nodeName + " collection"
			}
		}
	}

	nodeClient.updateNodeByName(updateOptions)
		.then(function(results) {
			log("Test: update node " + nodeName + " succeed");
		})
		.catch(function(err) {
			log("Test: update node " + nodeName + " error", err);
		})

}

var nodeName = "user";

// testUpdateNode(nodeName)


// ------------------------------------------------


var testLinkNode = function() {
	collectionDb.findOne({
		app_id: app_id,
		app_secret: app_secret,
		hostDomain: hostDomain,
		collectionName: "NodeMap",
		query: {
			hostDomain: hostDomain,
			nodeName: "user"
		}
	})
	.then(function(results) {
		var fatherNodeId = results.nodeId;

		var userAddressOptions = {
			app_id: app_id,
			app_secret: app_secret,
			hostDomain: hostDomain,
			collectionName: "NodeMap",
			nodeName: "userAddress",
			query: {
				hostDomain: hostDomain,
				nodeName: "userAddress"
			}
		}
		collectionDb.findOne(userAddressOptions)
			.then(function(results) {
				var sonNodeId = results.nodeId;

				var options = {
					hostDomain: hostDomain,
					fatherNodeId: fatherNodeId,
					sonNodeId: sonNodeId,
					app_id: app_id,
					app_secret: app_secret
				}
				nodeClient.linkNode(options)
					.then(function(results) {
						log("linkNode succeed");
					})
					.catch(function(err) {
						log("linkNode error.", err);
					})
			})
			.catch(function(err) {
				log(err);
			})

	})
	.catch(function(err) {
		log(err);
	})
}

testLinkNode()

// ------------------------------------------------
