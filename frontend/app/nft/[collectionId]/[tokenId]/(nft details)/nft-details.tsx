"use client";

import Image from "next/image";
import { useAuth } from "@/components/AuthProvider";
import { ReactNode, useEffect, useState } from "react";
import { getNftTransactions, Transaction } from "@/lib/api/marketplace";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { NftMarketplaceDetails } from "@/lib/api/nft";
import { requireLogInSnakeBar } from "@/lib/utils";

export interface NftMetadata {
  name: string;
  symbol: string;
  metadataUrl: string;
  collection: string;
  tokenId: string;
  owner: string;
}

interface NftDetailsProps {
  marketItem: NftMarketplaceDetails;
  metadata: NftMetadata;
  ownerActions?: ReactNode;
}

const getNftDetails = async (metadataUrl: string): Promise<string> => {
  const response = await fetch(metadataUrl);

  if (!response.ok) {
    throw new Error("error fetch url  : " + metadataUrl);
  }

  return (await response.json()).imageUrl;
};

const NftDetails = ({ marketItem, metadata, ownerActions }: NftDetailsProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { signer } = useAuth();

  const { data: imageUrl } = useQuery({
    queryKey: [marketItem.marketItemId + "-image"],
    queryFn: async (): Promise<string> => {
      return await getNftDetails(metadata.metadataUrl);
    },
    enabled: !!signer && !!marketItem,
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!signer) {
        requireLogInSnakeBar();
        return;
      }
      setIsLoading(true);
      try {
        const tx = await getNftTransactions(signer, metadata.collection, metadata.tokenId);
        setTransactions(tx);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [signer, metadata.collection, metadata.tokenId]);

  if (!signer) {
    requireLogInSnakeBar();
    return <div className="flex h-screen items-center justify-center">Please connect you wallet</div>;
  }

  if (!marketItem || !metadata) {
    return <div className="flex h-screen items-center justify-center">No NFT data found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Left Column - Image */}
        <div className="w-full md:w-1/2">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <div className="flex h-full items-center justify-center text-gray-400">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={`${metadata.name} #${marketItem?.tokenId?.toString()}`}
                  fill
                  className="object-contain p-4"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">No image available</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Information */}
        <div className="w-full space-y-6 md:w-1/2">
          <div>
            <h1 className="mb-2 text-3xl font-bold">
              {metadata.name} #{marketItem.marketItemId?.toString()}
            </h1>
            <p className="text-gray-600">{metadata.symbol}</p>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h2 className="mb-4 text-xl font-semibold">NFT Details</h2>
              <div className="grid gap-4">
                <div>
                  <p className="text-sm text-gray-500">Collection Address</p>
                  <p className="break-all font-mono text-sm">{metadata.collection}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Token ID</p>
                  <p className="font-mono text-sm">{metadata.tokenId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Owner</p>
                  <p className="break-all font-mono text-sm">{marketItem.seller}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Metadata URI</p>
                  <p className="break-all font-mono text-sm">{metadata.metadataUrl}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h2 className="mb-4 text-xl font-semibold">Market Item Details</h2>
              <div className="grid gap-4">
                <div>
                  <p className="text-sm text-gray-500">Market Item ID</p>
                  <p className="font-mono text-sm">{marketItem.marketItemId?.toString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Creator</p>
                  <p className="break-all font-mono text-sm">{marketItem.creator}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Seller</p>
                  <p className="break-all font-mono text-sm">{marketItem.seller}</p>
                </div>
                {marketItem.list && (
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-mono text-sm">{ethers.formatEther(marketItem.price)} ETH</p>
                  </div>
                )}
                <div className="flex gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="flex gap-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          marketItem.list ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {marketItem.list ? "Listed" : "Unlisted"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Owner Actions */}
            {ownerActions}
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-semibold">Transaction History</h2>
        {isLoading ? (
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-center text-gray-500">No transactions found</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Hash</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">From</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">To</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Value</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((tx) => (
                  <tr key={tx.hash} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <a href={`#`} className="text-blue-600 hover:underline">
                        {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
                      </a>
                    </td>
                    <td className="px-4 py-2 font-mono text-sm">
                      {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                    </td>
                    <td className="px-4 py-2 font-mono text-sm">
                      {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                    </td>
                    <td className="px-4 py-2">{tx.value} ETH</td>
                    <td className="px-4 py-2">{new Date(tx.timestamp * 1000).toLocaleString()}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          tx.status === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default NftDetails;
