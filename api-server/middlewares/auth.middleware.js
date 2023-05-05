const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin.model");

function authMiddleware(req, res, next) {
  // Extract the Bearer token from the Authorization header
  const authHeader = req.headers.authorization;
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

  // Verify the token using JWT
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }

    if (decoded.id !== req.body.userId) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }
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
