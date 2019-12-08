const https = require('https');
const fs = require('fs');


let op = process.argv[2];
let DAY = process.argv[3];
const YEAR = process.argv[4] || (new Date()).getFullYear();
const DIR = `./${YEAR}/day${DAY}`;
const INPUT = `${DIR}/day${DAY}.input`;
const SRC = `${DIR}/day${DAY}.js`;


if (DAY === "") {
  console.log('Specify a day');
} else {
  switch (op) {
    case 'start':
      console.log(`setup day ${DAY} (${YEAR})`);
      fs.mkdirSync(DIR, { recursive:true });

      if (!fs.existsSync(INPUT)) fs.writeFileSync(INPUT, '');
      if (!fs.existsSync(SRC)) {
        fs.writeFileSync(SRC, `\n\nmodule.exports = function(input) {\n  console.log('Answer:', '???');\n}\n`);
      }

      console.log(`Done! Use:\n$ npm run day ${DAY}\n(OR)\n$ npm run day ${DAY} ${YEAR}`);
      
      break;
    default:
      let input = fs.readFileSync(`${DIR}/day${DAY}.input`, 'utf8');
      require(`${DIR}/day${DAY}.js`)(input.split(/[\r\n]+/g));
  }
}
