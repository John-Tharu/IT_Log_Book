import {
  addLogs,
  addUser,
  checkEmail,
  checkemail,
  checkPass,
  hashpass,
} from "../model/model.js";
import {
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
    res.redirect("/login");
  }

  const checkedPass = await checkPass(pass, user.pass);

  if (!checkedPass) {
    req.flash("error", "Please check username or password");
    res.redirect("/login");
  }

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

  const userId = 1;

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
