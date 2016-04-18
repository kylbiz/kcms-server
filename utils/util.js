var settings = require("../settings");
var authSettings = settings.auth;

var passwordReg = settings.accounts.password.reg;

var bcrypt = require('bcrypt');
var bcryptHash = bcrypt.hashSync;
var bcryptCompare = bcrypt.compareSync;
var SHA256 = require("sha256");

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
Util.prototype.generateClientId = function() {
	return this.generateStr(false, 15);
}

// ------------------------------------------------

Util.prototype.generateClientSecret = function() {
	return this.generateStr(false, 20);
}


// ------------------------------------------------
// Given a 'password' from the client, extract the string that we should
// bcrypt. 'password' can be one of:
//  - String (the plaintext password)
//  - Object with 'digest' and 'algorithm' keys. 'algorithm' must be "sha-256".
//
Util.prototype.getPasswordString = function (password) {
  if (typeof password === "string") {
    password = SHA256(password);
  } else { // 'password' is an object
    if (password.algorithm !== "sha-256") {
      throw new Error("Invalid password hash algorithm. " +
                      "Only 'sha-256' is allowed.");
    }
    password = password.digest;
  }
  return password;
};

// ------------------------------------------------

// Use bcrypt to hash the password for storage in the database.
// `password` can be a string (in which case it will be run through
// SHA256 before bcrypt) or an object with properties `digest` and
// `algorithm` (in which case we bcrypt `password.digest`).
//
Util.prototype.hashPassword = function (password) {
	var self = this;
  password = self.getPasswordString(password);
	var _bcryptRounds = 10;
  return bcryptHash(password, _bcryptRounds);
};

// ------------------------------------------------
Util.prototype.validExipiresId = function(updateTime, expiresIn) {
	expiresIn = expiresIn || authSettings.expiresIn;

	updateTime = updateTime.getTime() / 1000;

	nowTime = (new Date()).getTime() / 1000;

	if((nowTime - updateTime)  >= expiresIn) {
		return false;
	} else {
		return true;
	}
}

// ------------------------------------------------

Util.prototype.bcryptCompare = bcryptCompare;



// ------------------------------------------------
