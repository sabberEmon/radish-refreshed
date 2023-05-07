const express = require("express");
const authController = require("../controllers/auth.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const router = express.Router();

// routes
router.get("/", authMiddleware, authController.handleCheckAuthInfo);
router.post("/register", authController.handleRegister);
router.post("/login", authController.handleLogin);

module.exports = router;
