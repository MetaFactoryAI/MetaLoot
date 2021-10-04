import { deployments, ethers, getNamedAccounts } from 'hardhat';

async function main() {
  const { deployer } = await getNamedAccounts();
  console.log({ deployer });
  const Token = await deployments.get('SimpleERC20');
  const price = ethers.utils.parseEther('690');
  const mintTokenId = 1;
  const tokenURI = 'ipfs/QmNo5rYmdwBzFNhiEB1n5YcMjgBRGZ1qqSffPWgoWsv7bJ';
  const maxSupply = 50;
  // const tokenAddress = '0x32353A6C91143bfd6C7d363B546e62a9A2489A20';
  const tokenAddress = Token.address;
  console.log({ tokenAddress });
  // const deactivateRes = await deployments.execute(
  //   'MetaLoot',
  //   { from: deployer },
  //   'deactivate',
  // );
  // console.log({ deactivateRes });

  const activateRes = await deployments.execute(
    'MetaLoot',
    { from: deployer },
    'activate',
    tokenAddress,
    price,
    mintTokenId,
    tokenURI,
    maxSupply,
  );
  //
  // const activateRes = await deployments.execute(
  //   'MetaLoot',
  //   { from: deployer },
  //   'updateTokenURI',
  //   mintTokenId,
  //   tokenURI,
  // );
  console.log({ activateRes });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
