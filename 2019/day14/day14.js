

module.exports = function(input) {
  let ingredients = {}, stockpile = { ORE:1000000000000 }, produced = { ORE:0 };

  // parse ingredients into a data structure we can read from
  input.forEach(formula => {
    let [inputs, outputs] = formula.split(' => ');
    let output = parseIngredient(outputs);
    ingredients[output.id] = {
      qty: output.qty,
      components: inputs.split(', ').map(parseIngredient)
    };
    stockpile[output.id] = produced[output.id] = 0;
  });

  const make = (ingredient) => {
    if (ingredient === 'ORE') {
      throw 'out-of-stock';
      // stockpile.ORE++;
      // produced.ORE++;
      // return;
    }

    const { qty, components } = ingredients[ ingredient ];

    for (const c of components) {
      while ( stockpile[ c.id ] < c.qty ) make( c.id );
      stockpile[ c.id ] -= c.qty;
    }

    produced[ ingredient ] += qty;
    stockpile[ ingredient ] += qty;
  }

  const calc = (id) => {
    if (id === 'ORE') return 1;
    const o = ingredients[ id ].qty;
    return ingredients[ id ].components.reduce((p,v) => {
      return p + v.qty / o * calc( v.id );
    }, 0);
  }

  const orePerFuel = calc('FUEL');
  console.log(`1 FUEL TAKES ${calc('FUEL')} ORE`);
  const fuelPerTrillionOre = Math.floor(1000000000000 / orePerFuel);
  console.log(`1 TRILLION ORE PRODUCES ${fuelPerTrillionOre} FUEL`);

  // now that we have the ingredients, start from
  // make('FUEL');

  // console.log(1000000000000 - stockpile.ORE);

  // console.log(Object.keys(produced).map( id => {
  //   return `${id} PRODUCED=${produced[id]} LEFTOVER=${stockpile[id]}`;
  // }));
  // while (true) {
  //   try {
  //     make('FUEL');
  //     console.log(stockpile.ORE);
  //   } catch (err) {
  //     if (err !== 'out-of-stock') throw err;
  //     break;
  //   }
  // }

  // console.log(`1 FUEL TAKES ${produced.ORE} ORE (${stockpile.ORE} LEFTOVER)`);

  // console.log(`YOU CAN MAKE ${ Math.floor(1000000000000 / (produced.ORE - stockpile.ORE)) } FUEL WITH 1 TRILLION ORE`);
}

function parseIngredient(str) {
  let [qty, id] = str.split(' ');
  return {
    id,
    qty: Number(qty)
  };
}