import DeployCollectionWrapper from "./(collection form)/deploy-collection-wrapper";
import { SectionContainer } from "@/lib/components/common/section-container";
import { HeroSecondary } from "@/lib/components/common/hero-secondary";

const DeployCollectionPage = () => (
  <>
    <SectionContainer>
      <HeroSecondary
        subtitle="You'll need to deploy and ERC-721 contract on the blockchain to create a collection for your NFT."
        title="First, you'll need to create a collection for your NFT"
      />
    </SectionContainer>

    <SectionContainer>
      <DeployCollectionWrapper />
    </SectionContainer>
  </>
);

export default DeployCollectionPage;
