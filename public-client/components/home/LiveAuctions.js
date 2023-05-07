import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";
import Image from "next/image";
import "swiper/css";
import { useTheme } from "next-themes";
import { Statistic } from "antd";
import Countdown from "react-countdown";
import SingleAuction from "./SingleAuction";
import nftPlaceholder from "../../images/nft/nft.png";
// import profilePlaceholder from "../../images/profile.png";
import { MdFavoriteBorder, MdFavorite, MdAccessTime } from "react-icons/md";
import { useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Shape from "../../images/Diamond_Shape.png";
import Author from "../../images/creator.png";
import profilePlaceholder from "../../images/avatar.png";

function getDifferenecInSeconds(date1, date2) {
  const diffInMs = Math.abs(date2 - date1);
  return diffInMs;
}

export default function LiveAuctions({ auctionsNftsWithOwners }) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const root = useSelector((state) => state.main.root);

  // console.log("diffInSeconds", new Date(auctionsNftsWithOwners[4]?.endDate));

  const [isFav, setIsFav] = useState(false);
  const [favCount, setFavCount] = useState(10);

  return (
    <section className="relative py-20 bg-secondaryGray bg-opacity-10">
      <div className="max-w-[1440px] mx-auto xl:px-[84px] lg:px-[48px] md:px-[24px] sm:px-[24px] px-[24px] ">
        <div className="">
          <div className="flex justify-between items-center mb-8">
            <h2
              className="xl:text-[24px] text-[28px] z-100 text-center sm:text-start"
              style={{
                lineHeight: "32.4px",
                fontSize: "24px",
                fontWeight: 900,
              }}
            >
              Live Auctions ⚡
            </h2>
            <div className="gap-4 hidden md:flex">
              <div className="w-[48px] h-[48px] md:w-[64px] md:h-[64px] border-solid border-[#CFDBD599] z-50 rounded-full bg-white swiper-button-prev-custom-acu text-secondaryBlack flex justify-center items-center cursor-pointer">
                <MdChevronLeft className="text-2xl md:text-4xl" />
              </div>
              <div className="w-[48px] h-[48px] md:w-[64px] md:h-[64px] border-solid border-[#CFDBD599] z-50 rounded-full bg-white text-secondaryBlack swiper-button-next-custom-acu flex justify-center items-center cursor-pointer ">
                <MdChevronRight className="text-2xl md:text-4xl" />
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <Swiper
            spaceBetween={20}
            modules={[Navigation]}
            slidesPerView="auto"
            navigation={{
              nextEl: ".swiper-button-next-custom-acu",
              prevEl: ".swiper-button-prev-custom-acu",
            }}
            loop={true}
            breakpoints={{
              320: {
                width: 320,
                slidesPerView: 1.2,
                spaceBetween: 20,
              },
              400: {
                width: 400,
                slidesPerView: 1.3,
              },
              640: {
                width: 640,
                slidesPerView: 2,
              },
              768: {
                width: 768,
                slidesPerView: 2,
              },
              1024: {
                width: 1024,
                slidesPerView: 3,
              },
              1280: {
                width: 1280,
                slidesPerView: 4,
              },
            }}
          >
            {auctionsNftsWithOwners?.map((auctionNftWithOwner, index) => {
              return (
                <SwiperSlide>
                  <div className="relative  pb-4 bg-white dark:bg-[#071521] rounded-[16px] dark:border-none border border-solid overflow-hidden border-gray-200  ">
                    <div className="image-container">
                      <Image
                        src={auctionNftWithOwner?.picture}
                        height={302}
                        width={302}
                        className="object-cover image cursor-pointer"
                        onClick={() => {
                          router.push(`/nft/${auctionNftWithOwner?._id}`);
                        }}
                      />
                    </div>
                    {auctionNftWithOwner?.endDate && (
                      <div className="absolute w-[140px] h-[43px] bg-white dark:bg-secondaryBlack text-secondaryBlack rounded-[23px] left-4 top-4 px-3 flex items-center justify-between gap-x-2 !text-xs font-bold">
                        <MdAccessTime className=" font-bold text-xl cursor-pointer text-secondaryBlack dark:text-white" />
                        {auctionNftWithOwner?.endDate && (
                          <div className="w-[100px]">
                            <Statistic.Countdown
                              value={new Date(
                                auctionNftWithOwner?.endDate
                              ).getTime()}
                              format="DD:HH:mm:ss"
                              onFinish={() => {
                                console.log("finished!");
                              }}
                              valueStyle={{
                                fontSize: "14px",
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                    {/* <div className="absolute w-[75px] h-[43px] bg-white text-secondaryBlack rounded-[23px] right-4 top-4 flex items-center justify-center gap-x-2">
                      {isFav ? (
                        <MdFavorite
                          className=" font-bold text-xl cursor-pointer"
                          onClick={() => {
                            setIsFav(false);
                            setFavCount(favCount - 1);
                          }}
                        />
                      ) : (
                        <MdFavoriteBorder
                          className=" font-bold text-xl cursor-pointer"
                          onClick={() => {
                            setIsFav(true);
                            setFavCount(favCount + 1);
                          }}
                        />
                      )}
                      <span className=" font-bold text-[14px]">{favCount}</span>
                    </div> */}
                    <div className="p-4 ">
                      <p className="font-bold text-base">
                        {auctionNftWithOwner?.title}
                      </p>
                      <div className="py-3 pt-5 flex justify-between items-center flex-row gap-2 border-t-0 border-l-0 border-r-0 border-b-2 border-solid border-[#CFDBD599]">
                        <p className="font-thin text-sm text-[#5D5D5B]">
                          Starts from
                        </p>
                        <div className="flex justify-start items-center flex-row gap-2">
                          <Image src={Shape} width={16} height={16} />
                          <p className="font-bold text-[16px]">
                            {auctionNftWithOwner?.minimumBid} XRD
                          </p>
                        </div>
                      </div>
                      <div className="pt-3 flex justify-between items-center flex-row gap-3">
                        <p className="font-thin text-sm text-[#5D5D5B]">
                          Author
                        </p>
                        <div
                          className="flex justify-start items-center flex-row gap-3 cursor-pointer"
                          onClick={() => {
                            if (auctionNftWithOwner?.owner?._id) {
                              router.push(
                                `/profile/${auctionNftWithOwner?.owner?._id}`
                              );
                            }
                          }}
                        >
                          <Image
                            src={
                              auctionNftWithOwner?.owner?.profilePicture ||
                              profilePlaceholder
                            }
                            width={28}
                            height={28}
                            className="rounded-full"
                          />
                          <p className="font-bold text-[16px] text-primary">
                            {auctionNftWithOwner?.owner?.name || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
