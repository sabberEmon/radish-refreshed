import { Button } from "antd";
import { useSelector } from "react-redux";

export default function NftButtons({
  nft,
  handleBuyNft,
  setListForSaleModal,
  setCreateAuctionModal,
  setPlaceBidModal,
  setSeeBidsModal,
  handleRemoveFromSale,
  handleCancelAuction,
  setBidHigherModal,
  handleCancelBid,
}) {
  const root = useSelector((state) => state.main.root);

  if (root.user && root.user?.wallets.includes(nft.ownerWallet)) {
    return (
      <>
        {!nft.onAuction && (
          <Button
            type="primary"
            className="h-[48px] w-full font-bold text-base"
            onClick={() => {
              if (!nft.forSale) {
                setListForSaleModal(true);
              } else {
                handleRemoveFromSale();
              }
            }}
          >
            {nft.forSale ? "Remove from sale" : "List for sale"}
          </Button>
        )}
        {!nft.forSale && (
          <>
            <Button
              className="h-[48px] w-full font-bold text-base"
              type={`${nft.onAuction ? "primary" : "default"}`}
              onClick={() => {
                if (!nft.onAuction) {
                  setCreateAuctionModal(true);
                } else {
                  setSeeBidsModal(true);
                }
              }}
            >
              {nft.onAuction ? "See Bids" : "Create Auction"}
            </Button>
            {nft.onAuction && (
              <Button
                className="h-[48px] w-full font-bold text-base"
                type="default"
                danger
                onClick={() => {
                  handleCancelAuction();
                }}
              >
                Cancel Auction
              </Button>
            )}
          </>
        )}
      </>
    );
  }

  if (nft.onAuction) {
    const isAlreadyBidder = nft.bids?.find((bid) =>
      root?.user?.wallets.includes(bid?.wallet)
    );

    if (isAlreadyBidder) {
      return (
        <>
          <Button
            className="h-[48px] w-full font-bold text-base"
            type="primary"
            onClick={() => {
              setBidHigherModal(true);
            }}
          >
            Bid higher
          </Button>
          <Button
            className="h-[48px] w-full font-bold text-base"
            danger
            onClick={() => {
              handleCancelBid();
            }}
          >
            Cancel bid
          </Button>
        </>
      );
    }

    return (
      <Button
        className="h-[48px] w-full font-bold text-base"
        type="primary"
        onClick={() => {
          setPlaceBidModal(true);
        }}
      >
        Place a bid
      </Button>
    );
  }

  if (nft.forSale || nft.ownerWallet === "Locked") {
    return (
      <Button
        className="h-[48px] w-full font-bold text-base"
        type="primary"
        onClick={() => {
          handleBuyNft();
        }}
      >
        Buy Now
      </Button>
    );
  }

  return (
    <>
      {/* {root.user && root.user.wallet === nft.ownerWallet ? (
        <Button
          type="primary"
          className="h-[48px] w-full font-bold text-base"
          onClick={() => {
            setListForSaleModal(true);
          }}
        >
          {nft.forSale ? "Remove from sale" : "List for sale"}
        </Button>
      ) : (
        <>
          {(nft.forSale || nft.ownerWallet === "Locked") && (
            <Button
              type="primary"
              className="h-[48px] w-full font-bold text-base"
              onClick={handleBuyNft}
            >
              {nft.forSale || nft.ownerWallet === "Locked"
                ? `Buy Now`
                : `Not for sale`}
            </Button>
          )}
        </>
      )} */}

      {/* {root.user && root.user.wallet === nft.ownerWallet ? (
        <Button
          className="h-[48px] w-full font-bold text-base"
          onClick={() => {
            setCreateAuctionModal(true);
          }}
        >
          {nft.onAuction ? "See Bids" : "Create Auction"}
        </Button>
      ) : (
        <>
          {nft.onAuction && (
            <Button
              className="h-[48px] w-full font-bold text-base"
              onClick={() => {
                if (!nft.onAuction) {
                  message.error("This NFT is not on auction");
                } else {
                  setPlaceBidModal(true);
                }
              }}
            >
              {nft.onAuction ? "Place a bid" : "Not on Auction"}
            </Button>
          )}
        </>
      )} */}
    </>
  );
}
