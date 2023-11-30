const mongoose = require('mongoose')


const SchTask = new mongoose.Schema(
    {
        difficulty: { type: String, required: true},
        firstPhrase: { type: String, default: ""},
        phrases: { type: [String], required: true},
        articlesCount: { type: Number, required: true },
        articles: { type: [String], required: true}
    }
)

module.exports = mongoose.model("Task", SchTask)