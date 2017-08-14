var express = require('express');
var child_process = require('child_process');
var fs = require('fs');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

var app = express();

app.set('view engine', 'ejs');

// find static files (referenced by /assets) in the assets directory
app.use('/assets', express.static('assets'));

// use bodyParser middleware to get data from post requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// use expressValidator to validate and sanitize data from post requests
app.use(expressValidator());


app.get('/', function(req, res) {
    var data = {
        inputs : {
            n1 : 13,
            n2 : -7,
            n3 : -3
        }
    };
    res.render('index', { data: data });
});


app.post('/', function(req, res) {

    console.log('incoming data from client:');
    console.log (JSON.stringify(req.body));

    // validate parameters from form
    req.checkBody('n1', 'Invalid number').isInt();
    req.checkBody('n2', 'Invalid number').isInt();
    req.checkBody('n3', 'Invalid number').isInt();

    // sanitize to avoid cross site scripting errors
    req.sanitize('n1').escape();
    req.sanitize('n2').escape();
    req.sanitize('n3').escape();

    var data = {
        inputs : {
            n1 : parseFloat(req.body.n1),
            n2 : parseFloat(req.body.n2),
            n3 : parseFloat(req.body.n3)
        }
    };

    console.log('sanitized data from client to simulation:');
    console.log(data);

    // FIXME: send error if form data did not pass validation.
    // FIXME: update python script to read and write data through stdin/stdout.

    var inFileName = 'spiro.in';
    var outFileName = 'spiro.out';

    // write inputs to file
    fs.writeFileSync(inFileName, JSON.stringify(data));

    // kick off a simulation run
    console.log('running the simulation');
    var spawnSync = child_process.spawnSync;
    var process = spawnSync(
                    'python', [
                        'spiro.py',
                        '--infile', inFileName,
                        '--outfile', outFileName ]);

    // read output file
    data = JSON.parse(fs.readFileSync(outFileName,'utf8'));

    fs.unlink(inFileName, (err) => {
        if (err) throw err;
        console.log('deleted ' + inFileName);
    });

    fs.unlink(outFileName, (err) => {
        if (err) throw err;
        console.log('deleted ' + outFileName);
    });

    // send plotly javascript back to client
    console.log('returning results to client');
    res.type('json').send(data)

});

app.listen(3000, function() {
    console.log('server running on port 3000');
});
