const Collection = require("../models/Collection.model");
const Nft = require("../models/Nft.model");
const Leaderboard = require("../models/Leaderboard.model");
const fs = require("fs");

exports.uploadNfts = async (req, res) => {
  const { nfts } = req.body;

  const alreadyUploadedNfts = await Nft.find({
    collectionIdentifier: nfts[0].collectionIdentifier,
  }).limit(5);

  if (alreadyUploadedNfts.length > 0) {
    const nftPromises = nfts.map(async (nft) => {
      const { referenceId, collectionIdentifier } = nft;

      let existingNft = await Nft.findOne({
        referenceId,
        collectionIdentifier,
      });

      if (existingNft) {
        existingNft = Object.assign(existingNft, nft);
        await existingNft.save();
      }
      return existingNft;
    });

    const existingNfts = await Promise.all(nftPromises);

    if (existingNfts.length > 0) {
      return res.status(200).json({
        success: true,
        error: null,
        message: "Nfts updated successfully",
      });
    }
  }

  let possibleTraitTypes = [];
  let owners = [];
  let floorPrice = 0;
  let ceilingPrice = 0;

  nfts.forEach((nft) => {
    if (!owners.includes(nft.ownerWallet) && nft.ownerWallet !== "Locked") {
      owners.push(nft.ownerWallet);
    }

    if (nft.price) {
      if (floorPrice === 0) {
        floorPrice = nft.price;
      } else {
        if (nft.price < floorPrice) {
          floorPrice = nft.price;
        }
      }
    }

    if (nft.price) {
      if (ceilingPrice === 0) {
        ceilingPrice = nft.price;
      } else {
        if (nft.price > ceilingPrice) {
          ceilingPrice = nft.price;
        }
      }
    }

    nft.attributes.forEach((attribute) => {
      const { trait_type, value } = attribute;

      if (!trait_type) {
        return;
      }

      const traitTypeIndex = possibleTraitTypes.findIndex(
        (traitType) => trait_type === traitType.trait_type
      );

      if (traitTypeIndex === -1) {
        possibleTraitTypes.push({
          trait_type,
          values: [value],
        });
      } else {
        if (!possibleTraitTypes[traitTypeIndex].values.includes(value)) {
          possibleTraitTypes[traitTypeIndex].values.push(value);
        }
      }
    });
  });

  const { collectionIdentifier } = nfts[0];

  try {
    await Nft.insertMany(nfts);

    const collection = await Collection.findOne({
      collectionIdentifier,
    });

    collection.ownerCount = owners.length;
    collection.floorPrice = floorPrice;
    collection.possibleTraitTypes = possibleTraitTypes;
    collection.nftCount = nfts.length;
    collection.ceilingPrice = ceilingPrice;

    await collection.save();

    res.status(200).json({
      success: true,
      error: null,
      message: "Nfts created successfully",
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

exports.modifyJsonDataFile = async (req, res) => {
  const { collectionIdentifier, data } = req.body;

  try {
    // get the collection
    const collection = await Collection.findOne({
      collectionIdentifier,
    });

    // modify the incoming json data and save it to a new file
    const newData = data.map((item) => {
      const {
        forSale,
        img_url,
        ownerWallet,
        title,
        uniqueId,
        price,
        description,
        attributes,
        rri,
        token,
      } = item;
      let buyType = item["buy type"];

      let rarity;

      rarity = attributes
        ? attributes?.map((aitem) => {
            const { trait_type, value } = aitem;

            // find the total number of nfts with this trait type and this value in the attributes array ( attributes are not in order )
            let total = 0;
            data.forEach((ditem) => {
              const { attributes } = ditem;
              attributes?.forEach((a) => {
                if (a.trait_type === trait_type && a.value === value) {
                  total++;
                }
              });
            });

            const percentage = (total / data.length) * 100;
            return {
              trait_type,
              value,
              percentage,
              totalNftsWithThisTrait: total,
              numberOfTotalNfts: data.length,
            };
          })
        : [];

      let totalRarityScore = 0;
      attributes?.forEach((aitem) => {
        const { value, trait_type } = aitem;
        let total = 0;
        data.forEach((ditem) => {
          const { attributes } = ditem;
          attributes?.forEach((a) => {
            if (a.trait_type === trait_type && a.value === value) {
              total++;
            }
          });
        });
        const rarityScore = 1 / (total / data.length);
        totalRarityScore += rarityScore;
      });

      return {
        referenceId: uniqueId,
        collectionIdentifier,
        title,
        description,
        picture: img_url,
        price,
        rri,
        token,
        buyType,
        ownerWallet,
        forSale,
        parentCollection: collection._id,
        attributes: rarity,
        totalRarityScore: totalRarityScore?.toFixed(2),
      };
    });

    // 2. sort the nfts based on the total rarity score
    newData.sort((a, b) => b.totalRarityScore - a.totalRarityScore);

    // 3. assign a rank to each nft based on the total rarity score
    newData.forEach((item, i) => {
      item.rank = i + 1;
    });

    // sort the nfts based referenceId
    newData.sort((a, b) => a.referenceId - b.referenceId);

    const newJsonData = JSON.stringify(newData, null, 2);
    fs.writeFileSync(`./data.json`, newJsonData);

    // send this new file to the user
    res.status(200).json({
      success: true,
      error: null,
      message: "Data file modified successfully",
      url: `${process.env.BASE_URL}/json-data`,
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

exports.getHomeData = async (req, res) => {
  try {
    const collections = await Collection.find({}).populate("creator", [
      "uuid",
      "name",
    ]);

    const leaderboard = await Leaderboard.findOne({});

    res.status(200).json({
      success: true,
      error: null,
      message: "Collections fetched successfully",
      collections,
      topCollectors: leaderboard?.topCollectors || [],
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

exports.searchInCollectionAndNft = async (req, res) => {
  let { searchQuery } = req.params;
  const { page = 1, limit = 20 } = req.query;

  if (searchQuery.includes("hashtag")) {
    searchQuery = searchQuery.replace("hashtag", "#");
  }

  try {
    // check for existing collection
    let collections = await Collection.find({
      title: { $regex: searchQuery, $options: "i" },
    }).populate("creator", ["name"]);

    let nfts = await Nft.find({
      $or: [{ title: { $regex: searchQuery, $options: "i" } }],
    })
      .populate({
        path: "parentCollection",
        select: [
          "collectionWallet",
          "title",
          "collectionProfilePicture",
          "collectionIdentifier",
        ],
      })
      .skip((page - 1) * limit)
      .limit(limit * 1);

    res.status(200).json({
      success: true,
      error: null,
      message: "Search fetched successfully",
      collections,
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
