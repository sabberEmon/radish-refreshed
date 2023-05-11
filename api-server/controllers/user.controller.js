const User = require("../models/User.model");
const Nft = require("../models/Nft.model");

exports.editProfile = async (req, res) => {
  const { uuid, data } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { uuid },
      { ...data },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: "user_not_found",
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      error: null,
      message: "User profile updated",
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

exports.getUserProfileByUuid = async (req, res) => {
  const { uuid } = req.params;

  try {
    // populate the creator field for every nfts on favouriteNfts array
    const user = await User.findOne({
      uuid: uuid,
    }).populate({
      path: "favouriteNfts",
      populate: {
        path: "parentCollection",
        select: ["collectionWallet", "title", "collectionIdentifier"],
      },
    });

    console.log("user", user);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "user_not_found",
        message: "User not found",
      });
    }

    let onSaleNfts = [];
    let ownedNfts = [];

    onSaleNfts = await Nft.find({
      // on user.wallets array
      ownerWallet: {
        $in: user.wallets,
      },
      forSale: true,
    }).populate({
      path: "parentCollection",
      select: ["collectionWallet", "title", "collectionIdentifier"],
    });

    ownedNfts = await Nft.find({
      ownerWallet: {
        $in: user.wallets,
      },
    }).populate({
      path: "parentCollection",
      select: ["collectionWallet", "title", "collectionIdentifier"],
    });

    // console.log("onSaleNfts", ownedNfts);

    res.status(200).json({
      success: true,
      error: null,
      message: "User found",
      user,
      onSaleNfts,
      ownedNfts,
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
