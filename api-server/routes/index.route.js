const express = require("express");
const indexController = require("../controllers/index.controller");
const { adminAuthCheck } = require("../middlewares/auth.middleware");
const router = express.Router();

// routes
router.post("/upload-nfts", adminAuthCheck, indexController.uploadNfts);
router.post("/modify-json-data-file", indexController.modifyJsonDataFile);
router.get("/home-data", indexController.getHomeData);
router.get("/search/:searchQuery", indexController.searchInCollectionAndNft);
// subscribe
router.post("/subscribe", indexController.subscribeToNewsletter);

module.exports = router;
