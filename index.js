const express = require("express");
const router = express.Router();

const Subject = require("./models/Subject");
const Topic = require("./models/Topic");
const path = require("path");


// =========================
// 🔒 ADMIN MIDDLEWARE
// =========================
function isAdmin(req, res, next) {

    if (req.session.adminId) {
        return next();
    }

    return res.redirect("/login");
}


// =========================
// 🏠 ADMIN PAGE
// FINAL URL => /api/admin
// =========================
router.get("/", isAdmin, (req, res) => {

    res.sendFile(
        path.join(__dirname, "../public", "admin.html")
    );

});


// =========================
// 📘 CREATE SUBJECT
// =========================
router.post("/subject", isAdmin, async (req, res) => {

    try {

        const {
            name,
            description,
            language
        } = req.body;

        if (!name) {

            return res.status(400).json({
                error: "Subject name required"
            });
        }

        const subject = await Subject.create({

            name,
            description,
            language,

            createdAt: Date.now()

        });

        res.json(subject);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
});


// =========================
// 📚 GET SUBJECTS
// =========================
router.get("/subjects", isAdmin, async (req, res) => {

    try {

        const subjects = await Subject.find()
            .sort({ createdAt: -1 });

        res.json(subjects);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
});


// =========================
// 📖 GET TOPICS BY SUBJECT
// =========================
router.get("/topics/:subjectId", isAdmin, async (req, res) => {

    try {

        const topics = await Topic.find({
            subjectId: req.params.subjectId
        }).sort({ updatedAt: -1 });

        res.json(topics);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
});


// =========================
// 📖 CREATE TOPIC
// =========================
router.post("/topic", isAdmin, async (req, res) => {

    try {

        const {
            title,
            subjectId,
            language
        } = req.body;

        if (!title || !subjectId) {

            return res.status(400).json({
                error: "Title and Subject ID required"
            });
        }

        const topic = await Topic.create({

            title,
            subjectId,
            language,

            visibility: "private",

            contentBlocks: [],

            contentHTML: "",

            createdAt: Date.now(),
            updatedAt: Date.now()

        });

        res.json(topic);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
});


// =========================
// 👀 GET SINGLE TOPIC
// =========================
router.get("/topic/:id", isAdmin, async (req, res) => {

    try {

        const topic = await Topic.findById(req.params.id);

        if (!topic) {

            return res.status(404).json({
                error: "Topic not found"
            });
        }

        res.json(topic);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
});


// =========================
// ✏️ UPDATE TOPIC
// =========================
router.put("/topic/:id", isAdmin, async (req, res) => {

    try {

        const updateData = {

            updatedAt: Date.now()

        };

        // HTML CONTENT
        if (req.body.contentHTML !== undefined) {

            updateData.contentHTML =
                req.body.contentHTML;
        }

        // CONTENT BLOCKS
        if (req.body.contentBlocks !== undefined) {

            updateData.contentBlocks =
                req.body.contentBlocks;
        }

        // TITLE
        if (req.body.title !== undefined) {

            updateData.title =
                req.body.title;
        }

        const updated =
            await Topic.findByIdAndUpdate(

                req.params.id,

                updateData,

                { new: true }

            );

        if (!updated) {

            return res.status(404).json({
                error: "Topic not found"
            });
        }

        res.json(updated);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
});


// =========================
// 🚀 PUBLISH TOPIC
// =========================
router.post("/topic/publish/:id", isAdmin, async (req, res) => {

    try {

        const topic =
            await Topic.findByIdAndUpdate(

                req.params.id,

                {
                    visibility: "public",
                    updatedAt: Date.now()
                },

                { new: true }
            );

        if (!topic) {

            return res.status(404).json({
                error: "Topic not found"
            });
        }

        res.json(topic);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
});


// =========================
// 🔒 UNPUBLISH TOPIC
// =========================
router.post("/topic/unpublish/:id", isAdmin, async (req, res) => {

    try {

        const topic =
            await Topic.findByIdAndUpdate(

                req.params.id,

                {
                    visibility: "private",
                    updatedAt: Date.now()
                },

                { new: true }
            );

        if (!topic) {

            return res.status(404).json({
                error: "Topic not found"
            });
        }

        res.json(topic);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
});


// =========================
// 🗑️ DELETE SUBJECT
// =========================
router.delete("/subject/:id", isAdmin, async (req, res) => {

    try {

        await Subject.findByIdAndDelete(
            req.params.id
        );

        await Topic.deleteMany({
            subjectId: req.params.id
        });

        res.json({
            message: "Subject + Topics deleted ✔"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
});


// =========================
// 🗑️ DELETE TOPIC
// =========================
router.delete("/topic/:id", isAdmin, async (req, res) => {

    try {

        await Topic.findByIdAndDelete(
            req.params.id
        );

        res.json({
            message: "Topic deleted ✔"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
});


// =========================
// 📊 DASHBOARD STATS
// =========================
router.get("/stats", isAdmin, async (req, res) => {

    try {

        const subjects =
            await Subject.countDocuments();

        const topics =
            await Topic.countDocuments();

        const published =
            await Topic.countDocuments({
                visibility: "public"
            });

        const drafts =
            await Topic.countDocuments({
                visibility: "private"
            });

        res.json({

            subjects,
            topics,
            published,
            drafts

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
});


// =========================
// 📰 GET POSTS
// =========================
router.get("/posts", isAdmin, async (req, res) => {

    try {

        const filter = {};

        // SUBJECT FILTER
        if (req.query.subjectId) {

            filter.subjectId =
                req.query.subjectId;
        }

        // VISIBILITY FILTER
        if (req.query.visibility) {

            filter.visibility =
                req.query.visibility;
        }

        const posts = await Topic.find(filter)

            .populate("subjectId")

            .sort({
                updatedAt: -1
            });

        res.json(posts);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
});


module.exports = router;