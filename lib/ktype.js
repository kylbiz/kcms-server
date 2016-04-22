var CollectionDb = require("../collection/collection");

var settings = require("../settings");

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
 * @property {string} hostDomain
 * @property {string} description type description
 * @return {Promise} handle results
 */
Ktype.prototype.createType = function(options) {
  log("createType: Hi I am called.");
	var self = this;

	return new Promise(function(resolve, reject) {
		if(!hasOwnProperty.call(options, "typeName")
			|| typeof(options.typeName) !== "string"
			|| !hasOwnProperty.call(options, "hostDomain")) {
			var errorStr = "createType: options illegal.";

			logError(errorStr);
			reject(errorStr);

		} else {
      var hostDomain = options.hostDomain;
      var typeName = options.typeName;
      var description = options.description ? options.description : typeName;

      var typeId = "ktype" + util.generateStr(false, 10, 20);

      var insertOptions = {
        collectionName: ktypeDb,
        data: {
          typeId: typeId,
          typeName: typeName,
          description: description,
          isRemoved: false,
					hostDomain: hostDomain,
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
 * @property {string} hostDomain
 * @property {string} typeId
 * @property {string} description type description
 * @return {Promise} handle results
 */

Ktype.prototype.updateType = function(options) {
  log("updateType: Hi I am called.");
	var self = this;

	return new Promise(function(resolve, reject) {
		if(!hasOwnProperty.call(options, "typeId")
			|| typeof(options.typeId) !== "string"
			|| !hasOwnProperty.call(options, "hostDomain")) {
			var errorStr = "updateType: options illegal.";

			logError(errorStr);
			reject(errorStr);

		} else {
      var typeId = options.typeId;

      var document = {
        $set: {
          updateTime: new Date()
        }
      };

			var hostDomain = options.hostDomain;

      if(hasOwnProperty.call(options, "typeName")) {
        document.$set.typeName = options.typeName;
      }

      if(hasOwnProperty.call(options, "description")) {
        document.$set.description = options.description;
      }


      var typeOptions = {
        collectionName: ktypeDb,
        selector: {
					hostDomain:hostDomain,
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
 * @property {string} hostDomain
 * @return {Promise} handle results
 */
Ktype.prototype.removeType = function(options) {
  log("removeType: Hi I am called.");
	var self = this;

	return new Promise(function(resolve, reject) {
		if(!hasOwnProperty.call(options, "typeId")
			|| typeof(options.typeId) !== "string"
			|| !hasOwnProperty.call(options, "hostDomain")) {
			var errorStr = "removeType: options illegal.";

			logError(errorStr);
			reject(errorStr);

		} else {
      var typeId = options.typeId;
			var hostDomain = options.hostDomain;

      var typeOptions = {
        collectionName: ktypeDb,
        selector: {
					hostDomain: hostDomain,
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
