import { Empty } from "antd";
import Image from "next/image";

function Collection({ item }) {
  return (
    <div className="max-w-[303px] rounded-[16px] border border-solid border-[#030E170F] dark:border-[#696969] pb-3">
      <div className="relative">
        <Image
          src={item?.collectionBanner}
          alt={item?.title}
          width={297}
          height={200}
          className="rounded-t-[16px]"
        />
        <Image
          src={item?.collectionProfilePicture}
          alt={item?.collectionIdentifier}
          width={80}
          height={80}
          className="absolute -bottom-[40px] left-4 rounded-full border-2 border-white border-solid"
        />
      </div>

      <div className="pl-[20px] pr-3 mt-2">
        <h3 className="font-extrabold w-[65%] ml-auto">
          {
            // item?.title.length > 20 ? item?.title.slice(0, 20) + "..." : item?.title
            item?.title
          }
        </h3>
        <p className="text-[#666F83] text-[13px] mt-2">
          {item?.description.length > 80
            ? item?.description.slice(0, 80) + "..."
            : item?.description}
        </p>
      </div>
    </div>
  );
}

export default function CollectionList({ data }) {
  if (data?.length === 0)
    return (
      <section className="w-full h-full text-center text-secondaryGray text-sm p-8">
        <Empty
          description={`No related collections found`}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </section>
    );

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-x-3 gap-y-4 md:gap-y-6 md:gap-x-6 xl:gap-x-6 xl:gap-y-6 sm:gap-y-4">
      {data.map((item) => {
        return <Collection key={item._id} item={item} />;
      })}
    </section>
  );
}
