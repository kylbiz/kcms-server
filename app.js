var restify = require("restify");
var serverSettings = require("./settings").server;
var port = serverSettings.port;

var Init = require("./lib/init").Init;
var init = new Init();

console.log(init)

//-------------------------------------------------
var server = restify.createServer(function() {
	
});

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
 * print array of information
 * @param  {array} 
 */
function log(info) {
	console.log('--------------------------');

	for(var i = 0, max = arguments.length; i < max; i+=1) {
		console.log(arguments[i]);
	}
}

//-------------------------------------------------
/**
 * test if connected to the server
 * @return {json} return data about connect status
 */
server.post("/test", function(req, res, next) {
	var userData = JSON.parse(req.body);
	var message = "";

	if(!userData
		|| !userData.hasOwnProperty("app_id")
		|| !userData.hasOwnProperty("app_secret")
		|| userData.app_id !== "kyl_app_id"
		|| userData.app_secret !== "kyl_app_secret") {

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






//-------------------------------------------------

server.listen(port, function() {
  console.log('listening: %s', port);
  init.initDb();
})


