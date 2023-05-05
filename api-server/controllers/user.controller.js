const User = require("../models/User.model");

exports.editProfile = async (req, res) => {
  const { uuid, data } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { uuid },
      { ...data },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: "user_not_found",
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      error: null,
      message: "User profile updated",
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
