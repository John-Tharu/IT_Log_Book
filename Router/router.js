import { Router } from "express";
import path from "path";
import {
  addlogpage,
  anotherAction,
  changePasswordPage,
  dashboardpage,
  editpage,
  editprofilepage,
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
  editprofile,
  login,
  resendVerificationLink,
  resetPass,
  resetPassword,
  signup,
} from "../controller/postcontroller.js";
import multer from "multer";

const router = Router();

router.route("/").get(dashboardpage);

router.route("/login").get(loginpage).post(login);

router.route("/signup").get(signuppage).post(signup);

router.route("/forget").get(forgetpage).post(resetPassword);

router.route("/reset-password/:token").get(resetPasswordPage).post(resetPass);

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

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}_${Math.random()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const avatarUpload = multer({
  storage: avatarStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

router
  .route("/editprofile")
  .get(editprofilepage)
  .post(avatarUpload.single("avatar"), editprofile);

router.route("/change-password").get(changePasswordPage);

export const routerdata = router;
