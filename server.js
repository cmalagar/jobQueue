var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Job = require('./api/models/jobQueueModel'), 
  bodyParser = require('body-parser');
  
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Jobdb', { useMongoClient: true }); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/jobQueueRoutes'); 
routes(app);

app.listen(port);

console.log('Job Queue RESTful API server started on: ' + port);