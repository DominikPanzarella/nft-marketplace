"use client";

import { uploadCollectionImageToPinata } from "@/lib/services/pinata";
import { getTokenDetails, mintNftOnMarketplace, Nft } from "@/lib/api/nft";
import { ethers, toBigInt } from "ethers";
import { buyMarketItem, getMarketItemByCollectionWithMetadata, listMarketItem } from "@/lib/api/marketplace";
import {
  deployCollection as deployCollectionService,
  getAllCollectionsDeployedByMe,
  getCollectionInformation,
  getCollections,
} from "@/lib/api/collection";
import { requireLogInSnakeBar } from "@/lib/utils";
import { CollectionFormType } from "@/app/nft/collection/deploy/(collection form)/deploy-collection-form";

export async function mintNft(nft: Nft, signer: ethers.Signer) {
  try {
    if (!nft.collection) {
      throw new Error("Collection address is required");
    }

    if (!signer) {
      requireLogInSnakeBar();
      throw new Error("No signer available");
    }

    const result = await mintNftOnMarketplace(nft, signer);
    console.log(result);

    return result;
  } catch (error) {
    console.error("Error minting NFT:", error);
    throw error;
  }
}

export async function listNft(
  signer: ethers.Signer,
  contractAddress: string,
  tokenId: ethers.BigNumberish,
  marketItemId: ethers.BigNumberish,
  price: string
) {
  try {
    if (!signer) {
      throw new Error("No signer available");
    }

    // Get marketplace address
    const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;
    if (!marketplaceAddress || !ethers.isAddress(marketplaceAddress)) {
      throw new Error("Invalid marketplace address");
    }
    const result = listMarketItem(signer, contractAddress, tokenId, marketItemId, price);
    return result;
  } catch (error) {
    console.error("Error minting NFT:", error);
    throw error;
  }
}

export async function buyNft(
  signer: ethers.Signer,
  contractAddress: string,
  tokenId: ethers.BigNumberish,
  marketItemId: ethers.BigNumberish
) {
  try {
    if (!signer) {
      throw new Error("No signer available");
    }

    if (toBigInt(marketItemId) < 0) {
      throw new Error("Invalid tokenid");
    }
    const balance = await signer.provider?.getBalance(await signer.getAddress());
    if (!balance) return;
    console.log("Balance before transaction:", ethers.formatEther(balance));
    const result = await buyMarketItem(signer, contractAddress, tokenId);
    const balance2 = await signer.provider?.getBalance(await signer.getAddress());
    if (!balance2) return;
    console.log("Balance after transaction:", ethers.formatEther(balance2));
    return result;
  } catch (error) {
    console.error("Error minting NFT:", error);
    throw error;
  }
}

export async function getAllDeployedCollections(signer: ethers.Signer) {
  try {
    if (!signer) {
      throw new Error("No signer available");
    }
    const result = getAllCollectionsDeployedByMe(signer);
    return result;
  } catch (error) {
    console.error("Error minting NFT:", error);
    throw error;
  }
}

export const deployCollection = async (collection: CollectionFormType, signer: ethers.Signer) => {
  try {
    if (!signer) {
      throw new Error("Please connect your wallet");
    }

    if (!collection) {
      throw new Error("Collection data is required");
    }

    if (!collection.image) throw new Error("Collection data is required");

    const imageUrl = await uploadCollectionImageToPinata(collection.image);

    // Deploy the collection
    const deployedCollection = await deployCollectionService(collection.name, collection.symbol, imageUrl, signer);
    console.log(deployedCollection);
    return deployedCollection;
  } catch (error) {
    console.error("Error deploying collection:", error);
    throw error;
  }
};

export const getMarketItemByCollection = async (signer: ethers.Signer, collectionAddress: string) => {
  try {
    if (!signer) {
      throw new Error("Please connect your wallet");
    }

    if (!collectionAddress) {
      throw new Error("Collection data is required");
    }

    return getMarketItemByCollectionWithMetadata(signer, collectionAddress);
  } catch (error) {
    console.error("Error deploying collection:", error);
    throw error;
  }
};

export const getCollectionDetails = async (signer: ethers.Signer, collectionAddress: string) => {
  try {
    if (!signer) {
      throw new Error("Please connect your wallet");
    }

    if (!collectionAddress) {
      throw new Error("Collection data is required");
    }

    const result = await getCollectionInformation(signer, collectionAddress);
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error deploying collection:", error);
    throw error;
  }
};

export const getTokenDetailsByCollectionAndTokenId = async (
  collectionId: string,
  tokenId: string,
  signer: ethers.Signer
) => {
  if (!signer) {
    throw new Error("Please connect your wallet");
  }

  if (!collectionId) {
    throw new Error("Collection data is required");
  }

  if (!tokenId) {
    throw new Error("TokenId data is required");
  }

  try {
    const result = await getTokenDetails(collectionId, tokenId, signer);
    return result;
  } catch (error) {
    console.error("Error fetching nft's details:", error);
  }
};

export const getCollectionsInMarketplace = async (signer: ethers.Signer) => {
  if (!signer) {
    throw new Error("Please connect your wallet");
  }

  try {
    const result = getCollections(signer);
    return result;
  } catch (error) {
    console.error("Error fetching all collections:", error);
  }
};
