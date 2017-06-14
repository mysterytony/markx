// read transitions
var transitions = [];

var graph = [{ id: 0, currTransitions: [], rules: [] }];

var readTransitions = (doneCallback) => {
  var fs = require('fs');
  var readline = require('readline');
  var stream = require('stream');

  var instream = fs.createReadStream('c:\\Users\\TOLi\\Desktop\\markx\\db_script\\transitions');
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
      var derivedTransitions = transitions.filter((e) => {
        return e.from === nextSymbol;
      });

      var currTransArray = [];
      // symbolsGeneratedFor.push(currTran.transition.from);

      for (var derivedTran of derivedTransitions) {
        var currTran = {
          transition: derivedTran,
          position: 0,
          next: derivedTran.to[0] ? derivedTran.to[0] : null
        };

        currTransArray.push(currTran);
        symbolsGeneratedFor.add(derivedTran.from);

        if (currTran.next && !symbolsGeneratedFor.has(currTran.next)) {
          var nextCurrTransitions = getAllCurrTransitions(currTran.next, symbolsGeneratedFor);
          currTransArray.concat(nextCurrTransitions);
        }

      }

      return currTransArray;
    }

    return [];
  };

  var genreateRuleForNextSymbol = (sym, currTransitions) => {
    // generate a new rule node

    var newNode = { id: 0, currTransitions: [], rules: [] };
    var currTransArray = JSON.parse(JSON.stringify(currTransitions));
    var nextSymbol = null;

    for (var currTran of currTransArray) {
      currTran.position++;
      currTran.next = currTran.transition.to[currTran.position];
      nextSymbol = currTran.next;
    }

    // recursively get all non terminal
    newNode.currTransitions.concat(getAllCurrTransitions(nextSymbol, new Set()));

    var existingRuleNode = graph.filter((e) => {
      e.currTransitions === newNode.currTransitions;
    });

    if (existingRuleNode.length > 0) {
      // existing rule node already exists
      var rule = {
        symbol: sym,
        nextRuleId: existingRuleNode[0].id
      };
      return rule;
    }

    newNode.id = graph.length;
    graph.push(newNode);

    newNode.rules = generateRuleForCurrTransitions(newNode, newNode.currTransitions);

    return {
      symbol: sym,
      nextRuleId: newNode.id
    };
  };

  var generateRuleForCurrTransitions = (node, currTransitions) => {
    var nextDict = {};
    for (var currTran of currTransitions) {
      if (nextDict.hasOwnProperty(currTran.next)) {
        nextDict[currTran.next].push(currTran);
      } else {
        nextDict[currTran.next] = [currTran];
      }
    }

    var rules = [];
    for (var next in nextDict) {
      if (!nextDict.hasOwnProperty(next)) continue;
      var rule = genreateRuleForNextSymbol(next, nextDict[next]);
      rules.push(rule);
    }

    return rules;
  };

  // start from "markx"
  var markxRules = transitions.filter((e) => e.from === 'markx');
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

  graph[0].rules = generateRuleForCurrTransitions(graph[0], graph[0].currTransitions);

  console.log(graph);
};

readTransitions(generateRules);
