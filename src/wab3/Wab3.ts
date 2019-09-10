import * as Web3 from "web3";
const Toadtract = require("./AlphaToad.json");

class Wab3 {
  wab3: any;
  constructor(officer) {
    if (officer === "geordi") {
      const { GEORDI, RPC_ENDPOINT } = process.env;
      const url = `https://${GEORDI}@${RPC_ENDPOINT}`;
      const provider = new Web3.providers.HttpProvider(url);
      const web3 = new Web3(provider);
      this.wab3 = web3;
    }
  }

  getToadtract = () => {
    const toadtract = new this.wab3.eth.Contract(
      Toadtract.abi,
      process.env.TOAD_ADDRESS
    );
    return toadtract;
  };
}

export default Wab3;
