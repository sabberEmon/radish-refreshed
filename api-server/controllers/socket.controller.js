const mongoose = require("mongoose");
const Notification = require("../models/Notification.model");
const User = require("../models/User.model");

exports.createNotification = async (data) => {
  try {
    let userId;

    // check if it is a mongo id
    if (mongoose.Types.ObjectId.isValid(data.for)) {
      userId = data.for;
    } else {
      const user = await User.findOne({
        uuid: data.for,
      });
      userId = user._id;
    }

    const newNotification = new Notification({
      for: userId,
      type: data.type,
      referenceUser: data.referenceUser,
      message: data.message,
    });
    await newNotification.save();

    console.log("new notification created");
    console.log(newNotification);

    return newNotification;
  } catch (error) {
    console.log(error);
  }
};

exports.getUserIdFromUUID = async (id) => {
  try {
    // check if it is a mongo id
    if (mongoose.Types.ObjectId.isValid(id)) {
      return id;
    }

    const user = await User.findOne({
      uuid: id,
    });

    return user._id;
  } catch (error) {
    console.log(error);
  }
};

exports.getNotifications = async (userId) => {
  try {
    // notifications should new notifications first
    const notifications = await Notification.find({ for: userId })
      .sort({ createdAt: -1 })
      .populate("referenceUser", ["name", "profilePicture"]);

    return notifications;
  } catch (error) {
    console.log(error);
  }
};

exports.deleteNotification = async (notificationId) => {
  try {
    await Notification.findByIdAndDelete(notificationId);
  } catch (error) {
    console.log(error);
  }
};

exports.markNotificationAsRead = async (notificationId) => {
  try {
    await Notification.findByIdAndUpdate(notificationId, { isRead: true });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteAllNotifications = async (userId) => {
  try {
    await Notification.deleteMany({ for: userId });
  } catch (error) {
    console.log(error);
  }
};

exports.markAllNotificationsAsRead = async (userId) => {
  try {
    await Notification.updateMany({ for: userId }, { isRead: true });
  } catch (error) {
    console.log(error);
  }
};
