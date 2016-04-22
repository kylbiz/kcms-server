module.exports = {
  test: {
    api: '/test',
    type: 'POST',
    description: 'connect test.'
  },
  createType: {
    api: '/api/type/create',
    type: 'POST',
    description: "create ktype"
  },
  updateType: {
    api: '/api/type/update',
    type: 'POST',
    description: 'update ktype'
  },
  removeType: {
    api: '/api/type/remove',
    type: 'POST',
    description: 'remove ktype'
  },
  createPost: {
    api: '/api/post/create',
    type: 'POST',
    description: 'post an article.'
  },
  updatePost: {
    api: '/api/post/update',
    type: 'POST',
    description: 'update an article.'
  },
  removePost: {
    api: '/api/post/remove',
    type: 'POST',
    description: 'remove an article.'
  },
  updateHost: {
    api: '/api/host/update',
    type: 'POST',
    description: 'create/update host.'
  },
  removeHost: {
    api: '/api/host/remove',
    type: 'POST',
    description: 'remove host'
  },
  createUser: {
    api: '/api/user/create',
    type: 'POST',
    description: 'creat an user'
  },
  resetPassword: {
    api: '/api/password/reset',
    type: 'POST',
    description: 'reset password'
  },
  findUserByQuery: {
    api: '/api/user/query',
    type: 'POST',
    description: 'find user by query'
  },
  createClientByUser: {
    api: '/api/user/client/create',
    type: 'POST',
    description: 'create user createId'
  },
  updateClientSecret: {
    api: '/api/user/client/update',
    type: 'POST',
    description: 'update user clientSecret'
  },
  createCollection: {
    api: '/api/collection/create',
    type: 'POST',
    description: 'create an collection'
  },
  dropCollection: {
    api: '/api/collection/drop',
    type: 'POST',
    description: 'drop an collection'
  },
  renameCollection: {
    api: '/api/collection/rename',
    type: 'POST',
    description: 'rename an collection'
  },
  insertOne: {
    api: '/api/doc/insert',
    type: 'POST',
    description: 'insert an document to db'
  },
  findAndModify: {
    api: '/api/doc/modify',
    type: 'POST',
    description: 'find an doc and modify'
  },
  findAndRemove: {
    api: '/api/doc/remove',
    type: 'POST',
    description: 'find and doc and remove it'
  },
  removeDocs: {
    api: '/api/docs/remove',
    type: 'POST',
    description: 'remove documents'
  },
  queryDocs: {
    api: '/api/docs/query',
    type: 'POST',
    description: 'query docs from db'
  },
  queryOneDoc: {
    api: '/api/doc/query',
    type: 'POST',
    description: 'find one doc'
  },
  updateDocs: {
    api: '/api/docs/update',
    type: 'POST',
    description: 'update docs'
  },
  createNode: {
    api: '/api/node/create',
    type: 'POST',
    description: 'create node handle.'
  },
  updateNodeByName: {
    api: '/api/node/name/update',
    type: 'POST',
    description: 'update node by name'
  },
  updateNodeByNodeId: {
    api: '/api/node/id/update',
    type: 'POST',
    description: 'update node by id'
  },
  linkNode: {
    api: '/api/node/link',
    type: 'POST',
    description: 'link node handle.'
  },
  unlinkNode: {
    api: '/api/node/unlink',
    type: 'POST',
    description: 'unlink node handle.'
  },
  removeNode: {
    api: '/api/node/remove',
    type: 'POST',
    description: 'remove node physicaly'
  },
  copyNode: {
    api: '/api/node/copy',
    type: 'POST',
    description: 'copy node to another node if current node has no sons.'
  }
}
