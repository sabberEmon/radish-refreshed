const express = require("express");
const collectionController = require("../controllers/collection.controller");
const router = express.Router();

// routes
router.get("/", collectionController.getCollections);
router.get("/:collectionIdentifier", collectionController.getCollection);
router.post("/", collectionController.createCollection);
router.put("/", collectionController.editCollection);

module.exports = router;
