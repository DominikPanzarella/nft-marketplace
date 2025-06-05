import CollectionContainer from "@/app/nft/collection/[id]/collection-container";

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  return <CollectionContainer collectionId={id} />;
};

export default Page;
