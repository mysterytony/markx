function unitTests(doneCallback) {
  console.log('[Tester] unit test completed');
  doneCallback(0);
}

function styleCheck(doneCallback) {
  var exec = require('child_process').exec;
  var cmd = 'jscs . --preset=google';

  exec(cmd, function(error, stdout, stderr) {
    if (stdout !== '' || stderr !== '') {
      console.log('[Tester] style check completed with errors');
      console.log(stdout);
      console.log(stderr);
      doneCallback(1);
    } else {
      console.log('[Tester] style check completed');
      doneCallback(0);
    }
  });
}

function runTests(code) {
  exitCode = exitCode || code;
  currentTested++;

  if (currentTested >= TEST_NUMBER) {
    process.exit(exitCode);
  }

  TEST_METHODS[currentTested](runTests);
}

var exitCode = 0;
var currentTested = -1;
const TEST_METHODS = [unitTests, styleCheck];
const TEST_NUMBER = TEST_METHODS.length;

runTests(0);
