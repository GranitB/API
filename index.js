var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var pg = require('pg');



app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({ type: 'application/json' }));

var apiRoutes = express.Router();

var contactRouter = express.Router();


/*
contactRouter.get('/', function (req, res) {});
contactRouter.get('/:id', function(req, res) {});
contactRouter.post('/', function(req, res){});
contactRouter.patch('/:id', function(req, res){});
contactRouter.delete('/:id', function(req, res){});
app.use('/contact', contactRouter);
*/

module.exports = app;
/*
function lookupPhoto(req, res, next){
	var contactId = req.params.id;
	
	var sql = 'SELECT * FROM test WHERE id = ?';
	postgres.client.query(sql, [contactId], function(err, results){
		if(err){
			console.error(err);
			res.statusCode = 500;
			return res.json({errors: ['Could not retrive contact']});
		}
	if(results.rows.length === 0) {
		res.statusCode = 400;
		return res.json({errors: ['Contact not found']});
	}
	req.contact = results.rows[0];
	next();
	});
}

contactRouter.get('/id', lookupPhoto, function(req, res){
	res.json(req.contact);
})
*/
apiRoutes.get('/', function(req, res){
  res.json({message: 'Hello World' });
});

app.set('port', (process.env.PORT || 5000));

app.use('/api', apiRoutes );

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


//test for CRUD Json
apiRoutes.get('/db3/:id', function(request, response){
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT * FROM Contact WHERE $1 = Contact.id;', [request.params.id], function(err, result) {
			done();
			 if (err){ 
				console.error(err); response.json({success:"false",message: err}); 
			 }
			 else{ 
				response.json({success:"true",data: result.rows} ); 
			 }
		});
	});
});
/*
app.get('/db', function (request, response) {
  
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT * FROM test2 ;', , function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.json('pages/db', {results: result.rows} ); }
    });
  });
  
});


app.get('/db1/:id', function (request, response) {
	 pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('SELECT * FROM test2 WHERE $1 = test2.id;', [request.params.id], function(err, result) {
		  done();
		  if (err)
		   { console.error(err); response.send("Error " + err); }
		  else
		   { response.render('pages/db', {results: result.rows} ); }
		});
	});
});
*/

app.get('/hello', function(request, response) {
	response.send('<h2>Hello World!!</h2>');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port:', app.get('port'));
});

