import { Skeleton } from "antd";

export default function SingleNftSkeleton() {
  return (
    <div className="w-[321px] h-[446px] border border-solid border-[#030E170F] dark:border-[#696969] rounded-[16px]">
      <Skeleton.Image
        active={true}
        className="!rounded-t-[16px] !w-full !h-[319px] !rounded-b-none"
      />

      <div className="px-3">
        <Skeleton.Input
          active={false}
          size={""}
          block={true}
          className="!rounded-[16px] !h-[22px] mt-1 !w-full"
        />
        <Skeleton.Input
          active={false}
          size={""}
          block={true}
          className="!rounded-[16px] !h-[22px] mt-1 !w-[50%]"
        />

        <Skeleton.Input
          active={true}
          size={""}
          block={true}
          className="!rounded-[16px] !h-[38px] mt-[11px] !w-full"
        />
      </div>
    </div>
  );
}
