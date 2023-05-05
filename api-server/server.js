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
// const { Server } = require("socket.io");
// const io = new Server(httpServer, {
//   cors: {
//     origin: process.env.CLIENT_URL,
//   },
// });
const indexRouter = require("./routes/index.route");
const authRouter = require("./routes/auth.route");
const collectionRouter = require("./routes/collection.route");
const userRouter = require("./routes/user.route");
const nftRouter = require("./routes/nft.route");

// cors
app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.ADMIN_URL],
  })
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
app.use("/api/nft", nftRouter);

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
