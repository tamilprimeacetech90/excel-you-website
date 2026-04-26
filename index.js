const express = require("express");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

dotenv.config();

const Admin = require("./models/Admin");
const connectDB = require("./config/db");

const adminRoutes = require("./routes/adminRoutes");
const contentRoutes = require("./routes/contentRoutes");
const isAdmin = require("./middleware/isAdmin");

const app = express();


// =====================
// 🔌 DATABASE CONNECT
// =====================
connectDB();


// =====================
// 🔐 MIDDLEWARE
// =====================
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// =====================
// 🔐 SESSION SETUP
// =====================
app.use(
    session({
        secret: process.env.SESSION_SECRET || "mySuperSecretKey@2026!",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({
            mongoUrl: process.env.MONGO_URI,
            collectionName: "sessions"
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        }
    })
);


// =====================
// 🔗 ROUTES
// =====================

// ✅ FIXED (no duplicate /admin)
app.use("/", adminRoutes);
app.use("/api", contentRoutes);


// =====================
// 🏠 FRONTEND
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
    res.sendFile(path.join(__dirname, "public", "Login.html"));
});


// =====================
// 🔐 LOGIN HANDLER
// =====================
app.post("/login", async (req, res) => {
    console.log("BODY:", req.body);

    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username });

        if (!admin) return res.send("❌ Invalid credentials");

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) return res.send("❌ Invalid credentials");

        // ✅ SESSION SAVE
        req.session.adminId = admin._id;

        res.redirect("/admin");

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
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
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});