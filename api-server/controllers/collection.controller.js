const Collection = require("../models/Collection.model");
// const Nft = require("../models/Nft.model");

exports.createCollection = async (req, res) => {
  const { collectionIdentifier, title, creator, ...rest } = req.body;

  try {
    // check for existing collection
    let collection = await Collection.findOne({
      collectionIdentifier,
    });

    if (collection) {
      return res.status(400).json({
        success: false,
        error: "collection_exists",
        message: "Collection already exists",
      });
    }

    // create collection
    collection = new Collection({
      collectionIdentifier,
      title,
      creator,
      ...rest,
    });

    await collection.save();

    res.status(200).json({
      success: true,
      error: null,
      message: "Collection created successfully",
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

exports.getCollections = async (req, res) => {
  console.log(req.cookies);

  try {
    const collections = await Collection.find({}).populate("creator", [
      "name",
      "profilePicture",
    ]);

    res.status(200).json({
      success: true,
      error: null,
      message: "Collections fetched successfully",
      collections,
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

exports.editCollection = async (req, res) => {
  const { collectionIdentifier, data } = req.body;

  try {
    const updatedCollection = await Collection.findOneAndUpdate(
      { collectionIdentifier },
      { ...data },
      { new: true }
    );

    if (!updatedCollection) {
      return res.status(400).json({
        success: false,
        error: "collection_not_found",
        message: "Collection not found",
      });
    }

    res.status(200).json({
      success: true,
      error: null,
      message: "Collection updated successfully",
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

exports.getCollection = async (req, res) => {
  const { collectionIdentifier } = req.params;

  // const { page = 1, limit = 20 } = req.query;

  try {
    // check for existing collection
    let collection = await Collection.findOne({
      collectionIdentifier,
    }).populate("creator", ["name"]);

    if (!collection) {
      return res.status(400).json({
        success: false,
        error: "collection_not_found",
        message: "Collection not found",
      });
    }

    // get nfts with dynamic attributes based filters
    // const nfts = await Nft.find({
    //   collectionIdentifier,
    // })
    //   .populate({
    //     path: "parentCollection",
    //     select: ["collectionWallet", "title", "collectionIdentifier"],
    //     // populate: {},
    //   })
    //   .skip((page - 1) * limit)
    //   .limit(limit * 1);

    res.status(200).json({
      success: true,
      error: null,
      message: "Collection fetched successfully",
      collection,
      // nfts,
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
