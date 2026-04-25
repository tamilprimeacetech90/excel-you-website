const express = require("express");
const router = express.Router();

const Subject = require("../models/Subject");
const Topic = require("../models/Topic");

//
// 📚 GET ALL SUBJECTS
//
router.get("/admin/subjects", async (req, res) => {
    try {
        const subjects = await Subject.find().sort({ createdAt: -1 });
        res.json(subjects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//
// 📖 GET TOPICS BY SUBJECT
//
router.get("/admin/topics/:subjectId", async (req, res) => {
    try {
        const topics = await Topic.find({ subjectId: req.params.subjectId });
        res.json(topics);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//
// 👀 GET SINGLE TOPIC (STUDENT PREVIEW)
//
router.get("/topic/:id", async (req, res) => {
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

module.exports = router;