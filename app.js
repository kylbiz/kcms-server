var restify = require("restify");

var restifyOAuth2 = require("restify-oauth2");
var hooks = require("./lib/oauth/hooks");


var KCMS = require('./lib/kcms').KCMS;
var kcms = new KCMS();

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
server.post("/test", kcms.test)

server.get(RESOURCES.INITIAL, function (req, res) {
    var response = {
        _links: {
            self: { href: RESOURCES.INITIAL },
            "http://rel.example.com/public": { href: RESOURCES.PUBLIC }
        }
    };

    if (req.username) {
        response._links["http://rel.example.com/secret"] = { href: RESOURCES.SECRET };
    } else {
        response._links["oauth2-token"] = {
            href: RESOURCES.TOKEN,
            "grant-types": "password",
            "token-types": "bearer"
        };
    }

    res.contentType = "application/hal+json";
    res.send(response);
});

server.get(RESOURCES.PUBLIC, function (req, res) {
    res.send({
        "public resource": "is public",
        "it's not even": "a linked HAL resource",
        "just plain": "application/json",
        "personalized message": req.username ? "hi, " + req.username + "!" : "hello stranger!"
    });
});

server.get(RESOURCES.SECRET, function (req, res) {
  console.log(req.username)
    if (!req.username) {
        return res.sendUnauthenticated();
    }

    var response = {
        "users with a token": "have access to this secret data",
        _links: {
            self: { href: RESOURCES.SECRET },
            parent: { href: RESOURCES.INITIAL }
        }
    };

    res.contentType = "application/hal+json";
    res.send(response);
});

//-------------------------------------------------

server.listen(port, function() {
  console.log('listening: %s', port);
})
