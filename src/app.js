import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import yaml from "yaml";
import "./db/mongo.js";
import authRouter from "./routes/auth.router.js";
import usersRouter from "./routes/users.router.js";
import restaurantsRouter from "./routes/restaurants.router.js";
import menusRouter from "./routes/menus.router.js";
import errorHandler from "./middlewares/error.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Swagger
const file = fs.readFileSync("src/docs/openapi.yaml", "utf8");
const swaggerDoc = yaml.parse(file);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Routes
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/restaurants", restaurantsRouter);
app.use("/menus", menusRouter);

// Erreurs
app.use(errorHandler);

export default app;