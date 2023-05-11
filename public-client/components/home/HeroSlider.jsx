import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";
import Image from "next/image";
import "swiper/css";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";

export default function HeroSlider({ collections }) {
  const { theme, setTheme } = useTheme();

  // console.log("collections", collections);
  const router = useRouter();

  return (
    <section className="relative py-5 md:py-20 sm:py-10 bg-opacity-10">
      <div className="w-[300px] h-[300px] absolute bg-primary rounded-full hidden xl:inline-block top-[20%] left-[15%]  filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
      <div className="w-[300px] h-[300px] absolute bg-secondary rounded-full top-[20%] right-[15%]  filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>

      <h1
        className="text-[28px] sm:text-3xl md:text-4xl lg:text-5xl xl:text-[64px] text-center mb-12 md:mb-16 xl:mb-24 z-100 xl:px-[84px] lg:px-[48px] sm:px-[24px] px-[24px]"
        style={{
          fontWeight: 900,
        }}
      >
        Discover, collect and sell <br /> rare digital{" "}
        <span className="relative w-full">
          collectibles
          <span className="absolute px-3 sm:p-0 right-1 sm:14 top-4 sm:top-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="inherit"
              height="18"
              viewBox="0 0 235 18"
              fill="none"
            >
              <path
                d="M27.889 0.323753C30.7039 0.753713 33.6126 1.02729 36.3024 1.65268C42.1823 3.00119 47.8746 4.66241 52.8788 7.02719C60.6041 10.7209 69.7368 11.9913 78.932 13.1444C82.3411 13.5744 85.5939 13.1248 88.4713 11.9327C90.9109 10.9359 93.2878 9.88056 95.6336 8.78612C98.292 7.53532 100.857 6.18687 103.515 4.93607C110.052 1.84818 117.59 0.499665 125.596 0.050161C130.288 -0.22345 134.666 0.655976 138.889 1.86768C143.424 3.17711 147.928 4.54518 152.494 5.79598C158.061 7.30084 163.847 8.31709 169.946 8.61024C173.605 8.78613 176.89 8.45391 180.048 7.16403C187.398 4.17385 195.718 3.04034 204.256 2.3954C208.698 2.06316 213.014 2.53213 217.236 3.29433C221.646 4.07608 225.993 4.99467 230.278 5.97185C231.779 6.32363 233.156 6.94907 234.438 7.57447C235.376 8.04351 235.064 9.17705 234.063 9.62655C232.28 10.4474 230.247 10.6818 228.12 10.3496C225.086 9.9001 221.99 9.52883 219.081 8.8448C207.29 6.06961 196.156 7.39852 185.334 10.8382C183.676 11.3659 182.113 12.0304 180.392 12.5385C177.108 13.5157 173.637 13.7893 170.04 13.5353C162.94 13.0662 156.059 12.1086 149.554 10.2715C145.77 9.19655 141.86 8.23891 138.263 6.94903C128.599 3.47026 119.372 4.70149 110.365 7.80893C107.487 8.80566 104.985 10.2714 102.295 11.5027C99.1052 12.9684 95.9776 14.4733 92.6623 15.8414C87.9396 17.8153 82.6852 18.4212 77.118 17.7176C66.8593 16.4082 56.8509 14.7665 48.4063 10.545C43.9963 8.33661 38.7732 6.94901 33.6126 5.56141C28.6084 4.2129 23.8544 4.56472 19.2568 6.18685C13.7208 8.14121 9.15454 10.76 5.77669 14.1411C6.15201 15.6068 4.2754 15.8023 2.77413 16.1541C1.08521 16.545 -0.290932 15.8414 0.053108 14.8251C0.272042 14.1997 0.522253 13.5547 0.991398 12.9684C4.99477 8.08253 10.6557 4.19342 18.6938 1.80909C21.6025 0.988256 24.5738 0.441015 27.889 0.323753Z"
                fill={theme === "dark" ? "#DE345E" : "#3eb98e"}
              />
            </svg>
          </span>
        </span>
      </h1>

      <div className="max-w-[1440px] mx-auto xl:px-[84px] lg:px-[48px] sm:px-[24px] px-[14px]">
        <div className="relative ">
          <div className="w-[48px] h-[48px] md:w-[64px] md:h-[64px] border-solid border-[#CFDBD599] z-50 rounded-full bg-white swiper-button-prev-custom-hero text-secondaryBlack flex justify-center items-center cursor-pointer absolute top-[40%] -left-0">
            <MdChevronLeft className="text-2xl md:text-4xl" />
          </div>
          <div className="w-[48px] h-[48px] md:w-[64px] md:h-[64px] border-solid border-[#CFDBD599] z-50 rounded-full bg-white text-secondaryBlack swiper-button-next-custom-hero flex justify-center items-center cursor-pointer absolute top-[40%] -right-0">
            <MdChevronRight className="text-2xl md:text-4xl" />
          </div>
          <div className="home-page-slider">
            <Swiper
              spaceBetween={20}
              modules={[Navigation, Autoplay]}
              slidesPerView="auto"
              autoplay={{
                delay: 2000,
                disableOnInteraction: true,
              }}
              navigation={{
                nextEl: ".swiper-button-next-custom-hero",
                prevEl: ".swiper-button-prev-custom-hero",
              }}
              loop={true}
              breakpoints={{
                320: {
                  width: 320,
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                640: {
                  width: 640,
                  slidesPerView: 1.4,
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
                  slidesPerView: 4.1,
                  spaceBetween: 30,
                },
              }}
            >
              {collections.map((collection) => (
                <SwiperSlide key={collection._id}>
                  <div className="relative w-fit rounded-[14px] overflow-hidden">
                    <div className="max-w-[302px]">
                      <div className="image-container">
                        <Image
                          src={collection.collectionProfilePicture}
                          width={302}
                          height={324}
                          priority={true}
                          quality={100}
                          className="object-cover cursor-pointer rounded-[14px]"
                          onClick={() => {
                            router.push(
                              `/collection/${collection.collectionIdentifier}`
                            );
                          }}
                          alt={collection.title}
                        />
                      </div>
                    </div>

                    <div className="absolute bottom-4 text-center w-full title z-50">
                      <p
                        className="text-white font-extrabold text-[24px] cursor-pointer"
                        onClick={() => {
                          router.push(
                            `/collection/${collection.collectionIdentifier}`
                          );
                        }}
                      >
                        {collection.title}
                      </p>
                      <p className=" text-sm text-white">
                        by{" "}
                        <span
                          className="font-bold text-primary cursor-pointer hover:underline transition-all duration-200 ease-in-out"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/profile/${collection.creator?.uuid}`);
                          }}
                        >
                          {collection.creator?.name}
                        </span>
                      </p>
                    </div>

                    <div
                      className="absolute bottom-1 left-0 w-full h-[35%] bg-gradient-to-t from-gray-800 rounded-b-[11px] cursor-pointer"
                      onClick={() => {
                        router.push(
                          `/collection/${collection.collectionIdentifier}`
                        );
                      }}
                    ></div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
