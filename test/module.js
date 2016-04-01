var Module = require('../lib/module').Module;

var moduleClient = new Module();

var AuthSettings = require("../settings").auth;
var app_id = AuthSettings.app_id;
var app_secret = AuthSettings.app_secret;


var Util = require("../utils/util").Util;
var util = new Util();

var log = util.log;


// ------------------------------------------------

var testCreateModule function () {
	var moduleOptions = {
		app_id: app_id,
		app_secret: app_secret,
		hostDomain: "kyl.biz",
		moduleEnName: "userdoc",
		moduleCnName: "user articles"
	}

	moduleClient.createModule(moduleOptions)
		.then(function(results) {
			log("createModule: this handle succeed.");
			log(results)
		})
		.catch(function(err) {
			log("createModule: this handle error.", err);
		})
}






// ------------------------------------------------
