import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ethers } from "ethers";
import { Nft } from "@/lib/api/nft";

const NftCard = ({ nft }: { nft: Nft }) => (
  <div className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg">
    <div className="relative h-64 w-full">
      {nft?.imageUrl ? (
        <Image src={nft.imageUrl} alt={nft.name} fill className="object-cover" unoptimized />
      ) : (
        <div className="flex h-full items-center justify-center bg-gray-100">
          <span className="text-gray-400">No image available</span>
        </div>
      )}
    </div>
    <div className="p-4">
      <h3 className="mb-2 text-xl font-semibold">{nft?.name || `NFT #${nft.tokenId}`}</h3>
      {nft?.description && <p className="mb-2 line-clamp-2 text-sm text-gray-600">{nft.description}</p>}
      <p className="mb-2 text-sm text-gray-600">
        Owner: {(nft?.marketPlace?.owner ?? (nft?.owner || "")).slice(0, 6)}...
        {(nft?.marketPlace?.owner ?? (nft?.owner || "")).slice(-4)}
      </p>
      {nft?.marketPlace?.list && (
        <p className="mb-2 text-sm text-gray-600">Price: {ethers.formatEther(nft?.marketPlace?.price)} ETH</p>
      )}
      <p className="mb-2 text-sm text-gray-600">Status: {nft?.marketPlace?.list ? "For Sale" : "Not Listed"}</p>
      <Link
        href={`/nft/${nft.collection ?? nft.marketPlace?.nftContractAddress}/${nft.tokenId ?? nft.marketPlace?.tokenId}`}
        className="hover:bg-primary-dark mt-4 inline-block w-full rounded bg-primary px-4 py-2 text-center text-white transition-colors"
      >
        View NFT
      </Link>
    </div>
  </div>
);

export default NftCard;
