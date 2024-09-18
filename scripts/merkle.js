const { parse } = require("csv-parse");
const keccak256 = require('keccak256');
const { MerkleTree } = require("merkletreejs")
const ether = require("ethers");

const fs = require("fs");

const path = "scripts/bayc-holders.csv";
const addresses = [];

fs.createReadStream(path)
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
    const address  = row[0].trim();

    const quantityFromCSV = row[1].trim();
    const quantity = ether.parseUnits(quantityFromCSV, 18);

    const PendingBalanceUpdate = row[2].trim()

    const leaf = keccak256(
      ether.solidityPacked(["address", "uint256"], [address, quantity, PendingBalanceUpdate])
  )
    addresses.push(leaf);
  })
  .on("error", function (error) {
    console.log(error.message);
  })
  .on("end", function () {

    const merkleTree = new MerkleTree(addresses, keccak256, {sortPairs: true});

    const rootHash = merkleTree.getHexRoot();
    console.log("Root hash:", rootHash);

//     const targetEntry = {
//       address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
//       amount: ether.parseUnits("110", 18)
//   }

    // const claimingAddress = leafNode[2];
//     const leaf = keccak256(
//       ether.solidityPacked(["address", "uint256"], [targetEntry.address, targetEntry.amount])
//   );

   
//     const hexProof = merkleTree.getHexProof(leaf);
//     console.log(hexProof)
//     console.log(merkleTree.verify(hexProof, leaf, rootHash))
//     console.log(rootHash.toString("hex"))
  });