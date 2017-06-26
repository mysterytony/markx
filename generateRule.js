const {Transition, Rule, IntermediateTransition, State} = require('./domain')

/** @type {Transition[]} */
var transitions = [];
/** @type {Rule[]} */
var ruleArray = [];
/** @type {State[]} */
var graph = [];

var readTransitions = (doneCallback, generateCallback) => {
  var fs = require('fs');
  var readline = require('readline');
  var Stream = require('stream');

  var instream = fs.createReadStream('.\\db_script\\transitions');
  var outstream = new Stream;
  var rl = readline.createInterface(instream, outstream);

  rl.on('line', function(line) {
    if (!line || line === '') {
      return;
    }
    var terms = line.split(' ');

    terms = terms.filter((e) => e !== '*' && e !== '->');

    var from = terms[0];
    var to = [];
    var lookAheadTokens = [];
    for (var i = 1; i < terms.length; ++i) {
      if (terms[i].indexOf('{') > -1 && terms[i].indexOf('}') > -1) {
        lookAheadTokens.push(terms[i]);
      } else {
        to.push(terms[i]);
      }
    }
    let newTran = new Transition(from, to, lookAheadTokens);
    transitions.push(newTran);
  });

  rl.on('close', function() {
    doneCallback(generateCallback);
  });
};

var generateRules = (generateCallback) => {
  // helper functions
  var getAllCurrTransitions = (nextSymbol, symbolsGeneratedFor) => {
    // check if nextSymbol is a non terminal
    if (nextSymbol === nextSymbol.toLowerCase()) {
      var derivedTransitions = transitions.filter((e) => {
        return e.from === nextSymbol;
      });

      var currTransArray = [];
      // symbolsGeneratedFor.push(currTran.transition.from);

      for (var derivedTran of derivedTransitions) {
        var currTran = new IntermediateTransition(
            derivedTran, 0, derivedTran.to[0] ? derivedTran.to[0] : null);

        currTransArray.push(currTran);
        symbolsGeneratedFor.add(derivedTran.from);

        if (currTran.next && !symbolsGeneratedFor.has(currTran.next)) {
          var nextCurrTransitions =
              getAllCurrTransitions(currTran.next, symbolsGeneratedFor);
          currTransArray = currTransArray.concat(nextCurrTransitions);
        }
      }

      return currTransArray;
    }

    return [];
  };

  var generateRuleForNextSymbol = (fromId, sym, intermediateTransitions) => {
    // generate a new rule node

    var newNode = {id: 0, intermediateTransitions: [], rules: []};
    var currTransArray = JSON.parse(JSON.stringify(intermediateTransitions));
    var nextSymbol = null;

    for (var currTran of currTransArray) {
      currTran.position++;
      currTran.next = currTran.transition.to[currTran.position];
      nextSymbol = currTran.next;
    }

    newNode.intermediateTransitions = newNode.intermediateTransitions.concat(currTransArray);

    if (nextSymbol) {
      // recursively get all non terminal
      newNode.intermediateTransitions = newNode.intermediateTransitions.concat(
          getAllCurrTransitions(nextSymbol, new Set()));
    }

    var existingRuleNode = graph.filter((e) => {
      return JSON.stringify(e.intermediateTransitions) ===
          JSON.stringify(newNode.intermediateTransitions);
    });

    if (existingRuleNode.length > 0) {
      // existing rule node already exists
      var rule = {
        fromId: fromId,
        symbol: sym,
        nextRuleId: existingRuleNode[0].id
      };
      return rule;
    }

    newNode.id = graph.length;
    graph.push(newNode);

    newNode.rules =
        generateRuleForCurrTransitions(newNode, newNode.intermediateTransitions);

    return {fromId: fromId, symbol: sym, nextRuleId: newNode.id};
  };

  var generateRuleForCurrTransitions = (node, intermediateTransitions) => {
    var nextDict = {};
    for (var currTran of intermediateTransitions) {
      if (currTran.next && nextDict.hasOwnProperty(currTran.next)) {
        nextDict[currTran.next].push(currTran);
      } else if (currTran.next) {
        nextDict[currTran.next] = [currTran];
      }
    }

    var rules = [];
    for (var next in nextDict) {
      if (!nextDict.hasOwnProperty(next)) {
        continue;
      }
      var rule = generateRuleForNextSymbol(node.id, next, nextDict[next]);
      rules.push(rule);
    }
    return rules;
  };

  // start from "markx"
  var startSymbol = 'markx';
  var markxRules = transitions.filter((e) => e.from === startSymbol);
  var trans = markxRules.reduce((acc, curr) => {
    var tran = {
      transition: curr,
      position: 0,
      next: curr.to[0] ? curr.to[0] : null
    };
    acc.push(tran);
    return acc;
  }, []);

  let n = new State(0);
  graph[0] = n;
  graph[0].intermediateTransitions = trans;
  graph[0].rules =
      generateRuleForCurrTransitions(graph[0], graph[0].intermediateTransitions);

  for (var node of graph) {
    var transitionReducePair = node.intermediateTransitions.reduce((acc, curr) => {
      if (curr.next) {
        acc.transitions++;
      } else if (curr.transition.lookAheadTokens.length === 0) {
        acc.reduces++;
      }
      return acc;
    }, {transitions: 0, reduces: 0});

    var conflict = false;

    if (transitionReducePair.reduces > 1) {
      console.warn('reduce-reduce conflict');
      conflict = true;
    }
    if (transitionReducePair.reduces > 0 &&
        transitionReducePair.transitions > 0) {
      console.warn('reduce-transition conflict');
      conflict = true;
    }

    if (conflict) {
      console.warn('node id: ' + node.id);
      for (var tran of node.intermediateTransitions) {
        console.warn(tran);
      }
      console.warn('======');
    }
  }


  for (var node of graph) {
    for (var rule of node.rules) {
      let newRule = new Rule(node.id, rule.symbol, 'shift', rule.nextRuleId);
      ruleArray.push(newRule);
    }
    for (var currtran of node.intermediateTransitions) {
      if (!currtran.next) {
        for (var token of currtran.transition.lookAheadTokens) {
          var i = -1;
          for (var index in transitions) {
            if (JSON.stringify(currtran.transition) ===
                JSON.stringify(transitions[index])) {
              i = index;
              break;
            }
          }
          let newRule = new Rule(node.id, token, 'reduce', i);
          ruleArray.push(newRule);
        }
      }
    }
  }

  generateCallback(transitions, ruleArray);
};

module.exports.readTransitions = (callback) => {
  readTransitions(generateRules, callback);
};
