module.exports = function(inputs) {
  // inputs = ['COM)A','A)B','B)C','C)D','D)X','X)SAN', 'C)E','E)F','F)G','G)H','H)YOU'];

  inputs = inputs.map(i => i.split(')'));
  
  let nodes = {
    COM: null
  }

  while (inputs.length > 0) {
    const n = inputs.shift();
    if (nodes.hasOwnProperty( n[0] )) {
      nodes[ n[1] ] = n[0];
    } else {
      inputs.push(n);
    }
  }

  const sanPath = [];
  let n = nodes.SAN;
  while ( n ) {
    sanPath.push( n );
    n = nodes[ n ];
  }
  sanPath.reverse();

  // console.log( sanPath.join(" → ") );

  n = nodes.YOU;
  let youPath = [];
  while (!sanPath.includes(n)) {
    youPath.push( nodes[n] );
    n = nodes[ n ];
  }

  // console.log(youPath.join(" → "));

  const path = youPath.concat(sanPath.slice(sanPath.indexOf(n)+1));

  // console.log(path.join(" → "));

  console.log('Trip Length:', path.length);

}
