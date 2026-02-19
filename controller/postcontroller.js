import { sendEmail } from "../lib/nodemailer.js";
import {
  addAnotherAction,
  addLogs,
  addUser,
  checkEmail,
  checkemail,
  checkPass,
  createResetPasswordLink,
  createVerifyEmailLink,
  editLogs,
  generateRandomToken,
  generateToken,
  getForgetPasswordTemplate,
  getUserById,
  hashpass,
  insertVerifyEmailToken,
  newSendEmailVerification,
} from "../model/model.js";
import {
  anotherMessageValidation,
  forgetPasswordValidation,
  loginValidation,
  signupValidation,
  userLogsValidation,
} from "../validation/validation.js";

//********************** SignUp Data **************************
export const signup = async (req, res) => {
  const { data, error } = signupValidation.safeParse(req.body);

  if (error) {
    console.log(error);
    req.flash("error", error.errors[0].message);
    return res.redirect("/signup");
  }

  const { email, name, pass } = data;

  const [checkedemail] = await checkemail(email);

  if (checkedemail) {
    req.flash("error", "Email Already Exists");
    return res.redirect("/signup");
  }

  const password = await hashpass(pass);

  const capitalName = name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const [user] = await addUser({ email, name: capitalName, pass: password });

  await newSendEmailVerification({ userId: user.id, email });

  res.redirect("/");
};

//********************** Login Data **************************
export const login = async (req, res) => {
  const { data, error } = loginValidation.safeParse(req.body);

  if (error) {
    // console.log(error);
    req.flash("error", error.errors[0].message);
    return res.redirect("/login");
  }

  const { email, pass } = data;

  // console.log(email, pass);

  const [user] = await checkEmail(email);

  // console.log(user);

  if (!user) {
    req.flash("error", "Please check username or password");
    return res.redirect("/login");
  }

  const checkedPass = await checkPass(pass, user.pass);

  if (!checkedPass) {
    req.flash("error", "Please check username or password");
    return res.redirect("/login");
  }

  const token = generateToken({
    id: user.id,
    name: user.name,
    email: user.email,
    verifyEmail: user.isEmailValid,
  });

  // console.log(token);

  res.cookie("access_token", token);

  res.redirect("/");
};

export const addlog = async (req, res) => {
  const { data, error } = userLogsValidation.safeParse(req.body);

  if (error) {
    req.flash("error", error.errors[0].message);
    return res.redirect("/addlog");
  }

  // console.log(data);

  const { date, time, report, location, description, action, status } = data;

  const capitalLocation = location.charAt(0).toUpperCase() + location.slice(1);

  const captalDescription =
    description.charAt(0).toUpperCase() + description.slice(1);

  const captalAction = action.charAt(0).toUpperCase() + action.slice(1);

  const capitalReport = report.charAt(0).toUpperCase() + report.slice(1);

  const userId = req.user.id;

  const solvedBy = status === "Solved" ? userId : null;

  // console.log(solvedBy);

  const logs = await addLogs({
    date,
    time,
    reportedBy: capitalReport,
    location: capitalLocation,
    description: captalDescription,
    action: captalAction,
    status,
    userId,
    solvedBy,
  });

  // console.log(logs);

  if (!logs) {
    req.flash("error", "Something went wrong");
    return res.redirect("/addlog");
  }

  res.redirect("/");
};

export const editLog = async (req, res) => {
  if (!req.user) return res.redirect("/login");

  const id = req.params.id;

  const { data, error } = userLogsValidation.safeParse(req.body);

  if (error) {
    req.flash("error", error.errors[0].message);
    return res.redirect(`/edit/${id}`);
  }

  const { date, time, report, location, description, action, status } = data;

  const capitalLocation = location.charAt(0).toUpperCase() + location.slice(1);

  const captalDescription =
    description.charAt(0).toUpperCase() + description.slice(1);

  const captalAction = action.charAt(0).toUpperCase() + action.slice(1);

  const capitalReport = report.charAt(0).toUpperCase() + report.slice(1);

  const userId = req.user.id;

  const solvedBy = status === "Solved" ? userId : null;

  // console.log(solvedBy);

  const logs = await editLogs({
    id,
    date,
    time,
    reportedBy: capitalReport,
    location: capitalLocation,
    description: captalDescription,
    action: captalAction,
    status,
    userId,
    solvedBy,
  });

  console.log(logs);

  if (!logs) {
    req.flash("error", "Something went wrong");
    return res.redirect(`/edit/${id}`);
  }

  res.redirect("/");
};

export const anotherMessage = async (req, res) => {
  if (!req.user) return res.redirect("/login");

  const id = req.params.id;

  const userId = req.user.id;

  const { data, error } = anotherMessageValidation.safeParse(req.body);

  if (error) {
    req.flash("error", error.errors[0].message);
    return res.redirect(`/anotherAction/${id}`);
  }

  const { action, status } = data;

  // console.log(data);

  const captalAction = action.charAt(0).toUpperCase() + action.slice(1);

  const logs = await addAnotherAction({
    id,
    action: captalAction,
    status,
    userId,
  });

  // console.log(logs);

  res.redirect(`/viewlog/${id}`);
};

export const resendVerificationLink = async (req, res) => {
  if (!req.user) return res.redirect("/login");

  const user = await getUserById(req.user.id);

  if (!user || user.isEmailValid) return res.redirect("/login");

  const verifyURL = await newSendEmailVerification({
    userId: req.user.id,
    email: req.user.email,
  });

  req.flash("error", verifyURL);

  res.redirect("/verify-email");
};

export const resetPassword = async (req, res) => {
  const { data, error } = forgetPasswordValidation.safeParse(req.body);

  if (error) {
    req.flash("error", error.errors[0].message);
    return res.redirect("/forget");
  }

  const { email } = data;

  console.log(email);

  const [user] = await checkEmail(email);

  if (!user) {
    req.flash("error", "User not found");
    return res.redirect("/forget");
  }

  const resetLink = await createResetPasswordLink({
    userId: user.id,
  });

  // console.log(resetLink);

  const html = await getForgetPasswordTemplate({
    name: user.name,
    link: resetLink,
  });

  await sendEmail({ to: user.email, subject: "Reset Password", html });

  req.flash("formSubmitted", true);

  res.redirect("/forget");
};
