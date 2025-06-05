import {
  retreiveAllMarketItems,
  retrieveAllCollections,
  retrieveMarketItemByCollectionAndTokenId,
} from "@/lib/api/marketplace";
import { ethers } from "ethers";

import { MarketplaceRegistry__factory } from "@/typechain-types";
import * as typechainFactories from "@/typechain-types/factories/contracts";

jest.mock("ethers", () => {
  const original = jest.requireActual("ethers");
  return {
    ...original,
    ContractFactory: class MockContractFactory {},
  };
});

jest.spyOn(typechainFactories.MarketplaceRegistry__factory, "connect").mockImplementation(
  () =>
    ({
      getAllContractsAddress: jest.fn(),
      retrieveAllMarketItems: jest.fn(),
    }) as any
);

const mockSigner = () => {
  const provider = {
    getBalance: jest.fn(),
    getFeeData: jest.fn(),
    resolveName: jest.fn(),
  };
  return {
    getAddress: jest.fn(),
    provider,
  } as unknown as ethers.Signer;
};

describe("marketplace.ts", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS = "0x0000000000000000000000000000000000000001";
  });
  describe("retrieveAllCollections", () => {
    it("should retrieve all collections and their details", async () => {
      const signer = mockSigner();

      const mockMarketplaceRegistry = {
        getAllContractsAddress: jest.fn().mockResolvedValue(["0xCollection1", "0xCollection2"]),
      };
      const mockNFTContract = {
        name: jest.fn().mockResolvedValue("Mock Collection"),
        symbol: jest.fn().mockResolvedValue("MOCK"),
        getCollectionImageUri: jest.fn().mockResolvedValue("https://image-uri"),
      };

      (MarketplaceRegistry__factory.connect as jest.Mock).mockReturnValue(mockMarketplaceRegistry);
      jest.spyOn(ethers, "Contract").mockImplementation(() => mockNFTContract as any);

      const collections = await retrieveAllCollections(signer);

      expect(collections.length).toBe(2);
      expect(collections[0]).toEqual({
        address: "0xCollection1",
        name: "Mock Collection",
        symbol: "MOCK",
        imageUrl: "https://image-uri",
      });
      expect(mockMarketplaceRegistry.getAllContractsAddress).toHaveBeenCalled();
    });

    it("should throw error if marketplace address is invalid", async () => {
      const signer = mockSigner();
      process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS = "invalid_address";

      await expect(retrieveAllCollections(signer)).rejects.toThrow("Invalid marketplace address");
    });
  });

  describe("retreiveAllMarketItems", () => {
    it("should retrieve and format all market items", async () => {
      const signer = mockSigner();
      const mockMarketplaceRegistry = {
        retrieveAllMarketItems: jest.fn().mockResolvedValue([
          {
            marketItemId: 1,
            nftContractAddress: "0xAddress",
            tokenId: 1,
            creator: "0xCreator",
            seller: "0xSeller",
            owner: "0xOwner",
            price: "1000000000000000000",
            sold: false,
            canceled: false,
            list: true,
          },
        ]),
      };

      (MarketplaceRegistry__factory.connect as jest.Mock).mockReturnValue(mockMarketplaceRegistry);

      const items = await retreiveAllMarketItems(signer);

      expect(items.length).toBe(1);
      expect(items[0]).toHaveProperty("marketItemId", 1);
      expect(mockMarketplaceRegistry.retrieveAllMarketItems).toHaveBeenCalled();
    });

    it("should throw error if marketplace address is invalid", async () => {
      const signer = mockSigner();
      process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS = "invalid_address";

      await expect(retreiveAllMarketItems(signer)).rejects.toThrow("Invalid marketplace address");
    });
  });

  describe("retrieveMarketItemByCollectionAndTokenId", () => {
    it("should find and return a market item", async () => {
      const signer = mockSigner();

      const mockMarketplaceRegistry = {
        retrieveAllMarketItems: jest.fn().mockResolvedValue([{ nftContractAddress: "0xCollection", tokenId: 1 }]),
      };

      (MarketplaceRegistry__factory.connect as jest.Mock).mockReturnValue(mockMarketplaceRegistry);

      const result = await retrieveMarketItemByCollectionAndTokenId(signer, "0xCollection", 1);

      expect(result.found).toBe(true);
      expect(result.marketItem).toEqual({ nftContractAddress: "0xCollection", tokenId: 1 });
      expect(mockMarketplaceRegistry.retrieveAllMarketItems).toHaveBeenCalled();
    });

    it("should return not found if item does not exist", async () => {
      const signer = mockSigner();
      const mockMarketplaceRegistry = {
        retrieveAllMarketItems: jest.fn().mockResolvedValue([]),
      };

      (MarketplaceRegistry__factory.connect as jest.Mock).mockReturnValue(mockMarketplaceRegistry);

      const result = await retrieveMarketItemByCollectionAndTokenId(signer, "0xCollection", 1);

      expect(result.found).toBe(false);
      expect(result.marketItem).toBeUndefined();
    });

    it("should throw error if marketplace address is invalid", async () => {
      const signer = mockSigner();
      process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS = "invalid_address";

      await expect(retrieveMarketItemByCollectionAndTokenId(signer, "0xCollection", 1)).rejects.toThrow(
        "Invalid marketplace address"
      );
    });
  });
});
