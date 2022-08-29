import "dotenv/config";
import "./database/connectdb.js";
import express from "express";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
//solo para el ejemplo de login
app.use(express.static("public"));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () =>
  console.log(`🚀 server levantado en http://localhost:${PORT}`)
);
