import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import NftDetails from "../(nft details)/nft-details";
import { listNft } from "@/app/nft/clientsideactions";
import { unlistMarketItem } from "@/lib/api/marketplace";
import { Button, CircularProgress } from "@heroui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getTokenDetails, NftMarketplaceDetails } from "@/lib/api/nft";
import { requireLogInSnakeBar } from "@/lib/utils";

interface NftMetadata {
  name: string;
  symbol: string;
  metadataUrl: string;
  collection: string;
  tokenId: string;
  owner: string;
}

const OwnerView = ({
  initialMarketItem,
  initialMetadata,
}: {
  initialMarketItem: NftMarketplaceDetails;
  initialMetadata: NftMetadata;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signer } = useAuth();
  const [newPrice, setNewPrice] = useState("");
  const queryClient = useQueryClient();
  const params = useParams();
  const { collectionId, tokenId } = params;

  const {
    data,
    isLoading: isQueryLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["marketItem", collectionId, tokenId],
    queryFn: async () => await getTokenDetails(collectionId as string, tokenId as string, signer),
    enabled: !!signer || !!collectionId || !!initialMarketItem?.marketItemId.toString(),
    refetchInterval: 5000, // Refetch every 5 seconds
    initialData: {
      marketItem: initialMarketItem,
      metadata: initialMetadata,
      currentAddress: signer?.getAddress() as unknown as string, //fixme type,
    },
  });

  if (!signer.getAddress()) {
    requireLogInSnakeBar();
    return <div className="flex h-screen items-center justify-center">Please connect your wallet</div>;
  }

  if (isQueryLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <CircularProgress size="lg" />
      </div>
    );
  }

  if (queryError) {
    return <div className="flex h-screen items-center justify-center text-red-500">{queryError.message}</div>;
  }

  if (!data?.marketItem || !data?.metadata) {
    return <div className="flex h-screen items-center justify-center">No NFT data found</div>;
  }

  const { marketItem, metadata } = data;

  const handleListNft = async () => {
    if (!signer) {
      requireLogInSnakeBar();
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await listNft(signer, marketItem?.nftContractAddress, marketItem?.tokenId, marketItem?.marketItemId, newPrice);
      // Invalidate both the specific token query and the market items query
      await queryClient.invalidateQueries({ queryKey: ["marketItem", collectionId, tokenId] });
      await queryClient.invalidateQueries({ queryKey: ["marketItems"] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to list NFT");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlistNft = async () => {
    if (!signer) {
      requireLogInSnakeBar();
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await unlistMarketItem(signer, metadata.collection, metadata.tokenId, marketItem.marketItemId);
      // Invalidate both the specific token query and the market items query
      await queryClient.invalidateQueries({ queryKey: ["marketItem", collectionId, tokenId] });
      await queryClient.invalidateQueries({ queryKey: ["marketItems"] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unlist NFT");
    } finally {
      setIsLoading(false);
    }
  };

  const ownerActions = (
    <div className="rounded-lg border p-4">
      <h2 className="mb-4 text-xl font-semibold">Owner Actions</h2>
      <div className="flex flex-col gap-4">
        {!marketItem.list && (
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Enter price in ETH"
              min="0.01"
              step="0.01"
              pattern="^[0-9]+(\.[0-9]{1,18})?$" // Permette fino a 18 decimali
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="w-full rounded border p-2"
              required
              title="Please enter a valid price (e.g., 1.5 or 0.01)"
            />
            <Button
              onPress={handleListNft}
              disabled={isLoading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Listing..." : "List NFT for Sale"}
            </Button>
          </div>
        )}
        {marketItem.list && (
          <Button
            onPress={handleUnlistNft}
            disabled={isLoading}
            className="w-full rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? "Unlisting..." : "Unlist NFT"}
          </Button>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );

  return <NftDetails marketItem={marketItem} metadata={metadata} ownerActions={ownerActions} />;
};

export default OwnerView;
