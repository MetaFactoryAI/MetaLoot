import { deployments, ethers, getNamedAccounts } from 'hardhat';

async function main() {
  const { deployer, tokenOwner } = await getNamedAccounts();
  const amount = ethers.utils.parseEther('4200');
  await deployments.execute(
    'SimpleERC20',
    { from: deployer },
    'mint',
    deployer,
    amount,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
