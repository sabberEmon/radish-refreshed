const mongoose = require("mongoose");

const nftSchema = new mongoose.Schema(
  {
    referenceId: {
      type: Number,
      required: true,
    },
    collectionIdentifier: {
      type: String,
      required: true,
    },
    parentCollection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
    },
    title: {
      type: String,
      default: "Untitled",
    },
    description: {
      type: String,
      default: "No description",
    },
    picture: {
      type: String,
    },
    price: {
      type: Number,
    },
    rri: {
      type: String,
    },
    token: {
      type: String,
    },
    buyType: {
      type: String,
    },
    ownerWallet: {
      type: String,
    },
    forSale: {
      type: Boolean,
      default: false,
    },
    onAuction: {
      type: Boolean,
      default: false,
    },
    minimumBid: {
      type: Number,
      default: null,
    },
    endDate: {
      type: Date,
      // default: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    },
    priceHistory: {
      type: Array,
      default: [],
    },
    bids: {
      type: Array,
      default: [],
    },
    activities: {
      type: Array,
      default: [],
    },
    isEditorsPick: {
      type: Boolean,
      default: false,
    },
    totalRarityScore: {
      type: Number,
      default: 0,
    },
    rank: {
      type: Number,
      default: null,
    },
    dateListed: {
      type: Date,
      default: null,
    },
    attributes: {
      type: Array,
      default: [],
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    comments: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Comment",
      default: [],
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Nft", nftSchema);
