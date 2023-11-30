const mongoose = require('mongoose')


const SchLevelSettings = new mongoose.Schema(
    {
        levelNum: { type: Number, required: true },
        easyTaskCnt: { type: Number, default: 0  },
        mediumTaskCnt: { type: Number, default: 0 },
        hardTaskCnt: { type: Number, default: 0  }
    }
)

module.exports = mongoose.model("Level", SchLevelSettings)