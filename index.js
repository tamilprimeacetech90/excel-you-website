const express = require("express");
const path = require("path");
const session = require("express-session");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

dotenv.config();

// Models
const Admin = require("./models/Admin");

// DB connection
const connectDB = require("./config/db");

// Routes
const adminRoutes = require("./routes/adminRoutes");
const contentRoutes = require("./routes/contentRoutes");
const isAdmin = require("./middleware/isAdmin");
// App init
const app = express();

// =====================
// 🔌 DATABASE CONNECT
// =====================
connectDB();

// =====================
// 🔐 MIDDLEWARE
// =====================

// Body parsers
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session
app.use(
    session({
        secret: process.env.SESSION_SECRET || "fallbackSecret123",
        resave: false,
        saveUninitialized: false,
    })
);

// =====================
// 🔒 AUTH MIDDLEWARE
// =====================

// =====================
// 🔗 API ROUTES (PROTECTED)
// =====================
app.use("/api/admin", isAdmin, adminRoutes);
app.use("/api", contentRoutes);

// =====================
// 🏠 FRONTEND ROUTES
// =====================
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "about.html"));
});

app.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "contact.html"));
});

// =====================
// 🔐 LOGIN PAGE
// =====================
app.get("/login", (req, res) => {
    res.send(`
        <h2>Admin Login 🔐</h2>
        <form method="POST" action="/login">
            <input name="username" placeholder="Username" required /><br><br>
            <input name="password" type="password" placeholder="Password" required /><br><br>
            <button type="submit">Login</button>
        </form>
    `);
});

// =====================
// 🔐 LOGIN HANDLER (SECURE)
// =====================
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username });

        if (!admin) {
            return res.send("❌ Invalid credentials");
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.send("❌ Invalid credentials");
        }

        // store session securely
        req.session.adminId = admin._id;

        res.redirect("/admin");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// =====================
// 📊 ADMIN PANEL (PROTECTED)
// =====================
app.get("/admin", isAdmin, (req, res) => {
    res.send(`
        <h1>Admin Panel 📊</h1>
        <p>Welcome Admin</p>
        <a href="/logout">Logout</a>
    `);
});

// =====================
// 🚪 LOGOUT
// =====================
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

// =====================
// 🚀 START SERVER
// =====================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});