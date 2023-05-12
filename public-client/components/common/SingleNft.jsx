import Image from "next/image";
import { MdFavoriteBorder, MdFavorite, MdAccessTime } from "react-icons/md";
import currency from "../../images/Diamond_Shape.png";
import { Statistic, message } from "antd";
import { BsCartPlus, BsCartDash } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useState } from "react";
import Animated from "react-mount-animation";

function SingleNft({ nft }) {
  const cart = useSelector((state) => state.main.cart);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isFav, setIsFav] = useState(false);
  const [isHover, setIsHover] = useState(false);

  // add to cart handler
  const addToCartHandler = (e) => {
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
  };

  // remove from cart handler
  const removeFromCartHandler = (e) => {
    e.stopPropagation();
    dispatch({
      type: "cart/removeFromCart",
      payload: nft,
    });

    message.success("Item removed from cart");
  };

  return (
    <div
      className={`w-[321px] border border-solid  rounded-[16px] group cursor-pointer ${
        cart.items.find((item) => item._id === nft._id)
          ? "border-primary dark:border-primary"
          : "border-[#030E170F] dark:border-[#696969]"
      }`}
      onClick={() => {
        router.push(`/nft/${nft._id}`);
      }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="relative w-fit h-fit">
        <div className="h-[319px] w-[319px] overflow-hidden rounded-t-[16px]">
          <Image
            src={nft.picture}
            width={319}
            height={319}
            alt="nft"
            className="rounded-[16px] rounded-b-none !object-cover group-hover:scale-110 transition-all duration-500 ease-in-out"
          />
        </div>

        <div className="min-w-[52px] px-3 py-2 absolute left-[20px] top-4 bg-[#ED6400] rounded-[40px] text-white text-xs flex justify-center items-center">
          #{nft.rank}
        </div>
      </div>

      <div className="px-3">
        <div className="mt-2 flex justify-between ">
          <p className="text-sm font-bold text-primary">
            {nft.parentCollection.title}
          </p>
          <div className="flex items-center gap-x-1">
            <MdFavoriteBorder className="w-[18px] h-[18px] cursor-pointer" />
            <span className="font-extrabold">0</span>
          </div>
        </div>

        <h3 className="text-lg font-extrabold ">{nft.title}</h3>
      </div>

      <div className="h-[10%] mt-3">
        {isHover ? (
          <>
            {/* button section */}
            <Animated.div
              show={isHover}
              // mount animation zoomIn
              mountAnim={` 
              0% {
                opacity: 0;
                transform: scale(1) translateY(10%);
              }

              100% {
                opacity: 1;
                transform: scale(1) translateY(0%);
              }
              `}
              className="flex h-full bg-primary items-center px-3 rounded-b-[16px] mt-6 transition-all duration-300 ease-in-out"
            >
              <div className="flex-grow font-bold text-sm text-center text-white">
                Buy now
              </div>

              <div className=" w-[1px] h-[70%] bg-white"></div>

              {cart.items.find((item) => item._id === nft._id) ? (
                <div
                  className="w-[15%] flex justify-center items-center"
                  onClick={removeFromCartHandler}
                >
                  <BsCartDash className="text-[21px] text-white" />
                </div>
              ) : (
                <div
                  className="w-[15%] flex justify-center items-center"
                  onClick={addToCartHandler}
                >
                  <BsCartPlus className="text-[21px] text-white" />
                </div>
              )}
            </Animated.div>
          </>
        ) : (
          <>
            {/* price section */}
            <div className="h-full px-3 mb-3">
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
          </>
        )}
      </div>
    </div>
  );
}

export default SingleNft;
