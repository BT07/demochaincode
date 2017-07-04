var express = require('express');
var app = express();

app.use(express.static('public'));
app.get('/index.html', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
});

app.get('/process_get', function (req, res) {
   // Prepare output in JSON format
   response = {
      patient_name:req.query.name,
      patient_dob:req.query.dob,
      problem_desc:req.query.probdesc,
      patient_allergy:req.query.allergies,
   };
   console.log(response);
   module.exports = response;
   var calldatfile = require('./nodetobc');
    res.end(JSON.stringify(response));
   
})

var server = app.listen(8081, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log("Example app listening at http://%s:%s", host, port);

})

