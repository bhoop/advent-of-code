module.exports = function([input]) {
  const { exec } = require('../computer');

  let arr = input.split(',').map(n => Number(n));

  for (let a = 0; a <= 99; a++) {
    for (let b = 0; b <= 99; b++) {
      let i = 0;
      let test = [...arr];
      test[1] = a;
      test[2] = b;
      while (i !== false && test[0] < 19690720) [test, i] = exec(i, test);
      if (test[0] === 19690720) {
        return console.log(`FOUND a=${a} b=${b} [${a * 100 + b}]`);
      }
    }
  }

  console.log("NOT FOUND");
}
