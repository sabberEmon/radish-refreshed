const User = require("../models/User.model");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

exports.handleRegister = async (req, res) => {
  const { primaryWallet, signedMessage } = req.body;

  try {
    // check if user already exists
    const existingUser = await User.findOne({ primaryWallet });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this wallet already exists",
      });
    }

    // create new user
    const newUser = await User.create({
      uuid: uuidv4(),
      primaryWallet,
      signedMessage,
    });

    // jwt
    const token = jwt.sign(
      {
        uuid: newUser.uuid,
        primaryWallet: newUser.primaryWallet,
        signedMessage: newUser.signedMessage,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    // return success response
    return res.status(201).json({
      success: true,
      message: "Account registered successfully",
      data: newUser,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.handleLogin = async (req, res) => {
  const { primaryWallet, signedMessage } = req.body;

  try {
    // check if user exists
    const user = await User.findOne({ primaryWallet });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    if (user.signedMessage !== signedMessage) {
      return res.status(404).json({
        success: false,
        message: "Invalid signature",
      });
    }

    // jwt
    const token = jwt.sign(
      {
        uuid: user.uuid,
        primaryWallet: user.primaryWallet,
        signedMessage: user.signedMessage,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    // return success response
    return res.status(200).json({
      success: true,
      message: "Account logged in successfully",
      data: user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
