var util = new (require("../../utils/util").Util)

var Common = require('./common');

var hostDomain = "liuzunkun.com"

var createTypeUrl = '/api/type/create';

var createTypeOptions = {
  hostDomain: hostDomain,
  typeName: '休息岛'
}

Common.getClient(function(err, client) {
  if(err) {
    util.log('get client error.');
  } else {
    if(!client) {
      util.log("client not exists.");
    } else {

      client.post(createTypeUrl,
        createTypeOptions,
        function(err, req, res, obj) {
          if(err) {
            util.log("Test: create type error.", err);
          } else {
            util.log("Test: create type succeed.", obj);
          }
        })
    }
  }
})

var updateKtypeOptions = {
  hostDomain: hostDomain,
  typeId: 'ktypeuN8G32prLL',
  typeName: '休息岛2'
}

 var updateTypeUrl = '/api/type/update'

Common.getClient(function(err, client) {
  if(err) {
    util.log('get client error.');
  } else {
    if(!client) {
      util.log("client not exists.");
    } else {

      client.post(updateTypeUrl,
        updateKtypeOptions,
        function(err, req, res, obj) {
          if(err) {
            util.log("Test: update type error.", err);
          } else {
            util.log("Test: update type succeed.", obj);
          }
        })
    }
  }
})

var removeTypeUrl = '/api/type/remove';

var removeTypeOptions = {
  typeId: 'ktypeuN8G32prLL',
  hostDomain: hostDomain
}

Common.getClient(function(err, client) {
  if(err) {
    util.log('get client error.');
  } else {
    if(!client) {
      util.log("client not exists.");
    } else {

      client.post(removeTypeUrl,
        removeTypeOptions,
        function(err, req, res, obj) {
          if(err) {
            util.log("Test: remove type error.", err);
          } else {
            util.log("Test: remove type succeed.", obj);
          }
        })
    }
  }
})
