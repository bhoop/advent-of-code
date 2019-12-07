module.exports = function(input) {
  let m;
  let freq = 0;
  let log = {0:true};
  let i = 0;
  let found = false;
  let len = input.length;
  
  while (true) {
    if (i%len === 0) console.log(`start loop ${parseInt(i / len)} (freq=${freq})`);
    freq += parseInt(input[i % len]);
    if (log[freq]) {
      console.log('found', freq);
      break;
    }
    log[freq] = true;
    i++;
  }
}