import { sendEmail } from "../lib/nodemailer.js";
import {
  addAnotherAction,
  addLogs,
  addUser,
  checkEmail,
  checkemail,
  checkPass,
  createVerifyEmailLink,
  editLogs,
  generateRandomToken,
  generateToken,
  getUserById,
  hashpass,
  insertVerifyEmailToken,
} from "../model/model.js";
import {
  anotherMessageValidation,
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

  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

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

  const randomToken = await generateRandomToken();

  await insertVerifyEmailToken({ userId: req.user.id, token: randomToken });

  const verifyEmailLink = createVerifyEmailLink({
    email: req.user.email,
    token: randomToken,
  });

  sendEmail({
    to: req.user.email,
    subject: "Verify Your Email Address",
    html: `<h1>Click the link below to verify your email address</h1>
    <p>You can use this token <code>${randomToken}</code></p>
    <a href="${verifyEmailLink}">Verify Email</a>`,
  }).catch((err) => console.log(err));

  res.redirect("/verify-email");
};
