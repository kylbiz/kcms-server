
var settings = require("../settings");

var userDb = settings.collection.users;
var adminUserName = settings.admin.username;
var adminPassword = settings.admin.password;
var adminRoles = settings.admin.roles;
var clientName = settings.admin.clientName;

var hostDomain = settings.domain.hostDomain;

var Accounts = require('./accounts-server').Accounts;
var accountsClient = new Accounts();

var ClientHandler = require("./oauth-ropc/client").UserClient;
var clientHandler = new ClientHandler();


var Util = require("../utils/util").Util;
var util = new Util();

// ------------------------------------------------

function Init() {
	this.name = "Init";
};

exports.Init = Init;

// ------------------------------------------------
/**
 * init create user for developer
 */
Init.prototype.initUser = function() {
  util.log("initUser: Hi I am called.")
	var self = this;

  var createUserOptions = {
    username: adminUserName,
    password: adminPassword,
    hostDomain: hostDomain,
    profile: {
      roles: adminRoles
    }
  }

  accountsClient.createUser(createUserOptions)
    .then(function(results) {
      util.log("initUser: init user succeed.");
      util.log(results)
      if(results.hasOwnProperty("insertedIds")) {

        var userId = results.insertedIds[0];

        var clientOptions = {
          clientName: clientName,
          userId: userId
        }

        clientHandler.createClientByUser(clientOptions)
          .then(function(results) {
            util.log("initUser: create client succeed.");
          })
          .catch(function(err) {
            util.logError("initUser: create client error.", err);
          })
      }
    })
    .catch(function(err) {
      util.logError("initUser: init user error.", err)
    })
}

// ------------------------------------------------
