import { useAuth } from "@/components/AuthProvider";
import NftDetails, { NftMetadata } from "../(nft details)/nft-details";
import { buyNft } from "@/app/nft/clientsideactions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getTokenDetails, NftMarketplaceDetails } from "@/lib/api/nft";
import { ethers } from "ethers";
import { requireLogInSnakeBar } from "@/lib/utils";
import { MARKET_ITEM_KEY } from "@/lib/url-keys";

const ViewerView = ({
  initialMarketItem,
  initialMetadata,
}: {
  initialMarketItem: NftMarketplaceDetails;
  initialMetadata: NftMetadata;
}) => {
  const { signer } = useAuth();
  const queryClient = useQueryClient();
  const params = useParams();
  const { collectionId, tokenId } = params;

  const { data, isLoading, error } = useQuery({
    queryKey: [MARKET_ITEM_KEY, collectionId, tokenId],
    queryFn: () => getTokenDetails(collectionId as string, tokenId as string, signer),
    enabled: !!signer || !!initialMarketItem?.marketItemId?.toString(),
    refetchInterval: 5000, // Refetch every 5 seconds
    initialData: {
      marketItem: initialMarketItem,
      metadata: initialMetadata,
      currentAddress: signer?.getAddress() as unknown as string, //fixme type
    },
  });

  if (!signer) {
    return <div className="flex h-screen items-center justify-center">Please connect you wallet</div>;
  }

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="flex h-screen items-center justify-center text-red-500">{error.message}</div>;
  }

  if (!data?.marketItem || !data?.metadata) {
    return <div className="flex h-screen items-center justify-center">No NFT data found</div>;
  }

  const { marketItem, metadata } = data;

  const handleBuyNft = async () => {
    if (!signer) {
      requireLogInSnakeBar();
      return;
    }
    try {
      await buyNft(signer, marketItem?.nftContractAddress, marketItem?.tokenId, marketItem?.marketItemId);
      // Invalidate both the specific token query and the market items query
      await queryClient.invalidateQueries({
        queryKey: [MARKET_ITEM_KEY, collectionId, tokenId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["marketItems"],
      });
    } catch (error) {
      console.error("Error buying NFT:", error);
    }
  };

  const viewerActions = (
    <div className="rounded-lg border p-4">
      <h2 className="mb-4 text-xl font-semibold">Viewer Actions</h2>
      <div className="flex flex-col gap-4">
        {marketItem.list && (
          <div className="rounded-lg border p-4">
            <h2 className="mb-4 text-xl font-semibold">Buy NFT</h2>
            <p className="mb-4 text-gray-600">Price: {ethers.formatEther(marketItem.price)} ETH</p>
            <button
              onClick={handleBuyNft}
              className="w-full rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              Buy Now
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return <NftDetails marketItem={marketItem} metadata={metadata} ownerActions={viewerActions} />;
};

export default ViewerView;
