
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Message = require("./models/Message");
const session = require("express-session");


console.log("ENV CHECK:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✔"))
.catch(err => {
    console.error("FULL MONGO ERROR:", err);
});

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET|| "fallbackSecret123",
    resave: false,
    saveUninitialized: true
}));



app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "about.html"));
});

app.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname, "contact.html"));
});



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

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "1234") {
        req.session.user = "admin";
        res.redirect("/admin");
    } else {
        res.send("❌ Invalid login");
    }
});
app.post("/contact", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        await Message.create({ name, email, message });

        res.send("<h1>Message Saved in Database 👍</h1><a href='/'>Go Back</a>");
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ Error saving message");
    }
});
app.get("/admin", async (req, res) => {

    // 🔒 Block if not logged in
    if (!req.session.user) {
        return res.redirect("/login");
    }

    try {
        const messages = await Message.find();

        let html = `
        <h1>Admin Panel 📊</h1>
        <a href="/">Home</a> | <a href="/logout">Logout</a>
        <hr>
        `;

        messages.forEach(m => {
            html += `
            <div style="margin:10px;padding:10px;border:1px solid #ccc;border-radius:8px;">
                <b>Name:</b> ${m.name} <br>
                <b>Email:</b> ${m.email} <br>
                <b>Message:</b> ${m.message}
            </div>
            `;
        });

        res.send(html);

    } catch (err) {
        console.error(err);
        res.status(500).send("❌ Error loading admin panel");
    }
});
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port " + PORT);
});