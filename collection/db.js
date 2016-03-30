// 连接数据库
var dbsettings = require('../settings.js').db;

var dburl = "mongodb://"
  + dbsettings.user + ":"
  + dbsettings.password + "@"
  + dbsettings.host + ":"
  + dbsettings.port + "/"
  + dbsettings.db;


var Promise = require("bluebird");

var mongodb = Promise.promisifyAll(require("mongodb"));

Db = mongodb.Db;

Server = mongodb.Server;
MongoClient = mongodb.MongoClient;

function DBClient() {

}

module.exports = DBClient;


DBClient.prototype.close = function(db) {
  var self = this;

  return new Promise(function(resolve, reject) {    
    db.close()
    .then(function(results) {

      console.log("DBClient: close db client succeed.");
      resolve(results)
    })
    .catch(function(e) {
      
      console.log("DBClient: close db client error.");
      reject(e);
    })
  })
}


DBClient.prototype.connect = function () {
  return new Promise(function(resolve, reject) {
      new MongoClient.connect(dburl, {
        uri_decode_auth: false,
        db: new Db(dbsettings.db,  new Server(dbsettings.host, dbsettings.port, {
            poolSize: dbsettings.poolSize
          }))
        }, function(err, db) {
        if (err) {
          console.log("DBClient: connect db %s error", dbsettings.db);
          console.log(err);
          reject(err);
        } else {
          console.log("DBClient: connect db %s succeed", dbsettings.db);
          resolve(db)
        };
      })
  })
}
