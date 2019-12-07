module.exports = input => {
  input = input[0];

  let rx = /(aA|bB|cC|dD|eE|fF|gG|hH|iI|jJ|kK|lL|mM|nN|oO|pP|qQ|rR|sS|tT|uU|vV|wW|xX|yY|zZ|Aa|Bb|Cc|Dd|Ee|Ff|Gg|Hh|Ii|Jj|Kk|Ll|Mm|Nn|Oo|Pp|Qq|Rr|Ss|Tt|Uu|Vv|Ww|Xx|Yy|Zz)/g;
  let react = str => {
    let len = 0;
    while (str.length !== len) {
      len = str.length;
      str = str.replace(rx, '');
    }
    return str;
  }

  console.log(`Reacting original reduces to ${react(input).length} units`);

  let shortest = Infinity;
  console.log(`Original string is ${input.length} units`);
  for (let i = 65; i<=90; i++) {
    let o = input.replace(new RegExp(String.fromCharCode(i), "ig"), '');
    let str = react(o);
    if (str.length < shortest) shortest = str.length;
    console.log(`Removing ${String.fromCharCode(i)} (originally ${o.length} units) gives ${str.length} units`);
  }
  console.log(`The shortest strand (after removing components) is ${shortest} units`);
}