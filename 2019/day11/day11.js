const { produce } = require("immer");
const { exec } = require("../computer");

const NORTH = 0;
const EAST = 1;
const SOUTH = 2;
const WEST = 3;

const TURNS = {
  [NORTH]: [
    {dir: WEST, x:-1, y:0, $:'WEST'},
    {dir: EAST, x: 1, y:0, $:'EAST'}
  ],
  [EAST]: [
    {dir: NORTH, x:0, y: 1, $:'NORTH'},
    {dir: SOUTH, x:0, y:-1, $:'SOUTH'}
  ],
  [SOUTH]: [
    {dir: EAST, x: 1, y:0, $:'EAST'},
    {dir: WEST, x:-1, y:0, $:'WEST'}
  ],
  [WEST]: [
    {dir: SOUTH, x:0, y:-1, $:'SOUTH'},
    {dir: NORTH, x:0, y:1, $:'NORTH'}
  ]
}

const BLACK = 0;
const WHITE = 1;
const COLORS = {
  [BLACK]: '\x1b[40m \x1b[0m',
  [WHITE]: '\x1b[47m \x1b[0m',
};

module.exports = function([input]) {
  let program = input.split(',').map(n => Number(n));
  let state = { program, i:0, rbase:0, inputs:[ 1 ], outputs:[] };

  console.log(state);

  let painted = {};
  let x = 0;
  let y = 0;
  let nextOutputPaints = true;
  let dir = NORTH;

  let xMin = Infinity,
      xMax = 0,
      yMin = Infinity,
      yMax = 0;


  while (state.i !== false) {
    const key = `${x},${y}`;
    state = produce(state, next => {
      exec(next);

      if (next.outputs.length > 0) {
        const output = next.outputs.pop();
        if (nextOutputPaints) {
          // console.log(`PAINT ${key} ${output}`, output);
          // paint
          painted[key] = output;
          next.inputs = [output];
        } else {
          // console.log(`TURN ${TURNS[dir][output].$}`, output);
          // turn
          const turn = TURNS[dir][output]
          dir = turn.dir;
          x += turn.x;
          y += turn.y;
          if (x < xMin) xMin = x;
          if (x > xMax) xMax = x;
          if (y < yMin) yMin = y;
          if (y > yMax) yMax = y;
          next.inputs = [ painted[`${x},${y}`] || 0 ];
        }
        nextOutputPaints = !nextOutputPaints;
      }
    });
  }

  for (let y = yMax; y >= yMin; y--) {
    let row = [];
    for (let x = xMin; x <= xMax; x++) {
      row.push( COLORS[ painted[`${x},${y}`] || 0 ] );
    }
    console.log(row.join(''));
  }

  console.log("PAINTED", Object.keys(painted).length);
}
