const assert = require("assert");
const ganache = require("ganache");
const { Web3, eth } = require("web3");
const ethers = require("ethers");
const web3 = new Web3(ganache.provider());

const { abi, evm } = require("../bc-medical/compile");

let medicalRecords;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  try {
    medicalRecords = await new web3.eth.Contract(abi)
      .deploy({
        data: evm.bytecode.object,
      })
      .send({
        from: accounts[0],
        gas: "1500000",
      });
  } catch (error) {
    console.log("error: ", error);
  }
});
describe("Election Contract", () => {
  it("deploys a contract", () => {
    assert.ok(medicalRecords.options.address);
  });
});
