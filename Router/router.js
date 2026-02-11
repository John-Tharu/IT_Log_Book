import { Router } from "express";
import {
  addlogpage,
  anotherAction,
  dashboardpage,
  editpage,
  forgetpage,
  loginpage,
  loglistpage,
  logout,
  page404,
  profilePage,
  signuppage,
  viewlogpage,
} from "../controller/controller.js";
import {
  addlog,
  anotherMessage,
  editLog,
  login,
  signup,
} from "../controller/postcontroller.js";

const router = Router();

router.route("/").get(dashboardpage);

router.route("/login").get(loginpage).post(login);

router.route("/signup").get(signuppage).post(signup);

router.route("/forget").get(forgetpage);

router.route("/addlog").get(addlogpage).post(addlog);

router.route("/loglist/:list").get(loglistpage);

router.route("/viewlog/:id").get(viewlogpage);

router.route("/404").get(page404);

router.route("/edit/:id").get(editpage).post(editLog);

router.route("/logout").get(logout);

router.route("/anotheraction/:id").get(anotherAction).post(anotherMessage);

router.route("/profile/:id").get(profilePage);

export const routerdata = router;
