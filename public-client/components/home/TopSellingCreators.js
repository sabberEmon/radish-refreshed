import React from "react";
import avatar from "../../images/avatar.png";
import Image from "next/image";
import { useRouter } from "next/router";

const TrendingCreators = ({ owner, index }) => {
  const router = useRouter();

  // console.log(owner);

  return (
    <div className="w-full flex justify-between items-center flex-row border-t-0 border-l-0 border-r-0 border-b-2 border-solid border-[#CFDBD599]">
      <div className="py-3 w-full">
        <div className="flex justify-start items-center flex-row gap-4 ">
          <p className="font-bold text-[14px]">{index + 1}</p>
          {owner.profilePicture ? (
            <Image
              src={owner.profilePicture}
              width={54}
              height={54}
              quality={100}
              onClick={() => {
                router.push(`/profile/${owner.id}`);
              }}
              className="rounded-full cursor-pointer"
            />
          ) : (
            <Image
              src={avatar}
              width={54}
              height={54}
              onClick={() => {
                router.push(`/profile/${owner.id}`);
              }}
              className="rounded-full cursor-pointer"
            />
          )}
          <div
            className="w-full flex justify-start items-start flex-col gap-1 cursor-pointer"
            onClick={() => {
              router.push(`/profile/${owner.id}`);
            }}
          >
            <p className="font-bold text-[16px]">{owner.name}</p>
            <div className="w-full flex justify-between items-center flex-row gap-3">
              <p className="font-semibold text-[14px]">
                {owner.nftsCount} NFTs
              </p>
              {/* <p className="font-thin text-[16px] text-[#04C976] text-end">
                +12,50%
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingCreators;
