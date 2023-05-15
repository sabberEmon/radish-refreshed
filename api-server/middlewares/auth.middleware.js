const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const Admin = require("../models/Admin.model");

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

async function adminAuthCheck(req, res, next) {
  console.log("checking admin");
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (!authHeader) {
    return res
      .status(401)
      .json({ success: false, error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Authorization header missing" });
  }

  jwt.verify(token, process.env.ADMIN_JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }
    // console.log(decoded);

    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }

    if (admin.email !== decoded.email) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }

    // console.log("check passed");
    next();
  });
}

module.exports = {
  authMiddleware,
  adminAuthCheck,
};
