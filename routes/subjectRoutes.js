const express = require("express");

const router = express.Router();

const Subject =
    require("../models/Subject");

const Topic =
    require("../models/Topic");


// =========================
// GET SUBJECTS
// =========================

router.get(
    "/subjects",
    async (req, res) => {

        try {

            const subjects =
                await Subject.find();

            res.json(subjects);

        } catch(err){

            console.error(err);

            res.status(500).json({
                error: "Server Error"
            });

        }

    }
);


// =========================
// GET TOPICS
// =========================

router.get(
    "/topics/:subjectId",
    async (req, res) => {

        try {

            const topics =
                await Topic.find({

                    subject:
                        req.params.subjectId

                });

            res.json(topics);

        } catch(err){

            console.error(err);

            res.status(500).json({
                error: "Server Error"
            });

        }

    }
);


// =========================
// GET SINGLE TOPIC
// =========================

router.get(
    "/topic/:topicId",
    async (req, res) => {

        try {

            const topic =
                await Topic.findById(
                    req.params.topicId
                );

            res.json(topic);

        } catch(err){

            console.error(err);

            res.status(500).json({
                error: "Server Error"
            });

        }

    }
);

module.exports = router;