var NodeHandle = require('../lib/knode').NodeHandle;

var nodeClient = new NodeHandle();

var hostDomain = "kyl.biz";


var CollectionDb = require("../collection/collection");
var collectionDb = new CollectionDb();


var Util = require("../utils/util").Util;
var util = new Util();

var log = util.log;

// ------------------------------------------------

var testCreateNode =	 function (nodeName, fatherNodeId) {
	var nodeOptions = {
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
					sonNodeId: sonNodeId
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

// testLinkNode()

// ------------------------------------------------

var testUnlinkNode = function() {
	var unlinkOptions = {
		hostDomain: hostDomain,
		collectionName: "NodeMap",
		nodeName: "contry2",
		query: {
			hostDomain: hostDomain,
			nodeName: "contry2"
		}
	}
	collectionDb.findOne(unlinkOptions)
		.then(function(results) {
			var nodeId = results.nodeId;

			var options = {
				hostDomain: hostDomain,
				nodeId: nodeId
			}

			nodeClient.unlinkNode(options)
				.then(function(results) {
					log("unlinkNode: unlink node " + nodeId + " succeed.");
				})
				.catch(function(err) {
					log("unlinkNode: unlink node " + nodeId + " error", err);
				})


		})
		.catch(function(err) {
			log(err);
		})
}

// testUnlinkNode();

// ------------------------------------------------
var testRemoveNode = function() {
	var removeNodeOptions = {
		hostDomain: hostDomain,
		collectionName: "NodeMap",
		nodeName: "contry2",
		query: {
			hostDomain: hostDomain,
			nodeName: "contry2"
		}
	}
	collectionDb.findOne(removeNodeOptions)
		.then(function(results) {
			var nodeId = results.nodeId;

			var options = {
				hostDomain: hostDomain,
				nodeId: nodeId
			}

			nodeClient.removeNode(options)
				.then(function(results) {
					log("Test: remove node " + nodeId + " succeed.");
				})
				.catch(function(err) {
					log("Test: remove node " + nodeId + " error.", err);
				})
		})
}

testRemoveNode();
// ------------------------------------------------
