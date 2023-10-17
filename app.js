import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import connectDatabase from "./src/database/db.js";
import router from "./src/routes/index.js";

dotenv.config();
const app = express();

connectDatabase();
app.use(cors());
app.use(express.json());
app.use(router);

export default app;
