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

    const BAYC_HOLDER = "0xdefc10efb0e353a00f9727f87f3071a9bc1fb245";

    await helpers.impersonateAccount(BAYC_HOLDER);
    const impersonatedSigner = await ethers.getSigner(BAYC_HOLDER);


    const { rewardtoken } = await loadFixture(deployRewardtoken);

    const leafNodes = [ BAYC_HOLDER].map((addr) =>
      keccak256(ethers.solidityPacked(["address"],
        [impersonatedSigner.address]
      ))
    );

    const rootHash = "0x2a0e8a1f6c260c65474ff2784294bc81d7e3785de116bc107a747d9f4fef617d";

    const merkleProof = 
      [
        '0x6107ef0940e9ba75ba547085fd21e41418a87ec6dbbefe1a6cee37f7f2faa39a',
        '0x67a7f8ac6fb58a1d5fe8095b4d57078155c4ecfcce393fc3cfc85854f2dfef6e',
        '0x127694f0c1ec508348b145ca0aba2f12e3a9fb0028e1643109427417759bf606',
        '0x317e5039f1043da9dd8146ac10890d5c37f81150669c22dbf8d6e0d7e7a01f9f',
        '0x26d5630ff8278a81443f25083d3cc22fbf1a70e2e3e7f868eef0a933a7cc929f',
        '0x8b8637644f6c7effb1e6e862f9df89127357075fa00c0c0b8b1f8e1ce96d10a5',
        '0x0535565d13b653eb961290aa339fd444313ae45fee1aa5a8c9244615e227a604',
        '0x39fbe571993171e24963618b4bf692a54ce25c0239e35ab7e67f61ece43fa9c7',
        '0xec56b109b032306b183de990ebf39beb8094856d875ea6b8fce5a6d830449da6',
        '0x2024cb10e4a8810e3c95fc960edbaabf17e10ad8c095a48c0007e9a5a04b8525',
        '0xe7517a209dd1fb7aeb19e7a0e33d7c943f956aa6ebbe8ccde80283cfbe5b26c0',
        '0xb0292f111f6008ebbb84ec7c1b9740f1303ec7a03105ed4d57e99e4a58422fa1',
        '0x2da584fa9dfe7ff1dcd5b0dcc42c90906f2e7722e563fa18588055401da4f999'
      ]
    
    const CLAIMAIRDROP = await hre.ethers.getContractFactory("Claimtoken");
    const claimairdrop = await CLAIMAIRDROP.deploy(rewardtoken, rootHash);

    return { rewardtoken, owner,claimairdrop, rootHash, impersonatedSigner, merkleProof, leafNodes };
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
      // check if the merkle root is correct
      expect(await claimairdrop.merkleRoot()).to.equal(rootHash)
    })

    it("Should check if claim is successful", async () => {
      const {
        owner, 
        impersonatedSigner, 
        rewardtoken, 
        claimairdrop, 
        rootHash,
        leafNodes,
        merkleProof
       } = await loadFixture(deployClaimtoken);

      //  const IERC20 = await ethers.getContractAt("contracts/interfaces/IERC20.sol:IERC20");

      const tx = await owner.sendTransaction({
        to: impersonatedSigner.address,
        value: ethers.parseUnits("0.1", "ether"), // Send 0.1 ETH
      });

      tx.wait()

       const approveAmount = ethers.parseUnits("9000", 18);

       const LBT = await rewardtoken.getAddress()
       const LBT_CONTRACT = await ethers.getContractAt("/contracts/interfaces/IERC20.sol:IERC20", LBT);

       await LBT_CONTRACT.approve(await claimairdrop.getAddress(), approveAmount);

       
       expect(await claimairdrop.connect(impersonatedSigner).claimAirdrop(merkleProof))    
    })
  });

   
});