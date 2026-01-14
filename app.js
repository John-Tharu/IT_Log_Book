import express from "express";
import dotenv from "dotenv";
import { routerdata } from "./Router/router.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(routerdata);

app.set("view engine", "ejs");

app.use(express.static("public"));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
