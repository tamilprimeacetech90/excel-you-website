const express = require("express");
const router = express.Router();

const Student =
    require("../models/Student");
const passport = require("passport");

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

//=====================
 //GOOGLE
//======================
router.get(
    "/auth/google",
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })
);

router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/student"
    }),
    (req, res) => {

        req.session.studentId = req.user._id;

        res.redirect(
            "/student-dashboard.html"
        );
    }
);

//=====================
 //GitHub
//======================

router.get(
    "/auth/github",
    passport.authenticate("github", {
        scope: ["user:email"]
    })
);

router.get(
    "/auth/github/callback",
    passport.authenticate("github", {
        failureRedirect: "/student"
    }),
    (req, res) => {

        req.session.studentId = req.user._id;

        res.redirect(
            "/student-dashboard.html"
        );
    }
);

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