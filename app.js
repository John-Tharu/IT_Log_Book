import express from "express";
import dotenv from "dotenv";
import { routerdata } from "./Router/router.js";
import session from "express-session";
import flash from "express-flash";
import cookieParser from "cookie-parser";
import { verifyJWT } from "./middleware/middleware.js";

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

app.use(cookieParser());

app.use(verifyJWT);

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.user;
  return next();
});

app.use(routerdata);

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use((req, res) => {
  res.redirect("/404");
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});
