module.exports = function([input]) {
  const { diagnostic } = require('../computer');

  let arr = input.split(',').map(n => Number(n));

  const outputs = diagnostic(arr, 5);

  console.log(outputs);
}
