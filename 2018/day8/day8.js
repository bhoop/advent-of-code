module.exports = input => {
  input = input[0].split(/\s+/g);
  let i = 0;
  let sum = 0;

  let read = () => {
    let numChildren = input[i++];
    let numMeta = input[i++];
    let children = [];
    let metaScore = 0;
    let childMetaScore = 0;
    for (let x = 0; x < numChildren; x++) {
      children[x] = read();
    }
    for (let x = 0; x < numMeta; x++) {
      let meta = parseInt(input[i++]);
      metaScore += meta;
      if (children[meta-1]) childMetaScore += children[meta-1];
    }
    sum += metaScore;

    return numChildren > 0 ? childMetaScore : metaScore;
  };

  let rootScore = read();

  console.log(`Metadata sum is ${sum}`);
  console.log(`Value of root node is ${rootScore}`);
}