const User = require("../models/User.model");
const Nft = require("../models/Nft.model");
const axios = require("axios");

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

exports.followUser = async (req, res) => {
  const { followingUserId } = req.body; // followerUserId is the user who is following
  // followingUserId is the user who is being followed
  const followerUserId = req.user._id;

  try {
    const followingUser = await User.findOne({
      uuid: followingUserId,
    });

    if (!followingUser) {
      return res.status(404).json({
        success: false,
        error: "user_not_found",
        message: "User not found",
      });
    }

    const followerUser = await User.findById(followerUserId);

    if (!followerUser) {
      return res.status(404).json({
        success: false,
        error: "user_not_found",
        message: "User not found",
      });
    }

    // add followerUserId to followingUser's followers array
    followingUser.followers.push(followerUserId);

    // add followingUserId to followerUser's following array
    followerUser.following.push(followingUser._id);

    await followingUser.save();
    await followerUser.save();

    res.status(200).json({
      success: true,
      error: null,
      message: "User followed",
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

exports.getAllUsernames = async (req, res) => {
  try {
    const users = await User.find(
      {
        // not empty
        name: { $ne: "" },
      },
      { name: 1, _id: 1 }
    );

    res.status(200).json({
      success: true,
      error: null,
      message: "Users found",
      users,
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

exports.searchProfile = async (req, res) => {
  const { query } = req.params;

  try {
    if (query.startsWith("rdx")) {
      const foundUser = await User.findOne({
        wallets: {
          $in: [query],
        },
      });

      if (foundUser) {
        return res.status(200).json({
          success: true,
          error: null,
          message: "User found",
          user: foundUser,
        });
      }
    }

    if (query.endsWith(".xrd")) {
      const response = await axios.get(
        "https://api.xrd.domains/v1/whois/" + query
      );

      if (response?.data?.status === "success") {
        const wallet = response.data?.data?.owner_address;

        const foundUser = await User.findOne({
          wallets: {
            $in: [wallet],
          },
        });

        if (foundUser) {
          return res.status(200).json({
            success: true,
            error: null,
            message: "User found",
            user: foundUser,
          });
        }
      }
    }

    res.status(200).json({
      success: false,
      error: null,
      message: "No user found",
      user: null,
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
