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

var UserClient = require("./oauth-ropc/client").UserClient;
var userClient = new UserClient();

var CollectionDb = require("../collection/collection");
var collectionDb = new CollectionDb();

var NodeHandle = require("./knode").NodeHandle;
var nodeClient = new NodeHandle();

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
  log("test: API called.")

  if(!req.clientId) {
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
  log("createType: API called.");
  var errStr = "";
  if(!req.clientId) {
    errStr = "createPost: user authorization error.";
    next(errStr);
    logError(errStr);
    res.sendUnauthenticated();
  } else {
    var body = req.body;
		delete body.grant_type;

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
  log("updateType: API called.");
  var errStr = "";
  if(!req.clientId) {
    errStr = "updateType: user authorization error.";
    next(errStr);
    logError(errStr);
    res.sendUnauthenticated();
  } else {
    var body = req.body;
		delete body.grant_type;

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
  log("removeType: API called.");
  var errStr = "";
  if(!req.clientId) {
    errStr = "removeType: user authorization error.";
    next(errStr);
    logError(errStr);
    res.sendUnauthenticated();
  } else {
    var body = req.body;
		delete body.grant_type;

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
  log("createPost: API called.");
  var errStr = "";
  if(!req.clientId) {
    errStr = "createPost: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;
		delete body.grant_type;

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
  log("updatePost: API called.");
  var errStr = "";
  if(!req.clientId) {
    errStr = "updatePost: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;
		delete body.grant_type;

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
  log("removePost: API called.");
  var errStr = "";
  if(!req.clientId) {
    errStr = "removePost: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;
		delete body.grant_type;

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
  log("updateHost: API called.");
  var errStr = "";
  if(!req.clientId) {
    errStr = "updateHost: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;
		delete body.grant_type;

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
  log("removeHost: API called.");
  var errStr = "";
  if(!req.clientId) {
    errStr = "removeHost: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;
		delete body.grant_type;

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
  log("createUser: API called.");
  var errStr = "";
  if(!req.clientId) {
    errStr = "createUser: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;
		delete body.grant_type;

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
  log("resetPassword: API called.");
  var errStr = "";
  if(!req.clientId) {
    errStr = "resetPassword: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;
		delete body.grant_type;

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
  log("findUserByQuery: API called.");
  var errStr = "";
  if(!req.clientId) {
    errStr = "findUserByQuery: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;
		delete body.grant_type;

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

KCMS.prototype.createClientByUser = function(req, res, next) {
  log("createClientByUser: API called.");
  var errStr = "";
  if(!req.clientId) {
    errStr = "createClientByUser: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;
		delete body.grant_type;

    userClient.createClientByUser(body)
      .then(function(results) {
        log("createClientByUser: create clientId and clientSecret succeed.");
        res.send({status: 200, message: "create clientId and clientSecret succeed."});
      })
      .catch(function(err) {
        logError("createClientByUser: create clientId and clientSecret error.", err);
        res.send({error: true, error: err})
      })
    next();
  }
}

// ------------------------------------------------

KCMS.prototype.updateClientSecret = function(req, res, next) {
  log("updateClientSecret: API called.");
  var errStr = "";
  if(!req.clientId) {
    errStr = "updateClientSecret: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;
		delete body.grant_type;

    userClient.updateClientSecret(body)
      .then(function(results) {
        log("updateClientSecret: update clientSecret succeed.");
        res.send({status: 200, message: "update clientSecret succeed."});
      })
      .catch(function(err) {
        logError("updateClientSecret: update clientSecret error.", err);
        res.send({error: true, error: err})
      })
    next();
  }
}

// ------------------------------------------------

KCMS.prototype.updateClientSecret = function(req, res, next) {
  log("updateClientSecret: API called.");
  var errStr = "";
  if(!req.clientId) {
    errStr = "updateClientSecret: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;
		delete body.grant_type;

    userClient.updateClientSecret(body)
      .then(function(results) {
        log("updateClientSecret: update clientSecret succeed.");
        res.send({status: 200, message: "update clientSecret succeed."});
      })
      .catch(function(err) {
        logError("updateClientSecret: update clientSecret error.", err);
        res.send({error: true, error: err})
      })
    next();
  }
}

// ------------------------------------------------

KCMS.prototype.updateClientSecret = function(req, res, next) {
  log("updateClientSecret: API called.");
  var errStr = "";
  if(!req.clientId) {
    errStr = "updateClientSecret: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;
		delete body.grant_type;

    userClient.updateClientSecret(body)
      .then(function(results) {
        log("updateClientSecret: update clientSecret succeed.");
        res.send({status: 200, message: "update clientSecret succeed."});
      })
      .catch(function(err) {
        logError("updateClientSecret: update clientSecret error.", err);
        res.send({error: true, error: err})
      })
    next();
  }
}

// ------------------------------------------------

KCMS.prototype.createCollection = function(req, res, next) {
  log("createCollection: API called.");
  var errStr = "";
  if(!req.clientId) {
    errStr = "createCollection: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;
		delete body.grant_type;

    collectionDb.createCollection(body)
      .then(function(results) {
        log("createCollection: create collection succeed.");
        res.send({status: 200, message: "create collection succeed."});
      })
      .catch(function(err) {
        logError("createCollection: create collection error.", err);
        res.send({error: true, error: err})
      })
    next();
  }
}

// ------------------------------------------------

KCMS.prototype.dropCollection = function(req, res, next) {
  log("dropCollection: API called.");
  var errStr = "";
  if(!req.clientId) {
    errStr = "dropCollection: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;
		delete body.grant_type;

    collectionDb.dropCollection(body)
      .then(function(results) {
        log("dropCollection: drop collection succeed.");
        res.send({status: 200, message: "drop collection succeed."});
      })
      .catch(function(err) {
        logError("dropCollection: drop collection error.", err);
        res.send({error: true, error: err})
      })
    next();
  }
}

// ------------------------------------------------

KCMS.prototype.renameCollection = function(req, res, next) {
  log("renameCollection: API called.");
  var errStr = "";
  if(!req.clientId) {
    errStr = "renameCollection: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;
		delete body.grant_type;

    collectionDb.renameCollection(body)
      .then(function(results) {
        log("renameCollection: rename collection succeed.");
        res.send({status: 200, message: "rename collection succeed."});
      })
      .catch(function(err) {
        logError("renameCollection: rename collection error.", err);
        res.send({error: true, error: err})
      })
    next();
  }
}

// ------------------------------------------------

KCMS.prototype.insertOne = function(req, res, next) {
  log("insertOne: API called.");
  var errStr = "";
  if(!req.clientId) {
    errStr = "insertOne: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;
		delete body.grant_type;

    collectionDb.insertOne(body)
      .then(function(results) {
        log("insertOne: insert one doc succeed.");
        res.send({status: 200, message: "insert one doc succeed."});
      })
      .catch(function(err) {
        logError("insertOne: insert one doc error.", err);
        res.send({error: true, error: err})
      })
    next();
  }
}

// ------------------------------------------------

KCMS.prototype.findAndModify = function(req, res, next) {
  log("findAndModify: API called.");
  var errStr = "";
  if(!req.clientId) {
    errStr = "findAndModify: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;
		delete body.grant_type;

    collectionDb.findAndModify(body)
      .then(function(results) {
        log("findAndModify: find one doc and modify it succeed.");
        res.send({status: 200, message: "find one doc and modify it succeed."});
      })
      .catch(function(err) {
        logError("findAndModify: find one doc and modify it error.", err);
        res.send({error: true, error: err})
      })
    next();
  }
}

// ------------------------------------------------

KCMS.prototype.findAndRemove = function(req, res, next) {
  log("findAndRemove: API called.");
  var errStr = "";
  if(!req.clientId) {
    errStr = "findAndRemove: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;
		delete body.grant_type;

    collectionDb.findAndRemove(body)
      .then(function(results) {
        log("findAndRemove: find one doc and remove it succeed.");
        res.send({status: 200, message: "find one doc and remove it succeed."});
      })
      .catch(function(err) {
        logError("findAndRemove: find one doc and remove it error.", err);
        res.send({error: true, error: err})
      })
    next();
  }
}

// ------------------------------------------------

KCMS.prototype.removeDocs = function(req, res, next) {
  log("removeDocs: API called.");
  var errStr = "";
  if(!req.clientId) {
    errStr = "removeDocs: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;
		delete body.grant_type;

    collectionDb.remove(body)
      .then(function(results) {
        log("removeDocs: remove docs succeed.");
        res.send({status: 200, message: "remove docs succeed."});
      })
      .catch(function(err) {
        logError("removeDocs: remove docs error.", err);
        res.send({error: true, error: err})
      })
    next();
  }
}

// ------------------------------------------------

KCMS.prototype.queryDocs = function(req, res, next) {
  log("queryDocs: API called.");
  var errStr = "";
  if(!req.clientId) {
    errStr = "queryDocs: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;
		delete body.grant_type;

    collectionDb.find(body)
      .then(function(results) {
        log("queryDocs: query docs succeed.");
        res.send({status: 200, message: "query docs succeed."});
      })
      .catch(function(err) {
        logError("queryDocs: query docs error.", err);
        res.send({error: true, error: err})
      })
    next();
  }
}

// ------------------------------------------------

KCMS.prototype.queryOneDoc = function(req, res, next) {
  log("queryOneDoc: API called.");
  var errStr = "";
  if(!req.clientId) {
    errStr = "queryOneDoc: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;
		delete body.grant_type;

    collectionDb.find(body)
      .then(function(results) {
        log("queryOneDoc: query one doc succeed.");
        res.send({status: 200, message: "query one doc succeed."});
      })
      .catch(function(err) {
        logError("queryOneDoc: query one doc error.", err);
        res.send({error: true, error: err})
      })
    next();
  }
}

// ------------------------------------------------

KCMS.prototype.updateDocs = function(req, res, next) {
  log("updateDocs: API called.");
  var errStr = "";
  if(!req.clientId) {
    errStr = "updateDocs: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;
		delete body.grant_type;

    collectionDb.update(body)
      .then(function(results) {
        log("updateDocs: query docs succeed.");
        res.send({status: 200, message: "query docs succeed."});
      })
      .catch(function(err) {
        logError("updateDocs: query docs error.", err);
        res.send({error: true, error: err})
      })
    next();
  }
}

// ------------------------------------------------

KCMS.prototype.createNode = function(req, res, next) {
  log("createNode: API called.");
  var errStr = "";
  if(!req.clientId) {
    errStr = "createNode: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;
		delete body.grant_type;

    nodeClient.createNode(body)
      .then(function(results) {
        log("createNode: create node succeed.");
        res.send({status: 200, message: "query docs succeed."});
      })
      .catch(function(err) {
        logError("createNode:create node error.", err);
        res.send({error: true, error: err})
      })
    next();
  }
}

// ------------------------------------------------

KCMS.prototype.updateNodeByNodeId = function(req, res, next) {
  log("updateNodeByNodeId: API called.");
  var errStr = "";
  if(!req.clientId) {
    errStr = "updateNodeByNodeId: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;
		delete body.grant_type;

    nodeClient.updateNodeByNodeId(body)
      .then(function(results) {
        log("updateNodeByNodeId: update node by id succeed.");
        res.send({status: 200, message: "query docs succeed."});
      })
      .catch(function(err) {
        logError("updateNodeByNodeId:update node by id error.", err);
        res.send({error: true, error: err})
      })
    next();
  }
}

// ------------------------------------------------

KCMS.prototype.updateNodeByName = function(req, res, next) {
  log("updateNodeByName: API called.");
  var errStr = "";
  if(!req.clientId) {
    errStr = "updateNodeByName: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;
		delete body.grant_type;

    nodeClient.updateNodeByName(body)
      .then(function(results) {
        log("updateNodeByName: update node by name succeed.");
        res.send({status: 200, message: "query docs succeed."});
      })
      .catch(function(err) {
        logError("updateNodeByName:update node by name error.", err);
        res.send({error: true, error: err})
      })
    next();
  }
}

// ------------------------------------------------

KCMS.prototype.linkNode = function(req, res, next) {
  log("linkNode: API called.");
  var errStr = "";
  if(!req.clientId) {
    errStr = "linkNode: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;
		delete body.grant_type;

    nodeClient.linkNode(body)
      .then(function(results) {
        log("linkNode: link node handle succeed.");
        res.send({status: 200, message: "query docs succeed."});
      })
      .catch(function(err) {
        logError("linkNode:link node handle error.", err);
        res.send({error: true, error: err})
      })
    next();
  }
}

// ------------------------------------------------

KCMS.prototype.unlinkNode = function(req, res, next) {
  log("unlinkNode: API called.");
  var errStr = "";
  if(!req.clientId) {
    errStr = "unlinkNode: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;
		delete body.grant_type;

    nodeClient.unlinkNode(body)
      .then(function(results) {
        log("unlinkNode: unlink node handle succeed.");
        res.send({status: 200, message: "query docs succeed."});
      })
      .catch(function(err) {
        logError("unlinkNode:unlink node handle error.", err);
        res.send({error: true, error: err})
      })
    next();
  }
}

// ------------------------------------------------

KCMS.prototype.removeNode = function(req, res, next) {
  log("removeNode: API called.");
  var errStr = "";
  if(!req.clientId) {
    errStr = "removeNode: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;
		delete body.grant_type;

    nodeClient.removeNode(body)
      .then(function(results) {
        log("removeNode: remove node handle succeed.");
        res.send({status: 200, message: "query docs succeed."});
      })
      .catch(function(err) {
        logError("removeNode: remove node handle error.", err);
        res.send({error: true, error: err})
      })
    next();
  }
}

// ------------------------------------------------

KCMS.prototype.copyNode = function(req, res, next) {
  log("copyNode: API called.");
  var errStr = "";
  if(!req.clientId) {
    errStr = "copyNode: error authorization.";
    res.sendUnauthenticated();
    next(errStr);
  } else {
    var body = req.body;
		delete body.grant_type;

    nodeClient.copyNode(body)
      .then(function(results) {
        log("copyNode: copy node handle succeed.");
        res.send({status: 200, message: "query docs succeed."});
      })
      .catch(function(err) {
        logError("copyNode: copy node handle error.", err);
        res.send({error: true, error: err})
      })
    next();
  }
}

// ------------------------------------------------
