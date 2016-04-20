var Promise = require("bluebird");

var settings = require("../settings");

var Posts = require("./posts").Posts;
var postClient = new Posts();

var Ktype = require("./ktype").Ktype;
var ktypeClient = new Ktype();

var Host = require("./host").Host;
var hostClient = new Host();

var Accounts = require("./accounts-server").Accounts;
var accountsClient = new Accounts();

var Util = require("../utils/util").Util;
var util = new Util();

// print utils
var log = util.log;
var logError = util.logError;

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

    var message = "";

    if(!userData) {
      res.send({error: true, message: "error connect to the server."})
    } else {
      if(Object.prototype.hasOwnProperty.call(userData, "message")){
        message = userData.message
      }
      res.send({status: 200, message: message});
    }
    next();
  }
}

// ------------------------------------------------

KCMS.prototype.createType = function(req, res, next) {
  log("createType: Hi I am called.");
  var errStr = "";
  if(!req.username) {
    errStr = "createPost: user authorization error.";
    next(errStr);
    logError(errStr);
    res.sendUnauthenticated();
  } else {
    var body = req.body;

    ktypeClient.createType(body)
      .then(function(results) {
        log("createType: create type succeed.");
        res.send({status: 200, message: "create type succeed."});
        next();
      })
      .catch(function(err) {
        errStr = "createType: create type error";
        logError(errStr, err);
        res.send({error: true, message: err });
        next(errStr);
      })
  }
}

// ------------------------------------------------

KCMS.prototype.updateType = function(req, res, next) {
  log("updateType: Hi I am called.");
  var errStr = "";
  if(!req.username) {
    errStr = "updateType: user authorization error.";
    next(errStr);
    logError(errStr);
    res.sendUnauthenticated();
  } else {
    var body = req.body;

    ktypeClient.updateType(body)
      .then(function(results) {
        log("updateType: update type succeed.");
        res.send({status: 200, message: "update type succeed."});
        next();
      })
      .catch(function(err) {
        errStr = "updateType: update type error";
        logError(errStr, err);
        res.send({error: true, message: err });
        next(errStr);
      })
  }
}

// ------------------------------------------------

KCMS.prototype.removeType = function(req, res, next) {
  log("removeType: Hi I am called.");
  var errStr = "";
  if(!req.username) {
    errStr = "removeType: user authorization error.";
    next(errStr);
    logError(errStr);
    res.sendUnauthenticated();
  } else {
    var body = req.body;

    ktypeClient.removeType(body)
      .then(function(results) {
        log("removeType: remove type succeed.");
        res.send({status: 200, message: "remove type succeed."});
        next();
      })
      .catch(function(err) {
        errStr = "removeType: remove type error";
        logError(errStr, err);
        res.send({error: true, message: err });
        next(errStr);
      })
  }
}

// ------------------------------------------------

KCMS.prototype.createPost = function(req, res, next) {
  log("createPost: Hi I am called.");
  var errStr = "";
  if(!req.username) {
    errStr = "createPost: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;

    postClient.createPost(body)
      .then(function(results) {
        log("createPost: create post succeed.");
        res.send({status: 200, message: "create post succeed."});
      })
      .catch(function(err) {
        logError("createPost: create post error.", err);
        res.send({error: true, error: err})
      })
    next();
  }
}

// ------------------------------------------------

KCMS.prototype.updatePost = function(req, res, next) {
  log("updatePost: Hi I am called.");
  var errStr = "";
  if(!req.username) {
    errStr = "updatePost: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;

    postClient.updatePost(body)
      .then(function(results) {
        log("updatePost: update post succeed.");
        res.send({status: 200, message: "update post succeed."});
      })
      .catch(function(err) {
        logError("updatePost: update post error.", err);
        res.send({error: true, error: err})
      })
    next();
  }
}

// ------------------------------------------------

KCMS.prototype.removePost = function(req, res, next) {
  log("removePost: Hi I am called.");
  var errStr = "";
  if(!req.username) {
    errStr = "removePost: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;

    postClient.createPost(body)
      .then(function(results) {
        log("removePost: remove post succeed.");
        res.send({status: 200, message: "remove post succeed."});
      })
      .catch(function(err) {
        logError("removePost: remove post error.", err);
        res.send({error: true, error: err})
      })
    next();
  }
}

// ------------------------------------------------

KCMS.prototype.updateHost = function(req, res, next) {
  log("updateHost: Hi I am called.");
  var errStr = "";
  if(!req.username) {
    errStr = "updateHost: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;

    hostClient.updateHost(body)
      .then(function(results) {
        log("updateHost: update host succeed.");
        res.send({status: 200, message: "update host succeed."});
      })
      .catch(function(err) {
        logError("updateHost: update host error.", err);
        res.send({error: true, error: err})
      })
    next();
  }
}

// ------------------------------------------------

KCMS.prototype.removeHost = function(req, res, next) {
  log("removeHost: Hi I am called.");
  var errStr = "";
  if(!req.username) {
    errStr = "removeHost: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;

    hostClient.removeHost(body)
      .then(function(results) {
        log("removeHost: remove host succeed.");
        res.send({status: 200, message: "remove host succeed."});
      })
      .catch(function(err) {
        logError("removeHost: remove host error.", err);
        res.send({error: true, error: err})
      })
    next();
  }
}

// ------------------------------------------------

KCMS.prototype.createUser = function(req, res, next) {
  log("createUser: Hi I am called.");
  var errStr = "";
  if(!req.username) {
    errStr = "createUser: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;

    accountsClient.createUser(body)
      .then(function(results) {
        log("createUser: create user succeed.");
        res.send({status: 200, message: "create user succeed."});
      })
      .catch(function(err) {
        logError("createUser: create user error.", err);
        res.send({error: true, error: err})
      })
    next();
  }
}

// ------------------------------------------------

KCMS.prototype.resetPassword = function(req, res, next) {
  log("resetPassword: Hi I am called.");
  var errStr = "";
  if(!req.username) {
    errStr = "resetPassword: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;

    accountsClient.resetPassword(body)
      .then(function(results) {
        log("resetPassword: reset password succeed.");
        res.send({status: 200, message: "reset password succeed."});
      })
      .catch(function(err) {
        logError("resetPassword: reset password error.", err);
        res.send({error: true, error: err})
      })
    next();
  }
}

// ------------------------------------------------

KCMS.prototype.findUserByQuery = function(req, res, next) {
  log("findUserByQuery: Hi I am called.");
  var errStr = "";
  if(!req.username) {
    errStr = "findUserByQuery: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;

    accountsClient.findUserByQuery(body)
      .then(function(results) {
        log("findUserByQuery: find user by query succeed.");
        res.send({status: 200, message: "find user by query succeed."});
      })
      .catch(function(err) {
        logError("findUserByQuery: find user by query error.", err);
        res.send({error: true, error: err})
      })
    next();
  }
}

// ------------------------------------------------
