function read(request, response) {
    pg.connect(process.env.DATABASE_URL, function (err, client, done) {
        client.query('SELECT * FROM Contact;', function (err, result) {
            done();


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
}

exports.read = read;

