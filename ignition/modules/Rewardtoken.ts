import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const RewardtokenModule = buildModule("RewardtokenModule", (m) => {

  const rewardtoken = m.contract("Rewardtoken");

  return { rewardtoken };
});

export default RewardtokenModule;
