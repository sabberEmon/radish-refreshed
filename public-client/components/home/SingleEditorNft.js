import { MdChevronRight, MdChevronLeft } from "react-icons/md";
import Image from "next/image";
import { useTheme } from "next-themes";
import SingleAuction from "./SingleAuction";
import SingleMoreNft from "../nft/SingleMoreNft";
// import nftPlaceholder from "../../images/collection/collection-nft.png";
import { HeartIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartFilledIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import currencyIcon from "../../images/Diamond_Shape.png";
import profilePlaceholder from "../../images/profile.png";
import nftPlaceholder from "../../images/nft/car_nft.png";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useToggleLikeMutation } from "@/redux/features/api/apiSlice";
import { Button, Popover } from "antd";

export default function SingleEditorNft({ nft }) {
  const router = useRouter();
  const root = useSelector((state) => state.main.root);
  const [toggleLike, { isLoading: toggleLikeLoading }] =
    useToggleLikeMutation();

  const { theme, setTheme } = useTheme();
  // console.log(nft?.likes?.includes(session?.data?.token?.sub));
  // console.log(session?.data?.token?.sub);
  const [isHearted, setIsHearted] = useState(
    nft?.likes?.includes(session?.data?.token?.sub)
  );
  const [heartCount, setHeartCount] = useState(nft?.likes?.length);

  return (
    <div className=" w-fit bg-white dark:bg-[#071521] dark:border-none border border-solid border-[#CFDBD599] rounded-2xl px-6 py-4 xl:w-[302px] xl:h-[445px] ">
      <div className="flex justify-between items-center gap-3 flex-col w-full">
        <div className="flex items-center justify-between w-full">
          <div className="w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-2">
                <Image
                  src={nft.parentCollection?.collectionProfilePicture}
                  alt="Profile"
                  width={35}
                  height={35}
                  quality={100}
                  className="rounded-full cursor-pointer"
                  onClick={() => {
                    router.push(
                      `/collection/${nft.parentCollection?.collectionIdentifier}`
                    );
                  }}
                />
                <span
                  className="text-sm  font-bold cursor-pointer"
                  onClick={() => {
                    router.push(
                      `/collection/${nft.parentCollection?.collectionIdentifier}`
                    );
                  }}
                >
                  {nft.parentCollection?.title}
                </span>
              </div>
              {nft.attributes?.length > 0 && (
                <div>
                  <Popover
                    title={
                      <p className="text-center font-bold text-secondaryBlack text-xs pt-[7px]">
                        <span className="text-primary">#{nft.rank}</span> based
                        on rarity rank with a score of{" "}
                        <span className="text-primary">
                          {nft.totalRarityScore}
                        </span>
                      </p>
                    }
                    style={{
                      boxShadow: "none",
                    }}
                    placement="top"
                    color="white"
                    className="!border !border-solid !border-[#CFDBD599] rounded-[12px]"
                  >
                    <Button className="w-[56px] text-xs h-[26px] rounded-[8px] flex justify-center items-center px-1 font-bold">
                      {/* <EllipsisHorizontalIcon className="h-6 w-6" /> */}#{" "}
                      {nft.rank}
                    </Button>
                  </Popover>
                </div>
              )}
            </div>
          </div>
          {/* <EllipsisHorizontalIcon className="h-6 w-6  cursor-pointer" /> */}
        </div>
        <div className="max-w-[254px]">
          <div
            className=" cursor-pointer"
            onClick={() => {
              router.push(`/nft/${nft._id}`);
            }}
          >
            <Image
              src={nft.picture || nftPlaceholder}
              alt="Profile"
              width={254}
              height={294}
              quality={100}
              className="object-cover image rounded-[12px]"
            />
          </div>
        </div>

        <div className="w-full flex justify-between items-start flex-col gap-2">
          <p className="font-bold  text-[18px] ">{nft.title}</p>
          <div className="flex items-center justify-between w-full">
            <div
              className="flex items-center gap-x-1 cursor-pointer"
              onClick={() => {
                if (!root.user) {
                  router.push("/auth/login");
                }
                if (toggleLikeLoading) return;
                setIsHearted(!isHearted);
                setHeartCount((prev) => (prev += isHearted ? -1 : 1));
                toggleLike({
                  nftId: nft._id,
                  userId: root.user?._id,
                }).then((res) => {
                  // console.log(res);
                });
              }}
            >
              {isHearted ? (
                <HeartFilledIcon className="h-6 w-6 text-[#FF0000] " />
              ) : (
                <HeartIcon className="h-6 w-6  " />
              )}
              <span>{heartCount}</span>
            </div>
            {(nft.forSale || nft.owneWallet === "Locked") && (
              <div className="text-sm  font-semibold flex items-center gap-x-2">
                {/* <span className="text-xs text-secondaryGray">from</span>{" "} */}
                <Image
                  src={currencyIcon}
                  alt="Currency"
                  width={20}
                  height={20}
                  quality={100}
                />
                {nft?.price ? `${nft?.price} XRD` : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
