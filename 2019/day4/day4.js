const checkForDouble = /(.)\1+/g;

function checkForSequence(str) {
  for (let i = 1; i < str.length; i++) {
    if (Number(str[i]) < Number(str[i-1])) return false;
  }
  return true;
}

module.exports = function([input]) {
  const [min, max] = input.split('-');

  let count = 0;

  let password = min;

  while (Number(password) <= Number(max)) {
    if (/(\d)\1/g.test(password.replace(/(\d)\1{2,}/g, '-')) && checkForSequence(password)) {
      // console.log(`✔ ${password}`);
      count++;
    }

    password = (Number(password) + 1).toString();
  }

  console.log("Found", count);
}
