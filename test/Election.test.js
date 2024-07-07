const assert = require("assert");
const ganache = require("ganache");
const { Web3 } = require("web3");
const web3 = new Web3(ganache.provider());

const { abi, evm } = require("../bc-election/compile");

let election;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  election = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
    })
    .send({
      from: accounts[0],
      gas: "2000000",
    });
});
describe("Election Contract", () => {
  it("deploys a contract", () => {
    assert.ok(election.options.address);
  });

  it("only owner can initialize", async () => {
    let resultCreate = await election.methods
      .initCandidates([
        "0x4a6f6520426964656e0000000000000000000000000000000000000000000000", // "Joe Biden"
        "0x446f6e616c64205472756d700000000000000000000000000000000000000000", // "Donald Trump"
      ])
      .send({
        from: accounts[0],
        gas: "1000000",
      });
    console.log("resultCreate:", "\n", resultCreate);
  });
});
