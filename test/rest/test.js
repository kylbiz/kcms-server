var restify = require("restify");

var fs = require('fs');

var settings = require("./config");

var Util = require("../../utils/util").Util;

var util = new Util();


var url = '/test';

fs.readFile('./token.txt', function(err, data) {
    if(err) {
      util.log("Test: get token error.", err);
    } else {
      var access_token = JSON.parse(data.toString()).access_token;
      var token_type = JSON.parse(data.toString()).token_type

      var client = restify.createJsonClient({
        url: 'http://localhost:3000',
        headers: {
          authorization: token_type + " " + access_token
        }
      });

      client.post(url,
        {message: 'hello, world!'},
        function(err, req, res, obj) {
          if(err) {
            util.log("Test: test post error.", err);
          } else {
            util.log("Test: test post succeed.", obj);
          }
      })
    }
})
