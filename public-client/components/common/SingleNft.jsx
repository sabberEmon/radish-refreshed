import Image from "next/image";
import { MdFavoriteBorder, MdFavorite, MdAccessTime } from "react-icons/md";
import currency from "../../images/Diamond_Shape.png";
import { Statistic, message } from "antd";
import { BsCartPlus, BsCartDash } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";

function SingleNft({ nft }) {
  const cart = useSelector((state) => state.main.cart);
  const dispatch = useDispatch();

  return (
    <div className="w-[320px] border border-solid border-[#030E170F] dark:border-[#696969] rounded-[16px] group cursor-pointer">
      <div className="relative w-fit h-fit">
        <div className="h-[319px] w-[319px] overflow-hidden rounded-t-[16px]">
          <Image
            src={nft.picture}
            width={319}
            height={319}
            alt="nft"
            className="rounded-[16px] rounded-b-none !object-cover group-hover:scale-110 transition-all duration-300 ease-in-out"
          />
        </div>

        <div className="min-w-[52px] px-3 py-2 absolute left-[20px] top-4 bg-[#ED6400] rounded-[40px] text-white text-xs flex justify-center items-center">
          #{nft.rank}
        </div>
      </div>

      <div className="px-3 pb-3">
        <div className="mt-2 flex justify-between ">
          <p className="text-sm font-bold text-[#0556FA]">
            {nft.parentCollection.title}
          </p>
          <div className="flex items-center gap-x-1">
            <MdFavoriteBorder className="w-[18px] h-[18px] cursor-pointer" />
            <span className="font-extrabold">0</span>
          </div>
        </div>

        <h3 className="text-lg font-extrabold ">{nft.title}</h3>

        {/* price section */}
        <div className="mt-3 group-hover:hidden h-[45px] transition-all duration-500 ease-in-out">
          <div className="flex justify-between items-center">
            <span className="text-[#9CA4AB] text-xs">Highest bid</span>
            <span className="text-sm font-bold text-primary capitalize">
              On sale
            </span>
          </div>

          <div className="flex justify-between items-center mt-1 mb-1">
            <div className="flex items-center gap-x-1">
              <Image src={currency} width={16} height={16} alt="currency" />
              <span className="text-sm font-extrabold">700 XRD</span>
            </div>

            <div className=" h-[18px] flex items-center gap-x-1 !text-[#9CA4AB]">
              <MdAccessTime className="font-bold text-[#9CA4AB] " />
              <div className="min-w-[98px] flex items-center gap-x-1">
                <span className="text-xs text-[#9CA4AB] ">Ends in</span>
                <Statistic.Countdown
                  // value={new Date().getTime()}
                  value={Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30}
                  format="DD:HH:mm:ss"
                  onFinish={() => {
                    console.log("finished!");
                  }}
                  valueStyle={{
                    fontSize: "13px",
                    color: "#9CA4AB",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* button section */}
      <div className="mt-3 group-hover:flex hidden h-[45px] bg-primary items-center px-3 rounded-b-[16px] transition-all duration-500 ease-in-out">
        <div className="flex-grow font-bold text-sm text-center text-white">
          Buy now
        </div>

        <div className="h-[45px] w-[1px] bg-white"></div>

        {cart.items.find((item) => item._id === nft._id) ? (
          <div
            className="w-[15%] flex justify-center items-center"
            onClick={(e) => {
              e.stopPropagation();
              dispatch({
                type: "cart/removeFromCart",
                payload: nft,
              });

              message.success("Item removed from cart");
            }}
          >
            <BsCartDash className="text-[21px] text-white" />
          </div>
        ) : (
          <div
            className="w-[15%] flex justify-center items-center"
            onClick={(e) => {
              e.stopPropagation();
              // check if item is already in cart
              const item = cart.items.find((item) => item._id === nft._id);
              if (item) {
                message.error("Item already in cart");
                return;
              }

              dispatch({
                type: "cart/addToCart",
                payload: {
                  _id: nft._id,
                  picture: nft.picture,
                  title: nft.title,
                  price: 700,
                  parentCollection: nft.parentCollection,
                  rank: nft.rank,
                },
              });

              message.success("Item added to cart");
            }}
          >
            <BsCartPlus className="text-[21px] text-white" />
          </div>
        )}
      </div>
    </div>
  );
}

export default SingleNft;
