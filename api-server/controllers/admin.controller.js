const Admin = require("../models/Admin.model");
const bcrypt = require("bcrypt");
const OTPModel = require("../models/OTP.model");
const Subscriber = require("../models/Subscriber.model");
const { v4: uuidv4 } = require("uuid");
const { sendMail } = require("../utils/sendMail.util");
const jwt = require("jsonwebtoken");

exports.whitelistAdmin = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: "bad_request",
      message: "Email is required",
    });
  }

  try {
    // check if the email is already in the whitelist
    let prevadmin = await Admin.findOne({
      email,
    });

    if (prevadmin) {
      return res.status(400).json({
        success: false,
        error: "bad_request",
        message: "Email already in whitelist",
      });
    }
    // send verification email with OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const hashedOTP = await bcrypt.hash(otp.toString(), 10);
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    const mailOptions = {
      email: process.env.SUPER_ADMIN_EMAIL,
      subject: "Admin confirmation",
      html: `
        <h1>Verify your request</h1>
        <p>${email} has been added to admin whitelist and is currently "on hold". Use the following OTP to verify your request.</p>
        <h2>${otp}</h2>
      `,
    };

    const mailResponse = await sendMail(mailOptions);

    if (!mailResponse.success) {
      return res.status(500).json({
        success: false,
        error: "server_error",
        message: "Error sending verification email, please try again",
      });
    }

    const otpData = new OTPModel({
      OTP: hashedOTP,
      uuid: uuidv4(),
      expiresAt: otpExpires,
    });

    await otpData.save();

    // create admin
    const admin = new Admin({
      email,
      status: "on hold",
    });

    await admin.save();

    res.status(201).json({
      success: true,
      error: null,
      message: "Admin added to whitelist, please check your email for OTP",
      admin: {
        adminId: admin._id,
        email: admin.email,
        status: admin.status,
      },
      OTPuuid: otpData.uuid,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "server_error",
      message: "Internal server error",
    });
  }
};

exports.verifyWhitelistRequest = async (req, res) => {
  const { OTPuuid, OTP, email } = req.body;

  if (!OTPuuid || !OTP || !email) {
    return res.status(400).json({
      success: false,
      error: "missing_fields",
      message: "Please fill all the fields",
    });
  }

  try {
    // see if the user exists
    let admin = await Admin.findOne({
      email,
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        error: "not_found",
        message: "Admin not found",
      });
    }

    // see if the OTP exists
    let otpData = await OTPModel.findOne({
      uuid: OTPuuid,
    });

    if (!otpData) {
      return res.status(404).json({
        success: false,
        error: "not_found",
        message: "OTP record not found",
      });
    }

    // check if OTP is expired
    if (otpData.expiresAt < Date.now()) {
      return res.status(403).json({
        success: false,
        error: "expired",
        message: "OTP has expired, please request a new OTP",
      });
    }

    // compare OTP
    const isMatch = await bcrypt.compare(OTP, otpData.OTP);

    if (!isMatch) {
      return res.status(403).json({
        success: false,
        error: "otp_mismatch",
        message: "Invalid OTP",
      });
    }

    // update user
    admin.status = "active";

    await admin.save();

    // delete OTP record
    await OTPModel.deleteOne({
      uuid: OTPuuid,
    });

    res.status(200).json({
      success: true,
      error: null,
      message: "Admin whitelisted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "server_error",
      message: "Internal server error",
    });
  }
};

exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({
      status: "active",
    });

    res.status(200).json({
      success: true,
      error: null,
      message: "Admins fetched successfully",
      admins,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "server_error",
      message: "Internal server error",
    });
  }
};

exports.verifyAdminUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "missing_fields",
      message: "Please fill all the fields",
    });
  }

  try {
    // find the admin user
    const admin = await Admin.findOne({
      email,
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        error: "not_found",
        message: "Admin not found",
      });
    }

    // match the password
    const isMatch = password === process.env.SUPER_ADMIN_PASSWORD;

    if (!isMatch) {
      return res.status(403).json({
        success: false,
        error: "invalid_credentials",
        message: "Invalid credentials",
      });
    }

    // create a token
    const payload = {
      id: admin._id,
      email: admin.email,
    };

    // sign a token
    const token = jwt.sign(payload, process.env.ADMIN_JWT_SECRET);

    res.status(200).json({
      success: true,
      error: null,
      message: "Admin verified successfully",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "server_error",
      message: "Internal server error",
    });
  }
};

exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find();

    res.status(200).json({
      success: true,
      error: null,
      message: "Subscribers found",
      subscribers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "server_error",
      message: "Internal server error",
    });
  }
};
