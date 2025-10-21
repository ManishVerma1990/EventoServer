import express from "express";
import "dotenv/config";
import db from "./config/db.config.js";
import { RowDataPacket } from "mysql2";
// import bodyParser from "body-parser";
import userRoute from "./routes/userRoute.js";
import eventRoute from "./routes/eventRoute.js";
import regRouter from "./routes/registrationRoute.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
