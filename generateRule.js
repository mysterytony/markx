'use strict'

const Domain = require('./domain');

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
const startSymbol = 'markx';
const transitionRuleFile = "mocktransitions";

let readTransitions = (doneCallback) => {
  let fs = require('fs');
  let readline = require('readline');
  let Stream = require('stream');

  let instream = fs.createReadStream('./db_script/' + transitionRuleFile);
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

    if (nonterminals.findIndex(Domain.Term.equal, from) === -1) {
      nonterminals.push(from);
    }

    for (let i = 1; i < terms.length; ++i) {
      if (terms[i].indexOf('{') > -1 && terms[i].indexOf('}') > -1) {
        
        lookAheadTokens = lookAheadTokens.concat(terms[i].replace('{','').replace('}','').split(','));
      } else if (terms[i].toLowerCase() === terms[i]) { // non terminal
        to.push(new Domain.NonTerminal(terms[i]));
        if (nonterminals.findIndex(Domain.Term.equal, new Domain.NonTerminal(terms[i])) === -1) {
          nonterminals.push(new Domain.NonTerminal(terms[i]));
        }
      } else { // terminal
        to.push(new Domain.Terminal(terms[i]));
        if (terminals.findIndex(Domain.Term.equal, new Domain.Terminal(terms[i])) === -1) {
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
  let getAllIntermediateTransitions = (nextTerm, symbolsGeneratedFor) => {
    // check if nextSymbol is a non terminal
    if (nextTerm.termName === nextTerm.termName.toLowerCase()) {
      let derivedTransitions = transitions.filter((e) => {
        return e.from.termName === nextTerm.termName;
      });

      let currTransArray = [];
      // symbolsGeneratedFor.push(currTran.transition.from);

      for (let derivedTran of derivedTransitions) {
        let currTran = new Domain.IntermediateTransition(
          derivedTran, 0, derivedTran.to[0] ? derivedTran.to[0] : null);

        currTransArray.push(currTran);
        symbolsGeneratedFor.add(derivedTran.from.termName);

        if (currTran.next && !symbolsGeneratedFor.has(currTran.next.termName)) {
          let nextCurrTransitions =
            getAllIntermediateTransitions(currTran.next, symbolsGeneratedFor);
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
    let currTransArray = JSON.parse(JSON.stringify(intermediateTransitions));
    let nextSymbols = [];

    for (let currTran of currTransArray) {
      currTran.position++;
      currTran.next = currTran.transition.to[currTran.position];
      if (!nextSymbol)
        nextSymbols.push(currTran.next);
    }

    newState.intermediateTransitions = newState.intermediateTransitions.concat(currTransArray);

    for (var nextSymbol of nextSymbols) {
      // recursively get all non terminal
      if (nextSymbol)
        newState.intermediateTransitions = newState.intermediateTransitions.concat(
          getAllIntermediateTransitions(nextSymbol, new Set()));
    }

    let existingRuleNode = graph.filter((e) => {
      return JSON.stringify(e.intermediateTransitions) ===
        JSON.stringify(newState.intermediateTransitions);
    });

    if (existingRuleNode.length > 0) {
      // existing rule node already exists
      let rule = new Domain.Rule(fromId, sym, Domain.RuleType.shift, existingRuleNode[0].id);
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

    let newRule = new Domain.Rule(fromId, sym, Domain.RuleType.shift, newState.id);
    return newRule;
    // return { fromId: fromId, symbol: sym, nextRuleId: newState.id };
  };

  /**
   * 
   * @param {domain.State} node 
   * @param {Domain.IntermediateTransition[]} intermediateTransitions 
   */
  let generateRuleForCurrTransitions = (node, intermediateTransitions) => {
    let nextDict = {};
    for (let currTran of intermediateTransitions) {
      if (currTran.next && nextDict.hasOwnProperty(currTran.next.termName)) {
        nextDict[currTran.next.termName].push(currTran);
      } else if (currTran.next) {
        nextDict[currTran.next.termName] = [currTran];
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

  let markxRules = transitions.filter((e) => e.from.termName === startSymbol);
  let markxIntermediateTransitions = markxRules.reduce((acc, curr) => {
    let intermediateTransition = new Domain.IntermediateTransition(curr, 0, curr.to[0]);
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
    let needLookAheadTokens = node.intermediateTransitions.reduce((acc, curr) => {
      if (!curr.next && curr.transition.lookAheadTokens.length === 0) {
        acc++;
      }
      return acc;
    }, 0);
    
    if (needLookAheadTokens > 0) {
      console.warn('need look ahead token');
      console.warn('node id: ' + node.id);
      for (let inter of node.intermediateTransitions) {
        console.warn("position: " + inter.position);
        console.warn("transition from: " + inter.transition.from.termName);
        for (let tran of inter.transition.to) {
          console.warn(tran.termName);
        }
      }
      console.warn('===================');
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
          let newRule = new Domain.Rule(node.id, token, Domain.RuleType.reduce, parseInt(i));
          ruleArray.push(newRule);
        }
      }
    }
  }
};

module.exports = (callback) => {
  readTransitions(() => {
    generateRules();
    callback(terminals, nonterminals, transitions, ruleArray);
  });
};
