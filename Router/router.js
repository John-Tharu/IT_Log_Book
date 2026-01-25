import { Router } from "express";
import {
  addlogpage,
  dashboardpage,
  forgetpage,
  loginpage,
  loglistpage,
  signuppage,
  viewlogpage,
} from "../controller/controller.js";
import { login, signup } from "../controller/postcontroller.js";

const router = Router();

router.route("/").get(dashboardpage);

router.route("/login").get(loginpage).post(login);

router.route("/signup").get(signuppage).post(signup);

router.route("/forget").get(forgetpage);

router.route("/addlog").get(addlogpage);

router.route("/loglist/:list").get(loglistpage);

router.route("/viewlog").get(viewlogpage);

export const routerdata = router;
