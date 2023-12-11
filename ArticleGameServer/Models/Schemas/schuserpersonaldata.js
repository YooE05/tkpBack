const mongoose = require('mongoose')


const SchUserPersonalData = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        surname: { type: String, required: true},
        points: { type: Number, default: 0 },
        crntLvl: { type: Number, default: 0 },
        timeStamp: { type: Number, required: true }
    }
)

module.exports = mongoose.model("UserPersonalData", SchUserPersonalData)