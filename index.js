const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

// Pages
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "about.html"));
});

app.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname, "contact.html"));
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running");
});   



const PORT = process.env.PORT || 3000;

// Admin route (MUST be before listen)
app.get("/admin", (req, res) => {
    db.all("SELECT * FROM messages", (err, rows) => {
        let html = "<h1>Admin Panel 📊</h1><a href='/'>Home</a><hr>";

        rows.forEach(row => {
            html += `
                <div style="margin:10px;padding:10px;border:1px solid #ccc;">
                    <b>Name:</b> ${row.name} <br>
                    <b>Email:</b> ${row.email} <br>
                    <b>Message:</b> ${row.message}
                </div>
            `;
        });

        res.send(html);
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port " + PORT);
});