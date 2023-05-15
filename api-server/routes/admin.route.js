const express = require("express");
const adminController = require("../controllers/admin.controller");
const { adminAuthCheck } = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/auth/whitelist", adminController.getAdmins);
router.get("/subscribers", adminController.getSubscribers);

router.post("/auth/whitelist", adminAuthCheck, adminController.whitelistAdmin);
router.post("/auth/verify-admin", adminController.verifyAdminUser);
router.post(
  "/auth/verify-whitelist",
  adminAuthCheck,
  adminController.verifyWhitelistRequest
);

module.exports = router;
