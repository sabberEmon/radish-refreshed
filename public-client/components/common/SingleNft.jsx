import Image from "next/image";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import banner from "../../images/collection-banner.png";
import currency from "../../images/Diamond_Shape.png";

function SingleNft() {
  return (
    <div className="w-[320px] border border-solid border-[#030E170F] dark:border-[#696969] rounded-[16px]">
      <div className="relative w-fit h-fit">
        <Image
          src={banner}
          width={319}
          height={319}
          alt="nft"
          className="rounded-[16px] rounded-b-none !object-cover"
        />

        <div className="min-w-[52px] px-3 py-2 absolute left-[20px] top-4 bg-[#ED6400] rounded-[40px] text-white text-xs flex justify-center items-center">
          #100
        </div>
      </div>

      <div className="px-3 pb-3">
        <div className="mt-2 flex justify-between ">
          <p className="text-sm font-bold text-primary">Legends of Atlantis</p>
          <div className="flex items-center gap-x-1">
            <MdFavoriteBorder className="w-[18px] h-[18px] cursor-pointer" />
            <span className="font-extrabold">0</span>
          </div>
        </div>

        <h3 className="text-lg font-extrabold ">Atlantean #1</h3>

        <div className="mt-6">
          <div className="flex justify-between items-center">
            <span className="text-[#9CA4AB] text-xs">Highest bid</span>
            <span className="text-sm font-bold text-primary capitalize">
              On Sale
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#9CA4AB] text-xs">Highest bid</span>
            <span className="text-sm font-bold text-primary capitalize">
              On Sale
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleNft;
