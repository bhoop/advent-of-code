const { produce } = require("immer");
const chalk = require("chalk");

const DEBUG = false;

const OP_ADD = 1;
const OP_MUL = 2;
const OP_SET = 3;
const OP_OUT = 4;
const OP_JIT = 5;
const OP_JIF = 6;
const OP_LT  = 7;
const OP_EQ  = 8;
const OP_RBASE = 9;
const OP_END = 99;

const PMODE_POSITION = 0;
const PMODE_IMMEDIATE = 1;
const PMODE_RELATIVE = 2;

const OP_PARAM_COUNT = {
  [OP_ADD]: 3,
  [OP_MUL]: 3,
  [OP_SET]: 1,
  [OP_OUT]: 1,
  [OP_JIT]: 2,
  [OP_JIF]: 2,
  [OP_LT]: 3,
  [OP_EQ]: 3,
  [OP_RBASE]: 1,
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

function exec(state) {
  const {program, i, inputs, rbase, output} = state;
  const [op, paramModes] = parseOp(program[i]);

  let $p = {};
  const getAddress = i => i < program.length ? program[i] : 0;
  const p = (x, write = false) => {
    const mode = paramModes[x-1];
    // relative mode
    if (mode === PMODE_RELATIVE) {
      if (DEBUG) console.log(`Get Via Relative Mode [i=${i+x}] [rbase=${rbase}] [addr=${getAddress(i + x)}] [*i=${rbase+getAddress(i+x)}] [*addr=${getAddress(rbase +getAddress(i+x))}]`);
      $p[x] = `{R[${rbase}]@${i+x}#${rbase+getAddress(i+x)}:${getAddress(rbase+getAddress(i+x))}}`;
      return write ? rbase + getAddress(i+x) : getAddress(rbase + getAddress(i + x));
    }
    // position mode (unless we're writing)
    if (mode === PMODE_POSITION && !write) {
      $p[x] = `{P@${i+x}#${getAddress(i+x)}:${getAddress(getAddress(i+x))}}`;
      return getAddress(getAddress(i+x));
    }

    // immediate mode (or write mode)
    $p[x] = `{${write?'W':'I'}@${i+x}:${getAddress(i+x)}}`;
    return getAddress(i + x);
  }


  if (DEBUG) console.log(`exec() i=${i} addr=${getAddress(i)} op=${op} modes=${paramModes} data=[${program.slice(i, i +paramModes.length+1).join(",")}]`);

  switch (op) {
    case OP_ADD: {
      const a = p(1), b = p(2), x = p(3, true);
      if (DEBUG) console.log(`ADD ${$p[1]} + ${$p[2]} = ${a+b} => #${x}`);
      state.program[x] = a + b;
      state.i += 4;
      break;
    }
    case OP_MUL: {
      const a = p(1), b = p(2), x = p(3, true);
      if (DEBUG) console.log(`MUL ${$p[1]} + ${$p[2]} = ${a*b} => #${x}`);
      state.program[x] = a * b;
      state.i += 4;
      break;
    }
    case OP_SET: {
      const x = p(1, true);
      const input = state.inputs.shift();
      if ( DEBUG ) console.log(`SET INPUT "${input}" INTO #${$p[1]}`);
      state.program[x] = input;
      state.i += 2;
      break;
    }
    case OP_OUT: {
      const x = p(1);
      if ( DEBUG ) console.log(`OUT ${$p[1]} "${x}"`);
      state.outputs.push(x);
      state.i += 2;
      break;
    }
    case OP_JIT: {
      const a = p(1), b = p(2);
      if ( DEBUG ) console.log(`JIT JUMP TO ${a === 0 ? (i + 3) : $p[2]} BECAUSE ${chalk.black.bgMagenta(`${$p[1]} === 0`)}`);
      state.i = a === 0 ? (i + 3) : b;
      break;
    }
    case OP_JIF: {
      const a = p(1), b = p(2);
      if ( DEBUG ) console.log(`JIF`);
      state.i = a !== 0 ? (i + 3) : b;
      break;
    }
    case OP_LT: {
      const a = p(1), b = p(2), c = p(3, true);
      if ( DEBUG ) console.log(`LT`);
      state.program[c] = a < b ? 1 : 0;
      state.i += 4;
      break;
    }
    case OP_EQ: {
      const a = p(1), b = p(2), c = p(3, true);
      if ( DEBUG ) console.log(`EQ SET ${$p[3]}=${a===b ? 1 : 0} ${chalk.black.bgMagenta(`${$p[1]} === ${$p[2]}`)}`);
      state.program[c] = a === b ? 1 : 0;
      state.i += 4;
      break;
    }
    case OP_RBASE: {
      const a = p(1);
      if ( DEBUG ) console.log(`RBASE += ${a} (${$p[1]})`);
      state.rbase += a;
      state.i += 2;
      break;
    }
    case OP_END: {
      if ( DEBUG ) console.log(`END`);
      state.i = false;
      break;
    }
    default: throw `UNKNOWN OP: ${op}`;
  }

}

function runProgram({program, inputs}) {
  let i = 0;
  let state = { program, i, inputs, rbase:0, outputs:[] };
  while (state.i !== false) {
    state = produce(state, next => exec(next));
  }
  return [state.program, state.outputs];
}

function diagnostic(program, systemId) {
  return runProgram({program, inputs:[systemId]})[1];
}

function parse(input) {
  return input.split(',').map(n => Number(n));
}

module.exports = { 
  parse,
  exec,
  runProgram,
  diagnostic
}