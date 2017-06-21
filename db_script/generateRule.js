// data types

class Transition {
  /**
   * @constructor
   * @param {string[]} from 
   * @param {string[]} to 
   * @param {string[]} lookAheadTokens 
   */
  constructor(from, to, lookAheadTokens) {
    this.from = from;
    this.to = to;
    this.lookAheadTokens = lookAheadTokens;
  }
}

class IntermediateTransition {
  /**
   * @param {Transition[]} transition 
   * @param {number} position 
   * @param {string} next 
   */
  constructor(transition, position, next) {
    this.transition = transition;
    this.position = position;
    this.next = next;
  }
}

class Rule {
  /**
   * @param {number} fromId 
   * @param {string} symbol 
   * @param {number} toId 
   */
  constructor(fromId, symbol, toId) {
    this.fromId = fromId;
    this.symbol = symbol;
    this.toId = toId;
  }
}

// read transitions

/** @type {Transition[]} */
var transitions = [];

/** @type {Rule[]} */
var ruleArray = [];

var graph = [{ id: 0, currTransitions: [], rules: [] }];

var readTransitions = (doneCallback) => {
  var fs = require('fs');
  var readline = require('readline');
  var stream = require('stream');

  var instream = fs.createReadStream(
    '.\\db_script\\transitions');
  var outstream = new stream;
  var rl = readline.createInterface(instream, outstream);

  rl.on('line', function (line) {
    if (!line || line === '') return;
    var terms = line.split(' ');

    terms = terms.filter((e) => e !== '*' && e !== '->');

    var from = terms[0];
    var to = [];
    var lookAheadToken = [];
    for (var i = 1; i < terms.length; ++i) {
      if (terms[i].indexOf('{') > -1 && terms[i].indexOf('}') > -1) {
        lookAheadToken.push(terms[i]);
      } else {
        to.push(terms[i]);
      }
    }
    transitions.push({ from: from, to: to, lookAheadToken: lookAheadToken });
  });

  rl.on('close', function () { doneCallback(); });
};

var generateRules = () => {
  // helper functions
  var getAllCurrTransitions = (nextSymbol, symbolsGeneratedFor) => {
    // check if nextSymbol is a non terminal
    if (nextSymbol === nextSymbol.toLowerCase()) {
      var derivedTransitions =
        transitions.filter((e) => { return e.from === nextSymbol; });

      
      var currTransArray = [];
      // symbolsGeneratedFor.push(currTran.transition.from);

      for (var derivedTran of derivedTransitions) {
        var currTran = new IntermediateTransition(derivedTran, 0,derivedTran.to[0] ? derivedTran.to[0] : null);

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

  var generateRuleForNextSymbol = (fromId, sym, currTransitions) => {
    // generate a new rule node

    var newNode = { id: 0, currTransitions: [], rules: [] };
    var currTransArray = JSON.parse(JSON.stringify(currTransitions));
    var nextSymbol = null;

    for (var currTran of currTransArray) {
      currTran.position++;
      currTran.next = currTran.transition.to[currTran.position];
      nextSymbol = currTran.next;
    }

    newNode.currTransitions = newNode.currTransitions.concat(currTransArray);

    if (nextSymbol) {
      // recursively get all non terminal
      newNode.currTransitions = newNode.currTransitions.concat(
        getAllCurrTransitions(nextSymbol, new Set()));
    }


    var existingRuleNode = graph.filter((e) => {
      return JSON.stringify(e.currTransitions) ===
        JSON.stringify(newNode.currTransitions);
    });

    if (existingRuleNode.length > 0) {
      // existing rule node already exists
      var rule = { fromId: fromId, symbol: sym, nextRuleId: existingRuleNode[0].id };
      return rule;
    }

    newNode.id = graph.length;
    graph.push(newNode);

    newNode.rules =
      generateRuleForCurrTransitions(newNode, newNode.currTransitions);

    return {fromId: fromId, symbol: sym, nextRuleId: newNode.id };
  };

  var generateRuleForCurrTransitions = (node, currTransitions) => {
    var nextDict = {};
    for (var currTran of currTransitions) {
      if (currTran.next && nextDict.hasOwnProperty(currTran.next)) {
        nextDict[currTran.next].push(currTran);
      } else if (currTran.next) {
        nextDict[currTran.next] = [currTran];
      }
    }

    var rules = [];
    for (var next in nextDict) {
      if (!nextDict.hasOwnProperty(next)) continue;
      var rule = generateRuleForNextSymbol(node.id, next, nextDict[next]);
      rules.push(rule);
    }

    ruleArray = ruleArray.concat(rules);
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

  graph[0].currTransitions = trans;

  graph[0].rules =
    generateRuleForCurrTransitions(graph[0], graph[0].currTransitions);

  // console.log(graph);

  for (var node of graph) {
    var transitionReducePair = node.currTransitions.reduce((acc, curr) => {
      if (curr.next) {
        acc.transitions++;
      } else if (curr.transition.lookAheadToken.length === 0) {
        acc.reduces++;
      }
      return acc;
    }, { transitions: 0, reduces: 0 });

    var conflict = false;

    if (transitionReducePair.reduces > 1) {
      console.log('reduce-reduce conflict');
      conflict = true;
    }
    if (transitionReducePair.reduces > 0 && transitionReducePair.transitions > 0) {
      console.log('reduce-transition conflict');
      conflict = true;
    }

    if (conflict) {
      console.log('node id: ' + node.id);
      for (var tran of node.currTransitions) {
        console.log(tran)
      }
      console.log('======');
    }
  }

  // var findReduceStateId = (symbol, nextStateId, reduceNum) => {
  //   if (reduceNum === 0) {
  //     var rules = ruleArray.filter((e) => {
  //       return e.symbol === symbol && e.nextRuleId === nextStateId;
  //     }).reduce((acc, curr) => {
  //       return acc.concat(curr.fromId);
  //     }, []);
  //     return rules[0].fromId;
  //   }

  //   var fromIds = findReduceStateId()

  // };

  // output transition rules
  // id term action id
  for (var node of graph) {
    for (var rule of node.rules) {
      console.log('' + node.id + ' ' + rule.symbol + ' shift ' + rule.nextRuleId);
    }
    for (var currtran of node.currTransitions) {
      if (!currtran.next) {
        for (var token of currtran.transition.lookAheadToken) {
          var i = -1;
          for (var index in transitions) {
            if (JSON.stringify(currtran.transition) === JSON.stringify(transitions[index])) {
              i = index;
              break;
            }
          }
          console.log('' + node.id + ' ' + token + ' reduce ' + i); // it is the transition id
        }
      }
    }
  }


};

readTransitions(generateRules);
