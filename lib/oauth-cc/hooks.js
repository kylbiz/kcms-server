var CollectionDb = require("../../collection/collection");

var collectionDb = new CollectionDb();

var settings = require("../../settings");

var clientDb = settings.collection.client;

var tokenDb = settings.collection.token;

var Accounts = require("../accounts-server.js").Accounts;

var crypto = require("crypto");

var expiresIn = settings.auth.expiresIn;

// print utils
var Util = require("../../utils/util").Util;
var util = new Util();

var log = util.log;
var logError = util.logError;

// ------------------------------------------------

function generateToken(data) {
    var random = Math.floor(Math.random() * 100001);
    var timestamp = (new Date()).getTime();
    var sha256 = crypto.createHmac("sha256", random + "WOO" + timestamp);

    return sha256.update(data).digest("base64");
}

// ------------------------------------------------

exports.grantClientToken = function(credentials, req, callback) {
  log("grantClientToken: Hi I am called.");

  var errStr = "";
  var self = this;

  if(!credentials.hasOwnProperty("clientId")
  || !credentials.hasOwnProperty("clientSecret")) {
    errStr = "validateClient: you should provide clientId and clientSecret";
    logError(errStr);
    callback(null, false);
  } else {

    var clientSecret = credentials.clientSecret;
    var clientId = credentials.clientId;

    var findOneOptions = {
      collectionName: clientDb,
      query: {
        clientId: clientId
      }
    }

    collectionDb.findOne(findOneOptions)
      .then(function(results) {
        if(!results
          || !results.hasOwnProperty("clientSecret")) {
            errStr = "validateClient: clientId or clientSecret error.";
            logError(errStr);

            callback(null, false);
          } else {
            if(clientSecret !== results.clientSecret) {
              errStr = "validateClient: clientId and clientSecret not match.";
              logError(errStr);

              callback(null, false);
            } else {
              log("validateClient: client match.");

              var userId = results.userId;

              var token = generateToken(clientId + ":" + clientSecret);

              var updateTokenOptions = {
                collectionName: tokenDb,
                selector: {
                  userId: userId,
                  clientId: clientId
                },
                document: {
                  $set: {
                    userId: userId,
                    clientId: clientId,
                    token: token,
                    expiresIn: expiresIn,
                    updateTime: new Date()
                  }
                },
                updateOptions: {
                  upsert: true,
                  multi: true
                }
              }

              collectionDb.update(updateTokenOptions)
                .then(function(results) {
                  log("grantClientToken: save token succeed.");
                  callback(null, token);
                })
                .catch(function(err) {
                  errStr = "grantClientToken: save token error.";
                  logError(errStr, err);
                  callback(err, false);
                })
            }
          }
      })
      .catch(function(err) {
        logError("validateClient: findOne client error.", err);
        callback(err, false);
      })
  }
}

// ------------------------------------------------

exports.authenticateToken = function (token, req, callback) {
  log("authenticateToken: Hi I am called.");

  var self = this;
  var findOneOptions = {
    collectionName: tokenDb,
    query: {
      token: token
    }
  }

  collectionDb.findOne(findOneOptions)
    .then(function(results) {

      if(!results
        || !results.hasOwnProperty("clientId")) {
          logError("authenticateToken: token doc does not contains clientId");
          callback(null, false);
        } else {
          var expiresIn = results.expiresIn;

          var updateTime = results.updateTime;

          var timeNow = new Date();

          if(!util.validExipiresId(updateTime, expiresIn
          )) {
            logError("authenticateToken: token out of expires");
            callback(null, false);
          } else {
            log("authenticateToken: get token succeed.");

            req.clientId = results.clientId;

            callback(null, true);
          }
        }
    })
    .catch(function(err) {
      logError("authenticateToken: find token error.", err);
      callback(err, false);
    })
}

// ------------------------------------------------
