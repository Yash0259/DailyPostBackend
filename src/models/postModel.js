const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: false }  // Store image path as a string
});

module.exports = mongoose.model("Post", postSchema);
