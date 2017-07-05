'use strict'

let Domain = require('./domain');

/** @type {Domain.Terminal[]} */
var terminals = [];

/** @type {Domain.NonTerminal[]} */
var nonterminals = [];

/** @type {Domain.Transition[]} */
var transitions = [];

/** @type {Domain.Rule[]} */
var rules = [];

/** @type {Domain.Tokens[]} */
var tokens = [];

/** @type {string[][]} */
var output = [];

var readTransitions = require('./generateRule');

let parser = (callback) => {
  readTransitions((t, nt, tran, r) => {
    terminals = t;
    nonterminals = nt;
    transitions = tran;
    rules = r;

    tokens = [
      new Domain.Token(new Domain.Terminal('NEWFILE'), 'NEWFILE'),
      new Domain.Token(new Domain.Terminal('NEWLINE'), 'NEWLINE'),
      new Domain.Token(new Domain.Terminal('POUND'), '#'),
      new Domain.Token(new Domain.Terminal('POUND'), '#'),
      new Domain.Token(new Domain.Terminal('SINGLESPACE'), ' '),
      new Domain.Token(new Domain.Terminal('WORD'), 'Hello'),
      new Domain.Token(new Domain.Terminal('SINGLESPACE'), ' '),
      new Domain.Token(new Domain.Terminal('WORD'), 'World'),
      new Domain.Token(new Domain.Terminal('ENDLINE'), 'ENDLINE'),
      new Domain.Token(new Domain.Terminal('ENDFILE'), 'ENDFILE'),
    ];

    // tokens = [
    //   new Domain.Token(new Domain.Terminal('BOF'), 'BOF'),
    //   new Domain.Token(new Domain.Terminal('ID'), '1'),
    //   new Domain.Token(new Domain.Terminal('PLUS'), '+'),
    //   new Domain.Token(new Domain.Terminal('ID'), '2'),
    //   new Domain.Token(new Domain.Terminal('EOF'), 'EOF')
    // ];

    main();
    callback(tree);
  });
};

module.exports = parser;

/**
 * compare if the state of the rule is equal to the pair's first
 * and the token of the rule equal to the pair's second
 * @param {Rule} r
 * @param {Pair} p
 * @returns {Boolean}
 */
var compareRuleWithPair = (r, p) => {
  return r.fromStateId === p.first && r.token === p.second.termName;
};



var tree = new Domain.ParseTree();

var tokenIndex = 0;
var outputIndex = 0;

/**
 * @function
 * @param {Domain.ParseTree} tree
 */
var generateTreeHelper = (tree) => {
  var tempIndex = outputIndex;
  for (var it = output[tempIndex].length - 1; it != 0; --it) {
    if (terminals.find((v) => v.equal(output[tempIndex][it]))) {
      var ss = '';
      ss += tokens[tokenIndex].term.termName + ' ' + tokens[tokenIndex].lex;
      var newtree = new Domain.ParseTree();
      newtree.str = ss;
      tree.nodes.unshift(newtree);
      tokenIndex--;
    } else {
      outputIndex--;
      var newtree = new Domain.ParseTree();

      var ss = '';
      ss += output[outputIndex][0].termName + ' ->';
      for (var i = 1; i < output[outputIndex].length; ++i) {
        ss += ' ' + output[outputIndex][i].termName;
      }
      newtree.str = ss;
      tree.nodes.unshift(newtree);
      // outputIndex--;
      generateTreeHelper(newtree);
    }
  }
};

/**
 * @function
 */
var generateTree = () => {
  tokenIndex = tokens.length - 1;
  outputIndex = output.length - 1;
  var str = '';
  str += output[outputIndex][0].termName + ' ->';
  for (var i = 1; i < output[outputIndex].length; ++i) {
    str += (' ' + output[outputIndex][i].termName);
  }
  tree.str = str;
  // outputIndex --;
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
    var rule = findRule({first: states[0], second: token.term});

    if (!rule) {
      throw 'cannot find a rule';
    }

    if (rule.action === Domain.RuleType.reduce) {
      while (true) {
        if (rule.num >= transitions.length) {
          throw 'num is longer than transition length';
        }

        for (var j = 0; j < transitions[rule.num].to.length; ++j) {
          states.shift();
        }

        output.push(transitions[rule.num].getTransitionExpressions());

        if (states.length <= 0) {
          throw 'states array is empty';
        }

        rule = findRule({first: states[0], second: transitions[rule.num].from});

        if (!rule) {
          rule = findRule(states[0], token.term);
          states.unshift(rule.num);
          break;
        } else if (rule.action === Domain.RuleType.shift) {
          states.unshift(rule.num);
          rule = findRule({first: states[0], second: token.term});
          if (!rule) {
            throw 'cant find rule';
          }
          if (rule.action === Domain.RuleType.shift) {
            states.unshift(rule.num);
            break;
          }
        }
      }
    } else {
      states.unshift(rule.num);
    }
    ++i;
  }

  output.push(transitions[0].getTransitionExpressions());

  generateTree();
};
