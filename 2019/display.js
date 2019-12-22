function Display() {
  this.width = 0;
  this.height = 0;
  this.values = {};
}

Display.prototype.set = function(x, y, value) {
  if (x >= this.width) this.width = x + 1;
  if (y >= this.height) this.height = y + 1;
  this.values[`${x},${y}`] = value;
}

Display.prototype.render = function(sprites) {
  let str = '';
  for (r = 0; r < this.height; r++) {
    for (c = 0; c < this.width; c++) {
      str += sprites[ this.values[`${c},${r}`] ];
    }
    str += '\n';
  }
  console.log(`\n${str}`);
}

module.exports = Display;