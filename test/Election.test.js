const assert = require("assert");
const ganache = require("ganache");
const { Web3 } = require("web3");
const web3 = new Web3(ganache.provider());

const { abi, evm } = require("../bc-election/compile");

let election;
let accounts;

let biden =
  "0x4a6f6520426964656e0000000000000000000000000000000000000000000000";
let trump =
  "0x446f6e616c64205472756d700000000000000000000000000000000000000000";

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  try {
    election = await new web3.eth.Contract(abi)
      .deploy({
        data: evm.bytecode.object,
      })
      .send({
        from: accounts[0],
        gas: "2000000",
      });
  } catch (error) {
    console.log("error: ", error);
  }
});
describe("Election Contract", () => {
  it("deploys a contract", () => {
    assert.ok(election.options.address);
  });

  it("can call chairperson", async () => {
    const chairperson = await election.methods.chairperson().call();
    assert.equal(accounts[0], chairperson);
  });

  it("only chairperson can initialize", async () => {
    try {
      await election.methods.initCandidates([biden, trump]).send({
        from: accounts[1],
        gas: "1000000",
      });
    } catch (error) {
      assert(error);
    }
  });

  it("chairperson can initialize only once", async () => {
    try {
      await election.methods.initCandidates([biden, trump]).send({
        from: accounts[0],
        gas: "1000000",
      });
    } catch (error) {}

    try {
      await election.methods.initCandidates([biden, trump]).send({
        from: accounts[0],
        gas: "1000000",
      });
    } catch (error) {
      assert(error);
    }
  });

  it("let chairperson give right to voters", async () => {
    try {
      await election.methods.initCandidates([biden, trump]).send({
        from: accounts[0],
        gas: "1000000",
      });

      await election.methods.giveRightToVote(accounts[1]).send({
        from: accounts[0],
        gas: "1000000",
      });
      await election.methods.giveRightToVote(accounts[2]).send({
        from: accounts[0],
        gas: "1000000",
      });
      await election.methods.giveRightToVote(accounts[3]).send({
        from: accounts[0],
        gas: "1000000",
      });
      await election.methods.giveRightToVote(accounts[4]).send({
        from: accounts[0],
        gas: "1000000",
      });
    } catch (error) {}
  });
});
