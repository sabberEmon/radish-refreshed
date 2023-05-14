import Image from "next/image";
import { MdFavoriteBorder, MdFavorite, MdAccessTime } from "react-icons/md";
import currency from "../../images/Diamond_Shape.png";
import { Statistic, message } from "antd";
import { BsCartPlus, BsCartDash } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Animated from "react-mount-animation";
import { getButtonText } from "@/lib/utils";
import { useToggleLikeMutation } from "@/redux/features/api/apiSlice";

function SingleNft({ nft }) {
  const cart = useSelector((state) => state.main.cart);
  const root = useSelector((state) => state.main.root);
  const dispatch = useDispatch();
  const router = useRouter();

  const [toggleLike, { isLoading: toggleLikeLoading }] =
    useToggleLikeMutation();

  const [favCount, setFavCount] = useState(nft?.likes?.length);
  const [isFav, setIsFav] = useState(nft?.likes?.includes(root?.user?._id));
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    setIsFav(nft?.likes?.includes(root?.user?._id));
  }, [root.user, nft.likes]);

  // add to cart handler
  const addToCartHandler = (e) => {
    e.stopPropagation();
    // check if item is already in cart
    const item = cart.items.find((item) => item._id === nft._id);
    if (item) {
      message.error("Item already in cart");
      return;
    }

    if (!nft.price) {
      message.error("No price set for this item");
      return;
    }

    dispatch({
      type: "cart/addToCart",
      payload: {
        _id: nft._id,
        picture: nft.picture,
        title: nft.title,
        price: nft.price,
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

  const userWallets = root.user?.wallets || [];
  const result = getButtonText(
    {
      ownerWallet: nft.ownerWallet,
      onAuction: nft.onAuction,
      forSale: nft.forSale,
      bids: nft.bids,
    },
    userWallets
  );

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
          <div
            className="flex items-center gap-x-1 cursor-pointer "
            onClick={(e) => {
              e.stopPropagation();
              if (!root.user) {
                message.error("Please login first");
                return;
              }

              if (toggleLikeLoading) return;

              if (root.user.wallets.includes(nft.ownerWallet)) {
                message.error("You can't like your own NFT");
                return;
              }

              message.loading({
                content: "Please wait...",
                key: "like",
              });

              toggleLike({
                nftId: nft._id,
                userId: root.user._id,
              })
                .then((res) => {
                  if (res.data?.success) {
                    if (res.data.hasLiked) {
                      setIsFav(true);
                      setFavCount(favCount + 1);

                      console.log("nftOwner", res.data.nftOwner);

                      // emit socket event
                      if (res.data.nftOwner) {
                        console.log("emitting socket event");
                        root.socket.emit("save-new-individual-notification", {
                          for: res.data.nftOwner,
                          type: "user",
                          referenceUser: root.user?._id,
                          message: {
                            text: `User, liked your NFT ${nft.title}`,
                            link: `/nft/${nft._id}`,
                          },
                        });
                      }

                      message.success({
                        content: "Added to favourites",
                        key: "like",
                      });
                    } else {
                      setIsFav(false);
                      setFavCount(favCount - 1);
                      message.success({
                        content: "Removed from favourites",
                        key: "like",
                      });
                    }
                  }
                })
                .catch((err) => {
                  console.log(err);
                  message.error({
                    content: err?.data?.message || "Something went wrong",
                    key: "like",
                  });
                });
            }}
          >
            {isFav ? (
              <MdFavorite className="w-[18px] h-[18px] cursor-pointer text-primary" />
            ) : (
              <MdFavoriteBorder className="w-[18px] h-[18px] cursor-pointer" />
            )}
            <span className="font-extrabold">
              {favCount > 999 ? `${(favCount / 1000).toFixed(1)}k` : favCount}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-extrabold ">{nft.title}</h3>
      </div>

      <div className=" mt-3">
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
              className="flex h-[54px] bg-primary items-center px-3 rounded-b-[16px] transition-all duration-300 ease-in-out"
            >
              <div className="flex-grow font-bold text-sm text-center text-white">
                {result.text}
              </div>

              {result.cart && <div className=" w-[1px] h-[70%] bg-white"></div>}

              {result.cart && (
                <>
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
                </>
              )}
            </Animated.div>
          </>
        ) : (
          <>
            {/* price section */}
            <div className="px-3 h-[54px] pb-2">
              <div className="flex justify-between items-center">
                {result.displayBid && (
                  <span className="text-[#9CA4AB] text-xs">Highest bid</span>
                )}

                {result.displayLastSale && result.price && (
                  <span className="text-[#9CA4AB] text-xs">Last sale</span>
                )}

                {result.displayOnSale && (
                  <span className="text-sm font-bold text-primary capitalize">
                    On sale
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center mt-1 mb-1">
                {result.price && (
                  <div className="flex items-center gap-x-1">
                    <Image
                      src={currency}
                      width={16}
                      height={16}
                      alt="currency"
                    />
                    <span className="text-sm font-extrabold">
                      {result.displayBid ? result.highestBid : nft.price} XRD
                    </span>
                  </div>
                )}

                {result.displayBid && (
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
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SingleNft;
