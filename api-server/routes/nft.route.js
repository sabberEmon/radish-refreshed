const express = require("express");
const nftController = require("../controllers/nft.controller");
const router = express.Router();

// routes
router.post("/with-filters", nftController.fetchNftsWithFilters);

module.exports = router;
