import MineUserInfoWrapper from "@/app/users/me/mine-user-info-wrapper";
import DisplayMyNft from "./(display nfts)/display-my-nft";
import DisplayMyCollections from "./(display collections)/display-my-collections";

const Page = () => {
  return (
    <div className="space-y-8">
      <MineUserInfoWrapper />
      <DisplayMyCollections />
      <DisplayMyNft />
    </div>
  );
};

export default Page;
