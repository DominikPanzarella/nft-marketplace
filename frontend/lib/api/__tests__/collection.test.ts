import { ethers } from "ethers";
import {
  getCollections,
  getAllCollectionsDeployedByMe,
  getCollectionInformation,
  deployCollection,
} from "@/lib/api/collection";
import { retrieveAllCollections } from "@/lib/api/marketplace";
import { NFTFactory__factory } from "@/typechain-types/factories/contracts/NftFactory.sol/NFTFactory__factory";

jest.mock("@/typechain-types/factories/contracts/NftFactory.sol/NFTFactory__factory", () => ({
  NFTFactory__factory: {
    connect: jest.fn(),
  },
}));

jest.mock("@/lib/api/marketplace", () => ({
  retrieveAllCollections: jest.fn(),
}));

const mockSigner = (): ethers.Signer =>
  ({
    getAddress: jest.fn().mockResolvedValue("0xSigner"),
    provider: {
      getBalance: jest.fn().mockResolvedValue(BigInt(1000000000000000000)),
      getFeeData: jest.fn().mockResolvedValue({
        gasPrice: BigInt(1000000000),
        maxFeePerGas: BigInt(1000000000),
        maxPriorityFeePerGas: BigInt(1000000000),
      }),
    },
    connect: jest.fn(),
    getNonce: jest.fn(),
    signMessage: jest.fn(),
    signTransaction: jest.fn(),
    sendTransaction: jest.fn(),
    populateCall: jest.fn(),
    populateTransaction: jest.fn(),
    estimateGas: jest.fn(),
  }) as unknown as ethers.Signer;
describe("collection", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_NFT_FACTORY_ADDRESS = "0xMockFactoryAddress";
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getCollections", () => {
    it("should retrieve and deduplicate collections", async () => {
      const signer = mockSigner();
      (retrieveAllCollections as jest.Mock).mockResolvedValue([
        { address: "0x1", name: "Collection1" },
        { address: "0x1", name: "Collection1" },
        { address: "0x2", name: "Collection2" },
      ]);

      const collections = await getCollections(signer);

      expect(collections.length).toBe(2);
      expect(collections[0]).toHaveProperty("address", "0x1");
      expect(retrieveAllCollections).toHaveBeenCalled();
    });

    it("should throw an error if fetching collections fails", async () => {
      const signer = mockSigner();
      (retrieveAllCollections as jest.Mock).mockRejectedValue(new Error("Something went wrong"));

      await expect(getCollections(signer)).rejects.toThrow("Failed to fetch collections");
    });
  });

  describe("getAllCollectionsDeployedByMe", () => {
    it("should retrieve collections deployed by the signer", async () => {
      const signer = mockSigner();

      const mockNFTFactory = {
        getDeployedNFTs: jest.fn().mockResolvedValue(["0xCollection1", "0xCollection2"]),
      };

      (NFTFactory__factory.connect as jest.Mock).mockReturnValue(mockNFTFactory);

      const mockContract = {
        name: jest.fn().mockResolvedValue("Collection1"),
        symbol: jest.fn().mockResolvedValue("C1"),
        baseURI: jest.fn().mockResolvedValue("baseURI"),
        deployer: jest.fn().mockResolvedValue("0xSigner"),
        getCollectionImageUri: jest.fn().mockResolvedValue("imageUri"),
      };

      jest.spyOn(ethers, "Contract").mockImplementation(() => mockContract as any);

      const collections = await getAllCollectionsDeployedByMe(signer);

      expect(collections.length).toBe(2);
      expect(collections[0]).toHaveProperty("name", "Collection1");
      expect(mockNFTFactory.getDeployedNFTs).toHaveBeenCalled();
    });

    it("should throw an error if NFT_FACTORY_ADDRESS is missing", async () => {
      const signer = mockSigner();
      const originalEnv = process.env.NEXT_PUBLIC_NFT_FACTORY_ADDRESS;
      delete process.env.NEXT_PUBLIC_NFT_FACTORY_ADDRESS;

      await expect(getAllCollectionsDeployedByMe(signer)).rejects.toThrow(
        "NFT Factory address not configured in environment variables"
      );

      process.env.NEXT_PUBLIC_NFT_FACTORY_ADDRESS = originalEnv;
    });
  });

  describe("getCollectionInformation", () => {
    it("should retrieve information about a specific collection", async () => {
      const signer = mockSigner();

      const mockNFTFactory = {
        getDeployedNFTs: jest.fn().mockResolvedValue(["0xCollection1"]),
      };

      (NFTFactory__factory.connect as jest.Mock).mockReturnValue(mockNFTFactory);

      const mockContract = {
        name: jest.fn().mockResolvedValue("Collection1"),
        symbol: jest.fn().mockResolvedValue("C1"),
        baseURI: jest.fn().mockResolvedValue("baseURI"),
        deployer: jest.fn().mockResolvedValue("0xSigner"),
        getCollectionImageUri: jest.fn().mockResolvedValue("imageUri"),
      };

      jest.spyOn(ethers, "Contract").mockImplementation(() => mockContract as any);

      const collection = await getCollectionInformation(signer, "0xCollection1");

      expect(collection.name).toBe("Collection1");
      expect(mockNFTFactory.getDeployedNFTs).toHaveBeenCalled();
    });

    it("should throw an error if NFT_FACTORY_ADDRESS is missing", async () => {
      const signer = mockSigner();
      const originalEnv = process.env.NEXT_PUBLIC_NFT_FACTORY_ADDRESS;
      delete process.env.NEXT_PUBLIC_NFT_FACTORY_ADDRESS;

      await expect(getCollectionInformation(signer, "0xCollection1")).rejects.toThrow(
        "NFT Factory address not configured in environment variables"
      );

      process.env.NEXT_PUBLIC_NFT_FACTORY_ADDRESS = originalEnv;
    });
  });

  describe("deployCollection", () => {
    it("should deploy a new collection", async () => {
      const signer = mockSigner();

      const mockNFTFactory = {
        createNFTContract: Object.assign(
          jest.fn().mockReturnValue({
            hash: "0xTxHash",
            wait: jest.fn().mockResolvedValue({
              blockNumber: 123,
              logs: [
                {
                  topics: [ethers.id("NFTContractCreated(address,address)")],
                  data: "0xData",
                },
              ],
            }),
          }),
          {
            estimateGas: jest.fn().mockResolvedValue(BigInt(21000)), // 👈 aggiunto il mock di estimateGas
          }
        ),
        interface: {
          getEvent: (name: string) => ({ topicHash: ethers.id(name) }),
          decodeEventLog: jest.fn().mockReturnValue({ nftAddress: "0xNewCollection" }),
        },
      };

      (NFTFactory__factory.connect as jest.Mock).mockReturnValue(mockNFTFactory);

      const deployed = await deployCollection("TestCollection", "TEST", "imageUri", signer);

      expect(deployed.address).toBe("0xNewCollection");
      expect(deployed.name).toBe("TestCollection");
      expect(mockNFTFactory.createNFTContract).toHaveBeenCalled();
    });

    it("should throw an error if user has insufficient funds", async () => {
      const signer = {
        ...mockSigner(),
        provider: {
          getBalance: jest.fn().mockResolvedValue(BigInt("1000000000000")), // very low balance
          getFeeData: jest.fn().mockResolvedValue({
            maxFeePerGas: BigInt("100000000000"), // high gas
            maxPriorityFeePerGas: BigInt("1000000000"),
            gasPrice: BigInt("100000000000"),
          }),
        },
      };

      const mockNFTFactory = {
        createNFTContract: {
          estimateGas: jest.fn().mockResolvedValue(BigInt("21000")),
        },
      };

      (NFTFactory__factory.connect as jest.Mock).mockReturnValue(mockNFTFactory);

      //eslint-disable-next-line
      // @ts-ignore
      await expect(deployCollection("Test", "TST", "imageUri", signer)).rejects.toThrow("Insufficient funds");
    });
  });
});
