const express = require("express");
const authController = require("../controllers/auth.controller");
const router = express.Router();

// routes
router.post("/register", authController.handleRegister);
router.post("/login", authController.handleLogin);

module.exports = router;
