const DEBUG = false;

const OP_ADD = 1;
const OP_MUL = 2;
const OP_SET = 3;
const OP_OUT = 4;
const OP_JIT = 5;
const OP_JIF = 6;
const OP_LT  = 7;
const OP_EQ  = 8;
const OP_END = 99;

const PMODE_POSITION = 0;
const PMODE_IMMEDIATE = 1;

const OP_PARAM_COUNT = {
  [OP_ADD]: 3,
  [OP_MUL]: 3,
  [OP_SET]: 1,
  [OP_OUT]: 1,
  [OP_JIT]: 2,
  [OP_JIF]: 2,
  [OP_LT]: 3,
  [OP_EQ]: 3,
  [OP_END]: 0
};

function parseOp(addr) {
  addr = `${addr}`;
  const op = parseInt(addr.substring(addr.length-2), 10);
  let modes = `00000000000000000000${addr.substr(0, addr.length-2)}`.split('');
  modes.reverse();
  modes = modes.slice(0, OP_PARAM_COUNT[op]).map(n => Number(n));

  return [op, modes];
}

function exec({program, i, inputs}) {
  const [op, paramModes] = parseOp(program[i]);

  let $p = {};
  const p = (x, write = false) => {
    if (write || paramModes[x-1] === PMODE_IMMEDIATE) {
      $p[x] = `{${write?'W':'I'}@${i+x}:${program[i+x]}}`;
      return program[i + x];
    }
    else {
      $p[x] = `{P@${i+x}#${program[i+x]}:${program[program[i+x]]}}`;
      return program[program[i + x]];
    }
  }


  if (DEBUG) console.log(`exec() i=${i} addr=${program[i]} op=${op} modes=${paramModes}`);

  switch (op) {
    case OP_ADD: {
      const a = p(1), b = p(2), x = p(3, true);
      program = [...program];
      program[x] = a + b;
      if (DEBUG) console.log(`ADD ${$p[1]} + ${$p[2]} = ${a+b} => #${x}`);
      return [program, i + 4, inputs];
    }
    case OP_MUL: {
      const a = p(1), b = p(2), x = p(3, true);
      program = [...program];
      program[x] = a * b;
      if (DEBUG) console.log(`MUL ${$p[1]} + ${$p[2]} = ${a*b} => #${x}`);
      return [program, i + 4, inputs];
    }
    case OP_SET: {
      const x = p(1, true);
      const input = inputs[0];
      inputs = inputs.slice(1);
      program = [...program];
      program[x] = input;
      if ( DEBUG ) console.log(`SET INPUT "${input}" INTO #${x}`);
      return [program, i + 2, inputs];
    }
    case OP_OUT: {
      const x = p(1);
      if ( DEBUG ) console.log(`OUT ${$p[1]} "${x}"`);
      return [ program, i + 2, inputs, x ];
    }
    case OP_JIT: {
      const a = p(1), b = p(2);
      if ( DEBUG ) console.log(`JIT`);
      return [program, (a===0 ? (i + 3) : b), inputs ];
    }
    case OP_JIF: {
      const a = p(1), b = p(2);
      if ( DEBUG ) console.log(`JIF`);
      return [program, (a!==0 ? (i + 3) : b), inputs ];
    }
    case OP_LT: {
      const a = p(1), b = p(2), c = p(3, true);
      if ( DEBUG ) console.log(`LT`);
      program = [...program];
      program[c] = a < b ? 1 : 0;
      return [ program, i + 4, inputs];
    }
    case OP_EQ: {
      const a = p(1), b = p(2), c = p(3, true);
      if ( DEBUG ) console.log(`EQ`);
      program = [...program];
      program[c] = a === b ? 1 : 0;
      return [ program, i + 4, inputs];
    }
    case OP_END: {
      if ( DEBUG ) console.log(`END`);
      return [ program, false, inputs ];
    }
    default: throw `UNKNOWN OP: ${op}`;
  }

}

function runProgram({program, inputs}) {
  let i = 0;
  let outputs = [];
  let output = '';
  while (i !== false) {
    // console.log('RESULTS:', exec({program, i, inputs}));
    [program, i, inputs, output] = exec({program, i, inputs});
    if (output !== undefined) outputs.push(output);
  }
  return [program, outputs];
}

function diagnostic(program, systemId) {
  return runProgram({program, inputs:[systemId]})[1];
}

module.exports = { 
  exec,
  runProgram,
  diagnostic
}