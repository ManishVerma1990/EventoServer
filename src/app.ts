import express from "express";
import session from "express-session";
import passport from "passport";
import "dotenv/config";
import "./config/passport.js";
import cors from "cors";

import db from "./config/db.config.js";
// import { RowDataPacket } from "mysql2";
// import bodyParser from "body-parser";
import userRoute from "./routes/userRoute.js";
import eventRoute from "./routes/eventRoute.js";
import regRouter from "./routes/registrationRoute.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }, // Set to true if using HTTPS
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:5173", // allow requests from Vite dev server
    credentials: true, // allow cookies if needed
  })
);

app.use("/user", userRoute);
app.use("/event", eventRoute);
app.use("/registration", regRouter);

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("<h1>home page</h1>");
});

app.get("/db", async (req: express.Request, res: express.Response) => {
  try {
    const [results] = await db.query("show tables");

    console.log(results);
  } catch (err) {
    console.log(err);
  }
});

app.listen("8080", () => {
  console.log("server is running on 8080");
});
