import { Empty } from "antd";
import SingleNft from "../common/SingleNft";

export default function ProfileListNfts({ nfts, tabName }) {
  if (nfts?.length === 0) {
    return (
      <div className="min-h-[70vh]">
        <div className="flex justify-center items-center min-h-full">
          <div>
            <Empty
              description={`No items on ${tabName}`}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5 gap-x-3 gap-y-4 md:gap-y-3 sm:gap-y-4">
      {nfts?.map((nft) => (
        <SingleNft key={nft._id} nft={nft} />
      ))}
    </div>
  );
}
