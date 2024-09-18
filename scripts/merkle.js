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

    const leaf = keccak256(
      ether.solidityPacked(["address"], [address])
  )
    addresses.push(leaf);
  })
  .on("error", function (error) {
    console.log(error.message);
  })
  .on("end", function () {

    const merkleTree = new MerkleTree(addresses, keccak256, {sortPairs: true});

    const rootHash = merkleTree.getHexRoot();

    const targetEntry = {
      address: "0xdefc10efb0e353a00f9727f87f3071a9bc1fb245"
    }

    // const claimingAddress = leafNode[2];
    const leaf = keccak256(
      ether.solidityPacked(["address"],
         [targetEntry.address])
  );

   
    const hexProof = merkleTree.getHexProof(leaf);
    console.log(hexProof)
    console.log(merkleTree.verify(hexProof, leaf, rootHash))
    console.log(rootHash.toString("hex"))
  });