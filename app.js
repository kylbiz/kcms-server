var restify = require("restify");
var serverSettings = require("./settings").server;
var port = serverSettings.port;

var Init = require("./lib/init").Init;
var init = new Init();

var settings = require('./settings');
var authSettings = settings.auth;
var app_id = authSettings.app_id;
var app_secret = authSettings.app_secret;

var Util = require("./utils/util").Util;
var util = new Util();

//-------------------------------------------------
var server = restify.createServer();

//-------------------------------------------------

server.use(restify.acceptParser(server.acceptable));
server.use(restify.CORS());
server.use(restify.authorizationParser());
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.jsonp());
server.use(restify.gzipResponse());
server.use(restify.bodyParser());

//-------------------------------------------------
/**
 * test if connected to the server
 * @return {json} return data about connect status
 */
server.post("/test", function(req, res, next) {
	var userData = JSON.parse(req.body);
	var message = "";

	if(!userData
		|| !util.auth(userData)) {
		res.send({success: false, message: "error connect to the server."})
	} else {
		if(userData.hasOwnProperty("message")){
			message = userData.message
		}

		res.send({success: true, message: message});
	}
	next();
})

//-------------------------------------------------

server.listen(port, function() {
  console.log('listening: %s', port);
  init.initDb();
})
