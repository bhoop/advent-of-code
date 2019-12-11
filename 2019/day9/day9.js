const { parse, runProgram } = require('../computer');

module.exports = function([input]) {
  // example 1 should output itself
  // input = '109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99';
  const [program, outputs] = runProgram({program:parse(input), inputs:[2]});
  console.log('Answer:', outputs);
}
