const express = require("express");
const nftController = require("../controllers/nft.controller");
const {
  authMiddleware,
  adminAuthCheck,
} = require("../middlewares/auth.middleware");
const router = express.Router();

// routes
router.post("/with-filters", nftController.fetchNftsWithFilters);
router.get("/for-sale", nftController.getForSaleNfts);
router.get("/on-auction", nftController.getAuctionedNfts);
router.get("/nft/:id", nftController.getNftById);

// like dislike
router.put("/nft/toggle-like", authMiddleware, nftController.toggleLike);

// auction
router.post("/create-auction", nftController.createAuction);

// comments
router.post("/add-comment", nftController.addComment);
router.post("/like-comment", nftController.likeComment);
router.post("/add-reply", nftController.addCommentReply);
router.get("/fetch-comments/:nftId", nftController.getComments);

// admin
router.post("/edit-nft", adminAuthCheck, nftController.editNft);
router.get("/fetch-nfts/:collectionIdentifier", nftController.getNfts);

module.exports = router;
