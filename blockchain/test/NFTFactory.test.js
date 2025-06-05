const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTFactory", function () {
  let factory;
  let marketplace;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    // Deploy MarketplaceRegistry first
    const MarketplaceRegistry = await ethers.getContractFactory("MarketplaceRegistry");
    marketplace = await MarketplaceRegistry.deploy();
    await marketplace.waitForDeployment();

    // Deploy NFTFactory with marketplace address
    const NFTFactory = await ethers.getContractFactory("NFTFactory");
    factory = await NFTFactory.deploy(marketplace.target);
    await factory.waitForDeployment();
  });

  describe("Contract Creation", function () {
    it("Should create a new NFT contract", async function () {
      const name = "Test Collection";
      const symbol = "TC";
      const collectionImageUri = "ipfs://test-collection";

      await expect(factory.createNFTContract(name, symbol, collectionImageUri))
        .to.emit(factory, "NFTContractCreated");

      const deployedNFTs = await factory.getDeployedNFTs();
      expect(deployedNFTs.length).to.equal(1);
    });

    it("Should create multiple NFT contracts", async function () {
      await factory.createNFTContract("Collection 1", "C1", "ipfs://test1");
      await factory.createNFTContract("Collection 2", "C2", "ipfs://test2");

      const deployedNFTs = await factory.getDeployedNFTs();
      expect(deployedNFTs.length).to.equal(2);
    });
  });

  describe("Deployed NFTs", function () {
    it("Should return correct marketplace address", async function () {
      expect(await factory.marketplaceAddress()).to.equal(marketplace.target);
    });

    it("Should return empty array when no NFTs are deployed", async function () {
      const deployedNFTs = await factory.getDeployedNFTs();
      expect(deployedNFTs.length).to.equal(0);
    });

    it("Should return correct NFT contract addresses", async function () {
      await factory.createNFTContract("Collection 1", "C1", "ipfs://test1");
      const deployedNFTs = await factory.getDeployedNFTs();
      
      const NFT = await ethers.getContractFactory("NFT");
      const nft = NFT.attach(deployedNFTs[0]);
      
      expect(await nft.name()).to.equal("Collection 1");
      expect(await nft.symbol()).to.equal("C1");
    });
  });
}); 