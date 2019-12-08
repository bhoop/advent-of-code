const { exec } = require("../computer");

module.exports = function([input]) {
  // example 1
  // input = '3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5';
  // example 2
  // input = '3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10'

  let initial = input.split(',').map(n => Number(n));
  let max = 0;
  for (const sequence of getAllPermutations([5,6,7,8,9])) {
    let states = sequence.map(n => [...initial]);
    let address = sequence.map(n => 0);
    let inputs = [
      [ sequence[0], 0 ],
      ...sequence.slice(1).map(n => [n])
    ];

    let amp = 0;
    while (true) {
      const [amp_program, amp_address, amp_inputs, amp_output] = exec({
        program:states[amp],
        i: address[amp],
        inputs: inputs[amp]
      });
      // update state for this am
      states[amp] = amp_program;
      address[amp] = amp_address;
      inputs[amp] = amp_inputs;

      // if output was given, set the next amp's input and then
      // switch to that next amp (loop back to beginning if necessary)
      if (amp_output !== undefined) {
        amp = (amp + 1) % 5;
        inputs[ amp ].push(amp_output);
      }
      
      // if amp reached EOP (opcode 99), then print out the output from
      // the final amp (which was set as the input of the first amp) and stop.
      if (amp_address === false) {
        max = Math.max(max, inputs[0]);
        break;
      }
    }
  }

  console.log('Answer:', max);
}

function getAllPermutations(input) {
  var results = [];

  if (input.length === 1) {
    return [input];
  }

  for (var i = 0; i < input.length; i++) {
    var firstChar = input[i];
    var charsLeft = input.slice(0, i).concat(input.slice(i+1));
    var innerPermutations = getAllPermutations(charsLeft);
    for (var j = 0; j < innerPermutations.length; j++) {
      results.push([firstChar, ...innerPermutations[j]]);
    }
  }
  return results;
}
