const express = require("express");
const userController = require("../controllers/user.controller");
const router = express.Router();

// routes
router.put("/edit-profile", userController.editProfile);

module.exports = router;
