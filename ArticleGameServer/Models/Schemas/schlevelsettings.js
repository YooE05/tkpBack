const mongoose = require('mongoose')


const SchLevelSettings = new mongoose.Schema(
    {
        levelNum: { type: Number, required: true },
        easyTasksCnt: { type: Number, default: 0  },
        mediumTasksCnt: { type: Number, default: 0 },
        hardTasksCnt: { type: Number, default: 0  }
    }
)

module.exports = mongoose.model("Level", SchLevelSettings)