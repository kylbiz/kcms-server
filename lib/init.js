//
// var CollectionDb = require("../collection/collection");
//
// var settings = require("../settings");
//
// var authSettings = settings.auth;
// var app_id = authSettings.app_id;
// var app_secret = authSettings.app_secret;
//
// var collectionLists = settings.collectionLists;
//
// var Util = require("../utils/util").Util;
// var util = new Util();
//
// // ------------------------------------------------
//
// function Init() {
// 	this.name = "Init";
// 	this.collectionDb = new CollectionDb();
// };
//
// exports.Init = Init;
//
// // ------------------------------------------------
// /**
//  * init create mongodb collection
//  */
// Init.prototype.initDb = function() {
//   util.log("initDb: Hi I am called.")
// 	var self = this;
//
//   collectionLists.forEach(function(collectionName) {
//   	var options = {
//   		app_id: app_id,
//   		app_secret: app_secret,
//   		collectionName: collectionName
//   	}
//
//   	self.collectionDb.createCollection(options)
// 			.then(function(results) {
// 				util.log("initDb: init db " + collectionName + " succeed.");
// 			})
// 			.catch(function(err) {
// 				util.logError("initDb: init db " + collectionName + " error", err);
// 			})
//   })
// }
//
// // ------------------------------------------------
