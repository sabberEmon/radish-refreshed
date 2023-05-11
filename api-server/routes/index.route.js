const express = require("express");
const indexController = require("../controllers/index.controller");
const router = express.Router();

// routes
router.post("/upload-nfts", indexController.uploadNfts);
router.post("/modify-json-data-file", indexController.modifyJsonDataFile);
router.get("/home-data", indexController.getHomeData);

module.exports = router;
