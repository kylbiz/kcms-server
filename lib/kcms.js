var Promise = require("bluebird");

var settings = require("../settings");

// server authorizing configuration
var authSettings = settings.auth;
var app_id = authSettings.app_id;
var app_secret = authSettings.app_secret;

var Util = require("../utils/util").Util;
var util = new Util();

// print utils
var log = util.log;
var logError = util.logError;

// authorizing server handle util
// var auth = util.auth;

var hasOwnProperty = Object.prototype.hasOwnProperty;

// ------------------------------------------------

function KCMS(){
  this.name = "KCMS"
}

exports.KCMS = KCMS;

// ------------------------------------------------
/**
 * test if connected to the server
 * @return {json} return data about connect status
 */
KCMS.prototype.test = function(req, res, next) {
  log("test: Hi I am called.")

  if(!req.username) {
    var errStr = "test: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var userData = req.body;

    console.log(userData, userData)
    var message = "";

    if(!userData) {
      res.send({success: false, message: "error connect to the server."})
    } else {
      if(Object.prototype.hasOwnProperty.call(userData, "message")){
        message = userData.message
      }
      res.send({success: true, message: message});
    }
    next();
  }
}

// ------------------------------------------------

/**
 * create node rest service
 */
// KCMS.prototype.createNode = function(req, res, next) {
//   log("createNode: KCMS create node start.");
//
//   var options = req.body;
//
//
//
//
//
//
//
//
//
//
//
// }

// ------------------------------------------------
