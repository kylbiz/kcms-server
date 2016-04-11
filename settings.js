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
    port: 3000
  },
  auth: {
    app_id: "kyl_app_id",
    app_secret: "kyl_app_secret"
  },
  nodeHost: {
    tophost: "tophost",
    virtualhost: "virtualhost"
  },
  collectionLists: [
		"Host",
	  "users",
	  "NavLists",
	  "NavMap",
	  "NodeMap",
	  "Node",
    "Ktype",
    "KValue"
  ],
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
      min: 6
    }
  }
}
