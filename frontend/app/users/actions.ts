"use client";

import { getAllMyNftsWithMetadata } from "@/lib/api/marketplace";
import { getAllCollectionsDeployedByMe } from "@/lib/api/collection";

import { ethers } from "ethers";

export const retrieveAllMyNftsWithMetadata = (signer: ethers.Signer) =>
  getAllMyNftsWithMetadata(signer).catch(() => {
    throw new Error("Failed to retrieve you items: ");
  });

export const retrieveMyCollections = (signer: ethers.Signer) =>
  getAllCollectionsDeployedByMe(signer).catch(() => {
    throw new Error("Failed to retrieve you items: ");
  });
