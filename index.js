var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var pg = require('pg');
var connectionString = process.env.DATABASE_URL;


var client = new pg.Client(connectionString);
//var query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
client.connect();


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

app.use(express.static(__dirfirstname + '/public'));

// views is directory for all template files
app.set('views', __dirfirstname + '/views');
app.set('view engine', 'ejs');


//READ
apiRoutes.get('/db', function(request, response){
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {		
		client.query('SELECT * FROM Contact;', function(err, result) {
			done();
			 if (err){ 
				console.error(err); response.json({success:"false", message: err}); 
			 }
			 else{ 
				response.json({success: "true", data: result.rows} ); 
			 }
		});
	});
});



//READ with ID
apiRoutes.get('/db/:id', function(request, response){
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {		
		client.query('SELECT * FROM Contact WHERE $1 = Contact.id;', [request.params.id], function(err, result) {
			done();
			 if (err){ 
				console.error(err); response.json({success:"false", message: err}); 
			 }
			 else{ 
				response.json({success: "true", data: result.rows} ); 
			 }
		});
	});
});


//CREATE
apiRoutes.post('/db', function(request, response){ 
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        
        var data1 = {firstname: request.body.firstname, lastname: request.body.lastname, address: request.body.address, phonenumber: request.body.phonenumber, email: request.body.email};  
			//Insert into database
        client.query("INSERT INTO contact(firstname, lastname, address, phonenumber, email) VALUES($1, $2, $3, $4, $5);", [data1.firstname, data1.lastname, data1.address, data1.phonenumber, data1.email]);
			//Display after inserted
        client.query('SELECT * FROM contact;', function(err, result) {
            done();
             if (err){ 
                console.error(err); response.json({success:"false", message: err}); 
             }
             else{     
             
                response.json({success:"true", data: result.rows } );
             }
        });
    });
});


//DELETE with body
apiRoutes.delete('/db', function(request, response){
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
			 
                response.json({success:"true", data: result.rows} ); 
             }
        });
    });
});

//DELETE with ID
apiRoutes.delete('/db/:id', function(request, response){
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
			 
                response.json({success:"true", data: result.rows} ); 
             }
        });
    });
});



/* //DELETE ALL DATA
apiRoutes.delete('/db/deleteall', function(request, response){
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            
		//Delete from database		 
        client.query("DELETE FROM Contact;"); 
		//Display after deleted
        client.query('SELECT * FROM Contact;', function(err, result) {
            done();
			
             if (err){ 
                console.error(err); response.json({success:"false", message: err}); 
             }
             else{
                response.json({success:"true", data: result.rows} ); 
             }
        });
    });
});
 */

//UPDATE
apiRoutes.put('/db', function(request, response){ 
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        
        var data1 = {id: request.body.id, firstname: request.body.firstname, lastname: request.body.lastname, address: request.body.address, phonenumber: request.body.phonenumber, email: request.body.email};   
			//Update data in the database
        client.query("UPDATE Contact SET firstname = $1, lastname = $2, address = $3, phonenumber = $4, email = $5 WHERE id = $6", [data1.firstname, data1.lastname, data1.address, data1.phonenumber, data1.email, data1.id]);
			//Display after updated
        client.query('SELECT * FROM Contact;', function(err, result) {
            done();
             if (err){ 
                console.error(err); response.json({success:"false", message: err}); 
             }
             else{
                response.json({success:"true", data: result.rows} ); 
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