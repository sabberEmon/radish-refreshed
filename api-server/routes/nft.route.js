const express = require("express");
const nftController = require("../controllers/nft.controller");
const router = express.Router();

// routes
router.post("/with-filters", nftController.fetchNftsWithFilters);
router.get("/for-sale", nftController.getForSaleNfts);
router.get("/on-auction", nftController.getAuctionedNfts);
router.get("/nft/:id", nftController.getNftById);

module.exports = router;
