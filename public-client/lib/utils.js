const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

const tokens = [
  {
    id: "xrd",
    rri: "xrd_rr1qy5wfsfh",
    name: "XRD",
  },
  {
    id: "bobby",
    rri: "bobby_rr1qvadnxcgmssts5vfc553ph8f0npw003zkhvp5cyzd2msvcflay",
    name: "BOBBY",
  },
  {
    id: "crew",
    rri: "crew_rr1qdvqylly2ga0rpsc6fv03a2mdqp89z4xev3s0mef576systzyx",
    name: "CREW",
  },
  {
    id: "rds",
    rri: "rds_rr1q09zzg0pmjtntq09gxxnqq8hl68rajpy8jhesl9ve3cq2f4nrh",
    name: "RDS",
  },
  {
    id: "oci",
    rr1: "oci_rr1qws04shqrz3cdjljdp5kczgv7wd3jxytagk95qlk7ecquzq8e7",
    name: "OCI",
  },
];

function abbreviateNumber(number) {
  // what tier? (determines SI symbol)
  var tier = (Math.log10(Math.abs(number)) / 3) | 0;

  // if zero, we don't need a suffix
  if (tier == 0) return number;

  // get suffix and determine scale
  var suffix = SI_SYMBOL[tier];
  var scale = Math.pow(10, tier * 3);

  // scale the number
  var scaled = number / scale;

  // format number and add suffix
  return scaled.toFixed(1) + suffix;
}

function getRriFromId(id) {
  const token = tokens.find((token) => token.id === id);
  return token?.rri;
}

function getNameFromRri(rri) {
  const token = tokens.find((token) => token.rri === rri);
  return token?.name;
}

function getButtonText(nft, userWallet) {
  if (nft.ownerWallet === userWallet) {
    if (nft.onAuction) {
      return "See Bids";
    } else if (nft.forSale) {
      return "Cancel Listing";
    } else {
      return "Sell NFT";
    }
  } else {
    if (nft.onAuction) {
      if (
        nft?.bids?.length > 0 && // if the bids have has the user's wallet address in it then show "See Bids" else show "Place Bid"
        nft.bids.find((bid) => bid.wallet === userWallet)
      ) {
        return "Bid Higher";
      } else {
        return "Place Bid";
      }
    } else if (nft.forSale) {
      return "Buy Now";
    } else if (nft.ownerWallet === "Locked") {
      return "Buy Now";
    } else {
      return "View NFT";
    }
  }
}

function getPriceText(nft, userWallet) {
  if (nft.onAuction) {
    if (nft.bids?.length > 0) {
      return "Highest Bid at";
    } else {
      return "Starting Bid at";
    }
  } else if (nft.forSale) {
    return "Buy Now for";
  } else if (nft.ownerWallet === "Locked") {
    return "Buy Now for";
  }
}

function getPrice(nft) {
  if (nft.onAuction) {
    if (nft.bids?.length > 0) {
      // return the highest bid
      return nft.bids.reduce((prev, current) =>
        prev.bid > current.bid ? prev : current
      ).bid;
    } else {
      return nft.minimumBid;
    }
  } else if (nft.forSale) {
    return nft.price;
  } else if (nft.ownerWallet === "Locked") {
    return nft.price;
  }
}

export {
  abbreviateNumber,
  getNameFromRri,
  getButtonText,
  getPriceText,
  getPrice,
};
