import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { utils } from 'ethers';

const func: DeployFunction = async function ({
  deployments,
  getNamedAccounts,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy('MetaLoot', {
    from: deployer,
    log: true,
    args: ['ipfs://'],
    gasPrice: utils.parseUnits('150', 'gwei'),
    estimatedGasLimit: 3000000,
  });
};

export default func;
func.tags = ['MetaLoot'];
