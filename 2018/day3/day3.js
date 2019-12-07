module.exports = input => {
  // Part 1
  // let test = /@ (\d+),(\d+): (\d+)x(\d+)/;
  // let map = {};
  // input.forEach(def => {
  //   let [_, x, y, w, h] = test.exec(def);
  //   x = +x;
  //   y = +y;
  //   w = +w;
  //   h = +h;
  //   for (let _x = 0; _x < w; _x++) {
  //     for (let _y = 0; _y < h; _y++) {
  //       let key = `${x+_x},${y+_y}`;
  //       if (!map[key]) map[key] = 0;
  //       map[key]++;
  //     }
  //   }
  // });
  // let shared = Object.values(map).filter(count => count >= 2).length;
  // console.log(`${shared} shared inches`);


  // Part 2
  let test = /^#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/;
  let map = {};
  let unique = {};
  input.forEach(def => {
    let [_, id, x, y, w, h] = test.exec(def);
    x = +x;
    y = +y;
    w = +w;
    h = +h;
    let isUnique = true;
    for (let _x = 0; _x < w; _x++) {
      for (let _y = 0; _y < h; _y++) {
        let key = `${x+_x},${y+_y}`;
        if (!map[key]) map[key] = id;
        else {
          unique[ map[key] ] = false;
          isUnique = false;
        }
      }
    }
    unique[id] = isUnique;
  });

  console.log(Object.entries(unique).filter(([key, val]) => val));

}