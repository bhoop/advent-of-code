const { produce } = require("immer");

function comp(a, b) {
  if (a < b) return +1;
  if (a > b) return -1;
  return 0;
}
function step_axis(planets, axis) {
  for (let p of planets) {
    for (let o of planets) {
      if (p === o) continue;
      p.velocity[axis] += comp(p.position[axis], o.position[axis]);
    }
  }
  for (let p of planets) {
    p.position[axis] += p.velocity[axis];
  }
}

function coords(planets, axis) {
  return planets.map(p => p.position[axis]).join('-');
}

module.exports = function(input) {
  let planets = input.map(str => {
    const [ _, x, y, z] = str.match(/^<x=(-?\d+), y=(-?\d+), z=(-?\d+)>$/);
    return {
      position: {x:Number(x), y:Number(y), z:Number(z)},
      velocity: {x:0, y:0, z:0}
    }
  });

  let origin = {
    x: coords(planets, 'x'),
    y: coords(planets, 'y'),
    z: coords(planets, 'z'),
  }

  function has_zero_velocity(planets, axis) {
    return planets.every(p => p.velocity[axis] === 0);
  }

  let x_done = 0,
      y_done = 0,
      z_done = 0,
      i = 0;
  while(!x_done || !y_done || !z_done) {
    i++;
    // calculate the next step
    for (let p of planets) {
      for (let o of planets) {
        if (p === o) continue;
        p.velocity.x += comp(p.position.x, o.position.x);
        p.velocity.y += comp(p.position.y, o.position.y);
        p.velocity.z += comp(p.position.z, o.position.z);
      }
    }
    for (let p of planets) {
      p.position.x += p.velocity.x;
      p.position.y += p.velocity.y;
      p.position.z += p.velocity.z;
    }

    if (!x_done && coords(planets, 'x') === origin.x && has_zero_velocity(planets, 'x')) {
      x_done = i;
      console.log(`x-axis completes in ${i} steps`);
    }

    if (!y_done && coords(planets, 'y') === origin.y && has_zero_velocity(planets, 'y')) {
      y_done = i;
      console.log(`y-axis completes in ${i} steps`);
    }

    if (!z_done && coords(planets, 'z') === origin.z && has_zero_velocity(planets, 'z')) {
      z_done = i;
      console.log(`x-axis completes in ${i} steps`);
    }
  }

  console.log({x_done, y_done, z_done});

  console.log('LCM of all circuits:', lcm(lcm(x_done, y_done), z_done));

  // console.log("circuits", JSON.stringify(planets, null, '  '));
}

function lcm(x, y) {
 return Math.abs((x * y) / gcd(x, y));
}

function gcd(x, y) {
 x = Math.abs(x);
 y = Math.abs(y);
 while(y) {
   var t = y;
   y = x % y;
   x = t;
 }
 return x;
}
