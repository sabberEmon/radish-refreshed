import Image from "next/image";
// import nftPlaceholder from "../../images/collection/collection-nft.png";
import { HeartIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartFilledIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import currencyIcon from "../../images/Diamond_Shape.png";
import profilePlaceholder from "../../images/profile.png";
import nftPlaceholder from "../../images/nft/car_nft.png";

export default function SingleMoreNft() {
  const [isHearted, setIsHearted] = useState(false);
  const [heartCount, setHeartCount] = useState(24);

  return (
    <div className="bg-white dark:bg-[#071521] dark:border-none border border-solid border-[#CFDBD599] rounded-2xl px-6 py-4 xl:w-[302px] xl:h-[418px] w-full">
      <div className="flex justify-between items-center gap-3 flex-col w-full">
        <div className="flex items-center justify-between w-full">
          <div>
            <div className="flex items-center gap-x-2">
              <Image
                src={profilePlaceholder}
                alt="Profile"
                width={35}
                height={35}
                className="rounded-full"
              />
              <span className="text-sm  font-bold">FluidLabs</span>
            </div>
          </div>
          <EllipsisHorizontalIcon className="h-6 w-6  cursor-pointer" />
        </div>

        <div className="w-full">
          <Image
            src={nftPlaceholder}
            alt="Profile"
            width={254}
            height={254}
            className="object-cover"
          />
        </div>

        <div className="w-full flex justify-between items-start flex-col gap-2">
          <p className="font-bold  text-[18px] ">The Globe Box #12</p>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-x-2">
              <Image
                src={currencyIcon}
                alt="Currency"
                width={12.5}
                height={20}
              />
              <p className="text-sm  font-semibold">
                <span className="text-xs text-secondaryGray">from</span> 2 XRD
              </p>
            </div>

            <div className="flex items-center gap-x-1 ">
              {isHearted ? (
                <HeartFilledIcon
                  className="h-6 w-6 text-[#FF0000] cursor-pointer"
                  onClick={() => {
                    setIsHearted(false);
                    setHeartCount(heartCount - 1);
                  }}
                />
              ) : (
                <HeartIcon
                  className="h-6 w-6  cursor-pointer"
                  onClick={() => {
                    setIsHearted(true);
                    setHeartCount(heartCount + 1);
                  }}
                />
              )}
              <span>{heartCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
