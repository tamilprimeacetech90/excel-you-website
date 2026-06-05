const express = require("express");
const router = express.Router();

const Student =
    require("../models/Student");

// ======================
// SIGNUP
// ======================

router.post("/signup", async (req, res) => {

    try {

        const {
            username,
            email,
            password,
            gender,
            learningPath
        } = req.body;

        const existingStudent =
            await Student.findOne({
                email
            });

        if (existingStudent) {

            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });

        }

 const avatar =

    gender === "female"

        ? "/assets/avatars/female-beginner.png"

        : "/assets/avatars/male-beginner.png";

        const student =
             new Student({
             username,
             email,
             password,
             gender,
              learningPath,
             avatar
          });

        await student.save();

        res.json({
            success: true,
            message: "Account created successfully"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

});

// ======================
// LOGIN
// ======================

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        const student =
            await Student.findOne({
                email
            });

        if (!student) {

            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });

        }

        if (student.password !== password) {

            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });

        }

        res.json({
            success: true,
            student
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

});

module.exports = router;