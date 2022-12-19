const Web3 = require("web3");
require("dotenv").config();

const RockCoinABI = require("./build/contracts/RockCoin.json");
const RockCoinAddress = "0xe0C753D9d5Bad3b93BACCBeD5821b6d439B49f22"

const web3 = new Web3(process.env.PROVIDER);

const RockCoin = new web3.eth.Contract(RockCoinABI.abi, RockCoinAddress);

module.exports = RockCoin;