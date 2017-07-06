// read transitions
var transitions = [];

var readTransitions = (doneCallback) => {
  var fs = require('fs');
  var readline = require('readline');
  var Stream = require('stream');

  var instream = fs.createReadStream('./transitions');
  var outstream = new Stream;
  var rl = readline.createInterface(instream, outstream);

  rl.on('line', function(line) {
    if (!line || line === '') { return; }
    var terms = line.split(' ');
    var from = terms[1];
    var to = [];
    for (var i = 3; i < terms.length; ++i) {
      to.push(terms[i]);
    }
    transitions.push({from: from, to: to});
  });

  rl.on('close', function() {
    doneCallback();
  });
};

var inserting = () => {
  var MongoClient = require('mongodb').MongoClient;

  // Connection URL
  var url = 'mongodb://admin:markXadmin@ds151461.mlab.com:51461/markxdb';

  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, db) {
    console.log('begin executing script');

    var collection = db.collection('transitions');
    // Insert some documents
    collection.remove({}).then((result) => {
      collection.insertMany(transitions, function(err, result) {
        console.log('finish adding transitions');
        db.close();
      });
    });

  });
};

readTransitions(inserting);
