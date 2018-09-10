# Wanchain + IPFS

<img style="max-width:100%" src="http://gateway.ipfs.io/ipfs/QmQZf6HUMDgqKikRRH7SHnQFXTtkbYApth5eyydPVDGsEr">

### Clone the Repository

`git clone ...`

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

<img src="https://gateway.ipfs.io/ipfs/QmbQoUXYiLXEDsheDvS7B2mcwzVn4Ymsq3B5T4H6HwxRaY">


### Replacing The File
#### Upload File
<img style="max-width:600px" src="http://gateway.ipfs.io/ipfs/QmeNQf2yjdMM9NoXBtnMZJq9NSsjTZ6DM9z6aytkf2iXkP">
<br>

#### Call Smart Contract and get New Hash
<img style="max-width:600px" src="http://gateway.ipfs.io/ipfs/QmPQcxk6E7WYdWaPcVUw9GL7L5iaUDdamtn8Jdx2qkqyiv">






