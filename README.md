# Wanchain + IPFS React dApp

[![](https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square)](http://ipn.io)
[![](https://img.shields.io/badge/project-IPFS-blue.svg?style=flat-square)](http://ipfs.io/)
[![](https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square)](http://webchat.freenode.net/?channels=%23ipfs)

<hr>
<a href="http://18.218.197.29:3006/">Click Here to View Live Demo</a>

<hr>


### Clone the Repository

`git clone https://github.com/wanchain/wanchain-ipfs.git`

`cd wanchain-ipfs`

`npm install`

`npm run start`

`Open http://localhost:3000/`

## Demo Video

<a href="https://d3vv6lp55qjaqc.cloudfront.net/items/3o1v0j1g293I0K3o3P0p/wanchain_ipfs.mp4?X-CloudApp-Visitor-Id=2750703">Click Here To Watch</a>
## The Wan Smart Contract
This very simple smart contract is used to store a single IPFS file hash that can be retrieved by calling the contract.

My deployed contract address (Wanchain Testnet) is <a href="http://18.188.125.96/address/0x4Ef0e1c84c937bc1cE35f9b63047881E41fa1076">0x4Ef0e1c84c937bc1cE35f9b63047881E41fa1076</a>

#### Contract Code
````js
//deployed using remix

contract Contract {
 string ipfsHash;

 function sendHash(string x) public {
   ipfsHash = x;
 }

 function getHash() public view returns (string x) {
   return ipfsHash;
 }
}

````

### 1. Deploy Your Smart Contract using Remix
Once you deploy your smart contract you will receive a contract address.

In <code>storehash.js</code> on line 5 update the contract address to your new contract address.

If you made any edits to the contract, you will also need to update the contract ABI inside <code>storehash.js</code>

## License

[![CC0](https://licensebuttons.net/p/zero/1.0/88x31.png)](https://creativecommons.org/publicdomain/zero/1.0/)

## Credits
This repo was originally cloned from https://github.com/mcchan1/eth-ipfs and modified




