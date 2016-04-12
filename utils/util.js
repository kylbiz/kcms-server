var settings = require("../settings");
var authSettings = settings.auth;
var app_id = authSettings.app_id;
var app_secret = authSettings.app_secret;
var passwordReg = settings.accounts.password.reg;

var Util = function() {
	this.name = "Util";
}

exports.Util = Util;

//-------------------------------------------------
/**
 * print array of information
 * @param  {array}
 */
Util.prototype.log = function(info) {
	console.log('--------------------------------------------');
	console.log(new Date());
	for(var i = 0, max = arguments.length; i < max; i+=1) {
		console.log(arguments[i]);
	}
}

Util.prototype.logError = function(info) {
	console.log('--------------------------------------------');
	console.log(new Date());
	for(var i = 0, max = arguments.length; i < max; i+=1) {
		console.error(arguments[i]);
	}
}

// ------------------------------------------------
/**
 * verify if an object is json object
 * @param  {any type}  obj
 * @return {Boolean}     true if object is json like object
 */
Util.prototype.isJson = function(obj){
	var isJson =  typeof(obj) == "object"
		&& Object.prototype.toString.call(obj).toLowerCase() == "[object object]"
		&& !obj.length;
	return isJson;
}

// ------------------------------------------------
/**
 * verify if user has authority
 * @param  {json} options contains at least the following properties:
 * @property {string} app_id
 * @property {string} app_secret
 * @return {Boolean}         true if has authority
 */
Util.prototype.auth = function(options) {
	var self = this;
	self.log("auth: This is auth")
	if(!self.isJson(options)
		|| !options.hasOwnProperty("app_id")
		|| !options.hasOwnProperty("app_secret")
		|| options['app_id'] !== app_id
		|| options['app_secret'] !== app_secret) {
		self.log("auth: has no authority.", options);
		return false;
	} else {
		self.log("auth: has authority.")
		return true;
	}
}

// ------------------------------------------------
/**
 * verify if string is domain like string
 * @param str
 * @return { Boolean} true if str is domain like string
 */

Util.prototype.isDomain = function(str) {
	var domainReg = /^(?!:\/\/)([a-zA-Z0-9]+\.)?[a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{2,6}?$/i;
	return domainReg.test(str);
}

// ------------------------------------------------
/**
 * generate random string lists
 * references: http://www.xuanfengge.com/js-random.html
 */

Util.prototype.generateStr = function(randomFlag, min, max){
	var str = "",
		range = min,
		arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
		'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
		'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
		'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G',
		'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
		'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

	// 随机产生
	if(randomFlag){
		range = Math.round(Math.random() * (max-min)) + min;
	}
	for(var i=0; i<range; i++){
		pos = Math.round(Math.random() * (arr.length-1));
		str += arr[pos];
	}
	return str;
}

// ------------------------------------------------
/**
 * internal function about handle data for update
 * @param {json} handleData
 * @return {json} data for update options
 */

Util.prototype._handleData = function(handleData) {
	var self = this;
	var dataObj = {
		"data.updateTime": new Date()
	}
	if(self.isJson(handleData)) {
		for(key in handleData) {
			if(handleData.hasOwnProperty(key)) {
				dataObj["data." + key] = handleData[key];
			}
		}
	}
	if(handleData.hasOwnProperty("title")) {
		dataObj["kVName"] = handleData.title;
	}
	return dataObj;
}
// ------------------------------------------------
//References stackoverflow
//http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
Util.prototype.isEmail = function(email) {
	var emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return  emailReg.test(email);
}

// ------------------------------------------------
Util.prototype.legalPassword = function(password) {
	return passwordReg.test(password);
}





// ------------------------------------------------
