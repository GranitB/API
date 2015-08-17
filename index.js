var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var pg = require('pg');
var connectionString = process.env.DATABASE_URL;


var client = new pg.Client(connectionString);
client.connect();


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({type: 'application/json'}));


var apiRoutes = express.Router();
var pageErr = express.Router();
var apiErr = express.Router();

module.exports = app;


apiRoutes.get('/', function (req, res) {
    res.json({message: 'Hello World'});
});

app.set('port', (process.env.PORT || 5000));

app.use('/api', apiRoutes);
app.use('', pageErr);
app.use('/api', apiErr)

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


pageErr.get('*', function(request, response){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        if (err) {
            console.error(err);
            response.json({success: "false", message: err});
        }
        else {
            response.send("Enter a valid Page!.", 400);
        }
    });
});
/*
 var x = document.createElement('pageErr');
 x.src = 'pageErr';
 document.head.appendChild(x);*/


apiErr.get('*', function(request, response){
    pg.connect(process.env.DATABASE_URL, function(err, client, done){
        if (err) {
            console.error(err);
            response.json({success: "false", message: err});
        }
        else {
            response.send("Enter a valid API.", 401);
        }
    });
});



//READ
apiRoutes.get('/contact', function (request, response) {
    pg.connect(process.env.DATABASE_URL, function (err, client, done) {
        client.query('SELECT * FROM Contact;', function (err, result) {
            done();
            var test = 'ramadan';

            /*for(var i = 0; i < 2; i++){
             if(i == 1 && (result.rows[0].phonenumber1 === null || result.rows[0].phonenumber1 === undefined)){
             test += ' pajaziti';
             delete result.rows[5].lastname;
             delete result.rows[0].phonenumber1;
             }
             }*/

            if (err) {
                console.error(err);
                response.json({success: "false", message: err});
            }
            else {
                //This deletes from result all the numbers that are null
                for(var i = 0; i < result.rows.length; i += 1){
                    for(var k = 1; k <= 5; k += 1) {
                        if (result.rows[i]['phonenumber' + (k)] === "" || result.rows[i]['phonenumber' + (k)] === undefined || result.rows[i]['phonenumber' + (k)] === null) {
                            delete result.rows[i]['phonenumber' + (k)];
                        }
                    }
                }
//var test2 = isNaN(request.rows[16].phonenumber1);
                response.json({success: "Database Readed successfuly.", data: result.rows});
            }
        });
    });
});



//READ with ID
apiRoutes.get('/contact/:id', function (request, response) {
    pg.connect(process.env.DATABASE_URL, function (err, client, done) {

        if (isNaN(request.params.id)) {
            if (err) {
                console.error(err);
                response.json({success: "false", message: err});
            }
            else {
                response.status(405).send({error: "Enter a valid ID."});
            }
        } else {
            client.query('SELECT * FROM Contact WHERE $1 = Contact.id;', [request.params.id], function (err, result) {
                done();
                if (result.rows.length != 0) {
                    if (err) {
                        console.error(err);
                        response.json({success: "false", message: err});
                    }
                    else {
                        response.json({success: "A specific row read successfully.", data: result.rows});
                    }
                } else {
                    if (err) {
                        console.error(err);
                        response.json({success: "false", message: err});
                    }
                    else {
                        response.status(404).send({error: "The specified contact could not be found."});
                        //    response.json({failed:"Contact doesnt exist to update."} );
                    }
                }
            });
        }
    });
});


//CREATE
apiRoutes.post('/contact', function (request, response) {
    pg.connect(process.env.DATABASE_URL, function (err, client, done) {

        var bodyData = {
            name: request.body.name,
            lastname: request.body.lastname,
            address: request.body.address,
            phonenumber1: request.body.phonenumber1,
            email: request.body.email,
            phonenumber2: request.body.phonenumber2,
            phonenumber3: request.body.phonenumber3,
            phonenumber4: request.body.phonenumber4,
            phonenumber5: request.body.phonenumber5
        };


        //Display after inserted
        //  client.query('SELECT * FROM Contact', function (err, result) {

        if ((isNaN(bodyData.phonenumber1) || bodyData.phonenumber1 <= 0) && !(bodyData.phonenumber1 === "" || bodyData.phonenumber1 === undefined)) {
            if (err) {
                console.error(err);
                response.json({success: "false", message: err});
            }
            else {
                response.status(408).send({failed: "Enter a valid - number."});
            }
        }

        if ((isNaN(bodyData.phonenumber2) || bodyData.phonenumber2 <= 0) && !(bodyData.phonenumber2 === "" || bodyData.phonenumber2 === undefined)) {
            if (err) {
                console.error(err);
                response.json({success: "false", message: err});
            }
            else {

                response.status(408).send({failed: "Enter a phone valid number."});
            }
        }

        if ((isNaN(bodyData.phonenumber3) || bodyData.phonenumber3 <= 0) && !(bodyData.phonenumber3 === "" || bodyData.phonenumber3 === undefined)) {
            if (err) {
                console.error(err);
                response.json({success: "false", message: err});
            }
            else {
                response.status(408).send({failed: "Enter a phone valid number."});
            }
        }

        if ((isNaN(bodyData.phonenumber4) || bodyData.phonenumber4 <= 0) && !(bodyData.phonenumber4 === "" || bodyData.phonenumber4 === undefined)) {
            if (err) {
                console.error(err);
                response.json({success: "false", message: err});
            }
            else {
                response.status(408).send({failed: "Enter a phone valid number."});
            }
        }

        if ((isNaN(bodyData.phonenumber5) || bodyData.phonenumber5 <= 0) && !(bodyData.phonenumber5 === "" || bodyData.phonenumber5 === undefined)) {
            if (err) {
                console.error(err);
                response.json({success: "false", message: err});
            }
            else {
                response.status(408).send({failed: "Enter a phone valid number."});
            }
        }


        if (bodyData.name === "" || bodyData.name === undefined) {
            if (err) {
                console.error(err);
                response.json({success: "false", message: err});
            }
            {
                response.status(412).send({failed: "Field Name is required."});
            }
        } else {

            //Insert into database
            client.query("INSERT INTO contact(name, lastname, address, email, phonenumber1, phonenumber2, phonenumber3, phonenumber4, phonenumber5) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9);", [bodyData.name, bodyData.lastname, bodyData.address, bodyData.email, bodyData.phonenumber1, request.body['phonenumber' + 2], bodyData.phonenumber3, bodyData.phonenumber4, bodyData.phonenumber5]);

            // done();
            if (err) {
                console.error(err);
                response.json({success: "false", message: err});
            }
            {
                response.json({success: "Contact inserted successfully into database."});
            }
        }
    });
    //});
});


//DELETE
apiRoutes.delete('/contact', function (request, response) {
    pg.connect(process.env.DATABASE_URL, function (err, client, done) {

        var bodyData = {id: request.body.id};

        if ((isNaN(bodyData.id) || bodyData.id <= 0) || (bodyData.id === "" || bodyData.id === undefined)) {
            client.query('SELECT * FROM Contact', function (err, result) {
                done();
                if (err) {
                    console.error(err);
                    response.json({success: "false", message: err});
                }
                else {
                    response.status(405).send({error: "Enter a valid ID."});
                }
            });
        } else {
            //Display after deleted
            client.query('SELECT * FROM Contact WHERE Contact.id = $1;', [bodyData.id], function (err, result) {

                //Delete from database
                client.query("DELETE FROM Contact WHERE Contact.id = $1", [bodyData.id]);
                done();
                if (result.rows.length != 0) {
                    if (err) {
                        console.error(err);
                        response.json({success: "false", message: err});
                    }
                    else {
                        response.json({success: "Contact successfully deleted from the database."});
                    }
                } else {
                    if (err) {
                        console.error(err);
                        response.json({success: "false", message: err});
                    }
                    else {
                        response.status(404).send({error: "The specified contact could not be found."});
                    }
                }
            });
        }
    });
});


//UPDATE origjinal
apiRoutes.put('/contact', function (request, response) {
    pg.connect(process.env.DATABASE_URL, function (err, client, done) {

        var bodyData = {
            name: request.body.name,
            lastname: request.body.lastname,
            address: request.body.address,
            phonenumber1: request.body.phonenumber1,
            email: request.body.email,
            phonenumber2: request.body.phonenumber2,
            phonenumber3: request.body.phonenumber3,
            phonenumber4: request.body.phonenumber4,
            phonenumber5: request.body.phonenumber5
        };

        if ((isNaN(request.body.id) || request.body.id <= 0) || (request.body.id === "" || request.body.id === undefined)) {
            client.query('SELECT * FROM Contact', function (err, result) {
                done();
                if (err) {
                    console.error(err);
                    response.json({success: "false", message: err});
                }
                else {
                    response.status(405).send({error: "Enter a valid ID."});
                }
            });
        } else {
            //Display after updated
            client.query('SELECT * FROM Contact WHERE Contact.id = $1;', [request.body.id], function (err, result) {
                done();
                if (result.rows.length != 0) {

                    var name = result.rows[0].name;
                    var lastname = result.rows[0].lastname;
                    var address = result.rows[0].address;
                    var email = result.rows[0].email;
                    var phonenumber1 = result.rows[0].phonenumber1;
                    var phonenumber2 = result.rows[0].phonenumber2;
                    var phonenumber3 = result.rows[0].phonenumber3;
                    var phonenumber4 = result.rows[0].phonenumber4;
                    var phonenumber5 = result.rows[0].phonenumber5;

                    //It looks if there is no data entered, then it leaves data's like they were
                    if (bodyData.name === null || bodyData.name === undefined) {
                        bodyData.name = name;
                    }
                    if (bodyData.lastname === null || bodyData.lastname === undefined) {
                        bodyData.lastname = lastname;
                    }else if (bodyData.lastname === ""){
                        bodyData.lastname = null;
                    }
                    if (bodyData.email === null || bodyData.email === undefined) {
                        bodyData.email = email;
                    }else if (bodyData.email === ""){
                        bodyData.email = null;
                    }
                    if (bodyData.address === null || bodyData.address === undefined) {
                        bodyData.address = address;
                    }else if (bodyData.address === ""){
                        bodyData.address = null;
                    }
                    if (bodyData.phonenumber1 === null || bodyData.phonenumber1 === undefined) {
                        bodyData.phonenumber1 = phonenumber1;
                    }else if (bodyData.phonenumber1 === ""){
                        bodyData.phonenumber1 = null;
                    }
                    if (bodyData.phonenumber2 === null || bodyData.phonenumber2 === undefined) {
                        bodyData.phonenumber2 = phonenumber2;
                    }else if (bodyData.phonenumber2 === ""){
                        bodyData.phonenumber2 = null;
                    }
                    if (bodyData.phonenumber3 === null || bodyData.phonenumber3 === undefined) {
                        bodyData.phonenumber3 = phonenumber3;
                    }else if (bodyData.phonenumber3 === ""){
                        bodyData.phonenumber3 = null;
                    }
                    if (bodyData.phonenumber4 === null || bodyData.phonenumber4 === undefined) {
                        bodyData.phonenumber4 = phonenumber4;
                    }else if (bodyData.phonenumber4 === ""){
                        bodyData.phonenumber4 = null;
                    }
                    if (bodyData.phonenumber5 === null || bodyData.phonenumber5 === undefined) {
                        bodyData.phonenumber5 = phonenumber5;
                    }else if (bodyData.phonenumber5 === ""){
                        bodyData.phonenumber5 =  null;
                    }


                    if (((isNaN(bodyData.phonenumber1)) || bodyData.phonenumber1 <= 0) || (bodyData.phonenumber1 === undefined) || bodyData.phonenumber1 === null) {
                        if (err) {
                            console.error(err);
                            response.json({success: "false", message: err});
                        }
                        else {
                            response.status(408).send({failed: "Enter a valid phone-number."});
                        }
                    }

                    if (((isNaN(bodyData.phonenumber2)) || bodyData.phonenumber2 <= 0) && (bodyData.phonenumber2 === undefined)) {
                        if (err) {
                            console.error(err);
                            response.json({success: "false", message: err});
                        }
                        else {
                            response.status(408).send({failed: "Enter a valid phone-number."});
                        }
                    }

                    if (((isNaN(bodyData.phonenumber3)) || bodyData.phonenumber3 <= 0) && (bodyData.phonenumber3 === undefined)) {
                        if (err) {
                            console.error(err);
                            response.json({success: "false", message: err});
                        }
                        else {
                            response.status(408).send({failed: "Enter a valid phone-number.."});
                        }
                    }

                    if (((isNaN(bodyData.phonenumber4)) || bodyData.phonenumber4 <= 0) && (bodyData.phonenumber4 === undefined)) {
                        if (err) {
                            console.error(err);
                            response.json({success: "false", message: err});
                        }
                        else {
                            response.status(408).send({failed: "Enter a valid phone-number."});
                        }
                    }

                    if (((isNaN(bodyData.phonenumber5)) || bodyData.phonenumber5 <= 0) && (bodyData.phonenumber5 === undefined)) {
                        if (err) {
                            console.error(err);
                            response.json({success: "false", message: err});
                        }
                        else {
                            response.status(408).send({failed: "Enter a valid phone-number."});
                        }
                    }

                    //ketu behet check qe te mos behet update pa i plotsu kushtet
                    if ((bodyData.phonenumber1 >= 0 && bodyData.phonenumber1 !== null)  || (bodyData.phonenumber2 >= 0 && bodyData.phonenumber2 !== null) || (bodyData.phonenumber3 >= 0 && bodyData.phonenumber3 !== null) || (bodyData.phonenumber4 >= 0 && bodyData.phonenumber4 !== null) || (bodyData.phonenumber5 >= 0 && bodyData.phonenumber5 !== null)) {             //Update data in the database
                        client.query("UPDATE Contact SET name = $1, lastname = $2, address = $3, email = $4, phonenumber1 = $5, phonenumber2 = $6, phonenumber3 = $7, phonenumber4 = $8, phonenumber5 = $9 WHERE id = $10", [bodyData.name, bodyData.lastname, bodyData.address, bodyData.email, bodyData.phonenumber1, bodyData.phonenumber2, bodyData.phonenumber3, bodyData.phonenumber4, bodyData.phonenumber5, request.body.id]);
                    } else {
                        if (err) {
                            console.error(err);
                            response.json({success: "false", message: err});
                        }
                        else {
                            response.status(408).send({failed: "Enter a valid phone-number."});
                        }
                    }




                    if (err) {
                        console.error(err);
                        response.json({success: "false", message: err});
                    }
                    else {
                        response.json({success: "Contact updated successfully in the database.", test: bodyData.phonenumber1});
                    }
                } else {
                    if (err) {
                        console.error(err);
                        response.json({success: "false", message: err});
                    }
                    else {
                        response.status(404).send({error: "The specified contact could not be found"});
                    }
                }
            });
        }
    });
});


apiRoutes.get('/hello', function (request, response) {
    response.send('<h2>Hello World!!</h2>');
});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port:', app.get('port'));
});