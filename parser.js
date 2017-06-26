const {Term, Terminal, NonTerminal, Transition, Rule} = require('./domain');

/** @type {Terminal[]} */
var terminals = [];

/** @type {NonTerminal[]} */
var nonterminals = [];

/** @type {Transition[]} */
var transitions = [];

/** @type {Rule[]} */
var rules = [];

/** @type {Tokens[]} */
var tokens = [];

/** @type {string[][]} */
var output = [];

var {readTransitions} = require('./generateRule');

readTransitions((trans, rules) => {
  transitions = trans;
  ruleArray = rules;

  tokens = [
    new tokens('NEWFILE', 'NEWFILE'),
    new tokens('NEWLINE', 'NEWLINE'),
    new tokens('POUND', '#'),
    new tokens('POUND', '#'),
    new tokens('SINGLESPACE', ' '),
    new tokens('WORD', 'Hello'),
    new tokens('SINGLESPACE', ' '),
    new tokens('WORD', 'World'),
    new tokens('ENDLINE', 'ENDLINE'),
    new tokens('ENDFILE', 'ENDFILE'),
  ];

  main();

  // setup mock terminals


  // readInput((result) => {
  //   tokens = result;
  //   main();
  // });
});

/**
 * compare if the state of the rule is equal to the pair's first 
 * and the token of the rule equal to the pair's second
 * @param {Rule} r
 * @param {Pair} p
 * @returns {Boolean}
 */
var compareRuleWithPair = (r, p) => {
  return r.state === p.first && r.token === p.second;
};

/**
 * @class
 * @property {String} str
 * @property {Array.<ParseTree>} nodes
 */
class ParseTree {
  constructor() {
    this.str = '';
    /** @type {Array.<parseTree>} */
    this.nodes = [];
  }
}

var tree = new ParseTree();

var tokenIndex = 0;
var outputIndex = 0;

/**
 * @function
 * @param {ParseTree} tree
 */
var generateTreeHelper = (tree) => {
  var tempIndex = outputIndex;
  for (var it = output[tempIndex].length - 1; it != 0; --it) {
    if (terminals.find((v) => v.equals(output[it]))) {
      var ss = '';
      ss += tokens[tokenIndex].state + ' ' + tokens[tokenIndex].lex;
      var newtree = new parseTree();
      newtree.str = ss;
      tree.nodes.push(newtree);
      tokenIndex++;
    } else {
      var newtree = new parseTree();
      outputIndex++;
      var ss = '';
      ss += output[outputIndex][0];
      for (var i = 1; i < output[outputIndex].length; ++i) {
        ss += ' ' + output[outputIndex][i];
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
  var str = '';
  for (var i = 1; i < output[0].length; ++i) {
    str += (' ' + output[0][i]);
  }
  tree.str = str;

  generateTreeHelper(tree);
};

// read inputs
function readInput(donecallback) {
  let fs = require('fs');
  let mxcontent = fs.readFileSync('./mock.mx').toString();
  var Scanner = require('./scanner');
  var myscanner = new Scanner((TOKENTYPE, scanFunc) => {
    try {
      scanFunc(mxcontent, (result) => {
        console.log(result);
        donecallback(result);
      });
    } catch (err) {
      console.log(err);
    }
  });
}

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

    if (rule.action === RULE_TYPE.reduce) {
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
        } else if (it.action === rule_type.shift) {
          states.push(it.num);
          rule = findRule({first: states[0], second: token.first});
          if (!rule) {
            throw 'cant find rule';
          }
          if (rule.action === RULE_TYPE.shift) {
            states.push(it.num);
            break;
          }
        }
      }
    } else {
      states.push(it.num);
    }
    ++i;
  }

  output.push(transitions[0].getTransitionExpressions());

  generateTree();
};
