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
  module: {
    tophost: "tophost",
    virtualhost: "virtualhost"
  },
  collectionLists: [
		"Host",
	  "users",
	  "NavLists",
	  "NavMap",
	  "ModuleLists",
	  "ModuleMap",
	  "Module",
	  "ArticleLists",
	  "Article"
  ],
  collection: {
    module: {
      moduleDb: "Module",
      moduleMapDb: "ModuleMap",
      moduleListsDb: "ModuleLists"
    }
  },
  domain: { // user must provide domain configuration
    defaultDomain: 'kyl.biz',
    hostDomain: "kyl.biz"
  }
}
