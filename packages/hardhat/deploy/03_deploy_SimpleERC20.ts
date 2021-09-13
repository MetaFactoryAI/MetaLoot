import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { utils } from "ethers";

const func: DeployFunction = async function ({
  deployments,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { tokenOwner } = await getNamedAccounts();
  await deploy("SimpleERC20", {
    from: tokenOwner,
    log: true,
    args: [utils.parseEther("420")],
  });
};

export default func;
func.tags = ["SimpleERC20"];
