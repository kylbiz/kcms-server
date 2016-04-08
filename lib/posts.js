var Promise = require("bludbird");

var CollectionDb = require("../collection/collection");

var NodeHandle = require('./knode').NodeHandle;


var settings = require("../settings");

var authSettings = settings.auth;
var app_id = authSettings.app_id;
var app_secret = authSettings.app_secret;

var khostDomain = settings.domain.hostDomain;

var kvalueDb = settings.collection.kvalue;

var postType = settings.classType.post;

var Util = require("../utils/util").Util;
var util = new Util();

var log = util.log;
var logError = util.logError;
var auth = util.auth;


// ------------------------------------------------
function Posts() {
	this.name = "Posts";
	this.collectionDb = new CollectionDb();
	this.nodeClient = new NodeHandle();
}

exports.Host = Posts;
// ------------------------------------------------
/**
 * verify if posts object is legal object
 * @param {json} contains data fields that at least has the following properties
 * @property title
 * @property content
 */
Posts.prototype._verifyPostData = function(options) {
  if(!util.isJson(options)
    || !util.isJson(options.data)
    || hasOwnProperty.call(options, "data")
    || !util.isJson(options.data)
    || !hasOwnProperty.call(options, "title")
    || typeof(options.title) !== "string"
    || !hasOwnProperty("content")
    || typeof(options.content) !== "string") {
      return false;
    } else {
      return true;
    }
}

// ------------------------------------------------
/**
 * get nodeId hanldle
 * @param {json} options that contains the foloowing properties
 * @property app_id
 * @property app_secret
 * @property hostDomain
 * @property fatherNodeId  fatehr node id that will handle
 * @property createUserId
 * @property description
 */
Posts.prototype._handleNode = function(options) {
  log("_handleNode: Hi I am called.");
	var self = this;
	return new Promise(function(resolve, reject) {
		if(!util.auth(options)
			|| !hasOwnProperty.call(options, "hostDomain")
      || typeof(options.nodeId) !== "string"
			|| !hasOwnProperty.call(options, "nodeName")
      || typeof(options.nodeName) !== "string") {
			var errorStr = "_handleNode: options illegal.";
			logError(errorStr, options);
			reject(errorStr);

		} else {
      var app_id = options.app_id;
      var app_secret = options.app_secret;
			var nodeName = options.nodeName;

			var nodeOptions = {
				app_id: app_id,
				app_secret: app_secret,
				nodeName: nodeName,
				hostDomain: hostDomain
			}

			if(hasOwnProperty.call(options, "fatherNodeId")
				&& typeof(options.fatherNodeId) === "string") {
				nodeOptions.fatherNodeId = fatherNodeId;
			}

			if(hasOwnProperty.call(options, "createUserId")
				&& typeof(options.createUserId) === "string") {
				nodeOptions.createUserId = createUserId;
			}

			if(hasOwnProperty.call(options, "description")
				&& typeof(options.description) === "string") {
				nodeOptions.description = description;
			} else {
				nodeOptions.description = nodeName;
			}

			self.nodeClient.createNode(nodeOptions)
				.then(function(results) {
					log("_handleNode: create node " + nodeName + " succeed.");
					resolve(results);
				})
				.catch(function(err) {
					logError("_handleNode: create node " + nodeName + " error.");
					reject(err);
				})

		}
	})
}

// ------------------------------------------------
/**
 * create post function
 * @param {json} options that contains the following properties
 * @property  {string} app_id
 * @property  {string} app_secret
 * @property  {string} hostDomain
 * @property  {string} kVName value name about this nodeId
 * @property post object shall have title and content properties
 * @return {Promise} if succeed return {nodeId: nodeId}
 */
Posts.prototype.createPost = function(options) {
  log("createPost: Hi I am called.");
	var self = this;

	return new Promise(function(resolve, reject) {
		if(!util.auth(options)
			|| !hasOwnProperty.call(options, "typeId")
			|| typeof(options.typeId) !== "string"
			|| !hasOwnProperty.call(options, "hostDomain")
      || typeof(options.hostDomain) !== khostDomain
			|| !hasOwnProperty.call(options, "kVName")
      || typeof(options.kVName) !== "string"
      || !self._verifyPostData(options)) {
			var errorStr = "createPost: options illegal.";
			logError(errorStr, options);
			reject(errorStr);

		} else {
      var app_id = options.app_id;
      var app_secret = options.app_secret;
      var hostDomain = options.hostDomain;
			var typeId = options.typeId;
			var kVName = options.kVName;
      var data = options.data;

      var subtitle = "";
      var summary = "";
      var tags = [];
			var createUserId = "admin";

      var readTimes = 0;
      var postImgs = [];

			var post = {
				title: data.title,
				content: data.content,
				createTime: new Date(),
				updateTime: new Date()
			}

			if(!hasOwnProperty.call(data, "subtitle")) {
				subtitle = data.subtitle;
			}

			if(!hasOwnProperty.call(data, "summary")) {
				summary = data.summary;
			}

			if(!hasOwnProperty.call(data, "tags")
			&& data.tags instanceof Array) {
				tags = data.tags;
			}

			if(!hasOwnProperty.call(data, "createUserId")) {
				createUserId = data.createUserId;
			}

			if(!hasOwnProperty.call(data, "postImgs")
			&& data.postImgs instanceof Array) {
				postImgs = data.postImgs;
			}

			post.subtitle = subtitle;
			post.summary = summary;
			post.tags = tags;
			post.createUserId = createUserId;
			post.readTimes = readTimes;
			post.postImgs = postImgs;

			var kvalueOptions = {
				app_id: app_id,
				app_secret: app_secret,
				hostDomain: hostDomain,
				collectionName: kvalueDb,
				data: {
					typeId: typeId,
					kVName: kVName,
					classType: postType,
					data: post
				}
			}

			var nodeOptions = {
				app_id: app_id,
				app_secret: app_secret,
				nodeName: kVName,
				hostDomain: hostDomain
			}

			if(hasOwnProperty.call(options, "fatherNodeId")
				&& typeof(options.fatherNodeId) === "string") {
				nodeOptions.fatherNodeId = fatherNodeId;
			}

			if(hasOwnProperty.call(options, "createUserId")
				&& typeof(options.createUserId) === "string") {
				nodeOptions.createUserId = createUserId;
			}

			if(hasOwnProperty.call(options, "description")
				&& typeof(options.description) === "string") {
				nodeOptions.description = description;
			}

			self._handleNode(nodeOptions)
				.then(function(results) {
					log("createPost: get nodeId for " + kVName + " succeed.");

					var nodeId = results.nodeId;
					kvalueOptions.data.nodeId = nodeId;

					self.collectionDb.insertOne(kvalueOptions)
					.then(function(results) {
						log("createPost: create post " + kVName + " succeed.");
						resolve({nodeId: nodeId});
					})
					.catch(function(err) {
						logError("createPost: create post " + kVName + " error.", err);
						reject(err);
					})
				})
				.catch(function(err) {
					logError("createPost: create post " + kVName + " error.");
					reject(err);
				})
		})
  })
}

// ------------------------------------------------

/**
 * update post function
 * @param {json} options that contains the following properties
 * @property {string} app_id
 * @property {string} app_secret
 * @property {string} hostDomain
 * @property {string} nodeId  map to the post
 * @property {json} post that will updated
 * @return {Promise} handle results
 */
Posts.prototype.updatePost = function(options) {
  log("updatePost: Hi I am called.");
	var self = this;

	return new Promise(function(resolve, reject) {
		if(!util.auth(options)
			|| !hasOwnProperty.call(options, "hostDomain")
      || typeof(options.hostDomain) !== khostDomain
			|| !hasOwnProperty.call(options, "nodeId")
      || typeof(options.nodeId) !== "string"
			|| !hasOwnProperty.call(options, "post")
			|| !util.isJson(options.post)) {
			var errorStr = "updatePost: options illegal.";
			logError(errorStr, options);
			reject(errorStr);

		} else {
      var app_id = options.app_id;
      var app_secret = options.app_secret;
      var hostDomain = options.hostDomain;

			var nodeId = options.nodeId;
			var document = options.document;

			var postOptions = {
				app_id: app_id,
				app_secret: app_secret,
				hostDomain: hostDomain,
				collectionName: kvalueDb,
				selector: {
					nodeId: nodeId
				},
				document: {
					$set: post
				},
				updateOptions: {
					multi: true
				}
			}

			self.collectionDb.update(postOptions)
				.then(function(results) {
					log("updatePost: update post " + nodeId + " succeed.");
					resolve(results);
				})
				.catch(function(err) {
					logError("updatePost: update post " + nodeId + " error.");
					reject(err);
				})
			}
	})
}

// ------------------------------------------------
/**
 * remove post function, this will not remove post data physicaly.
 * this will only remove nodeId from node tree
 * @param {json} options that contains the following properties
 * @property {string} app_id
 * @property {string} app_secret
 * @property {string} hostDomain
 * @property {string} nodeId  map to the post
 * @property {json} post that will updated
 * @return {Promise} handle results
 */

 Posts.prototype.removePost = function(options) {
   log("removePost: Hi I am called.");
 	var self = this;

 	return new Promise(function(resolve, reject) {
 		if(!util.auth(options)
 			|| !hasOwnProperty.call(options, "hostDomain")
      || typeof(options.hostDomain) !== khostDomain
 			|| !hasOwnProperty.call(options, "nodeId")
      || typeof(options.nodeId) !== "string") {
 			var errorStr = "removePost: options illegal.";
 			logError(errorStr, options);
 			reject(errorStr);

 		} else {
       var app_id = options.app_id;
       var app_secret = options.app_secret;
       var hostDomain = options.hostDomain;
			 var nodeId = options.nodeId;

			 var unlinkOptions = {
				 app_id: app_id,
				 app_secret: app_secret,
				 hostDomain: hostDomain,
				 nodeId: nodeId
			 }

			 self.nodeClient.unlinkNode(unlinkOptions)
			 	.then(function(results) {
					log("removePost: remove post " + nodeId + " succeed.");
					resolve(results);
				})
				.catch(function(err) {
					logError("removePost: remove post " + nodeId + " err.", err);
					reject(err);
				})
			}
		})
}

// ------------------------------------------------
