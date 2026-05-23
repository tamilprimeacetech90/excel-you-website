const express = require("express");
const router = express.Router();

const Subject = require("../models/Subject");
const Topic = require("../models/Topic");
const path = require("path");

// =========================
// 🔒 ADMIN AUTH
// =========================
function isAdmin(req, res, next) {
    if (req.session.adminId) {
        return next();
    }
    return res.redirect("/login");
}

// =========================
// 🏠 ADMIN DASHBOARD
// =========================
router.get("/", isAdmin, (req, res) => {
    res.sendFile(
        path.join(__dirname, "../public/admin/admindashboard.html")
    );
});

// =========================
// 📘 CREATE SUBJECT
// =========================
router.post("/subject", isAdmin, async (req, res) => {
    try {
        const { name, description, language } = req.body;

        if (!name?.trim()) {
            return res.status(400).json({ error: "Subject name required" });
        }

        const subject = await Subject.create({
            name: name.trim(),
            description: description || "",
            language: language || "en",
            createdAt: Date.now()
        });

        res.json(subject);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// =========================
// 📚 GET SUBJECTS
// =========================
router.get("/subjects", isAdmin, async (req, res) => {
    try {
        const subjects = await Subject.find().sort({ createdAt: -1 });
        res.json(subjects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// =========================
// 📖 CREATE TOPIC
// =========================
router.post("/topic", isAdmin, async (req, res) => {
    try {
        const { title, subjectId, language } = req.body;

        if (!title?.trim() || !subjectId) {
            return res.status(400).json({ error: "Title and Subject required" });
        }

        const topic = await Topic.create({
            title: title.trim(),
            subjectId,
            language: language || "en",
            visibility: "private",
            contentBlocks: [],
            contentHTML: "",
            createdAt: Date.now(),
            updatedAt: Date.now()
        });

        res.json(topic);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// =========================
// 📊 STATS
// =========================
router.get("/stats", isAdmin, async (req, res) => {
    try {
        const subjects = await Subject.countDocuments();
        const topics = await Topic.countDocuments();
        const published = await Topic.countDocuments({ visibility: "public" });
        const drafts = await Topic.countDocuments({ visibility: "private" });

        res.json({ subjects, topics, published, drafts });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;