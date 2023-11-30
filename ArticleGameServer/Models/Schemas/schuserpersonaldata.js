const mongoose = require('mongoose')


const SchUserPersonalData = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        surname: { type: String, required: true},
        points: { type: Number, default: 0 },
        crntlvl: { type: Number, default: 0 },
        date: { type: String, required: true }
    }
)

module.exports = mongoose.model("UserPersonalData", SchUserPersonalData)