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
  resetPasswordPage,
  searchLogs,
  signuppage,
  verifyEmailPage,
  verifyEmailToken,
  viewlogpage,
} from "../controller/controller.js";
import {
  addlog,
  anotherMessage,
  editLog,
  login,
  resendVerificationLink,
  resetPass,
  resetPassword,
  signup,
} from "../controller/postcontroller.js";

const router = Router();

router.route("/").get(dashboardpage);

router.route("/login").get(loginpage).post(login);

router.route("/signup").get(signuppage).post(signup);

router.route("/forget").get(forgetpage).post(resetPassword);

router.route("/reset-password/:token").get(resetPasswordPage).post(resetPass);

// router.route("/resetPass").post(resetPass);

router.route("/addlog").get(addlogpage).post(addlog);

router.route("/loglist/:list").get(loglistpage);

router.route("/viewlog/:id").get(viewlogpage);

router.route("/404").get(page404);

router.route("/edit/:id").get(editpage).post(editLog);

router.route("/logout").get(logout);

router.route("/anotheraction/:id").get(anotherAction).post(anotherMessage);

router.route("/profile").get(profilePage);

router.route("/verify-email").get(verifyEmailPage);

router.route("/resend_verification_link").post(resendVerificationLink);

router.route("/verify-email-token").get(verifyEmailToken);

router.route("/search").post(searchLogs);

export const routerdata = router;
