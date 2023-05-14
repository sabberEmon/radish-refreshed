const express = require("express");
const v2Controller = require("../controllers/v2.controller");

const router = express.Router();

// routes
router.get("/nft", v2Controller.getNftByQuery);
router.get("/nfts/:id", v2Controller.getNftById);

module.exports = router;
