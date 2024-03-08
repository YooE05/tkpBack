const SchUserPersonalData = require('../Models/Schemas/schuserpersonaldata')

const FormatUtils = require('../formatutils')
const LeaderBoardUser = require('../Models/Contracts/leaderboarduser')
const UserProgress = require('../Models/Contracts/userprogress')

const servGetProgress = async (reqUsername) => {

    return await SchUserPersonalData.findOne({ username: reqUsername })
}
const servUpdateProgress = async (progressData, req) => 
    {
        let newPogressData = new UserProgress( req.body.points,
            req.body.crntLvl,
            req.body.timeStamp)   

        progressData.$inc('points', newPogressData.points)
        progressData.crntLvl = newPogressData.crntLvl 
        progressData.timeStamp = new FormatUtils().FormatStringToSeconds(newPogressData.timeStamp)

        return await progressData.save()
    } 


const servGetPersonals = async () => {
        //из базы берутся все пользователи, найти способ брать индекс пришедшего массива элементов
        return await SchUserPersonalData.find({}).sort({ points: -1,  timeStamp: 1})
}

const servGetTop10 = async () => 
{ 
    return await SchUserPersonalData.find({}).sort({ points: -1,  timeStamp: 1}).limit(10)
}


const servGenerateLeaderboard = async (username, userPersonalAll, userPersonalTop) => 
    {
        let leaderboard = []

        for(let i=0;i<userPersonalAll.length;i++)
        {   
            if(userPersonalAll[i].username==username)
            {
            
                const newLeader = new LeaderBoardUser(userPersonalAll[i].name,  userPersonalAll[i].surname,  userPersonalAll[i].points, i)
                leaderboard.push(newLeader)

                i=userPersonalAll.length
            }      
        }   

        for(let i=0;i<userPersonalTop.length;i++)
        {
            const newLeader = new LeaderBoardUser(userPersonalTop[i].name,  userPersonalTop[i].surname,  userPersonalTop[i].points, i)
            leaderboard.push(newLeader)
        }

        return leaderboard
    }


module.exports = {
    servGetProgress,
    servUpdateProgress,
    servGenerateLeaderboard,
    servGetTop10,
    servGetPersonals
}