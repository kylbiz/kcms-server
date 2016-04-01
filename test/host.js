var Host = require('../lib/host').Host;

var host = new Host();

var authSettings = require("../settings").auth;
var app_id = authSettings.app_id;
var app_secret = authSettings.app_secret;


var Util = require("../utils/util").Util;
var util = new Util();

var log = util.log;

// ------------------------------------------------
var hostDomain = "liuzunkun.com";
var hostEnName = "liuzunkun";
var hostCnName = "liuzunkun website"
var hostDescription = "THE DOMAIN FOR LIUZUNKUN";
var updateHostOptions = {
	app_id: app_id,
	app_secret: app_secret,
	collectionName: host.dbName,
	hostCnName: hostCnName,
	hostEnName: hostEnName,
	hostDescription: hostDescription,
	hostDomain: hostDomain
};

host.updateHost(updateHostOptions)
	.then(function(results) {
		log("Test: update hosts " + hostDomain + " succeed.", results)
	})
	.catch(function(err) {
		log("Test: update hosts " + hostDomain + " error.", err);
	})











// ------------------------------------------------
