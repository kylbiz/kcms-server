var UserClient = require("../../lib/oauth/client").UserClient;

var userClient = new UserClient();

var util = new (require("../../utils/util").Util)

var CollectionDb = require("../../collection/collection");

var collectionDb = new CollectionDb();


var testCreateClient = function(options){
  var createOptions = {
    username: options.username
  }

  userClient.createClientByUser(createOptions)
    .then(function(results) {
      util.log("Test: create client succeed.");
    })
    .catch(function(err) {
      util.logError("Test: create client error.");
    })
}

testCreateClient({
  username: "admin"
})

// ---------------------------------------------------

var testUpdateClientSecret = function(options) {
  var findOneOptions = {
    collectionName: "users",
    query: {
      username: options.username
    }
  }

  collectionDb.findOne(findOneOptions)
    .then(function(results) {
      if(!util.isJson(results)
        ||!results.hasOwnProperty("_id")) {
        util.log("Test: update client secret error.")
      } else {
          var userId = results._id;

          var findClientIdOptions = {
            collectionName: "clients",
            query: {
              userId: userId
            }
          }

          collectionDb.findOne(findClientIdOptions)
            .then(function(results) {
              if(!util.isJson(results)
              ||  !results.hasOwnProperty("client_id")) {
                util.log("Test: update lient secret error for not exists user client");
              } else {
                var client_id = results.client_id;

                var updateOptions = {
                  userId: userId,
                  client_id: client_id
                }

                userClient.updateClientSecret(updateOptions)
                  .then(function(results) {
                    util.log("Test: update client secret succeed.");
                  })
                  .catch(function(err) {
                    util.log("Test: update client secret error.", err);
                  })

              }
            })
        }
    })
}
//
// testUpdateClientSecret({
//   username: "zunkun"
// })





// ---------------------------------------------------
