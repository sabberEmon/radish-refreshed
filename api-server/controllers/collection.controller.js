const Collection = require("../models/Collection.model");
const Nft = require("../models/Nft.model");
const axios = require("axios");

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
  // console.log(req.cookies);

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

    // get nfts count in collection where ownerWallet is not nullis "Locked"
    const nonMintedNftsCount = await Nft.countDocuments({
      collectionIdentifier,
      ownerWallet: "Locked",
    });

    res.status(200).json({
      success: true,
      error: null,
      message: "Collection fetched successfully",
      collection: {
        ...collection._doc,
        nonMintedNftsCount,
      },
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

exports.deleteCollection = async (req, res) => {
  const { collectionIdentifier } = req.params;

  try {
    // delete the nfts of the collection
    await Nft.deleteMany({ collectionIdentifier });

    // delete the collection

    const collection = await Collection.findOneAndDelete({
      collectionIdentifier,
    });

    if (!collection) {
      return res.status(400).json({
        success: false,
        error: "collection_not_found",
        message: "Collection not found",
      });
    }

    res.status(200).json({
      success: true,
      error: null,
      message: "Collection deleted successfully",
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

exports.deleteCollectionNfts = async (req, res) => {
  const { collectionIdentifier } = req.params;

  try {
    // delete the nfts of the collection
    await Nft.deleteMany({ collectionIdentifier });

    res.status(200).json({
      success: true,
      error: null,
      message: "Collection nfts deleted successfully",
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

exports.searchNftInCollection = async (req, res) => {
  const { collectionIdentifier } = req.params;
  const { page = 1, limit = 12 } = req.query;
  const { searchText } = req.body;

  try {
    // check for existing collection
    let collection = await Collection.findOne({
      collectionIdentifier,
    }).populate("creator", ["name", "profilePicture"]);

    if (!collection) {
      return res.status(400).json({
        success: false,
        error: "collection_not_found",
        message: "Collection not found",
      });
    }

    // if the searchtext starts with rdx then search for nft owner wallet
    if (searchText.startsWith("rdx")) {
      const nfts = await Nft.find({
        collectionIdentifier,
        ownerWallet: searchText,
      })
        .populate({
          path: "parentCollection",
          select: [
            "collectionWallet",
            "title",
            "collectionProfilePicture",
            "collectionIdentifier",
          ],
          // populate: {},
        })
        .skip((page - 1) * limit)
        .limit(limit * 1);

      return res.status(200).json({
        success: true,
        error: null,
        message: "Collection fetched successfully",
        nfts,
      });
    }

    if (searchText.endsWith(".xrd")) {
      const response = await axios.get(
        "https://api.xrd.domains/v1/whois/" + searchText
      );

      if (response?.data?.status === "success") {
        const wallet = response.data?.data?.owner_address;

        const nfts = await Nft.find({
          collectionIdentifier,
          ownerWallet: wallet,
        })
          .populate({
            path: "parentCollection",
            select: [
              "collectionWallet",
              "title",
              "collectionProfilePicture",
              "collectionIdentifier",
            ],
            // populate: {},
          })
          .skip((page - 1) * limit)
          .limit(limit * 1);

        return res.status(200).json({
          success: true,
          error: null,
          message: "Collection fetched successfully",
          nfts,
        });
      }

      return res.status(200).json({
        success: true,
        error: null,
        message: "Collection fetched successfully",
        nfts: [],
      });
    }

    // get nfts with dynamic attributes based filters
    const nfts = await Nft.find({
      collectionIdentifier,
      $or: [
        { title: { $regex: searchText, $options: "i" } },
        { description: { $regex: searchText, $options: "i" } },
      ],
    })
      .populate({
        path: "parentCollection",
        select: [
          "collectionWallet",
          "title",
          "collectionProfilePicture",
          "collectionIdentifier",
        ],
        // populate: {},
      })
      .skip((page - 1) * limit)
      .limit(limit * 1);

    res.status(200).json({
      success: true,
      error: null,
      message: "Collection fetched successfully",
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
