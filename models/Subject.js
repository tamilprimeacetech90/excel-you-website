const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({

    // =========================
    // SUBJECT NAME
    // =========================

    name: {

        type: String,

        required: true,

        trim: true

    },

    // =========================
    // SUBJECT DESCRIPTION
    // =========================

    description: {

        type: String,

        default: ""

    },

    // =========================
    // SUBJECT IMAGE
    // =========================

    image: {

        type: String,

        default: ""

    },

    // =========================
    // LANGUAGE
    // =========================

    language: {

        type: String,

        enum: ["en", "ta"],

        default: "en"

    },

    // =========================
    // CREATED DATE
    // =========================

    createdAt: {

        type: Date,

        default: Date.now

    }

});

module.exports =
    mongoose.model(
        "Subject",
        subjectSchema
    );