// __mocks__/ethers.js
export const ethers = {
  Contract: jest.fn().mockImplementation(() => ({
    name: jest.fn().mockResolvedValue("MockedNFT"),
    symbol: jest.fn().mockResolvedValue("MKT"),
    getCollectionImageUri: jest.fn().mockResolvedValue("mockImageUri"),
    approve: jest.fn().mockResolvedValue({ wait: jest.fn() }),
    retrieveAllMarketItems: jest.fn().mockResolvedValue([]),
    retrieveMarketItemByCollectionAndTokenId: jest.fn().mockResolvedValue([
      {
        marketItemId: 1,
        nftContractAddress: "mockAddress",
        tokenId: 123,
        creator: "mockCreator",
        seller: "mockSeller",
        owner: "mockOwner",
        price: "1000000000000000000", // 1 ETH in wei
        sold: false,
        canceled: false,
        list: true,
      },
      true,
    ]),
  })),
  parseUnits: jest.fn().mockReturnValue(1000000000000000000n), // 1 ETH in wei
  formatEther: jest.fn().mockReturnValue("1.0"),
  isAddress: jest.fn().mockReturnValue(true),
  id: jest.fn().mockReturnValue("mockId"),
  zeroPadValue: jest.fn().mockReturnValue("mockZeroPadded"),
  toBeHex: jest.fn().mockReturnValue("mockHex"),
};
