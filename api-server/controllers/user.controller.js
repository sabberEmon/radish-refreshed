const User = require("../models/User.model");
const Nft = require("../models/Nft.model");

exports.editProfile = async (req, res) => {
  const { data } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { uuid: req.user.uuid },
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

    // console.log("user", user);

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

exports.fetchUserAccount = async (req, res) => {
  try {
    const user = await User.findOne({
      uuid: req.user.uuid,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "user_not_found",
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      error: null,
      message: "User found",
      user,
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

exports.addWallet = async (req, res) => {
  const { wallet } = req.body;

  try {
    const user = await User.findOne({
      uuid: req.user.uuid,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "user_not_found",
        message: "User not found",
      });
    }

    // Check if the wallet already exists
    const walletExists = user.wallets.find((w) => w === wallet);

    if (walletExists) {
      return res.status(200).json({
        success: false,
        error: "wallet_already_exists",
        message: "Wallet already exists",
      });
    }

    user.wallets.push(wallet);

    await user.save();

    res.status(200).json({
      success: true,
      error: null,
      message: "Wallet added",
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

exports.deleteWallet = async (req, res) => {
  const { wallet } = req.params;

  try {
    const user = await User.findOne({
      uuid: req.user.uuid,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "user_not_found",
        message: "User not found",
      });
    }

    // Check if the wallet exists
    const walletExists = user.wallets.find((w) => w === wallet);

    if (!walletExists) {
      return res.status(200).json({
        success: false,
        error: "wallet_not_found",
        message: "Wallet not found",
      });
    }

    user.wallets = user.wallets.filter((w) => w !== wallet);

    await user.save();

    res.status(200).json({
      success: true,
      error: null,
      message: "Wallet deleted",
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
