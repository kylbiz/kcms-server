var DBClient = require('./db');
// var dbClient = new DBClient();

var Util = require("../utils/util").Util;
var util = new Util();

var log = util.log;

var Promise = require("bluebird");

// ------------------------------------------------

function CollectionDb() {
	this.dbClient = new DBClient();
}

module.exports = CollectionDb;


// ------------------------------------------------
/**
 * create collection function
 *
 * @param  {options}   options  create an collection options,
 * the options parameters shall contains the following properties:
 *
 * @property {string} app_id app_id for authority verification
 *
 * @property {string} app_secret app_id for authority verifaction
 *
 * @property {string} collectionName collection name shall be created
 *
 */

CollectionDb.prototype.createCollection = function(options) {
	var self = this;
	return new Promise(function(resolve, reject) {
		if(!util.auth(options)
			|| !options.hasOwnProperty("collectionName")) {
			log("createCollection: options illegal.", options);

			var err = "createCollection: options illegal.";
			reject(err);

		} else {
			var collectionName = options.collectionName;

			self.dbClient.connect()
				.then(function(db) {
					db.createCollectionAsync(collectionName)
						.then(function(results) {
							resolve(results);
						})
						.then(function(results) {
							self.dbClient.close(db)
						})
				})
				.catch(function(err) {
					log("createCollection: create collection " + collectionName + " error.", err);
					reject(err);
				})
		}

	})
}


// ------------------------------------------------
/**
 * drop collection function
 *
 * @param  {options}   options  drop an collection options,
 * the options parameters shall contains the following properties:
 *
 * @property {string} app_id app_id for authority verification
 *
 * @property {string} app_secret app_id for authority verifaction
 *
 * @property {string} collectionName collection name shall be drop
 *
 */

CollectionDb.prototype.dropCollection = function(options) {
	var self = this;
	return new Promise(function(resolve, reject) {
		if(!util.auth(options)
			|| !options.hasOwnProperty("collectionName")) {
			log("dropCollection: options illegal.", options);

			var err = "dropCollection: options illegal.";
			reject(err);

		} else {
			var collectionName = options.collectionName;

			self.dbClient.connect()
				.then(function(db) {
					db.dropCollectionAsync(collectionName)
						.then(function(results) {
							resolve(results);
						});
				})
				.catch(function(err) {
					log("dropCollection: drop collection " + collectionName + " error.", err);
					reject(err);
				})
		}

	})
}

// ------------------------------------------------

/**
 * rename collection function
 *
 * @param  {options}   options  rename an collection options,
 * the options parameters shall contains the following properties:
 *
 * @property {string} app_id app_id for authority verification
 *
 * @property {string} app_secret app_id for authority verifaction
 *
 * @property {string} oldCollectionName collection name shall be rename
 *
 * @property {string} newCollectionName new collection name
 *
 */

CollectionDb.prototype.renameCollection = function(options) {
	var self = this;
	return new Promise(function(resolve, reject) {
		if(!util.auth(options)
			|| !options.hasOwnProperty("oldCollectionName")
			|| typeof(options.oldCollectionName) !== "string"
			|| !options.hasOwnProperty("newCollectionName")
			|| typeof(options.newCollectionName) !== "string") {
			log("renameCollection: options illegal.", options);

			var err = "renameCollection: options illegal.";
			reject(err);

		} else {
			var oldCollectionName = options.oldCollectionName;
			var newCollectionName = options.newCollectionName;

			self.dbClient.connect()
				.then(function(db) {
					db.renameCollectionAsync(oldCollectionName, newCollectionName)
						.then(function(results) {
							resolve(results);
						})
						.then(function(results) {
							self.dbClient.close(db)
						})
				})
				.catch(function(err) {
					log("renameCollection: rename collection " + oldCollectionName + " to collection " + newCollectionName + " error.", err);
					reject(err);
				})
		}

	})
}

// ------------------------------------------------

/**
 * insert data to  collection, if not exists collection $collectionName
 * this will not create an collection name $collectionName
 *
 * @param  {options}   options
 * the options parameters shall contains the following properties:
 *
 * @property {string} app_id app_id for authority verification
 *
 * @property {string} app_secret app_id for authority verifaction
 *
 * @property {string} collectionName collection name needs to insert data
 *
 * @property {json} data user data that will insert to collection "collectionName"
 *
 */

CollectionDb.prototype.insertOne = function(options) {
	var self = this;
	return new Promise(function(resolve, reject) {
		if(!util.auth(options)
			|| !options.hasOwnProperty("collectionName")
			|| typeof(options.collectionName) !== "string"
			|| !options.hasOwnProperty("data")
			|| !util.isJson(options.data)) {

			log("insertOne: options illegal.", options);
			var err = "insertOne: options illegal.";

			reject(err);
		} else {
			var collectionName = options.collectionName;
			var data = options.data;

			// record handle time
			if(!data.hasOwnProperty("createTime")) {
				data.createTime = new Date();
			}

			if(!data.hasOwnProperty("updateTime")) {
				data.updateTime = new Date();
			}

			// insert data to collection $collectionName
			self.dbClient.connect()
			.then(function(db) {
				db.collectionAsync(collectionName)
				.then(function(collection) {
					collection.insert(data, function(err, results) {

						self.dbClient.close(db)

						if(err) {
							log("insertOne: insert data to collection " + collectionName + " error.");
							reject(err);
						} else {
							log("insertOne: insert data to collection " + collectionName + " succeed.")
							resolve(results);
						}
					})
				})
			})
			.catch(function(err) {
				log("insertOne: insert data to collection " + collectionName + " succeed.")
				reject(err);
			})
		}
	})
}

// ------------------------------------------------

/**
 * find and modify about $collectionName
 * this will not create an collection name $collectionName
 *
 * @param  {options}   options
 * the options parameters shall contains the following properties:
 *
 * @property {string} app_id app_id for authority verification
 *
 * @property {string} app_secret app_id for authority verifaction
 *
 * @property {string} collectionName collection name needs to modify data
 *
 *@property {json} query mongodb query obj
 *
 *@property {json} sort 	If multiple docs match, choose the first one
 *                       in the specified sort order as the object to manipulate.
 *
 * @property {json} doc user data that will modify to collection "collectionName"
 *
 * @property {json} updateOptions update options about mongodb
 *
 */

CollectionDb.prototype.findAndModify = function(options) {
	var self = this;
	return new Promise(function(resolve, reject) {
		if(!util.auth(options)
			|| !options.hasOwnProperty("collectionName")
			|| typeof(options.collectionName) !== "string"
			|| !options.hasOwnProperty("query")
			|| !util.isJson(options.query)
			|| !options.hasOwnProperty("doc")
			|| !util.isJson(options.doc)) {

			log("findAndModify: options illegal.", options);
			var err = "findAndModify: options illegal.";

			reject(err);
		} else {
			var collectionName = options.collectionName;
			var doc = options.doc;

			if(!options.hasOwnProperty("sort")
				|| !options.sort instanceof Array) {
				options.sort = [];
			};

			if(!options.hasOwnProperty("updateOptions")
				|| !util.isJson(options.updateOptions)) {
				options.updateOptions = {};
			};

			// record handle time
			if(!doc.hasOwnProperty("createTime")) {
				doc.createTime = new Date();
			}

			if(!doc.hasOwnProperty("updateTime")) {
				doc.updateTime = new Date();
			}

			if(!doc.hasOwnProperty("removed")) {
				doc.removed = false;
			}

			// find and modify data to collection $collectionName
			self.dbClient.connect()
			.then(function(db) {
				db.collectionAsync(collectionName)
				.then(function(collection) {

					collection.findAndModify(
						options.query,
						options.sort,
						doc,
						options.updateOptions,
						function(err, results) {
							self.dbClient.close(db);

						if(err) {
							log("findAndModify: find and modify  collection " + collectionName + " error.");
							reject(err);
						} else {
							log("findAndModify: find and modify collection " + collectionName + " succeed.")
							resolve(results);
						}
					})

				})
			})
			.catch(function(err) {
				log("findAndModify: find and modify collection " + collectionName + " succeed.")
				reject(err);
			})
		}
	})
}

// ------------------------------------------------

/**
 * find and remove about $collectionName
 * this will not create an collection name $collectionName
 *
 * @param  {options}   options
 * the options parameters shall contains the following properties:
 *
 * @property {string} app_id app_id for authority verification
 *
 * @property {string} app_secret app_id for authority verifaction
 *
 * @property {string} collectionName collection name needs to remove data
 *
 *@property {json} query mongodb query obj
 *
 *@property {json} sort 	If multiple docs match, choose the first one
 *                       in the specified sort order as the object to manipulate.
 *
 *
 * @property {json} removeOptions remove options about mongodb
 *
 */

CollectionDb.prototype.findAndRemove = function(options) {
	var self = this;
	return new Promise(function(resolve, reject) {
		if(!util.auth(options)
			|| !options.hasOwnProperty("collectionName")
			|| typeof(options.collectionName) !== "string"
			|| !options.hasOwnProperty("query")
			|| !util.isJson(options.query)) {

			log("findAndRemove: options illegal.", options);
			var err = "findAndRemove: options illegal.";

			reject(err);
		} else {
			var collectionName = options.collectionName;


			if(!options.hasOwnProperty("sort")
				|| !options.sort instanceof Array) {
				options.sort = [];
			};

			if(!options.hasOwnProperty("removeOptions")
				|| !util.isJson(options.removeOptions)) {
				options.removeOptions = {};
			};


			// find and modify data to collection $collectionName
			self.dbClient.connect()
			.then(function(db) {
				db.collectionAsync(collectionName)
				.then(function(collection) {

					collection.findAndRemove(
						options.query,
						options.sort,
						options.removeOptions,
						function(err, results) {

							self.dbClient.close(db);

						if(err) {
							log("findAndRemove: find and remove  collection " + collectionName + " error.");
							reject(err);
						} else {
							log("findAndRemove: find and remove collection " + collectionName + " succeed.")
							resolve(results);
						}
					})

				})
			})
			.catch(function(err) {
				log("findAndRemove: find and remove collection " + collectionName + " succeed.")
				reject(err);
			})
		}
	})
}


// ------------------------------------------------

/**
 * remove documents of $collectionName
 * this will not create an collection name $collectionName
 *
 * @param  {options}   options
 * the options parameters shall contains the following properties:
 *
 * @property {string} app_id app_id for authority verification
 *
 * @property {string} app_secret app_id for authority verifaction
 *
 * @property {string} collectionName collection name needs to remove data
 *
 *@property {json} selector mongodb selector obj
 *
 * @property {json} removeOptions remove options about mongodb
 * http://mongodb.github.io/node-mongodb-native/2.1/api/Collection.html#remove
 *
 */

CollectionDb.prototype.remove = function(options) {
	var self = this;
	return new Promise(function(resolve, reject) {
		if(!util.auth(options)
			|| !options.hasOwnProperty("collectionName")
			|| typeof(options.collectionName) !== "string"
			|| !options.hasOwnProperty("selector")) {

			log("remove: options illegal.", options);
			var err = "remove: options illegal.";

			reject(err);
		} else {
			var collectionName = options.collectionName;

			if(!options.hasOwnProperty("removeOptions")
				|| !util.isJson(options.removeOptions)) {
				options.removeOptions = {};
			};

			// find and modify data to collection $collectionName
			self.dbClient.connect()
			.then(function(db) {
				db.collectionAsync(collectionName)
				.then(function(collection) {

					collection.remove(
						options.selector,
						options.removeOptions,
						function(err, results) {

						self.dbClient.close(db);

						if(err) {
							log("remove: find and remove  collection " + collectionName + " error.");
							reject(err);
						} else {
							log("remove: find and remove collection " + collectionName + " succeed.")
							resolve(results);
						}
					})

				})
			})
			.catch(function(err) {
				log("remove: find and remove collection " + collectionName + " succeed.")
				reject(err);
			})
		}
	})
}

// ------------------------------------------------

/**
 * find data about $collectionName
 * this will not create an collection name $collectionName
 *
 * @param  {options}   options
 * the options parameters shall contains the following properties:
 *
 * @property {string} app_id app_id for authority verification
 *
 * @property {string} app_secret app_id for authority verifaction
 *
 * @property {string} collectionName collection name needs to remove data
 *
 *@property {json} query mongodb query obj
 *
 */

CollectionDb.prototype.find = function(options) {
	var self = this;
	return new Promise(function(resolve, reject) {
		if(!util.auth(options)
			|| !options.hasOwnProperty("collectionName")
			|| typeof(options.collectionName) !== "string"
			|| !options.hasOwnProperty("query")
			|| !util.isJson(options.query)) {

			log("find: options illegal.", options);
			var err = "find: options illegal.";

			reject(err);
		} else {
			var collectionName = options.collectionName;

			// find and modify data to collection $collectionName
			self.dbClient.connect()
			.then(function(db) {
				db.collectionAsync(collectionName)
				.then(function(collection) {

					collection.find(options.query)
						.toArray(function(err, results) {
							self.dbClient.close(db);

							if(err) {
								log("find: find data from collection " + collectionName + " error.");
								reject(err);
							} else {
								log("find: find data from collection " + collectionName + " succeed.")
								resolve(results);
							}
					})
				})
			})
			.catch(function(err) {
				log("find: find data from collection " + collectionName + " succeed.")
				reject(err);
			})
		}
	})
}

// ------------------------------------------------

/**
 * find one data about $collectionName
 * this will not create an collection name $collectionName
 *
 * @param  {options}   options
 * the options parameters shall contains the following properties:
 *
 * @property {string} app_id app_id for authority verification
 *
 * @property {string} app_secret app_id for authority verifaction
 *
 * @property {string} collectionName collection name needs to remove data
 *
 * @property {json} query mongodb query obj
 *
 * @property {json} findOptions find options about findOne, details to refer :
 *
 *  http://mongodb.github.io/node-mongodb-native/2.1/api/Collection.html#findOne
 *
 */

CollectionDb.prototype.findOne = function(options) {
	var self = this;
	return new Promise(function(resolve, reject) {
		if(!util.auth(options)
			|| !options.hasOwnProperty("collectionName")
			|| typeof(options.collectionName) !== "string"
			|| !options.hasOwnProperty("query")
			|| !util.isJson(options.query)) {

			log("findOne: options illegal.", options);
			var err = "findOne: options illegal.";

			reject(err);
		} else {
			var collectionName = options.collectionName;

			if(!options.hasOwnProperty("findOptions")
				|| !util.isJson(options.findOptions)) {
				options.findOptions = {};
			}

			// find and modify data to collection $collectionName
			self.dbClient.connect()
			.then(function(db) {
				db.collectionAsync(collectionName)
				.then(function(collection) {
					collection.findOne(
						options.query,
						options.findOptions,
						function(err, results) {
							self.dbClient.close(db);

							if(err) {
								log("findOne: find one handle error.", err);
								reject(err);
							}	else {
								log("findOne: find one handle succeed.");
								resolve(results);
							}
						}
					)
				})
			})
			.catch(function(err) {
				log("findOne: find one doc from collection " + collectionName + " succeed.")
				reject(err);
			})
		}
	})
}

// ------------------------------------------------

/**
 * update documents about  $collectionName
 *
 * this will not create an collection name $collectionName
 *
 * if updateOptions has property upsert true value
 *
 * @param  {options}   options
 * the options parameters shall contains the following properties:
 *
 * @property {string} app_id app_id for authority verification
 *
 * @property {string} app_secret app_id for authority verifaction
 *
 * @property {string} collectionName collection name needs to remove data
 *
 * @property {json} selector mongodb query selector
 *
 * @property {json} document the update document
 *
 * @property {json} updateOptions update options about mongodb update, details to refer :
 *
 *  http://mongodb.github.io/node-mongodb-native/2.1/api/Collection.html#update
 *
 */

CollectionDb.prototype.update = function(options) {
	var self = this;
	return new Promise(function(resolve, reject) {
		if(!util.auth(options)
			|| !options.hasOwnProperty("collectionName")
			|| typeof(options.collectionName) !== "string"
			|| !options.hasOwnProperty("selector")
			|| !options.hasOwnProperty("document")
			|| !util.isJson(options.document)) {

			log("update: options illegal.", options);
			var err = "update: options illegal.";

			reject(err);
		} else {

			var collectionName = options.collectionName;
			var document = options.document;

			if(!document["$set"]
			 ||!document.$set.hasOwnProperty("updateTime")) {
				document.$set.updateTime = new Date();
			}

			if(!options.hasOwnProperty("updateOptions")
				|| !util.isJson(options.updateOptions)) {
				options.findOptions = {};
			}

			// find and modify data to collection $collectionName
			self.dbClient.connect()
			.then(function(db) {
				db.collectionAsync(collectionName)
				.then(function(collection) {

					collection.update(
						options.selector,
						options.document,
						options.updateOptions,
						function(err, results) {

							self.dbClient.close(db);

							if(err) {
								log("update: update doc from collection " + collectionName + " error.");
								reject(err);
							} else {
								log("update: update doc from collection " + collectionName + " succeed.")
								resolve(results);
							}
					})

				})
			})
			.catch(function(err) {
				log("update: update  doc from collection " + collectionName + " succeed.")
				reject(err);
			})
		}
	})
}

// ------------------------------------------------
