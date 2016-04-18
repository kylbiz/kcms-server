var restify = require("restify");
var express = require("express");
var session = require('express-session')

var KCMS = require('./lib/kcms').KCMS;
var kcms = new KCMS();

var serverSettings = require("./settings").server;
var port = serverSettings.port;

// var Init = require("./lib/init").Init;
// var init = new Init();

var settings = require('./settings');
var authSettings = settings.auth;
var app_id = authSettings.app_id;
var app_secret = authSettings.app_secret;

var Util = require("./utils/util").Util;
var util = new Util();


// var User = require("./oauth/controller/user");
var userController = require('./oauth/controllers/user');
var authController = require('./oauth/controllers/auth');
var oauth2Controller = require('./oauth/controllers/oauth2');
var clientController = require('./oauth/controllers/client');

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
server.post("/test", kcms.test)


// get develop user
// Create endpoint handlers for /users
// server.route('/users')
// server.post('/api/users', userController.postUsers)
// server.get('/api/users', authController.isAuthenticated, userController.getUsers);
//
//
// server.post('/api/clients' ,authController.isAuthenticated, clientController.postClients)
// server.get('/api/clients', authController.isAuthenticated, clientController.getClients);
//
// server.get('/api/oauth2/authorize', authController.isAuthenticated, oauth2Controller.authorization)
// server.post('/api/oauth2/authorize', authController.isAuthenticated, oauth2Controller.decision);


//-------------------------------------------------

server.listen(port, function() {
  console.log('listening: %s', port);
})
