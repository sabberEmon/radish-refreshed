import Container from "@/components/layouts/Container";
import Head from "next/head";
import axios from "axios";
import { MdAccessTime, MdKeyboardArrowLeft } from "react-icons/md";
import {
  Button,
  DatePicker,
  Empty,
  Input,
  Modal,
  Popconfirm,
  Popover,
  Statistic,
  Tabs,
  message,
} from "antd";
import Image from "next/image";
import profilePlaceholder from "../../images/avatar.png";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import { getPrice, getPriceText } from "@/lib/utils";
import { useState } from "react";
import currencyIcon from "../../images/Diamond_Shape.png";
import {
  useCreateAuctionMutation,
  useGetUsernamesQuery,
  useToggleLikeMutation,
} from "@/redux/features/api/apiSlice";
import WalletNumber from "@/components/utils/WalletNumber";
import NftButtons from "@/components/nft/NftButtons";
import BigNumber from "bignumber.js";
import Activities from "@/components/nft/Activities";
import ChartComponent from "@/components/nft/ChartComponent";
import CommentSection from "@/components/nft/CommentSection";
import SimilarNfts from "@/components/nft/SimilarNfts";

const safelyUnwrapAmount = (amount) => {
  const bigAmount = new BigNumber(amount);
  const amountInput = bigAmount.shiftedBy(18); // Atto
  const amountResult = amountInput.toFixed();

  return amountResult;
};

const getTransactionMessage = (nft) => {
  if (nft.ownerWallet === "Locked") {
    // this is minting
    if (nft.buyType === "random") {
      return `random`;
    } else {
      return `Mint NFT #${nft.referenceId}`;
    }
  } else {
    // this is trading
    return `trade for nft #${nft.referenceId}`;
  }
};

export default function Nft({ nft, collection, similarNfts, owner }) {
  const root = useSelector((state) => state.main.root);
  const router = useRouter();

  const [toggleLike, { isLoading: toggleLikeLoading }] =
    useToggleLikeMutation();
  const [createAuction, { isLoading: createAuctionLoading }] =
    useCreateAuctionMutation();
  const { data: usersData } = useGetUsernamesQuery();

  // states
  const [isLoved, setIsLoved] = useState(
    nft?.likes?.includes(root.user?._id) || false
  );
  const [loveCount, setLoveCount] = useState(nft?.likes?.length);
  const [createAuctionModal, setCreateAuctionModal] = useState(false);
  const [placeBidModal, setPlaceBidModal] = useState(false);
  const [seeBidsModal, setSeeBidsModal] = useState(false);
  const [acceptedBid, setAcceptedBid] = useState(null);
  const [listForSaleModal, setListForSaleModal] = useState(false);
  const [initalBidAmount, setInitialBidAmount] = useState(2);
  const [listForSaleAmount, setListForSaleAmount] = useState("");
  const [filters, setFilters] = useState(["all"]);
  const [minimumBid, setMinimumBid] = useState(0);

  const [bidHigherModal, setBidHigherModal] = useState(false);
  const [higherBidAmount, setHigherBidAmount] = useState(2);
  const [auctionEndDate, setAuctionEndDate] = useState("");

  // handlers
  const handleFavorite = async () => {
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
            setIsLoved(true);
            setLoveCount(loveCount + 1);

            // console.log("nftOwner", res.data.nftOwner);

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
            setIsLoved(false);
            setLoveCount(loveCount - 1);
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
  };

  const handleBuyNft = async () => {
    if (!root.actionWallet) {
      message.error("Please connect your wallet");
      return;
    }

    if (!nft.forSale && nft.ownerWallet !== "Locked") {
      message.error("This NFT is not listed for sale");
      return;
    }

    const tx = {
      actions: [
        {
          type: "TransferTokens",
          from_account: {
            address: root.actionWallet,
          },
          to_account: {
            address: collection.collectionWallet,
          },
          amount: {
            token_identifier: {
              rri: nft.rri, //
            },
            value: safelyUnwrapAmount(nft.price),
          },
        },
      ],
      message: getTransactionMessage(nft),
      encryptMessage: false,
    };
    if (root.actionWalletType === "z3us") {
      const response = await window.z3us.v1.submitTransaction(tx);
      // console.log("wallet response", response);
    } else if (root.actionWalletType === "xidar") {
      const response = await window.xidar.v1.submitTransaction(tx);
    }
  };

  const handleSellNft = async () => {
    if (!root.actionWallet) {
      message.error("Please connect your wallet");
      return;
    }

    const tx = {
      actions: [
        {
          type: "TransferTokens",
          from_account: {
            address: root.actionWallet,
          },
          to_account: {
            address: collection.collectionWallet,
          },
          amount: {
            token_identifier: {
              rri: nft.token, //
            },
            value: safelyUnwrapAmount(1),
          },
        },
      ],
      message: `List NFT #${nft.referenceId} for ${listForSaleAmount} xrd`,
      encryptMessage: false,
    };
    if (root.actionWalletType === "z3us") {
      const response = await window.z3us.v1.submitTransaction(tx);
      setListForSaleModal(false);
    } else if (root.actionWalletType === "xidar") {
      const response = await window.xidar.v1.submitTransaction(tx);
      setListForSaleModal(false);
    }
  };

  const handleRemoveFromSale = async () => {
    if (!root.actionWallet) {
      message.error("Please connect your wallet");
      return;
    }

    const tx = {
      actions: [
        {
          type: "TransferTokens",
          from_account: {
            address: root.actionWallet,
          },
          to_account: {
            address: collection.collectionWallet,
          },
          amount: {
            token_identifier: {
              rri: "xrd_rr1qy5wfsfh", //
            },
            value: safelyUnwrapAmount(1),
          },
        },
      ],
      message: `Cancel listing for NFT #${nft.referenceId}`,
      encryptMessage: false,
    };

    if (root.actionWalletType === "z3us") {
      const response = await window.z3us.v1.submitTransaction(tx);
    } else if (root.actionWalletType === "xidar") {
      const response = await window.xidar.v1.submitTransaction(tx);
    }
  };

  const handleAcceptBid = async () => {
    if (!root.actionWallet) {
      message.error("Please connect your wallet");
      return;
    }
    if (!acceptedBid.bid || !acceptedBid.wallet) {
      message.error("Please select a bid");
      return;
    }

    const tx = {
      actions: [
        {
          type: "TransferTokens",
          from_account: {
            address: root.actionWallet,
          },
          to_account: {
            address: collection.collectionWallet,
          },
          amount: {
            token_identifier: {
              rri: "xrd_rr1qy5wfsfh", //
            },
            value: safelyUnwrapAmount(1),
          },
        },
      ],
      message: `accept bid from ${acceptedBid.wallet.slice(
        //last 6 characters
        acceptedBid.wallet.length - 6,
        acceptedBid.wallet.length
      )} for nft #${nft.referenceId}`,
      encryptMessage: false,
    };

    if (root.actionWalletType === "z3us") {
      const response = await window.z3us.v1.submitTransaction(tx);
      setSeeBidsModal(false);
    } else if (root.actionWalletType === "xidar") {
      const response = await window.xidar.v1.submitTransaction(tx);
      setSeeBidsModal(false);
    }
  };

  const handleCreateAuction = async () => {
    if (!root.actionWallet) {
      message.error("Please connect your wallet");
      return;
    }

    // check if the auction end date is greater than the current date
    if (new Date(auctionEndDate).getTime() < new Date().getTime()) {
      message.error("Auction end date must be greater than the current date");
      return;
    }
    // check if the day difference is greater than 10
    if (
      Math.floor(
        (new Date(auctionEndDate).getTime() - new Date().getTime()) /
          (1000 * 3600 * 24)
      ) +
        1 >
      10
    ) {
      message.error("Max auction duration is 10 days");
      return;
    }

    const tx = {
      actions: [
        {
          type: "TransferTokens",
          from_account: {
            address: root.actionWallet,
          },
          to_account: {
            address: collection.collectionWallet,
          },
          amount: {
            token_identifier: {
              rri: nft.token, //
            },
            value: safelyUnwrapAmount(1),
          },
        },
      ],
      // "Start Auction for NFT #[referenceId] for [value] days"
      // get the difference between the current date and the auction end date
      message: `start auction for nft #${nft.referenceId} for ${
        // days difference
        Math.floor(
          (new Date(auctionEndDate).getTime() - new Date().getTime()) /
            (1000 * 3600 * 24)
        ) + 1 || 10
      } days`,
      encryptMessage: false,
    };

    if (root.actionWalletType === "z3us") {
      const response = await window.z3us.v1.submitTransaction(tx);

      if (response && response?.txID) {
        createAuction({
          nftId: router.query.nftId,
          minimumBid: Number(minimumBid),
          endDate: auctionEndDate,
        }).then((res) => {
          if (res?.data?.success) {
            // message.success("Auction created successfully");
            router.reload();
            setCreateAuctionModal(false);
          }
        });
      }
    } else if (root.actionWalletType === "xidar") {
      const response = await window.xidar.v1.submitTransaction(tx);

      if (response && response?.txID) {
        createAuction({
          nftId: router.query.nftId,
          minimumBid: Number(minimumBid),
          endDate: auctionEndDate,
        }).then((res) => {
          if (res?.data?.success) {
            // message.success("Auction created successfully");
            setCreateAuctionModal(false);
            router.reload();
          }
        });
      }
    }
  };

  const handleCancelAuction = async () => {
    if (!root.actionWallet) {
      message.error("Please connect your wallet");
      return;
    }

    const tx = {
      actions: [
        {
          type: "TransferTokens",
          from_account: {
            address: root.actionWallet,
          },
          to_account: {
            address: collection.collectionWallet,
          },
          amount: {
            token_identifier: {
              rri: "xrd_rr1qy5wfsfh", //
            },
            value: safelyUnwrapAmount(10),
          },
        },
      ],
      message: `cancel auction for nft #${nft.referenceId}`,
      encryptMessage: false,
    };

    if (root.actionWalletType === "z3us") {
      const response = await window.z3us.v1.submitTransaction(tx);
    } else if (root.actionWalletType === "xidar") {
      const response = await window.xidar.v1.submitTransaction(tx);
    }
  };

  const handleCancelBid = async () => {
    if (!root.actionWallet) {
      message.error("Please connect your wallet");
      return;
    }

    const tx = {
      actions: [
        {
          type: "TransferTokens",
          from_account: {
            address: root.actionWallet,
          },
          to_account: {
            address: collection.collectionWallet,
          },
          amount: {
            token_identifier: {
              rri: "xrd_rr1qy5wfsfh", //
            },
            value: safelyUnwrapAmount(1),
          },
        },
      ],
      message: `cancel bid for nft #${nft.referenceId}`,
      encryptMessage: false,
    };

    if (root.actionWalletType === "z3us") {
      const response = await window.z3us.v1.submitTransaction(tx);

      if (response && response?.txID) {
        message.success("Bid cancelled successfully");

        root.socket.emit("save-new-individual-notification", {
          for: owner ? owner._id : collection.creator._id,
          type: "user",
          referenceUser: root.user?._id,
          message: {
            text: `User, cancelled a bid on your NFT`,
            link: `/nft/${nft._id}`,
          },
        });
      }
    } else if (root.actionWalletType === "xidar") {
      const response = await window.xidar.v1.submitTransaction(tx);

      if (response && response?.txID) {
        message.success("Bid cancelled successfully");
        root.socket.emit("save-new-individual-notification", {
          for: owner ? owner._id : collection.creator._id,
          type: "user",
          referenceUser: root.user?._id,
          message: {
            text: `User, cancelled a bid on your NFT`,
            link: `/nft/${nft._id}`,
          },
        });
      }
    }
  };

  const tabItems = [
    {
      key: "1",
      label: <span className="font-bold text-sm">Ownership</span>,
      children: (
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-x-2 ">
            {nft.ownerWallet !== "Locked" ? (
              <Image
                src={owner?.profilePicture || profilePlaceholder}
                width={36}
                height={36}
                className="rounded-full cursor-pointer"
                onClick={() => {
                  if (owner) {
                    router.push(`/profile/${owner?._id}`);
                  } else {
                    message.error("User not found");
                  }
                }}
                alt="profile picture"
              />
            ) : (
              <Image
                src={collection.creator?.profilePicture || profilePlaceholder}
                width={36}
                height={36}
                className="rounded-full cursor-pointer"
                onClick={() => {
                  if (owner?._id) {
                    router.push(`/profile/${owner?._id}`);
                  } else if (collection.creator?._id) {
                    router.push(`/profile/${collection.creator?._id}`);
                  }
                }}
                alt="profile picture"
              />
            )}
            <span
              className="text-sm font-bold cursor-pointer"
              onClick={() => {
                if (owner?._id) {
                  router.push(`/profile/${owner?._id}`);
                } else if (collection.creator?._id) {
                  router.push(`/profile/${collection.creator?._id}`);
                }
              }}
            >
              {nft.ownerWallet !== "Locked"
                ? owner?.name || "N/A"
                : collection.creator?.name}
            </span>
          </div>
          {nft.ownerWallet === "Locked" ? (
            <span className="text-[#979797] text-sm">Locked</span>
          ) : (
            <WalletNumber walletNumber={nft.ownerWallet} />
          )}
        </div>
      ),
    },
    {
      key: "2",
      label: <span className="font-bold text-sm">Bids</span>,
      children:
        nft.bids?.length > 0 ? (
          <div className="space-y-3 mt-2 ">
            {
              // sort bids by highest amount
              nft.bids
                ?.sort((a, b) => b.bid - a.bid)
                .map((bid) => (
                  <div
                    className="flex justify-between items-center"
                    key={bid.wallet}
                  >
                    <div className="flex items-center gap-x-2 ">
                      <Image
                        src={bid?.bidder?.profilePicture || profilePlaceholder}
                        width={36}
                        height={36}
                        className={`rounded-full ${
                          bid?.bidder && "cursor-pointer"
                        }`}
                        onClick={() => {
                          if (bid?.bidder)
                            router.push(`/profile/${bid?.bidder?.id}`);
                        }}
                        alt="profile picture"
                      />
                      <div className="">
                        <p className="text-sm font-bold ">
                          {bid?.bidder?.name || "N/A"}
                        </p>
                        <WalletNumber walletNumber={bid.wallet} style="!m-0" />
                      </div>
                    </div>

                    <span className="text-[#979797] text-sm">
                      {bid.bid} XRD
                    </span>
                  </div>
                ))
            }
          </div>
        ) : (
          <div className="">
            <Empty
              description="No bids yet"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ),
    },
  ];

  const tabItems2 = [
    {
      key: "1",
      label: <span className="font-bold text-lg">Activity</span>,
      children: (
        <div className="h-full py-2">
          {/* <p className="text-[#979797] text-sm text-center">No activity yet</p> */}
          {nft.activities?.length > 0 ? (
            <Activities
              activities={nft.activities?.sort((a, b) => b.date - a.date)}
            />
          ) : (
            <Empty
              description="No activity yet"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </div>
      ),
    },
    {
      key: "2",
      label: <span className="font-bold text-lg">Comments</span>,
      children: (
        <div className="">
          <CommentSection
            users={usersData?.users}
            nft={nft}
            owner={owner}
            collection={collection}
          />
        </div>
      ),
    },
    {
      key: "3",
      label: <span className="font-bold text-lg">Attributes</span>,
      children: (
        <div className="h-full py-4">
          {/* <p className="text-[#979797] text-sm text-center">No activity yet</p> */}
          {nft.attributes?.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 xl:grid-cols-3">
              {nft.attributes?.map((attribute) => {
                return (
                  <div
                    className="border border-solid border-[#CFDBD599] rounded-[12px] text-center py-2 px-3"
                    key={attribute.trait_type}
                  >
                    <p className="text-primary text-center text-xs uppercase font-bold">
                      {attribute.trait_type}
                    </p>
                    <p className="font-semibold">{attribute.value}</p>
                    <p className="text-sm text-secondaryDarkGray mt-1">
                      {attribute.percentage?.toFixed(2)}% have this trait
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <Empty
              description="No data found"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </div>
      ),
    },
  ];

  const availableFilters = [
    {
      name: "all",
      displayName: "All",
    },
    {
      name: "Last 6 months",
      displayName: "Last 6 months",
    },
    {
      name: "Month",
      displayName: "Month",
    },
  ];

  return (
    <>
      <Head>
        <title>{nft.title} | Radish Square</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <>
          <div className="md:hidden max-w-[1440px] mx-auto lg:px-[48px] md:px-[24px] sm:px-[24px] px-[24px]">
            <div
              className={`flex w-full justify-between items-center relative h-14 mt-0`}
            >
              <Button
                className={`bg-[#EBF0F080] border-none `}
                shape="circle"
                icon={<MdKeyboardArrowLeft className="text-xl mt-[1.5px]" />}
                onClick={() => router.back()}
              />
              <p className="text-center font-bold">About NFT</p>
              <Image
                src={root?.user?.profilePicture || profilePlaceholder}
                width={32}
                height={32}
                className="rounded-full"
                alt="profile picture"
              />
            </div>
          </div>

          <main className="max-w-[1440px] mx-auto px-3">
            <section className="hidden md:block">
              <Button
                className="ml-11 mt-6 flex items-center"
                icon={<MdKeyboardArrowLeft className="text-xl" />}
                onClick={() => {
                  router.push(`/collection/${collection.collectionIdentifier}`);
                }}
              >
                Back to collection
              </Button>
            </section>

            <section className="flex mt-0 md:mt-14 flex-col md:flex-row gap-3 md:gap-7  xl:gap-14">
              <div className="w-full md:w-1/2 lg:pl-[48px] md:pl-[24px] sm:pl-[0px] pl-0 px-[0px]">
                <div
                  className={`image-container ${
                    collection.collectionIdentifier === "gameoflife" &&
                    "md:max-h-[600px] xl:max-h-[700px] max-h-[400px] overflow-hidden"
                  }`}
                >
                  <Image
                    // src={nftPlaceholder}
                    src={nft.picture}
                    alt="NFT"
                    layout="fill"
                    className="object-cover rounded-none md:rounded-[16px] image"
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2 lg:pr-[48px] md:pr-[24px] sm:pr-[24px] pr-[5px]">
                <div className="flex items-center justify-between w-full">
                  <div
                    className="min-w-[60px] h-[46px] border border-solid border-[#CFDBD599] rounded-[12px] flex items-center justify-center gap-2 font-bold px-3 cursor-pointer"
                    onClick={handleFavorite}
                  >
                    {isLoved ? (
                      <MdFavorite className="h-5 w-5 text-primary" />
                    ) : (
                      <MdFavoriteBorder className="h-5 w-5 text-[#030E17] dark:text-white" />
                    )}
                    <span>{loveCount}</span>
                  </div>

                  {nft?.onAuction && (
                    <div className=" w-[140px] h-[43px] bg-white dark:bg-secondaryBlack text-secondaryBlack rounded-[12px] left-4 top-4 px-3 flex items-center justify-between gap-x-2 !text-xs font-bold border border-solid border-[#CFDBD599]">
                      <MdAccessTime className=" font-bold text-xl cursor-pointer text-secondaryBlack dark:text-white" />
                      {nft?.endDate && (
                        <div className="w-[100px]">
                          {" "}
                          <Statistic.Countdown
                            value={new Date(nft?.endDate).getTime()}
                            format="DD:HH:mm:ss"
                            onFinish={() => {
                              // console.log("finished!");
                            }}
                            valueStyle={{
                              fontSize: "14px",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {nft.attributes?.length > 0 && (
                    <Popover
                      title={
                        <p className="text-center font-bold text-secondaryBlack pt-[10px]">
                          <span className="text-primary">#{nft.rank}</span>{" "}
                          based on rarity rank with a score of{" "}
                          <span className="text-primary">
                            {nft.totalRarityScore}
                          </span>
                        </p>
                      }
                      style={{
                        boxShadow: "none",
                      }}
                      placement="left"
                      color="white"
                      className="!border !border-solid !border-[#CFDBD599] rounded-[12px] !flex justify-center !items-center"
                    >
                      <Button className="w-[66px] h-[46px] rounded-[12px] flex justify-center items-center font-bold">
                        {/* <EllipsisHorizontalIcon className="h-6 w-6" /> */}#{" "}
                        {nft.rank}
                      </Button>
                    </Popover>
                  )}
                </div>

                <div className="mt-6">
                  <div className="text-[24px] sm:text-[40px] font-extrabold flex items-center">
                    <h2>{nft.title}</h2>
                  </div>

                  {(nft.forSale ||
                    nft.ownerWallet === "Locked" ||
                    nft.onAuction) && (
                    <h2 className="text-[20px] sm:text-[30px] font-bold my-2 flex items-center gap-x-2">
                      {nft.onAuction && (
                        <span className="">
                          {`${getPriceText(nft, root?.user?.wallet)}    `}
                        </span>
                      )}
                      <Image
                        src={currencyIcon}
                        alt="Currency"
                        width={30}
                        height={30}
                        className="mr-0 hidden sm:block"
                      />
                      <Image
                        src={currencyIcon}
                        alt="Currency"
                        width={22}
                        height={22}
                        className="mr-0 block sm:hidden"
                      />
                      {nft?.onAuction
                        ? `${getPrice(nft, root?.user?.wallet)}`
                        : nft.price}{" "}
                      XRD
                    </h2>
                  )}
                  {nft.buyType === "random" &&
                    nft.price &&
                    !nft.onAuction &&
                    nft.ownerWallet === "Locked" && (
                      <p className="my-2 text-sm font-semibold">
                        Please Note: This collection has a random minting and
                        you will not be guaranteed the NFT you see.
                      </p>
                    )}
                  <p className="my-3 mb-6 text-[#979797] text-sm leading-[21px]">
                    {nft.description}
                  </p>
                </div>
                <div className="w-full xl:w-[70%]">
                  <div className="mt-4 mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-[#94999D] text-[12px]">Creator</p>
                      <div className="flex items-center gap-x-2 mt-2">
                        <Image
                          src={
                            collection.creator.profilePicture ||
                            profilePlaceholder
                          }
                          width={36}
                          height={36}
                          className="rounded-full cursor-pointer"
                          onClick={() =>
                            router.push(`/profile/${collection.creator._id}`)
                          }
                          alt="Profile Picture"
                        />
                        <span
                          className="text-sm font-bold cursor-pointer"
                          onClick={() =>
                            router.push(`/profile/${collection.creator._id}`)
                          }
                        >
                          {collection.creator.name}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-[#94999D] text-[12px]">Collection</p>
                      <div className="flex items-center gap-x-2 mt-2">
                        <Image
                          src={
                            collection.collectionProfilePicture ||
                            profilePlaceholder
                          }
                          width={36}
                          height={36}
                          className="rounded-full cursor-pointer"
                          onClick={() => {
                            router.push(
                              `/collection/${collection.collectionIdentifier}`
                            );
                          }}
                          alt="Profile Picture"
                        />
                        <span
                          className="text-sm font-bold cursor-pointer"
                          onClick={() => {
                            router.push(
                              `/collection/${collection.collectionIdentifier}`
                            );
                          }}
                        >
                          {collection.title}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Tabs defaultActiveKey="1" items={tabItems} />
                  </div>

                  <div className="flex justify-between flex-col items-center mt-12 sm:flex-row gap-6 gap-x-4">
                    <NftButtons
                      nft={nft}
                      handleBuyNft={handleBuyNft}
                      setListForSaleModal={setListForSaleModal}
                      setCreateAuctionModal={setCreateAuctionModal}
                      setPlaceBidModal={setPlaceBidModal}
                      setSeeBidsModal={setSeeBidsModal}
                      handleRemoveFromSale={handleRemoveFromSale}
                      handleCancelAuction={handleCancelAuction}
                      setBidHigherModal={setBidHigherModal}
                      handleCancelBid={handleCancelBid}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-[48px] flex-col md:flex-row flex w-full justify-between gap-3 md:gap-7  xl:gap-14 lg:px-[48px] md:px-[24px] sm:px-[24px] px-[24px]">
              <div className="w-full md:w-1/2 ">
                <Tabs defaultActiveKey="2" items={tabItems2} size="large" />
              </div>

              <div className="w-full md:w-1/2  pb-4 border-solid border-[#CFDBD599] rounded-[16px] border h-fit">
                <div className="border-b-[1px] border-t-0 border-l-0 border-r-0 border-solid border-[#CFDBD599] py-3 px-4 flex justify-between items-center flex-row">
                  <p className=" text-lg font-bold">Price history</p>
                  <div className="flex">
                    {availableFilters.map((filter) => {
                      return (
                        <div
                          className={`px-4 h-[38px] text-sm opacity-80 flex justify-center items-center cursor-pointer mx-2 ${
                            filters.includes(filter.name)
                              ? "dark:text-white"
                              : "text-[#979797] "
                          }`}
                          key={filter.name}
                          onClick={() => {
                            // if filter includes all, remove all and add the clicked filter
                            if (filters.includes("all")) {
                              setFilters([filter.name]);
                              return;
                            }

                            if (filter.name === "all") {
                              setFilters(["all"]);
                              return;
                            }

                            if (filters.includes(filter.name)) {
                              setFilters(
                                filters.filter((f) => f !== filter.name)
                              );
                            } else {
                              setFilters([...filters, filter.name]);
                            }
                          }}
                        >
                          {filter.displayName}
                        </div>
                      );
                    })}
                  </div>
                </div>
                {nft.priceHistory.length > 0 ? (
                  <>
                    <div className="flex px-4 my-2 items-center gap-x-2 mb-6">
                      <div className="h-[12px] w-[12px] rounded-full bg-primary"></div>
                      <p className="text-secondaryGray text-sm">
                        All Time Avg. Price{" "}
                        <span className="font-bold ">
                          {" "}
                          {
                            // determine the average price
                            (
                              nft.priceHistory?.reduce((acc, curr) => {
                                return acc + curr.price;
                              }, 0) / nft.priceHistory?.length
                            ).toFixed(2)
                          }{" "}
                          XRD
                        </span>
                      </p>
                    </div>
                    <ChartComponent
                      xData={["", "", "", "", "", "", "", "", "", "", "", ""]}
                      yData={nft.priceHistory?.map((p) => p.price)}
                      canvasHeight="300px"
                    />
                  </>
                ) : (
                  <div className="h-[200px] py-6 text-center">
                    <Empty
                      description="No price history yet"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  </div>
                )}
              </div>
            </section>

            <section className="my-6 sm:my-12 md:my-24 w-full lg:px-[48px] md:px-[24px] sm:px-[24px] px-[24px]">
              <p className="text-[20px] sm:text-[28px] font-bold  my-6">
                More from this collection
              </p>
              <SimilarNfts nfts={similarNfts} />
            </section>
          </main>

          <Modal
            open={createAuctionModal}
            onOk={() => {}}
            onCancel={() => {
              setCreateAuctionModal(false);
            }}
            width={400}
            className="!rounded-[16px]"
            style={{ borderRadius: "16px" }}
            footer={
              <div className="flex justify-center gap-x-5">
                <Button
                  key="back"
                  className="w-[132px] h-[43px] font-bold rounded-[12px]"
                  onClick={() => {
                    setCreateAuctionModal(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  key="submit"
                  type="primary"
                  className="w-[132px] h-[43px] font-bold rounded-[12px]"
                  loading={createAuctionLoading}
                  onClick={() => {
                    if (!minimumBid) {
                      return message.error("Minimum bid is required");
                    }

                    if (!root.actionWallet) {
                      return message.error("Please connect wallet first");
                    }

                    handleCreateAuction();
                  }}
                >
                  Start auction
                </Button>
              </div>
            }
          >
            <h2 className="font-extrabold text-[24px] text-center mt-3 mb-6">
              Start auction
            </h2>
            <div>
              <div className="w-full mt-4">
                <div className="flex justify-start items-center">
                  <label
                    htmlFor="minimumBid"
                    className="block sm:text-bold dark:hidden sm:dark:block"
                  >
                    Minimum bid
                  </label>
                </div>
                <Input
                  id="minimumBid"
                  type="number"
                  name="minimumBid"
                  value={minimumBid}
                  suffix={
                    <Image
                      src={currencyIcon}
                      alt="Currency"
                      width={22}
                      height={22}
                      className=""
                    />
                  }
                  onChange={(e) => {
                    setMinimumBid(e.target.value);
                  }}
                  size="large"
                  placeholder="Enter minimum bid"
                  style={{
                    borderRadius: "24px",
                  }}
                  className=" w-full py-3 px-5 placeholder:text-secondaryGray placeholder:font-normal placeholder:text-sm  mt-2"
                />
              </div>

              <div className="w-full flex items-center justify-between my-0"></div>

              <div className="w-full  mt-3 mb-10">
                <div>
                  <label
                    htmlFor="minimumBid"
                    className="block sm:text-bold dark:hidden sm:dark:block mb-2"
                  >
                    End date
                  </label>
                  <DatePicker
                    // value={auctionEndDate}
                    onChange={(date, dateString) => {
                      setAuctionEndDate(dateString);
                    }}
                    className="text-sm font-bold w-full"
                    size="large"
                    style={{
                      borderRadius: "24px",
                      fontWeight: "bold",
                    }}
                  />
                </div>
              </div>
            </div>
          </Modal>

          {/* see bids modal */}
          <Modal
            open={seeBidsModal}
            onOk={() => {}}
            onCancel={() => {
              setSeeBidsModal(false);
            }}
            className="!rounded-[16px]"
            style={{ borderRadius: "16px" }}
            footer={null}
          >
            <h2 className="font-extrabold text-[24px] text-center mt-3 mb-6">
              All bids
            </h2>
            <div>
              {nft.bids?.length > 0 ? (
                <div className="space-y-3 mt-2">
                  {
                    // sort bids by highest amount
                    nft.bids
                      ?.sort((a, b) => b.bid - a.bid)
                      .map((bid) => (
                        <div
                          className="flex justify-between items-center"
                          key={bid.wallet}
                        >
                          <div>
                            <div className="flex items-center gap-x-2">
                              <Image
                                src={
                                  bid?.bidder?.profilePicture ||
                                  profilePlaceholder
                                }
                                width={40}
                                height={40}
                                className={`rounded-full ${
                                  bid?.bidder && "cursor-pointer"
                                }`}
                                onClick={() => {
                                  if (bid?.bidder)
                                    router.push(`/profile/${bid?.bidder?.id}`);
                                }}
                                alt="Profile Picture"
                              />
                              <div>
                                <WalletNumber
                                  walletNumber={bid.wallet}
                                  style="p-0 !m-0"
                                />
                                <span className="font-bold text-sm">
                                  {bid.bid} XRD
                                </span>
                              </div>
                            </div>
                          </div>
                          <Popconfirm
                            title={`Are you sure to accept bid for ${acceptedBid?.bid} XRD?`}
                            onConfirm={() => {
                              handleAcceptBid();
                            }}
                            onCancel={() => {}}
                            okText="Yes"
                            placement="rightBottom"
                            cancelText="No"
                          >
                            <Button
                              type="primary"
                              onClick={() => {
                                setAcceptedBid(bid);
                              }}
                            >
                              Accept
                            </Button>
                          </Popconfirm>
                        </div>
                      ))
                  }
                </div>
              ) : (
                <div className="py-2">
                  <Empty
                    description="No bids yet"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                </div>
              )}
            </div>
          </Modal>

          {/* place initial bid modal */}
          <Modal
            open={placeBidModal}
            onOk={() => {}}
            width={400}
            onCancel={() => {
              setPlaceBidModal(false);
            }}
            className="!rounded-[16px]"
            style={{ borderRadius: "16px" }}
            footer={
              <div className="flex justify-center gap-x-5">
                <Button
                  key="back"
                  className="w-[132px] h-[43px] font-bold rounded-[12px]"
                  onClick={() => {
                    setPlaceBidModal(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  key="submit"
                  type="primary"
                  className="w-[132px] h-[43px] font-bold rounded-[12px]"
                  loading={createAuctionLoading}
                  onClick={async function () {
                    if (!root.actionWallet) {
                      return message.error("Please connect wallet first");
                    }

                    if (nft.endDate && nft.endDate < new Date().toISOString()) {
                      return message.error("Auction has ended");
                    }

                    if (!initalBidAmount) {
                      return message.error("Bid amount is required");
                    }
                    if (initalBidAmount < 2) {
                      return message.error(
                        "Bid amount must be more than 1 XRD"
                      );
                    }

                    if (initalBidAmount < nft.minimumBid) {
                      return message.error(
                        `Bid amount must be more than ${nft.minimumBid} XRD`
                      );
                    }

                    const tx = {
                      actions: [
                        {
                          type: "TransferTokens",
                          from_account: {
                            address: root.actionWallet,
                          },
                          to_account: {
                            address: collection.collectionWallet,
                          },
                          amount: {
                            token_identifier: {
                              rri: "xrd_rr1qy5wfsfh", //
                            },
                            value: safelyUnwrapAmount(initalBidAmount),
                          },
                        },
                      ],
                      message: `bid on nft #${nft.referenceId} for ${initalBidAmount} xrd`,
                      encryptMessage: false,
                    };

                    if (root.actionWalletType === "z3us") {
                      const response = await window.z3us.v1.submitTransaction(
                        tx
                      );
                      setPlaceBidModal(false);
                      if (response && response?.txID) {
                        message.success("Bid placed successfully");

                        root.socket.emit("save-new-individual-notification", {
                          for: owner ? owner._id : collection.creator._id,
                          type: "user",
                          referenceUser: root.user?._id,
                          message: {
                            text: `User, placed a bid on your NFT`,
                            link: `/nft/${nft._id}`,
                          },
                        });
                      }
                    } else if (root.actionWalletType === "xidar") {
                      const response = await window.xidar.v1.submitTransaction(
                        tx
                      );
                      setPlaceBidModal(false);

                      if (response && response?.txID) {
                        message.success("Bid placed successfully");
                        root.socket.emit("save-new-individual-notification", {
                          for: owner ? owner._id : collection.creator._id,
                          type: "user",
                          referenceUser: root.user?._id,
                          message: {
                            text: `User, placed a bid on your NFT`,
                            link: `/nft/${nft._id}`,
                          },
                        });
                      }
                    }
                  }}
                >
                  Place bid
                </Button>
              </div>
            }
          >
            <h2 className="font-extrabold text-[24px] text-center mt-3 mb-6">
              Place a bid
            </h2>
            <div>
              <div className="w-full mt-6 mb-10">
                <div className="flex justify-start items-center">
                  <label
                    htmlFor="intialBidAmount"
                    className="block sm:text-bold dark:hidden sm:dark:block"
                  >
                    Bid amount
                  </label>
                </div>
                <Input
                  id="intialBidAmount"
                  type="number"
                  name="intialBidAmount"
                  value={initalBidAmount}
                  onChange={(e) => {
                    setInitialBidAmount(e.target.value);
                  }}
                  size="large"
                  suffix={
                    <Image
                      src={currencyIcon}
                      alt="Currency"
                      width={22}
                      height={22}
                      className=""
                    />
                  }
                  placeholder="Enter your bid amount"
                  style={{
                    borderRadius: "24px",
                  }}
                  className=" w-full py-3 px-5 placeholder:text-secondaryGray placeholder:font-normal placeholder:text-sm  mt-2"
                />
              </div>
            </div>
          </Modal>

          {/* bid higher modal */}
          <Modal
            open={bidHigherModal}
            onOk={() => {}}
            onCancel={() => {
              setBidHigherModal(false);
            }}
            width={400}
            className="!rounded-[16px]"
            style={{ borderRadius: "16px" }}
            footer={
              <div className="flex justify-center gap-x-5">
                <Button
                  key="back"
                  className="w-[132px] h-[43px] font-bold rounded-[12px]"
                  onClick={() => {
                    setBidHigherModal(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  key="submit"
                  type="primary"
                  className="w-[132px] h-[43px] font-bold rounded-[12px]"
                  loading={createAuctionLoading}
                  onClick={async function () {
                    if (!root.actionWallet) {
                      return message.error("Please connect wallet first");
                    }

                    if (nft.endDate && nft.endDate < new Date().toISOString()) {
                      return message.error("Auction has ended");
                    }

                    if (!higherBidAmount) {
                      return message.error("Increase amount is required");
                    }

                    if (higherBidAmount < 2) {
                      return message.error(
                        "Increase amount must be more than 1 XRD"
                      );
                    }

                    const tx = {
                      actions: [
                        {
                          type: "TransferTokens",
                          from_account: {
                            address: root.actionWallet,
                          },
                          to_account: {
                            address: collection.collectionWallet,
                          },
                          amount: {
                            token_identifier: {
                              rri: "xrd_rr1qy5wfsfh", //
                            },
                            value: safelyUnwrapAmount(higherBidAmount),
                          },
                        },
                      ],
                      message: `bid higher on nft #${nft.referenceId} for ${higherBidAmount} xrd`, // bid higher memo
                      encryptMessage: false,
                    };

                    if (root.actionWalletType === "z3us") {
                      const response = await window.z3us.v1.submitTransaction(
                        tx
                      );
                      if (response && response?.txID) {
                        message.success("Bid placed successfully");

                        root.socket.emit("save-new-individual-notification", {
                          for: owner ? owner._id : collection.creator._id,
                          type: "user",
                          referenceUser: root.user?._id,
                          message: {
                            text: `User, placed a bid on your NFT`,
                            link: `/nft/${nft._id}`,
                          },
                        });

                        setBidHigherModal(false);
                      }
                    } else if (root.actionWalletType === "xidar") {
                      const response = await window.xidar.v1.submitTransaction(
                        tx
                      );
                      if (response && response?.txID) {
                        message.success("Bid placed successfully");

                        root.socket.emit("save-new-individual-notification", {
                          for: owner ? owner._id : collection.creator._id,
                          type: "user",
                          referenceUser: root.user?._id,
                          message: {
                            text: `User, placed a bid on your NFT`,
                            link: `/nft/${nft._id}`,
                          },
                        });

                        setBidHigherModal(false);
                      }
                    }
                  }}
                >
                  Place bid
                </Button>
              </div>
            }
          >
            <h2 className="font-extrabold text-[24px] text-center mt-3 mb-6">
              Place a higher bid
            </h2>
            <div>
              <div className="w-full mt-6 mb-10">
                <div className="flex justify-start items-center">
                  <label
                    htmlFor="higherBidAmount"
                    className="block sm:text-bold dark:hidden sm:dark:block"
                  >
                    Increase amount
                  </label>
                </div>
                <Input
                  id="higherBidAmount"
                  type="number"
                  name="higherBidAmount"
                  value={higherBidAmount}
                  suffix={
                    <Image
                      src={currencyIcon}
                      alt="Currency"
                      width={22}
                      height={22}
                      className=""
                    />
                  }
                  onChange={(e) => {
                    setHigherBidAmount(e.target.value);
                  }}
                  size="large"
                  placeholder="How much will you increase your bid for?"
                  style={{
                    borderRadius: "24px",
                  }}
                  className=" w-full py-3 px-5 placeholder:text-secondaryGray placeholder:font-normal placeholder:text-sm  mt-2"
                />
              </div>
            </div>
          </Modal>

          {/* list for sale modal */}
          <Modal
            open={listForSaleModal}
            onOk={() => {}}
            onCancel={() => {
              setListForSaleModal(false);
            }}
            width={400}
            className="!rounded-[16px]"
            style={{ borderRadius: "16px" }}
            footer={
              <div className="flex justify-center gap-x-5">
                <Button
                  key="back"
                  className="w-[132px] h-[43px] font-bold rounded-[12px]"
                  onClick={() => {
                    setListForSaleModal(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  key="submit"
                  type="primary"
                  className="w-[132px] h-[43px] font-bold rounded-[12px]"
                  loading={createAuctionLoading}
                  onClick={async function () {
                    if (!listForSaleAmount) {
                      return message.error("List amount is required");
                    }

                    if (!root.actionWallet) {
                      return message.error("Please connect wallet first");
                    }

                    handleSellNft();
                  }}
                >
                  List for sale
                </Button>
              </div>
            }
          >
            <h2 className="font-extrabold text-[24px] text-center mt-3 mb-6">
              List your NFT for sale
            </h2>
            <div>
              <div className="w-full mt-6 mb-10">
                <div className="flex justify-start items-center">
                  <label
                    htmlFor="listForSaleAmount"
                    className="block sm:text-bold dark:hidden sm:dark:block"
                  >
                    List amount
                  </label>
                </div>
                <Input
                  id="listForSaleAmount"
                  type="number"
                  name="listForSaleAmount"
                  suffix={
                    <Image
                      src={currencyIcon}
                      alt="Currency"
                      width={22}
                      height={22}
                      className=""
                    />
                  }
                  value={listForSaleAmount}
                  onChange={(e) => {
                    setListForSaleAmount(e.target.value);
                  }}
                  size="large"
                  placeholder="Enter how much you want to list for"
                  style={{
                    borderRadius: "24px",
                  }}
                  className=" w-full py-3 px-5 placeholder:text-secondaryGray placeholder:font-normal  placeholder:text-sm  mt-2"
                />
              </div>
            </div>
          </Modal>
        </>
      </Container>
    </>
  );
}

// fetch data from server
export async function getServerSideProps(context) {
  const { nftId } = context.query;

  const response = await axios.get(
    `${process.env.API_BASE_URL}/api/nfts/nft/${nftId}`
  );

  // console.log(response.data);

  return {
    props: {
      nft: response.data.nft,
      collection: response.data.collection,
      similarNfts: response.data.similarNfts,
      owner: response.data.owner,
    },
  };
}
