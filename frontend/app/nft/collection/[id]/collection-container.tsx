"use client";

import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { getCollectionDetails, getMarketItemByCollection } from "@/app/nft/clientsideactions";
import { ethers } from "ethers";
import NftCard from "@/app/marketplace/(cards)/nft-card";
import { CircularProgress } from "@heroui/react";
import Image from "next/image";

const CollectionContainer = ({ collectionId }: { collectionId: string }) => {
  const { signer } = useAuth();

  const {
    data: nfts = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: [collectionId],
    queryFn: () => getMarketItemByCollection(signer as ethers.Signer, collectionId),
    enabled: !!signer,
    refetchInterval: 5000,
  });

  const {
    data: collection = null,
    error: collectionError,
    isLoading: collectionLoading,
  } = useQuery({
    queryKey: ["collection-details", collectionId],
    queryFn: () => getCollectionDetails(signer as ethers.Signer, collectionId),
    enabled: !!signer,
    refetchInterval: 5000,
  });

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(collectionId);
  };

  if (isLoading || collectionLoading) {
    return <CircularProgress size="lg" />;
  }

  if (error || collectionError) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-xl text-red-500">{error?.message || collectionError?.message}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Collection Banner */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <Image
          src={collection?.imageUrl || "/placeholder-collection.jpg"}
          alt="Collection Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />

        {/* Collection Info */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <div className="max-w-2xl text-center">
            <h1 className="text-5xl font-bold text-white">{collection?.name || "Collection NFTs"}</h1>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="rounded-full bg-white/10 px-4 py-1 text-lg text-white">
                {collection?.symbol || "NFT"}
              </span>
              <button
                onClick={handleCopyAddress}
                className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-lg text-white transition-colors hover:bg-white/20"
              >
                <span className="font-mono">
                  {collectionId.slice(0, 6)}...{collectionId.slice(-4)}
                </span>
              </button>
            </div>
            <p className="mt-6 text-xl text-gray-200">{nfts.length} NFTs available</p>
          </div>
        </div>
      </div>

      {/* NFTs Grid */}
      <div className="w-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {nfts.length === 0 ? (
            <div className="flex h-[50vh] items-center justify-center">
              <div className="text-xl text-gray-500">No NFTs found in this collection</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {nfts.map((nft) => (
                <NftCard nft={nft} key={nft.tokenId} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionContainer;
