const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT", function () {
  let nft;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy("Test NFT", "TNFT", owner.address, owner.address, "ipfs://test");
    await nft.waitForDeployment();
  });

  describe("Minting", function () {
    it("Should mint a new NFT", async function () {
      await expect(nft.mint("ipfs://test1"))
        .to.emit(nft, "TokenMinted");
      
      const tokenId = await nft.getLastTokenId();
      expect(await nft.ownerOf(tokenId)).to.equal(owner.address);
    });

    it("Should set correct token URI", async function () {
      const uri = "ipfs://test1";
      await nft.mint(uri);
      const tokenId = await nft.getLastTokenId();
      expect(await nft.tokenURI(tokenId)).to.equal(uri);
    });
  });

  describe("Token Ownership", function () {
    it("Should return correct tokens owned by address", async function () {
      await nft.mint("ipfs://test1");
      await nft.mint("ipfs://test2");
      
      const ownedTokens = await nft.getTokensOwnedByMe();
      expect(ownedTokens.length).to.equal(2);
      
      expect(await nft.ownerOf(ownedTokens[0])).to.equal(owner.address);
      expect(await nft.ownerOf(ownedTokens[1])).to.equal(owner.address);
    });

    it("Should return correct tokens created by address", async function () {
      await nft.mint("ipfs://test1");
      await nft.mint("ipfs://test2");
      
      const createdTokens = await nft.getTokensCreatedByMe();
      expect(createdTokens.length).to.equal(2);
      
      expect(await nft.getTokenCreatorById(createdTokens[0])).to.equal(owner.address);
      expect(await nft.getTokenCreatorById(createdTokens[1])).to.equal(owner.address);
    });
  });

  describe("Collection Image", function () {
    it("Should return correct collection image URI", async function () {
      expect(await nft.getCollectionImageUri()).to.equal("ipfs://test");
    });

    it("Should allow owner to update collection image URI", async function () {
      const newUri = "ipfs://new-test";
      await nft.updateCollectionImageUri(newUri);
      expect(await nft.getCollectionImageUri()).to.equal(newUri);
    });

    it("Should prevent non-owner from updating collection image URI", async function () {
      const newUri = "ipfs://new-test";
      await expect(nft.connect(addr1).updateCollectionImageUri(newUri))
        .to.be.revertedWithCustomError(nft, "OwnableUnauthorizedAccount");
    });
  });

  describe("Pausing", function () {
    it("Should allow owner to pause and unpause", async function () {
      await nft.pause();
      await expect(nft.mint("ipfs://test1"))
        .to.be.revertedWithCustomError(nft, "EnforcedPause");

      await nft.unpause();
      await expect(nft.mint("ipfs://test1"))
        .to.emit(nft, "TokenMinted");
    });

    it("Should prevent non-owner from pausing", async function () {
      await expect(nft.connect(addr1).pause())
        .to.be.revertedWithCustomError(nft, "OwnableUnauthorizedAccount");
    });
  });
});
