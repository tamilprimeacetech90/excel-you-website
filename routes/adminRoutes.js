const express = require("express");
const router = express.Router();

const Subject = require("../models/Subject");
const Topic = require("../models/Topic");

// 🔒 Admin middleware
function isAdmin(req, res, next) {
    if (req.session.adminId) {
        return next();
    }
    return res.redirect("/Login.html"); // or send 401 if API
}
// ✅ Protected route
const path = require("path");

router.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "admin.html"));
});

// 📘 CREATE SUBJECT
//
router.post("/subject", isAdmin, async (req, res) => {
    try {
        const { name, description, language } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Subject name required" });
        }

        const subject = await Subject.create({
            name,
            description,
            language
        });

        res.json(subject);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//
// 📚 GET ALL TOPICS BY SUBJECT (LMS TREE)
//
router.get("/topics/:subjectId", isAdmin, async (req, res) => {
    try {
        const topics = await Topic.find({ subjectId: req.params.subjectId });
        res.json(topics);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//
// 🗑️ DELETE SUBJECT + CASCADE TOPICS
//
router.delete("/subject/:id", isAdmin, async (req, res) => {
    try {
        await Subject.findByIdAndDelete(req.params.id);
        await Topic.deleteMany({ subjectId: req.params.id });

        res.json({ message: "Subject + Topics deleted ✔" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//
// 📖 CREATE TOPIC
//
router.post("/topic", isAdmin, async (req, res) => {
    try {
        const { title, subjectId, language } = req.body;

        if (!title || !subjectId) {
            return res.status(400).json({ error: "Title and Subject ID required" });
        }

        const topic = await Topic.create({
            title,
            subjectId,
            language,
            contentBlocks: []
        });

        res.json(topic);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//
// 👀 GET SINGLE TOPIC (STUDENT PREVIEW)
//
router.get("/topic/:id", isAdmin, async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id);

        if (!topic) {
            return res.status(404).json({ error: "Topic not found" });
        }

        res.json(topic);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//
// 🧱 ADD CONTENT BLOCK
//
router.post("/topic/:id/block", isAdmin, async (req, res) => {
    try {
        const { type, value } = req.body;

        const topic = await Topic.findById(req.params.id);

        if (!topic) {
            return res.status(404).json({ error: "Topic not found" });
        }

        if (!topic.contentBlocks) {
            topic.contentBlocks = [];
        }

        topic.contentBlocks.push({ type, value });

        await topic.save();

        res.json(topic);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//
// ✏️ UPDATE TOPIC
//
router.put("/topic/:id", isAdmin, async (req, res) => {
    try {
        const updated = await Topic.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: "Topic not found" });
        }

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//
// 🗑️ DELETE TOPIC
//
router.delete("/topic/:id", isAdmin, async (req, res) => {
    try {
        await Topic.findByIdAndDelete(req.params.id);
        res.json({ message: "Topic deleted ✔" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get("/stats", async (req, res) => {
    const subjects = await Subject.countDocuments();
    const topics = await Topic.countDocuments();

    res.json({
        subjects,
        topics
    });
});
module.exports = router;