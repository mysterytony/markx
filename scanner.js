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
    if ('next' in aRule) {
      if (dollarMarkReplacement in aRule.next) {
        aRule.next.$ = aRule.next[dollarMarkReplacement];
        delete aRule.next[dollarMarkReplacement];
      }
    }
  }
  return rules;
};

/** Class representing a scanner. */
class Scanner {
  /**
   * reset the outputList
   * @private
   */
  _resetOutputList() {
    this._outputList = [];
  }
  /**
   * reset the currentStateIndex to startIndex.
   * @private
   */
  _resetCurrentStateIndex() {
    this._currentStateIndex = this._startIndex;
  }
  /**
   * input a single char, and the function
   * will keep track of currentStateIndex
   * and return the array of TOKENS
   * @private
   * @param {string} chr - next character to process
   */
  _charToTokenTypeKey(chr) {
    var result = [];
    let currentState = this._rules[this._currentStateIndex];
    if ('continuousState' in currentState) {
      while ('continuousState' in currentState) {
        result.push(this._TOKENTYPE[currentState.state]);
        currentState = this._rules[currentState.continuousState];
      }
      result.push(this._TOKENTYPE[currentState.state]);
      this._resetCurrentStateIndex();
      return result;
    }
    if ('next' in currentState) {
      if (chr in currentState.next) {
        if (currentState.next[chr] != null) {
          this._currentStateIndex = currentState.next[chr];
          return result;
        }
      } else if (
          ('otherwiseNext' in currentState) &&
          (currentState.otherwiseNext != null)) {
        this._currentStateIndex = currentState.otherwiseNext;
        return result;
      }
    }
    result = [this._TOKENTYPE[currentState.state]];
    this._resetCurrentStateIndex();
    return result;
  }

  /**
   * The top module of scanner class
   * takes in a string and callback function
   * the result of scanning will be passed by callback function
   * warning: non-BMP char is not considered yet
   * @name scanFunc
   * @param {string} string - the string to be scanned
   * @param {doneScanCallBack} doneScanCallBack - a callback function to pass the result
   */
  _scan(string, doneScanCallBack) {
    this._resetOutputList();
    this._resetCurrentStateIndex();

    // this function only scans the first variable which must be a string
    if (typeof string != 'string') {
      throw 'Scanner Error: input is not string type variable.';
    }

    for (let i = 0, keys, chr; i < string.length; i++) {
      chr = string.charAt(i);
      keys = this._charToTokenTypeKey(chr);

      for (let aKey of keys) {
        this._outputList.push(aKey);
        console.log(this._tokenTypeKeys[aKey]);
      }

      // if the state is reseted then last character needs to be processed
      // again.
      if (this._currentStateIndex == this._startIndex) {
        i--;
      }
    }
    var keyOfLastState = this._tokenTypeKeys[this._currentStateIndex];
    this._outputList.push(this._TOKENTYPE[keyOfLastState]);
    // finish up process: adding ENDLIND to the end,
    //                and adding NEWLINE to the beginning.
    var keyOfEndline = this._tokenTypeKeys[this._endlineIndex];
    var keyOfNewline = this._tokenTypeKeys[this._newlineIndex];
    var keyOfNewFile = this._tokenTypeKeys[this._newfileIndex];
    var keyOfEndfile = this._tokenTypeKeys[this._endfileIndex];
    this._outputList.push(this._TOKENTYPE[keyOfEndline]);
    this._outputList.unshift(this._TOKENTYPE[keyOfNewline]);

    this._outputList.push(this._TOKENTYPE[keyOfEndfile]);
    this._outputList.unshift(this._TOKENTYPE[keyOfNewFile]);
    if (typeof doneScanCallBack == 'function') {
      doneScanCallBack(this._outputList);
    }
  }

  /**
   * callback function to return the result
   * @callback doneScanCallBack
   * @param {TOKENTYPE_value[]} result - a list of tokens scanned from the input string
   */

  /**
   * @param {callback} callback - callback function to return the entry function and enum object
   * @description
   * Usage:
   * <pre>
   * <code>
   * var Scanner = require('./scanner');
   * var scanner = new Scanner(function(TOKENTYPE, scanFunc) {
   *   try {
   *     scanFunc('Hello World!\nMy name', function(result) {
   *       console.log(result[0] == TOKENTYPE.WORD); // true
   *       console.log(result[1] == TOKENTYPE.SINGLESPACE); //true
   *     });
   *   } catch (err) {
   *     console.log(err);
   *   }
   * });
   * </code>
   * </pre>
   */
  constructor(callback) {
    var self = this;
    getRules(function(result) {
      self._rules = rulesCorrector(result);
      self._startIndex = result.startIndex;
      self._endlineIndex = result.endlineIndex;
      self._newlineIndex = result.newlineIndex;
      self._newfileIndex = result.newfileIndex;
      self._endfileIndex = result.endfileIndex;
      self._dollarMarkReplacement = result.dollarMarkReplacement;
      /**
       * the actual value of a TOKENTYPE for comparison
       * @typedef {number} TOKENTYPE_value
       */
      /**
       * The key of TOKENTYPE, can be used to get the value of TOKENTYPE to compare the result
       * @typedef {string} TOKENTYPE_key
       */
      /**
       * A enum of the types of tokens
       * @typedef {Object.<TOKENTYPE_key, TOKENTYPE_value>} TOKENTYPE
       */
      self._TOKENTYPE = enumGenerator(result.rules);
      self._tokenTypeKeys = Object.keys(self._TOKENTYPE);

      var scanFunc = self._scan.bind(self);
      Object.freeze(self._TOKENTYPE);
      Object.freeze(self._scan);
      if (typeof callback == 'function') {
        callback(self._TOKENTYPE, scanFunc);
      }
    });
  }
  /**
   * callback function to return the entry function and enum object
   * @callback callback
   * @param {TOKENTYPE} TOKENTYPE - 123
   * @param {scanFunc}  scanFunc - 123
   */
}

module.exports = Scanner;
