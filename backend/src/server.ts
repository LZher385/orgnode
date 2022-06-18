import express from "express";
import mongoose from "mongoose";
// import dotenv from "dotenv";
import http from "http";
import { logging, config } from "./config";
import { nodeRoutes } from "./routes";
import cors from "cors";

// dotenv.config();

const mongoUrl = "mongodb://127.0.0.1:27017/orgnode";

const router = express();

const httpServer = http.createServer(router);

mongoose
  .connect(mongoUrl, {})
  .then((result) => {
    logging.info("Mongo Connected");
  })
  .catch((error) => {
    logging.error(error);
  });

router.use((req, res, next) => {
  logging.info(
    `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
  );

  res.on("finish", () => {
    logging.info(
      `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`
    );
  });

  next();
});

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }

  next();
});

/** Routes */
router.use("/nodes", nodeRoutes);

/** Error handling */
router.use((req, res, next) => {
  const error = new Error("Not found");

  res.status(404).json({
    message: error.message,
  });
});

httpServer.listen(config.server.port, () =>
  logging.info(`Server is running ${config.server.host}:${config.server.port}`)
);
