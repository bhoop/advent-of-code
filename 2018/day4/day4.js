module.exports = input => {
  input.sort((a, b) => a.substr(6, 11).localeCompare(b.substr(6, 11)));

  let Guards = {};
  let guardText = /Guard #(\d+) begins/;
  let i = 0;
  while (input[i]) {
    let [_, guard] = guardText.exec(input[i++]);
    if (!Guards[guard]) {
      Guards[guard] = {id:guard, asleep:0, log:new Array(60)};
      Guards[guard].log.fill(0);
    }

    while (input[i] && input[i].substr(19, 5) === 'falls') {
      let start = parseInt(input[i++].substr(15, 2), 10);
      let end = parseInt(input[i++].substr(15, 2), 10);
      Guards[guard].asleep += end - start;
      for (let t = start; t < end; t++) {
        Guards[guard].log[t]++;
      }
    }
  }

  Guards = Object.values(Guards);

  // Part 1
  let sleepiestGuard = Guards.reduce((p, v) => v.asleep > p.asleep ? v : p, Guards[0]);
  let when = {t:-1, a:0};
  sleepiestGuard.log.forEach((a, t) => {
    if (a > when.a) when = {t, a}
  });
  console.log(`Strategy 1: Guard #${sleepiestGuard.id} is asleep most in minute ${when.t} (${sleepiestGuard.id * when.t})`);

  // Part 2
  let scores = new Array(60);
  for (let i = 0; i < 60; i++) scores[i] = {minute:i, days:0, guard:0};
  Guards.forEach(guard => {
    guard.log.forEach((days, minute) => {
      if (scores[minute].days < days) Object.assign(scores[minute], {days, guard:guard.id});
    })
  });
  let r = scores.reduce((p, v) => v.days > p.days ? v : p, scores[0]);
  console.log(`Strategy 2: The most-slept-during minute was ${r.minute}, by guard #${r.guard} (${r.minute * r.guard})`);
}
