import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";
import nftPlaceholder from "../../images/nft/nft.png";
import Art1 from "../../images/categories/art_3.png";
import Art2 from "../../images/categories/art_2.png";
import Art3 from "../../images/categories/art_1.png";
import Art11 from "../../images/categories/art11.png";
import Art22 from "../../images/categories/art22.png";
import Art33 from "../../images/categories/art33.png";
import Art111 from "../../images/categories/art111.png";
import Art222 from "../../images/categories/art222.png";
import Art333 from "../../images/categories/art333.png";
import Image from "next/image";
import "swiper/css";
import { useTheme } from "next-themes";

export default function HeroSlider() {
    const { theme, setTheme } = useTheme();

    return (
        <section className="relative py-20 bg-opacity-10">
            <div className="max-w-[1350px] mx-auto relative px-8 mb-8">
                <h2 className="xl:text-[24px] text-[28px] z-100"
                    style={{
                        lineHeight: "32.4px",
                        fontSize: "24px",
                        fontWeight: 900
                    }}
                >
                    Browse by category 📌
                </h2>
            </div>
            <div className="max-w-[1350px] mx-auto relative px-3 ">
                <div className="md:w-[64px] md:h-[64px] border-solid border-[#CFDBD599] w-14 h-14 z-50 rounded-full bg-white swiper-button-prev-custom text-secondaryBlack flex justify-center items-center cursor-pointer absolute top-[40%] -left-0">
                    <MdChevronLeft className=" text-4xl" />
                </div>
                <div className="md:w-[64px] md:h-[64px] border-solid border-[#CFDBD599] w-14 h-14 z-50 rounded-full bg-white text-secondaryBlack swiper-button-next-custom flex justify-center items-center cursor-pointer absolute top-[40%] -right-0">
                    <MdChevronRight className=" text-4xl" />
                </div>
                <div className="home-page-slider">
                    <Swiper
                        spaceBetween={20}
                        modules={[Navigation]}
                        slidesPerView="auto"
                        navigation={{
                            nextEl: ".swiper-button-next-custom",
                            prevEl: ".swiper-button-prev-custom",
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
                                slidesPerView: 2,
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
                                width: 1330,
                                slidesPerView: 3,
                            },
                        }}
                    >

                        <SwiperSlide>
                            <div className=" relative w-fit rounded-[14px] overflow-hidden p-5 dark:bg-[#071521] dark:border-none border border-solid border-gray-200">
                                <div className="flex justify-start items-center flex-row gap-4 ">
                                    <div className="max-width-[241px]">
                                        <div className="image-container">
                                            <Image
                                                src={Art1}
                                                width={241}
                                                height={208}
                                                className="object-cover image"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-between items-center gap-1 sm:gap-4">
                                        <div className="max-width-[109px]">
                                            <div className="image-container">
                                                <Image
                                                    src={Art2}
                                                    width={109}
                                                    height={98}
                                                    className="object-cover image"
                                                />
                                            </div>
                                        </div>
                                        <div className="max-width-[109px]">
                                            <div className="image-container">
                                                <Image
                                                    src={Art3}
                                                    width={109}
                                                    height={98}
                                                    className="object-cover image"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="pt-3 font-black text-2xl">Art</p>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className=" relative w-fit rounded-[14px] overflow-hidden p-5 dark:bg-[#071521] dark:border-none border border-solid border-gray-200">
                                <div className="flex justify-start items-center flex-row gap-4 ">
                                    <div className="max-width-[241px]">
                                        <div className="image-container">
                                            <Image
                                                src={Art11}
                                                width={241}
                                                height={208}
                                                className="object-cover image"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-between items-center gap-1 sm:gap-4">
                                        <div className="max-width-[109px]">
                                            <div className="image-container">
                                                <Image
                                                    src={Art22}
                                                    width={109}
                                                    height={98}
                                                    className="object-cover image"
                                                />
                                            </div>
                                        </div>
                                        <div className="max-width-[109px]">
                                            <div className="image-container">
                                                <Image
                                                    src={Art33}
                                                    width={109}
                                                    height={98}
                                                    className="object-cover image"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="pt-3 font-black text-2xl">Collectibles</p>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className=" relative w-fit rounded-[14px] overflow-hidden p-5 dark:bg-[#071521] dark:border-none border border-solid border-gray-200">
                                <div className="flex justify-start items-center flex-row gap-4 ">
                                    <div className="max-width-[241px]">
                                        <div className="image-container">
                                            <Image
                                                src={Art111}
                                                width={241}
                                                height={208}
                                                className="object-cover image"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-between items-center gap-1 sm:gap-4">
                                        <div className="max-width-[109px]">
                                            <div className="image-container">
                                                <Image
                                                    src={Art222}
                                                    width={109}
                                                    height={98}
                                                    className="object-cover image"
                                                />
                                            </div>
                                        </div>
                                        <div className="max-width-[109px]">
                                            <div className="image-container">
                                                <Image
                                                    src={Art333}
                                                    width={109}
                                                    height={98}
                                                    className="object-cover image"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="pt-3 font-black text-2xl">Photography</p>
                            </div>
                        </SwiperSlide>





                    </Swiper>
                </div>
            </div>
        </section>
    );
}
