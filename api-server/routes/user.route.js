const express = require("express");
const userController = require("../controllers/user.controller");
const router = express.Router();

// routes
// account
router.put("/edit-profile", userController.editProfile);

// profile
router.get("/profile/:uuid", userController.getUserProfileByUuid);

module.exports = router;
