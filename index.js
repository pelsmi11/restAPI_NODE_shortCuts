import "dotenv/config";
import "./database/connectdb.js";
import express from "express";
import authRouter from "./routes/auth.route.js";
import linkRouter from "./routes/link.route.js";
import redirectRouter from "./routes/redirect.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// app.use(cors());

const whitelist = [process.env.ORIGIN1, process.env.ORIGIN2];
app.use(
  cors({
    origin: function (origin, callback) {
      if (whitelist.includes(origin)) {
        return callback(null, origin);
      }
      return callback("Error de CORS origin: " + origin + " No Autorizado!");
    },
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/links", linkRouter);
app.use("/", redirectRouter);
//solo para el ejemplo de login
// app.use(express.static("public"));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () =>
  console.log(`🚀 server levantado en http://localhost:${PORT}`)
);
