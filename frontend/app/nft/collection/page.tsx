"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { CircularProgress } from "@heroui/react";
import { getCollectionsInMarketplace } from "../clientsideactions";
import { COLLECTIONS_KEY } from "@/lib/url-keys";

const CollectionPage = () => {
  const { signer } = useAuth();

  const {
    data: collections = [],
    error,
    isLoading: loading,
  } = useQuery({
    queryKey: [COLLECTIONS_KEY],
    queryFn: () => getCollectionsInMarketplace(signer),
    enabled: !!signer,
    refetchInterval: 3000,
  });

  if (!signer || !signer.getAddress) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl text-red-500">Plase connect you wallet</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <CircularProgress size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl text-red-500">{error.message}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">Collections</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {collections?.length > 0 ? (
          collections.map((collection) => (
            <Link
              href={`/nft/collection/${collection.address}`}
              key={collection.address}
              className="group rounded-lg border p-6 transition-all hover:border-blue-500 hover:shadow-lg"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">{collection.name}</h2>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">{collection.symbol}</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Address:</span>
                  <span className="font-mono">
                    {collection.address.slice(0, 6)}...{collection.address.slice(-4)}
                  </span>
                </div>
              </div>

              <div className="mt-4 text-sm text-blue-500 group-hover:text-blue-600">View Collection →</div>
            </Link>
          ))
        ) : (
          <div className="text-xl">No collections found with nfts</div>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
