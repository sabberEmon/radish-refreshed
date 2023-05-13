import { Empty, Spin } from "antd";
import SingleNft from "../common/SingleNft";
import { useSelector } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
import SingleNftSkeleton from "../common/SingleNftSkeleton";

export default function CollectionListNfts({ infinityRef, loading }) {
  const collection = useSelector((state) => state.main.collection);

  if (loading) {
    return (
      // <Spin
      //   indicator={<LoadingOutlined style={{ fontSize: 35 }} spin />}
      //   className="mx-auto inline-block my-10"
      // />
      <div
        className={`grid grid-cols-1 md:grid-cols-2  ${
          collection.isFiltersOpen
            ? "lg:grid-cols-2 gridLaptop:grid-cols-3 gridDesktop:grid-cols-4"
            : "lg:grid-cols-3 gridLaptop:grid-cols-4 gridDesktop:grid-cols-5"
        } gap-4 max-w-fit  mx-auto gridLaptop:mx-0`}
      >
        {Array.from(Array(20).keys()).map((i) => (
          <SingleNftSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (collection.nfts?.length === 0 && !loading) {
    return (
      <div className="flex justify-center items-center w-full mt-6">
        <div>
          <Empty
            description={`No items found`}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${
        collection.isFiltersOpen
          ? "lg:grid-cols-2 gridLaptop:grid-cols-3 gridDesktop:grid-cols-4"
          : "lg:grid-cols-3 gridLaptop:grid-cols-4 gridDesktop:grid-cols-5"
      } gap-4 max-w-fit  mx-auto gridLaptop:mx-0`}
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
