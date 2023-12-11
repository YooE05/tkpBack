class LevelSettings {
    constructor(levelNum, easyTaskCnt, mediumTaskCnt, hardTaskCnt)
    {
        this.levelNum = levelNum;
        this.easyTasksCnt=easyTaskCnt;
        this.mediumTasksCnt=mediumTaskCnt;
        this.hardTasksCnt=hardTaskCnt;
    }
}

module.exports = LevelSettings;