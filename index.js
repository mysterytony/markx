var express = require('express');

var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var MongoClient = require('mongodb').MongoClient;

// Connection URL
var url = 'mongodb://admin:markXadmin@ds151461.mlab.com:51461/markxdb';

var greetingMsg;

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  var collection = db.collection('test');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    greetingMsg = docs[0].message;
  });
  db.close();
});

app.get('/', function(req, res) { res.send(greetingMsg); });

app.post('/' , function(req, res) {
  let compile = require('./codegen');
  compile(req.body.markx, (out) => {
    res.send(out);
  });
});

app.listen(8080, function() {});
