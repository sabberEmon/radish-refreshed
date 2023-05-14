import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import SingleNft from "../common/SingleNft";

function SimilarNfts({ nfts }) {
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
          <SwiperSlide key={nft._id}>
            <SingleNft nft={nft} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default SimilarNfts;
