"use client";

import React from "react";
import CollectionForm, { CollectionFormType } from "./deploy-collection-form";
import { deployCollection } from "@/app/nft/clientsideactions";
import { useAuth } from "@/components/AuthProvider";

const DeployCollectionWrapper = () => {
  const { signer } = useAuth();

  if (!signer || !signer.getAddress) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl text-red-500">Plase connect you wallet</div>
      </div>
    );
  }

  const handleSubmit = async (newCollection: CollectionFormType) => {
    if (!signer) {
      throw new Error("No signer available");
    }

    return await deployCollection(newCollection, signer);
  };

  return <CollectionForm values={{}} onSubmit={handleSubmit} />;
};

export default DeployCollectionWrapper;
