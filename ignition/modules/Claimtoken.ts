import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ClaimtokenModule = buildModule("ClaimtokenModule", (m) => {

  const claimtoken = m.contract("Claimtoken");

  return { claimtoken };
});

export default ClaimtokenModule;
