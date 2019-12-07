function parse(circuit) {
  let x = 0, y = 0, steps=0;

  return circuit.split(',').reduce((arr, op) => {
    const dir = op[0];
    const len = Number(op.substring(1));

    for (let i = 0; i < len; i++) {
      steps++;
      if (dir === 'U') y++;
      else if (dir === 'R') x++;
      else if (dir === 'D') y--;
      else x--;
      if (!arr.has(`${x},${y}`)) arr.set(`${x},${y}`, steps);
    }
    return arr;
  }, new Map());
}

function intersection(mapA, mapB) {
  var _intersect = [];
  for (let [coord,stepsB] of mapB.entries()) {
      if (mapA.has(coord)) {
          _intersect.push([coord, (mapA.get(coord) + stepsB)]);
      }
  }
  return _intersect;
}

module.exports = function([circuit_a, circuit_b]) {

  // circuit_a = 'R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51';
  // circuit_b = 'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7';

  const intersections = intersection(parse(circuit_a), parse(circuit_b));//.map(c => Number(c.split(':')[1]));
  intersections.sort((a,b) => a[1] - b[1]);
  const closest = intersections[0];

  console.log(`Closest: ${closest[1]} (${closest[0]})`);
}
