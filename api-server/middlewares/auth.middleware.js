const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

async function authMiddleware(req, res, next) {
  // Extract the Bearer token from the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(200).json({
      success: false,
      error: "Authorization header missing",
      status: "unauthenticated",
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(200).json({
      success: false,
      error: "Authorization header missing",
      status: "unauthenticated",
    });
  }

  // Verify the token using JWT
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(200).json({
        success: false,
        error: "Invalid token",
        status: "unauthenticated",
      });
    }

    // Check if the user exists
    const user = await User.findOne({ uuid: decoded.uuid });

    if (!user) {
      return res.status(200).json({
        success: false,
        error: "User not found",
        status: "unauthenticated",
      });
    }

    // Add the user to the request object
    req.user = user;
    next();
  });
}

module.exports = {
  authMiddleware,
};
