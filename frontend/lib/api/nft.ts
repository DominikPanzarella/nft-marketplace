import { ethers } from "ethers";
import { convertToMarketItem, retrieveMarketItemByCollectionAndTokenId } from "@/lib/api/marketplace";
import { getAllDeployedCollections } from "@/app/nft/clientsideactions";
import { NftFormType } from "@/app/nft/(form components)/nft-form";
import { NftMetadata } from "@/app/nft/[collectionId]/[tokenId]/(nft details)/nft-details";
import { createNFTOnPinata } from "@/lib/services/pinata";
import { MarketplaceRegistry__factory } from "@/typechain-types/factories/contracts";

export type Nft = NftFormType & {
  metadataUrl?: string;
  imageUrl?: string;
  collection?: string;
  owner?: string;
  marketPlace?: NftMarketplaceDetails;
};

export type NftMarketplaceDetails = {
  marketItemId: ethers.BigNumberish;
  nftContractAddress: string;
  creator: string;
  seller: string;
  owner: string;
  price: ethers.BigNumberish;
  sold: boolean;
  canceled: boolean;
  list: boolean;
  tokenId: ethers.BigNumberish;
};

export const mintNftOnMarketplace = async (nft: Nft, signer: ethers.Signer): Promise<NftMarketplaceDetails> => {
  try {
    const nft_pinata = await createNFTOnPinata(nft);
    console.log("Pinata response:", nft_pinata);
    // Convert HTTP URL to IPFS URI
    console.log("Converted IPFS URI:", nft_pinata);
    nft.metadataUrl = nft_pinata;

    const nftContract = new ethers.Contract(
      nft.collection,
      [
        "function mint(string memory uri) public returns (uint256)",
        "function getLastTokenId() public view returns (uint256)",
      ],
      signer
    );

    const userAddress = await signer.getAddress();
    if (!signer.provider) {
      throw new Error("No provider available");
    }

    // Get user balance first
    const userBalance = await signer.provider.getBalance(userAddress);
    console.log("User Balance BEFORE(ETH): ", ethers.formatEther(userBalance));

    // Estimate gas for minting
    const gasEstimate = await nftContract.mint.estimateGas(nft_pinata);
    const feeData = await signer.provider.getFeeData();
    // Calculate total cost including gas (all values in wei)
    const gasCost = gasEstimate * (feeData.maxFeePerGas || feeData.gasPrice || 0n);
    const totalCost = gasCost;

    // Check if user has enough balance (comparing wei values)
    if (userBalance < totalCost) {
      throw new Error(
        `Insufficient funds. Required: ${ethers.formatEther(totalCost)} ETH, Available: ${ethers.formatEther(userBalance)} ETH`
      );
    }
    console.log("Total cost (ETH): ", ethers.formatEther(totalCost));

    const tx = await nftContract.mint(nft_pinata);

    console.log("Transaction sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);
    const userBalance2 = await signer.provider.getBalance(userAddress);
    console.log("User Balance AFTER(ETH): ", ethers.formatEther(userBalance2));
    const tokenId = await nftContract.getLastTokenId();
    console.log(tokenId);
    console.log(nft.collection);
    const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;
    if (!marketplaceAddress || !ethers.isAddress(marketplaceAddress)) {
      throw new Error("Invalid marketplace address");
    }

    // Create MarketplaceRegistry contract instance using factory
    const marketplaceRegistry = MarketplaceRegistry__factory.connect(marketplaceAddress, signer);

    // Try to add NFT to marketplace with listing fee
    const marketItemTx = await marketplaceRegistry.createUnlistedMarketItem(nft.collection, tokenId);
    const marketItemReceipt = await marketItemTx.wait();
    console.log("Market Item Created:", marketItemReceipt);
    const nft_created = await marketplaceRegistry.retrieveMarketItemByCollectionAndTokenId(nftContract, tokenId);
    const allItems = await marketplaceRegistry.retrieveAllMarketItems();
    const lastItemRaw = allItems[allItems.length - 1];
    console.log(lastItemRaw);
    return convertToMarketItem(lastItemRaw);
  } catch (error) {
    console.error("Error minting NFT:", error);
    throw error;
  }
};

//TODO: to improve
export const getNFTsFromCollection = async (collectionAddress: string, signer: ethers.Signer): Promise<Nft[]> => {
  try {
    // Create NFT contract instance
    const nftContract = new ethers.Contract(
      collectionAddress,
      [
        "function ownerOf(uint256 tokenId) public view returns (address)",
        "function tokenURI(uint256 tokenId) public view returns (string)",
        "function getAllMintedNfts() public view returns (uint256[] memory)",
      ],
      signer
    );

    const tokenIds: string[] = await nftContract.getAllMintedNfts();
    return (
      await Promise.all(
        tokenIds.map(async (tokenId) => {
          try {
            const [owner, uri] = await Promise.all([nftContract.ownerOf(tokenId), nftContract.tokenURI(tokenId)]);

            try {
              const response = await fetch(uri);
              const metadata = await response.json();
              return {
                ...metadata,
                tokenId: Number(tokenId),
                owner,
              } as Nft;
            } catch (err) {
              console.error(`Error fetching metadata for token ${tokenId}:`, err);
              return null;
            }
          } catch (err) {
            console.error(`Error processing token ${tokenId}:`, err);
            return null;
          }
        })
      )
    ).filter((nft): nft is Nft => nft !== null);
  } catch (error) {
    console.error("Error getting NFTs from collection:", error);
    throw error;
  }
};

export const retrieveMetadataByTokenId = async (
  contractAddress: string,
  signer: ethers.Signer,
  tokenId?: string
): Promise<{
  metadataUrl: string;
  collection: string;
  tokenId: string;
}> => {
  try {
    const tokenIdNum = Number(tokenId);
    if (!tokenId || isNaN(tokenIdNum)) {
      new Error("Invalid tokenId");
    }
    // Get the NFT contract instance with all necessary functions
    const nftContract = new ethers.Contract(
      contractAddress,
      [
        "function tokenURI(uint256 tokenId) view returns (string)",
        "function name() view returns (string)",
        "function symbol() view returns (string)",
      ],
      signer
    );

    // Get the token URI
    const tokenURI = await nftContract.tokenURI(tokenIdNum);
    // Get collection name and symbol
    return {
      metadataUrl: tokenURI,
      collection: contractAddress,
      tokenId: tokenId || "",
    };
  } catch (error) {
    console.error("Error retrieving NFT metadata:", error);
    throw new Error("Failed to retrieve NFT metadata");
  }
};

export const getTokenDetails = async (
  collectionId: string,
  tokenId: string,
  signer: ethers.Signer
): Promise<{
  marketItem: NftMarketplaceDetails;
  metadata: NftMetadata;
  currentAddress: string;
}> => {
  try {
    if (!signer) new Error("Wallet not connected");
    const { marketItem, found } = await retrieveMarketItemByCollectionAndTokenId(signer, collectionId, tokenId);
    if (!found) new Error("NFT not found");
    const formattedMarketItem: NftMarketplaceDetails = {
      marketItemId: marketItem!.marketItemId,
      nftContractAddress: marketItem!.nftContractAddress,
      tokenId: marketItem!.tokenId,
      creator: marketItem!.creator,
      seller: marketItem!.seller,
      owner: marketItem!.owner,
      price: marketItem!.price,
      sold: marketItem!.sold,
      canceled: marketItem!.canceled,
      list: marketItem!.list,
    };
    //fixme type
    const metadata = await retrieveMetadataByTokenId(
      marketItem!.nftContractAddress,
      signer,
      marketItem!.tokenId.toString()
    );

    const currentAddress = await signer.getAddress();
    return {
      marketItem: formattedMarketItem,
      //fixme type
      // eslint-disable-next-line
      // @ts-ignore
      metadata,
      currentAddress,
    };
  } catch (error) {
    console.error("Error fetching NFT data:", error);
    throw error;
  }
};

export const getFormattedCollections = async (signer: ethers.Signer) =>
  getAllDeployedCollections(signer)
    .then((collections) =>
      collections.map((collection) => ({
        key: collection.address,
        label: `${collection.name} (${collection.symbol})`,
      }))
    )
    .catch((error) => {
      console.error("Error fetching collections:", error);
      return [];
    });
