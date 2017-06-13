// read transitions
var transitions = [];

var graph = [{id: 0, transitions: [], rules: []}];

var readTransitions = (doneCallback) => {
  var fs = require('fs');
  var readline = require('readline');
  var stream = require('stream');

  var instream = fs.createReadStream('./transitions');
  var outstream = new stream;
  var rl = readline.createInterface(instream, outstream);

  rl.on('line', function(line) {
    if (!line || line === '') return;
    var terms = line.split(' ');

    line = line.filter((e) => e !== '*' && e !== '->');

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
    transitions.push({from: from, to: to, lookAheadToken: lookAheadToken});
  });

  rl.on('close', function() { doneCallback(); });
};

var generateRules = () => {
  // start from "markx"
  var markxRules = transitions.filter((e) => e.from === 'markx');
  var trans = markxRules.reduce((acc, curr) => {
    var tran = {
      transition: curr,
      position: 0
    };
    acc.push(tran);
  }, []);
  graph.transitions = trans;

  var generateRulesHelper = (transition) => {
    transition.position ++;
    
  };

};

readTransitions(generateRules);
