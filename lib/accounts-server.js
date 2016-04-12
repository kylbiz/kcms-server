// References: meteor accounts-password
//https://github.com/meteor/accounts/blob/master/packages/accounts-password

// ------------------------------------------------
var Promise = require("bluebird");
var bcrypt = require('bcrypt');
var bcryptHash = bcrypt.hashSync;
var bcryptCompare = bcrypt.compare;
var SHA256 = require("sha256");

var CollectionDb = require("../collection/collection");

var settings = require("../settings");

var authSettings = settings.auth;
var app_id = authSettings.app_id;
var app_secret = authSettings.app_secret;

var khostDomain = settings.domain.hostDomain;
var minPasswordLength = settings.accounts.password.min;
var userDb = settings.collection.users;

var Util = require("../utils/util").Util;
var util = new Util();

var log = util.log;
var logError = util.logError;



var hasOwnProperty = Object.prototype.hasOwnProperty;

// ------------------------------------------------

function Accounts () {
  this.name = "Accounts";
  this.collectionDb = new CollectionDb();
}

exports.Accounts = Accounts;

// ------------------------------------------------
Accounts._bcryptRounds = 10;

// ------------------------------------------------
// Given a 'password' from the client, extract the string that we should
// bcrypt. 'password' can be one of:
//  - String (the plaintext password)
//  - Object with 'digest' and 'algorithm' keys. 'algorithm' must be "sha-256".
//
var getPasswordString = function (password) {
  if (typeof password === "string") {
    password = SHA256(password);
  } else { // 'password' is an object
    if (password.algorithm !== "sha-256") {
      throw new Error("Invalid password hash algorithm. " +
                      "Only 'sha-256' is allowed.");
    }
    password = password.digest;
  }
  return password;
};

// ------------------------------------------------

// Use bcrypt to hash the password for storage in the database.
// `password` can be a string (in which case it will be run through
// SHA256 before bcrypt) or an object with properties `digest` and
// `algorithm` (in which case we bcrypt `password.digest`).
//
var hashPassword = function (password) {
  password = getPasswordString(password);
  return bcryptHash(password, Accounts._bcryptRounds);
};

// ------------------------------------------------

Accounts.prototype.existsUser = function(options) {
  log("existsUser: Hi I am called.");
  var self = this;

  return new Promise(function(resolve, reject) {
    if(!util.auth(options)
      || !options.hasOwnProperty("userQuery")) {
        log("existsUser: options illegal.")
        reject("existsUser: options illegal.");
      } else {

        var findOneOptions = {
          app_id: options.app_id,
          app_secret: options.app_secret,
          collectionName: userDb,
          query: {
            $or: options.userQuery
          }
        }
        log(options.userQuery)
        log(findOneOptions)

        self.collectionDb.findOne(findOneOptions)
          .then(function(results) {
            if(results) {
              resolve({isExists: true});
            } else {
              resolve({isExists: false});
            }
          })
          .catch(function(err) {
            logError("existsUser: find user error.", err);
            reject(err);
          })
      }
  })
}

// ------------------------------------------------
// create user must have at least one among username and email
/**
 * @param {string} app_id
 * @param {string} app_secret
 * @param username or email
 * @param {string} password
 */
Accounts.prototype.createUser = function (options) {
  log("createUser: Hi I am called.");
  var self = this;
  return new Promise(function(resolve, reject) {
    var errStr = "";

    if(!util.auth(options)) {
      errStr = "createUser: options should have app_id and app_secret"
      log(errStr, options);
      reject(errStr);

    } else if(!hasOwnProperty.call(options, "username")
      && !hasOwnProperty.call(options, "email")){
      errStr = "createUser: options shall have username or email.";
      log(errStr, options);
      reject(errStr);

    } else if(options.username && typeof(options.username) !== "string"
      ||(options.email && !util.isEmail(options.email))){
      errStr = "createUser: username or email should be right partten.";
      log(errStr, options);
      reject(errStr);

    } else if(!hasOwnProperty.call(options, "password")) {
      errStr = "createUser: you shall provide password.";
      log(errStr);
      reject(errStr)
    }  else if(!util.legalPassword(options.password)) {
      errStr = settings.accounts.password.errorMsg;
      log(errStr);
      reject(errStr);
    } else {

      var user = {
        services: {
          password: {},
          resume: {}
        },
        profile: {}
      };
      var userStr = "";

      if(options.hasOwnProperty("profile")) {
        user.profile = options.profile;
      }

      if (options.password) {
        var hashed = hashPassword(options.password);
        user.services.password = { bcrypt: hashed };
      }

      user.services.resume.loginTokens = [];

      var userQuery = [];

      if (options.username) {
        user.username = options.username;
        userQuery.push({username: options.username})
        userStr += " username: [" + options.username + "] ";
      }

      if (options.email) {
        user.emails = [{address: options.email, verified: false}];
        userQuery.push({"emails.address": RegExp(options.email, "i")})
        userStr += " email: [" + options.email + "] ";
      }

      user.createAt = new Date();

      var insertOptions = {
        app_id: app_id,
        app_secret: app_secret,
        collectionName: userDb,
        data: user
      }

      // verify if exists username
      var usernameOptions = {
        app_id: app_id,
        app_secret: app_secret,
        userQuery: userQuery
      }

      self.existsUser(usernameOptions)
        .then(function(results) {
          if(results.isExists) {
            reject({success: false, message: "exists user " + userStr});
          } else {
            log("createUser: user not exists then create user.");

            self.collectionDb.insertOne(insertOptions)
              .then(function(results) {
                log("createUser: create user " + userStr + " succeed.");
                resolve(results);
              })
              .catch(function(err) {
                logError("createUser: create user " + userStr + " error.");
                reject(err);
              })
          }
        })
        .catch(function(err) {
          logError("createUser: find user  " + userStr + " exists error.");
          reject(err);
        })
    }
  })
};

Accounts.resetPassword = function (options) {

};

Accounts.forgetPassword = function (options) {

};

Accounts.findUserByName = function (options) {

};

Accounts.findUserById = function (options) {

};

Accounts.findUserByEmail = function (options) {

};

Accounts.findUserByQuery = function (options) {

};


// ------------------------------------------------













// ------------------------------------------------















// ------------------------------------------------
