import { SectionContainer } from "@/lib/components/common/section-container";
import { UserInfoCard } from "@/lib/components/user/user-info-card";

const MineUserInfoWrapper = () => {
  return (
    <SectionContainer>
      <UserInfoCard isLoggedInUser username="" />
    </SectionContainer>
  );
};

export default MineUserInfoWrapper;
