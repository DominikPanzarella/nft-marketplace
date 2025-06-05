"use client";
import ViewerView from "@/app/nft/[collectionId]/[tokenId]/(viewer)/viewer-view";
import OwnerView from "@/app/nft/[collectionId]/[tokenId]/(owner)/owner-view";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { getTokenDetails } from "@/lib/api/nft";
import { MARKET_ITEM_KEY } from "@/lib/url-keys";

const TokenDetailsWrapper = ({ collectionId, tokenId }: { collectionId: string; tokenId: string }) => {
  const { signer } = useAuth();

  const {
    data,
    error,
    isLoading: loading,
  } = useQuery({
    queryKey: [MARKET_ITEM_KEY, collectionId, tokenId],
    queryFn: () => getTokenDetails(collectionId, tokenId, signer),
    enabled: !!signer && !!collectionId && !!tokenId,
  });

  if (!data) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  const { marketItem, metadata, currentAddress } = data;
  const isOwner = currentAddress === marketItem!.seller;

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="flex h-screen items-center justify-center text-red-500">{error.message}</div>;
  }

  if (!marketItem || !metadata) {
    return <div className="flex h-screen items-center justify-center">No NFT data found</div>;
  }

  if (!signer || !signer.getAddress) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl text-red-500">Plase connect you wallet</div>
      </div>
    );
  }

  return isOwner ? (
    <OwnerView initialMetadata={metadata} initialMarketItem={marketItem} />
  ) : (
    <ViewerView initialMetadata={metadata} initialMarketItem={marketItem} />
  );
};

export default TokenDetailsWrapper;
