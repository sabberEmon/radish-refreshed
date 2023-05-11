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
      wallets: [primaryWallet],
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

    // send token in cookie
    res.cookie("AUTH", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

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
    const existingUser = await User.findOne({ primaryWallet });

    if (existingUser) {
      if (existingUser.signedMessage !== signedMessage) {
        return res.status(404).json({
          success: false,
          message: "Invalid signature",
        });
      }

      // jwt
      const token = jwt.sign(
        {
          uuid: existingUser.uuid,
          primaryWallet: existingUser.primaryWallet,
          signedMessage: existingUser.signedMessage,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
        }
      );

      // send token in cookie
      res.cookie("AUTH", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
      });

      // return success response
      return res.status(200).json({
        success: true,
        message: "Account logged in successfully",
        data: existingUser,
        token,
      });
    }

    // if not existing user create new user
    const newUser = await User.create({
      uuid: uuidv4(),
      primaryWallet,
      signedMessage,
      wallets: [primaryWallet],
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

    // send token in cookie
    res.cookie("AUTH", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

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

exports.handleCheckAuthInfo = async (req, res) => {
  // console.log(req.user);
  try {
    // check if user exists
    const existingUser = await User.findOne({
      primaryWallet: req.user.primaryWallet,
    });

    if (!existingUser) {
      return res.status(200).json({
        success: false,
        message: "User not found",
        status: "unauthenticated",
      });
    }

    // return success response
    return res.status(200).json({
      success: true,
      message: "User found",
      data: existingUser,
      status: "authenticated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
