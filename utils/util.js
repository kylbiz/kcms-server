var AuthSettings = require("../settings").auth;
var app_id = AuthSettings.app_id;
var app_secret = AuthSettings.app_secret;


var Util = function() {

}

exports.Util = Util;

//-------------------------------------------------
/**
 * print array of information
 * @param  {array} 
 */
Util.prototype.log = function(info) {
	console.log('--------------------------');
	console.log(new Date());
	for(var i = 0, max = arguments.length; i < max; i+=1) {
		console.log(arguments[i]);
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
	if(!self.isJson(options)
		|| !options.hasOwnProperty("app_id")
		|| !options.hasOwnProperty("app_secret")
		|| options['app_id'] !== app_id
		|| options['app_secret'] !== app_secret) {
		self.log("auth: has no authority.", options);
		return false;
	} else {
		return true;
	}
}

// ------------------------------------------------




// ------------------------------------------------



// ------------------------------------------------
