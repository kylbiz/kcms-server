var restify = require("restify");
var fs = require("fs");
var settings = require("./config");

var username = settings.username;
var password = settings.password;
var hostDomain = settings.hostDomain;
var grant_type = settings.grant_type;
var clientId = settings.clientId;
var clientSecret = settings.clientSecret;


var data = {
  grant_type: grant_type,
  username: username,
  password: password
}

var log = function(info) {
  console.log('-------------------------------');
  for(var i = 0, length = arguments.length; i < length; i++) {
    console.log(arguments[i]);
  }
}

var client = restify.createJsonClient({
  url: 'http://localhost:3000'
});

client.basicAuth(clientId, clientSecret);

client.post('/token', data, function(err, req, res, obj) {
  if(err) {
    log("Test: error get token.", err);
  } else {
    log("Test: succeed get token.", obj);

    fs.writeFile('./token.txt', JSON.stringify(obj))
  }
})
