var restify = require("restify");

var restifyOAuth2 = require("restify-oauth2");
var hooks = require("./lib/oauth/hooks");

var API = require("./api");

var KCMS = require('./lib/kcms').KCMS;
var kcms = new KCMS();

var Init = require("./lib/init").Init;
var init = new Init();

init.initUser();


var serverSettings = require("./settings").server;
var port = serverSettings.port;

var settings = require('./settings');
var authSettings = settings.auth;
var app_id = authSettings.app_id;
var app_secret = authSettings.app_secret;

var Util = require("./utils/util").Util;
var util = new Util();

//-------------------------------------------------
var server = restify.createServer({
  name: "kcms-server",
  version: '1.0.0',
  formatters: {
      "application/hal+json": function (req, res, body, cb) {
          return res.formatters["application/json"](req, res, body, cb);
      }
    }
});

var RESOURCES = Object.freeze({
    INITIAL: "/",
    TOKEN: "/token",
    PUBLIC: "/public",
    SECRET: "/api/secret"
});


//-------------------------------------------------

server.use(restify.acceptParser(server.acceptable));
server.use(restify.CORS());
server.use(restify.authorizationParser());
server.use(restify.dateParser());
server.use(restify.queryParser());
server.use(restify.jsonp());
server.use(restify.gzipResponse());
server.use(restify.bodyParser({mapParams: false}));

restifyOAuth2.ropc(server, { tokenEndpoint: RESOURCES.TOKEN, hooks: hooks });

//-------------------------------------------------
// test connection use post
server.post(API.test.api, kcms.test)

//-------------------------------------------------
// ktype handle
// ktype represents a kind of node, which may be a folder,
// a file , an article, a photo, it is the sets of these concept.

server.post(API.createType.api, kcms.createType);

server.post(API.updateType.api, kcms.updateType);

server.post(API.removeType.api, kcms.removeType);

//-------------------------------------------------
// article handle

server.post(API.createPost.api, kcms.createPost);

server.post(API.updatePost.api, kcms.updatePost);

server.post(API.removePost.api, kcms.removePost);

//-------------------------------------------------
// host handle

server.post(API.updateHost.api, kcms.updateHost);

server.post(API.removeHost.api, kcms.removeHost);

//-------------------------------------------------

server.post(API.createUser.api, kcms.createUser);

server.post(API.resetPassword.api, kcms.resetPassword);

server.post(API.findUserByQuery.api, kcms.findUserByQuery);

//-------------------------------------------------

server.listen(port, function() {
  console.log('listening: %s', port);
})
