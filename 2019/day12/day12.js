const { produce } = require("immer");

module.exports = function(input) {
  let STEPS = 1000;

  // example 1
  // STEPS = 10;
  // input = ['<x=-1, y=0, z=2>',
  //           '<x=2, y=-10, z=-7>',
  //           '<x=4, y=-8, z=8>',
  //           '<x=3, y=5, z=-1>'];

  // example 2
  // STEPS = 100;
  // input = ['<x=-8, y=-10, z=0>',
  //          '<x=5, y=5, z=10>',
  //          '<x=2, y=-7, z=3>',
  //          '<x=9, y=-8, z=-3>'];

  let planets = input.map(str => {
    const [ _, x, y, z] = str.match(/^<x=(-?\d+), y=(-?\d+), z=(-?\d+)>$/);
    return {
      position: [Number(x), Number(y), Number(z)],
      velocity: [0, 0, 0]
    }
  });

  console.log("// STEP 0", planets);

  for (let i = 0; i < STEPS; i++) {
    planets = step(planets);
  }

  console.log("// STEP", STEPS, planets);

  let energy = planets.map(p => {
    return {
      pot: p.position.reduce((p,v) => p + Math.abs(v), 0),
      kin: p.velocity.reduce((p,v) => p + Math.abs(v), 0)
    }
  });
  console.log("ENERGY", energy);

  console.log("TOTAL ENERGY", energy.reduce((p,v) => p + v.pot * v.kin, 0));
}

function step(planets) {
  return produce(planets, next => {
    for (let a of next) {
      for (let b of next) {
        if (a === b) continue;
        for (let i = 0; i < 3; i++) {
          if (a.position[i] < b.position[i]) a.velocity[i]++;
          else if (a.position[i] > b.position[i]) a.velocity[i]--;
        }
      }
    }

    for (let p of next) {
      for (let i = 0; i < 3; i++) {
        p.position[i] += p.velocity[i];
      }
    }
  });
}