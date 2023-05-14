const mongoose = require("mongoose");

const { Schema } = mongoose;

const auctionSchema = new Schema(
  {
    nft: {
      type: Schema.Types.ObjectId,
      ref: "Nft",
      required: true,
    },
    minimumBid: {
      type: Number,
      required: true,
    },
    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Auction", auctionSchema);
