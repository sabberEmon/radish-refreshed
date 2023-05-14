const express = require("express");
const userController = require("../controllers/user.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const router = express.Router();

// routes
// account
router.put("/edit-profile", authMiddleware, userController.editProfile);
router.post("/wallets", authMiddleware, userController.addWallet);
router.delete("/wallets/:wallet", authMiddleware, userController.deleteWallet);

// profile
router.get("/my-account", authMiddleware, userController.fetchUserAccount);
router.get("/profile/:uuid", userController.getUserProfileByUuid);

// activity
router.post("/follow-user", authMiddleware, userController.followUser);
router.get("/fetch-users", userController.getAllUsernames);

// search
router.get("/search/:query", userController.searchProfile);

module.exports = router;
