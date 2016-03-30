
var CollectionDb = require("../collection/collection");

var collectionDb = new CollectionDb();

var AuthSettings = require("../settings").auth;
var app_id = AuthSettings.app_id;
var app_secret = AuthSettings.app_secret;


var Util = require("../utils/util").Util;
var util = new Util();

var log = util.log;
var logError = util.logError;

// ------------------------------------------------

function Init() {
	this.name = "Init",
	this.collectionDb = collectionDb;
};

exports.Init = Init;

// ------------------------------------------------
/**
 * init create mongodb collection
 */
Init.prototype.initDb = function() {
	var self = this;
	var dbLists = [
		"Hosts",
	  "users", 
	  "NavLists",
	  "NavMap",
	  "ModuleLists",
	  "ModuleMap",
	  "Module",
	  "ArticleLists",
	  "Article"
  ];

  dbLists.forEach(function(dbname) {
  	var options = {
  		app_id: app_id,
  		app_secret: app_secret,
  		collectionName: dbname
  	}

  	self.collectionDb.createCollection(options)
  			.then(function(results) {
  				log("initDb: init db " + dbname + " succeed.", results);
  			})
  			.catch(function(err) {
  				logError("initDb: init db " + dbname + " error", err);
  			})
  })
}

// ------------------------------------------------