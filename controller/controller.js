import {
  getLogs,
  getMessages,
  getSolvedLogs,
  getThisWeekLog,
  getUserById,
  getUserLogs,
  getUserPendingLogs,
} from "../model/model.js";

export const loginpage = (req, res) => {
  if (req.user) return res.redirect("/");
  res.render("login", { msg: req.flash("error") });
};

export const signuppage = (req, res) => {
  if (req.user) return res.redirect("/");
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, private",
    Pragma: "no-cache",
    Expires: "0",
  });
  res.render("signup", { msg: req.flash("error") });
};

export const forgetpage = (req, res) => {
  res.render("forget", { msg: req.flash("error") });
};

export const addlogpage = (req, res) => {
  if (!req.user) return res.redirect("/login");
  res.render("addlog", { msg: req.flash("error") });
};

export const dashboardpage = async (req, res) => {
  if (!req.user) return res.redirect("/login");
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

export const loglistpage = async (req, res) => {
  if (!req.user) return res.redirect("/login");
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

  let userLogs = await getUserLogs();

  // ---------- helpers ----------
  const isThisWeek = (dateStr) => {
    const logDate = new Date(dateStr);
    const today = new Date();

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return logDate >= startOfWeek && logDate <= endOfWeek;
  };
  // -----------------------------

  // ---------- filtering ----------
  if (list === "week") {
    userLogs = userLogs.filter((log) => log?.date && isThisWeek(log.date));
  }

  if (list === "solved") {
    userLogs = userLogs.filter((log) => log?.status === "Solved");
  }

  if (list === "pending") {
    userLogs = userLogs.filter((log) => log?.status !== "Solved");
  }
  // -------------------------------

  res.render("loglist", {
    title: titles[list],
    icon: icon[list],
    userLogs,
  });
};

export const viewlogpage = async (req, res) => {
  if (!req.user) return res.redirect("/login");
  const id = req.params.id;
  // console.log(id);

  const [viewLog] = await getLogs(id);
  // console.log(viewLog);

  const messageLog = await getMessages(id);

  // console.log(messageLog);

  const solvedBy = viewLog.solvedBy;

  if (!solvedBy) {
    return res.render("viewlog", { viewLog, messageLog });
  }

  const [user] = await getUserById(solvedBy);

  // console.log(user);

  res.render("viewlog", { viewLog, name: user.name, messageLog });
};

export const page404 = (req, res) => {
  res.render("404");
};

export const editpage = async (req, res) => {
  if (!req.user) return res.redirect("/login");

  const id = req.params.id;

  const [log] = await getLogs(id);

  // console.log(log);

  if (!log) return res.redirect("/404");

  const { date, time, reportedBy, location, description, action, status } = log;

  res.render("edit", {
    id,
    date,
    time,
    reportedBy,
    location,
    description,
    action,
    status,
    msg: req.flash("error"),
  });
};

export const logout = async (req, res) => {
  // console.log(req.user.sessionId);
  // await clearUserSession(req.user.sessionId);
  res.clearCookie("access_token");
  // res.clearCookie("refresh_token");
  res.redirect("/");
};

export const anotherAction = async (req, res) => {
  if (!req.user) return res.redirect("/login");

  const id = req.params.id;

  const [log] = await getLogs(id);

  if (!log) return res.redirect("/404");

  const { status } = log;

  res.render("anotherAction", { msg: req.flash("error"), id, status });
};
