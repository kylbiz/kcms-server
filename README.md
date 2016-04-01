# kcms-server
KCMS2016 服务端组件

此组件是为了动态创建，组装，管理数据库中模块而开发，可以应用到网站开发之中。最出目的，是为了在CMS搭建过程中，动态生成所需要组建，方便模块管理，目前项目还在开发阶段。

### 运行服务
1. 此模块为nodejs项目，需要安装nodejs, 目前开发使用环境为 `node v4.4.0`

2. 运行 `npm install`

3. 本服务组件目前使用的是 `mongodb 3.0` 作为数据库工具，需要提供相应的配置，在`settings.js` 这个文件中可以设置。

4. 运行 `node app` 启动服务

说明： 本组件提供 REST API ， 需要用户使用 REST 访问本服务。

### 访问服务

说明： 用户需要提供访问本服务所需要的 `app_id` 和 `app_secret`， 然后才可以进行访问服务，如果提供参数不正确，不提供服务访问。

1. 测试是否能访问服务，`HTTP POST` 访问 `test` 接口，如下：

```
Method:  POST
Content-Type: application/json
API:  /test
Results:
{success: true, message: ""}

```



### LICENSE: MIT
