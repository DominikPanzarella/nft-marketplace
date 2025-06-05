"use client";
import { ethers } from "ethers";
import { Nft, NftMarketplaceDetails, retrieveMetadataByTokenId } from "@/lib/api/nft";
import { MarketplaceRegistry__factory, NFT__factory } from "@/typechain-types";
import { addToast } from "@heroui/react";
import { Collection } from "@/app/nft/collection/deploy/(collection form)/deploy-collection-form";

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  status: "success" | "failed";
}

export async function retrieveAllCollections(signer: ethers.Signer): Promise<Collection[]> {
  try {
    // Get marketplace address and verify it's valid
    const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as string;
    if (!marketplaceAddress || !ethers.isAddress(marketplaceAddress)) {
      throw new Error("Invalid marketplace address");
    }

    // Create MarketplaceRegistry contract instance using factory
    const marketplaceRegistry = MarketplaceRegistry__factory.connect(marketplaceAddress, signer);

    console.log("here");
    // Get all unique contract addresses
    const contractAddresses = await marketplaceRegistry.getAllContractsAddress();

    // For each collection, get its details
    const collections: Collection[] = [];
    for (const address of contractAddresses) {
      try {
        const nftContract = new ethers.Contract(address, NFT__factory.abi, signer);
        const name = await nftContract.name();
        const symbol = await nftContract.symbol();
        const imageUri = await nftContract.getCollectionImageUri();

        collections.push({
          address,
          name,
          symbol,
          imageUrl: imageUri,
        });
      } catch (error) {
        console.error(`Error fetching collection details for ${address}:`, error);
        // Continue with next collection
      }
    }

    return collections;
  } catch (error) {
    console.error("Error retrieving collections:", error);
    throw error;
  }
}

export const convertToMarketItem = (marketItemRaw: any): NftMarketplaceDetails => ({
  marketItemId: marketItemRaw.marketItemId,
  nftContractAddress: marketItemRaw.nftContractAddress,
  tokenId: marketItemRaw.tokenId,
  creator: marketItemRaw.creator,
  seller: marketItemRaw.seller,
  owner: marketItemRaw.owner,
  price: marketItemRaw.price,
  sold: marketItemRaw.sold,
  canceled: marketItemRaw.canceled,
  list: marketItemRaw.list,
});

export async function retreiveAllMarketItems(signer: ethers.Signer): Promise<NftMarketplaceDetails[]> {
  try {
    const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;
    if (!marketplaceAddress || !ethers.isAddress(marketplaceAddress)) {
      throw new Error("Invalid marketplace address");
    }
    // Create MarketplaceRegistry contract instance using factory
    const marketplaceRegistry = MarketplaceRegistry__factory.connect(marketplaceAddress, signer);
    const allItems = await marketplaceRegistry?.retrieveAllMarketItems();

    const items: NftMarketplaceDetails[] = [];
    for (const marketItemRaw of allItems) {
      const formattedMarketItem: NftMarketplaceDetails = convertToMarketItem(marketItemRaw);
      items.push(formattedMarketItem);
    }
    return items;
  } catch (error) {
    console.error("Error retrieving market items:", error);
    throw error;
  }
}

export const retrieveMarketItemByCollectionAndTokenId = async (
  signer: ethers.Signer,
  collection: string,
  tokenId: string | number | bigint
) => {
  try {
    // Get marketplace address and verify it's valid
    const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;
    if (!marketplaceAddress || !ethers.isAddress(marketplaceAddress)) {
      throw new Error("Invalid marketplace address");
    }

    // Create MarketplaceRegistry contract instance using factory
    const marketplaceRegistry = MarketplaceRegistry__factory.connect(marketplaceAddress, signer);

    // Convert tokenId to number for comparison
    const tokenIdNumber = Number(tokenId);

    // Retrieve all market items
    const allItems = await marketplaceRegistry.retrieveAllMarketItems();

    // Filter item based on collection and tokenId
    const marketItem = allItems.find((item: any) => {
      return item.nftContractAddress === collection && Number(item.tokenId) === tokenIdNumber;
    });

    const found = !!marketItem;

    return {
      marketItem,
      found,
    };
  } catch (error) {
    console.error("Error retrieving market item:", error);
    throw error;
  }
};

export const approveAndListMarketItem = async (
  signer: ethers.Signer,
  nftContractAddress: string,
  marketItemId: ethers.BigNumberish
) => {
  const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;

  // 1. Crea l'istanza del contratto NFT
  const nftContract = new ethers.Contract(
    nftContractAddress,
    ["function approve(address to, uint256 tokenId)"],
    signer
  );

  // 2. Approva il marketplace a gestire l'NFT
  const approveTx = await nftContract.approve(marketplaceAddress, marketItemId);
  await approveTx.wait();
  return true;
  // 3. Ora puoi chiamare listMarketItem
  //return await listMarketItem(signer, marketItemId, price);
};

export const listMarketItem = async (
  signer: ethers.Signer,
  contractAddress: string,
  tokenId: ethers.BigNumberish,
  marketItemId: ethers.BigNumberish,
  priceInEth: string // Price in ETH as string to support decimals (e.g., "1.5" for 1.5 ETH)
) => {
  if (!signer.provider) throw new Error("Signer must be connected to a provider");
  const userAddress = await signer.getAddress();

  // Validate price format and convert to wei
  let priceInWei;
  try {
    priceInWei = ethers.parseUnits(priceInEth, 18); // 18 decimals for ETH
    if (priceInWei <= 0n) {
      throw new Error("Price must be greater than 0");
    }
  } catch {
    throw new Error("Invalid price format. Use numbers with up to 18 decimal places (e.g., '1.5' or '0.001')");
  }

  const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;
  if (!marketplaceAddress || !ethers.isAddress(marketplaceAddress)) {
    throw new Error("Invalid marketplace address");
  }
  const marketplaceRegistry = MarketplaceRegistry__factory.connect(marketplaceAddress, signer);

  // Get listing fee in wei
  const listingFee = await marketplaceRegistry.getListingFee();

  // Check user's balance in wei
  const userBalance = await signer.provider.getBalance(userAddress);

  // Need to be done before any operations
  await approveAndListMarketItem(signer, contractAddress, tokenId);

  // Estimate gas in wei
  const estimatedGas = await marketplaceRegistry.listMarketItem.estimateGas(marketItemId, priceInWei, {
    value: listingFee,
  });

  const feeData = await signer.provider.getFeeData();

  // Calculate gas cost in wei
  const gasCost = feeData.maxFeePerGas
    ? estimatedGas * (feeData.maxFeePerGas + (feeData.maxPriorityFeePerGas || 0n))
    : estimatedGas * (feeData.gasPrice || 0n);

  console.log("User Balance (wei)(before): ", userBalance);
  console.log("Gas cost(wei): ", gasCost);
  // Total cost in wei
  const totalCost = listingFee + gasCost;

  if (userBalance < totalCost) {
    throw new Error(
      `Insufficient funds. Required: ${ethers.formatUnits(totalCost, 18)} ETH (Fee: ${ethers.formatUnits(listingFee, 18)} + Gas: ~${ethers.formatUnits(gasCost, 18)}), Available: ${ethers.formatUnits(userBalance, 18)} ETH`
    );
  }

  console.log("Controllo fondi superato. Procedo...");

  try {
    const tx = await marketplaceRegistry.listMarketItem(marketItemId, priceInWei, {
      value: listingFee,
      gasLimit: estimatedGas,
      ...(feeData.maxFeePerGas
        ? {
            maxFeePerGas: feeData.maxFeePerGas,
            maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
          }
        : {
            gasPrice: feeData.gasPrice,
          }),
    });

    await tx.wait();

    console.log("User Balance (wei)(after): ", signer.provider.getBalance(userAddress));
  } catch (error: any) {
    console.error("Transaction failed:", error);
    throw new Error("Listing failed: " + (error?.reason || error?.message || "Unknown error"));
  }

  const m = await marketplaceRegistry.retrieveByMarketplaceTokenId(marketItemId);
  return convertToMarketItem(m);
};

export const buyMarketItem = async (
  signer: ethers.Signer,
  nftContractAddress: string,
  tokenId: ethers.BigNumberish
) => {
  if (!signer.provider) throw new Error("Signer must be connected to a provider");
  const userAddress = await signer.getAddress();

  const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;
  if (!marketplaceAddress || !ethers.isAddress(marketplaceAddress)) {
    throw new Error("Invalid marketplace address");
  }

  const marketplaceRegistry = MarketplaceRegistry__factory.connect(marketplaceAddress, signer);

  // Get the market item to check price and status
  const [marketItemRaw, found] = await marketplaceRegistry.retrieveMarketItemByCollectionAndTokenId(
    nftContractAddress,
    tokenId
  );
  if (!found) {
    throw new Error("Market item not found");
  }
  const marketItem = convertToMarketItem(marketItemRaw);

  // Log market item details
  console.log("Market item details:", marketItem);

  // Validate item status
  //if (!marketItem.list) throw new Error("Item is not listed for sale");
  //if (marketItem.sold) throw new Error("Item is already sold");
  if (marketItem.canceled) throw new Error("Item is canceled");
  if (marketItem.seller === userAddress) throw new Error("You cannot buy your own item");

  // Price is already in wei from the contract
  const priceInWei = marketItem.price;

  // Get listing fee in wei
  const listingFee = await marketplaceRegistry.getListingFee();
  const totalPayment = BigInt(priceInWei); // Total payment is just the price, listing fee is handled by contract

  // Check user's balance in wei
  const userBalance = await signer.provider.getBalance(userAddress);
  console.log("User balance(before):", ethers.formatUnits(userBalance, 18), "ETH");
  if (userBalance < totalPayment) {
    addToast({
      title: "error",
      description: "Insufficient funds",
      color: "danger",
    });
    throw new Error(
      `Insufficient funds. Required: ${ethers.formatUnits(totalPayment, 18)} ETH, Available: ${ethers.formatUnits(userBalance, 18)} ETH`
    );
  }

  try {
    // Estimate gas for the transaction
    const estimatedGas = await marketplaceRegistry.createMarketSale.estimateGas(
      nftContractAddress,
      marketItem.marketItemId,
      { value: priceInWei }
    );

    // Add a 20% buffer to the estimated gas to account for potential variations
    const gasLimit = Math.floor(Number(estimatedGas) * 1.2);

    console.log("Executing buy transaction with price:", ethers.formatUnits(priceInWei, 18), "ETH");
    console.log("Listing fee:", ethers.formatUnits(listingFee, 18), "ETH");
    console.log("Estimated gas:", estimatedGas.toString());
    console.log("Gas limit with buffer:", gasLimit);
    const userBalanceAfter = await signer.provider.getBalance(userAddress);
    console.log("User balance(after):", ethers.formatUnits(userBalanceAfter, 18), "ETH");

    const tx = await marketplaceRegistry.createMarketSale(nftContractAddress, marketItem.marketItemId, {
      value: priceInWei,
      gasLimit: gasLimit,
    });

    console.log("Transaction hash:", tx.hash);
    const receipt = await tx.wait();
    console.log("Transaction confirmed. Gas used:", receipt?.gasUsed?.toString() || "unknown");

    // Return the updated market item
    const [updatedItem, exists] = await marketplaceRegistry.retrieveMarketItemByCollectionAndTokenId(
      nftContractAddress,
      tokenId
    );
    if (!exists) {
      throw new Error("Market item not found after purchase");
    }
    return convertToMarketItem(updatedItem);
  } catch (error: any) {
    console.error("Transaction failed:", error);
    addToast({
      title: "error",
      description: "Error buying NFT: " + (error?.reason || error?.message || "Unknown error"),
      color: "danger",
    });
    throw new Error("Buy failed: " + (error?.reason || error?.message || "Unknown error"));
  }
};

export const unlistMarketItem = async (
  signer: ethers.Signer,
  nftContractAddress: string,
  tokenId: ethers.BigNumberish,
  marketItemId: ethers.BigNumberish
) => {
  if (!signer.provider) throw new Error("Signer must be connected to a provider");
  const userAddress = await signer.getAddress();

  const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;
  if (!marketplaceAddress || !ethers.isAddress(marketplaceAddress)) {
    throw new Error("Invalid marketplace address");
  }

  const marketplaceRegistry = MarketplaceRegistry__factory.connect(marketplaceAddress, signer);

  // Get the market item to check status and ownership
  const marketItemRaw = await marketplaceRegistry.retrieveMarketItemByCollectionAndTokenId(nftContractAddress, tokenId);
  const marketItem = convertToMarketItem(marketItemRaw[0]);
  console.log(marketItemRaw);
  console.log(userAddress);
  console.log(marketItem.seller);
  // Validate item status and ownership
  if (marketItem.seller !== userAddress) throw new Error("Only the seller can unlist the item");

  try {
    // Estimate gas for the transaction
    const estimatedGas = await marketplaceRegistry.cancelMarketItem.estimateGas(nftContractAddress, marketItemId);

    const feeData = await signer.provider.getFeeData();

    // Execute the unlist transaction
    const tx = await marketplaceRegistry.unlistMarketItem(nftContractAddress, marketItemId, {
      gasLimit: estimatedGas,
      ...(feeData.maxFeePerGas
        ? {
            maxFeePerGas: feeData.maxFeePerGas,
            maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
          }
        : {
            gasPrice: feeData.gasPrice,
          }),
    });

    await tx.wait();

    // Return the updated market item
    const updatedItem = await marketplaceRegistry.retrieveByMarketplaceTokenId(marketItemId);
    return convertToMarketItem(updatedItem);
  } catch (error: any) {
    console.error("Transaction failed:", error);
    throw new Error("Unlist failed: " + (error?.reason || error?.message || "Unknown error"));
  }
};

export const getNftTransactions = async (
  signer: ethers.Signer,
  nftContractAddress: string,
  tokenId: ethers.BigNumberish
): Promise<Transaction[]> => {
  if (!signer.provider) throw new Error("Signer must be connected to a provider");
  try {
    const currentBlock = await signer.provider.getBlockNumber();
    const fromBlock = 0;

    const transactions = await signer.provider.getLogs({
      fromBlock,
      toBlock: currentBlock,
      address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS,
      topics: [
        [ethers.id("MarketItemSold(uint256,address,uint256,address,address,uint256)")],
        null,
        null,
        ethers.zeroPadValue(nftContractAddress, 32),
        ethers.zeroPadValue(ethers.toBeHex(tokenId), 32),
      ],
    });

    return await Promise.all(
      transactions.map(async (log) => {
        const tx = await signer.provider!.getTransaction(log.transactionHash);
        const receipt = await signer.provider!.getTransactionReceipt(log.transactionHash);

        return {
          hash: log.transactionHash,
          from: tx?.from || "",
          to: tx?.to || "",
          value: ethers.formatEther(tx?.value || 0),
          timestamp: (await signer.provider!.getBlock(tx?.blockNumber || 0))?.timestamp as number,
          status: receipt?.status === 1 ? ("success" as const) : ("failed" as const),
        };
      })
    );
  } catch (error) {
    console.error("Error fetching NFT transactions:", error);
    throw error;
  }
};

export const getMarketItemWithMetadata = async (signer: ethers.Signer): Promise<Nft[]> => {
  const nftMarketplaceDetails = await retreiveAllMarketItems(signer);

  if (!nftMarketplaceDetails) {
    throw new Error("No market items found");
  }

  return await Promise.all(
    nftMarketplaceDetails.map(async (item) => {
      try {
        const metadata = await retrieveMetadataByTokenId(item.nftContractAddress, signer, item.tokenId.toString());
        if (metadata.metadataUrl) {
          const response = await fetch(metadata.metadataUrl);
          const nftBaseDetails = await response.json();
          return { marketPlace: item, ...nftBaseDetails };
        }
        return {
          ...metadata,
          marketPlace: item,
          traits: [],
          image: {},
        };
      } catch (error) {
        console.error(`Error fetching metadata for token ${item.tokenId}:`, error);
        return {} as Nft;
      }
    })
  );
};

export const getMarketItemByCollectionWithMetadata = async (
  signer: ethers.Signer,
  collectionAddress: string
): Promise<Nft[]> => {
  const items = await retreiveAllMarketItems(signer);

  const items_by_collection = items.filter((element) => element.nftContractAddress == collectionAddress);

  return await Promise.all(
    items_by_collection.map(async (item) => {
      try {
        const metadata = await retrieveMetadataByTokenId(item.nftContractAddress, signer, item.tokenId.toString());

        if (metadata.metadataUrl) {
          const response = await fetch(metadata.metadataUrl);
          const nftBaseDetails = await response.json();
          return { marketPlace: item, ...nftBaseDetails };
        }
        return {
          ...metadata,
          marketPlace: item,
          traits: [],
          image: {},
        };
      } catch (error) {
        console.error(`Error fetching metadata for token ${item.tokenId}:`, error);
        return {} as Nft;
      }
    })
  );
};

export const getAllMyNftsWithMetadata = async (signer: ethers.Signer): Promise<Nft[]> => {
  if (!signer.provider) throw new Error("Signer must be connected to a provider");
  const items = await retreiveAllMarketItems(signer);
  const myAddress = await signer.getAddress();
  const myItems = items.filter((element) => element.seller == myAddress);
  return await Promise.all(
    myItems.map(async (item) => {
      try {
        const metadata = await retrieveMetadataByTokenId(item.nftContractAddress, signer, item.tokenId.toString());

        if (metadata.metadataUrl) {
          const response = await fetch(metadata.metadataUrl);
          const nftBaseDetails = await response.json();
          return { marketPlace: item, ...nftBaseDetails };
        }
        return {
          ...metadata,
          marketPlace: item,
          traits: [],
          image: {},
        };
      } catch (error) {
        console.error(`Error fetching metadata for token ${item.tokenId}:`, error);
        return {} as Nft;
      }
    })
  );
};
