import { Empty } from "antd";
import SingleNft from "../common/SingleNft";
import SingleNftSkeleton from "../common/SingleNftSkeleton";

export default function LiveAuctionItems({ nfts, loading }) {
  return (
    <div className="w-fit sm:w-full mx-auto sm:mx-0">
      {!loading ? (
        <>
          {nfts.length > 0 ? (
            <div className="grid gridLaptop:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-y-4">
              {nfts.map((nft) => {
                return <SingleNft key={nft._id} nft={nft} />;
              })}
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <Empty
                description={`No NFTs on auction`}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          )}
        </>
      ) : (
        <div className="grid gridLaptop:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-y-4">
          {[1, 2, 3, 4].map((item) => {
            return <SingleNftSkeleton key={item} />;
          })}
        </div>
      )}
    </div>
  );
}
