const express = require("express");

const router = express.Router();

const Subject =
    require("../models/Subject");

const Topic =
    require("../models/Topic");


// =========================
// 🔒 ADMIN CHECK
// =========================
function isAdmin(req, res, next) {

    if (req.session.adminId) {

        return next();

    }

    return res.status(401).json({

        error: "Unauthorized"

    });

}


// =========================
// 📚 GET ALL SUBJECTS (ADMIN)
// =========================
router.get(
    "/admin/subjects",
    isAdmin,
    async (req, res) => {

        try {

            const subjects =
                await Subject.find()
                .sort({
                    createdAt: -1
                });

            res.json(subjects);

        } catch (err) {

            res.status(500).json({

                error: err.message

            });

        }

    }
);


// =========================
// 📖 GET TOPICS BY SUBJECT (ADMIN)
// =========================
router.get(
    "/admin/topics/:subjectId",
    isAdmin,
    async (req, res) => {

        try {

            const topics =
                await Topic.find({

                    subjectId:
                        req.params.subjectId

                })
                .sort({
                    updatedAt: -1
                });

            res.json(topics);

        } catch (err) {

            res.status(500).json({

                error: err.message

            });

        }

    }
);


// =========================
// 👀 GET SINGLE TOPIC (STUDENT)
// =========================
router.get(
    "/topic/:id",
    async (req, res) => {

        try {

            const topic =
                await Topic.findOne({

                    _id:
                        req.params.id,

                    visibility:
                        "public"

                });

            if (!topic) {

                return res.status(404).json({

                    error:
                        "Topic not found"

                });

            }

            res.json(topic);

        } catch (err) {

            res.status(500).json({

                error: err.message

            });

        }

    }
);


// =========================
// 📚 GET PUBLIC SUBJECTS
// =========================
router.get(
    "/subjects",
    async (req, res) => {

        try {

            const subjects =
                await Subject.find()
                .sort({
                    createdAt: -1
                });

            res.json(subjects);

        } catch (err) {

            res.status(500).json({

                error: err.message

            });

        }

    }
);


// =========================
// 📖 GET PUBLIC TOPICS
// =========================
router.get(
    "/topics/:subjectId",
    async (req, res) => {

        try {

            const topics =
                await Topic.find({

                    subjectId:
                        req.params.subjectId,

                    visibility:
                        "public"

                })
                .sort({
                    updatedAt: -1
                });

            res.json(topics);

        } catch (err) {

            res.status(500).json({

                error: err.message

            });

        }

    }
);


// =========================
// 🏠 HOMEPAGE API
// =========================
router.get(
    "/homepage",
    async (req, res) => {

        try {

            // SUBJECTS
            const subjects =
                await Subject.find()
                .sort({
                    createdAt: -1
                })
                .limit(6);

            // LATEST PUBLIC TOPICS
            const latestTopics =
                await Topic.find({

                    visibility:
                        "public"

                })
                .sort({
                    updatedAt: -1
                })
                .limit(6);

            // STATS
            const totalSubjects =
                await Subject.countDocuments();

            const totalTopics =
                await Topic.countDocuments({

                    visibility:
                        "public"

                });

            // RESPONSE
            res.json({

                subjects,

                latestTopics,

                stats: {

                    totalSubjects,

                    totalTopics

                }

            });

        } catch (err) {

            console.error(err);

            res.status(500).json({

                error:
                    "Failed to load homepage"

            });

        }

    }
);


module.exports = router;