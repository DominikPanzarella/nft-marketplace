const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MarketplaceRegistry", function () {
  let marketplace;
  let nft;
  let owner;
  let addr1;
  let addr2;
  const listingFee = ethers.parseEther("0.01");

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy NFT contract
    const NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy("Test NFT", "TNFT", owner.address, owner.address, "ipfs://test");
    await nft.waitForDeployment();

    // Deploy MarketplaceRegistry
    const MarketplaceRegistry = await ethers.getContractFactory("MarketplaceRegistry");
    marketplace = await MarketplaceRegistry.deploy();
    await marketplace.waitForDeployment();
  });

  describe("Listing Fee", function () {
    it("Should return correct listing fee", async function () {
      expect(await marketplace.getListingFee()).to.equal(listingFee);
    });
  });

  describe("Market Item Creation", function () {
    it("Should create a market item", async function () {
      // Mint an NFT
      await nft.mint("ipfs://test1");
      const tokenId = await nft.getLastTokenId();

      // Approve marketplace to transfer NFT
      await nft.approve(marketplace.target, tokenId);

      // Create market item
      await expect(marketplace.createMarketItem(nft.target, tokenId, ethers.parseEther("1"), { value: listingFee }))
        .to.emit(marketplace, "MarketItemCreated");
    });

    it("Should fail if listing fee is incorrect", async function () {
      await nft.mint("ipfs://test1");
      const tokenId = await nft.getLastTokenId();
      await nft.approve(marketplace.target, tokenId);

      await expect(marketplace.createMarketItem(nft.target, tokenId, ethers.parseEther("1"), { value: ethers.parseEther("0.005") }))
        .to.be.revertedWith("Price must be equal to listing price");
    });
  });

  describe("Market Item Sale", function () {
    it("Should allow buying a listed item", async function () {
      // Mint NFT
      await nft.mint("ipfs://test1");
      const tokenId = await nft.getLastTokenId();
      await nft.approve(marketplace.target, tokenId);
      
      // Create unlisted market item
      await marketplace.createUnlistedMarketItem(nft.target, tokenId);
      
      // List the item
      await marketplace.listMarketItem(0, ethers.parseEther("1"), { value: listingFee });

      // Buy the item
      await expect(marketplace.connect(addr1).createMarketSale(nft.target, 0, { value: ethers.parseEther("1") }))
        .to.emit(marketplace, "MarketItemSold");
    });

    it("Should fail if payment amount is incorrect", async function () {
      // Mint NFT
      await nft.mint("ipfs://test1");
      const tokenId = await nft.getLastTokenId();
      await nft.approve(marketplace.target, tokenId);
      
      // Create unlisted market item
      await marketplace.createUnlistedMarketItem(nft.target, tokenId);
      
      // List the item
      await marketplace.listMarketItem(0, ethers.parseEther("1"), { value: listingFee });

      // Try to buy with incorrect amount
      await expect(marketplace.connect(addr1).createMarketSale(nft.target, 0, { value: ethers.parseEther("0.5") }))
        .to.be.revertedWith("Incorrect payment amount");
    });
  });

  describe("Market Item Cancellation", function () {
    it("Should allow seller to cancel listing", async function () {
      // Mint NFT
      await nft.mint("ipfs://test1");
      const tokenId = await nft.getLastTokenId();
      await nft.approve(marketplace.target, tokenId);
      
      // Create unlisted market item
      await marketplace.createUnlistedMarketItem(nft.target, tokenId);
      
      // List the item
      await marketplace.listMarketItem(0, ethers.parseEther("1"), { value: listingFee });

      await expect(marketplace.cancelMarketItem(nft.target, 0))
        .to.not.be.reverted;
    });

    it("Should fail if non-seller tries to cancel", async function () {
      // Mint NFT
      await nft.mint("ipfs://test1");
      const tokenId = await nft.getLastTokenId();
      await nft.approve(marketplace.target, tokenId);
      
      // Create unlisted market item
      await marketplace.createUnlistedMarketItem(nft.target, tokenId);
      
      // List the item
      await marketplace.listMarketItem(0, ethers.parseEther("1"), { value: listingFee });

      await expect(marketplace.connect(addr1).cancelMarketItem(nft.target, 0))
        .to.be.revertedWith("You are not the seller");
    });
  });
}); 