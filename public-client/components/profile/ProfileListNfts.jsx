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
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 
      xl:grid-cols-4 2xl:grid-cols-5
     gap-4 max-w-fit mx-auto"
    >
      {nfts?.map((nft) => (
        <SingleNft key={nft._id} nft={nft} />
      ))}
    </div>
  );
}
