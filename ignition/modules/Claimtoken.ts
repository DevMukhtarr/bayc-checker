import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const token = "";
const merkleRoot = ""

const ClaimtokenModule = buildModule("ClaimtokenModule", (m) => {

  const claimtoken = m.contract("Claimtoken", [token, merkleRoot]);

  return { claimtoken };
});

export default ClaimtokenModule;
