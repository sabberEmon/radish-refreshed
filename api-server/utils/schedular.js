const Nft = require("../models/Nft.model");
const User = require("../models/User.model");
const Leaderboard = require("../models/Leaderboard.model");

exports.updateTopCollectors = async () => {
  // top owners of all time
  //   first step: find all the users where they have wallet not equal to a null/endefined value
  const users = await User.find({
    wallet: { $ne: null },
  });

  // console.log("users", users);

  // second step: find all the nfts where the ownerWallet is in the users array
  const nfts = await Nft.find({
    ownerWallet: { $in: users.map((user) => user.wallet) },
  });

  // console.log("nfts", nfts);

  // third step: group the nfts by the ownerWallet and count the number of nfts for each ownerWallet
  const groupedNfts = nfts.reduce((acc, nft) => {
    if (acc[nft.ownerWallet]) {
      acc[nft.ownerWallet] += 1;
    } else {
      acc[nft.ownerWallet] = 1;
    }
    return acc;
  }, {});

  // console.log("groupedNfts", groupedNfts);

  // fourth step: sort the groupedNfts by the number of nfts in descending order
  const sortedGroupedNfts = Object.entries(groupedNfts).sort(
    (a, b) => b[1] - a[1]
  );

  // console.log("sortedGroupedNfts", sortedGroupedNfts);

  // fifth step: get the top 10 owners
  const topOwners = sortedGroupedNfts.slice(0, 10);

  // console.log("topOwners", topOwners);

  // sixth step: get the user data for each top owner
  const topOwnersData = topOwners.map((topOwner) => {
    const user = users.find((user) => user.wallet === topOwner[0]);
    return {
      id: user._id,
      name: user.name,
      profilePicture: user.profilePicture,
      wallet: user.wallet,
      nftsCount: topOwner[1],
    };
  });

  console.log("topOwnersData", topOwnersData);

  const newLeaderboard = await Leaderboard.create({
    topCollectors: topOwnersData,
  });

  console.log("newLeaderboard", newLeaderboard);
};
