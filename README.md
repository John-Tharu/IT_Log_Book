# 📘 IT Log Book

A web-based **IT Log Management System** that allows users to record,
track, and manage their daily IT work logs efficiently. The system helps
monitor task progress, track solved and pending logs, and manage user
activities through a simple dashboard.

This project is built using **Node.js, Express, MySQL, and EJS**
following the **MVC architecture**.

---

# 🚀 Features

- 🔐 User Authentication (Login / Logout)
- 👤 User Profile Management
- 📝 Create IT Work Logs
- ✏️ Edit and Update Logs
- 🗑️ Delete Logs
- 📊 Dashboard with log statistics
- 📅 Filter logs by date (today, week, etc.)
- ✅ Mark logs as solved or pending
- 📧 Email features (password reset / verification)
- 🖼️ Avatar upload support

---

# 🛠️ Tech Stack

**Backend** - Node.js - Express.js

**Frontend** - EJS - HTML - CSS - JavaScript

**Database** - MySQL - Drizzle ORM

**Other Tools** - Nodemailer - Multer - Zod Validation - Express
Session - Flash Messages

---

# 📂 Project Structure

    IT_Log_Book
    │
    ├── controllers
    ├── models
    ├── routes
    ├── views
    │   ├── partials
    │   └── pages
    │
    ├── public
    │   ├── css
    │   └── images
    │
    ├── middleware
    ├── utils
    ├── database
    │
    ├── app.js
    ├── package.json
    └── README.md

---

# ⚙️ Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/John-Tharu/IT_Log_Book.git
cd IT_Log_Book
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup Environment Variables

Create a `.env` file in the root folder.

    PORT=3000

    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=yourpassword
    DB_NAME=it_log_book

    EMAIL_USER=your_email@gmail.com
    EMAIL_PASS=your_app_password

### 4️⃣ Run the Application

```bash
npm start
```

or

```bash
node app.js
```

The app will run on:

    http://localhost:3000

---

# 📊 Dashboard Features

The dashboard provides:

- Total Logs
- Solved Logs
- Pending Logs
- Today's Activity
- User Statistics Chart

---

# 🔑 Authentication Features

- User Registration
- Secure Login
- Password Reset via Email
- Email Verification
- Session-based Authentication

---

# 📸 Screenshots

Add screenshots here for:

- Login Page
- Dashboard
- Log List
- Add Log Form

Example:

    /screenshots/dashboard.png
    /screenshots/loglist.png

---

# 🤝 Contributing

Contributions are welcome.

1.  Fork the repository\
2.  Create a new branch

```{=html}
<!-- -->
```

    git checkout -b feature-name

3.  Commit changes

```{=html}
<!-- -->
```

    git commit -m "Added new feature"

4.  Push and create a Pull Request

---

# 👨‍💻 Author

**Alex (John Tharu)**\
BCA Graduate \| Aspiring Software Developer

GitHub:\
https://github.com/John-Tharu

---

⭐ If you like this project, consider giving it a **star on GitHub**.
