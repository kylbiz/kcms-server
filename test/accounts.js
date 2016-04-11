var Accounts = require("../lib/accounts-server").Accounts;

var accountsClient = new Accounts();

var authSettings = require("../settings").auth;
var app_id = authSettings.app_id;
var app_secret = authSettings.app_secret;


var Util = require("../utils/util").Util;
var util = new Util();

var log = util.log;

// ------------------------------------------------

var testCreateUser = function(options) {
  var userOptions = {
    app_id: app_id,
    app_secret: app_secret
  }

  if(options.hasOwnProperty("username")) {
    userOptions.username = options.username;
  }

  if(options.hasOwnProperty("email")) {
    userOptions.email = options.email;
  }

  if(options.hasOwnProperty("password")) {
    userOptions.password = options.password;
  }

  var profile = {
    site: "http://kyl.biz",
    phone: "1111111"
  }

  userOptions.profile = profile;

  log(userOptions)

  accountsClient.createUser(userOptions)
    .then(function(results) {
      log("Test: create user succeed", results);
    })
    .catch(function(err) {
      log("Test: create user error.", err);
    })
}

testCreateUser({
  username: "zunkun",
  password: "abcdefgh",
  email: "zunkun.liu@kyl.biz"
});




// ------------------------------------------------
