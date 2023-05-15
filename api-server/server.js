require("dotenv").config();
const fs = require("fs");
const path = require("path");
const express = require("express");
// const schedule = require("node-schedule");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const app = express();
const httpServer = http.createServer(app);
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});
const indexRouter = require("./routes/index.route");
const authRouter = require("./routes/auth.route");
const collectionRouter = require("./routes/collection.route");
const userRouter = require("./routes/user.route");
const nftRouter = require("./routes/nft.route");
const v2Router = require("./routes/v2.route");
const adminRouter = require("./routes/admin.route");
const {
  createNotification,
  getNotifications,
  deleteNotification,
  markNotificationAsRead,
  deleteAllNotifications,
  markAllNotificationsAsRead,
  // getUserIdFromUUID,
} = require("./controllers/socket.controller");

const ONLINE_USERS = [];

// cors
app.use(
  // cors({
  //   origin: [process.env.CLIENT_URL, process.env.ADMIN_URL],
  // })
  cors()
);
// logging middleware
app.use(morgan("dev", {}));

// log only 5xx responses to log file
app.use(
  morgan("common", {
    stream: fs.createWriteStream(path.join(__dirname, "error.log"), {
      flags: "a",
    }),
    skip: function (req, res) {
      return res.statusCode < 500;
    },
  })
);

app.use(cookieParser());
app.use(bodyParser.json({ limit: "100000mb" }));
app.use(bodyParser.urlencoded({ limit: "100000mb", extended: true }));

app.get("/json-data", (req, res) => {
  res.sendFile(path.join(__dirname, "data.json"));
});

// routes
app.use("/api/index", indexRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/collection", collectionRouter);
app.use("/api/nfts", nftRouter);
app.use("/api/admin", adminRouter);
app.use("/api/v2", v2Router);

// socket.io
io.on("connection", async (socket) => {
  socket.once("join", async (userId) => {
    console.log("user joined", socket.id, userId);

    const user = ONLINE_USERS.find((user) => user.user === userId);

    // if user is not found, create a new user
    if (!user) {
      ONLINE_USERS.push({
        socketId: socket.id,
        user: userId,
      });

      console.log("ONLINE_USERS", ONLINE_USERS);
    }
  });

  // find all notifications for user
  socket.on("get-notifications", async (userId) => {
    const notifications = await getNotifications(userId);

    socket.emit("show-notifications", notifications);
  });

  // send notification to individual user
  socket.on("save-new-individual-notification", async (data) => {
    if (data?.for === data?.referenceUser) return;
    const user = ONLINE_USERS.find((user) => user.user === data.for);

    const newNotification = await createNotification(data);

    if (user) {
      console.log("user found", user);
      io.to(user.socketId).emit(
        "show-new-individual-notification",
        newNotification
      );
    }

    // call get-notifications to update notifications for user
    // let forUser = await getUserIdFromUUID(data.for);
    // const notifications = await getNotifications(forUser);

    // socket.emit("show-notifications", notifications);
  });

  // delete notification from database
  socket.on("delete-notification", async (notificationId) => {
    await deleteNotification(notificationId);
  });

  // mark notification as read
  socket.on("mark-notification-as-read", async (notificationId) => {
    await markNotificationAsRead(notificationId);
  });

  // delete all notifications for user
  socket.on("delete-all-notifications", async (userId) => {
    await deleteAllNotifications(userId);
  });

  // mark all notifications as read for user
  socket.on("mark-all-notifications-as-read", async (userId) => {
    await markAllNotificationsAsRead(userId);
  });

  // delete user from database when user disconnects
  socket.on("disconnect", async () => {
    console.log("user disconnected", socket.id);

    const index = ONLINE_USERS.findIndex((user) => user.socketId === socket.id);
    if (index !== -1) {
      ONLINE_USERS.splice(index, 1);
    }

    console.log("ONLINE_USERS", ONLINE_USERS);
  });
});

const connectWithRetry = () => {
  mongoose.set("strictQuery", false);

  return mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("MongoDB is connected");
    })
    .catch((err) => {
      console.log(
        "MongoDB connection unsuccessful, retry after 5 seconds.",
        err
      );
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

httpServer.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});
