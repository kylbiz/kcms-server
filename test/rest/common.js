var fs = require("fs");
var restify = require('restify');

var Common = function() {

}
module.exports = Common;

Common.getToken = function(callback) {
  fs.readFile('./token.txt', function(err, data) {
    if(err) {
      util.log("Test: get token error.", err);
      callback(err, null);
    } else {
      var access_token = JSON.parse(data.toString()).access_token;
      var token_type = JSON.parse(data.toString()).token_type

      callback(null, {
        token_type: token_type,
        access_token: access_token
      })
    }
  })
}

Common.getClient = function (callback) {
  fs.readFile('./token.txt', function(err, data) {
    if(err) {
      util.log("Test: get token error.", err);
      callback(err, null);
    } else {
      var access_token = JSON.parse(data.toString()).access_token;
      var token_type = JSON.parse(data.toString()).token_type

      var client = restify.createJsonClient({
        url: 'http://localhost:3000',
        headers: {
          authorization: token_type + " " + access_token
        }
      });

      callback(null, client);
    }
  })
}
