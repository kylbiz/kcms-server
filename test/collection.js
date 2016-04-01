
var CollectionDb = require("../collection/collection");

var collectionDb = new CollectionDb();

var authSettings = require("../settings").auth;
var app_id = authSettings.app_id;
var app_secret = authSettings.app_secret;

var Util = require("../utils/util").Util;
var util = new Util();

var log = util.log;

// ------------------------------------------------
// test createCollection function

var collectionName1 = "CName1";

// var createOptions = {
// 	app_id: app_id,
// 	app_secret: app_secret,
// 	collectionName: collectionName1
// };

// collectionDb.createCollection(createOptions)
// 	.then(function(result) {
// 		// console.log(result)
// 		log("Test: create collection " + collectionName1 + " succeed.");
// 	})
// 	.catch(function(err) {
// 		log("Test: create collection " + collectionName1 + " error.", err)
// 	})



// // ------------------------------------------------

var collectionName2 = "CName2";

// var renameOptions = {
// 	app_id: app_id,
// 	app_secret: app_secret,
// 	oldCollectionName: collectionName1,
// 	newCollectionName: collectionName2
// }

// collectionDb.renameCollection(renameOptions)
// 	.then(function(results) {
// 		log("Test: rename collection " + collectionName1 + " to name " + collectionName2 + " succeed.");
// 	})
// 	.catch(function(err) {
// 		log("Test: rename collection " + collectionName1 + " to name " + collectionName2 + " error.", err);
// 	})


// ------------------------------------------------

// var insertOptions = {
// 	app_id: app_id,
// 	app_secret: app_secret,
// 	collectionName: collectionName2,
// 	data: {
// 		test: "test" + Math.floor(Math.random() * 100)
// 	}
// }

// collectionDb.insertOne(insertOptions)
// 	.then(function(results) {
// 		log("Test: insert one data to collection " + collectionName2 + " succeed.");
// 	})
// 	.catch(function(err) {
// 		log("Test: insert one data to collection " + collectionName2 + " error.", err);
// 	})


// ------------------------------------------------
// var findOptions = {
// 	app_id: app_id,
// 	app_secret: app_secret,
// 	collectionName: collectionName2,
// 	query: {
// 		test: /test/
// 	}
// }

// collectionDb.find(findOptions)
// 	.then(function(results) {
// 		log("Test: find handle succeed.", results);
// 	})
// 	.catch(function(err) {
// 		log("Test: find handle error.", err);
// 	})

// ------------------------------------------------

// var findOneOptions = {
// 	app_id: app_id,
// 	app_secret: app_secret,
// 	collectionName: collectionName2,
// 	query: {
// 		test: /test/
// 	}
// }

// collectionDb.findOne(findOneOptions)
// 	.then(function(results) {
// 		log("Test: find one function succeed.", results);
// 	})
// 	.catch(function(err) {
// 		log("Test: find one function error.", err);
// 	})

// ------------------------------------------------

// var updateOptions = {
// 	app_id: 'kyl_app_id',
//   app_secret: 'kyl_app_secret',
//   collectionName: collectionName2,
//   selector: {
//   	hostDomain: 'liuzunkun.com'
// 	},
//   document: {
//   	hostDomain: 'liuzunkun.com',
//      hostEnName: '',
//      hostCnName: '',
//      hostDescription: '',
//      updateTime: "Wed Mar 30 2016 18:23:26 GMT+0800 (CST)",
//      handleAuthority: { owner: 'admin2222', group: 'admin' } },
//   updateOptions: { upsert: true, multi: true }
// }


// var updateOptions = {
// 	app_id: 'kyl_app_id',
//   app_secret: 'kyl_app_secret',
//   collectionName: 'Host',
//   selector: {
//   	hostDomain: 'liuzunkun.com'
// 	},
//   document: {
//   	hostDomain: 'liuzunkun.com',
//      hostEnName: '',
//      hostCnName: '',
//      hostDescription: '',
//      updateTime: "Wed Mar 30 2016 18:23:26 GMT+0800 (CST)",
//      handleAuthority: { owner: 'admin', group: 'admin' } },
//   updateOptions: { upsert: true, multi: true }
// }




collectionDb.update(updateOptions)
	.then(function(results) {
		log("Test: update handle succeed.");
	})
	.catch(function(err) {
		log("Test: update handle error.", err);
	})

// ------------------------------------------------

// var findRemoveOptions = {
// 	app_id: app_id,
// 	app_secret: app_secret,
// 	collectionName: collectionName2,
// 	query: {
// 		test: /test/
// 	},
// 	sort: []
// }

// collectionDb.findAndRemove(findRemoveOptions)
// 	.then(function(results) {
// 		log("Test: find and remove handle succeed.", results);
// 	})
// 	.catch(function(err) {
// 		log("Test: find and remove handle error.", err);
// 	})

// ------------------------------------------------
// var removeOptions = {
// 	app_id: app_id,
// 	app_secret: app_secret,
// 	collectionName: collectionName2,
// 	selector: {
// 		test: /test/
// 	}
// }

// collectionDb.remove(removeOptions)
// 	.then(function(results) {
// 		log("Test: remove multi documents succeed", results);
// 	})
// 	.catch(function(err) {
// 		log("Test: remove multi documents error", err);
// 	})



// ------------------------------------------------
