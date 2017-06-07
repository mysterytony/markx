'use strict';
function getRules(callback) {
  var http = require('http');
  var MongoClient = require('mongodb').MongoClient;
  var url = 'mongodb://admin:markXadmin@ds151461.mlab.com:51461/markxdb';
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    db.collection('scannerrule').findOne({}, function(err, result) {
      if (err) throw err;
      db.close();
      callback(result);
    });
  });
}
function enumGenerator(rules){
  var enumResult={};
  var numOfRules = rules.length;
  for (let i = 0; i < numOfRules; i++){
    enumResult[rules[i].state] = i;
  }
  return enumResult;
}
class scanner {
  constructor(callback) {
    var self = this;
    getRules(function(result) {
      self.rules = result.rules;
      self.startIndex = result.startIndex;
      self.endlineIndex = result.endlineIndex;
      self.newlineIndex = result.newlineIndex;
      self.dollarMarkReplacement = result.dollarMarkReplacement;
      self.TOKENTYPE = enumGenerator(result.rules);
      self.scan = function(string){
        return [];
      }
      callback();
    })
  }
}
module.exports = scanner;
// TODO CALL BACK PASS A SCANNER FUNCTION