
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Message = require("./models/Message");
console.log("ENV CHECK:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✔"))
.catch(err => {
    console.error("FULL MONGO ERROR:", err);
});

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "about.html"));
});

app.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname, "contact.html"));
});

app.post("/contact", async (req, res) => {
    const { name, email, message } = req.body;

    await Message.create({
        name,
        email,
        message
    });

    res.send("<h1>Message Saved in Database 👍</h1><a href='/'>Go Back</a>");
});

app.get("/admin", async (req, res) => {
    const messages = await Message.find();

    let html = "<h1>Admin Panel 📊</h1><a href='/'>Home</a><hr>";

    messages.forEach(m => {
        html += `
        <div style="margin:10px;padding:10px;border:1px solid #ccc;">
            <b>Name:</b> ${m.name} <br>
            <b>Email:</b> ${m.email} <br>
            <b>Message:</b> ${m.message}
        </div>`;
    });

    res.send(html);
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port " + PORT);
});