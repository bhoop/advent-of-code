module.exports = input => {
  let result = /(\d+) players; last marble is worth (\d+) points/.exec(input[0]);
  let numPlayers = +result[1];
  let numMarbles = +result[2];

  numMarbles *= 100;

  let players = new Array(numPlayers);
  players.fill(0);

  let marble = {prev:null, next:null, value:0};
  marble.prev = marble.next = marble;
  let next = 1;

  while (next <= numMarbles) {
    // special case: marble is multiple of 23
    if (next % 23 === 0) {
      players[0] += next;
      let r = marble.prev.prev.prev.prev.prev.prev;
      let l = r.prev.prev;
      players[0] += r.prev.value;
      l.next = r;
      r.prev = l;
      marble = r;
    }
    // standard turn
    else {
      let l = marble.next, r = l.next;
      marble = {prev:l, next:r, value:next};
      l.next = marble;
      r.prev = marble;
    }
    // next player
    next++;
    players.push(players.shift());
  }


  console.log(`Winning score is ${Math.max.apply(null, players)}`);
}