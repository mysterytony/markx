var MongoClient = require('mongodb').MongoClient;

// Connection URL
var url = 'mongodb://localhost:27017/markxdb';
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.createCollection("scannerRules", function(err, res) {
    if (err) throw err;
    console.log("Table created!");
    db.close();
  });
});
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var database = require("./fsm.json");
  db.collection("scannerRules").insert(database, function(err, res) {
    if (err) throw err;
    console.log("Number of records inserted: " + res.insertedCount);
    db.close();
  });
});