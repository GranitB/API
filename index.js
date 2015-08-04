var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();
var http = require("http");



app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	response.send("<h1><center>Hello World</center></h1>");
	response.send("<center><h2>Welcome to HotelKeyAPP with our team NodeJS</center></h2>");
	response.end();
  
  //response.send(result);
});

app.get('/cool', function(request,response){
	response.send(cool());
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


