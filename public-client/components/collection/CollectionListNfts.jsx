import { Empty, Spin } from "antd";
import SingleNft from "../common/SingleNft";
import { useSelector } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";

export default function CollectionListNfts({ infinityRef, loading }) {
  const collection = useSelector((state) => state.main.collection);

  if (loading) {
    return (
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 35 }} spin />}
        className="mx-auto inline-block my-10"
      />
    );
  }

  if (collection.nfts?.length === 0) {
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
        collection.isFiltersOpen
          ? "xl:grid-cols-3 2xl:grid-cols-4"
          : "xl:grid-cols-4 2xl:grid-cols-5"
      } gap-x-3 gap-y-4 md:gap-y-3 sm:gap-y-4`}
    >
      {collection.nfts?.map((nft) => (
        <div key={nft._id} className="w-full justify-center items-center flex">
          <SingleNft nft={nft} />
        </div>
      ))}
      <div
        ref={infinityRef}
        className={`w-full my-8 flex justify-center items-center
        ${collection.isFiltersOpen ? "col-span-full" : "col-span-full"}
        `}
      >
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 35 }} spin />}
          className="mx-auto inline-block"
        />
      </div>
    </div>
  );
}
