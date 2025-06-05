import { ethers } from "ethers";
import * as clientsideActions from "@/app/nft/clientsideactions";
import { getFormattedCollections, getNFTsFromCollection, getTokenDetails, retrieveMetadataByTokenId } from "../nft";
import { retrieveMarketItemByCollectionAndTokenId } from "@/lib/api/marketplace";

jest.mock("../../../lib/services/pinata", () => ({
  createNFTOnPinata: jest.fn(),
}));

jest.mock("../../../typechain-types/factories/contracts", () => ({
  MarketplaceRegistry__factory: {
    connect: jest.fn(),
  },
}));

jest.mock("../marketplace", () => ({
  retrieveMarketItemByCollectionAndTokenId: jest.fn(),
}));

// Helper function to create a mock signer
const mockSigner = () => {
  const provider = {
    getBalance: jest.fn(),
    getFeeData: jest.fn(),
    resolveName: jest.fn(), // Aggiungi il mock per resolveName
  };
  return {
    getAddress: jest.fn(),
    provider,
  } as unknown as ethers.Signer;
};

//describe("mintNftOnMarketplace", () => {});

describe("getNFTsFromCollection", () => {
  it("should fetch and format NFTs from a collection", async () => {
    const signer = mockSigner();
    const contract = {
      getAllMintedNfts: jest.fn().mockResolvedValue(["1", "2"]),
      ownerOf: jest.fn().mockResolvedValue("0xOwner"),
      tokenURI: jest.fn().mockResolvedValue("https://mock-metadata-uri"),
    };

    jest.spyOn(ethers, "Contract").mockImplementation(() => contract as any);

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ name: "NFT Name", description: "NFT Desc" }),
      } as Response)
    ) as jest.Mock;

    const result = await getNFTsFromCollection("0xCollectionAddress", signer);
    expect(result.length).toBe(2);
    expect(result[0]).toHaveProperty("name", "NFT Name");
    expect(contract.getAllMintedNfts).toHaveBeenCalled();
  });
});

describe("retrieveMetadataByTokenId", () => {
  it("should fetch metadata for a given tokenId", async () => {
    const signer = mockSigner();
    const contract = {
      tokenURI: jest.fn().mockResolvedValue("https://mock-uri"),
    };

    jest.spyOn(ethers, "Contract").mockImplementation(() => contract as any);

    const result = await retrieveMetadataByTokenId("0xContract", signer, "1");
    expect(result).toEqual({
      metadataUrl: "https://mock-uri",
      collection: "0xContract",
      tokenId: "1",
    });
  });

  it("should throw error on invalid tokenId", async () => {
    const signer = mockSigner();
    const contract = {
      tokenURI: jest.fn().mockRejectedValue(new Error("Token not found")),
    };

    jest.spyOn(ethers, "Contract").mockImplementation(() => contract as any);

    await expect(retrieveMetadataByTokenId("0xContract", signer, "invalid")).rejects.toThrow(
      "Failed to retrieve NFT metadata"
    );
  });
});

describe("getTokenDetails", () => {
  it("should retrieve token market item, metadata, and current user address", async () => {
    const signer = mockSigner();

    (retrieveMarketItemByCollectionAndTokenId as jest.Mock).mockResolvedValue({
      marketItem: {
        nftContractAddress: "0xCollection",
        tokenId: 1,
      },
      found: true,
    });

    // 👇 MOCK ethers.Contract per tokenURI, name e symbol
    jest.spyOn(ethers, "Contract").mockImplementation(
      () =>
        ({
          tokenURI: jest.fn().mockResolvedValue("https://mock-uri"),
          name: jest.fn().mockResolvedValue("Mock Collection Name"),
          symbol: jest.fn().mockResolvedValue("MCN"),
        }) as any
    );

    const getAddressMock = jest.fn().mockResolvedValue("0xUserAddress");
    signer.getAddress = getAddressMock;

    const result = await getTokenDetails("0xCollection", "1", signer);

    expect(result.marketItem).toBeDefined();
    expect(result.metadata).toEqual({
      metadataUrl: "https://mock-uri",
      collection: "0xCollection",
      tokenId: "1",
    });
    expect(result.currentAddress).toEqual("0xUserAddress");
  });
});

jest.mock("@/app/nft/clientsideactions", () => ({
  getAllDeployedCollections: jest.fn(),
}));

describe("getFormattedCollections", () => {
  it("should return formatted collections", async () => {
    const signer = mockSigner();

    const collectionsMock = [
      { address: "0x1", name: "Collection One", symbol: "COL1" },
      { address: "0x2", name: "Collection Two", symbol: "COL2" },
    ];

    (clientsideActions.getAllDeployedCollections as jest.Mock).mockResolvedValue(collectionsMock);

    const result = await getFormattedCollections(signer);

    expect(result.length).toBe(2);
    expect(result[0]).toEqual({ key: "0x1", label: "Collection One (COL1)" });
  });

  it("should return empty array on error", async () => {
    const signer = mockSigner();
    (clientsideActions.getAllDeployedCollections as jest.Mock).mockRejectedValue(new Error("Failed"));

    const result = await getFormattedCollections(signer);
    expect(result).toEqual([]);
  });
});
