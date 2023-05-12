const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
    },
    primaryWallet: {
      type: String,
      required: true,
      unique: true,
    },
    signedMessage: {
      type: String,
      required: true,
    },
    wallets: {
      type: Array,
      default: [],
    },
    name: {
      type: String,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    profileBanner: {
      type: String,
    },
    bio: {
      type: String,
    },
    telegram: {
      type: String,
    },
    twitter: {
      type: String,
    },
    favouriteNfts: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Nft",
      default: [],
    },
    // references of followers(user ids)
    followers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    // references of following(user ids)
    following: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("User", userSchema);
