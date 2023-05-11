const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema(
  {
    topCollectors: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Leaderboard", leaderboardSchema);
