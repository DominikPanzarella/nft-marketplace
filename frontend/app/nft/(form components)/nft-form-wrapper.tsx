"use client";

import React from "react";
import NftForm, { NftFormType } from "@/app/nft/(form components)/nft-form";
import { useAuth } from "@/components/AuthProvider";
import { mintNft } from "../clientsideactions";
import { requireLogInSnakeBar } from "@/lib/utils";

const NftFormWrapper = () => {
  const { signer } = useAuth();

  const handleSubmit = async (newNft: NftFormType) => {
    if (!signer) {
      requireLogInSnakeBar();
      return;
    }
    return await mintNft(newNft, signer);
  };

  return <NftForm values={{}} onSubmit={handleSubmit} />;
};
export default NftFormWrapper;
