

module.exports = function(input) {
  let ingredients = {}, stockpile = { ORE:0 }, produced = { ORE:0 };

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
      stockpile.ORE++;
      produced.ORE++;
      return;
    }

    const { qty, components } = ingredients[ ingredient ];

    for (const c of components) {
      while ( stockpile[ c.id ] < c.qty ) make( c.id );
      stockpile[ c.id ] -= c.qty;
    }

    produced[ ingredient ] += qty;
    stockpile[ ingredient ] += qty;
  }

  // now that we have the ingredients, start from
  make('FUEL');

  console.log(`1 FUEL TAKES ${produced.ORE} ORE`);
}

function parseIngredient(str) {
  let [qty, id] = str.split(' ');
  return {
    id,
    qty: Number(qty)
  };
}