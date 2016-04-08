var CollectionDb = require("../collection/collection");

var settings = require("../settings");

var authSettings = settings.auth;
var app_id = authSettings.app_id;
var app_secret = authSettings.app_secret;

var khostDomain = settings.domain.hostDomain;

var collectionLists = settings.collectionLists;

var ktypeDb = settings.collection.ktype;

var Util = require("../utils/util").Util;
var util = new Util();

var log = util.log;
var logError = util.logError;

var hasOwnProperty = Object.prototype.hasOwnProperty;

// ------------------------------------------------

function Ktype() {
	this.name = "Ktype";
	this.collectionDb = new CollectionDb();
};

exports.Ktype = Ktype;

// ------------------------------------------------

/**
 * create type function
 * @param json options , contains properties like following
 * @property {string} app_id
 * @property {string} app_secret
 * @property {string} hostDomain
 * @property {string} description type description
 * @return {Promise} handle results
 */
Ktype.prototype.createType = function(options) {
  log("createType: Hi I am called.");
	var self = this;

	return new Promise(function(resolve, reject) {
		if(!util.auth(options)
			|| !hasOwnProperty.call(options, "typeName")
			|| typeof(options.typeName) !== "string"
			|| !hasOwnProperty.call(options, "hostDomain")
			|| typeof(options.hostDomain) !== khostDomain) {
			var errorStr = "createType: options illegal.";

			logError(errorStr);
			reject(errorStr);

		} else {
      var app_id = options.app_id;
      var app_secret = options.app_secret;
      var hostDomain = options.hostDomain;
      var typeName = options.typeName;
      var description = options.description ? options.description : typeName;

      var typeId = "ktype" + util.generateStr(false, 10, 20);

      var insertOptions = {
        app_id: app_id,
        app_secret: app_secret,
        collectionName: ktypeDb,
        hostDomain: hostDomain,
        data: {
          typeId: typeId,
          typeName: typeName,
          description: description,
          isRemoved: false,
          createTime: new Date(),
          updateTime: new Date()
        }
      }

      self.collectionDb.insertOne(insertOptions)
        .then(function(results) {
          log("createType: create type " + typeName + " succeed.");
          resolve(results);
        })
        .catch(function(err) {
          logError("createType: create type " + typeName + " error.", err);
          reject(err);
        })
    }
  })
}

// ------------------------------------------------

/**
 * update type function
 * @param json options , contains properties like following
 * @property {string} app_id
 * @property {string} app_secret
 * @property {string} hostDomain
 * @property {string} typeId
 * @property {string} description type description
 * @return {Promise} handle results
 */

Ktype.prototype.updateType = function(options) {
  log("updateType: Hi I am called.");
	var self = this;

	return new Promise(function(resolve, reject) {
		if(!util.auth(options)
			|| !hasOwnProperty.call(options, "typeId")
			|| typeof(options.typeId) !== "string"
			|| !hasOwnProperty.call(options, "hostDomain")
			|| typeof(options.hostDomain) !== khostDomain) {
			var errorStr = "updateType: options illegal.";

			logError(errorStr);
			reject(errorStr);

		} else {
      var app_id = options.app_id;
      var app_secret = options.app_secret;

      var typeId = options.typeId;

      var document = {
        $set: {
          updateTime: new Date()
        }
      };

      if(hasOwnProperty.call(options, "typeName")) {
        document.$set.typeName = options.typeName;
      }

      if(hasOwnProperty.call(options, "description")) {
        document.$set.description = options.description;
      }


      var typeOptions = {
        app_id: app_id,
        app_secret: app_secret,
        collectionName: ktypeDb,
        selector: {
          typeId: typeId
        },
        document: document,
        updateOptions: {
          multi: true
        }
      }

      self.collectionDb.update(typeOptions)
        .then(function(results) {
          log("updateType: update type " + typeId + " succeed");
          resolve(results);
        })
        .catch(function(err) {
          logError("updateType: update type " + typeId + " error.", err);
          reject(err);
        })
    }
  })
}

// ------------------------------------------------
/**
 * remove type function
 * @param json options , contains properties like following
 * @property {string} app_id
 * @property {string} app_secret
 * @property {string} hostDomain
 * @return {Promise} handle results
 */
Ktype.prototype.removeType = function(options) {
  log("removeType: Hi I am called.");
	var self = this;

	return new Promise(function(resolve, reject) {
		if(!util.auth(options)
			|| !hasOwnProperty.call(options, "typeId")
			|| typeof(options.typeId) !== "string"
			|| !hasOwnProperty.call(options, "hostDomain")
			|| typeof(options.hostDomain) !== khostDomain) {
			var errorStr = "updateType: options illegal.";

			logError(errorStr);
			reject(errorStr);

		} else {
      var app_id = options.app_id;
      var app_secret = options.app_secret;

      var typeId = options.typeId;

      var typeOptions = {
        app_id: app_id,
        app_secret: app_secret,
        collectionName: ktypeDb,
        selector: {
          typeId: typeId
        },
        document: {
          $set: {
            isRemoved: true,
            updateTime: new Date()
          }
        },
        updateOptions: {
          multi: true
        }
      }

      self.collectionDb.update(typeOptions)
        .then(function(results) {
          log("removeType: remove type " + typeId + " succeed");
          resolve(results);
        })
        .catch(function(err) {
          logError("removeType: remove type " + typeId + " error.", err);
          reject(err);
        })
    }
  })
}

// ------------------------------------------------