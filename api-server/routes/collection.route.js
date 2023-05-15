const express = require("express");
const collectionController = require("../controllers/collection.controller");
const { adminAuthCheck } = require("../middlewares/auth.middleware");

const router = express.Router();

// routes
router.get("/", collectionController.getCollections);
router.get("/:collectionIdentifier", collectionController.getCollection);
router.post("/", collectionController.createCollection);
router.put("/", collectionController.editCollection);

// admin
router.post(
  "/delete-collection/:collectionIdentifier",
  adminAuthCheck,
  collectionController.deleteCollection
);
router.post(
  "/delete-collection-nfts/:collectionIdentifier",
  adminAuthCheck,
  collectionController.deleteCollectionNfts
);
router.post(
  "/search-in-collection/:collectionIdentifier",
  collectionController.searchNftInCollection
);

module.exports = router;
