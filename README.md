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

    PORT="YOUR_PORT_NUMBER"
    MY_SECRET_KEY="YOUR_SECRET_KEY"
    JWT_SECRET_KEY="YOUR_JWT_SECRET_KEY"
    HOSTNAME="http://localhost:YOUR_PORT_NUMBER"
    EMAIL_ADDRESS="YOUR_EMAIL_ADDRESS"
    EMAIL_PASS="YOUR_GMAIL_APP_PASSWORD"

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

# 🗄️ Database Setup (MySQL + Drizzle ORM)

This project uses **MySQL** with **Drizzle ORM** for database management
and migrations.

---

### 1️⃣ Create MySQL Database

Run the following command in MySQL to create the database:

```sql
CREATE DATABASE it_log_book;
```

(Optional) Verify the database:

```sql
SHOW DATABASES;
```

---

### 2️⃣ Configure Environment Variables

Check `.env` file in the root directory and add:

    DATABASE_URL="mysql://DATABASE_USER:DATABASE_PASSWORD@localhost:3306/YOUR_DATABASE_NAME"

---

# ⚡ Drizzle ORM Setup

Drizzle ORM is used for **schema management and database migrations**.

---

# 📦 Generate Migration Files

```bash
npx drizzle-kit generate
```

### What this command does:

- Reads your **Drizzle schema files**
- Compares schema changes
- Generates **SQL migration files** automatically

Example generated structure:

    drizzle/
     └── migrations/
          └── 0001_create_users_table.sql

These files contain SQL queries that define your database structure.

---

# 🗄️ Run Database Migrations

```bash
npx drizzle-kit migrate
```

### What this command does:

- Executes generated migration files
- Creates tables in MySQL
- Applies schema updates automatically

Example output:

    ✔ applying migration 0001_create_users_table.sql
    ✔ applying migration 0002_create_logs_table.sql

After running this command, all necessary **tables will be created in
your database**.

---

# 🔁 Typical Workflow

Whenever you update your schema:

### Step 1 --- Update schema file

Modify your `schema.js` or schema file.

### Step 2 --- Generate migration

```bash
npx drizzle-kit generate
```

### Step 3 --- Apply migration

```bash
npx drizzle-kit migrate
```

---

# 📁 Example Drizzle Folder Structure

    drizzle
     ├── schema.js
     └── migrations
          ├── 0001_users.sql
          └── 0002_logs.sql

---

✅ This process ensures your **database structure stays synchronized
with your application schema**.

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
  ![Login](screenshots/Login.png)
- Dashboard
  ![Dashboard](screenshots/Dashboard.png)
- Log List
  ![LogList](screenshots/Total Logs.png)
- Add Log Form
  ![AddLog](screenshots/Add Log.png)
- Profile
  ![Profile](screenshots/Profile.png)

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
