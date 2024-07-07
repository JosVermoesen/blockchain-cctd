const ethers = require("ethers");

async function createBytes(args) {
  const name = args[0];
  const bytes32 = ethers.encodeBytes32String(name);
  const text = ethers.decodeBytes32String(bytes32);

  console.log("Bytes: ", bytes32);
  console.log("Text: ", text);
}
createBytes(process.argv.slice(2));
