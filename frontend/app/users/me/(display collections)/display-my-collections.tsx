"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/AuthProvider";
import CollectionCard from "../(cards)/collection-card";
import { SectionContainer } from "@/lib/components/common/section-container";
import { HeroSecondary } from "@/lib/components/common/hero-secondary";
import { retrieveMyCollections } from "../../actions";

const DisplayMyCollections = () => {
  const { signer } = useAuth();

  const {
    data: collections = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["mine-collections"],
    queryFn: async () => {
      if (!signer) throw new Error("No signer available");
      return await retrieveMyCollections(signer);
    },
    enabled: !!signer,
    refetchInterval: 5000,
    staleTime: 0,
  });

  return (
    <SectionContainer>
      <HeroSecondary subtitle="Manage your NFT collections!" title="My Collections"></HeroSecondary>
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="p-4 text-center text-red-500">{error.message}</div>
      ) : collections.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No collections found</div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <CollectionCard key={collection.address} collection={collection} />
          ))}
        </div>
      )}
    </SectionContainer>
  );
};

export default DisplayMyCollections;
