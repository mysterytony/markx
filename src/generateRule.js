import * as Domain from './domain';

/** @type {Domain.Transition[]} */
let transitions = [];
/** @type {Domain.Rule[]} */
let ruleArray = [];
/** @type {Domain.State[]} */
let graph = [];
/** @type {Domain.Terminal[]} */
let terminals = [];
/** @type {Domain.NonTerminal[]} */
let nonterminals = [];

/** @type {string} Start symbol default markx */
const startSymbol = 's';

let readTransitions = (doneCallback) => {
  let fs = require('fs');
  let readline = require('readline');
  let Stream = require('stream');

  let instream = fs.createReadStream('.\\db_script\\mocktransitions');
  let outstream = new Stream;
  let rl = readline.createInterface(instream, outstream);

  rl.on('line', (line) => {
    if (!line || line === '') {
      return;
    }
    let terms = line.split(' ');

    terms = terms.filter((e) => e !== '*' && e !== '->');

    let from = new Domain.NonTerminal(terms[0]);
    let to = [];
    let lookAheadTokens = [];

    if (nonterminals.indexOf(from) === -1) {
      nonterminals.push(new Domain.NonTerminal(from));
    }

    for (let i = 1; i < terms.length; ++i) {
      if (terms[i].indexOf('{') > -1 && terms[i].indexOf('}') > -1) {
        lookAheadTokens.push(new Domain.Token(terms[i]));
      } else if (terms[i].toLowerCase() === terms[i]) { // non terminal
        to.push(new Domain.NonTerminal(terms[i]));
        if (nonterminals.indexOf(new Domain.NonTerminal(terms[i])) === -1) {
          nonterminals.push(new Domain.NonTerminal(terms[i]));
        }
      } else { // terminal
        to.push(new Domain.Terminal(terms[i]));
        if (terminals.indexOf(terms[i]) === -1) {
          terminals.push(new Domain.Terminal(terms[i]));
        }
      }
    }

    let newTran = new Domain.Transition(from, to, lookAheadTokens);
    transitions.push(newTran);
  });

  rl.on('close', () => {
    doneCallback();
  });
};

let generateRules = () => {
  // helper functions
  let getAllCurrTransitions = (nextSymbol, symbolsGeneratedFor) => {
    // check if nextSymbol is a non terminal
    if (nextSymbol === nextSymbol.toLowerCase()) {
      let derivedTransitions = transitions.filter((e) => {
        return e.from === nextSymbol;
      });

      let currTransArray = [];
      // symbolsGeneratedFor.push(currTran.transition.from);

      for (let derivedTran of derivedTransitions) {
        let currTran = new IntermediateTransition(
          derivedTran, 0, derivedTran.to[0] ? derivedTran.to[0] : null);

        currTransArray.push(currTran);
        symbolsGeneratedFor.add(derivedTran.from);

        if (currTran.next && !symbolsGeneratedFor.has(currTran.next)) {
          let nextCurrTransitions =
            getAllCurrTransitions(currTran.next, symbolsGeneratedFor);
          currTransArray = currTransArray.concat(nextCurrTransitions);
        }
      }

      return currTransArray;
    }

    return [];
  };

  /**
   * generate rules for next symbol
   * @param {number} fromId 
   * @param {Domain.Term} sym 
   * @param {Domain.IntermediateTransition[]} intermediateTransitions 
   * @return {Domain.Rule}
   */
  let generateRuleForNextSymbol = (fromId, sym, intermediateTransitions) => {
    // generate a new rule node

    let newState = new Domain.State(0); //{ id: 0, intermediateTransitions: [], rules: [] };
    let currTransArray = intermediateTransitions;
    let nextSymbol = null;

    for (let currTran of currTransArray) {
      currTran.position++;
      currTran.next = currTran.transition.to[currTran.position];
      nextSymbol = currTran.next;
    }

    newState.intermediateTransitions = newState.intermediateTransitions.concat(currTransArray);

    if (nextSymbol) {
      // recursively get all non terminal
      newState.intermediateTransitions = newState.intermediateTransitions.concat(
        getAllCurrTransitions(nextSymbol, new Set()));
    }

    let existingRuleNode = graph.filter((e) => {
      return JSON.stringify(e.intermediateTransitions) ===
        JSON.stringify(newState.intermediateTransitions);
    });

    if (existingRuleNode.length > 0) {
      // existing rule node already exists
      let rule = new Domain.Rule(fromId, sym, 'shift', existingRuleNode[0].id);
      // let rule = {
      //   fromId: fromId,
      //   symbol: sym,
      //   nextRuleId: existingRuleNode[0].id
      // };
      return rule;
    }

    newState.id = graph.length;
    graph.push(newState);

    newState.rules =
      generateRuleForCurrTransitions(newState, newState.intermediateTransitions);

    let newRule = new Domain.Rule(fromId, sym)
    return { fromId: fromId, symbol: sym, nextRuleId: newState.id };
  };

  /**
   * 
   * @param {Domain.State} node 
   * @param {Domain.IntermediateTransition[]} intermediateTransitions 
   */
  let generateRuleForCurrTransitions = (node, intermediateTransitions) => {
    let nextDict = {};
    for (let currTran of intermediateTransitions) {
      if (currTran.next && nextDict.hasOwnProperty(currTran.next)) {
        nextDict[currTran.next].push(currTran);
      } else if (currTran.next) {
        nextDict[currTran.next] = [currTran];
      }
    }

    let rules = [];
    for (let next in nextDict) {
      if (!nextDict.hasOwnProperty(next)) {
        continue;
      }
      let rule = generateRuleForNextSymbol(node.id, next, nextDict[next]);
      rules.push(rule);
    }
    return rules;
  };

  let markxRules = transitions.filter((e) => e.from.state === startSymbol);
  let markxIntermediateTransitions = markxRules.reduce((acc, curr) => {
    let intermediateTransition = new Domain.IntermediateTransition(curr, 0, new Domain.Token(curr.to[0] ? curr.to[0] : null));
    // let tran = {
    //   transition: curr,
    //   position: 0,
    //   next: curr.to[0] ? curr.to[0] : null
    // };
    acc.push(intermediateTransition);
    return acc;
  }, []);

  graph[0] = new Domain.State(0);
  graph[0].intermediateTransitions = markxIntermediateTransitions;
  graph[0].rules = generateRuleForCurrTransitions(graph[0], graph[0].intermediateTransitions);

  // generate rules for graph
  for (let node of graph) {
    let transitionReducePair = node.intermediateTransitions.reduce((acc, curr) => {
      if (curr.next) {
        acc.transitions++;
      } else if (curr.transition.lookAheadTokens.length === 0) {
        acc.reduces++;
      }
      return acc;
    }, { transitions: 0, reduces: 0 });

    let conflict = false;

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
      for (let tran of node.intermediateTransitions) {
        console.warn(tran);
      }
      console.warn('======');
    }
  }


  for (let node of graph) {
    for (let rule of node.rules) {
      // let newRule = new Rule(node.id, rule.symbol, 'shift', rule.nextRuleId);
      ruleArray.push(rule);
    }
    for (let currtran of node.intermediateTransitions) {
      if (!currtran.next) {
        for (let token of currtran.transition.lookAheadTokens) {
          let i = -1;
          for (let index in transitions) {
            if (JSON.stringify(currtran.transition) ===
              JSON.stringify(transitions[index])) {
              i = index;
              break;
            }
          }
          let newRule = new Domain.Rule(node.id, token, 'reduce', i);
          ruleArray.push(newRule);
        }
      }
    }
  }
};

module.exports.readTransitions = (callback) => {
  readTransitions(() => {
    generateRules();
    callback(terminals, nonterminals, transitions, ruleArray);
  });
};
