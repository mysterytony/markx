'use strict';
let getRules = function() {
  let result = require('./db_script/tokenList.json');
  return result;
};

let enumGenerator = function(rules) {
  let Terminal = require('./domain').Terminal;
  let enumResult = {};
  let numOfRules = rules.length;
  for (let i = 0; i < numOfRules; i++) {
    if ('alias' in rules[i]) {
      enumResult[rules[i].state] = new Terminal(rules[i].alias);
    } else {
      enumResult[rules[i].state] = new Terminal(rules[i].state);
    }
  }
  return enumResult;
};

// to correct the dollar marks caused by mongodb's restriction
let rulesCorrector = function(original) {
  let rules = original.rules;

  let dollarMarkReplacement = original.dollarMarkReplacement;
  let correctedRules = [];
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
    let result = [];
    let currentState = this._rules[this._currentStateIndex];

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
    if ('continuousState' in currentState) {
      while ('continuousState' in currentState) {
        result.push(this._TOKENTYPE[currentState.state]);
        currentState = this._rules[currentState.continuousState];
      }
      result.push(this._TOKENTYPE[currentState.state]);
      return result;
    }
    result = [this._TOKENTYPE[currentState.state]];
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

    let Token = require('./domain').Token;

    let keyOfEndline = this._tokenTypeKeys[this._endlineIndex];
    let keyOfNewline = this._tokenTypeKeys[this._newlineIndex];
    let keyOfNewfile = this._tokenTypeKeys[this._newfileIndex];
    let keyOfEndfile = this._tokenTypeKeys[this._endfileIndex];

    let termOfEndline = this._TOKENTYPE[keyOfEndline];
    let termOfNewline = this._TOKENTYPE[keyOfNewline];
    let termOfNewfile = this._TOKENTYPE[keyOfNewfile];
    let termOfEndfile = this._TOKENTYPE[keyOfEndfile];
    // this function only scans the first letiable which must be a string
    if (typeof string != 'string') {
      throw 'Scanner Error: input is not string type letiable.';
    }
    let currentLex = '';
    for (let i = 0, keys, chr, hasNewToken; i < string.length; i++) {
      chr = string.charAt(i);

      do {
        hasNewToken = false; // if ture the last character needs to be precessed again.
        keys = this._charToTokenTypeKey(chr);

        for (let aKey of keys) {
          hasNewToken = true;
          if (aKey.equal(termOfEndline) || aKey.equal(termOfNewline)) {
            this._outputList.push(new Token(aKey, aKey.termName));
          } else {
            this._outputList.push(new Token(aKey, currentLex));
          }
        }

        if (hasNewToken) {
          // if a new token is founded, then reset the current state index
          // and reset the currentLex.
          this._resetCurrentStateIndex();
          currentLex = '';
        } else {
          currentLex += chr;
        }
      } while (hasNewToken); 
    }

    let keyOfLastState = this._tokenTypeKeys[this._currentStateIndex];
    this._outputList.push(
        new Token((this._TOKENTYPE[keyOfLastState]), currentLex));

    // finish up process: adding ENDLIND to the end,
    //                and adding NEWLINE to the beginning.
    this._outputList.push(new Token(termOfEndline, termOfEndline.termName));
    this._outputList.unshift(new Token(termOfNewline, termOfNewline.termName));

    this._outputList.push(new Token(termOfEndfile, termOfEndfile.termName));
    this._outputList.unshift(new Token(termOfNewfile, termOfNewfile.termName));
    if (typeof doneScanCallBack == 'function') {
      doneScanCallBack(this._outputList);
    }
  }

  /**
   * callback function to return the result
   * @callback doneScanCallBack
   * @param {Token[]} result - a list of tokens scanned from the input string
   */

  /**
   * @param {callback} callback - callback function to return the entry function and enum object
   * @description
   * Usage:
   * <pre>
   * <code>
   * let Scanner = require('./scanner');
   * let scanner = new Scanner(function(scanFunc) {
   *   try {
   *     scanFunc('Hello World!\nMy name', function(result) {
   *       console.log(result[2]); // Token { term: Terminal { termName: 'WORD'
   *                               // }, lex: 'Hello' }
   *     });
   *   } catch (err) {
   *     console.log(err);
   *   }
   * });
   * </code>
   * </pre>
   */
  constructor(callback) {
    let self = this;
    let result = getRules();
    self._rules = rulesCorrector(result);
    self._startIndex = result.startIndex;
    self._endlineIndex = result.endlineIndex;
    self._newlineIndex = result.newlineIndex;
    self._newfileIndex = result.newfileIndex;
    self._endfileIndex = result.endfileIndex;
    self._dollarMarkReplacement = result.dollarMarkReplacement;
    /**
     * the actual value of a TOKENTYPE for comparison
     * @typedef {Terminal} TOKENTYPE_value
     */
    /**
     * The key of TOKENTYPE, can be used to get the value of TOKENTYPE to
     * compare the result
     * @typedef {string} TOKENTYPE_key
     */
    /**
     * A enum of the types of tokens
     * @typedef {Object.<TOKENTYPE_key, TOKENTYPE_value>} TOKENTYPE
     */
    self._TOKENTYPE = enumGenerator(result.rules);
    self._tokenTypeKeys = Object.keys(self._TOKENTYPE);

    let scanFunc = self._scan.bind(self);
    Object.freeze(self._TOKENTYPE);
    Object.freeze(self._scan);
    if (typeof callback == 'function') {
      callback(scanFunc);
    }
  }
  /**
   * callback function to return the entry function and enum object
   * @callback callback
   * @param {scanFunc}  scanFunc - the entry function
   */
}

module.exports = Scanner;
