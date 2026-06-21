const mongoose = require("mongoose");


// =========================
// CONTENT BLOCK SCHEMA
// =========================
const contentBlockSchema = new mongoose.Schema({

    type: {
        type: String,

        enum: [
            "text",
            "image",
            "video",
            "heading"
        ],

        required: true
    },

    value: {
        type: String,
        default: ""
    }

}, { _id: false });


// =========================
// TOPIC SCHEMA
// =========================
const topicSchema = new mongoose.Schema({

    // =====================
    // TITLE
    // =====================
    title: {
        type: String,
        required: true,
        trim: true
    },

    // =====================
    // SUBJECT
    // =====================
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true
    },

    // =====================
    // LANGUAGE
    // =====================
    language: {
        type: String,

        enum: ["en", "ta"],

        default: "en"
    },

    // =====================
    // OLD BLOCK SYSTEM
    // =====================
    contentBlocks: {
        type: [contentBlockSchema],
        default: []
    },

    // =====================
    // NEW RICH TEXT HTML
    // =====================
    contentHTML: {
        type: String,
        default: ""
    },

    // =====================
    // VISIBILITY
    // =====================
    visibility: {
        type: String,

        enum: [
            "private",
            "public"
        ],

        default: "private"
    },

    // =====================
    // TIMESTAMPS
    // =====================
    updatedAt: {
        type: Date,
        default: Date.now
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});


// =========================
// AUTO UPDATE TIME
// =========================
topicSchema.pre("save", function(next) {

    this.updatedAt = Date.now();

    next();
});


// =========================
// EXPORT
// =========================
module.exports = mongoose.model(
    "Topic",
    topicSchema
);