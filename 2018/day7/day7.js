module.exports = input => {
  let steps = {};
  input = input.map(str => {
    let p = str.substr(5,1), s=str.substr(36,1);
    steps[s] = steps[p] = 1;
    return {s, p};
  });

  steps = Object.keys(steps);
  steps.sort();

  let temp = {};
  input.forEach(({s,p}) => {
    if (!temp[s]) temp[s] = [];
    temp[s].push(p);
  })
  let waitingOn = steps.map(s => ({letter:s, req:temp[s] || []}))


  // STAGE 1
  // let done = '';
  // while (done.length !== steps.length) {
  //   // find first alphabetical step with no prerequisites, remove it from waitingOn
  //   let next = waitingOn.find(x => x.req.length===0);
  //   waitingOn = waitingOn.filter(x => x !== next);
  //   // add the step to "done"
  //   done += next.letter;
  //   // update all other waitingOn records to remove the step from their lists
  //   waitingOn.forEach(r => r.req = r.req.filter(x => x !== next.letter))
  // }
  // console.log(done)

  // STAGE 2
  let result = '';
  let workers = ['', '', '', '', ''];
  let timeline = [{t:0, done:[]}];

  let schedule = (t, step) => {
    let i = 0
    while (i < timeline.length && timeline[i].t < t) i++;
    if (timeline[i] && timeline[i].t === t) timeline[i].done.push(step);
    else timeline.splice(i, 0, {t, done:[step]});
  }

  while (result.length !== steps.length) {
    let {t, done} = timeline.shift();
    // mark done things as done
    done.forEach(step => {
      workers[workers.indexOf(step)] = '';
      result += step;
      waitingOn.forEach(r => r.req = r.req.filter(x => x !== step));
    })
    console.log(`time=${t} (${result})`);
    // find things that are ready to work on
    let ready = waitingOn.filter(x => x.req.length === 0);
    console.log(`\t${ready.length} tasks ready to start`);
    // assign work to available workers
    workers.forEach((job, i) => {
      if (job !== '' || !ready.length) return;
      let next = ready.shift();
      waitingOn = waitingOn.filter(x => x !== next);
      workers[i] = next.letter;
      console.log(`\tschedule work on ${next.letter} (done at ${t + next.letter.charCodeAt(0) - 4})`)
      schedule(t + next.letter.charCodeAt(0) - 4, next.letter);
    })
    console.log(`\t${workers.filter(w => w==='').length} idle workers`);
    if (result.length === steps.length) console.log(`Completed in ${t} seconds`);
  }
}