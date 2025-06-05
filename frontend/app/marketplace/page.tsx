import { SectionContainer } from "@/lib/components/common/section-container";
import FilterableNfts from "@/lib/components/common/filter&sort/filterable-nfts";
import NftCardsWrapper from "@/app/marketplace/NftCardsWrapper";

const Page = () => (
  <SectionContainer>
    <FilterableNfts filterTitle={"Filter & Sort"}>
      <NftCardsWrapper />
    </FilterableNfts>
  </SectionContainer>
);

export default Page;
