var Posts = require('../lib/posts').Posts;

var postClient = new Posts();

var settings = require("../settings");
var authSettings = settings.auth;

var app_id = authSettings.app_id;
var app_secret = authSettings.app_secret;


var hostDomain = settings.domain.hostDomain;

var kvalueDb = settings.collection.kvalue;


var CollectionDb = require("../collection/collection");
var collectionDb = new CollectionDb();

var Util = require("../utils/util").Util;
var util = new Util();

var log = util.log;

// ------------------------------------------------
var typeId = "type_abcdef";
var kVName = "开业啦简介";
var title = "开业啦简介";
var content = "开公司找开业啦，在线操作，注册公司只需三步，从此告别繁琐流程。让你足不出户开公司。所有业务均为自营，品质有保证，给你真正便捷、透明、高效的服务体验.";

var testCreatePosts = function() {
  var options = {
    app_id: app_id,
    app_secret: app_secret,
    hostDomain: hostDomain,
    typeId: typeId,
    kVName: kVName,
    data: {
      title: title,
      content: content
    }
  }

  postClient.createPost(options)
    .then(function(results) {
      log("Test: create post succeed.", results);
    })
    .catch(function(err) {
      log("Test: create post error.", err);
    })
}

// testCreatePosts();

// ------------------------------------------------

var testUpdatePost = function() {
  var findOneOptions = {
    app_id: app_id,
    app_secret: app_secret,
    hostDomain: hostDomain,
    collectionName: kvalueDb,
    query: {
      classType: "post"
    }
  }

  collectionDb.findOne(findOneOptions)
    .then(function(results) {
      if(!results) {
        log("Test: can not find one post.", results);
      } else {
        var nodeId = results.nodeId;

        var options = {
          app_id: app_id,
          app_secret: app_secret,
          hostDomain: hostDomain,
          nodeId: nodeId,
          post: {
            title: "aaaaaaa",
            content: "bbbbbbb"
          }
        }

        postClient.updatePost(options)
          .then(function(results) {
            log("Test: update post succeed");
          })
          .catch(function(err) {
            log("Test: update post error.", err);
          })
      }
    })
}


// testUpdatePost();

// ------------------------------------------------
var testRemovePost = function() {
  var findOneOptions = {
    app_id: app_id,
    app_secret: app_secret,
    hostDomain: hostDomain,
    collectionName: kvalueDb,
    query: {
      classType: "post"
    }
  }

  collectionDb.findOne(findOneOptions)
    .then(function(results) {
      if(!results) {
        log("Test: can not find one post.", results);
      } else {
        var nodeId = results.nodeId;

        var options = {
          app_id: app_id,
          app_secret: app_secret,
          hostDomain: hostDomain,
          nodeId: nodeId
        }

        postClient.removePost(options)
          .then(function(results) {
            log("Test: remove post succeed.");
          })
          .catch(function(err) {
            log("Test: remove post error.", err);
          })

      }
    })
}

testRemovePost();

// ------------------------------------------------
