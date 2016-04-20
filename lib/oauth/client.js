var Promise = require("bluebird");

var CollectionDb = require("../../collection/collection");

var settings = require("../../settings");

var Accounts = require("../accounts-server.js").Accounts;

var accountsClient = new Accounts();
var clientDb = settings.collection.client;

var Util = require("../../utils/util").Util;
var util = new Util();

// print utils
var log = util.log;
var logError = util.logError;

// ------------------------------------------------

function UserClient() {
  this.name = "UserClient";
  this.collectionDb = new CollectionDb();
}

exports.UserClient = UserClient;

// ------------------------------------------------
/**
 * create client document
 * you should provide <userId|username|email>
 */
UserClient.prototype.createClientByUser = function(options) {
  log("createClientByUser: Hi I am called.");
  var errStr = "";
  var self = this;

  return new Promise(function(resolve, reject) {
    if(!util.isJson(options)
    || !options.hasOwnProperty("clientName")
    || (!options.hasOwnProperty("username")
    && !options.hasOwnProperty("email")
    && !options.hasOwnProperty("userId"))) {
      util.log("createClientByUser: options illegal", options);
      reject("createClientByUser: options illegal");
    } else {
      var query = {};
      var fieldName;
      var fieldValue;

      if (options.username) {
        fieldName = 'username';
        fieldValue = options.username;
      } else if (options.email) {
        fieldName = 'emails.address';
        fieldValue = options.email;
      } else if(options.userId) {
        fieldName = "userId";
        fieldValue = options.userId;
      } else {
        var errStr = "findUserByQuery: shouldn't happen (validation missed something)";
        throw new Error(errStr);
        reject(errStr)
      }

      var clientName = options.clientName;

      query[fieldName] = fieldValue;
      query["clientName"] = clientName;

      accountsClient.findUserByQuery(query)
        .then(function(results) {
          if(!results
            || !results.hasOwnProperty("_id")) {
            errStr = "createClientByUser: not exists user ";
            logError(errStr, query);
            reject(errStr);
          } else {
            var userId = results._id;
            var clientId = util.generateClientId();
            var clientSecret = util.generateClientSecret();

            var createClientOptions = {
              collectionName: clientDb,
              selector: {
                userId: userId,
                clientName: clientName
              },
              document: {
                "$set": {
                  userId: userId,
                  username: options.username,
                  clientName: clientName,
                  clientId: clientId,
                  clientSecret: clientSecret,
                  updateTime: new Date()
                }
              },
              updateOptions: {
                upsert: true,
                multi: true
              }
            }

            self.collectionDb.update(createClientOptions)
              .then(function(results) {
                log("createClientByUser: create client succeed.");
                resolve(results);
              })
              .catch(function(err) {
                logError("createClientByUser: create client error.", err);
                reject(err);
              })
          }

        })
        .catch(function(err) {
          logError("createClientByUser: handle error.", err);
          reject(err);
        })
    }
  })
}

// ------------------------------------------------
/**
 * update client secret
 * @param userId
 * @param clientId
 */
UserClient.prototype.updateClientSecret = function(options) {
  log("updateClientSecret: Hi I AM CALLED.");
  var errStr = "";
  var self = this;

  return new Promise(function(resolve, reject) {
    if(!util.isJson(options)
    || !options.hasOwnProperty("userId")
    || !options.hasOwnProperty("clientId")) {
      errStr = "updateClientSecret: options illegal.";
      logError(errStr, options);
      reject(errStr);
    } else {
      var clientSecret = util.generateClientSecret();

      var updateOptions = {
        collectionName: clientDb,
        selector: {
          userId: options.userId,
          clientId: options.clientId
        },
        document: {
          $set: {
            userId: options.userId,
            clientId: options.clientId,
            clientSecret: clientSecret,
            updateTime: new Date()
          }
        }
      }

      self.collectionDb.update(updateOptions)
        .then(function(results) {
          log("updateClientSecret: update client secret succeed.");
          resolve(results);
        })
        .catch(function(err) {
          errStr = "updateClientSecret: update client secret error.";
          logError(errStr, err);
          reject(err);
        })
    }
  })
}

// ------------------------------------------------
