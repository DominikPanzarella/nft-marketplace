"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/AuthProvider";
import { SectionContainer } from "@/lib/components/common/section-container";
import { HeroSecondary } from "@/lib/components/common/hero-secondary";
import NftCard from "@/app/marketplace/(cards)/nft-card";
import { retrieveAllMyNftsWithMetadata } from "@/app/users/actions";

const DisplayMyNft = () => {
  const { signer } = useAuth();

  const {
    data: nfts = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["ownedNfts"],
    queryFn: async () => {
      if (!signer) throw new Error("No signer available");
      return await retrieveAllMyNftsWithMetadata(signer);
    },
    enabled: !!signer,
    refetchInterval: 5000,
    staleTime: 0,
  });

  return (
    <SectionContainer>
      <HeroSecondary subtitle="Manage your NFT collection!" title="My NFTs"></HeroSecondary>
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="p-4 text-center text-red-500">{error.message}</div>
      ) : nfts.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No NFTs found in your collection</div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {nfts.map((nft) => (
            <NftCard key={`${nft?.marketPlace?.nftContractAddress}-${nft?.tokenId}`} nft={nft} />
          ))}
        </div>
      )}
    </SectionContainer>
  );
};

export default DisplayMyNft;
