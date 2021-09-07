import { ethers, waffle } from "hardhat";
import chai from "chai";
import { Box__factory, Box } from "../typechain";

const { deployContract } = waffle;
const { expect } = chai;

describe("Box", function () {
  let box: Box;

  beforeEach(async function () {
    const [deployer] = await ethers.getSigners();

    const counterFactory = (await ethers.getContractFactory(
      "Box",
      deployer
    )) as Box__factory;
    box = await counterFactory.deploy();
    await box.deployed();

    expect(box.address).to.properAddress;
  });

  it("retrieve returns a value previously stored", async function () {
    // Store a value
    await box.store(42);

    expect((await box.retrieve()).toString()).to.equal("42");
  });

  it("store emits an event", async function () {
    await expect(box.store(42)).to.emit(box, "ValueChanged").withArgs(42);
  });

  it("should revert if non owner tries to set value", async function () {
    const [_, addr1] = await ethers.getSigners();

    await expect(box.connect(addr1).store(42)).to.be.revertedWith(
      "caller is not the owner"
    );
  });
});
