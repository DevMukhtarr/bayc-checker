import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");
import { ethers } from "hardhat";
import keccak256 from "keccak256";
  import { MerkleTree } from 'merkletreejs';

describe("AirdropDeploymentAndReward", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.

  async function deployRewardtoken() {
    // Contracts are deployed using the first signer/account by default
    const [owner, account2] = await hre.ethers.getSigners();

    const REWARDTOKEN = await hre.ethers.getContractFactory("Rewardtoken");
    const rewardtoken = await REWARDTOKEN.deploy();

    return { rewardtoken, owner }
  }

  async function deployClaimtoken() {
    // Contracts are deployed using the first signer/account by default
    const [owner, account2] = await hre.ethers.getSigners();

    const BAYC_HOLDER = "0xf395767ae0e947504651a33ac2899520c551955d";
    const BAYC_HOLDER2 = "0x29469395eaf6f95920e59f858042f0e28d98a20b";

    await helpers.impersonateAccount(BAYC_HOLDER);
    const impersonatedSigner = await ethers.getSigner(BAYC_HOLDER);
    await helpers.impersonateAccount(BAYC_HOLDER2);
    const impersonatedSigner2 = await ethers.getSigner(BAYC_HOLDER2);


    const { rewardtoken } = await loadFixture(deployRewardtoken);

    const leafNodes = [ impersonatedSigner,impersonatedSigner2 ].map((addr) =>
      keccak256(ethers.solidityPacked(["address", "uint256", "string"],
        [impersonatedSigner.address, ethers.parseUnits("203", 18), "No"]
      ))
    );

    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    const rootHash = merkleTree.getHexRoot();
    
    const CLAIMAIRDROP = await hre.ethers.getContractFactory("Claimtoken");
    const claimairdrop = await CLAIMAIRDROP.deploy(rewardtoken, rootHash);

    return { rewardtoken, owner, merkleTree,claimairdrop, rootHash, impersonatedSigner, impersonatedSigner2 };
  }

  describe("Deployment", function () {
    it("Should check if reward token owner is set successfully", async () => {
      const { owner, rewardtoken} = await loadFixture(deployRewardtoken);

      expect(await rewardtoken.owner()).to.equal(owner)
    })

    it("Should check if Claimtoken gets merkle root properly and uses rewardtoken address", async () => {
      const {rootHash, owner, rewardtoken, claimairdrop} = await loadFixture(deployClaimtoken)

      // check if the address in the contract matches the deployed reward token addres
      expect(await claimairdrop.tokenAddress()).to.equal(rewardtoken)
      console.log(rootHash)
      // check if the merkle root is correct
      expect(await claimairdrop.merkleRoot()).to.equal(rootHash)
    })

    it("Should check if claim is successful", async () => {
      const {
        owner, 
        impersonatedSigner, 
        impersonatedSigner2, 
        rewardtoken, 
        merkleTree,
        claimairdrop, 
       } = await loadFixture(deployClaimtoken);

       const transferAmount = ethers.parseUnits("5383", 18);

      //  await rewardtoken.transfer(merkleAirdrop, transferAmount);

    })
  });

   
});