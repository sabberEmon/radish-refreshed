const Nft = require("../models/Nft.model");

exports.getNftById = async (req, res) => {
  const { id } = req.params;

  try {
    const nft = await Nft.findById(id).select([
      "-likes",
      "-comments",
      "-isEditorsPick",
      "-totalRarityScore",
      "-parentCollection",
    ]);

    if (!nft) {
      return res.status(400).json({
        success: false,
        error: "nft_not_found",
        message: "Nft not found",
      });
    }

    res.status(200).json({
      success: true,
      error: null,
      message: "Nft fetched successfully",
      nft,
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

exports.getNftByQuery = async (req, res) => {
  const { collectionIdentifier, referenceId } = req.query;

  if (!collectionIdentifier || !referenceId) {
    return res.status(400).json({
      success: false,
      error: "missing_parameters",
      message: "Missing parameters collectionIdentifier or referenceId or both",
    });
  }

  try {
    const nft = await Nft.findOne({
      collectionIdentifier,
      referenceId,
    }).select([
      "-likes",
      "-comments",
      "-isEditorsPick",
      "-totalRarityScore",
      "-parentCollection",
    ]);

    if (!nft) {
      return res.status(400).json({
        success: false,
        error: "nft_not_found",
        message: "Nft not found",
      });
    }

    res.status(200).json({
      success: true,
      error: null,
      message: "Nft fetched successfully",
      nft,
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
