import {
  ethers,
  deployments,
  getUnnamedAccounts,
  getNamedAccounts,
} from "hardhat";
import chai from "chai";
import { MetaLoot, SimpleERC20 } from "../typechain";
import { setupUser, setupUsers } from "./utils";

const { expect } = chai;

const setup = deployments.createFixture(async () => {
  const accounts = await getNamedAccounts();

  await deployments.fixture(["MetaLoot", "SimpleERC20"]);

  const contracts = {
    metaLoot: <MetaLoot>await ethers.getContract("MetaLoot"),
    token: <SimpleERC20>await ethers.getContract("SimpleERC20"),
  };

  const users = await setupUsers(await getUnnamedAccounts(), contracts);
  const buyer = await setupUser(accounts.buyer, contracts);
  const tokenOwner = await setupUser(accounts.tokenOwner, contracts);

  await tokenOwner.token
    .mint(buyer.address, ethers.utils.parseEther("1000"))
    .then((tx) => tx.wait());

  return {
    ...contracts,
    users,
    buyer,
    tokenOwner,
  };
});

describe("MetaLoot", function () {
  const price = ethers.utils.parseEther("42");
  const mintTokenId = 1;
  const tokenURI = "customTokenURI";
  const maxSupply = 5;
  const baseURI = "ipfs://";

  const setupAndActivate = async () => {
    const res = await setup();
    await res.metaLoot.activate(
      res.token.address,
      price,
      mintTokenId,
      tokenURI,
      maxSupply
    );
    return res;
  };

  it("Allows owner to set base URI", async function () {
    const { metaLoot } = await setup();

    await metaLoot.setBaseURI("newUri");

    expect((await metaLoot.baseURI()).toString()).to.equal("newUri");
  });


  describe("updateTokenURI", () => {
    it("should allow owner to updating an existing tokenURI", async function () {
      const { metaLoot, token } = await setup();

       await metaLoot.activate(
         token.address,
         price,
         mintTokenId,
         tokenURI,
         maxSupply
       );

      expect(await metaLoot.uri(mintTokenId)).to.equal(`${baseURI}${tokenURI}`)

      const updatedURI = 'updatedTokenURI'

      await expect(
        metaLoot.updateTokenURI(
          mintTokenId,
          updatedURI,
        )
      ).to.emit(metaLoot, "URI")
        .withArgs(`${baseURI}${updatedURI}`, mintTokenId);

      expect(await metaLoot.uri(mintTokenId)).to.equal(`${baseURI}${updatedURI}`)
    });

    it("should disallow non owners to update tokenURIs", async function () {
      const { users } = await setup();

      await expect(
        users[0].metaLoot.updateTokenURI(
          mintTokenId,
          'updatedURI',
        )
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });


  describe("activate", () => {
    it("Allows owner to activate public sale", async function () {
      const { metaLoot, token } = await setup();

      await expect(
        metaLoot.activate(
          token.address,
          price,
          mintTokenId,
          tokenURI,
          maxSupply
        )
      )
        .to.emit(metaLoot, "Activate")
        .withArgs(mintTokenId, token.address, price, maxSupply);

      expect(await metaLoot.saleActive()).to.equal(true);
      expect(await metaLoot.saleTokenId()).to.equal(mintTokenId);
      expect(await metaLoot.paymentTokenContract()).to.equal(token.address);
      expect(await metaLoot.salePrice()).to.equal(price);
      expect(await metaLoot.maxSupply()).to.equal(maxSupply);
      expect(await metaLoot.uri(mintTokenId)).to.equal(`${baseURI}${tokenURI}`);

      await expect(
        metaLoot.activate(
          token.address,
          price,
          mintTokenId,
          tokenURI,
          maxSupply
        )
      ).to.be.revertedWith("Already active");
    });

    it("should not allow non-owners to activate public sale", async function () {
      const { users, token } = await setup();

      await expect(
        users[0].metaLoot.activate(
          token.address,
          price,
          mintTokenId,
          tokenURI,
          maxSupply
        )
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

  });

  describe("deactivate", () => {
    it("Allows owner to deactivate public sale", async function () {
      const { metaLoot } = await setupAndActivate();

      expect(await metaLoot.saleActive()).to.equal(true);

      await expect(metaLoot.deactivate())
        .to.emit(metaLoot, "Deactivate")
        .withArgs(mintTokenId);

      expect(await metaLoot.saleActive()).to.equal(false);
    });
  });

  describe("activate multiple sales", () => {
    it("should allow activating a new sale for a new item with a unique tokenURI", async function () {
      const { metaLoot, token } = await setup();

      await expect(
        metaLoot.activate(
          token.address,
          price,
          mintTokenId,
          tokenURI,
          maxSupply
        )
      )
        .to.emit(metaLoot, "Activate")
        .withArgs(mintTokenId, token.address, price, maxSupply);

      await expect(metaLoot.deactivate())
        .to.emit(metaLoot, "Deactivate")
        .withArgs(mintTokenId);


      const mintTokenId2 = 2;
      const tokenURI2 = 'tokenURI2'

      await expect(
        metaLoot.activate(
          token.address,
          price,
          mintTokenId2,
          tokenURI2,
          maxSupply
        )
      ).to.emit(metaLoot, "Activate")
        .withArgs(mintTokenId2, token.address, price, maxSupply);

       expect(await metaLoot.uri(mintTokenId)).to.equal(`${baseURI}${tokenURI}`)
       expect(await metaLoot.uri(mintTokenId2)).to.equal(`${baseURI}${tokenURI2}`)
    });

  });


  describe("buyMetaLoot", () => {
    it("should revert if sale is not active", async () => {
      const { buyer } = await setup();

      await expect(buyer.metaLoot.buyMetaLoot(1)).to.be.revertedWith(
        "Inactive"
      );
    });

    it("should revert if invalid amount of items requested", async () => {
      const { buyer } = await setupAndActivate();

      await expect(buyer.metaLoot.buyMetaLoot(6)).to.be.revertedWith(
        "Invalid amount requested"
      );

      await expect(buyer.metaLoot.buyMetaLoot(0)).to.be.revertedWith(
        "Invalid amount requested"
      );
    });

    it("should revert if buyer has not approved token spend allowance", async () => {
      const { buyer, metaLoot } = await setupAndActivate();

      await expect(buyer.metaLoot.buyMetaLoot(1)).to.be.revertedWith(
        "Token allowance too low"
      );
      await buyer.token.approve(
        metaLoot.address,
        ethers.utils.parseEther("50")
      );
      await expect(buyer.metaLoot.buyMetaLoot(2)).to.be.revertedWith(
        "Token allowance too low"
      );
    });

    it("should revert if maxSupply hit", async () => {
      const { buyer, metaLoot } = await setupAndActivate();

      await buyer.token.approve(
        metaLoot.address,
        ethers.utils.parseEther("1000")
      );

      await buyer.metaLoot.buyMetaLoot(5);
      await expect(buyer.metaLoot.buyMetaLoot(5)).to.be.revertedWith(
        "Requesting more than max supply"
      );
    });

    it("should mint an NFT in exchange for the token", async () => {
      const { buyer, metaLoot, token } = await setupAndActivate();

      await buyer.token.approve(
        metaLoot.address,
        ethers.utils.parseEther("42")
      );

      await expect(() => buyer.metaLoot.buyMetaLoot(1)).to.changeTokenBalances(
        token,
        [buyer, metaLoot],
        [price.mul(-1), price]
      );
      expect(await metaLoot.totalSupply(mintTokenId)).to.equal(1);
      expect(await metaLoot.balanceOf(buyer.address, 1)).to.equal(1);
    });

    it("should mint multiple NFTs in exchange for the token", async () => {
      const { buyer, metaLoot, token } = await setupAndActivate();

      await buyer.token.approve(
        metaLoot.address,
        ethers.utils.parseEther("250")
      );

      await expect(() => buyer.metaLoot.buyMetaLoot(5)).to.changeTokenBalances(
        token,
        [buyer, metaLoot],
        [price.mul(-5), price.mul(5)]
      );
      expect(await metaLoot.totalSupply(mintTokenId)).to.equal(5);
      expect(await metaLoot.balanceOf(buyer.address, 1)).to.equal(5);
    });
  });

  describe("withdrawFunds", () => {
    it("should send all sales proceeds to specified recipient", async () => {
      const { buyer, metaLoot, token, users } = await setupAndActivate();

      await buyer.token.approve(
        metaLoot.address,
        ethers.utils.parseEther("250")
      );
      await buyer.metaLoot.buyMetaLoot(5);

      await expect(() =>
        metaLoot.withdrawFunds(token.address, users[0].address)
      ).to.changeTokenBalances(
        token,
        [metaLoot, users[0]],
        [price.mul(-5), price.mul(5)]
      );
    });

    it("should only be callable by the owner", async () => {
      const { buyer, metaLoot, token, users } = await setupAndActivate();

      await buyer.token.approve(
        metaLoot.address,
        ethers.utils.parseEther("250")
      );
      await buyer.metaLoot.buyMetaLoot(5);

      await expect(
        buyer.metaLoot.withdrawFunds(token.address, users[0].address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });


  describe("mint", () => {
    it("should allow minting of an NFT by the owner", async () => {
      const { metaLoot, users } = await setupAndActivate();

      await metaLoot.mint(
        users[0].address,
        mintTokenId,
        1,
        tokenURI,
        ethers.constants.HashZero
      );
      expect(await metaLoot.balanceOf(users[0].address, mintTokenId)).to.equal(
        1
      );
      expect(await metaLoot.uri(mintTokenId)).to.equal(`${baseURI}${tokenURI}`)
    });

    it("should disallow minting of an NFT by non owners", async () => {
      const { users } = await setupAndActivate();

      await expect(users[0].metaLoot.mint(
        users[0].address,
        mintTokenId,
        1,
        tokenURI,
        ethers.constants.HashZero
      )).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("burn", () => {
    it("should allow burning of an NFT by its holder", async () => {
      const { metaLoot, users } = await setupAndActivate();

      await metaLoot.mint(
        users[0].address,
        mintTokenId,
        2,
        tokenURI,
        ethers.constants.HashZero
      );
      expect(await metaLoot.balanceOf(users[0].address, mintTokenId)).to.equal(
        2
      );

      await users[0].metaLoot.burn(users[0].address, mintTokenId, 1);

      expect(await metaLoot.balanceOf(users[0].address, mintTokenId)).to.equal(
        1
      );
    });
  });
});
