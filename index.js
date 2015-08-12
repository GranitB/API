var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var pg = require('pg');
var connectionString = process.env.DATABASE_URL;


var client = new pg.Client(connectionString);
//var query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
client.connect();


//
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({ type: 'application/json' }));


var apiRoutes = express.Router();

var contactRouter = express.Router();

module.exports = app;


apiRoutes.get('/', function(req, res){
  res.json({message: 'Hello World' });
});

app.set('port', (process.env.PORT || 5000));

app.use('/api', apiRoutes );

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


//READ
apiRoutes.get('/contact', function(request, response){
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {		
		client.query('SELECT * FROM Contact;', function(err, result) {
			done();
			 if (err){ 
				console.error(err); response.json({success:"No data", message: err}); 
			 }
			 else{ 
				response.json({success: "Read data with success", data: result.rows} ); 
			 }
		});
	});
});



//READ with ID
apiRoutes.get('/contact/:id', function(request, response){
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {		
		client.query('SELECT * FROM Contact WHERE $1 = Contact.id;', [request.params.id], function(err, result) {
			done();
			 if (err){ 
				console.error(err); response.json({success:"false", message: err}); 
			 }
			 else{ 
				response.json({success: "Read data with id", data: result.rows} ); 
			 }
		});
	});
});


//CREATE
apiRoutes.post('/contact', function(request, response){ 
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        
        var data1 = {name: request.body.name, lastname: request.body.lastname, address: request.body.address, phonenumber: request.body.phonenumber, email: request.body.email};  
			//Insert into database
        client.query("INSERT INTO contact(name, lastname, address, phonenumber, email) VALUES($1, $2, $3, $4, $5);", [data1.name, data1.lastname, data1.address, data1.phonenumber, data1.email]);
			//Display after inserted
        client.query('SELECT * FROM contact;', function(err, result) {
            done();
             if (err){ 
                console.error(err); response.json({success:"false", message: err}); 
             }
             else{     
             
                response.json({success:"Created data with success", data: result.rows } );
             }
        });
    });
});


//DELETE with body
apiRoutes.delete('/contact', function(request, response){
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        
        var data1 = {id: request.body.id};      
		//Delete from database		
        client.query("DELETE FROM Contact WHERE Contact.id = ($1)", [data1.id]);
		//Display after deleted
        client.query('SELECT * FROM Contact;', function(err, result) {
            done();
             if (err){ 
                console.error(err); response.json({success:"false", message: err}); 
             }
             else{     
			 
                response.json({success:"Deleted with id body", data: result.rows} ); 
             }
        });
    });
});

//DELETE with ID
apiRoutes.delete('/contact/:id', function(request, response){
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            
		//Delete from database		
        client.query("DELETE FROM Contact WHERE Contact.id = ($1)", [request.params.id]);
		//Display after deleted
        client.query('SELECT * FROM Contact;', function(err, result) {
            done();
             if (err){ 
                console.error(err); response.json({success:"false", message: err}); 
             }
             else{     
			 
                response.json({success:"Deteled data with id", data: result.rows} ); 
             }
        });
    });
});




//UPDATE
apiRoutes.put('/contact', function(request, response){ 
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        
        var data1 = {id: request.body.id, name: request.body.name, lastname: request.body.lastname, address: request.body.address, phonenumber: request.body.phonenumber, email: request.body.email};   
			//Update data in the database
        client.query("UPDATE Contact SET name = $1, lastname = $2, address = $3, phonenumber = $4, email = $5 WHERE id = $6", [data1.name, data1.lastname, data1.address, data1.phonenumber, data1.email, data1.id]);
			//Display after updated
        client.query('SELECT * FROM Contact WHERE Contact.id = $1;', [request.body.id] , function(err, result) {
            done();
			var count = client.query('select count(*) from Contact Where Contact.id = $1;'[request.body.id])
             if (err || count ==0){ 
                console.error(err); response.json({success:"false", message: err}); 
             }
             else{
                response.json({success:"Successfuly Updated", data: result.rows} ); 
             }
        });
    });
});


app.get('/hello', function(request, response) {
	response.send('<h2>Hello World!!</h2>');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port:', app.get('port'));
});