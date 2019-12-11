

module.exports = function(input) {
  const width = input[0].length, height = input.length;

  let asteroids = [];
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (input[y][x] === '#') asteroids.push([Number(x), Number(y)]);
    }
  }

  // let best = [null, 0];
  // asteroids.forEach(a => {
  //   // given A, find how many other asteroids are in LOS
  //   const count = asteroids.filter(c => {
  //     // ignore the same asteroid
  //     if (a === c) return false;
  //     // check to see if any other asteroids are directly between A and C
  //     const blocked = asteroids.some(b => {
  //       if (b === a || b === c) return false;
  //       return blocks(a, b, c);
  //     });
  //     return !blocked;
  //   }).length;
  //   if (count > best[1]) best = [a, count];
  // });
  // console.log(`Asteroid (${best[0].join(',')}) has LOS to ${best[1]} other asteroids`);

  // Asteroid (20, 21) has best LOS

  // PART 2
  const best = [20, 21];
  // calc angle and distance for each other asteroid
  let targets = asteroids.filter(a => a.join(',')!=='20,21').map(t => {
    const my = t[1] - best[1],
          mx = t[0] - best[0],
          d  = mx * mx + my * my;
    return {
      t,
      r: Math.atan2(my, mx) * 180 / Math.PI + ((t[1] < best[1] && t[0] < best[0]) ? 450 : 90),
      d,
      o: 1
    }
  });
  
  targets.sort((a,b) => a.r - b.r || a.d - b.d);

  for (let i = 1; i < targets.length; i++) {
    if (targets[i-1].r === targets[i].r) targets[i].o = targets[i-1].o + 1;
  }

  targets.sort((a,b) => a.o - b.o || a.r - b.r || a.d - b.d);
  
  // targets = Object.values(targets.reduce((map, n) => {
  //   if (!map.has(n.r)) map[n.r] = [];
  //   map[n.r].push(n);
  //   return map;
  // }, new Map()));

  const chosen = targets[199];

  console.log(chosen.t[0] * 100 + chosen.t[1]);

  


  // console.log('Answer:', '???');
}

function distance(a, b) {
  return (a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]);
}

// https://stackoverflow.com/a/11908158/4996362
function blocks(a, b, c) {
  const bax = b[0] - a[0],
        bay = b[1] - a[1],
        cax = c[0] - a[0],
        cay = c[1] - a[1],
        cross = bax * cay - bay * cax;

  if (cross !== 0) return false;

  if (Math.abs(cax) >= Math.abs(cay))
    return cax > 0 ? a[0] <= b[0] && b[0] <= c[0] : c[0] <= b[0] && b[0] <= a[0]
  else
    return cay > 0 ? a[1] <= b[1] && b[1] <= c[1] : c[1] <= b[1] && b[1] <= a[1];
}
