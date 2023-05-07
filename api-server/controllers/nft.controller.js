const Nft = require("../models/Nft.model");

exports.fetchNftsWithFilters = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const { filters, sortBy, primaryFilters } = req.body;

  console.log(req.cookies);

  try {
    // fetch nfts with filters
    const nfts = await Nft.find(
      {
        ...primaryFilters,
        ...(filters.length > 0 && {
          $and: filters.map((filter) => {
            return {
              attributes: {
                $elemMatch: {
                  trait_type: filter.trait_type,
                  value: { $in: filter.values },
                },
              },
            };
          }),
        }),
      },
      null,
      {
        sort: sortBy,
      }
    )
      .populate({
        path: "parentCollection",
        select: ["collectionWallet", "title", "collectionIdentifier"],
      })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // get total documents in the Posts collection with applied filters
    const count = await Nft.countDocuments({
      ...primaryFilters,
      ...(filters.length > 0 && {
        $and: filters.map((filter) => {
          return {
            attributes: {
              $elemMatch: {
                trait_type: filter.trait_type,
                value: { $in: filter.values },
              },
            },
          };
        }),
      }),
    });

    res.status(200).json({
      success: true,
      nfts,
      count,
      hasMore: page * limit < count,
      currentPage: page,
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
