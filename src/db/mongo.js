import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const isTest = process.env.NODE_ENV === "test";

const uri = isTest
  ? process.env.MONGODB_URI_TEST || "mongodb://localhost:27017/foodexpress_test"
  : process.env.MONGODB_URI || "mongodb://localhost:27017/foodexpress";

const dbName = isTest
  ? process.env.DB_NAME_TEST || "foodexpress_test"
  : process.env.DB_NAME || "foodexpress";

mongoose
  .connect(uri, { dbName })
  .then(() => {
    console.log("MongoDB connecté :", uri, "DB:", dbName);
  })
  .catch((err) => {
    console.error("Erreur de connexion MongoDB:", err);
    process.exit(1);
  });

export default mongoose;