
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://tamilprimeacetech90:adhiyeTHUNAI@90+++@cluster0.xezkqea.mongodb.net/excelyou?retryWrites=true&w=majority")
.then(() => console.log("MongoDB Connected ✔"))
.catch(err => console.log(err));


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

app.post("/contact", (req, res) => {
    res.send("<h1>Message Received 👍</h1><a href='/'>Go Back</a>");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port " + PORT);
});