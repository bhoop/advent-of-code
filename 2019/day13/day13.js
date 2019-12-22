const { exec, parse } = require("../computer");
const { produce } = require("immer");
const Display = require("../display");

module.exports = function([input]) {
  let program = parse(input);

  let board = new Display();

  let state = { program, i:0, rbase:0, inputs:[], outputs:[] };
  while (state.i !== false) {
    state = produce(state, next => {
      exec(next);

      if (next.outputs.length === 3) {
        board.set.apply(board, next.outputs);
        next.outputs = [];
      }
    });
  }

  console.log('Board has', Object.values(board.values).filter(v => v === 2).length, 'blocks');
  // board.render({
  //   0: ' ', // empty
  //   1: '█', // wall
  //   2: '■', // block
  //   3: '━', // paddle
  //   4: '⚾', // ball
  // });
}
