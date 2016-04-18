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
  auth: {
    app_id: "kyl_app_id",
    app_secret: "kyl_app_secret"
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
    users: "users"
  },
  classType: {
    post: 'post'
  },
  domain: { // user must provide domain configuration
    defaultDomain: 'kyl.biz',
    hostDomain: "kyl.biz"
  },
  accounts: {
    password: {
      // Reference: http://bbs.csdn.net/topics/390805595
      reg: /^[a-zA-Z]\w{5,17}/,
      errorMsg: "密码不能为中文，且长度在6-18之间"
    }
  }
}
