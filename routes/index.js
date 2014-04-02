
/*
 * GET home page.
 */

app = require('../app');

app.get("/", function(req, res){
   res.send("Welcome to test XactTime Api page powed by express.js!");
});

app.get('/syn', app.authFun, function (req, res) {  
  res.send('xactTime API is running');  
});

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

require('./employee');
require('./clock');
