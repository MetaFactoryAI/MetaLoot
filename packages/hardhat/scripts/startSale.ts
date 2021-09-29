import { deployments, ethers, getNamedAccounts } from "hardhat";

async function main() {
  const { deployer } = await getNamedAccounts();
  console.log({ deployer });
  const Token = await deployments.get('SimpleERC20');
  const price = ethers.utils.parseEther("42");
  const mintTokenId = 1;
  const tokenURI = "QmPqA39Mpzhx6PGQ7CvMYLP6SMQJKfNwTFWwNoigVBDWgX";
  const maxSupply = 5;
  const tokenAddress = Token.address;
  console.log({tokenAddress});

  const res = await deployments.execute('MetaLoot', {from: deployer}, 'activate', tokenAddress, price, mintTokenId, tokenURI, maxSupply)
  console.log(res );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
