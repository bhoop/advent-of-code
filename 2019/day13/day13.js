const { exec, parse } = require("../computer");
const { produce } = require("immer");
const Display = require("../display");

module.exports = function([input]) {
  let program = parse(input);

  // free credits!
  program[0] = 2;

  let board = new Display();
  let score = 0;
  let ballX = -1;
  let paddleX = -1;

  let state = { program, i:0, rbase:0, inputs:[], outputs:[] };
  while (state.i !== false) {
    state = produce(state, next => {
      next.inputs = [ballX === paddleX ? 0 : (ballX < paddleX ? -1 : 1)];
      exec(next);

      if (next.outputs.length === 3) {
        const [x, y, t] = next.outputs;
        if (x === -1 && y === 0) score = t;
        else {
          if (t === 3) paddleX = x;
          if (t === 4) ballX = x;
          board.set(x, y, t);
        }
        next.outputs = [];
      }
    });
  }

  console.log('Score is', score);
  board.render({
    0: ' ', // empty
    1: '█', // wall
    2: '■', // block
    3: '━', // paddle
    4: '⚾', // ball
  });
}
