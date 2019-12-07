function calc(mass) {
  let fuel = Math.max(Math.floor(mass / 3) - 2, 0);
  if (fuel > 0) fuel += calc(fuel);
  return fuel;
}

module.exports = function(input) {

  let sum = input.reduce((sum, mass) => {
    return sum + calc(mass);
  }, 0);
  console.log(sum);
}
