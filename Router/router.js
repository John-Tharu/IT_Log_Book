import { Router } from "express";
import {
  addlogpage,
  dashboardpage,
  forgetpage,
  loginpage,
  loglistpage,
  page404,
  signuppage,
  viewlogpage,
} from "../controller/controller.js";
import { addlog, login, signup } from "../controller/postcontroller.js";

const router = Router();

router.route("/").get(dashboardpage);

router.route("/login").get(loginpage).post(login);

router.route("/signup").get(signuppage).post(signup);

router.route("/forget").get(forgetpage);

router.route("/addlog").get(addlogpage).post(addlog);

router.route("/loglist/:list").get(loglistpage);

router.route("/viewlog/:id").get(viewlogpage);

router.route("/404").get(page404);

export const routerdata = router;
