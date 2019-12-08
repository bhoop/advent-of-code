const BLACK = '0';
const WHITE = '1';
const CLEAR = '2';
const COLORS = {
  [BLACK]: '\x1b[40m \x1b[0m',
  [WHITE]: '\x1b[47m \x1b[0m',
  [CLEAR]: '\x1b[46m \x1b[0m'
};

module.exports = function([input]) {
  const width = 25, height = 6;
  const layerSize = width * height;

  let img = new Array(layerSize);
  img.fill(CLEAR);

  input = input.split('');
  const layerCount = input.length / layerSize;

  for (let i = 0; i < layerCount; i++) {
    const layer = input.slice(i * layerSize, (i+1)*layerSize);
    for (let j = 0; j < layerSize; j++) {
      if (img[j] !== CLEAR || layer[j] === CLEAR) continue;
      img[j] = layer[j];
    }
  }

  for (let i = 0; i < height; i++) {
    console.log(img.slice(i * width, (i+1)*width).map(c => COLORS[c]).join(''));
  }
}
