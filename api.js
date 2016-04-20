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
    api: '/api/user',
    type: 'POST',
    description: 'find user by query'
  }
}
