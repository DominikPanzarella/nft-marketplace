"use client";

import React from "react";
import HeroPrimary from "@/lib/components/common/hero-primary";
import { SectionContainer } from "@/lib/components/common/section-container";
import NftFormWrapper from "@/app/nft/(form components)/nft-form-wrapper";
import { useAuth } from "@/components/AuthProvider";
const MintNFT = () => {
  const { signer } = useAuth();

  if (!signer || !signer.getAddress) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl text-red-500">Plase connect you wallet</div>
      </div>
    );
  }

  return (
    <main>
      {/* TITLE */}
      <SectionContainer>
        <HeroPrimary title="Create your own NFT"></HeroPrimary>
      </SectionContainer>

      {/* BODY */}
      <SectionContainer>
        <NftFormWrapper />
      </SectionContainer>
    </main>
  );
};

export default MintNFT;
