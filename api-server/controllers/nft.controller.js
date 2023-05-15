const Nft = require("../models/Nft.model");
const Collection = require("../models/Collection.model");
const User = require("../models/User.model");
const AuctionModel = require("../models/Auction.model");
const Comment = require("../models/Comment.model");

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

    const collection = await Collection.findOne({
      collectionIdentifier: nft.collectionIdentifier,
    }).populate("creator", ["name", "email", "profilePicture"]);

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
      collection,
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

exports.toggleLike = async (req, res) => {
  const { nftId, userId } = req.body;
  // const userId = req.user._id;

  // console.log(nftId, userId);

  try {
    const nft = await Nft.findById(nftId);
    const user = await User.findById(userId);

    if (!nft || !user) {
      return res.status(400).json({
        success: false,
        error: "nft_or_user_not_found",
        message: "Nft or user not found",
      });
    }

    // remove any duplicate likes both from nft.likes and user.favouriteNfts
    nft.likes = [...new Set(nft.likes)];
    user.favouriteNfts = [...new Set(user.favouriteNfts)];

    const isLiked = nft.likes.find((like) => like.toString() === userId);

    // console.log(nft.likes, user.favouriteNfts, isLiked);
    // console.log(nft.likes, user.favouriteNfts, isLiked);

    if (isLiked) {
      // remove like
      console.log("remove like");
      nft.likes = nft.likes.filter((like) => like.toString() !== userId);
    } else {
      // add like
      console.log("add like");
      nft.likes.push(userId);
    }

    const hasNft = user.favouriteNfts.find((nft) => nft.toString() === nftId);

    if (hasNft) {
      // remove nft
      user.favouriteNfts = user.favouriteNfts.filter(
        (nft) => nft.toString() !== nftId
      );
    } else {
      // add nft
      user.favouriteNfts.push(nftId);
    }

    await nft.save();
    await user.save();

    // get nft owner id
    const nftOwner = await User.findOne({
      // nft.ownerWallet in user.wallets array. this array is array of strings
      wallets: {
        $in: [nft.ownerWallet],
      },
    });

    console.log(nftOwner ? nftOwner._id : null);

    res.status(200).json({
      success: true,
      error: null,
      message: "Like added successfully",
      hasLiked: !isLiked,
      nftOwner: nftOwner ? nftOwner._id : null,
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

exports.createAuction = async (req, res) => {
  const { nftId, minimumBid, endDate } = req.body;

  try {
    const nft = await Nft.findById(nftId);

    const newAuction = new AuctionModel({
      nft: nftId,
      minimumBid,
      endDate: endDate ? endDate : null,
    });

    await newAuction.save();

    // nft.onAuction = true;
    nft.minimumBid = minimumBid;
    nft.endDate = endDate ? endDate : null;

    await nft.save();

    res.status(200).json({
      success: true,
      error: null,
      message: "Auction created successfully",
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

// comments
exports.likeComment = async (req, res) => {
  const { commentId, userId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "user_not_found",
        message: "User not found",
      });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(400).json({
        success: false,
        error: "comment_not_found",
        message: "Comment not found",
      });
    }

    const isLiked = comment.likes.find((like) => like.toString() === userId);

    if (isLiked) {
      // remove like
      comment.likes = comment.likes.filter(
        (like) => like.toString() !== userId
      );
    } else {
      // add like
      comment.likes.push(userId);
    }

    await comment.save();

    res.status(200).json({
      success: true,
      error: null,
      message: "Like added successfully",
      hasLiked: !isLiked,
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

exports.addCommentReply = async (req, res) => {
  const { nftId, userId, text, parentId } = req.body;

  try {
    const comment = new Comment({
      nft: nftId,
      user: userId,
      text,
      parentComment: false,
    });

    await comment.save();

    // find parent comment
    const parentComment = await Comment.findById(parentId);

    if (!parentComment) {
      return res.status(400).json({
        success: false,
        error: "comment_not_found",
        message: "Comment not found",
      });
    }

    parentComment.replies.push(comment._id);

    await parentComment.save();

    const nft = await Nft.findById(nftId);

    if (!nft) {
      return res.status(400).json({
        success: false,
        error: "nft_not_found",
        message: "Nft not found",
      });
    }

    nft.comments.push(comment._id);

    await nft.save();

    res.status(200).json({
      success: true,
      error: null,
      message: "Comment added successfully",
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

exports.getComments = async (req, res) => {
  const { nftId } = req.params;

  try {
    const comments = await Comment.find({
      nft: nftId,
      parentComment: true,
      // deosn't belong to any comments (reply)
    })
      .populate("user", ["name", "profilePicture"])
      .populate({
        path: "replies",
        populate: {
          path: "user",
          select: ["name", "profilePicture"],
        },
        // sort the replies by createdAt
        options: { sort: { createdAt: -1 } },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      error: null,
      message: "Comments fetched successfully",
      comments,
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

exports.addComment = async (req, res) => {
  const { nftId, userId, text } = req.body;

  try {
    const comment = new Comment({
      nft: nftId,
      user: userId,
      text,
    });

    await comment.save();

    const nft = await Nft.findById(nftId);

    if (!nft) {
      return res.status(400).json({
        success: false,
        error: "nft_not_found",
        message: "Nft not found",
      });
    }

    nft.comments.push(comment._id);

    await nft.save();

    res.status(200).json({
      success: true,
      error: null,
      message: "Comment added successfully",
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

exports.editNft = async (req, res) => {
  const { nftId, ...rest } = req.body;

  if (!nftId) {
    return res.status(400).json({
      success: false,
      error: "nft_id_required",
      message: "Nft id is required",
    });
  }

  try {
    const editedNft = await Nft.findByIdAndUpdate(nftId, rest, {
      new: true,
    });

    if (!editedNft) {
      return res.status(400).json({
        success: false,
        error: "nft_not_found",
        message: "Nft not found",
      });
    }

    res.status(200).json({
      success: true,
      error: null,
      message: "Nft edited successfully",
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

exports.getNfts = async (req, res) => {
  const { collectionIdentifier } = req.params;
  const { page = 1, limit = 100 } = req.query;

  try {
    const nfts = await Nft.find({ collectionIdentifier })
      .skip((page - 1) * limit)
      .limit(limit * 1)
      .populate({
        path: "parentCollection",
        select: [
          "collectionWallet",
          "title",
          "collectionProfilePicture",
          "collectionIdentifier",
        ],
        // populate: {},
      });

    res.status(200).json({
      success: true,
      error: null,
      message: "Nfts fetched successfully",
      nfts,
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
