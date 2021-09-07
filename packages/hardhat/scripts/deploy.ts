import { Contract } from "ethers";
import { artifacts, ethers } from "hardhat";
import fs from "fs";

async function main() {
  // We get the contract to deploy
  const YourContract = await ethers.getContractFactory("Box");
  const contract = await YourContract.deploy();
  await contract.deployed();
  saveFrontendFiles(contract, "Box");
  console.log("YourContract deployed to:", contract.address);
}

// https://github.com/nomiclabs/hardhat-hackathon-boilerplate/blob/master/scripts/deploy.js
function saveFrontendFiles(contract: Contract, contractName: string) {
  const contractsDir = __dirname + "/../../frontend/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ [contractName]: contract.address }, undefined, 2)
  );

  const ContractArtifact = artifacts.readArtifactSync(contractName);

  fs.writeFileSync(
    contractsDir + `/${contractName}.json`,
    JSON.stringify(ContractArtifact, null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
