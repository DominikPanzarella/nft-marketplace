import { ethers } from "ethers";
import { NFTFactory__factory } from "@/typechain-types/factories/contracts/NftFactory.sol/NFTFactory__factory";
import { retrieveAllCollections } from "@/lib/api/marketplace";
import { Collection } from "@/app/nft/collection/deploy/(collection form)/deploy-collection-form";

export const getCollections = async (signer: ethers.Signer) =>
  retrieveAllCollections(signer)
    .then((collections) =>
      collections.reduce((acc, current) => {
        const exists = acc.find((item) => item.address === current.address);
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, [] as Collection[])
    )
    .catch((error) => {
      console.error("Error fetching collections:", error);
      throw new Error("Failed to fetch collections");
    });

export async function getAllCollectionsDeployedByMe(signer: ethers.Signer): Promise<Collection[]> {
  try {
    if (!process.env.NEXT_PUBLIC_NFT_FACTORY_ADDRESS) {
      throw new Error("NFT Factory address not configured in environment variables");
    }

    const nftFactory = NFTFactory__factory.connect(process.env.NEXT_PUBLIC_NFT_FACTORY_ADDRESS, signer);
    const collections: Collection[] = [];

    // Get all deployed NFTs
    const deployedNFTs = await nftFactory.getDeployedNFTs();
    console.log("Found", deployedNFTs.length, "deployed NFTs");

    // Iterate through all collections
    for (const nftAddress of deployedNFTs) {
      console.log(nftAddress);
      const nftContract = new ethers.Contract(
        nftAddress,
        [
          "function name() view returns (string)",
          "function symbol() view returns (string)",
          "function baseURI() view returns (string)",
          "function deployer() view returns (address)",
          "function getCollectionImageUri() view returns (string)",
        ],
        signer
      );

      try {
        const name = await nftContract.name();
        const symbol = await nftContract.symbol();
        const imageUrl = await nftContract.getCollectionImageUri();
        const deployer = await nftContract.deployer();
        const signerAddress = await signer.getAddress();
        console.log(deployer);
        console.log(signerAddress);
        if (deployer == signerAddress) {
          collections.push({
            address: nftAddress,
            name,
            symbol,
            imageUrl,
          });
        }
      } catch (error) {
        console.warn(`Failed to get details for collection at ${nftAddress}:`, error);
      }
    }

    return collections;
  } catch (error) {
    console.error("Error getting collections:", error);
    if (error instanceof Error) {
      if (error.message.includes("network")) {
        throw new Error("Failed to connect to network. Please check your node is running.");
      }
      throw new Error(`Failed to get collections: ${error.message}`);
    }
    throw new Error("Failed to get collections: Unknown error");
  }
}

export async function getCollectionInformation(signer: ethers.Signer, collectionAddress: string): Promise<Collection> {
  try {
    if (!process.env.NEXT_PUBLIC_NFT_FACTORY_ADDRESS) {
      throw new Error("NFT Factory address not configured in environment variables");
    }

    const nftFactory = NFTFactory__factory.connect(process.env.NEXT_PUBLIC_NFT_FACTORY_ADDRESS, signer);
    let nft = {} as Collection;

    // Get all deployed NFTs
    const deployedNFTs = await nftFactory.getDeployedNFTs();
    console.log("Found", deployedNFTs.length, "deployed NFTs");

    // Iterate through all collections
    for (const nftAddress of deployedNFTs) {
      console.log(nftAddress);
      const nftContract = new ethers.Contract(
        nftAddress,
        [
          "function name() view returns (string)",
          "function symbol() view returns (string)",
          "function baseURI() view returns (string)",
          "function deployer() view returns (address)",
          "function getCollectionImageUri() view returns (string)",
        ],
        signer
      );

      try {
        const name = await nftContract.name();
        const symbol = await nftContract.symbol();
        const imageUri = await nftContract.getCollectionImageUri();
        const deployer = await nftContract.deployer();
        const signerAddress = await signer.getAddress();
        console.log(deployer);
        console.log(signerAddress);
        if (nftAddress == collectionAddress) {
          nft = {
            address: nftAddress,
            name,
            symbol,
            imageUrl: imageUri,
          };
        }
      } catch (error) {
        console.warn(`Failed to get details for collection at ${nftAddress}:`, error);
      }
    }

    return nft;
  } catch (error) {
    console.error("Error getting collections:", error);
    if (error instanceof Error) {
      if (error.message.includes("network")) {
        throw new Error("Failed to connect to network. Please check your node is running.");
      }
      throw new Error(`Failed to get collections: ${error.message}`);
    }
    throw new Error("Failed to get collections: Unknown error");
  }
}

/**
 * Deploys a new NFT collection using NftFactory
 */
export async function deployCollection(
  name: string,
  symbol: string,
  imageUrl: string,
  signer: ethers.Signer
): Promise<Collection & { blockNumber: number; timestamp: number }> {
  try {
    if (!process.env.NEXT_PUBLIC_NFT_FACTORY_ADDRESS) {
      throw new Error("NFT Factory address not configured in environment variables");
    }

    if (!signer.provider) {
      throw new Error("No provider available");
    }

    console.log("Connecting to NFT Factory at:", process.env.NEXT_PUBLIC_NFT_FACTORY_ADDRESS);

    // Get user balance
    const userAddress = await signer.getAddress();
    const userBalance = await signer.provider.getBalance(userAddress);
    console.log("User Balance (ETH): ", ethers.formatEther(userBalance));

    // Get the contract factory
    const nftFactory = NFTFactory__factory.connect(process.env.NEXT_PUBLIC_NFT_FACTORY_ADDRESS, signer);

    // Estimate the total cost using the provider's estimateGas
    const gasEstimate = await nftFactory.createNFTContract.estimateGas(name, symbol, imageUrl);
    console.log("Gas Estimate:", gasEstimate.toString());

    // Get current gas price
    const gasPrice = await signer.provider.getFeeData();
    console.log("Gas Price Data:", {
      maxFeePerGas: gasPrice.maxFeePerGas?.toString(),
      maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas?.toString(),
      gasPrice: gasPrice.gasPrice?.toString(),
    });

    // Calculate total cost
    const totalCost = gasEstimate * (gasPrice.maxFeePerGas || gasPrice.gasPrice || 0n);
    console.log("Total Cost (wei):", totalCost.toString());
    console.log("Total Cost (ETH):", ethers.formatEther(totalCost));

    // Check if user has enough balance
    if (userBalance < totalCost) {
      throw new Error(
        `Insufficient funds. Required: ${ethers.formatEther(totalCost)} ETH, Available: ${ethers.formatEther(userBalance)} ETH`
      );
    }

    // Proceed with deployment
    console.log("Creating NFT contract with name:", name, "and symbol:", symbol);
    const tx = await nftFactory.createNFTContract(name, symbol, imageUrl, {
      maxFeePerGas: gasPrice.maxFeePerGas,
      maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas,
    });

    console.log("Transaction sent:", tx.hash);

    const receipt = await tx.wait();
    console.log("Transaction mined in block:", receipt?.blockNumber);

    // Get the deployed contract address from the event
    const event = receipt?.logs.find(
      (log) => log.topics[0] === nftFactory.interface.getEvent("NFTContractCreated").topicHash
    );

    if (!event) {
      throw new Error("Failed to get deployed contract address from transaction logs");
    }

    const decodedEvent = nftFactory.interface.decodeEventLog("NFTContractCreated", event.data, event.topics);

    const address = decodedEvent.nftAddress;
    console.log("NFT contract deployed at:", address);

    return {
      address,
      name,
      symbol,
      imageUrl,
      blockNumber: receipt?.blockNumber || 0,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Error deploying collection:", error);
    if (error instanceof Error) {
      if (error.message.includes("network")) {
        throw new Error("Failed to connect to network. Please check your node is running.");
      }
      throw new Error(`Failed to deploy collection: ${error.message}`);
    }
    throw new Error("Failed to deploy collection: Unknown error");
  }
}
