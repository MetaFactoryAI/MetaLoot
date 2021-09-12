import { ethers, deployments, getUnnamedAccounts } from "hardhat";
import chai from "chai";
import { Box } from "../typechain";
import { setupUsers } from "./utils";

const { expect } = chai;

const setup = deployments.createFixture(async () => {
  await deployments.fixture("Box");
  const contracts = {
    box: <Box>await ethers.getContract("Box"),
  };
  const users = await setupUsers(await getUnnamedAccounts(), contracts);
  return {
    ...contracts,
    users,
  };
});

describe("Box", function () {
  it("retrieve returns a value previously stored", async function () {
    const { box } = await setup();

    // Store a value
    await box.store(42);

    expect((await box.retrieve()).toString()).to.equal("42");
  });

  it("store emits an event", async function () {
    const { box } = await setup();

    await expect(box.store(42)).to.emit(box, "ValueChanged").withArgs(42);
  });

  it("should revert if non owner tries to set value", async function () {
    const { users } = await setup();

    await expect(users[0].box.store(42)).to.be.revertedWith(
      "caller is not the owner"
    );
  });
});
