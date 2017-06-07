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

function enumGenerator(rules) {
  var enumResult = {};
  var numOfRules = rules.length;
  for (let i = 0; i < numOfRules; i++) {
    enumResult[rules[i].state] = i;
  }
  return enumResult;
}

// to correct the dollar marks caused by mongodb's restriction
function rulesCorrector(original) {
  var rules = original.rules;

  var dollarMarkReplacement = original.dollarMarkReplacement;
  var correctedRules = [];
  for (let aRule of rules) {
    if ('next' in aRule)
      if (dollarMarkReplacement in aRule.next) {
        aRule.next['$'] = aRule.next[dollarMarkReplacement];
        delete aRule.next[dollarMarkReplacement];
      }
  }
  return rules;
}

class scanner {
  constructor(callback) {
    var self = this;
    getRules(function(result) {
      self.rules = rulesCorrector(result);
      self.startIndex = result.startIndex;
      self.endlineIndex = result.endlineIndex;
      self.newlineIndex = result.newlineIndex;
      self.dollarMarkReplacement = result.dollarMarkReplacement;
      self.TOKENTYPE = enumGenerator(result.rules);
      self.scan = function(string) {
        var tokens = [];

        // this function only scans the first variable which must be a string
        // todo: maybe use throw
        if (typeof string != 'string') return tokens;


        return tokens;
      } callback(self.TOKENTYPE, self.scan);
    })
  }
}
module.exports = scanner;
// TODO CALL BACK PASS A SCANNER FUNCTION