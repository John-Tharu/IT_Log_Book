import { Router } from "express";
import {
  addlogpage,
  forgetpage,
  loginpage,
  signuppage,
} from "../controller/controller.js";

const router = Router();

router.route("/login").get(loginpage);

router.route("/signup").get(signuppage);

router.route("/forget").get(forgetpage);

router.route("/addlog").get(addlogpage);

export const routerdata = router;
