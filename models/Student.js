const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    gender: {
        type: String,
        default: ""
    },

    learningPath: {
        type: String,
        default: ""
    },

    rank: {
        type: String,
        default: "Beginner"
    },

    xp: {
        type: Number,
        default: 0
    },

    avatar: {
        type: String,
        default: "/assets/avatars/male-beginner.png"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "Student",
    studentSchema
);