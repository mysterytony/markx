/// initialize compiler

const Scanner = require('./scanner');
const Parser = require('./parser');
const CodeGen = require('./codegen');

let scan = null;
let parserInitCompleted = false;

let myCodeGen = new CodeGen();
let myParser;

let myScanner = new Scanner((scanFunc) => {
  scan = scanFunc;
  myParser = new Parser(() => { parserInitCompleted = true; });
});



var express = require('express');

var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use( function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});

// var MongoClient = require('mongodb').MongoClient;

// Connection URL
// var url = 'mongodb://admin:markXadmin@ds151461.mlab.com:51461/markxdb';

var greetingMsg = 'hello world';

// Use connect method to connect to the server
// MongoClient.connect(url, function(err, db) {
//   var collection = db.collection('test');
//   // Find some documents
//   collection.find({}).toArray(function(err, docs) {
//     greetingMsg = docs[0].message;
//   });
//   db.close();
// });

app.get('/', function(req, res) { 
  res.status(200);
  res.send(greetingMsg); 
});

app.post('/', function(req, res) {
  if (!parserInitCompleted) {
    res.status(400);
    res.send({
      status: 'failed',
      error: 'server busy',
      message: 'server is initializing, please try again later'
    });
    return;
  }

  if (!req.body.mxbody) {
    res.status(400);
    res.send({
      status: 'failed',
      error: 'invalid parameter',
      message: 'mxbody is undefined'
    });
    return;
  }

  try {
    scan(req.body.mxbody, (tokenList) => {
      let resultHtml = myCodeGen.GenerateCode(myParser.parse(tokenList));
      res.status(200);
      res.send({status: 'success', htmlbody: resultHtml});
    });
  } catch (e) {
    res.status(400);
    res.send(
        {status: 'failed', error: 'compile failed', message: e.message || e});
  }
});

app.listen(8080, function() {});
