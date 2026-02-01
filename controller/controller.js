import {
  getLogs,
  getSolvedLogs,
  getThisWeekLog,
  getUserById,
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

  console.log(userLog);

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
  const id = req.params.id;

  const [viewLog] = await getLogs(id);
  // console.log(viewLog);

  const solvedBy = viewLog.solvedBy;

  if (!solvedBy) {
    return res.render("viewlog", { viewLog });
  }

  const [user] = await getUserById(solvedBy);

  // console.log(user);

  res.render("viewlog", { viewLog, name: user.name });
};
