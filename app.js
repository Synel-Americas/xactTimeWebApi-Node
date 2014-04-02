
/**
 * Module dependencies.
 */

var http = require("http");
var https = require ("https");
var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    mongoose = require('mongoose');
var fs= require ("fs");
var keys_dir = 'sslkeys/'

var httpsOptions = {
    key: fs.readFileSync(keys_dir+'ssl-key.pem'),
    ca:  fs.readFileSync(keys_dir+'ssl-certreq.csr'),
    cert: fs.readFileSync(keys_dir+'ssl-cert.pem')
}


var app = module.exports = express();

// all environments
//app.set('port', process.env.PORT || 443);
app.set('view engine', 'jade');
app.use(express.json());
app.use(express.urlencoded());

// Authenticator
//var md5 = require('MD5');
//var salt = "e=mc2+pi314+eu271";
//app.use(express.basicAuth(function(user, pass, callback) {
// var pattern = /^[A-Za-z0-9]{12}/;
// console.log("username is: "+user+" passwd is: "+pass);
// var secret = md5(user+salt);
// var isPasswordMatch = (pass === secret);
// console.log("passwd "+secret+" match: "+isPasswordMatch);
// var result = ((user.match(pattern) !== null) && isPasswordMatch);
// callback(null /* error */, result);
//}));

var authFun = function (req,res) {
// Grab the "Authorization" header.
  var auth = req.get("authorization");
  console.log("auth header raw: "+auth); 
  // On the first request, the "Authorization" header won't exist, so we'll set a Response
  // header that prompts the browser to ask for a username and password.
  if (!auth) {
    res.set("WWW-Authenticate", "Basic realm=\"Authorization Required\"");
    // If the user cancels the dialog, or enters the password wrong too many times,
    // show the Access Restricted error message.
    return res.status(401).send("Authorization Required");
  } else {
    // If the user enters a username and password, the browser re-requests the route
    // and includes a Base64 string of those credentials.
    var md5 = require('MD5');
    var salt = "e=mc2+pi314+eu271";
    var credentials = new Buffer(auth.split(" ").pop(), "base64").toString("ascii").split(":");
    var user=credentials[0];
    var pass=credentials[1];
    console.log("username is: "+user+" passwd is: "+pass);
    var pattern = /^[A-Za-z0-9]{12}/;
    var secret = md5(user+salt);
    var isPasswordMatch = (pass === secret);
    console.log("passwd+salt "+secret+" match: "+isPasswordMatch);
    var result = ((user.match(pattern) !== null) && isPasswordMatch)
      // The username and password are correct, so the user is authorized.
    if (result) { 
      return true;
    } else {
      // The user typed in the username or password wrong.
      return false;
      //return res.status(403).send("Access Denied (incorrect credentials)");
    }
  }
 
}

module.exports.authFun = authFun;

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

//http.createServer(app).listen(app.get('port'), function(){
//  console.log('Express server listening on port ' + app.get('port'));
//});

// Database:

mongoose.connect('mongodb://localhost/xacttime_database');

// Config

app.configure(function () {
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Launch server

var routes = require('./routes');
https.createServer(httpsOptions,app).listen(7000);
http.createServer(app).listen(8000);
