fs = require('fs');

let min = {x:+Infinity, y:+Infinity};
let max = {x:-Infinity, y:-Infinity};
let dim = {x:Infinity, y:Infinity};
let map = [];
let coords = [];

module.exports = input => {
  // setup
  input.forEach((line, i) => {
    let [x, y] = line.split(', ');
    x = +x;
    y = +y;
    min = {
      x: Math.min(min.x, x),
      y: Math.min(min.y, y)
    };
    max = {
      x: Math.max(max.x, x),
      y: Math.max(max.y, y)
    };
    coords[i] = {i, x, y, size:0, claims:[]};
  });

  let count = 0;
  let cutoff = 10000;
  
  dim.x = min.x + max.x;
  dim.y = min.y + max.y;

  for (let x = 0; x <= dim.x; x++) {
    for (let y = 0; y <= dim.y; y++) {
      let score = 0;
      for (let i in coords) {
        let c = coords[i];
        score += Math.abs(x - c.x) + Math.abs(y - c.y);
        if (score >= cutoff) break;
      }
      if (score < cutoff) {
        count++;
      }
    }
  }

  console.log(`count=${count}`);
  return;

  // setup map
  let map = new Array((dim.x+1)*(dim.y+1));

  // find closest distance of all points
  for (let x = 0; x <= dim.x; x++) {
    for (let y = 0; y <= dim.y; y++) {
      let p = {x, y, distance:Infinity, owner:false, isEdge:x===0||x===dim.x||y===0||y===dim.y};
      coords.forEach(c => {
        let d = Math.abs(x - c.x) + Math.abs(y - c.y);
        if (d <= p.distance && p.owner) {
          p.owner.claims = p.owner.claims.filter(x => x !== p);
        }
        if (d < p.distance) {
          Object.assign(p, {distance:d, owner:c});
          c.claims.push(p);
        }
        else if (d === p.distance) p.owner = false;
      });
      map[x + y*(dim.x+1)] = p;
    }
  }

  coords = coords.filter(c => !c.claims.some(p => p.isEdge));
  coords.sort((a, b) => b.claims.length - a.claims.length);
  console.log(`${String.fromCharCode(coords[0].i+65)} has ${coords[0].claims.length} points`);



  // DRAW THE MAP
  output = '';
  console.log(dim);
  for (let i = 0; i < map.length; i++) {
    if (i && i%(dim.x+1) === 0) output += "\n";

    let n = map[i];
    if (!n) output += '▒';
    else if (n.owner === false) output += '.';
    else output += String.fromCharCode(n.owner.i + (n.distance===0 ? 65 : 97));
  }
  fs.writeFileSync('./day6.output', output);




  // console.log(map);


  // console.log(`dim=(${dim.x},${dim.y})`);

  // // claim origins
  // coords.forEach(c => c.claims.push(claim(c.x, c.y, c, 0)));

  // console.log(coords);

  // while (true) {
  //   stillWorking = false;
  //   coords.forEach(c => {
  //     claims = [];
  //     c.claims.forEach(p => {
  //       // if we're still the owner of the claim...
  //       if (p.owner === c) {
  //         // add it to our territory
  //         if (p.isEdge) c.size === Infinity;
  //         else if (c.size !== Infinity) c.size++;
  //         // claim the points around it
  //         claims.push(
  //           claim(p.x-1, p.y, c, p.distance+1),
  //           claim(p.x, p.y+1, c, p.distance+1),
  //           claim(p.x+1, p.y, c, p.distance+1),
  //           claim(p.x, p.y-1, c, p.distance+1)
  //         );
  //       }
  //     });
  //     c.claims = claims.filter(v => v);
  //     if (c.claims.length > 0) stillWorking = true;
  //   });
  //   if (!stillWorking) break;
  // }

  
  // // find closest distance of all points
  // for (let x = 0; x <= dim.x; x++) {
  //   for (let y = 0; y <= dim.y; y++) {
  //     let closest = {distance:Infinity, owner:false};
  //     coords.forEach(c => {
  //       let d = Math.abs(x - c.x) + Math.abs(y - c.y);
  //       if (d < closest.distance) Object.assign(closest, {distance:d, owner:c});
  //       else if (d === closest.distance) closest.owner = false;
  //     });
  //     matrix[`${x}.${y}`] = closest;
  //   }
  // }

  // // eliminate stations that are on the edge
  // let banned = {};
  // let o;
  // for (let x = 0; x <= dim.x; x++) {
  //   if (x === 0 || x === dim.x) {
  //     for (let y = 0; y < dim.y; y++) {
  //       o = matrix[`${x}.${y}`];
  //       if (o.owner) banned[o.owner.i] = true;
  //     }
  //   } else {
  //     o = matrix[`${x}.0`];
  //     if (o.owner) banned[o.owner.i] = true;
  //     o = matrix[`${x}.${dim.y}`];
  //     if (o.owner) banned[o.owner.i] = true;
  //   }
  // }
  // console.log(banned);

  // coords.filter(c => !banned[c.i]).forEach(c => {
  //   let d = 0;
  //   let size = 0;
  //   while (true) {
  //     let found = false;
  //     for (x = c.x - d; x <= c.x + d; x++) {
  //       for (y = c.y - d; y <= c.y + d; y++) {
  //         if (matrix[`${x}.${y}`].owner === c) {
  //           found = true;
  //           size ++;
  //         }
  //       }
  //     }
  //     d++;
  //     if (!found) break;
  //   }
  //   console.log(`Station ${c.i} has a size of ${size}`);
  // });  












  // let d = {x:Math.ceil(max.x-min.x/2), y:Math.ceil(max.y-min.y/2)};
  // min.x -= d.x;
  // max.x += d.x;
  // min.y -= d.y;
  // max.y += d.y;

  // while(true) {
  //   let edgesUpdated = false;
  //   for (let id in coords) {
  //     c = coords[id];
  //     let edges = [];
  //     c.edges.forEach(p => {
  //       // try to add points around each point
  //       for (let x = p.x-1; x <= p.x+1; x++) {
  //         for (let y = p.y-1; y <= p.y+1; y++) {
  //           // if this coordinate is out-of-bounds, skip it and assume that the station has infinite size
  //           if (x < min.x || x > max.x || y < min.y || y > max.y) {
  //             continue;
  //           } 
  //           let key = `${x}.${y}`;
  //           let r = matrix[key];
  //           // spot is not claimed: claim for this station
  //           if (!r) {
  //             edges.push({x, y, d:p.d+1});
  //             edgesUpdated = true;
  //             matrix[key] = {id, distance:p.d+1};
  //           }
  //           // spot is already claimed by this station
  //           else if (r.id === c.id) {
  //             // don't do anything
  //           }
  //           else {
  //             // If this station is at least as close as the claiming station, then remove it from the claiming station
  //             if (r.distance >= p.d+1 && r.id !== 'TIE') {
  //               coords[r.id].edges = coords[r.id].edges.filter(p => p.x !== x || p.y !== y);
  //             }
  //             // If this station is closer than the claiming station, then take control of it
  //             if (r.distance > p.d+1) {
  //               edges.push({x, y, d:p.d+1});
  //               edgesUpdated = true;
  //               matrix[key] = {id, distance:p.d+1};
  //             }
  //             // If the station is just as close as the claiming station, make it a tie
  //             else if (r.distance === p.d+1) {
  //               matrix[key].id = 'TIE';
  //             }
  //           }
  //         }
  //       }
  //       // add this edge as a point
  //       c.points.push(p);
  //       c.edges = edges;
  //     });
  //   }
  //   if (!edgesUpdated) break;
  // }
  // console.log(`There are ${Object.values(coords).length} stations`);

  // // remove any stations that touch the edge
  // let stations = Object.values(coords).filter(s => {
  //   return !s.points.some(p => p.x === min.x || p.y === min.y || p.x === max.x || p.y === max.y)
  // })
  // stations.sort((a, b) => b.points.length - a.points.length);
  // console.log(`There are ${stations.length} stations with finite bounds`);
  // console.log(`The biggest station has ${stations[0].points.length} points`);

  // let map = new Array(100);
  // map.fill('#');

  // for (let i = 0; i < 10; i++) {
  //   for (let j = 0; j < 10; j++) {
  //     let p = matrix[`${i}.${j}`];
  //     if (p.id === 'TIE') map[i*10 + j] = '.';
  //   }
  // }
  // input.forEach((line, i) => {
  //   let [x, y] = line.split(', ');
  //   map[x*10 + (+y)] = String.fromCharCode(i + 65);
  // });

  // for (let i = 0; i < 10; i++) {
  //   console.log(map.slice(i*10, i*10+10).join(''));
  // }
}

function normalize(x, y) {
  return x + y * (dim.x + 1);
}

function claim(x, y, owner, distance) {
  console.log(`claim (${x}, ${y}) for ${String.fromCharCode(owner.i+65)} (i=${x+y*dim.y})`);
  // if point is out-of-bounds, skip it
  if (x < 0 || x > dim.x || y < 0 || y > dim.y) {
    return false;
  }

  let i = x + y * (dim.x + 1);
  let c = map[i];
  if (!c) {
    // point is empty, claim it
    map[i] = {x, y, owner, distance, isEdge:x===0 || y===0 || x===dim.x || y===dim.y};
    return map[i];
  }
  // point is already claimed by owner, don't try to claim again
  if (c.owner === owner) {
    return false;
  }
  // point is closer to current owner, skip
  if (c.distance < distance) {
    return false;
  }
  // point is closer to new owner, override existing claim
  if (c.distance > distance) {
    Object.assign(c, {owner, distance});
    return c;
  }
  // point is equally close to both, mark as tie
  else if (c.distance === distance) {
    c.owner = false;
    return false;
  }
}
