export const loginpage = (req, res) => {
  res.render("login");
};

export const signuppage = (req, res) => {
  res.render("signup", { msg: req.flash("error") });
};

export const forgetpage = (req, res) => {
  res.render("forget");
};

export const addlogpage = (req, res) => {
  res.render("addlog");
};

export const dashboardpage = (req, res) => {
  res.render("dashboard");
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
