const express = require("express");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

dotenv.config();

const Admin = require("./models/Admin");
const connectDB = require("./config/db");

const adminRoutes = require("./routes/adminRoutes");
const contentRoutes = require("./routes/contentRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();


// =====================
// 🔌 DATABASE CONNECT
// =====================
connectDB();


// =====================
// 🔐 BODY PARSER
// =====================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// =====================
// 📁 STATIC FILES
// =====================
app.use(express.static(path.join(__dirname, "public")));

app.use(
    "/uploads",
    express.static(path.join(__dirname, "public/uploads"))
);


// =====================
// 🔐 SESSION
// =====================
app.use(
    session({
        secret:
            process.env.SESSION_SECRET ||
            "mySuperSecretKey@2026!",

        resave: false,
        saveUninitialized: false,

        // ✅ FIXED
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            collectionName: "sessions"
        }),

        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1 day
            httpOnly: true
        }
    })
);


// =====================
// 📤 UPLOAD API
// =====================
app.use("/api/upload", uploadRoutes);


// =====================
// 🔗 API ROUTES
// =====================
app.use("/api/admin", adminRoutes);
app.use("/api", contentRoutes);


// =====================
// 🌍 WEBSITE PAGES
// =====================

// HOME
app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );

});


// ABOUT
app.get("/about", (req, res) => {

    res.sendFile(
        path.join(__dirname, "public", "about.html")
    );

});


// CONTACT
app.get("/contact", (req, res) => {

    res.sendFile(
        path.join(__dirname, "public", "contact.html")
    );

});


// 🎓 STUDENT LMS
app.get("/student", (req, res) => {

    res.sendFile(
        path.join(__dirname, "public", "student.html")
    );

});


// 🔐 LOGIN PAGE
app.get("/login", (req, res) => {

    res.sendFile(
        path.join(__dirname, "public", "Login.html")
    );

});


// =====================
// 🔐 LOGIN
// =====================
app.post("/login", async (req, res) => {

    try {

        const { username, password } = req.body;

        if (!username || !password) {

            return res.send(
                "❌ Username and password required"
            );
        }

        // find admin
        const admin = await Admin.findOne({
            username
        });

        if (!admin) {

            return res.send(
                "❌ Invalid username or password"
            );
        }

        // compare password
        const isMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isMatch) {

            return res.send(
                "❌ Invalid username or password"
            );
        }

        // save session
        req.session.adminId = admin._id;

        // redirect admin
        res.redirect("/admin");

    } catch (err) {

        console.error("LOGIN ERROR:", err);

        res.status(500).send("Server Error");

    }

});


// =====================
// 🚪 LOGOUT
// =====================
app.get("/logout", (req, res) => {

    req.session.destroy(() => {

        res.clearCookie("connect.sid");

        res.redirect("/login");

    });

});


// =====================
// ❌ 404 PAGE
// =====================
app.use((req, res) => {

    res.status(404).send(`
        <h1>404 - Page Not Found</h1>
        <a href="/">Go Home</a>
    `);

});


// =====================
// 🚀 START SERVER
// =====================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `✅ Server running on port ${PORT}`
    );

});