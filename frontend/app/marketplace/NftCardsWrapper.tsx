"use client";

import React from "react";
import { Nft } from "@/lib/api/nft";
import NftCard from "@/app/marketplace/(cards)/nft-card";
import { CircularProgress } from "@heroui/react";

type NftCardsWrapperProps = {
  data?: Nft[];
  isLoading?: boolean;
  error?: any;
};

const NftCardsWrapper = ({ data, isLoading, error }: NftCardsWrapperProps) => {
  if (data?.length === 0) {
    return <div className="p-4 text-center text-gray-500">No NFTs found</div>;
  }
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <CircularProgress size="lg" />
      </div>
    );
  }
  if (error) {
    return <div className="p-4 text-center text-red-500">{error.message}</div>;
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data?.map((item) => {
        if (item?.marketPlace?.tokenId === undefined || !item?.marketPlace?.nftContractAddress) {
          return null;
        }
        return <NftCard key={`${item?.marketPlace?.nftContractAddress}-${item.marketPlace.tokenId}`} nft={item} />;
      })}
    </div>
  );
};

export default NftCardsWrapper;
