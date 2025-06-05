"use server";
import { pinata } from "@/utils/config";
import { Nft } from "../api/nft";

export async function uploadCollectionImageToPinata(image: File): Promise<string> {
  try {
    // Upload to Pinata
    const { cid } = await pinata.upload.public.file(image);
    console.log(cid);
    const url = await pinata.gateways.public.convert(cid);
    return url;
  } catch (error) {
    console.error("Error uploading file to Pinata:", error);
    throw new Error("Failed to upload file to Pinata");
  }
}

/**
 * Uploads a file to Pinata and returns its IPFS URL
 */
async function uploadFileToPinata(nft: Nft): Promise<string> {
  try {
    // Upload to Pinata
    const { cid } = await pinata.upload.public.file(nft.image);
    console.log(cid);
    const url = await pinata.gateways.public.convert(cid);
    nft.imageUrl = url;
    return url;
  } catch (error) {
    console.error("Error uploading file to Pinata:", error);
    throw new Error("Failed to upload file to Pinata");
  }
}

/**
 * Uploads NFT metadata to Pinata following OpenSea standards
 */
async function uploadNFTMetadata(nft: Nft): Promise<string> {
  try {
    const { cid } = await pinata.upload.public.json(nft);
    const url = await pinata.gateways.public.convert(cid);
    nft.metadataUrl = url;
    return url;
  } catch (error) {
    console.error("Error uploading metadata to Pinata:", error);
    throw new Error("Failed to upload metadata to Pinata");
  }
}

/**
 * Creates and uploads a complete NFT to Pinata
 * 1. Uploads the image first
 * 2. Creates metadata with the image URL
 * 3. Uploads the metadata
 * Returns the metadata URL
 */
export async function createNFTOnPinata(nft: Nft): Promise<string> {
  try {
    // 1. Upload the image
    console.log(nft.image);
    const imageUrl = await uploadFileToPinata(nft);
    console.log("IMAGE --->");
    console.log(imageUrl);

    // 3. Upload metadata
    const metadataUrl = await uploadNFTMetadata(nft);
    console.log("METADATA --->");
    console.log(metadataUrl);
    return metadataUrl;
  } catch (error) {
    console.error("Error creating NFT on Pinata:", error);
    throw new Error("Failed to create NFT on Pinata");
  }
}
