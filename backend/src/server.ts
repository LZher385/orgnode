import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import listRoutes from "./routes/listRoutes";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("Connected to db");

    const app = express();

    app.use(express.json());
    app.use(cors());
    app.use("/list", listRoutes);

    // app.get("/", (req, res) => res.send("hello world"));

    app.listen(8080, () => {
      console.log("Now listening to port 8080");
    });
  })
  .catch(() => {
    throw new Error();
  });
