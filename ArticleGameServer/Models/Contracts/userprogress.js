class UserProgress {
    constructor(username, points, crntLvl,timeStamp)
    {
        this.username = username;
        this.points=points;
        this.crntLvl=crntLvl;
        this.timeStamp = timeStamp;
    }
}

module.exports = UserProgress;