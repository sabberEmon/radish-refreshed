import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";
import Image from "next/image";
import "swiper/css";
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
import SingleEditorNft from "./SingleEditorNft";

export default function EditorsPick({ nfts }) {
  // console.log(nfts);

  return (
    <div>
      <Swiper
        spaceBetween={20}
        modules={[Navigation]}
        slidesPerView="auto"
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        loop={false}
        breakpoints={{
          320: {
            width: 320,
            slidesPerView: 1.1,
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
        {nfts.map((nft) => (
          <SwiperSlide>
            <SingleEditorNft nft={nft} key={nft._id} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
