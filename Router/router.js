import { Router } from "express";
import {
  addlogpage,
  dashboardpage,
  forgetpage,
  loginpage,
  signuppage,
  totallogpage,
  viewlogpage,
} from "../controller/controller.js";

const router = Router();

router.route("/").get(dashboardpage);

router.route("/login").get(loginpage);

router.route("/signup").get(signuppage);

router.route("/forget").get(forgetpage);

router.route("/addlog").get(addlogpage);

router.route("/totallog").get(totallogpage);

router.route("/viewlog").get(viewlogpage);

export const routerdata = router;
