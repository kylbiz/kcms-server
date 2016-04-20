var Promise = require("bluebird");

var CollectionDb = require("../collection/collection");

var collectionDb = new CollectionDb();

var settings = require("../settings");

var khostDomain = settings.domain.hostDomain;

var Util = require("../utils/util").Util;
var util = new Util();

var log = util.log;
var logError = util.logError;

// ------------------------------------------------
function Host() {
	this.name = "Host";
	this.dbName = "Host";
	this.collectionDb = collectionDb;
}

exports.Host = Host;

// ------------------------------------------------
/**
 * update host information
 * Collection Host shall has only one document, however,
 * if it comes to an awful data, it may delete all data
 * @param  {json} options contains the following properties
 * @property {string} hostDomain not null, host domain of the site
 * @property {string} hostEnName null host english name
 * @property {string} hostCnName null host chinese name
 * @return {Promise}   return Promise Host object
 */

Host.prototype.updateHost = function(options) {
	log("updateHost: I am called.");
	var self = this;
	return new Promise(function(resolve, reject) {
		if(!options
			|| !options.hasOwnProperty("hostDomain")
			|| !util.isDomain(options.hostDomain)) {

			logError("updateHost: options illegal.", options);
			reject("updateHost: options illegal.");

		} else {

			var hostDomain = options.hostDomain;
			var hostCnName = "";
			var hostEnName = "";
			var hostDescription = "";

			if(options.hasOwnProperty("hostCnName")
				&& typeof(options.hostCnName) === "string") {
				hostCnName = options.hostCnName;
			}

			if(options.hasOwnProperty("hostEnName")
				&& typeof(options.hostEnName) === "string") {
				hostEnName = options.hostEnName;
			}

			if(options.hasOwnProperty("hostDescription")
				&& typeof(options.hostDescription) === "string") {
				hostDescription = options.hostDescription;
			}


			var hostOptions = {
				collectionName: self.dbName,
				selector: {
					hostDomain: hostDomain
				},
				document: {
					$set: {
						hostDomain: hostDomain,
						hostEnName: hostEnName,
						hostCnName: hostCnName,
						hostDescription: hostDescription,
						updateTime: new Date(),
						handleAuthority: {
							owner: "admin",
							group: "admin"
						}
					}
				},
				updateOptions: {
					upsert: true,
					multi: true
				}
			}

			self.collectionDb.update(hostOptions)
				.then(function(results) {

					log("createHost: create host " 	+ hostDomain + " succeed.");
					resolve(results);
				})
				.catch(function(err) {

					logError("createHost: create host " + hostDomain + " error.", err);
					reject(err);
				})
		}
	})
}

// ------------------------------------------------
/**
 * remove host information
 * Collection Host shall has only one document, however,
 * if it comes to an awful data, it may delete all data
 * @param  {json} options contains the following properties
 * @property {string} hostDomain not null, host domain of the site
 * @return {Promise}   return Promise Host object
 */

Host.prototype.removeHost = function(options) {
	log("removeHost: I am called.");
	var self = this;
	return new Promise(function(resolve, reject) {
		if(!util.isJson(options)
			|| !options.hasOwnProperty("hostDomain")
			|| !util.isDomain(options.hostDomain)) {

			logError("removeHost: options illegal.", options);
			reject("removeHost: options illegal.");

		} else {
			var hostDomain = options.hostDomain;

			var removeOptions = {
				collectionName: self.dbName,
				$selector: {
					hostDomain: hostDomain
				}
			}

			self.collectionDb.remove(removeOptions)
				.then(function(results) {

					log("removeHost: remove host " + hostDomain + " succeed.");
					resolve(results);
				})
				.catch(function(err) {

					logError("removeHost: remove host " + hostDomain + " error.", err);
					reject(err);
				})
		}
	})
}
