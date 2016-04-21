# kcms-server
KCMS2016 服务端组件

此组件是为了动态创建，组装，管理数据库中模块而开发，可以应用到网站开发之中。

最初目的，是为了在CMS搭建过程中，动态生成所需要组建，方便模块管理，目前项目还在开发阶段。


### 说明：
1. 本服务采用 oauth2 中的 [Resource Owner Password Credentials][ropc] , 需要提供 `username`, `password`, `clientId`, `clientSecret`, `grant_type`, 其中 `grant_type = password`。

2. 本服务采用 REST API 访问，需要使用 `Bearer + " " + token ` 写入 http 头中 `authorization ` 字段中

3. 本服务中的 `节点(node， 或者称为元素)` 概念 只是 虚拟的一个树中的一个节点，这个节点可以映射到任何一条数据库中的记录，可以是 一篇文章，一个文件，一张图片...， 在一个节点下面还可以有多个节点，也就是节点组合成为一棵树。

4. 本系统中有两个顶级节点，在 `settings` 中 `nodeHost` 中配置的 `tophost` 和 `virtualhost` ， 其中所有新创建的node 如何没有分配父节点(`fatherNode`)， 则其父节点自动分配到 `virtualhost`, 如果一个`node` 被删除，不是物理删除的那种，**则该节点以及其子节点会被打包指向了 `virtualhost`**, 建议 当用户可以看到或者确定使用的节点，将其最上层节点指向 `tophost`。 总的意思就是： `virtualhost` 节点下面的内容是 暂时不用或者已经删除的节点，而 `tophost` 才这正是你所需要使用的节点，如果不注意这点，使用本模块会非常受挫，你懂得。

### 运行服务
1. 此模块为nodejs项目，需要安装nodejs,  n `node v4.4.0`

2. 运行 `npm install`

3. 本服务组件目前使用的是 `mongodb 3.0` 作为数据库工具，需要提供相应的配置，在`settings.js` 这个文件中可以设置。

4. 运行 `node app` 启动服务

说明： 本组件提供 REST API ， 需要用户使用 REST 访问本服务。

### 访问服务

#### 获取 token
```
var client = restify.createJsonClient({
  url: 'http://localhost:3000'
});

client.basicAuth(clientId, clientSecret);

client.post('/token', data, function(err, req, res, obj) {
  if(err) {
    log("Test: error get token.", err);
  } else {
    log("Test: succeed get token.", token);

    fs.writeFile('./token.txt', JSON.stringify(tokn))
  }
})

```
建议本地保存 token , 其中 token 有时间限制， 不做返回 expiresId, 得到 token 结构 `{token_type: "", access: ""}`

#### 测试连接

###### 1. 写 http 头

```
var client = restify.createJsonClient({
  url: 'http://localhost:3000',
  headers: {
    authorization: token_type + " " + access_token
  }
});

```

###### 2. 测试是否能访问服务，`HTTP POST` 访问 `test` 接口，如下：

```
Method:  POST
Content-Type: application/json,
Authorization: Bearer + " " + access_token
API:  /test
Results:
{status: 200, message: ""}

```
示例如下：

```
var url = '/test';

client.post(url,
  {message: 'hello, world!'},
  function(err, req, res, obj) {
    if(err) {
      util.log("Test: test post error.", err);
    } else {
      util.log("Test: test post succeed.", obj);
    }
})

```

如果能过正确返回， 则表示已经访问服务成功，可以正确使用其他接口

### 接口说明

#### type 接口
为什么要创建 `type` ， 而且在所有创建节点之前都要指定 typeId, 这样是为了指示本节点究竟为什么类型节点，比如你创建一篇文章，你表示该节点是一个文章类型，或者更具体写是什么类型文章，你需要清楚，你创建的是什么。

###### 1. 创建 type

```
Method: POST
Content-Type: application/json,
Authorization: Bearer + " " + access_token
API: /api/type/update
```

|参数| 是否必须|参数说明|
|-----|-----|-----|
|typeName|T|当前 type 的中文名称|
|description|F| 当前 type 说明|
|hostDomain|T|标示 host domain 的参数，必须正确|

###### 2. 更新 type

```
Method: POST
Content-Type: application/json,
Authorization: Bearer + " " + access_token
API: /api/type/create
```

|参数| 是否必须|参数说明|
|-----|-----|-----|
|typeId|Y| 当前 type 结构的 typeId|
|typeName|F|当前 type 的中文名称|
|description|F| 当前 type 说明|
|hostDomain|Y|标示 host domain 的参数，必须正确|

说明： 修改的即是 typeName 和 description ，因此这两个参数至少有一个

###### 3. 删除 type

```
Method: POST
Content-Type: application/json,
Authorization: Bearer + " " + access_token
API: /api/type/remove
```

|参数| 是否必须|参数说明|
|-----|-----|-----|
|typeId|Y| 当前 type 结构的 typeId|
|hostDomain|Y|标示 host domain 的参数，必须正确|

#### post（文章） 接口

###### 1. 创建 post

```
Method: POST
Content-Type: application/json,
Authorization: Bearer + " " + access_token
API: /api/post/create
```
|参数| 是否必须|参数说明|
|-----|-----|-----|
|typeId|Y| 当前 type 结构的 typeId|
|hostDomain|Y|标示 host domain 的参数，必须正确|
|kVName|Y|节点信息标题，可以和文章标题相同|
|data|Y|文章具体内容|

其中 `data` 有下面结构

|参数| 是否必须|参数说明|
|-----|-----|-----|
|title|Y|文章标题|
|subtitle||文章子标题|
|createUserId||创建文章的用户ID|
|conetent|Y|文章具体内容|
|tags||文章的 tag， 其为 Array 类型 like [{tag: $tag}]|
|summary||文章摘要|
|createTime||创建时间|
|updateTime||修改时间|
|readTimes||阅读次数统计|
|postImgs||文章所属的图片连接 {Array}, like [{imgurl: $imgurl}]|

###### 2. 修改文章

```
Method: POST
Content-Type: application/json,
Authorization: Bearer + " " + access_token
API: /api/post/update
```

|参数| 是否必须|参数说明|
|-----|-----|-----|
|nodeId|Y| 当前 node 结构的 nodeId|
|hostDomain|Y|标示 host domain 的参数，必须正确|
|post|Y|JSON结构需要修改的 post内容|


###### 3. 删除文章

```
Method: POST
Content-Type: application/json,
Authorization: Bearer + " " + access_token
API: /api/post/remove
```

|参数| 是否必须|参数说明|
|-----|-----|-----|
|nodeId|Y| 当前 node 结构的 nodeId|
|hostDomain|Y|标示 host domain 的参数，必须正确|

#### 用户接口

###### 1. 创建用户

```
Method: POST
Content-Type: application/json,
Authorization: Bearer + " " + access_token
API: /api/user/create
```

|参数| 是否必须|参数说明|
|-----|-----|-----|
|username|Y|用户名称，和 email 必须有一个|
|email|Y|用户 email , 和 username 必须至少提供一个参数|
|password|Y|用户密码，需要符合用户密码设定规则，配置在 settings 文件中|
|hostDomain|Y|标示 host domain 的参数，必须正确|


###### 2. 重置用户密码

```
Method: POST
Content-Type: application/json,
Authorization: Bearer + " " + access_token
API: /api/password/reset
```
|参数| 是否必须|参数说明|
|-----|-----|-----|
|hostDomain|Y|标示 host domain 的参数，必须正确|
|username|Y|用户名称，和 email 必须有一个|
|email|Y|用户 email , 和 username 必须至少提供一个参数|
|oldPassword|Y|当前用户密码|
|newPassword|Y|修改新的用户密码|

###### 3. 查询用户信息

```
Method: POST
Content-Type: application/json,
Authorization: Bearer + " " + access_token
API: /api/user/query
```

|参数| 是否必须|参数说明|
|-----|-----|-----|
|hostDomain|Y|标示 host domain 的参数，必须正确|
|username|Y|用户名称，和 email, userId 必须有一个|
|email|Y|用户 email , 和 username, userId 必须至少提供一个参数|
|userId|Y| 用户 ID, 和 username, email 必须有一个|


#### 给指定用户分配 clientId 和 clientSecret

###### 1. 分配 clientId 和 clientSecret

```
Method: POST
Content-Type: application/json,
Authorization: Bearer + " " + access_token
API: /api/user/client/create
```

|参数| 是否必须|参数说明|
|-----|-----|-----|
|clientName|Y|用户授权的 client 名称|
|username|Y|用户名称，和 email, userId 必须有一个|
|email|Y|用户 email , 和 username, userId 必须至少提供一个参数|
|userId|Y| 用户 ID, 和 username, email 必须有一个|


###### 2. 修改 clientSecret

```
Method: POST
Content-Type: application/json,
Authorization: Bearer + " " + access_token
API: /api/user/client/update
```

|参数| 是否必须|参数说明|
|-----|-----|-----|
|userId|Y| 用户 ID, 和 username, email 必须有一个|
|clientId|Y| 用户授权的 client ID|


####  host 接口
host 是为了创建区分数据库中的数据的，而制定当前数据为那个 host , 由于在配置文件 settings 总有 host参数，所有暂时可以不需要这个参数，如果需要使用数据库中的host， 则可以修改相应的代码

###### 1. 创建/修改 host

```
Method: POST
Content-Type: application/json,
Authorization: Bearer + " " + access_token
API: /api/host/update
```
|参数| 是否必须|参数说明|
|-----|-----|-----|
|hostDomain|Y|标示 host domain 的参数，必须正确, 这是一个需要创建的参数|
|hostCnName|N|host 的中文名称|
|hostEnName|N|host 的英文名称，默认为 hostDomain|
|hostDescription|N| hostDomain 说明|

###### 2. 删除 host

```
Method: POST
Content-Type: application/json,
Authorization: Bearer + " " + access_token
API: /api/host/remove
```
|参数| 是否必须|参数说明|
|-----|-----|-----|
|hostDomain|Y|标示 host domain 的参数，必须正确|


### 数据库操作

###### 1. 创建 collection

```
Method: POST
Content-Type: application/json,
Authorization: Bearer + " " + access_token
API: /api/collection/create
```

|参数| 是否必须|参数说明|
|-----|-----|-----|
|collectionName|Y|需要创建的 collection 的名称|


###### 2. 删除 collection

```
Method: POST
Content-Type: application/json,
Authorization: Bearer + " " + access_token
API: /api/collection/drop
```

|参数| 是否必须|参数说明|
|-----|-----|-----|
|collectionName|Y|需要删除的 collection 的名称|


###### 3. 重命名 collection

```
Method: POST
Content-Type: application/json,
Authorization: Bearer + " " + access_token
API: /api/collection/rename
```

|参数| 是否必须|参数说明|
|-----|-----|-----|
|oldCollectionName|Y|需要修改的 collection 的名称|
|newCollectionName|Y|修改后的 collection 的名称|


###### 4. 插入一条数据

```
Method: POST
Content-Type: application/json,
Authorization: Bearer + " " + access_token
API: /api/doc/insert
```

|参数| 是否必须|参数说明|
|-----|-----|-----|
|collectionName|Y|需要插入到的 collection 的名称|
|data|Y|collection 中插入的数据|

data中可以是任何 json对象数据，不过其中可以有

|参数| 是否必须|参数说明|
|-----|-----|-----|
|updateTime|N| 数据更新时间|
|createTime|N| 数据创建时间|


###### 5. 查找并修改数据

```
Method: POST
Content-Type: application/json,
Authorization: Bearer + " " + access_token
API: /api/doc/modify
```

|参数| 是否必须|参数说明|
|-----|-----|-----|
|collectionName|Y|需要修改数据的 collection 的名称|
|query|Y| 数据查询条件|
|doc|Y|需要更新的数据|

具体操作可以查看 mongodb 的说明文档 [findAndModify]，此处不做解释


###### 6. 删除多条数据

```
Method: POST
Content-Type: application/json,
Authorization: Bearer + " " + access_token
API: /api/docs/remove
```

|参数| 是否必须|参数说明|
|-----|-----|-----|
|collectionName|Y|需要删除数据的 collection 的名称|
|selector|Y| 查询条件|

具体操作可以查看 mongodb 的说明文档 [remove]，此处不做解释


###### 7. 删除一条数据

```
Method: POST
Content-Type: application/json,
Authorization: Bearer + " " + access_token
API: /api/doc/remove
```

|参数| 是否必须|参数说明|
|-----|-----|-----|
|collectionName|Y|需要删除数据的 collection 的名称|
|selector|Y| 查询条件|

具体操作可以查看 mongodb 的说明文档 [findAndRemove]，此处不做解释

###### 8. 查找多条数据

```
Method: POST
Content-Type: application/json,
Authorization: Bearer + " " + access_token
API: /api/docs/query
```

|参数| 是否必须|参数说明|
|-----|-----|-----|
|collectionName|Y|需要查找数据的 collection 的名称|
|query|Y| 数据查询条件|

具体操作可以查看 mongodb 的说明文档 [find]，此处不做解释

###### 9. 查找单条数据

```
Method: POST
Content-Type: application/json,
Authorization: Bearer + " " + access_token
API: /api/doc/query
```

|参数| 是否必须|参数说明|
|-----|-----|-----|
|collectionName|Y|需要查找数据的 collection 的名称|
|query|Y| 数据查询条件|
|findOptions|N| 查询的 options|

具体操作可以查看 mongodb 的说明文档 [findOne]，此处不做解释



###### 10. 修改多条数据

```
Method: POST
Content-Type: application/json,
Authorization: Bearer + " " + access_token
API: /api/docs/update
```

|参数| 是否必须|参数说明|
|-----|-----|-----|
|collectionName|Y|需要修改数据的 collection 的名称|
|selector|Y|查询条件|
|document|Y|需要修改的document 对象|

具体操作可以查看 mongodb 的说明文档 [update]，此处不做解释



### LICENSE: MIT


[ropc]: http://tools.ietf.org/html/rfc6749#section-1.3.3

[findAndModify]: http://mongodb.github.io/node-mongodb-native/2.1/api/Collection.html#findAndModify

[remove]: http://mongodb.github.io/node-mongodb-native/2.1/api/Collection.html#remove

[findAndRemove]: http://mongodb.github.io/node-mongodb-native/2.1/api/Collection.html#findAndRemove

[find]: http://mongodb.github.io/node-mongodb-native/2.1/api/Collection.html#find

[findOne]: http://mongodb.github.io/node-mongodb-native/2.1/api/Collection.html#findOne

[update]: http://mongodb.github.io/node-mongodb-native/2.1/api/Collection.html#update
