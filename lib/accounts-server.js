// References: meteor accounts-password
//https://github.com/meteor/accounts/blob/master/packages/accounts-password

// ------------------------------------------------
var Promise = require("bluebird");
var bcrypt = require('bcrypt');
var bcryptHash = bcrypt.hashSync;
var bcryptCompare = bcrypt.compareSync;
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
/**
 * verify if exists user
 * @param {string} app_id
 * @param {string} app_secret
 * @param {RegExp} userQuery
 */
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
// ------------------------------------------------
/**
 * INTERNAL FUNCTION: verify if password provided matches user password.
 * @param {string} app_id
 * @param {string} app_secret
 * @param {string} password
 * @param {RegExp} userQuery to find user
 * @return true if password right with object {passwordRight: true}
 */
Accounts.prototype._passwordRight = function(options) {
  log("_passwordRight: Hi I am called.");
  var self = this;
  var errStr = "";
  return new Promise(function(resolve, reject) {

    if(!util.auth(options)
      || !options.hasOwnProperty("password")
      || !options.hasOwnProperty("userQuery")) {
        errStr = "_passwordRight: you shall provide password and userQuery.";
        log(errStr, options);
        reject(errStr);
      } else {
        var password = options.password;

        var findOneOptions = {
          app_id: options.app_id,
          app_secret: options.app_secret,
          collectionName: userDb,
          query: {
            $or: options.userQuery
          }
        }

        self.collectionDb.findOne(findOneOptions)
          .then(function(results) {
            if(!results) {
              errStr = "_passwordRight: can not find user ";
              logError(errStr);
              reject(errStr);
            } else {
              var passwordStr = getPasswordString(password);

              if(!bcryptCompare(passwordStr, results.services.password.bcrypt)) {
                log("_passwordRight: password you provided not right.");
                resolve({passwordRight: false});
              } else {
                log("_passwordRight: password you provided right.");
                resolve({passwordRight: true});
              }
            }
          })
          .catch(function(err) {
            logError("_passwordRight: find user error.", err);
            reject(err);
          })
      }
  })
}

// ------------------------------------------------
/**
 * reset password function
 * @param {string} app_id
 * @param {string} app_secret
 * @param {string} username or email
 * @param {string} oldPassword
 * @param {string} newPassword
 */
Accounts.prototype.resetPassword = function (options) {
  log("resetPassword: Hi I am called.");
  var self = this;
  var errStr = "";
  return new Promise(function(resolve, reject) {
    if(!util.auth(options)) {
      errStr = "resetPassword: you shall provide app_id and app_secret.";
      logError(errStr);
      reject(errStr);
    } else if(!options.hasOwnProperty("username")
      && !options.hasOwnProperty("email")) {
      errStr = "resetPassword: you shall provide your accounts.";
      logError(errStr);
      reject(errStr);
    } else if(!options.hasOwnProperty("oldPassword")
      || !util.legalPassword(options.oldPassword)){
      errStr = "resetPassword: you shall provide legal partten old password.";
      logError(errStr);
      reject(errStr);
    } else if(!options.hasOwnProperty("newPassword")
      || !util.legalPassword(options.newPassword)){
      errStr = "resetPassword: you shall provide legal partten new password.";
      logError(errStr);
      reject(errStr);
    } else {

      var oldPassword = options.oldPassword;
      var newPassword = options.newPassword;

      var user = {};
      var userQuery = [];
      var userStr = "";

      if (options.hasOwnProperty("username")) {
        user.username = options.username;
        userQuery.push({username: options.username})
        userStr += " username: [" + options.username + "] ";
      }

      if (options.hasOwnProperty("email")) {
        user.emails = [{address: options.email, verified: false}];
        userQuery.push({"emails.address": RegExp(options.email, "i")})
        userStr += " email: [" + options.email + "] ";
      }

      // verify if exists username
      var oldPasswordOptions = {
        app_id: app_id,
        app_secret: app_secret,
        password: oldPassword,
        userQuery: userQuery
      }

      var hashedNewPassword = hashPassword(options.newPassword);

      var newPasswordOptions = {
        app_id: app_id,
        app_secret: app_secret,
        collectionName: userDb,
        selector: {
          "$or": userQuery
        },
        document: {
          $set: {
            "services.password.bcrypt": hashedNewPassword
          }
        }
      }

      self._passwordRight(oldPasswordOptions)
        .then(function(results) {
          if(!results.passwordRight) {
            errStr = "resetPassword: old password not right ";
            logError(errStr);
            reject(errStr);
          } else {

            self.collectionDb.update(newPasswordOptions)
              .then(function(results) {
                log("resetPassword: reset password for " + userStr + " scceed.");
                resolve(results);
              })
              .catch(function(err) {
                logError("resetPassword: reset password for " + userStr + " error.");
                reject(err);
              })
          }
        })
        .catch(function(err) {
          logError("resetPassword: find user  " + userStr + " error.");
          reject(err);
        })
    }
  })
};

// ------------------------------------------------
/**
 * find user by query, it should have at least one of these userId, email, username
 * @param {string} app_id
 * @param {string} app_secret
 * @param {string} <username|email|userId>
 * @return {Promise} user object
 */
Accounts.prototype.findUserByQuery = function (options) {
  log("findUserByQuery: Hi I am called.");
  var errStr = "";
  var self = this;
  return new Promise(function(resolve, reject) {
    if(!util.auth(options)) {
      errStr = "findUserByQuery: you shall provide app_id and app_secret";
      log(errStr);
      reject(errStr);
    } else if(!hasOwnProperty.call(options, "username")
      && !hasOwnProperty.call(options, "email")) {
      errStr = "findUserByQuery: you shall provide username or email.";
      log(errStr);
      reject(errStr);
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
        fieldName = "_id";
        fieldValue = options.userId;
      } else {
        var errStr = "findUserByQuery: shouldn't happen (validation missed something)";
        throw new Error(errStr);
        reject(errStr)
      }

      query[fieldName] = fieldValue;

      var findOneOptions = {
        app_id: app_id,
        app_secret: app_secret,
        collectionName: userDb,
        query: query,
        findOptions: {
          fields: {
            services: 0,
            createTime: 0,
            updateTime: 0,
            createAt: 0
          }
        }
      }

      self.collectionDb.findOne(findOneOptions)
        .then(function(results) {
          log("findUserByQuery: find user succeed.");
          resolve(results);
        })
        .catch(function(err) {
          logError("findUserByQuery: find user error.");
          reject(err);
        })
    }
  })
};

// ------------------------------------------------
