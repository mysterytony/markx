// var MongoClient = require('mongodb').MongoClient;

// // Connection URL
// var url = 'mongodb://admin:markXadmin@ds151461.mlab.com:51461/markxdb';

// var parseRules = [];
// // var tokens = [];

// // Use connect method to connect to the server
// MongoClient.connect(url, function(err, db) {
//   var collection = db.collection('parserule');
//   // Find some documents
//   collection.find({}).toArray(function(err, docs) {
//     parseRules = docs;
//     parse();
//   });
//   db.close();
// });

var transitions = [];

var ruleArray = [];

var {readTransitions} = require('./generateRule');

readTransitions((trans, rules) => {
  transitions = trans;
  ruleArray = rules;
  main();
});

// ======================

/**
 * @class
 */
class Term {
  /**
   * takes a string as the term's state name
   * @param {String} s
   */
  constructor(s) {
    this.state = s;
  }
}

/**
 * @class
 */
class Terminal extends Term {
  /**
   * @param {String} s
   */
  constructor(s) {
    super(s);
  }

  /**
   * @method
   * @param {String} s
   * @return {Boolean}
   */
  equals(s) {
    return s === this.state;
  }
}

/**
 * @class
 */
class NonTerminal extends Term {
  /**
   * @param {String} s
   */
  constructor(s) {
    super(s)
  }
}

/**
 * @class
 */
class Transition {
  /**
   * @param {String} f
   */
  constructor(f) {
    this.from = f;
    /**
     * @type {Array.<String>}
     */
    this.to = [];
  }

  /**
   * @method
   * @return {Array.<String>}
   */
  getTransitionExpressions() {
    var exps = [];
    exps.push(this.from);
    to.forEach(s => {
      exps.push(s);
    });
    return exps;
  }
}

/**
 * @typedef Pair
 * @property {Number} first
 * @property {String} second
 */

/**
 * @typedef RuleType
 * @property {Number} reduce
 * @property {Number} shift
 */

/**
 * @readonly
 * @enum {Number}
 */
const rule_type = {
  reduce: 0,
  shift: 1
};

/** @class */
class Rule {
  /**
   * @constructor
   * @param {Number} s
   * @param {String} t
   * @param {String} a
   * @param {Number} n
   */
  constructor(s, t, a, n) {
    this.state = s;
    this.token = t;
    /** @type {RuleType} */
    this.action = a === 'reduce' ? rule_type.reduce: rule_type.shift;
    this.num = n;
  }

  /**
   * copy the rule r
   * @static
   * @method
   * @param {Rule} r
   * @return {Rule}
   */
  static copyRule(r) {
    return new Rule(r.state, r.token, r.action, r.num);
  }
}

/**
 * compare if the state of the rule is equal to the pair's first property and the token of the rule equal to the pair's second property
 * @param {Rule} r
 * @param {Pair} p
 * @returns {Boolean}
 */
var compareRuleWithPair = (r, p) => {
  return r.state === p.first && r.token === p.second;
};

/** @type {Array.<Terminal>} */
var terminals = [];

/** @type {Array.<NonTerminal>} */
var nonterminals = [];

/** @type {Array.<Transition>} */
var transitions = [];

/** @type {Array.<Rule>} */
var rules = [];

/** @type {Array.<{first: String, second: String}>} */
var tokens = [];

/** @type {Array.<Array.<String>>} */
var output = [];

/** 
 * @class 
 * @property {String} str
 * @property {Array.<parseTree>} nodes
*/
class parseTree {
  constructor() {
    this.str = "";
    /** @type {Array.<parseTree>} */
    this.nodes = [];
  }
}

var tree = new parseTree();

var tokenIndex = 0;
var outputIndex = 0;

/**
 * @function
 * @param {parseTree} tree
 */
var generateTreeHelper = (tree) => {
  var tempIndex = outputIndex;
  for (var it = output[tempIndex].length - 1; it != 0; --it) {
    if (terminals.find((v) => v.equals(output[it]))) {
      var ss = "";
      ss += tokens[tokenIndex].first + " " + tokens[tokenIndex].second;
      var newtree = new parseTree();
      newtree.str = ss;
      tree.nodes.push(newtree);
      tokenIndex++;
    }
    else {
      var newtree = new parseTree();
      outputIndex ++;
      var ss = "";
      ss += output[outputIndex][0];
      for (var i = 1; i < output[outputIndex].length; ++i) {
        ss += " " + output[outputIndex][i];
      }
      newtree.str = ss;
      tree.nodes.push(newtree);
      generateTreeHelper(newtree);
    }
  }
};


/**
 * @function
 */
var generateTree = () => {
  var str = "";
  for (var i = 1; i < output[0].length; ++i) {
    str += (" " + output[0][i]);
  }
  tree.str = str;

  generateTreeHelper(tree);
};

// TODO: read inputs

/**
 * @param {Pair} p
 * @return {Rule}
 */
var findRule = (p) => {
  for (var rule of rules) {
    if (compareRuleWithPair(rule, p)) {
      return rule;
    }
  }
  return null;
};

/**
 * the main function
 * @function
 * @throws {String}
 */
var main = () => {
  var states = [0];
  var i = 0;
  for (var token of tokens) {
    var rule = findRule({first: states[0], second: token.first});

    if (!rule) {
      throw 'cannot find a rule';
    }

    if (rule.action === rule_type.reduce) {
      while (true) {
        if (rule.num >= transitions.length) {
          throw 'num is longer than transition length';
        }

        for (var j = 0; j < transitions[rule.num].to.length; ++j) {
          states.pop();
        }

        output.push(transitions[it.num].getTransitionExpressions());

        if (states.length <= 0) {
          throw 'states array is empty';
        }

        rule = findRule({first: states[0], second: transitions[rule.num].from});

        if (!rule) {
          rule = findRule(states[0], token.first);
          states.push(rule.num);
          break;
        }
        else if (it.action === rule_type.shift) {
          states.push(it.num);
          rule = findRule({first: states[0], second: token.first});
          if (!rule) {
            throw 'cant find rule';
          }
          if (rule.action === rule_type.shift) {
            states.push(it.num);
            break;
          }
        }
      }
    }
    else {
      states.push(it.num);
    }
    ++i;
  }

  output.push(transitions[0].getTransitionExpressions());

  generateTree();
};
