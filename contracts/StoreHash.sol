
//0x4Ef0e1c84c937bc1cE35f9b63047881E41fa1076  contract address on wanchain testnet
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