module.exports = input => {
  let num2 = 0;
  let num3 = 0;
  input.forEach(id => {
    let map = {};
    id.split('').forEach(letter => {
      if (!map[letter]) map[letter] = 1;
      else map[letter]++;
    })
    let unique = [...new Set(Object.values(map))]; 
    unique.forEach(count => {
      if (count === 2) num2++;
      if (count === 3) num3++;
    });
  });
  console.log(`checksum=${num2 * num3}`);

  let ids = input;
  for (let i=2; i <= input[0].length; i++) {
    ids = ids.filter(id => input.some(sib => {
      if (sib === id) return false;
      let diff = 0;
      for(let j=0; j<=i; j++) {
        if (id[j] !== sib[j]) diff++;
        if (diff > 1) return false;
      }
      return true;
    }))
    console.log(`${ids.length} have similar first ${i} letters`);
  }

  let res = '';
  for (let i=0; i<ids[0].length; i++) {
    if (ids[0][i] === ids[1][i]) res += ids[0][i];
  }
  console.log('result: ' + res);
}