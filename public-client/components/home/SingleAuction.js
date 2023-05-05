import Image from "next/image";
// import nftPlaceholder from "../../images/login/login-bg.jpg";
import nftPlaceholder from "../../images/nft/nft.png";
import profilePlaceholder from "../../images/profile.png";
import { MdFavoriteBorder, MdFavorite, MdAccessTime } from "react-icons/md";
import { useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Shape from "../../images/Diamond_Shape.png";
import Author from "../../images/creator.png";

export default function SingleAuction() {
  const router = useRouter();
  const root = useSelector((state) => state.root);

  const [isFav, setIsFav] = useState(false);
  const [favCount, setFavCount] = useState(10);
  // console.log(session.session.user.name);

  return (
    <div className="relative w-[275px] sm:w-[302px]  pb-4 bg-white dark:bg-[#071521] rounded-[16px] dark:border-none border border-solid overflow-hidden border-gray-200  ">
      <div className="image-container">
        <Image
          src={nftPlaceholder}
          height={302}
          width={302}
          className="object-cover image"
        />
      </div>
      <div className="absolute w-[120px] h-[43px] bg-white text-secondaryBlack rounded-[23px] left-4 top-4 flex items-center justify-center gap-x-2">
        <MdAccessTime className=" font-bold text-xl cursor-pointer" />
        <span className=" font-bold text-[14px]">10:40:57</span>
      </div>
      <div className="absolute w-[75px] h-[43px] bg-white text-secondaryBlack rounded-[23px] right-4 top-4 flex items-center justify-center gap-x-2">
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
      </div>
      <div className="p-4 cursor-pointer">
        <p className="font-bold text-base">Globe the World</p>
        <div className="py-3 pt-5 flex justify-between items-center flex-row gap-3 border-t-0 border-l-0 border-r-0 border-b-2 border-solid border-[#CFDBD599]">
          <p className="font-thin text-sm text-[#5D5D5B]">Price</p>
          <div className="flex justify-start items-center flex-row gap-3">
            <Image src={Shape} width={10} height={16} />
            <p className="font-bold text-[16px]">10 ETH </p>
          </div>
        </div>
        <div className="pt-3 flex justify-between items-center flex-row gap-3">
          <p className="font-thin text-sm text-[#5D5D5B]">Author</p>
          <div className="flex justify-start items-center flex-row gap-3">
            <Image
              src={Author}
              width={28}
              height={28}
              className="rounded-full"
            />
            <p className="font-bold text-[16px]">Alex</p>
          </div>
        </div>
        {/* <p className="mt-1 text-secondaryGray text-sm">
                    <span className="font-bold text-primary cursor-pointer">
                        Globe the World
                    </span>
                </p>
                <p className="mt-3">ghgjhg</p> */}
      </div>
    </div>
  );
}
