import {
  clearVerifyEmailTokens,
  findVerificationEmailToken,
  getLogs,
  getMessages,
  getSolvedLogs,
  getThisWeekLog,
  getUserById,
  getUserByToken,
  getUserLogs,
  getUserLogsById,
  getUserPendingLogs,
  getUserPendingLogsById,
  searchData,
  verifyUserEmailAndUpdate,
} from "../model/model.js";
import { verifyEmailSchema } from "../validation/validation.js";

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
  res.render("forget", {
    msg: req.flash("error"),
    formSubmitted: req.flash("formSubmitted")[0],
  });
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

  const now = new Date();

  // 5 hours 45 minutes in milliseconds
  const offset = (5 * 60 + 45) * 60 * 1000;

  // Add offset
  const nepalTime = new Date(now.getTime() + offset);

  const todayString = nepalTime.toDateString();

  // console.log(todayString);

  const todaysPendingLogs = userPendingLog.filter(
    (log) => new Date(log.createdAt).toDateString() === todayString,
  );

  const a = todaysPendingLogs.length;

  const userThisWeekLog = await getThisWeekLog();

  // console.log(userThisWeekLog);

  const userSolvedLog = await getSolvedLogs();

  const todaysSolvedLogs = userSolvedLog.filter(
    (log) => new Date(log.createdAt).toDateString() === todayString,
  );

  const b = todaysSolvedLogs.length;

  const c = a + b;

  const data = { a, b, c };

  res.render("dashboard", {
    userLog,
    userPendingLog,
    userThisWeekLog,
    userSolvedLog,
    data,
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

    // Start of week (Monday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    startOfWeek.setHours(0, 0, 0, 0);

    // End of week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return logDate >= startOfWeek && logDate <= endOfWeek;
  };

  // Filtering
  if (list === "week") {
    userLogs = await getThisWeekLog();
  }

  if (list === "solved") {
    userLogs = userLogs.filter((log) => log?.status === "Solved");
  }

  if (list === "pending") {
    userLogs = userLogs.filter((log) => log?.status !== "Solved");
  }
  // -------------------------------
  // console.log(userLogs);

  res.render("loglist", {
    title: titles[list],
    icon: icon[list],
    userLogs,
  });
};

export const viewlogpage = async (req, res) => {
  if (!req.user) return res.redirect("/login");
  const id = req.params.id;

  const [viewLog] = await getLogs(id);

  const messageLog = await getMessages(id);

  const solvedBy = viewLog.solvedBy;

  if (!solvedBy) {
    return res.render("viewlog", { viewLog, messageLog });
  }

  const [user] = await getUserById(solvedBy);

  res.render("viewlog", { viewLog, name: user.name, messageLog });
};

export const page404 = (req, res) => {
  res.render("404");
};

export const editpage = async (req, res) => {
  if (!req.user) return res.redirect("/login");

  const id = req.params.id;

  const [log] = await getLogs(id);

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
  res.clearCookie("access_token");
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

export const profilePage = async (req, res) => {
  if (!req.user) return res.redirect("/login");

  const id = req.user.id;

  const [user] = await getUserById(id);

  const userLog = await getUserLogsById(id);

  const userPendingLog = await getUserPendingLogsById(id);

  res.render("profile", { user, userPendingLog, userLog });
};

export const verifyEmailPage = (req, res) => {
  if (!req.user) return res.redirect("/login");

  const userId = req.user.id;

  const user = getUserById(userId);

  if (!user || user.isEmailValid) return res.redirect("/login");

  res.render("verify_email", { msg: req.flash("error") });
};

export const verifyEmailToken = async (req, res) => {
  const { data, error } = verifyEmailSchema.safeParse(req.query);

  if (error) {
    return res.send("Verification Link Expired");
  }

  const token = await findVerificationEmailToken(data);

  if (!token) {
    return res.send("Verification Link Expired");
  }

  await verifyUserEmailAndUpdate(token.email);

  await clearVerifyEmailTokens(token.email);

  res.redirect("/profile");
};

export const resetPasswordPage = async (req, res) => {
  const token = req.params.token;

  // console.log(token);

  const [user] = await getUserByToken(token);

  // console.log(user);

  if (!user) return res.redirect("/expirepage");

  res.render("resetPage", { token, msg: req.flash("error") });
};

export const searchLogs = async (req, res) => {
  const { search } = req.body;

  const data = await searchData(search);

  res.render("searchlogs", { data });
};
