// 连接数据库
var dbsettings = require('../settings.js').db;

var Util = require('../utils/util').Util
var util = new Util();

var dburl = "mongodb://"
  + dbsettings.user + ":"
  + dbsettings.password + "@"
  + dbsettings.host + ":"
  + dbsettings.port + "/"
  + dbsettings.db;

util.log(dburl)

var Promise = require("bluebird");

var mongodb = Promise.promisifyAll(require("mongodb"));

Db = mongodb.Db;

Server = mongodb.Server;
MongoClient = mongodb.MongoClient;

new MongoClient.connect(dburl, {
  uri_decode_auth: false,
  db: new Db(
  	dbsettings.db,  
  	new Server(
  		dbsettings.host, 
  		dbsettings.port, 
  		{
      	poolSize: dbsettings.poolSize
    	}
  	)
	)}
).then(function(db) {
	util.log("create db succeed.");
	util.log(arguments);
}).catch(function(err) {
	util.log("create db error.");
	util.log(err)
})



