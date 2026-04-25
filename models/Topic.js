const mongoose = require("mongoose");

const contentBlockSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["text", "image", "video", "heading"],
        required: true
    },
    value: String
}, { _id: false });

const topicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true
    },

    language: {
        type: String,
        enum: ["en", "ta"],
        default: "en"
    },

    contentBlocks: [contentBlockSchema],

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Topic", topicSchema);