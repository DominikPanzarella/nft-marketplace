import TokenDetailsWrapper from "@/app/nft/[collectionId]/[tokenId]/token-details-wrapper";

const Page = async ({ params }: { params: Promise<{ collectionId: string; tokenId: string }> }) => {
  const { collectionId, tokenId } = await params;
  return <TokenDetailsWrapper collectionId={collectionId} tokenId={tokenId} />;
};

export default Page;
