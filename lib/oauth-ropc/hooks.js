var CollectionDb = require("../../collection/collection");

var collectionDb = new CollectionDb();

var settings = require("../../settings");

var Accounts = require("../accounts-server.js").Accounts;

var crypto = require("crypto");

var accountsClient = new Accounts();
var clientDb = settings.collection.client;
var tokenDb = settings.collection.token;
var clientDb = settings.collection.client;
var userDb = settings.collection.users;

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

exports.validateClient = function (credentials, req, callback) {
  log("validateClient: Hi I am called.");
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

              callback(null, true);
            }
          }
      })
      .catch(function(err) {
        logError("validateClient: findOne client error.");
        callback(err, false);
      })
  }
};

// ------------------------------------------------
exports.grantUserToken = function (credentials, req, callback) {
  log("grantUserToken: Hi I am called.");
  var errStr = "";
  if(!util.isJson(credentials)
  || !credentials.hasOwnProperty("username")
  || !credentials.hasOwnProperty("password")) {
    errStr = "grantUserToken: you should provide username and password.";
    logError(errStr, credentials);
    callback(null, false);
  } else {
    var username = credentials.username;
    var password = credentials.password;

    log(credentials)
    var findOneOptions = {
      collectionName: userDb,
      query: {
        username: username
      }
    }

    collectionDb.findOne(findOneOptions)
      .then(function(results) {
        if(!results
          || !results.hasOwnProperty("services")) {

            errStr = "grantUserToken: user not exists.";
            log(errStr);
            callback(null, false);
          } else {
            var passwordStr = util.getPasswordString(password);

            if(!util.bcryptCompare(passwordStr, results.services.password.bcrypt)) {
              errStr = "grantUserToken: password not match.";
              logError(errStr);
              callback(null, false);
            } else {
              log("grantUserToken: password match.");

              var token = generateToken(username + ":" + password);

              var userId = results._id;

              var clientId = credentials.clientId;

              var username = credentials.username;

              var updateTime = new Date();

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
                    username: username,
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
                  log("grantUserToken: save token succeed.");
                  callback(null, token);
                })
                .catch(function(err) {
                  errStr = "grantUserToken: save token error.";
                  logError(errStr, err);
                  callback(err, false);
                })
            }
          }
      })
      .catch(function(err) {
        errStr = "grantUserToken: find user error.";
        logError(errStr, err);

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
        || !results.hasOwnProperty("username")) {
          logError("authenticateToken: token doc does not contains username");
          callback(null, false);
        } else {
          var username = results.username;

          var expiresIn = results.expiresIn;

          var updateTime = results.updateTime;

          var timeNow = new Date();

          if(!util.validExipiresId(updateTime, expiresIn
          )) {
            logError("authenticateToken: token out of expires");
            callback(null, false);
          } else {
            log("authenticateToken: get token succeed.");

            req.username = username;
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
