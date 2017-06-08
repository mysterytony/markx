'use strict';
var getRules = function(callback) {
  var http = require('http');
  var MongoClient = require('mongodb').MongoClient;
  var url = 'mongodb://admin:markXadmin@ds151461.mlab.com:51461/markxdb';
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw err;
    }
    db.collection('scannerrule').findOne({}, function(err, result) {
      if (err) {
        throw err;
      }
      db.close();
      callback(result);
    });
  });
};

var enumGenerator = function(rules) {
  var enumResult = {};
  var numOfRules = rules.length;
  for (let i = 0; i < numOfRules; i++) {
    enumResult[rules[i].state] = i;
  }
  return enumResult;
};

// to correct the dollar marks caused by mongodb's restriction
var rulesCorrector = function(original) {
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
};

class scanner {
  constructor(callback) {
    var self = this;
    getRules(function(result) {
      self.rules = rulesCorrector(result);
      self.startIndex = result.startIndex;
      self.endlineIndex = result.endlineIndex;
      self.newlineIndex = result.newlineIndex;
      self.newfileIndex = result.newfileIndex;
      self.endfileIndex = result.endfileIndex;
      self.dollarMarkReplacement = result.dollarMarkReplacement;
      self.TOKENTYPE = enumGenerator(result.rules);
      self.tokenTypeKeys = Object.keys(self.TOKENTYPE);

      // reset outputList
      self.resetOutputList = function() {
        self.outputList = [];
      };
      // reset currentStateIndex
      self.resetCurrentStateIndex = function() {
        self.currentStateIndex = self.startIndex;
      };

      self.charToTokenTypeKey = function(chr) {
        var result = [];
        let currentState = self.rules[self.currentStateIndex];
        if ('continuousState' in currentState) {
          while ('continuousState' in currentState) {
            result.push(self.TOKENTYPE[currentState.state]);
            currentState = self.rules[currentState.continuousState];
          }
          result.push(self.TOKENTYPE[currentState.state]);
          self.resetCurrentStateIndex();
          return result;
        }
        if ('next' in currentState) {
          if (chr in currentState.next) {
            if (currentState.next[chr] != null) {
              self.currentStateIndex = currentState.next[chr];
              return result;
            }
          } else if (
              ('otherwiseNext' in currentState) &&
              (currentState['otherwiseNext'] != null)) {
            self.currentStateIndex = currentState['otherwiseNext'];
            return result;
          }
        }
        result = [self.TOKENTYPE[currentState.state]];
        self.resetCurrentStateIndex();
        return result;
      };

      // the scanner function
      // warning: non-BMP char is not considered yet
      self.scan = function(string) {
        self.resetOutputList();
        self.resetCurrentStateIndex();

        // this function only scans the first variable which must be a string
        // todo: maybe use throw
        if (typeof string != 'string')
          throw 'Scanner Error: input is not string type variable.';

        for (let i = 0, keys, chr; i < string.length; i++) {
          chr = string.charAt(i);
          keys = self.charToTokenTypeKey(chr);

          for (let aKey of keys) {
            self.outputList.push(aKey);
          }

          // if the state is reseted then last character needs to be processed
          // again.
          if (self.currentStateIndex == self.startIndex) i--;
        }
        var keyOfLastState = self.tokenTypeKeys[self.currentStateIndex];
        self.outputList.push(self.TOKENTYPE[keyOfLastState]);
        // finish up process: adding ENDLIND to the end,
        //                and adding NEWLINE to the beginning.
        var keyOfEndline = self.tokenTypeKeys[self.endlineIndex];
        var keyOfNewline = self.tokenTypeKeys[self.newlineIndex];
        var keyOfNewFile = self.tokenTypeKeys[self.newfileIndex];
        var keyOfEndfile = self.tokenTypeKeys[self.endfileIndex];
        self.outputList.push(self.TOKENTYPE[keyOfEndline]);
        self.outputList.unshift(self.TOKENTYPE[keyOfNewline]);

        self.outputList.push(self.TOKENTYPE[keyOfEndfile]);
        self.outputList.unshift(self.TOKENTYPE[keyOfNewFile]);
        return self.outputList;
      };
      callback(self.TOKENTYPE, self.scan);
    })
  }
}
module.exports = scanner;
// TODO CALL BACK PASS A SCANNER FUNCTION