import express from "express";
import dotenv from "dotenv";
import { routerdata } from "./router/router.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(routerdata);

app.use(express.static("public"));

app.set("view engine", "ejs");

app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});
