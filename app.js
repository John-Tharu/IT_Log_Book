import express from "express";
import dotenv from "dotenv";
import { routerdata } from "./Router/router.js";
import session from "express-session";
import flash from "express-flash";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.MY_SECRET_KEY,
    resave: true,
    saveUninitialized: false,
  }),
);

app.use(flash());

app.use(routerdata);

app.use(express.static("public"));

app.set("view engine", "ejs");

app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});
