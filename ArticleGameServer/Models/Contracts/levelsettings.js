class LevelSettings {
    constructor(levelNum, easyTaskCnt, mediumTaskCnt, hardTaskCnt)
    {
        this.levelNum = levelNum;
        this.easyTaskCnt=easyTaskCnt;
        this.mediumTaskCnt=mediumTaskCnt;
        this.hardTaskCnt=hardTaskCnt;
    }
}

module.exports = LevelSettings;