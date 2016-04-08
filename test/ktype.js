var Ktype = require('../lib/ktype').Ktype;

var ktypeClient = new Ktype();

var settings = require("../settings");
var authSettings = settings.auth;

var app_id = authSettings.app_id;
var app_secret = authSettings.app_secret;

var ktypeDb = settings.collection.ktype;

var hostDomain = "kyl.biz";


var CollectionDb = require("../collection/collection");
var collectionDb = new CollectionDb();

var Util = require("../utils/util").Util;
var util = new Util();

var log = util.log;

// ------------------------------------------------


var testCreateType = function(typeName, description) {
  var options = {
    app_id: app_id,
    app_secret: app_secret,
    hostDomain: hostDomain,
    typeName: typeName,
    description: description
  }

  ktypeClient.createType(options)
    .then(function(results) {
      log("Test: create type " + typeName + " succeed.");
    })
    .catch(function(err) {
      log("Test: crate type " + typeName + "error.", err)
    })
}

var typeName = "区域分类";
var description = "这是区域分类";

// testCreateType(typeName, description);


// ------------------------------------------------
var testUpdateType = function(typeName, description) {
  var findOptions = {
    app_id: app_id,
    app_secret: app_secret,
    collectionName: ktypeDb,
    hostDomain: hostDomain,
    query: {

    }
  }

  collectionDb.findOne(findOptions)
    .then(function(results) {
      log("Test: find one type succeed.")
      var typeId = results.typeId;

      var typeOptions = {
        app_id: app_id,
        app_secret: app_secret,
        hostDomain: hostDomain,
        typeId: typeId
      }

      if(typeName) {
        typeOptions.typeName = typeName;
      }
      if(description) {
        typeOptions.description = description;
      }

      ktypeClient.updateType(typeOptions)
        .then(function(results) {
          log("Test: update type " + typeId + " succeed.");
        })
        .catch(function(err) {
          log("Test: update type " + typeId + " error.", err);
        })
    })
    .catch(function(err) {
      log("Test: find one type error.", err);
    })
}

// testUpdateType("区域2", "1111");
// ------------------------------------------------
var testRemoveType = function(options) {
  var findOptions = {
    app_id: app_id,
    app_secret: app_secret,
    collectionName: ktypeDb,
    hostDomain: hostDomain,
    query: {

    }
  }

  collectionDb.findOne(findOptions)
    .then(function(results) {
      log("Test: find one type succeed.", "Test: then remove type " + results.typeId);
      var typeId = results.typeId;

      var typeOptions = {
        app_id: app_id,
        app_secret: app_secret,
        hostDomain: hostDomain,
        typeId: typeId
      }

      ktypeClient.removeType(typeOptions)
        .then(function(results) {
          log("Test: remove type " + typeId + " succeed.");
        })
        .catch(function(err) {
          log("Test: remove type " + typeId + " error.", err);
        })
      })
      .catch(function(err) {
        log("Test: remove one type error.", err);
      })
}

// testRemoveType();


// ------------------------------------------------
