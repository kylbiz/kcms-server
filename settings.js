module.exports = {
  db: {
    db: 'kcms',
    user: 'kcms', // this user shall have readWrite handle role
    password: 'kcms',
    host: 'localhost',
    port: 27017,
    poolSize: 30000
  },
  server: {
    port: 3000,
    name: "kcms_server" // this server name you shall define
  },
  admin: {
    username: 'admin',
    password: 'kylbiz123',
    roles: ['develop', 'customer'],
    clientName: 'kcms'
  },
  auth: {
    expiresIn: 7200
  },
  nodeHost: {
    tophost: "tophost",
    virtualhost: "virtualhost"
  },
  collection: {
    node: {
      nodeDb: "Node",
      nodeMapDb: "NodeMap",
      nodeListsDb: "NodeLists"
    },
    ktype: "Ktype",
    kvalue: 'KValue',
    users: "users",
    client: 'clients',
    token: 'token'
  },
  classType: {
    post: 'post'
  },
  accounts: {
    password: {
      // Reference: http://bbs.csdn.net/topics/390805595
      reg: /^[a-zA-Z]\w{5,17}/,
      errorMsg: "密码不能为中文，且长度在6-18之间"
    }
  }
}
