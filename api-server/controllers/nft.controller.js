const Nft = require("../models/Nft.model");
// const Collection = require("../models/Collection.model");
const User = require("../models/User.model");

exports.fetchNftsWithFilters = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const { filters, sortBy, primaryFilters } = req.body;

  // console.log(req.cookies);

  try {
    // fetch nfts with filters
    const nfts = await Nft.find(
      {
        ...primaryFilters,
        ...(filters.length > 0 && {
          $and: filters.map((filter) => {
            return {
              attributes: {
                $elemMatch: {
                  trait_type: filter.trait_type,
                  value: { $in: filter.values },
                },
              },
            };
          }),
        }),
      },
      null,
      {
        sort: sortBy,
      }
    )
      .populate({
        path: "parentCollection",
        select: ["collectionWallet", "title", "collectionIdentifier"],
      })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // get total documents in the Posts collection with applied filters
    const count = await Nft.countDocuments({
      ...primaryFilters,
      ...(filters.length > 0 && {
        $and: filters.map((filter) => {
          return {
            attributes: {
              $elemMatch: {
                trait_type: filter.trait_type,
                value: { $in: filter.values },
              },
            },
          };
        }),
      }),
    });

    res.status(200).json({
      success: true,
      nfts,
      count,
      hasMore: page * limit < count,
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "server_error",
      message: "Internal server error",
    });
  }
};

exports.getAuctionedNfts = async (req, res) => {
  try {
    const nfts = await Nft.find({
      onAuction: true,
    }).populate({
      path: "parentCollection",
      select: ["collectionWallet", "title", "collectionIdentifier"],
    });

    res.status(200).json({
      success: true,
      auctionedNfts: nfts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "server_error",
      message: "Internal server error",
    });
  }
};

exports.getForSaleNfts = async (req, res) => {
  try {
    const nfts = await Nft.find({
      forSale: true,
    })
      .populate({
        path: "parentCollection",
        select: ["collectionWallet", "title", "collectionIdentifier"],
      })
      .limit(8);

    res.status(200).json({
      success: true,
      forSaleNfts: nfts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "server_error",
      message: "Internal server error",
    });
  }
};

// get a nft
exports.getNftById = async (req, res) => {
  const { id } = req.params;

  try {
    const nft = await Nft.findById(id).populate({
      path: "parentCollection",
      populate: {
        path: "creator",
      },
    });

    if (!nft) {
      return res.status(400).json({
        success: false,
        error: "nft_not_found",
        message: "Nft not found",
      });
    }

    // const collection = await Collection.findOne({
    //   collectionIdentifier: nft.collectionIdentifier,
    // }).populate("creator", ["name", "email", "profilePicture"]);

    const { referenceId, ownerWallet } = nft;

    // console.log(ownerWallet);

    let owner = null;

    if (!(ownerWallet === "Locked")) {
      const nftOwner = await User.findOne({
        // ownerWallet in user.wallets array
        wallets: { $elemMatch: { wallet: ownerWallet } },
      });

      // console.log(nftOwner);

      if (nftOwner) {
        owner = nftOwner;
      }
    }

    // fetch 6 similar nfts (3 before and 3 after)
    const afterNfts = await Nft.find({
      collectionIdentifier: nft.collectionIdentifier,
      referenceId: { $gt: referenceId },
    })
      .populate({
        path: "parentCollection",
        select: ["collectionWallet", "title", "collectionIdentifier"],
        // populate: {},
      })
      .sort({ referenceId: 1 })
      .limit(nft.referenceId < 3 ? 6 : 3);

    const beforeNfts = await Nft.find({
      collectionIdentifier: nft.collectionIdentifier,
      referenceId: { $lt: referenceId },
    })
      .populate({
        path: "parentCollection",
        select: ["collectionWallet", "title", "collectionIdentifier"],
      })
      .sort({ referenceId: -1 })
      .limit(3);

    let bids = [];

    if (nft.bids?.length > 0) {
      // get user profile for each bid
      bids = await Promise.all(
        nft.bids.map(async (bid) => {
          // get user profile
          const user = await User.findOne({
            // bid.wallet in user.wallets array
            wallets: { $elemMatch: { wallet: bid.wallet } },
          });

          if (!user)
            return {
              ...bid,
            };

          return {
            ...bid,
            bidder: {
              id: user._id,
              uuid: user.uuid,
              name: user.name,
              profilePicture: user.profilePicture,
            },
          };
        })
      );
    }

    // console.log("bids ", bids);

    res.status(200).json({
      success: true,
      error: null,
      message: "Nft fetched successfully",
      nft: {
        // replace the nft.bids with bids
        ...nft._doc,
        bids,
      },
      owner,
      similarNfts: [...beforeNfts, ...afterNfts],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "server_error",
      message: "Internal server error",
    });
  }
};
