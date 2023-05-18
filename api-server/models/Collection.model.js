const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    collectionIdentifier: {
      type: String,
      required: true,
      unique: true,
    },
    collectionWallet: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      default: "No description",
    },
    collectionProfilePicture: {
      type: String,
    },
    collectionBanner: {
      type: String,
    },
    type: {
      type: String,
      default: "art",
    },
    nftCount: {
      type: Number,
      default: 0,
    },
    ownerCount: {
      type: Number,
      default: 0,
    },
    floorPrice: {
      type: Number,
      default: 0,
    },
    ceilingPrice: {
      type: Number,
    },
    volume: {
      type: Number,
      default: 0,
    },
    royalty: {
      type: Number,
      default: 0,
    },
    maxWalletLimit: {
      type: Number,
      default: null,
    },
    nickname: {
      type: String,
      default: "No nickname",
    },
    buyType: {
      type: String,
      default: "Random",
    },
    collectionRRI: {
      type: String,
    },
    possibleTraitTypes: {
      type: Array,
      default: [],
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Collection", collectionSchema);
