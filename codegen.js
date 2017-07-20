let Domain = require('./domain');

let outputHtml = [];

let presetHeader = [];
let presetFooter = [];

let readPresetHeader = () => {
  let fs = require('fs');
  presetHeader =
      fs.readFileSync('./db_script/presetHeader').toString().split('\n');
};

let readPresetFooter = () => {
  let fs = require('fs');
  presetFooter =
      fs.readFileSync('./db_script/presetFooter').toString().split('\n');
};

let codegenMarkx = (tree) => {
  switch (tree.str) {
    case 'markx -> NEWFILE statements ENDFILE':
      codegen(tree.nodes[1]);
      break;
  }
};

let codegenStatement = (tree) => {
  switch (tree.str) {
    case 'statement -> NEWLINE ENDLINE':
      outputHtml.push('<br />');
      break;
    case 'statement -> NEWLINE POUND inlines POUND ENDLINE':
      outputHtml.push('<h1 class="title">');
      codegen(tree.nodes[2]);
      outputHtml.push('</h1>');
      break;
    case 'statement -> NEWLINE POUND SINGLESPACE inlines ENDLINE':
      outputHtml.push('<h1>');
      codegen(tree.nodes[3]);
      outputHtml.push('</h1>');
      break;
    case 'statement -> NEWLINE POUND POUND SINGLESPACE inlines ENDLINE':
      outputHtml.push('<h2>');
      codegen(tree.nodes[4]);
      outputHtml.push('</h2>');
      break;
    case 'statement -> NEWLINE POUND POUND POUND SINGLESPACE inlines ENDLINE':
      outputHtml.push('<h3>');
      codegen(tree.nodes[5]);
      outputHtml.push('</h3>');
      break;
    case 'statement -> NEWLINE POUND POUND POUND POUND SINGLESPACE inlines ENDLINE':
      outputHtml.push('<h4>');
      codegen(tree.nodes[6]);
      outputHtml.push('</h4>');
      break;
    case 'statement -> NEWLINE POUND POUND POUND POUND POUND SINGLESPACE inlines ENDLINE':
      outputHtml.push('<h5>');
      codegen(tree.nodes[7]);
      outputHtml.push('</h5>');
      break;
    case 'statement -> NEWLINE POUND POUND POUND POUND POUND POUND SINGLESPACE inlines ENDLINE':
      outputHtml.push('<h6>');
      codegen(tree.nodes[8]);
      outputHtml.push('</h6>');
      break;
    case 'statement -> NEWLINE ESC ESC ESC SINGLESPACE WORD ENDLINE codelines ESC ESC ESC':
      outputHtml.push('<code>');
      outputHtml.push('<pre>');
      // TODO: color code
      codegen(tree.nodes[7]);
      outputHtml.push('</pre>');
      outputHtml.push('</code>');
      break;
    case 'statement -> NEWLINE inlines ENDLINE':
      outputHtml.push('<p>');
      codegen(tree.nodes[1]);
      outputHtml.push('</p>');
      break;
    case 'statement -> NEWLINE RIGHTANGLE RIGHTANGLE RIGHTANGLE ENDLINE lines LEFTANGLE LEFTANGLE LEFTANGLE':
      outputHtml.push('<div class="block-quote">');
      codegen(tree.nodes[5]);
      outputHtml.push('</div>');
      break;
    case 'statement -> NEWLINE CARET CARET CARET ENDLINE lines CARET CARET CARET':
      outputHtml.push('<div class="boxed">');
      codegen(tree.nodes[5]);
      outputHtml.push('</div>');
      break;
    case 'statement -> list':
      codegen(tree.nodes[0]);
      break;
    case 'statement -> NEWLINE MINUS MINUS MINUS ENDLINE':
      outputHtml.push('<hr class="light" />');
      break;
    case 'statement -> NEWLINE EQUAL EQUAL EQUAL ENDLINE':
      outputHtml.push('<hr class="heavy" />');
      break;
    case 'statement -> NEWLINE SQUIGGLY SQUIGGLY SQUIGGLY ENDLINE':
      outputHtml.push('<hr class="squiggly" />');
      break;
    case 'statement -> NEWLINE CARET CARET CARET SINGLESPACE LEFTANGLE ENDLINE lines CARET CARET CARET':
      outputHtml.push('<p class="align-left">');
      codegen(tree.nodes[7]);
      outputHtml.push('</p>');
      break;
    case 'statement -> NEWLINE CARET CARET CARET SINGLESPACE RIGHTANGLE ENDLINE lines CARET CARET CARET':
      outputHtml.push('<p class="align-right">');
      codegen(tree.nodes[7]);
      outputHtml.push('</p>');
      break;
    case 'statement -> NEWLINE CARET CARET CARET SINGLESPACE EQUAL ENDLINE lines CARET CARET CARET':
      outputHtml.push('<p class="align-center">');
      codegen(tree.nodes[7]);
      outputHtml.push('</p>');
      break;
    case 'statement -> NEWLINE CARET CARET CARET SINGLESPACE EQUAL EQUAL ENDLINE lines CARET CARET CARET':
      outputHtml.push('<p class="fit-width">');
      codegen(tree.nodes[8]);
      outputHtml.push('</p>');
      break;
    case 'statement -> NEWLINE CARET CARET CARET SINGLESPACE EQUAL SINGLESPACE EQUAL ENDLINE lines CARET CARET CARET':
      outputHtml.push('<p>');
      outputHtml.push('<div class="column column-2">');
      codegen(tree.nodes[9]);
      outputHtml.push('</div>');
      outputHtml.push('</p>');
      break;
    case 'statement -> NEWLINE CARET CARET CARET SINGLESPACE EQUAL SINGLESPACE EQUAL SINGLESPACE EQUAL ENDLINE lines CARET CARET CARET':
      outputHtml.push('<p>');
      outputHtml.push('<div class="column column-3">');
      codegen(tree.nodes[9]);
      outputHtml.push('</div>');
      outputHtml.push('</p>');
      break;
  }
};

let codegenList = (tree) => {
  switch (tree.str) {
    case 'list -> NEWLINE LOWERROMAN SINGLESPACE inlines ENDLINE sublist':
      outputHtml.push('<ol class="lower-roman">');
      outputHtml.push('<li>');
      codegen(tree.nodes[3]);
      outputHtml.push('</li>');
      codegen(tree.nodes[5]);
      outputHtml.push('</ol>');
      break;
    case 'list -> NEWLINE UPPERROMAN SINGLESPACE inlines ENDLINE sublist':
      outputHtml.push('<ol class="upper-roman">');
      outputHtml.push('<li>');
      codegen(tree.nodes[3]);
      outputHtml.push('</li>');
      codegen(tree.nodes[5]);
      outputHtml.push('</ol>');
      break;
    case 'list -> NEWLINE RIGHTANGLE SINGLESPACE inlines ENDLINE sublist':
      outputHtml.push('<ol class="arrow">');
      outputHtml.push('<li>');
      codegen(tree.nodes[3]);
      outputHtml.push('</li>');
      codegen(tree.nodes[5]);
      outputHtml.push('</ol>');
      break;
    case 'list -> NEWLINE MINUS SINGLESPACE inlines ENDLINE sublist':
      outputHtml.push('<ol class="dash">');
      outputHtml.push('<li>');
      codegen(tree.nodes[3]);
      outputHtml.push('</li>');
      codegen(tree.nodes[5]);
      outputHtml.push('</ol>');
      break;
    case 'list -> NEWLINE PLUS SINGLESPACE inlines ENDLINE sublist':
      outputHtml.push('<ol class="square">');
      outputHtml.push('<li>');
      codegen(tree.nodes[3]);
      outputHtml.push('</li>');
      codegen(tree.nodes[5]);
      outputHtml.push('</ol>');
      break;
    case 'list -> NEWLINE ASTERISK SINGLESPACE inlines ENDLINE sublist':
      outputHtml.push('<ol class="disc">');
      outputHtml.push('<li>');
      codegen(tree.nodes[3]);
      outputHtml.push('</li>');
      codegen(tree.nodes[5]);
      outputHtml.push('</ol>');
      break;
    case 'list -> NEWLINE LOWERA SINGLESPACE inlines ENDLINE sublist':
      outputHtml.push('<ol class="lower-alphabet">');
      outputHtml.push('<li>');
      codegen(tree.nodes[3]);
      outputHtml.push('</li>');
      codegen(tree.nodes[5]);
      outputHtml.push('</ol>');
      break;
    case 'list -> NEWLINE UPPERA SINGLESPACE inlines ENDLINE sublist':
      outputHtml.push('<ol class="upper-alphabet">');
      outputHtml.push('<li>');
      codegen(tree.nodes[3]);
      outputHtml.push('</li>');
      codegen(tree.nodes[5]);
      outputHtml.push('</ol>');
      break;
    case 'list -> NEWLINE NUMONE SINGLESPACE inlines ENDLINE sublist':
      outputHtml.push('<ol class="number">');
      outputHtml.push('<li>');
      codegen(tree.nodes[3]);
      outputHtml.push('</li>');
      codegen(tree.nodes[5]);
      outputHtml.push('</ol>');
      break;
  }
};

let codegenSublist = (tree) => {
  switch (tree.str) {
    case 'sublist -> NEWLINE LOWERROMAN SINGLESPACE inlines ENDLINE sublist':
    case 'sublist -> NEWLINE UPPERROMAN SINGLESPACE inlines ENDLINE sublist':
    case 'sublist -> NEWLINE RIGHTANGLE SINGLESPACE inlines ENDLINE sublist':
    case 'sublist -> NEWLINE MINUS SINGLESPACE inlines ENDLINE sublist':
    case 'sublist -> NEWLINE PLUS SINGLESPACE inlines ENDLINE sublist':
    case 'sublist -> NEWLINE ASTERISK SINGLESPACE inlines ENDLINE sublist':
    case 'sublist -> NEWLINE LOWERA SINGLESPACE inlines ENDLINE sublist':
    case 'sublist -> NEWLINE UPPERA SINGLESPACE inlines ENDLINE sublist':
    case 'sublist -> NEWLINE NUMONE SINGLESPACE inlines ENDLINE sublist':
      outputHtml.push('<li>');
      codegen(tree.nodes[3]);
      outputHtml.push('</li>');
      codegen(tree.nodes[5]);
      break;
  }
};

let codegenStatements = (tree) => {
  switch (tree.str) {
    case 'statements -> statement statements':
      codegen(tree.nodes[0]);
      codegen(tree.nodes[1]);
      break;
    case 'statements ->':
      break;
  }
};

let codegenLines = (tree) => {
  switch (tree.str) {
    case 'lines -> NEWLINE inlines ENDLINE sublines':
      codegen(tree.nodes[1]);
      codegen(tree.nodes[3]);
      break;
  }
};

let codegenInlines = (tree) => {
  switch (tree.str) {
    case 'inlines -> inline subinlines':
      codegen(tree.nodes[0]);
      codegen(tree.nodes[1]);
      break;
  }
};

let codegenInline = (tree) => {
  switch (tree.str) {
    case 'inline -> LEFTSQUAREBRACKET words RIGHTSQUAREBRACKET LEFTPAREN url RIGHTPAREN':
       outputHtml.push('<a href="');
      codegen(tree.nodes[4]);
       outputHtml.push('" target="_blank">');
      codegen(tree.nodes[1]);
       outputHtml.push('</a>');
      break;
    case 'inline -> LEFTANGLE url RIGHTANGLE':
       outputHtml.push('<a href="');
      codegen(tree.nodes[1]);
       outputHtml.push('" target="_blank">');
      codegen(tree.nodes[1]);
       outputHtml.push('</a>');
      break;
    case 'inline -> EXCLAMATION LEFTSQUAREBRACKET words RIGHTSQUAREBRACKET LEFTPAREN url RIGHTPAREN':
       outputHtml.push('<img src="');
      codegen(tree.nodes[5]);
       outputHtml.push('" alt="');
      codegen(tree.nodes[2]);
       outputHtml.push('">');
      break;
    case 'inline -> UNDERSCORE LEFTBRACKET words RIGHTBRACKET':
       outputHtml.push('<sub>');
      codegen(tree.nodes[2]);
       outputHtml.push('</sub>');
      break;
    case 'inline -> CARET LEFTBRACKET words RIGHTBRACKET':
       outputHtml.push('<sup>');
      codegen(tree.nodes[2]);
       outputHtml.push('</sup>');
      break;
    case 'inline -> LEFTSQUAREBRACKET CARET NUM RIGHTSQUAREBRACKET':
    case 'inline -> LEFTSQUAREBRACKET CARET NUMONE RIGHTSQUAREBRACKET':
       outputHtml.push('<sup><a id="');
      codegen(tree.nodes[2]);
       outputHtml.push('" href="#');
      codegen(tree.nodes[2]);
       outputHtml.push('">[');
      codegen(tree.nodes[2]);
       outputHtml.push(']</a></sup>');
      break;
    case 'inline -> DOLLAR math DOLLAR':
      codegen(tree.nodes[1]);
      break;
    case 'inline -> DOLLAR DOLLAR math DOLLAR DOLLAR':
      codegen(tree.nodes[2]);
      break;
    case 'inline -> PERCENT string':
      break;
    case 'inline -> words':
      codegen(tree.nodes[0]);
      break;
    case 'inline -> ESC words ESC':
      outputHtml.push('<span class="inline">');
      codegen(tree.nodes[1]);
      outputHtml.push('</span>');
      break;
    case 'inline -> ASTERISK words ASTERISK':
      outputHtml.push('<i>');
      codegen(tree.nodes[1]);
      outputHtml.push('<i>');
      break;
    case 'inline -> ASTERISK ASTERISK words ASTERISK ASTERISK':
      outputHtml.push('<b>');
      codegen(tree.nodes[2]);
      outputHtml.push('<b>');
      break;
    case 'inline -> ASTERISK ASTERISK ASTERISK words ASTERISK ASTERISK ASTERISK':
      outputHtml.push('<b><i>');
      codegen(tree.nodes[3]);
      outputHtml.push('</i></b>');
      break;
    case 'inline -> UNDERSCORE words UNDERSCORE':
      outputHtml.push('<u>');
      codegen(tree.nodes[1]);
      outputHtml.push('<u>');
      break;
    case 'inline -> UNDERSCORE UNDERSCORE words UNDERSCORE UNDERSCORE':
      outputHtml.push('<s>');
      codegen(tree.nodes[2]);
      outputHtml.push('<s>');
      break;
    case 'inline -> UNDERSCORE UNDERSCORE UNDERSCORE words UNDERSCORE UNDERSCORE UNDERSCORE':
      outputHtml.push('<u><s>');
      codegen(tree.nodes[3]);
      outputHtml.push('</u></s>');
      break;
    case 'inline -> MINUS words MINUS':
      outputHtml.push('<mark>');
      codegen(tree.nodes[1]);
      outputHtml.push('</mark>');
      break;
    case 'inline -> MINUS MINUS words MINUS MINUS':
      outputHtml.push('<span class="red">');
      codegen(tree.nodes[2]);
      outputHtml.push('</span>');
      break;
    case 'inline -> MINUS MINUS MINUS words MINUS MINUS MINUS':
      outputHtml.push('<span class="box">');
      codegen(tree.nodes[3]);
      outputHtml.push('</span>');
      break;
    case 'inline -> SPACE':
      outputHtml.push(' ');
      break;
  }
};

let codegenCodelines = (tree) => {
  switch (tree.str) {
    case 'codelines -> NEWLINE string ENDLINE codelines':
      codegen(tree.nodes[1]);
      codegen(tree.nodes[3]);
      break;
    case 'codelines ->':
      break;
  }
};

let codegenString = (tree) => {
  switch (tree.str) {
    case 'string -> words':
      codegen(tree.nodes[0]);
      break;
  }
};

let codegenMath = (tree) => {
  switch (tree.str) {
    case 'math -> WORD math':
    case 'math -> POUND math ':
    case 'math -> ESC math ':
    case 'math -> ASTERISK math ':
    case 'math -> UNDERSCORE math ':
    case 'math -> RIGHTANGLE math ':
    case 'math -> LEFTANGLE math ':
    case 'math -> CARET math ':
    case 'math -> NUMONE math ':
    case 'math -> NUM math ':
    case 'math -> UPPERA math ':
    case 'math -> LOWERA math ':
    case 'math -> UPPERROMAN math ':
    case 'math -> LOWERROMAN math ':
    case 'math -> PLUS math ':
    case 'math -> MINUS math ':
    case 'math -> EQUAL math ':
    case 'math -> SQUIGGLY math ':
    case 'math -> LEFTSQUAREBRACKET math ':
    case 'math -> RIGHTSQUAREBRACKET math ':
    case 'math -> LEFTPAREN math ':
    case 'math -> RIGHTPAREN math ':
    case 'math -> EXCLAMATION math ':
    case 'math -> LEFTBRACKET math ':
    case 'math -> RIGHTBRACKET math ':
    case 'math -> BAR math ':
    case 'math -> SPACES math ':
    case 'math -> SINGLESPACE math ':
    case 'math -> PERCENT math ':
    case 'math -> SLASH math':
      outputHtml.push(tree.nodes[0].str.split(' ')[1]);
      codegen(tree.nodes[1]);
      break;
    case 'math ->':
      break;
  }
};

let codegenUrl = (tree) => {
  switch (tree.str) {
    case 'url -> WORD url':
    case 'url -> UNDERSCORE url':
    case 'url -> NUMONE url':
    case 'url -> NUM url':
    case 'url -> UPPERA url':
    case 'url -> LOWERA url':
    case 'url -> UPPERROMAN url':
    case 'url -> LOWERROMAN url':
    case 'url -> PLUS url':
    case 'url -> MINUS url':
    case 'url -> EQUAL url':
    case 'url -> SQUIGGLY url':
    case 'url -> LEFTSQUAREBRACKET url':
    case 'url -> RIGHTSQUAREBRACKET url':
    case 'url -> LEFTPAREN url':
    case 'url -> EXCLAMATION url':
    case 'url -> SLASH url':
    case 'url -> POUND url':
      outputHtml.push(tree.nodes[0].str.split(' ')[1]);
      codegen(tree.nodes[1]);
      break;
    case 'url ->':
      break;
  }
};

let codegenSubinlines = (tree) => {
  switch (tree.str) {
    case 'subinlines -> inline subinlines':
      codegen(tree.nodes[0]);
      codegen(tree.nodes[1]);
      break;
    case 'subinlines':
      break;
  }
};

let codegenWords = (tree) => {
  switch (tree.str) {
    case 'words -> WORD subwords':
    case 'words -> NUMONE subwords':
    case 'words -> NUM subwords':
    case 'words -> UPPERA subwords':
    case 'words -> LOWERA subwords':
    case 'words -> UPPERROMAN subwords':
    case 'words -> LOWERROMAN subwords':
      outputHtml.push(tree.nodes[0].str.split(' ')[1]);
      codegen(tree.nodes[1]);
      break;
    case 'words -> SPACES subwords':
    case 'words -> SINGLESPACE subwords':
      outputHtml.push(' ');
      codegen(tree.nodes[1]);
      break;
  }
};

let codegenSubwords = (tree) => {
  switch (tree.str) {
    case 'subwords -> WORD subwords':
    case 'subwords -> NUMONE subwords':
    case 'subwords -> NUM subwords':
    case 'subwords -> UPPERA subwords':
    case 'subwords -> LOWERA subwords':
    case 'subwords -> UPPERROMAN subwords':
    case 'subwords -> LOWERROMAN subwords':
      outputHtml.push(tree.nodes[0].str.split(' ')[1]);
      codegen(tree.nodes[1]);
    case 'subwords -> SPACES subwords':
    case 'subwords -> SINGLESPACE subwords':
      outputHtml.push(' ');
      codegen(tree.nodes[1]);
      break;
    case 'subwords ->':
      break;
  }
};

let codegen = (tree) => {
  var fromTerm = tree.str.split(' ')[0];
  switch (fromTerm) {
    case 'markx':
      codegenMarkx(tree);
      break;
    case 'statements':
      codegenStatements(tree);
      break;
    case 'inlines':
      codegenInlines(tree);
      break;
    case 'inline':
      codegenInline(tree);
      break;
    case 'subinline':
      codegenSubinlines(tree);
      break;
    case 'words':
      codegenWords(tree);
      break;
    case 'subwords':
      codegenSubwords(tree);
      break;
    case 'statement':
      codegenStatement(tree);
      break;
    case 'list':
      codegenList(tree);
      break;
    case 'sublist':
      codegenSublist(tree);
      break;
    case 'lines':
      codegenLines(tree);
      break;
    case 'subinlines':
      codegenSubinlines(tree);
      break;
    case 'codelines':
      codegenCodelines(tree);
      break;
    case 'codeline':
      codegenCodeline(tree);
      break;
    case 'string':
      codegenString(tree);
      break;
    case 'math':
      codegenMath(tree);
      break;
    case 'url':
      codegenUrl(tree);
      break;
  }
};

// let output = () => {
//   let fs = require('fs');
//   fs.writeFileSync('output.html', outputHtml.join('\n'));
// };



// let compile = (filelines, cb) => {
//   try {
//     let Scanner = require('./scanner');
//     let myScanner = new Scanner((scanFunc) => {
//       scanFunc(filelines, function(result) {
//         parser((tree) => {
//           readPresetHeader();
//           readPresetFooter();
//           outputHtml = outputHtml.concat(presetHeader);
//           codegen(tree);
//           outputHtml = outputHtml.concat(presetFooter);
//           // output();
//           cb(outputHtml.join(''));
//         }, result);
//       });
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };

class CodeGenerator {
  constructor() {
    readPresetHeader();
    readPresetFooter();
  }

  _clean() {
    outputHtml = [];
  }

  GenerateCode(tree) {
    this._clean();
    outputHtml = outputHtml.concat(presetHeader);
    codegen(tree);
    outputHtml = outputHtml.concat(presetFooter);
    return outputHtml.join('');
  }
}

module.exports = CodeGenerator;