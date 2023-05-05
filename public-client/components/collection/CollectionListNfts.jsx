import { Empty } from "antd";
import SingleNft from "../common/SingleNft";

export default function CollectionListNfts({ nfts, filtersOpen }) {
  if (nfts?.length === 0) {
    return (
      <div className="min-h-[70vh]">
        <div className="flex justify-center items-center min-h-full">
          <div>
            <Empty
              description={`No items found`}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${
        filtersOpen
          ? "xl:grid-cols-3 2xl:grid-cols-4"
          : "xl:grid-cols-4 2xl:grid-cols-5"
      } gap-x-3 gap-y-4 md:gap-y-3 sm:gap-y-4`}
    >
      {nfts?.map((nft) => (
        <div key={nft} className="w-full justify-center items-center flex">
          <SingleNft />
        </div>
      ))}
    </div>
  );
}
