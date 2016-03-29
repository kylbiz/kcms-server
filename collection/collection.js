var DBClient = require('./db');
var dbClient = new DBClient();

var Util = require("../utils/util").Util;
var util = new Util();

var log = util.log;


function CollectionDb() {
	this.dbClient = dbClient;
}

module.exports = CollectionDb;

// console.log(dbClient)

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
 * @param  {Function} callback handled after collection be created.
 */

CollectionDb.prototype.createCollection = function(options) {
	return new Promise(function(resolve, reject) {
		if(!util.auth(options)
			|| !options.hasOwnProperty("collectionName")) {
			log("createCollection: options illegal.", options);

			var err = "createCollection: options illegal.";
			resolve(err);

		} else {
			var collectionName = options.collectionName;

			dbClient.connect()
				.then(function(db) {
					db.createCollectionAsync(collectionName)
						.then(function(results) {
							resolve();
						});
				})
				.catch(function(err) {
					log("create collection " + collectionName + " error.", err);
					reject(err);
				})
		}
		
	})
}


// ------------------------------------------------










// ------------------------------------------------







// ------------------------------------------------

