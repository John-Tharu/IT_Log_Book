import {
  getSolvedLogs,
  getThisWeekLog,
  getUserLogs,
  getUserPendingLogs,
} from "../model/model.js";

export const loginpage = (req, res) => {
  res.render("login", { msg: req.flash("error") });
};

export const signuppage = (req, res) => {
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, private",
    Pragma: "no-cache",
    Expires: "0",
  });
  res.render("signup", { msg: req.flash("error") });
};

export const forgetpage = (req, res) => {
  res.render("forget");
};

export const addlogpage = (req, res) => {
  res.render("addlog", { msg: req.flash("error") });
};

export const dashboardpage = async (req, res) => {
  const userLog = await getUserLogs();

  // console.log(userLog);

  const userPendingLog = await getUserPendingLogs();

  const userThisWeekLog = await getThisWeekLog();

  // console.log(userThisWeekLog);

  const userSolvedLog = await getSolvedLogs();

  res.render("dashboard", {
    userLog,
    userPendingLog,
    userThisWeekLog,
    userSolvedLog,
  });
};

export const loglistpage = (req, res) => {
  const list = req.params.list;
  const titles = {
    totallog: "Total Logs",
    week: "This Week Logs",
    solved: "Solved Logs",
    pending: "Pending Logs",
  };
  const icon = {
    totallog: "fa-solid fa-book-open",
    week: "fa-solid fa-calendar-days",
    solved: "fa-solid fa-check",
    pending: "fa-solid fa-clock",
  };
  res.render("loglist", { title: titles[list], icon: icon[list] });
};

export const viewlogpage = (req, res) => {
  res.render("viewlog");
};
