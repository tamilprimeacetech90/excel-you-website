const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,

    language: {
        type: String,
        enum: ["en", "ta"],
        default: "en"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Subject", subjectSchema);